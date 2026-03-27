import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  username: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string, name: string) => Promise<{ user: User | null; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>
  changePassword: (newPassword: string) => Promise<{ success: boolean; error: string | null }>
  error: string | null
  isAuthenticated: boolean
  isGuest: boolean
  continueAsGuest: () => void
  logout: () => void
  // Backward compat
  login: (email: string, name: string) => void
  signup: (email: string, name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGuest, setIsGuest] = useState(false)

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize auth')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error: err } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (err && err.code !== 'PGRST116') throw err
      if (data) setUserProfile(data)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
    }
  }

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error: err } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1)

      if (err && err.code !== 'PGRST116') throw err
      return data && data.length > 0
    } catch {
      return false
    }
  }

  const signUp = async (
    email: string,
    password: string,
    username: string,
    name: string
  ): Promise<{ user: User | null; error: string | null }> => {
    try {
      setError(null)

      // Validate inputs
      if (!email || !password || !username || !name) {
        const msg = 'All fields are required'
        setError(msg)
        return { user: null, error: msg }
      }

      // Check if email already exists
      const emailExists = await checkEmailExists(email)
      if (emailExists) {
        const msg = 'Email already registered. Please use a different email or try signing in.'
        setError(msg)
        return { user: null, error: msg }
      }

      // Check if username is taken
      const { data: userExists } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .limit(1)

      if (userExists && userExists.length > 0) {
        const msg = 'Username already taken. Please choose another.'
        setError(msg)
        return { user: null, error: msg }
      }

      // Create auth user with autoConfirm enabled (skip email confirmation)
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            username: username.toLowerCase(),
            name,
          },
        },
      })

      if (signUpError) {
        const errorMsg = signUpError.message || 'Failed to create account'
        setError(errorMsg)
        return { user: null, error: errorMsg }
      }

      if (newUser) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: newUser.id,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          const errorMsg = profileError.message || 'Failed to create user profile'
          setError(errorMsg)
          return { user: null, error: errorMsg }
        }

        return { user: newUser, error: null }
      }

      const msg = 'Signup failed - no user returned'
      setError(msg)
      return { user: null, error: msg }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      console.error('Signup error:', err)
      return { user: null, error: message }
    }
  }

  const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      setError(null)

      // Validate inputs
      if (!email || !password) {
        const msg = 'Email and password are required'
        setError(msg)
        return { user: null, error: msg }
      }

      // First check if the user exists in the database
      const { data: userExists } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1)

      if (!userExists || userExists.length === 0) {
        const msg = 'No account found with this email. Please sign up first.'
        setError(msg)
        return { user: null, error: msg }
      }

      // Try to sign in
      const { data: { user: signedInUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Provide more specific error messages
        if (signInError.message.includes('Invalid login credentials')) {
          const msg = 'Invalid email or password'
          setError(msg)
          return { user: null, error: msg }
        }
        throw signInError
      }

      if (signedInUser) {
        await fetchUserProfile(signedInUser.id)
        return { user: signedInUser, error: null }
      }

      const msg = 'Sign in failed - no user returned'
      setError(msg)
      return { user: null, error: msg }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setError(message)
      console.error('Sign in error:', err)
      return { user: null, error: message }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      setUserProfile(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      setError(message)
      throw err
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error: string | null }> => {
    try {
      if (!user) throw new Error('Not authenticated')
      setError(null)

      // Check if new email is already taken (if email is being updated)
      if (updates.email && updates.email !== userProfile?.email) {
        const emailExists = await checkEmailExists(updates.email)
        if (emailExists) {
          const msg = 'Email already in use'
          setError(msg)
          return { success: false, error: msg }
        }
      }

      // Check if new username is taken (if username is being updated)
      if (updates.username && updates.username !== userProfile?.username) {
        const { data: usernameExists } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', updates.username.toLowerCase())
          .limit(1)

        if (usernameExists && usernameExists.length > 0) {
          const msg = 'Username already taken'
          setError(msg)
          return { success: false, error: msg }
        }
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          username: updates.username ? updates.username.toLowerCase() : undefined,
          email: updates.email ? updates.email.toLowerCase() : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update email in auth if needed
      if (updates.email && updates.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: updates.email,
        })
        if (emailError) throw emailError
      }

      await fetchUserProfile(user.id)
      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      if (!user) throw new Error('Not authenticated')
      setError(null)

      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (passwordError) throw passwordError
      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password change failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setUser(null)
    setUserProfile(null)
    setIsGuest(false)
  }

  const continueAsGuest = () => {
    setUser(null)
    setIsGuest(true)
  }

  // Backward compatibility (kept for old code, but should use signUp/signIn instead)
  const login = (email: string, name: string) => {
    console.warn('Using deprecated login() function. Use signIn() instead.')
    throw new Error('Use signIn() with email and password instead')
  }

  const signup = (email: string, name: string) => {
    console.warn('Using deprecated signup() function. Use signUp() instead.')
    throw new Error('Use signUp() with email, password, username, and name instead')
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      changePassword,
      error,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      continueAsGuest,
      isGuest,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

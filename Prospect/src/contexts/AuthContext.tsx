import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('prospect_sa_user', null);
  const [isGuest, setIsGuest] = useLocalStorage<boolean>('prospect_sa_is_guest', false);

  const login = (email: string, name: string) => {
    // Dummy login: just set the user in localStorage
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'student',
    });
    setIsGuest(false);
  };

  const signup = (email: string, name: string) => {
    // Dummy signup: same as login for now
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'student',
    });
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, continueAsGuest, isAuthenticated, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

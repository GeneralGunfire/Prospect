import { supabase } from './supabase'

// ============================================
// TYPES
// ============================================

export interface QuizResult {
  id: string
  user_id: string
  quiz_type: string
  answers: Record<string, any>
  results: Record<string, any>
  score?: number
  recommended_careers?: string[]
  completed_at: string
  created_at: string
  updated_at: string
}

export interface APSScore {
  id: string
  user_id: string
  subjects: Record<string, number>
  total_aps?: number
  calculated_at: string
  created_at: string
  updated_at: string
}

export interface SavedCareer {
  id: string
  user_id: string
  career_id: string
  career_name: string
  career_data?: Record<string, any>
  notes?: string
  bookmarked_at: string
  created_at: string
}

export interface SavedBursary {
  id: string
  user_id: string
  bursary_id: string
  bursary_name: string
  bursary_data?: Record<string, any>
  notes?: string
  bookmarked_at: string
  created_at: string
}

export interface Career {
  id: string
  title: string
  category?: string
  description?: string
  salary_range?: string
  job_growth?: string
  required_subjects?: string[]
  minimum_aps?: number
  education_level?: string
  universities?: string[]
  bursaries?: string[]
  riasec_codes?: string
  data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Bursary {
  id: string
  name: string
  provider?: string
  description?: string
  amount?: string
  eligibility_criteria?: string
  application_deadline?: string
  required_subjects?: string[]
  minimum_aps?: number
  study_field?: string
  data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  category?: string
  description?: string
  is_aps_subject: boolean
  min_aps_points?: number
  created_at: string
}

// ============================================
// QUIZ RESULTS FUNCTIONS
// ============================================

export const quizService = {
  // Save quiz results
  async saveQuizResult(userId: string, quizType: string, answers: any, results: any, score?: number): Promise<QuizResult | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          quiz_type: quizType,
          answers,
          results,
          score,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error saving quiz result:', err)
      return null
    }
  },

  // Get user's quiz results
  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching quiz results:', err)
      return []
    }
  },

  // Get latest quiz result of a specific type
  async getLatestQuizResult(userId: string, quizType: string): Promise<QuizResult | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_type', quizType)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code === 'PGRST116') return null
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching latest quiz result:', err)
      return null
    }
  },
}

// ============================================
// APS SCORE FUNCTIONS
// ============================================

export const apsService = {
  // Save APS score
  async saveAPSScore(userId: string, subjects: Record<string, number>, totalAps: number): Promise<APSScore | null> {
    try {
      const { data, error } = await supabase
        .from('aps_scores')
        .insert({
          user_id: userId,
          subjects,
          total_aps: totalAps,
          calculated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error saving APS score:', err)
      return null
    }
  },

  // Get user's APS scores
  async getUserAPSScores(userId: string): Promise<APSScore[]> {
    try {
      const { data, error } = await supabase
        .from('aps_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching APS scores:', err)
      return []
    }
  },

  // Get latest APS score
  async getLatestAPSScore(userId: string): Promise<APSScore | null> {
    try {
      const { data, error } = await supabase
        .from('aps_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code === 'PGRST116') return null
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching latest APS score:', err)
      return null
    }
  },
}

// ============================================
// SAVED CAREERS FUNCTIONS
// ============================================

export const careerService = {
  // Save/bookmark a career
  async saveCareer(userId: string, careerId: string, careerName: string, careerData?: any, notes?: string): Promise<SavedCareer | null> {
    try {
      const { data, error } = await supabase
        .from('saved_careers')
        .insert({
          user_id: userId,
          career_id: careerId,
          career_name: careerName,
          career_data: careerData,
          notes,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error saving career:', err)
      return null
    }
  },

  // Get user's saved careers
  async getUserSavedCareers(userId: string): Promise<SavedCareer[]> {
    try {
      const { data, error } = await supabase
        .from('saved_careers')
        .select('*')
        .eq('user_id', userId)
        .order('bookmarked_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching saved careers:', err)
      return []
    }
  },

  // Check if career is saved
  async isCareerSaved(userId: string, careerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_careers')
        .select('id')
        .eq('user_id', userId)
        .eq('career_id', careerId)
        .limit(1)
        .single()

      if (error && error.code === 'PGRST116') return false
      if (error) throw error
      return !!data
    } catch (err) {
      console.error('Error checking if career is saved:', err)
      return false
    }
  },

  // Remove saved career
  async removeCareer(userId: string, careerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_careers')
        .delete()
        .eq('user_id', userId)
        .eq('career_id', careerId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error removing saved career:', err)
      return false
    }
  },

  // Update career notes
  async updateCareerNotes(userId: string, careerId: string, notes: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_careers')
        .update({ notes })
        .eq('user_id', userId)
        .eq('career_id', careerId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error updating career notes:', err)
      return false
    }
  },
}

// ============================================
// SAVED BURSARIES FUNCTIONS
// ============================================

export const bursaryService = {
  // Save/bookmark a bursary
  async saveBursary(userId: string, bursaryId: string, bursaryName: string, bursaryData?: any, notes?: string): Promise<SavedBursary | null> {
    try {
      const { data, error } = await supabase
        .from('saved_bursaries')
        .insert({
          user_id: userId,
          bursary_id: bursaryId,
          bursary_name: bursaryName,
          bursary_data: bursaryData,
          notes,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error saving bursary:', err)
      return null
    }
  },

  // Get user's saved bursaries
  async getUserSavedBursaries(userId: string): Promise<SavedBursary[]> {
    try {
      const { data, error } = await supabase
        .from('saved_bursaries')
        .select('*')
        .eq('user_id', userId)
        .order('bookmarked_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching saved bursaries:', err)
      return []
    }
  },

  // Check if bursary is saved
  async isBursarySaved(userId: string, bursaryId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_bursaries')
        .select('id')
        .eq('user_id', userId)
        .eq('bursary_id', bursaryId)
        .limit(1)
        .single()

      if (error && error.code === 'PGRST116') return false
      if (error) throw error
      return !!data
    } catch (err) {
      console.error('Error checking if bursary is saved:', err)
      return false
    }
  },

  // Remove saved bursary
  async removeBursary(userId: string, bursaryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_bursaries')
        .delete()
        .eq('user_id', userId)
        .eq('bursary_id', bursaryId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error removing saved bursary:', err)
      return false
    }
  },

  // Update bursary notes
  async updateBursaryNotes(userId: string, bursaryId: string, notes: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_bursaries')
        .update({ notes })
        .eq('user_id', userId)
        .eq('bursary_id', bursaryId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error updating bursary notes:', err)
      return false
    }
  },
}

// ============================================
// ACTIVITY LOG FUNCTIONS
// ============================================

export const activityService = {
  // Log user activity
  async logActivity(userId: string, action: string, resourceType?: string, resourceId?: string, details?: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: undefined, // Can be set from request context
          user_agent: navigator.userAgent,
        })

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error logging activity:', err)
      return false
    }
  },

  // Get user's activity logs
  async getUserActivityLogs(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching activity logs:', err)
      return []
    }
  },
}

// ============================================
// REFERENCE DATA FUNCTIONS
// ============================================

export const referenceService = {
  // Get all subjects
  async getSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching subjects:', err)
      return []
    }
  },

  // Get APS subjects only
  async getAPSSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_aps_subject', true)
        .order('name')

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching APS subjects:', err)
      return []
    }
  },

  // Get career by ID
  async getCareer(careerId: string): Promise<Career | null> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('id', careerId)
        .single()

      if (error && error.code === 'PGRST116') return null
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching career:', err)
      return null
    }
  },

  // Search careers
  async searchCareers(query: string): Promise<Career[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('title')

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error searching careers:', err)
      return []
    }
  },

  // Get bursary by ID
  async getBursary(bursaryId: string): Promise<Bursary | null> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .eq('id', bursaryId)
        .single()

      if (error && error.code === 'PGRST116') return null
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching bursary:', err)
      return null
    }
  },

  // Search bursaries
  async searchBursaries(query: string): Promise<Bursary[]> {
    try {
      const { data, error } = await supabase
        .from('bursaries')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,study_field.ilike.%${query}%`)
        .order('name')

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error searching bursaries:', err)
      return []
    }
  },
}

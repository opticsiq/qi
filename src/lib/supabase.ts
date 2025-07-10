import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our upload data
export interface Upload {
  id: string
  front_image: string
  back_image: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
  user_id?: string
}

export interface UploadFormData {
  front_image: string
  back_image: string
} 
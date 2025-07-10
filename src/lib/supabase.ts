import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qynkzdwkwcgexwetwurq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5bmt6ZHdrd2NnZXh3ZXR3dXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjMyODcsImV4cCI6MjA2NzU5OTI4N30.ZkEHYCVwbSvrtL6jSOv-oqJMjIpWghxk5ezLpI51G2Q'

// إنشاء عميل Supabase مع قيم افتراضية للتطوير
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// تحذير في وحدة التحكم إذا كانت القيم افتراضية
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ استخدام قيم Supabase الافتراضية للتطوير. قم بإعداد متغيرات البيئة الحقيقية للإنتاج.')
}

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
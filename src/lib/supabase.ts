import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://esieszjuycuqleyqqdkb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzaWVzemp1eWN1cWxleXFxZGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTY1NzMsImV4cCI6MjA4ODU5MjU3M30.t4dNKF8B-4Jt0LLF1LLb_uOhDZ0EewK8V9MkHl08A6c'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image: string
  created_at: string
}

export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  type: string
  is_online: boolean
  created_at: string
}

export interface Project {
  id: number
  name: string
  description: string
  link: string
  category: string
  created_at: string
}

export interface Resource {
  id: number
  title: string
  description: string
  link: string
  category: string
  icon: string
  created_at: string
}

export interface MembershipApplication {
  id: number
  first_name: string
  last_name: string
  email: string
  major: string
  areas_of_interest: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
} 
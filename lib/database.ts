import { supabase, TeamMember, Event, Project, Resource, MembershipApplication } from './supabase'
import { validateEmailDomain, getEmailDomainError } from './auth'

// Debug: Check Supabase configuration on module load
console.log('=== Database Module Debug ===')
console.log('Supabase client exists:', !!supabase)
console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('Environment variables:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
  keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
})

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('events').select('count').limit(1)
    console.log('Connection test result:', { data, error })
    return !error
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  return data || []
}

// Alias for compatibility
export const fetchTeamMembers = getTeamMembers

// Milestones
export async function fetchMilestones(): Promise<any[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('year', { ascending: true })

  if (error) {
    console.error('Error fetching milestones:', error)
    return []
  }

  return data || []
}

// Events
export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    // Debug: Check if Supabase client is properly configured
    if (!supabase) {
      console.error('Supabase client is not initialized')
      return []
    }

    // Test connection first
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      console.error('Supabase connection test failed')
      return []
    }

    // Debug: Log the environment variables (without exposing sensitive data)
    console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })
      .limit(4)

    if (error) {
      console.error('Error fetching events:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('relation "events" does not exist')) {
        console.error('Events table does not exist. Please run the database setup script.')
      }
      return []
    }

    console.log('Successfully fetched events:', data?.length || 0, 'events')
    return data || []
  } catch (err) {
    console.error('Unexpected error in getUpcomingEvents:', err)
    return []
  }
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching all events:', error)
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('relation "events" does not exist')) {
        console.error('Events table does not exist. Please run the database setup script.')
      }
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getAllEvents:', err)
    return []
  }
}

// Featured Event
export async function getFeaturedEvent(): Promise<Event | null> {
  try {
    // Debug: Check if Supabase client is properly configured
    if (!supabase) {
      console.error('Supabase client is not initialized')
      return null
    }

    // Test connection first
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      console.error('Supabase connection test failed')
      return null
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching featured event:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('relation "events" does not exist')) {
        console.error('Events table does not exist. Please run the database setup script.')
      }
      return null
    }

    console.log('Successfully fetched featured event:', data ? 'found' : 'not found')
    return data
  } catch (err) {
    console.error('Unexpected error in getFeaturedEvent:', err)
    return null
  }
}

// Projects
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all projects:', error)
    return []
  }

  return data || []
}

// Resources
export async function getResourcesByCategory(category: string): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }

  return data || []
}

export async function getAllResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all resources:', error)
    return []
  }

  return data || []
}

// Membership Applications
export async function submitMembershipApplication(application: {
  first_name: string
  last_name: string
  email: string
  major: string
  areas_of_interest: string
  technical_experience_level?: string
  goals?: string
  github_username?: string
  linkedin_url?: string
  phone?: string
  graduation_year?: string
  preferred_contact_method?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email domain
    if (!validateEmailDomain(application.email)) {
      return { success: false, error: getEmailDomainError() }
    }

    // Validate required fields
    if (!application.first_name || !application.last_name || !application.email || !application.major || !application.areas_of_interest) {
      return { success: false, error: 'Please fill in all required fields' }
    }

    // Create the base application data with only the columns that definitely exist
    const applicationData: any = {
      first_name: application.first_name,
      last_name: application.last_name,
      email: application.email,
      major: application.major,
      areas_of_interest: application.areas_of_interest,
      status: 'pending'
    }

    // Try to add optional columns if they exist
    if (application.technical_experience_level) {
      applicationData.technical_experience_level = application.technical_experience_level
    }
    if (application.goals) {
      applicationData.goals = application.goals
    }
    if (application.github_username) {
      applicationData.github_username = application.github_username
    }
    if (application.linkedin_url) {
      applicationData.linkedin_url = application.linkedin_url
    }
    if (application.phone) {
      applicationData.phone = application.phone
    }
    if (application.graduation_year) {
      applicationData.graduation_year = application.graduation_year
    }
    if (application.preferred_contact_method) {
      applicationData.preferred_contact_method = application.preferred_contact_method
    }

    const { error } = await supabase
      .from('membership_applications')
      .insert([applicationData])

    if (error) {
      console.error('Error submitting application:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error submitting application:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}



import { supabase, TeamMember, Event, Project, Resource, MembershipApplication } from './supabase'
import { validateEmailDomain, getEmailDomainError } from './auth'

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

// Events
export async function getUpcomingEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data || []
}

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching all events:', error)
    return []
  }

  return data || []
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
export async function submitMembershipApplication(application: Omit<MembershipApplication, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  // Validate email domain
  if (!validateEmailDomain(application.email)) {
    return { success: false, error: getEmailDomainError() }
  }

  const { error } = await supabase
    .from('membership_applications')
    .insert([{
      ...application,
      status: 'pending'
    }])

  if (error) {
    console.error('Error submitting application:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Featured Event
export async function getFeaturedEvent(): Promise<Event | null> {
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
    return null
  }

  return data
} 
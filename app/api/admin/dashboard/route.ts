import { NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Check if user is admin (this would be done via middleware in production)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      totalUsers: 0,
      totalEvents: 0,
      totalProjects: 0,
      totalResources: 0,
      totalTeamMembers: 0,
      recentActivity: [],
      databaseStatus: null
    }

    // Get total users
    try {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      results.totalUsers = userCount || 0
    } catch (error) {
      console.error('Error counting users:', error)
    }

    // Get total events
    try {
      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
      results.totalEvents = eventCount || 0
    } catch (error) {
      console.error('Error counting events:', error)
    }

    // Get total projects
    try {
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
      results.totalProjects = projectCount || 0
    } catch (error) {
      console.error('Error counting projects:', error)
    }

    // Get total resources
    try {
      const { count: resourceCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
      results.totalResources = resourceCount || 0
    } catch (error) {
      console.error('Error counting resources:', error)
    }

    // Get total team members
    try {
      const { count: teamCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
      results.totalTeamMembers = teamCount || 0
    } catch (error) {
      console.error('Error counting team members:', error)
    }

    // Get recent activity (last 10 items from various tables)
    try {
      const recentActivity = []
      
      // Recent events
      const { data: recentEvents } = await supabase
        .from('events')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentEvents) {
        recentEvents.forEach(event => {
          recentActivity.push({
            action: `Event "${event.title}" created`,
            time: new Date(event.created_at).toLocaleDateString(),
            type: 'Event'
          })
        })
      }

      // Recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentProjects) {
        recentProjects.forEach(project => {
          recentActivity.push({
            action: `Project "${project.name}" created`,
            time: new Date(project.created_at).toLocaleDateString(),
            type: 'Project'
          })
        })
      }

      // Recent resources
      const { data: recentResources } = await supabase
        .from('resources')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentResources) {
        recentResources.forEach(resource => {
          recentActivity.push({
            action: `Resource "${resource.title}" added`,
            time: new Date(resource.created_at).toLocaleDateString(),
            type: 'Resource'
          })
        })
      }

      results.recentActivity = recentActivity.slice(0, 10)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }

    // Check database status
    try {
      const { data: dbStatus } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true })
      
      results.databaseStatus = {
        status: dbStatus !== null ? 'healthy' : 'issues',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      results.databaseStatus = {
        status: 'issues',
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load admin dashboard data'
    })
  }
} 
import { supabase } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Check if user is admin (this would be done via middleware in production)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      totalUsers: 0,
      totalEvents: 0,
      totalProjects: 0,
      totalResources: 0,
      totalTeamMembers: 0,
      recentActivity: [],
      databaseStatus: null
    }

    // Get total users
    try {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      results.totalUsers = userCount || 0
    } catch (error) {
      console.error('Error counting users:', error)
    }

    // Get total events
    try {
      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
      results.totalEvents = eventCount || 0
    } catch (error) {
      console.error('Error counting events:', error)
    }

    // Get total projects
    try {
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
      results.totalProjects = projectCount || 0
    } catch (error) {
      console.error('Error counting projects:', error)
    }

    // Get total resources
    try {
      const { count: resourceCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
      results.totalResources = resourceCount || 0
    } catch (error) {
      console.error('Error counting resources:', error)
    }

    // Get total team members
    try {
      const { count: teamCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
      results.totalTeamMembers = teamCount || 0
    } catch (error) {
      console.error('Error counting team members:', error)
    }

    // Get recent activity (last 10 items from various tables)
    try {
      const recentActivity = []
      
      // Recent events
      const { data: recentEvents } = await supabase
        .from('events')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentEvents) {
        recentEvents.forEach(event => {
          recentActivity.push({
            action: `Event "${event.title}" created`,
            time: new Date(event.created_at).toLocaleDateString(),
            type: 'Event'
          })
        })
      }

      // Recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentProjects) {
        recentProjects.forEach(project => {
          recentActivity.push({
            action: `Project "${project.name}" created`,
            time: new Date(project.created_at).toLocaleDateString(),
            type: 'Project'
          })
        })
      }

      // Recent resources
      const { data: recentResources } = await supabase
        .from('resources')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentResources) {
        recentResources.forEach(resource => {
          recentActivity.push({
            action: `Resource "${resource.title}" added`,
            time: new Date(resource.created_at).toLocaleDateString(),
            type: 'Resource'
          })
        })
      }

      results.recentActivity = recentActivity.slice(0, 10)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }

    // Check database status
    try {
      const { data: dbStatus } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true })
      
      results.databaseStatus = {
        status: dbStatus !== null ? 'healthy' : 'issues',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      results.databaseStatus = {
        status: 'issues',
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load admin dashboard data'
    })
  }
} 
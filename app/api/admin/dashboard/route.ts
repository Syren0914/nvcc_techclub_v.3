import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No authorization header'
      })
    }

    // Verify the JWT token with Supabase
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        details: authError
      })
    }

    // Check if user exists in our users table and has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Admin access required'
      })
    }

    // Fetch dashboard statistics
    const [
      { count: totalUsers },
      { count: totalEvents },
      { count: totalProjects },
      { count: totalResources },
      { count: totalTeamMembers },
      { data: recentActivity }
    ] = await Promise.all([
      // Total users
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true }),
      
      // Total events
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true }),
      
      // Total projects
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      
      // Total resources
      supabase
        .from('resources')
        .select('*', { count: 'exact', head: true }),
      
      // Total team members (from membership applications with approved status)
      supabase
        .from('membership_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),
      
      // Recent activity (latest applications and project applications)
      supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Format recent activity
    const formattedActivity = recentActivity?.map((activity: any) => ({
      action: `New membership application from ${activity.name}`,
      time: new Date(activity.created_at).toLocaleDateString(),
      type: 'membership'
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalEvents: totalEvents || 0,
        totalProjects: totalProjects || 0,
        totalResources: totalResources || 0,
        totalTeamMembers: totalTeamMembers || 0,
        recentActivity: formattedActivity,
        databaseStatus: { status: 'healthy' }
      }
    })

  } catch (error) {
    console.error('Error in admin dashboard API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
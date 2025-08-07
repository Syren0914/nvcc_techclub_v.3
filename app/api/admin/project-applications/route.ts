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

    // Fetch all project applications with project details
    const { data: applications, error } = await supabase
      .from('project_applications')
      .select(`
        *,
        projects (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching project applications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: applications || []
    })

  } catch (error) {
    console.error('Error in project applications admin API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { application_id, status, admin_notes } = body

    if (!application_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update the application status
    const { data: updatedApplication, error } = await supabase
      .from('project_applications')
      .update({
        status,
        admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', application_id)
      .select(`
        *,
        projects (
          title
        )
      `)
      .single()

    if (error) {
      console.error('Error updating project application:', error)
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    // If approved, add user to project team members
    if (status === 'approved') {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('team_members')
        .eq('id', updatedApplication.project_id)
        .single()

      if (!projectError && projectData) {
        const currentTeamMembers = projectData.team_members || []
        const updatedTeamMembers = [...currentTeamMembers, updatedApplication.user_name]

        await supabase
          .from('projects')
          .update({
            team_members: updatedTeamMembers,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedApplication.project_id)
      }

      // Send email notification to user (you can implement this with your email service)
      console.log(`Application approved: ${updatedApplication.user_name} (${updatedApplication.user_email}) has been approved to join project "${updatedApplication.projects.title}"`)
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication
    })

  } catch (error) {
    console.error('Error in project applications admin API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


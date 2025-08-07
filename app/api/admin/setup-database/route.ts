import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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

    // Check if user has admin role (simple email-based check)
    if (user.email !== 'test@email.vccs.edu') {
      return NextResponse.json({
        success: false,
        error: 'Admin access required'
      })
    }

    // Check if tables exist
    const tableChecks = ['users', 'events', 'projects', 'resources', 'membership_applications']
    const tableStatus = {}
    const missingTables = []
    
    for (const table of tableChecks) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1)
        tableStatus[table] = { exists: !error, error: error?.message }
        if (error) {
          missingTables.push(table)
        }
      } catch (err) {
        tableStatus[table] = { exists: false, error: err.message }
        missingTables.push(table)
      }
    }

    const allTablesExist = missingTables.length === 0

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist 
        ? 'All database tables exist and are working correctly!' 
        : `Missing tables: ${missingTables.join(', ')}. Please run the SQL script in Supabase.`,
      tableStatus,
      missingTables
    })

  } catch (error) {
    console.error('Error in setup database API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

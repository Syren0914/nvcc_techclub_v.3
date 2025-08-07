import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        isAdmin: false,
        error: 'No authorization header'
      })
    }

    // Verify the JWT token with Supabase
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        isAdmin: false,
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

    if (userError) {
      return NextResponse.json({
        isAdmin: false,
        error: 'User not found in database',
        details: userError
      })
    }

    const isAdmin = userData?.role === 'admin'

    return NextResponse.json({
      isAdmin: isAdmin,
      user: {
        id: user.id,
        email: user.email,
        role: userData?.role
      }
    })
  } catch (error) {
    console.error('Error in check admin API:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

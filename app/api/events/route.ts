import { NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch events' })
    }

    return NextResponse.json({ success: true, data: events || [] })
  } catch (error) {
    console.error('Error in events GET:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' })
  }
}

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, start_date, end_date, start_time, end_time, location, event_type, max_attendees } = body

    if (!title || !start_date) {
      return NextResponse.json({ success: false, error: 'Title and start date are required' })
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        start_date,
        end_date,
        start_time,
        end_time,
        location: location || 'TBD',
        event_type: event_type || 'meeting',
        max_attendees: max_attendees || null,
        current_attendees: 0,
        status: 'upcoming',
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json({ success: false, error: 'Failed to create event' })
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Error in events POST:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' })
  }
} 
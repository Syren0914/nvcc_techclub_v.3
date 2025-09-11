import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function isAdmin(user: any): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      console.error('Error checking admin status:', userError)
      return false
    }

    return userData.role === 'admin'
  } catch (error) {
    console.error('Error in isAdmin check:', error)
    return false
  }
}

// POST - Resend announcement to failed recipients
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // Admin check
    const adminCheck = await isAdmin(user)
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { resendType = 'failed' } = body

    // Get the announcement
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', params.id)
      .single()

    if (announcementError || !announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    let targetDeliveries = []

    if (resendType === 'all') {
      // Resend to all recipients - get all delivery records or create new ones
      if (announcement.recipient_type === 'all') {
        // Get all approved members
        const { data: members, error: membersError } = await supabase
          .from('membership_applications')
          .select('email, first_name, last_name')
          .eq('status', 'approved')

        if (membersError) {
          console.error('Error fetching members:', membersError)
          return NextResponse.json(
            { error: 'Failed to fetch member list' },
            { status: 500 }
          )
        }

        // Clear existing delivery records
        await supabase
          .from('announcement_deliveries')
          .delete()
          .eq('announcement_id', params.id)

        // Create new delivery records
        const newDeliveries = members?.map(member => ({
          announcement_id: params.id,
          recipient_email: member.email,
          recipient_name: `${member.first_name} ${member.last_name}`.trim(),
          status: 'pending'
        })) || []

        if (newDeliveries.length > 0) {
          const { data: createdDeliveries } = await supabase
            .from('announcement_deliveries')
            .insert(newDeliveries)
            .select()

          targetDeliveries = createdDeliveries || []
        }
      } else {
        // Specific recipients - recreate delivery records
        const specificEmails = announcement.recipient_emails || []
        
        // Clear existing delivery records
        await supabase
          .from('announcement_deliveries')
          .delete()
          .eq('announcement_id', params.id)

        // Create new delivery records
        const newDeliveries = specificEmails.map((email: string) => ({
          announcement_id: params.id,
          recipient_email: email,
          recipient_name: 'Member',
          status: 'pending'
        }))

        if (newDeliveries.length > 0) {
          const { data: createdDeliveries } = await supabase
            .from('announcement_deliveries')
            .insert(newDeliveries)
            .select()

          targetDeliveries = createdDeliveries || []
        }
      }
    } else {
      // Get failed deliveries only
      const { data: failedDeliveries, error: deliveriesError } = await supabase
        .from('announcement_deliveries')
        .select('*')
        .eq('announcement_id', params.id)
        .in('status', ['failed', 'bounced'])

      if (deliveriesError) {
        console.error('Error fetching failed deliveries:', deliveriesError)
        return NextResponse.json(
          { error: 'Failed to fetch delivery records' },
          { status: 500 }
        )
      }

      targetDeliveries = failedDeliveries || []
    }

    if (targetDeliveries.length === 0) {
      return NextResponse.json(
        { error: resendType === 'all' ? 'No recipients found' : 'No failed deliveries to resend' },
        { status: 400 }
      )
    }

    let successCount = 0
    let failureCount = 0
    const fromAddress = process.env.RESEND_FROM || 'TechClub <noreply@resend.dev>'
    const RATE_LIMIT_DELAY = 500 // 500ms delay = 2 requests per second

    // Resend to target recipients with rate limiting
    for (let i = 0; i < targetDeliveries.length; i++) {
      const delivery = targetDeliveries[i]
      
      // Add delay between requests to respect rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY))
      }
      try {
        // Update delivery status to pending
        await supabase
          .from('announcement_deliveries')
          .update({
            status: 'pending',
            error_message: null
          })
          .eq('id', delivery.id)

        // Send email
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">TechClub Announcement</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">${announcement.title}</h2>
              <div style="color: #555; line-height: 1.6; margin: 20px 0;">
                ${announcement.message}
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                This announcement was sent by ${announcement.sender_name} to TechClub members.
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                Priority: ${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} | ${resendType === 'all' ? 'Resent to All' : 'Resent'}
              </p>
            </div>
          </div>
        `

        const sendResult = await resend.emails.send({
          from: fromAddress,
          to: [delivery.recipient_email],
          subject: `[TechClub] ${announcement.title}`,
          html: emailHtml
        })

        if (sendResult.error) {
          console.error('Email send error:', sendResult.error)
          failureCount++
          
          // Check if it's a rate limit error
          const isRateLimit = sendResult.error.message?.includes('rate limit') || 
                             sendResult.error.message?.includes('Too many requests')
          
          // Update delivery status
          await supabase
            .from('announcement_deliveries')
            .update({
              status: 'failed',
              error_message: isRateLimit ? 
                'Rate limit exceeded - please try again in a moment' : 
                (sendResult.error.message || 'Unknown error')
            })
            .eq('id', delivery.id)
            
          // If rate limited, add extra delay
          if (isRateLimit) {
            await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
          }
        } else {
          successCount++
          
          // Update delivery status
          await supabase
            .from('announcement_deliveries')
            .update({
              status: 'sent',
              email_id: sendResult.data?.id,
              sent_at: new Date().toISOString()
            })
            .eq('id', delivery.id)
        }
      } catch (emailError) {
        console.error('Error resending email to', delivery.recipient_email, ':', emailError)
        failureCount++
        
        // Update delivery status
        await supabase
          .from('announcement_deliveries')
          .update({
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
          })
          .eq('id', delivery.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Resend completed! ${successCount} successful, ${failureCount} failed out of ${targetDeliveries.length} attempts`,
      stats: {
        total: targetDeliveries.length,
        successful: successCount,
        failed: failureCount,
        resendType
      }
    })

  } catch (error) {
    console.error('Error in announcement resend:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

// GET - Fetch all announcements
export async function GET(request: NextRequest) {
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

    // Fetch announcements with delivery stats
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        *,
        announcement_deliveries (
          id,
          status,
          recipient_email,
          recipient_name,
          email_id,
          sent_at,
          delivered_at,
          error_message,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements:', error)
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      )
    }

    return NextResponse.json(announcements || [])
  } catch (error) {
    console.error('Error in announcements GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create and send announcement
export async function POST(request: NextRequest) {
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
    const { 
      title, 
      message, 
      recipientType, 
      specificEmails = [], 
      priority = 'normal',
      sendImmediately = true 
    } = body

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    if (recipientType === 'specific' && (!specificEmails || specificEmails.length === 0)) {
      return NextResponse.json(
        { error: 'Specific email addresses are required when recipient type is specific' },
        { status: 400 }
      )
    }

    // Get sender info
    const { data: senderData } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const senderName = senderData 
      ? `${senderData.first_name} ${senderData.last_name}` 
      : 'TechClub Admin'

    // Create announcement record
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .insert({
        title,
        message,
        sender_id: user.id,
        sender_name: senderName,
        recipient_type: recipientType,
        recipient_emails: recipientType === 'specific' ? specificEmails : null,
        priority,
        status: sendImmediately ? 'sent' : 'draft',
        sent_at: sendImmediately ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (announcementError) {
      console.error('Error creating announcement:', announcementError)
      return NextResponse.json(
        { error: 'Failed to create announcement' },
        { status: 500 }
      )
    }

    let recipients = []

    // Get recipients based on type
    if (recipientType === 'all') {
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

      recipients = members || []
    } else {
      // Use specific emails
      recipients = specificEmails.map((email: string) => ({
        email,
        first_name: 'Member',
        last_name: ''
      }))
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      )
    }

    let successCount = 0
    let failureCount = 0

    if (sendImmediately) {
      // Send emails with rate limiting (2 per second for Resend)
      const fromAddress = process.env.RESEND_FROM || 'TechClub <noreply@resend.dev>'
      const RATE_LIMIT_DELAY = 500 // 500ms delay = 2 requests per second
      
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i]
        
        // Add delay between requests to respect rate limits
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY))
        }
        try {
          // Create delivery record
          const { data: delivery } = await supabase
            .from('announcement_deliveries')
            .insert({
              announcement_id: announcement.id,
              recipient_email: recipient.email,
              recipient_name: `${recipient.first_name} ${recipient.last_name}`.trim(),
              status: 'pending'
            })
            .select()
            .single()

          // Send email
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">TechClub Announcement</h1>
              </div>
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <h2 style="color: #333; margin-top: 0;">${title}</h2>
                <div style="color: #555; line-height: 1.6; margin: 20px 0;">
                  ${message}
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  This announcement was sent by ${senderName} to TechClub members.
                </p>
                <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                  Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}
                </p>
              </div>
            </div>
          `

          const sendResult = await resend.emails.send({
            from: fromAddress,
            to: [recipient.email],
            subject: `[TechClub] ${title}`,
            html: emailHtml
          })

          if (sendResult.error) {
            console.error('Email send error:', sendResult.error)
            failureCount++
            
            // Check if it's a rate limit error
            const isRateLimit = sendResult.error.message?.includes('rate limit') || 
                               sendResult.error.message?.includes('Too many requests')
            
            // Update delivery status
            if (delivery) {
              await supabase
                .from('announcement_deliveries')
                .update({
                  status: 'failed',
                  error_message: isRateLimit ? 
                    'Rate limit exceeded - please try again in a moment' : 
                    (sendResult.error.message || 'Unknown error')
                })
                .eq('id', delivery.id)
            }
            
            // If rate limited, add extra delay
            if (isRateLimit) {
              await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
            }
          } else {
            successCount++
            
            // Update delivery status
            if (delivery) {
              await supabase
                .from('announcement_deliveries')
                .update({
                  status: 'sent',
                  email_id: sendResult.data?.id,
                  sent_at: new Date().toISOString()
                })
                .eq('id', delivery.id)
            }
          }
        } catch (emailError) {
          console.error('Error sending email to', recipient.email, ':', emailError)
          failureCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: sendImmediately 
        ? `Announcement sent! ${successCount} successful, ${failureCount} failed`
        : 'Announcement saved as draft',
      announcement,
      stats: sendImmediately ? {
        total: recipients.length,
        successful: successCount,
        failed: failureCount
      } : null
    })

  } catch (error) {
    console.error('Error in announcements POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

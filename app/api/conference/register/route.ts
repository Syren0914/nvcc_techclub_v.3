import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'
import * as QRCode from 'qrcode'

function generateUniqueCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000) // 4-digit
  return String(num)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      first_name,
      last_name,
      age,
      major,
      expectations
    } = body || {}

    if (!email || !first_name || !last_name || !major) {
      return NextResponse.json(
        { error: 'Missing required fields: email, first_name, last_name, major' },
        { status: 400 }
      )
    }

    const admin = getSupabaseAdmin()
    const attemptInsert = async () => {
      return await admin
        .from('conference_registrations')
        .insert({
          email,
          first_name,
          last_name,
          age: age ? Number(age) : null,
          major,
          expectations: expectations || null,
          unique_code: generateUniqueCode()
        })
        .select('id, unique_code, created_at')
        .single()
    }

    let { data: created, error: insertError } = await attemptInsert()
    if (insertError && insertError.message && insertError.message.includes('unique')) {
      ;({ data: created, error: insertError } = await attemptInsert())
    }

    if (insertError || !created) {
      console.error('Failed to create registration:', insertError)
      return NextResponse.json(
        { error: 'Failed to create registration', details: insertError?.message || insertError },
        { status: 500 }
      )
    }

    const unique_code = created.unique_code as string

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    const verifyUrl = `${origin}/conference/verify?code=${encodeURIComponent(unique_code)}`

    const qrImgUrl = `${origin}/api/conference/qr?code=${encodeURIComponent(unique_code)}`

    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM

    const emailHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111">
        <h2>Tech Club Technology Conference Registration</h2>
        <p>Hi ${first_name},</p>
        <p>You're registered for the Tech Club Technology Conference. Please bring this email to check in.</p>
        <p><strong>Your Check-in Code:</strong> <span style="font-size:18px; letter-spacing:1px">${unique_code}</span></p>
        <p><a href="${verifyUrl}">Open your check-in link</a></p>
        <div style="margin:16px 0"><img alt="Conference QR" src="${qrImgUrl}" width="256" height="256" /></div>
        <p style="margin-top:8px; font-size:12px; color:#555">If the QR doesn't load, use the code above at the door.</p>
      </div>
    `

    if (!apiKey || !fromAddress) {
      console.warn('RESEND not configured; returning success without sending email', { hasApiKey: !!apiKey, hasFrom: !!fromAddress })
      return NextResponse.json({ success: true, message: 'Registered. Email not sent (RESEND not configured).', code: unique_code, verifyUrl })
    }

    try {
      const resend = new Resend(apiKey)
      const sendResult = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: 'Your Tech Club Conference Check-in QR and Code',
        html: emailHtml
      })

      if (sendResult.error) {
        console.error('Resend send error:', sendResult.error)
        return NextResponse.json(
          { error: 'Registration saved, but failed to send email' },
          { status: 502 }
        )
      }

      return NextResponse.json({ success: true, message: 'Registered and email sent', code: unique_code, verifyUrl })
    } catch (sendError) {
      console.error('Unexpected email send error:', sendError)
      return NextResponse.json({ success: true, message: 'Registered. Email sending failed unexpectedly.', code: unique_code, verifyUrl, emailError: String(sendError) })
    }
  } catch (error) {
    console.error('Error in conference register API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}



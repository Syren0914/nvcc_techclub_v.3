import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { authenticator } from 'otplib'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Email validation
export function validateEmailDomain(email: string): boolean {
  return email.toLowerCase().endsWith('@email.vccs.edu')
}

export function getEmailDomainError(): string {
  return 'Email must end with @email.vccs.edu'
}

// 2FA Utilities
export function generateTOTPSecret() {
  return authenticator.generateSecret()
}

export function generateTOTPQRCode(email: string, secret: string) {
  const serviceName = 'TechClub'
  const otpauth = authenticator.keyuri(email, serviceName, secret)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
}

export function verifyTOTP(token: string, secret: string) {
  return authenticator.verify({ token, secret })
}

export function generateBackupCodes() {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
  }
  return codes
}

export function hashBackupCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex')
}

// Authentication helpers
export async function signUp(email: string, password: string, userData: any) {
  // Validate email domain
  if (!validateEmailDomain(email)) {
    throw new Error(getEmailDomainError())
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (error) throw error
  
  // The trigger will automatically create the user profile
  // No need to manually insert into user_profiles table
  
  return data
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('Sign in error:', error)
      throw error
    }
    
    if (!data || !data.user) {
      console.error('No user data returned from sign in')
      throw new Error('Authentication failed - no user data returned')
    }
    
    // Update last login
    try {
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id)
    } catch (profileError) {
      console.warn('Failed to update last login:', profileError)
      // Don't throw error for profile update failure
    }
    
    return data
  } catch (error) {
    console.error('Sign in failed:', error)
    throw error
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 2FA Management
export async function enable2FA(userId: string, secret: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      two_factor_enabled: true,
      two_factor_secret: secret
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  // Generate backup codes
  const backupCodes = generateBackupCodes()
  const hashedCodes = backupCodes.map(code => ({
    user_id: userId,
    code_hash: hashBackupCode(code)
  }))
  
  const { error: backupError } = await supabase
    .from('two_factor_backup_codes')
    .insert(hashedCodes)
  
  if (backupError) throw backupError
  
  return { data, backupCodes }
}

export async function disable2FA(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      two_factor_enabled: false,
      two_factor_secret: null
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  // Delete backup codes
  await supabase
    .from('two_factor_backup_codes')
    .delete()
    .eq('user_id', userId)
  
  return data
}

export async function verifyBackupCode(userId: string, code: string) {
  const hashedCode = hashBackupCode(code)
  
  const { data, error } = await supabase
    .from('two_factor_backup_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('code_hash', hashedCode)
    .eq('used', false)
    .single()
  
  if (error || !data) {
    throw new Error('Invalid backup code')
  }
  
  // Mark code as used
  await supabase
    .from('two_factor_backup_codes')
    .update({ used: true })
    .eq('id', data.id)
  
  return true
} 
import { supabase } from './auth'

// Debug utility for authentication issues
export async function debugAuth(email: string, password: string) {
  console.log('🔍 Debugging authentication...')
  
  // Check if Supabase client is configured
  console.log('📋 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('📋 Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  
  try {
    console.log('🔄 Attempting sign in...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    console.log('📊 Response data:', data)
    console.log('❌ Error (if any):', error)
    
    if (error) {
      console.error('🚨 Authentication error:', error)
      return { success: false, error: error.message }
    }
    
    if (!data || !data.user) {
      console.error('🚨 No user data returned')
      return { success: false, error: 'No user data returned' }
    }
    
    console.log('✅ Authentication successful')
    console.log('👤 User ID:', data.user.id)
    console.log('📧 User Email:', data.user.email)
    
    return { success: true, data }
  } catch (error) {
    console.error('🚨 Unexpected error:', error)
    return { success: false, error: error.message }
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('📊 Session data:', data)
    console.log('❌ Error (if any):', error)
    
    if (error) {
      console.error('🚨 Connection error:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('🚨 Connection test failed:', error)
    return false
  }
} 
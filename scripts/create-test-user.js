// Simple script to create a test user
// Run this with: node scripts/create-test-user.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@techclub.com',
      password: 'testpassword123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          major: 'Computer Science',
          year_of_study: 'Junior',
          technical_experience_level: 'Intermediate'
        }
      }
    })

    if (error) {
      console.error('Error creating user:', error)
      return
    }

    console.log('✅ Test user created successfully!')
    console.log('Email: test@techclub.com')
    console.log('Password: testpassword123')
    console.log('User ID:', data.user?.id)
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@techclub.com',
          major: 'Computer Science',
          year_of_study: 'Junior',
          technical_experience_level: 'Intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      } else {
        console.log('✅ User profile created successfully!')
      }
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser() 
// Run this with: node scripts/create-test-user.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@techclub.com',
      password: 'testpassword123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          major: 'Computer Science',
          year_of_study: 'Junior',
          technical_experience_level: 'Intermediate'
        }
      }
    })

    if (error) {
      console.error('Error creating user:', error)
      return
    }

    console.log('✅ Test user created successfully!')
    console.log('Email: test@techclub.com')
    console.log('Password: testpassword123')
    console.log('User ID:', data.user?.id)
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@techclub.com',
          major: 'Computer Science',
          year_of_study: 'Junior',
          technical_experience_level: 'Intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      } else {
        console.log('✅ User profile created successfully!')
      }
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser() 
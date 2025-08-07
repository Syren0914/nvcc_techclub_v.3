// Simple script to create an admin user
// Run this with: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env file
require('dotenv').config()

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('❌ Error: Supabase credentials not found!')
  console.log('\n📝 Please follow these steps:')
  console.log('1. Create a .env.local file in your project root')
  console.log('2. Add your Supabase credentials:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key')
  console.log('\n🔗 Get your credentials from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api')
  console.log('\n💡 Or run this script with environment variables:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key node scripts/create-admin-user.js')
  process.exit(1)
}

console.log('✅ Found Supabase credentials!')
console.log('🔗 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...')
    console.log('📧 Email: admin@techclub.com')
    console.log('🔑 Password: adminpassword123')
    
    // Create user in auth
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@techclub.com',
      password: 'adminpassword123',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('🆔 User ID:', data.user?.id)
    
    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@techclub.com',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('⚠️  Warning creating profile:', profileError.message)
      } else {
        console.log('✅ Admin profile created successfully!')
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (roleError) {
        console.error('⚠️  Warning assigning role:', roleError.message)
      } else {
        console.log('✅ Admin role assigned successfully!')
      }
    }

    console.log('\n🎉 Admin user setup complete!')
    console.log('📋 Login credentials:')
    console.log('   Email: admin@techclub.com')
    console.log('   Password: adminpassword123')
    console.log('\n🔗 You can now log in and access the admin dashboard at /admin')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdminUser() 
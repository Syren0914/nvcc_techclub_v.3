"use client"

import { useState } from "react"
import { supabase } from "@/lib/auth"

export default function TestConfig() {
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const testConnection = async () => {
    setStatus("Testing connection...")
    setError("")
    
    try {
      console.log('🔍 Testing Supabase connection...')
      console.log('📋 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
      console.log('📋 Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
      
      const { data, error } = await supabase.auth.getSession()
      console.log('📊 Session data:', data)
      console.log('❌ Error (if any):', error)
      
      if (error) {
        setError(`Connection error: ${error.message}`)
        setStatus("❌ Connection failed")
      } else {
        setStatus("✅ Connection successful")
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`)
      setStatus("❌ Connection failed")
    }
  }

  const testAuth = async () => {
    setStatus("Testing authentication...")
    setError("")
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test@email.vccs.edu",
        password: "testpassword123"
      })
      
      console.log('📊 Auth test response:', data)
      console.log('❌ Auth test error:', error)
      
      if (error) {
        setError(`Auth error: ${error.message}`)
        setStatus("❌ Auth test failed")
      } else {
        setStatus("✅ Auth test successful")
      }
    } catch (err: any) {
      setError(`Auth test error: ${err.message}`)
      setStatus("❌ Auth test failed")
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <h3 className="text-lg font-bold mb-4">Configuration Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testConnection} className="w-full">
            Test Connection
          </Button>
          <Button onClick={testAuth} className="w-full">
            Test Authentication
          </Button>
        </div>
        
        {status && (
          <p className={`text-sm ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
        
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

function Button({ children, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  )
} 
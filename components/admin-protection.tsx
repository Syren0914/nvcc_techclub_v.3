"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertTriangle, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface AdminProtectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setError('Authentication required')
        setLoading(false)
        return
      }
      
      checkAdminAccess()
    }
  }, [isLoading, user])

  const checkAdminAccess = async () => {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setError('Authentication required. Please sign in.')
        setLoading(false)
        return
      }

      // Check if user is admin by querying the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userError) {
        console.error('Error checking admin status:', userError)
        setError('Failed to verify admin status. Please try again.')
        setLoading(false)
        return
      }

      if (userData && userData.role === 'admin') {
        setIsAdmin(true)
        setLoading(false)
      } else {
        setError('Admin access required. You do not have permission to view this page.')
        setLoading(false)
      }
    } catch (err) {
      setError('Error checking admin access')
      console.error('Error checking admin access:', err)
      setLoading(false)
    }
  }

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              {error || 'You do not have permission to access this page'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                This page is restricted to administrators only.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/login')} className="w-full">
                Sign In
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show children if admin access is confirmed
  if (isAdmin) {
    return <>{children}</>
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>
  }

  // Default loading state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  )
} 
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Shield, Smartphone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase, signIn, getUserProfile, validateEmailDomain, getEmailDomainError } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"login" | "2fa" | "backup">("login")
  const [totpCode, setTotpCode] = useState("")
  const [backupCode, setBackupCode] = useState("")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate email domain
    if (!validateEmailDomain(email)) {
      setError(getEmailDomainError())
      setIsLoading(false)
      return
    }

    try {
      const data = await signIn(email, password)
      
      if (data && data.user) {
        // Check if user has 2FA enabled
        const profile = await getUserProfile(data.user.id)
        setUserProfile(profile)

        if (profile.two_factor_enabled) {
          setStep("2fa")
        } else {
          // No 2FA, redirect to dashboard
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to TechClub.",
          })
          
          // Force a page reload to ensure session is properly set
          window.location.href = "/dashboard"
        }
      } else {
        throw new Error('Authentication failed - no user data returned')
      }
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Verify TOTP code
      const { data, error } = await supabase.functions.invoke('verify-2fa', {
        body: { 
          userId: userProfile.id, 
          code: totpCode,
          secret: userProfile.two_factor_secret
        }
      })

      if (error) throw error

      if (data.valid) {
        toast({
          title: "2FA verified!",
          description: "Successfully logged in to TechClub.",
        })
        router.push("/dashboard")
      } else {
        setError("Invalid 2FA code")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.functions.invoke('verify-backup-code', {
        body: { 
          userId: userProfile.id, 
          code: backupCode
        }
      })

      if (error) throw error

      if (data.valid) {
        toast({
          title: "Backup code verified!",
          description: "Successfully logged in to TechClub.",
        })
        router.push("/dashboard")
      } else {
        setError("Invalid backup code")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Lock className="size-4" />
              </div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
            </div>
            <p className="text-muted-foreground">
              Sign in to your TechClub account
            </p>
          </motion.div>

          {/* Login Form */}
          {step === "login" && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4" id="login-form">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.name@email.vccs.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be a valid @email.vccs.edu address
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                        {error}
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  

                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 2FA Verification */}
          {step === "2fa" && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription>
                    Enter the 6-digit code from your authenticator app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handle2FAVerification} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="totp" className="text-sm font-medium">
                        Authentication Code
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="totp"
                          type="text"
                          placeholder="000000"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("backup")}
                        className="flex-1"
                      >
                        Use Backup Code
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Backup Code */}
          {step === "backup" && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    <CardTitle className="text-xl">Backup Code</CardTitle>
                  </div>
                  <CardDescription>
                    Enter one of your backup codes to sign in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBackupCode} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="backup" className="text-sm font-medium">
                        Backup Code
                      </label>
                      <Input
                        id="backup"
                        type="text"
                        placeholder="Enter backup code"
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value)}
                        className="text-center font-mono"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("2fa")}
                        className="flex-1"
                      >
                        Use 2FA Code
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div variants={item} className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              <Link href="/forgot-password" className="hover:text-foreground transition-colors">
                Forgot your password?
              </Link>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div variants={item} className="flex justify-center">
            <Badge variant="secondary" className="gap-2">
              <Shield className="size-3" />
              Secure Authentication
            </Badge>
          </motion.div>


        </motion.div>
      </div>
    </div>
  )
} 
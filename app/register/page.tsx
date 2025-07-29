"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Mail, Lock, Calendar, GraduationCap, Code, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { signUp, validateEmailDomain, getEmailDomainError } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    major: "",
    year_of_study: "",
    areas_of_interest: [] as string[],
    technical_experience_level: "Beginner",
    goals: "",
    agreeToTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(interest)
        ? prev.areas_of_interest.filter(i => i !== interest)
        : [...prev.areas_of_interest, interest]
    }))
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return false
    }
    if (!validateEmailDomain(formData.email)) {
      setError(getEmailDomainError())
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.first_name || !formData.last_name || !formData.major || !formData.year_of_study) {
      setError("All fields are required")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (formData.areas_of_interest.length === 0) {
      setError("Please select at least one area of interest")
      return false
    }
    if (!formData.goals.trim()) {
      setError("Please tell us about your goals")
      return false
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    let isValid = false
    
    switch (step) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
    }
    
    if (isValid) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        major: formData.major,
        year_of_study: formData.year_of_study,
        areas_of_interest: formData.areas_of_interest,
        technical_experience_level: formData.technical_experience_level,
        goals: formData.goals
      })

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })
      
      router.push("/login")
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
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

  const interests = [
    "Web Development",
    "Cybersecurity", 
    "Game Development",
    "Robotics",
    "AI/ML",
    "Data Science",
    "Mobile Development",
    "Cloud Computing"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
                <User className="size-4" />
              </div>
              <h1 className="text-2xl font-bold">Join TechClub</h1>
            </div>
            <p className="text-muted-foreground">
              Create your account and start your tech journey
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={item} className="flex justify-center">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-2">
                  <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > stepNumber ? <Check className="size-4" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-0.5 ${
                      step > stepNumber ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step 1: Account Details */}
          {step === 1 && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Create your login credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be a valid @email.vccs.edu address
                      </p>
                    </div>
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      {error}
                    </div>
                  )}
                  <Button onClick={handleNext} className="w-full">
                    Next Step
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Tell us about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="major" className="text-sm font-medium">
                      Major/Field of Study
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="major"
                        placeholder="e.g., Computer Science"
                        value={formData.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="yearOfStudy" className="text-sm font-medium">
                      Year of Study
                    </label>
                    <Select value={formData.year_of_study} onValueChange={(value) => handleInputChange("year_of_study", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                      Previous
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Interests and Goals */}
          {step === 3 && (
            <motion.div variants={item}>
              <Card className="border-border/40 bg-background/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Interests and Goals</CardTitle>
                  <CardDescription>
                    Help us understand your interests and what you hope to achieve
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Areas of Interest
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.areas_of_interest.includes(interest)}
                            onCheckedChange={() => handleInterestToggle(interest)}
                          />
                          <label htmlFor={interest} className="text-sm">
                            {interest}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="experience" className="text-sm font-medium">
                      Technical Experience Level
                    </label>
                    <Select value={formData.technical_experience_level} onValueChange={(value) => handleInputChange("technical_experience_level", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="goals" className="text-sm font-medium">
                      What do you hope to gain from TechClub?
                    </label>
                    <Textarea
                      id="goals"
                      placeholder="Tell us about your goals, what you want to learn, or projects you'd like to work on..."
                      value={formData.goals}
                      onChange={(e) => handleInputChange("goals", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                      Previous
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div variants={item} className="text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 
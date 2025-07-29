"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Code, 
  Shield, 
  Gamepad, 
  Cpu,
  Trophy,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase, signOut, getCurrentUser, getUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface DashboardData {
  userProfile: any
  upcomingEvents: any[]
  upcomingWorkshops: any[]
  upcomingHackathons: any[]
  userProjects: any[]
  userResources: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Loading dashboard data...')
      const user = await getCurrentUser()
      console.log('👤 Current user:', user)
      
      if (!user) {
        console.log('❌ No user found, redirecting to login')
        router.push("/login")
        return
      }

      console.log('🔄 Fetching user profile...')
      const profile = await getUserProfile(user.id)
      console.log('📊 User profile:', profile)
      
      // For now, use sample data instead of complex queries
      const sampleData: DashboardData = {
        userProfile: profile,
        upcomingEvents: [
          {
            id: 1,
            title: "Weekly Tech Club Meeting",
            date: "2024-12-15",
            time: "14:30",
            location: "LC Building Room 302E",
            type: "Meeting"
          },
          {
            id: 2,
            title: "Web Development Workshop",
            date: "2024-12-20",
            time: "15:00",
            location: "Online",
            type: "Workshop"
          }
        ],
        upcomingWorkshops: [
          {
            id: 1,
            title: "React Hooks Deep Dive",
            date: "2024-12-18",
            time: "16:00",
            duration: 120,
            instructor: "John Smith"
          }
        ],
        upcomingHackathons: [
          {
            id: 1,
            title: "Winter Hackathon 2024",
            start_date: "2024-12-25",
            end_date: "2024-12-27",
            location: "LC Building",
            prizes: ["$1000 First Prize", "$500 Second Prize"]
          }
        ],
        userProjects: [
          {
            id: 1,
            name: "Club Website",
            description: "Building the TechClub website with Next.js",
            role: "Lead Developer",
            progress: 75
          },
          {
            id: 2,
            name: "Mobile App",
            description: "Creating a mobile app for event management",
            role: "Contributor",
            progress: 30
          }
        ],
        userResources: [
          {
            id: 1,
            title: "React Best Practices",
            category: "Web Development",
            accessed_at: "2024-12-10"
          },
          {
            id: 2,
            title: "Cybersecurity Fundamentals",
            category: "Security",
            accessed_at: "2024-12-08"
          }
        ]
      }

      setData(sampleData)
      console.log('✅ Dashboard data loaded successfully')
    } catch (error) {
      console.error('🚨 Error loading dashboard:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard</p>
          <Button onClick={loadDashboardData} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Code className="size-4" />
            </div>
            <span className="font-bold">TechClub Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Welcome Section */}
          <motion.div variants={item} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {data.userProfile?.first_name || 'Member'}!</h1>
              <p className="text-muted-foreground">Here's what's happening in TechClub today.</p>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={data.userProfile?.avatar_url} />
                <AvatarFallback>{data.userProfile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.upcomingEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Code className="size-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.userProjects.length}</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="size-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.upcomingHackathons.length}</p>
                    <p className="text-sm text-muted-foreground">Hackathons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.userResources.length}</p>
                    <p className="text-sm text-muted-foreground">Resources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="size-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date} • {event.time}
                          </p>
                        </div>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="size-5" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.userProjects.map((project) => (
                      <div key={project.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{project.name}</p>
                          <Badge variant="outline">{project.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workshops */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Workshops</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.upcomingWorkshops.map((workshop) => (
                      <div key={workshop.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{workshop.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {workshop.date} • {workshop.time} • {workshop.duration}min
                        </p>
                        <p className="text-sm text-muted-foreground">Instructor: {workshop.instructor}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Hackathons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hackathons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.upcomingHackathons.map((hackathon) => (
                      <div key={hackathon.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{hackathon.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {hackathon.start_date} - {hackathon.end_date}
                        </p>
                        <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                        <div className="mt-2">
                          {hackathon.prizes.map((prize, index) => (
                            <Badge key={index} variant="secondary" className="mr-1">
                              {prize}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.userProjects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium">{project.name}</h3>
                        <Badge variant="outline">{project.role}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.userResources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.category}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {resource.accessed_at}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
} 
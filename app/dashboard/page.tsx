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
  Star,
  ExternalLink,
  Zap,
  Crown,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  CalendarDays,
  BarChart3,
  Activity,
  Users2,
  BookMarked,
  Lightbulb,
  GitBranch,
  Globe,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  Play,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { supabase, signOut, getCurrentUser, getUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import LearningPath from "@/components/learning-path"
import RolesManagement from "@/components/roles-management"
import AddProjectModal from "@/components/add-project-modal"
import AddEventModal from "@/components/add-event-modal"
import AddResourceModal from "@/components/add-resource-modal"

interface DashboardData {
  userProfile: any
  upcomingEvents: any[]
  upcomingWorkshops: any[]
  upcomingHackathons: any[]
  userProjects: any[]
  userResources: any[]
  leetcodeRankings: any[]
  devpostHackathons: any[]
  notifications: any[]
  activities: any[]
  quickStats: any
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  
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

      console.log('🔄 Fetching dashboard data from backend...')
      
      // Fetch all dashboard data from backend API
      const response = await fetch(`/api/dashboard?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Dashboard data loaded from backend')
        setData(result.data)
      } else {
        console.error('❌ Error loading dashboard data:', result.error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      }
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

  const handleJoinDiscord = () => {
    // Replace with your actual Discord invite link
    window.open("https://discord.gg/your-techclub-invite", "_blank")
    toast({
      title: "Discord Invitation",
      description: "Opening Discord community invitation...",
    })
  }

  const handleRefreshData = () => {
    loadDashboardData()
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
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Code className="size-4" />
            </div>
            <div>
              <span className="font-bold text-lg">TechClub Dashboard</span>
              <p className="text-xs text-muted-foreground">Welcome back, {data.userProfile?.first_name || 'Member'}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {data.notifications.filter(n => !n.read).length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {data.notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            
            {/* Quick Actions */}
            <Button variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
            
            {/* Discord Button */}
            <Button 
              onClick={handleJoinDiscord}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              size="sm"
            >
              <MessageSquare className="size-4 mr-2" />
              Join Discord
            </Button>
            
            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={data.userProfile?.avatar_url} />
                <AvatarFallback>{data.userProfile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="size-4" />
              </Button>
            </div>
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
          {/* Enhanced Quick Stats */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.quickStats.totalMembers}</p>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-xs text-green-600 mt-1">+{data.quickStats.monthlyGrowth}% this month</p>
                  </div>
                  <Users2 className="size-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.quickStats.activeProjects}</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-xs text-blue-600 mt-1">3 due this week</p>
                  </div>
                  <GitBranch className="size-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.quickStats.completedWorkshops}</p>
                    <p className="text-sm text-muted-foreground">Workshops Completed</p>
                    <p className="text-xs text-purple-600 mt-1">This semester</p>
                  </div>
                  <BookMarked className="size-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.quickStats.averageRating}</p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-3 ${i < Math.floor(data.quickStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <Star className="size-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content with Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                                <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="rankings">LeetCode</TabsTrigger>
                  <TabsTrigger value="devpost">Devpost</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

                {/* Enhanced Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="size-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar className="size-8">
                            <AvatarImage src={activity.avatar} />
                            <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.user}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.action} {activity.target}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upcoming Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <p className="text-xs text-muted-foreground">{event.attendees} attendees</p>
                            </div>
                            <Badge variant="secondary">{event.type}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

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
                              <Badge variant={project.priority === 'high' ? 'destructive' : 'outline'}>
                                {project.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">Due: {project.deadline}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Enhanced Events Tab */}
                <TabsContent value="events" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Events & Workshops</h2>
                    <Button onClick={() => setShowEventModal(true)}>
                      <Plus className="size-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookMarked className="size-5" />
                          Upcoming Workshops
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {data.upcomingWorkshops.map((workshop) => (
                          <div key={workshop.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{workshop.title}</h3>
                              <Badge variant="outline">{workshop.enrolled}/{workshop.capacity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {workshop.date} • {workshop.time} • {workshop.duration}min
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">Instructor: {workshop.instructor}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Enrollment</span>
                                <span>{Math.round((workshop.enrolled / workshop.capacity) * 100)}%</span>
                              </div>
                              <Progress value={(workshop.enrolled / workshop.capacity) * 100} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="size-5" />
                          Hackathons
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {data.upcomingHackathons.map((hackathon) => (
                          <div key={hackathon.id} className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">{hackathon.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {hackathon.start_date} - {hackathon.end_date}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">{hackathon.location}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Participants</span>
                                <span>{hackathon.participants}/{hackathon.maxParticipants}</span>
                              </div>
                              <Progress value={(hackathon.participants / hackathon.maxParticipants) * 100} className="h-2" />
                            </div>
                            <div className="mt-3">
                              {hackathon.prizes.map((prize: string, index: number) => (
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

                {/* Enhanced Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Projects</h2>
                    <Button onClick={() => setShowProjectModal(true)}>
                      <Plus className="size-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.userProjects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{project.name}</CardTitle>
                            <Badge variant={project.priority === 'high' ? 'destructive' : 'outline'}>
                              {project.priority}
                            </Badge>
                          </div>
                          <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Team Members</p>
                            <div className="flex items-center gap-2">
                              {project.team.map((member: string, index: number) => (
                                <Avatar key={index} className="size-6">
                                  <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Role: {project.role}</span>
                            <span>Due: {project.deadline}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="size-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="size-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Enhanced Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Learning Resources</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="size-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowResourceModal(true)}>
                        <Plus className="size-4 mr-2" />
                        Add Resource
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.userResources.map((resource) => (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{resource.category}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{resource.views} views</span>
                                <div className="flex items-center gap-1">
                                  <Star className="size-3 fill-current text-yellow-400" />
                                  <span>{resource.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{resource.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Accessed: {resource.accessed_at}</span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="size-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <BookMarked className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                            {/* LeetCode Rankings Tab */}
            <TabsContent value="rankings" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">LeetCode Practice</h2>
                  <p className="text-muted-foreground">Track your coding progress and compete with others</p>
                </div>
                <Button asChild>
                  <Link href="/leetcode">
                    <Code className="size-4 mr-2" />
                    Practice Now
                  </Link>
                </Button>
              </div>
              
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leaderboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="size-5" />
                      Leaderboard
                    </CardTitle>
                    <CardDescription>
                      Top performers in our TechClub LeetCode community
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.leetcodeRankings.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {user.rank}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{user.problems_solved}</p>
                            <p className="text-muted-foreground">Solved</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{user.rating}</p>
                            <p className="text-muted-foreground">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{user.streak}</p>
                            <p className="text-muted-foreground">Streak</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Daily Challenge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5" />
                      Daily Challenge
                    </CardTitle>
                    <CardDescription>
                      Today's coding problem
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Two Sum</h3>
                        <Badge variant="outline">Easy</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Find two numbers in an array that add up to a target value.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                          <Link href="/leetcode">
                            <Play className="size-4 mr-2" />
                            Solve Now
                          </Link>
                        </Button>
                        <Badge variant="secondary">Array • Hash Table</Badge>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        New problem every day at midnight
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Beginner Learning Path - Moved to Bottom */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5" />
                    Beginner Path
                  </CardTitle>
                  <CardDescription>
                    Start here if you're new to coding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LearningPath />
                </CardContent>
              </Card>
              
              {/* Progress Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>
                    Track your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-muted-foreground">Easy Solved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">5</div>
                      <div className="text-sm text-muted-foreground">Medium Solved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">2</div>
                      <div className="text-sm text-muted-foreground">Hard Solved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">7</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Management Tab */}
            <TabsContent value="roles" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Roles Management</h2>
                  <p className="text-muted-foreground">Manage member roles and permissions</p>
                </div>
                <Button>
                  <UserPlus className="size-4 mr-2" />
                  Add Member
                </Button>
              </div>
              
              <RolesManagement />
            </TabsContent>

                {/* Devpost Tab */}
                <TabsContent value="devpost" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="size-5" />
                        Upcoming Hackathons
                      </CardTitle>
                      <CardDescription>
                        Latest hackathons from Devpost that might interest our members
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.devpostHackathons.map((hackathon) => (
                        <div key={hackathon.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium mb-1">{hackathon.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                by {hackathon.organization}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span>{hackathon.start_date} - {hackathon.end_date}</span>
                                <span>•</span>
                                <span>{hackathon.location}</span>
                                <span>•</span>
                                <span>{hackathon.participants} participants</span>
                              </div>
                              <Badge variant="secondary" className="mb-3">
                                {hackathon.prizes}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                try {
                                  if (hackathon.devpost_url) {
                                    window.open(hackathon.devpost_url, "_blank", "noopener,noreferrer")
                                    toast({
                                      title: "Opening Hackathon",
                                      description: `Opening ${hackathon.title} on Devpost...`,
                                    })
                                  } else {
                                    // Fallback to main Devpost page
                                    window.open("https://devpost.com/hackathons", "_blank", "noopener,noreferrer")
                                    toast({
                                      title: "Opening Devpost",
                                      description: "Opening Devpost hackathons page...",
                                    })
                                  }
                                } catch (error) {
                                  console.error('Error opening hackathon link:', error)
                                  // Fallback to main Devpost page
                                  window.open("https://devpost.com/hackathons", "_blank", "noopener,noreferrer")
                                  toast({
                                    title: "Opening Devpost",
                                    description: "Opening Devpost hackathons page...",
                                  })
                                }
                              }}
                            >
                              <ExternalLink className="size-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="size-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`p-3 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="size-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="size-4 mr-2" />
                    New Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDays className="size-4 mr-2" />
                    Schedule Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookMarked className="size-4 mr-2" />
                    Add Resource
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="size-4 mr-2" />
                    Invite Member
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="size-5" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>techclub@university.edu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="size-4 text-muted-foreground" />
                    <span>LC Building, Room 302E</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddProjectModal 
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={handleRefreshData}
      />
      
      <AddEventModal 
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSuccess={handleRefreshData}
      />
      
      <AddResourceModal 
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        onSuccess={handleRefreshData}
      />
    </div>
  )
} 
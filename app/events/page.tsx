"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  Tag,
  Users,
  ArrowRight,
  Video,
  Trophy,
  Laptop,
  Coffee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Header from "@/components/Header"
import { getAllEvents } from "@/lib/database"
import { Event } from "@/lib/supabase"

export default function EventsPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const eventsData = await getAllEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = ["Workshop", "Hackathon", "Meeting", "Field Trip", "Competition", "Social", "Conference"]

  const locations = ["All Locations", "Tech Building", "Online", "Innovation Hub", "Main Campus", "Off Campus"]

  const upcomingEvents = [
    {
      title: "Intro to Ethical Hacking",
      date: "May 15, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Tech Building, Room 302",
      description:
        "Learn the basics of ethical hacking and penetration testing in this hands-on workshop. We'll cover reconnaissance, scanning, exploitation, and reporting. Bring your laptop with Kali Linux installed (VMs are fine).",
      type: "Workshop",
      isOnline: false,
      image: "/ethi.png",
      capacity: 30,
      registered: 18,
      tags: ["Cybersecurity", "Beginner Friendly"],
      host: "Jamie Lee, Cybersecurity Lead",
    },
    {
      title: "Web Development Bootcamp",
      date: "May 20, 2025",
      time: "5:30 PM - 7:30 PM",
      location: "Online (Zoom)",
      description:
        "A beginner-friendly introduction to HTML, CSS, and JavaScript for web development. This is the first session in our 6-week web development series. No prior experience required!",
      type: "Workshop",
      isOnline: true,
      image: "/web.png",
      capacity: 50,
      registered: 32,
      tags: ["Web Development", "Beginner Friendly"],
      host: "Sam Rodriguez, Web Development Lead",
    },
    {
      title: "Data Center Field Trip",
      date: "June 5, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "City Data Center",
      description:
        "Visit the local data center to see how large-scale computing infrastructure works. Transportation will be provided from campus. Limited spots available!",
      type: "Field Trip",
      isOnline: false,
      image: "/data.png",
      capacity: 20,
      registered: 15,
      tags: ["Infrastructure", "Networking"],
      host: "Casey Wong, Outreach Coordinator",
    },
    {
      title: "Game Jam Weekend",
      date: "June 12-14, 2025",
      time: "Starts at 5:00 PM Friday",
      location: "Innovation Hub",
      description:
        "48-hour game development challenge. Form teams and create a game from scratch! Prizes for the best games in various categories. Food and drinks provided.",
      type: "Competition",
      isOnline: false,
      image: "/placeholder.svg?height=300&width=500",
      capacity: 60,
      registered: 42,
      tags: ["Game Development", "Team Event"],
      host: "Taylor Smith, Events Coordinator",
    },
    {
      title: "Machine Learning Study Group",
      date: "May 25, 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Tech Building, Room 204",
      description:
        "Weekly study group focusing on machine learning concepts and implementations. This week's topic: Neural Networks and Deep Learning.",
      type: "Meeting",
      isOnline: false,
      image: "/placeholder.svg?height=300&width=500",
      capacity: 25,
      registered: 12,
      tags: ["AI/ML", "Intermediate"],
      host: "Alex Johnson, Club President",
    },
    {
      title: "Resume Workshop",
      date: "May 28, 2025",
      time: "6:00 PM - 7:30 PM",
      location: "Online (Zoom)",
      description:
        "Learn how to create a standout tech resume. We'll cover formatting, content, and how to highlight your projects and skills. Bring your current resume for feedback!",
      type: "Workshop",
      isOnline: true,
      image: "/placeholder.svg?height=300&width=500",
      capacity: 40,
      registered: 22,
      tags: ["Career Development", "All Levels"],
      host: "Morgan Chen, Secretary",
    },
    {
      title: "Robotics Competition Prep",
      date: "June 2, 2025",
      time: "5:00 PM - 8:00 PM",
      location: "Engineering Building, Lab 3",
      description:
        "Preparation session for the upcoming regional robotics competition. We'll be testing and fine-tuning our robots.",
      type: "Meeting",
      isOnline: false,
      image: "/placeholder.svg?height=300&width=500",
      capacity: 15,
      registered: 10,
      tags: ["Robotics", "Advanced"],
      host: "Jordan Patel, Technical Lead",
    },
    {
      title: "Tech Industry Mixer",
      date: "June 18, 2025",
      time: "6:30 PM - 9:00 PM",
      location: "University Center, Grand Hall",
      description:
        "Networking event with representatives from local tech companies. Great opportunity to make connections for internships and jobs. Professional attire recommended.",
      type: "Social",
      isOnline: false,
      image: "/placeholder.svg?height=300&width=500",
      capacity: 100,
      registered: 65,
      tags: ["Networking", "Career Development"],
      host: "Riley Kim, Marketing Director",
    },
  ]

  const pastEvents = [
    {
      title: "Spring Hackathon",
      date: "April 10-12, 2025",
      location: "Innovation Hub",
      description: "Our annual 48-hour hackathon with over 100 participants from universities across the region.",
      type: "Hackathon",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Competition", "All Skills"],
      highlights: "15 projects completed, 3 industry sponsors",
    },
    {
      title: "Intro to Docker Workshop",
      date: "April 5, 2025",
      location: "Tech Building, Room 302",
      description: "Hands-on workshop covering Docker basics, containers, and deployment strategies.",
      type: "Workshop",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["DevOps", "Intermediate"],
      highlights: "35 attendees, 100% positive feedback",
    },
    {
      title: "Tech Talk: Future of AI",
      date: "March 28, 2025",
      location: "Online (Zoom)",
      description:
        "Guest lecture from Dr. Sarah Chen, AI Research Lead at TechCorp, discussing the future of artificial intelligence.",
      type: "Conference",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["AI/ML", "All Levels"],
      highlights: "75 attendees, recording available in resources",
    },
    {
      title: "Game Development Workshop Series",
      date: "March 1-22, 2025",
      location: "Tech Building, Room 304",
      description: "Four-week workshop series covering Unity game development from basics to advanced topics.",
      type: "Workshop",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Game Development", "All Levels"],
      highlights: "40 participants, 12 games created",
    },
  ]

  // Filter events based on search query and filters
  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type)

    const matchesLocation =
      selectedLocation === "" ||
      selectedLocation === "All Locations" ||
      (selectedLocation === "Online" && event.isOnline) ||
      (!event.isOnline && event.location.includes(selectedLocation))

    return matchesSearch && matchesType && matchesLocation
  })

  const toggleEventType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const featuredEvents = upcomingEvents.slice(0, 3)

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-28 overflow-hidden bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Events & Meetings
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Join Us In Person & Online</h1>
                <p className="text-lg text-muted-foreground">
                  Discover workshops, hackathons, field trips, and social events. Connect with fellow tech enthusiasts
                  and expand your skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="rounded-full">
                    View Calendar
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Submit Event Idea
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-border/40">
                  <Image
                    src="/hackathon.jpg"
                    width={800}
                    height={600}
                    alt="TechClub workshop in progress"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Events</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Don't miss these upcoming highlights from our event calendar.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {featuredEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={event.isOnline ? "outline" : "secondary"} className="rounded-full">
                          {event.isOnline ? "Online" : "In Person"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <Badge variant="default" className="rounded-full mb-2">
                          {event.type}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="size-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="size-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <MapPin className="size-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-3">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag, j) => (
                          <Badge key={j} variant="outline" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Users className="size-4 inline mr-1" />
                          {event.registered}/{event.capacity} registered
                        </div>
                        <Button className="rounded-full">RSVP</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">All Events</h2>
                  <p className="text-muted-foreground">Browse our upcoming events and meetings</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-full pl-10"
                    />
                  </div>
                  <Button variant="outline" className="rounded-full" onClick={() => setFilterOpen(!filterOpen)}>
                    <Filter className="size-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border/40 rounded-lg p-4 mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <Tag className="size-4 mr-2" />
                        Event Type
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {eventTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={() => toggleEventType(type)}
                            />
                            <Label htmlFor={`type-${type}`} className="text-sm">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <MapPin className="size-4 mr-2" />
                        Location
                      </h3>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="rounded-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="rounded-full text-sm"
                      onClick={() => {
                        setSelectedTypes([])
                        setSelectedLocation("")
                        setSearchQuery("")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              )}

              <Tabs defaultValue="upcoming" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="upcoming" className="rounded-full px-6">
                      Upcoming Events
                    </TabsTrigger>
                    <TabsTrigger value="past" className="rounded-full px-6">
                      Past Events
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="upcoming">
                  {filteredEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                        >
                          <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                            <CardContent className="p-6 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-4">
                                <Badge variant={event.isOnline ? "outline" : "secondary"} className="rounded-full">
                                  {event.isOnline ? "Online" : "In Person"}
                                </Badge>
                                <Badge variant="default" className="rounded-full">
                                  {event.type}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Calendar className="size-4 mr-2" />
                                {event.date}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Clock className="size-4 mr-2" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <MapPin className="size-4 mr-2" />
                                {event.location}
                              </div>
                              <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {event.tags.map((tag, j) => (
                                  <Badge key={j} variant="outline" className="rounded-full">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                  <Users className="size-4 inline mr-1" />
                                  {event.registered}/{event.capacity}
                                </div>
                                <Button variant="outline" className="rounded-full">
                                  RSVP
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No events found matching your search criteria.</p>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setSelectedTypes([])
                          setSelectedLocation("")
                          setSearchQuery("")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {pastEvents.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      >
                        <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform hover:scale-105 opacity-80"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="outline" className="rounded-full bg-background/80">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4 flex flex-col h-full">
                            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Calendar className="size-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="size-4 mr-2" />
                              {event.location}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 flex-grow line-clamp-2">
                              {event.description}
                            </p>
                            <div className="text-xs font-medium mb-2">Highlights:</div>
                            <p className="text-xs text-muted-foreground">{event.highlights}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Event Types</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We organize a variety of events to cater to different interests and learning styles.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <Laptop className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Workshops</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">
                      Hands-on learning sessions covering specific technical skills, from web development to
                      cybersecurity. Most workshops are beginner-friendly.
                    </p>
                    <Button variant="outline" className="rounded-full mt-auto">
                      View Workshops
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <Trophy className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Hackathons & Competitions</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">
                      Intensive events where teams work together to build projects in a limited time. Great for applying
                      skills and networking.
                    </p>
                    <Button variant="outline" className="rounded-full mt-auto">
                      View Competitions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <Video className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Tech Talks & Conferences</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">
                      Presentations from industry professionals, faculty, and student experts on cutting-edge
                      technologies and career insights.
                    </p>
                    <Button variant="outline" className="rounded-full mt-auto">
                      View Tech Talks
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <Coffee className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Social Events & Field Trips</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">
                      Networking events, game nights, and visits to tech companies and facilities. Great for building
                      connections and having fun.
                    </p>
                    <Button variant="outline" className="rounded-full mt-auto">
                      View Social Events
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Host an Event Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight">Host Your Own Event</h2>
                <p className="text-lg text-muted-foreground">
                  Have an idea for a workshop, talk, or activity? We welcome event proposals from all members. We can
                  help with planning, promotion, and resources.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Calendar className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Event Planning Support</h3>
                      <p className="text-muted-foreground">We'll help you schedule, organize, and promote your event</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Venue Arrangements</h3>
                      <p className="text-muted-foreground">Access to campus rooms and online meeting platforms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Audience Building</h3>
                      <p className="text-muted-foreground">
                        Reach our community of tech enthusiasts interested in your topic
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="rounded-full">
                  Submit Event Proposal
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-border/40">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="TechClub member presenting at a workshop"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Never Miss an Event</h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join our mailing list to receive weekly updates about upcoming events, workshops, and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Subscribe to Updates
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white text-white hover:bg-white/10"
                >
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


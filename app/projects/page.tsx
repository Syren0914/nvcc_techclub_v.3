"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Code,
  Shield,
  Gamepad,
  Cpu,
  Github,
  ExternalLink,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectCategories = [
    {
      id: "web",
      title: "Web Development",
      description: "Building modern web applications using React, Next.js, and other cutting-edge technologies.",
      icon: <Code className="size-5" />,
      projects: [
        {
          name: "Club Website",
          description:
            "Our own website built with Next.js and Tailwind CSS. Features event management, resource library, and member profiles.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Next.js", "React", "Tailwind CSS"],
          status: "Active",
          github: "https://github.com/techclub/website",
          demo: "https://techclub.university.edu",
          members: 6,
          featured: true,
        },
        {
          name: "Student Portal",
          description:
            "A portal for students to access resources and track their progress. Includes authentication, dashboard, and progress tracking.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["React", "Firebase", "Material UI"],
          status: "Active",
          github: "https://github.com/techclub/student-portal",
          demo: "https://student-portal.techclub.university.edu",
          members: 4,
          featured: true,
        },
        {
          name: "Event Management System",
          description: "Internal tool for managing club events, RSVPs, and attendance tracking.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Vue.js", "Node.js", "MongoDB"],
          status: "In Development",
          github: "https://github.com/techclub/event-system",
          members: 3,
          featured: false,
        },
        {
          name: "Tech Blog",
          description: "A blog platform for club members to share tutorials, project updates, and tech insights.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Gatsby", "GraphQL", "Netlify CMS"],
          status: "Planning",
          github: "https://github.com/techclub/tech-blog",
          members: 2,
          featured: false,
        },
      ],
    },
    {
      id: "security",
      title: "Cybersecurity",
      description: "Learning ethical hacking, penetration testing, and security best practices.",
      icon: <Shield className="size-5" />,
      projects: [
        {
          name: "CTF Challenges",
          description:
            "Capture the Flag challenges for members to practice security skills. Includes web, crypto, forensics, and reverse engineering challenges.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Python", "Docker", "JavaScript"],
          status: "Active",
          github: "https://github.com/techclub/ctf-challenges",
          demo: "https://ctf.techclub.university.edu",
          members: 5,
          featured: true,
        },
        {
          name: "Security Scanner",
          description: "A tool to scan websites for common security vulnerabilities like XSS, SQL injection, and CSRF.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Python", "Flask", "OWASP"],
          status: "Active",
          github: "https://github.com/techclub/security-scanner",
          members: 3,
          featured: true,
        },
        {
          name: "Password Manager",
          description: "Secure password manager with end-to-end encryption and cross-platform support.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Electron", "React", "Crypto API"],
          status: "In Development",
          github: "https://github.com/techclub/password-manager",
          members: 4,
          featured: false,
        },
        {
          name: "Network Monitor",
          description: "Tool for monitoring network traffic and detecting suspicious activities.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Python", "Wireshark API", "Data Visualization"],
          status: "Planning",
          github: "https://github.com/techclub/network-monitor",
          members: 2,
          featured: false,
        },
      ],
    },
    {
      id: "game",
      title: "Game Development",
      description: "Creating games using Unity, Unreal Engine, and web-based game frameworks.",
      icon: <Gamepad className="size-5" />,
      projects: [
        {
          name: "2D Platformer",
          description: "A 2D platformer game built with Unity. Features multiple levels, enemies, and power-ups.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Unity", "C#", "2D Graphics"],
          status: "Active",
          github: "https://github.com/techclub/2d-platformer",
          demo: "https://techclub.itch.io/platformer",
          members: 4,
          featured: true,
        },
        {
          name: "Browser Game",
          description:
            "A browser-based game using JavaScript and HTML5 Canvas. Multiplayer puzzle game with real-time competition.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["JavaScript", "HTML5 Canvas", "Socket.io"],
          status: "Active",
          github: "https://github.com/techclub/browser-game",
          demo: "https://browser-game.techclub.university.edu",
          members: 3,
          featured: true,
        },
        {
          name: "VR Experience",
          description: "Virtual reality experience showcasing the university campus with interactive elements.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Unity", "C#", "VR Development"],
          status: "In Development",
          github: "https://github.com/techclub/vr-campus",
          members: 5,
          featured: false,
        },
        {
          name: "Mobile RPG",
          description: "Role-playing game for mobile devices with turn-based combat and story-driven gameplay.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Unity", "C#", "Mobile Development"],
          status: "Planning",
          github: "https://github.com/techclub/mobile-rpg",
          members: 3,
          featured: false,
        },
      ],
    },
    {
      id: "robotics",
      title: "Robotics",
      description: "Building and programming robots for various competitions and projects.",
      icon: <Cpu className="size-5" />,
      projects: [
        {
          name: "Autonomous Robot",
          description:
            "An autonomous robot that can navigate through obstacles. Uses computer vision and machine learning for navigation.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Arduino", "Python", "Computer Vision"],
          status: "Active",
          github: "https://github.com/techclub/autonomous-robot",
          members: 6,
          featured: true,
        },
        {
          name: "Drone Project",
          description: "A custom-built drone with programmable flight patterns and aerial photography capabilities.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Raspberry Pi", "C++", "Flight Control"],
          status: "Active",
          github: "https://github.com/techclub/drone-project",
          members: 5,
          featured: true,
        },
        {
          name: "Robot Arm",
          description: "Robotic arm with precise movement control for small object manipulation.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Arduino", "Servo Motors", "3D Printing"],
          status: "In Development",
          github: "https://github.com/techclub/robot-arm",
          members: 4,
          featured: false,
        },
        {
          name: "Smart Home System",
          description: "IoT-based smart home system with voice control and automation features.",
          image: "/placeholder.svg?height=300&width=500",
          tags: ["Raspberry Pi", "IoT", "Voice Recognition"],
          status: "Planning",
          github: "https://github.com/techclub/smart-home",
          members: 3,
          featured: false,
        },
      ],
    },
  ]

  // Filter projects based on search query
  const filteredProjects = projectCategories.map((category) => {
    return {
      ...category,
      projects: category.projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    }
  })

  // Get all featured projects across categories
  const featuredProjects = projectCategories.flatMap((category) =>
    category.projects.filter((project) => project.featured),
  )

  return (
    <>
      <Navbar />
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
                  Projects
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">What We're Building</h1>
                <p className="text-lg text-muted-foreground">
                  Explore our ongoing projects across web development, cybersecurity, game development, and robotics.
                  Join a team or start your own project!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="rounded-full">
                    Join a Project
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Propose New Project
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
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="TechClub members working on projects"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Projects</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Highlighting some of our most exciting and impactful projects currently in development.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.slice(0, 3).map((project, i) => (
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
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            project.status === "Active"
                              ? "default"
                              : project.status === "In Development"
                                ? "secondary"
                                : "outline"
                          }
                          className="rounded-full"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, j) => (
                          <Badge key={j} variant="outline" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        <span>{project.members} team members</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <Link href={project.github} target="_blank">
                          <Github className="size-4 mr-1" />
                          GitHub
                        </Link>
                      </Button>
                      {project.demo && (
                        <Button size="sm" className="rounded-full" asChild>
                          <Link href={project.demo} target="_blank">
                            <ExternalLink className="size-4 mr-1" />
                            Demo
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Categories Section */}
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
                  <h2 className="text-3xl font-bold tracking-tight mb-2">All Projects</h2>
                  <p className="text-muted-foreground">Browse all our projects by category</p>
                </div>
                <div className="w-full md:w-64">
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>

              <Tabs defaultValue="web" className="w-full">
                <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                  <TabsList className="rounded-full p-1">
                    {projectCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="rounded-full px-4">
                        {category.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {filteredProjects.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    {category.projects.length > 0 ? (
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {category.projects.map((project, i) => (
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
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.name}
                                  fill
                                  className="object-cover transition-transform hover:scale-105"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge
                                    variant={
                                      project.status === "Active"
                                        ? "default"
                                        : project.status === "In Development"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="rounded-full"
                                  >
                                    {project.status}
                                  </Badge>
                                </div>
                              </div>
                              <CardHeader className="pb-2">
                                <CardTitle>{project.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.tags.map((tag, j) => (
                                    <Badge key={j} variant="outline" className="rounded-full">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="size-4" />
                                  <span>{project.members} team members</span>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <Button variant="outline" size="sm" className="rounded-full" asChild>
                                  <Link href={project.github} target="_blank">
                                    <Github className="size-4 mr-1" />
                                    GitHub
                                  </Link>
                                </Button>
                                {project.demo && (
                                  <Button size="sm" className="rounded-full" asChild>
                                    <Link href={project.demo} target="_blank">
                                      <ExternalLink className="size-4 mr-1" />
                                      Demo
                                    </Link>
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No projects found matching your search criteria.</p>
                        <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>
                          Clear Search
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Start a Project Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-border/40">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="Students brainstorming project ideas"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight">Start Your Own Project</h2>
                <p className="text-lg text-muted-foreground">
                  Have an idea for a project? We provide resources, mentorship, and a team of collaborators to help
                  bring your vision to life.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Calendar className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Project Proposal Meetings</h3>
                      <p className="text-muted-foreground">
                        Every first Monday of the month at 5:00 PM in Tech Building, Room 302
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Team Formation</h3>
                      <p className="text-muted-foreground">
                        We'll help you recruit team members with the skills needed for your project
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Code className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Technical Support</h3>
                      <p className="text-muted-foreground">
                        Access to mentors, resources, and infrastructure to support your development
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="rounded-full">
                  Submit Project Proposal
                  <ArrowRight className="ml-1 size-4" />
                </Button>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to Build Something Amazing?</h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join a project team or start your own. No experience necessary—just bring your enthusiasm and
                willingness to learn!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"https://discord.gg/pwcdweEwjM"}>
                <Button size="lg" variant="secondary" className="rounded-full">
                  
                  Join TechClub
                </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white text-white hover:bg-white/10"
                >
                  Browse All Projects
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


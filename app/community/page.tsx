"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronRight,
  MessageSquare,
  Users,
  Github,
  ExternalLink,
  ArrowRight,
  Gamepad,
  Code,
  Shield,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const communityPlatforms = [
    {
      name: "Discord Server",
      description: "Our primary communication platform for real-time chat, announcements, and collaboration.",
      icon: <MessageSquare className="size-6" />,
      link: "https://discord.gg/techclub",
      buttonText: "Join Discord",
      members: 215,
      featured: true,
    },
    {
      name: "GitHub Organization",
      description: "Collaborate on code, contribute to projects, and showcase your work.",
      icon: <Github className="size-6" />,
      link: "https://github.com/techclub",
      buttonText: "View GitHub",
      members: 178,
      featured: true,
    },
    {
      name: "Minecraft Server",
      description: "Relax and have fun with fellow members on our custom Minecraft server.",
      icon: <Gamepad className="size-6" />,
      link: "https://minecraft.techclub.university.edu",
      buttonText: "Server Details",
      members: 87,
      featured: true,
    },
    {
      name: "LinkedIn Group",
      description: "Connect professionally with current members and alumni for networking opportunities.",
      icon: <Users className="size-6" />,
      link: "https://linkedin.com/groups/techclub",
      buttonText: "Join Group",
      members: 156,
      featured: false,
    },
  ]

  const discussionCategories = [
    {
      name: "Web Development",
      description: "Discuss frontend, backend, and full-stack web development topics.",
      icon: <Code className="size-6" />,
      recentTopics: [
        {
          title: "React vs. Vue in 2025",
          author: "Sam Rodriguez",
          replies: 24,
          lastActive: "2 hours ago",
        },
        {
          title: "Best practices for API authentication",
          author: "Morgan Chen",
          replies: 18,
          lastActive: "1 day ago",
        },
        {
          title: "CSS Grid vs. Flexbox - when to use each",
          author: "Taylor Smith",
          replies: 32,
          lastActive: "3 days ago",
        },
      ],
    },
    {
      name: "Cybersecurity",
      description: "Share security news, tools, and techniques.",
      icon: <Shield className="size-6" />,
      recentTopics: [
        {
          title: "Analyzing the latest ransomware trends",
          author: "Jamie Lee",
          replies: 15,
          lastActive: "5 hours ago",
        },
        {
          title: "Setting up a home security lab",
          author: "Alex Johnson",
          replies: 29,
          lastActive: "2 days ago",
        },
        {
          title: "Web application penetration testing resources",
          author: "Casey Wong",
          replies: 21,
          lastActive: "4 days ago",
        },
      ],
    },
    {
      name: "Robotics",
      description: "Discuss hardware, sensors, and programming for robotics projects.",
      icon: <Cpu className="size-6" />,
      recentTopics: [
        {
          title: "Arduino vs. Raspberry Pi for robotics",
          author: "Jordan Patel",
          replies: 27,
          lastActive: "1 day ago",
        },
        {
          title: "Computer vision techniques for object detection",
          author: "Riley Kim",
          replies: 14,
          lastActive: "3 days ago",
        },
        {
          title: "Motor control best practices",
          author: "Alex Johnson",
          replies: 19,
          lastActive: "5 days ago",
        },
      ],
    },
  ]

  const communityMembers = [
    {
      name: "Alex Johnson",
      role: "Club President",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 47,
      joinDate: "September 2022",
    },
    {
      name: "Sam Rodriguez",
      role: "Web Development Lead",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 38,
      joinDate: "October 2022",
    },
    {
      name: "Jamie Lee",
      role: "Cybersecurity Lead",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 32,
      joinDate: "January 2023",
    },
    {
      name: "Taylor Smith",
      role: "Events Coordinator",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 29,
      joinDate: "September 2023",
    },
    {
      name: "Jordan Patel",
      role: "Robotics Lead",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 35,
      joinDate: "September 2022",
    },
    {
      name: "Casey Wong",
      role: "Outreach Coordinator",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 26,
      joinDate: "January 2023",
    },
    {
      name: "Morgan Chen",
      role: "Secretary",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 24,
      joinDate: "September 2023",
    },
    {
      name: "Riley Kim",
      role: "Marketing Director",
      image: "/placeholder.svg?height=100&width=100",
      contributions: 28,
      joinDate: "January 2023",
    },
  ]

  const communityGuidelines = [
    {
      title: "Be Respectful",
      description:
        "Treat all members with respect and courtesy. Harassment, discrimination, and offensive language are not tolerated.",
    },
    {
      title: "Share Knowledge",
      description: "Be generous with your knowledge and help others learn. Remember that everyone was a beginner once.",
    },
    {
      title: "Give Credit",
      description: "When sharing resources or code, always give proper attribution to the original creators.",
    },
    {
      title: "Stay On Topic",
      description: "Keep discussions relevant to the appropriate channels and categories to maintain organization.",
    },
    {
      title: "Respect Privacy",
      description: "Do not share personal information about yourself or others without explicit permission.",
    },
    {
      title: "No Spam",
      description: "Avoid excessive self-promotion, advertisements, or irrelevant links.",
    },
  ]

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
                  Community
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Connect & Collaborate</h1>
                <p className="text-lg text-muted-foreground">
                  Join our vibrant community of tech enthusiasts to share ideas, ask questions, and collaborate on
                  projects. Connect through various platforms and engage with fellow members.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="rounded-full">
                    Join Our Discord
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Browse Discussions
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
                    alt="TechClub community members collaborating"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Platforms Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Community Platforms</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Connect with TechClub members across multiple platforms for discussion, collaboration, and fun.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {communityPlatforms
                .filter((platform) => platform.featured)
                .map((platform, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                          {platform.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                        <p className="text-muted-foreground mb-4">{platform.description}</p>
                        <div className="text-sm text-muted-foreground mb-6 flex-grow">
                          <Users className="size-4 inline mr-1" />
                          {platform.members} members
                        </div>
                        <Button className="rounded-full w-full" asChild>
                          <Link href={platform.link} target="_blank">
                            {platform.buttonText}
                            <ExternalLink className="ml-1 size-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="#all-platforms">
                  View All Platforms
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Discussion Forums Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Discussion Forums</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Join the conversation in our topic-specific forums. Ask questions, share knowledge, and connect with
                members who share your interests.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {discussionCategories.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                          {category.icon}
                        </div>
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Recent Discussions</h4>
                      <div className="space-y-3">
                        {category.recentTopics.map((topic, j) => (
                          <div key={j} className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <Link href="#" className="font-medium hover:text-primary transition-colors">
                              {topic.title}
                            </Link>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>By {topic.author}</span>
                              <div className="flex items-center gap-2">
                                <span>{topic.replies} replies</span>
                                <span>•</span>
                                <span>{topic.lastActive}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="rounded-full w-full">
                        Browse All {category.name} Topics
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className="rounded-full">
                Start a New Discussion
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Active Members Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Active Community Members</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Meet some of our most active community contributors who help make TechClub a vibrant and supportive
                space.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {communityMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Avatar className="size-16 mb-3">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-primary mb-1">{member.role}</p>
                      <div className="text-xs text-muted-foreground space-y-1 mt-2">
                        <p>{member.contributions} contributions</p>
                        <p>Member since {member.joinDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Community Guidelines</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                To ensure a positive experience for everyone, we ask all members to follow these guidelines when
                participating in our community.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {communityGuidelines.map((guideline, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3">{guideline.title}</h3>
                      <p className="text-muted-foreground">{guideline.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-full">
                View Full Code of Conduct
              </Button>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight">Get Involved</h2>
                <p className="text-lg text-muted-foreground">
                  There are many ways to contribute to our community beyond just participating in discussions. Here are
                  some ways you can get more involved:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Become a Mentor</h3>
                      <p className="text-muted-foreground">Help newer members learn and grow their skills</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Host a Workshop</h3>
                      <p className="text-muted-foreground">
                        Share your expertise by teaching others in a structured format
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Contribute to Projects</h3>
                      <p className="text-muted-foreground">Join one of our ongoing projects or start your own</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <span className="text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Moderate Forums</h3>
                      <p className="text-muted-foreground">Help keep discussions on-topic and welcoming for everyone</p>
                    </div>
                  </li>
                </ul>
                <Button className="rounded-full">
                  Apply for Community Roles
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
                    alt="TechClub members collaborating on a project"
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Join Our Community Today</h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Connect with like-minded tech enthusiasts, share your knowledge, and grow your skills in a supportive
                environment.
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
                  Explore Discussions
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


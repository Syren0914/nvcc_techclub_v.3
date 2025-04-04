"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Check, ArrowRight, Users, Calendar, BookOpen, MessageSquare, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function JoinPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const membershipBenefits = [
    {
      title: "Access to All Events",
      description:
        "Attend workshops, hackathons, field trips, and social events. Some events are exclusive to members.",
      icon: <Calendar className="size-5 text-primary" />,
    },
    {
      title: "Project Collaboration",
      description: "Join project teams and collaborate with other members on exciting tech initiatives.",
      icon: <Users className="size-5 text-primary" />,
    },
    {
      title: "Learning Resources",
      description: "Access our library of tutorials, guides, and reference materials to enhance your skills.",
      icon: <BookOpen className="size-5 text-primary" />,
    },
    {
      title: "Community Access",
      description: "Join our Discord server, forums, and other community platforms to connect with fellow members.",
      icon: <MessageSquare className="size-5 text-primary" />,
    },
    {
      title: "GitHub Organization",
      description: "Contribute to club projects and showcase your work through our GitHub organization.",
      icon: <Github className="size-5 text-primary" />,
    },
    {
      title: "Networking Opportunities",
      description: "Connect with industry professionals, alumni, and potential employers at our events.",
      icon: <Users className="size-5 text-primary" />,
    },
  ]

  const membershipFAQs = [
    {
      question: "Who can join TechClub?",
      answer:
        "TechClub is open to all students at the college, regardless of major or technical background. We welcome members of all skill levels, from beginners to advanced.",
    },
    {
      question: "Is there a membership fee?",
      answer:
        "Yes, there is an annual membership fee of $20. This helps cover the cost of events, equipment, and other club activities. Fee waivers are available for students with financial need.",
    },
    {
      question: "How long does membership last?",
      answer:
        "Membership is valid for one academic year (September through August). You'll need to renew your membership at the beginning of each academic year.",
    },
    {
      question: "What is the time commitment?",
      answer:
        "The time commitment is flexible and depends on your level of involvement. General meetings are held weekly, but attendance is not mandatory. You can participate in as many or as few events and projects as you'd like.",
    },
    {
      question: "Do I need prior experience to join?",
      answer:
        "No prior experience is necessary! We have members of all skill levels, and many of our workshops and events are designed for beginners. We're here to learn together.",
    },
    {
      question: "How can I get more involved in the club?",
      answer:
        "Beyond general membership, you can join project teams, help organize events, run for leadership positions, or become a workshop presenter. Let us know your interests in the membership form!",
    },
    {
      question: "When will I hear back after applying?",
      answer:
        "We typically process membership applications within 1-2 business days. You'll receive a confirmation email with further instructions once your application is approved.",
    },
  ]

  const membershipLevels = [
    {
      name: "General Member",
      price: "$20/year",
      description: "Standard membership with access to all basic club benefits.",
      features: [
        "Access to all general meetings",
        "Participation in workshops and events",
        "Access to online resources",
        "Discord community access",
        "Eligible to join project teams",
      ],
      cta: "Apply Now",
      popular: false,
    },
    {
      name: "Project Contributor",
      price: "$20/year",
      description: "For members who want to actively contribute to club projects.",
      features: [
        "All General Member benefits",
        "GitHub organization membership",
        "Project team placement",
        "Development resources",
        "Project showcase opportunities",
      ],
      cta: "Apply Now",
      popular: true,
    },
    {
      name: "Workshop Presenter",
      price: "$20/year",
      description: "For members interested in sharing knowledge and leading workshops.",
      features: [
        "All General Member benefits",
        "Opportunity to lead workshops",
        "Presentation skill development",
        "Teaching resources and support",
        "Recognition on club website",
      ],
      cta: "Apply Now",
      popular: false,
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
                  Join TechClub
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Become a Member Today</h1>
                <p className="text-lg text-muted-foreground">
                  Join our community of tech enthusiasts to learn, build, and connect. Membership provides access to
                  events, resources, and collaboration opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="rounded-full">
                    Apply for Membership
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Learn More
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
                    alt="TechClub members collaborating"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Membership Benefits Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Membership Benefits</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                As a TechClub member, you'll gain access to a variety of resources and opportunities to enhance your
                technical skills and build your network.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {membershipBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Levels Section */}
        {/* <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Membership Levels</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Choose the membership level that best fits your interests and goals.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {membershipLevels.map((level, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex"
                >
                  <Card
                    className={`h-full overflow-hidden border-border/40 flex flex-col w-full ${level.popular ? "border-primary shadow-lg relative" : ""}`}
                  >
                    {level.popular && (
                      <div className="absolute top-0 right-0">
                        <Badge className="rounded-bl-lg rounded-tr-lg rounded-br-none rounded-tl-none">
                          Popular Choice
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{level.name}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                      <div className="mt-4 text-2xl font-bold">{level.price}</div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {level.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className={`w-full rounded-full ${level.popular ? "" : "variant-outline"}`}>
                        {level.cta}
                        <ArrowRight className="ml-1 size-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Application Form Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Membership Application</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Fill out the form below to apply for TechClub membership. We'll review your application and get back to
                you within 1-2 business days.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-border/40">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Tell us about yourself</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john.doe@vccs.email.edu" />
                      <p className="text-xs text-muted-foreground">Please use your college email if possible</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input id="major" placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Select>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate Student</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-border/40">
                  <CardHeader>
                    <CardTitle>Club Interests</CardTitle>
                    <CardDescription>Help us understand your interests and goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Areas of Interest (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          "Web Development",
                          "Cybersecurity",
                          "Game Development",
                          "Robotics",
                          "AI/ML",
                          "Mobile Development",
                          "DevOps",
                          "UI/UX Design",
                        ].map((interest, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`interest-${i}`} />
                            <Label htmlFor={`interest-${i}`} className="text-sm font-normal">
                              {interest}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Technical Experience Level</Label>
                      <RadioGroup defaultValue="beginner">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner" className="text-sm font-normal">
                            Beginner
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="intermediate" />
                          <Label htmlFor="intermediate" className="text-sm font-normal">
                            Intermediate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="advanced" />
                          <Label htmlFor="advanced" className="text-sm font-normal">
                            Advanced
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="membership-type">Preferred Membership Type</Label>
                      <Select>
                        <SelectTrigger id="membership-type">
                          <SelectValue placeholder="Select membership type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Member</SelectItem>
                          <SelectItem value="project">Project Contributor</SelectItem>
                          <SelectItem value="workshop">Workshop Presenter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goals">What do you hope to gain from TechClub?</Label>
                      <Textarea
                        id="goals"
                        placeholder="Share your goals and what you're looking to learn or contribute..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the TechClub{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Code of Conduct
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Membership
                  </Link>
                </Label>
              </div>
              <Button size="lg" className="rounded-full">
                Submit Application
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Applications are typically processed within 1-2 business days.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Have questions about TechClub membership? Find answers to common questions below.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {membershipFAQs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Still have questions? Feel free to reach out to us.</p>
              <Button variant="outline" className="rounded-full">
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Member Testimonials</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Hear from current and past members about their experiences with TechClub.
              </p>
            </motion.div>

            <Tabs defaultValue="current" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="rounded-full p-1">
                  <TabsTrigger value="current" className="rounded-full px-6">
                    Current Members
                  </TabsTrigger>
                  <TabsTrigger value="alumni" className="rounded-full px-6">
                    Alumni
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="current">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      quote:
                        "Joining TechClub was one of the best decisions I made in college. I've learned so much from the workshops and made great friends through project collaborations.",
                      name: "Emily Chen",
                      role: "Junior, Computer Science",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      quote:
                        "As someone with no prior coding experience, I was nervous about joining. But everyone was so welcoming and helpful. Now I'm leading my own web development project!",
                      name: "Marcus Johnson",
                      role: "Sophomore, Business Administration",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      quote:
                        "The networking opportunities through TechClub helped me land my dream internship. The resume workshops and mock interviews were incredibly valuable.",
                      name: "Sophia Patel",
                      role: "Senior, Computer Engineering",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((testimonial, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="mb-6 flex-grow">
                            <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              width={50}
                              height={50}
                              alt={testimonial.name}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-bold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alumni">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      quote:
                        "The skills I gained through TechClub projects directly translated to my career. Four years later, I still use the connections I made through the club.",
                      name: "David Kim",
                      role: "Software Engineer at Google, Class of 2022",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      quote:
                        "Being part of the TechClub leadership team taught me valuable management skills that helped me start my own tech company after graduation.",
                      name: "Aisha Johnson",
                      role: "Startup Founder, Class of 2021",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    {
                      quote:
                        "TechClub gave me the confidence to pursue a career in cybersecurity despite starting with zero experience. The mentorship was invaluable.",
                      name: "Michael Rodriguez",
                      role: "Security Analyst at Microsoft, Class of 2023",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                  ].map((testimonial, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="mb-6 flex-grow">
                            <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              width={50}
                              height={50}
                              alt={testimonial.name}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-bold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to Join Our Community?</h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Apply for membership today and start your journey with TechClub. We can't wait to welcome you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Apply for Membership
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white text-white hover:bg-white/10"
                >
                  Contact Us
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


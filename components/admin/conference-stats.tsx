"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  UserCheck, 
  Clock, 
  BarChart3, 
  Calendar,
  GraduationCap,
  Mail,
  QrCode,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConferenceStats {
  summary: {
    totalRegistrations: number
    checkedInCount: number
    pendingCheckIn: number
    checkInRate: number
  }
  breakdown: {
    majorStats: Record<string, number>
    participationStats: Record<string, number>
    ageStats: Record<string, number>
    registrationsByDay: Record<string, number>
  }
  recentRegistrations: Array<{
    id: string
    name: string
    email: string
    major: string
    age?: number
    participation: string
    checked_in: boolean
    checked_in_at?: string
    created_at: string
    unique_code: string
  }>
  allRegistrations: Array<{
    id: string
    name: string
    email: string
    major: string
    age?: number
    participation: string
    expectations?: string
    checked_in: boolean
    checked_in_at?: string
    created_at: string
    unique_code: string
  }>
}

export default function ConferenceStats() {
  const [stats, setStats] = useState<ConferenceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [checkingIn, setCheckingIn] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setError('Authentication required. Please sign in.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/conference-stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Failed to fetch conference statistics')
      }
    } catch (err) {
      setError('Error loading conference statistics')
      console.error('Error fetching conference stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (uniqueCode: string, registrationId: string) => {
    setCheckingIn(registrationId)
    try {
      const response = await fetch('/api/conference/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: uniqueCode,
          check_in: true
        }),
      })

      if (response.ok) {
        // Refresh stats to update check-in status
        fetchStats()
      } else {
        setError('Failed to check in attendee')
      }
    } catch (err) {
      setError('Error checking in attendee')
      console.error('Error checking in:', err)
    } finally {
      setCheckingIn(null)
    }
  }

  const getStatusBadge = (checkedIn: boolean) => {
    return checkedIn ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Checked In
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const downloadQR = (uniqueCode: string, name: string) => {
    const link = document.createElement('a')
    link.href = `/api/conference/qr?code=${uniqueCode}&download=true`
    link.download = `conference-qr-${name.replace(/\s+/g, '-').toLowerCase()}.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading conference statistics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No conference data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.summary.totalRegistrations}</p>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.summary.checkedInCount}</p>
                <p className="text-sm text-muted-foreground">Checked In</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.summary.pendingCheckIn}</p>
                <p className="text-sm text-muted-foreground">Pending Check-in</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.summary.checkInRate}%</p>
                <p className="text-sm text-muted-foreground">Check-in Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">All Attendees</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest 10 conference registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{registration.name}</p>
                        <p className="text-sm text-muted-foreground">{registration.major}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(registration.checked_in)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{registration.name}</DialogTitle>
                              <DialogDescription>Registration Details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div><strong>Email:</strong> {registration.email}</div>
                              <div><strong>Major:</strong> {registration.major}</div>
                              <div><strong>Age:</strong> {registration.age || 'Not specified'}</div>
                              <div><strong>Participation:</strong> {registration.participation}</div>
                              <div><strong>Status:</strong> {getStatusBadge(registration.checked_in)}</div>
                              <div><strong>Code:</strong> {registration.unique_code}</div>
                              {registration.checked_in_at && (
                                <div><strong>Checked in at:</strong> {new Date(registration.checked_in_at).toLocaleString()}</div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Major Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Registration by Major</CardTitle>
                <CardDescription>Distribution of attendees by academic major</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.breakdown.majorStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([major, count]) => (
                    <div key={major} className="flex items-center justify-between">
                      <span className="text-sm">{major}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(count / stats.summary.totalRegistrations) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Conference Attendees ({stats.summary.totalRegistrations})</CardTitle>
              <CardDescription>Complete list of conference registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Major</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.allRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.major}</TableCell>
                      <TableCell>{registration.age || '-'}</TableCell>
                      <TableCell>{getStatusBadge(registration.checked_in)}</TableCell>
                      <TableCell>{new Date(registration.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!registration.checked_in && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckIn(registration.unique_code, registration.id)}
                              disabled={checkingIn === registration.id}
                              title="Check In"
                            >
                              {checkingIn === registration.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQR(registration.unique_code, registration.name)}
                            title="Download QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{registration.name}</DialogTitle>
                                <DialogDescription>Complete Registration Details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3">
                                <div><strong>Email:</strong> {registration.email}</div>
                                <div><strong>Major:</strong> {registration.major}</div>
                                <div><strong>Age:</strong> {registration.age || 'Not specified'}</div>
                                <div><strong>Participation:</strong> {registration.participation}</div>
                                {registration.expectations && (
                                  <div><strong>Expectations:</strong> {registration.expectations}</div>
                                )}
                                <div><strong>Status:</strong> {getStatusBadge(registration.checked_in)}</div>
                                <div><strong>Unique Code:</strong> {registration.unique_code}</div>
                                <div><strong>Registered:</strong> {new Date(registration.created_at).toLocaleString()}</div>
                                {registration.checked_in_at && (
                                  <div><strong>Checked in:</strong> {new Date(registration.checked_in_at).toLocaleString()}</div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Attendees by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.breakdown.ageStats).map(([ageGroup, count]) => (
                    <div key={ageGroup} className="flex items-center justify-between">
                      <span className="text-sm">{ageGroup}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(count / stats.summary.totalRegistrations) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participation Type */}
            <Card>
              <CardHeader>
                <CardTitle>Participation Types</CardTitle>
                <CardDescription>How attendees plan to participate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.breakdown.participationStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(count / stats.summary.totalRegistrations) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

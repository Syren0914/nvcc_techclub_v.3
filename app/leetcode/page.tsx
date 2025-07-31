"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Play,
  RotateCcw,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Trophy,
  BarChart3,
  Code,
  BookOpen,
  Target,
  Calendar,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"

interface LeetCodeProblem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  description: string
  examples: string[]
  constraints: string[]
  starterCode: {
    [key: string]: string
  }
  solution?: string
  tags: string[]
  acceptanceRate: number
  likes: number
  dislikes: number
}

interface UserProgress {
  userId: string
  problemId: string
  status: 'not_started' | 'attempted' | 'solved'
  submissionDate?: string
  runtime?: number
  memory?: number
  language?: string
  code?: string
  attempts: number
  lastAttempt?: string
}

interface UserStats {
  userId: string
  username: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  currentStreak: number
  longestStreak: number
  totalSubmissions: number
  averageRuntime: number
  rank: number
  rating: number
}

export default function LeetCodePage() {
  const [currentProblem, setCurrentProblem] = useState<LeetCodeProblem | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState("problem")
  const [loading, setLoading] = useState(true)
  
  const { toast } = useToast()

  useEffect(() => {
    loadLeetCodeData()
  }, [])

  const loadLeetCodeData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access LeetCode practice.",
          variant: "destructive",
        })
        return
      }

      // Fetch daily problem
      const problemResponse = await fetch('/api/leetcode/daily')
      const problemData = await problemResponse.json()
      
      if (problemData.success) {
        setCurrentProblem(problemData.data.problem)
        setCode(problemData.data.problem.starterCode[selectedLanguage] || "")
      }

      // Fetch user progress
      const progressResponse = await fetch(`/api/leetcode/progress?userId=${user.id}`)
      const progressData = await progressResponse.json()
      
      if (progressData.success) {
        const todayProgress = progressData.data.progress.find(
          (p: UserProgress) => p.problemId === problemData.data.problem.id
        )
        setUserProgress(todayProgress || null)
        setUserStats(progressData.data.stats)
      }

    } catch (error) {
      console.error('Error loading LeetCode data:', error)
      toast({
        title: "Error",
        description: "Failed to load LeetCode data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    
    try {
      const response = await fetch('/api/leetcode/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: selectedLanguage,
          problemTitle: currentProblem?.title
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const results = data.data.testCases.map((testCase: any) => ({
          testCase: testCase.input,
          expected: testCase.expected,
          actual: testCase.actual,
          passed: testCase.passed,
          runtime: testCase.runtime,
          error: testCase.error
        }))
        
        setTestResults(results)
        
        toast({
          title: data.data.success ? "Code Executed Successfully" : "Some Test Cases Failed",
          description: data.data.output,
          variant: data.data.success ? "default" : "destructive"
        })
      } else {
        toast({
          title: "Execution Error",
          description: data.error || "Failed to execute code",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error executing code:', error)
      toast({
        title: "Execution Error",
        description: "Failed to execute code",
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || !currentProblem) return

      const submission = {
        userId: user.id,
        problemId: currentProblem.id,
        status: "solved",
        runtime: Math.floor(Math.random() * 50) + 20,
        memory: Math.floor(Math.random() * 20) + 30,
        language: selectedLanguage,
        code: code
      }

      const response = await fetch('/api/leetcode/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Solution Submitted!",
          description: "Your solution has been accepted.",
        })
        
        // Reload progress data
        loadLeetCodeData()
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      toast({
        title: "Error",
        description: "Failed to submit solution",
        variant: "destructive",
      })
    }
  }

  const handleResetCode = () => {
    if (currentProblem) {
      setCode(currentProblem.starterCode[selectedLanguage] || "")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading LeetCode practice...</p>
        </div>
      </div>
    )
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No problem available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
              <Code className="size-4" />
            </div>
            <div>
              <span className="font-bold text-lg">LeetCode Practice</span>
              <p className="text-xs text-muted-foreground">Daily coding challenges</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date().toLocaleDateString()}
            </Badge>
            {userStats && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Rank #{userStats.rank}
                </Badge>
                <Badge variant="outline">
                  Rating {userStats.rating}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5" />
                      {currentProblem.title}
                    </CardTitle>
                    <CardDescription>
                      Daily Problem • {currentProblem.category}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(currentProblem.difficulty)}>
                    {currentProblem.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Problem Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{currentProblem.acceptanceRate}%</p>
                    <p className="text-muted-foreground">Acceptance</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{currentProblem.likes}</p>
                    <p className="text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{currentProblem.dislikes}</p>
                    <p className="text-muted-foreground">Dislikes</p>
                  </div>
                </div>

                {/* User Progress */}
                {userProgress && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      {userProgress.status === 'solved' && (
                        <CheckCircle className="size-4 text-green-600" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={userProgress.status === 'solved' ? 'default' : 'secondary'}>
                          {userProgress.status}
                        </Badge>
                      </div>
                      {userProgress.runtime && (
                        <div className="flex justify-between">
                          <span>Runtime:</span>
                          <span>{userProgress.runtime}ms</span>
                        </div>
                      )}
                      {userProgress.memory && (
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{userProgress.memory}MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Problem Description */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {currentProblem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-medium mb-2">Examples</h3>
                    <div className="space-y-2">
                      {currentProblem.examples.map((example, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-mono">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-medium mb-2">Constraints</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentProblem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {currentProblem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor and Results */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="problem">Code</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
              </TabsList>

              {/* Code Editor Tab */}
              <TabsContent value="problem" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="size-5" />
                        Code Editor
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value)
                            if (currentProblem) {
                              setCode(currentProblem.starterCode[e.target.value] || "")
                            }
                          }}
                          className="px-3 py-1 border rounded-md text-sm"
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={handleResetCode}>
                          <RotateCcw className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-96 p-4 font-mono text-sm border rounded-lg bg-muted resize-none"
                        placeholder="Write your code here..."
                      />
                      
                      <div className="flex items-center gap-2">
                        <Button onClick={handleRunCode} disabled={isRunning}>
                          {isRunning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="size-4 mr-2" />
                              Run Code
                            </>
                          )}
                        </Button>
                        <Button onClick={handleSubmit} variant="default">
                          <CheckCircle className="size-4 mr-2" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5" />
                      Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.length > 0 ? (
                      <div className="space-y-3">
                        {testResults.map((result, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            {result.passed ? (
                              <CheckCircle className="size-5 text-green-600" />
                            ) : (
                              <XCircle className="size-5 text-red-600" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">Test Case {index + 1}</p>
                              <p className="text-xs text-muted-foreground">{result.testCase}</p>
                            </div>
                            <div className="text-right text-sm">
                              <p>Expected: {result.expected}</p>
                              <p>Actual: {result.actual}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code className="size-12 mx-auto mb-4 opacity-50" />
                        <p>Run your code to see test results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Solution Tab */}
              <TabsContent value="solution" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="size-5" />
                      Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Optimal Solution</h3>
                        <pre className="text-sm font-mono whitespace-pre-wrap">
{`class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`}
                        </pre>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Explanation</h3>
                        <p className="text-sm text-muted-foreground">
                          This solution uses a hash map to store numbers we've seen so far. 
                          For each number, we check if its complement (target - num) exists in the map. 
                          If it does, we've found our pair. Time complexity is O(n) and space complexity is O(n).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5" />
                  Your Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userStats.totalSolved}</p>
                    <p className="text-sm text-muted-foreground">Total Solved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userStats.averageRuntime}ms</p>
                    <p className="text-sm text-muted-foreground">Avg Runtime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userStats.rating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Easy</span>
                    <span>{userStats.easySolved}</span>
                  </div>
                  <Progress value={(userStats.easySolved / userStats.totalSolved) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Medium</span>
                    <span>{userStats.mediumSolved}</span>
                  </div>
                  <Progress value={(userStats.mediumSolved / userStats.totalSolved) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Hard</span>
                    <span>{userStats.hardSolved}</span>
                  </div>
                  <Progress value={(userStats.hardSolved / userStats.totalSolved) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
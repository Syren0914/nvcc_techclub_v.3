import { NextResponse } from 'next/server'

interface TestCase {
  input: string
  expected: string
  description: string
}

interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  runtime?: number
  memory?: number
  testCases: TestCaseResult[]
}

interface TestCaseResult {
  input: string
  expected: string
  actual: string
  passed: boolean
  runtime?: number
  error?: string
}

// Simple code execution for demonstration
// In production, you would use a proper code execution service like Judge0, Docker, or AWS Lambda
async function executeCode(code: string, language: string, testCases: TestCase[]): Promise<ExecutionResult> {
  const startTime = Date.now()
  
  try {
    console.log(`🔄 Executing ${language} code...`)
    
    // Simulate code execution with realistic delays
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const executionTime = Date.now() - startTime
    const memoryUsage = Math.floor(Math.random() * 50) + 20 // Simulated memory usage
    
    // Process test cases based on language
    const testCaseResults: TestCaseResult[] = testCases.map((testCase, index) => {
      // Simulate different outcomes based on code quality
      const isCorrect = Math.random() > 0.1 // 90% success rate for demo
      const testRuntime = Math.floor(Math.random() * 50) + 10
      
      if (isCorrect) {
        return {
          input: testCase.input,
          expected: testCase.expected,
          actual: testCase.expected, // Correct output
          passed: true,
          runtime: testRuntime
        }
      } else {
        return {
          input: testCase.input,
          expected: testCase.expected,
          actual: "Wrong Answer", // Simulated wrong answer
          passed: false,
          runtime: testRuntime,
          error: "Incorrect output"
        }
      }
    })
    
    const allPassed = testCaseResults.every(result => result.passed)
    
    return {
      success: allPassed,
      output: allPassed ? "All test cases passed!" : "Some test cases failed",
      runtime: executionTime,
      memory: memoryUsage,
      testCases: testCaseResults
    }
    
  } catch (error) {
    return {
      success: false,
      output: "Execution failed",
      error: error instanceof Error ? error.message : "Unknown error",
      testCases: []
    }
  }
}

// Generate test cases based on problem
function generateTestCases(problemTitle: string): TestCase[] {
  const testCases: TestCase[] = []
  
  switch (problemTitle.toLowerCase()) {
    case 'two sum':
      testCases.push(
        {
          input: "nums = [2,7,11,15], target = 9",
          expected: "[0,1]",
          description: "Basic two sum case"
        },
        {
          input: "nums = [3,2,4], target = 6",
          expected: "[1,2]",
          description: "Target in middle"
        },
        {
          input: "nums = [3,3], target = 6",
          expected: "[0,1]",
          description: "Same numbers"
        }
      )
      break
      
    case 'add two numbers':
      testCases.push(
        {
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          expected: "[7,0,8]",
          description: "Basic addition"
        },
        {
          input: "l1 = [0], l2 = [0]",
          expected: "[0]",
          description: "Zero case"
        }
      )
      break
      
    default:
      // Generic test cases for unknown problems
      testCases.push(
        {
          input: "test input",
          expected: "expected output",
          description: "Sample test case"
        }
      )
  }
  
  return testCases
}

// Validate code syntax (basic validation)
function validateCode(code: string, language: string): { valid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Code cannot be empty" }
  }
  
  switch (language) {
    case 'python':
      // Basic Python syntax check
      if (!code.includes('class Solution:') && !code.includes('def ')) {
        return { valid: false, error: "Python code should contain a Solution class or function" }
      }
      break
      
    case 'javascript':
      // Basic JavaScript syntax check
      if (!code.includes('function') && !code.includes('=>') && !code.includes('var ') && !code.includes('let ') && !code.includes('const ')) {
        return { valid: false, error: "JavaScript code should contain a function declaration" }
      }
      break
      
    case 'java':
      // Basic Java syntax check
      if (!code.includes('class Solution') && !code.includes('public ')) {
        return { valid: false, error: "Java code should contain a Solution class" }
      }
      break
  }
  
  return { valid: true }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, language, problemTitle } = body
    
    if (!code || !language) {
      return NextResponse.json({
        success: false,
        error: 'Code and language are required'
      })
    }
    
    console.log(`🔄 Code execution request:`, {
      language,
      problemTitle,
      codeLength: code.length
    })
    
    // Validate code syntax
    const validation = validateCode(code, language)
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error
      })
    }
    
    // Generate test cases for the problem
    const testCases = generateTestCases(problemTitle || 'Two Sum')
    
    // Execute the code
    const result = await executeCode(code, language, testCases)
    
    console.log('✅ Code execution completed:', {
      success: result.success,
      testCasesPassed: result.testCases.filter(t => t.passed).length,
      totalTestCases: result.testCases.length,
      runtime: result.runtime
    })
    
    return NextResponse.json({
      success: true,
      data: result
    })
    
  } catch (error) {
    console.error('❌ Code execution error:', error)
    return NextResponse.json({
      success: false,
      error: 'Code execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// For production, you would integrate with a real code execution service:

/*
// Example with Judge0 API
async function executeWithJudge0(code: string, language: string, testCases: TestCase[]) {
  const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
  
  // Create submission
  const submission = await fetch(`${JUDGE0_API_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    body: JSON.stringify({
      source_code: code,
      language_id: getLanguageId(language),
      stdin: testCases[0].input
    })
  })
  
  // Get results
  const result = await fetch(`${JUDGE0_API_URL}/submissions/${submission.id}`)
  
  return result.json()
}

// Example with Docker
async function executeWithDocker(code: string, language: string) {
  const { exec } = require('child_process')
  
  return new Promise((resolve, reject) => {
    const containerName = `leetcode-${Date.now()}`
    const command = `docker run --rm --name ${containerName} -v /tmp/code:/code ${language}-runner /code/solution`
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ output: stdout, error: stderr })
      }
    })
  })
}

// Example with AWS Lambda
async function executeWithLambda(code: string, language: string) {
  const AWS = require('aws-sdk')
  const lambda = new AWS.Lambda()
  
  const params = {
    FunctionName: 'leetcode-executor',
    Payload: JSON.stringify({ code, language })
  }
  
  const result = await lambda.invoke(params).promise()
  return JSON.parse(result.Payload)
}
*/ 
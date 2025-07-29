"use client"

import { useState } from "react"

export default function TestDashboard() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Dashboard Test Page</h1>
        <p className="text-muted-foreground">If you can see this, the dashboard route is working!</p>
        <div className="space-y-2">
          <p>Counter: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Increment
          </button>
        </div>
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-bold mb-2">Debug Info:</h2>
          <p>URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
        </div>
      </div>
    </div>
  )
} 
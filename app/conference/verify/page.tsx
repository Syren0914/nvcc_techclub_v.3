"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

function VerifyClient() {
  const params = useSearchParams()
  const initialCode = params.get('code') || ''
  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { valid: boolean; message?: string; attendee?: any; check_in?: boolean }>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [scanning, setScanning] = useState(false)

  const verify = async (doCheckIn: boolean) => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/conference/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, check_in: doCheckIn })
      })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
      } else {
        setResult({ valid: false, message: data.error || data.message || 'Invalid code' })
      }
    } catch (err) {
      setResult({ valid: false, message: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialCode) {
      verify(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="md:grid md:grid-cols-2 gap-8 items-start">
          <div className="hidden md:block" />
          <div className="md:ml-auto max-w-xl w-full">
            <div className="mb-8 text-right md:text-left">
              <h1 className="text-3xl font-bold mb-2">Conference Check-in</h1>
              <p className="text-muted-foreground">Scan your QR or enter your code.</p>
            </div>

            <Card>
          <CardHeader>
            <CardTitle>Verify Code</CardTitle>
            <CardDescription>Validate a registration code and optionally check in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ABC123XYZ" />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => verify(false)} disabled={loading || !code}>
                {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying...</>) : 'Verify'}
              </Button>
              <Button onClick={() => verify(true)} disabled={loading || !code} variant="secondary">
                {loading ? 'Please wait...' : 'Check In'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (scanning) {
                    setScanning(false)
                    const stream = videoRef.current?.srcObject as MediaStream
                    stream?.getTracks().forEach(t => t.stop())
                    videoRef.current && (videoRef.current.srcObject = null)
                    return
                  }
                  try {
                    setScanning(true)
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    if (videoRef.current) {
                      videoRef.current.srcObject = stream
                      await videoRef.current.play()
                    }
                    const { BrowserQRCodeReader } = await import('@zxing/browser')
                    const codeReader = new BrowserQRCodeReader()
                    const result = await codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (res) => {
                      if (res) {
                        setCode(res.getText().split('code=')[1] || res.getText())
                      }
                    })
                  } catch (err) {
                    setScanning(false)
                  }
                }}
              >
                {scanning ? 'Stop Camera' : 'Scan QR'}
              </Button>
            </div>

            {scanning && (
              <div className="mt-2">
                <video ref={videoRef} className="w-full max-w-sm rounded border" muted playsInline />
              </div>
            )}

            {result && (
              <Alert className={result.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {result.valid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  {result.valid ? (
                    <div>
                      <div className="font-medium">Valid registration</div>
                      {result.attendee && (
                        <div className="text-sm mt-1">{result.attendee.first_name} {result.attendee.last_name} ({result.attendee.email})</div>
                      )}
                      {result.check_in && (
                        <div className="text-sm mt-1">Checked in successfully.</div>
                      )}
                    </div>
                  ) : (
                    <div className="font-medium">{result.message || 'Invalid code'}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <VerifyClient />
    </Suspense>
  )
}

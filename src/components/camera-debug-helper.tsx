"use client"

import { useState } from "react"
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function CameraDebugHelper() {
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState<"unknown" | "checking" | "success" | "error">("unknown")
  const [videoVisible, setVideoVisible] = useState(false)
  const [testVideoUrl, setTestVideoUrl] = useState<string | null>(null)

  const checkCameraSupport = async () => {
    setDebugInfo(null)
    setError(null)
    setCameraStatus("checking")
    setVideoVisible(false)
    setTestVideoUrl(null)

    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Your browser doesn't support camera access. Try using Chrome or Firefox.")
        setCameraStatus("error")
        return
      }

      // Try to get the list of devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        setError("No camera detected on your device.")
        setCameraStatus("error")
        return
      }

      // Try to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      // If we get here, camera access was successful
      const tracks = stream.getVideoTracks()

      // Get camera info
      const cameraInfo = tracks
        .map((track) => {
          const settings = track.getSettings()
          return `Camera: ${track.label}\nResolution: ${settings.width}x${settings.height}`
        })
        .join("\n\n")

      setDebugInfo(`Camera access successful!\n\nDetected ${videoDevices.length} camera(s):\n${cameraInfo}`)
      setCameraStatus("success")

      // Create a test video URL
      const videoElement = document.createElement("video")
      videoElement.srcObject = stream
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch((e) => console.error("Error playing test video:", e))
      }
      setVideoVisible(true)
      setTestVideoUrl(URL.createObjectURL(stream))

      // Don't stop the stream yet - let the user see if the camera works
    } catch (err) {
      console.error("Camera debug error:", err)
      setError(`Camera access failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      setCameraStatus("error")
    }
  }

  const stopTestVideo = () => {
    if (testVideoUrl) {
      URL.revokeObjectURL(testVideoUrl)
      setTestVideoUrl(null)
      setVideoVisible(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Camera Troubleshooting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={checkCameraSupport}
          className="w-full"
          disabled={cameraStatus === "checking"}
        >
          {cameraStatus === "checking" ? "Checking Camera..." : "Check Camera Support"}
        </Button>

        {cameraStatus === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">Camera is working properly!</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {videoVisible && testVideoUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Test Camera Feed:</p>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video src={testVideoUrl} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <Button size="sm" variant="outline" onClick={stopTestVideo} className="w-full">
              Stop Test Video
            </Button>
          </div>
        )}

        {debugInfo && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Debug Information:</p>
            <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap overflow-auto max-h-40">
              {debugInfo}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p className="font-medium mb-1">Common Camera Issues:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Browser permissions not granted for camera access</li>
            <li>Another application is using the camera</li>
            <li>Camera hardware issues or drivers</li>
            <li>Privacy settings blocking camera access</li>
            <li>Firewall or security software blocking access</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

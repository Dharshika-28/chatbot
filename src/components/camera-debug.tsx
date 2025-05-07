"use client"

import { useState } from "react"
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle } from "lucide-react"

export function CameraDebug() {
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkCameraSupport = async () => {
    setDebugInfo(null)
    setError(null)

    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Your browser doesn't support camera access. Try using Chrome or Firefox.")
        return
      }

      // Try to get the list of devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        setError("No camera detected on your device.")
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

      // Stop the stream
      tracks.forEach((track) => track.stop())
    } catch (err) {
      console.error("Camera debug error:", err)
      setError(`Camera access failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium mb-2">Camera Troubleshooting</h3>

      <Button variant="outline" size="sm" onClick={checkCameraSupport} className="mb-3 w-full">
        Check Camera Support
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">{debugInfo}</pre>
      )}

      <div className="text-xs text-gray-500 mt-2">
        <p className="mb-1">Tips for camera issues:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Check browser permissions for camera access</li>
          <li>Try using Chrome or Firefox for best compatibility</li>
          <li>Make sure no other app is using your camera</li>
          <li>Try uploading images instead if camera doesn't work</li>
        </ul>
      </div>
    </div>
  )
}

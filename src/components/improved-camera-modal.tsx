"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, RefreshCw, Check } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onImageCapture: (imageData: string) => void
  onTroubleshoot?: () => void
  title?: string
  purpose?: "pest" | "soil" | "general"
}

export function ImprovedCameraModal({
  isOpen,
  onClose,
  onImageCapture,
  onTroubleshoot,
  title = "Capture Image",
  purpose = "general",
}: CameraModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  useEffect(() => {
    if (!isOpen) {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      setCameraError(null)
      setIsCapturing(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.error("Error playing video:", err)
              setCameraError("Could not start video stream. Please try again.")
            })
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Could not access camera. Please check permissions.")
      setIsCapturing(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const captureImage = () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageData)
      stopCamera()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCapturedImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (capturedImage) {
      onImageCapture(capturedImage)
      onClose()
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setCameraError(null)
  }

  const getPurposeHint = () => {
    switch (purpose) {
      case "pest":
        return "For best results, capture a clear image of the pest or affected plant area."
      case "soil":
        return "Ensure good lighting and capture the soil sample clearly."
      default:
        return "Position the subject in the center of the frame."
    }
  }

  const toggleCamera = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setFacingMode(facingMode === "environment" ? "user" : "environment")
    startCamera()
  }

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {!capturedImage && !isCapturing && !cameraError && (
            <div className="flex flex-col items-center justify-center w-full h-64 bg-muted/10 rounded-lg border-2 border-dashed border-muted">
              <div className="text-muted-foreground text-center p-4">
                <div className="flex justify-center mb-2">
                  <Camera className="h-10 w-10 opacity-50" />
                </div>
                <p>No image captured</p>
                <p className="text-xs mt-2 max-w-xs">{getPurposeHint()}</p>
              </div>
            </div>
          )}

          {isCapturing && (
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)" }}
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <span className="animate-pulse mr-1 h-2 w-2 bg-white rounded-full"></span>
                Camera Active
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <button
                  onClick={captureImage}
                  className="bg-white rounded-full p-3 shadow-lg"
                  aria-label="Capture photo"
                >
                  <div className="h-12 w-12 rounded-full border-2 border-gray-500"></div>
                </button>

                {isMobileDevice() && (
                  <button
                    onClick={toggleCamera}
                    className="absolute right-4 bottom-4 bg-white/80 rounded-full p-2 shadow-lg"
                    aria-label="Switch camera"
                  >
                    <RefreshCw className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          {isCapturing && cameraError && <div className="mt-2 text-destructive text-sm">{cameraError}</div>}

          {capturedImage && (
            <div className="relative w-full">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-2 right-2">
                <Button size="sm" variant="secondary" className="bg-white/80 backdrop-blur-sm" onClick={resetCapture}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retake
                </Button>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="text-destructive text-center p-4">
              <p>{cameraError}</p>
              <Button variant="outline" onClick={resetCapture} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {cameraError && (
            <Button
              variant="link"
              size="sm"
              className="text-xs text-blue-600 mt-2"
              onClick={() => {
                onClose()
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("show-camera-debug"))
                }
              }}
            >
              Camera not working? Click for troubleshooting
            </Button>
          )}

          <div className="flex gap-2 w-full">
            {!isCapturing && !capturedImage && (
              <>
                <Button className="flex-1 bg-green-500 text-white" onClick={startCamera} variant="default">
                  <Camera className="h-4 w-4 mr-2" />
                  Open Camera
                </Button>
                <div className="relative flex-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </>
            )}

            {capturedImage && (
              <Button className="flex-1" onClick={handleConfirm} variant="default">
                <Check className="h-4 w-4 mr-2" />
                Use This Image
              </Button>
            )}

            {isCapturing && (
              <Button className="flex-1" onClick={stopCamera} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

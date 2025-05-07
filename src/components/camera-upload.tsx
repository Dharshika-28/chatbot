"use client"

import { useState, useRef } from "react"
import { ImageIcon, X, Upload, AlertCircle, Check } from "lucide-react"
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import { Alert, AlertDescription } from './ui/alert'
import { ImprovedCameraModal } from "./improved-camera-modal"

interface CameraUploadProps {
  onImageCapture: (imageData: string) => void
  onClose: () => void
  onTroubleshoot?: () => void
  className?: string
  purpose?: "pest" | "soil" | "general"
}

export function CameraUpload({
  onImageCapture,
  onClose,
  onTroubleshoot,
  className,
  purpose = "general"
}: CameraUploadProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        setCapturedImage(result)
      }
    }
    reader.onerror = () => {
      setError("Failed to read image file")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (capturedImage) {
      onImageCapture(capturedImage)
      onClose()
    }
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

  const handleCaptureFromModal = (imageData: string) => {
    setCapturedImage(imageData)
    setIsModalOpen(false)
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-lg p-4 w-full max-w-md", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Capture Image</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        {!capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm text-center px-4">{getPurposeHint()}</p>
          </div>
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured preview"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {!capturedImage ? (
          <>
           <Button variant="outline" className="flex-1 bg-green-600 text-white" onClick={() => setIsModalOpen(true)}>
              Open Camera
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Button>            
          </>
        ) : (
          <>
            <Button onClick={handleSubmit} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Use This Image
            </Button>
            <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1">
              Retake Photo
            </Button>
          </>
        )}
      </div>

      {onTroubleshoot && (
        <Button variant="link" className="mt-2 text-sm" onClick={onTroubleshoot}>
          Having camera issues?
        </Button>
      )}

      <ImprovedCameraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageCapture={handleCaptureFromModal}
        onTroubleshoot={onTroubleshoot}
        purpose={purpose}
      />
    </div>
  )
}

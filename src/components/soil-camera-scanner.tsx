"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Loader2, Globe, Camera, X, AlertCircle } from "lucide-react"
import { ImprovedCameraModal } from './improved-camera-modal'

interface SoilCameraScannerProps {
  onScanComplete?: (result: SoilScanResult) => void
  onClose?: () => void
}

interface SoilScanResult {
  soilColor: string
  soilType: string
  phEstimate: string
  imageData: string
  timestamp: string
}

export function SoilCameraScanner({ onScanComplete, onClose }: SoilCameraScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanResult, setScanResult] = useState<SoilScanResult | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setIsModalOpen(false)
    analyzeSoilImage(imageData)
  }

  const analyzeSoilImage = async (imageData: string) => {
    setIsAnalyzing(true)
    setScanError(null)

    try {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Could not get canvas context")

        ctx.drawImage(img, 0, 0)

        const centerX = Math.floor(canvas.width / 2)
        const centerY = Math.floor(canvas.height / 2)
        const sampleSize = 50
        const imageData = ctx.getImageData(centerX - sampleSize / 2, centerY - sampleSize / 2, sampleSize, sampleSize)

        let totalR = 0, totalG = 0, totalB = 0
        for (let i = 0; i < imageData.data.length; i += 4) {
          totalR += imageData.data[i]
          totalG += imageData.data[i + 1]
          totalB += imageData.data[i + 2]
        }

        const pixelCount = imageData.data.length / 4
        const avgR = Math.round(totalR / pixelCount)
        const avgG = Math.round(totalG / pixelCount)
        const avgB = Math.round(totalB / pixelCount)

        const soilColor = `RGB(${avgR}, ${avgG}, ${avgB})`

        let soilType = "Unknown"
        let phEstimate = "Unknown"

        if (avgR > 150 && avgG > 120 && avgB < 100) {
          soilType = "Sandy Soil"
          phEstimate = "6.0 - 7.0"
        } else if (avgR > 100 && avgR < 150 && avgG > 80 && avgG < 120) {
          soilType = "Clay Soil"
          phEstimate = "5.0 - 6.0"
        } else if (avgR < 100 && avgG < 100 && avgB < 100) {
          soilType = "Loam Soil"
          phEstimate = "6.5 - 7.5"
        }

        const result: SoilScanResult = {
          soilColor,
          soilType,
          phEstimate,
          imageData,
          timestamp: new Date().toISOString(),
        }

        setScanResult(result)
        if (onScanComplete) onScanComplete(result)

        // Save to API (optional)
        fetch("/api/soil-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        }).catch(console.error)

        setIsAnalyzing(false)
      }

      img.src = imageData
    } catch (error) {
      console.error("Error analyzing soil image:", error)
      setScanError("Error analyzing image. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const resetScan = () => {
    setCapturedImage(null)
    setScanResult(null)
    setScanError(null)
  }

  return (
    <Card className="w-full bg-white">
    <CardHeader className="relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
      <CardTitle className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        Soil Scanner
      </CardTitle>
      <CardDescription>
        Take a photo of your soil to analyze its properties
      </CardDescription>
    </CardHeader>

      <CardContent>
        {scanError ? (
          <div className="text-destructive text-center p-4">
            <p>{scanError}</p>
            <Button variant="outline" onClick={resetScan} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Analyzing soil sample...</p>
          </div>
        ) : scanResult ? (
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={scanResult.imageData || "/placeholder.svg"}
                alt="Soil sample"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{
                    backgroundColor: scanResult.soilColor.replace("RGB", "rgb"),
                  }}
                />
                <h3 className="font-medium">Soil Color: {scanResult.soilColor}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Soil Type</p>
                  <p className="text-sm">{scanResult.soilType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated pH</p>
                  <p className="text-sm">{scanResult.phEstimate}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-white">
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50">
              <Camera className="h-4 w-4 " />
              Capture Soil Image
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs">
              Take a clear photo of the soil in good lighting for best results
            </p>
          </div>
        )}
      </CardContent>

      {scanResult && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetScan}>
            Scan Another Sample
          </Button>
          <Button variant="default">View Detailed Analysis</Button>
        </CardFooter>
      )}

      {onClose && (
        <CardFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </CardFooter>
      )}

      <ImprovedCameraModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageCapture={handleCapture}
        purpose="soil"
        title="Capture Soil Image"
      />
    </Card>
  )
}
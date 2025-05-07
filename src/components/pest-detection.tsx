"use client"

import { useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ImprovedCameraModal } from './improved-camera-modal'
import { Loader2, Bug, Camera, X } from "lucide-react"

interface PestDetectionProps {
  onDetectionComplete?: (result: PestDetectionResult) => void
  onClose?: () => void
}

interface PestDetectionResult {
  pestName: string
  confidence: number
  imageData: string
  timestamp: string
}

export function PestDetection({ onDetectionComplete, onClose }: PestDetectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResult, setDetectionResult] = useState<PestDetectionResult | null>(null)
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [classLabels, setClassLabels] = useState<string[]>([])
  const [modelError, setModelError] = useState<string | null>(null)

  useEffect(() => {
    async function loadModelAndLabels() {
      try {
        const labelsResponse = await fetch("/pest_model/class_labels.json")
        if (!labelsResponse.ok) throw new Error("Failed to load class labels")
        const labels = await labelsResponse.json()
        setClassLabels(labels)

        const loadedModel = await tf.loadLayersModel("/pest_model/model.json")
        setModel(loadedModel)
      } catch (error) {
        console.error("Error loading model or labels:", error)
        setModelError("Failed to load pest detection model. Please try again later.")
      }
    }

    loadModelAndLabels()

    return () => {
      if (model) model.dispose()
    }
  }, [])

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData)
    analyzePestImage(imageData)
  }

  const analyzePestImage = async (imageData: string) => {
    if (!model) {
      setModelError("Model not loaded. Please try again later.")
      return
    }

    setIsAnalyzing(true)

    try {
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement("canvas")
        canvas.width = 224
        canvas.height = 224
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Could not get canvas context")
        ctx.drawImage(img, 0, 0, 224, 224)

        const imageData = ctx.getImageData(0, 0, 224, 224)
        const tensor = tf.browser.fromPixels(imageData).toFloat().div(tf.scalar(255)).expandDims(0)

        const predictions = (await model.predict(tensor)) as tf.Tensor
        const probabilities = await predictions.data()
        const maxProbIndex = Array.from(probabilities).indexOf(Math.max(...Array.from(probabilities)))

        const pestName = classLabels[maxProbIndex] || "Unknown Pest"
        const confidence = probabilities[maxProbIndex] * 100

        const result: PestDetectionResult = {
          pestName,
          confidence,
          imageData: imageData.data.toString(),
          timestamp: new Date().toISOString(),
        }

        setDetectionResult(result)
        if (onDetectionComplete) onDetectionComplete(result)

        try {
          await fetch("/api/pest-detection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          })
        } catch (error) {
          console.error("Error saving pest detection result:", error)
        }

        tensor.dispose()
        predictions.dispose()
        setIsAnalyzing(false)
      }

      img.onerror = () => {
        setModelError("Error loading image. Please try again.")
        setIsAnalyzing(false)
      }

      img.src = imageData
    } catch (error) {
      console.error("Error analyzing pest image:", error)
      setModelError("Error analyzing image. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const resetDetection = () => {
    setCapturedImage(null)
    setDetectionResult(null)
    setModelError(null)
  }

  return (
    <Card className="w-full bg-white relative">
      {onClose && (
        <button
          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Pest Detection
        </CardTitle>
        <CardDescription>
          Take a photo of a pest or affected plant to identify the problem
        </CardDescription>
      </CardHeader>

      <CardContent>
        {modelError ? (
          <div className="text-destructive text-center p-4">
            <p>{modelError}</p>
            <Button variant="outline" onClick={resetDetection} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Analyzing image...</p>
          </div>
        ) : detectionResult ? (
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={detectionResult.imageData || "/placeholder.svg"}
                alt="Captured pest"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="font-medium text-lg">{detectionResult.pestName}</h3>
              <p className="text-sm text-muted-foreground">
                Confidence: {detectionResult.confidence.toFixed(1)}%
              </p>
              <p className="mt-2 text-sm">
                {detectionResult.pestName === "Unknown Pest"
                  ? "Could not identify the pest with confidence. Please try again with a clearer image."
                  : `This appears to be ${detectionResult.pestName}. Consider appropriate treatment methods.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50"
            >
              <Camera className="h-4 w-4" />
              Capture Pest Image
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs">
              Take a clear photo of the pest or affected plant area for best results
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between">
        {detectionResult && (
          <>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetDetection}>
                Detect Another
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // Link to treatment or pest info could go here
                }}
              >
                View Treatment Options
              </Button>
            </div>
          </>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose} className="text-destructive w-full">
            Close
          </Button>
        )}
      </CardFooter>

      <ImprovedCameraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageCapture={handleImageCapture}
        title="Capture Pest Image"
        purpose="pest"
      />
    </Card>
  )
}

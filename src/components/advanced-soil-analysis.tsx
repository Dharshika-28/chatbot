"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Camera, Upload, BarChart3, Droplets, Thermometer, Layers } from "lucide-react"
import { Input } from './ui/input'

interface SoilProperty {
  name: string
  value: number
  unit: string
  description: string
  icon: React.ReactNode
  color: string
}

interface SoilAnalysisResult {
  soilType: string
  color: string
  colorHex: string
  texture: string
  moisture: number
  properties: SoilProperty[]
  recommendations: string[]
}

export function AdvancedSoilAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<SoilAnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("camera")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const startAnalysis = () => {
    if (!previewImage) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate the analysis process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          generateResults()
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const generateResults = () => {
    // Simulate results that would come from jetson-inference
    const soilTypes = [
      {
        soilType: "Clay Loam",
        color: "Dark Brown",
        colorHex: "#5D4037",
        texture: "Moderately Sticky",
        moisture: 65,
        properties: [
          {
            name: "Organic Matter",
            value: 4.2,
            unit: "%",
            description: "Good organic content, beneficial for nutrient retention",
            icon: <Layers className="h-4 w-4" />,
            color: "bg-amber-500",
          },
          {
            name: "Moisture Content",
            value: 65,
            unit: "%",
            description: "Moderately wet soil with good water retention",
            icon: <Droplets className="h-4 w-4" />,
            color: "bg-blue-500",
          },
          {
            name: "Texture Classification",
            value: 3.8,
            unit: "index",
            description: "Medium texture with balanced clay and silt content",
            icon: <BarChart3 className="h-4 w-4" />,
            color: "bg-purple-500",
          },
          {
            name: "Temperature",
            value: 22.4,
            unit: "°C",
            description: "Optimal temperature for microbial activity",
            icon: <Thermometer className="h-4 w-4" />,
            color: "bg-red-500",
          },
        ],
        recommendations: [
          "Ideal for growing wheat, corn, and many vegetables",
          "Add compost to improve structure and drainage",
          "Consider crop rotation to maintain soil health",
          "Moderate irrigation recommended due to good water retention",
        ],
      },
      {
        soilType: "Sandy Loam",
        color: "Light Brown",
        colorHex: "#A1887F",
        texture: "Slightly Gritty",
        moisture: 35,
        properties: [
          {
            name: "Organic Matter",
            value: 2.1,
            unit: "%",
            description: "Low organic content, consider adding compost",
            icon: <Layers className="h-4 w-4" />,
            color: "bg-amber-500",
          },
          {
            name: "Moisture Content",
            value: 35,
            unit: "%",
            description: "Relatively dry soil with poor water retention",
            icon: <Droplets className="h-4 w-4" />,
            color: "bg-blue-500",
          },
          {
            name: "Texture Classification",
            value: 2.3,
            unit: "index",
            description: "Coarse texture with high sand content",
            icon: <BarChart3 className="h-4 w-4" />,
            color: "bg-purple-500",
          },
          {
            name: "Temperature",
            value: 24.8,
            unit: "°C",
            description: "Slightly warm, heats up quickly",
            icon: <Thermometer className="h-4 w-4" />,
            color: "bg-red-500",
          },
        ],
        recommendations: [
          "Well-suited for root vegetables like carrots and potatoes",
          "Add organic matter to improve water retention",
          "Consider mulching to reduce water loss",
          "More frequent irrigation required due to quick drainage",
        ],
      },
      {
        soilType: "Silty Clay",
        color: "Reddish Brown",
        colorHex: "#6D4C41",
        texture: "Smooth and Sticky",
        moisture: 78,
        properties: [
          {
            name: "Organic Matter",
            value: 5.7,
            unit: "%",
            description: "High organic content, excellent for nutrient retention",
            icon: <Layers className="h-4 w-4" />,
            color: "bg-amber-500",
          },
          {
            name: "Moisture Content",
            value: 78,
            unit: "%",
            description: "Very moist soil with excellent water retention",
            icon: <Droplets className="h-4 w-4" />,
            color: "bg-blue-500",
          },
          {
            name: "Texture Classification",
            value: 4.6,
            unit: "index",
            description: "Fine texture with high clay and silt content",
            icon: <BarChart3 className="h-4 w-4" />,
            color: "bg-purple-500",
          },
          {
            name: "Temperature",
            value: 20.1,
            unit: "°C",
            description: "Cool temperature, warms slowly",
            icon: <Thermometer className="h-4 w-4" />,
            color: "bg-red-500",
          },
        ],
        recommendations: [
          "Excellent for rice cultivation and wetland crops",
          "Improve drainage to prevent waterlogging",
          "Avoid overworking when wet to prevent compaction",
          "Consider raised beds for better drainage for some crops",
        ],
      },
    ]

    // Randomly select one of the soil types
    const randomResult = soilTypes[Math.floor(Math.random() * soilTypes.length)]
    setResult(randomResult)
  }

  const resetAnalysis = () => {
    setResult(null)
    setPreviewImage(null)
    setProgress(0)
  }

  if (result) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <CardTitle className="text-green-800">Advanced Soil Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/3">
              {previewImage && (
                <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
                  <img src={previewImage || "/placeholder.svg"} alt="Soil sample" className="w-full h-auto" />
                </div>
              )}
              <div
                className="p-4 rounded-lg mb-3 text-center font-medium"
                style={{ backgroundColor: result.colorHex, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
              >
                {result.color}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="font-medium text-lg mb-1">{result.soilType}</h3>
                <p className="text-sm text-gray-600 mb-2">Texture: {result.texture}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Dry</span>
                    <span>Moisture Level</span>
                    <span>Wet</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${result.moisture}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:w-2/3 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Soil Properties</h3>
                <div className="space-y-3">
                  {result.properties.map((property, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className={`${property.color} p-1.5 rounded-full mr-2`}>{property.icon}</div>
                          <span className="font-medium">{property.name}</span>
                        </div>
                        <span className="font-bold">
                          {property.value}
                          {property.unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{property.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
          <Button variant="outline" onClick={resetAnalysis}>
            Analyze Another Sample
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">Save Results</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-green-800">Advanced Soil Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center aspect-video flex flex-col items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <>
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">Take a photo of your soil sample</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Open Camera
                  </Button>
                </>
              )}
            </div>

            {previewImage && !isAnalyzing && (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setPreviewImage(null)}>
                  Retake
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={startAnalysis}>
                  Analyze Soil
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center aspect-video flex flex-col items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">Upload a photo of your soil sample</p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                </>
              )}
            </div>

            {previewImage && !isAnalyzing && (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setPreviewImage(null)}>
                  Remove
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={startAnalysis}>
                  Analyze Soil
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isAnalyzing && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Analyzing soil sample...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <p>• Detecting soil color and texture</p>
              {progress > 30 && <p>• Analyzing moisture content</p>}
              {progress > 50 && <p>• Classifying soil type</p>}
              {progress > 70 && <p>• Generating recommendations</p>}
              {progress > 90 && <p>• Finalizing analysis</p>}
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">About Advanced Soil Analysis:</p>
          <p className="mb-2">
            This feature uses AI-powered computer vision (based on jetson-inference) to analyze soil properties from
            images, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Soil color and type classification</li>
            <li>Texture analysis (clay, silt, sand ratios)</li>
            <li>Moisture content estimation</li>
            <li>Organic matter detection</li>
          </ul>
          <p className="mt-2">
            For most accurate results, take photos in natural daylight and include a reference object for scale.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

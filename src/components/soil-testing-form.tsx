"use client"

import type React from "react"

import { useState } from "react"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { SoilMap } from './soil-map'
import { AdvancedSoilAnalysis } from './advanced-soil-analysis'
import { SoilCameraScanner } from './soil-camera-scanner'

export function SoilTestingForm() {
  const [soilType, setSoilType] = useState("")
  const [soilColor, setSoilColor] = useState("")
  const [location, setLocation] = useState("")
  const [cropType, setCropType] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")

  // Replace the saveSoilTestToDatabase function with this simplified version that doesn't use MongoDB
  const saveSoilTestToDatabase = async (soilData: any) => {
    try {
      const userId = "current-user-id" // In a real app, you would get this from authentication

      // Prepare the request body
      const requestBody = {
        userId,
        soilType: soilData.soilType,
        soilColor: soilData.soilColor,
        location: soilData.location,
        results: soilData.results,
      }

      // Send the request to the API
      const response = await fetch("/api/soil-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to save soil test")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error saving soil test:", error)
      // Don't throw here - we don't want to break the UI if saving fails
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      setTimeout(() => {
        // Predefined responses based on soil type
        const responses: Record<string, string> = {
          clay: `Your clay soil has high nutrient retention but poor drainage. 

Soil Color: ${soilColor || "Typically reddish-brown to gray"}
Common Locations: River valleys, lowlands, and former lake beds. Prevalent in the Indo-Gangetic plains, delta regions of major rivers, and parts of central India.

Recommended amendments: Add organic matter and sand to improve drainage. Best crops: Cabbage, broccoli, and beans.`,

          sandy: `Your sandy soil has good drainage but poor nutrient retention. 

Soil Color: ${soilColor || "Typically light brown to yellow"}
Common Locations: Coastal areas, desert fringes, and areas with weathered sandstone. Found extensively in Rajasthan, parts of Gujarat, and coastal regions.

Recommended amendments: Add compost and organic matter to improve water retention. Best crops: Carrots, potatoes, and lettuce.`,

          loam: `Your loam soil is ideal for most crops with good drainage and nutrient retention. 

Soil Color: ${soilColor || "Typically dark brown to black"}
Common Locations: Fertile plains, river valleys with good drainage, and areas with mixed parent materials. Common in parts of Punjab, Haryana, and the Deccan Plateau.

Maintain with regular compost additions. Best crops: Most vegetables and fruits will thrive.`,

          silt: `Your silty soil has good fertility and moisture retention. 

Soil Color: ${soilColor || "Typically light to medium brown or grayish"}
Common Locations: River floodplains, areas downstream of glacial deposits, and windblown deposits. Found in parts of the Indo-Gangetic plain and near major river systems.

Recommended amendments: Add organic matter to improve structure. Best crops: Most vegetables, especially leafy greens.`,

          chalky: `Your chalky soil is alkaline and may lack some nutrients. 

Soil Color: ${soilColor || "Typically white to light gray"}
Common Locations: Areas with limestone bedrock or calcium-rich parent material. Found in parts of the Deccan region and some hilly areas with limestone formations.

Recommended amendments: Add organic matter and acidic fertilizers. Best crops: Lavender, spinach, and cabbage.`,

          black: `Your black cotton soil (Regur) has high clay content and is rich in calcium, magnesium, and iron. 

Soil Color: Deep black
Common Locations: Deccan Plateau, parts of Maharashtra, Gujarat, Madhya Pradesh, and Andhra Pradesh. Typically formed from volcanic rock weathering.

Recommended amendments: Improve drainage and add gypsum to reduce cracking. Best crops: Cotton, wheat, sugarcane, and oilseeds.`,

          red: `Your red soil is typically acidic and contains iron oxides. 

Soil Color: Red to reddish-brown
Common Locations: Eastern and southern peninsular India, parts of Odisha, Chhattisgarh, and Tamil Nadu. Formed from weathered metamorphic rock.

Recommended amendments: Add lime to reduce acidity and organic matter to improve fertility. Best crops: Millets, pulses, and oilseeds.`,

          laterite: `Your laterite soil is highly weathered and leached of soluble minerals. 

Soil Color: Reddish-brown to brick red
Common Locations: High rainfall areas of Kerala, Karnataka, eastern and northeastern states. Typically found in tropical regions with high rainfall.

Recommended amendments: Add organic matter and balanced fertilizers. Best crops: Cashew, coconut, rubber, and tea.`,
        }

        const resultText =
          responses[soilType] ||
          "Soil analysis complete. Please consult with a local agricultural expert for detailed recommendations based on your specific conditions."

        setResult(resultText)

        // After getting the result, save to database
        saveSoilTestToDatabase({
          soilType,
          soilColor,
          location,
          results: resultText,
        })

        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error in soil test submission:", error)
      // Handle error appropriately
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorIdentification = () => {
    // In a real implementation, this would process the uploaded image
    // For now, we'll simulate a response after a delay
    setIsLoading(true)
    setTimeout(() => {
      const soilTypes = ["clay", "sandy", "loam", "silt", "chalky", "black", "red", "laterite"]
      const randomSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)]
      setSoilType(randomSoilType)

      const soilColors = {
        clay: "Reddish-brown",
        sandy: "Light yellow",
        loam: "Dark brown",
        silt: "Medium brown",
        chalky: "Light gray",
        black: "Deep black",
        red: "Brick red",
        laterite: "Reddish-brown",
      }

      setSoilColor(soilColors[randomSoilType as keyof typeof soilColors])
      setIsLoading(false)
    }, 2000)
  }

  // Add this function to the SoilTestingForm component
  const handleSoilAnalysisComplete = (soilData) => {
    // Generate result text based on soil data
    const resultText = `
Soil Analysis Results:

Soil Type: ${soilData.soilType}
Soil Color: ${soilData.color}
Fertility: ${soilData.fertility}
Organic Matter: ${soilData.organicMatter}

Recommendations:
${soilData.recommendations.join("\n")}
  `

    setResult(resultText)

    // Save to database
    saveSoilTestToDatabase({
      soilType: soilData.soilType,
      soilColor: soilData.color,
      location: location || "Not specified",
      results: resultText,
    })
  }

  if (result) {
    return (
      <Card className="mt-4 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 no-select">Soil Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap no-select" tabIndex={-1} onFocus={(e) => e.target.blur()}>
            {result}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => setResult(null)}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Test Another Sample
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="color">Color ID</TabsTrigger>
        <TabsTrigger value="advanced">AI Analysis</TabsTrigger>
        <TabsTrigger value="map">Soil Map</TabsTrigger>
      </TabsList>

      <TabsContent value="manual">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soil-type" >Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType} required>
              <SelectTrigger id="soil-type">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="chalky">Chalky</SelectItem>
                <SelectItem value="black">Black Cotton (Regur)</SelectItem>
                <SelectItem value="red">Red Soil</SelectItem>
                <SelectItem value="laterite">Laterite Soil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil-color">Soil Color</Label>
            <Select value={soilColor} onValueChange={setSoilColor}>
              <SelectTrigger id="soil-color">
                <SelectValue placeholder="Select soil color (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dark Brown">Dark Brown</SelectItem>
                <SelectItem value="Light Brown">Light Brown</SelectItem>
                <SelectItem value="Reddish-Brown">Reddish-Brown</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Gray">Gray</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="White">White</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., North Field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop-type">Current or Planned Crop</Label>
            <Input
              id="crop-type"
              placeholder="e.g., Wheat, Rice, Vegetables"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Soil"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="color">
        <div className="space-y-4">
          <SoilCameraScanner onSoilDetected={handleSoilAnalysisComplete} />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-4">Upload a photo of your soil for color analysis</p>
            <Input type="file" accept="image/*" className="hidden" id="soil-image" onChange={() => {}} />
            <Label
              htmlFor="soil-image"
              className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700"
            >
              Select Image
            </Label>
          </div>

          <Button
            onClick={handleColorIdentification}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing Color..." : "Identify Soil Type"}
          </Button>

          {soilType && soilColor && !result && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="font-medium" tabIndex={-1} onFocus={(e) => e.target.blur()}>
                Detected Soil:
              </p>
              <p tabIndex={-1} onFocus={(e) => e.target.blur()}>
                Type: {soilType.charAt(0).toUpperCase() + soilType.slice(1)}
              </p>
              <p tabIndex={-1} onFocus={(e) => e.target.blur()}>
                Color: {soilColor}
              </p>
              <Button onClick={handleSubmit} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                Get Full Analysis
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="advanced">
        <AdvancedSoilAnalysis />
      </TabsContent>

      <TabsContent value="map">
        <SoilMap />
        <div className="mt-4">
          <p className="text-sm mb-2">Found your soil type on the map? Select it below for analysis:</p>
          <div className="grid grid-cols-2 gap-2">
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger id="map-soil-type">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="chalky">Chalky</SelectItem>
                <SelectItem value="black">Black Cotton (Regur)</SelectItem>
                <SelectItem value="red">Red Soil</SelectItem>
                <SelectItem value="laterite">Laterite Soil</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={!soilType || isLoading}
            >
              {isLoading ? "Analyzing..." : "Get Analysis"}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

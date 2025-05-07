"use client"

import { useState } from "react"
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import {
  Droplets,
  FileText,
  Camera,
  Upload,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Sprout,
  Bug,
  Thermometer,
} from "lucide-react"

interface EnhancedSoilTestingProps {
  onClose: () => void
}

export function EnhancedSoilTesting({ onClose }: EnhancedSoilTestingProps) {
  const [activeTab, setActiveTab] = useState("request")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    testType: "",
    location: "",
    landSize: "",
    currentCrop: "",
    previousCrop: "",
    irrigationSource: "",
    contactNumber: "",
    preferredDate: "",
    additionalInfo: "",
    consentToShare: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveEnhancedSoilTestToDatabase = async (testData: any) => {
    try {
      const userId = "current-user-id" // In a real app, you would get this from authentication

      // Prepare the request body
      const requestBody = {
        userId,
        testType: testData.testType,
        location: testData.location,
        landSize: testData.landSize,
        currentCrop: testData.currentCrop,
        previousCrop: testData.previousCrop,
        irrigationSource: testData.irrigationSource,
        contactNumber: testData.contactNumber,
        preferredDate: testData.preferredDate,
        additionalInfo: testData.additionalInfo,
      }

      // Send the request to the API
      const response = await fetch("/api/enhanced-soil-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to save enhanced soil test request")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error saving enhanced soil test request:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Save the enhanced soil test request to the database
      await saveEnhancedSoilTestToDatabase(formData)

      // If successful, update the UI
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting enhanced soil test request:", error)
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  const simulateTestProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowResults(true)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <CardTitle className="text-green-800">Soil Test Results</CardTitle>
          <CardDescription>Comprehensive analysis of your soil sample</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                Physical Properties
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Soil Texture</span>
                    <span className="font-medium">Clay Loam</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Moisture Content</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Water Retention</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-green-500" />
                Chemical Properties
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">pH Level</span>
                    <span className="font-medium">6.8</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Organic Matter</span>
                    <span className="font-medium">4.2%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Nitrogen (N)</span>
                    <span className="font-medium">Medium</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="font-medium text-lg text-green-800">AI-Powered Recommendations</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Sprout className="h-4 w-4 mr-2 text-green-600" />
                    Recommended Seeds
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                      <span>Rice (IR-36, ADT-43)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                      <span>Maize (DHM-117, Ganga-11)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                      <span>Pulses (Moong, Urad)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                      <span>Vegetables (Tomato, Brinjal)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Bug className="h-4 w-4 mr-2 text-orange-600" />
                    Pest Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-orange-600" />
                      <span>Neem-based pesticides</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-orange-600" />
                      <span>Integrated Pest Management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-orange-600" />
                      <span>Biological control agents</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                      <span>Avoid heavy chemical use</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-blue-600" />
                    Maintenance Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-blue-600" />
                      <span>Add organic compost</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-blue-600" />
                      <span>Maintain proper drainage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-blue-600" />
                      <span>Crop rotation recommended</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-blue-600" />
                      <span>Mulching to retain moisture</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
              <h4 className="font-medium text-green-800 mb-2">Expert Analysis</h4>
              <p className="text-sm text-gray-700">
                Your soil has good fertility with balanced nutrient content. The clay loam texture provides excellent
                water retention but may require attention to drainage during heavy rains. Based on the pH level of 6.8,
                most crops will thrive with proper management. We recommend adding organic matter to improve soil
                structure and implementing crop rotation to maintain soil health.
              </p>
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-gray-600">
                  This analysis is generated by our AI system based on your soil test results. For more detailed
                  guidance, consider connecting with an agricultural expert.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Back to Test
          </Button>
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Close
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <CardTitle className="text-green-800">Test Request Submitted</CardTitle>
          <CardDescription>Your soil test request has been received</CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="text-lg font-medium mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your soil testing request has been submitted successfully. Our team will contact you to arrange sample
            collection.
          </p>

          <div className="bg-gray-50 rounded-lg p-3 text-left mb-4">
            <p className="text-sm font-medium mb-1">Request Details:</p>
            <p className="text-sm text-gray-600">Test Type: {formData.testType}</p>
            <p className="text-sm text-gray-600">Location: {formData.location}</p>
            <p className="text-sm text-gray-600">Contact: {formData.contactNumber}</p>
          </div>

          <Button onClick={simulateTestProgress} className="w-full bg-green-600 hover:bg-green-700 mb-2">
            Simulate Test Results
          </Button>
          <p className="text-xs text-gray-500">(This is a demo feature to simulate receiving test results)</p>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button onClick={onClose} className="w-full">
            Return to Chat
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (progress > 0 && progress < 100) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <CardTitle className="text-green-800">Processing Soil Test</CardTitle>
          <CardDescription>Please wait while we analyze your soil sample</CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
          </div>

          <div className="space-y-3 text-left">
            {progress >= 20 && (
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Physical properties analysis</span>
              </div>
            )}
            {progress >= 40 && (
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Chemical composition testing</span>
              </div>
            )}
            {progress >= 60 && (
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Nutrient content evaluation</span>
              </div>
            )}
            {progress >= 80 && (
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Generating recommendations</span>
              </div>
            )}
            {progress < 80 && (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
        <CardTitle className="text-green-800">AgriSoilTest Service</CardTitle>
        <CardDescription>Request a comprehensive soil test for your farm</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="request">Request Test</TabsTrigger>
            <TabsTrigger value="upload">Upload Sample</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-type">Test Type</Label>
              <Select value={formData.testType} onValueChange={(value) => handleChange("testType", value)}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Soil Test (Texture, pH, NPK)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis (All Properties)</SelectItem>
                  <SelectItem value="specialized">Specialized Test (Micronutrients)</SelectItem>
                  <SelectItem value="organic">Organic Farming Certification Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="location"
                    placeholder="Village/Town, District"
                    className="pl-8"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="land-size">Land Size</Label>
                <Select value={formData.landSize} onValueChange={(value) => handleChange("landSize", value)}>
                  <SelectTrigger id="land-size">
                    <SelectValue placeholder="Select land size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 acre</SelectItem>
                    <SelectItem value="1-5">1-5 acres</SelectItem>
                    <SelectItem value="5-10">5-10 acres</SelectItem>
                    <SelectItem value="more-than-10">More than 10 acres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-crop">Current Crop</Label>
                <Select value={formData.currentCrop} onValueChange={(value) => handleChange("currentCrop", value)}>
                  <SelectTrigger id="current-crop">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="none">No Current Crop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previous-crop">Previous Crop</Label>
                <Select value={formData.previousCrop} onValueChange={(value) => handleChange("previousCrop", value)}>
                  <SelectTrigger id="previous-crop">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="none">No Previous Crop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="irrigation">Irrigation Source</Label>
              <Select
                value={formData.irrigationSource}
                onValueChange={(value) => handleChange("irrigationSource", value)}
              >
                <SelectTrigger id="irrigation">
                  <SelectValue placeholder="Select irrigation source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canal">Canal Irrigation</SelectItem>
                  <SelectItem value="well">Well/Tube Well</SelectItem>
                  <SelectItem value="tank">Tank/Pond</SelectItem>
                  <SelectItem value="river">River/Stream</SelectItem>
                  <SelectItem value="rainfed">Rainfed (No Irrigation)</SelectItem>
                  <SelectItem value="drip">Drip Irrigation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  onChange={(e) => handleChange("contactNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-date">Preferred Date for Collection</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="preferred-date"
                    type="date"
                    className="pl-8"
                    value={formData.preferredDate}
                    onChange={(e) => handleChange("preferredDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information</Label>
              <Textarea
                id="additional-info"
                placeholder="Any specific issues or concerns about your soil..."
                className="min-h-[80px]"
                value={formData.additionalInfo}
                onChange={(e) => handleChange("additionalInfo", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="consent"
                checked={formData.consentToShare as boolean}
                onCheckedChange={(checked) => handleChange("consentToShare", checked as boolean)}
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to share my soil test data anonymously to improve agricultural recommendations
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="p-4 space-y-4">
            <div className="text-center p-4">
              <h3 className="font-medium text-lg mb-2">Upload Soil Sample Images</h3>
              <p className="text-sm text-gray-600 mb-6">
                If you've already collected soil samples, upload clear images to help our experts with preliminary
                analysis.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">Take a photo of your soil sample</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Open Camera
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">Upload existing photos from your device</p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
                <h4 className="font-medium mb-1">How to collect a good soil sample:</h4>
                <ul className="list-disc pl-5 text-left">
                  <li>Collect samples from 3-5 different spots in your field</li>
                  <li>Dig 6-8 inches deep for each sample</li>
                  <li>Mix the samples thoroughly in a clean container</li>
                  <li>Let the sample dry naturally (do not use heat)</li>
                  <li>Take clear, well-lit photos of the sample</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">About AgriSoilTest Service</h3>
                <p className="text-sm text-gray-600">
                  AgriSoilTest is a comprehensive soil testing service that helps farmers understand their soil
                  properties and get tailored recommendations for improved crop yield and soil health.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Our Testing Process</h4>
                <ol className="list-decimal pl-5 text-sm space-y-2">
                  <li>
                    <span className="font-medium">Sample Collection:</span> Our field agents collect soil samples from
                    your farm using standardized methods.
                  </li>
                  <li>
                    <span className="font-medium">Laboratory Analysis:</span> Samples are tested for physical, chemical,
                    and biological properties.
                  </li>
                  <li>
                    <span className="font-medium">AI-Powered Analysis:</span> Our AI system analyzes the results and
                    generates tailored recommendations.
                  </li>
                  <li>
                    <span className="font-medium">Expert Review:</span> Agricultural experts review the recommendations
                    for accuracy.
                  </li>
                  <li>
                    <span className="font-medium">Detailed Report:</span> You receive a comprehensive report with
                    actionable insights.
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Properties We Test</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Soil texture and structure</li>
                    <li>• pH level and acidity</li>
                    <li>• Organic matter content</li>
                    <li>• Macro nutrients (N, P, K)</li>
                    <li>• Micro nutrients</li>
                    <li>• Water retention capacity</li>
                    <li>• Electrical conductivity</li>
                    <li>• Biological activity</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Optimized fertilizer application</li>
                    <li>• Increased crop yield</li>
                    <li>• Reduced input costs</li>
                    <li>• Improved soil health</li>
                    <li>• Sustainable farming practices</li>
                    <li>• Crop-specific recommendations</li>
                    <li>• Access to expert consultation</li>
                    <li>• Digital record of soil health</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-white rounded border border-yellow-100">
                    <p className="font-medium">Basic Test</p>
                    <p className="text-green-600 font-bold">₹500</p>
                    <p className="text-xs text-gray-500">Texture, pH, NPK</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-yellow-100">
                    <p className="font-medium">Comprehensive</p>
                    <p className="text-green-600 font-bold">₹1,200</p>
                    <p className="text-xs text-gray-500">All properties</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-yellow-100">
                    <p className="font-medium">Specialized</p>
                    <p className="text-green-600 font-bold">₹1,800</p>
                    <p className="text-xs text-gray-500">With micronutrients</p>
                  </div>
                </div>
                <p className="text-xs mt-2">
                  * Government subsidies available for small and marginal farmers. Check eligibility during checkout.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.testType || !formData.location || !formData.contactNumber}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

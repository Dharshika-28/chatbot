"use client"

import { useState } from "react"
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Loader2, Send, Phone, Calendar, FileText, User } from "lucide-react"

interface ExpertConnectionProps {
  onClose: () => void
}

export function ExpertConnection({ onClose }: ExpertConnectionProps) {
  const [activeTab, setActiveTab] = useState("message")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    expertType: "",
    cropType: "",
    landSize: "",
    issue: "",
    contactNumber: "",
    preferredTime: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveExpertRequestToDatabase = async (requestData: any) => {
    try {
      const userId = "current-user-id" // In a real app, you would get this from authentication

      // Prepare the request body
      const requestBody = {
        userId,
        expertType: requestData.expertType,
        cropType: requestData.cropType,
        landSize: requestData.landSize,
        issue: requestData.issue,
        contactNumber: requestData.contactNumber,
        preferredTime: requestData.preferredTime,
      }

      // Send the request to the API
      const response = await fetch("/api/expert-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to save expert request")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error saving expert request:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Save the expert request to the database
      await saveExpertRequestToDatabase(formData)

      // If successful, update the UI
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting expert request:", error)
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  const experts = [
    {
      id: "exp1",
      name: "Dr. Rajesh Kumar",
      specialty: "Soil Scientist",
      organization: "Tamil Nadu Agricultural University",
      image: "/placeholder.svg?height=80&width=80",
      available: true,
    },
    {
      id: "exp2",
      name: "Smt. Lakshmi Devi",
      specialty: "Crop Disease Specialist",
      organization: "State Agriculture Department",
      image: "/placeholder.svg?height=80&width=80",
      available: true,
    },
    {
      id: "exp3",
      name: "Shri. Venkatesh",
      specialty: "Agricultural Economics",
      organization: "Rural Development Agency",
      image: "/placeholder.svg?height=80&width=80",
      available: false,
    },
  ]

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center bg-green-50">
          <CardTitle className="text-green-800">Request Submitted</CardTitle>
          <CardDescription>An expert will contact you soon</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your request has been submitted successfully. One of our agricultural experts will review your information
            and contact you within 24 hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 text-left mb-4">
            <p className="text-sm font-medium mb-1">Request Details:</p>
            <p className="text-sm text-gray-600">Expert Type: {formData.expertType}</p>
            <p className="text-sm text-gray-600">Crop: {formData.cropType}</p>
            <p className="text-sm text-gray-600">Contact: {formData.contactNumber}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full">
            Return to Chat
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
        <CardTitle className="text-green-800">Connect with an Expert</CardTitle>
        <CardDescription>Get personalized assistance from agricultural experts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="call">Call</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expert-type">Type of Expert Needed</Label>
              <Select value={formData.expertType} onValueChange={(value) => handleChange("expertType", value)}>
                <SelectTrigger id="expert-type">
                  <SelectValue placeholder="Select expert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soil-expert">Soil Expert</SelectItem>
                  <SelectItem value="crop-specialist">Crop Specialist</SelectItem>
                  <SelectItem value="pest-control">Pest Control Expert</SelectItem>
                  <SelectItem value="irrigation-expert">Irrigation Expert</SelectItem>
                  <SelectItem value="agri-economist">Agricultural Economist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop Type</Label>
              <Select value={formData.cropType} onValueChange={(value) => handleChange("cropType", value)}>
                <SelectTrigger id="crop-type">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="pulses">Pulses</SelectItem>
                  <SelectItem value="oilseeds">Oilseeds</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="issue">Describe Your Issue</Label>
              <Textarea
                id="issue"
                placeholder="Please describe your farming issue or question in detail..."
                className="min-h-[100px]"
                value={formData.issue}
                onChange={(e) => handleChange("issue", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
              />
              <p className="text-xs text-gray-500">An expert will contact you within 24 hours.</p>
            </div>
          </TabsContent>

          <TabsContent value="call" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expert-type-call">Type of Expert Needed</Label>
              <Select value={formData.expertType} onValueChange={(value) => handleChange("expertType", value)}>
                <SelectTrigger id="expert-type-call">
                  <SelectValue placeholder="Select expert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soil-expert">Soil Expert</SelectItem>
                  <SelectItem value="crop-specialist">Crop Specialist</SelectItem>
                  <SelectItem value="pest-control">Pest Control Expert</SelectItem>
                  <SelectItem value="irrigation-expert">Irrigation Expert</SelectItem>
                  <SelectItem value="agri-economist">Agricultural Economist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-call">Contact Number</Label>
              <Input
                id="contact-call"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-time">Preferred Time for Call</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)}>
                <SelectTrigger id="preferred-time">
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Request Call
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800">
              <p>Our experts will call you at your preferred time. Make sure to provide a valid contact number.</p>
            </div>
          </TabsContent>

          <TabsContent value="experts" className="p-4 space-y-4">
            <p className="text-sm text-gray-600 mb-2">Available agricultural experts:</p>

            <div className="space-y-3">
              {experts.map((expert) => (
                <div key={expert.id} className="border rounded-lg p-3 flex items-start">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={expert.image || "/placeholder.svg"} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{expert.name}</h3>
                      <Badge
                        variant={expert.available ? "success" : "secondary"}
                        className={expert.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {expert.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{expert.specialty}</p>
                    <p className="text-xs text-gray-500">{expert.organization}</p>

                    {expert.available && (
                      <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700 h-8 text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Connect Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
              <p>
                Expert availability is updated in real-time. If your preferred expert is busy, you can schedule a call
                for later.
              </p>
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
          disabled={isSubmitting || !formData.expertType || !formData.issue || !formData.contactNumber}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

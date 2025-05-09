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
      const userId = "current-user-id"
      const requestBody = {
        userId,
        ...requestData,
      }

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
      await saveExpertRequestToDatabase(formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting expert request:", error)
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
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
        <CardTitle className="text-green-800">Connect with an Expert</CardTitle>
        <CardDescription>Get personalized assistance from agricultural experts</CardDescription>
      </CardHeader>

      <CardContent className="p-0 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="call">Call</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>

          {/* Message Tab */}
          <TabsContent value="message" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Type of Expert</Label>
              <Select onValueChange={(value) => handleChange("expertType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose expert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soil">Soil</SelectItem>
                  <SelectItem value="Crop">Crop</SelectItem>
                  <SelectItem value="Pest">Pest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Input placeholder="e.g. Paddy, Sugarcane" onChange={(e) => handleChange("cropType", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Land Size (in acres)</Label>
              <Input placeholder="e.g. 2.5" onChange={(e) => handleChange("landSize", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Describe the issue</Label>
              <Textarea rows={3} onChange={(e) => handleChange("issue", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input placeholder="e.g. 9876543210" onChange={(e) => handleChange("contactNumber", e.target.value)} />
            </div>
          </TabsContent>

          {/* Call Tab */}
          <TabsContent value="call" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Type of Expert</Label>
              <Select onValueChange={(value) => handleChange("expertType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose expert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soil">Soil</SelectItem>
                  <SelectItem value="Crop">Crop</SelectItem>
                  <SelectItem value="Pest">Pest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preferred Call Time</Label>
              <Input placeholder="e.g. Tomorrow 10AM" onChange={(e) => handleChange("preferredTime", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input placeholder="e.g. 9876543210" onChange={(e) => handleChange("contactNumber", e.target.value)} />
            </div>
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts" className="p-4 space-y-4">
            <p className="text-sm text-gray-600 mb-2">Available agricultural experts:</p>
            <div className="space-y-3">
              {experts.map((expert) => (
                <div key={expert.id} className="border rounded-lg p-3 flex items-start">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={expert.image} alt={expert.name} />
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
          disabled={isSubmitting || !formData.expertType || !formData.contactNumber}
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

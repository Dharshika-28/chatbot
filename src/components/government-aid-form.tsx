"use client"

import type React from "react"

import { useState } from "react"
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'

export function GovernmentAidForm() {
  const [cropType, setCropType] = useState("")
  const [farmSize, setFarmSize] = useState("")
  const [isOrganic, setIsOrganic] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Predefined responses based on crop type
      const responses: Record<string, string> = {
        rice: "Based on your information, you may be eligible for:\n\n1. National Food Security Mission (NFSM) - Provides subsidies for high-yielding rice varieties and irrigation equipment.\n\n2. Pradhan Mantri Fasal Bima Yojana - Crop insurance scheme with premium subsidies.\n\n3. Micro Irrigation Fund - If you're using water-saving techniques.",
        wheat:
          "Based on your information, you may be eligible for:\n\n1. National Food Security Mission (NFSM) - Provides subsidies for certified wheat seeds and farm machinery.\n\n2. Pradhan Mantri Krishi Sinchayee Yojana - For irrigation infrastructure development.\n\n3. Market Intervention Scheme - Price support during market fluctuations.",
        cotton:
          "Based on your information, you may be eligible for:\n\n1. Technology Mission on Cotton - Provides subsidies for certified seeds and integrated pest management.\n\n2. Minimum Support Price (MSP) program - Ensures fair prices for your cotton crop.\n\n3. Cotton Corporation of India support - For marketing assistance.",
        vegetables:
          "Based on your information, you may be eligible for:\n\n1. Mission for Integrated Development of Horticulture - Subsidies for seeds, protected cultivation, and post-harvest management.\n\n2. Vegetable Initiative for Urban Clusters - If near urban areas.\n\n3. National Horticulture Mission - For infrastructure development.",
        fruits:
          "Based on your information, you may be eligible for:\n\n1. Mission for Integrated Development of Horticulture - Subsidies for planting material, farming systems, and cold storage.\n\n2. National Horticulture Mission - Support for area expansion and market development.\n\n3. Agricultural Marketing Infrastructure scheme - For post-harvest management.",
      }

      let response =
        responses[cropType] ||
        "Based on your information, you may be eligible for various government aid programs. Please contact your local agricultural extension office for personalized assistance."

      // Add organic farming specific programs if applicable
      if (isOrganic) {
        response +=
          "\n\nAs an organic farmer, you may also qualify for:\n\n1. Paramparagat Krishi Vikas Yojana - Financial assistance for organic farming certification.\n\n2. Mission Organic Value Chain Development - For marketing and certification support.\n\n3. National Project on Organic Farming - Technical capacity building and support."
      }

      // Add farm size specific information
      if (farmSize === "small") {
        response +=
          "\n\nAs a small farmer, you may also qualify for:\n\n1. Small Farmers' Agribusiness Consortium - Credit-linked subsidies.\n\n2. Additional subsidies under most schemes for small and marginal farmers."
      }

      setResult(response)
      setIsLoading(false)
    }, 1500)
  }

  if (result) {
    return (
      <Card className="mt-4 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 no-select">Government Aid Programs</CardTitle>
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
            Check Another Crop
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="crop-type">Primary Crop</Label>
        <Select value={cropType} onValueChange={setCropType} required>
          <SelectTrigger id="crop-type">
            <SelectValue placeholder="Select crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rice">Rice</SelectItem>
            <SelectItem value="wheat">Wheat</SelectItem>
            <SelectItem value="cotton">Cotton</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="farm-size">Farm Size</Label>
        <Select value={farmSize} onValueChange={setFarmSize} required>
          <SelectTrigger id="farm-size">
            <SelectValue placeholder="Select farm size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (Less than 2 hectares)</SelectItem>
            <SelectItem value="medium">Medium (2-10 hectares)</SelectItem>
            <SelectItem value="large">Large (More than 10 hectares)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is-organic" checked={isOrganic} onCheckedChange={(checked) => setIsOrganic(checked === true)} />
        <Label htmlFor="is-organic">Practicing Organic Farming</Label>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? "Searching Programs..." : "Find Aid Programs"}
      </Button>
    </form>
  )
}

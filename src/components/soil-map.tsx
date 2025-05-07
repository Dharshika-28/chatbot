"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function SoilMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  // Soil data extracted from the PDF map
  const soilData = {
    "North India": {
      soilTypes: ["Alluvial Soil", "Red Soil", "Black Soil"],
      characteristics:
        "Alluvial soils are predominant in the Indo-Gangetic plains. They are rich in potash but poor in phosphorus.",
      crops: "Wheat, Rice, Sugarcane, Cotton",
    },
    "East India": {
      soilTypes: ["Red and Yellow Soil", "Laterite Soil", "Alluvial Soil"],
      characteristics:
        "Red soils are rich in iron but poor in nitrogen and phosphorus. Laterite soils are rich in iron and aluminum.",
      crops: "Rice, Jute, Tea, Coconut",
    },
    "West India": {
      soilTypes: ["Black Soil", "Desert Soil", "Saline Soil"],
      characteristics:
        "Black soils (Regur) are rich in calcium, potassium and magnesium but poor in nitrogen and phosphorus.",
      crops: "Cotton, Sugarcane, Tobacco, Oilseeds",
    },
    "South India": {
      soilTypes: ["Red Soil", "Laterite Soil", "Black Soil"],
      characteristics:
        "Red soils are found in Tamil Nadu, parts of Karnataka and Andhra Pradesh. They are rich in iron but poor in nitrogen.",
      crops: "Rice, Millets, Tobacco, Sugarcane, Cotton",
    },
    "Central India": {
      soilTypes: ["Black Soil", "Red and Yellow Soil", "Mixed Soil"],
      characteristics: "Black soils are predominant in the Deccan plateau. They have high water retention capacity.",
      crops: "Cotton, Jowar, Wheat, Linseed, Gram",
    },
  }

  const colorMap = {
    "Alluvial Soil": "bg-yellow-200",
    "Red Soil": "bg-red-300",
    "Black Soil": "bg-gray-800",
    "Laterite Soil": "bg-red-500",
    "Desert Soil": "bg-yellow-300",
    "Saline Soil": "bg-blue-200",
    "Red and Yellow Soil": "bg-orange-300",
    "Mixed Soil": "bg-green-200",
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-green-800">Indian Soil Map</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="relative w-full aspect-square max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden">
              {/* Simplified map of India with clickable regions */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* North India */}
                <path
                  d="M100,100 L300,100 L250,150 L150,150 Z"
                  className={`${activeRegion === "North India" ? "fill-green-500" : "fill-green-200"} cursor-pointer hover:fill-green-300 stroke-gray-500`}
                  onClick={() => setActiveRegion("North India")}
                />

                {/* East India */}
                <path
                  d="M250,150 L300,100 L320,200 L270,220 Z"
                  className={`${activeRegion === "East India" ? "fill-green-500" : "fill-green-200"} cursor-pointer hover:fill-green-300 stroke-gray-500`}
                  onClick={() => setActiveRegion("East India")}
                />

                {/* West India */}
                <path
                  d="M100,100 L150,150 L130,250 L80,200 Z"
                  className={`${activeRegion === "West India" ? "fill-green-500" : "fill-green-200"} cursor-pointer hover:fill-green-300 stroke-gray-500`}
                  onClick={() => setActiveRegion("West India")}
                />

                {/* Central India */}
                <path
                  d="M150,150 L250,150 L270,220 L200,250 L130,250 Z"
                  className={`${activeRegion === "Central India" ? "fill-green-500" : "fill-green-200"} cursor-pointer hover:fill-green-300 stroke-gray-500`}
                  onClick={() => setActiveRegion("Central India")}
                />

                {/* South India */}
                <path
                  d="M130,250 L200,250 L270,220 L220,300 L180,300 Z"
                  className={`${activeRegion === "South India" ? "fill-green-500" : "fill-green-200"} cursor-pointer hover:fill-green-300 stroke-gray-500`}
                  onClick={() => setActiveRegion("South India")}
                />

                {/* Region labels */}
                <text x="200" y="130" className="text-xs font-medium text-center" textAnchor="middle">
                  North India
                </text>
                <text x="280" y="180" className="text-xs font-medium" textAnchor="middle">
                  East India
                </text>
                <text x="110" y="180" className="text-xs font-medium" textAnchor="middle">
                  West India
                </text>
                <text x="200" y="200" className="text-xs font-medium" textAnchor="middle">
                  Central India
                </text>
                <text x="200" y="270" className="text-xs font-medium" textAnchor="middle">
                  South India
                </text>
              </svg>

              <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-1 rounded text-xs">
                Click on a region to view soil details
              </div>
            </div>

            {activeRegion && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">{activeRegion} Soil Profile</h3>

                <div className="mb-2">
                  <p className="text-sm font-medium">Soil Types:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {soilData[activeRegion as keyof typeof soilData].soilTypes.map((soilType) => (
                      <span
                        key={soilType}
                        className={`${colorMap[soilType as keyof typeof colorMap]} text-xs px-2 py-1 rounded-full ${soilType === "Black Soil" ? "text-white" : "text-gray-800"}`}
                      >
                        {soilType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium">Characteristics:</p>
                  <p className="text-xs text-gray-700">
                    {soilData[activeRegion as keyof typeof soilData].characteristics}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Suitable Crops:</p>
                  <p className="text-xs text-gray-700">{soilData[activeRegion as keyof typeof soilData].crops}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-3">
              {Object.entries(soilData).map(([region, data]) => (
                <div key={region} className="border border-gray-200 rounded-lg p-3 hover:bg-green-50">
                  <h3 className="font-medium text-green-800 mb-1">{region}</h3>

                  <div className="mb-1">
                    <p className="text-sm font-medium">Soil Types:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.soilTypes.map((soilType) => (
                        <span
                          key={soilType}
                          className={`${colorMap[soilType as keyof typeof colorMap]} text-xs px-2 py-0.5 rounded-full ${soilType === "Black Soil" ? "text-white" : "text-gray-800"}`}
                        >
                          {soilType}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-1">
                    <p className="text-sm font-medium">Suitable Crops:</p>
                    <p className="text-xs text-gray-700">{data.crops}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-gray-500">
          <p>Source: Based on soil distribution data from Indian agricultural surveys</p>
          <p>
            Note: This is a simplified representation. For detailed soil analysis, please consult local agricultural
            experts.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

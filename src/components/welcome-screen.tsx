"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChevronRight, Sprout, Droplets, FileText, HelpCircle, MessageSquare, Tractor } from "lucide-react"

interface WelcomeScreenProps {
  onSelectOption: (option: string) => void
  onStartChat: () => void
}

export function WelcomeScreen({ onSelectOption, onStartChat }: WelcomeScreenProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const mainOptions = [
    {
      id: "soil-testing",
      title: "Soil Testing",
      description: "Analyze your soil and get crop recommendations",
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      subOptions: [
        { id: "quick-test", label: "Quick Soil Test" },
        { id: "comprehensive-test", label: "Comprehensive Analysis" },
        { id: "previous-results", label: "View Previous Results" },
      ],
    },
    {
      id: "crop-advisory",
      title: "Crop Advisory",
      description: "Get advice on crop selection and management",
      icon: <Sprout className="h-5 w-5 text-green-500" />,
      subOptions: [
        { id: "crop-selection", label: "Crop Selection Guide" },
        { id: "pest-management", label: "Pest & Disease Management" },
        { id: "seasonal-tips", label: "Seasonal Farming Tips" },
      ],
    },
    {
      id: "government-schemes",
      title: "Government Schemes",
      description: "Information on subsidies and support programs",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      subOptions: [
        { id: "subsidies", label: "Available Subsidies" },
        { id: "loan-schemes", label: "Loan Schemes" },
        { id: "eligibility-check", label: "Check Eligibility" },
      ],
    },
    {
      id: "equipment-rental",
      title: "Equipment & Resources",
      description: "Access to farming equipment and resources",
      icon: <Tractor className="h-5 w-5 text-orange-500" />,
      subOptions: [
        { id: "equipment-rental", label: "Equipment Rental" },
        { id: "seed-suppliers", label: "Seed Suppliers" },
        { id: "irrigation-solutions", label: "Irrigation Solutions" },
      ],
    },
    {
      id: "expert-help",
      title: "Expert Assistance",
      description: "Connect with agricultural experts",
      icon: <HelpCircle className="h-5 w-5 text-red-500" />,
      subOptions: [
        { id: "connect-expert", label: "Connect with Expert" },
        { id: "schedule-visit", label: "Schedule Field Visit" },
        { id: "community-forum", label: "Join Farmer Community" },
      ],
    },
  ]

  const handleOptionClick = (optionId: string) => {
    if (expanded === optionId) {
      setExpanded(null)
    } else {
      setExpanded(optionId)
    }
  }

  const handleSubOptionClick = (subOptionId: string) => {
    onSelectOption(subOptionId)
  }

  return (
    <Card className="w-full border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-100">
        <CardTitle className="text-green-800 flex items-center justify-center ">
          <Sprout className="mr-2 h-5 w-5" />
          Welcome to AgriAssist
        </CardTitle>
        <CardDescription className="text-center">How can we help you today? Select an option below or start a chat.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {mainOptions.map((option) => (
          <div key={option.id} className="rounded-lg border overflow-hidden">
            <div
              className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${expanded === option.id ? "bg-green-50 border-b" : ""}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full mr-3 shadow-sm">{option.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-800" tabIndex={-1} onFocus={(e) => e.target.blur()}>
                    {option.title}
                  </h3>
                  <p className="text-xs text-gray-500" tabIndex={-1} onFocus={(e) => e.target.blur()}>
                    {option.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${expanded === option.id ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === option.id && (
              <div className="bg-gray-50 p-2">
                {option.subOptions.map((subOption) => (
                  <Button
                    key={subOption.id}
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-green-700 hover:bg-green-50 mb-1 last:mb-0"
                    onClick={() => handleSubOptionClick(subOption.id)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {subOption.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="pt-3 border-t mt-4">
          <Button onClick={onStartChat} className="w-full bg-green-600 hover:bg-green-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start a Chat
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Can't find what you're looking for? Start a chat with our AI assistant.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

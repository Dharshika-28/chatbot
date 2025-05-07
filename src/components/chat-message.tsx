"use client"

import { useState } from "react"
import { SoilTestingForm } from './soil-testing-form'
import { GovernmentAidForm } from './government-aid-form'
import { Button } from './ui/button'

type Message = {
  id: string
  content: string
  role: "user" | "bot"
  type?: "text" | "soil-form" | "aid-form"
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot"
  const [showSoilForm, setShowSoilForm] = useState(false)
  const [showAidForm, setShowAidForm] = useState(false)

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isBot ? "bg-white border border-gray-200 text-gray-800" : "bg-green-600 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {isBot && message.type === "soil-form" && (
          <div className="mt-3">
            {showSoilForm ? (
              <SoilTestingForm />
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-1 h-auto sm:h-9"
                onClick={() => setShowSoilForm(true)}
              >
                Open Soil Testing Form
              </Button>
            )}
          </div>
        )}

        {isBot && message.type === "aid-form" && (
          <div className="mt-3">
            {showAidForm ? (
              <GovernmentAidForm />
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-1 h-auto sm:h-9"
                onClick={() => setShowAidForm(true)}
              >
                Open Government Aid Form
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

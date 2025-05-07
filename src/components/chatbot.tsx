"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChatMessage } from './chat-message'
import { SuggestedQuestions } from './suggested-questions'

type Message = {
  id: string
  content: string
  role: "user" | "bot"
  type?: "text" | "soil-form" | "aid-form"
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm AgriAssist Bot. I can help you with soil testing and government aid programs. What would you like to know?",
      role: "bot",
      type: "text",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowSuggestions(false)

    // Simple keyword matching for intent detection
    const lowerInput = input.toLowerCase()
    let botResponse: Message

    if (lowerInput.includes("soil") || lowerInput.includes("test") || lowerInput.includes("color")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        content: "I can help you with soil testing. Please fill out this form:",
        role: "bot",
        type: "soil-form",
      }
    } else if (
      lowerInput.includes("government") ||
      lowerInput.includes("aid") ||
      lowerInput.includes("assistance") ||
      lowerInput.includes("program") ||
      lowerInput.includes("scheme") ||
      lowerInput.includes("subsidy") ||
      lowerInput.includes("loan")
    ) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        content: "I can provide information about government aid programs. Please tell me about your crops:",
        role: "bot",
        type: "aid-form",
      }
    } else if (
      lowerInput.includes("help") ||
      lowerInput.includes("what can you do") ||
      lowerInput.includes("how to use")
    ) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm your agricultural assistant! Here's how I can help:\n\n" +
          "1️⃣ Soil Testing: I can analyze your soil type and suggest suitable crops and amendments\n\n" +
          "2️⃣ Government Aid: I can help you find agricultural schemes, subsidies and loans you may be eligible for\n\n" +
          "Just ask me about any of these topics or use the suggested questions below!",
        role: "bot",
        type: "text",
      }
      setShowSuggestions(true)
    } else {
      botResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm here to help with soil testing and government aid information. Could you please specify which service you're interested in? You can ask about soil testing, soil color identification, or government schemes for farmers.",
        role: "bot",
        type: "text",
      }
      setShowSuggestions(true)
    }

    // Simulate API delay
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleSelectQuestion = (question: string) => {
    setInput(question)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>AgriAssist Bot is thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        {showSuggestions && messages.length < 3 && <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />}
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

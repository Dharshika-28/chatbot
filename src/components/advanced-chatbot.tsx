"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Camera, Droplets, Bug, X } from "lucide-react"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { SuggestedQuestions } from './suggested-questions'
import { CameraUpload } from './camera-upload'
import { WelcomeScreen } from './welcome-screen'
import { ExpertConnection } from './expert-connection'
import { EnhancedSoilTesting } from './enhanced-soil-testing'
import { SoilCameraScanner } from './soil-camera-scanner'
import { PestDetection } from './pest-detection'
import { SoilTestingForm } from './soil-testing-form'
import { GovernmentAidForm } from './government-aid-form'

type Message = {
  id: string
  content: string
  role: "user" | "bot"
  type?: "text" | "soil-form" | "aid-form"
  timestamp: Date
  image?: string
}

type ConversationContext = {
  lastIntent?: string
  userLocation?: string
  soilType?: string
  cropType?: string
  farmSize?: string
  previousQueries: string[]
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg p-3 text-sm max-w-md ${message.role === "user" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"}`}
      >
        {message.image && (
          <img
            src={message.image || "/placeholder.svg"}
            alt="User uploaded"
            className="max-w-full h-auto mb-2 rounded-md"
          />
        )}

        {message.type === "soil-form" ? (
          <div className="mt-2">
            <p className="mb-2">{message.content}</p>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <SoilTestingForm onSubmit={(data) => console.log("Soil test submitted:", data)} />
            </div>
          </div>
        ) : message.type === "aid-form" ? (
          <div className="mt-2">
            <p className="mb-2">{message.content}</p>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <GovernmentAidForm />
            </div>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  )
}

export function AdvancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [showCameraUpload, setShowCameraUpload] = useState(false)
  const [showExpertConnect, setShowExpertConnect] = useState(false)
  const [showEnhancedSoilTest, setShowEnhancedSoilTest] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [context, setContext] = useState<{ soilType?: string; lastIntent?: string }>({})
  const [showSoilScanner, setShowSoilScanner] = useState(false)
  const [showPestDetection, setShowPestDetection] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const saveMessageToDatabase = async (message: string, role: "user" | "bot", type?: string, image?: string) => {
    try {
      const timestamp = new Date().toISOString()
      const userId = "current-user-id"

      const messageData = {
        id: Date.now().toString(),
        conversation_id: conversationId || undefined,
        content: message,
        role,
        type: type || "text",
        timestamp,
        image: image || null,
      }

      if (!conversationId) {
        const newConversationId = Date.now().toString()

        await fetch("/api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            message,
            role,
            type: type || "text",
            image,
          }),
        })
          .then((response) => {
            if (response.ok) return response.json()
            throw new Error("Failed to save message")
          })
          .then((result) => {
            if (result.id) {
              setConversationId(result.id)
            }
          })
          .catch((error) => {
            console.error("Error saving message:", error)
          })
      } else {
        await fetch("/api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            conversationId,
            message,
            role,
            type: type || "text",
            image,
          }),
        }).catch((error) => {
          console.error("Error saving message:", error)
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Error saving message:", error)
      return { success: false }
    }
  }

  const handleResetChat = () => {
    setMessages([])
    setShowWelcomeScreen(true)
    setShowSuggestions(true)
    setInput("")
    setIsLoading(false)
    setShowCameraUpload(false)
    setShowExpertConnect(false)
    setShowEnhancedSoilTest(false)
    setShowSoilScanner(false)
    setShowPestDetection(false)
    setContext({})
    setConversationId(null)
  }

  const sendBotResponse = async (response: { content: string; type?: string }) => {
    setIsLoading(true);
    
    const botMessage = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      role: "bot" as const,
      type: response.type,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    await saveMessageToDatabase(botMessage.content, "bot", response.type);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);
    setShowWelcomeScreen(false);

    await saveMessageToDatabase(userMessage.content, "user");

    const intent = detectIntent(input);
    const response = generateResponse(intent, input, context);

    // Automatically send bot response after a short delay
    setTimeout(async () => {
      await sendBotResponse(response);
      
      // For certain intents, automatically trigger follow-up actions
      if (intent === "expert_connect") {
        setShowExpertConnect(true);
      } else if (intent === "enhanced_soil_test") {
        setShowEnhancedSoilTest(true);
      } else if (intent === "pest_detection") {
        setShowPestDetection(true);
      } else if (intent === "soil_test") {
        // Auto-suggest soil scanner if soil test is mentioned
        setTimeout(async () => {
          await sendBotResponse({
            content: "Would you like to use the soil scanner to analyze your soil?",
            type: "text"
          });
        }, 500);
      }
    }, 1000);
  }

  const handleSoilDetected = (soilAnalysis) => {
    const soilMessage = {
      id: Date.now().toString(),
      content: `Based on the soil analysis, I've detected ${soilAnalysis.soilType} soil with ${soilAnalysis.color} color. This soil has ${soilAnalysis.fertility} fertility and ${soilAnalysis.organicMatter} organic matter content.`,
      role: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, soilMessage])

    const recommendationsMessage = {
      id: (Date.now() + 1).toString(),
      content: `Recommendations for your ${soilAnalysis.soilType} soil:\n${soilAnalysis.recommendations.join("\n")}`,
      role: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, recommendationsMessage])

    saveMessageToDatabase(soilMessage.content, "bot")
    saveMessageToDatabase(recommendationsMessage.content, "bot")

    setContext((prev) => ({
      ...prev,
      soilType: soilAnalysis.soilType,
      lastIntent: "soil_analysis",
    }))

    setShowSoilScanner(false)
  }

  const handlePestDetected = (pestAnalysis) => {
    const pestMessage = {
      id: Date.now().toString(),
      content: `I've identified ${pestAnalysis.pestType} in your image with ${Math.round(pestAnalysis.confidence * 100)}% confidence. ${pestAnalysis.description}`,
      role: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, pestMessage])

    const damageMessage = {
      id: (Date.now() + 1).toString(),
      content: `Typical damage: ${pestAnalysis.damage}`,
      role: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, damageMessage])

    const treatmentMessage = {
      id: (Date.now() + 2).toString(),
      content: `Recommended treatments:\n${pestAnalysis.treatments.join("\n")}`,
      role: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, treatmentMessage])

    saveMessageToDatabase(pestMessage.content, "bot")
    saveMessageToDatabase(damageMessage.content, "bot")
    saveMessageToDatabase(treatmentMessage.content, "bot")

    setShowPestDetection(false)
  }

  const detectIntent = (input) => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("soil") || lowerInput.includes("test") || lowerInput.includes("color")) {
      return "soil_test"
    } else if (
      lowerInput.includes("government") ||
      lowerInput.includes("aid") ||
      lowerInput.includes("assistance") ||
      lowerInput.includes("program") ||
      lowerInput.includes("scheme") ||
      lowerInput.includes("subsidy") ||
      lowerInput.includes("loan")
    ) {
      return "government_aid"
    } else if (
      lowerInput.includes("help") ||
      lowerInput.includes("what can you do") ||
      lowerInput.includes("how to use")
    ) {
      return "help"
    } else if (lowerInput.includes("expert") || lowerInput.includes("connect")) {
      return "expert_connect"
    } else if (lowerInput.includes("enhanced") && lowerInput.includes("soil test")) {
      return "enhanced_soil_test"
    } else if (
      lowerInput.includes("pest") ||
      lowerInput.includes("insect") ||
      lowerInput.includes("bug") ||
      lowerInput.includes("disease")
    ) {
      return "pest_detection"
    } else {
      return "default_intent"
    }
  }

  const generateResponse = (intent, input, context) => {
    switch (intent) {
      case "soil_test":
        return {
          content:
            context.soilType 
              ? `I see you previously had ${context.soilType} soil. Would you like to run a new soil test or see recommendations again?`
              : "I can help you with soil testing. Please fill out this form or use the camera to analyze your soil:",
          type: "soil-form",
        }
      case "government_aid":
        return {
          content: "I can provide information about government aid programs. Please tell me about your crops:",
          type: "aid-form",
        }
      case "help":
        setShowSuggestions(true)
        return {
          content:
            "I'm your agricultural assistant! Here's how I can help:\n\n" +
            "1️⃣ Soil Testing: I can analyze your soil type and suggest suitable crops and amendments\n\n" +
            "2️⃣ Government Aid: I can help you find agricultural schemes, subsidies and loans you may be eligible for\n\n" +
            "3️⃣ Pest Detection: I can identify common pests and suggest treatments\n\n" +
            "Just ask me about any of these topics or use the suggested questions below!",
          type: "text",
        }
      case "expert_connect":
        return {
          content: "I'll connect you to an agricultural expert. Please provide some details about your issue:",
          type: "text",
        }
      case "enhanced_soil_test":
        return {
          content: "I'll help you with an enhanced soil test. This will provide more detailed analysis than standard tests.",
          type: "text",
        }
      case "pest_detection":
        return {
          content:
            "Let's identify the pests affecting your crops. Please take a clear photo of the pest or affected plant part.",
          type: "text",
        }
      default:
        setShowSuggestions(true)
        return {
          content:
            "I'm here to help with soil testing, government aid information, and pest detection. Could you please specify which service you're interested in?",
          type: "text",
        }
    }
  }

  const handleSelectOption = (option: string) => {
    setShowWelcomeScreen(false)
    if (option === "connect-expert") {
      setShowExpertConnect(true)
      sendBotResponse({
        content: "I'll connect you to an agricultural expert. Please provide some details about your issue:",
        type: "text"
      });
    } else if (option === "enhanced-soil-test") {
      setShowEnhancedSoilTest(true)
      sendBotResponse({
        content: "I'll help you with an enhanced soil test. This will provide more detailed analysis than standard tests.",
        type: "text"
      });
    } else {
      setInput(`I am interested in ${option.replace("-", " ")}.`)
      // Auto-send the message
      setTimeout(() => {
        handleSendMessage();
      }, 0);
    }
  }

  const handleStartChat = () => {
    setShowWelcomeScreen(false)
    setShowSuggestions(true)
    // Auto-send welcome message
    sendBotResponse({
      content: "Hello! I'm your agricultural assistant. How can I help you today?",
      type: "text"
    });
  }

  const handleSelectQuestion = (question: string) => {
    setInput(question)
    // Auto-send the selected question
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageCapture = (imageData) => {
    const imageMessage = {
      id: Date.now().toString(),
      content: "I've taken a photo for analysis.",
      role: "user",
      timestamp: new Date(),
      image: imageData,
    }

    setMessages((prev) => [...prev, imageMessage])
    setIsLoading(true)
    setShowWelcomeScreen(false)

    saveMessageToDatabase(imageMessage.content, "user", "text", imageData)

    setTimeout(() => {
      const analysisOptions = {
        id: (Date.now() + 1).toString(),
        content: "What would you like me to analyze in this image?",
        role: "bot",
        type: "text",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, analysisOptions])
      saveMessageToDatabase(analysisOptions.content, "bot")

      const optionsMessage = {
        id: (Date.now() + 2).toString(),
        content: "Please type 'soil' for soil analysis or 'pest' for pest detection.",
        role: "bot",
        type: "text",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, optionsMessage])
      saveMessageToDatabase(optionsMessage.content, "bot")

      setIsLoading(false)
    }, 1000)
  }

  const handleOpenCamera = () => {
    setShowCameraUpload(true)
  }

  const handleCloseCamera = () => {
    setShowCameraUpload(false)
  }

  const handleCloseExpertConnect = () => {
    setShowExpertConnect(false)
  }

  const handleCloseEnhancedSoilTest = () => {
    setShowEnhancedSoilTest(false)
  }

  return (
    <div className="flex flex-col h-[600px] relative">
      {/* Cancel button - positioned at top right */}
      {!showWelcomeScreen && (
        <button
          onClick={handleResetChat}
          className="absolute top-2 right-2 p-2 rounded-full bg-green-500 hover:bg-gray-200 transition-colors z-10"
          aria-label="Reset chat"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showWelcomeScreen ? (
          <WelcomeScreen onSelectOption={handleSelectOption} onStartChat={handleStartChat} />
        ) : (
          <>
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
          </>
        )}
      </div>

      {showCameraUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CameraUpload
            onImageCapture={handleImageCapture}
            onClose={handleCloseCamera}
            onTroubleshoot={() => alert("Troubleshooting steps...")}
          />
        </div>
      )}

      {showExpertConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ExpertConnection onClose={handleCloseExpertConnect} />
        </div>
      )}

      {showEnhancedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <EnhancedSoilTesting onClose={handleCloseEnhancedSoilTest} />
        </div>
      )}

      {showSoilScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <SoilCameraScanner onSoilDetected={handleSoilDetected} onClose={() => setShowSoilScanner(false)} />
        </div>
      )}

      {showPestDetection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <PestDetection onPestDetected={handlePestDetected} onClose={() => setShowPestDetection(false)} />
        </div>
      )}

      <div className="border-t p-4">
        {/* Show suggestions when welcome screen is gone and there are few messages */}
        {!showWelcomeScreen && showSuggestions && messages.length < 3 && (
          <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
        )}
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
          <Button onClick={handleOpenCamera} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowSoilScanner(true)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Droplets className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowPestDetection(true)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
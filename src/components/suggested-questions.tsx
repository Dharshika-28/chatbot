"use client"

import { Button } from './ui/button'
import { useMediaQuery } from '../hooks/use-media-query'

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Use shorter questions on mobile
  const questions = isMobile
    ? ["Soil testing?", "Soil color?", "Aid programs?", "Expert help?", "Test my soil?"]
    : [
        "How can I test my soil?",
        "What does my soil color tell me?",
        "What schemes are available for farmers?",
        "I need to speak with an expert",
        "I want to request a soil test service",
      ]

  return (
    <div className="mb-2 sm:mb-3">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {questions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            className="text-[10px] sm:text-xs border-green-200 text-green-700 hover:bg-green-50 py-0 px-2 h-6 sm:h-auto sm:py-1"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}

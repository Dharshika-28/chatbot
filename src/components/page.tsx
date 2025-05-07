import { AdvancedChatbot } from "./advanced-chatbot"
import { TextSelectionPrevention } from "./text-selection-prevention"

export default function Home() {
  return (
    <TextSelectionPrevention>
      <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 md:p-24 bg-gradient-to-b from-green-50 to-green-100">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-1 sm:mb-2 text-center no-select"
            tabIndex={-1}
          >
            AgriAssist Bot
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center no-select" tabIndex={-1}>
            Your AI-powered assistant for soil testing and government aid information
          </p>

          <div className="bg-white rounded-lg p-2 sm:p-4 mb-4 sm:mb-8 text-center max-w-2xl w-full">
            <h2 className="font-medium text-green-700 mb-1 sm:mb-2 text-sm sm:text-base no-select" tabIndex={-1}>
              How This Chatbot Helps You:
            </h2>
            <ul className="text-left text-xs sm:text-sm space-y-1 sm:space-y-2 mb-2 sm:mb-4 no-select">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0 text-xs">
                  1
                </span>
                <span tabIndex={-1} className="no-select">
                  <strong>Soil Testing:</strong> Analyze your soil type, color, and get recommendations
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0 text-xs">
                  2
                </span>
                <span tabIndex={-1} className="no-select">
                  <strong>Government Aid:</strong> Find agricultural schemes and subsidies
                </span>
              </li>
            </ul>
            <p className="text-[10px] sm:text-xs text-gray-500 no-select" tabIndex={-1}>
              Type your question, use the suggested questions, or take a photo!
            </p>
          </div>

          <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
            <AdvancedChatbot />
          </div>
        </div>
      </main>
    </TextSelectionPrevention>
  )
}

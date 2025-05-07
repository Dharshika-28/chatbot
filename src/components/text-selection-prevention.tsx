"use client"

import type React from "react"

import { useEffect } from "react"

export function TextSelectionPrevention({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add a global style to prevent text selection
    const style = document.createElement("style")
    style.innerHTML = `
      p, h1, h2, h3, h4, h5, h6, span, div:not([contenteditable="true"]), 
      li, ul, ol, button, a, label, .chat-message {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        cursor: default !important;
      }
      
      a, button, [role="button"] {
        cursor: pointer !important;
      }
      
      input, textarea, select, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        cursor: text !important;
      }
      
      *:focus:not(input):not(textarea):not(select):not([contenteditable="true"]) {
        outline: none !important;
      }
    `
    document.head.appendChild(style)

    // Prevent copy, cut, and paste operations on non-input elements
    const preventCopyPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.hasAttribute("contenteditable")) {
        e.preventDefault()
        return false
      }
      return true
    }

    // Prevent context menu on non-input elements
    const preventContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.hasAttribute("contenteditable")) {
        e.preventDefault()
        return false
      }
      return true
    }

    // Add event listeners
    document.addEventListener("copy", preventCopyPaste, true)
    document.addEventListener("cut", preventCopyPaste, true)
    document.addEventListener("paste", preventCopyPaste, true)
    document.addEventListener("contextmenu", preventContextMenu, true)

    // Clean up
    return () => {
      document.head.removeChild(style)
      document.removeEventListener("copy", preventCopyPaste, true)
      document.removeEventListener("cut", preventCopyPaste, true)
      document.removeEventListener("paste", preventCopyPaste, true)
      document.removeEventListener("contextmenu", preventContextMenu, true)
    }
  }, [])

  return <>{children}</>
}

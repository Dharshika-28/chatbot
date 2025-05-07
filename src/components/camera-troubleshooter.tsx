"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from './ui/dialog'
import { CameraDebugHelper } from "./camera-debug-helper"

export function CameraTroubleshooter() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Listen for the custom event to show the camera debug helper
    const handleShowDebug = () => setIsOpen(true)
    window.addEventListener("show-camera-debug", handleShowDebug)

    return () => {
      window.removeEventListener("show-camera-debug", handleShowDebug)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <CameraDebugHelper />
      </DialogContent>
    </Dialog>
  )
}

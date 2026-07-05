"use client"

import { useEffect } from "react"
import { useUiStore, useAudioStore, useToastStore } from "@/store"

export function useKeyboardShortcuts() {
  const togglePause = useAudioStore((s) => s.togglePause)
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const searchOpen = useUiStore((s) => s.searchOpen)
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const mod = e.metaKey || e.ctrlKey

      if (key === "k" && mod) {
        e.preventDefault()
        setSearchOpen(!searchOpen)
        return
      }

      if (key === " " && !mod && e.target instanceof HTMLElement && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && !e.target.isContentEditable) {
        e.preventDefault()
        togglePause()
        return
      }

      if (key === "m" && !mod) {
        e.preventDefault()
        addToast({ type: "info", title: "Mute Toggle", description: isPlaying ? "Audio muted" : "Audio unmuted" })
        return
      }

      if (e.key === "?" && !mod) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePause, isPlaying, setSearchOpen, searchOpen, addToast])
}

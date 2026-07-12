"use client"

import { useEffect, useCallback } from "react"
import { useUiStore, useAudioStore, useToastStore, useFavoritesStore } from "@/store"
import { getSoundById } from "@/data/sounds"

const VOLUME_STEP = 0.05

export function useKeyboardShortcuts() {
  const togglePause = useAudioStore((s) => s.togglePause)
  const volume = useAudioStore((s) => s.volume)
  const setMasterVolume = useAudioStore((s) => s.setMasterVolume)
  const stopSound = useAudioStore((s) => s.stopSound)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const rightPanelOpen = useUiStore((s) => s.rightPanelOpen)
  const setRightPanelOpen = useUiStore((s) => s.setRightPanelOpen)
  const searchOpen = useUiStore((s) => s.searchOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const ambientMode = useUiStore((s) => s.ambientMode)
  const setAmbientMode = useUiStore((s) => s.setAmbientMode)
  const setHelpOpen = useUiStore((s) => s.setHelpOpen)
  const addToast = useToastStore((s) => s.addToast)
  const toggleFavorite = useFavoritesStore((s) => s.toggleSound)

  const toggleMute = useCallback(() => {
    const vol = useAudioStore.getState().volume
    if (vol > 0) {
      useAudioStore.getState().setMasterVolume(0)
      addToast({ type: "info", title: "Muted" })
    } else {
      useAudioStore.getState().setMasterVolume(0.8)
      addToast({ type: "info", title: "Unmuted" })
    }
  }, [addToast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (ambientMode) return

      const key = e.key.toLowerCase()
      const mod = e.metaKey || e.ctrlKey
      const target = e.target instanceof HTMLElement ? e.target : null
      const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable

      if (key === "k" && mod) {
        e.preventDefault()
        setSearchOpen(!searchOpen)
        return
      }

      if (key === "escape") {
        if (searchOpen) { setSearchOpen(false); return }
        if (sidebarOpen) { setSidebarOpen(false); return }
        if (rightPanelOpen) { setRightPanelOpen(false); return }
        return
      }

      if (e.key === "?" && !mod) {
        e.preventDefault()
        setHelpOpen(true)
        return
      }

      if (isInput) return

      if (key === " " || e.key === "Space") {
        e.preventDefault()
        togglePause()
        return
      }

      if (key === "arrowup" || key === "=" || key === "+") {
        e.preventDefault()
        setMasterVolume(Math.min(1, useAudioStore.getState().volume + VOLUME_STEP))
        return
      }

      if (key === "arrowdown" || key === "-" || key === "_") {
        e.preventDefault()
        setMasterVolume(Math.max(0, useAudioStore.getState().volume - VOLUME_STEP))
        return
      }

      if (key === "s") {
        e.preventDefault()
        setSidebarOpen(!sidebarOpen)
        return
      }

      if (key === "r") {
        e.preventDefault()
        setRightPanelOpen(!rightPanelOpen)
        return
      }

      if (key === "a") {
        e.preventDefault()
        const sounds = useAudioStore.getState().isPlayingSounds
        if (sounds.size > 0 || ambientMode) {
          setAmbientMode(!ambientMode)
        }
        return
      }

      if (key === "n") {
        e.preventDefault()
        const sounds = useAudioStore.getState().isPlayingSounds
        if (sounds.size > 0) {
          const arr = Array.from(sounds)
          stopSound(arr[arr.length - 1])
        }
        return
      }

      if (key === "m") {
        e.preventDefault()
        toggleMute()
        return
      }

      if (key === "f") {
        e.preventDefault()
        const currentId = useAudioStore.getState().currentSoundId
        if (currentId) {
          toggleFavorite(currentId)
          const nowFav = useFavoritesStore.getState().isSoundFavorited(currentId)
          const sound = getSoundById(currentId)
          addToast({
            type: nowFav ? "success" : "info",
            title: nowFav ? "Added to favorites" : "Removed from favorites",
            description: sound?.title ?? currentId,
          })
        }
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    togglePause, volume, setMasterVolume, stopSound,
    sidebarOpen, setSidebarOpen, rightPanelOpen, setRightPanelOpen,
    searchOpen, setSearchOpen, ambientMode, setAmbientMode,
    setHelpOpen, addToast, toggleFavorite, toggleMute,
  ])
}

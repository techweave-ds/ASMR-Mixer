"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause, Volume2, Timer } from "lucide-react"
import { useAudioStore, useUiStore } from "@/store"
import { getSoundById, categoryLabels } from "@/data/sounds"
import { cn } from "@/lib/utils"

export function AmbientOverlay() {
  const ambientMode = useUiStore((s) => s.ambientMode)
  const setAmbientMode = useUiStore((s) => s.setAmbientMode)
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isPaused = useAudioStore((s) => s.isPaused)
  const isPlayingSounds = useAudioStore((s) => s.isPlayingSounds)
  const volume = useAudioStore((s) => s.volume)
  const masterVolume = useAudioStore((s) => s.setMasterVolume)
  const togglePause = useAudioStore((s) => s.togglePause)
  const timerRemaining = useAudioStore((s) => s.timerRemaining)
  const timerMinutes = useAudioStore((s) => s.timerMinutes)
  const cursorTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [cursorVisible, setCursorVisible] = useState(true)

  const playingArray = Array.from(isPlayingSounds)
  const hasSounds = playingArray.length > 0
  const showPlayIcon = !isPlaying || isPaused

  const handleExit = useCallback(() => {
    setAmbientMode(false)
  }, [setAmbientMode])

  useEffect(() => {
    if (!ambientMode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleExit()
      if (e.key === " " || e.key === "Space") { e.preventDefault(); togglePause() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ambientMode, handleExit, togglePause])

  useEffect(() => {
    if (!ambientMode) return
    const show = () => {
      setCursorVisible(true)
      if (cursorTimer.current) clearTimeout(cursorTimer.current)
      cursorTimer.current = setTimeout(() => setCursorVisible(false), 3000)
    }
    show()
    window.addEventListener("mousemove", show)
    window.addEventListener("touchstart", show)
    return () => {
      window.removeEventListener("mousemove", show)
      window.removeEventListener("touchstart", show)
      if (cursorTimer.current) clearTimeout(cursorTimer.current)
    }
  }, [ambientMode])

  const formatTimer = () => {
    if (!timerRemaining || timerRemaining <= 0) return null
    const h = Math.floor(timerRemaining / 3600)
    const m = Math.floor((timerRemaining % 3600) / 60)
    const s = timerRemaining % 60
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    return `${m}:${String(s).padStart(2, "0")}`
  }

  return (
    <AnimatePresence>
      {ambientMode && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center",
            "bg-gradient-to-b from-[#03050A] via-[#050812] to-[#080C1A]",
            cursorVisible ? "cursor-auto" : "cursor-none"
          )}
          onClick={(e) => { if (e.target === overlayRef.current) handleExit() }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/3 blur-[100px]" />
          </div>

          {/* Exit button */}
          <button onClick={handleExit}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10">
            <X size={16} />
          </button>

          {/* Timer badge */}
          {timerMinutes && timerRemaining && timerRemaining > 0 && (
            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-white/50 z-10">
              <Timer size={12} />
              <span>{formatTimer()}</span>
            </div>
          )}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-lg">
            {/* Sound info */}
            <div className="space-y-2">
              {hasSounds ? (
                <>
                  {playingArray.length === 1 ? (
                    (() => {
                      const s = getSoundById(playingArray[0])
                      return (
                        <>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-white/20">
                            {s ? categoryLabels[s.category] || s.category : ""}
                          </p>
                          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight">
                            {s?.title || playingArray[0]}
                          </h1>
                        </>
                      )
                    })()
                  ) : (
                    <>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/20">Mixed Layers</p>
                      <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                        {playingArray.length} sounds
                      </h1>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {playingArray.slice(0, 5).map((sid) => {
                          const s = getSoundById(sid)
                          return (
                            <span key={sid} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/40">
                              {s?.title || sid}
                            </span>
                          )
                        })}
                        {playingArray.length > 5 && (
                          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/30">
                            +{playingArray.length - 5}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-lg text-white/20 font-light">Nothing playing</p>
              )}
            </div>

            {/* Play/Pause */}
            <button onClick={togglePause} disabled={!hasSounds}
              className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/15 active:scale-[0.95] transition-all disabled:opacity-30 disabled:cursor-default shadow-2xl">
              {showPlayIcon ? <Play size={28} className="ml-1" /> : <Pause size={28} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-3 w-full max-w-xs">
              <Volume2 size={14} className="text-white/30 shrink-0" />
              <input type="range" min={0} max={1} step={0.01} value={volume}
                onChange={(e) => masterVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgba(90,124,255,0.6) 0%, rgba(90,124,255,0.6) ${volume * 100}%, rgba(255,255,255,0.08) ${volume * 100}%, rgba(255,255,255,0.08) 100%)`,
                }}
                aria-label="Master volume"
              />
              <span className="text-[10px] text-white/30 w-6 text-right tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Hint */}
          <p className="absolute bottom-8 text-[10px] text-white/10 tracking-wider z-10">
            Press ESC to exit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

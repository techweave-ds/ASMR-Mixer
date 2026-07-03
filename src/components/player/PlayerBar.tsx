"use client"

import { useState } from "react"
import {
  Play, Pause, SkipBack, SkipForward, Heart,
  Volume2, Timer, Shuffle, Repeat,
  ListMusic, MonitorSpeaker, Settings, Disc3
} from "lucide-react"
import { useAudioStore, useFavoritesStore } from "@/store"
import { cn } from "@/lib/utils"
import { getSoundById } from "@/data/sounds"

const TIMER_OPTIONS = [15, 30, 45, 60, 120]

export function PlayerBar() {
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isPaused = useAudioStore((s) => s.isPaused)
  const isPlayingSounds = useAudioStore((s) => s.isPlayingSounds)
  const volume = useAudioStore((s) => s.volume)
  const setMasterVolume = useAudioStore((s) => s.setMasterVolume)
  const togglePause = useAudioStore((s) => s.togglePause)
  const timerMinutes = useAudioStore((s) => s.timerMinutes)
  const timerRemaining = useAudioStore((s) => s.timerRemaining)
  const setTimer = useAudioStore((s) => s.setTimer)
  const cancelTimer = useAudioStore((s) => s.cancelTimer)
  const isSoundFavorited = useFavoritesStore((s) => s.isSoundFavorited)
  const toggleFav = useFavoritesStore((s) => s.toggleSound)
  const [showTimer, setShowTimer] = useState(false)
  const [showVolume, setShowVolume] = useState(false)

  const playingArray = Array.from(isPlayingSounds)
  const hasSounds = playingArray.length > 0
  const firstSound = hasSounds ? getSoundById(playingArray[0]) : null
  const singleMode = hasSounds && playingArray.length === 1
  const favorited = hasSounds && singleMode && isSoundFavorited(playingArray[0])
  const showPlayIcon = !isPlaying || isPaused

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const formatTimerRemaining = () => {
    if (!timerRemaining || timerRemaining <= 0) return null
    const h = Math.floor(timerRemaining / 3600)
    const m = Math.floor((timerRemaining % 3600) / 60)
    const s = timerRemaining % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className={cn("h-[92px] flex-shrink-0 border-t flex items-center px-4 lg:px-6 gap-4 transition-all duration-300",
      hasSounds ? "bg-[#0c0c14] border-border-subtle" : "bg-transparent border-transparent")}>
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 min-w-0 w-[280px] flex-shrink-0">
        <div className={cn("h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden shadow-lg flex items-center justify-center",
          hasSounds ? "bg-gradient-to-br" : "bg-glass border border-border-subtle")}
          style={firstSound?.coverUrl ? { backgroundImage: `url(${firstSound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!hasSounds && <Disc3 size={20} className="text-text-quaternary" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("truncate text-sm font-medium", hasSounds ? "text-text-primary" : "text-text-tertiary")}>
              {hasSounds ? (singleMode ? firstSound?.title ?? playingArray[0] : `${playingArray.length} Sounds`) : "No sounds playing"}
            </p>
            {favorited && <Heart size={10} className="text-accent-red flex-shrink-0" fill="currentColor" />}
          </div>
          <p className="truncate text-xs text-text-tertiary">
            {hasSounds ? (singleMode ? firstSound?.category ?? "" : `${playingArray.length} active layers`) : "Pick a sound to begin"}
          </p>
        </div>
        {singleMode && (
          <button onClick={() => toggleFav(playingArray[0])}
            className={cn("rounded-lg p-1.5 transition-colors flex-shrink-0", favorited ? "text-accent-red" : "text-text-quaternary hover:text-text-secondary")}>
            <Heart size={14} fill={favorited ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-[600px] mx-auto">
        <div className="flex items-center gap-5">
          <button className={cn("transition-colors", hasSounds ? "text-text-quaternary hover:text-text-secondary" : "text-text-quaternary/30")} disabled={!hasSounds}><Shuffle size={15} /></button>
          <button className={cn("transition-colors", hasSounds ? "text-text-quaternary hover:text-text-secondary" : "text-text-quaternary/30")} disabled={!hasSounds}><SkipBack size={17} /></button>
          <button onClick={() => hasSounds && togglePause()}
            className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-all",
              hasSounds ? "bg-accent/15 text-accent-light hover:bg-accent/25 hover:scale-105 active:scale-95 play-btn-glow cursor-pointer" : "bg-glass text-text-quaternary/30 cursor-default")}>
            {showPlayIcon ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button className={cn("transition-colors", hasSounds ? "text-text-quaternary hover:text-text-secondary" : "text-text-quaternary/30")} disabled={!hasSounds}><SkipForward size={17} /></button>
          <button className={cn("transition-colors", hasSounds ? "text-text-quaternary hover:text-text-secondary" : "text-text-quaternary/30")} disabled={!hasSounds}><Repeat size={15} /></button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-text-quaternary w-8 text-right flex-shrink-0">{formatTime(0)}</span>
          <div className={cn("flex-1 h-1 rounded-full relative", hasSounds ? "bg-border group cursor-pointer" : "bg-border/30")}>
            <div className="h-full w-0 rounded-full bg-text-primary/20 transition-colors" />
          </div>
          <span className="text-[10px] text-text-quaternary w-8 flex-shrink-0">
            {hasSounds && firstSound ? formatTime(firstSound.duration) : formatTime(0)}
          </span>
        </div>
      </div>

      {/* Right: Volume + Widgets */}
      <div className="flex items-center gap-3 w-[280px] flex-shrink-0 justify-end">
        <div className="flex items-center gap-2">
          <button
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            className="text-text-quaternary hover:text-text-secondary transition-colors relative"
          >
            <Volume2 size={16} />
            {showVolume && (
              <div className="absolute bottom-full right-0 mb-2 p-2 rounded-lg bg-bg-elevated border border-border-subtle shadow-2xl"
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}>
                <div className="h-20 w-5 flex items-center justify-center">
                  <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="h-full w-1 appearance-none bg-border rounded-full cursor-pointer"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                </div>
              </div>
            )}
          </button>
          <span className="text-[10px] text-text-quaternary w-6">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex items-center gap-1">
          <button className={cn("h-8 w-8 rounded-lg transition-all flex items-center justify-center",
            hasSounds ? "text-text-quaternary hover:text-text-secondary hover:bg-glass-hover" : "text-text-quaternary/30")} disabled={!hasSounds}>
            <ListMusic size={15} />
          </button>
          <button className={cn("h-8 w-8 rounded-lg transition-all flex items-center justify-center",
            hasSounds ? "text-text-quaternary hover:text-text-secondary hover:bg-glass-hover" : "text-text-quaternary/30")} disabled={!hasSounds}>
            <MonitorSpeaker size={15} />
          </button>
          <div className="relative">
            <button onClick={() => setShowTimer(!showTimer)}
              className={cn("h-8 w-8 rounded-lg transition-all flex items-center justify-center gap-1",
                timerMinutes ? "text-accent-light bg-accent/10 w-auto px-2" : hasSounds ? "text-text-quaternary hover:text-text-secondary hover:bg-glass-hover" : "text-text-quaternary/30")}>
              <Timer size={15} />
              {timerMinutes && timerRemaining && timerRemaining > 0 && (
                <span className="text-[9px] font-medium">{formatTimerRemaining()}</span>
              )}
            </button>
            {showTimer && (
              <div className="absolute bottom-full right-0 mb-2 w-44 rounded-xl border border-border bg-bg-elevated p-3 shadow-2xl">
                <div className="flex flex-wrap gap-1.5">
                  {TIMER_OPTIONS.map((m) => (
                    <button key={m} onClick={() => { setTimer(timerMinutes === m ? null : m); setShowTimer(false) }}
                      className={cn("flex-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all",
                        timerMinutes === m ? "bg-accent/15 text-accent-light" : "bg-glass text-text-tertiary hover:bg-glass-hover"
                      )}>
                      {m >= 60 ? `${m / 60}h` : `${m}m`}
                    </button>
                  ))}
                  {timerMinutes && (
                    <button onClick={() => { cancelTimer(); setShowTimer(false) }}
                      className="w-full rounded-lg bg-red-500/10 py-1.5 text-[10px] font-medium text-accent-red mt-1">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className={cn("h-8 w-8 rounded-lg transition-all flex items-center justify-center",
            hasSounds ? "text-text-quaternary hover:text-text-secondary hover:bg-glass-hover" : "text-text-quaternary/30")} disabled={!hasSounds}>
            <Settings size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

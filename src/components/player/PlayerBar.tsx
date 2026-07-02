"use client"

import { useState } from "react"
import {
  Play, Pause, SkipBack, SkipForward, Heart,
  Volume2, Timer, X, Music, Shuffle, Repeat,
  ChevronUp
} from "lucide-react"
import { useAudioStore, useFavoritesStore } from "@/store"
import { Slider } from "@/components/ui/Slider"
import { Waveform } from "@/components/ui/Waveform"
import { cn } from "@/lib/utils"
import { getSoundById } from "@/data/sounds"

const TIMER_OPTIONS = [15, 30, 45, 60, 120]

export function PlayerBar() {
  const {
    isPlaying, isPlayingSounds, volume, setMasterVolume,
    stopAll, stopSound, timerMinutes, setTimer
  } = useAudioStore()
  const { isSoundFavorited, toggleSound: toggleFav } = useFavoritesStore()
  const [showTimer, setShowTimer] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const playingArray = Array.from(isPlayingSounds)
  if (playingArray.length === 0) return null

  const firstSound = getSoundById(playingArray[0])
  const singleMode = playingArray.length === 1
  const favorited = singleMode && isSoundFavorited(playingArray[0])
  const activeLayerCount = playingArray.length

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        "lg:left-[280px]",
        expanded ? "bottom-0" : ""
      )}>
        <div className={cn(
          "bg-[#0c0c14]/95 backdrop-blur-2xl border-t border-border-subtle transition-all duration-300",
          expanded ? "border-t-0" : ""
        )}>
          {/* Mini Player */}
          {!expanded && (
            <div className="flex items-center h-[72px] px-4 gap-4">
              {/* Left: Artwork + Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1 max-w-[300px]">
                <div className={cn("h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br overflow-hidden shadow-lg", firstSound?.gradient)}
                  style={firstSound?.coverUrl ? { backgroundImage: `url(${firstSound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {singleMode ? firstSound?.title ?? playingArray[0] : `${playingArray.length} Sounds`}
                    </p>
                    {favorited && (
                      <Heart size={10} className="flex-shrink-0 text-accent-red" fill="currentColor" />
                    )}
                  </div>
                  <p className="truncate text-[11px] text-text-tertiary">
                    {singleMode
                      ? firstSound?.category ?? ""
                      : `${activeLayerCount} active layers`}
                  </p>
                </div>
                {singleMode && (
                  <button
                    onClick={() => toggleFav(playingArray[0])}
                    className={cn(
                      "flex-shrink-0 rounded-lg p-1.5 transition-colors",
                      favorited ? "text-accent-red" : "text-text-quaternary hover:text-text-secondary"
                    )}
                  >
                    <Heart size={14} fill={favorited ? "currentColor" : "none"} />
                  </button>
                )}
              </div>

              {/* Center: Controls */}
              <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-[600px]">
                <div className="flex items-center gap-4">
                  <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                    <Shuffle size={14} />
                  </button>
                  <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={() => stopAll()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent-light transition-all hover:bg-accent/25 hover:scale-105 active:scale-95 play-button-glow"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                    <SkipForward size={16} />
                  </button>
                  <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                    <Repeat size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-[10px] text-text-quaternary w-8 text-right">{formatTime(0)}</span>
                  <div className="flex-1 h-1 rounded-full bg-border relative group cursor-pointer">
                    <div className="h-full w-0 rounded-full bg-text-primary transition-all duration-300 group-hover:bg-accent-light" />
                  </div>
                  <span className="text-[10px] text-text-quaternary w-8">
                    {firstSound ? formatTime(firstSound.duration) : formatTime(0)}
                  </span>
                </div>
              </div>

              {/* Right: Volume + Actions */}
              <div className="hidden md:flex items-center gap-2 flex-1 justify-end max-w-[300px]">
                <div className="flex items-center gap-1.5">
                  <Volume2 size={14} className="text-text-quaternary" />
                  <div className="w-24">
                    <Slider value={volume} onChange={setMasterVolume} size="sm" />
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-quaternary transition-colors hover:text-text-secondary hover:bg-glass-hover"
                >
                  <ChevronUp size={16} />
                </button>
              </div>

              {/* Mobile expand */}
              <button
                onClick={() => setExpanded(true)}
                className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg text-text-quaternary hover:text-text-secondary"
              >
                <ChevronUp size={18} />
              </button>
            </div>
          )}

          {/* Expanded Player */}
          {expanded && (
            <div className="p-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className={cn("h-32 w-32 flex-shrink-0 rounded-2xl bg-gradient-to-br overflow-hidden shadow-xl shadow-black/30", firstSound?.gradient)}
                  style={firstSound?.coverUrl ? { backgroundImage: `url(${firstSound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                />
                <div className="min-w-0 flex-1 pt-2">
                  <p className="text-2xl font-bold text-text-primary">
                    {singleMode ? firstSound?.title : "Multi-Sound Mix"}
                  </p>
                  <p className="mt-1 text-sm text-text-tertiary">
                    {singleMode ? firstSound?.description : `${playingArray.length} sounds layered together`}
                  </p>
                  {!singleMode && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {playingArray.map((id) => {
                        const sd = getSoundById(id)
                        return (
                          <button
                            key={id}
                            onClick={() => stopSound(id)}
                            className="flex items-center gap-1.5 rounded-xl bg-glass border border-border-subtle px-3 py-1.5 text-xs text-text-tertiary transition-colors hover:bg-red-500/10 hover:text-accent-red hover:border-red-500/20"
                          >
                            <Music size={10} />
                            {sd?.title ?? id}
                            <X size={8} />
                          </button>
                        )
                      })}
                    </div>
                  )}
                  <div className="mt-4">
                    <Waveform />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                  <Shuffle size={18} />
                </button>
                <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => stopAll()}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent-light transition-all hover:bg-accent/25 hover:scale-105 active:scale-95 play-button-glow"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                  <SkipForward size={20} />
                </button>
                <button className="text-text-quaternary hover:text-text-secondary transition-colors">
                  <Repeat size={18} />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-text-quaternary w-10 text-right">{formatTime(0)}</span>
                <div className="flex-1 h-1.5 rounded-full bg-border relative group cursor-pointer">
                  <div className="h-full w-0 rounded-full bg-text-primary transition-all duration-300 group-hover:bg-accent-light" />
                </div>
                <span className="text-xs text-text-quaternary w-10">
                  {firstSound ? formatTime(firstSound.duration) : formatTime(0)}
                </span>
              </div>

              {/* Volume + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-text-quaternary" />
                  <div className="w-32">
                    <Slider value={volume} onChange={setMasterVolume} size="sm" />
                  </div>
                  <span className="text-[10px] text-text-quaternary w-8">{Math.round(volume * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  {singleMode && (
                    <button
                      onClick={() => toggleFav(playingArray[0])}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-colors",
                        favorited ? "text-accent-red bg-red-500/10" : "text-text-tertiary hover:text-text-secondary bg-glass"
                      )}
                    >
                      <Heart size={12} fill={favorited ? "currentColor" : "none"} />
                      Favorite
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowTimer(!showTimer)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-colors",
                        timerMinutes ? "text-accent-light bg-accent/10" : "text-text-tertiary hover:text-text-secondary bg-glass"
                      )}
                    >
                      <Timer size={12} />
                      {timerMinutes ? `${timerMinutes}m` : "Timer"}
                    </button>
                    {showTimer && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl border border-border bg-[#0c0c14]/95 p-3 backdrop-blur-2xl">
                        <div className="flex flex-wrap gap-1.5">
                          {TIMER_OPTIONS.map((m) => (
                            <button
                              key={m}
                              onClick={() => { setTimer(timerMinutes === m ? null : m); setShowTimer(false) }}
                              className={cn(
                                "flex-1 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                                timerMinutes === m ? "bg-accent/15 text-accent-light" : "bg-glass text-text-tertiary hover:bg-glass-hover hover:text-text-secondary"
                              )}
                            >
                              {m >= 60 ? `${m / 60}h` : `${m}m`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary bg-glass transition-colors"
                  >
                    <ChevronUp size={12} className="rotate-180" />
                    Minimize
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating sound chips when mini */}
        {!expanded && playingArray.length > 1 && (
          <div className="mx-4 mb-1 flex gap-1.5 overflow-x-auto scrollbar-none">
            {playingArray.slice(0, 5).map((id) => {
              const sd = getSoundById(id)
              return (
                <button
                  key={id}
                  onClick={() => stopSound(id)}
                  className="flex items-center gap-1 rounded-full bg-glass border border-border-subtle px-2.5 py-0.5 text-[10px] text-text-tertiary transition-colors hover:bg-red-500/10 hover:text-accent-red hover:border-red-500/20"
                >
                  <Music size={8} />
                  {sd?.title ?? id}
                  <X size={7} />
                </button>
              )
            })}
            {playingArray.length > 5 && (
              <span className="text-[10px] text-text-quaternary self-center px-1">+{playingArray.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </>
  )
}

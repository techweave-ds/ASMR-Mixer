"use client"

import { useState } from "react"
import { Volume2, Sun, Moon, Maximize, Minimize, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"

interface FloatingControlsProps {
  env: string
  onEnvChange: (env: "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert") => void
}

export function FloatingControls({ env, onEnvChange }: FloatingControlsProps) {
  const [visible, setVisible] = useState(false)
  const { volume, setMasterVolume } = useAudioStore()
  const [ambientEnabled, setAmbientEnabled] = useState(false)
  const [isDay, setIsDay] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showEnvPicker, setShowEnvPicker] = useState(false)

  const environments: { id: "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert"; label: string; icon: string }[] = [
    { id: "rainforest", label: "Rain", icon: "🌧" },
    { id: "forest", label: "Forest", icon: "🌲" },
    { id: "ocean", label: "Ocean", icon: "🌊" },
    { id: "campfire", label: "Fire", icon: "🔥" },
    { id: "snow", label: "Snow", icon: "❄" },
    { id: "night", label: "Night", icon: "🌙" },
    { id: "desert", label: "Desert", icon: "☀" },
  ]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => { setVisible(false); setShowEnvPicker(false) }}
    >
      {/* Controls panel */}
      <div className={cn(
        "flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {/* Master volume */}
        <div className="flex items-center gap-2 px-2 py-1">
          <Volume2 size={12} className="text-white/50" />
          <input type="range" min={0} max={1} step={0.01} value={volume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-16 h-1 appearance-none bg-white/10 rounded-full cursor-pointer"
            style={{ accentColor: "var(--color-accent-primary)" }} />
        </div>

        {/* Ambient toggle */}
        <button onClick={() => setAmbientEnabled(!ambientEnabled)}
          className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-all",
            ambientEnabled ? "bg-accent/15 text-accent-light" : "text-white/50 hover:text-white/70 hover:bg-white/5")}>
          <Headphones size={12} />
          {ambientEnabled ? "Ambient On" : "Ambient Off"}
        </button>

        {/* Day/Night toggle */}
        <button onClick={() => setIsDay(!isDay)}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-white/50 hover:text-white/70 hover:bg-white/5 transition-all">
          {isDay ? <Sun size={12} /> : <Moon size={12} />}
          {isDay ? "Day" : "Night"}
        </button>

        {/* Environment selector */}
        <div className="relative">
          <button onClick={() => setShowEnvPicker(!showEnvPicker)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-white/50 hover:text-white/70 hover:bg-white/5 transition-all w-full">
            <span className="text-sm">{environments.find((e) => e.id === env)?.icon}</span>
            {environments.find((e) => e.id === env)?.label || "Env"}
          </button>
          {showEnvPicker && (
            <div className="absolute bottom-full right-0 mb-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl p-2 shadow-2xl">
              <div className="flex gap-1.5">
                {environments.map((e) => (
                  <button key={e.id} onClick={() => { onEnvChange(e.id); setShowEnvPicker(false) }}
                    className={cn("flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs transition-all",
                      env === e.id ? "bg-accent/15 text-accent-light" : "text-white/50 hover:text-white/70 hover:bg-white/5"
                    )}>
                    <span className="text-lg">{e.icon}</span>
                    <span className="text-[9px]">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button onClick={toggleFullscreen}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-white/50 hover:text-white/70 hover:bg-white/5 transition-all">
          {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>

      {/* Toggle pill */}
      <button className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white/70 hover:bg-black/50 transition-all">
        <Volume2 size={14} />
      </button>
    </div>
  )
}

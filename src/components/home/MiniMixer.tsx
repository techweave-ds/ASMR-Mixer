"use client"

import { useState, useEffect, useCallback } from "react"
import { SlidersHorizontal, Play, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAudioStore } from "@/store"
import { audioEngine } from "@/audio"

const MIXER_SOUNDS = [
  { id: "rain-light", label: "Rain", color: "#60A5FA" },
  { id: "campfire", label: "Fire", color: "#F59E0B" },
  { id: "wind-gentle", label: "Wind", color: "#93C5FD" },
]

export function MiniMixer() {
  const router = useRouter()
  const [volumes, setVolumes] = useState<Record<string, number>>({
    "rain-light": 0,
    campfire: 0,
    "wind-gentle": 0,
  })
  const [activeSliders, setActiveSliders] = useState<Record<string, boolean>>({
    "rain-light": false,
    campfire: false,
    "wind-gentle": false,
  })
  const { playSingle } = useAudioStore()

  useEffect(() => {
    return () => {
      MIXER_SOUNDS.forEach((s) => audioEngine.stopSound(s.id))
    }
  }, [])

  const handleVolumeChange = useCallback((id: string, val: number) => {
    setVolumes((prev) => ({ ...prev, [id]: val }))
    if (val > 0) {
      if (!activeSliders[id]) {
        playSingle(id)
        setActiveSliders((prev) => ({ ...prev, [id]: true }))
      }
      audioEngine.setSoundVolume(id, val * 0.3)
    } else {
      if (activeSliders[id]) {
        audioEngine.stopSound(id)
        setActiveSliders((prev) => ({ ...prev, [id]: false }))
      }
    }
  }, [activeSliders, playSingle])

  const anyActive = Object.values(volumes).some((v) => v > 0)

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-bg-primary pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
            <SlidersHorizontal size={12} className="text-accent-light" />
            <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider">Try Before You Sign Up</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mix Your Own Ambience</h2>
          <p className="text-sm text-white/30 max-w-lg mx-auto">
            Drag the sliders to blend Rain, Fire, and Wind together. Hear it live, right now, no login required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10"
        >
          <div className="space-y-6">
            {MIXER_SOUNDS.map((sound) => (
              <div key={sound.id} className="flex items-center gap-4 md:gap-6">
                <div className="w-12 text-right shrink-0">
                  <span className="text-xs font-medium text-white/50">{sound.label}</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volumes[sound.id]}
                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                    className="w-full h-2 appearance-none rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${sound.color}60 0%, ${sound.color}60 ${volumes[sound.id] * 100}%, rgba(255,255,255,0.06) ${volumes[sound.id] * 100}%, rgba(255,255,255,0.06) 100%)`,
                      accentColor: sound.color,
                    }}
                    aria-label={`${sound.label} volume`}
                  />
                </div>
                <div className="w-16 text-right shrink-0">
                  <span className="text-[11px] text-white/30 font-mono">
                    {Math.round(volumes[sound.id] * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Volume2 size={12} />
              <span>{anyActive ? "You're mixing live — this is 3 of 56 sounds" : "Slide any fader to start"}</span>
            </div>
            <button onClick={() => router.push("/mixer")}
              className="flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-5 py-2 text-xs font-medium text-accent-light hover:bg-accent/25 transition-all">
              <Play size={12} />
              Open the Full Mixer
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

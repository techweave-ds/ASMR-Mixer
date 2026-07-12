"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { audioEngine } from "@/audio"

const MOODS = [
  { id: "sleep", label: "Sleep.", soundId: "rain-light", gradient: "from-indigo-900/40 via-purple-900/20 to-bg-primary", color: "#A78BFA" },
  { id: "focus", label: "Focus.", soundId: "brown-noise", gradient: "from-slate-800/40 via-blue-900/20 to-bg-primary", color: "#60A5FA" },
  { id: "reset", label: "Reset.", soundId: "wind-gentle", gradient: "from-emerald-900/40 via-teal-900/20 to-bg-primary", color: "#34D399" },
  { id: "read", label: "Read.", soundId: "library-quiet", gradient: "from-amber-900/40 via-stone-900/20 to-bg-primary", color: "#F59E0B" },
  { id: "create", label: "Create.", soundId: "writing-pencil", gradient: "from-violet-900/40 via-purple-900/20 to-bg-primary", color: "#C084FC" },
  { id: "meditate", label: "Meditate.", soundId: "ocean-waves", gradient: "from-sky-900/40 via-indigo-900/20 to-bg-primary", color: "#7DD3FC" },
]

const MOOD_COPY: Record<string, string> = {
  sleep: "Rain against a window, forty minutes, nothing else.",
  focus: "Brown noise at a steady hum. The world recedes behind it.",
  reset: "A breeze you don't have to brace against. Just letting go.",
  read: "Pages turning. Distant rain. A lamp and an armchair.",
  create: "Pencil on paper. Coffee cooling. The first good idea in hours.",
  meditate: "Waves pulling in, pulling out. Breathing with the tide.",
}

export function MoodPicker() {
  const [activeMood, setActiveMood] = useState<string | null>(null)
  const prevSoundRef = useRef<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { playSingle } = useAudioStore()

  useEffect(() => {
    return () => {
      if (prevSoundRef.current) {
        audioEngine.stopSound(prevSoundRef.current)
      }
    }
  }, [])

  const handleMoodClick = (id: string) => {
    const mood = MOODS.find((m) => m.id === id)
    if (!mood) return

    if (activeMood === id) {
      if (prevSoundRef.current) audioEngine.stopSound(prevSoundRef.current)
      setActiveMood(null)
      prevSoundRef.current = null
      return
    }

    if (prevSoundRef.current) audioEngine.stopSound(prevSoundRef.current)
    playSingle(mood.soundId)
    audioEngine.setSoundVolume(mood.soundId, 0.2)
    setActiveMood(id)
    prevSoundRef.current = mood.soundId
  }

  const activeMoodData = activeMood ? MOODS.find((m) => m.id === activeMood) : null

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden transition-all duration-700"
      style={{
        background: activeMoodData
          ? `linear-gradient(135deg, ${activeMoodData.gradient.split(",")[0].trim()}, ${activeMoodData.gradient.split(",")[1].trim()}, ${activeMoodData.gradient.split(",")[2].trim()})`
          : undefined,
      }}>
      <div className="absolute inset-0 bg-bg-primary/60 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">Hear It First</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            What do you need<br />
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">right now</span>?
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-5 mb-6">
          {MOODS.map((mood, i) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => handleMoodClick(mood.id)}
              className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-light tracking-tight transition-all duration-500 px-2 py-1",
                activeMood === mood.id
                  ? "text-white scale-110"
                  : "text-white/20 hover:text-white/60"
              )}
              style={activeMood === mood.id ? { color: mood.color } : undefined}
            >
              {mood.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeMood || "default"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-sm md:text-base text-white/30 max-w-xl leading-relaxed"
          >
            {activeMood ? MOOD_COPY[activeMood] : "Choose a mood above to hear a matching soundscape — no signup required."}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}

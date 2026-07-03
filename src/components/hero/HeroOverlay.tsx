"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronDown, Compass, Search, Bell, User, Clock, Cloud } from "lucide-react"


import { cn } from "@/lib/utils"
import { FloatingControls } from "./FloatingControls"
import { ExploreButton } from "./ExploreButton"
import { EnvironmentSelector } from "./EnvironmentSelector"
import { useAudioStore } from "@/store"

const HeroScene = dynamic(() => import("@/components/hero/Hero3D").then((m) => ({ default: m.HeroScene })), { ssr: false })

const TAGLINES = [
  { text: "Escape the Noise.", accent: true },
  { text: "Every Moment Has a Sound.", accent: false },
  { text: "Find Your Quiet.", accent: false },
  { text: "Reconnect With Nature.", accent: false },
  { text: "Where Silence Becomes Music.", accent: false },
  { text: "Listen Beyond Music.", accent: false },
]

const DESCRIPTIONS = [
  "Close your eyes. Let the sounds of distant rain and crackling fire carry you somewhere quieter.",
  "Each environment is built from layers of natural textures — a living soundscape, not a recording.",
  "Not silence. Not noise. The space between — where your thoughts settle and your shoulders drop.",
  "The world outside fades. What remains is wind through pines and the slow pulse of a distant storm.",
  "Listen with your whole body. The frequencies resonate where words can't reach.",
  "This is not a playlist. This is a place. A room tone for your mind.",
]

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const curtain = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: curtain } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: curtain } },
}

export function HeroOverlay() {
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [descIdx, setDescIdx] = useState(0)
  const [activeEnv, setActiveEnv] = useState<"rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert">("rainforest")
  const [currentTime, setCurrentTime] = useState("")

  const { toggleSound, isSoundPlaying } = useAudioStore()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const tagInterval = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % TAGLINES.length)
      setDescIdx((prev) => (prev + 1) % DESCRIPTIONS.length)
    }, 5000)
    return () => clearInterval(tagInterval)
  }, [])

  const scrollToContent = () => {
    document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })
  }

  type EnvKey = "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert"

  const handleEnvChange = (id: EnvKey) => {
    setActiveEnv(id)
    const soundMap: Record<EnvKey, string> = {
      rainforest: "rain",
      forest: "forest",
      ocean: "ocean",
      campfire: "campfire",
      snow: "snow",
      night: "night",
      desert: "desert",
    }
    const soundId = soundMap[id]
    if (soundId && !isSoundPlaying(soundId)) {
      toggleSound(soundId)
    }
  }

  const handleOrbClick = (label: string) => {
    const soundMap: Record<string, string> = {
      Campfire: "campfire",
      Rain: "rain",
      Forest: "forest",
      Ocean: "ocean",
      Birds: "birds",
      Wind: "wind",
    }
    const soundId = soundMap[label]
    if (soundId) {
      toggleSound(soundId)
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene — full viewport */}
      <div className="absolute inset-0 z-0">
        <HeroScene env={activeEnv} onOrbClick={handleOrbClick} />
      </div>

      {/* Gradient Vignette */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-bg-base/90 via-transparent to-bg-base/30 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-bg-base/40 via-transparent to-bg-base/40 pointer-events-none" />

      {/* === ENTRANCE SEQUENCE (staggered entrance) — content always visible via CSS in case stagger fails === */}
      <motion.div
        variants={stagger}
        initial={false}
        animate="show"
        className="absolute inset-0 z-10"
      >
        {/* Nav */}
        <motion.nav variants={fadeIn} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="text-accent-light text-xs font-bold">N</span>
            </div>
            <span className="text-white/80 text-sm font-semibold tracking-tight">Noctune</span>
          </div>
          <div className="hidden md:flex items-center gap-3 max-w-md w-full mx-8">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder="Search soundscapes, moods, environments..."
                className="w-full rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm px-9 py-2 text-xs text-white/70 placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all">
              <Bell size={14} />
            </button>
            <button className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-lg">
              <User size={14} />
            </button>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.h1 key={taglineIdx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 leading-[1.1]",
                    TAGLINES[taglineIdx].accent
                      ? "bg-gradient-to-r from-blue-300 via-indigo-200 to-violet-300 bg-clip-text text-transparent"
                      : "text-white"
                  )}>
                  {TAGLINES[taglineIdx].text}
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.p key={descIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm md:text-base text-white/40 max-w-lg leading-relaxed mb-8">
                  {DESCRIPTIONS[descIdx]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
              <button className="group relative flex items-center gap-2.5 rounded-full bg-white/10 border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/15 active:scale-[0.97] overflow-hidden">
                <Sparkles size={14} className="text-accent-light" />
                Start Listening
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full glow-accent" />
              </button>
              <button onClick={scrollToContent}
                className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-white/50 transition-all hover:text-white/70 hover:border-white/20 active:scale-[0.97]">
                <Compass size={14} />
                Explore
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right Widgets */}
        <motion.div variants={fadeIn} className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/5 px-3 py-1.5">
            <Clock size={12} className="text-white/30" />
            <span className="text-[11px] text-white/40 font-mono">{currentTime}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/5 px-3 py-1.5">
            <Cloud size={12} className="text-white/30" />
            <span className="text-[11px] text-white/40">72° · Mostly Clear</span>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            {["Campfire", "Rain", "Forest", "Ocean", "Birds", "Wind"].map((label) => (
              <button key={label} onClick={() => handleOrbClick(label)}
                className="flex items-center gap-2 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1 transition-all group">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-accent-light transition-colors" />
                <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Environment Selector */}
        <motion.div variants={fadeUp} className="absolute bottom-20 left-0 right-0 px-8 md:px-16">
          <EnvironmentSelector active={activeEnv} onChange={handleEnvChange} />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button variants={fadeIn}
          onClick={scrollToContent}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 hover:text-white/50 transition-colors"
          animate={{ y: [0, 6, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2.5 } }}>
          <ChevronDown size={20} />
        </motion.button>
      </motion.div>

      <FloatingControls env={activeEnv} onEnvChange={handleEnvChange} />
      <ExploreButton />
    </section>
  )
}

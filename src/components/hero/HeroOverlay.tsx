"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronDown } from "lucide-react"

import { EnvironmentSelector } from "./EnvironmentSelector"
import { useAudioStore } from "@/store"
import { audioEngine } from "@/audio"

const HeroScene = dynamic(() => import("@/components/hero/Hero3D").then((m) => ({ default: m.HeroScene })), { ssr: false })

const ORB_COPY: Record<string, { headline: string; subhead: string }> = {
  rain: { headline: "Rain, somewhere far off.", subhead: "Steady drops on fresh leaves. Forty minutes of nothing else." },
  forest: { headline: "First light through the canopy.", subhead: "Birds waking up. A stream below. The world stretching." },
  fire: { headline: "Low fire, close and warm.", subhead: "Crackling embers. Wood settling. A quiet evening alone." },
  ocean: { headline: "Waves, slow and even.", subhead: "Salt air. Distant horizon. The tide pulling out." },
  night: { headline: "Late. Still. Quiet.", subhead: "Crickets and a half-moon. The kind of silence you can feel." },
  wind: { headline: "Moving through pines.", subhead: "A breeze with nothing to prove. Just passing through." },
}

const DEFAULT_HEADLINE = "Find Your Quiet."
const DEFAULT_SUBHEAD = "Discover immersive soundscapes designed for focus, sleep, relaxation, and mindfulness."

const HEADLINES = [
  { text: "Escape the Noise.", accent: true },
  { text: "Find Your Quiet.", accent: false },
  { text: "Listen Beyond Music.", accent: false },
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
  const [headlineIdx, setHeadlineIdx] = useState(0)
  const [activeOrb, setActiveOrb] = useState<string | null>(null)
  const [hoveredOrb, setHoveredOrb] = useState<string | null>(null)
  const [activeEnv, setActiveEnv] = useState<"rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert">("rainforest")
  const [timeWarmth, setTimeWarmth] = useState(0.5)
  const [scrolled, setScrolled] = useState(false)

  const prevSoundRef = useRef<string | null>(null)

  const { isSoundPlaying, playSingle } = useAudioStore()

  useEffect(() => {
    const h = new Date().getHours()
    setTimeWarmth(h >= 6 && h < 12 ? 0.2 : h >= 12 && h < 18 ? 0.1 : h >= 18 && h < 21 ? 0.6 : 0.8)
  }, [])

  useEffect(() => {
    const tagInterval = setInterval(() => {
      if (!activeOrb) setHeadlineIdx((prev) => (prev + 1) % HEADLINES.length)
    }, 6000)
    return () => clearInterval(tagInterval)
  }, [activeOrb])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToContent = useCallback(() => {
    document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  type EnvKey = "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert"

  const handleEnvChange = useCallback((id: EnvKey) => {
    setActiveEnv(id)
    const soundMap: Record<EnvKey, string> = {
      rainforest: "rain-light",
      forest: "forest-day",
      ocean: "ocean-waves",
      campfire: "campfire",
      snow: "snow-falling",
      night: "night-crickets",
      desert: "wind-gentle",
    }
    const soundId = soundMap[id]
    if (soundId && !isSoundPlaying(soundId)) {
      playSingle(soundId)
    }
  }, [isSoundPlaying, playSingle])

  const handleOrbClick = useCallback((orb: { id: string; label: string; color: string; soundId: string }) => {
    if (activeOrb === orb.id) {
      setActiveOrb(null)
      if (prevSoundRef.current) {
        audioEngine.stopSound(prevSoundRef.current)
        prevSoundRef.current = null
      }
      return
    }
    if (prevSoundRef.current) {
      audioEngine.stopSound(prevSoundRef.current)
    }
    setActiveOrb(orb.id)
    playSingle(orb.soundId)
    audioEngine.setSoundVolume(orb.soundId, 0.2)
    prevSoundRef.current = orb.soundId
  }, [activeOrb, playSingle])

  const orbCopy = activeOrb ? ORB_COPY[activeOrb] : null

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene
          env={activeEnv}
          activeOrb={activeOrb}
          hoveredOrb={hoveredOrb}
          onOrbClick={handleOrbClick}
          onOrbHover={setHoveredOrb}
          timeWarmth={timeWarmth}
        />
      </div>

      {/* Gradient Vignette */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-bg-base/90 via-transparent to-bg-base/30 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-bg-base/40 via-transparent to-bg-base/40 pointer-events-none" />

      {/* Content */}
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
          <div className="hidden md:flex items-center gap-6 mx-8">
            <a href="/explore" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">Explore</a>
            <a href="#pricing" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">Pricing</a>
            <a href="#about" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">About</a>
            <a href="#blog" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">Blog</a>
          </div>
        </motion.nav>

        {/* Headline + CTAs */}
        <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 pb-32">
          <div className="max-w-2xl">
            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.h1 key={orbCopy ? activeOrb : headlineIdx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 leading-[1.1] text-white">
                  {orbCopy ? orbCopy.headline : HEADLINES[headlineIdx].text}
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.p key={orbCopy ? `${activeOrb}-sub` : "default-sub"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm md:text-base text-white/40 max-w-lg leading-relaxed mb-8">
                  {orbCopy ? orbCopy.subhead : DEFAULT_SUBHEAD}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
              <button onClick={scrollToContent}
                className="group relative flex items-center gap-2.5 rounded-full bg-white/15 border border-white/25 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.97] overflow-hidden shadow-lg shadow-white/5">
                <Sparkles size={14} className="text-accent-light" />
                Start Listening
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full glow-accent" />
              </button>
              <a href="/explore"
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-white/40 transition-all hover:text-white/60 hover:border-white/15 active:scale-[0.97]">
                Explore Library
              </a>
            </motion.div>

            {/* Hint text */}
            <motion.div variants={fadeUp} className="mt-8">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                {activeOrb ? "Click again to stop the sound" : "Click the floating orbs to preview any sound"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Environment Selector */}
        <motion.div variants={fadeUp} className="absolute bottom-20 left-0 right-0 px-8 md:px-16">
          <EnvironmentSelector active={activeEnv} onChange={handleEnvChange} />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button variants={fadeIn}
          onClick={scrollToContent}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/50 transition-all"
          style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? "none" : "auto" }}
          animate={{ y: [0, 4, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}>
          <span className="text-[10px] font-medium uppercase tracking-widest">Explore Soundscapes</span>
          <ChevronDown size={14} />
        </motion.button>
      </motion.div>
    </section>
  )
}

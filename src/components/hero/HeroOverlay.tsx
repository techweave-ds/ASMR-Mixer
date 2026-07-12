"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronDown, Heart, Pause, Play, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

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

const DEFAULT_SUBHEAD = "Immerse yourself in handcrafted ambient soundscapes for deep focus, restful sleep, and everyday calm."

const HEADLINES = [
  { text: "Escape the Noise.", accent: true },
  { text: "Find Your Quiet.", accent: false },
  { text: "Listen Beyond Music.", accent: false },
]

const ORB_LABELS: Record<string, string> = {
  rain: "Rain Preview",
  forest: "Forest Preview",
  fire: "Fire Preview",
  ocean: "Ocean Preview",
  night: "Night Preview",
  wind: "Wind Preview",
}

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
  const [activeEnv, setActiveEnv] = useState<"rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert" | null>("rainforest")
  const [timeWarmth, setTimeWarmth] = useState(0.5)
  const [scrolled, setScrolled] = useState(false)

  const prevSoundRef = useRef<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null!)

  const { isSoundPlaying, playSingle, stopSound } = useAudioStore()

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

  useEffect(() => {
    return () => {
      if (prevSoundRef.current) {
        audioEngine.stopSound(prevSoundRef.current)
        useAudioStore.getState().stopSound(prevSoundRef.current)
      }
    }
  }, [])

  const scrollToContent = useCallback(() => {
    document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  type EnvKey = "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert"

  const envSoundMap: Record<EnvKey, string> = {
    rainforest: "rain-light",
    forest: "forest-day",
    ocean: "ocean-waves",
    campfire: "campfire",
    snow: "snow-falling",
    night: "night-crickets",
    desert: "wind-gentle",
  }

  const handleEnvChange = useCallback(async (id: EnvKey) => {
    const soundId = envSoundMap[id]
    if (!soundId) return

    if (isSoundPlaying(soundId)) {
      await stopSound(soundId)
      setActiveEnv(null)
      return
    }

    if (activeEnv) await stopSound(envSoundMap[activeEnv])
    await playSingle(soundId)
    audioEngine.setSoundVolume(soundId, 0.2)
    setActiveEnv(id)
  }, [isSoundPlaying, playSingle, stopSound, activeEnv])

  const handleOrbClick = useCallback(async (orb: { id: string; label: string; color: string; soundId: string }) => {
    if (activeOrb === orb.id) {
      setActiveOrb(null)
      if (prevSoundRef.current) {
        await stopSound(prevSoundRef.current)
        prevSoundRef.current = null
      }
      return
    }
    if (prevSoundRef.current) {
      await stopSound(prevSoundRef.current)
    }
    setActiveOrb(orb.id)
    await playSingle(orb.soundId)
    audioEngine.setSoundVolume(orb.soundId, 0.2)
    prevSoundRef.current = orb.soundId
  }, [activeOrb, playSingle, stopSound])

  const orbCopy = activeOrb ? ORB_COPY[activeOrb] : null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene
          env={activeEnv ?? undefined}
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
            <img src="/logo.png" alt="Noctune" className="h-8 md:h-10 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-6 mx-8">
            <a href="/explore" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">Explore</a>
            <a href="#pricing" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">Pricing</a>
            <a href="#about" className="text-[11px] text-white/50 hover:text-white/80 transition-colors">About</a>
          </div>
        </motion.nav>

        {/* Left: Headline + CTAs */}
        <div className="flex flex-col justify-center h-full px-6 md:px-16 lg:px-24 pb-20 lg:pb-16">
          <div className="max-w-xl">
            <motion.div variants={fadeUp} className="mb-2">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">{greeting}</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.h1 key={orbCopy ? activeOrb : headlineIdx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-3 md:mb-4 leading-[1.1] text-white">
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
                  className="text-xs sm:text-sm md:text-base text-white/40 max-w-lg leading-relaxed mb-6 md:mb-8">
                  {orbCopy ? orbCopy.subhead : DEFAULT_SUBHEAD}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <a href="/explore"
                className="group relative flex items-center justify-center gap-2 rounded-full bg-white/15 border border-white/25 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.97] overflow-hidden shadow-lg shadow-white/5">
                <Sparkles size={12} className="text-accent-light" />
                Start Listening
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full glow-accent" />
              </a>
              <a href="/explore"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium text-white/40 transition-all hover:text-white/60 hover:border-white/15 active:scale-[0.97]">
                Explore Library
              </a>
            </motion.div>
          </div>
        </div>

        {/* Right: Now Playing + Environment Selector (desktop only) */}
        <motion.div variants={fadeIn} className="hidden lg:flex absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex-col items-end gap-4">
          {/* Now Playing Card */}
          {activeOrb ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-56 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-4 shadow-2xl"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Now Playing</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Headphones size={14} className="text-accent-light" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">{orbCopy?.headline || ORB_COPY[activeOrb]?.headline}</p>
                  <p className="text-[10px] text-white/30">0:32 / 30:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { if (prevSoundRef.current) { stopSound(prevSoundRef.current); setActiveOrb(null); prevSoundRef.current = null } }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 hover:bg-accent/30 transition-colors">
                  <Pause size={10} className="text-accent-light" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/30 hover:text-white/50 transition-colors">
                  <Heart size={10} />
                </button>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[12%] rounded-full bg-accent/60" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-56 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4"
            >
              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">No Sound Playing</p>
              <p className="text-[11px] text-white/30 leading-relaxed">Click any orb to preview a soundscape</p>
            </motion.div>
          )}

          {/* Environment Selector - vertical list */}
          <div className="w-56">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 text-right">Popular Soundscapes</p>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "rainforest" as const, label: "Rainforest", icon: "🌧" },
                { id: "forest" as const, label: "Forest", icon: "🌲" },
                { id: "ocean" as const, label: "Ocean", icon: "🌊" },
                { id: "campfire" as const, label: "Campfire", icon: "🔥" },
                { id: "snow" as const, label: "Snowfall", icon: "❄" },
                { id: "night" as const, label: "Night Sky", icon: "🌙" },
                { id: "desert" as const, label: "Desert", icon: "☀" },
              ].map((env) => {
                const soundId = envSoundMap[env.id]
                const playing = soundId ? isSoundPlaying(soundId) : false
                return (
                  <button key={env.id} onClick={() => handleEnvChange(env.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all duration-300 text-right justify-end",
                      playing
                        ? "border-accent/40 bg-accent/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.06]"
                    )}>
                    <span>{env.label}</span>
                    {playing ? (
                      <Pause size={10} className="text-accent-light" />
                    ) : (
                      <span className="text-sm">{env.icon}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Mobile: horizontal env strip */}
        <motion.div variants={fadeIn} className="lg:hidden absolute bottom-20 left-0 right-0 px-6 z-10">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {[
              { id: "rainforest" as const, label: "Rainforest", icon: "🌧" },
              { id: "forest" as const, label: "Forest", icon: "🌲" },
              { id: "ocean" as const, label: "Ocean", icon: "🌊" },
              { id: "campfire" as const, label: "Campfire", icon: "🔥" },
              { id: "snow" as const, label: "Snowfall", icon: "❄" },
              { id: "night" as const, label: "Night Sky", icon: "🌙" },
              { id: "desert" as const, label: "Desert", icon: "☀" },
            ].map((env) => {
              const soundId = envSoundMap[env.id]
              const playing = soundId ? isSoundPlaying(soundId) : false
              return (
                <button key={env.id} onClick={() => handleEnvChange(env.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0",
                    playing
                      ? "border-accent/40 bg-accent/10 text-white"
                      : "border-white/10 bg-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/20"
                  )}>
                  <span className="text-sm">{playing ? <Pause size={10} className="text-accent-light" /> : env.icon}</span>
                  <span>{env.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button variants={fadeIn}
          onClick={scrollToContent}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-all group hidden lg:flex"
          style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? "none" : "auto" }}>
          <span className="text-[10px] font-medium uppercase tracking-widest group-hover:tracking-[0.15em] transition-all">Explore Soundscapes</span>
          <ChevronDown size={18} className="animate-bounce" />
        </motion.button>
      </motion.div>

      {/* Bottom gradient transition to content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-transparent to-bg-base" />
    </section>
  )
}

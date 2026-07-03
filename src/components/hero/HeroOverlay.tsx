"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Sparkles, ChevronDown, Droplets, Wind, Flame, TreePine } from "lucide-react"
import { cn } from "@/lib/utils"

const HeroScene = dynamic(() => import("@/components/hero/Hero3D").then((m) => ({ default: m.HeroScene })), { ssr: false })

const taglines = [
  { text: "Escape the Noise.", highlight: true },
  { text: "Find Your Quiet.", highlight: false },
  { text: "Build Your Perfect Ambience.", highlight: false },
  { text: "Where Silence Meets Nature.", highlight: false },
  { text: "Create Your Sanctuary.", highlight: false },
]

const environments = [
  { id: "rainy", label: "Rainy Cabin", icon: Droplets, color: "#60A5FA", gradient: "from-blue-500/10 to-indigo-600/10" },
  { id: "forest", label: "Forest Dawn", icon: TreePine, color: "#34D399", gradient: "from-emerald-500/10 to-green-600/10" },
  { id: "ocean", label: "Ocean Cliff", icon: Droplets, color: "#93C5FD", gradient: "from-sky-500/10 to-blue-600/10" },
  { id: "fire", label: "Campfire", icon: Flame, color: "#F59E0B", gradient: "from-amber-500/10 to-orange-600/10" },
  { id: "wind", label: "Mountain Wind", icon: Wind, color: "#A78BFA", gradient: "from-violet-500/10 to-purple-600/10" },
]

export function HeroOverlay() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [activeEnv, setActiveEnv] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const scrollToContent = () => {
    document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Gradient Vignette */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-bg-base/80 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-bg-base/30 via-transparent to-bg-base/20 pointer-events-none" />

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.h1
              key={taglineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6",
                taglines[taglineIndex].highlight ? "bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent" : "text-text-primary"
              )}
            >
              {taglines[taglineIndex].text}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-text-tertiary max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Silent Circuit isn&apos;t another playlist app. It&apos;s your personal sound sanctuary — built to help you
            sleep, focus, meditate, and reconnect with yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <button className="group relative flex items-center gap-2.5 rounded-2xl bg-accent/15 px-8 py-3.5 text-sm font-semibold text-accent-light transition-all hover:bg-accent/25 active:scale-[0.97] overflow-hidden">
              <span className="relative z-10">Start Listening</span>
              <Sparkles size={15} className="relative z-10" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ boxShadow: '0 0 30px rgba(96,165,250,0.15), 0 0 60px rgba(96,165,250,0.05)' }} />
            </button>
            <button className="flex items-center gap-2.5 rounded-2xl border border-border-subtle px-8 py-3.5 text-sm font-medium text-text-tertiary transition-all hover:border-border hover:text-text-secondary active:scale-[0.97]">
              <Play size={14} />
              Explore Soundscapes
            </button>
          </motion.div>

          {/* Environment Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            {environments.map((env, i) => (
              <button key={env.id} onClick={() => setActiveEnv(i)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-all border",
                  activeEnv === i
                    ? "bg-white/10 border-white/20 text-text-primary"
                    : "border-transparent text-text-quaternary hover:text-text-tertiary"
                )}>
                <env.icon size={11} style={{ color: env.color }} />
                <span className="hidden sm:inline">{env.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ opacity: { delay: 1.5 }, y: { repeat: Infinity, duration: 2 } }}
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-quaternary hover:text-text-secondary transition-colors"
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>
    </section>
  )
}

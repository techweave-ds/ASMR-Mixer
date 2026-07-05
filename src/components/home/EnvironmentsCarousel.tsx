"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { audioEngine } from "@/audio"

const ENVIRONMENTS = [
  { id: "cabin", title: "Mountain Cabin", desc: "Warm fireplace, rain on window, soft wind. The kind of evening you wish would never end.", gradient: "from-stone-700/60 to-indigo-900/60", cover: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80", soundId: "campfire" },
  { id: "storm", title: "Ocean Storm", desc: "Waves crashing, thunder rumbling, heavy rain against the glass. Nature at its most powerful.", gradient: "from-slate-800/60 to-blue-900/60", cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80", soundId: "ocean-storm" },
  { id: "garden", title: "Japanese Garden", desc: "Water stream, birds, bamboo wind chimes. Every element in its right place.", gradient: "from-emerald-800/60 to-teal-900/60", cover: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80", soundId: "river-gentle" },
  { id: "forest", title: "Forest Trail", desc: "Leaves crunching, birds, distant waterfall. A path you could walk forever.", gradient: "from-green-800/60 to-emerald-900/60", cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80", soundId: "forest-day" },
  { id: "night", title: "Night Sky", desc: "Crickets, owl hoots, gentle wind under a canopy of stars.", gradient: "from-indigo-900/60 to-slate-900/60", cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80", soundId: "night-crickets" },
  { id: "coffee", title: "Coffee Shop", desc: "Muffled chatter, espresso machine, soft jazz. Your favorite table by the window.", gradient: "from-amber-800/60 to-stone-900/60", cover: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80", soundId: "cafe-bustling" },
  { id: "rain", title: "Rainy Rooftop", desc: "Rain tapping on a tin roof. A blanket. A book. Nothing else.", gradient: "from-sky-700/60 to-slate-800/60", cover: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1200&q=80", soundId: "rain-light" },
]

export function EnvironmentsCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [previewing, setPreviewing] = useState<string | null>(null)
  const prevSoundRef = useRef<string | null>(null)
  const { playSingle } = useAudioStore()

  useEffect(() => {
    return () => {
      if (prevSoundRef.current) audioEngine.stopSound(prevSoundRef.current)
    }
  }, [])

  const goNext = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % ENVIRONMENTS.length)
    setPreviewing(null)
  }, [])

  const goPrev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + ENVIRONMENTS.length) % ENVIRONMENTS.length)
    setPreviewing(null)
  }, [])

  const togglePreview = useCallback((soundId: string) => {
    if (previewing === soundId) {
      audioEngine.stopSound(soundId)
      setPreviewing(null)
      prevSoundRef.current = null
    } else {
      if (prevSoundRef.current) audioEngine.stopSound(prevSoundRef.current)
      playSingle(soundId)
      audioEngine.setSoundVolume(soundId, 0.2)
      setPreviewing(soundId)
      prevSoundRef.current = soundId
    }
  }, [previewing, playSingle])

  const env = ENVIRONMENTS[currentIdx]

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={env.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${env.cover})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
          <div className={cn("absolute inset-0", env.gradient)} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <motion.p
            key={`${env.id}-label`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[10px] uppercase tracking-widest text-white/30 mb-3"
          >
            A Place, Not a Playlist
          </motion.p>
          <motion.h3
            key={`${env.id}-title`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
          >
            {env.title}
          </motion.h3>
          <motion.p
            key={`${env.id}-desc`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm md:text-base text-white/50 max-w-lg mb-6"
          >
            {env.desc}
          </motion.p>
          <motion.button
            key={`${env.id}-btn`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            onClick={() => togglePreview(env.soundId)}
            className="flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-all active:scale-[0.97]"
          >
            {previewing === env.soundId ? <Pause size={14} /> : <Play size={14} />}
            {previewing === env.soundId ? "Stop Preview" : "Preview"}
          </motion.button>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20">
        <button onClick={goPrev}
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all">
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20">
        <button onClick={goNext}
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {ENVIRONMENTS.map((_, i) => (
          <button key={i} onClick={() => { setCurrentIdx(i); setPreviewing(null) }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-6 bg-white/60" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
        ))}
      </div>
    </section>
  )
}

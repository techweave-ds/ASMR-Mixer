"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Play, Music, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { sounds } from "@/data/sounds"

const environments = [
  { title: "Mountain Cabin", description: "Warm fireplace, rain on window, soft wind", gradient: "from-stone-700/40 to-indigo-900/40", cover: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=600&q=80", duration: 60, sounds: 6 },
  { title: "Ocean Storm", description: "Waves crashing, thunder rumbling, heavy rain", gradient: "from-slate-800/40 to-blue-900/40", cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80", duration: 90, sounds: 5 },
  { title: "Japanese Garden", description: "Water stream, birds, bamboo wind chimes", gradient: "from-emerald-800/40 to-teal-900/40", cover: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80", duration: 45, sounds: 4 },
  { title: "Forest Trail", description: "Leaves crunching, birds, distant waterfall", gradient: "from-green-800/40 to-emerald-900/40", cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80", duration: 75, sounds: 7 },
  { title: "Night Sky", description: "Crickets, owl hoots, gentle wind", gradient: "from-indigo-900/40 to-slate-900/40", cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80", duration: 60, sounds: 4 },
  { title: "Coffee Shop", description: "Muffled chatter, espresso machine, jazz", gradient: "from-amber-800/40 to-stone-900/40", cover: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80", duration: 120, sounds: 3 },
]

export function EnvironmentsCarousel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const scrollRef = useRef<HTMLDivElement>(null)
  const toggleSound = useAudioStore((s) => s.toggleSound)

  return (
    <section ref={ref} className="py-24 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Popular Environments</h2>
            <p className="text-text-tertiary mt-2">Explore curated soundscapes from around the world</p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none px-6 lg:px-8 -mx-6 lg:-mx-8">
        {environments.map((env, i) => (
          <motion.div
            key={env.title}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative flex-shrink-0 w-[280px] sm:w-[300px] rounded-3xl overflow-hidden cursor-pointer card-hover"
          >
            <div className={cn("aspect-[4/3] bg-gradient-to-br relative overflow-hidden", env.gradient)}
              style={env.cover ? { backgroundImage: `url(${env.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-base font-semibold text-white mb-1">{env.title}</h3>
                <p className="text-xs text-white/60 line-clamp-1 mb-3">{env.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/40">
                  <span className="flex items-center gap-1"><Music size={10} />{env.sounds} sounds</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{env.duration} min</span>
                </div>
              </div>
              <button onClick={() => {
                const match = sounds.find((s) => env.title.toLowerCase().includes(s.category))
                if (match) toggleSound(match.id)
              }}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 active:scale-95">
                <Play size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

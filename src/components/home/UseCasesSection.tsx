"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Moon, Target, Leaf, Heart, Book, Palette, Trees, Sparkles, Monitor, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { sounds } from "@/data/sounds"

const useCases = [
  { label: "Better Sleep", icon: "Moon", desc: "Fall asleep naturally with layered ambient soundscapes.", gradient: "from-indigo-600/20 to-purple-900/20" },
  { label: "Deep Focus", icon: "Target", desc: "Enhance concentration with distraction-free environments.", gradient: "from-blue-600/20 to-teal-800/20" },
  { label: "Stress Relief", icon: "Leaf", desc: "Reset and relax with peaceful natural environments.", gradient: "from-emerald-600/20 to-green-900/20" },
  { label: "Meditation", icon: "Heart", desc: "Build your personal meditation sanctuary.", gradient: "from-rose-600/20 to-pink-900/20" },
  { label: "Read Better", icon: "Book", desc: "Immerse yourself with quiet library and rain ambience.", gradient: "from-amber-600/20 to-orange-900/20" },
  { label: "Creative Flow", icon: "Palette", desc: "Find inspiration for your next creative project.", gradient: "from-violet-600/20 to-purple-900/20" },
  { label: "Nature Escape", icon: "Trees", desc: "Reconnect with forests, oceans, and mountains.", gradient: "from-lime-600/20 to-emerald-900/20" },
  { label: "Anxiety Relief", icon: "Sparkles", desc: "Slow your breathing with calming environments.", gradient: "from-sky-600/20 to-blue-900/20" },
  { label: "Productivity", icon: "Monitor", desc: "Build focus for meetings, coding, and writing.", gradient: "from-teal-600/20 to-cyan-900/20" },
]

export function UseCasesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const toggleSound = useAudioStore((s) => s.toggleSound)

  return (
    <section ref={ref} className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          How do you want to <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">feel</span> today?
        </h2>
        <p className="text-text-tertiary max-w-lg mx-auto">Choose your mood and let Noctune create the perfect soundscape for you.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {useCases.map((uc, i) => {
          const iconMap: Record<string, LucideIcon> = { Moon, Target, Leaf, Heart, Book, Palette, Trees, Sparkles, Monitor }
          const Icon = iconMap[uc.icon] || Sparkles
          return (
          <motion.button
            key={uc.label}
            onClick={() => {
              const match = sounds.find((s) => s.tags.some((t) => uc.label.toLowerCase().includes(t)) || s.category === uc.label.toLowerCase())
              if (match) toggleSound(match.id)
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className={cn("group relative rounded-3xl border border-border-subtle p-5 text-left transition-transform duration-200 hover:border-border/50 hover:scale-[1.02] active:scale-[0.98] overflow-hidden", uc.gradient)}
          >
            <div className="mb-3 text-accent-light"><Icon size={20} /></div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">{uc.label}</h3>
            <p className="text-[11px] text-text-tertiary leading-relaxed">{uc.desc}</p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
          )
        })}
      </div>
    </section>
  )
}

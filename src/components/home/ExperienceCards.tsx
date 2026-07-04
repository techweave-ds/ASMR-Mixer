"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Moon, Target, Flower2, BookOpen, Brush, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"

const experiences = [
  { icon: Moon, label: "Better Sleep", desc: "Fall asleep naturally with layered ambient soundscapes that quiet the mind and reduce nighttime distractions.", gradient: "from-indigo-500/10 to-purple-600/10", iconColor: "#A78BFA" },
  { icon: Target, label: "Deep Focus", desc: "Boost concentration while studying, coding, or writing with distraction-free environments for deep work.", gradient: "from-blue-500/10 to-teal-600/10", iconColor: "#60A5FA" },
  { icon: Flower2, label: "Stress Relief", desc: "Reset with peaceful natural environments that encourage calm and relaxation after a busy day.", gradient: "from-emerald-500/10 to-green-600/10", iconColor: "#34D399" },
  { icon: Heart, label: "Meditation", desc: "Create your meditation sanctuary using layered sounds — flowing rivers, birds, wind, rain, and temple ambience.", gradient: "from-rose-500/10 to-pink-600/10", iconColor: "#F87171" },
  { icon: BookOpen, label: "Read Better", desc: "Turn every reading session into an immersive experience with quiet libraries, fireplaces, and gentle rain.", gradient: "from-amber-500/10 to-orange-600/10", iconColor: "#F59E0B" },
  { icon: Brush, label: "Creative Flow", desc: "Find inspiration for drawing, designing, composing music, or brainstorming your next big idea.", gradient: "from-violet-500/10 to-purple-600/10", iconColor: "#C084FC" },
]

export function ExperienceCards() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const toggleSound = useAudioStore((s) => s.toggleSound)

  return (
    <section ref={ref} id="content-start" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
          <Sparkles size={12} className="text-accent-light" />
          <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider">Why Noctune</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Experience the Difference</h2>
        <p className="text-text-tertiary max-w-lg mx-auto">Every aspect of Noctune is designed to help you disconnect from noise and reconnect with yourself.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.label}
            onClick={() => {
              const soundMap: Record<string, string> = {
                "Better Sleep": "rain-light",
                "Deep Focus": "brown-noise",
                "Stress Relief": "wind-gentle",
                "Meditation": "ocean-waves",
                "Read Better": "library-quiet",
                "Creative Flow": "writing-pencil",
              }
              const sid = soundMap[exp.label]
              if (sid) toggleSound(sid)
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={cn("group relative rounded-3xl border border-border-subtle p-6 transition-transform duration-200 hover:border-border cursor-pointer", exp.gradient)}
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-colors", exp.gradient)}>
              <exp.icon size={18} style={{ color: exp.iconColor }} />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-2">{exp.label}</h3>
            <p className="text-sm text-text-tertiary leading-relaxed">{exp.desc}</p>
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${exp.iconColor}20` }} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

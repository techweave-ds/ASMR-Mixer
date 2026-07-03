"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { sounds } from "@/data/sounds"
import { collections } from "@/data/collections"

const externalStats = {
  countriesListening: 120,
  minutesPlayedMillions: 5,
}

const statDefinitions = [
  { label: "Curated Sounds", getValue: () => sounds.length, suffix: "+" },
  { label: "Collections", getValue: () => collections.length, suffix: "+" },
  { label: "Countries Listening", getValue: () => externalStats.countriesListening, suffix: "+" },
  { label: "Minutes Played", getValue: () => externalStats.minutesPlayedMillions, suffix: "M+" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const duration = 1500
    const steps = 60
    const increment = Math.max(1, Math.floor(target / steps))
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(current)
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statDefinitions.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-200 to-indigo-300 bg-clip-text text-transparent mb-2">
                <Counter target={stat.getValue()} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-text-tertiary uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

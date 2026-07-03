"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { label: "Curated Sounds", value: 15000, suffix: "+" },
  { label: "Collections", value: 400, suffix: "+" },
  { label: "Countries Listening", value: 120, suffix: "+" },
  { label: "Minutes Played", value: 5, suffix: "M+" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.floor(target / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(start)
      }
    }, duration / (target / step))
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
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-200 to-indigo-300 bg-clip-text text-transparent mb-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-text-tertiary uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

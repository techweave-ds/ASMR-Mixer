"use client"

import { motion } from "framer-motion"
import { sounds } from "@/data/sounds"
import { collections } from "@/data/collections"

export function StatsSection() {
  const soundCount = sounds.length
  const collectionCount = collections.length

  return (
    <section className="py-16 md:py-24 px-8 md:px-16 lg:px-24 max-w-4xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-2xl text-white/40 leading-relaxed text-center"
      >
        <span className="text-white/60 font-semibold">{soundCount}</span> sounds.{" "}
        <span className="text-white/60 font-semibold">{collectionCount}</span> collections.{" "}
        Built for one purpose: helping you find the quiet you didn&apos;t know you needed.
      </motion.p>
    </section>
  )
}

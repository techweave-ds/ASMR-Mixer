"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Sparkles, Moon, Sun, Cloud, Wind, Mountain, Trees } from "lucide-react"
import { ExperienceCards } from "@/components/home/ExperienceCards"
import { UseCasesSection } from "@/components/home/UseCasesSection"
import { StatsSection } from "@/components/home/StatsSection"
import { EnvironmentsCarousel } from "@/components/home/EnvironmentsCarousel"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/hooks/useScrollContainer"

const HeroOverlay = dynamic(() => import("@/components/hero/HeroOverlay").then((m) => ({ default: m.HeroOverlay })), { ssr: false })

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white", className)}>
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm md:text-base text-white/30 max-w-lg leading-relaxed mt-2">{children}</p>
}

export function HomeContent() {
  const contentRef = useRef<HTMLDivElement>(null!)

  const scrollProgress = useScrollProgress()
  const heroFadedOut = scrollProgress > 0.3
  const heroScale = 1 - scrollProgress * 0.06
  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.5)

  return (
    <div className="relative">
      {/* === HERO (fixed, covers viewport) — unmounts + opaque content blocks bleed-through === */}
      <div
        className="fixed inset-0 overflow-hidden z-0"
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
          transition: "transform 0.1s ease-out, opacity 0.15s ease-out",
          pointerEvents: heroFadedOut ? "none" : "auto",
        } as React.CSSProperties}
      >
        <HeroOverlay />
      </div>

      {/* === CONTENT SECTIONS (scrolls in from below) — opaque background prevents hero bleed-through === */}
      <div ref={contentRef} className="relative z-10 mt-[100vh] bg-bg-primary">
        {/* Transition spacer */}
        <div className="h-10 md:h-16" />

        {/* Section 1: Why Noctune Exists */}
        <section id="content-start" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>Why Noctune Exists</SectionTitle>
              <SectionSubtitle>
                The world is louder than ever. We built a space where sound becomes shelter — not stimulation.
              </SectionSubtitle>
            </div>
            <ExperienceCards />
          </motion.div>
        </section>

        {/* Section 2: How Do You Want to Feel? */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>How Do You Want to Feel?</SectionTitle>
              <SectionSubtitle>
                Not what task do you need to accomplish. How do you want to feel right now?
              </SectionSubtitle>
            </div>
            <UseCasesSection />
          </motion.div>
        </section>

        {/* Section 3: Stats / Impact */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>Quiet Is Contagious</SectionTitle>
              <SectionSubtitle>
                A growing community finding stillness together. Millions of minutes of calm created.
              </SectionSubtitle>
            </div>
            <StatsSection />
          </motion.div>
        </section>

        {/* Section 4: Explore Environments */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>Explore Environments</SectionTitle>
              <SectionSubtitle>
                Each soundscape is a place you can return to. A room tone for every moment of your day.
              </SectionSubtitle>
            </div>
            <EnvironmentsCarousel />
          </motion.div>
        </section>

        {/* Section 5: Curated Collections */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <SectionTitle>Start Your Journey</SectionTitle>
                <SectionSubtitle>
                  Explore curated collections built by our community. From deep focus to dreamlike sleep.
                </SectionSubtitle>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/15 shrink-0"
              >
                <Sparkles size={14} className="text-accent-light" />
                Browse All Collections
              </motion.button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Deep Focus", subtitle: "Flow state, uninterrupted", icon: Mountain, count: "12 sounds" },
                { title: "Dreamscape", subtitle: "For drifting off", icon: Moon, count: "8 sounds" },
                { title: "Morning Light", subtitle: "Wake up gently", icon: Sun, count: "10 sounds" },
                { title: "Rainy Day", subtitle: "Cozy and warm", icon: Cloud, count: "14 sounds" },
                { title: "Forest Bathing", subtitle: "Shinrin-yoku at home", icon: Trees, count: "9 sounds" },
                { title: "Night Journey", subtitle: "Late-night calm", icon: Wind, count: "11 sounds" },
              ].map((col) => {
                const Icon = col.icon
                return (
                  <button key={col.title}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.04] hover:border-white/[0.12]"
                  >
                    <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">{col.title}</div>
                      <div className="text-xs text-white/30 mt-0.5">{col.subtitle} · {col.count}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Footer area */}
        <footer className="border-t border-white/[0.04] px-6 md:px-16 lg:px-24 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
                <span className="text-accent-light text-[10px] font-bold">N</span>
              </div>
              <span className="text-white/30 text-xs">Noctune · Find your quiet.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/20">
              <span>Accessibility</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

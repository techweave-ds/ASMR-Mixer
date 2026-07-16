"use client"

import { useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Sparkles, Star, Quote } from "lucide-react"
import { StatsSection } from "@/components/home/StatsSection"
import { EnvironmentsCarousel } from "@/components/home/EnvironmentsCarousel"
import { MoodPicker } from "@/components/home/MoodPicker"
import { MiniMixer } from "@/components/home/MiniMixer"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds } from "@/data/sounds"
import { cn } from "@/lib/utils"
import { useToastStore } from "@/store/toast-store"
import { useScrollProgress, useScrollContainer } from "@/hooks/useScrollContainer"

const HeroOverlay = dynamic(() => import("@/components/hero/HeroOverlay").then((m) => ({ default: m.HeroOverlay })), { ssr: false })

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white", className)}>
      {children}
    </h2>
  )
}

function SectionSubtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm md:text-base text-white/30 max-w-lg leading-relaxed mt-2", className)}>{children}</p>
}

export function HomeContent() {
  const contentRef = useRef<HTMLDivElement>(null!)
  const [mounted] = useState(true)
  const [visitType] = useState(() => {
    if (typeof window === "undefined") return "first"
    const now = Date.now()
    const stored = localStorage.getItem("noctune-last-visit")
    if (!stored) {
      localStorage.setItem("noctune-last-visit", String(now))
      return "first"
    }
    const last = Number(stored)
    const hoursAgo = (now - last) / 36e5
    localStorage.setItem("noctune-last-visit", String(now))
    return hoursAgo < 24 ? "recent" : "stale"
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  const scrollProgress = useScrollProgress()
  const scrollContainer = useScrollContainer()
  const heroFadedOut = scrollProgress > 0.3

  const handleHeroWheel = useCallback((e: React.WheelEvent) => {
    if (scrollContainer && !heroFadedOut) {
      scrollContainer.scrollBy({ top: e.deltaY, behavior: "instant" })
      e.preventDefault()
    }
  }, [scrollContainer, heroFadedOut])
  const heroScale = 1 - scrollProgress * 0.06
  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.5)

  const featuredSounds = sounds.filter((s) => !s.isPremium).slice(0, 8)

  return (
    <div className="relative">
      {/* Hero */}
      <div
        onWheel={handleHeroWheel}
        className="fixed inset-0 overflow-hidden z-0"
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
          transition: "transform 0.1s ease-out, opacity 0.15s ease-out",
          pointerEvents: heroFadedOut ? "none" : "auto",
          touchAction: "pan-y",
        } as React.CSSProperties}
      >
        <HeroOverlay />
      </div>

      {/* Content sections — each uses a different entrance animation */}
      <div ref={contentRef} className="relative z-10 mt-[100vh] bg-bg-primary">
        <div className="h-10 md:h-16" />

        {/* Section 1: Personalization + Featured Soundscapes */}
        <section id="content-start" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Returning user greeting */}
            {mounted && (
              <div className="mb-10 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{greeting}</p>
                <p className="text-lg text-white/80 font-medium">
                  {visitType === "first"
                    ? "Welcome to Noctune. Find your quiet."
                    : visitType === "stale"
                      ? "Good to see you again. Pick up where you left off?"
                      : "Welcome back. Continue your mix from last time."}
                </p>
              </div>
            )}

            <div className="mb-10">
              <SectionTitle>Featured Soundscapes</SectionTitle>
              <SectionSubtitle>Hand-picked environments our community loves most.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {featuredSounds.map((sound) => (
                <SoundCard key={sound.id} {...sound} category={sound.category} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 2: Mood Picker — full-bleed gradient */}
        <MoodPicker />

        {/* Section 3: Environments Showcase — full-bleed image */}
        <EnvironmentsCarousel />

        {/* Section 4: Honest Stats — scale in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <StatsSection />
        </motion.div>

        {/* Section 5: Mini Mixer CTA */}
        <MiniMixer />

        {/* Testimonials + Footer sections remain */}
        <section id="about" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
                <Quote size={12} className="text-accent-light" />
                <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider">Testimonials</span>
              </div>
              <SectionTitle>Loved by Thousands</SectionTitle>
              <SectionSubtitle className="mx-auto">Hear from people who use Noctune to find their focus, rest, and calm.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Alex Chen", role: "Software Engineer", quote: "I haven't slept this well in years. Rain & Thunder every night — my sleep score went from 60 to 85.", rating: 5, hours: 240 },
                { name: "Maya Patel", role: "Designer", quote: "The mixer is a game-changer. I layer brown noise with cafe ambience and enter flow state instantly.", rating: 5, hours: 480 },
                { name: "James Okafor", role: "Graduate Student", quote: "Forest Morning + writing sounds = my dissertation is finally getting done.", rating: 5, hours: 320 },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-all">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center text-[10px] font-bold text-accent-light">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/80">{t.name}</p>
                      <p className="text-[10px] text-white/30">{t.role} · {t.hours} hrs listened</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Premium */}
        <section id="pricing" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 mb-4">
                <Sparkles size={12} className="text-amber-400" />
                <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Premium</span>
              </div>
              <SectionTitle>Find Your Quiet, Uninterrupted</SectionTitle>
              <SectionSubtitle className="mx-auto">Unlock every sound, unlimited layers, offline mode, and more.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                <h3 className="text-base font-semibold text-white mb-1">Free</h3>
                <p className="text-3xl font-bold text-white mb-1">$0</p>
                <p className="text-xs text-white/30 mb-6">Forever</p>
                <ul className="space-y-3 mb-8">
                  {["Access to 40+ free sounds", "Basic mixer with 3 layers", "Timer & fade-out", "Create up to 3 mixes"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50">✓ {f}</li>
                  ))}
                </ul>
                <div className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-medium text-white/40 text-center cursor-default">Current Plan</div>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-8 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">Popular</div>
                <h3 className="text-base font-semibold text-white mb-1">Premium</h3>
                <p className="text-3xl font-bold text-white mb-1">$4.99</p>
                <p className="text-xs text-white/30 mb-6">Per month</p>
                <ul className="space-y-3 mb-8">
                  {["All 60+ sounds unlocked", "Unlimited mixer layers", "Offline listening", "Lossless audio quality", "AI-generated soundscapes", "Cross-device sync"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50"><Sparkles size={10} className="text-amber-400 shrink-0" />{f}</li>
                  ))}
                </ul>
                <button onClick={() => { useToastStore.getState().addToast({ type: "info", title: "Premium launching soon", description: "Join the waitlist to be the first to know when Premium launches." }) }} className="w-full rounded-xl bg-amber-500/15 border border-amber-400/20 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-lg shadow-amber-500/5">Coming Soon — Join Waitlist</button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] px-6 md:px-16 lg:px-24 py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
                <span className="text-accent-light text-[10px] font-bold">N</span>
              </div>
              <span className="text-white/30 text-xs">Noctune · Find your quiet.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/20">
              <a href="/explore" className="hover:text-white/40 transition-colors">Explore</a>
              <a href="/support" className="hover:text-white/40 transition-colors">Support</a>
              <a href="/privacy" className="hover:text-white/40 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white/40 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

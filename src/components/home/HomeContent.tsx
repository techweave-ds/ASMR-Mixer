"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Sparkles, Moon, Sun, Cloud, Wind, Mountain, Trees, Star, Quote, Check, ChevronDown } from "lucide-react"
import { ExperienceCards } from "@/components/home/ExperienceCards"
import { UseCasesSection } from "@/components/home/UseCasesSection"
import { StatsSection } from "@/components/home/StatsSection"
import { EnvironmentsCarousel } from "@/components/home/EnvironmentsCarousel"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds } from "@/data/sounds"
import { categoryLabels, categoryIcons } from "@/data/sounds"
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

function SectionSubtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm md:text-base text-white/30 max-w-lg leading-relaxed mt-2", className)}>{children}</p>
}

export function HomeContent() {
  const router = useRouter()
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

        {/* Section 5: Featured Soundscapes */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <SectionTitle>Featured Soundscapes</SectionTitle>
                <SectionSubtitle>Hand-picked environments our community loves most.</SectionSubtitle>
              </div>
              <a href="/explore" className="hidden sm:flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors">
                View All <ChevronDown size={12} className="-rotate-90" />
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sounds.filter((s) => !s.isPremium).slice(0, 10).map((sound) => (
                <SoundCard key={sound.id} {...sound} category={sound.category} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 6: Popular Categories */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>Popular Categories</SectionTitle>
              <SectionSubtitle>Browse by environment. Find your perfect background.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {["rain", "ocean", "forest", "fireplace", "wind", "night", "birds", "whisper", "tapping", "writing", "cafe", "library"].map((cat) => {
                const count = sounds.filter((s) => s.category === cat).length
                return (
                  <a key={cat} href="/explore"
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center transition-all hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <span className="text-lg">{categoryIcons[cat] === "Waves" ? "🌊" : categoryIcons[cat] === "CloudRain" ? "🌧" : categoryIcons[cat] === "Trees" ? "🌲" : categoryIcons[cat] === "Flame" ? "🔥" : categoryIcons[cat] === "Wind" ? "💨" : categoryIcons[cat] === "Moon" ? "🌙" : categoryIcons[cat] === "Bird" ? "🐦" : "🎵"}</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">{categoryLabels[cat] || cat}</div>
                      <div className="text-[10px] text-white/30 mt-0.5">{count} sounds</div>
                    </div>
                  </a>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Section 7: Testimonials */}
        <section id="about" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
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
                { name: "Alex Chen", role: "Software Engineer", quote: "I put on Rain & Thunder every night. My sleep score went from 60 to 85 in two weeks.", rating: 5 },
                { name: "Maya Patel", role: "Designer", quote: "The mixer is a game-changer. I layer brown noise with cafe ambience and enter flow state instantly.", rating: 5 },
                { name: "James Okafor", role: "Graduate Student", quote: "Forest Morning + writing sounds = my dissertation is finally getting done.", rating: 5 },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center text-[10px] font-bold text-accent-light">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/80">{t.name}</p>
                      <p className="text-[10px] text-white/30">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 8: Pricing */}
        <section id="pricing" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 mb-4">
                <Sparkles size={12} className="text-amber-400" />
                <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Premium</span>
              </div>
              <SectionTitle>Find Your Quiet, Uninterrupted</SectionTitle>
              <SectionSubtitle className="mx-auto">Upgrade for lossless audio, unlimited layers, offline mode, and more.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                <h3 className="text-base font-semibold text-white mb-1">Free</h3>
                <p className="text-3xl font-bold text-white mb-1">$0</p>
                <p className="text-xs text-white/30 mb-6">Forever</p>
                <ul className="space-y-3 mb-8">
                  {["Access to 40+ free sounds", "Basic mixer with 3 layers", "Timer & fade-out", "Create up to 3 mixes"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50"><Check size={12} className="text-accent-light shrink-0" />{f}</li>
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
                  {["All 60+ sounds unlocked", "Unlimited mixer layers", "Offline listening", "Lossless audio quality", "AI-generated soundscapes", "Cross-device sync", "Daily focus sessions"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50"><Check size={12} className="text-amber-400 shrink-0" />{f}</li>
                  ))}
                </ul>
                <button onClick={() => alert("Free trial coming soon!")} className="w-full rounded-xl bg-amber-500/15 border border-amber-400/20 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-lg shadow-amber-500/5">Start Free Trial</button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 9: FAQ */}
        <section className="px-6 md:px-16 lg:px-24 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-10">
              <SectionTitle>Frequently Asked Questions</SectionTitle>
            </div>
            <div className="space-y-3">
              {[
                { q: "How does the audio work?", a: "All sounds are generated procedurally in real-time using the Web Audio API. There are no audio files to download — each sound is unique every time you play it." },
                { q: "Can I use Noctune offline?", a: "Free users need an internet connection. Premium subscribers can download mixes for offline playback." },
                { q: "What is the sleep timer?", a: "The timer lets you set a duration after which all sounds fade out gradually. Choose from 15, 30, 45, 60, or 120 minutes." },
                { q: "Can I layer multiple sounds?", a: "Yes! The mixer lets you layer up to 16 sounds simultaneously with individual volume control, mute, and solo per layer." },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] [&_summary]:open:border-b [&_summary]:open:border-white/[0.06] transition-all">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-white/70 hover:text-white/90 transition-colors">
                    {faq.q}
                    <ChevronDown size={14} className="text-white/30 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="px-5 py-4 text-xs text-white/40 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 10: Curated Collections */}
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
                onClick={() => router.push("/explore")}
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
                    onClick={() => router.push("/explore")}
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
              <a href="#">Accessibility</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

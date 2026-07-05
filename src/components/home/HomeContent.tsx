"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Sparkles, Moon, Sun, Cloud, Wind, Mountain, Trees, Star, Quote, Check, ChevronDown, SlidersVertical, Play, Headphones } from "lucide-react"
import { ExperienceCards } from "@/components/home/ExperienceCards"
import { UseCasesSection } from "@/components/home/UseCasesSection"
import { StatsSection } from "@/components/home/StatsSection"
import { EnvironmentsCarousel } from "@/components/home/EnvironmentsCarousel"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds } from "@/data/sounds"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/hooks/useScrollContainer"
import { useAudioStore } from "@/store"

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
  const isPlaying = useAudioStore((s) => s.isPlaying)

  const scrollProgress = useScrollProgress()
  const heroFadedOut = scrollProgress > 0.3
  const heroScale = 1 - scrollProgress * 0.06
  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.5)

  const trendingSounds = sounds.filter((s) => !s.isPremium).slice(0, 6)
  const popularCollections = [
    { title: "Deep Sleep", subtitle: "12 sounds for restful nights", icon: Moon, gradient: "from-indigo-600/20 to-purple-900/20" },
    { title: "Morning Focus", subtitle: "10 sounds for clarity", icon: Sun, gradient: "from-amber-600/20 to-orange-900/20" },
    { title: "Rain Collection", subtitle: "14 sounds of rain", icon: Cloud, gradient: "from-blue-600/20 to-indigo-800/20" },
    { title: "Forest Ambience", subtitle: "9 sounds of woodland", icon: Trees, gradient: "from-emerald-600/20 to-green-900/20" },
    { title: "Ocean Escape", subtitle: "8 sounds of the sea", icon: Wind, gradient: "from-cyan-600/20 to-blue-900/20" },
    { title: "Cozy Cabin", subtitle: "11 sounds for warmth", icon: Mountain, gradient: "from-stone-600/20 to-amber-900/20" },
  ]

  return (
    <div className="relative">
      {/* === HERO === */}
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

      {/* === CONTENT SECTIONS === */}
      <div ref={contentRef} className="relative z-10 mt-[100vh] bg-bg-primary">
        <div className="h-10 md:h-16" />

        {/* Section 1: Featured Soundscapes */}
        <section id="content-start" className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
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

        {/* Section 2: What do you need today? */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <UseCasesSection />
        </section>

        {/* Section 3: Continue Listening / Trending */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <SectionTitle>Trending Now</SectionTitle>
                <SectionSubtitle>What others are listening to around the world.</SectionSubtitle>
              </div>
              {isPlaying && (
                <button onClick={() => router.push("/mixer")}
                  className="hidden sm:flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-xs font-medium text-accent-light hover:bg-accent/20 transition-all">
                  <Headphones size={12} />
                  Open Mixer
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {trendingSounds.map((sound) => (
                <SoundCard key={sound.id} {...sound} category={sound.category} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 4: Interactive Mixer Preview */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-accent/5 to-transparent p-8 md:p-12 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
                    <SlidersVertical size={12} className="text-accent-light" />
                    <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider">Mixer</span>
                  </div>
                  <SectionTitle>Your Sound. Your Mix.</SectionTitle>
                  <SectionSubtitle>Layer rain over wind. Add a fireplace beneath ocean waves. The mixer lets you compose your perfect ambience.</SectionSubtitle>
                </div>
                <button onClick={() => router.push("/mixer")}
                  className="flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-6 py-3 text-sm font-medium text-accent-light hover:bg-accent/25 transition-all shrink-0 shadow-lg shadow-accent/10">
                  <Play size={14} />
                  Try Mixer
                </button>
              </div>

              {/* Visual mixer preview */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {[
                  { label: "Rain", pct: 75, color: "bg-blue-500" },
                  { label: "Wind", pct: 40, color: "bg-cyan-400" },
                  { label: "Fire", pct: 60, color: "bg-orange-500" },
                  { label: "Birds", pct: 25, color: "bg-emerald-400" },
                  { label: "River", pct: 50, color: "bg-sky-400" },
                ].map((ch) => (
                  <div key={ch.label} className="flex flex-col items-center gap-2">
                    <div className="w-full h-24 md:h-32 rounded-xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                      <div className={`absolute bottom-0 left-0 right-0 ${ch.color} rounded-b-xl transition-all duration-1000`}
                        style={{ height: `${ch.pct}%`, opacity: 0.3 }} />
                    </div>
                    <span className="text-[10px] text-white/40">{ch.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 5: Popular Collections */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <SectionTitle>Popular Collections</SectionTitle>
              <SectionSubtitle>Curated soundscapes for every moment of your day.</SectionSubtitle>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCollections.map((col) => {
                const Icon = col.icon
                return (
                  <button key={col.title}
                    onClick={() => router.push("/explore")}
                    className={cn("group flex items-center gap-4 rounded-xl border border-white/[0.06] p-4 text-left transition-all hover:border-white/[0.12] hover:-translate-y-0.5", col.gradient)}
                  >
                    <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">{col.title}</div>
                      <div className="text-xs text-white/30 mt-0.5">{col.subtitle}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Section 6: Environments Carousel */}
        <section className="mb-16">
          <EnvironmentsCarousel />
        </section>

        {/* Section 7: Why Noctune */}
        <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto mb-16">
          <ExperienceCards />
        </section>

        {/* Section 8: Testimonials */}
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
                { name: "Alex Chen", role: "Software Engineer", quote: "I haven't slept this well in years. Rain & Thunder every night — my sleep score went from 60 to 85.", rating: 5, hours: 240 },
                { name: "Maya Patel", role: "Designer", quote: "The mixer is a game-changer. I layer brown noise with cafe ambience and enter flow state instantly. Worth every penny.", rating: 5, hours: 480 },
                { name: "James Okafor", role: "Graduate Student", quote: "Forest Morning + writing sounds = my dissertation is finally getting done. Focus has never come this easily.", rating: 5, hours: 320 },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-all">
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
                      <p className="text-[10px] text-white/30">{t.role} · {t.hours} hrs listened</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Stats below testimonials */}
            <div className="mt-10">
              <StatsSection />
            </div>
          </motion.div>
        </section>

        {/* Section 9: Premium */}
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
                  {[
                    { label: "All 60+ sounds unlocked", highlight: false },
                    { label: "Unlimited mixer layers", highlight: false },
                    { label: "Offline listening", highlight: true },
                    { label: "Lossless audio quality", highlight: false },
                    { label: "AI-generated soundscapes", highlight: true },
                    { label: "Cross-device sync", highlight: false },
                    { label: "Sleep timer extended", highlight: false },
                  ].map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-xs text-white/50">
                      <Check size={12} className={cn("shrink-0", f.highlight ? "text-amber-400" : "text-accent-light")} />
                      {f.label}
                      {f.highlight && <Sparkles size={8} className="text-amber-400/60" />}
                    </li>
                  ))}
                </ul>
                <button onClick={() => alert("Free trial coming soon!")} className="w-full rounded-xl bg-amber-500/15 border border-amber-400/20 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-lg shadow-amber-500/5">Start Free Trial</button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 10: FAQ */}
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
              <a href="#" className="hover:text-white/40 transition-colors">Product</a>
              <a href="#" className="hover:text-white/40 transition-colors">Support</a>
              <a href="#" className="hover:text-white/40 transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import {
  Moon, BookOpen, Target, Flower2,
  Briefcase, BookMarked, CloudSun, Sparkles, ChevronRight,
  Play, Clock, ArrowRight,
  Headphones, TrendingUp
} from "lucide-react"
import { SoundCard } from "@/components/ui/SoundCard"
import { CollectionCard } from "@/components/collections/CollectionCard"
import { Waveform } from "@/components/ui/Waveform"
import { sounds } from "@/data/sounds"
import { collections } from "@/data/collections"
import { useAudioStore } from "@/store"
import { cn } from "@/lib/utils"
import Link from "next/link"

const quickCategories = [
  { label: "Sleep", gradient: "from-indigo-600/40 to-purple-900/40", icon: Moon, action: "brown-noise", color: "indigo" },
  { label: "Study", gradient: "from-blue-500/40 to-teal-700/40", icon: BookOpen, action: "library-quiet", color: "blue" },
  { label: "Focus", gradient: "from-emerald-500/40 to-green-800/40", icon: Target, action: "white-noise", color: "green" },
  { label: "Relax", gradient: "from-sky-400/40 to-blue-600/40", icon: CloudSun, action: "ocean-waves", color: "sky" },
  { label: "Meditate", gradient: "from-violet-500/40 to-purple-900/40", icon: Flower2, action: "space-ambient", color: "purple" },
  { label: "Read", gradient: "from-amber-500/40 to-orange-700/40", icon: BookMarked, action: "fireplace", color: "amber" },
  { label: "Work", gradient: "from-stone-400/40 to-stone-700/40", icon: Briefcase, action: "cafe-bustling", color: "stone" },
  { label: "Night", gradient: "from-slate-700/40 to-indigo-950/40", icon: Moon, action: "night-crickets", color: "slate" },
]

const heroScenes = [
  { gradient: "from-slate-800/60 via-indigo-900/30 to-bg-base", label: "Misty Mountains", cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" },
  { gradient: "from-blue-900/60 via-slate-800/30 to-bg-base", label: "Night Lake", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
  { gradient: "from-emerald-900/60 via-stone-800/30 to-bg-base", label: "Deep Forest", cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80" },
]

export function HomeContent() {
  const [heroScene] = useState(() => Math.floor(Math.random() * heroScenes.length))
  const { isPlayingSounds, toggleSound } = useAudioStore()

  const featuredCollections = useMemo(
    () => collections.filter((c) => !c.isPremium).slice(0, 8),
    []
  )

  const popularSounds = useMemo(
    () => sounds.filter((s) => !s.isPremium).slice(0, 8),
    []
  )

  const continueListening = useMemo(
    () => sounds.filter((s) => !s.isPremium && ["rain-light", "ocean-waves", "fireplace", "brown-noise"].includes(s.id)),
    []
  )

  const getHour = () => new Date().getHours()
  const greeting = getHour() < 12 ? "Good Morning" : getHour() < 18 ? "Good Afternoon" : "Good Evening"
  const weatherLabel = getHour() < 12 ? "Partly Cloudy" : getHour() < 18 ? "Clear Sky" : "Clear Night"

  const Scene = heroScenes[heroScene]

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 overflow-hidden lg:-mx-10 xl:-mx-12 rounded-b-3xl" style={{ height: 320 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Scene.cover})` }}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br", Scene.gradient)} />
        <div className="cinema-gradient absolute inset-0" />
        <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-10 xl:px-12 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={12} className="text-accent-lighter/60" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-text-secondary">{Scene.label}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text-primary lg:text-4xl xl:text-5xl">
                {greeting}
              </h1>
              <p className="mt-1 text-sm text-text-tertiary lg:text-base">
                Let&apos;s find your perfect sound.
              </p>
            </div>
            <div className="glass hidden items-center gap-2.5 rounded-2xl px-4 py-2.5 sm:flex">
              <CloudSun size={16} className="text-accent-amber/80" />
              <div>
                <p className="text-sm font-medium text-text-primary">23°C</p>
                <p className="text-[10px] text-text-tertiary">{weatherLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPlayingSounds.size > 0 ? (
              <button className="flex items-center gap-3 rounded-2xl bg-accent/15 backdrop-blur-xl border border-accent/20 px-5 py-3 transition-all hover:bg-accent/25">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <Headphones size={18} className="text-accent-light" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Continue Listening</p>
                  <p className="text-xs text-text-tertiary">{isPlayingSounds.size} active sound{isPlayingSounds.size > 1 ? 's' : ''}</p>
                </div>
                <ArrowRight size={16} className="text-text-quaternary" />
              </button>
            ) : (
              <button
                onClick={() => toggleSound("ocean-waves")}
                className="flex items-center gap-3 rounded-2xl bg-accent/10 backdrop-blur-xl border border-accent/10 px-5 py-3 transition-all hover:bg-accent/20 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <Play size={16} className="text-accent-light ml-0.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Start with Ocean Waves</p>
                  <p className="text-xs text-text-tertiary">Most popular • 3.6K plays</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Waveform when playing */}
      {isPlayingSounds.size > 0 && (
        <div className="px-1">
          <Waveform />
        </div>
      )}

      {/* Quick Categories */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Quick Start</h2>
          <span className="text-[10px] text-text-quaternary">One-tap immersion</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {quickCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => toggleSound(cat.action)}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-2xl border border-border-subtle bg-glass py-4 px-2 transition-all duration-200 hover:border-border-hover hover:bg-glass-hover",
                isPlayingSounds.has(cat.action) && "border-accent/20 bg-accent/5"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-200 group-hover:scale-110",
                cat.gradient
              )}>
                <cat.icon size={18} className={isPlayingSounds.has(cat.action) ? "text-accent-lighter" : "text-white/70"} />
              </div>
              <span className={cn("text-[10px] font-medium", isPlayingSounds.has(cat.action) ? "text-accent-light" : "text-text-tertiary")}>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Continue Listening */}
      {isPlayingSounds.size > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Continue Listening</h2>
            <Link href="/mixer" className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors">
              Open Mixer <ChevronRight size={10} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {continueListening.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className="group flex-shrink-0 w-44"
              >
                <div className={cn("relative h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br", sound.gradient)}
                  style={sound.coverUrl ? { backgroundImage: `url(${sound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium text-text-primary truncate">{sound.title}</p>
                    <p className="text-[10px] text-text-tertiary capitalize">{sound.category}</p>
                  </div>
                  {isPlayingSounds.has(sound.id) && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/20 backdrop-blur-sm px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
                      <span className="text-[9px] text-accent-lighter/80">Live</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Collections */}
      <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Featured Collections</h2>
          <Link href="/explore" className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors">
            View All <ChevronRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featuredCollections.slice(0, 4).map((col) => (
            <CollectionCard key={col.id} {...col} />
          ))}
        </div>
      </section>

      {/* Popular Sounds */}
      <section className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-accent-light" />
            <h2 className="text-sm font-semibold text-text-primary">Popular Sounds</h2>
          </div>
          <span className="text-[10px] text-text-quaternary">Most played this week</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularSounds.slice(0, 6).map((sound) => (
            <SoundCard key={sound.id} {...sound} />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-primary">Recently Played</h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {sounds.filter((s) => !s.isPremium).slice(0, 8).map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className="group flex-shrink-0 w-40"
            >
              <div className={cn("relative h-24 w-full overflow-hidden rounded-xl bg-gradient-to-br", sound.gradient)}
                style={sound.coverUrl ? { backgroundImage: `url(${sound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-sm font-medium text-text-primary truncate">{sound.title}</p>
                  <p className="text-[10px] text-text-tertiary capitalize">{sound.category}</p>
                </div>
                {isPlayingSounds.has(sound.id) && (
                  <div className="absolute right-2.5 top-2.5">
                    <span className="h-2 w-2 rounded-full bg-accent-light animate-pulse" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

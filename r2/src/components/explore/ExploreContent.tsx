"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds, categoryLabels } from "@/data/sounds"
import { cn } from "@/lib/utils"

const categories = Object.keys(categoryLabels)

const KEYWORD_MAP: Record<string, string[]> = {
  sleep: ["rain-light", "ocean-waves", "night-crickets", "fireplace", "wind-gentle", "brown-noise", "pink-noise", "whisper-soft"],
  "deep sleep": ["brown-noise", "pink-noise", "ocean-waves", "rain-light", "night-crickets"],
  coding: ["keyboard-mechanical", "keyboard-laptop", "white-noise", "brown-noise", "cafe-bustling"],
  focus: ["white-noise", "brown-noise", "cafe-bustling", "library-quiet", "rain-light", "pink-noise", "keyboard-mechanical", "brown-noise", "blue-noise"],
  study: ["library-quiet", "writing-pen", "writing-pencil", "white-noise", "rain-light", "cafe-bustling"],
  coffee: ["cafe-bustling", "cafe-rainy", "coffee-machine"],
  winter: ["snow-falling", "wind-winter", "fireplace", "fireplace-old", "heater-hum"],
  storm: ["rain-thunder", "ocean-storm", "thunder-close", "thunder-distant", "rain-heavy"],
  rain: ["rain-light", "rain-heavy", "rain-thunder", "rain-rooftop", "rain-forest-canopy", "city-rain"],
  adhd: ["brown-noise", "white-noise", "pink-noise", "rain-light"],
  "brown noise": ["brown-noise"],
  "white noise": ["white-noise"],
  "pink noise": ["pink-noise"],
  meditation: ["ocean-waves", "space-ambient", "space-drone", "wind-gentle", "night-windchimes", "forest-deep", "whisper-soft", "whisper-breathy"],
  nature: ["forest-day", "forest-night", "forest-deep", "river-stream", "river-gentle", "waterfall", "waterfall-large", "birds-garden"],
  relaxing: ["rain-light", "ocean-waves", "wind-gentle", "fireplace", "river-gentle", "pink-noise", "cabin-porch", "whisper-soft"],
  tinitus: ["white-noise", "brown-noise", "pink-noise"],
  cozy: ["fireplace", "fireplace-old", "rain-rooftop", "cafe-rainy", "cabin-porch", "heater-hum", "whisper-soft"],
}

const SUGGESTIONS = ["sleep", "focus", "coding", "coffee", "winter", "storm", "rain", "adhd", "brown noise", "meditation", "nature", "cozy"]

export function ExploreContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filteredSounds = useMemo(() => {
    let result = sounds
    if (selectedCategory) result = result.filter((s) => s.category === selectedCategory)

    const q = searchQuery.toLowerCase().trim()
    if (q) {
      const keywordIds = KEYWORD_MAP[q]
      if (keywordIds) {
        result = result.filter((s) => keywordIds.includes(s.id))
      } else {
        result = result.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.tags.some((t) => t.includes(q)) ||
            (categoryLabels[s.category] || "").toLowerCase().includes(q)
        )
      }
    }

    return result
  }, [selectedCategory, searchQuery])

  const matchedSuggestions = searchQuery.trim()
    ? SUGGESTIONS.filter((s) => s.includes(searchQuery.toLowerCase()) && s !== searchQuery.toLowerCase()).slice(0, 5)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Explore</h1>
        <p className="mt-1 text-sm text-text-tertiary">Discover sounds that match your mood</p>
      </div>

      {/* Search bar */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-quaternary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search sounds, moods, or keywords... (try: sleep, focus, coffee, storm)"
            className="w-full rounded-xl border border-border-subtle bg-bg-secondary/50 py-2.5 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-quaternary outline-none transition-all focus:border-accent/30 focus:bg-bg-secondary focus:shadow-[0_0_20px_rgba(90,124,255,0.06)]"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSuggestions(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        {showSuggestions && searchQuery.trim() && matchedSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 rounded-xl border border-border-subtle bg-bg-elevated shadow-2xl p-1.5 z-20">
            {matchedSuggestions.map((s) => (
              <button key={s} onClick={() => { setSearchQuery(s); setShowSuggestions(false) }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-tertiary hover:text-text-secondary hover:bg-glass-hover transition-colors">
                <Search size={12} className="text-text-quaternary" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="relative">
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          <button onClick={() => setSelectedCategory(null)}
            className={cn("shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all border",
              !selectedCategory ? "bg-accent/15 text-accent-light border-accent/20" : "bg-glass text-text-tertiary border-border-subtle hover:text-text-secondary hover:bg-glass-hover")}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={cn("shrink-0 rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all border",
                selectedCategory === cat ? "bg-accent/15 text-accent-light border-accent/20" : "bg-glass text-text-tertiary border-border-subtle hover:text-text-secondary hover:bg-glass-hover")}>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg-primary to-transparent" />
      </div>

      {/* Sound grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        {filteredSounds.map((sound) => (<SoundCard key={sound.id} {...sound} category={sound.category} />))}
      </div>
      {filteredSounds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
          <Search size={36} className="mb-4 opacity-30" />
          <p className="text-base font-medium text-text-secondary">No sounds found</p>
          <p className="mt-1 text-sm">Try a different category or search term</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { useUiStore } from "@/store"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds } from "@/data/sounds"
import { cn } from "@/lib/utils"

const KEYWORD_MAP: Record<string, string[]> = {
  sleep: ["rain-light", "ocean-waves", "night-crickets", "fireplace", "brown-noise", "pink-noise", "whisper-soft"],
  "deep sleep": ["brown-noise", "pink-noise", "ocean-waves", "rain-light"],
  coding: ["keyboard-mechanical", "keyboard-laptop", "white-noise", "brown-noise", "cafe-bustling"],
  focus: ["white-noise", "brown-noise", "cafe-bustling", "library-quiet", "rain-light", "pink-noise"],
  study: ["library-quiet", "writing-pen", "writing-pencil", "white-noise", "rain-light", "cafe-bustling"],
  coffee: ["cafe-bustling", "cafe-rainy", "coffee-machine"],
  storm: ["rain-thunder", "ocean-storm", "thunder-close", "thunder-distant", "rain-heavy"],
  rain: ["rain-light", "rain-heavy", "rain-thunder", "rain-rooftop", "rain-forest-canopy", "city-rain"],
  adhd: ["brown-noise", "white-noise", "pink-noise", "rain-light"],
  "brown noise": ["brown-noise"],
  "white noise": ["white-noise"],
  "pink noise": ["pink-noise"],
  meditation: ["ocean-waves", "space-ambient", "space-drone", "wind-gentle", "night-windchimes", "whisper-soft"],
  nature: ["forest-day", "forest-night", "river-stream", "waterfall", "birds-garden", "wind-gentle"],
  cozy: ["fireplace", "fireplace-old", "rain-rooftop", "cafe-rainy", "cabin-porch", "heater-hum"],
  fan: ["fan-sleep", "fan-box", "ac-unit"],
  thunder: ["rain-thunder", "thunder-close", "thunder-distant", "ocean-storm"],
  ocean: ["ocean-waves", "ocean-cave", "ocean-storm", "ocean-night"],
  forest: ["forest-day", "forest-night", "forest-deep", "rain-forest-canopy"],
  fireplace: ["fireplace", "fireplace-old", "campfire", "campfire-beach"],
  world: ["space-ambient", "space-drone"],
}

const SUGGESTIONS = ["sleep", "focus", "coding", "coffee", "rain", "storm", "adhd", "brown noise", "meditation", "nature", "cozy", "ocean", "thunder", "fireplace", "fan"]

export function SearchContent() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useUiStore()
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("")
      setSelectedIdx(-1)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return SUGGESTIONS.filter((s) => s.includes(q)).slice(0, 5)
  }, [query])

  const keywordResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()
    const matchedIds = KEYWORD_MAP[q] || []
    if (matchedIds.length > 0) return sounds.filter((s) => matchedIds.includes(s.id))
    return []
  }, [query])

  const textResults = useMemo(() => {
    if (!query.trim()) return []
    if (keywordResults.length > 0) return []
    const q = query.toLowerCase()
    return sounds.filter((s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q)) || s.category.toLowerCase().includes(q))
  }, [query, keywordResults])

  const results = keywordResults.length > 0 ? keywordResults : textResults

  const hasSuggestions = suggestions.length > 0 && query.trim().length > 0 && results.length === 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (hasSuggestions) {
        setSelectedIdx((prev) => Math.min(prev + 1, suggestions.length - 1))
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIdx((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && selectedIdx >= 0 && hasSuggestions) {
      e.preventDefault()
      setQuery(suggestions[selectedIdx])
      setSelectedIdx(-1)
    } else if (e.key === "Escape") {
      setSearchOpen(false)
      setQuery("")
    }
  }

  const submitSearch = (term: string) => {
    addRecentSearch(term)
    setQuery(term)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-bg-base/95 backdrop-blur-2xl" role="dialog" aria-label="Search sounds">
      <div className="mx-auto max-w-2xl px-4 pt-20">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary" />
          <input ref={inputRef} type="text" placeholder="Search sounds, categories, tags..." value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(-1) }}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-border bg-glass py-4 pl-12 pr-12 text-base text-text-primary outline-none placeholder:text-text-quaternary focus:border-accent/50 transition-all"
            autoFocus aria-label="Search input" />
          <button onClick={() => { setSearchOpen(false); setQuery("") }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary transition-colors" aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {hasSuggestions && (
          <div ref={listRef} className="mt-3 rounded-xl border border-border bg-glass overflow-hidden" role="listbox">
            {suggestions.map((s, i) => (
              <button key={s} role="option" aria-selected={i === selectedIdx}
                onClick={() => submitSearch(s)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                  i === selectedIdx ? "bg-accent/10 text-accent-light" : "text-text-secondary hover:bg-glass-hover"
                )}>
                <Search size={14} className="text-text-quaternary shrink-0" />
                <span>{s}</span>
                <ArrowRight size={12} className="ml-auto text-text-quaternary" />
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {query && results.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <p className="text-xs text-text-tertiary mb-3">{results.length} result{results.length > 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((sound) => (
                <SoundCard key={sound.id} {...sound} onClick={() => { addRecentSearch(query); setSearchOpen(false); setQuery("") }} />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && !hasSuggestions && (
          <div className="mt-16 text-center animate-fade-in">
            <Search size={36} className="mx-auto mb-3 opacity-30 text-text-quaternary" />
            <p className="text-base text-text-secondary">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-text-tertiary">Try a different search term</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["rain", "sleep", "focus", "ocean", "cafe"].map((tag) => (
                <button key={tag} onClick={() => submitSearch(tag)}
                  className="rounded-full bg-glass border border-border-subtle px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary hover:bg-glass-hover transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Default state */}
        {!query && (
          <div className="animate-fade-in">
            {recentSearches.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-tertiary" />
                    <span className="text-sm font-medium text-text-secondary">Recent Searches</span>
                  </div>
                  <button onClick={clearRecentSearches} className="text-[10px] text-text-quaternary hover:text-text-secondary transition-colors">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button key={s} onClick={() => setQuery(s)}
                      className="rounded-full bg-glass border border-border-subtle px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary hover:bg-glass-hover transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-accent-light" />
                <span className="text-sm font-medium text-text-secondary">Trending Sounds</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sounds.slice(0, 6).map((sound) => (<SoundCard key={sound.id} {...sound} />))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

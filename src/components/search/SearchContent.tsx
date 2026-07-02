"use client"

import { useState, useMemo } from "react"
import { Search, X, TrendingUp, Clock } from "lucide-react"
import { useUiStore } from "@/store"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds } from "@/data/sounds"

export function SearchContent() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useUiStore()
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return sounds.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    )
  }, [query])

  const trendingSounds = useMemo(() => sounds.slice(0, 6), [])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-bg-base/95 backdrop-blur-2xl">
      <div className="mx-auto max-w-2xl px-4 pt-16">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary" />
          <input
            type="text"
            placeholder="Search sounds, categories, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-glass py-4 pl-12 pr-12 text-base text-text-primary outline-none transition-all placeholder:text-text-quaternary focus:border-accent/50"
            autoFocus
          />
          <button
            onClick={() => { setSearchOpen(false); setQuery("") }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {query && results.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <p className="text-xs text-text-tertiary mb-3">{results.length} result{results.length > 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((sound) => (
                <SoundCard
                  key={sound.id}
                  {...sound}
                  onClick={() => { addRecentSearch(query); setSearchOpen(false); setQuery("") }}
                />
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="mt-16 text-center animate-fade-in">
            <Search size={36} className="mx-auto mb-3 opacity-30 text-text-quaternary" />
            <p className="text-base text-text-secondary">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-text-tertiary">Try a different search term</p>
          </div>
        )}

        {!query && (
          <div className="animate-fade-in">
            {recentSearches.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-tertiary" />
                    <span className="text-sm font-medium text-text-secondary">Recent Searches</span>
                  </div>
                  <button onClick={clearRecentSearches} className="text-[10px] text-text-quaternary hover:text-text-secondary transition-colors">
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-full bg-glass border border-border-subtle px-3 py-1.5 text-xs text-text-tertiary transition-colors hover:text-text-secondary hover:bg-glass-hover"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-accent-light" />
                <span className="text-sm font-medium text-text-secondary">Trending Sounds</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {trendingSounds.map((sound) => (
                  <SoundCard key={sound.id} {...sound} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

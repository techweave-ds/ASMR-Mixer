"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds, categoryLabels } from "@/data/sounds"
import { cn } from "@/lib/utils"

const categories = Object.keys(categoryLabels)

export function ExploreContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSounds = useMemo(() => {
    let result = sounds
    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          categoryLabels[s.category]?.toLowerCase().includes(q)
      )
    }
    return result
  }, [selectedCategory, searchQuery])

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Explore</h1>
        <p className="mt-1 text-sm text-text-tertiary">Discover sounds that match your mood</p>
      </div>

      {/* Premium Search */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary" />
        <input
          type="text"
          placeholder="Search sounds, categories, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border bg-glass py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition-all placeholder:text-text-quaternary focus:border-accent/50 focus:bg-glass-hover"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
            !selectedCategory
              ? "bg-accent/15 text-accent-light border border-accent/20"
              : "bg-glass text-text-tertiary border border-border-subtle hover:text-text-secondary hover:bg-glass-hover"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all",
              selectedCategory === cat
                ? "bg-accent/15 text-accent-light border border-accent/20"
                : "bg-glass text-text-tertiary border border-border-subtle hover:text-text-secondary hover:bg-glass-hover"
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredSounds.map((sound) => (
          <SoundCard key={sound.id} {...sound} />
        ))}
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

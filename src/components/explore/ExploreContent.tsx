"use client"

import { useState, useMemo, useRef } from "react"
import { Search } from "lucide-react"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds, categoryLabels } from "@/data/sounds"
import { cn } from "@/lib/utils"

const categories = Object.keys(categoryLabels)

export function ExploreContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredSounds = useMemo(() => {
    let result = sounds
    if (selectedCategory) result = result.filter((s) => s.category === selectedCategory)
    return result
  }, [selectedCategory])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Explore</h1>
        <p className="mt-1 text-sm text-text-tertiary">Discover sounds that match your mood</p>
      </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        {filteredSounds.map((sound) => (<SoundCard key={sound.id} {...sound} />))}
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

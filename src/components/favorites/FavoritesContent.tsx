"use client"

import { useMemo } from "react"
import { Heart, Music, Bookmark } from "lucide-react"
import { SoundCard } from "@/components/ui/SoundCard"
import { CollectionCard } from "@/components/collections/CollectionCard"
import { useFavoritesStore } from "@/store"
import { sounds } from "@/data/sounds"
import { collections } from "@/data/collections"

export function FavoritesContent() {
  const { soundIds, collectionIds } = useFavoritesStore()

  const favoriteSounds = useMemo(
    () => sounds.filter((s) => soundIds.includes(s.id)),
    [soundIds]
  )
  const favoriteCollections = useMemo(
    () => collections.filter((c) => collectionIds.includes(c.id)),
    [collectionIds]
  )

  const hasFavorites = favoriteSounds.length > 0 || favoriteCollections.length > 0

  if (!hasFavorites) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
        <Heart size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium text-text-secondary">No favorites yet</p>
        <p className="mt-1 text-sm text-text-tertiary text-center max-w-sm">
          Tap the heart icon on sounds and collections to save them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
          <Heart size={18} className="text-accent-red" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Favorites</h1>
          <p className="text-sm text-text-tertiary">Your saved sounds and collections</p>
        </div>
      </div>

      {favoriteSounds.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Music size={14} className="text-accent-light" />
            <h2 className="text-sm font-semibold text-text-primary">Sounds</h2>
            <span className="text-[10px] text-text-tertiary">({favoriteSounds.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {favoriteSounds.map((sound) => (
              <SoundCard key={sound.id} {...sound} />
            ))}
          </div>
        </section>
      )}

      {favoriteCollections.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark size={14} className="text-accent-light" />
            <h2 className="text-sm font-semibold text-text-primary">Collections</h2>
            <span className="text-[10px] text-text-tertiary">({favoriteCollections.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteCollections.map((col) => (
              <CollectionCard key={col.id} {...col} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

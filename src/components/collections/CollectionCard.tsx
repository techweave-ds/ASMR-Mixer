"use client"

import { Play, Heart, Clock, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore, useFavoritesStore } from "@/store"

interface CollectionCardProps {
  id: string
  title: string
  description: string
  gradient: string
  duration: number
  coverUrl?: string
  tags: string[]
  soundIds: string[]
  isPremium?: boolean
  className?: string
}

export function CollectionCard({
  id,
  title,
  description,
  gradient,
  duration,
  coverUrl,
  tags,
  soundIds,
  isPremium,
  className,
}: CollectionCardProps) {
  const { playSound } = useAudioStore()
  const { isCollectionFavorited, toggleCollection } = useFavoritesStore()
  const favorited = isCollectionFavorited(id)

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m} min`
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    soundIds.forEach((sid) => playSound(sid))
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 card-shadow-hover",
        className
      )}
    >
      {/* Artwork */}
      <div
        className={cn("relative aspect-[3/2] bg-gradient-to-br", gradient)}
        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
              <Music size={9} />
              {soundIds.length} sounds
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
              <Clock size={9} />
              {formatDuration(duration)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Play size={16} />
        </button>

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleCollection(id) }}
          className={cn(
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
            favorited
              ? "text-accent-red bg-black/40"
              : "text-white/60 bg-black/20 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/40"
          )}
        >
          <Heart size={13} fill={favorited ? "currentColor" : "none"} />
        </button>

        {isPremium && (
          <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
            Premium
          </div>
        )}
      </div>
    </div>
  )
}

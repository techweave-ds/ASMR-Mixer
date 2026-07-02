"use client"

import { Play, Pause, Heart, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore, useFavoritesStore } from "@/store"

interface SoundCardProps {
  id: string
  title: string
  description: string
  gradient: string
  duration: number
  coverUrl?: string
  isPremium?: boolean
  className?: string
  onClick?: () => void
}

export function SoundCard({
  id,
  title,
  description,
  gradient,
  duration,
  coverUrl,
  isPremium,
  className,
  onClick,
}: SoundCardProps) {
  const { isSoundPlaying, toggleSound } = useAudioStore()
  const { isSoundFavorited, toggleSound: toggleFav } = useFavoritesStore()
  const playing = isSoundPlaying(id)
  const favorited = isSoundFavorited(id)

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m} min`
  }

  const handleClick = () => {
    if (onClick) onClick()
    else toggleSound(id)
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 card-shadow-hover",
        className
      )}
      onClick={handleClick}
    >
      {/* Artwork */}
      <div
        className={cn("relative aspect-square bg-gradient-to-br", gradient)}
        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSound(id) }}
          className={cn(
            "absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-all duration-300",
            playing
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95"
          )}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Playing indicator */}
        {playing && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="text-[9px] font-medium text-accent-lighter/90">Playing</span>
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFav(id) }}
          className={cn(
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
            favorited
              ? "text-accent-red bg-black/40"
              : "text-white/60 bg-black/20 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/40"
          )}
        >
          <Heart size={13} fill={favorited ? "currentColor" : "none"} />
        </button>

        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
            Premium
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-text-primary truncate">{title}</h3>
        <p className="text-xs text-text-tertiary truncate mt-0.5">{description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-text-quaternary">
            <Clock size={9} />
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

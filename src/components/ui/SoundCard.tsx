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
  id, title, description, gradient = "from-gray-800/30 to-gray-900/30", duration = 0, coverUrl, isPremium, className, onClick,
}: SoundCardProps) {
  const toggleSound = useAudioStore((s) => s.toggleSound)
  const isSoundPlaying = useAudioStore((s) => s.isSoundPlaying)
  const toggleFav = useFavoritesStore((s) => s.toggleSound)
  const isSoundFavorited = useFavoritesStore((s) => s.isSoundFavorited)
  const playing = isSoundPlaying(id)
  const favorited = isSoundFavorited(id)

  const safeTitle = title || id.replace(/-/g, " ")
  const safeDesc = description || "Ambient soundscape"
  const safeCover = coverUrl || undefined

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  }

  return (
    <div className={cn("group cursor-pointer", className)} onClick={() => onClick ? onClick() : toggleSound(id)}>
      {/* Artwork */}
      <div className={cn("relative aspect-square rounded-xl bg-gradient-to-br overflow-hidden card-hover", gradient)}
        style={safeCover ? { backgroundImage: `url(${safeCover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        {playing && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="text-[9px] font-medium text-accent-lighter/90">Playing</span>
          </div>
        )}
        {isPremium && !playing && (
          <div className="absolute top-2 left-2 rounded-full bg-glass backdrop-blur-sm border border-[rgba(123,92,255,0.3)] px-2 py-0.5 text-[8px] font-bold text-accent-secondary uppercase tracking-wider">
            Premium
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); toggleSound(id) }}
          className={cn(
            "absolute bottom-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-all duration-300",
            playing ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:scale-105 active:scale-95"
          )}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleFav(id) }}
          className={cn(
            "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
            favorited ? "text-accent-red bg-black/40" : "text-white/60 bg-black/20 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/40"
          )}>
          <Heart size={13} fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>
      {/* Info */}
      <div className="pt-2.5">
        <h3 className="text-sm font-medium text-text-primary truncate">{safeTitle}</h3>
        <p className="text-xs text-text-tertiary truncate mt-0.5">{safeDesc}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-[11px] text-text-quaternary">
            <Clock size={10} />
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

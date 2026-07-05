"use client"

import { useState } from "react"
import { Play, Pause, Heart, Clock, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore, useFavoritesStore, useEntitlementStore } from "@/store"
import { useToastStore } from "@/store/toast-store"
import { categoryLabels } from "@/data/sounds"

interface SoundCardProps {
  id: string
  title: string
  description: string
  gradient: string
  duration: number
  category?: string
  coverUrl?: string
  isPremium?: boolean
  className?: string
  onClick?: () => void
}

export function SoundCard({
  id, title, description, gradient = "from-gray-800/30 to-gray-900/30", duration = 0, category, coverUrl, isPremium, className, onClick,
}: SoundCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const toggleSound = useAudioStore((s) => s.toggleSound)
  const isSoundPlaying = useAudioStore((s) => s.isSoundPlaying)
  const toggleFav = useFavoritesStore((s) => s.toggleSound)
  const isSoundFavorited = useFavoritesStore((s) => s.isSoundFavorited)
  const isPremiumUser = useEntitlementStore((s) => s.isPremium)
  const addToast = useToastStore((s) => s.addToast)
  const playing = isSoundPlaying(id)
  const favorited = isSoundFavorited(id)
  const locked = Boolean(isPremium) && !isPremiumUser

  const handlePlayClick = () => {
    if (locked) {
      addToast({
        type: "info",
        title: "Premium sound",
        description: "Upgrade to Noctune Premium to unlock this soundscape.",
      })
      return
    }
    toggleSound(id)
  }

  const safeTitle = title || id.replace(/-/g, " ")
  const safeDesc = description || "Ambient soundscape"
  const safeCover = !imgFailed ? coverUrl || undefined : undefined

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  }

  return (
    <div
      className={cn("group cursor-pointer", className)}
      onClick={() => onClick ? onClick() : handlePlayClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        boxShadow: hovered ? "0 12px 40px rgba(90, 124, 255, 0.15)" : "none",
      }}
    >
      {/* Artwork */}
      <div
        className={cn("relative aspect-square rounded-xl bg-gradient-to-br overflow-hidden", gradient)}
        style={{
          ...(safeCover ? { backgroundImage: `url(${safeCover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
          transform: hovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: safeCover ? "brightness(1.08) contrast(1.03)" : "none",
        }}
      >
        {coverUrl && !imgFailed && (
          <img src={coverUrl} alt="" className="hidden" onError={() => setImgFailed(true)} loading="lazy" />
        )}
        <div className={cn("absolute inset-0 transition-colors duration-300", locked ? "bg-black/40" : "bg-black/0 group-hover:bg-black/10")} />
        {playing && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="text-[9px] font-medium text-accent-lighter/90">Playing</span>
          </div>
        )}
        {isPremium && !playing && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-400/30 px-2 py-0.5 shadow-lg shadow-amber-500/10">
            <Sparkles size={8} className="text-amber-400" />
            <span className="text-[8px] font-bold text-amber-300 uppercase tracking-wider" aria-label="Premium sound, requires subscription">Premium</span>
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); handlePlayClick() }}
          aria-label={locked ? "Premium sound, requires subscription" : playing ? "Pause" : "Play"}
          className={cn(
            "absolute bottom-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full shadow-xl transition-all duration-300",
            locked ? "bg-bg-elevated text-accent-secondary opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100" : "bg-accent text-white",
            !locked && (playing ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 active:scale-95")
          )}>
          {locked ? <Lock size={15} /> : playing ? <Pause size={16} /> : <Play size={16} />}
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
          {category && categoryLabels[category] && (
            <span className="text-[10px] text-text-quaternary/60">· {categoryLabels[category]}</span>
          )}
        </div>
      </div>
    </div>
  )
}

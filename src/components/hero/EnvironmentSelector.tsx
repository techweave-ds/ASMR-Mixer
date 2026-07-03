"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const ENVIRONMENTS = [
  { id: "rainforest" as const, label: "Rainforest", icon: "🌧", sound: "rain", color: "#60A5FA" },
  { id: "forest" as const, label: "Forest", icon: "🌲", sound: "forest", color: "#34D399" },
  { id: "ocean" as const, label: "Ocean", icon: "🌊", sound: "ocean", color: "#93C5FD" },
  { id: "campfire" as const, label: "Campfire", icon: "🔥", sound: "campfire", color: "#F59E0B" },
  { id: "snow" as const, label: "Snowfall", icon: "❄", sound: "snow", color: "#E2E8F0" },
  { id: "night" as const, label: "Night Sky", icon: "🌙", sound: "night", color: "#A78BFA" },
  { id: "desert" as const, label: "Desert", icon: "☀", sound: "desert", color: "#FCD34D" },
]

interface EnvCarouselProps {
  active: string
  onChange: (id: "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert") => void
}

export function EnvironmentSelector({ active, onChange }: EnvCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null!)
  const [showControls, setShowControls] = useState(false)

  const scroll = (dir: number) => {
    scrollRef.current.scrollBy({ left: dir * 180, behavior: "smooth" })
  }

  return (
    <div className="relative w-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      {/* Left arrow */}
      <button onClick={() => scroll(-1)}
        className={cn("absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <ChevronLeft size={14} />
      </button>

      {/* Carousel */}
      <div ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}>
        {ENVIRONMENTS.map((env) => (
          <button key={env.id} onClick={() => onChange(env.id as "rainforest" | "forest" | "ocean" | "campfire" | "snow" | "night" | "desert")}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-medium snap-start transition-all duration-300",
              active === env.id
                ? "border-white/30 bg-white/10 text-white shadow-lg shadow-white/5"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.06]"
            )}
            style={{
              boxShadow: active === env.id ? `0 0 20px ${env.color}22` : "none"
            }}>
            <span className="text-sm">{env.icon}</span>
            <span>{env.label}</span>
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button onClick={() => scroll(1)}
        className={cn("absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

"use client"

import { useRef, useState } from "react"
import { Compass, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useScrollScrolled } from "@/hooks/useScrollContainer"

export function ExploreButton() {
  const router = useRouter()
  const ref = useRef<HTMLButtonElement>(null!)
  const scrolled = useScrollScrolled(80)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      ref={ref}
      onClick={() => router.push("/explore")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed z-50 flex items-center gap-2 font-medium transition-all duration-500",
        scrolled
          ? "bottom-6 right-6 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-3 py-2.5 shadow-lg"
          : "bottom-12 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-2.5 shadow-xl"
      )}
      style={{
        transform: scrolled
          ? `translateX(0) scale(${hovered ? 1.05 : 1})`
          : `translateX(-50%) scale(${hovered ? 1.03 : 1})`,
        boxShadow: hovered ? "0 0 20px color-mix(in srgb, var(--color-accent-primary) 15%, transparent)" : "none",
      }}
    >
      <Compass size={16} className={cn("text-accent-light transition-all", scrolled ? "" : "animate-pulse")} />
      <span className={cn("text-white/80 text-xs", scrolled ? "max-w-[0px] overflow-hidden opacity-0" : "max-w-[80px]")}
        style={{
          transition: hovered ? "max-width 0.3s, opacity 0.3s" : "max-width 0.3s 0.1s, opacity 0.2s 0.1s",
          maxWidth: scrolled ? (hovered ? "80px" : "0px") : "80px",
          opacity: scrolled ? (hovered ? 1 : 0) : 1,
        }}>
        Explore
      </span>
      {scrolled && (
        <ChevronRight size={14} className="text-accent-light transition-all"
          style={{ opacity: hovered ? 1 : 0, width: hovered ? 14 : 0 }} />
      )}
    </button>
  )
}

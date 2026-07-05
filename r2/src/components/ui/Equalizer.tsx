"use client"

import { useMemo } from "react"
import { useAudioStore } from "@/store"
import { cn } from "@/lib/utils"

export function Equalizer({ className, size = "sm" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const heights = size === "sm" ? "h-4" : size === "md" ? "h-6" : "h-8"
  const widths = size === "sm" ? "w-[2px]" : "w-[3px]"
  const count = size === "sm" ? 5 : 7

  const bars = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      animName: `eqBar${(i % 5) + 1}`,
      delay: `${i * 0.08}s`,
    })),
    [count]
  )

  return (
    <div className={cn("flex items-end gap-[2px]", heights, className)}>
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={cn("rounded-full bg-accent-light/70 transition-all", widths, isPlaying ? "" : "opacity-20")}
          style={{
            animation: isPlaying ? `${bar.animName} 0.8s ease-in-out infinite` : "none",
            animationDelay: bar.delay,
            height: isPlaying ? "100%" : "40%",
          }}
        />
      ))}
    </div>
  )
}

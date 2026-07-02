"use client"

import { useMemo } from "react"
import { useAudioStore } from "@/store"

export function Waveform() {
  const isPlaying = useAudioStore((s) => s.isPlaying)

  const bars = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      height: 20 + ((i * 13 + 7) % 60),
      duration: 0.6 + ((i * 7 + 3) % 40) / 100,
    })),
  [])

  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`eq-bar w-[2px] rounded-full bg-accent-light/60 ${
            isPlaying ? "" : "opacity-20"
          }`}
          style={{
            height: `${bar.height}%`,
            animationDuration: `${bar.duration}s`,
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        />
      ))}
    </div>
  )
}

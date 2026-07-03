"use client"

import { useState, useCallback } from "react"
import { GripVertical, X, Copy, Volume2, Headphones } from "lucide-react"
import { Reorder } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { getSoundById } from "@/data/sounds"
import { Slider } from "@/components/ui/Slider"

export function QueuePanel() {
  const isPlayingSounds = useAudioStore((s) => s.isPlayingSounds)
  const stopSound = useAudioStore((s) => s.stopSound)
  const setVolume = useAudioStore((s) => s.setVolume)
  const toggleSound = useAudioStore((s) => s.toggleSound)
  const [queue, setQueue] = useState<string[]>(() => Array.from(isPlayingSounds))

  const sounds = queue.map((id) => ({ id, sound: getSoundById(id) })).filter((s) => s.sound)

  const remove = useCallback((id: string) => {
    setQueue((prev) => prev.filter((s) => s !== id))
    stopSound(id)
  }, [stopSound])

  const duplicate = useCallback((id: string) => {
    setQueue((prev) => [...prev, id])
    toggleSound(id)
  }, [toggleSound])

  if (sounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted">
        <Headphones size={28} className="mb-3 opacity-30" />
        <p className="text-xs font-medium text-text-secondary">No sounds in queue</p>
        <p className="text-[10px] mt-1">Play sounds to build your queue</p>
      </div>
    )
  }

  return (
    <Reorder.Group axis="y" values={queue} onReorder={setQueue} className="flex flex-col gap-1">
      {sounds.map((item, i) => {
        const playing = isPlayingSounds.has(item.id)
        return (
          <Reorder.Item key={item.id} value={item.id}
            className="group flex items-center gap-2 rounded-xl bg-glass border border-border-subtle px-3 py-2 transition-all hover:border-border cursor-grab active:cursor-grabbing">
            <GripVertical size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
            <div className={cn("h-7 w-7 rounded-lg shrink-0 flex items-center justify-center",
              playing ? "bg-accent/15" : "bg-glass")}>
              <span className={cn("text-[9px] font-medium", playing ? "text-accent" : "text-text-muted")}>{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{item.sound?.title}</p>
              <p className="text-[10px] text-text-muted truncate capitalize">{item.sound?.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={11} className="text-text-muted shrink-0" />
              <Slider value={0.5} onChange={(v) => setVolume(item.id, v)} size="sm" className="w-16" />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => duplicate(item.id)}
                className="h-6 w-6 rounded-lg text-text-muted hover:text-text-secondary hover:bg-glass-hover flex items-center justify-center transition-all">
                <Copy size={11} />
              </button>
              <button onClick={() => remove(item.id)}
                className="h-6 w-6 rounded-lg text-text-muted hover:text-accent-red hover:bg-red-500/10 flex items-center justify-center transition-all">
                <X size={11} />
              </button>
            </div>
          </Reorder.Item>
        )
      })}
    </Reorder.Group>
  )
}

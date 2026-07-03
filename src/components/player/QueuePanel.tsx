"use client"

import { useState } from "react"
import { GripVertical, X, Copy, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store"
import { getSoundById } from "@/data/sounds"

export function QueuePanel() {
  const isPlayingSounds = useAudioStore((s) => s.isPlayingSounds)
  const stopSound = useAudioStore((s) => s.stopSound)
  const [queue, setQueue] = useState<string[]>(() => Array.from(isPlayingSounds))

  const sounds = queue.map((id) => ({ id, sound: getSoundById(id) })).filter((s) => s.sound)

  const remove = (id: string) => {
    setQueue((prev) => prev.filter((s) => s !== id))
    stopSound(id)
  }

  const duplicate = (id: string) => {
    setQueue((prev) => [...prev, id])
  }

  const move = (from: number, to: number) => {
    const next = [...queue]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setQueue(next)
  }

  return (
    <div className="flex flex-col gap-1">
      {sounds.length === 0 && (
        <p className="text-xs text-text-muted text-center py-8">No sounds in queue</p>
      )}
      {sounds.map((item, i) => (
        <div key={`${item.id}-${i}`}
          className="group flex items-center gap-2 rounded-xl bg-glass border border-border-subtle px-3 py-2 transition-all hover:border-border">
          <GripVertical size={12} className="text-text-muted cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          <div className="h-7 w-7 rounded-lg bg-accent/10 shrink-0 flex items-center justify-center">
            <span className="text-[9px] text-accent font-medium">{i + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{item.sound?.title}</p>
            <p className="text-[10px] text-text-muted truncate">{item.sound?.category}</p>
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
        </div>
      ))}
    </div>
  )
}

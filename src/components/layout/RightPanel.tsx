"use client"

import { useState } from "react"
import {
  Volume2, VolumeX, Timer, X, Plus,
  Trash2, ChevronRight, Save, Disc3,
  Headphones
} from "lucide-react"
import { useAudioStore, useMixerStore, useUiStore } from "@/store"
import { Slider } from "@/components/ui/Slider"
import { cn } from "@/lib/utils"
import { Equalizer } from "@/components/ui/Equalizer"
import { sounds, getSoundById } from "@/data/sounds"

const TIMER_OPTIONS = [15, 30, 45, 60, 120]

export function RightPanel() {
  const { rightPanelOpen, setRightPanelOpen } = useUiStore()
  const { layers, masterVolume, setMasterVolume, removeLayer, setLayerVolume, toggleMute } = useMixerStore()
  const { isPlayingSounds, toggleSound, timerMinutes, setTimer, cancelTimer } = useAudioStore()
  const [showTimer, setShowTimer] = useState(false)
  const [showAddPanel, setShowAddPanel] = useState(false)

  const activeLayerCount = layers.filter(l => {
    const sd = getSoundById(l.soundId)
    return sd && isPlayingSounds.has(l.soundId)
  }).length

  if (!rightPanelOpen) {
    return (
      <button
        onClick={() => setRightPanelOpen(true)}
        className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:flex h-12 w-7 items-center justify-center rounded-l-xl border border-border bg-[#0c0c14]/90 backdrop-blur-xl text-text-tertiary hover:text-text-secondary"
      >
        <ChevronRight size={14} />
      </button>
    )
  }

  const availableSounds = sounds.filter((s) => !layers.some((l) => l.soundId === s.id))

  return (
    <aside className="hidden w-[340px] flex-shrink-0 border-l border-border-subtle bg-[#0c0c14]/60 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Disc3 size={14} className="text-accent-light" />
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Current Mix</h2>
            <p className="text-[11px] text-text-tertiary">
              {layers.length > 0 ? `${activeLayerCount}/${layers.length} active` : "Empty"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setRightPanelOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-quaternary transition-colors hover:bg-glass-hover hover:text-text-secondary"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
            <Headphones size={40} className="mb-4 opacity-30" />
            <p className="text-sm font-medium text-text-secondary">No sounds yet</p>
            <p className="mt-1 text-xs text-text-tertiary text-center max-w-[200px]">
              Add sounds from the home or mixer to build your ambiance
            </p>
            <button
              onClick={() => setShowAddPanel(true)}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-accent/10 px-4 py-2 text-xs font-medium text-accent-light transition-colors hover:bg-accent/20"
            >
              <Plus size={12} />
              Browse Sounds
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                <Disc3 size={16} className="text-accent-light" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">Current Session</p>
                <p className="text-[10px] text-text-tertiary">{layers.length} layer{layers.length > 1 ? 's' : ''}</p>
              </div>
              <button className="flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-[10px] font-medium text-accent-light transition-colors hover:bg-accent/20">
                <Save size={10} />
                Save
              </button>
            </div>

            {layers.map((layer) => {
              const sound = getSoundById(layer.soundId)
              if (!sound) return null
              const isAudible = !layer.isMuted

              return (
                <div
                  key={layer.soundId}
                  className={cn(
                    "rounded-2xl border p-3.5 transition-all duration-200",
                    isAudible
                      ? "border-border-subtle bg-glass"
                      : "border-border-subtle/50 bg-glass/50 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br overflow-hidden", sound.gradient)}
                      style={sound.coverUrl ? { backgroundImage: `url(${sound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">{sound.title}</p>
                      <p className="text-[10px] text-text-tertiary capitalize">{sound.category}</p>
                    </div>
                    {isPlayingSounds.has(layer.soundId) && <Equalizer size="sm" />}
                    <button
                      onClick={() => { removeLayer(layer.soundId); if (isPlayingSounds.has(layer.soundId)) toggleSound(layer.soundId) }}
                      className="flex h-6 w-6 items-center justify-center rounded-lg text-text-quaternary transition-colors hover:bg-red-500/10 hover:text-accent-red"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => toggleMute(layer.soundId)}
                      className={cn("rounded-lg p-1 transition-colors", layer.isMuted ? "text-accent-red" : "text-text-quaternary hover:text-text-secondary")}
                    >
                      {layer.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <Slider
                      value={layer.volume}
                      onChange={(v) => setLayerVolume(layer.soundId, v)}
                      size="sm"
                      className="flex-1"
                    />
                    <span className="w-8 text-right text-[10px] text-text-quaternary">{Math.round(layer.volume * 100)}%</span>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {availableSounds.length > 0 && layers.length > 0 && (
          <button
            onClick={() => setShowAddPanel(!showAddPanel)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-3 text-xs font-medium transition-all",
              showAddPanel
                ? "border-accent/30 bg-accent/5 text-accent-light"
                : "border-border-subtle text-text-tertiary hover:border-border-hover hover:text-text-secondary"
            )}
          >
            <Plus size={14} />
            Add Sound
          </button>
        )}
      </div>

      <div className="border-t border-border-subtle p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Volume2 size={14} className="text-text-quaternary" />
          <Slider value={masterVolume} onChange={setMasterVolume} size="sm" className="flex-1" />
          <span className="w-8 text-right text-[10px] text-text-quaternary">{Math.round(masterVolume * 100)}%</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowTimer(!showTimer)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border py-2.5 px-4 text-xs font-medium transition-all",
              timerMinutes
                ? "border-accent/20 bg-accent/5 text-accent-light"
                : "border-border-subtle text-text-tertiary hover:border-border-hover hover:text-text-secondary"
            )}
          >
            <Timer size={14} />
            {timerMinutes ? `Sleep Timer • ${timerMinutes} min` : "Sleep Timer"}
            {timerMinutes && (
              <button onClick={(e) => { e.stopPropagation(); cancelTimer() }} className="ml-auto text-text-quaternary hover:text-text-secondary">
                <X size={12} />
              </button>
            )}
          </button>
          {showTimer && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-border bg-[#0c0c14]/95 p-3 backdrop-blur-2xl">
              <div className="flex flex-wrap gap-1.5">
                {TIMER_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setTimer(timerMinutes === m ? null : m); setShowTimer(false) }}
                    className={cn(
                      "flex-1 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                      timerMinutes === m
                        ? "bg-accent/15 text-accent-light"
                        : "bg-glass text-text-tertiary hover:bg-glass-hover hover:text-text-secondary"
                    )}
                  >
                    {m >= 60 ? `${m / 60}h` : `${m}m`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

"use client"

import { useState } from "react"
import {
  Volume2, VolumeX, Timer, X,
  Trash2, Save, Disc3, Headphones, ListMusic
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAudioStore, useMixerStore, useUiStore } from "@/store"
import { Slider } from "@/components/ui/Slider"
import { cn } from "@/lib/utils"
import { Equalizer } from "@/components/ui/Equalizer"
import { getSoundById } from "@/data/sounds"
import { useStoreHydration } from "@/hooks/useStoreHydration"

const TIMER_OPTIONS = [15, 30, 45, 60, 120]

export function RightPanel() {
  const hydrated = useStoreHydration()
  const { rightPanelOpen, setRightPanelOpen } = useUiStore()
  const { layers, masterVolume, setMasterVolume, removeLayer, setLayerVolume, toggleMute } = useMixerStore()
  const { isPlayingSounds, toggleSound, timerMinutes, timerRemaining, setTimer, cancelTimer } = useAudioStore()
  const [showTimer, setShowTimer] = useState(false)

  const activeLayerCount = layers.filter(l => {
    const sd = getSoundById(l.soundId)
    return sd && isPlayingSounds.has(l.soundId)
  }).length

  if (!hydrated) return null

  const panel = (
    <>
      <div className="flex items-center justify-between h-[68px] px-5 border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Disc3 size={14} className="text-accent-light" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Current Mix</h2>
            <p className="text-[11px] text-text-tertiary">
              {layers.length > 0 ? `${activeLayerCount}/${layers.length} active` : "Empty"}
            </p>
          </div>
        </div>
        <button onClick={() => setRightPanelOpen(false)}
          className="h-7 w-7 rounded-lg text-text-quaternary hover:text-text-secondary hover:bg-glass-hover transition-colors flex items-center justify-center">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
            <Headphones size={36} className="mb-4 opacity-30" />
            <p className="text-sm font-medium text-text-secondary">Your mix is empty</p>
            <p className="text-xs text-text-tertiary mt-1 text-center max-w-[180px]">
              Play sounds from the home or explore pages to build your mix
            </p>
          </div>
        ) : (
          layers.map((layer) => {
            const sound = getSoundById(layer.soundId)
            if (!sound) return null
            const isAudible = !layer.isMuted
            return (
              <div key={layer.soundId}
                className={cn(
                  "rounded-2xl border p-3 transition-all",
                  isAudible ? "border-border-subtle bg-glass" : "border-border-subtle/50 bg-glass/50 opacity-50"
                )}>
                <div className="flex items-center gap-3">
                  <div className={cn("h-9 w-9 flex-shrink-0 rounded-lg bg-gradient-to-br overflow-hidden", sound.gradient)}
                    style={sound.coverUrl ? { backgroundImage: `url(${sound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{sound.title}</p>
                    <p className="text-[10px] text-text-tertiary capitalize">{sound.category}</p>
                  </div>
                  {isPlayingSounds.has(layer.soundId) && <Equalizer size="sm" />}
                  <button onClick={() => { removeLayer(layer.soundId); if (isPlayingSounds.has(layer.soundId)) toggleSound(layer.soundId) }}
                    className="h-6 w-6 rounded-lg text-text-quaternary hover:text-accent-red hover:bg-red-500/10 transition-colors flex items-center justify-center">
                    <Trash2 size={11} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => toggleMute(layer.soundId)}
                    className={cn("rounded-lg p-1 transition-colors", layer.isMuted ? "text-accent-red" : "text-text-quaternary hover:text-text-secondary")}>
                    {layer.isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>
                  <Slider value={layer.volume} onChange={(v) => setLayerVolume(layer.soundId, v)} size="sm" className="flex-1" />
                  <span className="w-7 text-right text-[10px] text-text-quaternary">{Math.round(layer.volume * 100)}%</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-border-subtle p-4 space-y-3 flex-shrink-0">
        {layers.length > 0 && (
          <div className="flex items-center gap-3">
            <Volume2 size={14} className="text-text-quaternary" />
            <Slider value={masterVolume} onChange={setMasterVolume} size="sm" className="flex-1" />
            <span className="w-7 text-right text-[10px] text-text-quaternary">{Math.round(masterVolume * 100)}%</span>
          </div>
        )}
        {layers.length > 0 && (
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent/10 py-2.5 text-xs font-medium text-accent-light hover:bg-accent/20 transition-colors">
            <Save size={12} />
            Save Mix
          </button>
        )}
        <div className="relative">
          <button onClick={() => setShowTimer(!showTimer)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl border py-2.5 px-4 text-xs font-medium transition-all",
              timerMinutes ? "border-accent/20 bg-accent/5 text-accent-light" : "border-border-subtle text-text-tertiary hover:border-border"
            )}>
            <Timer size={13} />
            {timerMinutes && timerRemaining && timerRemaining > 0
            ? `Timer • ${Math.floor(timerRemaining / 60)}:${String(timerRemaining % 60).padStart(2, '0')}`
            : "Sleep Timer"}
            {timerMinutes && (
              <button onClick={(e) => { e.stopPropagation(); cancelTimer() }} className="ml-auto text-text-quaternary hover:text-text-secondary">
                <X size={11} />
              </button>
            )}
          </button>
          {showTimer && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-border bg-bg-elevated p-3 shadow-2xl">
              <div className="flex flex-wrap gap-1.5">
                {TIMER_OPTIONS.map((m) => (
                  <button key={m} onClick={() => { setTimer(timerMinutes === m ? null : m); setShowTimer(false) }}
                    className={cn("flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      timerMinutes === m ? "bg-accent/15 text-accent-light" : "bg-glass text-text-tertiary hover:bg-glass-hover"
                    )}>
                    {m >= 60 ? `${m / 60}h` : `${m}m`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Closed state: floating reopen tab (desktop only) */}
      {!rightPanelOpen && (
        <button onClick={() => setRightPanelOpen(true)}
          className="fixed right-0 top-1/2 z-30 -translate-y-1/2 hidden lg:flex h-12 w-7 items-center justify-center rounded-l-lg bg-bg-secondary border border-border-subtle border-r-0 text-text-tertiary hover:text-text-secondary transition-all hover:border-accent/30">
          <ListMusic size={13} />
        </button>
      )}

      {/* Desktop panel */}
      {rightPanelOpen && (
        <aside className="w-[360px] flex-shrink-0 flex flex-col bg-bg-secondary border-l border-border-subtle rounded-3xl hidden lg:flex">
          {panel}
        </aside>
      )}

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {rightPanelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setRightPanelOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-bg-secondary rounded-t-3xl border-t border-border-subtle max-h-[70vh] lg:hidden">
              <div className="flex justify-center pt-2 pb-1">
                <div className="h-1 w-10 rounded-full bg-border" />
              </div>
              {panel}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

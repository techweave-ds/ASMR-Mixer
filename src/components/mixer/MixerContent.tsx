"use client"

import { useState } from "react"
import {
  Volume2, VolumeX, Trash2, Save, Plus,
  Layers, Headphones
} from "lucide-react"
import { useMixerStore, useAudioStore } from "@/store"
import { audioEngine } from "@/audio"
import { Slider } from "@/components/ui/Slider"
import { SoundCard } from "@/components/ui/SoundCard"
import { sounds, getSoundById } from "@/data/sounds"
import { cn } from "@/lib/utils"

export function MixerContent() {
  const { layers, masterVolume, setMasterVolume, addLayer, removeLayer, setLayerVolume, toggleMute, savePreset } = useMixerStore()
  const { toggleSound, isSoundPlaying } = useAudioStore()
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const hasSolo = layers.some((l) => l.isSolo)
  const availableSounds = sounds.filter((s) => !layers.some((l) => l.soundId === s.id))

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sound Mixer</h1>
          <p className="mt-1 text-sm text-text-tertiary">Layer multiple sounds to create your perfect ambience</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSaveDialog(true)} disabled={layers.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-glass px-4 py-2 text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-glass-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <Save size={14} />Save Mix
          </button>
          <button onClick={() => setShowAddPanel(!showAddPanel)} disabled={layers.length >= 10}
            className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-4 py-2 text-xs font-medium text-accent-light hover:bg-accent/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <Plus size={14} />Add Sound
          </button>
        </div>
      </div>

      {/* Master Channel */}
      <div className="rounded-xl border border-accent/10 bg-accent/5 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center"><Layers size={14} className="text-accent-light" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Master Channel</span>
              <span className="text-[10px] text-text-tertiary">{layers.length}/10 layers</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Volume2 size={14} className="text-text-quaternary" />
          <Slider value={masterVolume} onChange={setMasterVolume} className="flex-1" />
          <span className="text-[10px] text-text-quaternary w-8 text-right">{Math.round(masterVolume * 100)}%</span>
        </div>
      </div>

      {/* Empty State */}
      {layers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
          <Headphones size={44} className="mb-4 opacity-30" />
          <p className="text-base font-medium text-text-secondary">Your mix is empty</p>
          <p className="mt-1 text-sm">Click &ldquo;Add Sound&rdquo; to start layering</p>
          <button onClick={() => setShowAddPanel(true)}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-accent/10 px-4 py-2.5 text-xs font-medium text-accent-light hover:bg-accent/20 transition-colors">
            <Plus size={14} />Browse All Sounds
          </button>
        </div>
      )}

      {/* Layer List */}
      <div className="space-y-2">
        {layers.map((layer) => {
          const sound = getSoundById(layer.soundId)
          if (!sound) return null
          const isAudible = layer.isMuted || (hasSolo && !layer.isSolo) ? false : true
          return (
              <div key={layer.soundId}
              className={cn("flex items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 transition-all",
                isAudible ? "border-border-subtle bg-glass" : "border-border-subtle/50 bg-glass/50 opacity-50")}>
              <div className={cn("h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br overflow-hidden", sound.gradient)}
                style={sound.coverUrl ? { backgroundImage: `url(${sound.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium truncate", isAudible ? "text-text-primary" : "text-text-tertiary")}>{sound.title}</p>
                <p className="text-xs text-text-tertiary truncate capitalize">{sound.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <Slider value={layer.volume} onChange={(v) => setLayerVolume(layer.soundId, v)} size="sm" className="w-20 sm:w-28" />
                <span className="text-[10px] text-text-quaternary w-8 text-right">{Math.round(layer.volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => {
                  const willMute = !layer.isMuted
                  toggleMute(layer.soundId)
                  if (isSoundPlaying(layer.soundId)) {
                    audioEngine.setSoundVolume(layer.soundId, willMute ? 0 : layer.volume)
                  }
                }}
                  className={cn("rounded-lg p-1.5 transition-colors", layer.isMuted ? "bg-red-500/20 text-accent-red" : "text-text-quaternary hover:text-text-secondary")}>
                  {layer.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button onClick={() => { if (isSoundPlaying(layer.soundId)) toggleSound(layer.soundId); removeLayer(layer.soundId) }}
                  className="rounded-lg p-1.5 text-text-quaternary hover:text-accent-red transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Sound Panel */}
      {showAddPanel && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary">Add sounds to your mix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {availableSounds.map((sound) => (
              <div key={sound.id} className="relative">
                <SoundCard {...sound} />
                <button onClick={() => { addLayer(sound.id); toggleSound(sound.id); setShowAddPanel(false) }}
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                    <Plus size={12} />Add
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-3xl border border-border bg-bg-elevated p-6 shadow-2xl">
            <h3 className="mb-1 text-base font-semibold text-text-primary">Save Mix</h3>
            <p className="mb-4 text-xs text-text-tertiary">Save your current layer configuration</p>
            <input type="text" placeholder="Mix name..." value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full rounded-lg border border-border bg-glass px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-quaternary focus:border-accent/50 mb-4" autoFocus />
            <div className="flex gap-2">
              <button onClick={() => { if (presetName.trim()) savePreset(presetName.trim()); setShowSaveDialog(false); setPresetName("") }}
                className="flex-1 rounded-2xl bg-accent/15 py-2.5 text-sm font-medium text-accent-light hover:bg-accent/25 transition-colors">Save</button>
              <button onClick={() => setShowSaveDialog(false)}
                className="flex-1 rounded-2xl bg-glass py-2.5 text-sm font-medium text-text-tertiary hover:text-text-secondary hover:bg-glass-hover transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

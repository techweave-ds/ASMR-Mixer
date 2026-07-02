import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SoundLayer, MixPreset } from "@/types"

interface MixerState {
  layers: SoundLayer[]
  masterVolume: number
  presets: MixPreset[]
  activePresetId: string | null
}

interface MixerActions {
  addLayer: (soundId: string) => void
  removeLayer: (soundId: string) => void
  setLayerVolume: (soundId: string, volume: number) => void
  toggleMute: (soundId: string) => void
  toggleSolo: (soundId: string) => void
  setMasterVolume: (volume: number) => void
  savePreset: (name: string) => void
  loadPreset: (presetId: string) => void
  deletePreset: (presetId: string) => void
  renamePreset: (presetId: string, name: string) => void
  duplicatePreset: (presetId: string) => void
  resetMix: () => void
}

type MixerStore = MixerState & MixerActions

const MAX_LAYERS = 10

export const useMixerStore = create<MixerStore>()(
  persist(
    (set, get) => ({
      layers: [],
      masterVolume: 0.8,
      presets: [],
      activePresetId: null,

      addLayer: (soundId: string) => {
        const { layers } = get()
        if (layers.length >= MAX_LAYERS) return
        if (layers.some((l) => l.soundId === soundId)) return
        set({
          layers: [
            ...layers,
            { soundId, volume: 0.5, isMuted: false, isSolo: false, isLooping: true },
          ],
        })
      },

      removeLayer: (soundId: string) => {
        set({ layers: get().layers.filter((l) => l.soundId !== soundId) })
      },

      setLayerVolume: (soundId: string, volume: number) => {
        set({
          layers: get().layers.map((l) =>
            l.soundId === soundId ? { ...l, volume: Math.max(0, Math.min(1, volume)) } : l
          ),
        })
      },

      toggleMute: (soundId: string) => {
        set({
          layers: get().layers.map((l) =>
            l.soundId === soundId ? { ...l, isMuted: !l.isMuted } : l
          ),
        })
      },

      toggleSolo: (soundId: string) => {
        set({
          layers: get().layers.map((l) =>
            l.soundId === soundId ? { ...l, isSolo: !l.isSolo } : l
          ),
        })
      },

      setMasterVolume: (volume: number) => {
        set({ masterVolume: Math.max(0, Math.min(1, volume)) })
      },

      savePreset: (name: string) => {
        const { layers, masterVolume, presets } = get()
        const preset: MixPreset = {
          id: `preset-${Date.now()}`,
          name,
          layers: JSON.parse(JSON.stringify(layers)),
          masterVolume,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ presets: [...presets, preset], activePresetId: preset.id })
      },

      loadPreset: (presetId: string) => {
        const { presets } = get()
        const preset = presets.find((p) => p.id === presetId)
        if (preset) {
          set({
            layers: JSON.parse(JSON.stringify(preset.layers)),
            masterVolume: preset.masterVolume,
            activePresetId: presetId,
          })
        }
      },

      deletePreset: (presetId: string) => {
        set({ presets: get().presets.filter((p) => p.id !== presetId) })
      },

      renamePreset: (presetId: string, name: string) => {
        set({
          presets: get().presets.map((p) =>
            p.id === presetId ? { ...p, name, updatedAt: Date.now() } : p
          ),
        })
      },

      duplicatePreset: (presetId: string) => {
        const { presets } = get()
        const preset = presets.find((p) => p.id === presetId)
        if (preset) {
          const duplicate: MixPreset = {
            ...JSON.parse(JSON.stringify(preset)),
            id: `preset-${Date.now()}`,
            name: `${preset.name} (Copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set({ presets: [...presets, duplicate] })
        }
      },

      resetMix: () => {
        set({ layers: [], masterVolume: 0.8, activePresetId: null })
      },
    }),
    { name: "asmr-mixer-storage" }
  )
)

import { create } from "zustand"
import { audioEngine } from "@/audio"

interface PlayingState {
  currentSoundId: string | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  timerMinutes: number | null
  timerRemaining: number | null
  isPlayingSounds: Set<string>
}

interface AudioActions {
  toggleSound: (soundId: string) => Promise<void>
  playSound: (soundId: string) => Promise<void>
  stopSound: (soundId: string) => Promise<void>
  stopAll: () => void
  setVolume: (soundId: string, volume: number) => void
  setMasterVolume: (volume: number) => void
  setTimer: (minutes: number | null) => void
  cancelTimer: () => void
  isSoundPlaying: (soundId: string) => boolean
}

type AudioStore = PlayingState & AudioActions

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentSoundId: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  timerMinutes: null,
  timerRemaining: null,
  isPlayingSounds: new Set(),

  toggleSound: async (soundId: string) => {
    const { isPlayingSounds } = get()
    if (isPlayingSounds.has(soundId)) {
      await audioEngine.stopSound(soundId)
      const next = new Set(isPlayingSounds)
      next.delete(soundId)
      set({ isPlayingSounds: next, isPlaying: next.size > 0 })
    } else {
      await audioEngine.init()
      await audioEngine.playSound(soundId, get().volume)
      const next = new Set(isPlayingSounds)
      next.add(soundId)
      set({ isPlayingSounds: next, isPlaying: true, currentSoundId: soundId })
    }
  },

  playSound: async (soundId: string) => {
    await audioEngine.init()
    await audioEngine.playSound(soundId, get().volume)
    const next = new Set(get().isPlayingSounds)
    next.add(soundId)
    set({ isPlayingSounds: next, isPlaying: true, currentSoundId: soundId })
  },

  stopSound: async (soundId: string) => {
    await audioEngine.stopSound(soundId)
    const next = new Set(get().isPlayingSounds)
    next.delete(soundId)
    set({ isPlayingSounds: next, isPlaying: next.size > 0 })
  },

  stopAll: () => {
    audioEngine.stopAll()
    set({ isPlayingSounds: new Set(), isPlaying: false, currentSoundId: null })
  },

  setVolume: (soundId: string, volume: number) => {
    audioEngine.setSoundVolume(soundId, volume)
    set({ volume })
  },

  setMasterVolume: (volume: number) => {
    audioEngine.setMasterVolume(volume)
    set({ volume })
  },

  setTimer: (minutes: number | null) => {
    if (minutes) {
      audioEngine.setFadeTimer(minutes, () => {
        set({ isPlayingSounds: new Set(), isPlaying: false, timerRemaining: null, timerMinutes: null })
      })
    }
    set({ timerMinutes: minutes, timerRemaining: minutes ? minutes * 60 : null })
  },

  cancelTimer: () => {
    audioEngine.cancelFadeTimer()
    set({ timerMinutes: null, timerRemaining: null })
  },

  isSoundPlaying: (soundId: string) => {
    return get().isPlayingSounds.has(soundId)
  },
}))

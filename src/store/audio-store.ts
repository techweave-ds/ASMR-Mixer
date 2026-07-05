import { create } from "zustand"
import { audioEngine } from "@/audio"
import { getSoundById } from "@/data/sounds"
import { useEntitlementStore } from "./entitlement-store"
import { useToastStore } from "./toast-store"

function isLocked(soundId: string): boolean {
  const sound = getSoundById(soundId)
  if (!sound?.isPremium) return false
  return !useEntitlementStore.getState().isPremium
}

function notifyLocked() {
  useToastStore.getState().addToast({
    type: "info",
    title: "Premium sound",
    description: "Upgrade to Noctune Premium to unlock this soundscape.",
  })
}

interface PlayingState {
  currentSoundId: string | null
  isPlaying: boolean
  isPaused: boolean
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
  playSingle: (soundId: string) => Promise<void>
  stopSound: (soundId: string) => Promise<void>
  stopAll: () => void
  togglePause: () => void
  setVolume: (soundId: string, volume: number) => void
  setMasterVolume: (volume: number) => void
  setTimer: (minutes: number | null) => void
  cancelTimer: () => void
  isSoundPlaying: (soundId: string) => boolean
}

type AudioStore = PlayingState & AudioActions

let timerInterval: ReturnType<typeof setInterval> | null = null
let elapsedInterval: ReturnType<typeof setInterval> | null = null

function startElapsedTicker(set: (fn: (s: AudioStore) => Partial<AudioStore>) => void) {
  if (elapsedInterval) clearInterval(elapsedInterval)
  elapsedInterval = setInterval(() => {
    set((s) => ({ progress: s.duration > 0 ? (s.progress + 1) % s.duration : s.progress + 1 }))
  }, 1000)
}

function stopElapsedTicker() {
  if (elapsedInterval) { clearInterval(elapsedInterval); elapsedInterval = null }
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentSoundId: null,
  isPlaying: false,
  isPaused: false,
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
      const stillPlaying = next.size > 0
      if (!stillPlaying) stopElapsedTicker()
      set({ isPlayingSounds: next, isPlaying: stillPlaying, progress: stillPlaying ? get().progress : 0 })
      return
    }
    if (isLocked(soundId)) {
      notifyLocked()
      return
    }
    {
      await audioEngine.init()
      audioEngine.resume()
      await audioEngine.playSound(soundId, get().volume)
      const next = new Set(isPlayingSounds)
      const wasEmpty = isPlayingSounds.size === 0
      next.add(soundId)
      const sound = getSoundById(soundId)
      set({
        isPlayingSounds: next,
        isPlaying: true,
        isPaused: false,
        currentSoundId: soundId,
        duration: wasEmpty ? (sound?.duration ?? 0) : get().duration,
        progress: wasEmpty ? 0 : get().progress,
      })
      startElapsedTicker(set)
    }
  },

  playSound: async (soundId: string) => {
    if (isLocked(soundId)) { notifyLocked(); return }
    await audioEngine.init()
    audioEngine.resume()
    await audioEngine.playSound(soundId, get().volume)
    const next = new Set(get().isPlayingSounds)
    const wasEmpty = get().isPlayingSounds.size === 0
    next.add(soundId)
    const sound = getSoundById(soundId)
    set({
      isPlayingSounds: next,
      isPlaying: true,
      isPaused: false,
      currentSoundId: soundId,
      duration: wasEmpty ? (sound?.duration ?? 0) : get().duration,
      progress: wasEmpty ? 0 : get().progress,
    })
    startElapsedTicker(set)
  },

  playSingle: async (soundId: string) => {
    if (isLocked(soundId)) { notifyLocked(); return }
    const { isPlayingSounds } = get()
    if (isPlayingSounds.has(soundId)) return
    await audioEngine.init()
    audioEngine.resume()
    if (isPlayingSounds.size > 0) {
      for (const id of isPlayingSounds) {
        await audioEngine.stopSound(id)
      }
    }
    await audioEngine.playSound(soundId, get().volume)
    const next = new Set([soundId])
    const sound = getSoundById(soundId)
    set({
      isPlayingSounds: next,
      isPlaying: true,
      isPaused: false,
      currentSoundId: soundId,
      duration: sound?.duration ?? 0,
      progress: 0,
    })
    startElapsedTicker(set)
  },

  stopSound: async (soundId: string) => {
    await audioEngine.stopSound(soundId)
    const next = new Set(get().isPlayingSounds)
    next.delete(soundId)
    const stillPlaying = next.size > 0
    if (!stillPlaying) { stopElapsedTicker() }
    set({ isPlayingSounds: next, isPlaying: stillPlaying, progress: stillPlaying ? get().progress : 0 })
  },

  stopAll: () => {
    audioEngine.stopAll()
    stopElapsedTicker()
    set({ isPlayingSounds: new Set(), isPlaying: false, isPaused: false, progress: 0, currentSoundId: null })
  },

  togglePause: () => {
    const { isPaused, isPlaying } = get()
    if (!isPlaying && isPaused) {
      audioEngine.resume()
      startElapsedTicker(set)
      set({ isPlaying: true, isPaused: false })
    } else if (isPlaying) {
      audioEngine.suspend()
      stopElapsedTicker()
      set({ isPlaying: false, isPaused: true })
    }
  },

  setVolume: (soundId: string, volume: number) => {
    audioEngine.setSoundVolume(soundId, volume)
  },

  setMasterVolume: (volume: number) => {
    audioEngine.setMasterVolume(volume)
  },

  setTimer: (minutes: number | null) => {
    const { cancelTimer } = get()
    cancelTimer()

    if (minutes) {
      const endTime = Date.now() + minutes * 60 * 1000
      set({ timerMinutes: minutes, timerRemaining: minutes * 60 })

      timerInterval = setInterval(() => {
        const state = get()
        if (state.isPlayingSounds.size === 0) {
          if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
          set({ timerMinutes: null, timerRemaining: null })
          return
        }
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
        set({ timerRemaining: remaining })
        if (remaining <= 0) {
          if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
          audioEngine.fadeOutAll(30)
          set({ isPlayingSounds: new Set(), isPlaying: false, isPaused: false, timerMinutes: null, timerRemaining: null })
        }
      }, 1000)
    }
  },

  cancelTimer: () => {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
    audioEngine.cancelFadeTimer()
    set({ timerMinutes: null, timerRemaining: null })
  },



  isSoundPlaying: (soundId: string) => {
    return get().isPlayingSounds.has(soundId)
  },
}))

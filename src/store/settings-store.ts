import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  theme: "dark" | "light" | "system"
  crossfadeDuration: number
  defaultSleepTimer: number | null
  playbackQuality: "low" | "medium" | "high"
  notificationsEnabled: boolean
  dailyReminder: boolean
  reducedMotion: boolean
  language: string
}

interface SettingsActions {
  setTheme: (theme: "dark" | "light" | "system") => void
  setCrossfadeDuration: (duration: number) => void
  setDefaultSleepTimer: (minutes: number | null) => void
  setPlaybackQuality: (quality: "low" | "medium" | "high") => void
  setNotificationsEnabled: (enabled: boolean) => void
  setDailyReminder: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setLanguage: (language: string) => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "dark",
      crossfadeDuration: 2,
      defaultSleepTimer: null,
      playbackQuality: "high",
      notificationsEnabled: true,
      dailyReminder: true,
      reducedMotion: false,
      language: "en",

      setTheme: (theme) => set({ theme }),
      setCrossfadeDuration: (duration) => set({ crossfadeDuration: duration }),
      setDefaultSleepTimer: (minutes) => set({ defaultSleepTimer: minutes }),
      setPlaybackQuality: (quality) => set({ playbackQuality: quality }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setDailyReminder: (enabled) => set({ dailyReminder: enabled }),
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setLanguage: (language) => set({ language }),
    }),
    { name: "noctune-settings-storage" }
  )
)

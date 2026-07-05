export type SoundCategory =
  | "rain" | "thunder" | "wind" | "forest" | "birds" | "ocean" | "river"
  | "waterfall" | "night" | "fire" | "fireplace" | "campfire" | "home"
  | "fan" | "clock" | "kitchen" | "coffee-machine" | "library" | "office"
  | "keyboard" | "writing" | "city" | "cafe" | "train" | "airport"
  | "traffic" | "white-noise" | "brown-noise" | "pink-noise" | "space"
  | "whisper" | "tapping" | "crinkling" | "scratching"

export interface Sound {
  id: string
  title: string
  category: SoundCategory
  description: string
  duration: number
  coverUrl: string
  color: string
  gradient: string
  isPremium: boolean
  tags: string[]
}

export interface SoundLayer {
  soundId: string
  volume: number
  isMuted: boolean
  isSolo: boolean
  isLooping: boolean
}

export interface MixPreset {
  id: string
  name: string
  layers: SoundLayer[]
  masterVolume: number
  createdAt: number
  updatedAt: number
}

export interface Collection {
  id: string
  title: string
  description: string
  coverUrl: string
  gradient: string
  tags: string[]
  duration: number
  soundIds: string[]
  isPremium: boolean
  category: string
}

export interface HistoryItem {
  soundId: string
  playedAt: number
}

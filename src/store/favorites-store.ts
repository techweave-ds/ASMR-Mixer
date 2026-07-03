import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Collection } from "@/types"

interface FavoritesState {
  soundIds: string[]
  collectionIds: string[]
  savedCollections: Collection[]
}

interface FavoritesActions {
  toggleSound: (soundId: string) => void
  isSoundFavorited: (soundId: string) => boolean
  toggleCollection: (collectionId: string) => void
  isCollectionFavorited: (collectionId: string) => boolean
  saveCollection: (collection: Collection) => void
  removeCollection: (collectionId: string) => void
  clearAll: () => void
}

type FavoritesStore = FavoritesState & FavoritesActions

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      soundIds: [],
      collectionIds: [],
      savedCollections: [],

      toggleSound: (soundId: string) => {
        const { soundIds } = get()
        if (soundIds.includes(soundId)) {
          set({ soundIds: soundIds.filter((id) => id !== soundId) })
        } else {
          set({ soundIds: [...soundIds, soundId] })
        }
      },

      isSoundFavorited: (soundId: string) => {
        return get().soundIds.includes(soundId)
      },

      toggleCollection: (collectionId: string) => {
        const { collectionIds } = get()
        if (collectionIds.includes(collectionId)) {
          set({ collectionIds: collectionIds.filter((id) => id !== collectionId) })
        } else {
          set({ collectionIds: [...collectionIds, collectionId] })
        }
      },

      isCollectionFavorited: (collectionId: string) => {
        return get().collectionIds.includes(collectionId)
      },

      saveCollection: (collection: Collection) => {
        const { savedCollections } = get()
        if (!savedCollections.some((c) => c.id === collection.id)) {
          set({ savedCollections: [...savedCollections, collection] })
        }
      },

      removeCollection: (collectionId: string) => {
        set({
          savedCollections: get().savedCollections.filter((c) => c.id !== collectionId),
        })
      },

      clearAll: () => {
        set({ soundIds: [], collectionIds: [], savedCollections: [] })
      },
    }),
    { name: "noctune-favorites-storage" }
  )
)

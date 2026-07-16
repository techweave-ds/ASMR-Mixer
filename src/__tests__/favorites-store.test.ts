import { describe, it, expect, beforeEach } from "vitest"
import { useFavoritesStore } from "@/store/favorites-store"

describe("FavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ soundIds: [], collectionIds: [], savedCollections: [] })
  })

  it("adds a sound to favorites", () => {
    useFavoritesStore.getState().toggleSound("rain-light")
    expect(useFavoritesStore.getState().soundIds).toContain("rain-light")
  })

  it("removes a sound from favorites", () => {
    useFavoritesStore.getState().toggleSound("rain-light")
    useFavoritesStore.getState().toggleSound("rain-light")
    expect(useFavoritesStore.getState().soundIds).not.toContain("rain-light")
  })

  it("checks if sound is favorited", () => {
    expect(useFavoritesStore.getState().isSoundFavorited("rain-light")).toBe(false)
    useFavoritesStore.getState().toggleSound("rain-light")
    expect(useFavoritesStore.getState().isSoundFavorited("rain-light")).toBe(true)
  })

  it("saves a collection", () => {
    const col = { id: "c1", name: "Test", description: "", sounds: [], createdAt: 0 }
    useFavoritesStore.getState().saveCollection(col)
    expect(useFavoritesStore.getState().savedCollections).toHaveLength(1)
    useFavoritesStore.getState().saveCollection(col)
    expect(useFavoritesStore.getState().savedCollections).toHaveLength(1)
  })

  it("removes a collection", () => {
    const col = { id: "c1", name: "Test", description: "", sounds: [], createdAt: 0 }
    useFavoritesStore.getState().saveCollection(col)
    useFavoritesStore.getState().removeCollection("c1")
    expect(useFavoritesStore.getState().savedCollections).toHaveLength(0)
  })

  it("clears all data", () => {
    useFavoritesStore.getState().toggleSound("rain-light")
    useFavoritesStore.getState().clearAll()
    expect(useFavoritesStore.getState().soundIds).toEqual([])
  })
})

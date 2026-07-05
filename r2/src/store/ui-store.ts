import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UiState {
  sidebarOpen: boolean
  rightPanelOpen: boolean
  playerExpanded: boolean
  searchOpen: boolean
  recentSearches: string[]
}

interface UiActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleRightPanel: () => void
  setRightPanelOpen: (open: boolean) => void
  setPlayerExpanded: (expanded: boolean) => void
  setSearchOpen: (open: boolean) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

type UiStore = UiState & UiActions

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      rightPanelOpen: true,
      playerExpanded: false,
      searchOpen: false,
      recentSearches: [],

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleRightPanel: () => set({ rightPanelOpen: !get().rightPanelOpen }),
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      setPlayerExpanded: (expanded) => set({ playerExpanded: expanded }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      addRecentSearch: (query: string) => {
        const { recentSearches } = get()
        const filtered = recentSearches.filter((s) => s !== query)
        set({ recentSearches: [query, ...filtered].slice(0, 10) })
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "noctune-ui-storage" }
  )
)

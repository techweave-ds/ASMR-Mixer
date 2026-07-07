import { create } from "zustand"
import { persist } from "zustand/middleware"

interface EntitlementState {
  isPremium: boolean
}

interface EntitlementActions {
  setIsPremium: (value: boolean) => void
}

type EntitlementStore = EntitlementState & EntitlementActions

export const useEntitlementStore = create<EntitlementStore>()(
  persist(
    (set) => ({
      isPremium: true,
      setIsPremium: (value: boolean) => set({ isPremium: value }),
    }),
    { name: "noctune-entitlement-storage" }
  )
)

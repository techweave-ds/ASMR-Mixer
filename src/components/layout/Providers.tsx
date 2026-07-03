"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { RightPanel } from "@/components/layout/RightPanel"
import { PlayerBar } from "@/components/player/PlayerBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SearchContent } from "@/components/search/SearchContent"
import { useSettingsStore } from "@/store"

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("reduce-motion", reducedMotion)
  }, [theme, reducedMotion])

  return (
    <div className="h-screen w-screen flex flex-col bg-bg-base overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-6 lg:px-8 xl:px-10 py-6">
            {children}
          </main>
        </div>
        <RightPanel />
      </div>
      <PlayerBar />
      <BottomNav />
      <SearchContent />
    </div>
  )
}

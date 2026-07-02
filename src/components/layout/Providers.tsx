"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { RightPanel } from "@/components/layout/RightPanel"
import { PlayerBar } from "@/components/player/PlayerBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SearchContent } from "@/components/search/SearchContent"
import { useSettingsStore } from "@/store"
import { useUiStore } from "@/store"

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, reducedMotion } = useSettingsStore()
  const { rightPanelOpen } = useUiStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("reduce-motion", reducedMotion)
  }, [theme, reducedMotion])

  return (
    <>
      <div className="flex min-h-screen bg-bg-base">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 lg:ml-[280px]">
          <TopBar />
          <main className="flex-1 px-6 py-6 lg:px-10 xl:px-12 pb-28">
            {children}
          </main>
        </div>
        {rightPanelOpen && <RightPanel />}
      </div>
      <PlayerBar />
      <BottomNav />
      <SearchContent />
    </>
  )
}

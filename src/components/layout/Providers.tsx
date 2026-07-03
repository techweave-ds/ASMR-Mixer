"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { RightPanel } from "@/components/layout/RightPanel"
import { PlayerBar } from "@/components/player/PlayerBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { SearchContent } from "@/components/search/SearchContent"
import { ToastContainer } from "@/components/ui/ToastContainer"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useSettingsStore } from "@/store"

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

function ProvidersInner({ children, pathname, isHome, transitionProps }: { children: React.ReactNode; pathname: string; isHome: boolean; transitionProps: any }) {
  useKeyboardShortcuts()

  if (isHome) {
    return (
      <div className="bg-bg-base h-screen overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} {...transitionProps}>
            {children}
          </motion.div>
        </AnimatePresence>
        <PlayerBar />
        <BottomNav />
        <SearchContent />
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg-base overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-6 lg:px-8 xl:px-10 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={pathname} {...transitionProps}>
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <RightPanel />
      </div>
      <PlayerBar />
      <BottomNav />
      <SearchContent />
      <ToastContainer />
    </div>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const pathname = usePathname()

  useEffect(() => {
    const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme
    document.documentElement.classList.toggle("dark", resolved === "dark")
    document.documentElement.classList.toggle("reduce-motion", reducedMotion)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") document.documentElement.classList.toggle("dark", e.matches)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme, reducedMotion])

  const transitionProps = reducedMotion ? {} : pageTransition

  return (
    <ProvidersInner pathname={pathname} isHome={pathname === "/"} transitionProps={transitionProps}>
      {children}
    </ProvidersInner>
  )
}

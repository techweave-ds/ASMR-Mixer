"use client"

import { Search, Bell, Sparkles, ChevronDown, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUiStore, useAudioStore } from "@/store"
import { useToastStore } from "@/store/toast-store"
import { cn } from "@/lib/utils"
import { useScrollScrolled } from "@/hooks/useScrollContainer"

export function TopBar() {
  const router = useRouter()
  const { setSearchOpen, setSidebarOpen, sidebarOpen } = useUiStore()
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const scrolled = useScrollScrolled(60)

  return (
    <header
      className={cn(
        "flex h-[68px] items-center gap-3 lg:gap-6 border-b px-4 lg:px-8 xl:px-10 flex-shrink-0 sticky top-0 z-30 transition-all duration-300",
        scrolled
          ? "bg-bg-base/80 backdrop-blur-xl border-border-subtle"
          : "bg-transparent border-transparent"
      )}
      style={{ height: scrolled ? "60px" : "68px" }}
    >
      <button aria-label={sidebarOpen ? "Close menu" : "Open menu"} onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-glass border border-border-subtle text-text-tertiary hover:text-text-secondary transition-colors">
        <Menu size={16} />
      </button>
      <img src="/logo.png" alt="Noctune" className="h-9 w-auto lg:hidden" />
      {/* Search */}
      <button aria-label="Search"
        onClick={() => setSearchOpen(true)}
        className={cn(
          "flex items-center gap-3 w-full max-w-[600px] rounded-xl border px-4 py-2.5 text-sm transition-all",
          scrolled
            ? "bg-glass border-border-subtle text-text-tertiary hover:bg-glass-hover hover:border-border"
            : "bg-white/[0.04] border-white/10 text-white/40 hover:bg-white/[0.06] hover:border-white/20"
        )}
      >
        <Search size={16} className="text-text-quaternary" />
        <span className="hidden sm:inline">Search sounds, categories, collections...</span>
        <span className="sm:hidden">Search...</span>
      </button>

      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {isPlaying && (
          <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="text-[10px] font-medium text-accent-light/80">Playing</span>
          </div>
        )}
        <button onClick={() => useToastStore.getState().addToast({ type: "info", title: "No new notifications", description: "You're all caught up." })} aria-label="Notifications" className="relative h-9 w-9 rounded-lg bg-glass border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-red" />
        </button>
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 h-9 rounded-lg bg-glass border border-border-subtle px-2 cursor-pointer hover:bg-glass-hover transition-colors">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 flex items-center justify-center ring-1 ring-white/10">
            <Sparkles size={12} className="text-accent-light" />
          </div>
          <ChevronDown size={12} className="text-text-quaternary" />
        </button>
      </div>
    </header>
  )
}

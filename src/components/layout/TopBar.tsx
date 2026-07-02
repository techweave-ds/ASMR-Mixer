"use client"

import { Search, Bell, Sparkles } from "lucide-react"
import { useUiStore } from "@/store"
import { useAudioStore } from "@/store"

export function TopBar() {
  const { setSearchOpen } = useUiStore()
  const isPlaying = useAudioStore((s) => s.isPlaying)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border-subtle bg-bg-base/80 backdrop-blur-xl px-6 lg:px-10 xl:px-12">
      <button
        onClick={() => setSearchOpen(true)}
        className="group flex flex-1 max-w-md items-center gap-3 rounded-2xl border border-border bg-glass px-5 py-2.5 text-sm text-text-tertiary backdrop-blur-xl transition-all hover:bg-glass-hover hover:border-border-hover focus:outline-none"
      >
        <Search size={16} className="text-text-quaternary group-hover:text-text-tertiary" />
        <span className="hidden sm:inline">Search sounds, categories, collections...</span>
        <span className="sm:hidden">Search...</span>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {isPlaying && (
          <div className="flex items-center gap-1.5 rounded-full bg-accent/8 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="text-[10px] font-medium text-accent-light/80">Playing</span>
          </div>
        )}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-glass text-text-tertiary transition-colors hover:text-text-secondary hover:bg-glass-hover">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-red" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 ring-1 ring-white/10 cursor-pointer">
          <Sparkles size={14} className="text-accent-light" />
        </div>
      </div>
    </header>
  )
}

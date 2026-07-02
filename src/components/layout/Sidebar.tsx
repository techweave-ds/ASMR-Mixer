"use client"

import {
  Home, Compass, SlidersVertical, Heart,
  User, Crown, Moon, Sun, Settings,
  Library, Sparkles, Headphones, Music
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUiStore, useSettingsStore, useAudioStore } from "@/store"
import { cn } from "@/lib/utils"
import { Equalizer } from "@/components/ui/Equalizer"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/mixer", icon: SlidersVertical, label: "Mixer" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
]

const libraryItems = [
  { label: "Recently Played", icon: Music },
  { label: "Your Mixes", icon: Library },
  { label: "Downloads", icon: Headphones },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const { theme, setTheme } = useSettingsStore()
  const isPlaying = useAudioStore((s) => s.isPlaying)

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-[#0c0c14]/95 backdrop-blur-2xl transition-transform duration-500 ease-out lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border-subtle">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 ring-1 ring-accent/20">
            <Sparkles size={16} className="text-accent-light" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-text-primary">Silent Circuit</span>
            <p className="text-[10px] text-text-tertiary tracking-wider uppercase">Premium ASMR</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto pt-3 px-3">
          <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Navigation</p>
          <div className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent/8 text-accent-light"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-glass-hover"
                  )}
                >
                  <div className={cn("w-5 h-5 flex items-center justify-center", isActive && "text-accent-light")}>
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                  {isActive && isPlaying && <Equalizer className="ml-auto" size="sm" />}
                </Link>
              )
            })}
          </div>

          <div className="mt-6">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Library</p>
            <div className="space-y-0.5">
              {libraryItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-tertiary transition-all duration-200 hover:text-text-secondary hover:bg-glass-hover"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-4 pb-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/8 to-indigo-600/8 p-4 ring-1 ring-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-accent-amber" />
              <span className="text-xs font-semibold text-accent-amber/90">Go Premium</span>
            </div>
            <p className="mb-3 text-[11px] leading-relaxed text-text-tertiary">
              Unlock all sounds, offline mode, and high-quality audio.
            </p>
            <button className="w-full rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-2 text-xs font-medium text-accent-light/90 transition-all hover:from-blue-500/30 hover:to-indigo-500/30">
              See Plans
            </button>
          </div>
        </div>

        <div className="border-t border-border-subtle px-3 py-3">
          <Link
            href="/profile"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              pathname === "/profile"
                ? "bg-accent/8 text-accent-light"
                : "text-text-tertiary hover:text-text-secondary hover:bg-glass-hover"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 ring-1 ring-white/10">
              <User size={14} className="text-text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Listener</p>
              <p className="text-[10px] text-text-tertiary">Free Account</p>
            </div>
          </Link>
          <div className="mt-1 flex items-center gap-1 px-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-text-tertiary transition-colors hover:bg-glass-hover hover:text-text-secondary"
            >
              {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
              {theme === "dark" ? "Dark" : "Light"}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-text-tertiary transition-colors hover:bg-glass-hover hover:text-text-secondary">
              <Settings size={12} />
              Settings
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

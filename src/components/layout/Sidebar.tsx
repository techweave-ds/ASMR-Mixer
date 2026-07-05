"use client"

import {
  Home, Compass, SlidersVertical, Heart,
  User, Crown, Moon, Sun, Settings,
  Sparkles, Music, Download,
  Clock, ListMusic, Target
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUiStore, useSettingsStore, useAudioStore } from "@/store"
import { cn } from "@/lib/utils"
import { Equalizer } from "@/components/ui/Equalizer"
import { useStoreHydration } from "@/hooks/useStoreHydration"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/mixer", icon: SlidersVertical, label: "Mixer" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
]

const libraryItems = [
  { label: "Recently Played", icon: Clock },
  { label: "Your Mixes", icon: ListMusic },
  { label: "Downloads", icon: Download },
]

export function Sidebar() {
  const hydrated = useStoreHydration()
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const { theme, setTheme } = useSettingsStore()
  const isPlaying = useAudioStore((s) => s.isPlaying)

  if (!hydrated) return null

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          "w-[280px] flex-shrink-0 flex flex-col bg-bg-secondary border-r border-border-subtle",
          "fixed left-0 top-0 z-50 h-full transition-transform duration-500 lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[68px] items-center gap-3 px-6 border-b border-border-subtle">
          <img src="/logo.png" alt="Noctune" className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-5 px-3">
          <div className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-accent/10 text-accent-light"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-glass-hover"
                  )}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {isActive && isPlaying && <Equalizer className="ml-auto" size="sm" />}
                </Link>
              )
            })}
          </div>

          <div className="mt-8">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Library</p>
            <div className="space-y-0.5">
              {libraryItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-tertiary transition-all duration-150 hover:text-text-secondary hover:bg-glass-hover"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div className="mt-8">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Discover</p>
            <div className="space-y-0.5">
              {[
                { label: "Recently Added", icon: Sparkles },
                { label: "Trending", icon: Music },
                { label: "Staff Picks", icon: Crown },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-tertiary transition-all duration-150 hover:text-text-secondary hover:bg-glass-hover"
                >
                  <Icon size={14} className="text-text-quaternary" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div className="mt-6">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Moods</p>
            <div className="space-y-0.5">
              {[
                { label: "Sleep", icon: Moon },
                { label: "Focus", icon: Target },
                { label: "Meditation", icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-tertiary transition-all duration-150 hover:text-text-secondary hover:bg-glass-hover"
                >
                  <Icon size={14} className="text-text-quaternary" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Premium Card */}
        <div className="px-4 py-3">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500/8 to-indigo-600/8 p-4 ring-1 ring-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-accent-amber" />
              <span className="text-xs font-semibold text-accent-amber/90">Go Premium</span>
            </div>
            <p className="mb-3 text-[11px] leading-relaxed text-text-tertiary">
              Unlock all sounds, offline mode, and high-quality audio.
            </p>
            <button className="w-full rounded-2xl bg-accent/15 px-3 py-2 text-xs font-medium text-accent-light/90 transition-all hover:bg-accent/25">
              See Plans
            </button>
          </div>
        </div>

        {/* Profile + Footer */}
        <div className="border-t border-border-subtle px-3 py-3">
          <Link
            href="/profile"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
              pathname === "/profile"
                ? "bg-accent/10 text-accent-light"
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
          <div className="mt-2 flex items-center gap-1 px-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-text-tertiary hover:text-text-secondary hover:bg-glass-hover transition-colors"
            >
              {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
              {theme === "dark" ? "Dark" : "Light"}
            </button>
            <Link href="/settings" onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors",
                pathname === "/settings"
                  ? "text-accent-light bg-accent/10"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-glass-hover"
              )}>
              <Settings size={12} />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

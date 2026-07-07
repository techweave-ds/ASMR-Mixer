"use client"

import {
  Home, Compass, SlidersVertical, Heart,
  User, Crown, Moon, Sun, Settings,
  Music, Shuffle, Star, Timer, Play, Headphones
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUiStore, useSettingsStore, useAudioStore, useMixerStore, useFavoritesStore } from "@/store"
import { useToastStore } from "@/store/toast-store"
import { cn } from "@/lib/utils"
import { Equalizer } from "@/components/ui/Equalizer"
import { useStoreHydration } from "@/hooks/useStoreHydration"
import { sounds, getSoundById } from "@/data/sounds"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/mixer", icon: SlidersVertical, label: "Mixer" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
]

export function Sidebar() {
  const router = useRouter()
  const hydrated = useStoreHydration()
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const { theme, setTheme } = useSettingsStore()
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isPlayingSounds = useAudioStore((s) => s.isPlayingSounds)
  const playSingle = useAudioStore((s) => s.playSingle)
  const presets = useMixerStore((s) => s.presets)
  const loadPreset = useMixerStore((s) => s.loadPreset)

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
          <img src="/logo.png" alt="Noctune" className="h-10 w-auto" />
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

          {/* Quick Access */}
          <div className="mt-8">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Quick Access</p>
            <div className="space-y-0.5">
              {/* Continue Listening */}
              <button
                onClick={() => {
                  if (isPlayingSounds.size > 0) {
                    router.push("/mixer")
                  } else {
                    const favs = useFavoritesStore.getState().soundIds
                    if (favs.length > 0) playSingle(favs[0])
                  }
                  setSidebarOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isPlayingSounds.size > 0
                    ? "text-accent-light hover:bg-accent/10"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-glass-hover"
                )}
              >
                {isPlayingSounds.size > 0 ? <Headphones size={18} /> : <Music size={18} />}
                <span className="truncate">
                  {isPlayingSounds.size > 0
                    ? (() => {
                        const first = getSoundById(Array.from(isPlayingSounds)[0])
                        return first?.title ?? "Playing"
                      })()
                    : "Continue Listening"}
                </span>
                {isPlayingSounds.size > 0 && <Equalizer className="ml-auto" size="sm" />}
              </button>
              {/* Favorites */}
              <button
                onClick={() => { router.push("/favorites"); setSidebarOpen(false) }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-tertiary transition-all duration-150 hover:text-text-secondary hover:bg-glass-hover"
              >
                <Heart size={18} />
                <span>Favorites</span>
              </button>
              {/* Quick Mixes */}
              <button
                onClick={() => { router.push("/mixer"); setSidebarOpen(false) }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-tertiary transition-all duration-150 hover:text-text-secondary hover:bg-glass-hover"
              >
                <SlidersVertical size={18} />
                <span>Quick Mixes</span>
              </button>
              {presets.length > 0 && (
                <div className="ml-6 mt-1 space-y-0.5 border-l border-border-subtle pl-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        loadPreset(preset.id)
                        router.push("/mixer")
                        setSidebarOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-tertiary transition-all hover:text-text-secondary hover:bg-glass-hover"
                    >
                      <Play size={10} className="shrink-0" />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tools */}
          <div className="mt-8">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-text-quaternary">Tools</p>
            <div className="space-y-0.5">
              {[
                { label: "Sleep Timer", icon: Timer },
                { label: "Random Sound", icon: Shuffle },
                { label: "Daily Recommendation", icon: Star },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === "Random Sound") {
                      const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
                      if (randomSound) playSingle(randomSound.id)
                    } else if (label === "Sleep Timer") {
                      useToastStore.getState().addToast({ type: "info", title: "Sleep Timer", description: "Set a timer from the player bar." })
                    } else if (label === "Daily Recommendation") {
                      router.push("/explore")
                    }
                    setSidebarOpen(false)
                  }}
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
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/8 to-yellow-600/8 p-4 ring-1 ring-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-accent-amber" />
              <span className="text-xs font-semibold text-accent-amber/90">Premium</span>
            </div>
            <p className="mb-1 text-[11px] leading-relaxed text-text-tertiary">
              All sounds unlocked. No subscription needed.
            </p>
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
              <p className="text-[10px] text-text-tertiary">Premium</p>
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

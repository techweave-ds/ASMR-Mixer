"use client"

import { User, Moon, Sun, Bell, Trash2, Timer, Music, Volume2, Crown } from "lucide-react"
import { useSettingsStore } from "@/store"
import { Slider } from "@/components/ui/Slider"
import { cn } from "@/lib/utils"

export function ProfileContent() {
  const {
    theme, setTheme,
    crossfadeDuration, setCrossfadeDuration,
    defaultSleepTimer, setDefaultSleepTimer,
    notificationsEnabled, setNotificationsEnabled,
    dailyReminder, setDailyReminder,
    reducedMotion, setReducedMotion,
  } = useSettingsStore()

  const timerOptions = [15, 30, 45, 60, 120]

  return (
    <div className="space-y-8 pb-8 max-w-2xl">
      {/* Profile Header */}
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg">
          <User size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Listener</h1>
          <p className="text-sm text-text-tertiary">Free Account</p>
          <button className="mt-1 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-0.5 text-[10px] font-medium text-accent-amber">
            <Crown size={10} />
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Preferences */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Preferences</h2>
        <div className="rounded-2xl border border-border-subtle bg-glass divide-y divide-border-subtle">
          {/* Theme */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={16} className="text-accent-light" /> : <Sun size={16} className="text-accent-amber" />}
              <div>
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <p className="text-xs text-text-tertiary">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                theme === "dark" ? "bg-accent/15 text-accent-light" : "bg-amber-500/15 text-accent-amber"
              )}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Notifications</p>
                <p className="text-xs text-text-tertiary">Enable app notifications</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                notificationsEnabled ? "bg-green-500/15 text-accent-green" : "bg-glass text-text-tertiary"
              )}
            >
              {notificationsEnabled ? "On" : "Off"}
            </button>
          </div>

          {/* Daily Reminder */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Daily Reminder</p>
                <p className="text-xs text-text-tertiary">&ldquo;Time to relax&rdquo; notification</p>
              </div>
            </div>
            <button
              onClick={() => setDailyReminder(!dailyReminder)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                dailyReminder ? "bg-green-500/15 text-accent-green" : "bg-glass text-text-tertiary"
              )}
            >
              {dailyReminder ? "On" : "Off"}
            </button>
          </div>

          {/* Crossfade */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Crossfade</p>
                <p className="text-xs text-text-tertiary">{crossfadeDuration}s transition</p>
              </div>
            </div>
            <Slider
              value={crossfadeDuration}
              onChange={setCrossfadeDuration}
              min={0}
              max={5}
              step={0.5}
              size="sm"
              className="w-24"
            />
          </div>

          {/* Default Sleep Timer */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Timer size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Default Sleep Timer</p>
                <p className="text-xs text-text-tertiary">
                  {defaultSleepTimer ? `${defaultSleepTimer} min` : "No default"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {timerOptions.map((m) => (
                <button
                  key={m}
                  onClick={() => setDefaultSleepTimer(defaultSleepTimer === m ? null : m)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-medium transition-all",
                    defaultSleepTimer === m ? "bg-accent/15 text-accent-light" : "bg-glass text-text-quaternary hover:text-text-secondary"
                  )}
                >
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Music size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Reduced Motion</p>
                <p className="text-xs text-text-tertiary">Minimize animations</p>
              </div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                reducedMotion ? "bg-green-500/15 text-accent-green" : "bg-glass text-text-tertiary"
              )}
            >
              {reducedMotion ? "On" : "Off"}
            </button>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Storage</h2>
        <div className="rounded-2xl border border-border-subtle bg-glass px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Clear Cache</p>
                <p className="text-xs text-text-tertiary">Free up storage space</p>
              </div>
            </div>
            <button className="rounded-xl border border-red-500/20 px-4 py-1.5 text-xs font-medium text-accent-red transition-colors hover:bg-red-500/10">
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4">About</h2>
        <div className="rounded-2xl border border-border-subtle bg-glass px-5 py-4 space-y-2">
          <p className="text-sm text-text-tertiary">Silent Circuit v1.0.0</p>
          <p className="text-xs text-text-quaternary">Premium ASMR & Ambient Sound Application</p>
          <div className="flex gap-4 pt-1">
            <button className="text-xs text-text-quaternary underline hover:text-text-tertiary transition-colors">Privacy Policy</button>
            <button className="text-xs text-text-quaternary underline hover:text-text-tertiary transition-colors">Terms of Service</button>
            <button className="text-xs text-text-quaternary underline hover:text-text-tertiary transition-colors">Send Feedback</button>
          </div>
        </div>
      </section>
    </div>
  )
}

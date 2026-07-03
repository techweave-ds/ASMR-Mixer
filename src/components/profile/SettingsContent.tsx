"use client"

import { useState } from "react"
import { Sun, Moon, Monitor, Volume2, Timer, Play, RotateCcw, BarChart3, Shield, Download, Music, Sliders } from "lucide-react"
import { useSettingsStore } from "@/store"
import { Toggle } from "@/components/ui/Toggle"
import { Slider } from "@/components/ui/Slider"
import { Tabs } from "@/components/ui/Tabs"
import { cn } from "@/lib/utils"

const SECTION_TABS = [
  { id: "appearance", label: "Appearance" },
  { id: "audio", label: "Audio" },
  { id: "playback", label: "Playback" },
  { id: "privacy", label: "Privacy" },
]

const themeOptions: { id: "dark" | "light" | "system"; icon: any; label: string }[] = [
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "light", icon: Sun, label: "Light" },
  { id: "system", icon: Monitor, label: "System" },
]

export function SettingsContent() {
  const [activeSection, setActiveSection] = useState("appearance")
  const {
    theme, setTheme,
    reducedMotion, setReducedMotion,
    crossfadeDuration, setCrossfadeDuration,
    defaultSleepTimer, setDefaultSleepTimer,
    notificationsEnabled, setNotificationsEnabled,
    dailyReminder, setDailyReminder,
  } = useSettingsStore()

  const timerOptions = [15, 30, 45, 60, 120]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Customize your experience</p>
      </div>

      <Tabs tabs={SECTION_TABS} active={activeSection} onChange={setActiveSection} variant="segmented" />

      {activeSection === "appearance" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border-subtle bg-glass p-5 space-y-4">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Theme</p>
            <div className="flex gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon
                const active = theme === opt.id
                return (
                  <button key={opt.id} onClick={() => setTheme(opt.id)}
                    className={cn("flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium transition-all",
                      active ? "border-accent/30 bg-accent/8 text-accent-light" : "border-border-subtle text-text-tertiary hover:border-border hover:text-text-secondary"
                    )}>
                    <Icon size={15} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
          <SettingRow icon={Music} label="Reduced Motion" desc="Minimize animations and motion effects">
            <Toggle checked={reducedMotion} onChange={setReducedMotion} />
          </SettingRow>
        </div>
      )}

      {activeSection === "audio" && (
        <div className="rounded-3xl border border-border-subtle bg-glass divide-y divide-border-subtle">
          <SettingRow icon={Sliders} label="Crossfade" desc="Smooth transition between sounds">
            <div className="flex items-center gap-3">
              <Toggle checked={crossfadeDuration > 0} onChange={(v) => setCrossfadeDuration(v ? 2 : 0)} />
              {crossfadeDuration > 0 && (
                <div className="flex items-center gap-2">
                  <Slider value={crossfadeDuration} onChange={setCrossfadeDuration} min={0.5} max={5} step={0.5} size="sm" className="w-20" />
                  <span className="text-[11px] text-text-muted w-6">{crossfadeDuration}s</span>
                </div>
              )}
            </div>
          </SettingRow>
          <SettingRow icon={Volume2} label="Volume Normalization" desc="Balance volume across all sounds">
            <Toggle checked={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow icon={Timer} label="Default Sleep Timer" desc={defaultSleepTimer ? `${defaultSleepTimer} minutes` : "No default timer set"}>
            <div className="flex gap-1">
              {timerOptions.map((m) => (
                <button key={m} onClick={() => setDefaultSleepTimer(defaultSleepTimer === m ? null : m)}
                  className={cn("rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all",
                    defaultSleepTimer === m ? "bg-accent/15 text-accent" : "bg-glass text-text-muted hover:text-text-secondary"
                  )}>
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      )}

      {activeSection === "playback" && (
        <div className="rounded-3xl border border-border-subtle bg-glass divide-y divide-border-subtle">
          <SettingRow icon={Play} label="Autoplay" desc="Auto-play sounds when opening a collection">
            <Toggle checked={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow icon={RotateCcw} label="Loop" desc="Continuously loop active sounds">
            <Toggle checked={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow icon={Timer} label="Auto-clear Timer on Pause" desc="Reset the sleep timer when you pause playback">
            <Toggle checked={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow icon={RotateCcw} label="Resume Previous Session" desc="Pick up where you left off">
            <Toggle checked={true} onChange={() => {}} />
          </SettingRow>
        </div>
      )}

      {activeSection === "privacy" && (
        <div className="rounded-3xl border border-border-subtle bg-glass divide-y divide-border-subtle">
          <SettingRow icon={BarChart3} label="Usage Analytics" desc="Help improve Noctune with anonymous usage data">
            <Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />
          </SettingRow>
          <SettingRow icon={Shield} label="Crash Reports" desc="Automatically send crash reports to help fix issues">
            <Toggle checked={dailyReminder} onChange={setDailyReminder} />
          </SettingRow>
          <SettingRow icon={Download} label="Download Management" desc="Manage your downloaded content">
            <button className="text-xs text-accent hover:underline">Manage</button>
          </SettingRow>
        </div>
      )}
    </div>
  )
}

function SettingRow({ icon: Icon, label, desc, children }: { icon: any; label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-text-muted shrink-0" />
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-muted">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

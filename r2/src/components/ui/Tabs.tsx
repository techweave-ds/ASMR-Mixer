"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

type TabVariant = "underline" | "pill" | "segmented"

interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode }[]
  active: string
  onChange: (id: string) => void
  variant?: TabVariant
  className?: string
}

const variantStyles: Record<TabVariant, { container: string; tab: (active: boolean) => string }> = {
  underline: {
    container: "flex gap-1 border-b border-border",
    tab: (active) => cn(
      "pb-2 px-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
      active ? "border-accent text-text-primary" : "border-transparent text-text-muted hover:text-text-secondary"
    ),
  },
  pill: {
    container: "flex gap-1",
    tab: (active) => cn(
      "rounded-2xl px-4 py-1.5 text-xs font-medium transition-all",
      active ? "bg-accent text-white" : "bg-glass text-text-muted hover:text-text-secondary hover:bg-glass-hover"
    ),
  },
  segmented: {
    container: "flex rounded-2xl bg-glass border border-border p-1",
    tab: (active) => cn(
      "rounded-xl px-4 py-1.5 text-xs font-medium transition-all",
      active ? "bg-bg-secondary text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
    ),
  },
}

export function Tabs({ tabs, active, onChange, variant = "pill", className }: TabsProps) {
  const styles = variantStyles[variant]
  return (
    <div className={cn(styles.container, className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(styles.tab(active === tab.id), "flex items-center gap-2")}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  icon?: string
  className?: string
}

export function Chip({ label, selected, onClick, icon, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        selected
          ? "bg-accent text-white shadow-sm"
          : "bg-glass border border-border text-text-muted hover:text-text-secondary hover:bg-glass-hover",
        className
      )}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

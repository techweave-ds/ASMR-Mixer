"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked: controlledChecked, onChange, label, disabled }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  const toggle = () => {
    if (disabled) return
    const next = !isChecked
    if (controlledChecked === undefined) setInternalChecked(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "flex items-center gap-3",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-all duration-200",
          isChecked ? "bg-accent" : "bg-border"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200",
            isChecked ? "translate-x-[18px]" : "translate-x-[2px]",
            "mt-[2px]"
          )}
        />
      </span>
      {label && <span className="text-xs text-text-secondary select-none">{label}</span>}
    </button>
  )
}

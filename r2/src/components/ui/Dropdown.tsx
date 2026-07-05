"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  items: DropdownItem[]
  selected?: string
  onSelect: (id: string) => void
  trigger: ReactNode
  align?: "left" | "right"
  searchable?: boolean
  className?: string
}

export function Dropdown({ items, selected, onSelect, trigger, align = "left", searchable, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null!)
  const inputRef = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const prevOpen = useRef(open)
  useEffect(() => {
    if (open && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (!open && prevOpen.current) setQuery("")
    prevOpen.current = open
  }, [open, searchable])

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button onClick={() => setOpen(!open)} className="w-full">
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-50 min-w-[180px] rounded-2xl border border-border bg-bg-secondary p-1.5 shadow-2xl backdrop-blur-md animate-fade-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {searchable && (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl bg-glass px-3 py-2 text-xs text-text-primary outline-none mb-1 placeholder:text-text-muted border border-border"
            />
          )}
          {filtered.map((item) => (
            <div key={item.id}>
              {item.divider && <div className="my-1 border-t border-border" />}
              <button
                disabled={item.disabled}
                onClick={() => { onSelect(item.id); setOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all",
                  selected === item.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-glass-hover hover:text-text-primary",
                  item.disabled && "opacity-30 cursor-not-allowed"
                )}
              >
                {item.icon && <span className="text-text-muted">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-xs text-text-muted text-center">No results</p>
          )}
        </div>
      )}
    </div>
  )
}

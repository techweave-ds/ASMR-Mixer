"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { SearchX, Music, AlertCircle, WifiOff } from "lucide-react"

interface EmptyStateProps {
  type?: "empty" | "search" | "error" | "offline"
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: ReactNode
  className?: string
}

const defaults = {
  empty: { icon: <Music size={32} />, title: "Nothing here yet", description: "Content will appear here once you start exploring." },
  search: { icon: <SearchX size={32} />, title: "No results found", description: "Try a different search term or browse categories." },
  error: { icon: <AlertCircle size={32} />, title: "Something went wrong", description: "Please try again. If the problem persists, contact support." },
  offline: { icon: <WifiOff size={32} />, title: "You're offline", description: "Some features may be unavailable. Check your connection." },
}

export function EmptyState({ type = "empty", title, description, action, icon, className }: EmptyStateProps) {
  const d = defaults[type]
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      <div className="mb-4 text-text-muted">{icon || d.icon}</div>
      <h3 className="text-base font-medium text-text-primary mb-1">{title || d.title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description || d.description}</p>
      {action && (
        <Button variant="secondary" size="s" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

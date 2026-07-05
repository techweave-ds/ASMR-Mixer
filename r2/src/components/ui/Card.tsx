"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: ReactNode
  className?: string
  type?: "environment" | "collection" | "feature" | "statistics" | "profile" | "premium"
  hover?: boolean
  padding?: "sm" | "md" | "lg"
  onClick?: () => void
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

export function Card({ children, className, type, hover = true, padding = "md", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick() } : undefined}
      className={cn(
        "rounded-3xl bg-glass border border-border-subtle overflow-hidden",
        paddings[padding],
        hover && "card-hover cursor-pointer",
        type === "premium" && "bg-gradient-to-br from-accent/5 to-accent-secondary/5 ring-1 ring-accent/10",
        type === "statistics" && "text-center",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

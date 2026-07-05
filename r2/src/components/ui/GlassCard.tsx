"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-xl",
        hover && "cursor-pointer transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10",
        className
      )}
    >
      {children}
    </div>
  )
}

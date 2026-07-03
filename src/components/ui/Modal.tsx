"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: ReactNode
  primaryAction?: { label: string; onClick: () => void; loading?: boolean }
  secondaryAction?: { label: string; onClick: () => void }
  className?: string
}

export function Modal({ open, onClose, title, description, children, primaryAction, secondaryAction, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className={cn(
          "w-full max-w-[640px] rounded-3xl border border-border bg-bg-secondary p-8 shadow-2xl animate-fade-in",
          className
        )}
      >
        {title && <h2 className="text-xl font-semibold text-text-primary mb-1">{title}</h2>}
        {description && <p className="text-sm text-text-secondary mb-6">{description}</p>}
        {children}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-end gap-3 mt-6">
            {secondaryAction && (
              <Button variant="ghost" size="s" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button variant="primary" size="s" loading={primaryAction.loading} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, helperText, error, success, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-12 w-full rounded-2xl border bg-glass px-4 text-sm text-text-primary outline-none transition-all",
              "placeholder:text-text-muted",
              "focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(90,124,255,0.08)]",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error ? "border-red-500/50 focus:border-red-500" : "border-border",
              success && "border-accent-success/50",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-accent-red">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
      </div>
    )
  }
)

TextInput.displayName = "TextInput"

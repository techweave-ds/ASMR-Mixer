"use client"

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Check } from "lucide-react"

const variants = {
  primary: "bg-accent text-white hover:brightness-110 active:brightness-95 shadow-lg shadow-accent/10",
  secondary: "bg-glass border border-border text-text-secondary hover:bg-glass-hover hover:text-text-primary active:scale-[0.98]",
  ghost: "bg-transparent text-text-secondary hover:bg-glass-hover hover:text-text-primary active:scale-[0.98]",
  glass: "bg-glass backdrop-blur-md border border-border text-text-primary hover:bg-glass-hover active:scale-[0.98]",
  destructive: "bg-red-500/10 text-accent-red border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
}

const sizes = {
  xs: "h-8 px-3 text-[11px] gap-1.5",
  s: "h-10 px-4 text-xs gap-2",
  m: "h-12 px-5 text-sm gap-2.5",
  l: "h-14 px-7 text-base gap-3",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  success?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "m", loading, success, icon, children, fullWidth, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-2xl transition-all select-none",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          !disabled && !loading && "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "xs" ? 12 : 16} className="animate-spin" />
        ) : success ? (
          <Check size={size === "xs" ? 12 : 16} />
        ) : icon ? (
          icon
        ) : null}
        {children && <span>{children}</span>}
      </button>
    )
  }
)

Button.displayName = "Button"

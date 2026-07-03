"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToastStore } from "@/store"

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: "border-accent-success/30 bg-accent-success/5 text-accent-success",
  error: "border-accent-red/30 bg-accent-red/5 text-accent-red",
  warning: "border-accent-warning/30 bg-accent-warning/5 text-accent-warning",
  info: "border-accent/30 bg-accent/5 text-accent",
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl border bg-bg-secondary p-4 shadow-xl backdrop-blur-md animate-slide-up min-w-[300px] max-w-[400px]",
              colors[toast.type]
            )}
          >
            <Icon size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] opacity-70 mt-0.5">{toast.description}</p>
              )}
              {toast.action && (
                <button onClick={toast.action.onClick}
                  className="mt-1.5 text-[11px] font-medium underline opacity-80 hover:opacity-100 transition-opacity">
                  {toast.action.label}
                </button>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-40 hover:opacity-80 transition-opacity">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

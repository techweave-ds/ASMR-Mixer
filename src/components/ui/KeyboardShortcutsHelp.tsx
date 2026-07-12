"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useUiStore } from "@/store"
import { cn } from "@/lib/utils"

const GROUPS = [
  {
    title: "Playback",
    shortcuts: [
      { keys: ["Space"], desc: "Play / Pause" },
      { keys: ["N"], desc: "Stop last sound" },
      { keys: ["↑", "+"], desc: "Volume up 5%" },
      { keys: ["↓", "-"], desc: "Volume down 5%" },
      { keys: ["M"], desc: "Mute / Unmute" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["S"], desc: "Toggle sidebar" },
      { keys: ["R"], desc: "Toggle layers panel" },
      { keys: ["Esc"], desc: "Close panel / modal" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["F"], desc: "Favorite current sound" },
      { keys: ["A"], desc: "Toggle ambient mode" },
      { keys: ["⌘K"], desc: "Toggle search" },
      { keys: ["?"], desc: "Show this help" },
    ],
  },
]

function ShortcutKey({ label }: { label: string }) {
  return (
    <kbd className={cn(
      "inline-flex items-center justify-center min-w-[28px] h-6 rounded-md border border-white/10 bg-white/5",
      "px-1.5 text-[10px] font-mono font-medium text-white/60 leading-none"
    )}>
      {label}
    </kbd>
  )
}

export function KeyboardShortcutsHelp() {
  const helpOpen = useUiStore((s) => s.helpOpen)
  const setHelpOpen = useUiStore((s) => s.setHelpOpen)

  useEffect(() => {
    if (!helpOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHelpOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [helpOpen, setHelpOpen])

  return (
    <AnimatePresence>
      {helpOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setHelpOpen(false) }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
              <button onClick={() => setHelpOpen(false)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 mb-2">{group.title}</p>
                  <div className="space-y-1.5">
                    {group.shortcuts.map((sc) => (
                      <div key={sc.desc} className="flex items-center justify-between">
                        <span className="text-[12px] text-white/50">{sc.desc}</span>
                        <div className="flex items-center gap-1">
                          {sc.keys.map((k, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && <span className="text-white/20 text-[10px]">or</span>}
                              <ShortcutKey label={k} />
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[10px] text-white/20 text-center">Press <ShortcutKey label="?" /> or <ShortcutKey label="Esc" /> to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

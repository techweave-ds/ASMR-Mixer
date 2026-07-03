"use client"

import { useRef, useMemo, useEffect } from "react"
import { useAudioStore } from "@/store"
import { cn } from "@/lib/utils"

type VisualizerMode = "minimal" | "ambient" | "wave" | "pulse"

interface VisualizerProps {
  mode?: VisualizerMode
  bars?: number
  className?: string
  height?: number
}

export function Visualizer({ mode = "minimal", bars = 24, className, height = 48 }: VisualizerProps) {
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const rafRef = useRef<number>(0)

  const amplitudes = useMemo(() => Array.from({ length: bars }, () => Math.random() * 0.5 + 0.25), [bars])

  useEffect(() => {
    if (!canvasRef.current || mode === "minimal") return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    let frame = 0

    const draw = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!isPlaying) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const w = canvas.width / bars - 1.5
      const centerY = canvas.height / 2

      if (mode === "wave") {
        ctx.beginPath()
        for (let i = 0; i < bars; i++) {
          const amp = amplitudes[i] * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * 0.02 + i * 0.5)))
          const x = i * (w + 1.5) + w / 2
          const y = centerY + amp * centerY * Math.sin(frame * 0.03 + i * 0.3)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = "rgba(90, 124, 255, 0.4)"
        ctx.lineWidth = 1.5
        ctx.stroke()
      } else if (mode === "pulse") {
        const r = 20 + 15 * Math.sin(frame * 0.03)
        const gradient = ctx.createRadialGradient(canvas.width / 2, centerY, 0, canvas.width / 2, centerY, r)
        gradient.addColorStop(0, "rgba(90, 124, 255, 0.15)")
        gradient.addColorStop(0.5, "rgba(90, 124, 255, 0.05)")
        gradient.addColorStop(1, "rgba(90, 124, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        for (let i = 0; i < bars; i++) {
          const amp = amplitudes[i] * (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(frame * 0.02 + i * 0.4)))
          const x = i * (w + 1.5)
          const h = amp * canvas.height * 0.4
          const y = centerY - h / 2
          ctx.fillStyle = `rgba(90, 124, 255, ${0.15 + amp * 0.25})`
          ctx.fillRect(x, y, w, h)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, mode, bars, amplitudes])

  if (mode === "minimal") {
    return (
      <div className={cn("flex items-end gap-[2px]", className)} style={{ height }}>
        {amplitudes.slice(0, 8).map((a, i) => (
          <div
            key={i}
            className={cn(
              "w-[2px] rounded-full transition-all",
              isPlaying ? "bg-accent/40" : "bg-border"
            )}
            style={{
              height: isPlaying ? `${20 + a * 60}%` : "20%",
              transitionDuration: `${150 + i * 30}ms`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={bars * 8}
      height={height}
      className={cn("w-full", className)}
    />
  )
}

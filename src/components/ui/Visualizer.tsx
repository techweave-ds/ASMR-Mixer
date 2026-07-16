"use client"

import { useRef, useEffect } from "react"
import { useAudioStore } from "@/store"
import { audioEngine } from "@/audio"
import { cn } from "@/lib/utils"

interface VisualizerProps {
  bars?: number
  className?: string
  height?: number
}

export function Visualizer({ bars = 8, className, height = 48 }: VisualizerProps) {
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafId = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let stopped = false

    const draw = () => {
      if (stopped) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!isPlaying) {
        rafId.current = requestAnimationFrame(draw)
        return
      }

      const data = audioEngine.getFrequencyData()
      const step = Math.floor(data.length / bars)
      const w = canvas.width / bars - 1.5
      const h = canvas.height

      for (let i = 0; i < bars; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0
        const avg = sum / step / 255
        const barH = Math.max(2, avg * h)
        ctx.fillStyle = `rgba(90, 124, 255, ${0.15 + avg * 0.35})`
        ctx.fillRect(i * (w + 1.5), h - barH, w, barH)
      }

      rafId.current = requestAnimationFrame(draw)
    }

    rafId.current = requestAnimationFrame(draw)
    return () => { stopped = true; cancelAnimationFrame(rafId.current) }
  }, [isPlaying, bars])

  return (
    <canvas
      ref={canvasRef}
      width={bars * 8}
      height={height}
      className={cn("w-full", className)}
    />
  )
}

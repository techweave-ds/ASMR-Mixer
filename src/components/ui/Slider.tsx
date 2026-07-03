"use client"

import { cn } from "@/lib/utils"

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  className,
  size = "md",
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" }

  const thumbStyle = `
    .slider-thumb::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-accent-primary);
      cursor: pointer;
      transition: transform 0.15s;
      box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent-primary) 30%, transparent);
      opacity: 0;
    }
    .group:hover .slider-thumb::-webkit-slider-thumb {
      opacity: 1;
    }
    .slider-thumb::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
    .slider-thumb::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-accent-primary);
      cursor: pointer;
      border: none;
      box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent-primary) 30%, transparent);
    }
  `

  return (
    <div className={cn("relative flex items-center group slider-wrapper", className)}>
      <style>{thumbStyle}</style>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          "w-full appearance-none rounded-full outline-none transition-all slider-thumb",
          heights[size],
        )}
        style={{
          background: `linear-gradient(to right, var(--color-accent-primary) 0%, var(--color-accent-primary) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`,
        }}
      />
    </div>
  )
}

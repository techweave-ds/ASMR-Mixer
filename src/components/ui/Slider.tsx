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

  return (
    <div className={cn("relative flex items-center group", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          "w-full appearance-none rounded-full bg-border outline-none transition-all",
          heights[size],
          "slider-thumb"
        )}
        style={{
          background: `linear-gradient(to right, rgb(74, 144, 217) 0%, rgb(74, 144, 217) ${percentage}%, rgba(255,255,255,0.06) ${percentage}%, rgba(255,255,255,0.06) 100%)`,
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgb(74, 144, 217);
          cursor: pointer;
          transition: transform 0.15s;
          box-shadow: 0 0 8px rgba(74, 144, 217, 0.3);
          opacity: 0;
        }
        .group:hover input[type="range"]::-webkit-slider-thumb {
          opacity: 1;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgb(74, 144, 217);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(74, 144, 217, 0.3);
        }
      `}</style>
    </div>
  )
}

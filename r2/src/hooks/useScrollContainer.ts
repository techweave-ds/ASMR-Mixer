"use client"

import { createContext, useContext, useEffect, useState } from "react"

export const ScrollContainerContext = createContext<HTMLElement | null>(null)

export function useScrollContainer() {
  return useContext(ScrollContainerContext)
}

export function useScrollProgress() {
  const container = useScrollContainer()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!container) return
    const onScroll = () => {
      const sh = container.scrollHeight - container.clientHeight
      setProgress(sh > 0 ? Math.min(container.scrollTop / sh, 1) : 0)
    }
    onScroll()
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [container])

  return progress
}

export function useScrollScrolled(threshold = 60) {
  const container = useScrollContainer()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!container) return
    const onScroll = () => setScrolled(container.scrollTop > threshold)
    onScroll()
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [container, threshold])

  return scrolled
}

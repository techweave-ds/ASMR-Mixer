"use client"

import { useState } from "react"

export function useStoreHydration() {
  const [hydrated] = useState(() => true)
  return hydrated
}

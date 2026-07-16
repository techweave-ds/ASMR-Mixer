"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error) }, [error])
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg-base text-center px-6">
      <p className="text-7xl font-bold bg-gradient-to-br from-red-300 to-orange-300 bg-clip-text text-transparent mb-4">!</p>
      <h1 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h1>
      <p className="text-text-tertiary max-w-md mb-8">An unexpected error occurred. Try refreshing the page.</p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-accent-primary text-white text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  )
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg-base text-center px-6">
      <p className="text-7xl font-bold bg-gradient-to-br from-blue-200 to-indigo-300 bg-clip-text text-transparent mb-4">404</p>
      <h1 className="text-xl font-semibold text-text-primary mb-2">Page not found</h1>
      <p className="text-text-tertiary max-w-md mb-8">This soundscape doesn&apos;t exist. Let&apos;s get you back somewhere familiar.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-accent-primary text-white text-sm font-medium"
      >
        Go Home
      </Link>
    </div>
  )
}

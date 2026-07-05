"use client"

import { Home, Compass, SlidersVertical, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/mixer", icon: SlidersVertical, label: "Mixer" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="flex h-16 items-center justify-around border-t border-border-subtle bg-bg-secondary lg:hidden">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href}
            className={cn("flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
              active ? "text-accent-light" : "text-text-quaternary hover:text-text-tertiary")}>
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

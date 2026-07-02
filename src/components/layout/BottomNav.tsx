import { Home, Compass, SlidersVertical, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/mixer", icon: SlidersVertical, label: "Mixer" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border-subtle bg-bg-base/90 backdrop-blur-xl px-2 pb-safe lg:hidden">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 transition-colors relative",
              isActive && "text-accent-light"
            )}
          >
            <Icon size={20} className={isActive ? "text-accent-light" : "text-text-tertiary"} />
            <span className={cn("text-[10px] font-medium", isActive ? "text-accent-light" : "text-text-tertiary")}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

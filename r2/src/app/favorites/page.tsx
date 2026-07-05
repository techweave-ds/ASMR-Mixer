import type { Metadata } from "next"
import { FavoritesContent } from "@/components/favorites/FavoritesContent"

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved ambient soundscapes — quick access to the sounds you love most.",
}

export default function FavoritesPage() {
  return <FavoritesContent />
}

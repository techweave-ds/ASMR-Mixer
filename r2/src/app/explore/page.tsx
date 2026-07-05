import type { Metadata } from "next"
import { ExploreContent } from "@/components/explore/ExploreContent"

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse all ambient sound categories and discover new soundscapes for relaxation, focus, and sleep.",
}

export default function ExplorePage() {
  return <ExploreContent />
}

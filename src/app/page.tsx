import type { Metadata } from "next"
import { HomeContent } from "@/components/home/HomeContent"

export const metadata: Metadata = {
  title: "Noctune – Premium Ambient Soundscapes",
  description: "Discover immersive ambient soundscapes. Relax, sleep, study, and focus with procedurally generated audio.",
}

export default function HomePage() {
  return <HomeContent />
}

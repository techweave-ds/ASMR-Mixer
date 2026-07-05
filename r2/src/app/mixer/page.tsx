import type { Metadata } from "next"
import { MixerContent } from "@/components/mixer/MixerContent"

export const metadata: Metadata = {
  title: "Mixer",
  description: "Layer multiple ambient sounds, adjust volumes, and create your perfect soundscape mix.",
}

export default function MixerPage() {
  return <MixerContent />
}

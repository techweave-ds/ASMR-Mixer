import type { Metadata } from "next"
import { SettingsContent } from "@/components/profile/SettingsContent"

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize your Noctune experience — theme, audio preferences, playback, and privacy controls.",
}

export default function SettingsPage() {
  return <SettingsContent />
}

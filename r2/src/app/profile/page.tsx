import type { Metadata } from "next"
import { ProfileContent } from "@/components/profile/ProfileContent"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Noctune account, view listening stats, and upgrade to Premium.",
}

export default function ProfilePage() {
  return <ProfileContent />
}

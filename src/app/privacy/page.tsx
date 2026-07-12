import type { Metadata } from "next"
import { PrivacyContent } from "@/components/profile/PrivacyContent"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Noctune collects, uses, and protects your personal data.",
}

export default function PrivacyPage() {
  return <PrivacyContent />
}

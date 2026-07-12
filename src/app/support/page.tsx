import type { Metadata } from "next"
import { SupportContent } from "@/components/profile/SupportContent"

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Noctune — FAQs, troubleshooting, and how to reach us.",
}

export default function SupportPage() {
  return <SupportContent />
}

import type { Metadata } from "next"
import { TermsContent } from "@/components/profile/TermsContent"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Noctune.",
}

export default function TermsPage() {
  return <TermsContent />
}

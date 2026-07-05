import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const siteUrl = "https://noctune.pages.dev"

export const metadata: Metadata = {
  title: { default: "Noctune – Premium Ambient Soundscapes", template: "%s | Noctune" },
  description: "Immerse yourself in premium-quality ambient soundscapes. Relax, sleep, study, and focus with Noctune.",
  metadataBase: new URL(siteUrl),
  icons: { icon: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Noctune",
    title: "Noctune – Premium Ambient Soundscapes",
    description: "Immerse yourself in premium-quality ambient soundscapes. Relax, sleep, study, and focus with Noctune.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Noctune – Premium Ambient Soundscapes",
    description: "Immerse yourself in premium-quality ambient soundscapes. Relax, sleep, study, and focus with Noctune.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

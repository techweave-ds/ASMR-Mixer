"use client"

import { Mail, MessageCircle, Book, Bug } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const FAQS = [
  { q: "How do I play a sound?", a: "Browse the Explore page or Hero section and click any SoundCard. Use the PlayerBar at the bottom to control playback, adjust volume, or set a sleep timer." },
  { q: "Can I layer multiple sounds?", a: "Yes. Visit the Mixer page to add, remove, and adjust volume for each layer. Save your favorite combinations as presets." },
  { q: "How does the sleep timer work?", a: "Click the timer icon in the PlayerBar to set a duration. When time runs up, all sounds fade out over 30 seconds." },
  { q: "Are these real recordings?", a: "No — every sound is generated procedurally using the Web Audio API. No audio files are downloaded. This keeps the app fast and offline-capable." },
  { q: "What is Premium?", a: "Premium unlocks exclusive sounds, unlimited mixer layers, offline persistence, and advanced audio effects." },
  { q: "How do I save favorites?", a: "Click the heart icon on any SoundCard or use the F key shortcut. View all favorites on the Favorites page." },
  { q: "Is there a keyboard shortcut list?", a: "Press ? anywhere in the app to open the full keyboard shortcuts reference." },
]

const CONTACT = [
  { icon: Mail, label: "Email", desc: "support@noctune.app", href: "mailto:support@noctune.app" },
  { icon: MessageCircle, label: "Discord", desc: "Join our community", href: "#" },
  { icon: Bug, label: "Report a Bug", desc: "Open a GitHub issue", href: "#" },
]

export function SupportContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Support</h1>
        <p className="text-sm text-text-muted mt-1">Frequently asked questions and ways to reach us.</p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-glass divide-y divide-border-subtle">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group px-5 py-4 cursor-pointer">
            <summary className="text-sm font-medium text-text-primary list-none flex items-center justify-between gap-4">
              {faq.q}
              <span className="text-text-quaternary text-xs transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="rounded-2xl border border-border-subtle bg-glass p-5">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">Contact</p>
        <div className="space-y-3">
          {CONTACT.map(({ icon: Icon, label, desc, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-glass-hover transition-colors">
              <Icon size={16} className="text-text-muted shrink-0" />
              <div>
                <p className="text-sm text-text-primary">{label}</p>
                <p className="text-xs text-text-muted">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

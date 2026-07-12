"use client"

export function PrivacyContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Privacy Policy</h1>
        <p className="text-sm text-text-muted mt-1">Last updated: July 2026</p>
      </div>

      <Section title="Information We Collect">
        <p>Noctune collects minimal data to provide and improve the service:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Usage data</strong> — which sounds you play, how long you listen, mixer presets you save. This stays on your device unless you enable cloud sync.</li>
          <li><strong>Account data</strong> — if you create an account, we store your email address and display name.</li>
          <li><strong>Device data</strong> — browser type, operating system, and audio capabilities for compatibility purposes.</li>
        </ul>
      </Section>

      <Section title="How We Use Your Data">
        <ul className="list-disc pl-5 space-y-1">
          <li>To deliver and personalize your audio experience</li>
          <li>To improve sound quality and procedural generation</li>
          <li>To send occasional product updates (opt-out anytime)</li>
          <li>We never sell your personal data to third parties.</li>
        </ul>
      </Section>

      <Section title="Data Storage">
        <p>Your preferences, favorites, and mixer presets are stored locally in your browser using localStorage. Cloud sync is coming in a future update. Audio processing happens entirely on your device — no audio data is sent to our servers.</p>
      </Section>

      <Section title="Cookies">
        <p>We use minimal cookies for essential functionality (theme preference, session management). No tracking cookies or third-party analytics are used without your explicit consent.</p>
      </Section>

      <Section title="Contact">
        <p>For privacy-related inquiries, email <span className="text-accent-light">privacy@noctune.app</span>.</p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-glass p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-2">{title}</h2>
      <div className="text-sm text-text-muted leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

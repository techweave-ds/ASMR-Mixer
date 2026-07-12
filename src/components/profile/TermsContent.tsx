"use client"

export function TermsContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Terms of Service</h1>
        <p className="text-sm text-text-muted mt-1">Last updated: July 2026</p>
      </div>

      <Section title="Acceptance of Terms">
        <p>By using Noctune, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
      </Section>

      <Section title="Service Description">
        <p>Noctune is a web-based ambient sound application that generates audio procedurally in your browser. We provide tools to mix, layer, and customize soundscapes for focus, relaxation, sleep, and meditation.</p>
      </Section>

      <Section title="Free vs Premium">
        <p>The free tier includes access to 46+ sounds, basic mixing (3 layers), and standard playback features. Premium unlocks all 60+ sounds, unlimited layers, exclusive effects, and priority support. Premium is billed monthly or annually as selected.</p>
      </Section>

      <Section title="User Conduct">
        <ul className="list-disc pl-5 space-y-1">
          <li>You may not reverse-engineer, copy, or redistribute the procedural audio engine.</li>
          <li>You may not use Noctune for unlawful purposes or to distribute harmful content.</li>
          <li>You may not attempt to bypass premium access controls.</li>
        </ul>
      </Section>

      <Section title="Intellectual Property">
        <p>Noctune, the Noctune logo, and all procedural sound algorithms are the intellectual property of the Noctune team. The sound output you generate is yours to enjoy personally. Commercial use of the service or its output requires a separate license.</p>
      </Section>

      <Section title="Limitation of Liability">
        <p>Noctune is provided &quot;as is&quot; without warranty of any kind. We are not liable for any damages arising from your use of the service, including but not limited to data loss or downtime.</p>
      </Section>

      <Section title="Changes to Terms">
        <p>We may update these terms at any time. Continued use after changes constitutes acceptance. You will be notified of material changes via email or in-app notice.</p>
      </Section>

      <Section title="Contact">
        <p>For questions about these terms, email <span className="text-accent-light">legal@noctune.app</span>.</p>
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

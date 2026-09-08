export const metadata = {
  title: 'Privacy Policy — CallioAI',
  description: 'CallioAI customer privacy policy and data governance practices.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mt-1">Effective Date: September 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect account information (name, work email, billing address), caller telemetry (timestamps, call duration, status), and media data processed strictly on your organization’s behalf.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Audio Media & Call Recording Storage</h2>
          <p>
            Call recordings and generated transcripts are stored in encrypted object storage using AES-256 keys. You maintain full control over automatic data retention, redaction, and deletion policies.
          </p>
        </section>
      </div>
    </div>
  );
}

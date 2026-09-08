import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — CallioAI',
  description: 'CallioAI terms of service, acceptable use policy, and enterprise agreement.',
};

export default function TermsPage() {
  return (
    <div className="py-12 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mt-1">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CallioAI’s software platform, API endpoints, telephony services, or voice models, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Permitted Use & Telephony Compliance</h2>
          <p>
            You agree to use CallioAI in full compliance with all applicable local, national, and international laws, including but not limited to the Telephone Consumer Protection Act (TCPA), FCC regulations, and National Do-Not-Call registries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Customer Data & Privacy</h2>
          <p>
            You retain all rights, title, and interest in your customer call recordings, transcripts, and proprietary knowledge base materials. CallioAI will not use your private voice data to train general foundation models.
          </p>
        </section>
      </div>
    </div>
  );
}

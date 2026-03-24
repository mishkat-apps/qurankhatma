import { StaticPageLayout } from '@/components/ui/static-page-layout';

export default function PrivacyPage() {
  return (
    <StaticPageLayout 
      title="Privacy Policy" 
      subtitle="Last updated: March 20, 2026"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Introduction</h2>
          <p>
            At Quran Khatma, we take your privacy seriously. This policy describes how we collect, use, and protect your information when you use our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Data Collection</h2>
          <p>
            <strong>Local Drafts:</strong> When you create a local draft, all information (names, descriptions, Juz status) is stored entirely in your browser's local storage. We do not transmit this data to our servers.
          </p>
          <p>
            <strong>Shared Khatmas:</strong> If you choose to share a Khatma, the data you provided is stored in our secure cloud database (Firebase) to facilitate real-time updates for participants. This includes the deceased's name, organizer name, and progress status.
          </p>
          <p>
            <strong>Authentication:</strong> If you sign in via Google or email, we collect your name and email address to manage your organizer status and provide access to your shared Khatmas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Third-Party Services</h2>
          <p>
            We use Google Firebase for hosting, database, and authentication services. Please refer to Google's privacy policy for details on how they handle data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Contact</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at hello@imaralabs.co.tz.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}


import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';

export default function PrivacyPage() {
  return (
    <main className="page-shell pb-0">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <h1 className="hero-title text-5xl mb-12">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-muted leading-relaxed">
          <p className="text-lg">Last updated: March 20, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Introduction</h2>
            <p>
              At Quran Khatma, we take your privacy seriously. This policy describes how we collect, use, and protect your information when you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Data Collection</h2>
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
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Third-Party Services</h2>
            <p>
              We use Google Firebase for hosting, database, and authentication services. Please refer to Google's privacy policy for details on how they handle data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at hello@imaralabs.co.tz.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

import { StaticPageLayout } from '@/components/ui/static-page-layout';

export default function TermsPage() {
  return (
    <StaticPageLayout 
      title="Terms of Service" 
      subtitle="Last updated: March 20, 2026"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Acceptance of Terms</h2>
          <p>
            By accessing or using Quran Khatma, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Usage Guidelines</h2>
          <p>
            Quran Khatma is provided for religious and community purposes. Users are expected to interact with the platform and each other with respect and dignity. Any misuse of the platform (e.g., posting inappropriate content in dedication notes) may result in the removal of your content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Limitation of Liability</h2>
          <p>
            The service is provided "as is" without warranties of any kind. Imara Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the service after such changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--gold)] font-[var(--font-heading)] uppercase tracking-wider">Contact</h2>
          <p>
            For any legal inquiries, please reach out to legal@imaralabs.co.tz.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}


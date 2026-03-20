import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';

export default function TermsPage() {
  return (
    <main className="page-shell pb-0">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <h1 className="hero-title text-5xl mb-12">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-muted leading-relaxed">
          <p className="text-lg">Last updated: March 20, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Acceptance of Terms</h2>
            <p>
              By accessing or using Quran Khatma, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Usage Guidelines</h2>
            <p>
              Quran Khatma is provided for religious and community purposes. Users are expected to interact with the platform and each other with respect and dignity. Any misuse of the platform (e.g., posting inappropriate content in dedication notes) may result in the removal of your content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Limitation of Liability</h2>
            <p>
              The service is provided "as is" without warranties of any kind. Imara Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the service after such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Contact</h2>
            <p>
              For any legal inquiries, please reach out to legal@imaralabs.co.tz.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

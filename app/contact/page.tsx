import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Panel } from '@/components/ui/panel';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="page-shell pb-0">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-16 text-center">
          <h1 className="hero-title text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            We are here to help and listen to your feedback.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Panel className="p-8 space-y-6 shadow-lg border-none ring-1 ring-[var(--line)]">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-[var(--font-heading)]">Email</h2>
            <p className="text-muted">For general inquiries, support, or partnership opportunities.</p>
            <a href="mailto:hello@imaralabs.co.tz" className="text-blue-600 font-bold hover:underline block text-lg">
              hello@imaralabs.co.tz
            </a>
          </Panel>

          <Panel className="p-8 space-y-6 shadow-lg border-none ring-1 ring-[var(--line)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-[var(--font-heading)]">Social</h2>
            <p className="text-muted">Follow us on social media for updates and community news.</p>
            <div className="flex gap-4">
               <a href="#" className="font-bold text-emerald-600 hover:underline">Twitter</a>
               <a href="#" className="font-bold text-emerald-600 hover:underline">Instagram</a>
            </div>
          </Panel>
        </div>

        <div className="mt-16">
          <Panel className="p-8 md:p-12 bg-[var(--surface-strong)]/30 border-none text-center rounded-[32px]">
             <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-6">Want to build with us?</h2>
             <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
               Imara Labs partners with organizations to build custom digital solutions. Reach out to discuss your next project.
             </p>
             <a 
               href="https://imaralabs.co.tz" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[var(--accent-strong)] transition-all shadow-xl shadow-emerald-900/10"
             >
               Explore Imara Labs
             </a>
          </Panel>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

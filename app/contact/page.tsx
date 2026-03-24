import { StaticPageLayout } from '@/components/ui/static-page-layout';
import { Panel } from '@/components/ui/panel';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <StaticPageLayout 
      title="Contact Us" 
      subtitle="We are here to help and listen to your feedback."
    >
      <div className="space-y-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Panel className="p-8 space-y-6 shadow-sm border-none ring-1 ring-[var(--line)] hover:ring-[var(--gold)]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-[var(--font-heading)] uppercase tracking-wider">Email</h2>
            <p className="text-muted text-sm leading-relaxed">For general inquiries, support, or partnership opportunities.</p>
            <a href="mailto:hello@imaralabs.co.tz" className="text-[var(--gold)] font-bold hover:underline block text-lg">
              hello@imaralabs.co.tz
            </a>
          </Panel>

          <Panel className="p-8 space-y-6 shadow-sm border-none ring-1 ring-[var(--line)] hover:ring-[var(--gold)]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-[var(--font-heading)] uppercase tracking-wider">Social</h2>
            <p className="text-muted text-sm leading-relaxed">Follow us on social media for updates and community news.</p>
            <div className="flex gap-4">
               <a href="#" className="font-bold text-[var(--gold)] hover:underline">Twitter</a>
               <a href="#" className="font-bold text-[var(--gold)] hover:underline">Instagram</a>
            </div>
          </Panel>
        </div>

        <div className="mt-8">
          <Panel className="p-8 md:p-12 bg-emerald-50/50 border-none ring-1 ring-emerald-100 text-center rounded-[32px]">
             <h2 className="text-2xl font-bold font-[var(--font-heading)] text-emerald-900 mb-6 uppercase tracking-widest">Want to build with us?</h2>
             <p className="text-lg text-slate-700 mb-8 max-w-xl mx-auto">
               Imara Labs partners with organizations to build custom digital solutions. Reach out to discuss your next project.
             </p>
             <a 
               href="https://imaralabs.co.tz" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-900/10"
             >
               Explore Imara Labs
             </a>
          </Panel>
        </div>
      </div>
    </StaticPageLayout>
  );
}


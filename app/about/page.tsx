import { StaticPageLayout } from '@/components/ui/static-page-layout';
import { ExternalLink, Users, Code, Globe } from 'lucide-react';
import { Panel } from '@/components/ui/panel';

export default function AboutPage() {
  return (
    <StaticPageLayout 
      title="About Quran Khatma" 
      subtitle="A digital space for shared remembrance and spiritual growth."
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--gold)] uppercase tracking-widest flex items-center gap-3">
            <Users className="text-[var(--accent)] h-6 w-6" /> Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            Quran Khatma was built to help families and communities coordinate Quran completions (Khatm) for their loved ones. We believe that technology should serve our spiritual needs in a way that is calm, respectful, and private.
          </p>
        </section>

        <Panel className="bg-emerald-50/50 p-8 md:p-12 border-none ring-1 ring-emerald-100 rounded-[32px] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Globe className="w-64 h-64 text-emerald-900" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="space-y-6 flex-1">
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-emerald-900 flex items-center gap-3 uppercase tracking-widest">
                <Code className="text-emerald-600 h-6 w-6" /> Developed by Imara Labs
              </h2>
              <p className="text-lg leading-relaxed text-slate-700">
                Imara Labs is a technology studio dedicated to building impactful digital solutions for the African continent and beyond. We focus on creating elegant, user-centric applications that solve real-world problems.
              </p>
              <a 
                href="https://imaralabs.co.tz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-900/10"
              >
                Visit Official Website <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Panel>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--gold)] uppercase tracking-widest">How we build</h2>
          <p className="text-lg leading-relaxed text-muted">
            Every pixel and line of code in this application is crafted with intentionality. We prioritize accessibility, performance, and internationalization to ensure that the app is useful for everyone.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}


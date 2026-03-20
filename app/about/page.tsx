import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Panel } from '@/components/ui/panel';
import { ExternalLink, Users, Code, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="page-shell pb-0">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-16 text-center">
          <h1 className="hero-title text-5xl mb-6">About Quran Khatma</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            A digital space for shared remembrance and spiritual growth.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold font-[var(--font-heading)] flex items-center gap-3">
              <Users className="text-[var(--accent)]" /> Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              Quran Khatma was built to help families and communities coordinate Quran completions (Khatm) for their loved ones. We believe that technology should serve our spiritual needs in a way that is calm, respectful, and private.
            </p>
          </section>

          <Panel className="bg-emerald-50/50 p-8 md:p-12 border-none ring-1 ring-emerald-100 rounded-[32px]">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="space-y-6 flex-1">
                <h2 className="text-3xl font-bold font-[var(--font-heading)] flex items-center gap-3">
                  <Code className="text-emerald-600" /> Developed by Imara Labs
                </h2>
                <p className="text-lg leading-relaxed text-slate-700">
                  Imara Labs is a technology studio dedicated to building impactful digital solutions for the African continent and beyond. We focus on creating elegant, user-centric applications that solve real-world problems.
                </p>
                <a 
                  href="https://imaralabs.co.tz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10"
                >
                  Visit Official Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="w-full md:w-64 h-64 bg-white rounded-2xl shadow-inner flex items-center justify-center border border-emerald-100">
                 <Globe className="w-32 h-32 text-emerald-100" />
              </div>
            </div>
          </Panel>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold font-[var(--font-heading)]">How we build</h2>
            <p className="text-lg leading-relaxed text-muted">
              Every pixel and line of code in this application is crafted with intentionality. We prioritize accessibility, performance, and internationalization (supporting both English and Swahili) to ensure that the app is useful for everyone.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

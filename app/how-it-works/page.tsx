import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Panel } from '@/components/ui/panel';
import { BookOpen, Share2, ScrollText, CheckCircle2, HelpCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Create a Khatma',
      description: 'Start by filling in the name of the deceased and your name. You can also add a completion date and a special dedication note.',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Share with Community',
      description: 'Once created, you receive a unique link. Share this via WhatsApp, social media, or email to invite others to participate.',
      icon: Share2,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Track Progress',
      description: 'Participants select and claim juz parts to recite. As they complete their recitation, the progress bar updates in real-time.',
      icon: ScrollText,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Complete and Dua',
      description: 'After all 30 juz are completed, the khatma is marked as done. You can then view and recite the final Khatam-ul-Quran Dua.',
      icon: CheckCircle2,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const faqs = [
    {
      q: 'Do I need to create an account?',
      a: 'No, you can create a local draft without an account. However, to share it with others and have it update live, you need to sign in as an organizer.'
    },
    {
      q: 'Can multiple people read the same Juz?',
      a: 'No, once a Juz is claimed, it becomes unavailable for others until it is either completed or released by the participant or organizer.'
    },
    {
      q: 'How long does a Khatma stay active?',
      a: 'A shared Khatma stays active until it is completed or deleted by the organizer. Local drafts stay on your device until the browser cache is cleared.'
    }
  ];

  return (
    <main className="page-shell pb-0">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-16 text-center">
          <h1 className="hero-title text-5xl mb-6">How it Works</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Quran Khatma makes it easy to organize collective Quran recitations for your loved ones in a few simple steps.
          </p>
        </div>

        <div className="grid gap-8 mb-24">
          {steps.map((step, idx) => (
            <Panel key={idx} className="flex flex-col md:flex-row gap-8 items-start p-8 shadow-lg border-none ring-1 ring-[var(--line)]">
              <div className={`shrink-0 w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-[var(--font-heading)]">{step.title}</h2>
                <p className="text-muted leading-relaxed text-lg">{step.description}</p>
              </div>
            </Panel>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <HelpCircle className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="text-3xl font-bold font-[var(--font-heading)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <Panel key={idx} className="p-6 bg-[var(--surface-soft)] border-none">
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-muted leading-relaxed">{faq.a}</p>
              </Panel>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

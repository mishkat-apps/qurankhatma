import { StaticPageLayout } from '@/components/ui/static-page-layout';
import { Panel } from '@/components/ui/panel';
import { BookOpen, Share2, ScrollText, CheckCircle2, HelpCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Create a Khatma',
      description: 'Start by filling in the name of the deceased and your name. You can also add a completion date and a special dedication note.',
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      title: 'Share with Community',
      description: 'Once created, you receive a unique link. Share this via WhatsApp, social media, or email to invite others to participate.',
      icon: Share2,
      color: 'bg-teal-100 text-teal-700'
    },
    {
      title: 'Track Progress',
      description: 'Participants select and claim juz parts to recite. As they complete their recitation, the progress bar updates in real-time.',
      icon: ScrollText,
      color: 'bg-gold/10 text-[var(--gold)]'
    },
    {
      title: 'Complete and Dua',
      description: 'After all 30 juz are completed, the khatma is marked as done. You can then view and recite the final Khatam-ul-Quran Dua.',
      icon: CheckCircle2,
      color: 'bg-emerald-600 text-white'
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
    <StaticPageLayout 
      title="How it Works" 
      subtitle="Quran Khatma makes it easy to organize collective Quran recitations for your loved ones in a few simple steps."
    >
      <div className="space-y-16">
        <div className="grid gap-6">
          {steps.map((step, idx) => (
            <Panel key={idx} className="flex flex-col md:flex-row gap-8 items-start p-8 shadow-sm border-none ring-1 ring-[var(--line)] hover:ring-[var(--gold)]/30 transition-all">
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-sm`}>
                <step.icon className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold font-[var(--font-heading)] uppercase tracking-wider">{step.title}</h2>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </div>
            </Panel>
          ))}
        </div>

        <div className="pt-12 border-t border-[var(--line)]">
          <div className="flex items-center gap-3 mb-10">
            <HelpCircle className="w-6 h-6 text-[var(--gold)]" />
            <h2 className="text-2xl font-bold font-[var(--font-heading)] uppercase tracking-widest text-[var(--gold)]">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-2xl bg-[var(--surface-soft)] ring-1 ring-[var(--line)]">
                <h3 className="font-bold text-[var(--foreground)]">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}


'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, ScrollText, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DraftStore } from '@/lib/data/draft-store';
import type { LocalKhatmaDraft } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { formatDate, cn } from '@/lib/utils';
import { KhatmaForm } from '@/components/khatma/khatma-form';

export default function HomePage() {
  const router = useRouter();
  const { user, sessionState } = useAuth();
  const { pushToast } = useToast();
  const [drafts, setDrafts] = useState<LocalKhatmaDraft[]>([]);
  const hasDrafts = useMemo(() => drafts.length > 0, [drafts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ds = new DraftStore(window.localStorage);
      setDrafts(ds.listDrafts());
    }
  }, []);

  return (
    <>
      <main className="page-shell pb-0 overflow-x-hidden">
        <SiteHeader />

        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 md:px-6">
          {hasDrafts && (
            <section className="pt-12 pb-0">
              <div className="mb-6">
                <p className="section-title text-[10px] font-bold tracking-[0.2em] mb-2 uppercase opacity-60">Your Progress</p>
                <h2 className="font-[var(--font-heading)] text-xl font-bold">Local Drafts</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft, idx) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Panel
                      className="glass-card group flex cursor-pointer flex-col justify-between space-y-3 border-none p-4 transition-all hover:bg-white/90 active:scale-[0.98]"
                      onClick={() => router.push(`/draft?id=${draft.id}`)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="line-clamp-1 font-bold text-[var(--foreground)]">{draft.deceasedName}</h3>
                          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--accent-strong)]">Draft</span>
                        </div>
                        <p className="line-clamp-1 text-xs text-muted">{draft.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{formatDate(draft.updatedAt)}</span>
                        <span className="font-bold text-[var(--accent)] transition-colors group-hover:text-[var(--accent-strong)]">View Details →</span>
                      </div>
                    </Panel>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 border-b border-[var(--line)] opacity-40" />
            </section>
          )}

          {/* ── Hero ── */}
          <section className={cn(
            "grid items-center gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]",
            hasDrafts ? "pt-12 pb-[var(--section-spacing-val)]" : "section-spacing"
          )}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h1 className="hero-title text-balance">
                Shared remembrance,{' '}
                <span className="text-[var(--accent)] italic">done with care.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
                Create private Quran khatmas, share them with your community, and track
                completion — all in one calm, respectful space.
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                {sessionState !== 'organizer' && (
                  <Button
                    tone="secondary"
                    className="h-12 px-8 text-base"
                    onClick={() => { window.location.href = '/auth/signin'; }}
                  >
                    Sign In / Sign Up
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <Panel className="glass-card relative overflow-hidden border-none p-0 shadow-2xl ring-1 ring-[var(--line)]">
                <div className="absolute -inset-4 rounded-[40px] bg-[linear-gradient(160deg,var(--accent-soft),var(--surface))] opacity-20 blur-2xl" />
                <div className="relative p-6">
                  <div className="mb-6">
                    <h2 className="font-[var(--font-heading)] text-2xl font-bold">
                      {sessionState === 'organizer' ? 'Create a Khatma' : 'Start a Khatma'}
                    </h2>
                    <p className="text-sm text-muted">
                      {sessionState === 'organizer'
                        ? 'Quickly create a shared khatma board.'
                        : 'Begin a private draft for a loved one.'}
                    </p>
                  </div>

                  <KhatmaForm isHero />
                </div>
              </Panel>
            </motion.div>
          </section>

          {/* ── How it works ── */}
          <section className="section-spacing border-t border-[var(--line)]">
            <div className="mb-10 text-center">
              <p className="section-title text-xs font-bold tracking-[0.2em] mb-3 uppercase">Process</p>
              <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl">Three simple steps</h2>
              <p className="mt-4 text-muted max-w-lg mx-auto">Getting started is easy and takes less than a minute.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: '01', title: 'Create', desc: 'Fill in the deceased name, your name, and an optional note. Everything stays local until you choose to share.', icon: BookOpen },
                { step: '02', title: 'Share', desc: 'Sign in and publish your draft. A unique link is created for your community to join the khatma.', icon: Share2 },
                { step: '03', title: 'Complete', desc: 'Participants claim and complete juz parts. Progress updates live for everyone.', icon: ScrollText },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Panel className="group relative h-full space-y-4 transition-all hover:-translate-y-2 hover:shadow-xl">
                    <span className="absolute -right-2 -top-4 font-[var(--font-heading)] text-8xl text-[var(--accent-soft)] opacity-20 transition-opacity group-hover:opacity-40">{item.step}</span>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-[var(--font-heading)] text-2xl font-bold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
                  </Panel>
                </motion.div>
              ))}
            </div>
          </section>



        </div>

        <SiteFooter />
      </main>
    </>
  );
}

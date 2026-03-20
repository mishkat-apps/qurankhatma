'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, ScrollText, Share2 } from 'lucide-react';
import { DraftStore } from '@/lib/data/draft-store';
import type { LocalKhatmaDraft } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { promoteDraftToCloud } from '@/lib/repositories/cloud-khatmas';

export default function HomePage() {
  const router = useRouter();
  const { user, sessionState } = useAuth();
  const { pushToast } = useToast();
  const [store, setStore] = useState<DraftStore | null>(null);
  const [drafts, setDrafts] = useState<LocalKhatmaDraft[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    deceasedName: '',
    organizerName: '',
    description: '',
    targetDate: '',
  });

  useEffect(() => {
    const nextStore = new DraftStore(window.localStorage);
    setStore(nextStore);
    setDrafts(nextStore.listDrafts());
  }, []);

  const hasDrafts = useMemo(() => drafts.length > 0, [drafts]);

  const handleCreateDraft = async () => {
    if (!form.deceasedName.trim() || !form.organizerName.trim()) {
      pushToast({ 
        title: 'Please provide both the deceased name and your name.', 
        tone: 'error' 
      });
      return;
    }
    
    if (!store) return;
    setIsCreating(true);
    
    const draftData = {
      deceasedName: form.deceasedName.trim(),
      organizerName: form.organizerName.trim(),
      description: form.description.trim(),
      targetDate: form.targetDate ? new Date(form.targetDate.split('/').reverse().join('-')).toISOString() : null,
    };

    if (sessionState === 'organizer' && user) {
      try {
        const token = await user.getIdToken();
        const temporaryDraft = {
          ...draftData,
          id: 'temp-' + Date.now(),
          mode: 'local' as const,
          status: 'active' as const,
          ownerLabel: draftData.organizerName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          juz: [],
        };
        const khatmaResponse = await promoteDraftToCloud({ 
          draft: temporaryDraft as any, 
          currentUser: user,
          token 
        });
        pushToast({ title: 'Khatma created successfully!', tone: 'success' });
        router.push(`/khatma/${khatmaResponse.id}`);
        return;
      } catch (error) {
        console.error('Khatma creation failed:', error);
        pushToast({ 
          title: error instanceof Error ? error.message : 'Failed to create khatma. Saving as local draft instead.', 
          tone: 'error' 
        });
      } finally {
        setIsCreating(false);
      }
    }
    
    try {
      const newDraft = store.createDraft(draftData);
      
      if (newDraft) {
        router.push(`/draft/${newDraft.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <main className="page-shell pb-0 overflow-x-hidden">
        <SiteHeader />
        
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 md:px-6">
          {/* ── Hero ── */}
          <section className="section-spacing grid items-center gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
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
                    Sign In
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

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Deceased Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Abdullah bin Ahmed"
                        className="w-full rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={form.deceasedName}
                        onChange={(e) => setForm({ ...form, deceasedName: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Public organizer name"
                        className="w-full rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={form.organizerName}
                        onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Completion Date (Optional)</label>
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        className="w-full rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={form.targetDate}
                        onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description (Optional)</label>
                      <textarea
                        placeholder="A short message for participants..."
                        rows={2}
                        className="w-full resize-none rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>

                    <Button
                      size="lg"
                      className="w-full py-6 text-base shadow-lg hover:shadow-[0_0_20px_var(--accent-soft)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={handleCreateDraft}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        sessionState === 'organizer' ? 'Create Khatma' : 'Create Draft'
                      )}
                    </Button>
                    
                    <p className="text-center text-[10px] text-muted-foreground">
                      {sessionState === 'organizer'
                        ? 'Khatma will be created in the cloud'
                        : 'No sign-in required to begin'}
                    </p>
                  </div>
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

          {/* ── Drafts ── */}
          {hasDrafts && (
            <section className="section-spacing border-t border-[var(--line)]">
              <div className="mb-8">
                <p className="section-title text-xs font-bold tracking-[0.2em] mb-3 uppercase">Your Progress</p>
                <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl">Local Drafts</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft, idx) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Panel className="glass-card group flex h-full flex-col justify-between space-y-4 border-none transition-all hover:bg-white/90">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="line-clamp-1 font-bold text-[var(--foreground)]">{draft.deceasedName}</h3>
                          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">Draft</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted">{draft.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">{formatDate(draft.updatedAt)}</span>
                        <Button
                          tone="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs font-bold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => router.push(`/draft/${draft.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Panel>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </div>
        
        <SiteFooter />
      </main>
    </>
  );
}

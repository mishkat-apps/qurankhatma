'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, HeartHandshake, Calendar, AlertCircle } from 'lucide-react';
import { DraftStore } from '@/lib/data/draft-store';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { promoteDraftToCloud } from '@/lib/repositories/cloud-khatmas';
import { motion } from 'framer-motion';

export default function StartPage() {
  const router = useRouter();
  const { user, sessionState } = useAuth();
  const { pushToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    deceasedName: '',
    organizerName: '',
    description: '',
    targetDate: '',
  });

  const handleCreate = async () => {
    if (!form.deceasedName.trim() || !form.organizerName.trim()) {
      pushToast({ 
        title: 'Please provide both the deceased name and your name.', 
        tone: 'error' 
      });
      return;
    }
    
    setIsCreating(true);
    const store = new DraftStore(window.localStorage);
    
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
      <main className="page-shell pb-0">
        <SiteHeader />
        
        <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pt-12 md:px-6 md:pt-20">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6 mx-auto">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h1 className="hero-title text-5xl mb-4">Start a Khatma</h1>
            <p className="text-lg text-muted">Organize a collective recitation for a loved one.</p>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Panel className="glass-card border-none p-8 md:p-10 shadow-2xl ring-1 ring-[var(--line)]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    Deceased Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Abdullah bin Ahmed"
                    className="w-full rounded-xl bg-[var(--surface)] px-5 py-3.5 text-base ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={form.deceasedName}
                    onChange={(e) => setForm({ ...form, deceasedName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Public organizer name"
                    className="w-full rounded-xl bg-[var(--surface)] px-5 py-3.5 text-base ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={form.organizerName}
                    onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Completion Date (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="w-full rounded-xl bg-[var(--surface)] px-5 py-3.5 text-base ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      value={form.targetDate}
                      onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description (Optional)</label>
                  <textarea
                    placeholder="A short message for participants..."
                    rows={4}
                    className="w-full resize-none rounded-xl bg-[var(--surface)] px-5 py-3.5 text-base ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full py-8 text-lg font-bold shadow-xl hover:shadow-[0_0_30px_var(--accent-soft)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    onClick={handleCreate}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      sessionState === 'organizer' ? 'Create Shared Khatma' : 'Start Private Draft'
                    )}
                  </Button>
                </div>
                
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {sessionState === 'organizer'
                    ? 'This khatma will be public and shared via link'
                    : 'Saved locally. You can share this later after signing in.'}
                </p>
              </div>
            </Panel>
          </motion.div>
        </div>
        
        <SiteFooter />
      </main>
    </>
  );
}

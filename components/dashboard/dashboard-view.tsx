'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { BookOpen, Clock3, ExternalLink, FolderHeart, History, Sparkles, LayoutGrid, Trash2, Loader2 } from 'lucide-react';
import type { CloudKhatma, LocalKhatmaDraft } from '@/lib/types';
import { splitCloudKhatmas } from '@/lib/domain/khatma';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { DraftStore } from '@/lib/data/draft-store';
import { deleteCloudKhatma } from '@/lib/repositories/cloud-khatmas';

interface DashboardViewProps {
  localDrafts: LocalKhatmaDraft[];
  cloudKhatmas: CloudKhatma[];
  isOrganizer: boolean;
}

type Tab = 'drafts' | 'active' | 'history';

function ProgressBar({ completed, total = 30 }: { completed: number; total?: number }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
        <span>{completed}/{total} completed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]/50 ring-1 ring-inset ring-black/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] shadow-[0_0_8px_rgba(15,118,110,0.3)]" 
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; action?: React.ReactNode }) {
  return (
    <Panel className="glass-card flex flex-col items-center gap-4 py-16 text-center border-none ring-1 ring-[var(--line)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-strong)]/50">
        <Icon className="h-8 w-8 text-[var(--gold)]" />
      </div>
      <div className="space-y-2">
        <h3 className="font-[var(--font-heading)] text-3xl">{title}</h3>
        <p className="max-w-sm text-base text-muted text-balance">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </Panel>
  );
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 400 
    } 
  }
};

export function DashboardView({ localDrafts, cloudKhatmas }: DashboardViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const split = splitCloudKhatmas(cloudKhatmas);

  const handleDeleteDraft = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    const store = new DraftStore(window.localStorage);
    store.deleteDraft(id);
    pushToast({ title: 'Draft deleted', tone: 'success' });
    window.location.reload(); // Quick way to refresh local drafts
  };

  const handleDeleteCloud = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this shared khatma? This cannot be undone.')) return;
    
    if (!user) return;
    setIsDeleting(id);
    try {
      const token = await user.getIdToken();
      await deleteCloudKhatma({ khatmaId: id, token });
      pushToast({ title: 'Khatma deleted', tone: 'success' });
      // The subscription in the parent page will handle the UI update
    } catch (error) {
      pushToast({ 
        title: error instanceof Error ? error.message : 'Failed to delete khatma', 
        tone: 'error' 
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'active', label: 'Active shared', count: split.active.length },
    { key: 'history', label: 'Completed', count: split.history.length },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Stats row */}
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { icon: FolderHeart, label: 'Local drafts', val: localDrafts.length },
          { icon: Sparkles, label: 'Active shared', val: split.active.length },
          { icon: History, label: 'Completed', val: split.history.length }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Panel className="glass-card flex items-center gap-5 border-none p-6 ring-1 ring-[var(--line)] shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                <stat.icon className="h-7 w-7 text-[var(--accent)]" />
              </div>
              <div>
                <div className="section-title text-xs font-bold tracking-widest">{stat.label}</div>
                <div className="font-[var(--font-heading)] text-4xl text-[var(--foreground)]">{stat.val}</div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </motion.section>
      
      {/* Local Drafts Section - Moved to top */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="section-title text-[10px] font-bold tracking-[0.2em] uppercase">Local Drafts</div>
          {localDrafts.length > 0 && (
            <span className="text-[10px] font-bold bg-[var(--accent-soft)] text-[var(--accent-strong)] px-2 py-0.5 rounded-full">
              {localDrafts.length}
            </span>
          )}
        </div>
        
        {localDrafts.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {localDrafts.map((draft) => (
              <motion.div key={draft.id} variants={item}>
                <Link href={`/draft?id=${draft.id}`}>
                  <Panel className="glass-card group flex h-full flex-col justify-between border-none p-5 ring-1 ring-[var(--line)] shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg active:scale-[0.99]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-strong)]/50">
                          <FolderHeart className="h-4 w-4 text-[var(--gold)]" />
                        </div>
                        <button
                          onClick={(e) => handleDeleteDraft(e, draft.id)}
                          className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="font-[var(--font-heading)] text-2xl leading-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{draft.deceasedName}</div>
                        {draft.organizerName && (
                          <p className="text-[10px] font-medium text-muted">by {draft.organizerName}</p>
                        )}
                        <p className="line-clamp-1 text-xs leading-relaxed text-muted">{draft.description || 'No dedication note yet.'}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 pt-3 border-t border-[var(--line)]/50">
                      <ProgressBar completed={draft.juz?.filter((j) => j.state === 'completed').length ?? 0} />
                    </div>
                  </Panel>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Panel className="glass-card flex flex-col items-center gap-3 py-10 text-center border-none ring-1 ring-[var(--line)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-strong)]/50">
              <FolderHeart className="h-6 w-6 text-[var(--gold)]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-[var(--font-heading)] text-xl">No drafts yet</h3>
              <p className="max-w-xs text-xs text-muted">Create a local draft to start a private Quran completion.</p>
            </div>
            <Link href="/"><Button size="sm"><BookOpen className="h-4 w-4" />Create a draft</Button></Link>
          </Panel>
        )}
      </section>

      <div className="space-y-6">
        {/* Tabs */}
        <div className="inline-flex w-full items-center justify-start">
          <div className="flex w-full max-w-2xl gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.4)] p-1.5 backdrop-blur-md shadow-inner md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-tight transition-all md:flex-initial ${
                  activeTab === tab.key
                    ? 'text-white'
                    : 'text-muted hover:text-[var(--foreground)]'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] shadow-lg shadow-emerald-900/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span className={`relative z-10 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-[var(--surface-strong)]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >

              {activeTab === 'active' && (
                <section>
                  {split.active.length > 0 ? (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                      {split.active.map((khatma) => (
                        <motion.div key={khatma.id} variants={item}>
                          <Link href={`/khatma?id=${khatma.id}`}>
                            <Panel className="glass-card group flex h-full flex-col justify-between border-none p-6 ring-1 ring-[var(--line)] shadow-md transition-all hover:translate-y-[-4px] hover:shadow-xl active:scale-[0.98]">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => handleDeleteCloud(e, khatma.id)}
                                      disabled={isDeleting === khatma.id}
                                      className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                    >
                                      {isDeleting === khatma.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </button>
                                    <ExternalLink className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="font-[var(--font-heading)] text-3xl leading-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{khatma.deceasedName}</div>
                                  {khatma.organizerName && (
                                    <p className="text-xs font-medium text-muted">by {khatma.organizerName}</p>
                                  )}
                                  <p className="line-clamp-2 text-sm leading-relaxed text-muted">{khatma.description || 'No dedication note yet.'}</p>
                                </div>
                              </div>
                              <div className="mt-6 space-y-4 pt-4 border-t border-[var(--line)]/50">
                                <ProgressBar completed={khatma.completedCount} />
                                <div className="flex items-center gap-2 text-xs font-medium text-muted">
                                  <Clock3 className="h-4 w-4" />
                                  {formatDate(khatma.targetDate)}
                                </div>
                              </div>
                            </Panel>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <EmptyState
                      icon={Sparkles}
                      title="No active shared khatmas"
                      description="Join a shared khatma or promote one of your drafts to collaborate with others."
                      action={<Link href="/"><Button size="lg"><LayoutGrid className="h-4 w-4" />Explore</Button></Link>}
                    />
                  )}
                </section>
              )}

              {activeTab === 'history' && (
                <section>
                  {split.history.length > 0 ? (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                      {split.history.map((khatma) => (
                        <motion.div key={khatma.id} variants={item}>
                          <Link href={`/khatma?id=${khatma.id}`}>
                            <Panel className="glass-card group flex h-full flex-col justify-between border-none p-6 ring-1 ring-[var(--line)] shadow-md transition-all hover:translate-y-[-4px] hover:shadow-xl active:scale-[0.98]">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="section-title text-[10px] font-bold tracking-[0.2em]">Completed</div>
                                  <History className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                  <div className="font-[var(--font-heading)] text-3xl leading-tight text-[var(--foreground)] opacity-60 group-hover:opacity-100 transition-opacity">{khatma.deceasedName}</div>
                                  <p className="line-clamp-2 text-sm leading-relaxed text-muted">{khatma.description || 'No dedication note yet.'}</p>
                                </div>
                              </div>
                              <div className="mt-6 space-y-4 pt-4 border-t border-[var(--line)]/50">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Successfully Completed</span>
                                  <span className="text-xs text-muted">{formatDate(khatma.updatedAt)}</span>
                                </div>
                                <ProgressBar completed={khatma.completedCount} />
                              </div>
                            </Panel>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <EmptyState
                      icon={History}
                      title="No history yet"
                      description="Once you complete a khatma, it will appear here in your spiritual legacy."
                    />
                  )}
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

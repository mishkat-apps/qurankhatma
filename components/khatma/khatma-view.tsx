'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Share2, Users, WandSparkles, CheckCircle2, Clock3, LayoutGrid, Trash2, Pencil, X } from 'lucide-react';
import type { JuzRecord } from '@/lib/types';
import { summarizeJuzRecords } from '@/lib/domain/khatma';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { JuzCard } from '@/components/khatma/juz-card';

interface KhatmaViewProps {
  title: string;
  description: string;
  targetDate: string | null;
  ownerLabel: string;
  mode: 'local' | 'cloud';
  juz: JuzRecord[];
  viewerUid: string | null;
  isOrganizer: boolean;
  shareActionLabel: string;
  shareHint: string;
  busy?: boolean;
  onShare: () => void;
  onClaim: (juzNumber: number, name: string) => Promise<void> | void;
  onComplete: (juzNumber: number) => Promise<void> | void;
  onUndo: (juzNumber: number) => Promise<void> | void;
  onRelease: (juzNumber: number) => Promise<void> | void;
  onOrganizerRelease: (juzNumber: number) => Promise<void> | void;
  onSaveMeta?: (payload: { description: string; targetDate: string | null }) => Promise<void> | void;
  onDelete?: () => void;
}

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export function KhatmaView(props: KhatmaViewProps) {
  const summary = useMemo(() => summarizeJuzRecords(props.juz), [props.juz]);
  const [claimingJuz, setClaimingJuz] = useState<number | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [tempDescription, setTempDescription] = useState(props.description);
  const [tempTargetDate, setTempTargetDate] = useState(props.targetDate ?? '');

  const today = new Date().toISOString().split('T')[0];

  const handleClaimSubmit = () => {
    if (claimingJuz !== null && participantName.trim()) {
      props.onClaim(claimingJuz, participantName.trim());
      setClaimingJuz(null);
      setParticipantName('');
    }
  };

  const handleSaveMeta = async () => {
    if (props.onSaveMeta) {
      await props.onSaveMeta({
        description: tempDescription,
        targetDate: tempTargetDate || null,
      });
      setIsEditingMeta(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-emerald-900/20">
              <LayoutGrid size={20} />
            </div>
            <h1 className="font-[var(--font-heading)] text-5xl md:text-6xl text-[var(--foreground)] tracking-tight">
              {props.title}
            </h1>
          </div>
          <div className="group relative">
            <p className="max-w-xl text-lg text-muted leading-relaxed">
              {props.description}
            </p>
            {props.isOrganizer && props.onSaveMeta && (
              <button 
                onClick={() => {
                  setTempDescription(props.description);
                  setTempTargetDate(props.targetDate ?? '');
                  setIsEditingMeta(true);
                }}
                className="absolute -right-8 top-0 p-2 text-muted/40 hover:text-[var(--accent)] transition-colors"
                title="Edit details"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <div 
              className={`flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/50 px-5 py-2.5 backdrop-blur-sm shadow-sm transition-all ${props.isOrganizer ? 'cursor-pointer hover:shadow-md hover:border-[var(--accent)]' : ''}`}
              onClick={() => {
                if (props.isOrganizer && props.onSaveMeta) {
                  setTempDescription(props.description);
                  setTempTargetDate(props.targetDate ?? '');
                  setIsEditingMeta(true);
                }
              }}
            >
              <CalendarClock size={18} className="text-[var(--gold)]" />
              <span className="text-sm font-medium">Target: {props.targetDate ? formatDate(props.targetDate) : 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/50 px-5 py-2.5 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
              <Users size={18} className="text-[var(--accent)]" />
              <span className="text-sm font-medium">Organizer: {props.ownerLabel}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Panel className="glass-card flex h-full flex-col justify-between p-8 ring-1 ring-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[var(--accent)]/5 blur-[80px] rounded-full" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-strong)] uppercase">Global Status</span>
                <h3 className="font-[var(--font-heading)] text-3xl">Progress Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--surface)] p-4 ring-1 ring-[var(--line)]">
                  <div className="text-2xl font-bold text-[var(--gold)]">{summary.claimedCount}</div>
                  <div className="text-xs text-muted uppercase tracking-wider font-semibold">Claimed</div>
                </div>
                <div className="rounded-2xl bg-[var(--surface)] p-4 ring-1 ring-[var(--line)]">
                  <div className="text-2xl font-bold text-emerald-600">{summary.completedCount}</div>
                  <div className="text-xs text-muted uppercase tracking-wider font-semibold">Complete</div>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Overall Completion</span>
                  <span className="text-[var(--accent-strong)]">{summary.completionRatio}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--line)] p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.completionRatio}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)]" 
                  />
                </div>
              </div>
            </div>
            <Button size="lg" className="relative mt-8 w-full group overflow-hidden shadow-lg shadow-emerald-900/10" onClick={props.onShare} disabled={props.busy}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Share2 size={18} className="mr-2 transition-transform group-hover:scale-110" />
              {props.shareActionLabel}
            </Button>

            {props.onDelete && (
              <Button 
                tone="secondary" 
                size="sm" 
                className="mt-4 w-full border-red-100 bg-red-50/30 text-red-600 hover:bg-red-50 hover:text-red-700" 
                onClick={props.onDelete}
                disabled={props.busy}
              >
                <Trash2 size={16} className="mr-2" />
                {props.mode === 'local' ? 'Delete Draft' : 'Delete Khatma'}
              </Button>
            )}
          </Panel>
        </motion.div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <h2 className="section-title text-sm tracking-[0.15em] mb-0">Participation Board</h2>
            </div>
            <p className="text-muted text-sm">Select a juz part to contribute to this khatma.</p>
          </div>
          <div className="flex items-center gap-6 rounded-2xl bg-[var(--surface)] px-6 py-3 ring-1 ring-[var(--line)] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--line)]" />
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--gold)]" />
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">Claimed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">Done</span>
            </div>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {props.juz.length === 0 ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton h-[180px] w-full rounded-[32px] opacity-20" />
            ))
          ) : (
            props.juz.map((record) => (
              <motion.div key={record.juzNumber} variants={item}>
                <JuzCard
                  record={record as any}
                  viewerUid={props.viewerUid}
                  isOrganizer={props.isOrganizer}
                  onClaim={(juzNumber) => setClaimingJuz(juzNumber)}
                  onComplete={props.onComplete}
                  onUndo={props.onUndo}
                  onRelease={props.onRelease}
                  onOrganizerRelease={props.onOrganizerRelease}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimingJuz !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClaimingJuz(null)}
              className="absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5"
            >
              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] px-8 py-10 text-white text-center">
                <WandSparkles className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <h3 className="font-[var(--font-heading)] text-3xl">Claim Juz {claimingJuz}</h3>
                <p className="mt-2 text-sm text-white/70">Join this khatma by committing to read this part.</p>
              </div>
              <div className="p-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted/60 px-1">Participant Name</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Enter your name"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleClaimSubmit()}
                      className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-base outline-none transition-all focus:bg-white"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button tone="secondary" className="flex-1 h-12 rounded-2xl" onClick={() => setClaimingJuz(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl shadow-lg shadow-emerald-900/10" onClick={handleClaimSubmit}>
                      Claim Part
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Meta Modal */}
      <AnimatePresence>
        {isEditingMeta && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingMeta(false)}
              className="absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5"
            >
              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] px-8 py-8 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-[var(--font-heading)] text-3xl">Edit Details</h3>
                  <button onClick={() => setIsEditingMeta(false)} className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted/60 px-1">Description</label>
                    <textarea
                      placeholder="Enter a description or message"
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="focus-ring w-full min-h-[120px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-base outline-none transition-all focus:bg-white resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted/60 px-1">Target Completion Date</label>
                    <input
                      type="date"
                      min={today}
                      value={tempTargetDate}
                      onChange={(e) => setTempTargetDate(e.target.value)}
                      className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-base outline-none transition-all focus:bg-white"
                    />
                    <p className="text-xs text-muted/60 px-1 mt-1">Leave empty if no specific target date.</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button tone="secondary" className="flex-1 h-12 rounded-2xl" onClick={() => setIsEditingMeta(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl shadow-lg shadow-emerald-900/10" onClick={handleSaveMeta}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

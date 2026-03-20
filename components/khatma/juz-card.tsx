'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, LockKeyhole, RotateCcw, UserRound, Sparkles } from 'lucide-react';
import type { JuzRecord } from '@/lib/types';
import { initials } from '@/lib/utils';
import { juzCatalog } from '@/lib/constants/quran';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';

interface JuzCardProps {
  record: JuzRecord;
  viewerUid: string | null;
  isOrganizer: boolean;
  onClaim: (juzNumber: number) => void;
  onComplete: (juzNumber: number) => void;
  onRelease: (juzNumber: number) => void;
  onOrganizerRelease: (juzNumber: number) => void;
}

export function JuzCard({ record, viewerUid, isOrganizer, onClaim, onComplete, onRelease, onOrganizerRelease }: JuzCardProps) {
  const info = juzCatalog.find((item) => item.id === record.juzNumber);
  const isMine = Boolean(viewerUid) && record.participantUid === viewerUid;

  const stateStyles = {
    available: 'bg-white/60 ring-1 ring-black/5',
    claimed: 'bg-amber-50/70 ring-1 ring-amber-200/50',
    completed: 'bg-emerald-50/80 ring-1 ring-emerald-200/50'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full"
    >
      <Panel
        className={`glass-card flex h-full min-h-[240px] flex-col justify-between border-none shadow-lg backdrop-blur-md transition-all ${stateStyles[record.state]}`}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-[var(--font-heading)] text-5xl tracking-tighter text-[var(--foreground)]/30">{record.juzNumber}</div>
              <div className="mt-1 flex items-center gap-2 font-[var(--font-heading)] text-xl text-[var(--foreground)]">
                {info?.name}
                {record.state === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              </div>
              <div className="mt-1 text-xs font-medium text-muted uppercase tracking-wider">Starts page {info?.startPage}</div>
            </div>
            {record.participantName ? (
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-lg font-bold text-[var(--accent-strong)] shadow-sm ring-1 ring-black/5">
                  {initials(record.participantName)}
                </div>
                {isMine && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-[var(--accent)] p-1 text-white shadow-md">
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40 ring-1 ring-black/5">
                <BookOpen className="h-6 w-6 text-[var(--gold)] opacity-50" />
              </div>
            )}
          </div>
          <p className="text-xs leading-relaxed text-muted/80 line-clamp-2">{info?.surahs}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="h-px w-full bg-black/5" />
          
          {record.state === 'available' && (
            <Button size="md" className="w-full shadow-md shadow-emerald-900/10" onClick={() => onClaim(record.juzNumber)}>
              Join this juz
            </Button>
          )}

          {record.state !== 'available' && record.participantName && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
                <UserRound className="h-3.5 w-3.5 text-[var(--gold)]" />
                {record.participantName}
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                {record.state === 'completed' ? 'Reading Recorded' : 'Current Observer'}
              </p>
            </div>
          )}

          {record.state === 'claimed' && isMine && (
            <div className="flex gap-2">
              <Button size="md" className="flex-1 shadow-md shadow-emerald-900/10" onClick={() => onComplete(record.juzNumber)}>
                Record completion
              </Button>
              <Button tone="secondary" size="md" className="px-3" onClick={() => onRelease(record.juzNumber)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {record.state !== 'available' && isOrganizer && !isMine && (
            <Button tone="ghost" size="sm" className="w-full text-xs opacity-60 hover:opacity-100" onClick={() => onOrganizerRelease(record.juzNumber)}>
              <LockKeyhole className="h-3 w-3" />
              Release lock
            </Button>
          )}
        </div>
      </Panel>
    </motion.div>
  );
}


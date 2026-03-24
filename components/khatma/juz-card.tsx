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
  onUndo: (juzNumber: number) => void;
  onRelease: (juzNumber: number) => void;
  onOrganizerRelease: (juzNumber: number) => void;
}

export function JuzCard({ record, viewerUid, isOrganizer, onClaim, onComplete, onUndo, onRelease, onOrganizerRelease }: JuzCardProps) {
  const info = juzCatalog.find((item) => item.id === record.juzNumber);
  const isMine = Boolean(viewerUid) && record.participantUid === viewerUid;

  const stateStyles = {
    available: 'bg-white/60 ring-1 ring-black/5',
    claimed: 'bg-amber-100/80 ring-2 ring-amber-400/30 shadow-amber-900/5',
    completed: 'bg-emerald-100/90 ring-2 ring-emerald-400/30 shadow-emerald-900/5'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full"
    >
      <Panel
        className={`glass-card flex h-full min-h-[180px] flex-col justify-between border-none p-5 shadow-lg backdrop-blur-md transition-all ${stateStyles[record.state]}`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-[var(--font-heading)] text-4xl tracking-tighter text-[var(--foreground)]/20">{record.juzNumber}</div>
              <div className="mt-0.5 flex items-center gap-1.5 font-[var(--font-heading)] text-lg text-[var(--foreground)]">
                {info?.name}
                {record.state === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              </div>
              <div className="mt-0.5 text-[10px] font-bold text-muted uppercase tracking-wider opacity-60">Starts page {info?.startPage}</div>
            </div>
            {record.participantName ? (
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-sm font-bold text-[var(--accent-strong)] shadow-sm ring-1 ring-black/5">
                  {initials(record.participantName)}
                </div>
                {isMine && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-[var(--accent)] p-0.5 text-white shadow-md">
                    <Sparkles className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 ring-1 ring-black/5">
                <BookOpen className="h-5 w-5 text-[var(--gold)] opacity-50" />
              </div>
            )}
          </div>
          <p className="text-[10px] leading-relaxed text-muted/70 line-clamp-1">{info?.surahs}</p>
        </div>

        <div className="mt-3 space-y-3">
          <div className="h-px w-full bg-black/5" />
          
          {record.state === 'available' && (
            <Button size="sm" className="w-full shadow-md shadow-emerald-900/5" onClick={() => onClaim(record.juzNumber)}>
              Join this juz
            </Button>
          )}

          {record.state !== 'available' && record.participantName && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
                  <UserRound className="h-3 w-3 text-[var(--gold)]" />
                  {record.participantName}
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-muted opacity-60">
                  {record.state === 'completed' ? 'Reading Recorded' : 'Current Observer'}
                </p>
              </div>
              
              {record.state === 'completed' && isMine && (
                <Button tone="secondary" size="sm" className="h-7 px-2 text-[10px] font-bold" onClick={() => onUndo(record.juzNumber)}>
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Undo
                </Button>
              )}
            </div>
          )}

          {record.state === 'claimed' && isMine && (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 shadow-md shadow-emerald-900/5 h-9" onClick={() => onComplete(record.juzNumber)}>
                Record completion
              </Button>
              <Button tone="secondary" size="sm" className="px-2.5 h-9" onClick={() => onRelease(record.juzNumber)}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {record.state !== 'available' && isOrganizer && !isMine && (
            <Button tone="ghost" size="sm" className="w-full h-7 text-[10px] opacity-40 hover:opacity-100" onClick={() => onOrganizerRelease(record.juzNumber)}>
              <LockKeyhole className="mr-1 h-3 w-3" />
              Release lock
            </Button>
          )}
        </div>
      </Panel>
    </motion.div>
  );
}


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
        className={`glass-card flex h-[170px] flex-col justify-between border-none p-4 shadow-lg backdrop-blur-md transition-all ${stateStyles[record.state]}`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-[var(--font-heading)] text-3xl tracking-tighter text-[var(--foreground)]/20">{record.juzNumber}</span>
                <span className="mt-0.5 truncate font-[var(--font-heading)] text-base font-bold text-[var(--foreground)]">
                  {info?.name}
                </span>
                {record.state === 'completed' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 overflow-hidden">
                <span className="text-[9px] font-bold text-muted uppercase tracking-wider opacity-60">Page {info?.startPage}</span>
                <span className="text-[9px] text-muted/40">•</span>
                <span className="truncate text-[9px] text-muted/70">{info?.surahs}</span>
              </div>
            </div>
            
            {record.participantName ? (
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-xs font-bold text-[var(--accent-strong)] shadow-sm ring-1 ring-black/5">
                  {initials(record.participantName)}
                </div>
                {isMine && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-[var(--accent)] p-0.5 text-white shadow-md">
                    <Sparkles className="h-2 w-2" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/40 ring-1 ring-black/5">
                <BookOpen className="h-4 w-4 text-[var(--gold)] opacity-50" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {record.participantName && (
            <div className="flex items-center gap-1.5 overflow-hidden border-t border-black/5 pt-2">
              <UserRound className="h-3 w-3 shrink-0 text-[var(--gold)]" />
              <span className="truncate text-[11px] font-bold text-[var(--foreground)]">{record.participantName}</span>
            </div>
          )}

          <div className="flex gap-2">
            {record.state === 'available' && (
              <Button 
                tone="primary" 
                size="sm" 
                className="w-full text-xs font-bold whitespace-nowrap h-9 shadow-md" 
                onClick={() => onClaim(record.juzNumber)}
                aria-label={`Join Juz ${record.juzNumber}: ${info?.name}`}
              >
                Join the Juz
              </Button>
            )}

            {record.state === 'claimed' && isMine && (
              <>
                <Button 
                  size="sm" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap h-9 shadow-md border-none" 
                  onClick={() => onComplete(record.juzNumber)}
                >
                  Mark Complete
                </Button>
                <Button 
                  tone="secondary" 
                  size="sm" 
                  className="px-2.5 h-9 shrink-0" 
                  onClick={() => onRelease(record.juzNumber)}
                  title="Undo Join"
                  aria-label={`Undo join for Juz ${record.juzNumber}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            {record.state === 'completed' && isMine && (
              <>
                <div className="flex h-9 flex-1 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md whitespace-nowrap">
                  Completed
                </div>
                <Button 
                  tone="secondary" 
                  size="sm" 
                  className="px-2.5 h-9 shrink-0" 
                  onClick={() => onUndo(record.juzNumber)}
                  title="Undo Completion"
                  aria-label={`Undo completion for Juz ${record.juzNumber}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            {record.state !== 'available' && !isMine && (
              <div className="flex h-9 w-full flex-col items-center justify-center rounded-full px-3">
                {record.state === 'completed' ? (
                  <span className="text-xs font-bold text-muted/60 uppercase tracking-wider">
                    Completed
                  </span>
                ) : (
                  isOrganizer && (
                    <button 
                      className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-2" 
                      onClick={() => onOrganizerRelease(record.juzNumber)}
                      aria-label={`Release lock for Juz ${record.juzNumber}`}
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-800" /> Release Lock
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}


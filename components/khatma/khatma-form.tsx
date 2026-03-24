'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { DraftStore } from '@/lib/data/draft-store';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { promoteDraftToCloud } from '@/lib/repositories/cloud-khatmas';
import { cn } from '@/lib/utils';

interface KhatmaFormProps {
  className?: string;
  isHero?: boolean;
}

export function KhatmaForm({ className, isHero = false }: KhatmaFormProps) {
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
      targetDate: form.targetDate ? new Date(form.targetDate).toISOString() : null,
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
        router.push(`/khatma?id=${khatmaResponse.id}`);
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
        router.push(`/draft?id=${newDraft.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const labelClasses = cn(
    "font-bold uppercase tracking-widest text-muted-foreground",
    isHero ? "text-[10px]" : "text-xs flex items-center gap-1"
  );

  const inputClasses = cn(
    "w-full rounded-xl bg-[var(--surface)] ring-1 ring-[var(--line)] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
    isHero ? "px-4 py-2.5 text-sm" : "px-5 py-3.5 text-base"
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1.5">
        <label className={labelClasses}>
          Deceased Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Abdullah bin Ahmed"
          className={inputClasses}
          value={form.deceasedName}
          onChange={(e) => setForm({ ...form, deceasedName: e.target.value })}
        />
      </div>
      
      <div className="space-y-1.5">
        <label className={labelClasses}>
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Public organizer name"
          className={inputClasses}
          value={form.organizerName}
          onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClasses}>Completion Date (Optional)</label>
        <div className="relative">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className={cn(inputClasses, "appearance-none")}
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          />
          {!isHero && <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClasses}>Description (Optional)</label>
        <textarea
          placeholder="A short message for participants..."
          rows={isHero ? 2 : 4}
          className={cn(inputClasses, "resize-none")}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className={cn("pt-2", !isHero && "pt-4")}>
        <Button
          size="lg"
          className={cn(
            "w-full shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]",
            isHero ? "py-6 text-base hover:shadow-[0_0_20px_var(--accent-soft)]" : "py-8 text-lg font-bold hover:shadow-[0_0_30px_var(--accent-soft)]"
          )}
          onClick={handleCreate}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className={cn("mr-2 animate-spin", isHero ? "h-4 w-4" : "h-5 w-5")} />
              Creating...
            </>
          ) : (
            sessionState === 'organizer' ? 'Create Shared Khatma' : 'Start Private Draft'
          )}
        </Button>
      </div>
      
      <p className="text-center text-[10px] text-muted-foreground">
        {sessionState === 'organizer'
          ? 'Khatma will be created in the cloud'
          : 'Saved locally. You can share this later after signing in.'}
      </p>
    </div>
  );
}

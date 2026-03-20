'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DraftStore } from '@/lib/data/draft-store';
import type { JuzRecord, LocalKhatmaDraft } from '@/lib/types';
import { KhatmaView } from '@/components/khatma/khatma-view';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { AuthModal } from '@/components/ui/auth-modal';
import { Panel } from '@/components/ui/panel';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { promoteDraftToCloud } from '@/lib/repositories/cloud-khatmas';

export default function DraftPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, sessionState } = useAuth();
  const { pushToast } = useToast();
  const [store, setStore] = useState<DraftStore | null>(null);
  const [draft, setDraft] = useState<LocalKhatmaDraft | null>(null);
  const [promoting, setPromoting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(searchParams.get('share') === '1');

  useEffect(() => {
    const nextStore = new DraftStore(window.localStorage);
    setStore(nextStore);
    const nextDraft = nextStore.getDraft(params.id);
    if (nextDraft) {
      setDraft(nextDraft);
      nextStore.markVisited(nextDraft.id);
    }
  }, [params.id]);

  const persistDraft = (nextDraft: LocalKhatmaDraft) => {
    if (!store) return;
    store.saveDraft(nextDraft);
    setDraft(nextDraft);
  };

  const promote = useMemo(
    () => async () => {
      if (!draft || !store || !user) return;
      setPromoting(true);
      try {
        const token = await user.getIdToken();
        const promoted = await promoteDraftToCloud({ draft, currentUser: user, token });
        store.deleteDraft(draft.id);
        pushToast({ tone: 'success', title: 'Draft promoted. Your shared khatma is now live.' });
        router.replace(`/khatma/${promoted.id}`);
      } catch (error) {
        pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not promote this draft.' });
      } finally {
        setPromoting(false);
      }
    },
    [draft, pushToast, router, store, user],
  );

  useEffect(() => {
    if (showAuthModal && sessionState === 'organizer' && user && !promoting) {
      setShowAuthModal(false);
      void promote();
    }
  }, [promote, promoting, sessionState, showAuthModal, user]);

  if (!draft) {
    return (
      <>
        <main className="page-shell pb-0">
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Panel>
              <h1 className="font-[var(--font-heading)] text-5xl">Draft not found</h1>
              <p className="mt-3 text-muted">This local draft exists only in the browser where it was created. If that browser data was cleared, the draft is gone.</p>
            </Panel>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <main className="page-shell pb-0">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-12 md:px-6 md:pt-20">
          <KhatmaView
            title={draft.deceasedName}
            description={draft.description}
            targetDate={draft.targetDate}
            ownerLabel={draft.organizerName || draft.ownerLabel}
            mode="local"
            juz={draft.juz}
            viewerUid={user?.uid ?? 'local-owner'}
            isOrganizer={true}
            shareActionLabel="Share and publish"
            shareHint="Sharing this draft will ask you to sign in, then convert it into a cloud-backed khatma that updates live for everyone."
            busy={promoting}
            onShare={() => {
              if (sessionState === 'organizer' && user) {
                void promote();
                return;
              }
              setShowAuthModal(true);
            }}
            onClaim={(juzNumber, name) => {
              const nextJuz = draft.juz.map((record) =>
                record.juzNumber === juzNumber
                  ? ({
                      ...record,
                      state: 'claimed',
                      participantUid: 'local-owner',
                      participantName: name || null,
                      claimedAt: new Date().toISOString(),
                      completedAt: null,
                    } as JuzRecord)
                  : record,
              );
              persistDraft({ ...draft, juz: nextJuz });
            }}
            onComplete={(juzNumber) => {
              const nextJuz = draft.juz.map((record) =>
                record.juzNumber === juzNumber
                  ? ({ ...record, state: 'completed', completedAt: new Date().toISOString() } as JuzRecord)
                  : record,
              );
              persistDraft({ ...draft, juz: nextJuz });
            }}
            onRelease={(juzNumber) => {
              const nextJuz = draft.juz.map((record) =>
                record.juzNumber === juzNumber
                  ? ({ juzNumber, state: 'available' } as JuzRecord)
                  : record,
              );
              persistDraft({ ...draft, juz: nextJuz });
            }}
            onOrganizerRelease={(juzNumber) => {
              const nextJuz = draft.juz.map((record) =>
                record.juzNumber === juzNumber
                  ? ({ juzNumber, state: 'available' } as JuzRecord)
                  : record,
              );
              persistDraft({ ...draft, juz: nextJuz });
            }}
            onSaveMeta={(payload) => {
              persistDraft({
                ...draft,
                description: payload.description,
                targetDate: payload.targetDate,
              });
              pushToast({ tone: 'success', title: 'Local draft details saved.' });
            }}
          />
        </div>
      </main>

      <SiteFooter />

      {/* Auth modal popup for share flow */}
      <AuthModal
        open={showAuthModal && sessionState !== 'organizer'}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to publish"
        description="Your draft will stay on this browser until you publish it. Once signed in, we will convert it into a shared khatma."
        redirectPath={`/draft/${draft.id}?share=1`}
      />
    </>
  );
}

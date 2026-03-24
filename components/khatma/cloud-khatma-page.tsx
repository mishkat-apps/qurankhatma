'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KhatmaView } from '@/components/khatma/khatma-view';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Panel } from '@/components/ui/panel';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { getFirebaseDb } from '@/lib/firebase/client';
import {
  claimJuz,
  completeOwnJuz,
  undoCompleteOwnJuz,
  releaseClaimAsOrganizer,
  releaseOwnJuz,
  subscribeToCloudKhatma,
  updateCloudKhatmaMeta,
} from '@/lib/repositories/cloud-khatmas';
import type { CloudKhatma, JuzRecord } from '@/lib/types';
import { DraftStore } from '@/lib/data/draft-store';

export function CloudKhatmaPage({ id }: { id: string }) {
  const { user, sessionState, hasFirebase } = useAuth();
  const { pushToast } = useToast();
  const router = useRouter();
  const [khatma, setKhatma] = useState<CloudKhatma | null>(null);
  const [juz, setJuz] = useState<JuzRecord[]>([]);

  useEffect(() => {
    if (!hasFirebase) return;
    const db = getFirebaseDb();
    if (!db) return;

    const store = new DraftStore(window.localStorage);
    store.markVisited(id);

    return subscribeToCloudKhatma(db, id, (payload) => {
      setKhatma(payload.khatma);
      setJuz(payload.juz);
    });
  }, [hasFirebase, id]);

  if (!hasFirebase) {
    return (
      <>
        <main className="page-shell pb-0">
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Panel>
              <h1 className="font-[var(--font-heading)] text-5xl">Firebase is not configured</h1>
              <p className="mt-3 text-muted">Add the Firebase environment variables before trying to open shared khatmas.</p>
            </Panel>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!khatma) {
    return (
      <>
        <main className="page-shell pb-0">
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Panel className="space-y-3">
              <div className="skeleton h-8 w-2/3" />
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-5 w-4/5" />
            </Panel>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const db = getFirebaseDb();
  const isOrganizer = sessionState === 'organizer' && user?.uid === khatma.ownerUid;

  return (
    <>
      <main className="page-shell pb-0">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-12 md:px-6 md:pt-20">
          <KhatmaView
            title={khatma.deceasedName}
            description={khatma.description}
            targetDate={khatma.targetDate}
            ownerLabel={khatma.organizerName || khatma.ownerDisplayName}
            mode="cloud"
            juz={juz}
            viewerUid={user?.uid ?? null}
            isOrganizer={isOrganizer}
            shareActionLabel="Copy public link"
            shareHint="Anyone with this link can open the board, claim an available juz, and see live updates."
            onShare={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                pushToast({ tone: 'success', title: 'Public khatma link copied.' });
              });
            }}
            onClaim={async (juzNumber, name) => {
              if (!user) {
                pushToast({ tone: 'error', title: 'This device is not connected to Firebase auth yet.' });
                return;
              }
              try {
                const token = await user.getIdToken();
                await claimJuz({ khatmaId: khatma.id, juzNumber, participantName: name, token });
                pushToast({ tone: 'success', title: `Juz ${juzNumber} is now yours.` });
              } catch (error) {
                pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not claim this juz.' });
              }
            }}
            onComplete={async (juzNumber) => {
              if (!user) return;
              try {
                const token = await user.getIdToken();
                await completeOwnJuz({ khatmaId: khatma.id, juzNumber, token });
                pushToast({ tone: 'success', title: `Juz ${juzNumber} marked complete.` });
              } catch (error) {
                pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not complete this juz.' });
              }
            }}
            onUndo={async (juzNumber) => {
              if (!user) return;
              try {
                const token = await user.getIdToken();
                await undoCompleteOwnJuz({ khatmaId: khatma.id, juzNumber, token });
                pushToast({ tone: 'success', title: `Juz ${juzNumber} recorded reading removed.` });
              } catch (error) {
                pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not undo this completion.' });
              }
            }}
            onRelease={async (juzNumber) => {
              if (!user) return;
              try {
                const token = await user.getIdToken();
                await releaseOwnJuz({ khatmaId: khatma.id, juzNumber, token });
                pushToast({ tone: 'success', title: `Juz ${juzNumber} is available again.` });
              } catch (error) {
                pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not release this juz.' });
              }
            }}
            onOrganizerRelease={async (juzNumber) => {
              if (!user || !isOrganizer) return;
              try {
                const token = await user.getIdToken();
                await releaseClaimAsOrganizer({ khatmaId: khatma.id, juzNumber, token });
                pushToast({ tone: 'success', title: `Organizer release applied to juz ${juzNumber}.` });
              } catch (error) {
                pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not release that claim.' });
              }
            }}
            onSaveMeta={
              isOrganizer
                ? async (payload) => {
                    if (!db) return;
                    try {
                      await updateCloudKhatmaMeta(db, khatma.id, payload);
                      pushToast({ tone: 'success', title: 'Khatma details updated.' });
                    } catch (error) {
                      pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not update the khatma.' });
                    }
                  }
                : undefined
            }
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

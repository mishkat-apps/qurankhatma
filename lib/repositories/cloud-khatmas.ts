import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Firestore,
} from 'firebase/firestore';
import type { CloudKhatma, JuzRecord, LocalKhatmaDraft } from '../types';

function khatmaCollection(db: Firestore) {
  return collection(db, 'khatmas');
}

function juzCollection(db: Firestore, khatmaId: string) {
  return collection(db, 'khatmas', khatmaId, 'juz');
}

export function subscribeToCloudKhatma(db: Firestore, khatmaId: string, callback: (data: { khatma: CloudKhatma | null; juz: JuzRecord[] }) => void) {
  const khatmaRef = doc(db, 'khatmas', khatmaId);
  const juzRef = query(juzCollection(db, khatmaId), orderBy('juzNumber', 'asc'));

  let currentKhatma: CloudKhatma | null = null;
  let currentJuz: JuzRecord[] = [];

  const emit = () => callback({ khatma: currentKhatma, juz: currentJuz });

  const unsubKhatma = onSnapshot(khatmaRef, (snapshot) => {
    currentKhatma = snapshot.exists() ? (snapshot.data() as CloudKhatma) : null;
    emit();
  });

  const unsubJuz = onSnapshot(juzRef, (snapshot) => {
    currentJuz = snapshot.docs.map((item) => item.data() as JuzRecord);
    emit();
  });

  return () => {
    unsubKhatma();
    unsubJuz();
  };
}

export function subscribeToOrganizerKhatmas(db: Firestore, uid: string, callback: (items: CloudKhatma[]) => void) {
  return onSnapshot(
    query(khatmaCollection(db), where('ownerUid', '==', uid), orderBy('updatedAt', 'desc')),
    (snapshot) => {
      callback(snapshot.docs.map((item) => item.data() as CloudKhatma));
    },
  );
}

export async function updateCloudKhatmaMeta(db: Firestore, khatmaId: string, payload: Pick<CloudKhatma, 'description' | 'targetDate'>) {
  await updateDoc(doc(db, 'khatmas', khatmaId), {
    ...payload,
    updatedAt: new Date().toISOString(),
  });
}

async function mutateJuz(params: {
  action: 'claim' | 'complete' | 'release';
  khatmaId: string;
  juzNumber: number;
  token: string;
  participantName?: string;
}) {
  const response = await fetch(`/api/khatmas/${params.khatmaId}/juz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      action: params.action,
      juzNumber: params.juzNumber,
      participantName: params.participantName,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Could not update this juz.' }));
    throw new Error(data.error ?? 'Could not update this juz.');
  }
}

export async function claimJuz(params: { khatmaId: string; juzNumber: number; participantName: string; token: string }) {
  await mutateJuz({
    action: 'claim',
    khatmaId: params.khatmaId,
    juzNumber: params.juzNumber,
    participantName: params.participantName,
    token: params.token,
  });
}

export async function completeOwnJuz(params: { khatmaId: string; juzNumber: number; token: string }) {
  await mutateJuz({
    action: 'complete',
    khatmaId: params.khatmaId,
    juzNumber: params.juzNumber,
    token: params.token,
  });
}

export async function releaseOwnJuz(params: { khatmaId: string; juzNumber: number; token: string }) {
  await mutateJuz({
    action: 'release',
    khatmaId: params.khatmaId,
    juzNumber: params.juzNumber,
    token: params.token,
  });
}

export async function promoteDraftToCloud(params: {
  draft: LocalKhatmaDraft;
  currentUser: User;
  token: string;
}) {
  const response = await fetch('/api/drafts/promote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({ draft: params.draft }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Could not promote draft.' }));
    throw new Error(data.error ?? 'Could not promote draft.');
  }

  return (await response.json()) as { id: string; slug: string };
}

export async function releaseClaimAsOrganizer(params: { khatmaId: string; juzNumber: number; token: string }) {
  const response = await fetch(`/api/khatmas/${params.khatmaId}/organizer/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({ juzNumber: params.juzNumber }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Could not release this claim.' }));
    throw new Error(data.error ?? 'Could not release this claim.');
  }
}
export async function deleteCloudKhatma(params: { khatmaId: string; token: string }) {
  const response = await fetch(`/api/khatmas/${params.khatmaId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Could not delete khatma.' }));
    throw new Error(data.error ?? 'Could not delete khatma.');
  }
}

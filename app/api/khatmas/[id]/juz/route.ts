import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import {
  applyClaimToJuz,
  applyCompletionToJuz,
  applyReleaseToJuz,
  applyUndoCompleteToJuz,
  summarizeCloudMutation,
} from '@/lib/domain/cloud-khatma-mutations';
import type { JuzRecord } from '@/lib/types';

type JuzAction = 'claim' | 'complete' | 'release' | 'undo';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized();
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = await getAdminAuth().verifyIdToken(token);
    const { id } = await params;
    const body = (await request.json()) as { action?: JuzAction; juzNumber?: number; participantName?: string };

    if (!body.action || !['claim', 'complete', 'release', 'undo'].includes(body.action)) {
      return badRequest('Missing or invalid juz action.');
    }

    if (!body.juzNumber) {
      return badRequest('Missing juz number.');
    }

    if (body.action === 'claim' && !body.participantName?.trim()) {
      return badRequest('Please enter your name before claiming a juz.');
    }

    const db = getAdminDb();
    const khatmaRef = db.collection('khatmas').doc(id);
    const now = new Date().toISOString();

    await db.runTransaction(async (transaction) => {
      const khatmaSnapshot = await transaction.get(khatmaRef);
      if (!khatmaSnapshot.exists) {
        throw new Error('Khatma not found.');
      }

      const juzSnapshot = await transaction.get(khatmaRef.collection('juz').orderBy('juzNumber', 'asc'));
      const currentJuz = juzSnapshot.docs.map((item) => item.data() as JuzRecord);

      let mutation;
      if (body.action === 'claim') {
        mutation = applyClaimToJuz(currentJuz, {
          juzNumber: body.juzNumber!,
          participantUid: decoded.uid,
          participantName: body.participantName!.trim(),
          now,
        });
      } else if (body.action === 'complete') {
        mutation = applyCompletionToJuz(currentJuz, {
          juzNumber: body.juzNumber!,
          participantUid: decoded.uid,
          now,
        });
      } else if (body.action === 'undo') {
        mutation = applyUndoCompleteToJuz(currentJuz, {
          juzNumber: body.juzNumber!,
          participantUid: decoded.uid,
        });
      } else {
        mutation = applyReleaseToJuz(currentJuz, {
          juzNumber: body.juzNumber!,
          participantUid: decoded.uid,
        });
      }

      const summary = summarizeCloudMutation(mutation.nextJuz);
      transaction.set(khatmaRef.collection('juz').doc(String(body.juzNumber)), mutation.updatedRecord, { merge: true });
      transaction.set(
        khatmaRef,
        {
          claimedCount: summary.claimedCount,
          completedCount: summary.completedCount,
          status: summary.status,
          updatedAt: now,
        },
        { merge: true },
      );
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update this juz.';
    const status = message === 'Khatma not found.' ? 404 : 409;
    return NextResponse.json({ error: message }, { status });
  }
}

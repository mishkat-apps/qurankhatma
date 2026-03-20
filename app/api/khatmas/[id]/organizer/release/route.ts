import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type { JuzRecord } from '@/lib/types';
import { summarizeJuzRecords } from '@/lib/domain/khatma';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
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
    const { juzNumber } = (await request.json()) as { juzNumber?: number };

    if (!juzNumber) {
      return NextResponse.json({ error: 'Missing juz number.' }, { status: 400 });
    }

    const db = getAdminDb();
    const khatmaRef = db.collection('khatmas').doc(id);
    const khatmaSnapshot = await khatmaRef.get();
    if (!khatmaSnapshot.exists) {
      return NextResponse.json({ error: 'Khatma not found.' }, { status: 404 });
    }

    const khatma = khatmaSnapshot.data() as { ownerUid: string };
    if (khatma.ownerUid !== decoded.uid) {
      return unauthorized('Only the organizer can release this claim.');
    }

    await khatmaRef.collection('juz').doc(String(juzNumber)).set(
      {
        juzNumber,
        state: 'available',
        participantUid: null,
        participantName: null,
        claimedAt: null,
        completedAt: null,
      },
      { merge: true },
    );

    const juzSnapshot = await khatmaRef.collection('juz').orderBy('juzNumber', 'asc').get();
    const summary = summarizeJuzRecords(juzSnapshot.docs.map((doc) => doc.data() as JuzRecord));

    await khatmaRef.set(
      {
        claimedCount: summary.claimedCount,
        completedCount: summary.completedCount,
        status: summary.completedCount === 30 ? 'completed' : 'active',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not release the claim.' },
      { status: 500 },
    );
  }
}

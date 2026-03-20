import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { buildCloudKhatmaFromDraft, createEmptyJuzRecords } from '@/lib/domain/khatma';
import type { LocalKhatmaDraft } from '@/lib/types';
import { createPublicId } from '@/lib/utils';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized();
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = await getAdminAuth().verifyIdToken(token);
    if (decoded.firebase?.sign_in_provider === 'anonymous') {
      return NextResponse.json({ error: 'Please sign in with Google or email before publishing.' }, { status: 403 });
    }

    const body = (await request.json()) as { draft?: LocalKhatmaDraft };
    if (!body.draft?.deceasedName) {
      return NextResponse.json({ error: 'Draft payload is missing the deceased name.' }, { status: 400 });
    }
    if (!body.draft?.organizerName) {
      return NextResponse.json({ error: 'Draft payload is missing the organizer name.' }, { status: 400 });
    }

    const safeDraft: LocalKhatmaDraft = {
      ...body.draft,
      juz: body.draft.juz?.length === 30 ? body.draft.juz : createEmptyJuzRecords(),
    };
    const publicId = createPublicId(body.draft.deceasedName);
    const now = new Date().toISOString();
    const promoted = buildCloudKhatmaFromDraft({
      draft: safeDraft,
      publicId,
      ownerUid: decoded.uid,
      ownerDisplayName: decoded.name ?? decoded.email ?? 'Organizer',
      now,
    });

    const db = getAdminDb();
    const batch = db.batch();
    const khatmaRef = db.collection('khatmas').doc(publicId);
    batch.set(khatmaRef, promoted.khatma);
    for (const juz of promoted.juz) {
      batch.set(khatmaRef.collection('juz').doc(String(juz.juzNumber)), juz);
    }
    batch.set(
      db.collection('users').doc(decoded.uid),
      {
        displayName: decoded.name ?? decoded.email ?? 'Organizer',
        createdAt: now,
        lastSeenAt: now,
      },
      { merge: true },
    );

    await batch.commit();
    return NextResponse.json({ id: publicId, slug: publicId });
  } catch (error) {
    console.error('[API/Drafts/Promote] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not promote the draft.' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyAuth } from '@/lib/auth/server-auth';
import { QuerySnapshot } from 'firebase-admin/firestore';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error, status } = await verifyAuth(req);

    if (error || !user) {
      return NextResponse.json({ error }, { status: status ?? 401 });
    }

    const db = getAdminDb();
    const khatmaRef = db.collection('khatmas').doc(id);
    const khatmaDoc = await khatmaRef.get();

    if (!khatmaDoc.exists) {
      return NextResponse.json({ error: 'Khatma not found' }, { status: 404 });
    }

    const data = khatmaDoc.data();
    if (data?.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete subcollections first (juz)
    const juzCollection = khatmaRef.collection('juz');
    const juzDocs: QuerySnapshot = await juzCollection.get();
    const batch = db.batch();
    juzDocs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete the khatma document
    batch.delete(khatmaRef);
    
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete khatma error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

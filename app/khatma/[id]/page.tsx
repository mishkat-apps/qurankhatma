import type { Metadata } from 'next';
import { CloudKhatmaPage } from '@/components/khatma/cloud-khatma-page';
import { getAdminDb } from '@/lib/firebase/admin';
import type { CloudKhatma } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const snapshot = await getAdminDb().collection('khatmas').doc(id).get();
    if (!snapshot.exists) {
      return { title: 'Quran Khatma' };
    }
    const khatma = snapshot.data() as CloudKhatma;
    return {
      title: `Khatma for ${khatma.deceasedName}`,
      description: khatma.description || `Join this shared Quran khatma for ${khatma.deceasedName}.`,
    };
  } catch {
    return { title: 'Quran Khatma' };
  }
}

export default async function KhatmaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CloudKhatmaPage id={id} />;
}

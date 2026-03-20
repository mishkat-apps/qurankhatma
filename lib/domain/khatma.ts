import type { CloudKhatma, JuzRecord, KhatmaSummary, LocalKhatmaDraft, PromoteDraftInput } from '../types';

export function createEmptyJuzRecords(): JuzRecord[] {
  return Array.from({ length: 30 }, (_, index) => ({
    juzNumber: index + 1,
    state: 'available',
  }));
}

export function summarizeJuzRecords(juz: JuzRecord[]): KhatmaSummary {
  const claimedCount = juz.filter((item) => item.state === 'claimed').length;
  const completedCount = juz.filter((item) => item.state === 'completed').length;
  const availableCount = Math.max(0, 30 - claimedCount - completedCount);

  return {
    availableCount,
    claimedCount,
    completedCount,
    completionRatio: Math.round((completedCount / 30) * 100),
  };
}

export function buildCloudKhatmaFromDraft({
  draft,
  publicId,
  ownerUid,
  ownerDisplayName,
  now,
}: PromoteDraftInput): { khatma: CloudKhatma; juz: JuzRecord[] } {
  const summary = summarizeJuzRecords(draft.juz);

  return {
    khatma: {
      id: publicId,
      slug: publicId,
      mode: 'cloud',
      ownerUid,
      ownerDisplayName,
      organizerName: draft.organizerName || ownerDisplayName,
      deceasedName: draft.deceasedName,
      description: draft.description,
      targetDate: draft.targetDate,
      status: draft.status,
      createdAt: now,
      updatedAt: now,
      claimedCount: summary.claimedCount,
      completedCount: summary.completedCount,
    },
    juz: draft.juz,
  };
}

export function splitCloudKhatmas(items: CloudKhatma[]) {
  return items.reduce(
    (acc, item) => {
      if (item.status === 'active') {
        acc.active.push(item);
      } else {
        acc.history.push(item);
      }
      return acc;
    },
    { active: [] as CloudKhatma[], history: [] as CloudKhatma[] },
  );
}

import assert from 'node:assert/strict';
import {
  buildCloudKhatmaFromDraft,
  createEmptyJuzRecords,
  splitCloudKhatmas,
  summarizeJuzRecords,
} from '../lib/domain/khatma';
import type { CloudKhatma, LocalKhatmaDraft } from '../lib/types';

const juz = createEmptyJuzRecords();
assert.equal(juz.length, 30);
assert.deepEqual(juz[0], { juzNumber: 1, state: 'available' });
assert.deepEqual(juz[29], { juzNumber: 30, state: 'available' });

const summary = summarizeJuzRecords([
  { juzNumber: 1, state: 'available' },
  { juzNumber: 2, state: 'claimed', participantUid: 'anon-1', participantName: 'Amina', claimedAt: '2026-03-19T00:00:00.000Z' },
  { juzNumber: 3, state: 'completed', participantUid: 'anon-2', participantName: 'Bilal', claimedAt: '2026-03-19T00:00:00.000Z', completedAt: '2026-03-20T00:00:00.000Z' },
]);
assert.deepEqual(summary, { availableCount: 28, claimedCount: 1, completedCount: 1, completionRatio: 3 });

const draft: LocalKhatmaDraft = {
  id: 'draft-1',
  mode: 'local',
  deceasedName: 'Hawa Abdallah',
  organizerName: 'Fatma',
  description: 'Family khatma after maghrib.',
  targetDate: '2026-03-30',
  status: 'active',
  createdAt: '2026-03-19T00:00:00.000Z',
  updatedAt: '2026-03-19T00:00:00.000Z',
  ownerLabel: 'Local draft',
  juz: [
    { juzNumber: 1, state: 'claimed', participantUid: 'anon-1', participantName: 'Aisha', claimedAt: '2026-03-19T00:00:00.000Z' },
    { juzNumber: 2, state: 'completed', participantUid: 'anon-2', participantName: 'Hamza', claimedAt: '2026-03-19T00:00:00.000Z', completedAt: '2026-03-20T00:00:00.000Z' },
    ...createEmptyJuzRecords().slice(2),
  ],
};

const promoted = buildCloudKhatmaFromDraft({
  draft,
  publicId: 'hawa-abdallah-s9d8k2',
  ownerUid: 'user-1',
  ownerDisplayName: 'Fatma',
  now: '2026-03-21T00:00:00.000Z',
});
assert.deepEqual(promoted.khatma, {
  id: 'hawa-abdallah-s9d8k2',
  slug: 'hawa-abdallah-s9d8k2',
  mode: 'cloud',
  ownerUid: 'user-1',
  ownerDisplayName: 'Fatma',
  deceasedName: 'Hawa Abdallah',
  organizerName: 'Fatma',
  description: 'Family khatma after maghrib.',
  targetDate: '2026-03-30',
  status: 'active',
  createdAt: '2026-03-21T00:00:00.000Z',
  updatedAt: '2026-03-21T00:00:00.000Z',
  claimedCount: 1,
  completedCount: 1,
});
assert.equal(promoted.juz[0].participantName, 'Aisha');
assert.equal(promoted.juz[1].state, 'completed');

const items: CloudKhatma[] = [
  {
    id: '1',
    slug: 'one',
    mode: 'cloud',
    ownerUid: 'u1',
    ownerDisplayName: 'Owner',
    deceasedName: 'One',
    organizerName: 'Owner',
    description: '',
    targetDate: null,
    status: 'active',
    createdAt: '2026-03-19T00:00:00.000Z',
    updatedAt: '2026-03-19T00:00:00.000Z',
    claimedCount: 2,
    completedCount: 5,
  },
  {
    id: '2',
    slug: 'two',
    mode: 'cloud',
    ownerUid: 'u1',
    ownerDisplayName: 'Owner',
    deceasedName: 'Two',
    organizerName: 'Owner',
    description: '',
    targetDate: null,
    status: 'completed',
    createdAt: '2026-03-19T00:00:00.000Z',
    updatedAt: '2026-03-19T00:00:00.000Z',
    claimedCount: 0,
    completedCount: 30,
  },
];

assert.deepEqual(splitCloudKhatmas(items), {
  active: [items[0]],
  history: [items[1]],
});

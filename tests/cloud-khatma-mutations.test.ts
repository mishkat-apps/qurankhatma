import assert from 'node:assert/strict';
import {
  applyClaimToJuz,
  applyCompletionToJuz,
  applyReleaseToJuz,
  summarizeCloudMutation,
} from '../lib/domain/cloud-khatma-mutations';
import type { JuzRecord } from '../lib/types';

const initialJuz: JuzRecord[] = [
  { juzNumber: 1, state: 'available' },
  { juzNumber: 2, state: 'claimed', participantUid: 'guest-2', participantName: 'Ali', claimedAt: '2026-03-19T20:00:00.000Z' },
  { juzNumber: 3, state: 'completed', participantUid: 'guest-3', participantName: 'Zahra', claimedAt: '2026-03-19T18:00:00.000Z', completedAt: '2026-03-19T21:00:00.000Z' },
];

const claimResult = applyClaimToJuz(initialJuz, {
  juzNumber: 1,
  participantUid: 'guest-1',
  participantName: 'Sajeda',
  now: '2026-03-19T21:32:30.868Z',
});

assert.deepEqual(claimResult.updatedRecord, {
  juzNumber: 1,
  state: 'claimed',
  participantUid: 'guest-1',
  participantName: 'Sajeda',
  claimedAt: '2026-03-19T21:32:30.868Z',
  completedAt: null,
});
assert.equal(claimResult.nextJuz[1].participantName, 'Ali');

const completeResult = applyCompletionToJuz(claimResult.nextJuz, {
  juzNumber: 1,
  participantUid: 'guest-1',
  now: '2026-03-19T22:00:00.000Z',
});

assert.equal(completeResult.updatedRecord.state, 'completed');
assert.equal(completeResult.updatedRecord.completedAt, '2026-03-19T22:00:00.000Z');

const releaseResult = applyReleaseToJuz(completeResult.nextJuz, {
  juzNumber: 2,
  participantUid: 'guest-2',
});

assert.deepEqual(releaseResult.updatedRecord, {
  juzNumber: 2,
  state: 'available',
  participantUid: null,
  participantName: null,
  claimedAt: null,
  completedAt: null,
});

assert.deepEqual(summarizeCloudMutation(releaseResult.nextJuz), {
  claimedCount: 0,
  completedCount: 2,
  status: 'active',
});

assert.throws(() => {
  applyClaimToJuz(initialJuz, {
    juzNumber: 2,
    participantUid: 'guest-4',
    participantName: 'Fatema',
    now: '2026-03-19T22:10:00.000Z',
  });
}, /already been claimed/i);

assert.throws(() => {
  applyCompletionToJuz(initialJuz, {
    juzNumber: 2,
    participantUid: 'guest-x',
    now: '2026-03-19T22:10:00.000Z',
  });
}, /Only the person who claimed this juz can complete it/i);

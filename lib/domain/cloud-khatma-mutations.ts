import type { KhatmaStatus, JuzRecord } from '../types';
import { summarizeJuzRecords } from './khatma';

interface ClaimInput {
  juzNumber: number;
  participantUid: string;
  participantName: string;
  now: string;
}

interface ParticipantMutationInput {
  juzNumber: number;
  participantUid: string;
}

interface CompletionInput extends ParticipantMutationInput {
  now: string;
}

interface JuzMutationResult {
  nextJuz: JuzRecord[];
  updatedRecord: JuzRecord;
}

export interface CloudMutationSummary {
  claimedCount: number;
  completedCount: number;
  status: KhatmaStatus;
}

function getRecord(juz: JuzRecord[], juzNumber: number) {
  const record = juz.find((item) => item.juzNumber === juzNumber);
  if (!record) {
    throw new Error('This juz could not be found.');
  }
  return record;
}

function replaceRecord(juz: JuzRecord[], updatedRecord: JuzRecord) {
  return juz.map((item) => (item.juzNumber === updatedRecord.juzNumber ? updatedRecord : item));
}

export function applyClaimToJuz(juz: JuzRecord[], input: ClaimInput): JuzMutationResult {
  const record = getRecord(juz, input.juzNumber);
  if (record.state !== 'available') {
    throw new Error('This juz has already been claimed.');
  }

  const updatedRecord: JuzRecord = {
    ...record,
    state: 'claimed',
    participantUid: input.participantUid,
    participantName: input.participantName,
    claimedAt: input.now,
    completedAt: null,
  };

  return {
    updatedRecord,
    nextJuz: replaceRecord(juz, updatedRecord),
  };
}

export function applyCompletionToJuz(juz: JuzRecord[], input: CompletionInput): JuzMutationResult {
  const record = getRecord(juz, input.juzNumber);
  if (record.participantUid !== input.participantUid) {
    throw new Error('Only the person who claimed this juz can complete it.');
  }

  const updatedRecord: JuzRecord = {
    ...record,
    state: 'completed',
    completedAt: input.now,
  };

  return {
    updatedRecord,
    nextJuz: replaceRecord(juz, updatedRecord),
  };
}

export function applyReleaseToJuz(juz: JuzRecord[], input: ParticipantMutationInput): JuzMutationResult {
  const record = getRecord(juz, input.juzNumber);
  if (record.participantUid !== input.participantUid) {
    throw new Error('Only the person who claimed this juz can release it.');
  }

  const updatedRecord: JuzRecord = {
    ...record,
    state: 'available',
    participantUid: null,
    participantName: null,
    claimedAt: null,
    completedAt: null,
  };

  return {
    updatedRecord,
    nextJuz: replaceRecord(juz, updatedRecord),
  };
}

export function summarizeCloudMutation(juz: JuzRecord[]): CloudMutationSummary {
  const summary = summarizeJuzRecords(juz);

  return {
    claimedCount: summary.claimedCount,
    completedCount: summary.completedCount,
    status: summary.completedCount === 30 ? 'completed' : 'active',
  };
}

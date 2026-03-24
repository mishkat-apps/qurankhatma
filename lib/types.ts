export type JuzState = 'available' | 'claimed' | 'completed';
export type KhatmaStatus = 'active' | 'completed' | 'archived';
export type KhatmaMode = 'local' | 'cloud';
export type SessionState = 'guest-local' | 'guest-anonymous' | 'organizer';

export interface JuzRecord {
  juzNumber: number;
  state: JuzState;
  participantUid?: string | null;
  participantName?: string | null;
  claimedAt?: string | null;
  completedAt?: string | null;
}

export interface BaseKhatma {
  deceasedName: string;
  organizerName: string;
  description: string;
  targetDate: string | null;
  status: KhatmaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LocalKhatmaDraft extends BaseKhatma {
  id: string;
  mode: 'local';
  ownerLabel: string;
  juz: JuzRecord[];
}

export interface CloudKhatma extends BaseKhatma {
  id: string;
  slug: string;
  mode: 'cloud';
  ownerUid: string;
  ownerDisplayName: string;
  claimedCount: number;
  completedCount: number;
  juz?: JuzRecord[];
}

export interface KhatmaSummary {
  availableCount: number;
  claimedCount: number;
  completedCount: number;
  completionRatio: number;
}

export interface PromoteDraftInput {
  draft: LocalKhatmaDraft;
  publicId: string;
  ownerUid: string;
  ownerDisplayName: string;
  now: string;
}


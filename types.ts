export type JuzStatus = 'available' | 'claimed' | 'completed';

export interface Juz {
  juzNumber: number; // 1-30
  status: JuzStatus;
  claimedBy?: string | null; // Name of the person who claimed it
  claimedAt?: number;
  completedAt?: number;
}

export interface Khatam {
  id: string;
  creatorId: string; // Unique ID for the organizer
  deceasedName: string;
  createdAt: number;
  targetDate?: number; // Optional deadline
  description?: string;
  juzs: Juz[];
  creatorName: string;
}

export interface Feedback {
  id: string;
  message: string;
  timestamp: number;
  source: string; // e.g., 'khatam-page' | 'organizer-dashboard'
}

export type CreateKhatamData = Pick<Khatam, 'deceasedName' | 'targetDate' | 'description' | 'creatorName'>;
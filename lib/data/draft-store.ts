import { createEmptyJuzRecords } from '../domain/khatma';
import type { LocalKhatmaDraft } from '../types';

const DRAFTS_KEY = 'quran-khatma.local-drafts';
const RECENT_KEY = 'quran-khatma.recent';

interface DraftSeed {
  deceasedName: string;
  organizerName: string;
  description: string;
  targetDate: string | null;
}

export class DraftStore {
  constructor(private readonly storage: Storage) {}

  createDraft(seed: DraftSeed): LocalKhatmaDraft {
    const now = new Date().toISOString();
    const draft: LocalKhatmaDraft = {
      id: `draft-${crypto.randomUUID()}`,
      mode: 'local',
      deceasedName: seed.deceasedName,
      organizerName: seed.organizerName,
      description: seed.description,
      targetDate: seed.targetDate,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      ownerLabel: 'Local draft',
      juz: createEmptyJuzRecords(),
    };

    const drafts = this.listDrafts();
    drafts.unshift(draft);
    this.writeDrafts(drafts);
    this.markVisited(draft.id);
    return draft;
  }

  saveDraft(draft: LocalKhatmaDraft) {
    const nextDraft = { ...draft, updatedAt: new Date().toISOString() };
    const drafts = this.listDrafts();
    const nextDrafts = drafts.some((item) => item.id === draft.id)
      ? drafts.map((item) => (item.id === draft.id ? nextDraft : item))
      : [nextDraft, ...drafts];

    this.writeDrafts(nextDrafts);
  }

  deleteDraft(id: string) {
    const drafts = this.listDrafts().filter((draft) => draft.id !== id);
    this.writeDrafts(drafts);
    const recent = this.listRecentIds().filter((item) => item !== id);
    this.storage.setItem(RECENT_KEY, JSON.stringify(recent));
  }

  getDraft(id: string) {
    return this.listDrafts().find((draft) => draft.id === id);
  }

  listDrafts(): LocalKhatmaDraft[] {
    return this.readJson<LocalKhatmaDraft[]>(DRAFTS_KEY, []);
  }

  markVisited(id: string) {
    const recent = this.listRecentIds().filter((item) => item !== id);
    recent.unshift(id);
    this.storage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 12)));
  }

  listRecentIds(): string[] {
    return this.readJson<string[]>(RECENT_KEY, []);
  }

  private writeDrafts(drafts: LocalKhatmaDraft[]) {
    this.storage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  }

  private readJson<T>(key: string, fallback: T): T {
    const value = this.storage.getItem(key);
    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
}

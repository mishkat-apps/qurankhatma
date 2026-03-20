import assert from 'node:assert/strict';
import { DraftStore } from '../lib/data/draft-store';
import { createEmptyJuzRecords } from '../lib/domain/khatma';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

const storage = new MemoryStorage();
const store = new DraftStore(storage);
const draft = store.createDraft({
  deceasedName: 'Mariam Omari',
  organizerName: 'Family',
  description: 'First family khatma.',
  targetDate: '2026-04-01',
});
assert.equal(store.listDrafts().length, 1);
assert.equal(store.getDraft(draft.id)?.deceasedName, 'Mariam Omari');

const first = store.createDraft({ deceasedName: 'First', organizerName: 'Org', description: '', targetDate: null });
const second = store.createDraft({ deceasedName: 'Second', organizerName: 'Org', description: '', targetDate: null });
store.markVisited(first.id);
store.markVisited(second.id);
store.markVisited(first.id);
assert.deepEqual(store.listRecentIds(), [first.id, second.id, draft.id]);

const juz = createEmptyJuzRecords();
juz[0] = {
  juzNumber: 1,
  state: 'claimed',
  participantUid: 'anon-1',
  participantName: 'Rahma',
  claimedAt: '2026-03-19T00:00:00.000Z',
};

store.saveDraft({
  ...draft,
  deceasedName: 'After',
  juz,
});

const saved = store.getDraft(draft.id);
assert.equal(saved?.deceasedName, 'After');
assert.equal(saved?.juz[0].participantName, 'Rahma');

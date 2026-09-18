import type { QuestwoodState } from '../domain/types';

const LEGACY_KEY = 'questwood.state.v1';
const DATABASE = 'questwood-academy';
const STORE = 'learner-state';
const RECORD_KEY = 'current';

export function createInitialState(): QuestwoodState {
  return {
    version: 1,
    profile: { id: crypto.randomUUID(), name: 'Avery', age: 7, avatar: '🧑🏽‍🚀', selectedGrade: '2', stars: 24, createdAt: new Date().toISOString() },
    attempts: [], mastery: {}, progress: {}, completedToday: 0,
  };
}

function loadLegacyState(): QuestwoodState | undefined {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return undefined;
    const state = JSON.parse(raw) as QuestwoodState;
    return state.version === 1 && state.profile ? state : undefined;
  } catch { return undefined; }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local progress database.'));
  });
}

export async function loadPersistentState(): Promise<QuestwoodState> {
  try {
    const database = await openDatabase();
    const value = await new Promise<QuestwoodState | undefined>((resolve, reject) => {
      const request = database.transaction(STORE, 'readonly').objectStore(STORE).get(RECORD_KEY);
      request.onsuccess = () => resolve(request.result as QuestwoodState | undefined);
      request.onerror = () => reject(request.error);
    });
    database.close();
    if (value?.version === 1 && value.profile) return value;
    const legacy = loadLegacyState();
    if (legacy) { await savePersistentState(legacy); localStorage.removeItem(LEGACY_KEY); return legacy; }
    return createInitialState();
  } catch { return loadLegacyState() ?? createInitialState(); }
}

export async function savePersistentState(state: QuestwoodState): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(state, RECORD_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

export function resetState(): QuestwoodState { return createInitialState(); }

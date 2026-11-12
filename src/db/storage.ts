import { RunActivity, UserProfile } from '../types/run';
import { calculateScore } from '../utils/calculations';

const DB_NAME = 'runtrackr_db';
const DB_VERSION = 1;
const STORE_RUNS = 'runs';
const STORE_SETTINGS = 'settings';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_RUNS)) {
        db.createObjectStore(STORE_RUNS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

import { REAL_ACTIVITIES } from './realSeedData';

// Returns the 177 real Strava running activities from the uploaded CSV with calculated scores
export function generateSeedActivities(): RunActivity[] {
  return REAL_ACTIVITIES.map((r) => ({
    ...r,
    score: calculateScore(r.distance, r.duration, r.avgHeartRate),
  }));
}

export const StorageService = {
  async getAllRuns(): Promise<RunActivity[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        const req = store.getAll();
        req.onsuccess = async () => {
          const runs = req.result as RunActivity[];
          const isLegacyMockData = runs && runs.some((r) => r.id.startsWith('seed-run-'));
          const hasUnder2km = runs && runs.some((r) => r.distance < 2.0);
          const needsRealSeed =
            !runs || runs.length === 0 || isLegacyMockData || hasUnder2km || !localStorage.getItem('runtrackr_real_data_v3');

          if (needsRealSeed) {
            // Seed or refresh with user's real activities >= 2km
            const seeds = generateSeedActivities().filter((r) => r.distance >= 2.0);
            store.clear();
            seeds.forEach((run) => store.put(run));
            localStorage.setItem('runtrackr_real_data_v3', 'true');
            resolve(seeds);
          } else {
            // Recalculate score on existing runs to guarantee formula consistency
            const updated = runs
              .filter((r) => r.distance >= 2.0)
              .map((r) => ({
                ...r,
                score: calculateScore(r.distance, r.duration, r.avgHeartRate),
              }));
            resolve(updated);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback in-memory / local storage
      const needsRealSeed = !localStorage.getItem('runtrackr_real_data_v3');
      if (!needsRealSeed) {
        const stored = localStorage.getItem('runtrackr_runs');
        if (stored) {
          const parsed = (JSON.parse(stored) as RunActivity[]).filter((r) => r.distance >= 2.0);
          return parsed.map((r) => ({
            ...r,
            score: calculateScore(r.distance, r.duration, r.avgHeartRate),
          }));
        }
      }
      const seeds = generateSeedActivities().filter((r) => r.distance >= 2.0);
      localStorage.setItem('runtrackr_runs', JSON.stringify(seeds));
      localStorage.setItem('runtrackr_real_data_v3', 'true');
      return seeds;
    }
  },

  async saveRun(run: RunActivity): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        const req = store.put(run);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const runs = await this.getAllRuns();
      const idx = runs.findIndex((r) => r.id === run.id);
      if (idx >= 0) runs[idx] = run;
      else runs.push(run);
      localStorage.setItem('runtrackr_runs', JSON.stringify(runs));
    }
  },

  async saveMultipleRuns(runsToSave: RunActivity[]): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        runsToSave.forEach((run) => store.put(run));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      localStorage.setItem('runtrackr_runs', JSON.stringify(runsToSave));
    }
  },

  async deleteRun(id: string): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const runs = await this.getAllRuns();
      const filtered = runs.filter((r) => r.id !== id);
      localStorage.setItem('runtrackr_runs', JSON.stringify(filtered));
    }
  },

  async deleteMultipleRuns(ids: string[]): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        ids.forEach((id) => store.delete(id));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      const runs = await this.getAllRuns();
      const idSet = new Set(ids);
      const filtered = runs.filter((r) => !idSet.has(r.id));
      localStorage.setItem('runtrackr_runs', JSON.stringify(filtered));
    }
  },

  async clearAllRuns(): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RUNS, 'readwrite');
        const store = tx.objectStore(STORE_RUNS);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      localStorage.setItem('runtrackr_runs', JSON.stringify([]));
    }
  },

  async reseedRuns(): Promise<RunActivity[]> {
    await this.clearAllRuns();
    const seeds = generateSeedActivities();
    await this.saveMultipleRuns(seeds);
    return seeds;
  },

  async getUserProfile(): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      name: 'Syahrul Miftah',
      email: 'syahrulmiftahfarid@gmail.com',
    };
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_SETTINGS, 'readonly');
        const store = tx.objectStore(STORE_SETTINGS);
        const req = store.get('profile');
        req.onsuccess = () => {
          if (req.result && req.result.value) {
            resolve(req.result.value);
          } else {
            resolve(defaultProfile);
          }
        };
        req.onerror = () => resolve(defaultProfile);
      });
    } catch {
      const stored = localStorage.getItem('runtrackr_profile');
      if (stored) return JSON.parse(stored);
      return defaultProfile;
    }
  },

  async updateUserProfile(profile: UserProfile): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_SETTINGS, 'readwrite');
        const store = tx.objectStore(STORE_SETTINGS);
        const req = store.put({ key: 'profile', value: profile });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      localStorage.setItem('runtrackr_profile', JSON.stringify(profile));
    }
  },
};

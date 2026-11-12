import {
  AudioRecording,
  CommandMacro,
  Contact,
  RcloneSyncConfig,
  RealDeviceParameters,
  SyncLog
} from '../types';
import {
  INITIAL_RECORDINGS,
  INITIAL_MACROS,
  NESRIN_OUIS_CONTACT,
  INITIAL_RCLONE_CONFIG,
  generateInitialSyncLogs
} from '../data/initialData';

const DB_NAME = 'AudioSyncHubDB';
const DB_VERSION = 1;
const AUDIO_STORE = 'audioBlobs';

// Open IndexedDB for audio file Blobs
function openAudioDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAudioBlob(id: number, blob: Blob): Promise<void> {
  try {
    const db = await openAudioDb();
    const tx = db.transaction(AUDIO_STORE, 'readwrite');
    const store = tx.objectStore(AUDIO_STORE);
    store.put({ id, blob });
  } catch (err) {
    console.warn('Could not store audio blob in IndexedDB:', err);
  }
}

export async function getAudioBlob(id: number): Promise<Blob | null> {
  try {
    const db = await openAudioDb();
    return new Promise((resolve) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteAudioBlob(id: number): Promise<void> {
  try {
    const db = await openAudioDb();
    const tx = db.transaction(AUDIO_STORE, 'readwrite');
    tx.objectStore(AUDIO_STORE).delete(id);
  } catch (err) {
    console.warn('Could not delete audio blob:', err);
  }
}

// LocalStorage helpers with seed fallback
export function getStoredRecordings(): AudioRecording[] {
  try {
    const raw = localStorage.getItem('ash_recordings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  setStoredRecordings(INITIAL_RECORDINGS);
  return INITIAL_RECORDINGS;
}

export function setStoredRecordings(recs: AudioRecording[]): void {
  try {
    // don't serialize audioBlobUrl
    const clean = recs.map(({ audioBlobUrl, ...rest }) => rest);
    localStorage.setItem('ash_recordings', JSON.stringify(clean));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredContacts(): Contact[] {
  try {
    const raw = localStorage.getItem('ash_contacts');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const initial = [NESRIN_OUIS_CONTACT];
  setStoredContacts(initial);
  return initial;
}

export function setStoredContacts(contacts: Contact[]): void {
  try {
    localStorage.setItem('ash_contacts', JSON.stringify(contacts));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredMacros(): CommandMacro[] {
  try {
    const raw = localStorage.getItem('ash_macros');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  setStoredMacros(INITIAL_MACROS);
  return INITIAL_MACROS;
}

export function setStoredMacros(macros: CommandMacro[]): void {
  try {
    localStorage.setItem('ash_macros', JSON.stringify(macros));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredSyncLogs(): SyncLog[] {
  try {
    const raw = localStorage.getItem('ash_sync_logs');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const initial = generateInitialSyncLogs();
  setStoredSyncLogs(initial);
  return initial;
}

export function setStoredSyncLogs(logs: SyncLog[]): void {
  try {
    localStorage.setItem('ash_sync_logs', JSON.stringify(logs.slice(-100)));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredRcloneConfig(): RcloneSyncConfig {
  try {
    const raw = localStorage.getItem('ash_rclone_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_RCLONE_CONFIG;
}

export function setStoredRcloneConfig(cfg: RcloneSyncConfig): void {
  try {
    localStorage.setItem('ash_rclone_config', JSON.stringify(cfg));
  } catch (e) {
    console.error(e);
  }
}

export const INITIAL_REAL_PARAMS: RealDeviceParameters = {
  realHardwareDac: true,
  realMicrophoneDirect: true,
  realSilenceVAD: true,
  realRcloneExecution: true,
  realGoogleAuthOAuth: true,
  realAutoCloudSync: true,
  realTermuxSocket: true,
  realExponentialRetry: true,
  realStorageAccess: true
};

export function getStoredRealParams(): RealDeviceParameters {
  try {
    const raw = localStorage.getItem('ash_real_params');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REAL_PARAMS;
}

export function setStoredRealParams(p: RealDeviceParameters): void {
  try {
    localStorage.setItem('ash_real_params', JSON.stringify(p));
  } catch (e) {
    console.error(e);
  }
}

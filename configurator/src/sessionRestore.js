// Session restore for the configurator.
//
// An accidental refresh used to wipe the whole configuration — uploaded photo
// included — forcing the customer to start over. This module persists:
//   - the selections + view mode  -> localStorage (small JSON, debounced)
//   - the uploaded photo (a File) -> IndexedDB (localStorage can't hold a
//     30 MB image; IDB stores the Blob natively on all modern browsers,
//     desktop and mobile alike)
// and restores both on the next load. Everything is wrapped in try/catch so
// private-browsing modes or blocked storage simply degrade to the old
// start-fresh behaviour instead of breaking the page.

const STATE_KEY = 'earls_configurator_session_v1';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // sessions older than a week start fresh

const DB_NAME = 'earls-configurator';
const DB_STORE = 'files';
const IMAGE_KEY = 'customer-image';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no idb'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(DB_STORE)) {
        req.result.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbOp(mode, fn) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, mode);
    const store = tx.objectStore(DB_STORE);
    const req = fn(store);
    tx.oncomplete = () => { db.close(); resolve(req && req.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  }));
}

export function saveImageBlob(file) {
  return idbOp('readwrite', s => s.put(file, IMAGE_KEY)).catch(() => {});
}

export function loadImageBlob() {
  return idbOp('readonly', s => s.get(IMAGE_KEY)).catch(() => null);
}

export function clearImageBlob() {
  return idbOp('readwrite', s => s.delete(IMAGE_KEY)).catch(() => {});
}

// imageUrl (a blob:/data: preview) and imageFile die with the page — the
// preview is rebuilt from the IDB blob on restore, so neither is persisted.
export function saveSessionState(selections, viewMode) {
  try {
    const { imageUrl, imageFile, ...rest } = selections;
    localStorage.setItem(STATE_KEY, JSON.stringify({
      selections: rest,
      hadCustomImage: !!imageFile,
      viewMode,
      savedAt: Date.now(),
    }));
  } catch (e) { /* storage unavailable — session just won't survive refresh */ }
}

export function loadSessionState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.selections) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearSession();
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  try { localStorage.removeItem(STATE_KEY); } catch (e) { /* ignore */ }
  clearImageBlob();
}

// Persistence: localStorage with a write-then-swap and a backup copy, plus file export/import.

import { serialize, deserialize, emptyState } from '../core/store.js';
import { dayToISO } from '../core/dates.js';

const KEY = 'grammar-stream.save';
const BAK = KEY + '.bak';
const TMP = KEY + '.tmp';

function ls() {
  try { return window.localStorage; } catch { return null; }
}

export function loadState(today) {
  const store = ls();
  if (!store) return { state: emptyState(today), warning: 'Storage is unavailable, so progress will not be saved on this device.' };
  for (const key of [KEY, BAK, TMP]) {
    const text = store.getItem(key);
    if (!text) continue;
    try {
      const { data } = deserialize(text);
      return { state: data, warning: key === KEY ? null : 'The main save was damaged, so a backup copy was restored.' };
    } catch (e) {
      console.warn('save slot unreadable', key, e);
    }
  }
  return { state: emptyState(today), warning: null, fresh: true };
}

export function saveState(state) {
  const store = ls();
  if (!store) return false;
  const text = serialize(state);
  try {
    store.setItem(TMP, text);
    const prev = store.getItem(KEY);
    if (prev) store.setItem(BAK, prev);
    store.setItem(KEY, text);
    store.removeItem(TMP);
    return true;
  } catch (e) {
    console.error('save failed', e);
    return false;
  }
}

export async function requestPersistence() {
  try { return await navigator.storage?.persist?.(); } catch { return false; }
}

export function exportFile(state, today) {
  const text = serialize(state);
  const name = `grammar-stream-backup-${dayToISO(today)}.json`;
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return name;
}

/** Ask for a file, validate it, and resolve with the parsed state (does not save). */
export function pickBackupFile() {
  return new Promise((resolve, reject) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json,application/json' });
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return reject(new Error('No file chosen.'));
      try {
        resolve(deserialize(await f.text()));
      } catch (e) {
        reject(e);
      }
    };
    input.click();
  });
}

export function wipe() {
  const store = ls();
  [KEY, BAK, TMP].forEach((k) => store?.removeItem(k));
}

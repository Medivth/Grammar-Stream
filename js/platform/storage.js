// Persistence: localStorage with a write-then-swap and a backup copy, plus file export/import.

import { serialize, deserialize, emptyState } from '../core/store.js';
import { dayToISO } from '../core/dates.js';

const BASE = 'grammar-stream.save';
const REGISTRY = 'grammar-stream.profiles';
// the first child keeps the original key, so saves from before profiles existed load unchanged
const slot = (id = 'main') => { const KEY = id === 'main' ? BASE : `${BASE}.${id}`; return { KEY, BAK: KEY + '.bak', TMP: KEY + '.tmp' }; };

function ls() {
  try { return window.localStorage; } catch { return null; }
}

export function loadState(today, id = 'main') {
  const { KEY, BAK, TMP } = slot(id);
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

export function saveState(state, id = 'main') {
  const { KEY, BAK, TMP } = slot(id);
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

export function wipe(id = 'main') {
  const { KEY, BAK, TMP } = slot(id);
  const store = ls();
  [KEY, BAK, TMP].forEach((k) => store?.removeItem(k));
}

// --- profiles ---------------------------------------------------------------------------
/** [{ id, name, course }]. A device that has only ever had one child has no registry yet. */
export function listProfiles() {
  const store = ls();
  try {
    const reg = JSON.parse(store?.getItem(REGISTRY) || 'null');
    if (Array.isArray(reg) && reg.length) return reg;
  } catch { /* unreadable registry: fall back to the main slot */ }
  return store?.getItem(BASE) || store?.getItem(BASE + '.bak') ? [{ id: 'main', name: '', course: 'y6' }] : [];
}

export function saveProfiles(list) {
  try { ls()?.setItem(REGISTRY, JSON.stringify(list)); } catch (e) { console.error('profiles save failed', e); }
}

export function upsertProfile(id, state) {
  const list = listProfiles().filter((p) => p.id !== id);
  const at = listProfiles().findIndex((p) => p.id === id);
  const entry = { id, name: state.profile?.childName || '', course: state.course || 'y6' };
  list.splice(at < 0 ? list.length : at, 0, entry);
  saveProfiles(list);
}

export function removeProfile(id) {
  wipe(id);
  saveProfiles(listProfiles().filter((p) => p.id !== id));
}

export const newProfileId = () => `p${Date.now().toString(36)}`;

// Save format: versioned JSON envelope with a checksum and a migration chain.
// Only primary data is stored (answers, card memory states, settings); everything
// shown on screen is derived from it.

import { hashString } from './rng.js';

export const APP_ID = 'grammar-stream';
export const SCHEMA_VERSION = 3;

/** MIGRATIONS[n] upgrades data from schema n to n + 1. */
export const MIGRATIONS = {
  // v2: weekly writing pieces, the reading ladder, placement
  1: (d) => ({ ...d, pieces: d.pieces || [], books: d.books || [], settings: { readingRung: 1, ...d.settings } }),
  // v3: arithmetic sprints
  2: (d) => ({ ...d, sprints: d.sprints || [] }),
};

export function emptyState(today) {
  return {
    created: today,
    profile: null, // { childName, companion: { name, fur, accessory }, parentPin }
    settings: {
      sessionMinutes: 25,
      bedtime: '20:30',
      earliest: '06:30',
      font: 'default',
      textScale: 1,
      tts: true,
      reduceMotion: false,
      readingRung: 1,
    },
    cards: {}, // itemId -> FSRS card
    templates: {}, // "templateId@level" -> { difficulty, attempts }
    topics: {}, // topicId -> mastery state
    subjects: {}, // subjectId -> { ability, attempts, lastNew, placed }
    log: [], // [day, ts, itemId, correct, rating, elapsedDays, ms, conf, fmt]
    sessions: [], // { day, start, end, answered, correct, completed }
    lastFeedback: null, // { day, entries: [{ prompt, given, answer, correct, conf }] }
    reading: [], // { day, minutes, title }
    writing: [], // { day, taskId, text }
    taught: [], // { day, topicId, text }
    pieces: [], // weekly writing: { id, promptId, startDay, mode, plan, text, checked, submittedDay, mark, seen }
    books: [], // { bookId | title, author, startDay, endDay }
    sprints: [], // arithmetic sprints: { day, level, answered, correct }
    plan: null, // the in-progress day plan
    lastBackup: null,
  };
}

export function checksum(str) {
  return hashString(str).toString(16).padStart(8, '0');
}

export function serialize(data, now = Date.now()) {
  const body = JSON.stringify(data);
  return JSON.stringify({ app: APP_ID, schema_version: SCHEMA_VERSION, saved_at: now, checksum: checksum(body), data });
}

export class SaveError extends Error {}

export function deserialize(text, { migrations = MIGRATIONS, target = SCHEMA_VERSION } = {}) {
  let env;
  try {
    env = JSON.parse(text);
  } catch {
    throw new SaveError('This file is not a Grammar Stream save (it is not valid JSON).');
  }
  if (!env || env.app !== APP_ID || typeof env.schema_version !== 'number' || !env.data) {
    throw new SaveError('This file is not a Grammar Stream save.');
  }
  if (checksum(JSON.stringify(env.data)) !== env.checksum) {
    throw new SaveError('This save file is damaged (checksum does not match).');
  }
  if (env.schema_version > target) {
    throw new SaveError('This save was made by a newer version of the app. Update the app first.');
  }
  let data = env.data;
  for (let v = env.schema_version; v < target; v++) {
    const m = migrations[v];
    if (!m) throw new SaveError(`No upgrade path from save version ${v}.`);
    data = m(data);
  }
  return { data, savedAt: env.saved_at, version: env.schema_version };
}

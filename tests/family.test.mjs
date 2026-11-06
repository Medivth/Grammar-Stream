// The family goal (totals across children, Monday weeks, the shared reward) and grown-ups' notes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, serialize, deserialize } from '../js/core/store.js';
import { weekStart } from '../js/core/dates.js';
import {
  contribution, familyWeek, suggestedTarget, normalFamily, recordWeek, KEEP_WEEKS, grantReward, hasFamilyReward,
  celebrationDue, markCelebrated, addNote, nextNewNote, markShown, thankNote, noteStatus, signedBy, NOTE_MAX, goalsReached,
} from '../js/core/family.js';
import { stickerSVG, STICKERS } from '../js/ui/stickers.js';
import { sceneSVG, SCENE_BY_ID } from '../js/ui/scenes.js';

// 20395 is a Monday (3 Nov 2025), so 20395..20401 is one week
const MON = 20395;
assert.equal(weekStart(MON), MON);

function child(id, course, { reading = [], sessions = [], topics = {} } = {}) {
  const state = emptyState(MON - 30);
  state.course = course;
  state.reading = reading.map(([day, minutes]) => ({ day, minutes, title: null }));
  state.sessions = sessions.map(([day, completed = true]) => ({ day, start: 1, end: 2, answered: 5, correct: 4, completed }));
  state.topics = topics;
  return { id, course, state };
}

const family = () => [
  child('main', 'ks1', { reading: [[MON, 20], [MON + 3, 15], [MON - 1, 50]], sessions: [[MON], [MON + 1], [MON + 2, false]] }),
  child('p2', 'y6', { reading: [[MON + 6, 40], [MON + 7, 30]], sessions: [[MON + 6]], topics: { a: { state: 'proficient', profDay: MON + 2 }, b: { state: 'mastered', profDay: MON + 4 }, c: { state: 'proficient', profDay: MON - 3 } } }),
  child('p3', 'y8', { reading: [[MON + 1, 60]], topics: { d: { state: 'proficient', profDay: MON, assumed: true }, e: { state: 'learning', profDay: MON + 1 } } }),
];

test('each child adds what they did in the Monday-to-Sunday week, nothing outside it', () => {
  const [a, b, c] = family();
  assert.equal(contribution(a.state, 'reading', MON), 35); // the Sunday before does not count
  assert.equal(contribution(b.state, 'reading', MON), 40); // Sunday counts, the next Monday does not
  assert.equal(contribution(b.state, 'reading', MON + 7), 30);
  assert.equal(contribution(a.state, 'sessions', MON), 2); // an unfinished session does not count
  assert.equal(contribution(b.state, 'topics', MON), 2);
  assert.equal(contribution(c.state, 'topics', MON), 0); // placement's "already known" and a topic that slipped back do not count
  assert.equal(contribution({ ...emptyState(1), reading: undefined }, 'reading', MON), 0); // older saves
});

test('the family total adds up every child, in profile order, against the target', () => {
  const kids = family();
  const wk = familyWeek(kids, { type: 'reading', target: 120 }, MON);
  assert.deepEqual(wk.parts, [{ id: 'main', amount: 35 }, { id: 'p2', amount: 40 }, { id: 'p3', amount: 60 }]);
  assert.equal(wk.total, 135);
  assert.equal(wk.reached, true);
  assert.equal(familyWeek(kids, { type: 'reading', target: 200 }, MON).reached, false);
  // the order is the profile order, whatever the amounts: never a ranking
  assert.deepEqual(familyWeek([...kids].reverse(), { type: 'sessions', target: 9 }, MON).parts.map((p) => p.id), ['p3', 'p2', 'main']);
  // next week starts afresh
  assert.equal(familyWeek(kids, { type: 'reading', target: 120 }, MON + 7).total, 30);
});

test('the suggested target grows with the number and ages of the children', () => {
  assert.equal(suggestedTarget('reading', ['ks1', 'y6', 'y8']), 300);
  assert.ok(suggestedTarget('reading', ['ks1', 'y6']) < suggestedTarget('reading', ['ks1', 'y6', 'y8']));
  assert.ok(suggestedTarget('reading', ['ks1', 'ks1']) < suggestedTarget('reading', ['y8', 'y8']));
  assert.equal(suggestedTarget('sessions', ['ks1', 'y8']), 9);
  assert.ok(suggestedTarget('topics', ['y3', 'y6']) >= 3);
  // with no target set, the suggestion is used
  assert.equal(familyWeek(family(), { type: 'reading', target: null }, MON).target, 300);
  assert.deepEqual(normalFamily(null).goal, { type: 'reading', target: null });
  assert.deepEqual(normalFamily({ goal: { type: 'nonsense', target: -3 }, weeks: 'x' }), { goal: { type: 'reading', target: null }, signoff: '', weeks: [] });
});

test('recent weeks are kept briefly, and a reached week stays reached', () => {
  const f = normalFamily(null);
  const kids = family();
  assert.equal(recordWeek(f, familyWeek(kids, { type: 'reading', target: 100 }, MON), MON + 2), true);
  assert.equal(recordWeek(f, familyWeek(kids, { type: 'reading', target: 100 }, MON), MON + 3), false, 'nothing new');
  assert.equal(f.weeks[0].reached, true);
  assert.equal(f.weeks[0].reachedDay, MON + 2);
  // the grown-up raises the target afterwards: the week still counts as reached
  recordWeek(f, familyWeek(kids, { type: 'reading', target: 500 }, MON), MON + 4);
  assert.equal(f.weeks[0].reached, true);
  assert.equal(f.weeks[0].target, 100);
  for (let i = 1; i <= 8; i++) recordWeek(f, familyWeek(kids, { type: 'reading', target: 100 }, MON + 7 * i), MON + 7 * i);
  assert.equal(f.weeks.length, KEEP_WEEKS);
  assert.equal(f.weeks[0].ws, MON + 7 * 3);
  assert.equal(goalsReached(f), 0);
});

test('reaching the goal unlocks the same reward for every child, once, and each celebrates once', () => {
  const kids = family();
  const f = normalFamily(null);
  recordWeek(f, familyWeek(kids, { type: 'reading', target: 100 }, MON), MON + 3);
  for (const k of kids) assert.equal(hasFamilyReward(k.state), false);
  // every child gets the flag, even one who has not done anything this week
  for (const k of kids) assert.equal(grantReward(k.state, MON + 3), true);
  for (const k of kids) assert.equal(hasFamilyReward(k.state), true);
  assert.equal(grantReward(kids[0].state, MON + 10), false, 'never granted twice, never moved');
  assert.equal(kids[0].state.family.reward, MON + 3);
  // the flag survives a save and load, and older saves without it load as "not yet"
  assert.equal(deserialize(serialize(kids[1].state)).data.family.reward, MON + 3);
  const old = emptyState(1); delete old.family;
  assert.equal(hasFamilyReward(old), false);
  assert.equal(celebrationDue(old, f, MON + 3)?.ws, MON);
  // a celebration the first time each child opens the app after it is reached
  const [a, b] = kids;
  assert.equal(celebrationDue(a.state, f, MON + 3)?.ws, MON);
  markCelebrated(a.state, MON);
  assert.equal(celebrationDue(a.state, f, MON + 4), null);
  // a child who first opens the app the next Monday still gets it; the week after, it has passed
  assert.equal(celebrationDue(b.state, f, MON + 7)?.ws, MON);
  assert.equal(celebrationDue(b.state, f, MON + 14), null);
  // the sticker art and the picnic scene draw
  assert.ok(SCENE_BY_ID.picnic && sceneSVG('picnic', { species: 'lion', name: 'Leo' }).includes('Leo in the family picnic'));
});

test('a grown-up’s note pops up once, stays in the list, and records the thank-you', () => {
  const s = emptyState(MON);
  assert.equal(addNote(s, { text: '   ' }, MON), null, 'an empty note is not sent');
  const n1 = addNote(s, { text: 'Brilliant reading this week!', sticker: 'star', from: '' }, MON, 1000);
  const n2 = addNote(s, { sticker: 'rocket', from: 'Dad' }, MON + 1, 2000);
  assert.equal(signedBy(n1), 'your grown-up');
  assert.equal(signedBy(n2), 'Dad');
  assert.equal(addNote(s, { text: 'x'.repeat(500) }, MON, 3000).text.length, NOTE_MAX);
  assert.equal(noteStatus(n1), 'waiting');
  assert.equal(nextNewNote(s), n1, 'oldest first');
  markShown(n1, MON + 1);
  assert.equal(nextNewNote(s), n2);
  markShown(n2, MON + 1);
  markShown(s.notes[2], MON + 1);
  assert.equal(nextNewNote(s), null, 'each pops up only once');
  assert.equal(s.notes.length, 3, 'all kept to reopen');
  assert.equal(noteStatus(n1), 'seen');
  thankNote(n1, MON + 2);
  thankNote(n1, MON + 5);
  assert.equal(noteStatus(n1), 'thanked');
  assert.equal(n1.thanked, MON + 2);
  // the receipt is saved in the child's state, where the grown-up's screen reads it
  const back = deserialize(serialize(s)).data;
  assert.equal(back.notes[0].thanked, MON + 2);
  assert.equal(back.notes[1].shown, MON + 1);
  // a long history keeps the most recent notes
  for (let i = 0; i < 40; i++) addNote(s, { text: `note ${i}` }, MON, 10000 + i);
  assert.equal(s.notes.length, 30);
  assert.equal(s.notes.at(-1).text, 'note 39');
  // a note arriving in an older save that has no notes list
  const old = emptyState(1); delete old.notes;
  addNote(old, { sticker: 'owl' }, MON);
  assert.equal(nextNewNote(old).sticker, 'owl');
});

test('stickers draw as one well-formed svg each', () => {
  assert.ok(STICKERS.length >= 6);
  for (const id of ['star', 'trophy', 'heart', 'rocket', 'laurel', 'owl']) assert.ok(STICKERS.includes(id), id);
  for (const id of STICKERS) {
    const svg = stickerSVG(id);
    assert.match(svg, /^<svg[^>]*role="img"/);
    assert.ok(!/NaN|undefined/.test(svg), id);
    assert.equal(svg.match(/<svg/g).length, 1);
  }
  assert.equal(stickerSVG('nope'), '');
});

test('on a device: the bar reads every child’s save, writes only the reward flag into the others, and notes reach the chosen child', async () => {
  const mem = new Map();
  globalThis.window = { localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) } };
  const storage = await import('../js/platform/storage.js');
  const { familyNow, sendNote } = await import('../js/ui/family.js');
  const kids = family();
  kids.forEach((k, i) => { k.state.profile = { childName: ['Sam', 'Ada', 'Zoe'][i], companion: { name: 'C' + i } }; storage.saveState(k.state, k.id); storage.upsertProfile(k.id, k.state); });
  assert.equal(storage.listProfiles().length, 3);
  const app = { profileId: 'main', state: storage.loadState(MON + 3, 'main').state, today: () => MON + 3, profiles: storage.listProfiles, save() { storage.saveState(app.state, app.profileId); } };
  // not reached yet: nothing in the other children's saves changes
  storage.saveFamily({ goal: { type: 'reading', target: 400 } });
  const before = ['p2', 'p3'].map((id) => mem.get(`grammar-stream.save.${id}`));
  let fam = familyNow(app);
  assert.equal(fam.week.total, 135);
  assert.equal(fam.week.reached, false);
  assert.deepEqual(['p2', 'p3'].map((id) => mem.get(`grammar-stream.save.${id}`)), before);
  assert.equal(storage.loadFamily().weeks.length, 1, 'this week is noted for the grown-up');
  // the grown-up lowers the target: reached, and every child has the picnic
  storage.saveFamily({ ...storage.loadFamily(), goal: { type: 'reading', target: 130 } });
  fam = familyNow(app);
  assert.equal(fam.week.reached, true);
  assert.equal(app.state.family.reward, MON + 3);
  for (const id of ['p2', 'p3']) {
    const st = storage.loadState(MON + 3, id).state;
    assert.equal(st.family.reward, MON + 3, `${id} has the reward`);
    assert.equal(st.reading.length, kids.find((k) => k.id === id).state.reading.length, 'and the rest of the save is as it was');
    assert.equal(celebrationDue(st, fam.family, MON + 4)?.ws, MON, `${id} will celebrate when they next open the app`);
  }
  // a note to another child lands in their save, not this one's
  assert.equal(sendNote(app, 'p3', { text: 'Well done, Zoe!', sticker: 'laurel', from: 'Mum' }), true);
  assert.equal((app.state.notes || []).length, 0);
  const zoe = storage.loadState(MON + 3, 'p3').state;
  assert.equal(nextNewNote(zoe).text, 'Well done, Zoe!');
  assert.equal(nextNewNote(zoe).from, 'Mum');
  // and to the child showing now, into the live state
  sendNote(app, 'main', { sticker: 'heart' });
  assert.equal(nextNewNote(app.state).sticker, 'heart');
  assert.equal(nextNewNote(storage.loadState(MON + 3, 'main').state).sticker, 'heart');
  // an id with no save is left alone
  assert.equal(sendNote(app, 'nobody', { text: 'hi' }), false);
  delete globalThis.window;
});

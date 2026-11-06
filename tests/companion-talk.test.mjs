// The living companion: what it says in its speech bubble (picked from the child's real day, in a
// voice for the course, never nagging), and the moving parts in its drawing and in the scenes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { setCourse, COURSE } from '../js/core/subjects.js';
import { milestones } from '../js/core/progress.js';
import { planDay } from '../js/core/session.js';
import { companionLines, talkContext, badgeStep, nearBadge, voiceOf } from '../js/ui/companion-talk.js';
import { capybaraSVG, SPECIES } from '../js/ui/capybara.js';
import { SCENES, sceneSVG } from '../js/ui/scenes.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const dbFor = (index) => buildDB(read(index).decks.map(read));

const base = { day: 100, hour: 16, child: 'Ada', phase: 'ready', reviews: 0, newTopics: [], sprintYesterday: 0, book: null, bonus: null, badge: null, extra: [] };
const ids = (lines) => lines.map((l) => l.id);
// words that would make a child feel behind or told off
const GUILT = /streak|missed|miss you|lost|behind|should|must|hurry|don.t forget|lazy|late|only \d+|haven.t|disappoint|sad/i;

test('lines come from the real day, most useful first, with a greeting in front', () => {
  const ctx = { ...base, voice: 'y6', reviews: 12, newTopics: ['Science'], sprintYesterday: 18, book: 'The Hobbit', bonus: { title: 'Electricity', done: 2, total: 6, started: true }, badge: { title: 'Bookworm', step: 'Finish 1 more book' }, extra: [{ name: 'Latin', due: 3, fresh: false }] };
  const lines = companionLines(ctx);
  assert.deepEqual(ids(lines), ['reviews', 'new', 'badge', 'bonus', 'sprint', 'book', 'extra', 'trick']);
  assert.match(lines[0].text, /^Salve, Ada! 12 reviews/);
  assert.match(lines[1].text, /new Science topic/);
  assert.equal(lines[2].text, 'Finish 1 more book to earn the Bookworm badge.');
  assert.match(lines[3].text, /2 of 6 parts of Electricity/);
  assert.match(lines[4].text, /18 right/);
  assert.match(lines[5].text, /The Hobbit/);
  assert.match(lines[6].text, /3 Latin reviews/);
  // nothing waiting at all: a hello, and the trick
  assert.deepEqual(ids(companionLines({ ...base, voice: 'young' })), ['hello', 'trick']);
  // one review, said properly
  assert.match(companionLines({ ...base, voice: 'young', reviews: 1 })[0].text, /1 (quick|memory) question\b/);
});

test('finished and resting days say different things, and resting never sends her to work', () => {
  const busy = { ...base, voice: 'young', reviews: 9, newTopics: ['Maths'], book: 'Stig of the Dump', badge: { title: 'Bookworm', step: 'Finish 1 more book' }, bonus: { title: 'Florence Nightingale', done: 0, total: 5, started: false } };
  const done = companionLines({ ...busy, phase: 'finished' });
  assert.equal(done[0].id, 'finished');
  assert.ok(!ids(done).includes('reviews') && !ids(done).includes('new'), 'no work left to point at');
  assert.ok(ids(done).includes('badge') && ids(done).includes('book'));
  const night = companionLines({ ...busy, phase: 'rest', hour: 20, badge: null, bonus: null });
  assert.deepEqual(ids(night), ['rest', 'book', 'trick']);
  assert.match(night[0].text, /bedtime/);
  assert.match(night[1].text, /Stig of the Dump/);
  const dawn = companionLines({ ...busy, phase: 'rest', hour: 6, book: null, badge: null, bonus: null });
  assert.match(dawn[0].text, /breakfast/);
  assert.match(dawn[0].text, /^Good morning, Ada!/);
  const going = companionLines({ ...busy, phase: 'going' });
  assert.equal(going[0].id, 'going');
});

test('each course has its own voice: playful for Years 2/3, Latin hello for Year 6, Greek for Year 8', () => {
  for (const [id, voice, hello] of [['ks1', 'young', /^Good afternoon, Ada!/], ['y3', 'young', /^Good afternoon, Ada!/], ['y6', 'y6', /^Salve, Ada!/], ['y8', 'y8', /^Chaire, Ada!/]]) {
    setCourse(id);
    assert.equal(voiceOf(COURSE), voice, id);
    const lines = companionLines({ ...base, voice, reviews: 5, newTopics: ['History'] });
    assert.match(lines[0].text, hello, id);
  }
  const y8 = companionLines({ ...base, voice: 'y8', reviews: 5, sprintYesterday: 22, phase: 'ready' }).map((l) => l.text).join(' ');
  assert.match(y8, /Mnemosyne|Pheidippides|Coming back/);
  const young = companionLines({ ...base, voice: 'young', sprintYesterday: 22 }).map((l) => l.text).join(' ');
  assert.match(young, /Vroom/);
  setCourse('y6');
});

test('every line is short, warm and never nags, in every voice, phase and day', () => {
  const full = { reviews: 30, newTopics: ['Maths', 'Ancient Greek'], sprintYesterday: 25, book: 'The Adventures of Sherlock Holmes', bonus: { title: 'Florence Nightingale', done: 3, total: 5, started: true }, badge: { title: 'Spellbinding storyteller', step: 'Hand in 2 more weekly writing pieces' }, extra: [{ name: 'Ancient Greek', due: 0, fresh: true }, { name: 'Latin', due: 7, fresh: false }] };
  for (const voice of ['young', 'y6', 'y8']) {
    for (const phase of ['ready', 'going', 'finished', 'rest']) {
      for (const day of [0, 1, 2, 3]) {
        for (const hour of [7, 13, 19]) {
          const lines = companionLines({ ...base, ...full, voice, phase, day, hour });
          assert.ok(lines.length >= 2 && lines.at(-1).id === 'trick');
          assert.equal(new Set(lines.map((l) => l.text)).size, lines.length, 'no line twice');
          for (const { text } of lines) {
            assert.ok(text.length <= 125, `${voice} ${phase}: ${text.length} characters: ${text}`);
            assert.doesNotMatch(text, GUILT, text);
            assert.doesNotMatch(text, /undefined|NaN|null|\[object/, text);
            assert.match(text, /[.!?)]$/, `ends a sentence: ${text}`);
          }
        }
      }
    }
  }
});

test('a badge nearly earned is put as the next small step', () => {
  assert.equal(badgeStep('Finish 3 books', 2), 'Finish 2 more books');
  assert.equal(badgeStep('Finish 3 books', 1), 'Finish 1 more book');
  assert.equal(badgeStep('Light up 12 events on the timeline', 1), 'Light up 1 more event on the timeline');
  assert.equal(badgeStep('Know 50 countries', 1), 'Know 1 more country');
  assert.equal(badgeStep('Finish 2 Sherlock Holmes books', 1), 'Finish 1 more Sherlock Holmes book');
  assert.equal(badgeStep('Have 10 book talks with your grown-up', 1), 'Have 1 more book talk with your grown-up');
  assert.equal(badgeStep('Secure 4 ancient-world history topics: Athens, Sparta', 2), 'Secure 2 more ancient-world history topics');
  assert.equal(badgeStep('Hand in 15 weekly writing pieces', 1), 'Hand in 1 more weekly writing piece');
  assert.equal(badgeStep('Get 20 right in one sprint', 3), null, 'a best score is not counted up');
  const m = (id, desc, value, goal) => ({ id, title: id, desc, value, goal, done: value >= goal });
  assert.equal(nearBadge([m('far', 'Know 100 things', 40, 100)]), null, 'not close yet');
  assert.equal(nearBadge([m('none', 'Finish 3 books', 0, 3)]), null, 'not started');
  assert.equal(nearBadge([m('regular', 'Practise on 15 days in one month', 14, 15)]), null, 'no race against the calendar');
  assert.equal(nearBadge([m('done', 'Finish 3 books', 3, 3)]), null);
  const pick = nearBadge([m('century', 'Know 100 things', 90, 100), m('bookworm', 'Finish 3 books', 2, 3), m('sprinter', 'Get 20 right in one sprint', 19, 20)]);
  assert.equal(pick.id, 'century', 'the closest by share of the goal');
  assert.equal(pick.step, 'Know 10 more things');
});

test('the context is read from a real profile: reviews and new topics in the plan, the book, yesterday’s sprint, a badge', () => {
  setCourse('y6');
  const db = dbFor('index.json');
  const s = emptyState(200);
  s.profile = { childName: 'Ada', companion: { name: 'Mochi' } };
  s.sessions.push({ day: 199, start: 1, end: 2, answered: 5, correct: 5, completed: true });
  s.sprints.push({ day: 198, level: 1, answered: 20, correct: 19 }, { day: 199, level: 1, answered: 14, correct: 11 }, { day: 199, level: 1, answered: 16, correct: 13 });
  s.books.push({ title: 'Treasure Island', startDay: 190, endDay: null }, { title: 'Holes', startDay: 150, endDay: 170 }, { title: 'Wonder', startDay: 170, endDay: 185 });
  s.plan = planDay(s, db, 200);
  const ctx = talkContext(s, db, 200, { hour: 16 });
  assert.equal(ctx.voice, 'y6');
  assert.equal(ctx.phase, 'ready');
  assert.equal(ctx.sprintYesterday, 13, 'yesterday’s best, not the day before');
  assert.equal(ctx.book, 'Treasure Island');
  assert.ok(ctx.newTopics.length >= 1, 'a new topic is offered');
  assert.equal(ctx.badge?.id, 'bookworm', 'two of three books finished');
  assert.equal(ctx.badge.step, 'Finish 1 more book');
  assert.ok(ctx.bonus && !ctx.bonus.started, 'the electricity bonus is ready');
  assert.ok(ctx.extra.some((x) => x.name === 'Latin' && x.fresh));
  const lines = companionLines(ctx);
  assert.match(lines[0].text, /^Salve, Ada!/);
  assert.ok(ids(lines).includes('badge') && ids(lines).includes('book') && ids(lines).includes('sprint'));
  // the same day at rest: only the rest line, the book and the trick
  const rest = talkContext(s, db, 200, { hour: 21, rest: 'Screens rest in the hour before bed.' });
  assert.deepEqual(ids(companionLines(rest)), ['rest', 'book', 'trick']);
  // finished: no reviews pointed at
  s.plan.finished = true;
  assert.equal(talkContext(s, db, 200).phase, 'finished');
  assert.equal(milestones(s, db).find((m) => m.id === 'bookworm').value, 2);
});

/** Tags balance, attributes are quoted, and no number came out as NaN or undefined. */
function svgErrors(svg) {
  const errs = [];
  if (/NaN|undefined|Infinity|null/.test(svg)) errs.push('NaN, null or undefined in the markup');
  const stack = [];
  for (const [tag, close, name, attrs, self] of svg.replace(/<text[^]*?<\/text>/g, '').matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (/=\s*[^"\s]/.test(attrs.replace(/="[^"]*"/g, ''))) errs.push(`unquoted attribute in ${tag}`);
    if (close) { if (stack.pop() !== name) errs.push(`unbalanced </${name}>`); } else if (!self) stack.push(name);
  }
  if (stack.length) errs.push(`unclosed ${stack.join(', ')}`);
  return errs;
}
const count = (svg, cls) => (svg.match(new RegExp(`class="${cls}"`, 'g')) || []).length;

test('each companion has its moving parts, and stays well formed in every mood and outfit', () => {
  for (const species of Object.keys(SPECIES)) {
    for (const mood of ['neutral', 'happy', 'thinking', 'oops']) {
      for (const wear of [{}, { head: 'knight', hold: 'sword', hand: 'crestshield', back: 'cape' }, { ride: 'horse', hold: 'oillamp' }, { beside: 'lamp', body: 'toga' }]) {
        const svg = capybaraSVG({ species, mood, wear, fit: true });
        assert.deepEqual(svgErrors(svg), [], `${species} ${mood} ${JSON.stringify(wear)}`);
        assert.equal(count(svg, 'cp-fig') + count(svg, 'cp-fig cp-sway'), 1, `${species}: one figure breathes`);
        // happy eyes are already closed arcs, and oops eyes are wide: only the others blink
        assert.equal(count(svg, 'cp-eyes') > 0, mood === 'neutral' || mood === 'thinking', `${species} ${mood} blinks`);
      }
    }
    const svg = capybaraSVG({ species });
    if (species === 'lion') {
      assert.equal(count(svg, 'cp-tail'), 1);
      assert.equal(count(svg, 'cp-ear'), 1);
      assert.equal(count(svg, 'cp-arm'), 1, 'a free paw to wave');
      assert.equal(count(capybaraSVG({ species, wear: { hand: 'shield' } }), 'cp-arm'), 0, 'not with a shield on that arm');
    } else if (species === 'capybara') {
      assert.equal(count(svg, 'cp-ear'), 1);
      assert.equal(count(svg, 'cp-paw'), 1);
      assert.equal(count(svg, 'cp-head'), 1, 'and nods hello');
    } else {
      assert.equal(count(svg, 'cp-fig cp-sway'), 1, 'a person shifts her weight');
      assert.equal(count(svg, 'cp-head'), 2, 'the hair behind and the face nod together');
    }
    // riding, the rider sits still (no second breathing figure) but still blinks
    const riding = capybaraSVG({ species, wear: { ride: 'dragon' } });
    assert.equal(count(riding, 'cp-rider'), 1);
    assert.equal(count(riding, 'cp-fig') + count(riding, 'cp-fig cp-sway'), 1);
    assert.ok(count(riding, 'cp-eyes') === 1);
    // the prize lamps keep their tappable group
    assert.match(capybaraSVG({ species, accessory: 'oillamp' }), /class="companion-lamp" data-lamp="oillamp"/);
  }
});

test('scenes have gently moving parts, and stay well formed and compact', () => {
  const want = { space: ['amb-stars', 'amb-blink'], underwater: ['amb-fish', 'amb-bubbles'], racetrack: ['amb-cloud', 'amb-flag', 'amb-blink'], volcano: ['amb-smoke', 'amb-waves', 'amb-cloud'], aurora: ['amb-aurora', 'amb-stars', 'amb-steam'], castle: ['amb-flag', 'amb-cloud'], joust: ['amb-bunting', 'amb-flag'], pirate: ['amb-flag', 'amb-waves'], deepsea: ['amb-jelly', 'amb-blink'], arctic: ['amb-aurora', 'amb-blink'], baths: ['amb-steam'], pompeii: ['amb-smoke'], trireme: ['amb-waves'] };
  let moving = 0;
  for (const sc of SCENES) {
    const plain = sceneSVG(sc.id);
    assert.deepEqual(svgErrors(plain), [], sc.id);
    assert.ok(plain.length < 12000, `${sc.id} is ${plain.length} characters`);
    for (const cls of want[sc.id] || []) assert.ok(plain.includes(`class="${cls}"`), `${sc.id} has ${cls}`);
    if (/class="amb-/.test(plain)) moving++;
    // a moving part is a group of its own (or a path), never on an element that has its own transform
    assert.doesNotMatch(plain, /class="amb-[a-z]+" transform=|transform="[^"]*" class="amb-/, sc.id);
    const withPet = sceneSVG(sc.id, { species: 'lion', name: 'Leo' }, { bob: true });
    assert.equal(count(withPet, 'pet bob'), 1, `${sc.id}: the companion stands in its own group`);
    assert.equal(count(sceneSVG(sc.id, { species: 'capybara' }), 'pet'), 1);
  }
  assert.ok(moving >= SCENES.length * 0.6, `${moving} of ${SCENES.length} scenes move`);
});

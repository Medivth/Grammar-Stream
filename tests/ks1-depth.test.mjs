// Year 2 greater depth (tools/content-src/ks1/maths3.mjs, js/gen/ks1depth.js): every answer is
// worked out again here from the numbers in the question, by a different route from the generator.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GENERATORS } from '../js/gen/index.js';
import { check, correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';
import { setCourse } from '../js/core/subjects.js';
import { buildDB } from '../js/core/content.js';
import { topoOrder } from '../js/core/placement.js';

const N = 400;
const right = (q) => q.options.find((o) => o.correct).text;
const ev = (expr) => Function(`return ${expr.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')}`)();
const each = (name, fn) => { for (const level of [1, 2, 3]) { const rng = makeRng(`verify:${name}:${level}`); for (let i = 0; i < N; i++) fn(GENERATORS[name](level, rng), level); } };

test('estimates: a numeric answer with tol accepts anything that close, and nothing further', () => {
  const q = { kind: 'typed', numeric: { value: '35', form: 'any', tol: 2.5 } };
  for (const r of ['35', '34', '37', '36.5', 'thirty-five']) assert.equal(check(q, r).correct, true, r);
  for (const r of ['30', '38', '40', 'lots']) assert.equal(check(q, r).correct, false, r);
  assert.match(check(q, '34').message, /estimate/);
  assert.equal(check({ kind: 'typed', numeric: { value: '35', form: 'any' } }, '34').correct, false, 'no tol: exact');
});

test('balance: both sides of every number sentence really are equal', () => {
  each('k2Balance', (q) => {
    if (q.kind === 'typed') {
      const [l, r] = q.prompt.replace(/\?/g, q.numeric.value).split(' = ');
      assert.equal(ev(l), ev(r), q.prompt);
      assert.ok(+q.numeric.value > 0 && Number.isInteger(+q.numeric.value), q.prompt);
      return;
    }
    const [, l, r] = q.prompt.match(/(\d+ [+−] \d+) = (\d+ [+−] \d+)/);
    assert.equal(right(q).startsWith('True'), ev(l) === ev(r), q.prompt);
  });
});

test('using 2, 5 and 10 facts: every deduced fact and answer is right', () => {
  each('k2Deduce', (q) => {
    for (const [, a, b, c] of q.prompt.matchAll(/(\d+) × (\d+) = (\d+)/g)) assert.equal(+a * +b, +c, `given fact: ${q.prompt}`);
    if (q.kind === 'typed') {
      const miss = q.prompt.match(/^\? × (\d+) = (\d+)$/);
      const asked = [...q.prompt.matchAll(/(\d+) ([×÷]) (\d+)/g)].at(-1); // the question comes last
      const want = miss ? +miss[2] / +miss[1] : ev(`${asked[1]} ${asked[2]} ${asked[3]}`);
      assert.equal(+q.numeric.value, want, q.prompt);
      return;
    }
    const [, a, b] = q.prompt.match(/work out (\d+) × (\d+)/), target = a * b, text = right(q);
    const facts = [...text.matchAll(/(\d+) × (\d+) = (\d+)/g)];
    for (const [, x, y, z] of facts) assert.equal(x * y, +z, text);
    if (/^double (\d+)$/.test(text)) assert.equal(2 * text.match(/\d+/)[0], target, text);
    else if (/halve/.test(text)) assert.equal(facts[0][3] / 2, target, text);
    else assert.equal(facts.reduce((s, f) => s + +f[3], 0), target, text);
    // no wrong option reaches the target the same way
    for (const o of q.options.filter((o) => !o.correct)) {
      const fs = [...o.text.matchAll(/(\d+) × (\d+) = (\d+)/g)];
      if (fs.length === 2 && fs.every(([, x, y, z]) => x * y === +z)) assert.notEqual(+fs[0][3] + +fs[1][3], target, o.text);
    }
  });
});

test('thinking problems: sums and differences give whole answers that fit the story', () => {
  each('k2Think', (q) => {
    const p = q.prompt, v = +q.numeric.value;
    assert.ok(Number.isInteger(v) && v > 0, p);
    let m;
    if ((m = p.match(/^Together (.+?) and (.+?) have £?(\d+)[^.]*\. \1 has £?(\d+) more than \2\. How [^?]*? does (.+?) have\?$/))) {
      const [, A, , total, extra, X] = m, small = (total - extra) / 2;
      assert.ok(Number.isInteger(small) && small > 0, p);
      assert.equal(v, X === A ? small + +extra : small, p);
    } else if ((m = p.match(/^(.+?) has (twice|\d+ times) as (?:many|much) .+? as (.+?)\. Together they have £?(\d+)\. How [^?]*? does (.+?) have\?$/))) {
      const k = m[2] === 'twice' ? 2 : parseInt(m[2], 10), one = m[4] / (k + 1);
      assert.ok(Number.isInteger(one), p);
      assert.equal(v, m[5] === m[1] ? k * one : one, p);
    } else if ((m = p.match(/^(.+?) has (twice|\d+ times) as (?:many|much) .+? as (.+?)\. \1 has £?(\d+) more than \3\. How [^?]*? does (.+?) have\?$/))) {
      const k = m[2] === 'twice' ? 2 : parseInt(m[2], 10), one = m[4] / (k - 1);
      assert.ok(Number.isInteger(one), p);
      assert.equal(v, m[5] === m[1] ? k * one : one, p);
    } else if ((m = p.match(/^(.+?) has £?(\d+)[^.]*\. (.+?) has £?(\d+) (more|fewer|less) than \1\. How [^?]*? does \3 have\?$/))) {
      assert.equal(v, m[5] === 'more' ? +m[2] + +m[4] : m[2] - m[4], p);
    } else if ((m = p.match(/^(.+?) has £?(\d+)[^.]*\. (.+?) has £?(\d+) more than \1\. How [^?]*? do they have altogether\?$/))) {
      assert.equal(v, 2 * m[2] + +m[4], p);
    } else if ((m = p.match(/^(.+?) has £?(\d+) more than (.+?)\. \1 has £?(\d+)[^.]*\. How [^?]*? does \3 have\?$/))) {
      assert.equal(v, m[4] - m[2], p);
    } else if ((m = p.match(/^(.+?) has £?(\d+)[^.]*\. (.+?) has £?(\d+)\. How [^?]*? more [^?]*?does \1 have than \3\?$/))) {
      assert.equal(v, m[2] - m[4], p);
    } else assert.fail(`no check for: ${p}`);
  });
});

test('which is more: the right choice and the right difference, every time', () => {
  const groups = (t) => { const m = t.match(/^(\d+) \D+? (?:of|at) (\d+)p?(?: each)?$/); return m ? m[1] * m[2] : null; };
  each('k2WhichMore', (q) => {
    const p = q.prompt;
    let m;
    if ((m = p.match(/^Which (gives you more|has more|costs less)[^:]*: (.+?),? or (.+?)\?/))) {
      const a = groups(m[2]), b = groups(m[3]);
      assert.ok(a && b, p);
      if (q.kind === 'typed') { assert.equal(+q.numeric.value, Math.abs(a - b), p); return; }
      const less = m[1] === 'costs less';
      const want = a === b ? /same/ : (less ? a < b : a > b) ? m[2] : m[3];
      if (a === b) assert.match(right(q), want, p); else assert.equal(right(q), want, p);
    } else if (/laps of/.test(p)) {
      const km = [...p.matchAll(/(\w+) drives (\d+) laps of a (\d+) km track/g)].map(([, who, n, l]) => [who, n * l]);
      assert.equal(new Set(km.map(([, d]) => d)).size, 3, p);
      assert.equal(right(q), km.sort((x, y) => y[1] - x[1])[0][0], p);
    } else if ((m = p.match(/has (\d+) bags of 10 gold coins and spends (\d+)\. .+? has (\d+) bags of 5 gold coins and finds (\d+) more/))) {
      assert.equal(+q.numeric.value, Math.abs((10 * m[1] - m[2]) - (5 * m[3] + +m[4])), p);
    } else if ((m = p.match(/^Packs of 10 stickers cost (\d+)p\. Packs of 5 stickers cost (\d+)p\. .+? needs (\d+) stickers/))) {
      const big = (m[3] / 10) * m[1], small = (m[3] / 5) * m[2];
      assert.match(right(q), big === small ? /same/ : big < small ? /of 10$/ : /of 5$/, p);
    } else if ((m = p.match(/^(\d+) \w+ of (\d+) .+? is the same as how many \w+ of (\d+)\?$/))) {
      assert.equal(+q.numeric.value * m[3], m[1] * m[2], p);
    } else assert.fail(`no check for: ${p}`);
  });
});

test('tricky scales: the answer is where the arrow is, and an estimate needs to be close', () => {
  each('k2Scales', (q, level) => {
    if (q.kind === 'numberline') {
      assert.equal(q.target % ((q.max - q.min) / q.ticks), 0, 'placed on a mark');
      assert.ok(!q.labels.includes(q.target), 'on a mark without a number');
      assert.ok(q.tolerance < (q.max - q.min) / q.ticks / 2, 'the next mark is wrong');
      return;
    }
    const d = q.diagram, step = d.step, gap = d.labels[1] - d.labels[0];
    assert.ok([1, 2, 5, 10, 20, 50, 100].includes(step), `step ${step}`);
    assert.ok(gap / step > 1, 'not every mark is numbered');
    if (/each small mark/.test(q.prompt)) { assert.equal(+q.numeric.value, step); return; }
    assert.equal(+q.numeric.value, d.mark, q.prompt);
    assert.ok(!d.labels.includes(d.mark), 'the arrow is not on a number');
    if (q.numeric.tol) {
      assert.equal(level, 3);
      assert.equal((d.mark / step) % 1, 0.5, 'halfway between marks');
      assert.equal(check(q, String(d.mark - step / 2)).correct, false, 'the mark below is not close enough');
      assert.equal(check(q, String(d.mark + step / 2)).correct, false, 'the mark above is not close enough');
    } else assert.equal(d.mark % step, 0, 'on a mark');
  });
});

// said the UK way, worked out independently of the generator
const NUM = ['', 'five', 'ten', 'quarter', 'twenty', 'twenty-five', 'half'];
const say = (h, m) => (m === 0 ? `${h} o’clock` : m <= 30 ? `${NUM[m / 5]} past ${h}` : `${NUM[(60 - m) / 5]} to ${h === 12 ? 1 : h + 1}`);
const toMins = (t) => {
  let m = t.match(/^(\d+) o’clock$/); if (m) return (m[1] % 12) * 60;
  m = t.match(/^([\w-]+) (past|to) (\d+)$/); const k = NUM.indexOf(m[1]) * 5;
  return m[2] === 'past' ? (m[3] % 12) * 60 + k : ((m[3] % 12) * 60 - k + 720) % 720;
};
test('time to 5 minutes: the words match the clock, and durations add up', () => {
  assert.equal(say(3, 40), 'twenty to 4');
  assert.equal(say(4, 35), 'twenty-five to 5');
  assert.equal(say(12, 55), 'five to 1');
  assert.equal(toMins('quarter to 1'), 45);
  assert.equal(toMins('half past 12'), 30);
  each('k2Clock5', (q) => {
    const c = q.diagram;
    let m;
    if (q.prompt === 'What time does the clock show?') assert.equal(right(q), say(c.h, c.m));
    else if ((m = q.prompt.match(/^How many minutes (past|to) (\d+) is it\?$/))) assert.equal(+q.numeric.value, m[1] === 'past' ? c.m : 60 - c.m, q.prompt);
    else if ((m = q.prompt.match(/^Which time is the same as (\d+):(\d\d)\?$/))) assert.equal(right(q), say(+m[1], +m[2]));
    else if ((m = q.prompt.match(/(lasts|flying for) (\d+) minutes/))) {
      const end = ((c.h % 12) * 60 + c.m + (m[1] === 'lasts' ? 1 : -1) * m[2] + 720) % 720;
      assert.equal(toMins(right(q)), end, q.prompt);
    } else if ((m = q.prompt.match(/at (.+?) and (?:ends|finishes) at (.+?)\. How many minutes/))) {
      assert.equal(+q.numeric.value, (toMins(m[2]) - toMins(m[1]) + 720) % 720, q.prompt);
    } else assert.fail(`no check for: ${q.prompt}`);
  });
});

test('the greater-depth deck: core Year 2 topics in a sensible order, with talk-it-through prompts', () => {
  setCourse('ks1');
  const root = new URL('../content/', import.meta.url);
  const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
  const index = read('index-ks1.json');
  assert.ok(index.decks.includes('ks1/maths/depth.json'));
  assert.ok(read('index-y3.json').decks.includes('ks1/maths/depth.json'), 'Year 3 gets it too');
  const db = buildDB(index.decks.map(read));
  const ids = ['scales-2', 'tables-deduce', 'balance', 'think-problems', 'which-more', 'clock-5', 'shape-compare'].map((x) => `maths.${x}`);
  const order = topoOrder(db, 'maths');
  for (const id of ids) {
    const t = db.topics[id];
    assert.ok(t && !t.tier, `${id}: a core topic`);
    assert.ok(t.intro && t.teach && t.prereqs.length, `${id}: intro, teach and prereqs`);
    for (const p of t.prereqs) assert.ok(order.indexOf(p) < order.indexOf(id), `${id} comes after ${p}`);
  }
  const shapes = db.itemsByTopic['maths.shape-compare'];
  assert.ok(shapes.length >= 16 && shapes.length <= 22, `${shapes.length} shape items`);
  for (const id of shapes) assert.ok(db.items[id].visual, `${id}: a picture`);
});

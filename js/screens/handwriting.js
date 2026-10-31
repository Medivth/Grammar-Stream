// Handwriting joins: a diagram of the stroke, the join in joined writing beside the same letters
// unjoined, tracing on the screen over a faint model, then writing it on paper. Six lessons,
// then a daily warm-up. Data and progress logic live in js/core/handwriting.js.

import { h, s, mount } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { capybaraEl } from '../ui/capybara.js';
import { sayButton } from '../ui/qtypes.js';
import { COURSE } from '../core/subjects.js';
import { HANDWRITING_LESSONS, LESSON_BY_ID, emptyHandwriting, unlockedHandwriting, recordHandwriting, handwritingStreak, warmup } from '../core/handwriting.js';

// Writing lines in font units (font-size 100, baseline at 0), matched to Playwrite GB:
// x-height 0.5 em, ascenders 0.87 em, descenders 0.38 em.
const LINE = { asc: -87, xh: -50, base: 0, desc: 38 };
const BOX = { top: -110, bottom: 58, pad: 24 };
const FONT = { j: '"Playwrite GB J"', s: '"Playwrite GB S"' };

let fontsLoading = null;
const fontsReady = () => (fontsLoading ||= Promise.all([document.fonts?.load(`100px ${FONT.j}`), document.fonts?.load(`100px ${FONT.s}`)]).catch(() => null));

const widths = new Map();
/** Advance width of text at font-size 100 in style j (joined), u (unjoined), a (unjoined, spaced) or s (semi-joined). */
function measure(text, style) {
  const key = `${style}:${text}`;
  if (!widths.has(key)) {
    const probe = h('span', { class: `hw-measure hw-${style}` }, text);
    document.body.append(probe);
    widths.set(key, probe.getBoundingClientRect().width || text.length * 55);
    probe.remove();
  }
  return widths.get(key);
}

function guideLines(x0, x1) {
  const ln = (y, cls) => s('line', { x1: x0, x2: x1, y1: y, y2: y, class: cls });
  return s('g', { class: 'hw-lines' }, ln(LINE.asc, 'asc'), ln(LINE.xh, 'xh'), ln(LINE.base, 'base'), ln(LINE.desc, 'desc'));
}

/** Text on writing lines. height: the largest on-screen height in px. */
function lined(text, style, { height = 110, cls = '' } = {}) {
  const w = measure(text, style);
  const vb = { x: -BOX.pad, y: BOX.top, w: w + 2 * BOX.pad, h: BOX.bottom - BOX.top };
  const svg = s('svg', { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, class: `hw-svg ${cls}`, role: 'img', 'aria-label': text },
    guideLines(vb.x, vb.x + vb.w),
    s('text', { x: 0, y: 0, 'font-size': 100, class: `hw-text hw-${style}` }, text));
  svg.style.width = `min(100%, ${Math.round((vb.w / vb.h) * height)}px)`;
  return { svg, vb };
}

// --- tracing ----------------------------------------------------------------------------------

/** A canvas over a faint model. Strokes are kept in font units, so a resize just redraws them. */
function traceBox(text, style, onInk) {
  const { svg, vb } = lined(text, style, { height: 200, cls: 'faint' });
  const canvas = h('canvas', { class: 'hw-canvas', 'aria-label': `Trace ${text} with your finger` });
  const box = h('div', { class: 'hw-trace' }, svg, canvas);
  box.style.width = svg.style.width;
  svg.style.width = '100%';
  const strokes = [];
  let cur = null, pointer = null, ink = 0, praised = false;
  const ctx = canvas.getContext('2d');

  const draw = () => {
    const sx = canvas.width / vb.w, sy = canvas.height / vb.h;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(sx, 0, 0, sy, -vb.x * sx, -vb.y * sy);
    ctx.strokeStyle = ctx.fillStyle = getComputedStyle(canvas).color;
    ctx.lineWidth = 9;
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const st of strokes) {
      if (st.length === 1) { ctx.beginPath(); ctx.arc(st[0][0], st[0][1], 4.5, 0, Math.PI * 2); ctx.fill(); continue; }
      ctx.beginPath();
      ctx.moveTo(...st[0]);
      // through the midpoints, so fast strokes come out smooth rather than as straight segments
      for (let i = 1; i < st.length - 1; i++) ctx.quadraticCurveTo(st[i][0], st[i][1], (st[i][0] + st[i + 1][0]) / 2, (st[i][1] + st[i + 1][1]) / 2);
      ctx.lineTo(...st.at(-1));
      ctx.stroke();
    }
  };
  const fit = () => {
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    draw();
  };
  const at = (e) => {
    const r = canvas.getBoundingClientRect();
    return [vb.x + ((e.clientX - r.left) / r.width) * vb.w, vb.y + ((e.clientY - r.top) / r.height) * vb.h];
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (pointer != null || e.button > 0) return; // one pen at a time: a resting palm does not draw
    e.preventDefault();
    pointer = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic events have no capturable pointer */ }
    cur = [at(e)];
    strokes.push(cur);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointer || !cur) return;
    const evs = e.getCoalescedEvents?.();
    for (const ev of evs?.length ? evs : [e]) {
      const p = at(ev), q = cur.at(-1);
      ink += Math.hypot(p[0] - q[0], p[1] - q[1]);
      cur.push(p);
    }
    draw();
  });
  const end = (e) => {
    if (e.pointerId !== pointer) return;
    pointer = null; cur = null;
    if (!praised && ink > vb.w * 0.8) { praised = true; onInk?.(); }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  new ResizeObserver(fit).observe(box);
  return { el: box, clear: () => { strokes.length = 0; draw(); } };
}

// --- diagrams ---------------------------------------------------------------------------------

const KIND_LABEL = { diagonal: 'diagonal join', horizontal: 'horizontal join', 'diagonal-tall': 'diagonal join', 'horizontal-tall': 'horizontal join', break: 'lift your pencil' };

/** Two letters apart on the lines with the joining stroke between them, coloured by type. */
function diagram(lesson) {
  if (lesson.kind === 'words') {
    const word = lesson.demo, cut = word.length - 3; // careful: care + ful
    const w = measure(word, 'j');
    const vb = { x: -BOX.pad, y: BOX.top, w: w + 2 * BOX.pad, h: BOX.bottom - BOX.top };
    const svg = s('svg', { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, class: 'hw-svg hw-diagram', role: 'img', 'aria-label': `${word.slice(0, cut)} plus ${word.slice(cut)} makes ${word}` },
      guideLines(vb.x, vb.x + vb.w),
      s('text', { x: 0, y: 0, 'font-size': 100, class: 'hw-text hw-j' }, s('tspan', {}, word.slice(0, cut)), s('tspan', { class: 'hw-end' }, word.slice(cut))));
    svg.style.width = `min(100%, ${Math.round((vb.w / vb.h) * 130)}px)`;
    return h('figure', { class: 'hw-fig' }, svg, h('figcaption', {}, h('span', { class: 'hw-key end' }), `${word.slice(0, cut)} + ${word.slice(cut)} = ${word}`));
  }
  const [a, b] = lesson.demo;
  const wa = measure(a, 'u'), wb = measure(b, 'u'), gap = 70;
  const x2 = wa + gap, w = x2 + wb;
  const vb = { x: -BOX.pad, y: BOX.top - 8, w: w + 2 * BOX.pad, h: BOX.bottom - BOX.top + 8 };
  const exit = [wa - 6, -4], top = lesson.kind.endsWith('tall') ? LINE.asc : LINE.xh;
  const entry = [x2 + 12, top];
  const oTop = [wa * 0.62, LINE.xh];
  const join = {
    diagonal: `M${exit} L${entry}`,
    'diagonal-tall': `M${exit} L${entry}`,
    horizontal: `M${oTop} L${entry}`,
    'horizontal-tall': `M${oTop} C${x2 - 10},${LINE.xh} ${x2 + 4},${LINE.xh - 8} ${entry}`,
    // the tail ends below the line; the pencil hops over to the next letter
    break: `M${wa * 0.45},${LINE.desc + 4} Q${(wa + x2) / 2},${BOX.top - 10} ${x2 + wb * 0.75},${LINE.xh + 2}`,
  }[lesson.kind];
  const cls = lesson.kind === 'break' ? 'lift' : lesson.kind.startsWith('diagonal') ? 'diag' : 'horiz';
  const svg = s('svg', { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, class: 'hw-svg hw-diagram', role: 'img', 'aria-label': `${a} and ${b} with a ${KIND_LABEL[lesson.kind]}` },
    s('defs', {}, s('marker', { id: `hw-arrow-${cls}`, viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse' }, s('path', { d: 'M0,0 L10,5 L0,10 z', class: `hw-tip ${cls}` }))),
    guideLines(vb.x, vb.x + vb.w),
    s('text', { x: 0, y: 0, 'font-size': 100, class: 'hw-text hw-u' }, a),
    s('text', { x: x2, y: 0, 'font-size': 100, class: 'hw-text hw-u' }, b),
    s('path', { d: join, class: `hw-join ${cls}`, 'marker-end': `url(#hw-arrow-${cls})` }),
    lesson.kind === 'break' ? null : s('circle', { cx: (lesson.kind.startsWith('horiz') ? oTop : exit)[0], cy: (lesson.kind.startsWith('horiz') ? oTop : exit)[1], r: 6, class: `hw-dot ${cls}` }));
  svg.style.width = `min(100%, ${Math.round((vb.w / vb.h) * 150)}px)`;
  return h('figure', { class: 'hw-fig' }, svg, h('figcaption', {}, h('span', { class: `hw-key ${cls}` }), KIND_LABEL[lesson.kind]));
}

// --- screens ----------------------------------------------------------------------------------

const hwState = (state) => (state.handwriting ||= emptyHandwriting());

export function handwritingScreen(app) {
  const { state } = app;
  const hw = hwState(state);
  const today = app.today();
  const unlocked = unlockedHandwriting(hw);
  const streak = handwritingStreak(hw, today);
  const warm = warmup(hw, today);
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('h1', {}, 'Handwriting joins'), h('span', { class: 'spacer' })),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card' }, h('p', {}, 'Joined-up writing, a few minutes a day. Look at the join, trace it on the screen, then write it on paper with a pencil.'),
        hw.days.length ? h('p', { class: 'muted small' }, `${hw.days.length} day${hw.days.length === 1 ? '' : 's'} of practice${streak > 1 ? ` · ${streak} days in a row` : ''}.`) : null),
      warm ? h('div', { class: 'card stack' }, h('h2', {}, 'Today’s warm-up'), h('p', { class: 'muted' }, `Three joins and two words from your lessons: ${[...warm.pairs, ...warm.words].map((x) => x.text).join(', ')}.`),
        h('button', { class: 'btn-primary', onclick: () => runWarmup(app) }, (hw.days.includes(today) ? 'Again' : 'Start'))) : null,
      h('div', { class: 'card stack' }, h('h2', {}, 'Lessons'),
        h('ol', { class: 'journey compact' }, HANDWRITING_LESSONS.map((l, i) => {
          const r = hw.lessons[l.id];
          const locked = i >= unlocked;
          return h('li', {}, h('span', { class: `node ${locked ? 'locked' : r ? 'proficient' : 'available'}` }, icon(locked ? 'lock' : r ? 'check' : 'play')),
            h('button', { class: `jcard${locked ? ' locked' : ''}`, disabled: locked, onclick: () => runLesson(app, l.id) },
              h('h3', {}, `${i + 1}. ${l.title}`),
              h('div', { class: 'meta' }, h('span', { class: 'hw-chip hw-j' }, l.pairs.slice(0, 3).join(' ')), locked ? 'after the lesson before' : r ? 'done' : 'up next')));
        })))));
  fontsReady();
}

function runLesson(app, id) {
  const lesson = LESSON_BY_ID[id];
  const steps = [{ t: 'intro' }, ...lesson.pairs.map((text) => ({ t: 'pair', text, lesson })), ...lesson.words.map((text) => ({ t: 'word', text, lesson }))];
  return run(app, { title: lesson.title, lesson, steps });
}

function runWarmup(app) {
  const w = warmup(hwState(app.state), app.today());
  const steps = [...w.pairs.map((x) => ({ t: 'pair', text: x.text, lesson: LESSON_BY_ID[x.lesson] })), ...w.words.map((x) => ({ t: 'word', text: x.text, lesson: LESSON_BY_ID[x.lesson] }))];
  return run(app, { title: 'Warm-up', lesson: null, steps });
}

async function run(app, plan) {
  await fontsReady();
  let pos = 0;
  const pairs = plan.steps.filter((x) => x.t === 'pair'), words = plan.steps.filter((x) => x.t === 'word');
  const show = () => {
    const step = plan.steps[pos];
    if (!step) return finish(app, plan);
    const next = () => { pos++; show(); };
    const bar = h('div', { class: 'progress', 'aria-hidden': 'true' }, h('div', { style: { width: `${Math.round((100 * pos) / plan.steps.length)}%` } }));
    mount(app.root,
      h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => handwritingScreen(app) }, icon('back')), h('h1', {}, plan.title), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack hw' }, bar,
        step.t === 'intro' ? intro(plan.lesson, next)
          : practise(step, step.t === 'pair' ? `Join ${pairs.indexOf(step) + 1} of ${pairs.length}` : `Word ${words.indexOf(step) + 1} of ${words.length}`, next)));
  };
  show();
}

function intro(lesson, next) {
  const say = COURSE.readAloud ? sayButton(lesson.say, 'Read it to me') : null;
  return h('div', { class: 'stack' },
    h('div', { class: 'card stack' },
      h('div', { class: 'hw-say' }, say, h('p', {}, lesson.say)),
      diagram(lesson),
      lesson.note ? h('p', { class: 'muted small' }, lesson.note) : null),
    h('button', { class: 'btn-primary btn-big btn-block', onclick: next }, 'Let’s practise'));
}

/** Compare (joins only), trace, then write on paper and tick it off. */
function practise(step, heading, next) {
  const brk = step.lesson.kind === 'break';
  const model = brk ? 's' : 'j';
  const praise = h('p', { class: 'hw-praise', 'aria-live': 'polite' });
  const trace = traceBox(step.text, model, () => { praise.textContent = 'Lovely tracing!'; });
  const compare = step.t === 'pair' ? h('div', { class: 'hw-compare' },
    h('figure', { class: 'hw-fig' }, lined(step.text, 'j').svg, h('figcaption', {}, brk ? 'joined with a loop' : 'joined')),
    h('figure', { class: 'hw-fig' }, lined(step.text, brk ? 's' : 'a').svg, h('figcaption', {}, brk ? 'with a break' : 'not joined'))) : null;
  return h('div', { class: 'stack' },
    h('div', { class: 'eyebrow' }, heading),
    compare ? h('div', { class: 'card' }, compare) : null,
    h('div', { class: 'card stack' },
      h('h2', {}, brk && step.t === 'pair' ? 'Trace it: lift after the tail' : 'Trace it with your finger'),
      trace.el,
      h('div', { class: 'row hw-row' }, h('button', { class: 'btn-ghost', onclick: () => { trace.clear(); } }, 'Clear'), praise)),
    h('div', { class: 'card hw-paper' },
      h('span', { class: 'ico' }, icon('pen')),
      h('p', {}, step.t === 'pair' ? 'Now write it three times on paper.' : 'Now write the word on paper.')),
    h('button', { class: 'btn-primary btn-big btn-block', onclick: next }, icon('check'), ' Done'));
}

function finish(app, plan) {
  const { state } = app;
  const hw = hwState(state);
  recordHandwriting(hw, plan.lesson?.id || null, app.today());
  app.save();
  const idx = plan.lesson ? HANDWRITING_LESSONS.indexOf(plan.lesson) : -1;
  const following = HANDWRITING_LESSONS[idx + 1];
  const msg = !plan.lesson ? 'Warm-up done. Your joins are getting smoother every day.'
    : following ? `Lesson done! Next time: ${following.title.toLowerCase()}.` : 'You have finished all the lessons! Keep your joins smooth with a warm-up each day.';
  mount(app.root, h('div', { class: 'topbar' }, h('h1', {}, plan.title), h('span', { class: 'spacer' })),
    h('div', { class: 'narrow stack center' },
      capybaraEl({ ...(state.profile?.companion || {}), mood: 'happy' }, 'capy bob'),
      h('p', { class: 'hw-done' }, msg),
      h('div', { class: 'row', style: { justifyContent: 'center' } },
        h('button', { class: 'btn-primary btn-big', onclick: () => handwritingScreen(app) }, 'Lessons'),
        h('button', { class: 'btn-ghost btn-big', onclick: () => app.go('#/home') }, 'Home'))));
}

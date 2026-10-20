// Question renderers. Each returns { el, getResponse(), hasResponse(), showResult(result), focus() }.
// The problem screen stays plain: no rewards, characters or decoration beside the question.

import { h, s, rich, richHTML, plain } from './dom.js';
import { mapSVG, loadMap, featureNames } from './mapview.js';
import { speak, ttsAvailable } from '../platform/tts.js';
import { mathsDiagram } from './diagrams.js';

export async function renderQuestion(q, { onChange = () => {}, settings = {} } = {}) {
  const parts = [];
  if (q.passage) {
    parts.push(h('blockquote', { class: 'passage' }, q.passage, q.passageSource ? h('cite', {}, q.passageSource) : null));
  }
  if (q.kind !== 'cloze') {
    const prompt = rich('div', q.prompt, { class: 'q-prompt', id: 'q-prompt' });
    if (q.say && settings.tts !== false && ttsAvailable()) {
      parts.push(h('div', { class: 'row', style: { justifyContent: 'space-between', alignItems: 'flex-start' } }, prompt,
        h('button', { class: 'btn-ghost', type: 'button', onclick: () => speak(`${q.say}. ${plain(q.prompt).replace('___', q.say)}`), 'aria-label': 'Hear the word' }, '🔊 Hear it')));
    } else parts.push(prompt);
  }
  if (q.clue) parts.push(h('p', { class: 'q-clue' }, `Clue: ${q.clue}`));

  let mapView = null;
  if (q.map && q.kind !== 'map') {
    const map = await loadMap(q.map.id);
    const item = q;
    mapView = mapSVG(map, { layer: item.layerName || layerFor(q, map), highlight: q.map.highlight, markerType: markerTypeFor(q), zoom: q.map.zoom });
    parts.push(mapView.el);
  }
  if (q.diagram) parts.push(diagram(q.diagram));

  let view;
  switch (q.kind) {
    case 'choice': view = choiceView(q, onChange); break;
    case 'typed': view = typedView(q, onChange); break;
    case 'order': view = orderView(q, onChange); break;
    case 'map': view = await mapLocateView(q, onChange); break;
    case 'numberline': view = numberLineView(q, onChange); break;
    case 'cloze': view = clozeView(q, onChange); break;
    default: throw new Error('no renderer for ' + q.kind);
  }
  const el = h('div', { class: 'q-body' }, parts, view.el);
  return { ...view, el, mapView };
}

function layerFor(q, map) {
  if (q.layer) return q.layer;
  if (map.id === 'europe') return 'countries';
  if (map.id === 'uk' || map.kind === 'diagram') return 'features';
  return 'continents';
}
function markerTypeFor(q) {
  return q.group === 'peak' ? 'peak' : q.group === 'capital' ? 'capital' : undefined;
}

function choiceView(q, onChange) {
  let picked = null;
  const buttons = q.options.map((o, i) =>
    h('button', {
      class: 'option', type: 'button', 'aria-pressed': 'false', html: richHTML(o.text),
      onclick: () => {
        if (buttons[0].disabled) return;
        picked = i;
        buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
        onChange(true);
      },
    }));
  return {
    el: h('div', { class: 'options', role: 'group', 'aria-labelledby': 'q-prompt' }, buttons),
    getResponse: () => picked,
    hasResponse: () => picked != null,
    showResult(res) {
      buttons.forEach((b, j) => {
        b.disabled = true;
        const o = q.options[j];
        const best = q.weighted ? Math.max(...q.options.map((x) => x.weight ?? 0)) : null;
        if (q.weighted ? o.weight === best : o.correct) b.classList.add('right');
        else if (j === picked) b.classList.add('wrong');
      });
    },
    focus: () => {},
  };
}

function typedView(q, onChange) {
  const input = h('input', {
    type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-labelledby': 'q-prompt',
    inputmode: q.numeric ? 'text' : 'text', placeholder: q.placeholder || (q.numeric ? 'Type a number' : 'Type your answer'),
    oninput: () => onChange(input.value.trim().length > 0),
  });
  const row = h('div', { class: 'typed-row' },
    q.prefix ? h('span', { class: 'affix' }, q.prefix) : null,
    q.unitBefore ? h('span', { class: 'affix' }, q.unit) : null,
    input,
    q.unit && !q.unitBefore ? h('span', { class: 'affix' }, q.unit) : null,
    q.suffix ? h('span', { class: 'affix' }, q.suffix) : null);
  return {
    el: h('div', {}, q.cue ? h('div', { class: 'q-cue', 'aria-label': `Starts with ${q.cue[0]}, ${q.cue.replace(/\s/g, '').length} letters` }, q.cue) : null, row),
    getResponse: () => input.value,
    hasResponse: () => input.value.trim().length > 0,
    showResult() { input.disabled = true; },
    focus: () => input.focus(),
    input,
  };
}

function orderView(q, onChange) {
  // tap an item to select it, then use the arrows to move it (works with touch, mouse and keyboard)
  let orderIdx = q.display.slice();
  let sel = null;
  const list = h('ol', { class: 'order-list', 'aria-label': 'Put in order' });
  const draw = (result) => {
    list.replaceChildren(...orderIdx.map((idx, pos) => {
      const li = h('li', { class: `order-item${sel === pos ? ' selected' : ''}${result ? (q.items[idx] === q.items[pos] ? ' right' : ' wrong') : ''}` },
        h('span', { class: 'num' }, `${pos + 1}.`),
        h('span', { class: 'label', html: richHTML(q.items[idx]) + (result && q.labels ? ` <span class="muted small">(${q.labels[idx]})</span>` : '') }),
        result ? null : h('span', { class: 'moves' },
          h('button', { type: 'button', 'aria-label': `Move ${plain(q.items[idx])} up`, disabled: pos === 0, onclick: (e) => { e.stopPropagation(); move(pos, -1); } }, '▲'),
          h('button', { type: 'button', 'aria-label': `Move ${plain(q.items[idx])} down`, disabled: pos === orderIdx.length - 1, onclick: (e) => { e.stopPropagation(); move(pos, 1); } }, '▼')));
      return li;
    }));
  };
  const move = (pos, d) => {
    const np = pos + d;
    [orderIdx[pos], orderIdx[np]] = [orderIdx[np], orderIdx[pos]];
    sel = np;
    draw();
    list.querySelectorAll('.order-item')[np]?.querySelector(`button:nth-child(${d < 0 ? 1 : 2})`)?.focus();
    onChange(true);
  };
  draw();
  onChange(true);
  return {
    el: h('div', {}, h('p', { class: 'muted small' }, q.axis === 'time' ? 'Earliest at the top. Use the arrows to move items.' : 'First at the top. Use the arrows to move items.'), list),
    getResponse: () => orderIdx.slice(),
    hasResponse: () => true,
    showResult() { draw(true); },
    focus: () => {},
  };
}

async function mapLocateView(q, onChange) {
  const map = await loadMap(q.map.id);
  let picked = null;
  const names = featureNames(map, q.layer || layerFor(q, map));
  q.featureNames = names;
  const view = mapSVG(map, { layer: q.layer || layerFor(q, map), locate: true, markerType: markerTypeFor(q), zoom: q.map.zoom, onPick: (id) => { picked = id; label.textContent = `You picked: ${names[id] ?? 'a place'}`; onChange(true); } });
  const label = h('p', { class: 'muted', 'aria-live': 'polite' }, map.kind === 'diagram' ? 'Tap the diagram.' : 'Tap the map.');
  return {
    el: h('div', {}, view.el, label),
    getResponse: () => picked,
    hasResponse: () => picked != null,
    showResult(res) {
      if (!res.correct && picked) view.mark(picked, 'map-wrong');
      view.mark(q.feature, 'map-right');
      label.textContent = res.correct ? `${q.answer}: well found.` : `You picked ${names[picked] ?? 'another place'}. ${q.answer} is shown in green.`;
    },
    focus: () => {},
  };
}

function numberLineView(q, onChange) {
  const W = 640, H = 120, pad = 40, y = 60;
  const xOf = (v) => pad + ((v - q.min) / (q.max - q.min)) * (W - 2 * pad);
  const vOf = (x) => q.min + ((x - pad) / (W - 2 * pad)) * (q.max - q.min);
  let value = null;
  const marker = s('g', { visibility: 'hidden' }, s('path', { d: 'M0 -26 L10 -40 L-10 -40 Z', class: 'nl-marker' }), s('line', { x1: 0, y1: -26, x2: 0, y2: 0, stroke: 'var(--accent)', 'stroke-width': 3 }));
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'slider', 'aria-label': 'Number line', 'aria-valuemin': q.min, 'aria-valuemax': q.max, tabindex: '0' },
    s('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }),
    s('line', { x1: pad, y1: y, x2: W - pad, y2: y, class: 'nl-axis' }),
    ...Array.from({ length: q.ticks + 1 }, (_, i) => [
      s('line', { x1: xOf(q.min + i), y1: y - 14, x2: xOf(q.min + i), y2: y + 14, class: 'nl-tick' }),
      s('text', { x: xOf(q.min + i), y: y + 40, class: 'nl-label' }, String(q.min + i)),
    ]),
    marker);
  const set = (v) => {
    value = Math.min(q.max, Math.max(q.min, v));
    marker.setAttribute('transform', `translate(${xOf(value)} ${y})`);
    marker.setAttribute('visibility', 'visible');
    svg.setAttribute('aria-valuenow', value.toFixed(2));
    onChange(true);
  };
  const fromEvent = (e) => {
    const r = svg.getBoundingClientRect();
    return vOf(((e.clientX - r.left) / r.width) * W);
  };
  let dragging = false;
  svg.addEventListener('pointerdown', (e) => { if (done) return; dragging = true; svg.setPointerCapture(e.pointerId); set(fromEvent(e)); });
  svg.addEventListener('pointermove', (e) => { if (dragging && !done) set(fromEvent(e)); });
  svg.addEventListener('pointerup', () => { dragging = false; });
  svg.addEventListener('keydown', (e) => {
    if (done) return;
    const step = (q.max - q.min) / 100;
    if (e.key === 'ArrowRight') { set((value ?? q.min) + step); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { set((value ?? q.min) - step); e.preventDefault(); }
  });
  let done = false;
  return {
    el: h('div', { class: 'nl-box' }, svg, h('p', { class: 'muted small' }, 'Tap or drag to place the arrow.')),
    getResponse: () => value,
    hasResponse: () => value != null,
    showResult() {
      done = true;
      svg.append(s('circle', { cx: xOf(q.target), cy: y, r: 9, class: 'nl-target' }));
    },
    focus: () => {},
  };
}

function clozeView(q, onChange) {
  const inputs = [];
  const parts = q.text.split('___');
  const para = h('p', { class: 'q-prompt' });
  parts.forEach((p, i) => {
    para.append(document.createTextNode(p));
    if (i < parts.length - 1) {
      const inp = h('input', { type: 'text', style: { width: '9em', display: 'inline-block', minHeight: '44px', margin: '4px' }, 'aria-label': `Gap ${i + 1}`, oninput: () => onChange(inputs.every((x) => x.value.trim())) });
      inputs.push(inp);
      para.append(inp);
    }
  });
  return {
    el: h('div', {}, q.prompt ? rich('p', q.prompt, { class: 'muted' }) : null, para),
    getResponse: () => inputs.map((i) => i.value),
    hasResponse: () => inputs.every((i) => i.value.trim()),
    showResult(res) { inputs.forEach((i, k) => { i.disabled = true; i.style.borderColor = res.perBlank?.[k] ? 'var(--good)' : 'var(--warn)'; }); },
    focus: () => inputs[0]?.focus(),
  };
}

function diagram(d) {
  const m = mathsDiagram(d);
  if (m) return m;
  // simple angle diagrams; labels show known angles and "?" for the unknown
  const W = 300, H = 160;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, style: 'max-width:320px;display:block;margin:0 auto 12px', role: 'img', 'aria-label': 'Angle diagram' });
  const st = { stroke: 'currentColor', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' };
  const txt = (x, y, t) => s('text', { x, y, 'font-size': 18, fill: 'currentColor', 'text-anchor': 'middle', 'font-family': 'inherit', 'font-weight': 700 }, t);
  if (d.type === 'line') {
    const a = d.known[0] * Math.PI / 180;
    const cx = 150, cy = 120;
    svg.append(s('line', { x1: 20, y1: cy, x2: 280, y2: cy, ...st }), s('line', { x1: cx, y1: cy, x2: cx + 110 * Math.cos(Math.PI - a), y2: cy - 110 * Math.sin(Math.PI - a), ...st }),
      txt(cx - 40 * Math.cos(a / 2), cy - 30 * Math.sin(a / 2) - 4, `${d.known[0]}°`), txt(cx + 46 * Math.cos((Math.PI - a) / 2), cy - 30 * Math.sin((Math.PI - a) / 2) - 4, '?'));
  } else if (d.type === 'triangle' || d.type === 'isosceles') {
    svg.append(s('path', { d: 'M40 140 L260 140 L150 24 Z', ...st }));
    if (d.type === 'triangle') svg.append(txt(70, 132, `${d.known[0]}°`), txt(230, 132, `${d.known[1]}°`), txt(150, 60, '?'));
    else svg.append(txt(150, 64, `${d.known[0]}°`), txt(70, 132, '?'), txt(230, 132, '?'));
  } else if (d.type === 'grid') {
    return gridDiagram(d);
  } else if (d.type === 'point') {
    const cx = 150, cy = 80;
    const [a, b] = d.known;
    const ray = (deg) => s('line', { x1: cx, y1: cy, x2: cx + 70 * Math.cos(deg * Math.PI / 180), y2: cy - 70 * Math.sin(deg * Math.PI / 180), ...st });
    const lab = (deg, t) => txt(cx + 34 * Math.cos(deg * Math.PI / 180), cy - 34 * Math.sin(deg * Math.PI / 180) + 6, t);
    svg.append(ray(0), ray(a), ray(a + b), lab(a / 2, `${a}°`), lab(a + b / 2, `${b}°`), lab(a + b + (360 - a - b) / 2, '?'));
  }
  return svg;
}

// Ordnance-Survey-style grid for grid-reference and compass questions
function gridDiagram(d) {
  const cell = 70, m = 40, n = d.size;
  const W = m + n * cell + 20, H = n * cell + m + 20;
  const X = (x) => m + x * cell, Y = (y) => 10 + (n - y) * cell;
  const svg = s('svg', { viewBox: `0 0 ${W + (d.compass ? 60 : 0)} ${H}`, style: 'max-width:420px;display:block;margin:0 auto 12px', role: 'img', 'aria-label': 'Grid map' });
  svg.append(s('rect', { x: X(0), y: Y(n), width: n * cell, height: n * cell, fill: 'var(--map-land)' }));
  for (let k = 0; k <= n; k++) {
    svg.append(s('line', { x1: X(k), y1: Y(0), x2: X(k), y2: Y(n), stroke: '#4f8fc0', 'stroke-width': 1.5 }),
      s('line', { x1: X(0), y1: Y(k), x2: X(n), y2: Y(k), stroke: '#4f8fc0', 'stroke-width': 1.5 }));
    {
      svg.append(s('text', { x: X(k), y: Y(0) + 22, 'text-anchor': 'middle', 'font-size': 15, fill: 'currentColor', 'font-family': 'inherit' }, String(d.e0 + k).padStart(2, '0')),
        s('text', { x: X(0) - 8, y: Y(k) + 5, 'text-anchor': 'end', 'font-size': 15, fill: 'currentColor', 'font-family': 'inherit' }, String(d.n0 + k).padStart(2, '0')));
    }
  }
  for (const mk of d.markers) {
    if (mk.exact) {
      // tenths marks round the square the place is in, as you would imagine them on a real map
      const sx = Math.floor(mk.x), sy = Math.floor(mk.y);
      for (let k = 1; k < 10; k++) {
        const len = k === 5 ? 7 : 4;
        svg.append(s('line', { x1: X(sx + k / 10), y1: Y(sy), x2: X(sx + k / 10), y2: Y(sy) - len, stroke: 'currentColor', 'stroke-width': 1 }),
          s('line', { x1: X(sx), y1: Y(sy + k / 10), x2: X(sx) + len, y2: Y(sy + k / 10), stroke: 'currentColor', 'stroke-width': 1 }));
      }
    }
    const cx = X(mk.x), cy = Y(mk.y), r = mk.exact ? 5 : 10;
    const fill = '#c0392b';
    let shape;
    if (mk.shape === 'square') shape = s('rect', { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, fill });
    else if (mk.shape === 'triangle') shape = s('path', { d: `M${cx} ${cy - r} L${cx + r} ${cy + r} L${cx - r} ${cy + r} Z`, fill });
    else if (mk.shape === 'diamond') shape = s('path', { d: `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z`, fill });
    else if (mk.shape === 'star') shape = s('path', { d: `M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3} Z`, fill });
    else shape = s('circle', { cx, cy, r, fill });
    svg.append(shape);
    if (mk.exact) svg.append(s('circle', { cx, cy, r: 1.8, fill: '#fff' }));
    const nearTop = mk.y > d.size - 0.35, nearRight = mk.x > d.size - 0.9;
    svg.append(s('text', { x: nearRight ? cx - r - 4 : cx + r + 4, y: nearTop ? cy + r + 14 : cy - r + 2, 'text-anchor': nearRight ? 'end' : 'start', 'font-size': 13, fill: 'currentColor', 'font-family': 'inherit', 'font-weight': 700 }, mk.label));
  }
  if (d.compass) {
    const cx = W + 25, cy = 50;
    svg.append(s('path', { d: `M${cx} ${cy - 28} L${cx + 7} ${cy} L${cx - 7} ${cy} Z`, fill: 'currentColor' }),
      s('line', { x1: cx, y1: cy, x2: cx, y2: cy + 24, stroke: 'currentColor', 'stroke-width': 2 }),
      s('text', { x: cx, y: cy - 34, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: 'currentColor', 'font-family': 'inherit' }, 'N'));
  }
  return svg;
}

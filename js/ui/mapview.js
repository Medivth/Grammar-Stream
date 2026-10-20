// Map rendering: draws a map layer as SVG, highlights a feature, or lets the child tap one.

import { s, h } from './dom.js';

const cache = {};
export async function loadMap(id) {
  if (!cache[id]) cache[id] = fetch(`content/maps/${id}.json`).then((r) => r.json());
  return cache[id];
}

/** Names of tappable features, used to describe a wrong tap ("you tapped Spain"). */
export function featureNames(map, layer) {
  const out = {};
  const pool = layer === 'markers' ? map.markers : layer === 'countries' || layer === 'features' ? map.features : map[layer];
  for (const f of pool || []) out[f.id] = f.name;
  if (layer === 'countries') for (const m of map.markers || []) out[m.id] = map.features.find((f) => f.id === m.id)?.name ?? m.id;
  return out;
}

/**
 * opts: { layer, highlight, locate (bool), markerType, onPick(id), quizIds (Set of ids that may be tapped) }
 * Returns { el, mark(id, cls) } so the caller can colour right and wrong answers.
 */
export function mapSVG(map, opts) {
  const { layer, highlight, locate, onPick, markerType, zoom } = opts;
  const svg = s('svg', { viewBox: viewBoxFor(map, zoom).join(' '), role: 'img', 'aria-label': 'Map' });
  const byId = {};
  const add = (el, id) => { if (id) (byId[id] ||= []).push(el); return el; };
  const tapAttrs = (id) => (locate ? { class: 'map-tap', tabindex: '0', role: 'button', 'data-id': id } : {});

  if (map.kind === 'diagram') {
    for (const dc of (map.decor || []).filter((x) => x.under)) svg.append(s('path', { d: dc.d, fill: dc.fill, 'pointer-events': 'none' }));
    for (const f of map.features) {
      const cls = `dg-part${f.id === highlight ? ' map-hi' : ''}${locate ? ' map-tap' : ''}`;
      svg.append(add(s('path', { d: f.d, fill: f.fill, 'fill-rule': f.rule || 'nonzero', class: cls, 'data-id': f.id, ...(locate ? { tabindex: '0', role: 'button' } : {}) }), f.id));
    }
    for (const dc of (map.decor || []).filter((x) => !x.under)) svg.append(s('path', { d: dc.d, fill: dc.fill, 'pointer-events': 'none' }));
  } else if (map.sphere) svg.append(s('path', { d: map.sphere, fill: 'var(--map-sea)' }));
  if (map.sea) svg.append(s('path', { d: map.sea, fill: 'var(--map-sea)' }));
  if (map.graticule) svg.append(s('path', { d: map.graticule, class: 'map-grat' }));

  if (map.kind === 'diagram') {
    // drawn above
  } else if (map.id === 'world') {
    if (layer === 'oceans') {
      for (const o of map.oceans) svg.append(add(s('path', { d: o.d, class: `map-ocean${locate ? ' tap' : ''}${o.id === highlight ? ' hi' : ''}`, 'data-id': o.id, ...(locate ? { tabindex: '0', role: 'button' } : {}) }), o.id));
    }
    if (layer === 'continents') {
      for (const c of map.continents) {
        const cls = `map-land${c.id === highlight ? ' map-hi' : ''}`;
        svg.append(add(s('path', { d: c.d, class: cls, ...tapAttrs(c.id), ...(locate ? { class: cls + ' map-tap' } : {}) }), c.id));
      }
    } else if (layer === 'countries') {
      for (const f of map.features) {
        const cls = `map-land${f.id === highlight ? ' map-hi' : ''}${locate ? ' map-tap' : ''}`;
        svg.append(add(s('path', { d: f.d, class: cls, 'data-id': f.id, ...(locate ? { tabindex: '0', role: 'button' } : {}) }), f.id));
      }
    } else {
      for (const f of map.features) svg.append(s('path', { d: f.d, class: 'map-land', style: 'pointer-events:none' }));
    }
    if (layer === 'lines') {
      for (const l of map.lines) {
        svg.append(add(s('path', { d: l.d, class: `map-line${l.id === highlight ? ' hi' : ''}` }), l.id));
        if (locate) svg.append(add(s('path', { d: l.d, fill: 'none', stroke: 'transparent', 'stroke-width': 18, class: 'map-tap', 'data-id': l.id, tabindex: '0', role: 'button' }), l.id));
      }
    }
  } else {
    for (const f of map.features) {
      const quizzable = layer === 'countries' ? f.europe : layer === 'features' ? !f.context : false;
      const looksLand = map.id === 'uk' ? !f.context : quizzable;
      const hi = f.id === highlight && (layer === 'countries' || layer === 'features');
      const cls = `${looksLand ? 'map-land' : 'map-context'}${hi ? ' map-hi' : ''}`;
      const attrs = { d: f.d, class: cls };
      if (locate && quizzable) Object.assign(attrs, { class: cls + ' map-tap', 'data-id': f.id, tabindex: '0', role: 'button' });
      svg.append(add(s('path', attrs), f.id));
    }
    for (const r of map.rivers || []) {
      svg.append(add(s('path', { d: r.d, class: `map-river${layer === 'rivers' && r.id === highlight ? ' hi' : ''}` }), r.id));
      if (locate && layer === 'rivers') svg.append(add(s('path', { d: r.d, class: 'map-river tap', 'data-id': r.id, tabindex: '0', role: 'button' }), r.id));
    }
    // small countries get a tappable dot
    if (layer === 'countries') {
      for (const m of map.markers || []) {
        const f = map.features.find((x) => x.id === m.id);
        if (!f?.europe) continue;
        svg.append(add(s('circle', { cx: m.x, cy: m.y, r: locate ? 9 : 5, class: `map-marker${m.id === highlight ? ' hi' : ''}${locate ? ' map-tap' : ''}`, 'data-id': m.id, ...(locate ? { tabindex: '0', role: 'button' } : {}) }), m.id));
      }
    }
    if (layer === 'markers') {
      for (const m of map.markers.filter((m) => !markerType || m.type === markerType || (markerType === 'city' && m.type === 'capital'))) {
        const shape = m.type === 'peak'
          ? s('path', { d: `M${m.x} ${m.y - 9} L${m.x + 8} ${m.y + 6} L${m.x - 8} ${m.y + 6} Z`, class: `map-marker${m.id === highlight ? ' hi' : ''}${locate ? ' map-tap' : ''}`, 'data-id': m.id })
          : s('circle', { cx: m.x, cy: m.y, r: locate ? 9 : m.id === highlight ? 8 : 5, class: `map-marker${m.id === highlight ? ' hi' : ''}${locate ? ' map-tap' : ''}`, 'data-id': m.id });
        if (locate) { shape.setAttribute('tabindex', '0'); shape.setAttribute('role', 'button'); }
        svg.append(add(shape, m.id));
      }
    }
  }

  let selected = null;
  // keep the highlighted country visible even if it is small: ring it
  if (highlight && layer === 'countries' && map.id === 'world') {
    const f = map.features.find((x) => x.id === highlight);
    if (f?.c) svg.append(s('circle', { cx: f.c[0], cy: f.c[1], r: 14, fill: 'none', stroke: 'var(--map-hi)', 'stroke-width': 2.5, 'pointer-events': 'none' }));
  }
  if (locate) {
    const pick = (id) => {
      for (const el of byId[selected] || []) el.classList.remove('map-hi');
      selected = id;
      for (const el of byId[id] || []) el.classList.add('map-hi');
      onPick?.(id);
    };
    svg.addEventListener('click', (e) => {
      const id = e.target.closest('[data-id]')?.getAttribute('data-id');
      if (id) pick(id);
    });
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const id = e.target.closest?.('[data-id]')?.getAttribute('data-id');
      if (id) { e.preventDefault(); pick(id); }
    });
  }
  const el = h('div', { class: 'map-box' }, svg);
  return {
    el,
    mark(id, cls) {
      for (const e of byId[id] || []) {
        e.classList.remove('map-hi');
        if (e.tagName === 'path' && (e.classList.contains('map-line') || e.classList.contains('map-river'))) e.classList.add('hi');
        else e.classList.add(cls);
      }
    },
  };
}

/** Zoom to the countries of the given continents (by their centroids), with some padding. */
export function viewBoxFor(map, zoom) {
  const full = map.viewBox;
  if (!zoom?.length || !map.features) return full;
  const pts = map.features.filter((f) => zoom.includes(f.continent) && f.c).map((f) => f.c);
  if (!pts.length) return full;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const pad = 45;
  let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  // keep a landscape-ish shape so the map isn't a thin strip
  const w = x1 - x0, hh = y1 - y0;
  if (w < hh * 1.2) { const extra = (hh * 1.2 - w) / 2; x0 -= extra; x1 += extra; }
  return [Math.max(full[0], x0), Math.max(full[1], y0), Math.min(full[2], x1 - x0), Math.min(full[3], y1 - y0)].map((v) => Math.round(v));
}

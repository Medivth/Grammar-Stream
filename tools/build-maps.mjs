// Build projected SVG map data from Natural Earth (public domain) into content/maps/.
// Source GeoJSON is downloaded into .cache/ne/ (see README). Run: node tools/build-maps.mjs
//
// Boundaries follow UK government recognition: Crimea is shown as part of Ukraine,
// Northern Cyprus as part of Cyprus and Somaliland as part of Somalia.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { geoPath, geoNaturalEarth1, geoAzimuthalEqualArea, geoTransverseMercator, geoGraticule10, geoArea } from 'd3-geo';

const SRC = new URL('../.cache/ne/', import.meta.url);
const OUT = new URL('../content/maps/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const load = (f) => JSON.parse(readFileSync(new URL(f + '.geojson', SRC)));

const subunits = load('ne_50m_admin_0_map_subunits').features;
const marine = load('ne_110m_geography_marine_polys').features;
const lakes = load('ne_110m_lakes').features;
const rivers = [...load('ne_10m_rivers_lake_centerlines').features, ...load('ne_10m_rivers_europe').features];

const MERGE = { RUC: 'UKR', SOL: 'SOM', CYN: 'CYP', KAS: 'IND', ALD: 'FIN' };
const NAME_FIX = { CZE: 'Czechia', MKD: 'North Macedonia', BIH: 'Bosnia and Herzegovina', GBR: 'United Kingdom', USA: 'United States', COD: 'Democratic Republic of the Congo', COG: 'Republic of the Congo', CIV: 'Ivory Coast', KOR: 'South Korea', PRK: 'North Korea', RUS: 'Russia', IRN: 'Iran', SYR: 'Syria', LAO: 'Laos', VNM: 'Vietnam', TZA: 'Tanzania', BOL: 'Bolivia', VEN: 'Venezuela', MDA: 'Moldova', SRB: 'Serbia' };

/** Group subunits into countries keyed by ISO-ish alpha-3. */
function countries() {
  const by = new Map();
  for (const f of subunits) {
    const p = f.properties;
    const id = MERGE[p.SU_A3] || MERGE[p.ADM0_A3] || p.ADM0_A3;
    if (!by.has(id)) by.set(id, { id, name: null, continent: null, polys: [], parts: [] });
    const c = by.get(id);
    const g = f.geometry;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    c.polys.push(...polys);
    c.parts.push({ continent: p.CONTINENT, polys });
    if (p.ADM0_A3 === id && (p.HOMEPART === 1 || !c.name)) {
      c.name = NAME_FIX[id] || p.ADMIN;
      c.continent = p.SU_A3 === 'RUA' ? 'Europe' : p.CONTINENT;
    }
  }
  return by;
}

/** Douglas–Peucker on projected rings. */
function simplifyRing(pts, tol) {
  if (pts.length <= 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const ringArea = (r) => {
  let s = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
  return Math.abs(s / 2);
};

/** Project a GeoJSON geometry with d3 (handles clipping and antimeridian) and simplify. */
function toPath(projection, geometry, { tol = 0.6, minArea = 2, keepLargest = true } = {}) {
  const rings = [];
  let current = null;
  const stream = projection.stream({
    point(x, y) { current.push([x, y]); },
    lineStart() { current = []; },
    lineEnd() { if (current.length > 1) rings.push({ pts: current, closed: polygonMode }); current = null; },
    polygonStart() { polygonMode = true; },
    polygonEnd() { polygonMode = false; },
    sphere() {},
  });
  let polygonMode = false;
  geoStreamGeometry(geometry, stream);
  let out = rings
    .map((r) => ({ ...r, pts: simplifyRing(r.pts, tol) }))
    .filter((r) => !r.closed || r.pts.length >= 3);
  const areas = out.map((r) => (r.closed ? ringArea(r.pts) : Infinity));
  let kept = out.filter((r, i) => !r.closed || areas[i] >= minArea);
  if (!kept.length && keepLargest && out.length) {
    const i = areas.indexOf(Math.max(...areas));
    kept = [out[i]];
  }
  const f = (n) => Math.round(n * 10) / 10;
  const d = kept.map((r) => 'M' + r.pts.map(([x, y]) => `${f(x)},${f(y)}`).join('L') + (r.closed ? 'Z' : '')).join('');
  const area = kept.reduce((s, r) => s + (r.closed ? ringArea(r.pts) : 0), 0);
  return { d, area, rings: kept };
}

// minimal geometry streamer (avoids depending on d3's internal geoStream export shape)
import { geoStream } from 'd3-geo';
function geoStreamGeometry(geometry, stream) { geoStream(geometry, stream); }

function centroidOf(rings) {
  // centroid of the largest closed ring (good label/marker position)
  let best = null, bestA = -1;
  for (const r of rings) {
    if (!r.closed) continue;
    const a = ringArea(r.pts);
    if (a > bestA) { bestA = a; best = r.pts; }
  }
  if (!best) return null;
  let x = 0, y = 0, A = 0;
  for (let i = 0, j = best.length - 1; i < best.length; j = i++) {
    const c = best[j][0] * best[i][1] - best[i][0] * best[j][1];
    A += c; x += (best[j][0] + best[i][0]) * c; y += (best[j][1] + best[i][1]) * c;
  }
  A /= 2;
  return [Math.round((x / (6 * A)) * 10) / 10, Math.round((y / (6 * A)) * 10) / 10];
}

const multi = (polys) => ({ type: 'MultiPolygon', coordinates: polys });
const LINES = [
  ['equator', 'Equator', 0], ['cancer', 'Tropic of Cancer', 23.44], ['capricorn', 'Tropic of Capricorn', -23.44],
  ['arctic', 'Arctic Circle', 66.56], ['antarctic', 'Antarctic Circle', -66.56],
];
const parallel = (lat) => ({ type: 'LineString', coordinates: Array.from({ length: 361 }, (_, i) => [-180 + i, lat]) });
const meridian = (lon) => ({ type: 'LineString', coordinates: Array.from({ length: 171 }, (_, i) => [lon, -85 + i]) });

function write(name, data) {
  const json = JSON.stringify(data);
  writeFileSync(new URL(name + '.json', OUT), json);
  console.log(`${name}.json  ${(json.length / 1024).toFixed(0)} KB, ${data.features.length} features`);
}

const C = countries();

// ---------- world ----------
{
  const W = 1000, H = 520;
  const proj = geoNaturalEarth1().fitExtent([[4, 4], [W - 4, H - 4]], { type: 'Sphere' });
  const features = [];
  const continentRings = {};
  for (const c of C.values()) {
    if (c.continent === 'Seven seas (open ocean)') continue;
    const p = toPath(proj, multi(c.polys), { tol: 0.5, minArea: 1.5 });
    if (!p.d) continue;
    features.push({ id: c.id, name: c.name, continent: c.continent, d: p.d, c: centroidOf(p.rings) });
    // continents come from subunits: Natural Earth already splits Russia at the Urals,
    // and overseas territories (e.g. French Guiana) keep their own continent
    for (const { continent: cont, polys } of c.parts) {
      if (cont === 'Seven seas (open ocean)') continue;
      const q = toPath(proj, multi(polys), { tol: 0.8, minArea: 3, keepLargest: false });
      (continentRings[cont] ||= []).push(q.d);
    }
  }
  const continents = Object.entries(continentRings).map(([name, ds]) => ({ id: name.toLowerCase().replace(/ /g, '-'), name, d: ds.join('') }));
  const OCEANS = { 'North Atlantic Ocean': 'atlantic', 'South Atlantic Ocean': 'atlantic', 'North Pacific Ocean': 'pacific', 'South Pacific Ocean': 'pacific', 'INDIAN OCEAN': 'indian', 'Arctic Ocean': 'arctic', 'SOUTHERN OCEAN': 'southern' };
  const ONAME = { atlantic: 'Atlantic Ocean', pacific: 'Pacific Ocean', indian: 'Indian Ocean', arctic: 'Arctic Ocean', southern: 'Southern Ocean' };
  const oceanD = {};
  for (const m of marine) {
    const id = OCEANS[m.properties.name];
    if (!id) continue;
    (oceanD[id] ||= []).push(toPath(proj, m.geometry, { tol: 1, minArea: 4 }).d);
  }
  const oceans = Object.entries(oceanD).map(([id, ds]) => ({ id, name: ONAME[id], d: ds.join('') }));
  const lines = LINES.map(([id, name, lat]) => ({ id, name, d: toPath(proj, parallel(lat), { tol: 0.3 }).d }));
  lines.push({ id: 'greenwich', name: 'Prime (Greenwich) Meridian', d: toPath(proj, meridian(0), { tol: 0.3 }).d });
  const sphere = geoPath(proj)({ type: 'Sphere' });
  const graticule = toPath(proj, geoGraticule10(), { tol: 0.5 }).d;
  write('world', { id: 'world', viewBox: [0, 0, W, H], sphere, graticule, features, continents, oceans, lines, source: 'Natural Earth (public domain)' });
}

// ---------- Europe ----------
{
  const W = 800, H = 760;
  const bbox = { type: 'Polygon', coordinates: [[[-24, 34], [-24, 71.5], [45, 71.5], [45, 34], [-24, 34]]] };
  const proj = geoAzimuthalEqualArea().rotate([-12, -53]).fitExtent([[0, 0], [W, H]], { type: 'MultiPoint', coordinates: [[-24, 36], [-10, 71], [40, 71], [42, 38], [-9, 35], [30, 34]] });
  proj.clipExtent([[0, 0], [W, H]]);
  const features = [];
  const markers = [];
  for (const c of C.values()) {
    const p = toPath(proj, multi(c.polys), { tol: 0.35, minArea: 0.8 });
    if (!p.d || !p.rings.length) continue;
    const cen = centroidOf(p.rings);
    if (!cen || cen[0] < -50 || cen[0] > W + 50 || cen[1] < -50 || cen[1] > H + 50) continue;
    const europe = c.continent === 'Europe' || c.id === 'CYP';
    features.push({ id: c.id, name: c.name, continent: c.continent, europe, d: p.d, c: cen });
    if (europe && p.area < 60) markers.push({ id: c.id, x: cen[0], y: cen[1] });
  }
  const sea = geoPath(proj)({ type: 'Sphere' });
  write('europe', { id: 'europe', viewBox: [0, 0, W, H], sea, features, markers, source: 'Natural Earth (public domain)' });
}

// ---------- UK and Ireland ----------
{
  const W = 600, H = 820;
  const proj = geoTransverseMercator().rotate([2, -54.5]).fitExtent([[10, 10], [W - 10, H - 10]], { type: 'MultiPoint', coordinates: [[-10.6, 51.4], [-8.2, 58.6], [1.8, 52.5], [-5.7, 49.95], [-1.0, 60.85]] });
  proj.clipExtent([[0, 0], [W, H]]);
  const KEEP = { ENG: 'England', SCT: 'Scotland', WLS: 'Wales', NIR: 'Northern Ireland', IRL: 'Ireland', IMN: 'Isle of Man', JEY: 'Jersey', GGY: 'Guernsey' };
  const features = [];
  for (const f of subunits) {
    const id = f.properties.SU_A3;
    const near = ['FXX', 'BEL', 'NLD', 'BFR', 'BWR', 'NOR', 'DNK', 'DEU'].includes(id) || ['FRA', 'BEL', 'NLD'].includes(f.properties.ADM0_A3);
    if (!KEEP[id] && !near) continue;
    const p = toPath(proj, f.geometry, { tol: 0.4, minArea: 1 });
    if (!p.d) continue;
    features.push({ id, name: KEEP[id] || f.properties.NAME_EN, uk: ['ENG', 'SCT', 'WLS', 'NIR'].includes(id), context: !KEEP[id], d: p.d, c: centroidOf(p.rings) });
  }
  const RIVERS = ['Thames', 'Severn', 'Trent', 'Great Ouse', 'Tweed', 'Wye', 'Tay', 'Swale', 'Ness', 'Shannon'];
  const byRiver = {};
  const inUK = (c) => c[0] > -10.5 && c[0] < 2 && c[1] > 49.9 && c[1] < 59;
  for (const r of rivers) {
    const n = r.properties.name || '';
    if (!RIVERS.includes(n) || !r.geometry?.coordinates?.length) continue;
    const pts = r.geometry.type === 'LineString' ? r.geometry.coordinates : r.geometry.coordinates.flat();
    if (!pts.some(inUK)) continue;
    const p = toPath(proj, r.geometry, { tol: 0.3 });
    if (p.d) (byRiver[n] ||= []).push(p.d);
  }
  const riverLines = Object.entries(byRiver).map(([n, ds]) => ({ id: 'river-' + n.toLowerCase().replace(/[^a-z]+/g, '-'), name: `River ${n}`, d: ds.join('') }));
  const CITIES = [
    ['london', 'London', -0.13, 51.51, 1], ['birmingham', 'Birmingham', -1.9, 52.48, 0], ['manchester', 'Manchester', -2.24, 53.48, 0], ['leeds', 'Leeds', -1.55, 53.8, 0],
    ['liverpool', 'Liverpool', -2.98, 53.41, 0], ['newcastle', 'Newcastle upon Tyne', -1.61, 54.98, 0], ['bristol', 'Bristol', -2.59, 51.45, 0], ['sheffield', 'Sheffield', -1.47, 53.38, 0],
    ['cardiff', 'Cardiff', -3.18, 51.48, 1], ['swansea', 'Swansea', -3.94, 51.62, 0], ['edinburgh', 'Edinburgh', -3.19, 55.95, 1], ['glasgow', 'Glasgow', -4.25, 55.86, 0],
    ['aberdeen', 'Aberdeen', -2.1, 57.15, 0], ['inverness', 'Inverness', -4.22, 57.48, 0], ['belfast', 'Belfast', -5.93, 54.6, 1], ['dublin', 'Dublin', -6.26, 53.35, 1],
    ['plymouth', 'Plymouth', -4.14, 50.38, 0], ['southampton', 'Southampton', -1.4, 50.9, 0], ['norwich', 'Norwich', 1.3, 52.63, 0], ['york', 'York', -1.08, 53.96, 0],
    ['oxford', 'Oxford', -1.26, 51.75, 0], ['cambridge', 'Cambridge', 0.12, 52.2, 0], ['nottingham', 'Nottingham', -1.15, 52.95, 0], ['leicester', 'Leicester', -1.13, 52.64, 0],
    ['dundee', 'Dundee', -2.97, 56.46, 0], ['derry', 'Derry~Londonderry', -7.31, 55.0, 0], ['exeter', 'Exeter', -3.53, 50.72, 0], ['hull', 'Hull', -0.33, 53.74, 0],
  ];
  const PEAKS = [
    ['ben-nevis', 'Ben Nevis', -5.0, 56.8, 1345], ['snowdon', 'Yr Wyddfa (Snowdon)', -4.08, 53.07, 1085], ['scafell', 'Scafell Pike', -3.21, 54.45, 978], ['slieve-donard', 'Slieve Donard', -5.92, 54.18, 850],
  ];
  const markers = [
    ...CITIES.map(([id, name, lon, lat, capital]) => { const [x, y] = proj([lon, lat]); return { id, name, x: +x.toFixed(1), y: +y.toFixed(1), type: capital ? 'capital' : 'city' }; }),
    ...PEAKS.map(([id, name, lon, lat, h]) => { const [x, y] = proj([lon, lat]); return { id, name, x: +x.toFixed(1), y: +y.toFixed(1), type: 'peak', height: h }; }),
  ];
  const sea = geoPath(proj)({ type: 'Sphere' });
  write('uk', { id: 'uk', viewBox: [0, 0, W, H], sea, features, rivers: riverLines, markers, source: 'Natural Earth (public domain); city positions approximate' });
}

void geoArea;

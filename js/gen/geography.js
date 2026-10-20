// Geography procedure generators: grid references, compass directions and map scale.
// Grid questions carry a { type: 'grid' } diagram drawn by js/ui/qtypes.js.

const PLACES = [
  { shape: 'square', label: 'church' }, { shape: 'circle', label: 'farm' }, { shape: 'triangle', label: 'hill top' },
  { shape: 'star', label: 'windmill' }, { shape: 'diamond', label: 'bridge' }, { shape: 'circle', label: 'pond' },
];
const DIRS = [
  ['north', 'N', 0, 1], ['north-east', 'NE', 1, 1], ['east', 'E', 1, 0], ['south-east', 'SE', 1, -1],
  ['south', 'S', 0, -1], ['south-west', 'SW', -1, -1], ['west', 'W', -1, 0], ['north-west', 'NW', -1, 1],
];
const pad = (n) => String(n).padStart(2, '0');

export const GEOGRAPHY_GENERATORS = {
  gridRef(level, rng) {
    const e0 = rng.int(20, 80), n0 = rng.int(10, 80);
    if (level === 3) {
      const [name, abbr, dx, dy] = rng.pick(DIRS);
      const dist = rng.int(1, 2);
      const ax = 1 + rng.int(0, 1) + (dx < 0 ? 1 : 0), ay = 1 + rng.int(0, 1) + (dy < 0 ? 1 : 0);
      const bx = Math.min(3, Math.max(0, ax + dx * dist)), by = Math.min(3, Math.max(0, ay + dy * dist));
      if (Math.sign(bx - ax) !== dx || Math.sign(by - ay) !== dy) return GEOGRAPHY_GENERATORS.gridRef(3, rng);
      const [A, B] = rng.sample(PLACES, 2);
      return {
        kind: 'typed', prompt: `Which direction is the ${B.label} from the ${A.label}?`,
        answer: name, accept: [abbr, abbr.toLowerCase(), name.replace('-', ' '), name.replace('-', '')], strict: true, placeholder: 'e.g. north-west',
        diagram: { type: 'grid', e0, n0, size: 4, markers: [{ x: ax + 0.5, y: ay + 0.5, ...A }, { x: bx + 0.5, y: by + 0.5, ...B }], compass: true },
        explain: `Put your finger on the ${A.label} and think of the compass: the ${B.label} is ${dx === 0 ? '' : dx > 0 ? 'to the right (east)' : 'to the left (west)'}${dx && dy ? ' and ' : ''}${dy === 0 ? '' : dy > 0 ? 'up (north)' : 'down (south)'}, so it is ${name}.`,
        steps: [`I start at the ${A.label}: the direction is always FROM there.`, `The ${B.label} is ${dy > 0 ? 'up' : dy < 0 ? 'down' : 'level'}${dx ? ` and ${dx > 0 ? 'right' : 'left'}` : ''}.`, `North is up, so that is ${name} (${abbr}).`],
      };
    }
    const i = rng.int(0, 3), j = rng.int(0, 3);
    const place = rng.pick(PLACES);
    if (level === 1) {
      const ref = `${pad(e0 + i)}${pad(n0 + j)}`;
      return {
        kind: 'typed', prompt: `Give the 4-figure grid reference for the square with the ${place.label}.`,
        answer: ref, accept: [`${pad(e0 + i)} ${pad(n0 + j)}`], strict: true, placeholder: 'e.g. 4527',
        diagram: { type: 'grid', e0, n0, size: 4, markers: [{ x: i + 0.3 + rng.next() * 0.4, y: j + 0.3 + rng.next() * 0.4, ...place }] },
        explain: `Along the corridor, then up the stairs. Use the lines at the bottom-left corner of the square: easting ${pad(e0 + i)}, northing ${pad(n0 + j)}, so ${ref}.`,
        steps: [`I find the bottom-left corner of the ${place.label}’s square.`, `Along the corridor first: the line on the left of the square is ${pad(e0 + i)}.`, `Then up the stairs: the line below the square is ${pad(n0 + j)}, so the reference is ${ref}.`],
      };
    }
    const tx = rng.int(1, 9), ty = rng.int(1, 9);
    const ref = `${pad(e0 + i)}${tx}${pad(n0 + j)}${ty}`;
    return {
      kind: 'typed', prompt: `Give the 6-figure grid reference for the ${place.label}. Use the small marks to count tenths.`,
      answer: ref, accept: [`${pad(e0 + i)}${tx} ${pad(n0 + j)}${ty}`], strict: true, placeholder: 'e.g. 453276',
      diagram: { type: 'grid', e0, n0, size: 4, tenths: true, markers: [{ x: i + tx / 10, y: j + ty / 10, ...place, exact: true }] },
      explain: `Easting: line ${pad(e0 + i)} plus ${tx} tenths across = ${pad(e0 + i)}${tx}. Northing: line ${pad(n0 + j)} plus ${ty} tenths up = ${pad(n0 + j)}${ty}. Together: ${ref}.`,
      steps: [`I find the square: easting ${pad(e0 + i)}, northing ${pad(n0 + j)}.`, `I imagine the square split into 10 across and 10 up. The ${place.label} is ${tx} tenths across and ${ty} tenths up.`, `So the 6-figure reference is ${pad(e0 + i)}${tx} ${pad(n0 + j)}${ty}, written ${ref}.`],
    };
  },

  mapScale(level, rng) {
    if (level === 1) {
      const cm = rng.int(2, 12);
      return {
        kind: 'typed', prompt: `On a 1:25 000 map, 1 cm stands for 250 m. Two places are ${cm} cm apart on the map. How far apart are they in real life?`,
        numeric: { value: String(cm * 250), form: 'any' }, unit: 'm',
        explain: `Each centimetre is 250 m, so ${cm} × 250 = ${cm * 250} m.`,
        steps: [`On a 1:25 000 map, 1 cm on the map is 25 000 cm in real life, which is 250 m.`, `The places are ${cm} cm apart, so I multiply: ${cm} × 250.`, `${cm} × 250 = ${cm * 250} m.`],
      };
    }
    if (level === 2) {
      const cm = rng.int(1, 15);
      const km = cm / 2;
      return {
        kind: 'typed', prompt: `On a 1:50 000 map, 2 cm stands for 1 km. Two villages are ${cm} cm apart on the map. How many kilometres apart are they?`,
        numeric: { value: String(km), form: 'any' }, unit: 'km',
        explain: `Every 2 cm is 1 km, so divide by 2: ${cm} ÷ 2 = ${km} km.`,
        steps: [`On a 1:50 000 map, 1 cm is 500 m, so 2 cm is 1 km.`, `I divide the map distance by 2.`, `${cm} ÷ 2 = ${km} km.`],
      };
    }
    const quarter = rng.int(2, 14);
    const km = quarter / 4;
    return {
      kind: 'typed', prompt: `A footpath is ${km} km long. How long would it be on a 1:25 000 map, in centimetres?`,
      numeric: { value: String(km * 4), form: 'any' }, unit: 'cm',
      explain: `On a 1:25 000 map, 4 cm = 1 km, so ${km} × 4 = ${km * 4} cm.`,
      steps: [`On a 1:25 000 map, 1 cm = 250 m, so 4 cm = 1 km.`, `I multiply the real distance in km by 4.`, `${km} × 4 = ${km * 4} cm.`],
    };
  },
};

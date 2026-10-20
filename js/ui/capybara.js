// The companion, drawn as SVG: a capybara, or an upright cartoon lion. Never decays, never dies;
// just changes mood. Accessories sit in slots (head, face, front, back, ride), one per slot, so a
// helmet, a cape and a skateboard can be worn together.

import { COURSE } from '../core/subjects.js';

export const FURS = {
  caramel: { body: '#b47b4b', dark: '#8f5d35', light: '#d1a173' },
  chestnut: { body: '#8c5a37', dark: '#6b4227', light: '#b07f58' },
  sandy: { body: '#c9a26d', dark: '#a27e4d', light: '#e0c393' },
  cocoa: { body: '#6f4b34', dark: '#523624', light: '#957058' },
};
// the lion uses the same four keys, so a saved fur choice carries over
export const LION_FURS = {
  caramel: { body: '#e9a93f', mane: '#b5651d', dark: '#9c5617', light: '#f8dca0' },
  chestnut: { body: '#d98c3a', mane: '#7a3b12', dark: '#6b3410', light: '#f3cf98' },
  sandy: { body: '#f0c067', mane: '#d98b2b', dark: '#b8731f', light: '#fbe7b8' },
  cocoa: { body: '#c98a45', mane: '#3d2416', dark: '#3d2416', light: '#efcf9e' },
};

export const SPECIES = { capybara: 'Capybara', lion: 'Lion' };
/** A companion's species: chosen at setup, or by course (younger courses get the lion). */
export const speciesOf = (c, young = false) => c?.species || (young ? 'lion' : 'capybara');

export const ACCESSORIES = {
  none: 'Nothing',
  yuzu: 'Yuzu fruit',
  flower: 'Flower',
  bow: 'Bow',
  glasses: 'Glasses',
  scarf: 'Scarf',
  bird: 'Bird friend',
  racehelmet: 'Racing helmet',
  cape: 'Hero cape',
  mask: 'Hero mask',
  skateboard: 'Skateboard',
  // earned through milestones (see js/core/progress.js)
  sunglasses: 'Sunglasses',
  headphones: 'Headphones',
  beanie: 'Beanie',
  explorer: 'Explorer hat',
  goggles: 'Lab goggles',
  backpack: 'Backpack',
  gradcap: 'Graduation cap',
  crown: 'Crown',
};

export const SLOT = { glasses: 'face', sunglasses: 'face', goggles: 'face', mask: 'face', scarf: 'front', cape: 'back', backpack: 'back', skateboard: 'ride' };
const slotOf = (id) => SLOT[id] || 'head';

/** What the companion is wearing, one accessory per slot (older saves have a single `accessory`). */
export function wornList(c) {
  const w = c?.wear ? Object.values(c.wear) : [c?.accessory];
  return w.filter((x) => x && x !== 'none');
}

/** Put on an accessory (replacing whatever is in its slot), or take it off if it is already worn. */
export function toggleWear(c, id) {
  const wear = { ...(c.wear || (c.accessory && c.accessory !== 'none' ? { [slotOf(c.accessory)]: c.accessory } : {})) };
  if (id === 'none') return { ...c, wear: {}, accessory: 'none' };
  const slot = slotOf(id);
  if (wear[slot] === id) delete wear[slot]; else wear[slot] = id;
  return { ...c, wear, accessory: Object.values(wear).at(-1) || 'none' };
}

function accessory(kind, f) {
  switch (kind) {
    case 'yuzu':
      return `<g><circle cx="66" cy="34" r="13" fill="#f2a533"/><circle cx="62" cy="30" r="3" fill="#f8c66a" opacity=".8"/><path d="M66 21 q6 -8 13 -4 q-6 6 -13 4z" fill="#5c9a3c"/></g>`;
    case 'flower':
      return `<g transform="translate(84 44)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="5" ry="8" transform="rotate(${a}) translate(0 -7)" fill="#f48fb1"/>`).join('')}<circle r="4.5" fill="#ffd54f"/></g>`;
    case 'bow':
      return `<g transform="translate(84 46)"><path d="M0 0 L-12 -8 L-12 8 Z M0 0 L12 -8 L12 8 Z" fill="#e5737f"/><circle r="4" fill="#c94f5c"/></g>`;
    case 'glasses':
      return `<g fill="none" stroke="#2b2a33" stroke-width="2.4"><circle cx="50" cy="76" r="9"/><circle cx="76" cy="76" r="9"/><path d="M59 76 h8 M41 74 l-8 -3"/></g>`;
    case 'scarf':
      return `<g><path d="M90 58 q18 30 8 66 l14 2 q12 -38 -8 -72z" fill="#4d8fd6"/><path d="M100 112 l-6 30 l11 2 l5 -30z" fill="#3a74b5"/><path d="M98 66 q10 24 4 52" stroke="#fff" stroke-width="2" stroke-dasharray="4 6" opacity=".6" fill="none"/></g>`;
    case 'bird':
      return `<g transform="translate(64 32)"><ellipse rx="11" ry="9" fill="#6bb7d6"/><circle cx="7" cy="-5" r="6" fill="#6bb7d6"/><circle cx="9" cy="-6" r="1.4" fill="#222"/><path d="M13 -5 l5 1 l-5 2z" fill="#f2a533"/><path d="M-10 0 l-8 -4 l2 7z" fill="#4f98b8"/></g>`;
    case 'sunglasses':
      return `<g><rect x="38" y="68" width="24" height="15" rx="6" fill="#1c1a33"/><rect x="65" y="68" width="24" height="15" rx="6" fill="#1c1a33"/><path d="M62 74 h3" stroke="#1c1a33" stroke-width="3"/><path d="M42 72 l6 0" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M69 72 l6 0" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;
    case 'goggles':
      return `<g><path d="M26 60 Q64 52 102 60" stroke="#3b3a4a" stroke-width="4" fill="none"/><circle cx="48" cy="60" r="11" fill="#bfe6ff" stroke="#3b3a4a" stroke-width="3"/><circle cx="80" cy="60" r="11" fill="#bfe6ff" stroke="#3b3a4a" stroke-width="3"/><path d="M43 56 l5 -2" stroke="#fff" stroke-width="2"/><path d="M75 56 l5 -2" stroke="#fff" stroke-width="2"/></g>`;
    case 'headphones':
      return `<g><path d="M28 80 Q30 30 64 30 Q98 30 100 80" stroke="#2b2a3a" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="20" y="68" width="14" height="24" rx="6" fill="#5143d9"/><rect x="94" y="68" width="14" height="24" rx="6" fill="#5143d9"/></g>`;
    case 'beanie':
      return `<g><path d="M30 60 Q32 22 64 22 Q96 22 98 60 Z" fill="#d63d74"/><rect x="27" y="54" width="74" height="12" rx="6" fill="#a8235a"/><circle cx="64" cy="20" r="8" fill="#fff"/></g>`;
    case 'explorer':
      return `<g><ellipse cx="64" cy="52" rx="48" ry="9" fill="#b98f52"/><path d="M38 52 Q40 26 64 26 Q88 26 90 52 Z" fill="#d6b06e"/><rect x="39" y="44" width="50" height="6" fill="#6e4f25"/></g>`;
    case 'gradcap':
      return `<g><path d="M44 40 L44 54 Q64 62 84 54 L84 40 Z" fill="#2b2a3a"/><path d="M64 22 L106 37 L64 52 L22 37 Z" fill="#1c1a33"/><path d="M64 37 L100 41 L100 60" stroke="#ffd166" stroke-width="3" fill="none"/><circle cx="100" cy="62" r="3.5" fill="#ffd166"/></g>`;
    case 'racehelmet':
      return `<g><path d="M22 70 Q22 26 64 26 Q106 26 106 70 Q96 62 64 60 Q32 62 22 70 Z" fill="#d62f3a"/><path d="M58 27 L50 46 L60 46 L54 62 L72 40 L62 40 L68 27 Z" fill="#ffd166"/><path d="M24 66 Q64 54 104 66" stroke="#fff" stroke-width="4" fill="none"/><text x="92" y="50" font-family="sans-serif" font-weight="900" font-size="14" fill="#fff">7</text></g>`;
    case 'cape':
      return `<g><path d="M92 64 Q150 36 196 90 Q202 128 188 148 L124 148 Z" fill="#d62f3a"/><path d="M92 64 Q150 44 190 96" stroke="#a51d28" stroke-width="3" fill="none" opacity=".6"/></g>`;
    case 'mask':
      return `<path fill-rule="evenodd" d="M32 70 Q63 60 94 70 Q96 84 82 86 Q63 80 44 86 Q30 84 32 70 Z M44 76 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0 Z M70 76 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0 Z" fill="#2f74e8"/>`;
    case 'crown':
      return `<g><path d="M40 50 L46 24 L58 38 L64 18 L70 38 L82 24 L88 50 Z" fill="#ffd166" stroke="#d9a21b" stroke-width="2" stroke-linejoin="round"/><rect x="40" y="48" width="48" height="8" rx="3" fill="#e0b037"/><circle cx="64" cy="32" r="3" fill="#d63d74"/><circle cx="50" cy="38" r="2.2" fill="#2f74e8"/><circle cx="78" cy="38" r="2.2" fill="#2f74e8"/></g>`;
    case 'skateboard':
      return f.lion
        ? `<g><rect x="56" y="146" width="88" height="7" rx="3.5" fill="#2f74e8"/><path d="M60 148 h80" stroke="#ffd166" stroke-width="2" stroke-dasharray="6 5"/><circle cx="72" cy="156" r="3.6" fill="#2b2a33"/><circle cx="128" cy="156" r="3.6" fill="#2b2a33"/></g>`
        : `<g><rect x="48" y="145" width="140" height="7" rx="3.5" fill="#2f74e8"/><path d="M54 147 h128" stroke="#ffd166" stroke-width="2" stroke-dasharray="6 5"/><circle cx="66" cy="155" r="3.6" fill="#2b2a33"/><circle cx="170" cy="155" r="3.6" fill="#2b2a33"/></g>`;
    case 'backpack':
      return `<g><rect x="126" y="56" width="42" height="48" rx="12" fill="#2f74e8"/><rect x="134" y="80" width="26" height="16" rx="5" fill="#1f5cc4"/><path d="M128 66 Q118 80 120 100" stroke="#1f5cc4" stroke-width="5" fill="none"/></g>`;
    default:
      return '';
  }
}

function eyes(mood) {
  if (mood === 'happy') return `<path d="M45 76 q5 -6 10 0 M71 76 q5 -6 10 0" stroke="#2b2a33" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (mood === 'thinking') return `<circle cx="51" cy="73" r="3.6" fill="#2b2a33"/><circle cx="77" cy="73" r="3.6" fill="#2b2a33"/><circle cx="52" cy="72" r="1.1" fill="#fff"/><circle cx="78" cy="72" r="1.1" fill="#fff"/>`;
  if (mood === 'oops') return `<circle cx="50" cy="76" r="3.6" fill="#2b2a33"/><circle cx="76" cy="76" r="3.6" fill="#2b2a33"/><path d="M96 58 q4 8 0 12 q-4 -4 0 -12z" fill="#7cc0ea"/>`;
  return `<circle cx="50" cy="76" r="3.8" fill="#2b2a33"/><circle cx="76" cy="76" r="3.8" fill="#2b2a33"/><circle cx="51" cy="75" r="1.2" fill="#fff"/><circle cx="77" cy="75" r="1.2" fill="#fff"/>`;
}

/** Returns an SVG string for the companion (species from opts.species, default capybara). */
export function capybaraSVG({ species, fur = 'caramel', accessory: acc = 'none', wear, mood = 'neutral', title } = {}) {
  species ||= COURSE.young ? 'lion' : 'capybara';
  const worn = wornList({ wear, accessory: acc });
  const layer = (slots) => worn.filter((a) => slots.includes(slotOf(a)));
  if (species === 'lion') return lionSVG(LION_FURS[fur] || LION_FURS.caramel, worn, layer, mood, title || 'Lion');
  const f = FURS[fur] || FURS.caramel;
  const draw = (slots) => layer(slots).map((a) => accessory(a, f)).join('');
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title || 'Capybara'}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="108" cy="150" rx="78" ry="7" fill="#000" opacity=".08"/>
  ${draw(['back', 'ride'])}
  <rect x="62" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <rect x="146" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <ellipse cx="118" cy="102" rx="72" ry="42" fill="${f.body}"/>
  <rect x="80" y="126" width="16" height="22" rx="7" fill="${f.body}"/>
  <rect x="164" y="122" width="15" height="24" rx="7" fill="${f.body}"/>
  <path d="M150 74 q22 6 30 26" stroke="${f.dark}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
  ${draw(['front'])}
  <ellipse cx="46" cy="52" rx="8" ry="7" fill="${f.dark}"/>
  <ellipse cx="82" cy="52" rx="8" ry="7" fill="${f.dark}"/>
  <rect x="24" y="50" width="80" height="70" rx="32" fill="${f.body}"/>
  <rect x="22" y="80" width="66" height="40" rx="20" fill="${f.light}"/>
  <ellipse cx="36" cy="92" rx="3.4" ry="2.4" fill="#3b2a20"/>
  <ellipse cx="50" cy="92" rx="3.4" ry="2.4" fill="#3b2a20"/>
  <path d="M38 104 q6 5 12 0" stroke="#3b2a20" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="68" cy="96" r="6" fill="#f2a0a0" opacity=".35"/>
  ${eyes(mood)}
  ${draw(['face'])}
  ${draw(['head'])}
</svg>`;
}

// The lion stands upright, cartoon-style: big maned head over a small body. Head accessories and
// eyes are drawn in the capybara's head coordinates and shifted onto the lion's face.
const HEAD = 'translate(37 -16)';
function lionSVG(f, worn, layer, mood, title) {
  const draw = (slots) => layer(slots).map((a) => (['head', 'face'].includes(slotOf(a)) ? `<g transform="${HEAD}">${accessory(a, f)}</g>` : lionBody(a, f))).join('');
  const riding = worn.includes('skateboard');
  const mane = Array.from({ length: 14 }, (_, i) => { const t = (i / 14) * Math.PI * 2; return `<circle cx="${(100 + Math.cos(t) * 33).toFixed(1)}" cy="${(64 + Math.sin(t) * 31).toFixed(1)}" r="14"/>`; }).join('');
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="${riding ? 158 : 151}" rx="${riding ? 52 : 40}" ry="5" fill="#000" opacity=".08"/>
  ${draw(['back'])}
  ${draw(['ride'])}
  <path d="M120 132 Q150 136 156 112 Q158 102 150 100" stroke="${f.body}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="151" cy="99" rx="7" ry="8" fill="${f.mane}"/>
  <rect x="83" y="126" width="14" height="20" rx="6" fill="${f.body}"/>
  <rect x="103" y="126" width="14" height="20" rx="6" fill="${f.body}"/>
  <ellipse cx="89" cy="145" rx="10" ry="4.5" fill="${f.light}"/>
  <ellipse cx="111" cy="145" rx="10" ry="4.5" fill="${f.light}"/>
  <ellipse cx="100" cy="116" rx="25" ry="22" fill="${f.body}"/>
  <ellipse cx="100" cy="121" rx="15" ry="14" fill="${f.light}"/>
  <path d="M79 104 Q66 116 70 128" stroke="${f.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M121 104 Q134 116 130 128" stroke="${f.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="70" cy="129" r="6" fill="${f.light}"/>
  <circle cx="130" cy="129" r="6" fill="${f.light}"/>
  ${draw(['front'])}
  <g fill="${f.mane}">${mane}<circle cx="100" cy="64" r="36"/></g>
  <circle cx="76" cy="38" r="9" fill="${f.body}"/><circle cx="76" cy="38" r="4.5" fill="${f.light}"/>
  <circle cx="124" cy="38" r="9" fill="${f.body}"/><circle cx="124" cy="38" r="4.5" fill="${f.light}"/>
  <circle cx="100" cy="66" r="29" fill="${f.body}"/>
  <ellipse cx="100" cy="78" rx="15" ry="10" fill="${f.light}"/>
  <path d="M94 71 h12 q-2 6 -6 7 q-4 -1 -6 -7z" fill="#6b3a2a"/>
  <path d="M100 78 v3 M100 81 q-4 5 -9 2 M100 81 q4 5 9 2" stroke="#6b3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="74" r="5" fill="#f2a0a0" opacity=".35"/><circle cx="120" cy="74" r="5" fill="#f2a0a0" opacity=".35"/>
  <g transform="${HEAD}">${eyes(mood)}</g>
  ${draw(['face'])}
  ${draw(['head'])}
</svg>`;
}

// body accessories redrawn for the lion's upright shape
function lionBody(kind, f) {
  switch (kind) {
    case 'cape':
      return `<g><path d="M82 96 Q44 104 22 134 Q30 146 48 140 Q60 148 74 140 Q90 148 104 140 L122 98 Z" fill="#d62f3a"/><path d="M84 100 Q52 110 34 134" stroke="#a51d28" stroke-width="3" fill="none" opacity=".6"/><path d="M78 98 Q100 106 122 98" stroke="#a51d28" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
    case 'backpack':
      return `<g><rect x="114" y="98" width="30" height="36" rx="9" fill="#2f74e8"/><rect x="120" y="114" width="18" height="12" rx="4" fill="#1f5cc4"/></g>`;
    case 'scarf':
      return `<g><path d="M76 96 Q100 108 124 96 L126 104 Q100 116 74 104 Z" fill="#4d8fd6"/><path d="M110 104 l4 26 l9 -2 l-5 -26z" fill="#3a74b5"/></g>`;
    case 'skateboard':
      return accessory('skateboard', { ...f, lion: true });
    default:
      return '';
  }
}

export function capybaraEl(opts, className = 'capy') {
  const wrap = document.createElement('div');
  wrap.className = className;
  wrap.innerHTML = capybaraSVG(opts);
  return wrap;
}

// friendly names and facts for whichever animal it is
export const companionNoun = (species) => (species === 'lion' ? 'lion' : 'capybara');
export const COMPANION_FACTS = {
  capybara: [
    'Capybaras are the largest rodents in the world.',
    'Capybaras can stay underwater for up to five minutes.',
    'Capybaras have slightly webbed feet, which makes them great swimmers.',
    'Capybaras live in groups, often of 10 to 20.',
    'A capybara’s front teeth never stop growing.',
    'Capybaras come from South America and love living near water.',
    'The name “capybara” comes from a Tupi word meaning “grass eater”.',
  ],
  lion: [
    'A lion’s roar can be heard up to 8 kilometres away.',
    'Lions live in groups called prides.',
    'Lions can sleep for up to 20 hours a day.',
    'Male lions grow a mane; the darker it is, the older the lion often is.',
    'Lion cubs are born with spots, which fade as they grow.',
    'Lions can sprint at about 80 kilometres an hour, but only for a short burst.',
    'Most wild lions live in Africa; a small group lives in India’s Gir Forest.',
  ],
};

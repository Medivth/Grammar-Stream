// The companion, drawn as SVG: a capybara, an upright cartoon lion, or (Year 8) a young heroine.
// Never decays, never dies; just changes mood. Accessories sit in slots (head, face, body, front,
// back, hold, hand, ride), one per slot, so a helmet, armour, a cloak, a sword and a shield can be
// worn together.

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

export const SPECIES = { capybara: 'Capybara', lion: 'Lion', heroine: 'Heroine' };
/** The companions a course offers at setup (Year 8 adds the heroine). */
export const speciesChoices = (course = COURSE) => course.companions || ['capybara', 'lion'];

// The heroine's looks: skin tone, hair colour and style. Saved as `look`, so the animals keep their fur.
export const LOOKS = {
  braid: { label: 'Brown braid', skin: '#f0c8a6', hair: '#6b4226', style: 'braid' },
  bun: { label: 'Black bun', skin: '#c98d62', hair: '#211915', style: 'bun' },
  curls: { label: 'Dark curls', skin: '#8d5838', hair: '#2a1a12', style: 'curls' },
  bob: { label: 'Blonde bob', skin: '#f6d8c0', hair: '#d9a84e', style: 'bob' },
  waves: { label: 'Auburn waves', skin: '#f3cdb0', hair: '#9a3e22', style: 'waves' },
  knot: { label: 'Greek knot', skin: '#dcaa7e', hair: '#3a2419', style: 'knot' },
  puff: { label: 'Curly puff', skin: '#5f3c28', hair: '#17110e', style: 'puff' },
  ponytail: { label: 'Black ponytail', skin: '#eecfb0', hair: '#1b1517', style: 'ponytail' },
};
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
  chef: 'Chef’s hat',
  partyhat: 'Party hat',
  astronaut: 'Space helmet',
  scooter: 'Scooter',
  laurel: 'Laurel wreath',
  corinthian: 'Greek helmet',
  shield: 'Round shield',
  // earned through milestones (see js/core/progress.js)
  sunglasses: 'Sunglasses',
  headphones: 'Headphones',
  beanie: 'Beanie',
  explorer: 'Explorer hat',
  goggles: 'Lab goggles',
  backpack: 'Backpack',
  gradcap: 'Graduation cap',
  crown: 'Crown',
  pirate: 'Pirate hat',
  starglasses: 'Star glasses',
  wings: 'Wings',
  jetpack: 'Jetpack',
  wizard: 'Wizard hat',
  medal: 'Gold medal',
  surfboard: 'Surfboard',
  owl: 'Owl friend',
  bowtie: 'Bow tie',
  knight: 'Knight’s helmet',
  // Greek and Roman (Year 8): clothes, things to hold, and more for the head and back
  chiton: 'Greek chiton',
  himation: 'Himation',
  toga: 'Roman toga',
  stola: 'Stola and palla',
  linothorax: 'Hoplite linothorax',
  lorica: 'Centurion armour',
  aspis: 'Greek aspis',
  scutum: 'Roman scutum',
  dory: 'Dory spear',
  xiphos: 'Xiphos',
  gladius: 'Gladius',
  lyre: 'Lyre',
  scroll: 'Scroll',
  olivebranch: 'Olive branch',
  torch: 'Torch',
  olive: 'Olive wreath',
  galea: 'Centurion’s helmet',
  cloak: 'Red military cloak',
  chariot: 'Chariot',
};

export const SLOT = {
  glasses: 'face', sunglasses: 'face', goggles: 'face', mask: 'face', starglasses: 'face',
  scarf: 'front', bowtie: 'front', medal: 'front',
  chiton: 'body', himation: 'body', toga: 'body', stola: 'body', linothorax: 'body', lorica: 'body',
  cape: 'back', backpack: 'back', wings: 'back', jetpack: 'back', cloak: 'back',
  shield: 'hand', aspis: 'hand', scutum: 'hand',
  dory: 'hold', xiphos: 'hold', gladius: 'hold', lyre: 'hold', scroll: 'hold', olivebranch: 'hold', torch: 'hold',
  skateboard: 'ride', scooter: 'ride', surfboard: 'ride', chariot: 'ride',
};
export const slotOf = (id) => SLOT[id] || 'head';
/** How the wardrobe groups its slots. */
export const SLOT_GROUPS = [['Head', ['head']], ['Face', ['face']], ['Clothes', ['body', 'front']], ['Hands', ['hold', 'hand']], ['Back', ['back']], ['Ride', ['ride']]];

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

const star = (cx, cy, r, fill) => `<path d="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(' ')}Z" fill="${fill}"/>`;

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
    case 'chef':
      return `<g fill="#fff" stroke="#d9d9e3" stroke-width="2"><rect x="40" y="44" width="48" height="14" rx="4"/><circle cx="47" cy="37" r="11"/><circle cx="64" cy="31" r="12"/><circle cx="81" cy="37" r="11"/><path d="M40 44 h48" stroke="none"/></g>`;
    case 'partyhat':
      return `<g><path d="M47 56 L64 22 L81 56 Z" fill="#ff8a3d"/><path d="M53 44 L75 44 M50 51 L78 51 M57 34 L71 34" stroke="#ffd166" stroke-width="3.5"/><circle cx="64" cy="22" r="5.5" fill="#d63d74"/></g>`;
    case 'astronaut':
      return `<g><circle cx="64" cy="82" r="50" fill="#bfe6ff" opacity=".28" stroke="#c7ced9" stroke-width="6"/><path d="M30 50 Q40 38 54 36" stroke="#fff" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/><rect x="40" y="126" width="48" height="10" rx="5" fill="#e3e7ee" stroke="#c7ced9" stroke-width="2"/></g>`;
    case 'laurel':
      return `<g fill="#5c9a3c">${[200, 215, 230, 245, 260, 280, 295, 310, 325, 340].map((a) => { const t = (a * Math.PI) / 180, x = 64 + Math.cos(t) * 40, y = 70 + Math.sin(t) * 30; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="4" transform="rotate(${a + 90} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('')}<circle cx="64" cy="41" r="3.5" fill="#ffd166"/></g>`;
    case 'corinthian':
      return `<g><path d="M40 34 Q64 10 88 34" stroke="#d62f3a" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M28 68 Q28 28 64 28 Q100 28 100 68 L100 92 L90 92 L90 66 Q64 58 38 66 L38 92 L28 92 Z" fill="#c8913a"/><path d="M60 62 L60 96 L68 96 L68 62" fill="#c8913a"/><path d="M30 60 Q64 50 98 60" stroke="#a46f24" stroke-width="3" fill="none"/></g>`;
    case 'knight':
      return `<g><path d="M64 28 Q72 12 90 14 Q80 22 76 30" fill="#d62f3a"/><path d="M28 70 Q28 26 64 26 Q100 26 100 70 Z" fill="#a9b1bb"/><path d="M28 62 h72" stroke="#7d8692" stroke-width="3"/><rect x="60" y="28" width="8" height="34" fill="#c7ced6"/></g>`;
    case 'pirate':
      return `<g><path d="M22 60 Q28 30 64 30 Q100 30 106 60 Q86 48 64 50 Q42 48 22 60 Z" fill="#1c1a33"/><path d="M24 58 Q64 40 104 58" stroke="#ffd166" stroke-width="3" fill="none"/><circle cx="64" cy="41" r="5.5" fill="#fff"/><path d="M56 49 l16 -6 M56 43 l16 6" stroke="#fff" stroke-width="2.4"/></g>`;
    case 'wizard':
      return `<g><path d="M32 58 Q64 48 96 58 L70 18 Q66 14 62 20 Z" fill="#5143d9"/><ellipse cx="64" cy="58" rx="38" ry="7" fill="#3b2fb0"/>${star(56, 42, 5.5, '#ffd166')}${star(70, 28, 4, '#ffd166')}${star(72, 48, 3, '#fff')}</g>`;
    case 'owl':
      return `<g transform="translate(64 37)"><path d="M-12 -12 l4 -7 l4 5 M12 -12 l-4 -7 l-4 5" fill="#6b4e33"/><ellipse rx="13" ry="15" fill="#8a6a4a"/><ellipse cy="5" rx="8" ry="8" fill="#c9a77f"/><circle cx="-5" cy="-4" r="5" fill="#fff"/><circle cx="5" cy="-4" r="5" fill="#fff"/><circle cx="-5" cy="-4" r="2.4" fill="#2b2a33"/><circle cx="5" cy="-4" r="2.4" fill="#2b2a33"/><path d="M-2 1 l2 4 l2 -4z" fill="#f2a533"/></g>`;
    case 'starglasses':
      return `<g>${star(50, 76, 12, '#ff5fa2')}${star(76, 76, 12, '#ff5fa2')}<path d="M60 76 h6 M38 74 l-6 -3" stroke="#2b2a33" stroke-width="2.4"/>${star(50, 76, 6, '#ffd166')}${star(76, 76, 6, '#ffd166')}</g>`;
    case 'bowtie':
      return `<g transform="translate(86 124)"><path d="M0 0 L-13 -8 L-13 8 Z M0 0 L13 -8 L13 8 Z" fill="#d62f3a"/><circle r="4" fill="#a51d28"/></g>`;
    case 'medal':
      return `<g><path d="M80 112 L90 134 L100 112" stroke="#2f74e8" stroke-width="6" fill="none"/><circle cx="90" cy="136" r="9" fill="#ffd166" stroke="#d9a21b" stroke-width="2.5"/>${star(90, 136, 5, '#d9a21b')}</g>`;
    case 'wings':
      return `<g fill="#f4f7ff" stroke="#c5cde0" stroke-width="2"><path d="M120 66 Q128 24 168 22 Q160 42 170 46 Q150 52 156 62 Q136 64 120 66 Z"/><path d="M134 64 Q148 36 182 40 Q172 54 180 60 Q162 64 164 70 Q148 70 134 64 Z" opacity=".9"/></g>`;
    case 'jetpack':
      return `<g><rect x="118" y="38" width="16" height="36" rx="7" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><rect x="138" y="38" width="16" height="36" rx="7" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><path d="M120 74 l6 18 l6 -18 Z M140 74 l6 18 l6 -18 Z" fill="#ff8a3d"/><path d="M123 74 l3 10 l3 -10 Z M143 74 l3 10 l3 -10 Z" fill="#ffd166"/></g>`;
    case 'shield':
      return `<g><circle cx="152" cy="104" r="28" fill="#c8913a" stroke="#a46f24" stroke-width="4"/><circle cx="152" cy="104" r="18" fill="none" stroke="#a46f24" stroke-width="2"/><path d="M142 118 L152 90 L162 118" stroke="#7a2f1d" stroke-width="5" fill="none" stroke-linejoin="round"/></g>`;
    case 'scooter':
      return f.lion
        ? `<g><rect x="56" y="146" width="84" height="6" rx="3" fill="#d62f3a"/><path d="M62 148 L58 98" stroke="#8d96a3" stroke-width="4"/><path d="M48 98 h20" stroke="#2b2a33" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="155" r="4" fill="#2b2a33"/><circle cx="134" cy="155" r="4" fill="#2b2a33"/></g>`
        : `<g><rect x="44" y="145" width="140" height="6" rx="3" fill="#d62f3a"/><path d="M48 147 L40 92" stroke="#8d96a3" stroke-width="4"/><path d="M30 92 h20" stroke="#2b2a33" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="155" r="4" fill="#2b2a33"/><circle cx="178" cy="155" r="4" fill="#2b2a33"/></g>`;
    case 'surfboard':
      return f.lion
        ? `<g><ellipse cx="100" cy="151" rx="60" ry="6" fill="#4fc3f7"/><path d="M44 151 h112" stroke="#fff" stroke-width="2" opacity=".8"/><path d="M84 146 v10" stroke="#ff8a3d" stroke-width="5"/></g>`
        : `<g><ellipse cx="114" cy="150" rx="88" ry="7" fill="#4fc3f7"/><path d="M30 150 h168" stroke="#fff" stroke-width="2" opacity=".8"/><path d="M100 144 v12" stroke="#ff8a3d" stroke-width="6"/></g>`;
    case 'backpack':
      return `<g><rect x="126" y="56" width="42" height="48" rx="12" fill="#2f74e8"/><rect x="134" y="80" width="26" height="16" rx="5" fill="#1f5cc4"/><path d="M128 66 Q118 80 120 100" stroke="#1f5cc4" stroke-width="5" fill="none"/></g>`;
    case 'galea':
      return GALEA;
    case 'olive':
      return OLIVE;
    case 'cloak':
      return `<g><path d="M92 64 Q150 38 194 90 Q201 126 188 148 L124 148 Z" fill="#9e1f1f"/><path d="M152 62 Q178 92 172 146" stroke="#7a1414" stroke-width="3" fill="none" opacity=".7"/></g>`;
    case 'aspis':
    case 'scutum':
      return `<g transform="translate(152 104)">${SHIELDS[kind]}</g>`;
    default:
      if (HOLD[kind]) return `<g transform="${CAPY_HOLD[kind]}">${HOLD[kind]}</g>`;
      if (SLOT[kind] === 'body') return capyBody(kind);
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
export function capybaraSVG({ species, fur = 'caramel', look, accessory: acc = 'none', wear, mood = 'neutral', title, fit = false } = {}) {
  species ||= COURSE.young ? 'lion' : 'capybara';
  const worn = wornList({ wear, accessory: acc });
  const layer = (slots) => worn.filter((a) => slots.includes(slotOf(a)));
  if (species === 'lion') return lionSVG(LION_FURS[fur] || LION_FURS.caramel, worn, layer, mood, title || 'Lion');
  if (species === 'heroine') {
    const svg = heroineSVG(LOOKS[look] || LOOKS.braid, worn, layer, mood, title || 'Heroine');
    // standing, she is narrow: on her own (not in a scene) she is framed more closely, unless the chariot needs the room
    return fit && !worn.includes('chariot') ? svg.replace('viewBox="0 0 200 160"', 'viewBox="30 0 140 160"') : svg;
  }
  const f = FURS[fur] || FURS.caramel;
  const draw = (slots) => layer(slots).filter((a) => a !== 'chariot').map((a) => accessory(a, f)).join('');
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title || 'Capybara'}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="108" cy="${worn.includes('chariot') ? 156 : 150}" rx="78" ry="${worn.includes('chariot') ? 4 : 7}" fill="#000" opacity=".08"/>
  ${draw(['back', 'ride'])}
  <rect x="62" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <rect x="146" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <ellipse cx="118" cy="102" rx="72" ry="42" fill="${f.body}"/>
  <rect x="80" y="126" width="16" height="22" rx="7" fill="${f.body}"/>
  <rect x="164" y="122" width="15" height="24" rx="7" fill="${f.body}"/>
  <path d="M150 74 q22 6 30 26" stroke="${f.dark}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
  ${draw(['body'])}
  ${worn.includes('cloak') ? CAPY_CLOAK_OVER : ''}
  ${worn.includes('chariot') ? CAPY_CHARIOT : ''}
  ${draw(['front', 'hand', 'hold'])}
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
  const draw = (slots) => layer(slots).filter((a) => a !== 'chariot').map((a) => (['head', 'face'].includes(slotOf(a)) ? `<g transform="${HEAD}">${accessory(a, f)}</g>` : lionBody(a, f))).join('');
  const riding = worn.some((a) => slotOf(a) === 'ride');
  const held = layer(['hold']).map((a) => `<g transform="translate(66 127) scale(.95)">${HOLD[a]}</g><circle cx="67" cy="127" r="5.5" fill="${f.light}"/>`).join('');
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
  ${draw(['body'])}
  ${worn.includes('chariot') ? UPRIGHT_CHARIOT : ''}
  <path d="M79 104 Q66 116 70 128" stroke="${f.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M121 104 Q134 116 130 128" stroke="${f.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="70" cy="129" r="6" fill="${f.light}"/>
  <circle cx="130" cy="129" r="6" fill="${f.light}"/>
  ${draw(['front', 'hand'])}
  <g fill="${f.mane}">${mane}<circle cx="100" cy="64" r="36"/></g>
  ${held}
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
    case 'scooter':
    case 'surfboard':
      return accessory(kind, { ...f, lion: true });
    case 'bowtie':
      return `<g transform="translate(100 108)"><path d="M0 0 L-11 -7 L-11 7 Z M0 0 L11 -7 L11 7 Z" fill="#d62f3a"/><circle r="3.5" fill="#a51d28"/></g>`;
    case 'medal':
      return `<g><path d="M90 96 L100 116 L110 96" stroke="#2f74e8" stroke-width="5" fill="none"/><circle cx="100" cy="120" r="8" fill="#ffd166" stroke="#d9a21b" stroke-width="2.5"/>${star(100, 120, 4.5, '#d9a21b')}</g>`;
    case 'wings':
      return `<g fill="#f4f7ff" stroke="#c5cde0" stroke-width="2"><path d="M82 104 Q46 70 26 84 Q40 92 34 100 Q52 100 50 110 Q66 106 82 112 Z"/><path d="M118 104 Q154 70 174 84 Q160 92 166 100 Q148 100 150 110 Q134 106 118 112 Z"/></g>`;
    case 'jetpack':
      return `<g><rect x="52" y="94" width="14" height="32" rx="6" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><rect x="134" y="94" width="14" height="32" rx="6" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><path d="M53 126 l6 16 l6 -16 Z M135 126 l6 16 l6 -16 Z" fill="#ff8a3d"/><path d="M56 126 l3 9 l3 -9 Z M138 126 l3 9 l3 -9 Z" fill="#ffd166"/></g>`;
    case 'shield':
      return `<g><circle cx="134" cy="120" r="19" fill="#c8913a" stroke="#a46f24" stroke-width="3"/><circle cx="134" cy="120" r="12" fill="none" stroke="#a46f24" stroke-width="1.6"/><path d="M127 130 L134 110 L141 130" stroke="#7a2f1d" stroke-width="4" fill="none" stroke-linejoin="round"/></g>`;
    case 'aspis':
    case 'scutum':
      return `<g transform="translate(134 120) scale(.7)">${SHIELDS[kind]}</g>`;
    case 'cloak':
      return `<g><path d="M80 98 Q60 112 56 147 Q100 153 144 147 Q140 112 120 98 Z" fill="#9e1f1f"/><path d="M66 118 Q62 132 63 146 M134 118 Q138 132 137 146" stroke="#7a1414" stroke-width="2.5" fill="none" opacity=".8"/></g>`;
    default:
      if (SLOT[kind] === 'body') return lionClothes(kind);
      return '';
  }
}

// --- Greek and Roman things, shared by all three companions ---------------------------------------

const n1 = (v) => +v.toFixed(1);

// head things in the capybara's head coordinates (moved onto the lion's and the heroine's heads)
// A centurion's galea: an iron bowl with brass trim, cheek guards, and a crest worn side to side.
const GALEA = `<g><path d="M16 44 Q20 15 64 16 Q108 15 112 44 Q64 31 16 44 Z" fill="#c4302b"/>${[[30, 37, 25, 23], [42, 33, 39, 19], [54, 31, 53, 17], [74, 31, 75, 17], [86, 33, 89, 19], [98, 37, 103, 23]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#e5675c" stroke-width="2.2" stroke-linecap="round"/>`).join('')}<path d="M26 64 Q14 70 12 80 L30 75 Z M102 64 Q114 70 116 80 L98 75 Z" fill="#8d96a3"/><path d="M28 68 Q28 30 64 30 Q100 30 100 68 Z" fill="#b9c1cb"/><path d="M42 36 Q64 27 86 36" stroke="#e3e8ee" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="59" y="26" width="10" height="9" rx="2" fill="#d4a64a"/><path d="M26 64 Q64 54 102 64 L102 71 Q64 61 26 71 Z" fill="#d4a64a"/><path d="M30 67 L30 94 Q35 99 42 93 L42 70 Z M98 67 L98 94 Q93 99 86 93 L86 70 Z" fill="#b9c1cb" stroke="#8d96a3" stroke-width="1.5"/><circle cx="36" cy="84" r="2.2" fill="#d4a64a"/><circle cx="92" cy="84" r="2.2" fill="#d4a64a"/></g>`;
// An olive wreath (the Olympic prize): narrow two-tone leaves and a few olives.
const OLIVE = `<g><path d="M28 66 Q30 40 64 39 Q98 40 100 66" stroke="#6b4a2a" stroke-width="2" fill="none"/>${[200, 214, 228, 242, 256, 284, 298, 312, 326, 340].flatMap((a) => [-1, 1].map((side) => { const t = (a * Math.PI) / 180, x = n1(64 + Math.cos(t) * (39 + side * 3)), y = n1(70 + Math.sin(t) * (30 + side * 3)), toFront = a < 270 ? 1 : -1; return `<ellipse cx="${x}" cy="${y}" rx="7.5" ry="2.3" transform="rotate(${a + 90 + side * toFront * 28} ${x} ${y})" fill="${side < 0 ? '#a9b98a' : '#6f8a4c'}"/>`; })).join('')}<circle cx="38" cy="47" r="2.8" fill="#4b3b4f"/><circle cx="91" cy="46" r="2.8" fill="#4b3b4f"/><circle cx="64" cy="37" r="2.6" fill="#5d6b2a"/></g>`;

// shields, centred on (0, 0) at the capybara's size
const SHIELDS = {
  // a hoplite's round aspis, with Athena's owl on it
  aspis: `<circle r="28" fill="#c8913a" stroke="#8a5a1c" stroke-width="3"/><circle r="21.5" fill="#25427a"/><g fill="#e8c77a"><path d="M-9 -9 L-8.5 -18 L-3 -13 L3 -13 L8.5 -18 L9 -9 Z"/><ellipse rx="9.5" ry="13"/></g><circle cx="-4.2" cy="-6" r="3.8" fill="#25427a"/><circle cx="4.2" cy="-6" r="3.8" fill="#25427a"/><circle cx="-4.2" cy="-6" r="1.5" fill="#e8c77a"/><circle cx="4.2" cy="-6" r="1.5" fill="#e8c77a"/><path d="M-1.6 -1.5 L0 2.5 L1.6 -1.5 Z" fill="#25427a"/><path d="M-6 3 Q-7 9 -3 12 M6 3 Q7 9 3 12" stroke="#25427a" stroke-width="1.4" fill="none"/><path d="M-4 13 v4 M4 13 v4" stroke="#e8c77a" stroke-width="2" stroke-linecap="round"/>`,
  // a legionary's curved, oblong scutum: a boss, wings and thunderbolts
  scutum: `<path d="M-20 -29 Q0 -33 20 -29 L20 29 Q0 33 -20 29 Z" fill="#b3261e"/><path d="M-15.5 -29 V29 M15.5 -29 V29" stroke="#8f1c16" stroke-width="5" opacity=".5"/><path d="M-20 -29 Q0 -33 20 -29 L20 29 Q0 33 -20 29 Z" fill="none" stroke="#e0b13a" stroke-width="2.5"/><path d="M0 -30 V-10 M0 10 V30" stroke="#e0b13a" stroke-width="2.5"/><g fill="#e0b13a"><path d="M-6 -7 Q-14 -12 -16 -25 Q-9 -19 -3 -11 Z"/><path d="M6 -7 Q14 -12 16 -25 Q9 -19 3 -11 Z"/></g><path d="M-5 9 L-10 15 L-6 16 L-12 25 M5 9 L10 15 L6 16 L12 25" stroke="#e0b13a" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="-9" y="-9" width="18" height="18" rx="2" fill="#d4a64a"/><circle r="6.5" fill="#e8c26a" stroke="#b8862a" stroke-width="2"/>`,
};

// things to hold, gripped at (0, 0) and pointing up
const leaves = (pts, col1, col2) => pts.map(([x, y, a], i) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="2.3" transform="rotate(${a} ${x} ${y})" fill="${i % 2 ? col2 : col1}"/>`).join('');
const HOLD = {
  gladius: `<path d="M-3 -6 L-3 -38 L0 -45 L3 -38 L3 -6 Z" fill="#d5dce4" stroke="#8d96a3" stroke-width="1"/><path d="M0 -9 V-39" stroke="#a9b2bd" stroke-width="1"/><rect x="-7.5" y="-7.5" width="15" height="4" rx="2" fill="#c08a3e"/><rect x="-2.2" y="-4" width="4.4" height="9" rx="1.5" fill="#6b4226"/><circle cy="7" r="3.6" fill="#c08a3e"/>`,
  xiphos: `<path d="M0 -50 Q5.5 -38 4 -24 Q3 -12 2 -7 L-2 -7 Q-3 -12 -4 -24 Q-5.5 -38 0 -50 Z" fill="#d5dce4" stroke="#8d96a3" stroke-width="1"/><path d="M0 -10 V-44" stroke="#a9b2bd" stroke-width="1"/><path d="M-8 -10 Q-7 -6 -3 -6 L3 -6 Q7 -6 8 -10" stroke="#c8913a" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="-2" y="-6" width="4" height="10" rx="1.5" fill="#5a3a20"/><ellipse cy="5.5" rx="4.5" ry="2" fill="#c8913a"/>`,
  dory: `<path d="M0 26 V-86" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/><path d="M0 -104 Q5.5 -94 3 -86 L-3 -86 Q-5.5 -94 0 -104 Z" fill="#c8913a" stroke="#8a5a1c" stroke-width="1"/><path d="M0 -101 V-88" stroke="#8a5a1c" stroke-width=".8"/><rect x="-2.2" y="-88" width="4.4" height="4" rx="1" fill="#8a5a1c"/><path d="M-2 25 L2 25 L0 33 Z" fill="#8a5a1c"/>`,
  lyre: `<path d="M-6 -12 Q-15 -26 -9 -42" stroke="#e8dcc0" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M6 -12 Q15 -26 9 -42" stroke="#e8dcc0" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-11.5 -38 H11.5" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/><ellipse cy="-6" rx="10.5" ry="8" fill="#7a5230"/><path d="M-7 -9 h4 l2 3 l-2 3 h-4 l-2 -3 Z M3 -9 h4 l2 3 l-2 3 h-4 l-2 -3 Z" fill="#a8784a"/><path d="M-3 -38 V-6 M-1 -38 V-6 M1 -38 V-6 M3 -38 V-6" stroke="#fff7e0" stroke-width=".7"/><rect x="-5" y="-7" width="10" height="2.2" rx="1" fill="#e8dcc0"/>`,
  scroll: `<path d="M2 -26 h14 q3 0 3 3 v22 q0 3 -3 3 h-14 Z" fill="#f4ead0" stroke="#d9c79a" stroke-width="1"/><path d="M6 -20 h9 M6 -15 h9 M6 -10 h7 M6 -5 h9" stroke="#b9a57a" stroke-width="1.2" stroke-linecap="round"/><rect x="-3.5" y="-28" width="7" height="32" rx="3.5" fill="#e6d3a3" stroke="#c9b27a" stroke-width="1"/><rect x="16" y="-28" width="6" height="32" rx="3" fill="#e6d3a3" stroke="#c9b27a" stroke-width="1"/><circle cy="-30" r="2.4" fill="#8a5a35"/><circle cy="6" r="2.4" fill="#8a5a35"/><circle cx="19" cy="-30" r="2.2" fill="#8a5a35"/><circle cx="19" cy="6" r="2.2" fill="#8a5a35"/>`,
  olivebranch: `<path d="M0 6 Q3 -16 -2 -44" stroke="#6b4a2a" stroke-width="2" fill="none" stroke-linecap="round"/>${leaves([[-6, -8, -30], [7, -14, 30], [-6, -22, -35], [7, -28, 35], [-7, -36, -40], [5, -42, 25], [-1, -47, 80]], '#6f8a4c', '#a9b98a')}<circle cx="-4" cy="-15" r="2.5" fill="#4b3b4f"/><circle cx="4" cy="-34" r="2.3" fill="#5d6b2a"/>`,
  torch: `<path d="M-2.4 10 L-3.4 -24 L3.4 -24 L2.4 10 Z" fill="#7a4a2a"/><rect x="-5" y="-31" width="10" height="8" rx="2" fill="#5a3a20"/><path d="M-5 -27 h10" stroke="#8a6a40" stroke-width="1"/><path d="M0 -58 Q10 -45 7 -38 Q5 -31 0 -31 Q-5 -31 -7 -38 Q-10 -45 0 -58 Z" fill="#ff8a3d"/><path d="M0 -49 Q5 -42 3.5 -37 Q2 -34 0 -34 Q-2 -34 -3.5 -37 Q-5 -42 0 -49 Z" fill="#ffd166"/>`,
};
// the capybara has no hands: things stand beside it, leaning on its shoulder (swords point down)
const CAPY_HOLD = { dory: 'translate(114 115) rotate(-6)', torch: 'translate(114 138) rotate(-8)', lyre: 'translate(116 147) rotate(-8)', scroll: 'translate(110 141) rotate(-8)', olivebranch: 'translate(114 142) rotate(-6)', gladius: 'translate(116 103) rotate(180)', xiphos: 'translate(116 98) rotate(180)' };

// --- clothes on the capybara: cloth over its back, inside the outline of its body
const onBody = (deg) => { const t = (deg * Math.PI) / 180; return [n1(118 + 72 * Math.cos(t)), n1(102 + 42 * Math.sin(t))]; };
const topY = (x) => n1(102 - 42 * Math.sqrt(Math.max(0, 1 - ((x - 118) / 72) ** 2)));
function cloth(fill, hem = 122, a0 = 208, a1 = 336, more = '') {
  const pts = Array.from({ length: 13 }, (_, i) => onBody(a0 + ((a1 - a0) * i) / 12).join(' '));
  const right = onBody(a1)[0] - 6;
  return `<path d="M${pts.join(' L')} L${n1(right)} ${hem} Q118 ${hem + 10} 62 ${hem} Z" fill="${fill}"${more}/>`;
}
const hemLine = (y, stroke, w, more = '') => `<path d="M64 ${y} Q118 ${y + 10} 174 ${y}" stroke="${stroke}" stroke-width="${w}" fill="none"${more}/>`;
const capyFolds = (stroke, hem = 120) => [84, 104, 124, 144, 164].map((x) => `<path d="M${x} ${topY(x) + 5} Q${x - 4} ${(topY(x) + hem) / 2} ${x - 1} ${hem}" stroke="${stroke}" stroke-width="1.6" fill="none"/>`).join('');
const meander = (x0, x1, y, col) => { let d = ''; for (let x = x0; x < x1 - 4; x += 5) d += `M${x} ${y + 1.3} v-2.6 h3.2 v1.4 h-1.6 `; return `<path d="${d}" stroke="${col}" stroke-width=".9" fill="none"/>`; };
function capyBody(kind) {
  switch (kind) {
    case 'chiton':
      return `<g>${cloth('#f3ecdc', 124)}${capyFolds('#d9cdb2', 122)}${hemLine(117, '#3b5ea8', 5)}${hemLine(117, '#f3ecdc', 1, ' stroke-dasharray="3 3"')}</g>`;
    case 'himation':
      return `<g>${cloth('#f3ecdc', 126)}${cloth('#355c8c', 114, 212, 334)}<path d="M70 86 Q120 112 176 92 M80 80 Q124 100 170 84" stroke="#28476d" stroke-width="2" fill="none"/>${hemLine(110, '#e0b13a', 2)}</g>`;
    case 'toga':
      return `<g>${cloth('#f5f2ea', 124)}<path d="M64 92 Q112 126 178 94 M70 104 Q118 134 174 106 M98 70 Q122 98 168 78" stroke="#d6cfbf" stroke-width="2.2" fill="none"/></g>`;
    case 'stola':
      return `<g>${cloth('#c96f7c', 126)}${capyFolds('#a9525f', 124)}${hemLine(120, '#a9525f', 4)}${cloth('#2e7d78', 110, 212, 268)}<path d="M64 108 Q86 114 108 100" stroke="#e0b13a" stroke-width="2" fill="none"/></g>`;
    case 'lorica':
      return `<g>${cloth('#b3261e', 128)}${cloth('#b9c1cb', 112)}${[72, 85, 98, 111, 124, 137, 150, 163, 176].map((x) => `<path d="M${x} ${topY(x) + 1} V${n1(108 + 4 * (1 - ((x - 118) / 60) ** 2))}" stroke="#7d8692" stroke-width="1.6"/>`).join('')}<path d="M90 ${topY(90) + 3} Q118 ${topY(118) + 1} 150 ${topY(150) + 3}" stroke="#e3e8ee" stroke-width="2" fill="none" opacity=".8"/>${hemLine(110, '#5a3a20', 4)}${[80, 100, 120, 140, 160].map((x) => `<circle cx="${x}" cy="${n1(110 + 10 * (1 - ((x - 118) / 56) ** 2) / 2 + 2)}" r="1.4" fill="#e0b13a"/>`).join('')}</g>`;
    case 'linothorax':
      return `<g>${cloth('#2f4f8f', 128)}${cloth('#efe7d2', 108)}${hemLine(101, '#c8913a', 7)}${hemLine(101, '#a46f24', 1.2, ' stroke-dasharray="2 3"')}${[66, 74, 82, 90, 98, 106, 114, 122, 130, 138, 146, 154, 162, 170].map((x) => { const y = n1(106 + 10 * (1 - ((x - 118) / 56) ** 2) / 2); return `<rect x="${x - 3}" y="${y}" width="6" height="12" rx="1" fill="#efe7d2" stroke="#c9b98f" stroke-width=".8"/>`; }).join('')}</g>`;
    default:
      return '';
  }
}
// the capybara's cloak lies over its back, pinned near the neck
const CAPY_CLOAK_OVER = `<g><path d="M${onBody(222).join(' ')} Q104 58 ${onBody(276).join(' ')} Q140 64 146 74 L134 100 Q118 90 96 88 Z" fill="#9e1f1f"/><path d="M118 66 Q126 80 124 94 M132 70 Q138 82 136 96" stroke="#7a1414" stroke-width="2.2" fill="none"/><circle cx="107" cy="80" r="4.5" fill="#e0b13a" stroke="#b8862a" stroke-width="1.5"/></g>`;

// --- a two-wheeled chariot, side on, with the pole and yoke out in front
const wheel = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6b4226" stroke-width="4"/>${[0, 30, 60, 90, 120, 150].map((a) => { const t = (a * Math.PI) / 180, dx = n1(Math.cos(t) * r), dy = n1(Math.sin(t) * r); return `<path d="M${cx - dx} ${cy - dy} L${cx + dx} ${cy + dy}" stroke="#8a5a35" stroke-width="2"/>`; }).join('')}<circle cx="${cx}" cy="${cy}" r="4" fill="#e0b13a" stroke="#b8862a" stroke-width="1.5"/>`;
const UPRIGHT_CHARIOT = `<g><path d="M70 142 Q44 141 12 128" stroke="#6b4226" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="11" cy="127.5" r="3.6" fill="#e0b13a"/><path d="M64 146 L64 120 Q64 106 80 107 Q92 108 96 116 L128 119 Q136 121 136 130 L136 146 Z" fill="#b3261e"/><path d="M64 146 L64 120 Q64 106 80 107 Q92 108 96 116 L128 119 Q136 121 136 130 L136 146" fill="none" stroke="#e0b13a" stroke-width="2.5" stroke-linejoin="round"/><path d="M68 134 H133" stroke="#e0b13a" stroke-width="1.6"/>${meander(70, 132, 139.5, '#e0b13a')}<circle cx="77" cy="119" r="4" fill="#e0b13a"/>${wheel(110, 143, 14)}</g>`;
const CAPY_CHARIOT = `<g><path d="M44 142 Q30 140 8 130" stroke="#6b4226" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="7" cy="129.5" r="3.6" fill="#e0b13a"/><path d="M38 116 Q38 104 52 104 Q64 104 68 112 L176 112 Q190 113 190 126 L190 148 L38 148 Z" fill="#b3261e"/><path d="M38 148 L38 116 Q38 104 52 104 Q64 104 68 112 L176 112 Q190 113 190 126 L190 148" fill="none" stroke="#e0b13a" stroke-width="2.5" stroke-linejoin="round"/><path d="M42 134 H186" stroke="#e0b13a" stroke-width="1.6"/>${meander(44, 186, 140, '#e0b13a')}${wheel(132, 144, 15)}</g>`;

// --- clothes on the lion's round body (drawn under its arms; the mane hides the neckline)
const LT = 'M76 102 Q100 96 124 102 L129 136 Q100 141 71 136 Z';
const LSHORT = 'M76 102 Q100 96 124 102 L127 131 Q100 136 73 131 Z';
const LLONG = 'M76 102 Q100 96 124 102 L131 143 Q100 148 69 143 Z';
function lionClothes(kind) {
  const chiton = `<path d="${LLONG}" fill="#f3ecdc"/><path d="M88 108 L84 142 M100 110 V146 M112 108 L116 142" stroke="#d9cdb2" stroke-width="1.6" fill="none"/><path d="M70.5 139 Q100 144 129.5 139" stroke="#3b5ea8" stroke-width="4" fill="none"/>${meander(72, 128, 140.6, '#f3ecdc')}<path d="M77 116 Q100 121 123 116" stroke="#b08a4a" stroke-width="2.4" fill="none"/>`;
  switch (kind) {
    case 'chiton':
      return `<g>${chiton}</g>`;
    case 'himation':
      return `<g>${chiton}<path d="M112 100 Q125 101 127 112 L130 136 Q100 142 72 134 L73 124 Q100 120 112 100 Z" fill="#355c8c"/><path d="M73 124 Q100 120 112 100" stroke="#e0b13a" stroke-width="2" fill="none"/><path d="M80 132 Q104 128 120 108 M92 137 Q114 132 126 118" stroke="#28476d" stroke-width="1.8" fill="none"/></g>`;
    case 'toga':
      return `<g><path d="${LLONG}" fill="#f5f2ea"/><path d="M122 102 Q104 120 76 126 M126 114 Q108 132 80 136 M118 100 Q100 112 78 112" stroke="#d6cfbf" stroke-width="2.2" fill="none"/><path d="M88 140 Q100 136 116 141" stroke="#d6cfbf" stroke-width="1.6" fill="none"/></g>`;
    case 'stola':
      return `<g><path d="${LLONG}" fill="#c96f7c"/><path d="M88 112 L84 142 M100 114 V146 M112 112 L116 142" stroke="#a9525f" stroke-width="1.6" fill="none"/><path d="M70 140 Q100 145 130 140" stroke="#a9525f" stroke-width="3.5" fill="none"/><path d="M76 102 Q100 96 124 102 L126 114 Q100 122 74 114 Z" fill="#2e7d78"/><path d="M74 114 Q100 122 126 114" stroke="#e0b13a" stroke-width="1.8" fill="none"/><path d="M112 116 L120 115 L122 136 L114 137 Z" fill="#2e7d78"/></g>`;
    case 'lorica':
      return `<g><path d="${LSHORT}" fill="#b3261e"/><path d="M88 124 L86 132 M100 125 V134 M112 124 L114 132" stroke="#8f1c16" stroke-width="1.4"/><path d="M77 103 Q100 98 123 103 L125 122 Q100 127 75 122 Z" fill="#b9c1cb"/>${[108, 113, 118].map((y) => `<path d="M76 ${y} Q100 ${y + 5} 124 ${y}" stroke="#7d8692" stroke-width="1.4" fill="none"/>`).join('')}<path d="M75 122 Q100 127 125 122" stroke="#5a3a20" stroke-width="3.2" fill="none"/>${[92, 97, 103, 108].map((x) => `<rect x="${x - 1.2}" y="125" width="2.4" height="9" fill="#5a3a20"/><circle cx="${x}" cy="128" r="1" fill="#e0b13a"/><circle cx="${x}" cy="132" r="1" fill="#e0b13a"/>`).join('')}${[[90, 111], [100, 113], [110, 111]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#e0b13a" stroke="#b8862a" stroke-width="1"/>`).join('')}</g>`;
    case 'linothorax':
      return `<g><path d="${LSHORT}" fill="#2f4f8f"/><path d="M77 103 Q100 98 123 103 L124 119 Q100 124 76 119 Z" fill="#efe7d2"/><path d="M76.5 112 Q100 117 123.5 112 L124 119 Q100 124 76 119 Z" fill="#c8913a"/>${[80, 86, 92, 98, 104, 110, 116, 122].map((x) => `<path d="M${x - 3} ${x < 100 ? 115 : 116} q3 3 6 0" stroke="#a46f24" stroke-width="1" fill="none"/>`).join('')}${[78, 84, 90, 96, 102, 108, 114, 120].map((x) => `<rect x="${x}" y="${x < 98 || x > 104 ? 120 : 121}" width="5" height="9" rx="1" fill="#efe7d2" stroke="#c9b98f" stroke-width=".8"/>`).join('')}</g>`;
    default:
      return '';
  }
}

// --- the heroine ---------------------------------------------------------------------------------
// A young woman in a plain tunic, standing, drawn in the same 200×160 box with her feet at y 150.
// Head and face accessories are the capybara's, scaled onto her head (eyes land on her eyes).
const HERO_FACE = 'translate(61 3.5) scale(.62)';
const HERO_HAT = 'translate(56.5 -0.8) scale(.68)'; // a little bigger, to sit over her hair
// her head is drawn at a larger size and scaled down about the chin, which keeps her grown-up proportions
const HEAD_T = 'translate(100 70.5) scale(.86) translate(-100 -72)';
const shade = (hex, k) => `#${[1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('')}`;
const mix = (hex, to, k) => `#${[1, 3, 5].map((i) => { const a = parseInt(hex.slice(i, i + 2), 16), b = parseInt(to.slice(i, i + 2), 16); return Math.round(a + (b - a) * k).toString(16).padStart(2, '0'); }).join('')}`;
// head things that leave a bun or puff on top of the head showing
const KEEP_TOP = new Set(['laurel', 'olive', 'flower', 'bow', 'headphones']);

const FACE = 'M81.5 49 Q81.5 30 100 30 Q118.5 30 118.5 49 Q118.5 63 109 69 Q100 74 91 69 Q81.5 63 81.5 49 Z';
function hair(L, part, top) {
  const c = L.hair, d = shade(c, 0.72), hi = mix(c, '#ffffff', 0.22);
  const back = `<ellipse cx="100" cy="45" rx="21" ry="20" fill="${c}"/>`;
  const sleek = `<path d="M80.6 52 Q79 27 100 26 Q121 27 119.4 52 Q117 37 100 35 Q83 37 80.6 52 Z" fill="${c}"/><path d="M89 31 Q96 28 100 34 M111 31 Q104 28 100 34" stroke="${hi}" stroke-width="1" fill="none"/>`;
  const parted = `<path d="M80.6 54 Q78 27 100 25.5 Q122 27 119.4 54 Q117 39 103 34.5 L100 37 L97 34.5 Q83 39 80.6 54 Z" fill="${c}"/><path d="M98 28 Q90 30 85 40 M102 28 Q110 30 115 40" stroke="${hi}" stroke-width="1" fill="none"/>`;
  switch (L.style) {
    case 'braid':
      if (part === 'back') return back;
      if (part === 'front') return parted;
      return `<g>${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${n1(116.5 + i * 0.7)}" cy="${62 + i * 6.3}" rx="4.8" ry="4" transform="rotate(${i % 2 ? 28 : -28} ${n1(116.5 + i * 0.7)} ${62 + i * 6.3})" fill="${c}" stroke="${d}" stroke-width=".8"/>`).join('')}<path d="M118 102 q-1 7 -3 10 q4 -1 7 -9 Z" fill="${c}"/><circle cx="121" cy="103" r="2.6" fill="#3b5ea8"/></g>`;
    case 'bun':
      if (part === 'back') return back;
      if (part === 'front') return `${top ? `<circle cx="100" cy="20" r="9" fill="${c}"/><path d="M94 17 Q100 13 106 17" stroke="${hi}" stroke-width="1" fill="none"/>` : ''}${sleek}${top ? '<rect x="94" y="26.5" width="12" height="3" rx="1.5" fill="#d9a21b"/>' : ''}`;
      return '';
    case 'curls': {
      if (part === 'back') return `<g fill="${c}">${[[78, 40], [81, 29], [89, 22], [100, 20], [111, 22], [119, 29], [122, 40], [124, 51], [123, 62], [120, 72], [76, 51], [77, 62], [80, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join('')}<ellipse cx="100" cy="46" rx="22" ry="21"/></g>`;
      if (part === 'front') return `<g fill="${c}"><path d="M81 50 Q79 28 100 26 Q121 28 119 50 Q116 38 100 36 Q84 38 81 50 Z"/>${[[86, 33, 6], [94, 29, 6.5], [103, 28.5, 6.5], [111, 31, 6], [116.5, 37, 4.8], [83, 39, 4.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M88 31 q3 -3 6 0 M98 27 q3 -3 6 0 M107 30 q3 -3 6 0" stroke="${hi}" stroke-width="1" fill="none"/>`;
      return '';
    }
    case 'bob':
      if (part === 'back') return `<path d="M77.5 68 Q74 44 80 31 Q90 20 100 20.5 Q110 20 120 31 Q126 44 122.5 68 Q116 73 110 69 L90 69 Q84 73 77.5 68 Z" fill="${c}"/>`;
      if (part === 'front') return `<path d="M80.6 50 Q78.5 26 100 25 Q121.5 26 119.4 50 Q117.5 41.5 113 40.5 Q100 42.5 87 40.5 Q82.5 41.5 80.6 50 Z" fill="${c}"/><path d="M90 40.5 L91 31 M100 41.5 V30 M110 40.5 L109 31" stroke="${d}" stroke-width=".9"/>`;
      return '';
    case 'waves':
      if (part === 'back') return `<path d="M79 46 Q76 24 100 23.5 Q124 24 121 46 Q126 62 123 76 Q129 90 124 102 Q114 108 106 102 L94 102 Q86 108 76 102 Q71 90 77 76 Q74 62 79 46 Z" fill="${c}"/>`;
      if (part === 'front') return `<path d="M80.6 56 Q77 26 102 25 Q123 27 119.4 53 Q115 37 104 35 Q94 44 80.6 56 Z" fill="${c}"/><path d="M104 28 Q94 31 86 44" stroke="${hi}" stroke-width="1" fill="none"/>`;
      return `<g fill="${c}"><path d="M82 54 Q75 70 79 84 Q76 94 82 101 Q87 91 84 80 Q87 68 86 58 Z"/><path d="M118 54 Q125 70 121 84 Q124 94 118 101 Q113 91 116 80 Q113 68 114 58 Z"/></g><path d="M80 66 q-2 8 1 16 M120 66 q2 8 -1 16" stroke="${d}" stroke-width=".9" fill="none"/>`;
    case 'knot':
      if (part === 'back') return `${back}<circle cx="120" cy="59" r="8.5" fill="${c}"/><path d="M115 55 q5 -2 9 3" stroke="${hi}" stroke-width="1" fill="none"/>`;
      if (part === 'front') return `<path d="M80.6 54 Q78 27 100 25.5 Q122 27 119.4 54 Q118 42 110 38 Q104 36 100 38 Q96 36 90 38 Q82 42 80.6 54 Z" fill="${c}"/><path d="M98 28 Q90 30 86 38 M102 28 Q110 30 114 38" stroke="${hi}" stroke-width="1" fill="none"/><path d="M82 40 Q100 27.5 118 40" stroke="#3b5ea8" stroke-width="1.8" fill="none"/>`;
      return '';
    case 'puff':
      if (part === 'back') return back;
      if (part === 'front') return `${top ? `<g fill="${c}"><circle cx="100" cy="19" r="10"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<circle cx="${n1(100 + Math.cos((a * Math.PI) / 180) * 9)}" cy="${n1(19 + Math.sin((a * Math.PI) / 180) * 8)}" r="4.5"/>`).join('')}</g>` : ''}${sleek}${top ? '<rect x="93" y="26" width="14" height="3.5" rx="1.75" fill="#d63d74"/>' : ''}`;
      return '';
    case 'ponytail':
      if (part === 'back') return `${back}<path d="M108 27 Q134 25 131 50 Q129 66 135 83 Q121 77 120 58 Q120 41 106 34 Z" fill="${c}"/><path d="M127 46 Q125 62 130 76" stroke="${hi}" stroke-width="1" fill="none"/>`;
      if (part === 'front') return `${sleek}<rect x="110" y="25" width="6" height="4" rx="1.5" transform="rotate(30 113 27)" fill="#d63d74"/>`;
      return '';
    default:
      return '';
  }
}

function heroFace(mood, L) {
  const ink = '#2b2a33', lip = '#a2474a', brow = shade(L.hair === '#d9a84e' ? '#9a6a2a' : L.hair, 0.9);
  const eye = (x, dy = 0, dx = 0) => `<ellipse cx="${x + dx}" cy="${51 + dy}" rx="2.4" ry="3" fill="${ink}"/><circle cx="${x + dx + 0.8}" cy="${50 + dy}" r=".9" fill="#fff"/><path d="M${x - 3.2} 49.2 q3.2 -2.6 6.4 0" stroke="${ink}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  let eyes, brows, mouth, extra = '';
  if (mood === 'happy') {
    eyes = `<path d="M89 51.5 q3 -3.4 6 0 M105 51.5 q3 -3.4 6 0" stroke="${ink}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    brows = 'M87.5 43.5 q4.5 -2.6 9 0 M103.5 43.5 q4.5 -2.6 9 0';
    mouth = `<path d="M94.8 60 q5.2 6.6 10.4 0 Z" fill="${lip}"/><path d="M96.2 60.4 h7.6 q-.5 1.5 -1.2 1.8 h-5.2 q-.7 -.3 -1.2 -1.8 Z" fill="#fff"/>`;
  } else if (mood === 'thinking') {
    eyes = eye(92, -1.2, 1) + eye(108, -1.2, 1);
    brows = 'M87.5 42 q4.5 -3 9 -.4 M103.5 44 q4.5 -2 9 0';
    mouth = `<path d="M97 62 q3.5 -1.2 7 .6" stroke="${lip}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  } else if (mood === 'oops') {
    eyes = `<circle cx="92" cy="51.5" r="2.8" fill="${ink}"/><circle cx="108" cy="51.5" r="2.8" fill="${ink}"/><circle cx="92.9" cy="50.6" r="1" fill="#fff"/><circle cx="108.9" cy="50.6" r="1" fill="#fff"/>`;
    brows = 'M88 42.5 q4 -1.6 8.5 .6 M103.5 43.1 q4.5 -2.2 8.5 -.6';
    mouth = `<ellipse cx="100" cy="62.5" rx="2.2" ry="2.6" fill="${lip}"/>`;
    extra = '<path d="M123 36 q3 6 0 9 q-3 -3 0 -9z" fill="#7cc0ea"/>';
  } else {
    eyes = eye(92) + eye(108);
    brows = 'M87.5 44 q4.5 -2.4 9 0 M103.5 44 q4.5 -2.4 9 0';
    mouth = `<path d="M96.2 61.2 q3.8 2.8 7.6 0" stroke="${lip}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  }
  return `${eyes}<path d="${brows}" stroke="${brow}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M100 53.5 q1.6 3 -.8 4.4" stroke="${shade(L.skin, 0.78)}" stroke-width="1.1" fill="none" stroke-linecap="round"/><ellipse cx="87.5" cy="58" rx="3.4" ry="2" fill="#f08a8a" opacity=".35"/><ellipse cx="112.5" cy="58" rx="3.4" ry="2" fill="#f08a8a" opacity=".35"/>${mouth}${extra}`;
}

// her clothes: the body item, or a plain tunic when nothing is worn there
const BODICE = 'M83 81 Q100 77 117 81 L113.5 104 L86.5 104 Z';
const SKIRT = { mid: 'M86.5 102 L113.5 102 L121 135 Q100 138 79 135 Z', long: 'M86.5 102 L113.5 102 L123 146 Q100 149 77 146 Z', short: 'M86.5 102 L113.5 102 L120 128 Q100 131 80 128 Z' };
const sleeves = (fill, long = false, which = 'both') => (which !== 'left' ? `<path d="${long ? 'M84 80 Q76 82 74 103 L83 105 Q85 90 88 84 Z' : 'M84 80 Q77 82 76 96 L84.5 98 Q86 88 88 84 Z'}" fill="${fill}"/>` : '') + (which !== 'right' ? `<path d="${long ? 'M116 80 Q124 82 126 103 L117 105 Q115 90 112 84 Z' : 'M116 80 Q123 82 124 96 L115.5 98 Q114 88 112 84 Z'}" fill="${fill}"/>` : '');
const greaves = (fill, line) => `<path d="M93.5 130 V143 M106.5 130 V143" stroke="${fill}" stroke-width="7.5" stroke-linecap="round"/><path d="M92 132 V141 M105 132 V141" stroke="${line}" stroke-width="1.2" stroke-linecap="round"/>`;
function heroClothes(kind) {
  const chiton = (sl = true) => `${sl ? sleeves('#f3ecdc', true) : ''}<path d="${SKIRT.long}" fill="#f3ecdc"/><path d="${BODICE}" fill="#f3ecdc"/><path d="M92 107 L89 145 M100 108 V147 M108 107 L111 145" stroke="#d9cdb2" stroke-width="1.2" fill="none"/><path d="M86.5 99 Q100 106 113.5 99 L114 104 Q100 110 86 104 Z" fill="#e6dcc4"/><path d="M86.5 101 Q100 107 113.5 101" stroke="#b08a4a" stroke-width="1.8" fill="none"/><path d="M77.6 141.4 Q100 144.4 122.4 141.4" stroke="#3b5ea8" stroke-width="4" fill="none"/>${meander(80, 121, 142.6, '#f3ecdc')}<circle cx="83" cy="82.5" r="1.3" fill="#e0b13a"/><circle cx="79" cy="90" r="1.3" fill="#e0b13a"/><circle cx="117" cy="82.5" r="1.3" fill="#e0b13a"/><circle cx="121" cy="90" r="1.3" fill="#e0b13a"/>`;
  switch (kind) {
    case 'chiton':
      return chiton();
    case 'himation':
      return `${chiton()}${sleeves('#355c8c', true, 'left')}<path d="M104 79 Q117 76 121 84 Q125 100 127 138 Q104 144 77 137 L78 114 Q95 108 104 79 Z" fill="#355c8c"/><path d="M78 114 Q95 108 104 79" stroke="#e0b13a" stroke-width="1.8" fill="none"/><path d="M84 122 Q104 117 118 92 M88 132 Q108 127 123 105" stroke="#28476d" stroke-width="1.5" fill="none"/>`;
    case 'toga':
      return `${sleeves('#ece6d6', false, 'right')}${sleeves('#f5f2ea', true, 'left')}<path d="${SKIRT.long}" fill="#f5f2ea"/><path d="${BODICE}" fill="#f5f2ea"/><path d="M117 80 Q104 100 80 119 Q86 127 99 125 Q112 112 121 93 Z" fill="#ebe5d6"/><path d="M116 82 Q102 102 82 118 M119 90 Q106 110 90 123 M121 99 Q112 115 99 125" stroke="#d6cfbf" stroke-width="1.6" fill="none"/><path d="M84 130 Q100 136 118 130 M88 138 Q104 142 120 138" stroke="#d6cfbf" stroke-width="1.4" fill="none"/><path d="M95 95 q4 3 8 0" stroke="#d6cfbf" stroke-width="1.4" fill="none"/>`;
    case 'stola':
      return `${sleeves('#f1e9d8')}<path d="${SKIRT.long}" fill="#c96f7c"/><path d="${BODICE}" fill="#c96f7c"/><path d="M92 106 L89 145 M100 108 V147 M108 106 L111 145" stroke="#a9525f" stroke-width="1.2" fill="none"/><path d="M77.6 142.4 Q100 145.4 122.4 142.4" stroke="#a9525f" stroke-width="3.5" fill="none"/><path d="M93 80 Q100 86 107 80" stroke="#f1e9d8" stroke-width="2" fill="none"/><path d="M80 82 Q100 74 120 82 L124 97 Q100 106 76 97 Z" fill="#2e7d78"/><path d="M76 97 Q100 106 124 97" stroke="#e0b13a" stroke-width="1.6" fill="none"/><path d="M111 98 L121 97 L124 131 L114 133 Z" fill="#2e7d78"/><path d="M114 133 L124 131" stroke="#e0b13a" stroke-width="1.6"/><path d="M90 86 Q100 90 110 86" stroke="#22625e" stroke-width="1.4" fill="none"/>`;
    case 'lorica':
      return `${greaves('#c7ced6', '#eef1f5')}${sleeves('#b3261e')}<path d="${SKIRT.short}" fill="#b3261e"/><path d="M92 106 L90 127 M100 107 V129 M108 106 L110 127" stroke="#8f1c16" stroke-width="1.2"/><path d="${BODICE}" fill="#b9c1cb"/>${[88, 92.5, 97, 101.5].map((y) => `<path d="M${n1(83.4 + (y - 81) * 0.07)} ${y} Q100 ${y + 2} ${n1(116.6 - (y - 81) * 0.07)} ${y}" stroke="#7d8692" stroke-width="1.1" fill="none"/>`).join('')}<path d="M100 80 V87" stroke="#7d8692" stroke-width="1.1"/><path d="M83 79 Q75 81 75 93 L86 92 Q86 85 91 80 Z M117 79 Q125 81 125 93 L114 92 Q114 85 109 80 Z" fill="#c7ced6" stroke="#7d8692" stroke-width="1"/><path d="M77 86 L86 85.5 M123 86 L114 85.5" stroke="#7d8692" stroke-width="1"/>${[[93.5, 91], [100, 93.5], [106.5, 91]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#e0b13a" stroke="#b8862a" stroke-width=".9"/>`).join('')}<rect x="86.5" y="102" width="27" height="4" rx="1" fill="#5a3a20"/>${[95, 98.5, 102, 105.5].map((x) => `<rect x="${x - 1}" y="106" width="2" height="13" fill="#5a3a20"/><circle cx="${x}" cy="110" r=".9" fill="#e0b13a"/><circle cx="${x}" cy="115" r=".9" fill="#e0b13a"/>`).join('')}<circle cx="90" cy="104" r="1" fill="#e0b13a"/><circle cx="110" cy="104" r="1" fill="#e0b13a"/>`;
    case 'linothorax':
      return `${greaves('#c8913a', '#e8c26a')}${sleeves('#2f4f8f')}<path d="${SKIRT.short}" fill="#2f4f8f"/><path d="${BODICE}" fill="#efe7d2"/><path d="M85 95 L115 95 L113.5 104 L86.5 104 Z" fill="#c8913a"/>${[87, 92, 97, 102, 107, 112].map((x) => `<path d="M${x - 2.5} 98 q2.5 2.6 5 0 M${x} 101.5 q2.5 2.6 5 0" stroke="#a46f24" stroke-width=".8" fill="none"/>`).join('')}<path d="M85 80 L91 79.5 L92 90 L86 91 Z M115 80 L109 79.5 L108 90 L114 91 Z" fill="#e3d8bc" stroke="#c9b98f" stroke-width=".8"/><circle cx="89" cy="89" r="1.1" fill="#3b5ea8"/><circle cx="111" cy="89" r="1.1" fill="#3b5ea8"/><path d="M86.5 104 L113.5 104" stroke="#3b5ea8" stroke-width="1.6"/>${[85, 89.4, 93.8, 98.2, 102.6, 107, 111.4].map((x) => `<rect x="${x}" y="104.5" width="3.9" height="13" rx=".8" fill="#efe7d2" stroke="#c9b98f" stroke-width=".7"/>`).join('')}`;
    default: // the plain tunic she wears when nothing is chosen
      return `${sleeves('#3f7f99')}<path d="${SKIRT.mid}" fill="#3f7f99"/><path d="${BODICE}" fill="#3f7f99"/><path d="M93 106 L91 134 M107 106 L109 134" stroke="#326a80" stroke-width="1.2"/><path d="M93 80 Q100 86 107 80" stroke="#e8c26a" stroke-width="1.6" fill="none"/><path d="M79.4 132.6 Q100 135.6 120.6 132.6" stroke="#e8c26a" stroke-width="2" fill="none"/><rect x="86.5" y="101" width="27" height="4" rx="1.5" fill="#7a4a2a"/>`;
  }
}

// things on her back (drawn behind her), with the parts that show in front
function heroBack(kind) {
  switch (kind) {
    case 'cape': return '<path d="M86 80 Q70 112 68 146 Q100 151 132 146 Q130 112 114 80 Z" fill="#d62f3a"/><path d="M80 104 Q74 124 74 144" stroke="#a51d28" stroke-width="2.5" fill="none" opacity=".6"/>';
    case 'cloak': return '<path d="M84 80 Q68 112 64 148 Q100 154 136 148 Q132 112 116 80 Z" fill="#9e1f1f"/><path d="M73 112 Q69 130 70 146 M127 112 Q131 130 130 146" stroke="#7a1414" stroke-width="2.4" fill="none"/>';
    case 'backpack': return '<rect x="77" y="84" width="46" height="36" rx="10" fill="#2f74e8"/>';
    case 'wings': return `<g transform="translate(0 -14)">${lionBody('wings')}</g>`;
    case 'jetpack': return '<g><rect x="72" y="80" width="12" height="30" rx="5" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><rect x="116" y="80" width="12" height="30" rx="5" fill="#c7ced6" stroke="#8d96a3" stroke-width="2"/><path d="M73 110 l5 14 l5 -14 Z M117 110 l5 14 l5 -14 Z" fill="#ff8a3d"/><path d="M75.5 110 l2.5 8 l2.5 -8 Z M119.5 110 l2.5 8 l2.5 -8 Z" fill="#ffd166"/></g>';
    default: return '';
  }
}
const HERO_OVER = {
  // a Roman cloak is pinned at the right shoulder, leaving the sword arm free
  cloak: '<path d="M92 79 Q79 77 76 87 L80 99 Q83 88 91 84 Z" fill="#9e1f1f"/><circle cx="89" cy="82" r="3" fill="#e0b13a" stroke="#b8862a" stroke-width="1"/>',
  backpack: '<path d="M90 81 Q88 92 89 104 M110 81 Q112 92 111 104" stroke="#1f5cc4" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
  cape: '<path d="M86 80 Q100 86 114 80" stroke="#a51d28" stroke-width="2.4" fill="none"/>',
};
function heroFront(kind) {
  switch (kind) {
    case 'scarf': return '<g><path d="M87 76 Q100 86 113 76 L114 82 Q100 92 86 82 Z" fill="#4d8fd6"/><path d="M104 84 l2 22 l7 -1 l-2 -22 Z" fill="#3a74b5"/></g>';
    case 'bowtie': return '<g transform="translate(100 81) scale(.7)"><path d="M0 0 L-13 -8 L-13 8 Z M0 0 L13 -8 L13 8 Z" fill="#d62f3a"/><circle r="4" fill="#a51d28"/></g>';
    case 'medal': return `<g><path d="M92 80 L100 97 L108 80" stroke="#2f74e8" stroke-width="3.5" fill="none"/><circle cx="100" cy="100" r="6" fill="#ffd166" stroke="#d9a21b" stroke-width="2"/>${star(100, 100, 3.4, '#d9a21b')}</g>`;
    default: return '';
  }
}
function heroRide(kind) {
  if (kind === 'scooter') return '<g><rect x="56" y="146" width="84" height="6" rx="3" fill="#d62f3a"/><path d="M62 148 L69 113" stroke="#8d96a3" stroke-width="4"/><path d="M61 113 h16" stroke="#2b2a33" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="155" r="4" fill="#2b2a33"/><circle cx="134" cy="155" r="4" fill="#2b2a33"/></g>';
  if (kind === 'chariot') return '';
  return accessory(kind, { lion: true });
}

function heroineSVG(L, worn, layer, mood, title) {
  const one = (slot) => layer([slot])[0];
  const body = one('body'), hold = one('hold'), hand = one('hand'), back = one('back'), ride = one('ride'), headThing = one('head');
  const top = !headThing || KEEP_TOP.has(headThing);
  const skin = L.skin, skinD = shade(skin, 0.86);
  const riding = !!ride;
  const scaled = (slots) => layer(slots).map((a) => `<g transform="${slots[0] === 'face' ? HERO_FACE : HERO_HAT}">${accessory(a, {})}</g>`).join('');
  const shield = hand ? (hand === 'shield' ? `<g transform="translate(129 108) scale(.8) translate(-152 -104)">${accessory('shield', {})}</g>` : `<g transform="translate(129 108) scale(.8)">${SHIELDS[hand]}</g>`) : '';
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="${riding ? 158 : 151}" rx="${riding ? 52 : 30}" ry="${riding ? 5 : 4}" fill="#000" opacity=".08"/>
  ${back ? heroBack(back) : ''}
  ${ride ? heroRide(ride) : ''}
  <g transform="${HEAD_T}">${hair(L, 'back', top)}</g>
  <path d="M94 126 V145 M106 126 V145" stroke="${skin}" stroke-width="6.5" stroke-linecap="round"/>
  <ellipse cx="93" cy="146.6" rx="4.6" ry="2.4" fill="${skin}"/><ellipse cx="107" cy="146.6" rx="4.6" ry="2.4" fill="${skin}"/>
  <path d="M88 149 h10 M102 149 h10" stroke="#7a4a2a" stroke-width="2.2" stroke-linecap="round"/><path d="M90 146.5 L96 144 M104 144 L110 146.5 M94 142 v3 M106 142 v3" stroke="#7a4a2a" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M85 83 Q78 99 74.5 116" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M115 83 Q122 99 125.5 116" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="74.5" cy="117.5" r="4.3" fill="${skin}"/><circle cx="125.5" cy="117.5" r="4.3" fill="${skin}"/>
  <rect x="95.5" y="64" width="9" height="18" rx="3" fill="${skinD}"/>
  ${heroClothes(body)}
  ${back && HERO_OVER[back] ? HERO_OVER[back] : ''}
  ${ride === 'chariot' ? UPRIGHT_CHARIOT : ''}
  ${layer(['front']).map(heroFront).join('')}
  <g transform="${HEAD_T}">
  <ellipse cx="81.6" cy="52" rx="2.8" ry="4.2" fill="${skinD}"/><ellipse cx="118.4" cy="52" rx="2.8" ry="4.2" fill="${skinD}"/>
  <path d="${FACE}" fill="${skin}"/>
  ${heroFace(mood, L)}
  ${hair(L, 'front', top)}
  ${hair(L, 'over', top)}
  ${scaled(['face'])}
  ${scaled(['head'])}
  </g>
  ${hold ? `<g transform="translate(74.5 117.5)">${HOLD[hold]}</g><circle cx="74.5" cy="117.5" r="4.3" fill="${skin}"/><path d="M71 116 h6" stroke="${skinD}" stroke-width="1" stroke-linecap="round"/>` : ''}
  ${shield}
</svg>`;
}

/** A head-and-shoulders picture of one of the heroine's looks, for the picker. */
export const lookThumb = (look) => capybaraSVG({ species: 'heroine', look, mood: 'happy', title: LOOKS[look]?.label }).replace('viewBox="0 0 200 160"', 'viewBox="68 4 64 64"');

export function capybaraEl(opts, className = 'capy') {
  const wrap = document.createElement('div');
  wrap.className = className;
  wrap.innerHTML = capybaraSVG({ fit: true, ...opts });

  return wrap;
}

// friendly names and facts for whichever animal it is
export const companionNoun = (species) => ({ lion: 'lion', heroine: 'heroine' })[species] || 'capybara';
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
  // true stories of women from ancient Greece and Rome
  heroine: [
    'Sappho, a poet who lived on the Greek island of Lesbos around 600 BC, was so admired that later Greeks called her the Tenth Muse.',
    'Hypatia taught mathematics, astronomy and philosophy in Alexandria, in Egypt, about 1,600 years ago.',
    'Hipparchia was a Greek philosopher who chose to live simply and argued about ideas in public, more than 2,300 years ago.',
    'In one of Plato’s dialogues, Socrates says that Aspasia, a clever woman from Miletus who lived in Athens, taught him how to make speeches.',
    'Cynisca, a Spartan princess, was the first woman to win at the Olympic Games: her four-horse chariot team won in 396 BC.',
    'In 42 BC, Hortensia spoke in the Roman Forum against an unfair tax on wealthy women, and the tax was cut back.',
    'Six short poems by Sulpicia, written in Rome over 2,000 years ago, are among the very few by a Roman woman to survive.',
    'At Olympia, girls ran their own races at the Heraia, a festival for the goddess Hera, on a track a little shorter than the men’s.',
    'The Greek writer Pausanias tells how the poet Telesilla led the women of Argos to defend their city against Sparta.',
  ],
};

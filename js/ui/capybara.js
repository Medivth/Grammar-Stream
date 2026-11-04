// The companion, drawn as SVG: a capybara, an upright cartoon lion, a young heroine (Years 6 and 8)
// or a boy hero (Years 2 and 3). Never decays, never dies; just changes mood. Accessories sit in
// slots (head, face, body, front, back, hold, hand, friend, beside, ride), one per slot, so a helmet,
// armour, a cloak, a sword and a shield can be worn together. Riders (a horse, a rocket, a dragon…)
// carry the whole companion: see MOUNTS. The prize lamps (`lamp`, `oillamp`) light up unless
// `lit: false`, and sit in a `.companion-lamp` group so a screen can catch a tap on them.

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

export const SPECIES = { capybara: 'Capybara', lion: 'Lion', heroine: 'Heroine', hero: 'Hero' };
/** The two people (the others are animals): they have looks instead of fur. */
export const isPerson = (species) => species === 'heroine' || species === 'hero';
/** The companions a course offers at setup (Years 6 and 8 add the heroine, Years 2 and 3 the hero). */
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
// The hero's looks: a boy of about nine, a little older than the child who chooses him.
export const HERO_LOOKS = {
  crop: { label: 'Brown crop', skin: '#f1c9a5', hair: '#6b4226', style: 'crop' },
  spiky: { label: 'Blond spikes', skin: '#f6d8c0', hair: '#d9a84e', style: 'spiky' },
  curly: { label: 'Black curls', skin: '#7a4a2e', hair: '#1d1411', style: 'curly' },
  mop: { label: 'Ginger mop', skin: '#f7dcc6', hair: '#b5562a', style: 'mop', freckles: true },
  side: { label: 'Side parting', skin: '#d9a47a', hair: '#231915', style: 'side' },
  buzz: { label: 'Buzz cut', skin: '#5c3a26', hair: '#17110e', style: 'buzz' },
  quiff: { label: 'Brown quiff', skin: '#c98d62', hair: '#3a2419', style: 'quiff' },
  twists: { label: 'Short coils', skin: '#8d5838', hair: '#2a1a12', style: 'twists' },
};
/** The looks for a person companion, and the one to fall back on. */
export const looksOf = (species) => (species === 'hero' ? HERO_LOOKS : LOOKS);
const lookOf = (species, look) => looksOf(species)[look] || Object.values(looksOf(species))[0];

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
  // Years 2 and 3: racing, space, superheroes, dinosaurs and knights
  racesuit: 'Racing overalls',
  flag: 'Chequered flag',
  trophy: 'Winner’s trophy',
  gokart: 'Go-kart',
  spacesuit: 'Astronaut suit',
  saturn: 'Toy Saturn',
  alien: 'Alien friend',
  rocket: 'Rocket',
  herosuit: 'Hero suit',
  heroshield: 'Hero shield',
  dinohood: 'Dinosaur hood',
  fossilhammer: 'Fossil hammer',
  babydino: 'Baby dinosaur',
  dinoride: 'Dinosaur to ride',
  armour: 'Knight’s armour',
  sword: 'Knight’s sword',
  crestshield: 'Crest shield',
  horse: 'Knight’s horse',
  // Year 6: art, science, books, music and the outdoors (and the Roman things above)
  beret: 'Artist’s beret',
  palette: 'Paint palette',
  paintbrush: 'Paintbrush',
  flowercrown: 'Flower crown',
  sunhat: 'Sun hat',
  headband: 'Headband',
  camera: 'Camera',
  telescope: 'Telescope',
  microscope: 'Microscope',
  book: 'Favourite book',
  violin: 'Violin',
  cat: 'Cat friend',
  fox: 'Fox friend',
  rollerskates: 'Roller skates',
  bicycle: 'Bicycle',
  pony: 'Pony',
  // Years 2 and 3, all earned: laser swords, armour from space, robots, dragons and history, and more
  laserblue: 'Blue laser sword',
  lasergreen: 'Green laser sword',
  laserred: 'Red laser sword',
  laserpurple: 'Purple laser sword',
  troopersuit: 'Space trooper armour',
  mecharmour: 'Robot armour',
  dragonarmour: 'Dragon-scale armour',
  vikingarmour: 'Viking armour',
  vikinghelmet: 'Viking helmet',
  samurai: 'Samurai armour',
  kabuto: 'Kabuto helmet',
  goldarmour: 'Golden champion armour',
  energyshield: 'Energy shield',
  hoverboard: 'Hoverboard',
  dragon: 'Dragon to ride',
  // Year 6, all earned: dressing up through history, on stage, in the lab and beyond
  tudorgown: 'Tudor gown',
  regency: 'Regency dress',
  victorian: 'Victorian dress',
  bonnet: 'Victorian bonnet',
  ballgown: 'Ball gown',
  tutu: 'Ballet tutu',
  labcoat: 'Lab coat',
  detective: 'Detective’s coat',
  deerstalker: 'Deerstalker cap',
  explorerkit: 'Explorer’s outfit',
  wizardrobe: 'Wizard’s robe',
  fairywings: 'Fairy wings',
  tiara: 'Tiara',
  // prizes for finishing a bonus topic (the lamps light up when tapped)
  lamp: 'Desk lamp',
  firstaid: 'First-aid kit',
  oillamp: 'Florence’s lantern',
};

export const SLOT = {
  glasses: 'face', sunglasses: 'face', goggles: 'face', mask: 'face', starglasses: 'face',
  scarf: 'front', bowtie: 'front', medal: 'front', camera: 'front',
  chiton: 'body', himation: 'body', toga: 'body', stola: 'body', linothorax: 'body', lorica: 'body',
  racesuit: 'body', spacesuit: 'body', herosuit: 'body', armour: 'body',
  troopersuit: 'body', mecharmour: 'body', dragonarmour: 'body', vikingarmour: 'body', samurai: 'body', goldarmour: 'body',
  tudorgown: 'body', regency: 'body', victorian: 'body', ballgown: 'body', tutu: 'body', labcoat: 'body', detective: 'body', explorerkit: 'body', wizardrobe: 'body',
  fairywings: 'back', energyshield: 'hand', firstaid: 'hand', hoverboard: 'ride', dragon: 'ride',
  laserblue: 'hold', lasergreen: 'hold', laserred: 'hold', laserpurple: 'hold', oillamp: 'hold', lamp: 'beside',
  cape: 'back', backpack: 'back', wings: 'back', jetpack: 'back', cloak: 'back',
  shield: 'hand', aspis: 'hand', scutum: 'hand', heroshield: 'hand', crestshield: 'hand', palette: 'hand',
  dory: 'hold', xiphos: 'hold', gladius: 'hold', lyre: 'hold', scroll: 'hold', olivebranch: 'hold', torch: 'hold',
  flag: 'hold', trophy: 'hold', saturn: 'hold', fossilhammer: 'hold', sword: 'hold',
  paintbrush: 'hold', telescope: 'hold', microscope: 'hold', book: 'hold', violin: 'hold',
  alien: 'friend', babydino: 'friend', cat: 'friend', fox: 'friend',
  skateboard: 'ride', scooter: 'ride', surfboard: 'ride', chariot: 'ride',
  gokart: 'ride', rocket: 'ride', dinoride: 'ride', horse: 'ride', rollerskates: 'ride', bicycle: 'ride', pony: 'ride',
};
export const slotOf = (id) => SLOT[id] || 'head';
/** How the wardrobe groups its slots. */
export const SLOT_GROUPS = [['Head', ['head']], ['Face', ['face']], ['Clothes', ['body', 'front']], ['Hands', ['hold', 'hand']], ['Back', ['back']], ['Friends', ['friend']], ['Beside you', ['beside']], ['Ride', ['ride']]];
// a big wardrobe is split a little further: prizes first, then armour and dressing-up apart from everyday clothes
export const PRIZES = new Set(['lamp', 'firstaid', 'oillamp']);
const ARMOUR = new Set(['armour', 'lorica', 'linothorax', 'troopersuit', 'mecharmour', 'dragonarmour', 'vikingarmour', 'samurai', 'goldarmour']);
const DRESSING_UP = new Set(['tudorgown', 'regency', 'victorian', 'ballgown', 'tutu', 'labcoat', 'detective', 'explorerkit', 'wizardrobe']);
const LASERS = new Set(['laserblue', 'lasergreen', 'laserred', 'laserpurple']);
export const WARDROBE_GROUPS = ['Prizes', 'Head', 'Face', 'Clothes', 'Dressing up', 'Armour', 'Laser swords', 'Hands', 'Back', 'Friends', 'Beside you', 'Ride'];
/** Which wardrobe group an accessory is shown in. */
export function wardrobeGroup(id) {
  if (PRIZES.has(id)) return 'Prizes';
  if (ARMOUR.has(id)) return 'Armour';
  if (DRESSING_UP.has(id)) return 'Dressing up';
  if (LASERS.has(id)) return 'Laser swords';
  return SLOT_GROUPS.find(([, slots]) => slots.includes(slotOf(id)))[0];
}

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
    case 'hoverboard':
      return hoverboard(f.lion);
    case 'fairywings':
      return `<g>${FAIRY_WING}<path d="M126 68 Q140 40 152 26 M128 70 Q152 58 174 52" stroke="#a58be0" stroke-width="1.2" fill="none"/></g>`;
    case 'lamp':
      return `<g transform="translate(128 149) scale(.8)">${deskLamp()}</g>`;
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
      if (SHIELDS[kind]) return `<g transform="translate(152 104)">${SHIELDS[kind]}</g>`;
      if (FRIENDS[kind]) return `<g transform="${FRIEND_AT.capybara}">${FRIENDS[kind]}</g>`; // capybaras let other animals sit on them
      if (HEADWEAR[kind]) return kind === 'headband' && !f.mane && f.body ? `<g transform="translate(0 8)">${HEADWEAR[kind]}</g>` : HEADWEAR[kind];
      if (kind === 'camera') return camera(92, 131, 1);
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

// whether the prize lamps are on (set for the length of one capybaraSVG call)
let LIT = true;

/** Returns an SVG string for the companion (species from opts.species, default capybara). */
export function capybaraSVG({ species, fur = 'caramel', look, accessory: acc = 'none', wear, mood = 'neutral', title, fit = false, lit = true } = {}) {
  species ||= COURSE.young ? 'lion' : 'capybara';
  LIT = lit !== false;
  const worn = wornList({ wear, accessory: acc });
  const mount = worn.find((a) => MOUNTS[a]);
  if (mount) return mountedSVG(mount, species, { fur, look, mood, title, lit, wear: Object.fromEntries(worn.filter((a) => a !== mount).map((a) => [slotOf(a), a])) }, fit);
  const layer = (slots) => worn.filter((a) => slots.includes(slotOf(a)));
  if (species === 'lion') return lionSVG(LION_FURS[fur] || LION_FURS.caramel, worn, layer, mood, title || 'Lion');
  if (isPerson(species)) {
    const svg = heroineSVG(lookOf(species, look), worn, layer, mood, title || SPECIES[species], species === 'hero');
    // standing, a person is narrow: on their own (not in a scene) they are framed more closely, unless the chariot or the lamp needs the room
    return fit && !worn.includes('chariot') && !worn.includes('lamp') ? svg.replace('viewBox="0 0 200 160"', 'viewBox="30 0 140 160"') : svg;
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
  ${draw(['front', 'hand', 'hold', 'beside'])}
  ${draw(['friend'])}
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
  ${draw(['front', 'hand', 'beside'])}
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
  ${draw(['friend'])}
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
    case 'hoverboard':
      return accessory(kind, { ...f, lion: true });
    case 'fairywings':
      return `<g>${FAIRY_PAIR}<g transform="translate(200 0) scale(-1 1)">${FAIRY_PAIR}</g></g>`;
    case 'lamp':
      return `<g transform="translate(38 150) scale(.85)">${deskLamp()}</g>`;
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
      if (SHIELDS[kind]) return `<g transform="translate(134 120) scale(.7)">${SHIELDS[kind]}</g>`;
      if (FRIENDS[kind]) return `<g transform="${FRIEND_AT.lion}">${FRIENDS[kind]}</g>`;
      if (kind === 'camera') return camera(100, 121, 0.8);
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
      return SUITS[kind] ? SUITS[kind].capy() : '';
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
      return SUITS[kind] ? SUITS[kind].lion() : '';
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
const KEEP_TOP = new Set(['laurel', 'olive', 'flower', 'bow', 'headphones', 'flowercrown', 'headband']);

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
function heroClothes(kind, boy = false) {
  if (SUITS[kind]) return SUITS[kind].heroine();
  if (!kind && boy) return TEE_AND_SHORTS;
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
    case 'fairywings': return `<g transform="translate(100 84) scale(.78) translate(-100 -106)">${lionBody('fairywings')}</g>`;
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
    case 'camera': return camera(100, 97, 0.6, 'M90 80 Q92 92 96 94 M110 80 Q108 92 104 94');
    default: return '';
  }
}
function heroRide(kind) {
  if (kind === 'scooter') return '<g><rect x="56" y="146" width="84" height="6" rx="3" fill="#d62f3a"/><path d="M62 148 L69 113" stroke="#8d96a3" stroke-width="4"/><path d="M61 113 h16" stroke="#2b2a33" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="155" r="4" fill="#2b2a33"/><circle cx="134" cy="155" r="4" fill="#2b2a33"/></g>';
  if (kind === 'chariot') return '';
  return accessory(kind, { lion: true });
}

// the hero, a boy of about nine: a slightly bigger head on the same body, so everything she wears fits him too
const BOY_HEAD_T = 'translate(100 71) scale(.92) translate(-100 -72)';
const BOY_FACE = 'M81 48 Q81 29 100 29 Q119 29 119 48 Q119.5 62 110.5 69 Q100 74.5 89.5 69 Q80.5 62 81 48 Z';

function heroineSVG(L, worn, layer, mood, title, boy = false) {
  const one = (slot) => layer([slot])[0];
  const body = one('body'), hold = one('hold'), hand = one('hand'), back = one('back'), ride = one('ride'), headThing = one('head'), friend = one('friend'), beside = one('beside');
  const top = !headThing || KEEP_TOP.has(headThing);
  const skin = L.skin, skinD = shade(skin, 0.86);
  const riding = !!ride;
  const headT = boy ? BOY_HEAD_T : HEAD_T;
  const scaled = (slots) => layer(slots).map((a) => `<g transform="${slots[0] === 'face' ? HERO_FACE : HERO_HAT}">${accessory(a, {})}</g>`).join('');
  const shield = hand ? (hand === 'shield' ? `<g transform="translate(129 108) scale(.8) translate(-152 -104)">${accessory('shield', {})}</g>` : `<g transform="translate(129 108) scale(.8)">${SHIELDS[hand]}</g>`) : '';
  const legs = boy
    ? `<path d="M94 120 V143 M106 120 V143" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><path d="M94 138.5 V143 M106 138.5 V143" stroke="#f4f7ff" stroke-width="7.4"/>${BOOTS[body] || body === 'detective' ? '' : TRAINERS}`
    : `<path d="M94 126 V145 M106 126 V145" stroke="${skin}" stroke-width="6.5" stroke-linecap="round"/>
  <ellipse cx="93" cy="146.6" rx="4.6" ry="2.4" fill="${skin}"/><ellipse cx="107" cy="146.6" rx="4.6" ry="2.4" fill="${skin}"/>
  <path d="M88 149 h10 M102 149 h10" stroke="#7a4a2a" stroke-width="2.2" stroke-linecap="round"/><path d="M90 146.5 L96 144 M104 144 L110 146.5 M94 142 v3 M106 142 v3" stroke="#7a4a2a" stroke-width="1.2" stroke-linecap="round"/>`;
  const hairOf = boy ? boyHair : hair;
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="${riding ? 158 : 151}" rx="${riding ? 52 : 30}" ry="${riding ? 5 : 4}" fill="#000" opacity=".08"/>
  ${back ? heroBack(back) : ''}
  ${ride ? heroRide(ride) : ''}
  <g transform="${headT}">${hairOf(L, 'back', top)}</g>
  ${legs}
  <path d="M85 83 Q78 99 74.5 116" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M115 83 Q122 99 125.5 116" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="74.5" cy="117.5" r="4.3" fill="${skin}"/><circle cx="125.5" cy="117.5" r="4.3" fill="${skin}"/>
  <rect x="95.5" y="64" width="9" height="18" rx="3" fill="${skinD}"/>
  ${heroClothes(body, boy)}
  ${back && HERO_OVER[back] ? HERO_OVER[back] : ''}
  ${ride === 'chariot' ? UPRIGHT_CHARIOT : ''}
  ${layer(['front']).map(heroFront).join('')}
  <g transform="${headT}">
  <ellipse cx="${boy ? 81.2 : 81.6}" cy="52" rx="${boy ? 3.2 : 2.8}" ry="4.4" fill="${skinD}"/><ellipse cx="${boy ? 118.8 : 118.4}" cy="52" rx="${boy ? 3.2 : 2.8}" ry="4.4" fill="${skinD}"/>
  <path d="${boy ? BOY_FACE : FACE}" fill="${skin}"/>
  ${boy ? boyFace(mood, L) : heroFace(mood, L)}
  ${hairOf(L, 'front', top)}
  ${hairOf(L, 'over', top)}
  ${scaled(['face'])}
  ${scaled(['head'])}
  </g>
  ${hold ? `<g transform="translate(74.5 117.5)">${HOLD[hold]}</g><circle cx="74.5" cy="117.5" r="4.3" fill="${skin}"/><path d="M71 116 h6" stroke="${skinD}" stroke-width="1" stroke-linecap="round"/>` : ''}
  ${shield}
  ${beside === 'lamp' ? `<g transform="translate(158 150) scale(.8)">${deskLamp()}</g>` : ''}
  ${friend ? `<g transform="${FRIEND_AT.heroine}">${FRIENDS[friend]}</g>` : ''}
</svg>`;
}

// --- the Years 2/3 and Year 6 wardrobe ----------------------------------------------------------
// Hats in the capybara's head coordinates (moved onto the lion's and the heroine's heads, like the
// others); things to hold gripped at (0, 0); shields and the palette centred on (0, 0); friends
// standing with their feet at (0, 0).

const flower5 = (x, y, r, col, mid = '#ffd54f') => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => { const t = ((a - 90) * Math.PI) / 180; return `<circle cx="${n1(Math.cos(t) * r)}" cy="${n1(Math.sin(t) * r)}" r="${n1(r * 0.75)}" fill="${col}"/>`; }).join('')}<circle r="${n1(r * 0.55)}" fill="${mid}"/></g>`;
const onArc = (deg, cx, cy, rx, ry) => { const t = (deg * Math.PI) / 180; return [n1(cx + Math.cos(t) * rx), n1(cy + Math.sin(t) * ry)]; };
const bolt = (x, y, s, fill, more = '') => `<path d="M2 -7 L-4 1 L0 1 L-2 7 L4 -1 L0 -1 Z" transform="translate(${x} ${y}) scale(${s})" fill="${fill}" stroke-linejoin="round"${more}/>`;
const numberSeven = (x, y, size, fill) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="${size}" fill="${fill}">7</text>`;
const crownBadge = (x, y, s) => `<path d="M-7 4 L-7 -4 L-3.5 -0.5 L0 -6 L3.5 -0.5 L7 -4 L7 4 Z" transform="translate(${x} ${y}) scale(${s})" fill="#ffd166" stroke="#d9a21b" stroke-width="1" stroke-linejoin="round"/>`;

const DINO_HOOD_BRIM = (x) => n1(70 - 24 * ((x - 24) / 80) * (1 - (x - 24) / 80));
const HEADWEAR = {
  // a dinosaur hood: spikes along the top, eyes above his and a row of soft teeth round the brim
  dinohood: `<g>${[203, 226, 249, 272, 295, 318, 340].map((a) => { const [x, y] = onArc(a, 64, 68, 40, 45); return `<path d="M-6 3 L0 -10 L6 3 Z" transform="translate(${x} ${y}) rotate(${a + 90})" fill="#ffb13d"/>`; }).join('')}<path d="M24 70 Q22 22 64 21 Q106 22 104 70 Q64 58 24 70 Z" fill="#5cae4a"/><circle cx="64" cy="31" r="4" fill="#7cc76b"/><circle cx="34" cy="52" r="3" fill="#7cc76b"/><circle cx="95" cy="50" r="3.4" fill="#7cc76b"/><circle cx="46" cy="40" r="7.5" fill="#fff"/><circle cx="82" cy="40" r="7.5" fill="#fff"/><circle cx="48" cy="41" r="3.6" fill="#2b2a33"/><circle cx="80" cy="41" r="3.6" fill="#2b2a33"/><circle cx="49" cy="39.6" r="1.2" fill="#fff"/><circle cx="81" cy="39.6" r="1.2" fill="#fff"/><path d="M38 31 q8 -5 15 0 M75 31 q8 -5 15 0" stroke="#3f8a35" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[33, 43, 53, 63, 73, 83, 93].map((x) => `<path d="M${x - 4} ${DINO_HOOD_BRIM(x) - 1} L${x} ${DINO_HOOD_BRIM(x) + 6} L${x + 4} ${DINO_HOOD_BRIM(x) - 1} Z" fill="#fff"/>`).join('')}<path d="M24 70 Q64 58 104 70" stroke="#3f8a35" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
  beret: `<g><path d="M28 58 Q20 40 50 32 Q86 25 103 44 Q108 54 97 58 Q64 64 28 58 Z" fill="#b3264b"/><path d="M42 40 Q62 32 84 35" stroke="#d04a6a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M30 56 Q64 62 98 55" stroke="#8a1a38" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M61 31 q-1 -6 4 -9" stroke="#8a1a38" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
  sunhat: `<g><ellipse cx="64" cy="55" rx="54" ry="11" fill="#f0cf7a" stroke="#d6ae4f" stroke-width="2"/><path d="M20 56 Q64 66 108 56" stroke="#d6ae4f" stroke-width="1.2" fill="none"/><path d="M38 55 Q37 27 64 27 Q91 27 90 55 Z" fill="#f5d98a"/><path d="M45 37 Q64 32 83 37 M41 43 Q64 38 87 43" stroke="#e2bd62" stroke-width="1.2" fill="none"/><path d="M38.2 47 Q64 53 89.8 47 L90 55 Q64 61 38 55 Z" fill="#ff7aa8"/>${flower5(86, 49, 4.2, '#fff')}${flower5(78, 52, 3, '#ffd54f', '#f2a533')}</g>`,
  flowercrown: `<g><path d="M25 70 Q27 41 64 40 Q101 41 103 70" stroke="#5c9a3c" stroke-width="2.4" fill="none"/>${[209, 229, 249, 269, 289, 309, 329].map((a) => { const [x, y] = onArc(a, 64, 70, 40, 30); return `<ellipse cx="${x}" cy="${y}" rx="6" ry="2.6" transform="rotate(${a + 60} ${x} ${y})" fill="#6fae4c"/>`; }).join('')}${[[200, '#f48fb1'], [220, '#fff'], [240, '#ffd54f'], [260, '#b39ddb'], [280, '#f48fb1'], [300, '#81d4fa'], [320, '#fff'], [340, '#ffd54f']].map(([a, c]) => { const [x, y] = onArc(a, 64, 70, 40, 30); return flower5(x, y, 4, c, c === '#ffd54f' ? '#f2a533' : '#ffd54f'); }).join('')}</g>`,
  headband: `<g><path d="M29 67 Q27 37 64 37 Q101 37 99 67" stroke="#2e9e8f" stroke-width="7" fill="none" stroke-linecap="round"/>${[[29, 27, 64, 67, 37, 37], [64, 101, 99, 37, 37, 67]].flatMap(([x0, xc, x1, y0, yc, y1]) => [0.25, 0.55, 0.85].map((t) => `<circle cx="${n1((1 - t) ** 2 * x0 + 2 * t * (1 - t) * xc + t * t * x1)}" cy="${n1((1 - t) ** 2 * y0 + 2 * t * (1 - t) * yc + t * t * y1)}" r="1.5" fill="#fff"/>`)).join('')}<g transform="translate(87 43) rotate(38)"><path d="M0 0 L-9 -6 L-9 6 Z M0 0 L9 -6 L9 6 Z" fill="#2e9e8f"/><circle r="3" fill="#24806f"/></g></g>`,
};

const chequer = (x, y, cols, rows, sz) => { let d = ''; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if ((r + c) % 2 === 0) d += `M${x + c * sz} ${y + r * sz}h${sz}v${sz}h${-sz}Z`; return `<rect x="${x}" y="${y}" width="${cols * sz}" height="${rows * sz}" fill="#fff" stroke="#2b2a33" stroke-width="1"/><path d="${d}" fill="#2b2a33"/>`; };
Object.assign(HOLD, {
  flag: `<path d="M0 8 V-60" stroke="#8d96a3" stroke-width="3" stroke-linecap="round"/><g transform="translate(-1.5 -59) scale(-1 1) skewY(9)">${chequer(0, 0, 6, 4, 6)}</g><circle cy="-61.5" r="2.8" fill="#ffd166"/>`,
  trophy: `<rect x="-11" y="2" width="22" height="7" rx="2" fill="#7a4a2a"/><rect x="-8" y="-1.5" width="16" height="4" rx="1.5" fill="#e0b037"/><path d="M-2.5 -1 L-2.5 -11 L2.5 -11 L2.5 -1 Z" fill="#e0b037"/><path d="M-12 -31 Q-18 -31 -17 -24 Q-16 -17 -8 -16 M12 -31 Q18 -31 17 -24 Q16 -17 8 -16" stroke="#e0b037" stroke-width="3" fill="none"/><path d="M-13.5 -35 H13.5 Q13.5 -14 0 -10 Q-13.5 -14 -13.5 -35 Z" fill="#ffd166" stroke="#d9a21b" stroke-width="1.5"/>${star(0, -24, 5.5, '#d9a21b')}<path d="M-8.5 -31 Q-8.5 -21 -4.5 -16.5" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`,
  saturn: `<path d="M0 6 V-17" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/><g transform="translate(0 -29) rotate(-18)"><path d="M-21 0 A21 6 0 0 1 21 0" stroke="#e8d6a8" stroke-width="3.5" fill="none"/><circle r="11.5" fill="#f2b56b"/><path d="M-10.5 -4.5 Q0 -2.5 10.5 -4.5 M-11.3 2 Q0 4 11.3 2" stroke="#d98b45" stroke-width="2" fill="none"/><path d="M21 0 A21 6 0 0 1 -21 0" stroke="#e8d6a8" stroke-width="3.5" fill="none"/></g>${star(15, -47, 3.2, '#ffd166')}`,
  fossilhammer: `<rect x="-2.2" y="-38" width="4.4" height="46" rx="2" fill="#c08a3e"/><rect x="-2.6" y="-6" width="5.2" height="13" rx="2" fill="#2f74e8"/><path d="M-13 -45 h11 v10 h-11 Z" fill="#8d96a3" stroke="#5f6772" stroke-width="1"/><path d="M-2 -45 L18 -41.5 Q20.5 -40 18 -38.5 L-2 -35 Z" fill="#a9b2bd" stroke="#5f6772" stroke-width="1"/>`,
  sword: `<path d="M-4.5 -8 L-4.5 -50 Q0 -60 4.5 -50 L4.5 -8 Z" fill="#e3e8ee" stroke="#8d96a3" stroke-width="1.2"/><path d="M0 -11 V-51" stroke="#b9c1cb" stroke-width="1.4"/><rect x="-15" y="-9.5" width="30" height="5" rx="2.5" fill="#d4a64a" stroke="#b8862a" stroke-width="1"/><circle cx="-15" cy="-7" r="3" fill="#d4a64a"/><circle cx="15" cy="-7" r="3" fill="#d4a64a"/><rect x="-2.6" y="-4.5" width="5.2" height="10.5" rx="2" fill="#2f5fa8"/><circle cy="8" r="4" fill="#d4a64a" stroke="#b8862a" stroke-width="1"/>`,
  paintbrush: `<path d="M-2 8 L-2.7 -32 L2.7 -32 L2 8 Z" fill="#d63d74"/><rect x="-3.2" y="-39" width="6.4" height="8" rx="1" fill="#c7ced6" stroke="#8d96a3" stroke-width=".8"/><path d="M-3.2 -39 Q-4.5 -47 0 -56 Q4.5 -47 3.2 -39 Z" fill="#6b4226"/><path d="M-2.4 -47 Q-1 -52 0 -56 Q2.8 -51 2.6 -46.5 Q0 -48 -2.4 -47 Z" fill="#2f74e8"/>`,
  telescope: `<g transform="rotate(-24)"><rect x="-2.8" y="-16" width="5.6" height="22" rx="1.5" fill="#b8862a"/><rect x="-4.3" y="-33" width="8.6" height="19" rx="1.5" fill="#d4a64a"/><rect x="-6" y="-57" width="12" height="26" rx="2" fill="#2f4f8f"/><rect x="-6.8" y="-59" width="13.6" height="5" rx="1.5" fill="#d4a64a"/><rect x="-6.6" y="-34" width="13.2" height="3.6" rx="1" fill="#d4a64a"/><path d="M-3 -52 V-37" stroke="#5a7cc0" stroke-width="2" stroke-linecap="round"/></g>`,
  microscope: `<rect x="-14" y="6" width="25" height="5.5" rx="2.5" fill="#3b3a4a"/><path d="M5 8 Q14 -6 7 -26" stroke="#e9ecf2" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M5 8 Q14 -6 7 -26" stroke="#9aa3ad" stroke-width="1.2" fill="none" transform="translate(3.4 0)"/><rect x="-12" y="-9" width="18" height="3.5" rx="1.5" fill="#3b3a4a"/><g transform="translate(-1 -27) rotate(-16)"><rect x="-4" y="-15" width="8" height="24" rx="2" fill="#f4f7ff" stroke="#8d96a3" stroke-width="1.2"/><rect x="-3.2" y="-21" width="6.4" height="7" rx="1.5" fill="#3b3a4a"/><rect x="-2.2" y="9" width="4.4" height="5" rx="1" fill="#8d96a3"/></g><circle cx="9.5" cy="-17" r="3.4" fill="#9a48d6"/><circle cx="-4" cy="2" r="2.6" fill="#bfe6ff" stroke="#8d96a3" stroke-width="1"/>`,
  book: `<g transform="rotate(8)"><rect x="-25" y="-33" width="28" height="34" rx="2.5" fill="#f4ead0" stroke="#d9c79a" stroke-width="1"/><rect x="-26" y="-35" width="27" height="34" rx="2.5" fill="#2e7d78"/><rect x="-4" y="-35" width="5" height="34" rx="2" fill="#225f5b"/><rect x="-21" y="-29" width="14" height="9" rx="1.5" fill="#f4ead0"/><path d="M-19 -26 h10 M-19 -23 h7" stroke="#2e7d78" stroke-width="1.2"/>${star(-14, -11, 4.5, '#ffd166')}<path d="M-22 -1.5 v8 l2.5 -2 l2.5 2 v-8 Z" fill="#d63d74"/></g>`,
  violin: `<path d="M-15 -3 L16 -47" stroke="#6b4226" stroke-width="2" stroke-linecap="round"/><path d="M-13 -3.5 L16.5 -45" stroke="#efe7d2" stroke-width=".9"/><path d="M0 -37 Q-9.5 -37 -9 -29 Q-8.5 -25 -5.5 -23.5 Q-10.5 -21 -10.5 -12 Q-10.5 -1.5 0 -1 Q10.5 -1.5 10.5 -12 Q10.5 -21 5.5 -23.5 Q8.5 -25 9 -29 Q9.5 -37 0 -37 Z" fill="#c0702a" stroke="#7a3b12" stroke-width="1.2"/><path d="M-4.5 -24 q-1.6 4 0 8 M4.5 -24 q1.6 4 0 8" stroke="#3d2416" stroke-width="1.2" fill="none"/><rect x="-1.8" y="-55" width="3.6" height="35" rx="1.5" fill="#2b2a33"/><path d="M-2.2 -11 L2.2 -11 L1.6 -3 L-1.6 -3 Z" fill="#2b2a33"/><path d="M-.7 -53 V-11 M.7 -53 V-11" stroke="#efe7d2" stroke-width=".5"/><circle cy="-57" r="3.2" fill="#7a3b12"/><path d="M-4.5 -53 h9" stroke="#3d2416" stroke-width="1.6" stroke-linecap="round"/>`,
});
Object.assign(CAPY_HOLD, {
  flag: 'translate(118 142) rotate(6) scale(-1 1)', trophy: 'translate(112 141)', saturn: 'translate(114 144) rotate(-6)', fossilhammer: 'translate(114 142) rotate(-10)',
  sword: 'translate(116 92) rotate(180)', paintbrush: 'translate(114 142) rotate(-8)', telescope: 'translate(116 146) rotate(14)', microscope: 'translate(112 138)',
  book: 'translate(126 150) rotate(-6)', violin: 'translate(112 149) rotate(-8)',
});
Object.assign(SHIELDS, {
  // the hero's round shield, with the same lightning bolt as the hero suit
  heroshield: `<circle r="27" fill="#2f74e8" stroke="#1f5cc4" stroke-width="3"/><circle r="19.5" fill="none" stroke="#ffd166" stroke-width="4"/>${bolt(0.5, 0, 2.2, '#ffd166', ' stroke="#d9a21b" stroke-width=".5"')}`,
  // a knight's shield: a gold chevron between three silver stars
  crestshield: `<path d="M-22 -27 H22 V-4 Q22 18 0 30 Q-22 18 -22 -4 Z" fill="#2f5fa8"/><path d="M-21 8 L0 -9 L21 8 L21 0 L0 -17 L-21 0 Z" fill="#ffd166"/>${star(-11, -18, 5, '#fff')}${star(11, -18, 5, '#fff')}${star(0, 12, 5.5, '#fff')}<path d="M-22 -27 H22 V-4 Q22 18 0 30 Q-22 18 -22 -4 Z" fill="none" stroke="#d4a64a" stroke-width="3" stroke-linejoin="round"/>`,
  palette: `<path fill-rule="evenodd" d="M-2 -25 Q24 -26 27 -4 Q29 16 9 22 Q-6 26 -10 17 Q-12 10 -6 8 Q-1 6 -4 0 Q-8 -5 -16 -2 Q-27 -1 -25 -12 Q-21 -25 -2 -25 Z M-16 -13 a4.2 3.6 0 1 0 8.4 0 a4.2 3.6 0 1 0 -8.4 0 Z" fill="#e2b77a" stroke="#b8862a" stroke-width="1.5"/>${[[2, -18, '#d62f3a'], [13, -15, '#ffd166'], [20, -5, '#0f9a6e'], [18, 7, '#2f74e8'], [8, 14, '#9a48d6'], [-6, -19, '#fff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="${c}"/>`).join('')}`,
});

const FRIENDS = {
  alien: `<path d="M-5 0 L-4 -6 M5 0 L4 -6" stroke="#5fae55" stroke-width="4" stroke-linecap="round"/><path d="M-7 -14 Q-14 -17 -15 -25 M7 -14 Q14 -12 16 -6" stroke="#8be07a" stroke-width="3.6" fill="none" stroke-linecap="round"/><ellipse cy="-12" rx="9" ry="9" fill="#8be07a"/><ellipse cy="-11" rx="5" ry="4.5" fill="#c3f2b6"/><path d="M-5 -34 Q-8 -41 -11 -43 M5 -34 Q8 -41 11 -43" stroke="#5fae55" stroke-width="2" fill="none"/><circle cx="-11" cy="-43.5" r="2.8" fill="#ff5fa2"/><circle cx="11" cy="-43.5" r="2.8" fill="#ff5fa2"/><ellipse cy="-29" rx="13" ry="10.5" fill="#8be07a"/><ellipse cx="-5" cy="-30" rx="3.6" ry="4.6" fill="#2b2a33"/><ellipse cx="5" cy="-30" rx="3.6" ry="4.6" fill="#2b2a33"/><circle cx="-4" cy="-32" r="1.3" fill="#fff"/><circle cx="6" cy="-32" r="1.3" fill="#fff"/><path d="M-4 -23.5 q4 3.5 8 0" stroke="#2b2a33" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  // just hatched, still in its egg
  babydino: `<rect x="-5" y="-22" width="10" height="10" fill="#6cc36b"/><path d="M-5 -34 L-3 -39.5 L0 -34.5 L3 -39.5 L5 -34 Z" fill="#ffb13d"/><ellipse cy="-26" rx="10.5" ry="9" fill="#6cc36b"/><circle cx="-4" cy="-27.5" r="2.6" fill="#2b2a33"/><circle cx="4" cy="-27.5" r="2.6" fill="#2b2a33"/><circle cx="-3.2" cy="-28.4" r=".9" fill="#fff"/><circle cx="4.8" cy="-28.4" r=".9" fill="#fff"/><path d="M-3.5 -21.5 q3.5 2.6 7 0" stroke="#2b2a33" stroke-width="1.3" fill="none" stroke-linecap="round"/><ellipse cx="-7" cy="-23" rx="2" ry="1.2" fill="#f2a0a0" opacity=".7"/><ellipse cx="7" cy="-23" rx="2" ry="1.2" fill="#f2a0a0" opacity=".7"/><path d="M-14 -2 Q-16 -12 -13 -18 L-9 -14 L-5 -19 L-1 -14 L3 -19 L7 -14 L11 -19 L13 -17 Q16 -12 14 -2 Q12 2 0 2 Q-12 2 -14 -2 Z" fill="#fbf6e9" stroke="#e0d3b5" stroke-width="1.2"/><path d="M-10 -16 q-4 -1 -5 2 M10 -16 q4 -1 5 2" stroke="#6cc36b" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="-7" cy="-7" r="2.2" fill="#a8d8f0"/><circle cx="6" cy="-9" r="2.6" fill="#a8d8f0"/><circle cx="2" cy="-3" r="1.6" fill="#a8d8f0"/>`,
  // a grey tabby with green eyes
  cat: `<path d="M8 -2 Q22 -2 20 -14 Q19 -20 14 -21" stroke="#8d96a3" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-10 0 Q-12 -14 -6 -21 L6 -21 Q12 -14 10 0 Z" fill="#9aa3ad"/><path d="M-9.5 -8 h4 M9.5 -8 h-4 M-10.4 -13 h4 M10.4 -13 h-4" stroke="#6f7782" stroke-width="1.6"/><path d="M-4 -1 Q-5 -12 0 -17 Q5 -12 4 -1 Z" fill="#f4f7ff"/><ellipse cx="-4" cy="-1" rx="3.4" ry="2.2" fill="#f4f7ff"/><ellipse cx="4" cy="-1" rx="3.4" ry="2.2" fill="#f4f7ff"/><path d="M-10.5 -31 L-9.5 -42 L-2 -35 Z M10.5 -31 L9.5 -42 L2 -35 Z" fill="#9aa3ad"/><path d="M-9 -33 L-8.5 -39 L-4.5 -35.5 Z M9 -33 L8.5 -39 L4.5 -35.5 Z" fill="#f2a0a0"/><ellipse cy="-28" rx="11" ry="9.5" fill="#9aa3ad"/><path d="M-3 -37 v4 M0 -37.5 v4.5 M3 -37 v4" stroke="#6f7782" stroke-width="1.4"/><ellipse cy="-24" rx="5.4" ry="3.6" fill="#f4f7ff"/><ellipse cx="-4.5" cy="-29" rx="2.3" ry="2.7" fill="#7cc35a"/><ellipse cx="4.5" cy="-29" rx="2.3" ry="2.7" fill="#7cc35a"/><ellipse cx="-4.5" cy="-29" rx=".9" ry="2.2" fill="#2b2a33"/><ellipse cx="4.5" cy="-29" rx=".9" ry="2.2" fill="#2b2a33"/><path d="M-1.5 -26.2 h3 l-1.5 1.7 Z" fill="#e57f9a"/><path d="M0 -24.5 q-1.5 1.8 -3 .6 M0 -24.5 q1.5 1.8 3 .6" stroke="#5f6772" stroke-width=".9" fill="none"/><path d="M-6 -24.5 l-8 -1.5 M-6 -23 l-8 1.5 M6 -24.5 l8 -1.5 M6 -23 l8 1.5" stroke="#5f6772" stroke-width=".7"/>`,
  // a red fox with a white-tipped brush
  fox: `<path d="M6 -2 Q25 1 23 -16 Q22 -25 15 -27 Q19 -14 6 -11 Z" fill="#e8742c"/><path d="M15 -27 Q22 -25.5 23 -17 Q19.5 -21 15 -22 Z" fill="#fff"/><path d="M-10 0 Q-12 -14 -6 -21 L6 -21 Q12 -14 10 0 Z" fill="#e8742c"/><path d="M-5 -2 Q-6 -13 0 -18 Q6 -13 5 -2 Z" fill="#fff"/><path d="M-5 0 v-6 M5 0 v-6" stroke="#4a2c1d" stroke-width="3.8" stroke-linecap="round"/><path d="M-12.5 -30 L-10.5 -44 L-2 -36 Z M12.5 -30 L10.5 -44 L2 -36 Z" fill="#e8742c"/><path d="M-11 -40 L-10.5 -44 L-6.8 -40.6 Z M11 -40 L10.5 -44 L6.8 -40.6 Z" fill="#4a2c1d"/><path d="M-13.5 -31 Q-12 -38.5 0 -38.5 Q12 -38.5 13.5 -31 Q10 -22 0 -18 Q-10 -22 -13.5 -31 Z" fill="#e8742c"/><path d="M-13.5 -31 Q-7 -26 0 -24.5 Q7 -26 13.5 -31 Q10 -22 0 -18 Q-10 -22 -13.5 -31 Z" fill="#fff"/><circle cx="-5" cy="-30.5" r="2" fill="#2b2a33"/><circle cx="5" cy="-30.5" r="2" fill="#2b2a33"/><circle cx="-4.4" cy="-31.2" r=".7" fill="#fff"/><circle cx="5.6" cy="-31.2" r=".7" fill="#fff"/><ellipse cy="-19.8" rx="2.2" ry="1.6" fill="#2b2a33"/>`,
};
// where a friend goes: on the capybara's back, beside the lion, at the heroine's feet
const FRIEND_AT = { capybara: 'translate(142 66) scale(.85)', lion: 'translate(168 150) scale(.9)', heroine: 'translate(50 150) scale(.75)', hero: 'translate(50 150) scale(.75)' };

function camera(cx, cy, s, strap = `M${cx - 13 * s} ${cy - 24 * s} L${cx - 9 * s} ${cy - 6 * s} M${cx + 13 * s} ${cy - 24 * s} L${cx + 9 * s} ${cy - 6 * s}`) {
  return `<g><path d="${strap}" stroke="#d63d74" stroke-width="${n1(2.6 * s + 0.6)}" fill="none" stroke-linecap="round"/><g transform="translate(${cx} ${cy}) scale(${s})"><rect x="-9" y="-11.5" width="8" height="4" rx="1.5" fill="#3b3a4a"/><rect x="-13" y="-8" width="26" height="17" rx="3.5" fill="#3b3a4a"/><path d="M-13 -3 h26" stroke="#2b2a33" stroke-width="1.5"/><circle cy=".5" r="6.8" fill="#c7ced6"/><circle cy=".5" r="4.6" fill="#3b5ea8"/><circle cx="-1.6" cy="-1" r="1.5" fill="#fff" opacity=".8"/><rect x="7" y="-6" width="4" height="3" rx="1" fill="#ffd166"/><circle cx="9" cy="-9.6" r="1.7" fill="#d62f3a"/></g></g>`;
}

// --- suits: racing overalls, an astronaut's suit, a hero suit and a knight's armour, on all three
const lionLegs = (fill, boot, line = '') => `<path d="M83 127 h14 v14 h-14 Z M103 127 h14 v14 h-14 Z" fill="${fill}"${line ? ` stroke="${line}" stroke-width="1.2"` : ''}/><ellipse cx="89" cy="145" rx="10" ry="4.8" fill="${boot}"/><ellipse cx="111" cy="145" rx="10" ry="4.8" fill="${boot}"/>`;
const capyBoots = (fill) => `<g fill="${fill}"><rect x="61" y="138" width="18" height="11" rx="5"/><rect x="79" y="138" width="18" height="11" rx="5"/><rect x="145" y="138" width="18" height="11" rx="5"/><rect x="163" y="136" width="17" height="11" rx="5"/></g>`;
const heroPants = (fill, wide = 0) => `<path d="M86.5 102 L113.5 102 L${112 + wide} 143 L101.5 143 L100 116 L98.5 143 L${88 - wide} 143 Z" fill="${fill}"/>`;
const heroBoots = (fill) => `<g fill="${fill}"><rect x="87.5" y="139" width="10.5" height="7" rx="2"/><rect x="102" y="139" width="10.5" height="7" rx="2"/><ellipse cx="92.5" cy="147" rx="5.6" ry="3"/><ellipse cx="107.5" cy="147" rx="5.6" ry="3"/></g>`;
const backLine = (d, x0 = 66, x1 = 182) => `M${Array.from({ length: 13 }, (_, i) => { const x = x0 + ((x1 - x0) * i) / 12; return `${n1(x)} ${n1(topY(x) + d * Math.sqrt(Math.max(0.15, 1 - ((x - 118) / 72) ** 2)))}`; }).join(' L')}`;
const mail = (rows, col = '#7d8692', st = 5) => rows.map(([y, x0, x1], r) => { let d = ''; for (let x = x0 + (r % 2) * (st / 2); x + st <= x1; x += st) d += `M${n1(x)} ${n1(y)} q${st / 2} ${n1(st * 0.6)} ${st} 0 `; return d ? `<path d="${d}" stroke="${col}" stroke-width=".9" fill="none"/>` : ''; }).join('');
const range = (a, b, step) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => n1(a + i * step));
const capyMailRows = () => range(68, 124, 4).map((y) => { const half = y < 102 ? 72 * Math.sqrt(Math.max(0, 1 - ((102 - y) / 42) ** 2)) - 5 : 64; return [y, Math.max(62, 118 - half), Math.min(176, 118 + half)]; });
const SUITS = {
  racesuit: {
    capy: () => `<g>${capyBoots('#2b2a33')}${cloth('#d62f3a', 126)}<path d="${backLine(7)}" stroke="#fff" stroke-width="5" fill="none"/><path d="${backLine(14)}" stroke="#fff" stroke-width="2" fill="none"/><circle cx="134" cy="104" r="11" fill="#fff"/>${numberSeven(134, 110, 16, '#d62f3a')}${hemLine(121, '#ffd166', 3)}</g>`,
    lion: () => `<g>${lionLegs('#d62f3a', '#2b2a33')}<path d="${LT}" fill="#d62f3a"/><path d="M76.6 105 Q100 111 123.4 105 L124 111 Q100 117 76 111 Z" fill="#fff"/><path d="M100 117 V135" stroke="#a51d28" stroke-width="1.4"/><circle cx="112" cy="124" r="6" fill="#fff"/>${numberSeven(112, 127.5, 9, '#d62f3a')}<path d="M71.5 133 Q100 138 128.5 133" stroke="#ffd166" stroke-width="2.4" fill="none"/></g>`,
    heroine: () => `${sleeves('#d62f3a', true)}${heroPants('#d62f3a')}<path d="${BODICE}" fill="#d62f3a"/><path d="M84.2 89 L115.8 89 L115.1 94 L84.9 94 Z" fill="#fff"/><path d="M84 103 Q100 106 116 103" stroke="#ffd166" stroke-width="2" fill="none"/><path d="M100 94 V102" stroke="#a51d28" stroke-width="1"/><circle cx="108" cy="99" r="3.6" fill="#fff"/>${numberSeven(108, 101.2, 5.6, '#d62f3a')}${heroBoots('#2b2a33')}`,
  },
  spacesuit: {
    capy: () => `<g>${capyBoots('#9aa3ad')}${cloth('#eef1f5', 128, 208, 336, ' stroke="#c7ced9" stroke-width="1.5"')}${capyFolds('#d5dbe3', 124)}<rect x="96" y="90" width="26" height="16" rx="3" fill="#c7ced9"/><circle cx="103" cy="98" r="2.6" fill="#d62f3a"/><circle cx="110" cy="98" r="2.6" fill="#2f74e8"/><rect x="114" y="95.5" width="4" height="5" rx="1" fill="#ffd166"/><circle cx="150" cy="84" r="7" fill="#2f74e8"/>${star(150, 84, 4.6, '#fff')}${hemLine(121, '#c7ced9', 3)}</g>`,
    lion: () => `<g>${lionLegs('#eef1f5', '#9aa3ad', '#c7ced9')}<path d="${LT}" fill="#eef1f5" stroke="#c7ced9" stroke-width="1.5"/><rect x="90" y="111" width="20" height="13" rx="2.5" fill="#c7ced9"/><circle cx="95.5" cy="117.5" r="2.1" fill="#d62f3a"/><circle cx="101" cy="117.5" r="2.1" fill="#2f74e8"/><rect x="104.5" y="115.5" width="3" height="4" rx="1" fill="#ffd166"/><circle cx="118" cy="106" r="4.4" fill="#2f74e8"/>${star(118, 106, 2.8, '#fff')}<path d="M71.5 130 Q100 135 128.5 130" stroke="#c7ced9" stroke-width="2" fill="none"/></g>`,
    heroine: () => `${sleeves('#eef1f5', true)}${heroPants('#eef1f5', 1.5)}<path d="${BODICE}" fill="#eef1f5"/><path d="M83 81 Q100 77 117 81 L113.5 104 L86.5 104 Z M86 143 L99 143 M101 143 L114 143" stroke="#c7ced9" stroke-width="1.2" fill="none"/><rect x="93" y="88" width="14" height="9" rx="1.8" fill="#c7ced9"/><circle cx="97" cy="92.5" r="1.4" fill="#d62f3a"/><circle cx="101" cy="92.5" r="1.4" fill="#2f74e8"/><rect x="103.4" y="91" width="2" height="3" rx=".6" fill="#ffd166"/><circle cx="111.5" cy="85" r="2.6" fill="#2f74e8"/><path d="M88 106 Q100 109 112 106" stroke="#c7ced9" stroke-width="1.6" fill="none"/>${heroBoots('#9aa3ad')}`,
  },
  herosuit: {
    capy: () => `<g>${capyBoots('#d62f3a')}${cloth('#2f74e8', 126)}<circle cx="130" cy="98" r="12.5" fill="#ffd166" stroke="#d9a21b" stroke-width="1.5"/>${bolt(130, 98, 1.45, '#d62f3a')}${hemLine(120, '#ffd166', 4)}</g>`,
    lion: () => `<g>${lionLegs('#2f74e8', '#d62f3a')}<path d="${LT}" fill="#2f74e8"/><circle cx="100" cy="114" r="8.5" fill="#ffd166" stroke="#d9a21b" stroke-width="1.2"/>${bolt(100, 114, 0.95, '#d62f3a')}<path d="M71.5 130 Q100 135 128.5 130" stroke="#ffd166" stroke-width="4" fill="none"/></g>`,
    heroine: () => `${sleeves('#2f74e8', true)}${heroPants('#2f74e8')}<path d="${BODICE}" fill="#2f74e8"/><circle cx="100" cy="91" r="6" fill="#ffd166" stroke="#d9a21b" stroke-width="1"/>${bolt(100, 91, 0.68, '#d62f3a')}<rect x="86.5" y="101" width="27" height="4" rx="1.5" fill="#ffd166"/>${heroBoots('#d62f3a')}`,
  },
  armour: {
    capy: () => `<g>${capyBoots('#7d8692')}${cloth('#a9b1bb', 128)}${mail(capyMailRows())}${cloth('#2f5fa8', 116, 220, 324)}<path d="M76 ${topY(76) + 4} Q118 ${topY(118) + 2} 162 ${topY(162) + 4}" stroke="#d4a64a" stroke-width="2.2" fill="none"/>${hemLine(111, '#d4a64a', 2.5)}${crownBadge(124, 92, 1.5)}</g>`,
    lion: () => `<g>${lionLegs('#a9b1bb', '#7d8692')}${mail([[129, 84, 97], [133, 84, 97], [137, 84, 97], [129, 104, 117], [133, 104, 117], [137, 104, 117]])}<path d="${LT}" fill="#a9b1bb"/>${mail(range(104, 132, 4).map((y) => [y, 77 - (y - 102) * 0.12, 123 + (y - 102) * 0.12]))}<path d="M86 100 Q100 97 114 100 L117 139 Q100 142 83 139 Z" fill="#2f5fa8"/><path d="M86 100 L83 139 M114 100 L117 139" stroke="#d4a64a" stroke-width="2"/><rect x="83.5" y="124" width="33" height="4" fill="#6b4226"/>${crownBadge(100, 114, 1)}</g>`,
    heroine: () => `${sleeves('#a9b1bb', true)}${heroPants('#a9b1bb')}${mail(range(108, 140, 3.6).map((y) => [y, 88 + (y - 102) * 0.02, 112 - (y - 102) * 0.02]), '#7d8692', 3.6)}<path d="${BODICE}" fill="#a9b1bb"/><path d="M85 81 Q100 78 115 81 L118 128 Q100 131 82 128 Z" fill="#2f5fa8"/><path d="M85 81 L82 128 M115 81 L118 128" stroke="#d4a64a" stroke-width="1.6"/><rect x="83.6" y="100" width="32.8" height="3.4" fill="#6b4226"/>${crownBadge(100, 91, 0.75)}${heroBoots('#7d8692')}`,
  },
};

// --- the hero: his hair, face, and the T-shirt and shorts he wears when nothing else is chosen ---
function boyHair(L, part, top) {
  const c = L.hair, d = shade(c, 0.72), hi = mix(c, '#ffffff', 0.22);
  const back = `<ellipse cx="100" cy="45" rx="21" ry="19.5" fill="${c}"/>`;
  switch (L.style) {
    case 'crop':
      if (part === 'back') return back;
      if (part === 'front') return `<path d="M80.8 51 Q78.6 26.5 100 25.4 Q121.4 26.5 119.2 51 Q118.4 41 113.5 37.6 Q109 40.4 104.2 37.8 Q100 40.6 95.8 37.8 Q91 40.4 86.5 37.6 Q81.6 41 80.8 51 Z" fill="${c}"/><path d="M90 29.5 Q96 27.4 101 29 M104 29 Q110 28 113 31" stroke="${hi}" stroke-width="1" fill="none"/>`;
      return '';
    case 'spiky':
      if (part === 'back') return back;
      if (part === 'front') return `${top ? `<path d="M83 36 L81.5 23 L89 30 L91 17.5 L97.5 27 L101 15 L105.5 26.5 L110.5 18 L112 29.5 L119 23.5 L117 37 Z" fill="${c}"/>` : ''}<path d="M80.8 50 Q79 27.5 100 26.5 Q121 27.5 119.2 50 Q117.5 40.5 111 39 L107 42.4 L103 38.8 L98.5 42.4 L94 38.8 L89.5 41.6 Q82.5 41.5 80.8 50 Z" fill="${c}"/><path d="M92 31 L95 24 M103 30 L105 22" stroke="${hi}" stroke-width="1" fill="none"/>`;
      return '';
    case 'curly': {
      if (part === 'back') return `<g fill="${c}">${(top ? [[79.5, 45], [80, 35], [86.5, 27], [100, 24], [113.5, 27], [120, 35], [120.5, 45]] : [[80, 46], [83, 37], [117, 37], [120, 46]]).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}<ellipse cx="100" cy="45" rx="21" ry="19"/></g>`;
      if (part !== 'front') return '';
      const ring = top ? [[83, 37, 5.2], [88, 30, 6], [95.5, 26.5, 6.4], [104.5, 26.5, 6.4], [112, 30, 6], [117, 37, 5.2]] : [[85, 37, 4], [92, 33, 4.2], [100, 32, 4.2], [108, 33, 4.2], [115, 37, 4]];
      return `<g fill="${c}"><path d="M81 49 Q79 28 100 26 Q121 28 119 49 Q116 38.5 100 37.5 Q84 38.5 81 49 Z"/>${ring.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="${top ? 'M86 29 q3 -3 6 0 M98 24.5 q3 -3 6 0 M109 28 q3 -3 6 0' : 'M90 32 q3 -2.4 6 0 M104 32 q3 -2.4 6 0'}" stroke="${hi}" stroke-width="1" fill="none"/>`;
    }
    case 'mop':
      if (part === 'back') return `<g fill="${c}"><ellipse cx="100" cy="45" rx="22.5" ry="21"/><path d="M78 44 Q75.5 55 79.5 61 L82 50 Z M122 44 Q124.5 55 120.5 61 L118 50 Z"/></g>`;
      if (part === 'front') return `<path d="M79.8 55 Q76.5 24 100 23 Q123.5 24 120.2 55 Q119 46 116 43.6 L111.5 45.6 L107.5 42.4 L103 45.4 L98.5 42.4 L94 45.4 L89.5 42.4 L85 44.6 Q81 46.5 79.8 55 Z" fill="${c}"/><path d="M90 28 Q98 25.5 106 28.5" stroke="${hi}" stroke-width="1" fill="none"/><path d="M96 38.5 L98.5 42.4 M106 38.5 L107.5 42.4 M88 39 L89.5 42.4" stroke="${d}" stroke-width=".9"/>`;
      return '';
    case 'side':
      if (part === 'back') return back;
      if (part === 'front') return `<path d="M80.6 52 Q78 25.5 101 25 Q122 26 119.4 52 Q118.6 40 112 36 Q100 32.5 88 39.5 Q83 43 80.6 52 Z" fill="${c}"/><path d="M89 27.5 Q91.5 31 90.5 37" stroke="${d}" stroke-width="1.1" fill="none"/><path d="M95 30 Q106 28 114 33" stroke="${hi}" stroke-width="1" fill="none"/>`;
      return '';
    case 'buzz':
      if (part === 'back') return `<ellipse cx="100" cy="45.5" rx="19.6" ry="18" fill="${c}"/>`;
      if (part === 'front') return `<path d="M81.4 47.5 Q80 28 100 27.6 Q120 28 118.6 47.5 Q117 38.5 100 37.4 Q83 38.5 81.4 47.5 Z" fill="${c}"/>`;
      return '';
    case 'quiff':
      if (part === 'back') return back;
      if (part === 'front') return `${top ? `<path d="M85 36 Q82 21 97 18 Q111 15.5 117 25 Q113 22.5 108 23.5 Q114 27 113 34 Q101 27 85 36 Z" fill="${c}"/><path d="M92 22 Q101 18.5 109 21" stroke="${hi}" stroke-width="1.1" fill="none"/>` : ''}<path d="M80.8 51 Q79 29 93 26.5 Q100 25.5 107 26.5 Q121 29 119.2 51 Q118 41 112 38 Q100 35.5 88 38 Q82 41 80.8 51 Z" fill="${c}"/>`;
      return '';
    case 'twists': {
      if (part === 'back') return back;
      if (part !== 'front') return '';
      // little coils in two rows over a close crop
      const coil = (a, r, rr) => { const t = (a * Math.PI) / 180; return `<circle cx="${n1(100 + Math.cos(t) * r * 1.05)}" cy="${n1(44 + Math.sin(t) * r)}" r="${rr}"/>`; };
      const coils = top ? [...range(196, 344, 16).map((a) => coil(a, 18.5, 3.3)), ...range(212, 328, 19).map((a) => coil(a, 13.5, 3.1))].join('') : '';
      return `<g fill="${c}"><path d="M81.2 48.5 Q79.6 27.6 100 27 Q120.4 27.6 118.8 48.5 Q117 38.5 100 37.2 Q83 38.5 81.2 48.5 Z"/>${coils}</g>${top ? range(212, 328, 38).map((a) => { const t = (a * Math.PI) / 180, x = n1(100 + Math.cos(t) * 14.2), y = n1(44 + Math.sin(t) * 13.5); return `<path d="M${n1(x - 1.4)} ${n1(y - 0.6)} q1.4 -1.4 2.8 0" stroke="${hi}" stroke-width=".8" fill="none"/>`; }).join('') : ''}`;
    }
    default:
      return '';
  }
}

function boyFace(mood, L) {
  const ink = '#2b2a33', lip = '#8e3f3f', brow = shade(L.hair === '#d9a84e' ? '#9a6a2a' : L.hair, 0.9);
  const eye = (x, dy = 0, dx = 0) => `<ellipse cx="${x + dx}" cy="${51 + dy}" rx="2.5" ry="3" fill="${ink}"/><circle cx="${x + dx + 0.8}" cy="${50 + dy}" r=".95" fill="#fff"/>`;
  let eyes, brows, mouth, extra = '';
  if (mood === 'happy') {
    eyes = `<path d="M89 51.5 q3 -3.6 6 0 M105 51.5 q3 -3.6 6 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    brows = 'M87.5 44 q4.5 -2.4 9 -.2 M103.5 43.8 q4.5 -2.2 9 .2';
    mouth = `<path d="M93.6 59.6 q6.4 8.2 12.8 0 Z" fill="${lip}"/><path d="M95.2 60 h9.6 q-.6 1.7 -1.4 2 h-6.8 q-.8 -.3 -1.4 -2 Z" fill="#fff"/>`;
  } else if (mood === 'thinking') {
    eyes = eye(92, -1.2, 1) + eye(108, -1.2, 1);
    brows = 'M87.5 42.5 q4.5 -3 9 -.4 M103.5 44.5 q4.5 -1.6 9 0';
    mouth = `<path d="M97.5 62 q3.5 -1.4 7 .4" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  } else if (mood === 'oops') {
    eyes = `<circle cx="92" cy="51.5" r="2.9" fill="${ink}"/><circle cx="108" cy="51.5" r="2.9" fill="${ink}"/><circle cx="92.9" cy="50.6" r="1" fill="#fff"/><circle cx="108.9" cy="50.6" r="1" fill="#fff"/>`;
    brows = 'M88 43 q4 -2 8.5 .4 M103.5 43.4 q4.5 -2.4 8.5 -.4';
    mouth = `<ellipse cx="100" cy="62.5" rx="2.4" ry="2.8" fill="${lip}"/>`;
    extra = '<path d="M124 36 q3 6 0 9 q-3 -3 0 -9z" fill="#7cc0ea"/>';
  } else {
    eyes = eye(92) + eye(108);
    brows = 'M87.5 44.5 q4.5 -2 9 0 M103.5 44.5 q4.5 -2 9 0';
    mouth = `<path d="M95.6 60.8 q4.4 3.6 8.8 0" stroke="${lip}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
  }
  const freckles = L.freckles ? [[85.5, 56.5], [88, 58.4], [86.4, 59.8], [114.5, 56.5], [112, 58.4], [113.6, 59.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${shade(L.skin, 0.72)}"/>`).join('') : '';
  return `${eyes}<path d="${brows}" stroke="${brow}" stroke-width="1.9" fill="none" stroke-linecap="round"/><path d="M100 53.5 q1.8 3 -.8 4.6" stroke="${shade(L.skin, 0.76)}" stroke-width="1.2" fill="none" stroke-linecap="round"/><ellipse cx="87" cy="58.5" rx="3.6" ry="2.1" fill="#f08a8a" opacity=".28"/><ellipse cx="113" cy="58.5" rx="3.6" ry="2.1" fill="#f08a8a" opacity=".28"/>${freckles}${mouth}${extra}`;
}

const TEE_AND_SHORTS = `<path d="M84.6 104 L115.4 104 L117 124.5 L102.5 124.5 L100 113 L97.5 124.5 L83 124.5 Z" fill="#2b3a67"/><path d="M100 104 V112" stroke="#1f2b4f" stroke-width="1"/>${sleeves('#e8743a')}<path d="M83 81 Q100 77 117 81 L115.6 107.5 Q100 109.5 84.4 107.5 Z" fill="#e8743a"/><path d="M93 80 Q100 85.5 107 80" stroke="#c75a26" stroke-width="1.8" fill="none"/>${star(100, 94, 5.4, '#ffd166')}<path d="M76.5 94.5 L84.4 96.4 M123.5 94.5 L115.6 96.4" stroke="#c75a26" stroke-width="1.4"/>`;
const TRAINERS = '<g><ellipse cx="92.4" cy="146.6" rx="5.9" ry="3.3" fill="#f4f7ff" stroke="#b9c1cb" stroke-width=".8"/><ellipse cx="107.6" cy="146.6" rx="5.9" ry="3.3" fill="#f4f7ff" stroke="#b9c1cb" stroke-width=".8"/><path d="M86.8 148.6 h11.2 M102 148.6 h11.2" stroke="#2f74e8" stroke-width="1.8" stroke-linecap="round"/><path d="M90 145 l3 -1.6 M105 143.4 l3 1.6" stroke="#2f74e8" stroke-width="1.2" stroke-linecap="round"/></g>';

// --- new hats, in the capybara's head coordinates like the others ---
KEEP_TOP.add('tiara');
Object.assign(HEADWEAR, {
  // an iron helmet with a nose guard: real Viking helmets had no horns
  vikinghelmet: `<g><path d="M28 66 Q28 24 64 24 Q100 24 100 66 Z" fill="#8d96a3"/><path d="M40 36 Q50 29 62 28" stroke="#c7ced6" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M64 25 V62 M30 47 Q64 39 98 47" stroke="#6f7782" stroke-width="4" fill="none"/><path d="M26 60 Q64 51 102 60 L102 68 Q64 59 26 68 Z" fill="#6f7782"/><path d="M60 62 H68 V80 L64 84 L60 80 Z" fill="#6f7782" stroke="#5f6772" stroke-width="1"/>${[[36, 63], [50, 59.5], [78, 59.5], [92, 63], [64, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#c7ced6"/>`).join('')}</g>`,
  // a samurai's kabuto: a lacquered bowl, laced neck guard, turn-backs and a crescent at the front
  kabuto: `<g><path d="M30 58 Q16 66 12 84 L24 86 Q25 72 34 64 Z M98 58 Q112 66 116 84 L104 86 Q103 72 94 64 Z" fill="#2b2a3a"/><path d="M16 74 L28 71 M13.5 80.5 L25 80 M112 74 L100 71 M114.5 80.5 L103 80" stroke="#c0392b" stroke-width="2"/><path d="M30 62 Q30 24 64 24 Q98 24 98 62 Z" fill="#2b2a3a"/>${[38, 47, 56, 72, 81, 90].map((x) => `<path d="M${x} 59 Q${n1((x + 64) / 2)} 32 64 26" stroke="#4a4960" stroke-width="1.4" fill="none"/>`).join('')}<path d="M27 58 Q64 50 101 58 L101 64 Q64 56 27 64 Z" fill="#d4a64a"/><path d="M28 59 L18 50 L22 66 Z M100 59 L110 50 L106 66 Z" fill="#c0392b" stroke="#d4a64a" stroke-width="1.2" stroke-linejoin="round"/><path d="M46 20 Q64 52 82 20 Q64 40 46 20 Z" fill="#e8c26a" stroke="#b8862a" stroke-width="1"/></g>`,
  // a straw bonnet that frames the face, tied with a ribbon under the chin
  bonnet: `<g><path d="M22 86 Q20 24 64 22 Q108 24 106 86 L97 86 Q98 38 64 36 Q30 38 31 86 Z" fill="#e8d3a2" stroke="#c9ad6e" stroke-width="1.5"/><path d="M31 84 Q30 39 64 37.5 Q98 39 97 84" stroke="#f4b6c8" stroke-width="2.6" fill="none"/><path d="M25 68 Q24 40 42 30 M103 68 Q104 40 86 30" stroke="#c9ad6e" stroke-width="1.2" fill="none"/><path d="M26 84 Q30 104 58 113 M102 84 Q98 104 70 113" stroke="#e5737f" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(64 113)"><path d="M0 0 L-10 -6 L-10 6 Z M0 0 L10 -6 L10 6 Z" fill="#e5737f"/><path d="M-2 2 L-6 12 M2 2 L6 12" stroke="#e5737f" stroke-width="2.4" stroke-linecap="round"/><circle r="3" fill="#c94f5c"/></g>${flower5(94, 30, 4, '#f48fb1')}${flower5(102, 40, 3.2, '#fff')}</g>`,
  // Sherlock Holmes's cap: peaks at the front and back, the ear flaps tied up on top
  deerstalker: `<g><path d="M30 58 L19 45 Q23 39 32 42 Z M98 58 L109 45 Q105 39 96 42 Z" fill="#8a6a45" stroke="#6b5034" stroke-width="1"/><path d="M30 62 Q29 26 64 25 Q99 26 98 62 Z" fill="#8a6a45"/><path d="M41 33 V60 M52 28 V60 M64 26 V60 M76 28 V60 M87 33 V60 M33 42 H95 M30 52 H98" stroke="#6b5034" stroke-width="1" opacity=".7"/><path d="M28 58 Q64 50 100 58 L100 63 Q64 55 28 63 Z" fill="#7a5c3b"/><path d="M40 61 Q64 55 88 61 Q86 71 64 73 Q42 71 40 61 Z" fill="#7a5c3b"/><path d="M24 43 Q40 26 61 24.5 M104 43 Q88 26 67 24.5" stroke="#4a3520" stroke-width="1.4" fill="none"/><circle cx="64" cy="24.5" r="3" fill="#4a3520"/></g>`,
  tiara: `<g><path d="M36 58 Q64 48 92 58" stroke="#c7ced6" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M42 55 L45 45 L51 51 L57 41 L64 32 L71 41 L77 51 L83 45 L86 55 Q64 48 42 55 Z" fill="#e6ebf2" stroke="#b9c1cb" stroke-width="1.5" stroke-linejoin="round"/><circle cx="64" cy="43" r="3.6" fill="#f06292"/><circle cx="51" cy="51" r="2.2" fill="#64b5f6"/><circle cx="77" cy="51" r="2.2" fill="#64b5f6"/><circle cx="45" cy="45" r="1.6" fill="#fff"/><circle cx="83" cy="45" r="1.6" fill="#fff"/><circle cx="64" cy="32" r="2" fill="#fff"/></g>`,
});

// --- laser swords (an original design: a winged gold guard and a pointed, glowing blade) and the lantern
const laser = (col, glow) => `<path d="M0 -13 V-60" stroke="${glow}" stroke-width="11" stroke-linecap="round" opacity=".28"/><path d="M-2.9 -12 L-2.9 -56 L0 -64 L2.9 -56 L2.9 -12 Z" fill="${col}"/><path d="M0 -14 V-57" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".9"/><path d="M-10 -7 Q-9 -14 -3.5 -12.5 L3.5 -12.5 Q9 -14 10 -7 L6 -8.5 L-6 -8.5 Z" fill="#d4a64a" stroke="#b8862a" stroke-width=".8" stroke-linejoin="round"/><rect x="-2.6" y="-8.5" width="5.2" height="14" rx="1.6" fill="#3b3a4a"/><path d="M-2.6 -4.5 h5.2 M-2.6 -1.5 h5.2 M-2.6 1.5 h5.2" stroke="#8d96a3" stroke-width=".8"/><circle cy="8" r="3" fill="${col}" stroke="#d4a64a" stroke-width="1.2"/>`;
Object.assign(HOLD, {
  laserblue: laser('#7fd6ff', '#2f9bff'),
  lasergreen: laser('#8cff9e', '#22c55e'),
  laserred: laser('#ff7a7a', '#ef2b2b'),
  laserpurple: laser('#d4a8ff', '#9a48d6'),
});
// Florence Nightingale's folding Turkish lantern: a pleated cylinder between metal caps, with a candle
// inside; it hangs from its handle at (0, 0)
function oilLamp(lit = LIT) {
  const paper = lit ? '#ffe08a' : '#efe6d2', pleat = lit ? '#eaa73c' : '#cdbf9f';
  return `<g class="companion-lamp" data-lamp="oillamp" data-lit="${lit ? 1 : 0}">${lit ? '<circle cy="14" r="24" fill="#ffc84a" opacity=".16"/><circle cy="14" r="16" fill="#ffd36b" opacity=".24"/><circle cy="14" r="10" fill="#fff0a8" opacity=".35"/>' : ''}<path d="M-3.6 4.5 Q-3.6 -1.2 0 -1.2 Q3.6 -1.2 3.6 4.5" stroke="#8a6a40" stroke-width="1.6" fill="none"/><path d="M-4.6 4 H4.6 L6 7.5 H-6 Z" fill="#b8862a"/><rect x="-5.6" y="7" width="11.2" height="14" rx="2" fill="${paper}" stroke="${pleat}" stroke-width=".8"/>${[9.5, 12, 14.5, 17, 19.5].map((y) => `<path d="M-5.6 ${y} Q0 ${n1(y + 0.9)} 5.6 ${y}" stroke="${pleat}" stroke-width=".8" fill="none"/>`).join('')}${lit ? '<path d="M0 10.2 Q2.3 13.3 0 16 Q-2.3 13.3 0 10.2 Z" fill="#ff8a3d" opacity=".85"/><ellipse cy="14.2" rx="1" ry="1.6" fill="#fff6c9"/>' : '<rect x="-1.3" y="13" width="2.6" height="6" fill="#d8ccb2"/>'}<path d="M-6 21 H6 L4.8 24 H-4.8 Z" fill="#b8862a"/><rect x="-9" y="-3" width="18" height="29" fill="#fff" fill-opacity="0"/></g>`;
}
Object.defineProperty(HOLD, 'oillamp', { get: () => oilLamp(), enumerable: true });
Object.assign(CAPY_HOLD, { laserblue: 'translate(114 138) rotate(-8)', lasergreen: 'translate(114 138) rotate(-8)', laserred: 'translate(114 138) rotate(-8)', laserpurple: 'translate(114 138) rotate(-8)', oillamp: 'translate(122 124)' });

/** A desk lamp on a little table, standing on the ground at (0, 0); tapping it turns it on and off. */
function deskLamp(lit = LIT) {
  return `<g class="companion-lamp" data-lamp="lamp" data-lit="${lit ? 1 : 0}">${lit ? '<circle cy="-38" r="30" fill="#ffd36b" opacity=".16"/><circle cy="-38" r="19" fill="#ffd36b" opacity=".22"/><path d="M-10 -32 L-19 -18 L19 -18 L10 -32 Z" fill="#fff3b0" opacity=".5"/>' : ''}<path d="M-11 -14 L-13 0 M11 -14 L13 0" stroke="#7a4f2a" stroke-width="3" stroke-linecap="round"/><path d="M-12 -6 H12" stroke="#7a4f2a" stroke-width="2"/><rect x="-16" y="-18.5" width="32" height="4.5" rx="2" fill="#a0703f"/><ellipse cy="-19.5" rx="7.5" ry="2.4" fill="#3b5ea8"/><rect x="-1.5" y="-33" width="3" height="13.5" fill="#8d96a3"/><path d="M6 -32 V-25" stroke="#8d96a3" stroke-width=".9"/><circle cx="6" cy="-24.5" r="1.4" fill="#8d96a3"/><path d="M-4.2 -32.5 Q0 -27 4.2 -32.5 Z" fill="${lit ? '#fffbe0' : '#d9dde3'}" stroke="${lit ? '#ffe9a0' : '#b9c1cb'}" stroke-width=".8"/><path d="M-11 -32 L-6.5 -47 L6.5 -47 L11 -32 Z" fill="${lit ? '#ffd166' : '#c9b48a'}" stroke="${lit ? '#e8a93a' : '#a8946a'}" stroke-width="1.2" stroke-linejoin="round"/>${lit ? '<path d="M-7.6 -34.5 L-4.6 -44.5" stroke="#fff6c9" stroke-width="2" stroke-linecap="round" opacity=".85"/>' : ''}<rect x="-20" y="-52" width="40" height="52" fill="#fff" fill-opacity="0"/></g>`;
}

// --- an energy shield and the first-aid kit (a white cross on green, the first-aid sign), centred like the shields
const hexPath = (r) => `M${Array.from({ length: 6 }, (_, i) => { const t = ((i * 60 - 90) * Math.PI) / 180; return `${n1(Math.cos(t) * r)} ${n1(Math.sin(t) * r)}`; }).join(' L')} Z`;
Object.assign(SHIELDS, {
  energyshield: `<path d="${hexPath(30)}" fill="#7cf2ff" opacity=".22"/><path d="${hexPath(26)}" fill="#7cf2ff" fill-opacity=".35" stroke="#22c3ee" stroke-width="2.6" stroke-linejoin="round"/><path d="${hexPath(16)}" fill="none" stroke="#c9fbff" stroke-width="1.4"/><path d="M0 -26 V-16 M0 16 V26 M-22.5 -13 L-13.9 -8 M22.5 -13 L13.9 -8 M-22.5 13 L-13.9 8 M22.5 13 L13.9 8" stroke="#c9fbff" stroke-width="1.2"/><circle r="6" fill="#3b3a4a"/><circle r="3.2" fill="#c9fbff"/><path d="M-14 -18 Q-6 -23 2 -22" stroke="#fff" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"/>`,
  // carried by its handle, which sits at the hand
  firstaid: '<path d="M-11 18 Q-11 9.5 -4 9.5 Q3 9.5 3 18" stroke="#2b2a33" stroke-width="2.8" fill="none"/><rect x="-21" y="17" width="34" height="25" rx="4" fill="#1f9d55" stroke="#157a41" stroke-width="1.5"/><path d="M-21 23 H13" stroke="#157a41" stroke-width="1.2"/><rect x="-7" y="20.6" width="6" height="2.4" rx="1" fill="#d4a64a"/><path d="M-6.5 25.5 H-1.5 V30 H3 V35 H-1.5 V39.5 H-6.5 V35 H-11 V30 H-6.5 Z" fill="#fff"/>',
});

// --- a hoverboard, floating on two glowing pads
function hoverboard(upright) {
  const [x0, x1, y] = upright ? [58, 142, 145] : [46, 190, 145];
  const w = x1 - x0, mid = (x0 + x1) / 2;
  return `<g><ellipse cx="${mid}" cy="157.5" rx="${n1(w * 0.42)}" ry="1.8" fill="#5ef0ff" opacity=".35"/>${[x0 + 10, x1 - 26].map((x) => `<ellipse cx="${x + 8}" cy="156" rx="9" ry="2.2" fill="#5ef0ff" opacity=".6"/><rect x="${x}" y="${y + 6}" width="16" height="4.4" rx="2" fill="#3b3a4a"/>`).join('')}<rect x="${x0}" y="${y}" width="${w}" height="7.5" rx="3.75" fill="#7a3fd1"/><path d="M${x0 + 6} ${y + 2.6} H${x1 - 6}" stroke="#5ef0ff" stroke-width="1.8" stroke-linecap="round"/>${bolt(mid, y + 4, 0.5, '#ffd166')}</g>`;
}

// --- fairy wings: see-through and veined
const FAIRY_WING = `<g fill="#e3d4ff" fill-opacity=".75" stroke="#a58be0" stroke-width="1.6" stroke-linejoin="round"><path d="M124 70 Q112 34 136 18 Q154 10 158 26 Q160 46 124 70 Z"/><path d="M128 72 Q150 46 174 46 Q190 50 182 64 Q170 78 128 72 Z"/></g><g fill="#fff">${[[142, 30], [168, 58], [136, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g>`;
const FAIRY_PAIR = `<g fill="#e3d4ff" fill-opacity=".75" stroke="#a58be0" stroke-width="1.6" stroke-linejoin="round"><path d="M86 102 Q60 62 40 70 Q28 78 40 92 Q56 104 86 108 Z"/><path d="M86 110 Q58 108 46 122 Q44 134 58 132 Q76 126 88 114 Z"/></g><path d="M84 104 Q62 82 46 78 M86 112 Q66 116 54 126" stroke="#a58be0" stroke-width="1.1" fill="none"/><circle cx="50" cy="80" r="1.5" fill="#fff"/><circle cx="56" cy="126" r="1.3" fill="#fff"/>`;

// --- armour (Years 2 and 3) and dressing up (Year 6), on all four companions
const capyRows = (step, maxY = 124, minY = 68) => range(minY, maxY, step).map((y) => { const half = y < 102 ? 72 * Math.sqrt(Math.max(0, 1 - ((102 - y) / 42) ** 2)) - 5 : 64; return [y, Math.max(62, 118 - half), Math.min(176, 118 + half)]; });
const lionRows = (y0, y1, step) => range(y0, y1, step).map((y) => [y, n1(77 - (y - 102) * 0.12), n1(123 + (y - 102) * 0.12)]);
const heroRows = (y0, y1, step) => range(y0, y1, step).map((y) => [y, n1(84 + (y - 81) * 0.1), n1(116 - (y - 81) * 0.1)]);
const backY = (x, d) => n1(topY(x) + d * Math.sqrt(Math.max(0.15, 1 - ((x - 118) / 72) ** 2)));
const PADS = (fill, line) => `<path d="M83 79 Q75 81 75 93 L86 92 Q86 85 91 80 Z M117 79 Q125 81 125 93 L114 92 Q114 85 109 80 Z" fill="${fill}" stroke="${line}" stroke-width="1"/>`;
const puffs = (fill, line) => `<path d="M84 79.5 Q74.5 79.5 75.5 89.5 Q79 94 86 90.5 Z M116 79.5 Q125.5 79.5 124.5 89.5 Q121 94 114 90.5 Z" fill="${fill}" stroke="${line}" stroke-width=".8"/>`;
const bowAt = (x, y, s, col, knot) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-9 -6 L-9 6 Z M0 0 L9 -6 L9 6 Z" fill="${col}"/><path d="M-1 1 L-4 11 M1 1 L4 11" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/><circle r="2.6" fill="${knot}"/></g>`;
const moon = (x, y, r, bg) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff3c4"/><circle cx="${n1(x + r * 0.45)}" cy="${n1(y - r * 0.3)}" r="${n1(r * 0.85)}" fill="${bg}"/>`;
const stars = (list, fill) => list.map(([x, y, r]) => star(x, y, r, fill)).join('');
const dots = (list, fill, r = 1.5) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
const tutuDisc = (cx, cy, rx, ry) => { const pts = (k) => Array.from({ length: 32 }, (_, i) => { const t = (i / 32) * Math.PI * 2, r = i % 2 ? k * 0.8 : k; return `${n1(cx + Math.cos(t) * rx * r)} ${n1(cy + Math.sin(t) * ry * r)}`; }).join(' L'); return `<path d="M${pts(1)} Z" fill="#f7b6d2"/><path d="M${pts(0.8)} Z" fill="#fbd3e4"/>`; };
const capyTutu = () => { const pts = Array.from({ length: 27 }, (_, i) => { const x = 186 - i * 5, b = 8 * (1 - ((x - 118) / 70) ** 2); return `${x} ${n1((i % 2 ? 124 : 130) + b)}`; }); return `<path d="M54 112 Q118 126 186 112 L${pts.join(' L')} Z" fill="#f7b6d2"/><path d="M58 114 Q118 128 182 114 L182 119 Q118 133 58 119 Z" fill="#fbd3e4"/>`; };
const LWIDE = 'M76 102 Q100 96 124 102 Q134 124 138 146 Q100 152 62 146 Q66 124 76 102 Z';
const GOWN = 'M86.5 102 L113.5 102 Q127 118 133 147 Q100 153 67 147 Q73 118 86.5 102 Z';
const capyTweed = `${[78, 92, 106, 120, 134, 148, 162].map((x) => `<path d="M${x} ${n1(topY(x) + 3)} V126" stroke="#6b5034" stroke-width="1" opacity=".6"/>`).join('')}${[12, 24, 36].map((d) => `<path d="${backLine(d)}" stroke="#6b5034" stroke-width="1" fill="none" opacity=".6"/>`).join('')}`;
const forepartDots = (cx, y0) => dots([[cx, y0], [cx - 4, y0 + 10], [cx + 4, y0 + 10], [cx, y0 + 20], [cx - 7, y0 + 30], [cx + 7, y0 + 30], [cx, y0 + 30]], '#8e1f2f', 1.4);

Object.assign(SUITS, {
  troopersuit: {
    capy: () => `<g>${capyBoots('#2b3a67')}${cloth('#2b4c8c', 126)}${cloth('#e6ebf2', 100, 224, 320)}${[100, 118, 136].map((x) => `<path d="M${x} ${n1(topY(x) + 2)} V${n1(topY(x) + 16)}" stroke="#c7ced9" stroke-width="1.4"/>`).join('')}<circle cx="130" cy="110" r="7" fill="#5ef0ff" stroke="#ff8a3d" stroke-width="2.4"/><circle cx="130" cy="110" r="2.6" fill="#fff"/>${hemLine(115, '#5ef0ff', 1.4)}${hemLine(121, '#ff8a3d', 3)}</g>`,
    lion: () => `<g>${lionLegs('#2b4c8c', '#e6ebf2')}<path d="${LT}" fill="#2b4c8c"/><path d="M77 103 Q100 98 123 103 L124 120 Q100 125 76 120 Z" fill="#e6ebf2"/><path d="M100 104 V121" stroke="#c7ced9" stroke-width="1.2"/><circle cx="100" cy="113" r="4.6" fill="#5ef0ff" stroke="#ff8a3d" stroke-width="1.8"/><path d="M72.5 129 Q100 134 127.5 129" stroke="#ff8a3d" stroke-width="3" fill="none"/><circle cx="90" cy="138.5" r="3" fill="#e6ebf2"/><circle cx="110" cy="138.5" r="3" fill="#e6ebf2"/></g>`,
    heroine: () => `${sleeves('#2b4c8c', true)}${heroPants('#2b4c8c')}<path d="${BODICE}" fill="#2b4c8c"/>${PADS('#e6ebf2', '#c7ced9')}<path d="M85.5 82 Q100 79 114.5 82 L113.6 96 Q100 99 86.4 96 Z" fill="#e6ebf2"/><circle cx="100" cy="89" r="3.2" fill="#5ef0ff" stroke="#ff8a3d" stroke-width="1.3"/><rect x="86.5" y="100.5" width="27" height="3.6" rx="1.5" fill="#ff8a3d"/><circle cx="93.4" cy="124" r="3" fill="#e6ebf2"/><circle cx="106.6" cy="124" r="3" fill="#e6ebf2"/>${heroBoots('#e6ebf2')}`,
  },
  mecharmour: {
    capy: () => `<g>${capyBoots('#4a5566')}${cloth('#9aa8b8', 126, 208, 336, ' stroke="#6f7d8f" stroke-width="1.5"')}${[86, 106, 126, 146, 166].map((x) => `<path d="M${x} ${n1(topY(x) + 3)} V118" stroke="#6f7d8f" stroke-width="1.4"/>`).join('')}<path d="${backLine(16)}" stroke="#6f7d8f" stroke-width="1.4" fill="none"/>${[96, 116, 136, 156].map((x) => `<circle cx="${x}" cy="${backY(x, 9)}" r="1.6" fill="#4a5566"/>`).join('')}<circle cx="128" cy="104" r="8.5" fill="#4a5566"/><circle cx="128" cy="104" r="5.6" fill="#7cf2ff"/><circle cx="126.4" cy="102.4" r="1.6" fill="#fff"/>${hemLine(120, '#ffcc33', 4.5)}${hemLine(120, '#2b2a33', 4.5, ' stroke-dasharray="5 5"')}</g>`,
    lion: () => `<g>${lionLegs('#9aa8b8', '#4a5566', '#6f7d8f')}<path d="${LT}" fill="#9aa8b8" stroke="#6f7d8f" stroke-width="1.2"/><path d="M75 116 Q100 121 125 116 M100 104 V128" stroke="#6f7d8f" stroke-width="1.3" fill="none"/>${dots([[84, 108], [116, 108], [84, 124], [116, 124]], '#4a5566', 1.3)}<circle cx="100" cy="110" r="5.6" fill="#4a5566"/><circle cx="100" cy="110" r="3.6" fill="#7cf2ff"/><path d="M72.5 130 Q100 135 127.5 130" stroke="#ffcc33" stroke-width="4" fill="none"/><path d="M72.5 130 Q100 135 127.5 130" stroke="#2b2a33" stroke-width="4" fill="none" stroke-dasharray="4 4"/><circle cx="90" cy="138.5" r="3" fill="#4a5566"/><circle cx="110" cy="138.5" r="3" fill="#4a5566"/></g>`,
    heroine: () => `${sleeves('#4a5566', true)}${heroPants('#9aa8b8', 1)}<path d="M82 80 H118 L116 104 H84 Z" fill="#9aa8b8" stroke="#6f7d8f" stroke-width="1"/><path d="M84.5 93 H115.5 M100 80 V93" stroke="#6f7d8f" stroke-width="1"/><circle cx="100" cy="98" r="3.8" fill="#4a5566"/><circle cx="100" cy="98" r="2.4" fill="#7cf2ff"/><rect x="72.5" y="77.5" width="14" height="12" rx="2.5" fill="#9aa8b8" stroke="#6f7d8f" stroke-width="1"/><rect x="113.5" y="77.5" width="14" height="12" rx="2.5" fill="#9aa8b8" stroke="#6f7d8f" stroke-width="1"/>${dots([[76, 81], [83, 81], [117, 81], [124, 81], [88, 86], [112, 86]], '#4a5566', 1)}<rect x="84" y="101" width="32" height="4" fill="#ffcc33"/><path d="M84 103 H116" stroke="#2b2a33" stroke-width="4" stroke-dasharray="3 3"/><circle cx="93.4" cy="124" r="3" fill="#4a5566"/><circle cx="106.6" cy="124" r="3" fill="#4a5566"/>${heroBoots('#4a5566')}`,
  },
  dragonarmour: {
    capy: () => `<g>${capyBoots('#1f5f44')}${cloth('#2e9e6e', 126)}${mail(capyRows(5, 122), '#1f7a52', 7)}${[88, 104, 120, 136, 152].map((x) => { const y = topY(x); return `<path d="M${x - 4.5} ${n1(y + 2)} L${x} ${n1(y - 7)} L${x + 4.5} ${n1(y + 2)} Z" fill="#e0b13a"/>`; }).join('')}${hemLine(120, '#e0b13a', 3)}</g>`,
    lion: () => `<g>${lionLegs('#2e9e6e', '#1f5f44')}${mail([[130, 84, 97], [134, 84, 97], [138, 84, 97], [130, 104, 117], [134, 104, 117], [138, 104, 117]], '#1f7a52', 4.5)}<path d="${LT}" fill="#2e9e6e"/>${mail(lionRows(104, 132, 4.5), '#1f7a52', 6)}<path d="M74 104 Q100 112 126 104" stroke="#e0b13a" stroke-width="2.4" fill="none"/><path d="M72.5 129 Q100 134 127.5 129" stroke="#e0b13a" stroke-width="3.4" fill="none"/></g>`,
    heroine: () => `${sleeves('#2e9e6e', true)}${heroPants('#2e9e6e')}${mail(range(106, 140, 4).flatMap((y) => [[y, 88.5, 98], [y, 102, 111.5]]), '#1f7a52', 4)}<path d="${BODICE}" fill="#2e9e6e"/>${mail(heroRows(83, 99, 3.4), '#1f7a52', 4)}${PADS('#2e9e6e', '#1f7a52')}<path d="M90 80 Q100 86 110 80" stroke="#e0b13a" stroke-width="2" fill="none"/><rect x="86.5" y="100.5" width="27" height="3.6" rx="1.5" fill="#e0b13a"/>${heroBoots('#1f5f44')}`,
  },
  vikingarmour: {
    capy: () => `<g>${capyBoots('#5a3a20')}${cloth('#7a2e2e', 128)}${cloth('#a9b1bb', 116, 212, 332)}${mail(capyRows(4, 114))}${hemLine(112, '#6b4226', 4.5)}<circle cx="118" cy="117" r="3.4" fill="#d4a64a" stroke="#8a5a1c" stroke-width="1"/></g>`,
    lion: () => `<g>${lionLegs('#6b5a45', '#5a3a20')}<path d="M84 137 l12 3 M104 137 l12 3" stroke="#8a7a60" stroke-width="1.4"/><path d="${LT}" fill="#7a2e2e"/><path d="M76 102 Q100 96 124 102 L126.5 126 Q100 131 73.5 126 Z" fill="#a9b1bb"/>${mail(lionRows(104, 124, 4))}<path d="M74.5 119 Q100 124 125.5 119" stroke="#6b4226" stroke-width="3.6" fill="none"/><circle cx="100" cy="121.5" r="2.8" fill="#d4a64a" stroke="#8a5a1c" stroke-width="1"/></g>`,
    heroine: () => `${sleeves('#7a2e2e', true)}${heroPants('#6b5a45')}<path d="M89 126 l9 3 M89 131 l9 3 M89 136 l9 3 M102 126 l9 3 M102 131 l9 3 M102 136 l9 3" stroke="#8a7a60" stroke-width="1.2"/><path d="M83 81 Q100 77 117 81 L117.5 119 Q100 122 82.5 119 Z" fill="#a9b1bb"/>${mail(range(83, 117, 3.4).map((y) => [y, 84.5, 115.5]), '#7d8692', 3.6)}<path d="M84 101 H116" stroke="#6b4226" stroke-width="3.6"/><circle cx="100" cy="101" r="2.4" fill="#d4a64a" stroke="#8a5a1c" stroke-width=".8"/>${heroBoots('#5a3a20')}`,
  },
  samurai: {
    capy: () => `<g>${capyBoots('#2b2a33')}${cloth('#2f3e6b', 128)}${cloth('#2b2a3a', 118)}${[7, 14, 21, 28].map((d) => `<path d="${backLine(d, 70, 178)}" stroke="#c0392b" stroke-width="2" fill="none"/>`).join('')}${[86, 102, 118, 134, 150, 166].map((x) => `<path d="M${x} ${n1(topY(x) + 2)} V${backY(x, 30)}" stroke="#e5675c" stroke-width=".9" stroke-dasharray="2 2"/>`).join('')}${hemLine(106, '#d4a64a', 2)}${hemLine(116, '#c0392b', 1.6)}${[84, 106, 128, 150].map((x) => `<path d="M${x} ${n1(113 + 4 * (1 - ((x - 118) / 56) ** 2))} V126" stroke="#14131c" stroke-width="2"/>`).join('')}</g>`,
    lion: () => `<g>${lionLegs('#2f3e6b', '#2b2a33')}<path d="${LT}" fill="#2b2a3a"/>${[106, 111, 116].map((y) => `<path d="M76 ${y} Q100 ${y + 5} 124 ${y}" stroke="#c0392b" stroke-width="1.8" fill="none"/>`).join('')}<path d="M75 120 Q100 125 125 120" stroke="#d4a64a" stroke-width="2" fill="none"/>${[[74, 122], [88, 124], [100, 124], [114, 122]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="13" rx="1" fill="#2b2a3a" stroke="#14131c" stroke-width="1"/><path d="M${x} ${y + 4.5} h12 M${x} ${y + 9} h12" stroke="#c0392b" stroke-width="1.2"/>`).join('')}</g>`,
    heroine: () => `${heroPants('#2f3e6b', 3)}${sleeves('#2f3e6b', true)}<path d="${BODICE}" fill="#2b2a3a"/>${[85, 90, 95].map((y) => `<path d="M${n1(83.6 + (y - 81) * 0.15)} ${y} Q100 ${y + 2} ${n1(116.4 - (y - 81) * 0.15)} ${y}" stroke="#c0392b" stroke-width="1.4" fill="none"/>`).join('')}<path d="M86.5 99 H113.5" stroke="#d4a64a" stroke-width="1.6"/>${[85.5, 93, 100.5, 108].map((x) => `<rect x="${x}" y="102.5" width="7" height="17" rx="1" fill="#2b2a3a" stroke="#14131c" stroke-width=".8"/><path d="M${x} 108 h7 M${x} 113 h7" stroke="#c0392b" stroke-width="1"/>`).join('')}<path d="M82 79 L89 79.5 L88 95 L76 94 Z M118 79 L111 79.5 L112 95 L124 94 Z" fill="#2b2a3a" stroke="#14131c" stroke-width=".8"/><path d="M80 84 l8.5 .5 M78.5 89 l9.5 .5 M120 84 l-8.5 .5 M121.5 89 l-9.5 .5" stroke="#c0392b" stroke-width="1.1"/>${heroBoots('#2b2a33')}`,
  },
  goldarmour: {
    capy: () => `<g>${capyBoots('#d9a21b')}${cloth('#f2c14e', 126, 208, 336, ' stroke="#d9a21b" stroke-width="1.5"')}<path d="${backLine(6)}" stroke="#fff3c4" stroke-width="3" fill="none" opacity=".9"/>${hemLine(108, '#d9a21b', 1.6)}${star(130, 100, 9, '#d62f3a')}${star(130, 100, 4, '#ffd166')}${hemLine(121, '#d62f3a', 3.5)}</g>`,
    lion: () => `<g>${lionLegs('#f2c14e', '#d9a21b', '#d9a21b')}<path d="${LT}" fill="#f2c14e" stroke="#d9a21b" stroke-width="1.2"/><path d="M80 107 Q90 103 100 103" stroke="#fff3c4" stroke-width="2.4" fill="none" stroke-linecap="round"/>${star(100, 115, 6.5, '#d62f3a')}${star(100, 115, 2.8, '#ffd166')}<path d="M73.5 126 Q100 131 126.5 126" stroke="#d9a21b" stroke-width="1.4" fill="none"/><path d="M72.5 130.5 Q100 135.5 127.5 130.5" stroke="#d62f3a" stroke-width="3.4" fill="none"/></g>`,
    heroine: () => `${sleeves('#f2c14e', true)}${heroPants('#f2c14e')}<path d="${BODICE}" fill="#f2c14e" stroke="#d9a21b" stroke-width="1"/>${PADS('#ffd166', '#d9a21b')}<path d="M88 84 Q94 82 100 82" stroke="#fff3c4" stroke-width="1.8" fill="none" stroke-linecap="round"/>${star(100, 91, 4.8, '#d62f3a')}<rect x="86.5" y="100.5" width="27" height="3.6" rx="1.5" fill="#d62f3a"/><path d="M89 124 h8.5 M102.5 124 h8.5" stroke="#d9a21b" stroke-width="1.4"/>${heroBoots('#d9a21b')}`,
  },
  // Year 6: square-necked Tudor velvet with a gold forepart
  tudorgown: {
    capy: () => `<g>${cloth('#8e1f2f', 132)}<path d="M110 98 L128 98 L138 138 Q119 142 100 138 Z" fill="#e0b13a"/>${forepartDots(119, 106)}<path d="${backLine(4)}" stroke="#f4ead0" stroke-width="2.6" fill="none" stroke-dasharray=".1 4.4" stroke-linecap="round"/>${hemLine(130, '#e0b13a', 2.4)}</g>`,
    lion: () => `<g><path d="M76 102 Q100 96 124 102 L134 145 Q100 150 66 145 Z" fill="#8e1f2f"/><path d="M100 104 L113 147 Q100 148.6 87 147 Z" fill="#e0b13a"/>${forepartDots(100, 112)}<path d="M77 104 Q100 109 123 104" stroke="#f4ead0" stroke-width="2.4" fill="none" stroke-dasharray=".1 3.6" stroke-linecap="round"/><path d="M66.5 143 Q100 148 133.5 143" stroke="#e0b13a" stroke-width="2" fill="none"/></g>`,
    heroine: () => `${sleeves('#8e1f2f', true)}<path d="M74 100 Q71.5 106 72.5 110.5 L84 110.5 Q83.5 105.5 83 102 Z M126 100 Q128.5 106 127.5 110.5 L116 110.5 Q116.5 105.5 117 102 Z" fill="#e0b13a" stroke="#b8862a" stroke-width=".8"/><path d="M86.5 102 L113.5 102 L126 147 Q100 151 74 147 Z" fill="#8e1f2f"/><path d="M100 103 L111 148 Q100 149.6 89 148 Z" fill="#e0b13a"/>${forepartDots(100, 112)}<path d="${BODICE}" fill="#8e1f2f"/><path d="M91.5 80 H108.5 L108 86 H92 Z" fill="#f4ead0"/><path d="M91.2 80 V86.6 H108.8 V80" stroke="#fff" stroke-width="1.6" fill="none" stroke-dasharray=".1 2.6" stroke-linecap="round"/><path d="M100 104 V117" stroke="#b8862a" stroke-width="1"/><circle cx="100" cy="119" r="2.4" fill="#b8862a"/>`,
  },
  // the high-waisted white muslin of Jane Austen's day
  regency: {
    capy: () => `<g>${cloth('#f4f1ea', 132, 208, 336, ' stroke="#ddd6c6" stroke-width="1.2"')}${capyFolds('#e3dccb', 132)}<path d="${backLine(15)}" stroke="#7fa7d9" stroke-width="5" fill="none"/>${bowAt(150, backY(150, 15), 1, '#7fa7d9', '#5a86c0')}</g>`,
    lion: () => `<g><path d="${LLONG}" fill="#f4f1ea" stroke="#ddd6c6" stroke-width="1"/><path d="M88 112 L85 142 M100 113 V146 M112 112 L115 142" stroke="#e3dccb" stroke-width="1.4" fill="none"/><path d="M75.6 105 Q100 111 124.4 105 L125 110 Q100 116 75 110 Z" fill="#7fa7d9"/>${bowAt(112, 110, 0.8, '#7fa7d9', '#5a86c0')}</g>`,
    heroine: () => `${puffs('#f4f1ea', '#ddd6c6')}<path d="M87 92 L113 92 L117.5 147 Q100 149.5 82.5 147 Z" fill="#f4f1ea" stroke="#ddd6c6" stroke-width=".8"/><path d="M93 96 L91 146 M100 96 V148 M107 96 L109 146" stroke="#e3dccb" stroke-width="1.1"/><path d="M83 81 Q100 77 117 81 L114.5 93 L85.5 93 Z" fill="#f4f1ea"/><path d="M92 80 Q100 85 108 80" stroke="#ddd6c6" stroke-width="1.2" fill="none"/><path d="M85.5 91 H114.5 V94.6 H85.5 Z" fill="#7fa7d9"/>${bowAt(100, 93, 0.55, '#7fa7d9', '#5a86c0')}`,
  },
  // a mid-Victorian day dress over a crinoline, with a lace collar
  victorian: {
    capy: () => `<g>${cloth('#6b3b6b', 134)}${hemLine(119, '#55295a', 3)}${hemLine(127, '#55295a', 3)}<path d="${backLine(3)}" stroke="#fff" stroke-width="2.4" fill="none" stroke-dasharray="2 2"/><path d="${backLine(17)}" stroke="#c9a0c9" stroke-width="3.5" fill="none"/>${bowAt(162, backY(162, 17), 1, '#c9a0c9', '#a77aa7')}</g>`,
    lion: () => `<g><path d="M77 102 Q100 96 123 102 Q132 122 136 145 Q100 151 64 145 Q68 122 77 102 Z" fill="#6b3b6b"/><path d="M68 128 Q100 134 132 128 M65.5 138 Q100 144 134.5 138" stroke="#55295a" stroke-width="3" fill="none"/>${dots([[100, 107], [100, 112], [100, 117], [100, 122]], '#e0b13a', 1.3)}<path d="M76 104 Q100 110 124 104" stroke="#fff" stroke-width="2.2" fill="none"/></g>`,
    heroine: () => `${sleeves('#6b3b6b', true)}<path d="M87 102 L113 102 Q122 118 127 146 Q100 151 73 146 Q78 118 87 102 Z" fill="#6b3b6b"/><path d="M79 126 Q100 130 121 126 M75.5 137 Q100 141.5 124.5 137" stroke="#55295a" stroke-width="2.6" fill="none"/><path d="${BODICE}" fill="#6b3b6b"/>${dots([[100, 86], [100, 90], [100, 94], [100, 98]], '#e0b13a', 1)}<path d="M91 79 Q100 86 109 79 L110 82 Q100 90 90 82 Z" fill="#fff"/><path d="M86.5 101.5 H113.5" stroke="#55295a" stroke-width="2"/><path d="M74 102.5 L83 104.5 M126 102.5 L117 104.5" stroke="#fff" stroke-width="2"/>`,
  },
  ballgown: {
    capy: () => `<g>${cloth('#e9a3c9', 134)}${hemLine(128, '#f7d1e5', 4)}<path d="${backLine(16)}" stroke="#c2185b" stroke-width="4" fill="none"/>${stars([[96, 92, 4], [124, 84, 3.4], [150, 96, 4.4], [112, 114, 3.6], [166, 110, 3.2], [140, 122, 3]], '#fff')}</g>`,
    lion: () => `<g><path d="${LWIDE}" fill="#e9a3c9"/><path d="M76 103 Q100 108 124 103 L127 124 Q118 130 112 124 Q106 131 100 125 Q94 131 88 124 Q82 130 73 124 Z" fill="#f3c1dc"/><path d="M75.5 106 Q100 112 124.5 106" stroke="#c2185b" stroke-width="3" fill="none"/>${stars([[82, 134, 2.6], [96, 141, 2.2], [112, 136, 2.6], [124, 142, 2], [90, 117, 2], [114, 115, 2]], '#fff')}</g>`,
    heroine: () => `${puffs('#f3c1dc', '#e9a3c9')}<path d="${GOWN}" fill="#e9a3c9"/><path d="M86.5 102 L113.5 102 Q121 114 124 128 Q118 132 112 128 Q106 133 100 128 Q94 133 88 128 Q82 132 76 128 Q79 114 86.5 102 Z" fill="#f3c1dc"/><path d="${BODICE}" fill="#e9a3c9"/><path d="M90 80 Q100 85 110 80" stroke="#c2185b" stroke-width="1.2" fill="none"/><path d="M86.5 100 H113.5 V104 H86.5 Z" fill="#c2185b"/>${bowAt(108, 102, 0.5, '#c2185b', '#8f1244')}${stars([[80, 140, 2.2], [94, 144, 1.8], [110, 141, 2.2], [122, 145, 1.8], [90, 116, 1.6], [109, 114, 1.6]], '#fff')}`,
  },
  tutu: {
    capy: () => `<g>${capyBoots('#f48fb1')}${cloth('#f7b6d2', 116)}${capyTutu()}</g>`,
    lion: () => `<g>${lionLegs('#f7c6d9', '#f48fb1')}<path d="${LSHORT}" fill="#f7b6d2"/>${tutuDisc(100, 125, 35, 8)}</g>`,
    heroine: () => `<path d="M94 104 V145 M106 104 V145" stroke="#f9d3e2" stroke-width="6.6" stroke-linecap="round"/><ellipse cx="92.8" cy="146.8" rx="6.2" ry="3.5" fill="#f48fb1"/><ellipse cx="107.2" cy="146.8" rx="6.2" ry="3.5" fill="#f48fb1"/><path d="M91 140 L96 144 M96 140 L91 144 M104 140 L109 144 M109 140 L104 144" stroke="#f48fb1" stroke-width="1"/>${sleeves('#f7b6d2')}<path d="M83 81 Q100 77 117 81 L114 106 L86 106 Z" fill="#f7b6d2"/>${tutuDisc(100, 105, 26, 6.5)}<path d="M92 80 Q100 85 108 80" stroke="#e98ab2" stroke-width="1.2" fill="none"/>`,
  },
  labcoat: {
    capy: () => `<g>${cloth('#fbfcfd', 130, 208, 336, ' stroke="#c7ced9" stroke-width="1.5"')}${capyFolds('#e3e7ee', 128)}<path d="M136 98 V108" stroke="#2f74e8" stroke-width="2.6" stroke-linecap="round"/><path d="M143 100 V108" stroke="#d62f3a" stroke-width="2.6" stroke-linecap="round"/><rect x="132" y="104" width="16" height="13" rx="2" fill="#fbfcfd" stroke="#c7ced9" stroke-width="1.4"/></g>`,
    lion: () => `<g><path d="${LT}" fill="#fbfcfd" stroke="#c7ced9" stroke-width="1.4"/><path d="M91 101 L100 117 L109 101 Z" fill="#5b8fd6"/><path d="M89 100 L100 118 L111 100 M100 118 V137" stroke="#c7ced9" stroke-width="1.4" fill="none"/><path d="M110 116 V124" stroke="#2f74e8" stroke-width="2" stroke-linecap="round"/><rect x="106" y="121" width="11" height="9" rx="1.5" fill="#fbfcfd" stroke="#c7ced9" stroke-width="1.2"/>${dots([[96.5, 124], [96.5, 131]], '#c7ced9', 1.2)}</g>`,
    heroine: () => `${heroPants('#3b4a6b')}${sleeves('#fbfcfd', true)}<path d="${BODICE}" fill="#5b8fd6"/><path d="M83 80 L100 94 L100 134 Q90 135 79.5 133 Z" fill="#fbfcfd" stroke="#c7ced9" stroke-width="1"/><path d="M117 80 L100 94 L100 134 Q110 135 120.5 133 Z" fill="#fbfcfd" stroke="#c7ced9" stroke-width="1"/><path d="M90 81 L95 91 L89 89 Z M110 81 L105 91 L111 89 Z" fill="#eef1f5" stroke="#c7ced9" stroke-width=".8"/><path d="M108 85 V92" stroke="#2f74e8" stroke-width="1.6" stroke-linecap="round"/><rect x="105.5" y="89" width="7" height="6" rx="1" fill="#fbfcfd" stroke="#c7ced9" stroke-width=".9"/><rect x="104" y="112" width="9" height="8" rx="1.2" fill="#fbfcfd" stroke="#c7ced9" stroke-width=".9"/><rect x="87" y="112" width="9" height="8" rx="1.2" fill="#fbfcfd" stroke="#c7ced9" stroke-width=".9"/><path d="M74 102.5 L83 104.5 M126 102.5 L117 104.5" stroke="#c7ced9" stroke-width="1.2"/>`,
  },
  // a tweed coat with a short cape over the shoulders, like Sherlock Holmes's
  detective: {
    capy: () => `<g>${cloth('#8a6a45', 130)}${capyTweed}${cloth('#7a5c3b', 104, 214, 330)}${hemLine(103, '#5e452c', 1.6)}</g>`,
    lion: () => `<g><path d="${LLONG}" fill="#8a6a45"/>${[84, 92, 100, 108, 116].map((x) => `<path d="M${x} 104 V144" stroke="#6b5034" stroke-width=".9" opacity=".6"/>`).join('')}${[112, 122, 132].map((y) => `<path d="M72 ${y} Q100 ${y + 5} 128 ${y}" stroke="#6b5034" stroke-width=".9" fill="none" opacity=".6"/>`).join('')}<path d="M73 100 Q100 94 127 100 L131 119 Q100 125 69 119 Z" fill="#7a5c3b"/><path d="M69 119 Q100 125 131 119" stroke="#5e452c" stroke-width="1.6" fill="none"/>${dots([[100, 127], [100, 134], [100, 141]], '#3d2a18')}</g>`,
    heroine: () => `${heroPants('#4a3b2e')}${sleeves('#8a6a45', true)}<path d="M83 80 L117 80 L121 138 Q100 141 79 138 Z" fill="#8a6a45"/><path d="M88 90 V139 M94 90 V140 M106 90 V140 M112 90 V139 M80 112 H120 M80 124 H121" stroke="#6b5034" stroke-width=".8" opacity=".6"/><path d="M81 80 Q100 74 119 80 L125 100 Q100 106 75 100 Z" fill="#7a5c3b"/><path d="M75 100 Q100 106 125 100" stroke="#5e452c" stroke-width="1.4" fill="none"/><path d="M93 79 L100 85 L107 79" stroke="#5e452c" stroke-width="1.4" fill="none"/>${dots([[100, 110], [100, 118], [100, 126]], '#3d2a18', 1.1)}${heroBoots('#5a3a20')}`,
  },
  explorerkit: {
    capy: () => `<g>${capyBoots('#6b4226')}${cloth('#c8a96a', 124)}${[[104, 94], [138, 92]].map(([x, y]) => `<rect x="${x}" y="${y}" width="14" height="12" rx="2" fill="#b8975a" stroke="#a2834a" stroke-width="1"/><path d="M${x} ${y + 3.6} h14" stroke="#a2834a" stroke-width="1"/>`).join('')}${hemLine(112, '#6b4226', 4)}<rect x="114" y="113" width="8" height="7" rx="1.4" fill="#d4a64a"/></g>`,
    lion: () => `<g>${lionLegs('#9c7f4a', '#6b4226')}<path d="${LT}" fill="#c8a96a"/><path d="M92 101 L100 108 L108 101" stroke="#a2834a" stroke-width="1.6" fill="none"/><path d="M100 108 V124" stroke="#a2834a" stroke-width="1.2"/>${[[84, 110], [106, 110]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="8" rx="1.2" fill="#b8975a" stroke="#a2834a" stroke-width="1"/><path d="M${x} ${y + 2.6} h10" stroke="#a2834a" stroke-width="1"/>`).join('')}<path d="M73.5 126 Q100 131 126.5 126" stroke="#6b4226" stroke-width="3.6" fill="none"/><rect x="97" y="126.5" width="6" height="5" rx="1" fill="#d4a64a"/></g>`,
    heroine: () => `${heroPants('#9c7f4a')}${sleeves('#c8a96a')}<path d="M76 94.5 L84.5 96.5 M124 94.5 L115.5 96.5" stroke="#a2834a" stroke-width="2.4"/><path d="${BODICE}" fill="#c8a96a"/><path d="M93 79.5 L100 86 L107 79.5 L105 83.5 L100 87 L95 83.5 Z" fill="#b8975a"/>${[[88, 88], [104, 88]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="7" rx="1" fill="#b8975a" stroke="#a2834a" stroke-width=".8"/><path d="M${x} ${y + 2.2} h8" stroke="#a2834a" stroke-width=".8"/>`).join('')}<path d="M100 87 V101" stroke="#a2834a" stroke-width=".9"/><rect x="86.5" y="100.5" width="27" height="4" rx="1.4" fill="#6b4226"/><rect x="97.5" y="100" width="5" height="5" rx="1" fill="#d4a64a"/>${heroBoots('#6b4226')}`,
  },
  // a starry robe for any wizard
  wizardrobe: {
    capy: () => `<g>${cloth('#3b2fb0', 134)}${stars([[96, 92, 4], [124, 84, 3.4], [150, 98, 4.4], [112, 114, 3.6], [140, 122, 3]], '#ffd166')}${moon(166, 104, 6, '#3b2fb0')}${hemLine(129, '#e0b13a', 3)}</g>`,
    lion: () => `<g><path d="${LWIDE}" fill="#3b2fb0"/><path d="M100 103 V148" stroke="#e0b13a" stroke-width="2.4"/>${stars([[86, 114, 3.4], [114, 124, 3.6], [84, 136, 3], [118, 140, 2.6], [110, 108, 2.4]], '#ffd166')}${moon(90, 126, 3.6, '#3b2fb0')}</g>`,
    heroine: () => `<path d="M84 80 Q73 84 69 109 L84 109 Q85 92 88 84 Z M116 80 Q127 84 131 109 L116 109 Q115 92 112 84 Z" fill="#3b2fb0"/><path d="M69 109 L84 109 M131 109 L116 109" stroke="#e0b13a" stroke-width="2"/><path d="M83 80 L117 80 L125 147 Q100 151 75 147 Z" fill="#3b2fb0"/><path d="M100 84 V149" stroke="#e0b13a" stroke-width="2"/><path d="M91 80 Q100 87 109 80" stroke="#e0b13a" stroke-width="2" fill="none"/>${stars([[90, 112, 3.4], [110, 98, 3], [86, 134, 3], [113, 128, 3.6], [93, 95, 2.4]], '#ffd166')}${moon(108, 140, 3.6, '#3b2fb0')}<path d="M85 102 Q100 106 115 102" stroke="#e0b13a" stroke-width="1.6" fill="none"/>`,
  },
});

// --- things to ride on or in. The whole companion is lifted (and shrunk) onto the seat, between
// what is drawn behind it and what is drawn in front of it; everything stays inside the 200×160 box,
// with the wheels, hooves or feet on the ground at y 150, so scenes place it as usual.
const LEGWEAR = { racesuit: '#d62f3a', spacesuit: '#eef1f5', herosuit: '#2f74e8', armour: '#a9b1bb' };
const BOOTS = { racesuit: '#2b2a33', spacesuit: '#9aa3ad', herosuit: '#d62f3a', armour: '#7d8692' };
Object.assign(LEGWEAR, { troopersuit: '#2b4c8c', mecharmour: '#9aa8b8', dragonarmour: '#2e9e6e', vikingarmour: '#6b5a45', samurai: '#2f3e6b', goldarmour: '#f2c14e', explorerkit: '#9c7f4a', tutu: '#f7c6d9' });
Object.assign(BOOTS, { troopersuit: '#e6ebf2', mecharmour: '#4a5566', dragonarmour: '#1f5f44', vikingarmour: '#5a3a20', samurai: '#2b2a33', goldarmour: '#d9a21b', explorerkit: '#6b4226', tutu: '#f48fb1' });
/** The rider's near leg, hanging down the side of the animal (the capybara lies along its back instead). */
function dangle(sp, f, worn, x, y, len = 20) {
  const suit = worn.find((a) => LEGWEAR[a]);
  if (sp === 'lion') return `<rect x="${x - 6}" y="${y}" width="12" height="${len}" rx="6" fill="${LEGWEAR[suit] || f.body}"/><ellipse cx="${x - 1}" cy="${y + len}" rx="8" ry="4.4" fill="${BOOTS[suit] || f.light}"/>`;
  if (isPerson(sp)) return `<path d="M${x} ${y} V${y + len}" stroke="${LEGWEAR[suit] || f.skin}" stroke-width="5.5" stroke-linecap="round"/><ellipse cx="${x - 2}" cy="${y + len + 1.5}" rx="4.6" ry="2.6" fill="${BOOTS[suit] || '#7a4a2a'}"/>`;
  return '';
}

function horseParts(c) {
  const leg = (x, top, fill) => `<path d="M${x - 5.5} ${top} Q${x - 5} 128 ${x - 4.2} 143 L${x + 4.2} 143 Q${x + 5} 128 ${x + 5.5} ${top} Z" fill="${fill}"/><rect x="${x - 5}" y="142" width="10" height="8" rx="2.5" fill="${c.hoof}"/>`;
  return {
    back: `${leg(70, 108, c.dark)}${leg(138, 108, c.dark)}<path d="M154 94 Q181 98 178 124 Q176 140 167 147 Q171 124 157 108 Z" fill="${c.mane}"/><path d="M62 108 Q54 84 40 62 L60 48 Q78 72 94 94 Z" fill="${c.coat}"/><path d="M38 50 Q52 40 64 50 Q67 57 61 64 L39 88 Q31 95 24 89 Q18 82 25 75 Z" fill="${c.coat}"/><ellipse cx="26" cy="84" rx="7.5" ry="6" transform="rotate(-42 26 84)" fill="${c.dark}" opacity=".5"/><circle cx="24.5" cy="85" r="1.4" fill="#2b2a33"/><path d="M27 89.5 q3 1 5 -1" stroke="#2b2a33" stroke-width="1.1" fill="none" stroke-linecap="round"/>${c.blaze ? '<path d="M41 55 Q36 66 29 78" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>' : ''}<path d="M48 46 L51 33 L58 44 Z" fill="${c.coat}"/><path d="M50.5 43 L52 37 L55 42.5 Z" fill="${c.dark}"/><circle cx="47" cy="58" r="2.7" fill="#2b2a33"/><circle cx="47.8" cy="57.1" r=".9" fill="#fff"/><path d="M54 42 Q66 42 68 54 Q76 70 96 90 Q87 95 80 88 Q68 74 62 62 Q56 52 54 42 Z" fill="${c.mane}"/><path d="M51 44 Q44 45 42 54 Q48 50 55 50 Z" fill="${c.mane}"/>`,
    front: `<ellipse cx="112" cy="104" rx="48" ry="21" fill="${c.coat}"/>${leg(84, 112, c.coat)}${leg(150, 110, c.coat)}<path d="M150 92 Q158 100 156 112" stroke="${c.dark}" stroke-width="1.6" fill="none" opacity=".6"/>`,
  };
}
const KNIGHT_HORSE = horseParts({ coat: '#cfd4dc', dark: '#a4acb8', mane: '#7d8692', hoof: '#5f6772' }); // a grey charger
const PONY = horseParts({ coat: '#e3b169', dark: '#c38f4b', mane: '#f7ecd0', hoof: '#6b4e33', blaze: true });
const PONY_T = 'translate(10 15) scale(.9)'; // a pony is smaller: the horse, shrunk about its hooves
const caparison = `<path d="M70 92 Q112 76 158 92 L161 127 ${Array.from({ length: 11 }, (_, i) => `L${n1(161 - (i + 0.5) * 8.4)} ${i % 2 ? 127 : 132}`).join(' ')} L68 127 Z" fill="#2f5fa8"/><path d="M161 127 ${Array.from({ length: 11 }, (_, i) => `L${n1(161 - (i + 0.5) * 8.4)} ${i % 2 ? 127 : 132}`).join(' ')} L68 127" stroke="#d4a64a" stroke-width="2" fill="none" stroke-linejoin="round"/>${star(84, 110, 5, '#ffd166')}${star(142, 110, 5, '#ffd166')}<path d="M94 84 Q110 78 126 84 L124 92 Q110 96 96 92 Z" fill="#b3261e"/>`;
const plume = '<path d="M50 34 Q46 20 57 14 Q56 25 60 33 Z" fill="#d62f3a"/><path d="M40 60 L58 52 M30 80 L45 69" stroke="#d4a64a" stroke-width="2" stroke-linecap="round"/>';
const saddle = '<path d="M90 86 Q110 92 130 86 L132 104 Q110 110 88 104 Z" fill="#e5737f"/><path d="M88 104 Q110 110 132 104" stroke="#fff" stroke-width="2" fill="none"/><path d="M95 87 Q110 81 125 87 L123 96 Q110 100 97 96 Z" fill="#7a4a2a"/><rect x="108" y="104" width="5" height="20" fill="#5a3a20"/>';

const DINO = { body: '#6cbf5a', dark: '#4f9a43', belly: '#b5e39b', spot: '#58a94a' };
const dinoLeg = (x, fill) => `<rect x="${x - 9}" y="114" width="18" height="36" rx="8" fill="${fill}"/><circle cx="${x - 5}" cy="148" r="2.3" fill="#fff"/><circle cx="${x}" cy="148.6" r="2.3" fill="#fff"/><circle cx="${x + 5}" cy="148" r="2.3" fill="#fff"/>`;
const bikeWheel = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="#2b2a33" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="14.6" fill="none" stroke="#c7ced6" stroke-width="1.4"/>${[0, 30, 60, 90, 120, 150].map((a) => { const t = (a * Math.PI) / 180, dx = n1(Math.cos(t) * 15), dy = n1(Math.sin(t) * 15); return `<path d="M${cx - dx} ${cy - dy} L${cx + dx} ${cy + dy}" stroke="#b9c1cb" stroke-width="1"/>`; }).join('')}<circle cx="${cx}" cy="${cy}" r="2.6" fill="#8d96a3"/>`;
const skateFront = (cx, y, s = 1) => `<g transform="translate(${cx} ${y}) scale(${s})"><rect x="-10" y="-9" width="20" height="14" rx="6" fill="#f48fb1"/><path d="M-3.5 -6 l7 3 M3.5 -6 l-7 3 M-3.5 -1.5 l7 2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><rect x="-11" y="4" width="22" height="3.6" rx="1.6" fill="#5143d9"/><circle cx="-6" cy="10.4" r="3.6" fill="#ffd166" stroke="#d9a21b" stroke-width="1"/><circle cx="6" cy="10.4" r="3.6" fill="#ffd166" stroke="#d9a21b" stroke-width="1"/></g>`;
const skateSide = (x, w, bottom) => `<rect x="${x - 1}" y="${bottom - 10}" width="${w + 2}" height="10" rx="4" fill="#f48fb1"/><path d="M${x + 3} ${bottom - 7} h${w - 6}" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2"/><rect x="${x - 2}" y="${bottom - 1}" width="${w + 4}" height="3" rx="1.5" fill="#5143d9"/><circle cx="${x + 3}" cy="${bottom + 5}" r="3.4" fill="#ffd166" stroke="#d9a21b" stroke-width="1"/><circle cx="${x + w - 3}" cy="${bottom + 5}" r="3.4" fill="#ffd166" stroke="#d9a21b" stroke-width="1"/>`;

// seat: per companion, [scale, x, y] for its whole drawing; friendAt: where a friend rides along
export const MOUNTS = {
  horse: {
    seat: { lion: [0.66, 42, 1], capybara: [0.6, 39, 4], heroine: [0.72, 36, 2], hero: [0.72, 36, 2] }, shadow: [104, 151, 74],
    back: () => KNIGHT_HORSE.back + plume,
    front: (sp, f, worn) => KNIGHT_HORSE.front + caparison + dangle(sp, f, worn, sp === 'lion' ? 113 : 109, 88, 24),
    friendAt: 'translate(150 90) scale(.7)',
  },
  pony: {
    seat: { lion: [0.62, 46, 12], capybara: [0.56, 45, 15], heroine: [0.68, 41, 13], hero: [0.68, 41, 13] }, shadow: [104, 151, 66],
    back: () => `<g transform="${PONY_T}">${PONY.back}</g>`,
    front: (sp, f, worn) => `<g transform="${PONY_T}">${PONY.front}${saddle}</g>${dangle(sp, f, worn, sp === 'lion' ? 114 : 110, 95, 20)}`,
    friendAt: 'translate(146 97) scale(.66)',
  },
  dinoride: {
    seat: { lion: [0.64, 46, 0], capybara: [0.58, 44, 4], heroine: [0.7, 40, 2], hero: [0.7, 40, 2] }, shadow: [110, 151, 82],
    back: () => `${dinoLeg(78, DINO.dark)}${dinoLeg(144, DINO.dark)}<path d="M150 92 Q186 100 199 134 Q188 130 180 122 Q166 110 150 118 Z" fill="${DINO.body}"/><path d="M76 102 Q56 76 50 54 Q46 38 32 33" stroke="${DINO.body}" stroke-width="19" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="33" rx="15" ry="11" fill="${DINO.body}"/><circle cx="25" cy="28" r="3" fill="#2b2a33"/><circle cx="25.9" cy="27.1" r="1" fill="#fff"/><path d="M13 37 Q20 42 29 39" stroke="#2b2a33" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="13" cy="30" r="1.3" fill="#2b2a33"/><ellipse cx="33" cy="37" rx="3" ry="1.8" fill="#f2a0a0" opacity=".7"/><circle cx="52" cy="60" r="3" fill="${DINO.spot}"/><circle cx="62" cy="80" r="3.6" fill="${DINO.spot}"/>`,
    front: (sp, f, worn) => `<ellipse cx="112" cy="108" rx="50" ry="27" fill="${DINO.body}"/><path d="M68 118 Q112 142 156 118 Q150 133 112 135 Q74 133 68 118 Z" fill="${DINO.belly}"/><circle cx="136" cy="96" r="5" fill="${DINO.spot}"/><circle cx="150" cy="108" r="3.6" fill="${DINO.spot}"/><circle cx="80" cy="98" r="4" fill="${DINO.spot}"/>${dinoLeg(92, DINO.body)}${dinoLeg(150, DINO.body)}<path d="M96 83 Q112 78 128 83 L127 91 Q112 95 97 91 Z" fill="#d62f3a"/>${dangle(sp, f, worn, sp === 'lion' ? 115 : 111, 86, 24)}`,
    friendAt: 'translate(152 86) scale(.7)',
  },
  rocket: {
    seat: { lion: [0.7, 42, 6], capybara: [0.6, 42, 10], heroine: [0.74, 38, 8], hero: [0.74, 38, 8] }, shadow: [104, 156, 60],
    back: () => '<path d="M168 99 Q190 104 199 110 Q190 116 168 121 Z" fill="#ff8a3d"/><path d="M168 103.5 Q182 107 189 110 Q182 113 168 116.5 Z" fill="#ffd166"/><path d="M136 96 L155 74 Q161 71 163 78 L166 96 Z" fill="#d62f3a"/>',
    front: (sp, f, worn) => `<path d="M36 110 Q40 95 66 94 L164 94 Q170 94 170 100 L170 120 Q170 126 164 126 L66 126 Q40 125 36 110 Z" fill="#eef1f5" stroke="#c7ced9" stroke-width="1.5"/><path d="M36 110 Q40 95 66 94 L66 126 Q40 125 36 110 Z" fill="#d62f3a"/><rect x="150" y="94.8" width="6" height="30.4" fill="#2f74e8"/><circle cx="84" cy="110" r="7.5" fill="#bfe6ff" stroke="#9aa3ad" stroke-width="3"/><path d="M80.5 107 q2 -2 4.5 -2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M136 124 L156 144 Q161 147 164 141 L166 124 Z" fill="#d62f3a"/>${dangle(sp, f, worn, sp === 'lion' ? 117 : 113, 120, 16)}${star(26, 70, 4, '#ffd166')}${star(182, 82, 3, '#ffd166')}`,
    friendAt: 'translate(148 95) scale(.68)',
  },
  gokart: {
    seat: { lion: [0.78, 44, 22], capybara: [0.62, 48, 32], heroine: [0.8, 42, 20], hero: [0.8, 42, 20] }, shadow: [100, 151, 82],
    back: () => '<path d="M161 112 L163 97 M173 112 L175 97" stroke="#2b2a33" stroke-width="3"/><rect x="154" y="90" width="29" height="7" rx="2.5" fill="#d62f3a"/>',
    front: () => `<path d="M172 120 h12" stroke="#8d96a3" stroke-width="4.5" stroke-linecap="round"/><path d="M22 130 Q20 120 34 118 L80 116 Q86 108 96 108 L148 110 Q170 112 174 124 L176 135 Q176 141 170 141 L28 141 Q22 141 22 135 Z" fill="#d62f3a"/><path d="M30 127 H168" stroke="#fff" stroke-width="3"/><path d="M58 117 L68 104" stroke="#2b2a33" stroke-width="3" stroke-linecap="round"/><ellipse cx="69" cy="102" rx="3.6" ry="8" transform="rotate(32 69 102)" fill="none" stroke="#2b2a33" stroke-width="3"/><rect x="15" y="127" width="15" height="7" rx="3.5" fill="#2b2a33"/><circle cx="126" cy="123" r="8" fill="#fff"/>${numberSeven(126, 127.5, 12, '#d62f3a')}<circle cx="50" cy="139" r="11" fill="#2b2a33"/><circle cx="50" cy="139" r="4.4" fill="#c7ced6"/><circle cx="148" cy="138" r="12" fill="#2b2a33"/><circle cx="148" cy="138" r="4.8" fill="#c7ced6"/>`,
    friendAt: 'translate(162 112) scale(.62)',
  },
  bicycle: {
    seat: { lion: [0.7, 46, 4], capybara: [0.55, 51, 15], heroine: [0.74, 42, 6], hero: [0.74, 42, 6] }, shadow: [100, 151, 76],
    back: () => `${bikeWheel(48, 133)}${bikeWheel(150, 133)}<path d="M150 133 L104 134 L66 98 M104 134 L114 96 L150 133 M68 100 L114 101" stroke="#2e9e8f" stroke-width="4.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M66 98 L48 133" stroke="#2e9e8f" stroke-width="4" stroke-linecap="round"/><path d="M66 98 L62 84 Q70 79 80 83" stroke="#5f6772" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M76 82.4 L83 84" stroke="#2b2a33" stroke-width="5" stroke-linecap="round"/><path d="M104 94 Q115 90 127 94 Q122 98.5 108 98 Z" fill="#2b2a33"/><path d="M33 80 L59 80 L56 98 L36 98 Z" fill="#c9a26d" stroke="#a27e4d" stroke-width="1.5" stroke-linejoin="round"/><path d="M34.5 86 H57.5 M35.3 92 H56.7 M42 80 L42.5 98 M50 80 L49.5 98" stroke="#a27e4d" stroke-width="1"/>${flower5(40, 76, 3.6, '#f48fb1')}${flower5(52, 75, 3.2, '#fff')}`,
    front: () => '<circle cx="104" cy="134" r="5" fill="#5f6772"/><path d="M104 134 L112 144" stroke="#5f6772" stroke-width="3" stroke-linecap="round"/><rect x="107" y="142.4" width="11" height="3.6" rx="1.6" fill="#2b2a33"/>',
    friendAt: 'translate(46 80) scale(.55)', // in the basket
  },
  rollerskates: {
    seat: { lion: [0.96, 4, 0], capybara: [0.96, 4, 0], heroine: [0.96, 4, 0], hero: [0.96, 4, 0] }, shadow: [104, 157, 46], narrow: true,
    back: () => '',
    front: (sp) => (sp === 'lion' ? skateFront(89.4, 139.2) + skateFront(110.6, 139.2) : isPerson(sp) ? skateFront(93.3, 141, 0.55) + skateFront(106.7, 141, 0.55) : [[63.5, 15.4, 142], [80.8, 15.4, 142], [144.2, 15.4, 142], [161.4, 14.4, 140]].map(([x, w, b]) => skateSide(x, w, b)).join('')),
  },
};

// a friendly dragon, wings raised behind the rider
const DRAGON = { body: '#d8452f', dark: '#a8321f', belly: '#ffcf7a', stripe: '#e8a94a', wing: '#ef7f5f', horn: '#f4e3c1' };
const dragonLeg = (x, fill) => `<rect x="${x - 9}" y="114" width="18" height="34" rx="8" fill="${fill}"/><path d="M${x - 9} 150 L${x - 6.5} 144 L${x - 4} 150 Z M${x - 2.5} 150 L${x} 144 L${x + 2.5} 150 Z M${x + 4} 150 L${x + 6.5} 144 L${x + 9} 150 Z" fill="${DRAGON.horn}"/>`;
const spike = (x, y, a, fill = DRAGON.dark) => `<path d="M-5 2 L0 -8 L5 2 Z" transform="translate(${x} ${y}) rotate(${a})" fill="${fill}"/>`;
MOUNTS.dragon = {
  seat: { lion: [0.64, 46, 0], capybara: [0.58, 44, 4], heroine: [0.7, 40, 2], hero: [0.7, 40, 2] }, shadow: [110, 151, 82],
  back: () => `<path d="M118 92 Q110 52 132 30 Q146 16 170 11 Q163 26 173 32 Q160 38 167 50 Q152 50 157 64 Q141 64 141 84 Z" fill="${DRAGON.wing}" stroke="${DRAGON.dark}" stroke-width="2" stroke-linejoin="round"/><path d="M121 88 Q126 52 169 12 M131 62 L166 50 M135 76 L156 64 M127 44 L172 32" stroke="${DRAGON.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>${dragonLeg(78, DRAGON.dark)}${dragonLeg(144, DRAGON.dark)}${[[160, 96, 20], [172, 102, 35], [182, 111, 50]].map(([x, y, a]) => spike(x, y, a)).join('')}<path d="M150 92 Q184 99 192 126 Q183 124 177 118 Q165 110 150 118 Z" fill="${DRAGON.body}"/><path d="M186 120 L199 124 L193 136 Z" fill="${DRAGON.dark}"/>${[[66, 81, -40], [58, 66, -25], [54, 50, -10], [46, 38, 15]].map(([x, y, a]) => spike(x + 8, y, a + 60)).join('')}<path d="M76 102 Q56 76 50 54 Q46 38 32 33" stroke="${DRAGON.body}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M34 20 Q40 6 50 2 Q44 12 41 22 Z M26 19 Q28 8 34 4 Q32 12 31.5 19 Z" fill="${DRAGON.horn}"/><path d="M10 29 Q12 19 26 18.5 Q40 18.5 44 30 Q46 40 34 44 L16 44 Q6 43 6 36 Q6 31 10 29 Z" fill="${DRAGON.body}"/><path d="M41 26 L51 23 L45 33 Z" fill="${DRAGON.dark}"/><circle cx="29" cy="27.5" r="3.6" fill="#fff"/><circle cx="28.4" cy="28" r="2.2" fill="#2b2a33"/><circle cx="29.2" cy="27.2" r=".8" fill="#fff"/><circle cx="11" cy="32" r="1.3" fill="#7a2416"/><path d="M8 38.5 Q18 44 31 40.5" stroke="#7a2416" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="36" cy="38" rx="3" ry="1.8" fill="#f2a0a0" opacity=".7"/><path d="M55 64 Q62 80 72 92" stroke="${DRAGON.belly}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>`,
  front: (sp, f, worn) => `<ellipse cx="112" cy="108" rx="50" ry="27" fill="${DRAGON.body}"/><path d="M68 118 Q112 142 156 118 Q150 133 112 135 Q74 133 68 118 Z" fill="${DRAGON.belly}"/>${[84, 98, 112, 126, 140].map((x) => `<path d="M${x} ${n1(122 + 6 * (1 - ((x - 112) / 44) ** 2))} V${n1(129 + 5 * (1 - ((x - 112) / 44) ** 2))}" stroke="${DRAGON.stripe}" stroke-width="1.6"/>`).join('')}${dots([[136, 96], [150, 108], [80, 98]], DRAGON.dark, 3)}${dragonLeg(92, DRAGON.body)}${dragonLeg(150, DRAGON.body)}<path d="M96 83 Q112 78 128 83 L127 91 Q112 95 97 91 Z" fill="#2f5fa8"/><path d="M97 91 Q112 95 127 91" stroke="#ffd166" stroke-width="1.6" fill="none"/>${dangle(sp, f, worn, sp === 'lion' ? 115 : 111, 86, 24)}`,
  friendAt: 'translate(152 86) scale(.7)',
};

/** The companion carried by (or sitting in) something it rides. */
function mountedSVG(id, species, opts, fit) {
  const M = MOUNTS[id], sp = SPECIES[species] ? species : 'capybara';
  const f = sp === 'lion' ? LION_FURS[opts.fur] || LION_FURS.caramel : isPerson(sp) ? lookOf(sp, opts.look) : FURS[opts.fur] || FURS.caramel;
  const wear = { ...opts.wear };
  delete wear.beside; // the lamp stays at home while the companion rides
  // a friend rides along on the back of it (the capybara keeps carrying its own)
  const friend = sp !== 'capybara' && M.friendAt ? wear.friend : null;
  if (friend) delete wear.friend;
  const worn = Object.values(wear);
  const [k, tx, ty] = M.seat[sp];
  const rider = capybaraSVG({ ...opts, species: sp, wear }).replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<ellipse[^>]*fill="#000" opacity=".08"\/>/, '');
  const svg = `<svg viewBox="0 0 200 160" role="img" aria-label="${opts.title || SPECIES[sp]}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="${M.shadow[0]}" cy="${M.shadow[1] + 3}" rx="${M.shadow[2]}" ry="5" fill="#000" opacity=".08"/>
  ${M.back(sp, f, worn)}
  <g transform="translate(${tx} ${ty})${k === 1 ? '' : ` scale(${k})`}">${rider}</g>
  ${M.front(sp, f, worn)}
  ${friend ? `<g transform="${M.friendAt}">${FRIENDS[friend]}</g>` : ''}
</svg>`;
  return fit && isPerson(sp) && M.narrow ? svg.replace('viewBox="0 0 200 160"', 'viewBox="30 0 140 160"') : svg;
}

/** A head-and-shoulders picture of one of a person's looks, for the picker. */
export const lookThumb = (look, species = HERO_LOOKS[look] && !LOOKS[look] ? 'hero' : 'heroine') => capybaraSVG({ species, look, mood: 'happy', title: looksOf(species)[look]?.label }).replace('viewBox="0 0 200 160"', species === 'hero' ? 'viewBox="68 10 64 64"' : 'viewBox="68 4 64 64"');

export function capybaraEl(opts, className = 'capy') {
  const wrap = document.createElement('div');
  wrap.className = className;
  wrap.innerHTML = capybaraSVG({ fit: true, ...opts });
  wrap.companion = { opts, className, make: capybaraEl }; // so a tapped lamp can redraw it (js/ui/lamp.js)
  return wrap;
}

// friendly names and facts for whichever animal it is
export const companionNoun = (species) => ({ lion: 'lion', heroine: 'heroine', hero: 'hero' })[species] || 'capybara';
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
  // true stories of young people who did remarkable things
  hero: [
    'Louis Braille was 15 when he invented a way for blind people like him to read by touch, using raised dots.',
    'Blaise Pascal was still a teenager when he built a calculating machine to help his father, a tax official, with his sums.',
    'Wolfgang Amadeus Mozart was making up his own music by the time he was five.',
    'Tutankhamun became pharaoh of Ancient Egypt when he was only about nine years old.',
    'Pelé was 17 when he helped Brazil win the football World Cup in 1958.',
    'Jordan Romero was 13 when he climbed to the top of Mount Everest in 2010.',
    'Laura Dekker was 16 when she finished sailing all the way around the world on her own.',
    'Philo Farnsworth said he first had the idea for electronic television at 14, while ploughing a field.',
    'In 2021 Oliver Daemen, aged 18, became the youngest person to fly into space.',
  ],
};

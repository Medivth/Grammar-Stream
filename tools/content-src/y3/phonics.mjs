// Year 3 phonics, carrying on from the Year 2 Read Write Inc.-style Speed Sounds: the complex
// Speed Sounds (every spelling of a sound, from eigh in eight to augh in caught) and reading
// and spelling long words chunk by chunk, Fred in your head. Written for this app.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `reading.y3.${id}`, topic: `reading.y3-${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const choiceOnly = { formats: ['choice'] };

// [the sound, as in, a word, the spelling in that word, three other spellings, other words with it]
const COMPLEX = [
  ['ay', 'may I play', 'eight', 'eigh', ['ay', 'ai', 'a-e'], 'eight, weigh, neighbour'],
  ['ay', 'may I play', 'they', 'ey', ['ay', 'ai', 'eigh'], 'they, grey, obey'],
  ['ay', 'may I play', 'great', 'ea', ['ai', 'ay', 'a-e'], 'great, break, steak'],
  ['ay', 'may I play', 'straight', 'aigh', ['ai', 'eigh', 'a-e'], 'straight'],
  ['ee', 'what can you see', 'field', 'ie', ['ee', 'ea', 'ey'], 'field, chief, shield'],
  ['ee', 'what can you see', 'key', 'ey', ['ee', 'ea', 'e'], 'key, monkey, donkey'],
  ['ee', 'what can you see', 'happy', 'y', ['ee', 'ey', 'ie'], 'happy, funny, sunny'],
  ['igh', 'fly high', 'sky', 'y', ['igh', 'ie', 'i-e'], 'sky, fly, cry'],
  ['igh', 'fly high', 'pie', 'ie', ['igh', 'y', 'i-e'], 'pie, tie, lie'],
  ['oa', 'goat in a boat', 'toe', 'oe', ['oa', 'ow', 'o-e'], 'toe, goes, hoe'],
  ['oo', 'poo at the zoo', 'fruit', 'ui', ['oo', 'ew', 'ue'], 'fruit, juice, suit'],
  ['oo', 'poo at the zoo', 'soup', 'ou', ['oo', 'ew', 'ue'], 'soup, group, you'],
  ['oo', 'poo at the zoo', 'blue', 'ue', ['oo', 'ew', 'u-e'], 'blue, glue, true'],
  ['or', 'shut the door', 'caught', 'augh', ['or', 'aw', 'ough'], 'caught, taught, daughter'],
  ['or', 'shut the door', 'bought', 'ough', ['or', 'aw', 'augh'], 'bought, thought, brought'],
  ['or', 'shut the door', 'walk', 'al', ['or', 'aw', 'au'], 'walk, talk, chalk'],
  ['or', 'shut the door', 'four', 'our', ['or', 'ore', 'oor'], 'four, pour, your'],
  ['or', 'shut the door', 'launch', 'au', ['or', 'aw', 'al'], 'launch, astronaut, autumn'],
  ['ur', 'nurse for a purse', 'learn', 'ear', ['ur', 'er', 'ir'], 'learn, early, earth'],
  ['ur', 'nurse for a purse', 'word', 'or', ['ur', 'ir', 'er'], 'word, work, world'],
  ['air', 'that’s not fair', 'bear', 'ear', ['air', 'are', 'ere'], 'bear, wear, pear'],
  ['air', 'that’s not fair', 'where', 'ere', ['air', 'are', 'ear'], 'where, there'],
  ['u', 'cup', 'young', 'ou', ['u', 'o', 'oo'], 'young, touch, double'],
  ['sh', 'shell', 'station', 'ti', ['sh', 'ch', 'ci'], 'station, action, potion'],
  ['sh', 'shell', 'chef', 'ch', ['sh', 'ti', 'ci'], 'chef, machine, parachute'],
  ['s', 'sun', 'science', 'sc', ['s', 'ps', 'ss'], 'science, scene, scissors'],
  ['n', 'net', 'gnome', 'gn', ['n', 'kn', 'nn'], 'gnome, gnaw, sign'],
  ['f', 'fish', 'dolphin', 'ph', ['f', 'ff', 'gh'], 'dolphin, phone, alphabet'],
];

// [word, syllables]
const BEATS = [['adventure', 3], ['fantastic', 3], ['dinosaur', 3], ['caterpillar', 4], ['astronaut', 3], ['information', 4], ['helicopter', 4], ['remember', 3], ['volcano', 3], ['television', 4], ['champion', 3], ['crocodile', 3]];
const CHUNKS = [
  ['fantastic', 'fan-tas-tic', ['fa-nt-astic', 'fant-as-tic', 'f-an-tastic']],
  ['dinosaur', 'di-no-saur', ['din-os-aur', 'd-ino-saur', 'dino-s-aur']],
  ['remember', 're-mem-ber', ['rem-em-ber', 'r-emem-ber', 'reme-mb-er']],
  ['unhelpful', 'un-help-ful', ['unh-el-pful', 'u-nhelp-ful', 'unhel-p-ful']],
  ['racetrack', 'race-track', ['rac-etrack', 'ra-cetrack', 'racet-rack']],
];
// [chunks, word, misspellings]
const SPELL = [
  ['cat-er-pil-lar', 'caterpillar', ['catterpillar', 'caterpiller', 'catapiller']],
  ['as-tro-naut', 'astronaut', ['astronot', 'astronought', 'astronawt']],
  ['hel-i-cop-ter', 'helicopter', ['hellicopter', 'helicoptor', 'helocopter']],
  ['tel-e-vi-sion', 'television', ['telivision', 'televition', 'televishun']],
  ['vol-ca-no', 'volcano', ['volcarno', 'vulcano', 'volcanoe']],
  ['ad-ven-ture', 'adventure', ['adventcher', 'adventur', 'advencher']],
  ['ex-plor-er', 'explorer', ['exploror', 'explora', 'explorur']],
  ['sub-ma-rine', 'submarine', ['submareen', 'submarean', 'sumbarine']],
];
const NUMBERS = ['2', '3', '4', '5', '6'];

const topics = [
  { id: 'reading.y3-speedsounds', title: 'Complex Speed Sounds: every spelling of a sound', kind: 'facts', strand: 'phonics', prereqs: ['reading.phonics-2'], batch: 5, intro: 'You know the Speed Sounds. Now for the tricky spellings! The “ay” sound can be ay, ai, a-e, but also eigh (eight), ey (they) and even ea (great).', teach: 'Teach me three different ways to spell the “or” sound.', talk: 'This carries on from the Read Write Inc. Set 3 Speed Sounds. Ask {him} how many ways {she} can spell the “ay” sound.' },
  { id: 'reading.y3-longwords', title: 'Long words: chunk by chunk', kind: 'facts', strand: 'phonics', prereqs: ['reading.phonics-1'], batch: 5, intro: 'Long words are easy if you take them in chunks. Clap the beats (syllables): ad-ven-ture. Read each chunk with Fred in your head, then put them together.', teach: 'Clap the beats in “caterpillar” and tell me how many there are.', talk: 'When {she} gets stuck on a long word, cover all but the first chunk, then reveal one chunk at a time.' },
];

const items = [
  ...COMPLEX.map(([sound, as, word, spelling, others, more]) => fact(`ss.${word}`, 'speedsounds', `Which spelling of the “${sound}” sound (as in ${as}) is in “${word}”?`, spelling, others, `In ${word}, the “${sound}” sound is spelt ${spelling}: ${more}.`, choiceOnly)),
  ...BEATS.map(([w, n], i) => fact(`beats.${w}`, 'longwords', `How many beats (syllables) in “${w}”? Clap it!`, String(n), NUMBERS.filter((x) => x !== String(n)).slice(i % 2, i % 2 + 3), `${w} has ${n} beats.`, choiceOnly)),
  ...CHUNKS.map(([w, chunks, wrong]) => fact(`chunks.${w}`, 'longwords', `Which shows “${w}” split into its beats?`, chunks, wrong, `${chunks}: each chunk has one vowel sound.`, choiceOnly)),
  ...SPELL.map(([chunks, w, wrong]) => fact(`chunkspell.${w}`, 'longwords', `Spell it chunk by chunk: ${chunks}. Which spelling is right?`, w, wrong, `${chunks}: ${w}.`, choiceOnly)),
];

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// sound buttons: graphemes split by "."; "o_e" is a split digraph
const SB = (word) => ({ kind: 'sounds', words: [word] });
// a long word in coloured chunks, numbered by beat
const BEAT_ROLES = ['subject', 'verb', 'object', 'adverbial'];
const CHUNKED = (chunks) => ({ join: '+', parts: chunks.split('-').map((c, i) => [c, BEAT_ROLES[i % 4], `beat ${i + 1}`]), result: chunks.replace(/-/g, '') });
const beats = (...words) => ({ kind: 'blocks', rows: words.map(CHUNKED) });
const TOPIC_VISUALS = {
  'reading.y3-speedsounds': { kind: 'sounds', words: ['p.l.ay', 'r.ai.n', 'm.a_e.k', 'eigh.t', 'th.ey', 'g.r.ea.t'], caption: 'One sound, many spellings: the “ay” sound in play, rain, make, eight, they and great.' },
  'reading.y3-longwords': { ...beats('ad-ven-ture', 'cat-er-pil-lar'), caption: 'Clap each chunk: one beat each. Each chunk has one vowel sound.' },
};
const ITEM_VISUALS = {
  'reading.y3.ss.eight': SB('eigh.t'),
  'reading.y3.ss.they': SB('th.ey'),
  'reading.y3.ss.field': SB('f.ie.l.d'),
  'reading.y3.ss.caught': SB('c.augh.t'),
  'reading.y3.ss.bought': SB('b.ough.t'),
  'reading.y3.ss.station': SB('s.t.a.ti.o.n'),
  'reading.y3.ss.chef': SB('ch.e.f'),
  'reading.y3.ss.gnome': SB('gn.o_e.m'),
  'reading.y3.beats.caterpillar': beats('cat-er-pil-lar'),
  'reading.y3.beats.helicopter': beats('hel-i-cop-ter'),
  'reading.y3.beats.television': beats('tel-e-vi-sion'),
  'reading.y3.chunks.fantastic': beats('fan-tas-tic'),
  'reading.y3.chunks.dinosaur': beats('di-no-saur'),
  'reading.y3.chunkspell.astronaut': beats('as-tro-naut'),
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'reading', deck: 'y3-phonics', topics, items }];

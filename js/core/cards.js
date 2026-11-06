// Collectible cards: every topic she secures earns its card, kept for good even if the topic
// slips back later. Cards are grouped into sets (a subject, or a part of a big one). A full set's
// cards turn gold, and many sets also win a fixed prize: an accessory or a scene this course has
// no other way to earn. Never random.
//
// Stored: state.collection (topicId -> day collected) and state.cardSets (setId -> day completed).
// Older saves have neither: both are treated as empty, and filled in from what is secure now.

import { COURSE } from './subjects.js';

const SECURE = new Set(['proficient', 'mastered']);
export const isSecure = (t) => SECURE.has(t?.state);

// ---------------------------------------------------------------- sets
// Each subject's sets, in album order. `m` lists topic ids (without the "subject." prefix) as a
// regular expression; a topic joins the first set it matches, and the subject's last set (no `m`)
// takes everything left, so a new topic always lands somewhere. A set's prize is an accessory (`acc`)
// or a scene (`scene`) the course does not already give, or null (gold cards only). Each course's
// wardrobe and scenes stay its own (tests/companion.test.mjs), which is why Years 2/3 and Year 6
// have fewer prizes than Year 8. Never change a set's id or prize once released: a won set is kept by id.
const set = (id, subject, name, emblems, m, reward) => ({ id, subject, name, emblems, m, reward });

const YOUNG = [ // Years 2 and 3 share these, so moving up keeps every card and set
  set('ym-speed', 'maths', 'Number speedway', ['racecar', 'flag'], 'place|bonds|addsub|count|hundreds|column|numberline|factfamilies|doubles|balance|y3-place|y3-mental|y3-column|y3-negative|y3-decimals|y3-rounding', { acc: 'laurel' }),
  set('ym-times', 'maths', 'Times tables and fractions', ['rocket', 'pie'], 'times|times-8|grouping|times10|tables-deduce|fractions|y3-tables|y3-multiply|y3-divide|y3-tables-y4|y3-fractions|y3-fraccalc', null),
  set('ym-measure', 'maths', 'Money, measures and time', ['stopwatch', 'scales'], 'money|time|measure|scales|amounts|durations|scales-2|clock-5|y3-measure|y3-money|y3-time', { acc: 'chef' }),
  set('ym-shapes', 'maths', 'Shapes and turns', ['shapes', 'compass'], 'shapes|turns|shape-compare|perimeter|y3-angles|y3-shapes|y3-area', null),
  set('ym-puzzles', 'maths', 'Puzzles and problems', ['puzzle', 'magnifier'], null, null),
  set('yr-sounds', 'reading', 'Speed sounds', ['star', 'rocket'], 'rwi-.*|phonics-.*|y3-speedsounds|y3-longwords', null),
  set('yr-words', 'reading', 'Wonderful words', ['book', 'star'], 'words|words-2|words-3|y3-words-.*|y3-figurative', null),
  set('yr-tales', 'reading', 'Classic tales', ['book', 'crown'], 'potter|potter-2|nutkin|fables|fables-2|fables-3|y3-justso|y3-toad|y3-alice|y3-jungle|y3-myths|y3-classics', { acc: 'lamp' }),
  set('yr-facts', 'reading', 'Fact files', ['magnifier', 'globe'], 'facts|facts-2|facts-3|y3-facts|links|y3-texttypes', null),
  set('yr-stories', 'reading', 'Adventures and poems', ['racecar', 'rocket'], null, null),
  set('ys-tricky', 'spelling', 'Tricky words', ['shield', 'lightning'], 'cew-.*|year3|y3-words-.*', null),
  set('ys-patterns', 'spelling', 'Spelling patterns', ['lightning', 'quill'], 'suffixes|suffixes-2|suffix-use|pattern-.*|prefixes|plurals|compounds|homophones|y3-prefixes|y3-suffixes|y3-shun|y3-sounds|y3-homophones|y3-word-families', null),
  set('ys-sentences', 'spelling', 'Super sentences', ['quill', 'shield'], null, null),
  set('yc-dinos', 'science', 'Dinosaurs and fossils', ['dino', 'fossil'], 'dinosaurs|rocks|y3-rocks|y3-volcanoes', { scene: 'digsite' }),
  set('yc-space', 'science', 'Space', ['planet', 'rocket'], 'space|explore', { scene: 'rings' }),
  set('yc-animals', 'science', 'Animals and plants', ['paw', 'leaf'], 'animals|food|body|lifecycles|plants|habitats|minibeasts|y3-plants|y3-seeds|y3-nutrition|y3-skeletons|y3-digestion|y3-keys', null),
  set('yc-earth', 'science', 'Planet Earth', ['globe', 'compass'], 'world|uk|maps|hotcold|countries|coasts|seasons|y3-europe|y3-ukplaces|y3-compass|y3-climate', null),
  set('yc-lab', 'science', 'Forces, light and sound', ['magnet', 'bulb'], null, null),
  set('yh-knights', 'history', 'Knights and castles', ['castle', 'shield'], '1066|castles|y3-sieges|y3-normans|monarchs|tudors|armada', { acc: 'shield' }),
  set('yh-ancient', 'history', 'Ancient worlds', ['pyramid', 'column'], 'stoneage|egypt|y3-stoneage|y3-ironage|y3-greece|y3-civilisations|y3-shang', { acc: 'corinthian' }),
  set('yh-romans', 'history', 'Romans and Vikings', ['helmet', 'longship'], 'romans|vikings|y3-legion|y3-boudica|y3-roman-life|y3-saxons|y3-vikings', null),
  set('yh-nightingale', 'history', 'Florence Nightingale', ['lamp'], 'fn-.*', null),
  set('yh-heroes', 'history', 'Heroes and inventors', ['star', 'bulb'], null, null),
];

const Y6 = [
  set('6e-spell', 'english', 'Spelling and word parts', ['quill', 'scroll'], 'spell-.*|morph-.*|roots-3', { acc: 'cape' }),
  set('6e-words', 'english', 'Words and grammar', ['quill', 'book'], 'vocab-.*|techniques|punctuation|grammar7|grammar-8|lit-words|rhetoric|analysis', null),
  set('6e-poems', 'english', 'Poems and plays', ['mask', 'lyre'], 'poetry-terms|poems|poetry-2|shakespeare|dream|tempest', { acc: 'mask' }),
  set('6e-reading', 'english', 'Reading', ['book', 'lamp'], null, { acc: 'oillamp' }),
  set('6m-number', 'maths', 'Number', ['scales', 'puzzle'], 'place-value|negatives|order-ops|primes|long-mult|long-div|key-facts|indices', { acc: 'skateboard' }),
  set('6m-fractions', 'maths', 'Fractions, decimals and percentages', ['pie'], 'frac-.*|fdp|percent|percent-change|ratio|ratio-2', { acc: 'racehelmet' }),
  set('6m-algebra', 'maths', 'Algebra', ['scales', 'code'], 'substitute|sequences|equations|equations-2|expand|linear-graphs', null),
  set('6m-shape', 'maths', 'Shape and space', ['compass', 'shapes'], 'angles|area|volume|coordinates|shapes|polygons|parallel|circles', null),
  set('6m-data', 'maths', 'Measures and data', ['hourglass', 'pie'], null, null),
  set('6h-medieval', 'history', 'Medieval England', ['castle', 'crown'], '1066|normans|church|becket|magna-carta|village|black-death|peasants-revolt|war-france', { acc: 'knight' }),
  set('6h-tudors', 'history', 'Tudors and Stuarts', ['crown', 'longship'], 'tudors|reformation|armada|civil-war', null),
  set('6h-time', 'history', 'Time and evidence', ['hourglass', 'column'], null, { acc: 'corinthian' }),
  set('6g-world', 'geography', 'Countries and capitals', ['globe', 'compass'], 'continents|lines|uk|europe-.*|capitals-.*|americas|africa|asia|world-2', null),
  set('6g-earth', 'geography', 'Planet Earth', ['volcano', 'globe'], null, null),
  set('6s-space', 'science', 'Space, forces and light', ['planet', 'magnet'], 'space|forces|forces7|energy|universe|light|light-2', { acc: 'astronaut' }),
  set('6s-life', 'science', 'Living things', ['leaf', 'cell'], 'living|body|evolution|cells|ecosystems|reproduction|digestion', { acc: 'firstaid' }),
  set('6s-matter', 'science', 'Materials and chemistry', ['flask', 'atom'], 'materials|particles|atoms|separating|acids|periodic|reactions', null),
  set('6s-electricity', 'science', 'Electricity', ['bulb', 'lightning'], 'electricity|circuits|elec-.*', { acc: 'scooter' }),
  set('6s-lab', 'science', 'Working scientifically', ['flask', 'magnifier'], null, null),
  set('6l-latin', 'latin', 'Latin', ['column', 'laurel'], null, { acc: 'shield' }),
];

const Y8 = [
  set('8e-myth', 'english', 'Myth and epic', ['amphora', 'owl'], 'myths|homer|lang-myth-words', { acc: 'pony' }),
  set('8e-drama', 'english', 'Shakespeare and tragedy', ['mask', 'crown'], 'tempest|macbeth|caesar|titania|tragedy', { acc: 'tudorgown' }),
  set('8e-novels', 'english', 'Novels and stories', ['book', 'quill'], 'gothic|detective|havisham|short-story|carol|oliver|red-room|austen-wit|treasure|wild|magi|wuthering|openings', { acc: 'regency' }),
  set('8e-poetry', 'english', 'Poetry', ['lyre', 'laurel'], 'war-poetry|tennyson|sonnet|exposure|blake|rossetti|kipling|ozymandias', { acc: 'flowercrown' }),
  set('8e-words', 'english', 'Words and roots', ['owl', 'scroll'], 'lang-greek-roots|lang-latin-roots|lang2-roots-.*|lang2-latin-2|lang-vocab|lang2-vocab-.*|lang2-confused|lang-spelling|lang2-spelling-2', { acc: 'book' }),
  set('8e-grammar', 'english', 'Grammar and punctuation', ['quill', 'scroll'], 'lang-clauses|lang-relative|lang-verbs|lang-punct|lang-speech|lang2-grammar-3', { acc: 'beret' }),
  set('8e-reading', 'english', 'Reading closely', ['magnifier', 'book'], 'terms|context|compare|unseen|essay|darwin|lang-analysis|lang-compare|lang-effect', { acc: 'detective' }),
  set('8e-writing', 'english', 'The writer’s craft', ['quill', 'lamp'], null, { acc: 'paintbrush' }),
  set('8m-number', 'maths', 'Number, reasoning and proof', ['puzzle', 'owl'], null, { acc: 'telescope' }),
  set('8m-proportion', 'maths', 'Ratio and proportion', ['pie', 'scales'], 'fractions|percentages|ratio|compound|units|proportion', { acc: 'bicycle' }),
  set('8m-algebra', 'maths', 'Algebra', ['scales', 'code'], 'algebra|formulae|equations|inequalities|alg-fractions|factorising-2|eq-fractions|simultaneous|quadratics|quadratic-formula', { acc: 'rollerskates' }),
  set('8m-graphs', 'maths', 'Graphs and sequences', ['chart', 'code'], 'sequences|graphs|iteration|functions|curves|real-graphs|geometric', { acc: 'skateboard' }),
  set('8m-geometry', 'maths', 'Geometry', ['compass', 'pyramid'], 'angles|area|volume|transformations|pythagoras|pythagoras-3d|trigonometry|similarity|sectors|polygon-algebra|vectors|constructions', { acc: 'violin' }),
  set('8m-stats', 'maths', 'Probability and statistics', ['chart', 'pie'], 'probability|statistics|sets|counting|tree-diagrams|spread', { acc: 'camera' }),
  set('8m-olympiad', 'maths', 'Olympiad problems', ['laurel', 'puzzle'], 'ps-.*', { acc: 'tiara' }),
  set('8s-body', 'science', 'Cells and the body', ['cell', 'dna'], 'cells|organs|respiration|health|enzymes|circulation|nervous|immunity|diet', { acc: 'firstaid' }),
  set('8s-life', 'science', 'Life and genes', ['dna', 'leaf'], 'photosynthesis|ecosystems|inheritance|genetics|biodiversity|geneng|transport', { acc: 'sunhat' }),
  set('8s-chem', 'science', 'Chemistry', ['flask', 'atom'], 'particles|atoms|atomic|periodic|reactions|acids|formulae|extraction|rates|energychange|materials|electrolysis', { acc: 'labcoat' }),
  set('8s-physics', 'science', 'Physics', ['magnet', 'lightning'], 'forces|energy|electricity|waves|motion|work|heating|static|light|spectrum|induction|momentum', { acc: 'lamp' }),
  set('8s-space', 'science', 'Earth, space and experiments', ['planet', 'flask'], null, { acc: 'spacesuit' }),
  set('8h-ancient', 'history', 'The ancient world', ['helmet', 'column'], 'athens|sparta|persian-wars|alexander|rome|byzantium', { acc: 'horse' }),
  set('8h-medieval', 'history', 'Medieval worlds', ['castle', 'crown'], 'normans|magna-carta|black-death|crusades|roses|golden-age', { acc: 'knight' }),
  set('8h-earlymodern', 'history', 'Renaissance and revolution', ['longship', 'quill'], 'reformation|civil-war|renaissance|exploration|elizabeth|science-rev|restoration|american-rev|napoleon|revolutions', { acc: 'ballgown' }),
  set('8h-modern', 'history', 'Industry, empire and rights', ['bulb', 'scales'], 'industrial|empire|vote|famine|public-health|suffrage|end-empire|civil-rights', { acc: 'victorian' }),
  set('8h-wars', 'history', 'The twentieth century', ['hourglass', 'shield'], 'ww1|ww2|home-front|cold-war|russia|dictators', { acc: 'oillamp' }),
  set('8h-skills', 'history', 'The historian’s toolkit', ['magnifier', 'scroll'], null, { acc: 'deerstalker' }),
  set('8g-restless', 'geography', 'Restless Earth', ['volcano', 'globe'], 'tectonics|hazards|hazard-management|rivers|coasts|ice|basins|storms|uk-landscapes|uk-extremes', { acc: 'explorerkit' }),
  set('8g-climate', 'geography', 'Climate and biomes', ['leaf', 'globe'], 'weather|climate|biomes|deserts|polar|oceans', { acc: 'headband' }),
  set('8g-people', 'geography', 'People and cities', ['column', 'chart'], 'population|cities|development|global|urban-models|regeneration|farming|water-food|tourism|energy|resources-conflict|sustainability', { acc: 'chef' }),
  set('8g-places', 'geography', 'Places of the world', ['globe', 'compass'], 'russia|places|places-2|aegean|africa|nigeria|china|india|brazil|eu', { acc: 'scooter' }),
  set('8g-skills', 'geography', 'The geographer’s toolkit', ['compass', 'magnifier'], null, { acc: 'bowtie' }),
  set('8c-python', 'computing', 'Python', ['code', 'chip'], 'python|selection|loops|lists|debugging|functions|dicts|strings|grids|robust|files|random|bughunt|recursion', { acc: 'astronaut' }),
  set('8c-algorithms', 'computing', 'Algorithms', ['puzzle', 'code'], 'thinking|flowcharts|searching|sorting|trace|algotrace|efficiency|structures|paths', { acc: 'rocket' }),
  set('8c-data', 'computing', 'Data and binary', ['chip', 'lock'], 'binary|binarymaths|twos|media|compression|encryption|huffman|databases|sql', { acc: 'cat' }),
  set('8c-machine', 'computing', 'Inside the machine', ['chip', 'bulb'], 'logic|hardware|software|architecture|os|circuits', { acc: 'microscope' }),
  set('8c-net', 'computing', 'Networks and society', ['globe', 'lock'], null, { acc: 'fox' }),
  set('8gk-alphabet', 'greek', 'Alphabet and first words', ['amphora', 'scroll'], 'alphabet-.*|reading|words-[1-3]', { acc: 'wizardrobe' }),
  set('8gk-hoard1', 'greek', 'Word hoard I', ['owl', 'amphora'], 'words-(?:[4-9]|10)', { acc: 'palette' }),
  set('8gk-hoard2', 'greek', 'Word hoard II', ['owl', 'laurel'], 'words-1[1-7]|words-review-.*', { acc: 'tutu' }),
  set('8gk-nouns', 'greek', 'Nouns and adjectives', ['amphora', 'column'], 'article|nouns-.*|adjectives|third-decl|decl3-.*|pronouns|demonstratives|comparison', { acc: 'bonnet' }),
  set('8gk-verbs', 'greek', 'Verbs', ['helmet', 'lyre'], 'verbs-.*|tenses|aorist|aorist-.*|infinitives|contracted|middle|participles|participles-full|genabs', { acc: 'fairywings' }),
  set('8gk-myth', 'greek', 'Myths in Greek', ['mask', 'amphora'], 'myth-.*|culture|read-.*', { acc: 'dragon' }),
  set('8gk-sentences', 'greek', 'Sentences', ['scroll', 'lyre'], null, { acc: 'partyhat' }),
];

const DEFS = { young: YOUNG, y6: Y6, y8: Y8 };
/** The card style (and set list) for a course: young (Years 2 and 3), y6 or y8. */
export const cardTheme = (course = COURSE) => (course.young ? 'young' : course.id === 'y8' ? 'y8' : 'y6');
export const setDefs = (course = COURSE) => DEFS[cardTheme(course)] || Y6;

const cache = new WeakMap();
/** This course's sets, each with its topic ids in course order; empty sets are left out. */
export function cardSets(db, course = COURSE) {
  const key = cardTheme(course);
  const hit = cache.get(db);
  if (hit?.key === key) return hit.sets;
  const defs = setDefs(course).map((d) => ({ ...d, re: d.m ? new RegExp(`^(?:${d.m})$`) : null, topics: [] }));
  for (const [subject, ids] of Object.entries(db.topicOrder)) {
    const mine = defs.filter((d) => d.subject === subject);
    if (!mine.length) continue;
    for (const id of ids) {
      const short = id.slice(subject.length + 1);
      (mine.find((d) => d.re && d.re.test(short)) || mine.find((d) => !d.re) || mine.at(-1)).topics.push(id);
    }
  }
  const sets = defs.filter((d) => d.topics.length).map(({ re, m, ...d }) => d);
  cache.set(db, { key, sets });
  return sets;
}

export function setOfTopic(db, topicId, course = COURSE) {
  return cardSets(db, course).find((s) => s.topics.includes(topicId)) || null;
}

/** Every topic with a card in this course (the album's size). */
export const allCardIds = (db, course = COURSE) => cardSets(db, course).flatMap((s) => s.topics);

/** Topics whose card she has: collected before (kept for good) or secure now. */
export function collected(state, db) {
  const have = new Set(Object.keys(state.collection || {}).filter((id) => db.topics[id]));
  for (const [id, t] of Object.entries(state.topics || {})) if (db.topics[id] && isSecure(t)) have.add(id);
  return have;
}

/** Each set with how many of its cards she has, whether it is complete, and whether its reward is won. */
export function setProgress(state, db, course = COURSE) {
  const have = collected(state, db);
  const won = state.cardSets || {};
  return cardSets(db, course).map((s) => {
    const n = s.topics.filter((id) => have.has(id)).length;
    const complete = n === s.topics.length;
    return { ...s, have: n, total: s.topics.length, complete, won: complete || !!won[s.id] };
  });
}

export function cardCount(state, db, course = COURSE) {
  const ids = allCardIds(db, course);
  const have = collected(state, db);
  return { have: ids.filter((id) => have.has(id)).length, total: ids.length };
}

/**
 * Store newly earned cards and completed sets so they stay earned.
 * Returns what is new: { cards: [topicId], sets: [setId] }.
 */
export function syncCollection(state, db, today, course = COURSE) {
  const col = (state.collection ||= {});
  const done = (state.cardSets ||= {});
  const ids = new Set(allCardIds(db, course));
  const cards = [...collected(state, db)].filter((id) => !(id in col) && ids.has(id));
  for (const id of cards) col[id] = today;
  const sets = setProgress(state, db, course).filter((s) => s.complete && !(s.id in done)).map((s) => s.id);
  for (const id of sets) done[id] = today;
  return { cards, sets };
}

// ---------------------------------------------------------------- rewards
/** Accessories that card sets give in this course (for the wardrobe). */
export const cardRewardAccessories = (course = COURSE) => setDefs(course).map((d) => d.reward?.acc).filter(Boolean);
/** Scenes that card sets give in this course (for the scene picker). */
export const cardRewardScenes = (course = COURSE) => setDefs(course).filter((d) => d.reward?.scene).map((d) => ({ id: d.reward.scene, set: d }));
/** The set whose reward this accessory or scene is, if any. */
export const rewardSet = (id, course = COURSE) => setDefs(course).find((d) => d.reward && (d.reward.acc === id || d.reward.scene === id)) || null;

/** Rewards won by full sets: { acc: [...], scenes: [...] }. */
export function wonCardRewards(state, db, course = COURSE) {
  const won = setProgress(state, db, course).filter((s) => s.won);
  return { acc: won.map((s) => s.reward?.acc).filter(Boolean), scenes: won.map((s) => s.reward?.scene).filter(Boolean) };
}

// ---------------------------------------------------------------- facts
// The card's fact is a sentence from the topic's own text (its hook, or its intro), never made up.
// Sentences about the activity ("Read each one…", "These words are on the list…") or questions
// are passed over for one that says something true about the topic.
const META = /^(?:say\b|be\b|read\b|look\b|listen|spot it|think\b|ask\b|try\b|let[’']s|now\b|learn\b|clap|chant|practise|write\b|hunt|answer\b|find\b|use\b|count\b|take\b|here\b|you\b|your\b|you[’']|as you|for each|each (?:one|story)|this (?:topic|is where)|ready|today|in this|before we|we[’']ll|we will|knowing\b|in year \d|most grammar|visit|good writers|great writers)/i;
// a little less likely: about the lesson rather than the topic, or needing the sentence before
const SOFT = /^(?:(?:two|three|four|five|six|more|even more)\b|greater[- ]depth|these\b|they\b|it\b|he\b|she\b|this\b|that\b|those\b|then\b)/i;

export function sentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?…])\s+(?=[“"‘(*_A-Z0-9])/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

function score(s, hook) {
  let n = 0;
  const bare = s.replace(/^[“"‘*_]+/, '');
  if (META.test(bare)) n -= 4;
  else if (SOFT.test(bare)) n -= 1;
  if (/\buse the clues\b/i.test(s)) n -= 2;
  if (/\?\s*$/.test(s) || /\?$/.test(s.replace(/[”"’*_]+$/, ''))) n -= 3;
  if (/\b(?:you|your|we|us|let[’']s)\b/i.test(s)) n -= 2;
  if (/^(?:they|it|he|she)\b/i.test(bare)) n -= 1;
  if (s.length < 24) n -= 2;
  if (s.length > 170) n -= 2;
  if (/\d/.test(s)) n += 1; // dates, numbers and amounts are good facts
  if (hook) n += 1;
  return n;
}

/** One short, true fact for a topic's card, taken from its hook or the sentences of its intro. */
export function cardFact(topic) {
  if (!topic) return '';
  const cands = [];
  if (topic.hook) cands.push({ s: topic.hook.trim(), hook: true });
  for (const s of sentences(topic.intro)) cands.push({ s, hook: false });
  if (!cands.length) return '';
  let best = cands[0], bestN = -Infinity;
  for (const c of cands) {
    const n = score(c.s, c.hook);
    if (n > bestN) { best = c; bestN = n; }
  }
  return best.s;
}

/** A stable number for a card (its place in the album, from 1). */
export function cardNumber(db, topicId, course = COURSE) {
  return allCardIds(db, course).indexOf(topicId) + 1;
}

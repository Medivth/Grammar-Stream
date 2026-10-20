// English procedure generators: word classes from a bank of hand-tagged sentences.

const SENTENCES = [
  'The/det hungry/adj fox/noun crept/verb silently/adv through/prep the/det dark/adj forest/noun',
  'She/pron quickly/adv opened/verb the/det old/adj wooden/adj box/noun',
  'Although/conj it/pron was/verb raining/verb ,/- we/pron walked/verb to/prep the/det park/noun',
  'My/det brother/noun and/conj I/pron built/verb a/det tall/adj tower/noun',
  'The/det children/noun laughed/verb loudly/adv because/conj the/det clown/noun fell/verb over/-',
  'Several/det enormous/adj waves/noun crashed/verb against/prep the/det rocks/noun',
  'They/pron carefully/adv carried/verb the/det injured/adj bird/noun into/prep the/det house/noun',
  'We/pron will/verb visit/verb our/det grandparents/noun after/prep lunch/noun',
  'The/det ancient/adj castle/noun stood/verb proudly/adv on/prep the/det hill/noun ,/- but/conj nobody/pron lived/verb there/adv',
  'Tom/noun ate/verb his/det sandwich/noun slowly/adv while/conj Mia/noun read/verb a/det book/noun',
].map((s) => s.split(' ').map((t) => { const [w, c] = t.split('/'); return { w, c }; }));

const CLASSES = {
  noun: ['a noun', 'a naming word for a person, place, thing or idea'],
  verb: ['a verb', 'a doing or being word; it can change tense'],
  adj: ['an adjective', 'a word that describes a noun'],
  adv: ['an adverb', 'a word that tells you how, when or where something happens, often modifying a verb'],
  pron: ['a pronoun', 'a word that stands in for a noun (she, they, it, nobody)'],
  prep: ['a preposition', 'a word showing where or when something is in relation to something else (under, through, after)'],
  conj: ['a conjunction', 'a word that joins words or clauses (and, but, because, although, while)'],
  det: ['a determiner', 'a word before a noun that tells you which or how many (the, a, my, several)'],
};
const LEVEL_CLASSES = { 1: ['noun', 'verb', 'adj'], 2: ['adv', 'pron', 'prep'], 3: ['conj', 'det'] };

export const ENGLISH_GENERATORS = {
  wordClass(level, rng) {
    const want = rng.pick(LEVEL_CLASSES[level]);
    const pool = SENTENCES.filter((s) => s.some((t) => t.c === want));
    const sent = rng.pick(pool);
    const text = sent.map((t) => t.w).join(' ').replace(/ ,/g, ',') + '.';
    const target = rng.pick(sent.filter((t) => t.c === want));
    // distractors: words of other classes, never a word that also appears as the target class
    const sameText = new Set(sent.filter((t) => t.c === want).map((t) => t.w.toLowerCase()));
    const seen = new Set();
    const others = rng.shuffle(sent.filter((t) => t.c !== want && t.c !== '-' && !sameText.has(t.w.toLowerCase()))).filter((t) => {
      const k = t.w.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 3);
    const [article, def] = CLASSES[want];
    return {
      kind: 'choice',
      prompt: `In the sentence “${text}”, which word is ${article}?`,
      options: rng.shuffle([{ text: target.w, correct: true }, ...others.map((t) => ({ text: t.w, feedback: `“${t.w}” is ${CLASSES[t.c][0]} here: ${CLASSES[t.c][1]}.` }))]),
      explain: `“${target.w}” is ${article}: ${def}.`,
      steps: [`${article[0].toUpperCase() + article.slice(1)} is ${def}.`, `I test each word in “${text}”.`, `“${target.w}” does that job, so it is ${article}.`],
    };
  },
};

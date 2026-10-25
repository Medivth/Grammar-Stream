// Year 2 phonics in the Read Write Inc. style used in many schools: the Set 2 and Set 3
// Speed Sounds with their phrases (“ay: may I play”), Fred Talk (sounding out), Fred Fingers
// (counting sounds), special friends, red and green words, and alien (nonsense) words like
// the Phonics Screening Check. Written for this app; not affiliated with Read Write Inc.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `reading.rwi.${id}`, topic: `reading.rwi-${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const choiceOnly = { formats: ['choice'] };
const slug = (s) => s.replace(/[^a-z]+/g, '');

// [sound, phrase, example words, a word with the sound, three words without it, key]
const SET2 = [
  ['ay', 'may I play', 'day, play, spray, away', 'stay', ['stop', 'stem', 'stack']],
  ['ee', 'what can you see', 'see, tree, sleep, green', 'sheep', ['shop', 'ship', 'shape']],
  ['igh', 'fly high', 'high, night, light, bright', 'night', ['north', 'nasty', 'notes']],
  ['ow', 'blow the snow', 'blow, snow, slow, grow', 'grow', ['grab', 'grit', 'grub']],
  ['oo', 'poo at the zoo', 'zoo, moon, spoon, food', 'moon', ['mint', 'mast', 'melt'], 'zoo'],
  ['oo', 'look at a book', 'look, book, cook, foot', 'foot', ['fist', 'fast', 'felt'], 'book'],
  ['ar', 'start the car', 'car, star, park, farm', 'park', ['pick', 'peck', 'puck']],
  ['or', 'shut the door', 'for, sport, horse, storm', 'sport', ['spent', 'spilt', 'spots']],
  ['air', 'that’s not fair', 'fair, hair, chair, stairs', 'chair', ['chain', 'cheer', 'chart']],
  ['ir', 'whirl and twirl', 'girl, bird, shirt, first', 'shirt', ['short', 'shift', 'sheet']],
  ['ou', 'shout it out', 'out, shout, loud, mouth', 'cloud', ['climb', 'clamp', 'clock']],
  ['oy', 'toy for a boy', 'toy, boy, enjoy, annoy', 'enjoy', ['empty', 'entry', 'envy']],
];
const SET3A = [
  ['ea', 'cup of tea', 'tea, sea, dream, beach', 'dream', ['drum', 'drop', 'dress']],
  ['oi', 'spoil the boy', 'coin, oil, point, spoil', 'point', ['paint', 'pint', 'punt']],
  ['a-e', 'make a cake', 'cake, make, game, snake', 'snake', ['snack', 'snag', 'sneak']],
  ['i-e', 'nice smile', 'nice, smile, bike, slide', 'slide', ['slid', 'sled', 'slept']],
  ['o-e', 'phone home', 'home, bone, note, stone', 'stone', ['stun', 'sting', 'stand']],
  ['u-e', 'huge brute', 'huge, tune, flute, cube', 'flute', ['flat', 'flit', 'float']],
  ['aw', 'yawn at dawn', 'saw, paw, yawn, crawl', 'crawl', ['crab', 'crest', 'crust']],
  ['are', 'care and share', 'care, share, scare, stare', 'scare', ['scarf', 'score', 'scar']],
  ['ur', 'nurse for a purse', 'nurse, purse, turn, burn', 'burn', ['barn', 'born', 'bun']],
  ['er', 'a better letter', 'better, letter, sister, under', 'sister', ['silent', 'single', 'sixty']],
];
const SET3B = [
  ['ow', 'brown cow', 'cow, now, brown, down', 'town', ['tone', 'torn', 'tin'], 'cow'],
  ['ai', 'snail in the rain', 'rain, snail, train, paint', 'paint', ['print', 'plant', 'point']],
  ['oa', 'goat in a boat', 'boat, goat, coat, toast', 'toast', ['twist', 'tests', 'trust']],
  ['ew', 'chew the stew', 'new, chew, stew, flew', 'flew', ['flow', 'flat', 'flag']],
  ['ire', 'fire fire!', 'fire, wire, tired, inspire', 'wire', ['wore', 'were', 'wipe']],
  ['ear', 'hear with your ear', 'ear, hear, near, clear', 'near', ['nest', 'neat', 'nerve']],
  ['ure', 'sure it’s pure?', 'sure, pure, cure, picture', 'cure', ['core', 'care', 'cute']],
];

const learnCard = (sound, phrase, words) => `**${sound}**: _${phrase}_\n${words}`;
function speedSounds(topic, list, all) {
  return list.flatMap(([sound, phrase, words, target, without, key], i) => {
    const id = `${topic}.${slug(sound)}${key ? `-${key}` : ''}`;
    const others = [...new Set(all.map((s) => s[0]))].filter((s) => s !== sound);
    const distractors = [0, 7, 15].map((k) => others[(i * 5 + k) % others.length]);
    const learn = learnCard(sound, phrase, words);
    return [
      fact(`${id}.phrase`, topic, `Which Speed Sound goes with “${phrase}”?`, sound, distractors, `“${phrase}” is the phrase for ${sound}: ${words}.`, { formats: sound.includes('-') ? ['choice'] : ['choice', 'typed'], learn }),
      fact(`${id}.word`, topic, `Which word has “${sound}” as in “${phrase}”?`, target, without, `${target} has ${sound}, like ${words}.`, { ...choiceOnly, learn }),
    ];
  });
}
const SPEED = [...SET2, ...SET3A, ...SET3B];

const SET3_EXTRA = [
  fact('set3b.tion.phrase', 'set3b', 'Which Speed Sound says “shun” at the end of “celebration”?', 'tion', ['shun', 'chun', 'tian'], 'tion says “shun”: station, celebration, action.', { ...choiceOnly, learn: '**tion** says “shun”\nstation, action, celebration' }),
  fact('set3b.tion.word', 'set3b', 'Which word ends with the “shun” sound spelt tion?', 'station', ['statue', 'stadium', 'stamped'], 'sta-tion: the tion says “shun”.', choiceOnly),
  fact('set3b.cious.phrase', 'set3b', 'In “delicious”, which letters say “shus” at the end?', 'cious', ['shus', 'shous', 'cous'], 'cious and tious both say “shus”: delicious, precious, scrumptious.', { ...choiceOnly, learn: '**cious** and **tious** say “shus”\ndelicious, precious, scrumptious, cautious' }),
  fact('set3b.tious.word', 'set3b', 'Which word ends in tious?', 'cautious', ['precious', 'spacious', 'gracious'], 'cau-tious. The others all end in cious.', choiceOnly),
  fact('set3b.e.phrase', 'set3b', 'Which Speed Sound do “he, me, we, she, be” share?', 'e', ['ee', 'ea', 'ey'], 'In he, me, we, she and be, the e says its name: “ee”.', { ...choiceOnly, learn: '**e** says “ee”: _he me we she be_' }),
  fact('set3b.e.word', 'set3b', 'In which word does the e say “ee”, like in “he me we she be”?', 'she', ['shed', 'shell', 'step'], 'sh-e: the e says its name. In shed, shell and step it says “e” as in egg.', choiceOnly),
  fact('set3b.ow.which', 'set3b', 'Is the “ow” in “clown” like “brown cow” or “blow the snow”?', 'brown cow', ['blow the snow', 'both of them', 'neither one'], 'cl-ow-n: the ow says “ow” as in brown cow. In snow and grow it says “oa”.', choiceOnly),
  fact('set3b.ow.which2', 'set3b', 'Is the “ow” in “window” like “brown cow” or “blow the snow”?', 'blow the snow', ['brown cow', 'both of them', 'neither one'], 'win-dow: the ow says “oa” as in blow the snow.', choiceOnly),
  // which spelling? (ay at the end, ai in the middle; oy at the end, oi in the middle)
  fact('set3b.spell.day', 'set3b', 'Which spelling is right?', 'day', ['dai', 'dae', 'dey'], 'ay usually comes at the end of a word (may I play); ai comes in the middle (snail in the rain).', choiceOnly),
  fact('set3b.spell.rain', 'set3b', 'Which spelling is right?', 'rain', ['rayn', 'rane', 'raine'], 'ai comes in the middle of a word: snail in the rain.', choiceOnly),
  fact('set3b.spell.boy', 'set3b', 'Which spelling is right?', 'boy', ['boi', 'boye', 'boiy'], 'oy usually comes at the end of a word (toy for a boy); oi comes in the middle (spoil the boy).', choiceOnly),
  fact('set3b.spell.coin', 'set3b', 'Which spelling is right?', 'coin', ['coyn', 'coine', 'koyn'], 'oi comes in the middle of a word: coin, point, spoil.', choiceOnly),
  fact('set3b.spell.snow', 'set3b', 'Which spelling is right?', 'snow', ['snoa', 'snoe', 'snowe'], 'oa is hardly ever at the end of a word. At the end, use ow: snow, grow, blow.', choiceOnly),
  fact('set3b.spell.claw', 'set3b', 'Which spelling is right?', 'claw', ['clor', 'clau', 'clore'], 'aw often comes at the end: claw, saw, paw, draw.', choiceOnly),
];

// --- Fred Talk and Fred Fingers -------------------------------------------------------------
// [sounds, word, three near misses]
const BLEND = [
  ['sh-i-p', 'ship', ['shop', 'chip', 'sip']],
  ['ch-ai-n', 'chain', ['chin', 'chair', 'cane']],
  ['n-igh-t', 'night', ['net', 'nut', 'knit']],
  ['s-t-ar-t', 'start', ['stark', 'smart', 'stars']],
  ['b-r-ow-n', 'brown', ['brain', 'crown', 'bring']],
  ['s-p-oo-n', 'spoon', ['spin', 'spun', 'soon']],
  ['f-l-oa-t', 'float', ['flat', 'fleet', 'flute']],
  ['th-r-ee', 'three', ['tree', 'throw', 'there']],
  ['c-l-ou-d', 'cloud', ['could', 'clod', 'cold']],
  ['p-ai-n-t', 'paint', ['point', 'pant', 'print']],
  ['b-ur-s-t', 'burst', ['beast', 'boost', 'bust']],
  ['qu-ee-n', 'queen', ['quiet', 'quack', 'green']],
];
// [word, its sounds, how many]
const COUNT = [
  ['night', 'n-igh-t', 3], ['sheep', 'sh-ee-p', 3], ['chair', 'ch-air', 2], ['frog', 'f-r-o-g', 4],
  ['shout', 'sh-ou-t', 3], ['string', 's-t-r-i-ng', 5], ['thick', 'th-i-ck', 3], ['splash', 's-p-l-a-sh', 5],
  ['storm', 's-t-or-m', 4], ['boat', 'b-oa-t', 3],
];
const NUMBERS = ['2', '3', '4', '5', '6'];
const FRIENDS = [
  ['light', 'igh', ['lig', 'ght', 'li']],
  ['boat', 'oa', ['bo', 'at', 'ba']],
  ['shark', 'sh and ar', ['sh and rk', 'ha and rk', 's and ar']],
  ['thing', 'th and ng', ['th and in', 'hi and ng', 't and ng']],
  ['queen', 'qu and ee', ['qu and en', 'ue and en', 'q and ee']],
  ['chip', 'ch', ['hi', 'ip', 'ci']],
];
const BUTTONS = [
  ['sheep', 'sh-ee-p', ['s-h-ee-p', 'sh-e-e-p', 's-h-e-e-p']],
  ['night', 'n-igh-t', ['n-i-gh-t', 'n-ig-h-t', 'ni-g-h-t']],
  ['chair', 'ch-air', ['c-h-air', 'ch-ai-r', 'c-h-ai-r']],
  ['shout', 'sh-ou-t', ['s-h-ou-t', 'sh-o-u-t', 'sho-u-t']],
];
const FRED = [
  ...BLEND.map(([sounds, word, near]) => fact(`fred.blend.${word}`, 'fred', `Fred Talk: ${sounds}. What’s the word?`, word, near, `${sounds}… ${word}! Say the sounds, then push them together.`, { formats: ['choice', 'typed'] })),
  ...COUNT.map(([word, sounds, n], i) => fact(`fred.count.${word}`, 'fred', `How many sounds in “${word}”? Use your Fred Fingers.`, String(n), NUMBERS.filter((x) => x !== String(n)).slice(i % 2, i % 2 + 3), `${sounds}: ${n} sounds. Special friends (like sh, igh, ar) are one sound, so they get one finger.`, choiceOnly)),
  ...FRIENDS.map(([word, friends, wrong]) => fact(`fred.friends.${word}`, 'fred', `Which letters in “${word}” are special friends (two or three letters making one sound)?`, friends, wrong, `In ${word}, ${friends} ${friends.includes(' and ') ? 'are special friends' : 'is a special friend'}: the letters work together to make one sound.`, choiceOnly)),
  ...BUTTONS.map(([word, sounds, wrong]) => fact(`fred.buttons.${word}`, 'fred', `Which shows the sounds in “${word}” correctly? (Special friends stay together.)`, sounds, wrong, `${sounds}: a dot under each single sound, a dash under special friends.`, choiceOnly)),
];

// --- red words and green words --------------------------------------------------------------
const RED = [
  ['said', ['sand', 'slip', 'shed']], ['was', ['wig', 'web', 'win']], ['they', ['then', 'them', 'that']],
  ['come', ['camp', 'cost', 'crab']], ['once', ['inch', 'itch', 'ends']], ['where', ['wheel', 'white', 'whisk']],
  ['water', ['winter', 'wetter', 'wider']], ['could', ['cloud', 'cold', 'clod']], ['two', ['ten', 'tin', 'tub']],
  ['people', ['puppet', 'pocket', 'picnic']],
];
const GREEN = [
  ['stamp', ['said', 'once', 'could']], ['crunch', ['school', 'people', 'through']],
  ['flight', ['should', 'other', 'whose']], ['shark', ['there', 'where', 'water']],
];
const REDWORDS = [
  ...RED.map(([w, green]) => fact(`red.${w}`, 'red', 'Which is a red word? (You can’t Fred a red!)', w, green, `${w} is a red word: it doesn’t sound the way it looks, so we learn it by heart. The others can be Fred Talked.`, choiceOnly)),
  ...GREEN.map(([w, red]) => fact(`green.${w}`, 'red', 'Which is a green word? (You can Fred Talk it.)', w, red, `${w} is a green word: say its sounds and you can read it. The others are red words.`, choiceOnly)),
  fact('red.why.was', 'red', '“Was” is a red word. Why?', 'the a says o', ['it has no vowel', 'it is too long', 'it starts with w'], 'w-a-s should say “wass”, but we say “woz”: the a says o.', choiceOnly),
  fact('red.why.said', 'red', '“Said” is a red word. Which letters don’t make their usual sound?', 'ai', ['sa', 'id', 'sd'], 'ai usually says “ay” (snail in the rain), but in said it says “e”.', choiceOnly),
  fact('red.why.come', 'red', '“Come” is a red word. What does the o say?', 'u as in cup', ['o as in hot', 'oa as in boat', 'oo as in zoo'], 'In come, some, love and mother, the o says “u” as in cup.', choiceOnly),
  fact('red.why.they', 'red', '“They” is a red word. What does the ey say?', 'ay as in play', ['ee as in see', 'igh as in fly', 'e as in bed'], 'In they and grey, ey says “ay”. In key and monkey it says “ee”!', choiceOnly),
];

// --- alien words ----------------------------------------------------------------------------
const ALIEN_SOUND = [
  ['zort', 'or', ['oa', 'ar', 'ow']], ['vight', 'igh', ['ay', 'ee', 'oo']], ['blain', 'ai', ['oi', 'ay', 'ee']],
  ['thurp', 'ur', ['ar', 'or', 'ow']], ['groy', 'oy', ['oa', 'ow', 'ay']], ['stoob', 'oo', ['oa', 'ou', 'ow']],
  ['sheem', 'ee', ['ea', 'ie', 'ay']], ['splair', 'air', ['ear', 'are', 'ire']],
];
const ALIEN_HAS = [
  ['ay', 'may I play', 'glay', ['glop', 'glib', 'glug']],
  ['igh', 'fly high', 'jight', ['jarps', 'jorns', 'jilps']],
  ['ar', 'start the car', 'tharb', ['thebs', 'thubs', 'thobs']],
  ['ou', 'shout it out', 'frouk', ['freks', 'fraks', 'friks']],
  ['oi', 'spoil the boy', 'zoip', ['zapt', 'zept', 'zupt']],
  ['ew', 'chew the stew', 'plew', ['plop', 'plip', 'plup']],
];
const ALIEN_COUNT = [['blain', 'b-l-ai-n', 4], ['strom', 's-t-r-o-m', 5], ['chig', 'ch-i-g', 3], ['thorp', 'th-or-p', 3], ['splurt', 's-p-l-ur-t', 5], ['quoop', 'qu-oo-p', 3], ['shent', 'sh-e-n-t', 4]];
const ALIENS = [
  ...ALIEN_SOUND.map(([w, sound, wrong]) => fact(`alien.sound.${w}`, 'alien', `“${w}” is an alien word. Fred Talk it. Which Speed Sound is in it?`, sound, wrong, `${w} has ${sound} in it. Alien words aren’t real, so you have to use your sounds to read them.`, choiceOnly)),
  ...ALIEN_HAS.map(([sound, phrase, w, wrong]) => fact(`alien.has.${slug(sound)}`, 'alien', `Which alien word has “${sound}” as in “${phrase}”?`, w, wrong, `${w} has ${sound} in it, as in “${phrase}”.`, choiceOnly)),
  ...ALIEN_COUNT.map(([w, sounds, n], i) => fact(`alien.count.${w}`, 'alien', `How many sounds in the alien word “${w}”?`, String(n), NUMBERS.filter((x) => x !== String(n)).slice(i % 2, i % 2 + 3), `${sounds}: ${n} sounds.`, choiceOnly)),
];

const RWI = 'These follow the Read Write Inc. Speed Sounds many schools use.';
const topics = [
  { id: 'reading.rwi-set2', title: 'Set 2 Speed Sounds: ay ee igh ow oo ar or air ir ou oy', kind: 'facts', strand: 'phonics', prereqs: [], batch: 5, intro: 'Every Speed Sound has a phrase to help you remember it: ay, may I play! ee, what can you see! Say the phrase, then find the sound in a word.', teach: 'Teach me the phrase for “igh” and two words with that sound.', talk: `${RWI} Ask {him} to say the phrase for each sound, and to spot the sounds in a book.` },
  { id: 'reading.rwi-set3a', title: 'Set 3 Speed Sounds 1: ea oi a-e i-e o-e u-e aw are ur er', kind: 'facts', strand: 'phonics', prereqs: ['reading.rwi-set2'], batch: 5, intro: 'Set 3 sounds are new ways to write sounds you know. a-e is a split special friend: make a cake! The e at the end makes the a say its name.', teach: 'Explain how “slid” changes when you add an e at the end.', talk: `${RWI} Ask {him} for the phrase for a-e, i-e and o-e, and to read slid/slide, hop/hope.` },
  { id: 'reading.rwi-set3b', title: 'Set 3 Speed Sounds 2: ow ai oa ew ire ear ure tion cious e', kind: 'facts', strand: 'phonics', prereqs: ['reading.rwi-set3a'], batch: 5, intro: 'More Set 3 sounds: brown cow, snail in the rain, goat in a boat. Some sounds have two spellings: ay at the end of a word (play), ai in the middle (rain).', teach: 'Explain when to use “ay” and when to use “ai”.', talk: `${RWI} Ask {him} to write day and rain and explain the spelling choice.` },
  { id: 'reading.rwi-fred', title: 'Fred Talk and Fred Fingers', kind: 'facts', strand: 'phonics', prereqs: [], batch: 5, intro: 'Fred Talk means saying the sounds in a word, then pushing them together: sh-i-p, ship! Fred Fingers means holding up one finger for each sound. Special friends like sh and igh are one sound, so they get one finger.', teach: 'Fred Talk “night” for me, and tell me how many sounds it has.', talk: `${RWI} Say a word in Fred Talk (ch-ai-n) and ask {him} to say the word.` },
  { id: 'reading.rwi-red', title: 'Red words and green words', kind: 'facts', strand: 'phonics', prereqs: ['reading.rwi-fred'], batch: 5, intro: 'Green words can be read by Fred Talking them. Red words are tricky: they don’t sound the way they look, so “you can’t Fred a red”. We learn red words by heart.', teach: 'Explain why “said” is a red word.', talk: `${RWI} Write five red words on sticky notes around the house; {she} reads each one as {she} passes.` },
  { id: 'reading.rwi-alien', title: 'Alien words', kind: 'facts', strand: 'phonics', prereqs: ['reading.rwi-set2', 'reading.rwi-fred'], batch: 5, intro: 'Alien words are made-up words. They aren’t real, so you can’t guess them: you have to Fred Talk them. Ready for some alien names?', teach: 'Fred Talk the alien word “zort”. Which Speed Sound is in it?', talk: 'The Year 1 phonics check uses alien words, and they are still great practice: make up alien names together and read them.' },
];

const items = [
  ...speedSounds('set2', SET2, SPEED),
  ...speedSounds('set3a', SET3A, SPEED),
  ...speedSounds('set3b', SET3B, SPEED),
  ...SET3_EXTRA,
  ...FRED,
  ...REDWORDS,
  ...ALIENS,
];

export default [{ subject: 'reading', deck: 'phonics', topics, items }];

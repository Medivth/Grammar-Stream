// Year 2 spelling at greater depth: using it in writing. Proof-reading (spot it, fix it),
// adding -ment, -ness, -ful, -less and -ly in sentences, the common exception words still
// missing from the course plus every Year 2 word in a dictated sentence, and KS1 punctuation.
// Sentences borrow characters and moments from the Year 2 reading.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const strict = { strict: true };

const topics = [
  { id: 'spelling.proofread', title: 'Proof-reading: spot it, fix it', kind: 'facts', prereqs: ['spelling.punctuation', 'spelling.suffixes-2', 'spelling.cew-2'], batch: 5, intro: 'Good writers read their work again to find mistakes. Look for capital letters, full stops, question marks, tricky words and word endings. Spot it, then fix it!', teach: 'Explain how you check a sentence for mistakes, one thing at a time.', talk: 'Write a sentence with one mistake for {him} to find, then swap: {she} writes one for you.' },
  { id: 'spelling.suffix-use', title: 'Adding endings in my writing: -ment, -ness, -ful, -less, -ly', kind: 'facts', prereqs: ['spelling.suffixes-2'], batch: 5, intro: 'Most words stay the same when you add -ment, -ness, -ful, -less or -ly: enjoy → enjoyment. Two rules: a y after a consonant changes to i (happy → happiness), and -le words swap le for ly (gentle → gently). And -ful has only one l!', teach: 'Explain why happy + ness is spelt “happiness”.', talk: 'Pick a root word and see how many endings {she} can add: care → careful, careless, carefully.' },
  { id: 'spelling.cew-extra', title: 'Spelling: the little words from Years 1 and 2', kind: 'facts', prereqs: ['spelling.cew-1'], batch: 5, intro: 'These are the rest of the tricky words from the Year 1 and Year 2 lists. You use them in nearly every sentence, so they need to be spot on!', teach: 'Explain the tricky part of “our”, and why “I” is always a capital letter.', talk: 'Ask {him} to write one sentence using “our”, “your” and “Mrs”.' },
  { id: 'spelling.cew-use', title: 'Tricky words in sentences', kind: 'facts', prereqs: ['spelling.cew-3'], batch: 5, intro: 'Now use the tricky words in proper sentences, just like in your own writing. Listen to the word, then write it.', teach: 'Choose one tricky word and say a new sentence that uses it.', talk: 'Read one of these sentences aloud for {him} to write on paper, like a little dictation: tricky words and all.' },
  { id: 'spelling.cew-use-2', title: 'Tricky words in sentences 2', kind: 'facts', prereqs: ['spelling.cew-use', 'spelling.cew-5'], batch: 5, intro: 'More tricky words from the Year 2 list, in sentences from the stories you have read.', teach: 'Choose one tricky word and say a new sentence that uses it.', talk: 'Dictate a sentence with two tricky words in it, such as “Who could find the money?”, for {him} to write.' },
  { id: 'spelling.punct-use', title: 'Punctuation in my sentences', kind: 'facts', prereqs: ['spelling.apostrophes'], batch: 5, intro: 'Punctuation helps your reader. Capital letters start sentences and names (and I). End with . or ? or !. Commas go between things in a list. Apostrophes show missing letters (can’t) or that something belongs to someone (Peter’s jacket).', teach: 'Explain the difference between “the knights” and “the knight’s shield”.', talk: 'Spot an apostrophe on a sign or a book cover, and ask {him} what job it is doing.' },
];

const items = [];

// ---------------------------------------------------------------- proof-reading
const FIX = 'Spot it, fix it! One word is spelt wrong. Write that word correctly:';
items.push(
  mcq('pr.cap', 'proofread', 'Spot the mistake: “turbo raced round the track.”', [['A capital letter is missing.', true], ['A full stop is missing.', false, 'Look at the end: the full stop is there.'], ['It needs a question mark.', false, 'It tells you something: it isn’t asking.']], 'Turbo starts the sentence, and it is a name too: it needs a capital T.'),
  mcq('pr.stop', 'proofread', 'Spot the mistake: “Bleep switched on his signal beam”', [['A full stop is missing.', true], ['A capital letter is missing.', false, 'Bleep has its capital: it starts the sentence and it is a name.'], ['A comma is missing.', false, 'There is no list here, so no comma is needed.']], 'A sentence that tells you something ends with a full stop.'),
  mcq('pr.q', 'proofread', 'Spot the mistake: “Where did the rocket land.”', [['It should end with a question mark.', true], ['A capital letter is missing.', false, 'Where starts with a capital W already.'], ['A comma is missing from the list.', false, 'There is no list in this sentence.']], 'It asks something (Where…?), so it ends with a question mark.'),
  mcq('pr.i', 'proofread', 'Spot the mistake: “On Saturday i went to the castle.”', [['A capital letter is missing.', true], ['A full stop is missing.', false, 'The full stop is there at the end.'], ['It should end with a question mark.', false, 'It isn’t asking anything.']], 'When you write about yourself, I is always a capital letter.'),
  mcq('pr.name', 'proofread', 'Spot the mistake: “We had a picnic with sam and Maya.”', [['A capital letter is missing.', true], ['An apostrophe is missing.', false, 'Nothing belongs to anyone, and no letters are missed out.'], ['It should end with an exclamation mark.', false, 'A full stop is fine for a calm statement.']], 'Sam is a name, so it needs a capital S.'),
  mcq('pr.exclaim', 'proofread', 'Spot the mistake: “What a huge dragon it was.”', [['It should end with an exclamation mark.', true], ['It should end with a question mark.', false, 'It starts with What, but it isn’t asking: it shows surprise.'], ['A capital letter is missing.', false, 'What has its capital already.']], 'A “What a…” sentence that shows surprise is an exclamation: What a huge dragon it was!'),
  mcq('pr.list', 'proofread', 'Spot the mistake: “We saw lions tigers and bears.”', [['A comma is missing from the list.', true], ['It should end with a question mark.', false, 'It tells you something: it isn’t asking.'], ['A capital letter is missing.', false, 'The capital W is there, and none of these words are names.']], 'Put a comma between the things in a list: lions, tigers and bears.'),
  mcq('pr.clean', 'proofread', 'Which sentence has NO mistakes?', [['The children were very happy.', true], ['The childen were very happy.', false, 'Look at “childen”: it is spelt children.'], ['The children was very happy.', false, 'More than one child: they were, not was.'], ['the children were very happy.', false, 'Every sentence starts with a capital letter.']], 'Read every word, then check the capital letter and the full stop.'),
  mcq('pr.clean2', 'proofread', 'Which sentence has NO mistakes?', [['Sir Rowan pulled the thorn out carefully.', true], ['Sir Rowan pulled the thorn out carefuly.', false, 'careful + ly = carefully, with two l’s.'], ['Sir rowan pulled the thorn out carefully.', false, 'Rowan is a name, so it needs a capital R.'], ['Sir Rowan pulled the thorn out carefully', false, 'A full stop is missing at the end.']], 'Check each thing in turn: spelling, capital letters, the end of the sentence.'),
  fact('pr.because', 'proofread', `${FIX} “I wore my coat becos it was cold.”`, 'because', ['becos', 'becuase', 'becauze'], 'because: Big Elephants Can Always Understand Small Elephants.', strict),
  fact('pr.said', 'proofread', `${FIX} “The knight sed hello to the dragon.”`, 'said', ['sed', 'siad', 'sayd'], 'said sounds like “sed”, but it is spelt s-a-i-d.', strict),
  fact('pr.people', 'proofread', `${FIX} “Lots of peeple came to watch the race.”`, 'people', ['peeple', 'pepole', 'peopel'], 'people: peo-ple, with an o after the e.', strict),
  fact('pr.could', 'proofread', `${FIX} “I cud see the Moon from my window.”`, 'could', ['cud', 'coud', 'cowld'], 'could: O U Lucky Duck (o-u-l-d), like would and should.', strict),
  fact('pr.friend', 'proofread', `${FIX} “My best frend is coming to tea.”`, 'friend', ['frend', 'freind', 'frind'], 'friend: i before e here. “A friend to the end.”', strict),
  fact('pr.happiness', 'proofread', `${FIX} “Winning the cup filled Blaze with happyness.”`, 'happiness', ['happyness', 'hapiness', 'happines'], 'happy + ness: the y changes to i, so it is happiness.', strict),
  fact('pr.hopeful', 'proofread', `${FIX} “Rosa felt hopefull before the race.”`, 'hopeful', ['hopefull', 'hopful', 'hoppeful'], 'The ending -ful has only one l: hopeful.', strict),
  fact('pr.enjoyment', 'proofread', `${FIX} “The fair gave us lots of enjoiment.”`, 'enjoyment', ['enjoiment', 'enjoymant', 'enjoyement'], 'Keep the root word the same: enjoy + ment = enjoyment.', strict),
  fact('pr.carefully', 'proofread', `${FIX} “Bleep turned the bolt very carefuly.”`, 'carefully', ['carefuly', 'carfully', 'carefullly'], 'careful + ly = carefully: one l from -ful, one from -ly.', strict),
);

// ---------------------------------------------------------------- endings in sentences
// [root, ending, sentence with ___, answer, wrong spellings, explain]
const ENDINGS = [
  ['happy', 'ness', 'Winning the cup filled Turbo with ___.', 'happiness', ['happyness', 'hapiness', 'happines'], 'happy ends in a consonant then y, so the y changes to i: happiness.'],
  ['happy', 'ly', 'Bleep beeped ___ all the way home.', 'happily', ['happyly', 'happly', 'happilly'], 'Consonant + y: the y changes to i before -ly. happy → happily.'],
  ['easy', 'ly', 'Bleep was small, so he fitted through the hatch ___.', 'easily', ['easyly', 'easly', 'easilly'], 'easy → easily: the y changes to i.'],
  ['angry', 'ly', 'The farmer grumbled ___ about the slow golden eggs.', 'angrily', ['angryly', 'angerly', 'angrilly'], 'angry → angrily: the y changes to i.'],
  ['gentle', 'ly', 'The dragon landed ___ and bowed its head.', 'gently', ['gentlely', 'gentley', 'gentally'], 'Words ending -le swap the le for ly: gentle → gently.'],
  ['simple', 'ly', 'It was ___ the best race ever!', 'simply', ['simplely', 'simpley', 'simplly'], 'Words ending -le swap the le for ly: simple → simply.'],
  ['care', 'ful', 'Be ___ on the icy corner!', 'careful', ['carefull', 'carful', 'caerful'], 'Keep the e of care and add -ful, with only one l.'],
  ['hope', 'ful', 'Rosa felt ___ as the car came into the pit lane.', 'hopeful', ['hopefull', 'hopful', 'hopefel'], 'hope + ful: keep the e, and -ful has one l.'],
  ['play', 'ful', 'The ___ kittens jumped up the rockery.', 'playful', ['playfull', 'plaiful', 'playfal'], 'play ends in a vowel then y, so the y stays: playful.'],
  ['beauty', 'ful', 'What a ___ golden desert it was!', 'beautiful', ['beautyful', 'beautifull', 'beutiful'], 'Consonant + y: the y changes to i. beauty → beautiful, with one l.'],
  ['plenty', 'ful', 'In summer, food was ___ for the grasshopper.', 'plentiful', ['plentyful', 'plentifull', 'plentefull'], 'plenty → plentiful: the y changes to i, and -ful has one l.'],
  ['help', 'less', 'Caught in the hunter’s net, the lion was ___.', 'helpless', ['helpliss', 'helples', 'helpeless'], 'help + less: just add the ending.'],
  ['fear', 'less', 'The ___ astronaut stepped onto the Moon.', 'fearless', ['fearliss', 'fearles', 'feerless'], 'fear + less: just add the ending. -less means “without”.'],
  ['penny', 'less', 'The greedy farmer lost his goose and was nearly ___.', 'penniless', ['pennyless', 'peniless', 'pennilless'], 'penny → penniless: the y changes to i.'],
  ['kind', 'ness', 'The Sun showed that ___ can win where force fails.', 'kindness', ['kindnes', 'kindniss', 'kindeness'], 'kind + ness: just add the ending.'],
  ['dark', 'ness', 'Bleep switched on his headlight in the ___.', 'darkness', ['darknes', 'darkniss', 'darckness'], 'dark + ness: just add the ending.'],
  ['sad', 'ness', 'The dog walked home in ___, with no bone at all.', 'sadness', ['saddness', 'sadnes', 'sadniss'], 'sad + ness: the root stays the same, so there is only one d.'],
  ['excite', 'ment', 'The sparrows flew to Peter in great ___.', 'excitement', ['excitment', 'excitemant', 'exsitement'], 'excite + ment: keep the e. Beatrix Potter wrote “in great excitement”.'],
  ['enjoy', 'ment', 'The crowd clapped and cheered with ___.', 'enjoyment', ['enjoiment', 'enjoyement', 'enjoymant'], 'enjoy ends in a vowel then y, so the y stays: enjoyment.'],
  ['move', 'ment', 'Sir Rowan saw a ___ in the dark cave.', 'movement', ['movment', 'movemant', 'moovement'], 'move + ment: keep the e. movement.'],
];
for (const [root, ending, sentence, answer, wrong, explain] of ENDINGS) {
  items.push(fact(`su.${answer}`, 'suffix-use', `Add -${ending} to “${root}” to finish the sentence: “${sentence}”`, answer, wrong, explain, strict));
}

// ---------------------------------------------------------------- common exception words
// The statutory Year 1 and Year 2 lists are spelt in spelling.mjs (cew-1 to cew-5) except
// these: the Year 1 words that are easy to read but still worth checking, and Mr and Mrs.
// [word, sentence with ___, clue, the tricky part, extra]
const MISSING = [
  ['the', '___ rocket blasted off into space.', 'the most common word of all', 't-h-e: the e makes a quick “uh” sound.'],
  ['a', 'I spy ___ big red bus!', 'one (before a word)', 'Just one letter: a.'],
  ['do', 'What ___ you want to be when you grow up?', 'I ___ my best', 'The o says “oo”: d-o.'],
  ['to', 'We went ___ the race track.', 'towards', 'The o says “oo”: t-o. (two is 2; too means also.)'],
  ['today', '___ is my birthday!', 'this day', 'to + day.'],
  ['of', 'Captain Nova drank a cup ___ tea.', 'a bag ___ sweets', 'It sounds like “ov”, but it is spelt o-f.'],
  ['are', 'We ___ going to win!', 'we ___, they ___', 'a-r-e: the e is silent.'],
  ['is', 'The sky on Mars ___ orange in a dust storm.', 'it ___', 'The s says “z”: i-s.'],
  ['his', 'The knight polished ___ shield.', 'belonging to him', 'The s says “z”: h-i-s.'],
  ['has', 'Bleep ___ a signal beam.', 'owns or holds', 'The s says “z”: h-a-s.'],
  ['I', '___ love to zoom round the track.', 'me, when I talk about myself', 'I is always a capital letter.'],
  ['you', 'Thank ___ for helping me!', 'the person I am talking to', 'y-o-u: three letters for “yoo”.'],
  ['your', 'Put on ___ helmet.', 'belonging to you', 'you + r.'],
  ['be', 'I want to ___ an astronaut.', 'I ___, you are, he is', 'b-e: the e says its name.'],
  ['he', '___ zoomed past Blaze to win!', 'a boy or a man', 'h-e: the e says its name.'],
  ['me', 'Can you help ___, please?', 'I want you to help ___', 'm-e: the e says its name.'],
  ['she', '___ found the glowing crystal.', 'a girl or a woman', 'sh-e: the e says its name.'],
  ['we', '___ won the cup together!', 'you and I', 'w-e: the e says its name.'],
  ['no', 'There is ___ air on the Moon.', 'not any', 'n-o. (know, with a silent k, means to have it in your head.)'],
  ['go', 'Ready, steady, ___!', 'start moving', 'g-o: the o says its name.'],
  ['so', 'It was ___ cold on the frosty planet.', 'very', 's-o. (sew is what you do with a needle.)'],
  ['by', 'The castle stood ___ the river.', 'next to', 'The y says “igh”: b-y. (buy is shopping; bye is goodbye.)'],
  ['my', 'This is ___ racing car.', 'belonging to me', 'The y says “igh”: m-y.'],
  ['here', 'Come over ___ and look!', 'in this place', 'h-e-r-e. It hides inside there and where: all three are place words.'],
  ['ask', 'Can I ___ a question?', 'want to know something', 'a-s-k: in many accents the a says “ar”.'],
  ['put', '___ the book back on the shelf.', 'place it', 'The u says “oo” as in book: p-u-t.'],
  ['our', 'This is ___ den in the woods.', 'belonging to us', 'o-u-r. It sounds like hour, but has no h.'],
  ['Mr', '___ Patel cleans the dinosaur museum.', 'a title before a man’s name', 'Short for Mister: capital M, then r.', { accept: ['Mr.'] }],
  ['Mrs', '___ Rabbit had four little bunnies.', 'a title before a married woman’s name', 'Short for Missus: capital M, then r and s.', { accept: ['Mrs.'] }],
];
for (const [word, sentence, clue, tricky, extra] of MISSING) items.push({ id: `spelling.sp.${word.toLowerCase()}`, topic: 'spelling.cew-extra', kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}`, ...extra });

// The whole Year 2 list again, dictated in longer sentences like the ones he writes.
// [word, sentence with ___, clue, the tricky part]
const IN_USE = [
  ['door', 'Bleep knocked on the spaceship ___ three times.', 'you open it to go in', 'Two o’s: d-o-o-r, like floor and poor.'],
  ['floor', 'The kitten’s ball rolled across the kitchen ___.', 'what you walk on', 'f-l-o-o-r: the same “oor” as door.'],
  ['poor', 'The ___ dragon had a thorn stuck in its toe.', 'not lucky', 'p-o-o-r: the same “oor” as door.'],
  ['because', 'The hare lost the race ___ he fell asleep.', 'for the reason that', 'Big Elephants Can Always Understand Small Elephants.'],
  ['find', 'Captain Nova needed to ___ the glowing crystal.', 'discover', 'The i says its name before nd: f-i-n-d.'],
  ['kind', 'Pip was ___ to everyone on the dark, stormy night.', 'friendly and helpful', 'The i says its name before nd: k-i-n-d.'],
  ['mind', 'Turbo did not ___ being the smallest car.', 'be bothered by', 'The i says its name before nd: m-i-n-d.'],
  ['behind', 'The tortoise was far ___, but she kept going.', 'at the back', 'be + hind.'],
  ['child', 'Every ___ in the class wrote a poem.', 'a young person', 'The i says its name before ld: c-h-i-l-d.'],
  ['children', 'The ___ cheered when the dragon bowed its head.', 'more than one child', 'child + ren: here the i says “i” as in pin.'],
  ['wild', 'Lions are ___ animals, but this one let the mouse go.', 'not tame', 'The i says its name before ld: w-i-l-d.'],
  ['climb', 'The hero had to ___ the tall ladder.', 'go up using hands and feet', 'Silent b at the end: c-l-i-m-b.'],
  ['most', 'Blaze was the ___ famous car in the league.', 'more than any other', 'The o says its name before st: m-o-s-t.'],
  ['only', 'There was ___ a little water at the bottom of the jug.', 'just', 'The o says its name: o-n-l-y.'],
  ['both', 'Turbo and Blaze ___ crossed the line together.', 'the two of them', 'b-o-t-h.'],
  ['old', 'The ___ owl shut his eyes and went to sleep.', 'not young', 'The o says its name before ld: o-l-d.'],
  ['cold', 'Bleep did not like the ___ purple planet.', 'not hot', 'The o says its name before ld: c-o-l-d.'],
  ['gold', 'Every morning the goose laid an egg made of ___.', 'a shiny yellow metal', 'The o says its name before ld: g-o-l-d.'],
  ['hold', 'Rosa tied on a rope to ___ in the sandstorm.', 'keep in your hands', 'The o says its name before ld: h-o-l-d.'],
  ['told', 'Sam ___ Rosa to keep practising.', 'past of tell', 'The o says its name before ld: t-o-l-d.'],
  ['every', 'The tortoise kept going, one step after another, ___ minute of the race.', 'each one', 'Say it in three parts to spell it: ev-er-y.'],
  ['everybody', '___ in Brickton came to the warm bakery.', 'all the people', 'every + body.'],
  ['even', 'Pip helped the whole town, ___ though she had no superpowers.', 'still; also', 'The first e says its name: e-v-e-n.'],
  ['great', 'The little mouse was a ___ help to the lion.', 'very good, or very big', 'g-r-e-a-t: the ea says “ay”.'],
  ['break', 'Be careful not to ___ the satellite.', 'smash or snap', 'b-r-e-a-k: the ea says “ay”, like great.'],
  ['steak', 'The hungry dog wished his bone was a juicy ___.', 'a thick slice of meat', 's-t-e-a-k: the ea says “ay”, like great.'],
  ['pretty', 'The garden was ___, but Mr. McGregor was cross.', 'lovely to look at', 'It says “prit”, but it is spelt p-r-e-t-t-y, with double t.'],
  ['beautiful', 'The sky over the desert was a ___ bright blue.', 'very lovely', 'beau-ti-ful: b-e-a-u, and -ful has one l.'],
  ['after', '___ fifty pebbles, the water was right at the top.', 'later than', 'a-f-t-e-r.'],
  ['fast', 'The hare could run very ___.', 'quick', 'f-a-s-t.'],
  ['last', 'On the ___ lap, Blaze’s tyres were worn out.', 'at the end', 'l-a-s-t.'],
  ['past', 'Turbo crept ___ Blaze near the end of the race.', 'going by', 'p-a-s-t. (passed is the past tense of pass.)'],
  ['father', 'Peter’s ___ had an accident in Mr. McGregor’s garden.', 'dad', 'The a says “ar”: f-a-t-h-e-r.'],
  ['class', 'Our ___ read a fable about a clever crow.', 'a group at school', 'Double s at the end.'],
  ['grass', 'The tortoise plodded slowly over the ___.', 'green plants on the ground', 'Double s at the end.'],
  ['pass', 'Please ___ me the wheel gun.', 'hand it to someone', 'Double s at the end.'],
  ['plant', 'Stegosaurus ate leaves, so it was a ___ eater.', 'something green that grows', 'p-l-a-n-t.'],
  ['path', 'The ant carried her corn up and down the ___.', 'a little track to walk on', 'p-a-t-h.'],
  ['bath', 'After the muddy race, Turbo needed a ___.', 'where you wash', 'b-a-t-h.'],
  ['hour', 'The ride to the castle took an ___.', '60 minutes', 'Silent h: h-o-u-r.'],
  ['move', 'Dot the rover did not ___ for weeks after the dust storm.', 'change position', 'The o says “oo”: m-o-v-e.'],
  ['prove', 'Fossils ___ that dinosaurs lived long ago.', 'show that it is true', 'The o says “oo”, like move: p-r-o-v-e.'],
  ['improve', 'Rosa practised every day to ___.', 'get better', 'im + prove.'],
  ['sure', 'The hare was ___ he would win.', 'certain', 'The s says “sh”: s-u-r-e.'],
  ['sugar', 'Pip sprinkled ___ on the hot buns.', 'sweet stuff', 'The s says “sh”: s-u-g-a-r.'],
  ['eye', 'The dragon opened one sleepy ___.', 'you see with it', 'e-y-e: it looks like a face!'],
  ['could', 'The lion ___ not get free from the net.', 'was able to', 'O U Lucky Duck: c-o-u-l-d.'],
  ['should', 'The ant said the grasshopper ___ store food for the winter.', 'ought to', 'Like could: sh-o-u-l-d.'],
  ['would', 'The villagers thought the boy ___ trick them again.', 'was going to', 'Like could: w-o-u-l-d.'],
  ['who', '___ won the race: the hare or the tortoise?', 'which person', 'w-h-o.'],
  ['whole', 'The ___ town went dark when the power went out.', 'all of it', 'Silent w: w-h-o-l-e. (A hole is a gap.)'],
  ['any', 'There was not ___ food left for the grasshopper.', 'some, even one', 'The a says “e”: a-n-y.'],
  ['many', 'How ___ pebbles did the crow drop into the jug?', 'what number of', 'Like any: m-a-n-y.'],
  ['clothes', 'Peter’s ___ were on the scarecrow.', 'what you wear', 'cloth + es: c-l-o-t-h-e-s.'],
  ['busy', 'The ant was ___ all summer long.', 'with lots to do', 'The u says “i”: b-u-s-y.'],
  ['people', 'The ___ of Brickton were frightened of the dark.', 'more than one person', 'peo-ple: e then o.'],
  ['water', 'The crow dropped pebbles into the ___.', 'you drink it', 'The a says “or”: w-a-t-e-r.'],
  ['again', 'The boy cried “Wolf!” ___, but nobody came.', 'one more time', 'a-g-a-i-n.'],
  ['half', 'Rosa cut her sandwich in ___.', 'one of two equal parts', 'Silent l: h-a-l-f.'],
  ['money', 'People gave ___ to help build more Spitfires.', 'coins and notes', 'The o says “u”: m-o-n-e-y.'],
  ['Mr', '___ Patel showed Maya a real fossil footprint.', 'a title before a man’s name', 'Short for Mister: capital M, then r.', { accept: ['Mr.'] }],
  ['Mrs', '___ Tabitha Twitchit made hot buttered toast.', 'a title before a married woman’s name', 'Short for Missus: capital M, then r and s.', { accept: ['Mrs.'] }],
  ['parents', 'Maya’s ___ waved goodbye at the museum door.', 'mum and dad', 'par-ents.'],
  ['Christmas', 'At ___ the dragon lit the fires in the great hall.', 'a winter festival', 'Capital C, a silent h and a t you don’t hear: Christ-mas.'],
];
IN_USE.forEach(([word, sentence, clue, tricky, extra], i) => {
  items.push({ id: `spelling.cu.${word.toLowerCase()}`, topic: i < 32 ? 'spelling.cew-use' : 'spelling.cew-use-2', kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}`, ...extra });
});

// ---------------------------------------------------------------- punctuation
const SHORT = 'Write the short form of the words in bold:';
items.push(
  mcq('pc.names', 'punct-use', 'Which sentence has all the capital letters it needs?', [['Maya and Sam went to London on Monday.', true], ['Maya and sam went to London on monday.', false, 'Sam is a name and Monday is a day: both need capitals.'], ['maya and Sam went to london on Monday.', false, 'Start the sentence with a capital, and London is a place, so it needs one too.']], 'Capitals for the start of a sentence, names, places and days of the week.'),
  mcq('pc.i', 'punct-use', 'Which sentence is correct?', [['Rosa and I raced to the gate.', true], ['Rosa and i raced to the gate.', false, 'When you write about yourself, I is always a capital.'], ['rosa and I raced to the gate.', false, 'Rosa starts the sentence and is a name: capital R.']], 'I is always a capital letter, wherever it is in the sentence.'),
  mcq('pc.two', 'punct-use', 'Which is written as two correct sentences?', [['The dragon roared. It was huge.', true], ['The dragon roared it was huge.', false, 'There are two ideas here. Put a full stop and a capital letter between them.'], ['The dragon roared. it was huge.', false, 'After a full stop, the next sentence starts with a capital letter.']], 'Each sentence starts with a capital letter and ends with a full stop.'),
  mcq('pc.question', 'punct-use', 'Which sentence ends with the right mark?', [['Where is the glowing crystal?', true], ['Where is the glowing crystal.', false, 'It asks something, so it needs a question mark.'], ['Where is the glowing crystal!', false, 'It isn’t an exclamation: it asks a question.']], 'A question ends with a question mark.'),
  mcq('pc.exclaim', 'punct-use', 'Which sentence ends with the right mark?', [['What a fast car that is!', true], ['What a fast car that is?', false, 'It starts with What, but it isn’t asking anything: it shows surprise.'], ['What a fast car that is.', false, 'This shows strong feeling, so it needs an exclamation mark.']], 'A “What a…” sentence that shows strong feeling is an exclamation: it ends with !'),
  mcq('pc.how', 'punct-use', 'Which one needs a question mark at the end?', [['How fast can a cheetah run', true], ['How fast that cheetah runs', false, 'This shows surprise, so it is an exclamation: How fast that cheetah runs!'], ['That cheetah runs very fast', false, 'This tells you something: it is a statement.']], 'Both start with How, but only one asks something you could answer: How fast can a cheetah run?'),
  mcq('pc.list', 'punct-use', 'Which sentence uses commas correctly?', [['We need sticks, string and a blanket.', true], ['We need sticks string and a blanket.', false, 'Put a comma between the first things in the list.'], ['We need, sticks, string, and, a blanket.', false, 'Commas go between the things in the list, not after every word.']], 'Use commas between the things in a list, and “and” before the last one.'),
  mcq('pc.list2', 'punct-use', 'Which sentence uses commas correctly?', [['Triceratops had horns, a frill and a beak.', true], ['Triceratops had horns a frill, and a beak.', false, 'The comma goes after “horns”, and no comma is needed before “and”.'], ['Triceratops had, horns, a frill and a beak.', false, 'The list starts after “had”: no comma before horns.']], 'horns, a frill and a beak: a comma between the first things, then “and”.'),
  mcq('pc.where', 'punct-use', 'Where does the comma go? “I saw a rocket a planet and a star.”', [['after “rocket”', true], ['after “planet”', false, 'In a simple list, there is no comma before “and”.'], ['after “saw”', false, 'The list starts after “saw”, so no comma there.']], 'I saw a rocket, a planet and a star.'),
  mcq('pc.mixed', 'punct-use', 'Which sentence is punctuated correctly?', [['Can Bleep fix the bolt, the wire and the hatch?', true], ['Can Bleep fix the bolt the wire, and the hatch?', false, 'The comma goes after “bolt”, and not before “and”.'], ['can Bleep fix the bolt, the wire and the hatch?', false, 'Start the sentence with a capital letter.'], ['Can Bleep fix the bolt, the wire and the hatch.', false, 'It asks something, so it ends with a question mark.']], 'Capital letter, commas in the list, and a question mark because it asks something.'),
  fact('pc.couldnt', 'punct-use', `${SHORT} “I **could not** find my helmet.”`, 'couldn’t', ['could’nt', 'couldnt', 'coul’dnt'], 'could n(o)t → couldn’t: the apostrophe goes where the o was.', { strict: true, accept: ["couldn't"] }),
  fact('pc.didnt', 'punct-use', `${SHORT} “We **did not** see the wolf.”`, 'didn’t', ['did’nt', 'didnt', 'dident'], 'did n(o)t → didn’t: the apostrophe goes where the o was.', { strict: true, accept: ["didn't"] }),
  fact('pc.its', 'punct-use', `${SHORT} “**It is** time for the race.”`, 'It’s', ['Its', 'It’is', 'Its’'], 'It (i)s → It’s: the apostrophe takes the place of the i.', { strict: true, accept: ["It's"] }),
  fact('pc.wont', 'punct-use', `${SHORT} “I **will not** give up!”`, 'won’t', ['willn’t', 'wont', 'wo’nt'], 'will not → won’t. This one changes shape, so learn it by heart.', { strict: true, accept: ["won't"] }),
  mcq('pc.own', 'punct-use', 'Which sentence is correct?', [['Peter’s jacket had brass buttons.', true], ['Peters jacket had brass buttons.', false, 'The jacket belongs to Peter, so add ’s: Peter’s.'], ['Peters’ jacket had brass buttons.', false, 'There is one owner, so the apostrophe goes before the s.']], 'Add ’s to show that something belongs to someone: Peter’s jacket.'),
  mcq('pc.own2', 'punct-use', 'Which shows that the shield belongs to one knight?', [['the knight’s shield', true], ['the knights shield', false, 'With no apostrophe, it looks like more than one knight.'], ['the knight’s’ shield', false, 'Just one apostrophe, before the s.']], 'One knight owns it: the knight’s shield.'),
  mcq('pc.plural', 'punct-use', 'Which sentence is correct?', [['The cars raced round the track.', true], ['The car’s raced round the track.', false, '“cars” just means more than one car: a plural needs no apostrophe.'], ['The cars’ raced round the track.', false, 'Nothing belongs to the cars here, so there is no apostrophe.']], 'Never use an apostrophe just to make a plural.'),
);

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const W = (...rows) => ({ kind: 'blocks', rows });
const HAPPINESS = { join: '+', parts: [['happ', 'root', 'happy'], ['i', 'ending', 'y becomes i'], ['ness', 'suffix']], result: 'happiness' };
const GENTLY = { join: '+', parts: [['gent', 'root', 'gentle'], ['ly', 'suffix', 'le becomes ly']], result: 'gently' };
const CAREFUL = { join: '+', parts: [['care', 'root'], ['ful', 'suffix', 'one l']], result: 'careful' };
const ENJOYMENT = { join: '+', parts: [['enjoy', 'root', 'stays the same'], ['ment', 'suffix']], result: 'enjoyment' };
const TOPIC_VISUALS = {
  'spelling.suffix-use': { ...W(ENJOYMENT, HAPPINESS, GENTLY, CAREFUL), caption: 'Usually just add the ending. Watch for y → i, le → ly, and -ful with one l.' },
  'spelling.punct-use': { kind: 'table', head: ['Mark', 'Its job'], rows: [['Capital letter', 'Starts a sentence; names, places, days and I'], ['**.**  **?**  **!**', 'Ends a sentence: telling, asking, or strong feeling'], ['Comma **,**', 'Between things in a list: sticks, string and a torch'], ['Apostrophe **’**', 'Missing letters (can’t) or belonging (Peter’s jacket)']], tint: 'rows' },
};
const ITEM_VISUALS = {
  'spelling.su.happiness': W(HAPPINESS),
  'spelling.su.happily': W({ join: '+', parts: [['happ', 'root', 'happy'], ['i', 'ending', 'y becomes i'], ['ly', 'suffix']], result: 'happily' }),
  'spelling.su.gently': W(GENTLY),
  'spelling.su.careful': W(CAREFUL),
  'spelling.su.beautiful': W({ join: '+', parts: [['beaut', 'root', 'beauty'], ['i', 'ending', 'y becomes i'], ['ful', 'suffix', 'one l']], result: 'beautiful' }),
  'spelling.su.enjoyment': W(ENJOYMENT),
  'spelling.su.excitement': W({ join: '+', parts: [['excite', 'root', 'keep the e'], ['ment', 'suffix']], result: 'excitement' }),
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'spelling', deck: 'depth', topics, items }];

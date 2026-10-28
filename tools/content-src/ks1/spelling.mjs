// Year 2 spelling and grammar: the statutory common exception words (the trickiest Year 1
// ones and all of Year 2), a Year 3/4 taster, suffixes, homophones, word classes,
// punctuation, apostrophes and joining words. Plus short sentence challenges.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };

// [word, sentence with ___, clue, the tricky part]
const LISTS = {
  'Tricky Year 1 words': [
    ['pull', '___ the rope!', 'tug towards you', 'Double l: p-u-l-l.'],
    ['full', 'The rocket’s tank is ___.', 'cannot fit any more', 'Double l at the end, but -ful has one l.'],
    ['said', '“Ready, steady, go!” ___ the starter.', 'spoke', 'It sounds like “sed” but is spelt s-a-i-d.'],
    ['says', 'Mum ___ it is time for bed.', 'speaks (now)', 'Sounds like “sez”: s-a-y-s.'],
    ['were', 'The cars ___ very fast.', 'past of “are”', 'w-e-r-e: it rhymes with “her”.'],
    ['was', 'The rocket ___ ready to launch.', 'past of “is”', 'Sounds like “woz” but spelt w-a-s.'],
    ['they', '___ zoomed round the track.', 'those people', 'Ends in -ey, not -ay.'],
    ['there', 'The trophy is over ___.', 'in that place', 'There has “here” inside it: a place word.'],
    ['where', '___ is my helmet?', 'which place', 'Starts with wh-, and has “here” inside: a place word.'],
    ['love', 'I ___ space adventures.', 'like very much', 'The “uh” sound is spelt with o, and it ends in e.'],
    ['come', 'Please ___ to my party.', 'move towards', 'o makes an “uh” sound; silent e on the end.'],
    ['some', 'Can I have ___ juice?', 'a few, a bit', 'Like come: o then m, with an e.'],
    ['one', 'Turbo came first: number ___.', 'the number 1', 'Sounds like “won” but spelt o-n-e.'],
    ['once', '___ upon a time…', 'one time', 'o-n-c-e: “one” with a c.'],
    ['friend', 'My best ___ is coming to play.', 'someone you like', 'I before e here: fr-i-e-n-d. “A friend to the end.”'],
    ['school', 'We go to ___ on Monday.', 'where you learn', 'sch- makes a “sk” sound.'],
    ['push', '___ the button to start the engine.', 'press away from you', 'u says “oo” as in book.'],
    ['house', 'The hero flew over the ___.', 'a home', 'ou-se: the e is silent.'],
  ],
  'Year 2 words: oor, ind, ild, old': [
    ['door', 'Knock on the ___.', 'you open it to go in', 'Two o’s then r: d-o-o-r.'],
    ['floor', 'The toy car rolled across the ___.', 'what you walk on', 'Like door: f-l-o-o-r.'],
    ['poor', 'The ___ puppy was lost in the rain.', 'not lucky; with little money', 'p-o-o-r: same “oor” as door.'],
    ['because', 'I wore a coat ___ it was cold.', 'for the reason that', 'Big Elephants Can Always Understand Small Elephants.'],
    ['find', 'Can you ___ the hidden robot?', 'discover', 'i says its name before nd.'],
    ['kind', 'The hero was ___ to everyone.', 'friendly and helpful', 'k-i-n-d: i says its name.'],
    ['mind', 'Use your ___ to solve the puzzle.', 'your thinking', 'm-i-n-d.'],
    ['behind', 'The cat hid ___ the sofa.', 'at the back of', 'be + hind.'],
    ['child', 'Every ___ got a medal.', 'a young person', 'i says its name before ld.'],
    ['children', 'The ___ cheered at the race.', 'more than one child', 'child + ren: the i changes sound.'],
    ['wild', 'Lions are ___ animals.', 'not tame', 'w-i-l-d.'],
    ['climb', 'Let’s ___ to the top of the tower.', 'go up using hands and feet', 'Silent b at the end!'],
    ['most', 'Turbo won the ___ races.', 'the biggest number', 'o says its name before st.'],
    ['only', 'There is ___ one cake left.', 'just', 'o says its name: o-n-l-y.'],
    ['both', 'I like ___ racing cars.', 'the two of them', 'b-o-t-h.'],
    ['cold', 'Space is very, very ___.', 'not hot', 'o says its name before ld: cold, gold, old, hold, told.'],
  ],
  'Year 2 words: long vowels and odd ones out': [
    ['every', 'I practise ___ day.', 'each one', 'e-v-e-r-y: say it in three parts to spell it: ev-er-y.'],
    ['everybody', '___ clapped for the winner.', 'all the people', 'every + body.'],
    ['even', 'Is 8 an odd or ___ number?', 'can be shared into 2 equal groups', 'e says its name: e-v-e-n.'],
    ['great', 'That was a ___ race!', 'very good', 'Sounds like “grate” but spelt g-r-e-a-t.'],
    ['break', 'Be careful not to ___ the window.', 'smash into pieces', 'Like great: ea says “ay”.'],
    ['steak', 'Dad cooked ___ for tea.', 'a thick slice of meat', 'ea says “ay” again.'],
    ['pretty', 'What a ___ flower.', 'lovely to look at', 'Starts “pre-” but says “prit”; double t.'],
    ['beautiful', 'The sunset was ___.', 'very lovely', 'beau-ti-ful: b-e-a-u. Ends -ful with one l.'],
    ['after', 'We had pudding ___ dinner.', 'later than', 'In many accents (like the south of England), a says “ar” in words like after, fast and last.'],
    ['fast', 'The racing car is very ___.', 'quick', 'f-a-s-t.'],
    ['last', 'Blaze came ___ in the race.', 'at the end', 'l-a-s-t.'],
    ['past', 'We walked ___ the castle.', 'beyond; going by', 'p-a-s-t.'],
    ['father', 'My ___ drives a red car.', 'dad', 'a says “ar”: f-a-t-h-e-r.'],
    ['class', 'Our ___ went to the museum.', 'a group at school', 'Double s at the end.'],
    ['grass', 'The football is on the ___.', 'green plants on the ground', 'Double s.'],
    ['pass', 'Please ___ the ball.', 'give or throw to someone', 'Double s.'],
  ],
  'Year 2 words: tricky sounds': [
    ['plant', 'We watered the ___.', 'something green that grows', 'a says “ar” in the south of England: p-l-a-n-t.'],
    ['path', 'Follow the ___ through the woods.', 'a little track to walk on', 'p-a-t-h.'],
    ['bath', 'I splash in the ___.', 'where you wash', 'b-a-t-h.'],
    ['hour', 'The race lasted an ___.', '60 minutes', 'Silent h: h-o-u-r.'],
    ['move', 'Don’t ___ until I say go!', 'change position', 'o says “oo”: m-o-v-e.'],
    ['prove', 'Can you ___ your answer is right?', 'show that it is true', 'Like move: p-r-o-v-e.'],
    ['improve', 'Practice helps you ___.', 'get better', 'im + prove.'],
    ['sure', 'Are you ___ it is right?', 'certain', 's says “sh”: s-u-r-e.'],
    ['sugar', 'Too much ___ is bad for your teeth.', 'sweet stuff', 's says “sh” again: s-u-g-a-r.'],
    ['eye', 'The pirate had a patch over one ___.', 'you see with it', 'e-y-e: it looks like a face!'],
    ['could', '___ you help me, please?', 'was able to', 'O U Lucky Duck: c-ould.'],
    ['should', 'You ___ wear a helmet.', 'ought to', 'Same pattern: sh-ould.'],
    ['would', 'I ___ love to fly in space.', 'if I could, I…', 'Same pattern: w-ould.'],
    ['who', '___ won the race?', 'which person', 'w-h-o: the w is silent.'],
    ['whole', 'He ate the ___ pizza!', 'all of it', 'Silent w: w-h-o-l-e. Not “hole”!'],
    ['water', 'Drink plenty of ___.', 'you drink it', 'a says “or”: w-a-t-e-r.'],
  ],
  'Year 2 words: last batch': [
    ['any', 'Have you got ___ sweets?', 'some, even one', 'a says “e”: a-n-y.'],
    ['many', 'How ___ laps are left?', 'a lot', 'Like any: m-a-n-y.'],
    ['clothes', 'Put your ___ away.', 'what you wear', 'cloth + es: c-l-o-t-h-e-s.'],
    ['busy', 'The race track was ___.', 'full of things happening', 'u says “i”: b-u-s-y.'],
    ['people', 'Lots of ___ came to watch.', 'more than one person', 'peo-ple: e-o in the middle.'],
    ['again', 'Let’s race ___!', 'one more time', 'a-g-a-i-n.'],
    ['half', 'Cut the cake in ___.', 'one of two equal parts', 'Silent l: h-a-l-f.'],
    ['money', 'I saved my ___ in a jar.', 'coins and notes', 'o says “uh”: m-o-n-e-y.'],
    ['parents', 'My ___ came to watch.', 'mum and dad', 'par-ents.'],
    ['Christmas', 'We open presents at ___.', 'a winter festival', 'Capital C, silent h, and a t you don’t hear: Christ-mas.'],
    ['old', 'The castle is very ___.', 'not new', 'o-l-d.'],
    ['gold', 'The winner gets a ___ medal.', 'a shiny yellow metal', 'g-o-l-d.'],
    ['hold', '___ on tight!', 'keep in your hands', 'h-o-l-d.'],
    ['told', 'She ___ us a story.', 'past of tell', 't-o-l-d.'],
  ],
};
const STRETCH = [
  ['answer', 'Write your ___ here.', 'what you say back', 'Silent w: ans-wer.'],
  ['believe', 'I ___ in you!', 'think it is true', 'There is a “lie” in believe.'],
  ['bicycle', 'I rode my ___ to the park.', 'a bike', 'bi (two) + cycle (wheel): bi-cy-cle.'],
  ['build', 'Let’s ___ a den.', 'make something', 'u then i: b-u-i-l-d.'],
  ['caught', 'The goalkeeper ___ the ball.', 'past of catch', '-aught says “ort”.'],
  ['centre', 'Stand in the ___ of the circle.', 'the middle', 'Ends -re in British English.'],
  ['different', 'Every snowflake is ___.', 'not the same', 'dif-fer-ent: double f.'],
  ['difficult', 'The puzzle was ___.', 'hard', 'dif-fi-cult: double f.'],
  ['early', 'We got up ___ for the race.', 'before the usual time', 'ear-ly.'],
  ['eight', 'A spider has ___ legs.', 'the number 8', 'e-i-g-h-t: silent gh.'],
  ['enough', 'Have you had ___ to eat?', 'as much as needed', '-ough says “uff”.'],
  ['February', 'My birthday is in ___.', 'the second month', 'Feb-ru-ary: don’t forget the first r!'],
  ['heard', 'I ___ a strange noise.', 'past of hear', 'There is an “ear” in heard.'],
  ['island', 'The pirates sailed to an ___.', 'land with water all round', 'Silent s: is-land.'],
  ['often', 'I ___ play football.', 'many times', 'Some people say the t, some don’t: o-f-t-e-n.'],
  ['strength', 'Superheroes have great ___.', 'being strong', 'strong → strength: e and ngth.'],
];

const topics = [];
const items = [];
Object.entries(LISTS).forEach(([title, words], i) => {
  const id = `spelling.cew-${i + 1}`;
  topics.push({ id, title: `Spelling: ${title}`, kind: 'facts', prereqs: i ? [`spelling.cew-${i}`] : [], batch: 5, intro: 'Tricky words don’t follow the usual rules, so we learn the tricky part. Look, say, cover, write, check!', teach: 'Pick one word and explain its tricky part.', talk: 'Ask {him} to spell one of this week’s words out loud.' });
  for (const [word, sentence, clue, tricky] of words) items.push({ id: `spelling.sp.${word.toLowerCase()}`, topic: id, kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` });
});
topics.push({ id: 'spelling.year3', title: 'Spelling: Year 3 and 4 words', kind: 'facts', tier: 'stretch', prereqs: ['spelling.cew-5'], batch: 5, intro: 'Words from the Year 3 and 4 list. These are real challenges for a Year 2 speller!', teach: 'Explain the trick for spelling “believe”.', talk: 'Ask {him} to spell “island” and spot the silent letter.' });
for (const [word, sentence, clue, tricky] of STRETCH) items.push({ id: `spelling.sp3.${word.toLowerCase()}`, topic: 'spelling.year3', kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` });

topics.push(
  { id: 'spelling.suffixes', title: 'Adding endings: -ing, -ed, -er, -est', kind: 'facts', prereqs: ['spelling.cew-1'], batch: 5, intro: 'When you add an ending, sometimes the word changes: hop → hopping (double the p), happy → happier (y becomes i).', teach: 'Explain why “hopping” has two p’s.', talk: 'Ask {him}: what is the -ing word for “run”? For “smile”?' },
  { id: 'spelling.suffixes-2', title: 'Endings: -ful, -less, -ness, -ment, -ly', kind: 'facts', prereqs: ['spelling.suffixes'], batch: 5, intro: 'Suffixes change what a word means: help → helpful → helpless. Watch out: -ful has only one l!', teach: 'Explain the difference between “careful” and “careless”.', talk: 'Make as many words as you can from “play” (playful, player, playing…).' },
  { id: 'spelling.homophones', title: 'Words that sound the same', kind: 'facts', prereqs: ['spelling.cew-2'], batch: 5, intro: 'Homophones sound the same but are spelt differently and mean different things: sea and see, knight and night.', teach: 'Explain the difference between “there” and “their”.', talk: 'Ask {him} to spell “night” and “knight” and explain which is which.' },
  { id: 'spelling.word-classes', title: 'Nouns, verbs, adjectives and adverbs', kind: 'facts', prereqs: [], batch: 5, intro: 'Words have jobs. Nouns name things. Verbs are doing words. Adjectives describe nouns. Adverbs describe how something is done.', teach: 'Find a noun, a verb and an adjective in: “The red car zoomed.”', talk: 'Ask {him} for three adjectives to describe a superhero.' },
  { id: 'spelling.punctuation', title: 'Full stops, question marks and exclamation marks', kind: 'facts', prereqs: ['spelling.word-classes'], batch: 5, intro: 'Every sentence starts with a capital letter. A statement ends with a full stop, a question with a question mark, and an exclamation with an exclamation mark!', teach: 'Explain the difference between a statement, a question and a command.', talk: 'Ask {him} to make up a question about space.' },
  { id: 'spelling.apostrophes', title: 'Apostrophes', kind: 'facts', prereqs: ['spelling.punctuation'], batch: 5, intro: 'An apostrophe can show missing letters (do not → don’t) or that something belongs to someone (the dog’s bone).', teach: 'Explain why “can’t” has an apostrophe.', talk: 'Find an apostrophe on a shop sign and ask what it is doing.' },
  { id: 'spelling.joining', title: 'Joining words and tenses', kind: 'facts', prereqs: ['spelling.punctuation'], batch: 5, intro: 'Joining words (conjunctions) like and, but, because and when make longer, better sentences. Tense tells us when something happens: past, present or future.', teach: 'Make a sentence using “because”.', talk: 'Start a sentence and ask {him} to finish it: “I was happy because…”' },
);

items.push(
  // suffixes
  fact('sx.hop', 'suffixes', 'Add -ing to “hop”.', 'hopping', ['hoping', 'hoppeing', 'hopeing'], 'Short vowel + one consonant: double the consonant. hop → hopping.', { strict: true }),
  fact('sx.run', 'suffixes', 'Add -ing to “run”.', 'running', ['runing', 'runeing', 'runnning'], 'Short vowel u + n: double the n.', { strict: true }),
  fact('sx.smile', 'suffixes', 'Add -ing to “smile”.', 'smiling', ['smileing', 'smilling', 'smilin'], 'Drop the e before adding -ing.', { strict: true }),
  fact('sx.race', 'suffixes', 'Add -ed to “race”.', 'raced', ['raceed', 'racced', 'racd'], 'It already ends in e, so just add -d.', { strict: true }),
  fact('sx.cry', 'suffixes', 'Add -ed to “cry”.', 'cried', ['cryed', 'cride', 'cryd'], 'Consonant + y: change y to i, then add -ed.', { strict: true }),
  fact('sx.happy', 'suffixes', 'Add -er to “happy”.', 'happier', ['happyer', 'happer', 'happyier'], 'Consonant + y: change y to i, then add -er.', { strict: true }),
  fact('sx.big', 'suffixes', 'Add -est to “big”.', 'biggest', ['bigest', 'bigeest', 'biggst'], 'Short vowel + g: double the g.', { strict: true }),
  fact('sx.fast', 'suffixes', 'Add -est to “fast”.', 'fastest', ['fasttest', 'fastst', 'fastist'], 'Two consonants at the end already: just add -est.', { strict: true }),
  fact('sx2.help', 'suffixes-2', 'Add -ful to “help”.', 'helpful', ['helpfull', 'helpfel', 'helful'], '-ful has only one l!', { strict: true }),
  fact('sx2.care', 'suffixes-2', 'What does “careless” mean?', 'without care', ['full of care', 'very caring', 'caring again'], '-less means without: careless = without care.', choiceOnly),
  fact('sx2.kind', 'suffixes-2', 'Add -ness to “kind”.', 'kindness', ['kindnes', 'kindniss', 'kindeness'], 'kind + ness = kindness.', { strict: true }),
  fact('sx2.happy', 'suffixes-2', 'Add -ness to “happy”.', 'happiness', ['happyness', 'hapiness', 'happines'], 'Consonant + y: y becomes i. happy → happiness.', { strict: true }),
  fact('sx2.enjoy', 'suffixes-2', 'Add -ment to “enjoy”.', 'enjoyment', ['enjoiment', 'enjoyement', 'enjoymant'], 'Vowel + y keeps the y: enjoy → enjoyment.', { strict: true }),
  fact('sx2.slow', 'suffixes-2', 'Turn “slow” into a word that tells HOW something is done.', 'slowly', ['slowley', 'slowy', 'slowful'], 'Adding -ly makes an adverb: slow → slowly.', { strict: true }),
  fact('sx2.hope', 'suffixes-2', 'Which word means “without hope”?', 'hopeless', ['hopeful', 'hoping', 'hopes'], '-less means without.', choiceOnly),
  // homophones
  mcq('hp.sea', 'homophones', 'Which word fits? “The pirate ship sailed across the ___.”', [['sea', true], ['see', false, '“see” is what you do with your eyes.']], 'sea (the ocean) and see (with your eyes) sound the same.'),
  mcq('hp.knight', 'homophones', 'Which word fits? “The ___ wore shining armour.”', [['knight', true], ['night', false, '“night” is when it is dark. A knight with a silent k is a soldier on a horse.']], 'knight (a soldier) and night (dark time) sound the same.'),
  mcq('hp.two', 'homophones', 'Which word fits? “I have ___ racing cars.”', [['two', true], ['to', false, '“to” is for going somewhere: to the shop.'], ['too', false, '“too” means also, or too much.']], 'two (2), to (towards) and too (also / too much).'),
  mcq('hp.their', 'homophones', 'Which word fits? “The children put on ___ helmets.”', [['their', true], ['there', false, '“there” is a place: over there.'], ['they’re', false, '“they’re” means they are.']], 'their = belonging to them. Their has “heir” inside it, someone who gets things.'),
  mcq('hp.blew', 'homophones', 'Which word fits? “The wind ___ the leaves away.”', [['blew', true], ['blue', false, '“blue” is a colour.']], 'blew (past of blow) and blue (colour) sound the same.'),
  mcq('hp.sun', 'homophones', 'Which word fits? “The ___ shone brightly in the sky.”', [['sun', true], ['son', false, 'A son is a boy in a family.']], 'sun (in the sky) and son (a boy) sound the same.'),
  mcq('hp.won', 'homophones', 'Which word fits? “Turbo ___ the race!”', [['won', true], ['one', false, '“one” is the number 1.']], 'won (past of win) and one (1) sound the same.'),
  mcq('hp.hear', 'homophones', 'Which word fits? “Can you ___ the rocket engines?”', [['hear', true], ['here', false, '“here” is a place. You hear with your ear: there is an “ear” in hear!']], 'hear has “ear” in it.'),
  mcq('hp.bear', 'homophones', 'Which word fits? “A brown ___ lives in the forest.”', [['bear', true], ['bare', false, '“bare” means with nothing on: bare feet.']], 'bear (the animal) and bare (uncovered) sound the same.'),
  // word classes
  mcq('wc.noun', 'word-classes', 'Which word is a noun (a naming word)?', [['rocket', true], ['quickly', false, 'quickly tells you how: it is an adverb.'], ['shiny', false, 'shiny describes something: it is an adjective.'], ['zoom', false, 'zoom is something you do: a verb.']], 'A noun names a person, place or thing: rocket, castle, hero.'),
  mcq('wc.verb', 'word-classes', 'Which word is a verb (a doing word)?', [['jumped', true], ['happy', false, 'happy describes: adjective.'], ['table', false, 'table is a thing: noun.'], ['slowly', false, 'slowly is an adverb.']], 'Verbs are actions: jumped, flies, races.'),
  mcq('wc.adj', 'word-classes', 'Which word is an adjective (a describing word)?', [['enormous', true], ['ran', false, 'ran is a verb.'], ['robot', false, 'robot is a noun.'], ['loudly', false, 'loudly is an adverb.']], 'Adjectives describe nouns: an enormous robot.'),
  mcq('wc.adv', 'word-classes', 'Which word is an adverb (it tells you HOW)?', [['quietly', true], ['quiet', false, 'quiet is an adjective. Add -ly to make the adverb: quietly.'], ['mouse', false, 'mouse is a noun.'], ['tiptoed', false, 'tiptoed is a verb.']], 'Many adverbs end in -ly: quietly, quickly, bravely.'),
  mcq('wc.find-adj', 'word-classes', 'In “The brave hero rescued the tiny kitten”, which two words are adjectives?', [['brave and tiny', true], ['hero and kitten', false, 'Those are nouns.'], ['rescued and the', false, 'rescued is a verb.']], 'brave describes the hero; tiny describes the kitten.'),
  mcq('wc.find-verb', 'word-classes', 'Find the verb: “Turbo zoomed past the finish line.”', [['zoomed', true], ['Turbo', false, 'Turbo is a name: a noun.'], ['past', false, 'past is not the action.'], ['line', false, 'line is a noun.']], 'zoomed is the doing word.'),
  fact('wc.noun-phrase', 'word-classes', 'Which is the best expanded noun phrase?', 'the shiny silver rocket', ['the rocket zoomed off', 'rocket silver the shiny', 'shiny and silver'], 'An expanded noun phrase adds describing words: the shiny silver rocket.', choiceOnly),
  // punctuation
  mcq('pu.q', 'punctuation', 'Which sentence needs a question mark?', [['What is the biggest planet', true], ['The biggest planet is Jupiter', false, 'That tells you something: it is a statement.'], ['Look at Jupiter', false, 'That is a command.']], 'Questions ask something and end with ?.'),
  mcq('pu.ex', 'punctuation', 'Which is an exclamation?', [['What a fast car that is!', true], ['Is that car fast?', false, 'That is a question.'], ['The car is fast.', false, 'That is a statement.']], 'In grammar, an exclamation starts with “What” or “How”, has a verb, and shows strong feeling: What a fast car that is!'),
  mcq('pu.cmd', 'punctuation', 'Which is a command (it tells you to do something)?', [['Put on your helmet.', true], ['I like my helmet.', false, 'That is a statement.'], ['Where is my helmet?', false, 'That is a question.']], 'Commands start with a bossy verb: Put, Go, Stop, Look.'),
  mcq('pu.cap', 'punctuation', 'Which sentence uses capital letters correctly?', [['On Monday, Sam went to London.', true], ['on monday, sam went to london.', false, 'Sentences, days, names and places all need capitals.'], ['On monday, Sam went to london.', false, 'Monday and London are names, so they need capitals too.']], 'Capitals for the start of a sentence, names, days, months and places, and the word I.'),
  mcq('pu.comma', 'punctuation', 'Where do the commas go in this list? “I saw a rocket a planet a star and a moon.”', [['I saw a rocket, a planet, a star and a moon.', true], ['I saw a rocket a planet, a star, and, a moon.', false, 'Commas go between the items, but not before “and” in a simple list.'], ['I saw, a rocket a planet a star and a moon.', false, 'The commas separate the items in the list.']], 'Use commas between items in a list, and “and” before the last one.'),
  fact('pu.i', 'punctuation', 'Which word always needs a capital letter, wherever it is in a sentence?', 'I', ['and', 'the', 'me'], '“I” is always a capital: Ben and I raced. Names, days, months and places need capitals too.', choiceOnly),
  // apostrophes
  fact('ap.dont', 'apostrophes', 'What is the short form of “do not”?', 'don’t', ['dont', 'do’nt', 'dont’'], 'The apostrophe goes where the missing letter was: do n(o)t → don’t.', { accept: ["don't"] }),
  fact('ap.cant', 'apostrophes', 'What is the short form of “cannot”?', 'can’t', ['cant', 'ca’nt', 'can’not'], 'can(no)t → can’t.', { accept: ["can't"] }),
  fact('ap.its', 'apostrophes', 'What is the short form of “it is”?', 'it’s', ['its', 'it’is', 'i’ts'], 'it (i)s → it’s.', { accept: ["it's"] }),
  fact('ap.ill', 'apostrophes', 'What is the short form of “I will”?', 'I’ll', ['Ill', 'I’wll', 'Iw’ll'], 'I (wi)ll → I’ll.', { accept: ["i'll", 'I’ll'] }),
  mcq('ap.own', 'apostrophes', 'Which shows that the helmet belongs to the driver?', [['the driver’s helmet', true], ['the drivers helmet', false, 'You need an apostrophe to show it belongs.'], ['the driver’s’ helmet', false, 'Just one apostrophe, before the s.']], 'Add ’s to show something belongs to someone: the driver’s helmet.'),
  mcq('ap.plural', 'apostrophes', 'Which sentence is correct?', [['I have three cars.', true], ['I have three car’s.', false, 'Plurals do NOT need an apostrophe.'], ['I have three cars’.', false, 'No apostrophe for a simple plural.']], 'Only use an apostrophe for missing letters or belonging, never just to make a plural.'),
  // joining words and tenses
  mcq('jn.because', 'joining', 'Choose the best joining word: “The hero was tired ___ he had flown all night.”', [['because', true], ['but', false, '“but” shows a surprise or contrast.'], ['or', false, '“or” gives a choice.']], '“because” gives a reason.'),
  mcq('jn.but', 'joining', 'Choose the best joining word: “Blaze was fast ___ Turbo was faster.”', [['but', true], ['because', false, 'There is no reason here: it is a contrast.'], ['so', false, '“so” shows a result.']], '“but” shows a contrast between two ideas.'),
  mcq('jn.when', 'joining', 'Choose the best joining word: “The crowd cheered ___ Turbo won.”', [['when', true], ['or', false, '“or” gives a choice.'], ['but', false, 'Nothing contrasts here.']], '“when” tells you the time something happened.'),
  mcq('jn.if', 'joining', 'Choose the best joining word: “You can play ___ you finish your tea.”', [['if', true], ['because', false, 'This is a condition, not a reason.'], ['and', false, '“and” does not show the condition.']], '“if” sets a condition.'),
  mcq('jn.past', 'joining', 'Which sentence is in the past tense?', [['The rocket landed on Mars.', true], ['The rocket lands on Mars.', false, 'That is the present tense.'], ['The rocket will land on Mars.', false, 'That is the future.']], 'Past tense verbs often end in -ed: landed.'),
  mcq('jn.prog', 'joining', 'Which sentence shows something happening right now?', [['The robot is dancing.', true], ['The robot danced.', false, 'That is past.'], ['The robot will dance.', false, 'That is future.']], '“is dancing” is the present progressive: happening now.'),
  fact('jn.ran', 'joining', 'What is the past tense of “run”?', 'ran', ['runned', 'runs', 'running'], 'run is irregular: today I run, yesterday I ran.', { strict: true }),
  fact('jn.flew', 'joining', 'What is the past tense of “fly”?', 'flew', ['flyed', 'flied', 'flown'], 'fly → flew. (“I have flown” uses a helper word.)', { strict: true }),
);

// short sentence challenges: one each session, checked automatically
const SENTENCES = [
  { id: 'k1s.question', title: 'Ask a question', prompt: 'Write a question you would ask an astronaut.', checks: [{ type: 'capital' }, { type: 'regex', pattern: '\\?["”’]?$', msg: 'A question ends with a question mark (?).' }, { type: 'minWords', n: 4, msg: 'Write at least 4 words.' }], model: 'What does Earth look like from space?', tip: 'Questions often start with What, Where, When, Why, How or Who.' },
  { id: 'k1s.because', title: 'Use “because”', prompt: 'Finish this sentence with a reason: “I love racing cars because…”', checks: [{ type: 'includesAll', words: ['because'], msg: 'Keep the word “because”.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 7, msg: 'Add a reason after “because”.' }], model: 'I love racing cars because they are fast and colourful.', tip: '“because” is always followed by a reason.' },
  { id: 'k1s.adjectives', title: 'Two describing words', prompt: 'Write a sentence about a superhero using TWO adjectives (describing words), like “brave” and “strong”.', checks: [{ type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 6, msg: 'Write at least 6 words.' }], model: 'The brave, strong hero flew over the city.', tip: 'Put adjectives before the noun: the brave hero.' },
  { id: 'k1s.exclaim', title: 'An exclamation', prompt: 'Write an exclamation that starts with “What” about a rocket. End it with an exclamation mark.', checks: [{ type: 'regex', pattern: '^["“]?What ', msg: 'Start with “What”.' }, { type: 'regex', pattern: '!["”’]?$', msg: 'End with an exclamation mark (!).' }], model: 'What a gigantic rocket that is!', tip: 'Exclamations show strong feelings: What a…! How…!' },
  { id: 'k1s.list', title: 'A list with commas', prompt: 'Write a sentence listing three things you would take to space. Use commas and “and”.', checks: [{ type: 'regex', pattern: ',', msg: 'Use a comma between the first items in your list.' }, { type: 'includesAll', words: ['and'], msg: 'Use “and” before the last item.' }, { type: 'capital' }, { type: 'endPunct' }], model: 'I would take a torch, a teddy and a sandwich.', tip: 'Commas between items, then “and” before the last one.' },
  { id: 'k1s.when', title: 'Use “when”', prompt: 'Write a sentence using “when”, like “I smile when…”', checks: [{ type: 'includesAll', words: ['when'], msg: 'Use the word “when”.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 5, msg: 'Write a bit more.' }], model: 'I smile when I win a race.', tip: '“when” joins two ideas and tells you the time.' },
  { id: 'k1s.past', title: 'Past tense', prompt: 'Write a sentence about something you did yesterday. Use the past tense (like “played” or “went”).', checks: [{ type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 5, msg: 'Write at least 5 words.' }, { type: 'regex', pattern: '\\b(\\w+ed|went|ran|saw|had|was|were|ate|made|came|got|did|swam|rode|built|flew|found|won|read)\\b', flags: 'i', msg: 'Use a past tense verb, like played, went or saw.' }], model: 'Yesterday I played football in the park.', tip: 'Past tense verbs often end in -ed, but some are special: went, saw, ran.' },
  { id: 'k1s.but', title: 'Use “but”', prompt: 'Write a sentence using “but”: “The robot was small but…”', checks: [{ type: 'includesAll', words: ['but'], msg: 'Use the word “but”.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 6, msg: 'Finish the idea after “but”.' }], model: 'The robot was small but very clever.', tip: '“but” shows a surprise: two ideas that don’t usually go together.' },
];

export default [{ subject: 'spelling', deck: 'core', topics, items, sentences: SENTENCES }];

// Year 2 spelling and grammar, part 2: the Year 2 spelling patterns (-dge, kn/wr/gn, -le/-el/
// -al/-il, -tion, wa/wor/war, o as in mother, ey), prefixes, plurals, compound words and
// sentence grammar; inverted commas as a Year 3 taster. Plus more sentence challenges.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `spelling.${id}`, topic: `spelling.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };
const strict = { strict: true };

// [word, sentence with ___, clue, the tricky part]
const PATTERNS = {
  'Patterns: -dge, -ge, kn, gn, wr': [
    ['badge', 'The knight wore a ___ on his tunic.', 'a little sign you pin on', 'After a short vowel, the “j” sound is -dge: badge, bridge, hedge.'],
    ['bridge', 'The train rattled over the ___.', 'it crosses a river', 'Short i, then -dge.'],
    ['hedge', 'The ball went over the ___.', 'a wall of bushes', 'Short e, then -dge.'],
    ['fudge', 'Grandma made chocolate ___.', 'a soft sweet', 'Short u, then -dge.'],
    ['huge', 'A ___ dragon landed on the castle.', 'enormous', 'After a long vowel, just -ge: huge, page, cage.'],
    ['large', 'I would like a ___ ice cream, please.', 'big', 'After “ar”, -ge: large, charge.'],
    ['change', 'Time to ___ the tyres!', 'swap for a new one', 'After n, -ge: change, orange.'],
    ['knock', '___ on the door before you go in.', 'tap loudly', 'Silent k: kn- says “n”.'],
    ['know', 'Do you ___ the answer?', 'have it in your head', 'Silent k, and -ow at the end.'],
    ['knee', 'He fell and hurt his ___.', 'the middle of your leg', 'Silent k, then double e.'],
    ['gnaw', 'The dog likes to ___ on a bone.', 'chew and chew', 'Silent g: gn- says “n”.'],
    ['write', 'Please ___ your name.', 'put words on paper', 'Silent w: wr- says “r”.'],
    ['wrong', 'That answer is ___.', 'not right', 'Silent w again.'],
    ['wrist', 'He wears a watch on his ___.', 'between hand and arm', 'Silent w: wr-ist.'],
  ],
  'Patterns: -le, -el, -al, -il, -tion': [
    ['little', 'A ___ mouse helped the lion.', 'small', '-le is the most common ending: lit-tle, with double t.'],
    ['middle', 'Stand in the ___ of the line.', 'the centre', 'mid-dle: double d.'],
    ['bottle', 'Fill your water ___.', 'you drink from it', 'bot-tle: double t.'],
    ['tunnel', 'The train went into a dark ___.', 'a passage under the ground', 'Some words end -el: tunnel, camel, travel.'],
    ['travel', 'I would like to ___ to the Moon.', 'go on a journey', 'trav-el.'],
    ['squirrel', 'A ___ ran up the tree.', 'Nutkin is one', 'squ-ir-rel: double r, then -el.'],
    ['metal', 'The robot is made of ___.', 'iron, steel or gold, for example', 'Some words end -al: metal, pedal, animal.'],
    ['pedal', 'Push the ___ to make the bike go.', 'you push it with your foot', 'ped-al.'],
    ['hospital', 'The nurse works at the ___.', 'where poorly people are cared for', 'hos-pi-tal.'],
    ['pencil', 'Sharpen your ___.', 'you write with it', 'Some words end -il: pencil, fossil, nostril.'],
    ['fossil', 'We found a dinosaur ___!', 'remains turned to stone', 'fos-sil: double s, then -il.'],
    ['station', 'The train stopped at the ___.', 'where trains stop', '-tion says “shun”: sta-tion.'],
    ['action', 'Lights, camera, ___!', 'doing something', 'ac-tion.'],
    ['motion', 'The car was in ___.', 'moving', 'mo-tion.'],
  ],
  'Patterns: wa, wor, war, o as in mother, ey': [
    ['want', 'I ___ to be an astronaut.', 'wish for', 'After w, a says “o”: want, watch, wash.'],
    ['watch', 'Let’s ___ the race.', 'look at', 'w-a-t-c-h: a says “o”, and -tch after a short vowel.'],
    ['wash', '___ your hands before tea.', 'clean with water', 'a says “o” after w.'],
    ['word', 'Spell this ___.', 'a group of letters that means something', 'After w, or says “ur”: word, work, world.'],
    ['work', 'The robots ___ all day.', 'do a job', 'wor- says “wur”.'],
    ['world', 'He flew all around the ___.', 'the Earth', 'wor- says “wur”, then -ld.'],
    ['warm', 'The sun is ___ today.', 'a bit hot', 'After w, ar says “or”: war, warm.'],
    ['towards', 'The rocket flew ___ the stars.', 'in the direction of', 'to-wards: ar says “or”.'],
    ['other', 'Where is my ___ glove?', 'the second one', 'o says “u” as in cup: o-ther.'],
    ['brother', 'My little ___ is three.', 'a boy in your family', 'o says “u”: bro-ther.'],
    ['Monday', 'School starts on ___.', 'the first day of the school week', 'Capital M, and o says “u”: Mon-day.'],
    ['nothing', 'There was ___ in the box.', 'not anything', 'o says “u”: no-thing.'],
    ['key', 'Turn the ___ to start the engine.', 'it opens a lock', 'ey says “ee”: key, monkey, donkey.'],
    ['monkey', 'The ___ swung from the tree.', 'a cheeky animal with a tail', 'o says “u” AND ey says “ee”: mon-key.'],
  ],
};

const topics = [];
const items = [];
Object.entries(PATTERNS).forEach(([title, words], i) => {
  const id = `spelling.pattern-${i + 1}`;
  topics.push({ id, title: `Spelling: ${title.replace('Patterns: ', '')}`, kind: 'facts', prereqs: i ? [`spelling.pattern-${i}`] : ['spelling.cew-2'], batch: 5, intro: 'These words follow a pattern. Learn the pattern, and you can spell hundreds of words!', teach: 'Pick one pattern and give two more words that follow it.', talk: 'Ask {him} to find a word with today’s pattern in a book or on a sign.' });
  for (const [word, sentence, clue, tricky] of words) items.push({ id: `spelling.sp2.${word.toLowerCase()}`, topic: id, kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` });
});

topics.push(
  { id: 'spelling.prefixes', title: 'Beginnings: un-, dis-, re-', kind: 'facts', prereqs: ['spelling.suffixes'], batch: 5, intro: 'A prefix goes at the start of a word and changes its meaning. un- and dis- mean “not”; re- means “again”.', teach: 'Explain what “unhappy” and “rebuild” mean.', talk: 'Ask {him} for the opposite of “lock”, “like” and “tidy” using a prefix.' },
  { id: 'spelling.plurals', title: 'One and many: plurals', kind: 'facts', prereqs: ['spelling.suffixes'], batch: 5, intro: 'Most words add -s for more than one. Words ending s, x, sh or ch add -es. Some words change completely: one mouse, two mice!', teach: 'Explain how to make “baby” and “box” plural.', talk: 'Ask {him} for the plural of “tooth”, “foot” and “child”.' },
  { id: 'spelling.compounds', title: 'Compound words', kind: 'facts', prereqs: ['spelling.cew-1'], batch: 5, intro: 'A compound word is two words joined together: foot + ball = football, sun + flower = sunflower.', teach: 'Explain what a compound word is, with two examples.', talk: 'Race to find compound words around the house (toothbrush, cupboard…).' },
  { id: 'spelling.grammar-2', title: 'Better sentences', kind: 'facts', prereqs: ['spelling.joining', 'spelling.word-classes'], batch: 5, intro: 'Great writers make sentences better: add adjectives to nouns, use adverbs to say how, and join ideas with and, but, because, when and if.', teach: 'Make this sentence better: “The car went.”', talk: 'Say a dull sentence and ask {him} to make it exciting.' },
  { id: 'spelling.speech', title: 'Speech marks', kind: 'facts', tier: 'stretch', prereqs: ['spelling.punctuation', 'spelling.apostrophes'], batch: 5, intro: 'Inverted commas (speech marks) go around the words someone actually says: “Ready for launch!” said the captain.', teach: 'Explain where the speech marks go in a sentence.', talk: 'Write a comic strip together and turn the speech bubbles into sentences with speech marks.' },
);

items.push(
  // prefixes
  fact('pf.unhappy', 'prefixes', 'Add un- to “happy”.', 'unhappy', ['unnhappy', 'unhapy', 'onhappy'], 'un- means not: unhappy = not happy.', strict),
  fact('pf.undo', 'prefixes', 'Which word means the opposite of “lock”?', 'unlock', ['dislock', 'relock', 'mislock'], 'un- + lock = unlock.', choiceOnly),
  fact('pf.dislike', 'prefixes', 'Which word means “not like”?', 'dislike', ['unlike', 'relike', 'mislike'], 'dis- + like = dislike. (“unlike” means “different from”.)', choiceOnly),
  fact('pf.disappear', 'prefixes', 'Add dis- to “appear”.', 'disappear', ['dissappear', 'disapear', 'disappeer'], 'dis + appear: one s, double p (because appear has a double p).', strict),
  fact('pf.rebuild', 'prefixes', 'What does “rebuild” mean?', 'build again', ['not build', 'build badly', 'build before'], 're- means again.', choiceOnly),
  fact('pf.replay', 'prefixes', 'Add re- to “play”.', 'replay', ['reeplay', 'riplay', 'repley'], 're + play = replay: play again.', strict),
  fact('pf.untidy', 'prefixes', 'Which word means “not tidy”?', 'untidy', ['distidy', 'retidy', 'notidy'], 'un- + tidy = untidy.', choiceOnly),
  fact('pf.disobey', 'prefixes', 'Which word means “not obey”?', 'disobey', ['unobey', 'reobey', 'misobey'], 'dis- + obey = disobey.', choiceOnly),
  mcq('pf.which', 'prefixes', 'Which word has a prefix?', [['unkind', true], ['under', false, '“under” is a whole word: there is no “der” on its own.'], ['uncle', false, '“uncle” is a whole word, not un + cle.']], 'unkind = un + kind. A prefix is added to a word that makes sense on its own.'),
  // plurals
  fact('pl.box', 'plurals', 'What is the plural of “box”?', 'boxes', ['boxs', 'boxies', 'boxen'], 'Words ending -x add -es.', strict),
  fact('pl.bus', 'plurals', 'What is the plural of “bus”?', 'buses', ['buss', 'busess', 'busies'], 'Words ending -s add -es.', strict),
  fact('pl.wish', 'plurals', 'What is the plural of “wish”?', 'wishes', ['wishs', 'wishies', 'wish'], 'Words ending -sh add -es.', strict),
  fact('pl.lunch', 'plurals', 'What is the plural of “lunch”?', 'lunches', ['lunchs', 'lunchies', 'lunchen'], 'Words ending -ch add -es.', strict),
  fact('pl.lady', 'plurals', 'What is the plural of “lady”?', 'ladies', ['ladys', 'ladyes', 'ladis'], 'Consonant + y: change y to i and add -es.', strict),
  fact('pl.toy', 'plurals', 'What is the plural of “toy”?', 'toys', ['toies', 'toyes', 'tois'], 'Vowel + y: just add -s.', strict),
  fact('pl.mouse', 'plurals', 'What is the plural of “mouse”?', 'mice', ['mouses', 'mices', 'meese'], 'Some plurals change completely: mouse → mice.', strict),
  fact('pl.foot', 'plurals', 'What is the plural of “foot”?', 'feet', ['foots', 'feets', 'footies'], 'foot → feet, tooth → teeth, goose → geese.', strict),
  fact('pl.man', 'plurals', 'What is the plural of “man”?', 'men', ['mans', 'mens', 'manes'], 'man → men, woman → women.', strict),
  fact('pl.sheep', 'plurals', 'What is the plural of “sheep”?', 'sheep', ['sheeps', 'shoop', 'sheepes'], 'Some words stay the same: one sheep, ten sheep. Fish and deer too!', strict),
  // compound words
  mcq('cp.foot', 'compounds', 'Which two words make “football”?', [['foot + ball', true], ['foo + tball', false, 'Both parts must be real words.'], ['fo + otball', false, 'Look for two whole words.']], 'foot + ball = football.'),
  fact('cp.sun', 'compounds', 'sun + flower =', 'sunflower', ['sunflour', 'sun-flower', 'sunnyflower'], 'Join them with no gap: sunflower.', strict),
  fact('cp.rain', 'compounds', 'rain + bow =', 'rainbow', ['rainboe', 'rainbo', 'rain bow'], 'rainbow.', strict),
  fact('cp.tooth', 'compounds', 'tooth + brush =', 'toothbrush', ['toothbrushh', 'tothbrush', 'tooth brush'], 'toothbrush.', strict),
  fact('cp.some', 'compounds', 'some + thing =', 'something', ['somthing', 'sumthing', 'some thing'], 'Keep the e of “some”: something.', strict),
  fact('cp.space', 'compounds', 'space + ship =', 'spaceship', ['spaceshipp', 'spacship', 'space ship'], 'spaceship.', strict),
  mcq('cp.which', 'compounds', 'Which is a compound word?', [['playground', true], ['playing', false, 'play + ing: -ing is an ending, not a word.'], ['player', false, '-er is an ending, not a word.']], 'play + ground: two whole words.'),
  mcq('cp.make', 'compounds', 'Which word joins with “fire” to make a compound word?', [['work (firework)', true], ['ing (firing)', false, '-ing is an ending, not a word.'], ['ed (fired)', false, '-ed is an ending.']], 'fire + work = firework. Also fireman, fireplace, firefly!'),
  // better sentences
  mcq('gr.np', 'grammar-2', 'Which sentence has the best expanded noun phrase?', [['The gleaming red racing car zoomed past.', true], ['The car zoomed past us very, very quickly.', false, 'That adds an adverb (how it zoomed), but the noun “car” has no describing words.'], ['Yesterday, after lunch, the car zoomed past.', false, 'That tells us when, but the noun “car” has no describing words.']], '“the gleaming red racing car” gives the reader a clear picture.'),
  mcq('gr.adv', 'grammar-2', 'Which adverb best fits? “The spy crept ___ past the guard.”', [['silently', true], ['loudly', false, 'A spy creeping past a guard wants to be quiet!'], ['happily', false, 'It doesn’t tell us how a spy sneaks.']], 'Adverbs tell us how: crept silently.'),
  mcq('gr.coord', 'grammar-2', 'Which joining word gives a CHOICE?', [['or', true], ['and', false, '“and” adds another idea.'], ['but', false, '“but” shows a contrast.']], '“Would you like juice or milk?”'),
  mcq('gr.that', 'grammar-2', 'Choose the best joining word: “I hope ___ we win the race.”', [['that', true], ['or', false, '“I hope or we win” doesn’t make sense.'], ['but', false, '“I hope but we win” doesn’t make sense.']], '“that” introduces what you hope: I hope that we win.'),
  mcq('gr.statement', 'grammar-2', 'What kind of sentence is this? “Mars is the red planet.”', [['A statement', true], ['A question', false, 'It doesn’t ask anything.'], ['A command', false, 'It doesn’t tell anyone to do something.'], ['An exclamation', false, 'It is a calm fact, with a full stop.']], 'A statement tells you something and ends with a full stop.'),
  mcq('gr.tense', 'grammar-2', 'Which sentence is in the PAST tense all the way through?', [['The knight rode to the castle and knocked on the door.', true], ['The knight rode to the castle and knocks on the door.', false, '“knocks” is present tense. Keep the tense the same.'], ['The knight rides to the castle and knocked on the door.', false, '“rides” is present. Both verbs should be past.']], 'Keep the tense the same: rode… knocked.'),
  mcq('gr.was', 'grammar-2', 'Which is correct?', [['We were racing.', true], ['We was racing.', false, 'With “we”, use “were”.'], ['We is racing.', false, 'With “we”, use “are” (now) or “were” (past).']], 'I was, you were, he was, we were, they were.'),
  mcq('gr.past-prog', 'grammar-2', 'Which sentence shows something that WAS happening for a while?', [['The rain was falling all night.', true], ['The rain falls every single night.', false, 'That is present tense.'], ['The rain will fall all night long.', false, 'That is future.']], '“was falling” is the past progressive: it was going on for a while.'),
  // speech marks (stretch)
  mcq('spm.where', 'speech', 'Which sentence has the speech marks in the right place?', [['“Blast off!” shouted the captain.', true], ['“Blast off! shouted the captain.”', false, 'Only the words that are SPOKEN go inside.'], ['Blast off! “shouted the captain.”', false, 'The captain didn’t say “shouted the captain”!']], 'Speech marks go round the exact words spoken.'),
  mcq('spm.spoken', 'speech', 'In “I can fly!” said the hero, which words were spoken?', [['I can fly!', true], ['said the hero', false, 'Those words tell us WHO spoke.'], ['the hero', false, 'That is who said it.']], 'The words inside the speech marks are the ones spoken aloud.'),
  mcq('spm.comma', 'speech', 'Which is punctuated correctly?', [['“We need fuel,” said Rosa.', true], ['“We need fuel” said Rosa.', false, 'You need a comma (or ! or ?) before the closing speech marks.'], ['“We need fuel.” said Rosa.', false, 'Use a comma, not a full stop, when “said Rosa” follows.']], 'When the sentence carries on after the speech, put a comma before the closing speech marks.'),
  mcq('spm.capital', 'speech', 'Which is correct?', [['The captain said, “Get ready.”', true], ['The captain said, “get ready.”', false, 'Spoken words start with a capital letter.'], ['The captain said “Get ready”.', false, 'Put a comma before the speech, and the full stop inside.']], 'Comma before the speech, capital letter to start it, punctuation inside the closing marks.'),
  mcq('spm.verbs', 'speech', 'Which is the most exciting word to use instead of “said”? “Help!” ___ the princess.', [['screamed', true], ['said', false, '“said” is fine, but “screamed” tells us how she said it.'], ['told', false, '“told” doesn’t fit here.']], 'Words like screamed, whispered and bellowed show HOW someone spoke.'),
);

// more short sentence challenges
const SENTENCES = [
  { id: 'k1s.speech', title: 'Speech marks', prompt: 'Write what a racing driver says at the start of a race. Use speech marks and “said”.', checks: [{ type: 'regex', pattern: '[“"][^”"]+[”"]', msg: 'Put speech marks around the spoken words: “…”' }, { type: 'includesAll', words: ['said'], msg: 'Use the word “said” (or try “shouted”, but keep “said” this time).' }, { type: 'endPunct' }], model: '“Let’s go!” said the driver.', tip: 'Only the spoken words go inside the speech marks.' },
  { id: 'k1s.if', title: 'Use “if”', prompt: 'Write a sentence using “if”: “If I were a superhero, I would…”', checks: [{ type: 'includesAll', words: ['if'], msg: 'Use the word “if”.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 7, msg: 'Finish the idea: what would you do?' }], model: 'If I were a superhero, I would fly to the Moon.', tip: '“if” sets up something that might happen.' },
  { id: 'k1s.adverb', title: 'Add an adverb', prompt: 'Write a sentence about a spy using an adverb ending in -ly, like “silently” or “quickly”.', checks: [{ type: 'regex', pattern: '\\b\\w{3,}ly\\b', flags: 'i', msg: 'Use an adverb ending in -ly.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 5, msg: 'Write at least 5 words.' }], model: 'The spy crept silently past the guard.', tip: 'Adverbs tell the reader HOW something happened.' },
  { id: 'k1s.command', title: 'A command', prompt: 'Write a command for a robot. Start with a bossy verb like “Go”, “Stop” or “Pick”.', checks: [{ type: 'regex', pattern: '^["“]?(Go|Stop|Pick|Put|Turn|Walk|Bring|Take|Open|Close|Make|Clean|Find|Fetch|Move|Push|Pull|Look|Sit|Stand|Switch|Press|Help|Give|Get|Carry|Jump|Run|Fly|Wait|Come|Tidy|Wash|Hold|Drive|Lift|Dance|Climb|Throw|Catch)\\b', msg: 'Start with a bossy verb, like Go, Stop or Pick.' }, { type: 'endPunct' }, { type: 'minWords', n: 3, msg: 'Write at least 3 words.' }], model: 'Pick up the red block.', tip: 'Commands start with a verb that tells someone what to do.' },
  { id: 'k1s.noun-phrase', title: 'A super noun phrase', prompt: 'Describe a dinosaur using “The” plus TWO adjectives before the noun, like “The huge, scaly dinosaur…”.', checks: [{ type: 'regex', pattern: '^["“]?The \\w+,? \\w+', msg: 'Start with “The” and two describing words.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 6, msg: 'Finish your sentence: what did the dinosaur do?' }], model: 'The huge, scaly dinosaur stomped through the jungle.', tip: 'Two adjectives can be separated by a comma: the huge, scaly dinosaur.' },
  { id: 'k1s.and-but', title: 'Two joining words', prompt: 'Write ONE sentence about a castle that uses both “and” and “but”.', checks: [{ type: 'includesAll', words: ['and', 'but'], msg: 'Use both “and” and “but”.' }, { type: 'capital' }, { type: 'endPunct' }, { type: 'minWords', n: 9, msg: 'Write a longer sentence.' }], model: 'The castle was big and strong, but the dragon was stronger.', tip: '“and” adds an idea; “but” adds a surprise.' },
];

export default [{ subject: 'spelling', deck: 'more', topics, items, sentences: SENTENCES }];

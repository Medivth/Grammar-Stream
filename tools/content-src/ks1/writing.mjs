// Weekly writing for Years 2 and 3 (this deck is in both courses): short pieces for different
// purposes, each built on a text he has read in the app (offered only once that reading topic
// has started), with words to borrow, one sentence trick to try, and the "Add, change, check"
// editing routine. Marked by a grown-up against the KS1 greater-depth writing standard.

// Six lines, each [name, [0 = not yet, 1 = expected, 2 = greater depth]]. Names are also shown
// to the child ("You did these really well: ..."); the levels are for the grown-up.
const RUBRIC = [
  ['Right for the purpose and the reader', ['Hard to tell what kind of writing it is, or the ideas are muddled', 'Clearly a story, letter, fact file… with ideas mostly in a sensible order', 'Works well for its purpose and reader: clear, in order, and good to read']],
  ['Words and sentences from reading', ['Plain words; sentences mostly joined with “and” or “then”', 'Some describing words and joining words (because, when, if, that)', 'Borrows words and sentence patterns from {her} reading and uses them well']],
  ['Punctuation', ['Capital letters and full stops often missing', 'Capital letters and full stops mostly right', 'Year 2 punctuation mostly right: capitals, full stops, ? and !, commas in lists, apostrophes']],
  ['Spelling', ['Many common exception words misspelt', 'Many common exception words right; some endings wrong', 'Most common exception words right, and endings (-ment, -ness, -ful, -less, -ly) added correctly']],
  ['Handwriting', ['Letters of mixed sizes; uneven spaces between words', 'Capitals and small letters the right size, with finger spaces', 'Letters the right size, and some joined with diagonal and horizontal strokes'], { paper: true }],
  ['Editing: add, change, check', ['No changes made', 'One or two changes or corrections', 'Additions, better words and proof-reading corrections, made without being told where']],
];

// The sentence tricks: [name, what it means]. Each prompt adds its own example.
const TRICKS = {
  past: ['Past tense', 'Tell it as if it has already happened.'],
  noun: ['Expanded noun phrases', 'Put describing words in front of a noun.'],
  because: ['Sentences with “because”', 'Use because to give a reason.'],
  when: ['Sentences with “when”', 'Use when to say what happens at the same time.'],
  if: ['Sentences with “if”', 'Use if to say what to do in case something happens.'],
  that: ['Sentences with “that”', 'Use that to join on what you think, hope or feel.'],
  list: ['Commas in a list', 'Put a comma between things in a list, and “and” before the last one.'],
  qe: ['Questions and exclamations', 'A question ends with ?. An exclamation starts with What or How and ends with !.'],
  apos: ['Apostrophes', 'An apostrophe shows missing letters (couldn’t) or that something belongs to someone (Pip’s bakery).'],
};

const PLANS = {
  story: ['Beginning: who is in it, and where are they?', 'Problem: what goes wrong?', 'Ending: how is it sorted out?'],
  recount: ['When and where?', 'What happened first?', 'What happened next?', 'At the end, and how I felt'],
  instructions: ['You need', 'Steps: what to do, in order'],
  letter: ['Who is it to?', 'Why are you writing?', 'How will you end it?'],
  report: ['What is it?', 'What is it like?', 'An amazing fact'],
  poem: ['What can you see?', 'What can you hear?', 'What can you feel?', 'A last line to finish'],
};

// Year 2 word ranges; Year 3 aims a little higher.
const WORDS = {
  story: [[80, 150], [120, 220]], recount: [[70, 140], [100, 200]], instructions: [[60, 120], [90, 160]],
  letter: [[60, 120], [90, 160]], report: [[70, 140], [100, 180]], poem: [[50, 100], [70, 130]],
};

const CHANGE = ['Swap one word for a better one from the word bank', 'Fix a sentence that sounds wrong when you read it aloud'];
const CHECK = ['Capital letters and full stops', '? and ! where they are needed', 'Commas in lists', 'Tricky words (said, because, could, people…)', 'Endings: -ful, -less, -ness, -ment, -ly', 'Some joined-up letters'];
const HANDWRITING = CHECK.length - 1; // only for pieces written on paper

/**
 * id, type, title, task, the text it builds on ([title, reading topic]), words to borrow,
 * [trick, example], one more detail to add, a possible first sentence; extra (plan) optional.
 */
const P = (id, type, title, task, [text, topic], borrow, [trick, example], detail, starter, extra = {}) => {
  const add = [detail, 'A describing word', type === 'instructions' ? 'A tip that starts with “if”' : 'A “because” sentence'];
  const check = [`I tried my sentence trick: ${TRICKS[trick][0].toLowerCase()}`, ...CHECK];
  return {
    id: `piece.ks1.${id}`, type, title, task, text, needsTopics: [topic], borrow,
    trick: { name: TRICKS[trick][0], how: TRICKS[trick][1], example },
    plan: extra.plan || PLANS[type],
    edit: { add, change: CHANGE, check },
    criteria: [...add, ...CHANGE, ...check],
    paperOnly: [add.length + CHANGE.length + 1 + HANDWRITING],
    words: WORDS[type][0], wordsY3: WORDS[type][1],
    starter,
    rubric: RUBRIC.map(([name, levels, opt]) => ({ name, levels, ...opt })),
  };
};

const PIECES = [
  // --- stories (retelling and changing stories he has read)
  P('hare-retell', 'story', 'Retell The Hare and the Tortoise',
    'Retell **The Hare and the Tortoise** in your own words, as if you are the storyteller. Tell it in order, and finish with the lesson.',
    ['The Hare and the Tortoise', 'reading.fables'],
    ['boasting', 'dashed', 'far ahead', 'slow and steady', 'never stopping', 'a nap', 'the finish line'],
    ['past', 'The hare **dashed** away, but the tortoise **kept** going.'],
    'What the hare said or thought when he woke up',
    'Once upon a time, there was a hare who was always boasting about how fast he could run.'),
  P('little-friend', 'story', 'A big animal and a little friend',
    'Change **The Lion and the Mouse** into a new story. Pick a different big animal and a different little animal. The big one laughs at the little one, then gets into trouble, and the little one saves the day.',
    ['The Lion and the Mouse', 'reading.fables'],
    ['mighty', 'tiny', 'squeaked', 'roared', 'nibbled', 'free', 'a great help'],
    ['noun', '**an enormous grey elephant**; **a tiny, brave beetle**'],
    'What the big animal looked like when it was stuck',
    'An enormous grey elephant was dozing by the river when a tiny beetle ran up his trunk.'),
  P('hero-rescue', 'story', '{hero} saves the day again',
    'In **{hero} and the Runaway Train**, your hero stopped a train. Write a new adventure where {hero} has to rescue someone else. What goes wrong, and how does the hero fix it?',
    ['{hero} and the Runaway Train', 'reading.stories-2'],
    ['a terrible noise', 'shot into the sky', 'sparks flew', 'slowly, slowly', 'shaking', 'safe', 'You saved us all'],
    ['when', '**When** the hero heard the crash, the ice cream fell to the ground.'],
    'How the people felt when they were safe',
    'It was a quiet Sunday by the sea, until a terrible noise filled the air.'),
  P('rowan-creature', 'story', 'Sir Rowan and the strange creature',
    'In **The Knight and the Dragon**, the dragon seemed scary but really needed help. Write a new story where Sir Rowan meets a different creature in the hills. It seems scary, but what does it really need?',
    ['The Knight and the Dragon', 'reading.stories-4'],
    ['echoed', 'frightened', 'enormous', 'curling', 'very carefully', 'sigh of relief', 'gently'],
    ['qe', '**What was that noise?** **What a huge creature it was!**'],
    'What Sir Rowan saw when he first found the creature',
    'Every night a strange howl echoed around Castle Rook, and the people were frightened.'),

  // --- recounts
  P('pip-diary', 'recount', 'Pip’s diary: the night the lights went out',
    'Be Pip from **The Quiet Hero**. Write Pip’s diary for the stormy night when the power went out. Write it as “I”, and say how you felt.',
    ['The Quiet Hero', 'reading.adventures'],
    ['stormy', 'candle', 'frightened', 'warm', 'hot bread', 'kind words', 'sleepy'],
    ['apos', '**I couldn’t** see a thing. **Thunderbolt’s** cape flapped in the wind.'],
    'One thing a person in the bakery said to you',
    'Dear Diary, what a night! It started when all the lights in Brickton went out.',
    { plan: ['When and where?', 'What happened first?', 'What happened in the night?', 'In the morning, and how I felt'] }),
  P('race-day', 'recount', 'My race day',
    'Rosa had a big race day in **Two Seconds**. Write a recount of a race you have really run or watched: sports day, a fun run, a go-kart track or a race in the park.',
    ['Two Seconds', 'reading.stories-2'],
    ['practised', 'thundered', 'heart pounded', 'crackled', 'roared', 'grinned', 'the fastest'],
    ['past', 'I **ran** as fast as I could and my heart **pounded**.'],
    'What you could hear at the start of the race',
    'On Saturday morning, I had my biggest race ever.'),
  P('day-out', 'recount', 'A day out to remember',
    'Maya and Sam had a sleepover in **A Night at the Dinosaur Museum**. Write a recount of a real day out you had: a museum, a castle, the beach, a zoo or a park.',
    ['A Night at the Dinosaur Museum', 'reading.stories-4'],
    ['giant', 'skeleton', 'whispered', 'special', 'millions of years ago', 'much more fun', 'brave'],
    ['because', 'The best part was the fossil **because** it was millions of years old.'],
    'The thing you liked best, and why',
    'Last week, I went to the castle with my family.'),

  // --- instructions
  P('pit-stop', 'instructions', 'How to do a pit stop',
    'In the fact file **Racing cars**, a pit crew changes all four tyres in about two seconds. Write instructions for a new pit crew member: how to change a tyre in a pit stop.',
    ['Racing cars', 'reading.facts'],
    ['pit lane', 'tyres', 'grip', 'mechanics', 'fireproof suit', 'helmet', 'about two seconds'],
    ['when', '**When** the car stops, put the wheel gun on the nut.'],
    'One more thing you need, and what it is for',
    'Do you want to be the fastest pit crew in the world? Follow these steps.'),
  P('build-den', 'instructions', 'How to build a den in the woods',
    'Nutkin and his cousins made rafts out of twigs in **The Tale of Squirrel Nutkin**. Write instructions to show someone how to build a den out of sticks in the woods.',
    ['The Tale of Squirrel Nutkin', 'reading.nutkin'],
    ['twigs', 'gather', 'hollow', 'oak-tree', 'bushes', 'spread out', 'golden and green'],
    ['list', 'You will need long sticks, short twigs, an old blanket and some string.'],
    'How to make the den cosy inside',
    'A den is a great place to hide, and you can build one with things you find in the woods.'),
  P('look-after-kitten', 'instructions', 'How to look after a kitten',
    'In **{hero} and the Sniffly Day**, a kitten got stuck on a roof. Write instructions for the little girl: how to look after a kitten and keep it safe.',
    ['{hero} and the Sniffly Day', 'reading.stories-4'],
    ['softly', 'crept close', 'tucked', 'a warm jacket', 'hiding', 'hugged', 'stuck'],
    ['if', '**If** your kitten hides, speak softly until it creeps out.'],
    'What a kitten needs at night',
    'Kittens are small and curious, so they need lots of care.'),

  // --- letters
  P('lion-thanks', 'letter', 'A thank-you letter from the lion',
    'Be the lion from **The Lion and the Mouse**. Write a thank-you letter to the mouse who saved you. Say what happened and why you are sorry you laughed.',
    ['The Lion and the Mouse', 'reading.fables'],
    ['mighty', 'tiny', 'hunter’s net', 'roared and roared', 'nibbled through', 'free', 'a great help'],
    ['that', 'I am so glad **that** you heard me roar.'],
    'How you felt when you were caught in the net',
    'Dear Mouse, I am writing to say thank you for saving my life.'),
  P('dear-peter', 'letter', 'A letter to Peter Rabbit',
    'Write a letter to Peter Rabbit after his adventure in **The Tale of Peter Rabbit**. Tell him why he should keep out of Mr. McGregor’s garden, and ask him a question.',
    ['The Tale of Peter Rabbit', 'reading.potter'],
    ['naughty', 'dreadfully frightened', 'squeezed under the gate', 'mischief', 'wriggled out', 'gooseberry net'],
    ['apos', '**Don’t** go into **Mr. McGregor’s** garden again!'],
    'What could have happened to Peter',
    'Dear Peter, I read about your adventure and I was very worried about you.'),
  P('join-crew', 'letter', 'Can I join your crew, Captain Nova?',
    'Captain Nova and Bleep fixed a satellite in **Bleep and the Broken Satellite**. Write a letter to Captain Nova asking to join her crew. Say what you are good at, and ask her some questions.',
    ['Bleep and the Broken Satellite', 'reading.stories-3'],
    ['spaceship', 'spacesuit', 'satellite', 'carefully', 'bravely', 'exactly what we needed'],
    ['qe', '**Can I come on your next mission?** **What an amazing job you have!**'],
    'One thing you could do to help the crew',
    'Dear Captain Nova, I would love to join your crew.'),

  // --- fact files (non-chronological reports)
  P('moon-file', 'report', 'Fact file: the Moon',
    'Use what you read in **Footprints on the Moon** (and any books you have) to write your own fact file about the Moon. Use a heading for each part.',
    ['Footprints on the Moon', 'reading.facts'],
    ['astronauts', 'spacecraft', 'dusty', 'circling', 'journey', 'no air to breathe', 'footprints'],
    ['because', 'The footprints are still there **because** there is no wind on the Moon.'],
    'A fact about the astronauts who went there',
    'The Moon is a giant ball of rock that travels round the Earth.',
    { plan: ['What is the Moon?', 'What is it like there?', 'Who has been there?', 'An amazing fact'] }),
  P('dinosaur-file', 'report', 'Fact file: my favourite dinosaur',
    'Use the fact file **Dinosaurs** (and any dinosaur books you have) to write a fact file about one dinosaur. Use a heading for each part.',
    ['Dinosaurs', 'reading.facts-2'],
    ['carnivore', 'herbivore', 'fossils', 'palaeontologists', 'millions of years', 'as long as'],
    ['list', 'Triceratops had three horns, a bony frill and a beak like a parrot.'],
    'How we know about it (fossils)',
    'Triceratops was a plant-eating dinosaur with three sharp horns.',
    { plan: ['Which dinosaur, and when did it live?', 'What did it look like?', 'What did it eat?', 'An amazing fact'] }),

  // --- poems
  P('frosty-planet', 'poem', 'Poem: on the frosty purple planet',
    'Remember the frosty purple planet in **The Lost Robot**? Write a poem about being there. Each line can start “On the frosty planet…”.',
    ['The Lost Robot', 'reading.adventures'],
    ['frosty', 'purple', 'howled', 'flickered', 'glowing', 'nervously', 'shiny'],
    ['list', 'I can hear the howling wind, the crunching ice and a nervous beep.'],
    'One more thing you could see, hear or feel there',
    'On the frosty purple planet, the wind howls like a wolf.'),
  P('faster-than', 'poem', 'Poem: faster than…',
    'In **From a Railway Carriage**, Robert Louis Stevenson writes “Faster than fairies, faster than witches”. Write your own “Faster than…” poem about a racing car, a rocket or a superhero, and the things it rushes past.',
    ['From a Railway Carriage', 'reading.poems'],
    ['faster than', 'charging along', 'whistle by', 'in the wink of an eye', 'a glimpse', 'gone for ever'],
    ['noun', '**the roaring red racing car**; **the tiny grey houses**'],
    'One more thing it rushes past',
    'Faster than cheetahs, faster than jets…',
    { plan: ['What is going fast?', 'What does it rush past?', 'Sound words', 'A last line to finish'] }),
  P('night-sky', 'poem', 'Poem: the night sky',
    'In **Escape at Bedtime**, the child sees “thousands of millions of stars”. Write a poem about looking up at the sky on a clear night. What can you see, and how does it make you feel?',
    ['Escape at Bedtime', 'reading.poems-2'],
    ['thousands of millions', 'glittered', 'winked', 'shining', 'high overhead', 'the dark'],
    ['noun', '**a silver, smiling moon**; **the tiny twinkling stars**'],
    'A line about how the sky makes you feel',
    'High overhead in the dark, the stars are winking at me.'),
];

export default [{ subject: 'reading', deck: 'writing', topics: [], items: [], pieces: PIECES }];

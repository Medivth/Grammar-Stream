// English stretch tier: advanced grammar, ambitious vocabulary, Year 7/8 spellings,
// poetic form, and two harder reading extracts (Dickens, Brontë).

import { readFileSync } from 'node:fs';

const PASSAGES = JSON.parse(readFileSync(new URL('./passages.json', import.meta.url), 'utf8'));
const X = (key, context) => ({ passage: (context ? `(${context})\n\n` : '') + PASSAGES[key].passage, passageSource: PASSAGES[key].passageSource });

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const written = (id, topic, prompt, hints, model, extra = {}) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'written', prompt, hints, model, words: [40, 180], ...extra });
const choiceOnly = { formats: ['choice'] };
const S = (extra) => ({ tier: 'stretch', ...extra });

const SONNET = { passage: 'Shall I compare thee to a summer’s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer’s lease hath all too short a date:\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm’d;\nAnd every fair from fair sometime declines,\nBy chance or nature’s changing course untrimm’d;\nBut thy eternal summer shall not fade\nNor lose possession of that fair thou ow’st;\nNor shall Death brag thou wander’st in his shade,\nWhen in eternal lines to time thou grow’st:\nSo long as men can breathe or eyes can see,\nSo long lives this, and this gives life to thee.', passageSource: 'William Shakespeare, Sonnet 18 (1609)' };
const PIP = X('expectations', 'Pip, a small orphan, is alone in the churchyard on the marshes at dusk.');
const JANE = X('jane', 'Jane, an orphan of ten, lives with her aunt Mrs Reed and her cousins, who do not want her.');

const VOCAB = [
  ['meticulous', 'extremely careful about every detail', 'She kept a meticulous diary, recording even the weather.', ['careless', 'generous', 'furious']],
  ['ambivalent', 'having mixed feelings about something', 'He felt ambivalent about moving: excited and sad at once.', ['certain', 'delighted', 'bored']],
  ['ephemeral', 'lasting a very short time', 'Snowflakes are ephemeral; they melt as they land.', ['permanent', 'enormous', 'ancient']],
  ['pragmatic', 'dealing with things sensibly and practically', 'A pragmatic captain picks the team that will win, not her friends.', ['dreamy', 'dishonest', 'nervous']],
  ['benevolent', 'kind and generous', 'The benevolent king gave grain to the poor every winter.', ['cruel', 'wealthy', 'powerful']],
  ['scrutinise', 'to examine very closely', 'The referee scrutinised the replay before deciding.', ['ignore', 'describe', 'enjoy']],
  ['tenacious', 'refusing to give up', 'The tenacious climber tried the route for the fifth time.', ['lazy', 'talented', 'frightened']],
  ['superfluous', 'more than is needed; unnecessary', 'Cut the superfluous words and the sentence gets stronger.', ['essential', 'difficult', 'beautiful']],
  ['eloquent', 'speaking or writing fluently and persuasively', 'Her eloquent speech won over the whole hall.', ['quiet', 'clumsy', 'angry']],
  ['ubiquitous', 'found everywhere', 'Mobile phones are now ubiquitous.', ['rare', 'expensive', 'useful']],
  ['candid', 'truthful and straightforward, even when awkward', 'Be candid: did you like the film?', ['secretive', 'polite', 'clever']],
  ['inevitable', 'certain to happen; unavoidable', 'After weeks without rain, the hosepipe ban was inevitable.', ['surprising', 'optional', 'impossible']],
];

const SPELL = [
  ['separate', 'Keep the two piles ___.', 'apart from each other', 'There is “a rat” in sep-a-rat-e: two a’s, not an e in the middle.'],
  ['definitely', 'I will ___ be there.', 'certainly', 'Built on “finite”: de-finite-ly. No “a” anywhere.'],
  ['occasionally', 'We ___ have pizza on Fridays.', 'now and then', 'Double c, single s: oc-cas-ion-al-ly.'],
  ['independence', 'The American colonies declared their ___ in 1776.', 'freedom from control', 'in-depend-ence: ends -ence, like dependence.'],
  ['knowledge', 'Her ___ of history is impressive.', 'what you know', 'know + ledge: keep the silent k and the d.'],
  ['argument', 'They had an ___ about the rules.', 'a disagreement', 'Argue drops its e before -ment: argu-ment.'],
  ['business', 'She runs a small ___.', 'a company; trade', 'busi-ness: busy changes y to i, then -ness.'],
  ['colleague', 'My ___ at work lent me a pen.', 'a person you work with', 'col-league: double l, then -eague.'],
  ['fascinating', 'The documentary was ___.', 'extremely interesting', 'fa-sci-nat-ing: the sc makes one “s” sound.'],
  ['humorous', 'He told a ___ story.', 'funny', 'Humour loses its u before -ous: hum-or-ous.'],
  ['manoeuvre', 'The driver made a tricky ___.', 'a skilful movement', 'A French word: man-oeu-vre. Say “man-oh-ee-u-vre” to remember the vowels.'],
  ['parallel', 'Railway tracks are ___.', 'always the same distance apart', 'par-all-el: double l in the middle, single at the end.'],
  ['perseverance', 'Learning an instrument takes ___.', 'keeping going despite difficulty', 'per-sever-ance: no extra r after “per-se” (not perserverance).'],
  ['questionnaire', 'Please fill in the ___.', 'a list of questions', 'question + naire: double n.'],
  ['vacuum', 'Space is almost a perfect ___.', 'a space with nothing in it', 'Double u, single c: vac-uum.'],
  ['truly', 'I am ___ sorry.', 'genuinely', 'True drops its e: tru-ly.'],
];

const topics = [
  { id: 'english.grammar-8', title: 'Advanced grammar: passive, subjunctive and punctuation', kind: 'facts', ...S({}), prereqs: ['english.grammar7'], batch: 5, intro: 'The grammar that makes writing sound sophisticated: the passive voice, the subjunctive mood, modal verbs, and the colon, semicolon and dash used with purpose.', hook: 'Passive hides the doer, subjunctive imagines (“If I were…”), colon announces, semicolon balances.', teach: 'Explain when a writer might choose the passive voice.', talk: 'Challenge her to say three sentences in the passive at dinner (“The peas were eaten by…”).' },
  { id: 'english.vocab-3', title: 'Ambitious vocabulary', kind: 'facts', ...S({}), prereqs: ['english.lit-words'], batch: 6, intro: 'Twelve words that top-set essays use and most eleven-year-olds do not. Learn them, then use each one in a real sentence this week.', hook: 'Use a new word three times in one week and it’s yours for life.', teach: 'Use three of this week’s words in one paragraph about your day.', talk: 'Pick a word and see who can use it first, naturally, during the day.' },
  { id: 'english.spell-8', title: 'Spelling: words everyone gets wrong', kind: 'facts', ...S({}), prereqs: ['english.spell-7'], batch: 5, intro: 'Not on the Year 5 and 6 list (separate, occasionally, knowledge and business are on the Year 3 and 4 list, so she should already know them), but these are the words that lose marks in Year 7 and 8: separate, definitely, occasionally, manoeuvre…', hook: 'There’s a rat in separate, and definitely has finite in it.', teach: 'Pick one word and explain its trap.', talk: 'Ask her to spell “definitely” and “separate” out loud.' },
  { id: 'english.poetry-2', title: 'Poetic form: the sonnet and the ballad', kind: 'facts', ...S({}), prereqs: ['english.poems'], batch: 5, intro: 'Form is the shape of a poem: how many lines, what rhymes, what rhythm. Shakespeare’s Sonnet 18 is the most famous fourteen lines in English.', hook: 'Shakespearean sonnet: 14 lines, ABAB CDCD EFEF GG: three quatrains and a couplet.', teach: 'Explain what a sonnet is.', talk: 'Clap the ten syllables of “Shall I compare thee to a summer’s day?” together.' },
  { id: 'english.read-stretch', title: 'Reading: Dickens and Brontë', kind: 'reading', ...S({}), prereqs: ['english.read-nonfic'], batch: 7, intro: 'Two openings from great Victorian novels. The sentences are long and the vocabulary is hard. Slow down, reread, and trust the clues.', hook: 'Read twice: once for what happens, once for how the writer makes you feel it.', teach: 'Explain how Dickens makes the convict frightening in a single paragraph.', talk: 'Read the first paragraph of Great Expectations aloud together, as dramatically as you can.' },
];

const items = [
  // --- advanced grammar
  mcq('g8.passive1', 'grammar-8', 'Which sentence is in the passive voice?', [['The window was broken by the ball.', true], ['The ball broke the window.', false, 'Here the ball (the doer) is the subject: active voice.'], ['The ball is breaking the window.', false, 'Still active: the doer is the subject, just in a different tense.']], 'In the passive, the thing the action is done TO becomes the subject (“The window was broken”). The doer can be added with “by” or left out.'),
  mcq('g8.passive2', 'grammar-8', 'Why might a scientist write “The liquid was heated to 80°C” instead of “I heated the liquid to 80°C”?', [['The passive keeps the focus on the experiment', true], ['Because scientists are never allowed to use “I”', false, 'There is no rule, but the passive is the convention because it focuses on the process.'], ['Because the passive is shorter and quicker to write', false, 'It isn’t shorter: both sentences have six words. The reason is focus and formality.']], 'The passive is useful when the doer is unknown, unimportant, or when you want to hide them (“Mistakes were made”).', choiceOnly),
  fact('g8.passive3', 'grammar-8', 'Rewrite in the passive: “The dog chased the cat.”', 'The cat was chased by the dog.', ['The dog was chasing the cat.', 'The cat chased the dog.', 'The dog chased the cat.'], 'Object becomes subject (the cat), verb becomes “was chased”, doer goes after “by”.', { accept: ['the cat was chased by the dog'] }),
  mcq('g8.subj', 'grammar-8', '“If I were you, I would apologise.” Why “were” and not “was”?', [['It is the subjunctive, for imagined situations', true], ['It is a mistake that should be “was”', false, 'It is correct formal English. “Were” after “if I” shows something imagined.'], ['Because “I” counts as plural in this sentence', false, '“I” is never plural. The form is the subjunctive.']], 'The subjunctive appears in formal wishes and demands too: “I wish it were Friday”; “The head insists that every pupil be on time.”', choiceOnly),
  fact('g8.modal', 'grammar-8', 'In “You must finish, but you could ask for help”, which of the words “must”, “finish” or “could” is NOT a modal verb?', 'finish', ['must', 'could', 'both must and could'], 'Modal verbs (can, could, may, might, must, shall, should, will, would, ought to) show how certain, possible or necessary something is. “Finish” is an ordinary verb.', choiceOnly),
  mcq('g8.colon', 'grammar-8', 'Which sentence uses the colon correctly?', [['She packed three things: a torch, a map and a sandwich.', true], ['She packed: a torch, a map and a sandwich.', false, 'A colon needs a complete sentence before it. “She packed” is not complete on its own.'], ['She packed three things, a torch: a map and a sandwich.', false, 'The colon must come where the list is introduced.']], 'A colon says “here it comes”: it introduces a list, an explanation or an example after a complete sentence.', choiceOnly),
  mcq('g8.semi', 'grammar-8', 'Which sentence uses the semicolon correctly?', [['The rain stopped; we went outside.', true], ['The rain stopped; and we went outside.', false, 'A semicolon replaces the joining word. Use one or the other.'], ['Because the rain stopped; we went outside.', false, '“Because the rain stopped” is not a complete sentence, so it cannot stand on one side of a semicolon.']], 'A semicolon joins two complete sentences that are closely related. Each side could stand alone.', choiceOnly),
  mcq('g8.dash', 'grammar-8', '“My brother – who never reads – finished the book in a day.” What job are the dashes doing?', [['Marking parenthesis: extra, removable information', true], ['Showing a pause for breath when reading aloud', false, 'They mark off an extra clause, like brackets or a pair of commas.'], ['Joining two words into a compound', false, 'That is a hyphen (shorter, no spaces): “well-known”.']], 'Brackets, a pair of commas or a pair of dashes all mark parenthesis. Dashes are the most dramatic; brackets the quietest.', choiceOnly),
  mcq('g8.relative', 'grammar-8', 'In “The book that I lost was a present”, what kind of clause is “that I lost”?', [['A relative clause describing “book”', true], ['A main clause that could stand alone', false, 'It cannot stand alone; it adds information about the book.'], ['An adverbial clause saying when', false, 'Adverbial clauses tell you when, where, why or how. This one describes a noun.']], 'Relative clauses start with who, which, that, whose, where or when and work like adjectives.', choiceOnly),
  fact('g8.hyphen', 'grammar-8', 'Which version avoids the ambiguity: “a man eating shark” or “a man-eating shark”?', 'a man-eating shark', ['a man eating shark', 'a man eating-shark', 'a man, eating shark'], 'Without the hyphen it could be a man who is eating shark. The hyphen joins “man-eating” into one adjective.', choiceOnly),

  // --- vocabulary
  ...VOCAB.map(([word, def, eg, wrong]) => fact(`v3.${word}`, 'vocab-3', `Which word means “${def}”?`, word, wrong.map(() => '').map((_, i) => VOCAB.filter((v) => v[0] !== word)[(i * 5 + word.length) % 11][0]), `${word}: ${def}. “${eg}”`, { learn: `**${word}**: ${def}.\n_${eg}_` })),

  // --- spelling
  ...SPELL.map(([word, sentence, clue, tricky]) => ({ id: `english.sp8.${word}`, topic: 'english.spell-8', kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` })),

  // --- poetic form
  fact('p2.lines', 'poetry-2', 'How many lines does a sonnet have?', '14', ['12', '16', '10'], 'Fourteen lines: in Shakespeare’s sonnets, three quatrains (groups of four) and a final couplet.', { accept: ['fourteen'] }),
  mcq('p2.pent', 'poetry-2', '“Shall I compare thee to a summer’s day?” has ten syllables with five beats: da-DUM da-DUM da-DUM da-DUM da-DUM. What is this rhythm called?', [['Iambic pentameter', true], ['Free verse', false, 'Free verse has no regular rhythm. This line is as regular as a heartbeat.'], ['A couplet', false, 'A couplet is two rhyming lines, not a rhythm.']], 'Iamb = da-DUM; pentameter = five of them. Shakespeare’s plays are mostly written in it too.', SONNET),
  mcq('p2.scheme', 'poetry-2', 'Look at the line endings: day/temperate/May/date… What is the rhyme scheme of the first four lines?', [['ABAB', true], ['AABB', false, 'Day does not rhyme with temperate. The rhymes alternate: day/May, temperate/date.'], ['ABBA', false, 'Line 1 rhymes with line 3, not line 4.']], 'A Shakespearean sonnet runs ABAB CDCD EFEF GG: three quatrains and a couplet.', SONNET),
  mcq('p2.volta', 'poetry-2', 'Line 9 begins “But thy eternal summer shall not fade”. What happens here?', [['The volta: a turn to the loved one’s lasting beauty', true], ['A second, separate sonnet begins at this line', false, 'It is the same poem. Sonnets often change direction at line 9.'], ['The rhyme scheme breaks down completely', false, 'The rhyme continues (EFEF). It is the ARGUMENT that turns.']], 'The volta is the hinge of a sonnet. “But” signals it: everything before was the problem, everything after is the answer.', SONNET),
  mcq('p2.couplet', 'poetry-2', 'What does the final couplet claim?', [['The poem will keep the loved one alive', true], ['Summer will last for ever in England', false, 'The poem says the opposite: “summer’s lease hath all too short a date”.'], ['The poet himself will live for ever', false, 'It is “this” (the poem) and “thee” (the loved one) who live, through the lines.']], '“So long lives this, and this gives life to thee”: the poem is the eternal summer. Rather a confident ending, and it has turned out to be true.', SONNET),
  fact('p2.personify', 'poetry-2', 'In “Sometime too hot the eye of heaven shines”, what does “the eye of heaven” mean?', 'the sun', ['the moon', 'God', 'the sky'], 'The sun is the eye of heaven, with a “gold complexion” that can be “dimm’d” by cloud.', { accept: ['sun'] }),
  fact('p2.ballad', 'poetry-2', 'Which form tells a story in four-line stanzas, often with the rhyme ABCB and a refrain?', 'a ballad', ['a sonnet', 'a haiku', 'a limerick'], 'Ballads were sung before they were written down: simple stanzas, a strong beat, a tragic or heroic story.', { accept: ['ballad'] }),
  fact('p2.haiku', 'poetry-2', 'A haiku has three lines with how many syllables?', '5, 7, 5', ['7, 5, 7', '5, 5, 5', '3, 5, 3'], 'Seventeen syllables, usually about nature and a single moment.', choiceOnly),
  fact('p2.enjamb', 'poetry-2', 'When a sentence runs on past the end of a line without a pause, it is called…', 'enjambment', ['caesura', 'a stanza', 'a refrain'], 'Enjambment carries the reader forward; a caesura is a pause inside a line.'),

  // --- reading: Great Expectations
  mcq('rd.pp1', 'read-stretch', 'The convict is described in three sentences that each begin with “A … man” (“A fearful man…”, “A man with…”, “A man who…”). What is the effect of this repetition?', [['It builds him up piece by frightening piece', true], ['It makes him seem ordinary and harmless', false, 'Each sentence adds something worse: “iron on his leg”, “soaked in water”, “cut by flints”.'], ['It shows that Pip already knows him', false, 'Pip has never seen him before.']], 'Three sentences, none of them with a main verb: Dickens freezes the moment so we see the man as the terrified child does.', PIP),
  mcq('rd.pp2', 'read-stretch', '“who limped, and shivered, and glared, and growled”. Which word tells you the man is suffering as well as frightening?', [['shivered', true], ['glared', false, 'Glared is threatening. Shivered shows he is cold and in pain.'], ['growled', false, 'Growled makes him animal-like; shivered makes him pitiable.']], 'Dickens makes the convict terrifying and pitiable at once. “Shivered” and “lamed by stones” hint that he is a victim too.', PIP),
  fact('rd.pp3', 'read-stretch', 'Find and copy the word that shows how the man ate the bread.', 'ravenously', ['earnestly', 'suddenly', 'trembling'], '“he ate the bread ravenously”: hungrily, like a starving animal. He is desperate as well as frightening.', { ...PIP, accept: [] }),
  mcq('rd.pp4', 'read-stretch', 'What does the man do when Pip points out where he lives?', [['Turns him upside down', true], ['Lets him go home to his sister', false, 'He is only beginning. He tips Pip up and takes his bread.'], ['Walks off towards the village', false, 'He stays and eats the bread “ravenously”.']], '“The man, after looking at me for a moment, turned me upside down, and emptied my pockets.” The world literally turns over for Pip.', PIP),
  mcq('rd.pp5', 'read-stretch', '“When the church came to itself,—for he was so sudden and strong that he made it go head over heels before me”. Why does Dickens say the CHURCH turned over?', [['Pip is upside down, so the church seems to turn', true], ['An earthquake shook the old church to its roots', false, 'It is Pip who is turned, not the building.'], ['Dickens made a mistake in the sentence', false, 'It is deliberate: the child sees the steeple under his feet.']], 'Telling it from inside Pip’s dizzy head is both funny and frightening. We never leave the child’s point of view.', PIP),
  mcq('rd.pp6', 'read-stretch', '“Darn me if I couldn’t eat em… and if I han’t half a mind to’t!” Is the man serious? What does Pip think?', [['Probably an empty threat, but Pip takes it seriously', true], ['He is joking, and Pip laughs along with him', false, 'Pip “earnestly expressed my hope that he wouldn’t”. He believes it.'], ['He is serious, and Pip runs away to the village', false, 'Pip stays on the tombstone, “partly, to keep myself from crying”.']], 'The man’s dialect (“em”, “han’t”, “to’t”) makes him vivid. His threat about Pip’s fat cheeks is grimly comic to us, terrifying to Pip.', PIP),
  written('rd.pp7', 'read-stretch', 'How does Dickens make the convict both frightening and pitiable in this extract? Write a paragraph using at least two quotations.', ['Point: frightening (his voice, his threats, how he treats Pip)', 'Point: pitiable (his state: soaked, lamed, cut, shivering)', 'Comment on the structure of the “A man…” paragraph', 'What the reader feels, and why both sides matter'], 'Dickens makes the convict frightening first through his voice: “Hold your noise!” and “I’ll cut your throat!” are the first words we hear, and he soon turns Pip “upside down”. Yet the description that follows makes him pitiable. He has been “soaked in water, and smothered in mud, and lamed by stones, and cut by flints”, and he “shivered” as well as “glared”. The repeated “A man…” sentences pile up these details like injuries. The reader is terrified with Pip but also starts to feel sorry for the man, which matters because Pip will later owe him everything.', PIP),

  // --- reading: Jane Eyre
  mcq('rd.je1', 'read-stretch', 'Why is Jane glad there will be no walk?', [['She hates coming home cold and scolded', true], ['She wants to play with Eliza, John and Georgiana', false, 'They are “clustered round their mama”; Jane has been “dispensed from joining the group”.'], ['She is ill and must stay in bed', false, 'There is no illness. The reason is “a heart saddened by the chidings of Bessie”.']], '“dreadful to me was the coming home in the raw twilight, with nipped fingers and toes, and a heart saddened by the chidings of Bessie”. The walk means cold, scolding and humiliation.', JANE),
  mcq('rd.je2', 'read-stretch', 'Mrs Reed says Jane needs “a more sociable and childlike disposition… something lighter, franker, more natural”. What does this reveal about Mrs Reed?', [['She blames Jane for being unhappy', true], ['She loves Jane and wants to help her', false, 'She keeps Jane “at a distance” and excludes her from “privileges intended only for contented, happy, little children”.'], ['She is worried about Jane’s health', false, 'She is complaining about Jane’s manner, not her health.']], 'The long, formal sentence (reported speech) makes Mrs Reed sound cold and official. She wants a convenient child, not a real one.', JANE),
  fact('rd.je3', 'read-stretch', 'Find and copy the word Mrs Reed uses for people who keep finding fault over small things.', 'cavillers', ['questioners', 'elders', 'darlings'], '“I don’t like cavillers or questioners.” To cavil is to object to small things. Jane has asked one honest question.', { accept: ['caviller'] }),
  mcq('rd.je4', 'read-stretch', 'Jane draws the curtain and sits in the window-seat “shrined in double retirement”. What does this suggest?', [['She makes herself a private, almost sacred space', true], ['She is being punished by being shut in', false, 'She chooses this hiding place herself.'], ['She is settling down to go to sleep', false, 'She reads, and watches the November afternoon.']], '“Shrined” is a word for holy things. Reading in a hidden corner is Jane’s refuge from a house that does not want her.', JANE),
  mcq('rd.je5', 'read-stretch', 'The weather is described as “clouds so sombre, and a rain so penetrating”, on a “drear November day”. How does the weather connect with Jane’s situation?', [['It mirrors her mood: pathetic fallacy', true], ['It is simply a weather report for the day', false, 'Novelists choose weather. Brontë opens with gloom for a reason.'], ['It shows that the story is set in summer', false, 'It is November.']], 'When the weather reflects a character’s feelings, it is called pathetic fallacy. Brontë uses it throughout the novel.', JANE),
  fact('rd.je6', 'read-stretch', 'What does Jane take with her into the window-seat?', 'a book with pictures', ['her cousins’ toys', 'a cup of tea', 'a letter from Bessie'], '“I soon possessed myself of a volume, taking care that it should be one stored with pictures.”', choiceOnly),
  written('rd.je7', 'read-stretch', 'How does Charlotte Brontë make the reader sympathise with Jane in this opening? Write a paragraph using at least two quotations.', ['How Jane is treated (Mrs Reed’s words, the cousins “clustered round their mama”)', 'Jane’s own feelings and her refuge', 'The weather, and what it reflects', 'Why a first-person narrator helps'], 'Brontë makes us sympathise with Jane by showing her shut out of her own family. The cousins are “clustered round their mama” while Jane is “dispensed from joining the group”, and when she asks one question Mrs Reed snaps, “I don’t like cavillers or questioners”. Because Jane tells the story herself, we feel her “heart saddened by the chidings of Bessie” from the inside. The “drear November day” and “rain so penetrating” reflect her loneliness, and her hiding place, “shrined in double retirement”, shows a child making the only safe space she can.', JANE),
];

// Memory hooks (mnemonics) and real-world examples, keyed by item id (without “english.”).
const MEMORY = {
  'g8.passive1': { hook: 'The zombie test: if you can add “by zombies” after the verb, it’s passive. “The window was broken by zombies.”' },
  'g8.passive2': { example: 'News reports say “A man was arrested”: the police (the doers) are obvious, so they are left out.' },
  'g8.passive3': { hook: 'Swap the ends, add “was” + past participle, then “by”: the cat was chased by the dog.' },
  'g8.subj': { hook: 'Imagining or wishing? Use “were” for everyone: if I were, I wish it were.', example: 'The famous song from Fiddler on the Roof is “If I Were a Rich Man”.' },
  'g8.modal': { hook: 'The modals: can, could, may, might, must, shall, should, will, would and ought (to). They never take -s: “she can”, not “she cans”.' },
  'g8.colon': { hook: 'A colon is a drumroll: a complete sentence, then “here it comes”.' },
  'g8.semi': { hook: 'Semicolon test: could each side be a sentence on its own? Then a semicolon can join them.' },
  'g8.dash': { hook: 'A hyphen joins words (no spaces: well-known); a dash separates (spaces either side).' },
  'g8.relative': { hook: 'Relative pronouns relate back to a noun: who, which, that, whose, where, when.' },
  'g8.hyphen': { example: '“Twenty-odd people” means about twenty; “twenty odd people” means twenty strange ones!' },
  'v3.meticulous': { hook: 'Meticulous measuring: every millimetre checked.' },
  'v3.ambivalent': { hook: 'Ambi = both (like ambidextrous): feeling both ways at once.' },
  'v3.ephemeral': { example: 'Soap bubbles, rainbows and sandcastles are ephemeral.' },
  'v3.pragmatic': { hook: 'Pragmatic = practical: both start with “pra”.' },
  'v3.benevolent': { hook: 'Bene = good (as in benefit), vol = wish: wishing others well.' },
  'v3.scrutinise': { example: 'Video referees scrutinise the replay frame by frame before giving a decision.' },
  'v3.tenacious': { hook: 'A tenacious terrier never lets go of the ball.' },
  'v3.superfluous': { hook: 'Super-fluous = overflowing: more than you need.' },
  'v3.eloquent': { hook: 'loqu = speak, as in ventriloquist: an eloquent person speaks beautifully.' },
  'v3.ubiquitous': { hook: 'Ubique is Latin for “everywhere”.', example: 'Pigeons and phones are ubiquitous in city centres.' },
  'v3.candid': { example: 'A candid photo catches people as they really are, not posing.' },
  'v3.inevitable': { hook: 'In (not) + evitable (avoidable): it cannot be avoided.' },
  'sp8.separate': { hook: 'There’s a rat in separate: sep-A-RAT-e.' },
  'sp8.definitely': { hook: 'Definitely has finite in it: de-FINITE-ly, and never an a.' },
  'sp8.occasionally': { hook: 'Occasionally: two c’s go out together, one s stays home, and occasional + ly gives two l’s.' },
  'sp8.independence': { hook: 'You DEPEND on no one: in-DEPEND-ence, ending -ence.' },
  'sp8.knowledge': { hook: 'Your knowledge sits on a LEDGE: know + ledge.' },
  'sp8.argument': { hook: 'Don’t argue about GUM: ar-GUM-ent (argue loses its e).' },
  'sp8.business': { hook: 'Go to work on the BUS: BUS-i-ness.' },
  'sp8.colleague': { hook: 'Colleagues are in the same LEAGUE: col-LEAGUE.' },
  'sp8.fascinating': { hook: 'Science is fascinating: both have “sc”.' },
  'sp8.humorous': { hook: 'Humour drops its u in humorous: the joke isn’t about “you”.' },
  'sp8.manoeuvre': { example: 'The UK driving test includes a reversing manoeuvre. Americans spell it “maneuver”.' },
  'sp8.parallel': { hook: 'The two l’s in the middle of paraLLel are a pair of parallel lines.' },
  'sp8.perseverance': { hook: 'Keep going even when it gets SEVERE: per-SEVER-ance.' },
  'sp8.questionnaire': { example: 'Customer feedback forms and school surveys are questionnaires: question + naire, double n.' },
  'sp8.vacuum': { hook: 'A vacuum cleaner sucks up one c and leaves two u’s: va-c-uu-m.' },
  'sp8.truly': { hook: 'True loses its e in truly, but sure keeps it in surely.' },
  'p2.lines': { hook: 'Three quatrains (4 + 4 + 4) and a couplet (2) = 14 lines.' },
  'p2.pent': { hook: 'Iamb = da-DUM, like a heartbeat; penta = five (as in pentagon).' },
  'p2.scheme': { hook: 'ABAB CDCD EFEF GG: three alternating quatrains, then a rhyming pair.' },
  'p2.volta': { hook: 'Volta is Italian for “turn”: look for a “But” around line 9.' },
  'p2.personify': { hook: 'The eye of heaven = the sun: a bright eye looking down from the sky.' },
  'p2.ballad': { hook: 'Ballads were sung: a story, a simple beat and a repeated refrain.' },
  'p2.haiku': { example: 'Matsuo Bashō’s 17th-century haiku about a frog jumping into an old pond is the most famous of all.' },
  'p2.enjamb': { hook: 'Enjambment strides over the line end; a caesura cuts a line in two.' },
  'rd.pp1': { hook: 'Repetition piles up: each “A man…” adds another frightening detail.' },
  'rd.pp2': { hook: 'Look for the word that makes a villain pitiable: shivered.' },
  'rd.pp3': { hook: 'Ravenously = wolfing it down, like a starving animal.' },
  'rd.pp5': { hook: 'Point of view: the church turns because Pip is upside down.' },
  'rd.je3': { hook: 'A caviller cavils: picks at tiny faults.' },
  'rd.je4': { hook: 'A shrine is a holy place: Jane’s window-seat is her sacred hideaway.' },
  'rd.je5': { hook: 'Pathetic fallacy: the weather feels what the character feels.' },
};
for (const it of items) Object.assign(it, MEMORY[it.id.replace(/^english\./, '')]);

for (const it of items) if (!it.passage && it.id.startsWith('english.rd.')) Object.assign(it, it.id.includes('.pp') ? PIP : JANE);

export default [{ subject: 'english', deck: 'stretch', topics, items }];

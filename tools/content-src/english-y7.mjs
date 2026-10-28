// Year 7 English stretch: Shakespeare, poetry, 19th-century fiction, unseen reading,
// analytical writing, rhetoric, grammar and literary vocabulary.
// Literary quotations are from public-domain texts; one short line of a 1940 speech is quoted for criticism (UK fair dealing).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `english.${id}`, topic: `english.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const weighted = (id, topic, prompt, options, explain, extra = {}) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'weighted', prompt, options: options.map(([text, weight, feedback]) => ({ text, weight, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `english.${id}`, topic: `english.${topic}`, kind: 'order', prompt, items, labels, explain });
const choiceOnly = { formats: ['choice'] };

// passages (public domain)
const TYGER = { passage: 'Tyger Tyger, burning bright,\nIn the forests of the night;\nWhat immortal hand or eye,\nCould frame thy fearful symmetry?', passageSource: 'William Blake, “The Tyger” (1794)' };
const DAFFODILS = { passage: 'I wandered lonely as a cloud\nThat floats on high o’er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;', passageSource: 'William Wordsworth, “I Wandered Lonely as a Cloud” (1807, revised 1815)' };
const WIND = { passage: 'Who has seen the wind?\nNeither I nor you:\nBut when the leaves hang trembling,\nThe wind is passing through.', passageSource: 'Christina Rossetti, “Who Has Seen the Wind?” (1872)' };
const OZY = { passage: '“My name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!”\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away.', passageSource: 'Percy Bysshe Shelley, “Ozymandias” (1818)' };
const RAILWAY = { passage: 'Faster than fairies, faster than witches,\nBridges and houses, hedges and ditches;\nAnd charging along like troops in a battle,\nAll through the meadows the horses and cattle:', passageSource: 'Robert Louis Stevenson, “From a Railway Carriage” (1885)' };
const TREASURE = { passage: 'I remember him as if it were yesterday, as he came plodding to the inn door, his sea-chest following behind him in a hand-barrow—a tall, strong, heavy, nut-brown man, his tarry pigtail falling over the shoulder of his soiled blue coat, his hands ragged and scarred, with black, broken nails, and the sabre cut across one cheek, a dirty, livid white.', passageSource: 'Robert Louis Stevenson, Treasure Island (1883)' };
const GARDEN = { passage: 'When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen. It was true, too. She had a little thin face and a little thin body, thin light hair and a sour expression.', passageSource: 'Frances Hodgson Burnett, The Secret Garden (1911)' };
const HOLMES = { passage: '“You see, but you do not observe. The distinction is clear. For example, you have frequently seen the steps which lead up from the hall to this room.”\n“Frequently.”\n“How often?”\n“Well, some hundreds of times.”\n“Then how many are there?”\n“How many? I don’t know.”\n“Quite so! You have not observed. And yet you have seen.”', passageSource: 'Arthur Conan Doyle, “A Scandal in Bohemia” (1891)' };

const topics = [
  { id: 'english.grammar7', title: 'Grammar toolkit: word classes and clauses', kind: 'mixed', prereqs: [], batch: 5, intro: 'In Year 7 your teachers will expect you to name word classes and sentence types so you can talk about how writers build sentences.', hook: 'FANBOYS join equals (compound); because, when, although and if start a clause that can’t stand alone (complex).', teach: 'Explain the difference between an adjective and an adverb.', talk: 'Pick a sentence from a book and ask her to find the verb.' },
  { id: 'english.lit-words', title: 'Words for talking about stories', kind: 'facts', prereqs: ['english.vocab-1'], batch: 6, hook: 'The protagonist pushes the story forward; the antagonist is anti (against) them.', teach: 'Explain what foreshadowing is, with an example from a film or book.', talk: 'Ask her who the protagonist of the book she is reading is.' },
  { id: 'english.roots-3', title: 'Word parts: suffixes and more roots', kind: 'facts', prereqs: ['english.morph-2'], batch: 6, hook: '-ology is the study of, -phobia is the fear of: biology, arachnophobia.', teach: 'Explain how “-ology” helps you understand new subjects at secondary school.', talk: 'Ask her what a “phobia” is, and what “arachnophobia” might mean.' },
  { id: 'english.poetry-terms', title: 'Poetry toolkit', kind: 'facts', prereqs: ['english.techniques'], batch: 6, intro: 'Poets choose form, sound and structure as carefully as words. Knowing the terms lets you explain how a poem works.', hook: 'Stanza = paragraph, couplet = a couple of rhyming lines, sonnet = 14 lines.', teach: 'Explain the difference between enjambment and a caesura.', talk: 'Ask her what makes a sonnet a sonnet.' },
  { id: 'english.poems', title: 'Classic poems', kind: 'facts', prereqs: ['english.poetry-terms'], batch: 5, intro: 'Read each extract aloud. Then think: what technique is used, and what effect does it have on the reader?', hook: 'Spot it, quote it, say what it makes the reader feel.', teach: 'Explain the effect of the repeated “faster than” in Stevenson’s poem.', talk: 'Read “The Tyger” aloud together and ask what she thinks the poet is asking.' },
  { id: 'english.shakespeare', title: 'Shakespeare and his theatre', kind: 'facts', prereqs: [], batch: 6, intro: 'William Shakespeare wrote over 400 years ago, yet his plays are still performed every day. Most grammar schools study a whole play in Year 7.', hook: '1564 to 1616, Stratford to the Globe: comedies end in weddings, tragedies in deaths.', teach: 'Explain what a soliloquy is and why playwrights use them.', talk: 'Ask her what the groundlings were.' },
  { id: 'english.dream', title: 'A Midsummer Night’s Dream', kind: 'facts', prereqs: ['english.shakespeare'], batch: 5, intro: 'Four young lovers run away into an enchanted forest, where fairies are quarrelling and a group of workmen are rehearsing a play. What could possibly go wrong?', hook: 'Strict Athens, magic forest: Puck mixes up the lovers, then everyone wakes up happily paired off.', teach: 'Explain how Puck’s mistake causes chaos for the lovers.', talk: 'Ask her who gets turned into a donkey, and why.' },
  { id: 'english.tempest', title: 'The Tempest', kind: 'facts', prereqs: ['english.shakespeare'], batch: 5, intro: 'Prospero, a magician and the rightful Duke of Milan, has lived on an island for twelve years. When his enemies sail past, he raises a storm.', hook: 'A tempest is a storm: Prospero raises one to bring his enemies to his island, then forgives them.', teach: 'Explain why Prospero creates the storm.', talk: 'Ask her whether she thinks Caliban is a villain or a victim.' },
  { id: 'english.victorian', title: 'Victorian fiction: Dickens, Gothic and Sherlock Holmes', kind: 'facts', prereqs: [], batch: 5, intro: '19th-century writing can look hard at first: long sentences and old words. Knowing the context and the genre makes it much easier.', hook: 'Dickens fights poverty, Gothic brings the gloom, and Holmes observes what others only see.', teach: 'Explain what Dickens wanted readers to learn from Scrooge.', talk: 'Ask her what pathetic fallacy is, and to spot some in a film.' },
  { id: 'english.unseen', title: 'Reading unseen extracts', kind: 'facts', prereqs: ['english.vocab-1'], batch: 4, intro: 'In Year 7 you will often read an extract you have never seen and answer questions about it. Read the whole thing first, then look for clues.', hook: 'Read it all first, then hunt for clues: what does each detail suggest?', teach: 'Explain how you work out what a character is like from just a few lines.', talk: 'Read the first paragraph of a book together and ask her what she can infer.' },
  { id: 'english.analysis', title: 'Writing about writing: analysis', kind: 'facts', prereqs: ['english.techniques', 'english.vocab-1'], batch: 5, intro: 'The big step in Year 7 English: not just spotting a technique, but explaining its effect on the reader, using a short quotation.', hook: 'PETAL: Point, Evidence, Technique, Analysis, Link.', teach: 'Explain what makes a quotation “embedded”.', talk: 'Ask her to explain the effect of one word in a song lyric or advert.' },
  { id: 'english.rhetoric', title: 'Speeches and persuasion', kind: 'facts', prereqs: ['english.techniques'], batch: 5, hook: 'Ethos, pathos, logos: trust the speaker, feel the emotion, follow the logic.', teach: 'Explain three ways a speaker can persuade an audience.', talk: 'Watch a short speech or advert together and spot the persuasive techniques.' },
];

const items = [
  // --- grammar toolkit
  { id: 'english.gr7.wordclass', topic: 'english.grammar7', kind: 'template', gen: 'wordClass', levels: [1, 2, 3], seed: [-1, 0, 0.6] },
  mcq('gr7.simple', 'grammar7', 'Which of these is a simple sentence (one main clause)?', [['The dog barked.', true], ['The dog barked and the cat ran away.', false, 'Two main clauses joined by “and”: a compound sentence.'], ['When the dog barked, the cat ran away.', false, 'A subordinate clause plus a main clause: a complex sentence.']], 'A simple sentence has one main clause: one subject and one main verb.'),
  mcq('gr7.complex', 'grammar7', 'Which of these is a complex sentence?', [['Because it was late, we took a taxi.', true], ['It was late, so we took a taxi.', false, 'Two main clauses joined by “so”: a compound sentence.'], ['It was late.', false, 'One main clause: a simple sentence.']], 'A complex sentence has a main clause and at least one subordinate clause (starting with because, when, although, if…).'),
  mcq('gr7.subordinate', 'grammar7', 'In “Although she was tired, Maya finished the race”, which part is the subordinate clause?', [['Although she was tired', true], ['Maya finished the race', false, 'This is the main clause: it makes sense on its own.'], ['the race', false, 'That is a noun phrase, not a clause (it has no verb).']], 'A subordinate clause adds information but can’t stand on its own as a sentence.'),
  fact('gr7.clause', 'grammar7', 'A group of words that contains a verb (and usually a subject) is called a…', 'clause', ['phrase', 'paragraph', 'stanza'], 'A phrase has no main verb; a clause does.'),
  fact('gr7.compound', 'grammar7', 'Two main clauses joined by and, but or so make a…', 'compound sentence', ['simple sentence', 'complex sentence', 'fragment'], 'Compound sentences use coordinating conjunctions (for, and, nor, but, or, yet, so: FANBOYS).', choiceOnly),
  fact('gr7.fragment', 'grammar7', 'Writers sometimes use “Silence.” or “Nothing.” as a sentence for impact. What is a sentence without a main verb called?', 'a minor sentence', ['a compound sentence', 'a complex sentence', 'a run-on sentence (comma splice)'], 'Used on purpose, minor sentences create tension or emphasis. Used by accident, they are mistakes.', choiceOnly),

  // --- literary words
  ...[
    ['protagonist', 'the main character in a story', 'Jim Hawkins is the protagonist of Treasure Island.'],
    ['antagonist', 'the character who works against the main character', 'The Wicked Witch is the antagonist in The Wizard of Oz.'],
    ['narrator', 'the voice telling the story', 'In Treasure Island the narrator is Jim Hawkins.'],
    ['foreshadowing', 'hints about what will happen later in a story', 'The broken mirror in chapter one is foreshadowing.'],
    ['symbolism', 'using an object or colour to stand for a bigger idea', 'The dove is a symbol of peace.'],
    ['connotation', 'the ideas or feelings a word suggests beyond its basic meaning', '“Home” has connotations of warmth and safety.'],
    ['juxtaposition', 'placing two contrasting things side by side for effect', 'The juxtaposition of the bright party and the cold street shows inequality.'],
    ['characterisation', 'how a writer creates and develops a character', 'Dickens’ characterisation of Scrooge uses a list of harsh describing words.'],
    ['pathetic fallacy', 'weather or setting that reflects a character’s mood', 'The storm raged as the hero despaired.'],
    ['genre', 'a type or category of story, such as Gothic, adventure or mystery', 'Sherlock Holmes stories belong to the detective genre.'],
    ['context', 'the time, place and situation in which a text was written', 'The Victorian context helps explain Dickens’ anger about poverty.'],
    ['first person', 'narration using “I”, told by a character in the story', '“I remember him as if it were yesterday” is first person.'],
    ['dialogue', 'the words characters speak to each other', 'Short lines of dialogue can speed up a scene.'],
    ['climax', 'the most exciting or tense point of a story', 'The climax comes when the hero finally faces the dragon.'],
  ].map(([word, def, example]) => fact(`lw.${word.replace(/\s+/g, '-')}`, 'lit-words', `Which literary term means “${def}”?`, word, undefined, `**${word}**: ${def}. Example: ${example}`, { strict: true, learn: `**${word}** means ${def}.\n\n_${example}_` })),

  // --- suffixes and roots
  ...[
    ['-ology', 'the study of', 'biology, geology', ['fear of', 'full of', 'without']],
    ['-phobia', 'fear of', 'arachnophobia, claustrophobia', ['love of', 'study of', 'rule by']],
    ['-less', 'without', 'fearless, careless', ['full of', 'more', 'again']],
    ['-ous', 'full of', 'dangerous, courageous', ['without any', 'study of', 'fear of']],
    ['-cracy', 'rule by', 'democracy, autocracy', ['study of', 'writing about', 'measure of']],
    ['-meter', 'a measuring instrument', 'thermometer, speedometer', ['a picture or drawing', 'a strong fear', 'a sound recorder']],
    ['-scope', 'an instrument for looking', 'telescope, periscope', ['an instrument for weighing', 'a device for hearing', 'a tool for writing']],
    ['phil / -phile', 'love of', 'philosophy, bibliophile', ['fear of', 'study of', 'hate of']],
    ['ped', 'foot', 'pedal, pedestrian', ['hand', 'head', 'water']],
    ['manu', 'hand', 'manual, manuscript', ['foot', 'sea', 'many']],
    ['mal-', 'bad or badly', 'malfunction, malicious', ['good', 'many', 'small']],
    ['bene-', 'good or well', 'benefit, benevolent', ['bad', 'two', 'under']],
  ].map(([part, meaning, examples, wrong]) => fact(`rt3.${part.replace(/[^a-z]/g, '')}`, 'roots-3', `What does “${part}” mean (as in ${examples})?`, meaning, wrong, `“${part}” means ${meaning}: ${examples}.`, { formats: ['choice'], learn: `**${part}** means **${meaning}**. Examples: ${examples}.` })),

  // --- poetry toolkit
  fact('pt7.stanza', 'poetry-terms', 'What is a group of lines in a poem, like a paragraph, called?', 'a stanza', ['a verse line', 'a chapter', 'a couplet only'], 'A stanza is a “paragraph” of a poem. Two rhyming lines together are a couplet.', { accept: ['stanza', 'verse'] }),
  fact('pt7.couplet', 'poetry-terms', 'Two lines in a row that rhyme are called a…', 'couplet', ['stanza', 'refrain', 'sonnet'], 'Shakespeare often ends a scene or sonnet with a rhyming couplet.'),
  fact('pt7.enjambment', 'poetry-terms', 'When a sentence runs on from one line of poetry to the next without a pause, it is called…', 'enjambment', ['caesura', 'rhyme', 'refrain'], 'Enjambment can create a sense of speed, flow or surprise.'),
  fact('pt7.caesura', 'poetry-terms', 'A pause in the middle of a line of poetry, often shown by punctuation, is called a…', 'caesura', ['enjambment', 'couplet', 'stanza'], 'A caesura slows the reader down and can emphasise the words around it.'),
  fact('pt7.sonnet', 'poetry-terms', 'How many lines does a sonnet have?', '14', ['10', '12', '16'], 'Sonnets have 14 lines and are often love poems. Shakespeare wrote 154 of them.'),
  fact('pt7.haiku', 'poetry-terms', 'A haiku has three lines. How many syllables do they usually have?', '5, 7, 5', ['3, 5, 3', '7, 5, 7', '5, 5, 5'], 'Haiku come from Japan and often capture a moment in nature.', choiceOnly),
  fact('pt7.freeverse', 'poetry-terms', 'Poetry with no regular rhyme or rhythm is called…', 'free verse', ['a sonnet', 'a ballad', 'blank verse'], 'Free verse can sound like natural speech.', choiceOnly),
  fact('pt7.refrain', 'poetry-terms', 'A line or group of lines repeated through a poem or song is a…', 'refrain', ['caesura', 'couplet', 'metaphor'], 'Refrains, like a chorus, make a poem memorable and emphasise its key idea.'),
  fact('pt7.rhyme', 'poetry-terms', 'A poem’s lines end in the pattern cat / dog / hat / log. What is its rhyme scheme?', 'ABAB', ['AABB', 'ABBA', 'ABCD'], 'Give each new end sound a new letter: cat (A), dog (B), hat (A), log (B).', choiceOnly),
  fact('pt7.speaker', 'poetry-terms', 'The “voice” in a poem, which may not be the poet, is called the…', 'speaker', ['narrator only', 'author', 'audience'], 'Write “the speaker” rather than assuming the poem is about the poet’s own life.', choiceOnly),
  fact('pt7.ballad', 'poetry-terms', 'A poem that tells a story, often in four-line stanzas with a strong rhythm, is a…', 'ballad', ['sonnet', 'haiku', 'limerick'], '“The Highwayman” by Alfred Noyes is a famous ballad.', choiceOnly),

  // --- classic poems
  mcq('pm.tyger1', 'poems', 'Which technique is used in “Tyger Tyger, burning bright”?', [['Repetition and alliteration', true], ['A simile comparing the tiger to fire', false, 'There is no “like” or “as” comparison here.'], ['Onomatopoeia and personification', false, 'None of these words imitate a sound.']], 'The repeated “Tyger” and the “burning bright” alliteration give the opening a powerful, chant-like rhythm.', TYGER),
  mcq('pm.tyger2', 'poems', 'What is the speaker asking in this stanza?', [['Who could have made such a frightening creature?', true], ['Where the tiger lives and hunts at night', false, 'The forest is mentioned, but the question is “what immortal hand… could frame” it: who made it?'], ['Why the tiger is so hungry and fierce', false, 'Hunger isn’t mentioned.']], '“What immortal hand or eye / Could frame thy fearful symmetry?” is a rhetorical question about creation: what god could make something so beautiful and so dangerous?', TYGER),
  mcq('pm.daff1', 'poems', 'What technique is used in the first line?', [['A simile comparing himself to a cloud', true], ['A metaphor saying he is a cloud', false, 'It uses “as”, so it is a simile, not a metaphor.'], ['Onomatopoeia: the sound of the wind', false, 'No sound words here.']], '“Lonely as a cloud” suggests the speaker is drifting alone, apart from the world below.', DAFFODILS),
  weighted('pm.daff2', 'poems', 'Which is the strongest comment on “a crowd, / A host, of golden daffodils”?', [
    ['The daffodils are described like a crowd of people, which contrasts with the lonely speaker and suggests nature is good company', 3, 'Excellent: names the personification, links it to “lonely”, and explains the effect.'],
    ['The poet uses personification because the daffodils are like people', 2, 'Good, but explain the effect: why does it matter that they are like people?'],
    ['There are lots of daffodils', 1, 'True, but this only retells the poem; it doesn’t analyse it.'],
    ['The daffodils are yellow', 0, 'This just repeats “golden” without any analysis.'],
  ], 'Strong analysis names the technique, quotes precisely and explains the effect, ideally linking to another part of the poem.', DAFFODILS),
  mcq('pm.wind', 'poems', 'How does Rossetti show that the wind is real, even though no one can see it?', [['Through what it does to the leaves', true], ['By describing the colour of the wind', false, 'The poem says “Neither I nor you” have seen it; it has no colour.'], ['By comparing the wind to a passing cloud', false, 'Clouds aren’t mentioned.']], 'The poem’s question-and-answer structure leads to the idea that we know some things are real by their effects.', WIND),
  mcq('pm.ozy1', 'poems', 'What is the irony in Ozymandias’s boast, “Look on my Works, ye Mighty, and despair!”?', [['Nothing of his great works is left', true], ['He really was the greatest king who ever lived', false, 'The poem shows the opposite: his statue lies broken in the desert.'], ['The travellers are terrified of the statue', false, 'There is no one there to be afraid; the sands are “lone and level”.']], 'Irony: the words meant to show eternal power now show how power fades. Shelley’s message is that no ruler lasts forever.', OZY),
  mcq('pm.ozy2', 'poems', 'What is the effect of the alliteration in “lone and level sands”?', [['The soft “l” sounds stress the empty desert', true], ['It makes the poem sound like an exciting battle', false, 'The “l” sounds are soft and slow, not exciting.'], ['It shows the sand is wet and shining', false, 'Nothing suggests the sand is wet.']], 'Sound choices support meaning: the flat, gentle sounds echo the flat, empty desert.', OZY),
  mcq('pm.railway', 'poems', 'How does Stevenson create a sense of speed?', [['A fast rhythm and quick lists of things flashing by', true], ['Long, slow sentences with lots of pauses', false, 'The lines rush by with few pauses.'], ['By describing the train stopping at each station', false, 'The train never stops in this extract.']], 'The rhythm imitates the “clickety-clack” of a train, and the lists (“bridges and houses, hedges and ditches”) are like glimpses from a window.', RAILWAY),
  mcq('pm.compare', 'poems', 'You are comparing two poems. Which sentence makes the best comparison?', [['Whereas Wordsworth finds nature comforting, Blake finds it frightening.', true], ['Wordsworth wrote about daffodils, and Blake wrote about a fierce tiger.', false, 'This describes each poem but doesn’t compare them.'], ['I liked the daffodils poem much more than the poem about the tiger.', false, 'A personal opinion, not a comparison of how the poems work.']], 'Good comparisons use connectives such as “whereas”, “similarly”, “in contrast” and “both”, and compare ideas or methods.'),

  // --- Shakespeare and his theatre
  fact('sh.born', 'shakespeare', 'In which town was Shakespeare born, in 1564?', 'Stratford-upon-Avon', ['London, on the Thames', 'Oxford', 'Windsor-upon-Thames'], 'Shakespeare was born in Stratford-upon-Avon in 1564 and died there in 1616.', { accept: ['stratford'] }),
  fact('sh.globe', 'shakespeare', 'What was the name of the London theatre where many of Shakespeare’s plays were first performed?', 'the Globe', ['the Palladium', 'the Rose and Crown', 'the Old Vic'], 'The Globe was built in 1599. A reconstruction stands near the original site today.', { accept: ['globe', 'the globe theatre', 'globe theatre'] }),
  fact('sh.groundlings', 'shakespeare', 'What were the poorer audience members who paid a penny to stand in the yard called?', 'groundlings', ['nobles', 'apprentices', 'gallants'], 'Groundlings stood around the stage in the open air, and could be noisy!'),
  fact('sh.actors', 'shakespeare', 'Who played the female roles in Shakespeare’s time?', 'boys and young men', ['women', 'children of either sex', 'puppets'], 'Women were not allowed to act on the public stage in England until 1660.', choiceOnly),
  fact('sh.soliloquy', 'shakespeare', 'A speech where a character alone on stage speaks their thoughts aloud is called a…', 'soliloquy', ['monologue to the king', 'aside', 'chorus'], 'Soliloquies let the audience into a character’s mind.'),
  fact('sh.aside', 'shakespeare', 'A short remark a character makes to the audience, which other characters on stage can’t hear, is an…', 'aside', ['soliloquy', 'epilogue', 'echo'], 'Asides share secrets with the audience, creating dramatic irony.'),
  fact('sh.irony', 'shakespeare', 'When the audience knows something a character doesn’t, it is called…', 'dramatic irony', ['foreshadowing', 'pathetic fallacy', 'a soliloquy'], 'Dramatic irony creates tension or comedy: we want to shout a warning!', choiceOnly),
  fact('sh.pentameter', 'shakespeare', 'Shakespeare’s noble characters often speak in lines of ten syllables with a da-DUM rhythm. What is this called?', 'iambic pentameter', ['free verse', 'a haiku', 'a ballad'], 'Five pairs of syllables, each with the stress on the second: “But SOFT, what LIGHT through YONder WINdow BREAKS?”', choiceOnly),
  fact('sh.prose', 'shakespeare', 'Comic and lower-class characters, like the workmen in A Midsummer Night’s Dream, usually speak in…', 'prose (ordinary sentences)', ['iambic pentameter', 'rhyming couplets only', 'song'], 'The switch between verse and prose tells the audience about status and mood.', choiceOnly),
  fact('sh.thou', 'shakespeare', 'In Shakespeare, what does “thou” mean?', 'you', ['they', 'me', 'them'], '“Thou” was used for friends, family and inferiors; “you” was more formal. “Thy” means your.'),
  fact('sh.wherefore', 'shakespeare', 'When Juliet asks “Wherefore art thou Romeo?”, what does “wherefore” mean?', 'why', ['where', 'when', 'how'], 'She is asking why he has to be Romeo (a Montague, her family’s enemy), not where he is!', choiceOnly),
  fact('sh.genres', 'shakespeare', 'Shakespeare’s plays are usually grouped into comedies, histories and…', 'tragedies', ['musicals', 'mysteries', 'fairy tales'], 'Comedies usually end in marriage; tragedies end in death.'),

  // --- A Midsummer Night's Dream
  fact('dr.setting', 'dream', 'Where is A Midsummer Night’s Dream set?', 'Athens and a forest', ['Rome and the stormy sea', 'London and Windsor Castle', 'a magical desert island'], 'The lovers flee from strict Athens into the magical forest, where the rules of ordinary life break down.', choiceOnly),
  fact('dr.hermia', 'dream', 'Hermia’s father wants her to marry Demetrius. Whom does Hermia love?', 'Lysander', ['Theseus', 'Oberon', 'Bottom'], 'Hermia and Lysander run away to the forest to escape Athenian law.'),
  fact('dr.helena', 'dream', 'Who loves Demetrius, although he has rejected her?', 'Helena', ['Hermia', 'Titania', 'Hippolyta'], 'Helena follows Demetrius into the forest.'),
  fact('dr.oberon', 'dream', 'Who is the King of the Fairies?', 'Oberon', ['Puck', 'Theseus', 'Egeus'], 'Oberon quarrels with his queen, Titania, over a changeling boy.'),
  fact('dr.titania', 'dream', 'Who is Queen of the Fairies, and falls in love with Bottom?', 'Titania', ['Hippolyta', 'Helena', 'Hermia'], 'Oberon puts love-juice on her eyes so she falls for the first creature she sees.'),
  fact('dr.puck', 'dream', 'Which mischievous fairy servant puts the love-juice on the wrong Athenian’s eyes?', 'Puck', ['Oberon', 'Bottom', 'Peaseblossom'], 'Puck, also called Robin Goodfellow, causes chaos by mistaking Lysander for Demetrius.', { accept: ['robin goodfellow'] }),
  fact('dr.bottom', 'dream', 'Which workman does Puck give a donkey’s head?', 'Bottom', ['Quince', 'Flute', 'Snout'], 'Nick Bottom, a weaver, is the most enthusiastic (and least talented) actor of the “rude mechanicals”.'),
  fact('dr.course', 'dream', 'Who says “The course of true love never did run smooth”?', 'Lysander', ['Puck', 'Theseus', 'Helena'], 'Lysander says it to Hermia near the start: a hint of all the trouble to come.', choiceOnly),
  fact('dr.fools', 'dream', 'Who says “Lord, what fools these mortals be!”?', 'Puck', ['Oberon', 'Bottom', 'Hermia'], 'Puck enjoys watching the humans’ love-tangled chaos.', choiceOnly),
  fact('dr.fierce', 'dream', '“Though she be but little, she is fierce.” Who is being described?', 'Hermia', ['Helena', 'Titania', 'Puck'], 'Helena says it about Hermia during their furious quarrel in the forest.', choiceOnly),
  mcq('dr.theme', 'dream', 'Which idea is most important in A Midsummer Night’s Dream?', [['Love makes people behave foolishly', true], ['War is glorious and makes heroes of men', false, 'There is no war in the play.'], ['Money and rank bring lasting happiness', false, 'Money is hardly mentioned.']], 'The love potion literally makes love blind and changeable, showing how love can seem to make no sense.'),
  mcq('dr.puck-speech', 'dream', 'What does this speech suggest about Puck?', [['He loves playing tricks', true], ['He is serious and obeys every rule', false, '“Merry” and “jest” show he is playful, not serious.'], ['He is frightened of horses and fillies', false, 'He tricks a horse; he isn’t afraid of it.']], '“Merry wanderer”, “jest” and “beguile” all suggest a playful trickster.', { passage: 'I am that merry wanderer of the night.\nI jest to Oberon and make him smile\nWhen I a fat and bean-fed horse beguile,\nNeighing in likeness of a filly foal;', passageSource: 'William Shakespeare, A Midsummer Night’s Dream, Act 2 Scene 1' }),

  // --- The Tempest
  fact('tp.prospero', 'tempest', 'Who is the magician who rules the island in The Tempest?', 'Prospero', ['Caliban', 'Antonio', 'Alonso'], 'Prospero was Duke of Milan until his brother Antonio stole his title.'),
  fact('tp.miranda', 'tempest', 'Who is Prospero’s daughter?', 'Miranda', ['Ariel', 'Titania', 'Juliet'], 'Miranda arrived on the island as a small child and has hardly seen any other humans.'),
  fact('tp.ariel', 'tempest', 'Which spirit serves Prospero, hoping to be set free?', 'Ariel', ['Caliban', 'Puck', 'Ferdinand'], 'Prospero freed Ariel from a tree where the witch Sycorax had trapped it.'),
  fact('tp.caliban', 'tempest', 'Who is the son of the witch Sycorax, and claims the island belongs to him?', 'Caliban', ['Ariel', 'Ferdinand', 'Gonzalo'], '“This island’s mine,” Caliban says. Modern audiences often see him as a victim of colonisation.'),
  fact('tp.antonio', 'tempest', 'Who stole Prospero’s title as Duke of Milan?', 'Antonio, his brother', ['Ferdinand, the prince', 'Caliban', 'Sebastian, Alonso’s brother'], 'Antonio and Alonso, King of Naples, set Prospero and Miranda adrift at sea.', choiceOnly),
  fact('tp.storm', 'tempest', 'Why does Prospero raise the storm at the start of the play?', 'to bring his enemies to the island', ['to sink the ship and drown everyone', 'to water his crops', 'because he lost his temper by accident'], 'Ariel brings everyone safely ashore. Prospero wants justice, and in the end chooses forgiveness.', choiceOnly),
  fact('tp.brave', 'tempest', 'Who says “O brave new world, / That has such people in’t!” on seeing a group of men for the first time?', 'Miranda', ['Prospero', 'Ariel', 'Caliban'], 'It is ironic: some of the men she admires are traitors.', choiceOnly),
  fact('tp.dreams', 'tempest', 'Who says “We are such stuff / As dreams are made on, and our little life / Is rounded with a sleep”?', 'Prospero', ['Miranda', 'Caliban', 'Ferdinand'], 'Prospero reflects that life is brief and dreamlike, like a play.', choiceOnly),
  mcq('tp.isle', 'tempest', 'Caliban says: “Be not afeard; the isle is full of noises, / Sounds and sweet airs, that give delight and hurt not.” What does this reveal about him?', [['He has a sensitive, poetic side and loves the island', true], ['He is only a violent monster', false, 'This beautiful speech shows there is more to Caliban than violence.'], ['He wants to leave the island as soon as possible', false, 'He describes the island with love.']], 'Shakespeare gives Caliban some of the most beautiful lines in the play, which complicates the idea that he is simply a monster.'),
  mcq('tp.theme', 'tempest', 'How does The Tempest end?', [['Prospero forgives his enemies and frees Ariel', true], ['Prospero drowns all his enemies in revenge', false, 'He chooses mercy instead: “The rarer action is / In virtue than in vengeance.”'], ['Caliban becomes King of Naples and Milan', false, 'Caliban is not made a king; he ends the play promising to “seek for grace”.']], 'Themes of forgiveness, freedom and power come together at the end.'),

  // --- Victorian fiction
  fact('vc.carol-scrooge', 'victorian', 'In A Christmas Carol, what does Scrooge say about Christmas at the start?', '“Bah! Humbug!”', ['“God bless us, every one!”', '“Merry Christmas to all!”', '“I love the snow!”'], '“Humbug” means nonsense or a fraud.', choiceOnly),
  fact('vc.carol-ghosts', 'victorian', 'How many spirits visit Scrooge after Marley’s ghost?', '3', ['2', '4', '5'], 'The Ghosts of Christmas Past, Present and Yet to Come.'),
  fact('vc.carol-tim', 'victorian', 'Which character says “God bless Us, Every One!”?', 'Tiny Tim', ['Scrooge', 'Bob Cratchit', 'Fred'], 'Tiny Tim, Bob Cratchit’s ill son, represents the innocent poor whom Scrooge could help.', { accept: ['tim'] }),
  mcq('vc.carol-message', 'victorian', 'Scrooge asks, “Are there no prisons? … And the Union workhouses?” What was Dickens trying to show?', [['That uncaring attitudes to the poor were wrong', true], ['That prisons were a good solution to poverty', false, 'Dickens is criticising Scrooge here; by the end, Scrooge has changed his mind.'], ['That Victorian workhouses were kind, pleasant places', false, 'Workhouses were deliberately harsh. Dickens wanted readers to feel uncomfortable.']], 'Dickens wrote A Christmas Carol (1843) partly as a protest about poverty and the 1834 Poor Law, which sent the poor to workhouses.'),
  fact('vc.marley', 'victorian', 'Complete the first line of A Christmas Carol: “Marley was dead: to begin…”', 'with', ['again', 'tonight', 'forever'], '“Marley was dead: to begin with.” A gripping, darkly funny opening.', choiceOnly),
  fact('vc.workhouse', 'victorian', 'In Victorian England, where were very poor people sent to live and work in harsh conditions?', 'the workhouse', ['the almshouse only', 'the factory dormitory', 'the countryside'], 'Families were split up and the work was hard, to discourage people from asking for help.', { accept: ['workhouse', 'workhouses'] }),
  fact('vc.gothic', 'victorian', 'Ghosts, gloomy old houses, storms and mystery are features of which genre?', 'Gothic', ['romance', 'science fiction', 'comedy'], 'Famous Gothic novels include Frankenstein (1818) and Dracula (1897).'),
  mcq('vc.gothic-setting', 'victorian', 'Which of these openings is most typical of the Gothic genre?', [['The ruined abbey loomed; somewhere a door creaked.', true], ['The sun shone brightly on the market as children played.', false, 'Too cheerful for Gothic!'], ['The silver spaceship landed gently on the red planet.', false, 'That sounds like science fiction.']], 'Gothic settings use darkness, decay, isolation and sounds that create suspense.'),
  fact('vc.holmes', 'victorian', 'Who is Sherlock Holmes’s friend and the narrator of most of his adventures?', 'Dr Watson', ['Professor Moriarty', 'Inspector Lestrade', 'Mrs Hudson'], 'Watson’s first-person narration lets readers share his amazement at Holmes’s deductions.', { accept: ['watson', 'doctor watson', 'dr. watson', 'john watson'] }),
  fact('vc.baker', 'victorian', 'At which London address does Sherlock Holmes live?', '221B Baker Street', ['10 Downing Street', '1 Pudding Lane', '50 Berkeley Square'], 'Holmes and Watson share rooms there; their landlady is Mrs Hudson.', choiceOnly),
  fact('vc.countenance', 'victorian', 'In 19th-century novels, what does “countenance” mean?', 'face or expression', ['country', 'money', 'a type of carriage'], '“His countenance was grim” means he had a grim expression.'),
  fact('vc.melancholy', 'victorian', 'What does “melancholy” mean?', 'deep sadness', ['great, lasting anger', 'nervous excitement', 'gnawing hunger'], 'A word Victorian writers loved. It suits Gothic stories.'),

  // --- unseen extracts
  mcq('un7.ti1', 'unseen', 'What impression does the narrator give of the man arriving at the inn?', [['He is rough and probably dangerous', true], ['He is a rich, elegant gentleman', false, 'His coat is “soiled” and his nails “black, broken”: not a gentleman.'], ['He is a frightened and lost young boy', false, 'He is “tall, strong, heavy”.']], 'The list of adjectives and details like the “sabre cut across one cheek” build a picture of a violent past.', TREASURE),
  mcq('un7.ti2', 'unseen', 'Why does the writer use such a long list of details in one sentence?', [['To build an overwhelming picture, as the boy saw him', true], ['Because Victorian writers had to make sentences long', false, 'Writers choose sentence length for effect.'], ['To make the man seem dull and ordinary', false, 'The details make him fascinating and threatening, not boring.']], 'Long, listing sentences can pile up detail and create a strong first impression.', TREASURE),
  mcq('un7.ti3', 'unseen', 'What does “as if it were yesterday” suggest?', [['The memory is still very clear to him', true], ['It actually happened only yesterday', false, '“As if” means it didn’t; it just feels that recent.'], ['The narrator has forgotten most of what happened', false, 'The opposite: the details are vivid.']], 'This phrase also tells us the narrator is looking back from later in life.', TREASURE),
  mcq('un7.sg1', 'unseen', 'What can you infer about Mary from the opening?', [['She is unhappy and unpleasant, at first', true], ['She is popular, cheerful and well liked', false, '“Disagreeable” and “sour expression” suggest the opposite.'], ['She is very rich and spoiled by her parents', false, 'The extract doesn’t tell us about money.']], 'Writers often begin with an unlikeable protagonist so we can watch them change.', GARDEN),
  mcq('un7.sg2', 'unseen', 'What is the effect of repeating the word “thin”?', [['It stresses how unhealthy Mary seems', true], ['It shows she is quick and good at running', false, 'Nothing here is about running.'], ['It is a printing mistake in the book', false, 'The repetition is deliberate.']], 'Repetition makes a detail stick in the reader’s mind.', GARDEN),
  mcq('un7.sg3', 'unseen', 'The narrator agrees: “It was true, too.” What does this short sentence do?', [['It bluntly confirms everyone’s harsh opinion', true], ['It shows the narrator disagrees with everybody', false, '“It was true” means the narrator agrees.'], ['It describes the manor and its gardens', false, 'It refers to Mary.']], 'A short sentence after a long one adds punch and a touch of humour.', GARDEN),
  mcq('un7.sh1', 'unseen', 'What point is Holmes making to Watson?', [['Seeing is not the same as observing', true], ['Watson should count the stairs every day', false, 'The stairs are just an example of a bigger idea.'], ['Watson needs glasses for his bad eyesight', false, 'Watson can see; he just doesn’t observe.']], 'Holmes’s distinction between seeing and observing is the secret of his detective method.', HOLMES),
  mcq('un7.sh2', 'unseen', 'How does the writer make Holmes seem clever through the dialogue?', [['Holmes asks short questions that expose Watson', true], ['Holmes gives a long speech about chemistry', false, 'His questions are short and sharp.'], ['Watson explains everything patiently to Holmes', false, 'It is the other way round.']], 'The question-and-answer pattern builds to Holmes’s triumphant “Quite so!”.', HOLMES),

  // --- analysis
  order('an.petal', 'analysis', 'Put the parts of an analytical paragraph in order.', ['Point', 'Evidence', 'Technique', 'Analysis', 'Link'], ['what you are arguing', 'a short quotation', 'the method used', 'the effect on the reader', 'back to the question'], 'PETAL: Point, Evidence, Technique, Analysis, Link.'),
  mcq('an.embed', 'analysis', 'Which sentence embeds a quotation best?', [['Scrooge is “solitary as an oyster”, suggesting he has shut himself off from everyone.', true], ['Scrooge is lonely. “Solitary as an oyster.” This shows he is lonely.', false, 'The quotation is dropped in on its own, and “this shows he is lonely” just repeats the point.'], ['The quote that shows Scrooge is lonely is the one about the oyster.', false, 'Quote the exact words, and keep them short.']], 'An embedded quotation fits smoothly into your own sentence and is followed by analysis.'),
  weighted('an.best', 'analysis', 'Question: How does Dickens present Scrooge? Which is the strongest analysis of “Hard and sharp as flint”?', [
    ['The simile compares Scrooge to flint, a hard stone, suggesting he is cold and unfeeling; “sharp” also hints he could hurt people.', 3, 'Excellent: technique named, connotations of specific words explored, effect explained.'],
    ['Dickens uses a simile to show Scrooge is hard.', 1, 'Correct technique, but it just repeats the quotation. Explore the words: what do flint and sharp suggest?'],
    ['This quote shows that Scrooge is a bad person.', 1, 'Too vague: name the technique and zoom in on specific words.'],
    ['Flint is a type of rock found in chalk.', 0, 'True, but not analysis of the effect on the reader.'],
  ], 'Strong analysis zooms in on individual words and their connotations, and explains the effect.'),
  fact('an.verbs', 'analysis', 'Which of these is a good verb for writing about a writer’s effect?', 'suggests', ['says', 'tells', 'is'], 'Analysis verbs: suggests, implies, conveys, emphasises, highlights, reveals, creates.', choiceOnly),
  fact('an.tentative', 'analysis', 'Which phrase shows a thoughtful, tentative interpretation?', 'this could suggest', ['this definitely proves', 'this is', 'everyone knows'], 'Good analysts offer possible meanings: “perhaps”, “this could suggest”, “alternatively”.', choiceOnly),
  mcq('an.zoom', 'analysis', '“The wind howled.” Which comment zooms in best on a single word?', [['“Howled” makes the wind sound like a wild animal.', true], ['The writer describes the stormy weather in detail.', false, 'This doesn’t analyse any particular word.'], ['The sentence is short, which makes it punchy.', false, 'A true observation, but not about word choice.']], 'Zooming in means picking one word and exploring what it makes us think and feel.'),
  fact('an.effect', 'analysis', 'In analysis, “the effect on the reader” means…', 'what the writer’s choice makes the reader feel', ['whether the reader enjoyed the whole book', 'how long the book takes to read', 'what the reader decides to read next'], 'Always ask: why did the writer choose this, and what does it make us think or feel?', choiceOnly),
  fact('an.short', 'analysis', 'How long should a quotation in an analytical paragraph usually be?', 'a few precise words', ['a whole paragraph', 'at least three sentences', 'the entire poem'], 'Short quotations let you focus on exactly the words you want to analyse.', choiceOnly),

  // --- rhetoric
  fact('rh.ethos', 'rhetoric', 'A speaker who says “As a doctor for twenty years, I have seen…” is persuading by showing their…', 'expertise', ['strong anger', 'sense of humour', 'age and nothing else'], 'The Ancient Greeks called this ethos: persuading through trust in the speaker.', choiceOnly),
  fact('rh.stats', 'rhetoric', '“Nine out of ten pupils agree.” Which persuasive technique is this?', 'statistics', ['a simile', 'personification', 'a rhetorical question'], 'Facts and statistics make an argument sound reliable. Always ask where they come from!'),
  fact('rh.direct', 'rhetoric', '“You can make a difference today.” Which technique is this?', 'direct address', ['alliteration', 'hyperbole', 'onomatopoeia'], 'Speaking directly to the audience with “you” makes them feel involved.', choiceOnly),
  fact('rh.counter', 'rhetoric', '“Some people say homework helps us learn. However…” What is the speaker doing?', 'rebutting the other side', ['agreeing completely with them', 'telling a personal story', 'using a simile for effect'], 'Raising and then rebutting the other side makes an argument look stronger and fairer.', choiceOnly),
  mcq('rh.purpose', 'rhetoric', 'A charity leaflet asking for donations has which main purpose?', [['To persuade', true], ['To entertain', false, 'It might be engaging, but its aim is to get donations.'], ['To instruct', false, 'Instructions tell you how to do something step by step.']], 'Purpose, audience and form shape every choice a writer makes.'),
  mcq('rh.churchill', 'rhetoric', 'Churchill said: “We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets.” What technique is used?', [['Repetition of “we shall fight”', true], ['A simile comparing beaches to fields', false, 'Nothing is compared using “like” or “as”.'], ['A rhetorical question to the nation', false, 'It is a statement, not a question.']], 'Repetition at the start of clauses builds rhythm, determination and emotion.'),
  fact('rh.triple', 'rhetoric', '“Our school must be safer, greener and fairer.” Which technique is this?', 'rule of three', ['statistics', 'personification', 'onomatopoeia'], 'Ideas in threes sound complete and memorable.', { accept: ['triplet', 'tricolon'] }),
];

// Memory hooks (mnemonics) and real-world examples, keyed by item id (without “english.”).
const MEMORY = {
  'gr7.simple': { hook: 'Simple = one subject + one main verb: “The dog barked.”' },
  'gr7.complex': { hook: 'AAAWWUBBIS starts a subordinate clause: after, although, as, when, while, until, because, before, if, since.' },
  'gr7.wordclass': { hook: 'Noun = naming word, verb = doing or being word, adjective describes a noun, adverb describes a verb (often -ly).' },
  'gr7.subordinate': { hook: 'Sub = under (like a submarine): a subordinate clause works under the main clause and can’t stand alone.' },
  'gr7.clause': { hook: 'A clause has a verb in it (“the bus came”); a phrase has no verb (“in the morning”).' },
  'gr7.compound': { hook: 'FANBOYS: for, and, nor, but, or, yet, so, the coordinating conjunctions that join two main clauses.' },
  'gr7.fragment': { example: 'Film posters and adverts love minor sentences: “Coming soon.” “Simply delicious.”' },
  'lw.protagonist': { hook: 'Proto = first: the protagonist is the first, main character.' },
  'lw.antagonist': { hook: 'Anti = against: the antagonist works against the hero.', example: 'The Big Bad Wolf is the antagonist in “The Three Little Pigs”.' },
  'lw.foreshadowing': { hook: 'Fore-shadowing: a shadow cast before the event arrives.', example: 'In films, spooky music before the shark appears is foreshadowing.' },
  'lw.symbolism': { example: 'A red rose stands for love; a white flag stands for surrender.' },
  'lw.connotation': { hook: 'Connotations come WITH a word: “home” comes with warmth; “house” is just a building.', example: 'Food labels say “home-made”, not “made in a factory”, for the cosy connotations.' },
  'lw.juxtaposition': { hook: 'Latin juxta = next to: two opposites placed side by side.' },
  'lw.characterisation': { hook: 'Characterisation: how the writer builds a character from what they say, do, think and look like.' },
  'lw.pathetic-fallacy': { hook: 'Pathetic = feelings (as in sympathy); fallacy = something false. The weather seems to share the feelings.', example: 'Films do it all the time: rain at the funeral, sunshine at the wedding.' },
  'lw.genre': { example: 'Bookshops and streaming apps sort stories by genre: horror, comedy, fantasy, mystery.' },
  'lw.context': { example: 'Dickens worked in a boot-polish factory aged 12. That context helps explain his anger about poor children.' },
  'lw.first-person': { hook: 'First person = I and we; second person = you; third person = he, she and they.' },
  'lw.climax': { hook: 'The climax is the top of the story mountain.' },
  'rt3.ology': { example: 'Biology is the study of life, zoology of animals and geology of rocks.' },
  'rt3.phobia': { example: 'Arachnophobia is fear of spiders; claustrophobia is fear of small, enclosed spaces.' },
  'rt3.less': { hook: '-less means none at all: careless = without care, hopeless = without hope.' },
  'rt3.ous': { hook: '-ous = full of: famous is full of fame, dangerous is full of danger.' },
  'rt3.cracy': { example: 'Democracy is rule by the people (Greek demos = people): we vote for who governs us.' },
  'rt3.meter': { example: 'A thermometer measures temperature; a speedometer measures a car’s speed.' },
  'rt3.scope': { example: 'A periscope lets a submarine crew look above the waves.' },
  'rt3.philphile': { example: 'Philadelphia is nicknamed “the City of Brotherly Love”.' },
  'rt3.ped': { example: 'A pedestrian crossing is for people on foot; you push bike pedals with your feet.' },
  'rt3.manu': { example: 'In a manual car you change gear by hand.' },
  'rt3.mal': { example: 'Malware is bad software that harms your computer.' },
  'rt3.bene': { example: 'A charity concert held to raise money for a good cause is called a benefit.' },
  'pt7.stanza': { hook: 'Stanza is Italian for “room”: each stanza is a room in the poem’s house.' },
  'pt7.couplet': { hook: 'A couplet is a couple: two lines that go together and rhyme.' },
  'pt7.enjambment': { hook: 'From French “to stride over”: the sentence strides over the line break.' },
  'pt7.caesura': { hook: 'Caesura comes from Latin “to cut”: it cuts a line in the middle.' },
  'pt7.sonnet': { hook: 'Sonnet means “little song”: 14 lines, often about love.' },
  'pt7.haiku': { hook: '5, 7, 5 = 17 syllables. Count them on your fingers as you read.' },
  'pt7.freeverse': { hook: 'Free verse is free of rules. Blank verse is different: no rhyme, but it keeps the da-DUM beat.' },
  'pt7.refrain': { example: 'The chorus of a pop song is a refrain: it comes back after every verse.' },
  'pt7.rhyme': { hook: 'New end sound, new letter: cat A, dog B, hat A, log B.' },
  'pt7.speaker': { hook: 'The poet writes; the speaker speaks, like an actor playing a part.' },
  'pt7.ballad': { hook: 'A ballad is a story you could sing.', example: 'Many folk songs are ballads: a story told verse by verse with a strong beat.' },
  'pm.tyger1': { hook: 'Read “Tyger Tyger, burning bright” aloud like a drumbeat: repetition and alliteration make a chant.' },
  'pm.daff1': { hook: 'Spot “as” or “like”? It’s a simile: “lonely as a cloud”.' },
  'pm.ozy1': { hook: 'Irony is the opposite of what you expect: the “King of Kings” is now a broken statue in the sand.' },
  'pm.ozy2': { hook: 'Listen to the sounds: soft l’s are slow and flat; hard k’s and t’s sound harsh.' },
  'pm.railway': { example: 'Read it aloud and say “clickety-clack” under your breath: the rhythm copies a train on the tracks.' },
  'pm.compare': { hook: 'Comparison words: whereas, similarly, in contrast, both, however.' },
  'sh.born': { hook: '’64 to ’16: Shakespeare was born and died in Stratford-upon-Avon (1564–1616).' },
  'sh.globe': { hook: 'The Globe was round like the world, and in As You Like It Shakespeare wrote “All the world’s a stage”.' },
  'sh.groundlings': { hook: 'Groundlings stood on the ground in the yard, for a penny.', example: 'Shakespeare’s Globe in London still sells cheap standing tickets in the yard today.' },
  'sh.actors': { example: 'Imagine it: when Viola in Twelfth Night disguises herself as a boy, it was a boy playing a girl playing a boy!' },
  'sh.soliloquy': { hook: 'Soliloquy sounds like “solo”: alone on stage, thinking aloud.' },
  'sh.aside': { hook: 'An aside is said to the side, for the audience’s ears only.', example: 'Like a TV character who turns and speaks to the camera.' },
  'sh.irony': { example: 'Pantomime! “He’s behind you!”: the audience knows, the character doesn’t.' },
  'sh.pentameter': { hook: 'Penta = five (a pentagon has five sides): five da-DUMs to a line, like a heartbeat.' },
  'sh.prose': { hook: 'Posh characters speak poetry; ordinary folk speak prose.' },
  'sh.thou': { hook: 'thou = you (doing it), thee = you (it’s done to you), thy = your, thine = yours.' },
  'sh.wherefore': { hook: 'Wherefore = why: “Why are you a Montague, Romeo?”' },
  'sh.genres': { hook: 'Comedies end in weddings; tragedies end in deaths.' },
  'dr.setting': { hook: 'City of rules → forest of magic → back to the city, all sorted out.' },
  'dr.hermia': { hook: 'The pairs: Hermia loves Lysander; Helena loves Demetrius.' },
  'dr.helena': { hook: 'The pairs: Helena loves Demetrius; Hermia loves Lysander.' },
  'dr.oberon': { hook: 'Oberon and Titania: the fairy king and queen, quarrelling.' },
  'dr.titania': { hook: 'Titania, Queen of the Fairies, falls for Bottom while he has a donkey’s head.' },
  'dr.puck': { hook: 'Oberon tells Puck to look for a man in Athenian clothes. Both young men are wearing them, so Puck picks the wrong one!' },
  'dr.bottom': { hook: 'Bottom the weaver gets a donkey’s head: the play’s biggest joke.' },
  'dr.course': { example: 'People still say “the course of true love never did run smooth” about any tricky romance.' },
  'dr.fierce': { example: '“Though she be but little, she is fierce” is printed on mugs, T-shirts and posters.' },
  'tp.prospero': { hook: 'Prospero: a magician who was once Duke of Milan.' },
  'tp.ariel': { hook: 'Ariel sounds like air: a spirit of the air who flies, sings and longs to be free.' },
  'tp.caliban': { hook: 'Caliban’s name is often thought to play on “canibal”, an old spelling of cannibal.' },
  'tp.antonio': { hook: 'Antonio the usurper: he stole his own brother’s dukedom.' },
  'tp.storm': { hook: 'A tempest is a storm: the title tells you how the play begins.' },
  'tp.brave': { example: 'Aldous Huxley borrowed “Brave New World” as the title of a famous novel.' },
  'tp.theme': { hook: '“The rarer action is in virtue than in vengeance”: forgiveness beats revenge.' },
  'vc.carol-scrooge': { hook: 'Humbug = nonsense. “Bah! Humbug!” is Scrooge’s catchphrase.', example: 'Today people call a mean, grumpy person “a Scrooge”.' },
  'vc.carol-ghosts': { hook: 'Past, Present, Yet to Come: three spirits after Marley’s ghost.' },
  'vc.carol-message': { hook: 'Dickens was the voice of the poor: he had worked in a factory himself as a boy.' },
  'vc.workhouse': { example: 'In Oliver Twist, Oliver asks for more gruel in the workhouse: “Please, sir, I want some more.”' },
  'vc.gothic': { hook: 'Gothic’s four G’s: ghosts, gloom, graves and gargoyles.' },
  'vc.holmes': { example: 'Many TV detectives still have a “Watson”: a sidekick who asks the questions the audience wants answered.' },
  'vc.baker': { example: 'Today there is a Sherlock Holmes Museum at 221B Baker Street in London.' },
  'vc.countenance': { hook: 'Countenance = face or expression: “his countenance fell” means he looked disappointed.' },
  'vc.melancholy': { hook: 'Melancholy is Greek for “black bile”, once thought to cause sadness.' },
  'un7.ti3': { hook: '“As if” signals a comparison, not a fact.' },
  'un7.sg1': { hook: 'Infer from the adjectives: “disagreeable” and “sour” → unpleasant.' },
  'un7.sg3': { hook: 'A short sentence after a long one = a punch.' },
  'un7.sh1': { hook: 'Seeing notices the stairs; observing counts them.' },
  'an.petal': { hook: 'PETAL: Point, Evidence, Technique, Analysis, Link: five petals make one paragraph.' },
  'an.embed': { hook: 'Embed it like a jewel in a ring: the quotation sits inside your own sentence.' },
  'an.verbs': { hook: 'Swap “says” and “shows” for suggests, implies, conveys, highlights.' },
  'an.tentative': { hook: 'Tentative = maybe: perhaps, could, might, alternatively.' },
  'an.zoom': { hook: 'Zoom like a camera lens: pick one word, then ask what it makes you picture and feel.' },
  'an.short': { hook: 'Quote short, explain long.' },
  'rh.ethos': { hook: 'Ethos, pathos, logos: trust in the speaker, feelings, and logic.' },
  'rh.stats': { example: 'Toothpaste adverts: “9 out of 10 dentists recommend…” Who asked them, and how many?' },
  'rh.direct': { example: 'The famous First World War poster points straight at you: “Your Country Needs YOU”.' },
  'rh.counter': { hook: 'Counter-argument: “Some say… However…”: knock down the other side’s point.' },
  'rh.purpose': { hook: 'PAF: Purpose, Audience, Form. Ask all three before you read or write.' },
  'rh.churchill': { hook: 'Repeating words at the start of each clause is called anaphora: “We shall fight… we shall fight…”' },
  'rh.triple': { example: 'Slogans love threes: “Stop, look, listen” and “Reduce, reuse, recycle”.' },
};
for (const it of items) Object.assign(it, MEMORY[it.id.replace(/^english\./, '')]);

const SENTENCES = [
  {
    id: 'sent.embed-quote', title: 'Embed a quotation',
    prompt: 'Write ONE sentence about Scrooge that embeds the quotation “solitary as an oyster” and explains what it suggests.',
    checks: [{ type: 'regex', pattern: '[“"]solitary as an oyster[”"]', flags: 'i', msg: 'Include the exact words in quotation marks: “solitary as an oyster”.' }, { type: 'includesAny', words: ['suggests', 'implies', 'conveys', 'shows', 'emphasises', 'highlights'], msg: 'Explain it with an analysis verb (suggests, implies, conveys…).' }, { type: 'maxSentences', n: 1 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'Dickens describes Scrooge as “solitary as an oyster”, which suggests he has shut himself away from other people like a creature in a hard shell.',
    tip: 'Make the quotation part of your own sentence, then explain the effect.',
  },
  {
    id: 'sent.compare', title: 'Compare two texts',
    prompt: 'Write ONE sentence comparing two characters, books or poems you know, using “whereas” or “in contrast”.',
    checks: [{ type: 'includesAny', words: ['whereas', 'in contrast', 'while', 'however'], msg: 'Use a comparative connective such as “whereas” or “in contrast”.' }, { type: 'minWords', n: 12 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'Whereas Mary Lennox begins The Secret Garden sour and lonely, Jim Hawkins in Treasure Island is curious and brave from the start.',
    tip: 'Comparisons point out a similarity or difference AND explain it.',
  },
  {
    id: 'sent.tentative', title: 'Offer two interpretations',
    prompt: 'Write about “the wind howled” giving TWO possible meanings, using “perhaps” or “alternatively”.',
    checks: [{ type: 'includesAny', words: ['perhaps', 'alternatively', 'could', 'might'], msg: 'Show you are offering possibilities: perhaps, could, might, alternatively.' }, { type: 'includesAny', words: ['howled', 'howl'], msg: 'Zoom in on the word “howled”.' }, { type: 'minWords', n: 15 }, { type: 'capital' }, { type: 'endPunct' }],
    model: '“Howled” perhaps makes the wind sound like a wolf, which is threatening; alternatively, it could suggest the wind is in pain, mirroring a character’s sadness.',
    tip: 'Top answers explore more than one interpretation.',
  },
  {
    id: 'sent.speech-open', title: 'Open a speech',
    prompt: 'Write the first two sentences of a speech persuading your class to read more books. Use a rhetorical question and direct address.',
    checks: [{ type: 'regex', pattern: '\\?', flags: '', msg: 'Include a rhetorical question.' }, { type: 'includesAny', words: ['you', 'your', 'we', 'us'], msg: 'Speak directly to the audience (you, we).' }, { type: 'minWords', n: 15 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'Have you ever wished you could travel to another world? Every time you open a book, you can.',
    tip: 'Hook your audience in the very first line.',
  },
];

const RUBRIC_ANALYTICAL = [
  ['Point answers the question', ['No clear point', 'A point, loosely linked to the question', 'A clear point that answers the question directly']],
  ['Evidence', ['No quotation', 'A quotation, but long or not embedded', 'Short, precise quotations embedded in sentences']],
  ['Analysis of effect', ['Retells what happens', 'Names a technique or says what words mean', 'Explains the effect of specific words on the reader, naming the technique']],
  ['Link and accuracy', ['No link back', 'Some link back', 'Links back to the question; accurate and formal']],
].map(([name, levels]) => ({ name, levels }));

const PIECES = [
  {
    id: 'piece.puck', type: 'analytical', title: 'How does Shakespeare present Puck?',
    task: 'Read Puck’s speech from A Midsummer Night’s Dream. How does Shakespeare present Puck as mischievous? Write two analytical paragraphs.',
    plan: ['Point 1: what Puck is like', 'Evidence 1', 'Analysis 1: zoom in on one word', 'Point 2', 'Evidence 2', 'Analysis 2, and what the audience thinks of him'],
    criteria: ['Clear points about Puck’s character', 'Short embedded quotations', 'Zooms in on single words (merry, jest, beguile)', 'Comments on the effect on the audience', 'Uses analysis verbs', 'Links back to “mischievous”'],
    words: [200, 400], starter: 'From his very first words, Shakespeare presents Puck as a playful trickster who enjoys causing chaos.',
    passage: 'I am that merry wanderer of the night.\nI jest to Oberon and make him smile\nWhen I a fat and bean-fed horse beguile,\nNeighing in likeness of a filly foal;', passageSource: 'William Shakespeare, A Midsummer Night’s Dream, Act 2 Scene 1',
    rubric: RUBRIC_ANALYTICAL,
  },
  {
    id: 'piece.compare-poems', type: 'analytical', title: 'Compare two poems about nature',
    task: 'Compare how nature is presented in “I Wandered Lonely as a Cloud” and “The Tyger”. Write three paragraphs: one on each poem and one comparing them.',
    plan: ['What nature is like in Wordsworth’s poem, with a quotation', 'What nature is like in Blake’s poem, with a quotation', 'One similarity', 'One difference', 'Which poem’s view of nature do you find more powerful, and why?'],
    criteria: ['Writes about both poems', 'Uses comparative connectives (whereas, similarly, in contrast)', 'Short embedded quotations from each', 'Names techniques (simile, personification, repetition)', 'Explains effects on the reader', 'A personal response with reasons'],
    words: [250, 450], starter: 'Both Wordsworth and Blake write about nature, but whereas Wordsworth finds comfort in it, Blake seems awed and even frightened.',
    passage: 'I wandered lonely as a cloud\nThat floats on high o’er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\n\n…\n\nTyger Tyger, burning bright,\nIn the forests of the night;\nWhat immortal hand or eye,\nCould frame thy fearful symmetry?', passageSource: 'William Wordsworth (1807) and William Blake (1794)',
    rubric: RUBRIC_ANALYTICAL,
  },
];

export default [{ subject: 'english', deck: 'year7', topics, items, sentences: SENTENCES, pieces: PIECES }];

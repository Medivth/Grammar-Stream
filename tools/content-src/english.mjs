// English content source. Built into content/english/*.json by tools/build-content.mjs.

// ---------------------------------------------------------------------------
// Statutory Year 5/6 spelling list (National Curriculum English Appendix 1).
// [word, sentence with ___, clue, tricky-part note]
const SPELLINGS = {
  'Double letters (part 1)': [
    ['accommodate', 'The hotel can ___ forty guests.', 'to have room for', 'Two c’s and two m’s: ac-com-mo-date.'],
    ['accompany', 'Will you ___ me to the shop?', 'to go somewhere with someone', 'ac + company: double c.'],
    ['according', '___ to the forecast, it will rain.', 'as stated by', 'ac + cord + ing: double c.'],
    ['aggressive', 'The ___ goose chased us across the field.', 'ready to attack', 'Double g and double s.'],
    ['apparent', 'It was ___ that nobody had cleaned up.', 'clear or obvious', 'ap + par + ent: double p, single r, ends -ent.'],
    ['appreciate', 'I really ___ your help.', 'to be grateful for', 'Double p: ap-pre-ci-ate.'],
    ['attached', 'A label was ___ to the parcel.', 'joined or fastened on', 'Double t, and no t before ch: at-tached.'],
    ['committee', 'The school ___ met to plan the fair.', 'a group chosen to make decisions', 'Double m, double t, double e.'],
    ['communicate', 'Dolphins ___ using clicks and whistles.', 'to share information', 'Double m: com-mu-ni-cate.'],
    ['community', 'Our ___ held a street party.', 'the people living in one area', 'Double m: com-mu-ni-ty.'],
    ['correspond', 'I ___ with a pen pal in France.', 'to write letters to each other', 'Double r: cor-re-spond.'],
    ['embarrass', 'Please don’t ___ me in front of my friends.', 'to make someone feel awkward', 'Double r AND double s.'],
    ['exaggerate', 'Don’t ___; it was only a small spider.', 'to make something sound bigger than it is', 'Double g, single x: ex-ag-ger-ate.'],
  ],
  'Double letters (part 2)': [
    ['excellent', 'You did an ___ job on that poster.', 'extremely good', 'Double l, ends -ent.'],
    ['harass', 'Seagulls ___ people eating chips on the beach.', 'to keep annoying or pestering', 'Single r, double s.'],
    ['immediately', 'Come here ___!', 'straight away', 'Double m, and keep the e: immediate + ly.'],
    ['interrupt', 'It is rude to ___ someone who is speaking.', 'to break in while someone is talking', 'inter + rupt: double r.'],
    ['marvellous', 'We had a ___ time at the seaside.', 'wonderful', 'Double l before -ous (British spelling).'],
    ['necessary', 'Is it ___ to bring a coat?', 'needed', 'One collar (c), two sleeves (ss).'],
    ['occupy', 'The new family will ___ the empty house.', 'to live in or fill a space', 'Double c: oc-cu-py.'],
    ['occur', 'Earthquakes ___ along fault lines.', 'to happen', 'Double c, single r (but occurred, occurring).'],
    ['opportunity', 'This trip is a great ___ to learn.', 'a good chance to do something', 'Double p: op-por-tu-ni-ty.'],
    ['programme', 'My favourite TV ___ starts at six.', 'a show on TV or radio', 'British spelling ends -mme.'],
    ['recommend', 'I ___ this book to anyone who likes mysteries.', 'to suggest something is good', 'One c, double m: re + commend.'],
    ['sufficient', 'Is there ___ food for everyone?', 'enough', 'Double f, then -cient.'],
    ['suggest', 'Can I ___ a better plan?', 'to put forward an idea', 'Double g: sug-gest.'],
  ],
  'Silent letters and hidden sounds': [
    ['yacht', 'A white ___ sailed into the harbour.', 'a sailing boat used for racing or holidays', 'Silent ch: y-a-c-h-t.'],
    ['muscle', 'Your heart is a ___.', 'body tissue that makes you move', 'Silent c: mus-cle.'],
    ['rhyme', '“Cat” and “hat” ___.', 'to end with the same sound', 'rh at the start, y in the middle.'],
    ['rhythm', 'Clap along to the ___ of the song.', 'a regular beat', 'rh-y-th-m: no vowels except y.'],
    ['conscience', 'My ___ told me to own up.', 'the inner sense of right and wrong', 'con + science.'],
    ['conscious', 'The patient was ___ and talking.', 'awake and aware', 'con + sc + ious.'],
    ['foreign', 'She speaks three ___ languages.', 'from another country', 'Silent g: for-eign.'],
    ['government', 'The ___ makes laws for the country.', 'the group of people who run a country', 'Hidden n: govern + ment.'],
    ['environment', 'We must protect the ___.', 'the natural world around us', 'Hidden n: environ + ment.'],
    ['parliament', 'Laws are debated in ___.', 'the group that makes a country’s laws', 'Hidden i: par-li-a-ment.'],
    ['soldier', 'The ___ marched across the square.', 'a member of an army', 'di sounds like “j”.'],
    ['stomach', 'My ___ is rumbling.', 'where food goes after you swallow it', 'ch sounds like “k”.'],
    ['twelfth', 'Today is my ___ birthday.', 'number 12 in order', 'twelve → twelfth: keep the f, add th.'],
    ['thorough', 'Give your room a ___ clean.', 'complete and careful', 'thor + ough (like borough).'],
    ['queue', 'We waited in a long ___.', 'a line of people waiting', 'q-u-e-u-e: five letters, only one sound.'],
    ['lightning', 'A flash of ___ lit up the sky.', 'a flash of light in a storm', 'No e: lightning (not lightening).'],
    ['guarantee', 'I ___ you will love this film.', 'to promise for certain', 'Silent u after g: guar-an-tee.'],
    ['leisure', 'Swimming is my favourite ___ activity.', 'free time for enjoyment', 'ei, an exception to “i before e”.'],
  ],
  'Endings: -ance, -ence, -ant, -ent, -ous': [
    ['nuisance', 'The buzzing fly was a real ___.', 'something annoying', 'nui + sance.'],
    ['convenience', 'For your ___, the shop is open late.', 'something that makes life easier', 'Ends -ence: con-ven-i-ence.'],
    ['existence', 'Scientists debated the ___ of the giant squid.', 'being real', 'Ends -ence: ex-is-tence.'],
    ['hindrance', 'The heavy bag was a ___ on the hike.', 'something that gets in the way', 'hinder loses its e: hind-rance.'],
    ['relevant', 'Only include ___ facts in your answer.', 'connected to the subject', 'Ends -ant: rel-e-vant.'],
    ['restaurant', 'We ate pizza at a new ___.', 'a place where you buy and eat meals', 'rest + au + rant.'],
    ['mischievous', 'The ___ puppy chewed my shoe.', 'playfully naughty', 'Ends -vous, not -vious. Say it: mis-chi-vus.'],
    ['disastrous', 'The storm was ___ for the farmers.', 'causing great damage', 'disaster loses its e: dis-as-trous.'],
    ['curiosity', 'Her ___ made her open the box.', 'a strong wish to know something', 'curious loses its u: cur-i-os-i-ty.'],
    ['amateur', 'He is an ___ photographer, not a professional.', 'someone who does something for fun, not pay', 'Ends -eur: am-a-teur.'],
    ['privilege', 'It was a ___ to meet the author.', 'a special right or honour', 'No d: priv-i-lege.'],
    ['sacrifice', 'She made a ___ to help her family.', 'giving something up for something else', 'sac-ri-fice.'],
    ['prejudice', 'Judging someone by their accent is ___.', 'an unfair opinion formed in advance', 'pre + judice.'],
    ['interfere', 'Don’t ___ with the experiment.', 'to get involved where not wanted', 'inter + fere.'],
  ],
  'Unstressed vowels': [
    ['definite', 'We need a ___ answer by Friday.', 'certain or fixed', 'It contains “finite”: de-fin-ite.'],
    ['desperate', 'The thirsty traveller was ___ for water.', 'needing something very badly', 'des-per-ate: e, then a.'],
    ['category', 'Which ___ does a whale belong to?', 'a group of similar things', 'cat-e-gory: e in the middle.'],
    ['cemetery', 'The old ___ had mossy gravestones.', 'a place where people are buried', 'Three e’s: cem-e-tery.'],
    ['average', 'The ___ height in our class is 140 cm.', 'the usual or middle amount', 'av-er-age.'],
    ['bargain', 'This jacket was a ___ at half price.', 'something bought cheaply', 'bar + gain.'],
    ['dictionary', 'Look the word up in a ___.', 'a book of word meanings', 'dic-tion-ary.'],
    ['secretary', 'The club ___ wrote the minutes.', 'someone who writes letters and keeps records', 'secret + ary.'],
    ['vegetable', 'A carrot is a root ___.', 'a plant grown for food', 'veg-e-ta-ble: say all four parts.'],
    ['temperature', 'The ___ dropped below zero.', 'how hot or cold something is', 'tem-per-a-ture.'],
    ['frequently', 'It ___ rains in Manchester.', 'often', 'frequent + ly.'],
    ['develop', 'Tadpoles ___ into frogs.', 'to grow or change gradually', 'No e at the end: develop.'],
    ['competition', 'She won the spelling ___.', 'a contest', 'compete → competition: e changes to i.'],
    ['explanation', 'Write an ___ of how a volcano erupts.', 'something that makes a thing clear', 'explain loses its i: ex-plan-a-tion.'],
    ['pronunciation', 'Check the ___ of this word.', 'the way a word is said', 'pronounce loses its o: pro-nun-ci-a-tion.'],
  ],
  'Tricky words A–F': [
    ['achieve', 'If you practise, you will ___ your goal.', 'to succeed in doing something', 'i before e: ach-ieve.'],
    ['ancient', 'We visited an ___ castle.', 'very old', 'ci sounds like “sh”: an-cient.'],
    ['available', 'Tickets are ___ online.', 'able to be used or got', 'avail + able.'],
    ['awkward', 'There was an ___ silence.', 'uncomfortable or clumsy', 'Two w’s: awk-ward.'],
    ['bruise', 'I have a purple ___ on my knee.', 'a mark on the skin after a knock', 'ui: br-ui-se.'],
    ['controversy', 'The new rule caused a lot of ___.', 'strong public disagreement', 'contro + versy.'],
    ['criticise', 'It is easy to ___ but harder to help.', 'to point out faults', 'critic + ise.'],
    ['determined', 'She was ___ to finish the race.', 'having firmly decided', 'deter + mined.'],
    ['equipment', 'Put the PE ___ away.', 'the things needed for an activity', 'equip + ment (no double p here).'],
    ['especially', 'I love fruit, ___ strawberries.', 'more than usual; in particular', 'e + special + ly.'],
    ['familiar', 'That voice sounds ___.', 'well known', 'family → familiar: ends -iar.'],
    ['forty', 'There are ___ children in the choir.', 'the number 40', 'No u: four → forty.'],
  ],
  'Tricky words I–V': [
    ['identity', 'The spy kept her ___ secret.', 'who someone is', 'i-den-ti-ty.'],
    ['individual', 'Each ___ has a locker.', 'a single person', 'in-di-vid-u-al.'],
    ['language', 'French is a beautiful ___.', 'a system of words people use to communicate', 'lang + u + age.'],
    ['neighbour', 'Our ___ has a cat called Biscuit.', 'someone who lives next door', 'eigh + bour.'],
    ['persuade', 'Can you ___ your mum to let us go?', 'to make someone agree', 'per + suade.'],
    ['physical', 'Running is good ___ exercise.', 'to do with the body', 'ph sounds like f: phys-i-cal.'],
    ['profession', 'Nursing is a caring ___.', 'a job that needs special training', 'One f, double s.'],
    ['recognise', 'I didn’t ___ you with your new haircut.', 'to know someone or something again', 're + cog + nise.'],
    ['shoulder', 'The parrot sat on the pirate’s ___.', 'the joint between the arm and neck', 'ou: sh-oul-der.'],
    ['signature', 'Write your ___ at the bottom.', 'your name written in your own way', 'sign + ature: keep the g.'],
    ['sincere', 'Please accept my ___ apologies.', 'honest and meant', 'sin + cere. Sincerely keeps the e.'],
    ['symbol', 'The dove is a ___ of peace.', 'a sign that stands for something', 'y not i: sym-bol.'],
    ['system', 'The solar ___ has eight planets.', 'a set of parts that work together', 'y not i: sys-tem.'],
    ['variety', 'The shop sells a ___ of sweets.', 'a range of different things', 'vari + ety.'],
    ['vehicle', 'A tractor is a farm ___.', 'something used for carrying people or goods', 'Silent h: ve-hi-cle.'],
  ],
};

// ---------------------------------------------------------------------------
// Tier 2 academic vocabulary: [word, definition, example sentence, distractor words]
const TIER2 = {
  'Words for reading and analysis': [
    ['infer', 'to work something out from clues rather than being told directly', 'From his muddy boots, we can infer that he walked across the field.'],
    ['imply', 'to suggest something without saying it directly', 'The writer implies that the house is haunted.'],
    ['convey', 'to communicate an idea or feeling', 'The dark colours convey a gloomy mood.'],
    ['analyse', 'to examine something in detail to understand it', 'Analyse how the poet creates tension.'],
    ['interpret', 'to explain what you think something means', 'Readers interpret the ending in different ways.'],
    ['evidence', 'facts or quotations that support an idea', 'Use evidence from the text to back up your point.'],
    ['explicit', 'stated clearly and directly', 'The rules are explicit: no phones in class.'],
    ['implicit', 'suggested but not stated directly', 'There is an implicit threat in her words.'],
    ['atmosphere', 'the mood or feeling of a place in a story', 'The fog creates a tense atmosphere.'],
    ['tone', 'the attitude or feeling in a piece of writing', 'The tone of the letter is angry.'],
    ['theme', 'a big idea that a story explores', 'Friendship is a theme in the novel.'],
    ['perspective', 'a particular point of view', 'The story is told from the dog’s perspective.'],
    ['contrast', 'a clear difference between two things placed side by side', 'The poet contrasts the busy city with the quiet countryside.'],
    ['emphasise', 'to give special importance to something', 'The short sentence emphasises her shock.'],
    ['structure', 'the way a text is organised and put together', 'The structure moves from past to present.'],
    ['summarise', 'to give the main points briefly', 'Summarise the chapter in three sentences.'],
  ],
  'Words for thinking and arguing': [
    ['significance', 'how important something is and why', 'Explain the significance of the Battle of Hastings.'],
    ['consequence', 'a result or effect of an action', 'One consequence of the flood was that crops were ruined.'],
    ['evaluate', 'to judge how good, important or true something is', 'Evaluate how far the plan succeeded.'],
    ['justify', 'to give reasons for a decision or opinion', 'Justify your answer with evidence.'],
    ['conclude', 'to reach a final decision after thinking', 'We can conclude that the plant needs light.'],
    ['factor', 'one of several things that cause a result', 'Weather was one factor in the defeat.'],
    ['reliable', 'able to be trusted', 'Is this source reliable?'],
    ['bias', 'an unfair preference for one side', 'The report shows bias towards the home team.'],
    ['context', 'the situation or background that helps explain something', 'In the context of the war, food was scarce.'],
    ['hypothesis', 'an idea that can be tested by an experiment', 'My hypothesis is that warm water dissolves sugar faster.'],
    ['accurate', 'correct and exact', 'Make accurate measurements with the ruler.'],
    ['impact', 'a strong effect on something', 'The railway had a huge impact on towns.'],
    ['compare', 'to look at how things are similar and different', 'Compare the two poems.'],
    ['argue', 'to give reasons why something is true', 'Some historians argue that the Normans brought great change.'],
  ],
};

// ---------------------------------------------------------------------------
// Morphology: [part, meaning, examples, distractor meanings]
const MORPH = {
  'Prefixes': [
    ['un-', 'not', 'unhappy, unfair', ['again', 'before', 'under']],
    ['dis-', 'not, or the opposite of', 'disagree, disappear', ['again, or once more', 'across or beyond', 'half of something']],
    ['mis-', 'wrongly or badly', 'misspell, misunderstand', ['again or back', 'many or much', 'small or little']],
    ['re-', 'again or back', 'rebuild, return', ['not', 'before', 'against']],
    ['pre-', 'before', 'preview, prehistoric', ['after', 'again', 'not']],
    ['sub-', 'under or below', 'submarine, subway', ['above or over', 'across or through', 'by itself']],
    ['inter-', 'between', 'international, interrupt', ['inside', 'under', 'against']],
    ['super-', 'above or more than', 'superstar, supermarket', ['under or less than', 'between two things', 'not, or the opposite']],
    ['anti-', 'against', 'antiseptic, antisocial', ['before', 'self', 'between']],
    ['auto-', 'self', 'autobiography, automatic', ['far', 'against', 'two']],
    ['trans-', 'across', 'transport, transatlantic', ['under', 'again', 'self']],
    ['tele-', 'far away', 'telephone, telescope', ['very small', 'by itself', 'sound or voice']],
    ['bi-', 'two', 'bicycle, bilingual', ['three', 'half', 'many']],
    ['micro-', 'very small', 'microscope, microchip', ['far', 'large', 'sound']],
  ],
  'Latin and Greek roots': [
    ['port', 'carry', 'transport, portable, export', ['break', 'look', 'write']],
    ['scrib / script', 'write', 'describe, manuscript', ['say', 'carry', 'hear']],
    ['spect', 'look', 'inspect, spectator', ['hear', 'build', 'carry']],
    ['dict', 'say or speak', 'dictionary, predict, contradict', ['write', 'look', 'break']],
    ['rupt', 'break', 'erupt, interrupt, disrupt', ['carry', 'build', 'turn']],
    ['struct', 'build', 'construct, structure', ['break', 'say', 'pull']],
    ['aud', 'hear', 'audience, audible', ['see', 'speak', 'write']],
    ['vis / vid', 'see', 'visible, video', ['hear', 'carry', 'live']],
    ['graph', 'write or draw', 'autograph, paragraph', ['sound or voice', 'earth or land', 'time']],
    ['phon', 'sound', 'telephone, phonics', ['light', 'life', 'write']],
    ['geo', 'earth', 'geography, geology', ['life', 'water', 'time']],
    ['bio', 'life', 'biology, biography', ['earth', 'light', 'sound']],
    ['chron', 'time', 'chronological, chronicle', ['earth', 'sound', 'life']],
    ['aqua', 'water', 'aquarium, aquatic', ['air', 'earth', 'fire']],
  ],
};

// ---------------------------------------------------------------------------
// Literary and rhetorical techniques (Year 7 analysis vocabulary)
const TECHNIQUES = [
  ['The classroom was a zoo.', 'metaphor', 'It says the classroom IS a zoo rather than LIKE one, so it is a metaphor.'],
  ['Her smile was as bright as the sun.', 'simile', 'It compares using “as … as”, so it is a simile.'],
  ['The wind howled angrily through the trees.', 'personification', 'Wind can’t really be angry or howl like a creature; giving it human feelings is personification.'],
  ['Seven slippery snakes slid silently.', 'alliteration', 'Several nearby words start with the same sound (s).'],
  ['Splash! Crash! Bang!', 'onomatopoeia', 'The words sound like the noises they describe.'],
  ['Do we really want our parks covered in litter?', 'rhetorical question', 'It is asked for effect, not to get an answer.'],
  ['It was cold, dark and silent.', 'rule of three', 'Three adjectives in a row make a memorable pattern.'],
  ['I’ve told you a million times!', 'hyperbole', 'It is a huge exaggeration for effect.'],
  ['Innocent puppies are being abandoned every single day.', 'emotive language', 'Words like “innocent” and “abandoned” are chosen to make the reader feel sad or angry.'],
  ['The leaves danced in the breeze.', 'personification', 'Leaves can’t dance; it gives them a human action.'],
  ['The fog was a grey blanket over the town.', 'metaphor', 'It says the fog IS a blanket, so it is a metaphor.'],
  ['He ran like a cheetah.', 'simile', 'It compares using “like”, so it is a simile.'],
];
const TECH_NAMES = ['simile', 'metaphor', 'personification', 'alliteration', 'onomatopoeia', 'rhetorical question', 'rule of three', 'hyperbole', 'emotive language'];

// ---------------------------------------------------------------------------
// Punctuation for effect (Year 6 greater-depth descriptors)
const PUNCT = [
  {
    prompt: 'Which sentence uses a semi-colon correctly?',
    options: [
      ['The rain fell; the river burst its banks.', true],
      ['The rain fell all night; the river.', false, 'A semi-colon must join two complete clauses. “The river” is not a complete clause.'],
      ['I bought three kinds of fruit; apples and pears.', false, 'To introduce a list, use a colon, not a semi-colon.'],
      ['Because it rained all night; we stayed in.', false, '“Because it rained all night” cannot stand alone, so a semi-colon cannot follow it. Use a comma.'],
    ],
    explain: 'A semi-colon joins two closely linked main clauses that could each be a sentence.',
  },
  {
    prompt: 'Which sentence uses a colon correctly?',
    options: [
      ['You will need: a torch, a map and a coat.', false, 'The part before a colon should be a complete clause. “You will need” is not complete on its own.'],
      ['You need three things: a torch, a map and a coat.', true],
      ['I like: swimming, cycling and running.', false, 'A colon after “I like” breaks the sentence; no punctuation is needed there.'],
      ['The old dog: barked loudly at the postman.', false, 'A colon cannot split the subject from its verb.'],
    ],
    explain: 'A colon comes after a complete clause and introduces a list, an example or an explanation.',
  },
  {
    prompt: 'Which sentence uses brackets for parenthesis correctly?',
    options: [
      ['My uncle (who lives in Wales) keeps bees.', true],
      ['My uncle who (lives in Wales) keeps bees.', false, 'The brackets must go round the whole extra information, including “who”.'],
      ['(My uncle) who lives in Wales keeps bees.', false, 'The main sentence must still make sense without the bracketed part.'],
      ['My uncle who lives (in Wales keeps bees).', false, 'Taking out the brackets here would leave “My uncle who lives”, which does not make sense.'],
    ],
    explain: 'Parenthesis adds extra information. The sentence must still make sense if you remove it.',
  },
  {
    prompt: 'Which sentence uses dashes for parenthesis correctly?',
    options: [
      ['The castle – built over 800 years ago – still stands.', true],
      ['The castle built – over 800 years ago still stands.', false, 'Dashes for parenthesis come in a pair, round the extra information.'],
      ['The – castle built over 800 years ago – still stands.', false, 'Removing the dashed part leaves “The still stands”, which makes no sense.'],
      ['The castle built over 800 years – ago still stands.', false, 'A single dash in the middle of a phrase breaks it.'],
    ],
    explain: 'A pair of dashes works like brackets: the sentence makes sense without the part between them.',
  },
  {
    prompt: 'Which sentence is in the passive voice?',
    options: [
      ['The window was smashed by a football.', true],
      ['A football smashed the window.', false, 'Here the thing doing the action (the football) comes first. That is the active voice.'],
      ['The football is smashing.', false, 'This is active, and it is not about the window at all.'],
      ['Smash the window!', false, 'This is a command (imperative), not passive.'],
    ],
    explain: 'In the passive voice the thing that the action happens to comes first: “The window was smashed (by …)”.',
  },
  {
    prompt: 'Which sentence uses the subjunctive form?',
    options: [
      ['If I were you, I would apologise.', true],
      ['If I was you, I would apologise.', false, 'In formal writing, use “were” after “If I …” for something imagined. This is the subjunctive.'],
      ['I was you yesterday.', false, 'This sentence does not make sense and has no subjunctive.'],
      ['When I am you, I apologise.', false, 'This is not the subjunctive.'],
    ],
    explain: 'The subjunctive is used in formal writing for wishes or imagined situations: “If I were…”, “I insist that he be…”.',
  },
  {
    prompt: 'Which sentence is the most formal?',
    options: [
      ['We regret to inform you that the event has been cancelled.', true],
      ['Sorry, the event’s off, so don’t bother coming!', false, 'Contractions (“event’s”) and exclamations are informal.'],
      ['The event is totally not happening, sorry.', false, '“Totally” and “sorry” are chatty and informal.'],
      ['Guess what? There’s no event after all, folks.', false, 'Questions like “Guess what?”, contractions and “folks” are very casual.'],
    ],
    explain: 'Formal writing avoids contractions and chatty words, and often uses the passive voice.',
  },
  {
    prompt: 'Which sentence uses a hyphen to avoid ambiguity?',
    options: [
      ['I saw a man-eating shark.', true],
      ['I saw a man eating shark.', false, 'Without a hyphen this could mean a man was eating shark!'],
      ['I saw a man – eating shark.', false, 'A dash is not a hyphen and changes the meaning.'],
      ['I saw a man eating-shark.', false, 'The hyphen must join “man” and “eating”.'],
    ],
    explain: 'A hyphen joins words to show they work together as one description: “man-eating”.',
  },
  {
    prompt: 'Which sentence uses a relative clause?',
    options: [
      ['The boy who won the race was beaming.', true],
      ['The boy won the race and was beaming.', false, 'This joins two clauses with “and”. A relative clause starts with who, which, that, whose, where or when.'],
      ['The beaming boy won.', false, 'This has an adjective, not a relative clause.'],
      ['Winning the race, the boy beamed.', false, 'This starts with a fronted non-finite clause, not a relative clause.'],
    ],
    explain: 'A relative clause adds information about a noun and starts with a relative pronoun such as who, which, that or whose.',
  },
  {
    prompt: 'Which sentence uses a modal verb to show possibility?',
    options: [
      ['It might snow tomorrow.', true],
      ['It snowed yesterday.', false, 'This states a fact in the past; there is no modal verb.'],
      ['It is snowing.', false, 'This is the present progressive, not a modal verb.'],
      ['Snow falls in winter.', false, 'This states a general fact.'],
    ],
    explain: 'Modal verbs (might, could, should, will, must, may, can, would) show how likely or necessary something is.',
  },
];

// ---------------------------------------------------------------------------
// Sentence-writing tasks (checked by rules; the model shows one good answer).
const SENTENCES = [
  {
    id: 'sent.relative-who', title: 'Add a relative clause',
    prompt: 'Combine into ONE sentence using “who”: My grandma lives in Cornwall. My grandma makes amazing pasties.',
    checks: [{ type: 'includesAll', words: ['who'], msg: 'Use “who” to join the sentences.' }, { type: 'includesAny', words: ['pasties'], msg: 'Keep the information about the pasties.' }, { type: 'includesAny', words: ['cornwall'], msg: 'Keep the information about Cornwall.' }, { type: 'maxSentences', n: 1 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'My grandma, who lives in Cornwall, makes amazing pasties.',
    tip: 'Put the extra information straight after the noun it describes, between commas.',
  },
  {
    id: 'sent.relative-which', title: 'Relative clause with “which”',
    prompt: 'Combine into ONE sentence using “which”: The volcano erupted in 1980. The volcano is in the USA.',
    checks: [{ type: 'includesAll', words: ['which'], msg: 'Use “which” to join the sentences.' }, { type: 'includesAll', words: ['1980'], msg: 'Keep the date.' }, { type: 'includesAny', words: ['usa'], msg: 'Keep where the volcano is.' }, { type: 'maxSentences', n: 1 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'The volcano, which is in the USA, erupted in 1980.',
    tip: 'Use “which” for things and “who” for people.',
  },
  {
    id: 'sent.semicolon', title: 'Join with a semi-colon',
    prompt: 'Join these two sentences with a semi-colon: The bell rang. Everyone rushed outside.',
    checks: [{ type: 'regex', pattern: '[a-z]; [a-z]', flags: 'i', msg: 'Put a semi-colon (;) between the two clauses, followed by a space.' }, { type: 'regex', pattern: ';\\s*everyone', flags: '', msg: 'After a semi-colon, carry on with a lower-case letter: “; everyone…”.' }, { type: 'maxSentences', n: 1 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'The bell rang; everyone rushed outside.',
    tip: 'A semi-colon joins two closely linked complete clauses. No capital letter after it.',
  },
  {
    id: 'sent.colon-list', title: 'Colon to introduce a list',
    prompt: 'Write a sentence that uses a colon to introduce a list of three things you would pack for a camping trip.',
    checks: [{ type: 'regex', pattern: '[a-z]: ', flags: 'i', msg: 'Use a colon (:) after a complete clause, then the list.' }, { type: 'regex', pattern: ',[^,]+ (and|or) ', flags: 'i', msg: 'Separate list items with commas and put “and” before the last one.' }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'I would pack three things: a tent, a torch and a sleeping bag.',
    tip: 'The part before the colon should make sense on its own.',
  },
  {
    id: 'sent.fronted-adverbial', title: 'Fronted adverbial',
    prompt: 'Rewrite so it starts with the adverbial and uses a comma: The fox crept across the garden as the sun went down.',
    checks: [{ type: 'regex', pattern: '^As the sun went down, ', flags: 'i', msg: 'Start with “As the sun went down,” followed by a comma.' }, { type: 'includesAll', words: ['fox', 'crept', 'garden'], msg: 'Keep the rest of the sentence.' }, { type: 'endPunct' }],
    model: 'As the sun went down, the fox crept across the garden.',
    tip: 'When the adverbial comes first, put a comma after it.',
  },
  {
    id: 'sent.passive', title: 'Active to passive',
    prompt: 'Rewrite in the passive voice: The dog chewed the slipper.',
    checks: [{ type: 'regex', pattern: '^The slipper was chewed', flags: 'i', msg: 'Start with the thing the action happened to: “The slipper was chewed…”.' }, { type: 'includesAny', words: ['by the dog'], msg: 'Add who did it: “by the dog”.' }, { type: 'endPunct' }],
    model: 'The slipper was chewed by the dog.',
    tip: 'Passive: thing affected + was/were + past participle (+ by whoever did it).',
  },
  {
    id: 'sent.parenthesis-brackets', title: 'Parenthesis with brackets',
    prompt: 'Add extra information in brackets to this sentence: The Thames flows through London. (Extra info: the longest river entirely in England)',
    checks: [{ type: 'regex', pattern: '\\([^)]+\\)', flags: '', msg: 'Put the extra information inside brackets ( ).' }, { type: 'includesAll', words: ['longest'], msg: 'Include the extra information about it being the longest river.' }, { type: 'regex', pattern: '^The Thames \\(', flags: 'i', msg: 'Put the brackets straight after “The Thames”.' }, { type: 'endPunct' }],
    model: 'The Thames (the longest river entirely in England) flows through London.',
    tip: 'Read it without the brackets: it should still make sense.',
  },
  {
    id: 'sent.parenthesis-dashes', title: 'Parenthesis with dashes',
    prompt: 'Add “a fearless explorer” as parenthesis using a pair of dashes: Ernest Shackleton led an expedition to Antarctica.',
    checks: [{ type: 'regex', pattern: 'Shackleton\\s*[–-]\\s*a fearless explorer\\s*[–-]\\s*led', flags: 'i', msg: 'Put “– a fearless explorer –” between “Shackleton” and “led”, with a dash on each side.' }, { type: 'endPunct' }, { type: 'capital' }],
    model: 'Ernest Shackleton – a fearless explorer – led an expedition to Antarctica.',
    tip: 'Dashes for parenthesis always come in a pair.',
  },
  {
    id: 'sent.formal', title: 'Make it formal',
    prompt: 'Rewrite formally, with no contractions or chatty words: Hey, we can’t come to the meeting, sorry!',
    checks: [{ type: 'notRegex', pattern: '\\b(hey|sorry|can’t|can\'t|won’t|won\'t)\\b', flags: 'i', msg: 'Remove informal words and contractions (hey, sorry, can’t).' }, { type: 'includesAny', words: ['unable', 'cannot', 'regret', 'unfortunately', 'apologise'], msg: 'Use formal words such as “unable”, “regret” or “unfortunately”.' }, { type: 'includesAny', words: ['meeting'], msg: 'Keep what you are writing about: the meeting.' }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'Unfortunately, we are unable to attend the meeting.',
    tip: 'Formal: full forms (cannot), polite phrases, no exclamation marks.',
  },
  {
    id: 'sent.modal', title: 'Modal verbs for possibility',
    prompt: 'Write a sentence predicting what might happen in a story, using a modal verb (might, could, may, would or should).',
    checks: [{ type: 'includesAny', words: ['might', 'could', 'may', 'would', 'should', 'will'], msg: 'Include a modal verb such as might, could or may.' }, { type: 'minWords', n: 6 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'The mysterious key might open the locked door in the cellar.',
    tip: 'Modal verbs show how certain you are.',
  },
  {
    id: 'sent.because-although', title: 'Subordinate clause with “although”',
    prompt: 'Combine into ONE sentence starting with “Although”: It was raining. We went for a walk.',
    checks: [{ type: 'regex', pattern: '^Although ', flags: 'i', msg: 'Start with “Although”.' }, { type: 'regex', pattern: 'raining, ', flags: 'i', msg: 'Put a comma after the “although” clause.' }, { type: 'includesAll', words: ['walk'], msg: 'Keep the walk.' }, { type: 'maxSentences', n: 1 }, { type: 'endPunct' }],
    model: 'Although it was raining, we went for a walk.',
    tip: 'When a subordinate clause comes first, add a comma after it.',
  },
  {
    id: 'sent.expanded-noun', title: 'Expanded noun phrase',
    prompt: 'Expand “the house” into a noun phrase of at least five words with two adjectives and a prepositional phrase, then use it in a sentence.',
    checks: [{ type: 'regex', pattern: '\\b(on|in|at|by|near|beside|behind|under|over|with|beyond|across)\\b', flags: 'i', msg: 'Add a prepositional phrase (e.g. “on the hill”).' }, { type: 'includesAny', words: ['house'], msg: 'Keep “house” in your noun phrase.' }, { type: 'regex', pattern: '\\w+,? \\w+ house', flags: 'i', msg: 'Put adjectives before “house”.' }, { type: 'minWords', n: 7 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'The crumbling, silent house on the hill watched us.',
    tip: 'Determiner + adjectives + noun + prepositional phrase.',
  },
  {
    id: 'sent.cohesion', title: 'Cohesive adverbial',
    prompt: 'Write a second sentence that begins with a cohesive adverbial (e.g. However, As a result, Meanwhile, Furthermore). First sentence: The bridge was closed for repairs.',
    checks: [{ type: 'regex', pattern: '^(However|As a result|Meanwhile|Furthermore|Consequently|Therefore|Nevertheless|In addition|On the other hand|Because of this),', flags: 'i', msg: 'Start with an adverbial such as “As a result,” followed by a comma.' }, { type: 'minWords', n: 5 }, { type: 'endPunct' }],
    model: 'As a result, drivers had to take a long detour.',
    tip: 'Cohesive adverbials link ideas between sentences and paragraphs.',
  },
  {
    id: 'sent.show-not-tell', title: 'Show, don’t tell',
    prompt: 'Instead of writing “Sam was scared”, write a sentence that SHOWS Sam was scared through actions or body language. Don’t use “scared”, “afraid” or “frightened”.',
    checks: [{ type: 'excludes', words: ['scared', 'afraid', 'frightened', 'fear'], msg: 'Don’t name the feeling. Show it through what Sam does.' }, { type: 'includesAny', words: ['sam', 'his', 'her', 'their'], msg: 'Write about Sam.' }, { type: 'minWords', n: 8 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'Sam’s hands trembled as he edged towards the creaking door.',
    tip: 'Think about hands, breathing, voice, eyes and movement.',
  },
  {
    id: 'sent.analytical', title: 'Analytical sentence',
    prompt: 'Write a sentence explaining the effect of this phrase: “the icy fingers of the wind”. Use the word “suggests” or “conveys”.',
    checks: [{ type: 'includesAny', words: ['suggests', 'conveys', 'implies', 'shows'], msg: 'Use an analysis verb such as “suggests” or “conveys”.' }, { type: 'includesAny', words: ['personification', 'metaphor', 'fingers', 'icy'], msg: 'Refer to the words or the technique used.' }, { type: 'minWords', n: 10 }, { type: 'capital' }, { type: 'endPunct' }],
    model: 'The personification of “icy fingers” suggests the wind is grasping and cruel, as if it wants to hurt people.',
    tip: 'Name the technique, quote the words, then explain the effect on the reader.',
  },
  {
    id: 'sent.speech', title: 'Punctuate direct speech',
    prompt: 'Write this as direct speech with correct punctuation: Mia asked where the treasure was hidden.',
    checks: [{ type: 'regex', pattern: '[“"][A-Z][^”"]*\\?[”"]', flags: '', msg: 'Put Mia’s exact words in speech marks, starting with a capital and ending with a question mark inside the speech marks.' }, { type: 'includesAny', words: ['asked', 'mia'], msg: 'Say who is speaking (Mia asked…).' }, { type: 'endPunct' }],
    model: '“Where is the treasure hidden?” asked Mia.',
    tip: 'The question mark goes inside the speech marks.',
  },
];

// ---------------------------------------------------------------------------

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function spellingDeck() {
  const topics = [], items = [];
  Object.entries(SPELLINGS).forEach(([title, words], i) => {
    const id = `english.spell-${i + 1}`;
    topics.push({
      id, title: `Spelling: ${title}`, kind: 'facts', prereqs: [], batch: 5,
      intro: 'These words are on the official Year 5 and 6 list. For each one, notice the tricky part, then cover it and write it from memory.',
      teach: 'Pick one word from today and explain its tricky part.',
      talk: 'Ask her to spell one of this week’s words and say what the tricky part is.',
    });
    for (const [word, sentence, clue, tricky] of words) {
      items.push({ id: `english.sp.${word}`, topic: id, kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` });
    }
  });
  return { subject: 'english', deck: 'spelling', topics, items };
}

function vocabDeck() {
  const topics = [], items = [];
  Object.entries(TIER2).forEach(([title, words], i) => {
    const id = `english.vocab-${i + 1}`;
    topics.push({ id, title, kind: 'facts', prereqs: [], teach: 'Use one of today’s words in a sentence about something you’re reading.', talk: 'Use one of her new words at dinner and see if she notices.' });
    for (const [word, def, example] of words) {
      items.push({
        id: `english.v.${word}`, topic: id, kind: 'fact', prompt: `Which word means “${def}”?`, answer: word, strict: true,
        explain: `**${word}**: ${def}. Example: ${example}`, learn: `**${word}** means ${def}.\n\n_${example}_`,
      });
    }
  });
  return { subject: 'english', deck: 'vocabulary', topics, items };
}

function morphDeck() {
  const topics = [], items = [];
  Object.entries(MORPH).forEach(([title, parts], i) => {
    const id = `english.morph-${i + 1}`;
    topics.push({ id, title: `Word parts: ${title}`, kind: 'facts', prereqs: i ? ['english.morph-1'] : [], teach: 'Explain how knowing one word part helps you work out a new word.', talk: 'Ask her what “tele” means, and to name three words that use it.' });
    for (const [part, meaning, examples, wrong] of parts) {
      items.push({
        id: `english.m.${slug(part)}`, topic: id, kind: 'fact', prompt: `What does “${part}” mean (as in ${examples})?`, answer: meaning, distractors: wrong,
        formats: ['choice'], explain: `“${part}” means ${meaning}: ${examples}.`, learn: `**${part}** means **${meaning}**. Examples: ${examples}.`,
      });
    }
  });
  return { subject: 'english', deck: 'morphology', topics, items };
}

function techniqueDeck() {
  const id = 'english.techniques';
  const items = TECHNIQUES.map(([quote, tech, why], i) => ({
    id: `english.tech.${i + 1}`, topic: id, kind: 'mcq', prompt: `Which technique is used here? “${quote}”`,
    options: [tech, ...TECH_NAMES.filter((t) => t !== tech).sort((a, b) => (a.length * 7 + i) % 5 - (b.length * 7 + i) % 5).slice(0, 3)].map((t) => ({ text: t, correct: t === tech })),
    explain: why,
  }));
  const punct = PUNCT.map((p, i) => ({
    id: `english.punct.${i + 1}`, topic: 'english.punctuation', kind: 'mcq', prompt: p.prompt,
    options: p.options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain: p.explain,
  }));
  return {
    subject: 'english', deck: 'writing',
    topics: [
      { id, title: 'Spotting writers’ techniques', kind: 'facts', prereqs: [], batch: 6, intro: 'Writers choose techniques to create effects. In Year 7 you will name the technique AND explain its effect on the reader.', teach: 'Explain the difference between a simile and a metaphor.', talk: 'Ask her to spot a simile or metaphor in a song lyric or advert.' },
      { id: 'english.punctuation', title: 'Punctuation for effect', kind: 'facts', prereqs: [], batch: 5, diagnostic: ['english.punct.1', 'english.punct.2'], intro: 'Greater-depth writers use semi-colons, colons, dashes and brackets precisely. Let’s check what you already know.', teach: 'Explain when to use a colon and when to use a semi-colon.', talk: 'Ask her to find a semi-colon in a book and explain why it is there.' },
    ],
    items: [...items, ...punct],
    sentences: SENTENCES,
  };
}

export default [spellingDeck(), vocabDeck(), morphDeck(), techniqueDeck()];

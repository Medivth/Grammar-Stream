// Joined-up (synoptic) topics: maths and English used inside geography, history and science.
// A topic's `links` names the other subjects it draws on (shown as "Geography + Maths").
// A template's `credits` names the maths topics it also practises: answers count towards
// those topics' mastery as well, because using a skill in a new setting is real evidence.

const mk = (subject) => ({
  fact: (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `${subject}.${id}`, topic: `${subject}.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra }),
  mcq: (id, topic, prompt, options, explain, extra = {}) => ({
    id: `${subject}.${id}`, topic: `${subject}.${topic}`, kind: 'mcq', prompt,
    options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
  }),
  tmpl: (id, topic, gen, seed, extra = {}) => ({ id: `${subject}.${id}`, topic: `${subject}.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed, ...extra }),
});
const choiceOnly = { formats: ['choice'] };

// --- maths: averages ---------------------------------------------------------
const M = mk('maths');
const maths = {
  subject: 'maths', deck: 'averages',
  topics: [
    { id: 'maths.averages', title: 'Averages and range', kind: 'mixed', prereqs: ['maths.negatives'], batch: 5, intro: 'An average is one number that sums up a whole set of data. Geographers, scientists and historians all use them, so this skill turns up everywhere.', teach: 'Explain the difference between the mean and the median.', talk: 'Ask her the mean of everyone’s ages at the table.' },
  ],
  items: [
    M.tmpl('av.calc', 'averages', 'averages', [-1, 0, 1]),
    M.fact('av.median', 'averages', 'Which average is the middle value when the data is put in order?', 'the median', ['the mean', 'the mode', 'the range'], 'Median sounds like “medium”: the middle one.', { accept: ['median'] }),
    M.fact('av.mode', 'averages', 'Which average is the value that appears most often?', 'the mode', ['the mean', 'the median', 'the range'], 'Mode sounds like “most”: the most common value.', { accept: ['mode'] }),
    M.fact('av.mean', 'averages', 'To find the mean, you add up all the values and then…', 'divide by how many there are', ['take away the smallest one', 'pick the one in the middle', 'divide by the largest value'], 'Mean = total ÷ number of values. It shares the total out equally.', choiceOnly),
    M.fact('av.range', 'averages', 'What does the range of a set of data tell you?', 'how spread out the data is', ['the typical value', 'the most common value', 'the total of the data'], 'Range = largest − smallest. A big range means the data is spread out.', choiceOnly),
    M.fact('av.mode-q', 'averages', 'What is the mode of 3, 7, 7, 2, 9?', '7', ['5.6', '2', '9'], '7 appears twice; every other number appears once. (5.6 is the mean.)'),
    M.fact('av.even', 'averages', 'What is the median of 4, 6, 8, 10?', '7', ['6', '8', '28'], 'With an even number of values there are two middle ones (6 and 8). The median is halfway between them: 7.'),
  ],
};

// --- geography + maths -------------------------------------------------------
const G = mk('geography');
const EARNINGS = { passage: 'Weekly earnings of five households on one street:\n£400   £420   £450   £480   £2,250', passageSource: 'Invented data' };
const ISLANDS = { passage: 'Island A: 1,200 people, area 40 km²\nIsland B: 900 people, area 10 km²', passageSource: 'Invented data' };
const RAIN = { passage: 'Rainfall (mm) in a coastal town\nJan 110 · Feb 95 · Mar 70 · Apr 40 · May 20 · Jun 5\nJul 2 · Aug 5 · Sep 25 · Oct 70 · Nov 100 · Dec 120', passageSource: 'Invented data' };
const JULY = { passage: 'Midday temperature (°C) in a UK town, one week in July\nMon 21 · Tue 23 · Wed 22 · Thu 4 · Fri 24 · Sat 22 · Sun 23', passageSource: 'Invented data' };
const geography = {
  subject: 'geography', deck: 'by-numbers',
  topics: [
    { id: 'geography.by-numbers', title: 'Geography by numbers', kind: 'mixed', prereqs: ['geography.people', 'maths.averages'], links: ['maths'], batch: 5, intro: 'Geographers use maths to compare places: average earnings, rainfall, population density and growth. Your maths skills do the work here.', teach: 'Explain what population density means and how to work it out.', talk: 'Ask her whether a village or a city has a higher population density, and why.' },
  ],
  items: [
    G.tmpl('gn.stats', 'by-numbers', 'geoStats', [-0.8, 0, 0.8], { credits: ['maths.averages', 'maths.percent'] }),
    G.mcq('gn.median', 'by-numbers', 'The mean of these earnings is £800 but the median is £450. Which average better describes a typical household?', [['The median: one high earner pulls the mean up', true], ['The mean, because it uses every number', false, 'Using every number is usually a strength, but here one household (£2,250) drags the mean far above what four of the five households earn.'], ['Neither: you cannot average sums of money', false, 'You can! Geographers and governments average earnings all the time.']], 'When one value is far bigger than the rest, the median gives a fairer picture of a typical household. That is why average earnings in a country are usually reported as a median.', EARNINGS),
    G.mcq('gn.density', 'by-numbers', 'Which island is more densely populated?', [['Island B', true], ['Island A', false, 'A has more people, but they are spread over four times the area. A: 1,200 ÷ 40 = 30 people per km².'], ['They are the same', false, 'Work out people ÷ area for each one.']], 'Population density = people ÷ area. A: 1,200 ÷ 40 = 30 per km². B: 900 ÷ 10 = 90 per km², three times as crowded.', ISLANDS),
    G.mcq('gn.climate', 'by-numbers', 'What pattern does this rainfall data show?', [['Wet winters and very dry summers', true], ['Rain spread evenly through the year', false, 'Look at the numbers: 120 mm in December but only 2 mm in July.'], ['Dry winters and wet summers', false, 'Check which months are which: the big numbers are November to February.']], 'This pattern is typical of a Mediterranean climate, like southern Spain or Greece: hot, dry summers and mild, wet winters.', RAIN),
    G.mcq('gn.anomaly', 'by-numbers', 'Which reading is most likely a mistake?', [['Thursday’s 4°C', true], ['Friday’s 24°C, the highest', false, 'The highest value isn’t automatically wrong: 24°C is normal for July.'], ['None: all weather data is correct', false, 'Instruments and people make mistakes. Results that don’t fit the pattern should be checked.']], '4°C at midday in a UK July is almost impossible. Like an anomaly in a science experiment, it should be checked, and left out of the mean if it was a mistake.', JULY),
    G.fact('gn.survey', 'by-numbers', 'In a survey of 200 people in a town, 50 travel to work by bus. What percentage is that?', '25%', ['50%', '20%', '40%'], '50 out of 200 = 50 ÷ 200 = 0.25 = 25%.', choiceOnly),
    G.fact('gn.urban', 'by-numbers', 'In a country, 4 out of every 5 people live in towns and cities. What fraction live in the countryside?', '1/5', ['4/5', '1/4', '5/4'], 'The fractions must add up to one whole: 1 − 4/5 = 1/5. The UK is a bit more urban than this: over 80% of people live in towns and cities.', choiceOnly),
  ],
};

// --- history + maths, history + English ---------------------------------------
const H = mk('history');
const CHRONICLE = { passage: 'This year came dreadful fore-warnings over the land of the Northumbrians, terrifying the people most woefully: these were immense sheets of light rushing through the air, and whirlwinds, and fiery dragons flying across the firmament. These tremendous tokens were soon followed by a great famine: and not long after, … the harrowing inroads of heathen men made lamentable havoc in the church of God in Holy-island, by rapine and slaughter.', passageSource: 'The Anglo-Saxon Chronicle, entry for AD 793, written by monks (translated by James Ingram, 1823). Holy-island is Lindisfarne.' };
const TILBURY = { passage: 'I know I have the body of a weak and feeble woman; but I have the heart and stomach of a king, and of a king of England too, and think foul scorn that Parma or Spain, or any prince of Europe, should dare to invade the borders of my realm.', passageSource: 'Elizabeth I, speech to her army at Tilbury while England still feared a Spanish invasion (1588), as written down years later by Leonel Sharp, a chaplain who was there' };
const history = {
  subject: 'history', deck: 'joined-up',
  topics: [
    { id: 'history.by-numbers', title: 'History by numbers', kind: 'mixed', prereqs: ['history.timeline', 'maths.negatives'], links: ['maths'], batch: 5, intro: 'How long ago? How many died? Historians need maths to measure time and change, including the tricky jump from BC to AD.', teach: 'Explain why there is no year 0, and what that does to BC–AD sums.', talk: 'Ask her how many years ago the Battle of Hastings was.' },
    { id: 'history.sources', title: 'Reading historical sources', kind: 'facts', prereqs: ['history.1066', 'english.unseen'], links: ['english'], batch: 4, intro: 'A source is evidence from the past. Reading one well uses your English skills: tone, word choice and the writer’s purpose. Then historians ask: who wrote it, when, and why?', teach: 'Explain why a biased source can still be useful to a historian.', talk: 'Ask her who wrote the Anglo-Saxon Chronicle and how that might affect what it says about the Vikings.' },
  ],
  items: [
    H.tmpl('hn.dates', 'by-numbers', 'historyMaths', [-0.8, 0, 0.6], { credits: ['maths.negatives', 'maths.frac-amount'] }),
    H.fact('hn.henry', 'by-numbers', 'Henry VIII reigned from 1509 to 1547. For about how many years was he king?', '38 years', ['48 years', '28 years', '36 years'], '1547 − 1509 = 38.', choiceOnly),
    H.fact('hn.elizabeth', 'by-numbers', 'Elizabeth I was born in 1533 and became queen in 1558. How old was she?', '25', ['35', '15', '23'], '1558 − 1533 = 25. She then reigned for 44 years, until 1603.', { accept: ['25 years old', '25 years'] }),
    H.fact('hn.halved', 'by-numbers', 'Suppose England’s population fell from about 5 million in 1300 to about 2.5 million in 1400. Roughly what fraction was left?', 'about a half', ['about a quarter', 'about a third', 'about three quarters'], '2.5 is half of 5. Plague returned again and again after 1348, so the population stayed low for a long time.', choiceOnly),
    H.mcq('src.ch1', 'sources', 'Which words show how the writer felt about the raiders?', [['“heathen men” and “lamentable havoc”', true], ['“immense sheets of light”', false, 'That describes the warning signs in the sky, not the raiders.'], ['“the land of the Northumbrians”', false, 'That just names the place.']], '“Heathen” (not Christian) and “lamentable havoc” (terrible destruction) show the monks saw the Vikings as godless and the raid as a disaster.', CHRONICLE),
    H.mcq('src.ch2', 'sources', 'Why might the writer begin with the “fiery dragons” in the sky?', [['To suggest God had sent warnings of the raid', true], ['Because dragons really attacked Northumbria', false, 'People at the time saw strange lights or storms as omens. Historians think these may have been the northern lights.'], ['To make the story more exciting and funny', false, 'Look at the tone: “dreadful”, “terrifying”, “woefully”. It is meant to be frightening.']], 'Monks believed God sent signs before disasters. Opening with omens makes the raid feel like a punishment that had been foretold.', CHRONICLE),
    H.mcq('src.ch3', 'sources', 'The Chronicle was written by monks. How might that affect what it says about the Vikings?', [['As victims, they show the Vikings as cruel heathens', true], ['It means the source is completely useless', false, 'A one-sided source is still useful: it shows how people at the time felt and what they believed.'], ['It makes no difference to what they wrote', false, 'Who writes a source always matters. Monks were the victims here.']], 'The source is biased, but useful: it tells us how terrifying the raids felt to Christians. Historians compare it with other evidence, such as archaeology.', CHRONICLE),
    H.mcq('src.tb1', 'sources', 'Why does Elizabeth call herself “a weak and feeble woman”?', [['To turn other people’s doubts upside down', true], ['Because she was ill and weak that day', false, 'The word “but” tells you she is about to turn the idea around.'], ['To admit she could not lead the army herself', false, 'She is doing the opposite: showing she is a strong leader.']], 'This is a contrast. She admits the doubts some people had about a female ruler, then answers them with a powerful image of courage.', TILBURY),
    H.mcq('src.tb2', 'sources', 'Which technique is “of a king, and of a king of England too”?', [['Repetition, building to a climax', true], ['A simile comparing her to a king', false, 'There is no comparison using “like” or “as”.'], ['A rhetorical question', false, 'There is no question here: she is making a bold statement.']], 'Repeating “of a king” and then adding “of England too” builds up the idea, stirring national pride in her soldiers.', TILBURY),
    H.mcq('src.tb3', 'sources', 'This version of the speech was written down by someone who heard it, but many years later. What does that mean for historians?', [['We can’t be sure these were her exact words', true], ['It must be completely made up', false, 'He was there, so it is probably close to what she said. It just may not be word for word.'], ['It is more reliable, as he had time to think', false, 'Memories fade and change over time, so a later account is usually less exact.']], 'When a source was made, and by whom, affects how far we can trust it. Historians call this its provenance.', TILBURY),
    H.fact('src.bias', 'sources', 'A source that gives only one side of the story is…', 'biased', ['reliable', 'primary', 'accurate'], 'Biased sources are still useful: they show what people believed, and why.', { accept: ['one-sided'] }),
    H.fact('src.provenance', 'sources', 'A source’s provenance is…', 'who made it, when, and why', ['how old the paper is', 'what it is about', 'where it is kept today'], 'Asking about provenance helps a historian judge how reliable a source is.', choiceOnly),
    H.fact('src.corroborate', 'sources', 'When historians check one source against others to see if they agree, they are trying to…', 'corroborate it', ['translate it', 'date it', 'publish it'], 'If several independent sources agree, we can be more confident about what happened.', choiceOnly),
  ],
};

// --- science + maths, science + English --------------------------------------
const S = mk('science');
const SCIENCE_WORDS = [
  ['photosynthesis', 'Green plants make their food by ___.', 'how plants make glucose using light', 'photo (light) + synthesis (putting together). The “f” sound is spelt ph.'],
  ['respiration', 'Every living cell releases energy by ___.', 'releasing energy from glucose', 're + spir (breathe) + ation: it is “spir”, not “sper”.'],
  ['chlorophyll', 'Leaves are green because they contain ___.', 'the green substance that absorbs light', 'chloro (green, with a hard “ch” as in chorus) + phyll (leaf): ph and a double l.'],
  ['hypothesis', 'My ___ is that sugar dissolves faster in warm water.', 'an idea that can be tested', 'hypo + thesis: y not i, then th in the middle.'],
  ['evaporation', 'Puddles disappear on a sunny day because of ___.', 'a liquid turning into a gas', 'e + vapor + ation: “vapour” loses its u here.'],
  ['condensation', 'The water droplets on a cold window are called ___.', 'a gas turning back into a liquid', 'con + dense + ation: drop the e from dense.'],
  ['apparatus', 'Put the ___ away carefully after the experiment.', 'the equipment used in an experiment', 'Double p, single r: ap-par-a-tus.'],
  ['independent', 'The ___ variable is the one you change.', 'not controlled by something else', 'Ends in -ent, not -ant: in-de-pend-ent.'],
  ['thermometer', 'Read the ___ at eye level.', 'an instrument that measures temperature', 'therm (heat) + o + meter (measure).'],
  ['nucleus', 'The ___ controls what happens in a cell.', 'the control centre of a cell', 'It ends -cleus: nu-cle-us.'],
];
const science = {
  subject: 'science', deck: 'joined-up',
  topics: [
    { id: 'science.by-numbers', title: 'Science by numbers', kind: 'skill', prereqs: ['science.working', 'maths.ratio'], links: ['maths'], batch: 5, intro: 'Scientists use percentages, ratios and rates all the time: how much oxygen is in the air, how to mix a solution, how fast something cools.', teach: 'Explain how you would mix squash and water in the ratio 1 : 4.', talk: 'Ask her what 21% of a 500-litre room’s air would be oxygen.' },
    { id: 'science.words', title: 'Science words: spelling and meaning', kind: 'facts', prereqs: ['english.spell-1', 'science.cells'], links: ['english'], batch: 5, intro: 'Science words are built from Greek and Latin parts. Knowing the parts helps you spell them and work out what they mean.', teach: 'Pick a science word and explain what each part of it means.', talk: 'Ask her what “photo” means in photosynthesis and photograph.' },
  ],
  items: [
    S.tmpl('sn.calc', 'by-numbers', 'scienceMaths', [-0.8, 0, 0.6], { credits: ['maths.percent', 'maths.ratio'] }),
    ...SCIENCE_WORDS.map(([word, sentence, clue, tricky]) => ({ id: `science.sw.${word}`, topic: 'science.words', kind: 'spell', word, sentence, clue, explain: tricky, learn: `**${word}**: ${tricky}` })),
    S.fact('sw.photo', 'words', 'In “photosynthesis”, what does “photo” mean?', 'light', ['plant', 'green', 'food'], 'Photo = light, as in photograph (“light drawing”).'),
    S.fact('sw.chloro', 'words', 'In “chlorophyll” and “chlorine”, what does “chloro” mean?', 'green', ['water', 'leaf', 'gas'], 'Chlorine gas is a pale yellow-green. Chlorophyll is the green in leaves.'),
    S.fact('sw.therm', 'words', 'In “thermometer” and “thermal”, what does “therm” mean?', 'heat', ['measure', 'cold', 'water'], 'Therm = heat. A thermal store is energy stored as heat.'),
  ],
};

// --- memory hooks (shown on learn cards and after a wrong answer) ---------------
const TOPIC_HOOKS = {
  'maths.averages': '“Hey diddle diddle, the median’s the middle; you add and divide for the mean. The mode is the one that appears the most, and the range is the difference between.”',
  'geography.by-numbers': 'Every geography number needs a “per”: per person, per km², per cent. Always ask “out of how many?”',
  'history.by-numbers': 'How long ago or how long for? Take the earlier year from the later one: end − start.',
  'history.sources': 'Ask **NOP** of every source: its **N**ature, **O**rigin and **P**urpose.',
  'science.by-numbers': 'Per cent means out of 100; a ratio is a recipe, like 1 : 4 squash to water.',
  'science.words': 'Science words are built like Lego: **photo** (light) + **synthesis** (putting together).',
};
const MEMORY = {
  'maths.av.calc': { hook: 'Put the numbers in order first: then the middle, the most common and the spread are easy to see.' },
  'maths.av.median': { hook: 'The median is the middle one, like the central reservation down the middle of a motorway.', example: 'Line your class up by height: the person standing in the middle has the median height.' },
  'maths.av.mode': { hook: '**Mo**de = **mo**st.', example: 'A shoe shop orders more of the mode, the size it sells most often.' },
  'maths.av.mean': { hook: 'Mean = share it out fairly: add it all up, then share it between everyone.', example: 'Three friends with 2, 4 and 6 sweets who share them equally get 4 each: that is the mean.' },
  'maths.av.range': { hook: 'Range = biggest − smallest: how far the data ranges.', example: 'A week of temperatures from 12°C to 20°C has a range of 8°C.' },
  'maths.av.mode-q': { hook: 'Mode = most: count which value turns up most often.' },
  'maths.av.even': { hook: 'Two middle values? Go halfway between them: add them and halve.' },
  'geography.gn.median': { hook: 'One giant value drags the mean up; the median ignores it.', example: 'House prices in the news are often given as medians, so a few mansions don’t make homes look dearer.' },
  'geography.gn.density': { hook: 'Density = people ÷ area: how crowded each square kilometre is.', example: 'England is one of the most crowded countries in Europe; the Scottish Highlands are among the emptiest places.' },
  'geography.gn.climate': { hook: 'Read the pattern, not each number: which months are high, and which are low?', example: 'Summer holidays in Spain or Greece are dry and sunny: that is the Mediterranean climate.' },
  'geography.gn.anomaly': { hook: 'An anomaly is the odd one out: it doesn’t fit the pattern of the rest.', example: 'In a science experiment, one result far from all the others is an anomaly: repeat it to check.' },
  'geography.gn.survey': { hook: 'Percentage = part ÷ whole × 100.', example: 'If 15 of the 30 people in your class walk to school, that is 50%.' },
  'geography.gn.urban': { hook: 'The parts make one whole: 1 − 4/5 = 1/5.' },
  'history.hn.henry': { hook: 'How long for? End − start: 1547 − 1509 = 38 years.' },
  'history.hn.elizabeth': { hook: 'Age = the later year − the year of birth.' },
  'history.hn.halved': { hook: 'From 5 million to 2.5 million: half is left, 1/2.' },
  'history.src.bias': { hook: 'Biased = one-sided, like a fan describing their own team’s match.', example: 'An advert for a cereal is biased: it only tells you the good things.' },
  'history.src.provenance': { hook: 'Provenance is a source’s back story: **who** made it, **when**, and **why**.', example: 'Antiques experts check provenance too: who owned a painting before, and when.' },
  'history.src.corroborate': { hook: 'Corroborate = check it with a **co**-witness: do other sources agree?', example: 'Police corroborate a story by asking other witnesses whether they saw the same thing.' },
  'history.src.ch1': { hook: 'Feelings hide in the describing words: “heathen”, “lamentable”.' },
  'history.src.ch2': { hook: 'In 793 people often read strange skies as warnings from God.' },
  'history.src.ch3': { hook: 'Ask who wrote it: monks, whose fellow monks and churches were the raiders’ targets, were hardly neutral.' },
  'history.src.tb1': { hook: 'A clever speaker admits a weakness first, then turns it into a strength.' },
  'history.src.tb2': { hook: 'Repetition builds a speech to a climax: “of a king, and of a king of England too”.' },
  'history.src.tb3': { hook: 'Written down years later = a memory, not a recording.' },
  'science.sw.photo': { hook: 'Photo = light: a photograph is a “light drawing”.', example: 'Solar panels on roofs are photovoltaic: they turn light into electricity.' },
  'science.sw.chloro': { hook: 'Chloro = green: chlorophyll makes leaves green.', example: 'Swimming-pool chlorine is named after the yellow-green colour of chlorine gas.' },
  'science.sw.therm': { hook: 'Therm = heat: a vacuum flask keeps the heat in your hot chocolate.', example: 'The thermostat on the wall at home controls the heating: therm (heat) + stat (stay).' },
  'science.sw.photosynthesis': { hook: 'Photo (light) + synthesis (making): plants make their food with light.' },
  'science.sw.respiration': { hook: 're + SPIR + ation: think of “spirit”, the breath of life.' },
  'science.sw.chlorophyll': { hook: 'Chloro (green) + phyll (leaf): the green stuff in leaves.' },
  'science.sw.hypothesis': { hook: 'A hypothesis is a hunch you can test.' },
  'science.sw.evaporation': { hook: 'Water vanishes as vapour: e + vapour (drop the u) + ation.', example: 'Washing dries on the line by evaporation, fastest on warm, windy days.' },
  'science.sw.condensation': { hook: 'con + dense (drop the e) + ation: vapour gets dense and turns to drops.', example: 'The steamy bathroom mirror after a shower is condensation.' },
  'science.sw.independent': { hook: 'There’s a dent in indepen**dent**: it ends -ent, not -ant.' },
  'science.sw.thermometer': { hook: 'Therm (heat) + meter (measure): a heat measurer.', example: 'Doctors use a thermometer to check for a fever: about 37°C is normal.' },
  'science.sw.nucleus': { hook: 'The nucleus is the cell’s control centre: nu-CLE-us.' },
};
for (const deck of [maths, geography, history, science]) {
  for (const t of deck.topics) t.hook = TOPIC_HOOKS[t.id];
  for (const it of deck.items) if (MEMORY[it.id]) Object.assign(it, MEMORY[it.id]);
}
for (const id of Object.keys(MEMORY)) if (![maths, geography, history, science].some((d) => d.items.some((it) => it.id === id))) throw new Error(`memory hook for unknown item ${id}`);

export default [maths, geography, history, science];

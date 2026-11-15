// Year 8 French: vocabulary and themes (all about me, school, free time, food, town, home,
// weather, holidays, clothes, routine, health, technology). Standard metropolitan French with
// traditional spelling. Numbers, prices, dates and times also have generators (js/gen/y8french2.js).
// Conventions: French→English items carry `hear` (the French to listen to, which is in the prompt);
// English→French items carry `lang: 'fr'` (accents forgiven when typed, no other slips) and no `hear`,
// which would give the answer away. Typography: ’ for apostrophes, a non-breaking space before ? ! : ;
// in French (added automatically at the end of this file).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `french.v.${id}`, topic: `french.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `french.v.${id}`, topic: `french.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `french.v.${id}`, topic: `french.${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
const tmpl = (id, topic, gen, seed = [-1, 0, 1]) => ({ id: `french.v.${id}.tmpl`, topic: `french.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed });
const C = { formats: ['choice'] };
/** French → English: what does it mean? */
const fe = (id, topic, fr, en, wrong, explain, extra = {}) => fact(id, topic, `What does **${fr}** mean?`, en, wrong, explain, { hear: fr, learn: `**${fr}** = ${en}`, ...extra });
/** English → French: how do you say it? */
const ef = (id, topic, en, fr, wrong, explain, extra = {}) => fact(id, topic, `How do you say **${en}** in French?`, fr, wrong, explain, { lang: 'fr', learn: `**${fr}** = ${en}`, ...extra });
const T = (id, title, prereqs, extra) => ({ id: `french.${id}`, title, kind: 'facts', prereqs: prereqs.map((p) => `french.${p}`), batch: 5, ...extra });

const topics = [
  T('v-greetings', 'Greetings and introductions', [], {
    diagnostic: ['french.v.gr.age2', 'french.v.gr.cava'],
    intro: 'French greetings change with the time of day and with the person. Use **tu** with a friend, a child or a pet, and **vous** with an adult you don’t know well (or with more than one person). To introduce yourself, give your name, age and home town: Je m’appelle…, j’ai… ans, j’habite à…',
    teach: 'Teach your grown-up how to greet a French friend and a French teacher, and explain why the words are different.',
    talk: 'Pretend you are meeting for the first time in a French café. Say “Bonjour !” and ask {him} to tell you {her} name, age and home town in French. Then ask {him} what each part meant.',
    hook: '**tu** for a friend, **vous** for a teacher. Age uses **avoir**: j’ai douze ans, “I have twelve years”.',
    example: 'In a French shop, say “Bonjour, madame” or “Bonjour, monsieur” as you walk in: not greeting the shopkeeper seems rude.',
    visual: { kind: 'table', head: ['', 'to a friend (tu)', 'to an adult (vous)'], rows: [['What’s your name?', 'Comment tu t’appelles ?', 'Comment vous appelez-vous ?'], ['How are you?', 'Ça va ?', 'Comment allez-vous ?'], ['please', 's’il te plaît', 's’il vous plaît'], ['goodbye', 'Salut ! Au revoir !', 'Au revoir !']] },
  }),
  T('v-numbers', 'Numbers and prices', [], {
    kind: 'mixed',
    diagnostic: ['french.v.nu.et', 'french.v.nu.80'],
    intro: 'Up to 69, French numbers work like English. Then French counts in twenties: 70 is soixante-dix (60 + 10), 80 is quatre-vingts (4 × 20) and 90 is quatre-vingt-dix (4 × 20 + 10). Prices are said euros first, then the cents: 3,50 € is trois euros cinquante.',
    teach: 'Explain how to build 97 in French, and why 80 has an s but 81 does not.',
    talk: 'Read out prices from a receipt (pretend the £ are €) and ask {him} to say them in French. Then ask {him} to say a phone number in French, in pairs of digits, as French people do.',
    hook: '**70 = 60 + 10, 80 = 4 × 20, 90 = 4 × 20 + 10.** Only 21, 31, 41, 51, 61 and 71 take **et**.',
    example: 'French phone numbers are read in pairs: 06 12 45 78 90 is “zéro six, douze, quarante-cinq, soixante-dix-huit, quatre-vingt-dix”.',
    visual: { kind: 'table', head: ['', 'French', 'how it works'], rows: [['70', 'soixante-dix', '60 + 10'], ['71', 'soixante et onze', '60 + 11'], ['75', 'soixante-quinze', '60 + 15'], ['80', 'quatre-vingts', '4 × 20'], ['81', 'quatre-vingt-un', '4 × 20 + 1 (no et, no s)'], ['90', 'quatre-vingt-dix', '4 × 20 + 10'], ['99', 'quatre-vingt-dix-neuf', '4 × 20 + 19']], caption: 'Belgium and Switzerland say septante (70) and nonante (90), and parts of Switzerland say huitante (80).' },
  }),
  T('v-dates', 'Days, months, dates and birthdays', ['v-numbers'], {
    kind: 'mixed',
    diagnostic: ['french.v.da.first', 'french.v.da.mercredi'],
    intro: 'Days and months have no capital letter in French. A date is **le** + number + month: le quatorze juillet. Only the 1st is different: le premier mai. To say “on Mondays” (every week), put le before the day: le lundi.',
    teach: 'Say your birthday and three family birthdays in French, and explain why the 1st of the month is different.',
    talk: 'Each morning this week, ask {him} “Quelle est la date aujourd’hui ?” and let {him} answer in French. Check against a calendar: you will hear the month.',
    hook: '**le + number + month**: le quatorze juillet. Only the 1st is **premier**. No capitals: lundi, mai.',
    example: 'France’s national day is le quatorze juillet, linked with the storming of the Bastille prison in Paris in 1789.',
    visual: { kind: 'table', head: ['English', 'French'], rows: [['on Monday (this Monday)', 'lundi'], ['on Mondays (every week)', 'le lundi'], ['1 May', 'le premier mai'], ['2 May', 'le deux mai'], ['8 May', 'le huit mai'], ['11 November', 'le onze novembre']], caption: 'No l’ before huit or onze. Days and months are masculine and have no capital letter.' },
  }),
  T('v-time', 'Telling the time', ['v-numbers'], {
    kind: 'mixed',
    diagnostic: ['french.v.ti.une', 'french.v.ti.demie'],
    intro: 'Quelle heure est-il ? Answer with Il est… heures. Up to half past, add the minutes: et quart, et demie, vingt. After half past, go to the next hour and take away: moins dix, moins le quart. Timetables use the 24-hour clock: dix-sept heures quarante.',
    teach: 'Explain how to say 8:50 in French, and why it uses neuf (nine).',
    talk: 'Ask “Quelle heure est-il ?” a few times today and let {him} answer in French; check the clock together. Then ask {him} to read three times from a TV guide or a train timetable, the 24-hour way.',
    hook: '**Past the half? Next hour, then moins.** 8:50 = neuf heures moins dix. heure is feminine: **une** heure, et demi**e**.',
    example: 'French television’s main evening news is called “le vingt heures”: it starts at 20:00.',
    visual: { kind: 'table', head: ['', 'French'], rows: [['3:00', 'trois heures'], ['3:15', 'trois heures et quart'], ['3:30', 'trois heures et demie'], ['3:40', 'quatre heures moins vingt'], ['3:45', 'quatre heures moins le quart'], ['12:00', 'midi (or minuit)'], ['17:40', 'dix-sept heures quarante']], caption: 'Midday is midi and midnight is minuit. Midi et demi traditionally has no e, because midi is masculine (midi et demie is also accepted).' },
  }),
  T('v-family', 'Family and pets', ['v-greetings'], {
    diagnostic: ['french.v.fa.frere', 'french.v.fa.chien'],
    intro: 'The word for “my” matches the noun: mon père, ma mère, mes parents. Use il y a for “there is / there are”, avoir for what people have (j’ai un chien) and s’appeler for names: Mon frère s’appelle Tom.',
    teach: 'Draw your family tree and label it in French with mon, ma and mes.',
    talk: 'Look at family photos and ask “C’est qui ?” (who is it?). {She} answers in French, for example “C’est ma tante.” The table in this topic shows the words, so you can check.',
    hook: '**mon** père, **ma** mère, **mes** parents: “my” matches the person you are talking about, not you.',
    visual: { kind: 'table', head: ['', 'masculine', 'feminine'], rows: [['parent', 'le père', 'la mère'], ['child', 'le fils', 'la fille'], ['brother, sister', 'le frère', 'la sœur'], ['grandparent', 'le grand-père', 'la grand-mère'], ['uncle, aunt', 'l’oncle', 'la tante'], ['cousin', 'le cousin', 'la cousine']] },
  }),
  T('v-describe', 'Describing people', ['v-family'], {
    diagnostic: ['french.v.de.agree', 'french.v.de.yeux'],
    intro: 'Hair and eyes take avoir: J’ai les yeux verts et les cheveux longs. Personality takes être: Je suis sportive. Adjectives agree with the person: add -e for a girl or woman and -s for more than one. Colours come after the noun.',
    teach: 'Describe yourself and a friend in French, then explain why some adjectives changed their spelling.',
    talk: 'Play “Qui est-ce ?” (Who is it?): {she} describes someone in the family in French and you guess who it is. Ask {him} what each describing word meant.',
    hook: '**Hair and eyes: avoir** (j’ai les yeux bleus, “I have the eyes blue”). **Personality: être**, with agreement: il est grand, elle est grand**e**.',
    visual: { kind: 'table', head: ['', 'he is…', 'she is…'], rows: [['tall', 'grand', 'grande'], ['small', 'petit', 'petite'], ['sporty', 'sportif', 'sportive'], ['lazy', 'paresseux', 'paresseuse'], ['chatty', 'bavard', 'bavarde'], ['shy', 'timide', 'timide'], ['funny', 'drôle', 'drôle']], caption: 'Add -e for feminine unless the word already ends in -e. -if becomes -ive and -eux becomes -euse.' },
  }),
  T('v-school', 'School: subjects, opinions and the timetable', ['v-time'], {
    diagnostic: ['french.v.sc.anglais', 'french.v.sc.prefere'],
    intro: 'School subjects take le, la, l’ or les: le français, la musique, l’histoire, les maths. Give an opinion with a reason: J’aime l’histoire parce que c’est intéressant. Lessons on the timetable take à: à huit heures.',
    teach: 'Tell your grown-up tomorrow’s timetable in French, with an opinion and a reason for two subjects.',
    talk: 'Ask {him} for {her} favourite and least favourite subjects in French, and why (“Pourquoi ?”). Listen for parce que, “because”.',
    hook: '**Opinion + subject + parce que + c’est + adjective**: J’adore le dessin parce que c’est créatif.',
    example: 'At many French collèges there are no lessons on Wednesday afternoon, so pupils do sport, music or clubs instead.',
    visual: { kind: 'table', head: ['subject', 'French'], rows: [['maths', 'les maths'], ['English', 'l’anglais'], ['French', 'le français'], ['history and geography', 'l’histoire-géo'], ['science', 'les sciences'], ['PE', 'l’EPS'], ['art', 'le dessin (les arts plastiques)'], ['music', 'la musique']] },
  }),
  T('v-freetime', 'Free time and sport', ['v-school'], {
    diagnostic: ['french.v.ft.jouer', 'french.v.ft.velo'],
    intro: 'Use jouer à for sports and games (je joue au foot), jouer de for instruments (je joue du piano) and faire de for other activities (je fais de la natation). Say how often: souvent, parfois, le week-end.',
    teach: 'Explain the difference between je joue au tennis, je joue du violon and je fais du vélo.',
    talk: 'Ask {him} what {she} does after school and at the weekend, in French. Then ask {him} to teach you one French sentence about your own hobby.',
    hook: '**Jouer À for balls, jouer DE for music, FAIRE DE for the rest.**',
    visual: { kind: 'table', head: ['verb', 'examples'], rows: [['jouer à + a sport or game', 'je joue au foot, à la pétanque'], ['jouer de + an instrument', 'je joue du piano, de la guitare'], ['faire de + an activity', 'je fais du vélo, de la natation, de l’équitation']], caption: 'à + le = au, de + le = du.' },
  }),
  T('v-food', 'Food, drink and meals', ['v-greetings'], {
    intro: 'Meals: le petit déjeuner, le déjeuner, le goûter (the after-school snack) and le dîner. For food in general use du, de la, de l’ or des (“some”): je mange du pain. After a negative, just de: je ne mange pas de viande.',
    teach: 'Describe what you usually eat for each meal, in French.',
    talk: 'At a meal, ask {him} to name everything on the table in French. Ask “C’est bon ?” (is it good?) and let {him} answer.',
    hook: '**du, de la, des = some**; **pas de** after a negative. A potato is une pomme de terre: an “apple of the earth”.',
    visual: { kind: 'table', head: ['', 'some'], rows: [['masculine', 'du pain'], ['feminine', 'de la confiture'], ['before a vowel', 'de l’eau'], ['plural', 'des fraises'], ['after a negative', 'pas de pain, pas de fraises']] },
  }),
  T('v-cafe', 'At the café and the market', ['v-food', 'v-numbers'], {
    intro: 'Order politely with Je voudrais… (I would like) and s’il vous plaît. Ask for the bill with L’addition, s’il vous plaît. Quantities take de: un kilo de pommes, une bouteille d’eau.',
    teach: 'Act out ordering a drink and a snack at a café, then asking for the bill.',
    talk: 'Be the waiter: say “Bonjour ! Vous désirez ?” (What would you like?) and let {him} order in French. Then {she} asks for the bill.',
    hook: '**Je voudrais** = I would like. A quantity takes **de**: un kilo **de** tomates, never des.',
    example: 'In France the service charge is included in the bill (service compris), so a tip is a small extra, not expected.',
    visual: { kind: 'table', head: ['English', 'French'], rows: [['a kilo of', 'un kilo de'], ['500 grams of', 'cinq cents grammes de'], ['a bottle of', 'une bouteille de'], ['a slice of', 'une tranche de'], ['a packet of', 'un paquet de'], ['a tin of', 'une boîte de']] },
  }),
  T('v-town', 'My town and directions', ['v-freetime'], {
    diagnostic: ['french.v.to.gauche', 'french.v.to.biblio'],
    intro: 'Say what is in your town with il y a (there is) and il n’y a pas de (there isn’t a). Ask the way with Où est… ? and give directions: tournez à gauche, tournez à droite, allez tout droit.',
    teach: 'Give your grown-up directions in French from your front door to the nearest shop.',
    talk: 'Hide a small object and let {him} guide you to it in French: à gauche, à droite, tout droit, stop ! Then swap: the table in this topic has the words.',
    hook: '**à droite** = right, **tout droit** = straight on: one letter apart, so listen carefully!',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['à gauche', 'left'], ['à droite', 'right'], ['tout droit', 'straight on'], ['à côté de', 'next to'], ['en face de', 'opposite'], ['au coin', 'at the corner']] },
  }),
  T('v-home', 'Home and my bedroom', ['v-family'], {
    diagnostic: ['french.v.ho.chambre', 'french.v.ho.sous'],
    intro: 'J’habite dans une maison or dans un appartement. Name the rooms (la cuisine, le salon, ma chambre) and say where things are: sur (on), sous (under), dans (in), à côté de (next to), devant (in front of), derrière (behind).',
    teach: 'Describe your bedroom in French, saying where five things are.',
    talk: 'Ask {him} to give you a tour of your home in French, naming each room. Then put an object somewhere and ask “Où est… ?” (where is…?).',
    hook: '**sur** = on (a surface), **sous** = under (un sous-marin = a submarine).',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['sur', 'on'], ['sous', 'under'], ['dans', 'in'], ['devant', 'in front of'], ['derrière', 'behind'], ['à côté de', 'next to'], ['entre', 'between']] },
  }),
  T('v-weather', 'Weather and seasons', ['v-dates'], {
    diagnostic: ['french.v.we.pleut', 'french.v.we.printemps'],
    intro: 'Most weather uses il fait: il fait beau, il fait chaud, il fait froid. Rain and snow have their own verbs: il pleut, il neige. Wind and fog use il y a: il y a du vent. Seasons: en été, en automne, en hiver, but au printemps.',
    teach: 'Give a French weather forecast for today and tomorrow, like a TV presenter.',
    talk: 'Each morning, ask {him} “Quel temps fait-il ?” (what’s the weather like?) and let {him} answer in French by looking out of the window.',
    hook: '**Il fait** for most weather, **il pleut / il neige** on their own, **il y a du** for wind and fog. **Au printemps**, but en été, en automne, en hiver.',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['Il fait beau.', 'It’s nice weather.'], ['Il fait mauvais.', 'It’s bad weather.'], ['Il fait chaud / froid.', 'It’s hot / cold.'], ['Il pleut.', 'It’s raining.'], ['Il neige.', 'It’s snowing.'], ['Il y a du vent.', 'It’s windy.'], ['Il y a des nuages.', 'It’s cloudy.']] },
  }),
  T('v-holidays', 'Holidays and travel', ['v-weather', 'v-town'], {
    intro: 'Holidays bring the tenses together: je vais (I go), je suis allé(e) (I went), c’était super (it was great) and je vais aller (I am going to go). Transport: en for things you ride inside (en voiture, en train, en avion), à on foot or on a bike (à pied, à vélo).',
    teach: 'Describe a past holiday in French: where you went, how you travelled, the weather and what you thought of it.',
    talk: 'Look at holiday photos together and ask {him} to describe one in French. Prompt with: Où ? (where?) Avec qui ? (with whom?) Quel temps ? (what weather?) C’était comment ? (what was it like?)',
    hook: '**En inside, à on top**: en voiture, en train, en avion, but à vélo, à cheval, à pied.',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['en voiture', 'by car'], ['en train', 'by train'], ['en avion', 'by plane'], ['en car', 'by coach'], ['à vélo', 'by bike'], ['à pied', 'on foot']], caption: 'Careful: un car is a coach, not a car (une voiture).' },
  }),
  T('v-clothes', 'Clothes, colours and shopping', ['v-describe', 'v-numbers'], {
    intro: 'Porter means to wear: je porte un jean et un pull. Colours are adjectives, so they come after the noun and agree with it: une robe verte, des chaussures noires. Marron and orange never change.',
    teach: 'Describe what you are wearing today in French, with colours, and explain one agreement.',
    talk: 'Point at clothes in a shop window or a wardrobe and ask {him} to name each one with its colour in French.',
    hook: '**Colours follow the noun and agree**: une robe vert**e**. **Marron** (a chestnut) and **orange** (the fruit) never change.',
    visual: { kind: 'table', head: ['', 'masculine', 'feminine'], rows: [['black', 'noir', 'noire'], ['white', 'blanc', 'blanche'], ['green', 'vert', 'verte'], ['blue', 'bleu', 'bleue'], ['red', 'rouge', 'rouge'], ['brown', 'marron', 'marron']], caption: 'Add -s for the plural (des pulls noirs), except marron and orange.' },
  }),
  T('v-routine', 'My daily routine', ['v-time', 'v-home'], {
    intro: 'Daily routines use reflexive verbs, with an extra me (myself): je me réveille, je me lève, je m’habille. Put the day in order with d’abord (first), ensuite (then) and enfin (finally), and add the time: à sept heures.',
    teach: 'Tell your grown-up your morning routine in French, with times and the words for first, then and finally.',
    talk: 'Ask {him} to describe {her} morning in French while acting it out, and guess each action.',
    hook: '**me = myself**: je **me** lave, “I wash myself”. Before a vowel: je **m’**habille.',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['je me réveille', 'I wake up'], ['je me lève', 'I get up'], ['je me douche', 'I have a shower'], ['je m’habille', 'I get dressed'], ['je me brosse les dents', 'I brush my teeth'], ['je me couche', 'I go to bed']] },
  }),
  T('v-health', 'The body and health', ['v-routine'], {
    intro: 'To say what hurts, use avoir mal à + the body part: j’ai mal à la tête, j’ai mal au ventre (à + le), j’ai mal aux dents (à + les). Je suis malade means I am ill.',
    teach: 'Play the doctor: say three things that hurt in French, then give some advice.',
    talk: 'Play “Jacques a dit” (Simon says) with body parts: read a French word from this topic, and {she} touches the right part of the body.',
    hook: '**J’ai mal à + body part**: à la tête, **au** ventre (à + le), **aux** dents (à + les).',
    visual: { kind: 'table', head: ['French', 'English'], rows: [['la tête', 'head'], ['le ventre', 'stomach'], ['la gorge', 'throat'], ['le bras', 'arm'], ['la main', 'hand'], ['la jambe', 'leg'], ['le pied', 'foot'], ['les dents', 'teeth']] },
  }),
  T('v-tech', 'Media, technology and the internet', ['v-freetime'], {
    intro: 'Say how you use technology: j’envoie des messages, je regarde des vidéos, je joue à des jeux vidéo. Give balanced opinions (c’est utile mais c’est dangereux) and stay safe online: il ne faut jamais partager ton mot de passe.',
    teach: 'Give two advantages and two dangers of the internet, in French.',
    talk: 'Ask {him} how {she} uses a phone, tablet or computer, in French, and what {she} thinks of social media (les réseaux sociaux).',
    hook: '**télécharger** = download (not charge!). **Une émission** is a TV or radio programme, not an emission.',
  }),
];

const items = [];
const push = (...xs) => items.push(...xs);

// --- greetings and introductions
push(
  fe('gr.bonjour', 'v-greetings', 'Bonjour !', 'hello', ['goodbye', 'good evening', 'see you soon'], 'Bonjour is the everyday “hello”, from morning until early evening; it also means “good morning”.', { accept: ['good morning', 'good afternoon', 'good day', 'hi'] }),
  fe('gr.bonsoir', 'v-greetings', 'Bonsoir !', 'good evening', ['good night', 'good morning', 'goodbye'], 'Bonsoir = good evening. Bonne nuit (good night) is only for going to bed.', { accept: ['evening'] }),
  fe('gr.salut', 'v-greetings', 'Salut !', 'hi', ['thank you', 'please', 'sorry'], 'Salut is the friendly “hi”, and also “bye”: use it with friends, not with teachers.', { accept: ['hello', 'hiya', 'bye', 'hi or bye'] }),
  fe('gr.bientot', 'v-greetings', 'À bientôt !', 'see you soon', ['see you tomorrow', 'welcome back', 'goodbye for ever'], 'À bientôt = see you soon. À demain = see you tomorrow; à plus tard = see you later.', { accept: ['see you later'] }),
  ef('gr.nom', 'v-greetings', 'What’s your name? (to a friend)', 'Comment tu t’appelles ?', ['Comment il s’appelle ?', 'Quel âge as-tu ?', 'Comment ça va ?'], 'Comment tu t’appelles ? (or Comment t’appelles-tu ?) asks a friend’s name. Answer: Je m’appelle…', { accept: ['Comment t’appelles-tu ?', 'Tu t’appelles comment ?'] }),
  fe('gr.mappelle', 'v-greetings', 'Je m’appelle Léa.', 'My name is Léa.', ['I call Léa.', 'Her name is Léa.', 'I like Léa.'], 'Je m’appelle means “I am called” (literally “I call myself”): my name is Léa.', { accept: ['I am called Léa', 'I’m called Léa', 'I am Léa', 'I’m Léa', 'my name’s Léa', 'my name is lea', 'I am called lea'] }),
  fe('gr.cava', 'v-greetings', 'Ça va ?', 'How are you?', ['Where are you going?', 'What is it?', 'Who is that?'], 'Ça va ? = how are you? / how’s it going? The answer can be the same words: Ça va (bien) !', { accept: ['how’s it going', 'how are things', 'are you ok', 'are you okay', 'you ok', 'how are you doing'] }),
  mcq('gr.reply', 'v-greetings', 'Your friend asks “Ça va ?” and you feel great. What do you say?', [['Ça va très bien, merci !', true], ['Comme ci, comme ça, merci.', false, 'That means “so-so”.'], ['Pas très bien, et toi ?', false, 'That means “not very well”.']], 'Ça va très bien, merci = I’m very well, thanks. Add “Et toi ?” to ask back.'),
  fe('gr.age', 'v-greetings', 'J’ai douze ans.', 'I am twelve.', ['I have twelve brothers.', 'I am twenty.', 'It is twelve o’clock.'], 'French uses avoir (to have) for age: j’ai douze ans, “I have twelve years”.', { accept: ['I’m twelve', 'I am 12', 'I’m 12', 'I am twelve years old', 'I’m twelve years old', 'I am 12 years old', 'I’m 12 years old'] }),
  mcq('gr.age2', 'v-greetings', 'How do you say “I am twelve”?', [['J’ai douze ans.', true], ['Je suis douze ans.', false, 'Age uses avoir, not être: j’ai douze ans.'], ['J’ai deux ans.', false, 'deux is two: you would be a toddler!'], ['Je suis douze.', false, 'Age uses avoir and ans: j’ai douze ans.']], 'Age uses avoir: j’ai douze ans (I have twelve years). Ask: Tu as quel âge ? or Quel âge as-tu ?'),
  ef('gr.habite', 'v-greetings', 'I live in London.', 'J’habite à Londres.', ['J’habite en Londres.', 'Je habite à Londres.', 'J’habite au Londres.'], 'Towns and cities take à: j’habite à Londres. Je becomes j’ before a vowel or a silent h: j’habite.', { accept: ['J’habite Londres.', 'Je vis à Londres.'] }),
  mcq('gr.stp', 'v-greetings', 'How do you say “please” to a friend?', [['s’il te plaît', true], ['s’il vous plaît', false, 'That is the polite form, for an adult or for more than one person.'], ['merci beaucoup', false, 'merci beaucoup means thank you very much.']], 's’il te plaît to a friend (tu); s’il vous plaît to an adult or a group (vous).'),
  mcq('gr.tuvous', 'v-greetings', 'Which word for “you” do you use with your teacher?', [['vous', true], ['tu', false, 'tu is for one friend, a family member, a child or a pet.'], ['toi', false, 'toi is the tu form after a preposition: avec toi, et toi ?']], 'vous for an adult you don’t know well, and for more than one person. tu for a friend, family, a child or a pet.'),
  fe('gr.enchante', 'v-greetings', 'Enchanté !', 'Pleased to meet you!', ['Have a nice day!', 'Welcome!', 'Good luck!'], 'Enchanté (enchantée if you are a girl) = pleased to meet you. Bonne journée = have a nice day; bienvenue = welcome.', { accept: ['nice to meet you', 'delighted', 'pleased to meet you', 'delighted to meet you'] }),
  order('gr.order', 'v-greetings', 'Put this conversation in order.', ['Bonjour ! Comment tu t’appelles ?', 'Je m’appelle Hugo. Et toi ?', 'Moi, je m’appelle Inès. Tu as quel âge ?', 'J’ai douze ans. Au revoir !'], 'A greeting and a question, the answer with a question back, another question, and an answer with goodbye.'),
);

// --- numbers and prices
push(
  tmpl('nu.numbers', 'v-numbers', 'y8frNumbers'),
  tmpl('nu.prices', 'v-numbers', 'y8frPrices'),
  mcq('nu.70', 'v-numbers', 'In Belgium and Switzerland, 70 is “septante”. What do people say in France?', [['soixante-dix', true], ['sept-dix', false, 'There is no such number: France says soixante-dix (60 + 10).'], ['soixante-sept', false, 'soixante-sept is 67.']], 'France says soixante-dix (60 + 10). Septante is used in Belgium and Switzerland.'),
  fact('nu.80', 'v-numbers', 'What number is **quatre-vingts**?', '80', ['24', '60', '420'], 'quatre-vingts = four twenties = 80. The s goes when another number follows: quatre-vingt-un (81).', { hear: 'quatre-vingts', learn: '**quatre-vingts** = 80 (four twenties)' }),
  ef('nu.21', 'v-numbers', '21', 'vingt et un', ['vingt-un', 'un et vingt', 'vingt-onze'], '21 = vingt et un: 21, 31, 41, 51, 61 (and 71) join the one with et.', { accept: ['vingt-et-un'] }),
  mcq('nu.et', 'v-numbers', 'Which of these numbers does NOT use **et**?', [['81: quatre-vingt-un', true], ['71: soixante et onze', false, '71 does take et.'], ['31: trente et un', false, '31 does take et.'], ['51: cinquante et un', false, '51 does take et.']], 'Only 21, 31, 41, 51, 61 and 71 take et. 81 and 91 do not: quatre-vingt-un, quatre-vingt-onze.'),
  mcq('nu.200', 'v-numbers', 'How do you write 200 in French?', [['deux cents', true], ['deux cent', false, 'cent takes an s when it is multiplied and nothing follows: deux cents, but deux cent un.'], ['deux centaines', false, 'une centaine means “about a hundred”.']], 'deux cents (200), but deux cent dix (210): the s goes when another number follows.'),
  mcq('nu.2026', 'v-numbers', 'How do you say the year 2026?', [['deux mille vingt-six', true], ['vingt vingt-six', false, 'English says “twenty twenty-six”, but French says “two thousand and twenty-six”.'], ['deux milles vingt-six', false, 'mille never takes an s.'], ['deux mille et vingt-six', false, 'There is no et in it.']], 'deux mille vingt-six: two thousand + twenty-six. mille never changes.'),
  fe('nu.combien', 'v-numbers', 'C’est combien ?', 'How much is it?', ['How many are there?', 'What is it?', 'When is it?'], 'C’est combien ? (or Ça coûte combien ?) = how much is it?', { accept: ['how much does it cost', 'how much is that', 'how much', 'how much does that cost'] }),
  fe('nu.coute', 'v-numbers', 'Ça coûte deux euros.', 'It costs two euros.', ['It costs twelve euros.', 'It costs twenty euros.', 'It costs two cents.'], 'coûter = to cost. deux = 2, douze = 12, vingt = 20.', { accept: ['that costs two euros', 'it costs 2 euros', 'it’s two euros', 'that’s two euros', 'it’s 2 euros', 'that costs 2 euros'] }),
  mcq('nu.comma', 'v-numbers', 'How is three euros fifty written in France?', [['3,50 €', true], ['3.50 €', false, 'French uses a comma where English uses a decimal point.'], ['350 €', false, 'That is three hundred and fifty euros!']], 'In France the decimal point is a comma, and the € usually comes after the number: 3,50 €.'),
  fe('nu.centime', 'v-numbers', 'un centime', 'a cent', ['a hundred euros', 'a coin', 'a banknote'], 'There are 100 centimes in a euro. A coin is une pièce and a banknote is un billet.', { accept: ['cent', 'one cent', '1 cent', 'a euro cent', 'a centime'] }),
);

// --- days, months, dates and birthdays
push(
  tmpl('da.dates', 'v-dates', 'y8frDates'),
  mcq('da.caps', 'v-dates', 'Which is written correctly in French?', [['le lundi 3 mars', true], ['le Lundi 3 Mars', false, 'Days and months have no capital letters in French.'], ['le lundi 3 Mars', false, 'Months have no capital letter either.'], ['le Lundi 3 mars', false, 'Days have no capital letter.']], 'No capital letters for days or months (except at the start of a sentence): le lundi 3 mars.'),
  mcq('da.first', 'v-dates', 'How do you say “the 1st of May”?', [['le premier mai', true], ['le un mai', false, 'The 1st is the only date that uses a different word: premier.'], ['la première mai', false, 'Dates are masculine: le premier.']], 'The 1st is le premier; every other date uses the plain number: le deux mai, le trois mai.'),
  fe('da.anniv', 'v-dates', 'Mon anniversaire, c’est le douze août.', 'My birthday is on 12 August.', ['My birthday is on 2 August.', 'My birthday is on 12 April.', 'My birthday is on 20 August.'], 'douze = 12 (deux = 2, vingt = 20), août = August (avril = April).', C),
  ef('da.quand', 'v-dates', 'When is your birthday? (to a friend)', 'C’est quand, ton anniversaire ?', ['Quelle est la date aujourd’hui ?', 'Quel âge as-tu ?', 'C’est quand, ton cours de danse ?'], 'C’est quand, ton anniversaire ? Answer: Mon anniversaire, c’est le…', { accept: ['C’est quand ton anniversaire ?', 'Quand est ton anniversaire ?', 'Ton anniversaire, c’est quand ?', 'Quelle est la date de ton anniversaire ?'] }),
  fe('da.mercredi', 'v-dates', 'mercredi', 'Wednesday', ['Monday', 'Tuesday', 'Thursday'], 'mercredi = Wednesday. Careful: mardi is Tuesday.', { hook: 'mardi (Mars), mercredi (Mercury), jeudi (Jupiter): the Roman gods hide in the days.' }),
  fe('da.jeudi', 'v-dates', 'jeudi', 'Thursday', ['Tuesday', 'Wednesday', 'Friday'], 'jeudi = Thursday, Jupiter’s day. vendredi (Friday) is Venus’s day.'),
  ef('da.aout', 'v-dates', 'August', 'août', ['avril', 'auguste', 'octobre'], 'August = août, said “oot”. The circumflex replaces an old s.', { hook: 'Many French circumflexes mark an s that has gone: août (from Latin augustus), forêt (forest), hôpital (hospital).' }),
  ef('da.juin', 'v-dates', 'June', 'juin', ['juillet', 'janvier', 'jeudi'], 'June = juin; July = juillet. Both start with ju-, so learn them as a pair.'),
  order('da.days', 'v-dates', 'Put the days of the week in order, starting with Monday.', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'], 'The French week starts on Monday: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.'),
  order('da.months', 'v-dates', 'Put these months in order.', ['juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'], 'juillet, août, septembre, octobre, novembre, décembre.'),
  mcq('da.onze', 'v-dates', 'Which is correct for “the 11th of November”?', [['le onze novembre', true], ['l’onze novembre', false, 'There is no l’ before onze (or huit): le onze, le huit.'], ['le onzième novembre', false, 'French dates use plain numbers, except the 1st (le premier).']], 'le onze novembre. No elision before onze or huit.'),
  fe('da.aujourdhui', 'v-dates', 'Aujourd’hui, c’est mercredi.', 'Today is Wednesday.', ['Tomorrow is Wednesday.', 'Yesterday was Wednesday.', 'Today is Monday.'], 'aujourd’hui = today, demain = tomorrow, hier = yesterday.', { accept: ['today it is Wednesday', 'it’s Wednesday today', 'today it’s Wednesday', 'it is Wednesday today'] }),
  mcq('da.lelundi', 'v-dates', '“Le lundi, j’ai maths.” What does **le lundi** mean here?', [['on Mondays (every week)', true], ['on Monday (just this one)', false, 'For one particular day, French uses the day on its own: lundi, je vais au cinéma.'], ['the Monday after next', false, 'le lundi means every Monday.']], 'le + day = every week on that day: le samedi, je joue au foot (on Saturdays I play football).'),
);

// --- telling the time
push(
  tmpl('ti.time', 'v-time', 'y8frTime'),
  ef('ti.quelle', 'v-time', 'What time is it?', 'Quelle heure est-il ?', ['Quel temps fait-il ?', 'Quel âge as-tu ?', 'C’est quelle date ?'], 'Quelle heure est-il ? Answer: Il est… heures. (Quel temps fait-il ? asks about the weather!)', { accept: ['Il est quelle heure ?', 'Quelle heure il est ?'] }),
  mcq('ti.une', 'v-time', 'Which is right for 1:00?', [['Il est une heure.', true], ['Il est un heure.', false, 'heure is feminine, so it is une heure.'], ['Il est une heures.', false, 'One hour, so no s on heure.']], 'Il est une heure (1:00), il est deux heures (2:00).'),
  fe('ti.midi', 'v-time', 'midi', 'midday', ['midnight', 'half past twelve', 'the afternoon'], 'midi = midday (12 noon); minuit = midnight.', { accept: ['noon', '12 noon', 'twelve noon', '12 o’clock midday', 'twelve o’clock'] }),
  fe('ti.minuit', 'v-time', 'minuit', 'midnight', ['midday', 'half past eleven', 'the night'], 'minuit = midnight; la nuit = the night.', { accept: ['12 midnight', 'twelve midnight'] }),
  mcq('ti.demie', 'v-time', 'Il est deux heures et demie. What time is it?', [['2:30', true], ['1:30', false, 'Half past two: French says the hour that has passed, then et demie.'], ['2:15', false, 'et quart is quarter past; et demie is half past.']], 'et demie = half past: 2:30.', { hear: 'Il est deux heures et demie.' }),
  mcq('ti.moins', 'v-time', 'Il est six heures moins le quart. What time is it?', [['5:45', true], ['6:15', false, 'That would be six heures et quart.'], ['6:45', false, 'moins means minus: six o’clock minus a quarter = 5:45.']], 'moins le quart = quarter to: six heures moins le quart = 5:45.', { hear: 'Il est six heures moins le quart.' }),
  fe('ti.matin', 'v-time', 'du matin', 'in the morning', ['in the afternoon', 'in the evening', 'at night'], 'sept heures du matin = 7 am; trois heures de l’après-midi = 3 pm; huit heures du soir = 8 pm.', { accept: ['am', 'a.m.', 'of the morning'] }),
  fe('ti.soir', 'v-time', 'huit heures du soir', '8 pm', ['8 am', '8:30 pm', '9 pm'], 'du soir = in the evening: huit heures du soir = 8 pm (20:00).', { accept: ['8pm', '8 p.m.', 'eight pm', 'eight o’clock in the evening', '8 o’clock in the evening', '20:00', 'eight in the evening', '8 in the evening'] }),
  mcq('ti.17', 'v-time', 'Le train part à dix-sept heures. When does the train leave?', [['5 pm', true], ['7 pm', false, 'dix-sept is 17, not sept: 17:00 is 5 pm.'], ['5 am', false, 'The 24-hour clock: 17:00 is in the afternoon.'], ['7 am', false, 'dix-sept is 17: 17:00 is 5 pm.']], 'dix-sept heures = 17:00 = 5 pm. Take away 12 to change from the 24-hour clock.', { hear: 'Le train part à dix-sept heures.' }),
  ef('ti.a', 'v-time', 'at half past seven', 'à sept heures et demie', ['à sept heures et demi', 'à six heures et demie', 'à sept heures et quart'], 'à = at. heure is feminine, so demie has an e: sept heures et demie.', { accept: ['à sept heures trente'] }),
  mcq('ti.aquelle', 'v-time', 'What does **À quelle heure ?** mean?', [['At what time?', true], ['What time is it?', false, 'That is Quelle heure est-il ?'], ['For how many hours?', false, 'That would be Pendant combien d’heures ?']], 'À quelle heure ? = at what time? Answer with à: à huit heures.', { hear: 'À quelle heure ?' }),
);

// --- family and pets
push(
  fe('fa.frere', 'v-family', 'mon frère', 'my brother', ['my father', 'my sister', 'my uncle'], 'mon frère = my brother; ma sœur = my sister.'),
  fe('fa.soeur', 'v-family', 'ma sœur', 'my sister', ['my mother', 'my aunt', 'my daughter'], 'ma sœur = my sister. The œ is two letters joined (o + e).'),
  ef('fa.parents', 'v-family', 'my parents', 'mes parents', ['mon parents', 'ma parents', 'mes parent'], 'mes is “my” for plurals, whatever the gender: mes parents, mes sœurs.'),
  fe('fa.grandmere', 'v-family', 'ma grand-mère', 'my grandmother', ['my great-aunt', 'my godmother', 'my mother'], 'ma grand-mère = my grandmother; mon grand-père = my grandfather; mes grands-parents = my grandparents.', { accept: ['my grandma', 'my granny', 'my gran', 'my nan', 'my nana', 'my grandmum'] }),
  fe('fa.demi', 'v-family', 'mon demi-frère', 'my half-brother', ['my twin brother', 'my older brother', 'my brother-in-law'], 'un demi-frère is a half-brother or a stepbrother. A twin brother is un frère jumeau.', { accept: ['my stepbrother', 'my step-brother', 'my half brother'] }),
  fe('fa.unique', 'v-family', 'Je suis fille unique.', 'I am an only child.', ['I am a single girl.', 'I have one daughter.', 'I am the only girl here.'], 'fille unique (for a girl) or fils unique (for a boy) = an only child.', { accept: ['I’m an only child'] }),
  ef('fa.chien', 'v-family', 'I have a dog.', 'J’ai un chien.', ['J’ai une chien.', 'J’ai un chat.', 'Je suis un chien.'], 'chien is masculine: un chien. A cat is un chat.'),
  fe('fa.chats', 'v-family', 'Elle a deux chats.', 'She has two cats.', ['She has two horses.', 'He has two cats.', 'She has twelve cats.'], 'elle = she, il = he; deux = two, douze = twelve; un chat (cat), un cheval (horse).', { accept: ['she’s got two cats', 'she has 2 cats'], strict: true }),
  fe('fa.lapin', 'v-family', 'un lapin', 'a rabbit', ['a hamster', 'a guinea pig', 'a bird'], 'un lapin = a rabbit; un hamster; un cochon d’Inde (a guinea pig); un oiseau (a bird).', { accept: ['rabbit', 'a bunny'] }),
  ef('fa.poisson', 'v-family', 'a goldfish', 'un poisson rouge', ['un poisson d’or', 'une poisson rouge', 'un poison rouge'], 'A goldfish is a “red fish”: un poisson rouge. Careful: un poison (one s) is poison!'),
  mcq('fa.ilya', 'v-family', 'Dans ma famille, il y a quatre personnes. What does **il y a** mean?', [['there are', true], ['he has', false, 'il y a is a set phrase meaning “there is” or “there are”.'], ['I have', false, 'I have is j’ai.']], 'il y a = there is / there are: Dans ma famille, il y a quatre personnes = there are four people in my family.', { hear: 'Dans ma famille, il y a quatre personnes.' }),
  mcq('fa.sappelle', 'v-family', 'What does **Mon père s’appelle Marc** mean?', [['My father is called Marc.', true], ['My father calls Marc.', false, 's’appeler means to be called (to call oneself).'], ['My brother is called Marc.', false, 'mon père is my father; mon frère is my brother.']], 's’appeler = to be called: il s’appelle Marc = he is called Marc.', { hear: 'Mon père s’appelle Marc.' }),
  fe('fa.oncle', 'v-family', 'mon oncle', 'my uncle', ['my grandfather', 'my cousin', 'my nephew'], 'mon oncle = my uncle; ma tante = my aunt.'),
  fe('fa.cousine', 'v-family', 'ma cousine', 'my cousin', ['my aunt', 'my niece', 'my sister'], 'ma cousine is a girl cousin; mon cousin is a boy cousin.', { accept: ['my female cousin', 'my girl cousin', 'my cousin (a girl)'] }),
);

// --- describing people
push(
  fe('de.yeux', 'v-describe', 'J’ai les yeux bleus.', 'I have blue eyes.', ['I have blue hair.', 'He has blue eyes.', 'I have brown eyes.'], 'les yeux = the eyes (one eye is un œil). Eyes and hair take avoir and les: j’ai les yeux bleus.', { accept: ['I’ve got blue eyes', 'my eyes are blue'] }),
  ef('de.courts', 'v-describe', 'I have short hair.', 'J’ai les cheveux courts.', ['J’ai les cheveux court.', 'J’ai le cheveux courts.', 'J’ai les chevaux courts.'], 'les cheveux (hair) is plural, so courts takes an s. Careful: les chevaux are horses!', { accept: ['J’ai des cheveux courts.'] }),
  mcq('de.agree', 'v-describe', 'Léa est… (tall)', [['grande', true], ['grand', false, 'Léa is a girl, so add -e: grande.'], ['grands', false, '-s is for more than one person.']], 'Adjectives agree with the person: il est grand, elle est grande, ils sont grands, elles sont grandes.'),
  mcq('de.ils', 'v-describe', 'Mes frères sont… (tall)', [['grands', true], ['grand', false, 'More than one brother, so add -s: grands.'], ['grandes', false, 'grandes is for girls or women (feminine plural).']], 'Two or more boys: grands. Two or more girls: grandes.'),
  fe('de.drole', 'v-describe', 'drôle', 'funny', ['sad', 'kind', 'lazy'], 'drôle = funny (it does not change for a girl: elle est drôle).', { accept: ['amusing'] }),
  fe('de.sympa', 'v-describe', 'sympa', 'nice', ['sympathetic', 'shy', 'sporty'], 'sympa (short for sympathique) = nice, friendly. It is a false friend: it does not mean sympathetic.', { accept: ['friendly', 'kind', 'likeable', 'nice and friendly'] }),
  fe('de.timide', 'v-describe', 'timide', 'shy', ['tidy', 'tired', 'lazy'], 'timide = shy (timid). It ends in -e already, so it is the same for a girl.', { accept: ['timid'] }),
  fe('de.paresseux', 'v-describe', 'paresseux', 'lazy', ['chatty', 'hard-working', 'proud'], 'paresseux = lazy; for a girl: paresseuse. Hard-working is travailleur (travailleuse).'),
  ef('de.bavarde', 'v-describe', 'She is chatty.', 'Elle est bavarde.', ['Elle est bavard.', 'Il est bavarde.', 'Elle a bavarde.'], 'elle (she), so bavard takes -e: elle est bavarde.'),
  mcq('de.ni', 'v-describe', 'What does **Il n’est ni grand ni petit** mean?', [['He is neither tall nor short.', true], ['He is not tall but short.', false, 'ni… ni… = neither… nor…'], ['He is not very tall.', false, 'ni… ni… = neither… nor…']], 'ne… ni… ni… = neither… nor…: il n’est ni grand ni petit.', { hear: 'Il n’est ni grand ni petit.' }),
  fe('de.lunettes', 'v-describe', 'Je porte des lunettes.', 'I wear glasses.', ['I wear earrings.', 'I need glasses.', 'I have a beard.'], 'porter = to wear; des lunettes = glasses (always plural).', { accept: ['I’ve got glasses', 'I have glasses', 'I am wearing glasses', 'I’m wearing glasses'] }),
  mcq('de.petit', 'v-describe', 'How do you say “a small dog”?', [['un petit chien', true], ['un chien petit', false, 'petit is one of the short, common adjectives that go before the noun.'], ['une petite chien', false, 'chien is masculine: un petit chien.']], 'Most adjectives follow the noun, but beauty, age, goodness and size go before: un petit chien, une grande maison, un bon livre.', { hook: '**BAGS** adjectives go before the noun: Beauty (beau, joli), Age (jeune, vieux), Goodness (bon, mauvais), Size (grand, petit).' }),
  fe('de.roux', 'v-describe', 'Il a les cheveux roux.', 'He has red hair.', ['He has pink hair.', 'He has brown hair.', 'He has blond hair.'], 'roux = red or ginger, for hair (rouge is for other red things). Brown hair: les cheveux bruns or châtains.', { accept: ['he has ginger hair', 'he’s got red hair', 'he’s got ginger hair', 'he is a redhead', 'he’s a redhead'] }),
);

// --- school
push(
  fe('sc.eps', 'v-school', 'l’EPS', 'PE', ['RE', 'science', 'music'], 'l’EPS (éducation physique et sportive) = PE.', { accept: ['P.E.', 'physical education', 'sport', 'games'] }),
  fe('sc.histgeo', 'v-school', 'l’histoire-géo', 'history and geography', ['the history of art', 'geology and physics', 'religious education'], 'In France, history and geography are one subject: l’histoire-géographie, or l’histoire-géo for short.', { accept: ['history-geography', 'history geography', 'humanities', 'history and geog'] }),
  ef('sc.anglais', 'v-school', 'English (the school subject)', 'l’anglais', ['l’anglaise', 'le anglais', 'l’Angleterre'], 'Languages are masculine and have no capital letter: l’anglais, le français, l’espagnol. l’Angleterre is England.', { accept: ['anglais'] }),
  fe('sc.dessin', 'v-school', 'le dessin', 'art', ['design', 'drama', 'dance'], 'le dessin = art, drawing (at collège the subject is called les arts plastiques). A false friend: it is not design.', { accept: ['drawing', 'art (drawing)', 'art and design'] }),
  fe('sc.prefere', 'v-school', 'Ma matière préférée, c’est la musique.', 'My favourite subject is music.', ['My favourite teacher is a musician.', 'I prefer music to maths.', 'My worst subject is music.'], 'une matière = a school subject; préféré(e) = favourite.', C),
  ef('sc.adore', 'v-school', 'I love French.', 'J’adore le français.', ['J’adore français.', 'Je adore le français.', 'J’adore la français.'], 'Opinion verbs keep the article: j’adore le français, je déteste les maths. And je becomes j’ before a vowel.'),
  mcq('sc.parceque', 'v-school', 'What does **parce que c’est difficile** mean in “Je déteste la chimie parce que c’est difficile”?', [['because it is difficult', true], ['so it is difficult', false, 'parce que = because; donc = so.'], ['although it is hard', false, 'parce que = because.']], 'parce que = because. Add c’est + an adjective for a quick reason.', { hear: 'Je déteste la chimie parce que c’est difficile.' }),
  fe('sc.prof', 'v-school', 'le prof', 'the teacher', ['the pupil', 'the head teacher', 'the timetable'], 'le prof (short for le professeur) = the teacher; un(e) élève = a pupil.', { accept: ['teacher', 'a teacher', 'the schoolteacher'] }),
  fe('sc.emploi', 'v-school', 'l’emploi du temps', 'the timetable', ['the use of time', 'the break', 'the homework'], 'l’emploi du temps = the timetable.', { accept: ['timetable', 'the school timetable', 'the schedule', 'schedule'] }),
  fe('sc.recre', 'v-school', 'la récré', 'break', ['lunch', 'homework', 'the canteen'], 'la récré (short for la récréation) = break time.', { accept: ['break time', 'breaktime', 'the break', 'playtime', 'recess'] }),
  fe('sc.devoirs', 'v-school', 'les devoirs', 'homework', ['the exams', 'the lessons', 'the rules'], 'les devoirs = homework (it is plural in French).', { accept: ['the homework'] }),
  mcq('sc.college', 'v-school', 'In France, what is **le collège**?', [['secondary school, ages 11 to 15', true], ['a university, for students over 18', false, 'A false friend: university is l’université (or la fac).'], ['a sixth-form college, ages 16 to 18', false, 'From 15 to 18, French pupils go to le lycée.']], 'le collège = secondary school (ages 11–15); le lycée = ages 15–18.'),
  fe('sc.commence', 'v-school', 'Les cours commencent à huit heures.', 'Lessons start at eight o’clock.', ['Lessons finish at eight o’clock.', 'Lessons start at half past eight.', 'The courses last eight hours.'], 'les cours = lessons; commencer = to start, finir = to finish.', C),
);

// --- free time and sport
push(
  mcq('ft.jouer', 'v-freetime', 'Je joue… foot.', [['au', true], ['du', false, 'jouer de is for instruments: je joue du piano.'], ['à la', false, 'foot is masculine: à + le = au.']], 'jouer à for sports and games: je joue au foot (à + le = au), je joue à la pétanque.'),
  mcq('ft.piano', 'v-freetime', 'Je joue… piano.', [['du', true], ['au', false, 'For instruments use jouer de: de + le = du.'], ['de la', false, 'piano is masculine: de + le = du.']], 'jouer de for instruments: je joue du piano, de la guitare, de la batterie (drums).'),
  fe('ft.natation', 'v-freetime', 'Je fais de la natation.', 'I go swimming.', ['I go to the pool.', 'I like swimming.', 'I teach swimming.'], 'faire de + activity: je fais de la natation = I go swimming, I swim.', { accept: ['I swim', 'I do swimming', 'I go swimming'] }),
  ef('ft.velo', 'v-freetime', 'I go cycling.', 'Je fais du vélo.', ['Je joue au vélo.', 'Je fais de vélo.', 'Je vais du vélo.'], 'Activities that are not ball games take faire de: je fais du vélo (de + le = du).', { accept: ['Je fais du cyclisme.'] }),
  fe('ft.lire', 'v-freetime', 'J’aime lire.', 'I like reading.', ['I like laughing.', 'I like writing.', 'I would like to read.'], 'lire = to read (rire = to laugh, écrire = to write). After aimer the second verb stays in the infinitive.', { accept: ['I like to read', 'I enjoy reading', 'I love reading', 'I love to read'] }),
  fe('ft.libre', 'v-freetime', 'Pendant mon temps libre, je regarde des séries.', 'In my free time, I watch series.', ['In my free time, I look for series.', 'In good weather, I watch series.', 'In my free time, I watch films.'], 'le temps libre = free time; regarder = to watch. (le temps can also mean the weather, but not here.)', C),
  fe('ft.souvent', 'v-freetime', 'souvent', 'often', ['sometimes', 'never', 'always'], 'souvent = often; parfois = sometimes; toujours = always; ne… jamais = never.'),
  fe('ft.temps', 'v-freetime', 'de temps en temps', 'from time to time', ['all the time', 'in time', 'never'], 'de temps en temps = from time to time, now and then.', { accept: ['sometimes', 'now and then', 'now and again', 'occasionally', 'every now and then'] }),
  ef('ft.weekend', 'v-freetime', 'at the weekend', 'le week-end', ['au week-end', 'à la week-end', 'la week-end'], 'le week-end = at the weekend (no word for “at”). It is masculine.', { accept: ['le weekend', 'pendant le week-end', 'pendant le weekend'] }),
  mcq('ft.danser', 'v-freetime', 'Which means “I don’t like dancing”?', [['Je n’aime pas danser.', true], ['Je ne aime pas danser.', false, 'ne becomes n’ before a vowel: je n’aime pas.'], ['Je n’aime danser pas.', false, 'ne… pas goes round the verb aime.']], 'ne… pas goes round the verb: je n’aime pas danser.'),
  fe('ft.equipe', 'v-freetime', 'Je suis membre d’une équipe de basket.', 'I am in a basketball team.', ['I watch a basketball team.', 'I am a basketball coach.', 'I play basketball for fun.'], 'être membre de = to be a member of; une équipe = a team.', C),
  fe('ft.ennuyeux', 'v-freetime', 'C’est ennuyeux.', 'It’s boring.', ['It’s relaxing.', 'It’s fun.', 'It’s easy.'], 'ennuyeux = boring. Its opposite: amusant (fun) or passionnant (exciting).', { accept: ['it is boring', 'that’s boring', 'that is boring'] }),
  fe('ft.genial', 'v-freetime', 'C’est génial !', 'It’s great!', ['It’s gentle!', 'It’s terrible!', 'It’s general!'], 'génial = great, brilliant. nul = rubbish.', { accept: ['it is great', 'it’s brilliant', 'it’s amazing', 'it’s fantastic', 'it’s awesome', 'that’s great', 'that’s brilliant', 'it’s cool'] }),
);

// --- food, drink and meals
push(
  fe('fo.petitdej', 'v-food', 'le petit déjeuner', 'breakfast', ['lunch', 'dinner', 'a snack'], 'le petit déjeuner (breakfast), le déjeuner (lunch), le goûter (after-school snack), le dîner (dinner).', { accept: ['the breakfast'] }),
  fe('fo.dejeuner', 'v-food', 'le déjeuner', 'lunch', ['breakfast', 'dinner', 'a snack'], 'le déjeuner = lunch. Add petit and it becomes breakfast: le petit déjeuner.', { accept: ['the lunch'] }),
  fe('fo.gouter', 'v-food', 'le goûter', 'the after-school snack', ['the first course of dinner', 'the pudding after lunch', 'a tasting session'], 'le goûter is the snack French children have after school, around 4 pm: perhaps bread and chocolate. (The verb goûter means to taste.)', { accept: ['afternoon snack', 'snack', 'after-school snack', 'after school snack', 'the snack', 'the afternoon snack', 'tea (a snack)'] }),
  ef('fo.eau', 'v-food', 'I drink water.', 'Je bois de l’eau.', ['Je bois du eau.', 'Je bois de la eau.', 'Je boit de l’eau.'], 'Before a vowel, du and de la both become de l’: de l’eau. And it is je bois (il boit).'),
  fe('fo.pdt', 'v-food', 'une pomme de terre', 'a potato', ['an apple', 'a pear', 'a tomato'], 'une pomme de terre = a potato, literally “an apple of the earth”. une pomme = an apple.', { accept: ['potato'] }),
  fe('fo.poulet', 'v-food', 'le poulet', 'chicken', ['pork', 'fish', 'beef'], 'le poulet = chicken; le porc = pork; le poisson = fish; le bœuf = beef.', { accept: ['the chicken'] }),
  ef('fo.frites', 'v-food', 'chips (French fries)', 'des frites', ['des chips', 'des pommes', 'des fruits'], 'des frites = chips. Careful: des chips in French are crisps!', { accept: ['les frites', 'frites'] }),
  fe('fo.vege', 'v-food', 'Je suis végétarienne.', 'I am vegetarian.', ['I am vegan.', 'I eat vegetables.', 'I am hungry.'], 'végétarien (for a boy), végétarienne (for a girl). Vegan is végane or végan.', { accept: ['I’m vegetarian', 'I am a vegetarian', 'I’m a vegetarian'] }),
  fe('fo.faim', 'v-food', 'J’ai faim.', 'I am hungry.', ['I am thirsty.', 'I am tired.', 'I have finished.'], 'French uses avoir: j’ai faim (I am hungry), j’ai soif (I am thirsty).', { accept: ['I’m hungry'] }),
  mcq('fo.pain', 'v-food', 'How do you say “I eat bread”?', [['Je mange du pain.', true], ['Je mange de pain.', false, 'de alone is for after a negative: je ne mange pas de pain.'], ['Je mange pain.', false, 'French needs a word for “some” here: du pain.']], 'Food in general takes du, de la or des (“some”): je mange du pain.'),
  fe('fo.legumes', 'v-food', 'les légumes', 'vegetables', ['pulses', 'fruit', 'salad'], 'les légumes = vegetables (a false friend for the English “legumes”); les fruits = fruit.', { accept: ['the vegetables', 'veg', 'veggies'] }),
  mcq('fo.appetit', 'v-food', 'What do French people say to each other before a meal?', [['Bon appétit !', true], ['Bonne chance !', false, 'Bonne chance means good luck.'], ['Bonne nuit !', false, 'Bonne nuit means good night.']], 'Bon appétit ! = enjoy your meal.'),
  fe('fo.fromage', 'v-food', 'le fromage', 'cheese', ['butter', 'ham', 'milk'], 'le fromage = cheese; le beurre = butter; le jambon = ham; le lait = milk.', { accept: ['the cheese'] }),
  ef('fo.viande', 'v-food', 'I don’t eat meat.', 'Je ne mange pas de viande.', ['Je ne mange pas de la viande.', 'Je ne mange pas du viande.', 'Je ne mange de viande pas.'], 'After a negative, du, de la and des all become de: je ne mange pas de viande.'),
);

// --- at the café and the market
push(
  ef('ca.chocolat', 'v-cafe', 'I would like a hot chocolate.', 'Je voudrais un chocolat chaud.', ['Je voudrais une chocolat chaud.', 'Je voudrais un chaud chocolat.', 'Je voudrais un chocolat froid.'], 'Je voudrais = I would like. Un chocolat chaud: chaud comes after the noun.'),
  fe('ca.addition', 'v-cafe', 'Voici l’addition.', 'Here is the bill.', ['Here is the menu.', 'Here is the change.', 'Here is the addition.'], 'l’addition = the bill (in a café or restaurant).', { accept: ['here’s the bill', 'here is the check', 'here’s the check'] }),
  fact('ca.carte', 'v-cafe', 'At a café, the waiter brings you **la carte**. What is it?', 'the menu', ['the bill', 'the cutlery', 'the change'], 'la carte = the menu. (In a restaurant, un menu is a fixed-price set meal.)', { hear: 'la carte', learn: 'At a café, **la carte** = the menu', accept: ['menu', 'a menu'] }),
  mcq('ca.waiter', 'v-cafe', 'How do you call the waiter politely?', [['S’il vous plaît, monsieur !', true], ['Garçon, venez ici !', false, 'Garçon is old-fashioned and sounds rude today.'], ['Salut, mon pote, ça va ?', false, 'Far too familiar for a waiter: mon pote means “mate”.']], 'S’il vous plaît, monsieur (or madame) ! is polite. Or try Excusez-moi !'),
  fe('ca.prendre', 'v-cafe', 'Je vais prendre une crêpe.', 'I’ll have a pancake.', ['I’ll make a pancake.', 'I’ll pay for a pancake.', 'I’ve had a pancake.'], 'prendre = to take, but when ordering food it means “to have”. Je vais prendre… = I’ll have…', { accept: ['I’m going to have a crêpe', 'I will have a crêpe', 'I’ll have a crêpe', 'I am going to have a crêpe', 'I will have a pancake', 'I’m going to have a pancake'] }),
  ef('ca.fromage', 'v-cafe', '500 grams of cheese', 'cinq cents grammes de fromage', ['cinq cent grammes de fromage', 'cinq cents grammes du fromage', 'cinq cents grammes des fromages'], 'Quantities take de: cinq cents grammes de fromage. (A market seller may also say une livre de fromage: a livre is half a kilo.)', { accept: ['500 grammes de fromage', 'une livre de fromage', '500 g de fromage'] }),
  fe('ca.tranche', 'v-cafe', 'une tranche de jambon', 'a slice of ham', ['a piece of cheese', 'a slice of bread', 'a tin of ham'], 'une tranche = a slice; le jambon = ham.', { accept: ['slice of ham'] }),
  fe('ca.bouteille', 'v-cafe', 'une bouteille d’eau', 'a bottle of water', ['a glass of water', 'a jug of water', 'a can of lemonade'], 'une bouteille = a bottle; un verre = a glass; une carafe = a jug.', { accept: ['bottle of water'] }),
  mcq('ca.kilo', 'v-cafe', 'Quantities always take **de**. How do you say “a kilo of apples”?', [['un kilo de pommes', true], ['un kilo des pommes', false, 'After a quantity, just de: un kilo de pommes.'], ['un kilo du pommes', false, 'After a quantity, just de.']], 'un kilo de pommes, un paquet de chips, une boîte de thon: always de (d’ before a vowel).'),
  fe('ca.tout', 'v-cafe', 'C’est tout ?', 'Is that everything?', ['Is it all right?', 'Is that for you?', 'Is that expensive?'], 'C’est tout ? = is that everything? Answer: Oui, c’est tout, merci.', { accept: ['is that all', 'is that it', 'anything else'] }),
  fe('ca.fait', 'v-cafe', 'Ça fait combien ?', 'How much does that come to?', ['What does that do?', 'How long does it take?', 'Is that enough?'], 'Ça fait combien ? = how much is that altogether? Answer: Ça fait dix euros.', { accept: ['how much is that', 'how much is it', 'how much does it come to', 'how much altogether', 'how much is that altogether'] }),
  mcq('ca.bill', 'v-cafe', 'How do you ask the waiter for the bill?', [['L’addition, s’il vous plaît.', true], ['L’addition, s’il te plaît.', false, 'Use vous to a waiter: s’il vous plaît.'], ['La carte, s’il vous plaît.', false, 'la carte is the menu.']], 'L’addition, s’il vous plaît. Use vous with a waiter.'),
  fe('ca.peches', 'v-cafe', 'Au marché, j’achète des pêches.', 'At the market, I buy peaches.', ['At the market, I buy fish.', 'At the market, I sell peaches.', 'At the market, I eat peaches.'], 'une pêche = a peach (le poisson = fish); acheter = to buy, vendre = to sell.', C),
  fe('ca.monnaie', 'v-cafe', 'la monnaie', 'change', ['the bill', 'the purse', 'the receipt'], 'la monnaie = change (coins given back). Voici votre monnaie = here is your change.', { accept: ['small change', 'coins', 'loose change', 'the change'] }),
);

// --- my town and directions
push(
  fe('to.chateau', 'v-town', 'Dans ma ville, il y a un château.', 'In my town, there is a castle.', ['In my town, there was a castle.', 'In my town, there is a hat.', 'In my village, there is a castle.'], 'il y a = there is; un château = a castle (un chapeau = a hat); une ville = a town.', C),
  ef('to.piscine', 'v-town', 'the swimming pool', 'la piscine', ['le piscine', 'la natation', 'la plage'], 'la piscine = the swimming pool; la natation = swimming; la plage = the beach.'),
  fe('to.gare', 'v-town', 'la gare', 'the railway station', ['the garage', 'the car park', 'the bus stop'], 'la gare = the railway station (la gare routière = the bus station).', { accept: ['the station', 'the train station', 'railway station', 'station', 'train station'] }),
  fe('to.biblio', 'v-town', 'la bibliothèque', 'the library', ['the bookshop', 'the bakery', 'the museum'], 'la bibliothèque = the library. Careful: la librairie is a bookshop!', { accept: ['library', 'a library'] }),
  fe('to.librairie', 'v-town', 'la librairie', 'the bookshop', ['the library', 'the newsagent', 'the stationer’s'], 'la librairie = the bookshop: a false friend. A library is la bibliothèque.', { accept: ['bookshop', 'bookstore', 'the bookstore', 'a bookshop'] }),
  fe('to.gauche', 'v-town', 'Tournez à gauche.', 'Turn left.', ['Turn right.', 'Go straight on.', 'Cross the road.'], 'à gauche = left; à droite = right; tout droit = straight on.', { accept: ['turn to the left', 'turn left'] }),
  fe('to.droit', 'v-town', 'Allez tout droit.', 'Go straight on.', ['Turn right.', 'Go all the way back.', 'Go to the right.'], 'tout droit = straight on. Don’t mix it up with à droite (right).', { accept: ['go straight ahead', 'straight on', 'carry on straight', 'keep going straight on', 'go straight'] }),
  mcq('to.droite', 'v-town', 'Which means “on the right”?', [['à droite', true], ['tout droit', false, 'tout droit means straight on.'], ['à gauche', false, 'à gauche means on the left.']], 'à droite = on the right; à gauche = on the left; tout droit = straight on.'),
  ef('to.ou', 'v-town', 'Where is the station?', 'Où est la gare ?', ['Où sont la gare ?', 'Où et la gare ?', 'Où est le gare ?'], 'où (with an accent) = where; ou (no accent) = or. la gare is feminine.', { accept: ['Où se trouve la gare ?', 'La gare, c’est où ?', 'C’est où, la gare ?', 'C’est où la gare ?'] }),
  fe('to.pres', 'v-town', 'C’est près d’ici.', 'It’s near here.', ['It’s far from here.', 'It’s ready.', 'It’s opposite here.'], 'près d’ici = near here; loin d’ici = far from here.', { accept: ['it’s close to here', 'it’s nearby', 'it is near here', 'it’s close by', 'it is nearby', 'it is close to here'] }),
  fe('to.deuxieme', 'v-town', 'Prenez la deuxième rue à droite.', 'Take the second street on the right.', ['Take the second street on the left.', 'Take the first street on the right.', 'Cross the second street on the right.'], 'prenez = take; la deuxième rue = the second street; à droite = on the right.', C),
  fe('to.centre', 'v-town', 'le centre-ville', 'the town centre', ['the shopping centre', 'the village', 'the suburbs'], 'le centre-ville = the town centre; un centre commercial = a shopping centre.', { accept: ['town centre', 'city centre', 'the city centre', 'downtown'] }),
  mcq('to.cinema', 'v-town', 'Je vais… cinéma.', [['au', true], ['à le', false, 'à + le always becomes au.'], ['à la', false, 'cinéma is masculine: au cinéma.']], 'à + le = au: je vais au cinéma. But à la piscine, à l’école, aux magasins.'),
  fe('to.village', 'v-town', 'J’habite dans un petit village à la campagne.', 'I live in a small village in the countryside.', ['I live in a small town by the sea.', 'I live in a big village in the mountains.', 'I lived in a small village in the country.'], 'à la campagne = in the countryside; au bord de la mer = by the sea; à la montagne = in the mountains.', C),
);

// --- home and my bedroom
push(
  fe('ho.maison', 'v-home', 'J’habite dans une maison.', 'I live in a house.', ['I live in a flat.', 'I live in a castle.', 'I am at home.'], 'une maison = a house; un appartement = a flat; à la maison = at home.', { accept: ['I live in a house'] }),
  ef('ho.appart', 'v-home', 'a flat', 'un appartement', ['une appartement', 'un apartement', 'un appartment'], 'un appartement: double p, like English “apartment” with an extra p and an extra e.'),
  fe('ho.chambre', 'v-home', 'ma chambre', 'my bedroom', ['my kitchen', 'my living room', 'my bathroom'], 'ma chambre = my bedroom (une chambre is a bedroom, not any room).', { accept: ['my room'] }),
  fe('ho.cuisine', 'v-home', 'la cuisine', 'the kitchen', ['the cousin', 'the dining room', 'the cellar'], 'la cuisine = the kitchen (and also cooking). The cousin is le cousin or la cousine.', { accept: ['kitchen', 'cooking', 'the cooking'] }),
  fe('ho.salon', 'v-home', 'le salon', 'the living room', ['the hall', 'the bedroom', 'the garden'], 'le salon = the living room, the lounge.', { accept: ['the lounge', 'the sitting room', 'living room', 'lounge', 'sitting room'] }),
  fe('ho.sdb', 'v-home', 'la salle de bains', 'the bathroom', ['the dining room', 'the toilet', 'the classroom'], 'la salle de bains = the bathroom; la salle à manger = the dining room; les toilettes = the toilet.', { accept: ['bathroom'] }),
  ef('ho.jardin', 'v-home', 'the garden', 'le jardin', ['la jardin', 'le jardain', 'le garden'], 'le jardin = the garden (masculine).'),
  mcq('ho.sous', 'v-home', 'Mon chat est **sous** le lit. Where is the cat?', [['under the bed', true], ['on the bed', false, 'On is sur.'], ['next to the bed', false, 'Next to is à côté du lit.']], 'sous = under; sur = on.', { hear: 'Mon chat est sous le lit.' }),
  fe('ho.etagere', 'v-home', 'Mes livres sont sur l’étagère.', 'My books are on the shelf.', ['My books are under the shelf.', 'My books are on the desk.', 'My books are next to the shelf.'], 'sur = on; une étagère = a shelf; un bureau = a desk.', C),
  fe('ho.armoire', 'v-home', 'une armoire', 'a wardrobe', ['armour', 'an armchair', 'a drawer'], 'une armoire = a wardrobe or a tall cupboard. An armchair is un fauteuil.', { accept: ['wardrobe', 'a cupboard', 'a closet'] }),
  fe('ho.etage', 'v-home', 'au premier étage', 'on the first floor', ['on the ground floor', 'on the top floor', 'on the second floor'], 'au premier étage = on the first floor (one floor up, as in Britain); au rez-de-chaussée = on the ground floor.', { accept: ['first floor', 'the first floor'] }),
  ef('ho.partage', 'v-home', 'I share my bedroom with my sister.', 'Je partage ma chambre avec ma sœur.', ['Je partage mon chambre avec ma sœur.', 'Je partage ma chambre avec mon sœur.', 'Je partage ma chambre et ma sœur.'], 'chambre and sœur are both feminine, so ma chambre, ma sœur. avec = with.'),
  fe('ho.rangee', 'v-home', 'Ma chambre est bien rangée.', 'My bedroom is tidy.', ['My bedroom is very messy.', 'My bedroom is quite small.', 'My bedroom is in a row.'], 'rangé(e) = tidy; en désordre = messy.', C),
);

// --- weather and seasons
push(
  fe('we.beau', 'v-weather', 'Il fait beau.', 'The weather is nice.', ['He is handsome.', 'It’s hot.', 'It’s bad weather.'], 'il fait beau = the weather is nice (il est beau would be “he is handsome”!).', { accept: ['it’s nice weather', 'it is nice weather', 'it’s fine', 'it’s a nice day', 'the weather is good', 'the weather’s nice', 'it’s nice', 'it is fine', 'it’s good weather'] }),
  fe('we.pleut', 'v-weather', 'Il pleut.', 'It’s raining.', ['It’s snowing.', 'It’s crying.', 'It’s cloudy.'], 'il pleut = it’s raining (from pleuvoir). Careful: il pleure = he is crying.', { accept: ['it rains', 'it is raining'] }),
  fe('we.neige', 'v-weather', 'Il neige.', 'It’s snowing.', ['It’s freezing.', 'It’s raining.', 'It’s foggy.'], 'il neige = it’s snowing; la neige = snow; il gèle = it’s freezing.', { accept: ['it snows', 'it is snowing'] }),
  ef('we.chaud', 'v-weather', 'It’s hot. (the weather)', 'Il fait chaud.', ['Il est chaud.', 'Il fait froid.', 'J’ai chaud.'], 'Weather takes il fait: il fait chaud. J’ai chaud means “I feel hot”.'),
  fe('we.vent', 'v-weather', 'Il y a du vent.', 'It’s windy.', ['It’s sunny.', 'There is a storm.', 'It’s foggy.'], 'il y a du vent = it’s windy (literally “there is some wind”).', { accept: ['it is windy', 'there is wind', 'there’s wind', 'there is some wind'] }),
  fe('we.brouillard', 'v-weather', 'Il y a du brouillard.', 'It’s foggy.', ['It’s cloudy.', 'There’s a storm.', 'It’s drizzling.'], 'le brouillard = fog: il y a du brouillard = it’s foggy.', { accept: ['it is foggy', 'there is fog', 'there’s fog', 'it’s misty', 'there is some fog'] }),
  fe('we.orage', 'v-weather', 'un orage', 'a storm', ['an orange', 'a rainbow', 'a shower'], 'un orage = a (thunder)storm; un arc-en-ciel = a rainbow; une averse = a shower.', { accept: ['a thunderstorm', 'storm', 'thunderstorm'] }),
  mcq('we.printemps', 'v-weather', 'How do you say “in spring”?', [['au printemps', true], ['en printemps', false, 'Spring is the odd one out: au printemps, but en été, en automne, en hiver.'], ['à printemps', false, 'printemps is masculine and starts with a consonant: au printemps.']], 'au printemps; en été, en automne, en hiver.'),
  ef('we.hiver', 'v-weather', 'in winter', 'en hiver', ['au hiver', 'dans hiver', 'en l’hiver'], 'en hiver, en été, en automne, but au printemps.', { accept: ['l’hiver'] }),
  fe('we.automne', 'v-weather', 'l’automne', 'autumn', ['summer', 'winter', 'spring'], 'l’été (summer), l’automne (autumn), l’hiver (winter), le printemps (spring).', { accept: ['fall', 'the autumn'] }),
  fe('we.meteo', 'v-weather', 'la météo', 'the weather forecast', ['the meteor', 'the temperature', 'the climate'], 'la météo = the weather forecast (on TV, or the weather in general).', { accept: ['the weather', 'weather forecast', 'the forecast', 'weather'] }),
  mcq('we.temps', 'v-weather', 'What does **Quel temps fait-il ?** mean?', [['What’s the weather like?', true], ['What time is it?', false, 'That is Quelle heure est-il ?'], ['How long does it take?', false, 'That would be Ça prend combien de temps ?']], 'Quel temps fait-il ? = what’s the weather like? (le temps = the weather, or time.)', { hear: 'Quel temps fait-il ?' }),
  fe('we.degres', 'v-weather', 'Il fait vingt degrés.', 'It’s twenty degrees.', ['It’s two degrees.', 'It’s minus twenty.', 'It’s twelve degrees.'], 'vingt = 20; deux = 2; douze = 12. Temperatures use il fait too.', { accept: ['it is 20 degrees', 'it’s 20 degrees', 'it is twenty degrees', 'it’s 20°'] }),
);

// --- holidays and travel
push(
  fe('hol.vacances', 'v-holidays', 'les vacances', 'the holidays', ['the vacancies', 'the journey', 'the luggage'], 'les vacances = the holidays (always plural). Les grandes vacances are the summer holidays.', { accept: ['holidays', 'holiday', 'the holiday', 'vacation', 'the vacation'] }),
  ef('hol.train', 'v-holidays', 'by train', 'en train', ['à train', 'au train', 'dans train'], 'You ride inside a train, so en train (like en voiture, en avion).', { accept: ['par le train'] }),
  ef('hol.pied', 'v-holidays', 'on foot', 'à pied', ['en pied', 'au pied', 'par pied'], 'à pied = on foot; à vélo = by bike.'),
  fe('hol.allee', 'v-holidays', 'L’année dernière, je suis allée en Espagne.', 'Last year, I went to Spain.', ['Next year, I am going to Spain.', 'Last year, I went to Switzerland.', 'Last week, I went to Spain.'], 'l’année dernière = last year; je suis allée = I went (allée with an e because the speaker is a girl); l’Espagne = Spain, la Suisse = Switzerland.', C),
  fe('hol.italie', 'v-holidays', 'L’été prochain, je vais aller en Italie.', 'Next summer, I am going to go to Italy.', ['Last summer, I went to Italy.', 'Every summer, I go to Italy.', 'Next summer, I am going to go to Spain.'], 'prochain = next; je vais aller = I am going to go (the near future).', C),
  mcq('hol.portugal', 'v-holidays', 'How do you say “I am going to Portugal”?', [['Je vais au Portugal.', true], ['Je vais en Portugal.', false, 'Masculine countries take au: au Portugal, au Canada.'], ['Je vais à Portugal.', false, 'à on its own is for towns: à Lisbonne.']], 'Feminine countries (most end in -e) take en: en France. Masculine ones take au: au Portugal. Towns take à: à Paris.'),
  fe('hol.camping', 'v-holidays', 'Nous avons fait du camping.', 'We went camping.', ['We made a campsite.', 'We stayed in a hotel.', 'We went to the countryside.'], 'faire du camping = to go camping; nous avons fait = we did (the perfect tense).', { accept: ['we camped', 'we did camping', 'we went camping'] }),
  fe('hol.plage', 'v-holidays', 'à la plage', 'at the beach', ['at the pool', 'in the mountains', 'at the market'], 'à la plage = at (or to) the beach; à la montagne = in (or to) the mountains.', { accept: ['to the beach', 'at the seaside', 'on the beach', 'to the seaside'] }),
  fe('hol.montagne', 'v-holidays', 'à la montagne', 'in the mountains', ['at the seaside', 'in the countryside', 'in the forest'], 'à la montagne = in (or to) the mountains, even though montagne is singular.', { accept: ['to the mountains', 'in the mountain', 'to the mountain', 'at the mountains'] }),
  fe('hol.valise', 'v-holidays', 'une valise', 'a suitcase', ['a valley', 'a wallet', 'a passport'], 'une valise = a suitcase; faire sa valise = to pack.', { accept: ['suitcase', 'a case'] }),
  fe('hol.billet', 'v-holidays', 'un billet aller-retour', 'a return ticket', ['a single ticket', 'a day ticket', 'a ticket office'], 'un aller-retour (there and back) = a return ticket; un aller simple = a single.', { accept: ['return ticket', 'a round-trip ticket'] }),
  fe('hol.cetait', 'v-holidays', 'C’était super !', 'It was great!', ['It is great!', 'It will be great!', 'It wasn’t great!'], 'c’était = it was (c’est = it is; ce sera = it will be).', { accept: ['it was brilliant', 'it was amazing', 'it was fantastic', 'it was awesome', 'it was super', 'that was great'] }),
  fe('hol.soleil', 'v-holidays', 'J’ai pris un coup de soleil.', 'I got sunburnt.', ['I saw the sunset.', 'I sunbathed.', 'I took a sunny photo.'], 'un coup de soleil = sunburn (literally “a hit of sun”).', { accept: ['I got sunburned', 'I got a sunburn', 'I got sunburn'] }),
  ef('hol.passeport', 'v-holidays', 'my passport', 'mon passeport', ['mon passport', 'ma passeport', 'mon passe-port'], 'le passeport: spelled with an e in the middle (passe + port).'),
);

// --- clothes, colours and shopping
push(
  fe('cl.jean', 'v-clothes', 'Je porte un jean.', 'I’m wearing jeans.', ['I’m wearing a jacket.', 'I’m wearing a skirt.', 'I’m wearing trainers.'], 'un jean = jeans (one pair, singular in French); porter = to wear.', { accept: ['I wear jeans', 'I am wearing jeans', 'I’m wearing a pair of jeans', 'I wear a pair of jeans'] }),
  ef('cl.robe', 'v-clothes', 'a dress', 'une robe', ['un robe', 'une rob', 'une jupe'], 'une robe = a dress; une jupe = a skirt.'),
  fe('cl.jupe', 'v-clothes', 'une jupe', 'a skirt', ['a jumper', 'a jacket', 'a dress'], 'une jupe = a skirt; un pull = a jumper; une veste = a jacket.', { accept: ['skirt'] }),
  fe('cl.pull', 'v-clothes', 'un pull', 'a jumper', ['a coat', 'a shirt', 'a scarf'], 'un pull = a jumper; un manteau = a coat; une chemise = a shirt; une écharpe = a scarf.', { accept: ['a sweater', 'jumper', 'sweater', 'a pullover', 'pullover'] }),
  fe('cl.chaussures', 'v-clothes', 'des chaussures', 'shoes', ['socks', 'boots', 'trousers'], 'des chaussures = shoes; des chaussettes = socks; des bottes = boots; un pantalon = trousers.', { accept: ['some shoes'] }),
  mcq('cl.rouge', 'v-clothes', 'How do you say “a red skirt”?', [['une jupe rouge', true], ['une rouge jupe', false, 'Colours go after the noun.'], ['un jupe rouge', false, 'jupe is feminine: une jupe.']], 'Colours come after the noun: une jupe rouge.'),
  mcq('cl.verte', 'v-clothes', 'How do you say “a green dress”?', [['une robe verte', true], ['une robe vert', false, 'robe is feminine, so vert becomes verte.'], ['une verte robe', false, 'Colours go after the noun.']], 'robe is feminine, so the colour agrees: une robe verte.'),
  mcq('cl.marron', 'v-clothes', 'How do you say “brown shoes”?', [['des chaussures marron', true], ['des chaussures marrons', false, 'marron (like orange) never changes: it is the name of a chestnut.'], ['des marron chaussures', false, 'Colours go after the noun.']], 'marron and orange are named after things (a chestnut, an orange), so they never change: des chaussures marron.'),
  mcq('cl.blanche', 'v-clothes', 'How do you say “a white shirt”?', [['une chemise blanche', true], ['une chemise blanc', false, 'chemise is feminine, so blanc becomes blanche.'], ['une chemise blance', false, 'The feminine of blanc is blanche.']], 'blanc → blanche (feminine). Learn it with its partner: une chemise blanche, un pull blanc.'),
  fe('cl.essayer', 'v-clothes', 'Je peux l’essayer ?', 'Can I try it on?', ['Can I pay for it?', 'Can I exchange it?', 'Can I have a bag?'], 'essayer = to try (on); payer = to pay; échanger = to exchange.', { accept: ['may I try it on', 'could I try it on', 'can I try it'] }),
  fe('cl.taille', 'v-clothes', 'Quelle taille ?', 'What size?', ['What colour?', 'How much?', 'Which shop?'], 'la taille = the size (for clothes); la pointure = shoe size; la couleur = the colour.', { accept: ['which size', 'what size is it', 'what size do you take'] }),
  fe('cl.cher', 'v-clothes', 'C’est trop cher.', 'It’s too expensive.', ['It’s too cheap.', 'It’s too big.', 'It’s very nice.'], 'cher = expensive; trop = too; pas cher = cheap.', { accept: ['it is too expensive', 'that’s too expensive', 'that is too expensive', 'it’s too dear'] }),
  fe('cl.soldes', 'v-clothes', 'les soldes', 'the sales', ['the soldiers', 'the soles', 'the receipts'], 'les soldes = the sales (in shops). Un soldat is a soldier.', { accept: ['sales', 'the sale', 'sale'], strict: true }),
  mcq('cl.uniforme', 'v-clothes', 'In most French state secondary schools, pupils…', [['wear their own clothes', true], ['wear a blazer and tie', false, 'School uniform is rare in France.'], ['wear sports kit all day', false, 'They wear their own clothes and change for PE.']], 'Most French schools have no uniform: pupils wear their own clothes.'),
);

// --- my daily routine
push(
  fe('ro.reveille', 'v-routine', 'Je me réveille à sept heures.', 'I wake up at seven o’clock.', ['I get up at seven o’clock.', 'I go to bed at seven o’clock.', 'I wake up at six o’clock.'], 'se réveiller = to wake up; se lever = to get up; se coucher = to go to bed.', { accept: ['I wake up at seven', 'I wake up at 7', 'I wake up at 7 o’clock', 'I wake at seven', 'I wake at 7'] }),
  ef('ro.leve', 'v-routine', 'I get up.', 'Je me lève.', ['Je lève.', 'Je me lèves.', 'Me je lève.'], 'se lever is reflexive: je me lève (I get myself up). The -s ending is for tu: tu te lèves.'),
  fe('ro.douche', 'v-routine', 'Je me douche.', 'I have a shower.', ['I have a bath.', 'I get dressed.', 'I brush my teeth.'], 'se doucher = to have a shower; prendre un bain = to have a bath.', { accept: ['I shower', 'I take a shower', 'I have a shower', 'I get showered'] }),
  fe('ro.habille', 'v-routine', 'Je m’habille.', 'I get dressed.', ['I live.', 'I get undressed.', 'I wash.'], 's’habiller = to get dressed (j’habite = I live). Me becomes m’ before a vowel.', { accept: ['I dress', 'I dress myself', 'I get myself dressed'] }),
  ef('ro.dents', 'v-routine', 'I brush my teeth.', 'Je me brosse les dents.', ['Je me brosse les cheveux.', 'Je me brosse la dent.', 'Je me brosse les dent.'], 'With parts of the body, French uses les, not mes: je me brosse les dents (I brush the teeth for myself).'),
  fe('ro.couche', 'v-routine', 'Je me couche à dix heures.', 'I go to bed at ten o’clock.', ['I get up at ten o’clock.', 'I go to sleep at two o’clock.', 'I lie down for ten hours.'], 'se coucher = to go to bed; dix = 10; deux = 2.', { accept: ['I go to bed at ten', 'I go to bed at 10', 'I go to bed at 10 o’clock'] }),
  fe('ro.dabord', 'v-routine', 'd’abord', 'first', ['then', 'finally', 'afterwards'], 'd’abord (first), ensuite (then, next), après (after), enfin (finally).', { accept: ['first of all', 'firstly', 'at first'] }),
  fe('ro.ensuite', 'v-routine', 'ensuite', 'then', ['first', 'finally', 'suddenly'], 'ensuite = then, next. Soudain = suddenly.', { accept: ['next', 'afterwards', 'after that'] }),
  fe('ro.enfin', 'v-routine', 'enfin', 'finally', ['first', 'then', 'in fact'], 'enfin = finally, at last. En fait = in fact.', { accept: ['at last', 'lastly', 'in the end'] }),
  mcq('ro.petitdej', 'v-routine', 'What does **Je prends le petit déjeuner** mean?', [['I have breakfast.', true], ['I make breakfast.', false, 'To make is préparer: je prépare le petit déjeuner.'], ['I skip breakfast.', false, 'prendre here means to have (a meal).']], 'prendre (to take) is used for meals and drinks: je prends le petit déjeuner = I have breakfast.', { hear: 'Je prends le petit déjeuner.' }),
  order('ro.order', 'v-routine', 'Put the morning in order.', ['Je me réveille.', 'Je me lève.', 'Je m’habille.', 'Je quitte la maison.', 'J’arrive au collège.'], 'Wake up, get up, get dressed, leave the house, arrive at school.'),
  fe('ro.bus', 'v-routine', 'Je vais au collège en bus.', 'I go to school by bus.', ['I go to college by bus.', 'I walk to school.', 'I go to school by car.'], 'le collège = secondary school (a false friend); en bus = by bus; à pied = on foot; en voiture = by car.', { accept: ['I go to school on the bus', 'I get the bus to school', 'I take the bus to school', 'I go to secondary school by bus'] }),
  fe('ro.soir', 'v-routine', 'le soir', 'in the evening', ['in the morning', 'at night', 'in the afternoon'], 'le matin (in the morning), l’après-midi (in the afternoon), le soir (in the evening), la nuit (at night).', { accept: ['the evening', 'evening', 'in the evenings'] }),
);

// --- the body and health
push(
  fe('he.tete', 'v-health', 'J’ai mal à la tête.', 'I have a headache.', ['I have a sore throat.', 'I hit my head.', 'I have a stomach ache.'], 'avoir mal à + body part = to have a pain in…: j’ai mal à la tête = my head hurts.', { accept: ['I’ve got a headache', 'my head hurts', 'I have a head ache'] }),
  ef('he.ventre', 'v-health', 'I have a stomach ache.', 'J’ai mal au ventre.', ['J’ai mal à le ventre.', 'Je suis mal au ventre.', 'J’ai mal aux ventre.'], 'le ventre is masculine, so à + le = au: j’ai mal au ventre.', { accept: ['J’ai mal à l’estomac.'] }),
  mcq('he.dents', 'v-health', 'What does **J’ai mal aux dents** mean?', [['I have toothache.', true], ['I have a sore throat.', false, 'That is j’ai mal à la gorge.'], ['My feet hurt.', false, 'That is j’ai mal aux pieds.']], 'les dents (plural), so à + les = aux: j’ai mal aux dents.', { hear: 'J’ai mal aux dents.' }),
  fe('he.gorge', 'v-health', 'la gorge', 'the throat', ['the neck', 'the chest', 'the jaw'], 'la gorge = the throat: j’ai mal à la gorge = I have a sore throat. The neck is le cou.', { accept: ['throat'] }),
  fe('he.bras', 'v-health', 'le bras', 'the arm', ['the leg', 'the hand', 'the shoulder'], 'le bras = the arm; la main = the hand; l’épaule = the shoulder.', { accept: ['arm'] }),
  fe('he.jambe', 'v-health', 'la jambe', 'the leg', ['the ham', 'the knee', 'the foot'], 'la jambe = the leg (le jambon = ham); le genou = the knee.', { accept: ['leg'] }),
  fe('he.pied', 'v-health', 'le pied', 'the foot', ['the knee', 'the hand', 'the toe'], 'le pied = the foot; à pied = on foot; un doigt de pied = a toe.', { accept: ['foot'] }),
  fe('he.malade', 'v-health', 'Je suis malade.', 'I am ill.', ['I am sad.', 'I am tired.', 'I am bad.'], 'malade = ill; triste = sad; fatigué(e) = tired.', { accept: ['I’m ill', 'I am sick', 'I’m sick', 'I’m unwell', 'I am unwell'] }),
  fe('he.fievre', 'v-health', 'J’ai de la fièvre.', 'I have a temperature.', ['I have the flu.', 'I have a cold.', 'I have a cough.'], 'la fièvre = a fever, a temperature; la grippe = flu; un rhume = a cold; la toux = a cough.', { accept: ['I’ve got a temperature', 'I have a fever', 'I’ve got a fever', 'I have a high temperature'] }),
  fe('he.rhume', 'v-health', 'un rhume', 'a cold', ['a cough', 'flu', 'a rash'], 'un rhume = a cold: j’ai un rhume, I have a cold.', { accept: ['cold', 'the common cold'] }),
  fe('he.pharmacie', 'v-health', 'Allez à la pharmacie.', 'Go to the chemist’s.', ['Go to the farm.', 'Go to the doctor’s.', 'Go to hospital.'], 'la pharmacie = the chemist’s (look for the green cross); le médecin = the doctor; l’hôpital = hospital.', { accept: ['go to the pharmacy', 'go to the chemist', 'go to the chemists'] }),
  fe('he.sante', 'v-health', 'Pour être en bonne santé, je mange beaucoup de fruits.', 'To be healthy, I eat lots of fruit.', ['To be healthy, I eat lots of sweets.', 'To be healthy, I eat fruit sometimes.', 'To be healthy, I do lots of sport.'], 'en bonne santé = healthy; beaucoup de = lots of.', C),
  mcq('he.genou', 'v-health', 'How do you say “my knee hurts”?', [['J’ai mal au genou.', true], ['J’ai mal à le genou.', false, 'à + le always becomes au.'], ['J’ai mal à genou.', false, 'You need the article: au genou (à + le).']], 'le genou is masculine: j’ai mal au genou.'),
  fe('he.coeur', 'v-health', 'le cœur', 'the heart', ['the choir', 'the chest', 'the lungs'], 'le cœur = the heart (le chœur, with an h, is a choir); les poumons = the lungs.', { accept: ['heart'] }),
);

// --- media, technology and the internet
push(
  fe('te.portable', 'v-tech', 'mon portable', 'my mobile phone', ['my tablet', 'my charger', 'my headphones'], 'mon portable = my mobile (short for mon téléphone portable). Un ordinateur portable is a laptop.', { accept: ['my mobile', 'my phone', 'my cell phone', 'my laptop', 'my mobile phone'] }),
  fe('te.ordi', 'v-tech', 'l’ordinateur', 'the computer', ['the printer', 'the keyboard', 'the order'], 'l’ordinateur (l’ordi for short) = the computer; l’imprimante = the printer; le clavier = the keyboard.', { accept: ['computer', 'the PC'] }),
  fe('te.messages', 'v-tech', 'J’envoie des messages à mes amis.', 'I send messages to my friends.', ['I get messages from my friends.', 'I sent messages to my friends.', 'I send emails to my parents.'], 'envoyer = to send (j’envoie); recevoir = to receive.', C),
  fe('te.reseaux', 'v-tech', 'les réseaux sociaux', 'social media', ['social workers', 'the news', 'the internet'], 'les réseaux sociaux = social networks, social media.', { accept: ['social networks', 'social networking', 'social media sites'] }),
  fe('te.telecharger', 'v-tech', 'télécharger', 'to download', ['to charge', 'to upload', 'to telephone'], 'télécharger = to download. To charge a phone is recharger.', { accept: ['download'] }),
  fe('te.emission', 'v-tech', 'une émission', 'a programme', ['an emission', 'an advert', 'a channel'], 'une émission = a programme (on TV or radio); une publicité (une pub) = an advert; une chaîne = a channel.', { accept: ['a TV programme', 'a show', 'a TV show', 'a program', 'a broadcast', 'a radio programme'] }),
  fe('te.chaine', 'v-tech', 'une chaîne', 'a channel', ['a chair', 'a screen', 'a series'], 'une chaîne = a TV channel (and also a chain). Une chaise = a chair.', { accept: ['a TV channel', 'channel', 'the channel', 'TV channel', 'a chain', 'chain'], strict: true }),
  fe('te.dessinanime', 'v-tech', 'un dessin animé', 'a cartoon', ['a drawing class', 'an animal drawing', 'a comic'], 'un dessin animé = a cartoon (an animated drawing); une BD (bande dessinée) = a comic.', { accept: ['cartoon', 'an animated film', 'an animation', 'an animated cartoon'] }),
  fe('te.jeux', 'v-tech', 'les jeux vidéo', 'video games', ['video clips', 'the games console', 'videos'], 'les jeux vidéo = video games (vidéo does not change in the plural); la console = the games console.', { accept: ['the video games', 'computer games'] }),
  mcq('te.motdepasse', 'v-tech', 'What does **Il ne faut jamais partager ton mot de passe** mean?', [['You must never share your password.', true], ['You must always share your password.', false, 'ne… jamais = never.'], ['You must never change your password.', false, 'partager = to share; changer = to change.']], 'il ne faut jamais = you must never; partager = to share; le mot de passe = the password.', { hear: 'Il ne faut jamais partager ton mot de passe.' }),
  fe('te.mdp', 'v-tech', 'le mot de passe', 'the password', ['the passport', 'the message', 'the username'], 'le mot de passe = the password (literally “the word for passing”); le passeport = the passport.', { accept: ['password'] }),
  fe('te.ecran', 'v-tech', 'l’écran', 'the screen', ['the keyboard', 'the mouse', 'the charger'], 'l’écran = the screen; le clavier = the keyboard; la souris = the mouse; le chargeur = the charger.', { accept: ['screen'] }),
  fe('te.avis', 'v-tech', 'À mon avis, Internet est utile mais dangereux.', 'In my opinion, the internet is useful but dangerous.', ['In my opinion, the internet is useless but safe.', 'In my opinion, the internet is useful and safe.', 'In my opinion, the internet is boring but useful.'], 'à mon avis = in my opinion; utile = useful (inutile = useless); mais = but.', C),
  fe('te.videos', 'v-tech', 'Je regarde des vidéos en ligne.', 'I watch videos online.', ['I make videos online.', 'I post videos online.', 'I watch films at the cinema.'], 'en ligne = online; regarder = to watch; faire = to make; publier = to post.', { accept: ['I watch online videos', 'I watch videos on the internet', 'I watch videos on line'] }),
);

// --- French typography: a non-breaking space before ? ! : ; (English never has a space there)
const NB = ' ';
const typo = (v) => (typeof v === 'string' ? v.replace(/ ([?!:;])/g, `${NB}$1`) : Array.isArray(v) ? v.map(typo) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) : v);
const out = { subject: 'french', deck: 'y8', topics: topics.map(typo), items: items.map(typo) };

// guards: unique ids, every topic has items, French typed answers are marked
const ids = new Set();
for (const it of out.items) {
  if (ids.has(it.id)) throw new Error(`duplicate item ${it.id}`);
  ids.add(it.id);
  if (!out.topics.some((t) => t.id === it.topic)) throw new Error(`item ${it.id}: unknown topic ${it.topic}`);
}
for (const t of out.topics) if (!out.items.some((it) => it.topic === t.id)) throw new Error(`topic ${t.id} has no items`);

export default [out];

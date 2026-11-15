// Year 8 French grammar: seventeen topics from gender and the present tense (Year 7 revision, with a
// placement check) through modal and reflexive verbs to the near future, the perfect tense with
// avoir and être, and a first taste of the imperfect (the stretch topic). Hand-written items here;
// the endless conjugation drills come from js/gen/y8french.js (verb tables written out in full).
// Typed French answers carry lang: 'fr' (accents forgiven with a note, wrong endings never);
// `hear` is only French already shown in the prompt.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `french.${topic}.${id}`, topic: `french.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `french.${topic}.${id}`, topic: `french.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `french.${topic}.${id}`, topic: `french.${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
const tmpl = (topic, gen) => ({ id: `french.${topic}.tmpl`, topic: `french.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed: [-1, 0, 1] });
const FR = { lang: 'fr' };
const C = { formats: ['choice'] };
const hear = (h, extra = {}) => ({ hear: h, ...extra });

const T = (id, title, kind, prereqs, fields) => ({ id: `french.${id}`, title, kind, prereqs: prereqs.map((p) => `french.${p}`), batch: 5, ...fields });

const topics = [
  T('g-gender', 'Nouns, gender and articles', 'mixed', [], {
    diagnostic: ['french.g-gender.d1', 'french.g-gender.d2'],
    intro: 'Every French noun is masculine or feminine, and the little word in front shows which: le or un for masculine, la or une for feminine, l’ before a vowel or a silent h, and les or des in the plural. So learn every new noun with its article, never on its own. Some endings are good clues: -tion is feminine, and -age and -ment are usually masculine.',
    teach: 'Explain why you should always learn a new noun with le or la in front, using two examples.',
    talk: 'Point at things in the kitchen and ask {her} for the French word with le or la in front. If {she} is not sure of the gender, check together in a dictionary.',
    hook: 'Learn the article with the noun: **la** plage, **le** musée. **-tion** is feminine; **-age** is masculine, except **la plage**, **la page** and **l’image**.',
  }),
  T('g-er', 'The present tense: -er verbs', 'mixed', ['g-gender'], {
    diagnostic: ['french.g-er.d1', 'french.g-er.d2'],
    intro: 'Most French verbs end in -er, and they all work the same way: take off -er to find the stem (jouer → jou-), then add the ending for the person: -e, -es, -e, -ons, -ez, -ent. Je joue, tu joues, il joue and ils jouent all sound the same; only nous and vous sound different. A few verbs change their spelling: nous mangeons, nous commençons, j’achète, je préfère, j’appelle.',
    teach: 'Conjugate jouer aloud with all six pronouns, then explain why nous mangeons has an extra e.',
    talk: 'Say a short English phrase such as “we play” or “they watch”. {She} says it in French and spells the ending. You do not need any French yourself: ask which ending {she} used and why.',
    hook: '**-e, -es, -e, -ons, -ez, -ent.** Je, tu, il and ils all sound the same; only **nous** and **vous** are heard.',
    example: 'J’habite à Londres, je parle anglais et je joue au tennis: three -er verbs in one introduction.',
  }),
  T('g-ir-re', 'The present tense: -ir and -re verbs', 'mixed', ['g-er'], {
    intro: 'Regular -ir verbs like finir add -is, -is, -it, -issons, -issez, -issent to the stem fin-. Regular -re verbs like vendre add -s, -s, nothing, -ons, -ez, -ent to the stem vend-, so il vend has no ending at all. Learn finir and vendre and you can use dozens of verbs: choisir, réussir, attendre, répondre, entendre, perdre.',
    teach: 'Conjugate finir and vendre side by side and point out where they are different.',
    talk: 'Ask {her} to teach you how to say “I finish” and “we finish” in French, and where the extra -iss- comes from.',
    hook: '-ir verbs **hiss** in the plural: fin**iss**ons, fin**iss**ez, fin**iss**ent. -re verbs keep it short: il **vend**, with nothing on the end.',
  }),
  T('g-irregular', 'Key irregular verbs: être, avoir, aller, faire', 'mixed', ['g-er'], {
    diagnostic: ['french.g-irregular.d1', 'french.g-irregular.d2'],
    intro: 'The four most useful verbs in French are irregular, so they are learned by heart: être (to be), avoir (to have), aller (to go) and faire (to do or to make). You will need avoir and être again for the perfect tense, and aller for the near future. French uses avoir for age and for feeling hungry or cold: j’ai douze ans, j’ai faim, j’ai froid.',
    teach: 'Chant all four verbs, then make one sentence with each about your own life.',
    talk: 'Ask {her} to say how old {she} is in French (J’ai douze ans) and to explain why French uses avoir there, not être.',
    hook: '**ils sont** (they are) hisses with an **s**; **ils ont** (they have) buzzes with a **z**: ils‿ont.',
    example: 'J’ai douze ans means “I am twelve”, but word for word it is “I have twelve years”.',
  }),
  T('g-negatives', 'Negatives', 'mixed', ['g-er'], {
    diagnostic: ['french.g-negatives.d1', 'french.g-negatives.d2'],
    intro: 'To make a sentence negative, wrap ne… pas round the verb: je joue → je ne joue pas. Ne becomes n’ before a vowel: je n’aime pas. Swap pas for jamais (never), plus (no longer, not any more) or rien (nothing). After a negative, un, une, du, de la and des all become de: je n’ai pas de chien.',
    teach: 'Explain the ne… pas sandwich, and why it is je n’ai pas de frère.',
    talk: 'Ask {her} about three foods {she} does not like. {She} answers in French with ne… pas or ne… jamais, then points out the two halves of the negative.',
    hook: '**ne… pas is a sandwich**: ne and pas are the bread, the verb is the filling. After it, un, une, du and des shrink to **de**.',
  }),
  T('g-adjectives', 'Adjectives: agreement and position', 'mixed', ['g-gender'], {
    diagnostic: ['french.g-adjectives.d1', 'french.g-adjectives.d2'],
    intro: 'Adjectives agree with the noun they describe: add -e for feminine and -s for plural (petit, petite, petits, petites). Some change more: blanc → blanche, heureux → heureuse, sportif → sportive, gentil → gentille, beau → belle. Most adjectives go after the noun (une voiture rouge), but a few short, common ones go before it (une petite voiture).',
    teach: 'Describe someone in your family in French with three adjectives, and explain each ending.',
    talk: 'Ask {her} to describe {her} best friend in French, then to tell you which adjective endings changed and why.',
    hook: '**BAGS** adjectives go before the noun: **B**eauty (beau, joli), **A**ge (jeune, vieux, nouveau), **G**oodness (bon, mauvais), **S**ize (petit, grand). Colours and most others go after.',
  }),
  T('g-possessives', 'Possessive adjectives', 'mixed', ['g-gender'], {
    diagnostic: ['french.g-possessives.d1', 'french.g-possessives.d2'],
    intro: 'My, your, his, her, our and their agree with the thing owned, not with the owner: mon frère, ma sœur, mes parents. So sa mère means “his mother” or “her mother”: the owner makes no difference. Before a feminine word that starts with a vowel, use mon, ton or son so it is easy to say: mon amie, son école.',
    teach: 'Explain why sa mère can mean “his mother” or “her mother”.',
    talk: 'Look at a family photo together and ask {her} to name people in French: mon père, ma tante, mes cousins…',
    hook: '**son, sa, ses** agree with the **thing owned**: Paul’s mother is **sa** mère, because mère is feminine.',
  }),
  T('g-questions', 'Asking questions', 'facts', ['g-irregular'], {
    diagnostic: ['french.g-questions.d1', 'french.g-questions.d2'],
    intro: 'There are three ways to ask a yes/no question: raise your voice at the end (Tu aimes le sport ?), put est-ce que in front (Est-ce que tu aimes le sport ?), or swap the verb and the pronoun (Aimes-tu le sport ?). For other questions, start with a question word: où (where), quand (when), qui (who), pourquoi (why), comment (how), combien (how many, how much), qu’est-ce que (what).',
    teach: 'Ask the same question in all three ways, and say which one you would use with a friend.',
    talk: 'Play twenty questions: {she} thinks of a famous person, you ask yes/no questions in English, and {she} must say each of your questions in French before answering.',
    hook: '**Est-ce que** is a question-maker: put it in front of any sentence. **Pourquoi ?** Because… **parce que !**',
    example: 'Qu’est-ce que tu fais le week-end ? (What do you do at the weekend?) comes up in almost every French speaking test.',
  }),
  T('g-partitive', 'Some and any: du, de la, des, de', 'mixed', ['g-gender', 'g-negatives'], {
    intro: 'French needs a word for “some” even where English leaves it out: du pain (bread, some bread), de la confiture, de l’eau, des frites. After a negative they all become de: je ne mange pas de viande. But after verbs of liking (aimer, adorer, détester, préférer) use le, la, l’ or les, because you mean the food in general: j’aime le fromage.',
    teach: 'Explain the difference between je mange du fromage and j’aime le fromage.',
    talk: 'At a meal, ask {her} to say in French what is on the table (du pain, de l’eau, des pâtes…) and one thing {she} doesn’t eat (je ne mange pas de…).',
    hook: '**Some = du, de la, de l’, des.** Negative? They all shrink to **de**. Liking? Use **le, la, les**.',
  }),
  T('g-prepositions', 'To, at and in: à, au, en, aux', 'mixed', ['g-gender', 'g-irregular'], {
    intro: 'French uses one little word for “to” and “in”: à for towns (à Paris), en for feminine countries (en France, en Espagne), au for masculine ones (au Canada, au pays de Galles) and aux for plural ones (aux États-Unis). In town, à joins up with the article: à + le = au (au cinéma), à + les = aux (aux toilettes), but à la and à l’ stay as they are.',
    teach: 'Explain why it is au cinéma but à la piscine, then name three countries that take en and two that take au.',
    talk: 'Point to places on a map or a globe. For each one, {she} says in French “I am going to…”: Je vais en Italie, je vais au Portugal…',
    hook: '**à + le = au, à + les = aux**; à la and à l’ never change. Countries ending in **-e** are usually feminine (**en** France); le Mexique is the famous exception: **au** Mexique.',
  }),
  T('g-modals', 'Modal verbs: pouvoir, vouloir, devoir', 'mixed', ['g-irregular'], {
    intro: 'Pouvoir (can, to be able to), vouloir (to want) and devoir (must, to have to) are irregular, and the verb after them stays in the infinitive: je peux nager, je veux partir, je dois travailler. To ask for something politely, say je voudrais (I would like) rather than je veux (I want).',
    teach: 'Make three sentences about your weekend: something you can do, something you want to do and something you have to do.',
    talk: 'Ask {her} what {she} has to do this week (Je dois…) and what {she} would like to do (Je voudrais…), in French.',
    hook: 'Modal + **infinitive**: **je peux jouer**, never je peux joue. The second verb always ends in -er, -ir or -re.',
  }),
  T('g-reflexive', 'Reflexive verbs', 'mixed', ['g-er'], {
    intro: 'Reflexive verbs have an extra pronoun that matches the subject: je me lève (I get up; word for word, “I get myself up”), tu te lèves, il se lève, nous nous levons, vous vous levez, ils se lèvent. You need them for your daily routine. Me, te and se become m’, t’ and s’ before a vowel or a silent h: je m’habille, elle s’appelle.',
    teach: 'Describe your morning routine using four reflexive verbs, and explain why it is je m’appelle but je me lève.',
    talk: 'Ask {her} to talk you through {her} morning in French while acting it out: je me réveille, je me lève, je me douche…',
    hook: '**me, te, se, nous, vous, se**: the mirror pronoun always matches the person. **Je m’appelle** is word for word “I call myself”.',
  }),
  T('g-future', 'The near future: aller + infinitive', 'mixed', ['g-irregular'], {
    intro: 'To say what you are going to do, use the present tense of aller + an infinitive: je vais jouer (I am going to play), nous allons partir (we are going to leave). It works just like English “going to”. For a negative, ne… pas goes round aller: je ne vais pas travailler.',
    teach: 'Say three things you are going to do next weekend, and one thing you are not going to do.',
    talk: 'On a Friday, ask {her} to tell you in French three things {she} is going to do at the weekend (Je vais…).',
    hook: '**aller + infinitive = going to**: je **vais** jouer, I’m **going to** play.',
  }),
  T('g-perfect-avoir', 'The perfect tense with avoir', 'mixed', ['g-irregular', 'g-ir-re'], {
    intro: 'The perfect tense (le passé composé) says what happened: j’ai joué means “I played” or “I have played”. Use the present tense of avoir + a past participle. Regular past participles: -er → -é (joué), -ir → -i (fini), -re → -u (vendu). Many common verbs have irregular ones to learn: fait, pris, bu, vu, lu, écrit, eu, été.',
    teach: 'Explain how to make the perfect tense of jouer, finir and vendre, then list five irregular past participles.',
    talk: 'On Monday, ask {her} to tell you in French three things {she} did at the weekend (J’ai…), and which of the past participles were irregular.',
    hook: '**avoir + past participle**: -er → **é**, -ir → **i**, -re → **u**. J’ai joué, j’ai fini, j’ai vendu.',
    example: 'Hier, j’ai regardé un film et j’ai mangé une pizza: “Yesterday I watched a film and ate a pizza.”',
  }),
  T('g-perfect-etre', 'The perfect tense with être', 'mixed', ['g-perfect-avoir', 'g-reflexive'], {
    intro: 'About sixteen verbs, mostly about coming and going (aller, venir, arriver, partir, entrer, sortir, monter, descendre, tomber, rester, naître, mourir…), use être instead of avoir: je suis allé. With être the past participle agrees with the subject like an adjective: elle est allée, ils sont allés, elles sont allées. Every reflexive verb uses être too: je me suis levé.',
    teach: 'Explain DR MRS VANDERTRAMP, then say where you went last weekend twice: once as yourself and once as a group of girls.',
    talk: 'Ask {her} to spell aloud “she went” and “they went” (a group of girls) in French, and to explain the extra letters: elle est allée, elles sont allées.',
    hook: '**DR MRS VANDERTRAMP**: Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir. With être, the participle agrees: elle est allé**e**.',
  }),
  T('g-imperfect', 'The imperfect: c’était and il y avait', 'facts', ['g-perfect-avoir'], {
    tier: 'stretch',
    intro: 'To describe the past (what something was like, rather than what happened), French uses the imperfect tense. Start with three phrases that turn up in every holiday story: c’était (it was), il y avait (there was, there were) and il faisait (the weather was). C’était génial ! Il y avait beaucoup de monde. Il faisait chaud.',
    teach: 'Describe a past holiday in three sentences: one with c’était, one with il y avait and one with il faisait.',
    talk: 'Ask {her} to describe a day out you had together, in French, using c’était and il y avait, and to tell you what each phrase means.',
    hook: '**Perfect = what happened** (j’ai visité le musée). **Imperfect = what it was like** (c’était intéressant, il y avait beaucoup de monde).',
  }),
  T('g-opinions', 'Opinions, reasons and connectives', 'facts', ['g-er', 'g-adjectives'], {
    diagnostic: ['french.g-opinions.d1', 'french.g-opinions.d2'],
    intro: 'Good answers in French give an opinion, a reason and a connective. Opinions: j’aime, j’adore, je n’aime pas, je déteste, je préfère, à mon avis (in my opinion), je pense que (I think that). Reasons: parce que or car (because) + c’est + an adjective, as in parce que c’est intéressant. Connectives such as et, mais, aussi, cependant (however) and par contre (on the other hand) join ideas together.',
    teach: 'Give your opinion of three school subjects, each with a reason and a connective.',
    talk: 'Name a food, a film or a school subject. {She} gives an opinion in French with a reason (J’adore les maths parce que c’est intéressant). Award a point for every connective.',
    hook: '**Opinion + parce que + c’est + adjective**: J’adore le dessin **parce que c’est** créatif.',
  }),
];

const items = [];
const push = (...xs) => items.push(...xs);

// --- g-gender ---------------------------------------------------------------------------------
push(
  mcq('d1', 'g-gender', 'Which is right for **the house**?', [['la maison', true], ['le maison', false, 'Maison is feminine, so “the” is la.'], ['les maison', false, 'Les is plural: les maisons.']], 'Maison is feminine: la maison, une maison.'),
  mcq('d2', 'g-gender', 'Which word for **the** goes with **école** (school)?', [['l’', true], ['la', false, 'École is feminine, but it starts with a vowel, so la shortens to l’.'], ['le', false, 'École is feminine, and it starts with a vowel: l’école.']], 'Before a vowel or a silent h, le and la both become l’: l’école, l’ami, l’hôtel.'),
  fact('car', 'g-gender', 'How do you say **a car** in French?', 'une voiture', ['un voiture', 'la voiture', 'des voiture'], 'Voiture is feminine: une voiture, la voiture.', FR),
  mcq('tion', 'g-gender', 'Which ending is a good clue that a noun is **feminine**?', [['-tion, as in la natation', true], ['-age, as in le fromage', false, '-age is usually masculine (except la plage, la page, l’image).'], ['-ment, as in le moment', false, '-ment is almost always masculine.']], 'Nouns ending in -tion are feminine: la natation, la station, l’émission.'),
  mcq('musee', 'g-gender', '**Musée** (museum) ends in -ée, which looks feminine. Which is right?', [['le musée', true], ['la musée', false, 'Musée is an exception: it is masculine.'], ['les musée', false, 'Les is plural: les musées.']], 'Le musée and le lycée are masculine, even though they end in -ée.'),
  mcq('plage', 'g-gender', '**Plage** (beach) ends in -age, which is usually masculine. Which is right?', [['la plage', true], ['le plage', false, 'Plage is an exception: it is feminine.'], ['un plage', false, 'Plage is feminine: une plage.']], 'La plage, la page and l’image are feminine, even though most -age words are masculine.'),
  fact('amis', 'g-gender', 'How do you say **the friends** (a group of boys)?', 'les amis', ['les amies', 'l’amis', 'le amis'], 'In the plural, “the” is always les: les amis. A group of girls would be les amies.', FR),
  mcq('gateaux', 'g-gender', 'What is the plural of **le gâteau** (the cake)?', [['les gâteaux', true], ['les gâteaus', false, 'Nouns ending in -eau add -x: gâteaux, oiseaux, bureaux.'], ['le gâteaux', false, 'The article must be plural too: les.']], 'Nouns ending in -eau add -x in the plural: les gâteaux.'),
  mcq('animaux', 'g-gender', 'What is the plural of **un animal**?', [['des animaux', true], ['des animals', false, 'Most nouns ending in -al change to -aux.'], ['des animales', false, 'Most nouns ending in -al change to -aux.']], 'Most -al nouns change to -aux: un animal, des animaux; un cheval, des chevaux; un journal, des journaux.'),
  mcq('hopital', 'g-gender', 'Why is it **l’hôpital**, not le hôpital?', [['The h is silent, so le shortens to l’', true], ['Hôpital is a feminine noun', false, 'It is masculine: un hôpital.'], ['Hôpital is a plural noun', false, 'The plural is les hôpitaux.']], 'Most French words starting with h have a silent h, so they behave as if they began with a vowel: l’hôpital, l’hôtel, l’histoire.'),
  fact('pommes', 'g-gender', 'How do you say **some apples**?', 'des pommes', ['de la pommes', 'les pommes', 'des pomme'], 'Plural “some” is des, whatever the gender: des pommes. The noun takes -s too.', FR),
  mcq('fem', 'g-gender', 'Which of these nouns is **feminine**?', [['souris (mouse)', true], ['fromage (cheese)', false, 'Le fromage is masculine.'], ['problème (problem)', false, 'Le problème is masculine, even though it ends in -e.']], 'La souris is feminine. Le fromage and le problème are two that catch people out.'),
  tmpl('g-gender', 'y8frgArticle'),
);

// --- g-er ---------------------------------------------------------------------------------------
push(
  mcq('d1', 'g-er', '**Nous ___ au foot.** (jouer: to play)', [['jouons', true], ['jouez', false, '-ez goes with vous.'], ['jouent', false, '-ent goes with ils and elles.']], 'Nous jouons au foot: stem jou- + -ons.'),
  mcq('d2', 'g-er', 'Which means **they watch the TV** (a group of boys)?', [['Ils regardent la télé.', true], ['Ils regarde la télé.', false, 'Ils needs the -ent ending.'], ['Ils regardez la télé.', false, '-ez goes with vous.']], 'Ils regardent la télé: regard- + -ent (the -ent is silent).'),
  fact('manger', 'g-er', 'How do you say **we eat**?', 'nous mangeons', ['nous mangons', 'nous mangez', 'nous mangent'], 'Nous mangeons: -ger verbs keep an e before -ons so the g stays soft. Also nous nageons, nous voyageons.', FR),
  fact('commencer', 'g-er', 'How do you say **we start**?', 'nous commençons', ['nous commencez', 'nous commencent', 'nous commencer'], 'Nous commençons: the c takes a cedilla (ç) before o so it still sounds like s.', FR),
  fact('acheter', 'g-er', 'How do you say **I buy**?', 'j’achète', ['je achète', 'j’achètes', 'j’acheter'], 'J’achète: acheter takes a grave accent (è) in the je, tu, il and ils forms, and je becomes j’ before a vowel.', FR),
  fact('parler', 'g-er', 'How do you say **you speak French** (talking to one friend)?', 'tu parles français', ['tu parle français', 'tu parlez français', 'tu parlent français'], 'Tu parles: the tu ending is -es. Languages have no capital letter in French.', FR),
  mcq('sound', 'g-er', 'Which of these sounds **different** from the other three?', [['jouons', true], ['joue', false, 'Joue, joues and jouent all sound exactly the same.'], ['jouent', false, 'The -ent of jouent is silent: it sounds like joue.'], ['joues', false, 'The -s of joues is silent: it sounds like joue.']], 'Je joue, tu joues, il joue and ils jouent sound the same; only nous jouons and vous jouez sound different.'),
  mcq('habitent', 'g-er', 'What does **elles habitent** mean?', [['they live (a group of girls)', true], ['she lives', false, 'That is elle habite: elles with an s is plural.'], ['they lived', false, 'Habitent is the present tense.']], 'Elles habitent: habiter (to live) + -ent, for a group of girls.', hear('elles habitent')),
  mcq('jaime', 'g-er', 'Why is it **j’aime** and not je aime?', [['Je becomes j’ before a vowel or a silent h', true], ['Because aimer is an irregular verb', false, 'Aimer is a regular -er verb.'], ['Because j’ is the plural of je', false, 'J’ is just je with its e dropped.']], 'Je drops its e before a vowel or a silent h: j’aime, j’habite, j’écoute.'),
  fact('preferer', 'g-er', 'How do you say **she prefers**?', 'elle préfère', ['elle préférer', 'elle préfères', 'elle préférent'], 'Elle préfère: the second é becomes è in the je, tu, il and ils forms. Nous préférons keeps é.', FR),
  mcq('joue', 'g-er', 'In French, **je joue** can mean…', [['I play, or I am playing', true], ['only I play', false, 'French has just one present tense, so it covers both.'], ['I played', false, 'That would be the perfect tense: j’ai joué.']], 'French has one present tense where English has two: je joue = I play or I am playing.'),
  order('order', 'g-er', 'Put the words in order: **We are listening to music.**', ['Nous', 'écoutons', 'de la', 'musique.'], 'Nous écoutons de la musique: subject, verb, then “some music”.'),
  tmpl('g-er', 'y8frgEr'),
);

// --- g-ir-re ------------------------------------------------------------------------------------
push(
  fact('finir', 'g-ir-re', 'How do you say **we finish**?', 'nous finissons', ['nous finons', 'nous finissez', 'nous finissent'], 'Nous finissons: fin- + -issons. The plural forms of -ir verbs all have -iss-.', FR),
  fact('vendre', 'g-ir-re', 'How do you say **he sells**?', 'il vend', ['il vendt', 'il vends', 'il vendre'], 'Il vend: regular -re verbs add nothing for il and elle.', FR),
  mcq('attendre', 'g-ir-re', '**Ils ___ le bus.** (attendre: to wait for)', [['attendent', true], ['attendont', false, 'The ils ending is -ent.'], ['attendrent', false, 'Take off -re first: attend- + -ent.']], 'Ils attendent le bus: attend- + -ent. Attendre means “to wait for”, so no word for “for” is needed.'),
  mcq('pattern', 'g-ir-re', 'Which verb follows the same pattern as **finir**?', [['choisir: je choisis, nous choisissons', true], ['sortir: je sors, nous sortons', false, 'Sortir is irregular: no -iss-.'], ['venir: je viens, nous venons', false, 'Venir is irregular.']], 'Choisir, remplir, réussir, grandir and obéir all follow finir.'),
  fact('repondre', 'g-ir-re', 'What does **je réponds** mean?', 'I answer', ['I answered', 'he answers', 'we answer'], 'Je réponds: répondre (to answer, to reply), with -s for je.', { accept: ['I reply', 'I respond', 'I am answering', 'I am replying', 'I’m answering', 'I’m replying', 'answer'], ...hear('je réponds') }),
  mcq('perdre', 'g-ir-re', '**Tu ___ toujours tes clés !** (perdre: to lose)', [['perds', true], ['perd', false, 'Perd is the il and elle form.'], ['perdez', false, 'Perdez goes with vous.']], 'Tu perds: perd- + -s.'),
  fact('choisir', 'g-ir-re', 'How do you say **they choose** (a group of girls)?', 'elles choisissent', ['elles choisent', 'elles choisissez', 'elles choisis'], 'Elles choisissent: chois- + -issent.', FR),
  mcq('attendons', 'g-ir-re', 'What does **nous attendons le train** mean?', [['We are waiting for the train.', true], ['We can hear the train.', false, 'To hear is entendre: nous entendons.'], ['We are taking the train.', false, 'To take is prendre: nous prenons.']], 'Attendre = to wait for. A false friend: it does not mean “to attend”.', hear('nous attendons le train')),
  mcq('false', 'g-ir-re', '**Attendre** is a false friend. What does it mean?', [['to wait (for)', true], ['to attend', false, 'To attend a school is fréquenter or aller à.'], ['to listen', false, 'To listen is écouter.']], 'Attendre = to wait for: j’attends le bus.'),
  fact('entendre', 'g-ir-re', 'How do you say **you hear** (talking to a group)?', 'vous entendez', ['vous entendons', 'vous entendent', 'vous entends'], 'Vous entendez: entend- + -ez.', FR),
  mcq('grandir', 'g-ir-re', 'Which is the **il** form of **grandir** (to grow up)?', [['il grandit', true], ['il grandis', false, '-is goes with je and tu.'], ['il grandi', false, 'Grandi is the past participle (il a grandi).']], 'Il grandit: grand- + -it.'),
  tmpl('g-ir-re', 'y8frgIrRe'),
);

// --- g-irregular --------------------------------------------------------------------------------
push(
  mcq('d1', 'g-irregular', 'Which means **I am twelve**?', [['J’ai douze ans.', true], ['Je suis douze ans.', false, 'French uses avoir for age: j’ai… ans.'], ['Je suis douze.', false, 'French uses avoir for age: j’ai douze ans.']], 'J’ai douze ans: word for word, “I have twelve years”.'),
  mcq('d2', 'g-irregular', '**Nous ___ au cinéma.** (aller: to go)', [['allons', true], ['allez', false, 'Allez goes with vous.'], ['vont', false, 'Vont goes with ils and elles.']], 'Aller: je vais, tu vas, il va, nous allons, vous allez, ils vont.'),
  fact('sont', 'g-irregular', 'How do you say **they are** (a group of boys)?', 'ils sont', ['ils ont', 'ils sommes', 'ils est'], 'Ils sont = they are (être). Ils ont = they have (avoir).', FR),
  fact('faites', 'g-irregular', 'How do you say **you do** (talking to a group)?', 'vous faites', ['vous faisez', 'vous fait', 'vous faisons'], 'Vous faites: one of only three vous forms that do not end in -ez (vous êtes, vous faites, vous dites).', FR),
  fact('avons', 'g-irregular', 'How do you say **we have**?', 'nous avons', ['nous sommes', 'nous avez', 'nous ont'], 'Avoir: j’ai, tu as, il a, nous avons, vous avez, ils ont.', FR),
  fact('vont', 'g-irregular', 'How do you say **they go** (a group of girls)?', 'elles vont', ['elles allent', 'elles vas', 'elles font'], 'Elles vont: aller is irregular. Elles font means “they do”.', FR),
  mcq('faim', 'g-irregular', 'Which means **I am hungry**?', [['J’ai faim.', true], ['Je suis faim.', false, 'French uses avoir: j’ai faim, j’ai soif, j’ai froid.'], ['Je fais faim.', false, 'French uses avoir: j’ai faim.']], 'J’ai faim = I am hungry (“I have hunger”). Also j’ai soif (thirsty), j’ai chaud (hot), j’ai froid (cold).'),
  mcq('beau', 'g-irregular', 'What does **il fait beau** mean?', [['The weather is nice.', true], ['He is good-looking.', false, 'He is good-looking would be il est beau.'], ['He makes nice things.', false, 'Il fait is used for the weather: il fait beau, il fait froid.']], 'Il fait + adjective describes the weather: il fait beau, il fait chaud, il fait froid.', hear('il fait beau')),
  mcq('velo', 'g-irregular', 'What does **je fais du vélo** mean?', [['I go cycling.', true], ['I am making a bike.', false, 'Faire du… is used for sports and activities.'], ['I am fixing my bike.', false, 'Faire du vélo = to go cycling.']], 'Faire du / de la + activity: je fais du vélo, je fais de la natation.', hear('je fais du vélo')),
  fact('es', 'g-irregular', 'How do you say **you are** (talking to one friend)?', 'tu es', ['tu est', 'tu as', 'tu êtes'], 'Être: je suis, tu es, il est, nous sommes, vous êtes, ils sont.', FR),
  mcq('espagne', 'g-irregular', 'Which means **my parents are going to Spain**?', [['Mes parents vont en Espagne.', true], ['Mes parents vas en Espagne.', false, 'Vas goes with tu; mes parents are “they”: vont.'], ['Mes parents sont en Espagne.', false, 'Sont en Espagne means they are in Spain. “Are going” is vont.']], 'Mes parents = they, so aller → vont.'),
  mcq('froid', 'g-irregular', 'What does **elle a froid** mean?', [['She is cold.', true], ['She has a cold.', false, 'A cold (the illness) is un rhume.'], ['She is cool.', false, 'Avoir froid is about feeling cold.']], 'Avoir froid = to be cold (to feel cold).', hear('elle a froid')),
  tmpl('g-irregular', 'y8frgIrregular'),
);

// --- g-negatives --------------------------------------------------------------------------------
push(
  mcq('d1', 'g-negatives', 'Which means **I don’t like maths**?', [['Je n’aime pas les maths.', true], ['Je ne aime pas les maths.', false, 'Ne becomes n’ before a vowel.'], ['Je n’aime les maths pas.', false, 'Pas comes straight after the verb.']], 'Ne… pas goes round the verb, and ne becomes n’ before a vowel: je n’aime pas.'),
  mcq('d2', 'g-negatives', 'Which means **I don’t have a brother**?', [['Je n’ai pas de frère.', true], ['Je n’ai pas un frère.', false, 'After a negative, un becomes de.'], ['Je ne pas ai de frère.', false, 'Ne… pas goes round the verb: je n’ai pas.']], 'After a negative, un, une, du, de la and des become de: je n’ai pas de frère.'),
  fact('jamais', 'g-negatives', 'What does **ne… jamais** mean?', 'never', ['not any more', 'nothing', 'nobody'], 'Ne… jamais = never: je ne mange jamais de viande.', { accept: ['not ever'] }),
  fact('plus', 'g-negatives', 'What does **ne… plus** mean?', 'no longer', ['never', 'nothing', 'not yet'], 'Ne… plus = no longer, not any more: je n’habite plus à Paris.', { accept: ['not any more', 'not anymore', 'any more', 'anymore', 'no more'] }),
  fact('rien', 'g-negatives', 'What does **ne… rien** mean?', 'nothing', ['never', 'nobody', 'no longer'], 'Ne… rien = nothing, not anything: je ne fais rien.', { accept: ['not anything'] }),
  fact('viande', 'g-negatives', 'How do you say **I never eat meat**?', 'je ne mange jamais de viande', ['je ne mange pas de viande', 'je ne mange jamais de la viande', 'je ne jamais mange de viande'], 'Ne… jamais goes round the verb, and after a negative de la becomes de.', FR),
  mcq('rien2', 'g-negatives', 'What does **Il ne fait rien.** mean?', [['He isn’t doing anything.', true], ['He never does it.', false, 'Never is ne… jamais.'], ['He doesn’t do it any more.', false, 'Not any more is ne… plus.']], 'Ne… rien = nothing: il ne fait rien.', hear('Il ne fait rien.')),
  mcq('future', 'g-negatives', 'Make **Je vais jouer.** negative.', [['Je ne vais pas jouer.', true], ['Je ne vais jouer pas.', false, 'Pas comes straight after the conjugated verb, vais.'], ['Je vais jouer pas.', false, 'Ne… pas goes round vais.']], 'In the near future, ne… pas goes round aller: je ne vais pas jouer.'),
  mcq('faim', 'g-negatives', 'What does **Je n’ai plus faim.** mean?', [['I’m not hungry any more.', true], ['I’m never hungry.', false, 'Never would be ne… jamais.'], ['I’m not very hungry.', false, 'Ne… plus means no longer, not any more.']], 'Ne… plus = not any more: je n’ai plus faim.', hear('Je n’ai plus faim.')),
  order('order', 'g-negatives', 'Put the words in order: **She never goes to the cinema.**', ['Elle', 'ne', 'va', 'jamais', 'au cinéma.'], 'Elle ne va jamais au cinéma: ne before the verb, jamais after it.'),
  fact('chien', 'g-negatives', 'How do you say **we don’t have a dog**?', 'nous n’avons pas de chien', ['nous n’avons pas un chien', 'nous ne avons pas de chien', 'nous n’avons de chien pas'], 'Nous n’avons pas de chien: n’ before the vowel, and un becomes de after the negative.', FR),
  tmpl('g-negatives', 'y8frgNegative'),
);

// --- g-adjectives -------------------------------------------------------------------------------
push(
  mcq('d1', 'g-adjectives', 'Which means **my sister is small**?', [['Ma sœur est petite.', true], ['Ma sœur est petit.', false, 'Sœur is feminine, so petit adds -e.'], ['Ma sœur est petits.', false, 'One sister: singular, feminine: petite.']], 'The adjective agrees with ma sœur (feminine singular): petite.'),
  mcq('d2', 'g-adjectives', 'Which is right for **a red car**?', [['une voiture rouge', true], ['une rouge voiture', false, 'Colours go after the noun.'], ['une voiture rouges', false, 'One car: singular, rouge. It already ends in -e, so no extra e.']], 'Colours go after the noun, and rouge already ends in -e, so the feminine is the same.'),
  fact('blanche', 'g-adjectives', 'What is the feminine of **blanc** (white)?', 'blanche', ['blance', 'blanque', 'blancs'], 'Blanc → blanche: une chemise blanche.', FR),
  fact('heureuse', 'g-adjectives', 'What is the feminine of **heureux** (happy)?', 'heureuse', ['heureuxe', 'heureuxs', 'heureuses'], '-eux → -euse: heureux, heureuse. Also sérieux → sérieuse, paresseux → paresseuse.', FR),
  fact('sportive', 'g-adjectives', 'What is the feminine of **sportif** (sporty)?', 'sportive', ['sportife', 'sportiffe', 'sportifs'], '-if → -ive: sportif, sportive. Also créatif → créative.', FR),
  fact('belle', 'g-adjectives', 'What is the feminine of **beau** (beautiful)?', 'belle', ['beaue', 'bele', 'beaux'], 'Beau → belle (and the plurals beaux, belles): une belle maison.', FR),
  mcq('petite', 'g-adjectives', 'How do you say **a small house**?', [['une petite maison', true], ['une maison petite', false, 'Petit is a BAGS adjective (size): it goes before the noun.'], ['une petit maison', false, 'Maison is feminine: petite.']], 'Petit is a size word, so it goes before the noun, and it agrees: une petite maison.'),
  mcq('marron', 'g-adjectives', 'How do you say **brown eyes**?', [['des yeux marron', true], ['des yeux marrons', false, 'Marron never changes, even in the plural.'], ['des marron yeux', false, 'Colours go after the noun.']], 'Marron (and orange) never change: des yeux marron, des chaussures orange.'),
  mcq('before', 'g-adjectives', 'Which adjective normally goes **before** the noun?', [['grand (big, tall)', true], ['rouge (red)', false, 'Colours go after the noun.'], ['intelligent', false, 'Most adjectives, like intelligent, go after the noun.']], 'BAGS: beauty, age, goodness, size. Grand is a size word: un grand jardin.'),
  fact('grands', 'g-adjectives', 'How do you say **my brothers are tall**?', 'mes frères sont grands', ['mes frères sont grandes', 'mes frères sont grand', 'mes frères est grands'], 'Mes frères is masculine plural, so grand adds -s: grands.', FR),
  mcq('filles', 'g-adjectives', '**Les filles sont ___.** (intelligent)', [['intelligentes', true], ['intelligents', false, 'Les filles are feminine: -es.'], ['intelligente', false, 'Les filles are plural: -es.']], 'Feminine plural: add -es. Les filles sont intelligentes.'),
  mcq('timide', 'g-adjectives', 'Which adjective does **not** add an -e in the feminine?', [['timide (shy)', true], ['petit (small)', false, 'Petit → petite.'], ['bavard (chatty)', false, 'Bavard → bavarde.']], 'Adjectives that already end in -e stay the same: timide, rouge, jaune, drôle.'),
  tmpl('g-adjectives', 'y8frgAdjective'),
);

// --- g-possessives ------------------------------------------------------------------------------
push(
  mcq('d1', 'g-possessives', 'How do you say **my mother**?', [['ma mère', true], ['mon mère', false, 'Mère is feminine: ma.'], ['mes mère', false, 'Mes is for plurals: mes parents.']], 'Ma before a feminine noun: ma mère, ma sœur.'),
  mcq('d2', 'g-possessives', 'How do you say **my parents**?', [['mes parents', true], ['mon parents', false, 'Parents is plural: mes.'], ['ma parents', false, 'Parents is plural: mes.']], 'Mes before any plural noun: mes parents, mes amis.'),
  mcq('his', 'g-possessives', 'How do you say **his sister**?', [['sa sœur', true], ['son sœur', false, 'Sœur is feminine, so sa: it agrees with the sister, not with him.'], ['ses sœur', false, 'Ses is for plurals: ses sœurs.']], 'Son, sa and ses agree with the thing owned: sœur is feminine, so sa sœur, for his sister or her sister.'),
  mcq('her', 'g-possessives', 'How do you say **her brother**?', [['son frère', true], ['sa frère', false, 'Frère is masculine, so son: it agrees with the brother, not with her.'], ['ses frère', false, 'Ses is for plurals: ses frères.']], 'Son frère = his brother or her brother: frère is masculine.'),
  mcq('amie', 'g-possessives', 'Why is it **mon amie** and not ma amie?', [['Amie starts with a vowel, so ma becomes mon', true], ['Because amie is a masculine noun', false, 'Amie (a female friend) is feminine.'], ['Because mon is used for all friends', false, 'Mon ami, mon amie, but mes amis.']], 'Before a feminine noun starting with a vowel or a silent h, ma, ta and sa become mon, ton and son: mon amie, ton école, son histoire.'),
  fact('notre', 'g-possessives', 'How do you say **our house**?', 'notre maison', ['nos maison', 'notres maison', 'notre maisons'], 'Notre for one thing (masculine or feminine), nos for more than one.', FR),
  fact('leurs', 'g-possessives', 'How do you say **their parents**?', 'leurs parents', ['leur parents', 'leurs parent', 'leures parents'], 'Leur for one thing, leurs for more than one: leurs parents.', FR),
  fact('ton', 'g-possessives', 'How do you say **your dog** (talking to one friend)?', 'ton chien', ['ta chien', 'tes chien', 'ton chiens'], 'Ton before a masculine noun: ton chien.', FR),
  fact('vos', 'g-possessives', 'How do you say **your books** (talking to a group)?', 'vos livres', ['votre livres', 'vos livre', 'votres livres'], 'Votre for one thing, vos for more than one: vos livres.', FR),
  mcq('chat', 'g-possessives', '**Léa aime son chat.** Why son, when Léa is a girl?', [['Son agrees with chat, which is masculine', true], ['Son always means “her”', false, 'Son can mean his or her.'], ['It is a mistake: it should be sa chat', false, 'Chat is masculine, so son is right.']], 'The owner makes no difference: son chat is his cat or her cat.'),
  mcq('leur', 'g-possessives', 'Which means **their house**?', [['leur maison', true], ['leurs maison', false, 'One house: leur.'], ['sa maison', false, 'Sa maison is his or her house.']], 'Leur maison: one house, so leur without -s.'),
  tmpl('g-possessives', 'y8frgPossessive'),
);

// --- g-questions --------------------------------------------------------------------------------
push(
  fact('d1', 'g-questions', 'What does **où** mean?', 'where', ['when', 'who', 'why'], 'Où = where: Où habites-tu ? Without the accent, ou means “or”.', hear('où')),
  fact('d2', 'g-questions', 'What does **pourquoi** mean?', 'why', ['when', 'how', 'because'], 'Pourquoi = why. The answer usually starts with parce que (because).', hear('pourquoi')),
  fact('quand', 'g-questions', 'What does **quand** mean?', 'when', ['where', 'how much', 'who'], 'Quand = when: Quand est ton anniversaire ?', hear('quand')),
  fact('combien', 'g-questions', 'What does **combien** mean?', 'how much or how many', ['how', 'when', 'which'], 'Combien = how much, how many: C’est combien ? Combien de frères as-tu ?', { accept: ['how much', 'how many', 'how many or how much'], ...hear('combien') }),
  fact('comment', 'g-questions', 'What does **comment** mean in a question?', 'how', ['why', 'who', 'where'], 'Comment = how: Comment vas-tu ? Comment t’appelles-tu ? (What is your name, word for word “how do you call yourself?”)', { accept: ['what'], ...hear('comment') }),
  fact('qui', 'g-questions', 'What does **qui** mean?', 'who', ['what', 'which', 'where'], 'Qui = who: Qui est-ce ?', hear('qui')),
  mcq('estceque', 'g-questions', 'Which turns **Tu aimes le sport.** into a question with est-ce que?', [['Est-ce que tu aimes le sport ?', true], ['Tu est-ce que aimes le sport ?', false, 'Est-ce que goes at the very front.'], ['Est-ce tu aimes le sport ?', false, 'You need all three words: est-ce que.']], 'Put est-ce que in front of the sentence; nothing else changes.'),
  mcq('invert', 'g-questions', 'Which is the inversion question for **Tu parles anglais.**?', [['Parles-tu anglais ?', true], ['Tu-parles anglais ?', false, 'Swap the verb and pronoun: parles-tu.'], ['Parles tu-anglais ?', false, 'The hyphen joins the verb and the pronoun: parles-tu.']], 'Inversion: swap the verb and the pronoun and join them with a hyphen: parles-tu ?'),
  mcq('t', 'g-questions', 'Make **Il joue au foot.** into an inversion question.', [['Joue-t-il au foot ?', true], ['Joue-il au foot ?', false, 'When the verb ends in a vowel, add -t- before il or elle.'], ['Il-joue au foot ?', false, 'Swap the verb and the pronoun: joue-t-il.']], 'Between two vowels French adds -t- to make it easier to say: joue-t-il ? a-t-elle ?'),
  fact('weekend', 'g-questions', 'How do you say **What do you do at the weekend?** (to a friend)', 'Qu’est-ce que tu fais le week-end ?', ['Qu’est-ce que tu fait le week-end ?', 'Est-ce que tu fais le week-end ?', 'Qu’est-ce tu fais le week-end ?'], 'Qu’est-ce que = what (as the object). Tu fais: faire for tu.', { lang: 'fr', accept: ['Qu’est-ce que tu fais le weekend ?', 'Que fais-tu le week-end ?', 'Que fais-tu le weekend ?', 'Tu fais quoi le week-end ?', 'Tu fais quoi le weekend ?'] }),
  mcq('age', 'g-questions', 'What does **Tu as quel âge ?** mean?', [['How old are you?', true], ['What is your name?', false, 'That is Comment t’appelles-tu ?'], ['Where do you live?', false, 'That is Où habites-tu ?']], 'Tu as quel âge ? Word for word: “You have which age?” Answer: J’ai douze ans.', hear('Tu as quel âge ?')),
  fact('habites', 'g-questions', 'How do you say **Where do you live?** (to a friend)', 'Où habites-tu ?', ['Où tu habites-tu ?', 'Où est-ce tu habites ?', 'Quand habites-tu ?'], 'Où + inversion: Où habites-tu ? Or: Où est-ce que tu habites ? Or, chatting: Tu habites où ?', { lang: 'fr', accept: ['Où est-ce que tu habites ?', 'Tu habites où ?', 'Où tu habites ?'] }),
);

// --- g-partitive --------------------------------------------------------------------------------
push(
  mcq('eau', 'g-partitive', '**Je voudrais ___ eau, s’il vous plaît.**', [['de l’', true], ['du', false, 'Eau starts with a vowel: de l’eau.'], ['de la', false, 'Eau is feminine, but it starts with a vowel: de l’eau.']], 'Before a vowel, du and de la become de l’: de l’eau.'),
  mcq('viande', 'g-partitive', 'Which means **I don’t eat meat**?', [['Je ne mange pas de viande.', true], ['Je ne mange pas de la viande.', false, 'After a negative, de la becomes de.'], ['Je ne mange pas du viande.', false, 'After a negative, “some” is just de.']], 'After ne… pas, du, de la, de l’ and des all become de.'),
  mcq('fromage', 'g-partitive', 'Which means **I like cheese**?', [['J’aime le fromage.', true], ['J’aime du fromage.', false, 'After aimer, use le, la, les: you mean cheese in general.'], ['J’aime de fromage.', false, 'After aimer, use le: j’aime le fromage.']], 'After verbs of liking and disliking, use le, la, l’ or les.'),
  fact('water', 'g-partitive', 'How do you say **some water**?', 'de l’eau', ['du eau', 'de la eau', 'des eau'], 'Eau starts with a vowel: de l’eau.', FR),
  fact('frites', 'g-partitive', 'How do you say **some chips** (frites)?', 'des frites', ['du frites', 'de la frites', 'de frites'], 'Frites is plural, so “some” is des.', FR),
  mcq('kilo', 'g-partitive', '**Un kilo ___ pommes, s’il vous plaît.**', [['de', true], ['des', false, 'After a quantity, just de: un kilo de pommes.'], ['du', false, 'After a quantity, just de.']], 'After a quantity (un kilo, beaucoup, un peu, une bouteille), use de: un kilo de pommes.'),
  mcq('beaucoup', 'g-partitive', '**Elle a beaucoup ___ amis.**', [['d’', true], ['des', false, 'After beaucoup, just de (d’ before a vowel).'], ['de', false, 'Amis starts with a vowel, so de becomes d’.']], 'Beaucoup de, and d’ before a vowel: beaucoup d’amis.'),
  fact('pain', 'g-partitive', 'How do you say **I eat some bread**?', 'je mange du pain', ['je mange de la pain', 'je mange des pain', 'je mange de pain'], 'Pain is masculine, so “some” is du: je mange du pain.', FR),
  mcq('gateau', 'g-partitive', 'What does **Tu veux du gâteau ?** mean?', [['Do you want some cake?', true], ['Do you want the cake?', false, 'The cake would be le gâteau.'], ['Do you want two cakes?', false, 'Two cakes would be deux gâteaux.']], 'Du gâteau = some cake.', hear('Tu veux du gâteau ?')),
  mcq('argent', 'g-partitive', '**Je n’ai pas ___ argent.** (money)', [['d’', true], ['de l’', false, 'After a negative, just de, or d’ before a vowel.'], ['de', false, 'Argent starts with a vowel, so de becomes d’.']], 'After a negative, de (d’ before a vowel): je n’ai pas d’argent.'),
  fact('cafe', 'g-partitive', 'How do you say **we don’t drink coffee**?', 'nous ne buvons pas de café', ['nous ne buvons pas du café', 'nous ne boivons pas de café', 'nous ne buvez pas de café'], 'Boire: nous buvons. After the negative, du becomes de.', FR),
  tmpl('g-partitive', 'y8frgPartitive'),
);

// --- g-prepositions -----------------------------------------------------------------------------
push(
  mcq('londres', 'g-prepositions', '**J’habite ___ Londres.**', [['à', true], ['en', false, 'En is for feminine countries. Towns and cities take à.'], ['au', false, 'Au is for masculine countries. Towns and cities take à.']], 'Towns and cities: à. J’habite à Londres.'),
  mcq('portugal', 'g-prepositions', '**Nous allons ___ Portugal.**', [['au', true], ['en', false, 'Le Portugal is masculine, so au.'], ['à', false, 'Portugal is a country: au, en or aux.']], 'Le Portugal is masculine: au Portugal.'),
  mcq('etatsunis', 'g-prepositions', '**Elle passe ses vacances ___ États-Unis.**', [['aux', true], ['au', false, 'Les États-Unis is plural: aux.'], ['en', false, 'Les États-Unis is plural: aux.']], 'Plural countries take aux: aux États-Unis, aux Pays-Bas.'),
  fact('piscine', 'g-prepositions', 'How do you say **to the swimming pool**?', 'à la piscine', ['au piscine', 'à le piscine', 'en piscine'], 'La piscine is feminine, and à la never changes: à la piscine.', FR),
  fact('galles', 'g-prepositions', 'How do you say **in Wales**?', 'au pays de Galles', ['en pays de Galles', 'à pays de Galles', 'aux pays de Galles'], 'Le pays de Galles is masculine: au pays de Galles. But en Angleterre, en Écosse, en Irlande.', FR),
  mcq('mexique', 'g-prepositions', 'Why is it **au Mexique** and not en Mexique?', [['Le Mexique is masculine, though it ends in -e', true], ['Mexique is the name of a city', false, 'Mexique is the country; the capital is Mexico.'], ['Countries outside Europe always take au', false, 'Not so: en Chine, en Inde, en Australie.']], 'Most countries ending in -e are feminine, but le Mexique (and le Cambodge) are masculine.'),
  fact('cinema', 'g-prepositions', 'How do you say **to the cinema**?', 'au cinéma', ['à le cinéma', 'à la cinéma', 'en cinéma'], 'Le cinéma is masculine: à + le = au.', FR),
  mcq('ecole', 'g-prepositions', '**Je vais ___ école en bus.**', [['à l’', true], ['au', false, 'École starts with a vowel: à l’école.'], ['à la', false, 'École starts with a vowel: à l’école.']], 'Before a vowel or a silent h: à l’. Je vais à l’école.'),
  mcq('chez', 'g-prepositions', 'What does **chez moi** mean?', [['at my house, at home', true], ['near me', false, 'Near me would be près de moi.'], ['with me', false, 'With me would be avec moi.']], 'Chez = at the house of: chez moi, chez Marie, chez le dentiste.'),
  fact('chezmarie', 'g-prepositions', 'How do you say **at Marie’s house**?', 'chez Marie', ['à Marie', 'au Marie', 'en Marie'], 'Chez + person = at that person’s house: chez Marie.', FR),
  mcq('ecosse', 'g-prepositions', '**Mon père est né ___ Écosse.**', [['en', true], ['au', false, 'L’Écosse is feminine: en Écosse.'], ['à', false, 'Écosse is a country: en Écosse.']], 'L’Écosse is feminine: en Écosse.'),
  tmpl('g-prepositions', 'y8frgPlace'),
);

// --- g-modals -----------------------------------------------------------------------------------
push(
  mcq('nager', 'g-modals', 'Which means **I can swim**?', [['Je peux nager.', true], ['Je peux nage.', false, 'After pouvoir the second verb stays in the infinitive: nager.'], ['Je peut nager.', false, 'Je peux, with -x.']], 'Je peux + infinitive: je peux nager.'),
  mcq('veulent', 'g-modals', '**Ils ___ partir.** (vouloir: to want)', [['veulent', true], ['voulent', false, 'The ils form changes its vowel: veulent.'], ['veut', false, 'Veut is the il and elle form.']], 'Vouloir: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.'),
  fact('devons', 'g-modals', 'How do you say **we have to work**?', 'nous devons travailler', ['nous devons travaillons', 'nous doivent travailler', 'nous devez travailler'], 'Nous devons + infinitive: nous devons travailler.', FR),
  fact('voudrais', 'g-modals', 'How do you say **I would like a hot chocolate**?', 'je voudrais un chocolat chaud', ['je voudrais une chocolat chaud', 'je voudrais un chaud chocolat', 'je voudrais du chocolat chaud un'], 'Je voudrais = I would like: the polite way to ask. Chocolat is masculine, and chaud goes after it.', FR),
  mcq('devoirs', 'g-modals', 'What does **Tu dois faire tes devoirs.** mean?', [['You must do your homework.', true], ['You want to do your homework.', false, 'Want is vouloir: tu veux.'], ['You can do your homework.', false, 'Can is pouvoir: tu peux.']], 'Devoir = must, to have to. (Les devoirs, in the plural, is homework.)', hear('Tu dois faire tes devoirs.')),
  fact('peux', 'g-modals', 'How do you say **you can** (talking to one friend)?', 'tu peux', ['tu peut', 'tu pouvez', 'tu veux'], 'Pouvoir: je peux, tu peux, il peut.', FR),
  fact('veut', 'g-modals', 'How do you say **she wants**?', 'elle veut', ['elle veux', 'elle voulez', 'elle peut'], 'Vouloir: je veux, tu veux, il/elle veut.', FR),
  mcq('polite', 'g-modals', 'Which is the polite way to ask for something in a shop?', [['Je voudrais un croissant, s’il vous plaît.', true], ['Je veux un croissant, maintenant.', false, 'Je veux (I want) sounds rude in a shop.'], ['Donne-moi un croissant tout de suite.', false, 'An order using tu to a shopkeeper is rude.']], 'Je voudrais (I would like) + s’il vous plaît is the polite way to ask.'),
  mcq('ici', 'g-modals', '**On ne peut pas ___ ici.** (nager: to swim)', [['nager', true], ['nage', false, 'After pouvoir the second verb stays in the infinitive.'], ['nagé', false, 'Nagé is the past participle; you need the infinitive.']], 'On ne peut pas nager ici: pouvoir + infinitive, with ne… pas round peut.'),
  fact('doivent', 'g-modals', 'How do you say **they must** (a group of boys)?', 'ils doivent', ['ils devent', 'ils doit', 'ils devons'], 'Devoir: je dois, tu dois, il doit, nous devons, vous devez, ils doivent.', FR),
  mcq('sortir', 'g-modals', 'What does **Je ne veux pas sortir.** mean?', [['I don’t want to go out.', true], ['I can’t go out.', false, 'Can’t would be je ne peux pas.'], ['I mustn’t go out.', false, 'Mustn’t would be je ne dois pas.']], 'Je ne veux pas + infinitive = I don’t want to…', hear('Je ne veux pas sortir.')),
  tmpl('g-modals', 'y8frgModal'),
);

// --- g-reflexive --------------------------------------------------------------------------------
push(
  mcq('appelle', 'g-reflexive', 'What does **je m’appelle** mean word for word?', [['I call myself', true], ['I am calling you', false, 'M’ (me) means myself here.'], ['my name', false, 'It is a whole sentence: I call myself, so my name is.']], 'Je m’appelle Léa: word for word, “I call myself Léa”, so “my name is Léa”.'),
  mcq('couchons', 'g-reflexive', '**Nous ___ couchons à dix heures.**', [['nous', true], ['se', false, 'The pronoun matches the subject: nous… nous.'], ['vous', false, 'The pronoun matches the subject: nous… nous.']], 'Nous nous couchons: subject nous, reflexive pronoun nous.'),
  fact('leve', 'g-reflexive', 'How do you say **I get up**?', 'je me lève', ['je me lèves', 'je se lève', 'je me lever'], 'Je me lève: me for je, and lever takes è in the je form.', FR),
  fact('habille', 'g-reflexive', 'How do you say **she gets dressed**?', 'elle s’habille', ['elle se habille', 'elle s’habilles', 'elle s’habiller'], 'Elle s’habille: se becomes s’ before the silent h.', FR),
  fact('douchons', 'g-reflexive', 'How do you say **we have a shower**?', 'nous nous douchons', ['nous se douchons', 'nous douchons', 'nous nous douchez'], 'Nous nous douchons: the pronoun matches nous.', FR),
  mcq('amusent', 'g-reflexive', 'What does **Ils s’amusent bien.** mean?', [['They are having a good time.', true], ['They are making us laugh.', false, 'S’ means themselves: they amuse themselves.'], ['They are bored.', false, 'Bored is s’ennuyer: ils s’ennuient.']], 'S’amuser = to have fun, to have a good time.', hear('Ils s’amusent bien.')),
  mcq('dents', 'g-reflexive', 'What does **Je me brosse les dents.** mean?', [['I brush my teeth.', true], ['I brush your teeth.', false, 'Me means myself, so it is my own teeth.'], ['I break my teeth.', false, 'Brosser = to brush.']], 'With reflexive verbs French says les dents (the teeth), not mes dents: the me already shows whose.', hear('Je me brosse les dents.')),
  order('routine', 'g-reflexive', 'Put Léa’s morning in order.', ['Je me réveille.', 'Je me lève.', 'Je me douche.', 'Je m’habille.'], 'I wake up, I get up, I have a shower, I get dressed.'),
  mcq('couches', 'g-reflexive', '**Tu ___ à quelle heure ?** (se coucher: to go to bed)', [['te couches', true], ['se couches', false, 'The pronoun for tu is te.'], ['te couche', false, 'The tu ending is -es.']], 'Tu te couches: te for tu, and -es for the tu ending.'),
  fact('lea', 'g-reflexive', 'Using **s’appeler**, how do you say **my name is Léa**?', 'je m’appelle Léa', ['je me appelle Léa', 'je m’appelles Léa', 'je m’apelle Léa'], 'Je m’appelle: me becomes m’ before a vowel, and appeler doubles its l in the je form.', FR),
  mcq('promenez', 'g-reflexive', '**Vous ___ promenez dans le parc.**', [['vous', true], ['nous', false, 'The pronoun matches the subject: vous… vous.'], ['se', false, 'Se is for il, elle, ils and elles.']], 'Vous vous promenez: subject vous, reflexive pronoun vous.'),
  tmpl('g-reflexive', 'y8frgReflexive'),
);

// --- g-future -----------------------------------------------------------------------------------
push(
  mcq('tennis', 'g-future', 'Which means **I am going to play tennis**?', [['Je vais jouer au tennis.', true], ['Je vais joue au tennis.', false, 'After aller the second verb stays in the infinitive: jouer.'], ['Je va jouer au tennis.', false, 'Je vais, with -s.']], 'Aller + infinitive: je vais jouer.'),
  mcq('allons', 'g-future', '**Ce soir, nous ___ regarder un film.**', [['allons', true], ['allez', false, 'Allez goes with vous.'], ['vont', false, 'Vont goes with ils and elles.']], 'Nous allons + infinitive: nous allons regarder un film.'),
  fact('partir', 'g-future', 'How do you say **they are going to leave** (a group of boys)?', 'ils vont partir', ['ils vont partent', 'ils allent partir', 'ils sont partir'], 'Ils vont + infinitive: ils vont partir.', FR),
  fact('neg', 'g-future', 'How do you say **I am not going to work**?', 'je ne vais pas travailler', ['je ne vais travailler pas', 'je ne pas vais travailler', 'je ne va pas travailler'], 'Ne… pas goes round the aller part: je ne vais pas travailler.', FR),
  mcq('paris', 'g-future', 'What does **Elle va visiter Paris.** mean?', [['She is going to visit Paris.', true], ['She visits Paris.', false, 'Va + infinitive is the near future: going to.'], ['She visited Paris.', false, 'That would be elle a visité Paris.']], 'Va visiter = is going to visit.', hear('Elle va visiter Paris.')),
  mcq('lever', 'g-future', '**Demain, je vais ___ tôt.** (se lever: to get up)', [['me lever', true], ['se lever', false, 'The pronoun matches je: me.'], ['me lève', false, 'After aller the verb stays in the infinitive: lever.']], 'Reflexive verbs keep a pronoun that matches the subject: je vais me lever.'),
  fact('manger', 'g-future', 'How do you say **we are going to eat**?', 'nous allons manger', ['nous allons mangeons', 'nous allez manger', 'nous vont manger'], 'Nous allons + infinitive: nous allons manger.', FR),
  mcq('demain', 'g-future', 'Which time phrase goes with the near future?', [['demain (tomorrow)', true], ['hier (yesterday)', false, 'Hier is for the past.'], ['l’année dernière (last year)', false, 'Dernier, dernière = last: the past.']], 'Future time phrases: demain, ce soir, ce week-end, la semaine prochaine, l’année prochaine.'),
  mcq('ceweekend', 'g-future', 'What does **Qu’est-ce que tu vas faire ce week-end ?** mean?', [['What are you going to do this weekend?', true], ['What did you do last weekend?', false, 'That would be qu’est-ce que tu as fait le week-end dernier ?'], ['What do you do at the weekend?', false, 'That would be qu’est-ce que tu fais le week-end ?']], 'Tu vas faire = you are going to do.', hear('Qu’est-ce que tu vas faire ce week-end ?')),
  fact('prochaine', 'g-future', 'What does **l’année prochaine** mean?', 'next year', ['last year', 'this year', 'every year'], 'Prochain, prochaine = next: la semaine prochaine (next week), l’année prochaine (next year).', hear('l’année prochaine')),
  tmpl('g-future', 'y8frgFuture'),
);

// --- g-perfect-avoir ----------------------------------------------------------------------------
push(
  mcq('foot', 'g-perfect-avoir', 'Which means **I played football**?', [['J’ai joué au foot.', true], ['Je suis joué au foot.', false, 'Jouer takes avoir: j’ai joué.'], ['J’ai jouer au foot.', false, 'After avoir you need the past participle, joué, not the infinitive.']], 'Avoir + past participle: j’ai joué.'),
  fact('fait', 'g-perfect-avoir', 'What is the past participle of **faire**?', 'fait', ['faisé', 'fairé', 'faité'], 'Faire → fait: j’ai fait mes devoirs.', FR),
  fact('pris', 'g-perfect-avoir', 'What is the past participle of **prendre**?', 'pris', ['prendu', 'prené', 'prendé'], 'Prendre → pris: j’ai pris le bus. Also comprendre → compris, apprendre → appris.', FR),
  fact('bu', 'g-perfect-avoir', 'What is the past participle of **boire**?', 'bu', ['buvé', 'boiré', 'buvu'], 'Boire → bu: j’ai bu un coca.', FR),
  fact('vu', 'g-perfect-avoir', 'What is the past participle of **voir**?', 'vu', ['voyé', 'voiré', 'vi'], 'Voir → vu: j’ai vu un film.', FR),
  fact('ecrit', 'g-perfect-avoir', 'What is the past participle of **écrire**?', 'écrit', ['écrivé', 'écriré', 'écrivu'], 'Écrire → écrit: j’ai écrit un e-mail.', FR),
  mcq('fini', 'g-perfect-avoir', 'What does **Nous avons fini nos devoirs.** mean?', [['We finished our homework.', true], ['We are finishing our homework.', false, 'Avons fini is the perfect tense: finished.'], ['We are going to finish our homework.', false, 'That would be nous allons finir.']], 'Avons + fini (the -ir past participle) = we finished, or we have finished.', hear('Nous avons fini nos devoirs.')),
  fact('pizza', 'g-perfect-avoir', 'How do you say **she ate a pizza**?', 'elle a mangé une pizza', ['elle a manger une pizza', 'elle est mangé une pizza', 'elle a mangée une pizza'], 'Avoir + past participle: elle a mangé. With avoir there is no agreement with the subject.', FR),
  mcq('hier', 'g-perfect-avoir', 'Which time phrase goes with the perfect tense?', [['hier (yesterday)', true], ['demain (tomorrow)', false, 'Demain is for the future.'], ['la semaine prochaine (next week)', false, 'Prochaine = next: the future.']], 'Past time phrases: hier, hier soir, le week-end dernier, la semaine dernière, l’année dernière.'),
  fact('film', 'g-perfect-avoir', 'How do you say **I didn’t see the film**?', 'je n’ai pas vu le film', ['je n’ai vu pas le film', 'je ne ai pas vu le film', 'je n’ai pas voir le film'], 'Ne… pas goes round avoir: je n’ai pas vu.', FR),
  mcq('eu', 'g-perfect-avoir', 'What does **Il a eu un accident.** mean?', [['He had an accident.', true], ['He was an accident.', false, 'Eu is the past participle of avoir, not être.'], ['He has an accident.', false, 'A eu is the perfect tense: had.']], 'Avoir → eu: il a eu = he had.', hear('Il a eu un accident.')),
  fact('lu', 'g-perfect-avoir', 'What is the past participle of **lire**?', 'lu', ['lisé', 'liré', 'lisu'], 'Lire → lu: j’ai lu un livre.', FR),
  tmpl('g-perfect-avoir', 'y8frgPerfectAvoir'),
);

// --- g-perfect-etre -----------------------------------------------------------------------------
push(
  mcq('aller', 'g-perfect-etre', 'Which verb takes **être** in the perfect tense?', [['aller (to go)', true], ['manger (to eat)', false, 'Manger takes avoir: j’ai mangé.'], ['jouer (to play)', false, 'Jouer takes avoir: j’ai joué.']], 'Aller is one of the DR MRS VANDERTRAMP verbs: je suis allé.'),
  mcq('lea', 'g-perfect-etre', 'Léa says **I went to Paris**. Which is right?', [['Je suis allée à Paris.', true], ['Je suis allé à Paris.', false, 'Léa is a girl, so allé adds -e.'], ['J’ai allé à Paris.', false, 'Aller takes être.']], 'Aller takes être, and the past participle agrees with Léa: allée.'),
  fact('arrivees', 'g-perfect-etre', 'How do you say **they arrived** (a group of girls)?', 'elles sont arrivées', ['elles sont arrivés', 'elles ont arrivé', 'elles sont arrivée'], 'Arriver takes être; elles is feminine plural, so add -es: arrivées.', FR),
  fact('tombe', 'g-perfect-etre', 'How do you say **he fell**?', 'il est tombé', ['il a tombé', 'il est tombée', 'il est tomber'], 'Tomber takes être: il est tombé.', FR),
  mcq('nee', 'g-perfect-etre', 'What does **Elle est née en 2013.** mean?', [['She was born in 2013.', true], ['She arrived in 2013.', false, 'Arrived would be elle est arrivée.'], ['She died in 2013.', false, 'Died would be elle est morte.']], 'Naître (to be born) → né: elle est née (with -e for a girl).', hear('Elle est née en 2013.')),
  mcq('restes', 'g-perfect-etre', '**Nous ___ restés à la maison.**', [['sommes', true], ['avons', false, 'Rester takes être.'], ['sont', false, 'Sont goes with ils and elles.']], 'Rester takes être: nous sommes restés.'),
  fact('leve', 'g-perfect-etre', 'How do you say **he got up**?', 'il s’est levé', ['il s’a levé', 'il se est levé', 'il s’est lever'], 'Reflexive verbs take être, with the pronoun in front: il s’est levé.', FR),
  fact('sortie', 'g-perfect-etre', 'How do you say **she went out**?', 'elle est sortie', ['elle est sorti', 'elle a sortie', 'elle est sortée'], 'Sortir takes être, and its past participle sorti adds -e for elle: sortie.', FR),
  mcq('venues', 'g-perfect-etre', 'In **Mes cousines sont venues**, why does venu end in -es?', [['Mes cousines is feminine plural', true], ['Venir always ends in -es', false, 'Il est venu, elle est venue: it depends on the subject.'], ['Because the verb is sont', false, 'It agrees with the subject, mes cousines.']], 'With être, the past participle agrees with the subject: feminine plural → -es.'),
  mcq('hugo', 'g-perfect-etre', 'What does **Victor Hugo est mort en 1885.** mean?', [['Victor Hugo died in 1885.', true], ['Victor Hugo was born in 1885.', false, 'Born would be est né.'], ['Victor Hugo moved house in 1885.', false, 'Mort comes from mourir, to die.']], 'Mourir (to die) → mort, with être. Victor Hugo wrote Les Misérables.', hear('Victor Hugo est mort en 1885.')),
  mcq('tomlea', 'g-perfect-etre', 'Tom and Léa **went to the beach**. Which is right?', [['Tom et Léa sont allés à la plage.', true], ['Tom et Léa sont allées à la plage.', false, 'A mixed group counts as masculine: allés.'], ['Tom et Léa ont allé à la plage.', false, 'Aller takes être.']], 'A mixed group of boys and girls takes the masculine plural: allés.'),
  tmpl('g-perfect-etre', 'y8frgPerfectEtre'),
);

// --- g-imperfect (stretch) ----------------------------------------------------------------------
push(
  fact('cetait', 'g-imperfect', 'What does **c’était** mean?', 'it was', ['it is', 'it will be', 'there was'], 'C’était = it was (c’est in the past): c’était génial.', hear('c’était')),
  fact('ilyavait', 'g-imperfect', 'What does **il y avait** mean?', 'there was', ['there is', 'he had', 'it was'], 'Il y avait = there was or there were (il y a in the past).', { accept: ['there were', 'there was or there were', 'there were or there was'], ...hear('il y avait') }),
  fact('genial', 'g-imperfect', 'How do you say **it was great**?', 'c’était génial', ['c’est génial', 'il était génial', 'c’étais génial'], 'C’était + adjective: c’était génial, c’était nul, c’était intéressant.', { lang: 'fr', accept: ['c’était super', 'c’était fantastique', 'c’était excellent'] }),
  fact('chaud', 'g-imperfect', 'How do you say **the weather was hot**?', 'il faisait chaud', ['il fait chaud', 'il faisais chaud', 'il était chaud'], 'Il faisait + weather word: il faisait chaud, il faisait beau, il faisait froid.', FR),
  mcq('which', 'g-imperfect', 'Which tense describes **what something was like**?', [['the imperfect: c’était, il y avait', true], ['the perfect: j’ai visité', false, 'The perfect says what happened.'], ['the near future: je vais visiter', false, 'That is for what is going to happen.']], 'Perfect = what happened. Imperfect = what it was like.'),
  mcq('monde', 'g-imperfect', 'What does **Il y avait beaucoup de monde.** mean?', [['There were lots of people.', true], ['There was a big world.', false, 'Beaucoup de monde is an idiom: lots of people.'], ['There are lots of people.', false, 'Avait is the past: there were.']], 'Beaucoup de monde = lots of people, a crowd.', hear('Il y avait beaucoup de monde.')),
  mcq('faisait', 'g-imperfect', 'Which is the **imperfect** of **il fait** (as in il fait beau)?', [['il faisait', true], ['il a fait', false, 'Il a fait is the perfect tense.'], ['il va faire', false, 'Il va faire is the near future.']], 'Il fait → il faisait: il faisait beau = the weather was nice.'),
  mcq('petite', 'g-imperfect', 'What does **Quand j’étais petite, j’avais un chat.** mean?', [['When I was little, I had a cat.', true], ['When I am little, I have a cat.', false, 'Étais and avais are past forms.'], ['When I was little, I wanted a cat.', false, 'J’avais = I had.']], 'J’étais = I was, j’avais = I had: the imperfect for what things were like.', hear('Quand j’étais petite, j’avais un chat.')),
  fact('magasins', 'g-imperfect', 'How do you say **there were lots of shops**?', 'il y avait beaucoup de magasins', ['il y a beaucoup de magasins', 'il y avait beaucoup des magasins', 'il avait beaucoup de magasins'], 'Il y avait + beaucoup de (never des after beaucoup).', FR),
  mcq('chateau', 'g-imperfect', '**Hier, j’ai visité un château. ___ très intéressant.**', [['C’était', true], ['Il y avait', false, 'Il y avait means there was: it needs a noun after it.'], ['Il faisait', false, 'Il faisait is for the weather.']], 'C’était + adjective gives your opinion of it: c’était très intéressant.'),
);

// --- g-opinions ---------------------------------------------------------------------------------
push(
  fact('d1', 'g-opinions', 'What does **parce que** mean?', 'because', ['but', 'however', 'so'], 'Parce que = because. Car means the same.', hear('parce que')),
  fact('d2', 'g-opinions', 'What does **je déteste** mean?', 'I hate', ['I like', 'I prefer', 'I don’t mind'], 'Je déteste = I hate. J’aime, j’adore, je préfère, je n’aime pas, je déteste.', { accept: ['I detest', 'I loathe'], ...hear('je déteste') }),
  fact('cependant', 'g-opinions', 'What does **cependant** mean?', 'however', ['because', 'also', 'therefore'], 'Cependant = however: a connective that adds a contrast.', { accept: ['but', 'nevertheless', 'yet'], ...hear('cependant') }),
  fact('avis', 'g-opinions', 'What does **à mon avis** mean?', 'in my opinion', ['on my way', 'in my life', 'at my house'], 'À mon avis = in my opinion: à mon avis, c’est trop difficile.', { accept: ['in my view'], ...hear('à mon avis') }),
  fact('ennuyeux', 'g-opinions', 'What does **ennuyeux** mean?', 'boring', ['interesting', 'easy', 'funny'], 'Ennuyeux = boring: c’est ennuyeux.', { accept: ['dull'], ...hear('ennuyeux') }),
  mcq('maths', 'g-opinions', 'Which is the best answer to **Tu aimes les maths ?**', [['Oui, j’adore les maths car c’est utile.', true], ['Oui, j’adore du maths parce que c’est utile.', false, 'After adorer, use les: j’adore les maths.'], ['Oui, j’adore les maths parce que.', false, 'Parce que needs a reason after it: parce que c’est utile.']], 'Opinion + reason: j’adore les maths car (or parce que) c’est utile.'),
  fact('pense', 'g-opinions', 'How do you say **I think that**?', 'je pense que', ['je pense de', 'je pense qui', 'je pense à'], 'Je pense que = I think that: je pense que c’est important.', { lang: 'fr', accept: ['je crois que'] }),
  fact('amusant', 'g-opinions', 'How do you say **because it is fun**?', 'parce que c’est amusant', ['parce que il est amusant', 'parce c’est amusant', 'parce que c’est amuser'], 'Parce que + c’est + adjective. Car c’est amusant also works.', { lang: 'fr', accept: ['car c’est amusant', 'parce que c’est marrant', 'car c’est marrant'] }),
  mcq('contre', 'g-opinions', 'Which connective means **on the other hand**?', [['par contre', true], ['par exemple', false, 'Par exemple = for example.'], ['parce que', false, 'Parce que = because.']], 'Par contre = on the other hand: j’aime le sport, par contre je déteste le rugby.'),
  mcq('prefere', 'g-opinions', 'Which means **I prefer French** (the school subject)?', [['Je préfère le français.', true], ['Je préfère français.', false, 'Use le after préférer: le français.'], ['Je préfère du français.', false, 'After préférer, use le: you mean the subject in general.']], 'Je préfère le français: after verbs of liking, use le, la, l’ or les.'),
  fact('nul', 'g-opinions', 'What does **c’est nul** mean?', 'it’s rubbish', ['it’s brilliant', 'it’s easy', 'it’s strange'], 'C’est nul = it’s rubbish, it’s useless.', { accept: ['it is rubbish', 'its rubbish', 'rubbish', 'it’s useless', 'it is useless', 'it’s awful', 'it is awful', 'it’s terrible', 'it is terrible', 'it’s bad', 'it is bad', 'it’s pointless', 'it’s hopeless', 'it’s lame'], ...hear('c’est nul') }),
);

// ------------------------------------------------------------------------------------------------
// tables for the topic cards
const P6 = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
const conj = (...cols) => P6.map((p, i) => [p, ...cols.map((c) => c.split(' ')[i])]);
const TOPIC_VISUALS = {
  'french.g-gender': { kind: 'table', head: ['', 'masculine', 'feminine', 'plural'], rows: [['the', 'le (l’)', 'la (l’)', 'les'], ['a, some', 'un', 'une', 'des']], caption: 'L’ before a vowel or a silent h: l’ami, l’école, l’hôtel.' },
  'french.g-er': { kind: 'table', head: ['', 'jouer (to play)', 'ending'], rows: conj('joue joues joue jouons jouez jouent', '-e -es -e -ons -ez -ent'), caption: 'Take off -er and add the ending. The -ent of ils jouent is silent.' },
  'french.g-ir-re': { kind: 'table', head: ['', 'finir', 'vendre'], rows: conj('finis finis finit finissons finissez finissent', 'vends vends vend vendons vendez vendent'), caption: 'Stems fin- and vend-. Il vend adds no ending at all.' },
  'french.g-irregular': { kind: 'table', head: ['', 'être', 'avoir', 'aller', 'faire'], rows: [['je', 'suis', 'ai', 'vais', 'fais'], ['tu', 'es', 'as', 'vas', 'fais'], ['il / elle', 'est', 'a', 'va', 'fait'], ['nous', 'sommes', 'avons', 'allons', 'faisons'], ['vous', 'êtes', 'avez', 'allez', 'faites'], ['ils / elles', 'sont', 'ont', 'vont', 'font']], caption: 'Learn them by heart: j’ai, not je ai.' },
  'french.g-negatives': { kind: 'table', head: ['', 'negative'], rows: [['not', 'Je ne joue **pas**.'], ['never', 'Je ne mange **jamais** de viande.'], ['no longer', 'Je n’habite **plus** ici.'], ['nothing', 'Je ne fais **rien**.']], caption: 'Ne before the verb, the negative word after it. Ne becomes n’ before a vowel.' },
  'french.g-adjectives': { kind: 'table', head: ['masc.', 'fem.', 'masc. pl.', 'fem. pl.'], rows: [['petit', 'petite', 'petits', 'petites'], ['blanc', 'blanche', 'blancs', 'blanches'], ['heureux', 'heureuse', 'heureux', 'heureuses'], ['sportif', 'sportive', 'sportifs', 'sportives'], ['beau', 'belle', 'beaux', 'belles'], ['rouge', 'rouge', 'rouges', 'rouges']], caption: 'Adjectives ending in -e add no extra e. Marron and orange never change.' },
  'french.g-possessives': { kind: 'table', head: ['', 'masc.', 'fem.', 'plural'], rows: [['my', 'mon', 'ma', 'mes'], ['your (tu)', 'ton', 'ta', 'tes'], ['his, her', 'son', 'sa', 'ses'], ['our', 'notre', 'notre', 'nos'], ['your (vous)', 'votre', 'votre', 'vos'], ['their', 'leur', 'leur', 'leurs']], caption: 'Before a feminine noun starting with a vowel: mon amie, ton école, son histoire.' },
  'french.g-questions': { kind: 'table', head: ['French', 'English'], rows: [['où ?', 'where?'], ['quand ?', 'when?'], ['qui ?', 'who?'], ['pourquoi ?', 'why?'], ['comment ?', 'how?'], ['combien ?', 'how much? how many?'], ['qu’est-ce que… ?', 'what…?'], ['quel, quelle… ?', 'which…? what…?']] },
  'french.g-partitive': { kind: 'table', head: ['', 'some', 'not any'], rows: [['masculine', 'du pain', 'pas de pain'], ['feminine', 'de la viande', 'pas de viande'], ['before a vowel', 'de l’eau', 'pas d’eau'], ['plural', 'des frites', 'pas de frites']], caption: 'But after aimer, adorer, détester, préférer: j’aime le pain, la viande, l’eau, les frites.' },
  'french.g-prepositions': { kind: 'table', head: ['', 'to, in, at'], rows: [['a town or city', 'à Paris'], ['a feminine country', 'en France'], ['a masculine country', 'au Canada'], ['a plural country', 'aux États-Unis'], ['le cinéma', 'au cinéma'], ['la piscine', 'à la piscine'], ['l’école', 'à l’école'], ['les toilettes', 'aux toilettes']] },
  'french.g-modals': { kind: 'table', head: ['', 'pouvoir', 'vouloir', 'devoir'], rows: conj('peux peux peut pouvons pouvez peuvent', 'veux veux veut voulons voulez veulent', 'dois dois doit devons devez doivent'), caption: 'Then an infinitive: je peux nager, je veux partir, je dois travailler.' },
  'french.g-reflexive': { kind: 'table', head: ['', 'se lever', 's’habiller'], rows: [['je', 'me lève', 'm’habille'], ['tu', 'te lèves', 't’habilles'], ['il / elle', 'se lève', 's’habille'], ['nous', 'nous levons', 'nous habillons'], ['vous', 'vous levez', 'vous habillez'], ['ils / elles', 'se lèvent', 's’habillent']], caption: 'Me, te and se become m’, t’ and s’ before a vowel or a silent h.' },
  'french.g-future': { kind: 'table', head: ['', 'aller', '+ infinitive'], rows: conj('vais vas va allons allez vont', 'jouer manger sortir partir voir dormir'), caption: 'Reflexive verbs keep a pronoun that matches: je vais me coucher, nous allons nous coucher.' },
  'french.g-perfect-avoir': { kind: 'table', head: ['', 'avoir', 'past participle'], rows: [['je (j’)', 'ai', 'joué'], ['tu', 'as', 'fini'], ['il / elle', 'a', 'vendu'], ['nous', 'avons', 'fait'], ['vous', 'avez', 'pris'], ['ils / elles', 'ont', 'vu']], caption: 'Irregular: faire → fait, prendre → pris, boire → bu, voir → vu, lire → lu, écrire → écrit, avoir → eu, être → été.' },
  'french.g-perfect-etre': { kind: 'table', head: ['', 'aller'], rows: [['je', 'suis allé(e)'], ['tu', 'es allé(e)'], ['il', 'est allé'], ['elle', 'est allée'], ['nous', 'sommes allé(e)s'], ['vous', 'êtes allé(e)(s)'], ['ils', 'sont allés'], ['elles', 'sont allées']], caption: 'Add -e for a girl or a woman, -s for a group, -es for a group of girls.' },
  'french.g-imperfect': { kind: 'table', head: ['now', 'in the past', 'English'], rows: [['c’est', 'c’était', 'it was'], ['il y a', 'il y avait', 'there was, there were'], ['il fait', 'il faisait', 'the weather was'], ['j’ai', 'j’avais', 'I had'], ['je suis', 'j’étais', 'I was']] },
  'french.g-opinions': { kind: 'table', head: ['opinion', 'reason'], rows: [['j’adore…', 'parce que c’est génial'], ['j’aime…', 'car c’est intéressant'], ['je n’aime pas…', 'parce que c’est ennuyeux'], ['je déteste…', 'parce que c’est nul'], ['à mon avis…', 'c’est trop difficile']], caption: 'Join ideas with et, mais, aussi, cependant (however) and par contre (on the other hand).' },
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }

// French typography: a non-breaking space before ? and ! (and it keeps them on the same line)
const nb = (s) => (typeof s === 'string' ? s.replace(/ ([?!])/g, ' $1') : s);
for (const it of items) {
  for (const k of ['prompt', 'answer', 'explain', 'hear']) it[k] = nb(it[k]);
  if (it.accept) it.accept = it.accept.map(nb);
  if (it.distractors) it.distractors = it.distractors.map(nb);
  if (it.options) it.options = it.options.map((o) => ({ ...o, text: nb(o.text), feedback: nb(o.feedback) }));
  if (it.items) it.items = it.items.map(nb);
}
// (topic text keeps ordinary spaces: card facts are quoted from it word for word)
for (const v of Object.values(TOPIC_VISUALS)) v.rows = v.rows.map((r) => r.map(nb));

export default [{ subject: 'french', deck: 'y8-grammar', topics, items }];

// Year 8 French grammar drills that never run out: the present tense (regular -er, -ir and -re
// verbs, the key irregulars, modal verbs, reflexive verbs), the near future, the perfect tense
// with avoir and with être (with agreement), articles and gender, du/de la/des, adjective
// agreement, possessives, à/au/en/aux, and negatives.
// Every verb table is written out in full (not computed), so it can be checked by eye;
// tests/french-grammar.test.mjs re-derives the regular ones from the rules and spot-checks the rest.
// Typed answers are French with lang: 'fr' (a missing accent is accepted with a note; a wrong
// ending never is). `hear` is only ever French that is already in the prompt, never the answer.

// ---------------------------------------------------------------------------------------------
// helpers: elision (je → j’, ne → n’, me/te/se → m’/t’/s’ before a vowel or a silent h)
// every h-word in this file has a silent h (habiter, s’habiller, hôpital, hôtel, histoire)
export const startsVowel = (w) => /^[aeiouyhàâéèêëîïôûœ]/i.test(w);
export const withJe = (form) => (startsVowel(form) ? `j’${form}` : `je ${form}`);
export const subj = (s, form) => (s === 'je' ? withJe(form) : `${s} ${form}`);
export const neg = (form) => (startsVowel(form) ? `n’${form}` : `ne ${form}`);
export const REFL = ['me', 'te', 'se', 'nous', 'vous', 'se'];
export const refl = (p, form) => ([0, 1, 2, 5].includes(p) && startsVowel(form) ? `${REFL[p][0]}’${form}` : `${REFL[p]} ${form}`);
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------------------------
// verb tables. v(infinitive, English “I …”, English “he …”, English past, present je…ils, past participle, auxiliary)
const v = (inf, en, en3, past, pres, pp, aux = 'avoir', extra = {}) => ({ inf, en, en3, past, pres: pres.split(' '), pp, aux, ...extra });

// regular -er verbs with no spelling change
export const ER = [
  v('jouer', 'play', 'plays', 'played', 'joue joues joue jouons jouez jouent', 'joué'),
  v('regarder', 'watch', 'watches', 'watched', 'regarde regardes regarde regardons regardez regardent', 'regardé'),
  v('écouter', 'listen', 'listens', 'listened', 'écoute écoutes écoute écoutons écoutez écoutent', 'écouté'),
  v('parler', 'speak', 'speaks', 'spoke', 'parle parles parle parlons parlez parlent', 'parlé'),
  v('aimer', 'like', 'likes', 'liked', 'aime aimes aime aimons aimez aiment', 'aimé'),
  v('habiter', 'live', 'lives', 'lived', 'habite habites habite habitons habitez habitent', 'habité'),
  v('travailler', 'work', 'works', 'worked', 'travaille travailles travaille travaillons travaillez travaillent', 'travaillé'),
  v('chanter', 'sing', 'sings', 'sang', 'chante chantes chante chantons chantez chantent', 'chanté'),
  v('danser', 'dance', 'dances', 'danced', 'danse danses danse dansons dansez dansent', 'dansé'),
  v('détester', 'hate', 'hates', 'hated', 'déteste détestes déteste détestons détestez détestent', 'détesté'),
  v('adorer', 'love', 'loves', 'loved', 'adore adores adore adorons adorez adorent', 'adoré'),
  v('donner', 'give', 'gives', 'gave', 'donne donnes donne donnons donnez donnent', 'donné'),
  v('trouver', 'find', 'finds', 'found', 'trouve trouves trouve trouvons trouvez trouvent', 'trouvé'),
  v('porter', 'wear', 'wears', 'wore', 'porte portes porte portons portez portent', 'porté'),
  v('marcher', 'walk', 'walks', 'walked', 'marche marches marche marchons marchez marchent', 'marché'),
  v('oublier', 'forget', 'forgets', 'forgot', 'oublie oublies oublie oublions oubliez oublient', 'oublié'),
  v('étudier', 'study', 'studies', 'studied', 'étudie étudies étudie étudions étudiez étudient', 'étudié'),
  v('visiter', 'visit', 'visits', 'visited', 'visite visites visite visitons visitez visitent', 'visité'),
  v('préparer', 'prepare', 'prepares', 'prepared', 'prépare prépares prépare préparons préparez préparent', 'préparé'),
  v('arriver', 'arrive', 'arrives', 'arrived', 'arrive arrives arrive arrivons arrivez arrivent', 'arrivé', 'être'),
  v('rester', 'stay', 'stays', 'stayed', 'reste restes reste restons restez restent', 'resté', 'être'),
  v('entrer', 'go in', 'goes in', 'went in', 'entre entres entre entrons entrez entrent', 'entré', 'être'),
  v('tomber', 'fall', 'falls', 'fell', 'tombe tombes tombe tombons tombez tombent', 'tombé', 'être'),
  v('rentrer', 'go home', 'goes home', 'went home', 'rentre rentres rentre rentrons rentrez rentrent', 'rentré', 'être'),
  v('monter', 'go up', 'goes up', 'went up', 'monte montes monte montons montez montent', 'monté', 'être'),
  v('retourner', 'go back', 'goes back', 'went back', 'retourne retournes retourne retournons retournez retournent', 'retourné', 'être'),
];
// -er verbs whose spelling changes. `wrong`: the classic mistake in each slot (none of them a real present-tense form)
export const ER_SPELL = [
  v('manger', 'eat', 'eats', 'ate', 'mange manges mange mangeons mangez mangent', 'mangé', 'avoir', { change: 'ger' }),
  v('nager', 'swim', 'swims', 'swam', 'nage nages nage nageons nagez nagent', 'nagé', 'avoir', { change: 'ger' }),
  v('voyager', 'travel', 'travels', 'travelled', 'voyage voyages voyage voyageons voyagez voyagent', 'voyagé', 'avoir', { change: 'ger' }),
  v('ranger', 'tidy up', 'tidies up', 'tidied up', 'range ranges range rangeons rangez rangent', 'rangé', 'avoir', { change: 'ger' }),
  v('commencer', 'start', 'starts', 'started', 'commence commences commence commençons commencez commencent', 'commencé', 'avoir', { change: 'cer' }),
  v('acheter', 'buy', 'buys', 'bought', 'achète achètes achète achetons achetez achètent', 'acheté', 'avoir', { change: 'e-è', wrong: 'achete achetes achete achètons achètez achetent' }),
  v('préférer', 'prefer', 'prefers', 'preferred', 'préfère préfères préfère préférons préférez préfèrent', 'préféré', 'avoir', { change: 'é-è', wrong: 'préfére préféres préfére préfèrons préfèrez préférent' }),
  v('espérer', 'hope', 'hopes', 'hoped', 'espère espères espère espérons espérez espèrent', 'espéré', 'avoir', { change: 'é-è', wrong: 'espére espéres espére espèrons espèrez espérent' }),
  v('appeler', 'call', 'calls', 'called', 'appelle appelles appelle appelons appelez appellent', 'appelé', 'avoir', { change: 'll', wrong: 'appele appeles appele appellons appellez appelent' }),
];
export const IR = [
  v('finir', 'finish', 'finishes', 'finished', 'finis finis finit finissons finissez finissent', 'fini'),
  v('choisir', 'choose', 'chooses', 'chose', 'choisis choisis choisit choisissons choisissez choisissent', 'choisi'),
  v('remplir', 'fill', 'fills', 'filled', 'remplis remplis remplit remplissons remplissez remplissent', 'rempli'),
  v('réussir', 'succeed', 'succeeds', 'succeeded', 'réussis réussis réussit réussissons réussissez réussissent', 'réussi'),
  v('grandir', 'grow up', 'grows up', 'grew up', 'grandis grandis grandit grandissons grandissez grandissent', 'grandi'),
  v('obéir', 'obey', 'obeys', 'obeyed', 'obéis obéis obéit obéissons obéissez obéissent', 'obéi'),
  v('rougir', 'blush', 'blushes', 'blushed', 'rougis rougis rougit rougissons rougissez rougissent', 'rougi'),
];
export const RE = [
  v('vendre', 'sell', 'sells', 'sold', 'vends vends vend vendons vendez vendent', 'vendu'),
  v('attendre', 'wait', 'waits', 'waited', 'attends attends attend attendons attendez attendent', 'attendu'),
  v('répondre', 'answer', 'answers', 'answered', 'réponds réponds répond répondons répondez répondent', 'répondu'),
  v('entendre', 'hear', 'hears', 'heard', 'entends entends entend entendons entendez entendent', 'entendu'),
  v('perdre', 'lose', 'loses', 'lost', 'perds perds perd perdons perdez perdent', 'perdu'),
  v('descendre', 'go down', 'goes down', 'went down', 'descends descends descend descendons descendez descendent', 'descendu', 'être'),
];
// irregular verbs: present tense and past participle written out in full
export const IRREG = {
  être: v('être', 'be', 'is', 'was', 'suis es est sommes êtes sont', 'été', 'avoir', { wrongPP: 'êté étu', enP: ['am', 'are', 'is', 'are', 'are', 'are'] }),
  avoir: v('avoir', 'have', 'has', 'had', 'ai as a avons avez ont', 'eu', 'avoir', { wrongPP: 'avé avu' }),
  aller: v('aller', 'go', 'goes', 'went', 'vais vas va allons allez vont', 'allé', 'être'),
  faire: v('faire', 'do', 'does', 'did', 'fais fais fait faisons faites font', 'fait', 'avoir', { wrongPP: 'faisé faité' }),
  prendre: v('prendre', 'take', 'takes', 'took', 'prends prends prend prenons prenez prennent', 'pris', 'avoir', { wrongPP: 'prendu prené' }),
  comprendre: v('comprendre', 'understand', 'understands', 'understood', 'comprends comprends comprend comprenons comprenez comprennent', 'compris', 'avoir', { wrongPP: 'comprendu comprené' }),
  apprendre: v('apprendre', 'learn', 'learns', 'learnt', 'apprends apprends apprend apprenons apprenez apprennent', 'appris', 'avoir', { wrongPP: 'apprendu apprené' }),
  venir: v('venir', 'come', 'comes', 'came', 'viens viens vient venons venez viennent', 'venu', 'être'),
  devenir: v('devenir', 'become', 'becomes', 'became', 'deviens deviens devient devenons devenez deviennent', 'devenu', 'être'),
  revenir: v('revenir', 'come back', 'comes back', 'came back', 'reviens reviens revient revenons revenez reviennent', 'revenu', 'être'),
  sortir: v('sortir', 'go out', 'goes out', 'went out', 'sors sors sort sortons sortez sortent', 'sorti', 'être'),
  partir: v('partir', 'leave', 'leaves', 'left', 'pars pars part partons partez partent', 'parti', 'être'),
  dormir: v('dormir', 'sleep', 'sleeps', 'slept', 'dors dors dort dormons dormez dorment', 'dormi', 'avoir', { wrongPP: 'dormé dormu' }),
  lire: v('lire', 'read', 'reads', 'read', 'lis lis lit lisons lisez lisent', 'lu', 'avoir', { wrongPP: 'lisé lisu' }),
  écrire: v('écrire', 'write', 'writes', 'wrote', 'écris écris écrit écrivons écrivez écrivent', 'écrit', 'avoir', { wrongPP: 'écrivé écrivu' }),
  boire: v('boire', 'drink', 'drinks', 'drank', 'bois bois boit buvons buvez boivent', 'bu', 'avoir', { wrongPP: 'buvé buvu' }),
  voir: v('voir', 'see', 'sees', 'saw', 'vois vois voit voyons voyez voient', 'vu', 'avoir', { wrongPP: 'voyé voiru' }),
  mettre: v('mettre', 'put', 'puts', 'put', 'mets mets met mettons mettez mettent', 'mis', 'avoir', { wrongPP: 'mettu metté' }),
  dire: v('dire', 'say', 'says', 'said', 'dis dis dit disons dites disent', 'dit', 'avoir', { wrongPP: 'disé disu' }),
  pouvoir: v('pouvoir', 'can', 'can', 'could', 'peux peux peut pouvons pouvez peuvent', 'pu', 'avoir', { wrongPP: 'pouvé pouvu' }),
  vouloir: v('vouloir', 'want to', 'wants to', 'wanted to', 'veux veux veut voulons voulez veulent', 'voulu', 'avoir', { wrongPP: 'voulé veulu' }),
  devoir: v('devoir', 'have to', 'has to', 'had to', 'dois dois doit devons devez doivent', 'dû', 'avoir', { wrongPP: 'devé devu' }),
  savoir: v('savoir', 'know', 'knows', 'knew', 'sais sais sait savons savez savent', 'su', 'avoir', { wrongPP: 'savé savu' }),
  ouvrir: v('ouvrir', 'open', 'opens', 'opened', 'ouvre ouvres ouvre ouvrons ouvrez ouvrent', 'ouvert', 'avoir', { wrongPP: 'ouvri ouvru' }),
  courir: v('courir', 'run', 'runs', 'ran', 'cours cours court courons courez courent', 'couru', 'avoir', { wrongPP: 'couri couré' }),
  recevoir: v('recevoir', 'receive', 'receives', 'received', 'reçois reçois reçoit recevons recevez reçoivent', 'reçu', 'avoir', { wrongPP: 'recevu recevé' }),
  naître: v('naître', 'be born', 'is born', 'was born', 'nais nais naît naissons naissez naissent', 'né', 'être'),
};
// reflexive verbs: the verb part only (the pronoun me/te/se… is added by refl())
export const REFLEXIVE = [
  v('se lever', 'get up', 'gets up', 'got up', 'lève lèves lève levons levez lèvent', 'levé', 'être'),
  v('se réveiller', 'wake up', 'wakes up', 'woke up', 'réveille réveilles réveille réveillons réveillez réveillent', 'réveillé', 'être'),
  v('se laver', 'have a wash', 'has a wash', 'had a wash', 'lave laves lave lavons lavez lavent', 'lavé', 'être'),
  v('se doucher', 'have a shower', 'has a shower', 'had a shower', 'douche douches douche douchons douchez douchent', 'douché', 'être'),
  v('s’habiller', 'get dressed', 'gets dressed', 'got dressed', 'habille habilles habille habillons habillez habillent', 'habillé', 'être'),
  v('se coucher', 'go to bed', 'goes to bed', 'went to bed', 'couche couches couche couchons couchez couchent', 'couché', 'être'),
  v('se reposer', 'rest', 'rests', 'rested', 'repose reposes repose reposons reposez reposent', 'reposé', 'être'),
  v('s’amuser', 'have fun', 'has fun', 'had fun', 'amuse amuses amuse amusons amusez amusent', 'amusé', 'être'),
  v('se promener', 'go for a walk', 'goes for a walk', 'went for a walk', 'promène promènes promène promenons promenez promènent', 'promené', 'être'),
  v('se dépêcher', 'hurry', 'hurries', 'hurried', 'dépêche dépêches dépêche dépêchons dépêchez dépêchent', 'dépêché', 'être'),
  v('s’appeler', 'be called', 'is called', 'was called', 'appelle appelles appelle appelons appelez appellent', 'appelé', 'être', { noEnglish: true, noPerfect: true }),
];

export const verb = (inf) => [...ER, ...ER_SPELL, ...IR, ...RE, ...Object.values(IRREG), ...REFLEXIVE].find((x) => x.inf === inf);

const ER_END = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
const IR_END = ['is', 'is', 'it', 'issons', 'issez', 'issent'];
const RE_END = ['s', 's', '', 'ons', 'ez', 'ent'];
const AVOIR = IRREG.avoir.pres;
const ETRE = IRREG.être.pres;
const PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

// ---------------------------------------------------------------------------------------------
// subjects
export const SUBJECTS = [
  { fr: 'je', p: 0, en: 'I' },
  { fr: 'tu', p: 1, en: 'you', note: 'talking to one friend' },
  { fr: 'il', p: 2, en: 'he' },
  { fr: 'elle', p: 2, en: 'she' },
  { fr: 'nous', p: 3, en: 'we' },
  { fr: 'vous', p: 4, en: 'you', note: 'talking to a group' },
  { fr: 'ils', p: 5, en: 'they', note: 'a group of boys' },
  { fr: 'elles', p: 5, en: 'they', note: 'a group of girls' },
];
// people with a gender and number, for agreement in the perfect tense with être.
// g: 'm' or 'f'; pl: plural; L: the lowest level that uses them
export const PEOPLE = [
  { fr: 'je', p: 0, g: 'm', pl: false, en: 'I', who: 'Tom is speaking', L: 1 },
  { fr: 'je', p: 0, g: 'f', pl: false, en: 'I', who: 'Léa is speaking', L: 1 },
  { fr: 'tu', p: 1, g: 'm', pl: false, en: 'you', who: 'talking to Hugo', L: 1 },
  { fr: 'tu', p: 1, g: 'f', pl: false, en: 'you', who: 'talking to Chloé', L: 1 },
  { fr: 'il', p: 2, g: 'm', pl: false, en: 'he', L: 1 },
  { fr: 'elle', p: 2, g: 'f', pl: false, en: 'she', L: 1 },
  { fr: 'Marie', p: 2, g: 'f', pl: false, en: 'Marie', L: 1 },
  { fr: 'Paul', p: 2, g: 'm', pl: false, en: 'Paul', L: 1 },
  { fr: 'ma sœur', p: 2, g: 'f', pl: false, en: 'my sister', L: 2 },
  { fr: 'mon frère', p: 2, g: 'm', pl: false, en: 'my brother', L: 2 },
  { fr: 'nous', p: 3, g: 'f', pl: true, en: 'we', who: 'Léa and Chloé are speaking', L: 1 },
  { fr: 'nous', p: 3, g: 'm', pl: true, en: 'we', who: 'Tom and Léa are speaking', L: 2 },
  { fr: 'vous', p: 4, g: 'm', pl: true, en: 'you', who: 'talking to a group of boys', L: 1 },
  { fr: 'vous', p: 4, g: 'f', pl: true, en: 'you', who: 'talking to a group of girls', L: 1 },
  { fr: 'vous', p: 4, g: 'm', pl: false, en: 'you', who: 'talking politely to Mr Martin', L: 3 },
  { fr: 'vous', p: 4, g: 'f', pl: false, en: 'you', who: 'talking politely to Mrs Martin', L: 3 },
  { fr: 'ils', p: 5, g: 'm', pl: true, en: 'they', who: 'a group of boys', L: 1 },
  { fr: 'elles', p: 5, g: 'f', pl: true, en: 'they', who: 'a group of girls', L: 1 },
  { fr: 'mes parents', p: 5, g: 'm', pl: true, en: 'my parents', L: 2 },
  { fr: 'mes cousines', p: 5, g: 'f', pl: true, en: 'my cousins', who: 'all girls', L: 2 },
  { fr: 'Léa et Tom', p: 5, g: 'm', pl: true, en: 'Léa and Tom', L: 3 },
];
/** Past participle agreement with être: -e for feminine, -s for plural. */
export const agree = (pp, g, pl) => pp + (g === 'f' ? 'e' : '') + (pl ? 's' : '');
const AGREE_WHY = (g, pl) => (pl ? (g === 'f' ? 'feminine plural, so add -es' : 'masculine (or mixed) plural, so add -s') : (g === 'f' ? 'feminine singular, so add -e' : 'masculine singular, so add nothing'));
const KIND = (g, pl) => `${g === 'f' ? 'feminine' : 'masculine'} ${pl ? 'plural' : 'singular'}`;
const GENDER = { m: 'masculine', f: 'feminine' };
const pronounFor = (s) => (s.p === 2 ? (s.g === 'f' ? 'elle' : 'il') : s.p === 5 ? (s.g === 'f' ? 'elles' : 'ils') : s.fr);

const englishPresent = (vb, p) => (vb.enP ? vb.enP[p] : p === 2 ? vb.en3 : vb.en);
const who = (s) => (s.who || s.note ? ` (${s.who || s.note})` : '');
const tableOf = (vb) => vb.pres.map((f, p) => subj(PRONOUNS[p], f)).join(', ');
const enPlural = (w) => (w === 'fish' ? 'fish' : w === 'mouse' ? 'mice' : /[^aeiou]y$/.test(w) ? `${w.slice(0, -1)}ies` : /(s|sh|ch|x)$/.test(w) ? `${w}es` : `${w}s`);
const anA = (w) => (/^[aeiou]/.test(w) ? 'an' : 'a');

/** A choice question: `correct` plus up to three distinct wrong answers (never the correct text). */
function choice(prompt, correct, wrongs, rng, extra) {
  const key = (t) => t.toLowerCase().replace(/’/g, "'");
  const seen = new Set([key(correct)]);
  const ws = [];
  for (const w of wrongs) if (w && !seen.has(key(w))) { seen.add(key(w)); ws.push(w); }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.slice(0, 3).map((t) => ({ text: t }))]), ...extra };
}
/** A typed French answer. */
function typed(prompt, answer, accept, extra) {
  const acc = [...new Set(accept.filter((a) => a && a !== answer))];
  return { kind: 'typed', prompt, answer, accept: acc, lang: 'fr', placeholder: 'Type the French', ...extra };
}
/** The answer without its subject: “nous jouons” → “jouons”, “j’ai joué” → “ai joué”. */
function bareOf(answer, s) {
  if (answer.startsWith('j’')) return answer.slice(2);
  if (answer.startsWith(`${s.fr} `)) return answer.slice(s.fr.length + 1);
  return null;
}

// ---------------------------------------------------------------------------------------------
// the present tense
export function groupOf(vb) {
  if (ER.includes(vb) || ER_SPELL.includes(vb)) return 'er';
  if (IR.includes(vb)) return 'ir';
  if (RE.includes(vb)) return 're';
  return 'irregular';
}
function presentSteps(vb, s) {
  const p = s.p;
  const form = vb.pres[p];
  const answer = subj(s.fr, form);
  const group = groupOf(vb);
  const stem = vb.inf.slice(0, -2);
  const elide = s.fr === 'je' && startsVowel(form) ? ' (je becomes j’ before a vowel or a silent h)' : '';
  if (group === 'irregular') return [`${vb.inf} is irregular, so its present tense is learned by heart.`, `${tableOf(vb)}.`, `So: ${answer}${elide}.`];
  const end = { er: ER_END, ir: IR_END, re: RE_END }[group][p];
  const s1 = `${vb.inf} is a regular -${group} verb: take off -${group} to find the stem, ${stem}-.`;
  let s2 = group === 're' && p === 2 ? `For il and elle a regular -re verb adds no ending at all: ${stem}.` : `The ending for ${s.fr} is -${end}: ${stem} + ${end}.`;
  if (vb.change === 'ger' && p === 3) s2 = `The nous ending is -ons, but -ger verbs keep an e before it so the g stays soft (as in “gentle”): ${stem}e + ons.`;
  if (vb.change === 'cer' && p === 3) s2 = `The nous ending is -ons, but the c becomes ç before o so it still sounds like s: ${stem.slice(0, -1)}ç + ons.`;
  if (vb.change === 'e-è') s2 = [3, 4].includes(p) ? `The ending is -${end}. In the nous and vous forms the e stays plain: ${form}.` : `The ending is -${end}, and in the je, tu, il and ils forms the e before the last consonant takes a grave accent: ${form}.`;
  if (vb.change === 'é-è') s2 = [3, 4].includes(p) ? `The ending is -${end}. In the nous and vous forms the é stays as it is: ${form}.` : `The ending is -${end}, and in the je, tu, il and ils forms the second é becomes è: ${form}.`;
  if (vb.change === 'll') s2 = [3, 4].includes(p) ? `The ending is -${end}. In the nous and vous forms there is only one l: ${form}.` : `The ending is -${end}, and in the je, tu, il and ils forms the l doubles: ${form}.`;
  return [s1, s2, `So: ${answer}${elide}.`];
}
/** Classic mistakes for one slot, none of them a real present-tense form of the verb. */
function errorsFor(vb, p) {
  const group = groupOf(vb), stem = vb.inf.slice(0, -2), out = [];
  if (vb.wrong) out.push(vb.wrong.split(' ')[p]);
  if ((vb.change === 'ger' || vb.change === 'cer') && p === 3) out.push(`${stem}ons`);
  if (group === 'ir') out.push(stem + ER_END[p]);
  if (group === 're' && p === 2) out.push(`${stem}t`);
  out.push(vb.inf);
  return out.filter((w) => !vb.pres.includes(w));
}
function presentQ(pool, level, rng) {
  const vb = rng.pick(pool);
  const s = rng.pick(SUBJECTS);
  const form = vb.pres[s.p];
  const answer = subj(s.fr, form);
  const steps = presentSteps(vb, s);
  const explain = `${answer}: the present tense of ${vb.inf} for ${s.fr}.`;
  if (level === 1) {
    const errs = rng.shuffle(errorsFor(vb, s.p)).slice(0, 1);
    const others = rng.shuffle([...new Set(vb.pres.filter((f) => f !== form))]);
    return choice(`Which is the present tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**?`, answer, [...errs, ...others].map((f) => subj(s.fr, f)), rng, { explain, steps });
  }
  if (level === 3 && rng.chance(0.5)) {
    const en = `${s.en} ${englishPresent(vb, s.p)}`;
    return typed(`How do you say **${en}**${who(s)} in French? Use the present tense.`, answer, [form], { explain: `${en} = ${answer} (from ${vb.inf}).`, steps });
  }
  return typed(`Write the present tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**.`, answer, [form], { explain, steps });
}

// ---------------------------------------------------------------------------------------------
// infinitive phrases for modal verbs and the near future; reflexive ones take the subject’s pronoun
export const PHRASES = [
  ['jouer au foot', 'play football'],
  ['regarder un film', 'watch a film'],
  ['manger une pizza', 'eat a pizza'],
  ['faire du vélo', 'go cycling'],
  ['prendre le train', 'take the train'],
  ['visiter le musée', 'visit the museum'],
  ['acheter un cadeau', 'buy a present'],
  ['aller à la plage', 'go to the beach'],
  ['partir en vacances', 'go on holiday'],
  ['voir des amis', 'see some friends'],
  ['écouter de la musique', 'listen to music'],
  ['lire un livre', 'read a book'],
  ['nager dans la mer', 'swim in the sea'],
  ['rester à la maison', 'stay at home'],
  ['sortir ce soir', 'go out this evening'],
  ['se lever tôt', 'get up early'],
  ['se coucher tard', 'go to bed late'],
  ['s’amuser', 'have fun'],
  ['se reposer', 'rest'],
];
const isReflexivePhrase = (fr) => fr.startsWith('se ') || fr.startsWith('s’');
/** The infinitive phrase for person p: “se lever tôt” → “nous lever tôt” for nous. */
export function phraseFor(fr, p) {
  if (fr.startsWith('se ')) return refl(p, fr.slice(3));
  if (fr.startsWith('s’')) return refl(p, fr.slice(2));
  return fr;
}
/** A learner’s mistake: conjugating the second verb too (je vais joue au foot). */
function conjugatedSecond(fr, p) {
  const [inf, ...rest] = fr.split(' ');
  return [verb(inf).pres[p], ...rest].join(' ');
}
const BE = ['am', 'are', 'is', 'are', 'are', 'are'];

function auxPlusInfinitive(aux, level, rng, { label, enFor, rule }) {
  const s = rng.pick(SUBJECTS);
  const [fr, en] = rng.pick(level === 1 ? PHRASES.filter(([f]) => !isReflexivePhrase(f)) : PHRASES);
  const form = aux.pres[s.p];
  const inf = phraseFor(fr, s.p);
  const negative = level === 3 && rng.chance(0.35);
  const answer = negative ? `${subj(s.fr, neg(form))} pas ${inf}` : `${subj(s.fr, form)} ${inf}`;
  const reflNote = isReflexivePhrase(fr) ? ` The reflexive pronoun matches the subject (${s.fr} → ${REFL[s.p]}), so ${fr} becomes ${inf}.` : '';
  const steps = [
    `${aux.inf} for ${s.fr}: ${subj(s.fr, form)} (${tableOf(aux)}).`,
    `${rule}${reflNote}`,
    negative ? `For a negative, ne… pas goes round the ${aux.inf} part: ${answer}.` : `So: ${answer}.`,
  ];
  const explain = `${answer}: ${label}.`;
  if (level === 1) {
    const wrongForms = rng.shuffle(aux.pres.filter((f) => f !== form)).slice(0, 2).map((f) => `${subj(s.fr, f)} ${inf}`);
    const wrongs = rng.shuffle([`${subj(s.fr, form)} ${conjugatedSecond(fr, s.p)}`, `${subj(s.fr, aux.inf)} ${inf}`]);
    return choice(`Which is right for **${s.fr}** + **${aux.inf}** + **${fr}** (${en})?`, answer, [wrongs[0], ...wrongForms, wrongs[1]], rng, { explain, steps });
  }
  const enPhrase = enFor(s, en, negative);
  if (level === 3 || rng.chance(0.4)) return typed(`How do you say **${enPhrase}**${who(s)} in French?`, answer, [], { explain: `${enPhrase} = ${answer}.`, steps });
  return typed(`Write **${s.fr}** + the right form of **${aux.inf}** + **${fr}** (${en}).`, answer, [], { explain, steps });
}

// ---------------------------------------------------------------------------------------------
// the perfect tense
const AVOIR_REG = [...ER.filter((x) => x.aux === 'avoir'), ...ER_SPELL, ...IR, ...RE.filter((x) => x.aux === 'avoir')];
const AVOIR_IRREG = ['être', 'avoir', 'faire', 'prendre', 'comprendre', 'apprendre', 'dormir', 'lire', 'écrire', 'boire', 'voir', 'mettre', 'dire', 'pouvoir', 'vouloir', 'devoir', 'savoir', 'ouvrir', 'courir', 'recevoir'].map((k) => IRREG[k]);
// verbs that read well in English on their own (“I swam”, “I didn’t swim”): only these are asked from English
const EN_PERFECT = ['jouer', 'regarder', 'écouter', 'parler', 'travailler', 'chanter', 'danser', 'marcher', 'étudier', 'manger', 'nager', 'voyager', 'ranger', 'commencer',
  'finir', 'réussir', 'grandir', 'obéir', 'rougir', 'attendre', 'répondre', 'perdre', 'dormir', 'lire', 'écrire', 'boire', 'courir', 'comprendre', 'apprendre', 'voir'];
// negatives of these do not translate simply (“I didn’t can”), so they are never made negative
const NO_NEGATIVE = ['être', 'avoir', 'pouvoir', 'vouloir', 'devoir', 'savoir'];
// verbs that only ever take être (monter, descendre, sortir, rentrer, retourner and entrer can take avoir when they have an object)
const ETRE_ONLY = ['aller', 'venir', 'devenir', 'revenir', 'partir', 'naître', 'arriver', 'rester', 'tomber'].map(verb);
const ETRE_ALL = [...ETRE_ONLY, ...['sortir', 'entrer', 'rentrer', 'monter', 'retourner', 'descendre'].map(verb)];
// avoir verbs that can never be passive, so “il est dormi” is safely wrong
const AVOIR_INTRANSITIVE = ['dormir', 'marcher', 'nager', 'voyager'].map(verb);

const PP_RULE = { er: '-er verbs: -er → -é', ir: '-ir verbs: -ir → -i', re: '-re verbs: -re → -u' };
function ppStep(vb) {
  const g = groupOf(vb);
  if (g === 'irregular') return `${vb.inf} has an irregular past participle: ${vb.pp}.`;
  return `Past participle (${PP_RULE[g]}): ${vb.inf} → ${vb.pp}.`;
}
export function perfectAvoir(vb, s, negative) {
  return negative ? `${subj(s.fr, neg(AVOIR[s.p]))} pas ${vb.pp}` : `${subj(s.fr, AVOIR[s.p])} ${vb.pp}`;
}
export function perfectEtre(vb, s, negative) {
  const pp = agree(vb.pp, s.g, s.pl);
  const aux = REFLEXIVE.includes(vb) ? refl(s.p, ETRE[s.p]) : ETRE[s.p];
  if (!negative) return `${subj(s.fr, aux)} ${pp}`;
  return `${subj(s.fr, startsVowel(aux) ? `n’${aux}` : `ne ${aux}`)} pas ${pp}`;
}
const pastOf = (vb, s) => (vb.inf === 'naître' ? (s.p === 0 || (s.p === 2 && !s.pl) ? 'was born' : 'were born') : vb.past);
function perfectAccept(answer, s) {
  const acc = [bareOf(answer, s)];
  if (!['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'].includes(s.fr)) acc.push(`${pronounFor(s)} ${answer.slice(s.fr.length + 1)}`);
  return acc;
}

// a past participle question
function participleQ(vb, rng) {
  const g = groupOf(vb), stem = vb.inf.slice(0, -2);
  const wrongs = g === 'er' ? [vb.inf, vb.pres[2], vb.pres[4]]
    : g === 'ir' ? [vb.inf, vb.pres[2], `${stem}é`]
      : g === 're' ? [vb.inf, vb.pres[2], `${stem}é`]
        : [...vb.wrongPP.split(' '), vb.inf, vb.pres[2]];
  return choice(`What is the past participle of **${vb.inf}** (to ${vb.en})?`, vb.pp, rng.shuffle(wrongs), rng, {
    explain: `${vb.inf} → ${vb.pp}, as in ${subj('je', AVOIR[0])} ${vb.pp} (I ${vb.past}).`,
    steps: [`The past participle is the part after avoir: j’ai ${vb.pp} = I ${vb.past}.`, ppStep(vb), `So: ${vb.pp}.`],
  });
}

// ---------------------------------------------------------------------------------------------
// nouns: [french, gender, english, plural if not just + s, tricky gender, no plural or “a”]
export const NOUNS = [
  ['livre', 'm', 'book'], ['chat', 'm', 'cat'], ['chien', 'm', 'dog'], ['stylo', 'm', 'pen'], ['vélo', 'm', 'bike'],
  ['frère', 'm', 'brother'], ['jardin', 'm', 'garden'], ['sac', 'm', 'bag'], ['gâteau', 'm', 'cake', 'gâteaux'],
  ['cheval', 'm', 'horse', 'chevaux'], ['ordinateur', 'm', 'computer'], ['arbre', 'm', 'tree'], ['oiseau', 'm', 'bird', 'oiseaux'],
  ['hôpital', 'm', 'hospital', 'hôpitaux'], ['hôtel', 'm', 'hotel'], ['animal', 'm', 'animal', 'animaux'], ['avion', 'm', 'plane'],
  ['musée', 'm', 'museum', null, true], ['lycée', 'm', 'sixth-form college', null, true], ['fromage', 'm', 'cheese', null, true],
  ['poisson', 'm', 'fish'], ['lit', 'm', 'bed'], ['bureau', 'm', 'desk', 'bureaux'], ['journal', 'm', 'newspaper', 'journaux'],
  ['parc', 'm', 'park'], ['magasin', 'm', 'shop'], ['problème', 'm', 'problem', null, true],
  ['maison', 'f', 'house'], ['table', 'f', 'table'], ['sœur', 'f', 'sister'], ['voiture', 'f', 'car'], ['fenêtre', 'f', 'window'],
  ['porte', 'f', 'door'], ['chaise', 'f', 'chair'], ['plage', 'f', 'beach', null, true], ['ville', 'f', 'town'], ['cuisine', 'f', 'kitchen'],
  ['chambre', 'f', 'bedroom'], ['école', 'f', 'school'], ['église', 'f', 'church'], ['eau', 'f', 'water', null, true, true],
  ['image', 'f', 'picture', null, true], ['piscine', 'f', 'swimming pool'], ['pomme', 'f', 'apple'], ['jupe', 'f', 'skirt'],
  ['chemise', 'f', 'shirt'], ['gare', 'f', 'station'], ['rue', 'f', 'street'], ['souris', 'f', 'mouse', 'souris'], ['page', 'f', 'page', null, true],
  ['fleur', 'f', 'flower'], ['idée', 'f', 'idea'], ['île', 'f', 'island'], ['affiche', 'f', 'poster'], ['histoire', 'f', 'story'],
].map(([fr, g, en, plural, tricky, mass]) => ({ fr, g, en, plural: plural || `${fr}s`, tricky: !!tricky, mass: !!mass }));
export const theFor = (n) => (startsVowel(n.fr) ? 'l’' : n.g === 'm' ? 'le' : 'la');
const withThe = (n) => (startsVowel(n.fr) ? `l’${n.fr}` : `${theFor(n)} ${n.fr}`);
const vowelWhy = (w) => (/^h/.test(w) ? 'a silent h' : 'a vowel');

// foods and drinks: [french, gender, plural?, english, drink?]
export const FOODS = [
  ['pain', 'm', false, 'bread'], ['fromage', 'm', false, 'cheese'], ['poulet', 'm', false, 'chicken'], ['poisson', 'm', false, 'fish'],
  ['riz', 'm', false, 'rice'], ['jambon', 'm', false, 'ham'], ['viande', 'f', false, 'meat'], ['salade', 'f', false, 'salad'],
  ['soupe', 'f', false, 'soup'], ['confiture', 'f', false, 'jam'], ['glace', 'f', false, 'ice cream'], ['pizza', 'f', false, 'pizza'],
  ['pâtes', 'f', true, 'pasta'], ['frites', 'f', true, 'chips'], ['légumes', 'm', true, 'vegetables'], ['fruits', 'm', true, 'fruit'],
  ['céréales', 'f', true, 'cereal'], ['œufs', 'm', true, 'eggs'], ['chips', 'f', true, 'crisps'], ['bonbons', 'm', true, 'sweets'],
  ['lait', 'm', false, 'milk', true], ['café', 'm', false, 'coffee', true], ['thé', 'm', false, 'tea', true], ['jus d’orange', 'm', false, 'orange juice', true],
  ['chocolat chaud', 'm', false, 'hot chocolate', true], ['eau', 'f', false, 'water', true], ['limonade', 'f', false, 'lemonade', true],
].map(([fr, g, pl, en, drink]) => ({ fr, g, pl, en, drink: !!drink }));
export const partitive = (f) => (f.pl ? 'des' : startsVowel(f.fr) ? 'de l’' : f.g === 'm' ? 'du' : 'de la');
export const definite = (f) => (f.pl ? 'les' : startsVowel(f.fr) ? 'l’' : f.g === 'm' ? 'le' : 'la');
const deOf = (f) => (startsVowel(f.fr) ? 'd’' : 'de');
const joinArt = (art, word) => (art.endsWith('’') ? art + word : `${art} ${word}`);
const foodKind = (f) => (f.pl ? 'plural' : `${GENDER[f.g]}${startsVowel(f.fr) ? ` and starts with ${vowelWhy(f.fr)}` : ''}`);
const EAT_SUBJ = SUBJECTS.filter((s) => ['je', 'tu', 'il', 'elle', 'nous'].includes(s.fr));

// adjectives for things: [masc sg, fem sg, masc pl, fem pl], English, BAGS (before the noun)?
const A = (forms, en, before) => ({ forms: forms.split(' '), en, before });
export const ADJ = {
  petit: A('petit petite petits petites', 'small', true), grand: A('grand grande grands grandes', 'big', true),
  joli: A('joli jolie jolis jolies', 'pretty', true), beau: A('beau belle beaux belles', 'beautiful', true),
  nouveau: A('nouveau nouvelle nouveaux nouvelles', 'new', true), vieux: A('vieux vieille vieux vieilles', 'old', true),
  vert: A('vert verte verts vertes', 'green', false), noir: A('noir noire noirs noires', 'black', false),
  bleu: A('bleu bleue bleus bleues', 'blue', false), gris: A('gris grise gris grises', 'grey', false),
  blanc: A('blanc blanche blancs blanches', 'white', false), rouge: A('rouge rouge rouges rouges', 'red', false),
  marron: A('marron marron marron marron', 'brown', false), long: A('long longue longs longues', 'long', false),
};
// adjectives for people (after être)
export const PADJ = {
  grand: A('grand grande grands grandes', 'tall'), petit: A('petit petite petits petites', 'short'),
  intelligent: A('intelligent intelligente intelligents intelligentes', 'clever'), sportif: A('sportif sportive sportifs sportives', 'sporty'),
  heureux: A('heureux heureuse heureux heureuses', 'happy'), gentil: A('gentil gentille gentils gentilles', 'kind'),
  paresseux: A('paresseux paresseuse paresseux paresseuses', 'lazy'), bavard: A('bavard bavarde bavards bavardes', 'chatty'),
  timide: A('timide timide timides timides', 'shy'), drôle: A('drôle drôle drôles drôles', 'funny'),
  créatif: A('créatif créative créatifs créatives', 'creative'), sérieux: A('sérieux sérieuse sérieux sérieuses', 'serious'),
};
export const slot = (g, pl) => (g === 'm' ? 0 : 1) + (pl ? 2 : 0);
// things to describe (beau, nouveau and vieux have special forms before a masculine vowel, so none of these starts with one)
const COLOURS = ['vert', 'noir', 'bleu', 'gris', 'blanc', 'rouge', 'marron'];
const SIZES = ['petit', 'grand', 'joli', 'beau', 'nouveau', 'vieux'];
export const THINGS = [
  ['chat', 'm', 'cat', 'chats', ['petit', 'grand', 'joli', 'beau', 'vieux', 'noir', 'blanc', 'gris']],
  ['vélo', 'm', 'bike', 'vélos', [...SIZES, ...COLOURS]], ['sac', 'm', 'bag', 'sacs', [...SIZES, ...COLOURS]],
  ['pull', 'm', 'jumper', 'pulls', [...SIZES, ...COLOURS]], ['livre', 'm', 'book', 'livres', ['petit', 'grand', 'beau', 'nouveau', 'vieux', ...COLOURS]],
  ['jardin', 'm', 'garden', 'jardins', ['petit', 'grand', 'joli', 'beau', 'vieux']],
  ['maison', 'f', 'house', 'maisons', [...SIZES, 'blanc', 'gris', 'rouge']], ['voiture', 'f', 'car', 'voitures', [...SIZES, ...COLOURS]],
  ['jupe', 'f', 'skirt', 'jupes', [...SIZES, ...COLOURS, 'long']], ['robe', 'f', 'dress', 'robes', [...SIZES, ...COLOURS, 'long']],
  ['chemise', 'f', 'shirt', 'chemises', [...SIZES, ...COLOURS]], ['veste', 'f', 'jacket', 'vestes', [...SIZES, ...COLOURS]],
  ['chaussure', 'f', 'shoe', 'chaussures', [...SIZES, ...COLOURS]], ['chaussette', 'f', 'sock', 'chaussettes', ['petit', 'grand', 'nouveau', 'vieux', ...COLOURS]],
  ['fleur', 'f', 'flower', 'fleurs', ['petit', 'grand', 'joli', 'beau', 'bleu', 'blanc', 'rouge']],
].map(([fr, g, en, plural, adjs]) => ({ fr, g, en, plural, adjs }));
// people to describe with être
export const DESCRIBED = [
  ['mon frère', 'm', false, 'my brother'], ['ma sœur', 'f', false, 'my sister'], ['mon père', 'm', false, 'my father'], ['ma mère', 'f', false, 'my mother'],
  ['mes parents', 'm', true, 'my parents'], ['mes cousines', 'f', true, 'my cousins, all girls'], ['mes amis', 'm', true, 'my friends, boys'], ['mes amies', 'f', true, 'my friends, all girls'],
  ['Paul', 'm', false, 'Paul'], ['Léa', 'f', false, 'Léa'], ['mes grands-parents', 'm', true, 'my grandparents'], ['mes tantes', 'f', true, 'my aunts'],
].map(([fr, g, pl, en]) => ({ fr, g, pl, en }));

// possessives
export const POSS = {
  my: { forms: ['mon', 'ma', 'mes'], en: 'my' }, your1: { forms: ['ton', 'ta', 'tes'], en: 'your', note: 'talking to one friend' },
  his: { forms: ['son', 'sa', 'ses'], en: 'his' }, her: { forms: ['son', 'sa', 'ses'], en: 'her' },
  our: { forms: ['notre', 'notre', 'nos'], en: 'our' }, your2: { forms: ['votre', 'votre', 'vos'], en: 'your', note: 'talking to a group' },
  their: { forms: ['leur', 'leur', 'leurs'], en: 'their' },
};
export const OWNED = [
  ['père', 'm', false, 'father'], ['mère', 'f', false, 'mother'], ['frère', 'm', false, 'brother'], ['sœur', 'f', false, 'sister'],
  ['chien', 'm', false, 'dog'], ['chat', 'm', false, 'cat'], ['maison', 'f', false, 'house'], ['chambre', 'f', false, 'bedroom'],
  ['voiture', 'f', false, 'car'], ['oncle', 'm', false, 'uncle'], ['tante', 'f', false, 'aunt'], ['amie', 'f', false, 'female friend'],
  ['école', 'f', false, 'school'], ['parents', 'm', true, 'parents'], ['grands-parents', 'm', true, 'grandparents'],
  ['cousins', 'm', true, 'cousins'], ['livres', 'm', true, 'books'], ['chaussures', 'f', true, 'shoes'], ['amis', 'm', true, 'friends'],
  ['histoire', 'f', false, 'story'], ['ordinateur', 'm', false, 'computer'],
].map(([fr, g, pl, en]) => ({ fr, g, pl, en }));
export function possForm(key, n) {
  const f = POSS[key].forms;
  if (n.pl) return f[2];
  if (n.g === 'f' && !startsVowel(n.fr)) return f[1];
  return f[0];
}
const possWhy = (key, n) => (n.pl ? 'plural' : n.g === 'm' ? 'masculine' : startsVowel(n.fr) && POSS[key].forms[0] !== POSS[key].forms[1] ? `feminine, but it starts with ${vowelWhy(n.fr)}, so it takes the masculine form (easier to say)` : 'feminine');

// places: [the name, the whole phrase, English, kind, why]
export const PLACES = [
  ['France', 'en France', 'France', 'country', 'la France is feminine'], ['Angleterre', 'en Angleterre', 'England', 'country', 'l’Angleterre is feminine'],
  ['Écosse', 'en Écosse', 'Scotland', 'country', 'l’Écosse is feminine'], ['Irlande', 'en Irlande', 'Ireland', 'country', 'l’Irlande is feminine'],
  ['Espagne', 'en Espagne', 'Spain', 'country', 'l’Espagne is feminine'], ['Italie', 'en Italie', 'Italy', 'country', 'l’Italie is feminine'],
  ['Allemagne', 'en Allemagne', 'Germany', 'country', 'l’Allemagne is feminine'], ['Belgique', 'en Belgique', 'Belgium', 'country', 'la Belgique is feminine'],
  ['Suisse', 'en Suisse', 'Switzerland', 'country', 'la Suisse is feminine'], ['Grèce', 'en Grèce', 'Greece', 'country', 'la Grèce is feminine'],
  ['Chine', 'en Chine', 'China', 'country', 'la Chine is feminine'], ['Inde', 'en Inde', 'India', 'country', 'l’Inde is feminine'],
  ['Australie', 'en Australie', 'Australia', 'country', 'l’Australie is feminine'],
  ['pays de Galles', 'au pays de Galles', 'Wales', 'country', 'le pays de Galles is masculine'], ['Canada', 'au Canada', 'Canada', 'country', 'le Canada is masculine'],
  ['Portugal', 'au Portugal', 'Portugal', 'country', 'le Portugal is masculine'], ['Maroc', 'au Maroc', 'Morocco', 'country', 'le Maroc is masculine'],
  ['Sénégal', 'au Sénégal', 'Senegal', 'country', 'le Sénégal is masculine'], ['Japon', 'au Japon', 'Japan', 'country', 'le Japon is masculine'],
  ['Brésil', 'au Brésil', 'Brazil', 'country', 'le Brésil is masculine'], ['Mexique', 'au Mexique', 'Mexico', 'country', 'le Mexique is masculine, even though it ends in -e'],
  ['États-Unis', 'aux États-Unis', 'the United States', 'country', 'les États-Unis is plural'], ['Pays-Bas', 'aux Pays-Bas', 'the Netherlands', 'country', 'les Pays-Bas is plural'],
  ['Paris', 'à Paris', 'Paris', 'city', 'Paris is a city'], ['Londres', 'à Londres', 'London', 'city', 'Londres (London) is a city'],
  ['Rome', 'à Rome', 'Rome', 'city', 'Rome is a city'], ['Madrid', 'à Madrid', 'Madrid', 'city', 'Madrid is a city'],
  ['Marseille', 'à Marseille', 'Marseille', 'city', 'Marseille is a city'], ['Montréal', 'à Montréal', 'Montreal', 'city', 'Montréal is a city'],
  ['Édimbourg', 'à Édimbourg', 'Edinburgh', 'city', 'Édimbourg (Edinburgh) is a city'], ['Dakar', 'à Dakar', 'Dakar', 'city', 'Dakar is a city'],
  ['cinéma', 'au cinéma', 'the cinema', 'town', 'le cinéma is masculine: à + le = au'], ['parc', 'au parc', 'the park', 'town', 'le parc is masculine: à + le = au'],
  ['collège', 'au collège', 'secondary school', 'town', 'le collège is masculine: à + le = au'], ['supermarché', 'au supermarché', 'the supermarket', 'town', 'le supermarché is masculine: à + le = au'],
  ['marché', 'au marché', 'the market', 'town', 'le marché is masculine: à + le = au'], ['stade', 'au stade', 'the stadium', 'town', 'le stade is masculine: à + le = au'],
  ['musée', 'au musée', 'the museum', 'town', 'le musée is masculine: à + le = au'], ['restaurant', 'au restaurant', 'the restaurant', 'town', 'le restaurant is masculine: à + le = au'],
  ['piscine', 'à la piscine', 'the swimming pool', 'town', 'la piscine is feminine: à + la stays à la'], ['plage', 'à la plage', 'the beach', 'town', 'la plage is feminine: à + la stays à la'],
  ['gare', 'à la gare', 'the station', 'town', 'la gare is feminine: à + la stays à la'], ['boulangerie', 'à la boulangerie', 'the baker’s', 'town', 'la boulangerie is feminine: à + la stays à la'],
  ['bibliothèque', 'à la bibliothèque', 'the library', 'town', 'la bibliothèque is feminine: à + la stays à la'], ['patinoire', 'à la patinoire', 'the ice rink', 'town', 'la patinoire is feminine: à + la stays à la'],
  ['école', 'à l’école', 'school', 'town', 'l’école starts with a vowel: à + l’ stays à l’'], ['hôpital', 'à l’hôpital', 'the hospital', 'town', 'l’hôpital starts with a silent h: à + l’ stays à l’'],
  ['église', 'à l’église', 'church', 'town', 'l’église starts with a vowel: à + l’ stays à l’'], ['hôtel', 'à l’hôtel', 'the hotel', 'town', 'l’hôtel starts with a silent h: à + l’ stays à l’'],
  ['toilettes', 'aux toilettes', 'the toilets', 'town', 'les toilettes is plural: à + les = aux'], ['magasins', 'aux magasins', 'the shops', 'town', 'les magasins is plural: à + les = aux'],
].map(([name, phrase, en, kind, why]) => ({ name, phrase, prep: phrase.slice(0, phrase.length - name.length).trim(), en, kind, why }));
const PREP_OPTIONS = { country: ['en', 'au', 'aux', 'à'], city: ['à', 'en', 'au', 'aux'], town: ['au', 'à la', 'à l’', 'aux'] };

// negative sentences: [positive, negative with X where pas/jamais/plus goes, which of p(as) j(amais) (p)l(us) make sense]
export const NEG_SENTENCES = [
  ['Je joue au tennis.', 'Je ne joue X au tennis.', 'pjl'],
  ['Tu regardes la télé.', 'Tu ne regardes X la télé.', 'pjl'],
  ['Il aime les maths.', 'Il n’aime X les maths.', 'pl'],
  ['Elle habite à Paris.', 'Elle n’habite X à Paris.', 'pl'],
  ['Nous mangeons de la viande.', 'Nous ne mangeons X de viande.', 'pjl'],
  ['Vous parlez espagnol.', 'Vous ne parlez X espagnol.', 'p'],
  ['Ils écoutent de la musique.', 'Ils n’écoutent X de musique.', 'pjl'],
  ['Elles vont au cinéma.', 'Elles ne vont X au cinéma.', 'pjl'],
  ['J’ai un chien.', 'Je n’ai X de chien.', 'pl'],
  ['Je fais du sport.', 'Je ne fais X de sport.', 'pjl'],
  ['Tu bois du café.', 'Tu ne bois X de café.', 'pjl'],
  ['Il prend le bus.', 'Il ne prend X le bus.', 'pjl'],
  ['Nous sommes contents.', 'Nous ne sommes X contents.', 'pjl'],
  ['Elle a une sœur.', 'Elle n’a X de sœur.', 'p'],
  ['Je lis des magazines.', 'Je ne lis X de magazines.', 'pjl'],
  ['Ils attendent le train.', 'Ils n’attendent X le train.', 'p'],
  ['Je travaille le samedi.', 'Je ne travaille X le samedi.', 'pjl'],
  ['Elle mange des légumes.', 'Elle ne mange X de légumes.', 'pjl'],
  ['On fait les courses.', 'On ne fait X les courses.', 'p'],
  ['J’aime le fromage.', 'Je n’aime X le fromage.', 'pl'],
];
export const NEG_PERFECT = [
  ['J’ai joué au tennis.', 'Je n’ai X joué au tennis.'],
  ['Elle est allée au cinéma.', 'Elle n’est X allée au cinéma.'],
  ['Nous avons mangé de la pizza.', 'Nous n’avons X mangé de pizza.'],
  ['Il s’est levé tôt.', 'Il ne s’est X levé tôt.'],
  ['Tu as fini tes devoirs.', 'Tu n’as X fini tes devoirs.'],
  ['Ils sont partis en vacances.', 'Ils ne sont X partis en vacances.'],
  ['J’ai vu le film.', 'Je n’ai X vu le film.'],
  ['Elles ont bu du thé.', 'Elles n’ont X bu de thé.'],
];
const NEG_WORDS = { p: ['pas', 'not'], j: ['jamais', 'never'], l: ['plus', 'no longer, not any more'] };

/** Wrong negatives for a sentence: ne pas before the verb, after it, no elision, du/de la/des kept. */
function negativeWrongs(pos, pattern) {
  const m = pattern.match(/^(\S+) (ne |n’)(\S+) X (.+)$/);
  const [, S, ne, V, R] = m;
  const at = pos.indexOf(`${V} `);
  const posSV = pos.slice(0, at + V.length), posRest = pos.slice(at + V.length + 1);
  const out = [];
  if (ne === 'n’') out.push(`${S} ne ${V} pas ${R}`);
  if (/^(du|de la|des) /.test(posRest)) out.push(`${S} ${ne}${V} pas ${posRest}`);
  out.push(`${S} ne pas ${V} ${R}`, `${posSV} ne pas ${R}`, `${S} ${ne}${V} ${R}`);
  return out;
}

// ---------------------------------------------------------------------------------------------
export const Y8_FRENCH_GENERATORS = {
  // g-er: the present tense of -er verbs (spelling-change verbs from level 2)
  y8frgEr(level, rng) {
    const pool = level === 1 ? ER.filter((x) => x.aux === 'avoir') : level === 2 ? [...ER, ...ER_SPELL.filter((x) => x.change === 'ger' || x.change === 'cer')] : rng.chance(0.6) ? ER_SPELL : ER;
    return presentQ(pool, level, rng);
  },

  // g-ir-re: regular -ir and -re verbs
  y8frgIrRe(level, rng) {
    return presentQ(rng.chance(0.5) ? IR : RE, level, rng);
  },

  // g-irregular: être, avoir, aller, faire
  y8frgIrregular(level, rng) {
    const pool = ['être', 'avoir', 'aller', 'faire'].map((k) => IRREG[k]);
    if (level === 1 && rng.chance(0.5)) {
      // être or avoir? the classic ils sont / ils ont mix-up
      const vb = rng.pick([IRREG.être, IRREG.avoir]);
      const other = vb === IRREG.être ? IRREG.avoir : IRREG.être;
      const s = rng.pick(SUBJECTS);
      const answer = subj(s.fr, vb.pres[s.p]);
      const en = `${s.en} ${englishPresent(vb, s.p)}`;
      return choice(`Which means **${en}**${who(s)}?`, answer, [subj(s.fr, other.pres[s.p]), ...rng.shuffle(vb.pres.filter((f) => f !== vb.pres[s.p])).map((f) => subj(s.fr, f))], rng, {
        explain: `${en} = ${answer}, from ${vb.inf}. ${subj(s.fr, other.pres[s.p])} would be “${s.en} ${englishPresent(other, s.p)}”.`,
        steps: [`“${englishPresent(vb, s.p)}” comes from ${vb.inf} (to ${vb.en}).`, `${tableOf(vb)}.`, `So: ${answer}.`],
      });
    }
    return presentQ(pool, level, rng);
  },

  // g-modals: pouvoir, vouloir, devoir + infinitive
  y8frgModal(level, rng) {
    const aux = rng.pick([IRREG.pouvoir, IRREG.vouloir, IRREG.devoir]);
    return auxPlusInfinitive(aux, level, rng, {
      label: `${aux.inf} + infinitive`,
      rule: `After ${aux.inf} the second verb stays in the infinitive.`,
      enFor: (s, en, negative) => {
        const three = s.p === 2;
        if (aux.inf === 'pouvoir') return `${s.en} ${negative ? 'can’t' : 'can'} ${en}`;
        if (aux.inf === 'vouloir') return negative ? `${s.en} ${three ? 'doesn’t' : 'don’t'} want to ${en}` : `${s.en} ${three ? 'wants' : 'want'} to ${en}`;
        return negative ? `${s.en} mustn’t ${en}` : `${s.en} ${three ? 'has' : 'have'} to ${en}`;
      },
    });
  },

  // g-future: aller + infinitive
  y8frgFuture(level, rng) {
    return auxPlusInfinitive(IRREG.aller, level, rng, {
      label: 'the near future, aller + infinitive',
      rule: 'Then the infinitive of the action, unchanged: aller + infinitive = “going to …”.',
      enFor: (s, en, negative) => `${s.en} ${BE[s.p]}${negative ? ' not' : ''} going to ${en}`,
    });
  },

  // g-reflexive: the present tense of reflexive verbs
  y8frgReflexive(level, rng) {
    const vb = rng.pick(level === 1 ? REFLEXIVE.slice(0, 8) : REFLEXIVE);
    const s = rng.pick(SUBJECTS);
    const p = s.p;
    const form = vb.pres[p];
    const answer = `${s.fr} ${refl(p, form)}`;
    const bare = vb.inf.replace(/^(se |s’)/, '');
    const elides = [0, 1, 2, 5].includes(p) && startsVowel(form);
    const change = bare === 'lever' || bare === 'promener' ? ' with an accent change (è in the je, tu, il and ils forms)' : bare === 'appeler' ? ' whose l doubles in the je, tu, il and ils forms' : '';
    const steps = [
      `${vb.inf} is reflexive: it needs an extra pronoun that matches the subject (me, te, se, nous, vous, se). For ${s.fr} it is ${REFL[p]}${elides ? `, which becomes ${REFL[p][0]}’ before ${vowelWhy(form)}` : ''}.`,
      `${bare} is a regular -er verb${change}: for ${s.fr} it is ${form}.`,
      `So: ${answer}.`,
    ];
    const explain = `${answer}: ${vb.inf} for ${s.fr}.`;
    if (level === 1) {
      // classic mistakes: the wrong pronoun (je se lève), no pronoun, the wrong ending, the infinitive
      const wrongs = [`${s.fr} ${form}`, `${s.fr} ${refl(p, bare)}`];
      if (p !== 2 && p !== 5) wrongs.push(`${s.fr} ${refl(2, form)}`);
      wrongs.push(...rng.shuffle(vb.pres.filter((f) => f !== form)).map((f) => `${s.fr} ${refl(p, f)}`));
      return choice(`Which is the present tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**?`, answer, wrongs, rng, { explain, steps });
    }
    if (level === 3 && !vb.noEnglish && rng.chance(0.6)) {
      const en = `${s.en} ${englishPresent(vb, p)}`;
      return typed(`How do you say **${en}**${who(s)} in French?`, answer, [refl(p, form)], { explain: `${en} = ${answer}.`, steps });
    }
    return typed(`Write the present tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**.`, answer, [refl(p, form)], { explain, steps });
  },

  // g-perfect-avoir: auxiliary avoir + past participle
  y8frgPerfectAvoir(level, rng) {
    if (level === 1 && rng.chance(0.5)) return participleQ(rng.pick(AVOIR_REG), rng);
    if (level === 3 && rng.chance(0.35)) return participleQ(rng.pick(AVOIR_IRREG), rng);
    const vb = rng.pick(level === 3 ? [...AVOIR_IRREG, ...rng.shuffle(AVOIR_REG).slice(0, 8)] : AVOIR_REG);
    const s = rng.pick(PEOPLE.filter((x) => x.L <= level));
    const sw = s.who ? ` (${s.who})` : '';
    const negative = level === 3 && !NO_NEGATIVE.includes(vb.inf) && rng.chance(0.3);
    const answer = perfectAvoir(vb, s, negative);
    const steps = [
      `${vb.inf} takes avoir in the perfect tense. avoir for ${s.fr}: ${subj(s.fr, AVOIR[s.p])}.`,
      ppStep(vb),
      negative ? `ne… pas goes round the avoir part only: ${answer}.` : `Avoir + past participle: ${answer}. With avoir there is no agreement with the subject.`,
    ];
    const en = negative ? `${s.en} didn’t ${vb.en}` : `${s.en} ${vb.past}`;
    const explain = `${answer} = ${en}.`;
    if (level === 1) {
      const wrongs = [`${subj(s.fr, AVOIR[s.p])} ${vb.inf}`, ...rng.shuffle(AVOIR.filter((f) => f !== AVOIR[s.p])).map((f) => `${subj(s.fr, f)} ${vb.pp}`)];
      // “il est …” with a verb that takes an object can be a real passive, so the être option is only for verbs that cannot
      if (AVOIR_INTRANSITIVE.includes(vb)) wrongs.unshift(`${subj(s.fr, ETRE[s.p])} ${vb.pp}`);
      return choice(`Which is the perfect tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**${sw}?`, answer, wrongs, rng, { explain, steps });
    }
    const accept = perfectAccept(answer, s);
    if (level === 3 && EN_PERFECT.includes(vb.inf) && rng.chance(0.5)) {
      return typed(`How do you say **${en}**${sw} in French? Use the perfect tense.`, answer, accept, { explain, steps });
    }
    return typed(`Write the perfect tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**${sw}${negative ? ', in the negative (ne… pas)' : ''}.`, answer, accept, { explain, steps });
  },

  // g-perfect-etre: être + a past participle that agrees with the subject; reflexive verbs at level 3
  y8frgPerfectEtre(level, rng) {
    const s = rng.pick(PEOPLE.filter((x) => x.L <= level));
    const sw = s.who ? ` (${s.who})` : '';
    if (level === 1 && rng.chance(0.5)) {
      // être or avoir?
      const useEtre = rng.chance(0.5);
      const vb = rng.pick(useEtre ? ETRE_ONLY : AVOIR_INTRANSITIVE);
      const right = useEtre ? perfectEtre(vb, s, false) : perfectAvoir(vb, s, false);
      const wrongs = useEtre
        ? [`${subj(s.fr, AVOIR[s.p])} ${vb.pp}`, `${subj(s.fr, AVOIR[s.p])} ${agree(vb.pp, s.g, s.pl)}`, `${subj(s.fr, ETRE[s.p])} ${vb.inf}`, `${subj(s.fr, AVOIR[s.p])} ${vb.inf}`]
        : [`${subj(s.fr, ETRE[s.p])} ${agree(vb.pp, s.g, s.pl)}`, `${subj(s.fr, ETRE[s.p])} ${vb.pp}`, `${subj(s.fr, AVOIR[s.p])} ${vb.inf}`, `${subj(s.fr, ETRE[s.p])} ${vb.inf}`];
      return choice(`Which is the perfect tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**${sw}?`, right, wrongs, rng, {
        explain: `${vb.inf} takes ${useEtre ? 'être' : 'avoir'}: ${right}.`,
        steps: [
          `Is ${vb.inf} one of the DR MRS VANDERTRAMP verbs? ${useEtre ? 'Yes, so it takes être.' : 'No, so it takes avoir.'}`,
          useEtre ? `With être the past participle agrees with the subject: ${s.fr}${sw} is ${AGREE_WHY(s.g, s.pl)}.` : 'With avoir the past participle does not agree with the subject.',
          `So: ${right}.`,
        ],
      });
    }
    const reflexive = level === 3 && rng.chance(0.4);
    const vb = rng.pick(reflexive ? REFLEXIVE.filter((x) => !x.noPerfect) : level === 1 ? ETRE_ONLY : ETRE_ALL);
    // devenir needs a complement (“became a doctor”) and naître has no simple negative, so they are only drilled as forms
    const formOnly = vb.inf === 'devenir' || vb.inf === 'naître';
    const negative = level === 3 && !formOnly && rng.chance(0.25);
    const answer = perfectEtre(vb, s, negative);
    const pp = agree(vb.pp, s.g, s.pl);
    const aux = reflexive ? refl(s.p, ETRE[s.p]) : ETRE[s.p];
    const steps = [
      reflexive ? `Reflexive verbs always take être in the perfect tense, with the pronoun in front: ${subj(s.fr, aux)}.` : `${vb.inf} is a DR MRS VANDERTRAMP verb, so it takes être: ${subj(s.fr, aux)}.`,
      `The past participle ${vb.pp} agrees with the subject like an adjective: ${s.fr}${sw} is ${AGREE_WHY(s.g, s.pl)} → ${pp}.`,
      negative ? `ne… pas goes round the ${reflexive ? 'pronoun and être' : 'être'} part: ${answer}.` : `So: ${answer}.`,
    ];
    const en = negative ? `${s.en} didn’t ${vb.en}` : `${s.en} ${pastOf(vb, s)}`;
    const explain = `${answer} = ${en}. The past participle (${pp}) agrees with ${s.fr}${sw}.`;
    if (level === 1) {
      const forms = [...new Set([agree(vb.pp, 'm', false), agree(vb.pp, 'f', false), agree(vb.pp, 'm', true), agree(vb.pp, 'f', true)])].filter((x) => x !== pp);
      return choice(`Which is the perfect tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**${sw}?`, answer, [`${subj(s.fr, AVOIR[s.p])} ${vb.pp}`, ...rng.shuffle(forms).map((x) => `${subj(s.fr, aux)} ${x}`)], rng, { explain, steps });
    }
    const accept = perfectAccept(answer, s);
    if (level === 3 && !formOnly && rng.chance(0.5)) return typed(`How do you say **${en}**${sw} in French? Use the perfect tense.`, answer, accept, { explain, steps });
    return typed(`Write the perfect tense of **${vb.inf}** (to ${vb.en}) for **${s.fr}**${sw}${negative ? ', in the negative (ne… pas)' : ''}.`, answer, accept, { explain, steps });
  },

  // g-gender: le, la, l’, les; un, une, des
  y8frgArticle(level, rng) {
    if (level === 1) {
      const n = rng.pick(NOUNS.filter((x) => !x.tricky));
      const right = theFor(n);
      return choice(`Which word for **the** goes with **${n.fr}** (${n.en})?`, right, ['le', 'la', 'l’', 'les'], rng, {
        explain: `${n.fr} is ${GENDER[n.g]}${startsVowel(n.fr) ? `, but it starts with ${vowelWhy(n.fr)}, so le or la shortens to l’` : ''}: ${withThe(n)}.`,
        steps: [`Is ${n.fr} masculine or feminine? It is ${GENDER[n.g]}.`, startsVowel(n.fr) ? `It starts with ${vowelWhy(n.fr)}, so le or la becomes l’.` : 'Masculine → le; feminine → la.', `So: ${withThe(n)}.`],
      });
    }
    if (level === 2) {
      const mode = rng.pick(['a', 'the-pl', 'some-pl']);
      const n = rng.pick(NOUNS.filter((x) => !x.mass));
      if (mode === 'a') {
        const right = n.g === 'm' ? 'un' : 'une';
        return choice(`Which word for **a** goes with **${n.fr}** (${n.en})?`, right, ['un', 'une', 'des'], rng, {
          explain: `${n.fr} is ${GENDER[n.g]}: ${right} ${n.fr}.${n.tricky ? ' Watch this one: its gender is easy to get wrong.' : ''}`,
          steps: [`Is ${n.fr} masculine or feminine? It is ${GENDER[n.g]}.`, 'Masculine → un; feminine → une (never shortened, even before a vowel).', `So: ${right} ${n.fr}.`],
        });
      }
      const right = mode === 'the-pl' ? 'les' : 'des';
      const en = mode === 'the-pl' ? `the ${enPlural(n.en)}` : `some ${enPlural(n.en)}`;
      const wrongs = mode === 'the-pl' ? ['des', n.g === 'm' ? 'le' : 'la', n.g === 'm' ? 'un' : 'une'] : ['les', n.g === 'm' ? 'un' : 'une', n.g === 'm' ? 'du' : 'de la'];
      return choice(`How do you say **${en}**? ___ ${n.plural}`, right, wrongs, rng, {
        explain: `${en} = ${right} ${n.plural}. In the plural, “the” is always les and “some” is always des, whatever the gender.`,
        steps: [`${n.plural} is plural${n.plural.endsWith('x') ? ` (${n.fr} → ${n.plural}: this one takes -x)` : n.plural === n.fr ? ` (${n.fr} does not change in the plural)` : ''}.`, mode === 'the-pl' ? 'Plural “the” = les, for masculine and feminine.' : 'Plural “some” = des, for masculine and feminine.', `So: ${right} ${n.plural}.`],
      });
    }
    const n = rng.pick(rng.chance(0.5) ? NOUNS.filter((x) => x.tricky || x.plural !== `${x.fr}s`) : NOUNS);
    const mode = n.mass ? 'the' : rng.pick(['the', 'a', 'the-pl']);
    const answer = mode === 'the' ? withThe(n) : mode === 'a' ? `${n.g === 'm' ? 'un' : 'une'} ${n.fr}` : `les ${n.plural}`;
    const en = mode === 'the' ? `the ${n.en}` : mode === 'a' ? `${anA(n.en)} ${n.en}` : `the ${enPlural(n.en)}`;
    return typed(`Write in French: **${en}**`, answer, [], {
      explain: `${en} = ${answer} (${n.fr} is ${GENDER[n.g]}${n.plural !== `${n.fr}s` && !n.mass ? `; plural ${n.plural}` : ''}).`,
      steps: [`${n.fr} is ${GENDER[n.g]}${n.tricky ? ': one to remember, as it does not follow the usual pattern' : ''}.`, mode === 'the' ? (startsVowel(n.fr) ? `It starts with ${vowelWhy(n.fr)}, so “the” is l’.` : `“The” = ${theFor(n)}.`) : mode === 'a' ? `“A” = ${n.g === 'm' ? 'un' : 'une'}.` : `Plural “the” = les; the plural of ${n.fr} is ${n.plural}.`, `So: ${answer}.`],
    });
  },

  // g-partitive: du, de la, de l’, des; de after a negative; le/la/les after verbs of liking
  y8frgPartitive(level, rng) {
    const f = rng.pick(FOODS);
    const s = rng.pick(EAT_SUBJ);
    const vb = f.drink ? IRREG.boire : verb('manger');
    const v = subj(s.fr, vb.pres[s.p]);
    const vNeg = subj(s.fr, neg(vb.pres[s.p]));
    const mode = level === 1 ? 'some' : level === 2 ? rng.pick(['some', 'not', 'not']) : rng.pick(['not', 'like', 'type-some', 'type-not']);
    const some = joinArt(partitive(f), f.fr);
    const none = joinArt(deOf(f), f.fr);
    const dont = s.p === 2 ? 'doesn’t' : 'don’t';
    if (mode === 'some') {
      return choice(`Fill the gap: **${cap(v)} ___ ${f.fr}.** (${s.en} ${englishPresent(vb, s.p)} some ${f.en})`, partitive(f), ['du', 'de la', 'de l’', 'des'], rng, {
        explain: `${cap(v)} ${some}. ${f.fr} is ${foodKind(f)}, so “some” is ${partitive(f)}.`,
        steps: ['“Some” depends on the noun: du (masculine), de la (feminine), de l’ (before a vowel), des (plural).', `${f.fr} is ${foodKind(f)}.`, `So: ${cap(v)} ${some}.`],
      });
    }
    if (mode === 'not') {
      const wrongs = [startsVowel(f.fr) ? 'de' : 'd’', partitive(f), 'du', 'de la', 'des'];
      return choice(`Fill the gap: **${cap(vNeg)} pas ___ ${f.fr}.** (${s.en} ${dont} ${vb.en} ${f.en})`, deOf(f), rng.shuffle(wrongs.slice(1)).concat(wrongs[0]), rng, {
        explain: `${cap(vNeg)} pas ${none}. After a negative, du, de la, de l’ and des all become de (d’ before a vowel).`,
        steps: [`Positive: ${cap(v)} ${some}.`, 'After ne… pas, “some” or “any” shrinks to de (d’ before a vowel).', `So: ${cap(vNeg)} pas ${none}.`],
      });
    }
    if (mode === 'like') {
      const lv = verb(rng.pick(['aimer', 'détester', 'adorer', 'préférer']));
      const lverb = subj(s.fr, lv.pres[s.p]);
      const right = definite(f);
      const wrongs = [partitive(f), ...(f.pl ? ['le', 'la'] : ['les', partitive(f) === 'du' ? 'de la' : 'du']), 'de'];
      return choice(`Fill the gap: **${cap(lverb)} ___ ${f.fr}.** (${s.en} ${englishPresent(lv, s.p)} ${f.en})`, right, wrongs, rng, {
        explain: `${cap(lverb)} ${joinArt(right, f.fr)}. After verbs of liking and disliking, French uses le, la, l’ or les (${f.en} in general), not du or de la.`,
        steps: ['Is it “some” (I am eating some) or the food in general (I like it)?', `After aimer, adorer, détester and préférer it is in general, so use the word for “the”: ${right}.`, `So: ${cap(lverb)} ${joinArt(right, f.fr)}.`],
      });
    }
    const negative = mode === 'type-not';
    const answer = negative ? `${vNeg} pas ${none}` : `${v} ${some}`;
    const en = negative ? `${s.en} ${dont} ${vb.en} ${f.en}` : `${s.en} ${englishPresent(vb, s.p)} some ${f.en}`;
    return typed(`Write in French: **${en}**${who(s)}`, answer, [], {
      explain: `${en} = ${answer}.`,
      steps: [`${vb.inf} for ${s.fr}: ${v}.`, negative ? 'After ne… pas, “any” is de (d’ before a vowel).' : `“Some” before ${f.fr} (${foodKind(f)}) is ${partitive(f)}.`, `So: ${answer}.`],
    });
  },

  // g-adjectives: agreement, and position (BAGS adjectives before the noun)
  y8frgAdjective(level, rng) {
    if (level === 1 || (level === 2 && rng.chance(0.5))) {
      const person = rng.pick(DESCRIBED);
      const k = rng.pick(Object.keys(PADJ).filter((x) => level === 2 || new Set(PADJ[x].forms).size >= 3));
      const a = PADJ[k];
      const right = a.forms[slot(person.g, person.pl)];
      const be = person.pl ? 'sont' : 'est';
      const sentence = `${cap(person.fr)} ${be} ${right}.`;
      const steps = [`Who is it? ${person.fr} (${person.en}): ${KIND(person.g, person.pl)}.`, `The adjective agrees with them. ${k}: ${a.forms.join(', ')} (masculine, feminine, masculine plural, feminine plural).`, `So: ${sentence}`];
      const explain = `${sentence} ${cap(person.fr)} is ${KIND(person.g, person.pl)}, so ${k} becomes ${right}.`;
      if (level === 1) return choice(`Choose the right form of **${k}** (${a.en}): **${cap(person.fr)} ${be} ___.**`, right, [...new Set(a.forms)], rng, { explain, steps });
      return typed(`Make **${k}** (${a.en}) agree: **${cap(person.fr)} ${be} ___.**`, right, [`${person.fr} ${be} ${right}`], { explain, steps });
    }
    const t = rng.pick(THINGS);
    const pl = rng.chance(0.35);
    const noun = pl ? t.plural : t.fr;
    const art = pl ? 'les' : t.g === 'm' ? 'un' : 'une';
    const enNoun = pl ? enPlural(t.en) : t.en;
    // level 3: half the time, two adjectives (one before the noun, one after)
    const before = t.adjs.filter((x) => ADJ[x].before), after = t.adjs.filter((x) => !ADJ[x].before);
    if (level === 3 && before.length && after.length && rng.chance(0.5)) {
      const b = ADJ[rng.pick(before)], c = ADJ[rng.pick(after)];
      const bf = b.forms[slot(t.g, pl)], cf = c.forms[slot(t.g, pl)];
      const right = `${art} ${bf} ${noun} ${cf}`;
      const en = pl ? `the ${b.en} ${c.en} ${enNoun}` : `${anA(b.en)} ${b.en} ${c.en} ${enNoun}`;
      const wrongs = [`${art} ${noun} ${bf} ${cf}`, `${art} ${bf} ${cf} ${noun}`, `${art} ${b.forms[0]} ${noun} ${c.forms[0]}`, `${art} ${cf} ${noun} ${bf}`];
      return choice(`How do you say **${en}**?`, right, wrongs, rng, {
        explain: `${en} = ${right}: ${bf} is a BAGS adjective (before the noun), ${cf} goes after it (as colours and most adjectives do), and both agree with ${noun}.`,
        steps: [`${t.fr} is ${GENDER[t.g]}${pl ? ', and here it is plural' : ''}: both adjectives agree (${bf}, ${cf}).`, 'BAGS adjectives (beauty, age, goodness, size) go before the noun; colours and most others go after it.', `So: ${right}.`],
      });
    }
    const k = rng.pick(t.adjs);
    const a = ADJ[k];
    const adj = a.forms[slot(t.g, pl)];
    const phrase = a.before ? `${art} ${adj} ${noun}` : `${art} ${noun} ${adj}`;
    const en = pl ? `the ${a.en} ${enNoun}` : `${anA(a.en)} ${a.en} ${enNoun}`;
    const steps = [
      `${t.fr} is ${GENDER[t.g]}${pl ? ', and here it is plural' : ''}, so ${k} becomes ${adj}${new Set(a.forms).size === 1 ? ` (${k} never changes)` : ''}.`,
      a.before ? `${k} is a BAGS adjective (beauty, age, goodness, size), so it goes before the noun.` : 'Most adjectives, including colours, go after the noun.',
      `So: ${phrase}.`,
    ];
    if (level === 2) {
      const wrongs = [...new Set(a.forms)].filter((x) => x !== adj).map((x) => (a.before ? `${art} ${x} ${noun}` : `${art} ${noun} ${x}`));
      // the wrong position, except for adjectives that can follow the noun with another meaning (un homme grand, le vin nouveau)
      if (!['grand', 'nouveau', 'vieux'].includes(k)) wrongs.unshift(a.before ? `${art} ${noun} ${adj}` : `${art} ${adj} ${noun}`);
      return choice(`How do you say **${en}**?`, phrase, wrongs, rng, { explain: `${en} = ${phrase}.`, steps });
    }
    return typed(`Write in French: **${en}**`, phrase, [], { explain: `${en} = ${phrase}.`, steps });
  },

  // g-possessives: mon/ma/mes … leur/leurs
  y8frgPossessive(level, rng) {
    const key = rng.pick(level === 1 ? ['my', 'your1', 'my', 'our', 'your2'] : level === 2 ? ['his', 'her', 'his', 'her', 'their', 'your1', 'our'] : Object.keys(POSS));
    const owner = POSS[key];
    const n = rng.pick(OWNED);
    const form = possForm(key, n);
    const answer = `${form} ${n.fr}`;
    const en = `${owner.en} ${n.en}`;
    const note = owner.note ? ` (${owner.note})` : '';
    const steps = [
      `${n.fr} is ${n.pl ? 'plural' : GENDER[n.g]}${!n.pl && n.g === 'f' && startsVowel(n.fr) ? ` and starts with ${vowelWhy(n.fr)}` : ''}.`,
      `“${cap(owner.en)}” is ${[...new Set(owner.forms)].join(', ')}${owner.forms[0] === owner.forms[1] ? ' (singular, plural)' : ' (masculine, feminine, plural)'}. ${n.fr} is ${possWhy(key, n)}, so ${form}.`,
      key === 'his' || key === 'her' ? `son, sa and ses agree with the thing owned, not the owner, so ${answer} can mean his or her ${n.en}.` : `So: ${answer}.`,
    ];
    const explain = `${en} = ${answer}.`;
    if (level === 1) return choice(`How do you say **${en}**${note}? ___ ${n.fr}`, form, owner.forms, rng, { explain, steps });
    if (level === 2) {
      const wrongs = [...new Set(owner.forms)].filter((f) => f !== form).map((f) => `${f} ${n.fr}`);
      wrongs.push(`${key === 'their' ? possForm('his', n) : possForm('their', n)} ${n.fr}`);
      return choice(`How do you say **${en}**${note}?`, answer, wrongs, rng, { explain, steps });
    }
    return typed(`Write in French: **${en}**${note}`, answer, [], { explain, steps });
  },

  // g-prepositions: à, au, à la, à l’, aux, en
  y8frgPlace(level, rng) {
    const kinds = level === 1 ? ['town'] : level === 2 ? ['country', 'country', 'city'] : ['country', 'country', 'city', 'town'];
    const pl = rng.pick(PLACES.filter((x) => x.kind === rng.pick(kinds)));
    const steps = [
      pl.kind === 'town' ? 'To or at a place in town: à + the word for “the” (à + le = au, à + les = aux).' : pl.kind === 'city' ? 'Towns and cities: à, for both “to” and “in”.' : 'Countries: en (feminine), au (masculine), aux (plural), for both “to” and “in”.',
      `${pl.why}.`,
      `So: ${pl.phrase}.`,
    ];
    const explain = `${pl.phrase}: ${pl.why}.`;
    if (level < 3) {
      const sentence = pl.kind === 'town' ? rng.pick(['Je vais', 'Nous allons', 'Elle va']) : rng.pick(['J’habite', 'Je vais', 'Nous allons']);
      return choice(`Fill the gap: **${sentence} ___ ${pl.name}.** (${pl.en})`, pl.prep, PREP_OPTIONS[pl.kind], rng, { explain, steps });
    }
    const to = rng.pick(['to', 'in']);
    const enPlace = pl.kind === 'town' && to === 'in' ? `at ${pl.en}` : `${to} ${pl.en}`;
    return typed(`Write in French: **${enPlace}**`, pl.phrase, [], { explain: `${enPlace} = ${pl.phrase}. French uses the same word for “to” and “in”${pl.kind === 'town' ? ' (and “at”)' : ''}.`, steps });
  },

  // g-negatives: ne… pas, ne… jamais, ne… plus
  y8frgNegative(level, rng) {
    const perfect = level === 3 && rng.chance(0.4);
    const [pos, pattern, allowed] = perfect ? [...rng.pick(NEG_PERFECT), 'pj'] : rng.pick(NEG_SENTENCES);
    const which = level === 1 ? 'p' : rng.pick(allowed.split(''));
    const [w, en] = NEG_WORDS[which];
    const answer = pattern.replace('X', w);
    const partChange = /\b(du|de la|des|un|une) /.test(pos) && / (de|d’)/.test(answer.replace(/^\S+ (ne|n’)/, ''));
    const steps = [
      perfect ? `In the perfect tense, ne… ${w} goes round the auxiliary (avoir or être${/s’|me |te /.test(pos) ? ', with its pronoun' : ''}); the past participle comes after.` : `ne… ${w} (${en}) goes round the verb like a sandwich: ne before it, ${w} after it.`,
      partChange ? 'After a negative, un, une, du, de la and des become de (d’ before a vowel).' : /n’/.test(answer) ? 'ne becomes n’ before a vowel or a silent h.' : 'Everything else stays as it was.',
      `So: ${answer}`,
    ];
    const explain = `“${pos}” → ${answer}`;
    if (level === 1) return choice(`Make this negative with **ne… pas**: **${pos}**`, answer, negativeWrongs(pos, pattern), rng, { explain, steps, hear: pos });
    return typed(`Make this negative with **ne… ${w}** (${en}): **${pos}**`, answer, [], { explain, steps, hear: pos });
  },
};

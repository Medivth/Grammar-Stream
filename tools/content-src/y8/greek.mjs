// Year 8 Ancient Greek, a beginner course aimed towards GCSE (Attic Greek, polytonic, with
// accents and breathings as in school courses). The alphabet in stages, core vocabulary from the
// GCSE defined list, the article, 1st and 2nd declension nouns, the present, imperfect and future,
// εἰμί, adjectives, prepositions, particles, derivatives, culture, and three adapted myths.
// Greek answers are always chosen (she cannot easily type Greek); English answers can be typed.
// Theme: Greek myth, with the classical heroes and gods (no characters from modern novels).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `greek.${id}`, topic: `greek.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `greek.${id}`, topic: `greek.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `greek.${id}`, topic: `greek.${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
const tmpl = (topic, gen) => ({ id: `greek.${topic}.tmpl`, topic: `greek.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed: [-1, 0, 1] });
const C = { formats: ['choice'] };

// --- the alphabet: [lower, upper, name, sound, transliteration, accepted spellings of the name]
const ALPHA_1 = [
  ['α', 'Α', 'alpha', '“a”, as in “cat” (or longer, as in “father”)', 'a', []],
  ['β', 'Β', 'beta', '“b”, as in “bat”', 'b', []],
  ['γ', 'Γ', 'gamma', 'a hard “g”, as in “go”', 'g', []],
  ['δ', 'Δ', 'delta', '“d”, as in “dog”', 'd', []],
  ['ε', 'Ε', 'epsilon', 'a short “e”, as in “pet”', 'e', []],
  ['ζ', 'Ζ', 'zeta', '“zd” or “dz”, as in “adze”', 'z', []],
  ['η', 'Η', 'eta', 'a long “e”, like the “ai” in “fair”', 'e (or ē)', []],
  ['θ', 'Θ', 'theta', '“th”, as in “thin”', 'th', []],
  ['ι', 'Ι', 'iota', '“i”, as in “pit” or “machine”', 'i', []],
  ['κ', 'Κ', 'kappa', '“k”, as in “king”', 'k (or c)', []],
  ['λ', 'Λ', 'lambda', '“l”, as in “lion”', 'l', ['lamda', 'labda']],
  ['μ', 'Μ', 'mu', '“m”, as in “mother”', 'm', ['mew']],
];
const ALPHA_2 = [
  ['ν', 'Ν', 'nu', '“n”, as in “net”', 'n', ['new']],
  ['ξ', 'Ξ', 'xi', '“x”, as in “box” (ks)', 'x', ['ksi']],
  ['ο', 'Ο', 'omicron', 'a short “o”, as in “pot”', 'o', ['omikron']],
  ['π', 'Π', 'pi', '“p”, as in “pen”', 'p', []],
  ['ρ', 'Ρ', 'rho', '“r”, slightly rolled', 'r', []],
  ['σ', 'Σ', 'sigma', '“s”, as in “sun” (written ς at the end of a word)', 's', []],
  ['τ', 'Τ', 'tau', '“t”, as in “top”', 't', []],
  ['υ', 'Υ', 'upsilon', 'like French “u” in “tu”', 'u (or y)', ['ypsilon']],
  ['φ', 'Φ', 'phi', '“ph”: “p” with a puff of air (today usually said “f”)', 'ph', []],
  ['χ', 'Χ', 'chi', '“ch”, as in “loch”', 'ch (or kh)', ['khi']],
  ['ψ', 'Ψ', 'psi', '“ps”, as in “lapse”', 'ps', []],
  ['ω', 'Ω', 'omega', 'a long “o”, as in “saw”', 'o (or ō)', []],
];

// --- vocabulary, from the GCSE defined vocabulary: [greek (dictionary form), english, derivative, accepted English]
const WORDS_1 = [
  ['ἄνθρωπος', 'man, person', 'anthropology, philanthropist', ['man', 'person', 'human', 'human being', 'mankind']],
  ['θεός', 'god', 'theology, atheist', ['a god', 'deity']],
  ['λόγος', 'word', 'logic, and every “-ology” (the study of)', ['speech', 'story', 'reason', 'account']],
  ['ἵππος', 'horse', 'hippodrome, hippopotamus (“river horse”)', []],
  ['δοῦλος', 'slave', 'no common English word', ['servant']],
  ['οἶκος', 'house, home', 'economy (managing a household), ecology', ['house', 'home', 'household']],
  ['ποταμός', 'river', 'hippopotamus, Mesopotamia (“between the rivers”)', ['stream']],
  ['φίλος', 'friend', 'philosophy (love of wisdom), Philadelphia', ['dear', 'loved one']],
  ['ἀδελφός', 'brother', 'Philadelphia (“brotherly love”)', []],
  ['ἥλιος', 'sun', 'helium (first found in the Sun’s light), heliocentric', []],
  ['νόμος', 'law, custom', 'astronomy (the laws of the stars), autonomy', ['law', 'custom', 'rule']],
  ['πόλεμος', 'war', 'polemic (a fierce written attack)', ['battle', 'fighting']],
  ['στρατηγός', 'general', 'strategy, strategic', ['commander', 'leader']],
  ['χρόνος', 'time', 'chronology, chronic, synchronise', []],
];
const WORDS_2 = [
  ['κόρη', 'girl', 'Kore (“the Maiden”) was a name for Persephone', ['maiden', 'daughter']],
  ['ψυχή', 'soul', 'psychology, psychic', ['spirit', 'life', 'mind']],
  ['τιμή', 'honour', 'timocracy (rule by the honoured, in Plato)', ['respect', 'value', 'price']],
  ['φωνή', 'voice', 'telephone, phonics, symphony', ['sound']],
  ['μάχη', 'battle', 'logomachy (a battle of words)', ['fight']],
  ['νίκη', 'victory', 'Nike, the winged goddess of victory', ['win']],
  ['ἀγορά', 'market place', 'agoraphobia (fear of open spaces)', ['agora', 'marketplace', 'market', 'market-place', 'meeting place']],
  ['ἡμέρα', 'day', 'ephemeral (lasting only a day)', []],
  ['οἰκία', 'house', 'related to οἶκος: economy, ecology', ['home']],
  ['χώρα', 'land', 'chorography (describing regions)', ['land', 'country', 'territory', 'region']],
  ['θεά', 'goddess', 'related to θεός: theology', []],
  ['δῶρον', 'gift', 'Theodore and Dorothy both mean “gift of god”', ['present']],
  ['ἔργον', 'work, deed', 'energy, ergonomics', ['work', 'deed', 'task', 'job', 'action']],
  ['δένδρον', 'tree', 'rhododendron (“rose tree”), dendrochronology', []],
];
const WORDS_3 = [
  ['λύω', 'I free', 'analysis (loosening up), paralysis', ['free', 'release', 'I release', 'loosen', 'I loosen', 'set free', 'I set free', 'untie', 'I untie']],
  ['ἄγω', 'I lead', 'pedagogue (a child-leader), demagogue', ['lead', 'bring', 'I bring', 'take', 'I take']],
  ['ἀκούω', 'I hear', 'acoustic', ['hear', 'listen', 'I listen', 'I listen to', 'listen to']],
  ['γράφω', 'I write', 'graphic, autograph, photograph', ['write', 'draw', 'I draw']],
  ['διώκω', 'I chase', 'no common English word', ['chase', 'pursue', 'I pursue', 'hunt', 'I hunt']],
  ['ἐθέλω', 'I wish', 'no common English word', ['wish', 'want', 'I want', 'I am willing', 'am willing', 'be willing']],
  ['ἔχω', 'I have', 'hectic (from ἑκτικός, “habitual”, first used of a lingering fever)', ['have', 'hold', 'I hold']],
  ['λέγω', 'I say', 'related to λόγος: dialogue, lexicon', ['say', 'speak', 'I speak', 'tell', 'I tell']],
  ['μένω', 'I stay', 'no common English word', ['stay', 'remain', 'I remain', 'wait', 'I wait', 'wait for', 'I wait for']],
  ['πέμπω', 'I send', 'pomp (from πομπή, a procession “sent” on its way)', ['send']],
  ['φέρω', 'I carry', 'Christopher (“Christ-carrier”), metaphor (carrying across)', ['carry', 'bring', 'I bring', 'bear', 'I bear']],
  ['φεύγω', 'I flee', 'no direct English word (Latin fugio, as in “fugitive”, is a cousin)', ['flee', 'run away', 'I run away', 'escape', 'I escape']],
  ['παιδεύω', 'I teach', 'pedagogy, encyclopaedia (all-round education)', ['teach', 'educate', 'I educate', 'train', 'I train']],
  ['πιστεύω', 'I trust', 'no common English word', ['trust', 'believe', 'I believe', 'I trust in', 'believe in']],
];
// adjectives: [masculine, feminine, neuter, english, derivative, accepted]
const ADJ = [
  ['καλός', 'καλή', 'καλόν', 'beautiful', 'kaleidoscope (“seeing beautiful shapes”), calligraphy', ['fine', 'good', 'noble', 'handsome']],
  ['κακός', 'κακή', 'κακόν', 'bad', 'cacophony (a bad sound)', ['evil', 'cowardly', 'wicked']],
  ['ἀγαθός', 'ἀγαθή', 'ἀγαθόν', 'good', 'Agatha (“good woman”)', ['brave', 'noble']],
  ['σοφός', 'σοφή', 'σοφόν', 'wise', 'philosophy, sophisticated', ['clever', 'skilled']],
  ['μικρός', 'μικρά', 'μικρόν', 'small', 'microscope, microchip', ['little']],
  ['δεινός', 'δεινή', 'δεινόν', 'terrible', 'dinosaur (“terrible lizard”)', ['dreadful', 'clever', 'skilful', 'strange', 'awful']],
  ['ἀνδρεῖος', 'ἀνδρεία', 'ἀνδρεῖον', 'brave', 'Andrew (“manly”)', ['courageous', 'manly']],
  ['δίκαιος', 'δικαία', 'δίκαιον', 'just', 'no common English word', ['fair', 'right', 'honest']],
  ['χαλεπός', 'χαλεπή', 'χαλεπόν', 'difficult', 'no common English word', ['hard', 'dangerous', 'harsh']],
  ['νέος', 'νέα', 'νέον', 'new', 'neon (the “new” gas), neolithic', ['young']],
];

const PASS_THESEUS = {
  passage: 'ὁ Θησεὺς καὶ ὁ Μινώταυρος\n\nἐν τῇ Κρήτῃ ὁ Μίνως βασιλεύει. ἐν δὲ τῷ λαβυρίνθῳ μένει ὁ Μινώταυρος· δεινὸς γάρ ἐστιν. οἱ Ἀθηναῖοι ἑπτὰ νεανίας καὶ ἑπτὰ κόρας εἰς τὴν Κρήτην πέμπουσιν. ὁ δὲ Θησεὺς ἀνδρεῖός ἐστιν· ἐθέλει οὖν τοὺς φίλους λύειν.\n\nἡ Ἀριάδνη, ἡ τοῦ βασιλέως θυγάτηρ, τὸν Θησέα φιλεῖ καὶ λίνον αὐτῷ δίδωσιν. ὁ Θησεὺς εἰς τὸν λαβύρινθον βαίνει καὶ τὸν Μινώταυρον ἀποκτείνει. ἔπειτα τῷ λίνῳ τὴν ὁδὸν εὑρίσκει καὶ ἐκ τοῦ λαβυρίνθου φεύγει. οἱ οὖν Ἀθηναῖοι μάλα χαίρουσιν.\n\nGlossary: βασιλεύει = is king; λαβύρινθος = labyrinth, maze; νεανίας (accusative plural νεανίας) = young man; θυγάτηρ = daughter; φιλεῖ = loves; λίνον = thread; αὐτῷ = to him; δίδωσιν = gives; βαίνει = goes; ἀποκτείνει = kills; ἔπειτα = then; ὁδός (accusative ὁδόν) = way, road; εὑρίσκει = finds; μάλα = very much; χαίρουσιν = rejoice.',
  passageSource: 'Adapted for this app from the myth of Theseus',
};
const PASS_CYCLOPS = {
  passage: 'ὁ Ὀδυσσεὺς καὶ ὁ Κύκλωψ\n\nὁ Ὀδυσσεὺς καὶ οἱ φίλοι ἐκ τῆς Τροίας οἴκαδε πλέουσιν. ἐν νήσῳ ἄντρον εὑρίσκουσιν. ἐν δὲ τῷ ἄντρῳ μένει ὁ Πολύφημος, Κύκλωψ δεινὸς καὶ μέγιστος. ὁ Κύκλωψ τοὺς φίλους ἐσθίει.\n\nὁ δὲ Ὀδυσσεὺς σοφός ἐστιν. τῷ Κύκλωπι οἶνον δίδωσι καὶ λέγει· «Οὖτις ὄνομά μοί ἐστιν.» ὁ Κύκλωψ τὸν οἶνον πίνει καὶ καθεύδει. ἔπειτα ὁ Ὀδυσσεὺς καὶ οἱ φίλοι τὸν Κύκλωπα τυφλοῦσιν.\n\nὁ Πολύφημος βοᾷ· «Οὖτίς με ἀποκτείνει.» οἱ οὖν ἄλλοι Κύκλωπες οὐ βοηθοῦσιν. ὁ δὲ Ὀδυσσεὺς καὶ οἱ φίλοι ὑπὸ τοῖς προβάτοις ἐκ τοῦ ἄντρου φεύγουσιν.\n\nGlossary: Τροία = Troy; οἴκαδε = homewards; πλέουσιν = sail; νῆσος (dative νήσῳ) = island; ἄντρον = cave; μέγιστος = very big; ἐσθίει = eats; Κύκλωψ (accusative Κύκλωπα, dative Κύκλωπι) = Cyclops; οἶνος = wine; Οὖτις = Nobody; ὄνομα = name; μοι = to me (“my name is”); πίνει = drinks; καθεύδει = sleeps; τυφλοῦσιν = blind; βοᾷ = shouts; με = me; ἀποκτείνει = is killing; ἄλλοι = other; βοηθοῦσιν = help; πρόβατα (dative προβάτοις) = sheep.',
  passageSource: 'Adapted for this app from Homer, Odyssey book 9',
};
const PASS_PERSEUS = {
  passage: 'ὁ Περσεὺς καὶ ἡ Μέδουσα\n\nἡ Μέδουσα Γοργώ ἐστιν· οἱ ἄνθρωποι, εἰ αὐτὴν βλέπουσιν, λίθοι γίγνονται. ὁ δὲ Περσεὺς τὴν Μέδουσαν ἀποκτείνειν ἐθέλει.\n\nἡ Ἀθηνᾶ τῷ Περσεῖ ἀσπίδα λαμπρὰν δίδωσιν, ὁ δὲ Ἑρμῆς πτερωτὰ πέδιλα. ὁ Περσεὺς οὐ βλέπει τὴν Μέδουσαν, ἀλλὰ τὴν εἰκόνα ἐν τῇ ἀσπίδι. οὕτω τὴν κεφαλὴν ἀποτέμνει καὶ ἐκ τῆς χώρας φεύγει.\n\nGlossary: Γοργώ = a Gorgon; εἰ = if; αὐτήν = her; βλέπουσιν = look at; λίθοι = stones; γίγνονται = become; ἀποκτείνειν = to kill; ἀσπίς (accusative ἀσπίδα, dative ἀσπίδι) = shield; λαμπρός = bright, shining; πτερωτὰ πέδιλα = winged sandals; εἰκών (accusative εἰκόνα) = image, reflection; οὕτω = in this way; κεφαλή = head; ἀποτέμνει = cuts off.',
  passageSource: 'Adapted for this app from the myth of Perseus',
};

const topics = [
  { id: 'greek.alphabet-1', title: 'The alphabet, part 1: α to μ', kind: 'facts', prereqs: [], batch: 6, intro: 'Ancient Greek uses its own alphabet: 24 letters, many of which you already know from maths and science (π, θ, Δ). Our word “alphabet” is just its first two letters, alpha and beta. Learn twelve now: say each name aloud.', teach: 'Write your initials in Greek letters and explain which letters you used.', talk: 'Ask {her} to read the Greek letters in a maths or science textbook.' },
  { id: 'greek.alphabet-2', title: 'The alphabet, part 2: ν to ω', kind: 'facts', prereqs: ['greek.alphabet-1'], batch: 6, intro: 'The second twelve letters, ending with omega, “big o”. Watch for false friends: ρ is r, ν is n, η is e, χ is ch and ω is o. They look like our letters but they are not.', teach: 'Explain which Greek letters look like English ones but make a different sound.', talk: 'Ask {her} to write your name in Greek letters.' },
  { id: 'greek.reading', title: 'Reading Greek aloud: breathings, diphthongs, accents', kind: 'mixed', prereqs: ['greek.alphabet-2'], batch: 6, intro: 'Now put the letters together. Every word that starts with a vowel has a breathing: the rough one (ʽ) adds an h, the smooth one (ʼ) adds nothing. Pairs of vowels (diphthongs) make one sound, and the accents show which syllable to stress.', teach: 'Explain what a rough breathing is, using ἵππος as an example.', talk: 'Ask {her} to read the names of the Olympian gods aloud in Greek.' },
  { id: 'greek.words-1', title: 'Words 1: people, gods and war', kind: 'facts', prereqs: ['greek.reading'], batch: 6, intro: 'Fourteen nouns, all from the GCSE vocabulary list, and all masculine words ending -ος. Most have English relatives: knowing λόγος unlocks every “-ology”.', teach: 'Teach three words and an English word that comes from each.', talk: 'Play “spot the Greek”: ask {her} to find a Greek root in a science or maths word.' },
  { id: 'greek.words-2', title: 'Words 2: girls, gifts, battles and days', kind: 'facts', prereqs: ['greek.words-1'], batch: 6, intro: 'Fourteen more nouns: feminine words ending -η or -α, and neuter words ending -ον. Nike, the goddess of victory, is hiding in this set.', teach: 'Explain how you can often tell a noun’s gender from its ending.', talk: 'Ask {her} what the brand name Nike means in Greek.' },
  { id: 'greek.words-3', title: 'Words 3: verbs', kind: 'facts', prereqs: ['greek.words-1'], batch: 6, intro: 'Fourteen verbs. Greek dictionaries list verbs in the “I” form, so λύω means “I free”. The endings change to show who is doing it.', teach: 'Teach five verbs and act each one out.', talk: 'Ask {her} the Greek for “I write” and “I flee”.' },
  { id: 'greek.article', title: 'The article: ὁ, ἡ, τό', kind: 'mixed', prereqs: ['greek.words-2'], batch: 5, intro: 'Greek has a word for “the” (the article), but none for “a”. The article changes to match its noun in gender, case and number, so it is a great clue to what a noun is doing in the sentence.', teach: 'Recite the singular article in all three genders.', talk: 'Ask {her} to chant the article table: ὁ, τόν, τοῦ, τῷ…' },
  { id: 'greek.nouns-2', title: 'Nouns: the second declension (λόγος, δῶρον)', kind: 'mixed', prereqs: ['greek.article'], batch: 5, intro: 'In Greek the ending of a noun tells you its job. Nominative: the subject. Accusative: the object. Genitive: “of”. Dative: “to” or “for”. λόγος, λόγον, λόγου, λόγῳ…', teach: 'Explain the four cases using ὁ ἵππος as the example.', talk: 'Ask {her} which case the words for “of the god” would be in.' },
  { id: 'greek.nouns-1', title: 'Nouns: the first declension (τιμή, χώρα)', kind: 'mixed', prereqs: ['greek.nouns-2'], batch: 5, intro: 'Feminine nouns ending -η or -α. The same four cases, different endings: τιμή, τιμήν, τιμῆς, τιμῇ. Words ending -α after ε, ι or ρ keep the α all the way through the singular.', teach: 'Explain the difference between the τιμή and χώρα patterns.', talk: 'Ask {her} to decline “the voice” (ἡ φωνή) in the singular.' },
  { id: 'greek.verbs-1', title: 'Verbs: the present tense and εἰμί', kind: 'mixed', prereqs: ['greek.words-3'], batch: 5, intro: 'The ending of a verb tells you who is doing it: λύω (I free), λύεις (you free), λύει (he/she frees), λύομεν, λύετε, λύουσι(ν). “To be” is irregular, as in English: εἰμί, εἶ, ἐστί(ν)…', teach: 'Chant the present tense of λύω and explain each ending.', talk: 'Ask {her} the Greek for “we are” and “they are”.' },
  { id: 'greek.sentences', title: 'Reading sentences', kind: 'facts', prereqs: ['greek.nouns-2', 'greek.verbs-1'], batch: 5, intro: 'Now read whole sentences. Find the verb first, then the nominative (who does it), then the accusative (to whom). Greek word order is flexible: the endings carry the meaning.', teach: 'Translate a sentence and explain how you found the subject.', talk: 'Ask {her} to translate a Greek sentence aloud for you.' },
  { id: 'greek.prepositions', title: 'Prepositions and their cases', kind: 'facts', prereqs: ['greek.sentences'], batch: 5, intro: 'Prepositions (in, into, out of, from, towards…) each take a particular case. ἐν takes the dative, εἰς the accusative, ἐκ the genitive. Some change meaning with the case.', teach: 'Explain the difference between ἐν τῷ οἴκῳ and εἰς τὸν οἶκον.', talk: 'Ask {her}: which case follows ἐκ, and what does it mean?' },
  { id: 'greek.adjectives', title: 'Adjectives', kind: 'facts', prereqs: ['greek.nouns-1'], batch: 5, intro: 'Adjectives agree with their nouns: καλός, καλή, καλόν. The position of the article matters too: ὁ καλὸς ἵππος is “the beautiful horse”, but ὁ ἵππος καλός is “the horse is beautiful”.', teach: 'Explain the difference between ὁ σοφὸς στρατηγός and ὁ στρατηγὸς σοφός.', talk: 'Ask {her} which English words come from καλός and μικρός.' },
  { id: 'greek.tenses', title: 'The past and the future: imperfect and future tenses', kind: 'mixed', prereqs: ['greek.verbs-1'], batch: 5, intro: 'The imperfect (“I was freeing”) adds an augment, ἐ-, to the front: ἔλυον. The future (“I will free”) adds a σ before the ending: λύσω. Spot the clue, then read the ending for the person.', teach: 'Explain how to tell ἔλυον from λύσω at a glance.', talk: 'Ask {her} what the augment is.' },
  { id: 'greek.particles', title: 'Little words that matter: particles and word order', kind: 'facts', prereqs: ['greek.sentences'], batch: 5, intro: 'Greek loves small connecting words: καί, ἀλλά, γάρ, οὖν, μέν… δέ. Some can never come first in a sentence. Spotting them shows how the ideas link.', teach: 'Explain what μέν… δέ does in a sentence.', talk: 'Ask {her} to find γάρ in the Theseus story and translate the sentence.' },
  { id: 'greek.roots', title: 'Greek inside English', kind: 'facts', prereqs: ['greek.words-2'], links: ['english', 'science'], batch: 6, intro: 'Science, medicine and technology speak Greek: telephone, biology, democracy, dinosaur. Knowing the roots lets you work out words you have never seen before.', teach: 'Take a long scientific word and break it into its Greek parts.', talk: 'Pick a word from the news and ask {her} whether it has Greek inside it.' },
  { id: 'greek.culture', title: 'Gods, games, theatre and Homer', kind: 'facts', prereqs: ['greek.alphabet-1'], links: ['history'], batch: 6, intro: 'The language comes with a world: twelve Olympian gods, the first Olympic Games, theatres seating thousands, and Homer’s two great poems, the Iliad and the Odyssey.', teach: 'Explain the difference between the Iliad and the Odyssey.', talk: 'Ask {her} which Olympian god {she} would most like to meet, and why.' },
  { id: 'greek.myth-1', title: 'Story: Theseus and the Minotaur', kind: 'reading', prereqs: ['greek.sentences', 'greek.prepositions'], batch: 6, intro: 'A whole story in Greek, using words you know plus a glossary. Read it twice, aloud if you can. Theseus, prince of Athens, goes into the labyrinth.', teach: 'Retell the story in English, then translate your favourite sentence.', talk: 'Ask {her} to read a sentence of the story aloud in Greek and translate it.' },
  { id: 'greek.myth-2', title: 'Stories: Odysseus and the Cyclops, Perseus and Medusa', kind: 'reading', prereqs: ['greek.myth-1', 'greek.particles'], batch: 6, intro: 'Two more adapted myths: Odysseus tricks the Cyclops with a famous pun, and Perseus faces Medusa with help from two gods.', teach: 'Explain the joke in Odysseus’ false name.', talk: 'Ask {her} why the other Cyclopes did not come to help.' },
  // stretch
  { id: 'greek.aorist', title: 'The aorist: “I freed”', kind: 'facts', prereqs: ['greek.tenses'], batch: 5, intro: 'The aorist is the most common past tense in stories: a single completed action. The weak aorist adds an augment and -σα: ἔλυσα, “I freed”. Some common verbs have strong aorists you just learn: ἔφυγον, “I fled”.', teach: 'Explain the difference between ἔλυον and ἔλυσα.', talk: 'Ask {her} the aorist of λύω and what it means.' },
  { id: 'greek.third-decl', title: 'The third declension: first steps', kind: 'facts', prereqs: ['greek.nouns-1'], batch: 5, intro: 'The third declension is the big, varied family: φύλαξ (guard), ὄνομα (name), ἀνήρ (man), πόλις (city). Find the stem from the genitive, then add the endings.', teach: 'Explain why you need the genitive to decline φύλαξ.', talk: 'Ask {her} which English words come from πόλις and ὄνομα.' },
  { id: 'greek.participles', title: 'Participles: first steps', kind: 'facts', prereqs: ['greek.aorist', 'greek.adjectives'], batch: 5, intro: 'A participle is a verb used as an adjective: λύων means “freeing”. Greek uses them everywhere, often where English would use “who”, “while” or “after”.', teach: 'Translate ὁ φεύγων στρατηγός two different ways.', talk: 'Ask {her} what ὁ λύων means.' },
];

const items = [];
const push = (...xs) => items.push(...xs);

// --- alphabet
function alphabet(list, topic, prefix) {
  list.forEach(([lo, up, name, sound, translit, accept], i) => {
    const others = list.filter((x) => x[0] !== lo);
    push(fact(`${prefix}.name.${name}`, topic, `What is the name of the Greek letter **${lo}**?`, name, [others[(i + 1) % others.length][2], others[(i + 4) % others.length][2], others[(i + 7) % others.length][2]], `${lo} (capital ${up}) is ${name}: it sounds like ${sound}.`, { accept, learn: `**${lo}  ${up}**  ${name}: ${sound}` }));
    push(fact(`${prefix}.sound.${name}`, topic, `What sound does **${lo}** make?`, sound, [others[(i + 2) % others.length][3], others[(i + 5) % others.length][3], others[(i + 8) % others.length][3]], `${lo} is ${name}: ${sound}. In English letters it is written ${translit}.`, C));
  });
}
alphabet(ALPHA_1, 'alphabet-1', 'a1');
alphabet(ALPHA_2, 'alphabet-2', 'a2');
push(
  mcq('a1.cap.g', 'alphabet-1', 'Which capital letter goes with **γ** (gamma)?', [['Γ', true], ['Λ', false, 'Λ is capital lambda (λ).'], ['Π', false, 'Π is capital pi (π).'], ['Δ', false, 'Δ is capital delta (δ).']], 'Capital gamma is Γ, like an upside-down L.'),
  mcq('a1.cap.d', 'alphabet-1', 'Which capital letter goes with **δ** (delta)?', [['Δ', true], ['Λ', false, 'Λ is capital lambda.'], ['Α', false, 'Α is capital alpha.'], ['Θ', false, 'Θ is capital theta.']], 'Capital delta is Δ, the triangle you use in maths for “change in”.'),
  mcq('a1.cap.l', 'alphabet-1', 'Which capital letter goes with **λ** (lambda)?', [['Λ', true], ['Δ', false, 'Δ is capital delta.'], ['Γ', false, 'Γ is capital gamma.'], ['Μ', false, 'Μ is capital mu.']], 'Capital lambda is Λ: a triangle with no bottom.'),
  mcq('a1.cap.h', 'alphabet-1', 'The capital letter **Η** looks like an English H. Which Greek letter is it?', [['eta (η), a long e', true], ['a letter for the h sound', false, 'Ancient Greek has no letter for h: a rough breathing does that job. Η is capital eta.'], ['nu (ν)', false, 'Capital nu is Ν.']], 'Η is capital eta. Greek shows the h sound with a rough breathing instead.'),
  mcq('a1.cap.th', 'alphabet-1', 'Which capital letter goes with **θ** (theta)?', [['Θ', true], ['Ο', false, 'Ο is capital omicron.'], ['Φ', false, 'Φ is capital phi.'], ['Ε', false, 'Ε is capital epsilon.']], 'Θ: an O with a bar across it.'),
  mcq('a1.maths', 'alphabet-1', 'Which Greek letter do mathematicians usually use for an unknown angle?', [['θ (theta)', true], ['μ (mu)', false, 'μ is used for “micro” (a millionth) and for the mean.'], ['δ (delta)', false, 'δ and Δ usually mean a small change.']], 'θ is the classic angle letter: sin θ, cos θ.'),
  mcq('a1.alpha', 'alphabet-1', 'Our word “alphabet” comes from…', [['the first two Greek letters, alpha and beta', true], ['a Latin word for “letters”', false, 'The Romans borrowed it from the Greek: alpha + beta.'], ['the name of the man who invented writing', false, 'It is just the first two letters, like saying “the ABC”.']], 'alpha + beta = alphabet.'),
  mcq('a2.cap.s', 'alphabet-2', 'Which capital letter goes with **σ** (sigma)?', [['Σ', true], ['Ξ', false, 'Ξ is capital xi.'], ['Ε', false, 'Ε is capital epsilon.'], ['Ζ', false, 'Ζ is capital zeta.']], 'Capital sigma is Σ, the sign mathematicians use for “add them all up”.'),
  mcq('a2.cap.w', 'alphabet-2', 'Which capital letter goes with **ω** (omega)?', [['Ω', true], ['Ο', false, 'Ο is capital omicron, the short o.'], ['Ψ', false, 'Ψ is capital psi.'], ['Υ', false, 'Υ is capital upsilon.']], 'Ω, capital omega: “the Alpha and the Omega” means the beginning and the end. Physicists use Ω for ohms.'),
  mcq('a2.cap.p', 'alphabet-2', 'Which capital letter goes with **π** (pi)?', [['Π', true], ['Ρ', false, 'Ρ is capital rho, an r.'], ['Τ', false, 'Τ is capital tau.'], ['Φ', false, 'Φ is capital phi.']], 'Capital pi is Π. Lower-case π is the famous 3.14159…'),
  mcq('a2.cap.r', 'alphabet-2', 'The capital letter **Ρ** looks like an English P. What sound does it make?', [['r', true], ['p', false, 'Capital pi is Π. Ρ is rho, an r.'], ['ph', false, 'ph is φ, phi.']], 'Ρ, ρ is rho: an r. A false friend!'),
  mcq('a2.ff.v', 'alphabet-2', 'The letter **ν** looks like an English v. What sound does it make?', [['n', true], ['v', false, 'Ancient Greek has no v. ν is nu.'], ['u', false, 'u is υ, upsilon.']], 'ν is nu, an n: another false friend.'),
  mcq('a2.ff.x', 'alphabet-2', 'The letter **χ** looks like an English x. What sound does it make?', [['ch, as in “loch”', true], ['x, as in “box”', false, 'x is ξ, xi.'], ['k, as in “kit”', false, 'k is κ, kappa.']], 'χ is chi. The x sound is ξ, xi.'),
  mcq('a2.ff.w', 'alphabet-2', 'The letter **ω** looks like an English w. What sound does it make?', [['a long o', true], ['a w sound', false, 'Ancient Greek has no w. ω is omega.'], ['an m sound', false, 'm is μ.']], 'ω is omega, “big o”: a long o. ο, omicron, is “little o”: a short o.'),
  mcq('a2.sigma', 'alphabet-2', 'Sigma has two lower-case shapes, σ and ς. When do you use ς?', [['At the end of a word', true], ['At the start of a word', false, 'σ is used at the start and in the middle.'], ['For a double s', false, 'A double s is σσ, as in θάλασσα.']], 'ς is final sigma: λόγος, but σοφός.'),
  mcq('a2.double', 'alphabet-2', 'Which letters stand for two sounds at once?', [['ζ (zd), ξ (ks) and ψ (ps)', true], ['ει (ei), αι (ai) and ου (ou)', false, 'Those are pairs of letters (diphthongs), not single letters.'], ['θ (th), φ (ph) and χ (ch)', false, 'These are single sounds that we happen to write with two English letters (th, ph, ch).']], 'ζ, ξ and ψ each stand for two sounds: “zd”, “ks”, “ps”.'),
  order('a2.order', 'alphabet-2', 'Put these letters in alphabetical order.', ['ν', 'ξ', 'ο', 'π', 'ρ', 'σ'], 'nu, xi, omicron, pi, rho, sigma.'),
);

// --- reading aloud
const LOANS = [
  ['κόσμος', 'kosmos', ['cosmos'], 'order, the universe: cosmos, cosmetic'],
  ['χάος', 'chaos', ['khaos'], 'the empty void before creation'],
  ['δρᾶμα', 'drama', [], 'a deed, an action on stage'],
  ['κρίσις', 'krisis', ['crisis'], 'a decision, a turning point'],
  ['ἰδέα', 'idea', [], 'a form, an appearance'],
  ['μῦθος', 'muthos', ['mythos'], 'a story: myth'],
];
push(
  tmpl('reading', 'y8gTranslit'),
  mcq('rd.rough', 'reading', 'What does the rough breathing (the reversed comma ʽ on ἵ in ἵππος) do?', [['Adds an h sound: hippos', true], ['Makes the vowel long', false, 'Breathings are about h, not length.'], ['Shows the word is a name', false, 'Every word starting with a vowel has a breathing.']], 'ἵππος = hippos. The smooth breathing (ʼ), as in ἄνθρωπος, adds nothing.'),
  mcq('rd.smooth', 'reading', 'How do you say **ἀδελφός**?', [['adelphos (no h)', true], ['hadelphos', false, 'The breathing is smooth (ʼ), so no h.'], ['adelfus', false, 'ο is a short o: -os.']], 'A smooth breathing (ʼ) means no h.'),
  mcq('rd.rho', 'reading', 'A word starting with ρ always has a rough breathing: ῥήτωρ (speaker). How is it written in English letters?', [['rhetor', true], ['retor', false, 'The rough breathing on ρ becomes rh in English spelling.'], ['hretor', false, 'With ρ, the h goes after the r: rh.']], 'Initial ῥ becomes rh: rhetoric, rhinoceros (nose-horn), rhododendron.'),
  fact('rd.ou', 'reading', 'What sound does the diphthong **ου** make?', 'oo, as in “food”', ['ow, as in “cow”', 'oh, as in “go”', 'oi, as in “oil”'], 'ου says “oo”: Μέδουσα is Medousa (Medusa). αυ says “ow”, οι says “oi”.', C),
  fact('rd.ai', 'reading', 'What sound does the diphthong **αι** make?', 'ai, as in “aisle”', ['ay, as in “day”', 'ah, as in “father”', 'ee, as in “see”'], 'αι says “eye”: καί (and) sounds like “kai”.', C),
  fact('rd.au', 'reading', 'What sound does the diphthong **αυ** make?', 'ow, as in “cow”', ['oo, as in “food”', 'aw, as in “saw”', 'ay, as in “day”'], 'αυ says “ow”: ναύτης (sailor) gives us “nautical”.', C),
  fact('rd.gg', 'reading', 'In **ἄγγελος** (messenger), how is the γγ pronounced?', 'ng, as in “angle”', ['gg, as in “egg”', 'j, as in “jam”', 'g, as in “go”'], 'Before γ, κ, χ or ξ, a γ says “n”: ἄγγελος = angelos, the root of “angel”.', C),
  mcq('rd.isub', 'reading', 'What is the small mark under the ω in **λόγῳ**?', [['A small ι (iota subscript)', true], ['A comma under the letter', false, 'It is part of the word: a little ι.'], ['A sign that the word is plural', false, 'λόγῳ is the dative singular.']], 'ᾳ, ῃ, ῳ: an iota written underneath. You will see it in the dative singular a lot.'),
  mcq('rd.question', 'reading', 'What does a **;** mean at the end of a Greek sentence?', [['It is a question mark', true], ['It is a semicolon, as in English', false, 'In Greek, ; is the question mark. The raised dot · is like a semicolon or colon.'], ['It means the sentence continues', false, 'It marks a question.']], 'Greek ; = English ?. The raised dot · = English ; or :.'),
  mcq('rd.accent', 'reading', 'What do the accents (ά, ὰ, ᾶ) on Greek words show?', [['Which syllable to stress', true], ['That the vowel is long', false, 'Accents are about pitch and stress, not length.'], ['That the word is important', false, 'Almost every word has one.']], 'Ancient Greek accents showed a rise and fall in pitch. Today we usually just stress the accented syllable. The grave (ὰ) replaces an acute on the last syllable when another word follows.'),
  ...LOANS.map(([gr, answer, accept, meaning], i) => fact(`rd.loan.${i + 1}`, 'reading', `This Greek word came into English almost unchanged. Write it in English letters: **${gr}**`, answer, [], `${gr} = ${answer}: ${meaning}.`, { accept, formats: ['typed'] })),
);

// --- vocabulary
const vocab = (prefix, topic, list) => list.forEach(([gr, en, deriv, accept], i) => {
  const others = list.filter((w) => w[0] !== gr);
  const wrongEn = [others[(i + 1) % others.length][1], others[(i + 4) % others.length][1], others[(i + 7) % others.length][1]];
  const wrongGr = [others[(i + 2) % others.length][0], others[(i + 5) % others.length][0], others[(i + 8) % others.length][0]];
  push(fact(`${prefix}.${i + 1}`, topic, `What does **${gr}** mean?`, en, wrongEn, `${gr} = ${en}. English relatives: ${deriv}.`, { accept: [...accept, ...(en.startsWith('I ') ? [] : [`a ${en.split(',')[0]}`, `the ${en.split(',')[0]}`])], learn: `**${gr}** = ${en}\n_${deriv}_` }));
  push(fact(`${prefix}.en.${i + 1}`, topic, `Which is the Greek for **${en}**?`, gr, wrongGr, `${en} = ${gr}.`, C));
});
vocab('w1', 'words-1', WORDS_1);
vocab('w2', 'words-2', WORDS_2);
vocab('w3', 'words-3', WORDS_3);
push(
  mcq('w2.gender', 'words-2', 'Nouns ending -ος are usually masculine and nouns ending -ον are neuter. What gender are nouns ending -η, like τιμή?', [['feminine', true], ['masculine', false, '-η and -α nouns like τιμή and χώρα are feminine.'], ['neuter', false, 'Neuter nouns usually end -ον.']], 'τιμή, ψυχή, φωνή, χώρα, ἡμέρα: all feminine (ἡ τιμή).'),
  mcq('w3.dict', 'words-3', 'Why does a Greek dictionary say λύω means “I free”, not “to free”?', [['Verbs are listed in the “I” form', true], ['Greek has no word for “to”', false, 'Greek does have infinitives (λύειν = to free). Dictionaries just use the “I” form.'], ['λύω is a noun: “a freeing”', false, 'λύω is a verb.']], 'Latin and Greek dictionaries both use the “I” form: λύω, amo.'),
);

// --- the article
push(
  tmpl('article', 'y8gArticle'),
  mcq('ar.a', 'article', 'How do you say “a” (as in “a horse”) in Greek?', [['You leave it out', true], ['ὁ, as for “the”', false, 'ὁ means “the”.'], ['ἕν, the word for one', false, 'ἕν is the number one; it isn’t used as “a”.']], 'ἵππος can mean “a horse”; ὁ ἵππος is “the horse”.'),
  mcq('ar.sg', 'article', 'What are the three nominative singular forms of the article (“the”)?', [['ὁ, ἡ, τό', true], ['ὁ, ἡ, οἱ', false, 'οἱ is the masculine plural.'], ['τόν, τήν, τό', false, 'Those are accusative.']], 'ὁ λόγος, ἡ τιμή, τὸ δῶρον.'),
  mcq('ar.gen', 'article', 'Which form of the article means “of the” for a feminine singular noun?', [['τῆς', true], ['τοῦ', false, 'τοῦ is the masculine or neuter genitive singular.'], ['τῇ', false, 'τῇ is the dative: “to” or “for the”.']], 'τῆς τιμῆς = of the honour.'),
  mcq('ar.tow', 'article', 'Which form of the article is the same in the genitive plural for all three genders?', [['τῶν', true], ['τοῖς', false, 'τοῖς is the masculine and neuter dative plural; the feminine is ταῖς.'], ['τά', false, 'τά is neuter only.']], 'τῶν θεῶν, τῶν τιμῶν, τῶν δώρων: “of the”.'),
  mcq('ar.grave', 'article', 'Why is the article written τὸν (grave accent) in “τὸν ἵππον” but τόν in the table?', [['Final acutes turn grave before another word', true], ['It is a different word with the same letters', false, 'Same word, same meaning: just a different accent inside a sentence.'], ['Grave accents mark the accusative case', false, 'Accents don’t show case.']], 'Rule: an acute on the final syllable becomes grave unless punctuation follows: καλὸς ἵππος.'),
  mcq('ar.clue', 'article', 'In **τοὺς ἵππους ὁ δοῦλος ἄγει**, which word tells you most quickly who is doing the action?', [['ὁ (nominative)', true], ['τούς (accusative)', false, 'τούς is accusative: it marks the object.'], ['ἄγει (the verb)', false, 'The verb tells you there is one person, but not which noun.']], 'ὁ δοῦλος is nominative: the slave leads the horses, even though the horses come first.'),
);

// --- nouns
push(
  tmpl('nouns-2', 'y8gNoun2'),
  mcq('n2.uses', 'nouns-2', 'Which case would you use for “of the horse”?', [['genitive: τοῦ ἵππου', true], ['dative: τῷ ἵππῳ', false, 'The dative means “to” or “for”.'], ['accusative: τὸν ἵππον', false, 'The accusative is the object.']], 'Genitive = “of”: τοῦ ἵππου.'),
  mcq('n2.dat', 'nouns-2', 'What does **τῷ θεῷ** mean?', [['to (or for) the god', true], ['of (or from) the god', false, 'That is the genitive, τοῦ θεοῦ.'], ['the gods', false, 'The plural would be οἱ θεοί.']], 'Dative = “to” or “for”: “he gives a gift to the god”.'),
  mcq('n2.neut', 'nouns-2', 'Why can **τὰ δῶρα** be either the subject or the object?', [['In neuters, nominative = accusative', true], ['δῶρα is a verb, not a noun', false, 'δῶρα is the plural of δῶρον, a noun.'], ['All plural nouns look the same in every case', false, 'They do not: οἱ λόγοι, but τοὺς λόγους.']], 'For neuters, nominative = accusative: δῶρον / δῶρον, δῶρα / δῶρα. Use the sense and the verb to decide.'),
  mcq('n2.plural', 'nouns-2', 'What is the nominative plural of **ὁ ἄνθρωπος**?', [['οἱ ἄνθρωποι', true], ['τοὺς ἀνθρώπους', false, 'That is the accusative plural.'], ['τῶν ἀνθρώπων', false, 'That is the genitive plural: of the men.']], 'οἱ ἄνθρωποι = the men, the people (subject).'),
  fact('n2.decl', 'nouns-2', 'What do we call the set of all the case endings of a noun?', 'a declension', ['a conjugation', 'a tense', 'a mood'], 'Nouns decline (λόγος, λόγον, λόγου…); verbs conjugate (λύω, λύεις, λύει…).', C),
  tmpl('nouns-1', 'y8gNoun1'),
  mcq('n1.alpha', 'nouns-1', 'Why does **χώρα** keep its α in the genitive singular (χώρας), when τιμή has τιμῆς?', [['After ε, ι or ρ, the α stays', true], ['It is an old spelling of the word', false, 'It is a regular pattern, called “alpha pure”.'], ['χώρα is a masculine noun', false, 'χώρα is feminine.']], 'ἡμέρα, οἰκία, χώρα: α after ε, ι or ρ stays α (χώρας, ἡμέρας). After other letters, η (τιμῆς, φωνῆς).'),
  mcq('n1.pl', 'nouns-1', 'All first-declension nouns share the same plural endings. What is the nominative plural of **ἡ ψυχή**?', [['αἱ ψυχαί', true], ['αἱ ψυχοί', false, '-οι is the second declension.'], ['τὰς ψυχάς', false, 'That is the accusative plural.']], 'Plural: -αι, -ας, -ῶν, -αις, for τιμή and χώρα alike.'),
  mcq('n1.genpl', 'nouns-1', 'What is special about the genitive plural of every first-declension noun?', [['It always ends -ῶν', true], ['It is the same as the nominative singular', false, 'No: χώρα but χωρῶν.'], ['It always ends -ους', false, '-ους is the second-declension accusative plural.']], 'τιμῶν, χωρῶν, ἡμερῶν, κορῶν: always -ῶν.'),
);

// --- verbs
push(
  tmpl('verbs-1', 'y8gVerb'),
  mcq('v.endings', 'verbs-1', 'Which ending means “we” in the present tense?', [['-ομεν (λύομεν)', true], ['-ετε (λύετε)', false, '-ετε is “you” (plural).'], ['-ουσι(ν) (λύουσι)', false, '-ουσι(ν) is “they”.']], '-ω, -εις, -ει, -ομεν, -ετε, -ουσι(ν): I, you, he/she, we, you (pl), they.'),
  mcq('v.nu', 'verbs-1', 'Why is it sometimes λύουσι and sometimes λύουσιν?', [['The ν is added before a vowel', true], ['λύουσιν is plural and λύουσι singular', false, 'Both mean “they free”.'], ['They are different tenses of λύω', false, 'Same tense, same meaning.']], 'This is the “movable nu”: it smooths the sound before a vowel, like “a” and “an” in English.'),
  mcq('v.inf', 'verbs-1', 'What does **λύειν** mean?', [['to free', true], ['they free', false, 'They free is λύουσι(ν).'], ['he frees', false, 'He frees is λύει.']], 'The present infinitive ends -ειν: λύειν, γράφειν. ἐθέλει φεύγειν = “he wants to flee”.'),
  fact('v.eimi', 'verbs-1', 'Which verb is irregular and means “I am”?', 'εἰμί', ['ἔχω', 'μένω', 'εἶ'], 'εἰμί, εἶ, ἐστί(ν), ἐσμέν, ἐστέ, εἰσί(ν).', C),
  mcq('v.esti', 'verbs-1', 'What does **ἐστί(ν)** mean?', [['he, she or it is', true], ['they are', false, 'They are is εἰσί(ν).'], ['you (singular) are', false, 'You (singular) are is εἶ.']], 'ἐστί(ν) = is. English “is” is a distant cousin: they go back to the same ancient root.'),
  mcq('v.eisi', 'verbs-1', 'What does **εἰσί(ν)** mean?', [['they are', true], ['we are', false, 'We are is ἐσμέν.'], ['into', false, 'Careful: εἰς (into) looks similar, but εἰσί(ν) is “they are”.']], 'εἰσί(ν) = they are.'),
);

// --- sentences
const SENT = [
  ['ὁ δοῦλος τὸν ἵππον ἄγει.', 'The slave leads the horse.', ['The horse leads the slave.', 'The slave leads the horses.']],
  ['ὁ θεὸς τοὺς ἀνθρώπους παιδεύει.', 'The god teaches the people.', ['The people teach the god.', 'The gods teach the person.']],
  ['ἡ κόρη τὴν φωνὴν ἀκούει.', 'The girl hears the voice.', ['The girls hear the voice.', 'The voice hears the girl.']],
  ['ὁ στρατηγὸς τοὺς πολεμίους διώκει.', 'The general chases the enemy.', ['The enemy chase the general.', 'The general flees from the enemy.']],
  ['οἱ δοῦλοι τὰ δῶρα φέρουσιν.', 'The slaves carry the gifts.', ['The slave carries the gift.', 'The slaves send the gifts.']],
  ['τὸν φίλον ὁ ἀδελφὸς λύει.', 'The brother frees the friend.', ['The friend frees the brother.', 'The brothers free the friend.']],
  ['ὁ ἄνθρωπος λόγον γράφει.', 'The man writes a speech.', ['The man hears a speech.', 'The men write speeches.']],
  ['οἱ φίλοι τῷ στρατηγῷ πιστεύουσιν.', 'The friends trust the general.', ['The general trusts the friends.', 'The friend trusts the generals.']],
  ['ὁ δοῦλος οὐ φεύγει.', 'The slave does not flee.', ['The slave flees.', 'The slaves do not flee.']],
  ['οἱ θεοὶ σοφοί εἰσιν.', 'The gods are wise.', ['The god is wise.', 'The wise gods are here.']],
];
SENT.forEach(([gr, en, wrong], i) => push(fact(`s.${i + 1}`, 'sentences', `Translate: **${gr}**`, en, wrong, `${gr} → “${en}” Find the verb, then the nominative (the subject), then the accusative (the object).${i === 3 ? ' οἱ πολέμιοι (from πολέμιος, hostile) means “the enemy”.' : ''}`, C)));
push(
  mcq('s.first', 'sentences', 'What is the best first step when translating a Greek sentence?', [['Find the verb and its ending', true], ['Translate the words left to right', false, 'Greek word order is flexible, so left to right can mislead you.'], ['Look for the longest word', false, 'Length doesn’t tell you the structure.']], 'Verb first, then the nominative subject, then the accusative object, then the rest.'),
  mcq('s.not', 'sentences', 'Greek “not” is οὐ. Why do you also see οὐκ and οὐχ?', [['οὐκ before a smooth breathing, οὐχ before a rough', true], ['οὐκ means “never” and οὐχ means “nobody”', false, 'All three just mean “not”.'], ['οὐκ is used with present, οὐχ with past tenses', false, 'The choice depends on the next sound.']], 'οὐ φεύγει, οὐκ ἀκούει, οὐχ ἕξει.'),
);

// --- prepositions
const PREP = [
  ['ἐν τῷ οἴκῳ', 'in the house', 'ἐν + dative = in, on', ['into the house', 'out of the house', 'towards the house']],
  ['εἰς τὸν ποταμόν', 'into the river', 'εἰς + accusative = into, to', ['in the river', 'out of the river', 'from the river']],
  ['ἐκ τῆς χώρας', 'out of the land', 'ἐκ (ἐξ before a vowel) + genitive = out of', ['into the land', 'in the land', 'towards the land']],
  ['ἀπὸ τῆς ἀγορᾶς', 'from the market place', 'ἀπό + genitive = from, away from', ['into the market place', 'in the market place', 'through the market place']],
  ['πρὸς τὸν στρατηγόν', 'towards the general', 'πρός + accusative = towards, to', ['away from the general', 'with the general', 'because of the general']],
  ['μετὰ τῶν φίλων', 'with the friends', 'μετά + genitive = with', ['after the friends', 'into the friends', 'without the friends']],
  ['μετὰ τὴν μάχην', 'after the battle', 'μετά + accusative = after', ['with the battle', 'before the battle', 'in the battle']],
  ['διὰ τὸν πόλεμον', 'because of the war', 'διά + accusative = because of', ['through the war', 'into the war', 'out of the war']],
  ['διὰ τῆς χώρας', 'through the land', 'διά + genitive = through', ['because of the land', 'into the land', 'from the land']],
];
PREP.forEach(([gr, en, rule, wrong], i) => push(fact(`p.${i + 1}`, 'prepositions', `What does **${gr}** mean?`, en, wrong, `${rule}: ${gr} = ${en}.`, C)));
push(
  mcq('p.case-en', 'prepositions', 'Which case follows **ἐν** (in)?', [['dative', true], ['accusative', false, 'εἰς (into) takes the accusative.'], ['genitive', false, 'ἐκ (out of) takes the genitive.']], 'A neat pattern: being IN a place = dative; motion INTO = accusative; motion OUT OF = genitive.'),
  mcq('p.case-eis', 'prepositions', 'Which case follows **εἰς** (into)?', [['accusative', true], ['dative', false, 'ἐν takes the dative.'], ['nominative', false, 'Prepositions never take the nominative.']], 'εἰς τὴν Κρήτην = into Crete, to Crete.'),
  mcq('p.ex', 'prepositions', 'Why is it ἐξ ἀγορᾶς but ἐκ τῆς ἀγορᾶς?', [['ἐκ becomes ἐξ before a vowel', true], ['ἐξ means something different', false, 'Same word, same meaning: “out of”.'], ['ἐξ is used with feminine nouns', false, 'It depends on the next sound, not on gender.']], 'ἐξ before a vowel (ἐξ ἀγορᾶς); ἐκ before a consonant (ἐκ τῆς ἀγορᾶς). Like οὐ and οὐκ, it smooths the sound.'),
);

// --- adjectives
ADJ.forEach(([m, f, n, en, deriv, accept], i) => {
  const others = ADJ.filter((a) => a[0] !== m);
  push(fact(`adj.${i + 1}`, 'adjectives', `What does **${m}, ${f}, ${n}** mean?`, en, [others[(i + 1) % 9][3], others[(i + 3) % 9][3], others[(i + 6) % 9][3]], `${m} = ${en}. English relatives: ${deriv}.`, { accept, learn: `**${m}, ${f}, ${n}** = ${en}\n_${deriv}_` }));
  push(fact(`adj.en.${i + 1}`, 'adjectives', `Which is the Greek for **${en}**?`, m, [others[(i + 2) % 9][0], others[(i + 4) % 9][0], others[(i + 7) % 9][0]], `${en} = ${m}, ${f}, ${n}.`, C));
});
push(
  mcq('adj.agree', 'adjectives', 'Which phrase means “the beautiful girl”?', [['ἡ καλὴ κόρη', true], ['ἡ καλὸς κόρη', false, 'κόρη is feminine, so the adjective must be feminine: καλή.'], ['ὁ καλὸς κόρη', false, 'Both the article and the adjective must be feminine.']], 'Adjectives agree with their noun in gender, case and number: ἡ καλὴ κόρη.'),
  mcq('adj.attr', 'adjectives', 'What does **ὁ σοφὸς στρατηγός** mean?', [['the wise general', true], ['the general is wise', false, 'That would be ὁ στρατηγὸς σοφός, with the adjective outside the article and noun.'], ['the generals are wise', false, 'Everything here is singular.']], 'When the adjective sits between the article and the noun (attributive position), it describes: “the wise general”.'),
  mcq('adj.pred', 'adjectives', 'What does **ὁ στρατηγὸς σοφός** mean?', [['the general is wise', true], ['the wise general', false, 'With the adjective outside the article and noun (predicative position), you add “is”.'], ['wise generals', false, 'It is singular, with the article.']], 'Greek often leaves out “is”: ὁ στρατηγὸς σοφός = the general (is) wise.'),
  mcq('adj.alpha', 'adjectives', 'Why is “small” μικρός, μικρά, μικρόν, but “beautiful” καλός, καλή, καλόν?', [['After ρ (or ε, ι) the feminine keeps α', true], ['μικρός is an irregular adjective', false, 'It is regular: the same rule as χώρα.'], ['μικρά is the neuter, not the feminine', false, 'μικρά is feminine singular here.']], 'The same “alpha pure” rule as the nouns: δικαία, νέα, μικρά, but καλή, σοφή.'),
  mcq('adj.neut', 'adjectives', 'Which adjective form goes with **τὸ δῶρον**?', [['καλόν', true], ['καλός', false, 'καλός is masculine. δῶρον is neuter.'], ['καλή', false, 'καλή is feminine.']], 'τὸ καλὸν δῶρον = the beautiful gift.'),
);

// --- tenses
push(
  tmpl('tenses', 'y8gTense'),
  mcq('t.augment', 'tenses', 'What is the augment?', [['An ἐ- added to the front, for past tenses', true], ['A σ added before the ending', false, 'That marks the future.'], ['The ending that shows who is doing it', false, 'The augment is at the front.']], 'λύω → ἔλυον (imperfect). Verbs starting with a vowel lengthen it instead: ἄγω → ἦγον.'),
  mcq('t.vowel', 'tenses', 'What is the imperfect of **ἄγω** (I lead), “I was leading”?', [['ἦγον', true], ['ἐάγον', false, 'A verb starting with a vowel lengthens it instead of adding ἐ-: α → η.'], ['ἄξω', false, 'ἄξω is the future, “I will lead”.']], 'α lengthens to η: ἄγω → ἦγον. Likewise ἀκούω → ἤκουον, ἐθέλω → ἤθελον.'),
  mcq('t.fut', 'tenses', 'Why is the future of πέμπω written πέμψω, not πέμπσω?', [['π + σ is written ψ', true], ['It is irregular', false, 'It follows a regular spelling rule.'], ['ψ means future', false, 'The σ means future; π + σ just looks like ψ.']], 'π, β, φ + σ → ψ (πέμψω, γράψω). κ, γ, χ + σ → ξ (ἄξω).'),
  mcq('t.impf', 'tenses', 'What does the imperfect describe?', [['An ongoing or repeated past action', true], ['A single finished action in the past', false, 'That is the aorist (a stretch topic).'], ['An action that will happen in the future', false, 'That is the future.']], 'ἔλυον = I was freeing, I used to free, I kept freeing.'),
  mcq('t.amb', 'tenses', '**ἔλυον** can mean two things. Which?', [['I was freeing, or they were freeing', true], ['I free, or I will free', false, 'The augment shows a past tense.'], ['he was freeing, or she was freeing', false, 'The -ον ending is first person singular or third person plural.']], 'In the imperfect, -ον is both “I” and “they”: use the context (or a plural subject) to decide.'),
);

// --- particles
const PARTS = [
  ['καί', 'and', ['but', 'for', 'therefore'], 'καί = and. It can also mean “also” or “even”: καὶ ὁ στρατηγός, “the general too”.'],
  ['ἀλλά', 'but', ['and', 'therefore', 'for'], 'ἀλλά = but, a strong contrast.'],
  ['γάρ', 'for (because)', ['but (however)', 'and (also)', 'so (therefore)'], 'γάρ = for (giving a reason). It never comes first in its clause.'],
  ['οὖν', 'therefore, so', ['and', 'but', 'because'], 'οὖν = therefore, so. It never comes first in its clause.'],
  ['οὐ', 'not', ['and', 'for', 'so'], 'οὐ = not (οὐκ before a smooth breathing, οὐχ before a rough breathing).'],
];
PARTS.forEach(([gr, en, wrong, explain], i) => push(fact(`pt.${i + 1}`, 'particles', `What does **${gr}** mean?`, en, wrong, explain, C)));
push(
  mcq('pt.post', 'particles', 'γάρ, οὖν and δέ are “postpositive”. What does that mean?', [['They never come first in their clause', true], ['They always come at the end of the sentence', false, 'They go second, not last.'], ['They only go after verbs', false, 'They go after the first word, whatever it is.']], 'δεινὸς γάρ ἐστιν = “for it is terrible”. In English “for” comes first; in Greek, γάρ comes second.'),
  mcq('pt.mende', 'particles', 'How would you translate **ὁ μὲν Θησεὺς ἀνδρεῖος, ὁ δὲ Μινώταυρος δεινός**?', [['Theseus is brave, but (whereas) the Minotaur is terrible', true], ['Theseus and the Minotaur are brave and terrible', false, 'μέν… δέ contrasts the two halves.'], ['Theseus is not brave', false, 'There is no οὐ.']], 'μέν… δέ: “on the one hand… on the other”. Often μέν is left untranslated and δέ becomes “but” or “while”.'),
  mcq('pt.de', 'particles', 'What does **δέ** usually mean when it appears without μέν?', [['and, or but', true], ['not', false, 'Not is οὐ.'], ['therefore', false, 'Therefore is οὖν.']], 'δέ is the commonest linking word in stories: ὁ δὲ Ὀδυσσεύς… “And Odysseus…” or “But Odysseus…”.'),
  fact('pt.gar-en', 'particles', 'In the Theseus story, how would you translate **δεινὸς γάρ ἐστιν**?', 'for he is terrible', ['but he is terrible', 'therefore he is terrible', 'he is not terrible'], 'γάρ = for (because). “He” is the Minotaur: “for he is terrible”.', { ...C, ...PASS_THESEUS }),
);

// --- Greek inside English
const ROOTS = [
  ['τῆλε (far) + φωνή (voice)', 'telephone', ['television', 'phonics', 'symphony']],
  ['βίος (life) + λόγος (study)', 'biology', ['geology', 'biography', 'theology']],
  ['δῆμος (people) + κράτος (power)', 'democracy', ['aristocracy', 'demagogue', 'dynamo']],
  ['δεινός (terrible) + σαῦρος (lizard)', 'dinosaur', ['thesaurus', 'pterosaur', 'dynamo']],
  ['ἵππος (horse) + ποταμός (river)', 'hippopotamus', ['hippodrome', 'Mesopotamia', 'potamology']],
  ['φίλος (loving) + σοφία (wisdom)', 'philosophy', ['philanthropy', 'sophisticated', 'Philadelphia']],
  ['χρόνος (time) + λόγος (study)', 'chronology', ['chronic', 'astrology', 'synchronise']],
  ['ψυχή (mind) + λόγος (study)', 'psychology', ['psychic', 'physiology', 'mythology']],
  ['αὐτός (self) + γράφω (write)', 'autograph', ['automatic', 'photograph', 'graphic']],
  ['μικρός (small) + σκοπέω (look at)', 'microscope', ['telescope', 'microchip', 'horoscope']],
  ['γῆ (earth) + γράφω (write, draw)', 'geography', ['geometry', 'graphic', 'geology']],
  ['ἄστρον (star) + ναύτης (sailor)', 'astronaut', ['astronomy', 'nautical', 'asteroid']],
];
ROOTS.forEach(([parts, word, wrong], i) => push(fact(`ro.${i + 1}`, 'roots', `Which English word is built from **${parts}**?`, word, wrong, `${parts} → ${word}.`, C)));
push(
  mcq('ro.ology', 'roots', 'Using λόγος (word, study), what does “-ology” at the end of a subject mean?', [['the study of', true], ['the fear of', false, 'That is -phobia, from φόβος.'], ['the love of', false, 'That is philo-, from φίλος.']], 'Biology, geology, theology, psychology: the study of life, the earth, god, the mind.'),
  mcq('ro.phobia', 'roots', 'φόβος means fear. What is **arachnophobia**, if ἀράχνη means spider?', [['fear of spiders', true], ['love of spiders', false, 'Love would be -philia.'], ['study of spiders', false, 'Study would be -ology: arachnology.']], 'ἀράχνη (spider) + φόβος (fear).'),
  mcq('ro.poly', 'roots', 'πολύς means many and γωνία means angle. What is a **polygon**?', [['a shape with many angles', true], ['a shape with one angle', false, 'πολύς is many.'], ['a type of circle', false, 'A circle has no angles.']], 'polygon = many angles. Pentagon (πέντε, five), hexagon (ἕξ, six) and octagon (ὀκτώ, eight) work the same way.'),
  mcq('ro.thermo', 'roots', 'θερμός means hot and μέτρον means measure. What is a **thermometer**?', [['something that measures heat', true], ['something that makes heat', false, 'μέτρον is measure.'], ['a cold store', false, 'θερμός is hot.']], 'θερμός + μέτρον. Also: thermal, thermos flask.'),
);

// --- culture
const GODS = [
  ['Zeus', 'king of the gods, god of the sky and thunder', 'a thunderbolt'],
  ['Hera', 'queen of the gods, goddess of marriage', 'a peacock'],
  ['Poseidon', 'god of the sea and earthquakes', 'a trident'],
  ['Athena', 'goddess of wisdom, crafts and war strategy', 'an owl'],
  ['Apollo', 'god of music, poetry, healing and prophecy', 'a lyre'],
  ['Artemis', 'goddess of hunting and the wild', 'a bow and arrows'],
  ['Hermes', 'messenger of the gods, god of travellers and thieves', 'winged sandals'],
  ['Hephaestus', 'god of fire and the forge, the smith of the gods', 'a hammer and anvil'],
  ['Demeter', 'goddess of the harvest and grain', 'a sheaf of wheat'],
  ['Dionysus', 'god of wine and the theatre', 'a vine'],
];
GODS.forEach(([god, role, symbol], i) => {
  const others = GODS.filter((g) => g[0] !== god);
  push(fact(`cu.god.${god.toLowerCase()}`, 'culture', `Which god is the ${role}?`, god, [others[(i + 1) % 9][0], others[(i + 4) % 9][0], others[(i + 7) % 9][0]], `${god}: ${role}. Symbol: ${symbol}.`, { accept: god === 'Hephaestus' ? ['Hephaistos', 'Hephestus'] : god === 'Dionysus' ? ['Dionysos'] : god === 'Apollo' ? ['Apollon'] : [], learn: `**${god}**: ${role}. Symbol: ${symbol}.` }));
  push(fact(`cu.sym.${god.toLowerCase()}`, 'culture', `Which symbol belongs to **${god}**?`, symbol, [others[(i + 2) % 9][2], others[(i + 5) % 9][2], others[(i + 8) % 9][2]], `${god} (${role}): ${symbol}.`, C));
});
push(
  fact('cu.olympia', 'culture', 'Where were the ancient Olympic Games held, in honour of Zeus?', 'Olympia', ['Mount Olympus', 'Athens', 'Sparta'], 'Olympia, in the western Peloponnese. Mount Olympus, home of the gods, is far to the north.', { accept: ['at olympia'] }),
  fact('cu.776', 'culture', 'In which year do the Greeks date the first Olympic Games?', '776 BC', ['490 BC', 'AD 1896', '1066 BC'], 'Traditionally 776 BC. The Greeks even counted years in Olympiads, four-year periods.', C),
  fact('cu.prize', 'culture', 'What did an ancient Olympic winner receive at the games themselves?', 'a wreath of olive leaves', ['a gold medal', 'a bag of silver', 'a bronze statue of Zeus'], 'Just an olive wreath, though home cities often gave winners free meals for life.', C),
  mcq('cu.theatre', 'culture', 'Athenian plays were performed at festivals in honour of which god?', [['Dionysus', true], ['Apollo', false, 'Apollo was god of music, but the drama festivals honoured Dionysus.'], ['Ares', false, 'Ares was the god of war.']], 'The City Dionysia, each spring: tragedies and comedies in the Theatre of Dionysus.'),
  mcq('cu.chorus', 'culture', 'In Greek tragedy, what was the **chorus**?', [['A group who sang, danced and commented', true], ['The main actor and his two helpers', false, 'Actors played the main parts, wearing masks.'], ['The audience, who sang along', false, 'The audience watched; the chorus performed.']], 'χορός = a dance, a band of dancers. It gives us “chorus” and “choreography”.'),
  mcq('cu.masks', 'culture', 'Why did Greek actors wear masks?', [['So a few actors could play many parts', true], ['To hide their faces from the gods', false, 'It was a practical tradition.'], ['Because acting was against the law', false, 'Theatre was a public, religious festival.']], 'Three actors could play every speaking part. Theatres were huge: Epidaurus seats over 12,000.'),
  mcq('cu.iliad', 'culture', 'What is Homer’s **Iliad** about?', [['The anger of Achilles in the Trojan War', true], ['Odysseus’ ten-year journey home', false, 'That is the Odyssey.'], ['The founding of Athens by Theseus', false, 'The Iliad is set at Troy.']], 'The Iliad: the anger of Achilles at Troy. The Odyssey: Odysseus’ voyage home to Ithaca.'),
  mcq('cu.odyssey', 'culture', 'Where was Odysseus trying to get home to?', [['Ithaca', true], ['Troy', false, 'He was leaving Troy, after the war.'], ['Sparta', false, 'Sparta was Menelaus’ city.']], 'Ithaca, an island off western Greece, where Penelope and Telemachus waited.'),
  mcq('cu.athens', 'culture', 'What did Athens become famous for, from about 508 BC?', [['democracy', true], ['the Olympic Games', false, 'They began at Olympia, much earlier.'], ['inventing the alphabet', false, 'The Greeks adapted the Phoenician alphabet centuries earlier.']], 'After the reforms of Cleisthenes, adult male citizens voted directly in the Assembly. Women, slaves and foreigners could not vote.'),
  mcq('cu.sparta', 'culture', 'What was a Spartan boy’s life like from the age of about seven?', [['Tough military training in the agoge', true], ['Studying philosophy in Athens', false, 'Spartans valued military skill above all.'], ['Working on the family farm', false, 'Spartan citizens did not farm: the helots did that.']], 'The agoge trained boys in endurance, obedience and fighting. Spartan girls also exercised and competed, unusually for Greece.'),
);

// --- myths
const MQ = (id, topic, prompt, right, wrongs, explain, pass) => push(fact(`my.${id}`, topic, prompt, right, wrongs, explain, { ...C, ...pass }));
MQ('th.1', 'myth-1', 'Who is king in Crete?', 'Minos', ['Theseus', 'the Minotaur', 'Ariadne'], '“ἐν τῇ Κρήτῃ ὁ Μίνως βασιλεύει.”', PASS_THESEUS);
MQ('th.2', 'myth-1', 'Translate: **ἐν δὲ τῷ λαβυρίνθῳ μένει ὁ Μινώταυρος.**', 'And in the labyrinth the Minotaur stays.', ['And the Minotaur flees into the labyrinth.', 'The Minotaur stays out of the labyrinth.', 'And in the labyrinth the Minotaurs wait.'], 'ἐν + dative = in; μένει = stays, waits; ὁ Μινώταυρος is the subject.', PASS_THESEUS);
MQ('th.3', 'myth-1', 'Whom do the Athenians send to Crete?', 'seven young men and seven girls', ['seven soldiers and seven sailors', 'Theseus alone, with one ship', 'fourteen slaves from the market'], '“ἑπτὰ νεανίας καὶ ἑπτὰ κόρας”: seven young men and seven girls.', PASS_THESEUS);
MQ('th.4', 'myth-1', 'Why does Theseus want to go?', 'he is brave and wants to free his friends', ['he wants to become king of Crete', 'Ariadne asks him to', 'he is a slave'], '“ἀνδρεῖός ἐστιν· ἐθέλει οὖν τοὺς φίλους λύειν.” He is brave, so he wants to free his friends.', PASS_THESEUS);
MQ('th.5', 'myth-1', 'In “ἡ τοῦ βασιλέως θυγάτηρ”, what does τοῦ βασιλέως mean?', 'of the king', ['to the king', 'the king', 'the kings'], 'τοῦ is genitive: “the daughter of the king”.', PASS_THESEUS);
MQ('th.6', 'myth-1', 'What does Ariadne give Theseus?', 'a thread', ['a sword', 'a shield', 'a map'], '“λίνον αὐτῷ δίδωσιν”: she gives him a thread.', PASS_THESEUS);
MQ('th.7', 'myth-1', 'What case is **τῷ λίνῳ** (“with the thread”), and why?', 'dative, because it is the thing he uses', ['genitive, because it means “of”', 'accusative, because it is the object', 'nominative, because it is the subject'], 'The dative can mean “with” or “by means of”: τῷ λίνῳ τὴν ὁδὸν εὑρίσκει, he finds the way with the thread.', PASS_THESEUS);
push(order('my.th.8', 'myth-1', 'Put the events of the story in order.', ['The Athenians send young people to Crete', 'Ariadne gives Theseus a thread', 'Theseus kills the Minotaur', 'Theseus finds his way out', 'The Athenians rejoice'], 'Sent, helped, kills, escapes, rejoicing.', PASS_THESEUS));
MQ('cy.1', 'myth-2', 'Where are Odysseus and his friends sailing?', 'home from Troy', ['to Troy', 'to Crete', 'to Mount Olympus'], '“ἐκ τῆς Τροίας οἴκαδε πλέουσιν”: out of Troy, homewards.', PASS_CYCLOPS);
MQ('cy.2', 'myth-2', 'Translate: **ἐν νήσῳ ἄντρον εὑρίσκουσιν.**', 'They find a cave on an island.', ['They flee from a cave on an island.', 'They find an island in a cave.', 'He finds a cave on an island.'], 'ἐν νήσῳ = on an island; ἄντρον is the object; εὑρίσκουσιν = they find.', PASS_CYCLOPS);
MQ('cy.3', 'myth-2', 'How does Odysseus get the Cyclops to fall asleep?', 'he gives him wine', ['he sings to him', 'he gives him gold', 'he asks Athena for help'], '“τῷ Κύκλωπι οἶνον δίδωσι… ὁ Κύκλωψ τὸν οἶνον πίνει καὶ καθεύδει.”', PASS_CYCLOPS);
MQ('cy.4', 'myth-2', 'What name does Odysseus give?', 'Nobody', ['Odysseus', 'Zeus', 'Polyphemus'], '«Οὖτις ὄνομά μοί ἐστιν»: “My name is Nobody”.', PASS_CYCLOPS);
MQ('cy.5', 'myth-2', 'Why do the other Cyclopes not come to help Polyphemus?', 'he shouts that Nobody is killing him', ['they are asleep in their caves', 'they are afraid of Odysseus', 'they cannot hear him from the hills'], '«Οὖτίς με ἀποκτείνει»: “Nobody is killing me!” So, they think, nothing is wrong.', PASS_CYCLOPS);
MQ('cy.6', 'myth-2', 'How do the Greeks escape from the cave?', 'under the sheep', ['through a hole in the roof', 'by fighting the Cyclops', 'on a ship'], '“ὑπὸ τοῖς προβάτοις”: under the sheep, clinging to their bellies.', PASS_CYCLOPS);
MQ('cy.7', 'myth-2', 'In “ὁ δὲ Ὀδυσσεὺς σοφός ἐστιν”, what does δέ do?', 'it contrasts Odysseus with the Cyclops', ['it means “not”: Odysseus is not wise', 'it turns the sentence into a question', 'it means “therefore”: so Odysseus is wise'], 'δέ: “But Odysseus is wise.” The story turns on this word.', PASS_CYCLOPS);
MQ('pe.1', 'myth-2', 'What happens to people who look at Medusa?', 'they turn to stone', ['they fall asleep', 'they go blind', 'they fly away'], '“λίθοι γίγνονται”: they become stones.', PASS_PERSEUS);
MQ('pe.2', 'myth-2', 'Who gives Perseus the shining shield?', 'Athena', ['Hermes', 'Zeus', 'Medusa'], '“ἡ Ἀθηνᾶ τῷ Περσεῖ ἀσπίδα λαμπρὰν δίδωσιν.” Hermes gives the winged sandals.', PASS_PERSEUS);
MQ('pe.3', 'myth-2', 'What case is **τῷ Περσεῖ**, and what does it mean here?', 'dative: to Perseus', ['genitive: of Perseus', 'accusative: Perseus (object)', 'nominative: Perseus (subject)'], 'She gives the shield TO Perseus: dative. (Περσεύς is third declension, so the ending is -εῖ.)', PASS_PERSEUS);
MQ('pe.4', 'myth-2', 'How does Perseus avoid looking at Medusa?', 'he uses the shield as a mirror', ['he closes his eyes and listens', 'he wears a helmet over his eyes', 'he attacks her at night'], '“οὐ βλέπει τὴν Μέδουσαν, ἀλλὰ τὴν εἰκόνα ἐν τῇ ἀσπίδι.”', PASS_PERSEUS);
MQ('pe.5', 'myth-2', 'Translate: **ὁ δὲ Περσεὺς τὴν Μέδουσαν ἀποκτείνειν ἐθέλει.**', 'And Perseus wants to kill Medusa.', ['And Medusa wants to kill Perseus.', 'Perseus does not want to kill Medusa.', 'And Perseus kills Medusa.'], 'ἀποκτείνειν is an infinitive (“to kill”) after ἐθέλει (“wants”). τὴν Μέδουσαν is accusative: the object.', PASS_PERSEUS);

// --- stretch: aorist
push(
  mcq('ao.what', 'aorist', 'What does the aorist usually describe?', [['A single, completed action in the past', true], ['An action that kept going on in the past', false, 'That is the imperfect.'], ['An action happening now', false, 'That is the present.']], 'ἔλυον = I was freeing; ἔλυσα = I freed (once, done).'),
  fact('ao.lusa', 'aorist', 'What does **ἔλυσα** mean?', 'I freed', ['I was freeing', 'I will free', 'I free'], 'Augment ἐ- + stem λυ + σα: the weak aorist, “I freed”.', { accept: ['freed', 'i released', 'released', 'i set free', 'i loosened'] }),
  mcq('ao.forms', 'aorist', 'Which is the aorist of λύω for “they freed”?', [['ἔλυσαν', true], ['ἔλυον', false, 'ἔλυον is imperfect: they were freeing.'], ['λύσουσι(ν)', false, 'λύσουσι(ν) is future: they will free.']], 'ἔλυσα, ἔλυσας, ἔλυσε(ν), ἐλύσαμεν, ἐλύσατε, ἔλυσαν.'),
  mcq('ao.3sg', 'aorist', 'What does **ἐπαίδευσε(ν)** mean?', [['he or she taught', true], ['he or she was teaching', false, 'The σε shows the aorist, not the imperfect (ἐπαίδευε).'], ['they taught', false, 'They taught is ἐπαίδευσαν.']], 'ἐ- (augment) + παιδευ + σε: he/she taught.'),
  mcq('ao.pemp', 'aorist', 'The aorist of πέμπω is ἔπεμψα. What does it mean?', [['I sent', true], ['I will send', false, 'The augment shows it is past.'], ['I was sending', false, 'That is ἔπεμπον, the imperfect.']], 'π + σ → ψ, just like the future πέμψω, but with the augment: ἔπεμψα.'),
  mcq('ao.strong', 'aorist', 'Some verbs have a “strong” aorist with a different stem. The aorist of φεύγω (I flee) is ἔφυγον. What does it mean?', [['I fled', true], ['I was fleeing', false, 'That is ἔφευγον, the imperfect. Note the stem change: φευγ → φυγ.'], ['I will flee', false, 'The augment shows it is past.']], 'Strong aorists have imperfect-style endings on a different stem: ἔφυγον, ἔλαβον (I took), εἶπον (I said).'),
  mcq('ao.eipon', 'aorist', 'εἶπον is the aorist of which verb?', [['λέγω (I say)', true], ['ἔχω (I have)', false, 'The aorist of ἔχω is ἔσχον.'], ['πέμπω (I send)', false, 'The aorist of πέμπω is ἔπεμψα.']], 'Some aorists have to be learned as new words: λέγω → εἶπον.'),
);
// --- stretch: third declension
push(
  mcq('d3.stem', 'third-decl', 'The genitive of φύλαξ (guard) is φύλακος. What is its stem?', [['φυλακ-', true], ['φυλαξ-', false, 'The ξ in the nominative hides κ + σ. The genitive shows the true stem.'], ['φυλ-', false, 'Take the genitive and remove -ος: φυλακ-.']], 'Third-declension rule: find the stem by removing -ος from the genitive. φύλαξ, φύλακα, φύλακος, φύλακι.'),
  mcq('d3.acc', 'third-decl', 'What is the accusative singular of **φύλαξ**?', [['φύλακα', true], ['φύλακον', false, '-ον is second declension. Third-declension accusatives end -α.'], ['φύλακος', false, 'φύλακος is the genitive.']], 'φύλαξ, φύλακα, φύλακος, φύλακι.'),
  mcq('d3.onoma', 'third-decl', 'ὄνομα (name) has genitive ὀνόματος. Which English words come from it?', [['onomatopoeia, synonym', true], ['onion, only, open', false, 'Those have nothing to do with ὄνομα.'], ['honour, honest, honorary', false, 'Those come from Latin honor.']], 'ἀν- (without) + ὄνομα = anonymous; ὀνοματοποιία = “name-making”.'),
  mcq('d3.aner', 'third-decl', 'What does **ὁ ἀνήρ** (genitive ἀνδρός) mean?', [['the man, or husband', true], ['the human being', false, 'That is ὁ ἄνθρωπος. ἀνήρ is a man, a husband.'], ['the star in the sky', false, 'A star is ἀστήρ.']], 'ἀνήρ, ἄνδρα, ἀνδρός, ἀνδρί: gives us Andrew and android (“man-like”).'),
  mcq('d3.polis', 'third-decl', 'What does **ἡ πόλις** mean, and which English words come from it?', [['the city: politics, police', true], ['the axis: polar, pole', false, 'Pole comes from a different Greek word, πόλος (axis).'], ['the war: polemic, polemical', false, 'Polemic comes from πόλεμος, war.']], 'πόλις, πόλιν, πόλεως, πόλει. μητρόπολις = “mother city”.'),
  mcq('d3.dat', 'third-decl', 'Which ending marks the dative singular in the third declension?', [['-ι (φύλακι)', true], ['-ῳ (λόγῳ)', false, '-ῳ is second declension.'], ['-ος (φύλακος)', false, '-ος is the third-declension genitive.']], 'Third declension singular: (nominative varies), -α, -ος, -ι.'),
);
// --- stretch: participles
push(
  mcq('pc.luon', 'participles', 'What does **ὁ λύων** mean?', [['the one who frees', true], ['the free man', false, 'λύων is a verb form (freeing), not the adjective “free”.'], ['he frees', false, 'He frees is λύει.']], 'A participle with the article = “the one who…”: ὁ λύων, ὁ γράφων, ὁ φεύγων.'),
  mcq('pc.while', 'participles', 'Best translation of **ὁ στρατηγὸς φεύγων τὸν ποταμὸν ὁρᾷ**?', [['While fleeing, the general sees the river', true], ['The general flees the river', false, 'φεύγων is a participle (fleeing); the main verb is ὁρᾷ, sees.'], ['The general sees the fleeing river', false, 'φεύγων agrees with ὁ στρατηγός (nominative), not with the river.']], 'A present participle often becomes “while…” or “as…” in English.'),
  mcq('pc.forms', 'participles', 'λύων, λύουσα, λῦον are the masculine, feminine and neuter of the present participle. Which goes with ἡ κόρη?', [['λύουσα', true], ['λύων', false, 'λύων is masculine.'], ['λῦον', false, 'λῦον is neuter.']], 'Participles agree like adjectives: ἡ κόρη ἡ λύουσα = the girl who is freeing.'),
  mcq('pc.lusas', 'participles', 'λύσας is the aorist participle of λύω. What does **ὁ Θησεὺς τοὺς φίλους λύσας φεύγει** mean?', [['Having freed his friends, Theseus flees', true], ['While freeing his friends, Theseus flees', false, 'The aorist participle usually means “having…” or “after…”.'], ['Theseus flees from his friends', false, 'λύσας (having freed) is the participle; φεύγει is the main verb.']], 'Aorist participle = an action completed before the main verb: “having freed”, “after freeing”.'),
);

export default [{ subject: 'greek', deck: 'y8', topics, items }];

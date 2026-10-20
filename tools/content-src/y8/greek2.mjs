// Year 8 Ancient Greek, vocabulary for the whole year: fourteen more sets (words-4 to words-17)
// taking her from the 43 headwords in greek.mjs to about 260, drawn from the kind of words on the
// GCSE defined vocabulary list. Nouns are given with their genitive and article, verbs with
// their aorist where it is irregular. Greek→English can be typed; English→Greek is always chosen.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `greek.${id}`, topic: `greek.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `greek.${id}`, topic: `greek.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const C = { formats: ['choice'] };

// [greek, english, English relatives, accepted English, note]
const WORDS_4 = [
  ['ἡ μήτηρ, τῆς μητρός', 'mother', 'metropolis (a “mother city”)', ['mum', 'mom']],
  ['ὁ πατήρ, τοῦ πατρός', 'father', 'patriarch, patriot', ['dad']],
  ['ἡ θυγάτηρ, τῆς θυγατρός', 'daughter', 'no common English word, but it is a distant cousin of “daughter”', []],
  ['ὁ υἱός, τοῦ υἱοῦ', 'son', 'no common English word', []],
  ['ἡ γυνή, τῆς γυναικός', 'woman, wife', 'gynaecology', ['woman', 'wife', 'lady']],
  ['ὁ ἀνήρ, τοῦ ἀνδρός', 'man, husband', 'android (“man-like”), polyandry', ['man', 'husband']],
  ['ὁ παῖς, τοῦ παιδός', 'child, boy', 'paediatrician (a children’s doctor), pedagogy', ['child', 'boy', 'son', 'girl', 'slave']],
  ['ὁ γέρων, τοῦ γέροντος', 'old man', 'gerontology (the study of old age)', ['elder']],
  ['ὁ νεανίας, τοῦ νεανίου', 'young man', 'no common English word', ['youth', 'young person']],
  ['ὁ βασιλεύς, τοῦ βασιλέως', 'king', 'basilica (a “royal” hall), basil (the royal herb)', ['ruler']],
  ['ὁ πολίτης, τοῦ πολίτου', 'citizen', 'politics, politician', []],
  ['ὁ ξένος, τοῦ ξένου', 'stranger, guest', 'xenophobia (fear of foreigners)', ['stranger', 'guest', 'foreigner', 'guest-friend', 'host']],
  ['ὁ ἐχθρός, τοῦ ἐχθροῦ', 'enemy', 'no common English word (a personal enemy; an enemy army is οἱ πολέμιοι)', ['foe', 'personal enemy']],
  ['ὁ διδάσκαλος, τοῦ διδασκάλου', 'teacher', 'didactic (meant to teach)', ['master', 'schoolmaster']],
  ['ὁ ἰατρός, τοῦ ἰατροῦ', 'doctor', 'psychiatry (healing of the mind), paediatrician', ['physician', 'healer']],
  ['ὁ ποιητής, τοῦ ποιητοῦ', 'poet', 'poet, poetry (a ποιητής is a “maker”)', ['maker', 'author']],
];
const WORDS_5 = [
  ['ἡ πόλις, τῆς πόλεως', 'city', 'politics, police, metropolis', ['city-state', 'town', 'state']],
  ['ὁ δῆμος, τοῦ δήμου', 'people', 'democracy (rule by the people), epidemic', ['the people', 'common people', 'deme', 'township']],
  ['ὁ στρατός, τοῦ στρατοῦ', 'army', 'strategy (from στρατηγός, the army’s leader)', ['host', 'camp']],
  ['ὁ στρατιώτης, τοῦ στρατιώτου', 'soldier', 'no common English word', ['warrior']],
  ['ἡ ναῦς, τῆς νεώς', 'ship', 'nautical, nausea (sea-sickness)', ['boat']],
  ['τὸ τεῖχος, τοῦ τείχους', 'wall', 'no common English word (city walls, not house walls)', ['walls', 'city wall', 'city walls', 'fortification']],
  ['ἡ ἀσπίς, τῆς ἀσπίδος', 'shield', 'no common English word', []],
  ['τὸ ὅπλον, τοῦ ὅπλου', 'weapon', 'hoplite (a heavily armed soldier)', ['arms', 'weapons', 'tool', 'armour']],
  ['ὁ ἱππεύς, τοῦ ἱππέως', 'horseman', 'related to ἵππος: hippodrome', ['cavalryman', 'rider', 'cavalry', 'knight']],
  ['ἡ εἰρήνη, τῆς εἰρήνης', 'peace', 'Irene (“peace”), irenic (peaceable)', []],
  ['ἡ ἀρχή, τῆς ἀρχῆς', 'beginning, rule', 'archaeology (the study of beginnings), monarchy', ['beginning', 'rule', 'start', 'empire', 'power', 'command', 'origin']],
  ['ὁ κίνδυνος, τοῦ κινδύνου', 'danger', 'no common English word', ['risk', 'peril']],
  ['ἡ βουλή, τῆς βουλῆς', 'council', 'no common English word (the Βουλή was Athens’ council of 500)', ['plan', 'advice', 'senate', 'will', 'decision']],
  ['ὁ ἄγγελος, τοῦ ἀγγέλου', 'messenger', 'angel (God’s messenger), evangelist (a bringer of good news)', ['angel', 'herald']],
  ['ἡ νῆσος, τῆς νήσου', 'island', 'Peloponnese (“Pelops’ island”), Polynesia (“many islands”)', ['isle']],
  ['ὁ λιμήν, τοῦ λιμένος', 'harbour', 'no common English word', ['port', 'harbor', 'haven']],
];
const WORDS_6 = [
  ['ἡ θάλασσα, τῆς θαλάσσης', 'sea', 'thalassotherapy (healing with sea water)', ['ocean']],
  ['ἡ ὁδός, τῆς ὁδοῦ', 'road, way', 'exodus (a way out), method, episode', ['road', 'way', 'journey', 'path', 'route', 'street']],
  ['ὁ ἄνεμος, τοῦ ἀνέμου', 'wind', 'anemometer (a wind-measurer), anemone (the “wind flower”)', ['breeze', 'gale']],
  ['τὸ ὕδωρ, τοῦ ὕδατος', 'water', 'hydrogen, hydrate, dehydrated', []],
  ['τὸ πῦρ, τοῦ πυρός', 'fire', 'pyrotechnics (fireworks), pyre', ['flame', 'flames']],
  ['ἡ γῆ, τῆς γῆς', 'earth, land', 'geography, geology', ['earth', 'land', 'ground', 'world', 'country', 'soil']],
  ['ὁ οὐρανός, τοῦ οὐρανοῦ', 'sky, heaven', 'Uranus (the god and planet of the sky)', ['sky', 'heaven', 'heavens']],
  ['ὁ ἀστήρ, τοῦ ἀστέρος', 'star', 'asterisk (“little star”), asteroid', []],
  ['τὸ ὄρος, τοῦ ὄρους', 'mountain', 'orogeny (mountain-building)', ['hill', 'mount']],
  ['ἡ ὕλη, τῆς ὕλης', 'forest, wood', 'no common English word (later it meant “matter”)', ['forest', 'wood', 'woods', 'timber', 'woodland']],
  ['ὁ λίθος, τοῦ λίθου', 'stone', 'lithograph, monolith, Neolithic (the New Stone Age)', ['rock']],
  ['ὁ χειμών, τοῦ χειμῶνος', 'storm, winter', 'no common English word', ['storm', 'winter', 'bad weather']],
  ['ἡ νύξ, τῆς νυκτός', 'night', 'nyctophobia (fear of the dark)', ['night-time']],
  ['ὁ ὕπνος, τοῦ ὕπνου', 'sleep', 'hypnosis', ['slumber']],
  ['πλέω', 'I sail', 'no common English word', ['sail', 'go by sea', 'I go by sea']],
  ['ἀφικνέομαι', 'I arrive', 'no common English word', ['arrive', 'reach', 'I reach', 'come', 'I come', 'arrive at', 'I arrive at'], 'It looks passive (-ομαι) but means something active. Aorist ἀφικόμην.'],
];
const WORDS_7 = [
  ['ὁ ναός, τοῦ ναοῦ', 'temple', 'no common English word', ['shrine']],
  ['ὁ ἱερεύς, τοῦ ἱερέως', 'priest', 'hierarchy (rule by priests, then any ranked order)', ['priestess']],
  ['ἱερός, ἱερά, ἱερόν', 'holy, sacred', 'hieroglyphics (“sacred carvings”)', ['holy', 'sacred', 'divine']],
  ['ὁ βωμός, τοῦ βωμοῦ', 'altar', 'no common English word', []],
  ['ἡ θυσία, τῆς θυσίας', 'sacrifice', 'no common English word', ['offering']],
  ['θύω', 'I sacrifice', 'no common English word', ['sacrifice', 'make a sacrifice', 'I make a sacrifice', 'offer sacrifice', 'I offer sacrifice']],
  ['τὸ μαντεῖον, τοῦ μαντείου', 'oracle', 'no common English word (a praying mantis is a “prophet”, μάντις)', ['shrine of an oracle', 'prophecy']],
  ['ὁ ἥρως, τοῦ ἥρωος', 'hero', 'hero, heroic', ['warrior', 'demigod']],
  ['τὸ τέρας, τοῦ τέρατος', 'monster, portent', 'no common English word', ['monster', 'portent', 'wonder', 'sign', 'omen', 'marvel']],
  ['ὁ θάνατος, τοῦ θανάτου', 'death', 'euthanasia (a “good death”)', []],
  ['ἀθάνατος, ἀθάνατον', 'immortal', 'Athanasius (“undying”), the opposite of θάνατος', ['deathless', 'undying', 'everlasting']],
  ['ἡ τέχνη, τῆς τέχνης', 'skill, art', 'technology, technique', ['skill', 'art', 'craft', 'trick', 'cunning', 'method']],
  ['ὁ δαίμων, τοῦ δαίμονος', 'spirit, god', 'demon (a spirit, later an evil one)', ['spirit', 'god', 'divinity', 'deity', 'fate']],
  ['εὔχομαι', 'I pray', 'no common English word', ['pray', 'pray to', 'I pray to', 'vow', 'I vow', 'boast', 'I boast'], 'Another verb that looks passive but is active in meaning.'],
  ['σῴζω', 'I save', 'no common English word, but a σωτήρ is a saviour', ['save', 'rescue', 'I rescue', 'keep safe', 'I keep safe', 'preserve', 'I preserve']],
  ['τιμάω', 'I honour', 'related to τιμή: timocracy', ['honour', 'honor', 'respect', 'I respect', 'value', 'I value']],
];
const WORDS_8 = [
  ['ἡ θύρα, τῆς θύρας', 'door', 'thyroid (shaped like a θυρεός, a door-shaped shield)', ['gate', 'doorway']],
  ['ἡ τράπεζα, τῆς τραπέζης', 'table', 'trapezium (a “little table”); in modern Greek it means a bank', ['bank', 'counter']],
  ['ὁ οἶνος, τοῦ οἴνου', 'wine', 'oenology (the study of wine)', []],
  ['ὁ σῖτος, τοῦ σίτου', 'grain', 'parasite (someone who eats beside you)', ['food', 'corn', 'bread', 'wheat', 'grain, food']],
  ['ἡ τροφή, τῆς τροφῆς', 'food, nourishment', 'atrophy (wasting away without nourishment)', ['food', 'nourishment', 'upbringing']],
  ['τὸ βιβλίον, τοῦ βιβλίου', 'book', 'Bible, bibliography', ['scroll']],
  ['τὸ χρῆμα, τοῦ χρήματος', 'thing; (plural) money', 'no common English word', ['thing', 'money', 'things', 'goods', 'property']],
  ['ὁ ἀγρός, τοῦ ἀγροῦ', 'field', 'a cousin of Latin ager, as in agriculture', ['farm', 'countryside', 'fields', 'country', 'land']],
  ['τὸ ζῷον, τοῦ ζῴου', 'animal', 'zoo, zoology', ['creature', 'living thing', 'beast']],
  ['ὁ βοῦς, τοῦ βοός', 'ox, cow', 'bucolic (from βουκόλος, a cowherd)', ['ox', 'cow', 'bull', 'cattle']],
  ['τὸ πρόβατον, τοῦ προβάτου', 'sheep', 'no common English word', ['flock']],
  ['ὁ κύων, τοῦ κυνός', 'dog', 'cynic (the Cynic philosophers were said to live like dogs)', ['hound']],
  ['ἐσθίω', 'I eat', 'oesophagus, from its aorist ἔφαγον', ['eat', 'devour', 'I devour'], 'Aorist ἔφαγον, “I ate”.'],
  ['πίνω', 'I drink', 'symposium (a drinking party, from συμπίνω, “drink together”)', ['drink'], 'Aorist ἔπιον, “I drank”.'],
  ['καθεύδω', 'I sleep', 'no common English word', ['sleep', 'am asleep', 'I am asleep', 'be asleep']],
  ['οἰκέω', 'I live (in)', 'ecumenical (to do with the whole inhabited world)', ['live', 'I live', 'live in', 'dwell', 'I dwell', 'inhabit', 'I inhabit']],
];
const WORDS_9 = [
  ['τὸ σῶμα, τοῦ σώματος', 'body', 'psychosomatic (mind and body), chromosome', ['corpse']],
  ['ἡ κεφαλή, τῆς κεφαλῆς', 'head', 'encephalitis, cephalopod (“head-foot”, like an octopus)', []],
  ['ἡ χείρ, τῆς χειρός', 'hand', 'chiropractor, surgery (χειρουργία, “hand-work”)', ['arm']],
  ['ὁ πούς, τοῦ ποδός', 'foot', 'podium, octopus, tripod', ['leg']],
  ['ὁ ὀφθαλμός, τοῦ ὀφθαλμοῦ', 'eye', 'ophthalmologist (an eye doctor)', []],
  ['ἡ καρδία, τῆς καρδίας', 'heart', 'cardiac, cardiology', []],
  ['τὸ αἷμα, τοῦ αἵματος', 'blood', 'haemoglobin, anaemia', []],
  ['ὁ φόβος, τοῦ φόβου', 'fear', 'phobia, arachnophobia', ['terror', 'panic', 'fright']],
  ['ἡ ὀργή, τῆς ὀργῆς', 'anger', 'no common English word', ['rage', 'wrath', 'temper', 'fury']],
  ['ἡ ἐλπίς, τῆς ἐλπίδος', 'hope', 'no common English word', ['expectation']],
  ['ἡ σοφία, τῆς σοφίας', 'wisdom', 'philosophy (“love of wisdom”), Sophie', ['skill', 'cleverness', 'knowledge']],
  ['ὁ νοῦς, τοῦ νοῦ', 'mind', 'paranoia, and “nous” (common sense)', ['sense', 'intelligence', 'intellect', 'reason', 'thought']],
  ['φιλέω', 'I love', 'philosophy, philanthropy', ['love', 'like', 'I like', 'kiss', 'I kiss', 'am fond of']],
  ['φοβέομαι', 'I fear', 'phobia', ['fear', 'am afraid', 'I am afraid', 'am afraid of', 'I am afraid of', 'be afraid'], 'The -ομαι ending: “I am frightened (by)”, so “I fear”.'],
  ['χαίρω', 'I rejoice', 'no common English word (χαῖρε, “rejoice!”, was how Greeks said hello)', ['rejoice', 'am happy', 'I am happy', 'am glad', 'I am glad', 'enjoy', 'I enjoy']],
  ['βλέπω', 'I look at', 'no common English word', ['look', 'look at', 'I look', 'see', 'I see', 'watch', 'I watch']],
];
const WORDS_10 = [
  ['λαμβάνω', 'I take', 'epilepsy (a “seizure”, from the same root)', ['take', 'capture', 'I capture', 'seize', 'I seize', 'receive', 'I receive', 'catch', 'I catch', 'get', 'I get'], 'Aorist ἔλαβον, “I took”.'],
  ['βάλλω', 'I throw', 'ballistics, problem (something “thrown forward”), symbol', ['throw', 'hit', 'I hit', 'pelt', 'I pelt', 'strike', 'I strike', 'shoot', 'I shoot'], 'Aorist ἔβαλον, “I threw”.'],
  ['ὁράω', 'I see', 'panorama (“seeing everything”)', ['see', 'behold', 'I behold', 'look at', 'notice', 'I notice'], 'Aorist εἶδον, “I saw”: a completely different stem.'],
  ['γιγνώσκω', 'I get to know', 'diagnosis, prognosis, agnostic', ['know', 'I know', 'get to know', 'learn', 'I learn', 'recognise', 'I recognise', 'realise', 'I realise', 'find out', 'I find out'], 'Aorist ἔγνων, “I knew, I realised”.'],
  ['μανθάνω', 'I learn', 'mathematics (“things learned”)', ['learn', 'understand', 'I understand', 'study', 'I study'], 'Aorist ἔμαθον, “I learned”.'],
  ['κελεύω', 'I order', 'no common English word', ['order', 'command', 'I command', 'tell', 'I tell', 'urge', 'I urge', 'bid', 'I bid']],
  ['ἀποκτείνω', 'I kill', 'no common English word', ['kill', 'slay', 'I slay', 'put to death', 'I put to death', 'murder', 'I murder'], 'Aorist ἀπέκτεινα, “I killed”.'],
  ['ἀποθνῄσκω', 'I die', 'euthanasia (from θάνατος, death)', ['die', 'am killed', 'I am killed', 'be killed', 'perish', 'I perish'], 'Aorist ἀπέθανον, “I died”. It is also used as the passive of ἀποκτείνω: “I am killed”.'],
  ['μάχομαι', 'I fight', 'logomachy (from μάχη, a battle of words)', ['fight', 'battle', 'I battle', 'fight with', 'I fight with', 'struggle'], 'Takes the dative: μάχεται τοῖς πολεμίοις, “he fights (with) the enemy”.'],
  ['νικάω', 'I win', 'Nike (from νίκη, victory)', ['win', 'defeat', 'I defeat', 'conquer', 'I conquer', 'beat', 'I beat', 'overcome', 'I overcome']],
  ['βοηθέω', 'I help', 'no common English word', ['help', 'assist', 'I assist', 'aid', 'I aid', 'come to help', 'I come to help', 'rescue'], 'Takes the dative: βοηθῶ τῷ φίλῳ, “I help my friend”.'],
  ['εὑρίσκω', 'I find', 'eureka (ηὕρηκα, “I have found it!”), heuristic', ['find', 'discover', 'I discover', 'find out', 'I find out'], 'Aorist ηὗρον, “I found”.'],
  ['λείπω', 'I leave', 'ellipsis (“a leaving out”)', ['leave', 'leave behind', 'I leave behind', 'abandon', 'I abandon', 'desert', 'I desert'], 'Aorist ἔλιπον, “I left”.'],
  ['πάσχω', 'I suffer', 'sympathy, pathos, apathy (from πάθος, suffering)', ['suffer', 'experience', 'I experience', 'undergo', 'I undergo', 'am treated', 'I am treated'], 'Aorist ἔπαθον, “I suffered”.'],
  ['πείθω', 'I persuade', 'no common English word', ['persuade', 'convince', 'I convince', 'win over', 'I win over']],
  ['βαίνω', 'I go', 'acrobat (one who “walks on tiptoe”), basis', ['go', 'walk', 'I walk', 'step', 'I step', 'come', 'I come', 'march', 'I march']],
];
const WORDS_11 = [
  ['ἔρχομαι', 'I come, go', 'no common English word', ['come', 'go', 'I come', 'I go', 'travel', 'I travel'], 'Aorist ἦλθον, “I came, I went”.'],
  ['φημί', 'I say, claim', 'prophet (one who speaks for a god), euphemism', ['say', 'claim', 'I claim', 'I say', 'affirm', 'I affirm', 'state', 'I state'], 'φημί is irregular: φημί, φῄς, φησί(ν)…'],
  ['καλέω', 'I call', 'ecclesiastical (from ἐκκλησία, the assembly “called out”)', ['call', 'summon', 'I summon', 'invite', 'I invite', 'name', 'I name']],
  ['ποιέω', 'I make, do', 'poem, poet (a ποιητής is a “maker”)', ['make', 'do', 'I make', 'I do', 'create', 'I create', 'produce', 'I produce']],
  ['ζητέω', 'I seek', 'no common English word', ['seek', 'look for', 'I look for', 'search for', 'I search for', 'search', 'I search']],
  ['αἱρέω', 'I capture', 'heresy (from αἵρεσις, a “choosing”)', ['capture', 'seize', 'I seize', 'take', 'I take', 'catch', 'I catch', 'convict', 'I convict'], 'Aorist εἷλον, “I captured”. In the middle (αἱρέομαι) it means “I choose”.'],
  ['ἀποκρίνομαι', 'I answer', 'no common English word', ['answer', 'reply', 'I reply', 'respond', 'I respond']],
  ['ἐρωτάω', 'I ask', 'no common English word', ['ask', 'question', 'I question', 'ask a question', 'I ask a question', 'enquire', 'I enquire', 'inquire']],
  ['γίγνομαι', 'I become', 'genesis, genetics', ['become', 'happen', 'I happen', 'am born', 'I am born', 'come into being', 'I come into being', 'occur'], 'Aorist ἐγενόμην, “I became”. Medusa’s victims λίθοι γίγνονται: “become stones”.'],
  ['δίδωμι', 'I give', 'dose, antidote (something “given against”)', ['give', 'offer', 'I offer', 'grant', 'I grant', 'present', 'I present'], 'Aorist ἔδωκα, “I gave”. Ariadne λίνον δίδωσιν: “gives a thread”.'],
  ['τρέχω', 'I run', 'hippodrome, dromedary, palindrome (from its aorist stem δραμ-)', ['run', 'race', 'I race', 'rush', 'I rush'], 'Aorist ἔδραμον, “I ran”.'],
  ['ἀναγκάζω', 'I force', 'no common English word (from ἀνάγκη, necessity)', ['force', 'compel', 'I compel', 'make', 'I make', 'oblige', 'I oblige']],
  ['ἄρχω', 'I rule, begin', 'monarch, anarchy', ['rule', 'begin', 'I rule', 'I begin', 'command', 'I command', 'govern', 'I govern', 'lead', 'I lead', 'start', 'I start'], 'Takes the genitive: ἄρχει τῆς χώρας, “he rules the land”.'],
  ['δέχομαι', 'I receive', 'no common English word', ['receive', 'accept', 'I accept', 'welcome', 'I welcome', 'take', 'I take']],
  ['βούλομαι', 'I want', 'no common English word', ['want', 'wish', 'I wish', 'prefer', 'I prefer', 'would like', 'I would like', 'desire']],
  ['ὀργίζομαι', 'I grow angry', 'related to ὀργή, anger', ['am angry', 'I am angry', 'grow angry', 'get angry', 'I get angry', 'become angry', 'I become angry', 'be angry', 'am angry with', 'I am angry with']],
];
const WORDS_12 = [
  ['μέγας, μεγάλη, μέγα', 'big, great', 'megaphone, megalith', ['big', 'great', 'large', 'tall', 'mighty', 'huge', 'loud']],
  ['πολύς, πολλή, πολύ', 'much; (plural) many', 'polygon, polytechnic', ['much', 'many', 'a lot of', 'lots of', 'a lot']],
  ['ἄλλος, ἄλλη, ἄλλο', 'other, another', 'allergy (a “different” reaction), allegory', ['other', 'another', 'else', 'different']],
  ['πᾶς, πᾶσα, πᾶν', 'all, every', 'pandemic (affecting all the people), panorama, pantheon', ['all', 'every', 'whole', 'each', 'all of', 'the whole']],
  ['ὀλίγος, ὀλίγη, ὀλίγον', 'few, little', 'oligarchy (rule by the few)', ['few', 'little', 'a few', 'small']],
  ['πολέμιος, πολεμία, πολέμιον', 'hostile, enemy', 'related to πόλεμος, war (οἱ πολέμιοι = the enemy)', ['hostile', 'enemy', 'of the enemy', 'warlike']],
  ['ἐλεύθερος, ἐλευθέρα, ἐλεύθερον', 'free', 'no common English word (Eleftheria, “freedom”, is still a Greek name)', ['independent', 'free (not a slave)']],
  ['φίλιος, φιλία, φίλιον', 'friendly', 'related to φίλος: Philadelphia', ['allied', 'kind', 'of a friend']],
  ['αἰσχρός, αἰσχρά, αἰσχρόν', 'shameful, ugly', 'no common English word', ['shameful', 'ugly', 'disgraceful', 'base']],
  ['ῥᾴδιος, ῥᾳδία, ῥᾴδιον', 'easy', 'no common English word', ['simple']],
  ['ταχύς, ταχεῖα, ταχύ', 'quick, fast', 'tachometer (it measures how fast an engine turns)', ['quick', 'fast', 'swift', 'rapid', 'speedy']],
  ['βαρύς, βαρεῖα, βαρύ', 'heavy', 'barometer, baritone (a “heavy”, deep voice)', ['weighty', 'severe', 'deep', 'grievous']],
  ['ἄξιος, ἀξία, ἄξιον', 'worthy', 'axiom (something thought worthy of belief)', ['deserving', 'worth', 'worthwhile']],
  ['ὑψηλός, ὑψηλή, ὑψηλόν', 'high, tall', 'no common English word', ['high', 'tall', 'lofty']],
  ['ἡδύς, ἡδεῖα, ἡδύ', 'sweet, pleasant', 'hedonism (from ἡδονή, pleasure)', ['sweet', 'pleasant', 'pleasing', 'delightful']],
  ['ἄριστος, ἀρίστη, ἄριστον', 'best', 'aristocracy (rule by the best)', ['the best', 'very good', 'excellent', 'noblest', 'bravest'], 'It is the superlative of ἀγαθός (good).'],
];
const WORDS_13 = [
  ['ἐγώ', 'I', 'ego (the same word in Latin)', ['me', 'myself']],
  ['σύ', 'you (singular)', 'no common English word', ['you', 'thou', 'you singular']],
  ['ἡμεῖς', 'we', 'no common English word', ['us']],
  ['ὑμεῖς', 'you (plural)', 'no common English word', ['you', 'you all', 'ye', 'you plural']],
  ['αὐτός, αὐτή, αὐτό', 'self; him, her, it', 'automatic, autograph', ['self', 'him', 'her', 'it', 'himself', 'herself', 'itself', 'them', 'same', 'the same'], 'First in its phrase it means “self” (αὐτὸς ὁ βασιλεύς, “the king himself”); after the article “same” (ὁ αὐτός); on its own “him, her, it”.'],
  ['οὗτος, αὕτη, τοῦτο', 'this', 'no common English word', ['these', 'this man', 'this woman', 'this thing', 'he', 'she']],
  ['ἐκεῖνος, ἐκείνη, ἐκεῖνο', 'that', 'no common English word', ['those', 'that man', 'that woman', 'that thing']],
  ['τίς; τί;', 'who? what?', 'no common English word', ['who', 'what', 'which', 'who?', 'what?', 'who what']],
  ['τις, τι', 'someone, something', 'no common English word', ['someone', 'something', 'anyone', 'anything', 'a certain', 'some', 'somebody', 'a certain man']],
  ['ποῦ;', 'where?', 'no common English word', ['where', 'where is']],
  ['πόθεν;', 'where from?', 'no common English word', ['from where', 'whence', 'where from', 'from where?']],
  ['ποῖ;', 'where to?', 'no common English word', ['where to', 'whither', 'to where', 'to where?']],
  ['πότε;', 'when?', 'no common English word', ['when']],
  ['πῶς;', 'how?', 'no common English word', ['how', 'in what way']],
  ['διὰ τί;', 'why?', 'no common English word (literally “because of what?”)', ['why', 'because of what', 'for what reason']],
  ['ὅς, ἥ, ὅ', 'who, which', 'no common English word', ['who', 'which', 'that', 'whom', 'who (relative)']],
];
const WORDS_14 = [
  ['εἷς, μία, ἕν', 'one', 'hyphen (from ὑφ’ ἕν, “under one”)', ['1']],
  ['δύο', 'two', 'dyad (a pair); duo is the Latin cousin', ['2']],
  ['τρεῖς, τρία', 'three', 'trilogy, tripod', ['3']],
  ['τέτταρες, τέτταρα', 'four', 'tetrahedron, tetrapod', ['4']],
  ['πέντε', 'five', 'pentagon, pentathlon', ['5']],
  ['ἕξ', 'six', 'hexagon', ['6']],
  ['ἑπτά', 'seven', 'heptathlon, heptagon', ['7']],
  ['ὀκτώ', 'eight', 'octopus, octagon', ['8']],
  ['ἐννέα', 'nine', 'ennead (a group of nine)', ['9']],
  ['δέκα', 'ten', 'decade, decathlon', ['10']],
  ['πρῶτος, πρώτη, πρῶτον', 'first', 'prototype, protagonist, proton', ['1st']],
  ['δεύτερος, δευτέρα, δεύτερον', 'second', 'Deuteronomy (“the second law”)', ['2nd', 'next']],
  ['τρίτος, τρίτη, τρίτον', 'third', 'no common English word', ['3rd']],
  ['ἑκατόν', 'a hundred', 'hectare, hectolitre', ['hundred', 'one hundred', '100']],
  ['χίλιοι, χίλιαι, χίλια', 'a thousand', 'kilogram, kilometre', ['thousand', 'one thousand', '1000']],
];
const WORDS_15 = [
  ['νῦν', 'now', 'no common English word', ['at present', 'currently', 'at the moment']],
  ['ἤδη', 'already', 'no common English word', ['by now', 'now']],
  ['ἔτι', 'still', 'no common English word', ['yet', 'any longer', 'still yet']],
  ['αὖθις', 'again', 'no common English word', ['once more', 'back again', 'afterwards']],
  ['ἀεί', 'always', 'no common English word', ['forever', 'ever', 'for ever', 'continually']],
  ['τότε', 'then, at that time', 'no common English word', ['then', 'at that time', 'at that point']],
  ['ἔπειτα', 'next, afterwards', 'no common English word', ['next', 'afterwards', 'then', 'after that', 'later']],
  ['εὐθύς', 'immediately', 'no common English word', ['at once', 'straight away', 'straightaway', 'directly', 'right away']],
  ['μόλις', 'with difficulty', 'no common English word', ['scarcely', 'hardly', 'barely', 'only just']],
  ['μάλα', 'very', 'no common English word', ['very much', 'greatly', 'exceedingly', 'much', 'really']],
  ['οὕτω(ς)', 'in this way, so', 'no common English word', ['thus', 'so', 'in this way', 'like this', 'in such a way']],
  ['ὅμως', 'nevertheless', 'no common English word', ['however', 'yet', 'but still', 'all the same', 'still', 'even so']],
  ['ἐνθάδε', 'here', 'no common English word', ['there', 'hither', 'to here', 'to this place', 'in this place']],
  ['ὁ ἐνιαυτός, τοῦ ἐνιαυτοῦ', 'year', 'no common English word', ['twelvemonth']],
  ['ἡ ἑσπέρα, τῆς ἑσπέρας', 'evening', 'the Hesperides, nymphs of the evening (the far west)', ['dusk', 'west']],
];
const WORDS_16 = [
  ['ὑπό', 'under; (+ genitive) by', 'hypodermic (under the skin), hypothesis', ['under', 'by', 'beneath', 'below']],
  ['παρά', 'beside, from, to', 'parallel, paradox', ['beside', 'from', 'to', 'alongside', 'along', 'near', 'contrary to']],
  ['ἐπί', 'on, against', 'epidemic (“upon the people”), epitaph', ['on', 'upon', 'against', 'onto', 'at', 'over', 'to']],
  ['κατά', 'down; according to', 'catastrophe (a “down-turning”), catalogue', ['down', 'according to', 'down from', 'throughout', 'along', 'by']],
  ['περί', 'about, around', 'perimeter, periscope', ['about', 'around', 'concerning', 'round', 'near']],
  ['ὑπέρ', 'on behalf of, over', 'hyperactive, hyperbole', ['over', 'above', 'beyond', 'for', 'on behalf of']],
  ['πρό', 'before, in front of', 'prologue, programme', ['before', 'in front of', 'ahead of', 'instead of']],
  ['σύν', 'with', 'synthesis, symphony, sympathy (σύν becomes συμ- before π, φ, β, μ)', ['together with', 'along with']],
  ['ἀντί', 'instead of', 'antidote, antithesis', ['in place of', 'against', 'in return for', 'opposite']],
  ['ἐπεί', 'since, when', 'no common English word', ['since', 'when', 'because', 'after']],
  ['ὅτι', 'that, because', 'no common English word', ['that', 'because']],
  ['εἰ', 'if', 'no common English word', ['whether']],
  ['ὡς', 'as, how', 'no common English word', ['as', 'how', 'like', 'when', 'since', 'that', 'so that']],
  ['τε … καί', 'both … and', 'no common English word', ['both and', 'both...and', 'both … and', 'and']],
  ['οὐδέ', 'and not, not even', 'no common English word', ['not even', 'nor', 'and not', 'neither']],
  ['μή', 'not (in commands)', 'no common English word', ['not', 'don’t', "don't", 'do not', 'lest'], 'οὐ says a fact is not true; μή is used for commands, wishes and “if”: μὴ φεῦγε, “don’t run away”.'],
];
const WORDS_17 = [
  ['ὁ φύλαξ, τοῦ φύλακος', 'guard', 'phylactery (a protective charm)', ['guardian', 'sentry', 'watchman', 'guards']],
  ['τὸ ὄνομα, τοῦ ὀνόματος', 'name', 'anonymous, synonym, onomatopoeia', []],
  ['ὁ ῥήτωρ, τοῦ ῥήτορος', 'speaker', 'rhetoric', ['orator', 'public speaker', 'politician']],
  ['ὁ ποιμήν, τοῦ ποιμένος', 'shepherd', 'no common English word', ['herdsman']],
  ['ἡ φύσις, τῆς φύσεως', 'nature', 'physics, physical', ['character', 'natural order', 'growth']],
  ['ὁ ἀγών, τοῦ ἀγῶνος', 'contest, struggle', 'agony, antagonist, protagonist', ['contest', 'struggle', 'competition', 'trial', 'games', 'fight']],
  ['τὸ γένος, τοῦ γένους', 'race, family', 'genealogy, and its Latin cousin genus', ['race', 'family', 'kind', 'birth', 'descent', 'clan', 'type']],
  ['τὸ κράτος, τοῦ κράτους', 'power', 'democracy, aristocracy', ['might', 'strength', 'rule', 'force', 'control']],
  ['τὸ τέλος, τοῦ τέλους', 'end', 'teleology (the study of purposes)', ['goal', 'purpose', 'completion', 'finish', 'result', 'aim']],
  ['ἡ ἀρετή, τῆς ἀρετῆς', 'courage, excellence', 'no common English word', ['courage', 'excellence', 'virtue', 'goodness', 'bravery']],
  ['ἡ δόξα, τῆς δόξης', 'glory, opinion', 'orthodox (“right opinion”), paradox, doxology', ['glory', 'opinion', 'fame', 'reputation', 'belief']],
  ['ὁ τρόπος, τοῦ τρόπου', 'way, manner', 'tropic (where the Sun “turns”), trophy', ['way', 'manner', 'method', 'fashion', 'character']],
  ['ὁ χρυσός, τοῦ χρυσοῦ', 'gold', 'chrysanthemum (the “golden flower”)', []],
  ['ὁ ἄργυρος, τοῦ ἀργύρου', 'silver', 'no common English word (Latin argentum, the Ag in chemistry, is a cousin)', ['money']],
  ['ἡ φυγή, τῆς φυγῆς', 'flight, escape', 'related to φεύγω', ['flight', 'escape', 'exile', 'running away', 'fleeing']],
  ['ἡ γνώμη, τῆς γνώμης', 'opinion, judgement', 'gnomic (full of wise sayings)', ['opinion', 'judgement', 'judgment', 'view', 'mind', 'intention', 'plan', 'purpose']],
];

const SETS = [
  ['words-4', 'Words 4: family and people', 'Sixteen people words. Several are third declension: the genitive (μητρός, ἀνδρός, παιδός) shows the stem. Learn each noun with its article and genitive, the way a dictionary gives it.', 'Teach the words for mother, father, son and daughter, with their genitives.', 'Ask {her} the Greek for “child” and which English word for a doctor comes from it.', WORDS_4],
  ['words-5', 'Words 5: the city and war', 'The words of Athens at war and at peace: city, people, army, ships, walls, council. Democracy is hiding in here.', 'Explain which two Greek words make “democracy”, and what each means.', 'Ask {her} what a hoplite carried.', WORDS_5],
  ['words-6', 'Words 6: sea, sky and land', 'Odysseus’ world: sea, wind, stars, mountains, islands and storms, plus two verbs for a sea voyage.', 'Explain why ἀφικνέομαι looks passive but is not.', 'Ask {her} which gas is named after the Greek for water.', WORDS_6],
  ['words-7', 'Words 7: gods, temples and heroes', 'Religion ran through Greek life: temples, priests, altars, sacrifices and oracles. And the heroes, half-way between gods and mortals.', 'Explain the difference between θάνατος and ἀθάνατος.', 'Ask {her} what the Oracle at Delphi was, and the Greek word for an oracle.', WORDS_7],
  ['words-8', 'Words 8: home, food and animals', 'Everyday life: doors and tables, bread and wine, cows, sheep and dogs, and the verbs for eating, drinking and sleeping.', 'Explain how the Greek for “dog” gave us the word “cynical”.', 'At dinner, ask {her} the Greek for wine, bread and drink.', WORDS_8],
  ['words-9', 'Words 9: body, mind and feelings', 'Body parts (doctors still use them), and the feelings that drive every myth: fear, anger, hope and love.', 'Pick three medical words and explain the Greek inside each.', 'Ask {her} what an ophthalmologist and a cardiologist look after.', WORDS_9],
  ['words-10', 'Words 10: verbs of action', 'Sixteen verbs that do the work in every story. Many have a strong aorist with a different stem (λαμβάνω → ἔλαβον): learn the two together.', 'Teach four verbs with their aorists.', 'Ask {her} what “eureka” means and who said it.', WORDS_10],
  ['words-11', 'Words 11: more verbs', 'Coming and going, asking and answering, giving and receiving. Watch for the verbs ending -ομαι that are active in meaning.', 'Explain the difference between ἐρωτάω and ἀποκρίνομαι.', 'Ask {her} the Greek for “I give” and which English medical word comes from it.', WORDS_11],
  ['words-12', 'Words 12: adjectives', 'Sixteen describing words: big and small, many and few, easy and heavy. μέγας and πολύς are a little irregular, but you will meet them everywhere.', 'Explain how “oligarchy” and “aristocracy” are built.', 'Ask {her} which English instruments come from βαρύς and ταχύς.', WORDS_12],
  ['words-13', 'Words 13: pronouns and questions', 'The small words that hold sentences together: I, you, we, this, that, who, what, where, when, how and why. Note the question mark ; at the end.', 'Explain the difference between τίς; and τις.', 'Ask {her} questions in Greek: ποῦ; πότε; πῶς;', WORDS_13],
  ['words-14', 'Words 14: numbers', 'Count to ten, then first, second, third, a hundred and a thousand. You already know most of them from maths and sport.', 'Count to ten in Greek and give an English word for each number.', 'Ask {her} what the Greek numbers are inside “decathlon” and “heptathlon”.', WORDS_14],
  ['words-15', 'Words 15: time and adverbs', 'Words for when and how: now, already, always, immediately, again. They are short, they never change their endings, and they are in almost every sentence.', 'Explain the difference between τότε and ἔπειτα.', 'Ask {her} to say “now”, “always” and “immediately” in Greek.', WORDS_15],
  ['words-16', 'Words 16: more prepositions and joining words', 'Nine more prepositions (each with its cases) and the conjunctions that join clauses: since, that, if, as, both… and.', 'Explain the difference between οὐ and μή.', 'Ask {her} to find a Greek preposition hiding in “hypodermic”, “perimeter” and “synthesis”.', WORDS_16],
  ['words-17', 'Words 17: big ideas and third-declension nouns', 'Nature, glory, excellence, contest and judgement: the ideas Greeks argued about. Many are third declension, so learn the genitive with the word.', 'Explain what ἀρετή means and why it is hard to translate with one English word.', 'Ask {her} how “protagonist” and “antagonist” come from ἀγών.', WORDS_17],
];

// “which English word comes from…”: [set, greek, meaning, right, wrong (real, unrelated words)]
const DERIV = [
  ['words-4', 'ἡ γυνή', 'woman', 'gynaecology', ['gymnasium', 'geography', 'genealogy']],
  ['words-4', 'ὁ γέρων', 'old man', 'gerontology', ['geranium', 'germinate', 'generous']],
  ['words-4', 'ὁ ξένος', 'stranger, foreigner', 'xenophobia', ['xylophone', 'zenith', 'saxophone']],
  ['words-5', 'ὁ δῆμος', 'people', 'democracy', ['demolish', 'demonstrate', 'diamond']],
  ['words-5', 'ἡ ναῦς', 'ship', 'nausea', ['nature', 'nasal', 'naughty']],
  ['words-5', 'τὸ ὅπλον', 'weapon', 'hoplite', ['hospital', 'hopeful', 'hippopotamus']],
  ['words-6', 'τὸ ὕδωρ', 'water', 'hydrogen', ['hyena', 'hymn', 'hybrid']],
  ['words-6', 'τὸ πῦρ', 'fire', 'pyrotechnics', ['pyramid', 'pirate', 'pure']],
  ['words-6', 'ὁ λίθος', 'stone', 'monolith', ['monologue', 'lithe', 'monopoly']],
  ['words-7', 'ἱερός', 'holy', 'hieroglyphics', ['heron', 'hero', 'hearing']],
  ['words-7', 'ἡ τέχνη', 'skill, art', 'technology', ['teacher', 'telephone', 'tectonic']],
  ['words-8', 'τὸ βιβλίον', 'book', 'bibliography', ['biology', 'bicycle', 'bilingual']],
  ['words-8', 'τὸ ζῷον', 'animal', 'zoology', ['zodiac', 'zone', 'zero']],
  ['words-8', 'ὁ κύων', 'dog', 'cynical', ['cylinder', 'cyclone', 'cymbal']],
  ['words-9', 'ὁ ὀφθαλμός', 'eye', 'ophthalmologist', ['optimist', 'orthodontist', 'octagon']],
  ['words-9', 'ἡ καρδία', 'heart', 'cardiology', ['cardigan', 'cardinal', 'cartography']],
  ['words-9', 'ἡ χείρ', 'hand', 'chiropractor', ['chirp', 'chorus', 'cherub']],
  ['words-10', 'μανθάνω', 'I learn', 'mathematics', ['marathon', 'manager', 'mattress']],
  ['words-10', 'πάσχω', 'I suffer', 'sympathy', ['passage', 'pasta', 'pastry']],
  ['words-11', 'γίγνομαι', 'I become, am born', 'genesis', ['gigantic', 'gymnast', 'jigsaw']],
  ['words-11', 'δίδωμι', 'I give', 'antidote', ['anecdote', 'antelope', 'antenna']],
  ['words-12', 'μέγας', 'big, great', 'megaphone', ['melody', 'metaphor', 'meadow']],
  ['words-12', 'ταχύς', 'fast', 'tachometer', ['taxi', 'tactic', 'tack']],
  ['words-12', 'ὀλίγος', 'few', 'oligarchy', ['olive', 'Olympics', 'ointment']],
  ['words-14', 'πέντε', 'five', 'pentathlon', ['penguin', 'pencil', 'penalty']],
  ['words-14', 'χίλιοι', 'a thousand', 'kilometre', ['kilt', 'chilli', 'kiln']],
  ['words-14', 'ἑκατόν', 'a hundred', 'hectare', ['hectic', 'hexagon', 'heckle']],
  ['words-16', 'περί', 'around', 'perimeter', ['peril', 'perfume', 'perch']],
  ['words-16', 'ὑπέρ', 'over, beyond', 'hyperbole', ['hippo', 'hiccup', 'hypnosis']],
  ['words-17', 'ὁ ἀγών', 'contest, struggle', 'antagonist', ['agenda', 'agile', 'agriculture']],
  ['words-17', 'ἡ φύσις', 'nature', 'physics', ['fizzy', 'fissure', 'fist']],
  ['words-17', 'ὁ χρυσός', 'gold', 'chrysanthemum', ['Christmas', 'crystal', 'chrome']],
];

const topics = SETS.map(([id, title, intro, teach, talk], i) => ({ id: `greek.${id}`, title, kind: 'facts', prereqs: [i === 0 ? 'greek.words-3' : `greek.${SETS[i - 1][0]}`], batch: 6, intro, teach, talk }));
topics.push(
  { id: 'greek.words-review-1', title: 'Vocabulary review: words 1 to 10', kind: 'facts', prereqs: ['greek.words-10'], batch: 5, intro: 'Mixed practice from the first ten sets: odd ones out, word families and words that are easy to confuse.', teach: 'Explain how λόγος, λέγω and “dialogue” are related.', talk: 'Ask {her} to name five Greek words for people.' },
  { id: 'greek.words-review-2', title: 'Vocabulary review: words 11 to 17', kind: 'facts', prereqs: ['greek.words-17', 'greek.words-review-1'], batch: 5, intro: 'Mixed practice from the later sets. By now you know about 250 Greek words: enough to read simple stories with only a few glossary notes.', teach: 'Pick a Greek word family and teach every member you know.', talk: 'Ask {her} for the Greek numbers one to five and a question word.' },
);

const items = [];
const push = (...xs) => items.push(...xs);

// same pattern as the vocabulary in greek.mjs: Greek→English (typed or chosen), English→Greek (chosen)
SETS.forEach(([topic, , , , , list]) => {
  const prefix = `v${topic.split('-')[1]}`;
  list.forEach(([gr, en, deriv, accept, note], i) => {
    const others = list.filter((w) => w[0] !== gr);
    const wrongEn = [others[(i + 1) % others.length][1], others[(i + 4) % others.length][1], others[(i + 7) % others.length][1]];
    const wrongGr = [others[(i + 2) % others.length][0], others[(i + 5) % others.length][0], others[(i + 8) % others.length][0]];
    const isVerb = en.startsWith('I ');
    const plain = en.split(/[,;(]/)[0].trim();
    const extraAccept = isVerb || en === 'I' ? [] : [`a ${plain}`, `the ${plain}`];
    push(fact(`${prefix}.${i + 1}`, topic, `What does **${gr}** mean?`, en, wrongEn, `${gr} = ${en}. English relatives: ${deriv}.${note ? ' ' + note : ''}`, { accept: [...accept, ...extraAccept], learn: `**${gr}** = ${en}\n_${deriv}_${note ? '\n' + note : ''}` }));
    push(fact(`${prefix}.en.${i + 1}`, topic, `Which is the Greek for **${en}**?`, gr, wrongGr, `${en} = ${gr}.`, C));
  });
});
DERIV.forEach(([topic, gr, meaning, right, wrongs], i) => push(fact(`vd.${i + 1}`, topic, `**${gr}** means “${meaning}”. Which English word comes from it?`, right, wrongs, `${gr} (${meaning}) → ${right}.`, C)));

// grammar notes that belong with the vocabulary
push(
  mcq('v4.gen', 'words-4', 'Why do Greek dictionaries give a noun’s genitive, as in ἡ μήτηρ, τῆς μητρός?', [['The genitive shows the stem you add the other endings to', true], ['Because the genitive is the most common case', false, 'It is given because it shows the stem (μητρ-), which the nominative can hide.'], ['To show the noun is feminine', false, 'The article (ἡ) shows the gender; the genitive shows the stem.']], 'μήτηρ hides the stem μητρ-; the genitive μητρός shows it.'),
  mcq('v4.paides', 'words-4', 'What does **οἱ παῖδες** mean?', [['the children', true], ['the child', false, 'οἱ is plural, and so is the ending -ες.'], ['the fathers', false, 'Fathers would be οἱ πατέρες.']], 'παῖς, παιδός: plural παῖδες, “children”.'),
  mcq('v5.naus', 'words-5', 'ἡ ναῦς (ship) is irregular. Which form means “the ships” (subject)?', [['αἱ νῆες', true], ['οἱ ναῦται', false, 'ναῦται are sailors.'], ['οἱ ναοί', false, 'ναοί are temples.']], 'ναῦς, νεώς, νηΐ, ναῦν; plural νῆες. Easy to confuse with ναός (temple) and ναύτης (sailor).'),
  mcq('v5.polis', 'words-5', 'What is the genitive of **ἡ πόλις**?', [['τῆς πόλεως', true], ['τῆς πόλιδος', false, 'πόλις has an unusual genitive: πόλεως.'], ['τοῦ πόλου', false, 'πόλις is feminine and third declension.']], 'πόλις, πόλεως: an unusual genitive, with the accent still on the first syllable.'),
  mcq('v7.athanatos', 'words-7', 'Why does ἀθάνατος have only two sets of endings (ἀθάνατος, ἀθάνατον), not three?', [['Compound adjectives like this use the masculine form for the feminine too', true], ['It is a noun, not an adjective', false, 'It is an adjective: αἱ ἀθάνατοι θεαί, the immortal goddesses.'], ['Gods have no gender', false, 'They do: it is about how the adjective is built (ἀ- + θάνατος).']], 'ἀ- (not) + θάνατος (death): compound adjectives usually have two endings, so ἡ ἀθάνατος θεά.'),
  mcq('v10.aorist', 'words-10', 'Which is the aorist of λαμβάνω (I take)?', [['ἔλαβον', true], ['ἐλάμβανον', false, 'That is the imperfect: “I was taking”.'], ['λήψομαι', false, 'That is the future: “I will take”.']], 'Strong aorist: a short stem λαβ- with the augment: ἔλαβον.'),
  mcq('v10.dative', 'words-10', 'Which case follows βοηθέω (I help) and μάχομαι (I fight)?', [['the dative', true], ['the accusative', false, 'Most verbs take the accusative, but these two take the dative.'], ['the genitive', false, 'ἄρχω (I rule) takes the genitive; these take the dative.']], 'βοηθῶ τοῖς φίλοις, “I help my friends”; μάχονται τοῖς πολεμίοις, “they fight the enemy”.'),
  mcq('v11.middle', 'words-11', 'ἀποκρίνομαι, δέχομαι, βούλομαι and γίγνομαι all end -ομαι. What does that ending show in these verbs?', [['They are deponent: middle endings with an active meaning', true], ['They are always in the future', false, 'They are present tense: “I answer”, “I receive”.'], ['They are plural', false, '-ομαι is “I”, first person singular.']], 'Deponent verbs have middle endings (-ομαι, -ῃ, -εται…) but active meanings.'),
  mcq('v12.megas', 'words-12', 'Which phrase means “the great city”?', [['ἡ μεγάλη πόλις', true], ['ὁ μέγας πόλις', false, 'πόλις is feminine, so the article and adjective must be feminine.'], ['ἡ μέγα πόλις', false, 'μέγα is the neuter.']], 'πόλις is feminine: ἡ μεγάλη πόλις.'),
  mcq('v13.autos', 'words-13', 'What does **αὐτὸς ὁ βασιλεύς** mean?', [['the king himself', true], ['the same king', false, 'The same king is ὁ αὐτὸς βασιλεύς, with αὐτός after the article.'], ['him, the king', false, 'Outside the article phrase, αὐτός means “self”.']], 'Position matters: αὐτὸς ὁ βασιλεύς = the king himself; ὁ αὐτὸς βασιλεύς = the same king.'),
  mcq('v13.tis', 'words-13', 'τίς (with an accent, in a question) means “who?”. What does τις (no accent, after a word) mean?', [['someone, a certain', true], ['who? as well', false, 'Without the accent it is the indefinite: “someone”.'], ['nobody', false, 'Nobody is οὐδείς.']], 'τίς ἐστιν; = who is it? ἄνθρωπός τις = a certain man, someone.'),
  mcq('v14.one', 'words-14', 'Which form of “one” goes with ἡ ναῦς (a feminine noun)?', [['μία', true], ['εἷς', false, 'εἷς is masculine.'], ['ἕν', false, 'ἕν is neuter.']], 'εἷς, μία, ἕν: μία ναῦς, one ship.'),
  mcq('v16.oume', 'words-16', 'Which sentence uses μή correctly?', [['μὴ φεῦγε. (Don’t run away.)', true], ['ὁ δοῦλος μὴ φεύγει. (The slave does not run away.)', false, 'A plain statement of fact uses οὐ: ὁ δοῦλος οὐ φεύγει.'], ['μή ἐστι σοφός. (He is not wise.)', false, 'A statement of fact uses οὐ: οὐκ ἔστι σοφός.']], 'οὐ denies facts; μή is for commands, wishes, “if” clauses and purposes.'),
  mcq('v16.sun', 'words-16', 'Why is it **symphony** but **synthesis**?', [['σύν becomes συμ- before φ, π, β and μ', true], ['They come from different Greek words', false, 'Both come from σύν, with.'], ['symphony is a Latin word', false, 'It is Greek: σύν + φωνή, “sounding together”.']], 'σύν + φωνή → συμφωνία; σύν + τίθημι → σύνθεσις.'),
  mcq('v17.arete', 'words-17', 'Why is ἀρετή hard to translate with one English word?', [['It means being excellent at what you are for: courage in a soldier, skill in a craftsman, goodness in a person', true], ['It has no meaning on its own', false, 'It has a rich meaning: excellence of every kind.'], ['It is a name, not a word', false, 'It is an ordinary noun (though Ἀρετή was also imagined as a goddess).']], 'ἀρετή: excellence, courage, virtue. Homer’s heroes fight to show their ἀρετή.'),
);

// review topics: odd ones out, families and look-alikes
push(
  mcq('vr1.odd1', 'words-review-1', 'Which is the odd one out?', [['ὁ ἵππος', true], ['ἡ μήτηρ', false, 'μήτηρ is a family member, like the others.'], ['ὁ πατήρ', false, 'πατήρ is a family member.'], ['ἡ θυγάτηρ', false, 'θυγάτηρ is a family member.']], 'mother, father, daughter… and a horse.'),
  mcq('vr1.odd2', 'words-review-1', 'Which is the odd one out?', [['ἡ εἰρήνη', true], ['ὁ πόλεμος', false, 'πόλεμος (war) belongs with battle and weapon.'], ['ἡ μάχη', false, 'μάχη (battle) belongs with war and weapon.'], ['τὸ ὅπλον', false, 'ὅπλον (weapon) belongs with war and battle.']], 'war, battle, weapon… and peace.'),
  mcq('vr1.family1', 'words-review-1', 'λόγος (word), λέγω (I say) and διάλογος (dialogue) share a root. What does the root mean?', [['speaking, words', true], ['writing', false, 'Writing is γραφ-.'], ['learning', false, 'Learning is μαθ-.']], 'λεγ-/λογ-: say, speak, word. Logic, dialogue, lexicon.'),
  mcq('vr1.family2', 'words-review-1', 'Which pair belongs to the same family?', [['πόλεμος (war) and πολέμιος (hostile)', true], ['πόλις (city) and πολύς (many)', false, 'They only look alike: πόλις is city, πολύς is many.'], ['ναός (temple) and ναῦς (ship)', false, 'Look-alikes: ναός is a temple, ναῦς a ship.']], 'πόλεμος → πολέμιος, “of war, hostile”; οἱ πολέμιοι, “the enemy”.'),
  mcq('vr1.look1', 'words-review-1', 'Which word means “temple”?', [['ὁ ναός', true], ['ἡ ναῦς', false, 'ναῦς is a ship.'], ['ὁ νόμος', false, 'νόμος is law.'], ['ὁ νοῦς', false, 'νοῦς is mind.']], 'ναός (temple), ναῦς (ship), ναύτης (sailor): three easy-to-confuse words.'),
  mcq('vr1.look2', 'words-review-1', 'Which word means “I see”?', [['ὁράω', true], ['ὀργίζομαι', false, 'That is “I grow angry”.'], ['ἔρχομαι', false, 'That is “I come, go”.'], ['ἐρωτάω', false, 'That is “I ask”.']], 'ὁράω (aorist εἶδον): panorama.'),
  mcq('vr1.aor', 'words-review-1', 'εἶδον is the aorist of which verb?', [['ὁράω (I see)', true], ['οἶδα (I know)', false, 'A clever guess: they are related, but εἶδον is the aorist of ὁράω.'], ['εἰμί (I am)', false, 'εἰμί has no aorist.']], 'εἶδον = I saw. Learn irregular aorists with their verbs.'),
  mcq('vr1.medical', 'words-review-1', 'An “ophthalmic surgeon” is a doctor who…', [['operates on eyes', true], ['looks after hearts', false, 'Hearts: cardiac, from καρδία.'], ['treats children', false, 'Children: paediatric, from παῖς.']], 'ὀφθαλμός = eye; χειρουργία (surgery) = hand-work.'),
  mcq('vr2.odd1', 'words-review-2', 'Which is the odd one out?', [['ἡ θύρα', true], ['ποῦ;', false, 'ποῦ; is a question word, like the others.'], ['πότε;', false, 'πότε; is a question word.'], ['πῶς;', false, 'πῶς; is a question word.']], 'where? when? how?… and a door.'),
  mcq('vr2.odd2', 'words-review-2', 'Which is the odd one out?', [['ταχύς', true], ['πέντε', false, 'πέντε is a number.'], ['ἑπτά', false, 'ἑπτά is a number.'], ['δέκα', false, 'δέκα is a number.']], 'five, seven, ten… and “quick”.'),
  mcq('vr2.family', 'words-review-2', 'Which English word is built from πᾶς (all) + θεός (god)?', [['pantheon', true], ['pandemic', false, 'pandemic is πᾶς + δῆμος: affecting all the people.'], ['theology', false, 'theology is θεός + λόγος.']], 'The Pantheon in Rome was a temple to all the gods.'),
  mcq('vr2.look', 'words-review-2', 'Which word means “wisdom”?', [['ἡ σοφία', true], ['ἡ φύσις', false, 'φύσις is nature.'], ['ἡ φυγή', false, 'φυγή is flight, escape.'], ['ἡ φωνή', false, 'φωνή is voice.']], 'σοφία: philosophy, Sophie.'),
  mcq('vr2.prep', 'words-review-2', 'What does **ὑπὸ τοῦ στρατηγοῦ** mean in “the army was led by the general”?', [['by the general', true], ['under the general’s feet', false, 'With a person in the genitive after a passive verb, ὑπό means “by”.'], ['instead of the general', false, 'Instead of is ἀντί.']], 'ὑπό + genitive of a person = “by”: the agent of a passive verb.'),
  mcq('vr2.deponent', 'words-review-2', 'Which of these verbs is deponent (middle ending, active meaning)?', [['ἀφικνέομαι (I arrive)', true], ['ἀποκτείνω (I kill)', false, '-ω is an ordinary active ending.'], ['ἐρωτάω (I ask)', false, '-άω is an ordinary active ending.']], 'ἀφικνέομαι, βούλομαι, γίγνομαι, δέχομαι, ἔρχομαι, μάχομαι: all -ομαι, all active in meaning.'),
  mcq('vr2.numbers', 'words-review-2', 'The modern heptathlon has seven events. Which Greek number is inside it?', [['ἑπτά', true], ['ἕξ', false, 'ἕξ is six: hexagon.'], ['ὀκτώ', false, 'ὀκτώ is eight: octagon.']], 'ἑπτά (seven) + ἆθλον (prize, contest).'),
  mcq('vr2.ideas', 'words-review-2', 'Which Greek word best describes the excellence a hero strives to show?', [['ἀρετή', true], ['κίνδυνος', false, 'κίνδυνος is danger: what a hero faces, not what he has.'], ['ὀργή', false, 'ὀργή is anger: Achilles had plenty, but it is not excellence.']], 'ἀρετή: excellence of every kind, the quality every hero strives to show.'),
);

export default [{ subject: 'greek', deck: 'y8-vocab', topics, items }];

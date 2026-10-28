// Year 8 Ancient Greek, part 3: the grammar of the rest of the year, so that by the summer she
// matches a strong school's Year 8 Greek (about a third of the way to GCSE). The third declension
// in full, pronouns, demonstratives and the relative, comparison, the weak and strong aorist,
// infinitives and commands, contracted verbs, the middle and passive, participles, the uses of
// the cases, questions and negatives; and eight graded myths written for this app. Greek answers
// are always chosen; English answers can be typed. Builds on greek.mjs (the tasters for the
// aorist, third declension and participles stay there as previews).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `greek.g3.${id}`, topic: `greek.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `greek.g3.${id}`, topic: `greek.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `greek.g3.${id}`, topic: `greek.${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
const tmpl = (id, topic, gen) => ({ id: `greek.g3.${id}.tmpl`, topic: `greek.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed: [-1, 0, 1] });
const C = { formats: ['choice'] };

// --- graded myths, written for this app: present → imperfect → aorist → participles
const P_ICARUS = {
  passage: 'ὁ Δαίδαλος καὶ ὁ Ἴκαρος\n\nὁ Δαίδαλος τεχνίτης σοφός ἐστιν. ἐν τῇ Κρήτῃ μένει μετὰ τοῦ Ἰκάρου, τοῦ υἱοῦ. ὁ δὲ Μίνως, ὁ βασιλεύς, οὐκ ἐθέλει αὐτοὺς ἀπολύειν.\n\nὁ οὖν Δαίδαλος ἐκ κηροῦ καὶ πτερῶν πτέρυγας ποιεῖ. τὸν δὲ υἱὸν κελεύει μὴ ἐγγὺς τοῦ ἡλίου πέτεσθαι. ἔπειτα ὁ πατὴρ καὶ ὁ υἱὸς ἐκ τῆς Κρήτης πέτονται.\n\nὁ δὲ Ἴκαρος μάλα χαίρει καὶ πρὸς τὸν ἥλιον πέτεται. ὁ οὖν ἥλιος τὸν κηρὸν λύει, καὶ ὁ παῖς εἰς τὴν θάλασσαν πίπτει. ὁ δὲ Δαίδαλος δακρύει.\n\nGlossary: τεχνίτης = craftsman; υἱός = son; ἀπολύειν = to let go; κηρός = wax; πτερόν = feather; πτέρυξ (accusative plural πτέρυγας) = wing; ποιεῖ = makes; κελεύει = orders; μή = not; ἐγγύς (+ genitive) = near; πέτεσθαι = to fly; πέτονται = they fly; πέτεται = he flies; χαίρει = enjoys himself; πίπτει = falls; δακρύει = weeps.',
  passageSource: 'Adapted for this app from the myth of Daedalus and Icarus',
};
const P_ARACHNE = {
  passage: 'ἡ Ἀράχνη\n\nἡ Ἀράχνη κόρη ἐστὶν ἐν τῇ Λυδίᾳ. καλῶς ὑφαίνει· πολλοὶ οὖν ἄνθρωποι τὰ ἔργα αὐτῆς θαυμάζουσιν. ἡ δὲ Ἀράχνη λέγει· «ἐγὼ κάλλιον ὑφαίνω ἢ ἡ Ἀθηνᾶ.»\n\nἡ οὖν θεὰ ὀργίζεται καὶ εἰς τὴν οἰκίαν τῆς κόρης ἔρχεται. αἱ δύο ὑφαίνουσιν. τὸ τῆς Ἀράχνης ὕφασμα καλὸν μέν ἐστιν, τοὺς δὲ θεοὺς οὐ τιμᾷ.\n\nἡ οὖν Ἀθηνᾶ τὴν κόρην εἰς ἀράχνην μεταβάλλει. ἔτι καὶ νῦν ἡ ἀράχνη ὑφαίνει.\n\nGlossary: Λυδία = Lydia (in Asia Minor); καλῶς = beautifully, well; ὑφαίνω = I weave; θαυμάζουσιν = admire; κάλλιον = more beautifully; ἤ = than; ὀργίζεται = becomes angry; ἔρχεται = comes; δύο = two; ὕφασμα, -ατος (τό) = woven cloth, tapestry; τιμᾷ = honours; ἀράχνη = spider; μεταβάλλει = changes; ἔτι καὶ νῦν = even now.',
  passageSource: 'Adapted for this app from the myth of Arachne',
};
const P_ORPHEUS = {
  passage: 'ὁ Ὀρφεὺς καὶ ἡ Εὐρυδίκη\n\nὁ Ὀρφεὺς μουσικὸς ἄριστος ἦν. ὅτε ᾖδεν, καὶ τὰ δένδρα καὶ τὰ θηρία ἤκουεν. ἡ δὲ γυνὴ αὐτοῦ, ἡ Εὐρυδίκη, ὑπ᾽ ὄφεως δάκνεται καὶ ἀποθνῄσκει.\n\nὁ οὖν Ὀρφεὺς εἰς Ἅιδου καταβαίνει καὶ ᾄδει πρὸ τοῦ βασιλέως τῶν νεκρῶν. ὁ δὲ Ἅιδης λέγει· «ἄγε τὴν γυναῖκα οἴκαδε, ἀλλὰ μὴ βλέπε πρὸς αὐτήν.»\n\nὁ μὲν Ὀρφεὺς ἡγεῖται, ἡ δὲ Εὐρυδίκη ἕπεται. ἐγγὺς δὲ τοῦ φωτὸς ὁ Ὀρφεὺς βλέπει πρὸς αὐτήν· ἡ δὲ εὐθὺς εἰς Ἅιδου ἐπανέρχεται.\n\nGlossary: μουσικός = musician; ἄριστος = best; ἦν = was; ὅτε = when; ᾖδεν = he sang (imperfect of ᾄδω, I sing); δένδρα = trees; θηρία = wild animals; ἤκουεν = listened; γυνή (accusative γυναῖκα) = wife; ὑπ᾽ (= ὑπό) + genitive = by; ὄφις (genitive ὄφεως) = snake; δάκνεται = is bitten; ἀποθνῄσκει = dies; εἰς Ἅιδου = to the house of Hades (the Underworld); καταβαίνει = goes down; πρό (+ genitive) = in front of; νεκρός = dead person; ἄγε = lead!; οἴκαδε = home; βλέπε = look!; ἡγεῖται = leads the way; ἕπεται = follows; φῶς (genitive φωτός) = light; εὐθύς = at once; ἐπανέρχεται = goes back.',
  passageSource: 'Adapted for this app from the myth of Orpheus',
};
const P_HYDRA = {
  passage: 'ὁ Ἡρακλῆς καὶ ἡ Ὕδρα\n\nἐν τῷ ἕλει τῆς Λέρνης ἔμενε θηρίον δεινόν, ἡ Ὕδρα. ἡ Ὕδρα πολλὰς κεφαλὰς εἶχεν, καὶ τοὺς ἀνθρώπους καὶ τὰ πρόβατα διέφθειρεν.\n\nὁ δὲ Ἡρακλῆς μετὰ τοῦ Ἰολάου πρὸς τὸ ἕλος ἔρχεται. ὅτε δὲ ὁ Ἡρακλῆς μίαν κεφαλὴν ἀπέκοπτεν, δύο ἄλλαι ἐφύοντο.\n\nὁ οὖν Ἰόλαος πῦρ φέρει καὶ τοὺς τραχήλους καίει. οὕτως αἱ κεφαλαὶ οὐκέτι ἐφύοντο, καὶ ὁ Ἡρακλῆς τὴν Ὕδραν ἀποκτείνει.\n\nGlossary: ἕλος, -ους (τό) = marsh; Λέρνη = Lerna; θηρίον = beast; κεφαλή = head; εἶχεν = had (imperfect of ἔχω); πρόβατα = sheep; διέφθειρεν = was destroying; Ἰόλαος = Iolaus, his nephew; μίαν = one; ἀπέκοπτεν = cut off (each time); ἄλλος = other; ἐφύοντο = grew; πῦρ = fire; τράχηλος = neck; καίει = burns; οὕτως = in this way; οὐκέτι = no longer; ἀποκτείνει = kills.',
  passageSource: 'Adapted for this app from the labours of Heracles',
};
const P_SIRENS = {
  passage: 'ὁ Ὀδυσσεὺς καὶ αἱ Σειρῆνες\n\nἡ Κίρκη τῷ Ὀδυσσεῖ εἶπεν· «αἱ Σειρῆνες καλῶς ᾄδουσιν, ἀλλὰ τοὺς ναύτας ἀποκτείνουσιν. κηρῷ οὖν τὰ ὦτα τῶν ἑταίρων κλεῖσον.»\n\nὁ οὖν Ὀδυσσεὺς τὰ τῶν ἑταίρων ὦτα κηρῷ ἔκλεισεν. αὐτὸς δὲ ἤθελε τῶν Σειρήνων ἀκούειν· ἐκέλευσεν οὖν τοὺς ἑταίρους αὐτὸν πρὸς τὸν ἱστὸν δῆσαι.\n\nὅτε δὲ τὴν ᾠδὴν ἤκουσεν, ὁ Ὀδυσσεὺς ἐβόησεν· «λύσατέ με, ὦ φίλοι.» οἱ δὲ οὐκ ἤκουσαν, ἀλλ᾽ ἔτι μᾶλλον αὐτὸν ἔδησαν. οὕτως ὁ Ὀδυσσεὺς καὶ οἱ ἑταῖροι ἀπέφυγον.\n\nGlossary: Κίρκη = Circe; εἶπεν = said; Σειρῆνες = the Sirens; ναύτης = sailor; κηρός (dative κηρῷ) = wax; οὖς (accusative plural ὦτα) = ear; ἑταῖρος = companion; κλεῖσον = close! (aorist imperative); ἔκλεισεν = closed; ἤθελε = wanted; ἐκέλευσεν = ordered; ἱστός = mast; δῆσαι = to tie (aorist infinitive); ᾠδή = song; ἐβόησεν = shouted; λύσατε = untie! (aorist imperative); ἔτι μᾶλλον = even more tightly; ἔδησαν = tied; ἀπέφυγον = escaped.',
  passageSource: 'Adapted for this app from Homer, Odyssey book 12',
};
const P_JASON = {
  passage: 'ὁ Ἰάσων καὶ τὸ χρυσοῦν δέρας\n\nὁ Πελίας ὁ βασιλεὺς τὸν Ἰάσονα ἐκέλευσε τὸ χρυσοῦν δέρας ἐκ τῆς Κόλχιδος φέρειν. ὁ οὖν Ἰάσων ναῦν μεγάλην, τὴν Ἀργώ, ἐποίησε καὶ μετὰ πολλῶν ἡρώων ἔπλευσεν.\n\nἐν δὲ τῇ Κόλχιδι ὁ βασιλεὺς Αἰήτης εἶπεν· «εἰ ἐθέλεις τὸ δέρας λαβεῖν, πρῶτον δεῖ σε τοὺς ταύρους ζεῦξαι.» οἱ δὲ ταῦροι πῦρ ἔπνεον.\n\nἡ δὲ Μήδεια, ἡ τοῦ βασιλέως θυγάτηρ, τὸν Ἰάσονα ἐφίλησε καὶ φάρμακον αὐτῷ ἔδωκεν. τῷ φαρμάκῳ ὁ Ἰάσων τοὺς ταύρους ἔζευξε καὶ τὸ δέρας ἔλαβεν. ἔπειτα μετὰ τῆς Μηδείας ἔφυγεν.\n\nGlossary: Πελίας = Pelias; χρυσοῦς, -ῆ, -οῦν = golden; δέρας (τό) = fleece; Κόλχις, -ιδος = Colchis (by the Black Sea); ναῦς (accusative ναῦν) = ship; μέγας (feminine accusative μεγάλην) = big; ἐποίησε = made, had built; ἥρως, ἥρωος = hero; ἔπλευσεν = sailed; εἰ = if; λαβεῖν = to take; πρῶτον = first; δεῖ σε = you must; ταῦρος = bull; ζεῦξαι = to yoke (aorist infinitive); ἔπνεον = breathed; ἐφίλησε = fell in love with; φάρμακον = magic potion, drug; ἔδωκεν = gave; ἔζευξε = yoked; ἔλαβεν = took; ἔφυγεν = fled.',
  passageSource: 'Adapted for this app from the voyage of the Argonauts',
};
const P_HORSE = {
  passage: 'ὁ δούρειος ἵππος\n\nδέκα ἔτη οἱ Ἕλληνες τὴν Τροίαν ἐπολιόρκουν. τέλος δὲ ὁ Ὀδυσσεύς, σοφώτατος τῶν Ἑλλήνων ὤν, ἐκέλευσε τοὺς Ἕλληνας ἵππον μέγιστον ἐκ ξύλων ποιῆσαι. οἱ μὲν ἄριστοι τῶν στρατιωτῶν εἰς τὸν ἵππον εἰσβάντες ἔμενον· οἱ δὲ ἄλλοι Ἕλληνες, τὰς σκηνὰς καύσαντες, ἀπέπλευσαν.\n\nοἱ δὲ Τρῶες τὸν ἵππον ἰδόντες ἐχάρησαν καὶ εἰς τὴν πόλιν εἵλκυσαν. τῆς δὲ νυκτὸς γενομένης, οἱ στρατιῶται ἐκ τοῦ ἵππου ἐξελθόντες τὰς πύλας τοῖς φίλοις ἀνέῳξαν. οὕτως οἱ Ἕλληνες τὴν Τροίαν εἷλον.\n\nGlossary: δούρειος = wooden; ἔτος, -ους (τό) = year; ἐπολιόρκουν = were besieging; τέλος = finally; σοφώτατος = wisest; ὤν = being; ξύλον = wood, timber; ποιῆσαι = to make (aorist infinitive); εἰσβάντες = having gone in; σκηνή = tent; καύσαντες = having burned; ἀπέπλευσαν = sailed away; Τρῶες = Trojans; ἰδόντες = having seen; ἐχάρησαν = rejoiced; εἵλκυσαν = dragged; γενομένης = having happened (here: having fallen); ἐξελθόντες = having come out; πύλαι = gates; ἀνέῳξαν = opened; εἷλον = captured.',
  passageSource: 'Adapted for this app from the fall of Troy',
};
const P_PERSEUS = {
  passage: 'ὁ Περσεὺς καὶ ἡ τῆς Μεδούσης κεφαλή\n\nὁ Πολυδέκτης ὁ βασιλεὺς τὸν Περσέα ἐκέλευσε τὴν τῆς Μεδούσης κεφαλὴν φέρειν. ὁ δὲ Περσεὺς οὐ φοβούμενος ἐξῆλθεν. ἡ Ἀθηνᾶ καὶ ὁ Ἑρμῆς αὐτῷ ἐβοήθησαν· ἡ μὲν ἀσπίδα λαμπρὰν ἔδωκεν, ὁ δὲ ἅρπην καὶ πτερωτὰ πέδιλα.\n\nὁ οὖν Περσεὺς πετόμενος πρὸς τὴν τῶν Γοργόνων νῆσον ἦλθεν. τῶν δὲ Γοργόνων καθευδουσῶν, οὐκ εἰς τὴν Μέδουσαν ἀλλ᾽ εἰς τὴν ἀσπίδα βλέπων, τὴν κεφαλὴν αὐτῆς ἀπέτεμεν. ἔπειτα τὴν κεφαλὴν λαβὼν ἀπέφυγεν.\n\nὕστερον δὲ τῷ Πολυδέκτῃ τὴν κεφαλὴν δείξας, αὐτὸν εἰς λίθον μετέβαλεν.\n\nGlossary: Πολυδέκτης = Polydectes; φοβούμενος = being afraid; ἐξῆλθεν = set out; ἐβοήθησαν (+ dative) = helped; ἀσπίς (accusative ἀσπίδα) = shield; λαμπρός = shining; ἔδωκεν = gave; ἅρπη = curved sword; πτερωτὰ πέδιλα = winged sandals; πετόμενος = flying; Γοργών, -όνος = Gorgon; νῆσος (ἡ) = island; ἦλθεν = came; καθευδουσῶν = sleeping; βλέπων = looking; ἀπέτεμεν = cut off; λαβών = having taken; ἀπέφυγεν = escaped; ὕστερον = later; δείξας = having shown; λίθος = stone; μετέβαλεν = changed.',
  passageSource: 'Adapted for this app from the myth of Perseus',
};

const topics = [
  { id: 'greek.decl3-stems', title: 'The third declension: consonant stems', kind: 'mixed', prereqs: ['greek.nouns-1'], batch: 5, intro: 'The third declension is the biggest noun family: φύλαξ (guard), γίγας (giant), ἀγών (contest), ῥήτωρ (speaker), παῖς (child), Ἕλλην (a Greek). The nominative can look odd, so always learn the genitive too: take off -ος and you have the stem. After that the endings are regular: singular -α, -ος, -ι; plural -ες, -ας, -ων, -σι(ν).', teach: 'Explain how to find the stem of a third-declension noun, using φύλαξ, φύλακος.', talk: 'Ask {him} to decline ἀγών aloud, singular and plural, and to name an English word that comes from it.' },
  { id: 'greek.decl3-more', title: 'The third declension: σῶμα, πόλις, βασιλεύς and family words', kind: 'mixed', prereqs: ['greek.decl3-stems'], batch: 5, intro: 'Three more patterns. Neuters ending -μα have a stem in -ματ- (σῶμα, σώματος). πόλις (city) and βασιλεύς (king) change their stem vowel. Family words such as πατήρ (father), μήτηρ (mother) and ἀνήρ (man) drop a vowel in some cases, and γυνή (woman) uses a stem γυναικ-.', teach: 'Explain why τὰ σώματα could be either the subject or the object.', talk: 'Ask {him} which English words come from σῶμα, πόλις and γυνή.' },
  { id: 'greek.pronouns', title: 'Pronouns: I, you, we, and αὐτός', kind: 'facts', prereqs: ['greek.article', 'greek.verbs-1'], batch: 5, intro: 'Personal pronouns: ἐγώ (I), σύ (you), ἡμεῖς (we), ὑμεῖς (you all). Greek uses ἐγώ or σύ as a subject only for emphasis, because the verb ending already says who. The busy word αὐτός has three jobs: “him, her, it, them” on its own (in every case except the nominative); “-self” next to a noun (αὐτὸς ὁ βασιλεύς, the king himself); and “the same” after the article (ὁ αὐτὸς βασιλεύς, the same king).', teach: 'Explain the three meanings of αὐτός, with an example of each.', talk: 'Ask {him} the difference between αὐτὸς ὁ βασιλεύς and ὁ αὐτὸς βασιλεύς.' },
  { id: 'greek.demonstratives', title: 'This, that, and who: οὗτος, ἐκεῖνος and the relative', kind: 'facts', prereqs: ['greek.pronouns', 'greek.adjectives'], batch: 5, intro: 'οὗτος (this) and ἐκεῖνος (that) stand outside the article: οὗτος ὁ ἀνήρ or ὁ ἀνὴρ οὗτος, “this man”. The relative pronoun ὅς, ἥ, ὅ means “who” or “which”: it takes its gender and number from the noun it refers to, but its case from its own clause.', teach: 'Explain why the relative in ὁ ἀνὴρ ὃν ὁρῶ is accusative.', talk: 'Ask {him} to translate “this girl” and “that city” into Greek.' },
  { id: 'greek.comparison', title: 'Comparison: wiser, wisest', kind: 'facts', prereqs: ['greek.adjectives'], batch: 5, intro: 'Comparatives (“wiser”) and superlatives (“wisest”) usually add -τερος and -τατος: σοφός, σοφώτερος, σοφώτατος. The commonest adjectives are irregular, just as in English (good, better, best): ἀγαθός, ἀμείνων, ἄριστος. “Than” is ἤ, or the genitive on its own.', teach: 'Explain two ways of saying “than” in Greek.', talk: 'Ask {him} where “aristocracy” comes from.' },
  { id: 'greek.aorist-weak', title: 'The weak aorist and the augment', kind: 'mixed', prereqs: ['greek.tenses'], batch: 5, intro: 'The aorist is the storytelling tense: a single action in the past. The weak (first) aorist adds the augment ἐ- at the front and -σα at the end: ἔλυσα, ἔλυσας, ἔλυσε(ν), ἐλύσαμεν, ἐλύσατε, ἔλυσαν. A verb starting with a vowel lengthens it instead (ἀκούω → ἤκουσα), and a compound verb puts the augment after its prefix (ἀποπέμπω → ἀπέπεμψα).', teach: 'Explain how to tell ἐπαίδευε (imperfect) from ἐπαίδευσε (aorist).', talk: 'Ask {him} to tell you the aorist of λύω, all six persons.' },
  { id: 'greek.aorist-strong', title: 'Strong and irregular aorists', kind: 'mixed', prereqs: ['greek.aorist-weak'], batch: 5, intro: 'Many of the commonest verbs have a strong (second) aorist: a different stem with imperfect-style endings. φεύγω → ἔφυγον (I fled), λαμβάνω → ἔλαβον (I took), μανθάνω → ἔμαθον (I learned). A few must simply be learned as new words: λέγω → εἶπον, ὁράω → εἶδον, ἔρχομαι → ἦλθον.', teach: 'Explain how to tell ἔφευγον from ἔφυγον.', talk: 'Ask {him} for the aorists of λέγω, ὁράω and ἔρχομαι.' },
  { id: 'greek.infinitives', title: 'Infinitives and commands', kind: 'facts', prereqs: ['greek.aorist-strong'], batch: 5, intro: 'The infinitive (“to free”) has a present form, λύειν, and an aorist form, λῦσαι (strong aorists: λαβεῖν, φυγεῖν). Both mean “to…”; the aorist just treats the action as a single event. Commands use the imperative: λῦε! (to one person), λύετε! (to several); aorist λῦσον!, λύσατε! To say “don’t”, use μή.', teach: 'Explain the difference between λύσατε! and ἐλύσατε.', talk: 'Ask {him} to give you a command in Greek, and then tell you not to do it.' },
  { id: 'greek.contracted', title: 'Contracted verbs: φιλέω, ποιέω (and a taste of τιμάω)', kind: 'mixed', prereqs: ['greek.verbs-1'], batch: 5, intro: 'Verbs like φιλέω (I love) and ποιέω (I make, do) have stems ending in ε, which merges with the ending: φιλέ-ω → φιλῶ, φιλέ-ει → φιλεῖ, φιλέ-ομεν → φιλοῦμεν. The rules: ε + ω = ω, ε + ε = ει, ε + ει = ει, ε + ο = ου, ε + ου = ου. Verbs in -άω, like τιμάω (I honour) and ὁράω (I see), contract to α and ω sounds instead: τιμᾷ, ὁρῶμεν.', teach: 'Explain how φιλέομεν becomes φιλοῦμεν.', talk: 'Ask {him} what φιλοσοφία has to do with φιλέω.' },
  { id: 'greek.middle', title: 'The middle and passive', kind: 'mixed', prereqs: ['greek.tenses'], batch: 5, intro: 'Greek verbs have a third set of endings: λύομαι, λύῃ, λύεται, λυόμεθα, λύεσθε, λύονται. In the present these can be passive (“I am being freed”) or middle (“I free for myself”). Some verbs have only these endings but active meanings, like βούλομαι (I want) and γίγνομαι (I become): these are called deponents. “By” a person is ὑπό + genitive.', teach: 'Explain what a deponent verb is, with an example.', talk: 'Ask {him} to translate “the horse is freed by the slave” into Greek.' },
  { id: 'greek.participles-full', title: 'Participles in full', kind: 'mixed', prereqs: ['greek.aorist-strong', 'greek.decl3-stems'], batch: 5, intro: 'A participle is an adjective made from a verb. The present participle (λύων, λύουσα, λῦον: “freeing”) describes something happening at the same time; the aorist participle (λύσας, λύσασα, λῦσαν: “having freed”) something that happened first. Strong aorists have their own: λαβών (having taken), ἰδών (having seen), ἐλθών (having come). Participles agree with their noun like adjectives, which is how you know who is doing what.', teach: 'Explain how the case of a participle tells you who is doing the action.', talk: 'Ask {him} to translate ταῦτα εἰπών, and say why it is “having said”.' },
  { id: 'greek.cases', title: 'Using the cases: time, means and possession', kind: 'facts', prereqs: ['greek.decl3-stems', 'greek.prepositions'], batch: 5, intro: 'The cases do more than subject and object. The dative can mean “with” or “by means of” (τῷ ξίφει, with the sword) and “on” a day (τῇ ὑστεραίᾳ, on the next day). The accusative can mean “for” a length of time (δέκα ἔτη, for ten years). The genitive shows possession (ἡ τοῦ βασιλέως θυγάτηρ) and “during” a time (νυκτός, by night). And ὦ + the vocative calls someone: ὦ φίλε!', teach: 'Explain how Greek says “for ten years” and “on the third day”.', talk: 'Ask {him} how an Athenian speaker would begin a speech: ὦ ἄνδρες Ἀθηναῖοι.' },
  { id: 'greek.questions', title: 'Questions and negatives', kind: 'facts', prereqs: ['greek.pronouns'], batch: 5, intro: 'Greek marks a question with ; (which looks like our semicolon). Many question words begin with π- or τ-: τίς; (who?), τί; (what? why?), ποῦ; (where?), πότε; (when?), πῶς; (how?). ἆρα introduces a yes-or-no question. “Not” is οὐ (οὐκ before a smooth breathing, οὐχ before a rough one) in statements, but μή with commands and infinitives.', teach: 'Explain when Greek uses μή instead of οὐ.', talk: 'Ask {him} three questions in Greek: who are you, where are you, why are you running?' },
  { id: 'greek.read-1', title: 'Reading: Daedalus and Icarus, Arachne', kind: 'reading', prereqs: ['greek.myth-2'], batch: 6, intro: 'Two more myths in Greek, mostly in the present tense, with a few new words in the glossary. Read each sentence aloud, find the verb, then the subject.', teach: 'Explain what οὖν does in “ὁ οὖν Δαίδαλος… πτέρυγας ποιεῖ”.', talk: 'Ask {him} to retell the Arachne story from Athena’s point of view.' },
  { id: 'greek.read-2', title: 'Reading: Orpheus, and Heracles and the Hydra', kind: 'reading', prereqs: ['greek.read-1', 'greek.decl3-stems', 'greek.pronouns'], batch: 6, intro: 'These stories mix the present with the imperfect (ᾖδεν, εἶχεν, ἐφύοντο) and use third-declension nouns and pronouns.', teach: 'Explain why ἐφύοντο is imperfect, and what that adds to the Hydra story.', talk: 'Ask {him} why Orpheus looked back. What would {she} have done?' },
  { id: 'greek.read-3', title: 'Reading: the Sirens, and Jason and the golden fleece', kind: 'reading', prereqs: ['greek.read-2', 'greek.aorist-strong', 'greek.infinitives'], batch: 6, intro: 'Real storytelling Greek: weak and strong aorists, infinitives and commands. Watch the front of each verb for the augment.', teach: 'Explain the difference between κλεῖσον and ἔκλεισεν in the Sirens story.', talk: 'Ask {him} which of the Argonauts {she} would want on the ship, and why.' },
  // stretch
  { id: 'greek.read-4', title: 'Reading: the wooden horse, and Perseus', kind: 'reading', tier: 'stretch', prereqs: ['greek.read-3', 'greek.participles-full'], batch: 6, intro: 'The hardest reading of the year: participles, comparatives and the genitive absolute, the way Greek historians wrote. Take one clause at a time.', teach: 'Explain how the participles in the wooden-horse story move the action along.', talk: 'Ask {him} to find every participle in the Perseus story.' },
  { id: 'greek.genabs', title: 'The genitive absolute', kind: 'facts', tier: 'stretch', prereqs: ['greek.participles-full'], batch: 5, intro: 'A noun and a participle in the genitive, standing apart from the rest of the sentence, set the scene: τῆς νυκτὸς γενομένης, “when night had fallen”; τῶν Γοργόνων καθευδουσῶν, “while the Gorgons were sleeping”. Translate it with “when”, “while”, “after” or “because”.', teach: 'Explain how to spot a genitive absolute and how to translate it.', talk: 'Ask {him} to make up an English sentence that starts “While the Cyclops was sleeping…”, then try it in Greek.' },
];

const items = [];
const push = (...xs) => items.push(...xs);
const RQ = (id, topic, prompt, right, wrongs, explain, pass) => push(fact(id, topic, prompt, right, wrongs, explain, { ...C, ...pass }));

// --- third declension: consonant stems
push(
  tmpl('d3', 'decl3-stems', 'y8hDecl3'),
  mcq('d3.sg', 'decl3-stems', 'Which are the third-declension singular endings for the accusative, genitive and dative?', [['-α, -ος, -ι', true], ['-ον, -ου, -ῳ', false, 'Those are second declension (λόγον, λόγου, λόγῳ).'], ['-ην, -ης, -ῃ', false, 'Those are first declension (τιμήν, τιμῆς, τιμῇ).']], 'φύλαξ, φύλακα, φύλακος, φύλακι. The nominative varies, so learn it with the genitive.'),
  mcq('d3.pl', 'decl3-stems', 'Which are the third-declension plural endings (nominative, accusative, genitive, dative)?', [['-ες, -ας, -ων, -σι(ν)', true], ['-οι, -ους, -ων, -οις', false, 'Those are second declension.'], ['-αι, -ας, -ων, -αις', false, 'Those are first declension.']], 'φύλακες, φύλακας, φυλάκων, φύλαξι(ν).'),
  mcq('d3.gigas', 'decl3-stems', 'γίγας (giant) has the genitive γίγαντος. What is its stem?', [['γιγαντ-', true], ['γιγα-', false, 'Take -ος off the genitive: γίγαντ-ος.'], ['γιγας-', false, 'The nominative hides the stem. The genitive shows it.']], 'Genitive minus -ος = stem: γίγαντ-ος → γιγαντ-. “Gigantic” keeps the -ντ-.'),
  mcq('d3.xi', 'decl3-stems', 'Why is the dative plural of φύλαξ written φύλαξι(ν), not φύλακσι?', [['κ + σ is written ξ', true], ['φύλαξ is irregular', false, 'It is perfectly regular: the stem φυλακ- + -σι.'], ['The ξ shows it is plural', false, 'ξ is just how Greek writes κσ.']], 'Stem φυλακ- + ending -σι(ν) = φυλακσι → φύλαξι(ν). The same thing happens in the nominative: φυλακ-ς → φύλαξ.'),
  mcq('d3.ntsi', 'decl3-stems', 'The dative plural of γίγας (stem γιγαντ-) is γίγασι(ν). What happened?', [['ντ drops out before σ', true], ['It is a misprint', false, 'It is a regular sound change.'], ['It comes from a different word', false, 'Same word: γίγας, γίγαντος.']], 'γιγαντ- + σι → γίγασι(ν), and λεοντ- + σι → λέουσι(ν): ντ disappears before σ, and the vowel lengthens.'),
  fact('d3.pais', 'decl3-stems', 'What does **ὁ παῖς** (genitive παιδός) mean?', 'child', ['father', 'old man', 'peace'], 'παῖς, παῖδα, παιδός, παιδί: a child (boy or girl). It gives us paediatrics and pedagogy.', { accept: ['a child', 'the child', 'boy', 'the boy', 'girl', 'son', 'slave boy'] }),
  fact('d3.hellen', 'decl3-stems', 'What does **ὁ Ἕλλην** (genitive Ἕλληνος) mean?', 'a Greek', ['a Persian', 'a hero', 'a giant'], 'The Greeks called themselves Ἕλληνες (Hellenes) and their land Ἑλλάς (Hellas).', { accept: ['Greek', 'the Greek', 'a Greek man', 'Hellene', 'a Hellene'] }),
  fact('d3.agon', 'decl3-stems', 'What does **ὁ ἀγών** (genitive ἀγῶνος) mean?', 'contest', ['tent', 'army', 'temple'], 'ἀγών = a contest or struggle: the games at Olympia were ἀγῶνες. English “agony” first meant a struggle.', { accept: ['a contest', 'the contest', 'struggle', 'competition', 'a struggle', 'a competition', 'games'] }),
  mcq('d3.rhetor', 'decl3-stems', 'Which is the genitive singular of **ὁ ῥήτωρ** (speaker)?', [['ῥήτορος', true], ['ῥήτορα', false, 'That is the accusative singular.'], ['ῥήτορι', false, 'That is the dative singular.'], ['ῥήτορες', false, 'That is the nominative plural.']], 'ῥήτωρ, ῥήτορα, ῥήτορος, ῥήτορι. Rhetoric is the speaker’s art.'),
  mcq('d3.chase', 'decl3-stems', 'In **οἱ φύλακες τὸν γίγαντα διώκουσιν**, who is chasing whom?', [['The guards are chasing the giant', true], ['The giant is chasing the guards', false, 'γίγαντα is accusative (the object); φύλακες is nominative plural (the subject).'], ['The guard is chasing the giants', false, 'φύλακες is plural and γίγαντα singular.']], 'φύλακες: nominative plural, subject. γίγαντα: accusative singular, object. διώκουσιν: they chase.'),
  mcq('d3.nyx', 'decl3-stems', 'What does **ἡ νύξ, τῆς νυκτός** mean?', [['the night', true], ['the nymph', false, 'A nymph is νύμφη.'], ['the island', false, 'An island is νῆσος.']], 'νύξ, νύκτα, νυκτός, νυκτί. Nyx was also the goddess of night.'),
  mcq('d3.accent', 'decl3-stems', 'Why does φύλαξ become φυλάκων in the genitive plural?', [['The long -ων stops the accent staying three syllables back', true], ['The genitive plural always moves the accent to the stem', false, 'Not always: it moves here only because the ending -ων is long.'], ['Genitive plurals always take a circumflex on the ending', false, 'Third-declension -ων usually has the acute on the syllable before: φυλάκων, ἀγώνων.']], 'A noun keeps its accent where it can. With a long last syllable (-ων), it can be no further back than the second-to-last syllable.'),
);

// --- third declension: neuters, πόλις, βασιλεύς, family words
push(
  tmpl('d3b', 'decl3-more', 'y8hDecl3b'),
  mcq('d3b.soma', 'decl3-more', 'σῶμα (body) has the genitive σώματος. What is its dative singular?', [['σώματι', true], ['σώμᾳ', false, '-ᾳ is first declension.'], ['σώματος', false, 'That is the genitive.']], 'σῶμα, σῶμα, σώματος, σώματι: stem σωματ- + -ι.'),
  mcq('d3b.chromo', 'decl3-more', 'Which English words come from **σῶμα, σώματος** (body)?', [['psychosomatic and chromosome', true], ['somersault and sombre', false, 'Those come from Latin and French.'], ['summer and some', false, 'Those are old English words.']], 'Psychosomatic: of mind and body. Chromosome: “colour body”, because they show up when stained.'),
  mcq('d3b.neuter', 'decl3-more', 'Why can **τὰ σώματα** be either the subject or the object?', [['Neuter nouns always have the same nominative and accusative', true], ['σώματα is a dative plural that can do both jobs', false, 'It is nominative or accusative plural; the dative plural is σώμασι(ν).'], ['Third-declension nouns have no separate accusative form', false, 'They do: φύλακα, γίγαντα.']], 'Neuters never tell you subject from object by their ending: use the verb and the other nouns.'),
  fact('d3b.pragma', 'decl3-more', 'What does **τὸ πρᾶγμα** (genitive πράγματος) mean?', 'thing, matter', ['body, corpse', 'name, fame', 'word, speech'], 'πρᾶγμα = a thing done, a matter, an affair: “pragmatic” means practical.', { accept: ['thing', 'matter', 'affair', 'business', 'deed', 'a thing', 'the thing', 'a matter'] }),
  mcq('d3b.polin', 'decl3-more', 'Which is the accusative singular of **ἡ πόλις**?', [['πόλιν', true], ['πόλεα', false, 'πόλις takes -ν, not -α, in the accusative singular.'], ['πόλεως', false, 'That is the genitive.']], 'πόλις, πόλιν, πόλεως, πόλει; plural πόλεις, πόλεις, πόλεων, πόλεσι(ν).'),
  mcq('d3b.poleos', 'decl3-more', 'What does **τῆς πόλεως** mean?', [['of the city', true], ['to the city', false, 'That would be the dative, τῇ πόλει.'], ['the cities', false, 'That would be αἱ πόλεις.']], 'πόλεως is the genitive singular: of the city. A metropolis is a “mother city”.'),
  mcq('d3b.basileus', 'decl3-more', 'What is the genitive singular of **ὁ βασιλεύς** (king)?', [['βασιλέως', true], ['βασιλεύου', false, 'The second-declension -ου does not apply here.'], ['βασιλεῖ', false, 'That is the dative.']], 'βασιλεύς, βασιλέα, βασιλέως, βασιλεῖ. Θησεύς, Ὀδυσσεύς and Περσεύς decline the same way.'),
  mcq('d3b.thesea', 'decl3-more', 'In the Theseus story, why is it **τὸν Θησέα**, not τὸν Θησεύν?', [['Θησεύς declines like βασιλεύς: accusative -έα', true], ['It is a poetic form that Homer uses', false, 'It is the ordinary prose form, like βασιλέα.'], ['Θησέα is the accusative plural of Θησεύς', false, 'τόν is singular.']], 'βασιλεύς → βασιλέα; Θησεύς → Θησέα; Περσεύς → Περσέα.'),
  mcq('d3b.patros', 'decl3-more', 'ὁ πατήρ (father) has the genitive πατρός. What does **τοῦ πατρός** mean?', [['of the father', true], ['to the father', false, 'That would be τῷ πατρί.'], ['the fathers', false, 'That would be οἱ πατέρες.']], 'πατήρ, πατέρα, πατρός, πατρί: the ε drops out in the genitive and dative singular.'),
  mcq('d3b.andrasi', 'decl3-more', 'Which is the dative plural of **ὁ ἀνήρ** (man)?', [['ἀνδράσι(ν)', true], ['ἀνδροῖς', false, '-οις is second declension.'], ['ἄνδρες', false, 'That is the nominative plural.']], 'ἀνήρ, ἄνδρα, ἀνδρός, ἀνδρί; ἄνδρες, ἄνδρας, ἀνδρῶν, ἀνδράσι(ν).'),
  mcq('d3b.gyne', 'decl3-more', 'What is unusual about **ἡ γυνή** (woman)?', [['Its other cases use the stem γυναικ-', true], ['It is masculine, despite meaning woman', false, 'It is feminine: ἡ γυνή.'], ['It has no plural form at all', false, 'The plural is γυναῖκες.']], 'γυνή is irregular. “Gynaecology” comes from the stem γυναικ-.'),
  mcq('d3b.zeus', 'decl3-more', 'The king of the gods declines oddly. Which is the accusative of **Ζεύς**?', [['Δία', true], ['Ζεῦν', false, 'There is no such form.'], ['Διός', false, 'That is the genitive: of Zeus.']], 'Ζεύς, Δία, Διός, Διί; and when you call him, ὦ Ζεῦ.'),
);

// --- pronouns
push(
  mcq('pr.me', 'pronouns', 'What does **με** mean in **ὁ Κύκλωψ με διώκει**?', [['me', true], ['I', false, 'I is ἐγώ, the nominative. με is accusative.'], ['my', false, 'My (of me) would be μου.']], 'ἐγώ, ἐμέ (με), ἐμοῦ (μου), ἐμοί (μοι): I, me, of me, to me.'),
  mcq('pr.ego', 'pronouns', 'Why is ἐγώ often left out of a Greek sentence?', [['The verb ending already shows “I”', true], ['It is thought rude to say “I” in Greek', false, 'Not rude: just unnecessary.'], ['ἐγώ only appears in poetry', false, 'It appears whenever the speaker wants to stress “I”.']], 'λύω already means “I free”. ἐγὼ λύω = “I (and not you) am freeing”.'),
  fact('pr.hemeis', 'pronouns', 'What does **ἡμεῖς** mean?', 'we', ['you (plural)', 'they', 'us'], 'ἡμεῖς, ἡμᾶς, ἡμῶν, ἡμῖν: we, us, of us, to us.'),
  fact('pr.hymin', 'pronouns', 'What does **ὑμῖν** mean?', 'to you (plural)', ['to us', 'you (as the subject)', 'of you (plural)'], 'ὑμεῖς, ὑμᾶς, ὑμῶν, ὑμῖν: you, you, of you, to you (all plural).', C),
  mcq('pr.se', 'pronouns', 'Which is the accusative of **σύ** (you, singular)?', [['σέ (or unemphatic σε)', true], ['σοί (or unemphatic σοι)', false, 'σοί is the dative: to you.'], ['σοῦ (or unemphatic σου)', false, 'σοῦ is the genitive: of you.']], 'σύ, σέ, σοῦ, σοί.'),
  mcq('pr.auton', 'pronouns', 'In **ὁ στρατηγὸς αὐτὸν ὁρᾷ** (ὁρᾷ = sees), what does αὐτόν mean?', [['him', true], ['himself', false, 'αὐτός means “-self” only next to a noun or as an emphatic subject. On its own in the accusative it means “him”.'], ['the same man', false, '“The same man” needs the article: τὸν αὐτόν.']], 'Use 1 of αὐτός: on its own, not in the nominative, it means him, her, it or them.'),
  mcq('pr.self', 'pronouns', '**αὐτὸς ὁ βασιλεύς** means…', [['the king himself', true], ['the same king', false, 'The same king is ὁ αὐτὸς βασιλεύς, with the article first.'], ['his king', false, 'His king would be ὁ βασιλεὺς αὐτοῦ.']], 'Use 2 of αὐτός: outside the article it means “-self”.'),
  mcq('pr.same', 'pronouns', '**ὁ αὐτὸς βασιλεύς** means…', [['the same king', true], ['the king himself', false, 'That is αὐτὸς ὁ βασιλεύς.'], ['the king alone', false, 'Alone would be μόνος.']], 'Use 3 of αὐτός: inside the article (ὁ αὐτός) it means “the same”.'),
  mcq('pr.autes', 'pronouns', 'In **τὰ ἔργα αὐτῆς θαυμάζουσιν**, what does αὐτῆς mean?', [['her: they admire her works', true], ['herself: she herself admires the works', false, 'On its own in the genitive, αὐτῆς means “of her”.'], ['the same: they admire the same works', false, '“The same” needs the article.']], 'αὐτοῦ = his, αὐτῆς = her, αὐτῶν = their (literally of him, of her, of them).'),
  mcq('pr.autoi', 'pronouns', '**αὐτοὶ φεύγομεν** means…', [['we ourselves flee', true], ['they flee', false, 'φεύγομεν is “we”; αὐτοί adds “ourselves”.'], ['we flee from them', false, 'That would be φεύγομεν αὐτούς.']], 'In the nominative, αὐτός emphasises the subject: αὐτοὶ φεύγομεν, we ourselves flee.'),
  order('pr.order', 'pronouns', 'Put the forms of ἐγώ in case order: nominative, accusative, genitive, dative.', ['ἐγώ', 'ἐμέ', 'ἐμοῦ', 'ἐμοί'], 'ἐγώ (I), ἐμέ (me), ἐμοῦ (of me), ἐμοί (to me).'),
  mcq('pr.hemas', 'pronouns', 'Which word means “us”?', [['ἡμᾶς', true], ['ἡμεῖς', false, 'ἡμεῖς is the nominative: we.'], ['ὑμᾶς', false, 'ὑμᾶς is “you” (plural).']], 'ἡμεῖς, ἡμᾶς, ἡμῶν, ἡμῖν. The υ/η difference matters: ὑμεῖς is “you”.'),
);

// --- demonstratives and the relative
push(
  mcq('dm.houtos', 'demonstratives', 'What does **οὗτος ὁ ἀνήρ** mean?', [['this man', true], ['that man', false, 'That man is ἐκεῖνος ὁ ἀνήρ.'], ['a man like this', false, '“Such a man” would be τοιοῦτος ἀνήρ.']], 'οὗτος stands outside the article: οὗτος ὁ ἀνήρ or ὁ ἀνὴρ οὗτος, this man.'),
  mcq('dm.ekeine', 'demonstratives', 'What does **ἐκείνη ἡ κόρη** mean?', [['that girl', true], ['this girl', false, 'This girl is αὕτη ἡ κόρη.'], ['her girl', false, 'Her girl would be ἡ κόρη αὐτῆς.']], 'ἐκεῖνος, ἐκείνη, ἐκεῖνο: that.'),
  mcq('dm.tauten', 'demonstratives', 'Which form of οὗτος goes with **τὴν ναῦν** (the ship, feminine accusative)?', [['ταύτην', true], ['τοῦτον', false, 'τοῦτον is masculine.'], ['τοῦτο', false, 'τοῦτο is neuter.']], 'ταύτην τὴν ναῦν, this ship. οὗτος, αὕτη, τοῦτο; accusative τοῦτον, ταύτην, τοῦτο.'),
  mcq('dm.tauta', 'demonstratives', 'What does **ταῦτα** mean?', [['these things', true], ['this man', false, 'This man is οὗτος.'], ['those women', false, 'Those women would be ἐκεῖναι.']], 'ταῦτα is neuter plural: these things. Greek often uses it for “this” about something just said.'),
  fact('dm.eipon', 'demonstratives', 'What does **ταῦτα εἰπών** mean at the start of a sentence?', 'having said these things', ['saying those words later', 'he says this', 'these men speak'], 'εἰπών is the aorist participle of λέγω: “having said this”, a favourite way to move a story on.', C),
  mcq('dm.ekeinos', 'demonstratives', 'Which word means “that” (masculine, nominative)?', [['ἐκεῖνος', true], ['οὗτος', false, 'οὗτος means this.'], ['αὐτός', false, 'αὐτός means him, -self or the same.']], 'οὗτος = this (near), ἐκεῖνος = that (further away).'),
  mcq('dm.hon', 'demonstratives', 'In **ὁ ἀνὴρ ὃν ὁρῶ στρατηγός ἐστιν** (ὁρῶ = I see), why is the relative ὅν accusative?', [['It is the object of ὁρῶ in its own clause', true], ['Because ὁ ἀνήρ is accusative', false, 'ὁ ἀνήρ is nominative. The relative takes its case from its own clause.'], ['Relative pronouns are always in the accusative', false, 'They can be any case.']], '“The man whom I see is a general.” Gender and number from ὁ ἀνήρ (masculine singular); case from ὁρῶ (object).'),
  mcq('dm.he', 'demonstratives', 'Translate **ἡ κόρη ἣ ᾄδει καλή ἐστιν**.', [['The girl who is singing is beautiful.', true], ['The beautiful girl sings.', false, 'ἣ ᾄδει is a relative clause: “who is singing”. The main verb is ἐστιν.'], ['The girl sings to the beautiful woman.', false, 'There is no second woman.']], 'ἥ is the relative (feminine nominative): who. In running text its accent turns grave: ἣ.'),
  mcq('dm.ha', 'demonstratives', 'Which relative goes with **τὰ δῶρα** as the subject of its clause (“the gifts which…”)?', [['ἅ', true], ['ἅς', false, 'ἅς is feminine accusative plural.'], ['οἵ', false, 'οἵ is masculine plural.']], 'Neuter plural nominative: ἅ. τὰ δῶρα ἃ ἐκεῖ ἐστιν = the gifts which are there.'),
  mcq('dm.accent', 'demonstratives', 'How do you tell **ἡ** (the, feminine) from **ἥ** (who, feminine)?', [['The article ἡ has no accent; the relative ἥ has one', true], ['They are the same word, written two ways', false, 'Same letters, different words: the accent tells them apart.'], ['ἥ is the plural form of the article ἡ', false, 'Both are singular.']], 'ὁ, ἡ, οἱ, αἱ have no accent. The relatives ὅς, ἥ, οἵ, αἵ always do.'),
  mcq('dm.these', 'demonstratives', 'Translate **οὗτοι οἱ στρατιῶται ἐκεῖνον τὸν ποταμὸν φυλάσσουσιν**.', [['These soldiers guard that river.', true], ['Those soldiers guard this river.', false, 'οὗτοι = these; ἐκεῖνον = that.'], ['These rivers guard the soldiers.', false, 'οἱ στρατιῶται (nominative) are the subject.']], 'οὗτοι οἱ στρατιῶται: these soldiers. ἐκεῖνον τὸν ποταμόν: that river. φυλάσσουσιν: they guard.'),
);

// --- comparison
push(
  mcq('cm.comp', 'comparison', 'What does **σοφώτερος** mean?', [['wiser', true], ['wisest', false, 'Wisest is σοφώτατος.'], ['wisdom', false, 'Wisdom is σοφία.']], 'σοφός, σοφώτερος, σοφώτατος: wise, wiser, wisest.'),
  mcq('cm.sup', 'comparison', 'What does **σοφώτατος** mean?', [['wisest, or very wise', true], ['wiser, or rather wise', false, 'Wiser is σοφώτερος.'], ['too wise, or over-wise', false, 'Greek uses the superlative for “very”, not “too”.']], 'The superlative can mean “the most…” or just “very…”.'),
  mcq('cm.omega', 'comparison', 'Why is it σοφώτερος but δεινότερος?', [['A short syllable before it lengthens ο to ω', true], ['δεινός is irregular, like ἀγαθός', false, 'Both are regular.'], ['It is a spelling choice that varies by author', false, 'It is a rule.']], 'σο- is short, so σοφώτερος (also νεώτερος); δει- is long, so δεινότερος (also μικρότερος).'),
  mcq('cm.ameinon', 'comparison', 'What does **ἀμείνων** mean?', [['better', true], ['best', false, 'Best is ἄριστος.'], ['worse', false, 'Worse is κακίων.']], 'ἀγαθός, ἀμείνων, ἄριστος: good, better, best.'),
  mcq('cm.megas', 'comparison', 'Which is the superlative of **μέγας** (big)?', [['μέγιστος', true], ['μείζων', false, 'μείζων is the comparative: bigger.'], ['μεγάλη', false, 'μεγάλη is the feminine of μέγας.']], 'μέγας, μείζων, μέγιστος: big, bigger, biggest. The Cyclops was μέγιστος.'),
  fact('cm.aristo', 'comparison', 'Which English word comes from **ἄριστος** (best) + κράτος (power)?', 'aristocracy', ['democracy', 'autocracy', 'arithmetic'], 'Aristocracy: rule by the best (or by those who think they are).'),
  mcq('cm.gen', 'comparison', 'Translate **ὁ Ἀχιλλεὺς ἀνδρειότερός ἐστι τοῦ Ἕκτορος**.', [['Achilles is braver than Hector.', true], ['Hector is braver than Achilles.', false, 'τοῦ Ἕκτορος is genitive: “than Hector”.'], ['Achilles is Hector’s bravest man.', false, 'ἀνδρειότερος is comparative: braver.']], 'The genitive on its own can mean “than”: τοῦ Ἕκτορος, than Hector.'),
  mcq('cm.e', 'comparison', 'Translate **ἡ Ἀθηνᾶ σοφωτέρα ἐστὶν ἢ ὁ Ἄρης**.', [['Athena is wiser than Ares.', true], ['Ares is wiser than Athena.', false, 'The comparative goes with ἡ Ἀθηνᾶ; ἤ (than) introduces Ares.'], ['Athena and Ares are wise.', false, 'σοφωτέρα is comparative: wiser.']], 'ἤ = than, with both people in the same case.'),
  mcq('cm.hos', 'comparison', 'What does **ὡς τάχιστα** mean?', [['as quickly as possible', true], ['as slowly as possible', false, 'τάχιστα is from ταχύς, quick.'], ['faster than ever before', false, 'Faster is θᾶττον.']], 'ὡς + superlative = as … as possible: ὡς τάχιστα, as fast as possible.'),
  mcq('cm.kakion', 'comparison', 'Which is the comparative of **κακός** (bad)?', [['κακίων (worse)', true], ['κακώτερος', false, 'κακός is irregular.'], ['κάκιστος', false, 'κάκιστος is the superlative: worst.']], 'κακός, κακίων, κάκιστος: bad, worse, worst.'),
  fact('cm.pleistoi', 'comparison', 'What does **οἱ πλεῖστοι τῶν στρατιωτῶν** mean?', 'most of the soldiers', ['fewer soldiers', 'the bravest soldiers', 'all the soldiers'], 'πολύς, πλείων, πλεῖστος: much, more, most.', C),
  mcq('cm.kallion', 'comparison', 'In Arachne’s boast **ἐγὼ κάλλιον ὑφαίνω ἢ ἡ Ἀθηνᾶ**, what does κάλλιον mean?', [['more beautifully', true], ['most beautifully', false, 'Most beautifully would be κάλλιστα.'], ['beautiful', false, 'Beautiful is καλός.']], 'The neuter comparative works as an adverb: κάλλιον, more beautifully. καλός, καλλίων, κάλλιστος.'),
);

// --- the weak aorist and the augment
push(
  tmpl('aw', 'aorist-weak', 'y8hAorist'),
  order('aw.order', 'aorist-weak', 'Put the weak aorist of λύω in order: I, you (sg), he, we, you (pl), they.', ['ἔλυσα', 'ἔλυσας', 'ἔλυσε(ν)', 'ἐλύσαμεν', 'ἐλύσατε', 'ἔλυσαν'], 'ἔλυσα, ἔλυσας, ἔλυσε(ν), ἐλύσαμεν, ἐλύσατε, ἔλυσαν: I freed… they freed.'),
  mcq('aw.akouo', 'aorist-weak', 'What is the aorist of **ἀκούω** (I hear), “I heard”?', [['ἤκουσα', true], ['ἐάκουσα', false, 'A verb starting with a vowel lengthens it instead of adding ἐ-: α → η.'], ['ἀκούσω', false, 'That has no augment: it looks like a future.']], 'Augment on a vowel: α → η, ε → η, ο → ω. ἀκούω → ἤκουσα.'),
  mcq('aw.apo', 'aorist-weak', 'What is the aorist of **ἀποπέμπω** (I send away), “I sent away”?', [['ἀπέπεμψα', true], ['ἐαποπέμψα', false, 'The augment goes after the prefix, not before it.'], ['ἀποπέμψω', false, 'That is the future: no augment.']], 'ἀπο- + ἐ + πεμψα → ἀπέπεμψα (the ο of ἀπο- drops out before the ε).'),
  mcq('aw.psi', 'aorist-weak', 'Why is the aorist of γράφω written **ἔγραψα**?', [['φ + σ is written ψ', true], ['γράφω is irregular', false, 'It is regular: ἐ + γραφ + σα.'], ['ψ is the sign of the past', false, 'The augment shows the past; ψ is just φ + σ.']], 'π, β, φ + σ → ψ (ἔπεμψα, ἔγραψα); κ, γ, χ + σ → ξ (ἐδίωξα).'),
  mcq('aw.ediox', 'aorist-weak', 'What does **ἐδίωξαν** mean?', [['they chased', true], ['they were chasing', false, 'They were chasing is ἐδίωκον.'], ['they chase', false, 'The augment ἐ- shows a past tense.']], 'ἐ- + διωκ + σαν → ἐδίωξαν (κ + σ = ξ): they chased.'),
  mcq('aw.contrast', 'aorist-weak', 'What is the difference between **ἐπαίδευε** and **ἐπαίδευσε**?', [['ἐπαίδευε = he was teaching; ἐπαίδευσε = he taught', true], ['ἐπαίδευε = he taught; ἐπαίδευσε = he was teaching', false, 'The σ marks the aorist: one finished action.'], ['ἐπαίδευσε is the future: he will teach', false, 'The augment shows it is past.']], 'Imperfect: a continuing action. Aorist: a single, completed action.'),
  mcq('aw.keleuo', 'aorist-weak', 'Which form means “he ordered” (from κελεύω)?', [['ἐκέλευσε(ν)', true], ['κελεύσει', false, 'κελεύσει is the future: he will order.'], ['ἐκέλευε(ν)', false, 'ἐκέλευε(ν) is the imperfect: he was ordering.']], 'ἐ- + κελευ + σε: ἐκέλευσε(ν), he ordered.'),
  mcq('aw.poieo', 'aorist-weak', 'What does **ἐποίησε(ν)** (from ποιέω, I make) mean?', [['he made', true], ['he makes', false, 'He makes is ποιεῖ.'], ['he was making', false, 'He was making is ἐποίει.']], 'Contracted verbs lengthen the stem vowel before the σ: ποιε- → ποιησα. ἐποίησε(ν), he made.'),
  mcq('aw.ethelo', 'aorist-weak', 'What happens to the augment of a verb that begins with **ε**, like ἐθέλω?', [['The ε lengthens to η: ἤθελον (I was wishing)', true], ['The ε doubles: εεθελον (I was wishing)', false, 'Greek lengthens the vowel instead.'], ['The ε becomes ει: εἴθελον (I was wishing)', false, 'ἐθέλω augments to η, not ει: ἤθελον. (A few verbs, like ἔχω → εἶχον, do use ει.)']], 'ε → η: ἐθέλω, ἤθελον. Odysseus ἤθελε τῶν Σειρήνων ἀκούειν.'),
  fact('aw.pisteuo', 'aorist-weak', 'Which is the aorist of **πιστεύω**, “I trusted”?', 'ἐπίστευσα', ['πιστεύσω', 'ἐπίστευον', 'πιστεύσας'], 'πιστεύσω is future, ἐπίστευον imperfect, πιστεύσας the aorist participle.', C),
  mcq('aw.elusamen', 'aorist-weak', 'What does **ἐλύσαμεν** mean?', [['we freed', true], ['we were freeing', false, 'We were freeing is ἐλύομεν.'], ['you (plural) freed', false, 'You (plural) freed is ἐλύσατε.']], '-σαμεν: the weak aorist “we” ending.'),
);

// --- strong and irregular aorists
push(
  tmpl('as', 'aorist-strong', 'y8hAorist2'),
  mcq('as.elabe', 'aorist-strong', 'λαμβάνω (I take) has the aorist ἔλαβον. What does **ἔλαβε(ν)** mean?', [['he took', true], ['he was taking', false, 'He was taking is ἐλάμβανε(ν), on the present stem.'], ['he takes', false, 'The augment shows the past.']], 'Strong aorist: new stem λαβ- with the imperfect-style endings -ον, -ες, -ε(ν)…'),
  mcq('as.stem', 'aorist-strong', 'How do you tell the imperfect **ἔφευγον** from the aorist **ἔφυγον**?', [['By the stem: φευγ- (imperfect) or φυγ- (aorist)', true], ['By the ending: the aorist has -σα instead of -ον', false, 'Both have -ον, -ες, -ε…: only the stem differs.'], ['ἔφυγον has no augment; ἔφευγον does', false, 'Both have the augment ἐ-.']], 'Learn every strong aorist with its stem: φεύγω, ἔφυγον; λαμβάνω, ἔλαβον; μανθάνω, ἔμαθον.'),
  fact('as.eidon', 'aorist-strong', 'Which is the aorist of **ὁράω** (I see), “I saw”?', 'εἶδον', ['ἑώρων', 'ὄψομαι', 'ἰδών'], 'ὁράω, ἑώρων (I was seeing), ὄψομαι (I will see), εἶδον (I saw), ἰδών (having seen). “Idea” comes from the same root.', C),
  fact('as.elthon', 'aorist-strong', 'Which is the aorist of **ἔρχομαι** (I come, go), “I came”?', 'ἦλθον', ['ἐλθών', 'ἐρχόμεθα', 'ἔρχεται'], 'ἔρχομαι, ἦλθον; aorist participle ἐλθών (having come).', C),
  fact('as.eipon', 'aorist-strong', 'What does **εἶπον** mean?', 'I said', ['I saw', 'I took', 'I went'], 'εἶπον is the aorist of λέγω: I said (or they said).', { accept: ['said', 'they said', 'i spoke', 'spoke', 'i told', 'told'] }),
  mcq('as.math', 'aorist-strong', 'μανθάνω (I learn) has the aorist ἔμαθον. Which English word shares its root?', [['mathematics (what is learned)', true], ['marathon (a long race)', false, 'Marathon is a place name.'], ['method (a way of doing)', false, 'Method comes from μετά + ὁδός (a way after).']], 'μάθημα = something learned; μαθηματικός = keen to learn.'),
  mcq('as.apethane', 'aorist-strong', 'What does **ἀπέθανε(ν)** (from ἀποθνῄσκω, I die) mean?', [['he died', true], ['he was dying', false, 'He was dying is ἀπέθνῃσκε(ν), on the present stem.'], ['he killed', false, 'He killed is ἀπέκτεινε(ν), from ἀποκτείνω.']], 'ἀποθνῄσκω, ἀπέθανον: a compound, so the augment sits after ἀπο-.'),
  mcq('as.pathos', 'aorist-strong', 'ἔπαθον is the aorist of πάσχω (I suffer). Which English words are related?', [['pathetic, sympathy, empathy', true], ['path, pathway and footpath', false, 'Path is an old English word.'], ['pasta, paste and pastry', false, 'They come (through Italian, French and Latin) from a different Greek word, πάστη (barley porridge), not from πάσχω.']], 'πάθος = suffering, feeling. Sympathy = feeling with someone.'),
  mcq('as.egagomen', 'aorist-strong', '**ἠγάγομεν** comes from ἄγω (I lead). What does it mean?', [['we led', true], ['we were leading', false, 'We were leading is ἤγομεν.'], ['we will lead', false, 'The augment (α → η) shows it is past.']], 'ἄγω has the strong aorist ἤγαγον, with a doubled stem ἀγαγ-.'),
  fact('as.heuron', 'aorist-strong', 'Which is the aorist of **εὑρίσκω** (I find), “I found”?', 'εὗρον', ['εὑρήσω', 'εὑρών', 'εὑρίσκει'], 'εὑρίσκω, εὗρον. Archimedes shouted εὕρηκα (eureka), “I have found it!”: that is the perfect tense.', C),
  mcq('as.ebalon', 'aorist-strong', '**ἔβαλλον** or **ἔβαλον**: which means “I threw” (a single throw)?', [['ἔβαλον (aorist, one λ)', true], ['ἔβαλλον (imperfect, two λ)', false, 'ἔβαλλον has the present stem βαλλ-: I was throwing.'], ['They mean the same', false, 'The single λ is the aorist stem.']], 'βάλλω, ἔβαλον. A “ballistic” missile is a thrown one.'),
);

// --- infinitives and commands
push(
  mcq('in.which', 'infinitives', 'Which pair are both infinitives?', [['λύειν and λῦσαι', true], ['λύει and λύσει', false, 'λύει = he frees; λύσει = he will free.'], ['λύων and λύσας', false, 'Those are participles.']], 'Present infinitive -ειν; weak aorist infinitive -σαι; strong aorist infinitive -εῖν (λαβεῖν).'),
  mcq('in.phygein', 'infinitives', 'What does **ἐθέλω φυγεῖν** mean?', [['I want to flee', true], ['I fled', false, 'I fled is ἔφυγον.'], ['I want them to flee', false, 'There is no “them”: the wanter and the fleer are the same person.']], 'φυγεῖν is the strong aorist infinitive of φεύγω: to flee (once).'),
  mcq('in.dei', 'infinitives', 'What does **δεῖ ἡμᾶς μένειν** mean?', [['We must stay', true], ['We want to stay', false, 'Wanting is ἐθέλω.'], ['They stay with us', false, 'ἡμᾶς is “us”, the people who must stay.']], 'δεῖ + accusative + infinitive: “it is necessary for us to stay”, so “we must stay”.'),
  mcq('in.keleuo', 'infinitives', '**ὁ βασιλεὺς ἐκέλευσε τοὺς δούλους τὸν ἵππον λῦσαι.** What did the king order?', [['the slaves to free the horse', true], ['the horse to free the slaves', false, 'τοὺς δούλους (accusative) are the people ordered; τὸν ἵππον is the object of λῦσαι.'], ['the slaves to be freed', false, 'λῦσαι is active: to free.']], 'κελεύω + accusative (the person) + infinitive (the action).'),
  mcq('in.labein', 'infinitives', 'Which is the aorist infinitive of **λαμβάνω**?', [['λαβεῖν', true], ['λαμβάνειν', false, 'λαμβάνειν is the present infinitive.'], ['ἔλαβον', false, 'ἔλαβον is “I took”, not an infinitive.']], 'Strong aorist stem λαβ- + -εῖν: λαβεῖν, to take.'),
  mcq('in.pheuge', 'infinitives', 'What does **φεῦγε** mean?', [['Flee! (said to one person)', true], ['he flees', false, 'He flees is φεύγει.'], ['Flee! (said to several people)', false, 'To several people: φεύγετε.']], 'Present imperative: φεῦγε (singular), φεύγετε (plural).'),
  mcq('in.lysate', 'infinitives', 'Odysseus shouts **λύσατέ με!** to his crew. What does he mean?', [['Untie me! (to more than one person)', true], ['You (plural) untied me.', false, 'λύσατε has no augment, so it is a command. “You untied” is ἐλύσατε.'], ['Untie me! (to one person only)', false, 'To one person it would be λῦσόν με; λύσατε is plural.']], 'Aorist imperative: λῦσον (singular), λύσατε (plural).'),
  mcq('in.me', 'infinitives', 'How do you say “Don’t flee!” to one person?', [['μὴ φεῦγε', true], ['οὐ φεῦγε', false, 'Commands use μή, not οὐ.'], ['φεῦγε οὐκ', false, 'The negative goes first, and with a command it is μή.']], 'μή + imperative = “don’t…!”'),
  mcq('in.augment', 'infinitives', 'What is the difference between **λύσατε** and **ἐλύσατε**?', [['λύσατε is a command; ἐλύσατε is a statement', true], ['None: they both mean “you freed”', false, 'The augment ἐ- makes it a past statement.'], ['λύσατε is the future: you will free', false, 'The future is λύσετε.']], 'No augment on imperatives or infinitives: the augment belongs only to past statements.'),
  fact('in.akoue', 'infinitives', 'What does **ἄκουε** mean?', 'Listen!', ['he listens', 'to listen', 'they listen'], 'ἄκουε: present imperative of ἀκούω, said to one person.', { accept: ['listen', 'hear', 'hear!'] }),
  mcq('in.idein', 'infinitives', 'Which word fills the gap: **ἐθέλομεν τὴν πόλιν ___** (we want to see the city)?', [['ἰδεῖν', true], ['εἶδον', false, 'εἶδον = I saw: not an infinitive.'], ['ὁρᾷ', false, 'ὁρᾷ = he sees.']], 'ἰδεῖν is the strong aorist infinitive of ὁράω: to see.'),
);

// --- contracted verbs
push(
  tmpl('ct', 'contracted', 'y8hContract'),
  order('ct.order', 'contracted', 'Put the present of φιλέω in order: I, you (sg), he, we, you (pl), they.', ['φιλῶ', 'φιλεῖς', 'φιλεῖ', 'φιλοῦμεν', 'φιλεῖτε', 'φιλοῦσι(ν)'], 'φιλῶ, φιλεῖς, φιλεῖ, φιλοῦμεν, φιλεῖτε, φιλοῦσι(ν): I love… they love.'),
  mcq('ct.ou', 'contracted', 'How does φιλέομεν become **φιλοῦμεν**?', [['ε + ο contracts to ου', true], ['The ε is just dropped', false, 'It merges with the ο to make ου.'], ['ο doubles to ου', false, 'The ου comes from ε + ο.']], 'ε + ο = ου; ε + ε = ει; ε + ω = ω.'),
  mcq('ct.poiousi', 'contracted', 'What does **ποιοῦσι(ν)** mean?', [['they make (or do)', true], ['he makes (or does)', false, 'He makes is ποιεῖ.'], ['we make (or do)', false, 'We make is ποιοῦμεν.']], 'ποιέ-ουσι → ποιοῦσι (ε + ου = ου). “Poet” comes from ποιητής, a maker.'),
  mcq('ct.inf', 'contracted', 'Which is the infinitive of **φιλέω**?', [['φιλεῖν', true], ['φιλέειν', false, 'The ε + ει contracts to ει.'], ['φιλοῦν', false, 'φιλοῦν is the neuter participle.']], 'φιλέ-ειν → φιλεῖν, to love.'),
  fact('ct.zetei', 'contracted', 'What does **ζητεῖ** (from ζητέω) mean?', 'he seeks', ['he lives', 'he helps', 'he loves'], 'ζητέω = I seek, look for: ζητεῖ, he or she seeks.', { accept: ['she seeks', 'he looks for', 'she looks for', 'seeks', 'looks for', 'he searches for', 'he is looking for'] }),
  fact('ct.oikoumen', 'contracted', 'What does **οἰκοῦμεν** (from οἰκέω) mean?', 'we live', ['we seek', 'they live', 'we help'], 'οἰκέω = I live, dwell (related to οἶκος, house). οἰκοῦμεν = we live.', { accept: ['we dwell', 'we inhabit', 'we live in'] }),
  mcq('ct.boethousin', 'contracted', 'In the Cyclops story, **οὐ βοηθοῦσιν** means…', [['they do not help', true], ['they do not shout', false, 'They shout would be βοῶσι(ν), from βοάω.'], ['he does not help', false, '-οῦσιν is “they”.']], 'βοηθέω = I help: βοηθοῦσιν, they help.'),
  mcq('ct.horomen', 'contracted', 'What does **ὁρῶμεν** (from ὁράω) mean?', [['we see', true], ['we saw', false, 'We saw is εἴδομεν.'], ['you (plural) see', false, 'You (plural) see is ὁρᾶτε.']], 'In -άω verbs, α + ο = ω: ὁρά-ομεν → ὁρῶμεν.'),
  mcq('ct.tima', 'contracted', 'What does **τιμᾷ** mean?', [['he honours', true], ['honour (the noun)', false, 'The noun is τιμή.'], ['they honour', false, 'They honour is τιμῶσι(ν).']], 'τιμά-ει → τιμᾷ: α + ει = ᾳ.'),
  mcq('ct.aor', 'contracted', 'Why is the aorist of ποιέω **ἐποίησα**, not ἐποίεσα?', [['Contracted verbs lengthen ε to η before the σ', true], ['It is irregular, like many common verbs', false, 'Almost all -έω verbs do this: ἐφίλησα, ἐζήτησα (καλέω, with its aorist ἐκάλεσα, is one exception).'], ['The η is part of the augment', false, 'The η is just the lengthened stem vowel.']], 'φιλέω → ἐφίλησα; ποιέω → ἐποίησα; ζητέω → ἐζήτησα.'),
  mcq('ct.not', 'contracted', 'Which of these is NOT a contracted verb?', [['λύω', true], ['φιλέω', false, 'φιλέω contracts: φιλῶ.'], ['ὁράω', false, 'ὁράω contracts: ὁρῶ.']], 'Contracted verbs have a stem ending in ε, α or ο, which merges with the ending. λύω’s endings stay as they are.'),
);

// --- the middle and passive
push(
  tmpl('mp', 'middle', 'y8hMiddle'),
  mcq('mp.lyetai', 'middle', 'What does **λύεται** mean?', [['he, she or it is (being) freed', true], ['he, she or it frees', false, 'He frees is λύει.'], ['he, she or it will free', false, 'He will free is λύσει.']], '-εται is the middle/passive “he/she/it” ending.'),
  mcq('mp.hypo', 'middle', 'Translate **ὁ ἵππος ὑπὸ τοῦ δούλου λύεται**.', [['The horse is freed by the slave.', true], ['The horse frees the slave.', false, 'λύεται is passive: the horse is being freed.'], ['The slave is freed by the horse.', false, 'ὑπὸ τοῦ δούλου (genitive) = by the slave.']], 'ὑπό + genitive = “by” a person, with a passive verb.'),
  mcq('mp.deponent', 'middle', 'What is a deponent verb?', [['A verb with middle/passive endings but an active meaning', true], ['A verb with active endings but a passive meaning', false, 'The reverse: deponents look middle/passive but mean something active.'], ['A verb that only takes an object in the dative', false, 'That is a different idea.']], 'βούλομαι (I want), γίγνομαι (I become), ἔρχομαι (I come), μάχομαι (I fight), δέχομαι (I receive).'),
  fact('mp.boulomai', 'middle', 'What does **βούλομαι** mean?', 'I want', ['I become', 'I fight', 'I receive'], 'βούλομαι = I want, wish (a deponent). The βουλή was the Council, which prepared business for the Assembly to decide.', { accept: ['want', 'i wish', 'wish', 'i want to'] }),
  fact('mp.gignetai', 'middle', 'What does **γίγνεται** mean?', 'he, she or it becomes', ['he, she or it wants', 'he, she or it fights', 'he, she or it receives'], 'γίγνομαι = I become, happen (a deponent). Genesis comes from the same root.', { accept: ['becomes', 'he becomes', 'she becomes', 'it becomes', 'happens', 'it happens'] }),
  mcq('mp.ontai', 'middle', 'Which ending means “they” in the middle and passive?', [['-ονται (λύονται)', true], ['-ουσι(ν) (λύουσι)', false, '-ουσι(ν) is the active ending.'], ['-ομεθα (λυόμεθα)', false, '-ομεθα means “we”.']], 'Middle/passive: -ομαι, -ει (or -ῃ), -εται, -ομεθα, -εσθε, -ονται.'),
  mcq('mp.lithoi', 'middle', 'In the Medusa story, **λίθοι γίγνονται** means…', [['they become stones', true], ['they throw stones', false, 'Throw is βάλλω.'], ['stones are born', false, 'Here γίγνονται means “become”: people turn into stones.']], 'γίγνονται: they become.'),
  mcq('mp.erchesthe', 'middle', 'What does **ἔρχεσθε** mean?', [['you (plural) come, or go', true], ['you (singular) come, or go', false, 'You (singular) come is ἔρχῃ (or ἔρχει).'], ['they come, or go', false, 'They come is ἔρχονται.']], '-εσθε: the middle/passive “you” (plural) ending.'),
  mcq('mp.inf', 'middle', 'What is the present middle/passive infinitive of λύω?', [['λύεσθαι (to be freed)', true], ['λύειν (to free)', false, 'λύειν is active: to free.'], ['λῦσαι (to free, aorist)', false, 'λῦσαι is the aorist active: to free.']], 'Middle/passive infinitive: -εσθαι. Daedalus tells Icarus μὴ… πέτεσθαι, not to fly.'),
  mcq('mp.machontai', 'middle', 'Translate **οἱ Ἕλληνες μάχονται**.', [['The Greeks are fighting.', true], ['The Greeks are being fought.', false, 'μάχομαι is a deponent: its meaning is active.'], ['The Greeks fought.', false, 'μάχονται is present.']], 'μάχομαι = I fight: μάχονται, they fight.'),
  mcq('mp.petetai', 'middle', 'In the Icarus story, **πρὸς τὸν ἥλιον πέτεται** (πέτομαι = I fly) means…', [['he flies towards the sun', true], ['he is flown by the sun', false, 'πέτομαι is a deponent: active meaning.'], ['the sun flies towards him', false, 'τὸν ἥλιον is accusative after πρός: towards the sun.']], 'πέτεται: he flies. πρός + accusative = towards.'),
);

// --- participles
push(
  tmpl('pt', 'participles-full', 'y8hPart'),
  mcq('pt.idon', 'participles-full', 'What does **ἰδών** mean?', [['having seen, after seeing', true], ['seeing (at the same time)', false, 'Seeing is ὁρῶν, the present participle.'], ['he saw', false, 'He saw is εἶδε(ν).']], 'ἰδών is the aorist participle of ὁράω (from the aorist stem ἰδ-).'),
  mcq('pt.labon', 'participles-full', 'Translate **ὁ Περσεὺς τὴν κεφαλὴν λαβὼν ἀπέφυγεν**.', [['Having taken the head, Perseus escaped.', true], ['Perseus took the head, and the head escaped.', false, 'λαβών is masculine nominative: it goes with ὁ Περσεύς.'], ['While taking the head, Perseus is escaping.', false, 'The aorist participle comes first in time, and ἀπέφυγεν is past.']], 'λαβών = having taken: the taking happens first, then the escape.'),
  mcq('pt.agree', 'participles-full', 'In **ὁ δοῦλος τὴν κόρην φεύγουσαν ὁρᾷ** (ὁρᾷ = sees), who is fleeing?', [['the girl', true], ['the slave', false, 'φεύγουσαν is feminine accusative, like τὴν κόρην.'], ['both of them', false, 'The participle agrees with only one noun: τὴν κόρην.']], 'The slave sees the girl (who is) fleeing.'),
  mcq('pt.on', 'participles-full', 'Which is the masculine present participle of εἰμί (being)?', [['ὤν', true], ['ἐστί(ν)', false, 'ἐστί(ν) = is.'], ['οὖσα', false, 'οὖσα is feminine.']], 'ὤν, οὖσα, ὄν: being. σοφώτατος ὤν = being the wisest.'),
  mcq('pt.machomenoi', 'participles-full', 'Translate **οἱ στρατιῶται μαχόμενοι ἀπέθανον**.', [['The soldiers died fighting.', true], ['The soldiers fought and killed.', false, 'ἀπέθανον = they died (killed is ἀπέκτειναν).'], ['The dead soldiers fought.', false, 'μαχόμενοι is the participle; ἀπέθανον is the main verb.']], 'μαχόμενοι: the present participle of μάχομαι, “(while) fighting”.'),
  mcq('pt.pheugon', 'participles-full', 'What does **ὁ φεύγων** mean?', [['the man who is fleeing (the fugitive)', true], ['he flees (a present-tense verb)', false, 'He flees is φεύγει.'], ['the flight (the act of fleeing)', false, 'Flight is φυγή.']], 'The article + a participle = “the one who…”.'),
  mcq('pt.akousasa', 'participles-full', 'Which participle goes with **ἡ θεά** (the goddess): “the goddess, having heard…”?', [['ἀκούσασα', true], ['ἀκούσας', false, 'ἀκούσας is masculine.'], ['ἀκοῦσαν', false, 'ἀκοῦσαν is neuter.']], 'Aorist participle: ἀκούσας, ἀκούσασα, ἀκοῦσαν. ἡ θεὰ ἀκούσασα = the goddess, having heard.'),
  mcq('pt.menontes', 'participles-full', 'How is **οἱ μένοντες** best translated?', [['those who stay', true], ['because they stay', false, 'With the article, a participle means “those who…”.'], ['Stay!', false, 'Stay! (plural) is μένετε.']], 'οἱ μένοντες = the ones staying, those who stay.'),
  mcq('pt.eipon', 'participles-full', 'Translate **ταῦτα εἰπὼν ὁ στρατηγὸς ἀπῆλθεν**.', [['Having said this, the general went away.', true], ['The general said this and stayed.', false, 'ἀπῆλθεν = went away.'], ['While saying this, the general is going away.', false, 'εἰπών is aorist (having said), and ἀπῆλθεν is past.']], 'εἰπών: aorist participle of λέγω. ἀπῆλθεν: aorist of ἀπέρχομαι, went away.'),
  mcq('pt.tense', 'participles-full', 'What does the difference between **λύων** and **λύσας** show?', [['λύων: while freeing; λύσας: having freed', true], ['λύων is future; λύσας is present', false, 'The future participle is λύσων.'], ['λύσας: while freeing; λύων: having freed', false, 'The tense of a participle shows the timing.']], 'Present participle = same time; aorist participle = earlier.'),
);

// --- the cases
push(
  mcq('cs.xiphei', 'cases', 'What does **τῷ ξίφει** mean in **τὸν λέοντα τῷ ξίφει ἀποκτείνει**?', [['with the sword', true], ['to the sword', false, 'Here the dative is the thing used: “with”.'], ['of the sword', false, '“Of the sword” would be the genitive, τοῦ ξίφους.']], 'The dative of means: τῷ ξίφει, with the sword (ξίφος, -ους, τό).'),
  mcq('cs.ete', 'cases', 'Translate **δέκα ἔτη οἱ Ἕλληνες ἐμάχοντο**.', [['For ten years the Greeks were fighting.', true], ['In the tenth year the Greeks fought.', false, 'The accusative of time means “for” (how long). In the tenth year would be τῷ δεκάτῳ ἔτει.'], ['Ten Greeks were fighting each year.', false, 'δέκα ἔτη is a time phrase: ten years.']], 'Accusative = how long: δέκα ἔτη, for ten years.'),
  mcq('cs.hysteraia', 'cases', 'What does **τῇ ὑστεραίᾳ** mean?', [['on the next day', true], ['for many days', false, 'For many days would be πολλὰς ἡμέρας.'], ['yesterday', false, 'Yesterday is χθές.']], 'Dative = when: τῇ ὑστεραίᾳ (ἡμέρᾳ), on the following day.'),
  mcq('cs.howlong', 'cases', 'Which case answers the question “how long?”', [['accusative', true], ['dative', false, 'The dative says when (on which day).'], ['genitive', false, 'The genitive says within which time (by night, during the day).']], 'Time: accusative = how long; dative = when; genitive = within which.'),
  mcq('cs.nyktos', 'cases', 'What does **νυκτὸς ἔφυγον** mean?', [['they fled by night', true], ['they fled for a night', false, 'For a night would be accusative: νύκτα.'], ['they fled from the night', false, 'There is no preposition: the genitive alone means “during”.']], 'Genitive of time within which: νυκτός, by night.'),
  mcq('cs.phile', 'cases', 'How would you call out “O friend!” in Greek?', [['ὦ φίλε', true], ['ὦ φίλος', false, 'The vocative of -ος nouns ends -ε.'], ['ὁ φίλος', false, 'ὁ is the article: the friend.']], 'The vocative: ὦ φίλε, ὦ δοῦλε, ὦ Ὀδυσσεῦ, ὦ Ζεῦ.'),
  mcq('cs.thygater', 'cases', 'Translate **ἡ τοῦ βασιλέως θυγάτηρ**.', [['the king’s daughter', true], ['the daughter of the kings', false, 'βασιλέως is singular.'], ['the king and his daughter', false, 'There is no “and”: the genitive shows whose daughter.']], 'The genitive of possession can sit between the article and its noun: ἡ τοῦ βασιλέως θυγάτηρ.'),
  mcq('cs.athenaioi', 'cases', 'Speakers in the Athenian assembly began **ὦ ἄνδρες Ἀθηναῖοι**. What does it mean?', [['Men of Athens!', true], ['The men of Athens are here.', false, 'ὦ + vocative calls people; there is no verb.'], ['Of the Athenian men', false, 'That would be the genitive: τῶν Ἀθηναίων ἀνδρῶν.']], 'ὦ + vocative plural: “O Athenian men!”'),
  mcq('cs.pharmako', 'cases', 'In **ὁ Ἰάσων τῷ φαρμάκῳ τοὺς ταύρους ἔζευξεν**, why is τῷ φαρμάκῳ dative?', [['It is the thing he used: with the potion', true], ['It is the direct object of ἔζευξεν', false, 'The object is τοὺς ταύρους.'], ['It shows possession: “of the potion”', false, 'That would be the genitive, τοῦ φαρμάκου.']], 'Dative of means: Jason yoked the bulls with the potion.'),
  mcq('cs.theon', 'cases', 'Which phrase means “of the gods”?', [['τῶν θεῶν', true], ['τοῖς θεοῖς', false, 'τοῖς θεοῖς is dative: to or for the gods.'], ['τοὺς θεούς', false, 'τοὺς θεούς is accusative.']], 'Genitive plural -ων: τῶν θεῶν, of the gods.'),
  mcq('cs.polloi', 'cases', 'What does **οἱ πολλοὶ τῶν στρατιωτῶν** mean?', [['most of the soldiers', true], ['the soldiers’ many friends', false, 'There is no word for friends.'], ['the soldiers of many cities', false, 'There is no word for cities.']], 'The genitive of the whole: “the many of the soldiers”, so most of them.'),
);

// --- questions and negatives
push(
  mcq('qn.tis', 'questions', 'What does **τίς εἶ;** mean?', [['Who are you?', true], ['What is it?', false, 'What is it? is τί ἐστιν;'], ['Where are you?', false, 'Where are you? is ποῦ εἶ;']], 'τίς; = who? εἶ = you are. The Greek question mark is ;'),
  mcq('qn.pou', 'questions', 'What does **ποῦ ἐστιν ὁ Ὀδυσσεύς;** mean?', [['Where is Odysseus?', true], ['When is Odysseus coming?', false, 'When? is πότε;'], ['Who is Odysseus?', false, 'Who? is τίς;']], 'ποῦ; = where? A favourite question in the Odyssey.'),
  mcq('qn.ouch', 'questions', 'Why is it **οὐκ ἐθέλει** but **οὐχ ὁρᾷ**?', [['οὐκ before a smooth breathing; οὐχ before a rough one', true], ['οὐχ is used before verbs that start with a vowel', false, 'ἐθέλει starts with a vowel too: the breathing decides.'], ['οὐχ is a stronger “not”, used for emphasis', false, 'Both mean simply “not”: only the next sound decides.']], 'οὐ before a consonant, οὐκ before a smooth breathing, οὐχ before a rough breathing (ὁρᾷ).'),
  mcq('qn.ara', 'questions', 'Which word introduces a yes-or-no question?', [['ἆρα', true], ['γάρ', false, 'γάρ means “for”.'], ['οὖν', false, 'οὖν means “therefore”.']], 'ἆρα φεύγεις; = Are you fleeing?'),
  mcq('qn.dia', 'questions', 'What does **διὰ τί φεύγεις;** mean?', [['Why are you fleeing?', true], ['Where are you fleeing to?', false, 'Where to? is ποῖ;'], ['Are you fleeing through it?', false, 'διὰ τί is a fixed phrase: “on account of what?”, so why?']], 'διὰ τί; (or just τί;) = why?'),
  mcq('qn.oudeis', 'questions', 'What does **οὐδείς** mean?', [['no one, nobody', true], ['everyone', false, 'Everyone is πάντες.'], ['someone', false, 'Someone is τις.']], 'οὐδείς = no one; οὐδέν = nothing. (The Cyclops was tricked by Οὖτις, “Nobody”, a poetic word.)'),
  mcq('qn.oute', 'questions', 'Translate **οὔτε ὁ βασιλεὺς οὔτε ὁ στρατηγὸς μένει**.', [['Neither the king nor the general stays.', true], ['The king and the general stay.', false, 'οὔτε… οὔτε = neither… nor.'], ['The king stays but the general does not.', false, 'Both are negated.']], 'οὔτε… οὔτε = neither… nor.'),
  mcq('qn.tis2', 'questions', 'How is **τίς** (who?) different from **τις** (someone)?', [['τίς has an accent and asks; τις has none: “someone”', true], ['They are the same word, written with or without stress', false, 'The accent makes the difference.'], ['τις is the plural, “some people”', false, 'Both are singular.']], 'τίς ἐστιν; = Who is it? ἄνθρωπός τις = a certain man, someone.'),
  mcq('qn.me', 'questions', 'Which negative goes with a command, like “don’t look!”?', [['μή', true], ['οὐ', false, 'οὐ is for statements.'], ['οὐδέ', false, 'οὐδέ means “and not” or “not even”.']], 'μὴ βλέπε = don’t look! Hades said this to Orpheus.'),
  fact('qn.pote', 'questions', 'What does **πότε;** mean?', 'when?', ['where?', 'how?', 'who?'], 'πότε; = when? (ποῦ; = where? πῶς; = how?)', { accept: ['when'] }),
  mcq('qn.ouketi', 'questions', 'What does **οὐκέτι** mean in **αἱ κεφαλαὶ οὐκέτι ἐφύοντο**?', [['no longer: the heads no longer grew', true], ['not yet: the heads had not yet grown', false, 'Not yet is οὔπω.'], ['never: the heads never grew', false, 'Never is οὐδέποτε.']], 'οὐκέτι = no longer, not any more.'),
);

// --- the genitive absolute (stretch)
push(
  mcq('ga.night', 'genabs', 'Translate **τῆς νυκτὸς γενομένης, οἱ στρατιῶται ἐξῆλθον**.', [['When night had fallen, the soldiers came out.', true], ['The soldiers of the night came out.', false, 'τῆς νυκτὸς γενομένης is a genitive absolute: it sets the scene.'], ['The soldiers made the night come.', false, 'The soldiers are the subject of ἐξῆλθον only.']], 'Noun + participle in the genitive, apart from the main sentence: “the night having happened”, so “when night had fallen”.'),
  mcq('ga.which', 'genabs', 'Which of these is a genitive absolute?', [['τοῦ βασιλέως φεύγοντος', true], ['ὁ βασιλεὺς φεύγων', false, 'That is nominative: it goes with the subject.'], ['τὸν βασιλέα φεύγοντα', false, 'That is accusative: it goes with an object.']], 'τοῦ βασιλέως φεύγοντος = while the king was fleeing.'),
  mcq('ga.legontos', 'genabs', 'Translate **τοῦ στρατηγοῦ λέγοντος, οἱ στρατιῶται ἤκουον**.', [['While the general was speaking, the soldiers were listening.', true], ['The general’s soldiers were speaking and listening.', false, 'τοῦ στρατηγοῦ λέγοντος is a genitive absolute.'], ['The soldiers listened to the general’s word.', false, 'λέγοντος is a participle, not a noun.']], 'A present participle in a genitive absolute = “while…”.'),
  mcq('ga.when', 'genabs', 'When should you NOT use a genitive absolute?', [['When its noun is already in the main sentence', true], ['When the participle is aorist, not present', false, 'Aorist participles are common in genitive absolutes.'], ['At the start of a sentence, before the verb', false, 'That is exactly where it usually goes.']], 'If the general is the subject, write ὁ στρατηγὸς λέγων…, not a genitive absolute.'),
  mcq('ga.gorgons', 'genabs', 'Translate **τῶν Γοργόνων καθευδουσῶν, ὁ Περσεὺς προσῆλθεν**.', [['While the Gorgons were sleeping, Perseus approached.', true], ['Perseus approached the sleeping Gorgons’ island.', false, 'There is no island in this sentence.'], ['The Gorgons approached Perseus in their sleep.', false, 'ὁ Περσεύς (nominative) is the one who approached.']], 'καθευδουσῶν: feminine genitive plural participle, agreeing with τῶν Γοργόνων.'),
  mcq('ga.lephtheises', 'genabs', 'ληφθείσης means “having been taken”. Translate **τῆς πόλεως ληφθείσης**.', [['when the city had been captured', true], ['the captured city’s men', false, 'There is no word for men.'], ['while the city was capturing them', false, 'ληφθείσης is passive: having been taken.']], 'An aorist passive participle in a genitive absolute: “the city having been taken”.'),
  mcq('ga.menonton', 'genabs', 'Translate **ἡμῶν μενόντων, οἱ πολέμιοι ἔφυγον**.', [['Because we stood our ground, the enemy fled.', true], ['The enemy fled from our friends.', false, 'There is no word for friends.'], ['We stayed, and the enemy stayed too.', false, 'ἔφυγον = they fled.']], 'The genitive absolute can mean “because” as well as “while” or “when”: ἡμῶν μενόντων, us staying.'),
  mcq('ga.sun', 'genabs', 'In **τοῦ ἡλίου δύνοντος** (as the sun was setting), which word is the participle?', [['δύνοντος', true], ['τοῦ', false, 'τοῦ is the article.'], ['ἡλίου', false, 'ἡλίου is the noun.']], 'δύνοντος, from δύνω (I set, of the sun): genitive, agreeing with τοῦ ἡλίου.'),
);

// --- reading 1: Daedalus and Icarus, Arachne
RQ('ic.1', 'read-1', 'Who is Daedalus?', 'a wise craftsman', ['the king of Crete', 'a sea god', 'Icarus’s brother'], '“ὁ Δαίδαλος τεχνίτης σοφός ἐστιν.”', P_ICARUS);
push(
  mcq('ic.2', 'read-1', 'Why does Daedalus make wings?', [['King Minos will not let them go', true], ['He wants to visit the Sun', false, 'Flying near the Sun is what he warns against.'], ['Icarus asks for wings', false, 'The passage does not say so.']], '“ὁ δὲ Μίνως… οὐκ ἐθέλει αὐτοὺς ἀπολύειν. ὁ οὖν Δαίδαλος… πτέρυγας ποιεῖ.” οὖν (so) links the two.', P_ICARUS),
  mcq('ic.3', 'read-1', 'What does Daedalus order his son?', [['not to fly near the sun', true], ['to fly near the sun', false, 'μή means “not”: μὴ ἐγγὺς τοῦ ἡλίου πέτεσθαι.'], ['to stay in Crete', false, 'They both fly away from Crete.']], 'κελεύω + μή + infinitive: he orders him not to fly near the sun.', P_ICARUS),
  mcq('ic.4', 'read-1', 'What case is **πτέρυγας**, and why?', [['accusative plural: it is the object of ποιεῖ', true], ['nominative plural: it is the subject', false, 'The subject is ὁ Δαίδαλος.'], ['genitive: “of wings”', false, 'The genitive plural would be πτερύγων.']], 'πτέρυξ, πτέρυγος: a third-declension noun; -ας is the accusative plural ending.', P_ICARUS),
  mcq('ic.5', 'read-1', 'Translate **ὁ οὖν ἥλιος τὸν κηρὸν λύει**.', [['So the sun melts the wax.', true], ['So the wax frees the sun.', false, 'τὸν κηρόν is accusative: the object.'], ['But the sun stays on the wax.', false, 'λύει means loosens, here melts; οὖν means so.']], 'λύω is the same verb as “I free”: here it loosens, or melts, the wax.', P_ICARUS),
  order('ic.6', 'read-1', 'Put the events of the story in order.', ['Daedalus makes wings', 'Daedalus warns his son', 'Father and son fly out of Crete', 'The sun melts the wax', 'Icarus falls into the sea'], 'Wings, warning, escape, the melting wax, the fall.', P_ICARUS),
);
RQ('ar.1', 'read-1', 'Why do many people admire Arachne?', 'she weaves beautifully', ['she sings beautifully', 'she is a goddess', 'she is very rich'], '“καλῶς ὑφαίνει· πολλοὶ οὖν ἄνθρωποι τὰ ἔργα αὐτῆς θαυμάζουσιν.”', P_ARACHNE);
push(
  mcq('ar.2', 'read-1', 'What is Arachne’s boast?', [['“I weave more beautifully than Athena.”', true], ['“Athena weaves more beautifully than I do.”', false, 'ἐγώ… ἢ ἡ Ἀθηνᾶ: I (do it better) than Athena.'], ['“I am wiser than Athena.”', false, 'ὑφαίνω = I weave.']], 'κάλλιον = more beautifully; ἤ = than.', P_ARACHNE),
  mcq('ar.3', 'read-1', 'What does **αὐτῆς** mean in τὰ ἔργα αὐτῆς?', [['her: “her works”', true], ['herself: “she herself”', false, 'On its own in the genitive, αὐτῆς means “of her”.'], ['the same: “the same works”', false, '“The same” needs the article.']], 'αὐτῆς: genitive of αὐτή, “of her”.', P_ARACHNE),
  mcq('ar.4', 'read-1', 'What was wrong with Arachne’s tapestry?', [['It was beautiful, but it did not honour the gods', true], ['It was ugly, and the threads were tangled', false, '“καλὸν μέν ἐστιν”: it is beautiful.'], ['It was unfinished when the contest ended', false, 'The passage does not say so.']], 'μέν… δέ: beautiful on the one hand, disrespectful on the other.', P_ARACHNE),
  mcq('ar.6', 'read-1', 'Which word in the passage is a contracted verb from -άω?', [['τιμᾷ (from τιμάω)', true], ['ὑφαίνει (from ὑφαίνω)', false, 'ὑφαίνω is not contracted.'], ['ἔρχεται (from ἔρχομαι)', false, 'ἔρχομαι is a deponent, not contracted.']], 'τιμά-ει → τιμᾷ, he or she honours.', P_ARACHNE),
);
RQ('ar.5', 'read-1', 'What does Athena do at the end?', 'she changes Arachne into a spider', ['she gives Arachne a prize', 'she weaves a better tapestry', 'she leaves Lydia'], '“τὴν κόρην εἰς ἀράχνην μεταβάλλει.” Scientists still call spiders arachnids.', P_ARACHNE);

// --- reading 2: Orpheus, the Hydra
RQ('or.1', 'read-2', 'What happened when Orpheus sang?', 'even the trees and the wild animals listened', ['the gods of Olympus fell asleep', 'the rivers flowed backwards to their springs', 'Eurydice danced with the nymphs'], '“καὶ τὰ δένδρα καὶ τὰ θηρία ἤκουεν.” (A neuter plural subject takes a singular verb.)', P_ORPHEUS);
push(
  mcq('or.2', 'read-2', 'What tense is **ᾖδεν**, and how do you know?', [['imperfect: it has an augment and the present stem, with no σ', true], ['future: it has a σ before the ending', false, 'There is no σ.'], ['aorist: it has an augment and a σ', false, 'There is no σ: the aorist would be ᾖσε(ν). ᾖδεν is the imperfect, with the long ῃ as the augment.']], 'ᾄδω, ᾖδον: I was singing. Here, with ὅτε, “whenever he sang”.', P_ORPHEUS),
  mcq('or.4', 'read-2', 'What does Hades tell Orpheus?', [['Lead your wife home, but don’t look at her.', true], ['Stay here with your wife for ever.', false, 'ἄγε… οἴκαδε: lead her home.'], ['Look at your wife, then lead her home.', false, 'μὴ βλέπε: don’t look!']], 'Two commands: ἄγε (lead!) and μὴ βλέπε (don’t look!).', P_ORPHEUS),
  mcq('or.5', 'read-2', 'In **ὁ μὲν Ὀρφεὺς ἡγεῖται, ἡ δὲ Εὐρυδίκη ἕπεται**, what do μέν and δέ do?', [['They contrast the two: one leads, one follows', true], ['They mean “and”, joining two equal actions', false, 'They do join them, but as a contrast: one leads, the other follows.'], ['They make the sentence a question', false, 'There is no question mark (;).']], 'μέν… δέ: on the one hand… on the other.', P_ORPHEUS),
  mcq('or.6', 'read-2', 'Why does Eurydice go back to the Underworld?', [['Near the light, Orpheus looks at her', true], ['Hades changes his mind and calls her', false, 'Hades kept his word.'], ['She refuses to follow him out', false, 'ἡ δὲ Εὐρυδίκη ἕπεται: she follows.']], '“ἐγγὺς δὲ τοῦ φωτὸς ὁ Ὀρφεὺς βλέπει πρὸς αὐτήν.”', P_ORPHEUS),
);
RQ('or.3', 'read-2', 'How did Eurydice die?', 'she was bitten by a snake', ['she fell into the sea', 'she was turned to stone', 'she was killed in a war'], '“ὑπ᾽ ὄφεως δάκνεται”: ὑπό + genitive = by. δάκνεται is passive: she is bitten.', P_ORPHEUS);
RQ('hy.1', 'read-2', 'Where did the Hydra live?', 'in the marsh of Lerna', ['in a cave on Crete', 'in the sea', 'on Mount Olympus'], '“ἐν τῷ ἕλει τῆς Λέρνης”.', P_HYDRA);
push(
  mcq('hy.2', 'read-2', 'What does **εἶχεν** mean, and what tense is it?', [['had: the imperfect of ἔχω', true], ['has: the present of ἔχω', false, 'He has is ἔχει; εἶχεν has the augment (ε → ει).'], ['will have: the future', false, 'There is an augment, so it is past.']], 'ἔχω has an unusual augment: εἶχον, I had, I was having.', P_HYDRA),
  mcq('hy.4', 'read-2', 'How did Iolaus help?', [['He burned the necks so no heads grew back', true], ['He cut off the last head with a sword', false, 'Heracles kills the Hydra.'], ['He held the Hydra down with a net', false, 'There is no net: “πῦρ φέρει”, he brings fire.']], '“ὁ οὖν Ἰόλαος πῦρ φέρει καὶ τοὺς τραχήλους καίει.”', P_HYDRA),
  mcq('hy.6', 'read-2', 'In **ἐν τῷ ἕλει**, what case is ἕλει?', [['dative, after ἐν', true], ['genitive', false, 'The genitive is ἕλους.'], ['accusative', false, 'ἐν always takes the dative.']], 'ἕλος, ἕλους, ἕλει: a third-declension neuter like ξίφος and ἔτος.', P_HYDRA),
);
RQ('hy.3', 'read-2', 'What happened whenever Heracles cut off one head?', 'two others grew', ['the Hydra died', 'Iolaus ran away', 'the marsh caught fire'], '“δύο ἄλλαι ἐφύοντο.” The imperfect here means it kept happening.', P_HYDRA);
RQ('hy.5', 'read-2', 'What does **οὐκέτι** mean in the passage?', 'no longer', ['not yet', 'never', 'again'], '“οὐκέτι ἐφύοντο”: they no longer grew.', P_HYDRA);

// --- reading 3: the Sirens, Jason
push(
  mcq('si.1', 'read-3', 'What does Circe warn Odysseus about?', [['The Sirens sing beautifully but kill sailors', true], ['The Sirens sing badly and scare sailors', false, '“καλῶς ᾄδουσιν”: they sing beautifully.'], ['The Cyclops is waiting near the shore', false, 'The Cyclops was an earlier adventure.']], '“αἱ Σειρῆνες καλῶς ᾄδουσιν, ἀλλὰ τοὺς ναύτας ἀποκτείνουσιν.”', P_SIRENS),
  mcq('si.2', 'read-3', 'What kind of word is **κλεῖσον** in Circe’s speech?', [['A command (aorist imperative): close!', true], ['A past tense (aorist): she closed', false, 'No augment, so it is a command. “She closed” would be ἔκλεισεν.'], ['A future (indicative): she will close', false, 'The future would be κλείσει.']], 'Aorist imperative: κλεῖσον (to one person), κλείσατε (to several).', P_SIRENS),
  mcq('si.4', 'read-3', 'Translate **ἐκέλευσεν οὖν τοὺς ἑταίρους αὐτὸν πρὸς τὸν ἱστὸν δῆσαι**.', [['So he ordered his companions to tie him to the mast.', true], ['So his companions ordered him to tie them to the mast.', false, 'ἐκέλευσεν (he ordered) is singular: Odysseus. τοὺς ἑταίρους are the people ordered.'], ['So he tied his companions to the mast.', false, 'δῆσαι is “to tie”: the companions do the tying.']], 'κελεύω + accusative + infinitive.', P_SIRENS),
  mcq('si.5', 'read-3', 'Why did the crew not untie him?', [['They could not hear him: their ears were blocked', true], ['They were asleep', false, 'They were rowing; the wax was in their ears.'], ['They wanted to hear the Sirens themselves', false, 'Their ears were full of wax.']], '“οἱ δὲ οὐκ ἤκουσαν”: they did not hear.', P_SIRENS),
  mcq('si.6', 'read-3', 'Which of these is an aorist indicative (a past statement)?', [['ἔκλεισεν', true], ['κλεῖσον', false, 'κλεῖσον is an imperative.'], ['δῆσαι', false, 'δῆσαι is an infinitive.']], 'Only the past statement has the augment: ἔκλεισεν, he closed.', P_SIRENS),
);
RQ('si.3', 'read-3', 'Why did Odysseus not block his own ears?', 'he wanted to hear the Sirens', ['he was already partly deaf', 'Circe had forbidden him to do it', 'he had no wax left for himself'], '“αὐτὸς δὲ ἤθελε τῶν Σειρήνων ἀκούειν.”', P_SIRENS);
RQ('ja.1', 'read-3', 'What did King Pelias order Jason to do?', 'bring the golden fleece from Colchis', ['build a city in Thessaly', 'kill the bulls of Pelias', 'marry the princess Medea of Colchis'], '“τὸν Ἰάσονα ἐκέλευσε τὸ χρυσοῦν δέρας ἐκ τῆς Κόλχιδος φέρειν.”', P_JASON);
RQ('ja.2', 'read-3', 'What was the Argo?', 'a big ship', ['a golden fleece', 'a bull', 'a city'], '“ναῦν μεγάλην, τὴν Ἀργώ”. The heroes who sailed in her were the Argonauts.', P_JASON);
push(
  mcq('ja.3', 'read-3', 'What is **λαβεῖν**?', [['the aorist infinitive of λαμβάνω: to take', true], ['the aorist indicative of λαμβάνω: he took', false, 'He took is ἔλαβεν, with the augment.'], ['the present infinitive of λαμβάνω: to take', false, 'The present infinitive is λαμβάνειν; λαβεῖν uses the aorist stem λαβ-.']], '“εἰ ἐθέλεις τὸ δέρας λαβεῖν”: if you want to take the fleece.', P_JASON),
  mcq('ja.5', 'read-3', 'How did Medea help Jason?', [['She gave him a magic potion', true], ['She yoked the bulls herself', false, '“τῷ φαρμάκῳ ὁ Ἰάσων τοὺς ταύρους ἔζευξε”: Jason does it, with the potion.'], ['She stole the ship', false, 'The Argo was Jason’s own ship.']], '“φάρμακον αὐτῷ ἔδωκεν”: she gave him a potion.', P_JASON),
  mcq('ja.6', 'read-3', '**ἔλαβεν** and **ἔφυγεν** are both…', [['strong aorists: he took, he fled', true], ['imperfects: he was taking, he was fleeing', false, 'The imperfects use the present stems: ἐλάμβανε, ἔφευγε.'], ['futures', false, 'The augment shows they are past.']], 'λαβ- and φυγ- are aorist stems.', P_JASON),
);
RQ('ja.4', 'read-3', 'What made the task so dangerous?', 'the bulls breathed fire', ['the fleece was poisoned', 'the king had an army', 'the sea was frozen'], '“οἱ δὲ ταῦροι πῦρ ἔπνεον.”', P_JASON);

// --- reading 4 (stretch): the wooden horse, Perseus
RQ('ho.1', 'read-4', 'How long had the Greeks been besieging Troy?', 'ten years', ['ten days', 'ten months', 'a hundred years'], '“δέκα ἔτη”: the accusative of time (how long).', P_HORSE);
push(
  mcq('ho.2', 'read-4', 'What does **σοφώτατος τῶν Ἑλλήνων ὤν** tell you about Odysseus?', [['being the wisest of the Greeks', true], ['being wiser than the Trojans', false, 'σοφώτατος is superlative: wisest.'], ['being the oldest Greek', false, 'σοφός means wise.']], 'ὤν (being) is the participle of εἰμί; τῶν Ἑλλήνων: of the Greeks.', P_HORSE),
  mcq('ho.3', 'read-4', 'Translate **οἱ δὲ Τρῶες τὸν ἵππον ἰδόντες ἐχάρησαν**.', [['The Trojans, having seen the horse, rejoiced.', true], ['The horse saw the Trojans and rejoiced.', false, 'ἰδόντες is nominative plural: it goes with οἱ Τρῶες.'], ['The Trojans rejoiced while they were building the horse.', false, 'ἰδόντες = having seen.']], 'ἰδόντες: aorist participle of ὁράω, nominative plural.', P_HORSE),
  mcq('ho.4', 'read-4', 'Which phrase is a genitive absolute?', [['τῆς δὲ νυκτὸς γενομένης', true], ['τῶν Ἑλλήνων τῶν ἀνδρείων', false, 'That is a plain genitive: of the Greeks.'], ['ἐκ τοῦ ἵππου τοῦ ξυλίνου', false, 'That is a genitive after ἐκ.']], '“When night had fallen”: noun + participle in the genitive, setting the scene.', P_HORSE),
  mcq('ho.6', 'read-4', 'Why did the other Greeks burn their tents and sail away?', [['To make the Trojans think they had given up', true], ['Because they had lost the war', false, 'It was a trick: the best soldiers were waiting inside the horse.'], ['To fetch more soldiers from Greece', false, 'They came back the same night.']], 'An inference: the passage shows the trick working.', P_HORSE),
);
RQ('ho.5', 'read-4', 'What did the soldiers do after coming out of the horse?', 'they opened the gates for their friends', ['they burned the horse on the beach', 'they sailed away to their ships', 'they hid in the tents'], '“τὰς πύλας τοῖς φίλοις ἀνέῳξαν.”', P_HORSE);
RQ('pe.1', 'read-4', 'What did Polydectes order Perseus to bring?', 'the head of Medusa', ['the golden fleece', 'a winged horse', 'the shield of Athena'], '“τὴν τῆς Μεδούσης κεφαλὴν φέρειν”.', P_PERSEUS);
push(
  mcq('pe.2', 'read-4', 'What does **οὐ φοβούμενος** tell you about Perseus?', [['He was not afraid', true], ['He was very frightened', false, 'οὐ = not.'], ['He frightened the king', false, 'φοβούμενος is middle: being afraid himself.']], 'φοβούμενος: the present participle of φοβέομαι, I am afraid.', P_PERSEUS),
  mcq('pe.4', 'read-4', 'Translate **τῶν δὲ Γοργόνων καθευδουσῶν**.', [['while the Gorgons were sleeping', true], ['of the sleeping Gorgons’ island', false, 'This is a genitive absolute, setting the scene.'], ['the Gorgons put him to sleep', false, 'καθεύδω = I sleep.']], 'Genitive noun + genitive participle = a genitive absolute.', P_PERSEUS),
  mcq('pe.5', 'read-4', 'How did Perseus avoid being turned to stone?', [['He looked at the shield, not at Medusa', true], ['He closed his eyes and felt his way', false, '“εἰς τὴν ἀσπίδα βλέπων”: looking at the shield.'], ['He wore a helmet with a mirrored visor', false, 'There is no helmet in this version.']], 'οὐκ εἰς τὴν Μέδουσαν ἀλλ᾽ εἰς τὴν ἀσπίδα: not at Medusa but at the shield.', P_PERSEUS),
  mcq('pe.6', 'read-4', 'What does **δείξας** mean, and what happened to Polydectes?', [['having shown: he turned Polydectes to stone', true], ['having hidden: Perseus hid the head from him', false, 'δείκνυμι = I show.'], ['while showing: Polydectes ran away in fear', false, '“αὐτὸν εἰς λίθον μετέβαλεν”: he turned him into stone.']], 'δείξας: aorist participle of δείκνυμι, I show.', P_PERSEUS),
);
RQ('pe.3', 'read-4', 'Which gifts came from Hermes?', 'a curved sword and winged sandals', ['a shining shield and a bag', 'a magic potion and a cloak', 'a ship and a crew of heroes'], '“ἡ μὲν (Athena) ἀσπίδα λαμπρὰν ἔδωκεν, ὁ δὲ (Hermes) ἅρπην καὶ πτερωτὰ πέδιλα.”', P_PERSEUS);

// ================================================================================================
// --- memory hooks (shown on learn cards and after a wrong answer) ----------------------------------
// Kept in this separate block, applied after all the items above are built, so that corrections to
// the content above do not collide with it. Derivatives are only ones that genuinely come from the
// Greek word (cousins via Latin or English are called cousins). Unknown ids throw, as in synoptic.mjs.
const TOPIC_HOOKS = {
  'greek.decl3-stems': 'Genitive minus **-ος** = the stem; then add **-α, -ος, -ι** and **-ες, -ας, -ων, -σι(ν)**.',
  'greek.decl3-more': '**-μα** neuters hide a **τ**: σῶμα, σώματος; ὄνομα, ὀνόματος.',
  'greek.pronouns': '**αὐτός** has three jobs: alone = him; outside the article = self; inside it = same.',
  'greek.demonstratives': 'This and that stand outside the article: **οὗτος ὁ ἀνήρ**, this man.',
  'greek.comparison': '**-τερος** = -er, **-τατος** = -est: σοφώτερος, wiser; σοφώτατος, wisest.',
  'greek.aorist-weak': 'Augment at the front, **σα** at the back: ἔλυσα, I freed.',
  'greek.aorist-strong': 'Strong aorists swap the stem, not the endings, like English run and ran: φεύγω → ἔφυγον.',
  'greek.infinitives': 'The augment is for past statements only: λῦσαι (to free) and λῦσον (free!) have none.',
  'greek.contracted': '**ε + ο = ου**, **ε + ε = ει**: φιλέομεν → φιλοῦμεν.',
  'greek.middle': 'Middle and passive endings: **-ομαι, -ῃ, -εται, -ομεθα, -εσθε, -ονται**.',
  'greek.participles-full': 'Present participle = **while**; aorist participle = **having**: λύων, λύσας.',
  'greek.cases': 'Time: accusative = how long; dative = when; genitive = within which.',
  'greek.questions': 'π- asks: ποῦ; πότε; πῶς; Then **οὐ** states facts, and **μή** gives orders.',
  'greek.read-1': 'Find the verb, then the subject: Daedalus makes, Icarus flies, the sun melts.',
  'greek.read-2': 'Imperfect = it kept happening: the Hydra’s heads kept growing back.',
  'greek.read-3': 'Augment = it happened (ἔκλεισεν); no augment = an order or an infinitive (κλεῖσον).',
  'greek.read-4': 'One clause at a time: find the participles, then the main verb.',
  'greek.genabs': 'Noun + participle, both genitive, set the scene: **τῆς νυκτὸς γενομένης**, when night had fallen.',
};
// keyed by item id (without the greek.g3. prefix): a hook string, or { hook, example }
const MEMORY = {
  // third declension
  'd3.tmpl': 'Find the stem from the genitive, then add the endings: φύλαξ, φύλακος → φυλακ-.',
  'd3.sg': 'Singular -α, -ος, -ι: φύλακα, φύλακος, φύλακι.',
  'd3.pl': 'Plural -ες, -ας, -ων, -σι(ν): φύλακες, φύλακας, φυλάκων, φύλαξι(ν).',
  'd3.gigas': { hook: 'γίγας, γίγαντος: the stem keeps its ντ.', example: 'Gigantic still keeps the -nt- of γιγαντ-.' },
  'd3.xi': 'κ + σ = ξ, just as in φύλαξ itself.',
  'd3.ntsi': 'ντ vanishes before σ: γίγασι(ν), λέουσι(ν).',
  'd3.pais': 'παῖς, παιδός → **paediatrics**, children’s medicine.',
  'd3.hellen': { hook: 'Ἕλλην → **Hellenic**, Greek. Hellas is Greece’s own name for itself.', example: 'Greek stamps still say ΕΛΛΑΣ, Hellas.' },
  'd3.agon': 'ἀγών → **agony**, **protagonist** and **antagonist**.',
  'd3.rhetor': 'ῥήτωρ → **rhetoric**, the speaker’s art.',
  'd3.chase': 'Plural -ες = subject; singular -α = object.',
  'd3.nyx': 'νύξ, νυκτός: Nyx was the goddess of night.',
  'd3.accent': 'Long last syllable? Then the accent can go back only two syllables: φυλάκων.',
  'd3b.tmpl': 'σῶμα, σώματος: the stem σωματ- appears in every case except the nominative and accusative singular and the dative plural σώμασι(ν).',
  'd3b.soma': 'σωματ- + ι = σώματι.',
  'd3b.chromo': 'σῶμα → psychosomatic (mind and body), chromosome (colour body).',
  'd3b.neuter': 'Neuters: nominative = accusative, always.',
  'd3b.pragma': { hook: 'πρᾶγμα (a thing done) → **pragmatic**, practical.', example: 'A pragmatic person cares about what works, not about theory.' },
  'd3b.polin': 'πόλις, πόλιν: the accusative takes -ν, like τιμήν.',
  'd3b.poleos': 'πόλεως, of the city: a **metropolis** is a mother city.',
  'd3b.basileus': 'βασιλεύς, βασιλέως → **basilica**, a royal hall.',
  'd3b.thesea': 'The βασιλεύς family: Θησεύς, Ὀδυσσεύς and Περσεύς all go -έα, -έως, -εῖ.',
  'd3b.patros': 'πατήρ, πατρός → πατρίς, the fatherland, and so **patriot**.',
  'd3b.andrasi': 'ἀνδράσι(ν): an α slips in to make ἀνδρ- + σι sayable.',
  'd3b.gyne': 'γυναικ- → **gynaecology**.',
  'd3b.zeus': 'Ζεύς, Δία, Διός, Διί. Ζεῦ πάτερ, “father Zeus”, is a cousin of Latin Jupiter.',
  // pronouns
  'pr.me': 'ἐγώ, ἐμέ, ἐμοῦ, ἐμοί: me hides inside ἐμέ.',
  'pr.ego': 'ἐγώ, a cousin of Latin **ego**, is added only for emphasis: the verb ending already says “I”.',
  'pr.hemeis': 'Chant: ἡμεῖς, ἡμᾶς, ἡμῶν, ἡμῖν: we, us, of us, to us.',
  'pr.hymin': '-ῖν = to: ὑμῖν, to you; ἡμῖν, to us.',
  'pr.se': 'σύ, σέ, σοῦ, σοί: like old English thou, thee.',
  'pr.auton': 'αὐτόν on its own = him.',
  'pr.self': 'αὐτὸς ὁ βασιλεύς: outside the article sandwich = self.',
  'pr.same': 'ὁ αὐτός: inside the article sandwich = same.',
  'pr.autes': 'αὐτοῦ his, αὐτῆς her, αὐτῶν their.',
  'pr.autoi': 'αὐτός in the nominative stresses the subject: we ourselves.',
  'pr.order': 'Case order: nominative, accusative, genitive, dative: ἐγώ, ἐμέ, ἐμοῦ, ἐμοί.',
  'pr.hemas': 'ἡμᾶς us, ὑμᾶς you: η for us, υ for you.',
  // demonstratives and the relative
  'dm.houtos': 'οὗτος ὁ ἀνήρ: this man, with οὗτος outside the article.',
  'dm.ekeine': 'ἐκεῖ = there: ἐκείνη, that one over there.',
  'dm.tauten': 'ταύτην τὴν ναῦν: both end -ην.',
  'dm.tauta': 'ταῦτα: these things, often “this” about what has just been said.',
  'dm.eipon': 'ταῦτα εἰπών: the storyteller’s “having said this”.',
  'dm.ekeinos': 'οὗτος near, ἐκεῖνος far.',
  'dm.hon': 'The relative: gender and number from its noun, case from its own clause.',
  'dm.he': 'ἣ ᾄδει: who is singing. ᾄδω (I sing) is the verb behind **ode**.',
  'dm.ha': 'The neuter plural relative ἅ looks like the article τά without its τ.',
  'dm.accent': 'Both have a rough breathing; only the relative has an accent.',
  'dm.these': 'οὗτοι these, ἐκεῖνον that.',
  // comparison
  'cm.comp': '-τερος = -er: σοφώτερος, wiser.',
  'cm.sup': '-τατος = -est: σοφώτατος, wisest.',
  'cm.omega': 'Short syllable before it → ω: σοφώτερος, νεώτερος.',
  'cm.ameinon': 'Good, better, best: ἀγαθός, ἀμείνων, ἄριστος.',
  'cm.megas': 'μέγας, μείζων, μέγιστος: big, bigger, biggest.',
  'cm.aristo': 'ἄριστος + κράτος = aristocracy, rule by the best.',
  'cm.gen': 'The genitive alone can mean than: τοῦ Ἕκτορος, than Hector.',
  'cm.e': 'ἤ = than, with the same case on both sides.',
  'cm.hos': 'ὡς + superlative = as … as possible.',
  'cm.kakion': 'κακός, κακίων, κάκιστος: bad, worse, worst.',
  'cm.pleistoi': { hook: 'πολύς, πλείων, πλεῖστος: much, more, most.', example: 'The Pleistocene, the age of the mammoths, is named “most new”: πλεῖστος + καινός.' },
  'cm.kallion': 'καλός, καλλίων, κάλλιστος: calligraphy is beautiful writing.',
  // the weak aorist
  'aw.tmpl': 'Augment + stem + σα: ἐ-λυ-σα, I freed.',
  'aw.order': 'Chant: ἔλυσα, ἔλυσας, ἔλυσε(ν), ἐλύσαμεν, ἐλύσατε, ἔλυσαν.',
  'aw.akouo': 'Vowel verbs lengthen instead: α → η, ἀκούω → ἤκουσα.',
  'aw.apo': 'A compound puts the augment after its prefix: ἀπ-έ-πεμψα.',
  'aw.psi': 'φ + σ = ψ: ἔγραψα.',
  'aw.ediox': 'κ + σ = ξ: ἐδίωξαν.',
  'aw.contrast': 'σ = a snapshot (aorist); no σ = a film (imperfect).',
  'aw.keleuo': 'ἐ- + κελευ + σε: ἐκέλευσε(ν), he ordered.',
  'aw.poieo': 'ε lengthens to η before the σ: ἐποίησε(ν).',
  'aw.ethelo': 'ε → η: ἐθέλω, ἤθελον.',
  'aw.pisteuo': 'Augment + stem + σα: ἐπίστευσα.',
  'aw.elusamen': '-σαμεν = we: ἐλύσαμεν, we freed.',
  // strong aorists
  'as.tmpl': 'Strong aorist: a new stem with imperfect endings: ἔλαβον, ἔφυγον, ἔμαθον.',
  'as.elabe': 'λαβ-: a short stem with imperfect-style endings.',
  'as.stem': 'φευγ- (imperfect) or φυγ- (aorist): the stem tells you which.',
  'as.eidon': 'εἶδον, I saw → **idea**, from the same root.',
  'as.elthon': 'ἦλθον: a whole new stem, like English go, went.',
  'as.eipon': 'εἶπον shares its root with ἔπος, a word: the source of **epic**.',
  'as.math': 'μαθ- → **mathematics**, things learned.',
  'as.apethane': 'θαν- → θάνατος, death.',
  'as.pathos': 'παθ- → **pathos**, **sympathy**, **empathy**.',
  'as.egagomen': 'ἤγαγον: the stem doubles, ἀγ-αγ-.',
  'as.heuron': 'εὗρον, I found: the same root as **eureka** (εὕρηκα), I have found it!',
  'as.ebalon': 'One λ for one throw: ἔβαλον.',
  // infinitives and commands
  'in.which': 'Three infinitive endings: -ειν (λύειν), -σαι (λῦσαι), -εῖν (λαβεῖν).',
  'in.phygein': 'φυγεῖν: aorist stem φυγ- + -εῖν.',
  'in.dei': 'δεῖ + accusative + infinitive = must: δεῖ ἡμᾶς μένειν.',
  'in.keleuo': 'κελεύω + accusative (the person) + infinitive (the action).',
  'in.labein': 'λαβ- + -εῖν = λαβεῖν, to take.',
  'in.pheuge': 'φεῦγε to one person, φεύγετε to several.',
  'in.lysate': 'No augment = a command: λύσατε!',
  'in.me': 'μή + imperative = don’t!',
  'in.augment': 'The augment belongs only to past statements.',
  'in.akoue': 'ἄκουε! → **acoustic**: listen!',
  'in.idein': 'ἰδεῖν: the ἰδ- of **idea**.',
  // contracted verbs
  'ct.tmpl': 'ε + ω = ω, ε + ε = ει, ε + ει = ει, ε + ο = ου, ε + ου = ου.',
  'ct.order': 'Chant: φιλῶ, φιλεῖς, φιλεῖ, φιλοῦμεν, φιλεῖτε, φιλοῦσι(ν).',
  'ct.ou': 'ε + ο = ου.',
  'ct.poiousi': 'ποιοῦσι, they make: a poet is a maker.',
  'ct.inf': 'ε + ει = ει: φιλεῖν, to love.',
  'ct.zetei': 'ε + ει = ει: ζητεῖ, he seeks.',
  'ct.oikoumen': 'οἰκοῦμεν, we live: οἶκος, house, as in economy.',
  'ct.boethousin': 'βοηθ- = help; βοά- = shout. Keep them apart.',
  'ct.horomen': 'α + ο = ω: ὁρῶμεν.',
  'ct.tima': 'α + ει = ᾳ: τιμᾷ.',
  'ct.aor': 'ε lengthens to η before the σ: ἐποίησα, ἐφίλησα.',
  'ct.not': 'λύω has no contraction: its endings stay as they are.',
  // middle and passive
  'mp.tmpl': 'Middle and passive endings: -ομαι, -ῃ, -εται, -ομεθα, -εσθε, -ονται.',
  'mp.lyetai': '-εται = he, she or it is being…',
  'mp.hypo': 'ὑπό + genitive of a person = by.',
  'mp.deponent': 'A deponent is dressed as a middle but acts active.',
  'mp.boulomai': 'βούλομαι, I want → βουλή, a plan, and the Council that planned Athens’ business.',
  'mp.gignetai': 'γίγνομαι → **genesis**, a coming into being.',
  'mp.ontai': '-ονται = they.',
  'mp.lithoi': 'λίθοι γίγνονται: Medusa’s victims become statues.',
  'mp.erchesthe': '-εσθε = you all.',
  'mp.inf': '-εσθαι = to be …ed: λύεσθαι, to be freed.',
  'mp.machontai': 'μάχομαι is deponent: they fight.',
  'mp.petetai': 'πέτομαι (I fly) shares its root with πτερόν (wing): a pterosaur is a winged lizard.',
  // participles
  'pt.tmpl': 'Present participle = while; aorist participle = having.',
  'pt.idon': 'ἰδών: the ἰδ- of **idea**.',
  'pt.labon': 'λαβών happens first, then the main verb.',
  'pt.agree': 'Match the ending: φεύγουσαν goes with τὴν κόρην.',
  'pt.on': 'ὤν, οὖσα, ὄν (being) → **ontology**, the study of being.',
  'pt.machomenoi': '-μενος marks a present middle participle: μαχόμενοι, fighting.',
  'pt.pheugon': 'ὁ φεύγων: the one fleeing, the fugitive.',
  'pt.akousasa': 'Aorist participle: -σας, -σασα, -σαν.',
  'pt.menontes': 'οἱ + participle = those who…',
  'pt.eipon': 'εἰπών: having said.',
  'pt.tense': 'Present = at the same time; aorist = before.',
  // the cases
  'cs.xiphei': 'The dative of means: with the sword.',
  'cs.ete': 'The accusative says how long: for ten years.',
  'cs.hysteraia': 'The dative says when: on the next day.',
  'cs.howlong': 'How long? Accusative.',
  'cs.nyktos': 'The genitive says within which time: by night.',
  'cs.phile': 'The vocative of -ος nouns ends -ε: ὦ φίλε!',
  'cs.thygater': 'The genitive sits in the sandwich: ἡ τοῦ βασιλέως θυγάτηρ.',
  'cs.athenaioi': 'ὦ ἄνδρες Ἀθηναῖοι: how Athenian speeches began.',
  'cs.pharmako': { hook: 'The dative of means: with the potion.', example: 'φάρμακον gives us pharmacy, the shop that sells medicines.' },
  'cs.theon': '-ων = of the: τῶν θεῶν.',
  'cs.polloi': 'οἱ πολλοί, the many: the majority.',
  // questions and negatives
  'qn.tis': 'τίς εἶ; who are you?',
  'qn.pou': 'ποῦ; where?',
  'qn.ouch': 'οὐχ before a rough breathing: οὐχ ὁρᾷ.',
  'qn.ara': 'ἆρα opens a yes-or-no question.',
  'qn.dia': 'διὰ τί; because of what? Why?',
  'qn.oudeis': 'οὐδείς = οὐδέ + εἷς: not even one.',
  'qn.oute': 'οὔτε… οὔτε = neither… nor.',
  'qn.tis2': 'An accent asks; no accent means someone.',
  'qn.me': 'μή for commands: μὴ βλέπε!',
  'qn.pote': 'πότε; asks when; τότε answers then.',
  'qn.ouketi': 'οὐκ + ἔτι = no longer.',
  // genitive absolute
  'ga.night': 'A genitive pair at the start of a sentence sets the scene.',
  'ga.which': 'Noun and participle, both genitive.',
  'ga.legontos': 'Present participle = while.',
  'ga.when': 'Only when its noun is not part of the main sentence.',
  'ga.gorgons': 'καθευδουσῶν: a feminine genitive plural, agreeing with τῶν Γοργόνων.',
  'ga.lephtheises': 'An aorist passive participle: having been taken.',
  'ga.menonton': 'A genitive absolute can mean because, as well as when or while.',
  'ga.sun': 'τοῦ ἡλίου δύνοντος: as the sun was setting.',
  // reading 1
  'ic.1': 'τεχνίτης is built on τέχνη, skill: as in technology.',
  'ic.2': 'οὖν links cause and result: Minos says no, so Daedalus makes wings.',
  'ic.3': 'κελεύω + μή + infinitive: he orders him not to…',
  'ic.4': 'πτέρυξ, πτέρυγος: third declension, -ας accusative plural.',
  'ic.5': 'λύω loosens: here the sun melts the wax.',
  'ic.6': 'Wings, warning, flight, melting, fall.',
  'ar.1': '-ως makes an adverb, like -ly: καλῶς, beautifully.',
  'ar.2': 'κάλλιον ἤ: more beautifully than.',
  'ar.3': 'αὐτῆς on its own = of her.',
  'ar.4': 'μέν… δέ: beautiful, but disrespectful.',
  'ar.5': { hook: 'ἀράχνη is the Greek for spider.', example: 'Spiders, scorpions and mites are all arachnids.' },
  'ar.6': 'τιμᾷ: α + ει = ᾳ.',
  // reading 2
  'or.1': 'A neuter plural subject takes a singular verb: τὰ θηρία ἤκουεν.',
  'or.2': 'ᾄδω (I sing) → **ode**, from ᾠδή, a song.',
  'or.3': 'ὑπό + genitive = by: bitten by a snake.',
  'or.4': 'Two commands: ἄγε and μὴ βλέπε.',
  'or.5': 'μέν… δέ: one leads, one follows.',
  'or.6': 'So near the light, and he looked back.',
  'hy.1': 'ἐν + dative: in the marsh.',
  'hy.2': 'ἔχω, εἶχον: here ε augments to ει, not η. Learn it.',
  'hy.3': 'The imperfect: it kept happening.',
  'hy.4': 'πῦρ (fire) → **pyre**.',
  'hy.5': 'οὐκ + ἔτι = no longer.',
  'hy.6': 'ἕλος, ἕλους, ἕλει: like γένος.',
  // reading 3
  'si.1': { hook: 'The Sirens sing beautifully and kill.', example: 'The warning wail of an ambulance siren is named after these deadly singers.' },
  'si.2': 'κλεῖσον: no augment, so a command.',
  'si.3': 'αὐτὸς δὲ ἤθελε: he himself wanted.',
  'si.4': 'κελεύω + accusative + infinitive.',
  'si.5': 'οὐκ ἤκουσαν: the wax blocked their ears.',
  'si.6': 'Only the past statement has the augment.',
  'ja.1': 'φέρειν: the infinitive after ἐκέλευσε.',
  'ja.2': 'Argonauts: the Argo’s sailors (ναύτης).',
  'ja.3': 'λαβεῖν: the aorist infinitive.',
  'ja.4': 'πῦρ ἔπνεον: they breathed fire.',
  'ja.5': { hook: 'φάρμακον: a drug, magic potion.', example: 'φάρμακον gives us pharmacy, the shop that sells medicines.' },
  'ja.6': 'λαβ-, φυγ-: aorist stems.',
  // reading 4
  'ho.1': 'δέκα ἔτη: the accusative says how long.',
  'ho.2': 'σοφώτατος ὤν: being the wisest.',
  'ho.3': 'ἰδόντες: having seen.',
  'ho.4': 'A genitive pair: when night had fallen.',
  'ho.5': 'ἀνέῳξαν: they opened.',
  'ho.6': { hook: 'The wooden horse was a trick to get inside.', example: 'A harmful program disguised as a harmless one is called a Trojan horse, or just a Trojan.' },
  'pe.1': 'φέρειν: to bring.',
  'pe.2': 'φοβούμενος comes from φόβος, as in **phobia**.',
  'pe.3': 'Hermes gives the ἅρπη (curved sword) and the sandals; Athena, the shield.',
  'pe.4': 'A genitive pair: while the Gorgons were sleeping.',
  'pe.5': 'Look in the mirror, not at the monster.',
  'pe.6': 'δείξας: having shown.',
};
{
  const byId = new Map(items.map((it) => [it.id, it]));
  for (const t of topics) t.hook = TOPIC_HOOKS[t.id];
  for (const id of Object.keys(TOPIC_HOOKS)) if (!topics.some((t) => t.id === id)) throw new Error(`topic hook for unknown topic ${id}`);
  for (const [id, v] of Object.entries(MEMORY)) {
    const it = byId.get(`greek.g3.${id}`);
    if (!it) throw new Error(`memory hook for unknown item greek.g3.${id}`);
    Object.assign(it, typeof v === 'string' ? { hook: v } : v);
  }
}

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// Forms are copied from the course's own tables (js/gen/y8greek2.js and the items above); **…**
// marks the ending (or the part to notice). In a phrase the article takes a grave: τὸν φύλακα.
const TOPIC_VISUALS = {
  'greek.decl3-stems': [
    { kind: 'table', head: ['singular', 'guard', 'giant'], rows: [
      ['nominative', 'ὁ φύλαξ', 'ὁ γίγας'], ['accusative', 'τὸν φύλακ**α**', 'τὸν γίγαντ**α**'], ['genitive', 'τοῦ φύλακ**ος**', 'τοῦ γίγαντ**ος**'], ['dative', 'τῷ φύλακ**ι**', 'τῷ γίγαντ**ι**']] },
    { kind: 'table', head: ['plural', 'guard', 'giant'], rows: [
      ['nominative', 'οἱ φύλακ**ες**', 'οἱ γίγαντ**ες**'], ['accusative', 'τοὺς φύλακ**ας**', 'τοὺς γίγαντ**ας**'], ['genitive', 'τῶν φυλάκ**ων**', 'τῶν γιγάντ**ων**'], ['dative', 'τοῖς φύλα**ξι(ν)**', 'τοῖς γίγα**σι(ν)**']],
    caption: 'Dative plural: κ + σι makes ξι, and ντ drops out before σ.' },
  ],
  'greek.decl3-more': [
    { kind: 'table', head: ['', 'body', 'city'], rows: [
      ['nom. sg', 'σῶμα', 'πόλ**ις**'], ['acc. sg', 'σῶμα', 'πόλ**ιν**'], ['gen. sg', 'σώμα**τος**', 'πόλ**εως**'], ['dat. sg', 'σώμα**τι**', 'πόλ**ει**'],
      ['nom. pl', 'σώμα**τα**', 'πόλ**εις**'], ['acc. pl', 'σώμα**τα**', 'πόλ**εις**'], ['gen. pl', 'σωμά**των**', 'πόλ**εων**'], ['dat. pl', 'σώμα**σι(ν)**', 'πόλ**εσι(ν)**']],
    caption: 'σῶμα shows its hidden τ as soon as an ending is added. πόλις has ι in the nominative and accusative singular, and ε everywhere else.' },
    { kind: 'table', head: ['singular', 'king', 'father'], rows: [
      ['nom.', 'βασιλ**εύς**', 'πατ**ήρ**'], ['acc.', 'βασιλ**έα**', 'πατ**έρα**'], ['gen.', 'βασιλ**έως**', 'πατ**ρός**'], ['dat.', 'βασιλ**εῖ**', 'πατ**ρί**']],
    caption: 'βασιλεύς keeps βασιλ- and changes the vowel after it; πατήρ loses its ε in the genitive and dative.' },
  ],
  'greek.pronouns': [
    { kind: 'table', head: ['singular', 'I', 'you'], rows: [
      ['nominative', 'ἐγώ', 'σύ'], ['accusative', 'ἐμέ, με', 'σέ, σε'], ['genitive', 'ἐμοῦ, μου', 'σοῦ, σου'], ['dative', 'ἐμοί, μοι', 'σοί, σοι']] },
    { kind: 'table', head: ['plural', 'we', 'you'], rows: [
      ['nominative', '**ἡ**μεῖς', '**ὑ**μεῖς'], ['accusative', '**ἡ**μᾶς', '**ὑ**μᾶς'], ['genitive', '**ἡ**μῶν', '**ὑ**μῶν'], ['dative', '**ἡ**μῖν', '**ὑ**μῖν']],
    caption: 'Only the first letter tells “we” (ἡ-) from “you” (ὑ-).' },
  ],
  'greek.demonstratives': [
    { kind: 'blocks', rows: [
      { parts: [['οὗτος', 'pronoun', 'this'], ['ὁ', 'article', 'the'], ['ἀνήρ', 'noun', 'man']], result: 'this man' },
      { parts: [['ὁ', 'article', 'the'], ['ἀνὴρ', 'noun', 'man'], ['οὗτος', 'pronoun', 'this']], result: 'this man' },
      { parts: [['ἐκείνη', 'pronoun', 'that'], ['ἡ', 'article', 'the'], ['κόρη', 'noun', 'girl']], result: 'that girl' },
    ] },
    { kind: 'table', tint: 'cols', head: ['singular', 'm.', 'f.', 'n.'], rows: [
      ['nom.', 'οὗτ**ος**', 'αὕτ**η**', 'τοῦτ**ο**'], ['acc.', 'τοῦτ**ον**', 'ταύτ**ην**', 'τοῦτ**ο**'], ['gen.', 'τούτ**ου**', 'ταύτ**ης**', 'τούτ**ου**'], ['dat.', 'τούτ**ῳ**', 'ταύτ**ῃ**', 'τούτ**ῳ**']] },
    { kind: 'table', tint: 'cols', head: ['plural', 'm.', 'f.', 'n.'], rows: [
      ['nom.', 'οὗτ**οι**', 'αὗτ**αι**', 'ταῦτ**α**'], ['acc.', 'τούτ**ους**', 'ταύτ**ας**', 'ταῦτ**α**'], ['gen.', 'τούτ**ων**', 'τούτ**ων**', 'τούτ**ων**'], ['dat.', 'τούτ**οις**', 'ταύτ**αις**', 'τούτ**οις**']],
    caption: 'οὗτος, this: the endings of καλός, and a τ wherever the article has one.' },
  ],
  'greek.comparison': { kind: 'table', head: ['', 'more (-er)', 'most (-est)'], rows: [
    ['σοφός, wise', 'σοφώ**τερος**', 'σοφώ**τατος**'], ['δεινός, terrible', 'δεινό**τερος**', 'δεινό**τατος**'],
    ['ἀγαθός, good', 'ἀμείνων', 'ἄριστος'], ['κακός, bad', 'κακίων', 'κάκιστος'], ['μέγας, big', 'μείζων', 'μέγιστος'], ['πολύς, much', 'πλείων', 'πλεῖστος'],
  ], caption: 'The top two follow the rule; the four common ones below are irregular, like good, better, best.' },
  'greek.aorist-weak': { kind: 'blocks', rows: [
    { join: '+', parts: [['ἔ', 'augment', 'past'], ['λυ', 'stem'], ['σ', 'tense', 'aorist'], ['α', 'ending', 'I']], result: 'ἔλυσα, I freed' },
    { join: '+', parts: [['ἐ', 'augment', 'past'], ['λύ', 'stem'], ['σ', 'tense', 'aorist'], ['αμεν', 'ending', 'we']], result: 'ἐλύσαμεν, we freed' },
    { join: '+', parts: [['ἔ', 'augment', 'past'], ['πεμπ', 'stem'], ['σ', 'tense', 'aorist'], ['α', 'ending', 'I']], result: 'ἔπεμψα (π + σ = ψ)' },
  ] },
  'greek.aorist-strong': { kind: 'table', head: ['present', 'imperfect', 'aorist'], rows: [
    ['φεύγω', 'ἔ**φευγ**ον', 'ἔ**φυγ**ον'], ['λαμβάνω', 'ἐ**λάμβαν**ον', 'ἔ**λαβ**ον'], ['μανθάνω', 'ἐ**μάνθαν**ον', 'ἔ**μαθ**ον'], ['βάλλω', 'ἔ**βαλλ**ον', 'ἔ**βαλ**ον'],
    ['λέγω', 'ἔλεγον', 'εἶπον'], ['ὁράω', 'ἑώρων', 'εἶδον'],
  ], caption: 'Same augment, same endings: only the stem changes. The imperfect (was …ing) keeps the present stem.' },
  'greek.contracted': { kind: 'table', head: ['', 'stem + ending', 'contracted'], rows: [
    ['I', 'φιλ**έ-ω**', 'φιλ**ῶ**'], ['you (sg)', 'φιλ**έ-ει**ς', 'φιλ**εῖ**ς'], ['he, she', 'φιλ**έ-ει**', 'φιλ**εῖ**'],
    ['we', 'φιλ**έ-ο**μεν', 'φιλ**οῦ**μεν'], ['you (pl)', 'φιλ**έ-ε**τε', 'φιλ**εῖ**τε'], ['they', 'φιλ**έ-ου**σι(ν)', 'φιλ**οῦ**σι(ν)'],
  ], caption: 'ε + ω = ω; ε + ε and ε + ει = ει; ε + ο and ε + ου = ου.' },
  'greek.middle': { kind: 'blocks', rows: [
    { parts: [['ὁ δοῦλος', 'subject', 'the slave'], ['τὸν ἵππον', 'object', 'the horse'], ['λύει', 'verb', 'frees (active)']], result: 'The slave frees the horse.' },
    { parts: [['ὁ ἵππος', 'subject', 'the horse'], ['ὑπὸ τοῦ δούλου', 'adverbial', 'by the slave'], ['λύεται', 'verb', 'is freed (passive)']], result: 'The horse is freed by the slave.' },
  ], caption: 'Passive: the subject has the action done to it; ὑπό + genitive names who did it.' },
  'greek.participles-full': { kind: 'table', head: ['', 'masc.', 'fem.', 'neut.'], rows: [
    ['present: freeing', 'λύ**ων**', 'λύ**ουσα**', 'λῦ**ον**'], ['aorist: having freed', 'λύ**σας**', 'λύ**σασα**', 'λῦ**σαν**'],
  ], caption: 'Like an adjective, the participle takes the gender, case and number of its noun.' },
  'greek.cases': { kind: 'table', head: ['', 'job', 'example'], rows: [
    ['accusative', 'how long', 'δέκα ἔτη, for ten years'], ['dative', 'means: with', 'τῷ ξίφει, with the sword'], ['dative', 'when', 'τῇ ὑστεραίᾳ, on the next day'],
    ['genitive', 'whose', 'τοῦ βασιλέως, the king’s'], ['genitive', 'time within which', 'νυκτός, by night'], ['vocative', 'calling', 'ὦ φίλε, O friend!'],
  ] },
  'greek.genabs': { kind: 'blocks', rows: [
    { parts: [['τῆς νυκτὸς γενομένης,', 'subordinate', 'genitive absolute'], ['οἱ στρατιῶται', 'subject'], ['ἐξῆλθον', 'verb']], result: 'When night had fallen, the soldiers came out.' },
    { parts: [['τῶν Γοργόνων καθευδουσῶν,', 'subordinate', 'genitive absolute'], ['ὁ Περσεὺς', 'subject'], ['προσῆλθεν', 'verb']], result: 'While the Gorgons were sleeping, Perseus approached.' },
  ], caption: 'The genitive pair stands apart: neither word is the subject or object of the main verb.' },
};
const ITEM_VISUALS = {
  'greek.g3.d3.gigas': { kind: 'blocks', rows: [{ join: '+', parts: [['γίγαντ', 'stem'], ['ος', 'ending', 'genitive']], result: 'γίγαντος' }] },
  'greek.g3.aw.akouo': { kind: 'blocks', rows: [{ join: '+', parts: [['ἤ', 'augment', 'ἀ → ἠ'], ['κου', 'stem'], ['σ', 'tense', 'aorist'], ['α', 'ending', 'I']], result: 'ἤκουσα, I heard' }] },
  'greek.g3.aw.apo': { kind: 'blocks', rows: [{ join: '+', parts: [['ἀπ', 'prefix', 'away'], ['έ', 'augment', 'past'], ['πεμπ', 'stem'], ['σα', 'tense', 'aorist: I']], result: 'ἀπέπεμψα, I sent away' }] },
  'greek.g3.mp.ontai': { kind: 'table', head: ['', 'active', 'middle/passive'], rows: [
    ['I', 'λύ**ω**', 'λύ**ομαι**'], ['you (sg)', 'λύ**εις**', 'λύ**ῃ**'], ['he, she', 'λύ**ει**', 'λύ**εται**'], ['we', 'λύ**ομεν**', 'λυ**όμεθα**'], ['you (pl)', 'λύ**ετε**', 'λύ**εσθε**'], ['they', 'λύ**ουσι(ν)**', 'λύ**ονται**']] },
  'greek.g3.pr.self': { kind: 'blocks', rows: [
    { parts: [['αὐτὸς', 'pronoun', 'himself'], ['ὁ', 'article', 'the'], ['βασιλεύς', 'noun', 'king']], result: 'the king himself' },
    { parts: [['ὁ', 'article', 'the'], ['αὐτὸς', 'pronoun', 'same'], ['βασιλεύς', 'noun', 'king']], result: 'the same king' },
  ] },
  'greek.g3.pt.labon': { kind: 'flow', across: true, steps: ['λαβών: Perseus takes the head', 'ἀπέφυγεν: then he escapes'], caption: 'The aorist participle happened first.' },
  'greek.g3.ic.6': { kind: 'flow', steps: ['Daedalus makes wings', 'Daedalus warns his son', 'Father and son fly out of Crete', 'The sun melts the wax', 'Icarus falls into the sea'] },
};
ITEM_VISUALS['greek.g3.pr.same'] = ITEM_VISUALS['greek.g3.pr.self'];
// keep an article on the same line as its noun in a narrow table cell
const tight = (v) => ({ ...v, rows: v.rows.map((r) => r.map((c, i) => (i ? c.replace(/ /g, ' ') : c))) });
TOPIC_VISUALS['greek.decl3-stems'] = TOPIC_VISUALS['greek.decl3-stems'].map(tight);
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'greek', deck: 'y8-grammar', topics, items }];

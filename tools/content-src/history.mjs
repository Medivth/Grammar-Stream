// History content source. The timeline is the spine: every topic plugs into it.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `history.${id}`, topic: `history.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, labels, explain) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'order', prompt, items, labels, explain, axis: 'time' });

const topics = [
  { id: 'history.words', title: 'Words for time', kind: 'facts', prereqs: [], batch: 6, intro: 'Historians use special words to talk about time. Knowing them makes every history topic easier.', teach: 'Explain what BC and AD mean.', talk: 'Ask her which century we are in, and why it isn’t the 20th.' },
  { id: 'history.century', title: 'Which century?', kind: 'skill', prereqs: ['history.words'], teach: 'Explain why 1900 is in the 19th century.', talk: 'Ask her which century the Great Fire of London (1666) was in.' },
  { id: 'history.timeline', title: 'The big timeline of Britain', kind: 'facts', prereqs: ['history.words'], batch: 6, intro: 'A secure mental timeline is the backbone of history. We’ll build it period by period, from the Stone Age to today.', teach: 'Put the Romans, Vikings and Tudors in order and say roughly when each was.', talk: 'Ask her to put three periods in order: Victorians, Romans, Tudors.' },
  { id: 'history.ancient', title: 'The earliest civilisations', kind: 'facts', prereqs: ['history.timeline'], batch: 5, intro: 'Long before Roman Britain, great civilisations grew up along rivers: in Egypt, Mesopotamia, India and China. Ancient Greece came a little later.', teach: 'Explain why early civilisations grew up near rivers.', talk: 'Ask her what the Greeks gave us that we still use today.' },
  { id: 'history.world', title: 'Beyond Europe: Baghdad, the Maya and Benin', kind: 'facts', prereqs: ['history.timeline'], batch: 5, intro: 'While Britain was in the Anglo-Saxon and medieval periods, other parts of the world had great cities and kingdoms.', teach: 'Explain why Baghdad around AD 900 was a centre of learning.', talk: 'Ask her what the House of Wisdom was.' },
  { id: 'history.1066', title: '1066: the year of three battles', kind: 'facts', prereqs: ['history.timeline'], batch: 5, diagnostic: ['history.1066.d1', 'history.1066.d2'], intro: 'When Edward the Confessor died in January 1066 without a child, several men claimed the English throne. This is the start of Year 7 history.', teach: 'Explain the most important reason William won at Hastings.', talk: 'Ask her who the claimants to the throne were in 1066.' },
  { id: 'history.normans', title: 'How the Normans took control', kind: 'facts', prereqs: ['history.1066'], batch: 5, intro: 'William had won a battle, but now he had to control a whole country of about two million English people.', teach: 'Explain how castles helped William control England.', talk: 'Ask her what the Domesday Book was for.' },
];

const items = [
  // --- words for time
  fact('w.bc', 'words', 'What does BC stand for?', 'Before Christ', ['Before Calendar', 'British Century', 'Before Caesar'], 'BC means “Before Christ”: years counted backwards from the traditional birth year of Jesus. Some books use BCE (Before Common Era).', { formats: ['choice'] }),
  fact('w.ad', 'words', 'What does AD stand for?', 'Anno Domini', ['After Death', 'Ancient Days', 'After Domesday'], 'AD stands for Anno Domini, Latin for “in the year of the Lord”. Some books use CE (Common Era).', { formats: ['choice'] }),
  fact('w.century', 'words', 'How many years are in a century?', '100', ['10', '1000', '50'], 'A century is 100 years.'),
  fact('w.decade', 'words', 'How many years are in a decade?', '10', ['100', '5', '1000'], 'A decade is 10 years (the 1960s is a decade).'),
  fact('w.millennium', 'words', 'How many years are in a millennium?', '1000', ['100', '10 000', '500'], 'A millennium is 1000 years.'),
  fact('w.circa', 'words', 'What does “c.” mean in front of a date, as in c. 1200?', 'about', ['century', 'certainly', 'counted'], '“c.” is short for “circa”, Latin for “around”. We use it when we don’t know the exact date.', { formats: ['choice'] }),
  fact('w.chronology', 'words', 'What is the word for putting events in time order?', 'chronology', ['geography', 'archaeology', 'biography'], 'Chronology means the order in which events happened (chron = time).'),
  fact('w.medieval', 'words', 'Which word describes the period in Europe from about AD 500 to 1500?', 'medieval', ['ancient', 'modern', 'prehistoric'], '“Medieval” means the Middle Ages, roughly AD 500 to 1500.'),
  fact('w.prehistory', 'words', 'What do we call the time before people wrote things down?', 'prehistory', ['antiquity', 'the Middle Ages', 'the Renaissance'], 'Prehistory is the time before written records. In Britain this includes the Stone, Bronze and Iron Ages.'),
  fact('w.primary', 'words', 'What is a source from the time being studied called?', 'a primary source', ['a secondary source', 'a reliable source', 'a modern source'], 'A primary source was made at the time (a diary, a coin, a photograph). A secondary source was made later (a textbook).', { formats: ['choice'] }),
  fact('w.archaeology', 'words', 'What is the study of the past through objects dug up from the ground called?', 'archaeology', ['geology', 'chronology', 'astronomy'], 'Archaeologists study the past from physical remains such as tools, bones and buildings.'),
  mcq('w.cent-now', 'words', 'Which century are we living in now?', [['the 21st century', true], ['the 20th century', false, 'The 20th century was 1901–2000. Years starting 20.. are in the 21st century.'], ['the 2000th century', false, 'Centuries are counted in hundreds of years, so we are only in the 21st.']], 'The 21st century runs from 2001 to 2100.'),

  // --- timeline
  order('t.o1', 'timeline', 'Put these periods of British history in order, earliest first.', ['Stone Age', 'Bronze Age', 'Iron Age', 'Roman Britain'], ['before c. 2500 BC', 'c. 2500–800 BC', 'c. 800 BC–AD 43', 'AD 43–410'], 'Stone tools came first, then bronze (a mix of copper and tin), then iron. The Romans invaded in AD 43.'),
  order('t.o2', 'timeline', 'Put these in order, earliest first.', ['Roman Britain', 'Anglo-Saxons', 'Vikings raid Lindisfarne', 'Norman Conquest'], ['AD 43–410', 'from c. 410', '793', '1066'], 'After the Romans left (c. 410), Anglo-Saxons settled. Vikings first raided in 793. The Normans conquered in 1066.'),
  order('t.o3', 'timeline', 'Put these periods in order, earliest first.', ['Normans', 'Tudors', 'Stuarts', 'Georgians', 'Victorians'], ['1066–1154', '1485–1603', '1603–1714', '1714–1837', '1837–1901'], 'Normans, then (after many medieval kings) the Tudors, Stuarts, Georgians and Victorians.'),
  order('t.o4', 'timeline', 'Put these events in order, earliest first.', ['Battle of Hastings', 'Magna Carta', 'Black Death', 'Battle of Bosworth'], ['1066', '1215', '1348', '1485'], 'Hastings 1066, Magna Carta 1215, the Black Death 1348, Bosworth (the first Tudor king) 1485.'),
  order('t.o5', 'timeline', 'Put these events in order, earliest first.', ['Spanish Armada', 'Gunpowder Plot', 'Great Fire of London', 'Queen Victoria crowned'], ['1588', '1605', '1666', '1838'], 'Armada 1588 (Elizabeth I), Gunpowder Plot 1605 (James I), Great Fire 1666 (Charles II), Victoria crowned 1838.'),
  order('t.o6', 'timeline', 'Put these in order, earliest first.', ['Ancient Egypt’s pyramids built', 'Ancient Greek Olympics begin', 'Romans invade Britain', 'House of Wisdom in Baghdad'], ['c. 2560 BC', '776 BC', 'AD 43', 'c. AD 830'], 'The Great Pyramid was finished around 2560 BC, the first recorded Olympics were in 776 BC, the Romans arrived in AD 43 and the House of Wisdom flourished in the 800s.'),
  fact('t.romans', 'timeline', 'In which year did the Romans invade Britain under Emperor Claudius?', 'AD 43', ['55 BC', 'AD 410', 'AD 122'], 'Julius Caesar visited in 55 and 54 BC, but the real invasion came in AD 43 under Claudius.', { accept: ['43', '43 ad'] }),
  fact('t.romans-leave', 'timeline', 'Roughly when did Roman rule in Britain end?', 'AD 410', ['AD 43', 'AD 1066', 'AD 793'], 'Around AD 410 the Roman army left and Britain had to defend itself.', { accept: ['410', '410 ad', 'c. 410', 'c 410'] }),
  fact('t.lindisfarne', 'timeline', 'The first famous Viking raid hit the monastery at Lindisfarne. In which year?', '793', ['1066', '410', '871'], 'Vikings attacked Lindisfarne in 793, shocking Christian Europe.', { accept: ['793 ad', 'ad 793'] }),
  fact('t.hastings', 'timeline', 'In which year was the Battle of Hastings?', '1066', ['1066 BC', '1086', '1215'], 'The Battle of Hastings was on 14 October 1066.', { distractors: ['1086', '1215', '966'] }),
  fact('t.magna', 'timeline', 'In which year did King John agree to Magna Carta?', '1215', ['1066', '1415', '1265'], 'Magna Carta (1215) limited the king’s power: even the king had to obey the law.'),
  fact('t.blackdeath', 'timeline', 'In which year did the Black Death reach England?', '1348', ['1066', '1666', '1485'], 'The Black Death arrived in 1348 and killed perhaps a third to a half of the population.'),
  fact('t.tudors', 'timeline', 'Which family ruled England from 1485 to 1603?', 'the Tudors', ['the Stuarts', 'the Normans', 'the Windsors'], 'Henry VII became the first Tudor king after winning at Bosworth in 1485. The last Tudor was Elizabeth I, who died in 1603.', { accept: ['tudors', 'tudor'] }),
  fact('t.victoria', 'timeline', 'Queen Victoria reigned from 1837 until which year?', '1901', ['1900', '1914', '1870'], 'Victoria reigned from 1837 to 1901: over 63 years.'),
  fact('t.ww1', 'timeline', 'In which years was the First World War?', '1914–1918', ['1939–1945', '1899–1902', '1914–1945'], 'The First World War lasted from 1914 to 1918.', { formats: ['choice'] }),
  fact('t.ww2', 'timeline', 'In which years was the Second World War?', '1939–1945', ['1914–1918', '1936–1942', '1945–1950'], 'The Second World War lasted from 1939 to 1945.', { formats: ['choice'] }),
  fact('t.bronze', 'timeline', 'Bronze is made by mixing copper with which metal?', 'tin', ['iron', 'gold', 'lead'], 'Bronze is copper mixed with tin. It was harder than copper alone.'),
  fact('t.stonehenge', 'timeline', 'Stonehenge was first built during which period?', 'the Stone Age', ['the Iron Age', 'Roman Britain', 'the Bronze Age only'], 'Work on Stonehenge began around 3000 BC, in the New Stone Age (Neolithic), and continued into the Bronze Age.', { formats: ['choice'] }),
  fact('t.alfred', 'timeline', 'Which Anglo-Saxon king of Wessex fought off the Vikings and is called “the Great”?', 'Alfred', ['Edward', 'Harold', 'Canute'], 'Alfred the Great (king 871–899) defended Wessex against the Vikings.', { accept: ['alfred the great', 'king alfred'] }),

  // --- ancient
  fact('a.egypt-river', 'ancient', 'Which river did Ancient Egypt depend on?', 'the Nile', ['the Tigris', 'the Indus', 'the Thames'], 'The Nile flooded every year, leaving rich soil for farming.', { accept: ['nile', 'river nile'] }),
  fact('a.mesopotamia', 'ancient', 'Mesopotamia means “land between two rivers”. Which two?', 'the Tigris and Euphrates', ['the Nile and Indus', 'the Yellow River and Yangtze', 'the Danube and Rhine'], 'Mesopotamia (modern Iraq) lay between the Tigris and Euphrates. The Sumerians there invented one of the first writing systems, cuneiform.', { formats: ['choice'] }),
  fact('a.indus', 'ancient', 'Which civilisation built the planned cities of Harappa and Mohenjo-daro?', 'the Indus Valley', ['Ancient Egypt', 'the Shang', 'Ancient Greece'], 'The Indus Valley civilisation (c. 2600–1900 BC) had well-planned cities with drains.', { formats: ['choice'] }),
  fact('a.shang', 'ancient', 'Which Chinese dynasty left writing on “oracle bones”?', 'the Shang', ['the Ming', 'the Tang', 'the Qin'], 'The Shang Dynasty (c. 1600–1046 BC) carved questions to their gods on oracle bones.', { formats: ['choice'] }),
  fact('a.hieroglyphs', 'ancient', 'What were Ancient Egyptian picture symbols for writing called?', 'hieroglyphs', ['cuneiform', 'runes', 'hieroglyphics only in Greece'], 'Egyptians wrote in hieroglyphs. The Rosetta Stone helped scholars decode them in 1822.', { distractors: ['cuneiform', 'runes', 'the alphabet'], accept: ['hieroglyphics'] }),
  fact('a.democracy', 'ancient', 'Which Greek city-state is famous for developing democracy?', 'Athens', ['Sparta', 'Rome', 'Troy'], 'Athens developed democracy (“rule by the people”) around 508 BC, though only free men could vote.'),
  fact('a.sparta', 'ancient', 'Which Greek city-state was famous for its warriors and tough training?', 'Sparta', ['Athens', 'Corinth', 'Olympia'], 'Spartan boys began military training at about age 7.'),
  fact('a.olympics', 'ancient', 'In which year were the first recorded Olympic Games held?', '776 BC', ['AD 776', '1896', '490 BC'], 'The first recorded Olympics were held at Olympia in 776 BC in honour of Zeus.', { formats: ['choice'] }),
  fact('a.marathon', 'ancient', 'At which battle in 490 BC did the Athenians defeat the Persians?', 'Marathon', ['Thermopylae', 'Troy', 'Hastings'], 'Legend says a runner ran from Marathon to Athens with the news, which is where the race gets its name.'),
  fact('a.greek-gift', 'ancient', 'Which of these do we owe to the Ancient Greeks?', 'the Olympic Games', ['the printing press', 'paper money', 'the compass'], 'The Greeks gave us the Olympics, democracy, theatre and many words, such as “alphabet” (from alpha, beta).', { formats: ['choice'] }),

  // --- world
  fact('wo.baghdad', 'world', 'What was the name of the great centre of learning in Baghdad around AD 900?', 'the House of Wisdom', ['the Great Library of Alexandria', 'the Colosseum', 'the Forbidden City'], 'The House of Wisdom gathered scholars who translated and improved Greek, Persian and Indian knowledge.', { formats: ['choice'] }),
  fact('wo.algebra', 'world', 'The word “algebra” comes from the work of which Baghdad scholar?', 'al-Khwarizmi', ['Aristotle', 'Isaac Newton', 'Archimedes'], 'Al-Khwarizmi (c. 780–850) wrote a book whose title gave us “algebra”. The word “algorithm” comes from his name.', { formats: ['choice'] }),
  fact('wo.baghdad-round', 'world', 'What shape was the city of Baghdad when it was founded in 762?', 'round', ['square', 'triangular', 'star-shaped'], 'Caliph al-Mansur built Baghdad as a “Round City” with walls in a circle.'),
  fact('wo.maya-where', 'world', 'The Maya civilisation was in which part of the world?', 'Central America', ['South-East Asia', 'North Africa', 'Northern Europe'], 'The Maya lived in what is now southern Mexico, Guatemala and Belize. Their classic period was about AD 250–900.', { formats: ['choice'] }),
  fact('wo.maya-zero', 'world', 'The Maya used a symbol for which important number, long before Europe?', 'zero', ['one million', 'pi', 'ten'], 'The Maya counted in 20s and had a symbol for zero, shaped like a shell.'),
  fact('wo.maya-writing', 'world', 'The Maya wrote using what?', 'glyphs', ['an alphabet of 26 letters', 'knotted strings only', 'no writing at all'], 'Maya writing used hundreds of glyphs carved on stone and written in folding books (codices).', { formats: ['choice'] }),
  fact('wo.benin-where', 'world', 'The Kingdom of Benin was in which modern country?', 'Nigeria', ['Benin', 'Egypt', 'Kenya'], 'The historic Kingdom of Benin was in what is now southern Nigeria, not the modern country called Benin.', { formats: ['choice'] }),
  fact('wo.benin-bronzes', 'world', 'What are the famous metal plaques and sculptures from Benin called?', 'the Benin Bronzes', ['the Elgin Marbles', 'the Terracotta Army', 'the Lewis Chessmen'], 'The Benin Bronzes are thousands of brass and bronze artworks. British soldiers took many in 1897.', { formats: ['choice'] }),
  fact('wo.benin-ruler', 'world', 'What was the title of the ruler of Benin?', 'the Oba', ['the Pharaoh', 'the Caliph', 'the Emperor'], 'The Oba ruled Benin from a great palace in Benin City.', { accept: ['oba'] }),

  // --- 1066
  mcq('1066.d1', '1066', 'Why was there a fight for the throne in 1066?', [['Edward the Confessor died without a child to inherit', true], ['The Vikings had killed the whole royal family', false, 'No: the problem was that King Edward had no son or daughter.'], ['England had never had a king before', false, 'England had had kings for over 100 years.']], 'King Edward the Confessor died on 5 January 1066 with no children, so several men claimed the throne.'),
  mcq('1066.d2', '1066', 'Who won the Battle of Hastings?', [['William of Normandy', true], ['Harold Godwinson', false, 'Harold was killed at Hastings.'], ['Harald Hardrada of Norway', false, 'Hardrada was killed earlier at Stamford Bridge.']], 'William of Normandy defeated and killed Harold Godwinson on 14 October 1066.'),
  fact('1066.claimants', '1066', 'Which English earl was crowned king the day after Edward the Confessor died?', 'Harold Godwinson', ['William of Normandy', 'Harald Hardrada', 'Edgar Ætheling'], 'Harold Godwinson, the most powerful earl in England, was crowned on 6 January 1066.', { accept: ['harold', 'harold ii'] }),
  fact('1066.hardrada', '1066', 'Which Norwegian king invaded northern England in September 1066?', 'Harald Hardrada', ['William of Normandy', 'Canute', 'Harold Godwinson'], 'Harald Hardrada landed with Tostig, Harold’s exiled brother.', { accept: ['hardrada', 'harald'] }),
  fact('1066.stamford', '1066', 'Where did Harold defeat Harald Hardrada in September 1066?', 'Stamford Bridge', ['Hastings', 'Fulford', 'York Minster'], 'Harold marched north and won at Stamford Bridge on 25 September 1066.'),
  fact('1066.fulford', '1066', 'At which battle did Hardrada defeat the northern earls, before Stamford Bridge?', 'Fulford', ['Hastings', 'Stamford Bridge', 'Bosworth'], 'Hardrada beat the earls Edwin and Morcar at Fulford, near York, on 20 September 1066.'),
  fact('1066.date', '1066', 'On what date was the Battle of Hastings?', '14 October 1066', ['25 December 1066', '5 January 1066', '25 September 1066'], 'Hastings: 14 October 1066. William was crowned on Christmas Day 1066.', { formats: ['choice'] }),
  fact('1066.edgar', '1066', 'Which teenage Anglo-Saxon prince also had a claim to the throne in 1066?', 'Edgar Ætheling', ['Alfred', 'Edward the Elder', 'Tostig'], 'Edgar Ætheling was the closest blood relative of Edward, but at about 14 he had little support.', { formats: ['choice'] }),
  { id: 'history.1066.why', topic: 'history.1066', kind: 'weighted', prompt: 'Historians argue about why William won at Hastings. Which factor do most see as the MOST important?', options: [
    { text: 'Harold’s army was exhausted after marching north to Stamford Bridge and back', weight: 3, feedback: 'Strong choice: Harold’s men had marched about 400 km in under three weeks. Many historians put this first, alongside William’s tactics.' },
    { text: 'William’s tactics, including the feigned retreats that broke the shield wall', weight: 3, feedback: 'Strong choice: the Norman feigned retreats lured the English off the hill. Many historians put this first.' },
    { text: 'William had a papal banner from the Pope', weight: 1, feedback: 'This boosted morale and gave William’s cause legitimacy, but it didn’t win the battle on its own.' },
    { text: 'The weather was sunny that day', weight: 0, feedback: 'There’s no evidence the weather decided the battle. The wind direction mattered for when William could cross the Channel, not for the fighting.' },
  ], explain: 'There is no single right answer: historians weigh Harold’s exhausted army, William’s tactics and luck (the wind delaying William until Harold had gone north). A strong answer compares factors and explains why one mattered most.' },
  mcq('1066.source', '1066', 'The Bayeux Tapestry was made for William’s half-brother, Bishop Odo. Which question could it BEST help a historian answer?', [['How did the Normans want people to remember the conquest?', true], ['What did ordinary English farmers think about William?', false, 'It was made for the Norman side, so it tells us little about English farmers’ views.'], ['Exactly how many soldiers fought at Hastings?', false, 'It is an embroidery, not a record of numbers.']], 'Every source can be useful: a Norman-made source is excellent evidence of the Norman point of view.'),

  // --- Normans
  fact('n.motte', 'normans', 'What kind of castle did the Normans build quickly after 1066?', 'motte and bailey', ['concentric', 'Roman fort', 'tower house'], 'A motte (earth mound) with a wooden tower, and a bailey (enclosed yard). Later many were rebuilt in stone.', { formats: ['choice'] }),
  fact('n.domesday', 'normans', 'In which year was the Domesday survey carried out?', '1086', ['1066', '1215', '1100'], 'William ordered the Domesday survey in 1086 to find out who owned what, so he could collect taxes.'),
  fact('n.domesday-why', 'normans', 'Why did William order the Domesday Book?', 'to find out what land was worth, for taxes', ['to record the soldiers who fought at Hastings', 'to write down all the laws of England', 'to list the books in every monastery'], 'Domesday recorded land, people, animals and value, showing William exactly what he could tax.', { formats: ['choice'] }),
  fact('n.feudal', 'normans', 'What was the system called where the king gave land in return for loyalty and military service?', 'the feudal system', ['democracy', 'the Danelaw', 'the wool trade'], 'Under the feudal system, land passed down from king to barons to knights to peasants, with loyalty and service owed upward.', { accept: ['feudal system', 'feudalism'] }),
  fact('n.harrying', 'normans', 'What do we call William’s brutal destruction of villages and crops in the north in 1069–70?', 'the Harrying of the North', ['the Black Death', 'the Peasants’ Revolt', 'the Domesday survey'], 'After rebellions in the north, William’s soldiers destroyed homes, crops and animals; many thousands starved.', { formats: ['choice'] }),
  fact('n.tower', 'normans', 'Which famous London castle was begun by William the Conqueror?', 'the Tower of London', ['Windsor Castle', 'Edinburgh Castle', 'Caernarfon Castle'], 'The White Tower at the Tower of London was begun by William around 1078.', { formats: ['choice'] }),
  fact('n.language', 'normans', 'Which language did the Norman rulers speak?', 'French', ['English', 'Latin only', 'Norse'], 'The new rulers spoke Norman French, which is why English has pairs like cow (English) and beef (from French boeuf).'),
  fact('n.churches', 'normans', 'Which great building in Durham did the Normans begin in 1093?', 'Durham Cathedral', ['Westminster Abbey', 'St Paul’s Cathedral', 'York Minster'], 'Durham Cathedral is one of the finest Norman buildings, with huge round arches.', { formats: ['choice'] }),
  { id: 'history.n.change', topic: 'history.normans', kind: 'weighted', prompt: 'Which change after 1066 affected the MOST people in England?', options: [
    { text: 'Almost all land passed from English to Norman lords', weight: 3, feedback: 'Strong: new lords meant new rent, new rules and new masters for millions of peasants.' },
    { text: 'New cathedrals were built in the Norman style', weight: 1, feedback: 'Impressive, but daily life for most people changed more because of new lords.' },
    { text: 'Kings now spoke French at court', weight: 1, feedback: 'This mattered for nobles and law, but most peasants never went to court.' },
  ], explain: 'Think about scale: who was affected, and how deeply? The transfer of land touched nearly everyone.' },
];

// --- memory hooks: a mnemonic (hook) and a real-world connection (example), merged in by id.
const topicHooks = {
  'history.words': '**BC** counts down towards year 1, **AD** counts up from it. There is no year 0: 1 BC is followed straight by AD 1.',
  'history.century': 'Add one to the hundreds: 1666 → 16 + 1 = **17th** century. A year ending in 00 belongs to the century that is just finishing.',
  'history.timeline': '“Willie, Willie, Harry, Stee, Harry, Dick, John, Harry three…”: the old rhyme that lists England’s monarchs since 1066, in order.',
  'history.ancient': 'Civilisations are born by rivers: **Nile** (Egypt), **Tigris and Euphrates** (Mesopotamia), **Indus** (Pakistan), **Yellow River** (China).',
  'history.world': 'Books, maths and brass: Baghdad’s **House of Wisdom**, the **Maya** zero and the **Benin** Bronzes.',
  'history.1066': '1066: the year of **three kings** (Edward, Harold, William) and **three battles** (Fulford, Stamford Bridge, Hastings).',
  'history.normans': 'William’s toolkit: **castles** to frighten, the **feudal system** to bind everyone to the king, **Domesday** to count it all.',
};

const memory = {
  // words for time
  'w.bc': { hook: 'BC counts **down** towards year 1, so 500 BC is longer ago than 100 BC.', example: 'Museum labels saying “c. 3000 BC” mean about 5000 years ago: roughly when Stonehenge was begun.' },
  'w.ad': { hook: '“Anno” is like “annual”: it means year. Anno Domini = “in the year of the Lord”, counting forwards.', example: 'Look for “A.D.” carved with the date on old buildings, foundation stones and gravestones.' },
  'w.century': { hook: '**Cent** = 100: 100 cents in a dollar, 100 centimetres in a metre, and a centipede is named for “100 legs”.', example: 'In cricket, when a batter scores 100 runs it is called a “century”.' },
  'w.decade': { hook: '**Dec** = 10: a decagon has 10 sides, and December was the 10th month of the old Roman year.', example: 'The 1960s, the 1990s and the 2010s are each a decade.' },
  'w.millennium': { hook: '**Mille** = 1000 in Latin: a millimetre is a thousandth of a metre, and a millipede is named for “1000 legs”.', example: 'London’s Millennium Bridge and the Millennium Dome (now the O2) were built to mark the year 2000.' },
  'w.circa': { hook: '**Circa** sounds like circle: we are circling around the date, close but not exactly on it.', example: 'Museum labels often say things like “c. 1500” when nobody knows the exact year an object was made.' },
  'w.chronology': { hook: '**Chron** = time (from Greek): chronological order, synchronise your watches, a chronometer is a clock.', example: 'The photos on a phone are shown in chronological order: oldest to newest, or newest first.' },
  'w.medieval': { hook: '**Medi** = middle, as in medium: the **Middle** Ages sit in the middle, between the ancient and modern worlds.', example: 'Medieval castles such as Warwick, Conwy and Bodiam can still be visited today.' },
  'w.prehistory': { hook: '**Pre** = before, as in preview: prehistory is the time **before** history was written down.', example: 'Stonehenge is prehistoric: nobody left any writing to tell us exactly why it was built.' },
  'w.primary': { hook: '**Primary** = first-hand, made at the time. **Secondary** = second-hand, made later.', example: 'A Victorian photo of your street is a primary source; a modern website about the Victorians is secondary.' },
  'w.archaeology': { hook: '**Archae** = ancient (like “archaic”): archaeologists dig up the past, layer by layer.', example: 'The Sutton Hoo ship burial in Suffolk was dug up in 1939; its famous helmet is in the British Museum.' },
  'w.cent-now': { hook: 'Like birthdays: when you are 10, you are in your 11th year. So the 2000s are the **21st** century.', example: 'The year 2000 was the last year of the 20th century; you were born in the 21st.' },

  // timeline
  't.o1': { hook: 'Tools got tougher: **stone**, then **bronze**, then **iron**. Then the Romans arrived in AD 43.', example: 'Stone Age Skara Brae (Orkney) and Iron Age hillforts such as Maiden Castle (Dorset) can still be visited.' },
  't.o2': { hook: '“**R**omans **A**lways **V**isit **N**ormandy”: Romans, Anglo-Saxons, Vikings, Normans.', example: 'Hadrian’s Wall (Roman), Sutton Hoo (Anglo-Saxon), Jorvik in York (Viking), the Tower of London (Norman).' },
  't.o3': { hook: '“**N**o **T**iny **S**quirrel **G**ets **V**exed”: Normans, Tudors, Stuarts, Georgians, Victorians.', example: 'Hampton Court Palace has Tudor rooms built for Henry VIII and grand Stuart rooms added for William and Mary.' },
  't.o4': { hook: 'Picture them in order: an **arrow** (Hastings), a **charter** (Magna Carta), a **flea** (Black Death), a **crown** (Bosworth).', example: 'Original copies of the 1215 Magna Carta can be seen at the British Library in London.' },
  't.o5': { hook: '“Remember, remember the fifth of November, gunpowder, treason and plot” (1605).', example: 'Bonfire Night (5 November) and the Monument in London, built for the Great Fire, still remind us of these events.' },
  't.o6': { hook: 'The pyramids were already about **1800 years old** when the first Olympic Games were held.', example: 'The flame for every modern Olympic Games is still lit at Olympia in Greece.' },
  't.romans': { hook: 'Claudius sent **4** legions in AD **4**3: four legions, forty-three.', example: 'Hadrian’s Wall still stands across northern England; Watling Street is the line of today’s A5.' },
  't.romans-leave': { hook: '43 in, 410 out: the Romans ruled Britain for **nearly 370 years**.', example: 'The Roman Baths in Bath are still fed by the hot spring. The Romans called the town Aquae Sulis.' },
  't.lindisfarne': { hook: '“Seven-nine-three, raiders from the sea.”', example: 'Lindisfarne (Holy Island) in Northumberland can only be reached across a causeway when the tide is out.' },
  't.hastings': { hook: '1066 → 1666 (Great Fire of London) is exactly **600 years**: just swap the 0 for a 6.', example: 'The town of Battle in East Sussex is named after it; Battle Abbey stands where the fighting took place.' },
  't.magna': { hook: '“Twelve-fifteen, the barons were keen.”', example: 'Four 1215 copies survive: two at the British Library, one at Lincoln Castle and one at Salisbury Cathedral.' },
  't.blackdeath': { hook: 'Black Death **1348**, Peasants’ Revolt **1381**: the revolt came 33 years later.', example: 'Builders of London’s Elizabeth line found a 1348 plague burial ground at Charterhouse Square in 2013.' },
  't.tudors': { hook: 'Tudors: **1485** (Bosworth) to **1603** (Elizabeth I dies): five monarchs in 118 years.', example: 'Henry VIII’s warship, the Mary Rose, can be seen in Portsmouth; Hampton Court was one of his palaces.' },
  't.victoria': { hook: 'Victoria lived just into the 20th century: she died in January **1901**.', example: 'Victorian post boxes still in use have “VR” on them: Victoria Regina (Queen Victoria).' },
  't.ww1': { hook: '**MAIN** causes of WW1: **M**ilitarism, **A**lliances, **I**mperialism, **N**ationalism. It ended at 11 a.m. on 11/11/1918.', example: 'On Remembrance Day (11 November) people wear poppies, which grew on the old battlefields of France and Belgium.' },
  't.ww2': { hook: 'WW2 began 21 years after WW1 ended: 1918 + 21 = **1939**. It lasted six years, to **1945**.', example: 'HMS Belfast, a Second World War warship, is moored on the Thames in London and can be visited.' },
  't.bronze': { hook: '**C**opper + **T**in = bronze. Cornwall’s tin was traded far and wide in the Bronze Age.', example: 'Many statues, such as the four lions in Trafalgar Square, are cast in bronze.' },
  't.stonehenge': { hook: '**Stone**henge was begun in the **Stone** Age, around 3000 BC.', example: 'Stonehenge, on Salisbury Plain in Wiltshire, lines up with the sunrise on midsummer’s day.' },
  't.alfred': { hook: 'Alfred and the cakes: legend says that while hiding from the Vikings he let a woman’s cakes burn.', example: 'A huge statue of Alfred stands in Winchester, his capital; the Alfred Jewel is in Oxford’s Ashmolean Museum.' },

  // ancient
  'a.egypt-river': { hook: '“Egypt is the gift of the Nile”: the Greek writer Herodotus.', example: 'Egyptian mummies and coffins can be seen in the British Museum in London.' },
  'a.mesopotamia': { hook: '**Meso** = middle, **potamos** = river: the land in the middle of the rivers. **T**igris and **E**uphrates: **T**wo **E**normous rivers.', example: 'Our 60-minute hour and 360° circle come from Mesopotamian counting in 60s.' },
  'a.indus': { hook: '**Indus** → **India**: the river gave the country its name.', example: 'Mohenjo-daro, now in Pakistan, had covered drains about 4500 years ago, thousands of years before London had sewers.' },
  'a.shang': { hook: 'Shang priests heated **oracle bones** until they cracked, then read the cracks as the gods’ answers.', example: 'Some Chinese characters still look like their Shang ancestors, such as 人 (person) and 日 (sun).' },
  'a.hieroglyphs': { hook: '**Hiero** = holy, **glyph** = carving: hieroglyphs are “holy carvings”.', example: 'The Rosetta Stone, the key to reading hieroglyphs, is in the British Museum in London.' },
  'a.democracy': { hook: '**Demos** = people, **kratos** = power: democracy is “people power”.', example: 'Every UK general election, when adults vote for their MP, uses the idea Athens began.' },
  'a.sparta': { hook: 'We still call something plain and tough “**spartan**”, after Sparta.', example: 'A bare room with hardly any furniture is still described as “spartan”.' },
  'a.olympics': { hook: '**776 BC**: the Olympics are older than Rome, which legend says was founded in 753 BC.', example: 'London has hosted the modern Olympic Games three times: 1908, 1948 and 2012.' },
  'a.marathon': { hook: 'The marathon race is named after the legend of a runner carrying news of the victory to Athens.', example: 'The London Marathon, run every year, is 26.2 miles long.' },
  'a.greek-gift': { hook: 'The first Olympic Games were held at Olympia in Greece in 776 BC, in honour of the god Zeus.', example: 'The front of the British Museum copies the columns of an ancient Greek temple.' },

  // world
  'wo.baghdad': { hook: 'The **House of Wisdom**: a giant library where scholars translated books from Greek, Persian and Sanskrit.', example: 'Our digits 0 to 9 reached Europe through scholars in the Islamic world, which is why we call them Arabic numerals.' },
  'wo.algebra': { hook: 'His book “al-jabr” → **algebra**; his name, al-Khwarizmi → **algorithm**.', example: 'Every computer and app runs on algorithms: a word named after al-Khwarizmi.' },
  'wo.baghdad-round': { hook: 'Picture a giant coin: the Round City had the caliph’s palace and great mosque in the very centre.' },
  'wo.maya-where': { hook: '**M**aya, **M**exico: southern Mexico, Guatemala and Belize, in Central America.', example: 'Maya pyramids, such as those at Chichén Itzá in Mexico, are visited by millions of people every year.' },
  'wo.maya-zero': { hook: 'The Maya zero looked like a shell: an empty shell means nothing.', example: 'The Maya invented zero on their own; the zero we use in 10, 100 or 2026 came from India, through scholars in Baghdad.' },
  'wo.maya-writing': { hook: 'Glyphs, like Egyptian hiero**glyphs**: picture-signs carved in stone.', example: 'The Dresden Codex, one of the few Maya folding books to survive, is kept in a library in Dresden, Germany.' },
  'wo.benin-where': { hook: 'The Kingdom of Benin is **N**ot in Benin: it was in **N**igeria.', example: 'Benin City is still a large city in southern Nigeria, in West Africa.' },
  'wo.benin-bronzes': { hook: '**B**enin **B**ronzes: many are really made of **b**rass.', example: 'Benin Bronzes are in the British Museum; some museums have now returned theirs to Nigeria.' },
  'wo.benin-ruler': { hook: '**Oba** for Benin, **Pharaoh** for Egypt, **Caliph** for Baghdad.', example: 'There is still an Oba of Benin today, with a palace in Benin City.' },

  // 1066
  '1066.d1': { hook: 'No child, no clear heir: so a crowd of claimants, Harold, William, Harald and Edgar.', example: 'Edward the Confessor rebuilt Westminster Abbey and is buried there; monarchs are still crowned in it.' },
  '1066.d2': { hook: '**W** for **W**illiam, **W** for **W**inner: he became William the Conqueror.', example: 'The Bayeux Tapestry, about 70 metres long, tells the story. Its usual home is a museum in Bayeux, Normandy.' },
  '1066.claimants': { hook: 'Harold was hasty: crowned the very **next day**, 6 January 1066.', example: 'Waltham Abbey in Essex claims to be Harold’s burial place; a stone marks the spot.' },
  '1066.hardrada': { hook: '“Hardrada” means roughly “hard ruler” in Old Norse: Norway’s tough Viking king.' },
  '1066.stamford': { hook: 'Stamford Bridge is often called the **end of the Viking Age** in England.', example: 'Stamford Bridge is a real village east of York, with a memorial to the battle.' },
  '1066.fulford': { hook: '“**F**ish **S**wim **H**ome”: **F**ulford, **S**tamford Bridge, **H**astings, the three battles in order.' },
  '1066.date': { hook: 'Hastings 14/10/1066, then a **Christmas Day** coronation for William: 25/12/1066.', example: 'Battle Abbey marks where Harold fell; re-enactments of the battle are often held there in October.' },
  '1066.edgar': { hook: '**Ætheling** means “prince”: Edgar was passed over for Harold, then named king after Hastings, but never crowned.' },
  '1066.source': { hook: 'Ask **who made it, and why**: a Norman-made tapestry shows the Norman side.', example: 'A full-size Victorian copy of the Bayeux Tapestry is on show in Reading Museum.' },

  // Normans
  'n.motte': { hook: '**M**otte = **M**ound; **B**ailey = **B**ig yard.', example: 'Clifford’s Tower in York stands on the motte William built in 1068; you can climb up to it today.' },
  'n.domesday': { hook: 'Domesday came 20 years after Hastings: 10**6**6 → 10**8**6.', example: 'You can search the Domesday Book online to see whether your town or village is in it.' },
  'n.domesday-why': { hook: 'It was nicknamed after **Doomsday**, Judgement Day: like God’s judgement, its answers could not be argued with.', example: 'The original Domesday Book is kept at The National Archives in Kew, London.' },
  'n.feudal': { hook: 'Picture a pyramid: the **king** at the top, then **barons**, **knights**, and lots of **peasants** at the bottom.', example: 'Titles such as “baron” and “lord”, still used in the House of Lords, come from feudal times.' },
  'n.harrying': { hook: 'To **harry** means to attack again and again: William harried the North to stop it rebelling.', example: 'The Domesday Book, 16 years later, still lists many Yorkshire villages as “waste”.' },
  'n.tower': { hook: 'The **White Tower**: William’s great stone keep, named after it was whitewashed in 1240.', example: 'The Tower of London is where the Crown Jewels are kept today.' },
  'n.language': { hook: 'Animals in the field have English names; meat on the Norman table has French ones: cow/beef, pig/pork, sheep/mutton.', example: 'The royal coat of arms still says “Dieu et mon droit”: French for “God and my right”.' },
  'n.churches': { hook: 'Norman = **round** arches and fat pillars. Later Gothic churches have **pointed** arches.', example: 'Durham Cathedral is a World Heritage Site; its huge patterned pillars are over 900 years old.' },
};

for (const id of Object.keys(memory)) if (!items.some((it) => it.id === `history.${id}`)) throw new Error(`history memory hook for unknown item ${id}`);
const withMemory = (it) => ({ ...it, ...memory[it.id.slice('history.'.length)] });

export default [{ subject: 'history', deck: 'core', topics: topics.map((t) => ({ ...t, hook: topicHooks[t.id] })), items: [...items.map(withMemory), { id: 'history.century.tmpl', topic: 'history.century', kind: 'template', gen: 'century', levels: [1, 2, 3], seed: [-0.8, 0.2, 1] }] }];

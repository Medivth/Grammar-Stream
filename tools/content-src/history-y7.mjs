// Year 7 history: medieval England to the Tudors, the core of most grammar-school Year 7 schemes.
// Second-order thinking (cause, significance, evidence, interpretation) is taught inside each topic.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `history.${id}`, topic: `history.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const weighted = (id, topic, prompt, options, explain) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'weighted', prompt, options: options.map(([text, weight, feedback]) => ({ text, weight, feedback })), explain });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'order', prompt, items, labels, explain, axis: 'time' });
const choiceOnly = { formats: ['choice'] };

const topics = [
  { id: 'history.church', title: 'The medieval Church and the Crusades', kind: 'facts', prereqs: ['history.normans'], batch: 5, intro: 'In medieval Europe almost everyone was Christian, and the Church shaped every part of life, from birth to death. In 1095 the Pope called on Christians to fight for Jerusalem.', teach: 'Explain why the Church was so powerful in medieval England.', talk: 'Ask her why ordinary people went on pilgrimages.' },
  { id: 'history.becket', title: 'Henry II and Thomas Becket', kind: 'facts', prereqs: ['history.church'], batch: 5, intro: 'Henry II made his friend Thomas Becket Archbishop of Canterbury, expecting him to do as he was told. It ended in murder in a cathedral.', teach: 'Explain why Henry II and Becket fell out.', talk: 'Ask her who was more to blame for Becket’s murder: Henry or Becket himself?' },
  { id: 'history.magna-carta', title: 'King John and Magna Carta', kind: 'facts', prereqs: ['history.becket'], batch: 5, intro: 'King John lost wars, quarrelled with the Pope and taxed his barons heavily. In 1215 they forced him to agree to a charter: Magna Carta.', teach: 'Explain why Magna Carta still matters today.', talk: 'Ask her what “nobody is above the law” has to do with 1215.' },
  { id: 'history.village', title: 'Life in a medieval village', kind: 'facts', prereqs: ['history.normans'], batch: 5, intro: 'Most people in medieval England were peasants who lived in villages, farmed strips of land and owed work to their lord.', teach: 'Describe a day in the life of a medieval peasant.', talk: 'Ask her what a villein had to do for the lord of the manor.' },
  { id: 'history.black-death', title: 'The Black Death', kind: 'facts', prereqs: ['history.village'], batch: 5, diagnostic: ['history.bd.d1'], intro: 'In 1348 a terrible disease reached England. Within two years it had killed between a third and a half of the population.', teach: 'Explain what people at the time thought caused the Black Death, and what really caused it.', talk: 'Ask her how the Black Death made life better for some peasants who survived.' },
  { id: 'history.peasants-revolt', title: 'The Peasants’ Revolt, 1381', kind: 'facts', prereqs: ['history.black-death'], batch: 5, intro: 'In 1381 thousands of peasants marched on London, captured the Tower and met the 14-year-old king. Why did they rebel?', teach: 'Explain the difference between a long-term cause and a trigger, using the Peasants’ Revolt.', talk: 'Ask her what the poll tax was and why it made people so angry.' },
  { id: 'history.war-france', title: 'The Hundred Years War and the Wars of the Roses', kind: 'facts', prereqs: ['history.magna-carta'], batch: 5, intro: 'For over a century English kings fought to rule France. Then the great families of England fought each other for the crown.', teach: 'Explain how the Wars of the Roses ended and who became king.', talk: 'Ask her what the Tudor rose stands for.' },
  { id: 'history.tudors', title: 'The Tudors: Henry VIII to Elizabeth I', kind: 'facts', prereqs: ['history.war-france'], batch: 5, intro: 'Henry VIII broke with the Pope so he could remarry. His three children each changed England’s religion again. Was Elizabeth’s reign a “golden age”?', teach: 'Explain why Henry VIII broke with the Church in Rome.', talk: 'Ask her the order of Henry VIII’s six wives, using “divorced, beheaded, died…”.' },
];

const items = [
  // --- Church and Crusades
  fact('ch.pope', 'church', 'Who was the head of the Church across western Europe in the Middle Ages?', 'the Pope', ['the King', 'the Archbishop of Canterbury', 'the Emperor'], 'The Pope, in Rome, led the Catholic Church across western Europe.', { accept: ['pope'] }),
  fact('ch.tithe', 'church', 'What was the tax of one tenth of everything a peasant produced, paid to the Church?', 'the tithe', ['the poll tax', 'the geld', 'the toll'], 'Peasants paid a tithe (one tenth) of their crops and animals to the Church.', { accept: ['tithe', 'a tithe'] }),
  fact('ch.purgatory', 'church', 'Where did medieval Christians believe souls went to be cleansed of sins before Heaven?', 'Purgatory', ['Hell', 'Limbo only', 'Valhalla'], 'Fear of Purgatory made people pray, give money and go on pilgrimages to shorten their time there.', choiceOnly),
  fact('ch.pilgrimage', 'church', 'What is a journey to a holy place called?', 'a pilgrimage', ['a crusade', 'a quest', 'a procession'], 'Pilgrims travelled to shrines such as Canterbury, Rome, Santiago de Compostela or Jerusalem.', { accept: ['pilgrimage'] }),
  fact('ch.monks', 'church', 'Men who lived in a monastery, following a strict rule of prayer and work, were called…', 'monks', ['knights', 'friars only', 'barons'], 'Monks (and nuns, in nunneries) prayed, copied books by hand and cared for the sick and poor.'),
  fact('ch.urban', 'church', 'Which Pope called the First Crusade in 1095?', 'Urban II', ['Gregory I', 'Innocent III', 'Leo X'], 'At Clermont in 1095, Pope Urban II urged knights to recapture Jerusalem, promising forgiveness of their sins.', choiceOnly),
  fact('ch.jerusalem', 'church', 'In which year did the First Crusaders capture Jerusalem?', '1099', ['1066', '1187', '1215'], 'The crusaders took Jerusalem in 1099 and killed many of its Muslim and Jewish inhabitants.'),
  fact('ch.saladin', 'church', 'Which Muslim leader recaptured Jerusalem in 1187?', 'Saladin', ['Suleiman', 'Harun al-Rashid', 'Genghis Khan'], 'Saladin, Sultan of Egypt and Syria, defeated the crusaders at Hattin and took Jerusalem in 1187. He was respected even by his enemies.'),
  fact('ch.richard', 'church', 'Which English king led the Third Crusade (1189–92)?', 'Richard I', ['Henry II', 'King John', 'Edward I'], 'Richard I, “the Lionheart”, won battles but never recaptured Jerusalem. He spent only about six months of his reign in England.', { accept: ['richard the lionheart', 'richard'] }),
  mcq('ch.why-crusade', 'church', 'Why did many knights join the First Crusade?', [['A mix of faith, forgiveness and hope of land', true], ['Only because the king forced them to go', false, 'Kings did not force most crusaders. Many went because of their faith and the Pope’s promise.'], ['To spread the English language and laws', false, 'Crusaders came from all over western Europe; language had nothing to do with it.']], 'Historians stress mixed motives: genuine faith, the Pope’s promise of forgiveness, adventure, and for some, land and wealth.'),

  // --- Henry II and Becket
  fact('bk.henry', 'becket', 'In which year did Henry II become king?', '1154', ['1066', '1100', '1189'], 'Henry II ruled from 1154 to 1189, over England and much of France (the Angevin Empire).'),
  fact('bk.archbishop', 'becket', 'Which job did Henry II give Thomas Becket in 1162?', 'Archbishop of Canterbury', ['Lord Mayor of London', 'Pope', 'Earl of Kent'], 'Henry expected his friend and chancellor to support him as head of the English Church. Instead Becket defended the Church against the king.', choiceOnly),
  fact('bk.courts', 'becket', 'What did Henry and Becket quarrel about most?', 'which courts should try criminal priests', ['who should marry Henry’s eldest daughter', 'where to build a great new cathedral', 'whether England should join a crusade'], 'Church courts gave lighter punishments. Henry wanted “criminous clerks” punished in royal courts (Constitutions of Clarendon, 1164).', choiceOnly),
  fact('bk.date', 'becket', 'In which year was Thomas Becket murdered in Canterbury Cathedral?', '1170', ['1154', '1215', '1066'], 'Four knights killed Becket on 29 December 1170 after Henry reportedly raged against him.'),
  fact('bk.saint', 'becket', 'What happened to Becket’s reputation after his murder?', 'he was made a saint', ['he was quickly forgotten', 'he was declared a traitor', 'his tomb was destroyed at once'], 'Becket was made a saint in 1173. Henry did public penance at his tomb in 1174. Chaucer’s Canterbury Tales are about pilgrims going to his shrine.', choiceOnly),
  mcq('bk.source', 'becket', 'Edward Grim, a monk who was injured trying to protect Becket, wrote an account of the murder. What makes it especially useful to historians?', [['He was an eyewitness who was there in the cathedral', true], ['He was the king’s official historian', false, 'He was a monk, not working for the king.'], ['It was written hundreds of years later with more information', false, 'He wrote soon after the event, which is part of its value.']], 'Eyewitness accounts give vivid detail, though historians remember Grim admired Becket, which may shape how he told the story.'),

  // --- John and Magna Carta
  fact('mc.john', 'magna-carta', 'Which king agreed to Magna Carta?', 'King John', ['Henry II', 'Richard I', 'Edward I'], 'King John (ruled 1199–1216) agreed to Magna Carta in 1215.', { accept: ['john'] }),
  fact('mc.where', 'magna-carta', 'Where was Magna Carta agreed in 1215?', 'Runnymede', ['Westminster', 'Hastings', 'Windsor Castle'], 'John met the rebel barons in a meadow at Runnymede, by the Thames near Windsor, in June 1215.'),
  fact('mc.who', 'magna-carta', 'Which group forced John to agree to Magna Carta?', 'the barons', ['the peasants', 'the Pope', 'the French king'], 'Rebel barons, angry at heavy taxes and failed wars, captured London and forced John to negotiate.'),
  fact('mc.normandy', 'magna-carta', 'Which part of France did King John, nicknamed “Softsword”, lose in 1204?', 'Normandy', ['Aquitaine', 'Brittany', 'Calais'], 'Losing Normandy, the homeland of the Norman kings, was a huge blow to John’s reputation.'),
  mcq('mc.clause', 'magna-carta', 'Magna Carta said no free man could be imprisoned except by “the lawful judgement of his equals or by the law of the land”. Why does this matter today?', [['It says even the ruler must obey the law', true], ['It gave every adult the right to vote', false, 'Voting rights came centuries later.'], ['It freed all the peasants from their lords', false, 'It protected “free men”, mainly barons. Most peasants were not free.']], 'Magna Carta mostly protected the barons, but its idea that the king is under the law inspired later rights, including the US Constitution.'),
  fact('mc.montfort', 'magna-carta', 'In 1265, whose parliament first included ordinary townsmen (burgesses) as well as nobles?', 'Simon de Montfort', ['King John', 'Thomas Becket', 'Richard II'], 'Simon de Montfort, rebelling against Henry III, called a parliament with knights and burgesses: an important step towards today’s Parliament.'),

  // --- village
  fact('v.manor', 'village', 'The land and village owned by a lord was called a…', 'manor', ['parish', 'county', 'castle'], 'A manor included the lord’s house, his land (the demesne) and the villagers’ strips.'),
  fact('v.villein', 'village', 'What was a peasant called who was not free and had to work on the lord’s land?', 'a villein', ['a baron', 'a knight', 'a burgess'], 'Villeins (serfs) could not leave the manor without permission and owed the lord several days’ work a week.', { accept: ['villein', 'a serf', 'serf'] }),
  fact('v.strips', 'village', 'How was farmland usually divided in a medieval village?', 'into strips in large open fields', ['into small walled gardens', 'into equal squares for each family', 'it was not divided at all'], 'Each family farmed scattered strips in two or three huge open fields, with one field left fallow (resting) each year.', choiceOnly),
  fact('v.reeve', 'village', 'Which villager made sure everyone did their work for the lord?', 'the reeve', ['the sheriff', 'the abbot', 'the knight'], 'The reeve was a peasant chosen to organise work on the lord’s land.'),
  fact('v.wool', 'village', 'What was medieval England’s most valuable export?', 'wool', ['tin', 'wine', 'silk'], 'English wool was sold across Europe. The Lord Speaker still sits on a “Woolsack” in the House of Lords.'),
  fact('v.diet', 'village', 'What was the main food of medieval peasants?', 'bread and pottage', ['roast beef and ale', 'potatoes and cabbage', 'rice and fish'], 'Peasants ate bread, pottage and ale. Potatoes did not arrive in Europe until after 1500.', choiceOnly),

  // --- Black Death
  mcq('bd.d1', 'black-death', 'What do scientists now know caused the Black Death?', [['A bacterium spread by fleas', true], ['Bad smells, or “miasma”, in the air', false, 'Many people at the time believed in “miasma”, but smells don’t cause plague.'], ['An unlucky line-up of the planets', false, 'Medieval doctors blamed the planets, but it was a bacterium.'], ['God punishing people for their sins', false, 'This was a common belief at the time, but the cause was a disease.']], 'The plague bacterium (Yersinia pestis) was spread by flea bites, and the pneumonic form passed from person to person through coughing.'),
  fact('bd.year', 'black-death', 'In which year did the Black Death reach England?', '1348', ['1066', '1381', '1666'], 'It arrived at Melcombe (now part of Weymouth) in Dorset in 1348.'),
  fact('bd.toll', 'black-death', 'Roughly how much of England’s population died in the Black Death?', 'a third to a half', ['about one in a hundred', 'everyone except the nobles', 'about a tenth'], 'Historians estimate 30 to 50% of the population died in 1348–50.', choiceOnly),
  fact('bd.flagellants', 'black-death', 'What were people called who whipped themselves in public, hoping God would end the plague?', 'flagellants', ['pilgrims', 'crusaders', 'friars'], 'Flagellants believed that punishing themselves might win God’s forgiveness.'),
  fact('bd.miasma', 'black-death', 'Many medieval people believed disease was spread by “bad air”. What was this idea called?', 'miasma', ['germ theory', 'humours', 'contagion'], 'Miasma theory lasted until germ theory in the 1860s. People carried sweet-smelling herbs to protect themselves.'),
  mcq('bd.consequence', 'black-death', 'Why did wages rise after the Black Death?', [['Workers were scarce, so they could demand more', true], ['The king ordered higher wages to help peasants', false, 'In fact the government tried to stop wages rising, with the Statute of Labourers (1351).'], ['Lords became kinder and more generous after the plague', false, 'Lords paid more because they had to, not out of kindness.']], 'A labour shortage gave peasants bargaining power. The Statute of Labourers (1351) tried to cap wages, which caused deep resentment.'),
  fact('bd.statute', 'black-death', 'Which 1351 law tried to stop peasants demanding higher wages?', 'the Statute of Labourers', ['Magna Carta', 'the Domesday Book', 'the Poll Tax'], 'The Statute of Labourers fixed wages at pre-plague levels: a long-term cause of the Peasants’ Revolt.', choiceOnly),

  // --- Peasants' Revolt
  fact('pr.year', 'peasants-revolt', 'In which year was the Peasants’ Revolt?', '1381', ['1348', '1215', '1415'], 'The revolt began in Essex and Kent in May and June 1381.'),
  fact('pr.tax', 'peasants-revolt', 'Which tax, charged on every adult, triggered the revolt?', 'the poll tax', ['the tithe', 'income tax', 'the window tax'], 'A third poll tax in 1380 charged everyone the same, rich or poor. Tax collectors in Essex were attacked in 1381.', { accept: ['poll tax'] }),
  fact('pr.tyler', 'peasants-revolt', 'Who led the rebels from Kent?', 'Wat Tyler', ['John Ball', 'Robin Hood', 'Jack Cade'], 'Wat Tyler led the rebels into London. He was killed at Smithfield by the Lord Mayor, William Walworth.', { accept: ['tyler'] }),
  fact('pr.ball', 'peasants-revolt', 'Which preacher asked, “When Adam delved and Eve span, who was then the gentleman?”', 'John Ball', ['Wat Tyler', 'Thomas Becket', 'John Wycliffe'], 'John Ball preached that God made everyone equal, so no one should be a serf.', { accept: ['ball'] }),
  fact('pr.richard', 'peasants-revolt', 'How old was King Richard II when he met the rebels?', '14', ['8', '21', '40'], 'Richard II was only 14. He met the rebels at Mile End and Smithfield.'),
  mcq('pr.trigger', 'peasants-revolt', 'Which of these was the TRIGGER of the Peasants’ Revolt (the spark), rather than a long-term cause?', [['Poll tax collectors arriving in Essex in 1381', true], ['Villeins working for their lords for centuries', false, 'This is a long-term cause: it had built up resentment over many years.'], ['The Statute of Labourers, passed in 1351', false, 'This is a long-term cause, 30 years earlier.'], ['John Ball’s long preaching about equality', false, 'Ball had preached for years. His ideas were a long-term cause.']], 'Long-term causes build up pressure; a trigger is the event that sets it off.'),
  weighted('pr.why', 'peasants-revolt', 'Historians disagree about the MAIN cause of the revolt. Which is the strongest argument?', [
    ['Anger at serfdom: peasants wanted freedom, and the poll tax was just the last straw', 3, 'Strong: the rebels’ demands at Mile End were mainly about ending serfdom, not just the tax.'],
    ['The poll tax: it was unfair and had already been charged three times', 2, 'A good argument, but the demands went much further than the tax, which suggests deeper causes.'],
    ['Richard II was a weak king', 1, 'The king’s youth mattered, but the rebels said they were loyal to him and blamed his advisers.'],
    ['Bad weather that summer', 0, 'There is no evidence weather caused the revolt.'],
  ], 'Strong history answers weigh causes. The rebels’ demands (an end to serfdom, cheap land rent) show what they really wanted.'),
  fact('pr.outcome', 'peasants-revolt', 'What happened after the rebels went home?', 'the king broke his promises', ['serfdom was ended at once', 'Wat Tyler became the king’s adviser', 'the poll tax was doubled again'], 'Richard’s promises were cancelled and John Ball was executed. But in the long run lords found it harder to control peasants, and serfdom faded away over the next century.', choiceOnly),

  // --- Hundred Years War, Wars of the Roses
  fact('wf.dates', 'war-france', 'The Hundred Years War actually lasted from 1337 until…', '1453', ['1437', '1485', '1360'], 'It lasted 116 years, on and off.'),
  fact('wf.longbow', 'war-france', 'Which weapon helped the English win at Crécy (1346) and Agincourt?', 'the longbow', ['the cannon', 'the crossbow', 'the musket'], 'English and Welsh archers could shoot about 10 arrows a minute.', { accept: ['longbow', 'longbows'] }),
  fact('wf.agincourt', 'war-france', 'Which king won the Battle of Agincourt in 1415?', 'Henry V', ['Henry VIII', 'Edward III', 'Richard III'], 'Henry V’s smaller, exhausted army defeated the French on 25 October 1415.'),
  fact('wf.joan', 'war-france', 'Which teenage French girl led an army to relieve the siege of Orléans in 1429?', 'Joan of Arc', ['Eleanor of Aquitaine', 'Marie Curie', 'Catherine de’ Medici'], 'Joan said she heard voices from God. She was captured, handed over to the English, tried by a Church court that supported them and burned at Rouen in 1431.', { accept: ['joan', 'jeanne d’arc', "jeanne d'arc"] }),
  fact('wf.calais', 'war-france', 'Which was the only part of France still held by England when the war ended in 1453?', 'Calais', ['Normandy', 'Paris', 'Bordeaux'], 'England kept Calais until 1558.'),
  fact('wf.roses', 'war-france', 'The Wars of the Roses were fought between which two families?', 'Lancaster and York', ['Tudor and Stuart', 'Norman and Saxon', 'Windsor and Hanover'], 'The House of Lancaster (red rose) fought the House of York (white rose) from 1455 to 1487.', choiceOnly),
  fact('wf.princes', 'war-france', 'Which king is suspected of having his nephews, the “Princes in the Tower”, killed?', 'Richard III', ['Henry VII', 'Edward IV', 'Henry VI'], 'The boys disappeared in 1483 after their uncle Richard took the throne. Historians still argue about what happened.'),
  fact('wf.bosworth', 'war-france', 'Who won the Battle of Bosworth in 1485 and became the first Tudor king?', 'Henry Tudor', ['Richard III', 'Henry VIII', 'Edward of York'], 'Richard III was killed at Bosworth. His skeleton was found under a Leicester car park in 2012.', { accept: ['henry vii', 'henry tudor', 'henry 7'], formats: ['choice', 'typed'] }),
  fact('wf.tudor-rose', 'war-france', 'What did the Tudor rose (red and white together) symbolise?', 'the joining of Lancaster and York', ['England’s great victory over France', 'the new Church of England', 'the union of England and Scotland'], 'Henry VII (Lancaster) married Elizabeth of York in 1486, uniting the two families.', choiceOnly),

  // --- Tudors
  fact('td.henry8', 'tudors', 'How many times did Henry VIII marry?', '6', ['3', '4', '8'], 'Divorced, beheaded, died; divorced, beheaded, survived.'),
  order('td.wives', 'tudors', 'Put Henry VIII’s wives in order.', ['Catherine of Aragon', 'Anne Boleyn', 'Jane Seymour', 'Anne of Cleves', 'Catherine Howard', 'Catherine Parr'], ['divorced (annulled)', 'beheaded 1536', 'died 1537', 'divorced (annulled)', 'beheaded 1542', 'survived'], '“Divorced, beheaded, died; divorced, beheaded, survived.”'),
  mcq('td.break', 'tudors', 'Why did Henry VIII break with the Catholic Church in Rome?', [['The Pope would not annul his first marriage', true], ['He had become a Protestant after reading Luther', false, 'Henry had actually written against Luther and was called “Defender of the Faith” by the Pope.'], ['The Pope threatened to invade England', false, 'There was no papal invasion.']], 'Henry needed a male heir. When the Pope refused an annulment, Henry made himself head of the English Church (Act of Supremacy, 1534). Money and power mattered too.'),
  fact('td.supremacy', 'tudors', 'Which 1534 law made Henry VIII Supreme Head of the Church of England?', 'the Act of Supremacy', ['Magna Carta', 'the Poor Law', 'the Statute of Labourers'], 'The Act of Supremacy (1534) cut England off from the Pope’s authority.', choiceOnly),
  fact('td.dissolution', 'tudors', 'Between 1536 and 1541 Henry closed every monastery in England and Wales and took their wealth. What is this called?', 'the Dissolution of the Monasteries', ['the Reformation Parliament of 1529', 'the Pilgrimage of Grace rebellion', 'the Enclosure of the Common Lands'], 'Henry gained huge wealth. The ruins of abbeys such as Fountains and Tintern date from this time.', choiceOnly),
  fact('td.edward', 'tudors', 'Which of Henry VIII’s children became king in 1547, aged 9?', 'Edward VI', ['Henry IX', 'Richard IV', 'James I'], 'Edward VI, son of Jane Seymour, made England more Protestant but died aged 15 in 1553.', { accept: ['edward', 'edward 6'] }),
  fact('td.mary', 'tudors', 'Which Tudor queen tried to bring back Catholicism and had about 280 Protestants burned?', 'Mary I', ['Elizabeth I', 'Lady Jane Grey', 'Mary, Queen of Scots'], 'Mary I (1553–58) was later nicknamed “Bloody Mary” by Protestant writers.', { accept: ['mary', 'mary 1', 'mary tudor'] }),
  fact('td.elizabeth', 'tudors', 'Elizabeth I reigned from 1558 until which year?', '1603', ['1588', '1600', '1625'], 'Elizabeth reigned for 44 years and never married. The crown passed to James VI of Scotland.'),
  fact('td.armada', 'tudors', 'In 1588 which country sent a huge fleet, the Armada, to invade England?', 'Spain', ['France', 'Denmark', 'the Netherlands'], 'Philip II of Spain’s Armada was scattered by English fire ships and storms.'),
  fact('td.drake', 'tudors', 'Which Elizabethan sailor sailed all the way around the world (1577–80)?', 'Francis Drake', ['Walter Raleigh', 'Christopher Columbus', 'James Cook'], 'Drake was the first Englishman to circumnavigate the globe. To the Spanish he was a pirate.', { accept: ['drake', 'sir francis drake'] }),
  mcq('td.golden', 'tudors', 'Why do historians disagree about whether Elizabeth’s reign was a “golden age”?', [['It was glorious for some groups but hard for others', true], ['Some historians have not read the evidence', false, 'Historians disagree because they ask different questions and look at different evidence.'], ['Nobody wrote anything down in Elizabeth’s time', false, 'There is lots of evidence from Elizabeth’s reign.']], 'Interpretations depend on whose experience you focus on and what you count as success. That is why a good answer weighs both sides.'),
  order('td.order', 'tudors', 'Put these Tudor monarchs in order.', ['Henry VII', 'Henry VIII', 'Edward VI', 'Mary I', 'Elizabeth I'], ['1485–1509', '1509–1547', '1547–1553', '1553–1558', '1558–1603'], 'Five Tudor monarchs ruled from 1485 to 1603.'),
];

// --- memory hooks: a mnemonic (hook) and a real-world connection (example), merged in by id.
const topicHooks = {
  'history.church': 'The Church was there from **cradle to grave**, and every peasant paid it a **tithe**: one tenth of everything.',
  'history.becket': '“Will no one rid me of this turbulent priest?”: the words Henry II is famously said to have shouted.',
  'history.magna-carta': '**Magna** = great (as in magnify), **Carta** = charter: the Great Charter of 1215 put the king under the law.',
  'history.village': '“Some pray, some fight, some work”: and the ones who worked, the peasants, were almost everyone.',
  'history.black-death': '**1348** plague → **1351** wages frozen → **1381** revolt: death, then anger, then rebellion.',
  'history.peasants-revolt': '“When Adam delved and Eve span, who was then the gentleman?”: John Ball’s famous question.',
  'history.war-france': 'The Hundred Years War lasted **116** years; the Wars of the Roses were **red** Lancaster against **white** York.',
  'history.tudors': '“Divorced, beheaded, died; divorced, beheaded, survived”: Henry VIII’s six wives, in order.',
};

const memory = {
  // Church and Crusades
  'ch.pope': { hook: '**Pope** comes from “papa”, father: the father of the Church, based in Rome.', example: 'The Pope still lives in Vatican City, inside Rome: the smallest country in the world.' },
  'ch.tithe': { hook: '**Tithe** sounds like **tenth**, and that is just what it means.', example: 'Huge tithe barns, like the medieval one at Bradford on Avon in Wiltshire, were built to store the Church’s tenth.' },
  'ch.purgatory': { hook: '**Purg**atory sounds like **purge** (to clean out): a waiting room where souls were cleaned before Heaven.' },
  'ch.pilgrimage': { hook: 'Pilgrims brought home **badges** like souvenirs: a scallop shell meant you had been to Santiago.', example: 'Scallop-shell signs still mark the Camino, the pilgrims’ path to Santiago de Compostela in Spain.' },
  'ch.monks': { hook: '**Monk** comes from Greek monos, “alone” (like **mono**rail): monks lived apart from the world.', example: 'Ruined abbeys such as Whitby and Fountains in Yorkshire were once busy homes for monks.' },
  'ch.urban': { hook: 'Pope **Urban** (think “city”) wanted Christians to win back the holy **city** of Jerusalem.' },
  'ch.jerusalem': { hook: '**1095** called, **1099** captured: the First Crusade took four years.', example: 'Jerusalem is still a holy city for Jews, Christians and Muslims today.' },
  'ch.saladin': { hook: 'Saladin took Jerusalem in **1187**; Richard the Lionheart’s Third Crusade set out two years later to win it back.' },
  'ch.richard': { hook: '**Lion**heart, brave as a lion, yet he spent only about six months of his reign in England.', example: 'A statue of Richard the Lionheart on horseback stands outside the Houses of Parliament in London.' },
  'ch.why-crusade': { hook: 'The three Gs: **G**od, **G**lory and **G**old: faith, adventure and the hope of wealth.' },

  // Henry II and Becket
  'bk.henry': { hook: 'Henry II reigned **1154–1189**; Becket was killed in **1170**, about halfway through.', example: 'Henry II is buried at Fontevraud Abbey in France: a sign of how much of France he ruled.' },
  'bk.archbishop': { hook: 'Becket went from **chancellor** (the king’s man) to **archbishop** (the Church’s man), and changed sides.', example: 'The Archbishop of Canterbury still leads the Church of England and crowns new monarchs.' },
  'bk.courts': { hook: '“Criminous clerks”: should a priest who broke the law face the **king’s** court or the **Church’s**?' },
  'bk.date': { hook: 'Murdered **1170**, made a saint **1173**: just three years from murder to saint.', example: 'A candle burns in Canterbury Cathedral where Becket’s shrine once stood, and the place where he fell is marked.' },
  'bk.saint': { hook: 'The **Canterbury Tales** are stories told by pilgrims on the road to Becket’s shrine.', example: 'Geoffrey Chaucer’s Canterbury Tales are still read today, in schools and in children’s retellings.' },
  'bk.source': { hook: 'An **eye**witness saw it with his own **eyes**, but Grim was Becket’s admirer, so check for bias.' },

  // John and Magna Carta
  'mc.john': { hook: 'There has only ever been **one** King John of England: no later king has taken the name.', example: 'King John’s tomb is in Worcester Cathedral.' },
  'mc.where': { hook: '**Runnymede**: “mede” is an old word for meadow, and the barons met John in a meadow by the Thames.', example: 'Runnymede is now a National Trust meadow near Windsor, with a memorial to Magna Carta.' },
  'mc.who': { hook: 'The **barons** bargained: rebel barons captured London in May 1215, so John had to talk.' },
  'mc.normandy': { hook: 'John “Softsword” lost **Normandy** in **1204**: the Norman kings’ own homeland, gone.', example: 'The Channel Islands, such as Jersey and Guernsey, are the last part of the old Duchy of Normandy still linked to the Crown.' },
  'mc.clause': { hook: '**Nobody is above the law**, not even the king: the big idea of 1215.', example: 'The US Constitution and modern human rights laws echo Magna Carta’s ideas.' },
  'mc.montfort': { hook: '**1265** is exactly **50 years** after Magna Carta (1215).', example: 'De Montfort University in Leicester is named after him.' },

  // village
  'v.manor': { hook: '**Manor** → “manor house”: the lord’s big house at the heart of the village.', example: 'Many villages still have a Manor Farm or Manor House: a clue to the old lord of the manor.' },
  'v.villein': { hook: 'A **villein** was tied to his **vill**age. Our word “villain” comes from it!' },
  'v.strips': { hook: 'Three fields: one for winter crops, one for spring crops, one resting (**fallow**), taking turns each year.', example: 'Wavy “ridge and furrow” lines left by medieval ploughing can still be seen in many fields today.' },
  'v.reeve': { hook: 'A **reeve** ran the work of a village; a **shire-reeve** (sheriff) kept order in a whole county.' },
  'v.wool': { hook: 'England’s wealth was built “on the sheep’s back”: wool paid for castles and churches.', example: 'Rich “wool churches”, like the one in Lavenham, Suffolk, were paid for by wool merchants.' },
  'v.diet': { hook: '**Pottage** = everything in one **pot**: a thick stew of vegetables, beans and grain.', example: 'Potatoes came from South America after 1500, so there were no medieval chips!' },

  // Black Death
  'bd.d1': { hook: 'Bacteria in **fleas**, fleas on **rats** (and on people): the plague travelled by flea bite. Doctors then blamed bad air and the planets.' },
  'bd.year': { hook: '“Thirteen-forty-eight, the plague came through the gate.”' },
  'bd.flagellants': { hook: '**Flag**ellants **flog**ged themselves: flagellum is Latin for whip.' },
  'bd.miasma': { hook: '**Miasma** is Greek for “pollution”: foul, misty air, so people carried posies of sweet herbs to block it.', example: 'Beaked plague-doctor masks (from a later century) were stuffed with herbs to keep out miasma.' },
  'bd.consequence': { hook: 'Fewer workers = each worker worth more. Scarce things cost more.', example: 'Today too, when employers cannot find enough workers, wages tend to rise.' },
  'bd.statute': { hook: 'A **stat**ute to keep wages **stat**ic: 1351, just three years after the plague arrived.' },

  // Peasants' Revolt
  'pr.year': { hook: '“In thirteen-eighty-one, the peasants’ revolt had begun.”', example: 'The rebels camped at Blackheath, in south-east London, where John Ball preached to them.' },
  'pr.tax': { hook: '**Poll** is an old word for **head**: a tax on every head, the same for rich and poor.', example: 'A new “poll tax” in 1990 also caused huge protests: history echoing 1381.' },
  'pr.tyler': { hook: '**Wat led, Ball preached**: Wat Tyler was the leader, John Ball the preacher.', example: 'Smithfield in London, where Tyler met the king, has been home to a famous meat market for centuries.' },
  'pr.ball': { hook: '“Delved” = dug, “span” = spun wool: when the first people worked the land, nobody was a lord.' },
  'pr.richard': { hook: 'Richard II was **14**: the age of a Year 9 pupil, facing an angry crowd.', example: 'The Wilton Diptych, a painting of the young Richard II, hangs in the National Gallery in London.' },
  'pr.trigger': { hook: 'Think of a bonfire: long-term causes are the **wood**, the trigger is the **match**.' },
  'pr.outcome': { hook: 'Richard is reported to have told the peasants: “Villeins you are, and villeins you shall remain.”' },

  // Hundred Years War, Wars of the Roses
  'wf.dates': { hook: 'Not 100 but **116** years: 1337 to 1453.' },
  'wf.longbow': { hook: 'Crécy, Poitiers, Agincourt: the longbow’s three great English wins.', example: 'Over 130 longbows were found on the Mary Rose wreck; you can see them in Portsmouth.' },
  'wf.agincourt': { hook: '“We few, we happy few, we band of brothers”: Shakespeare’s Henry V before Agincourt.', example: 'Shakespeare’s play Henry V is still performed, with the famous St Crispin’s Day speech.' },
  'wf.joan': { hook: 'Joan of Arc, the **Maid of Orléans**: she helped end the siege of Orléans at about 17.', example: 'Joan was made a saint in 1920; statues of her stand all over France.' },
  'wf.calais': { hook: 'Calais was lost in 1558. Mary I is said to have claimed “Calais” would be found written on her heart.', example: 'Ferries from Dover still sail to Calais, the closest French port to England.' },
  'wf.roses': { hook: '**Red** rose = House of **L**ancaster, **white** rose = House of **Y**ork: Lancashire and Yorkshire still use them.', example: 'Look for the white rose on Yorkshire signs and the red rose on Lancashire’s.' },
  'wf.princes': { hook: 'Richard III, uncle of the Princes in the Tower: a mystery that has stuck to his name for 500 years.' },
  'wf.bosworth': { hook: 'Henry Tudor beat Richard III at Bosworth in 1485 and was crowned Henry VII, the first Tudor king.', example: 'Richard III was reburied in Leicester Cathedral in 2015; Bosworth battlefield has a visitor centre.' },
  'wf.tudor-rose': { hook: 'Red + white = the Tudor rose: Henry (Lancaster) married Elizabeth (York) and joined the two roses.', example: 'The Tudor rose is still a royal badge: you can spot it carved all over Hampton Court Palace.' },

  // Tudors
  'td.henry8': { hook: '“Divorced, beheaded, died; divorced, beheaded, survived”: six fates, six wives.', example: 'Henry’s warship the Mary Rose is in Portsmouth, and his suits of armour are in the Tower of London.' },
  'td.wives': { hook: 'Three Catherines, two Annes, one Jane: **Cath, Anne, Jane, Anne, Cath, Cath**.', example: 'Hever Castle in Kent, Anne Boleyn’s childhood home, can be visited today.' },
  'td.break': { hook: 'No son → Henry wants an annulment → the Pope says no → Henry makes himself head of his own Church.', example: 'The monarch is still Supreme Governor of the Church of England today.' },
  'td.supremacy': { hook: '**Supreme** = the very top. **1534** came just after Henry married Anne Boleyn in 1533.' },
  'td.dissolution': { hook: '**Dissolve** = melt away: like sugar in tea, the monasteries vanished.', example: 'Many streets named Abbey Road or Priory Lane mark where a monastery once stood.' },
  'td.edward': { hook: '“**Ned the lad**”: the boy-king Edward VI in the old monarchs rhyme.', example: 'Many old grammar schools are called “King Edward VI School” because they were founded or refounded in his reign.' },
  'td.mary': { hook: 'Catholic **Mary**, Protestant **Elizabeth**: half-sisters on opposite sides.', example: 'The Martyrs’ Memorial in Oxford remembers three Protestant bishops who died under Mary I.' },
  'td.elizabeth': { hook: 'Elizabeth **1558–1603**: when she died, James VI of Scotland became king of England too.', example: 'The famous “Armada Portrait” of Elizabeth I hangs in the Queen’s House at Greenwich.' },
  'td.armada': { hook: 'Legend says Drake finished his game of bowls on Plymouth Hoe before sailing out to meet the Armada.', example: 'A statue of Francis Drake stands on Plymouth Hoe today.' },
  'td.drake': { hook: 'Drake’s ship, the **Golden Hind**, was the first English ship to sail around the world.', example: 'A full-size replica of the Golden Hind is moored by the Thames in London.' },
  'td.golden': { hook: 'Always ask “golden for **whom**?”: courtiers and poets, yes; the poor and Catholics, less so.', example: 'Shakespeare’s Globe, rebuilt on London’s South Bank, shows the theatre of Elizabeth’s age.' },
  'td.order': { hook: '“Harrys twain and Ned the lad, Mary, Bessie”: the old monarchs rhyme gives the Tudors in order.' },
};

for (const id of Object.keys(memory)) if (!items.some((it) => it.id === `history.${id}`)) throw new Error(`history memory hook for unknown item ${id}`);
const withMemory = (it) => ({ ...it, ...memory[it.id.slice('history.'.length)] });

export default [{ subject: 'history', deck: 'year7', topics: topics.map((t) => ({ ...t, hook: topicHooks[t.id] })), items: items.map(withMemory) }];

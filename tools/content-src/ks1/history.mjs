// Year 2 British history with a focus on soldiers, knights and the two World Wars, told
// factually and gently for a six-year-old. Also: famous people, firsts, and a timeline.

import { PERIODS_2, EVENTS_2 } from './history2.mjs';

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, labels = null) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'order', prompt, items, labels, explain });
const C = { formats: ['choice'] };

const topics = [
  { id: 'history.past', title: 'Long ago and now', kind: 'facts', prereqs: [], batch: 5, intro: 'History is the story of what happened before we were born. Things were very different long ago: no electricity, no cars, no phones!', teach: 'Explain three ways life was different 100 years ago.', talk: 'Ask a grandparent what toys they played with, and tell {him} about yours.' },
  { id: 'history.romans', title: 'Roman soldiers in Britain', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'About 2,000 years ago, the Roman army marched into Britain. Roman soldiers had shields, helmets and clever battle tricks. They built roads, towns and a giant wall.', teach: 'Explain how the Roman “tortoise” formation worked.', talk: 'Ask {him} why Roman roads are so straight.' },
  { id: 'history.vikings', title: 'Viking raiders', kind: 'facts', prereqs: ['history.romans'], batch: 5, intro: 'Vikings sailed from Norway, Denmark and Sweden in fast longships. They raided, then many settled down as farmers and traders.', teach: 'Explain what a longship was like.', talk: 'Ask {him} which king fought the Vikings (Alfred the Great).' },
  { id: 'history.1066', title: '1066: the Battle of Hastings', kind: 'facts', prereqs: ['history.vikings'], batch: 5, intro: 'In 1066 three men wanted to be King of England. It ended with a famous battle near Hastings, and a new king: William the Conqueror.', teach: 'Explain who won the Battle of Hastings.', talk: 'Look at pictures of the Bayeux Tapestry together. What can {she} spot?' },
  { id: 'history.castles', title: 'Castles and knights', kind: 'facts', prereqs: ['history.1066'], batch: 5, intro: 'After 1066, castles were built all over England. Knights in armour protected them. A castle had clever ways to keep enemies out.', teach: 'Explain three ways a castle kept enemies out.', talk: 'Visit a castle, or design one together on paper with a moat and drawbridge.' },
  { id: 'history.fire', title: 'The Great Fire of London', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'In 1666 a fire started in a bakery in London. It spread for four days because the houses were made of wood and built close together.', teach: 'Explain why the fire spread so quickly.', talk: 'Ask {him} what Samuel Pepys buried in his garden.' },
  { id: 'history.armada', title: 'Queen Elizabeth I and the Armada', kind: 'facts', prereqs: ['history.castles'], batch: 5, intro: 'In 1588 a huge Spanish fleet called the Armada sailed to attack England. Queen Elizabeth I’s ships, a clever trick with fire, and stormy weather saved England.', teach: 'Explain how fireships helped beat the Armada.', talk: 'Ask {him} how beacons sent a warning across England.' },
  { id: 'history.nurses', title: 'Brave nurses: Florence Nightingale and Mary Seacole', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'About 170 years ago, two brave women cared for soldiers in the Crimean War. They changed nursing for ever.', teach: 'Explain why Florence Nightingale was called “The Lady with the Lamp”.', talk: 'Ask {him} why keeping hospitals clean saves lives.' },
  { id: 'history.ww1', title: 'The First World War and Remembrance', kind: 'facts', prereqs: ['history.nurses'], batch: 5, intro: 'From 1914 to 1918, many countries fought the First World War. Every year on 11 November we wear poppies and stay silent for two minutes to remember the soldiers.', teach: 'Explain why we wear poppies.', talk: 'On Remembrance Sunday, talk with {him} about why people are quiet for two minutes.' },
  { id: 'history.ww2', title: 'The Second World War at home', kind: 'facts', prereqs: ['history.ww1'], batch: 5, intro: 'From 1939 to 1945, Britain fought in the Second World War. Children were evacuated to the countryside, families had ration books, and Spitfires flew to protect the skies.', teach: 'Explain what an evacuee was.', talk: 'Ask an older relative whether their family remembered rationing.' },
  { id: 'history.firsts', title: 'Great firsts: flight and the Moon', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'People have always dreamed of flying. In just 66 years we went from the first aeroplane to walking on the Moon!', teach: 'Explain what the Wright brothers did.', talk: 'Ask {him} who was first to walk on the Moon.' },
  // stretch
  { id: 'history.ww2-heroes', title: 'Wartime heroes: codebreakers, D-Day and brave animals', kind: 'facts', tier: 'stretch', prereqs: ['history.ww2'], batch: 5, intro: 'Some Second World War heroes used their brains, some their boats, and some were even animals! Here are their amazing stories.', teach: 'Explain how the little ships helped at Dunkirk.', talk: 'Ask {him} what a codebreaker does.' },
  { id: 'history.monarchs', title: 'Kings and queens', kind: 'facts', tier: 'stretch', prereqs: ['history.armada'], batch: 5, intro: 'Britain has had kings and queens for more than a thousand years. Some were brave, some were clever, and one reigned for 70 years!', teach: 'Explain what a monarch is.', talk: 'Ask {him} who is king now, and who was queen before.' },
];

const items = [
  // --- long ago
  fact('pa.past', 'past', 'Things that have already happened are in the…', 'past', ['future', 'present', 'tomorrow'], 'Past = already happened. Present = now. Future = still to come.'),
  fact('pa.future', 'past', 'Things that have not happened yet are in the…', 'future', ['past', 'present', 'history'], 'Your next birthday is in the future.'),
  mcq('pa.light', 'past', 'Long ago, before electricity, how did people light their homes at night?', [['with candles and oil lamps', true], ['with small electric light bulbs', false, 'Light bulbs need electricity.'], ['with torches from their phones', false, 'There were no phones long ago!']], 'Candles, oil lamps and later gas lamps lit homes before electricity.'),
  mcq('pa.toys', 'past', 'Which toy would a child 100 years ago most likely have played with?', [['a wooden spinning top', true], ['a games console', false, 'Games consoles are very recent.'], ['a remote-control car', false, 'These need batteries and electronics, invented much later.']], 'Old toys were often made of wood, tin or cloth: spinning tops, skipping ropes, marbles, dolls.'),
  mcq('pa.wash', 'past', 'How did people wash clothes before washing machines?', [['by hand, in a tub', true], ['they never washed their clothes', false, 'They did, but it took a whole day!'], ['in a big dishwasher', false, 'Dishwashers are modern too.']], 'Washing day was hard work: scrubbing, rinsing and squeezing clothes through a mangle.'),
  order('pa.order', 'past', 'Put these in order, longest ago first.', ['Romans in Britain', 'Battle of Hastings', 'Great Fire of London', 'First World War', 'First people on the Moon'], 'Romans (about 2,000 years ago), 1066, 1666, 1914, 1969.'),
  fact('pa.century', 'past', 'How many years are in a century?', '100', ['10', '1000', '50'], 'A century is 100 years. A decade is 10.'),

  // --- Romans
  fact('ro.when', 'romans', 'About how long ago did the Romans invade Britain?', 'about 2,000 years ago', ['about 20 years ago', 'about 200 years ago', 'about 20,000 years ago'], 'The Romans invaded in AD 43, nearly 2,000 years ago.', C),
  fact('ro.from', 'romans', 'Which city did the Romans come from?', 'Rome', ['London', 'Paris', 'Athens'], 'The Roman Empire was ruled from Rome, in Italy.', { accept: ['rome'] }),
  fact('ro.soldier', 'romans', 'What was a Roman foot soldier called?', 'a legionary', ['a knight', 'a Viking', 'a Tommy'], 'Legionaries were tough, trained soldiers who marched about 30 km a day.', C),
  mcq('ro.tortoise', 'romans', 'Roman soldiers made a “tortoise” (testudo) formation. What was it?', [['They made a shell of shields', true], ['They walked very, very slowly', false, 'It was named after the tortoise’s shell, not its speed!'], ['They rode on giant tortoises', false, 'That would be fun, but no!']], 'Locked shields made a shell that arrows and stones bounced off.'),
  fact('ro.wall', 'romans', 'Which Roman emperor built a giant wall across the north of England?', 'Hadrian', ['Julius Caesar', 'Boudica', 'William'], 'Hadrian’s Wall is about 117 km long. You can still walk along it today.', { accept: ['hadrian', 'emperor hadrian'] }),
  fact('ro.boudica', 'romans', 'Which British warrior queen led a rebellion against the Romans?', 'Boudica', ['Elizabeth', 'Victoria', 'Florence'], 'Boudica was queen of the Iceni tribe. Her army attacked Roman towns, including London, before the Romans defeated her.', { accept: ['boudicca', 'boadicea'] }),
  mcq('ro.roads', 'romans', 'Why were Roman roads so straight?', [['So soldiers could march quickly', true], ['Romans couldn’t turn corners', false, 'They could! Straight roads were just the fastest route.'], ['To make the roads look prettier', false, 'Speed was the reason.']], 'Straight, well-built roads let the army move fast. Some modern roads follow them.'),
  fact('ro.bath', 'romans', 'Which English city is named after its Roman baths?', 'Bath', ['London', 'York', 'Hastings'], 'The Romans built baths around the hot springs there. You can still visit them.', { accept: ['bath'] }),

  // --- Vikings
  fact('vk.ship', 'vikings', 'What were the Vikings’ fast wooden ships called?', 'longships', ['spaceships', 'galleons', 'steamships'], 'Longships had sails and oars and could sail up rivers.', { accept: ['longship', 'long ships'] }),
  fact('vk.from', 'vikings', 'Where did the Vikings come from?', 'Norway, Denmark and Sweden', ['Italy, Greece and Spain', 'America and Canada', 'Australia and New Zealand'], 'Vikings came from Scandinavia, across the North Sea.', C),
  fact('vk.alfred', 'vikings', 'Which English king fought the Vikings and is called “the Great”?', 'Alfred', ['William', 'Harold', 'Henry'], 'Alfred the Great was king of Wessex. A story says he once burned some cakes while hiding from the Vikings!', { accept: ['alfred the great', 'king alfred'] }),
  mcq('vk.raid', 'vikings', 'Did all Vikings just raid and fight?', [['No: many were farmers and traders', true], ['Yes, they only ever fought', false, 'Many Vikings settled down and farmed. York was a big Viking town called Jorvik.'], ['No, they only went fishing', false, 'They did lots of things.']], 'Vikings were raiders, but also traders, farmers and explorers.'),
  fact('vk.horns', 'vikings', 'Did Vikings wear helmets with horns?', 'no, that is a myth', ['yes, always', 'only on Sundays', 'only the kings'], 'Real Viking helmets were plain and rounded. The horns came from costumes in the 1800s.', C),

  // --- 1066
  fact('h66.year', '1066', 'In which year was the Battle of Hastings?', '1066', ['1666', '1966', '1006'], '1066: one of the most famous dates in English history.'),
  fact('h66.winner', '1066', 'Who won the Battle of Hastings?', 'William of Normandy', ['King Harold', 'Alfred the Great', 'Hadrian'], 'William became known as William the Conqueror.', { accept: ['william', 'william the conqueror'] }),
  fact('h66.harold', '1066', 'Which English king was killed at the Battle of Hastings?', 'Harold', ['William', 'Alfred', 'Henry'], 'King Harold died in the battle. The Bayeux Tapestry shows a soldier with an arrow in his eye, which may be Harold.', { accept: ['king harold', 'harold godwinson'] }),
  fact('h66.tapestry', '1066', 'What is the Bayeux Tapestry?', 'a long embroidery about 1066', ['a castle in France', 'a sword used at Hastings', 'a famous Viking ship'], 'It is about 70 metres long, like a giant comic strip made with wool.', C),
  fact('h66.crowned', '1066', 'William was crowned king on a special day in 1066. Which day?', 'Christmas Day', ['his birthday', 'Bonfire Night', 'New Year’s Day'], 'He was crowned in Westminster Abbey on Christmas Day 1066.', C),
  fact('h66.horses', '1066', 'William’s army had soldiers on horseback. What were they called?', 'knights', ['legionaries', 'Tommies', 'pilots'], 'Norman knights charged on horses. Harold’s army fought on foot behind a wall of shields.', C),

  // --- castles
  fact('ca.moat', 'castles', 'What is the ditch of water around a castle called?', 'a moat', ['a drawbridge', 'a tower', 'a keep'], 'A moat made it hard for attackers to reach the walls.', { accept: ['moat'] }),
  fact('ca.drawbridge', 'castles', 'What is the bridge that could be lifted up to keep enemies out?', 'a drawbridge', ['a moat', 'a portcullis', 'a dungeon'], 'Pulled up by chains, the drawbridge became an extra wall.', { accept: ['drawbridge'] }),
  fact('ca.portcullis', 'castles', 'What is the heavy gate of wood and iron that slides down?', 'a portcullis', ['a drawbridge', 'a moat', 'a keep'], 'The portcullis dropped down to block the entrance.', { accept: ['portcullis'] }),
  fact('ca.keep', 'castles', 'What is the strongest tower in the middle of a castle called?', 'the keep', ['the moat', 'the bailey', 'the dungeon'], 'The keep was the safest place, where the lord lived.', { accept: ['keep'] }),
  mcq('ca.motte', 'castles', 'The first Norman castles were “motte and bailey” castles. What were they made of?', [['wood, on a mound of earth', true], ['glass, on a hill', false, 'Glass would not keep anyone out!'], ['blocks of ice, on a frozen lake', false, 'They would melt!']], 'They were quick to build from wood and earth. Later, stronger castles were made of stone.'),
  fact('ca.armour', 'castles', 'Early knights wore armour made of tiny metal rings joined together. What was it called?', 'chainmail', ['plate armour', 'leather', 'cardboard'], 'Chainmail was flexible. Later knights wore solid plate armour.', { accept: ['chain mail'] }),
  fact('ca.squire', 'castles', 'A boy training to become a knight was called a…', 'squire', ['page of a book', 'lord', 'peasant'], 'Boys started as pages, then became squires, then knights.', C),
  fact('ca.arms', 'castles', 'Knights painted a special design on their shield so people knew who they were. What was it called?', 'a coat of arms', ['a flag pole', 'a crown', 'a moat'], 'In battle, helmets hid faces, so a coat of arms showed who was who.', C),

  // --- Great Fire
  fact('gf.year', 'fire', 'In which year was the Great Fire of London?', '1666', ['1066', '1966', '1606'], '1666, six hundred years after 1066.'),
  fact('gf.where', 'fire', 'Where did the Great Fire start?', 'in a bakery on Pudding Lane', ['in a castle by the river', 'in a school on Bread Street', 'on a ship by London Bridge'], 'It started in Thomas Farriner’s bakery on Pudding Lane.', C),
  mcq('gf.why', 'fire', 'Why did the fire spread so quickly?', [['The wooden houses were close together', true], ['The fire brigade was on holiday', false, 'There was no proper fire brigade in 1666.'], ['It was raining hard all week', false, 'Rain would have helped! It had been a dry summer.']], 'Wooden houses, a dry summer and a strong wind helped the fire spread.'),
  fact('gf.days', 'fire', 'For about how many days did the Great Fire burn?', '4', ['1', '14', '40'], 'It burned from 2 to 6 September 1666.'),
  fact('gf.pepys', 'fire', 'Samuel Pepys wrote about the fire in his diary. What did he bury in his garden to keep it safe?', 'his Parmesan cheese', ['his little dog', 'his secret diary', 'his best wig'], 'He buried his cheese and his wine! His diary tells us a lot about the fire.', C),
  mcq('gf.stop', 'fire', 'How did people finally stop the fire?', [['They pulled down houses to make gaps', true], ['They used fire engines with long hoses', false, 'There were no hoses like ours. They had leather buckets and hand squirts.'], ['They waited for the snow to fall', false, 'It was September.']], 'Gaps called firebreaks stopped the flames, and the wind dropped.'),
  fact('gf.stpauls', 'fire', 'Which famous cathedral burned down and was rebuilt by Christopher Wren?', 'St Paul’s Cathedral', ['Westminster Abbey', 'Canterbury Cathedral', 'York Minster'], 'Wren’s new St Paul’s has a giant dome.', C),

  // --- Armada
  fact('am.queen', 'armada', 'Who was Queen of England when the Spanish Armada came?', 'Elizabeth I', ['Victoria', 'Elizabeth II', 'Boudica'], 'Queen Elizabeth I reigned for 44 years.', { accept: ['elizabeth', 'elizabeth the first', 'queen elizabeth'] }),
  fact('am.year', 'armada', 'In which year did the Armada sail?', '1588', ['1066', '1666', '1914'], '1588.'),
  fact('am.what', 'armada', 'What was the Armada?', 'a huge fleet of Spanish warships', ['a castle on the coast', 'a long Roman road', 'a type of Tudor armour'], 'About 130 ships sailed from Spain.', C),
  mcq('am.beacons', 'armada', 'How did people warn the country that the Armada was coming?', [['They lit beacons on hilltops', true], ['They sent each other text messages', false, 'No phones in 1588!'], ['They rang one bell in London', false, 'Beacons could be seen for miles.']], 'Each beacon was seen from the next hill, so the warning raced across England.'),
  fact('am.drake', 'armada', 'Which famous sailor helped to beat the Armada?', 'Francis Drake', ['Neil Armstrong', 'Samuel Pepys', 'Alfred'], 'A story says Drake finished his game of bowls before setting sail!', { accept: ['drake', 'sir francis drake'] }),
  mcq('am.fireships', 'armada', 'What were fireships?', [['Ships set on fire and sent at the enemy', true], ['Ships that put out fires at sea', false, 'They did the opposite!'], ['Ships made out of magic fire', false, 'They were wooden ships set alight.']], 'The Spanish ships scattered to escape, and then storms wrecked many of them.'),

  // --- nurses
  fact('nu.lamp', 'nurses', 'Who was known as “The Lady with the Lamp”?', 'Florence Nightingale', ['Mary Seacole', 'Queen Victoria', 'Grace Darling'], 'She checked on wounded soldiers at night, carrying a lamp.', { accept: ['nightingale', 'florence'] }),
  fact('nu.war', 'nurses', 'In which war did Florence Nightingale and Mary Seacole care for soldiers?', 'the Crimean War', ['the First World War', 'the Battle of Hastings', 'the Second World War'], 'The Crimean War was in the 1850s.', C),
  mcq('nu.clean', 'nurses', 'How did Florence Nightingale save lives?', [['She made the hospital clean', true], ['She invented lots of new medicines', false, 'Her great idea was cleanliness.'], ['She fought in the battles', false, 'She was a nurse, not a soldier.']], 'Dirty hospitals spread germs. Making them clean saved many lives.'),
  fact('nu.seacole', 'nurses', 'Mary Seacole travelled from Jamaica and set up a place to care for soldiers near the battlefield. What did she call it?', 'the British Hotel', ['the Lamp House', 'St Paul’s', 'the Tower'], 'She gave soldiers food, comfort and medicine, sometimes right on the battlefield.', C),
  fact('nu.school', 'nurses', 'What did Florence Nightingale set up in London to train nurses?', 'a nursing school', ['a big castle', 'a city zoo', 'a bakery'], 'Her nursing school opened in 1860 at St Thomas’ Hospital.', C),

  // --- First World War
  fact('w1.years', 'ww1', 'When was the First World War?', '1914 to 1918', ['1939 to 1945', '1066 to 1070', '1666 to 1670'], 'It lasted just over four years.', C),
  fact('w1.end', 'ww1', 'The fighting stopped at 11 o’clock on which day?', '11 November 1918', ['25 December 1918', '1 January 1918', '5 November 1918'], 'The eleventh hour of the eleventh day of the eleventh month. This is called the Armistice.', C),
  mcq('w1.poppy', 'ww1', 'Why do we wear red poppies in November?', [['To remember soldiers who died', true], ['Because poppies smell so nice', false, 'Poppies are a symbol of remembering.'], ['To celebrate Bonfire Night', false, 'That is 5 November. Poppies are for Remembrance.']], 'After the war, red poppies grew on the churned-up fields in Flanders, where many soldiers had fought.'),
  fact('w1.silence', 'ww1', 'On Remembrance Day, for how long do people stay silent?', 'two minutes', ['two hours', 'two seconds', 'two days'], 'At 11 o’clock on 11 November, many people stop for two minutes’ silence.', C),
  fact('w1.trench', 'ww1', 'Soldiers on the Western Front lived and fought in long ditches dug in the ground. What were they called?', 'trenches', ['moats', 'tunnels for trains', 'bunk beds'], 'Trenches were muddy and cold. Soldiers took turns resting behind the front line.', { accept: ['trench'] }),
  mcq('w1.truce', 'ww1', 'What happened in some places at Christmas 1914?', [['Soldiers stopped fighting for a while', true], ['The war ended for good', false, 'It went on until 1918.'], ['Everyone went home for Christmas dinner', false, 'They stayed at the front, but some had a short truce.']], 'This is called the Christmas Truce: a moment of friendship between enemies.'),
  fact('w1.tank', 'ww1', 'Which new machine was first used in battle in 1916?', 'the tank', ['the aeroplane', 'the racing car', 'the rocket'], 'Tanks could roll over trenches and barbed wire. The first ones were slow and very hot inside.', C),
  fact('w1.horses', 'ww1', 'Which animals carried soldiers and pulled heavy guns in the First World War?', 'horses', ['elephants', 'camels only', 'dogs only'], 'Millions of horses worked in the war. Dogs and pigeons carried messages too.', C),

  // --- Second World War
  fact('w2.years', 'ww2', 'When was the Second World War?', '1939 to 1945', ['1914 to 1918', '1666 to 1670', '1969 to 1975'], 'It lasted six years.', C),
  fact('w2.churchill', 'ww2', 'Who was the British Prime Minister for most of the Second World War?', 'Winston Churchill', ['Queen Victoria', 'Neil Armstrong', 'Henry VIII'], 'Churchill gave famous speeches to keep people brave.', { accept: ['churchill', 'winston'] }),
  mcq('w2.evacuee', 'ww2', 'What was an evacuee?', [['A child sent to the countryside', true], ['A soldier who flew a plane', false, 'Evacuees were mostly children.'], ['A type of wartime aeroplane', false, 'Evacuees were people.']], 'Children travelled by train with a label, a gas mask and a small suitcase, to live with families in safer places.'),
  fact('w2.blitz', 'ww2', 'What was the Blitz?', 'when German planes bombed cities', ['a type of wartime sweet', 'a big football match', 'a song soldiers sang'], 'The Blitz was in 1940 and 1941. People sheltered when the air-raid siren sounded.', C),
  fact('w2.shelter', 'ww2', 'What were the small metal shelters people built in their gardens called?', 'Anderson shelters', ['muddy trenches', 'tiny castles', 'Viking longships'], 'They were half buried in the ground and covered with earth to protect families.', { accept: ['anderson shelter', 'anderson'] }),
  mcq('w2.ration', 'ww2', 'Why did families have ration books?', [['So everyone got a fair share of food', true], ['To collect stickers and badges', false, 'They were for sharing food fairly.'], ['To borrow books from the library', false, 'Ration books were for food.']], 'Ships bringing food were attacked, so food like sugar, butter and meat was rationed.'),
  fact('w2.victory', 'ww2', 'People were asked to grow their own vegetables. What was the slogan?', 'Dig for Victory', ['Eat More Sweets', 'Keep Calm and Race On', 'Grow a Castle'], 'Parks and gardens were turned into vegetable patches.', C),
  fact('w2.spitfire', 'ww2', 'Which famous British fighter plane flew in the Battle of Britain?', 'the Spitfire', ['the Concorde', 'the longship', 'the Rocket'], 'Spitfires and Hurricanes of the RAF defended Britain’s skies in 1940.', { accept: ['spitfire'] }),
  fact('w2.blackout', 'ww2', 'Why did people cover their windows at night during the “blackout”?', 'so enemy planes could not see', ['to help everyone sleep better', 'to save money on paint', 'to keep the houses warm'], 'With no lights showing, it was harder for bombers to find their targets.', C),
  fact('w2.ve', 'ww2', 'VE Day was when the war in Europe ended. How did people celebrate?', 'with street parties', ['by going to school', 'by building castles', 'by rationing more'], 'VE Day was 8 May 1945. People danced, sang and shared food in the streets.', C),

  // --- firsts
  fact('fi.wright', 'firsts', 'Which two brothers made the first powered aeroplane flight in 1903?', 'the Wright brothers', ['the Grimm brothers', 'the Montgolfier brothers', 'the Romans'], 'Orville Wright flew for 12 seconds. The plane was called the Flyer.', C),
  fact('fi.amy', 'firsts', 'Which brave British pilot was the first woman to fly alone from England to Australia, in 1930?', 'Amy Johnson', ['Florence Nightingale', 'Mary Anning', 'Grace Darling'], 'She flew in a small plane called Jason. The trip took 19 days.', { accept: ['amy'] }),
  fact('fi.moon', 'firsts', 'Who was the first person to walk on the Moon?', 'Neil Armstrong', ['Buzz Aldrin', 'Amy Johnson', 'Orville Wright'], 'On 20 July 1969. Buzz Aldrin stepped out next.', { accept: ['armstrong'] }),
  fact('fi.rocket', 'firsts', 'What was the name of a famous early steam train, built by George and Robert Stephenson in 1829?', 'Rocket', ['Spitfire', 'Flyer', 'Thunderbolt'], 'Stephenson’s Rocket won a race to find the best locomotive, at nearly 30 miles per hour!', { accept: ['the rocket', "stephenson's rocket", 'stephenson’s rocket'] }),
  order('fi.order', 'firsts', 'Put these firsts in order, earliest first.', ['Stephenson’s Rocket (steam train)', 'Wright brothers’ first flight', 'Amy Johnson flies to Australia', 'First person on the Moon'], '1829, 1903, 1930, 1969.'),

  // --- WW2 heroes (stretch)
  fact('wh.dunkirk', 'ww2-heroes', 'In 1940, hundreds of “little ships” (fishing boats and pleasure boats) sailed across the Channel to rescue soldiers. Where from?', 'Dunkirk', ['Hastings', 'London', 'Mars'], 'More than 300,000 soldiers were brought home from the beaches of Dunkirk in France.', { accept: ['dunkirk beach', 'france'] }),
  fact('wh.bletchley', 'ww2-heroes', 'Where did codebreakers work in secret to crack enemy messages?', 'Bletchley Park', ['the Tower of London', 'Hadrian’s Wall', 'Pudding Lane'], 'Clever people there, including Alan Turing, built machines to help crack codes.', C),
  fact('wh.turing', 'ww2-heroes', 'Which brilliant mathematician helped crack enemy codes and is now called a father of the computer?', 'Alan Turing', ['Winston Churchill', 'Samuel Pepys', 'Francis Drake'], 'Turing is on the £50 note.', { accept: ['turing'] }),
  fact('wh.dday', 'ww2-heroes', 'On D-Day, 6 June 1944, soldiers landed on the beaches of which country?', 'France', ['Spain', 'Italy', 'Scotland'], 'Soldiers from Britain, America, Canada and other countries landed in Normandy to begin freeing Europe.', { accept: ['normandy'] }),
  fact('wh.pigeons', 'ww2-heroes', 'Which animals carried secret messages and some even won medals for bravery?', 'pigeons', ['penguins', 'cats', 'goldfish'], 'Pigeons and dogs received the Dickin Medal, a medal for brave animals.', C),
  fact('wh.queen', 'ww2-heroes', 'Which princess, who later became queen, trained as a mechanic and army lorry driver in the war?', 'Princess Elizabeth (later Queen Elizabeth II)', ['Princess Victoria (later Queen Victoria)', 'Princess Anne (later the Princess Royal)', 'Princess Margaret (her sister)'], 'She joined the Auxiliary Territorial Service in 1945 and learned to fix engines.', C),

  // --- kings and queens (stretch)
  fact('mo.monarch', 'monarchs', 'What is a king or queen called?', 'a monarch', ['a knight', 'a prime minister', 'a mayor'], 'Monarch means one ruler.', { accept: ['monarch'] }),
  fact('mo.e2', 'monarchs', 'Which queen reigned for 70 years, longer than any other British monarch?', 'Elizabeth II', ['Victoria', 'Elizabeth I', 'Boudica'], 'Queen Elizabeth II reigned from 1952 to 2022.', { accept: ['queen elizabeth ii', 'elizabeth the second', 'queen elizabeth'] }),
  fact('mo.now', 'monarchs', 'Who became king in 2022?', 'Charles III', ['William I', 'Henry VIII', 'Alfred'], 'King Charles III is Queen Elizabeth II’s eldest son.', { accept: ['king charles', 'charles', 'charles the third'] }),
  fact('mo.victoria', 'monarchs', 'Which queen reigned for 63 years in the 1800s and gave her name to a whole period of history?', 'Victoria', ['Elizabeth I', 'Mary', 'Anne'], 'The Victorian age had steam trains, factories and big changes.', { accept: ['queen victoria'] }),
  fact('mo.henry', 'monarchs', 'Which Tudor king had six wives?', 'Henry VIII', ['William I', 'Charles III', 'Alfred'], '“Divorced, beheaded, died; divorced, beheaded, survived.”', { accept: ['henry the eighth', 'henry 8', 'henry viii'] }),
  fact('mo.jewels', 'monarchs', 'Where are the Crown Jewels kept?', 'the Tower of London', ['Buckingham Palace kitchen', 'Hadrian’s Wall', 'a bank in Paris'], 'The Tower of London is a castle built by William the Conqueror.', C),
];

const PERIODS = [['Romans', 43, 410], ['Anglo-Saxons and Vikings', 410, 1066], ['Knights and castles', 1066, 1485], ['Tudors', 1485, 1603], ['Stuarts', 1603, 1714], ['Georgians', 1714, 1837], ['Victorians', 1837, 1901], ['20th century', 1901, 2000]];
const EVENTS = [
  [43, 'Romans invade Britain', ['history.ro.when', 'history.ro.from']],
  [122, 'Hadrian’s Wall begun', ['history.ro.wall']],
  [793, 'Vikings raid Lindisfarne', ['history.vk.ship']],
  [871, 'Alfred becomes king', ['history.vk.alfred']],
  [1066, 'Battle of Hastings', ['history.h66.year', 'history.h66.winner']],
  [1588, 'The Spanish Armada', ['history.am.year', 'history.am.what']],
  [1666, 'Great Fire of London', ['history.gf.year', 'history.gf.where']],
  [1829, 'Stephenson’s Rocket', ['history.fi.rocket']],
  [1854, 'Florence Nightingale in the Crimea', ['history.nu.lamp']],
  [1903, 'First aeroplane flight', ['history.fi.wright']],
  [1914, 'First World War begins', ['history.w1.years']],
  [1918, 'Armistice: the war ends', ['history.w1.end']],
  [1930, 'Amy Johnson flies to Australia', ['history.fi.amy']],
  [1939, 'Second World War begins', ['history.w2.years']],
  [1940, 'Battle of Britain', ['history.w2.spitfire']],
  [1945, 'VE Day', ['history.w2.ve']],
  [1969, 'First people on the Moon', ['history.fi.moon']],
];

export default [
  { subject: 'history', deck: 'core', topics, items },
  { subject: 'history', deck: 'timeline', topics: [], items: [], timeline: { periods: [...PERIODS_2, ...PERIODS].sort((a, b) => a[1] - b[1]).map(([name, from, to]) => ({ name, from, to })), events: [...EVENTS, ...EVENTS_2].sort((a, b) => a[0] - b[0]).map(([year, label, ids]) => ({ year, label, items: ids })) } },
];

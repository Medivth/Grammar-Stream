// Year 2 history, part 2: the Stone Age to the Iron Age, Ancient Egypt, cars and speed
// through time, inventors, sea rescue, explorers and the Victorians; the Tudors as a stretch.
// Timeline events are exported and merged into the one timeline in history.mjs.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, labels = null) => ({ id: `history.${id}`, topic: `history.${topic}`, kind: 'order', prompt, items, labels, explain });
const C = { formats: ['choice'] };

const topics = [
  { id: 'history.stoneage', title: 'Stone Age to Iron Age', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Long before the Romans, people in Britain hunted with stone tools, built Stonehenge, and later learned to make bronze and iron.', teach: 'Explain the order of the Stone Age, Bronze Age and Iron Age, and why they have those names.', talk: 'Ask {him} what {she} would have eaten as a Stone Age hunter.' },
  { id: 'history.egypt', title: 'Ancient Egypt', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Ancient Egypt grew up beside the River Nile more than 4,000 years ago. Its kings, called pharaohs, built enormous pyramids.', teach: 'Explain why the River Nile was so important to the Egyptians.', talk: 'Write {her} name in hieroglyphs together (you can find an alphabet online or in a library book).' },
  { id: 'history.cars', title: 'Cars and speed through time', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Before cars, people travelled by horse. The first petrol car was built in 1885. Since then, cars have got faster and faster, and one has even broken the sound barrier!', teach: 'Explain how travel changed from horses to cars.', talk: 'Ask a grandparent what their first car was like.' },
  { id: 'history.inventors', title: 'Great inventors', kind: 'facts', prereqs: ['history.firsts'], batch: 5, intro: 'Inventors are people who come up with new ideas that change the world: telephones, television, the World Wide Web…', teach: 'Explain which invention you think changed the world the most, and why.', talk: 'Ask {him} to invent something to solve a problem at home, and draw it.' },
  { id: 'history.sea', title: 'Brave rescues at sea', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Britain is surrounded by sea. Lifeboat crews, and one very brave young woman, have risked their lives to rescue sailors in storms.', teach: 'Explain why Grace Darling became famous.', talk: 'If you visit the coast, look for the lifeboat station.' },
  { id: 'history.explorers', title: 'Explorers', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Explorers travel to places no one from their country has been before: across oceans, to the frozen South Pole and to the top of the world’s highest mountain.', teach: 'Explain why exploring Antarctica was so dangerous.', talk: 'Ask {him} where in the world {she} would most like to explore.' },
  { id: 'history.victorians', title: 'The Victorians', kind: 'facts', prereqs: ['history.past'], batch: 5, intro: 'Queen Victoria reigned from 1837 to 1901. It was a time of steam trains, factories, big inventions, and very strict schools!', teach: 'Explain how a Victorian school was different from yours.', talk: 'Look for a Victorian building near you: a station, a school or a post box with “VR” on it.' },
  // stretch
  { id: 'history.tudors', title: 'The Tudors', kind: 'facts', tier: 'stretch', prereqs: ['history.castles'], batch: 5, intro: 'The Tudors ruled England from 1485 to 1603. Their kings and queens included Henry VIII and Elizabeth I. It was a time of great ships, explorers and plays.', teach: 'Explain what happened to the Mary Rose.', talk: 'Ask {him} why the Tudor rose is red and white.' },
];

const items = [
  // --- Stone Age to Iron Age
  order('sa.ages', 'stoneage', 'Put these ages in order, earliest first.', ['Stone Age', 'Bronze Age', 'Iron Age'], 'Stone tools came first, then bronze (copper mixed with tin), then iron, which is harder still.'),
  fact('sa.tools', 'stoneage', 'Stone Age people made sharp tools from a hard stone called…', 'flint', ['chalk', 'gold', 'plastic'], 'Flint can be chipped to make a very sharp edge.', C),
  fact('sa.stonehenge', 'stoneage', 'Which famous circle of giant stones was built in Britain about 5,000 years ago?', 'Stonehenge', ['Hadrian’s Wall', 'the Tower of London', 'the pyramids'], 'Stonehenge is in Wiltshire. Some stones came all the way from Wales!', C),
  fact('sa.mammoth', 'stoneage', 'Which huge hairy elephant did early Stone Age people hunt?', 'the woolly mammoth', ['the T. rex', 'the elephant seal', 'the hippo'], 'Woolly mammoths lived in cold places and had long curved tusks. Dinosaurs were long gone by then.', C),
  fact('sa.skara', 'stoneage', 'Skara Brae in Orkney is a Stone Age village. What were its houses built from?', 'stone', ['bricks', 'glass', 'plastic'], 'Even the beds and cupboards were made of stone, so we can still see them today.', C),
  mcq('sa.farm', 'stoneage', 'What big change happened when Stone Age people learned to farm?', [['They could stay in one place instead of following animals', true], ['They stopped eating', false, 'Farming gave them MORE food.'], ['They started driving tractors', false, 'Tractors came thousands of years later!']], 'Growing crops and keeping animals meant people could build villages.'),
  fact('sa.roundhouse', 'stoneage', 'What kind of house did Iron Age families live in?', 'a roundhouse', ['a tower block', 'a castle', 'a pyramid'], 'Roundhouses had walls of woven sticks and mud, a thatched roof and a fire in the middle.', C),
  fact('sa.hillfort', 'stoneage', 'Iron Age people built villages on hilltops surrounded by ditches. What are these called?', 'hill forts', ['castles', 'motte and baileys', 'skyscrapers'], 'Maiden Castle in Dorset is one of the biggest hill forts.', C),
  // --- Ancient Egypt
  fact('eg.river', 'egypt', 'Which river did the ancient Egyptians live beside?', 'the Nile', ['the Thames', 'the Amazon', 'the Severn'], 'Every year the Nile flooded, leaving rich mud for growing crops.', { accept: ['nile', 'river nile'] }),
  fact('eg.pharaoh', 'egypt', 'What were the kings of ancient Egypt called?', 'pharaohs', ['emperors', 'knights', 'presidents'], 'The pharaoh was thought to be part god.', { accept: ['pharaoh', 'pharoahs'] }),
  fact('eg.pyramid', 'egypt', 'What were the great pyramids built for?', 'tombs for pharaohs', ['houses for workers', 'temples for cats', 'lighthouses'], 'The Great Pyramid of Giza was built about 4,500 years ago for the pharaoh Khufu.', C),
  fact('eg.mummy', 'egypt', 'Egyptians preserved dead bodies by drying them and wrapping them in bandages. What do we call these?', 'mummies', ['statues', 'robots', 'scarecrows'], 'They believed the body was needed in the afterlife.', { accept: ['mummy'] }),
  fact('eg.writing', 'egypt', 'What was ancient Egyptian picture writing called?', 'hieroglyphs', ['emojis', 'Roman numerals', 'runes'], 'Hieroglyphs used little pictures for sounds and words.', { accept: ['hieroglyphics'] }),
  fact('eg.tut', 'egypt', 'Which boy pharaoh’s tomb, full of gold treasure, was found by Howard Carter in 1922?', 'Tutankhamun', ['Cleopatra', 'Khufu', 'Ramesses'], 'Tutankhamun became pharaoh when he was about 9 years old.', { accept: ['tutankhamen', 'king tut'] }),
  mcq('eg.rosetta', 'egypt', 'How did experts learn to read hieroglyphs again?', [['The Rosetta Stone had the same message in hieroglyphs and in Greek', true], ['An old Egyptian taught them', false, 'Nobody had read hieroglyphs for over a thousand years.'], ['They guessed', false, 'They used the Rosetta Stone to compare the writing.']], 'Because they could read the Greek, they could work out the hieroglyphs. The stone is in the British Museum.'),
  mcq('eg.when', 'egypt', 'Which came first: the pyramids of Egypt, or the Romans arriving in Britain?', [['The pyramids, more than 2,000 years earlier', true], ['The Romans', false, 'The Great Pyramid was built around 2560 BC; the Romans invaded in AD 43.'], ['They happened at the same time', false, 'Over 2,500 years apart!']], 'The Great Pyramid is about 4,500 years old. Roman Britain began about 2,000 years ago.'),
  // --- cars and speed
  mcq('car.before', 'cars', 'Before cars, how did most people travel long distances on land?', [['By horse, carriage or walking (and later by train)', true], ['By aeroplane', false, 'Aeroplanes came after cars.'], ['By rocket', false, 'Rockets are much more recent!']], 'Horses pulled carriages and carts. Steam trains arrived in the 1800s.'),
  fact('car.benz', 'cars', 'Who built the first petrol car, in 1885?', 'Karl Benz', ['Henry Ford', 'George Stephenson', 'Neil Armstrong'], 'His Motorwagen had three wheels. His wife Bertha drove it on the first long car journey.', { accept: ['benz'] }),
  mcq('car.flag', 'cars', 'In early motoring in Britain, a law said someone had to walk in front of a steam car carrying what?', [['A red flag, to warn people', true], ['A trumpet', false, 'It was a red flag.'], ['A bucket of water', false, 'It was a red flag to warn horses and people.']], 'The “Red Flag Act” kept speeds very slow. It was scrapped in 1896.'),
  fact('car.ford', 'cars', 'Henry Ford made cars cheaper by building them on a moving line in a factory. Which famous car was it?', 'the Model T', ['the Mini', 'the Spitfire', 'the Rocket'], 'Ford’s assembly line made millions of Model Ts, so many more people could own a car.', C),
  fact('car.f1', 'cars', 'The very first Formula One World Championship race was held in 1950 in which country?', 'Britain (at Silverstone)', ['France', 'the USA', 'Australia'], 'Silverstone is a racetrack in Northamptonshire, built on an old wartime airfield.', C),
  fact('car.thrust', 'cars', 'In 1997, a British jet car became the first car to go faster than the speed of sound. What was it called?', 'Thrust SSC', ['Bluebird', 'Model T', 'Rocket'], 'Driven by Andy Green, it reached 763 miles per hour in a desert in the USA.', C),
  fact('car.campbell', 'cars', 'Sir Malcolm Campbell broke speed records in cars (and boats) with which name?', 'Bluebird', ['Red Arrow', 'Thunderbolt', 'Silver Ghost'], 'His son Donald Campbell broke records in Bluebirds too.', { accept: ['blue bird'] }),
  mcq('car.electric', 'cars', 'How are many new cars today different from old ones?', [['Many are electric, so they don’t burn petrol', true], ['They have no wheels', false, 'They still have wheels!'], ['They are pulled by horses', false, 'That was before cars.']], 'Electric cars are quieter and make less pollution where they drive.'),
  // --- inventors
  fact('in.bell', 'inventors', 'Who invented the telephone, in 1876?', 'Alexander Graham Bell', ['John Logie Baird', 'Tim Berners-Lee', 'Isaac Newton'], 'Bell was born in Edinburgh, Scotland.', { accept: ['graham bell', 'bell'] }),
  fact('in.baird', 'inventors', 'Which Scottish inventor showed the first working television in 1926?', 'John Logie Baird', ['Alexander Graham Bell', 'George Stephenson', 'Walt Disney'], 'His first pictures were blurry, but they moved!', { accept: ['logie baird', 'baird'] }),
  fact('in.web', 'inventors', 'Which British scientist invented the World Wide Web in 1989?', 'Tim Berners-Lee', ['Alan Turing', 'Ada Lovelace', 'Isambard Kingdom Brunel'], 'He gave it away for free so everyone could use it.', { accept: ['berners-lee', 'tim berners lee'] }),
  fact('in.brunel', 'inventors', 'Which engineer with a tall top hat built bridges, tunnels, a railway and giant steamships?', 'Isambard Kingdom Brunel', ['Henry VIII', 'Tim Peake', 'Charles Dickens'], 'Brunel designed the Clifton Suspension Bridge in Bristol and built the Great Western Railway.', { accept: ['brunel'] }),
  fact('in.lovelace', 'inventors', 'Who wrote what many call the first computer program, in the 1840s?', 'Ada Lovelace', ['Florence Nightingale', 'Queen Victoria', 'Mary Anning'], 'She wrote instructions for a calculating machine that had not even been built yet.', { accept: ['lovelace'] }),
  fact('in.edison', 'inventors', 'Thomas Edison is famous for making which invention work well enough to use in homes?', 'the light bulb', ['the wheel', 'the telephone', 'the bicycle'], 'Edison tested thousands of materials before he found one that worked.', C),
  mcq('in.why', 'inventors', 'What do all good inventors do?', [['Keep trying, even when their ideas fail at first', true], ['Get it right first time', false, 'Edison failed thousands of times before his bulb worked!'], ['Copy someone else', false, 'Inventors come up with new ideas.']], 'Edison is often quoted as saying: “I have not failed. I’ve just found 10,000 ways that won’t work.”'),
  // --- sea rescue
  fact('se.grace', 'sea', 'In 1838, which young woman rowed out through a storm with her father to rescue shipwrecked sailors?', 'Grace Darling', ['Florence Nightingale', 'Mary Seacole', 'Amy Johnson'], 'Grace lived in a lighthouse on the Farne Islands, off the coast of Northumberland.', { accept: ['darling'] }),
  fact('se.lighthouse', 'sea', 'Where did Grace Darling live?', 'in a lighthouse', ['in a castle', 'on a ship', 'in a palace'], 'Her father was the lighthouse keeper at Longstone.', C),
  fact('se.rnli', 'sea', 'Which charity, started in 1824, runs lifeboats around the UK’s coasts?', 'the RNLI', ['the NHS', 'the RAF', 'the BBC'], 'The Royal National Lifeboat Institution. Most of its crews are volunteers.', { accept: ['rnli', 'royal national lifeboat institution'] }),
  mcq('se.volunteer', 'sea', 'Most RNLI lifeboat crew are volunteers. What does that mean?', [['They choose to help and are not paid', true], ['They are soldiers', false, 'They are ordinary people who give their time.'], ['They only work on Sundays', false, 'They are on call day and night.']], 'When the pager goes, they leave work or home and race to the lifeboat.'),
  mcq('se.brave', 'sea', 'Why was Grace Darling’s rescue so brave?', [['The sea was stormy and dangerous, and the boat was small', true], ['She couldn’t swim', false, 'The danger was the storm.'], ['It was a sunny day', false, 'It was a terrible storm!']], 'She and her father rowed a small boat over a mile through huge waves.'),
  fact('se.coastguard', 'sea', 'In an emergency at the seaside, what number do you call and ask for the Coastguard?', '999', ['123', '101', '111'], 'Call 999 (or 112) and ask for the Coastguard.'),
  // --- explorers
  fact('xp.cook', 'explorers', 'Which British sea captain made famous voyages to the Pacific Ocean and mapped New Zealand in the 1760s and 1770s?', 'Captain James Cook', ['Captain Hook', 'Francis Drake', 'Neil Armstrong'], 'Cook’s ship on his first voyage was called the Endeavour.', { ...C }),
  fact('xp.shackleton', 'explorers', 'Which explorer’s ship, the Endurance, was crushed by ice in Antarctica, yet he got all his crew home safely?', 'Ernest Shackleton', ['Captain Cook', 'Christopher Columbus', 'Edmund Hillary'], 'Shackleton sailed a tiny boat 800 miles across stormy seas to get help.', { accept: ['shackleton'] }),
  fact('xp.everest', 'explorers', 'In 1953, Edmund Hillary and Tenzing Norgay were the first to reach the top of which mountain?', 'Mount Everest', ['Ben Nevis', 'Snowdon', 'Mount Vesuvius'], 'Everest is the highest mountain in the world, in the Himalayas.', { accept: ['everest'] }),
  mcq('xp.danger', 'explorers', 'Why was exploring Antarctica so dangerous?', [['It is freezing cold, windy, and covered in ice', true], ['There are lots of lions', false, 'No lions! Only penguins and seals.'], ['It is too hot', false, 'Antarctica is the coldest place on Earth.']], 'Explorers had to cope with temperatures far below freezing.'),
  fact('xp.columbus', 'explorers', 'In 1492, which explorer sailed west across the Atlantic and reached the Americas?', 'Christopher Columbus', ['Captain Cook', 'Ernest Shackleton', 'Neil Armstrong'], 'He was looking for a sea route to Asia, and landed in the Caribbean instead.', { accept: ['columbus'] }),
  fact('xp.compass', 'explorers', 'What tool did sailors use to find north?', 'a compass', ['a telescope', 'a clock', 'a thermometer'], 'A compass needle is a magnet that points north.', C),
  // --- Victorians
  fact('vi.dates', 'victorians', 'Queen Victoria reigned from 1837 to…', '1901', ['1066', '1945', '2022'], 'She reigned for 63 years.'),
  mcq('vi.school', 'victorians', 'How was a Victorian school different from yours?', [['Children wrote on slates and teachers were very strict', true], ['They had computers', false, 'No computers! They used slates and chalk.'], ['There were no teachers', false, 'There were teachers, and they were very strict.']], 'Children sat in rows, chanted their tables and wrote on slates.'),
  mcq('vi.work', 'victorians', 'What hard job did some poor Victorian children do?', [['Worked in factories, mines or as chimney sweeps', true], ['Flew aeroplanes', false, 'There were no aeroplanes yet.'], ['Worked in space', false, 'Space travel came 100 years later.']], 'Laws were slowly passed to stop young children working and send them to school.'),
  fact('vi.stamp', 'victorians', 'In 1840 Britain made the world’s first postage stamp. What was it called?', 'the Penny Black', ['the Golden Penny', 'the Red Rose', 'the Blue Peter'], 'It had Queen Victoria’s head on it and cost one penny.', C),
  fact('vi.train', 'victorians', 'Which new kind of transport spread across Britain in Victorian times?', 'steam trains', ['jet planes', 'electric scooters', 'spaceships'], 'Railways meant people could travel to the seaside for the first time.', C),
  fact('vi.exhibition', 'victorians', 'In 1851 the Great Exhibition showed off inventions in a huge building made of glass. What was it called?', 'the Crystal Palace', ['the Glass Castle', 'Buckingham Palace', 'the Tower of London'], 'It was like a giant greenhouse in Hyde Park, London.', C),
  // --- Tudors (stretch)
  fact('tu.henry7', 'tudors', 'Who was the first Tudor king, in 1485?', 'Henry VII', ['Henry VIII', 'William I', 'Charles III'], 'Henry VII won the Battle of Bosworth. His son was Henry VIII.', { accept: ['henry the seventh', 'henry 7'] }),
  mcq('tu.rose', 'tudors', 'Why is the Tudor rose red AND white?', [['It joined the red rose of Lancaster and the white rose of York', true], ['Red and white were Henry’s favourite colours', false, 'It joined two families who had been fighting.'], ['It was painted twice', false, 'It shows two families coming together.']], 'Henry VII (Lancaster) married Elizabeth of York, ending the Wars of the Roses.'),
  fact('tu.maryrose', 'tudors', 'Henry VIII’s warship sank in 1545 and was raised from the seabed in 1982. What was it called?', 'the Mary Rose', ['the Golden Hind', 'the Titanic', 'HMS Victory'], 'You can see it in a museum in Portsmouth.', C),
  fact('tu.drake', 'tudors', 'Which Tudor sailor was the first Englishman to sail all the way round the world?', 'Francis Drake', ['Captain Cook', 'Walter Raleigh', 'Henry VIII'], 'Drake sailed in the Golden Hind from 1577 to 1580.', { accept: ['drake', 'sir francis drake'] }),
  fact('tu.shakespeare', 'tudors', 'Which famous playwright wrote plays in Tudor times?', 'William Shakespeare', ['Roald Dahl', 'Charles Dickens', 'Beatrix Potter'], 'His plays were performed at the Globe Theatre in London.', { accept: ['shakespeare'] }),
  fact('tu.elizabeth', 'tudors', 'Who was the last Tudor monarch?', 'Elizabeth I', ['Elizabeth II', 'Victoria', 'Mary I'], 'Elizabeth I never married and had no children, so the Tudor line ended with her in 1603.', { accept: ['elizabeth the first', 'queen elizabeth i'] }),
];

// merged into the one timeline in history.mjs
export const PERIODS_2 = [['Stone, Bronze and Iron Ages', -3500, 43]];
export const EVENTS_2 = [
  [-3000, 'Stonehenge begun', ['history.sa.stonehenge']],
  [-2560, 'Great Pyramid of Egypt', ['history.eg.pyramid']],
  [1485, 'The Tudors begin', ['history.tu.henry7']],
  [1545, 'The Mary Rose sinks', ['history.tu.maryrose']],
  [1824, 'Lifeboat charity founded', ['history.se.rnli']],
  [1838, 'Grace Darling’s rescue', ['history.se.grace']],
  [1837, 'Victoria becomes queen', ['history.vi.dates']],
  [1840, 'The Penny Black stamp', ['history.vi.stamp']],
  [1876, 'The telephone', ['history.in.bell']],
  [1885, 'The first petrol car', ['history.car.benz']],
  [1926, 'The first television', ['history.in.baird']],
  [1950, 'First Formula One race', ['history.car.f1']],
  [1953, 'Top of Mount Everest', ['history.xp.everest']],
  [1989, 'The World Wide Web', ['history.in.web']],
  [1997, 'Thrust SSC breaks the sound barrier', ['history.car.thrust']],
];

export default [{ subject: 'history', deck: 'more', topics, items }];

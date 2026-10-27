// Year 2 science and the world: animals, bodies, life cycles, plants, habitats, materials,
// seasons and space; continents, oceans and the UK on the real maps; and a Year 3 taster
// (forces and magnets, rocks and fossils).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, labels = null) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'order', prompt, items, labels, explain });
const mapfact = (id, topic, map, layer, feature, answer, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mapfact', map, layer, feature, answer, explain, ...extra });
const C = { formats: ['choice'] };

const topics = [
  { id: 'science.animals', title: 'Animal groups', kind: 'facts', prereqs: [], batch: 5, diagnostic: ['science.an.d1'], intro: 'Scientists sort animals into groups: mammals, birds, fish, reptiles and amphibians. Each group has special features.', teach: 'Explain how you know a dolphin is a mammal, not a fish.', talk: 'At the zoo or in a book, ask {him} which group each animal belongs to.' },
  { id: 'science.food', title: 'What animals eat', kind: 'facts', prereqs: ['science.animals'], batch: 5, intro: 'Carnivores eat meat, herbivores eat plants, and omnivores eat both. A food chain shows who eats whom.', teach: 'Explain a food chain that starts with grass.', talk: 'Ask {him} whether {she} is a carnivore, herbivore or omnivore.' },
  { id: 'science.body', title: 'My body and staying healthy', kind: 'facts', prereqs: [], batch: 5, intro: 'Our bodies need food, water, exercise, sleep and clean hands to stay healthy. Our five senses tell us about the world.', teach: 'Explain why we wash our hands.', talk: 'Ask {him} which sense {she} would least like to lose, and why.' },
  { id: 'science.lifecycles', title: 'Growing up: life cycles', kind: 'facts', prereqs: ['science.animals'], batch: 5, intro: 'Animals grow and change. A caterpillar becomes a butterfly; frogspawn becomes a frog; babies become grown-ups.', teach: 'Explain the life cycle of a butterfly.', talk: 'Look at baby photos together and talk about how {she} has changed.' },
  { id: 'science.plants', title: 'Plants', kind: 'facts', prereqs: [], batch: 5, intro: 'Plants need water, light and warmth to grow. They have roots, a stem, leaves and often flowers.', teach: 'Explain what roots do for a plant.', talk: 'Grow a bean in a jar together and watch the roots appear.' },
  { id: 'science.habitats', title: 'Habitats', kind: 'facts', prereqs: ['science.food'], batch: 5, intro: 'A habitat is the home where an animal or plant lives. It gives them food, water and shelter.', teach: 'Explain why a polar bear could not live in a desert.', talk: 'Look under a log or stone together for minibeasts.' },
  { id: 'science.materials', title: 'Materials', kind: 'facts', prereqs: [], batch: 5, intro: 'Everything is made from materials: wood, metal, plastic, glass, rock, fabric. We choose materials because of what they are like.', teach: 'Explain why windows are made of glass, not wood.', talk: 'Ask {him} what {her} raincoat is made of and why.' },
  { id: 'science.seasons', title: 'Seasons and weather', kind: 'facts', prereqs: [], batch: 5, intro: 'The year has four seasons: spring, summer, autumn and winter. Each brings different weather and different length days.', teach: 'Explain how the trees change through the seasons.', talk: 'Ask {him} what season it is and how {she} can tell.' },
  { id: 'science.space', title: 'Space: the Sun, Moon and planets', kind: 'facts', prereqs: [], batch: 5, intro: 'Earth is one of eight planets going round the Sun. The Moon goes round the Earth. Real space is even more amazing than space stories!', teach: 'Explain why we have day and night.', talk: 'Look at the Moon together on a clear night. What shape is it today?' },
  { id: 'science.world', title: 'Continents and oceans', kind: 'facts', prereqs: [], batch: 5, intro: 'The world has seven continents (big areas of land) and five oceans. Let’s find them on the map.', teach: 'Name the seven continents.', talk: 'Find where you live on a globe, then find Antarctica.' },
  { id: 'science.uk', title: 'The United Kingdom', kind: 'facts', prereqs: ['science.world'], batch: 5, intro: 'The UK is made of four countries: England, Scotland, Wales and Northern Ireland. Each has a capital city.', teach: 'Name the four countries of the UK and their capitals.', talk: 'Ask {him} which country of the UK you live in.' },
  { id: 'science.maps', title: 'Maps, directions and places', kind: 'facts', prereqs: ['science.world'], batch: 5, intro: 'North, south, east and west help us find our way. Hot places are near the Equator; cold places are near the North and South Poles.', teach: 'Explain why it is cold at the North Pole.', talk: 'Use a compass app to find north from your front door.' },
  // Year 3 taster
  { id: 'science.forces', title: 'Pushes, pulls and magnets', kind: 'facts', tier: 'stretch', prereqs: ['science.materials'], batch: 5, intro: 'A force is a push or a pull. Racing cars slow down because of friction. Magnets can pull without even touching!', teach: 'Explain why a toy car goes further on a smooth floor than on carpet.', talk: 'Race toy cars down a ramp onto different floors.' },
  { id: 'science.rocks', title: 'Rocks and fossils', kind: 'facts', tier: 'stretch', prereqs: ['science.materials'], batch: 5, intro: 'Rocks are under our feet everywhere. Some hold fossils: the remains of plants and animals from millions of years ago, like dinosaurs!', teach: 'Explain how a fossil forms.', talk: 'Look for fossils on a beach or in a museum.' },
];

const CONTINENTS = [['asia', 'Asia', 'Asia is the biggest continent.'], ['africa', 'Africa', 'Africa has deserts, rainforests and lions.'], ['north-america', 'North America', 'North America includes Canada and the USA.'], ['south-america', 'South America', 'South America has the Amazon rainforest.'], ['antarctica', 'Antarctica', 'Antarctica is the coldest place on Earth, covered in ice. Penguins live there.'], ['europe', 'Europe', 'Europe is where the UK is.'], ['oceania', 'Oceania', 'Oceania includes Australia, where kangaroos live. Some books call it Australia.']];
const OCEANS = [['pacific', 'Pacific Ocean', 'The Pacific is the biggest ocean.'], ['atlantic', 'Atlantic Ocean', 'The Atlantic lies between Europe and America.'], ['indian', 'Indian Ocean', 'The Indian Ocean is near India and Africa.'], ['southern', 'Southern Ocean', 'The Southern Ocean surrounds Antarctica.'], ['arctic', 'Arctic Ocean', 'The Arctic is the smallest ocean, at the top of the world.']];
const UK = [['ENG', 'England', 'England is the biggest country in the UK.'], ['SCT', 'Scotland', 'Scotland is in the north, with mountains and lochs.'], ['WLS', 'Wales', 'Wales is in the west. Its flag has a red dragon.'], ['NIR', 'Northern Ireland', 'Northern Ireland is across the Irish Sea.']];
const CAPITALS = [['london', 'London', 'England'], ['edinburgh', 'Edinburgh', 'Scotland'], ['cardiff', 'Cardiff', 'Wales'], ['belfast', 'Belfast', 'Northern Ireland']];

const items = [
  // --- animals
  mcq('an.d1', 'animals', 'Is a whale a fish?', [['No: it is a mammal', true], ['Yes: it lives in the sea', false, 'Living in the sea doesn’t make you a fish! Whales breathe air and feed their babies milk, so they are mammals.']], 'Whales and dolphins breathe air through a blowhole and feed their babies milk: they are mammals.'),
  fact('an.mammal', 'animals', 'Which animal group has hair or fur and feeds its babies milk?', 'mammals', ['birds', 'reptiles', 'fish'], 'Mammals have hair or fur and feed their babies milk. Humans are mammals!', { accept: ['mammal'] }),
  fact('an.bird', 'animals', 'Which animal group has feathers, wings and a beak?', 'birds', ['mammals', 'reptiles', 'amphibians'], 'All birds have feathers and lay eggs. Not all birds can fly: penguins swim instead!', { accept: ['bird'] }),
  fact('an.fish', 'animals', 'Which animal group lives in water, has scales and breathes with gills?', 'fish', ['amphibians', 'mammals', 'birds'], 'Fish breathe underwater using gills.'),
  fact('an.reptile', 'animals', 'Which animal group has dry, scaly skin and lays eggs on land?', 'reptiles', ['amphibians', 'fish', 'mammals'], 'Snakes, lizards, crocodiles and tortoises are reptiles.', { accept: ['reptile'] }),
  fact('an.amphibian', 'animals', 'Frogs live in water when young and on land when grown up. Which group are they?', 'amphibians', ['reptiles', 'fish', 'mammals'], 'Amphibians have smooth, damp skin. Frogs, toads and newts are amphibians.', { accept: ['amphibian'] }),
  mcq('an.penguin', 'animals', 'Which group does a penguin belong to?', [['birds', true], ['mammals', false, 'Penguins have feathers and lay eggs: birds!'], ['fish', false, 'They swim, but they have feathers and breathe air.']], 'Penguins are birds that swim instead of fly.'),
  mcq('an.croc', 'animals', 'Which group does a crocodile belong to?', [['reptiles', true], ['amphibians', false, 'Crocodiles have dry, scaly skin and lay eggs on land: reptiles.'], ['fish', false, 'They breathe air.']], 'Crocodiles are reptiles, cousins of the dinosaurs.'),
  fact('an.bat', 'animals', 'A bat can fly. Which group does it belong to?', 'mammals', ['birds', 'insects', 'reptiles'], 'Bats have fur and feed their babies milk: they are the only mammals that can truly fly.', C),
  fact('an.insect', 'animals', 'How many legs does an insect have?', '6', ['8', '4', '10'], 'All insects have 6 legs. Spiders have 8, so they are not insects!'),

  // --- food
  fact('fd.carn', 'food', 'An animal that eats only meat is called a…', 'carnivore', ['herbivore', 'omnivore', 'producer'], 'Lions, sharks and owls are carnivores.'),
  fact('fd.herb', 'food', 'An animal that eats only plants is called a…', 'herbivore', ['carnivore', 'omnivore', 'predator'], 'Cows, rabbits and elephants are herbivores. So are capybaras!'),
  fact('fd.omni', 'food', 'An animal that eats plants AND meat is called an…', 'omnivore', ['herbivore', 'carnivore', 'insect'], 'Bears, pigs and most humans are omnivores.'),
  order('fd.chain', 'food', 'Put this food chain in order, starting with the plant.', ['grass', 'rabbit', 'fox'], 'Grass is eaten by the rabbit; the rabbit is eaten by the fox. Food chains always start with a plant.'),
  order('fd.chain2', 'food', 'Put this sea food chain in order.', ['seaweed', 'fish', 'seal', 'polar bear'], 'Seaweed → fish → seal → polar bear.'),
  mcq('fd.start', 'food', 'What is at the start of every food chain?', [['a plant', true], ['a big animal', false, 'Big animals come at the END. Plants make food from sunlight, so they come first.'], ['a human', false, 'Plants come first.']], 'Plants make their own food using sunlight, so every food chain starts with a plant.'),
  fact('fd.capy', 'food', 'Capybaras eat grass and water plants. What does that make them?', 'herbivores', ['carnivores', 'omnivores', 'predators'], 'Plant-eaters are herbivores.', { ...C }),

  // --- body
  fact('bd.senses', 'body', 'How many main senses do we have?', '5', ['3', '4', '7'], 'Sight, hearing, smell, taste and touch.'),
  fact('bd.smell', 'body', 'Which part of the body do we use to smell?', 'nose', ['ears', 'eyes', 'tongue'], 'We smell with our nose.', { accept: ['the nose', 'our nose'] }),
  fact('bd.taste', 'body', 'Which part of the body do we use to taste?', 'tongue', ['nose', 'teeth', 'ears'], 'Our tongue has taste buds.', { accept: ['the tongue'] }),
  mcq('bd.wash', 'body', 'Why should we wash our hands before eating?', [['To wash away germs', true], ['To make our hands smell nice', false, 'Soap smells nice, but the real reason is germs.'], ['So our hands are wet for eating', false, 'We dry them afterwards!']], 'Germs are too small to see. Soap and water wash them away.'),
  mcq('bd.exercise', 'body', 'Why is exercise good for us?', [['It keeps our heart and muscles strong', true], ['It makes us grow taller straight away', false, 'Exercise keeps us healthy and strong, but it doesn’t make us taller at once.'], ['It means we never need to sleep', false, 'We still need sleep!']], 'Exercise makes the heart pump stronger and keeps muscles and bones healthy.'),
  mcq('bd.balanced', 'body', 'Which meal is the healthiest?', [['Fish, potatoes and vegetables', true], ['Sweets with a fizzy drink', false, 'Too much sugar is bad for teeth and bodies.'], ['A big bowl of only crisps', false, 'We need lots of different foods.']], 'A balanced diet has lots of different foods, including fruit and vegetables.'),
  fact('bd.heart', 'body', 'Which part of the body pumps blood all around it?', 'heart', ['brain', 'lungs', 'stomach'], 'Your heart is a muscle about the size of your fist.', { accept: ['the heart'] }),
  fact('bd.lungs', 'body', 'Which parts of the body do we breathe with?', 'lungs', ['heart', 'stomach', 'kidneys'], 'Our lungs take in air so our body gets oxygen.', { accept: ['the lungs'] }),
  fact('bd.skeleton', 'body', 'What is the name for all the bones in your body?', 'skeleton', ['muscles', 'skin', 'brain'], 'Your skeleton holds you up and protects parts like your brain and heart.', { accept: ['your skeleton', 'a skeleton'] }),

  // --- life cycles
  order('lc.butterfly', 'lifecycles', 'Put the life cycle of a butterfly in order.', ['egg', 'caterpillar', 'chrysalis', 'butterfly'], 'Egg → caterpillar → chrysalis (pupa) → butterfly, which lays more eggs.'),
  order('lc.frog', 'lifecycles', 'Put the life cycle of a frog in order.', ['frogspawn', 'tadpole', 'froglet', 'frog'], 'Frogspawn (eggs) → tadpole → froglet (with legs) → frog.'),
  order('lc.human', 'lifecycles', 'Put these stages of a human life in order.', ['baby', 'toddler', 'child', 'teenager', 'adult'], 'Baby → toddler → child → teenager → adult.'),
  order('lc.chicken', 'lifecycles', 'Put the life cycle of a chicken in order.', ['egg', 'chick', 'young chicken', 'hen'], 'Egg → chick → young chicken → hen, which lays eggs.'),
  fact('lc.tadpole', 'lifecycles', 'What is a baby frog called?', 'tadpole', ['chick', 'calf', 'kitten'], 'Tadpoles live in water and breathe with gills, like fish.', { accept: ['a tadpole'] }),
  fact('lc.calf', 'lifecycles', 'What is a baby cow called?', 'calf', ['foal', 'lamb', 'kid'], 'A baby cow is a calf. A baby horse is a foal; a baby sheep is a lamb.', { accept: ['a calf'] }),
  fact('lc.chrysalis', 'lifecycles', 'What is the hard case a caterpillar makes before it becomes a butterfly?', 'chrysalis', ['cocoon of a spider', 'shell', 'nest'], 'Inside the chrysalis, the caterpillar changes completely.', { accept: ['a chrysalis', 'pupa', 'a pupa'] }),

  // --- plants
  fact('pl.roots', 'plants', 'Which part of a plant takes in water from the soil?', 'roots', ['petals', 'leaves', 'flower'], 'Roots hold the plant in the ground and take in water.', { accept: ['the roots', 'root'] }),
  fact('pl.stem', 'plants', 'Which part of a plant holds it up and carries water to the leaves?', 'stem', ['root', 'petal', 'seed'], 'The stem is like a straw carrying water up the plant.', { accept: ['the stem', 'trunk'] }),
  fact('pl.leaves', 'plants', 'Which part of a plant uses sunlight to make food?', 'leaves', ['roots', 'petals', 'seeds'], 'Leaves catch sunlight and make food for the plant.', { accept: ['the leaves', 'leaf'] }),
  mcq('pl.needs', 'plants', 'What do plants need to grow well?', [['water, light and warmth', true], ['only water', false, 'Water isn’t enough: they need light and warmth too.'], ['darkness and cold', false, 'Plants grow badly in the dark and the cold.']], 'Plants need water, light and a suitable temperature.'),
  fact('pl.seed', 'plants', 'What grows into a new plant?', 'a seed', ['a leaf', 'a petal', 'a stone'], 'Seeds (and bulbs) grow into new plants.', { accept: ['seed', 'seeds', 'a bulb', 'bulb'] }),
  mcq('pl.decid', 'plants', 'What is a deciduous tree?', [['A tree that loses its leaves in autumn', true], ['A tree that keeps its leaves all year', false, 'That is an evergreen tree, like a pine.'], ['A tree with no roots', false, 'All trees have roots.']], 'Oak and sycamore are deciduous. Pine and holly are evergreen.'),
  fact('pl.dark', 'plants', 'A plant is left in a dark cupboard. What will happen?', 'it will turn pale and weak', ['it will turn a brighter green', 'nothing will change', 'it will grow flowers'], 'Without light, plants cannot make food. They turn yellow and weak.', C),

  // --- habitats
  mcq('hb.alive', 'habitats', 'Which of these has NEVER been alive?', [['a rock', true], ['a dead leaf', false, 'A dead leaf was once alive on a tree.'], ['a wooden spoon', false, 'Wood came from a tree, which was alive.']], 'Rocks, metal and plastic have never been alive. Wood and leaves come from living things.'),
  fact('hb.polar', 'habitats', 'Which animal is suited to a cold, icy habitat?', 'polar bear', ['camel', 'parrot', 'lizard'], 'Polar bears have thick fur and fat to keep warm.', C),
  fact('hb.desert', 'habitats', 'Which animal is suited to a hot, dry desert?', 'camel', ['penguin', 'polar bear', 'frog'], 'Camels can go a long time without water.', C),
  fact('hb.ocean', 'habitats', 'Which animal lives in the ocean habitat?', 'shark', ['squirrel', 'camel', 'owl'], 'Sharks live in the ocean.', C),
  fact('hb.micro', 'habitats', 'Where would you find woodlice?', 'under a log or stone', ['in the sky', 'in a desert', 'on a beach towel'], 'Woodlice like dark, damp places. That is their microhabitat.', C),
  fact('hb.rainforest', 'habitats', 'Which habitat is hot and wet, with tall trees and lots of rain?', 'a rainforest', ['a desert', 'the Arctic', 'a pond'], 'Rainforests have more kinds of animals and plants than anywhere else.', { accept: ['rainforest', 'the rainforest', 'jungle'] }),
  mcq('hb.capy', 'habitats', 'Capybaras live near rivers and lakes in South America. Why is that a good habitat for them?', [['They love swimming and water plants', true], ['They need lots of snow and ice', false, 'South America near rivers is warm.'], ['They hunt fish in the water', false, 'Capybaras are herbivores: they eat plants.']], 'Capybaras are excellent swimmers and can hide underwater from danger.'),

  // --- materials
  fact('mt.window', 'materials', 'Why are windows made of glass?', 'it is transparent', ['it is soft and squashy', 'it is bendy', 'it is very cheap'], 'Transparent means you can see through it.', C),
  fact('mt.coat', 'materials', 'Which property makes a raincoat useful?', 'it is waterproof', ['it is transparent', 'it is hard', 'it is magnetic'], 'Waterproof materials don’t let water through.', C),
  fact('mt.spoon', 'materials', 'Which material would make the best spoon for hot soup?', 'metal', ['paper', 'chocolate', 'ice'], 'Metal is strong and doesn’t melt in soup.', C),
  fact('mt.squash', 'materials', 'You can change the shape of modelling clay by squashing, bending, twisting and…', 'stretching', ['melting it with your eyes', 'singing', 'freezing'], 'Squash, bend, twist and stretch: four ways to change shape with forces.', C),
  mcq('mt.wood', 'materials', 'Which is made of wood?', [['a pencil', true], ['a window', false, 'Windows are glass.'], ['a coin', false, 'Coins are metal.']], 'Pencils, tables and doors are often wooden.'),
  fact('mt.natural', 'materials', 'Which material is natural (not made by people)?', 'wood', ['plastic', 'glass', 'nylon'], 'Wood grows on trees. Plastic and glass are made by people.', C),
  fact('mt.mackintosh', 'materials', 'Charles Macintosh invented a famous waterproof coat. What did he use to make the fabric waterproof?', 'rubber', ['paper', 'glass', 'wool'], 'In 1823 he joined two layers of fabric with rubber. Raincoats are still called “macs”!', C),

  // --- seasons
  order('ss.order', 'seasons', 'Put the seasons in order, starting with spring.', ['spring', 'summer', 'autumn', 'winter'], 'Spring, summer, autumn, winter, then spring again.'),
  fact('ss.longest', 'seasons', 'In which season are the days longest?', 'summer', ['winter', 'autumn', 'spring'], 'In summer, the Sun rises early and sets late.'),
  fact('ss.leaves', 'seasons', 'In which season do many trees lose their leaves?', 'autumn', ['spring', 'summer', 'winter'], 'Leaves turn red, orange and yellow in autumn and fall.', { accept: ['fall'] }),
  fact('ss.winter', 'seasons', 'Which months are winter in the UK?', 'December, January and February', ['June, July and August', 'March, April and May', 'September, October and November'], 'Winter is the coldest season, with the shortest days.', C),
  fact('ss.weather', 'seasons', 'What do we measure temperature with?', 'a thermometer', ['a ruler', 'a clock', 'a compass'], 'A thermometer measures how hot or cold it is.', { accept: ['thermometer'] }),
  mcq('ss.sun', 'seasons', 'Why should you never look straight at the Sun?', [['It can damage your eyes', true], ['It will make you sneeze', false, 'Some people do sneeze in bright light, but the real danger is eye damage.'], ['It will go out', false, 'The Sun won’t go out!']], 'The Sun is so bright it can damage eyes, even through sunglasses.'),

  // --- space
  fact('sp.planets', 'space', 'How many planets go round the Sun?', '8', ['9', '7', '12'], 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.'),
  order('sp.order', 'space', 'Put these planets in order, closest to the Sun first.', ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'], 'My Very Easy Method Just Speeds Up Naming planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'),
  fact('sp.biggest', 'space', 'Which is the biggest planet?', 'Jupiter', ['Earth', 'Mars', 'Saturn'], 'Jupiter is so big that all the other planets could fit inside it.', { accept: ['jupiter'] }),
  fact('sp.red', 'space', 'Which planet is called the Red Planet?', 'Mars', ['Venus', 'Jupiter', 'Neptune'], 'Mars is covered in red, rusty dust. Robots called rovers explore it.', { accept: ['mars'] }),
  fact('sp.rings', 'space', 'Which planet has famous bright rings made of ice and rock?', 'Saturn', ['Mars', 'Mercury', 'Earth'], 'Saturn’s rings are made of billions of chunks of ice and rock.', { accept: ['saturn'] }),
  fact('sp.sun', 'space', 'What is the Sun?', 'a star', ['a planet', 'a moon', 'a comet'], 'The Sun is a star: a giant ball of hot, glowing gas. It looks big because it is close.', C),
  mcq('sp.day', 'space', 'Why do we have day and night?', [['The Earth spins round', true], ['The Sun switches off at night', false, 'The Sun keeps shining: it is our side of the Earth that turns away.'], ['The Moon covers the Sun every night', false, 'That only happens in a rare eclipse.']], 'The Earth spins once every 24 hours. When our side faces the Sun, it is day.'),
  fact('sp.moon', 'space', 'What goes round the Earth?', 'the Moon', ['the Sun', 'Mars', 'Jupiter'], 'The Moon goes round the Earth about once a month.', { accept: ['moon'] }),
  fact('sp.astronaut', 'space', 'What is a person who travels into space called?', 'an astronaut', ['an architect', 'a pilot fish', 'a knight'], 'Astronaut means “star sailor”. Tim Peake was a British astronaut on the International Space Station.', { accept: ['astronaut'] }),
  fact('sp.iss', 'space', 'What is the International Space Station?', 'a spacecraft where astronauts live', ['a train station on the Moon', 'a small planet near Mars', 'a bright star in the sky'], 'It goes all the way round the Earth about every 90 minutes!', C),

  // --- world and UK maps
  ...CONTINENTS.map(([id, name, explain]) => mapfact(`c.${id}`, 'world', 'world', 'continents', id, name, explain, { choosePrompt: 'Which continent is highlighted?' })),
  ...OCEANS.map(([id, name, explain]) => mapfact(`o.${id}`, 'world', 'world', 'oceans', id, name, explain, { choosePrompt: 'Which ocean is highlighted?', accept: [name.replace(' Ocean', '')] })),
  fact('w.count', 'world', 'How many continents are there?', '7', ['5', '6', '8'], 'Asia, Africa, North America, South America, Antarctica, Europe and Oceania.'),
  ...UK.map(([id, name, explain]) => mapfact(`uk.${id.toLowerCase()}`, 'uk', 'uk', 'features', id, name, explain, { choosePrompt: 'Which country of the UK is highlighted?' })),
  ...CAPITALS.map(([id, name, country]) => mapfact(`uk.cap.${id}`, 'uk', 'uk', 'markers', id, name, `${name} is the capital of ${country}.`, { choosePrompt: 'Which capital city is marked?', group: 'capital' })),
  ...CAPITALS.map(([, name, country]) => fact(`uk.capq.${name.toLowerCase()}`, 'uk', `What is the capital city of ${country}?`, name, CAPITALS.filter((c) => c[1] !== name).map((c) => c[1]), `${name} is the capital of ${country}.`, { accept: [name.toLowerCase()] })),
  fact('uk.sea', 'uk', 'Which sea lies between Great Britain and Ireland?', 'the Irish Sea', ['the North Sea', 'the Red Sea', 'the Black Sea'], 'The Irish Sea is to the west; the North Sea is to the east.', { accept: ['irish sea'] }),

  // --- maps and directions
  fact('mp.north', 'maps', 'On most maps, which direction is at the top?', 'north', ['south', 'east', 'west'], 'North is at the top; south at the bottom; east on the right; west on the left.'),
  fact('mp.never', 'maps', 'Which saying helps you remember the compass points going clockwise from north?', 'Never Eat Shredded Wheat', ['Some Elephants Never Wake', 'Never Swim With Eels', 'Eat Nice Soft Waffles'], 'North, East, South, West.', C),
  fact('mp.equator', 'maps', 'What is the imaginary line around the middle of the Earth called?', 'the Equator', ['the Pole', 'the Prime Minister', 'the horizon'], 'Places near the Equator are hot all year.', { accept: ['equator'] }),
  mcq('mp.cold', 'maps', 'Why is it cold at the North and South Poles?', [['The Sun’s light is weak and spread out there', true], ['They are the furthest from the Moon', false, 'The Moon doesn’t heat the Earth.'], ['The snow there makes the cold', false, 'Snow is there because it is cold, not the other way round.']], 'Sunlight is weaker at the Poles, so they stay icy.'),
  mcq('mp.physical', 'maps', 'Which of these is a PHYSICAL feature (made by nature)?', [['a mountain', true], ['a factory', false, 'A factory is made by people: a human feature.'], ['a shop', false, 'Shops are human features.']], 'Physical features: mountain, river, beach, cliff. Human features: house, road, factory, port.'),
  mcq('mp.human', 'maps', 'Which of these is a HUMAN feature (made by people)?', [['a bridge', true], ['a river', false, 'Rivers are natural: physical features.'], ['a forest', false, 'Forests grow naturally.']], 'Bridges, roads and towns are human features.'),
  fact('mp.island', 'maps', 'Land with water all the way round it is called an…', 'island', ['ocean', 'continent', 'valley'], 'Great Britain is an island.', { accept: ['an island'] }),

  // --- forces (stretch)
  fact('fo.force', 'forces', 'A force is a push or a…', 'pull', ['jump', 'colour', 'smell'], 'Kicking a ball is a push; opening a drawer is a pull.'),
  mcq('fo.friction', 'forces', 'Why does a toy car stop sooner on carpet than on a smooth floor?', [['There is more friction on carpet', true], ['Carpet is much heavier than floors', false, 'It is about grip: rough carpet rubs against the wheels more.'], ['The car gets tired on carpet', false, 'Cars don’t get tired!']], 'Friction is a force that slows things down when surfaces rub together. Rough surfaces have more friction.'),
  fact('fo.magnet', 'forces', 'Which of these does a magnet pick up?', 'an iron nail', ['a plastic spoon', 'a wooden block', 'a paper clip made of plastic'], 'Magnets attract iron and steel. They don’t attract plastic, wood or most other metals.', C),
  mcq('fo.poles', 'forces', 'What happens when you push the north poles of two magnets together?', [['They push apart (repel)', true], ['They stick together', false, 'Opposite poles attract. The SAME poles repel.'], ['Nothing at all', false, 'You can feel them pushing!']], 'Opposite poles attract; like poles repel.'),
  mcq('fo.ramp', 'forces', 'A race car rolls down a ramp. How can you make it go further?', [['Make the ramp higher', true], ['Paint it a different colour', false, 'Colour doesn’t change the force.'], ['Make the floor stickier', false, 'A sticky floor adds friction, so the car stops sooner.']], 'A higher ramp gives the car more speed at the bottom.'),
  // --- rocks (stretch)
  fact('rk.fossil', 'rocks', 'What is a fossil?', 'old remains of a living thing, turned to rock', ['a shiny jewel found in caves', 'a type of very old volcano', 'a kind of soil found by rivers'], 'Fossils form over millions of years.', C),
  fact('rk.anning', 'rocks', 'Which young woman found amazing fossils on the beach at Lyme Regis about 200 years ago?', 'Mary Anning', ['Florence Nightingale', 'Queen Victoria', 'Grace Darling'], 'When she was only about 12, Mary Anning found the skeleton of an ichthyosaur, a sea reptile. Later she found the first nearly complete plesiosaur skeleton.', { accept: ['anning'] }),
  mcq('rk.form', 'rocks', 'How do most fossils form?', [['An animal is buried and slowly turns to rock', true], ['Animals turn to stone when they get cold', false, 'It takes burial and millions of years, not cold.'], ['People carve them out of stone', false, 'Fossils are natural.']], 'Bones are buried in mud or sand; over millions of years the layers become rock.'),
  fact('rk.soil', 'rocks', 'What is soil made of?', 'bits of rock and rotted plants', ['only sand from the beach', 'melted metal and water', 'tiny pieces of plastic'], 'Soil is broken rock plus rotting leaves, which feed plants.', C),
  fact('rk.dino', 'rocks', 'How do we know dinosaurs existed?', 'from their fossil bones', ['from old photographs', 'from films about them', 'from people who saw them'], 'No people lived at the same time as dinosaurs. Fossils are our evidence.', C),
];

export default [{ subject: 'science', deck: 'core', topics, items }];

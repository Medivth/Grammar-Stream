// Year 2 science and the world, part 2: minibeasts, dinosaurs, hot and cold places, countries
// of the world on the real map, coasts and rivers, and space exploration; Year 3 and 4
// tasters (light and shadows, sound, electricity).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, labels = null) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'order', prompt, items, labels, explain });
const mapfact = (id, topic, map, layer, feature, answer, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mapfact', map, layer, feature, answer, explain, ...extra });
const C = { formats: ['choice'] };

const topics = [
  { id: 'science.minibeasts', title: 'Minibeasts', kind: 'facts', prereqs: ['science.animals'], batch: 5, intro: 'Minibeasts are small creatures like insects, spiders, snails and worms. Insects always have six legs and three body parts.', teach: 'Explain why a spider is not an insect.', talk: 'Go on a minibeast hunt: look under stones and logs, then put them back gently.' },
  { id: 'science.dinosaurs', title: 'Dinosaurs and prehistoric life', kind: 'facts', prereqs: ['science.animals'], batch: 5, intro: 'Dinosaurs ruled the Earth for millions of years, long before people. We know about them from fossils.', teach: 'Explain how we can tell what a dinosaur ate from its teeth.', talk: 'Visit a museum (or a book) and ask {him} which dinosaur {she} would most like to meet.' },
  { id: 'science.hotcold', title: 'Hot and cold places', kind: 'facts', prereqs: ['science.maps'], batch: 5, intro: 'Places near the Equator are hot. Places near the Poles are cold. Animals and people have clever ways to live in each.', teach: 'Explain how a camel is suited to the desert.', talk: 'Ask {him} what {she} would pack for a trip to the Arctic, and to the Sahara.' },
  { id: 'science.countries', title: 'Countries of the world', kind: 'facts', prereqs: ['science.world'], batch: 5, intro: 'There are about 200 countries in the world. Let’s find some of the biggest and most famous on the map.', teach: 'Name a country in each of three continents.', talk: 'When you see where something was made (“Made in China”), find that country on the map.' },
  { id: 'science.coasts', title: 'Seasides and rivers', kind: 'facts', prereqs: ['science.uk'], batch: 5, intro: 'The UK is made of islands, so the sea is never far away. Rivers start in the hills as streams and flow down to the sea.', teach: 'Explain the journey of a river from the hills to the sea.', talk: 'At the beach or a river, ask {him} to point out physical and human features.' },
  { id: 'science.explore', title: 'Exploring space', kind: 'facts', prereqs: ['science.space'], batch: 5, intro: 'People have walked on the Moon, lived on space stations and sent robots to Mars. Space exploration is one of humanity’s greatest adventures.', teach: 'Explain why astronauts need spacesuits.', talk: 'Look up when the International Space Station flies over your home, and watch for it together.' },
  // Year 3 and 4 tasters
  { id: 'science.light', title: 'Light and shadows', kind: 'facts', tier: 'stretch', prereqs: ['science.materials'], batch: 5, intro: 'We need light to see. Light travels in straight lines. When something blocks the light, it makes a shadow.', teach: 'Explain how a shadow is made.', talk: 'Make shadow puppets on the wall with a torch.' },
  { id: 'science.sound', title: 'Sound', kind: 'facts', tier: 'stretch', prereqs: ['science.body'], batch: 5, intro: 'Every sound is made by something vibrating (shaking very fast). The vibrations travel to our ears.', teach: 'Explain how a drum makes a sound.', talk: 'Put rice on a drum or a tin lid and watch it jump when you make a noise.' },
  { id: 'science.electricity', title: 'Electricity', kind: 'facts', tier: 'stretch', prereqs: ['science.materials'], batch: 5, intro: 'Electricity powers lights, toys and even some racing cars. It flows round a complete circuit, like cars round a track.', teach: 'Explain why a bulb only lights when the circuit is complete.', talk: 'Count the things in one room that use electricity. Which use batteries?' },
];

const COUNTRIES = [
  ['GBR', 'United Kingdom', 'This is the UK, where we live: England, Scotland, Wales and Northern Ireland.', ['UK', 'Britain']],
  ['FRA', 'France', 'France is our neighbour, across the English Channel. Its capital is Paris.', []],
  ['USA', 'United States', 'The USA is a huge country in North America. Astronauts went to the Moon from here.', ['USA', 'America', 'United States of America']],
  ['CHN', 'China', 'China has more people than almost any other country, and the Great Wall of China.', []],
  ['IND', 'India', 'India is in Asia. Tigers and elephants live there.', []],
  ['BRA', 'Brazil', 'Brazil is in South America. Most of the Amazon rainforest is here.', []],
  ['AUS', 'Australia', 'Australia is a country AND a continent. Kangaroos live here.', []],
  ['EGY', 'Egypt', 'Egypt is in Africa. The ancient Egyptians built the pyramids beside the River Nile.', []],
  ['KEN', 'Kenya', 'Kenya is in Africa, on the Equator. Lions, giraffes and zebras live on its grasslands.', []],
  ['JPN', 'Japan', 'Japan is a country made of islands in Asia. It has super-fast bullet trains.', []],
  ['CAN', 'Canada', 'Canada is the second biggest country in the world, north of the USA.', []],
  ['RUS', 'Russia', 'Russia is the biggest country in the world. It stretches across Europe and Asia.', []],
  ['ITA', 'Italy', 'Italy is shaped like a boot! The ancient Romans came from here.', []],
  ['ESP', 'Spain', 'Spain is in Europe, south of France. It is often hot and sunny.', []],
];
const RIVERS = [['thames', 'River Thames', 'The Thames flows through London to the North Sea.'], ['severn', 'River Severn', 'The Severn is the longest river in the UK.'], ['trent', 'River Trent', 'The Trent flows through the middle of England.']];

const items = [
  // --- minibeasts
  fact('mb.insect', 'minibeasts', 'How many legs does an insect have?', '6', ['8', '4', '10'], 'All insects have 6 legs and 3 body parts: head, thorax and abdomen.'),
  fact('mb.spider', 'minibeasts', 'How many legs does a spider have?', '8', ['6', '10', '4'], 'Spiders have 8 legs, so they are not insects. They are arachnids.'),
  mcq('mb.notinsect', 'minibeasts', 'Which of these is NOT an insect?', [['spider', true], ['ant', false, 'Ants have 6 legs: insects.'], ['bee', false, 'Bees have 6 legs: insects.'], ['ladybird', false, 'Ladybirds are beetles: insects.']], 'Spiders have 8 legs.'),
  mcq('mb.worm', 'minibeasts', 'How do earthworms help gardens?', [['They mix up the soil', true], ['They eat all the weeds', false, 'Worms eat dead leaves and soil, not living weeds.'], ['They scare the birds away', false, 'Birds love eating worms!']], 'Worm tunnels let air and water reach plant roots, and their poo makes the soil rich.'),
  fact('mb.snail', 'minibeasts', 'What does a snail carry on its back?', 'its shell', ['its babies', 'leaves', 'water'], 'A snail’s shell is its home and protection.', C),
  fact('mb.habitat', 'minibeasts', 'Where are you most likely to find woodlice?', 'under a damp log', ['on a sunny wall', 'in a pond', 'up a tall tree'], 'Woodlice like dark, damp places.', C),
  mcq('mb.bee', 'minibeasts', 'Why are bees so important for plants?', [['They carry pollen between flowers', true], ['They water the flowers each day', false, 'Bees carry pollen.'], ['They eat the pests on the leaves', false, 'Ladybirds do that! Bees carry pollen.']], 'This is called pollination. Without bees, many fruits wouldn’t grow.'),
  order('mb.ladybird', 'minibeasts', 'Put the life cycle of a ladybird in order.', ['egg', 'larva', 'pupa', 'adult ladybird'], 'Like butterflies, ladybirds go egg, larva, pupa, adult.'),
  fact('mb.camouflage', 'minibeasts', 'A stick insect looks just like a twig. What is this called?', 'camouflage', ['hibernation', 'migration', 'pollination'], 'Camouflage helps animals hide from predators.', C),
  // --- dinosaurs
  mcq('dn.teeth', 'dinosaurs', 'A dinosaur had sharp, pointed teeth. What did it probably eat?', [['meat', true], ['leaves', false, 'Plant-eaters had flat or peg-like teeth for chewing or stripping leaves.'], ['nothing', false, 'All animals need food.']], 'Sharp teeth are for tearing meat. T. rex had teeth as long as bananas!'),
  fact('dn.herb', 'dinosaurs', 'A dinosaur that ate only plants was a…', 'herbivore', ['carnivore', 'omnivore', 'predator'], 'Stegosaurus, Triceratops and Diplodocus were herbivores.', C),
  fact('dn.trex', 'dinosaurs', 'Which famous dinosaur had huge jaws, big back legs and tiny arms?', 'Tyrannosaurus rex', ['Stegosaurus', 'Triceratops', 'Diplodocus'], 'T. rex was one of the biggest meat-eating dinosaurs.', { ...C }),
  fact('dn.tri', 'dinosaurs', 'Which dinosaur had three horns on its face?', 'Triceratops', ['Stegosaurus', 'Velociraptor', 'Brachiosaurus'], 'Tri means three: Triceratops means “three-horned face”.', C),
  fact('dn.steg', 'dinosaurs', 'Which dinosaur had big plates along its back and spikes on its tail?', 'Stegosaurus', ['Triceratops', 'T. rex', 'Diplodocus'], 'Stegosaurus used its spiky tail to defend itself.', C),
  mcq('dn.people', 'dinosaurs', 'Did people and dinosaurs live at the same time?', [['No: dinosaurs were long before people', true], ['Yes: people kept them as pets', false, 'Only in films! There were no people then.'], ['Yes, in the Stone Age, in caves', false, 'Stone Age people lived long after the dinosaurs.']], 'The last dinosaurs died out about 66 million years ago. The first humans appeared much, much later.'),
  mcq('dn.extinct', 'dinosaurs', 'What does “extinct” mean?', [['There are none left alive', true], ['Very, very old', false, 'It means none are left.'], ['Too big to live in a zoo', false, 'Extinct animals can be any size.']], 'Dinosaurs are extinct. So is the dodo.'),
  fact('dn.why', 'dinosaurs', 'What do most scientists think helped wipe out the dinosaurs?', 'a giant rock from space', ['a big flood all over the world', 'people hunting them for food', 'they all got too old'], 'A huge asteroid hit the Earth about 66 million years ago, changing the weather all over the world.', C),
  fact('dn.ptero', 'dinosaurs', 'Pterosaurs flew in the sky at the time of the dinosaurs. What did they use to fly?', 'wings made of skin', ['feathers like eagles', 'propellers', 'balloons'], 'Their wings were stretched skin, a bit like a bat’s.', C),
  // --- hot and cold
  fact('hc.desert', 'hotcold', 'A very dry place with very little rain is called a…', 'desert', ['rainforest', 'swamp', 'glacier'], 'The Sahara in Africa is the biggest hot desert.', { accept: ['a desert'] }),
  mcq('hc.camel', 'hotcold', 'How is a camel suited to the desert?', [['It can go a long time without water', true], ['It has thick blubber like a seal', false, 'Blubber is for cold seas. A camel’s body is built to save water.'], ['It swims to find water to drink', false, 'There is very little water in a desert!']], 'Camels store fat in their humps and can go days without water.'),
  mcq('hc.polar', 'hotcold', 'How is a polar bear suited to the Arctic?', [['Thick fur and fat keep it warm', true], ['It sleeps in the warm sun all day', false, 'The Arctic is cold: it needs fur and fat.'], ['It has thin skin to stay cool', false, 'It needs to stay warm, not cool.']], 'White fur also helps it hide in the snow.'),
  fact('hc.rainforest', 'hotcold', 'A hot, wet forest near the Equator is called a…', 'rainforest', ['desert', 'tundra', 'woodland'], 'The Amazon rainforest in South America is the biggest.', { accept: ['rain forest', 'jungle'] }),
  fact('hc.arctic', 'hotcold', 'The cold area around the North Pole is called the…', 'Arctic', ['Antarctic', 'Equator', 'Sahara'], 'Polar bears live in the Arctic. Penguins live in the Antarctic, at the other end!', { accept: ['arctic'] }),
  mcq('hc.penguin-bear', 'hotcold', 'Would a penguin ever meet a polar bear in the wild?', [['No: they live at opposite ends', true], ['Yes, they are best friends', false, 'They live at opposite ends of the Earth!'], ['Yes, at the hot Equator', false, 'Polar bears never go anywhere near the hot Equator.']], 'Polar bears: Arctic (north). Penguins: Antarctic and southern seas.'),
  mcq('hc.equator', 'hotcold', 'Why is it hot near the Equator?', [['The Sun shines straight down there', true], ['It is much closer to the Moon', false, 'The Moon doesn’t heat the Earth.'], ['There are more volcanoes there', false, 'It is because of the Sun.']], 'Direct sunlight is strongest, so the Equator is hot all year.'),
  fact('hc.igloo', 'hotcold', 'Inuit people in the Arctic used to build winter shelters from blocks of snow. What are they called?', 'igloos', ['tents', 'castles', 'huts'], 'Snow traps air, so an igloo keeps people surprisingly warm.', { accept: ['igloo'] }),
  // --- countries
  ...COUNTRIES.map(([id, name, explain, accept]) => mapfact(`ct.${id.toLowerCase()}`, 'countries', 'world', 'countries', id, name, explain, { choosePrompt: 'Which country is highlighted?', accept })),
  fact('ct.biggest', 'countries', 'Which is the biggest country in the world?', 'Russia', ['China', 'the USA', 'Australia'], 'Russia is so big it has 11 time zones!', { accept: ['russia'] }),
  fact('ct.channel', 'countries', 'Which country is just across the English Channel from England?', 'France', ['Spain', 'Italy', 'Canada'], 'You can go through the Channel Tunnel by train to France.', { accept: ['france'] }),
  fact('ct.boot', 'countries', 'Which country is shaped like a boot?', 'Italy', ['France', 'Spain', 'Japan'], 'Look at a map: Italy kicks a ball (the island of Sicily)!', { accept: ['italy'] }),
  // --- coasts and rivers
  ...RIVERS.map(([id, name, explain]) => mapfact(`rv.${id}`, 'coasts', 'uk', 'rivers', `river-${id}`, name, explain, { choosePrompt: 'Which river is highlighted?', accept: [name.replace('River ', '')], group: 'river' })),
  fact('cs.coast', 'coasts', 'Where the land meets the sea is called the…', 'coast', ['source', 'valley', 'desert'], 'The UK has a very long coast because it is made of islands.', { accept: ['coastline', 'seaside'] }),
  fact('cs.source', 'coasts', 'Where a river starts is called its…', 'source', ['mouth', 'bank', 'bed'], 'Rivers often start as small streams in the hills.'),
  fact('cs.mouth', 'coasts', 'Where a river meets the sea is called its…', 'mouth', ['source', 'head', 'foot'], 'The mouth of the Thames is near the North Sea.'),
  mcq('cs.flow', 'coasts', 'Which way does a river always flow?', [['Downhill, towards the sea', true], ['Uphill, towards the mountains', false, 'Water flows downhill.'], ['Round in circles', false, 'Rivers flow downhill to the sea or a lake.']], 'Water always flows downhill, so rivers run from the hills to the sea.'),
  fact('cs.cliff', 'coasts', 'A high, steep rock face by the sea is called a…', 'cliff', ['beach', 'harbour', 'bay'], 'The White Cliffs of Dover are made of chalk.', { accept: ['a cliff'] }),
  mcq('cs.lighthouse', 'coasts', 'What is a lighthouse for?', [['To warn ships about dangerous rocks', true], ['To light up the beach for swimmers', false, 'It shines out to sea for ships.'], ['To grow plants', false, 'It is a tower with a bright light.']], 'The flashing light warns sailors at night.'),
  mcq('cs.human', 'coasts', 'Which is a HUMAN feature at the seaside?', [['a pier', true], ['a cliff', false, 'Cliffs are made by nature.'], ['sand dunes', false, 'Dunes are formed by the wind.']], 'Piers, harbours and lighthouses are built by people.'),
  // --- exploring space
  fact('ex.first', 'explore', 'Who was the first person ever to go into space, in 1961?', 'Yuri Gagarin', ['Neil Armstrong', 'Tim Peake', 'Buzz Aldrin'], 'Yuri Gagarin, from the Soviet Union (he was born in what is now Russia), orbited the Earth once in 1961.', { accept: ['gagarin'] }),
  fact('ex.moon', 'explore', 'Who was the first person to walk on the Moon?', 'Neil Armstrong', ['Yuri Gagarin', 'Tim Peake', 'Helen Sharman'], 'In 1969, on the Apollo 11 mission.', { accept: ['armstrong'] }),
  fact('ex.sharman', 'explore', 'Who was the first British astronaut, in 1991?', 'Helen Sharman', ['Tim Peake', 'Neil Armstrong', 'Queen Victoria'], 'Helen Sharman was a chemist who went to the Mir space station.', { accept: ['sharman'] }),
  fact('ex.peake', 'explore', 'Which British astronaut lived on the International Space Station in 2015 and 2016?', 'Tim Peake', ['Helen Sharman', 'Yuri Gagarin', 'Buzz Aldrin'], 'Tim Peake even ran a marathon on a treadmill in space!', { accept: ['peake'] }),
  mcq('ex.iss', 'explore', 'What is the International Space Station?', [['A spacecraft where astronauts live', true], ['A train station on the Moon', false, 'It flies around the Earth.'], ['A rocket launch pad in Florida', false, 'It is in space, not on the ground.']], 'Astronauts from many countries live there for months at a time. You can sometimes see it from your garden!'),
  mcq('ex.float', 'explore', 'Why do astronauts float inside the space station?', [['They are falling round the Earth', true], ['There is no air inside it', false, 'There IS air inside the station; that is not why they float.'], ['They wear special floating boots', false, 'They float because they and the station are falling round the Earth together.']], 'The station and everything in it falls around the Earth at the same speed, so everything floats.'),
  mcq('ex.mars', 'explore', 'How have scientists explored Mars?', [['By sending robot rovers', true], ['By sending astronauts to live there', false, 'No person has been to Mars yet. Maybe you will be the first!'], ['By looking through binoculars', false, 'Mars is too far away for that: we send rovers.']], 'Rovers like Curiosity and Perseverance drive around Mars taking photos and studying rocks.'),
  fact('ex.rocket', 'explore', 'What do we need to launch astronauts into space?', 'a rocket', ['a jet plane', 'a hot air balloon', 'a helicopter'], 'Only rockets are powerful enough to push all the way up through the air and reach space.', C),
  // --- light (stretch)
  fact('lt.need', 'light', 'What do we need to be able to see things?', 'light', ['sound', 'heat', 'wind'], 'Without light we can’t see anything: dark is the absence of light.', C),
  mcq('lt.shadow', 'light', 'How is a shadow made?', [['An object blocks the light', true], ['Light bounces off a mirror', false, 'That is reflection.'], ['The Sun goes out', false, 'Shadows need light!']], 'Light travels in straight lines. If something blocks it, there is a dark patch behind: a shadow.'),
  mcq('lt.source', 'light', 'Which of these is a LIGHT SOURCE (it makes its own light)?', [['the Sun', true], ['the Moon', false, 'The Moon only reflects the Sun’s light.'], ['a mirror', false, 'A mirror reflects light; it doesn’t make it.']], 'Light sources: the Sun, fire, a torch, a light bulb.'),
  fact('lt.sun', 'light', 'Why should you never look straight at the Sun?', 'it can damage your eyes', ['it will make you sneeze', 'it is too far away', 'it might go out'], 'The Sun’s light is so strong that it can hurt your eyes. Never look straight at it, even with sunglasses on.', C),
  mcq('lt.long', 'light', 'When is your shadow longest on a sunny day?', [['Early morning or evening', true], ['At midday, when the Sun is high', false, 'At midday your shadow is shortest.'], ['It is always the same length', false, 'Watch it change through the day!']], 'A low Sun makes long shadows; a high Sun makes short ones.'),
  // --- sound (stretch)
  mcq('sd.make', 'sound', 'How are all sounds made?', [['By something vibrating', true], ['By light shining on things', false, 'Light helps us see, not hear.'], ['By magnets pulling', false, 'Sound comes from vibrations.']], 'Touch your throat while you hum: you can feel the vibrations.'),
  fact('sd.ear', 'sound', 'Which part of your body do you hear with?', 'ears', ['eyes', 'nose', 'tongue'], 'Vibrations travel through the air into your ears.', { accept: ['ear', 'your ears'] }),
  mcq('sd.far', 'sound', 'What happens to a sound as you walk away from it?', [['It gets quieter', true], ['It gets louder', false, 'Sounds get fainter with distance.'], ['It gets higher', false, 'The pitch stays the same; the volume drops.']], 'The further away you are, the quieter it sounds.'),
  mcq('sd.space', 'sound', 'Could you hear a rocket explosion in empty space?', [['No: there is no air in space', true], ['Yes, very loudly indeed', false, 'Sound needs something to travel through, like air.'], ['Only if it happens at night', false, 'Day or night, there is no air in space to carry sound.']], 'Sound needs air (or water or a solid) to travel. Space is silent!'),
  mcq('sd.pitch', 'sound', 'A short guitar string makes a high note. What does a long string make?', [['A lower note', true], ['A higher note', false, 'Longer strings vibrate more slowly: lower notes.'], ['No sound', false, 'It still vibrates and makes a sound.']], 'Short = high, long = low.'),
  // --- electricity (stretch)
  mcq('el.circuit', 'electricity', 'Why does a bulb only light when the circuit is complete?', [['It needs an unbroken loop', true], ['The bulb needs to warm up first', false, 'It is about the loop being complete.'], ['Batteries only work in the dark', false, 'Batteries work any time.']], 'Like cars on a track: if there is a gap, they can’t get round.'),
  mcq('el.conductor', 'electricity', 'Which material lets electricity flow through it?', [['metal', true], ['plastic', false, 'Plastic is an insulator: that is why wires are covered in it.'], ['wood', false, 'Dry wood is an insulator.']], 'Metals are conductors. Copper is used in wires.'),
  fact('el.battery', 'electricity', 'What gives a torch the power to light up?', 'a battery', ['a magnet', 'a plug', 'a mirror'], 'Batteries store electricity for things we carry about.', C),
  mcq('el.safe', 'electricity', 'Which is a safe thing to do?', [['Keep electric things away from water', true], ['Poke things into plug sockets', false, 'Never! Mains electricity can kill.'], ['Fly a kite near the power lines', false, 'Power lines are very dangerous.']], 'Water and electricity are a dangerous mix.'),
  fact('el.switch', 'electricity', 'What does a switch do in a circuit?', 'it opens or closes a gap', ['it makes the battery bigger', 'it changes the colour of the light', 'it stores spare electricity'], 'A switch breaks or completes the circuit.', C),
];

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const RIVER = { kind: 'flow', across: true, steps: ['source in the hills', 'stream', 'river', 'mouth at the sea'], caption: 'A river starts at its source and flows downhill to its mouth.' };
const TOPIC_VISUALS = {
  'science.dinosaurs': { kind: 'tree', root: { n: 'Dinosaurs', c: [{ n: 'Meat-eaters', note: 'sharp, pointed teeth: T. rex' }, { n: 'Plant-eaters', note: 'flat or peg-like teeth: Triceratops, Stegosaurus, Diplodocus' }] } },
  'science.hotcold': { kind: 'table', head: ['Place', 'What it is like', 'Who lives there'], rows: [['Arctic (North Pole)', 'freezing and icy', 'polar bears'], ['rainforest (near the Equator)', 'hot and wet', 'monkeys, parrots'], ['desert', 'hot and very dry', 'camels'], ['Antarctic (South Pole)', 'freezing and icy', 'penguins']], tint: 'rows', caption: 'Hot near the Equator, cold near the Poles.' },
  'science.explore': { kind: 'timeline', from: 1955, to: 2020, events: [[1961, 'Yuri Gagarin: first person in space'], [1969, 'Neil Armstrong walks on the Moon'], [1991, 'Helen Sharman: first British astronaut'], [2015, 'Tim Peake goes to the space station']] },
  'science.sound': { kind: 'flow', steps: ['The drum vibrates', 'The air around it vibrates', 'The vibrations reach your ear', 'You hear the sound'] },
};
const ITEM_VISUALS = {
  'science.mb.ladybird': { kind: 'cycle', steps: ['egg', 'larva', 'pupa', 'adult ladybird'], centre: 'a ladybird’s life cycle' },
  'science.cs.source': RIVER,
  'science.cs.mouth': RIVER,
  'science.cs.flow': RIVER,
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'science', deck: 'more', topics, items }];

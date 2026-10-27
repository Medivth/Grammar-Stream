// Geography content source. Map items refer to features in content/maps/*.json.
import { the } from './names.mjs';

const mapfact = (id, topic, map, layer, feature, answer, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mapfact', map, layer, feature, answer, explain, ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});

const topics = [
  { id: 'geography.continents', title: 'Continents and oceans', kind: 'facts', prereqs: [], batch: 6, intro: 'There are seven continents and five oceans. Knowing where they are is the starting point for everything else in geography.', hook: 'Seven continents and five oceans, and the Pacific alone is bigger than all the land on Earth put together.', teach: 'Name the seven continents, biggest first if you can.', talk: 'Ask her which ocean you would cross to fly to New York.' },
  { id: 'geography.lines', title: 'Lines on the globe', kind: 'facts', prereqs: ['geography.continents'], batch: 5, intro: 'Imaginary lines help us describe where places are and explain climates: the Equator, the tropics, the polar circles and the Prime Meridian.', hook: 'Top to bottom: Arctic Circle, Tropic of Cancer, Equator, Tropic of Capricorn, Antarctic Circle.', teach: 'Explain why it is hot near the Equator.', talk: 'Ask her which hemisphere Australia is in.' },
  { id: 'geography.uk', title: 'The United Kingdom', kind: 'facts', prereqs: [], batch: 6, intro: 'The UK is made of four countries. Let’s learn them, their capitals, the big rivers and the highest mountains.', hook: 'UK = GB + NI: Great Britain (England, Scotland, Wales) plus Northern Ireland makes four countries.', teach: 'Explain the difference between Great Britain and the United Kingdom.', talk: 'Ask her the capital of Wales and the UK’s longest river.' },
  { id: 'geography.europe-1', title: 'Countries of Europe: west and north', kind: 'facts', prereqs: ['geography.continents'], batch: 6, hook: 'Italy is a boot about to kick a football (Sicily); Scandinavia is Norway, Sweden and Denmark.', teach: 'Describe where Portugal is compared with Spain.', talk: 'Ask her which countries border France.' },
  { id: 'geography.europe-2', title: 'Countries of Europe: centre and east', kind: 'facts', prereqs: ['geography.europe-1'], batch: 6, hook: 'The River Danube strings four capitals together: Vienna, Bratislava, Budapest and Belgrade.', teach: 'Name three countries that border Germany.', talk: 'Ask her to find Poland on a map.' },
  { id: 'geography.capitals-1', title: 'Capitals of Europe: west and north', kind: 'facts', prereqs: ['geography.europe-1'], batch: 6, hook: 'Make a picture for each: Bern’s bears, Brussels sprouts, Madrid in the middle of Spain, all roads leading to Rome.', teach: 'Explain how you remember a tricky capital.', talk: 'Quiz: what is the capital of Norway?' },
  { id: 'geography.capitals-2', title: 'Capitals of Europe: centre and east', kind: 'facts', prereqs: ['geography.europe-2', 'geography.capitals-1'], batch: 6, hook: 'A HUNGry PEST lives in Budapest (Hungary); you ROAM Romania, then REST in Bucharest.', teach: 'Name a capital that is NOT the biggest city in its country.', talk: 'Quiz: what is the capital of Hungary?' },
  { id: 'geography.weather', title: 'Air, water and weather', kind: 'facts', prereqs: [], batch: 5, diagnostic: ['geography.w.d1', 'geography.w.d2', 'geography.w.d3'], intro: 'Before we learn about weather, let’s check some ideas about air and water. Many adults get these wrong!', hook: 'The water cycle is a loop: up as vapour, cool into cloud, fall as rain, collect, and round again.', teach: 'Explain the water cycle using the words evaporation and condensation.', talk: 'Ask her why puddles disappear on a sunny day.' },
];

const CONTINENTS = [
  ['asia', 'Asia', 'Asia is the largest continent, with more than half the world’s people.'],
  ['africa', 'Africa', 'Africa is the second largest continent, with 54 countries. The Equator crosses it.'],
  ['north-america', 'North America', 'North America includes Canada, the USA, Mexico, Central America and the Caribbean.'],
  ['south-america', 'South America', 'South America contains the Amazon rainforest and the Andes mountains.'],
  ['antarctica', 'Antarctica', 'Antarctica is the coldest continent and is covered in ice. No country owns it.'],
  ['europe', 'Europe', 'Europe is the second smallest continent. The UK is part of it.'],
  ['oceania', 'Oceania', 'Oceania includes Australia, New Zealand and many Pacific islands. Some books call this continent Australia.'],
];
const OCEANS = [
  ['pacific', 'Pacific Ocean', 'The Pacific is the largest and deepest ocean.'],
  ['atlantic', 'Atlantic Ocean', 'The Atlantic lies between the Americas and Europe and Africa.'],
  ['indian', 'Indian Ocean', 'The Indian Ocean lies between Africa, Asia and Australia.'],
  ['southern', 'Southern Ocean', 'The Southern Ocean surrounds Antarctica.'],
  ['arctic', 'Arctic Ocean', 'The Arctic is the smallest ocean, around the North Pole.'],
];
const LINES = [
  ['equator', 'Equator', 'The Equator (0°) divides the Earth into the Northern and Southern Hemispheres.'],
  ['cancer', 'Tropic of Cancer', 'The Tropic of Cancer is about 23.5° north. The Sun is directly overhead here at noon on about 21 June.'],
  ['capricorn', 'Tropic of Capricorn', 'The Tropic of Capricorn is about 23.5° south. The Sun is directly overhead here at noon on about 21 December.'],
  ['arctic', 'Arctic Circle', 'North of the Arctic Circle (about 66.5° N) there is at least one day a year when the Sun never sets.'],
  ['antarctic', 'Antarctic Circle', 'The Antarctic Circle is about 66.5° south.'],
  ['greenwich', 'Prime (Greenwich) Meridian', 'The Prime Meridian (0° longitude) runs through Greenwich in London.'],
];

// Europe: [alpha-3 id, name, capital, capital distractors (misconceptions first), set]
const EUROPE = [
  ['GBR', 'United Kingdom', 'London', ['Manchester', 'Edinburgh'], 1], ['IRL', 'Ireland', 'Dublin', ['Cork', 'Belfast'], 1],
  ['FRA', 'France', 'Paris', ['Lyon', 'Marseille'], 1], ['ESP', 'Spain', 'Madrid', ['Barcelona', 'Seville'], 1],
  ['PRT', 'Portugal', 'Lisbon', ['Porto', 'Madrid'], 1], ['DEU', 'Germany', 'Berlin', ['Munich', 'Frankfurt'], 1],
  ['ITA', 'Italy', 'Rome', ['Milan', 'Venice'], 1], ['NLD', 'Netherlands', 'Amsterdam', ['Rotterdam', 'Brussels'], 1],
  ['BEL', 'Belgium', 'Brussels', ['Antwerp', 'Amsterdam'], 1], ['CHE', 'Switzerland', 'Bern', ['Zurich', 'Geneva'], 1],
  ['AUT', 'Austria', 'Vienna', ['Salzburg', 'Berlin'], 1], ['NOR', 'Norway', 'Oslo', ['Bergen', 'Stockholm'], 1],
  ['SWE', 'Sweden', 'Stockholm', ['Gothenburg', 'Oslo'], 1], ['FIN', 'Finland', 'Helsinki', ['Oslo', 'Tallinn'], 1],
  ['DNK', 'Denmark', 'Copenhagen', ['Aarhus', 'Stockholm'], 1], ['ISL', 'Iceland', 'Reykjavik', ['Oslo', 'Dublin'], 1],
  ['GRC', 'Greece', 'Athens', ['Thessaloniki', 'Sparta'], 1], ['LUX', 'Luxembourg', 'Luxembourg', ['Brussels', 'Strasbourg'], 1],
  ['POL', 'Poland', 'Warsaw', ['Kraków', 'Prague'], 2], ['CZE', 'Czechia', 'Prague', ['Brno', 'Vienna'], 2],
  ['SVK', 'Slovakia', 'Bratislava', ['Prague', 'Ljubljana'], 2], ['HUN', 'Hungary', 'Budapest', ['Bucharest', 'Vienna'], 2],
  ['ROU', 'Romania', 'Bucharest', ['Budapest', 'Sofia'], 2], ['BGR', 'Bulgaria', 'Sofia', ['Bucharest', 'Belgrade'], 2],
  ['HRV', 'Croatia', 'Zagreb', ['Split', 'Dubrovnik'], 2], ['SVN', 'Slovenia', 'Ljubljana', ['Bratislava', 'Zagreb'], 2],
  ['SRB', 'Serbia', 'Belgrade', ['Sarajevo', 'Sofia'], 2], ['BIH', 'Bosnia and Herzegovina', 'Sarajevo', ['Belgrade', 'Mostar'], 2],
  ['MNE', 'Montenegro', 'Podgorica', ['Tirana', 'Sarajevo'], 2], ['ALB', 'Albania', 'Tirana', ['Podgorica', 'Skopje'], 2],
  ['MKD', 'North Macedonia', 'Skopje', ['Tirana', 'Sofia'], 2], ['UKR', 'Ukraine', 'Kyiv', ['Lviv', 'Moscow'], 2],
  ['BLR', 'Belarus', 'Minsk', ['Kyiv', 'Vilnius'], 2], ['MDA', 'Moldova', 'Chișinău', ['Bucharest', 'Kyiv'], 2],
  ['LTU', 'Lithuania', 'Vilnius', ['Riga', 'Minsk'], 2], ['LVA', 'Latvia', 'Riga', ['Tallinn', 'Vilnius'], 2],
  ['EST', 'Estonia', 'Tallinn', ['Riga', 'Helsinki'], 2], ['RUS', 'Russia', 'Moscow', ['St Petersburg', 'Kyiv'], 2],
  ['MLT', 'Malta', 'Valletta', ['Nicosia', 'Rome'], 2], ['CYP', 'Cyprus', 'Nicosia', ['Athens', 'Valletta'], 2],
];
const CAPITAL_NOTES = {
  CHE: 'Bern, not Zurich or Geneva, which are bigger.', NLD: 'Amsterdam is the capital, though the government sits in The Hague.',
  ITA: 'Rome, not Milan.', ESP: 'Madrid, not Barcelona.', DEU: 'Berlin, not Munich.', HUN: 'Budapest: don’t mix it up with Bucharest (Romania).',
  ROU: 'Bucharest: don’t mix it up with Budapest (Hungary).', SVK: 'Bratislava: don’t mix it up with Ljubljana (Slovenia).', SVN: 'Ljubljana: don’t mix it up with Bratislava (Slovakia).',
  UKR: 'Kyiv (sometimes spelt Kiev).', MDA: 'Chișinău (you can type Chisinau).', LUX: 'The country and its capital share a name: the city is often called Luxembourg City.',
};

const items = [];
for (const [id, name, explain] of CONTINENTS) items.push(mapfact(`c.${id}`, 'continents', 'world', 'continents', id, name, explain, { choosePrompt: 'Which continent is highlighted?' }));
for (const [id, name, explain] of OCEANS) items.push(mapfact(`o.${id}`, 'continents', 'world', 'oceans', id, name, explain, { choosePrompt: 'Which ocean is highlighted?', accept: [name.replace(' Ocean', '')] }));
items.push(fact('c.count', 'continents', 'How many continents are there?', '7', ['5', '6', '8'], 'Seven: Asia, Africa, North America, South America, Antarctica, Europe and Oceania.'));
items.push(fact('c.largest-ocean', 'continents', 'Which is the largest ocean?', 'Pacific Ocean', ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 'The Pacific is bigger than all the land on Earth put together.', { accept: ['pacific', 'the pacific'] }));

for (const [id, name, explain] of LINES) items.push(mapfact(`l.${id}`, 'lines', 'world', 'lines', id, name, explain, { choosePrompt: 'Which line is highlighted in red?', accept: id === 'greenwich' ? ['Prime Meridian', 'Greenwich Meridian'] : [] }));
items.push(fact('l.hemis', 'lines', 'The Equator divides the Earth into the Northern and ______ Hemispheres.', 'Southern', ['Eastern', 'Western', 'Lower'], 'North and South of the Equator are the Northern and Southern Hemispheres.'));
items.push(fact('l.uk-hemi', 'lines', 'Is the UK in the Northern or Southern Hemisphere?', 'Northern', ['Southern'], 'The UK is about 50–60° north of the Equator.', { formats: ['choice'] }));
items.push(mcq('l.hot', 'lines', 'Why is it usually hotter near the Equator?', [['The Sun’s rays hit the ground more directly', true], ['The Equator is much closer to the Sun', false, 'The difference in distance is tiny. It is about the angle of the Sun’s rays.'], ['There are more volcanoes heating the ground', false, 'Volcanoes don’t control climate zones.']], 'Near the Equator the Sun is high in the sky, so its energy is spread over a smaller area.'));
items.push(fact('l.latitude', 'lines', 'Lines that run east–west around the globe, measuring how far north or south you are, are called lines of…', 'latitude', ['longitude', 'altitude', 'meridians'], 'Latitude measures north–south (like rungs on a ladder: “lat-itude is flat”). Longitude measures east–west.'));

// UK
const UK = [
  ['ENG', 'England', 'England is the largest UK country by area and population.'], ['SCT', 'Scotland', 'Scotland is in the north of Great Britain.'],
  ['WLS', 'Wales', 'Wales is in the west of Great Britain.'], ['NIR', 'Northern Ireland', 'Northern Ireland is on the island of Ireland, and is part of the UK.'],
];
for (const [id, name, explain] of UK) items.push(mapfact(`uk.${id.toLowerCase()}`, 'uk', 'uk', 'features', id, name, explain, { choosePrompt: 'Which country of the UK is highlighted?' }));
const UK_CAPITALS = [['london', 'London', 'England'], ['edinburgh', 'Edinburgh', 'Scotland'], ['cardiff', 'Cardiff', 'Wales'], ['belfast', 'Belfast', 'Northern Ireland']];
for (const [id, name, country] of UK_CAPITALS) {
  items.push(mapfact(`uk.cap.${id}`, 'uk', 'uk', 'markers', id, name, `${name} is the capital of ${country}.`, { choosePrompt: 'Which capital city is marked?', group: 'capital' }));
  items.push(fact(`uk.capq.${id}`, 'uk', `What is the capital of ${country}?`, name, UK_CAPITALS.filter((c) => c[1] !== name).map((c) => c[1]).concat(country === 'Scotland' ? ['Glasgow'] : country === 'Wales' ? ['Swansea'] : []), `${name} is the capital of ${country}.`, { map: 'uk', feature: UK.find((u) => u[1] === country)[0] }));
}
const RIVERS = [['thames', 'River Thames', 'The Thames flows through London to the North Sea. It is the longest river entirely in England.'], ['severn', 'River Severn', 'The Severn is the UK’s longest river (about 354 km). It starts in Wales.'], ['trent', 'River Trent', 'The Trent flows through the Midlands, past Nottingham.'], ['tay', 'River Tay', 'The Tay is Scotland’s longest river.'], ['tweed', 'River Tweed', 'Part of the Tweed forms the border between England and Scotland.']];
for (const [id, name, explain] of RIVERS) items.push(mapfact(`uk.r.${id}`, 'uk', 'uk', 'rivers', `river-${id}`, name, explain, { choosePrompt: 'Which river is highlighted?', accept: [name.replace('River ', '')], group: 'river' }));
items.push(fact('uk.longest', 'uk', 'What is the longest river in the UK?', 'River Severn', ['River Thames', 'River Trent', 'River Tay'], 'Only just! The Severn (about 354 km, from the Welsh mountains to the Bristol Channel) beats the Thames (about 346 km). The Thames is the longest river entirely in England.', { accept: ['severn', 'the severn', 'the river severn'] }));
const PEAKS = [['ben-nevis', 'Ben Nevis', 'Ben Nevis (1345 m), in Scotland, is the highest mountain in the UK.'], ['snowdon', 'Yr Wyddfa (Snowdon)', 'Yr Wyddfa (Snowdon), 1085 m, is the highest mountain in Wales.'], ['scafell', 'Scafell Pike', 'Scafell Pike (978 m) in the Lake District is the highest mountain in England.']];
for (const [id, name, explain] of PEAKS) items.push(mapfact(`uk.p.${id}`, 'uk', 'uk', 'markers', id, name, explain, { choosePrompt: 'Which mountain is marked?', accept: id === 'snowdon' ? ['Snowdon', 'Yr Wyddfa'] : [], group: 'peak' }));
items.push(fact('uk.highest', 'uk', 'What is the highest mountain in the UK?', 'Ben Nevis', ['Scafell Pike', 'Snowdon', 'Slieve Donard'], 'Ben Nevis in the Scottish Highlands is 1345 m high.'));
items.push(mcq('uk.gb', 'uk', 'What is the difference between Great Britain and the United Kingdom?', [['The UK also includes Northern Ireland', true], ['They are exactly the same thing', false, 'Great Britain is an island. The UK is a country that also includes Northern Ireland.'], ['Great Britain includes Ireland; the UK does not', false, 'The Republic of Ireland is a separate country, not part of either.']], 'The UK = England + Scotland + Wales + Northern Ireland. Great Britain is the largest island: England, Scotland and Wales.'));

// Europe
for (const [id, name, capital, wrong, set] of EUROPE) {
  items.push(mapfact(`eu.${id.toLowerCase()}`, `europe-${set}`, 'europe', 'countries', id, name, `This is ${the(name)}.`, { choosePrompt: 'Which country is highlighted?', accept: id === 'GBR' ? ['UK', 'Britain', 'Great Britain'] : id === 'CZE' ? ['Czech Republic'] : id === 'NLD' ? ['Holland', 'The Netherlands'] : [] }));
  items.push(fact(`cap.${id.toLowerCase()}`, `capitals-${set}`, `What is the capital of ${the(name)}?`, capital, wrong, `The capital of ${the(name)} is ${capital.replace(/\.$/, '')}.${CAPITAL_NOTES[id] ? ' ' + CAPITAL_NOTES[id] : ''}`, {
    map: 'europe', feature: id, fill: true, learn: `The capital of **${the(name)}** is **${capital}**.${CAPITAL_NOTES[id] ? ' ' + CAPITAL_NOTES[id] : ''}`,
    accept: id === 'UKR' ? ['Kiev'] : id === 'MDA' ? ['Chisinau'] : id === 'ISL' ? ['Reykjavík'] : id === 'LUX' ? ['Luxembourg City'] : [],
  }));
}

// Weather diagnostics and water cycle (misconceptions from Ofsted's geography review)
items.push(
  mcq('w.d1', 'weather', 'Does air have mass (does it weigh anything)?', [['Yes, air has mass', true], ['No, air weighs nothing', false, 'A common idea, but air is made of particles, and particles have mass. A room’s air can weigh more than you!'], ['Only when it is cold and wet', false, 'Air always has mass, whether it is moving or not.']], 'Air is matter: it has mass and takes up space. The weight of air above us causes air pressure.'),
  mcq('w.d2', 'weather', 'Is damp (humid) air heavier or lighter than dry air at the same temperature?', [['Lighter', true], ['Heavier, because water is heavy', false, 'Surprising but true: water vapour molecules are lighter than the nitrogen and oxygen they replace, so humid air is less dense.'], ['Exactly the same', false, 'There is a small difference: humid air is slightly lighter.']], 'Water vapour (H₂O) has lighter molecules than nitrogen (N₂) and oxygen (O₂), so humid air is less dense. That helps it rise and form clouds.'),
  mcq('w.d3', 'weather', 'Why does the Sun appear to move across the sky during the day?', [['Because the Earth spins on its axis', true], ['Because the Sun travels around the Earth each day', false, 'This is what people believed for thousands of years, but it is the Earth that turns.'], ['Because clouds push it along', false, 'Clouds are much closer than the Sun and don’t affect where it appears.']], 'The Earth rotates once every 24 hours, so the Sun appears to rise in the east and set in the west.'),
  fact('w.evap', 'weather', 'What is it called when liquid water turns into water vapour?', 'evaporation', ['condensation', 'precipitation', 'transpiration'], 'Evaporation: the Sun heats water and it turns into vapour.'),
  fact('w.cond', 'weather', 'What is it called when water vapour cools and turns back into liquid droplets?', 'condensation', ['evaporation', 'precipitation', 'infiltration'], 'Condensation forms clouds, and the droplets on a cold window.'),
  fact('w.precip', 'weather', 'What is the word for water falling from clouds as rain, sleet, snow or hail?', 'precipitation', ['condensation', 'evaporation', 'collection'], 'Precipitation is any water falling from the sky.'),
  fact('w.trans', 'weather', 'What is it called when plants lose water vapour through their leaves?', 'transpiration', ['evaporation', 'respiration', 'photosynthesis'], 'Transpiration: water moves up through a plant and escapes from its leaves.'),
  fact('w.weather-climate', 'weather', 'What is the difference between weather and climate?', 'weather is daily; climate is the average', ['they mean exactly the same thing', 'climate is daily; weather is the average', 'weather is about rain; climate is about heat'], 'Weather is what happens today. Climate is the typical pattern over about 30 years.', { formats: ['choice'] }),
  order('w.cycle', 'weather', 'Put the water cycle in order, starting with water in the sea.', ['evaporation', 'condensation', 'precipitation', 'collection'], null, 'The Sun evaporates water; vapour condenses into clouds; water falls as precipitation; it collects in rivers, lakes and seas.'),
);

function order(id, topic, prompt, its, labels, explain) {
  return { id: `geography.${id}`, topic: `geography.${topic}`, kind: 'order', prompt, items: its, labels, explain };
}

// Memory hooks (mnemonics) and real-world examples, keyed by item id. Shown on the learn card and after a wrong answer.
const BALTIC = { hook: 'The Baltic states go alphabetically from north to south: Estonia (Tallinn), Latvia (Riga), Lithuania (Vilnius).' };
const MEMORY = {
  // continents and oceans
  'c.asia': { hook: 'Asia is the giant: the biggest continent AND the most people.', example: 'China and India, the two countries with the most people, are both in Asia, and so is Mount Everest.' },
  'c.africa': { hook: '54 countries: Africa is a continent, never “a country”.', example: 'The Sahara stretches across the north, Kilimanjaro rises in Tanzania, and the Nile flows north through Egypt.' },
  'c.north-america': { example: 'New York, Toronto and Mexico City are all in North America, and so is the huge island of Greenland.' },
  'c.south-america': { hook: 'South America hangs below North America like an ice-cream cone, joined on by the thin strip of Panama.', example: 'Brazil and the Amazon rainforest fill much of it; the Andes run all the way down the west coast.' },
  'c.antarctica': { hook: 'Ant-arctica means “opposite the Arctic”: it sits at the South Pole, the far end of the Earth.', example: 'Emperor penguins breed there, and British scientists work at the Halley and Rothera research stations.' },
  'c.europe': { example: 'The UK is in Europe: on a clear day you can see France from the white cliffs of Dover, about 33 km away.' },
  'c.oceania': { hook: 'Ocean-ia: mostly ocean, dotted with islands around Australia.', example: 'Australia’s Great Barrier Reef, New Zealand’s volcanoes and the islands of Fiji and Samoa are all in Oceania.' },
  'o.pacific': { hook: 'Pacific means “peaceful”: Magellan named it in 1520 after a calm crossing.', example: 'The Mariana Trench, the deepest place on Earth at about 11 km, is in the Pacific.' },
  'o.atlantic': { hook: 'A for Atlantic, A for America: it is the ocean we fly over to get to America.', example: 'It washes the UK’s west coast, and the Titanic sank in the North Atlantic in 1912.' },
  'o.indian': { hook: 'Named after India, which pokes down into it like a triangle.', example: 'The Maldives, Mauritius and Madagascar are islands in the Indian Ocean.' },
  'o.southern': { hook: 'The Southern Ocean is the ring of sea that goes all the way round Antarctica.', example: 'In 1916 Ernest Shackleton crossed it in a small lifeboat after his ship, Endurance, was crushed by ice.' },
  'o.arctic': { hook: 'Arctic comes from the Greek for “bear”: it lies beneath the stars of the Great Bear.', example: 'Polar bears hunt seals on its sea ice, which shrinks a lot each summer.' },
  'c.count': { hook: '“Eat An Aspirin After A Nighttime Snack”: Europe, Asia, Africa, Australia (Oceania), Antarctica, North and South America.' },
  'c.largest-ocean': { hook: 'P for Pacific, P for plenty of room: it covers about a third of the whole Earth.' },

  // lines on the globe
  'l.equator': { hook: 'The Equator divides the Earth into two EQUAL halves.', example: 'It runs through Ecuador (named after it), the Amazon in Brazil, Kenya and Indonesia.' },
  'l.cancer': { hook: 'CaNcer has an N for North; CapriCORN has a corn on its foot, down at the bottom.', example: 'It passes through Mexico, the Sahara, Egypt near Aswan, and India.' },
  'l.capricorn': { hook: 'CaNcer has an N for North; CapriCORN has a corn on its foot, down at the bottom.', example: 'It runs through Brazil (right by São Paulo), southern Madagascar and the middle of Australia.' },
  'l.arctic': { hook: 'Inside the Arctic Circle is the land of the midnight Sun: in midsummer it shines all night.', example: 'It crosses Lapland in northern Norway, Sweden and Finland, as well as Russia, Alaska, Canada and Greenland.' },
  'l.antarctic': { hook: 'Antarctic = anti-Arctic: the same circle, mirrored in the south.', example: 'Almost all of Antarctica lies inside it; around 21 June the Sun does not rise there at all.' },
  'l.greenwich': { hook: 'Greenwich Mean Time (GMT) is measured from this line: 0° is where world time begins.', example: 'At the Royal Observatory in Greenwich you can stand with one foot in the eastern and one in the western hemisphere.' },
  'l.hemis': { hook: 'Hemi means “half”: a hemisphere is half a sphere.', example: 'Australia and South Africa are in the Southern Hemisphere, so Christmas there is in summer.' },
  'l.uk-hemi': { hook: 'We are northerners: our summer is in June, Australia’s is in December.', example: 'London is about 51.5° north, roughly 5,700 km north of the Equator.' },
  'l.hot': { hook: 'Torch test: shine a torch straight down for a small, bright spot; tilt it and the same light spreads out, weaker.', example: 'The midday Sun is much higher over the UK in June than in December, which is a big reason summer is warmer.' },
  'l.latitude': { hook: '“Lat is flat”: latitude lines lie flat like ladder rungs; longitude lines are long, running pole to pole.', example: 'London is about 51.5° N and Edinburgh about 56° N, so Edinburgh is further north.' },

  // the UK
  'uk.eng': { example: 'England is home to London, Birmingham and Manchester, and to most of the UK’s people.' },
  'uk.sct': { example: 'Scotland has Ben Nevis, Loch Ness and the Highlands, plus nearly 800 islands.' },
  'uk.wls': { hook: 'Wales bulges out to the west of England: some say it looks like a pig’s head.', example: 'Road signs in Wales are in Welsh and English: “Araf” means “Slow”.' },
  'uk.nir': { hook: 'Northern Ireland is the only part of the UK with a land border with another country: Ireland.', example: 'See the Giant’s Causeway on its north coast, and the Belfast shipyard where the Titanic was built.' },
  'uk.capq.london': { example: 'The Houses of Parliament and Big Ben stand beside the Thames in London.' },
  'uk.capq.edinburgh': { hook: 'Edinburgh, not Glasgow: Glasgow is bigger, but Edinburgh has the castle and the Scottish Parliament.', example: 'Edinburgh Castle sits on Castle Rock, the plug of an ancient volcano.' },
  'uk.capq.cardiff': { example: 'The Welsh Parliament (the Senedd) and the Principality Stadium are in Cardiff.' },
  'uk.capq.belfast': { hook: 'Belfast is in Northern Ireland (UK); Dublin is the capital of the Republic of Ireland.', example: 'The Titanic was built in Belfast, and the Northern Ireland Assembly meets at Stormont.' },
  'uk.r.thames': { example: 'The Thames Barrier at Woolwich closes against high tides and storm surges to stop London flooding.' },
  'uk.r.severn': { example: 'Its huge tides push a wave called the Severn Bore upstream, and people surf it.' },
  'uk.r.trent': { hook: 'Stoke-on-Trent and Burton upon Trent are named after it.', example: 'It flows through the Midlands past Nottingham, then joins the Ouse to make the Humber estuary.' },
  'uk.r.tay': { hook: 'Small name, big river: the Tay carries more water than any other river in the UK.', example: 'Dundee stands on the Firth of Tay, crossed by the long Tay Rail Bridge.' },
  'uk.r.tweed': { example: 'Berwick-upon-Tweed, England’s most northerly town, sits at its mouth.' },
  'uk.longest': { hook: 'S comes before T: the Severn comes first, just ahead of the Thames.', example: 'The Severn flows from Plynlimon in mid-Wales through Shrewsbury, Worcester and Gloucester.' },
  'uk.p.ben-nevis': { example: 'It towers over Fort William in the Highlands; walkers climb it in the Three Peaks Challenge.' },
  'uk.p.snowdon': { hook: 'The Three Peaks, tallest first: Ben Nevis (Scotland), Yr Wyddfa (Wales), Scafell Pike (England).', example: 'The Snowdon Mountain Railway carries visitors almost to the summit.' },
  'uk.p.scafell': { hook: 'Scafell Pike is the shortest of the Three Peaks, but the top of England.', example: 'It rises above Wasdale in the Lake District, beside Wastwater, England’s deepest lake.' },
  'uk.highest': { hook: 'Big Ben is a London bell; Ben Nevis is the BIG Ben of mountains.' },
  'uk.gb': { hook: 'GB = 3 countries on one island. UK = GB + Northern Ireland = 4.', example: 'The UK’s full name is “the United Kingdom of Great Britain and Northern Ireland”: it says so on a British passport.' },

  // countries of Europe
  'eu.ita': { hook: 'Italy is shaped like a boot, about to kick a football (Sicily).' },
  'eu.prt': { hook: 'Portugal is the strip down Spain’s Atlantic side, at the far south-west corner of Europe.' },
  'eu.nld': { hook: 'Nether-lands means “low lands”: about a quarter of it lies below sea level.' },
  'eu.che': { hook: 'Switzerland is landlocked and full of Alps: think cheese, chocolate and mountains.' },
  'eu.nor': { hook: 'Norway is long and thin, down Scandinavia’s west coast, with deep fjords.' },
  'eu.dnk': { hook: 'Denmark is a thumb of land (Jutland) poking north from Germany, plus islands.' },
  'eu.isl': { hook: 'Iceland sits on the Mid-Atlantic Ridge, so it has volcanoes and hot springs. The word “geyser” comes from Geysir there.' },
  'eu.grc': { hook: 'Greece is a hand of peninsulas reaching into the Mediterranean, with thousands of islands.' },
  'eu.irl': { hook: 'Ireland is the island to the west of Great Britain; the Republic covers most of it.' },
  'eu.ukr': { hook: 'Ukraine is the largest country entirely in Europe.' },
  'eu.rus': { hook: 'Russia is the largest country in the world, stretching from Europe right across Asia.' },
  'eu.mlt': { hook: 'Malta is a tiny group of islands just south of Sicily.' },
  'eu.cyp': { hook: 'Cyprus is an island at the far east of the Mediterranean, south of Turkey.' },

  // capitals of Europe (only where a link genuinely helps)
  'cap.irl': { hook: 'Dublin is in the Republic of Ireland; Belfast is in Northern Ireland, part of the UK.' },
  'cap.prt': { hook: 'Porto gave Portugal its name, but Lisbon is the capital.' },
  'cap.esp': { hook: 'M for Madrid, M for Middle: it is right in the middle of Spain.' },
  'cap.deu': { example: 'The Berlin Wall split the city from 1961 to 1989; Berlin became the capital of a reunited Germany in 1990.' },
  'cap.ita': { hook: '“All roads lead to Rome”: the Romans built their roads out from their capital.' },
  'cap.bel': { hook: 'Brussels sprouts are named after Brussels, Belgium’s capital.', example: 'Brussels is home to the European Union’s main buildings and NATO’s headquarters.' },
  'cap.che': { hook: 'Bern has bears: a bear is on its coat of arms, and real bears live in the city’s Bear Park.' },
  'cap.aut': { example: 'Mozart, Haydn and Beethoven all lived and worked in Vienna.' },
  'cap.nor': { example: 'The Nobel Peace Prize is awarded in Oslo every December.' },
  'cap.swe': { example: 'Stockholm is built on 14 islands, and the other Nobel Prizes are awarded there.' },
  'cap.fin': { example: 'Ferries cross from Helsinki to Tallinn, Estonia’s capital, in about two hours.' },
  'cap.dnk': { example: 'Copenhagen’s Little Mermaid statue comes from Hans Christian Andersen’s fairy tale.' },
  'cap.isl': { hook: 'Reykjavik means “smoky bay”, after the steam rising from its hot springs.', example: 'It is the world’s most northerly capital of an independent country.' },
  'cap.grc': { hook: 'Athens is named after the goddess Athena; the Parthenon on the Acropolis was her temple.' },
  'cap.pol': { example: 'Marie Curie, who discovered radium, was born in Warsaw.' },
  'cap.cze': { hook: '“Good King Wenceslas” was a real duke of Bohemia: his statue stands in Prague’s Wenceslas Square.' },
  'cap.svk': { hook: 'Bratislava sits on the Danube right by the Austrian border, only about an hour from Vienna.' },
  'cap.hun': { hook: 'A HUNGry PEST: Budapest is Hungary’s. It was two cities, Buda and Pest, either side of the Danube.' },
  'cap.rou': { hook: 'ROAM-ania, then REST: you roam Romania, then rest in BuchaREST.' },
  'cap.svn': { hook: 'sLOVEnia has LOVE hidden in it, and Ljubljana’s symbol is a dragon, on its Dragon Bridge.' },
  'cap.srb': { hook: 'Belgrade means “white city”. It stands where the River Sava meets the Danube.' },
  'cap.bih': { example: 'In Sarajevo in 1914, Archduke Franz Ferdinand was shot, which set off the First World War.' },
  'cap.mkd': { example: 'Mother Teresa was born in Skopje in 1910.' },
  'cap.est': BALTIC, 'cap.lva': BALTIC, 'cap.ltu': BALTIC,
  'cap.rus': { hook: 'Moscow, not St Petersburg: St Petersburg was the capital only from 1712 to 1918.', example: 'Red Square, the Kremlin and the onion domes of St Basil’s Cathedral are in Moscow.' },

  // weather and the water cycle
  'w.d1': { hook: 'Air is stuff: a football weighs a little more once it is pumped up.', example: 'Crisp packets puff up on a plane because there is less air pressing on them in the cabin.' },
  'w.d2': { hook: 'H₂O (18) is lighter than N₂ (28) and O₂ (32): swap water vapour in and the air gets lighter.', example: 'Warm, muggy air rises easily, building the towering clouds of a summer thunderstorm.' },
  'w.d3': { hook: 'The Earth turns towards the east, so the Sun rises in the east and sets in the west.', example: 'At the Equator the ground spins at about 1,670 km/h, yet we never feel it.' },
  'w.evap': { hook: 'e-VAPOUR-ation: the water escapes as vapour.', example: 'Washing dries on the line and puddles vanish on a sunny day.' },
  'w.cond': { hook: 'Condensation: when vapour cools, it comes together into droplets.', example: 'Breathe on a cold mirror, or take a can out of the fridge: droplets appear on the cold surface.' },
  'w.precip': { example: 'Rain gauges measure precipitation in millimetres: London gets about 600 mm a year.' },
  'w.trans': { hook: 'TRANSpiration: plants TRANSfer water out through their leaves, like plant sweat.', example: 'Tie a clear plastic bag over a leafy branch on a sunny day: droplets collect inside within hours.' },
  'w.weather-climate': { hook: '“Climate is what you expect; weather is what you get.”', example: 'The UK’s climate is mild and wet, yet the weather on any one day might be a heatwave or a snowstorm.' },
  'w.cycle': { hook: '“Every Cloud Pours Constantly”: Evaporation, Condensation, Precipitation, Collection.', example: 'Rain that falls on the Welsh mountains runs down the Severn and back to the sea, ready to evaporate again.' },
};
for (const [id, extra] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `geography.${id}`);
  if (!item) throw new Error(`MEMORY: no item geography.${id}`);
  Object.assign(item, extra);
}

export default [{ subject: 'geography', deck: 'core', topics, items }];

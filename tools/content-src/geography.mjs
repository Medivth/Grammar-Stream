// Geography content source. Map items refer to features in content/maps/*.json.

const mapfact = (id, topic, map, layer, feature, answer, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mapfact', map, layer, feature, answer, explain, ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});

const topics = [
  { id: 'geography.continents', title: 'Continents and oceans', kind: 'facts', prereqs: [], batch: 6, intro: 'There are seven continents and five oceans. Knowing where they are is the starting point for everything else in geography.', teach: 'Name the seven continents, biggest first if you can.', talk: 'Ask her which ocean you would cross to fly to New York.' },
  { id: 'geography.lines', title: 'Lines on the globe', kind: 'facts', prereqs: ['geography.continents'], batch: 5, intro: 'Imaginary lines help us describe where places are and explain climates: the Equator, the tropics, the polar circles and the Prime Meridian.', teach: 'Explain why it is hot near the Equator.', talk: 'Ask her which hemisphere Australia is in.' },
  { id: 'geography.uk', title: 'The United Kingdom', kind: 'facts', prereqs: [], batch: 6, intro: 'The UK is made of four countries. Let’s learn them, their capitals, the big rivers and the highest mountains.', teach: 'Explain the difference between Great Britain and the United Kingdom.', talk: 'Ask her the capital of Wales and the UK’s longest river.' },
  { id: 'geography.europe-1', title: 'Countries of Europe: west and north', kind: 'facts', prereqs: ['geography.continents'], batch: 6, teach: 'Describe where Portugal is compared with Spain.', talk: 'Ask her which countries border France.' },
  { id: 'geography.europe-2', title: 'Countries of Europe: centre and east', kind: 'facts', prereqs: ['geography.europe-1'], batch: 6, teach: 'Name three countries that border Germany.', talk: 'Ask her to find Poland on a map.' },
  { id: 'geography.capitals-1', title: 'Capitals of Europe: west and north', kind: 'facts', prereqs: ['geography.europe-1'], batch: 6, teach: 'Explain how you remember a tricky capital.', talk: 'Quiz: what is the capital of Norway?' },
  { id: 'geography.capitals-2', title: 'Capitals of Europe: centre and east', kind: 'facts', prereqs: ['geography.europe-2', 'geography.capitals-1'], batch: 6, teach: 'Name a capital that is NOT the biggest city in its country.', talk: 'Quiz: what is the capital of Hungary?' },
  { id: 'geography.weather', title: 'Air, water and weather', kind: 'facts', prereqs: [], batch: 5, diagnostic: ['geography.w.d1', 'geography.w.d2', 'geography.w.d3'], intro: 'Before we learn about weather, let’s check some ideas about air and water. Many adults get these wrong!', teach: 'Explain the water cycle using the words evaporation and condensation.', talk: 'Ask her why puddles disappear on a sunny day.' },
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
  UKR: 'Kyiv (sometimes spelt Kiev).', MDA: 'Chișinău (you can type Chisinau).', LUX: 'Its capital has the same name: Luxembourg.',
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
items.push(fact('uk.longest', 'uk', 'What is the longest river in the UK?', 'River Severn', ['River Thames', 'River Trent', 'River Tay'], 'The Severn (about 354 km) is longer than the Thames (about 346 km).', { accept: ['severn', 'the severn', 'the river severn'] }));
const PEAKS = [['ben-nevis', 'Ben Nevis', 'Ben Nevis (1345 m), in Scotland, is the highest mountain in the UK.'], ['snowdon', 'Yr Wyddfa (Snowdon)', 'Yr Wyddfa (Snowdon), 1085 m, is the highest mountain in Wales.'], ['scafell', 'Scafell Pike', 'Scafell Pike (978 m) in the Lake District is the highest mountain in England.']];
for (const [id, name, explain] of PEAKS) items.push(mapfact(`uk.p.${id}`, 'uk', 'uk', 'markers', id, name, explain, { choosePrompt: 'Which mountain is marked?', accept: id === 'snowdon' ? ['Snowdon', 'Yr Wyddfa'] : [], group: 'peak' }));
items.push(fact('uk.highest', 'uk', 'What is the highest mountain in the UK?', 'Ben Nevis', ['Scafell Pike', 'Snowdon', 'Slieve Donard'], 'Ben Nevis in the Scottish Highlands is 1345 m high.'));
items.push(mcq('uk.gb', 'uk', 'What is the difference between Great Britain and the United Kingdom?', [['The UK also includes Northern Ireland', true], ['They are exactly the same thing', false, 'Great Britain is an island. The UK is a country that also includes Northern Ireland.'], ['Great Britain includes Ireland; the UK does not', false, 'The Republic of Ireland is a separate country, not part of either.']], 'The UK = England + Scotland + Wales + Northern Ireland. Great Britain is the largest island: England, Scotland and Wales.'));

// Europe
for (const [id, name, capital, wrong, set] of EUROPE) {
  items.push(mapfact(`eu.${id.toLowerCase()}`, `europe-${set}`, 'europe', 'countries', id, name, `This is ${name}.`, { choosePrompt: 'Which country is highlighted?', accept: id === 'GBR' ? ['UK', 'Britain', 'Great Britain'] : id === 'CZE' ? ['Czech Republic'] : id === 'NLD' ? ['Holland', 'The Netherlands'] : [] }));
  items.push(fact(`cap.${id.toLowerCase()}`, `capitals-${set}`, `What is the capital of ${name}?`, capital, wrong, `The capital of ${name} is ${capital}.${CAPITAL_NOTES[id] ? ' ' + CAPITAL_NOTES[id] : ''}`, {
    map: 'europe', feature: id, fill: true, learn: `The capital of **${name}** is **${capital}**.${CAPITAL_NOTES[id] ? ' ' + CAPITAL_NOTES[id] : ''}`,
    accept: id === 'UKR' ? ['Kiev'] : id === 'MDA' ? ['Chisinau'] : id === 'ISL' ? ['Reykjavík'] : [],
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

export default [{ subject: 'geography', deck: 'core', topics, items }];

// Year 7 geography: map skills, physical processes, human geography and the wider world.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, labels, explain) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'order', prompt, items, labels, explain });
const choiceOnly = { formats: ['choice'] };

const topics = [
  { id: 'geography.map-skills', title: 'Map skills: grid references and compass points', kind: 'mixed', prereqs: [], batch: 5, intro: 'Ordnance Survey maps use a grid of numbered lines. Remember: along the corridor, then up the stairs.', teach: 'Explain how to give a 4-figure grid reference.', talk: 'On a walk, ask her which direction you’re heading using the 8 compass points.' },
  { id: 'geography.scale', title: 'Map scale and symbols', kind: 'mixed', prereqs: ['geography.map-skills'], batch: 5, intro: 'A map’s scale tells you how much smaller it is than real life. On a 1:25 000 map, 4 cm is 1 km.', teach: 'Explain what 1:25 000 means.', talk: 'Look at an OS map together and find a pub, a school and a church.' },
  { id: 'geography.rivers', title: 'Rivers: processes and landforms', kind: 'facts', prereqs: ['geography.weather'], batch: 5, diagnostic: ['geography.rv.d1'], intro: 'Rivers carve valleys, carry rocks to the sea and build new land. We’ll follow a river from its source to its mouth.', teach: 'Explain how a meander turns into an ox-bow lake.', talk: 'Next time you cross a river, ask her which course it might be in: upper, middle or lower.' },
  { id: 'geography.tectonics', title: 'Earth’s structure, earthquakes and volcanoes', kind: 'facts', prereqs: ['geography.continents'], batch: 5, diagnostic: ['geography.tc.d1', 'geography.tc.d2'], intro: 'The ground beneath us is moving, very slowly. Let’s find out what is inside the Earth and why volcanoes and earthquakes happen where they do.', teach: 'Explain what happens at a destructive plate boundary.', talk: 'Ask her why Iceland has so many volcanoes.' },
  { id: 'geography.biomes', title: 'Climate zones and biomes', kind: 'facts', prereqs: ['geography.lines'], batch: 5, diagnostic: ['geography.bi.d1'], intro: 'Why are there rainforests near the Equator and deserts a little further away? Climate decides which plants and animals live where.', teach: 'Explain why tropical rainforests are near the Equator.', talk: 'Ask her which biome the UK is in.' },
  { id: 'geography.people', title: 'Population, settlement and development', kind: 'facts', prereqs: ['geography.uk'], batch: 5, intro: 'Where do people live, and why? Why do people move? And how do we measure whether a country is rich or poor?', teach: 'Explain the difference between a push factor and a pull factor.', talk: 'Ask her why your town grew where it did.' },
  { id: 'geography.americas', title: 'The Americas: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, teach: 'Name three countries in South America and their capitals.', talk: 'Ask her the capital of Canada (it isn’t Toronto).' },
  { id: 'geography.africa', title: 'Africa: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, intro: 'Africa is a continent of 54 countries, not one country! Let’s learn some of the biggest.', teach: 'Explain why “Africa is a country” is a mistake.', talk: 'Ask her the capital of Nigeria (it isn’t Lagos).' },
  { id: 'geography.asia', title: 'Asia and Oceania: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, teach: 'Name the capitals of China, India and Japan.', talk: 'Ask her the capital of Australia (it isn’t Sydney).' },
];

const items = [
  // --- map skills
  { id: 'geography.ms.grid', topic: 'geography.map-skills', kind: 'template', gen: 'gridRef', levels: [1, 2, 3], seed: [-1, 0.3, 0] },
  order('ms.compass', 'map-skills', 'Put these compass points in order, going clockwise from north.', ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'], null, 'Clockwise: N, NE, E, SE, S, SW, W, NW. “Never Eat Shredded Wheat” helps with N, E, S, W.'),
  fact('ms.nnw', 'map-skills', 'Which compass point is halfway between north and north-west?', 'north-north-west', ['west-north-west', 'north-north-east', 'north-west'], 'With 16 points, the in-between points take the name of the nearest main point first: north-north-west (NNW).', choiceOnly),
  fact('ms.corridor', 'map-skills', 'When giving a grid reference, which do you read first?', 'eastings (along the corridor)', ['northings (up the stairs)', 'whichever is bigger', 'the square’s top-right corner'], 'Along the corridor (eastings), then up the stairs (northings).', choiceOnly),
  fact('ms.easting', 'map-skills', 'What are the vertical grid lines, numbered along the bottom of an OS map, called?', 'eastings', ['northings', 'contours', 'latitudes'], 'Eastings increase as you go east. Northings increase as you go north.'),

  // --- scale and symbols
  { id: 'geography.sc.scale', topic: 'geography.scale', kind: 'template', gen: 'mapScale', levels: [1, 2, 3], seed: [-0.5, 0, 0.8] },
  fact('sc.contour', 'scale', 'What do contour lines on a map join together?', 'places of the same height', ['places with the same rainfall', 'roads of the same size', 'towns of the same population'], 'Contour lines join points at the same height above sea level. Close together = steep slope.', choiceOnly),
  mcq('sc.steep', 'scale', 'On a map, contour lines are very close together. What does that tell you?', [['The land is steep', true], ['The land is flat', false, 'Flat land has contours far apart, or none at all.'], ['There is a river', false, 'Rivers are shown by blue lines, not contours.']], 'Close contours mean the height changes quickly over a short distance: a steep slope.'),
  fact('sc.ph', 'scale', 'On an Ordnance Survey map, what does “PH” stand for?', 'public house (pub)', ['public hospital', 'phone', 'park and hike'], 'PH marks a pub. “Sch” is a school.', choiceOnly),
  fact('sc.spot', 'scale', 'A black dot with a number next to it on an OS map is a…', 'spot height', ['bus stop', 'lighthouse', 'well'], 'A spot height shows the exact height in metres at that point.', choiceOnly),
  fact('sc.trig', 'scale', 'A blue triangle with a dot in the middle on an OS map marks a…', 'trig point', ['campsite', 'youth hostel', 'viewpoint'], 'Trig points are concrete pillars on hilltops once used for surveying.', choiceOnly),
  fact('sc.os', 'scale', 'Which organisation makes Britain’s official maps?', 'Ordnance Survey', ['the Met Office', 'the National Trust', 'English Heritage'], 'Ordnance Survey (OS) began in 1791, mapping the south coast in case of invasion.'),

  // --- rivers
  mcq('rv.d1', 'rivers', 'Where does a river usually flow fastest on average: near its source in the hills, or near its mouth?', [['Often near the mouth, where less energy is lost', true], ['Always near the source, because it is steepest', false, 'Mountain streams look fast because they splash over rocks, but friction slows them. Lower down, rivers are deeper and smoother, so the average speed is often higher.'], ['Rivers flow at the same speed everywhere', false, 'Speed changes along the course.']], 'This surprises most people! Steep upland streams lose lots of energy to friction. Downstream the channel is wider, deeper and smoother.'),
  fact('rv.source', 'rivers', 'What is the start of a river called?', 'the source', ['the mouth', 'the confluence', 'the estuary'], 'The source is often a spring or a bog in the hills.', { accept: ['source'] }),
  fact('rv.mouth', 'rivers', 'Where a river meets the sea is called its…', 'mouth', ['source', 'tributary', 'watershed'], 'The mouth is where the river ends, at the sea or a lake.'),
  fact('rv.tributary', 'rivers', 'A smaller river that joins a bigger one is called a…', 'tributary', ['confluence', 'meander', 'delta'], 'Tributaries join the main river at a confluence.'),
  fact('rv.confluence', 'rivers', 'The place where two rivers meet is called a…', 'confluence', ['tributary', 'source', 'levee'], 'Many towns grew at confluences, such as Pittsburgh, or Koblenz on the Rhine and Moselle.'),
  fact('rv.basin', 'rivers', 'The area of land drained by a river and its tributaries is called a…', 'drainage basin', ['floodplain', 'watershed', 'valley'], 'The edge of a drainage basin, usually high ground, is the watershed.'),
  fact('rv.hydraulic', 'rivers', 'Which type of erosion is the sheer force of water forcing air into cracks in the riverbank?', 'hydraulic action', ['abrasion', 'attrition', 'solution'], 'Hydraulic action: the force of water. Abrasion: rocks scraping the bed. Attrition: rocks knocking each other smaller. Solution: dissolving rock.'),
  fact('rv.attrition', 'rivers', 'Which process makes stones smaller and rounder as they knock into each other?', 'attrition', ['abrasion', 'hydraulic action', 'deposition'], 'That is why stones near a river’s mouth are small and smooth.'),
  fact('rv.saltation', 'rivers', 'Pebbles bouncing along a river bed are being transported by…', 'saltation', ['traction', 'suspension', 'solution'], 'Traction: big boulders rolled. Saltation: pebbles bounced. Suspension: fine silt carried in the water. Solution: dissolved minerals.'),
  fact('rv.vvalley', 'rivers', 'What shape of valley does a river make in its upper course?', 'V-shaped', ['U-shaped', 'flat and wide', 'circular'], 'In the upper course the river cuts downwards, making steep V-shaped valleys with interlocking spurs. (U-shaped valleys are made by glaciers.)', choiceOnly),
  fact('rv.oxbow', 'rivers', 'A meander that has been cut off from the river forms…', 'an ox-bow lake', ['a waterfall', 'a delta', 'a gorge'], 'Erosion narrows the neck of a meander until the river cuts through, and deposition seals off the old loop.', { accept: ['ox-bow lake', 'oxbow lake', 'an oxbow lake'] }),
  fact('rv.waterfall', 'rivers', 'A waterfall forms where a river flows over hard rock lying on top of…', 'softer rock', ['ice', 'sand only', 'harder rock'], 'The soft rock erodes faster, undercutting the hard rock, which collapses. The waterfall moves upstream, leaving a gorge.', choiceOnly),
  fact('rv.floodplain', 'rivers', 'The flat land beside a river in its lower course, which floods, is called the…', 'floodplain', ['watershed', 'source', 'interlocking spur'], 'Each flood deposits silt, making floodplains very fertile.'),
  fact('rv.nile', 'rivers', 'Which is usually called the longest river in the world?', 'the Nile', ['the Amazon', 'the Thames', 'the Mississippi'], 'The Nile (about 6650 km) is usually listed as longest; some measurements give the Amazon. The Amazon carries far more water than any other river.', { accept: ['nile'] }),
  order('rv.course', 'rivers', 'Put these river features in the order you would usually meet them, from source to mouth.', ['waterfall', 'meander', 'ox-bow lake', 'estuary'], null, 'Waterfalls in the upper course; meanders in the middle course; ox-bow lakes on the floodplain; the estuary at the mouth.'),

  // --- tectonics
  mcq('tc.d1', 'tectonics', 'What is the Earth’s mantle mostly made of?', [['Solid rock that slowly flows', true], ['A deep sea of liquid lava', false, 'A very common idea! The mantle is mostly solid, but hot enough to flow like extremely thick toffee over millions of years.'], ['Hot water and steam under pressure', false, 'The mantle is rock, not water.']], 'Magma forms only where rock partly melts, for example where plates move apart or one sinks under another.'),
  mcq('tc.d2', 'tectonics', 'How fast do tectonic plates move?', [['A few centimetres a year', true], ['Several metres a day', false, 'Much slower than that: centimetres per year.'], ['They don’t move at all any more', false, 'They do move, and GPS can measure it.']], 'A few cm a year adds up: over 200 million years the Atlantic Ocean opened up.'),
  order('tc.layers', 'tectonics', 'Put the layers of the Earth in order, from the outside in.', ['crust', 'mantle', 'outer core', 'inner core'], ['thin, rocky', 'hot, slowly flowing rock', 'liquid iron and nickel', 'solid iron and nickel'], 'Crust, mantle, outer core (liquid), inner core (solid, about 5400°C).'),
  fact('tc.core', 'tectonics', 'Which layer of the Earth is solid iron and nickel, as hot as the surface of the Sun?', 'the inner core', ['the crust', 'the mantle', 'the outer core'], 'The inner core is solid because the pressure is so great, even though it is around 5400°C.', { accept: ['inner core'] }),
  fact('tc.constructive', 'tectonics', 'At what kind of plate boundary do plates move APART, letting magma rise?', 'constructive', ['destructive', 'conservative', 'collision'], 'Constructive boundaries make new crust, as at the Mid-Atlantic Ridge through Iceland.'),
  fact('tc.destructive', 'tectonics', 'At what kind of boundary does an ocean plate sink beneath a continental plate?', 'destructive', ['constructive', 'conservative', 'stationary'], 'Destructive boundaries cause violent volcanoes and earthquakes, as in the Andes and Japan.'),
  fact('tc.conservative', 'tectonics', 'At which kind of boundary do plates slide past each other, causing earthquakes but no volcanoes?', 'conservative', ['constructive', 'destructive', 'divergent'], 'The San Andreas Fault in California is a conservative boundary.'),
  fact('tc.epicentre', 'tectonics', 'The point on the Earth’s surface directly above where an earthquake starts is the…', 'epicentre', ['focus', 'crater', 'fault'], 'The focus is underground, where the rocks slip. The epicentre is the point on the surface above it.'),
  fact('tc.seismometer', 'tectonics', 'Which instrument measures earthquakes?', 'a seismometer', ['a barometer', 'a thermometer', 'an anemometer'], 'Seismometers record ground shaking. A barometer measures air pressure; an anemometer measures wind speed.', { accept: ['seismometer', 'seismograph', 'a seismograph'] }),
  fact('tc.lava', 'tectonics', 'Molten rock underground is called magma. What is it called when it reaches the surface?', 'lava', ['ash', 'pumice', 'crust'], 'Magma underground; lava above ground.'),
  fact('tc.ring', 'tectonics', 'What is the name for the zone of volcanoes and earthquakes around the edge of the Pacific Ocean?', 'the Ring of Fire', ['the Mid-Atlantic Ridge', 'the Great Rift Valley', 'the Pacific Belt'], 'About three-quarters of the world’s active volcanoes lie around the Pacific.', { accept: ['ring of fire'] }),
  fact('tc.pangaea', 'tectonics', 'What was the name of the supercontinent that existed about 300 million years ago?', 'Pangaea', ['Atlantis', 'Gondwana only', 'Laurasia only'], 'Alfred Wegener proposed in 1912 that the continents had once been joined in Pangaea. Few believed him until the 1960s.', { accept: ['pangea'] }),
  fact('tc.pompeii', 'tectonics', 'Which Roman town was buried by the eruption of Vesuvius in AD 79?', 'Pompeii', ['Rome', 'Athens', 'Carthage'], 'Ash preserved Pompeii so well that we can still walk its streets.'),

  // --- biomes
  mcq('bi.d1', 'biomes', 'Which of these is the largest desert in the world?', [['Antarctica', true], ['The Sahara', false, 'The Sahara is the largest HOT desert. A desert is defined by low rainfall, not heat, and Antarctica gets very little.'], ['The Gobi', false, 'The Gobi is large, but smaller than both Antarctica and the Sahara.']], 'Deserts get less than about 250 mm of precipitation a year. Antarctica qualifies, and it is huge.'),
  fact('bi.rainforest', 'biomes', 'Which biome, near the Equator, is hot and wet all year with the most species on land?', 'tropical rainforest', ['hot desert', 'temperate forest', 'tropical grassland'], 'Tropical rainforests like the Amazon get over 2000 mm of rain a year and stay hot because the Sun is high all year.', { accept: ['rainforest', 'tropical rainforest'] }),
  order('bi.layers', 'biomes', 'Put the layers of a rainforest in order, from the top down.', ['emergent', 'canopy', 'understorey', 'forest floor'], null, 'Emergent trees poke above the canopy; the canopy is a thick roof of leaves; the understorey is dim; the forest floor gets only about 2% of the sunlight.'),
  fact('bi.sahara', 'biomes', 'What is the largest hot desert in the world?', 'the Sahara', ['the Kalahari', 'the Atacama', 'the Gobi'], 'The Sahara covers much of North Africa, about the size of the USA.', { accept: ['sahara'] }),
  fact('bi.why-desert', 'biomes', 'Hot deserts are found about 30° north and south of the Equator. Why?', 'dry air sinks there', ['they are closest to the Sun', 'the oceans are colder there', 'there are no rivers or lakes'], 'Air rises at the Equator, drops its rain, then sinks around 30°, warming and drying as it falls.', choiceOnly),
  fact('bi.tundra', 'biomes', 'Which cold, treeless biome near the Arctic has ground frozen all year beneath the surface?', 'tundra', ['taiga', 'savanna', 'steppe'], 'The frozen ground in the tundra is called permafrost.'),
  fact('bi.taiga', 'biomes', 'Which biome of evergreen conifer forests stretches across Canada, Scandinavia and Russia?', 'taiga (boreal forest)', ['tundra', 'temperate deciduous forest', 'savanna'], 'The taiga is the largest land biome in the world.', choiceOnly),
  fact('bi.savanna', 'biomes', 'Which tropical grassland with scattered trees, wet and dry seasons, is home to lions and zebras?', 'savanna', ['tundra', 'rainforest', 'taiga'], 'Savannas lie between rainforests and deserts, as in East Africa.', { accept: ['savannah'] }),
  fact('bi.uk', 'biomes', 'The UK’s natural biome, before people cleared most of it, is…', 'temperate deciduous forest', ['tropical rainforest', 'taiga', 'savanna'], 'Deciduous trees like oak and beech lose their leaves in winter.', choiceOnly),
  fact('bi.drift', 'biomes', 'Which warm ocean current keeps the UK milder than other places as far north?', 'the North Atlantic Drift', ['the Humboldt Current', 'the Agulhas Current', 'the Labrador Current'], 'Without it, UK winters would be much colder, more like Canada’s at the same latitude.', choiceOnly),
  fact('bi.wind', 'biomes', 'From which direction does the UK’s most common (prevailing) wind blow?', 'south-west', ['north-east', 'south-east', 'north'], 'South-westerly winds bring mild, wet air from the Atlantic, which is why the west of the UK is wetter.'),

  // --- people
  order('pp.hierarchy', 'people', 'Put these settlements in order, smallest first.', ['hamlet', 'village', 'town', 'city', 'conurbation'], null, 'A conurbation is where towns and cities have grown together, like Greater Manchester.'),
  fact('pp.megacity', 'people', 'A city with more than 10 million people is called a…', 'megacity', ['conurbation', 'capital', 'metropolis only'], 'Tokyo, Delhi and Shanghai are megacities. London has about 9 million people.', { accept: ['megacity', 'mega city'] }),
  fact('pp.bridging', 'people', 'A settlement that grew up where a river could be crossed has what kind of site?', 'a bridging point', ['a wet point', 'a defensive site', 'a gap town'], 'Many towns ending in “-ford” grew at river crossings, such as Oxford.', choiceOnly),
  fact('pp.wetpoint', 'people', 'A settlement built near a reliable water supply such as a spring has a…', 'wet point site', ['dry point site', 'bridging point', 'route centre'], 'Before taps, water was vital. A dry point site, on the other hand, avoids flooding.', choiceOnly),
  fact('pp.push', 'people', 'A reason that makes people want to LEAVE a place is called a…', 'push factor', ['pull factor', 'migration', 'development'], 'Push factors: war, few jobs, drought. Pull factors attract people: jobs, safety, family.', { accept: ['push factor', 'a push factor', 'push'] }),
  fact('pp.urban', 'people', 'The growth in the proportion of people living in towns and cities is called…', 'urbanisation', ['migration', 'counter-urbanisation', 'globalisation'], 'Over half the world’s people now live in urban areas.', { accept: ['urbanization'] }),
  fact('pp.population', 'people', 'Roughly how many people live in the world (2020s)?', 'about 8 billion', ['about 800 million', 'about 80 billion', 'about 2 billion'], 'World population passed 8 billion in November 2022.', choiceOnly),
  fact('pp.populous', 'people', 'Which country has the most people (since 2023)?', 'India', ['China', 'USA', 'Indonesia'], 'India overtook China in 2023, with over 1.4 billion people.'),
  mcq('pp.development', 'people', 'Which of these is the best single measure of how developed a country is?', [['None is perfect: combine several measures', true], ['How many tall buildings its capital has', false, 'Buildings don’t tell you about most people’s lives.'], ['How big the country is in area', false, 'Size has little to do with development.']], 'Measures like GDP per person, life expectancy and literacy are combined in the Human Development Index (HDI).'),
  fact('pp.life', 'people', 'The average number of years a person in a country can expect to live is called…', 'life expectancy', ['birth rate', 'literacy rate', 'GDP'], 'Life expectancy is around 81 years in the UK.'),
];

// The wider world: [ISO id, country, capital, capital distractors (misconceptions first), topic, note]
const WORLD = [
  ['USA', 'United States', 'Washington, D.C.', ['New York', 'Los Angeles'], 'americas', 'Not New York!'],
  ['CAN', 'Canada', 'Ottawa', ['Toronto', 'Vancouver'], 'americas', 'Ottawa, not Toronto or Vancouver.'],
  ['MEX', 'Mexico', 'Mexico City', ['Cancún', 'Guadalajara'], 'americas', ''],
  ['BRA', 'Brazil', 'Brasília', ['Rio de Janeiro', 'São Paulo'], 'americas', 'Brasília was built as a new capital in 1960.'],
  ['ARG', 'Argentina', 'Buenos Aires', ['Santiago', 'Montevideo'], 'americas', ''],
  ['CHL', 'Chile', 'Santiago', ['Buenos Aires', 'Lima'], 'americas', ''],
  ['PER', 'Peru', 'Lima', ['Cusco', 'Quito'], 'americas', ''],
  ['COL', 'Colombia', 'Bogotá', ['Medellín', 'Caracas'], 'americas', ''],
  ['VEN', 'Venezuela', 'Caracas', ['Bogotá', 'Quito'], 'americas', ''],
  ['CUB', 'Cuba', 'Havana', ['Kingston', 'Santo Domingo'], 'americas', ''],
  ['EGY', 'Egypt', 'Cairo', ['Alexandria', 'Luxor'], 'africa', ''],
  ['NGA', 'Nigeria', 'Abuja', ['Lagos', 'Accra'], 'africa', 'Abuja, not Lagos, which is the biggest city.'],
  ['KEN', 'Kenya', 'Nairobi', ['Mombasa', 'Addis Ababa'], 'africa', ''],
  ['ETH', 'Ethiopia', 'Addis Ababa', ['Nairobi', 'Khartoum'], 'africa', ''],
  ['MAR', 'Morocco', 'Rabat', ['Casablanca', 'Marrakesh'], 'africa', 'Rabat, not Casablanca or Marrakesh.'],
  ['GHA', 'Ghana', 'Accra', ['Lagos', 'Kumasi'], 'africa', ''],
  ['COD', 'Democratic Republic of the Congo', 'Kinshasa', ['Brazzaville', 'Lagos'], 'africa', ''],
  ['ZAF', 'South Africa', 'Pretoria', ['Johannesburg', 'Durban'], 'africa', 'South Africa has three capitals: Pretoria (government), Cape Town (parliament) and Bloemfontein (courts).'],
  ['CHN', 'China', 'Beijing', ['Shanghai', 'Hong Kong'], 'asia', ''],
  ['IND', 'India', 'New Delhi', ['Mumbai', 'Kolkata'], 'asia', ''],
  ['JPN', 'Japan', 'Tokyo', ['Kyoto', 'Osaka'], 'asia', ''],
  ['KOR', 'South Korea', 'Seoul', ['Busan', 'Pyongyang'], 'asia', ''],
  ['PAK', 'Pakistan', 'Islamabad', ['Karachi', 'Lahore'], 'asia', 'Islamabad, not Karachi.'],
  ['BGD', 'Bangladesh', 'Dhaka', ['Kolkata', 'Chittagong'], 'asia', ''],
  ['SAU', 'Saudi Arabia', 'Riyadh', ['Mecca', 'Jeddah'], 'asia', ''],
  ['TUR', 'Turkey', 'Ankara', ['Istanbul', 'Izmir'], 'asia', 'Ankara, not Istanbul.'],
  ['IRN', 'Iran', 'Tehran', ['Baghdad', 'Isfahan'], 'asia', ''],
  ['VNM', 'Vietnam', 'Hanoi', ['Ho Chi Minh City', 'Bangkok'], 'asia', ''],
  ['THA', 'Thailand', 'Bangkok', ['Phuket', 'Hanoi'], 'asia', ''],
  ['AUS', 'Australia', 'Canberra', ['Sydney', 'Melbourne'], 'asia', 'Canberra, not Sydney: it was built as a compromise between Sydney and Melbourne.'],
  ['NZL', 'New Zealand', 'Wellington', ['Auckland', 'Christchurch'], 'asia', 'Wellington, not Auckland.'],
];
const ZOOM = { americas: ['North America', 'South America'], africa: ['Africa'], asia: ['Asia', 'Oceania'] };
const ACCEPT_CAP = { USA: ['Washington', 'Washington DC'], BRA: ['Brasilia'], COL: ['Bogota'], IND: ['Delhi'], ZAF: ['Cape Town', 'Bloemfontein'] };
const ACCEPT_NAME = { USA: ['USA', 'United States of America', 'America', 'the US'], COD: ['DR Congo', 'DRC', 'Congo'] };

for (const [id, name, capital, wrong, topic, note] of WORLD) {
  items.push({ id: `geography.w.${id.toLowerCase()}`, topic: `geography.${topic}`, kind: 'mapfact', map: 'world', layer: 'countries', feature: id, zoom: ZOOM[topic], answer: name, accept: ACCEPT_NAME[id] || [], choosePrompt: 'Which country is highlighted?', explain: `This is ${name}.` });
  items.push(fact(`wc.${id.toLowerCase()}`, topic, `What is the capital of ${name}?`, capital, wrong, `The capital of ${name} is ${capital}.${note ? ' ' + note : ''}`, {
    map: 'world', layer: 'countries', feature: id, zoom: ZOOM[topic], fill: true, accept: ACCEPT_CAP[id] || [],
    learn: `The capital of **${name}** is **${capital}**.${note ? ' ' + note : ''}`,
  }));
}

export default [{ subject: 'geography', deck: 'year7', topics, items }];

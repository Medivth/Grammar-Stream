// Year 7 geography: map skills, physical processes, human geography and the wider world.
import { the } from './names.mjs';

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, labels, explain) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'order', prompt, items, labels, explain });
const choiceOnly = { formats: ['choice'] };

const topics = [
  { id: 'geography.map-skills', title: 'Map skills: grid references and compass points', kind: 'mixed', prereqs: [], batch: 5, intro: 'Ordnance Survey maps use a grid of numbered lines. Remember: along the corridor, then up the stairs.', hook: '“Never Eat Shredded Wheat” for the compass; “along the corridor, then up the stairs” for grid references.', teach: 'Explain how to give a 4-figure grid reference.', talk: 'On a walk, ask her which direction you’re heading using the 8 compass points.' },
  { id: 'geography.scale', title: 'Map scale and symbols', kind: 'mixed', prereqs: ['geography.map-skills'], batch: 5, intro: 'A map’s scale tells you how much smaller it is than real life. On a 1:25 000 map, 4 cm is 1 km.', hook: 'On a 1:25 000 map, 4 cm = 1 km; on a 1:50 000 map, 2 cm = 1 km.', teach: 'Explain what 1:25 000 means.', talk: 'Look at an OS map together and find a pub, a school and a church.' },
  { id: 'geography.rivers', title: 'Rivers: processes and landforms', kind: 'facts', prereqs: ['geography.weather'], batch: 5, diagnostic: ['geography.rv.d1'], intro: 'Rivers carve valleys, carry rocks to the sea and build new land. We’ll follow a river from its source to its mouth.', hook: 'Source to sea: V-shaped valleys and waterfalls up high, meanders in the middle, floodplains and an estuary near the mouth.', teach: 'Explain how a meander turns into an ox-bow lake.', talk: 'Next time you cross a river, ask her which course it might be in: upper, middle or lower.' },
  { id: 'geography.tectonics', title: 'Earth’s structure, earthquakes and volcanoes', kind: 'facts', prereqs: ['geography.continents'], batch: 5, diagnostic: ['geography.tc.d1', 'geography.tc.d2'], intro: 'The ground beneath us is moving, very slowly. Let’s find out what is inside the Earth and why volcanoes and earthquakes happen where they do.', hook: 'The Earth is like a peach: thin skin (crust), thick flesh (mantle) and a hard stone in the middle (core).', teach: 'Explain what happens at a destructive plate boundary.', talk: 'Ask her why Iceland has so many volcanoes.' },
  { id: 'geography.biomes', title: 'Climate zones and biomes', kind: 'facts', prereqs: ['geography.lines'], batch: 5, diagnostic: ['geography.bi.d1'], intro: 'Why are there rainforests near the Equator and deserts a little further away? Climate decides which plants and animals live where.', hook: 'Wet at 0°, dry at 30°: rainforests hug the Equator and hot deserts lie near the tropics.', teach: 'Explain why tropical rainforests are near the Equator.', talk: 'Ask her which biome the UK is in.' },
  { id: 'geography.people', title: 'Population, settlement and development', kind: 'facts', prereqs: ['geography.uk'], batch: 5, intro: 'Where do people live, and why? Why do people move? And how do we measure whether a country is rich or poor?', hook: 'Settlements grew where life was easier: by water (wet point), at a crossing (bridging point) or somewhere safe (defensive site).', teach: 'Explain the difference between a push factor and a pull factor.', talk: 'Ask her why your town grew where it did.' },
  { id: 'geography.americas', title: 'The Americas: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, hook: 'Capitals are often not the biggest city: Washington, Ottawa and Brasília, not New York, Toronto and São Paulo.', teach: 'Name three countries in South America and their capitals.', talk: 'Ask her the capital of Canada (it isn’t Toronto).' },
  { id: 'geography.africa', title: 'Africa: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, intro: 'Africa is a continent of 54 countries, not one country! Let’s learn some of the biggest.', hook: 'Africa is 54 countries, not one, and Nigeria’s capital is Abuja, not Lagos.', teach: 'Explain why “Africa is a country” is a mistake.', talk: 'Ask her the capital of Nigeria (it isn’t Lagos).' },
  { id: 'geography.asia', title: 'Asia and Oceania: countries and capitals', kind: 'facts', prereqs: ['geography.continents'], batch: 6, hook: 'Sydney and Melbourne were rivals, so Australia built a brand-new capital between them: Canberra.', teach: 'Name the capitals of China, India and Japan.', talk: 'Ask her the capital of Australia (it isn’t Sydney).' },
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
  fact('rv.basin', 'rivers', 'The area of land drained by a river and its tributaries is called a…', 'drainage basin', ['floodplain', 'estuary', 'valley'], 'The edge of a drainage basin, usually high ground, is the watershed.'),
  fact('rv.hydraulic', 'rivers', 'Which type of erosion is the sheer force of water forcing air into cracks in the riverbank?', 'hydraulic action', ['abrasion', 'attrition', 'solution'], 'Hydraulic action: the force of water. Abrasion: rocks scraping the bed. Attrition: rocks knocking each other smaller. Solution: dissolving rock.'),
  fact('rv.attrition', 'rivers', 'Which process makes stones smaller and rounder as they knock into each other?', 'attrition', ['abrasion', 'hydraulic action', 'deposition'], 'That is why stones near a river’s mouth are small and smooth.'),
  fact('rv.saltation', 'rivers', 'Pebbles bouncing along a river bed are being transported by…', 'saltation', ['traction', 'suspension', 'solution'], 'Traction: big boulders rolled. Saltation: pebbles bounced. Suspension: fine silt carried in the water. Solution: dissolved minerals.'),
  fact('rv.vvalley', 'rivers', 'What shape of valley does a river make in its upper course?', 'V-shaped', ['U-shaped', 'flat and wide', 'circular'], 'In the upper course the river cuts downwards, making steep V-shaped valleys with interlocking spurs. (U-shaped valleys are made by glaciers.)', choiceOnly),
  fact('rv.oxbow', 'rivers', 'A meander that has been cut off from the river forms…', 'an ox-bow lake', ['a waterfall', 'a delta', 'a gorge'], 'Erosion narrows the neck of a meander until the river cuts through, and deposition seals off the old loop.', { accept: ['ox-bow lake', 'oxbow lake', 'an oxbow lake'] }),
  fact('rv.waterfall', 'rivers', 'A waterfall forms where a river flows over hard rock lying on top of…', 'softer rock', ['ice', 'sand only', 'harder rock'], 'The soft rock erodes faster, undercutting the hard rock, which collapses. The waterfall moves upstream, leaving a gorge.', choiceOnly),
  fact('rv.floodplain', 'rivers', 'The flat land beside a river in its lower course, which floods, is called the…', 'floodplain', ['watershed', 'source', 'interlocking spur'], 'Each flood deposits silt, making floodplains very fertile.'),
  fact('rv.nile', 'rivers', 'Which river is usually listed as the longest in the world?', 'the Nile', ['the Yangtze', 'the Thames', 'the Mississippi'], 'The Nile, about 6,650 km, is usually listed as the longest. Some scientists measure the Amazon as slightly longer, so the two are close rivals; the Amazon carries far more water than any other river.', { accept: ['nile', 'river nile', 'the river nile'] }),
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
const ACCEPT_NAME = { USA: ['USA', 'United States of America', 'America', 'the US'], COD: ['DR Congo', 'DRC', 'Democratic Republic of Congo'] };

for (const [id, name, capital, wrong, topic, note] of WORLD) {
  items.push({ id: `geography.w.${id.toLowerCase()}`, topic: `geography.${topic}`, kind: 'mapfact', map: 'world', layer: 'countries', feature: id, zoom: ZOOM[topic], answer: name, accept: ACCEPT_NAME[id] || [], choosePrompt: 'Which country is highlighted?', explain: `This is ${the(name)}.` });
  items.push(fact(`wc.${id.toLowerCase()}`, topic, `What is the capital of ${the(name)}?`, capital, wrong, `The capital of ${the(name)} is ${capital.replace(/\.$/, '')}.${note ? ' ' + note : ''}`, {
    map: 'world', layer: 'countries', feature: id, zoom: ZOOM[topic], fill: true, accept: ACCEPT_CAP[id] || [],
    learn: `The capital of **${the(name)}** is **${capital}**.${note ? ' ' + note : ''}`,
  }));
}

// Memory hooks (mnemonics) and real-world examples, keyed by item id. Shown on the learn card and after a wrong answer.
const SOURCE_MOUTH = 'Source = Start; Mouth = where it Meets the sea.';
const MEMORY = {
  // map skills
  'ms.grid': { hook: 'Along the corridor, then up the stairs: read the eastings first, then the northings.' },
  'ms.compass': { hook: '“Never Eat Shredded Wheat”: N, E, S, W clockwise. The in-between points join their neighbours: NE, SE, SW, NW.', example: 'The Sun rises roughly in the east and sets roughly in the west, so you can use it to find your bearings.' },
  'ms.nnw': { hook: 'Say the nearest main point first: north + north-west makes north-north-west.' },
  'ms.corridor': { hook: 'You have to walk along the corridor before you can go up the stairs: eastings, then northings.' },
  'ms.easting': { hook: 'Eastings count up as you go East; Northings count up as you go North.' },

  // scale and symbols
  'sc.scale': { hook: '1:25 000 means 1 cm on the map is 25 000 cm (250 m) in real life, so 4 cm = 1 km.', example: 'Orange OS Explorer maps are 1:25 000; pink OS Landranger maps are 1:50 000.' },
  'sc.contour': { hook: 'Contours are like the rings left round a bath as it drains: one line for each height.', example: 'On an OS map of Ben Nevis, the contours crowd together on its steep north face.' },
  'sc.steep': { hook: 'Lines close together: a hill to climb. Lines far apart: an easy walk.', example: 'Stanage Edge, a gritstone cliff in the Peak District, shows up as tightly packed contours on an OS map.' },
  'sc.ph': { hook: '“Pub” is short for “public house”: PH.' },
  'sc.spot': { hook: 'A spot height is a single spot (dot) with its height in metres beside it.' },
  'sc.trig': { example: 'There are trig points on the summits of Ben Nevis, Yr Wyddfa and Scafell Pike; walkers like to touch them at the top.' },
  'sc.os': { hook: '“Ordnance” means military supplies: the Army’s Board of Ordnance made the first maps.', example: 'The first OS map, published in 1801, was of Kent.' },

  // rivers
  'rv.d1': { hook: 'Smooth is speedy: rocks and shallow water slow mountain streams down with friction.' },
  'rv.source': { hook: SOURCE_MOUTH, example: 'The Thames begins at a stone marking its source in a field near Kemble, Gloucestershire.' },
  'rv.mouth': { hook: SOURCE_MOUTH, example: 'The Thames’s mouth is a wide estuary that meets the North Sea near Southend-on-Sea.' },
  'rv.tributary': { hook: 'A tributary pays tribute: it gives its water to the main river.', example: 'The River Kennet is a tributary of the Thames, joining it at Reading.' },
  'rv.confluence': { hook: 'Con = together, fluence = flowing: two rivers flowing together.', example: 'In York, the River Foss flows into the River Ouse.' },
  'rv.basin': { hook: 'Like a bathroom basin: all the water inside the rim drains to one plughole.', example: 'Rain falling on Oxford, Reading or London all drains into the Thames basin.' },
  'rv.hydraulic': { hook: 'HAAS: Hydraulic action, Abrasion, Attrition, Solution, the four ways rivers erode.', example: 'Like a jet wash blasting a patio, the sheer force of the water does the work.' },
  'rv.attrition': { hook: 'Attrition: rocks attack each other. Abrasion: rocks attack the bed and banks.', example: 'Stones near a river’s mouth are small and smooth; boulders in mountain streams are big and jagged.' },
  'rv.saltation': { hook: 'Saltation comes from the Latin for “leap”: pebbles hop. Boulders roll, silt floats, minerals dissolve.' },
  'rv.vvalley': { hook: 'V for vertical: rivers cut down into a V. Glaciers gouge out a U.', example: 'Fast mountain streams in the Lake District and Snowdonia have cut steep-sided V-shaped valleys into the hills.' },
  'rv.oxbow': { hook: 'An ox-bow is the U-shaped collar of an ox’s yoke: a curved loop left behind.', example: 'The Severn winds in great meanders around Shrewsbury; the Mississippi’s floodplain is dotted with ox-bow lakes.' },
  'rv.waterfall': { hook: 'Hard on top, soft below: the soft rock is undercut, the hard ledge snaps off and the falls step back.', example: 'High Force on the River Tees pours over hard whinstone sitting on softer limestone and shale.' },
  'rv.floodplain': { hook: 'The floodplain is the plain that floods, and every flood leaves fertile silt behind.', example: 'Tewkesbury, where the Avon meets the Severn, was badly flooded in 2007.' },
  'rv.nile': { hook: 'The Nile is number one for length; the Amazon is number one for water.', example: 'The Blue and White Niles meet at Khartoum, then the Nile flows north through Egypt past the pyramids.' },
  'rv.course': { hook: 'Up high it falls, in the middle it bends, low down it loops and leaves lakes, then it widens to the sea.', example: 'On the Tees: High Force up high, a meander wrapped round Yarm, then the estuary at Middlesbrough.' },

  // tectonics
  'tc.d1': { hook: 'The mantle is thick toffee, not soup: solid rock that creeps very slowly.' },
  'tc.d2': { hook: 'Plates move about as fast as your fingernails grow.', example: 'The Atlantic widens by a few centimetres a year, nudging Britain and North America apart.' },
  'tc.layers': { hook: 'Like a peach: skin (crust), flesh (mantle) and a stone (core) in two parts, liquid outside and solid inside.', example: 'Compared with the whole Earth, the crust is about as thin as the skin on an apple.' },
  'tc.core': { hook: 'Squeezed so hard it cannot melt: the inner core stays solid even at about 5400°C.' },
  'tc.constructive': { hook: 'Constructive: constructing new crust as the plates pull apart.', example: 'At Þingvellir in Iceland you can walk in the rift between the North American and Eurasian plates.' },
  'tc.destructive': { hook: 'Destructive: the ocean plate is destroyed as it sinks and melts.', example: 'Mount Fuji in Japan and the volcanoes of the Andes sit above destructive boundaries.' },
  'tc.conservative': { hook: 'Conservative: crust is conserved, neither made nor destroyed; the plates just slide.', example: 'San Francisco lies beside the San Andreas Fault and was wrecked by an earthquake in 1906.' },
  'tc.epicentre': { hook: 'Epi means “on top of” in Greek: the epicentre is on top of the focus.' },
  'tc.seismometer': { hook: 'Seismos is Greek for “earthquake”: a seismometer measures the shaking.', example: 'The British Geological Survey records a few hundred earthquakes in the UK each year, mostly too small to feel.' },
  'tc.lava': { hook: 'Magma is in the Middle (underground); Lava has Left the volcano.', example: 'Etna in Sicily and Kīlauea in Hawaii often send out rivers of glowing lava.' },
  'tc.ring': { hook: 'Picture a ring of fire round the Pacific: Japan, Indonesia, New Zealand, the Andes and Alaska.', example: 'Mount St Helens (USA, 1980) and Mount Fuji (Japan) are both on the Ring of Fire.' },
  'tc.pangaea': { hook: 'Pangaea is Greek for “all lands”: every continent joined into one.', example: 'On a map, the bulge of Brazil fits into the curve of West Africa like a jigsaw piece.' },
  'tc.pompeii': { hook: 'Pompeii was Preserved: ash buried it so fast that it was frozen in time.', example: 'Vesuvius still towers over Naples and is one of the most closely watched volcanoes in the world.' },

  // biomes
  'bi.d1': { hook: 'A desert is dry, not necessarily hot: Antarctica is the biggest desert of all.' },
  'bi.rainforest': { hook: 'Hot and wet every day: near the Equator it rains most afternoons.', example: 'You can walk through an indoor rainforest at the Eden Project in Cornwall; the real giant is the Amazon.' },
  'bi.layers': { hook: '“Every Cheeky Uncle Falls”: Emergent, Canopy, Understorey, Floor. Think eagles, monkeys, jaguars, ants.' },
  'bi.sahara': { hook: 'Sahara means “desert” in Arabic, so “Sahara Desert” really means “Desert Desert”!', example: 'Saharan dust sometimes blows all the way to the UK and leaves an orange film on cars.' },
  'bi.why-desert': { hook: 'Air rises wet at 0° and sinks dry at 30°.', example: 'The Sahara, the Arabian Desert and the Australian deserts all lie near the tropics.' },
  'bi.tundra': { hook: 'Tundra is too cold for trees; permafrost is PERMAnently FROzen ground.', example: 'Reindeer, Arctic foxes and snowy owls live on the tundra of northern Canada, Alaska and Siberia.' },
  'bi.taiga': { hook: 'Taiga = trees (conifers); tundra = too cold for trees.', example: 'Endless spruce and pine forests across Siberia and Canada are home to moose, wolves and bears.' },
  'bi.savanna': { hook: 'Picture an African plain: golden grass, flat-topped acacia trees, a wet season and a dry season.', example: 'In the Serengeti, in Tanzania, more than a million wildebeest migrate across the savanna each year.' },
  'bi.uk': { hook: 'Deciduous comes from the Latin for “falling off”: the leaves drop each autumn.', example: 'Sherwood Forest and the New Forest are survivors of the oak woods that once covered much of Britain.' },
  'bi.drift': { hook: 'The North Atlantic Drift is the UK’s central heating.', example: 'Thanks to it, palm-like plants grow in Cornwall and subtropical gardens thrive at Inverewe in north-west Scotland.' },
  'bi.wind': { hook: 'South-west winds make the west wet.', example: 'Seathwaite in the Lake District gets over 3 m of rain a year; London gets about 0.6 m.' },

  // people
  'pp.hierarchy': { hook: '“Happy Villagers Take City Coaches”: hamlet, village, town, city, conurbation.', example: 'Greater Manchester is a conurbation: Manchester, Salford, Bolton, Stockport and more grew into one.' },
  'pp.megacity': { hook: 'Mega means “great”: a megacity has more than 10 million people.', example: 'Jakarta, Dhaka and Tokyo are among the world’s biggest megacities, each with over 30 million people: more than three times London.' },
  'pp.bridging': { hook: 'Listen for -ford and -bridge: Oxford, Stamford, Cambridge.', example: 'London grew where the Romans first bridged the Thames.' },
  'pp.wetpoint': { hook: 'Wet point: near water. Dry point: up out of the floods.', example: 'Villages along the foot of the South Downs grew where springs bubble out of the chalk.' },
  'pp.push': { hook: 'Push factors push you out; pull factors pull you in, like a magnet.', example: 'In the 1800s, low farm wages and a lack of work pushed many people out of the countryside and into towns.' },
  'pp.urban': { hook: 'Urban comes from the Latin “urbs”, a city.', example: 'In 1800 most people in Britain lived in the countryside; today over 80% live in towns and cities.' },
  'pp.population': { hook: 'Counting to 8 billion, one number a second, would take over 250 years.', example: 'That is well over 100 times the UK’s population of nearly 70 million.' },
  'pp.populous': { hook: 'India overtook China in 2023: more than 1 person in 6 on Earth lives in India.' },
  'pp.development': { hook: 'The HDI mixes three things: a long life, a good education and a decent income.', example: 'Iceland, Norway and Switzerland usually top the HDI table; the UK is usually in the top 20.' },
  'pp.life': { example: 'Life expectancy is about 81 in the UK, but under 60 in some countries, such as Chad and Nigeria.' },

  // capitals of the wider world (only where a link genuinely helps)
  'wc.usa': { hook: 'D.C. stands for District of Columbia: a special area that belongs to no state.' },
  'wc.can': { hook: 'Queen Victoria picked Ottawa in 1857: it sits on the river between English- and French-speaking Canada.' },
  'wc.bra': { hook: 'Brasília was built from scratch in the middle of Brazil, to draw people inland from the coast.' },
  'wc.arg': { hook: 'Buenos Aires means “good airs”.' },
  'wc.per': { hook: 'Cusco was the old Inca capital; Lima, on the coast, is Peru’s capital today.', example: 'Machu Picchu, the Inca city in the clouds, is near Cusco.' },
  'wc.egy': { example: 'Cairo stands on the Nile, close to the pyramids of Giza.' },
  'wc.nga': { hook: 'Abuja was built in the middle of Nigeria and became the capital in 1991; Lagos, on the coast, is bigger.' },
  'wc.ken': { hook: 'Nairobi comes from the Maasai words for “cool water”.' },
  'wc.eth': { hook: 'Addis Ababa means “new flower” in Amharic.' },
  'wc.cod': { hook: 'Kinshasa faces Brazzaville, capital of the other Congo, across the Congo River.' },
  'wc.chn': { hook: 'Beijing means “northern capital”.' },
  'wc.ind': { hook: 'New Delhi is the new part of Delhi, built by the British and opened in 1931.' },
  'wc.jpn': { hook: 'Tokyo means “eastern capital”; Kyoto was the old capital for over 1,000 years.' },
  'wc.kor': { hook: 'Seoul is South Korea’s capital; Pyongyang is North Korea’s.' },
  'wc.pak': { hook: 'Islamabad was built in the 1960s as a brand-new capital; Karachi, on the coast, is much bigger.' },
  'wc.sau': { hook: 'Mecca is the holy city, but Riyadh is the capital.' },
  'wc.tur': { hook: 'Istanbul was the old Ottoman capital; Atatürk made Ankara the capital in 1923.' },
  'wc.vnm': { hook: 'Hanoi in the north is the capital; Ho Chi Minh City (once Saigon), in the south, is bigger.' },
  'wc.aus': { example: 'Canberra was designed from scratch by the American architects Walter Burley Griffin and Marion Mahony Griffin.' },
  'wc.nzl': { hook: 'Wellington is named after the Duke of Wellington, who won the Battle of Waterloo.' },
};
for (const [id, extra] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `geography.${id}`);
  if (!item) throw new Error(`MEMORY: no item geography.${id}`);
  Object.assign(item, extra);
}

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// (Rivers and tectonics get labelled diagrams separately.)
const RAINFOREST_LAYERS = { kind: 'flow', steps: ['Emergent: the tallest trees poke out', 'Canopy: a thick roof of leaves', 'Understorey: dim and shady', 'Forest floor: only about 2% of the sunlight'], caption: 'The layers of a rainforest, from the top down.' };
const SETTLEMENTS = { kind: 'flow', across: true, steps: ['hamlet', 'village', 'town', 'city', 'conurbation'], caption: 'Settlements, smallest first. A city of more than 10 million people is a megacity.' };
const TOPIC_VISUALS = {
  'geography.map-skills': { kind: 'cycle', steps: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], centre: 'clockwise from north', caption: 'Never Eat Shredded Wheat: N, E, S, W clockwise. North-east (NE) is halfway between north and east.' },
  'geography.scale': { kind: 'table', head: ['scale', '1 cm on the map is', 'so 1 km on the map is'], rows: [['1 : 25 000', '250 m', '**4 cm**'], ['1 : 50 000', '500 m', '**2 cm**']], caption: 'Contour lines close together = steep slope; far apart = gentle slope.' },
  'geography.biomes': [
    { kind: 'table', head: ['biome', 'where', 'what it is like'], rows: [
      ['tropical rainforest', 'near the Equator', 'hot and wet all year'],
      ['hot desert', 'about 30° north and south', 'very dry'],
      ['savanna', 'between rainforest and desert', 'grassland with wet and dry seasons'],
      ['temperate deciduous forest', 'the UK and western Europe', 'mild; trees lose their leaves in winter'],
      ['taiga (boreal forest)', 'Canada, Scandinavia, Russia', 'cold; evergreen conifers'],
      ['tundra', 'near the Arctic', 'very cold, no trees, frozen ground (permafrost)'],
    ], caption: 'From the Equator towards the poles.' },
    RAINFOREST_LAYERS,
  ],
  'geography.people': SETTLEMENTS,
};
const ITEM_VISUALS = {
  'geography.ms.compass': TOPIC_VISUALS['geography.map-skills'],
  'geography.bi.layers': RAINFOREST_LAYERS,
  'geography.pp.hierarchy': SETTLEMENTS,
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = t.visual ? [].concat(t.visual, v) : v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = it.visual ? [].concat(it.visual, v) : v; }

export default [{ subject: 'geography', deck: 'year7', topics, items }];

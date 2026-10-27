// Geography stretch tier: coasts, development, weather systems, and harder world countries.
import { the } from './names.mjs';

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `geography.${id}`, topic: `geography.${topic}`, kind: 'order', prompt, items, labels, explain });
const choiceOnly = { formats: ['choice'] };

const DEV = { passage: 'Development data for three countries (rounded)\n\nCountry A: income per person $65,000 · life expectancy 81 · 99% of adults can read · 6 babies in 1,000 die before age 1\nCountry B: income per person $9,000 · life expectancy 73 · 92% of adults can read · 22 babies in 1,000 die before age 1\nCountry C: income per person $800 · life expectancy 59 · 44% of adults can read · 70 babies in 1,000 die before age 1', passageSource: 'Invented but realistic figures' };

const topics = [
  { id: 'geography.coasts', title: 'Coasts: erosion and landforms', kind: 'facts', tier: 'stretch', prereqs: ['geography.rivers'], batch: 6, intro: 'The sea is a sculptor. Waves attack cliffs in four ways, carve caves into arches and stacks, and carry sand along the beach grain by grain.', hook: 'Crack, cave, arch, stack, stump: the sea knocks a headland down, bump by bump.', teach: 'Explain how a cave becomes a stack.', talk: 'Next time you are at a beach, ask her which way the groynes show the sand is moving.' },
  { id: 'geography.development', title: 'Development: measuring how countries differ', kind: 'facts', tier: 'stretch', prereqs: ['geography.people', 'geography.by-numbers'], links: ['maths'], batch: 6, intro: 'How do we compare rich and poor countries fairly? Geographers use indicators: income, life expectancy, literacy, infant mortality. Each tells part of the story.', hook: 'One number can mislead: the HDI combines a long life, education and income.', teach: 'Explain why income alone is not a good measure of development.', talk: 'Ask her which single number she would use to decide how well a country looks after its people.' },
  { id: 'geography.weather-2', title: 'Weather systems: pressure, fronts and forecasts', kind: 'facts', tier: 'stretch', prereqs: ['geography.weather', 'geography.biomes'], batch: 6, intro: 'Why does the UK get so much changeable weather? Low pressure brings cloud and rain; high pressure brings clear skies. Fronts are the battle lines between warm and cold air.', hook: 'Low is lousy (rising air, cloud and rain); high is happy (sinking air, clear skies).', teach: 'Explain the difference between high and low pressure weather.', talk: 'Look at tonight’s weather map together and find the fronts.' },
  { id: 'geography.world-2', title: 'World: harder countries and capitals', kind: 'facts', tier: 'stretch', prereqs: ['geography.asia', 'geography.africa', 'geography.americas'], batch: 6, intro: 'Beyond the famous names: eighteen more countries that a well-travelled mind should be able to place on a map.', hook: 'Link each country to one picture: Everest for Nepal, lemurs for Madagascar, the Equator for Ecuador.', teach: 'Point to three countries on a world map that most people could not find.', talk: 'Ask her the capital of Mongolia (it is a tongue-twister).' },
];

const WORLD = [
  ['IDN', 'Indonesia', 'Jakarta', ['Asia', 'Oceania'], 'Over 17,000 islands and 270 million people: the world’s fourth most populous country.'],
  ['PHL', 'Philippines', 'Manila', ['Asia', 'Oceania'], 'More than 7,000 islands in the western Pacific.'],
  ['MYS', 'Malaysia', 'Kuala Lumpur', ['Asia', 'Oceania'], 'Split between the Malay Peninsula and the island of Borneo.'],
  ['MNG', 'Mongolia', 'Ulaanbaatar', ['Asia'], 'The most sparsely populated country on Earth: about 2 people per km².'],
  ['KAZ', 'Kazakhstan', 'Astana', ['Asia'], 'The largest landlocked country in the world.'],
  ['AFG', 'Afghanistan', 'Kabul', ['Asia'], 'A mountainous, landlocked country between Iran and Pakistan.'],
  ['IRQ', 'Iraq', 'Baghdad', ['Asia'], 'Mesopotamia, between the Tigris and Euphrates: home of some of the first cities.'],
  ['NPL', 'Nepal', 'Kathmandu', ['Asia'], 'Home to Mount Everest, on its border with China.'],
  ['LKA', 'Sri Lanka', null, ['Asia'], 'A teardrop-shaped island off the southern tip of India.'],
  ['TZA', 'Tanzania', null, ['Africa'], 'Home to Kilimanjaro, Africa’s highest mountain, and the Serengeti.'],
  ['SDN', 'Sudan', 'Khartoum', ['Africa'], 'The Blue and White Niles meet at Khartoum.'],
  ['DZA', 'Algeria', 'Algiers', ['Africa'], 'Africa’s largest country by area, mostly Sahara.'],
  ['LBY', 'Libya', 'Tripoli', ['Africa'], 'Mediterranean coast, Saharan interior; rich in oil.'],
  ['MDG', 'Madagascar', 'Antananarivo', ['Africa'], 'The world’s fourth largest island; most of its wildlife, including lemurs, lives nowhere else.'],
  ['ETH', null, null, ['Africa'], ''], // placeholder removed below
  ['BOL', 'Bolivia', null, ['South America'], 'Landlocked, high in the Andes; La Paz is the world’s highest capital city.'],
  ['ECU', 'Ecuador', 'Quito', ['South America'], 'Named after the equator, which runs through it; the Galapagos Islands belong to it.'],
  ['URY', 'Uruguay', 'Montevideo', ['South America'], 'A small country between Brazil and Argentina.'],
  ['GTM', 'Guatemala', 'Guatemala City', ['North America'], 'Heart of the ancient Maya civilisation.'],
].filter((w) => w[1]);

const items = [
  // --- coasts
  mcq('co.d1', 'coasts', 'Which statement about waves is true?', [['Waves are made by wind blowing across the sea', true], ['Waves are caused by the pull of the Moon', false, 'The Moon causes tides, not waves.'], ['Waves carry water right across the ocean', false, 'Energy moves across; the water mostly goes round in circles.']], 'The distance wind blows over open water is called the fetch. A long fetch (the Atlantic hitting Cornwall) means big waves.', choiceOnly),
  fact('co.hydraulic', 'coasts', 'Which type of erosion is the sheer force of waves smashing into cracks and compressing the air inside?', 'hydraulic action', ['abrasion', 'attrition', 'solution'], 'Hydraulic action: water and trapped air are forced into cracks, which widen until the rock breaks.'),
  fact('co.abrasion', 'coasts', 'Waves hurling sand and pebbles against a cliff, wearing it away like sandpaper, is called…', 'abrasion', ['attrition', 'hydraulic action', 'deposition'], 'Abrasion (also called corrasion) is the sandpaper effect.'),
  fact('co.attrition', 'coasts', 'Pebbles knocking against each other and becoming smaller and rounder is called…', 'attrition', ['abrasion', 'solution', 'traction'], 'Attrition is why beach pebbles are smooth: they wear each other down.'),
  order('co.stack', 'coasts', 'Put the stages of headland erosion in order.', ['crack', 'cave', 'arch', 'stack', 'stump'], null, 'Waves widen a crack into a cave; the cave breaks through the headland into an arch; the arch roof collapses, leaving a stack; the stack is worn down to a stump.'),
  mcq('co.headland', 'coasts', 'Why do headlands and bays form along some coasts?', [['Soft rock erodes faster than the hard rock beside it', true], ['Rivers cut the bays as they reach the sea', false, 'It is the sea eroding softer rock faster.'], ['People dig out the bays to make harbours', false, 'Harbours use natural bays; they do not create them.']], 'Where rock types alternate along the coast, the sea picks out the soft rock. Swanage Bay and Durlston Head in Dorset are a classic example.', choiceOnly),
  fact('co.longshore', 'coasts', 'What is the zigzag movement of sand along a beach, driven by waves hitting at an angle, called?', 'longshore drift', ['attrition', 'the fetch', 'a spit'], 'Waves swash up the beach at an angle and drain straight back; each wave moves sand a little further along.', { accept: ['long shore drift'] }),
  fact('co.spit', 'coasts', 'A long, narrow ridge of sand built out from the coast by longshore drift is called a…', 'spit', ['stack', 'bay', 'groyne'], 'Spurn Head in Yorkshire is a spit 5 km long.'),
  fact('co.groyne', 'coasts', 'What are the wooden or stone walls built across a beach to trap sand called?', 'groynes', ['piers', 'stacks', 'sea walls'], 'Groynes stop longshore drift carrying the beach away. The sand piles up on one side, showing the direction of drift.'),
  mcq('co.manage', 'coasts', 'A village on a crumbling clay cliff asks for a sea wall. Which is a GOOD reason to say no?', [['It would starve beaches further along of sand', true], ['Sea walls never work against strong waves', false, 'They work, at a cost. The issue is knock-on effects.'], ['Small villages are not worth protecting', false, 'That is a value judgement, not a geographical reason. Decisions weigh costs against the value of what is protected.']], 'Protecting one stretch of coast often starves another of sediment. Some places now choose “managed retreat”.', choiceOnly),

  // --- development
  mcq('dv.d1', 'development', 'Which country is most developed, and which indicator tells you LEAST on its own?', [['A; income alone can hide inequality', true], ['C, because low income means simpler lives', false, 'Development measures how long and healthy lives are. Country C has the shortest lives and highest infant deaths.'], ['It is impossible to tell from these figures', false, 'Every indicator points the same way here: A, then B, then C.']], 'Geographers combine indicators (the Human Development Index uses income, life expectancy and education) because any one number can mislead.', DEV),
  fact('dv.infant', 'development', 'In Country C, 70 babies in every 1,000 die before their first birthday. What percentage is that?', '7%', ['70%', '0.7%', '7.7%'], '70 ÷ 1000 × 100 = 7%. Infant mortality is one of the most sensitive measures of development.', { ...DEV, formats: ['choice'] }),
  mcq('dv.life', 'development', 'Why is life expectancy such a useful development indicator?', [['It sums up health, food and safety in one number', true], ['Because it is easy to guess for any country', false, 'It is calculated from careful records of births and deaths.'], ['Because it only measures how rich people are', false, 'It does not measure wealth directly, though people in richer countries do live nearly twenty years longer on average.']], 'A long average life needs clean water, enough food, vaccinations, doctors and peace. It captures a lot at once.', choiceOnly),
  fact('dv.hdi', 'development', 'Which UN measure combines income, life expectancy and years of schooling into one number between 0 and 1?', 'the HDI', ['the GDP', 'the birth rate', 'the Gini index'], 'HDI: Norway and Switzerland are near 0.96; the lowest countries are below 0.4.', { accept: ['hdi', 'human development index'] }),
  fact('dv.gdp', 'development', 'What does GDP per capita measure?', 'the value a country produces per person', ['the number of cars per family', 'the average wage of factory workers', 'the amount of gold a country owns'], 'Per capita means per head. It is the most common measure of wealth, but it says nothing about how equally the wealth is shared.', choiceOnly),
  fact('dv.lic', 'development', 'What do the letters LIC stand for in geography?', 'low-income country', ['large island country', 'local industry centre', 'low-inland coast'], 'LICs, NEEs (newly emerging economies such as Brazil and India) and HICs (high-income countries) replaced the old “third world” labels.', choiceOnly),
  mcq('dv.birth', 'development', 'As countries develop, birth rates usually fall. Why?', [['More children survive and more girls are educated', true], ['Governments everywhere ban large families', false, 'A few have tried, but the fall happens everywhere development happens.'], ['People stop wanting children at all', false, 'Families get smaller, not childless. Education of girls is the strongest single factor.']], 'The demographic transition: high birth and death rates, then death rates fall, then birth rates follow.', choiceOnly),
  mcq('dv.trade', 'development', 'A country sells raw cocoa beans for $2 a kilo. The chocolate made from them sells for $20 a kilo abroad. What does this show about development?', [['Processing goods earns far more than raw materials', true], ['Cocoa beans are almost worthless to anyone', false, 'It is valuable, but most of the value is added later by processing and branding.'], ['Chocolate makers charge far too much abroad', false, 'The point is where the value and jobs end up.']], 'Many LICs export raw materials cheaply and import manufactured goods dearly, which makes it hard to grow richer. Fair trade schemes try to shift the balance.', choiceOnly),

  // --- weather systems
  fact('ws.low', 'weather-2', 'Which kind of pressure system brings cloud, wind and rain to the UK?', 'low pressure (a depression)', ['high pressure (an anticyclone)', 'a monsoon', 'a tornado'], 'Air rises in a low, cools, and its water vapour condenses into cloud and rain.', { accept: ['low pressure', 'a depression', 'depression', 'low'] }),
  fact('ws.high', 'weather-2', 'Which kind of pressure system brings clear skies, light winds, hot summer days and frosty winter nights?', 'high pressure (an anticyclone)', ['low pressure (a depression)', 'a front', 'a hurricane'], 'In a high, air sinks and warms, so clouds cannot form. Clear nights lose heat quickly: frost in winter.', { accept: ['high pressure', 'an anticyclone', 'anticyclone', 'high'] }),
  fact('ws.front', 'weather-2', 'What is the boundary between a mass of warm air and a mass of cold air called?', 'a front', ['a trough', 'an isobar', 'a jet'], 'Warm fronts bring steady rain as warm air slides up over cold; cold fronts bring short heavy showers as cold air undercuts warm.', { accept: ['front', 'a weather front', 'weather front'] }),
  fact('ws.isobar', 'weather-2', 'On a weather map, what are the lines joining places with the same air pressure called?', 'isobars', ['contours', 'fronts', 'latitudes'], 'Close isobars mean a big pressure difference over a short distance, which means strong winds.'),
  mcq('ws.wind', 'weather-2', 'Where are winds strongest on a weather map?', [['Where the isobars are closest together', true], ['Where the isobars are far apart', false, 'Widely spaced isobars mean a gentle pressure gradient and light winds.'], ['At the centre of a high', false, 'The centre of a high is usually calm.']], 'Wind is air moving from high to low pressure. The steeper the pressure change, the faster the wind.', choiceOnly),
  mcq('ws.uk', 'weather-2', 'Why is UK weather so changeable?', [['It sits where warm and cold air masses meet', true], ['Because it is a small island in the sea', false, 'Being an island matters (mild, wet), but the changeability comes from the fronts and depressions passing over.'], ['Because of the Gulf Stream and nothing else', false, 'The Gulf Stream keeps the UK mild, not changeable.']], 'The polar front runs near the UK. Depressions form along it and are steered east by the jet stream.', choiceOnly),
  fact('ws.prevailing', 'weather-2', 'From which direction does the UK’s prevailing wind blow?', 'the south-west', ['the north-east', 'the east', 'the north'], 'South-westerlies off the Atlantic: mild and moist, which is why the west is wetter than the east.', { accept: ['south-west', 'southwest', 'sw', 'south west'] }),
  mcq('ws.forecast', 'weather-2', 'A forecaster sees a deep low approaching from the Atlantic with tightly packed isobars. What should she expect?', [['Strong winds and heavy rain', true], ['A long, dry heatwave', false, 'Heatwaves come with high pressure.'], ['Calm weather with fog and frost', false, 'Those need calm, clear conditions: a high.']], 'The Met Office names storms when a deep depression is likely to cause damage. The deeper the low, the tighter the isobars, the stronger the wind.', choiceOnly),

  // --- harder world countries
  ...WORLD.flatMap(([id, name, capital, zoom, note], i) => [
    { id: `geography.w2.${id.toLowerCase()}`, topic: 'geography.world-2', kind: 'mapfact', map: 'world', layer: 'countries', feature: id, zoom, answer: name, accept: [], choosePrompt: 'Which country is highlighted?', explain: `This is ${the(name)}. ${note}` },
    ...(capital ? [fact(`w2.cap.${id.toLowerCase()}`, 'world-2', `What is the capital of ${the(name)}?`, capital, WORLD.filter((w) => w[2] && w[1] !== name).slice(i % 9, i % 9 + 3).map((w) => w[2]), `${capital} is the capital of ${the(name)}. ${note}`, { fill: true })] : []),
  ]),
];

// Memory hooks (mnemonics) and real-world examples, keyed by item id. Shown on the learn card and after a wrong answer.
const HAAS = 'HAAS: Hydraulic action, Abrasion, Attrition, Solution, the four ways the sea erodes.';
const MEMORY = {
  // coasts
  'co.d1': { hook: 'Wind makes waves; the Moon makes tides.', example: 'Cornwall faces thousands of kilometres of open Atlantic, which is why surfers at Newquay get big waves.' },
  'co.hydraulic': { hook: HAAS, example: 'Like slamming a door on trapped air: waves squash air into cracks, then it bursts out and prises the rock apart.' },
  'co.abrasion': { hook: 'Abrasion is the sea’s sandpaper, like an abrasive scouring pad.', example: 'The flat, rocky wave-cut platforms below the chalk cliffs of the Seven Sisters were scraped smooth by the sea.' },
  'co.attrition': { hook: 'Attrition: the pebbles attack each other.', example: 'Chesil Beach in Dorset is made of smooth, rounded pebbles that get bigger towards Portland.' },
  'co.stack': { hook: 'Crack, cave, arch, stack, stump: say it like a drumbeat.', example: 'Durdle Door in Dorset is an arch; nearby Old Harry Rocks are chalk stacks, and Old Harry’s Wife is a stump.' },
  'co.headland': { hook: 'Hard rock hangs on as headlands; soft rock is scooped out into bays.', example: 'Swanage Bay is cut into soft clays and sands, between chalk at Ballard Point and limestone at Peveril Point.' },
  'co.longshore': { hook: 'Swash goes up at an angle, backwash comes straight back down: zigzag along the beach.', example: 'On the Holderness coast in Yorkshire, longshore drift carries sand south to build Spurn Head.' },
  'co.spit': { hook: 'A spit is a finger of sand that keeps growing where the coast turns a corner.', example: 'Hurst Castle stands on a shingle spit in Hampshire; Dawlish Warren in Devon is a sand spit.' },
  'co.groyne': { hook: 'Groynes grab the sand: it piles up on the side the drift comes from.', example: 'Look along the beaches at Brighton or Bournemouth: groynes stick out into the sea all the way along.' },
  'co.manage': { hook: 'Protect one place and you may starve the next.', example: 'At Mappleton on the Holderness coast, Europe’s fastest-eroding, rock groynes saved the village but sped up erosion further south.' },

  // development
  'dv.d1': { hook: 'One number can mislead; several numbers pointing the same way tell the story.' },
  'dv.infant': { hook: 'Per 1,000 to per cent: divide by 10. So 70 per 1,000 = 7%.' },
  'dv.life': { hook: 'A long life needs clean water, food, doctors and peace.', example: 'Life expectancy is about 81 in the UK but only about 55 in Chad.' },
  'dv.hdi': { hook: 'The HDI mixes three things: a long life, years at school and income.', example: 'The UK is usually in the top 20; Norway and Switzerland are near the very top.' },
  'dv.gdp': { hook: 'Per capita means “per head” (Latin “caput”, head).', example: 'Tiny Luxembourg has one of the highest GDPs per person in the world.' },
  'dv.lic': { hook: 'LIC, NEE, HIC: low, emerging, high.', example: 'Ethiopia is an LIC; Brazil and India are NEEs; the UK is an HIC.' },
  'dv.birth': { hook: 'When children survive and girls go to school, families get smaller.', example: 'In Bangladesh, the average family has fallen from about 6 children in 1980 to about 2 today.' },
  'dv.trade': { hook: 'Raw is cheap, processed is pricey: the money is in the making.', example: 'Côte d’Ivoire and Ghana grow over half the world’s cocoa, but much of the chocolate is made in Europe.' },

  // weather systems
  'ws.low': { hook: 'Low is lousy: air rises, cools and makes cloud and rain.', example: 'Named storms, like Storm Arwen in 2021, are deep depressions.' },
  'ws.high': { hook: 'High is happy: sinking air, clear skies, sunny days and frosty nights.', example: 'A crisp, sunny winter morning with frost on the cars usually means a high is sitting over the UK.' },
  'ws.front': { hook: 'Warm front: long, steady rain. Cold front: short, sharp showers.', example: 'On TV weather maps, red semicircles mark a warm front and blue triangles a cold front.' },
  'ws.isobar': { hook: 'Iso means “equal”; bar comes from the Greek for “weight”, as in barometer: lines of equal pressure.', example: 'On the Met Office pressure chart, isobars are labelled in millibars, such as 1000 mb.' },
  'ws.wind': { hook: 'Squashed isobars, strong winds; wide gaps, gentle breezes.' },
  'ws.uk': { hook: 'The UK sits on the battle line between cold polar air and warm tropical air.' },
  'ws.prevailing': { hook: 'South-west wind, wet west: it picks up moisture crossing the Atlantic.', example: 'On exposed hills in Cornwall, trees grow bent over towards the north-east, pushed by the wind.' },
  'ws.forecast': { hook: 'Deep low + tight isobars = batten down the hatches.', example: 'The Met Office names storms in alphabetical order each season, starting in September.' },

  // harder capitals (only where a link genuinely helps)
  'w2.cap.mng': { hook: 'Ulaanbaatar means “red hero”: say it oo-lahn-BAH-tor.' },
  'w2.cap.kaz': { hook: 'Astana simply means “capital” in Kazakh.' },
  'w2.cap.mys': { hook: 'Kuala Lumpur means “muddy confluence”: it grew where two rivers meet.' },
  'w2.cap.mdg': { hook: 'Antananarivo means “city of the thousand”; locals shorten it to Tana.' },
  'w2.cap.dza': { hook: 'Algeria and Algiers: the country is named after its capital.' },
  'w2.cap.ecu': { hook: 'Quito is only about 25 km south of the Equator, the line that gave Ecuador its name.' },
  'w2.cap.irq': { example: 'Baghdad stands on the River Tigris.' },
  'w2.cap.npl': { example: 'Most Everest climbers fly into Kathmandu before trekking to base camp.' },
};
for (const [id, extra] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `geography.${id}`);
  if (!item) throw new Error(`MEMORY: no item geography.${id}`);
  Object.assign(item, extra);
}

export default [{ subject: 'geography', deck: 'stretch', topics, items }];

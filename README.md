# Grammar Stream

A daily, offline learning course for the step from Year 6 to Year 7 (grammar school readiness) across English, maths, history, geography, science and Latin. It runs in the browser as an installable web app on a Windows PC and an Android tablet. Progress stays on the device; nothing is sent anywhere.

## Two courses, one app

Each child on a device has their own profile: course, capybara, progress, settings and backup file. With more than one child the app opens on **Who's learning?**; grown-ups add, switch or remove children in the Grown-ups area (one PIN covers all).

- **Year 6 to grammar school** (ages 10–11): English, maths, history, geography, science and Latin, below.
- **Year 2 greater depth** (ages 6–7), about 110 topics and 850 items, enough new material for most of a school year: maths (tens and ones to 3-digit column methods, bonds and fact families, doubling and halving, times tables, grouping with remainders, fractions, money and change, time and durations, measures and reading scales, number lines, turns and direction, pictograms and block charts, two-step problems, puzzles and always/sometimes/never reasoning; Year 3 tasters: ×10 and ×100, perimeter, Roman numerals), reading (phonics to tricky endings, three sets of wonderful words, Beatrix Potter’s Peter Rabbit and Squirrel Nutkin, six Robert Louis Stevenson poems, six retold fables, original racing, space and superhero stories, and fact files from the Moon landing to the Spitfire), spelling and grammar (the statutory Year 1 and 2 words, the Year 2 spelling patterns, prefixes, plurals, compound words, better sentences, speech marks and a Year 3/4 taster, plus 14 sentence challenges), science and the world (animals, minibeasts, dinosaurs, plants, materials, seasons, space and space exploration, hot and cold places, continents, oceans and countries on the world map, the UK and its rivers; tasters: forces, rocks, light, sound and electricity), and British history with a focus on soldiers, knights and the two World Wars, told gently, from the Stone Age and Ancient Egypt through the Tudors and Victorians to cars and speed, inventors, explorers and sea rescues, on a 32-event timeline. Every question, passage and learn card has a read-aloud button; sessions are 12 minutes with a wiggle break; a 60-second sprint and a 25-question maths test; word problems and one story feature racing cars, space droids and his own superhero (original characters, not trademarked ones); his capybara starts with a racing helmet, hero cape and mask.
- **Year 3 greater depth** (ages 7–8) contains all of Year 2, so a child moves up from the grown-ups page without losing anything: reviews carry on, unfinished Year 2 topics stay, Year 2’s stretch topics count as core, and about 85 Year 3 topics (785 items) follow on, with Year 4 tasters as the stretch tier. Maths (3-digit mental and column methods, the 3, 4 and 8 tables, multiplying and dividing, fractions, measures, money, time to the minute and 24-hour clock, angles, statistics, two-step problems; tasters: all tables, negatives, decimals, area, rounding), reading (Toad’s motor car, Just So Stories, the Jungle Book, Alice, Five Children and It, Black Beauty and four more Stevenson poems, retold Greek and British legends, new stories and fact files, figurative language and kinds of writing, with its own 25-book ladder), spelling and grammar (the Year 3/4 statutory words, prefixes, suffixes, homophones, clauses, conjunctions and the present perfect; tasters: fronted adverbials, plural possessives, Standard English), science and the world (plants, nutrition, skeletons, rocks, light, forces and magnets, fair tests, Europe on the map, UK cities, rivers and mountains, volcanoes, compass and grid references, climate zones; tasters: states of matter, digestion, keys, circuits), and history (Stone to Iron Age, the Roman army, Boudica, Roman life, Anglo-Saxons and Vikings, Ancient Greece, Sumer and the Indus Valley, castles under siege, the Battle of Britain and the Home Front, historical skills; tasters: the Normans and Shang China) on a 46-event timeline. Sessions are 15 minutes, with the typing game, a 60-second sprint and a 30-question Year 3 arithmetic test.

Course definitions live in `js/core/subjects.js`; Year 2 content sources are in `tools/content-src/ks1/` and build to `content/ks1/` and `content/index-ks1.json`; Year 3 sources are in `tools/content-src/y3/` and `content/index-y3.json` lists every Year 2 deck plus the Year 3 ones. Grown-up-facing text uses `{she}`/`{her}`/`{him}` tokens so it reads correctly for each child.

## Using it

- Open the GitHub Pages address in Chrome or Edge. After the first visit it works offline.
- **Install it**: in Chrome on the tablet, menu → *Add to Home screen* / *Install app*. On Windows, the install icon in the address bar.
- **Moving between devices**: Grown-ups (🔒) → *Save a backup file* on one device, then *Load a backup file* on the other. Progress is per browser, so back up weekly.

## How it is built

Plain HTML, CSS and JavaScript modules: no framework, no build step for the app itself.

```
index.html, manifest.webmanifest, sw.js   app shell, install manifest, offline service worker (generated)
css/app.css                               design tokens, light and dark themes
js/core/        pure logic, tested in Node: FSRS-6 scheduler, Elo, mastery, checkers, session planner, save format
js/gen/         parametric question generators (every subject, plus joined-up ones)
js/ui/          DOM helpers, question renderers, maps, the capybara
js/screens/     onboarding, home, session player, grown-ups area
content/        built JSON decks and projected maps (do not edit by hand)
tools/          content sources, build scripts, browser smoke test
tests/          node:test suites
```

### The learning engine

- **Scheduling**: FSRS-6 with the published default weights, checked against reference values generated by py-fsrs (`tests/fixtures`). Retention target 0.85 for maths procedures, 0.90 for everything else. Two grades for the child (wrong / right); right + fast + "sure" counts as Easy.
- **Formats**: facts move from multiple choice, to a first-letter cue, to free recall as they stabilise.
- **Difficulty**: Elo per subject and per generator level, targeting about 77% success.
- **Mastery**: exponential moving average per topic; *mastered* only after delayed success in mixed review.
- **Sessions**: yesterday's answers, a 90-second arithmetic sprint against her own best (five levels, from times tables to percentages), interleaved reviews (max 40% per subject), a break, new learning she chooses, a sentence task, then explaining an idea to her capybara and correcting its deliberate mistake. Hard stop, and the app rests in the hour before bedtime.

### Maths coverage

Twenty-nine maths topics, each backed by a question generator with three levels (secure Year 6, greater depth, Year 7 stretch): place value and decimals, negatives, six fraction topics, percentages, order of operations, algebra (substitution, sequences, equations), ratio, primes, angles, long multiplication and division (including interpreting remainders), area and perimeter (triangles, parallelograms, compound shapes), volume, coordinates in four quadrants (reflection and translation), converting units, time and timetables, multi-step money problems, probability, and reading bar charts, pie charts and line graphs; plus key facts and shape vocabulary. Diagrams are drawn from the generated numbers, so they are always consistent with the question.

### Reading comprehension

Six reading topics built on twelve full-page extracts (150–400 words, verbatim from public-domain texts: Burnett, Grahame, Stevenson, Wells, Montgomery, Nesbit, Sewell, Jerome, Dickens, Darwin and Carroll). Each extract has six questions (retrieval, inference, word meaning in context, find-and-copy, the writer's technique and its effect) answered straight from the text, then a short written answer. The written answer cannot be auto-marked: it goes to the grown-ups page with a model answer and a three-level verdict, and her feedback appears at the start of her next session. A "Yes!" counts towards the topic's mastery. Twenty-six weekly writing prompts rotate through story, viewpoint, analysis, history, science and geography.

### Latin

Eleven topics for a Year 7 head start: vocabulary both ways (Latin→English and English→Latin, with the English words that descend from each), verbs ending -t, word order, nominative and accusative, the -o/-s/-t endings, plurals, numbers and greetings, Latin inside English, Roman life, and an original short story read like a comprehension passage. No level check: everyone starts at the beginning.

### Practice tools

- **Arithmetic paper**: a KS2-style test of 36 questions and 40 marks in 30 minutes, generated fresh each time, marked instantly with corrections; results and best score are kept.
- **Touch typing**: ten lessons from the home row to whole sentences, with an on-screen keyboard showing the next key and finger; a lesson passes at 90% accuracy. Then *River race*, a one-minute word game. Needs a real keyboard.
- **Speed reading**: a passage lights up word by word at a set pace, followed by four comprehension questions from the reading topics; the pace rises only when she still understands.

### Stretch tier

Each subject has four to ten `tier: 'stretch'` topics (end of Year 7 into Year 8): algebra with brackets and unknowns on both sides, percentage change, angles in polygons and parallel lines, index laws, straight-line graphs, circles; advanced grammar, ambitious vocabulary, poetic form, Dickens and Brontë; the Reformation, the Armada, the Civil War and historical interpretations; coasts, development, weather systems and harder countries; the periodic table, reactions and conservation of mass, digestion, light and V = I × R. They unlock only when 70% of a subject's ordinary topics are secure (and their own prerequisites are), are never part of the placement check, and show a “stretch” tag on the subject page. Securing five earns the crown.

### Joined-up topics

Some topics draw on another subject: *Geography by numbers* (averages, density, percentage change), *History by numbers* (BC/AD intervals, fractions of a population), *Science by numbers* (percentages, ratios, rates), *Reading historical sources* (English analysis of the Anglo-Saxon Chronicle and Elizabeth I's Tilbury speech) and *Science words* (spelling and word roots). A topic's `links` shows as "Geography + Maths"; its prerequisites include the other subject's topic, so it unlocks only once that skill is secure. Generated questions name the maths topics they use in `credits`, and her answers count towards those topics' mastery too.

### Visible progress

The home screen's island map lights up topic by topic (white ring segments for secure, gold for mastered). *My progress* has a history timeline whose events light up as she learns them, maps that colour in the places she knows, and nineteen milestones. Milestones are fixed rewards for real achievement (never random); six of them unlock outfits for her capybara.

### Commands

```sh
npm test                                   # all unit, content and simulation tests
node tools/build-content.mjs               # rebuild content/*.json from tools/content-src/
node tools/gen-precache.mjs                # regenerate sw.js after changing any app file
node tools/build-maps.mjs                  # rebuild maps (needs Natural Earth files in .cache/ne/)
PW=$(npm root -g)/playwright node tools/smoke.mjs   # full session in a real browser
PW=$(npm root -g)/playwright node tools/shots.mjs out/ 35   # screenshots after 35 simulated days
npm run serve                              # local server on http://localhost:8080
```

CI (`.github/workflows/pages.yml`) runs the tests and freshness checks on every push to `main` and deploys to GitHub Pages only if they pass.

## Content sources and licences

- Curriculum structure: DfE National Curriculum programmes of study and STA frameworks (Open Government Licence). Questions are written for this app.
- Maps: [Natural Earth](https://www.naturalearthdata.com/) (public domain). Borders follow UK government recognition.
- Fonts: Atkinson Hyperlegible, OpenDyslexic and Outfit (SIL Open Font Licence; see `fonts/`).

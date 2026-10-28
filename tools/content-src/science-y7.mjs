// Year 7 science core: the topics most grammar-school Year 7 schemes cover in the first year.
// Each topic opens with misconception diagnostics; working scientifically is taught through
// specific investigations (the variables and mean generators use real scenarios).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `science.${id}`, topic: `science.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const part = (id, topic, map, feature, answer, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mapfact', map, layer: 'features', feature, answer, explain, choosePrompt: 'Which part is highlighted?', locatePrompt: `Tap the ${answer}.`, namePrompt: 'Name the highlighted part.', ...extra });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'order', prompt, items, labels, explain });
const tmpl = (id, topic, gen, seed = [-1, 0, 1]) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed });
const choiceOnly = { formats: ['choice'] };

const topics = [
  { id: 'science.particles', title: 'The particle model', kind: 'facts', prereqs: ['science.materials'], batch: 5, diagnostic: ['science.pt.d1', 'science.pt.d2'], intro: 'Everything is made of tiny particles. The way they are arranged and move explains solids, liquids, gases, smells spreading and balloons bursting.', teach: 'Explain why you can smell perfume from across a room.', talk: 'Ask her why a balloon gets bigger in the sun.', hook: 'Solids **vibrate**, liquids **slide**, gases **zoom**.' },
  { id: 'science.cells', title: 'Cells and the microscope', kind: 'facts', prereqs: ['science.living'], batch: 5, diagnostic: ['science.cl.d1', 'science.cl.d2'], intro: 'All living things are made of cells, the building blocks of life. Most are far too small to see without a microscope.', teach: 'Explain three differences between a plant cell and an animal cell.', talk: 'Ask her what mitochondria do.', hook: 'Cells are the building blocks of life, and **mitochondria are the powerhouse of the cell**.' },
  { id: 'science.atoms', title: 'Atoms, elements and compounds', kind: 'facts', prereqs: ['science.particles'], batch: 5, diagnostic: ['science.at.d1'], intro: 'There are only about 118 elements, but they combine to make everything in the universe.', teach: 'Explain the difference between an element and a compound.', talk: 'Ask her what H₂O means.', hook: 'Element: one kind of atom. Compound: different atoms **chemically joined**. Mixture: just **mixed**.' },
  { id: 'science.separating', title: 'Mixtures and separating them', kind: 'facts', prereqs: ['science.atoms'], batch: 5, diagnostic: ['science.sp7.d1'], intro: 'Sea water, ink and air are all mixtures. Scientists have clever ways to separate them.', teach: 'Explain how you could get pure water from sea water.', talk: 'Ask her what “pure” means to a scientist.', hook: '**Filter** out bits, **evaporate** to get a solid back, **distil** to get a liquid back, **chromatography** for colours.' },
  { id: 'science.acids', title: 'Acids and alkalis', kind: 'mixed', prereqs: ['science.separating'], batch: 5, diagnostic: ['science.ac.d1'], intro: 'Lemon juice, soap, vinegar and toothpaste: some are acids and some are alkalis. Indicators tell them apart.', teach: 'Explain what happens when an acid and an alkali are mixed.', talk: 'Ask her why indigestion tablets help with heartburn.', hook: 'pH **7** is neutral: below 7 is acid (sour), above 7 is alkali (soapy).' },
  { id: 'science.forces7', title: 'Forces and motion', kind: 'mixed', prereqs: ['science.forces'], batch: 5, diagnostic: ['science.f7.d1'], intro: 'Forces change how things move. Now we’ll calculate speed and weight, and read distance–time graphs.', teach: 'Explain what balanced forces do to a moving object.', talk: 'Ask her what your speed is if you drive 120 km in 2 hours.', hook: '**Balanced** forces: no change in motion. **Unbalanced**: speed up, slow down or change direction.' },
  { id: 'science.energy', title: 'Energy stores and resources', kind: 'facts', prereqs: ['science.forces7'], batch: 5, diagnostic: ['science.en.d1'], intro: 'Energy is never used up. It moves between stores: kinetic, thermal, chemical and more.', teach: 'Explain the energy changes when you throw a ball up in the air.', talk: 'Ask her which energy resources are renewable.', hook: 'Energy is never used up, only **moved between stores**, like money moved between bank accounts.' },
  { id: 'science.universe', title: 'Stars, galaxies and the solar system', kind: 'facts', prereqs: ['science.space'], batch: 5, diagnostic: ['science.un.d1', 'science.un.d2'], intro: 'Our Sun is one of hundreds of billions of stars in the Milky Way, and the Milky Way is one of billions of galaxies.', teach: 'Explain what a light-year is.', talk: 'Ask her what causes a solar eclipse.', hook: 'Planet → solar system → galaxy → universe: like house → street → town → world.' },
  { id: 'science.ecosystems', title: 'Food webs and photosynthesis', kind: 'facts', prereqs: ['science.living'], batch: 5, diagnostic: ['science.ec.d1', 'science.ec.d2'], intro: 'Every living thing depends on others. Energy flows from the Sun through plants to animals.', teach: 'Explain what would happen to a food web if all the bees disappeared.', talk: 'Ask her where a tree gets the stuff to build its trunk.', hook: 'Sun → plant → animal: the arrows point to the **eater**, following the energy.' },
  { id: 'science.reproduction', title: 'Reproduction in plants and animals', kind: 'facts', prereqs: ['science.body'], batch: 5, diagnostic: ['science.rp.d1'], intro: 'All living things reproduce. Flowers are a plant’s way of making seeds.', teach: 'Explain the difference between pollination and fertilisation.', talk: 'Ask her how a sycamore seed travels.', hook: 'First **pollination** (pollen lands), then **fertilisation** (cells join), then **dispersal** (seeds travel).' },
  { id: 'science.working', title: 'Investigations: fair tests and results', kind: 'skill', prereqs: [], batch: 5, intro: 'Scientists test ideas with fair tests: change one thing, measure another, and keep everything else the same.', teach: 'Explain how to make an investigation a fair test.', talk: 'Plan a kitchen experiment together: which variable will you change?', hook: '**Cows Moo Softly**: **C**hange one thing, **M**easure one thing, keep everything else the **S**ame.' },
];

const items = [
  // --- particles
  mcq('pt.d1', 'particles', 'When a metal bar is heated it expands (gets slightly longer). Why?', [['The particles vibrate more and spread apart', true], ['Each particle swells and gets a little bigger', false, 'A very common idea! The particles themselves stay the same size. They take up more room because they move more.'], ['The heat makes extra particles in the metal', false, 'Heating doesn’t create particles; the number stays the same.']], 'Heating gives particles more energy, so they vibrate more and need more space. The particles do not grow.'),
  mcq('pt.d2', 'particles', 'What is in the space between the particles of a gas?', [['Nothing at all', true], ['Air, which fills the gaps', false, 'Air IS a gas, made of particles. Between the particles there is nothing at all.'], ['Water vapour', false, 'Water vapour is itself made of particles.']], 'Gas particles are far apart with empty space (a vacuum) between them, which is why gases can be squashed.'),
  part('pt.solid', 'particles', 'particles', 'solid', 'solid', 'In a solid, particles are packed in a regular pattern and vibrate on the spot.', { choosePrompt: 'Which state of matter is highlighted?', locatePrompt: 'Tap the box showing a solid.' }),
  part('pt.liquid', 'particles', 'particles', 'liquid', 'liquid', 'In a liquid, particles touch but are jumbled and can slide past each other, so liquids flow.', { choosePrompt: 'Which state of matter is highlighted?', locatePrompt: 'Tap the box showing a liquid.' }),
  part('pt.gas', 'particles', 'particles', 'gas', 'gas', 'In a gas, particles are far apart and move quickly in all directions.', { choosePrompt: 'Which state of matter is highlighted?', locatePrompt: 'Tap the box showing a gas.' }),
  fact('pt.diffusion', 'particles', 'What is the spreading out of particles from where there are lots to where there are fewer called?', 'diffusion', ['condensation', 'evaporation', 'dissolving'], 'Diffusion is why you can smell food cooking from another room. It happens faster in warm gases.'),
  fact('pt.compress', 'particles', 'Why can a gas be squashed (compressed) but a liquid hardly at all?', 'its particles are far apart', ['gas particles are much smaller', 'liquid particles are heavier', 'gas particles are soft and squashy'], 'In a liquid the particles already touch, so there is no room to squash them closer.', choiceOnly),
  fact('pt.pressure', 'particles', 'What causes the pressure of a gas inside a balloon?', 'gas particles hitting the inside walls', ['the rubber pulling inwards only', 'the gas particles growing', 'heat escaping'], 'Billions of collisions every second push the balloon outwards. Heating makes them move faster and hit harder.', choiceOnly),
  fact('pt.sublimation', 'particles', 'When a solid turns straight into a gas without melting, it is called…', 'sublimation', ['condensation', 'evaporation', 'diffusion'], 'Dry ice (solid carbon dioxide) sublimes, making the “smoke” used on stage.'),
  fact('pt.flow', 'particles', 'Which state of matter has a fixed volume but takes the shape of its container?', 'liquid', ['solid', 'gas', 'none of them'], 'Liquids keep their volume but flow to fill the bottom of a container. Gases fill the whole container.'),
  fact('pt.ice', 'particles', 'Why does ice float on water?', 'ice is less dense than liquid water', ['ice is lighter because it is cold', 'ice contains air bubbles only', 'water pushes all solids up'], 'Water is unusual: as it freezes, its particles form an open pattern that takes up more space, so ice is less dense.', choiceOnly),

  // --- cells
  mcq('cl.d1', 'cells', 'Do plant cells have mitochondria?', [['Yes: plants respire to release energy, just like animals', true], ['No: plants get energy by photosynthesis instead', false, 'Plants photosynthesise to make food (glucose), but they still need mitochondria to release the energy from it by respiration, day and night.'], ['Only plants that live in the dark', false, 'All plant cells that are alive respire.']], 'Photosynthesis makes glucose; respiration in the mitochondria releases its energy. Plants do both.'),
  mcq('cl.d2', 'cells', 'Which of these is made of cells?', [['All living things, including you', true], ['Only animals, not plants or fungi', false, 'Plants, fungi and bacteria are all made of cells too.'], ['Only things you can see moving', false, 'Trees don’t move about but are made of billions of cells.']], 'Every living thing is made of one or more cells. That is one of the big ideas of biology.'),
  part('cl.nucleus', 'cells', 'cell-animal', 'nucleus', 'nucleus', 'The nucleus controls the cell and contains genetic material (DNA).'),
  part('cl.cytoplasm', 'cells', 'cell-animal', 'cytoplasm', 'cytoplasm', 'Cytoplasm is the jelly where most of the cell’s chemical reactions happen.'),
  part('cl.membrane', 'cells', 'cell-animal', 'membrane', 'cell membrane', 'The cell membrane controls what goes in and out of the cell.', { accept: ['membrane'] }),
  part('cl.mito', 'cells', 'cell-animal', 'mitochondria', 'mitochondria', 'Mitochondria are where respiration happens, releasing energy.', { accept: ['mitochondrion'] }),
  part('cl.wall', 'cells', 'cell-plant', 'wall', 'cell wall', 'The cell wall is made of cellulose. It is strong and supports the plant cell. Animal cells don’t have one.', { accept: ['wall'] }),
  part('cl.chloro', 'cells', 'cell-plant', 'chloroplasts', 'chloroplasts', 'Chloroplasts contain green chlorophyll and are where photosynthesis happens.', { accept: ['chloroplast'] }),
  part('cl.vacuole', 'cells', 'cell-plant', 'vacuole', 'vacuole', 'The vacuole is filled with cell sap and keeps the cell firm.'),
  fact('cl.ribosome-job', 'cells', 'What do ribosomes do?', 'make proteins', ['release energy', 'control the cell', 'make glucose'], 'Ribosomes are tiny structures that build proteins.'),
  fact('cl.plant-only', 'cells', 'Which three parts do plant cells have that animal cells do not?', 'cell wall, chloroplasts and a permanent vacuole', ['nucleus, membrane and cytoplasm', 'mitochondria, ribosomes and a nucleus', 'cell wall, nucleus and mitochondria'], 'Both have a nucleus, cytoplasm, membrane, mitochondria and ribosomes.', choiceOnly),
  fact('cl.hooke', 'cells', 'Who first used the word “cell” after looking at cork through a microscope in 1665?', 'Robert Hooke', ['Charles Darwin', 'Isaac Newton', 'Louis Pasteur'], 'Hooke thought the tiny boxes in cork looked like the small rooms (cells) monks lived in.'),
  fact('cl.mag', 'cells', 'A microscope has a ×10 eyepiece and a ×40 objective lens. What is the total magnification?', '×400', ['×50', '×4', '×30'], 'Total magnification = eyepiece × objective = 10 × 40 = 400.', choiceOnly),
  order('cl.levels', 'cells', 'Put these in order, from smallest to largest.', ['cell', 'tissue', 'organ', 'organ system', 'organism'], ['e.g. muscle cell', 'muscle tissue', 'the heart', 'circulatory system', 'you'], 'Cells group into tissues, tissues into organs, organs into organ systems, and systems make an organism.'),
  fact('cl.rbc', 'cells', 'Which specialised cell has no nucleus, leaving more room to carry oxygen?', 'red blood cell', ['nerve cell', 'root hair cell', 'sperm cell'], 'Red blood cells are packed with haemoglobin, which carries oxygen.'),
  fact('cl.roothair', 'cells', 'Which plant cell has a long thin extension to absorb water from the soil?', 'root hair cell', ['palisade cell', 'guard cell', 'red blood cell'], 'The long “hair” gives a large surface area for absorbing water and minerals.'),
  fact('cl.nerve', 'cells', 'Which cell is long and thin to carry electrical signals around the body?', 'nerve cell', ['red blood cell', 'muscle cell', 'sperm cell'], 'Some nerve cells are over a metre long, running from your spine to your toes.', { accept: ['neurone', 'neuron', 'nerve cell'] }),

  // --- atoms
  mcq('at.d1', 'atoms', 'Is a compound the same as a mixture?', [['No: a compound’s elements are chemically joined', true], ['Yes, they are two words for the same thing', false, 'They are very different. Iron and sulfur mixed can be separated with a magnet; iron sulfide, a compound, cannot.'], ['Only when both are liquids at room temperature', false, 'The difference is about chemical bonds, not the state.']], 'Water (H₂O) is a compound: hydrogen and oxygen are chemically bonded. Air is a mixture of different gases.'),
  fact('at.element', 'atoms', 'A substance made of only one type of atom is called…', 'an element', ['a compound', 'a mixture', 'a molecule only'], 'Gold, oxygen and carbon are elements.', { accept: ['element'] }),
  fact('at.compound', 'atoms', 'A substance made of two or more elements chemically joined is called…', 'a compound', ['an element', 'a mixture', 'a solution'], 'Water, carbon dioxide and salt are compounds.', { accept: ['compound'] }),
  fact('at.count', 'atoms', 'Roughly how many elements are known?', 'about 118', ['about 12', 'about 1000', 'exactly 100'], 'About 118, of which around 90 occur naturally.', choiceOnly),
  fact('at.mendeleev', 'atoms', 'Which scientist arranged the elements into the first periodic table in 1869, leaving gaps for undiscovered ones?', 'Dmitri Mendeleev', ['Marie Curie', 'John Dalton', 'Isaac Newton'], 'Mendeleev’s gaps were later filled by elements with the properties he predicted.', { accept: ['mendeleev'] }),
  fact('at.o', 'atoms', 'What is the chemical symbol for oxygen?', 'O', ['Ox', 'Og', 'X'], 'Oxygen is O. H is hydrogen, C is carbon, N is nitrogen.', { strict: true }),
  fact('at.na', 'atoms', 'Which element has the symbol Na?', 'sodium', ['nitrogen', 'neon', 'nickel'], 'Na comes from its Latin name, natrium.'),
  fact('at.fe', 'atoms', 'Which element has the symbol Fe?', 'iron', ['fluorine', 'lead', 'fermium'], 'Fe comes from the Latin ferrum. “Ferrous” metals contain iron.'),
  fact('at.au', 'atoms', 'Which element has the symbol Au?', 'gold', ['silver', 'aluminium', 'argon'], 'Au from aurum, Latin for gold. Silver is Ag (argentum).'),
  fact('at.h2o', 'atoms', 'What does the formula H₂O tell you about a water molecule?', 'it has 2 hydrogen atoms and 1 oxygen atom', ['it has 2 oxygen atoms and 1 hydrogen atom', 'it is made of 20 atoms', 'it has 2 hydrogen molecules and an oxygen gas'], 'The small 2 belongs to the H in front of it.', choiceOnly),
  fact('at.co2', 'atoms', 'What is the formula of carbon dioxide?', 'CO₂', ['C₂O', 'CO', 'CaO'], 'One carbon atom and two oxygen atoms (di- means two).', choiceOnly),
  fact('at.air', 'atoms', 'Which gas makes up about 78% of the air?', 'nitrogen', ['oxygen', 'carbon dioxide', 'hydrogen'], 'Air is about 78% nitrogen, 21% oxygen and 1% other gases including carbon dioxide.'),
  fact('at.metals', 'atoms', 'On the periodic table, where are most metals found?', 'left and middle', ['on the far right', 'along the top row', 'only along the bottom two rows'], 'Non-metals are on the right. The staircase line separates them.', choiceOnly),

  // --- separating
  mcq('sp7.d1', 'separating', 'A carton says “100% pure orange juice”. To a scientist, is it a pure substance?', [['No: it is a mixture of substances', true], ['Yes, because nothing has been added to it', false, 'In everyday language “pure” means nothing added. In science a pure substance contains only one substance.'], ['Yes, as long as it is freshly squeezed', false, 'Fresh juice is still a mixture of many substances.']], 'A pure substance contains only one element or compound, and melts and boils at fixed temperatures.'),
  fact('sp7.solute', 'separating', 'In salt water, the salt is the solute. What is the water?', 'the solvent', ['the solution', 'the residue', 'the filtrate'], 'Solute + solvent = solution.', { accept: ['solvent'] }),
  fact('sp7.saturated', 'separating', 'A solution in which no more solute can dissolve is called…', 'saturated', ['concentrated', 'pure', 'diluted'], 'Warming the solvent usually lets more solid dissolve.'),
  fact('sp7.distil', 'separating', 'Which method could get pure drinking water from sea water?', 'distillation', ['filtration', 'chromatography', 'sieving'], 'Distillation boils the water off and condenses the steam, leaving the salt behind.'),
  fact('sp7.chrom', 'separating', 'Which method separates the different coloured dyes in an ink?', 'chromatography', ['distillation', 'filtration', 'evaporation'], 'The dyes travel up the paper at different speeds, so they separate.'),
  fact('sp7.crystal', 'separating', 'How can you get large crystals of salt from salt solution?', 'evaporate it slowly', ['filter it through paper', 'freeze it very quickly', 'boil it dry rapidly'], 'Slow evaporation gives the crystals time to grow.', choiceOnly),
  fact('sp7.mp', 'separating', 'How can a scientist test whether a substance is pure?', 'check it melts at one exact temperature', ['check that it tastes the same throughout', 'see whether it is clear and see-through', 'weigh it before and after heating'], 'Pure water boils at exactly 100°C; impurities change and spread out the boiling and melting points.', choiceOnly),
  order('sp7.order', 'separating', 'To get pure salt from rock salt (salt mixed with sand), put the steps in order.', ['crush the rock salt', 'stir it into warm water', 'filter out the sand', 'evaporate the water'], null, 'The salt dissolves but the sand does not. Filter, then evaporate the filtrate to get the salt back.'),

  // --- acids
  mcq('ac.d1', 'acids', 'Are all acids dangerous?', [['No: some, like vinegar, are safe to eat', true], ['Yes, all acids burn your skin badly', false, 'Strong acids are dangerous, but weak acids are in lots of foods.'], ['Only the acids that are brightly coloured', false, 'Colour has nothing to do with it.']], 'Strong acids (like concentrated hydrochloric acid) are corrosive. Weak acids give food a sour taste.'),
  tmpl('ac.ph', 'acids', 'phScale', [-1, 0, 0.8]),
  fact('ac.range', 'acids', 'The pH scale runs from 0 to…', '14', ['7', '10', '100'], 'pH 0 to 14: below 7 acid, 7 neutral, above 7 alkali.'),
  fact('ac.litmus', 'acids', 'What colour does an acid turn blue litmus paper?', 'red', ['blue', 'green', 'purple'], 'Acids turn blue litmus red; alkalis turn red litmus blue.'),
  fact('ac.neutral', 'acids', 'Acid + alkali → ? + water', 'salt', ['sugar', 'oxygen', 'more acid'], 'Neutralisation makes a salt and water. Hydrochloric acid + sodium hydroxide → sodium chloride (table salt) + water.'),
  fact('ac.stomach', 'acids', 'Which acid does your stomach make to help digest food and kill bacteria?', 'hydrochloric acid', ['sulfuric acid', 'citric acid', 'carbonic acid'], 'Stomach acid has a pH of about 1 to 2.', choiceOnly),
  fact('ac.indigestion', 'acids', 'Why do indigestion tablets work?', 'they neutralise excess stomach acid', ['they add more acid to digest the food', 'they cool and calm the stomach lining', 'they coat the stomach with sugar'], 'Neutralisation in everyday life!', choiceOnly),
  fact('ac.corrosive', 'acids', 'A hazard symbol showing liquid eating through a hand and a surface means…', 'corrosive', ['flammable', 'toxic', 'explosive'], 'Corrosive substances destroy living tissue and materials. Wear goggles!'),

  // --- forces and motion
  mcq('f7.d1', 'forces7', 'A car moves along a straight road at a steady 30 mph. What can you say about the forces on it?', [['They are balanced: the driving force equals the resistive forces', true], ['The forward force must be bigger, or it would stop', false, 'If the forward force were bigger the car would speed up. Steady speed means balanced forces.'], ['There are no forces on it', false, 'There are forces (engine, friction, air resistance); they just cancel out.']], 'Balanced forces mean no change in motion: stay still, or keep moving at the same speed in the same direction.'),
  tmpl('f7.speed', 'forces7', 'speed'),
  tmpl('f7.weight', 'forces7', 'weight', [-0.8, 0.2, 0.5]),
  fact('f7.resultant', 'forces7', 'A box has 10 N pushing it right and 4 N friction pulling left. What is the resultant force?', '6 N to the right', ['14 N to the right', '6 N to the left', '0 N'], 'Opposite forces subtract: 10 − 4 = 6 N, in the direction of the bigger force.', choiceOnly),
  fact('f7.flat', 'forces7', 'On a distance–time graph, what does a flat (horizontal) line mean?', 'it is stationary', ['it is moving at a steady high speed', 'it is speeding up steadily', 'it is going back towards the start'], 'Distance isn’t changing, so it has stopped. A steeper line means faster.', choiceOnly),
  fact('f7.steep', 'forces7', 'On a distance–time graph, a steeper straight line means…', 'a faster speed', ['a slower speed', 'stopping', 'going uphill'], 'More distance in the same time = faster.', choiceOnly),
  fact('f7.hooke', 'forces7', 'If you double the force on a spring (without overstretching it), its extension…', 'doubles', ['halves', 'stays the same', 'goes up four times'], 'Hooke’s law: extension is proportional to force, up to the limit of proportionality.', choiceOnly),
  fact('f7.mass', 'forces7', 'An astronaut goes from Earth to the Moon. What happens to her mass?', 'it stays the same', ['it gets smaller', 'it gets bigger', 'it becomes zero'], 'Mass is the amount of matter and doesn’t change. Her weight is about one-sixth.', choiceOnly),

  // --- energy
  mcq('en.d1', 'energy', 'When a phone battery goes flat, what has happened to the energy?', [['It has been transferred to other stores, mostly heating the surroundings', true], ['It has been used up and no longer exists', false, 'Energy is never destroyed. It is transferred, and much of it ends up as thermal energy in the surroundings (dissipated).'], ['It has turned into electricity and gone back into the plug', false, 'It doesn’t go back to the plug.']], 'The law of conservation of energy: energy cannot be created or destroyed, only transferred between stores.'),
  fact('en.unit', 'energy', 'What unit is energy measured in?', 'joules', ['watts', 'newtons', 'volts'], 'Energy in joules (J). Power, the rate of energy transfer, is in watts (W).', { accept: ['joule', 'j'] }),
  fact('en.kinetic', 'energy', 'A moving object has energy in which store?', 'kinetic', ['gravitational potential', 'elastic', 'nuclear'], 'The faster it moves, the more energy in its kinetic store.'),
  fact('en.gpe', 'energy', 'A book lifted onto a high shelf gains energy in which store?', 'gravitational potential', ['kinetic (movement)', 'elastic potential', 'chemical potential'], 'The higher it is raised, the more energy in its gravitational potential store.', choiceOnly),
  fact('en.chem', 'energy', 'Food, fuels and batteries all store energy in which store?', 'chemical', ['thermal', 'kinetic', 'magnetic'], 'Chemical reactions transfer this energy, for example respiration in your cells.'),
  fact('en.elastic', 'energy', 'A stretched catapult elastic stores energy in which store?', 'elastic potential', ['kinetic (movement)', 'chemical potential', 'gravitational potential'], 'When released, the energy is transferred to the kinetic store of the stone.', choiceOnly),
  fact('en.renewable', 'energy', 'Which of these energy resources is renewable?', 'wind', ['coal', 'natural gas', 'oil'], 'Renewables (wind, solar, hydroelectric, tidal, geothermal, biomass) won’t run out.'),
  fact('en.fossil', 'energy', 'Burning fossil fuels releases which gas that contributes to climate change?', 'carbon dioxide', ['oxygen', 'nitrogen', 'helium'], 'Coal, oil and gas formed from ancient living things. Burning them releases carbon dioxide.'),
  fact('en.power', 'energy', 'What unit is power measured in?', 'watts', ['joules', 'newtons', 'amps'], 'A 60 W bulb transfers 60 joules every second.', { accept: ['watt', 'w'] }),
  order('en.ball', 'energy', 'A ball is thrown straight up and caught. Put the main energy stores in order.', ['chemical (in your muscles)', 'kinetic (ball moving up)', 'gravitational potential (ball at the top)', 'kinetic (ball falling)'], null, 'Chemical → kinetic → gravitational potential → kinetic. Some energy is dissipated to the surroundings by air resistance.'),

  // --- universe
  mcq('un.d1', 'universe', 'Is the Sun the biggest star in the universe?', [['No: it is an average-sized star', true], ['Yes, that is why it looks so bright', false, 'It looks bright because it is close. Some stars are over 1000 times wider than the Sun.'], ['The Sun is a planet, not a star', false, 'The Sun is a star, the closest one to us.']], 'The Sun looks biggest and brightest only because it is about 150 million km away; the next nearest star is about 40 trillion km away.'),
  mcq('un.d2', 'universe', 'A light-year is a measure of…', [['distance', true], ['time', false, 'Despite the name, it is a distance, about 9.5 trillion km.'], ['brightness', false, 'It measures distance, not brightness.']], 'Light travels about 300 000 km every second, so in a year it goes about 9.5 trillion km.'),
  fact('un.galaxy', 'universe', 'What is the name of our galaxy?', 'the Milky Way', ['Andromeda', 'the Solar System', 'Orion'], 'The Milky Way contains hundreds of billions of stars. Andromeda is our nearest large neighbouring galaxy.', { accept: ['milky way'] }),
  fact('un.nearest', 'universe', 'After the Sun, which is the nearest star to Earth?', 'Proxima Centauri', ['Sirius', 'the Pole Star', 'Betelgeuse'], 'Proxima Centauri is about 4.2 light-years away.'),
  fact('un.sunlight', 'universe', 'About how long does light from the Sun take to reach Earth?', 'about 8 minutes', ['about 1 second', 'about 8 days', 'about a year'], 'So when you see the Sun, you see it as it was about 8 minutes ago. (Never look straight at it!)', choiceOnly),
  fact('un.orbit', 'universe', 'What keeps the planets in orbit around the Sun?', 'gravity', ['magnetism', 'the solar wind', 'friction'], 'The Sun’s gravity pulls on the planets, bending their paths into orbits.'),
  fact('un.solar-eclipse', 'universe', 'A solar eclipse happens when…', 'the Moon passes between the Sun and the Earth', ['the Earth passes between the Sun and the Moon', 'the Sun passes behind a planet', 'clouds cover the Sun'], 'In a lunar eclipse, the Earth is between the Sun and the Moon.', choiceOnly),
  fact('un.belt', 'universe', 'The asteroid belt lies between which two planets?', 'Mars and Jupiter', ['Earth and Mars', 'Jupiter and Saturn', 'Venus and Earth'], 'Millions of rocky asteroids orbit there.', choiceOnly),
  fact('un.gas-giants', 'universe', 'Which two planets are “gas giants”?', 'Jupiter and Saturn', ['Mercury and Venus', 'Earth and Mars', 'Venus and Mars'], 'Jupiter and Saturn are mostly hydrogen and helium. Uranus and Neptune are “ice giants”.', choiceOnly),

  // --- ecosystems
  mcq('ec.d1', 'ecosystems', 'Where does a tree get most of the material to build its trunk and leaves?', [['From carbon dioxide in the air', true], ['From minerals in the soil', false, 'A common idea! In the 1600s van Helmont grew a willow tree for 5 years: it gained about 74 kg, but the soil lost only about 60 g.'], ['From water taken up by its roots', false, 'Water matters, but most of the dry mass comes from carbon in carbon dioxide.']], 'Photosynthesis: carbon dioxide + water → glucose + oxygen, using light energy. The plant builds itself from that glucose.'),
  mcq('ec.d2', 'ecosystems', 'In the food chain grass → rabbit → fox, what do the arrows show?', [['The direction energy flows', true], ['Which animal eats which, pointing at the food', false, 'The arrow points TO the eater, showing where the energy goes.'], ['Which living thing is biggest', false, 'Arrows are about energy transfer, not size.']], 'Arrows always point from the thing eaten to the eater.'),
  fact('ec.producer', 'ecosystems', 'In a food chain, what is a green plant called?', 'a producer', ['a consumer', 'a predator', 'a decomposer'], 'Producers make their own food by photosynthesis. Every food chain starts with one.', { accept: ['producer'] }),
  fact('ec.photosynthesis', 'ecosystems', 'Complete the word equation: carbon dioxide + water → glucose + ?', 'oxygen', ['carbon dioxide', 'nitrogen', 'salt'], 'Photosynthesis releases the oxygen we breathe.'),
  fact('ec.chlorophyll', 'ecosystems', 'Which green chemical in leaves absorbs light for photosynthesis?', 'chlorophyll', ['chloroplast', 'haemoglobin', 'cellulose'], 'Chlorophyll is found inside chloroplasts.'),
  fact('ec.herbivore', 'ecosystems', 'An animal that eats only plants is called a…', 'herbivore', ['carnivore', 'omnivore', 'predator'], 'Rabbits, deer and cows are herbivores.'),
  fact('ec.decomposer', 'ecosystems', 'Fungi and bacteria that break down dead material are called…', 'decomposers', ['producers', 'predators', 'herbivores'], 'Decomposers return nutrients to the soil for plants to use again.', { accept: ['decomposer'] }),
  mcq('ec.web', 'ecosystems', 'In a woodland food web, a disease kills most of the owls, which eat mice. What happens to the mice first?', [['Their numbers increase', true], ['They all die from the same disease', false, 'The mice don’t catch the owls’ disease; they lose a predator.'], ['Their numbers stay exactly the same', false, 'Living things in a food web depend on each other (interdependence).']], 'Then, with more mice, the plants and seeds they eat may decrease. Changes ripple through the web.'),
  fact('ec.bees', 'ecosystems', 'Why are bees so important to many food crops?', 'they pollinate the flowers', ['they eat the pests that harm crops', 'they make the soil richer', 'they carry water to the plants'], 'About a third of the food we eat depends on pollinators.', choiceOnly),
  order('ec.chain', 'ecosystems', 'Put this food chain in order, starting with the producer.', ['seaweed', 'periwinkle (sea snail)', 'crab', 'gull'], ['producer', 'primary consumer', 'secondary consumer', 'tertiary consumer'], 'Energy flows from the producer through each consumer in turn.'),

  // --- reproduction
  mcq('rp.d1', 'reproduction', 'Why do many flowers have brightly coloured petals and a sweet scent?', [['To attract insects that carry pollen', true], ['To scare away animals that eat them', false, 'The colours and scents attract animals; they don’t scare them.'], ['Just to look pretty for people', false, 'Flowers evolved long before people. The colours attract pollinators.']], 'Insect-pollinated flowers offer nectar as a reward. Wind-pollinated flowers, like grasses, are small and dull.'),
  part('rp.petal', 'reproduction', 'flower', 'petal', 'petal', 'Petals are often brightly coloured to attract insects.'),
  part('rp.sepal', 'reproduction', 'flower', 'sepal', 'sepal', 'Sepals protect the flower when it is a bud.'),
  part('rp.anther', 'reproduction', 'flower', 'anther', 'anther', 'The anther makes pollen, which carries the male sex cells. Anther + filament = stamen.'),
  part('rp.filament', 'reproduction', 'flower', 'filament', 'filament', 'The filament is the stalk that holds up the anther.'),
  part('rp.stigma', 'reproduction', 'flower', 'stigma', 'stigma', 'The sticky stigma catches pollen.'),
  part('rp.style', 'reproduction', 'flower', 'style', 'style', 'The style connects the stigma to the ovary.'),
  part('rp.ovary', 'reproduction', 'flower', 'ovary', 'ovary', 'The ovary contains ovules, which hold the female sex cells. Stigma + style + ovary = carpel.'),
  fact('rp.pollination', 'reproduction', 'The transfer of pollen from an anther to a stigma is called…', 'pollination', ['fertilisation', 'germination', 'dispersal'], 'Pollination comes first; fertilisation happens later, when the pollen nucleus joins the ovule nucleus.'),
  fact('rp.sycamore', 'reproduction', 'Sycamore seeds have “wings” that spin. How are they dispersed?', 'by the wind', ['by animals eating them', 'by water', 'by exploding pods'], 'Spinning slows their fall, so the wind carries them further from the parent tree.'),
  fact('rp.burdock', 'reproduction', 'Burdock seeds have tiny hooks. How are they dispersed?', 'by animals', ['by the wind', 'by water', 'by bursting open'], 'Velcro was invented after an engineer studied burdock burrs!', choiceOnly),
  fact('rp.gametes', 'reproduction', 'In humans, what are the male and female sex cells (gametes) called?', 'sperm and egg', ['pollen and ovule', 'cell and nucleus', 'embryo and fetus'], 'Fertilisation happens when a sperm cell joins with an egg cell.', choiceOnly),
  fact('rp.gestation', 'reproduction', 'About how long does a human baby develop in the uterus before birth?', 'about 9 months', ['about 3 months', 'about 12 months', 'about 6 months'], 'This time is called gestation.', choiceOnly),
  fact('rp.placenta', 'reproduction', 'Which organ passes oxygen and nutrients from the mother to the developing baby?', 'the placenta', ['the ovary', 'the lungs', 'the stomach'], 'The placenta is joined to the baby by the umbilical cord.', { accept: ['placenta'] }),

  // --- working scientifically
  tmpl('wk.variables', 'working', 'variables', [-0.8, -0.3, 0.3]),
  tmpl('wk.mean', 'working', 'meanResults', [-0.6, 0.2, 0.6]),
  fact('wk.accurate', 'working', 'A measurement that is very close to the true value is…', 'accurate', ['precise', 'anomalous', 'repeatable only'], 'Accurate = close to the true value. Precise = repeat readings are close to each other.'),
  fact('wk.precise', 'working', 'Repeat readings that are all very close to each other are…', 'precise', ['accurate', 'anomalous', 'biased'], 'Readings can be precise but not accurate, for example if a scale always reads 2 g too high.'),
  fact('wk.anomaly', 'working', 'A result that doesn’t fit the pattern of the others is called…', 'anomalous', ['accurate', 'controlled', 'dependent'], 'Check for mistakes, repeat it, and leave it out of the mean if there is a good reason.', { accept: ['an anomaly', 'anomaly', 'an anomalous result'] }),
  fact('wk.linegraph', 'working', 'If both variables are numbers that can take any value (like temperature and time), which graph should you draw?', 'a line graph', ['a bar chart', 'a pie chart', 'a pictogram'], 'Use a bar chart when the independent variable is in categories, such as types of material.', choiceOnly),
  fact('wk.repeat', 'working', 'Why do scientists repeat measurements?', 'to make the results more reliable', ['to make the experiment fairer to all', 'to change the independent variable', 'because the first one is always wrong'], 'Repeats show whether results are consistent.', choiceOnly),
  fact('wk.hypothesis', 'working', 'An idea that can be tested by an experiment is called a…', 'hypothesis', ['conclusion', 'variable', 'method'], 'For example: “Sugar dissolves faster in warmer water because the particles move faster.”'),
];

// Memory hooks (mnemonics) and real-world examples, shown on the learn card and after a
// wrong answer. Keyed by item id without the `science.` prefix; merged in below.
const MEMORY = {
  // --- particles
  'pt.d1': { hook: 'Particles never grow: heated, they **jiggle** more and need more room.', example: 'Bridges and railway tracks have small gaps so they can expand on hot days without buckling.' },
  'pt.d2': { hook: 'Between gas particles there is **nothing**: just empty space.', example: 'Block the end of a bike pump and push: the air squashes because there is empty space between its particles.' },
  'pt.solid': { hook: 'Solid: particles in neat rows, **vibrating on the spot**, like fidgety pupils sitting in assembly.', example: 'An ice cube keeps its shape until it starts to melt.' },
  'pt.liquid': { hook: 'Liquid: particles **touching but sliding** past each other, like people in a busy corridor.', example: 'Pour juice from a carton into a glass: it flows and takes the shape of the glass.' },
  'pt.gas': { hook: 'Gas: particles **far apart and zooming** in all directions, like a playground at break time.', example: 'Air from a pump spreads into every part of a bike tyre.' },
  'pt.diffusion': { hook: 'Diffusion: particles spread from crowded to empty, like people leaving a packed lift.', example: 'You can smell toast from upstairs, and a drop of squash slowly colours a whole glass of water.' },
  'pt.compress': { hook: 'A gas has room to squash; a liquid is already packed tight.', example: 'A bike pump squashes air into a tyre, but you can’t squash water in a sealed syringe.' },
  'pt.pressure': { hook: 'Gas pressure = billions of tiny particle punches on the walls every second.', example: 'A football left in hot sun feels harder: the warmer air particles hit the inside faster and harder.' },
  'pt.sublimation': { hook: 'Sublimation **skips the liquid**: solid straight to gas.', example: 'On cold, dry, sunny days, snow can slowly vanish without melting first: it sublimes.' },
  'pt.flow': { hook: 'Liquids keep their **volume** but borrow their container’s **shape**.', example: '500 ml of water is still 500 ml in a tall glass or a wide bowl.' },
  'pt.ice': { hook: 'Water is the odd one out: its solid floats on its liquid.', example: 'Ice cubes float in a drink, and ponds freeze from the top down, so fish survive underneath.' },

  // --- cells
  'cl.d1': { hook: 'Photosynthesis **makes** the food; respiration **releases** its energy. Plants do both.' },
  'cl.d2': { hook: '**All** living things are made of cells: a bacterium is one cell; you are about 37 trillion.', example: 'Even the mould on old bread and the moss on a wall are made of cells.' },
  'cl.nucleus': { hook: 'The nucleus is the cell’s **control centre**, holding the instructions (DNA).' },
  'cl.cytoplasm': { hook: 'Cytoplasm is the cell’s jelly-like kitchen, where most reactions are cooked up.' },
  'cl.membrane': { hook: 'The membrane is the cell’s **security guard**, deciding what goes in and out.' },
  'cl.mito': { hook: '**Mitochondria are the powerhouse of the cell.**', example: 'Muscle cells, which work hard, are packed with extra mitochondria.' },
  'cl.wall': { hook: 'A cell **wall** is a strong box around a plant cell, made of cellulose.', example: 'Paper and cotton are made of cellulose, the same stuff as plant cell walls.' },
  'cl.chloro': { hook: '**Chloro-** means green: green chloroplasts catch sunlight for photosynthesis.', example: 'Leaves are green because their cells are packed with chloroplasts; roots underground have none.' },
  'cl.vacuole': { hook: 'The vacuole is the cell’s **water balloon**: full of sap, keeping it firm.', example: 'A droopy pot plant perks up after watering as its vacuoles fill up again.' },
  'cl.ribosome-job': { hook: 'Ribosomes are tiny **protein factories**.' },
  'cl.plant-only': { hook: 'Plant extras: a **wall** to stand tall, **chloroplasts** to catch light, a **vacuole** to stay firm.' },
  'cl.hooke': { hook: '**Hooke** looked at cork and saw rows of tiny rooms, like monks’ **cells**.', example: 'A cork from a bottle is the same material Hooke looked at.' },
  'cl.mag': { hook: 'Total magnification: **multiply**, don’t add. Eyepiece × objective.', example: 'Under ×400, a hair about a tenth of a millimetre wide would look 4 centimetres wide.' },
  'cl.levels': { hook: 'Bricks → walls → rooms → floors → house: cell → tissue → organ → system → organism.' },
  'cl.rbc': { hook: 'Red blood cells ditch the nucleus to make room for more oxygen-carrying haemoglobin.', example: 'Blood is red because of the iron-containing haemoglobin in red blood cells.' },
  'cl.roothair': { hook: 'Root hair cells are long thin straws in the soil, drinking up water.', example: 'Gently pull up a seedling grown on damp kitchen roll: the fuzz on its roots is root hairs.' },
  'cl.nerve': { hook: 'Nerve cells are the body’s **wires**: long and thin to carry electrical signals.', example: 'Stub your toe and a signal races along nerve cells up your leg to your spinal cord.' },

  // --- atoms
  'at.d1': { hook: 'Mixture = just **mixed**, easy to separate. Compound = **chemically joined**: a new substance.', example: 'Iron filings and sulfur separate with a magnet; heat them and they make iron sulfide, which won’t.' },
  'at.element': { hook: 'Element = **one** kind of atom only, like a box of identical Lego bricks.', example: 'The copper in electric wires, the carbon in pencil “lead” (graphite) and the helium in a balloon are elements.' },
  'at.compound': { hook: '**Com**pound = **com**bined: different atoms bonded into a new substance.', example: 'Table salt is sodium (a metal that fizzes on water) joined to chlorine (a poisonous gas), yet you sprinkle it on chips.' },
  'at.count': { example: 'Everything you can see, from your desk to your dinner to you, is built from combinations of these elements.' },
  'at.mendeleev': { hook: 'Mendeleev is said to have sorted cards of the elements like a game of patience, leaving gaps for missing ones.' },
  'at.o': { hook: 'Many symbols start with the element’s first letter: **O**xygen, **H**ydrogen, **C**arbon, **N**itrogen.', example: 'Oxygen cylinders in hospitals and ambulances are labelled O₂.' },
  'at.na': { hook: '**Na** from **na**trium. Sodium is the Na in NaCl, table salt.', example: 'Old orange street lights in the UK were sodium lamps.' },
  'at.fe': { hook: '**Fe** from **fe**rrum. “Ferrous” metals contain iron.', example: 'Breakfast cereal boxes often say “fortified with iron”: check the label.' },
  'at.au': { hook: '**Au**: “**A**y, yo**u**! Give me back my gold!”', example: 'Olympic gold medals are mostly silver with a coating of gold.' },
  'at.h2o': { hook: 'The little number belongs to the atom **just before** it: H₂O = two H, one O.', example: 'People often call water “H-two-O” in everyday speech.' },
  'at.co2': { hook: '**Di-** means two: carbon **di**oxide has two oxygens, just as a **di**lemma has two options.', example: 'The bubbles in fizzy drinks are carbon dioxide.' },
  'at.air': { hook: 'Air is nearly **four-fifths nitrogen** and about one-fifth oxygen.', example: 'Crisp packets are often filled with nitrogen to keep the crisps fresh.' },
  'at.metals': { hook: 'Metals on the **left** and middle; non-metals on the **right**; the staircase is the border.' },

  // --- separating
  'sp7.d1': { hook: 'Science “pure” = **one substance only**. Shop “pure” = nothing added.', example: 'Even bottled spring water contains dissolved minerals: check the label.' },
  'sp7.solute': { hook: 'Solute + solvent = solution. The solvent is the liquid that does the dissolving.', example: 'In a glass of squash, water is the solvent and the sugar is a solute.' },
  'sp7.saturated': { hook: 'Saturated = **full up**, like a soaked sponge that can’t hold any more.', example: 'Keep stirring sugar into cold water and eventually grains stay at the bottom: it’s saturated.' },
  'sp7.distil': { hook: 'Distillation: **boil it, cool it, collect it**.', example: 'Sea water evaporates in the sunshine and falls as fresh rain: the water cycle is nature’s distillation.' },
  'sp7.chrom': { hook: '**Chroma** means colour: chromatography is “colour writing”.', example: 'Draw a black felt-tip dot on kitchen roll, dip the edge in water and watch hidden colours spread out.' },
  'sp7.crystal': { hook: 'Slow and steady grows big crystals; rush it and you get tiny ones.', example: 'Sugar crystals grown on a string over several days get big and chunky.' },
  'sp7.mp': { hook: 'Pure = sharp: it melts or boils at **one exact temperature**.', example: 'Gritting roads with salt makes ice melt below 0°C: an impurity changes the melting point.' },
  'sp7.order': { hook: 'Crush, Dissolve, Filter, Evaporate: “**C**ats **D**on’t **F**ancy **E**lephants”.', example: 'The rock salt spread on icy UK roads in winter is mined in Cheshire: salt mixed with sand and clay.' },

  // --- acids
  'ac.d1': { hook: 'Sour = acid. Many weak acids are safe to eat.', example: 'Vinegar on your chips is a weak acid (ethanoic acid); lemon juice contains citric acid.' },
  'ac.ph': { hook: 'pH **7** is neutral: **below** 7 is acid, **above** 7 is alkali.', example: 'Lemon juice is about pH 2, pure water pH 7 and soap about pH 9 to 10.' },
  'ac.range': { hook: '0 to 14, with **7** right in the middle for neutral.', example: 'Lemon juice is about pH 2, pure water pH 7 and soap about pH 9 to 10.' },
  'ac.litmus': { hook: '**BRA**: **B**lue litmus turns **R**ed in **A**cid.', example: 'Red cabbage water is a homemade indicator: lemon juice turns it pink; bicarbonate of soda turns it blue-green.' },
  'ac.neutral': { hook: 'Acid + alkali → salt + water: they cancel each other out.', example: 'Farmers spread lime (an alkali) on fields to neutralise acidic soil.' },
  'ac.stomach': { example: 'The burning feeling of heartburn is stomach acid creeping up into the food pipe.' },
  'ac.indigestion': { hook: 'Too much acid? Add a base to neutralise it.', example: 'Many indigestion tablets contain calcium carbonate, the same chemical as chalk.' },
  'ac.corrosive': { hook: '**Corrosive** things **corrode**: they eat away skin and metal.', example: 'Some oven cleaners and drain unblockers carry the corrosive symbol.' },

  // --- forces and motion
  'f7.d1': { hook: 'Steady speed in a straight line = **balanced** forces. No overall force, no change.', example: 'At a steady 70 mph on a motorway, the engine’s push exactly matches air resistance and friction.' },
  'f7.speed': { hook: '**Speed = distance ÷ time.** In the triangle, D sits on top of S and T.', example: 'UK speed limits are in mph: miles per hour, a distance divided by a time.' },
  'f7.weight': { hook: '**Weight = mass × g**, and on Earth g is about 10 N/kg.', example: 'A 1 kg bag of sugar weighs about 10 N on Earth, but only 1.6 N on the Moon.' },
  'f7.resultant': { hook: 'Same direction: **add**. Opposite directions: **subtract**, and it goes the way of the bigger force.', example: 'In tug of war, the team pulling harder wins: the resultant force points their way.' },
  'f7.flat': { hook: 'Flat line: time ticks on but distance doesn’t, so it has **stopped**.', example: 'A bus waiting at a stop makes a flat line on its distance–time graph.' },
  'f7.steep': { hook: '**Steeper = speedier.**', example: 'A cyclist racing downhill makes a steeper line than someone pushing a bike uphill.' },
  'f7.hooke': { hook: 'Hooke’s law: **double the pull, double the stretch**. (The same Robert Hooke named cells!)', example: 'Overstretch a hair bobble or a spring and it won’t go back to its old shape: it has passed its limit.' },
  'f7.mass': { hook: 'Mass stays, weight changes: same **stuff**, different **pull**.' },

  // --- energy
  'en.d1': { hook: 'Energy is never destroyed: much of it ends up **spread out as heat** (dissipated).', example: 'A phone or laptop feels warm when it’s working hard: energy is heating the surroundings.' },
  'en.unit': { hook: 'Joules = **how much** energy. Watts = **how fast** (joules per second).', example: 'UK food labels show energy in kJ (kilojoules) as well as kcal.' },
  'en.kinetic': { hook: '**Kinetic** and **cinema** both come from the Greek for movement.', example: 'A football flying towards the goal has energy in its kinetic store.' },
  'en.gpe': { hook: 'Higher up = more gravitational potential energy, waiting to fall.', example: 'A rollercoaster’s first big climb fills its gravitational store for the rest of the ride.' },
  'en.chem': { hook: 'Chemical store: energy locked in food, fuels and batteries, released by reactions.', example: 'A burning log, a car’s petrol and the cereal you eat for breakfast all transfer energy from chemical stores.' },
  'en.elastic': { hook: 'Stretch it or squash it, and it stores elastic potential energy to spring back.', example: 'A trampoline stores energy as it stretches down, then bounces you back up.' },
  'en.renewable': { hook: '**Re-new-able**: nature tops it up. Fossil fuels took millions of years to form.', example: 'Huge offshore wind farms in the North Sea now generate a large share of the UK’s electricity.' },
  'en.fossil': { hook: 'Fossil fuels are ancient life, buried and squashed. Burn them and their carbon returns as CO₂.', example: 'A gas hob burns natural gas (methane), releasing carbon dioxide and water.' },
  'en.power': { hook: '**1 watt = 1 joule every second.**', example: 'A UK kettle is about 3000 W; an LED light bulb is about 5 to 10 W.' },
  'en.ball': { hook: 'Muscles → rising → top → falling: **chemical, kinetic, gravitational, kinetic**.', example: 'Throw a ball up in the garden: it slows, pauses for a split second at the top, then speeds up as it falls.' },

  // --- universe
  'un.d1': { hook: 'The Sun is an ordinary star that just lives next door.', example: 'A torch held near you looks brighter than a distant lighthouse: being close makes the Sun look special.' },
  'un.d2': { hook: 'A light-**year** sounds like time, but it’s a **distance**: how far light goes in a year.', example: 'Looking at the stars is looking back in time: you see light that left them years ago.' },
  'un.galaxy': { hook: '**Galaxy** comes from the Greek for milk, so “Milky Way galaxy” says milk twice!', example: 'From a dark place such as Northumberland or Exmoor you can see the Milky Way as a misty band across the sky.' },
  'un.nearest': { hook: '**Proxima** is Latin for “nearest”, as in **proximity**.' },
  'un.sunlight': { hook: 'Sunlight takes about **8 minutes** to reach us: about as long as hard-boiling an egg.' },
  'un.orbit': { hook: 'Gravity is like an invisible string: swing a ball on a string, let go, and it flies off.' },
  'un.solar-eclipse': { hook: '**Solar**: Moon in the middle, blocking the Sun. **Lunar**: Earth in the middle, shadowing the Moon.', example: 'The UK saw a deep partial solar eclipse on 20 March 2015; the next total one visible here is in 2090.' },
  'un.belt': { hook: 'The asteroid belt is a rocky fence between the four rocky planets and the four giants.' },
  'un.gas-giants': { hook: 'Jupiter and Saturn: **gas giants**. Uranus and Neptune: **ice giants**.', example: 'Through a small telescope or good binoculars you can spot Saturn’s rings and Jupiter’s moons.' },

  // --- ecosystems
  'ec.d1': { hook: 'A tree is built mostly from **thin air**: carbon dioxide (plus water).', example: 'Burning a log puts the carbon the tree took from the air back into the air as carbon dioxide.' },
  'ec.d2': { hook: 'Arrows point to the **eater**: read them as “gives energy to”.' },
  'ec.producer': { hook: '**Producers produce** their own food using sunlight.', example: 'Grass in a field, vegetables in a garden and seaweed on a beach are all producers.' },
  'ec.photosynthesis': { hook: '**Photo** = light, **synthesis** = making: making food with light.', example: 'Pondweed in sunlight gives off tiny bubbles: that is oxygen from photosynthesis.' },
  'ec.chlorophyll': { hook: 'Chloro**phyll** is the green **pigment**; chloro**plasts** are the little packets that hold it.', example: 'Leaves turn yellow and red in autumn as the green chlorophyll breaks down.' },
  'ec.herbivore': { hook: '**Herb**ivores eat plants, **carn**ivores eat meat (as in chilli con **carn**e), **omni**vores eat all.', example: 'Sheep and cows grazing on British hillsides are herbivores.' },
  'ec.decomposer': { hook: 'Decomposers are nature’s recyclers, rotting dead things back into nutrients.', example: 'A compost heap, mushrooms on a rotting log and mould on old bread are decomposers at work.' },
  'ec.web': { hook: 'Lose a predator and the prey boom; everything in a food web is linked.' },
  'ec.bees': { hook: 'Bees are flying pollen couriers, carrying pollen from flower to flower.', example: 'Apples, strawberries and blackberries all crop better when bees visit their flowers.' },
  'ec.chain': { hook: 'Every food chain starts with a **producer**, then the arrows point to whoever eats it.', example: 'In a seaside rock pool: seaweed → periwinkles → shore crabs → gulls.' },

  // --- reproduction
  'rp.d1': { hook: 'Bright colours and sweet scents are adverts saying: “Free nectar here!”', example: 'Bees buzzing round lavender in a summer garden are drinking nectar and carrying pollen.' },
  'rp.petal': { hook: 'Petals are the flower’s **billboard**, advertising nectar to insects.' },
  'rp.sepal': { hook: 'Sepals are the bud’s **protective jacket**: the green leafy bits under the petals.', example: 'The green leafy frill on top of a strawberry is its sepals.' },
  'rp.anther': { hook: 'The stamen (anther + filament) is the male part: think “sta-**MEN**”.', example: 'Lily anthers drop orange pollen that stains clothes, so florists often snip them off.' },
  'rp.filament': { hook: 'Filament = a thin stalk, like the thin glowing filament wire in an old light bulb.' },
  'rp.stigma': { hook: 'The **st**igma is **st**icky, to catch pollen.' },
  'rp.style': { hook: 'The style is the neck between stigma and ovary: pollen tubes grow down it.' },
  'rp.ovary': { hook: 'After fertilisation the ovary becomes the **fruit** and the ovules become **seeds**.', example: 'A pea pod is a ripened ovary, and the peas inside were its ovules.' },
  'rp.pollination': { hook: '**P**ollen lands first (**p**ollination); **f**usion of the cells comes later (**f**ertilisation).', example: 'Hay fever is caused by wind-pollinated plants, like grasses, releasing clouds of pollen.' },
  'rp.sycamore': { hook: 'Sycamore seeds are **helicopters**: their spinning wings ride the wind.', example: 'Drop a sycamore seed from a step in autumn and watch it twirl away.' },
  'rp.burdock': { hook: 'Hooked seeds are **hitchhikers**, catching a lift on animal fur.', example: 'Burrs stuck in a dog’s fur or on your socks after a country walk are hitchhiking seeds.' },
  'rp.gametes': { hook: 'Plants: pollen meets ovule. Humans: sperm meets egg. Same idea, different names.' },
  'rp.gestation': { example: 'Different animals take different times: an elephant carries its baby for nearly two years.' },
  'rp.placenta': { hook: 'The placenta is the baby’s **lifeline**: food and oxygen in, waste out, through the umbilical cord.', example: 'Your belly button is where your umbilical cord was once attached.' },

  // --- working scientifically
  'wk.variables': { hook: '**Cows Moo Softly**: **C**hange one thing, **M**easure one thing, keep everything else the **S**ame.' },
  'wk.mean': { hook: 'Mean: **add them all up, then divide by how many** there are.', example: 'Your average score across five spelling tests is a mean.' },
  'wk.accurate': { hook: '**A**ccurate = **A**t the target (the true value).', example: 'Darts all in the bullseye are accurate; darts all clumped together somewhere else are precise but not accurate.' },
  'wk.precise': { hook: '**P**recise = readings **P**acked closely together.', example: 'Kitchen scales that always read 2 g too high give precise but inaccurate results.' },
  'wk.anomaly': { hook: 'An anomaly is the **odd one out** that doesn’t fit the pattern.', example: 'In a set of sprint times, one much slower time might be the race when the runner tripped.' },
  'wk.linegraph': { hook: 'Numbers on both axes? **Line graph**. Categories (names)? **Bar chart**.', example: 'Weather apps show the temperature through the day as a line graph.' },
  'wk.repeat': { hook: 'Once could be luck; repeats show whether there is a real pattern.' },
  'wk.hypothesis': { hook: 'A hypothesis is a **testable** idea with a reason: “I think… because…”' },
};
for (const [id, memory] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `science.${id}`);
  if (!item) throw new Error(`science-y7.mjs: memory hook for unknown item ${id}`);
  Object.assign(item, memory);
}

export default [{ subject: 'science', deck: 'year7', topics, items }];

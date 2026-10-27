// Year 8 science for a strong grammar-school student: KS3 biology, chemistry and physics at
// depth, with working scientifically throughout and GCSE tasters as the stretch tier. Greek
// myth and the Greek scientists add flavour; Mira, Theo and Kit are original characters.
// Calculations are template items (js/gen/y8science.js); labelled diagrams reuse the cell,
// flower and particle maps.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const part = (id, topic, map, feature, answer, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mapfact', map, layer: 'features', feature, answer, explain, choosePrompt: 'Which part is highlighted?', locatePrompt: `Tap the ${answer}.`, namePrompt: 'Name the highlighted part.', ...extra });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'order', prompt, items, labels, explain });
const tmpl = (id, topic, gen, seed = [-1, 0, 1]) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed });
const C = { formats: ['choice'] };
const T = (id, title, kind, prereqs, intro, teach, talk, extra = {}) => ({ id: `science.${id}`, title, kind, prereqs: prereqs.map((p) => `science.${p}`), batch: 5, intro, teach, talk, ...extra });

const topics = [
  // biology
  T('cells', 'Cells and microscopes', 'mixed', [], 'Every living thing is built from cells. With a light microscope you can see the nucleus and the cell wall; an electron microscope shows far smaller parts, like ribosomes.', 'Explain three differences between a plant cell and an animal cell, and what each extra part does.', 'Ask {him} to explain how a microscope’s magnification is worked out.'),
  T('organs', 'Specialised cells, organs and digestion', 'facts', ['cells'], 'Cells → tissues → organs → organ systems. In digestion, enzymes act like molecular scissors, breaking big food molecules into small ones the blood can absorb.', 'Explain the job of an enzyme, using amylase as an example, and why boiling stops it working.', 'At dinner, ask {him} which nutrients in the meal will be broken down by which enzymes.'),
  T('respiration', 'Breathing and respiration', 'facts', ['organs'], 'Breathing moves air in and out; respiration is the chemical reaction in every cell that releases energy from glucose. They are not the same thing!', 'Explain the difference between breathing and respiration, and write the word equation for aerobic respiration.', 'After a sprint, ask {him} why {she} is panting even after stopping (oxygen debt).'),
  T('photosynthesis', 'Photosynthesis and plants', 'facts', ['cells'], 'Plants make their own food: in chloroplasts, light energy turns carbon dioxide and water into glucose and oxygen. Almost every food chain on Earth starts here.', 'Explain the word equation for photosynthesis and three things that could limit its rate.', 'Ask {him} why a plant left in a dark cupboard turns yellow and dies.'),
  T('ecosystems', 'Ecosystems and food webs', 'facts', ['photosynthesis'], 'In an ecosystem every organism depends on others. Energy flows along food chains, but most is lost at each step, which is why there are few top predators.', 'Explain what would happen to a food web if one species disappeared, using a real example.', 'On a walk, ask {him} to build a food chain from what you can see.'),
  T('inheritance', 'DNA, variation and evolution', 'facts', ['cells'], 'DNA in the nucleus carries the genetic code, arranged in genes on chromosomes. Variation, plus natural selection over many generations, explains how species evolve.', 'Explain natural selection using the peppered moth or antibiotic-resistant bacteria.', 'Ask {him} which of {her} features are inherited, which are environmental, and which are both.'),
  T('health', 'Health, microbes and disease', 'facts', ['organs'], 'Bacteria, viruses and fungi can cause disease. Our bodies fight back with white blood cells; vaccines train the immune system in advance. Hippocrates, the Greek “father of medicine”, insisted that diseases have natural causes.', 'Explain how a vaccine protects you without making you ill.', 'Ask {him} why antibiotics do not work against a cold.'),
  // chemistry
  T('particles', 'Particles, states and density', 'mixed', [], 'Democritus, in ancient Greece, guessed that everything is made of tiny uncuttable pieces: atomos. The particle model explains solids, liquids and gases, diffusion and density.', 'Explain, using particles, why a gas fills its container and a solid keeps its shape.', 'Ask {him} why you can smell perfume across a room (diffusion).'),
  T('atoms', 'Elements, compounds and separating mixtures', 'facts', ['particles'], 'An element has one type of atom; a compound has different atoms chemically bonded; a mixture is not chemically joined, so it can be separated by filtering, evaporating, distilling or chromatography.', 'Explain how you would get pure water and pure salt back from salty water.', 'Ask {him} whether air, water and gold are elements, compounds or mixtures.'),
  T('periodic', 'The periodic table', 'facts', ['atoms'], 'Mendeleev arranged the elements so that ones with similar properties line up in columns called groups. He left gaps for elements nobody had found yet, and was proved right.', 'Explain why the elements in Group 1 react in similar ways, and why reactivity increases down the group.', 'Ask {him} to name a metal and a non-metal and give one property of each.'),
  T('reactions', 'Chemical reactions and equations', 'mixed', ['atoms'], 'In a chemical reaction atoms are rearranged into new substances: no atoms are made or destroyed, so mass is conserved. Combustion, oxidation and thermal decomposition are common types.', 'Explain how you can tell a chemical change from a physical change, with two signs of a reaction.', 'Light a candle together and ask {him} what is being made as the wax burns.'),
  T('acids', 'Acids, alkalis and metals', 'facts', ['reactions'], 'Acids have a pH below 7, alkalis above 7. Acid + alkali → salt + water (neutralisation). Metals react with acids to make a salt and hydrogen, and the reactivity series ranks how readily they react.', 'Explain the reactivity series and how it explains why gold is found pure in the ground but iron is not.', 'Ask {him} why indigestion tablets work.'),
  T('earth', 'The Earth and its atmosphere', 'facts', ['reactions'], 'Rocks are recycled over millions of years in the rock cycle; carbon is recycled between air, living things, oceans and rocks. Burning fossil fuels adds carbon dioxide faster than it is removed.', 'Explain how burning fossil fuels contributes to climate change, using the carbon cycle.', 'Ask {him} which rock type a fossil is most likely to be found in, and why.'),
  // physics
  T('forces', 'Forces, motion and pressure', 'mixed', [], 'Forces change an object’s speed, direction or shape. Balanced forces mean constant speed; unbalanced forces mean acceleration. Pressure is force spread over an area; a moment is a turning effect.', 'Explain why a skydiver reaches a terminal velocity.', 'Ask {him} why snowshoes stop you sinking into snow.'),
  T('energy', 'Energy, power and efficiency', 'mixed', ['forces'], 'Energy is stored (kinetic, gravitational, elastic, thermal, chemical, nuclear…) and transferred by forces, heating, electricity and waves. It is never used up, but some is always wasted, usually as heat.', 'Explain the energy transfers when a ball is dropped and bounces lower each time.', 'Check the power rating on the kettle and ask {him} how much a boil costs.'),
  T('electricity', 'Electricity and magnetism', 'mixed', ['energy'], 'Current is the flow of charge; potential difference is the push; resistance opposes the flow. In series, current is the same everywhere; in parallel, current splits. A current also makes a magnetic field.', 'Explain what happens to the brightness of bulbs when you add more in series, and why.', 'Ask {him} why lights in a house are wired in parallel, not series.'),
  T('waves', 'Sound and light', 'mixed', ['energy'], 'Sound is a longitudinal wave that needs a medium; light is a transverse wave that can cross empty space at 300 000 km per second. Both reflect and refract.', 'Explain why you see lightning before you hear thunder.', 'Put a pencil in a glass of water and ask {him} to explain why it looks bent.'),
  T('space', 'Space, gravity and the seasons', 'facts', ['forces'], 'Gravity holds moons around planets and planets around the Sun. The seasons happen because the Earth’s axis is tilted, not because we are nearer the Sun. Eratosthenes measured the Earth’s size more than 2000 years ago using shadows.', 'Explain why it is summer in Britain when the Earth is actually furthest from the Sun.', 'Look for the Moon together and ask {him} what phase it is in and why.'),
  T('working', 'Working scientifically', 'facts', [], 'Good science is about fair tests, careful measurement and honest conclusions. Know your variables, and the difference between accurate, precise and repeatable results.', 'Explain the independent, dependent and control variables in an experiment of your choice.', 'Ask {him} to design a fair test to find the best paper for a paper aeroplane.'),
  // GCSE tasters
  T('atomic', 'Inside the atom: isotopes and bonding', 'facts', ['periodic'], 'Atoms have a tiny nucleus of protons and neutrons, with electrons in shells around it. Atoms bond by transferring electrons (ionic) or sharing them (covalent).', 'Explain the difference between ionic and covalent bonding with an example of each.', 'Ask {him} what carbon-12 and carbon-14 have in common, and what is different.', { tier: 'stretch' }),
  T('spectrum', 'The electromagnetic spectrum', 'facts', ['waves'], 'Visible light is only a small part of a family of waves, from radio to gamma rays, all travelling at the speed of light. Shorter wavelengths carry more energy.', 'Explain why X-rays are useful but dangerous.', 'Ask {him} which electromagnetic waves {she} used today (radio, microwaves, visible light…).', { tier: 'stretch' }),
  T('genetics', 'Genetics and Punnett squares', 'mixed', ['inheritance'], 'Genes come in different versions called alleles. Dominant alleles show up even with just one copy; recessive ones only when both copies match. Punnett squares predict the chances.', 'Explain why two brown-eyed parents can have a blue-eyed child (using a simplified model).', 'Ask {him} to draw a Punnett square for two parents who are both Bb.', { tier: 'stretch' }),
];

const items = [
  // --- cells
  part('cl.nucleus', 'cells', 'cell-animal', 'nucleus', 'nucleus', 'The nucleus contains DNA and controls the cell.'),
  part('cl.membrane', 'cells', 'cell-animal', 'membrane', 'cell membrane', 'The membrane controls what enters and leaves the cell.', { accept: ['membrane'] }),
  part('cl.mito', 'cells', 'cell-animal', 'mitochondria', 'mitochondria', 'Mitochondria are where aerobic respiration releases energy.', { accept: ['mitochondrion'] }),
  part('cl.ribo', 'cells', 'cell-animal', 'ribosomes', 'ribosomes', 'Ribosomes make proteins. They are too small to see with a light microscope.', { accept: ['ribosome'] }),
  part('cl.wall', 'cells', 'cell-plant', 'wall', 'cell wall', 'The cellulose cell wall supports and strengthens a plant cell.', { accept: ['wall'] }),
  part('cl.vacuole', 'cells', 'cell-plant', 'vacuole', 'vacuole', 'The permanent vacuole is filled with cell sap and keeps the cell firm.', { accept: ['permanent vacuole'] }),
  part('cl.chloro', 'cells', 'cell-plant', 'chloroplasts', 'chloroplasts', 'Chloroplasts contain green chlorophyll, which absorbs light for photosynthesis.', { accept: ['chloroplast'] }),
  mcq('cl.which', 'cells', 'Which part is found in plant cells but NEVER in animal cells?', [['Chloroplasts', true], ['Mitochondria', false, 'Both plant and animal cells have mitochondria: both respire.'], ['Nucleus', false, 'Both have a nucleus.'], ['Cell membrane', false, 'Both have a membrane; plants have a wall as well.']], 'Plant cells have three extras: a cell wall, a permanent vacuole and chloroplasts.'),
  mcq('cl.bact', 'cells', 'How is a bacterial cell different from an animal cell?', [['It has no nucleus; its DNA is loose', true], ['It is far bigger than an animal cell', false, 'Bacteria are usually much smaller than animal cells.'], ['It has chloroplasts for photosynthesis', false, 'Bacteria never have chloroplasts (a few, like cyanobacteria, photosynthesise without them).']], 'It has no nucleus: its DNA floats in the cytoplasm. Bacteria are prokaryotes: no nucleus, and often a loop of DNA plus small rings called plasmids.'),
  mcq('cl.stain', 'cells', 'Why do you add a stain such as iodine when preparing an onion cell slide?', [['To make the cell parts show up', true], ['To kill the cells so they keep still', false, 'The point is contrast: cell parts are almost transparent.'], ['To make the cells swell up bigger', false, 'Stains don’t change size.']], 'To make the parts of the cell easier to see. Most cell parts are colourless; stains colour them so they show up.'),
  fact('cl.em', 'cells', 'Which kind of microscope can show ribosomes and the inside of mitochondria?', 'an electron microscope', ['a high-power light microscope', 'a magnifying glass', 'a telescope'], 'Electron microscopes have far higher magnification and resolution than light microscopes.', C),
  tmpl('cl.mag', 'cells', 'y8sMagnify'),

  // --- organs and digestion
  order('or.levels', 'organs', 'Put these in order, from smallest to largest.', ['cell', 'tissue', 'organ', 'organ system', 'organism'], null, 'Cells form tissues, tissues form organs, organs work together in organ systems, and those make up the organism.'),
  mcq('or.sperm', 'organs', 'Why does a sperm cell have lots of mitochondria?', [['To release energy for swimming', true], ['To provide food for the growing egg', false, 'The mitochondria power the sperm itself.'], ['To store energy for the baby later', false, 'That is the egg’s job, which is why eggs are large.']], 'To release energy for swimming with its tail. Specialised cells have features suited to their job: sperm need energy to swim.'),
  mcq('or.rbc', 'organs', 'Why do red blood cells have no nucleus?', [['To leave more room for haemoglobin', true], ['So that they can divide more quickly', false, 'Without a nucleus they cannot divide at all.'], ['Because they are dead before they work', false, 'They are living, specialised cells.']], 'To make more room for haemoglobin to carry oxygen. Their biconcave shape and lack of nucleus help them carry as much oxygen as possible.'),
  mcq('or.enzyme', 'organs', 'What does an enzyme do in digestion?', [['Speeds up breaking big food molecules into small ones', true], ['Absorbs the digested food into the blood', false, 'Absorption happens through the small intestine wall.'], ['Joins small molecules into bigger, longer-lasting ones', false, 'The opposite: digestion makes molecules small enough to absorb.']], 'Enzymes are biological catalysts: they speed up reactions without being used up.'),
  fact('or.amylase', 'organs', 'Which enzyme, found in saliva, breaks starch into sugars?', 'amylase', ['protease', 'lipase', 'haemoglobin'], 'Chew bread for a long time and it starts to taste sweet: amylase at work.'),
  fact('or.protease', 'organs', 'Which type of enzyme breaks proteins into amino acids?', 'protease', ['amylase', 'lipase', 'bile'], 'Proteases work in the stomach (pepsin) and small intestine.', { accept: ['proteases', 'pepsin'] }),
  fact('or.lipase', 'organs', 'Which type of enzyme breaks fats into fatty acids and glycerol?', 'lipase', ['amylase', 'protease', 'insulin'], 'Bile from the liver breaks fat into droplets so lipase can work faster.', { accept: ['lipases'] }),
  mcq('or.villi', 'organs', 'Why is the small intestine lined with millions of tiny villi?', [['They give a huge surface area for absorption', true], ['They grind the food up into smaller pieces', false, 'Teeth do the chewing.'], ['They make the stomach acid that kills microbes', false, 'Acid is made in the stomach.']], 'Villi have thin walls and a good blood supply, so small molecules diffuse into the blood quickly.'),
  mcq('or.boil', 'organs', 'Why does boiling stop an enzyme working?', [['Heat changes the active site’s shape (denatured)', true], ['It kills the enzyme, because enzymes are alive', false, 'Enzymes are proteins, not living things.'], ['The heat dissolves the enzyme in the water', false, 'The enzyme is still there, but its shape is ruined.']], 'The heat changes the shape of its active site, so it is denatured. Enzymes work by shape: the substrate fits the active site like a key in a lock. Too much heat and the lock is bent.'),
  fact('or.acid', 'organs', 'Why is there hydrochloric acid in the stomach?', 'it kills microbes and helps enzymes', ['it digests the fat in food', 'it absorbs water into the blood', 'it makes bile to emulsify fats'], 'It kills microbes and helps stomach enzymes work. Stomach protease (pepsin) works best in acid conditions.', C),

  // --- respiration
  fact('rs.eq', 'respiration', 'Complete the word equation for aerobic respiration: glucose + oxygen → … + water (+ energy released)', 'carbon dioxide', ['oxygen', 'starch', 'nitrogen'], 'glucose + oxygen → carbon dioxide + water. It happens in the mitochondria.', { accept: ['co2', 'CO₂'] }),
  mcq('rs.diff', 'respiration', 'What is the difference between breathing and respiration?', [['Breathing moves air; respiration releases energy in cells', true], ['They are two names for exactly the same process', false, 'A common mix-up: respiration happens in every cell, even in plants.'], ['Respiration only happens in the lungs, breathing everywhere', false, 'It happens in every living cell.']], 'Breathing moves air in and out of the lungs; respiration is a chemical reaction in cells. Plants respire too, day and night, even though they don’t breathe.'),
  fact('rs.anaer', 'respiration', 'In muscles short of oxygen, glucose is turned into… (anaerobic respiration)', 'lactic acid', ['carbon dioxide and water', 'ethanol', 'starch'], 'Lactic acid builds up during hard exercise; you pay back the “oxygen debt” by panting afterwards.', { accept: ['lactate'] }),
  fact('rs.yeast', 'respiration', 'When yeast respires anaerobically it makes ethanol and which gas, which makes bread rise?', 'carbon dioxide', ['oxygen', 'hydrogen sulfide', 'nitrogen'], 'This is fermentation, used in baking and brewing.', { accept: ['co2', 'CO₂'] }),
  mcq('rs.alveoli', 'respiration', 'How are the alveoli in the lungs suited to gas exchange?', [['Huge surface area, thin walls, rich blood supply', true], ['Thick, strong walls to stop them bursting', false, 'Thin walls give a short distance for diffusion.'], ['They are coated in mucus to trap the oxygen', false, 'Mucus is in the airways to trap dust and microbes.']], 'Huge surface area, walls one cell thick, and a rich blood supply. Oxygen diffuses into the blood, and carbon dioxide out, across very thin walls.'),
  mcq('rs.smoke', 'respiration', 'Why do smokers often get breathless?', [['Smoke damages the alveoli and carbon monoxide cuts oxygen carried', true], ['Smoke makes the lungs grow bigger, so they need more air', false, 'Smoking damages the lungs; it does not enlarge them usefully.'], ['Nicotine uses up the oxygen in the blood as it is digested', false, 'Nicotine is an addictive drug, not oxygen.']], 'Tar and smoke damage the alveoli and cilia, and carbon monoxide reduces the oxygen blood can carry. Carbon monoxide binds to haemoglobin more strongly than oxygen does.'),
  order('rs.air', 'respiration', 'Put the route of air into the body in order.', ['nose or mouth', 'trachea', 'bronchus', 'bronchiole', 'alveolus'], null, 'Air goes down the trachea (windpipe), into a bronchus, through ever smaller bronchioles, to the alveoli.'),
  mcq('rs.mito', 'respiration', 'Where in the cell does aerobic respiration take place?', [['Mitochondria', true], ['Nucleus', false, 'The nucleus holds DNA.'], ['Chloroplasts', false, 'Chloroplasts do photosynthesis.']], 'Muscle cells have lots of mitochondria because they need lots of energy.'),

  // --- photosynthesis
  fact('ps.eq', 'photosynthesis', 'Complete the word equation: carbon dioxide + water → glucose + … (using light energy)', 'oxygen', ['carbon dioxide', 'starch', 'nitrogen'], 'Photosynthesis happens in chloroplasts, using light absorbed by chlorophyll.'),
  mcq('ps.limit', 'photosynthesis', 'Which of these does NOT limit the rate of photosynthesis?', [['Oxygen in the air', true], ['Light intensity', false, 'More light means faster photosynthesis, up to a point.'], ['Carbon dioxide concentration', false, 'CO₂ is a raw material, so it can limit the rate.'], ['Temperature around the plant', false, 'Enzymes control photosynthesis, so temperature matters.']], 'The amount of oxygen in the air. Light, CO₂ and temperature are the limiting factors. Oxygen is a product.'),
  mcq('ps.iodine', 'photosynthesis', 'A leaf is tested with iodine and turns blue-black. What does that show?', [['Starch is present: it has photosynthesised', true], ['The leaf contains protein from the soil', false, 'Biuret tests for protein; iodine tests for starch.'], ['The leaf is dead and has stopped working', false, 'It shows starch, made from the glucose of photosynthesis.']], 'Starch is present, so the leaf has been photosynthesising. Plants store glucose as starch. Variegated leaves only go blue-black in the green parts.'),
  mcq('ps.stomata', 'photosynthesis', 'What are stomata?', [['Tiny holes in leaves that let gases in and out', true], ['The tubes in roots that carry water upwards', false, 'Those are xylem vessels.'], ['The green parts of a cell that trap light', false, 'Those are chloroplasts.']], 'Tiny holes, mostly under the leaf, that let gases in and out. Guard cells open and close the stomata; carbon dioxide enters and water vapour escapes.'),
  fact('ps.xylem', 'photosynthesis', 'Which tubes carry water up from the roots to the leaves?', 'xylem', ['phloem', 'stomata', 'veins of chlorophyll'], 'Xylem carries water up; phloem carries dissolved sugars around the plant.'),
  fact('ps.roothair', 'photosynthesis', 'Root hair cells take in water by osmosis. What else do they absorb from the soil?', 'mineral ions', ['glucose', 'oxygen only', 'starch'], 'Plants need minerals such as nitrates (for proteins) and magnesium (for chlorophyll).', { ...C }),
  part('ps.stigma', 'photosynthesis', 'flower', 'stigma', 'stigma', 'The sticky stigma catches pollen.'),
  part('ps.anther', 'photosynthesis', 'flower', 'anther', 'anther', 'The anther makes pollen, which contains the male sex cells.'),
  part('ps.ovary', 'photosynthesis', 'flower', 'ovary', 'ovary', 'The ovary contains ovules; after fertilisation it becomes the fruit.'),
  mcq('ps.helmont', 'photosynthesis', 'In the 1600s van Helmont grew a willow tree for five years. It gained 74 kg but the soil lost only about 57 g. Where did most of the tree’s mass come from?', [['Carbon dioxide from the air', true], ['Minerals from the soil', false, 'The soil lost almost nothing: that was the surprise.'], ['Energy from the sunlight', false, 'Light gives energy, not mass.']], 'Carbon dioxide from the air (and water). Van Helmont thought it was water. We now know the carbon comes from CO₂ in the air.'),

  // --- ecosystems
  mcq('ec.arrow', 'ecosystems', 'In a food chain, what do the arrows show?', [['The direction energy flows, eaten to eater', true], ['Who eats whom, pointing at the food eaten', false, 'The arrow points TO the animal doing the eating.'], ['Which animal is the bigger of the two', false, 'Size does not matter here.']], 'The direction energy flows: from the eaten to the eater. grass → rabbit → fox: energy passes from grass to rabbit to fox.'),
  fact('ec.producer', 'ecosystems', 'What is the name for an organism that makes its own food, at the start of a food chain?', 'producer', ['consumer', 'decomposer', 'predator'], 'Producers (plants and algae) photosynthesise.', { accept: ['a producer'] }),
  mcq('ec.loss', 'ecosystems', 'Why are food chains rarely longer than four or five steps?', [['Energy is lost at each step', true], ['Top predators would run out of space to hunt', false, 'The reason is energy.'], ['There are not enough species in a habitat', false, 'There are millions of species; energy is the limit.']], 'Energy is lost at each step, through movement, heat and waste. Only about 10% of the energy passes to the next level, so there is little left for top predators.'),
  fact('ec.decomp', 'ecosystems', 'Which organisms break down dead material and recycle nutrients into the soil?', 'decomposers', ['producers', 'herbivores', 'pollinators'], 'Bacteria and fungi are decomposers.', { accept: ['decomposer', 'bacteria and fungi'] }),
  mcq('ec.bees', 'ecosystems', 'Why would a fall in bee numbers worry farmers?', [['Many crops need insects to pollinate them', true], ['Bees eat the pests that attack the crops', false, 'Bees mainly matter as pollinators.'], ['Bees dig tunnels that make the soil fertile', false, 'Worms and decomposers do that.']], 'Without pollination, many fruits and seeds never form.'),
  mcq('ec.bioacc', 'ecosystems', 'A pesticide sprayed on plants ends up most concentrated in birds of prey. Why?', [['It builds up at each step of the chain', true], ['Birds of prey eat the sprayed plants directly', false, 'They are at the top of the chain.'], ['The birds make the pesticide in their own bodies', false, 'It comes from the spray.']], 'It builds up at each step because animals eat many organisms below them. This is bioaccumulation; DDT harmed eagles and falcons this way.'),
  mcq('ec.web', 'ecosystems', 'In a pond, fish eat water fleas, and water fleas eat algae. If the fish all died, what would most likely happen first?', [['Water fleas would rise; algae would fall', true], ['Algae would rise; water fleas would fall', false, 'More water fleas would eat more algae.'], ['Nothing would change, because fish are at the top', false, 'Every link affects the others.']], 'With no predator, the fleas multiply and eat more algae.'),
  fact('ec.niche', 'ecosystems', 'Animals of the same species competing for food, mates and territory is called…', 'competition', ['predation', 'pollination', 'photosynthesis'], 'Organisms compete within and between species; plants compete for light, water and minerals.', C),

  // --- inheritance and evolution
  order('in.dna', 'inheritance', 'Put these in order from largest to smallest.', ['nucleus', 'chromosome', 'gene', 'DNA base'], null, 'The nucleus holds chromosomes; each chromosome is a long DNA molecule containing many genes; genes are made of sequences of bases.'),
  fact('in.number', 'inheritance', 'How many chromosomes are there in a normal human body cell?', '46', ['23', '48', '92'], '23 pairs: one of each pair from each parent. Sperm and eggs have 23.'),
  fact('in.helix', 'inheritance', 'Who used Rosalind Franklin’s X-ray images to build the double helix model of DNA in 1953?', 'Watson and Crick', ['Darwin and Wallace', 'Mendel and Pasteur', 'Newton and Hooke'], 'Franklin’s “Photo 51” was vital evidence; Maurice Wilkins also worked on it.', C),
  mcq('in.var', 'inheritance', 'Which of these is caused ONLY by the environment?', [['A scar', true], ['Natural eye colour', false, 'Eye colour is inherited.'], ['Height', false, 'Height depends on genes AND environment (such as diet).']], 'Scars, language and haircuts are environmental. Many features, like height and weight, depend on both.'),
  mcq('in.ns', 'inheritance', 'In industrial Britain, dark peppered moths became more common than pale ones. Why?', [['Dark moths were better hidden on sooty trees, so more survived', true], ['The moths’ wings turned dark from soot landing on them', false, 'Individuals cannot change their genes; the dark ones survived more often.'], ['Pale moths flew away to cleaner countryside to breed', false, 'They were eaten more often.']], 'On soot-covered trees, dark moths were better hidden from birds, so more survived to breed. Natural selection: variation, a survival advantage, and passing the useful gene on.'),
  fact('in.darwin', 'inheritance', 'Which naturalist published On the Origin of Species in 1859?', 'Charles Darwin', ['Gregor Mendel', 'Alfred Russel Wallace', 'Aristotle'], 'Darwin’s ideas were shaped by his voyage on HMS Beagle, including the Galápagos Islands.', { accept: ['darwin'] }),
  mcq('in.resist', 'inheritance', 'Why is it important to finish a course of antibiotics?', [['So no partly resistant bacteria survive', true], ['So that it kills any viruses as well', false, 'Antibiotics don’t work on viruses.'], ['Because unused tablets go off in the bottle', false, 'The reason is resistance.']], 'So no partly resistant bacteria survive to multiply. Resistant bacteria are natural selection happening fast: a big problem for modern medicine.'),
  fact('in.extinct', 'inheritance', 'Which word means a species has no living members left?', 'extinct', ['endangered', 'evolved', 'adapted'], 'The dodo has been extinct since the late 1600s.', { accept: ['extinction'] }),
  mcq('in.fossil', 'inheritance', 'How do fossils support the theory of evolution?', [['Older rock layers show simpler forms that change over time', true], ['Fossils show that animals have never changed', false, 'They show change over very long times.'], ['Every fossil found is of a species still alive today', false, 'Most fossil species are extinct.']], 'The fossil record shows how organisms have changed over millions of years.'),

  // --- health
  mcq('hd.virus', 'health', 'Why don’t antibiotics cure a cold?', [['Colds are viral; antibiotics kill bacteria', true], ['Colds are too mild for antibiotics to notice', false, 'It is about the type of microbe.'], ['Colds are caused by fungi, not by bacteria', false, 'Colds are viruses.']], 'Colds are caused by viruses, and antibiotics only kill bacteria. Antibiotics attack parts of bacterial cells, such as their cell walls, which viruses do not have; viruses also reproduce inside our own cells.'),
  mcq('hd.vaccine', 'health', 'How does a vaccine protect you?', [['A harmless form of the microbe trains white blood cells', true], ['It kills every microbe in your body for a few years', false, 'It trains the immune system for one particular disease.'], ['It is a strong antibiotic that stays in your blood', false, 'Vaccines prevent disease; they are not a cure.']], 'It contains a harmless form of the microbe, so white blood cells learn to make the right antibodies. Memory cells mean that next time, antibodies are made so fast you don’t fall ill.'),
  fact('hd.jenner', 'health', 'Who developed the first vaccine, against smallpox, in 1796?', 'Edward Jenner', ['Louis Pasteur', 'Alexander Fleming', 'Florence Nightingale'], 'He used cowpox; “vaccine” comes from vacca, Latin for cow.', { accept: ['jenner'] }),
  fact('hd.fleming', 'health', 'Who discovered penicillin, the first antibiotic, in 1928?', 'Alexander Fleming', ['Edward Jenner', 'Marie Curie', 'Joseph Lister'], 'He noticed mould killing bacteria on a dish he had left out.', { accept: ['fleming'] }),
  fact('hd.hippocrates', 'health', 'Which ancient Greek doctor, “the father of medicine”, taught that illness has natural causes, not punishment by the gods?', 'Hippocrates', ['Archimedes', 'Pythagoras', 'Homer'], 'Doctors once swore the Hippocratic Oath, promising to do no harm.'),
  mcq('hd.defence', 'health', 'Which is part of the body’s FIRST line of defence against microbes?', [['Skin and stomach acid', true], ['Antibodies in the blood', false, 'Antibodies come later, from white blood cells.'], ['Vaccines given as a baby', false, 'Vaccines are medicine, not a natural barrier.']], 'Skin, mucus, cilia and stomach acid stop most microbes getting in at all.'),
  mcq('hd.diet', 'health', 'A diet lacking vitamin C causes which disease, once common among sailors?', [['Scurvy', true], ['Rickets', false, 'Rickets is caused by too little vitamin D or calcium.'], ['Malaria', false, 'Malaria is caused by a parasite spread by mosquitoes.']], 'Sailors ate citrus fruit (limes) to prevent scurvy.'),
  fact('hd.drug', 'health', 'Which drug in cigarettes is addictive?', 'nicotine', ['tar', 'carbon monoxide', 'caffeine'], 'Tar causes cancer; carbon monoxide reduces oxygen carried in the blood.'),

  // --- particles
  part('pt.solid', 'particles', 'particles', 'solid', 'solid', 'Particles packed in a regular pattern, vibrating in fixed positions.', { choosePrompt: 'Which state is highlighted?', namePrompt: 'Name the state highlighted.' }),
  part('pt.gas', 'particles', 'particles', 'gas', 'gas', 'Particles far apart, moving fast in all directions.', { choosePrompt: 'Which state is highlighted?', namePrompt: 'Name the state highlighted.' }),
  fact('pt.democritus', 'particles', 'Which Greek thinker first suggested that matter is made of tiny pieces that cannot be cut, called atomos?', 'Democritus', ['Aristotle', 'Plato', 'Homer'], 'Democritus developed the idea with his teacher Leucippus. Aristotle disagreed, preferring four elements (earth, water, air, fire), and his idea won for 2000 years.'),
  mcq('pt.diffusion', 'particles', 'Why does diffusion happen faster in a gas than in a liquid?', [['Gas particles move faster with more space', true], ['Gas particles are bigger and push harder', false, 'The particles are the same; their spacing and speed differ.'], ['Liquids have no particles to move about', false, 'Everything is made of particles.']], 'Gas particles move faster and have more space between them. Diffusion is the net movement of particles from high to low concentration.'),
  mcq('pt.melt', 'particles', 'When ice melts, what happens to its particles?', [['They gain energy and slide past each other', true], ['They get bigger, so the ice takes up more room', false, 'Particles don’t change size; their arrangement changes.'], ['They break apart into separate hydrogen and oxygen', false, 'They were water molecules all along.']], 'They gain energy and can move past each other, but stay close together. A change of state is a physical change: the substance is still water.'),
  mcq('pt.temp', 'particles', 'While pure water is boiling, what happens to its temperature?', [['It stays at 100 °C until it has all boiled', true], ['It keeps rising for as long as you heat it', false, 'The energy goes into separating the particles, not raising the temperature.'], ['It falls as the hottest water escapes as steam', false, 'It stays steady.']], 'This flat part of a heating curve is why pure substances have sharp boiling points.'),
  mcq('pt.icarus', 'particles', 'In the myth, Icarus flew too close to the Sun and the wax holding his wings melted. Which change of state is that?', [['Solid to liquid', true], ['Liquid to gas', false, 'That is evaporating or boiling.'], ['Gas to solid', false, 'That is deposition.']], 'Melting: the wax particles gained enough energy to slide past each other. (In reality, air gets colder as you climb!)'),
  fact('pt.sublime', 'particles', 'What is it called when a solid turns straight into a gas, like dry ice?', 'sublimation', ['evaporation', 'condensation', 'melting'], 'Solid carbon dioxide (dry ice) sublimes at −78 °C.', { accept: ['subliming'] }),
  fact('pt.gaspress', 'particles', 'What causes the pressure of a gas inside a balloon?', 'particles hitting the walls', ['particles getting hotter', 'the rubber pushing out', 'particles sticking together'], 'Heat it and the particles move faster, hitting harder and more often, so pressure rises.', C),
  tmpl('pt.density', 'particles', 'y8sDensity'),

  // --- elements, compounds and separating
  mcq('at.which', 'atoms', 'Which of these is a compound?', [['Water (H₂O)', true], ['Oxygen (O₂)', false, 'Only one type of atom: an element.'], ['Air', false, 'Air is a mixture of gases, not chemically joined.'], ['Gold (Au)', false, 'Gold is an element.']], 'A compound contains two or more different elements chemically bonded.'),
  mcq('at.mixture', 'atoms', 'How is a mixture different from a compound?', [['A mixture’s parts are not chemically joined', true], ['A mixture always has a fixed recipe of parts', false, 'Compounds have fixed proportions; mixtures can vary.'], ['A mixture contains only one kind of element', false, 'That would be an element.']], 'A mixture’s parts are not chemically joined and can be separated physically. Iron and sulfur mixed: a magnet can separate them. Heated together: iron sulfide, a new compound.'),
  fact('at.distil', 'atoms', 'Which separation method gets pure water from sea water, by boiling and condensing?', 'distillation', ['filtration', 'chromatography', 'magnetism'], 'The water evaporates and condenses in a cooled tube; the salt stays behind.', { accept: ['distilling', 'simple distillation'] }),
  fact('at.chrom', 'atoms', 'Which method separates the different coloured dyes in an ink?', 'chromatography', ['filtration', 'fractional distillation', 'sieving'], 'The dyes travel different distances up the paper.', { accept: ['paper chromatography'] }),
  fact('at.filter', 'atoms', 'Which method separates sand from water?', 'filtration', ['distillation', 'chromatography', 'evaporation'], 'Insoluble sand stays on the filter paper.', { accept: ['filtering'] }),
  order('at.salt', 'atoms', 'Put the steps for getting salt from rock salt in order.', ['crush the rock salt', 'dissolve it in warm water', 'filter out the sand', 'evaporate the water'], null, 'Salt dissolves; sand doesn’t. Filter, then evaporate the water from the solution to leave crystals.'),
  fact('at.formula', 'atoms', 'How many atoms are in one molecule of carbon dioxide, CO₂?', '3', ['2', '1', '4'], 'One carbon and two oxygens.'),
  fact('at.symbol', 'atoms', 'What is the chemical symbol for sodium?', 'Na', ['S', 'So', 'Sd'], 'Na comes from natrium, its Latin name. Iron is Fe (ferrum), lead Pb (plumbum).', { accept: ['na'] }),
  mcq('at.pure', 'atoms', 'How can you tell if water is pure?', [['It boils at exactly 100 °C', true], ['It looks completely clear', false, 'Salt water looks clear too.'], ['It has no taste or smell at all', false, 'Never taste-test in a lab!']], 'It boils at exactly 100 °C and freezes at exactly 0 °C. Impurities change the melting and boiling points.'),

  // --- periodic table
  fact('pd.mendeleev', 'periodic', 'Which Russian chemist published a periodic table in 1869, leaving gaps for undiscovered elements?', 'Dmitri Mendeleev', ['John Dalton', 'Marie Curie', 'Antoine Lavoisier'], 'He predicted the properties of gallium and germanium before they were found.', { accept: ['mendeleev'] }),
  mcq('pd.group', 'periodic', 'What do elements in the same group (column) have in common?', [['Similar chemical properties', true], ['The same atomic mass', false, 'Mass increases down a group.'], ['They are all gases at room temperature', false, 'Most groups contain solids.']], 'Elements in a group have the same number of electrons in their outer shell.'),
  fact('pd.g1', 'periodic', 'Group 1 metals, such as sodium and potassium, are called the…', 'alkali metals', ['noble gases', 'halogens', 'transition metals'], 'They react with water to make an alkaline solution and hydrogen gas.', { accept: ['alkali metal'] }),
  mcq('pd.g1trend', 'periodic', 'How does reactivity change going DOWN Group 1?', [['It increases', true], ['It decreases', false, 'Lithium fizzes; caesium explodes.'], ['It stays the same', false, 'There is a clear trend.']], 'It increases: potassium reacts more violently than sodium. The outer electron is further from the nucleus, so it is lost more easily.'),
  fact('pd.g7', 'periodic', 'Group 7, including chlorine and iodine, are called the…', 'halogens', ['noble gases', 'alkali metals', 'metalloids'], 'Halogens are reactive non-metals; reactivity DEcreases down the group.', { accept: ['halogen'] }),
  fact('pd.g0', 'periodic', 'Group 0, including helium and neon, are called the…', 'noble gases', ['halogens', 'alkali metals', 'rare earths'], 'They are very unreactive because their outer shells are full.', { accept: ['noble gas', 'inert gases'] }),
  mcq('pd.metal', 'periodic', 'Which property belongs to most NON-metals?', [['Poor conductors of heat and electricity', true], ['Shiny', false, 'Most metals are shiny.'], ['Malleable (can be hammered into shape)', false, 'That is a metal property.']], 'Graphite (a form of carbon) is a rare non-metal that conducts electricity.'),
  mcq('pd.where', 'periodic', 'Where are the metals in the periodic table?', [['On the left and in the middle', true], ['Only on the far right side', false, 'Non-metals are mostly top right.'], ['Only along the bottom two rows', false, 'Most elements are metals.']], 'A zig-zag staircase line separates metals from non-metals.'),

  // --- reactions
  mcq('rx.chem', 'reactions', 'Which is a CHEMICAL change?', [['Burning magnesium', true], ['Melting chocolate', false, 'That is a physical change of state.'], ['Dissolving sugar', false, 'Dissolving is physical: evaporate the water and the sugar is back.']], 'A chemical change makes a new substance and is usually hard to reverse.'),
  fact('rx.combust', 'reactions', 'When a fuel such as methane burns completely in oxygen, it makes water and…', 'carbon dioxide', ['carbon monoxide', 'hydrogen', 'oxygen'], 'Combustion is a reaction with oxygen that releases energy. Without enough oxygen, toxic carbon monoxide and soot form.', { accept: ['co2', 'CO₂'] }),
  mcq('rx.triangle', 'reactions', 'The fire triangle shows a fire needs fuel, oxygen and…', [['Heat', true], ['Water', false, 'Water puts fires out by removing heat.'], ['Carbon dioxide', false, 'CO₂ extinguishers smother fires.']], 'Remove any side of the triangle and the fire goes out.'),
  mcq('rx.mass', 'reactions', 'Magnesium ribbon is burned in a crucible. Its mass INCREASES. Why?', [['It has combined with oxygen from the air', true], ['Mass was created by the heat of the flame', false, 'Mass is never created; the extra came from the air.'], ['The crucible absorbed some of the magnesium', false, 'You weigh the crucible before and after.']], 'It has combined with oxygen from the air to make magnesium oxide. Oxidation adds oxygen, so the product is heavier than the metal.'),
  mcq('rx.exo', 'reactions', 'A reaction that gives out heat, like combustion, is called…', [['exothermic', true], ['endothermic', false, 'Endothermic reactions take in heat and feel cold.'], ['neutral', false, 'That is not a type of energy change.']], 'Hand warmers are exothermic; sports cold packs are endothermic.'),
  fact('rx.decomp', 'reactions', 'Heating copper carbonate breaks it into copper oxide and carbon dioxide. What type of reaction is this?', 'thermal decomposition', ['combustion in oxygen', 'neutralisation', 'displacement reaction'], 'Thermal decomposition: one substance broken down by heat into two or more.', { ...C }),
  fact('rx.test', 'reactions', 'Which gas gives a squeaky pop with a lighted splint?', 'hydrogen', ['oxygen', 'carbon dioxide', 'chlorine'], 'Oxygen relights a glowing splint; carbon dioxide turns limewater milky.'),
  tmpl('rx.balance', 'reactions', 'y8sBalance'),

  // --- acids, alkalis and metals
  fact('ac.ph7', 'acids', 'What is the pH of a neutral solution, such as pure water?', '7', ['0', '14', '1'], 'Below 7: acid. Above 7: alkali.'),
  mcq('ac.neut', 'acids', 'What does an acid react with an alkali to make?', [['A salt and water', true], ['Hydrogen and oxygen', false, 'That is not neutralisation.'], ['Carbon dioxide only', false, 'Carbonates make CO₂ with acids.']], 'Neutralisation: acid + alkali → salt + water.'),
  fact('ac.salt', 'acids', 'Hydrochloric acid + sodium hydroxide → water + which salt?', 'sodium chloride', ['sodium sulfate', 'sodium nitrate', 'chlorine'], 'Hydrochloric acid makes chlorides, sulfuric acid makes sulfates, nitric acid makes nitrates.', { accept: ['nacl', 'salt'] }),
  mcq('ac.metal', 'acids', 'What gas is made when magnesium reacts with an acid?', [['Hydrogen', true], ['Oxygen', false, 'Test: a squeaky pop means hydrogen.'], ['Carbon dioxide', false, 'That comes from carbonates.']], 'metal + acid → salt + hydrogen.'),
  order('ac.series', 'acids', 'Put these metals in order of reactivity, most reactive first.', ['potassium', 'magnesium', 'iron', 'copper', 'gold'], null, 'Potassium reacts violently with water; gold doesn’t even react with most acids.'),
  mcq('ac.gold', 'acids', 'Why is gold found as a pure metal in the ground, while iron must be extracted from ore?', [['Gold is too unreactive to combine with others', true], ['Gold is much heavier, so it sinks to the surface', false, 'It is about reactivity, not mass.'], ['Iron is rarer, so it is only found in compounds', false, 'Iron is far more common than gold.']], 'Gold is so unreactive it doesn’t combine with other elements. The least reactive metals (gold, platinum) are found native; even Hephaestus would need a furnace for iron.'),
  mcq('ac.displace', 'acids', 'An iron nail is dipped in blue copper sulfate solution. It becomes coated in copper. Why?', [['Iron is more reactive, so it displaces copper', true], ['Copper is more reactive, so it pulls itself out', false, 'Then nothing would happen.'], ['The copper sulfate paints a coat onto the nail', false, 'It is a displacement reaction.']], 'Iron is more reactive than copper, so it displaces copper from the compound. A more reactive metal pushes a less reactive one out of its compound.'),
  fact('ac.indig', 'acids', 'Indigestion tablets neutralise excess stomach acid. Are they acids or bases?', 'bases', ['acids', 'neutral salts', 'enzymes'], 'They contain bases such as calcium carbonate or magnesium hydroxide.', { accept: ['base', 'alkalis', 'alkali'] }),
  fact('ac.uip', 'acids', 'Universal indicator turns which colour in a strong acid?', 'red', ['purple', 'green', 'blue'], 'Red/orange for acids, green for neutral, blue/purple for alkalis.'),

  // --- Earth and atmosphere
  mcq('er.igneous', 'earth', 'How is igneous rock formed?', [['Molten rock cools and solidifies', true], ['Layers of sediment are pressed together', false, 'That is sedimentary rock.'], ['Heat and pressure change other rocks', false, 'That is metamorphic rock.']], 'When molten rock (magma or lava) cools and solidifies. Granite cools slowly underground (big crystals); basalt cools fast at the surface (small crystals).'),
  fact('er.fossil', 'earth', 'In which type of rock are fossils usually found?', 'sedimentary', ['igneous', 'metamorphic', 'volcanic glass'], 'Sediment buries remains gently; heat and melting destroy fossils.', { accept: ['sedimentary rock'] }),
  fact('er.marble', 'earth', 'Marble is metamorphic rock formed from which sedimentary rock?', 'limestone', ['granite', 'sandstone', 'basalt'], 'Heat and pressure recrystallise limestone into marble; the Parthenon in Athens is built of marble.', { accept: ['chalk'] }),
  mcq('er.air', 'earth', 'About how much of today’s air is nitrogen?', [['About 78%', true], ['About 21%', false, 'That is oxygen.'], ['About 1%', false, 'That is roughly argon.']], 'Nitrogen 78%, oxygen 21%, argon about 0.9%, carbon dioxide about 0.04%.'),
  mcq('er.co2', 'earth', 'Which of these REMOVES carbon dioxide from the atmosphere?', [['Photosynthesis', true], ['Burning fossil fuels', false, 'That adds CO₂.'], ['Respiration', false, 'Respiration releases CO₂.']], 'Plants, algae and the oceans absorb carbon dioxide.'),
  mcq('er.greenhouse', 'earth', 'How do greenhouse gases warm the Earth?', [['They absorb heat from the Earth and re-emit it', true], ['They make a hole in the ozone layer that lets heat in', false, 'The ozone hole is a different problem.'], ['They reflect extra sunlight down onto the surface', false, 'Greenhouse gases let most sunlight through; they absorb and re-emit heat radiated by the Earth.']], 'They absorb heat radiated from the Earth’s surface and re-emit it, trapping it in the atmosphere. More CO₂ and methane mean more heat trapped: the enhanced greenhouse effect.'),
  order('er.carbon', 'earth', 'Put this route of a carbon atom in order.', ['CO₂ in the air', 'absorbed by a plant (photosynthesis)', 'eaten by an animal', 'released by respiration'], null, 'Carbon cycles between the air, living things, oceans and rocks.'),
  fact('er.weather', 'earth', 'The breaking down of rocks by rain, ice and plants without them moving is called…', 'weathering', ['erosion', 'deposition', 'compaction'], 'Erosion is when the bits are carried away; freeze–thaw weathering splits rocks as water freezes and expands.', { accept: ['weather'] }),

  // --- forces
  mcq('fo.balanced', 'forces', 'A car travels at a steady 30 mph in a straight line. What can you say about the forces on it?', [['They are balanced', true], ['The driving force is bigger', false, 'Then it would speed up.'], ['There are no forces acting on it', false, 'Friction and air resistance act all the time.']], 'They are balanced: driving force equals resistive forces. Balanced forces mean no change in motion: steady speed or stationary (Newton’s first law).'),
  mcq('fo.terminal', 'forces', 'Why does a skydiver reach a terminal velocity?', [['Air resistance rises until it equals weight', true], ['Gravity switches off once you fall fast enough', false, 'Gravity keeps pulling.'], ['The parachute is open from the moment you jump', false, 'Terminal velocity happens with or without a parachute.']], 'Air resistance grows with speed until it equals weight, so forces balance. With the parachute open, a much bigger air resistance gives a slower terminal velocity.'),
  fact('fo.weight', 'forces', 'Weight = mass × gravitational field strength. On Earth g ≈ 10 N/kg. What does a 50 kg person weigh, in newtons?', '500', ['50', '5', '5000'], '50 × 10 = 500 N. On the Moon (g ≈ 1.6 N/kg) the same person would weigh only about 80 N.'),
  mcq('fo.mass', 'forces', 'What happens to your MASS if you travel to the Moon?', [['It stays the same', true], ['It falls to about a sixth', false, 'That is your weight.'], ['It becomes zero in space', false, 'Mass is the amount of matter in you.']], 'It stays the same; only your weight changes, to about a sixth. Mass is measured in kg; weight is a force, in newtons.'),
  mcq('fo.dt', 'forces', 'On a distance–time graph, what does a horizontal line mean?', [['The object is stationary', true], ['It is moving at a steady speed', false, 'A steady speed is a straight sloping line.'], ['It is accelerating', false, 'Accelerating gives a curve getting steeper.']], 'The gradient of a distance–time graph is the speed.'),
  mcq('fo.newton3', 'forces', 'Atlas holds up the sky. The sky pushes down on Atlas. By Newton’s third law, how do these two forces compare?', [['Equal in size, opposite in direction', true], ['The sky’s push is bigger, so Atlas strains', false, 'Interaction pairs are always equal.'], ['Atlas’s push is bigger, so the sky stays up', false, 'Interaction pairs are always equal, whatever is happening.']], 'They are equal in size and opposite in direction. For every action there is an equal and opposite reaction; the pair acts on different objects.'),
  tmpl('fo.speed', 'forces', 'y8sSpeed'),
  tmpl('fo.pressure', 'forces', 'y8sPressure'),
  tmpl('fo.moments', 'forces', 'y8sMoments'),
  fact('fo.hooke', 'forces', 'Hooke’s law says the extension of a spring is proportional to the…', 'force applied', ['spring’s colour', 'time taken', 'temperature'], 'Double the force, double the stretch, until the limit of proportionality.', C),

  // --- energy
  mcq('en.store', 'energy', 'A drawn bow is about to fire an arrow. Which energy store is full?', [['Elastic potential', true], ['Gravitational potential', false, 'That is for height.'], ['Nuclear', false, 'Nuclear energy is stored in atomic nuclei.']], 'Released, the elastic store empties into the arrow’s kinetic store.'),
  mcq('en.conserve', 'energy', 'What does the law of conservation of energy say?', [['Energy is never created or destroyed, only transferred', true], ['We should always switch off lights we are not using', false, 'That is energy saving, not the law.'], ['Energy gets used up and disappears when things move', false, 'It is transferred, often to thermal energy.']], 'The total is always the same; wasted energy usually ends up warming the surroundings.'),
  mcq('en.bounce', 'energy', 'Why does a dropped ball bounce lower each time?', [['Some energy is transferred to heat and sound', true], ['Some energy is destroyed at every bounce', false, 'Energy is never destroyed.'], ['Gravity gets stronger as the ball slows down', false, 'g stays the same.']], 'Some energy is transferred to the surroundings as heat and sound at each bounce. Less energy remains in the ball’s gravitational store at the top of each bounce.'),
  mcq('en.renew', 'energy', 'Which is a RENEWABLE energy resource?', [['Wind', true], ['Coal', false, 'Fossil fuels took millions of years to form.'], ['Natural gas', false, 'A fossil fuel.'], ['Uranium', false, 'Nuclear fuel will run out.']], 'Renewables (wind, solar, hydro, tidal, geothermal, biofuel) will not run out.'),
  mcq('en.conduct', 'energy', 'Why do saucepans have metal bases but plastic handles?', [['Metal conducts heat; plastic insulates', true], ['Plastic is stronger and lasts much longer', false, 'It is about conducting heat.'], ['Metal is cheaper and easier to shape', false, 'The reason is conduction.']], 'Metal is a good thermal conductor; plastic is an insulator. Thermal energy is transferred by conduction, convection and radiation.'),
  fact('en.convect', 'energy', 'Warm air rises above a radiator and cool air sinks to replace it. What is this transfer called?', 'convection', ['conduction', 'radiation', 'evaporation'], 'Convection currents happen in liquids and gases, because warm fluid is less dense.'),
  tmpl('en.power', 'energy', 'y8sPower'),

  // --- electricity and magnetism
  mcq('el.series', 'electricity', 'You add a second bulb in SERIES. What happens to the brightness?', [['Both bulbs are dimmer', true], ['Both bulbs are brighter', false, 'More resistance means less current.'], ['No change in brightness', false, 'The current falls.']], 'Both bulbs are dimmer than one bulb alone. Total resistance goes up, so current goes down. In parallel, each bulb stays as bright as one alone.'),
  mcq('el.parallel', 'electricity', 'Why are house lights wired in PARALLEL?', [['Each light gets full voltage and its own switch', true], ['It uses less wire, so it is cheaper to install', false, 'The reason is independence and full voltage.'], ['It makes the bulbs last much longer before failing', false, 'Not the main reason.']], 'Each light gets the full voltage and can be switched on or off separately. If one bulb fails in parallel, the others stay on.'),
  fact('el.ammeter', 'electricity', 'Which meter measures current, and how is it connected?', 'an ammeter, in series', ['a voltmeter, in parallel', 'an ammeter, in parallel', 'a voltmeter, in series'], 'Voltmeters go in parallel across a component.', C),
  fact('el.unit', 'electricity', 'What is the unit of resistance?', 'ohm', ['volt', 'amp', 'watt'], 'Symbol Ω. Named after Georg Ohm.', { accept: ['ohms', 'Ω'] }),
  mcq('el.static', 'electricity', 'A balloon rubbed on hair sticks to a wall. Why?', [['Rubbing moves electrons, charging the balloon', true], ['The balloon becomes magnetic when it is rubbed', false, 'It is static electricity, not magnetism.'], ['Rubbing leaves a sticky layer of hair oil on it', false, 'It is electric charge.']], 'Like charges repel; unlike charges attract. The Greeks noticed amber (ēlektron) does this when rubbed!'),
  mcq('el.electromag', 'electricity', 'How can you make an electromagnet stronger?', [['More turns, more current, an iron core', true], ['Fewer turns of wire and a plastic core', false, 'An iron core concentrates the field.'], ['Less current and a copper core inside', false, 'More current makes a stronger field.']], 'More turns of wire, more current, and an iron core. Electromagnets can be switched off, which is why scrapyard cranes use them.'),
  mcq('el.field', 'electricity', 'Outside a bar magnet, field lines go from…', [['north to south', true], ['south to north', false, 'The convention is north to south outside the magnet.'], ['the middle outwards to both ends', false, 'They start at N and end at S.']], 'The north pole to the south pole. The closer the lines, the stronger the field.'),
  tmpl('el.ohm', 'electricity', 'y8sOhm'),

  // --- sound and light
  mcq('wv.sound', 'waves', 'Why can’t sound travel through space?', [['No particles to pass on the vibrations', true], ['It is far too cold for sound to move', false, 'Temperature isn’t the reason.'], ['Space is too big, so the sound fades out', false, 'Sound needs a medium; space is a vacuum.']], 'Sound is a longitudinal wave of vibrating particles.'),
  mcq('wv.pitch', 'waves', 'A higher pitched note has a…', [['higher frequency', true], ['larger amplitude', false, 'Amplitude affects loudness.'], ['lower frequency', false, 'Lower frequency gives a lower pitch.']], 'Frequency (Hz) is the number of waves per second.'),
  mcq('wv.reflect', 'waves', 'When light reflects off a mirror, how do the angles compare?', [['Incidence equals reflection', true], ['Reflection is always 90°', false, 'The two angles, measured from the normal, are always equal; light hitting along the normal bounces straight back.'], ['The reflected angle is double', false, 'They are equal.']], 'Angle of incidence equals angle of reflection. Both angles are measured from the normal, a line at 90° to the mirror.'),
  mcq('wv.refract', 'waves', 'A straw in water looks bent. Why?', [['Light changes speed and direction (refraction)', true], ['The water bends the straw as it soaks in', false, 'The straw is straight.'], ['Light reflects off the surface of the water', false, 'It is refraction.']], 'Light changes speed and direction as it passes from water to air (refraction). Light slows down in denser materials like water and glass.'),
  mcq('wv.prism', 'waves', 'White light passes through a prism and splits into a spectrum. What does this show?', [['White light is a mixture of colours', true], ['The prism adds colour to the light', false, 'Newton showed a second prism can recombine the colours.'], ['Light is made of seven separate rays', false, 'The spectrum is continuous; “seven colours” is just how Newton named the bands.']], 'This is dispersion: each colour refracts by a different amount.'),
  mcq('wv.red', 'waves', 'Why does a red apple look red in white light?', [['It reflects red and absorbs the rest', true], ['It gives out its own red light', false, 'It is not a light source.'], ['It absorbs red light and reflects the rest', false, 'It reflects red.']], 'It reflects red light and absorbs the other colours. In blue light, the same apple would look black.'),
  fact('wv.speed', 'waves', 'Which travels faster: light or sound?', 'light', ['sound', 'they are the same', 'it depends on the weather'], 'Light: about 300 000 km/s. Sound in air: about 340 m/s.'),
  tmpl('wv.calc', 'waves', 'y8sWave'),

  // --- space
  mcq('sp.seasons', 'space', 'What causes the seasons?', [['The Earth’s tilted axis', true], ['The Earth getting closer to the Sun in summer', false, 'The Earth is actually closest to the Sun in January.'], ['The Sun burning hotter for half of the year', false, 'The Sun’s output is almost constant.']], 'The Earth’s axis is tilted, so each hemisphere leans towards the Sun for part of the year. When the northern hemisphere tilts towards the Sun, days are longer and sunlight is more direct: summer.'),
  mcq('sp.gravity', 'space', 'What keeps the Moon in orbit around the Earth?', [['Gravity', true], ['Magnetism', false, 'Gravity holds orbits together.'], ['The Sun’s light', false, 'Light does not hold things in orbit.']], 'Gravity pulls the Moon towards the Earth, constantly curving its path into an orbit.'),
  mcq('sp.phases', 'space', 'Why does the Moon have phases?', [['We see different amounts of its lit half', true], ['The Earth’s shadow covers part of it each night', false, 'That is an eclipse, which is rare.'], ['It grows and shrinks in size as it orbits', false, 'It stays the same size.']], 'We see different amounts of its sunlit half as it orbits the Earth. A full cycle of phases takes about 29.5 days.'),
  fact('sp.year', 'space', 'How long does the Earth take to orbit the Sun?', 'about 365¼ days', ['24 hours', 'about 29½ days', '7 days'], 'That extra quarter day is why we have leap years.', C),
  fact('sp.erat', 'space', 'Which Greek scholar estimated the Earth’s circumference in about 240 BC by comparing shadows in two cities?', 'Eratosthenes', ['Archimedes', 'Ptolemy', 'Pythagoras'], 'He compared noon shadows in Syene and Alexandria, and his answer was remarkably close.'),
  fact('sp.lightyear', 'space', 'A light year is a measure of…', 'distance', ['time', 'brightness', 'speed'], 'It is the distance light travels in a year: about 9.5 million million km.', { accept: ['a distance'] }),
  order('sp.size', 'space', 'Put these in order of size, smallest first.', ['the Moon', 'the Earth', 'the Sun', 'the Milky Way'], null, 'The Sun is about 100 times the Earth’s width; the Milky Way contains hundreds of billions of stars.'),
  mcq('sp.weight', 'space', 'Why would Theo weigh less on Mars than on Earth?', [['Mars’s gravitational field is weaker', true], ['Mars is further away from the Sun', false, 'Weight on a planet depends on that planet’s gravity.'], ['There is no air on Mars to press down', false, 'Air has nothing to do with weight.']], 'Mars has less mass, so its gravitational field is weaker. On Mars g ≈ 3.7 N/kg, compared with about 10 N/kg on Earth.'),

  // --- working scientifically
  mcq('wk.iv', 'working', 'Mira tests how the height of a ramp affects how far a toy car rolls. What is the independent variable?', [['The height of the ramp', true], ['The distance the car rolls', false, 'That is what she measures: the dependent variable.'], ['The type of car', false, 'That should be a control variable, kept the same.']], 'Independent: what you change. Dependent: what you measure. Control: what you keep the same.'),
  mcq('wk.control', 'working', 'In the same investigation, which is a control variable?', [['Using the same car', true], ['The height of the ramp', false, 'That is what she changes.'], ['The distance the car rolls', false, 'That is what she measures.']], 'Using the same car each time. Keeping everything else the same makes it a fair test.'),
  mcq('wk.precise', 'working', 'Results that are very close to each other are described as…', [['precise', true], ['accurate', false, 'Accurate means close to the true value.'], ['valid', false, 'Valid means the test answers the question.']], 'You can be precise but not accurate: all the arrows clustered, but far from the bullseye.'),
  mcq('wk.repeat', 'working', 'Why repeat an experiment and calculate a mean?', [['To reduce random errors and spot anomalies', true], ['To make sure the experiment takes longer', false, 'Repeats make results more reliable.'], ['To change the independent variable each time', false, 'Repeats use the same conditions.']], 'To reduce the effect of random errors and spot anomalies. An anomalous result is one that doesn’t fit the pattern; check it, and leave it out of the mean if it is a mistake.'),
  mcq('wk.graph', 'working', 'You measure temperature every minute as water heats. Which graph should you draw?', [['A line graph', true], ['A bar chart', false, 'Bar charts are for categories, like types of fuel.'], ['A pie chart', false, 'Pie charts show proportions of a whole.']], 'A line graph, because both variables are continuous. Continuous data: line graph (or scatter graph with a line of best fit).'),
  mcq('wk.hypo', 'working', 'Which is a good scientific hypothesis?', [['Higher temperatures will speed up the reaction, as particles collide more', true], ['Reactions are interesting, so I will watch closely what happens', false, 'A hypothesis must be testable.'], ['I will do the experiment carefully and record every result', false, 'That is a plan, not a hypothesis.']], 'If the temperature increases, the rate of reaction will increase, because particles collide more often. A hypothesis predicts a relationship and explains why, and it can be tested.'),
  mcq('wk.sys', 'working', 'A balance always reads 0.2 g even with nothing on it. What kind of error is this?', [['A systematic (zero) error', true], ['A random (reading) error', false, 'Random errors vary unpredictably; this is the same every time.'], ['An anomalous result', false, 'Every reading will be 0.2 g too high.']], 'Fix it by zeroing (taring) the balance, or subtracting 0.2 g from every reading.'),
  mcq('wk.correl', 'working', 'Ice cream sales and sunburn both rise in summer. Does ice cream cause sunburn?', [['No: sunny weather causes both', true], ['Yes: the graph proves that it does', false, 'Correlation is not causation.'], ['Yes, because sugar weakens the skin', false, 'There is no evidence for that.']], 'No: both are caused by a third factor, sunny weather. A correlation shows a link, not that one thing causes the other.'),

  // --- stretch: inside the atom
  mcq('am.parts', 'atomic', 'Which particles are found in the nucleus of an atom?', [['Protons and neutrons', true], ['Electrons and protons', false, 'Electrons are in shells around the nucleus.'], ['Only electrons', false, 'Electrons orbit outside the nucleus.']], 'Protons +1, neutrons 0, electrons −1. The nucleus is tiny but holds almost all the mass.'),
  fact('am.number', 'atomic', 'The atomic number of an element tells you the number of…', 'protons', ['neutrons', 'shells', 'isotopes'], 'In a neutral atom, it also equals the number of electrons.', { accept: ['protons in the nucleus'] }),
  mcq('am.isotope', 'atomic', 'What is different between carbon-12 and carbon-14?', [['The number of neutrons', true], ['The number of protons', false, 'Then they would be different elements.'], ['The number of electrons', false, 'Both neutral atoms have 6 electrons.']], 'Isotopes: same protons, different neutrons. Carbon-14 is radioactive and is used to date ancient remains.'),
  fact('am.neutrons', 'atomic', 'Sodium has atomic number 11 and mass number 23. How many neutrons does it have?', '12', ['11', '23', '34'], '23 − 11 = 12 neutrons.'),
  mcq('am.rutherford', 'atomic', 'In Rutherford’s gold foil experiment, a few alpha particles bounced back. What did this show?', [['Atoms have a tiny, dense, positive nucleus', true], ['Atoms are solid all the way through', false, 'Most particles went straight through: atoms are mostly empty space.'], ['Gold atoms are magnetic and repel alpha', false, 'It shows the structure of atoms.']], 'This replaced the “plum pudding” model in 1911.'),
  mcq('am.ionic', 'atomic', 'Sodium chloride forms when sodium gives an electron to chlorine. What type of bonding is this?', [['Ionic', true], ['Covalent', false, 'Covalent bonds share electrons, usually between non-metals.'], ['Metallic', false, 'Metallic bonding holds metal atoms together.']], 'Na⁺ and Cl⁻ ions attract strongly, giving a high melting point.'),
  mcq('am.covalent', 'atomic', 'In a water molecule, hydrogen and oxygen atoms share pairs of electrons. What type of bond is this?', [['Covalent', true], ['Ionic', false, 'Ionic bonds transfer electrons, metal to non-metal.'], ['Magnetic', false, 'Not a type of chemical bond.']], 'Covalent bonds form between non-metal atoms.'),
  fact('am.shell', 'atomic', 'How many electrons can the first shell of an atom hold?', '2', ['8', '18', '1'], 'The first shell holds 2; the next ones hold 8 (for the first 20 elements).'),

  // --- stretch: electromagnetic spectrum
  order('em.order', 'spectrum', 'Put the electromagnetic spectrum in order, longest wavelength first.', ['radio', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'X-rays', 'gamma rays'], null, 'Wavelength gets shorter (and frequency and energy higher) from radio to gamma.'),
  mcq('em.speed', 'spectrum', 'How fast do all electromagnetic waves travel in a vacuum?', [['At the speed of light', true], ['At the speed of sound', false, 'EM waves are much faster.'], ['Radio waves are the fastest', false, 'They all travel at the same speed in a vacuum.']], 'At the speed of light, about 300 000 km/s. They differ in wavelength and frequency, not speed.'),
  mcq('em.uv', 'spectrum', 'Which EM wave causes sunburn and can damage skin cells?', [['Ultraviolet', true], ['Infrared', false, 'Infrared is felt as heat.'], ['Radio', false, 'Radio waves are low energy.']], 'Suncream blocks UV.'),
  mcq('em.xray', 'spectrum', 'Why are X-rays useful for seeing broken bones?', [['They pass through flesh but not bone', true], ['They bounce off the skin and back to film', false, 'They pass through skin and muscle.'], ['They make the bones glow so they show', false, 'Bones absorb them, leaving a shadow.']], 'They pass through soft tissue but are absorbed by bone. Radiographers stand behind a screen because X-rays can damage cells.'),
  fact('em.ir', 'spectrum', 'Which EM wave does a TV remote control use?', 'infrared', ['ultraviolet', 'gamma rays', 'X-rays'], 'Thermal imaging cameras also detect infrared.', { accept: ['infra-red', 'ir'] }),
  mcq('em.gamma', 'spectrum', 'Gamma rays can kill cells. How is this useful?', [['To kill cancer cells and sterilise equipment', true], ['To cook food quickly from the inside', false, 'Microwaves cook food.'], ['To carry TV signals over long distances', false, 'That is radio.']], 'High-energy waves are useful but must be carefully controlled.'),

  // --- stretch: genetics
  mcq('gn.allele', 'genetics', 'What is an allele?', [['A different version of a gene', true], ['A type of chromosome', false, 'Alleles are versions of genes on chromosomes.'], ['A sex cell, like a sperm or egg', false, 'Sex cells are gametes.']], 'For example, in a simple model of eye colour, a gene may have a brown allele and a blue allele.'),
  mcq('gn.dominant', 'genetics', 'What does it mean that an allele is DOMINANT?', [['It shows its effect with only one copy', true], ['It is always the most common in a population', false, 'Dominant alleles can be rare.'], ['It needs two copies before it has any effect', false, 'That describes a recessive allele.']], 'It shows its effect even if only one copy is present. Use a capital letter for dominant (B) and a lower case letter for recessive (b).'),
  fact('gn.homo', 'genetics', 'A person with two identical alleles, such as bb, is described as…', 'homozygous', ['heterozygous', 'dominant', 'mutated'], 'Bb is heterozygous.', { accept: ['homozygote'] }),
  fact('gn.mendel', 'genetics', 'Which monk worked out the basic rules of inheritance by breeding pea plants in the 1850s and 1860s?', 'Gregor Mendel', ['Charles Darwin', 'Louis Pasteur', 'Robert Hooke'], 'His work was largely ignored until 1900.', { accept: ['mendel'] }),
  mcq('gn.sex', 'genetics', 'What decides whether a baby is a boy or a girl?', [['Whether the sperm carries X or Y', true], ['Which chromosome the egg carries', false, 'All eggs carry an X.'], ['The mother’s diet during pregnancy', false, 'It is genetic.']], 'Whether the sperm carries an X or a Y chromosome. XX: female; XY: male. The chance is 50:50.'),
  tmpl('gn.punnett', 'genetics', 'y8sPunnett'),
];

// ---------------------------------------------------------------------------------------------
// Memory hooks (optional): a topic hook, and per-item `hook` (a mnemonic or memory trick) and
// `example` (a real-world connection). Kept in this separate block, keyed by id, so corrections
// to the items above never collide with it. Unknown ids throw.
const TOPIC_HOOKS = {
  cells: 'Animal cells have the basic kit; plant cells add three extras: a **wall**, a **vacuole** and **chloroplasts**.',
  organs: 'Cell → tissue → organ → organ system → organism; enzymes are the **scissors** that cut food small.',
  respiration: 'Breathing **moves air**; respiration **releases energy**, in every living cell, day and night.',
  photosynthesis: 'Photo = **light**, synthesis = **putting together** (Greek): plants use light to build glucose.',
  ecosystems: 'Energy flows along the chain, and only about a **tenth** passes up each step.',
  inheritance: 'Nucleus = **library**, chromosome = **book**, gene = **recipe**, base = **letter**.',
  health: 'Antibiotics kill **bacteria**, never viruses; vaccines **train** the immune system before the fight.',
  particles: 'Solids **vibrate**, liquids **slide**, gases **zoom**, and the particles themselves never change size.',
  atoms: 'Element: one kind of atom. Compound: different atoms **bonded**. Mixture: **not joined**, so it can be separated.',
  periodic: 'Columns are **groups** (similar properties); rows are **periods**.',
  reactions: 'Atoms are never made or destroyed, only **rearranged**: mass in = mass out.',
  acids: '**MASH**: **M**etal + **A**cid → **S**alt + **H**ydrogen. Acid + alkali → salt + water.',
  earth: '**Igneous** from fire (Latin ignis), **sedimentary** from layers, **metamorphic** from change.',
  forces: 'Balanced forces: **no change** in motion. Unbalanced forces: speed up, slow down or turn.',
  energy: 'Energy is never used up, only **shifted between stores**, and some always leaks away as heat.',
  electricity: 'Series: one loop, **current the same** everywhere. Parallel: branches, **current splits**.',
  waves: 'Sound needs **particles** to pass it on; light can cross **empty space**, almost a million times faster.',
  space: 'Seasons come from the **tilt**, not the distance: the Earth is closest to the Sun in January.',
  working: '**Cows Moo Softly**: **C**hange one thing, **M**easure one thing, keep everything else the **S**ame.',
  atomic: '**P**rotons **p**ositive, **n**eutrons **n**eutral, both in the nucleus; electrons whizz round in shells.',
  spectrum: '**R**aging **M**artians **I**nvaded **V**enus **U**sing **X**-ray **G**uns: radio to gamma.',
  genetics: 'A **capital** letter (dominant) shows with one copy; a **small** letter (recessive) needs two.',
};

const MEMORY = {
  // --- cells
  'cl.nucleus': { hook: 'The nucleus is the cell’s **control centre**, holding the DNA instructions.' },
  'cl.membrane': { hook: 'The membrane is the **gatekeeper**: it decides what gets in and out.' },
  'cl.mito': { hook: 'Mitochondria are the **powerhouses** of the cell, where aerobic respiration releases energy.', example: 'Muscle cells, which need lots of energy, are packed with mitochondria.' },
  'cl.ribo': { hook: 'Ribosomes are tiny **protein factories**, too small for a light microscope to show.' },
  'cl.wall': { hook: 'The cell **wall** is like the walls of a house: rigid **cellulose** support.', example: 'The crunch of fresh celery comes from firm plant cell walls.' },
  'cl.vacuole': { hook: 'A full vacuole keeps the cell firm, like air in a bouncy castle.', example: 'A limp lettuce leaf crisps up in cold water as its vacuoles fill again.' },
  'cl.chloro': { hook: 'Chloro- means **green** (Greek chlōros): chloroplasts hold green chlorophyll.', example: 'Leaves look green because chlorophyll absorbs red and blue light and reflects green.' },
  'cl.which': { hook: 'Plant extras: **wall, vacuole, chloroplasts**. Both have mitochondria, because both respire.' },
  'cl.bact': { hook: 'Pro-karyote = “before the kernel” (Greek): bacteria have **no nucleus**.', example: 'The bacteria in live yoghurt are single prokaryotic cells.' },
  'cl.stain': { hook: 'Stains add **contrast**: colourless cell parts suddenly show up.' },
  'cl.em': { hook: 'Electron microscopes use beams of **electrons**, not light, so they show far tinier details.', example: 'Coronaviruses are named after the crown of spikes scientists saw round them using electron microscopes.' },
  'cl.mag': { hook: '**I AM** triangle: **I**mage size = **A**ctual size × **M**agnification.' },

  // --- organs and digestion
  'or.levels': { hook: 'Smallest to largest: cell, tissue, organ, organ system, organism, each built from the one before.', example: 'Muscle cell → muscle tissue → heart → circulatory system → you.' },
  'or.sperm': { hook: 'Lots of swimming needs lots of energy, so lots of **mitochondria**.' },
  'or.rbc': { hook: 'No nucleus = more room for **haemoglobin**, the oxygen carrier.', example: 'Blood is red because of the iron-containing haemoglobin in red blood cells.' },
  'or.enzyme': { hook: 'Enzymes are **molecular scissors**, cutting big food molecules into small ones.', example: 'Biological washing powders use enzymes to digest food stains on clothes.' },
  'or.amylase': { hook: '**Amyl**- comes from amylum, Latin for **starch**; -ase means an enzyme.', example: 'Chew a plain cracker for a minute and it starts to taste sweet.' },
  'or.protease': { hook: '**Prot**ease breaks down **prot**eins.', example: 'Meat tenderisers contain protease enzymes from papaya or pineapple.' },
  'or.lipase': { hook: '**Lip**ase breaks down **lip**ids (fats and oils).', example: 'Some biological washing powders contain lipase to lift greasy stains.' },
  'or.villi': { hook: 'Villi are like the loops on a **towel**: lots of folds give a huge surface to soak things up.' },
  'or.boil': { hook: 'Lock and key: heat **bends the lock**, so the key no longer fits.', example: 'A boiled egg white can never turn clear and runny again: its proteins are denatured.' },
  'or.acid': { hook: 'Stomach acid is a **microbe killer**, and pepsin likes it acidic.', example: 'Heartburn is stomach acid escaping up into the gullet.' },

  // --- respiration
  'rs.eq': { hook: 'Respiration is photosynthesis **backwards**: glucose + oxygen → carbon dioxide + water.', example: 'Breathe out through limewater and it turns milky: the carbon dioxide comes from respiration.' },
  'rs.diff': { hook: '**B**reathing is the **b**ellows; **r**espiration is the **r**eaction in cells.' },
  'rs.anaer': { hook: 'An-aerobic = **without air** (Greek): short of oxygen, muscles make lactic acid.', example: 'After a 100 m sprint you keep panting to pay back the oxygen debt.' },
  'rs.yeast': { hook: 'Yeast **ferments** sugar: ethanol + carbon dioxide.', example: 'The holes in a slice of bread are bubbles of carbon dioxide made by yeast.' },
  'rs.alveoli': { hook: 'Alveoli are tiny **air sacs**, like bunches of grapes, with walls one cell thick.' },
  'rs.smoke': { hook: 'Carbon monoxide **hijacks haemoglobin**, so the blood carries less oxygen.', example: 'Homes have carbon monoxide alarms because the gas has no colour or smell.' },
  'rs.air': { hook: 'Nose → trachea → bronchus → bronchiole → alveolus: big pipes branching into ever tinier ones.', example: 'The branching airways are called the bronchial tree: an upside-down tree in your chest.' },
  'rs.mito': { hook: 'Mitochondria are the cell’s **power stations**: aerobic respiration happens there.' },

  // --- photosynthesis
  'ps.eq': { hook: 'Carbon dioxide + water → glucose + oxygen: the reverse of respiration.', example: 'Pondweed in bright light gives off streams of tiny oxygen bubbles.' },
  'ps.limit': { hook: 'The limiting factors are **light, CO₂ and temperature**: the one in shortest supply sets the pace.', example: 'Growers pump extra carbon dioxide into greenhouses to make tomatoes grow faster.' },
  'ps.iodine': { hook: 'Iodine: orange-brown → **blue-black** means **starch**.', example: 'A drop of iodine on a cut potato turns blue-black.' },
  'ps.stomata': { hook: 'Stoma is Greek for **mouth**: stomata are the leaf’s tiny mouths.' },
  'ps.xylem': { hook: '**Ph**loem carries **f**ood (both start with an f sound), so xylem is the water pipe.', example: 'Stand a celery stick in food colouring and its xylem vessels turn coloured.' },
  'ps.roothair': { hook: 'Root hairs soak up water **and minerals**, such as nitrates and magnesium.', example: 'Garden “plant food” is mostly mineral ions, such as nitrates.' },
  'ps.stigma': { hook: 'The **st**igma is **st**icky, to catch pollen.' },
  'ps.anther': { hook: 'The stamen (anther + filament) is the male part: think “sta-**men**”.', example: 'Lily anthers drop orange pollen that stains clothes.' },
  'ps.ovary': { hook: 'After fertilisation the ovary becomes the **fruit** and the ovules become **seeds**.', example: 'A pea pod is a ripened ovary, and the peas were its ovules.' },
  'ps.helmont': { hook: 'A tree is built mostly from **thin air**: its carbon comes from CO₂.', example: 'Most of the mass of a log on the fire came from carbon dioxide in the air.' },

  // --- ecosystems
  'ec.arrow': { hook: 'Arrows point to the **eater**: read each arrow as “is eaten by”.', example: 'grass → rabbit → fox: grass is eaten by rabbit, rabbit is eaten by fox.' },
  'ec.producer': { hook: '**Producers produce** their own food by photosynthesis.', example: 'Tiny phytoplankton in the sea are the producers at the base of food chains that feed fish and whales.' },
  'ec.loss': { hook: 'Only about **10%** passes up each step: the rest goes on movement, heat and waste.', example: 'A field of wheat feeds far more people than the same field used to raise cattle.' },
  'ec.decomp': { hook: 'Decomposers are nature’s **recyclers**.', example: 'A compost heap, mushrooms on a rotting log and mould on old bread are decomposers at work.' },
  'ec.bees': { hook: 'Bees are flying **pollen couriers**.', example: 'Apples, strawberries and oilseed rape all crop better when bees visit their flowers.' },
  'ec.bioacc': { hook: 'Bio-**accumulation**: poison piles up the chain because each eater eats many meals.', example: 'After pesticides such as DDT were phased out, peregrine falcons recovered in Britain.' },
  'ec.web': { hook: 'Remove a predator and its prey **boom**; then the prey’s food **crashes**.', example: 'Where sea otters vanished, sea urchins boomed and ate whole kelp forests.' },
  'ec.niche': { hook: 'Competition: the same food, space or mates, and not enough to go round.', example: 'Seedlings sown too close together compete for light and stay small.' },

  // --- inheritance and evolution
  'in.dna': { hook: 'Nucleus = library, chromosome = book, gene = recipe, base = letter.' },
  'in.number': { hook: '**23 pairs** = 46: one of each pair from each parent.', example: 'A sperm and an egg each bring 23 chromosomes: 23 + 23 = 46.' },
  'in.helix': { hook: 'A double helix is a **twisted ladder**.', example: 'A spiral staircase has the same shape as DNA’s double helix.' },
  'in.var': { hook: 'Genes deal the cards; the **environment** plays them. A scar is all environment.', example: 'Identical twins share their genes, but only one might have a scar.' },
  'in.ns': { hook: 'Natural selection: **variation**, **survival** of the best suited, **passing on** the genes.', example: 'Since Britain’s air was cleaned up, pale peppered moths have become common again.' },
  'in.darwin': { hook: 'Darwin + the **Beagle** + the **Galápagos** = evolution by natural selection.', example: 'Darwin’s face was on the Bank of England £10 note from 2000 to 2018.' },
  'in.resist': { hook: 'Stop early and the **toughest** bacteria survive and multiply.', example: 'MRSA is a “superbug”: bacteria resistant to many antibiotics.' },
  'in.extinct': { hook: '**Dead as a dodo**: extinct means gone for ever.', example: 'The dodo lived only on Mauritius and was wiped out after sailors arrived.' },
  'in.fossil': { hook: 'Rock layers are a **history book**: the deeper the page, the older it is.', example: 'The cliffs of Dorset’s Jurassic Coast are full of fossil ammonites.' },

  // --- health
  'hd.virus': { hook: 'Anti**b**iotics beat **b**acteria; viruses hide inside your own cells.' },
  'hd.vaccine': { hook: 'A vaccine is a **wanted poster**: white blood cells learn the face before the real criminal arrives.', example: 'The MMR jab protects against measles, mumps and rubella.' },
  'hd.jenner': { hook: 'Vacca = **cow** (Latin): Jenner used cowpox to protect against smallpox.', example: 'Smallpox was declared wiped out worldwide in 1980.' },
  'hd.fleming': { hook: 'Fleming’s messy bench: a mouldy dish led to **penicillin**.', example: 'Penicillin, from the Penicillium mould, has saved millions of lives.' },
  'hd.hippocrates': { hook: 'Hippocrates: illness has **natural** causes, not angry gods.' },
  'hd.defence': { hook: 'First line = **keep them out**: skin, mucus, cilia and stomach acid.', example: 'A cut needs a plaster because broken skin lets microbes in.' },
  'hd.diet': { hook: 'Vitamin **C** for long voyages at **sea**: it prevents scurvy.', example: 'British sailors were nicknamed “limeys” after the lime juice they drank.' },
  'hd.drug': { hook: '**Nicotine** hooks you; **tar** causes cancer; **carbon monoxide** steals oxygen.' },

  // --- particles
  'pt.solid': { hook: 'Solid: particles in neat rows, **vibrating on the spot**.', example: 'An ice cube keeps its shape until it starts to melt.' },
  'pt.gas': { hook: 'Gas: particles **far apart and zooming** in all directions.', example: 'Air pumped into a bike tyre spreads into every part of it.' },
  'pt.democritus': { hook: 'A-tomos = **uncuttable** (Greek): the root of the word atom.' },
  'pt.diffusion': { hook: 'Diffusion: from **crowded to empty**, faster in gases and faster when hot.', example: 'You can smell toast from upstairs in seconds, but squash takes ages to spread through still water.' },
  'pt.melt': { hook: 'Melting: particles get enough energy to **slide**, but stay close together.', example: 'Chocolate melts in a hot car and sets again in the fridge: a physical change.' },
  'pt.temp': { hook: 'While water boils, the energy **pulls particles apart** instead of making them hotter.', example: 'Turning the hob up under boiling pasta makes it boil harder, not hotter than 100 °C.' },
  'pt.icarus': { hook: '**Melting**: solid → liquid. **Freezing**: liquid → solid.', example: 'Candle wax melts near the flame, and the drips turn solid again as they cool.' },
  'pt.sublime': { hook: 'Sublimation **skips the liquid**: solid straight to gas.', example: 'Dry ice is used to make the low, swirling fog on stage at concerts.' },
  'pt.gaspress': { hook: 'Gas pressure = billions of tiny **particle punches** on the walls every second.', example: 'A football left in hot sun feels harder: its air particles hit the inside faster.' },
  'pt.density': { hook: 'Density triangle: **m** on top, **ρ × V** below: density = mass ÷ volume.', example: 'Ice (about 0.92 g/cm³) floats because it is less dense than water (1.0 g/cm³).' },

  // --- elements, compounds and separating
  'at.which': { hook: 'Compound = different atoms **chemically joined**, with a formula like H₂O.', example: 'Water, table salt and carbon dioxide are compounds; oxygen and gold are elements.' },
  'at.mixture': { hook: 'Mixtures are **just mixed**: you can sort them out without a reaction.', example: 'A magnet pulls iron filings out of sand, but cannot pull the iron out of rust.' },
  'at.distil': { hook: 'Distil = **boil, then cool**: the vapour leaves the salt behind.', example: 'Rain is nature’s distillation: the Sun evaporates sea water and leaves the salt behind.' },
  'at.chrom': { hook: 'Chroma = **colour**, graph = **writing** (Greek): colour-writing.', example: 'Forensic scientists use chromatography to compare the inks on documents.' },
  'at.filter': { hook: 'A filter is a **sieve for tiny bits**: insoluble solids stay behind.', example: 'A coffee filter keeps back the grounds and lets the coffee through.' },
  'at.salt': { hook: 'Salt dissolves, sand doesn’t: **dissolve, filter, evaporate**.', example: 'Sea salt is made by evaporating sea water in shallow pans.' },
  'at.formula': { hook: 'A small number counts the atom **just before** it: CO₂ = C + O + O.' },
  'at.symbol': { hook: 'Odd symbols come from Latin: **Na**trium (sodium), **Fe**rrum (iron), **Pb** plumbum (lead), **Au**rum (gold).', example: 'Plumbers are named after plumbum, because water pipes were once made of lead.' },
  'at.pure': { hook: 'Pure = **one substance only**, with sharp melting and boiling points.', example: 'Salt is spread on icy roads because it lowers the freezing point of water.' },

  // --- periodic table
  'pd.mendeleev': { hook: 'Mendeleev left **gaps**, and predicted what would fill them.', example: 'Element 101, mendelevium, is named after him.' },
  'pd.group': { hook: '**Groups** go down (columns); **periods** go across (rows).' },
  'pd.g1': { hook: 'Group 1 metals make **alkalis** with water: hence alkali metals.', example: 'Lithium, the lightest Group 1 metal, is in the battery of your phone.' },
  'pd.g1trend': { hook: 'Group 1: reactivity goes **up as you go down**.', example: 'Lithium fizzes gently on water; potassium bursts into lilac flames.' },
  'pd.g7': { hook: 'Halogen = **salt-maker** (Greek hals, salt).', example: 'Chlorine keeps swimming pools free of germs; iodine is used as an antiseptic.' },
  'pd.g0': { hook: 'Noble gases are **snobs**: full outer shells, so they hardly ever react with anyone.', example: 'Neon glows red-orange in signs; helium fills party balloons.' },
  'pd.metal': { hook: 'Non-metals are mostly **dull, brittle insulators**; graphite is the rebel that conducts.', example: 'Pencil “lead” is graphite: a thick pencil line on paper can conduct a little electricity.' },
  'pd.where': { hook: 'Metals on the **left** and middle, non-metals top **right**, split by the staircase.' },

  // --- reactions
  'rx.chem': { hook: 'Chemical change = a **new substance**, usually hard to undo.', example: 'Toast can never turn back into bread, but melted chocolate sets again.' },
  'rx.combust': { hook: 'Burning a fuel like methane: fuel + oxygen → **carbon dioxide + water**.', example: 'Gas boilers are checked every year so they burn completely and make no carbon monoxide.' },
  'rx.triangle': { hook: 'Fire triangle: **heat, fuel, oxygen**: take one away and the fire dies.', example: 'A fire blanket cuts off the oxygen from a pan fire.' },
  'rx.mass': { hook: 'The white ash is **heavier** than the ribbon: it has grabbed oxygen from the air.', example: 'Rust weighs more than the iron it came from, because it has gained oxygen (and water).' },
  'rx.exo': { hook: '**Ex**othermic: heat **ex**its. **En**dothermic: heat **en**ters.', example: 'A campfire is exothermic; sherbet feels cool as it fizzes on your tongue: endothermic.' },
  'rx.decomp': { hook: 'Thermal **de-composition**: heat **breaks one substance into two or more**.', example: 'Bicarbonate of soda breaks down when heated, giving off carbon dioxide that helps cakes rise.' },
  'rx.test': { hook: 'Hydrogen **pops**, oxygen **relights** a glowing splint, carbon dioxide turns limewater **milky**.', example: 'The Hindenburg airship was filled with hydrogen, which burned explosively in 1937.' },
  'rx.balance': { hook: 'Balance with **big numbers in front**; never change the small numbers inside a formula.' },

  // --- acids, alkalis and metals
  'ac.ph7': { hook: 'pH **7** is neutral: below 7 is acid, above 7 is alkali.', example: 'Lemon juice is about pH 2; soapy water is about pH 9 to 10.' },
  'ac.neut': { hook: 'Acid + alkali → **salt + water**: they cancel each other out.', example: 'Farmers spread lime on acidic fields to neutralise the soil.' },
  'ac.salt': { hook: 'Hydro**chlor**ic → **chlor**ides, **sulf**uric → **sulf**ates, **nitr**ic → **nitr**ates.', example: 'Sodium chloride is the table salt on your chips.' },
  'ac.metal': { hook: '**MASH**: **M**etal + **A**cid → **S**alt + **H**ydrogen.', example: 'Magnesium ribbon fizzes in dilute acid: the bubbles are hydrogen.' },
  'ac.series': { hook: 'Please Stop Calling Me A Careless Zebra Instead Try Learning How Copper Saves Gold: K Na Ca Mg Al C Zn Fe Sn Pb H Cu Ag Au', example: 'Gold coins from old shipwrecks still gleam, while iron cannons from the same wrecks are crusted with rust.' },
  'ac.gold': { hook: 'Gold is the **lazy** metal: too unreactive to join anything, so it lies about pure.', example: 'Gold leaf on old picture frames and church domes still shines after centuries.' },
  'ac.displace': { hook: 'Displacement is a **playground bully**: the more reactive metal pushes the weaker one out.' },
  'ac.indig': { hook: 'Bases **cancel** acids: that is neutralisation.', example: 'Many indigestion tablets contain calcium carbonate, the same compound as chalk.' },
  'ac.uip': { hook: 'Universal indicator runs like a **rainbow**: red (strong acid) → green (neutral) → purple (strong alkali).', example: 'Red cabbage juice is a homemade indicator: pink in vinegar, blue or green in alkalis.' },

  // --- Earth and atmosphere
  'er.igneous': { hook: 'Igneous comes from Latin ignis, **fire**: it starts as molten rock.', example: 'The Giant’s Causeway in Northern Ireland is columns of basalt from cooled lava.' },
  'er.fossil': { hook: 'Fossils rest in **sedimentary** rock, laid down gently in layers like pages in a book.', example: 'Fossil hunters find ammonites on the beach at Lyme Regis.' },
  'er.marble': { hook: 'Meta-morph = **change of form** (Greek): limestone changes into marble.', example: 'Michelangelo’s statue of David is carved from marble.' },
  'er.air': { hook: 'Air is about **four-fifths nitrogen** and one-fifth oxygen.' },
  'er.co2': { hook: 'Plants are carbon **sponges**: photosynthesis takes CO₂ out of the air.', example: 'Planting new forests is one way countries try to soak up carbon dioxide.' },
  'er.greenhouse': { hook: 'Greenhouse gases are a **blanket**: the heat gets out more slowly.', example: 'Venus, with its thick carbon dioxide atmosphere, is hotter than Mercury, though further from the Sun.' },
  'er.carbon': { hook: 'Carbon goes **round and round**: air → plants → animals → air.', example: 'The carbon in your toast was carbon dioxide in the air only months ago.' },
  'er.weather': { hook: '**Weathering** breaks rock where it is; **erosion** carries the bits away.', example: 'Potholes grow in winter as water in cracks freezes and expands.' },

  // --- forces
  'fo.balanced': { hook: 'Balanced = **no change**: still stays still, moving keeps moving steadily.', example: 'If a car stops suddenly your body keeps moving forward: that is why seatbelts matter.' },
  'fo.terminal': { hook: 'Terminal = **end** (Latin terminus): the top speed, when air resistance equals weight.', example: 'Skydivers fall at about 55 m/s spread flat, but much faster diving head-down.' },
  'fo.weight': { hook: 'Weight = mass × g: **W = mg**, with g ≈ 10 N/kg on Earth.', example: 'A 1 kg bag of sugar weighs about 10 N.' },
  'fo.mass': { hook: 'Mass is the **stuff** in you; weight is the **pull** on that stuff.', example: 'Astronauts bounded about on the Moon in heavy suits because they weighed only a sixth as much.' },
  'fo.dt': { hook: 'Distance–time: a flat line = **stopped**; a steeper line = **faster**.', example: 'On a graph of a bus journey, each flat bit is a stop at a bus stop.' },
  'fo.newton3': { hook: 'Newton 3: **every push gets a push back**, equal and opposite, on the other object.', example: 'A swimmer pushes the water backwards, and the water pushes the swimmer forwards.' },
  'fo.speed': { hook: 'Formula triangle: **d** on top, **s × t** below: speed = distance ÷ time.', example: 'A sprinter running 100 m in 10 s averages 10 m/s.' },
  'fo.pressure': { hook: 'Formula triangle: **F** on top, **p × A** below: pressure = force ÷ area.', example: 'A sharp knife cuts easily: its tiny edge area gives a huge pressure.' },
  'fo.moments': { hook: 'Moment = force × distance: a **longer spanner** turns a nut more easily.', example: 'Door handles are far from the hinges, so a small push gives a big turning effect.' },
  'fo.hooke': { hook: 'Hooke’s law: **double the pull, double the stretch** (up to the limit).', example: 'Spring luggage scales use Hooke’s law to weigh your suitcase.' },

  // --- energy
  'en.store': { hook: 'Stretched, squashed or bent = an **elastic** store.', example: 'A trampoline’s springs store elastic energy and fling you back up.' },
  'en.conserve': { hook: 'Energy is like **money moved between accounts**: the total never changes.', example: 'An old filament bulb gets hot: much of its energy is wasted heating the room.' },
  'en.bounce': { hook: 'Every bounce **leaks** a little energy as heat and sound.', example: 'Squash players warm the ball up before a game, because a warm ball bounces higher.' },
  'en.renew': { hook: '**Renew**able resources **renew** themselves: wind, sun, waves, tides, rivers.', example: 'Solar panels on roofs and wind farms in the North Sea.' },
  'en.conduct': { hook: 'Metals **pass heat on**; plastic and wood **hold it back**.', example: 'A metal spoon left in hot tea soon gets too hot to hold.' },
  'en.convect': { hook: 'Convection: hot fluid **rises**, cool fluid **sinks**, round and round.', example: 'A hot-air balloon rises because the air inside is warmer and less dense.' },
  'en.power': { hook: 'Power = energy ÷ time: a 3 kW kettle transfers **3000 J every second**.', example: 'Electricity bills count kilowatt-hours: 1 kW running for 1 hour.' },

  // --- electricity and magnetism
  'el.series': { hook: 'Series = **one road**: more bulbs share the push, so each is dimmer.', example: 'In old Christmas lights wired in series, one broken bulb blacked out the whole string.' },
  'el.parallel': { hook: 'Parallel = **own branch, full voltage** for each.', example: 'You can switch off the kitchen light without the hall light going out.' },
  'el.ammeter': { hook: 'An ammeter must **join the queue** (series) to count the charge going past; a voltmeter watches from the side.' },
  'el.unit': { hook: 'The ohm’s symbol, Ω, is the Greek capital **omega**.' },
  'el.static': { hook: 'Rubbing **moves electrons**. Like charges repel; opposites attract.', example: 'You can get a small shock from a car door after sliding across the seat.' },
  'el.electromag': { hook: 'Stronger electromagnet: more **turns**, more **current**, an iron **core**.', example: 'Electric door locks and doorbells use electromagnets.' },
  'el.field': { hook: 'Outside a magnet, field lines run **north → south**, the way a compass needle points.', example: 'Iron filings sprinkled round a magnet show its field-line pattern.' },
  'el.ohm': { hook: 'Formula triangle: **V** on top, **I × R** below: V = IR.', example: 'Phone chargers are labelled with volts and amps, such as 5 V, 2 A.' },

  // --- sound and light
  'wv.sound': { hook: 'Sound is a **passed-on wobble**: no particles, nothing to pass it on.', example: 'Astronauts on spacewalks talk by radio, which can cross empty space.' },
  'wv.pitch': { hook: '**Hi**gh frequency = **hi**gh pitch; bigger amplitude = louder.', example: 'A flute plays higher notes than a tuba: its sound waves have a higher frequency.' },
  'wv.reflect': { hook: 'Angle in = angle out, both measured from the **normal**.', example: 'Snooker players use the same rule to bounce a ball off the cushion.' },
  'wv.refract': { hook: 'Refraction = **bending** as light changes speed.', example: 'A swimming pool looks shallower than it really is.' },
  'wv.prism': { hook: '**R**ichard **O**f **Y**ork **G**ave **B**attle **I**n **V**ain: red, orange, yellow, green, blue, indigo, violet.', example: 'A rainbow is sunlight split into colours by raindrops.' },
  'wv.red': { hook: 'You see the colour that is **bounced back**; all the others are absorbed.', example: 'A black T-shirt gets hot in the sun because it absorbs every colour.' },
  'wv.speed': { hook: 'Lightning: **flash first, crash later**. Light wins every race.', example: 'Count the seconds from flash to thunder: about 3 seconds for every kilometre.' },
  'wv.calc': { hook: 'Wave speed = frequency × wavelength: **v = fλ**.', example: 'On a pond, count the ripples passing each second and measure the gap between crests.' },

  // --- space
  'sp.seasons': { hook: 'It is the **tilt** (about 23.5°): each hemisphere takes a turn leaning towards the Sun.', example: 'When it is summer in Britain it is winter in Australia.' },
  'sp.gravity': { hook: 'The Moon is **always falling** towards Earth, but moving sideways fast enough to keep missing.', example: 'The Moon’s gravity also pulls on the oceans, causing the tides.' },
  'sp.phases': { hook: '**DOC**: seen from Britain, a **D** shape is waxing, an **O** is full, a **C** is waning.', example: 'The Moon’s lit half never changes; only how much of it we can see.' },
  'sp.year': { hook: 'Four quarter-days make one extra **leap day** every four years.', example: '29 February comes round once every four years.' },
  'sp.erat': { hook: 'Two cities, two shadows, one **angle**: Eratosthenes measured the whole Earth.', example: 'At midsummer noon in Syene the Sun was said to shine straight down a well, with no shadow.' },
  'sp.lightyear': { hook: 'A light **year** is a **distance**, like saying a town is “an hour away”.', example: 'Light from Proxima Centauri, the nearest star after the Sun, takes about 4.2 years to reach us.' },
  'sp.size': { hook: 'Moon < Earth < Sun < Milky Way: over a million Earths would fit inside the Sun.' },
  'sp.weight': { hook: 'Weight depends on the **planet’s pull**: a weaker g means you weigh less.', example: 'A 50 kg person weighs about 500 N on Earth but only about 185 N on Mars.' },

  // --- working scientifically
  'wk.iv': { hook: '**I** change the **I**ndependent; the **D**ependent is the **D**ata I measure.' },
  'wk.control': { hook: 'Control variables are **kept the same**, so the test is fair.', example: 'Testing paper aeroplanes? Same thrower, same throw and same room each time.' },
  'wk.precise': { hook: '**P**recise = readings **P**acked together; **A**ccurate = **A**t the true value.', example: 'Darts clumped tightly together but far from the bullseye are precise, not accurate.' },
  'wk.repeat': { hook: 'Once could be luck: **repeat and average** to see the real pattern.', example: 'A league table is fairer than one match: more results smooth out the luck.' },
  'wk.graph': { hook: 'Numbers on both axes? **Line graph**. Categories (names)? **Bar chart**.', example: 'Weather apps show the temperature through the day as a line graph.' },
  'wk.hypo': { hook: 'A good hypothesis: **If… then… because…**' },
  'wk.sys': { hook: 'Systematic errors are the **same every time**; random errors **jump about**.', example: 'Bathroom scales that show 1 kg with nobody on them add 1 kg to everyone.' },
  'wk.correl': { hook: '**Correlation is not causation**: look for a hidden third factor.', example: 'Bigger fires bring more fire engines, but the fire engines do not cause the damage.' },

  // --- stretch: inside the atom
  'am.parts': { hook: '**P**rotons **p**ositive and **n**eutrons **n**eutral sit in the nucleus; electrons orbit outside.', example: 'If an atom were as wide as a football pitch, its nucleus would be about the size of a pinhead.' },
  'am.number': { hook: 'Atomic number = **proton number**: the element’s ID card.', example: 'Carbon is number 6: every carbon atom anywhere has 6 protons.' },
  'am.isotope': { hook: 'Isotope = **same place** (Greek isos + topos) in the periodic table: same protons, different neutrons.', example: 'Carbon-14 dating showed that Ötzi the Iceman lived over 5000 years ago.' },
  'am.neutrons': { hook: 'Neutrons = **mass number − atomic number** (big number minus small number).' },
  'am.rutherford': { hook: 'Rutherford said it was like firing a shell at **tissue paper** and having it bounce back.' },
  'am.ionic': { hook: 'Ionic = **give and take**: the metal gives electrons, the non-metal takes them.', example: 'Table salt crystals are a lattice of Na⁺ and Cl⁻ ions.' },
  'am.covalent': { hook: '**Co**valent = **co**-operate: non-metals **share** pairs of electrons.', example: 'Water, carbon dioxide and the oxygen you breathe are all covalent molecules.' },
  'am.shell': { hook: 'Shells fill **2, 8, 8**: the first shell is a two-seater.' },

  // --- stretch: electromagnetic spectrum
  'em.order': { hook: '**R**aging **M**artians **I**nvaded **V**enus **U**sing **X**-ray **G**uns: radio, micro, infrared, visible, UV, X, gamma.' },
  'em.speed': { hook: 'All EM waves are **equally fast** in a vacuum: about 300 000 km/s.', example: 'Radio signals from rovers on Mars take several minutes to reach Earth, even at light speed.' },
  'em.uv': { hook: '**Ultra**violet = **beyond** violet: too energetic for skin to ignore.', example: 'You can still get sunburnt on a cloudy day, because UV gets through clouds.' },
  'em.xray': { hook: 'Bones **block** X-rays, flesh **lets them through**: the shadow is the picture.', example: 'Airport scanners use X-rays to see inside suitcases.' },
  'em.ir': { hook: '**Infra**red = **below** red: we feel it as heat.', example: 'Point a TV remote at a phone camera and press a button: many cameras show its invisible flash.' },
  'em.gamma': { hook: 'Gamma: the **most energy**, so the most danger, and most useful when carefully aimed.', example: 'Syringes and bandages are sterilised with gamma rays.' },

  // --- stretch: genetics
  'gn.allele': { hook: 'The gene is the **feature** (eye colour); alleles are its **versions** (brown, blue).' },
  'gn.dominant': { hook: 'Dominant alleles **dominate**: one copy is enough. Give them a capital letter.' },
  'gn.homo': { hook: 'Homo = **same**, hetero = **different** (Greek): bb is homozygous, Bb is heterozygous.' },
  'gn.mendel': { hook: 'Mendel’s **peas** gave us the rules of inheritance.', example: 'Mendel bred tall and short pea plants in his monastery garden in Brno.' },
  'gn.sex': { hook: 'Eggs always carry **X**; the sperm decides: **X → girl, Y → boy**.' },
  'gn.punnett': { hook: 'Punnett square: one parent’s alleles **across the top**, the other’s **down the side**, then fill every box.' },
};
for (const t of topics) {
  const key = t.id.replace(/^science\./, '');
  if (TOPIC_HOOKS[key]) t.hook = TOPIC_HOOKS[key];
}
for (const key of Object.keys(TOPIC_HOOKS)) if (!topics.some((t) => t.id === `science.${key}`)) throw new Error(`y8/science.mjs: topic hook for unknown topic ${key}`);
for (const [id, memory] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `science.${id}`);
  if (!item) throw new Error(`y8/science.mjs: memory hook for unknown item ${id}`);
  Object.assign(item, memory);
}
// --- end of memory hooks

export default [{ subject: 'science', deck: 'y8', topics, items }];

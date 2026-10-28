// Science stretch tier (early Year 8): the periodic table, chemical reactions, digestion,
// light, and circuits with V = I × R.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, labels, explain) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'order', prompt, items, labels, explain });
const tmpl = (id, topic, gen, seed, extra = {}) => ({ id: `science.${id}`, topic: `science.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed, ...extra });
const choiceOnly = { formats: ['choice'] };

// [name, symbol, where the symbol comes from, memory hook, real-world example]
const SYMBOLS = [
  ['sodium', 'Na', 'its Latin name (natrium)', '**Na** from **na**trium: the Na in NaCl, the salt on your chips.', 'Old orange street lights in the UK were sodium lamps.'],
  ['potassium', 'K', 'its Latin name (kalium)', '**K** from **k**alium: think “**K**-rich bananas”, which are full of potassium.', 'Plant feed labels show NPK: nitrogen, phosphorus and potassium (K).'],
  ['iron', 'Fe', 'its Latin name (ferrum)', '**Fe** from **fe**rrum, as in **fe**rrous metals.', 'Magnets stick to a steel fridge door because steel is mostly iron.'],
  ['copper', 'Cu', 'its Latin name (cuprum)', '**Cu** from **cu**prum, named after Cyprus, where the Romans got their copper.', 'The wires inside a phone charger cable’s plastic coating are copper.'],
  ['lead', 'Pb', 'its Latin name (plumbum)', '**Pb** from **p**lum**b**um: Romans made water pipes of lead, which is why we have **plumbers**.', 'Many old church roofs are covered in sheets of lead.'],
  ['silver', 'Ag', 'its Latin name (argentum)', '**Ag** from **a**r**g**entum: Argentina was named after silver.', 'Silver jewellery is often stamped “925”, meaning sterling silver.'],
  ['gold', 'Au', 'its Latin name (aurum)', '**Au**: “**A**y, yo**u**! Give me back my gold!”', 'Gold never rusts or tarnishes, which is why it’s used for wedding rings.'],
  ['tin', 'Sn', 'its Latin name (stannum)', '**Sn** from **s**ta**n**num. The odd one out: there’s no S in “tin”!', '“Tin” cans are really steel with a thin coat of tin to stop them rusting.'],
  ['mercury', 'Hg', 'its Latin name (hydrargyrum)', '**Hg** from **h**ydrar**g**yrum, “watery silver”: a metal that is liquid at room temperature.', 'Old glass thermometers held mercury; today’s are digital or use coloured alcohol, as mercury is poisonous.'],
  ['tungsten', 'W', 'its other name, wolfram', '**W** from **w**olfram, tungsten’s other name.', 'Old-style filament light bulbs glowed using a thin coil of tungsten wire.'],
];

const topics = [
  { id: 'science.periodic', title: 'The periodic table', kind: 'facts', tier: 'stretch', prereqs: ['science.atoms'], batch: 6, intro: 'Every element in the universe, arranged so that similar ones line up in columns. Learn to read the table and you can predict how an element you have never met will behave.', teach: 'Explain what a group and a period are on the periodic table.', talk: 'Ask her why gold’s symbol is Au and not Go.', hook: 'First ten elements: **Happy Henry Lives Beside Boring Cousin Nicholas’s Old Friend Nellie** (H, He, Li, Be, B, C, N, O, F, Ne).' },
  { id: 'science.reactions', title: 'Chemical reactions and conservation of mass', kind: 'mixed', tier: 'stretch', prereqs: ['science.periodic', 'science.acids'], links: ['maths'], batch: 6, intro: 'In a chemical reaction atoms are rearranged into new substances, but none are made or lost. That one idea lets you predict masses, write word equations and explain why a burnt match weighs less.', teach: 'Explain why magnesium gets heavier when it burns.', talk: 'Ask her where the mass of a burning candle goes.', hook: 'Atoms are **rearranged**, never made or destroyed: mass in = mass out.' },
  { id: 'science.digestion', title: 'Digestion and nutrition', kind: 'facts', tier: 'stretch', prereqs: ['science.cells', 'science.body'], batch: 6, intro: 'Food is broken down by enzymes into molecules small enough to pass into the blood. Each nutrient has a job, and each organ has a role.', teach: 'Explain what enzymes do in digestion.', talk: 'Ask her which food test would show whether bread contains starch.', hook: 'Enzymes are **chemical scissors**, cutting food into molecules small enough to pass into the blood.' },
  { id: 'science.light-2', title: 'Light: reflection, refraction and colour', kind: 'facts', tier: 'stretch', prereqs: ['science.light'], batch: 6, intro: 'Light travels in straight lines at 300,000 km per second, bounces off mirrors at the same angle it arrives, bends when it enters glass or water, and is made of all the colours of the rainbow.', teach: 'Explain why a straw in a glass of water looks bent.', talk: 'Shine a torch through a glass of water onto a wall and look for colours at the edge.', hook: '**Reflection bounces, refraction bends**, and white light is **R**ichard **O**f **Y**ork **G**ave **B**attle **I**n **V**ain.' },
  { id: 'science.circuits', title: 'Circuits: current, voltage and resistance', kind: 'mixed', tier: 'stretch', prereqs: ['science.electricity', 'science.forces7'], links: ['maths'], batch: 6, intro: 'Current is the flow of charge; voltage is the push; resistance is what slows it down. The three are linked by one equation, V = I × R, and series and parallel circuits follow different rules.', teach: 'Explain the difference between current and voltage.', talk: 'Ask her why the lights at home do not all go out when one bulb fails.', hook: '**V = I × R**. Series: one loop, same current. Parallel: separate branches, same voltage.' },
];

const items = [
  // --- periodic table
  mcq('pe.d1', 'periodic', 'About how many different elements are there?', [['About 118', true], ['About 1,000', false, 'Far fewer: 118 known elements make up everything.'], ['About 20', false, 'There are 118, though about 90 occur naturally.']], 'Everything from stars to spiders is built from these 118 elements, mostly combined into compounds.', choiceOnly),
  fact('pe.mendeleev', 'periodic', 'Which Russian chemist arranged the elements into the first periodic table in 1869, leaving gaps for elements not yet discovered?', 'Dmitri Mendeleev', ['Marie Curie', 'John Dalton', 'Antoine Lavoisier'], 'Mendeleev predicted the properties of the missing elements, such as gallium and germanium, and was proved right.', { accept: ['mendeleev'] }),
  fact('pe.group', 'periodic', 'On the periodic table, what is a vertical column called?', 'a group', ['a period', 'a row', 'a block'], 'Elements in the same group have similar properties because they have the same number of electrons in their outer shell.', { accept: ['group'] }),
  fact('pe.period', 'periodic', 'On the periodic table, what is a horizontal row called?', 'a period', ['a group', 'a column', 'a series'], 'Across a period, elements change from metals on the left to non-metals on the right.', { accept: ['period'] }),
  mcq('pe.metals', 'periodic', 'Where are the metals on the periodic table?', [['On the left and in the middle', true], ['On the right-hand side', false, 'The right-hand side is non-metals: oxygen, nitrogen, the halogens and noble gases.'], ['Only along the bottom two rows', false, 'The bottom rows are metals, but so is most of the table: about three quarters of elements are metals.']], 'A staircase line near the right separates metals from non-metals.', choiceOnly),
  fact('pe.alkali', 'periodic', 'Lithium, sodium and potassium belong to which group of very reactive metals that fizz on water?', 'group 1, the alkali metals', ['group 7, the halogens', 'group 0, the noble gases', 'the transition metals'], 'Alkali metals are soft, stored under oil, and react more violently the further down the group you go: potassium bursts into lilac flame on water.', choiceOnly),
  fact('pe.noble', 'periodic', 'Helium, neon and argon are unreactive gases in which group?', 'group 0', ['group 1', 'group 7', 'group 2'], 'Noble gases have full outer electron shells, so they do not need to react. Argon fills light bulbs; helium lifts balloons.', choiceOnly),
  fact('pe.halogen', 'periodic', 'Fluorine, chlorine, bromine and iodine are the…', 'halogens (group 7)', ['alkali metals (group 1)', 'noble gases (group 0)', 'transition metals'], 'Halogens are reactive non-metals. Unlike group 1, they get LESS reactive down the group.', choiceOnly),
  ...SYMBOLS.map(([name, sym, origin, hook, example], i) => fact(`pe.sym.${sym.toLowerCase()}`, 'periodic', `What is the chemical symbol for ${name}?`, sym, SYMBOLS.filter((s) => s[1] !== sym).slice(i % 3, i % 3 + 3).map((s) => s[1]), `${sym} is ${name}. The symbol comes from ${origin}.`, { strict: true, hook, example })),

  // --- reactions
  tmpl('rx.mass', 'reactions', 'massConserve', [-0.5, 0.3, 0.9], { credits: ['maths.ratio'] }),
  mcq('rx.d1', 'reactions', 'A match burns and the ash weighs less than the match. Has mass been destroyed?', [['No: the missing mass escaped as gases', true], ['Yes: burning destroys some of the matter', false, 'Weigh the gases too and the total is unchanged. Mass is conserved.'], ['No: the ash is just squashed and denser', false, 'The ash is lighter because atoms have left as gas, not because it is compressed.']], 'Lavoisier showed in the 1770s that in a sealed container, mass never changes in a reaction.', choiceOnly),
  fact('rx.reactants', 'reactions', 'In a word equation, what are the substances on the left of the arrow called?', 'reactants', ['products', 'catalysts', 'elements'], 'Reactants → products. The arrow means “react to make”.'),
  fact('rx.combustion', 'reactions', 'Complete the word equation: methane + oxygen → carbon dioxide + ___', 'water', ['hydrogen', 'carbon', 'oxygen'], 'Burning a hydrocarbon in plenty of oxygen always makes carbon dioxide and water. That is why car exhausts drip on cold mornings.'),
  fact('rx.exo', 'reactions', 'A reaction that gives out heat (like burning or hand warmers) is called…', 'exothermic', ['endothermic', 'reversible', 'neutral'], 'Exo = out. Endothermic reactions take heat IN and feel cold, like the sherbet fizzing on your tongue.'),
  fact('rx.endo', 'reactions', 'Photosynthesis and the reaction in a cold pack take energy IN from their surroundings. They are…', 'endothermic', ['exothermic', 'explosive', 'catalytic'], 'Endo = in. The surroundings get colder.'),
  mcq('rx.signs', 'reactions', 'Which is NOT a sign that a chemical reaction has happened?', [['Ice melting into water', true], ['A colour change when two clear liquids are mixed', false, 'A colour change usually means a new substance has formed.'], ['Fizzing as a gas is made', false, 'Bubbles of a new gas are a classic sign.']], 'Melting is a physical change: water is still water. Chemical reactions make NEW substances: look for colour change, gas, a precipitate or a temperature change.', choiceOnly),
  fact('rx.oxidation', 'reactions', 'When magnesium burns it gains oxygen to make magnesium oxide. Gaining oxygen is called…', 'oxidation', ['reduction', 'neutralisation', 'distillation'], 'Rusting is slow oxidation of iron. Burning is fast oxidation.'),
  fact('rx.acid-metal', 'reactions', 'Complete: acid + metal → salt + ___', 'hydrogen', ['water', 'carbon dioxide', 'oxygen'], 'Test for hydrogen: a lit splint gives a squeaky pop.'),
  fact('rx.acid-carb', 'reactions', 'Complete: acid + carbonate → salt + water + ___', 'carbon dioxide', ['hydrogen', 'oxygen', 'nitrogen'], 'Test for carbon dioxide: it turns limewater cloudy.', { accept: ['co2'] }),
  fact('rx.decomp', 'reactions', 'Heating green copper carbonate turns it into black copper oxide and a gas. What is this kind of reaction called?', 'thermal decomposition', ['combustion', 'neutralisation', 'oxidation'], 'Thermal = heat; decomposition = breaking down. One substance becomes two.', { accept: ['decomposition'] }),

  // --- digestion
  order('dg.order', 'digestion', 'Put the parts of the digestive system in the order food passes through them.', ['mouth', 'oesophagus', 'stomach', 'small intestine', 'large intestine', 'rectum'], null, 'Mouth → oesophagus (gullet) → stomach → small intestine (where most digestion and absorption happens) → large intestine (water absorbed) → rectum.'),
  fact('dg.enzyme', 'digestion', 'What do we call the biological catalysts that break large food molecules into small ones?', 'enzymes', ['hormones', 'vitamins', 'antibodies'], 'Enzymes speed up digestion without being used up. Each works on one kind of food.'),
  fact('dg.amylase', 'digestion', 'Which enzyme, found in saliva, breaks starch down into sugars?', 'amylase', ['protease', 'lipase', 'bile'], 'Chew bread for a minute and it starts to taste sweet: amylase at work.'),
  fact('dg.protease', 'digestion', 'Which enzyme breaks proteins down into amino acids?', 'protease', ['amylase', 'lipase', 'cellulase'], 'Protease works in the stomach (where acid helps) and the small intestine.'),
  fact('dg.lipase', 'digestion', 'Which enzyme breaks fats down into fatty acids and glycerol?', 'lipase', ['amylase', 'protease', 'insulin'], 'Lipids = fats. Bile from the liver breaks fat into droplets first so lipase can work faster.'),
  mcq('dg.small', 'digestion', 'Why is the small intestine lined with millions of tiny finger-like villi?', [['To give a huge surface area for absorption', true], ['To grind food into smaller pieces', false, 'Grinding happens in the mouth and stomach. Villi absorb.'], ['To store food until the body needs it', false, 'Food is not stored there; it is absorbed.']], 'Counting the villi (and the even tinier microvilli on their cells), the small intestine’s lining has an area of about 30 square metres: bigger than most living-room floors. More surface means faster absorption.', choiceOnly),
  fact('dg.large', 'digestion', 'What is absorbed in the large intestine?', 'water', ['protein', 'sugar', 'fat'], 'By the time food reaches the large intestine the nutrients are gone; water is reabsorbed and the rest becomes faeces.'),
  fact('dg.iodine', 'digestion', 'Which food test turns from orange-brown to blue-black if starch is present?', 'the iodine test', ['Benedict’s test', 'the biuret test', 'the limewater test'], 'A drop of iodine on bread or potato goes blue-black.', { accept: ['iodine'] }),
  fact('dg.benedict', 'digestion', 'Which food test, heated, turns from blue to brick red if sugar is present?', 'Benedict’s test', ['the iodine test', 'the biuret test', 'the flame test'], 'Benedict’s solution needs heating in a water bath. Green, yellow, orange, brick red: more colour means more sugar.', { accept: ['benedicts', 'benedict’s', 'benedict'] }),
  fact('dg.biuret', 'digestion', 'Which food test turns from blue to purple (lilac) if protein is present?', 'the biuret test', ['the iodine test', 'Benedict’s test', 'the starch test'], 'Biuret solution on egg white goes lilac.', { accept: ['biuret'] }),
  mcq('dg.nutrients', 'digestion', 'Which nutrient is mainly for growth and repair?', [['Protein', true], ['Carbohydrate', false, 'Carbohydrates are the main energy source.'], ['Fibre', false, 'Fibre keeps food moving through the gut; it is not digested.']], 'Carbohydrates and fats for energy; protein for growth and repair; vitamins and minerals in small amounts; fibre and water to keep everything working.', choiceOnly),
  fact('dg.scurvy', 'digestion', 'Sailors who went months without fruit or vegetables got bleeding gums and loose teeth. Which vitamin were they missing?', 'vitamin C', ['vitamin A', 'vitamin D', 'iron'], 'Scurvy. The Royal Navy eventually issued lime juice, which is why British sailors were called “limeys”.', { accept: ['c'] }),

  // --- light
  fact('li.speed', 'light-2', 'About how fast does light travel?', '300,000 km per second', ['300 km per second', '300,000 km per hour', '340 m per second'], 'Light from the Sun takes about 8 minutes to reach us. Sound travels at only 340 m/s, which is why you see lightning before you hear thunder.', choiceOnly),
  fact('li.law', 'light-2', 'The law of reflection says the angle of incidence equals the angle of…', 'reflection', ['refraction', 'incidence', 'diffraction'], 'Both angles are measured from the normal, an imaginary line at 90° to the mirror.'),
  fact('li.normal', 'light-2', 'In ray diagrams, what is the imaginary line drawn at right angles to a mirror’s surface called?', 'the normal', ['the axis', 'the ray', 'the tangent'], 'Angles of incidence and reflection are always measured from the normal, not from the mirror.', { accept: ['normal'] }),
  fact('li.refract', 'light-2', 'Light bending as it passes from air into water or glass is called…', 'refraction', ['reflection', 'dispersion', 'absorption'], 'Light slows down in glass and water, which bends it. That is why a straw looks broken in a glass of water and why lenses work.'),
  mcq('li.prism', 'light-2', 'Why does a prism split white light into a spectrum?', [['Each colour refracts by a different amount', true], ['The glass adds colours to the light', false, 'The colours were already there. White light is a mixture of all of them.'], ['It reflects each colour in a different direction', false, 'It is refraction, not reflection, that separates them.']], 'Newton showed this in 1666 and recombined the colours into white with a second prism. Rainbows are raindrops doing the same job.', choiceOnly),
  fact('li.spectrum', 'light-2', 'Put the colours of the visible spectrum in order from the one that bends LEAST to the one that bends MOST.', 'red, orange, yellow, green, blue, indigo, violet', ['violet, indigo, blue, green, yellow, orange, red', 'red, yellow, orange, green, blue, violet, indigo', 'blue, green, red, yellow, orange, violet, indigo'], 'ROY G BIV. Red bends least and violet most.', choiceOnly),
  mcq('li.red', 'light-2', 'Why does a red jumper look red in white light?', [['It reflects red and absorbs the rest', true], ['It gives out its own red light', false, 'Jumpers are not luminous. They reflect some colours and absorb others.'], ['It absorbs red and reflects the rest', false, 'The opposite: what is absorbed is what you do NOT see.']], 'A white object reflects every colour; a black one absorbs them all. Under pure blue light, a red jumper looks black because there is no red to reflect.', choiceOnly),
  fact('li.filter', 'light-2', 'A green filter is placed in front of a torch. Which colours pass through?', 'only green', ['all colours except green', 'red and blue', 'white light'], 'Filters work by absorbing: a green filter absorbs every colour except green, which it transmits.', choiceOnly),
  fact('li.retina', 'light-2', 'Which part of the eye detects light and sends signals to the brain?', 'the retina', ['the pupil', 'the iris', 'the lens'], 'The lens focuses an upside-down image onto the retina at the back of the eye. The brain turns it the right way up.', { accept: ['retina'] }),
  fact('li.pupil', 'light-2', 'Which part of the eye is the hole that lets light in, and gets smaller in bright light?', 'the pupil', ['the iris', 'the retina', 'the cornea'], 'The iris is the coloured muscle that changes the pupil’s size.', { accept: ['pupil'] }),

  // --- circuits
  tmpl('ci.ohm', 'circuits', 'ohm', [-0.4, 0.4, 1], { credits: ['maths.equations'] }),
  fact('ci.current', 'circuits', 'What is measured in amps (A)?', 'current', ['voltage', 'resistance', 'power'], 'Current is the rate of flow of charge: how much charge passes a point each second.'),
  fact('ci.voltage', 'circuits', 'Potential difference (voltage) is measured in…', 'volts (V)', ['amps (A)', 'ohms (Ω)', 'watts (W)'], 'Voltage is the “push” that drives current round the circuit, and how much energy each bit of charge carries.', { accept: ['volts', 'v'] }),
  fact('ci.resistance', 'circuits', 'Resistance is measured in…', 'ohms (Ω)', ['volts (V)', 'amps (A)', 'joules (J)'], 'Resistance opposes current. A thin, long wire has more resistance than a short, thick one.', { accept: ['ohms', 'ohm'] }),
  mcq('ci.series', 'circuits', 'In a series circuit with two bulbs, which statement is true?', [['The current is the same; the voltage is shared', true], ['Each bulb gets the full battery voltage', false, 'That is parallel. In series the voltage is shared.'], ['The current is used up by the first bulb', false, 'Current is never used up: the same current flows all the way round.']], 'One loop: same current everywhere, voltages add up to the supply. Remove one bulb and the other goes out.', choiceOnly),
  mcq('ci.parallel', 'circuits', 'In a parallel circuit with two bulbs, which statement is true?', [['Each bulb gets the full voltage; current splits', true], ['The bulbs share the battery voltage equally', false, 'That is series. In parallel each branch gets the full voltage.'], ['If one bulb breaks, the other goes out too', false, 'Each branch is its own loop, so the other keeps working. That is why homes are wired in parallel.']], 'Parallel: same voltage across each branch, currents add up at the junctions.', choiceOnly),
  fact('ci.ammeter', 'circuits', 'How should an ammeter be connected to measure the current through a bulb?', 'in series with the bulb', ['in parallel across the bulb', 'across the battery', 'anywhere; it does not matter'], 'Current must flow THROUGH an ammeter. A voltmeter goes in parallel, ACROSS the component.', choiceOnly),
  fact('ci.voltmeter', 'circuits', 'How should a voltmeter be connected to measure the potential difference across a bulb?', 'in parallel across the bulb', ['in series with the bulb', 'in series with the battery', 'inside the bulb'], 'A voltmeter compares the two sides of a component, so it connects across it.', choiceOnly),
  mcq('ci.wire', 'circuits', 'Which change would INCREASE the resistance of a wire?', [['Making it longer and thinner', true], ['Making it shorter and thicker', false, 'That decreases resistance.'], ['Painting it red', false, 'Colour makes no difference.']], 'Longer wire: electrons collide with more atoms. Thinner wire: less room to flow. Heating a wire also raises its resistance.', choiceOnly),
  fact('ci.fuse', 'circuits', 'Which safety device melts and breaks the circuit if the current gets too high?', 'a fuse', ['a resistor', 'a switch', 'a cell'], 'A fuse is a thin wire that melts at a set current. Circuit breakers do the same job but can be reset.', { accept: ['fuse'] }),
];

// Memory hooks (mnemonics) and real-world examples, shown on the learn card and after a
// wrong answer. Keyed by item id without the `science.` prefix; merged in below. (The
// element-symbol items get theirs from the SYMBOLS table above.)
const MEMORY = {
  // --- periodic table
  'pe.d1': { hook: '118 elements are an alphabet for matter: a few “letters” that spell out everything.' },
  'pe.mendeleev': { hook: 'Mendeleev left gaps like missing cards in a set, sure they would turn up. They did.', example: 'Element 101, mendelevium, is named in his honour.' },
  'pe.group': { hook: 'A **group** is a family standing in a column: members share similar properties.' },
  'pe.period': { hook: 'A **period** runs **across**, like a sentence that ends in a full stop (a “period”).' },
  'pe.metals': { hook: 'Metals to the **left** of the staircase line, non-metals to the **right**.', example: 'The shiny things in a kitchen drawer that conduct heat, like spoons, foil and pans, are metals.' },
  'pe.alkali': { hook: 'Group 1 gets **wilder going down**: lithium fizzes, sodium whizzes about, potassium bursts into flame.', example: 'Lithium is the metal in the rechargeable batteries of phones and laptops.' },
  'pe.noble': { hook: 'Noble gases are like snooty nobles: they won’t mix (react) with anyone.', example: 'Neon makes glowing red-orange shop signs; helium makes party balloons float.' },
  'pe.halogen': { hook: '**Halogen** means “salt-maker”: chlorine + sodium makes table salt.', example: 'Chlorine keeps swimming pools clean, and fluoride (from fluorine) is in toothpaste.' },

  // --- reactions
  'rx.mass': { hook: 'Atoms are only **rearranged**: total mass in = total mass out.' },
  'rx.d1': { hook: 'Burning doesn’t delete atoms; it sends some up as invisible gases.', example: 'A candle gets shorter as it burns because its wax turns into carbon dioxide and water vapour that drift away.' },
  'rx.reactants': { hook: '**React**ants **react**; **produc**ts are **produc**ed.', example: 'When you bake, flour, eggs and sugar (the reactants) change into cake (the product).' },
  'rx.combustion': { hook: 'Burn a hydrocarbon in plenty of oxygen and you always get **CO₂ and H₂O**.', example: 'A gas hob flame gives off water vapour, one reason kitchen windows steam up when you cook.' },
  'rx.exo': { hook: '**Exo**thermic: heat **exits**. **Endo**thermic: heat **enters**.', example: 'Air-activated hand warmers heat up because the iron powder inside slowly oxidises: an exothermic reaction.' },
  'rx.endo': { hook: '**Endo**thermic: heat **enters** the reaction, so the surroundings feel cold.', example: 'Instant cold packs in first-aid kits turn icy when you squeeze them.' },
  'rx.signs': { hook: 'Spot a reaction: **colour change, fizzing, a new solid, or a temperature change**.', example: 'A bath bomb fizzing is a chemical reaction; an ice lolly melting is not.' },
  'rx.oxidation': { hook: '**Ox**idation = gaining **ox**ygen.', example: 'A cut apple going brown in the air is oxidation in action.' },
  'rx.acid-metal': { hook: '**MASH**: **M**etal + **A**cid → **S**alt + **H**ydrogen.' },
  'rx.acid-carb': { hook: 'Acid + carbonate → salt + water + carbon dioxide: the fizz is the CO₂.', example: 'Kettle descaler (an acid) fizzes as it dissolves limescale, which is calcium carbonate.' },
  'rx.decomp': { hook: '**Thermal** = heat, **decomposition** = breaking down: heat splits one compound apart.', example: 'Bicarbonate of soda breaks down when heated, giving off carbon dioxide that helps cakes rise.' },

  // --- digestion
  'dg.order': { hook: '“**M**y **O**ld **S**hoes **S**mell **L**ike **R**ubbish”: mouth, oesophagus, stomach, small and large intestine, rectum.', example: 'Food usually takes between one and three days to make the whole journey.' },
  'dg.enzyme': { hook: 'Enzymes are **chemical scissors**, snipping big food molecules into small ones.', example: 'Biological washing powder uses enzymes to digest food stains like egg and gravy.' },
  'dg.amylase': { hook: 'Amyl**ase** digests starch (**amylum** is Latin for starch). Enzyme names usually end in -ase.', example: 'Chew a plain cracker for a minute and it starts to taste sweet: amylase is turning starch into sugar.' },
  'dg.protease': { hook: '**Prote**ase digests **prote**ins: the enzyme’s name tells you its food.', example: 'Fresh pineapple contains a protease, which is why it stops jelly from setting.' },
  'dg.lipase': { hook: '**Lip**ase digests **lip**ids (fats).', example: 'Bile works like washing-up liquid, breaking fat into small droplets for lipase to attack.' },
  'dg.small': { hook: 'Villi are like the loops on a fluffy towel: lots of surface for soaking things up.', example: 'A fluffy towel soaks up more water than a smooth tea towel because its loops give a bigger surface area.' },
  'dg.large': { hook: '**L**arge intestine: the **L**ast stop, where water is taken back.' },
  'dg.iodine': { hook: '**I**odine finds **s**tarch: “**I S**ee blue-black.”', example: 'A drop of iodine on a cut potato turns blue-black: potatoes are full of starch.' },
  'dg.benedict': { hook: '**B**enedict’s for sugar: **B**lue to **B**rick red, but only when heated.' },
  'dg.biuret': { hook: '**P**urple means **P**rotein.', example: 'Egg white, milk and beans would all turn biuret solution purple.' },
  'dg.nutrients': { hook: 'Protein is for **building** (muscle, skin, hair); carbohydrates and fats are **fuel**.', example: 'Eggs, beans, fish and meat are protein-rich foods.' },
  'dg.scurvy': { hook: '**C** for **C**itrus, the **c**ure for s**c**urvy.', example: 'Oranges, kiwis, peppers and strawberries are all rich in vitamin C.' },

  // --- light
  'li.speed': { hook: 'In one second, light could travel around the Earth about **7½ times**.', example: 'Count the seconds between lightning and thunder and divide by 3: that is roughly how many kilometres away the storm is.' },
  'li.law': { hook: '**Angle in = angle out**, like a snooker ball bouncing off the cushion.', example: 'Bounce a ball against a wall at an angle: it comes off at the same angle it hit.' },
  'li.normal': { hook: 'The normal stands at 90° to the mirror, like a lamppost on a flat road.' },
  'li.refract': { hook: 'Re**flect** = bounce back. Re**fract** = bend, as if the ray’s path were **fract**ured (broken).', example: 'A straw in a glass of water looks broken, and your legs look short when you stand in a swimming pool.' },
  'li.prism': { hook: '**R**ichard **O**f **Y**ork **G**ave **B**attle **I**n **V**ain: red, orange, yellow, green, blue, indigo, violet.', example: 'A rainbow appears when the Sun is behind you and rain is falling in front of you.' },
  'li.spectrum': { hook: '**R**ichard **O**f **Y**ork **G**ave **B**attle **I**n **V**ain. Red bends least; violet bends most.', example: 'Spray a garden hose with the Sun behind you to make a mini rainbow: red on the outside, violet on the inside.' },
  'li.red': { hook: 'You see the colour that **bounces back**; all the others are swallowed (absorbed).', example: 'Black clothes feel hotter in summer sun because they absorb all the colours.' },
  'li.filter': { hook: 'A filter is a bouncer: only its own colour gets through the door.', example: 'Theatres put coloured filters, called gels, over stage lights to colour the light.' },
  'li.retina': { hook: 'The retina is the eye’s **screen**, like the sensor in a camera.' },
  'li.pupil': { hook: 'The pupil is the black hole in the middle; the iris is the coloured ring around it.', example: 'Look in a mirror, then switch on a bright light: watch your pupils shrink.' },

  // --- circuits
  'ci.ohm': { hook: '**V = I × R**. In the triangle V sits on top of I and R: cover the one you want.' },
  'ci.current': { hook: 'Current is the **flow**, like the current in a river, measured in **amps**.', example: 'A phone charger’s small print might say “2 A”: that is the current it can supply.' },
  'ci.voltage': { hook: '**V**olts are named after Alessandro **V**olta, who built the first battery.', example: 'A car battery is 12 V; a UK mains socket is 230 V, which is why mains electricity is so dangerous.' },
  'ci.resistance': { hook: 'Resistance is like a narrow, crowded corridor slowing the current down.', example: 'The glowing wires in a toaster have a high resistance, so they get hot.' },
  'ci.series': { hook: '**Series = single loop**: same current everywhere, voltage shared. One bulb breaks, all go out.', example: 'Some old Christmas lights went out completely when just one bulb failed: they were wired in series.' },
  'ci.parallel': { hook: '**Parallel = separate paths**: each branch gets the full voltage; one fails, the rest carry on.', example: 'Home lighting is wired in parallel, so one blown bulb doesn’t plunge the whole house into darkness.' },
  'ci.ammeter': { hook: '**A**mmeter goes **A**long the wire, in series: the current must flow through it.' },
  'ci.voltmeter': { hook: 'A **V**oltmeter goes across a component, its two leads making a **V** over it.' },
  'ci.wire': { hook: 'Long and thin is hard to flow through, like sucking a milkshake up a long, thin straw.' },
  'ci.fuse': { hook: 'A fuse sacrifices itself: it melts to protect the circuit (and you).', example: 'Every UK plug contains a fuse, often 3 A or 13 A; the house’s fuse box has circuit breakers.' },
};
for (const [id, memory] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `science.${id}`);
  if (!item) throw new Error(`stretch-science.mjs: memory hook for unknown item ${id}`);
  Object.assign(item, memory);
}

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// (Digestion, light and circuits get labelled diagrams separately.)
const PERIODIC = {
  kind: 'table', head: ['', '1', '2', '3', '4', '5', '6', '7', '0'],
  rows: [
    ['1', 'H', '', '', '', '', '', '', 'He'],
    ['2', '**Li**', '**Be**', 'B', 'C', 'N', 'O', 'F', 'Ne'],
    ['3', '**Na**', '**Mg**', '**Al**', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ],
  caption: 'Columns are **groups**; rows are **periods**. Metals (in colour) are on the left, non-metals on the right. Group 1: alkali metals; 7: halogens; 0: noble gases.',
};
const TOPIC_VISUALS = {
  'science.periodic': PERIODIC,
};
const ITEM_VISUALS = {
  'science.pe.group': PERIODIC,
  'science.pe.period': PERIODIC,
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = t.visual ? [].concat(t.visual, v) : v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = it.visual ? [].concat(it.visual, v) : v; }

export default [{ subject: 'science', deck: 'stretch', topics, items }];

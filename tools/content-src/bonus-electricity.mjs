// Year 6 bonus module: electricity. Chosen any time from the front page (course config `bonus`),
// so every topic carries `bonus: 'electricity'`. It covers the KS2 programme of study for
// electricity (Years 4 and 6) in full and steps into KS3: series and parallel, current and
// voltage, generating electricity. Worked examples and practice come from js/gen/electricity.js,
// which draws each circuit with standard symbols (js/ui/diagrams.js, type 'circuit').
// It builds on science.electricity (core) and does not repeat its questions.
//
// Physics at this level, kept exact: a cell is one unit (an AA "battery" is a cell); a battery is
// two or more cells joined. Voltage is the push; current is the flow of charge, the same all round
// a series loop and never used up: the energy it carries is transferred by the components. A
// filament bulb lights either way round, a motor reverses, and many buzzers only sound one way round.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `science.eb.${id}`, topic: `science.elec-${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `science.eb.${id}`, topic: `science.elec-${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, explain) => ({ id: `science.eb.${id}`, topic: `science.elec-${topic}`, kind: 'order', prompt, items, labels: null, explain });
const tmpl = (id, topic, gen, seed, extra = {}) => ({ id: `science.eb.${id}`, topic: `science.elec-${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed, ...extra });
const choiceOnly = { formats: ['choice'] };
const T = (id, title, prereqs, extra) => ({ id: `science.elec-${id}`, title, kind: 'mixed', prereqs: prereqs.map((p) => `science.elec-${p}`), batch: 5, bonus: 'electricity', ...extra });

const topics = [
  T('what', 'Electricity: what it is and where it comes from', [], {
    diagnostic: ['science.eb.w.d1', 'science.eb.w.d2'],
    intro: 'Electricity lights your room, charges your phone and boils the kettle. An electric current is a flow of tiny charged particles, pushed round a loop by a cell, a battery or the mains. Mains electricity is powerful and can kill; cells are gentle enough to explore with.',
    teach: 'Explain the difference between mains electricity and a battery, and give two safety rules for mains.',
    talk: 'Walk round the house together: which things plug in, and which run on batteries? Ask her why.',
    hook: 'Mains is **230 V**: never experiment with it. A cell is **1.5 V**: safe to explore. **Water and mains never mix.**',
  }),
  T('circuits', 'Circuits and components', ['what'], {
    diagnostic: ['science.eb.c.d1', 'science.eb.c.d2'],
    intro: 'A circuit is a complete loop: from one end of a cell, through the components, and back to the other end. Bulbs give light, buzzers make sound and motors spin. You will learn to predict whether a circuit works before you build it, and to explain why.',
    teach: 'Explain why a bulb lights whichever way round the cell is, but a motor changes direction.',
    talk: 'Look inside a torch together: find the cells, the switch and the bulb, and trace the loop.',
    hook: '**Push, path, part**: a cell to push, a complete loop for the path, and a part (bulb, buzzer, motor) to do the work.',
  }),
  T('symbols', 'Circuit symbols and diagrams', ['circuits'], {
    intro: 'Scientists everywhere draw circuits with the same symbols, joined by straight lines with square corners. A diagram is quicker to draw than a picture and shows exactly how the parts are connected. Learn the symbols and you can read any circuit.',
    teach: 'Draw a circuit diagram with two cells, a switch and a bulb, and explain each symbol.',
    talk: 'Ask her to draw the circuit of a torch from memory, using symbols.',
    hook: 'Cell: the **long line is +**. Bulb: a cross in a circle, like the glowing filament. Motor: **M** in a circle. Battery: cells side by side.',
  }),
  T('materials', 'Conductors and insulators', ['circuits'], {
    diagnostic: ['science.eb.m.d1', 'science.eb.m.d2'],
    intro: 'Some materials let electricity flow through them (conductors) and some do not (insulators). You can find out which is which with a simple circuit with a gap. Metals conduct; so does one surprising non-metal. A cable uses both kinds.',
    teach: 'Explain why electrical wires are made of copper with a plastic coating.',
    talk: 'Hunt for conductors and insulators in the kitchen: cutlery, a wooden spoon, foil, a plastic cup.',
    hook: '**Metals conduct, and so does graphite.** Plastic, rubber, wood, glass and air insulate.',
  }),
  T('changing', 'Changing a circuit and fair tests', ['symbols'], {
    diagnostic: ['science.eb.ch.d1', 'science.eb.ch.d2'],
    intro: 'Add cells and a bulb gets brighter, a buzzer louder and a motor faster. Add bulbs to the loop and each gets dimmer. Scientists find out things like this with fair tests: change one thing, measure another, keep everything else the same.',
    teach: 'Explain why adding a second bulb to a series circuit makes both bulbs dimmer.',
    talk: 'Ask her to plan a fair test: does the number of cells change how loud a buzzer is?',
    hook: '**More cells, more push**: brighter, louder, faster. **More bulbs in a loop share the push**: dimmer.',
  }),
  T('parallel', 'Series and parallel circuits', ['changing'], {
    diagnostic: ['science.eb.p.d1', 'science.eb.p.d2'],
    intro: 'In a series circuit everything is in one loop, so one break stops it all. In a parallel circuit the current splits into branches, and each branch gets the full push of the battery. This is how your home is wired, and it is a big step into secondary-school science.',
    teach: 'Explain why the lights in a house are wired in parallel and not in series.',
    talk: 'Ask her what happens to the other lights at home when one bulb blows, and what that tells her about the wiring.',
    hook: '**Series: one road**, one current; break it anywhere and everything stops. **Parallel: separate roads**; each branch gets the full push.',
  }),
  T('generating', 'Generating and saving electricity', ['what'], {
    intro: 'Mains electricity is generated in power stations, wind farms and solar farms, then sent round the country by the National Grid. Some energy resources will run out; others are renewable. Every one of us can help by wasting less.',
    teach: 'Explain how a power station generates electricity, from fuel to your plug.',
    talk: 'Read the electricity meter together, then again after a day. Which appliances does she think used the most?',
    hook: '**Fuel → steam → turbine → generator → grid → home.** Wind and falling water turn the turbine themselves.',
  }),
  T('scientists', 'Electrical scientists and inventors', ['circuits'], {
    kind: 'facts',
    intro: 'Electricity was a mystery until about 250 years ago. Then, step by step, scientists showed what lightning is, built the first battery, made electricity move a motor, generated it with magnets and made it glow in a light bulb.',
    teach: 'Tell the story of electricity from Volta’s battery to Tesla’s alternating current, with dates.',
    talk: 'Ask her which inventor she would most like to meet, and what she would ask them.',
    hook: '**Volta** made the push (1800); **Faraday** made it move (1821) and generated it (1831); **Swan and Edison** made it glow (1879); **Tesla** sent it far with AC.',
  }),
];

const items = [
  // ------------------------------------------------------------ 1. what electricity is
  tmpl('w.safety', 'what', 'elecSafety', [-0.8, -0.1, 0.7]),
  mcq('w.d1', 'what', 'When a torch battery goes flat, what has happened?', [
    ['Its store of chemical energy has run down', true],
    ['The electricity inside it has been used up', false, 'A very common idea! The charges that flow are not used up: they are in the wires all along. What runs down is the energy stored in the battery’s chemicals.'],
    ['All of its electric charge has leaked out', false, 'Charge does not leak away. The chemicals inside have reacted, so there is no energy left to transfer.'],
  ], 'A battery stores energy in chemicals. As they react, the energy is transferred round the circuit. When the reactions are done, the battery is flat.'),
  mcq('w.d2', 'what', 'Which of these could give you a dangerous electric shock?', [
    ['A mains socket at home', true],
    ['A single 1.5 V AA cell', false, 'A 1.5 V cell cannot push a harmful current through your body. That is why we explore circuits with cells.'],
    ['The two AA cells in a TV remote', false, 'Two cells give only 3 V: far too little to harm you.'],
  ], 'Mains electricity is 230 V, over 150 times the push of one cell: enough to drive a deadly current through a person.'),
  fact('w.current', 'what', 'What is an electric current?', 'a flow of electric charge', ['a store of heat energy', 'a kind of magnetism', 'a flow of metal atoms'], 'In metal wires the charge is carried by electrons, tiny particles from inside atoms. They are in the wire all along: the cell pushes them round.', choiceOnly),
  fact('w.electron', 'what', 'In a metal wire, which tiny particles move to carry the electric current?', 'electrons', ['protons', 'atoms of copper', 'neutrons'], 'Electrons are far smaller than atoms. Billions of billions of them drift through a wire every second when a current flows.', { accept: ['electron', 'the electrons'] }),
  fact('w.mains', 'what', 'What is the voltage of UK mains electricity?', '230 V', ['1.5 V', '12 V', '400,000 V'], '230 V is over 150 times the push of a 1.5 V cell. It can kill, so never experiment with mains.', { accept: ['230', '230 volts', '230v'], strict: true }),
  mcq('w.which', 'what', 'Which of these runs on mains electricity, not batteries?', [
    ['A fridge', true],
    ['A TV remote', false, 'A remote runs on two small cells.'],
    ['A digital watch', false, 'A watch runs on a tiny button cell.'],
  ], 'Things that need a lot of energy, like fridges, kettles and washing machines, plug into the mains. Small things we carry about use cells.'),
  fact('w.portable', 'what', 'Why do torches and phones use batteries instead of plugging into the mains?', 'so they can be carried around', ['batteries give a much bigger voltage', 'mains electricity cannot make light', 'batteries never run out'], 'Batteries store energy so things can work away from a socket. Their voltage is much lower than the mains.', choiceOnly),
  fact('w.ac', 'what', 'Mains electricity is AC. What does AC stand for?', 'alternating current', ['always charged', 'amps of current', 'active circuit'], 'In AC the current changes direction back and forth, 50 times a second in the UK. A cell gives DC, direct current, which always flows the same way.', { accept: ['alternating current', 'alternating'] }),
  fact('w.rechargeable', 'what', 'A phone has a rechargeable battery. What does charging it do?', 'stores energy in it again', ['fills it up with electrons', 'pumps electricity in like water', 'cleans its metal contacts'], 'Charging runs the battery’s chemical reactions backwards, so its chemical store fills up with energy again.', choiceOnly),
  fact('w.grid', 'what', 'What is the network of cables and pylons that carries electricity from power stations to homes across Great Britain called?', 'the National Grid', ['the Power Web', 'the Mains Road', 'the Energy Line'], 'The National Grid links power stations, wind farms and solar farms to every town, with overhead lines on pylons and cables underground.', { accept: ['national grid', 'the national grid', 'grid'] }),
  fact('w.water', 'what', 'Why must you never use mains appliances near water?', 'tap water conducts electricity', ['water makes the voltage bigger', 'water turns electricity into steam', 'water makes appliances explode'], 'Pure water hardly conducts, but tap water, bath water and rain have substances dissolved in them, so they do. Wet skin lets current through more easily too.', choiceOnly),
  mcq('w.kite', 'what', 'Your kite gets tangled on an overhead power line. What should you do?', [
    ['Let go, keep away and tell an adult', true],
    ['Pull hard on the string to free it', false, 'The line may be at up to 400,000 V. A current could travel down the string to you.'],
    ['Climb the pylon to untangle it', false, 'Never climb a pylon: the voltages are high enough to jump through the air to you.'],
  ], 'Overhead lines carry very high voltages. Let go of the string, stay well away, and an adult can call 105, the free number for the electricity network in Great Britain.'),
  fact('w.static', 'what', 'Rub a balloon on your hair and it sticks to the wall. What kind of electricity is this?', 'static electricity', ['mains electricity', 'current electricity', 'solar electricity'], 'Rubbing moves electrons from your hair onto the balloon. The charge builds up and stays put: “static” means not moving.', { accept: ['static'] }),
  mcq('w.charges', 'what', 'Two balloons are rubbed on the same jumper, so they get the same kind of charge. What happens when you hold them close together?', [
    ['They push each other away', true],
    ['They pull together and stick', false, 'Opposite charges attract; the same charges repel.'],
    ['Nothing happens at all', false, 'Charged objects push or pull each other without touching.'],
  ], 'Like charges repel; opposite charges attract. A rubbed balloon sticks to a wall because it pulls on opposite charges in the wall.'),
  mcq('w.door', 'what', 'Why do you sometimes get a tiny shock from a metal door handle after walking across a carpet?', [
    ['Static built up on you jumps to it', true],
    ['The handle is wired to the mains', false, 'Door handles are not wired up. The charge came from you.'],
    ['The carpet makes the metal magnetic', false, 'Magnetism is different: this is static electricity.'],
  ], 'Your shoes rubbing on the carpet build up static charge on you. Touch metal, a conductor, and the charge jumps across in a tiny spark.'),
  mcq('w.lightning', 'what', 'What is lightning?', [
    ['A giant spark of static electricity', true],
    ['Burning gas escaping from a cloud', false, 'Nothing is burning: lightning is electrical.'],
    ['Sunlight reflected off big raindrops', false, 'That makes a rainbow, not lightning.'],
  ], 'Inside a storm cloud, ice and water rubbing together build up huge static charges. When the charge is big enough it jumps, to another cloud or to the ground.'),
  fact('w.hot', 'what', 'Roughly how hot can a lightning bolt be?', 'about 30,000 °C', ['about 100 °C', 'about 1,000 °C', 'about 3 million °C'], 'About five times hotter than the surface of the Sun. The air heats and expands so fast that it makes the boom of thunder.', choiceOnly),

  // ------------------------------------------------------------ 2. circuits and components
  tmpl('c.works', 'circuits', 'elecWillItWork', [-0.8, -0.1, 0.8]),
  mcq('c.d1', 'circuits', 'A bulb lights in a circuit with one cell. You take the cell out and put it back the other way round. What happens?', [
    ['The bulb still lights', true],
    ['The bulb goes out', false, 'A filament bulb lights whichever way round the cell is: the current just flows the other way.'],
    ['It flickers on and off', false, 'It lights steadily, just as before.'],
  ], 'Turning the cell round reverses the direction of the current. A filament bulb lights either way, so it looks just the same.'),
  mcq('c.d2', 'circuits', 'Some people think the current comes out of BOTH ends of the cell and the two currents meet in the bulb. Are they right?', [
    ['No: it flows round, out and back in', true],
    ['Yes: the currents clash and make light', false, 'This “clashing currents” idea is very common, but if it were true, current would not need a loop.'],
    ['Yes, but only in circuits with switches', false, 'Switches don’t change it: current always flows one way round the loop.'],
  ], 'Current flows out of one end of the cell, all the way round the circuit, and back into the other end. Ammeters show the current is the same in both wires.'),
  fact('c.terminals', 'circuits', 'What are the two ends of a cell called?', 'positive and negative terminals', ['the north and south poles', 'the live and the neutral wires', 'the input and the output plugs'], 'The positive (+) terminal and the negative (−) terminal. A complete circuit joins one to the other.', choiceOnly),
  fact('c.plus', 'circuits', 'On an AA cell, how can you tell which end is positive (+)?', 'it has a raised bump', ['it is the flat end', 'it is always painted red', 'it is the heavier end'], 'The + end has a small raised bump; the − end is flat. Battery compartments show which way round the cells go.', choiceOnly),
  fact('c.cellbattery', 'circuits', 'What is the difference between a cell and a battery?', 'a battery is cells joined together', ['a cell is just a small battery', 'only a battery can be recharged', 'a cell gives more voltage than a battery'], 'Scientists call one unit a cell, so an AA “battery” is really a cell. Join two or more cells and you have a battery.', choiceOnly),
  fact('c.ninevolt', 'circuits', 'An ordinary 9 V battery has 1.5 V cells packed inside it. How many?', '6', ['9', '3', '4'], '6 × 1.5 V = 9 V: six small cells joined in a row inside the case.', { accept: ['six'], strict: true }),
  fact('c.buzzer', 'circuits', 'Which component transfers energy as sound?', 'a buzzer', ['a bulb', 'a motor', 'a switch'], 'A buzzer vibrates when a current flows through it, making a sound.', { accept: ['buzzer', 'a bell', 'bell'] }),
  fact('c.motor', 'circuits', 'Which component spins round, and can turn a fan or the wheels of a toy car?', 'a motor', ['a buzzer', 'a cell', 'a bulb'], 'A motor transfers energy so that it turns: movement.', { accept: ['motor', 'an electric motor', 'electric motor'] }),
  fact('c.filament', 'circuits', 'What is the thin coiled wire inside an old-style bulb, which glows, called?', 'the filament', ['the fuse', 'the terminal', 'the element'], 'The current makes the thin filament so hot that it glows white. Most of the energy heats the surroundings, so these bulbs are wasteful.', { accept: ['filament', 'a filament'] }),
  mcq('c.blown', 'circuits', 'A bulb has “blown”. What has happened inside it?', [
    ['Its filament has snapped, leaving a gap', true],
    ['It has used up all its electricity', false, 'Bulbs don’t store or use up electricity. The filament has broken, so there is a gap.'],
    ['Its glass has filled up with smoke', false, 'Sometimes it looks dark, but the real problem is the broken filament.'],
  ], 'A broken filament is a gap in the circuit, so no current can flow through the bulb.'),
  mcq('c.led', 'circuits', 'How is an LED different from a filament bulb?', [
    ['It only lights one way round', true],
    ['It needs no circuit to light up', false, 'An LED needs a complete circuit like any other component.'],
    ['It works only on mains electricity', false, 'LEDs work on cells too: think of bike lights.'],
  ], 'LED stands for light-emitting diode. A diode only lets current through one way, so an LED must be connected the right way round. LEDs also waste much less energy as heat.'),
  fact('c.reverse', 'circuits', 'You turn the cell round in a circuit with a motor. What happens?', 'the motor spins the other way', ['the motor stops for good', 'the motor spins faster', 'the motor makes a buzzing sound'], 'Reversing the current reverses the motor. Electric cars and toy cars can go backwards this way.', choiceOnly),
  mcq('c.buzzway', 'circuits', 'A buzzer sounds. When Jo turns the cell round, it goes silent. Why?', [
    ['Many buzzers only work one way round', true],
    ['The cell is now pushing too hard', false, 'Turning the cell round does not change how hard it pushes.'],
    ['A circuit only works one way round', false, 'Bulbs and motors work either way round. It is the buzzer that is fussy.'],
  ], 'Many buzzers in school kits are electronic and only sound when their red wire goes to the + side. A bulb lights either way; a motor spins the other way.'),
  mcq('c.where', 'circuits', 'Does it matter where in a single loop you put the switch?', [
    ['No: it breaks the loop wherever it is', true],
    ['Yes: it must be next to the + end', false, 'Any gap anywhere in the loop stops the current everywhere.'],
    ['Yes: it must be right next to the bulb', false, 'The switch works anywhere in the loop.'],
  ], 'In a series circuit, a switch anywhere in the loop controls everything in it, because one gap stops the whole current.'),
  mcq('c.short', 'circuits', 'A wire is joined straight from one end of a cell to the other, with no component in between. What happens?', [
    ['The cell gets hot and soon runs flat', true],
    ['Nothing: the wire just sits there', false, 'A big current flows through the wire, which is dangerous with a big battery.'],
    ['The wire stores the spare electricity', false, 'Wires don’t store electricity.'],
  ], 'This is a short circuit: a big current flows straight through the wire, so the wire and the cell heat up and the cell runs flat fast. Never do it with a big battery.'),
  mcq('c.bypass', 'circuits', 'In a circuit with one cell and one bulb, a spare wire is clipped from one side of the bulb to the other. Does the bulb light?', [
    ['No: current takes the easy path round it', true],
    ['Yes: now it gets current from two directions', false, 'Current takes the easiest path: almost all of it goes through the spare wire.'],
    ['Yes, but twice as brightly', false, 'The bulb is “shorted out”, so it stays dark.'],
  ], 'The spare wire is a much easier path than the filament, so the current goes round the bulb, not through it. The bulb is short-circuited.'),
  mcq('c.instant', 'circuits', 'You flick on a switch. How soon does a bulb at the end of long wires light up?', [
    ['Almost at once', true],
    ['After the current travels from the cell', false, 'The charges are already in every part of the wire, and they all start moving together.'],
    ['Only after a minute or so', false, 'It is far quicker than that.'],
  ], 'The charges are in the wires all along, like a loop of rope: pull it anywhere and the whole loop moves at once.'),
  order('c.torch', 'circuits', 'Put the energy story of a torch in order.', ['energy stored in the chemicals of the cells', 'transferred electrically round the circuit', 'transferred by the bulb as light and heat', 'absorbed by the surroundings, warming them'], 'Energy is never used up. It moves from the cells’ chemical store, round the circuit, out of the bulb as light and heat, and ends up warming the surroundings.'),

  // ------------------------------------------------------------ 3. symbols and diagrams
  tmpl('s.read', 'symbols', 'elecSymbols', [-0.7, -0.1, 0.7]),
  mcq('s.why', 'symbols', 'Why do scientists draw circuit diagrams with symbols instead of pictures?', [
    ['Quick to draw and understood worldwide', true],
    ['Pictures of circuits are not allowed', false, 'Pictures are allowed, just slow to draw and unclear.'],
    ['Symbols make the circuit work better', false, 'The drawing doesn’t change how the real circuit works.'],
  ], 'The same symbols are used all over the world, so any scientist or electrician can read a diagram, and it shows exactly what is connected to what.'),
  fact('s.cell', 'symbols', 'In the symbol for a cell, which line stands for the positive (+) terminal?', 'the longer, thinner line', ['the shorter, thicker line', 'the line nearest the bulb', 'neither: cells have no sides'], 'Long line = positive (+), short thick line = negative (−).', choiceOnly),
  fact('s.battery', 'symbols', 'How is a battery drawn in a circuit diagram?', 'two or more cell symbols joined', ['a circle with a letter B inside', 'one cell symbol drawn extra large', 'a rectangle with a + sign on it'], 'A battery is cells joined together, so it is drawn as cell symbols side by side, all facing the same way.', choiceOnly),
  fact('s.motor', 'symbols', 'Which component is drawn as a circle with an M inside?', 'a motor', ['a meter', 'a magnet', 'a bulb'], 'M for motor. An ammeter (A) and a voltmeter (V) are also letters in circles.', { accept: ['motor'] }),
  fact('s.buzzer', 'symbols', 'Which component is drawn as a dome shape on a flat base?', 'a buzzer', ['a bulb', 'a switch', 'a motor'], 'The buzzer symbol looks a bit like a bell or a little dome.', { accept: ['buzzer'] }),
  fact('s.open', 'symbols', 'In a circuit diagram, how do you show a switch that is open (off)?', 'a line hinged up, leaving a gap', ['a straight line joining both contacts', 'a circle with a cross inside it', 'a dashed line drawn across the gap'], 'Open switch: the line is lifted away from one contact, leaving a gap. Closed switch: the line joins both contacts.', choiceOnly),
  fact('s.wire', 'symbols', 'How are wires drawn in a circuit diagram?', 'as straight lines with corners', ['as wiggly lines, like real wires', 'as dotted lines with arrows', 'as curves round the outside'], 'Use a ruler: straight lines and square corners, with no gaps unless the real circuit has one.', choiceOnly),
  fact('s.ammeter', 'symbols', 'What does a circle with an A inside stand for?', 'an ammeter', ['an amplifier', 'a motor', 'a cell'], 'An ammeter measures current in amps (A). It goes in the loop, in series, so the current flows through it.', { accept: ['ammeter'] }),
  fact('s.voltmeter', 'symbols', 'What does a circle with a V inside stand for?', 'a voltmeter', ['an ammeter', 'a motor', 'a bulb'], 'A voltmeter measures voltage in volts (V). It is connected across a component, in parallel.', { accept: ['voltmeter'] }),
  fact('s.resistor', 'symbols', 'Which component is drawn as a plain rectangle?', 'a resistor', ['a cell', 'a battery', 'a switch'], 'A resistor makes it harder for current to flow, so less current flows. Resistors control the brightness of lights and the speed of motors.', { accept: ['resistor'] }),
  mcq('s.close', 'symbols', 'Look at the circuit diagram. What will happen when the switch is closed?', [
    ['The bulb lights and the motor spins', true],
    ['The bulb lights but the motor stays still', false, 'They are in the same loop, so once it is complete, both work.'],
    ['Nothing, as the battery is the wrong way', false, 'Both cells face the same way, and a bulb works either way round anyway.'],
  ], 'Closing the switch completes the single loop, so the current flows through both the bulb and the motor.', { diagram: { type: 'circuit', bottom: ['battery-2', 'switch-open'], top: ['bulb', 'motor'] } }),
  mcq('s.count', 'symbols', 'How many cells and bulbs does this circuit diagram show?', [
    ['1 cell and 2 bulbs', true],
    ['2 cells and 1 bulb', false, 'Look again: one long-and-short pair of lines is one cell; the two crossed circles are bulbs.'],
    ['1 cell and 1 bulb', false, 'There are two crossed circles: two bulbs.'],
  ], 'One pair of long and short lines is one cell. Each circle with a cross is a bulb.', { diagram: { type: 'circuit', bottom: ['cell'], top: ['bulb', 'bulb'] } }),
  mcq('s.picbuzzer', 'symbols', 'Which circuit symbol would you draw for the part picked out in this picture?', [
    ['A dome shape on a flat base', true],
    ['A circle with a cross inside', false, 'That is a bulb.'],
    ['A circle with an M inside', false, 'That is a motor.'],
  ], 'The part picked out is a buzzer. Its symbol is a dome on a flat base.', { visual: { kind: 'diagram', id: 'circuit', highlight: 'buzzer', question: true } }),
  mcq('s.picswitch', 'symbols', 'Which circuit symbol would you draw for the part picked out in this picture?', [
    ['A line joining two contacts', true],
    ['A long line and a short line', false, 'That is a cell.'],
    ['A circle with a cross inside', false, 'That is a bulb.'],
  ], 'The part picked out is a closed switch: its lever touches both contacts, so its symbol is a line joining two contacts.', { visual: { kind: 'diagram', id: 'circuit', highlight: 'switch', question: true } }),
  mcq('s.picbulb', 'symbols', 'Which circuit symbol would you draw for the part picked out in this picture?', [
    ['A circle with a cross inside', true],
    ['A dome shape on a flat base', false, 'That is a buzzer.'],
    ['A circle with a V inside', false, 'That is a voltmeter.'],
  ], 'The part picked out is a bulb. Its symbol is a circle with a cross, like the glowing filament inside.', { visual: { kind: 'diagram', id: 'circuit', highlight: 'bulb', question: true } }),

  // ------------------------------------------------------------ 4. conductors and insulators
  tmpl('m.test', 'materials', 'elecConductor', [-0.8, -0.2, 0.6]),
  mcq('m.d1', 'materials', 'Are all metals good conductors of electricity?', [
    ['Yes: all metals conduct electricity', true],
    ['No: only iron and steel conduct', false, 'You may be thinking of magnetism: only a few metals (iron, nickel, cobalt and steel) are magnetic, but all metals conduct.'],
    ['No: only shiny metals conduct', false, 'Dull or shiny, every metal conducts.'],
  ], 'All metals conduct electricity, some better than others. Do not mix this up with magnetism: most metals are not magnetic.'),
  mcq('m.d2', 'materials', 'Is the graphite (the “lead”) in a pencil a conductor or an insulator?', [
    ['A conductor, though not a metal', true],
    ['An insulator, as it is not a metal', false, 'Graphite is the surprising exception: a non-metal that conducts.'],
    ['Neither: it blocks only some current', false, 'It conducts, though less well than metals.'],
  ], 'Graphite is a form of carbon. It is not a metal, but it conducts electricity. Draw a thick pencil line and it can complete a circuit.'),
  mcq('m.copper', 'materials', 'Why are most electrical wires made of copper?', [
    ['It conducts well and bends easily', true],
    ['It is the cheapest metal there is', false, 'Iron is much cheaper, but it does not conduct as well.'],
    ['It is the only metal that conducts', false, 'All metals conduct.'],
  ], 'Silver conducts slightly better, but copper is far cheaper. Copper can also be drawn out into thin, bendy wire.'),
  fact('m.silver', 'materials', 'Which metal is the best conductor of electricity of all?', 'silver', ['iron', 'lead', 'aluminium'], 'Silver is the best, with copper close behind. Copper is used for wires because it is much cheaper.', { accept: ['silver'] }),
  fact('m.screwdriver', 'materials', 'Electricians’ screwdrivers have handles made of plastic or rubber. Why?', 'to insulate the electrician’s hand', ['to make the screwdriver lighter', 'to conduct the current away', 'to stop the screwdriver rusting'], 'Plastic and rubber are insulators, so if the metal touches a live wire, the current cannot reach the hand.', choiceOnly),
  fact('m.pylon', 'materials', 'Overhead power cables are bare metal. What stops the current flowing down into the steel pylon?', 'glass or ceramic insulators', ['rubber tyres under the pylon', 'the air inside the cables', 'magnets at the very top'], 'The cables hang from strings of glass or ceramic discs, which are insulators. The air around the bare cables insulates them too.', choiceOnly),
  fact('m.alu', 'materials', 'Overhead power lines are made mostly of which light metal?', 'aluminium', ['gold', 'lead', 'silver'], 'Aluminium is light and conducts well, so long spans can hang between pylons. Many have a steel core for strength.', { accept: ['aluminium', 'aluminum'] }),
  mcq('m.gold', 'materials', 'Why are the tiny contacts inside phones and computers often coated with gold?', [
    ['Gold conducts well and never corrodes', true],
    ['Gold makes the current flow much faster', false, 'Gold does not speed the current up. Its advantage is that it never tarnishes, so it keeps conducting.'],
    ['Gold is the only metal that conducts', false, 'All metals conduct.'],
  ], 'Gold does not rust or tarnish, so the contacts stay clean and keep conducting for years.'),
  mcq('m.water', 'materials', 'Is pure water a good conductor of electricity?', [
    ['No, but tap water conducts a little', true],
    ['Yes: all water is a good conductor', false, 'Pure water conducts very poorly. It is what is dissolved in it that makes the difference.'],
    ['No: no kind of water ever conducts', false, 'Tap water, rain and seawater all conduct, because of the substances dissolved in them.'],
  ], 'Pure water conducts very poorly. Tap water, rain and seawater contain dissolved substances such as salts, so they conduct. That is why water and electricity are a dangerous mix.'),
  fact('m.salt', 'materials', 'Which conducts electricity better: tap water or salty seawater?', 'salty seawater', ['tap water', 'they are exactly the same', 'neither of them conducts'], 'Dissolved salt lets water conduct: the more salt, the better it conducts.', choiceOnly),
  fact('m.body', 'materials', 'Why can a current from the mains flow through a person?', 'the body is mostly salty water', ['our bones are made of metal', 'blood is strongly magnetic', 'muscles store up electricity'], 'Your body is about 60% water with salts dissolved in it, so it conducts. That is why mains electricity is so dangerous.', choiceOnly),
  fact('m.air', 'materials', 'Is air a conductor or an insulator?', 'an insulator', ['a conductor', 'a conductor only at night', 'neither of these'], 'Air insulates, which is why any gap stops a circuit. But a huge voltage can force a spark through it, like lightning.', { accept: ['insulator'] }),
  order('m.steps', 'materials', 'Put the steps for testing whether a material conducts electricity in order.', ['Build a circuit with a cell and a bulb', 'Leave a gap between two crocodile clips', 'Clip the material into the gap', 'Watch whether the bulb lights'], 'If the bulb lights, the material completed the circuit: it is a conductor. If not, it is an insulator. Test each material in the same circuit to keep it fair.'),
  mcq('m.insulators', 'materials', 'Which list contains only insulators?', [
    ['plastic, rubber, wood, glass', true],
    ['plastic, copper, wood, glass', false, 'Copper is a metal: a conductor.'],
    ['rubber, steel, wood, cork', false, 'Steel is a metal: a conductor.'],
  ], 'Plastic, rubber, wood, glass, cork, paper, ceramics and air are all insulators.'),
  mcq('m.conductors', 'materials', 'Which list contains only conductors?', [
    ['copper, steel, gold, graphite', true],
    ['copper, plastic, gold, silver', false, 'Plastic is an insulator.'],
    ['iron, brass, wood, aluminium', false, 'Wood is an insulator.'],
  ], 'All metals conduct, and so does graphite, the one common non-metal that does.'),
  mcq('m.dimmer', 'materials', 'Why might a bulb glow more dimly with a pencil’s graphite in the gap than with a steel spoon?', [
    ['Graphite conducts less well than steel', true],
    ['Graphite uses up some of the current', false, 'Current is never used up. A poorer conductor makes the current smaller all the way round the loop.'],
    ['Graphite is a metal, but a weak one', false, 'Graphite is not a metal at all: it is a form of carbon.'],
  ], 'Graphite has more resistance than metals, so a smaller current flows round the whole loop and the bulb is dimmer.'),

  // ------------------------------------------------------------ 5. changing a circuit, fair tests
  tmpl('ch.change', 'changing', 'elecChange', [-0.6, 0, 0.8]),
  tmpl('ch.fair', 'changing', 'elecFairTest', [-0.7, -0.1, 0.6]),
  mcq('ch.d1', 'changing', 'A series circuit has one cell and one bulb. You add a second, identical bulb to the loop. What happens?', [
    ['Both bulbs are dimmer than one was', true],
    ['Both stay as bright as one was', false, 'The two bulbs share the push of the one cell, so each gets less.'],
    ['The first is bright, the second dim', false, 'The current is the same all round the loop, so identical bulbs are equally bright.'],
  ], 'The two bulbs share the push of the cell, so a smaller current flows and both are dimmer, and equally bright.'),
  mcq('ch.d2', 'changing', 'A big D cell and a small AA cell are both labelled 1.5 V. Which gives the bigger push?', [
    ['Neither: both push with 1.5 V', true],
    ['The D cell, because it is bigger', false, 'A bigger cell stores more energy, so it lasts longer, but its push (voltage) is the same.'],
    ['The AA cell, because it is newer', false, 'The label tells you the push: both are 1.5 V.'],
  ], 'Voltage depends on the chemicals inside, not the size. AAA, AA, C and D cells are all 1.5 V; bigger ones just last longer.'),
  fact('ch.louder', 'changing', 'What happens to a buzzer when you add more cells, all facing the same way?', 'it gets louder', ['it gets quieter', 'it stops working', 'nothing changes at all'], 'A bigger voltage pushes a bigger current through the buzzer, so it transfers more energy as sound.', choiceOnly),
  fact('ch.faster', 'changing', 'Adding more cells, all the same way round, to a circuit with a motor makes the motor…', 'spin faster', ['spin slower', 'spin the other way', 'stop spinning'], 'More push, more current, more energy each second: the motor speeds up.', { accept: ['faster', 'go faster', 'spin faster', 'speed up'] }),
  mcq('ch.blow', 'changing', 'Mo adds more and more cells to a circuit with one small bulb. What will happen in the end?', [
    ['The bulb blows: its filament breaks', true],
    ['The bulb gets dimmer and dimmer', false, 'More cells push harder, so the bulb gets brighter, until it is too much.'],
    ['The bulb keeps getting brighter forever', false, 'Each bulb can only take so much voltage before the filament overheats.'],
  ], 'Each bulb is made for a certain voltage, often printed on it. Too much voltage drives so much current that the filament overheats and breaks.'),
  mcq('ch.why', 'changing', 'Why does a bulb get brighter when you add another cell the same way round?', [
    ['A bigger push drives a bigger current', true],
    ['More cells add more bulbs to the loop', false, 'Adding cells adds no bulbs. It adds push (voltage).'],
    ['Each cell lights a part of the filament', false, 'The whole filament carries the same current.'],
  ], 'Voltage is the push. More cells give more voltage, which drives a bigger current, so the bulb transfers more energy as light each second.'),
  mcq('ch.share', 'changing', 'Why are two identical bulbs in series dimmer than one bulb on its own with the same cell?', [
    ['They share the push of the cell', true],
    ['The first bulb uses up the current', false, 'Current is never used up: the same current flows through both bulbs.'],
    ['The second bulb gets no current', false, 'Both bulbs get the same current: they are equally bright.'],
  ], 'Two bulbs in series make it harder for the current to flow, and the cell’s push is shared between them, so each bulb gets less.'),
  fact('ch.wire', 'changing', 'Making a thin wire in a circuit longer makes the bulb…', 'dimmer', ['brighter', 'flash on and off', 'go off for ever'], 'A longer thin wire has more resistance: it is harder for the current to get through, so less current flows. This is the idea behind a variable resistor.', { accept: ['dimmer', 'less bright', 'go dimmer', 'dim'] }),
  fact('ch.fairone', 'changing', 'In a fair test, how many things (variables) should you change on purpose?', 'one', ['two', 'all of them', 'none'], 'Change one thing, measure one thing, keep everything else the same. Then you know what caused any difference.', { accept: ['1', 'just one', 'only one'] }),
  mcq('ch.predict', 'changing', 'Which of these is the best scientific prediction?', [
    ['“More cells will make it brighter: a bigger push”', true],
    ['“The bulb will look nice, because bulbs are bright”', false, 'A prediction says what will change, and why, using science.'],
    ['“Something will change when I add more cells”', false, 'Too vague: say what will change and give a reason.'],
  ], 'A good prediction says what you think will happen and gives a scientific reason.'),
  fact('ch.table', 'changing', 'In a results table, which column comes first?', 'what you changed', ['what you measured', 'what you kept the same', 'your prediction'], 'The first column is what you changed (the independent variable); the next is what you measured, with units in the heading.', choiceOnly),
  fact('ch.repeat', 'changing', 'Why do scientists repeat their measurements?', 'to make results more reliable', ['to make the test take longer', 'to change the answer they got', 'because the first try never counts'], 'Repeats show whether results are consistent and help you spot odd ones. Then you can work out an average (the mean).', choiceOnly),
  fact('ch.anomaly', 'changing', 'A result that does not fit the pattern of the others is called…', 'an anomalous result', ['a variable', 'a prediction', 'a conclusion'], 'Check it and repeat it: maybe a clip was loose or a reading was misread.', { accept: ['anomalous result', 'anomaly', 'an anomaly', 'anomalous', 'an anomalous result'] }),
  fact('ch.sensor', 'changing', 'What is the fairest way to compare how bright two bulbs are?', 'use a light sensor', ['judge it by eye from far away', 'ask which bulb looks nicest', 'feel how warm the glass is'], 'A light sensor (or data logger) gives a number, so the results do not depend on someone’s opinion.', choiceOnly),
  fact('ch.car', 'changing', 'A car battery gives 12 V. It is made of lead-acid cells of 2 V each. How many cells are inside?', '6', ['12', '2', '24'], '6 × 2 V = 12 V.', { accept: ['six'], strict: true }),

  // ------------------------------------------------------------ 6. series and parallel
  tmpl('p.circuits', 'parallel', 'elecSeriesParallel', [-0.4, 0.3, 1.1]),
  mcq('p.d1', 'parallel', 'Two identical bulbs are in series with a battery. Which is brighter?', [
    ['They are equally bright', true],
    ['The one nearer + is brighter', false, 'The current is the same everywhere in a series loop, so identical bulbs are equally bright.'],
    ['The one the current reaches first', false, 'The current doesn’t get used up along the way: it is the same through both.'],
  ], 'Current is the same all the way round a series circuit, so identical bulbs in series are equally bright.'),
  mcq('p.d2', 'parallel', 'Two identical bulbs are connected in parallel to a cell. Compared with one bulb on its own, each is…', [
    ['Just as bright', true],
    ['Half as bright', false, 'That happens in series. In parallel each bulb gets the full push of the cell.'],
    ['Twice as bright', false, 'Each bulb gets the same push as a single bulb would, no more.'],
  ], 'Each branch gets the full push of the cell, so each bulb is as bright as one bulb on its own. The cell has to supply both currents, so it runs flat sooner.'),
  fact('p.series', 'parallel', 'A circuit with all its components in one single loop is called a…', 'series circuit', ['parallel circuit', 'short circuit', 'branch circuit'], 'Series: one after another, in one loop, like carriages in a train.', { accept: ['series', 'a series circuit'] }),
  fact('p.parallel', 'parallel', 'A circuit in which the current splits into separate branches is called a…', 'parallel circuit', ['series circuit', 'short circuit', 'single circuit'], 'Parallel: side by side, each component on its own branch.', { accept: ['parallel', 'a parallel circuit'] }),
  fact('p.junction', 'parallel', 'What is the point where a circuit splits into branches called?', 'a junction', ['a terminal', 'a switch', 'a filament'], 'At a junction the current splits; where the branches meet again, it joins back together.', { accept: ['junction'] }),
  mcq('p.home', 'parallel', 'Why are the lights in a house wired in parallel?', [
    ['So each light can be switched on its own', true],
    ['So that all the lights share one switch', false, 'That is the opposite: parallel branches can each have their own switch.'],
    ['So the bulbs glow half as brightly', false, 'In parallel each light gets the full mains voltage.'],
  ], 'Each light is on its own branch, with its own switch, and gets the full 230 V. If one bulb blows, the others stay on.'),
  mcq('p.fairy', 'parallel', 'In an old set of Christmas lights, one bulb broke and the whole set went out. How were the bulbs connected?', [
    ['In series', true],
    ['In parallel', false, 'In parallel, the others would have stayed lit.'],
    ['Not connected at all', false, 'They must be connected to light at all.'],
  ], 'In series there is only one path, so one broken filament stops the current to every bulb. Hunting for the broken one could take ages!'),
  fact('p.same', 'parallel', 'In a series circuit, how does the current compare at different points?', 'it is the same everywhere', ['it is biggest near the cell', 'it gets smaller after each bulb', 'it is zero after the last bulb'], 'Current is not used up. Put an ammeter anywhere in a series loop and it shows the same reading.', choiceOnly),
  mcq('p.split', 'parallel', 'At a junction, 0.6 A splits equally between two identical branches. How much flows in each branch?', [
    ['0.3 A', true],
    ['0.6 A', false, 'The 0.6 A is shared between the branches.'],
    ['1.2 A', false, 'Splitting shares the current: it cannot make more.'],
  ], '0.6 ÷ 2 = 0.3 A in each branch. Where the branches join again, 0.3 + 0.3 = 0.6 A flows back to the cell.'),
  mcq('p.flat', 'parallel', 'Which runs a battery flat sooner: two bulbs in series, or the same two bulbs in parallel?', [
    ['Two bulbs in parallel', true],
    ['Two bulbs in series', false, 'In series the bulbs share the push, so less current flows and the battery lasts longer.'],
    ['Both run it flat equally fast', false, 'The parallel bulbs are brighter and draw much more current.'],
  ], 'In parallel each bulb gets the full push, so the battery supplies two full currents and transfers its energy faster.'),
  fact('p.switch', 'parallel', 'In a parallel circuit, where should you put a switch to control just one bulb?', 'on that bulb’s own branch', ['next to the cell', 'anywhere in the circuit', 'on a different branch'], 'A switch on a branch controls only that branch. A switch next to the cell controls everything.', choiceOnly),
  fact('p.rope', 'parallel', 'In the “rope loop” model of a circuit, a loop of rope is pulled round through people’s hands. What does the moving rope stand for?', 'the current', ['the voltage', 'the battery', 'the bulb'], 'The rope moves everywhere at once and none of it is used up, like current. The person pulling is the cell (the push); a person gripping the rope feels their hands warm up, like a bulb.', { accept: ['current', 'the charge', 'charge'] }),
  mcq('p.usedup', 'parallel', 'Why is it wrong to say a bulb “uses up” current?', [
    ['The same current flows in as flows out', true],
    ['Bulbs actually make extra current', false, 'Bulbs make no current: the cell pushes it.'],
    ['Current only flows when bulbs are off', false, 'Current flows when the circuit is complete and the bulb is on.'],
  ], 'Ammeters on either side of a bulb read the same. What the bulb takes from the circuit is energy, not current.'),
  fact('p.energy', 'parallel', 'If current is not used up in a bulb, what does the bulb take from the circuit?', 'energy', ['electrons', 'current', 'wire'], 'The bulb transfers energy carried by the current, as light and heat. The charges carry on round the loop.', { accept: ['energy', 'some energy'] }),
  fact('p.three', 'parallel', 'Three identical bulbs are in parallel with a cell, all lit. One breaks. How many stay lit?', '2', ['0', '1', '3'], 'Each bulb has its own branch. The other two branches are still complete, so those two bulbs stay lit, just as bright.', { accept: ['two'], strict: true }),

  // ------------------------------------------------------------ 7. generating and saving
  tmpl('g.energy', 'generating', 'elecEnergy', [-0.7, 0.1, 0.9]),
  mcq('g.d1', 'generating', 'When you switch on a lamp at home, where was its electricity generated?', [
    ['At a power station or wind farm', true],
    ['Inside the plug socket in the wall', false, 'A socket is just a connection to the cables that come from the National Grid.'],
    ['In the light switch on the wall', false, 'A switch only opens and closes a gap.'],
  ], 'Mains electricity is generated at power stations, wind farms and solar farms, and reaches your home through the National Grid.'),
  fact('g.generator', 'generating', 'In a power station, which machine turns movement into electricity?', 'a generator', ['a boiler', 'a transformer', 'a cooling tower'], 'The turbine spins the generator, which has magnets and coils of wire inside.', { accept: ['generator', 'an electric generator', 'dynamo'] }),
  order('g.steps', 'generating', 'Put the stages of a gas power station in order.', ['gas is burned', 'water is heated into steam', 'the steam spins a turbine', 'the turbine turns a generator', 'electricity goes out to the National Grid'], 'Burning fuel heats water into steam; the steam spins the turbine, which turns the generator. Coal, oil and nuclear power stations work the same way: only the source of the heat is different.'),
  mcq('g.induction', 'generating', 'How does a generator make a current?', [
    ['Magnets spin near coils of wire', true],
    ['Fuel is burned inside its wires', false, 'Fuel is burned in a boiler, away from the generator.'],
    ['It releases electricity from tanks', false, 'Electricity is not stored: it is generated as the magnets move.'],
  ], 'Moving a magnet near a coil of wire makes a current flow: Michael Faraday discovered this in 1831. A bicycle dynamo works the same way.'),
  mcq('g.renewable', 'generating', 'Which of these lists contains only renewable energy resources?', [
    ['wind, solar, tidal', true],
    ['wind, coal, solar', false, 'Coal is a fossil fuel: it will run out.'],
    ['oil, gas, tidal', false, 'Oil and gas are fossil fuels.'],
  ], 'Renewable resources (wind, solar, tidal, wave, hydroelectric, geothermal, biomass) are topped up by nature. Fossil fuels and uranium will run out.'),
  fact('g.nuclear', 'generating', 'Nuclear power stations release energy from which fuel?', 'uranium', ['coal', 'hydrogen gas', 'oil'], 'Uranium atoms are split, releasing heat that boils water into steam. Nuclear power gives off no carbon dioxide while running, but uranium will run out and the waste is dangerous for thousands of years.', { accept: ['uranium'] }),
  fact('g.solar', 'generating', 'What does a solar cell do?', 'makes a current using light', ['stores sunlight for night-time', 'heats up water to make steam', 'only works on hot days'], 'Light falling on a solar cell makes a current directly, with no moving parts and no fuel. Solar panels are made of many cells; they work on cool, bright days too.', choiceOnly),
  fact('g.wind', 'generating', 'In a wind turbine, what turns the generator?', 'the blades, turned by the wind', ['a petrol engine in the tower', 'steam from a boiler', 'a big battery in the base'], 'The wind pushes the blades round, and they turn the generator inside the box at the top.', choiceOnly),
  fact('g.hydro', 'generating', 'Hydroelectric power stations use the energy of…', 'falling water', ['burning coal', 'hot rocks underground', 'sunlight on panels'], 'Water from a reservoir flows down through turbines, spinning the generators. Rain keeps refilling the reservoir.', { accept: ['water', 'moving water', 'flowing water', 'falling water'] }),
  mcq('g.windproblem', 'generating', 'What is one problem with relying only on wind turbines?', [
    ['The wind does not always blow', true],
    ['Wind will run out in a few years', false, 'Wind is renewable: it will not run out.'],
    ['They give off lots of carbon dioxide', false, 'Wind turbines give off no carbon dioxide while they run.'],
  ], 'On calm days wind farms make little electricity, so the grid also needs other sources and ways of storing energy.'),
  fact('g.coal', 'generating', 'In which year did the UK close its last coal-fired power station, Ratcliffe-on-Soar?', '2024', ['1990', '2008', '2015'], 'Ratcliffe-on-Soar in Nottinghamshire closed on 30 September 2024, about 140 years after Britain’s first coal-fired power stations opened in 1882.', { strict: true, ...choiceOnly }),
  mcq('g.highv', 'generating', 'Why does the National Grid carry electricity at very high voltages, like 400,000 V?', [
    ['Less energy is wasted heating the cables', true],
    ['It makes the electricity travel faster', false, 'The voltage is about how much energy is wasted, not speed.'],
    ['Homes need 400,000 V to work', false, 'Homes use 230 V: transformers step the voltage down before it reaches you.'],
  ], 'At a high voltage, a smaller current carries the same energy, so the cables waste less energy heating up. Transformers step the voltage up at the power station and down again near homes.'),
  fact('g.transformer', 'generating', 'Which device steps the voltage down from the National Grid to 230 V for homes?', 'a transformer', ['a generator', 'a turbine', 'a fuse'], 'Transformers only work with alternating current (AC), one reason mains electricity is AC.', { accept: ['transformer', 'step-down transformer', 'a step-down transformer'] }),
  mcq('g.save', 'generating', 'Which of these saves electricity at home?', [
    ['Switching off lights in empty rooms', true],
    ['Leaving the TV on standby all night', false, 'Standby still takes a little energy, all night long.'],
    ['Filling the kettle to the top each time', false, 'Boil only the water you need: heating extra water wastes energy.'],
  ], 'Switch off what you are not using, boil only the water you need and choose LED bulbs. It saves money and means less fuel is burned.'),
  fact('g.led', 'generating', 'Why do LED bulbs save energy compared with old filament bulbs?', 'they waste far less energy as heat', ['they are only switched on at night', 'they give out a dimmer light', 'they store energy for later'], 'An LED gives the same light as a filament bulb for about a sixth of the power, or less: a filament bulb wastes most of its energy heating the room.', choiceOnly),
  fact('g.kwh', 'generating', 'Electricity bills charge for energy in units called…', 'kilowatt-hours (kWh)', ['kilovolts (kV)', 'amp-hours (Ah)', 'newton-metres (Nm)'], 'One kilowatt-hour is the energy a 1,000 W appliance transfers in one hour. The meter counts them.', choiceOnly),
  fact('g.standby', 'generating', 'A TV left on standby…', 'still takes a little energy', ['takes no energy at all', 'stores energy for later', 'takes more than when on'], 'The little standby light and the circuits waiting for the remote still need energy. Switching off at the plug saves it.', choiceOnly),

  // ------------------------------------------------------------ 8. scientists and inventors
  fact('h.amber', 'scientists', 'The word “electricity” comes from the ancient Greek word for which material, which attracts fluff when it is rubbed?', 'amber', ['glass', 'gold', 'silk'], 'The Greek ēlektron means amber, hardened tree resin. Rubbed amber picks up bits of fluff and straw: static electricity.', { accept: ['amber'] }),
  mcq('h.franklin', 'scientists', 'What is Benjamin Franklin famous for showing, in 1752?', [
    ['That lightning is electricity', true],
    ['That magnets can attract iron', false, 'People had known that for thousands of years.'],
    ['That light travels in straight lines', false, 'That was known long before Franklin.'],
  ], 'Franklin is said to have flown a kite in a thunderstorm to show that lightning is electrical (extremely dangerous: never try it).'),
  fact('h.rod', 'scientists', 'What did Benjamin Franklin invent to protect buildings from lightning?', 'the lightning rod', ['the electric fuse', 'the storm barometer', 'the battery'], 'A metal rod on the roof, joined by a thick wire to the ground, carries a lightning strike safely down. Church spires and tall buildings still have them.', { accept: ['lightning rod', 'a lightning rod', 'lightning conductor', 'a lightning conductor'] }),
  fact('h.galvani', 'scientists', 'Whose experiments in the 1780s, in which dead frogs’ legs twitched when touched with metal, led Volta to invent the battery?', 'Luigi Galvani', ['Michael Faraday', 'Thomas Edison', 'Nikola Tesla'], 'Galvani thought the electricity came from the frog. Volta showed it came from the two different metals and the moist frog between them, and built a battery to prove it.', { accept: ['galvani'] }),
  fact('h.volta', 'scientists', 'Who built the first battery, the “voltaic pile”, in 1800?', 'Alessandro Volta', ['Michael Faraday', 'Benjamin Franklin', 'Thomas Edison'], 'Volta was an Italian scientist. The volt, the unit of voltage, is named after him.', { accept: ['volta'] }),
  mcq('h.pile', 'scientists', 'What was Volta’s first battery made from?', [
    ['Stacked metal discs and salty card', true],
    ['A jar of water with a magnet inside', false, 'No magnets: Volta’s pile was chemical.'],
    ['Coils of copper wire round an iron bar', false, 'That sounds like an electromagnet, which came later.'],
  ], 'Volta stacked discs of zinc and copper (or silver), separated by card or cloth soaked in salty water. Each zinc-card-copper layer is a cell, so the pile was a battery.'),
  fact('h.motor', 'scientists', 'In 1821, Michael Faraday showed the first…', 'electric motor', ['light bulb', 'battery', 'telephone'], 'He made a wire carrying a current spin round a magnet: electricity making movement. Faraday was a blacksmith’s son who left school at 13.', { accept: ['electric motor', 'motor', 'an electric motor'] }),
  fact('h.generator', 'scientists', 'In 1831, Faraday found he could make a current by moving a magnet near a coil of wire. This led to the…', 'generator', ['battery', 'light bulb', 'solar cell'], 'Nearly all mains electricity is still made this way, with spinning magnets and coils in generators.', { accept: ['generator', 'electric generator', 'dynamo', 'the generator'] }),
  fact('h.lectures', 'scientists', 'Which famous lectures for young people did Faraday start at the Royal Institution in London in 1825?', 'the Christmas Lectures', ['the Nobel Lectures', 'the Reith Lectures', 'the Easter Lectures'], 'Faraday gave nineteen series of the Christmas Lectures himself. They still run every year and are shown on television.', choiceOnly),
  mcq('h.swan', 'scientists', 'Joseph Swan from Sunderland showed a working light bulb in 1878–79. What was its glowing filament made of?', [
    ['Carbon', true],
    ['Copper', false, 'Copper melts too easily to glow white-hot.'],
    ['Plastic', false, 'Plastic would melt and burn.'],
  ], 'Swan and Edison both used carbon filaments in glass bulbs with the air taken out, so the filament could not burn. Later bulbs used tungsten.'),
  fact('h.edison', 'scientists', 'Which American inventor made a long-lasting carbon-filament light bulb in 1879 and built power stations to light cities?', 'Thomas Edison', ['Nikola Tesla', 'Lewis Latimer', 'Benjamin Franklin'], 'Edison and Swan later joined forces in Britain as the Edison and Swan company, nicknamed “Ediswan”, in 1883.', { accept: ['edison'] }),
  fact('h.savoy', 'scientists', 'In 1881, which London building became the first public building in the world to be lit entirely by electric light, using Swan’s bulbs?', 'the Savoy Theatre', ['Buckingham Palace', 'the Tower of London', 'St Paul’s Cathedral'], 'At one show, the theatre’s owner broke a glowing bulb in front of the audience to prove electric light was safer than gas.', choiceOnly),
  mcq('h.latimer', 'scientists', 'What did Lewis Latimer, an African American inventor, improve in 1881–82?', [
    ['The way carbon filaments were made', true],
    ['The magnets inside electric motors', false, 'Latimer worked on lighting.'],
    ['The design of the very first battery', false, 'Volta made the first battery in 1800.'],
  ], 'His method made filaments last longer and cost less, so electric light became affordable. Earlier, he had drawn the patent drawings for Alexander Graham Bell’s telephone.'),
  fact('h.tesla', 'scientists', 'Which inventor developed the alternating current (AC) motor and system that power our homes today?', 'Nikola Tesla', ['Thomas Edison', 'Alessandro Volta', 'Joseph Swan'], 'In the “war of the currents” of the late 1880s, Edison backed direct current (DC); Tesla and George Westinghouse backed AC. AC won, because transformers can change its voltage to send it long distances.', { accept: ['tesla'] }),
  fact('h.ayrton', 'scientists', 'Which British engineer studied the electric arc lamp and in 1899 became the first woman member of the Institution of Electrical Engineers?', 'Hertha Ayrton', ['Ada Lovelace', 'Marie Curie', 'Rosalind Franklin'], 'Her book The Electric Arc (1902) explained why arc lamps hissed and flickered.', { accept: ['ayrton'] }),
  mcq('h.units', 'scientists', 'The volt and the amp are named after which two scientists?', [
    ['Volta and Ampère', true],
    ['Faraday and Edison', false, 'Faraday has a unit too, the farad, but not these.'],
    ['Tesla and Newton', false, 'The tesla and the newton are other units.'],
  ], 'Volt after Alessandro Volta; amp (ampere) after André-Marie Ampère, a French scientist who studied currents and magnetism.'),
  order('h.order', 'scientists', 'Put these discoveries in order, earliest first.', ['Franklin shows lightning is electrical', 'Volta builds the first battery', 'Faraday shows the first electric motor', 'Faraday finds how to generate a current', 'Swan and Edison make long-lasting bulbs'], '1752 Franklin, 1800 Volta, 1821 and 1831 Faraday, 1879 Swan and Edison.'),
];

// ---------------------------------------------------------------- memory hooks and real-world examples
const MEMORY = {
  'w.d1': { hook: 'Batteries store **energy**, not electricity: the charges are in the wires all along.', example: 'A phone battery warms up as it charges and as it works: energy being transferred.' },
  'w.current': { hook: 'Current = a **flow** of charge, like water flowing in a pipe.', example: 'A phone charger cable carries a current of about 1 to 3 amps.' },
  'w.mains': { hook: '**230** for the walls; **1.5** for the cells.', example: 'Look at a phone charger plug: it says something like “Input 100–240 V”.' },
  'w.ac': { hook: '**A**C **a**lternates: back and forth. **D**C goes in one **d**irection.', example: 'UK mains swaps direction 50 times every second: 50 Hz.' },
  'w.grid': { hook: 'The National **Grid** is a giant **net** of cables over the whole country.', example: 'Pylons striding across fields carry the National Grid’s overhead lines.' },
  'w.water': { hook: 'Water and mains **never mix**.', example: 'Most UK bathrooms have pull-cord light switches so wet hands never touch a switch.' },
  'w.kite': { hook: '**Look up and live**: check for overhead lines before flying a kite or fishing.', example: 'Signs on pylons show a lightning bolt with the words “Danger of death”.' },
  'w.static': { hook: '**Static** = **stays** put, until it jumps.', example: 'Pulling a jumper over your head in the dark can make tiny crackling sparks.' },
  'w.charges': { hook: '**Like charges repel, opposites attract**: just like magnet poles.', example: 'A rubbed balloon can make your hair stand on end, or bend a thin stream of tap water.' },
  'w.lightning': { hook: 'Lightning is static on a giant scale.', example: 'Count the seconds between flash and thunder and divide by 3 to find roughly how many kilometres away the storm is.' },
  'w.hot': { hook: 'Lightning is about **5×** hotter than the Sun’s surface.' },
  'c.d1': { hook: 'A filament bulb is not fussy: it lights **either way round**.', example: 'In an LED bike lamp the cells must go in the right way round, because LEDs only light one way.' },
  'c.d2': { hook: 'Current goes **out and back**, round the loop, like a racing car on a track.' },
  'c.cellbattery': { hook: 'One **c**ell; a **b**attery is a **b**unch of cells.', example: 'A TV remote takes 2 AA cells: together they are a 3 V battery.' },
  'c.ninevolt': { hook: '**6 × 1.5 = 9**.', example: 'The rectangular 9 V battery in a smoke alarm has six small cells inside.' },
  'c.filament': { hook: 'The **filament** is a fine thread of wire that glows white-hot.', example: 'Old-style “clear” bulbs in cafés and restaurants show the glowing filament.' },
  'c.led': { hook: 'An LED is a one-way street for current.', example: 'Bike lights, TV remotes’ little lights and new street lamps are all LEDs.' },
  'c.reverse': { hook: 'Flip the cell, flip the spin.', example: 'A remote-control car reverses by reversing the current to its motor.' },
  'c.short': { hook: 'A short circuit **skips** the work: big current, hot wire, flat cell.', example: 'Never carry loose batteries in a pocket with coins or keys: they can short-circuit and get hot.' },
  'c.torch': { hook: 'Energy moves, it is never used up: **chemical → electrical → light and heat → surroundings**.' },
  's.cell': { hook: '**Long line, plus sign**: the longer line is the bigger one, +.' },
  's.battery': { hook: 'A battery symbol is a **row of cells**, all facing the same way.' },
  's.motor': { hook: '**M** for **m**otor, **A** for **a**mmeter, **V** for **v**oltmeter.' },
  's.open': { hook: 'Open switch: the drawbridge is **up**, so nothing can cross.', example: 'A light switch on the wall opens and closes a gap just like the symbol shows.' },
  's.wire': { hook: 'Draw circuits with a **ruler**: straight lines and square corners.' },
  'm.d1': { hook: '**All metals conduct; only a few are magnetic.**', example: 'A magnet will not pick up an aluminium can, but aluminium foil still completes a circuit.' },
  'm.d2': { hook: 'Graphite is the **odd one out**: a non-metal that conducts.', example: 'Some science kits light an LED through a thick pencil line drawn on paper.' },
  'm.copper': { hook: '**Cu**pper carries current: copper inside, plastic outside.', example: 'Strip the end of an old cable and you see shiny orange-brown copper strands.' },
  'm.screwdriver': { hook: 'Insulators are a **safety coat** between you and the current.' },
  'm.water': { hook: 'It is what is **dissolved** in water that lets it conduct.' },
  'm.air': { hook: 'Air is an insulator, which is why a gap stops a circuit.', example: 'The gaps between the pins of a plug are filled with air and plastic, both insulators.' },
  'ch.d2': { hook: '**Size = how long it lasts; voltage = how hard it pushes.**', example: 'AAA, AA, C and D cells are all 1.5 V: a D cell just lasts much longer in a big torch.' },
  'ch.blow': { hook: 'Match the cells to the voltage printed on the bulb.', example: 'Torch bulbs are marked with their voltage, like 3 V or 4.5 V.' },
  'ch.share': { hook: 'Bulbs in series **share** the push like friends sharing one pizza.' },
  'ch.wire': { hook: 'A long thin wire is like a long thin straw: harder to get through.', example: 'Some old dimmer switches worked by changing the length of resistance wire in the circuit.' },
  'ch.fairone': { hook: '**Change one, measure one, keep the rest the same.**' },
  'ch.table': { hook: 'First column: what I **changed**. Second: what I **measured**, with units.' },
  'ch.anomaly': { hook: '**Anomalous** means “out of line”: the odd one out.' },
  'p.d1': { hook: 'In series the current is like one queue: everyone moves at the same speed.' },
  'p.d2': { hook: 'Parallel: every branch gets the **full push**.', example: 'Turning on the kitchen light does not dim the lights in the other rooms.' },
  'p.series': { hook: '**Series** = one after another, like episodes of a TV series.', example: 'Some old Christmas lights were wired in series: one broken bulb and the whole set went dark.' },
  'p.parallel': { hook: '**Parallel** lines run side by side: so do parallel branches.', example: 'Every socket and light in your home is on a parallel branch.' },
  'p.home': { hook: 'At home, **every light is its own loop** through the mains.' },
  'p.split': { hook: 'Currents **split** at a junction and **add up** where branches meet.' },
  'p.rope': { hook: 'Rope loop: moves everywhere at once, none used up, warms the hands that grip it.' },
  'p.usedup': { hook: 'Current in = current out. **Energy** is what gets transferred.' },
  'g.generator': { hook: 'A **gen**erator **gen**erates: spinning magnets, coils of wire.', example: 'A bicycle dynamo is a tiny generator: pedal and the lamp lights.' },
  'g.steps': { hook: '**Fuel → steam → turbine → generator → grid.**' },
  'g.induction': { hook: '**Move a magnet, make a current.**', example: 'Wind-up torches have a little generator inside: wind the handle and the magnet spins.' },
  'g.renewable': { hook: '**Re-new-able**: nature keeps topping it up.', example: 'Offshore wind farms in the North Sea now generate a large share of the UK’s electricity.' },
  'g.solar': { hook: 'Solar cell: light in, current out, no moving parts.', example: 'Calculators, garden lights and roof panels use solar cells.' },
  'g.hydro': { hook: '**Hydro** is Greek for water.', example: 'Scotland has many hydroelectric dams in the Highlands.' },
  'g.coal': { hook: 'From 1882 to 2024: about 140 years of British coal power.' },
  'g.highv': { hook: '**High voltage, low current, less heat wasted.**' },
  'g.save': { hook: '**Off, not standby.** Boil what you need. LEDs, not old bulbs.' },
  'g.kwh': { hook: 'A **unit** on your bill = 1 kWh = a 1,000 W heater on for 1 hour.' },
  'h.amber': { hook: '**Elektron** (amber) → **electr**icity, **electr**on.', example: 'Amber jewellery is made from tree resin that hardened millions of years ago.' },
  'h.franklin': { hook: 'Franklin flew a kite to catch the lightning’s secret.', example: 'Franklin’s face is on the American $100 bill.' },
  'h.volta': { hook: '**Volta → volt**: the man who made the first battery, in **1800**.', example: 'Every “1.5 V” printed on a battery honours Volta.' },
  'h.motor': { hook: 'Faraday **1821**: electricity made it **move**. **1831**: movement made electricity.', example: 'Faraday was on the back of the Bank of England £20 note from 1991 to 2001.' },
  'h.generator': { hook: '**Faraday’s magnet trick** is still how power stations work.' },
  'h.lectures': { hook: 'Faraday loved explaining science to children, and the lectures go on today.' },
  'h.swan': { hook: '**Swan in Sunderland, Edison in America**: both lit up carbon filaments around 1879.' },
  'h.savoy': { hook: 'The **Savoy** saved the audience from smoky gas lamps.' },
  'h.latimer': { hook: 'Latimer made light bulbs **last** and cost less.' },
  'h.tesla': { hook: '**T**esla’s **a**lternating **c**urrent travels far: transformers change its voltage.', example: 'The tesla, a unit for measuring magnetic fields, is named after him.' },
  'h.units': { hook: 'Volt → **Volta**, amp → **Ampère**, watt → **Watt**, ohm → **Ohm**.' },
};
for (const [id, memory] of Object.entries(MEMORY)) {
  const item = items.find((it) => it.id === `science.eb.${id}`);
  if (!item) throw new Error(`bonus-electricity.mjs: memory hook for unknown item ${id}`);
  Object.assign(item, memory);
}
// real-world examples shown with each worked example
const TMPL_EXAMPLES = {
  'w.safety': 'UK plugs have a fuse and sockets have their own switches, so appliances can be switched off before you touch them.',
  'c.works': 'When a torch will not light, think like a scientist: is there a gap (a loose spring, a broken filament), or are the cells flat or the wrong way round?',
  's.read': 'Electricians follow circuit diagrams to wire houses, cars and aeroplanes.',
  'm.test': 'A cable is copper (a conductor) wrapped in plastic (an insulator): one material to carry the current, one to keep it in.',
  'ch.change': 'A torch with 3 cells shines brighter than one with 2, if its bulb is made for the bigger voltage.',
  'ch.fair': 'Battery makers run fair tests: same torch, same bulb, different batteries, timing how long each lasts.',
  'p.circuits': 'In a car, the headlights are in parallel: if one bulb fails, the other still lights the road.',
  'g.energy': 'A 10-minute electric shower transfers about as much energy as an LED bulb left on day and night for a whole week.',
};
for (const [id, example] of Object.entries(TMPL_EXAMPLES)) {
  const item = items.find((it) => it.id === `science.eb.${id}`);
  if (!item) throw new Error(`bonus-electricity.mjs: example for unknown item ${id}`);
  item.example = example;
}

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const M = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });
const SYM = (highlight) => ({ kind: 'diagram', id: 'circuit-symbols', highlight });
const MAINS_VS_CELLS = {
  kind: 'table', head: ['', 'mains', 'cells and batteries'], tint: 'cols',
  rows: [['voltage', '**230 V**', '1.5 V for each cell'], ['current', 'AC: changes direction', 'DC: one way only'], ['used for', 'kettles, fridges, TVs', 'torches, remotes, toys'], ['safe to experiment?', '**never**', 'yes'], ['comes from', 'power stations, wind and solar farms', 'chemicals inside'],
  ],
  caption: 'Mains electricity is generated far away and carried to us by the National Grid; cells carry their energy with them.',
};
const GRID = { kind: 'flow', across: true, steps: ['power station', 'National Grid', 'transformer', 'your home'], caption: 'Mains electricity travels from power stations and wind farms through the National Grid; a transformer near your home steps the voltage down to 230 V.' };
const SIMPLE = M({ type: 'circuit', bottom: ['cell', 'switch'], top: [{ k: 'bulb', lit: 2 }, { k: 'buzzer', sound: true }, { k: 'motor', spin: 1 }] }, 'One complete loop: a cell, a closed switch, a bulb, a buzzer and a motor. The same current flows through every one of them.');
const CONDUCTORS = {
  kind: 'table', head: ['material', 'conducts?', 'used for'], tint: 'cols',
  rows: [['copper', '**yes**', 'the wires inside cables'], ['aluminium', '**yes**', 'overhead power lines'], ['steel', '**yes**', 'paper clips, spoons'], ['gold', '**yes**', 'contacts inside phones'], ['graphite', '**yes** (not a metal!)', 'pencil “lead”'],
    ['plastic', 'no', 'coating wires, plug cases'], ['rubber', 'no', 'electricians’ gloves'], ['glass, ceramics', 'no', 'insulators on pylons'], ['wood', 'no', 'rulers, handles'], ['air', 'no', 'the gap in an open switch']],
  caption: 'All metals conduct. Graphite is the surprising non-metal that conducts too.',
};
const TEST_RIG = M({ type: 'circuit', bottom: ['cell', 'switch'], top: [{ k: 'test', text: '?' }, 'bulb'] }, 'Clip each material into the gap. If the bulb lights, it is a conductor.');
const MORE_CELLS = M({ type: 'circuit', many: [{ name: 'A', bottom: ['cell'], top: [{ k: 'bulb', lit: 2 }] }, { name: 'B', bottom: ['battery-2'], top: [{ k: 'bulb', lit: 3 }] }, { name: 'C', bottom: ['cell'], top: [{ k: 'bulb', lit: 1 }, { k: 'bulb', lit: 1 }] }] }, 'B: two cells push harder, so the bulb is brighter than A. C: two bulbs share one cell’s push, so both are dimmer.');
const FAIR = {
  kind: 'table', head: ['in a fair test', 'example: cells and a buzzer'], tint: 'rows',
  rows: [['change **one** thing', 'the number of cells'], ['measure', 'the loudness (sound meter, dB)'], ['keep the same', 'the buzzer, wires, distance to the meter'], ['repeat', 'take each reading three times'], ['conclude', 'more cells, louder buzzer']],
};
const SERIES_PARALLEL = M({ type: 'circuit', many: [{ name: 'A (series)', bottom: ['battery-2'], top: [{ k: 'bulb', lit: 2 }, { k: 'bulb', lit: 2 }] }, { name: 'B (parallel)', bottom: ['battery-2'], branches: [[{ k: 'bulb', lit: 3 }], [{ k: 'bulb', lit: 3 }]] }] }, 'Same battery, same two bulbs. In parallel each bulb gets the full push, so both are brighter than in series.');
const SP_TABLE = {
  kind: 'table', head: ['', 'series', 'parallel'], tint: 'cols',
  rows: [['paths', 'one loop', 'separate branches'], ['one bulb breaks', 'all go **out**', 'others stay **lit**'], ['adding bulbs', 'each gets dimmer', 'each stays as bright'], ['current', 'the same everywhere', 'splits, then adds up again'], ['used in', 'some old fairy lights', 'house lights and sockets']],
};
const POWER = { kind: 'flow', steps: ['Fuel is burned (or uranium split) to heat water', 'Steam spins a turbine', 'The turbine turns a generator: magnets and coils', 'Transformers step the voltage up', 'The National Grid carries it across the country', 'Transformers step it down to 230 V for homes'], caption: 'Wind, tidal and hydroelectric power skip the steam: moving air or water turns the turbine directly. Solar cells have no turbine at all.' };
const RESOURCES = {
  kind: 'table', head: ['resource', 'renewable?', 'why'], tint: 'cols',
  rows: [['wind', '**yes**', 'the wind keeps blowing'], ['solar', '**yes**', 'the Sun keeps shining'], ['hydroelectric', '**yes**', 'rain refills the reservoirs'], ['tidal', '**yes**', 'the tides come in twice a day'],
    ['coal, oil, gas', 'no', 'took millions of years to form'], ['nuclear', 'no', 'its uranium will run out']],
  caption: 'Fossil fuels (coal, oil, gas) also give off carbon dioxide when burned.',
};
const HISTORY = {
  kind: 'timeline', from: 1740, to: 1900, set: 'britain',
  events: [[1752, 'Franklin’s kite'], [1800, 'Volta’s battery'], [1821, 'Faraday’s motor'], [1831, 'Faraday’s generator'], [1879, 'Swan and Edison’s bulbs'], [1888, 'Tesla’s AC motor']],
  caption: 'From lightning to light bulbs in about 130 years.',
};
const TOPIC_VISUALS = {
  'science.elec-what': [MAINS_VS_CELLS, GRID],
  'science.elec-circuits': [{ kind: 'diagram', id: 'circuit' }, SIMPLE],
  'science.elec-symbols': [{ kind: 'diagram', id: 'circuit-symbols' }, M({ type: 'circuit', bottom: ['battery-2', 'switch-open'], top: ['bulb', 'buzzer'] }, 'Two cells (a battery), an open switch, a bulb and a buzzer: straight lines and square corners.')],
  'science.elec-materials': [CONDUCTORS, TEST_RIG],
  'science.elec-changing': [MORE_CELLS, FAIR],
  'science.elec-parallel': [SERIES_PARALLEL, SP_TABLE],
  'science.elec-generating': [POWER, RESOURCES],
  'science.elec-scientists': HISTORY,
};
const ITEM_VISUALS = {
  'science.eb.w.d2': MAINS_VS_CELLS,
  'science.eb.w.grid': GRID,
  'science.eb.c.d1': M({ type: 'circuit', many: [{ name: 'A', bottom: ['cell'], top: [{ k: 'bulb', lit: 2 }] }, { name: 'B', bottom: ['cell-r'], top: [{ k: 'bulb', lit: 2 }] }] }, 'B has the cell turned round: the current flows the other way, and the bulb lights just the same.'),
  'science.eb.c.reverse': M({ type: 'circuit', many: [{ name: 'A', bottom: ['cell'], top: [{ k: 'motor', spin: 1 }] }, { name: 'B', bottom: ['cell-r'], top: [{ k: 'motor', spin: -1 }] }] }, 'Turn the cell round and the motor spins the other way.'),
  'science.eb.c.buzzer': { kind: 'diagram', id: 'circuit', highlight: 'buzzer' },
  'science.eb.c.cellbattery': [SYM('battery'), M({ type: 'circuit', many: [{ name: 'A', bottom: ['cell'], top: ['bulb'] }, { name: 'B', bottom: ['battery-3'], top: ['bulb'] }] }, 'A has one cell. B has a battery: three cells joined together.')],
  'science.eb.c.short': M({ type: 'circuit', bottom: ['cell'], top: ['wire'] }, 'A short circuit: a wire straight from one end of the cell to the other. Don’t do it!'),
  'science.eb.c.bypass': M({ type: 'circuit', bottom: ['cell'], branches: [['bulb'], ['wire']] }, 'The wire underneath gives the current an easy way round, so the bulb stays dark.'),
  'science.eb.c.torch': { kind: 'flow', across: true, steps: ['chemical store', 'electrical', 'light and heat', 'warm surroundings'] },
  'science.eb.s.cell': SYM('cell'),
  'science.eb.s.battery': SYM('battery'),
  'science.eb.s.motor': SYM('motor'),
  'science.eb.s.buzzer': SYM('buzzer'),
  'science.eb.s.open': SYM('switch-open'),
  'science.eb.s.ammeter': SYM('ammeter'),
  'science.eb.s.voltmeter': SYM('voltmeter'),
  'science.eb.s.resistor': SYM('resistor'),
  'science.eb.s.close': M({ type: 'circuit', bottom: ['battery-2', 'switch'], top: [{ k: 'bulb', lit: 3 }, { k: 'motor', spin: 1 }] }, 'Switch closed: one complete loop, so both work.'),
  'science.eb.m.d1': CONDUCTORS,
  'science.eb.m.steps': TEST_RIG,
  'science.eb.m.insulators': CONDUCTORS,
  'science.eb.ch.d1': M({ type: 'circuit', many: [{ name: 'A', bottom: ['cell'], top: [{ k: 'bulb', lit: 2 }] }, { name: 'B', bottom: ['cell'], top: [{ k: 'bulb', lit: 1 }, { k: 'bulb', lit: 1 }] }] }, 'B: the two bulbs share the cell’s push, so both are dimmer than the one in A, and equally bright.'),
  'science.eb.ch.fairone': FAIR,
  'science.eb.p.d2': SERIES_PARALLEL,
  'science.eb.p.split': M({ type: 'circuit', bottom: ['cell', { k: 'ammeter', read: '0.6 A' }], branches: [['bulb', { k: 'ammeter', read: '0.3 A' }], ['bulb', { k: 'ammeter', read: '0.3 A' }]] }, 'The current splits at the junction and joins again: 0.3 + 0.3 = 0.6 A.'),
  'science.eb.p.home': SP_TABLE,
  'science.eb.p.three': M({ type: 'circuit', bottom: ['cell'], branches: [[{ k: 'bulb', tag: 'A', lit: 2 }], [{ k: 'bulb', tag: 'B' }], [{ k: 'bulb', tag: 'C', lit: 2 }]] }, 'Bulb B has broken. Branches A and C are still complete loops, so they stay lit.'),
  'science.eb.g.steps': POWER,
  'science.eb.g.renewable': RESOURCES,
  'science.eb.h.order': HISTORY,
  'science.eb.h.motor': HISTORY,
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = it.visual ? [].concat(it.visual, v) : v; }

export default [{ subject: 'science', deck: 'bonus-electricity', topics, items }];

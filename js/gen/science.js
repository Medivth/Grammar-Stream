// Science procedure generators: speed, weight, pH, variables and means.

const fmt = (x) => String(Math.round(x * 100) / 100);

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const options = rng.shuffle([{ text: correct, correct: true }, ...wrongs.map((w) => (typeof w === 'string' ? { text: w } : w))]);
  return { kind: 'choice', prompt, options, ...extra };
}

// [question, independent, dependent, control, wrong-but-tempting]
const INVESTIGATIONS = [
  ['Does the temperature of water affect how quickly sugar dissolves?', 'the temperature of the water', 'the time taken for the sugar to dissolve', 'the mass of sugar', 'the colour of the cup'],
  ['Does the height a ball is dropped from affect how high it bounces?', 'the height it is dropped from', 'the height of the bounce', 'the type of ball', 'the time of day'],
  ['Does the amount of light affect how tall a plant grows?', 'the amount of light', 'the height of the plant', 'the amount of water', 'the name of the plant'],
  ['Does the thickness of wrapping affect how fast a cup of water cools?', 'the thickness of wrapping', 'the temperature after 20 minutes', 'the starting temperature of the water', 'who reads the thermometer'],
  ['Does the surface a toy car rolls on affect how far it travels?', 'the type of surface', 'the distance the car travels', 'the height of the ramp', 'the colour of the car'],
  ['Does the size of a parachute affect how long it takes to fall?', 'the size of the parachute', 'the time taken to fall', 'the mass hanging from it', 'the shape of the room'],
  ['Does the number of cells (batteries) affect how bright a bulb is?', 'the number of cells', 'the brightness of the bulb', 'the type of bulb', 'the length of the table'],
];

const INDICATOR = [[1, 'red', 'strong acid'], [4, 'orange', 'weak acid'], [6, 'yellow', 'weak acid'], [7, 'green', 'neutral'], [9, 'blue', 'weak alkali'], [13, 'purple', 'strong alkali']];
const SUBSTANCES = [['lemon juice', 2, 'acid'], ['vinegar', 3, 'acid'], ['stomach acid', 1, 'acid'], ['pure water', 7, 'neutral'], ['soap', 10, 'alkali'], ['bleach', 13, 'alkali'], ['baking soda solution', 8, 'alkali'], ['milk of magnesia', 10, 'alkali'], ['cola', 3, 'acid']];

export const SCIENCE_GENERATORS = {
  speed(level, rng) {
    if (level === 1) {
      const s = rng.int(2, 12), t = rng.int(2, 10), d = s * t;
      return {
        kind: 'typed', prompt: `A cyclist travels ${d} m in ${t} seconds. What is their average speed?`, numeric: { value: String(s), form: 'any' }, unit: 'm/s',
        explain: `speed = distance ÷ time = ${d} ÷ ${t} = ${s} m/s.`,
        steps: ['I use speed = distance ÷ time.', `distance = ${d} m, time = ${t} s.`, `${d} ÷ ${t} = ${s} m/s.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const s = rng.int(3, 30), t = rng.int(2, 12);
        return {
          kind: 'typed', prompt: `A train travels at ${s} m/s for ${t} seconds. How far does it go?`, numeric: { value: String(s * t), form: 'any' }, unit: 'm',
          explain: `distance = speed × time = ${s} × ${t} = ${s * t} m.`,
          steps: ['I rearrange: distance = speed × time.', `speed = ${s} m/s, time = ${t} s.`, `${s} × ${t} = ${s * t} m.`],
        };
      }
      const s = rng.int(2, 10), t = rng.int(3, 15), d = s * t;
      return {
        kind: 'typed', prompt: `A runner covers ${d} m at ${s} m/s. How long does it take?`, numeric: { value: String(t), form: 'any' }, unit: 's',
        explain: `time = distance ÷ speed = ${d} ÷ ${s} = ${t} s.`,
        steps: ['I rearrange: time = distance ÷ speed.', `distance = ${d} m, speed = ${s} m/s.`, `${d} ÷ ${s} = ${t} s.`],
      };
    }
    const h = rng.pick([0.5, 1.5, 2, 2.5, 3]), s = rng.pick([40, 50, 60, 70, 80, 90]);
    const d = s * h;
    return {
      kind: 'typed', prompt: `A car travels ${fmt(d)} km in ${h} hours. What is its average speed in km/h?`, numeric: { value: String(s), form: 'any' }, unit: 'km/h',
      explain: `speed = distance ÷ time = ${fmt(d)} ÷ ${h} = ${s} km/h.`,
      steps: ['speed = distance ÷ time, keeping the units: km and hours give km/h.', `${fmt(d)} km ÷ ${h} h.`, `= ${s} km/h.`],
    };
  },

  weight(level, rng) {
    const m = rng.int(2, 80);
    if (level === 1) {
      return {
        kind: 'typed', prompt: `On Earth, gravity is about 10 N/kg. What is the weight of a ${m} kg object?`, numeric: { value: String(m * 10), form: 'any' }, unit: 'N',
        explain: `weight = mass × gravitational field strength = ${m} × 10 = ${m * 10} N.`,
        steps: ['weight = mass × gravitational field strength (g).', `mass = ${m} kg, g = 10 N/kg on Earth.`, `${m} × 10 = ${m * 10} N.`],
      };
    }
    if (level === 2) {
      const mm = rng.int(1, 20) * 5;
      return {
        kind: 'typed', prompt: `On the Moon, gravity is 1.6 N/kg. What would a ${mm} kg astronaut weigh there?`, numeric: { value: fmt(mm * 1.6), form: 'any' }, unit: 'N',
        explain: `weight = ${mm} × 1.6 = ${fmt(mm * 1.6)} N. Their MASS is still ${mm} kg: mass doesn’t change, weight does.`,
        steps: ['weight = mass × g, and on the Moon g = 1.6 N/kg.', `${mm} × 1.6.`, `= ${fmt(mm * 1.6)} N, much less than on Earth (${mm * 10} N).`],
      };
    }
    return {
      kind: 'typed', prompt: `An object weighs ${m * 10} N on Earth (g = 10 N/kg). What is its mass?`, numeric: { value: String(m), form: 'any' }, unit: 'kg',
      explain: `mass = weight ÷ g = ${m * 10} ÷ 10 = ${m} kg.`,
      steps: ['I rearrange: mass = weight ÷ g.', `${m * 10} N ÷ 10 N/kg.`, `= ${m} kg.`],
    };
  },

  phScale(level, rng) {
    if (level === 1) {
      const [name, ph, type] = rng.pick(SUBSTANCES);
      return choice(`${name[0].toUpperCase() + name.slice(1)} has a pH of about ${ph}. Is it an acid, an alkali or neutral?`, type === 'acid' ? 'acid' : type === 'alkali' ? 'alkali' : 'neutral',
        ['acid', 'alkali', 'neutral'].filter((x) => x !== type), rng, {
          explain: `Below 7 is acidic, 7 is neutral, above 7 is alkaline. pH ${ph} is ${type === 'neutral' ? 'neutral' : type === 'acid' ? 'acidic' : 'alkaline'}.`,
          steps: ['The pH scale runs from 0 to 14.', 'Below 7 = acid, 7 = neutral, above 7 = alkali.', `pH ${ph}, so it is ${type === 'neutral' ? 'neutral' : `an ${type}`}.`],
        });
    }
    if (level === 2) {
      const [ph, colour, kind] = rng.pick(INDICATOR);
      return choice(`Universal indicator turns ${colour} in a solution. What does that tell you?`, kind, ['strong acid', 'weak acid', 'neutral', 'weak alkali', 'strong alkali'].filter((x) => x !== kind).slice(0, 3), rng, {
        explain: `Universal indicator: red/orange = acid (red is stronger), yellow = weak acid, green = neutral, blue = weak alkali, purple = strong alkali. ${colour} means about pH ${ph}: ${kind}.`,
        steps: ['I remember the colours: red, orange, yellow, green, blue, purple.', 'Acids are the warm colours, green is neutral, alkalis are blue and purple.', `${colour[0].toUpperCase() + colour.slice(1)} means ${kind}.`],
      });
    }
    const acidic = rng.chance(0.5);
    const [name] = rng.pick(SUBSTANCES.filter((s) => s[2] === (acidic ? 'acid' : 'alkali')));
    const fixers = acidic ? ['baking soda solution', 'milk of magnesia', 'soap'] : ['vinegar', 'lemon juice'];
    const fix = rng.pick(fixers);
    const wrongs = rng.sample(acidic ? ['vinegar', 'lemon juice', 'pure water', 'cola'] : ['soap', 'bleach', 'pure water', 'baking soda solution'], 3).filter((w) => w !== name && w !== fix);
    return choice(`Which of these could neutralise ${name}?`, fix, wrongs.slice(0, 2), rng, {
      explain: `${acidic ? 'An acid' : 'An alkali'} is neutralised by ${acidic ? 'an alkali' : 'an acid'}. ${fix[0].toUpperCase() + fix.slice(1)} is ${acidic ? 'an alkali' : 'an acid'}. Acid + alkali → salt + water.`,
      steps: [`${name[0].toUpperCase() + name.slice(1)} is ${acidic ? 'an acid' : 'an alkali'}.`, `To neutralise it I need ${acidic ? 'an alkali' : 'an acid'}.`, `${fix[0].toUpperCase() + fix.slice(1)} is ${acidic ? 'an alkali' : 'an acid'}, so it works.`],
    });
  },

  variables(level, rng) {
    const [question, iv, dv, cv, silly] = rng.pick(INVESTIGATIONS);
    const ask = level === 1 ? ['independent', iv, 'the one you change on purpose'] : level === 2 ? ['dependent', dv, 'the one you measure'] : ['control', cv, 'one you keep the same to make it fair'];
    const all = [iv, dv, cv, silly];
    return choice(`Investigation: “${question}” Which is ${ask[0] === 'independent' ? 'an' : 'a'} ${ask[0]} variable?`, ask[1], all.filter((x) => x !== ask[1]).map((x) => ({ text: x, feedback: x === silly ? 'That wouldn’t affect the results, so we don’t need to think about it.' : x === iv ? 'That is the independent variable: the thing you change.' : x === dv ? 'That is the dependent variable: what you measure.' : 'That is a control variable: kept the same.' })), rng, {
      explain: `The ${ask[0]} variable is ${ask[2]}: ${ask[1]}.`,
      steps: ['Independent = what I change. Dependent = what I measure. Control = what I keep the same.', `Here I change ${iv} and measure ${dv}.`, `So the ${ask[0]} variable is ${ask[1]}.`],
    });
  },

  meanResults(level, rng) {
    if (level === 1) {
      const base = rng.int(10, 40);
      const vals = [base - 1, base, base + 1].map((v) => v + rng.int(-1, 1));
      const total = vals.reduce((a, b) => a + b, 0);
      if (total % 3) return SCIENCE_GENERATORS.meanResults(1, rng);
      return {
        kind: 'typed', prompt: `A group timed the same experiment three times: ${vals.join(' s, ')} s. What is the mean time?`, numeric: { value: String(total / 3), form: 'any' }, unit: 's',
        explain: `Add them up (${total}) and divide by how many there are (3): ${total / 3} s.`,
        steps: [`I add the results: ${vals.join(' + ')} = ${total}.`, 'There are 3 results, so I divide by 3.', `${total} ÷ 3 = ${total / 3} s.`],
      };
    }
    if (level === 2) {
      const vals = [rng.int(20, 60), rng.int(20, 60), rng.int(20, 60), rng.int(20, 60)].map((v) => v / 10);
      const tenths = vals.reduce((a, b) => a + Math.round(b * 10), 0);
      if (tenths % 2) return SCIENCE_GENERATORS.meanResults(2, rng); // keeps the mean exact to 2 d.p.
      const total = tenths / 10;
      const mean = tenths / 40;
      return {
        kind: 'typed', prompt: `Four repeat readings of a spring’s stretch: ${vals.join(' cm, ')} cm. What is the mean? `, numeric: { value: String(mean), form: 'any' }, unit: 'cm',
        explain: `Total = ${fmt(total)} cm; ${fmt(total)} ÷ 4 = ${mean} cm.`,
        steps: [`I add: ${vals.join(' + ')} = ${fmt(total)}.`, 'I divide by the number of readings, 4.', `${fmt(total)} ÷ 4 = ${mean} cm.`],
      };
    }
    const good = [rng.int(20, 30), rng.int(20, 30), rng.int(20, 30)];
    const total = good.reduce((a, b) => a + b, 0);
    if (total % 3) return SCIENCE_GENERATORS.meanResults(3, rng);
    const anomaly = rng.int(45, 60);
    const vals = rng.shuffle([...good, anomaly]);
    return {
      kind: 'typed', prompt: `Results: ${vals.join(' s, ')} s. One result is anomalous (doesn’t fit the pattern). Leave it out and calculate the mean of the others.`, numeric: { value: String(total / 3), form: 'any' }, unit: 's',
      explain: `${anomaly} s is the anomaly. Mean of the rest: (${good.join(' + ')}) ÷ 3 = ${total / 3} s.`,
      steps: [`${anomaly} is far from the others, so it is anomalous: maybe a mistake in timing.`, `I add the other three: ${good.join(' + ')} = ${total}.`, `${total} ÷ 3 = ${total / 3} s.`],
    };
  },
};

// Maths content source: a prerequisite graph of procedural topics, each backed by a
// generator in js/gen/maths.js, plus key facts. Levels: 1 ≈ secure Year 6,
// 2 ≈ greater depth / early Year 7, 3 ≈ Year 7 grammar-school stretch.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });

const TOPICS = [
  T('place-value', 'Decimals and place value', 'placeValueDecimals', [], { teach: 'Explain why 0.4 is bigger than 0.35 even though it has fewer digits.', talk: 'Ask her which is bigger, 0.5 or 0.45, and why.' }),
  T('negatives', 'Negative numbers', 'negatives', [], { teach: 'Explain what subtracting a negative number does.', talk: 'If it is −3°C and gets 5 degrees warmer, what is the temperature?' }),
  T('frac-line', 'Fractions on a number line', 'fracNumberLine', [], { teach: 'Explain how you find where 3/4 goes on a number line.', talk: 'Ask her where 5/4 goes on a ruler that is 2 long.' }),
  T('frac-compare', 'Comparing fractions', 'fracCompare', ['frac-line'], { teach: 'Explain why 1/8 is smaller than 1/5.', talk: 'Would she rather have 2/3 or 3/5 of a pizza? Why?' }),
  T('frac-equiv', 'Equivalent fractions and simplifying', 'fracEquivalent', ['frac-compare'], { teach: 'Explain how you simplify a fraction.', talk: 'Ask her to simplify 12/16 in her head.' }),
  T('frac-addsub', 'Adding and subtracting fractions', 'fracAddSub', ['frac-equiv'], { teach: 'Explain why you can’t just add the denominators.', talk: 'What is 1/2 + 1/3? (Not 2/5!)' }),
  T('frac-multiply', 'Multiplying and dividing fractions', 'fracMultiply', ['frac-equiv'], { teach: 'Explain why multiplying by a fraction smaller than 1 makes a number smaller.', talk: 'What is half of a quarter?' }),
  T('frac-amount', 'Fractions of amounts', 'fracOfAmount', ['frac-equiv'], { teach: 'Explain how to find 3/5 of 40.', talk: 'Ask her to find 3/4 of the bill when you next shop.' }),
  T('fdp', 'Fractions, decimals and percentages', 'fdp', ['frac-equiv', 'place-value'], { teach: 'Explain how to turn 3/5 into a percentage.', talk: 'Which is better: 30% off or a third off?' }),
  T('percent', 'Percentages of amounts', 'percentOf', ['fdp'], { teach: 'Explain a quick way to find 15% of something.', talk: 'Ask her to work out a 10% tip, then 15%.' }),
  T('order-ops', 'Order of operations', 'orderOps', [], { teach: 'Explain why 3 + 4 × 2 is 11, not 14.', talk: 'Ask her what 10 − 2 × 3 is.' }),
  T('substitute', 'Algebra: substitution', 'algebraSubstitute', ['order-ops'], { teach: 'Explain what 3a means if a = 5.', talk: 'If a = 4, is 2a the same as 24?' }),
  T('sequences', 'Sequences and the nth term', 'sequences', ['negatives'], { teach: 'Explain the difference between the term-to-term rule and the nth term.', talk: 'What is the 100th term of 3, 5, 7, 9…?' }),
  T('equations', 'Solving equations', 'equations', ['substitute'], { teach: 'Explain how you solve 3x + 5 = 20.', talk: 'I think of a number, double it and add 3. I get 17. What was my number?' }),
  T('ratio', 'Ratio and sharing', 'ratioShare', ['frac-amount'], { teach: 'Explain how to share £40 in the ratio 3 : 5.', talk: 'Share 12 sweets between you in the ratio 1 : 2.' }),
  T('primes', 'Factors, multiples and primes', 'factorsPrimes', [], { teach: 'Explain why 51 is not a prime number.', talk: 'Is 91 prime? (Try 7.)' }),
  T('angles', 'Angle facts', 'angles', [], { teach: 'Explain how you find a missing angle in a triangle.', talk: 'Ask her what the angles in a triangle add up to.' }),
];

const FACTS = [
  ['What is 7²?', '49', ['14', '72', '56']], ['What is 9²?', '81', ['18', '92', '72']], ['What is 12²?', '144', ['24', '122', '132']],
  ['What is 15²?', '225', ['30', '215', '255']], ['What is √64?', '8', ['32', '6', '16']], ['What is √121?', '11', ['12', '60.5', '21']],
  ['What is {{1/8}} as a decimal?', '0.125', ['0.8', '0.18', '0.25']], ['What is {{3/4}} as a percentage?', '75%', ['34%', '0.75%', '70%']],
  ['What is {{1/5}} as a decimal?', '0.2', ['0.5', '0.15', '0.25']], ['What is 0.05 as a percentage?', '5%', ['50%', '0.5%', '0.05%']],
  ['How many metres are in 1 kilometre?', '1000', ['100', '10', '10 000']], ['How many millilitres are in 1 litre?', '1000', ['100', '10', '500']],
  ['How many grams are in 1 kilogram?', '1000', ['100', '10', '500']], ['How many centimetres are in 1 metre?', '100', ['10', '1000', '60']],
  ['What do the angles in a triangle add up to?', '180°', ['360°', '90°', '270°']], ['What do the angles around a point add up to?', '360°', ['180°', '90°', '270°']],
  ['What do the angles in a quadrilateral add up to?', '360°', ['180°', '540°', '400°']], ['What is the smallest prime number?', '2', ['1', '3', '0']],
  ['What is an acute angle?', 'less than 90°', ['exactly 90°', 'between 90° and 180°', 'more than 180°']], ['What is an obtuse angle?', 'between 90° and 180°', ['less than 90°', 'exactly 180°', 'more than 180°']],
  ['How many sides does a hexagon have?', '6', ['5', '7', '8']], ['How many sides does an octagon have?', '8', ['6', '7', '10']],
  ['What is the formula for the area of a rectangle?', 'length × width', ['2 × (length + width)', 'length + width', '½ × length × width']],
  ['What is the formula for the area of a triangle?', '½ × base × height', ['base × height', 'base + height', '2 × base × height']],
];

const items = TOPICS.map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1] }));
const factItems = FACTS.map(([prompt, answer, distractors], i) => ({
  id: `maths.fact.${i + 1}`, topic: 'maths.key-facts', kind: 'fact', prompt, answer, distractors, explain: `${prompt.replace(/\?$/, '')}: ${answer}.`,
  ...(/^\d+(\.\d+)?%?$/.test(answer) ? {} : { formats: ['choice'] }),
  ...(answer.endsWith('%') ? { accept: [answer.slice(0, -1)] } : {}),
}));

export default [{
  subject: 'maths', deck: 'core',
  topics: [
    ...TOPICS.map(({ gen, ...t }) => ({ kind: 'skill', ...t })),
    { id: 'maths.key-facts', title: 'Key facts', kind: 'facts', prereqs: [], batch: 6, teach: 'Explain how you remember what the angles in a triangle add up to.', talk: 'Quick-fire: what is 12 squared?' },
  ],
  items: [...items, ...factItems],
}];

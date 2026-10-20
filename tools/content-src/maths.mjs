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
  // written methods, measures, geometry and data (Year 6 statutory, stretching into Year 7)
  T('long-mult', 'Long multiplication', 'longMult', ['place-value'], { teach: 'Explain how you work out 34 × 26 by splitting one of the numbers.', talk: 'Ask her for 23 × 4 in her head, then 23 × 40.' }),
  T('long-div', 'Long division and remainders', 'longDiv', ['long-mult'], { teach: 'Explain when a remainder means you round UP and when it means you round down.', talk: '7 friends share 50 sweets. How many each, and how many left?' }),
  T('area', 'Area and perimeter', 'areaPerimeter', [], { teach: 'Explain the difference between area and perimeter, and why a triangle’s area is half base times height.', talk: 'Guess the area of the kitchen table, then measure it.' }),
  T('volume', 'Volume of cuboids', 'volume', ['area'], { teach: 'Explain how to find the volume of a shoebox.', talk: 'How many 1 cm cubes would fit in a 10 cm cube?' }),
  T('coordinates', 'Coordinates in four quadrants', 'coordinates', ['negatives'], { teach: 'Explain what happens to a point’s coordinates when you reflect it in the x-axis.', talk: 'Play a quick game of Battleships with negative coordinates.' }),
  T('units', 'Converting units', 'units', ['place-value'], { teach: 'Explain how you change 2.3 km into metres, and why you multiply.', talk: 'How many millilitres in the bottle in the fridge? How many litres is that?' }),
  T('time', 'Time and timetables', 'time', [], { teach: 'Explain how you work out how long it is from 09:45 to 11:20.', talk: 'Next time you catch a bus or train, ask her to plan it from the timetable.' }),
  T('word-problems', 'Multi-step money problems', 'wordProblems', ['long-div', 'frac-amount'], { teach: 'Explain how you decide what to work out first in a two-step problem.', talk: 'At the shop: three of these and a £10 note, what’s the change?' }),
  T('probability', 'Probability', 'probability', ['frac-equiv'], { teach: 'Explain why the probability of an event and its opposite add up to 1.', talk: 'Roll a dice 30 times together and compare the number of 6s with what she expected.' }),
  T('charts', 'Bar charts, pie charts and line graphs', 'charts', ['frac-amount', 'angles'], { teach: 'Explain why a pie chart sector of 90° is a quarter of the data.', talk: 'Find a chart in the news and ask her what it shows.' }),
];

const SHAPES = [
  ['Which quadrilateral has two pairs of parallel sides and all sides equal, but no right angles?', 'a rhombus', ['a rectangle', 'a trapezium', 'a kite'], 'A rhombus is a “pushed-over square”: four equal sides, opposite angles equal.'],
  ['Which quadrilateral has exactly one pair of parallel sides?', 'a trapezium', ['a parallelogram', 'a rhombus', 'a rectangle'], 'Trapezium: one pair of parallel sides. Parallelogram: two pairs.'],
  ['Which quadrilateral has two pairs of equal sides that are next to each other, like a diamond on a string?', 'a kite', ['a rhombus', 'a parallelogram', 'a trapezium'], 'A kite’s equal sides are adjacent (touching), not opposite.'],
  ['What is a triangle with all three sides equal called?', 'equilateral', ['isosceles', 'scalene', 'right-angled'], 'Equilateral: all sides equal, all angles 60°.'],
  ['What is a triangle with exactly two equal sides called?', 'isosceles', ['equilateral', 'scalene', 'obtuse'], 'Isosceles: two equal sides and two equal base angles.'],
  ['What is a triangle with no equal sides called?', 'scalene', ['isosceles', 'equilateral', 'regular'], 'Scalene: all sides and all angles different.'],
  ['What is the distance from the centre of a circle to its edge called?', 'the radius', ['the diameter', 'the circumference', 'the chord'], 'Radius: centre to edge. Diameter: edge to edge through the centre, twice the radius.', ['radius']],
  ['What is the distance all the way round a circle called?', 'the circumference', ['the diameter', 'the radius', 'the perimeter'], 'The circumference is a circle’s perimeter. It is about 3.14 (π) times the diameter.', ['circumference']],
  ['A circle has a radius of 7 cm. What is its diameter?', '14 cm', ['3.5 cm', '7 cm', '21 cm'], 'The diameter is twice the radius: 2 × 7 = 14 cm.', ['14']],
  ['What is a 2D shape with all sides equal and all angles equal called?', 'a regular polygon', ['a quadrilateral', 'a congruent shape', 'a symmetrical shape'], 'A square is a regular quadrilateral; an equilateral triangle is a regular triangle.'],
  ['What is the flat pattern that folds up to make a 3D shape called?', 'a net', ['a face', 'a plan', 'a cross-section'], 'A cube’s net is six squares joined so they fold into a box.', ['net']],
  ['How many faces, edges and vertices does a cube have?', '6 faces, 12 edges, 8 vertices', ['6 faces, 8 edges, 12 vertices', '8 faces, 12 edges, 6 vertices', '6 faces, 6 edges, 6 vertices'], 'Count them on a dice: 6 faces, 12 edges where faces meet, 8 corners (vertices).'],
  ['Which 3D shape has two circular faces and one curved surface?', 'a cylinder', ['a cone', 'a sphere', 'a triangular prism'], 'A cylinder is like a tin of beans: two flat circles and a curved side.', ['cylinder']],
  ['Which 3D shape has a square base and four triangular faces meeting at a point?', 'a square-based pyramid', ['a triangular prism', 'a cuboid', 'a tetrahedron'], 'The pyramids of Giza are square-based pyramids.'],
  ['Two shapes are exactly the same shape and size. What word describes them?', 'congruent', ['similar', 'symmetrical', 'parallel'], 'Congruent shapes fit exactly on top of each other, even if one is turned or flipped.'],
  ['What is the name for lines that are always the same distance apart and never meet?', 'parallel', ['perpendicular', 'horizontal', 'diagonal'], 'Parallel lines, like railway tracks. Perpendicular lines meet at a right angle.'],
  ['What is the name for two lines that meet at a right angle?', 'perpendicular', ['parallel', 'adjacent', 'opposite'], 'Perpendicular: at 90° to each other, like the corner of a page.'],
  ['How many lines of symmetry does a regular hexagon have?', '6', ['3', '2', '12'], 'A regular polygon has as many lines of symmetry as it has sides.'],
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

const shapeItems = SHAPES.map(([prompt, answer, distractors, explain, accept], i) => ({
  id: `maths.shape.${i + 1}`, topic: 'maths.shapes', kind: 'fact', prompt, answer, distractors, explain,
  ...(accept ? { accept } : { formats: ['choice'] }),
}));

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
    { id: 'maths.shapes', title: 'Shapes and their properties', kind: 'facts', prereqs: ['maths.angles'], batch: 5, intro: 'Mathematicians have exact names for shapes and their parts. Knowing them means you can describe any shape precisely.', teach: 'Explain the difference between a rhombus and a parallelogram.', talk: 'Spot three different quadrilaterals around the house.' },
  ],
  items: [...items, ...factItems, ...shapeItems],
}];

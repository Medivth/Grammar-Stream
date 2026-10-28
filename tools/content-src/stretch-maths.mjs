// Maths stretch tier: end of Year 7 into Year 8. Unlocks once most of maths is secure.
// Each topic is a generator (js/gen/maths3.js) with three levels.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, kind: 'skill', tier: 'stretch', prereqs: prereqs.map((p) => `maths.${p}`), ...extra });

const TOPICS = [
  T('expand', 'Algebra: expanding and factorising', 'expand', ['equations'], { hook: 'Multiply EVERY term inside the bracket by the number outside: no term left behind.', intro: 'Algebra is about doing the same thing to every term. Expanding multiplies out a bracket; factorising puts one back. Collecting like terms tidies up.', teach: 'Explain why 3(x + 2) is 3x + 6 and not 3x + 2.', talk: 'Ask her to expand 4(y − 3) in her head.' }),
  T('equations-2', 'Equations with x on both sides', 'equations2', ['expand'], { hook: 'Move the smaller x term across to join the bigger one, then solve as usual.', intro: 'When x appears on both sides, move the smaller x term across first. Then it is an equation you already know how to solve.', teach: 'Explain how to solve 5x + 2 = 2x + 14.', talk: 'I think of a number, treble it and add 4. That is the same as doubling it and adding 9. What is my number?' }),
  T('percent-change', 'Percentage change and reverse percentages', 'percentChange', ['percent'], { hook: 'Always work from the ORIGINAL: 20% off means you pay 80%, so divide by 0.8 to go back.', intro: 'Shops, banks and newspapers all talk in percentage changes. The trap: a percentage is always OF the original amount.', teach: 'Explain why a 20% rise followed by a 20% cut does not get you back where you started.', talk: 'A game is £48 after 20% off. Ask her what it cost before (not £57.60!).' }),
  T('polygons', 'Angles in polygons', 'polygons', ['angles'], { hook: 'Interior angles add up to (n − 2) × 180°; exterior angles always add up to 360°.', intro: 'Every polygon can be cut into triangles, which is why we can work out its angles. Walking round the outside of any shape, you always turn 360°.', teach: 'Explain why the interior angles of a hexagon add up to 720°.', talk: 'Count the sides on a 50p coin. What is each interior angle of a regular heptagon?' }),
  T('parallel', 'Angles in parallel lines', 'parallelAngles', ['polygons'], { hook: 'F angles are corresponding (equal), Z angles are alternate (equal), C angles are co-interior (add to 180°).', intro: 'A line crossing two parallel lines makes eight angles, but only two different sizes. Learn the F, Z and C shapes and you can find any of them.', teach: 'Explain the difference between corresponding and alternate angles.', talk: 'Find parallel lines in the room (shelves, window bars) and spot a Z angle.' }),
  T('ratio-2', 'Ratio: three parts, differences and best buys', 'ratio2', ['ratio'], { hook: 'Best buy: compare the price of the SAME amount, such as pence per 100 g.', intro: 'Harder ratio problems hide the total: sometimes you are told the difference instead. Best-buy questions are ratio in disguise: compare the price of the same amount.', teach: 'Explain how you compare value for money between two pack sizes.', talk: 'In the supermarket, ask her which size of a product is better value per 100 g.' }),
  T('indices', 'Powers and index laws', 'indices', ['primes'], { hook: 'Multiplying? Add the powers. Dividing? Subtract them. Power of a power? Multiply them.', intro: 'Powers are repeated multiplication. Once you see that, the three index laws (add, subtract, multiply the little numbers) are obvious.', teach: 'Explain why 2³ × 2⁴ = 2⁷.', talk: 'How many great-great-grandparents does she have? (2⁴)' }),
  T('linear-graphs', 'Straight-line graphs', 'linearGraphs', ['coordinates', 'substitute'], { hook: 'y = mx + c: m is the steepness (gradient), c is where the line crosses the y-axis.', intro: 'y = 2x + 3 is a rule connecting x and y. Every point that follows the rule sits on a straight line; the 2 is its steepness and the 3 is where it crosses the y-axis.', teach: 'Explain what the gradient of a line tells you.', talk: 'Ask her what y = 3x + 1 gives when x = 10, and when x = −2.' }),
  T('frac-mixed', 'Fraction arithmetic: mixed numbers and division', 'fracMixed', ['frac-addsub', 'frac-multiply'], { hook: 'Dividing by a fraction: Keep, Change, Flip (KCF). 3 ÷ ½ = 3 × 2 = 6.', intro: 'The last fraction skills: adding mixed numbers, and dividing by a fraction (which means flipping it and multiplying).', teach: 'Explain why dividing by a half is the same as doubling.', talk: 'How many quarter-pizzas in 3½ pizzas?' }),
  T('circles', 'Circles: circumference and area', 'circles', ['area'], { hook: 'Cherry pie’s delicious: C = πd. Apple pies are too: A = πr².', intro: 'π is the same for every circle in the universe: the circumference is always a little more than three times the diameter. Two formulas and you can measure any circle.', teach: 'Explain the difference between the formulas for circumference and area.', talk: 'Measure round a mug with string and across it with a ruler. Divide. Did you get about 3.14?' }),
];

// Real-world examples for each topic's question generator (shown with worked examples).
const TMPL_MEMORY = {
  expand: { example: '4 lunch bags, each with a sandwich and 2 apples: 4(s + 2a) = 4s + 8a.' },
  'equations-2': { example: 'Gym A: £20 to join plus £5 a visit. Gym B: £9 a visit. 20 + 5x = 9x, so after 5 visits they cost the same.' },
  'percent-change': { example: 'A coat costs £60 in a 25% off sale. You pay 75%, so the original price was £60 ÷ 0.75 = £80.' },
  polygons: { example: 'Hexagonal floor tiles fit with no gaps: each angle is 120°, and three of them meet to make 360°.' },
  parallel: { example: 'A five-bar gate: the diagonal bar crosses the parallel bars and makes Z-shaped alternate angles.' },
  'ratio-2': { example: 'Cereal: 500 g for £2 is 40p per 100 g; 750 g for £2.70 is 36p per 100 g, so the big box is better value.' },
  indices: { example: 'Fold a sheet of paper in half 5 times and you get 2⁵ = 32 layers.' },
  'linear-graphs': { example: 'A taxi charges £3 to get in plus £2 a mile: fare = 2 × miles + 3, which is the line y = 2x + 3.' },
  'frac-mixed': { example: 'How many quarter-pizzas in 3½ pizzas? 3½ ÷ ¼ = 7/2 × 4 = 14.' },
  circles: { example: 'A bike wheel 70 cm across rolls about 3.14 × 70 ≈ 220 cm forward on every turn.' },
};

const items = TOPICS.map((t, i) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: ['expand', 'equations2', 'percentChange', 'polygons', 'parallelAngles', 'ratio2', 'indices', 'linearGraphs', 'fracMixed', 'circles'][i], levels: [1, 2, 3], seed: [-0.6, 0.2, 1], ...TMPL_MEMORY[t.id.replace(/^maths\./, '')] }));

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const M = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });
const TOPIC_VISUALS = {
  'maths.percent-change': M({ type: 'barmodel', rows: [{ label: '100%', parts: 5, text: '£12' }, { label: '120%', parts: 6, text: '£12', total: '£72' }] }, 'After a 20% rise a coat costs £72. That is 120%: 6 blocks of 20%. One block = £72 ÷ 6 = £12, so the original (100%) was 5 × £12 = £60.'),
  'maths.polygons': { kind: 'table', head: ['sides', 'triangles', 'angles add to'], rows: [['3 (triangle)', '1', '180°'], ['4 (quadrilateral)', '2', '360°'], ['5 (pentagon)', '3', '540°'], ['6 (hexagon)', '4', '**720°**'], ['8 (octagon)', '6', '1080°']], caption: 'Diagonals from one corner cut a polygon into (n − 2) triangles, each 180°. Exterior angles always add up to 360°.' },
  'maths.ratio-2': M({ type: 'barmodel', rows: [{ label: 'Ali', parts: 5, text: '£5' }, { label: 'Ben', parts: 2, text: '£5' }] }, 'Ratio 5 : 2, and Ali has £15 more. Ali’s 3 extra parts are worth £15, so one part is £5: Ali has £25 and Ben £10.'),
  'maths.equations-2': { kind: 'flow', steps: ['5x + 2 = 2x + 14', 'Take 2x from both sides: 3x + 2 = 14', 'Take 2 from both sides: 3x = 12', 'Divide both sides by 3: x = 4'], caption: 'Move the smaller x term first, then solve as usual.' },
  'maths.frac-mixed': M({ type: 'barmodel', rows: [1, 2, 3].map((k) => ({ label: `whole ${k}`, parts: 4, text: '¼' })) }, '3 ÷ ¼ asks “how many quarters fit into 3?” Four in each whole, so 12. Keep, change, flip: 3 × 4 = 12.'),
  'maths.circles': { kind: 'table', head: ['part', 'what it is', 'formula'], rows: [['radius (r)', 'centre to edge', ''], ['diameter (d)', 'edge to edge through the centre', 'd = 2r'], ['circumference (C)', 'all the way round', '**C = πd**'], ['area (A)', 'the space inside', '**A = πr²**']], caption: 'π ≈ 3.14. A circle with radius 5 cm has diameter 10 cm, so C = π × 10 ≈ 31.4 cm.' },
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = TOPICS.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = t.visual ? [].concat(t.visual, v) : v; }

export default [{ subject: 'maths', deck: 'stretch', topics: TOPICS, items }];

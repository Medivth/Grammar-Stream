// Year 8 "school focus": the ten areas from her maths report, folded in as a front-page module
// (course config `bonus`, id 'focus'), red ones first, then amber, then green. Each part is an
// ordinary skill topic with generated practice (js/gen/y8focus.js, plus the main course's own
// generators where they already fit). Its reviews come back in her daily sessions afterwards.

const T = (id, title, gens, extra) => ({ id: `maths.focus-${id}`, title, kind: 'skill', prereqs: [], bonus: 'focus', gens, ...extra });
const M = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });

const TOPICS = [
  // red
  T('pythag', 'Pythagoras: problem solving', ['y8fPythagPS'], {
    intro: 'Pythagoras’ theorem is easy once the triangle is drawn: the hard part of a problem is spotting the right-angled triangle hidden in a ladder, a field, a walk or a box, and deciding whether to add or subtract. Always sketch it, label the hypotenuse, then calculate.',
    teach: 'Explain how you decide whether to add or subtract the squares, using a ladder against a wall as your example.',
    talk: 'Find right angles at home: a door, a bookcase, a screen. Ask her to estimate a diagonal, then work it out from the width and height.',
    hook: '**Sketch, label, decide**: find the right angle, mark the hypotenuse (opposite it, the longest side), then **finding the longest side? add; finding a shorter side? subtract**.',
    visual: M({ type: 'righttri', left: 'wall', bottom: 'ground', hyp: 'ladder' }, 'A ladder against a wall: the ladder is the hypotenuse. Height² = ladder² − ground².'),
  }),
  T('reverse', 'Reverse percentages', ['y8fReversePct'], {
    intro: 'In a reverse percentage problem you know the amount AFTER a percentage change and need the amount BEFORE. The trap is taking the percentage of the new amount. Instead, the new amount is a known percentage of the original (80% after 20% off, 120% after a 20% rise), so divide by the multiplier.',
    teach: 'Explain why £80 after 20% off was not £96 before, and how to find the real original price.',
    talk: 'In a shop or online, look at a sale price and ask her what the price was before the discount.',
    hook: '**After → before: DIVIDE by the multiplier.** 20% off means × 0.8, so undo it with ÷ 0.8. Never take the percentage of the new price.',
    visual: M({ type: 'barmodel', total: '100% = original', rows: [{ label: 'original', parts: 5, text: '20%' }, { label: 'sale', parts: 5, shaded: 4, text: '20%', total: '80% = £48' }] }, '£48 is 4 of the 5 boxes (80%), so one box is £12 and the original is 5 × £12 = £60. In one step: £48 ÷ 0.8 = £60.'),
  }),
  // amber
  T('linear', 'Drawing linear graphs and parallel lines', ['y8fLinearGraphs'], {
    intro: 'To draw a straight-line graph, make a table of values (choose three x-values, work out y), plot the points and join them with a ruler. Parallel lines have the same gradient. Lines like x = 3 are vertical and y = 3 horizontal.',
    teach: 'Explain how you would draw y = 2x − 1 from scratch, and how to tell which other lines are parallel to it.',
    talk: 'Ask her to draw y = x + 1 and y = x − 2 on squared paper and say what she notices.',
    hook: '**Same m, parallel.** A table of three points: if they are not in a straight line, one is wrong. **x = number is vertical; y = number is horizontal.**',
    visual: M({ type: 'graph', range: [-5, 5], lines: [{ m: 2, c: 1 }, { m: 2, c: -3 }] }, 'y = 2x + 1 and y = 2x − 3: both have gradient 2, so they are parallel. Only the y-intercept is different.'),
  }),
  T('gradient', 'Gradient and y-intercept', ['y8fGradient', 'y8mGraphs'], {
    intro: 'In y = mx + c, m is the gradient (how steep: how far up for each 1 across) and c is the y-intercept (where it crosses the y-axis). Get y on its own first. From two points, gradient = change in y ÷ change in x.',
    teach: 'Explain what the 3 and the −2 mean in y = 3x − 2, and how to find the gradient between two points.',
    talk: 'A phone contract costs £10 a month plus £5 to start. Ask her to write it as y = mx + c and say what m and c mean.',
    hook: '**m = mountain** (how steep), **c = crossing** (where it crosses the y-axis). Gradient = **up ÷ across** (rise over run).',
    visual: M({ type: 'graph', range: [-5, 5], lines: [{ m: 0.5, c: -1 }] }, 'y = ½x − 1: it crosses the y-axis at −1, and goes up 1 for every 2 across, so the gradient is ½.'),
  }),
  T('estimate', 'Estimation', ['y8fEstimate', 'y8nEstimate'], {
    intro: 'Estimate by rounding every number to 1 significant figure, then calculate in your head. Estimates check calculator answers: if they are wildly different, something went wrong. Dividing by a number less than 1 makes the answer bigger.',
    teach: 'Explain how to estimate 38.7 ÷ 0.48, and why the answer is bigger than 38.7.',
    talk: 'At the supermarket, ask her to estimate the total of three items before you reach the till.',
    hook: '**1 s.f. first, then calculate.** Dividing by 0.5 is the same as doubling.',
  }),
  T('symmetry', 'Lines of symmetry', ['y8fSymmetry'], {
    intro: 'A line of symmetry is a fold line where both halves match exactly. Rotational symmetry counts how many times a shape fits onto itself in one full turn. A regular polygon has as many lines of symmetry as sides. Reflections use a mirror line: each point ends up the same distance away on the other side.',
    teach: 'Explain why a rectangle has 2 lines of symmetry and not 4, and why a parallelogram has none.',
    talk: 'Fold paper shapes together: a rectangle along its diagonal, a square, a kite. Which folds match?',
    hook: '**Fold test**: if the halves do not match exactly, it is not a line of symmetry. A rectangle’s diagonals are NOT lines of symmetry. **Regular n-gon: n lines, order n.**',
    visual: M({ type: 'polygon', sides: 6, numbered: false, name: 'Regular hexagon' }, 'A regular hexagon has 6 lines of symmetry (3 through opposite corners, 3 through the middles of opposite sides) and rotational symmetry of order 6.'),
  }),
  T('equations', 'Solving equations', ['y8mEquations', 'y8nEqFrac'], {
    intro: 'Solve an equation by doing the same to both sides until x is alone: undo + and − first, then × and ÷. With brackets, expand first; with x on both sides, move the smaller x term; with fractions, multiply through. Always check by substituting your answer back.',
    teach: 'Explain how to solve 5(x − 2) = 3(x + 4), step by step, and how to check your answer.',
    talk: 'Play “think of a number”: she sets you a puzzle (“I double it and add 7 and get 31”), and you write and solve the equation.',
    hook: '**Balance**: whatever you do to one side, do to the other. **Check by substituting**: both sides must come out equal.',
    visual: { kind: 'flow', steps: ['5(x − 2) = 3(x + 4)', 'Expand: 5x − 10 = 3x + 12', 'Subtract 3x: 2x − 10 = 12', 'Add 10: 2x = 22', 'Divide by 2: x = 11'], caption: 'Check: 5 × 9 = 45 and 3 × 15 = 45. ✓' },
  }),
  T('calculator', 'Using a calculator', ['y8fCalculator'], {
    intro: 'A scientific calculator follows the order of operations, so you must add brackets round the top and bottom of a fraction. Then read the display carefully: money needs two decimal places, 0.5 hours is 30 minutes, E means × 10 to a power, and real answers sometimes need rounding up (you cannot hire 7.2 coaches).',
    teach: 'Explain how to type (23.4 + 8.9) ÷ (5.2 − 1.7) into a calculator, and why −3² gives −9.',
    talk: 'Ask her to work out the cost per item of a multipack on a calculator, and to round it sensibly.',
    hook: '**Bracket the top, bracket the bottom.** Then: does the answer make sense? Estimate to check.',
  }),
  // green
  T('triangles', 'Angles in triangles', ['y8fTriangles'], {
    intro: 'The angles in any triangle add up to 180°. In an isosceles triangle the two base angles are equal; in an equilateral triangle every angle is 60°. An exterior angle equals the sum of the two interior angles opposite it.',
    teach: 'Explain why an exterior angle of a triangle equals the two opposite interior angles added together.',
    talk: 'Ask her to tear the three corners off a paper triangle and put them together on a straight line.',
    hook: '**Triangle 180, straight line 180, round a point 360.** Isosceles: **two equal sides, two equal angles**.',
  }),
  T('fractions', 'Fraction calculations', ['y8mFractions'], {
    intro: 'Add and subtract fractions with a common denominator. Multiply tops and bottoms. To divide, flip the second fraction and multiply. Turn mixed numbers into improper fractions first, and simplify at the end.',
    teach: 'Explain how to work out 2⅓ ÷ ¾, and why dividing by a fraction can make a number bigger.',
    talk: 'Halve or scale up a recipe together, using the fractions in it.',
    hook: '**Add/subtract: same bottom. Multiply: straight across. Divide: Keep, Change, Flip.**',
  }),
];

const items = TOPICS.flatMap((t) => t.gens.map((gen, i) => ({ id: `${t.id}.tmpl${i ? i + 1 : ''}`, topic: t.id, kind: 'template', gen, levels: [1, 2, 3], seed: [-1, 0, 1] })));

export default [{ subject: 'maths', deck: 'y8-focus', topics: TOPICS.map(({ gens, ...t }) => t), items }];

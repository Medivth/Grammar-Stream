// Year 2 maths, part 3: greater depth. Reading scales between the marks, deducing new ×/÷ facts,
// balancing number sentences, thinking problems with bar models, multi-step "which is more?",
// time to 5 minutes, and comparing shapes. Core Year 2 topics that unlock after the basics.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });

const TOPICS = [
  T('scales-2', 'Tricky scales: reading between the marks', 'k2Scales', ['scales'], { intro: 'On real scales most marks have no number. Work out what each mark is worth first, then count. If the arrow is between two marks, make a sensible estimate.', teach: 'Explain how you worked out what each mark is worth on a scale numbered 0, 100, 200 with 5 jumps between the numbers.', talk: 'Read the kitchen scales or a measuring jug together. Ask {him} what each little mark is worth.' }),
  T('tables-deduce', 'Using 2, 5 and 10 facts to find new ones', 'k2Deduce', ['times', 'doubles'], { intro: 'If you know your 2, 5 and 10 times tables, you can work out lots more. 5 × 12 is 5 × 10 and 5 × 2. 5 × 8 is half of 10 × 8!', teach: 'Explain how knowing 10 × 14 = 140 helps you work out 5 × 14.', talk: 'Ask {him}: “If 6 × 5 = 30, what is 12 × 5? How do you know?”' }),
  T('balance', 'Balancing number sentences', 'k2Balance', ['addsub', 'factfamilies'], { intro: 'The = sign means “is the same as”, like a balance. Both sides must make the same amount. Look at how the numbers change, and you often don’t need to work out the total.', teach: 'Explain how you know 45 + 38 = 40 + 43 without adding.', talk: 'Ask {him} to make up a balancing puzzle, like 10 + 6 = 12 + ?' }),
  T('think-problems', 'Thinking problems: totals and differences', 'k2Think', ['problems', 'doubles'], { intro: 'Draw it! A bar for each person, with the extra bit marked, shows what to do. Take away the extra, and the rest splits into equal bars.', teach: 'Explain how drawing bars helps you solve: “Together Jack and Sam have £14. Jack has £2 more than Sam. How much does Sam have?”', talk: 'Share 14 sweets so one person has 2 more. Ask {him} how {she} worked it out.' }),
  T('which-more', 'Which is more? Multi-step problems', 'k2WhichMore', ['times', 'problems'], { intro: 'Some problems need two or three steps. Work out each amount first, then compare. Don’t trust your first guess: more packets does not always mean more biscuits!', teach: 'Explain which has more biscuits, 4 packets of 5 or 3 packets of 10, and how you know.', talk: 'At the shop, ask {him} which is cheaper: one big packet or two small ones.' }),
  T('clock-5', 'Time to 5 minutes', 'k2Clock5', ['time'], { intro: 'Every number on the clock is 5 minutes for the long hand. When the long hand is on the right side, it is “past” the hour; on the left side it is “to” the next hour.', teach: 'Explain why 3:40 is “twenty to 4”.', talk: 'Ask {him} the time on an analogue clock at different times of day, and how long until the next meal.' }),
  { id: 'maths.shape-compare', title: 'Same and different: comparing shapes', kind: 'facts', prereqs: ['maths.shapes'], batch: 4, intro: 'Mathematicians compare shapes: what is the same, and what is different? Count faces, edges and vertices, check the sides, and look for lines of symmetry.', teach: 'Explain what is the same and what is different about a cube and a cuboid.', talk: 'Find two boxes at home. Ask {him} what is the same and what is different about them.' },
];

const C = 'shape-compare';
const items = [
  ...TOPICS.filter((t) => t.gen).map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1] })),
  // 3-D: cube and cuboid
  mcq('sc.cube1', C, 'A cube and a cuboid. What is the SAME about them?', [['They both have 6 faces, 12 edges and 8 vertices', true], ['All of their edges are exactly the same length', false, 'Only the cube’s edges are all the same length. A cuboid can be long and thin.'], ['All of their faces are squares, like a dice', false, 'A cube’s faces are all squares, but a cuboid can have rectangle faces.'], ['They both have 8 faces, 12 edges and 6 vertices', false, 'Count again: faces and vertices are swapped. Both have 6 faces and 8 vertices.']], 'Count them: both have 6 faces, 12 edges and 8 vertices. What can be different is how long their edges are: a cube’s length, width and height are all the same.'),
  mcq('sc.cube2', C, 'What is DIFFERENT about a cube and a cuboid?', [['A cube’s faces are all squares; a cuboid’s can be rectangles', true], ['A cuboid has more faces and edges than a cube does', false, 'Both have 6 faces and 12 edges.'], ['A cube has more vertices, because it is taller', false, 'Both have 8 vertices: 4 on the top and 4 on the bottom.']], 'They have the same number of faces, edges and vertices. But a cube’s faces are all squares, because its length, width and height are all the same. A cuboid’s faces can be rectangles: it can be longer one way than another.'),
  fact('sc.cuboid-edges', C, 'How many edges does a cuboid have?', '12', ['6', '8', '10'], 'The same as a cube: 4 round the top, 4 round the bottom and 4 going up.'),
  fact('sc.cuboid-vertices', C, 'How many vertices (corners) does a cuboid have?', '8', ['6', '12', '4'], 'The same as a cube: 4 on the top and 4 on the bottom.'),
  mcq('sc.cube-is', C, 'Turbo says: “A cube is a special kind of cuboid.” Is he right?', [['Yes: it is a cuboid whose faces are all squares', true], ['No: a cuboid’s faces must be rectangles', false, 'A square is a special rectangle, with all 4 sides equal. So a cube still counts as a cuboid.'], ['No: a cube has more edges', false, 'Both have 12 edges.']], 'A cuboid has 6 rectangle faces. A square is a special rectangle, so a cube (6 square faces) is a special cuboid.'),
  // 2-D: square and rectangle, symmetry
  mcq('sc.sq-rect', C, 'What do a square and a rectangle BOTH have?', [['4 sides and 4 right angles', true], ['4 equal sides', false, 'Only the square has to have 4 equal sides. A rectangle can have 2 long sides and 2 short sides.'], ['4 lines of symmetry', false, 'A square has 4 lines of symmetry, but a rectangle (that is not a square) has only 2.']], 'Both have 4 sides and 4 right angles. A square has all 4 sides equal; a rectangle can have 2 long and 2 short sides.'),
  fact('sc.rect-lines', C, 'How many lines of symmetry does a rectangle have (one that is not a square)?', '2', ['4', '1', '0'], 'One down the middle and one across the middle. The diagonals are not lines of symmetry: fold along one and the corners do not match.', { feedback: { 4: 'A square has 4. Fold this rectangle along a diagonal and the corners do not meet.' } }),
  mcq('sc.one-line', C, 'Which shape has exactly ONE line of symmetry?', [['a kite', true], ['a square', false, 'A square has 4 lines of symmetry.'], ['a rectangle', false, 'A rectangle has 2 lines of symmetry.'], ['a circle', false, 'A circle has lots and lots: any line through the middle.']], 'A kite folds exactly in half only down the middle, from its top point to its bottom point.'),
  mcq('sc.iso-kite', C, 'An isosceles triangle (exactly 2 equal sides) and a kite. What is the SAME about them?', [['They both have exactly one line of symmetry', true], ['They both have exactly 4 sides and 4 vertices', false, 'The kite has 4 sides and 4 vertices, but a triangle has 3 of each.'], ['They both have exactly 2 lines of symmetry', false, 'Each one folds in half only down the middle: 1 line of symmetry each.']], 'Each one folds exactly in half down the middle, and nowhere else: one line of symmetry each.'),
  mcq('sc.semi', C, 'Which has only ONE line of symmetry: a semicircle or a circle?', [['a semicircle', true], ['a circle', false, 'A circle can be folded in half along any line through its middle: it has lots of lines of symmetry.'], ['They both have one', false, 'A circle has lots of lines of symmetry. Only the semicircle has just one.']], 'A semicircle only folds in half down the middle. A circle folds in half along any line through its centre.'),
  fact('sc.letter-a', C, 'How many lines of symmetry does the capital letter A have?', '1', ['2', '0', '3'], 'One, straight down the middle. The two sloping sides match when you fold it.'),
  mcq('sc.letters', C, 'The letter A has exactly one line of symmetry. Which of these letters ALSO has exactly one?', [['T', true], ['H', false, 'H has 2 lines of symmetry: one down and one across.'], ['F', false, 'F has no line of symmetry: it does not match when folded.'], ['N', false, 'N has no line of symmetry. It looks the same upside down, but that is not a fold.']], 'T folds in half straight down the middle, just like A.'),
  mcq('sc.tri-one', C, 'Which triangle has exactly ONE line of symmetry?', [['a triangle with exactly 2 equal sides', true], ['a triangle with all 3 sides equal', false, 'A triangle with 3 equal sides (equilateral) has 3 lines of symmetry.'], ['a triangle with no sides the same length', false, 'A triangle with no equal sides has no line of symmetry.']], 'A triangle with exactly 2 equal sides is called isosceles. It folds in half down the middle, between its 2 equal sides.'),
  mcq('sc.more-lines', C, 'Which shape has MORE than one line of symmetry?', [['a rectangle', true], ['a kite', false, 'A kite has just 1 line of symmetry.'], ['a semicircle', false, 'A semicircle has just 1 line of symmetry.'], ['an isosceles triangle', false, 'An isosceles triangle has just 1 line of symmetry.']], 'A rectangle has 2: down the middle and across the middle. The others have just 1.'),
  // pyramid and prism; cone, cylinder and sphere
  fact('sc.pyr-faces', C, 'How many faces does a square-based pyramid have?', '5', ['4', '6', '8'], '1 square on the bottom and 4 triangles: 5 faces.'),
  fact('sc.prism-faces', C, 'How many faces does a triangular prism have?', '5', ['3', '6', '9'], '2 triangles at the ends and 3 rectangles: 5 faces.'),
  mcq('sc.pyr-prism', C, 'A square-based pyramid and a triangular prism both have 5 faces. What else is the SAME?', [['All their faces are flat', true], ['They both have 8 edges', false, 'The pyramid has 8 edges, but the prism has 9.'], ['They both have 6 vertices', false, 'The prism has 6 vertices, but the pyramid has 5.']], 'Both have only flat faces. But the pyramid has 8 edges and 5 vertices, and the prism has 9 edges and 6 vertices.'),
  mcq('sc.pyr-diff', C, 'What is DIFFERENT about a square-based pyramid and a triangular prism?', [['Only the pyramid comes to a point (an apex)', true], ['Only the prism has triangle faces on it', false, 'The pyramid has 4 triangle faces too.'], ['Only the prism has a curved surface', false, 'Neither has a curved surface: all their faces are flat.'], ['Only the pyramid has rectangle faces', false, 'The prism has 3 rectangle faces, so the pyramid is not the only one.']], 'A pyramid’s triangle faces meet at a point (an apex) at the top. A prism is the same shape all the way along: a triangle at each end, joined by rectangles.'),
  mcq('sc.cone-cyl', C, 'What do a cone and a cylinder BOTH have?', [['A circle face and a curved surface', true], ['Two circle faces', false, 'Only the cylinder has two circle faces. A cone has one.'], ['A point at the top (an apex)', false, 'Only the cone has an apex.']], 'A cone has 1 circle face, a curved surface and a point. A cylinder has 2 circle faces and a curved surface.'),
  mcq('sc.cone-diff', C, 'What is DIFFERENT about a cone and a cylinder?', [['A cone has 1 circle face; a cylinder has 2', true], ['A cylinder has no curved surface at all', false, 'A cylinder has a curved surface all the way round, like a tin of beans.'], ['A cone cannot roll, but a cylinder can', false, 'Both can roll on their curved surface.']], 'Both have a curved surface. The cone has 1 circle face and comes to a point; the cylinder has a circle face at each end.'),
  mcq('sc.sph-cyl', C, 'What do a sphere and a cylinder BOTH have?', [['A curved surface, so they can roll', true], ['Flat circle faces at both ends', false, 'A cylinder has 2 flat circle faces, but a sphere has none: it is curved all over.'], ['Vertices where their edges meet', false, 'Neither has a vertex (corner).']], 'Both have a curved surface. A sphere is curved all over; a cylinder also has 2 flat circle faces.'),
  mcq('sc.cube-pyr', C, 'A cube and a square-based pyramid both have a square face. What is DIFFERENT?', [['A cube has 6 faces; the pyramid has 5', true], ['The pyramid has more vertices', false, 'The pyramid has 5 vertices and the cube has 8: the pyramid has fewer.'], ['The cube has triangle faces', false, 'A cube’s faces are all squares. The pyramid has the triangle faces.']], 'A cube has 6 square faces, 12 edges and 8 vertices. A square-based pyramid has 5 faces (1 square, 4 triangles), 8 edges and 5 vertices.'),
];

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const M = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });
const seg = (v, text = String(v), more = {}) => ({ v, text, ...more });
const TOPIC_VISUALS = {
  'maths.scales-2': [
    M({ type: 'numline', min: 0, max: 50, step: 2, labels: [0, 10, 20, 30, 40, 50], mark: 34 }, '5 jumps from 0 to 10, so each mark is worth 2. The arrow is 2 marks after 30: 34.'),
    M({ type: 'numline', min: 0, max: 100, step: 10, labels: [0, 50, 100], mark: 35 }, 'Each mark is worth 10. This arrow is halfway between 30 and 40: about 35.'),
  ],
  'maths.tables-deduce': M({ type: 'barmodel', total: '60', rows: [{ label: '5 × 12', segs: [seg(50, '5 × 10 = 50'), seg(10, '10', { shaded: true })] }] }, '5 × 12 is 5 × 10 and 5 × 2: 50 + 10 = 60.'),
  'maths.balance': M({ type: 'barmodel', total: '46', rows: [{ label: 'left', segs: [seg(29), seg(17)] }, { label: 'right', segs: [seg(15), seg(4), seg(27, '?', { shaded: true })] }] }, '29 + 17 = 15 + 4 + ?  Both sides make 46. 15 + 4 = 19, which is 10 less than 29, so ? is 10 more than 17: 27.'),
  'maths.think-problems': M({ type: 'barmodel', side: '£14', rows: [{ label: 'Jack', segs: [seg(6, '£6'), seg(2, '£2', { mark: true })] }, { label: 'Sam', segs: [seg(6, '£6')] }] }, 'Take away Jack’s extra £2: £14 − £2 = £12. Two equal bars: £12 ÷ 2 = £6. Sam has £6 and Jack has £8.'),
  'maths.which-more': M({ type: 'barmodel', rows: [{ label: '4 × 5', segs: Array.from({ length: 4 }, () => seg(5)) }, { label: '3 × 10', segs: Array.from({ length: 3 }, () => seg(10)) }] }, '4 packets of 5 = 20 biscuits. 3 packets of 10 = 30 biscuits. Fewer packets, but more biscuits!'),
  'maths.clock-5': [M({ type: 'clock', h: 3, m: 40 }, '3:40. The long hand is on 8: 4 jumps of 5 before 12, so it is twenty to 4.')],
  'maths.shape-compare': [M({ type: 'solid', shape: 'cube' }, 'A cube: 6 square faces, 12 edges, 8 vertices.'), M({ type: 'solid', shape: 'cuboid' }, 'A cuboid: also 6 faces, 12 edges, 8 vertices, but its faces can be rectangles.')],
};
const flat = (shapes, caption) => M({ type: 'flat', shapes, lines: true }, caption);
const both = (a, b, ca, cb) => [M({ type: 'solid', shape: a }, ca), M({ type: 'solid', shape: b }, cb)];
const CUBE_CUBOID = both('cube', 'cuboid', 'Cube: 6 faces, 12 edges, 8 vertices. All edges equal.', 'Cuboid: 6 faces, 12 edges, 8 vertices. Faces can be rectangles.');
const PYR_PRISM = both('pyramid', 'prism', 'Square-based pyramid: 5 faces, 8 edges, 5 vertices.', 'Triangular prism: 5 faces, 9 edges, 6 vertices.');
const CONE_CYL = both('cone', 'cylinder', 'Cone: 1 circle face, a curved surface and a point (apex).', 'Cylinder: 2 circle faces and a curved surface.');
const ITEM_VISUALS = {
  'maths.sc.cube1': CUBE_CUBOID,
  'maths.sc.cube2': CUBE_CUBOID,
  'maths.sc.cuboid-edges': M({ type: 'solid', shape: 'cuboid' }, '4 edges round the top, 4 round the bottom, 4 going up: 12.'),
  'maths.sc.cuboid-vertices': M({ type: 'solid', shape: 'cuboid' }, '4 vertices on the top and 4 on the bottom: 8.'),
  'maths.sc.cube-is': CUBE_CUBOID,
  'maths.sc.sq-rect': flat(['square', 'rectangle'], 'Dashed red lines are lines of symmetry: 4 for the square, 2 for the rectangle.'),
  'maths.sc.rect-lines': flat(['rectangle'], 'Down the middle and across the middle: 2 lines of symmetry.'),
  'maths.sc.one-line': flat(['kite', 'rectangle'], 'The kite has 1 line of symmetry. The rectangle has 2.'),
  'maths.sc.iso-kite': flat(['isosceles', 'kite'], 'Each has exactly 1 line of symmetry, straight down the middle.'),
  'maths.sc.semi': flat(['semicircle', 'circle'], 'A semicircle has 1 line of symmetry. A circle has lots: any line through its centre.'),
  'maths.sc.letter-a': flat(['letterA'], 'Fold the A down the middle and the two sides match.'),
  'maths.sc.letters': flat(['letterT', 'letterH', 'letterF'], 'T has 1 line of symmetry, like A. H has 2. F has none.'),
  'maths.sc.tri-one': flat(['isosceles', 'equilateral', 'scalene'], 'Isosceles: 1 line. Equilateral: 3 lines. A triangle with no equal sides: none.'),
  'maths.sc.more-lines': flat(['rectangle', 'kite'], 'The rectangle has 2 lines of symmetry; the kite has 1.'),
  'maths.sc.pyr-faces': M({ type: 'solid', shape: 'pyramid' }, '1 square face on the bottom and 4 triangle faces: 5.'),
  'maths.sc.prism-faces': M({ type: 'solid', shape: 'prism' }, '2 triangle faces at the ends and 3 rectangle faces: 5.'),
  'maths.sc.pyr-prism': PYR_PRISM,
  'maths.sc.pyr-diff': PYR_PRISM,
  'maths.sc.cone-cyl': CONE_CYL,
  'maths.sc.cone-diff': CONE_CYL,
  'maths.sc.sph-cyl': both('sphere', 'cylinder', 'Sphere: one curved surface, no flat faces.', 'Cylinder: 2 circle faces and a curved surface.'),
  'maths.sc.cube-pyr': both('cube', 'pyramid', 'Cube: 6 faces, 12 edges, 8 vertices.', 'Square-based pyramid: 5 faces, 8 edges, 5 vertices.'),
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = TOPICS.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{
  subject: 'maths', deck: 'depth',
  topics: TOPICS.map(({ gen, ...t }) => ({ kind: gen ? 'skill' : 'facts', ...t })),
  items,
}];

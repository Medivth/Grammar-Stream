// Maths content source: a prerequisite graph of procedural topics, each backed by a
// generator in js/gen/maths.js, plus key facts. Levels: 1 ≈ secure Year 6,
// 2 ≈ greater depth / early Year 7, 3 ≈ Year 7 grammar-school stretch.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });

const TOPICS = [
  T('place-value', 'Decimals and place value', 'placeValueDecimals', [], { hook: 'Each place is worth ten times the place to its right: hundreds, tens, ones . tenths, hundredths, thousandths.', teach: 'Explain why 0.4 is bigger than 0.35 even though it has fewer digits.', talk: 'Ask her which is bigger, 0.5 or 0.45, and why.' }),
  T('negatives', 'Negative numbers', 'negatives', [], { hook: 'Below zero, the bigger the number after the minus sign, the colder it is: −8 is less than −3.', teach: 'Explain what subtracting a negative number does.', talk: 'If it is −3°C and gets 5 degrees warmer, what is the temperature?' }),
  T('frac-line', 'Fractions on a number line', 'fracNumberLine', [], { hook: 'The denominator is down: it says how many equal parts; the numerator on top counts how many you take.', teach: 'Explain how you find where 3/4 goes on a number line.', talk: 'Ask her where 5/4 goes on a ruler that is 2 long.' }),
  T('frac-compare', 'Comparing fractions', 'fracCompare', ['frac-line'], { hook: 'The bigger the denominator, the smaller the slice: 1/8 of a pizza is less than 1/5.', teach: 'Explain why 1/8 is smaller than 1/5.', talk: 'Would she rather have 2/3 or 3/5 of a pizza? Why?' }),
  T('frac-equiv', 'Equivalent fractions and simplifying', 'fracEquivalent', ['frac-compare'], { hook: 'Whatever you do to the top, do to the bottom.', teach: 'Explain how you simplify a fraction.', talk: 'Ask her to simplify 12/16 in her head.' }),
  T('frac-addsub', 'Adding and subtracting fractions', 'fracAddSub', ['frac-equiv'], { hook: 'Same bottoms first: only add slices of the same size, then add the tops. Never add the denominators.', teach: 'Explain why you can’t just add the denominators.', talk: 'What is 1/2 + 1/3? (Not 2/5!)' }),
  T('frac-multiply', 'Multiplying and dividing fractions', 'fracMultiply', ['frac-equiv'], { hook: 'Multiply the tops, multiply the bottoms. To divide: keep it, change it, flip it.', teach: 'Explain why multiplying by a fraction smaller than 1 makes a number smaller.', talk: 'What is half of a quarter?' }),
  T('frac-amount', 'Fractions of amounts', 'fracOfAmount', ['frac-equiv'], { hook: 'Divide by the bottom, times by the top.', teach: 'Explain how to find 3/5 of 40.', talk: 'Ask her to find 3/4 of the bill when you next shop.' }),
  T('fdp', 'Fractions, decimals and percentages', 'fdp', ['frac-equiv', 'place-value'], { hook: 'Per cent means “out of 100” (cent = 100, as in century).', teach: 'Explain how to turn 3/5 into a percentage.', talk: 'Which is better: 30% off or a third off?' }),
  T('percent', 'Percentages of amounts', 'percentOf', ['fdp'], { hook: 'Find 10% first (divide by 10), then build: 5% is half of it, 20% is double it.', teach: 'Explain a quick way to find 15% of something.', talk: 'Ask her to work out a 10% tip, then 15%.' }),
  T('order-ops', 'Order of operations', 'orderOps', [], { hook: 'BIDMAS: Brackets, Indices, Division and Multiplication, Addition and Subtraction.', teach: 'Explain why 3 + 4 × 2 is 11, not 14.', talk: 'Ask her what 10 − 2 × 3 is.' }),
  T('substitute', 'Algebra: substitution', 'algebraSubstitute', ['order-ops'], { hook: '3a means 3 × a: swap the letter for its number, then use BIDMAS.', teach: 'Explain what 3a means if a = 5.', talk: 'If a = 4, is 2a the same as 24?' }),
  T('sequences', 'Sequences and the nth term', 'sequences', ['negatives'], { hook: 'The difference is the times table: 3, 5, 7, 9… goes up in 2s, so the nth term is 2n + 1.', teach: 'Explain the difference between the term-to-term rule and the nth term.', talk: 'What is the 100th term of 3, 5, 7, 9…?' }),
  T('equations', 'Solving equations', 'equations', ['substitute'], { hook: 'Keep the scales balanced: whatever you do to one side, do to the other.', teach: 'Explain how you solve 3x + 5 = 20.', talk: 'I think of a number, double it and add 3. I get 17. What was my number?' }),
  T('ratio', 'Ratio and sharing', 'ratioShare', ['frac-amount'], { hook: 'Add the parts, find one part, then multiply: 3 : 5 means 8 parts in all.', teach: 'Explain how to share £40 in the ratio 3 : 5.', talk: 'Share 12 sweets between you in the ratio 1 : 2.' }),
  T('primes', 'Factors, multiples and primes', 'factorsPrimes', [], { hook: 'A prime has exactly two factors, 1 and itself. So 1 isn’t prime, and 2 is the only even prime.', teach: 'Explain why 51 is not a prime number.', talk: 'Is 91 prime? (Try 7.)' }),
  T('angles', 'Angle facts', 'angles', [], { hook: 'Straight line 180°, round a point 360°, triangle 180°, quadrilateral 360°.', teach: 'Explain how you find a missing angle in a triangle.', talk: 'Ask her what the angles in a triangle add up to.' }),
  // written methods, measures, geometry and data (Year 6 statutory, stretching into Year 7)
  T('long-mult', 'Long multiplication', 'longMult', ['place-value'], { hook: 'Split one number into tens and ones, multiply each part, then add. Don’t forget the place-holder zero!', teach: 'Explain how you work out 34 × 26 by splitting one of the numbers.', talk: 'Ask her for 23 × 4 in her head, then 23 × 40.' }),
  T('long-div', 'Long division and remainders', 'longDiv', ['long-mult'], { hook: 'Dad, Mum, Sister, Brother: Divide, Multiply, Subtract, Bring down.', teach: 'Explain when a remainder means you round UP and when it means you round down.', talk: '7 friends share 50 sweets. How many each, and how many left?' }),
  T('area', 'Area and perimeter', 'areaPerimeter', [], { hook: 'Area covers the inside (squares, cm²); perimeter is the fence around the edge (cm).', teach: 'Explain the difference between area and perimeter, and why a triangle’s area is half base times height.', talk: 'Guess the area of the kitchen table, then measure it.' }),
  T('volume', 'Volume of cuboids', 'volume', ['area'], { hook: 'Volume = length × width × height: how many cubes fill the box.', teach: 'Explain how to find the volume of a shoebox.', talk: 'How many 1 cm cubes would fit in a 10 cm cube?' }),
  T('coordinates', 'Coordinates in four quadrants', 'coordinates', ['negatives'], { hook: 'Along the corridor, then up the stairs: x first, then y.', teach: 'Explain what happens to a point’s coordinates when you reflect it in the x-axis.', talk: 'Play a quick game of Battleships with negative coordinates.' }),
  T('units', 'Converting units', 'units', ['place-value'], { hook: 'Kangaroos Hop Down Mountains Drinking Chocolate Milk: kilo, hecto, deca, metre, deci, centi, milli.', teach: 'Explain how you change 2.3 km into metres, and why you multiply.', talk: 'How many millilitres in the bottle in the fridge? How many litres is that?' }),
  T('time', 'Time and timetables', 'time', [], { hook: 'From 1 pm onwards, add 12 for the 24-hour clock: 3 pm is 15:00. (12:30 pm stays 12:30.)', teach: 'Explain how you work out how long it is from 09:45 to 11:20.', talk: 'Next time you catch a bus or train, ask her to plan it from the timetable.' }),
  T('word-problems', 'Multi-step money problems', 'wordProblems', ['long-div', 'frac-amount'], { hook: 'RUCSAC: Read, Understand, Choose, Solve, Answer, Check.', teach: 'Explain how you decide what to work out first in a two-step problem.', talk: 'At the shop: three of these and a £10 note, what’s the change?' }),
  T('probability', 'Probability', 'probability', ['frac-equiv'], { hook: 'From 0 (impossible) to 1 (certain). The chance it does NOT happen = 1 − the chance it does.', teach: 'Explain why the probability of an event and its opposite add up to 1.', talk: 'Roll a dice 30 times together and compare the number of 6s with what she expected.' }),
  T('charts', 'Bar charts, pie charts and line graphs', 'charts', ['frac-amount', 'angles'], { hook: 'A pie chart is a full turn: 360° shared out between the data.', teach: 'Explain why a pie chart sector of 90° is a quarter of the data.', talk: 'Find a chart in the news and ask her what it shows.' }),
];

// Memory hooks and real-world examples for each topic's question generator (shown with worked examples).
const TMPL_MEMORY = {
  'place-value': { hook: 'Fill empty places with zeros to compare: 0.4 = 0.40, which beats 0.35.', example: 'Money: £0.40 is 40p and £0.35 is 35p, so 0.4 is bigger even though it has fewer digits.' },
  negatives: { hook: 'Subtracting a negative is adding: 5 − (−3) = 5 + 3 = 8.', example: 'Lift buttons: from floor −2 (the car park) go up 5 floors and you reach floor 3. A thermometer works the same way.' },
  'frac-line': { example: 'A fuel gauge: the needle at 3/4 means the tank is three quarters full.' },
  'frac-compare': { example: 'Would you rather share a pizza between 5 people or 8? Each 1/5 is a bigger slice than each 1/8.' },
  'frac-equiv': { example: 'Half a dozen eggs is 6 out of 12: 6/12 = 1/2, the same amount with a different name.' },
  'frac-addsub': { example: 'Half a pizza plus a third of a pizza: cut both into sixths, 3/6 + 2/6 = 5/6.' },
  'frac-multiply': { hook: '“Of” means ×: half of a quarter = 1/2 × 1/4 = 1/8.', example: 'Half of a quarter of a cake is an eighth of the cake.' },
  'frac-amount': { example: '3/4 of a £20 note: £20 ÷ 4 = £5, then × 3 = £15.' },
  fdp: { hook: 'To make a percentage, make the bottom 100: 3/5 = 60/100 = 60%.', example: 'A phone battery showing 50% is half full; 25% is a quarter full.' },
  percent: { example: 'Shop sale: 15% off a £40 jumper is £4 + £2 = £6 off, so you pay £34.' },
  'order-ops': { hook: 'D and M are a team, and so are A and S: do each pair from left to right.', example: '3 drinks at £2 plus a £4 sandwich: 4 + 3 × 2 = £10, not £14.' },
  substitute: { example: 'A phone plan costs £5 plus £2 per GB: 5 + 2g. Using 3 GB costs 5 + 2 × 3 = £11.' },
  sequences: { example: 'Tables pushed together in a row: 1 table seats 4 and each extra table adds 2 seats, so n tables seat 2n + 2.' },
  equations: { hook: 'Undo it backwards: for 3x + 5 = 20, take away 5 first, then divide by 3.', example: 'Cinema: 3 tickets plus £5 of popcorn cost £35. 3t + 5 = 35, so each ticket is £10.' },
  ratio: { example: 'Squash: 1 part cordial to 4 parts water. A 500 ml jug needs 100 ml of cordial and 400 ml of water.' },
  primes: { hook: 'Factors fit into a number; multiples are in its times table. Factors are few, multiples go on for ever.', example: 'Some cicadas in North America only come out every 13 or 17 years: prime numbers!' },
  angles: { hook: 'A cute little angle is acute (under 90°); obtuse is between 90° and 180°; reflex is more than 180°.', example: 'Clock hands at 3 o’clock make a right angle (90°); at 6 o’clock they make a straight line (180°).' },
  'long-mult': { example: 'A theatre with 26 rows of 34 seats: 34 × 20 = 680 and 34 × 6 = 204, so 884 seats.' },
  'long-div': { hook: 'Remainders: round UP when everyone needs a place (buses); round DOWN when only full ones count (bags).', example: '50 pupils in 16-seat minibuses need 4 buses, but 50 sweets in bags of 16 fill only 3 bags.' },
  area: { hook: 'A triangle is half the rectangle around it: ½ × base × height.', example: 'Carpet is sold by area (m²); a fence is sold by length, so for that you need the perimeter.' },
  volume: { example: 'A 10 cm × 10 cm × 10 cm box holds 1000 cm³, which is exactly 1 litre: a big carton of juice.' },
  coordinates: { example: 'Map grid references go along the corridor first (across), then up the stairs.' },
  units: { hook: 'Changing to a smaller unit? Multiply (you need more of them). To a bigger unit? Divide.', example: 'A 5 km fun run is 5000 m; a 2 litre bottle of squash holds 2000 ml.' },
  time: { hook: 'Count on in hops: up to the next o’clock, then whole hours, then the minutes left.', example: 'Train timetables: 14:45 to 16:10 is 15 min + 1 h + 10 min = 1 h 25 min.' },
  'word-problems': { example: '3 comics at £2.75 each from a £10 note: £8.25 spent, so £1.75 change.' },
  probability: { example: 'A weather app showing a 70% chance of rain means a 30% chance of staying dry.' },
  charts: { hook: 'Degrees for one item = 360 ÷ total × that item’s number.', example: 'In a class of 30, each child gets 12° of the pie chart (360 ÷ 30 = 12).' },
};

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

// Memory hooks and real-world examples for SHAPES, keyed by answer.
const SHAPE_MEMORY = {
  'a rhombus': { hook: 'A rhombus is a squashed square: four equal sides.', example: 'The diamond on a playing card is a rhombus.' },
  'a trapezium': { hook: 'Trapezium: ONE pair of parallel sides. Parallelogram: two pairs (“parallel” is in its name).', example: 'A bucket or a classic handbag seen from the side is a trapezium shape.' },
  'a kite': { hook: 'A kite: two short sides together at the top, two long sides together at the bottom.' },
  equilateral: { hook: 'Equi-lateral = equal sides: all three the same.', example: 'The triangle used to rack up snooker balls is equilateral.' },
  isosceles: { hook: 'Isosceles is Greek for “equal legs”: two equal sides.' },
  scalene: { hook: 'Scalene comes from the Greek for “uneven”: no sides the same.' },
  'the radius': { hook: 'The radius goes halfway across; the diameter goes all the way and is double.', example: 'A bicycle spoke runs from the hub towards the rim, like a radius.' },
  'the circumference': { hook: 'Circum means around, as in circumnavigate (to sail around the world).', example: 'The ribbon around a birthday cake measures its circumference.' },
  '14 cm': { hook: 'Diameter is double the radius: d = 2r.', example: 'A pizza’s size is measured across the middle: its diameter.' },
  'a regular polygon': { hook: 'Regular means everything matches: all sides AND all angles equal.', example: 'A square and a STOP sign (a regular octagon) are regular polygons.' },
  'a net': { hook: 'A net is the shape’s flat-pack: fold it up to build the 3D shape.', example: 'Unfold a cereal box and the flat card is a net of a cuboid.' },
  '6 faces, 12 edges, 8 vertices': { hook: 'Check with Euler: faces + vertices − edges = 2. For a cube, 6 + 8 − 12 = 2.' },
  'a cylinder': { example: 'Tins of beans, drinks cans and toilet-roll tubes are cylinders.' },
  'a square-based pyramid': { hook: 'A pyramid is named after its base: square base, square-based pyramid.' },
  congruent: { hook: 'Congruent = identical twins: same shape AND same size. Similar = same shape, different size.', example: 'Stamps from the same sheet are congruent.' },
  parallel: { hook: 'The two l’s in the middle of paraLLel are a pair of parallel lines.', example: 'Railway tracks and the lines on writing paper are parallel.' },
  perpendicular: { hook: 'Perpendicular lines make a perfect L or T: a right angle.', example: 'A wall and the floor are perpendicular: they meet at a right angle.' },
  '6': { hook: 'A regular polygon has as many lines of symmetry as it has sides.', example: 'A snowflake usually has six lines of symmetry.' },
};

// [prompt, answer, distractors, optional { hook, example }]
const FACTS = [
  ['What is 7²?', '49', ['14', '72', '56'], { hook: 'Squared means times itself: 7² = 7 × 7, not 7 × 2.', example: 'A square patio 7 tiles by 7 tiles uses 49 tiles.' }],
  ['What is 9²?', '81', ['18', '92', '72'], { hook: 'In the 9 times table the digits add to 9: 8 + 1 = 9.' }],
  ['What is 12²?', '144', ['24', '122', '132'], { hook: 'A dozen dozen is a gross: 12 × 12 = 144.', example: 'Twelve boxes of a dozen eggs make 144 eggs.' }],
  ['What is 15²?', '225', ['30', '215', '255'], { hook: 'Squaring a number ending in 5: 1 × 2 = 2, then write 25 after it, giving 225.' }],
  ['What is √64?', '8', ['32', '6', '16'], { hook: 'Square root asks “what times ITSELF makes this?” 8 × 8 = 64.', example: 'A chessboard is 8 squares by 8 squares: 64 squares in all.' }],
  ['What is √121?', '11', ['12', '60.5', '21'], { hook: '11 × 11 = 121, a number that reads the same backwards.' }],
  ['What is {{1/8}} as a decimal?', '0.125', ['0.8', '0.18', '0.25'], { hook: 'Keep halving: 1/2 = 0.5, 1/4 = 0.25, 1/8 = 0.125.' }],
  ['What is {{3/4}} as a percentage?', '75%', ['34%', '0.75%', '70%'], { hook: 'Think coins: 3/4 of £1 is 75p, which is 75 out of 100.', example: 'Three quarters of an hour is 45 minutes; three quarters of £1 is 75p.' }],
  ['What is {{1/5}} as a decimal?', '0.2', ['0.5', '0.15', '0.25'], { hook: '1/5 of £1 is 20p, so 1/5 = 0.20 = 0.2.' }],
  ['What is 0.05 as a percentage?', '5%', ['50%', '0.5%', '0.05%'], { hook: 'Decimal to percentage: multiply by 100. 0.05 × 100 = 5%.', example: '5p is 0.05 of a pound, which is 5%.' }],
  ['How many metres are in 1 kilometre?', '1000', ['100', '10', '10 000'], { hook: 'Kilo means a thousand: a kilometre is 1000 metres, a kilogram 1000 grams.', example: 'A kilometre is two and a half laps of a 400 m running track.' }],
  ['How many millilitres are in 1 litre?', '1000', ['100', '10', '500'], { hook: 'Milli means a thousandth: a millilitre is a thousandth of a litre.', example: 'A 1 litre carton of juice fills four 250 ml glasses.' }],
  ['How many grams are in 1 kilogram?', '1000', ['100', '10', '500'], { example: 'A 1 kg bag of sugar holds 1000 grams.' }],
  ['How many centimetres are in 1 metre?', '100', ['10', '1000', '60'], { hook: 'Centi means a hundredth, like a century is 100 years.', example: 'A metre stick has 100 cm marked on it.' }],
  ['What do the angles in a triangle add up to?', '180°', ['360°', '90°', '270°'], { hook: 'Tear the three corners off a paper triangle: they fit together on a straight line, 180°.' }],
  ['What do the angles around a point add up to?', '360°', ['180°', '90°', '270°'], { hook: 'A full turn is 360°.', example: 'A skateboarder who does a “three-sixty” spins all the way round.' }],
  ['What do the angles in a quadrilateral add up to?', '360°', ['180°', '540°', '400°'], { hook: 'A diagonal cuts a quadrilateral into two triangles: 2 × 180° = 360°.' }],
  ['What is the smallest prime number?', '2', ['1', '3', '0'], { hook: '1 is not prime (it has only one factor). 2 is the smallest prime and the only even one.' }],
  ['What is an acute angle?', 'less than 90°', ['exactly 90°', 'between 90° and 180°', 'more than 180°'], { hook: 'A cute little angle: acute angles are small, less than 90°.', example: 'The tip of a slice of pizza makes an acute angle.' }],
  ['What is an obtuse angle?', 'between 90° and 180°', ['less than 90°', 'exactly 180°', 'more than 180°'], { hook: 'Obtuse is open wide: more than a square corner, less than a straight line.', example: 'A laptop screen tipped back past upright makes an obtuse angle.' }],
  ['How many sides does a hexagon have?', '6', ['5', '7', '8'], { hook: 'Hexagon and six both have an x.', example: 'The cells in a honeycomb are hexagons.' }],
  ['How many sides does an octagon have?', '8', ['6', '7', '10'], { hook: 'An octopus has eight arms; an octagon has eight sides.', example: 'A UK STOP sign is an octagon.' }],
  ['What is the formula for the area of a rectangle?', 'length × width', ['2 × (length + width)', 'length + width', '½ × length × width'], { hook: 'Count the squares: rows × columns, so length × width.' }],
  ['What is the formula for the area of a triangle?', '½ × base × height', ['base × height', 'base + height', '2 × base × height'], { hook: 'A triangle is half of a rectangle: ½ × base × height.' }],
];

const shapeItems = SHAPES.map(([prompt, answer, distractors, explain, accept], i) => ({
  id: `maths.shape.${i + 1}`, topic: 'maths.shapes', kind: 'fact', prompt, answer, distractors, explain,
  ...(accept ? { accept } : { formats: ['choice'] }), ...SHAPE_MEMORY[answer],
}));

const items = TOPICS.map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1], ...TMPL_MEMORY[t.id.replace(/^maths\./, '')] }));
const factItems = FACTS.map(([prompt, answer, distractors, memory], i) => ({
  id: `maths.fact.${i + 1}`, topic: 'maths.key-facts', kind: 'fact', prompt, answer, distractors, explain: `${prompt.replace(/\?$/, '')}: ${answer}.`,
  ...(/^\d+(\.\d+)?%?$/.test(answer) ? {} : { formats: ['choice'] }),
  ...(answer.endsWith('%') ? { accept: [answer.slice(0, -1)] } : {}), ...memory,
}));

export default [{
  subject: 'maths', deck: 'core',
  topics: [
    ...TOPICS.map(({ gen, ...t }) => ({ kind: 'skill', ...t })),
    { id: 'maths.key-facts', title: 'Key facts', kind: 'facts', prereqs: [], batch: 6, hook: 'Know them instantly, like 5, 6, 7, 8 (56 = 7 × 8), and your brain is free for the hard part of a question.', teach: 'Explain how you remember what the angles in a triangle add up to.', talk: 'Quick-fire: what is 12 squared?' },
    { id: 'maths.shapes', title: 'Shapes and their properties', kind: 'facts', prereqs: ['maths.angles'], batch: 5, hook: 'Quad means four: a quad bike has four wheels and a quadrilateral has four sides.', intro: 'Mathematicians have exact names for shapes and their parts. Knowing them means you can describe any shape precisely.', teach: 'Explain the difference between a rhombus and a parallelogram.', talk: 'Spot three different quadrilaterals around the house.' },
  ],
  items: [...items, ...factItems, ...shapeItems],
}];

// Year 3 maths, aiming at greater depth: place value to 1000, mental and written addition
// and subtraction, the 3, 4 and 8 tables, multiplying and dividing, fractions, measures,
// money, time, angles and statistics; Year 4 tasters as stretch (all tables, negative
// numbers, decimals, area, rounding). Generators live in js/gen/y3maths.js.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.y3-${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `maths.y3.${id}`, topic: `maths.y3-${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `maths.y3.${id}`, topic: `maths.y3-${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };

const TOPICS = [
  T('place', 'Numbers to 1000', 'y3Place', ['hundreds'], { intro: 'Every 3-digit number is built from hundreds, tens and ones. 572 is 5 hundreds, 7 tens and 2 ones, and it can be split in other ways too: 400 + 170 + 2.', teach: 'Explain what happens to 395 when you add 10.', talk: 'Read the numbers on car number plates or house doors and ask {him} what each digit is worth.' }),
  T('mental', 'Adding and subtracting in your head', 'y3Mental', ['y3-place'], { intro: 'Adding 1s, 10s or 100s to a 3-digit number changes one digit, unless it crosses a boundary. For 99, add 100 and take 1 away!', teach: 'Explain a quick way to work out 456 + 99.', talk: 'In the car, ask {him} for 10 more, 100 more, then 1 less than a number.' }),
  T('column', 'Column addition and subtraction', 'y3Column', ['column', 'y3-place'], { intro: 'Line the digits up in columns: hundreds, tens, ones. Start with the ones. When a column is too big (or too small), exchange with the next column.', teach: 'Explain how you would check 532 − 278 using addition.', talk: 'Ask {him} to estimate first, then work it out, then check.' }),
  T('tables', 'The 3, 4 and 8 times tables', 'y3Tables', ['times-8'], { intro: 'The 4 times table is double the 2s, and the 8 times table is double the 4s. If you know 3 × 4 = 12, you also know 30 × 4 = 120!', teach: 'Explain how 3 × 8 = 24 helps you work out 30 × 8.', talk: 'Quick-fire 8 times table on the way to school.' }),
  T('multiply', 'Multiplying 2-digit numbers', 'y3Multiply', ['y3-tables', 'times10'], { intro: 'To multiply 34 × 3, split 34 into 30 and 4. Multiply each part, then add: 90 + 12 = 102. A grid helps you keep track.', teach: 'Explain how to work out 26 × 4 with a grid.', talk: 'Ask {him} how many wheels on 23 cars.' }),
  T('divide', 'Dividing and remainders', 'y3Divide', ['y3-tables', 'grouping'], { intro: 'Dividing shares into equal groups. Sometimes there are some left over: the remainder. In stories, think carefully about what to do with it!', teach: 'Explain why 26 children need 7 tables of 4, not 6.', talk: 'Share some sweets or grapes equally and talk about the remainder.' }),
  T('fractions', 'Fractions of amounts and tenths', 'y3Fractions', ['fractions', 'y3-tables'], { intro: 'To find a fraction of an amount, divide by the bottom number and multiply by the top. Tenths come from sharing something into 10 equal parts.', teach: 'Explain how to find {{3/4}} of 20.', talk: 'Ask {him} what {{1/4}} of an hour is in minutes.' }),
  T('fraccalc', 'Equivalent fractions, adding and comparing', 'y3FracCalc', ['y3-fractions'], { intro: 'Fractions that look different can be equal: {{1/2}} = {{2/4}} = {{4/8}}. When the bottom numbers are the same, just add or take away the top numbers.', teach: 'Explain why {{1/3}} is bigger than {{1/5}}.', talk: 'Fold paper into halves, quarters and eighths and compare.' }),
  T('measure', 'Length, mass and capacity', 'y3Measure', ['measure', 'scales'], { intro: '10 mm = 1 cm, 100 cm = 1 m, 1000 g = 1 kg and 1000 ml = 1 l. Change measures into the same unit before you compare or add them.', teach: 'Explain how to change 2 m 35 cm into centimetres.', talk: 'Weigh ingredients together when baking.' }),
  T('money', 'Money and change', 'y3Money', ['money', 'amounts', 'y3-mental'], { intro: '£1 = 100p, so £3.45 is 345p. To find change, count on from the price to the money you paid.', teach: 'Explain how to find the change from £5 for something costing £3.70.', talk: 'Let {him} work out the change at the shop before the cashier does.' }),
  T('time', 'Time to the minute and the 24-hour clock', 'y3Time', ['time', 'durations'], { intro: 'Read the long hand to the exact minute by counting in 5s, then 1s. a.m. is before midday, p.m. is after. 24-hour clocks carry on after 12: 3 p.m. is 15:00.', teach: 'Explain how to change 4:30 p.m. into 24-hour time.', talk: 'Ask {him} to read train or cinema times in 24-hour clock.' }),
  T('angles', 'Angles, turns and lines', 'y3Angles', ['turns'], { intro: 'A right angle is a quarter turn, like the corner of a book. Other angles are bigger or smaller. Lines can be horizontal, vertical, parallel (never meet) or perpendicular (meet at a right angle).', teach: 'Explain how many right angles are in a full turn.', talk: 'Hunt for right angles, parallel lines and perpendicular lines around the house.' }),
  T('stats', 'Bar charts, pictograms and tables', 'y3Stats', ['charts', 'data'], { intro: 'Read the scale carefully: it might go up in 2s, 5s or 10s, and a bar can stop halfway between lines. In a pictogram, check the key.', teach: 'Explain how to read a bar that stops halfway between 20 and 30.', talk: 'Make a bar chart of the family’s favourite planets.' }),
  T('problems', 'Two-step problems', 'y3Problems', ['y3-mental', 'y3-multiply'], { intro: 'Some problems need two steps. Work out what you need to know first, do that, then use the answer for the second step.', teach: 'Explain the two steps in a problem about buying tickets and getting change.', talk: 'Make up a two-step superhero problem for each other.' }),
  { id: 'maths.y3-shapes', title: '2D and 3D shapes', kind: 'facts', prereqs: ['maths.shapes'], batch: 5, intro: 'Year 3 shape facts: prisms, pyramids, faces, edges and vertices, and the special names for lines.', teach: 'Explain the difference between a prism and a pyramid.', talk: 'Find a prism and a pyramid in the kitchen or at the shops.' },
  { id: 'maths.y3-facts', title: 'Year 3 facts to know', kind: 'facts', prereqs: ['maths.facts-2'], batch: 5, intro: 'Facts worth knowing by heart: Roman numerals on clocks, seconds in a minute, days in each month, and more.', teach: 'Explain how to remember which months have 30 days.', talk: 'Find Roman numerals on a clock face and read them together.' },
  { id: 'maths.y3-reasoning', title: 'Thinking hard: Year 3 puzzles', kind: 'facts', prereqs: ['maths.y3-column', 'maths.y3-tables'], batch: 4, intro: 'Greater depth means explaining, proving and spotting patterns. Take your time, try examples, and look for the trick.', teach: 'Explain how you know your answer must be right.', talk: 'Ask {him} one puzzle at dinner and let {him} explain {her} thinking.' },
  // Year 4 tasters
  T('tables-y4', 'Times tables to 12 × 12', 'y3TablesY4', ['y3-tables'], { tier: 'stretch', intro: 'Year 4 learns every table up to 12 × 12. Use tricks: 6s are double 3s, 9s are 10s take away one lot, 12s are 10s plus 2s.', teach: 'Explain the trick for the 9 times table.', talk: 'Ask {him} for 7 × 8 at breakfast every day for a week.' }),
  T('negative', 'Negative numbers', 'y3Negative', ['y3-place', 'numberline'], { tier: 'stretch', intro: 'Numbers below zero are negative, like −3°C on a cold night (or on Mars!). Count back through zero: 2, 1, 0, −1, −2.', teach: 'Explain the difference between −5°C and 3°C.', talk: 'Look at the freezer or weather forecast for temperatures below zero.' }),
  T('decimals', 'Tenths and hundredths as decimals', 'y3Decimals', ['y3-fractions', 'times10'], { tier: 'stretch', intro: 'A decimal point separates whole numbers from parts. 0.3 means 3 tenths; 0.25 means 25 hundredths. Racing times use them: 1.25 seconds!', teach: 'Explain why 0.5 is the same as {{1/2}}.', talk: 'Look at prices or race times with decimal points together.' }),
  T('area', 'Area', 'y3Area', ['perimeter', 'y3-multiply'], { tier: 'stretch', intro: 'Area is the space inside a shape, measured in squares. For a rectangle, multiply the length by the width.', teach: 'Explain the difference between area and perimeter.', talk: 'Count the tiles on a floor or wall and work out the area.' }),
  T('rounding', 'Rounding', 'y3Rounding', ['y3-place'], { tier: 'stretch', intro: 'Rounding gives a friendly number that is close: 487 rounds to 490 (nearest 10) or 500 (nearest 100). Exactly halfway rounds up.', teach: 'Explain how to round 650 to the nearest 100.', talk: 'Round the prices in a shop to the nearest pound.' }),
];

const SHAPES = [
  ['How many faces does a triangular prism have?', '5', ['6', '3', '4'], 'Two triangle ends and three rectangle sides: 5 faces.'],
  ['How many faces does a square-based pyramid have?', '5', ['4', '6', '8'], 'One square base and four triangles meeting at the top.'],
  ['How many edges does a square-based pyramid have?', '8', ['5', '6', '12'], '4 round the base and 4 going up to the point.'],
  ['How many vertices does a cuboid have?', '8', ['6', '12', '4'], 'Like a cube: 4 on top and 4 underneath.'],
  ['A 3D shape with the same shape all the way through, like a Toblerone box, is called a…', 'prism', ['pyramid', 'sphere', 'cone'], 'Prisms have two matching end faces joined by rectangles.', { accept: ['a prism'], ...choiceOnly }],
  ['Two lines that never meet, like train tracks, are called…', 'parallel', ['perpendicular', 'horizontal', 'curved'], 'Parallel lines stay the same distance apart for ever.', { accept: ['parallel lines'] }],
  ['Two lines that meet at a right angle are called…', 'perpendicular', ['parallel', 'diagonal', 'vertical'], 'The corner of a page has perpendicular edges.', { accept: ['perpendicular lines'] }],
  ['A line that goes straight across, like the horizon, is…', 'horizontal', ['vertical', 'diagonal', 'perpendicular'], 'Horizontal lines go across; vertical lines go straight up and down.'],
  ['A line that goes straight up and down, like a flagpole, is…', 'vertical', ['horizontal', 'parallel', 'diagonal'], 'Vertical lines point straight up.'],
  ['How many sides does a heptagon have?', '7', ['6', '8', '9'], 'Hepta means seven. A 50p coin is a heptagon with curved sides.'],
  ['What is a shape with 4 sides called?', 'a quadrilateral', ['a pentagon', 'a triangle', 'a hexagon'], 'Squares, rectangles, kites and parallelograms are all quadrilaterals.', { accept: ['quadrilateral'], ...choiceOnly }],
  ['Which 2D shape has one curved edge and no corners?', 'a circle', ['a semicircle', 'an oval with corners', 'a square'], 'A circle has one curved edge. A semicircle has a curved edge AND a straight one.', choiceOnly],
];
const FACTS = [
  ['What number is XII in Roman numerals?', '12', ['11', '7', '10'], 'X = 10 and II = 2: XII = 12, at the top of many clocks.'],
  ['What number is IX in Roman numerals?', '9', ['11', '4', '6'], 'I before X means one less than ten: 9.'],
  ['What number is IV in Roman numerals?', '4', ['6', '5', '3'], 'I before V means one less than five: 4.'],
  ['How many seconds are in 1 minute?', '60', ['100', '30', '10'], 'The second hand goes round once every minute.'],
  ['How many minutes are in 2 hours?', '120', ['200', '100', '60'], '2 × 60 = 120.'],
  ['How many days are in a leap year?', '366', ['365', '364', '360'], 'A leap year has an extra day: 29 February.'],
  ['How many days are in April?', '30', ['31', '28', '29'], '“Thirty days has September, April, June and November…”'],
  ['How many days are in December?', '31', ['30', '28', '29'], 'All the months not in the rhyme (except February) have 31 days.'],
  ['How many millimetres are in 1 centimetre?', '10', ['100', '1000', '5'], 'Look at a ruler: 10 tiny marks in every centimetre.'],
  ['How many grams are in half a kilogram?', '500', ['50', '5000', '250'], 'Half of 1000 g is 500 g.'],
  ['How many millilitres are in a quarter of a litre?', '250', ['25', '400', '500'], 'A quarter of 1000 ml is 250 ml.'],
  ['What is 24-hour time for midday?', '12:00', ['00:00', '24:00', '13:00'], 'Midday is 12:00; midnight is 00:00.', choiceOnly],
  ['What is the smallest 3-digit number?', '100', ['101', '999', '111'], '99 is the biggest 2-digit number, and one more is 100.'],
  ['What is the largest 3-digit number?', '999', ['1000', '990', '900'], '999: one more makes 1000, which has 4 digits.'],
];

const items = [
  ...TOPICS.filter((t) => t.gen).map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1] })),
  ...SHAPES.map(([prompt, answer, distractors, explain, extra], i) => fact(`sh.${i + 1}`, 'shapes', prompt, answer, distractors, explain, extra || (/^\d+$/.test(answer) ? {} : choiceOnly))),
  ...FACTS.map(([prompt, answer, distractors, explain, extra], i) => fact(`f.${i + 1}`, 'facts', prompt, answer, distractors, explain, extra || {})),
  // reasoning: always/sometimes/never, spot the mistake, prove it, find all the ways
  mcq('r.even8', 'reasoning', 'Every number in the 8 times table is even. Always, sometimes or never true?', [['Always true', true], ['Sometimes true', false, 'Try lots: 8, 16, 24, 32… every one is even.'], ['Never true', false, '8 itself is even!']], '8 is double 4, so every multiple of 8 is a double: always even.'),
  mcq('r.odd3', 'reasoning', 'Numbers in the 3 times table are odd. Always, sometimes or never true?', [['Sometimes true', true], ['Always true', false, '6 is in the 3 times table and it is even.'], ['Never true', false, '3, 9 and 15 are odd and in the 3 times table.']], 'They go odd, even, odd, even: 3, 6, 9, 12…'),
  mcq('r.mistake', 'reasoning', 'Turbo works out 452 − 127 and gets 335. What went wrong?', [['He took 2 from 7 in the ones instead of exchanging: it should be 325', true], ['Nothing, it is right', false, 'Check: 335 + 127 = 462, not 452.'], ['He should have added', false, 'It is a subtraction; the mistake is in the ones column.']], 'In the ones, 2 − 7 won’t go, so exchange a ten: 12 − 7 = 5, then 4 − 2 = 2 tens, 4 − 1 = 3 hundreds. 325.'),
  mcq('r.digits', 'reasoning', 'Using the digits 3, 6 and 9 once each, how many different 3-digit numbers can you make?', [['6', true], ['3', false, 'Each digit can go first, then there are two ways to arrange the other two: 3 × 2 = 6.'], ['9', false, 'List them systematically: 369, 396, 639, 693, 936, 963.']], 'Work systematically: 369, 396, 639, 693, 936, 963. Six numbers.'),
  mcq('r.estimate', 'reasoning', '{hero} says 298 + 405 = 1003. How can you tell straight away it is wrong?', [['300 + 400 is about 700, nowhere near 1000', true], ['Odd numbers can’t be added', false, 'They can! The estimate is the quick check.'], ['You can’t tell without working it out', false, 'Estimating tells you quickly: about 700.']], 'Round first: 300 + 400 = 700. The real answer is 703.'),
  mcq('r.remainder', 'reasoning', 'When you divide a number by 4, can the remainder be 5?', [['No: if 5 were left, you could make another group of 4', true], ['Yes, sometimes', false, 'With 5 left over you could share one more each.'], ['Only for big numbers', false, 'The remainder is always less than 4 when you divide by 4.']], 'A remainder is always smaller than the number you divide by.'),
  mcq('r.fraction', 'reasoning', 'Rosa ate {{1/2}} of a small pizza. Blaze ate {{1/4}} of a huge pizza. Who ate more?', [['We can’t tell without knowing the size of each pizza', true], ['Rosa, because a half is more than a quarter', false, 'A half of something small can be less than a quarter of something huge.'], ['Blaze, always', false, 'It depends on the sizes.']], 'Fractions compare fairly only when the wholes are the same size. Great mathematicians spot that!'),
  mcq('r.multiply', 'reasoning', 'Which is NOT the same as 4 × 6?', [['4 + 6', true], ['8 × 3', false, '8 × 3 = 24, the same as 4 × 6.'], ['2 × 12', false, '2 × 12 = 24 too.']], '4 × 6 = 24 = 8 × 3 = 2 × 12 (double one number, halve the other). But 4 + 6 = 10.'),
  mcq('r.pattern', 'reasoning', '7, 15, 23, 31… Will 100 be in this pattern?', [['No: it goes up in 8s from 7, so the numbers are all odd', true], ['Yes, if you keep going', false, 'Adding 8 to an odd number always gives odd, and 100 is even.'], ['Only after 1000', false, 'Every number in the pattern is odd, so 100 never appears.']], '7 is odd, and adding 8 (even) keeps it odd for ever.'),
  mcq('r.balance', 'reasoning', '40 × 3 = 60 × ?', [['2', true], ['3', false, '60 × 3 = 180, but 40 × 3 = 120.'], ['6', false, '60 × 6 = 360.']], '40 × 3 = 120, and 60 × 2 = 120. Both sides of = must be the same.'),
  mcq('r.time', 'reasoning', 'Captain Nova says “Half past 3 in the afternoon is 03:30.” Is she right?', [['No: it is 15:30', true], ['Yes', false, '03:30 is half past 3 in the middle of the night!'], ['It is 13:30', false, '13:00 is 1 p.m. Add 12 to 3: 15:30.']], 'For p.m. times, add 12 to the hour: 3 + 12 = 15, so 15:30.'),
  mcq('r.angles', 'reasoning', 'A square has 4 right angles. Can a triangle have 2 right angles?', [['No: the two sides would be parallel and never meet', true], ['Yes', false, 'Try drawing it: the two lines go straight up side by side and never join.'], ['Only a big triangle', false, 'Size doesn’t matter: two right angles means the sides can’t meet.']], 'Two right angles at the ends of one side make two parallel lines, so no third corner can form.'),
];

export default [{
  subject: 'maths', deck: 'y3',
  topics: TOPICS.map(({ gen, ...t }) => ({ kind: gen ? 'skill' : 'facts', ...t })),
  items,
}];

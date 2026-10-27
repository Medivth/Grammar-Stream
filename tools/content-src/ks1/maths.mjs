// Year 2 maths, aiming at greater depth: every topic is a generator with three levels
// (secure Year 2, greater depth, Year 3 taster), plus facts and reasoning questions.
// Talk prompts use {him}/{she}/{her} tokens, filled with the child's pronouns.

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };

const TOPICS = [
  T('place', 'Tens and ones', 'k1Place', [], { intro: 'Every number is built from tens and ones, like a race car is built from parts. 47 is 4 tens and 7 ones.', teach: 'Explain why 52 is bigger than 25.', talk: 'Ask {him} what the 3 is worth in 35, and in 53.' }),
  T('bonds', 'Number bonds', 'k1Bonds', [], { intro: 'Number bonds are pairs that make a total. If you know 7 + 3 = 10, you also know 70 + 30 = 100!', teach: 'Explain how 6 + 4 = 10 helps you work out 60 + 40.', talk: 'Quick-fire in the car: “I say 7, you say the number that makes 10.”' }),
  T('addsub', 'Adding and taking away', 'k1AddSub', ['place', 'bonds'], { intro: 'Adding and subtracting with bigger numbers: split numbers into tens and ones, and use one fact to check the other.', teach: 'Explain how you would work out 45 + 27.', talk: 'Ask {him} to check 36 + 17 = 53 by taking away.' }),
  T('count', 'Counting patterns, odd and even', 'k1Count', [], { intro: 'Counting in 2s, 3s, 5s and 10s is a superpower for times tables. Spot the rule and you can find any number in a pattern.', teach: 'Explain how you can tell if a number is odd or even.', talk: 'Count in 3s together up the stairs.' }),
  T('times', 'Times tables: 2, 5 and 10', 'k1Times', ['count'], { intro: 'Multiplying is adding equal groups quickly. Dividing is sharing equally, or finding how many groups.', teach: 'Explain why 3 × 5 is the same as 5 × 3, using an array.', talk: 'Ask {him} how many wheels on 6 racing cars.' }),
  T('fractions', 'Halves, quarters and thirds', 'k1Frac', ['times'], { intro: 'A fraction is an EQUAL part of something. Two quarters make a half. Three quarters is almost the whole thing.', teach: 'Explain why a shape cut into 4 unequal pieces is not in quarters.', talk: 'Cut a sandwich into quarters. How many quarters make a half?' }),
  T('money', 'Money', 'k1Money', ['addsub'], { intro: 'Pounds and pence: 100p makes £1. Counting coins is quickest if you start with the biggest.', teach: 'Explain how to make 75p using the fewest coins.', talk: 'At the shop, let {him} work out the change from £1.' }),
  T('time', 'Telling the time', 'k1Time', ['count'], { intro: 'The long hand shows the minutes and the short hand shows the hour. Count in 5s round the clock to read the minutes.', teach: 'Explain how you know a clock shows quarter to 3.', talk: 'Ask {him} what time it is on the kitchen clock, then what time it will be in half an hour.' }),
  T('measure', 'Length, mass and capacity', 'k1Measure', ['addsub'], { intro: 'We measure length in centimetres and metres, mass in grams and kilograms, and capacity in millilitres and litres.', teach: 'Explain which unit you would use to measure a race track, and why.', talk: 'Guess how many centimetres long a toy car is, then measure it.' }),
  T('data', 'Pictograms and charts', 'k1Data', ['times'], { intro: 'A pictogram uses pictures to show numbers. Always check the key: sometimes one picture stands for 2!', teach: 'Explain what half a picture means when one picture stands for 2.', talk: 'Make a tally of car colours you pass on a walk.' }),
  T('problems', 'Racing, space and hero problems', 'k1Problems', ['addsub', 'times'], { intro: 'Word problems hide the maths inside a story. Read carefully, decide what to do first, then check your answer makes sense.', teach: 'Explain the two steps you would use to solve a problem about racing laps.', talk: 'Make up a word problem about superheroes for each other.' }),
  { id: 'maths.shapes', title: 'Shapes', kind: 'facts', prereqs: [], batch: 5, intro: 'Every shape has properties: sides and corners (vertices) for flat shapes, faces, edges and vertices for solid ones.', teach: 'Explain the difference between a cube and a square.', talk: 'Find a cylinder, a cuboid and a sphere in the kitchen.' },
  { id: 'maths.facts', title: 'Time and number facts', kind: 'facts', prereqs: [], batch: 5, intro: 'Some facts are worth knowing by heart, like how many minutes are in an hour.', teach: 'Explain how many days are in a week and which day comes after Friday.', talk: 'Ask {him} how many months until {her} birthday.' },
  { id: 'maths.reasoning', title: 'Thinking like a mathematician', kind: 'facts', prereqs: ['addsub', 'times'].map((p) => `maths.${p}`), batch: 4, intro: 'Mathematicians ask: is it always true, sometimes true, or never true? Can I prove it? These questions are the real greater-depth challenge.', teach: 'Explain whether adding two odd numbers ALWAYS gives an even number.', talk: 'Ask {him}: “Is it always, sometimes or never true that a bigger number has more digits?”' },
  // Year 3 taster
  T('times-8', 'Times tables: 3, 4 and 8', 'k1Times8', ['times'], { tier: 'stretch', intro: 'The 4 times table is double the 2s, and the 8 times table is double the 4s!', teach: 'Explain how the 4 times table helps you with the 8 times table.', talk: 'Ask {him} for 6 × 4, then 6 × 8.' }),
  T('hundreds', 'Numbers to 1000', 'k1Hundreds', ['place'], { tier: 'stretch', intro: 'Three-digit numbers have hundreds, tens and ones. 365 is 3 hundreds, 6 tens and 5 ones.', teach: 'Explain what happens to 299 when you add 1.', talk: 'Find a three-digit number on a sign and ask what each digit is worth.' }),
  T('column', 'Adding and subtracting 3-digit numbers', 'k1Column', ['hundreds', 'addsub'], { tier: 'stretch', intro: 'For big numbers, line them up in columns: hundreds, tens, ones. Add or take away one column at a time.', teach: 'Explain what “carrying” means when you add.', talk: 'Ask {him} to add two house numbers on your street.' }),
];

const SHAPES = [
  ['How many sides does a triangle have?', '3', ['4', '5', '6'], 'Tri means three: 3 sides and 3 corners.'],
  ['How many sides does a pentagon have?', '5', ['4', '6', '8'], 'Pent means five.'],
  ['How many sides does a hexagon have?', '6', ['5', '8', '4'], 'Hex means six. Bees build hexagons in their honeycomb.'],
  ['How many sides does an octagon have?', '8', ['6', '10', '7'], 'Oct means eight, like an octopus with 8 arms.'],
  ['What is the name of a corner on a shape?', 'a vertex', ['an edge', 'a face', 'a side'], 'A corner is a vertex. More than one are vertices.', { accept: ['vertex'] }],
  ['How many faces does a cube have?', '6', ['4', '8', '12'], 'A dice is a cube: 6 square faces.'],
  ['How many vertices (corners) does a cube have?', '8', ['6', '12', '4'], '4 on the top and 4 on the bottom: 8.'],
  ['Which 3D shape is like a ball?', 'a sphere', ['a cube', 'a cone', 'a cylinder'], 'A sphere is perfectly round with one curved surface.', { accept: ['sphere'] }],
  ['Which 3D shape is like a tin of beans?', 'a cylinder', ['a cone', 'a cuboid', 'a sphere'], 'Two circle faces and a curved surface.', { accept: ['cylinder'] }],
  ['Which 3D shape is like a traffic cone?', 'a cone', ['a pyramid', 'a cylinder', 'a sphere'], 'A circle face and a point at the top.', { accept: ['cone'] }],
  ['A shape has 4 equal sides and 4 right angles. What is it?', 'a square', ['a rectangle', 'a triangle', 'a pentagon'], 'A rectangle also has 4 right angles, but its sides are not all equal.', { accept: ['square'] }],
  ['How many lines of symmetry does a square have?', '4', ['2', '1', '0'], 'Up and down, across, and both diagonals.'],
];
const FACTS = [
  ['How many minutes are in an hour?', '60', ['100', '30', '24'], 'The long hand goes all the way round in 60 minutes.'],
  ['How many hours are in a day?', '24', ['12', '60', '7'], 'The short hand goes round the clock twice in a day: 2 × 12 = 24.'],
  ['How many days are in a week?', '7', ['5', '10', '12'], 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.'],
  ['How many months are in a year?', '12', ['10', '7', '52'], 'January to December.'],
  ['How many minutes are in half an hour?', '30', ['50', '15', '20'], 'Half of 60 is 30.'],
  ['How many minutes are in a quarter of an hour?', '15', ['25', '4', '45'], 'A quarter of 60 is 15.'],
  ['How many pence are in £1?', '100', ['10', '50', '1000'], '100p = £1.'],
  ['How many centimetres are in 1 metre?', '100', ['10', '1000', '60'], 'A metre stick has 100 centimetres.'],
  ['Which month comes after June?', 'July', ['May', 'August', 'September'], '…May, June, July, August…', { accept: ['july'] }],
  ['How many seconds are in a minute?', '60', ['100', '10', '30'], 'Count to 60 slowly: that is about a minute.'],
];

const items = [
  ...TOPICS.filter((t) => t.gen).map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1] })),
  ...SHAPES.map(([prompt, answer, distractors, explain, extra], i) => fact(`sh.${i + 1}`, 'shapes', prompt, answer, distractors, explain, extra || (/^\d+$/.test(answer) ? {} : choiceOnly))),
  ...FACTS.map(([prompt, answer, distractors, explain, extra], i) => fact(`f.${i + 1}`, 'facts', prompt, answer, distractors, explain, extra || {})),
  // reasoning: always, sometimes or never; spot the mistake; prove it
  mcq('r.odd', 'reasoning', 'Odd + odd = even. Is that always, sometimes or never true?', [['Always true', true], ['Sometimes true', false, 'Try lots: 1 + 3 = 4, 5 + 7 = 12, 9 + 9 = 18. It works every time.'], ['Never true', false, 'Try 3 + 5 = 8. That is even!']], 'Two odd numbers each have one left over when you pair them up. The two left-overs make a pair, so the total is always even.'),
  mcq('r.digits', 'reasoning', 'A number with more digits is bigger. Always, sometimes or never true (for whole numbers)?', [['Always true', true], ['Sometimes true', false, 'For whole numbers it always works: even the smallest 3-digit number (100) beats the biggest 2-digit number (99).'], ['Never true', false, '100 has more digits than 99, and it is bigger.']], 'The smallest 3-digit number, 100, is bigger than the biggest 2-digit number, 99.'),
  mcq('r.order', 'reasoning', 'You can add two numbers in any order and get the same answer. Is the same true for taking away?', [['No: 10 − 3 is not the same as 3 − 10', true], ['Yes: 10 − 3 is the same as 3 − 10', false, '10 − 3 = 7, but 3 − 10 would go below zero. Order matters for take away.'], ['Only when both numbers are even', false, 'It does not depend on odd or even: order matters for subtraction.']], 'Adding and multiplying can be done in any order. Taking away and dividing cannot.'),
  mcq('r.mistake1', 'reasoning', 'Turbo says: “34 + 25 = 95.” What mistake did Turbo make?', [['He mixed up tens and ones: it is 59', true], ['No mistake: 34 + 25 really is 95', false, '34 + 25: 3 tens + 2 tens = 5 tens; 4 + 5 = 9 ones. 59.'], ['He should have taken away: it is 9', false, 'The question is an addition. The mistake is mixing up tens and ones.']], '3 tens + 2 tens = 5 tens. 4 ones + 5 ones = 9 ones. 5 tens and 9 ones is 59, not 95.'),
  mcq('r.mistake2', 'reasoning', '{hero} says: “Half of 30 is 13.” How can you prove this is wrong?', [['13 + 13 is 26, not 30', true], ['Half of 30 is 60, not 13', false, 'Halving makes things smaller. Doubling 30 gives 60.'], ['30 is odd, so it cannot be halved', false, '30 is even, so it halves exactly: 15.']], 'To check a half, double it: if it does not give the whole, it is wrong.'),
  mcq('r.bigger', 'reasoning', 'Which is greater: {{1/2}} of 20 or {{1/4}} of 48?', [['{{1/4}} of 48', true], ['{{1/2}} of 20', false, 'Half of 20 is 10. A quarter of 48 is 12. 12 is more.'], ['They are the same', false, '10 and 12 are not the same.']], '{{1/2}} of 20 = 10. {{1/4}} of 48 = 12. A quarter of a big number can beat a half of a small one.'),
  mcq('r.groups', 'reasoning', 'Which is NOT the same as 4 × 5?', [['4 + 5', true], ['5 × 4', false, '5 × 4 is the same as 4 × 5: both make 20.'], ['5 + 5 + 5 + 5', false, 'Four fives: 20. This IS the same.']], '4 + 5 = 9, but 4 × 5 means 4 groups of 5 = 20.'),
  mcq('r.even', 'reasoning', 'Sparky thinks of a number. When it is shared equally between 2, nothing is left over. What do we know?', [['It is an even number', true], ['It is an odd number', false, 'Odd numbers always have 1 left over when shared between 2.'], ['It must be 10', false, 'Lots of numbers share equally between 2: 2, 4, 6, 8, 10…']], 'Even numbers share equally into 2 with nothing left.'),
  mcq('r.estimate', 'reasoning', 'Without working it out exactly: is 48 + 39 closer to 70, 90 or 110?', [['90', true], ['70', false, '48 is nearly 50 and 39 is nearly 40: about 50 + 40 = 90.'], ['110', false, 'Round each number: 50 + 40 = 90.']], 'Rounding to the nearest ten gives a quick estimate: 50 + 40 = 90. (The exact answer is 87.)'),
  mcq('r.both', 'reasoning', 'I am a number between 20 and 30. I am in the 2 times table AND the 5 times table. What am I?', [['20', false, '20 is in both tables, but it is not BETWEEN 20 and 30.'], ['25', false, '25 is in the 5 times table but it is odd, so not in the 2 times table.'], ['30', false, '30 is in both tables, but it is not BETWEEN 20 and 30.'], ['No number', true]], 'Numbers in both the 2 and 5 times tables are in the 10 times table: 10, 20, 30… None is strictly between 20 and 30!'),
];

export default [{
  subject: 'maths', deck: 'core',
  topics: TOPICS.map(({ gen, ...t }) => ({ kind: gen ? 'skill' : 'facts', ...t })),
  items,
}];

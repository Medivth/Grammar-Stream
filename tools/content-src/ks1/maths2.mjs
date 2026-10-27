// Year 2 maths, part 2: the rest of the year. Number lines, fact families, doubling and
// halving, turns and direction, reading scales, grouping with remainders, block charts,
// making amounts, durations; Year 3 tasters (×10 and ×100, perimeter, Roman numerals).

const T = (id, title, gen, prereqs, extra = {}) => ({ id: `maths.${id}`, title, gen, prereqs: prereqs.map((p) => `maths.${p}`), ...extra });
const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `maths.${id}`, topic: `maths.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };

const TOPICS = [
  T('numberline', 'Number lines', 'k1NumberLine', ['place'], { intro: 'A number line is like a race track with numbers on it. Work out what each little step is worth, then count the steps.', teach: 'Explain how you know what each step is worth on a number line from 0 to 100 with 10 steps.', talk: 'Draw a number line from 0 to 20 on paper and ask {him} to mark where 13 goes.' }),
  T('factfamilies', 'Fact families', 'k1FactFamily', ['bonds', 'addsub'], { intro: 'If you know one fact, you know four! 7 + 3 = 10, so 3 + 7 = 10, 10 − 3 = 7 and 10 − 7 = 3.', teach: 'Explain how 8 + 5 = 13 helps you work out 13 − 5.', talk: 'Give {him} one fact and ask for the other three in the family.' }),
  T('doubles', 'Doubling and halving', 'k1Doubles', ['bonds', 'place'], { intro: 'Double means two lots of the same. Half means two equal parts. They undo each other: double 6 is 12, half of 12 is 6.', teach: 'Explain how to double 34 by splitting it into tens and ones.', talk: 'Ask {him} to halve the number of grapes in a bowl, then check by doubling.' }),
  T('turns', 'Turns and directions', 'k1Turns', [], { intro: 'A full turn takes you all the way round. A half turn faces you the opposite way. Clockwise is the way clock hands go: north, east, south, west.', teach: 'Explain the difference between clockwise and anticlockwise.', talk: 'Play robots: give {him} instructions like “quarter turn clockwise, 3 steps forward”.' }),
  T('scales', 'Reading scales', 'k1Scales', ['numberline', 'measure'], { intro: 'Rulers, jugs and thermometers all have scales. Not every mark has a number, so first work out what each mark is worth.', teach: 'Explain how to read a jug when the marks go up in 100s but only some are numbered.', talk: 'Ask {him} to read the temperature on a thermometer or the oven dial.' }),
  T('grouping', 'Grouping and sharing', 'k1Grouping', ['times'], { intro: 'Dividing can mean sharing equally, or making equal groups. Sometimes there are some left over: these are called the remainder.', teach: 'Explain why 13 cars need 4 transporters if each carries 4.', talk: 'Share some biscuits equally and ask {him} how many are left over.' }),
  T('charts', 'Block charts and tables', 'k1Charts', ['data'], { intro: 'A block chart (bar chart) shows numbers as tall bars. Always look at the scale on the side: it might go up in 2s!', teach: 'Explain how to find the difference between the tallest and shortest bars.', talk: 'Make a block chart of the family’s favourite fruits.' }),
  T('amounts', 'Making amounts and change', 'k1Amounts', ['money'], { intro: 'There are lots of ways to make the same amount with coins. Finding change means counting on from what it costs to what you paid.', teach: 'Explain two different ways to make 50p.', talk: 'Play shops with real coins: price toys and give change.' }),
  T('durations', 'How long does it take?', 'k1Durations', ['time'], { intro: 'Time passes in minutes and hours. To find how long something takes, count on from the start time to the finish time.', teach: 'Explain how to work out when a 30-minute race finishes if it starts at quarter past 2.', talk: 'Ask {him} how long until dinner, or how long the car journey took.' }),
  { id: 'maths.facts-2', title: 'More number facts', kind: 'facts', prereqs: ['maths.facts'], batch: 5, intro: 'More facts to know by heart: days in a year, sides of shapes, and number words.', teach: 'Explain how many days are in a year, and what a leap year is.', talk: 'Ask {him} to spell a number word, like “twelve” or “forty”.' },
  { id: 'maths.puzzles', title: 'Puzzles and proof', kind: 'facts', prereqs: ['maths.addsub', 'maths.times'], batch: 4, intro: 'Greater depth means thinking hard: finding all the answers, spotting patterns and explaining why.', teach: 'Explain how you know you have found ALL the ways.', talk: 'Ask {him} a “what number am I?” puzzle at dinner.' },
  // Year 3 tasters
  T('times10', 'Multiplying and dividing by 10 and 100', 'k1Times10', ['times', 'hundreds'], { tier: 'stretch', intro: 'Multiplying by 10 makes a number ten times bigger: the digits shift one place to the left. Dividing by 10 shifts them back.', teach: 'Explain what happens to the digits of 7 when you multiply by 100.', talk: 'Ask {him} how many pence are in £3, £5 and £10.' }),
  T('perimeter', 'Perimeter', 'k1Perimeter', ['measure', 'addsub'], { tier: 'stretch', intro: 'Perimeter is the distance all the way round the outside of a shape, like one lap of a race track.', teach: 'Explain how to find the perimeter of a rectangle quickly.', talk: 'Measure round a table or a book with a tape measure.' }),
  T('roman', 'Roman numerals', 'k1Roman', ['place'], { tier: 'stretch', intro: 'The Romans wrote numbers with letters: I = 1, V = 5, X = 10. You still see them on clocks and in film titles.', teach: 'Explain why 4 is written IV, not IIII.', talk: 'Find Roman numerals on a clock face, a building or a book.' }),
];

const FACTS_2 = [
  ['How many days are in a year (not a leap year)?', '365', ['356', '100', '52'], 'A year has 365 days. A leap year has 366: an extra day on 29 February.'],
  ['How many weeks are in a year?', '52', ['12', '365', '100'], '52 weeks, and one day more.'],
  ['How many days are in a fortnight?', '14', ['10', '7', '15'], 'A fortnight is two weeks: 2 × 7 = 14.'],
  ['How many days are in September?', '30', ['31', '28', '29'], '“Thirty days has September, April, June and November…”'],
  ['Which month has 28 days (29 in a leap year)?', 'February', ['January', 'March', 'June'], 'February is the shortest month.', { accept: ['february', 'feb'] }],
  ['How many grams are in 1 kilogram?', '1000', ['100', '10', '60'], 'Kilo means a thousand: 1 kg = 1000 g.'],
  ['How many millilitres are in 1 litre?', '1000', ['100', '10', '500'], '1 litre = 1000 ml. A big bottle of pop is often 2 litres.'],
  ['What number is “forty-seven” in digits?', '47', ['407', '74', '4007'], 'Forty = 4 tens, seven = 7 ones: 47.'],
  ['What is the number word for 19?', 'nineteen', ['ninety', 'ninteen', 'nine'], 'Nineteen keeps the “e” of nine: nine-teen.', { accept: ['nineteen'] }],
  ['What is the number word for 90?', 'ninety', ['nineteen', 'ninty', 'nine hundred'], 'Ninety keeps the “e” of nine too: nine-ty.', { accept: ['ninety'] }],
  ['How many sides does a quadrilateral have?', '4', ['3', '5', '6'], 'Quad means four. Squares, rectangles and kites are all quadrilaterals.'],
  ['How many edges does a cube have?', '12', ['6', '8', '4'], '4 round the top, 4 round the bottom and 4 going up: 12.'],
  ['What is the name of a 3D shape with a square base and triangle faces meeting at a point?', 'a square-based pyramid', ['a triangular prism', 'a cylinder', 'a hexagonal prism'], 'Like the pyramids in Egypt!', { ...choiceOnly }],
  ['Which is the smallest: 0, 10 or 1?', '0', ['10', '1', 'they are equal'], 'Zero means none at all: it is smaller than every counting number.', choiceOnly],
];

const items = [
  ...TOPICS.filter((t) => t.gen).map((t) => ({ id: `${t.id}.tmpl`, topic: t.id, kind: 'template', gen: t.gen, levels: [1, 2, 3], seed: [-1, 0, 1] })),
  ...FACTS_2.map(([prompt, answer, distractors, explain, extra], i) => fact(`f2.${i + 1}`, 'facts-2', prompt, answer, distractors, explain, extra || {})),
  // puzzles: find all the ways, missing digits, what number am I, explain the pattern
  mcq('pz.ways', 'puzzles', 'How many different ways can you make 5 by adding two whole numbers (counting 0 + 5 and 5 + 0 as different)?', [['6 ways', true], ['5 ways', false, 'Did you remember 0 + 5 and 5 + 0? List them: 0+5, 1+4, 2+3, 3+2, 4+1, 5+0.'], ['3 ways', false, 'That is if you don’t count turnarounds (0 + 5, 1 + 4, 2 + 3). There are 6 when you list them all.']], 'Work systematically: 0 + 5, 1 + 4, 2 + 3, 3 + 2, 4 + 1, 5 + 0. Six ways. Going in order means you never miss one.'),
  mcq('pz.digit', 'puzzles', '4? + 23 = 68. What is the missing digit?', [['5', true], ['4', false, '44 + 23 = 67, not 68.'], ['6', false, '46 + 23 = 69.']], 'The ones must make 8: ? + 3 = 8, so ? = 5. Check: 45 + 23 = 68.'),
  mcq('pz.whoami', 'puzzles', 'I am a 2-digit number. My tens digit is 3. My ones digit is double my tens digit. What am I?', [['36', true], ['33', false, 'The ones digit is DOUBLE 3, which is 6.'], ['63', false, 'The TENS digit is 3, so the number starts with 3.']], 'Tens = 3, ones = double 3 = 6. The number is 36.'),
  mcq('pz.pattern', 'puzzles', '5, 10, 15, 20… Will 63 be in this pattern?', [['No, it skips 63', true], ['Yes: the pattern goes on forever', false, 'It goes on forever, but it only hits numbers ending in 0 or 5.'], ['Only if you count backwards', false, 'Backwards gets smaller, away from 63.']], 'Counting in 5s always lands on numbers ending in 5 or 0, so 63 is never reached.'),
  mcq('pz.balance', 'puzzles', '15 + 5 = 12 + ?', [['8', true], ['20', false, '20 is what 15 + 5 makes. The other side needs to make 20 too: 12 + 8.'], ['3', false, '12 + 3 = 15, not 20.']], 'The = sign means “is the same as”. 15 + 5 = 20, so 12 + ? = 20, and ? = 8.'),
  mcq('pz.greatest', 'puzzles', 'Using the digits 4, 7 and 1 once each, what is the GREATEST 2-digit number you can make?', [['74', true], ['47', false, 'Put the biggest digit in the tens place: 74.'], ['71', false, '7 is right for tens, but 4 is bigger than 1 for the ones.']], 'Biggest digit in the tens (7), next biggest in the ones (4): 74.'),
  mcq('pz.legs', 'puzzles', 'There are some robots and some cats. Robots have 2 legs, cats have 4. There are 3 of them altogether, with 10 legs. How many are cats?', [['2 cats and 1 robot', true], ['1 cat and 2 robots', false, '4 + 2 + 2 = 8 legs, not 10.'], ['3 cats', false, '3 cats would have 12 legs.']], 'Try it: 2 cats = 8 legs, 1 robot = 2 legs, total 10. Trial and improvement!'),
  mcq('pz.prove', 'puzzles', '{hero} says: “If you double any number, the answer is always even.” Is that true for whole numbers?', [['Yes: doubles make pairs', true], ['No: double 3 is an odd number', false, 'Double 3 is 6, which is even!'], ['Only when you double even numbers', false, 'Double 5 = 10, double 7 = 14: odd numbers doubled are even too.']], 'Doubling a number makes two equal groups, so it can always be put into pairs: even.'),
  mcq('pz.sum', 'puzzles', 'Two numbers add to 10 and one is 4 more than the other. What are they?', [['3 and 7', true], ['4 and 6', false, '6 is only 2 more than 4.'], ['2 and 8', false, '8 is 6 more than 2.']], '3 + 7 = 10, and 7 − 3 = 4. Try pairs that make 10 until the difference is 4.'),
  mcq('pz.half', 'puzzles', 'Half of a number is 9. What is a quarter of the number?', [['4 and a half', true], ['18', false, '18 is the whole number. A quarter is half of 9.'], ['3', false, 'A quarter is half of a half: half of 9 is 4 and a half.'], ['2 and a quarter', false, 'That is half of 4 and a half. The whole is 18, so a quarter is 4 and a half.']], 'The whole is 18. A quarter is half of half: half of 9 = 4½. Greater depth answers can be halves!'),
];

export default [{
  subject: 'maths', deck: 'more',
  topics: TOPICS.map(({ gen, ...t }) => ({ kind: gen ? 'skill' : 'facts', ...t })),
  items,
}];

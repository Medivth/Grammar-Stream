// Year 8 computing generators, part 2: functions, dictionaries, strings, grids, validation,
// bug hunting, algorithm tracing and efficiency, stacks and queues, run-length encoding, the
// Vigenère cipher, HTML and CSS, SQL with aggregates, clock speed; GCSE tasters (recursion,
// shortest paths, Boolean expressions, Huffman codes). Same contract as js/gen/maths.js.
// Code is shown in ```fenced``` blocks and every Python program prints exactly one line. When the
// question asks for something other than that line, `_py` holds a program that prints the answer
// (used only by the verification script); `_sql` holds a table and query for SQL questions.

import { normalise } from '../core/checkers.js';

const code = (...lines) => '```\n' + lines.join('\n') + '\n```';
const list = (xs) => xs.join(', ');
const pyList = (xs) => `[${xs.map((x) => (typeof x === 'string' ? `"${x}"` : x)).join(', ')}]`;

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([normalise(correct)]);
  const ws = [];
  for (const w of wrongs) {
    const t = typeof w === 'string' ? w : w.text;
    if (seen.has(normalise(t))) continue;
    seen.add(normalise(t));
    ws.push(typeof w === 'string' ? { text: w } : w);
  }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws]), ...extra };
}
const num = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
const text = (prompt, answer, explain, steps, extra = {}) => ({ kind: 'typed', prompt, answer, strict: true, explain, steps, ...extra });

const HEROES = ['Perseus', 'Theseus', 'Jason', 'Atalanta', 'Odysseus', 'Achilles', 'Hippolyta', 'Orpheus', 'Cadmus', 'Penelope'];
const GODS = ['Zeus', 'Hera', 'Athena', 'Apollo', 'Artemis', 'Hermes', 'Poseidon', 'Hades', 'Demeter', 'Ares', 'Hestia'];
// each hero with a monster from their own myth
const HERO_MONSTERS = [['Theseus', 'Minotaur'], ['Perseus', 'Medusa'], ['Heracles', 'Hydra'], ['Odysseus', 'Cyclops'], ['Bellerophon', 'Chimera'], ['Jason', 'dragon']];
const WORDS = ['ATHENA', 'HERMES', 'OLYMPUS', 'LABYRINTH', 'ODYSSEY', 'PEGASUS', 'TRIDENT', 'ORACLE', 'SPARTA', 'DELPHI', 'MINOTAUR', 'ARGONAUT'];
const KIDS = ['Mira', 'Theo', 'Kit'];
const sample = (rng, arr, k) => rng.shuffle(arr).slice(0, k);
const VIGPY = "def vig(w, k, sign):\n    return ''.join(chr((ord(c) - 65 + sign * (ord(k[i % len(k)]) - 65)) % 26 + 65) for i, c in enumerate(w))\n";
const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];

function bubblePass(xs) {
  const a = xs.slice();
  for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
  return a;
}
function vigenere(word, key, sign = 1) {
  return [...word].map((c, i) => String.fromCharCode(((c.charCodeAt(0) - 65 + sign * (key.charCodeAt(i % key.length) - 65) + 26 * 4) % 26) + 65)).join('');
}
function rle(s) {
  let out = '';
  for (let i = 0; i < s.length;) { let j = i; while (j < s.length && s[j] === s[i]) j++; out += `${j - i}${s[i]}`; i = j; }
  return out;
}

export const Y8_COMPUTING2_GENERATORS = {
  // --- functions -----------------------------------------------------------------------------
  y8dFunctions(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const w = rng.int(2, 9), h = rng.int(2, 9), extra = rng.int(1, 9);
        return num(`What does this program print?\n${code('def area(width, height):', '    return width * height', '', `print(area(${w}, ${h}) + ${extra})`)}`, w * h + extra, `area(${w}, ${h}) returns ${w} × ${h} = ${w * h}; then ${extra} is added: ${w * h + extra}.`, ['The arguments are copied into the parameters: width = ' + w + ', height = ' + h + '.', `return sends back ${w * h}.`, `${w * h} + ${extra} = ${w * h + extra}.`]);
      }
      const m = rng.int(2, 5), a = rng.int(2, 9), b = rng.int(2, 9);
      return num(`What does this program print?\n${code('def boost(x):', `    return x * ${m}`, '', `print(boost(${a}) + boost(${b}))`)}`, a * m + b * m, `boost(${a}) = ${a * m} and boost(${b}) = ${b * m}. Together: ${a * m + b * m}.`, ['Each call runs the function separately.', `boost(${a}) = ${a * m}, boost(${b}) = ${b * m}.`, `${a * m} + ${b * m} = ${a * m + b * m}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const g = rng.int(5, 15), arg = rng.int(20, 40), k = rng.int(2, 9);
        return num(`Scope: what does this program print?\n${code(`gold = ${g}`, '', 'def spend(gold):', `    gold = gold - ${k}`, '    return gold', '', `left = spend(${arg})`, 'print(gold + left)')}`, g + (arg - k), `Inside the function, gold is a local parameter that starts as ${arg}; changing it does not change the global gold, which stays ${g}. left = ${arg - k}, so ${g} + ${arg - k} = ${g + arg - k}.`, ['The parameter gold is a different variable from the gold outside (it is local).', `spend(${arg}) returns ${arg} − ${k} = ${arg - k}.`, `The global gold is still ${g}: ${g} + ${arg - k} = ${g + arg - k}.`]);
      }
      const a = rng.int(2, 6), b = rng.int(1, 5), x = rng.int(1, 4);
      const inner = x + b, outer = inner * a;
      return num(`What does this program print?\n${code('def add(n):', `    return n + ${b}`, '', 'def times(n):', `    return add(n) * ${a}`, '', `print(times(${x}))`)}`, outer, `times(${x}) first calls add(${x}) = ${inner}, then multiplies by ${a}: ${outer}.`, [`times(${x}) needs add(${x}) first.`, `add(${x}) = ${x} + ${b} = ${inner}.`, `${inner} × ${a} = ${outer}.`]);
    }
    if (rng.chance(0.5)) {
      const n = rng.int(10, 30), m = rng.pick([3, 4, 5]);
      let t = 0; for (let i = 1; i <= n; i++) if (i % m === 0) t += i;
      return num(`What does this program print?\n${code('def total(n):', '    t = 0', '    for i in range(1, n + 1):', `        if i % ${m} == 0:`, '            t = t + i', '    return t', '', `print(total(${n}))`)}`, t, `The function adds the multiples of ${m} up to ${n}: ${Array.from({ length: Math.floor(n / m) }, (_, k) => m * (k + 1)).join(' + ')} = ${t}.`, [`i % ${m} == 0 picks out multiples of ${m}.`, `Multiples of ${m} up to ${n}: ${Array.from({ length: Math.floor(n / m) }, (_, k) => m * (k + 1)).join(', ')}.`, `Their total is ${t}.`]);
    }
    const xs = sample(rng, [4, 7, 9, 12, 15, 18, 21, 26, 30, 33], 6), t = rng.int(10, 25);
    const first = xs.find((x) => x > t) ?? 0;
    return num(`What does this program print?\n${code('def first_big(values, limit):', '    for v in values:', '        if v > limit:', '            return v', '    return 0', '', `print(first_big(${pyList(xs)}, ${t}))`)}`, first, first ? `return stops the function immediately, at the first value bigger than ${t}: ${first}.` : `No value is bigger than ${t}, so the loop finishes and the function returns 0.`, ['The loop checks the values in order.', `return ends the function as soon as a value is bigger than ${t}.`, `It prints ${first}.`]);
  },

  // --- dictionaries --------------------------------------------------------------------------
  y8dDicts(level, rng) {
    const [hero, monster] = rng.pick(HERO_MONSTERS), q = rng.int(2, 9);
    if (level === 1) {
      const key = rng.pick(['name', 'monster']);
      const ans = key === 'name' ? hero : monster;
      return text(`What does this program print?\n${code(`hero = {"name": "${hero}", "monster": "${monster}", "quests": ${q}}`, `print(hero["${key}"])`)}`, ans, `A dictionary stores key: value pairs. The key "${key}" looks up the value ${ans}.`, ['Find the key inside the square brackets.', `"${key}" is paired with "${ans}".`, `It prints ${ans}.`]);
    }
    const gods = sample(rng, GODS, 4), vals = gods.map(() => rng.int(2, 20));
    const d = `power = {${gods.map((g, i) => `"${g}": ${vals[i]}`).join(', ')}}`;
    if (level === 2) {
      if (rng.chance(0.5)) {
        const i = rng.int(0, 3), j = (i + rng.int(1, 3)) % 4, k = rng.int(2, 9);
        return num(`What does this program print?\n${code(d, `power["${gods[i]}"] = power["${gods[i]}"] + ${k}`, `print(power["${gods[i]}"] + power["${gods[j]}"])`)}`, vals[i] + k + vals[j], `${gods[i]} goes from ${vals[i]} to ${vals[i] + k}; ${gods[j]} is ${vals[j]}. Total ${vals[i] + k + vals[j]}.`, [`power["${gods[i]}"] is updated to ${vals[i]} + ${k} = ${vals[i] + k}.`, `power["${gods[j]}"] is ${vals[j]}.`, `${vals[i] + k} + ${vals[j]} = ${vals[i] + k + vals[j]}.`]);
      }
      const existing = rng.chance(0.5), newKey = existing ? rng.pick(gods) : rng.pick(GODS.filter((g) => !gods.includes(g)));
      return num(`What does this program print?\n${code(d, `power["${newKey}"] = 1`, 'print(len(power))')}`, existing ? 4 : 5, existing ? `"${newKey}" is already a key, so its value is replaced: the dictionary still has 4 keys.` : `"${newKey}" is a new key, so a new pair is added: 5 keys.`, ['Assigning to a key either updates it (if it exists) or adds it (if not).', existing ? `"${newKey}" already exists.` : `"${newKey}" is new.`, `len(power) is ${existing ? 4 : 5}.`]);
    }
    if (rng.chance(0.5)) {
      const t = rng.int(5, 15), c = vals.filter((v) => v > t).length;
      return num(`What does this program print?\n${code(d, 'count = 0', 'for god in power:', `    if power[god] > ${t}:`, '        count = count + 1', 'print(count)')}`, c, `Looping over a dictionary gives its keys; the values bigger than ${t} are ${vals.filter((v) => v > t).join(', ') || 'none'}.`, ['for god in power: gives each key in turn.', `power[god] looks up its value; check each against ${t}.`, `${c} value${c === 1 ? ' is' : 's are'} bigger.`]);
    }
    const probe = rng.chance(0.5) ? rng.pick(gods) : rng.pick(GODS.filter((g) => !gods.includes(g)));
    const isIn = gods.includes(probe);
    return text(`What does this program print?\n${code(d, `print("${probe}" in power)`)}`, isIn ? 'True' : 'False', `in checks whether a KEY is in the dictionary. "${probe}" ${isIn ? 'is' : 'is not'} one of the keys.`, ['in looks at the keys, not the values.', `The keys are ${list(gods)}.`, `It prints ${isIn ? 'True' : 'False'}.`]);
  },

  // --- strings -------------------------------------------------------------------------------
  y8dStrings(level, rng) {
    const w = rng.pick(WORDS);
    if (level === 1) {
      const kind = rng.pick(['count', 'find', 'ends']);
      if (kind === 'count') {
        const ch = rng.pick([...new Set(w)].filter((c) => 'AEIOUS'.includes(c)).concat(w[0]));
        const n = [...w].filter((c) => c === ch).length;
        return num(`What does this program print?\n${code(`word = "${w}"`, `print(word.count("${ch}"))`)}`, n, `"${w}" contains ${n} ${ch}${n === 1 ? '' : 's'}.`, ['count() counts how many times a character appears.', `Look for ${ch} in ${w}.`, `There ${n === 1 ? 'is' : 'are'} ${n}.`]);
      }
      if (kind === 'find') {
        const ch = rng.pick([...new Set(w)]);
        const i = w.indexOf(ch);
        return num(`What does this program print?\n${code(`word = "${w}"`, `print(word.find("${ch}"))`)}`, i, `find() gives the index of the first ${ch}. Counting from 0, that is ${i}.`, ['Indexes start at 0.', `The first ${ch} in ${w} is at position ${i + 1} if you count from 1.`, `So find() returns ${i}.`]);
      }
      return text(`What does this program print?\n${code(`word = "${w}"`, 'print(word[0] + word[-1])')}`, w[0] + w[w.length - 1], `word[0] is the first character (${w[0]}) and word[-1] the last (${w[w.length - 1]}). + joins them.`, ['[0] is the first character.', '[-1] is the last.', `${w[0]} + ${w[w.length - 1]} = ${w[0] + w[w.length - 1]}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['fstring', 'split', 'replace']);
      if (kind === 'fstring') {
        const name = rng.pick(KIDS), n = rng.int(2, 9), m = rng.int(2, 4);
        return text(`What does this program print?\n${code(`name = "${name}"`, `owls = ${n}`, `print(f"{name} has {owls * ${m}} owls")`)}`, `${name} has ${n * m} owls`, `In an f-string, anything in {curly brackets} is worked out and inserted: owls * ${m} = ${n * m}.`, ['f"…" lets you put expressions inside {}.', `{owls * ${m}} becomes ${n * m}.`, `It prints: ${name} has ${n * m} owls.`]);
      }
      if (kind === 'split') {
        const phrase = rng.pick(['the wine dark sea', 'sing to me of the man', 'rosy fingered dawn appeared', 'the bright eyed goddess Athena']);
        const parts = phrase.split(' ');
        if (rng.chance(0.5)) return num(`What does this program print?\n${code(`line = "${phrase}"`, 'words = line.split()', 'print(len(words))')}`, parts.length, `split() breaks the string at each space into a list of ${parts.length} words.`, ['split() with no argument splits on spaces.', `The list is ${pyList(parts)}.`, `len() is ${parts.length}.`]);
        const i = rng.int(1, parts.length - 1);
        return text(`What does this program print?\n${code(`line = "${phrase}"`, 'words = line.split()', `print(words[${i}])`)}`, parts[i], `split() makes ${pyList(parts)}; index ${i} is "${parts[i]}".`, ['split() turns the sentence into a list of words.', `Indexes start at 0, so [${i}] is the ${ORD[i]} word.`, `It prints ${parts[i]}.`]);
      }
      const from = rng.pick([...new Set(w)].filter((c) => 'AEIOU'.includes(c))), to = rng.pick(['X', 'Z', 'Q']);
      const out = w.split(from).join(to);
      return text(`What does this program print?\n${code(`word = "${w}"`, `print(word.replace("${from}", "${to}"))`)}`, out, `replace() swaps EVERY ${from} for ${to}: ${out}.`, ['replace(old, new) changes every match, not just the first.', `Find each ${from} in ${w}.`, `Result: ${out}.`]);
    }
    const kind = rng.pick(['vowels', 'reverse', 'join']);
    if (kind === 'vowels') {
      const v = [...w].filter((c) => 'AEIOU'.includes(c)).length;
      return num(`What does this program print?\n${code(`word = "${w}"`, 'count = 0', 'for ch in word:', '    if ch in "AEIOU":', '        count = count + 1', 'print(count)')}`, v, `The loop looks at each letter of ${w}; ${v} of them are vowels.`, ['for ch in word: takes each character in turn.', 'ch in "AEIOU" is True for vowels.', `There are ${v} vowels.`]);
    }
    if (kind === 'reverse') {
      const s = rng.pick(WORDS.filter((x) => x.length <= 7)); // whole words: a cut-off word looks like a misspelling
      return text(`What does this program print?\n${code(`word = "${s}"`, 'print(word[::-1])')}`, [...s].reverse().join(''), 'A slice with a step of −1 goes backwards through the string, reversing it.', ['[::-1] means: whole string, step −1.', `So it reads ${s} from the end.`, `It prints ${[...s].reverse().join('')}.`]);
    }
    const xs = sample(rng, GODS, 3), sep = rng.pick(['-', '+', '/']);
    return text(`What does this program print?\n${code(`gods = ${pyList(xs)}`, `print("${sep}".join(gods))`)}`, xs.join(sep), `join() glues the list items together with "${sep}" between them.`, ['The string before .join is the separator.', `It goes between each pair: ${xs.join(` ${sep} `)}.`, `It prints ${xs.join(sep)}.`]);
  },

  // --- nested loops and grids ----------------------------------------------------------------
  y8dGrids(level, rng) {
    if (level === 1) {
      const rows = rng.int(2, 3), cols = rng.int(3, 4);
      const g = Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng.int(1, 9)));
      const r = rng.int(0, rows - 1), c = rng.int(0, cols - 1);
      return num(`What does this program print?\n${code(`grid = [${g.map((row) => pyList(row)).join(', ')}]`, `print(grid[${r}][${c}])`)}`, g[r][c], `grid[${r}] is row ${r} (${pyList(g[r])}), and [${c}] picks item ${c} of that row: ${g[r][c]}.`, ['The first index picks the row, the second the column.', `Row ${r}: ${pyList(g[r])}.`, `Item ${c}: ${g[r][c]}.`]);
    }
    if (level === 2) {
      const rows = 3, cols = rng.int(4, 5);
      const maze = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng.chance(0.4) ? 'W' : 'P')).join(''));
      const walls = maze.join('').split('').filter((ch) => ch === 'W').length;
      return num(`In Daedalus’s labyrinth map, W is a wall and P is a path. What does this program print?\n${code(`maze = ${pyList(maze)}`, 'walls = 0', 'for row in maze:', '    for square in row:', '        if square == "W":', '            walls = walls + 1', 'print(walls)')}`, walls, `The outer loop takes each row; the inner loop each square in it. ${walls} squares are walls.`, ['The inner loop runs completely for every row.', `Rows: ${maze.join(', ')}.`, `Counting the Ws: ${walls}.`]);
    }
    if (rng.chance(0.5)) {
      const a = rng.int(3, 5), b = rng.int(3, 6);
      let t = 0; for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) if ((i + j) % 2 === 0) t++;
      return num(`What does this program print?\n${code('count = 0', `for i in range(1, ${a + 1}):`, `    for j in range(1, ${b + 1}):`, '        if (i + j) % 2 == 0:', '            count = count + 1', 'print(count)')}`, t, `There are ${a} × ${b} = ${a * b} pairs (i, j); the ones with an even total are counted: ${t}. (Like the dark squares of a chessboard.)`, [`i goes 1 to ${a}; for each i, j goes 1 to ${b}.`, 'Count the pairs where i + j is even.', `${t} pairs.`]);
    }
    const rows = 3, cols = 3;
    const g = Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng.int(1, 9)));
    const c = rng.int(0, 2);
    const s = g.reduce((acc, row) => acc + row[c], 0);
    return num(`What does this program print?\n${code(`grid = [${g.map((row) => pyList(row)).join(', ')}]`, 'total = 0', 'for row in grid:', `    total = total + row[${c}]`, 'print(total)')}`, s, `row[${c}] picks the same column from each row: ${g.map((row) => row[c]).join(' + ')} = ${s}.`, ['Each time round, row is one whole row (a list).', `row[${c}] takes column ${c}: ${g.map((row) => row[c]).join(', ')}.`, `Total: ${s}.`]);
  },

  // --- validation ----------------------------------------------------------------------------
  y8dValidate(level, rng) {
    if (level === 1) {
      const lo = rng.pick([11, 12]), hi = rng.pick([16, 18]);
      const age = rng.pick([lo - 1, lo, rng.int(lo + 1, hi - 1), hi, hi + 1, rng.int(20, 40)]);
      const ok = age >= lo && age <= hi;
      return text(`A range check for the Junior Olympics. What does this program print?\n${code(`age = ${age}`, `if age >= ${lo} and age <= ${hi}:`, '    print("Accepted")', 'else:', '    print("Rejected")')}`, ok ? 'Accepted' : 'Rejected', `${age} is ${ok ? 'inside' : 'outside'} the range ${lo} to ${hi} (inclusive), so it is ${ok ? 'accepted' : 'rejected'}.`, [`>= and <= include the end values ${lo} and ${hi}.`, `Is ${age} between them? ${ok ? 'Yes' : 'No'}.`, `It prints ${ok ? 'Accepted' : 'Rejected'}.`]);
    }
    if (level === 2) {
      const base = rng.pick(['hermes', 'trident', 'owl', 'laurel', 'pegasus', 'aegis']);
      const digits = rng.chance(0.6) ? String(rng.int(1, 999)) : '';
      const pw = base + digits;
      const strong = pw.length >= 8 && digits.length > 0;
      return text(`A password check. What does this program print?\n${code(`pw = "${pw}"`, 'has_digit = False', 'for ch in pw:', '    if ch in "0123456789":', '        has_digit = True', 'if len(pw) >= 8 and has_digit:', '    print("Strong")', 'else:', '    print("Weak")')}`, strong ? 'Strong' : 'Weak', `"${pw}" has ${pw.length} characters and ${digits ? 'contains a digit' : 'no digit'}. It needs at least 8 characters AND a digit.`, [`len(pw) is ${pw.length}: ${pw.length >= 8 ? 'long enough' : 'too short'}.`, `has_digit is ${digits ? 'True' : 'False'}.`, `Both must be True: it prints ${strong ? 'Strong' : 'Weak'}.`]);
    }
    const lo = 11, hi = 16;
    const [val, kind] = rng.pick([[String(rng.int(12, 15)), 'normal'], ['11', 'boundary'], ['16', 'boundary'], ['"eleven"', 'erroneous'], [String(rng.int(25, 60)), 'erroneous'], ['-3', 'erroneous']]);
    const label = { normal: 'normal (valid, typical)', boundary: 'boundary (valid, but at the very edge)', erroneous: 'erroneous (should be rejected)' };
    return choice(`A program should accept ages from ${lo} to ${hi} inclusive. Which kind of test data is ${val.replace('-', '−')}?`, label[kind], Object.values(label), rng, { explain: kind === 'normal' ? `${val} is comfortably inside the range: normal data checks the program works for ordinary input.` : kind === 'boundary' ? `${val} is exactly at the limit. Boundary data catches mistakes like writing > instead of >=.` : `${val.replace('-', '−')} should be rejected (out of range or the wrong type). Erroneous data checks the program refuses bad input without crashing.`, steps: ['Normal data: typical valid values.', 'Boundary data: values at the very edge of what is valid.', 'Erroneous data: values the program must reject.'] });
  },

  // --- bug hunting ---------------------------------------------------------------------------
  y8dBug(level, rng) {
    if (level === 1) {
      const n = rng.int(5, 12), right = (n * (n + 1)) / 2, wrong = (n * (n - 1)) / 2;
      return choice(`This program should print the total of 1 to ${n} (${right}), but it prints ${wrong}. Which change fixes it?\n${code('total = 0', `for i in range(1, ${n}):`, '    total = total + i', 'print(total)')}`, `Change range(1, ${n}) to range(1, ${n + 1})`, [`Change range(1, ${n}) to range(0, ${n})`, 'Change total = 0 to total = 1', 'Move print(total) inside the loop', 'Change total + i to total * i'], rng, { explain: `range stops BEFORE its end value, so range(1, ${n}) misses ${n}. range(1, ${n + 1}) includes it. (Starting at 0 only adds 0, which changes nothing.)`, steps: [`The output is ${right} − ${wrong} = ${n} too small.`, `range(1, ${n}) gives 1 to ${n - 1}: the last number is missing.`, `Use range(1, ${n + 1}).`], _py: `total = 0\nfor i in range(1, ${n + 1}):\n    total = total + i\nprint(total)`, _expect: right, _pyBug: `total = 0\nfor i in range(1, ${n}):\n    total = total + i\nprint(total)`, _bugOut: wrong });
    }
    if (level === 2) {
      let scores, pass;
      do { scores = Array.from({ length: 6 }, () => rng.int(30, 90)); pass = rng.pick(scores); } while (scores.filter((s) => s === pass).length !== 1);
      const right = scores.filter((s) => s >= pass).length, wrong = scores.filter((s) => s > pass).length;
      return choice(`A pass is ${pass} or more. This program should count the passes (${right}) but prints ${wrong}. Which change fixes it?\n${code(`scores = ${pyList(scores)}`, 'passes = 0', 'for s in scores:', `    if s > ${pass}:`, '        passes = passes + 1', 'print(passes)')}`, `Change s > ${pass} to s >= ${pass}`, [`Change s > ${pass} to s < ${pass}`, 'Change passes = 0 to passes = 1', `Change s > ${pass} to s == ${pass}`, 'Indent print(passes) inside the loop'], rng, { explain: `> leaves out a score of exactly ${pass}, which should count as a pass. >= includes it. (passes = 1 would give the right number here only by luck: it would be wrong for other data.)`, steps: [`One score is exactly ${pass}.`, `s > ${pass} is False for it, so it is not counted.`, `s >= ${pass} counts it: ${right}.`], _py: `scores = ${pyList(scores)}\npasses = 0\nfor s in scores:\n    if s >= ${pass}:\n        passes = passes + 1\nprint(passes)`, _expect: right, _pyBug: `scores = ${pyList(scores)}\npasses = 0\nfor s in scores:\n    if s > ${pass}:\n        passes = passes + 1\nprint(passes)`, _bugOut: wrong });
    }
    // re-roll until the last score differs from the mean, or the bug would not show
    let xs;
    do xs = Array.from({ length: 4 }, () => rng.int(2, 9) * 2); while (xs[3] * 4 === xs.reduce((a, b) => a + b, 0));
    const right = xs.reduce((a, b) => a + b, 0) / 4;
    const shown = Number.isInteger(right) ? `${right}.0` : String(right); // / always gives a float in Python 3: 40 / 4 prints 10.0
    const wrongOut = xs[3];
    return choice(`This program should print the mean of the four scores (${shown}) but prints ${wrongOut}. Which change fixes it?\n${code(`scores = ${pyList(xs)}`, 'for s in scores:', '    total = 0', '    total = total + s', 'print(total)')}`, 'Move total = 0 above the loop and print total / len(scores)', ['Change total = 0 to total = 1', 'Change for s in scores to for s in range(scores)', 'Print total * len(scores)', 'Move print(total) inside the loop'], rng, { explain: `total = 0 inside the loop resets the total every time, so only the last score (${wrongOut}) survives. Set it to 0 once, before the loop, then divide by len(scores) to get the mean.`, steps: ['Look at what happens to total on every pass.', `It is reset to 0 each time, so only ${wrongOut} is kept.`, `Initialise before the loop, then divide: ${xs.join(' + ')} = ${xs.reduce((a, b) => a + b, 0)}, ÷ 4 = ${right}${shown === String(right) ? '' : ` (Python prints ${shown}, because / always gives a decimal)`}.`], _py: `scores = ${pyList(xs)}\ntotal = 0\nfor s in scores:\n    total = total + s\nprint(total / len(scores))`, _expect: shown, _pyBug: `scores = ${pyList(xs)}\nfor s in scores:\n    total = 0\n    total = total + s\nprint(total)`, _bugOut: wrongOut });
  },

  // --- tracing algorithms --------------------------------------------------------------------
  y8dAlgoTrace(level, rng) {
    if (level === 1) {
      const xs = sample(rng, [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], 9).sort((a, b) => a - b);
      let lo = 0, hi = xs.length - 1; const checked = [];
      let target;
      do { target = rng.pick(xs); } while (xs.indexOf(target) === 4);
      while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); checked.push(xs[mid]); if (xs[mid] === target) break; if (xs[mid] < target) lo = mid + 1; else hi = mid - 1; }
      return num(`Binary search for ${target} in ${list(xs)}. Which number is checked SECOND? (When there are two middle items, take the left one.)`, checked[1], `First check: the middle item, ${checked[0]}. ${target} is ${target < checked[0] ? 'smaller' : 'bigger'}, so the search keeps the ${target < checked[0] ? 'left' : 'right'} half and checks its middle: ${checked[1]}.`, [`The middle of 9 items is item 5: ${checked[0]}.`, `${target} ${target < checked[0] ? '<' : '>'} ${checked[0]}, so throw away the other half.`, `The middle of what is left is ${checked[1]}.`], { _py: `xs = ${pyList(xs)}\nlo, hi = 0, len(xs) - 1\nseen = []\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    seen.append(xs[mid])\n    if xs[mid] == ${target}:\n        break\n    elif xs[mid] < ${target}:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nprint(seen[1])` });
    }
    if (level === 2) {
      let xs; do { xs = sample(rng, [3, 6, 9, 12, 15, 18, 21, 24], 5); } while (bubblePass(xs).join() === bubblePass(bubblePass(xs)).join());
      const two = bubblePass(bubblePass(xs)), one = bubblePass(xs), sorted = xs.slice().sort((a, b) => a - b);
      return choice(`A bubble sort (ascending) starts with ${list(xs)}. What is the list after TWO complete passes?`, list(two), [list(one), list(sorted), list(xs), list(bubblePass(two))], rng, { explain: `Pass 1 gives ${list(one)} (the biggest is now at the end). Pass 2 repeats the comparisons and gives ${list(two)}.`, steps: ['Each pass compares neighbours left to right and swaps if the left one is bigger.', `After pass 1: ${list(one)}.`, `After pass 2: ${list(two)}.`], _py: `xs = ${pyList(xs)}\nfor p in range(2):\n    for i in range(len(xs) - 1):\n        if xs[i] > xs[i + 1]:\n            xs[i], xs[i + 1] = xs[i + 1], xs[i]\nprint(", ".join(str(x) for x in xs))` });
    }
    const xs = sample(rng, [4, 9, 13, 18, 22, 27, 31, 36, 40, 45, 49, 54, 58, 63, 67], rng.pick([11, 13, 15])).sort((a, b) => a - b);
    const present = rng.chance(0.7), target = present ? rng.pick(xs) : xs[rng.int(0, xs.length - 2)] + 1;
    let lo = 0, hi = xs.length - 1, loops = 0;
    while (lo <= hi) { loops++; const mid = Math.floor((lo + hi) / 2); if (xs[mid] === target) break; if (xs[mid] < target) lo = mid + 1; else hi = mid - 1; }
    return num(`How many times does the while loop run?\n${code(`items = ${pyList(xs)}`, `target = ${target}`, 'low = 0', 'high = len(items) - 1', 'loops = 0', 'while low <= high:', '    loops = loops + 1', '    mid = (low + high) // 2', '    if items[mid] == target:', '        break', '    elif items[mid] < target:', '        low = mid + 1', '    else:', '        high = mid - 1', 'print(loops)')}`, loops, `Tracing low, high and mid: the loop runs ${loops} time${loops === 1 ? '' : 's'}${present ? ` before it finds ${target}` : ` before low passes high (${target} is not in the list)`}. A linear search could take up to ${xs.length}.`, ['Keep a trace table of low, high and mid.', 'Each time, half of what is left is thrown away.', `It runs ${loops} time${loops === 1 ? '' : 's'}.`]);
  },

  // --- efficiency ----------------------------------------------------------------------------
  y8dEfficiency(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const n = rng.pick([50, 100, 500, 1000, 2000]);
        return num(`A linear search looks through an unsorted list of ${n.toLocaleString('en-GB')} names. In the worst case, how many names does it check?`, n, `Worst case: the name is last, or not there at all, so all ${n.toLocaleString('en-GB')} are checked.`, ['Linear search checks one item at a time from the start.', 'The worst case is when the item is at the end or missing.', `${n.toLocaleString('en-GB')} checks.`]);
      }
      const xs = sample(rng, HEROES, 7), i = rng.int(1, 6);
      return num(`A linear search for ${xs[i]} checks ${list(xs)} in order. How many comparisons does it make?`, i + 1, `It checks ${xs.slice(0, i + 1).join(', ')}: ${i + 1} comparisons.`, ['Start at the first item.', `${xs[i]} is item ${i + 1}.`, `${i + 1} comparisons.`]);
    }
    if (level === 2) {
      const n = rng.int(4, 9);
      if (rng.chance(0.5)) return num(`How many times is count increased?\n${code('count = 0', `for i in range(${n}):`, `    for j in range(${n}):`, '        count = count + 1', 'print(count)')}`, n * n, `${n} × ${n} = ${n * n}. Two nested loops over n items do n² steps, so doubling n makes the work four times bigger.`, [`The inner loop runs ${n} times for each outer loop.`, `The outer loop runs ${n} times.`, `${n} × ${n} = ${n * n}.`]);
      return num(`How many times is count increased?\n${code('count = 0', `for i in range(${n}):`, '    for j in range(i):', '        count = count + 1', 'print(count)')}`, (n * (n - 1)) / 2, `The inner loop runs 0, 1, 2, … ${n - 1} times: ${Array.from({ length: n }, (_, k) => k).join(' + ')} = ${(n * (n - 1)) / 2}. This is how bubble sort’s comparisons grow.`, ['range(i) runs i times: 0 the first time.', `Add 0 + 1 + … + ${n - 1}.`, `= ${(n * (n - 1)) / 2}.`]);
    }
    const [kind, factor, why] = rng.pick([['O(n)', 2, 'doubling n doubles the work'], ['O(n²)', 4, 'doubling n makes the work 2² = 4 times bigger'], ['O(1)', 1, 'constant time: the size of the list makes no difference']]);
    const t = rng.pick([2, 3, 5, 10]);
    if (rng.chance(0.6)) return num(`An algorithm is ${kind}. It takes ${t} seconds for 1,000 items. Roughly how many seconds will it take for 2,000 items?`, t * factor, `${kind}: ${why}, so ${t} × ${factor} = ${t * factor} seconds.`, ['Big-O describes how the work grows as the input grows.', `For ${kind}, ${why}.`, `${t} × ${factor} = ${t * factor}.`]);
    const n = rng.pick([1000, 4000, 16000, 64000]);
    const k = Math.floor(Math.log2(n)) + 1, k2 = Math.floor(Math.log2(2 * n)) + 1;
    return num(`Binary search on a sorted list of ${n.toLocaleString('en-GB')} items needs at most ${k} checks. At most how many checks for ${(2 * n).toLocaleString('en-GB')} items?`, k2, `Doubling the list adds just one more check (O(log n)): the first check halves ${(2 * n).toLocaleString('en-GB')} back to ${n.toLocaleString('en-GB')}.`, ['Each check halves the list.', 'Twice as many items need just one extra halving.', `${k} + 1 = ${k2}.`]);
  },

  // --- stacks and queues ---------------------------------------------------------------------
  y8dStack(level, rng) {
    const names = sample(rng, GODS, 5);
    if (level === 1) {
      const ops = [`stack.append("${names[0]}")`, `stack.append("${names[1]}")`, `stack.append("${names[2]}")`, 'stack.pop()', `stack.append("${names[3]}")`];
      const top = names[3];
      if (rng.chance(0.5)) return text(`A stack is last in, first out. What does this program print?\n${code('stack = []', ...ops, 'print(stack[-1])')}`, top, `pop() removes the most recently added item (${names[2]}). Then ${names[3]} is pushed on top.`, [`After three pushes: ${names.slice(0, 3).join(', ')} (top is ${names[2]}).`, `pop() removes ${names[2]}.`, `Push ${names[3]}: the top is ${top}.`]);
      return num(`What does this program print?\n${code('stack = []', ...ops, 'stack.pop()', 'print(len(stack))')}`, 2, `4 pushes and 2 pops leave 2 items (${names[0]}, ${names[1]}).`, ['Each append adds one item; each pop removes one.', 'Pushes: 4. Pops: 2.', '4 − 2 = 2 items.']);
    }
    if (level === 2) {
      return text(`A queue is first in, first out. What does this program print?\n${code('queue = []', `queue.append("${names[0]}")`, `queue.append("${names[1]}")`, `queue.append("${names[2]}")`, 'queue.pop(0)', `queue.append("${names[3]}")`, 'print(queue[0])')}`, names[1], `pop(0) removes the front of the queue (${names[0]}), so ${names[1]} is now at the front.`, [`The queue is ${names.slice(0, 3).join(', ')} (front first).`, `pop(0) removes ${names[0]}.`, `${names[3]} joins the back; the front is ${names[1]}.`]);
    }
    const s = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)], q = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
    const v = s[2] * 10 + q[0];
    return num(`What does this program print?\n${code(`stack = ${pyList(s)}`, `queue = ${pyList(q)}`, 'a = stack.pop()', 'b = queue.pop(0)', 'print(a * 10 + b)')}`, v, `stack.pop() takes the LAST item (${s[2]}); queue.pop(0) takes the FIRST (${q[0]}). ${s[2]} × 10 + ${q[0]} = ${v}.`, ['A stack removes from the end (the top).', 'A queue removes from the front.', `${s[2]} * 10 + ${q[0]} = ${v}.`]);
  },

  // --- compression ---------------------------------------------------------------------------
  y8dRLE(level, rng) {
    const runs = (k) => { const letters = rng.pick([['W', 'B'], ['A', 'B', 'C'], ['G', 'W']]); let s = '', last = ''; for (let i = 0; i < k; i++) { let c; do { c = rng.pick(letters); } while (c === last); last = c; s += c.repeat(rng.int(1, 5)); } return s; };
    if (level === 1) {
      const s = runs(3);
      return text(`Run-length encoding writes each run as a count then the character (AAAB becomes 3A1B). Encode ${s}.`, rle(s), `${s} has runs ${rle(s).match(/\d+\D/g).join(', ')}: ${rle(s)}.`, ['Group identical neighbouring characters into runs.', 'Write the length of each run, then its character.', `${rle(s)}.`], { _py: `s = "${s}"\nout = ""\ni = 0\nwhile i < len(s):\n    j = i\n    while j < len(s) and s[j] == s[i]:\n        j += 1\n    out += str(j - i) + s[i]\n    i = j\nprint(out)` });
    }
    if (level === 2) {
      const s = runs(4), e = rle(s);
      return text(`A row of a ${/^[BW]+$/.test(s) ? 'black-and-white ' : ''}Greek-key pattern is stored with run-length encoding as ${e}. Decode it.`, s, `Expand each count: ${e.match(/\d+\D/g).map((p) => `${p} → ${p.slice(-1).repeat(+p.slice(0, -1))}`).join('; ')}.`, ['Read the number, then the character it applies to.', 'Write that character that many times.', `${s}.`], { _py: `import re\nprint("".join(ch * int(n) for n, ch in re.findall(r"(\\d+)(\\D)", "${e}")))` });
    }
    const s = runs(rng.int(3, 5)), e = rle(s);
    return num(`${s} has ${s.length} characters. How many characters long is its run-length encoding?`, e.length, `The encoding is ${e}: ${e.length} characters, saving ${s.length - e.length}. RLE works well when there are long runs; for data like ABABAB it makes things BIGGER.`, ['Encode it first.', `Encoding: ${e}.`, `Length: ${e.length}.`], { _py: `from itertools import groupby\nprint(len("".join(str(len(list(g))) + k for k, g in groupby("${s}"))))` });
  },

  // --- the Vigenère cipher -------------------------------------------------------------------
  y8dVigenere(level, rng) {
    const shiftOf = (k) => k.charCodeAt(0) - 65;
    if (level === 1) {
      const w = rng.pick(['ZEUS', 'HERA', 'ARGO', 'TROY', 'OWL']), key = rng.pick(['AB', 'BA', 'AC', 'BC']);
      const out = vigenere(w, key);
      return text(`The Vigenère cipher shifts each letter by its key letter (A = 0, B = 1, C = 2…), repeating the key. Encrypt ${w} with the key ${key}.`, out, `Key letters ${[...w].map((_, i) => key[i % key.length]).join('')} mean shifts ${[...w].map((_, i) => shiftOf(key[i % key.length])).join(', ')}: ${out}.`, [`Repeat the key under the word: ${[...w].map((_, i) => key[i % key.length]).join('')}.`, `Shift each letter: ${[...w].map((c, i) => `${c}+${shiftOf(key[i % key.length])}`).join(', ')}.`, `${out}.`], { _py: `${VIGPY}print(vig("${w}", "${key}", 1))` });
    }
    if (level === 2) {
      const w = rng.pick(['DELPHI', 'SPARTA', 'ATHENS', 'HERMES', 'TROJAN']), key = rng.pick(['KEY', 'OWL', 'SEA', 'GOD']);
      const out = vigenere(w, key);
      return text(`Encrypt ${w} with the Vigenère key ${key} (A = 0, B = 1 … Z = 25; wrap round after Z).`, out, `The key repeats: ${[...w].map((_, i) => key[i % key.length]).join('')}. Shifts ${[...w].map((_, i) => shiftOf(key[i % key.length])).join(', ')} give ${out}.`, ['Write the key under the word, repeating it.', 'Shift each letter forward by its key letter’s number, wrapping round after Z.', `${out}.`], { _py: `${VIGPY}print(vig("${w}", "${key}", 1))` });
    }
    const w = rng.pick(['HYDRA', 'ATLAS', 'NYMPH', 'TITAN', 'GORGON']), key = rng.pick(['BE', 'CAT', 'DOG', 'SUN']);
    const enc = vigenere(w, key);
    return text(`Kit receives ${enc}, encrypted with the Vigenère key ${key}. Decrypt it.`, w, `Decrypting shifts each letter BACK by its key letter: ${[...enc].map((c, i) => `${c}−${shiftOf(key[i % key.length])}`).join(', ')} gives ${w}.`, ['Write the key under the ciphertext.', 'Shift each letter backwards by the key letter’s number.', `${w}.`], { _py: `${VIGPY}print(vig("${enc}", "${key}", -1))` });
  },

  // --- HTML and CSS --------------------------------------------------------------------------
  y8dHTML(level, rng) {
    if (level === 1) {
      const [g, b, title] = rng.pick([['Zeus', 'thunder', 'God'], ['Athena', 'wisdom', 'Goddess'], ['Poseidon', 'the sea', 'God'], ['Apollo', 'the sun', 'God'], ['Hermes', 'messages', 'God'], ['Demeter', 'the harvest', 'Goddess'], ['Artemis', 'the hunt', 'Goddess']]);
      if (rng.chance(0.5)) return text(`Which words does the \`<b>\` tag make **bold** on this page?\n${code(`<h1>${g}</h1>`, `<p>${title} of <b>${b}</b> and much more.</p>`)}`, b, `<b>…</b> makes the text between the tags bold: “${b}”. (The heading “${g}” shows in bold too, because browsers make <h1> headings bold by default, but that is not the <b> tag.)`, ['Tags come in pairs: <b> opens, </b> closes.', 'Only text between them is bold.', `“${b}”.`]);
      const n = rng.int(3, 5), items = sample(rng, HEROES, n);
      return num(`How many bullet points does this page show?\n${code('<ul>', ...items.map((x) => `  <li>${x}</li>`), '</ul>')}`, n, `<ul> is an unordered (bulleted) list; each <li> is one item: ${n}.`, ['<ul> starts a bulleted list.', 'Each <li>…</li> is one bullet point.', `${n} bullets.`]);
    }
    if (level === 2) {
      const place = rng.pick(['Delphi', 'Olympia', 'Knossos', 'Mycenae']), page = place.toLowerCase();
      return choice(`What does the visitor see and click?\n${code(`<a href="https://example.org/${page}.html">Visit ${place}</a>`)}`, `The words “Visit ${place}”, which open ${page}.html`, [`The address https://example.org/${page}.html`, `A picture of ${place}`, `A button labelled “href”`], rng, { explain: 'An <a> tag makes a link: the text between the tags is what shows, and href is the address it opens.', steps: ['href is hidden: it is where the link goes.', `The text between <a> and </a> is shown: “Visit ${place}”.`, `Clicking it opens ${page}.html.`] });
    }
    const [setup, ans, why] = rng.pick([
      [['p { color: red; }', '.warn { color: blue; }', '', '<p class="warn">Beware the Gorgon</p>'], 'blue', 'A class selector (.warn) is more specific than an element selector (p), so blue wins.'],
      [['p { color: green; }', '#oracle { color: purple; }', '.note { color: orange; }', '', '<p id="oracle" class="note">Know yourself</p>'], 'purple', 'An id selector (#oracle) beats a class selector (.note), which beats an element selector (p).'],
      [['h2 { color: black; }', 'h2 { color: gold; }', '', '<h2>The Golden Fleece</h2>'], 'gold', 'When two rules are equally specific, the later one wins: gold.'],
      [['.hero { color: navy; }', '', '<p>Achilles <span class="hero">and Patroclus</span></p>'], 'navy', 'Only the span has the class hero, so “and Patroclus” is navy.'],
    ]);
    const shown = setup.filter((l) => l.startsWith('<')).join('').replace(/<[^>]+>/g, '');
    return choice(`What colour is the text “${shown.replace(/^Achilles /, '')}”?\n${code('<style>', ...setup.filter((l) => !l.startsWith('<') && l), '</style>', ...setup.filter((l) => l.startsWith('<')))}`, ans, setup.join(' ').match(/color: (\w+)/g).map((m) => m.slice(7)).filter((c) => c !== ans).concat(['red', 'black']), rng, { explain: why, steps: ['CSS rules choose elements with selectors.', 'More specific selectors win: id > class > element; if equal, the later rule wins.', `So the text is ${ans}.`] });
  },

  // --- SQL in depth --------------------------------------------------------------------------
  y8dSQL(level, rng) {
    const all = [['Zeus', 'sky', 'thunderbolt', 98], ['Poseidon', 'sea', 'trident', 91], ['Athena', 'wisdom', 'owl', 88], ['Apollo', 'sun', 'lyre', 84], ['Artemis', 'hunt', 'bow', 82], ['Hermes', 'travel', 'sandals', 75], ['Ares', 'war', 'spear', 79], ['Hera', 'marriage', 'peacock', 90], ['Demeter', 'harvest', 'wheat', 77], ['Hades', 'underworld', 'helmet', 93], ['Hestia', 'hearth', 'flame', 70]];
    const rows = sample(rng, all, 7);
    const table = code('name     | domain     | symbol      | power', ...rows.map(([n, d, s, p]) => `${n.padEnd(8)} | ${d.padEnd(10)} | ${s.padEnd(11)} | ${p}`));
    const sql = { rows };
    const head = `Table **Gods**:\n${table}\n`;
    if (level === 1) {
      const t = rng.pick([80, 85, 90]);
      const n = rows.filter((r) => r[3] >= t).length;
      const q = `SELECT COUNT(*) FROM Gods WHERE power >= ${t};`;
      return num(`${head}What does this query return?\n${code(q)}`, n, `COUNT(*) counts the rows that match: power of ${t} or more — ${rows.filter((r) => r[3] >= t).map((r) => r[0]).join(', ') || 'none'}.`, ['WHERE filters the rows first.', `Rows with power >= ${t}: ${rows.filter((r) => r[3] >= t).map((r) => r[0]).join(', ') || 'none'}.`, `COUNT(*) gives ${n}.`], { _sql: { ...sql, q } });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const q = 'SELECT name FROM Gods ORDER BY power ASC LIMIT 1;';
        const ans = rows.slice().sort((a, b) => a[3] - b[3])[0][0];
        return text(`${head}What does this query return?\n${code(q)}`, ans, `ORDER BY power ASC sorts from weakest to strongest; LIMIT 1 keeps only the first row: ${ans}.`, ['ASC means ascending: smallest first.', 'LIMIT 1 returns just one row.', `The lowest power belongs to ${ans}.`], { _sql: { ...sql, q }, strict: false });
      }
      const fn = rng.pick(['MAX', 'MIN']);
      const q = `SELECT ${fn}(power) FROM Gods;`;
      const v = (fn === 'MAX' ? Math.max : Math.min)(...rows.map((r) => r[3]));
      return num(`${head}What does this query return?\n${code(q)}`, v, `${fn}() finds the ${fn === 'MAX' ? 'largest' : 'smallest'} value in the power column: ${v}.`, ['Aggregate functions work on a whole column.', `${fn} means ${fn === 'MAX' ? 'maximum' : 'minimum'}.`, `It returns ${v}.`], { _sql: { ...sql, q } });
    }
    if (rng.chance(0.5)) {
      const letter = rng.pick(['A', 'H', 'P', 'D']);
      const q = `SELECT COUNT(*) FROM Gods WHERE name LIKE '${letter}%';`;
      const n = rows.filter((r) => r[0].startsWith(letter)).length;
      return num(`${head}What does this query return? (In LIKE, % means “any characters”.)\n${code(q)}`, n, `LIKE '${letter}%' matches names starting with ${letter}: ${rows.filter((r) => r[0].startsWith(letter)).map((r) => r[0]).join(', ') || 'none'}.`, [`'${letter}%' means: ${letter}, then anything.`, `Names starting with ${letter}: ${rows.filter((r) => r[0].startsWith(letter)).map((r) => r[0]).join(', ') || 'none'}.`, `COUNT(*) is ${n}.`], { _sql: { ...sql, q } });
    }
    const t = rng.pick([80, 85]), d = rng.pick(rows)[1];
    const q = `SELECT SUM(power) FROM Gods WHERE power > ${t} OR domain = '${d}';`;
    const hit = rows.filter((r) => r[3] > t || r[1] === d);
    const v = hit.reduce((a, r) => a + r[3], 0);
    return num(`${head}What does this query return?\n${code(q)}`, v, `OR keeps a row if either condition is true: ${hit.map((r) => `${r[0]} (${r[3]})`).join(', ')}. Their sum is ${v}.`, [`Rows with power > ${t}, or with domain '${d}'.`, `Matching rows: ${hit.map((r) => r[0]).join(', ')}.`, `SUM: ${v}.`], { _sql: { ...sql, q } });
  },

  // --- clock speed and cores -----------------------------------------------------------------
  y8dClock(level, rng) {
    if (level === 1) {
      const g = rng.int(2, 5);
      return num(`A CPU runs at ${g} GHz and does one instruction per cycle. How many BILLION instructions can it carry out each second?`, g, `1 GHz is 1 billion cycles per second, so ${g} GHz is ${g} billion instructions a second.`, ['Hertz means “per second”.', 'Giga means a billion.', `${g} GHz = ${g} billion cycles each second.`]);
    }
    if (level === 2) {
      const g = rng.int(2, 4), s = rng.int(2, 5);
      return num(`A task needs ${g * s} billion instructions. A single-core ${g} GHz CPU does one instruction per cycle. How many seconds does the task take?`, s, `${g * s} billion ÷ ${g} billion per second = ${s} seconds.`, [`${g} GHz = ${g} billion instructions a second.`, `${g * s} ÷ ${g}.`, `${s} seconds.`]);
    }
    if (rng.chance(0.5)) {
      const hits = rng.int(6, 19) * 5, total = 100;
      return num(`Of ${total} memory requests, ${hits} were found in the cache. What percentage were cache hits?`, hits, `${hits} out of ${total} is ${hits}%. Cache is tiny but very fast memory inside the CPU, so a high hit rate makes programs quicker.`, ['Percentage = hits ÷ total × 100.', `${hits} ÷ ${total} × 100.`, `${hits}%.`]);
    }
    const c = rng.pick([2, 4, 8]), g = rng.int(2, 4);
    return num(`${c === 8 ? 'An' : 'A'} ${c}-core CPU runs at ${g} GHz, each core doing one instruction per cycle. In the best case, how many billion instructions per second is that?`, c * g, `${c} cores × ${g} billion = ${c * g} billion. In practice it is less: many programs cannot split their work evenly between cores.`, ['Each core can work at the same time.', `${c} × ${g}.`, `${c * g} billion (best case).`]);
  },

  // --- GCSE tasters: recursion ---------------------------------------------------------------
  y8dRecursion(level, rng) {
    if (level === 1) {
      const n = rng.int(3, 6);
      let f = 1; for (let i = 2; i <= n; i++) f *= i;
      return num(`What does this program print?\n${code('def fact(n):', '    if n == 1:', '        return 1', '    return n * fact(n - 1)', '', `print(fact(${n}))`)}`, f, `fact calls itself with a smaller number until it reaches the base case, n == 1: ${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${f}.`, ['The base case (n == 1) stops the recursion.', `fact(${n}) = ${n} × fact(${n - 1}), and so on.`, `${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${f}.`]);
    }
    if (level === 2) {
      const n = rng.int(4, 8);
      const fib = [0, 1]; for (let i = 2; i <= n; i++) fib.push(fib[i - 1] + fib[i - 2]);
      return num(`What does this program print?\n${code('def fib(n):', '    if n < 2:', '        return n', '    return fib(n - 1) + fib(n - 2)', '', `print(fib(${n}))`)}`, fib[n], `fib(0) = 0, fib(1) = 1, and each value is the sum of the two before: ${fib.join(', ')}. fib(${n}) = ${fib[n]}.`, ['The base cases are n = 0 and n = 1.', `Build up: ${fib.join(', ')}.`, `fib(${n}) = ${fib[n]}.`]);
    }
    const b = rng.int(2, 3), e = rng.int(3, 6);
    if (rng.chance(0.5)) return num(`How many times is power called (including the first call)?\n${code('def power(base, exp):', '    if exp == 0:', '        return 1', '    return base * power(base, exp - 1)', '', `print(power(${b}, ${e}))`)}`, e + 1, `power(${b}, ${e}) calls power(${b}, ${e - 1}), … down to power(${b}, 0): exponents ${Array.from({ length: e + 1 }, (_, i) => e - i).join(', ')}, which is ${e + 1} calls.`, ['Each call reduces exp by 1.', `It stops at exp = 0.`, `${e} down to 0 is ${e + 1} calls.`], { _py: `calls = 0\ndef power(base, exp):\n    global calls\n    calls += 1\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\npower(${b}, ${e})\nprint(calls)` });
    const n = rng.int(100, 9999);
    const s = String(n).split('').reduce((a, d) => a + +d, 0);
    return num(`What does this program print?\n${code('def digits(n):', '    if n < 10:', '        return n', '    return n % 10 + digits(n // 10)', '', `print(digits(${n}))`)}`, s, `Each call peels off the last digit (n % 10) and recurses on the rest (n // 10): ${String(n).split('').join(' + ')} = ${s}.`, ['n % 10 is the last digit; n // 10 removes it.', 'The base case is a single digit.', `${String(n).split('').join(' + ')} = ${s}.`]);
  },

  // --- GCSE tasters: shortest paths ----------------------------------------------------------
  y8dPaths(level, rng) {
    if (level === 1) {
      for (;;) {
        const R = 4, Cn = 5;
        const g = Array.from({ length: R }, () => Array.from({ length: Cn }, () => (rng.chance(0.3) ? 'W' : 'P')));
        g[0][0] = 'S'; g[R - 1][Cn - 1] = 'E';
        const dist = Array.from({ length: R }, () => Array(Cn).fill(-1)); dist[0][0] = 0;
        const qq = [[0, 0]];
        while (qq.length) { const [r, c] = qq.shift(); for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < R && nc >= 0 && nc < Cn && g[nr][nc] !== 'W' && dist[nr][nc] < 0) { dist[nr][nc] = dist[r][c] + 1; qq.push([nr, nc]); } } }
        const d = dist[R - 1][Cn - 1];
        if (d < 0) continue;
        const rows = g.map((row) => row.join(' '));
        return num(`In the labyrinth below, S is the start, E the exit, W a wall and P a path. Moving one square at a time up, down, left or right, what is the fewest number of moves from S to E?\n${code(...rows)}`, d, `A breadth-first search explores every square 1 move away, then 2, then 3… so the first time it reaches E is the shortest route: ${d} moves.`, ['Mark the squares 1 move from S, then 2 moves, and so on.', 'Walls cannot be entered.', `E is first reached after ${d} moves.`], { _py: `g = ${JSON.stringify(rows.map((r) => r.split(' ')))}\nfrom collections import deque\nd = {(0, 0): 0}\nq = deque([(0, 0)])\nwhile q:\n    r, c = q.popleft()\n    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n        nr, nc = r + dr, c + dc\n        if 0 <= nr < ${R} and 0 <= nc < ${Cn} and g[nr][nc] != "W" and (nr, nc) not in d:\n            d[(nr, nc)] = d[(r, c)] + 1\n            q.append((nr, nc))\nprint(d[(${R - 1}, ${Cn - 1})])` });
      }
    }
    const isles = ['Ithaca', 'Crete', 'Delos', 'Naxos', 'Rhodes'];
    const edges = [];
    const w = () => rng.int(2, 9);
    edges.push([0, 1, w()], [0, 2, w()], [1, 2, w()], [1, 3, w()], [2, 3, w()], [2, 4, w()], [3, 4, w()]);
    if (level === 3) edges.push([0, 3, w() + 6], [1, 4, w() + 5]);
    const INF = 1e9, dist = [0, INF, INF, INF, INF], done = [];
    for (let k = 0; k < 5; k++) { let u = -1; for (let i = 0; i < 5; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i; done[u] = true; for (const [a, b, c] of edges) { if (a === u && dist[u] + c < dist[b]) dist[b] = dist[u] + c; if (b === u && dist[u] + c < dist[a]) dist[a] = dist[u] + c; } }
    const target = level === 2 ? 3 : 4;
    return num(`Sea routes between islands, with sailing times in days:\n${code(...edges.map(([a, b, c]) => `${isles[a]} – ${isles[b]}: ${c}`))}\nWhat is the shortest total time from Ithaca to ${isles[target]}?`, dist[target], `Checking the routes (as Dijkstra’s algorithm does, always extending the nearest unfinished island), the quickest way takes ${dist[target]} days.`, ['Start at Ithaca with time 0.', 'Repeatedly take the nearest island not yet finished and update its neighbours.', `The shortest time to ${isles[target]} is ${dist[target]}.`], { _py: `edges = ${JSON.stringify(edges)}\nINF = 10**9\nd = [0, INF, INF, INF, INF]\ndone = [False] * 5\nfor _ in range(5):\n    u = min((i for i in range(5) if not done[i]), key=lambda i: d[i])\n    done[u] = True\n    for a, b, c in edges:\n        if a == u: d[b] = min(d[b], d[u] + c)\n        if b == u: d[a] = min(d[a], d[u] + c)\nprint(d[${target}])` });
  },

  // --- GCSE tasters: Boolean expressions -----------------------------------------------------
  y8dCircuit(level, rng) {
    const exprs = [
      ['(A AND B) OR C', (a, b, c) => (a && b) || c, '(A and B) or C'],
      ['A AND (B OR C)', (a, b, c) => a && (b || c), 'A and (B or C)'],
      ['NOT A AND B', (a, b, c) => !a && b, '(not A) and B'],
      ['(A OR B) AND NOT C', (a, b, c) => (a || b) && !c, '(A or B) and not C'],
      ['A XOR B', (a, b, c) => a !== b, 'A != B'],
      ['NOT (A AND B)', (a, b, c) => !(a && b), 'not (A and B)'],
    ];
    const [e, f, py] = rng.pick(exprs);
    const uses = (v) => new RegExp(`\\b${v}\\b`).test(e);
    // how to start: brackets first if there are any; otherwise NOT binds tighter than AND
    const first = e.includes('(') ? ['Work inside the brackets first.', 'Work out the brackets first.'] : e.startsWith('NOT') ? ['NOT applies first, to A only: (NOT A) AND B.', 'Work out NOT A first, then the AND.'] : ['There are no brackets: XOR is 1 when exactly one input is 1.', 'Compare A and B: are they different?'];
    if (level === 1 || level === 2 && rng.chance(0.4)) {
      const a = rng.int(0, 1), b = rng.int(0, 1), c = rng.int(0, 1);
      const out = f(!!a, !!b, !!c) ? 1 : 0;
      return num(`What is the output of ${e} when ${['A', 'B', 'C'].filter(uses).map((v) => `${v} = ${{ A: a, B: b, C: c }[v]}`).join(', ')}? (Answer 1 or 0.)`, out, `${first[0]} With these inputs, ${e} is ${out}.`, ['NOT flips 0 and 1; AND needs both; OR needs at least one; XOR needs exactly one.', first[1], `The output is ${out}.`], { _py: `A, B, C = ${a === 1 ? 'True' : 'False'}, ${b === 1 ? 'True' : 'False'}, ${c === 1 ? 'True' : 'False'}\nprint(1 if (${py}) else 0)` });
    }
    if (level === 2) {
      const vars = ['A', 'B', 'C'].filter(uses), n = vars.length;
      let count = 0;
      for (let m = 0; m < 2 ** n; m++) { const v = { A: false, B: false, C: false }; vars.forEach((x, i) => { v[x] = !!((m >> i) & 1); }); if (f(v.A, v.B, v.C)) count++; }
      return num(`A truth table for ${e} has ${2 ** n} rows (every combination of ${vars.join(', ')}). In how many rows is the output 1?`, count, `Working through all ${2 ** n} combinations, the output is 1 in ${count} of them.`, [`${n} inputs give 2^{${n}} = ${2 ** n} rows.`, 'Work out the output for each row.', `${count} ${count === 1 ? 'row gives' : 'rows give'} 1.`], { _py: `from itertools import product\nprint(sum(1 for ${vars.join(', ')} in product([False, True], repeat=${n}) if (${py})))` });
    }
    const vars = ['A', 'B', 'C'].filter(uses);
    const rowsT = [];
    for (let m = 0; m < 2 ** vars.length; m++) { const v = { A: false, B: false, C: false }; vars.forEach((x, i) => { v[x] = !!((m >> (vars.length - 1 - i)) & 1); }); rowsT.push(`${vars.map((x) => (v[x] ? 1 : 0)).join(' ')} | ${f(v.A, v.B, v.C) ? 1 : 0}`); }
    const sameVars = (x) => ['A', 'B', 'C'].every((v) => new RegExp(`\\b${v}\\b`).test(x) === uses(v));
    const differs = (g) => { for (let m = 0; m < 8; m++) { const A = !!(m & 1), B = !!(m & 2), C = !!(m & 4); if (!uses('C') && C) continue; if (g(A, B, C) !== f(A, B, C)) return true; } return false; };
    const others = exprs.filter((x) => x[0] !== e && sameVars(x[0]) && differs(x[1])).map((x) => x[0]);
    return choice(`Which expression matches this truth table?\n${code(`${vars.join(' ')} | Q`, ...rowsT)}`, e, others.slice(0, 3), rng, { explain: `Check each row: ${e} gives exactly these outputs. Each of the others disagrees with at least one row.`, steps: ['Test each expression on the rows where the output is 1.', 'Then check a row where it is 0.', `Only ${e} fits every row.`] });
  },

  // --- GCSE tasters: Huffman codes -----------------------------------------------------------
  y8dHuffman(level, rng) {
    const table = { A: '0', T: '10', H: '110', E: '111' };
    const tbl = code('letter | code', ...Object.entries(table).map(([k, v]) => `${k}      | ${v}`));
    const words = ['THETA', 'HATE', 'HEAT', 'TEA', 'EAT', 'THAT', 'ATE', 'HATH'].filter((w) => [...w].every((c) => table[c]));
    const w = rng.pick(words);
    const bits = [...w].map((c) => table[c]).join('');
    if (level === 1) return num(`A Huffman code gives common letters shorter codes:\n${tbl}\nHow many bits are needed to send ${w}?`, bits.length, `${[...w].map((c) => `${c} = ${table[c]}`).join(', ')}: ${bits} is ${bits.length} bits.`, ['Look up each letter’s code.', 'Count the bits in each code.', `Total: ${bits.length} bits.`], { _py: `t = ${JSON.stringify(table)}\nprint(sum(len(t[c]) for c in "${w}"))` });
    if (level === 2) return num(`Using this Huffman code:\n${tbl}\nhow many bits does it SAVE to send ${w} compared with 8-bit ASCII?`, w.length * 8 - bits.length, `ASCII needs ${w.length} × 8 = ${w.length * 8} bits; Huffman needs ${bits.length}. Saving: ${w.length * 8 - bits.length}.`, [`ASCII: 8 bits per letter, ${w.length * 8} bits.`, `Huffman: ${bits} = ${bits.length} bits.`, `${w.length * 8} − ${bits.length} = ${w.length * 8 - bits.length}.`], { _py: `t = ${JSON.stringify(table)}\nprint(8 * len("${w}") - sum(len(t[c]) for c in "${w}"))` });
    return text(`Decode ${bits} using this Huffman code (no code is the start of another, so read from the left):\n${tbl}`, w, `Reading from the left: ${[...w].map((c) => `${table[c]} → ${c}`).join(', ')}. The word is ${w}.`, ['Read bits until they match a code.', 'Write that letter and start again.', `${w}.`], { _py: `t = {v: k for k, v in ${JSON.stringify(table)}.items()}\nbits = "${bits}"\nout = cur = ""\nfor b in bits:\n    cur += b\n    if cur in t:\n        out += t[cur]\n        cur = ""\nprint(out)` });
  },
};

// Year 8 computing generators: practice that never runs out. Data representation (binary,
// hex, binary addition and shifts, units, image and sound sizes, ASCII), the Caesar cipher,
// Boolean logic, searching and sorting, tracing short Python programs, and GCSE tasters
// (two's complement, SQL, trace tables). Same contract as js/gen/maths.js.
// Code is shown in ```fenced``` blocks; every program prints exactly one line, which is the answer
// unless the question asks something else (then `_py` holds a program that prints the answer).

import { normalise } from '../core/checkers.js';

const bin = (n, w) => n.toString(2).padStart(w, '0');
const hex = (n) => n.toString(16).toUpperCase();
const code = (...lines) => '```\n' + lines.join('\n') + '\n```';
const minus = (n) => (n < 0 ? `−${-n}` : String(n));
const list = (xs) => xs.join(', ');

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
/** A binary answer: the padded form, also accepting it without leading zeros. */
const binAnswer = (prompt, n, w, explain, steps, extra = {}) => text(prompt, bin(n, w), explain, steps, { accept: [n.toString(2), bin(n, w).replace(/(\d{4})(?=\d)/g, '$1 ')], ...extra });

const HEROES = ['Perseus', 'Theseus', 'Jason', 'Atalanta', 'Odysseus', 'Achilles', 'Hippolyta', 'Orpheus', 'Cadmus', 'Bellerophon', 'Heracles', 'Penelope'];
const GODS = ['Zeus', 'Hera', 'Athena', 'Apollo', 'Artemis', 'Hermes', 'Poseidon', 'Hades', 'Demeter', 'Ares', 'Hestia', 'Dionysus'];
const WORDS = ['ZEUS', 'HERA', 'ARGO', 'TROY', 'HYDRA', 'ATHENA', 'HERMES', 'MEDUSA', 'ORACLE', 'DELPHI', 'SPARTA', 'OLYMPUS', 'TITAN', 'NYMPH', 'SPHINX', 'CYCLOPS'];

const sample = (rng, arr, k) => rng.shuffle(arr).slice(0, k);

function caesar(word, k) {
  return [...word].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26 * 4) % 26) + 65)).join('');
}

function bubblePass(xs) {
  const a = xs.slice();
  let swaps = 0;
  for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; swaps++; }
  return { list: a, swaps };
}

function binarySearchChecks(sorted, target) {
  let lo = 0, hi = sorted.length - 1, checks = 0;
  const seen = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    checks++;
    seen.push(sorted[mid]);
    if (sorted[mid] === target) break;
    if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return { checks, seen };
}

export const Y8_COMPUTING_GENERATORS = {
  // --- data representation -----------------------------------------------------------------
  y8cBinary(level, rng) {
    if (level === 1) {
      const n = rng.int(1, 15);
      if (rng.chance(0.5)) return num(`Convert the 4-bit binary number \`${bin(n, 4)}\` to denary.`, n, `The column values are 8, 4, 2, 1. Add the columns with a 1: ${n}.`, ['The place values for 4 bits are 8, 4, 2 and 1.', `${bin(n, 4)}: add the place values under each 1.`, `That makes ${n}.`]);
      return binAnswer(`Write the denary number ${n} as a 4-bit binary number.`, n, 4, `${n} = ${[8, 4, 2, 1].filter((v) => n & v).join(' + ')}, so it is ${bin(n, 4)}.`, ['Use the place values 8, 4, 2, 1.', `Make ${n} from them: ${[8, 4, 2, 1].filter((v) => n & v).join(' + ')}.`, `Put a 1 under each used column: ${bin(n, 4)}.`]);
    }
    if (level === 2) {
      const n = rng.int(16, 255);
      const parts = [128, 64, 32, 16, 8, 4, 2, 1].filter((v) => n & v);
      if (rng.chance(0.5)) return num(`Convert \`${bin(n, 8)}\` to denary.`, n, `${parts.join(' + ')} = ${n}.`, ['The 8 place values are 128, 64, 32, 16, 8, 4, 2, 1.', `The 1s are under ${parts.join(', ')}.`, `${parts.join(' + ')} = ${n}.`]);
      return binAnswer(`Write ${n} as an 8-bit binary number.`, n, 8, `${n} = ${parts.join(' + ')}, so it is ${bin(n, 8)}.`, ['Start from the biggest place value, 128, and work down.', `${n} = ${parts.join(' + ')}.`, `A 1 under each of those, 0 elsewhere: ${bin(n, 8)}.`]);
    }
    const kind = rng.pick(['largest', 'bits', 'odd']);
    if (kind === 'largest') {
      const b = rng.pick([3, 5, 6, 7, 8, 10, 12, 16]);
      return num(`What is the largest denary number you can store in ${b} bits?`, 2 ** b - 1, `With ${b} bits all set to 1 you get 2^{${b}} − 1 = ${2 ** b - 1}.`, [`${b} bits give 2^{${b}} = ${2 ** b} different patterns.`, 'One of them is 0, so the patterns go from 0 upwards.', `The largest is ${2 ** b} − 1 = ${2 ** b - 1}.`]);
    }
    if (kind === 'bits') {
      const n = rng.int(70, 1000);
      const b = n.toString(2).length;
      return num(`What is the smallest number of bits needed to store the denary number ${n}?`, b, `${2 ** (b - 1)} ≤ ${n} < ${2 ** b}, so ${b} bits are needed.`, [`With ${b - 1} bits the largest number is ${2 ** (b - 1) - 1}, which is too small.`, `With ${b} bits the largest is ${2 ** b - 1}, which is enough.`, `So ${b} bits.`]);
    }
    const n = rng.int(16, 255);
    return choice(`Without converting, is \`${bin(n, 8)}\` odd or even?`, n % 2 ? 'odd: the last bit is 1' : 'even: the last bit is 0', [n % 2 ? 'even: the last bit is 1' : 'odd: the last bit is 0', 'you cannot tell without converting'], rng, { explain: 'Only the last bit (worth 1) can make a binary number odd. All the other place values are even.', steps: ['Every place value except the last is even.', `The last bit here is ${n % 2}.`, `So the number is ${n % 2 ? 'odd' : 'even'}.`] });
  },

  y8cHex(level, rng) {
    if (level === 1) {
      const n = rng.int(10, 15);
      if (rng.chance(0.5)) return num(`What is the hexadecimal digit \`${hex(n)}\` in denary?`, n, `Hex counts 0–9 then A = 10, B = 11, C = 12, D = 13, E = 14, F = 15. So ${hex(n)} = ${n}.`, ['Hex has 16 digits: 0 to 9, then A to F.', 'A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.', `${hex(n)} = ${n}.`]);
      return text(`Write the denary number ${n} as a single hexadecimal digit.`, hex(n), `A = 10 … F = 15, so ${n} is ${hex(n)}.`, ['After 9, hex uses letters.', 'A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.', `${n} = ${hex(n)}.`]);
    }
    if (level === 2) {
      const n = rng.int(17, 255);
      const [h, l] = [Math.floor(n / 16), n % 16];
      if (rng.chance(0.5)) return num(`Convert the hexadecimal number \`${hex(n)}\` to denary.`, n, `${hex(h)} sixteens and ${hex(l)} ones: ${h} × 16 + ${l} = ${n}.`, ['The place values in hex are 16 and 1.', `${hex(h)} = ${h} and ${hex(l)} = ${l}.`, `${h} × 16 + ${l} = ${n}.`]);
      return text(`Convert ${n} to hexadecimal.`, hex(n), `${n} ÷ 16 = ${h} remainder ${l}, so ${hex(h)}${hex(l)}.`, [`How many 16s fit in ${n}? ${h}, which is ${hex(h)}.`, `Remainder: ${n} − ${h * 16} = ${l}, which is ${hex(l)}.`, `So ${n} = ${hex(n)}.`]);
    }
    const n = rng.int(17, 255);
    const [h, l] = [n >> 4, n & 15];
    if (rng.chance(0.5)) return text(`Convert \`${bin(n, 8)}\` to hexadecimal.`, hex(n).padStart(2, '0'), `Split into nibbles: ${bin(h, 4)} = ${hex(h)} and ${bin(l, 4)} = ${hex(l)}.`, ['Split the byte into two 4-bit nibbles.', `${bin(h, 4)} is ${h} = ${hex(h)}; ${bin(l, 4)} is ${l} = ${hex(l)}.`, `Together: ${hex(n).padStart(2, '0')}.`], { accept: [hex(n)] });
    return binAnswer(`Convert the hexadecimal number \`${hex(n).padStart(2, '0')}\` to 8-bit binary.`, n, 8, `Each hex digit is one nibble: ${hex(h)} = ${bin(h, 4)}, ${hex(l)} = ${bin(l, 4)}.`, ['Convert each hex digit to 4 bits.', `${hex(h)} → ${bin(h, 4)}, ${hex(l)} → ${bin(l, 4)}.`, `Join them: ${bin(n, 8)}.`]);
  },

  y8cBinAdd(level, rng) {
    if (level === 1) {
      const a = rng.int(1, 9), b = rng.int(1, 15 - a);
      return binAnswer(`Add the 4-bit binary numbers \`${bin(a, 4)}\` + \`${bin(b, 4)}\`.`, a + b, 4, `${a} + ${b} = ${a + b}, which is ${bin(a + b, 4)}. Remember 1 + 1 = 10 in binary (write 0, carry 1).`, ['Add from the right, column by column.', 'In binary 1 + 1 = 10: write 0 and carry 1. 1 + 1 + 1 = 11: write 1, carry 1.', `The answer is ${bin(a + b, 4)} (check: ${a} + ${b} = ${a + b}).`]);
    }
    if (level === 2) {
      const a = rng.int(20, 180), b = rng.int(10, 255 - a);
      return binAnswer(`Add \`${bin(a, 8)}\` + \`${bin(b, 8)}\`. Give an 8-bit answer.`, a + b, 8, `Check in denary: ${a} + ${b} = ${a + b} = ${bin(a + b, 8)}.`, ['Work from the right-hand column, carrying 1 whenever a column makes 2 or 3.', '0+0 = 0, 0+1 = 1, 1+1 = 10, 1+1+1 = 11.', `Result: ${bin(a + b, 8)}.`]);
    }
    const a = rng.int(130, 250), b = rng.int(256 - a, 255);
    if (rng.chance(0.5)) return choice(`Adding \`${bin(a, 8)}\` + \`${bin(b, 8)}\` in an 8-bit register. What happens?`, 'An overflow error: the answer needs 9 bits', ['It works: the answer fits in 8 bits', 'The answer becomes negative', 'The register adds an extra bit automatically'], rng, { explain: `${a} + ${b} = ${a + b}, but 8 bits can only hold up to 255. The carry out of the last column is lost: an overflow.`, steps: [`In denary: ${a} + ${b} = ${a + b}.`, 'The largest 8-bit number is 255.', 'The carry out of the leftmost column has nowhere to go: overflow.'] });
    return binAnswer(`\`${bin(a, 8)}\` + \`${bin(b, 8)}\` overflows. Which 8 bits are left in the register (ignoring the lost carry)?`, a + b - 256, 8, `${a} + ${b} = ${a + b} = ${bin(a + b, 9)} in 9 bits. The 9th bit (256) is lost, leaving ${bin(a + b - 256, 8)} = ${a + b - 256}.`, [`${a} + ${b} = ${a + b}.`, `In binary that is ${bin(a + b, 9)}: 9 bits.`, `Only the right-hand 8 bits stay: ${bin(a + b - 256, 8)}.`]);
  },

  y8cShift(level, rng) {
    if (level === 1) {
      const n = rng.int(3, 60);
      return binAnswer(`Apply a left shift of 1 place to \`${bin(n, 8)}\`. What is the new 8-bit number?`, n * 2, 8, `Every bit moves one place left and a 0 fills the right: ${bin(n * 2, 8)}. It has doubled: ${n} → ${n * 2}.`, ['Move every bit one place to the left.', 'Fill the empty right-hand place with 0.', `${bin(n, 8)} → ${bin(n * 2, 8)} (${n} × 2 = ${n * 2}).`]);
    }
    if (level === 2) {
      const n = rng.int(20, 255), k = rng.pick([1, 2, 3]);
      return num(`\`${bin(n, 8)}\` is ${n}. Apply a right shift of ${k} place${k > 1 ? 's' : ''}. What is the result in denary?`, n >> k, `A right shift of ${k} divides by ${2 ** k} and drops any remainder: ${n} ÷ ${2 ** k} = ${n >> k}${n % 2 ** k ? ` remainder ${n % 2 ** k}, which is lost` : ''}.`, [`Each place to the right halves the number.`, `${k} place${k > 1 ? 's' : ''} divides by ${2 ** k}.`, `The new number is ${bin(n >> k, 8)} = ${n >> k}${n % 2 ** k ? ' (the bits that fell off the end are lost)' : ''}.`]);
    }
    if (rng.chance(0.5)) {
      const k = rng.pick([2, 3, 4]);
      return num(`A left shift of ${k} places multiplies a binary number by what?`, 2 ** k, `Each place left doubles the number, so ${k} places multiplies by 2^{${k}} = ${2 ** k}.`, ['One place left doubles the number.', `${k} places doubles it ${k} times.`, `2^{${k}} = ${2 ** k}.`]);
    }
    const n = rng.int(129, 250), k = rng.pick([1, 2]);
    const r = (n << k) & 255;
    return binAnswer(`An 8-bit register holds \`${bin(n, 8)}\`. After a left shift of ${k} place${k > 1 ? 's' : ''}, what does it hold?`, r, 8, `The leftmost bit${k > 1 ? 's fall' : ' falls'} off the end, so the answer is not ${n} × ${2 ** k} = ${n << k} (too big for 8 bits) but ${bin(r, 8)} = ${r}.`, ['Shift every bit left, filling with 0s on the right.', `Bits pushed past the 8th place are lost.`, `What is left: ${bin(r, 8)}.`]);
  },

  y8cUnits(level, rng) {
    const note = '(Use 1 kilobyte = 1000 bytes, as GCSE exams do.)';
    if (level === 1) {
      const kind = rng.pick(['bits', 'bytes', 'nibble']);
      if (kind === 'bits') { const n = rng.int(2, 64); return num(`How many bits are there in ${n} bytes?`, n * 8, `1 byte = 8 bits, so ${n} × 8 = ${n * 8}.`, ['A byte is 8 bits.', `${n} bytes × 8.`, `= ${n * 8} bits.`]); }
      if (kind === 'bytes') { const n = rng.int(2, 40) * 8; return num(`How many bytes is ${n} bits?`, n / 8, `8 bits make a byte: ${n} ÷ 8 = ${n / 8}.`, ['A byte is 8 bits.', `${n} ÷ 8.`, `= ${n / 8} bytes.`]); }
      const n = rng.int(2, 9); return num(`A nibble is half a byte. How many bits are in ${n} nibbles?`, n * 4, `A nibble is 4 bits: ${n} × 4 = ${n * 4}.`, ['A byte is 8 bits, so a nibble is 4.', `${n} × 4.`, `= ${n * 4} bits.`]);
    }
    if (level === 2) {
      const [from, to, f] = rng.pick([['kilobytes', 'bytes', 1000], ['megabytes', 'kilobytes', 1000], ['gigabytes', 'megabytes', 1000], ['terabytes', 'gigabytes', 1000]]);
      const n = rng.pick([2, 3, 5, 8, 12, 16, 25, 64]);
      if (rng.chance(0.5)) return num(`How many ${to} are there in ${n} ${from}? ${note}`, n * f, `${n} × ${f} = ${n * f}.`, ['Each unit is 1000 of the one below: byte, kilobyte, megabyte, gigabyte, terabyte.', `${from} → ${to}: multiply by ${f}.`, `${n} × ${f} = ${n * f} ${to}.`]);
      return num(`How many ${from} is ${n * f} ${to}? ${note}`, n, `${n * f} ÷ ${f} = ${n}.`, [`Going up a unit means dividing by 1000.`, `${n * f} ÷ 1000.`, `= ${n} ${from}.`]);
    }
    const card = rng.pick([2, 4, 8, 16, 32]), file = rng.pick([2, 4, 5, 8]);
    const what = rng.pick(['photos of Mount Olympus', 'songs for Orpheus', 'scans of ancient scrolls']);
    return num(`A memory card holds ${card} GB. How many ${file} MB ${what} fit on it? ${note}`, (card * 1000) / file, `${card} GB = ${card * 1000} MB. ${card * 1000} ÷ ${file} = ${(card * 1000) / file}.`, ['Use the same units first.', `${card} GB = ${card} × 1000 = ${card * 1000} MB.`, `${card * 1000} ÷ ${file} = ${(card * 1000) / file} files.`]);
  },

  y8cFileSize(level, rng) {
    if (level === 1) {
      const w = rng.int(4, 20), h = rng.int(4, 20);
      return num(`A black-and-white image is ${w} pixels wide and ${h} pixels high. Each pixel uses 1 bit. How many bits is the image?`, w * h, `${w} × ${h} pixels × 1 bit = ${w * h} bits.`, ['Number of pixels = width × height.', `${w} × ${h} = ${w * h} pixels.`, `1 bit each: ${w * h} bits.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const d = rng.int(1, 8);
        return num(`An image uses a colour depth of ${d} bit${d > 1 ? 's' : ''} per pixel. How many different colours can it show?`, 2 ** d, `n bits give 2^{n} patterns: 2^{${d}} = ${2 ** d} colours.`, ['Each pixel stores a binary pattern.', `${d} bit${d > 1 ? 's make' : ' makes'} 2^{${d}} different patterns.`, `= ${2 ** d} colours.`]);
      }
      const w = rng.pick([8, 10, 16, 20, 40, 50]), h = rng.pick([8, 10, 12, 20, 25]), d = rng.pick([4, 8, 16, 24]);
      const bits = w * h * d;
      return num(`An image is ${w} × ${h} pixels with a colour depth of ${d} bits. What is its size in bytes?`, bits / 8, `${w} × ${h} × ${d} = ${bits} bits; ÷ 8 = ${bits / 8} bytes.`, ['Size in bits = width × height × colour depth.', `${w} × ${h} × ${d} = ${bits} bits.`, `÷ 8 to get bytes: ${bits / 8}.`]);
    }
    if (rng.chance(0.5)) {
      const rate = rng.pick([1000, 2000, 4000, 8000]), depth = rng.pick([8, 16]), secs = rng.int(2, 10);
      const bits = rate * depth * secs;
      return num(`Kit records ${secs} seconds of a lyre at ${rate} samples per second, with a bit depth of ${depth} bits. What is the file size in bytes?`, bits / 8, `${rate} × ${depth} × ${secs} = ${bits} bits; ÷ 8 = ${bits / 8} bytes.`, ['Sound file size (bits) = sample rate × bit depth × seconds.', `${rate} × ${depth} × ${secs} = ${bits} bits.`, `÷ 8 = ${bits / 8} bytes.`]);
    }
    const colours = rng.pick([3, 5, 9, 17, 30, 60, 100, 200, 300]);
    const d = Math.ceil(Math.log2(colours));
    return num(`An artist needs ${colours} different colours. What is the smallest colour depth (bits per pixel) that gives enough?`, d, `2^{${d - 1}} = ${2 ** (d - 1)} is too few, 2^{${d}} = ${2 ** d} is enough: ${d} bits.`, [`Find the smallest power of 2 that is at least ${colours}.`, `2^{${d - 1}} = ${2 ** (d - 1)} (too few); 2^{${d}} = ${2 ** d}.`, `So ${d} bits per pixel.`]);
  },

  y8cAscii(level, rng) {
    if (level === 1) {
      const c = rng.int(66, 90), ch = String.fromCharCode(c);
      return num(`In ASCII, the capital letter A has code 65. What is the code for capital ${ch}?`, c, `${ch} is ${c - 65} letter${c - 65 === 1 ? '' : 's'} after A, so 65 + ${c - 65} = ${c}.`, ['Capital letters have consecutive codes, starting with A = 65.', `${ch} is letter number ${c - 64} of the alphabet, ${c - 65} after A.`, `65 + ${c - 65} = ${c}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const c = rng.int(98, 122), ch = String.fromCharCode(c);
        return text(`In ASCII, lowercase a is 97. Which lowercase letter has code ${c}?`, ch, `${c} − 97 = ${c - 97}, so it is ${c - 97} letter${c - 97 === 1 ? '' : 's'} after a: ${ch}.`, ['Lowercase letters run from a = 97.', `${c} − 97 = ${c - 97}.`, `Count ${c - 97} on from a: ${ch}.`]);
      }
      const c = rng.int(65, 90), ch = String.fromCharCode(c);
      return num(`Capital ${ch} has ASCII code ${c}. Lowercase codes are 32 more than capitals. What is the code for lowercase ${ch.toLowerCase()}?`, c + 32, `${c} + 32 = ${c + 32}.`, ['Every lowercase letter is exactly 32 after its capital.', `${c} + 32.`, `= ${c + 32}.`]);
    }
    if (rng.chance(0.5)) {
      const c = rng.int(66, 90), ch = String.fromCharCode(c);
      return binAnswer(`Capital A is 65 = \`01000001\` in ASCII. Write capital ${ch} as an 8-bit binary code.`, c, 8, `${ch} is ${c}, which is ${bin(c, 8)}.`, [`${ch} = 65 + ${c - 65} = ${c}.`, `Convert ${c} to binary: ${[128, 64, 32, 16, 8, 4, 2, 1].filter((v) => c & v).join(' + ')}.`, `${bin(c, 8)}.`]);
    }
    const [bits, chars] = rng.pick([[7, 128], [8, 256], [16, 65536]]);
    return num(`How many different characters can ${bits === 8 ? 'an' : 'a'} ${bits}-bit character set represent?`, chars, `2^{${bits}} = ${chars}. ${bits === 7 ? 'This is standard ASCII.' : bits === 8 ? 'Extended ASCII uses 8 bits.' : 'Unicode can use 16 bits (or more) to include every alphabet, Greek included.'}`, [`${bits} bits make 2^{${bits}} patterns.`, `2^{${bits}} = ${chars}.`, `Each pattern is one character: ${chars}.`]);
  },

  y8cCaesar(level, rng) {
    if (level === 1) {
      const w = rng.pick(WORDS.filter((x) => x.length <= 5)), k = rng.int(1, 3);
      return text(`Encrypt the word ${w} with a Caesar cipher, shifting each letter ${k} place${k > 1 ? 's' : ''} forward.`, caesar(w, k), `Each letter moves ${k} along the alphabet: ${[...w].map((c) => `${c}→${caesar(c, k)}`).join(', ')}.`, [`Shift each letter ${k} forward. After Z, go back round to A.`, [...w].map((c) => `${c}→${caesar(c, k)}`).join(', ') + '.', `Ciphertext: ${caesar(w, k)}.`]);
    }
    if (level === 2) {
      const w = rng.pick(WORDS), k = rng.int(3, 12);
      return text(`Hermes sends a message encrypted with a Caesar shift of ${k}: ${caesar(w, k)}. Decrypt it.`, w, `Shift each letter ${k} places back: ${caesar(w, k)} → ${w}.`, [`To decrypt, shift each letter ${k} places backwards (wrapping from A back to Z).`, [...caesar(w, k)].map((c) => `${c}→${caesar(c, -k)}`).join(', ') + '.', `Plaintext: ${w}.`]);
    }
    const w = rng.pick(WORDS), k = rng.int(2, 25);
    return num(`${w} was encrypted with a Caesar cipher and became ${caesar(w, k)}. What shift was used?`, k, `${w[0]} → ${caesar(w[0], k)} is a shift of ${k} (check another letter: ${w[1]} → ${caesar(w[1], k)}).`, ['Compare the first plaintext letter with its ciphertext letter.', `${w[0]} → ${caesar(w[0], k)}: count forward, wrapping after Z.`, `That is ${k} places. (With only 25 keys, an attacker could try them all: a brute-force attack.)`]);
  },

  // --- Boolean logic -------------------------------------------------------------------------
  y8cLogic(level, rng) {
    if (level === 1) {
      const a = rng.int(0, 1), b = rng.int(0, 1);
      const [expr, v, why] = rng.pick([
        [`A AND B`, a & b, 'AND is 1 only when both inputs are 1.'],
        [`A OR B`, a | b, 'OR is 1 when at least one input is 1.'],
        [`NOT A`, 1 - a, 'NOT flips the input.'],
        [`NOT B`, 1 - b, 'NOT flips the input.'],
      ]);
      return num(`A = ${a} and B = ${b}. What is ${expr}?`, v, `${why} So ${expr} = ${v}.`, [why, `A = ${a}, B = ${b}.`, `${expr} = ${v}.`]);
    }
    if (level === 2) {
      const a = rng.int(0, 1), b = rng.int(0, 1), c = rng.int(0, 1);
      if (rng.chance(0.4)) {
        const key = rng.int(0, 1), asleep = rng.int(0, 1), out = key & asleep;
        return num(`The labyrinth door opens (D = 1) if Theo has the thread (T) AND the Minotaur is asleep (M). T = ${key}, M = ${asleep}. What is D?`, out, `D = T AND M = ${key} AND ${asleep} = ${out}.`, ['This is an AND gate: both conditions must be true.', `T = ${key}, M = ${asleep}.`, `D = ${out}.`]);
      }
      // [expression, value, the working with these inputs]
      const [expr, v, work] = rng.pick([
        ['(A AND B) OR C', (a & b) | c, `A AND B = ${a & b}, so ${a & b} OR ${c} = ${(a & b) | c}`],
        ['A AND (NOT B)', a & (1 - b), `NOT B = ${1 - b}, so ${a} AND ${1 - b} = ${a & (1 - b)}`],
        ['NOT (A OR B)', 1 - (a | b), `A OR B = ${a | b}, so NOT ${a | b} = ${1 - (a | b)}`],
        ['A XOR B', a ^ b, `${a} XOR ${b} = ${a ^ b}`],
        ['(A OR B) AND (NOT C)', (a | b) & (1 - c), `A OR B = ${a | b} and NOT C = ${1 - c}, so ${a | b} AND ${1 - c} = ${(a | b) & (1 - c)}`],
      ]);
      const xor = expr.includes('XOR');
      return num(`A = ${a}, B = ${b}, C = ${c}. What is ${expr}?`, v, `${xor ? 'XOR is 1 when exactly one input is 1' : 'Work out the brackets first'}: ${work}.`, [xor ? 'XOR is 1 when exactly one input is 1.' : 'Do the brackets and NOTs first.', `With A = ${a}, B = ${b}, C = ${c}: ${work}.`, `${expr} = ${v}.`]);
    }
    if (rng.chance(0.4)) {
      const n = rng.pick([2, 3, 4]);
      return num(`How many rows does a truth table with ${n} inputs have?`, 2 ** n, `Each input can be 0 or 1, so there are 2^{${n}} = ${2 ** n} combinations.`, ['Each input doubles the number of combinations.', `${n} inputs: 2 × … × 2 (${n} times).`, `= ${2 ** n} rows.`]);
    }
    const exprs = [
      ['A AND B AND C', (a, b, c) => a & b & c],
      ['A OR B OR C', (a, b, c) => a | b | c],
      ['(A AND B) OR C', (a, b, c) => (a & b) | c],
      ['A AND (B OR C)', (a, b, c) => a & (b | c)],
      ['(A XOR B) AND C', (a, b, c) => (a ^ b) & c],
      ['(NOT A) AND (B OR C)', (a, b, c) => (1 - a) & (b | c)],
    ];
    const [expr, f] = rng.pick(exprs);
    let count = 0;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) count += f(a, b, c);
    return num(`Medusa’s statue trap fires when ${expr} is 1. In how many of the 8 rows of the truth table does it fire?`, count, `Checking all 8 combinations of A, B and C, ${expr} is 1 in ${count} of them.`, ['List the 8 combinations from 000 to 111.', `Work out ${expr} for each one.`, `Count the 1s: ${count}.`]);
  },

  // --- searching and sorting -------------------------------------------------------------------
  y8cSearch(level, rng) {
    if (level === 1) {
      const xs = sample(rng, HEROES, rng.int(6, 8));
      const present = rng.chance(0.8);
      const t = present ? rng.pick(xs) : rng.pick(HEROES.filter((h) => !xs.includes(h)));
      const n = present ? xs.indexOf(t) + 1 : xs.length;
      return num(`A linear search looks for ${t} in this list, starting from the left: ${list(xs)}. How many names does it check?`, n, present ? `It checks each name in turn and finds ${t} at position ${n}.` : `${t} is not in the list, so it checks all ${n} names before giving up.`, ['A linear search checks items one at a time from the start.', present ? `${t} is item number ${n}.` : `${t} is never found.`, `So ${n} check${n > 1 ? 's' : ''}.`]);
    }
    if (level === 2) {
      const n = rng.pick([7, 9, 11, 15]);
      const xs = [];
      let v = rng.int(1, 5);
      for (let i = 0; i < n; i++) { xs.push(v); v += rng.int(1, 6); }
      const t = rng.pick(xs);
      const { checks, seen } = binarySearchChecks(xs, t);
      if (rng.chance(0.5)) return num(`A binary search looks for ${t} in the sorted list ${list(xs)}. It checks the middle item first (if there are two middles, the left one). How many items does it check?`, checks, `It checks ${seen.join(', then ')}: ${checks} item${checks > 1 ? 's' : ''}.`, ['Check the middle item. If it is too small, keep the right half; if too big, keep the left half.', `The items checked are ${seen.join(', ')}.`, `That is ${checks} check${checks > 1 ? 's' : ''}.`]);
      const mid = xs[Math.floor((xs.length - 1) / 2)];
      return num(`Binary search on ${list(xs)}. Which number is checked first?`, mid, `There are ${n} items, so the middle one is item ${(n + 1) / 2}: ${mid}.`, ['Binary search always starts with the middle item.', `${n} items: the middle is item ${(n + 1) / 2}.`, `That is ${mid}.`]);
    }
    const n = rng.pick([7, 15, 31, 63, 100, 127, 255, 1000, 1023, 1000000]);
    const k = Math.floor(Math.log2(n)) + 1;
    return num(`What is the largest number of items a binary search needs to check in a sorted list of ${n.toLocaleString('en-GB')} items?`, k, `Each check halves what is left. ${n.toLocaleString('en-GB')} can be halved down to 1 item within ${k} checks (2^{${k}} = ${(2 ** k).toLocaleString('en-GB')} > ${n.toLocaleString('en-GB')}). A linear search could need ${n.toLocaleString('en-GB')} checks!`, ['Each check throws away half of the list.', `Find the smallest k with 2^{k} > ${n.toLocaleString('en-GB')}.`, `k = ${k}.`]);
  },

  y8cSort(level, rng) {
    const make = (n) => { let xs; do { xs = sample(rng, [3, 5, 7, 8, 11, 12, 14, 17, 19, 21, 23, 26], n); } while (bubblePass(xs).swaps < 2); return xs; };
    if (level === 1) {
      const xs = make(5);
      const { list: once } = bubblePass(xs);
      const sorted = xs.slice().sort((a, b) => a - b);
      const wrong1 = xs.slice(); [wrong1[0], wrong1[1]] = [wrong1[1], wrong1[0]];
      return choice(`Mira sorts the Argonauts’ ages into ascending order with a bubble sort: ${list(xs)}. What is the list after the FIRST pass?`, list(once), [list(sorted), list(xs), list(wrong1), list(xs.slice().reverse())], rng, { explain: `One pass compares each neighbouring pair from left to right and swaps any in the wrong order. After one pass the biggest number (${Math.max(...xs)}) has “bubbled” to the end: ${list(once)}.`, steps: ['Compare items 1 and 2, swap if needed; then items 2 and 3; and so on.', 'The largest value is carried all the way to the end.', `After one pass: ${list(once)}.`] });
    }
    if (level === 2) {
      const xs = make(6);
      const { swaps, list: once } = bubblePass(xs);
      return num(`How many swaps happen in the first pass of a bubble sort (ascending) on ${list(xs)}?`, swaps, `Comparing each neighbouring pair left to right gives ${swaps} swaps, leaving ${list(once)}.`, ['Go through the pairs from left to right, swapping when the left one is bigger.', 'Keep track of the list as it changes.', `${swaps} swaps; the list becomes ${list(once)}.`]);
    }
    if (rng.chance(0.5)) {
      let xs, k, done;
      // re-roll if the passes change nothing, which would leave only two distinct options
      do { xs = make(6); k = rng.int(2, 3); done = [...xs.slice(0, k + 1).sort((a, b) => a - b), ...xs.slice(k + 1)]; } while (list(done) === list(xs) || list(done) === list([...xs.slice(0, k + 2).sort((a, b) => a - b), ...xs.slice(k + 2)]));
      const wrongA = [...xs.slice(0, k).sort((a, b) => a - b), ...xs.slice(k)];
      const wrongB = xs.slice().sort((a, b) => a - b);
      const wrongC = [...xs.slice(0, k + 2).sort((a, b) => a - b), ...xs.slice(k + 2)];
      return choice(`An insertion sort (ascending) starts with ${list(xs)}. Each pass inserts the next item into the sorted part on the left. What is the list after ${k} passes?`, list(done), [list(wrongA), list(wrongB), list(wrongC), list(xs)], rng, { explain: `After ${k} passes the first ${k + 1} items are sorted and the rest are untouched: ${list(done)}.`, steps: ['The first item on its own counts as sorted.', `Each pass takes the next item and slides it into place: after ${k} passes, ${k + 1} items are sorted.`, `${list(done)}.`] });
    }
    const all = sample(rng, [2, 4, 5, 7, 9, 10, 13, 15, 16, 18, 20, 22], 7).sort((a, b) => a - b);
    const left = all.filter((_, i) => i % 2 === 0), right = all.filter((_, i) => i % 2 === 1);
    const p = rng.int(3, 5);
    return num(`Merge sort’s last step merges two sorted lists: [${list(left)}] and [${list(right)}]. What is item number ${p} in the merged list?`, all[p - 1], `Merging compares the fronts of the two lists and takes the smaller each time: ${list(all)}. Item ${p} is ${all[p - 1]}.`, ['Compare the first item of each list and take the smaller.', 'Repeat until both lists are used up.', `Merged: ${list(all)}, so item ${p} is ${all[p - 1]}.`]);
  },

  // --- Python tracing --------------------------------------------------------------------------
  y8cVars(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const a = rng.int(2, 12), b = rng.int(2, 9), c = rng.int(2, 5);
        const v = a + b * c;
        return num(`What does this program print?\n${code(`a = ${a}`, `b = ${b}`, `c = a + b * ${c}`, 'print(c)')}`, v, `Multiplication before addition: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${v}.`, [`a is ${a} and b is ${b}.`, `c = ${a} + ${b} * ${c}: Python multiplies first, ${b * c}.`, `c = ${v}, so it prints ${v}.`]);
      }
      const n = rng.int(2, 9), add = rng.int(2, 9);
      return num(`What does this program print?\n${code(`shields = ${n}`, `shields = shields + ${add}`, `shields = shields * 2`, 'print(shields)')}`, (n + add) * 2, `shields starts at ${n}, adds ${add} to get ${n + add}, then doubles: ${(n + add) * 2}.`, [`shields starts at ${n}.`, `After the second line it is ${n + add}.`, `After the third line it is ${(n + add) * 2}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['divmod', 'string', 'cast']);
      if (kind === 'divmod') {
        const total = rng.int(20, 99), k = rng.int(3, 9);
        const q = Math.floor(total / k), r = total % k;
        return text(`What does this program print?\n${code(`drachmas = ${total}`, `each = drachmas // ${k}`, `left = drachmas % ${k}`, 'print(each, left)')}`, `${q} ${r}`, `// is whole-number division (${total} // ${k} = ${q}) and % is the remainder (${total} % ${k} = ${r}). print with a comma puts a space between them.`, [`${total} // ${k} = ${q}.`, `${total} % ${k} = ${r}.`, `It prints ${q} ${r}.`], { accept: [`${q}, ${r}`, `${q},${r}`] });
      }
      if (kind === 'string') {
        const g = rng.pick(GODS), t = rng.int(2, 3);
        return text(`What does this program print?\n${code(`god = "${g}"`, `print(god * ${t})`)}`, g.repeat(t), `Multiplying a string repeats it: "${g}" * ${t} = ${g.repeat(t)}.`, ['god holds a string, not a number.', `* with a string repeats it ${t} times.`, `It prints ${g.repeat(t)}.`]);
      }
      const a = rng.int(1, 9), b = rng.int(1, 9);
      if (rng.chance(0.5)) return num(`What does this program print?\n${code(`x = "${a}"`, `y = "${b}"`, 'print(x + y)')}`, `${a}${b}`, `x and y are strings, so + joins them: "${a}" + "${b}" = ${a}${b}, not ${a + b}.`, ['The quotation marks make x and y strings.', '+ on strings joins them together (concatenation).', `It prints ${a}${b}.`]);
      return num(`What does this program print?\n${code(`x = "${a}"`, `y = "${b}"`, 'print(int(x) + int(y))')}`, a + b, `int() turns each string into a number, so this adds: ${a} + ${b} = ${a + b}.`, ['x and y start as strings.', 'int() converts them to integers.', `${a} + ${b} = ${a + b}.`]);
    }
    const kind = rng.pick(['swap', 'power', 'len']);
    if (kind === 'swap') {
      const x = rng.int(2, 9), y = rng.int(2, 9);
      return num(`What does this program print?\n${code(`x = ${x}`, `y = ${y}`, 'x, y = y, x + y', 'print(x * y)')}`, y * (x + y), `The right-hand side is worked out first using the OLD values: x becomes ${y} and y becomes ${x} + ${y} = ${x + y}. ${y} × ${x + y} = ${y * (x + y)}.`, ['In x, y = y, x + y both new values are calculated before either is stored.', `New x = ${y}, new y = ${x + y}.`, `x * y = ${y * (x + y)}.`]);
    }
    if (kind === 'power') {
      const a = rng.int(2, 4), b = rng.int(2, 3), m = rng.int(3, 9);
      const v = (a ** b) % m;
      return num(`What does this program print?\n${code(`print(${a} ** ${b} % ${m})`)}`, v, `** (power) comes before %: ${a} ** ${b} = ${a ** b}, and ${a ** b} % ${m} = ${v}.`, ['** means “to the power of” and is done first.', `${a} ** ${b} = ${a ** b}.`, `${a ** b} % ${m} is the remainder: ${v}.`]);
    }
    const w = rng.pick(WORDS).toLowerCase(), k = rng.int(2, 5);
    return num(`What does this program print?\n${code(`word = "${w}"`, `print(len(word) * ${k} - 1)`)}`, w.length * k - 1, `len("${w}") is ${w.length}; ${w.length} × ${k} − 1 = ${w.length * k - 1}.`, ['len() counts the characters in a string.', `"${w}" has ${w.length}.`, `${w.length} * ${k} - 1 = ${w.length * k - 1}.`]);
  },

  y8cSelection(level, rng) {
    if (level === 1) {
      const s = rng.int(1, 20), t = rng.int(5, 15);
      const out = s > t ? 'Hero' : 'Mortal';
      return text(`What does this program print?\n${code(`strength = ${s}`, `if strength > ${t}:`, '    print("Hero")', 'else:', '    print("Mortal")')}`, out, `${s} > ${t} is ${s > t ? 'True' : 'False'}, so the ${s > t ? 'if' : 'else'} branch runs.`, [`Test the condition: is ${s} greater than ${t}?`, `${s > t ? 'Yes' : 'No'}, so Python runs the ${s > t ? 'first' : 'else'} branch.`, `It prints ${out}.`]);
    }
    if (level === 2) {
      const score = rng.pick([rng.int(0, 100), 80, 50, 79, 49]);
      const out = score >= 80 ? 'Gold laurel' : score >= 50 ? 'Silver laurel' : 'Try again';
      return text(`The Oracle grades a quiz. What does this program print?\n${code(`score = ${score}`, 'if score >= 80:', '    print("Gold laurel")', 'elif score >= 50:', '    print("Silver laurel")', 'else:', '    print("Try again")')}`, out, `Python checks each condition in order and runs only the first true one. score = ${score}: ${score >= 80 ? '80 or more' : score >= 50 ? 'not 80 or more, but at least 50' : 'below 50'}.`, [`Is ${score} >= 80? ${score >= 80 ? 'Yes' : 'No'}.`, score >= 80 ? 'So the first branch runs and the rest are skipped.' : `Is ${score} >= 50? ${score >= 50 ? 'Yes' : 'No'}.`, `It prints ${out}.`]);
    }
    const a = rng.int(1, 10), b = rng.int(1, 10), looking = rng.chance(0.5);
    const kind = rng.pick(['andnot', 'or', 'nested']);
    if (kind === 'andnot') {
      const ok = a > 5 && !(b < 3);
      return text(`What does this program print?\n${code(`swords = ${a}`, `snakes = ${b}`, 'if swords > 5 and not snakes < 3:', '    print("Attack")', 'else:', '    print("Wait")')}`, ok ? 'Attack' : 'Wait', `swords > 5 is ${a > 5 ? 'True' : 'False'}; snakes < 3 is ${b < 3 ? 'True' : 'False'}, so not snakes < 3 is ${!(b < 3) ? 'True' : 'False'}. Both must be True for and.`, [`swords > 5: ${a > 5}.`, `not (snakes < 3): ${!(b < 3)}.`, `True and True is needed: it prints ${ok ? 'Attack' : 'Wait'}.`].map((s) => s.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False')));
    }
    if (kind === 'or') {
      const ok = a == b || a + b > 12;
      return text(`What does this program print?\n${code(`a = ${a}`, `b = ${b}`, 'if a == b or a + b > 12:', '    print("Open")', 'else:', '    print("Closed")')}`, ok ? 'Open' : 'Closed', `a == b is ${a === b ? 'True' : 'False'}; a + b = ${a + b}, so a + b > 12 is ${a + b > 12 ? 'True' : 'False'}. or needs at least one True.`, [`Is ${a} == ${b}? ${a === b ? 'True' : 'False'}.`, `Is ${a + b} > 12? ${a + b > 12 ? 'True' : 'False'}.`, `It prints ${ok ? 'Open' : 'Closed'}.`]);
    }
    const gaze = looking ? 'True' : 'False';
    const out = looking ? (a > 4 ? 'Stone' : 'Shield up') : 'Safe';
    return text(`Medusa’s gaze is a Boolean. What does this program print?\n${code(`looking = ${gaze}`, `distance = ${a}`, 'if looking:', '    if distance > 4:', '        print("Stone")', '    else:', '        print("Shield up")', 'else:', '    print("Safe")')}`, out, looking ? `looking is True, so the inner if runs: distance = ${a}, ${a > 4 ? 'more than 4' : 'not more than 4'}.` : 'looking is False, so the outer else runs and the inner if is never reached.', ['Start with the outer if: is looking True?', looking ? `Yes. Now the inner test: ${a} > 4 is ${a > 4 ? 'True' : 'False'}.` : 'No, so skip straight to the else.', `It prints ${out}.`]);
  },

  y8cLoops(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const n = rng.int(3, 10);
        return num(`What does this program print?\n${code('total = 0', `for i in range(1, ${n + 1}):`, '    total = total + i', 'print(total)')}`, (n * (n + 1)) / 2, `range(1, ${n + 1}) gives 1 to ${n} (the stop value is not included). 1 + 2 + … + ${n} = ${(n * (n + 1)) / 2}.`, [`range(1, ${n + 1}) counts 1, 2, …, ${n}: it stops before ${n + 1}.`, 'Each number is added to total.', `1 + … + ${n} = ${(n * (n + 1)) / 2}.`]);
      }
      const k = rng.int(3, 9), step = rng.int(2, 5);
      return num(`What does this program print?\n${code('jumps = 0', `for i in range(${k}):`, `    jumps = jumps + ${step}`, 'print(jumps)')}`, k * step, `range(${k}) repeats the loop ${k} times (0 to ${k - 1}). ${k} × ${step} = ${k * step}.`, [`range(${k}) gives ${k} values: 0, 1, …, ${k - 1}.`, `Each time, ${step} is added.`, `${k} × ${step} = ${k * step}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const start = rng.int(1, 5), stop = rng.int(15, 30), st = rng.int(2, 5);
        const vals = []; for (let i = start; i < stop; i += st) vals.push(i);
        return num(`What does this program print?\n${code('total = 0', `for i in range(${start}, ${stop}, ${st}):`, '    total = total + i', 'print(total)')}`, vals.reduce((a, b) => a + b, 0), `range(${start}, ${stop}, ${st}) gives ${list(vals)}. Their sum is ${vals.reduce((a, b) => a + b, 0)}.`, [`Start at ${start}, add ${st} each time, stop before ${stop}.`, `Values: ${list(vals)}.`, `Sum: ${vals.reduce((a, b) => a + b, 0)}.`]);
      }
      const limit = rng.int(20, 300), f = rng.pick([2, 3]);
      let n = 1; const seq = [1]; while (n < limit) { n *= f; seq.push(n); }
      return num(`What does this program print?\n${code('n = 1', `while n < ${limit}:`, `    n = n * ${f}`, 'print(n)')}`, n, `n goes ${seq.join(', ')}. The loop stops as soon as n is not less than ${limit}.`, [`The loop keeps multiplying by ${f} while n < ${limit}.`, `n: ${seq.join(' → ')}.`, `${n} is not less than ${limit}, so the loop ends and prints ${n}.`]);
    }
    const kind = rng.pick(['collatz', 'nested', 'evens']);
    if (kind === 'collatz') {
      const start = rng.pick([3, 5, 6, 7, 10, 12]);
      let x = start, steps = 0; while (x !== 1) { x = x % 2 === 0 ? x / 2 : 3 * x + 1; steps++; }
      return num(`What does this program print?\n${code(`x = ${start}`, 'steps = 0', 'while x != 1:', '    if x % 2 == 0:', '        x = x // 2', '    else:', '        x = 3 * x + 1', '    steps = steps + 1', 'print(steps)')}`, steps, `Following the rules from ${start} reaches 1 after ${steps} steps. (This is the famous Collatz sequence: nobody has proved it always reaches 1!)`, ['Even: halve it. Odd: times 3, add 1. Count each step.', `Start at ${start} and keep going until x is 1.`, `It takes ${steps} steps.`]);
    }
    if (kind === 'nested') {
      const a = rng.int(2, 5), b = rng.int(2, 6);
      return num(`What does this program print?\n${code('count = 0', `for i in range(${a}):`, `    for j in range(${b}):`, '        count = count + 1', 'print(count)')}`, a * b, `The inner loop runs ${b} times for each of the ${a} outer loops: ${a} × ${b} = ${a * b}.`, [`The outer loop runs ${a} times.`, `Each time, the inner loop runs ${b} times.`, `${a} × ${b} = ${a * b}.`]);
    }
    const n = rng.int(8, 20);
    let t = 0; for (let i = 1; i <= n; i++) if (i % 2 === 0) t += i;
    return num(`What does this program print?\n${code('total = 0', `for i in range(1, ${n + 1}):`, '    if i % 2 == 0:', '        total = total + i', 'print(total)')}`, t, `Only even numbers from 1 to ${n} are added: ${Array.from({ length: Math.floor(n / 2) }, (_, k) => 2 * (k + 1)).join(' + ')} = ${t}.`, ['i % 2 == 0 is True only for even numbers.', `The even numbers up to ${n} are added.`, `Total: ${t}.`]);
  },

  y8cLists(level, rng) {
    if (level === 1) {
      const xs = sample(rng, HEROES, rng.int(4, 6));
      if (rng.chance(0.5)) {
        const i = rng.int(0, xs.length - 1);
        return text(`What does this program print?\n${code(`heroes = [${xs.map((x) => `"${x}"`).join(', ')}]`, `print(heroes[${i}])`)}`, xs[i], `Python counts list positions from 0, so heroes[${i}] is item number ${i + 1}: ${xs[i]}.`, ['List indexes start at 0, not 1.', `Index ${i} is the ${['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][i]} item.`, `It prints ${xs[i]}.`]);
      }
      return num(`What does this program print?\n${code(`gods = [${sample(rng, GODS, xs.length).map((x) => `"${x}"`).join(', ')}]`, 'print(len(gods))')}`, xs.length, `len() gives the number of items: ${xs.length}.`, ['len() counts items in a list.', `There are ${xs.length} names in the list.`, `It prints ${xs.length}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['neg', 'slice', 'append']);
      if (kind === 'neg') {
        const xs = sample(rng, GODS, 5), i = rng.int(1, 3);
        return text(`What does this program print?\n${code(`gods = [${xs.map((x) => `"${x}"`).join(', ')}]`, `print(gods[-${i}])`)}`, xs[xs.length - i], `Negative indexes count from the end: -1 is the last item, so -${i} is ${xs[xs.length - i]}.`, ['gods[-1] is the last item.', `gods[-${i}] is ${i} from the end.`, `It prints ${xs[xs.length - i]}.`]);
      }
      if (kind === 'slice') {
        const w = rng.pick(['LABYRINTH', 'MINOTAUR', 'PEGASUS', 'CERBERUS', 'ODYSSEY', 'OLYMPIAN', 'POSEIDON', 'CHIMERA']);
        const a = rng.int(0, 3), b = rng.int(a + 2, Math.min(w.length, a + 4));
        return text(`What does this program print?\n${code(`word = "${w}"`, `print(word[${a}:${b}])`)}`, w.slice(a, b), `word[${a}:${b}] takes characters from index ${a} up to, but not including, index ${b}: ${w.slice(a, b)}.`, ['Characters are numbered from 0.', `Start at index ${a} (${w[a]}) and stop before index ${b}.`, `It prints ${w.slice(a, b)}.`]);
      }
      const xs = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)], add = rng.int(1, 9);
      const all = [...xs, add];
      return num(`What does this program print?\n${code(`scores = [${list(xs)}]`, `scores.append(${add})`, 'print(sum(scores) - len(scores))')}`, all.reduce((a, b) => a + b, 0) - all.length, `After append the list is [${list(all)}]: sum ${all.reduce((a, b) => a + b, 0)}, length ${all.length}. ${all.reduce((a, b) => a + b, 0)} − ${all.length} = ${all.reduce((a, b) => a + b, 0) - all.length}.`, [`append adds ${add} to the end.`, `sum = ${all.reduce((a, b) => a + b, 0)}, len = ${all.length}.`, `${all.reduce((a, b) => a + b, 0)} - ${all.length} = ${all.reduce((a, b) => a + b, 0) - all.length}.`]);
    }
    if (rng.chance(0.5)) {
      const m = rng.int(2, 4), c = rng.int(1, 5), x = rng.int(1, 3);
      const f = (v) => v * m + c;
      return num(`What does this program print?\n${code('def charge(power):', `    return power * ${m} + ${c}`, '', `print(charge(charge(${x})))`)}`, f(f(x)), `The inner call runs first: charge(${x}) = ${f(x)}. Then charge(${f(x)}) = ${f(f(x))}.`, [`charge(${x}) = ${x} * ${m} + ${c} = ${f(x)}.`, `That result is passed in again: charge(${f(x)}).`, `= ${f(x)} * ${m} + ${c} = ${f(f(x))}.`]);
    }
    const xs = Array.from({ length: 5 }, () => rng.int(1, 30));
    const best = Math.max(...xs);
    return num(`What does this program print?\n${code(`heights = [${list(xs)}]`, 'best = heights[0]', 'for h in heights:', '    if h > best:', '        best = h', 'print(best)')}`, best, `The loop keeps the biggest value seen so far. It ends with ${best}.`, ['best starts as the first item.', 'Each item bigger than best replaces it.', `The largest is ${best}.`]);
  },

  // --- GCSE tasters --------------------------------------------------------------------------
  y8cTwos(level, rng) {
    if (level === 1) {
      const n = -rng.int(1, 20);
      const b = bin((n + 256) % 256, 8);
      return num(`In 8-bit two’s complement the leftmost bit is worth −128. What denary number is \`${b}\`?`, n, `−128 + ${128 + n} = ${minus(n)}.`, ['The place values are −128, 64, 32, 16, 8, 4, 2, 1.', `The other 1s add up to ${128 + n}.`, `−128 + ${128 + n} = ${minus(n)}.`]);
    }
    if (level === 2) {
      const n = -rng.int(2, 100);
      const pos = bin(-n, 8), flipped = [...pos].map((c) => (c === '0' ? '1' : '0')).join('');
      return binAnswer(`Write ${minus(n)} in 8-bit two’s complement.`, n + 256, 8, `Write ${-n} in binary (${pos}), flip every bit (${flipped}), then add 1: ${bin(n + 256, 8)}.`, [`${-n} = ${pos}.`, `Flip the bits: ${flipped}.`, `Add 1: ${bin(n + 256, 8)}.`]);
    }
    if (rng.chance(0.4)) {
      const [q, v] = rng.pick([['smallest', -128], ['largest', 127]]);
      return num(`What is the ${q} number an 8-bit two’s complement byte can hold?`, v, `The range is −128 (10000000) to 127 (01111111).`, ['The leftmost bit is worth −128.', q === 'smallest' ? 'Only that bit set: 10000000 = −128.' : 'Every bit except that one: 01111111 = 127.', `So ${minus(v)}.`]);
    }
    const a = rng.int(20, 100), b = -rng.int(5, a - 1);
    return num(`Add \`${bin(a, 8)}\` (${a}) and \`${bin(b + 256, 8)}\` (two’s complement). Ignoring the carry out of the 8th bit, what is the answer in denary?`, a + b, `${bin(b + 256, 8)} is ${minus(b)}, so the sum is ${a} + (${minus(b)}) = ${a + b}. The carry out of the top bit is simply discarded.`, [`${bin(b + 256, 8)} = −128 + ${128 + b} = ${minus(b)}.`, `${a} + (${minus(b)}) = ${a + b}.`, 'In two’s complement, subtraction is just adding a negative number.']);
  },

  y8cSQL(level, rng) {
    const rows = sample(rng, [
      ['Perseus', 'Argos', 78, 3], ['Theseus', 'Athens', 84, 4], ['Jason', 'Iolcus', 71, 2], ['Atalanta', 'Arcadia', 88, 3],
      ['Odysseus', 'Ithaca', 69, 5], ['Hippolyta', 'Themiscyra', 90, 2], ['Cadmus', 'Thebes', 64, 1], ['Orpheus', 'Thrace', 52, 2], ['Penelope', 'Ithaca', 58, 1], ['Bellerophon', 'Corinth', 75, 3],
    ], 6);
    const table = code('name        | home        | strength | quests', ...rows.map(([n, h, s, q]) => `${n.padEnd(11)} | ${h.padEnd(11)} | ${String(s).padEnd(8)} | ${q}`));
    if (level === 1) {
      const t = rng.pick([2, 3]);
      const n = rows.filter((r) => r[3] === t).length;
      return num(`Table **Heroes**:\n${table}\nHow many rows does this query return?\n${code(`SELECT name FROM Heroes WHERE quests = ${t};`)}`, n, `WHERE keeps only rows whose quests value is ${t}: ${rows.filter((r) => r[3] === t).map((r) => r[0]).join(', ') || 'none'}.`, ['SELECT chooses columns; WHERE chooses rows.', `Look down the quests column for ${t}.`, `${n} row${n === 1 ? '' : 's'}.`]);
    }
    if (level === 2) {
      const t = rng.pick([60, 70, 75, 80]);
      const n = rows.filter((r) => r[2] > t).length;
      return num(`Table **Heroes**:\n${table}\nHow many names does this query return?\n${code(`SELECT name FROM Heroes WHERE strength > ${t};`)}`, n, `Strength greater than ${t}: ${rows.filter((r) => r[2] > t).map((r) => r[0]).join(', ') || 'none'}.`, [`Check each strength against ${t} (equal does not count for >).`, `Matching rows: ${rows.filter((r) => r[2] > t).map((r) => r[0]).join(', ') || 'none'}.`, `${n} name${n === 1 ? '' : 's'}.`]);
    }
    if (rng.chance(0.5)) {
      const sorted = rows.slice().sort((a, b) => b[2] - a[2]);
      return text(`Table **Heroes**:\n${table}\nWhat is the FIRST name returned by this query?\n${code('SELECT name FROM Heroes ORDER BY strength DESC;')}`, sorted[0][0], `ORDER BY strength DESC sorts from strongest to weakest, so ${sorted[0][0]} (${sorted[0][2]}) comes first.`, ['DESC means descending: biggest first.', 'Find the highest strength.', `${sorted[0][0]} has ${sorted[0][2]}.`], { strict: false });
    }
    const s = rng.pick([55, 60, 65, 70]), q = rng.pick([2, 3]);
    const n = rows.filter((r) => r[2] > s && r[3] >= q).length;
    return num(`Table **Heroes**:\n${table}\nHow many rows does this query return?\n${code(`SELECT * FROM Heroes WHERE strength > ${s} AND quests >= ${q};`)}`, n, `Both conditions must be true: ${rows.filter((r) => r[2] > s && r[3] >= q).map((r) => r[0]).join(', ') || 'no rows'}.`, [`strength > ${s} AND quests >= ${q}: a row needs both.`, `Rows that pass: ${rows.filter((r) => r[2] > s && r[3] >= q).map((r) => r[0]).join(', ') || 'none'}.`, `${n} row${n === 1 ? '' : 's'}.`]);
  },

  y8cTraceTable(level, rng) {
    if (level === 1) {
      const a = rng.int(1, 5), b = rng.int(2, 4), times = rng.int(3, 4);
      let x = a; const seq = [];
      for (let i = 0; i < times; i++) { x = x + b; seq.push(x); }
      const k = rng.int(2, times);
      return num(`Complete a trace table for this program. What is the value of x after the loop has run ${k} times?\n${code(`x = ${a}`, `for i in range(${times}):`, `    x = x + ${b}`, 'print(x)')}`, seq[k - 1], `x goes ${a} → ${seq.join(' → ')}. After ${k} times it is ${seq[k - 1]}.`, ['A trace table has a row for each time round the loop.', `x: ${a}, then ${seq.join(', ')}.`, `After loop ${k}: ${seq[k - 1]}.`], { _py: `x = ${a}\nfor i in range(${k}):\n    x = x + ${b}\nprint(x)` });
    }
    if (level === 2) {
      const n = rng.int(4, 6);
      let a = 0, b = 1; const rowsT = [];
      for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; rowsT.push([a, b]); }
      return num(`What is the final value of a?\n${code('a = 0', 'b = 1', `for i in range(${n}):`, '    a, b = b, a + b', 'print(a)')}`, a, `Trace: ${rowsT.map(([x, y], i) => `i=${i}: a=${x}, b=${y}`).join('; ')}. These are the Fibonacci numbers.`, ['Both new values use the OLD a and b.', `Rows: ${rowsT.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`, `Final a = ${a}.`]);
    }
    const n = rng.int(12, 60), d = rng.pick([2, 3, 5]);
    let x = n, c = 0; const seq = [n];
    while (x >= d) { x = Math.floor(x / d); c++; seq.push(x); }
    return num(`How many times does the loop body run?\n${code(`x = ${n}`, 'count = 0', `while x >= ${d}:`, `    x = x // ${d}`, '    count = count + 1', 'print(count)')}`, c, `x goes ${seq.join(' → ')}. That is ${c} time${c === 1 ? '' : 's'} round the loop.`, [`Each time, x is divided by ${d} (whole-number division).`, `x: ${seq.join(', ')}.`, `The loop stops when x is less than ${d}: ${c} time${c === 1 ? '' : 's'}.`]);
  },
};

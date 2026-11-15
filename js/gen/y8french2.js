// Year 8 French drills that never run out: numbers (to 9,999, with the 70–99 system and years),
// prices in euros, days, months and dates, and telling the time (12-hour and 24-hour).
// Traditional spelling throughout (vingt et un, quatre-vingts, deux cents, deux mille vingt-six);
// the 1990 spelling with hyphens everywhere (vingt-et-un, deux-mille-vingt-six) is accepted too,
// because French schools accept it. Typed French answers carry lang: 'fr' (accents forgiven, no other slips).

const NB = ' '; // French puts a non-breaking space before ? ! : ; and €

// ------------------------------------------------------------------ numbers
const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

function below100(n) {
  if (n < 20) return UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10), u = n % 10;
    if (u === 0) return TENS[t];
    return u === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${UNITS[u]}`;
  }
  if (n < 80) return n === 71 ? 'soixante et onze' : `soixante-${UNITS[n - 60]}`;
  if (n === 80) return 'quatre-vingts';
  return `quatre-vingt-${UNITS[n - 80]}`;
}

/** A whole number from 0 to 9,999 in words, traditional spelling. */
export function frNumber(n) {
  if (!Number.isInteger(n) || n < 0 || n > 9999) throw new Error(`frNumber: ${n}`);
  if (n < 100) return below100(n);
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    const head = h === 1 ? 'cent' : `${UNITS[h]} ${r ? 'cent' : 'cents'}`;
    return r ? `${head} ${below100(r)}` : head;
  }
  const th = Math.floor(n / 1000), r = n % 1000;
  const head = th === 1 ? 'mille' : `${UNITS[th]} mille`;
  return r ? `${head} ${frNumber(r)}` : head;
}
/** The 1990 spelling: hyphens between all the number words. */
export const reformed = (w) => w.replace(/ /g, '-');
/** Every accepted spelling of a number (traditional first). Years 1100–1999 can also be said in hundreds. */
export function numberSpellings(n, { year = false } = {}) {
  const out = [frNumber(n)];
  if (year && n >= 1100 && n < 2000 && n % 100) {
    const r = n % 100;
    out.push(`${frNumber(Math.floor(n / 100))} cent ${below100(r)}`); // dix-neuf cent quatre-vingt-dix-huit
    out.push(frNumber(n).replace(/^mille /, 'mil ')); // the old spelling for dates
  }
  return [...new Set(out.flatMap((w) => [w, reformed(w)]))];
}

/** Learners' typical wrong spellings of n: never a correct spelling of any number. */
function wrongSpellings(n) {
  const out = [];
  const t = Math.floor((n % 100) / 10), u = n % 10, r = n % 100, head = n >= 100 ? frNumber(n - r) : '';
  const join = (x) => (head ? `${head} ${x}` : x);
  if (r >= 21 && r <= 61 && u === 1) out.push(join(`${TENS[t]}-un`)); // vingt-un for vingt et un
  if (r === 71) out.push(join('soixante-onze'), join('soixante-dix-un'));
  if (r > 71 && r < 80) out.push(join(`soixante-dix-${UNITS[u]}`)); // soixante-dix-quatre for 74
  if (r === 80) out.push(join('quatre-vingt'));
  if (r === 81) out.push(join('quatre-vingt et un'), join('quatre-vingts-un'));
  if (r > 81 && r < 90) out.push(join(`quatre-vingts-${UNITS[u]}`));
  if (r === 91) out.push(join('quatre-vingt et onze'), join('quatre-vingt-dix-un'));
  if (r > 91) out.push(join(`quatre-vingt-dix-${UNITS[u]}`)); // quatre-vingt-dix-deux for 92
  if (n >= 200 && n < 1000 && r === 0) out.push(frNumber(n).replace(/cents$/, 'cent'));
  if (n >= 200 && n < 1000 && r) out.push(frNumber(n).replace(' cent ', ' cents '));
  if (n >= 2000) out.push(frNumber(n).replace(' mille', ' milles'));
  if (n >= 2001 && n < 2100) out.push(`vingt ${below100(n % 100)}`); // English-style "twenty twenty-six"
  if (n >= 1000 && n < 2000) out.push(frNumber(n).replace(/^mille/, 'un mille'));
  return out;
}

const fmtPrice = (c) => `${Math.floor(c / 100)},${String(c % 100).padStart(2, '0')}${NB}€`;
const enPrice = (c) => `€${Math.floor(c / 100)}.${String(c % 100).padStart(2, '0')}`;
/** A price in cents, said as French people say it: trois euros cinquante. */
export function frPrice(c) {
  const e = Math.floor(c / 100), ct = c % 100;
  const euros = `${frNumber(e)} ${e === 1 ? 'euro' : 'euros'}`;
  return ct ? `${euros} ${frNumber(ct)}` : euros;
}
function priceSpellings(c) {
  const e = Math.floor(c / 100), ct = c % 100, unit = e === 1 ? 'euro' : 'euros';
  const out = [frPrice(c)];
  for (const ew of numberSpellings(e)) {
    if (!ct) { out.push(`${ew} ${unit}`); continue; }
    for (const cw of numberSpellings(ct)) out.push(`${ew} ${unit} ${cw}`, `${ew} ${unit} et ${cw} centimes`, `${ew} ${unit} ${cw} centimes`);
  }
  return [...new Set(out)];
}

// ------------------------------------------------------------------ helpers
function choice(prompt, correct, wrongs, rng, extra) {
  const seen = new Set([correct.toLowerCase()]);
  const ws = [];
  for (const w of wrongs) if (w && !seen.has(w.toLowerCase())) { seen.add(w.toLowerCase()); ws.push(w); }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.slice(0, 3).map((t) => ({ text: t }))]), ...extra };
}
const typedFr = (prompt, [answer, ...accept], extra) => ({ kind: 'typed', prompt, answer, accept, lang: 'fr', placeholder: 'Type it in French', ...extra });
const near = (rng, list, n, lo, hi) => rng.shuffle([...new Set(list.filter((x) => x !== n && x >= lo && x <= hi))]);
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/** How a French number word breaks down (for reading French → figures). */
function breakdown(n) {
  const r = n % 100;
  if (n >= 1000) return `${n >= 2000 ? `${UNITS[Math.floor(n / 1000)]} mille (${Math.floor(n / 1000)} × 1000)` : 'mille (1000)'}${n % 1000 ? ` + ${frNumber(n % 1000)} (${n % 1000})` : ''}.`;
  if (n >= 100) return `${n >= 200 ? `${UNITS[Math.floor(n / 100)]} ${r ? 'cent' : 'cents'} (${Math.floor(n / 100)} × 100)` : 'cent (100)'}${r ? ` + ${below100(r)} (${r})` : ''}.`;
  if (n >= 80) return `quatre-vingt${n === 80 ? 's' : ''} (4 × 20)${n > 80 ? ` + ${UNITS[n - 80]} (${n - 80})` : ''}.`;
  if (n >= 70) return `soixante (60) + ${UNITS[n - 60]} (${n - 60}).`;
  if (n >= 20) return n % 10 ? `${TENS[Math.floor(n / 10)]} (${n - (n % 10)}) + ${UNITS[n % 10]} (${n % 10}).` : `${TENS[n / 10]} is a tens word.`;
  return n >= 17 ? `dix (10) + ${UNITS[n - 10]} (${n - 10}).` : 'This one is learned by heart.';
}
/** How to build a number in French, without saying the answer (for figures → French). */
function hint(n) {
  const r = n % 100, u = n % 10;
  if (n >= 100) {
    const parts = [n >= 1000 ? Math.floor(n / 1000) * 1000 : 0, Math.floor((n % 1000) / 100) * 100, r].filter(Boolean);
    return `${n} = ${parts.join(' + ')}. ${n >= 1000 ? 'mille never takes an s. ' : ''}${n % 1000 >= 200 ? 'cent takes an s only when nothing follows it: deux cents, but deux cent dix.' : 'Say each part as you would on its own.'}`;
  }
  if (n >= 80) return n === 80 ? '80 = 4 × 20. With nothing after it, vingt takes an s.' : `${n} = 4 × 20 + ${n - 80}. No et and no s: the vingt is followed by another number.`;
  if (n >= 70) return `${n} = 60 + ${n - 60}${n === 71 ? ', joined with et' : ''}.`;
  if (n >= 20) return u ? `${n} = ${n - u} + ${u}${u === 1 ? ', joined with et' : ', joined with a hyphen'}.` : `${n} is a tens word.`;
  if (n >= 17) return `${n} = 10 + ${n - 10}: dix, a hyphen, then the unit.`;
  return n > 10 ? '11 to 16 are single words to learn by heart: onze, douze, treize, quatorze, quinze, seize.' : 'Up to ten: un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.';
}
const NUM_STEPS_RULES = 'From 70, French counts in twenties: 70 = soixante-dix (60 + 10), 80 = quatre-vingts (4 × 20), 90 = quatre-vingt-dix (4 × 20 + 10).';

function pickNumber(level, rng) {
  if (level === 1) return rng.chance(0.4) ? rng.pick([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 31, 41, 51, 61]) : rng.int(20, 69);
  if (level === 2) return rng.int(70, 99);
  return rng.pick([() => rng.int(100, 999), () => rng.int(2000, 2040), () => rng.int(1900, 1999), () => rng.int(1000, 9999)])();
}

// ------------------------------------------------------------------ dates
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const LENGTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // February: never asked across its end
const enOrd = (d) => `${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`;
/** The French for the day of the month: premier for the 1st, otherwise the plain number. */
const frDay = (d) => (d === 1 ? 'premier' : frNumber(d));
/** le premier mai, le onze novembre (no elision before onze or huit). */
const frDate = (d, m, day) => `le ${day != null ? `${DAYS[day]} ` : ''}${frDay(d)} ${MONTHS[m]}`;
function dateSpellings(d, m, day) {
  const dayW = day != null ? `${DAYS[day]} ` : '';
  const words = [frDay(d), ...(d > 20 && d % 10 === 1 ? [reformed(frDay(d))] : [])];
  const figs = [d === 1 ? '1er' : String(d)];
  const out = [];
  for (const x of [...words, ...figs]) out.push(`le ${dayW}${x} ${MONTHS[m]}`, `${dayW}${x} ${MONTHS[m]}`);
  return [...new Set(out)];
}
function englishDateAccept(d, m) {
  const M = MONTHS_EN[m], o = enOrd(d);
  return [`${d} ${M}`, `${o} ${M}`, `the ${o} of ${M}`, `${o} of ${M}`, `the ${o} ${M}`, `${M} ${d}`, `${M} ${o}`, `${M} the ${o}`, `${d}/${m + 1}`];
}
/** French ordinal (for wrong options only): deuxième, cinquième, neuvième, vingt et unième. */
function frOrdinal(n) {
  const w = frNumber(n);
  if (w.endsWith('cinq')) return `${w}uième`;
  if (w.endsWith('neuf')) return `${w.slice(0, -1)}vième`;
  if (w.endsWith('e')) return `${w.slice(0, -1)}ième`;
  return `${w}ième`;
}

// ------------------------------------------------------------------ time
/** “une heure”, “deux heures”, “vingt et une heures”: heure is feminine. */
const heures = (h) => (h === 1 ? 'une heure' : `${frNumber(h).replace(/\bun$/, 'une')} heures`);
const EN_NUM = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const EN_MIN = { 5: 'five', 10: 'ten', 15: 'quarter', 20: 'twenty', 25: 'twenty-five', 30: 'half' };
const digital = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const d24 = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
/** The usual 12-hour way to say h:m (h from 1 to 10, so the hour after is never midday or midnight). */
function clock12(h, m) {
  if (m === 0) return heures(h);
  if (m === 15) return `${heures(h)} et quart`;
  if (m === 30) return `${heures(h)} et demie`;
  if (m < 30) return `${heures(h)} ${frNumber(m)}`;
  if (m === 45) return `${heures(h + 1)} moins le quart`;
  return `${heures(h + 1)} moins ${frNumber(60 - m)}`;
}
/** Every correct way of saying h:m in the 12-hour clock (the usual one first). */
function clock12All(h, m) {
  const out = [clock12(h, m)];
  if (m) out.push(`${heures(h)} ${frNumber(m)}`); // trois heures quinze, trois heures quarante-cinq
  return [...new Set(out)];
}
function english12(h, m) {
  if (m === 0) return `${EN_NUM[h]} o’clock`;
  if (m <= 30) return `${EN_MIN[m]} past ${EN_NUM[h]}`;
  return `${EN_MIN[60 - m] || frNumber(60 - m)} to ${EN_NUM[h + 1]}`;
}
/** The 24-hour way: dix-sept heures quarante. */
const clock24 = (h, m) => (m ? `${heures(h)} ${frNumber(m)}` : heures(h));
function clock24All(h, m) {
  const out = [clock24(h, m)];
  if (m === 15) out.push(`${heures(h)} et quart`);
  if (m === 30) out.push(`${heures(h)} et demie`);
  return out;
}
const withIlEst = (list) => list.flatMap((p) => [`Il est ${p}`, p]);

// ------------------------------------------------------------------ the generators
export const Y8_FRENCH2_GENERATORS = {
  y8frNumbers(level, rng) {
    const n = pickNumber(level, rng);
    const isYear = level === 3 && n >= 1900 && n <= 2040;
    const spell = numberSpellings(n, { year: isYear });
    const w = spell[0];
    const what = isYear ? `the year **${n}**` : `**${n}**`;
    const tens = near(rng, [n + 10, n - 10, n + 20, n - 20, n + 1, n - 1, ...(n < 100 ? [Number(String(n).split('').reverse().join(''))] : [])], n, level === 1 ? 0 : level === 2 ? 50 : 100, 9999);
    const rule = level === 2 ? NUM_STEPS_RULES : level === 3 ? 'Say the thousands, then the hundreds, then the last two digits, exactly as you would on their own.' : 'Up to 69, French works like English: the tens, then the units. 21, 31, 41, 51 and 61 use et: vingt et un.';
    const steps = [rule, hint(n), `So ${n} = ${w}.`];
    const t = level === 3 ? rng.pick([0, 0, 1, 1, 2]) : rng.int(0, 2);
    if (t === 0) {
      return { kind: 'typed', prompt: `Write this number in figures: **${w}**`, numeric: { value: String(n), form: 'any' }, hear: w, placeholder: 'Type a number', explain: `${w} = ${n}.`, steps: [rule, `Split it up: ${breakdown(n)}`, `${w} = ${n}.`] };
    }
    if (t === 1) {
      // figures → French, choose: learners’ favourite wrong spellings, then nearby numbers
      const wrongs = [...rng.shuffle(wrongSpellings(n)), ...tens.map((x) => frNumber(x))].filter((x) => !spell.includes(x) && !spell.includes(reformed(x)));
      return choice(`Which is ${what} in French?`, w, wrongs, rng, { explain: `${n} = ${w}.`, steps });
    }
    return typedFr(`Write ${what} in French, in words.`, spell, { explain: `${n} = ${w}.${spell.length > 1 ? ` (With hyphens everywhere, ${reformed(w)}, is fine too.)` : ''}`, steps });
  },

  y8frPrices(level, rng) {
    const e = level === 1 ? rng.int(1, 20) : level === 2 ? rng.int(1, 99) : rng.int(1, 9);
    const ct = level === 1 ? rng.pick([0, 10, 20, 50, 50, 80]) : rng.int(2, 19) * 5; // never 1–9 cents, which people say in different ways
    const c = e * 100 + ct;
    if (level === 3 && rng.chance(0.6)) {
      // shopping: add up two things, or several of the same thing
      const ITEMS = [['À la boulangerie', 'un croissant', 'croissants'], ['À la boulangerie', 'une baguette', 'baguettes'], ['À la boulangerie', 'un pain au chocolat', 'pains au chocolat'], ['Au marché', 'un melon', 'melons'], ['Au café', 'une crêpe', 'crêpes'], ['Au café', 'un jus d’orange', 'jus d’orange']];
      const [where, one, many] = rng.pick(ITEMS);
      const unit = rng.int(1, 3) * 100 + rng.pick([10, 20, 30, 40, 50, 60, 70, 80, 90]);
      const k = rng.int(2, 4);
      const total = unit * k;
      const wrongs = [total + 100, total - 100, unit * (k + 1), unit + k * 100, total + 10, total - 10].filter((x) => x > 0 && x !== total).map(fmtPrice);
      return choice(`${where}, ${one} coûte **${frPrice(unit)}**. J’en achète ${frNumber(k)}. Ça fait combien${NB}?`, fmtPrice(total), rng.shuffle(wrongs), rng, {
        hear: `${cap(one)} coûte ${frPrice(unit)}.`,
        explain: `${frPrice(unit)} = ${enPrice(unit)}, and ${k} × ${enPrice(unit)} = ${enPrice(total)}: ${fmtPrice(total)}, said ${frPrice(total)}. (J’en achète ${k} = I buy ${k} of them: ${k} ${many}.)`,
        steps: [`${frPrice(unit)}: the euros first, then the cents, so ${enPrice(unit)} each.`, `J’en achète ${frNumber(k)}: I buy ${k}, so work out ${k} × ${enPrice(unit)}.`, `${k} × ${enPrice(unit)} = ${enPrice(total)}, written ${fmtPrice(total)} in France and said ${frPrice(total)}.`],
      });
    }
    const said = frPrice(c);
    const rule = 'Prices are said euros first, then the cents, usually without the word “centimes”. French writes a comma where English has a decimal point.';
    const steps = [rule, `${fmtPrice(c)} is ${e} ${e === 1 ? 'euro' : 'euros'}${ct ? ` and ${ct} cents` : ''}.`, `${fmtPrice(c)} (${enPrice(c)}) = ${said}.`];
    const t = rng.int(0, 2);
    if (t === 0) {
      const alt = [ct * 100 + (e % 100), e * 100 + (ct % 10) * 10 + Math.floor(ct / 10), e * 100 + Math.floor(ct / 10), (e + 10) * 100 + ct, Math.max(1, e - 10) * 100 + ct, e * 100 + (ct + 10) % 100, (e + 20) * 100 + ct];
      const wrongs = rng.shuffle(alt.filter((x) => x !== c && x >= 100 && x % 100 !== x).map(fmtPrice));
      return choice(`Ça coûte **${said}**. Which price is that?`, fmtPrice(c), wrongs, rng, { hear: `Ça coûte ${said}.`, explain: `${said} = ${fmtPrice(c)} (${enPrice(c)}).`, steps: [rule, `${frNumber(e)} = ${e}${ct ? `, ${frNumber(ct)} = ${ct}` : ''}.`, `${said} = ${fmtPrice(c)} (${enPrice(c)}).`] });
    }
    const spell = priceSpellings(c);
    if (t === 1) {
      const wrongs = [...wrongSpellings(e).map((x) => `${x} euros${ct ? ` ${frNumber(ct)}` : ''}`), ...(ct ? wrongSpellings(ct).map((x) => `${frNumber(e)} ${e === 1 ? 'euro' : 'euros'} ${x}`) : []), ...[e + 10, e - 10, e + 20, e - 20].filter((x) => x >= 1 && x <= 99).map((x) => frPrice(x * 100 + ct)), ...(ct ? [frPrice(e * 100 + (ct >= 90 ? ct - 10 : ct + 10)), frPrice(e * 100 + (ct >= 50 ? ct - 20 : ct + 20))] : [frPrice(c + 50)])]
        .filter((x) => !spell.includes(x));
      return choice(`How do you say **${fmtPrice(c)}** in French?`, said, rng.shuffle(wrongs), rng, { explain: `${fmtPrice(c)} (${enPrice(c)}) = ${said}.`, steps });
    }
    return typedFr(`Say this price in French, in words: **${fmtPrice(c)}**`, spell, { explain: `${fmtPrice(c)} = ${said}.${ct ? ` (${frPrice(e * 100)} et ${frNumber(ct)} centimes is also right, but people usually leave out “centimes”.)` : ''}`, steps });
  },

  y8frDates(level, rng) {
    if (level === 1) {
      const t = rng.int(0, 3);
      if (t === 0) {
        const i = rng.int(0, 6);
        const wrongs = [DAYS_EN[(i + 1) % 7], DAYS_EN[(i + 6) % 7], DAYS_EN[(i + 2) % 7], DAYS_EN[(i + 5) % 7]];
        return choice(`What does **${DAYS[i]}** mean?`, DAYS_EN[i], wrongs, rng, { hear: DAYS[i], explain: `${DAYS[i]} = ${DAYS_EN[i]}. Days have no capital letter in French.`, steps: ['The days in order: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.', `${DAYS[i]} is day ${i + 1}, counting from Monday.`, `So ${DAYS[i]} = ${DAYS_EN[i]}.`] });
      }
      if (t === 1) {
        const i = rng.int(0, 6);
        return typedFr(`What is the day after **${DAYS[i]}**? Write it in French.`, [DAYS[(i + 1) % 7]], { hear: DAYS[i], explain: `After ${DAYS[i]} (${DAYS_EN[i]}) comes ${DAYS[(i + 1) % 7]} (${DAYS_EN[(i + 1) % 7]}).`, steps: ['Say the week in order: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.', `Find ${DAYS[i]} and move on one day.`, `${DAYS[(i + 1) % 7]}: no capital letter.`] });
      }
      const m = rng.int(0, 11);
      if (t === 2) {
        return typedFr(`How do you say **${MONTHS_EN[m]}** in French?`, [MONTHS[m]], { explain: `${MONTHS_EN[m]} = ${MONTHS[m]}. Months have no capital letter in French.`, steps: ['The months: janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre.', `${MONTHS_EN[m]} is month ${m + 1}.`, `So ${MONTHS_EN[m]} = ${MONTHS[m]}${m === 7 ? ' (the circumflex in août is silent; say “oot”)' : ''}.`] });
      }
      const wrongs = [MONTHS[(m + 1) % 12], MONTHS[(m + 11) % 12], ...(m === 5 ? ['juillet'] : m === 6 ? ['juin'] : m === 3 ? ['août'] : m === 7 ? ['avril'] : []), MONTHS[(m + 6) % 12]];
      return choice(`Which month is **${MONTHS_EN[m]}**?`, MONTHS[m], wrongs, rng, { explain: `${MONTHS_EN[m]} = ${MONTHS[m]}.`, steps: ['The months: janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre.', `${MONTHS_EN[m]} is month ${m + 1}.`, `So ${MONTHS_EN[m]} = ${MONTHS[m]}.`] });
    }
    if (level === 2) {
      const m = rng.int(0, 11);
      const d = rng.chance(0.3) ? rng.pick([1, 8, 11, 21, 31].filter((x) => x <= LENGTH[m])) : rng.int(1, LENGTH[m]);
      const fr = frDate(d, m);
      const en = `${d} ${MONTHS_EN[m]}`;
      const steps = ['A date is le + the number + the month: le quatorze juillet.', d === 1 ? 'The 1st is the one exception: it uses premier, not un.' : d === 8 || d === 11 ? 'There is no l’ before huit or onze.' : 'Every day except the 1st uses the plain number (deux, trois…), never “deuxième”.', `${en} = ${fr}.`];
      const t = rng.int(0, 2);
      if (t === 0) {
        const [answer, ...accept] = englishDateAccept(d, m);
        return { kind: 'typed', prompt: `Write this date in English: **${fr}**`, answer, accept, strict: true, hear: fr, placeholder: 'e.g. 3 May', explain: `${fr} = ${en}.`, steps };
      }
      if (t === 1) {
        const wrongs = [
          ...(d === 1 ? [`le un ${MONTHS[m]}`, `la première ${MONTHS[m]}`, `le première ${MONTHS[m]}`] : [`le ${frOrdinal(d)} ${MONTHS[m]}`]),
          ...(d === 8 || d === 11 ? [`l’${frNumber(d)} ${MONTHS[m]}`] : []),
          ...(d > 20 && d % 10 === 1 ? [`le ${TENS[Math.floor(d / 10)]}-un ${MONTHS[m]}`] : []),
          ...[d + 10, d - 10, d + 2, d - 2].filter((x) => x >= 2 && x <= LENGTH[m]).map((x) => frDate(x, m)),
          frDate(d, (m + 1) % 12), frDate(d, (m + 11) % 12),
        ];
        return choice(`How do you say **${en}** in French?`, fr, rng.shuffle(wrongs.slice(0, 3)).concat(rng.shuffle(wrongs.slice(3))), rng, { explain: `${en} = ${fr}.`, steps });
      }
      return typedFr(`Write **${en}** in French. (Write the number in words.)`, dateSpellings(d, m), { explain: `${en} = ${fr}. In a letter you could write it in figures: le ${d === 1 ? '1er' : d} ${MONTHS[m]}.`, steps });
    }
    // level 3: tomorrow and yesterday across the end of a month, and dates with years
    if (rng.chance(0.5)) {
      const fwd = rng.chance(0.5);
      // never across the end of February, whose length depends on the year
      const m = fwd ? rng.pick([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) : rng.pick([0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      const d = fwd ? LENGTH[m] : 1;
      const day = rng.int(0, 6);
      const [nd, nm, nday] = fwd ? [1, (m + 1) % 12, (day + 1) % 7] : [LENGTH[(m + 11) % 12], (m + 11) % 12, (day + 6) % 7];
      const right = frDate(nd, nm, nday);
      const wrongs = fwd
        ? [LENGTH[m] === 30 ? `le ${DAYS[nday]} trente et un ${MONTHS[m]}` : frDate(1, (nm + 1) % 12, nday), frDate(nd, nm, (day + 6) % 7), `le ${DAYS[nday]} un ${MONTHS[nm]}`, frDate(d - 1, m, (day + 6) % 7)]
        : [`le ${DAYS[nday]} premier ${MONTHS[nm]}`, frDate(nd, nm, (day + 1) % 7), frDate(nd === 31 ? 30 : 31, nm, nday), frDate(2, m, (day + 1) % 7)];
      const today = frDate(d, m, day);
      return choice(`Aujourd’hui, c’est **${today}**. ${fwd ? 'Et demain' : 'Et hier'}${NB}?`, right, wrongs, rng, {
        hear: `Aujourd’hui, c’est ${today}.`,
        explain: `${cap(today)} is ${DAYS_EN[day]} ${d} ${MONTHS_EN[m]}. ${fwd ? 'Tomorrow (demain)' : 'Yesterday (hier)'} is ${DAYS_EN[nday]} ${nd} ${MONTHS_EN[nm]}: ${right}.`,
        steps: [`${fwd ? 'demain = tomorrow' : 'hier = yesterday'}; ${MONTHS_EN[fwd ? m : nm]} has ${LENGTH[fwd ? m : nm]} days.`, `The day of the week: ${DAYS[day]} → ${DAYS[nday]}.`, `So: ${right}${nd === 1 ? ' (the 1st is premier)' : ''}.`],
      });
    }
    const y = rng.chance(0.6) ? rng.int(2008, 2016) : rng.int(1990, 2030);
    const m = rng.int(0, 11), d = rng.int(1, LENGTH[m]);
    const yw = frNumber(y);
    const right = `${frDate(d, m)} ${yw}`;
    const yWrong = [y + 10, y - 10, y + 1, y >= 2000 && y % 100 < 20 ? 2000 + ((y % 100) % 10) : y - 2].filter((x) => x !== y && x >= 1900 && x <= 2099).map(frNumber);
    const wrongs = [`${frDate(d, m)} ${rng.pick(yWrong)}`, `${frDate(d, (m + 1) % 12)} ${yw}`, ...(d <= 9 ? [`${frDate(d + 10, m)} ${yw}`] : d >= 11 && d <= 19 && d !== 10 ? [`${frDate(d - 10, m)} ${yw}`] : [`${frDate(d === 31 ? 30 : d + 1, m)} ${yw}`]), ...wrongSpellings(y).slice(0, 1).map((x) => `${frDate(d, m)} ${x}`)];
    return choice(`How do you say **${d} ${MONTHS_EN[m]} ${y}** in French?`, right, wrongs, rng, {
      explain: `${d} ${MONTHS_EN[m]} ${y} = ${right}.`,
      steps: ['Say the date first (le + number + month), then the year as one whole number.', `The year: ${y} = ${yw}.`, `Together: ${right}.`],
    });
  },

  y8frTime(level, rng) {
    if (level === 3 && rng.chance(0.7)) {
      // the 24-hour clock: timetables, films, trains
      const h = rng.chance(0.75) ? rng.int(13, 23) : rng.int(7, 12);
      const m = rng.int(0, 11) * 5;
      const said = clock24(h, m);
      const pm = h > 12 ? h - 12 : h;
      const steps = ['Timetables use the 24-hour clock: the hour, then heures, then the minutes as a plain number.', `${frNumber(h)} = ${h}${h === 21 ? ' (heure is feminine: vingt et une heures)' : ''}${m ? `, ${frNumber(m)} = ${m}` : ''}.`, `So ${d24(h, m)} = ${said}${h > 12 ? `, which is ${pm}${m ? `:${String(m).padStart(2, '0')}` : ''} pm` : ''}.`];
      const what = rng.pick([['Le train part à', 'The train leaves at'], ['Le film commence à', 'The film starts at'], ['Le bus arrive à', 'The bus arrives at'], ['Le concert commence à', 'The concert starts at']]);
      if (rng.chance(0.5)) {
        const wrongs = [[h - 10, m], [h + 2, m], [h + 1, m], [h - 1, m], [h, (m + 20) % 60], [h, (60 - m) % 60]].filter(([a, b]) => a >= 0 && a <= 23 && !(a === h && b === m)).map(([a, b]) => d24(a, b));
        return choice(`${what[0]} **${said}**. What time is that?`, d24(h, m), rng.shuffle(wrongs), rng, { hear: `${what[0]} ${said}.`, explain: `${said} = ${d24(h, m)}. ${what[1]} ${d24(h, m)}.`, steps });
      }
      const forms = [...clock24All(h, m), ...(h === 12 ? [m === 0 ? 'midi' : m === 15 ? 'midi et quart' : m === 30 ? 'midi et demi' : `midi ${frNumber(m)}`] : [])];
      const spell = [...new Set([...forms, ...forms.map((x) => `à ${x}`), ...withIlEst(forms), ...forms.map((x) => x.replace('vingt et une', 'vingt-et-une'))])];
      return typedFr(`${what[1]} **${d24(h, m)}**. Write the time in French, the 24-hour way.`, spell, { explain: `${d24(h, m)} = ${said}.`, steps: [steps[0], `The hour is ${h}${h === 21 ? ' (heure is feminine, so it ends in une, not un)' : ''}, then heures, then ${m ? `${m} minutes as a plain number` : 'nothing more: it is exactly on the hour'}.`, steps[2]] });
    }
    if (level === 3) {
      // 12-hour with du matin / de l’après-midi / du soir → 24-hour figures
      const part = rng.pick([['du matin', 0, 'in the morning'], ['de l’après-midi', 12, 'in the afternoon'], ['du soir', 12, 'in the evening']]);
      const h = part[0] === 'du matin' ? rng.int(1, 10) : part[0] === 'de l’après-midi' ? rng.int(1, 5) : rng.int(6, 10);
      const m = rng.pick([0, 15, 30]);
      const said = `${clock12(h, m)} ${part[0]}`;
      const H = h + part[1];
      const wrongs = [d24(part[1] ? h : h + 12, m), d24(H, m === 30 ? 15 : 30), d24(H + 1, m), d24(H - 1, m)];
      return choice(`Il est **${said}**. Which is that on a 24-hour clock?`, d24(H, m), wrongs, rng, { hear: `Il est ${said}.`, explain: `${said} = ${english12(h, m)} ${part[2]} = ${d24(H, m)}.`, steps: [`${clock12(h, m)} = ${english12(h, m)}.`, `${part[0]} = ${part[2]}${part[1] ? ', so add 12 to the hour' : ', so the hour stays the same'}.`, `${digital(h, m)} → ${d24(H, m)}.`] });
    }
    // 12-hour clock: o’clock, quarters and halves first, then every five minutes
    const h = rng.int(1, 10);
    const m = level === 1 ? rng.pick([0, 15, 30, 45]) : rng.int(1, 11) * 5;
    const said = clock12(h, m);
    const steps = [m === 0 ? 'Il est + the hour + heures (une heure for 1 o’clock).' : m <= 30 ? 'Up to half past, say the hour and add the minutes: et quart (quarter past), et demie (half past).' : 'After half past, take the next hour and subtract: moins dix (ten to), moins le quart (quarter to).', `In English, ${digital(h, m)} is ${english12(h, m)}.`, `Il est ${said} (${digital(h, m)}).`];
    const all = clock12All(h, m);
    const t = rng.int(0, 2);
    if (t === 0) {
      const cands = [[h + 1, m], [h, (60 - m) % 60], [h - 1, m], [h, (m + 15) % 60], [h, (m + 30) % 60], [h + 1, (60 - m) % 60]].filter(([a]) => a >= 1 && a <= 12).map(([a, b]) => digital(a, b));
      return choice(`Il est **${said}**. What time is it?`, digital(h, m), cands, rng, { hear: `Il est ${said}.`, explain: `${said} = ${english12(h, m)} = ${digital(h, m)}.`, steps });
    }
    if (t === 1) {
      const wrongs = [
        ...(m > 30 ? [`${heures(h)} moins ${m === 45 ? 'le quart' : frNumber(60 - m)}`, `${heures(h + 1)} ${frNumber(60 - m)}`] : []),
        ...(m === 30 ? [`${heures(h)} et demi`, `${heures(h - 1 || 12)} et demie`] : []),
        ...(m === 15 ? [`${heures(h)} moins le quart`, `${heures(h)} et quarte`] : []),
        ...(m === 0 ? [h === 1 ? 'un heure' : `${frNumber(h)} heure`, `${heures(h === 10 ? 9 : h + 1)}`] : []),
        ...(m > 0 && m < 30 && m !== 15 ? [`${heures(h)} moins ${frNumber(m)}`, `${frNumber(m)} heures ${frNumber(h)}`] : []),
        clock12(h === 10 ? 9 : h + 1, m), clock12(h, (m + 30) % 60),
      ].filter((x) => !all.includes(x));
      return choice(`What is **${digital(h, m)}** in French? Il est…`, said, wrongs, rng, { explain: `${digital(h, m)} (${english12(h, m)}) = ${said}.`, steps });
    }
    return typedFr(`Write in French: **It is ${digital(h, m)}.**`, withIlEst(all), { explain: `${digital(h, m)} = Il est ${said}.${all.length > 1 ? ` (Il est ${all[1]} is right too.)` : ''}`, steps, placeholder: 'Il est…' });
  },
};

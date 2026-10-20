// History procedure generators.

const ORD_WORDS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth',
  'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth',
  'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth'];

export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const centuryOf = (year) => Math.ceil(Math.abs(year) / 100);

const EVENTS = [
  [1066, 'the Battle of Hastings'], [1086, 'the Domesday Book'], [1170, 'the murder of Thomas Becket'], [1215, 'Magna Carta'],
  [1348, 'the Black Death reaching England'], [1381, 'the Peasants’ Revolt'], [1415, 'the Battle of Agincourt'], [1485, 'the Battle of Bosworth'],
  [1534, 'the Act of Supremacy'], [1588, 'the Spanish Armada'], [1605, 'the Gunpowder Plot'], [1666, 'the Great Fire of London'],
  [1837, 'Queen Victoria becoming queen'], [1914, 'the start of the First World War'], [1969, 'the first Moon landing'],
  [43, 'the Roman invasion of Britain'], [122, 'work starting on Hadrian’s Wall'], [410, 'the Romans leaving Britain'],
  [793, 'the Viking raid on Lindisfarne'], [871, 'Alfred becoming king of Wessex'], [600, 'the Sutton Hoo ship burial (about)'],
  [1800, 'the year 1800'], [1900, 'the year 1900'], [1700, 'the year 1700'], [1200, 'the year 1200'], [2000, 'the year 2000'],
  [-55, 'Julius Caesar’s first visit to Britain'], [-776, 'the first recorded Olympic Games'], [-2560, 'the Great Pyramid being finished (about)'],
  [-3000, 'work starting on Stonehenge (about)'], [-490, 'the Battle of Marathon'], [-332, 'Alexander the Great conquering Egypt'],
];

export const HISTORY_GENERATORS = {
  century(level, rng) {
    const pool = EVENTS.filter(([y]) => (level === 1 ? y >= 1000 && y % 100 !== 0 : level === 2 ? y > 0 : y < 0));
    const [year, what] = rng.pick(pool);
    const c = centuryOf(year);
    const bc = year < 0;
    const yearText = bc ? `${-year} BC` : year < 1000 ? `AD ${year}` : String(year);
    const answer = ordinal(c);
    const edge = !bc && year % 100 === 0;
    return {
      kind: 'typed',
      prompt: what.startsWith('the year') ? `Which century is the year ${yearText} in?` : `${what[0].toUpperCase() + what.slice(1)}: ${yearText}. Which century is that?`,
      answer,
      accept: [String(c), ORD_WORDS[c], `${answer} century`, `${ORD_WORDS[c]} century`, ...(bc ? [`${answer} century bc`, `${answer} bc`] : [])],
      strict: true,
      suffix: bc ? 'century BC' : 'century',
      placeholder: 'e.g. 14th',
      explain: bc
        ? `BC centuries count backwards from AD 1. ${-year} BC is in the ${answer} century BC (${c * 100} to ${c * 100 - 99} BC).`
        : edge
          ? `Tricky one! The ${answer} century runs from ${(c - 1) * 100 + 1} to ${c * 100}, so ${year} is its last year, not the start of the next.`
          : `The ${answer} century runs from ${(c - 1) * 100 + 1} to ${c * 100}. A quick trick: count the whole hundreds in ${year} (${Math.floor(year / 100)}) and add 1.`,
      steps: [
        `A century is 100 years. The 1st century AD is years 1 to 100.`,
        bc && -year % 100 === 0 ? `BC years count backwards. ${-year} BC ends in 00, so it is in the century that runs from ${c * 100} to ${c * 100 - 99} BC.` : bc ? `BC years count backwards. ${-year} BC has ${Math.floor(-year / 100)} whole hundred${Math.floor(-year / 100) === 1 ? '' : 's'}, so I add 1.` : edge ? `${year} ends in 00, so it is the last year of a century, not the first.` : `I count the whole hundreds in ${year}, which is ${Math.floor(year / 100)}, and add 1.`,
        `So ${yearText} is in the ${answer} century${bc ? ' BC' : ''}.`,
      ],
    };
  },
};

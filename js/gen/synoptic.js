// Cross-curricular (synoptic) generators: maths used inside geography, history and science.
// Data sets are invented for the questions (fictional places) unless they are well-known dates.

const fmtNum = (n) => n.toLocaleString('en-GB');
const neg = (n) => (n < 0 ? `−${-n}` : String(n));

const VILLAGES = ['Ashby', 'Brookfield', 'Carrow', 'Dunmere', 'Elmstead', 'Fenwick', 'Glenholt', 'Hartley', 'Ivybridge', 'Kelso'];

/** n distinct random integers in [lo, hi] that are multiples of step. */
function values(rng, n, lo, hi, step = 1) {
  const out = new Set();
  while (out.size < n) out.add(rng.int(lo / step, hi / step) * step);
  return [...out];
}

export const SYNOPTIC_GENERATORS = {
  // Maths core: averages and range (Year 6 statutory)
  averages(level, rng) {
    if (level === 1) {
      const vs = values(rng, 4, 2, 20);
      const fifth = 5 * rng.int(4, 14) - vs.reduce((a, b) => a + b, 0);
      if (fifth < 1 || fifth > 30 || vs.includes(fifth)) return SYNOPTIC_GENERATORS.averages(1, rng);
      const all = rng.shuffle([...vs, fifth]);
      const total = all.reduce((a, b) => a + b, 0);
      return {
        kind: 'typed', prompt: `Find the mean of ${all.join(', ')}.`, numeric: { value: String(total / 5), form: 'any' },
        explain: `Add them (${total}) and divide by how many there are (5): ${total / 5}.`,
        steps: [`I add all the numbers: ${all.join(' + ')} = ${total}.`, 'There are 5 numbers, so I divide by 5.', `${total} ÷ 5 = ${total / 5}.`],
      };
    }
    if (level === 2) {
      const vs = values(rng, 7, 1, 60);
      const sorted = [...vs].sort((a, b) => a - b);
      return {
        kind: 'typed', prompt: `Find the median of ${vs.join(', ')}.`, numeric: { value: String(sorted[3]), form: 'any' },
        explain: `Put them in order: ${sorted.join(', ')}. The middle (4th of 7) is ${sorted[3]}.`,
        steps: ['The median is the middle value, so first I put the numbers in order.', `${sorted.join(', ')}.`, `There are 7 numbers, so the middle is the 4th: ${sorted[3]}.`],
      };
    }
    const vs = values(rng, 6, -15, 25);
    const max = Math.max(...vs), min = Math.min(...vs);
    if (min >= 0 || max <= 0) return SYNOPTIC_GENERATORS.averages(3, rng);
    return {
      kind: 'typed', prompt: `Find the range of ${vs.map(neg).join(', ')}.`, numeric: { value: String(max - min), form: 'any' },
      explain: `Range = largest − smallest = ${neg(max)} − ${neg(min)} = ${max - min}.`,
      steps: ['The range is the largest value minus the smallest.', `Largest = ${neg(max)}, smallest = ${neg(min)}.`, `${neg(max)} − ${min < 0 ? `(${neg(min)})` : min} = ${max - min}.`],
    };
  },

  // Geography + maths
  geoStats(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        // choose the mean first so it is a whole number of pounds, then fit the fifth value
        const mean = 10 * rng.int(35, 65);
        const vs = values(rng, 4, 250, 800, 10);
        const last = 5 * mean - vs.reduce((a, b) => a + b, 0);
        if (last < 250 || last > 800 || vs.includes(last)) return SYNOPTIC_GENERATORS.geoStats(1, rng);
        const all = rng.shuffle([...vs, last]);
        const total = 5 * mean;
        return {
          kind: 'typed', prompt: `A village survey recorded the weekly earnings of five households: ${all.map((v) => `£${v}`).join(', ')}. What are the mean weekly earnings per household?`,
          numeric: { value: String(total / 5), form: 'any' }, unit: '£', unitBefore: true,
          explain: `Total = £${fmtNum(total)}; £${fmtNum(total)} ÷ 5 = £${total / 5}. Geographers use the mean to compare places, though a few very high earners can pull it up.`,
          steps: [`I add the five earnings: £${fmtNum(total)}.`, 'I divide by the number of households, 5.', `£${fmtNum(total)} ÷ 5 = £${total / 5}.`],
        };
      }
      const mean = rng.int(30, 90);
      const vs = values(rng, 5, 10, 150);
      const target = 6 * mean;
      const last = target - vs.reduce((a, b) => a + b, 0);
      if (last < 10 || last > 150 || vs.includes(last)) return SYNOPTIC_GENERATORS.geoStats(1, rng);
      const all = [...vs, last];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return {
        kind: 'typed', prompt: `Rainfall in a town from January to June (mm): ${all.map((v, i) => `${months[i]} ${v}`).join(', ')}. What was the mean monthly rainfall?`,
        numeric: { value: String(target / 6), form: 'any' }, unit: 'mm',
        explain: `Total = ${target} mm; ${target} ÷ 6 months = ${target / 6} mm.`,
        steps: [`I add the six months: ${all.join(' + ')} = ${target} mm.`, 'There are 6 months, so I divide by 6.', `${target} ÷ 6 = ${target / 6} mm.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const pops = values(rng, 7, 120, 2400, 10);
        const names = rng.sample(VILLAGES, 7);
        const sorted = [...pops].sort((a, b) => a - b);
        return {
          kind: 'typed', prompt: `Populations of seven villages: ${names.map((n, i) => `${n} ${fmtNum(pops[i])}`).join(', ')}. What is the median population?`,
          numeric: { value: String(sorted[3]), form: 'any' },
          explain: `In order: ${sorted.map(fmtNum).join(', ')}. The middle (4th) value is ${fmtNum(sorted[3])}. The median isn’t pulled up by one very big village, which is why geographers often prefer it.`,
          steps: ['I put the populations in order, smallest first.', sorted.map(fmtNum).join(', ') + '.', `The 4th of 7 is the middle: ${fmtNum(sorted[3])}.`],
        };
      }
      const temps = values(rng, 6, -18, 14);
      const max = Math.max(...temps), min = Math.min(...temps);
      if (min >= 0 || max <= 0) return SYNOPTIC_GENERATORS.geoStats(2, rng);
      return {
        kind: 'typed', prompt: `Midday temperatures on six days in a town in northern Norway (°C): ${temps.map(neg).join(', ')}. What is the range of these temperatures?`,
        numeric: { value: String(max - min), form: 'any' }, unit: '°C',
        explain: `Range = highest − lowest = ${neg(max)} − ${min < 0 ? `(${neg(min)})` : min} = ${max - min}°C. Subtracting a negative means adding.`,
        steps: [`Highest = ${neg(max)}°C, lowest = ${neg(min)}°C.`, 'Range = highest − lowest. Subtracting a negative is the same as adding.', `${neg(max)} − ${min < 0 ? `(${neg(min)})` : min} = ${max - min}°C.`],
      };
    }
    if (rng.chance(0.5)) {
      const area = rng.pick([20, 25, 40, 50, 80]);
      const density = rng.int(3, 30) * 10;
      const pop = area * density;
      return {
        kind: 'typed', prompt: `An island has ${fmtNum(pop)} people and an area of ${area} km². What is its population density, in people per km²?`,
        numeric: { value: String(density), form: 'any' }, unit: 'people per km²',
        explain: `Population density = people ÷ area = ${fmtNum(pop)} ÷ ${area} = ${density} people per km².`,
        steps: ['Population density = number of people ÷ area.', `${fmtNum(pop)} ÷ ${area}.`, `= ${density} people per km².`],
      };
    }
    const start = rng.int(12, 60) * 100;
    const pct = rng.pick([5, 10, 15, 20, 25, 40, 50]);
    const end = start + (start * pct) / 100;
    return {
      kind: 'typed', prompt: `A town’s population grew from ${fmtNum(start)} to ${fmtNum(end)}. What was the percentage increase?`,
      numeric: { value: String(pct), form: 'any' }, unit: '%',
      explain: `Increase = ${fmtNum(end - start)}. As a percentage of the original: ${fmtNum(end - start)} ÷ ${fmtNum(start)} × 100 = ${pct}%.`,
      steps: [`First the increase: ${fmtNum(end)} − ${fmtNum(start)} = ${fmtNum(end - start)}.`, 'Then I compare it with the ORIGINAL population.', `${fmtNum(end - start)} ÷ ${fmtNum(start)} × 100 = ${pct}%.`],
    };
  },

  // History + maths
  historyMaths(level, rng) {
    const AD = [[43, 'the Roman invasion'], [410, 'the Romans leaving Britain'], [793, 'the raid on Lindisfarne'], [1066, 'the Battle of Hastings'], [1086, 'the Domesday survey'], [1215, 'Magna Carta'], [1348, 'the Black Death reaching England'], [1381, 'the Peasants’ Revolt'], [1485, 'the Battle of Bosworth'], [1588, 'the Spanish Armada'], [1666, 'the Great Fire of London'], [1914, 'the start of the First World War']];
    const BC = [[-3000, 'the first stage of Stonehenge', true], [-776, 'the first recorded Olympics'], [-490, 'the Battle of Marathon'], [-55, 'Julius Caesar’s first visit to Britain']];
    if (level === 1) {
      const [a, b] = rng.sample(AD, 2).sort((x, y) => x[0] - y[0]);
      const gap = b[0] - a[0];
      return {
        kind: 'typed', prompt: `How many years were there between ${a[1]} (${a[0] < 1000 ? 'AD ' : ''}${a[0]}) and ${b[1]} (${b[0]})?`, numeric: { value: String(gap), form: 'any' }, unit: 'years',
        explain: `${b[0]} − ${a[0]} = ${gap} years.`,
        steps: ['To find the time between two AD dates, I subtract the earlier from the later.', `${b[0]} − ${a[0]}.`, `= ${gap} years.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.6)) {
        const bc = rng.pick(BC), ad = rng.pick(AD.slice(0, 6));
        const gap = -bc[0] + ad[0] - 1;
        return {
          kind: 'typed', prompt: `How many years were there between ${bc[1]} (${bc[2] ? 'about ' : ''}${-bc[0]} BC) and ${ad[1]} (AD ${ad[0]})? Remember: there was no year 0.`,
          numeric: { value: String(gap), form: 'any' }, unit: 'years',
          explain: `Count back to 1 BC and on from AD 1: ${-bc[0]} + ${ad[0]} = ${-bc[0] + ad[0]}, then take away 1 because the calendar goes straight from 1 BC to AD 1 with no year 0: ${gap} years.`,
          steps: [`From ${-bc[0]} BC to 1 BC is ${-bc[0] - 1} years, then 1 more year to AD 1.`, `From AD 1 to AD ${ad[0]} is ${ad[0] - 1} years.`, `${-bc[0] - 1} + 1 + ${ad[0] - 1} = ${gap} years (that is ${-bc[0]} + ${ad[0]} − 1, because there is no year 0).`],
        };
      }
      const [a, b] = rng.sample(BC, 2).sort((x, y) => x[0] - y[0]);
      const gap = b[0] - a[0];
      return {
        kind: 'typed', prompt: `How many years were there between ${a[1]} (${a[2] ? 'about ' : ''}${-a[0]} BC) and ${b[1]} (${-b[0]} BC)?`, numeric: { value: String(gap), form: 'any' }, unit: 'years',
        explain: `BC years count down towards AD 1, so the bigger BC number is earlier: ${-a[0]} − ${-b[0]} = ${gap} years.`,
        steps: ['BC dates count backwards: the bigger number is longer ago.', `So I subtract the smaller BC number from the bigger one: ${-a[0]} − ${-b[0]}.`, `= ${gap} years.`],
      };
    }
    const pop = rng.pick([3, 4.5, 6]);
    const [num, den] = rng.pick([[1, 3], [1, 2], [2, 5]].filter(([, d]) => (pop * 10) % d === 0));
    const died = (pop * num) / den;
    return {
      kind: 'typed', prompt: `Suppose England had ${pop} million people before the Black Death, and ${num === 1 ? `one ${den === 2 ? 'half' : 'third'}` : 'two fifths'} of them died. How many million people died?`,
      numeric: { value: String(died), form: 'any' }, unit: 'million',
      explain: `${num}/${den} of ${pop} million = ${pop} ÷ ${den} × ${num} = ${died} million. Historians think somewhere between a third and a half of England’s people died in 1348–50.`,
      steps: [`To find ${num}/${den} of an amount, I divide by ${den} and multiply by ${num}.`, `${pop} ÷ ${den} = ${pop / den}.`, `${pop / den} × ${num} = ${died} million people.`],
    };
  },

  // Science + maths
  scienceMaths(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const v = rng.int(1, 12) * 50;
        return {
          kind: 'typed', prompt: `Air is about 78% nitrogen. How many litres of nitrogen are in ${v} litres of air?`, numeric: { value: String((78 * v) / 100), form: 'any' }, unit: 'litres',
          explain: `78% of ${v} = ${v} ÷ 100 × 78 = ${(78 * v) / 100} litres.`,
          steps: ['78% means 78 out of every 100.', `1% of ${v} is ${v / 100}.`, `${v / 100} × 78 = ${(78 * v) / 100} litres.`],
        };
      }
      const v = rng.int(1, 9) * 100;
      return {
        kind: 'typed', prompt: `Air is about 21% oxygen. How many litres of oxygen are in ${v} litres of air?`, numeric: { value: String((21 * v) / 100), form: 'any' }, unit: 'litres',
        explain: `21% of ${v} = ${v / 100} × 21 = ${(21 * v) / 100} litres.`,
        steps: ['21% means 21 out of every 100.', `1% of ${v} is ${v / 100}.`, `${v / 100} × 21 = ${(21 * v) / 100} litres.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const r = rng.pick([4, 5, 9]);
        const part = rng.int(2, 8) * 25;
        return {
          kind: 'typed', prompt: `A drink is made by mixing squash and water in the ratio 1 : ${r}. How much water is needed for ${part} ml of squash?`,
          numeric: { value: String(part * r), form: 'any' }, unit: 'ml',
          explain: `For every 1 part squash there are ${r} parts water: ${part} × ${r} = ${part * r} ml.`,
          steps: [`The ratio 1 : ${r} means ${r} times as much water as squash.`, `I have ${part} ml of squash.`, `${part} × ${r} = ${part * r} ml of water.`],
        };
      }
      const r = rng.pick([10, 20, 25]);
      const part = rng.int(2, 12) * 5;
      return {
        kind: 'typed', prompt: `A salt solution is made by mixing salt and water in the ratio 1 : ${r} by mass. How many grams of water are needed for ${part} g of salt?`,
        numeric: { value: String(part * r), form: 'any' }, unit: 'g',
        explain: `For every 1 g of salt there are ${r} g of water: ${part} × ${r} = ${fmtNum(part * r)} g.`,
        steps: [`The ratio 1 : ${r} means ${r} times as much water as salt.`, `I have ${part} g of salt.`, `${part} × ${r} = ${fmtNum(part * r)} g of water.`],
      };
    }
    const rate = rng.int(2, 6), mins = rng.pick([5, 8, 10, 12, 15]);
    const t0 = rng.int(60, 95);
    const t1 = t0 - rate * mins;
    if (t1 < 15) return SYNOPTIC_GENERATORS.scienceMaths(3, rng);
    return {
      kind: 'typed', prompt: `A cup of water cooled from ${t0}°C to ${t1}°C in ${mins} minutes. What was the mean drop in temperature per minute?`,
      numeric: { value: String(rate), form: 'any' }, unit: '°C per minute',
      explain: `Total drop = ${t0} − ${t1} = ${t0 - t1}°C. Per minute: ${t0 - t1} ÷ ${mins} = ${rate}°C.`,
      steps: [`First the total change: ${t0} − ${t1} = ${t0 - t1}°C.`, `It took ${mins} minutes, so I share the change between them.`, `${t0 - t1} ÷ ${mins} = ${rate}°C per minute.`],
    };
  },
};

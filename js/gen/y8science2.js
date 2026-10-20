// Year 8 science calculations, part 2: specific heat capacity, conservation of mass, relative
// formula mass, rates of reaction, work, power and energy stores, motion graphs, echoes, and
// momentum (GCSE taster). Levels: secure Year 8, grammar-school depth, GCSE taster.
// Uses g = 10 N/kg and c(water) = 4200 J/kg °C, as school courses do.

const fmt = (x) => String(Math.round(x * 1000) / 1000);
const typed = (prompt, value, unit, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: fmt(value), form: 'any' }, unit, explain, steps, ...extra });
function choice(prompt, correct, wrongs, rng, explain, steps) {
  const seen = new Set([correct]);
  const ws = wrongs.filter((w) => !seen.has(w) && seen.add(w));
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.map((text) => ({ text }))]), explain, steps };
}

// formulae with their relative formula masses (Ar: H 1, C 12, N 14, O 16, Na 23, Mg 24, S 32, Cl 35.5, Ca 40, Cu 64)
const SIMPLE = [['H₂O', 18, '2 × 1 + 16'], ['CO₂', 44, '12 + 2 × 16'], ['O₂', 32, '2 × 16'], ['CH₄', 16, '12 + 4 × 1'], ['NH₃', 17, '14 + 3 × 1'], ['MgO', 40, '24 + 16']];
const HARDER = [['CaCO₃', 100, '40 + 12 + 3 × 16'], ['H₂SO₄', 98, '2 × 1 + 32 + 4 × 16'], ['NaCl', 58.5, '23 + 35.5'], ['HCl', 36.5, '1 + 35.5'], ['NaOH', 40, '23 + 16 + 1'], ['CuO', 80, '64 + 16'], ['SO₂', 64, '32 + 2 × 16']];
const BRACKETS = [['Ca(OH)₂', 74, '40 + 2 × (16 + 1)'], ['Mg(OH)₂', 58, '24 + 2 × (16 + 1)'], ['Cu(OH)₂', 98, '64 + 2 × (16 + 1)'], ['(NH₄)₂SO₄', 132, '2 × (14 + 4 × 1) + 32 + 4 × 16']];
// percentage by mass that come out exactly
const PERCENT = [['carbon', 'CH₄', 12, 16], ['oxygen', 'MgO', 16, 40], ['calcium', 'CaCO₃', 40, 100], ['sulfur', 'SO₂', 32, 64], ['copper', 'CuO', 64, 80], ['oxygen', 'SO₃', 48, 80], ['magnesium', 'MgO', 24, 40]];

export const Y8_SCIENCE2_GENERATORS = {
  y8tHeat(level, rng) {
    const c = 4200;
    if (level === 1) {
      const m = rng.pick([0.5, 1, 2, 3]), dT = rng.pick([5, 10, 20, 25, 40]);
      const E = m * c * dT;
      return typed(`How much energy is needed to heat ${m} kg of water by ${dT} °C? (Specific heat capacity of water = 4200 J/kg °C.)`, E, 'J', `ΔE = m × c × Δθ = ${m} × 4200 × ${dT} = ${E} J.`, ['ΔE = m × c × Δθ', `m = ${m} kg, c = 4200 J/kg °C, Δθ = ${dT} °C`, `${m} × 4200 × ${dT} = ${E} J`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const m = rng.pick([0.5, 1, 2]), dT = rng.pick([10, 15, 20, 30]), E = m * c * dT;
        return typed(`Mira supplies ${E} J of energy to ${m} kg of water. By how much does its temperature rise? (c = 4200 J/kg °C)`, dT, '°C', `Rearrange: Δθ = ΔE ÷ (m × c) = ${E} ÷ (${m} × 4200) = ${dT} °C.`, ['ΔE = m × c × Δθ, so Δθ = ΔE ÷ (m × c)', `m × c = ${m} × 4200 = ${m * c}`, `${E} ÷ ${m * c} = ${dT} °C`]);
      }
      const [metal, cm] = rng.pick([['copper', 385], ['aluminium', 900], ['iron', 450], ['lead', 130]]);
      const m = rng.pick([1, 2, 4]), dT = rng.pick([10, 20, 50]), E = m * cm * dT;
      return typed(`It takes ${E} J to heat a ${m} kg block of ${metal} by ${dT} °C. What is the specific heat capacity of ${metal}?`, cm, 'J/kg °C', `c = ΔE ÷ (m × Δθ) = ${E} ÷ (${m} × ${dT}) = ${cm} J/kg °C.`, ['c = ΔE ÷ (m × Δθ)', `m × Δθ = ${m} × ${dT} = ${m * dT}`, `${E} ÷ ${m * dT} = ${cm} J/kg °C`]);
    }
    // a heater of power P for t seconds
    const P = rng.pick([1000, 2000, 2100, 3000]), m = rng.pick([1, 2, 3]), dT = rng.pick([5, 10, 20]);
    const t = (m * c * dT) / P;
    if (!Number.isInteger(t)) return Y8_SCIENCE2_GENERATORS.y8tHeat(level, rng);
    return typed(`Hephaestus’s ${P} W kettle heats ${m} kg of water by ${dT} °C. Assuming no energy is wasted, how many seconds does it take? (c = 4200 J/kg °C)`, t, 's', `Energy needed = ${m} × 4200 × ${dT} = ${m * c * dT} J. Time = energy ÷ power = ${m * c * dT} ÷ ${P} = ${t} s.`, [`ΔE = m × c × Δθ = ${m * c * dT} J`, 'power = energy ÷ time, so time = energy ÷ power', `${m * c * dT} ÷ ${P} = ${t} s`]);
  },

  y8tMass(level, rng) {
    if (level === 1) {
      // real reacting ratios (Fe : S = 56 : 32, Mg : O = 24 : 16, Cu : O = 64 : 16)
      const [r1, r2, p, x, y] = rng.pick([['iron', 'sulfur', 'iron sulfide', 56, 32], ['magnesium', 'oxygen', 'magnesium oxide', 24, 16], ['copper', 'oxygen', 'copper oxide', 64, 16]]);
      const k = rng.pick([0.25, 0.5, 1, 1.5, 2]), a = x * k, b = y * k;
      return typed(`${fmt(a)} g of ${r1} reacts completely with ${fmt(b)} g of ${r2} to make ${p} only. What mass of ${p} is made?`, a + b, 'g', `Mass is conserved: atoms are rearranged, not created or destroyed. ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)} g.`, ['In a chemical reaction, total mass of reactants = total mass of products', `${fmt(a)} g + ${fmt(b)} g`, `= ${fmt(a + b)} g`]);
    }
    if (level === 2) {
      const start = rng.int(150, 250), lost = rng.int(2, 9) + rng.pick([0, 0.5]);
      return typed(`Marble chips and acid are mixed in an open flask on a balance. The reading starts at ${start}.0 g and ends at ${fmt(start - lost)} g. What mass of carbon dioxide escaped?`, lost, 'g', `The mass seems to fall because a gas escaped into the air. ${start} − ${fmt(start - lost)} = ${fmt(lost)} g of carbon dioxide. In a sealed flask the reading would not change.`, ['Mass is conserved, so any loss must have left the flask', 'The only thing that can leave is the gas made (carbon dioxide)', `${start} − ${fmt(start - lost)} = ${fmt(lost)} g`]);
    }
    // reacting masses by proportion
    const [r, p, mr, mp] = rng.pick([['magnesium', 'magnesium oxide', 24, 40], ['calcium carbonate', 'calcium oxide', 100, 56], ['copper', 'copper oxide', 64, 80], ['carbon', 'carbon dioxide', 12, 44]]);
    const k = rng.pick([0.25, 0.5, 2, 3, 1.5]);
    return typed(`${mr} g of ${r} makes ${mp} g of ${p}. What mass of ${p} is made from ${fmt(mr * k)} g of ${r}?`, mp * k, 'g', `Masses react in a fixed ratio. ${fmt(mr * k)} g is ${k} times ${mr} g, so the product is ${k} × ${mp} = ${fmt(mp * k)} g.`, [`scale factor = ${fmt(mr * k)} ÷ ${mr} = ${k}`, `product = ${mp} × ${k}`, `= ${fmt(mp * k)} g`]);
  },

  y8tMr(level, rng) {
    const note = '(Ar: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35.5, Ca = 40, Cu = 64)';
    if (level < 3 || rng.chance(0.4)) {
      const [f, mr, sum] = rng.pick(level === 1 ? SIMPLE : level === 2 ? HARDER : BRACKETS);
      return typed(`What is the relative formula mass (Mr) of ${f}? ${note}`, mr, '', `Add up the relative atomic masses of every atom: ${sum} = ${mr}.`, ['Count the atoms of each element in the formula', `Mr = ${sum}`, `= ${mr}`]);
    }
    const [el, f, part, mr] = rng.pick(PERCENT);
    return typed(`What percentage of the mass of ${f} is ${el}? ${note}`, (100 * part) / mr, '%', `Mr of ${f} = ${mr}; the ${el} contributes ${part}. ${part} ÷ ${mr} × 100 = ${fmt((100 * part) / mr)}%.`, [`Mr of ${f} = ${mr}`, `mass of ${el} in the formula = ${part}`, `${part} ÷ ${mr} × 100 = ${fmt((100 * part) / mr)}%`]);
  },

  y8tRate(level, rng) {
    if (level === 1) {
      const t = rng.pick([10, 20, 25, 40, 50]), r = rng.pick([1, 2, 3, 4, 5]);
      return typed(`Kit collects ${r * t} cm³ of gas in ${t} s. What is the mean rate of reaction?`, r, 'cm³/s', `Mean rate = amount of product ÷ time = ${r * t} ÷ ${t} = ${r} cm³/s.`, ['mean rate = quantity of product formed ÷ time taken', `${r * t} cm³ ÷ ${t} s`, `= ${r} cm³/s`]);
    }
    if (level === 2) {
      const t1 = rng.pick([10, 20, 30]), dt = rng.pick([10, 20, 30]), v1 = rng.int(10, 40), r = rng.pick([0.5, 1, 1.5, 2]);
      const v2 = v1 + r * dt;
      return typed(`The gas syringe reads ${v1} cm³ at ${t1} s and ${fmt(v2)} cm³ at ${t1 + dt} s. What is the mean rate between these times?`, r, 'cm³/s', `Change in volume ÷ change in time = (${fmt(v2)} − ${v1}) ÷ (${t1 + dt} − ${t1}) = ${fmt(r * dt)} ÷ ${dt} = ${fmt(r)} cm³/s.`, [`change in volume = ${fmt(v2)} − ${v1} = ${fmt(r * dt)} cm³`, `change in time = ${dt} s`, `${fmt(r * dt)} ÷ ${dt} = ${fmt(r)} cm³/s`]);
    }
    const mins = rng.pick([2, 4, 5]), g = rng.pick([0.6, 1.2, 1.8, 2.4, 3]);
    return typed(`A flask of marble chips and acid loses ${g} g in ${mins} minutes. What is the mean rate of reaction in g/s?`, g / (mins * 60), 'g/s', `Change minutes to seconds: ${mins} × 60 = ${mins * 60} s. Rate = ${g} ÷ ${mins * 60} = ${fmt(g / (mins * 60))} g/s.`, [`time = ${mins} × 60 = ${mins * 60} s`, 'rate = mass lost ÷ time', `${g} ÷ ${mins * 60} = ${fmt(g / (mins * 60))} g/s`]);
  },

  y8tWork(level, rng) {
    if (level === 1) {
      const F = rng.pick([20, 50, 80, 120, 200]), d = rng.pick([2, 3, 5, 10, 15]);
      const who = rng.pick(['Theo drags a chest', 'Sisyphus pushes a boulder', 'Mira pulls a sledge']);
      return typed(`${who} with a force of ${F} N for ${d} m. How much work is done?`, F * d, 'J', `Work done = force × distance = ${F} × ${d} = ${F * d} J.`, ['work done = force × distance moved (in the direction of the force)', `${F} N × ${d} m`, `= ${F * d} J`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const m = rng.pick([2, 5, 10, 20, 50]), h = rng.pick([2, 3, 5, 8, 10]);
        return typed(`A ${m} kg stone is lifted ${h} m up the walls of Troy. How much gravitational potential energy does it gain? (g = 10 N/kg)`, m * 10 * h, 'J', `Ep = m × g × h = ${m} × 10 × ${h} = ${m * 10 * h} J.`, ['Ep = m × g × h', `m = ${m} kg, g = 10 N/kg, h = ${h} m`, `${m} × 10 × ${h} = ${m * 10 * h} J`]);
      }
      const W = rng.pick([600, 1200, 1800, 2400, 3000]), t = rng.pick([2, 3, 4, 5, 6]);
      if (W % t) return Y8_SCIENCE2_GENERATORS.y8tWork(level, rng);
      return typed(`A crane does ${W} J of work in ${t} s. What is its power?`, W / t, 'W', `Power = work done ÷ time = ${W} ÷ ${t} = ${W / t} W.`, ['power = energy transferred ÷ time', `${W} J ÷ ${t} s`, `= ${W / t} W`]);
    }
    if (rng.chance(0.5)) {
      const m = rng.pick([2, 4, 10, 60]), v = rng.pick([2, 3, 4, 5, 10]);
      return typed(`What is the kinetic energy of a ${m} kg object moving at ${v} m/s?`, 0.5 * m * v * v, 'J', `Ek = ½ × m × v² = 0.5 × ${m} × ${v}² = 0.5 × ${m} × ${v * v} = ${fmt(0.5 * m * v * v)} J. Note that v is squared: double the speed means four times the energy.`, ['Ek = ½ × m × v²', `v² = ${v * v}`, `0.5 × ${m} × ${v * v} = ${fmt(0.5 * m * v * v)} J`]);
    }
    const [h, v] = rng.pick([[5, 10], [20, 20], [45, 30], [1.25, 5], [0.8, 4]]);
    return typed(`Icarus’s wax feather falls ${h} m. Ignoring air resistance, how fast is it moving at the bottom? (g = 10 N/kg)`, v, 'm/s', `All the Ep becomes Ek: m g h = ½ m v², so v² = 2gh = 2 × 10 × ${h} = ${v * v}, and v = ${v} m/s. The mass cancels out.`, ['Ep lost = Ek gained, so mgh = ½mv²', `v² = 2 × g × h = ${v * v}`, `v = √${v * v} = ${v} m/s`]);
  },

  y8tMotion(level, rng) {
    if (level === 1) {
      const v = rng.pick([2, 3, 4, 5, 8]), t = rng.pick([5, 10, 20]);
      return typed(`On a distance–time graph, a runner’s line goes from (0 s, 0 m) to (${t} s, ${v * t} m) in a straight line. What is the runner’s speed?`, v, 'm/s', `The gradient of a distance–time graph is the speed: ${v * t} ÷ ${t} = ${v} m/s.`, ['speed = gradient of a distance–time graph', `rise = ${v * t} m, run = ${t} s`, `${v * t} ÷ ${t} = ${v} m/s`]);
    }
    if (level === 2) {
      const u = rng.pick([0, 2, 4, 5]), a = rng.pick([1, 2, 3, 4]), t = rng.pick([2, 4, 5, 10]);
      return typed(`A velocity–time graph is a straight line from ${u} m/s at 0 s to ${u + a * t} m/s at ${t} s. What is the acceleration?`, a, 'm/s²', `The gradient of a velocity–time graph is the acceleration: (${u + a * t} − ${u}) ÷ ${t} = ${a} m/s².`, ['acceleration = gradient of a velocity–time graph', `change in velocity = ${a * t} m/s over ${t} s`, `${a * t} ÷ ${t} = ${a} m/s²`]);
    }
    const v = rng.pick([4, 6, 8, 10, 12, 20]), t = rng.pick([2, 4, 5, 6, 10]);
    return typed(`A chariot accelerates steadily from rest to ${v} m/s in ${t} s. Using the area under its velocity–time graph, how far does it travel in that time?`, 0.5 * v * t, 'm', `The area under a velocity–time graph is the distance. Here it is a triangle: ½ × base × height = ½ × ${t} × ${v} = ${fmt(0.5 * v * t)} m.`, ['distance = area under the velocity–time graph', 'the graph is a triangle from 0 to the final speed', `½ × ${t} × ${v} = ${fmt(0.5 * v * t)} m`]);
  },

  y8tEcho(level, rng) {
    if (level === 1) {
      const t = rng.pick([2, 4, 6, 1]);
      return typed(`Theo shouts at a cliff and hears the echo ${t} s later. Sound travels at 340 m/s in air. How far is the cliff?`, (340 * t) / 2, 'm', `The sound goes there AND back: total distance = 340 × ${t} = ${340 * t} m, so the cliff is half that, ${(340 * t) / 2} m away.`, ['distance travelled = speed × time', `340 × ${t} = ${340 * t} m (there and back)`, `half of that: ${(340 * t) / 2} m`]);
    }
    const t = rng.pick([0.2, 0.4, 0.6, 1, 1.6, 2]);
    if (level === 2) return typed(`A ship’s sonar pulse returns from the seabed after ${t} s. Sound travels at 1500 m/s in sea water. How deep is the sea?`, (1500 * t) / 2, 'm', `There and back: 1500 × ${t} = ${fmt(1500 * t)} m, so the depth is ${fmt((1500 * t) / 2)} m.`, ['distance = speed × time', `1500 × ${t} = ${fmt(1500 * t)} m for the round trip`, `÷ 2 = ${fmt((1500 * t) / 2)} m`]);
    const f = rng.pick([20000, 25000, 40000, 50000]), lam = 1500 / f;
    return typed(`An ultrasound wave of frequency ${f} Hz travels through water at 1500 m/s. What is its wavelength, in mm?`, lam * 1000, 'mm', `λ = v ÷ f = 1500 ÷ ${f} = ${fmt(lam)} m = ${fmt(lam * 1000)} mm.`, ['wave speed = frequency × wavelength, so λ = v ÷ f', `1500 ÷ ${f} = ${fmt(lam)} m`, `× 1000 = ${fmt(lam * 1000)} mm`]);
  },

  y8tMomentum(level, rng) {
    if (level === 1) {
      const m = rng.pick([2, 5, 60, 80, 1000]), v = rng.pick([2, 3, 5, 10]);
      return typed(`What is the momentum of an object of mass ${m} kg moving at ${v} m/s?`, m * v, 'kg m/s', `Momentum = mass × velocity = ${m} × ${v} = ${m * v} kg m/s.`, ['p = m × v', `${m} kg × ${v} m/s`, `= ${m * v} kg m/s`]);
    }
    if (level === 2) {
      const m = rng.pick([2, 4, 5, 50]), v = rng.pick([3, 4, 6, 8]);
      return typed(`An object of mass ${m} kg has momentum ${m * v} kg m/s. What is its velocity?`, v, 'm/s', `v = p ÷ m = ${m * v} ÷ ${m} = ${v} m/s.`, ['p = m × v, so v = p ÷ m', `${m * v} ÷ ${m}`, `= ${v} m/s`]);
    }
    const m1 = rng.pick([1, 2, 3, 4]), m2 = rng.pick([1, 2, 3, 4]), v = rng.pick([2, 4, 6, 8, 12]);
    const vf = (m1 * v) / (m1 + m2);
    if (Math.round(vf * 100) / 100 !== vf) return Y8_SCIENCE2_GENERATORS.y8tMomentum(level, rng);
    return typed(`A ${m1} kg trolley moving at ${v} m/s hits a stationary ${m2} kg trolley and they stick together. How fast do they move off?`, vf, 'm/s', `Momentum is conserved: ${m1} × ${v} = (${m1} + ${m2}) × v, so v = ${m1 * v} ÷ ${m1 + m2} = ${fmt(vf)} m/s.`, [`momentum before = ${m1} × ${v} = ${m1 * v} kg m/s (the other trolley is still)`, `momentum after = ${m1 + m2} × v`, `v = ${m1 * v} ÷ ${m1 + m2} = ${fmt(vf)} m/s`]);
  },

  y8tVariables(level, rng) {
    const EXP = [
      ['how the temperature of the acid affects the rate of reaction with marble chips', 'temperature of the acid', 'rate of reaction (volume of gas per second)', ['concentration of acid', 'mass and size of marble chips', 'volume of acid']],
      ['how the length of a wire affects its resistance', 'length of the wire', 'resistance', ['thickness of the wire', 'material of the wire', 'temperature of the wire']],
      ['how light intensity affects the rate of photosynthesis in pondweed', 'distance of the lamp (light intensity)', 'number of oxygen bubbles per minute', ['temperature of the water', 'type and size of pondweed', 'amount of carbon dioxide in the water']],
      ['how the height of a ramp affects how far a toy car rolls', 'height of the ramp', 'distance the car rolls', ['the car used', 'the floor surface', 'where the car is released']],
      ['how temperature affects how quickly amylase breaks down starch', 'temperature', 'time until iodine no longer turns blue-black', ['pH', 'concentration of starch', 'volume of amylase']],
    ];
    const [aim, iv, dv, cvs] = rng.pick(EXP);
    if (level === 1) return choice(`An investigation into ${aim}. What is the independent variable (the one you change)?`, iv, [dv, cvs[0], cvs[1]], rng, `You change the independent variable (${iv}) and measure the dependent variable (${dv}).`, ['The independent variable is the one you choose to change', 'The dependent variable is the one you measure', `Here you change the ${iv}`]);
    if (level === 2) return choice(`An investigation into ${aim}. What is the dependent variable (the one you measure)?`, dv, [iv, cvs[0], cvs[2]], rng, `You measure the dependent variable (${dv}) each time you change the ${iv}.`, ['The dependent variable is what you measure', 'It depends on the variable you changed', `Here you measure the ${dv}`]);
    return choice(`An investigation into ${aim}. Which must be kept the same to make it a fair test?`, cvs[rng.int(0, 2)], [iv, dv], rng, `Control variables are kept the same so that only the ${iv} affects the ${dv}. Here they include: ${cvs.join(', ')}.`, ['A fair test changes only one variable', 'Everything else that could affect the result is controlled', `Control variables: ${cvs.join(', ')}`]);
  },
};

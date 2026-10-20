// Year 8 science calculations: speed and acceleration, density, pressure, moments, V = IR and
// series circuits, power and energy cost, efficiency, magnification, wave speed, balancing
// equations and Punnett squares. Levels: secure Year 8, grammar-school depth, GCSE taster.

const fmt = (x) => String(Math.round(x * 1000) / 1000);
const typed = (prompt, value, unit, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: fmt(value), form: 'any' }, unit, explain, steps, ...extra });
function choice(prompt, correct, wrongs, rng, explain, steps) {
  const seen = new Set([correct]);
  const ws = wrongs.filter((w) => !seen.has(w) && seen.add(w));
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.map((text) => ({ text }))]), explain, steps };
}

export const Y8_SCIENCE_GENERATORS = {
  y8sSpeed(level, rng) {
    if (level === 1) {
      const s = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), t = rng.pick([5, 10, 20, 30, 40, 60]);
      const who = rng.pick(['Mira cycles', 'Theo runs', 'A chariot races', 'Kit skateboards']);
      return typed(`${who} ${s * t} m in ${t} s. What is the average speed?`, s, 'm/s', `Speed = distance ÷ time = ${s * t} ÷ ${t} = ${s} m/s.`, ['speed = distance ÷ time', `distance = ${s * t} m, time = ${t} s`, `${s * t} ÷ ${t} = ${s} m/s`]);
    }
    if (level === 2) {
      const v = rng.pick([12, 15, 18, 20, 24, 30]), mins = rng.pick([2, 5, 10, 15, 20]);
      const d = v * mins * 60;
      return typed(`A ferry to the island of Delos travels at ${v} m/s for ${mins} minutes. How far does it go, in km?`, d / 1000, 'km', `Change minutes to seconds first: ${mins} × 60 = ${mins * 60} s. Distance = speed × time = ${v} × ${mins * 60} = ${d} m = ${fmt(d / 1000)} km.`, [`time = ${mins} × 60 = ${mins * 60} s`, `distance = speed × time = ${v} × ${mins * 60} = ${d} m`, `${d} m ÷ 1000 = ${fmt(d / 1000)} km`]);
    }
    const u = rng.pick([0, 2, 4, 5, 10]), a = rng.pick([2, 3, 4, 5]), t = rng.pick([2, 3, 4, 5, 6]);
    const v = u + a * t;
    return typed(`A car speeds up from ${u} m/s to ${v} m/s in ${t} s. What is its acceleration?`, a, 'm/s²', `Acceleration = change in velocity ÷ time = (${v} − ${u}) ÷ ${t} = ${a} m/s².`, ['acceleration = change in velocity ÷ time taken', `change in velocity = ${v} − ${u} = ${v - u} m/s`, `${v - u} ÷ ${t} = ${a} m/s²`]);
  },

  y8sDensity(level, rng) {
    const MAT = [['gold', 19.3], ['silver', 10.5], ['bronze', 8.8], ['iron', 7.9], ['aluminium', 2.7], ['marble', 2.7], ['oak', 0.7]];
    const [mat, rho] = rng.pick(MAT);
    const V = rng.pick([2, 4, 5, 10, 20, 50]);
    const m = Math.round(rho * V * 10) / 10;
    if (level === 1) return typed(`A block of ${mat} has a mass of ${fmt(m)} g and a volume of ${V} cm³. What is its density?`, m / V, 'g/cm³', `Density = mass ÷ volume = ${fmt(m)} ÷ ${V} = ${fmt(m / V)} g/cm³.`, ['density = mass ÷ volume', `mass = ${fmt(m)} g, volume = ${V} cm³`, `${fmt(m)} ÷ ${V} = ${fmt(m / V)} g/cm³`]);
    if (level === 2) return typed(`${mat[0].toUpperCase() + mat.slice(1)} has a density of ${rho} g/cm³. What is the mass of ${V} cm³ of it?`, rho * V, 'g', `Mass = density × volume = ${rho} × ${V} = ${fmt(rho * V)} g.`, ['rearrange: mass = density × volume', `${rho} × ${V}`, `= ${fmt(rho * V)} g`]);
    // Archimedes and the crown: displacement
    const before = rng.pick([200, 250, 300, 400]), crownV = rng.pick([20, 25, 40, 50]), crownM = Math.round(crownV * rng.pick([19.3, 15.2, 12.6]) * 10) / 10;
    const d = crownM / crownV;
    return typed(`Archimedes lowers a crown of mass ${fmt(crownM)} g into a measuring cylinder. The water rises from ${before} cm³ to ${before + crownV} cm³. What is the crown’s density? (Pure gold is 19.3 g/cm³.)`, d, 'g/cm³', `The crown displaced ${crownV} cm³ of water, so that is its volume. Density = ${fmt(crownM)} ÷ ${crownV} = ${fmt(d)} g/cm³. ${Math.abs(d - 19.3) < 0.05 ? 'That matches pure gold.' : 'That is less than 19.3, so the gold has been mixed with a cheaper metal.'}`, [`volume of crown = ${before + crownV} − ${before} = ${crownV} cm³`, 'density = mass ÷ volume', `${fmt(crownM)} ÷ ${crownV} = ${fmt(d)} g/cm³`]);
  },

  y8sPressure(level, rng) {
    if (level === 1) {
      const F = rng.pick([100, 200, 300, 400, 500, 600, 800]), A = rng.pick([2, 4, 5, 10]);
      return typed(`A force of ${F} N pushes on an area of ${A} m². What is the pressure?`, F / A, 'Pa', `Pressure = force ÷ area = ${F} ÷ ${A} = ${fmt(F / A)} Pa (N/m²).`, ['pressure = force ÷ area', `${F} N ÷ ${A} m²`, `= ${fmt(F / A)} Pa`]);
    }
    if (level === 2) {
      const W = rng.pick([450, 500, 600, 700]), shoe = rng.pick([0.02, 0.025, 0.05]), heel = 0.0005;
      const p1 = W / shoe, p2 = W / heel;
      return typed(`Theo weighs ${W} N. On one flat shoe (area ${shoe} m²) the pressure is ${fmt(p1)} Pa. Standing on one stiletto heel of area ${heel} m², how many times greater is the pressure?`, p2 / p1, '', `Pressure on the heel = ${W} ÷ ${heel} = ${fmt(p2)} Pa. ${fmt(p2)} ÷ ${fmt(p1)} = ${fmt(p2 / p1)} times. The same force on a smaller area gives a bigger pressure.`, [`heel pressure = ${W} ÷ ${heel} = ${fmt(p2)} Pa`, `compare: ${fmt(p2)} ÷ ${fmt(p1)}`, `= ${fmt(p2 / p1)} times as much`]);
    }
    const h = rng.pick([2, 5, 10, 20, 50]);
    const p = 1000 * 10 * h;
    return typed(`Poseidon’s diver is ${h} m under the sea. Water pressure = height × density × g, with density 1000 kg/m³ and g = 10 N/kg. What is the pressure from the water, in kPa?`, p / 1000, 'kPa', `p = h × ρ × g = ${h} × 1000 × 10 = ${p} Pa = ${fmt(p / 1000)} kPa.`, ['p = h ρ g', `${h} × 1000 × 10 = ${p} Pa`, `${p} Pa ÷ 1000 = ${fmt(p / 1000)} kPa`]);
  },

  y8sMoments(level, rng) {
    if (level === 1) {
      const F = rng.pick([5, 10, 20, 25, 40, 50]), d = rng.pick([0.2, 0.5, 1, 1.5, 2]);
      return typed(`A force of ${F} N acts ${d} m from a pivot. What is its moment?`, F * d, 'N m', `Moment = force × perpendicular distance from the pivot = ${F} × ${d} = ${fmt(F * d)} N m.`, ['moment = force × distance from pivot', `${F} N × ${d} m`, `= ${fmt(F * d)} N m`]);
    }
    const W1 = rng.pick([200, 300, 400, 500]), d1 = rng.pick([1, 1.5, 2]), d2 = rng.pick([0.5, 1, 2.5, 3, 4].filter((x) => x !== d1 && Number.isInteger((W1 * d1 * 2) / x)));
    const W2 = (W1 * d1) / d2;
    if (level === 2) return typed(`On a seesaw, Mira (${W1} N) sits ${d1} m from the pivot. How far from the pivot must Kit (${fmt(W2)} N) sit on the other side to balance it?`, d2, 'm', `Balanced when clockwise moment = anticlockwise moment: ${W1} × ${d1} = ${fmt(W2)} × d, so d = ${fmt(W1 * d1)} ÷ ${fmt(W2)} = ${d2} m.`, ['principle of moments: anticlockwise = clockwise', `${W1} × ${d1} = ${fmt(W1 * d1)} N m`, `d = ${fmt(W1 * d1)} ÷ ${fmt(W2)} = ${d2} m`]);
    const L = rng.pick([0.2, 0.25, 0.4, 0.5]), lever = rng.pick([1, 2, 4, 5]), load = rng.pick([400, 600, 800, 1000]);
    return typed(`Archimedes said, “Give me a lever long enough and I will move the world.” A rock of weight ${load} N sits ${L} m from the pivot of a lever. What force is needed ${lever} m from the pivot on the other side?`, (load * L) / lever, 'N', `${load} × ${L} = F × ${lever}, so F = ${fmt(load * L)} ÷ ${lever} = ${fmt((load * L) / lever)} N. A long lever turns a small force into a big moment.`, ['moment of rock = moment of effort', `${load} × ${L} = ${fmt(load * L)} N m`, `F = ${fmt(load * L)} ÷ ${lever} = ${fmt((load * L) / lever)} N`]);
  },

  y8sOhm(level, rng) {
    const R = rng.pick([2, 4, 5, 6, 10, 12, 20]), I = rng.pick([0.5, 1, 1.5, 2, 3]);
    if (level === 1) return typed(`A current of ${I} A flows through a ${R} Ω resistor. What is the potential difference across it?`, I * R, 'V', `V = I × R = ${I} × ${R} = ${fmt(I * R)} V.`, ['V = I × R', `${I} A × ${R} Ω`, `= ${fmt(I * R)} V`]);
    if (level === 2) {
      const V = I * R;
      return typed(`A ${fmt(V)} V cell drives a current of ${I} A through a lamp. What is the lamp’s resistance?`, R, 'Ω', `R = V ÷ I = ${fmt(V)} ÷ ${I} = ${R} Ω.`, ['rearrange V = IR to R = V ÷ I', `${fmt(V)} ÷ ${I}`, `= ${R} Ω`]);
    }
    const V = rng.pick([6, 12, 24]);
    const [R1, R2] = rng.pick([[2, 4], [3, 9], [2, 10], [4, 8], [5, 7], [1, 5], [3, 3], [2, 6], [4, 4]].filter(([a, b]) => Number.isInteger((V / (a + b)) * 4)));
    const total = R1 + R2, Ival = V / total;
    return typed(`A ${R1} Ω and a ${R2} Ω resistor are in series with a ${V} V battery. What current flows?`, Ival, 'A', `In series, resistances add: ${R1} + ${R2} = ${total} Ω. I = V ÷ R = ${V} ÷ ${total} = ${fmt(Ival)} A (the same everywhere in a series circuit).`, [`total resistance = ${R1} + ${R2} = ${total} Ω`, 'I = V ÷ R', `${V} ÷ ${total} = ${fmt(Ival)} A`]);
  },

  y8sPower(level, rng) {
    if (level === 1) {
      const P = rng.pick([20, 50, 100, 500, 1000, 2000]), t = rng.pick([10, 30, 60, 120]);
      return typed(`A ${P} W device runs for ${t} s. How much energy does it transfer?`, P * t, 'J', `Energy = power × time = ${P} × ${t} = ${P * t} J.`, ['energy transferred = power × time', `${P} W × ${t} s`, `= ${P * t} J`]);
    }
    if (level === 2) {
      const kW = rng.pick([0.5, 1, 1.5, 2, 3]), h = rng.pick([2, 3, 4, 5]), price = rng.pick([20, 25, 30, 40]);
      const kWh = kW * h;
      return typed(`An electric heater rated ${kW} kW is on for ${h} hours. Electricity costs ${price}p per kWh. How much does it cost, in pence?`, kWh * price, 'p', `Energy = ${kW} kW × ${h} h = ${fmt(kWh)} kWh. Cost = ${fmt(kWh)} × ${price}p = ${fmt(kWh * price)}p.`, ['energy in kWh = power in kW × time in hours', `${kW} × ${h} = ${fmt(kWh)} kWh`, `${fmt(kWh)} × ${price} = ${fmt(kWh * price)}p`]);
    }
    const input = rng.pick([200, 400, 500, 800, 1000]), eff = rng.pick([10, 20, 25, 40, 60, 75, 90]);
    return typed(`A motor is supplied with ${input} J of electrical energy and transfers ${(input * eff) / 100} J as useful kinetic energy. What is its efficiency, as a percentage?`, eff, '%', `Efficiency = useful output ÷ total input × 100 = ${(input * eff) / 100} ÷ ${input} × 100 = ${eff}%. The rest is wasted, mostly as thermal energy.`, ['efficiency = useful energy out ÷ total energy in', `${(input * eff) / 100} ÷ ${input} = ${eff / 100}`, `× 100 = ${eff}%`]);
  },

  y8sMagnify(level, rng) {
    if (level === 1) {
      const obj = rng.pick([5, 10, 20]), eye = rng.pick([10, 20, 40]);
      return typed(`A microscope has a ×${eye} eyepiece lens and a ×${obj} objective lens. What is the total magnification?`, eye * obj, '', `Total magnification = eyepiece × objective = ${eye} × ${obj} = ×${eye * obj}.`, ['multiply the two lens magnifications', `${eye} × ${obj}`, `= ${eye * obj}`]);
    }
    const actual = rng.pick([0.01, 0.02, 0.05, 0.1]), mag = rng.pick([100, 200, 400, 500]);
    const image = actual * mag;
    if (level === 2) return typed(`A cell is ${actual} mm across. Under the microscope it appears ${fmt(image)} mm across. What is the magnification?`, mag, '', `Magnification = image size ÷ actual size = ${fmt(image)} ÷ ${actual} = ×${mag}.`, ['magnification = image size ÷ actual size', `${fmt(image)} ÷ ${actual}`, `= ${mag}`]);
    return typed(`A drawing of a cell is ${fmt(image)} mm wide at a magnification of ×${mag}. What is the real width of the cell, in micrometres (µm)? (1 mm = 1000 µm)`, actual * 1000, 'µm', `Actual size = image ÷ magnification = ${fmt(image)} ÷ ${mag} = ${actual} mm = ${fmt(actual * 1000)} µm.`, ['actual size = image size ÷ magnification', `${fmt(image)} ÷ ${mag} = ${actual} mm`, `${actual} × 1000 = ${fmt(actual * 1000)} µm`]);
  },

  y8sWave(level, rng) {
    if (level < 3) {
      const f = rng.pick([2, 5, 10, 20, 50, 100]), lam = rng.pick([0.5, 1, 2, 3, 4]);
      if (level === 1) return typed(`A water wave has a frequency of ${f} Hz and a wavelength of ${lam} m. What is its speed?`, f * lam, 'm/s', `Wave speed = frequency × wavelength = ${f} × ${lam} = ${fmt(f * lam)} m/s.`, ['v = f × λ', `${f} Hz × ${lam} m`, `= ${fmt(f * lam)} m/s`]);
      return typed(`A sound wave travels at ${fmt(f * lam * 10)} m/s with a frequency of ${f * 10} Hz. What is its wavelength?`, lam, 'm', `λ = v ÷ f = ${fmt(f * lam * 10)} ÷ ${f * 10} = ${lam} m.`, ['rearrange v = fλ to λ = v ÷ f', `${fmt(f * lam * 10)} ÷ ${f * 10}`, `= ${lam} m`]);
    }
    const t = rng.pick([2, 3, 4, 5, 6]);
    return typed(`Kit sees lightning over Mount Olympus and hears the thunder ${t} s later. Sound travels at 340 m/s. Roughly how far away is the storm, in metres?`, 340 * t, 'm', `Light arrives almost instantly, so the delay is the time for the sound: distance = 340 × ${t} = ${340 * t} m.`, ['light travels so fast that its travel time is negligible', 'distance = speed of sound × time', `340 × ${t} = ${340 * t} m`]);
  },

  y8sBalance(level, rng) {
    const EQ = [
      ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', ['H₂ + O₂ → 2H₂O', '2H₂ + 2O₂ → 2H₂O', 'H₂ + 2O₂ → H₂O']],
      ['Mg + O₂ → MgO', '2Mg + O₂ → 2MgO', ['Mg + O₂ → 2MgO', 'Mg + 2O₂ → MgO', '2Mg + 2O₂ → 2MgO']],
      ['CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2O₂ → CO₂ + 2H₂O', ['CH₄ + O₂ → CO₂ + 2H₂O', '2CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 3O₂ → CO₂ + 2H₂O']],
      ['Na + Cl₂ → NaCl', '2Na + Cl₂ → 2NaCl', ['Na + Cl₂ → 2NaCl', 'Na + 2Cl₂ → NaCl', '2Na + 2Cl₂ → 2NaCl']],
      ['Fe + O₂ → Fe₂O₃', '4Fe + 3O₂ → 2Fe₂O₃', ['2Fe + O₂ → Fe₂O₃', '4Fe + 2O₂ → 2Fe₂O₃', '2Fe + 3O₂ → 2Fe₂O₃']],
      ['HCl + NaOH → NaCl + H₂O', 'HCl + NaOH → NaCl + H₂O (already balanced)', ['2HCl + NaOH → NaCl + H₂O', 'HCl + 2NaOH → NaCl + 2H₂O', 'HCl + NaOH → 2NaCl + H₂O']],
      ['Ca + H₂O → Ca(OH)₂ + H₂', 'Ca + 2H₂O → Ca(OH)₂ + H₂', ['Ca + H₂O → Ca(OH)₂ + 2H₂', '2Ca + H₂O → Ca(OH)₂ + H₂', 'Ca + 2H₂O → 2Ca(OH)₂ + H₂']],
    ];
    const pool = level === 1 ? EQ.slice(0, 2) : level === 2 ? EQ.slice(0, 4).concat(EQ.slice(5, 6)) : EQ;
    const [raw, right, wrongs] = rng.pick(pool);
    return choice(`Which is the correctly balanced equation for ${raw}?`, right, wrongs, rng, `Count each type of atom on both sides: in ${right.replace(' (already balanced)', '')} they match, because atoms are rearranged, never created or destroyed.`, ['Count the atoms of each element on each side.', 'Change only the big numbers in front (coefficients), never the small ones in a formula.', `${right}`]);
  },

  y8sPunnett(level, rng) {
    if (level === 1) {
      const pairs = [['Bb', 'Bb', 75, 'brown eyes (in a simple model, B for brown is dominant over b for blue)'], ['Bb', 'bb', 50, 'brown eyes (in a simple model, B for brown is dominant over b for blue)'], ['BB', 'bb', 100, 'brown eyes (in a simple model, B for brown is dominant over b for blue)']];
      const [p1, p2, pct, trait] = rng.pick(pairs);
      return typed(`Parents ${p1} × ${p2}. What percentage of children are likely to have ${trait}?`, pct, '%', `Draw a Punnett square: each parent gives one allele. Any child with at least one B has brown eyes: ${pct}%.`, [`alleles from parent 1: ${p1.split('').join(', ')}; parent 2: ${p2.split('').join(', ')}`, 'fill the four boxes and count those with a B', `${pct}% (${pct / 25} out of 4)`]);
    }
    if (level === 2) {
      const [p1, p2, pct] = rng.pick([['Bb', 'Bb', 25], ['Bb', 'bb', 50], ['BB', 'Bb', 0]]);
      return typed(`Parents ${p1} × ${p2}. B (brown) is dominant over b (blue). What percentage of children are likely to have BLUE eyes?`, pct, '%', `Blue eyes need two recessive alleles (bb). In the Punnett square, ${pct / 25} of the 4 boxes are bb: ${pct}%.`, ['blue is recessive, so a child must be bb', 'fill in the four boxes of the Punnett square', `${pct / 25} of 4 boxes = ${pct}%`]);
    }
    const n = rng.pick([40, 80, 120, 200]);
    return typed(`Two pea plants that are both Tt (tall, T, is dominant over short, t) are crossed and produce ${n} seedlings. About how many would you expect to be short?`, n / 4, '', `Tt × Tt gives TT, Tt, Tt, tt: one in four is short (tt). ${n} ÷ 4 = ${n / 4}. Gregor Mendel found ratios like this with peas in the 1860s.`, ['Punnett square for Tt × Tt: TT, Tt, Tt, tt', 'short plants are tt: 1 in 4', `${n} ÷ 4 = ${n / 4}`]);
  },
};

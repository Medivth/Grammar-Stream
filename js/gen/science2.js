// Science stretch generators: V = I × R and conservation of mass.

const fmt = (x) => String(Math.round(x * 100) / 100);

export const SCIENCE2_GENERATORS = {
  ohm(level, rng) {
    const R = rng.pick([2, 4, 5, 8, 10, 12, 20, 25, 50]), I = rng.pick([0.2, 0.5, 1, 1.5, 2, 3, 4]);
    const V = Math.round(I * R * 100) / 100;
    if (level === 1) {
      return {
        kind: 'typed', prompt: `A current of ${I} A flows through a ${R} Ω resistor. What is the potential difference (voltage) across it?`, numeric: { value: fmt(V), form: 'any' }, unit: 'V',
        explain: `V = I × R = ${I} × ${R} = ${fmt(V)} V.`,
        steps: ['Potential difference = current × resistance (V = I × R).', `I = ${I} A, R = ${R} Ω.`, `${I} × ${R} = ${fmt(V)} V.`],
      };
    }
    if (level === 2) {
      return {
        kind: 'typed', prompt: `A ${fmt(V)} V battery is connected across ${/^(8|11|18)/.test(String(R)) ? 'an' : 'a'} ${R} Ω resistor. What current flows?`, numeric: { value: String(I), form: 'any' }, unit: 'A',
        explain: `I = V ÷ R = ${fmt(V)} ÷ ${R} = ${I} A.`,
        steps: ['Rearrange V = I × R to I = V ÷ R.', `V = ${fmt(V)} V, R = ${R} Ω.`, `${fmt(V)} ÷ ${R} = ${I} A.`],
      };
    }
    return {
      kind: 'typed', prompt: `When ${fmt(V)} V is applied across a lamp, a current of ${I} A flows. What is the lamp’s resistance?`, numeric: { value: String(R), form: 'any' }, unit: 'Ω',
      explain: `R = V ÷ I = ${fmt(V)} ÷ ${I} = ${R} Ω.`,
      steps: ['Rearrange V = I × R to R = V ÷ I.', `V = ${fmt(V)} V, I = ${I} A.`, `${fmt(V)} ÷ ${I} = ${R} Ω.`],
    };
  },

  massConserve(level, rng) {
    const RX = [['magnesium', 'oxygen', 'magnesium oxide', 24, 16], ['iron', 'sulfur', 'iron sulfide', 56, 32], ['copper', 'oxygen', 'copper oxide', 64, 16], ['hydrogen', 'oxygen', 'water', 4, 32], ['carbon', 'oxygen', 'carbon dioxide', 12, 32]];
    const [a, b, p, ma, mb] = rng.pick(RX);
    const k = rng.pick([0.1, 0.2, 0.25, 0.5, 1]);
    const A = fmt(ma * k), B = fmt(mb * k), P = fmt((ma + mb) * k);
    if (level === 1) {
      return {
        kind: 'typed', prompt: `${A} g of ${a} reacts completely with ${B} g of ${b}. What mass of ${p} is made?`, numeric: { value: P, form: 'any' }, unit: 'g',
        explain: `Mass is conserved: atoms are rearranged, not created or destroyed. ${A} + ${B} = ${P} g.`,
        steps: ['In a chemical reaction no atoms are lost or made, so the total mass stays the same.', `Mass of product = mass of reactants = ${A} + ${B}.`, `= ${P} g of ${p}.`],
      };
    }
    if (level === 2) {
      return {
        kind: 'typed', prompt: `${A} g of ${a} burns in air to make ${P} g of ${p}. What mass of ${b} did it react with?`, numeric: { value: B, form: 'any' }, unit: 'g',
        explain: `The extra mass came from the ${b} in the air: ${P} − ${A} = ${B} g.`,
        steps: [`The product weighs more than the ${a} because it has joined with ${b} from the air.`, `Mass of ${b} = mass of product − mass of ${a}.`, `${P} − ${A} = ${B} g.`],
      };
    }
    const mult = rng.pick([2, 3, 4]);
    return {
      kind: 'typed', prompt: `${A} g of ${a} makes ${P} g of ${p}. How much ${p} would ${fmt(ma * k * mult)} g of ${a} make?`, numeric: { value: fmt((ma + mb) * k * mult), form: 'any' }, unit: 'g',
      explain: `${fmt(ma * k * mult)} g is ${mult} times as much ${a}, so it makes ${mult} times as much product: ${mult} × ${P} = ${fmt((ma + mb) * k * mult)} g.`,
      steps: ['Reacting masses are proportional: double the reactant, double the product.', `${fmt(ma * k * mult)} ÷ ${A} = ${mult}, so there is ${mult} times as much ${a}.`, `${mult} × ${P} = ${fmt((ma + mb) * k * mult)} g.`],
    };
  },
};

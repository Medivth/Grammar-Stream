// Exact rational arithmetic for maths questions and answer checking.

export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

export class Frac {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('zero denominator');
    if (d < 0) { n = -n; d = -d; }
    this.n = n; this.d = d;
  }
  static of(x) {
    if (x instanceof Frac) return x;
    if (Number.isInteger(x)) return new Frac(x, 1);
    throw new Error('not exact: ' + x);
  }
  simplify() { const g = gcd(this.n, this.d) || 1; return new Frac(this.n / g, this.d / g); }
  add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d).simplify(); }
  sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d).simplify(); }
  mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d).simplify(); }
  div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n).simplify(); }
  eq(o) { o = Frac.of(o); return this.n * o.d === o.n * this.d; }
  cmp(o) { o = Frac.of(o); return Math.sign(this.n * o.d - o.n * this.d); }
  isSimplest() { return gcd(this.n, this.d) === 1; }
  valueOf() { return this.n / this.d; }
  /** Text form used in prompts: {{n/d}} renders as a stacked fraction. */
  toTex({ mixed = false } = {}) {
    const f = this;
    if (f.d === 1) return String(f.n);
    if (mixed && Math.abs(f.n) > f.d) {
      const whole = Math.trunc(f.n / f.d);
      const rem = Math.abs(f.n % f.d);
      return `${whole}{{${rem}/${f.d}}}`;
    }
    return `${f.n < 0 ? '−' : ''}{{${Math.abs(f.n)}/${f.d}}}`;
  }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}

/**
 * Parse a typed number: integers, decimals, fractions "3/4", mixed "1 3/4",
 * negatives with - or −, thousands commas. Returns {value: Frac, form} or null.
 */
export function parseNumber(text) {
  if (text == null) return null;
  let t = String(text).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, '');
  let m;
  if ((m = t.match(/^(-?)(\d+) (\d+)\s*\/\s*(\d+)$/))) {
    const [, sign, w, n, d] = m;
    if (+d === 0) return null;
    const f = new Frac(+w * +d + +n, +d);
    return { value: sign ? new Frac(-f.n, f.d) : f, form: 'mixed', raw: new Frac(+n, +d) };
  }
  if ((m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/))) {
    if (+m[2] === 0) return null;
    const f = new Frac(+m[1], +m[2]);
    return { value: f, form: 'fraction', raw: f };
  }
  if ((m = t.match(/^(-?)(\d*)\.(\d+)$/)) || (m = t.match(/^(-?)(\d+)\.?()$/))) {
    const [, sign, whole, dec] = m;
    const d = 10 ** dec.length;
    const n = (+(whole || 0)) * d + (+(dec || 0));
    const f = new Frac(sign ? -n : n, d).simplify();
    return { value: f, form: dec ? 'decimal' : 'integer', raw: f };
  }
  return null;
}

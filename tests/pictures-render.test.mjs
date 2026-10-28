// Every picture a question generator makes can be drawn: the maths diagram code accepts each
// `diagram` (in the question) and `visual` (after a wrong answer) without throwing or printing
// NaN/undefined, and a diagram it leaves to the question screen is one of the angle drawings there.
// A minimal DOM stands in for the browser, so this runs under node.
import { test } from 'node:test';
import assert from 'node:assert/strict';

class Node {}
class El extends Node {
  constructor(tag) { super(); this.tag = tag; this.attrs = {}; this.children = []; this.style = { setProperty() {} }; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  append(...c) { this.children.push(...c); }
  addEventListener() {}
  set className(v) { this.attrs.class = v; }
  set textContent(v) { this.children = [new Txt(v)]; }
}
class Txt extends Node { constructor(t) { super(); this.t = String(t); } }
globalThis.Node = Node;
globalThis.document = { createElementNS: (ns, tag) => new El(tag), createElement: (tag) => new El(tag), createTextNode: (t) => new Txt(t) };

const { GENERATORS } = await import('../js/gen/index.js');
const { makeRng } = await import('../js/core/rng.js');
const { mathsDiagram } = await import('../js/ui/diagrams.js');

// drawn by js/ui/qtypes.js diagram() when the maths diagram code returns nothing
const QUESTION_SCREEN_ONLY = new Set(['line', 'triangle', 'isosceles', 'point', 'grid']);
const BAD = /NaN|undefined|Infinity|\[object/;
function problems(el, out = []) {
  if (el instanceof Txt) { if (BAD.test(el.t)) out.push(`text "${el.t}"`); return out; }
  if (!(el instanceof El)) return out;
  for (const [k, v] of Object.entries(el.attrs)) if (BAD.test(v)) out.push(`${el.tag}.${k}=${v}`);
  for (const c of el.children) problems(c, out);
  return out;
}

for (const [name, gen] of Object.entries(GENERATORS)) {
  test(`generator ${name}: its pictures can be drawn`, () => {
    for (const level of [1, 2, 3]) {
      const rng = makeRng(`pictures:${name}:${level}`);
      for (let i = 0; i < 80; i++) {
        const q = gen(level, rng), label = `${name} L${level} #${i}`;
        if (q.diagram) {
          let el;
          assert.doesNotThrow(() => { el = mathsDiagram(q.diagram); }, `${label}: diagram ${q.diagram.type} throws`);
          if (el) assert.deepEqual(problems(el), [], `${label}: diagram ${q.diagram.type}`);
          else assert.ok(QUESTION_SCREEN_ONLY.has(q.diagram.type), `${label}: nothing draws diagram ${q.diagram.type}`);
        }
        for (const v of [].concat(q.visual || [])) {
          if (v.kind !== 'maths') continue;
          let el;
          assert.doesNotThrow(() => { el = mathsDiagram(v.diagram); }, `${label}: picture ${v.diagram.type} throws`);
          assert.ok(el, `${label}: picture ${v.diagram.type} draws nothing`);
          assert.deepEqual(problems(el), [], `${label}: picture ${v.diagram.type}`);
        }
      }
    }
  });
}

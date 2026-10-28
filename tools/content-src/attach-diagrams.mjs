// Labelled diagrams on topics and questions, applied by tools/build-content.mjs to every deck.
// The table itself is generated: tools/content-src/diagram-attachments.json, one entry per diagram:
// { diagram, topics: [ids], items: [{ id, highlight?, question? }], courses?: ['ks1', 'y3', 'y6', 'y8'] }.
// A topic or question that already has a picture keeps it; the diagram is shown first.
import { readFileSync } from 'node:fs';
const TABLE = JSON.parse(readFileSync(new URL('./diagram-attachments.json', import.meta.url), 'utf8'));

export function attachDiagrams(deck, course) {
  let n = 0;
  const add = (x, v) => { x.visual = x.visual ? [v, ...[].concat(x.visual).filter((o) => !(o.kind === 'diagram' && o.id === v.id))] : v; n++; };
  for (const e of TABLE) {
    if (e.courses && !e.courses.includes(course)) continue;
    for (const t of deck.topics || []) if (e.topics?.includes(t.id)) add(t, { kind: 'diagram', id: e.diagram });
    for (const it of deck.items || []) {
      const a = e.items?.find((x) => x.id === it.id);
      if (a) add(it, { kind: 'diagram', id: e.diagram, ...(a.highlight ? { highlight: a.highlight } : {}), ...(a.question ? { question: true } : {}) });
    }
  }
  return n;
}

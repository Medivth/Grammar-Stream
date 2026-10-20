// Grown-up-facing text refers to the child with tokens ({she}, {She}, {her}, {Her}, {him}),
// replaced with the pronouns chosen at setup. "They" reads as "your child" so verbs still agree.

const FORMS = {
  she: { she: 'she', She: 'She', her: 'her', Her: 'Her', him: 'her' },
  he: { she: 'he', She: 'He', her: 'his', Her: 'His', him: 'him' },
  they: { she: 'your child', She: 'Your child', her: 'your child’s', Her: 'Your child’s', him: 'your child' },
};

let current = FORMS.she;

export function setPronoun(p) {
  current = FORMS[p] || FORMS.she;
}

export function pr(text) {
  return typeof text === 'string' && text.includes('{') ? text.replace(/\{(she|She|her|Her|him)\}/g, (_, k) => current[k]) : text;
}

/** Replace tokens in every text node and placeholder under `el`. */
export function pronounify(el) {
  if (!el?.ownerDocument) return el;
  const walker = el.ownerDocument.createTreeWalker(el, 4 /* SHOW_TEXT */);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.includes('{')) n.nodeValue = pr(n.nodeValue);
  el.querySelectorAll?.('[placeholder*="{"]').forEach((x) => x.setAttribute('placeholder', pr(x.getAttribute('placeholder'))));
  return el;
}

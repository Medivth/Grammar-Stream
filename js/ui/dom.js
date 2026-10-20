// Tiny DOM helpers. All content text goes through rich(), which escapes HTML first.
import { pr, pronounify } from '../core/pronoun.js';

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') {
      // custom properties (--x) must go through setProperty; Object.assign silently drops them
      for (const [prop, val] of Object.entries(v)) {
        if (prop.startsWith('--')) el.style.setProperty(prop, val);
        else el.style[prop] = val;
      }
    }
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const NS = 'http://www.w3.org/2000/svg';
export function s(tag, attrs = {}, ...children) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}

export function escapeHTML(t) {
  return String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Escape, then render {{a/b}} fractions, **bold**, _italic_, x^{2} and newlines. */
export function richHTML(text) {
  const blocks = [];
  // code first, so nothing inside it is treated as formatting: ```lines``` and `inline`
  const src = escapeHTML(text)
    .replace(/```\n?([\s\S]*?)```/g, (_, c) => `\u0000${blocks.push(`<pre class="code"><code>${c.replace(/\n$/, '')}</code></pre>`) - 1}\u0000`)
    .replace(/`([^`\n]+)`/g, (_, c) => `\u0000${blocks.push(`<code>${c}</code>`) - 1}\u0000`);
  return src
    .replace(/\{\{([^/{}]+)\/([^/{}]+)\}\}/g, '<span class="frac"><span>$1</span><span>$2</span></span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)_(.+?)_(?=\s|$|[.,!?])/g, '$1<em>$2</em>')
    .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[+i]);
}

export function rich(tag, text, attrs = {}) {
  return h(tag, { ...attrs, html: richHTML(text) });
}

/** Plain text version for speech and summaries. */
export function plain(text) {
  return String(text ?? '').replace(/\{\{([^/{}]+)\/([^/{}]+)\}\}/g, '$1 over $2').replace(/\*\*|_/g, '');
}

const FRACTION_WORDS = { '1/2': 'one half', '1/3': 'one third', '2/3': 'two thirds', '1/4': 'one quarter', '2/4': 'two quarters', '3/4': 'three quarters' };
/** Text as it should be read aloud: fractions in words, symbols spoken. */
export function spoken(text) {
  return String(text ?? '')
    .replace(/\{\{([^/{}]+)\/([^/{}]+)\}\}/g, (_, n, d) => FRACTION_WORDS[`${n}/${d}`] || `${n} over ${d}`)
    .replace(/\*\*|_(?=\w)|(?<=\w)_/g, '')
    .replace(/_{2,}/g, ' blank ')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/ = \?/g, ' equals what').replace(/=\s*$/, ' equals what?').replace(/ \? /g, ' what ')
    .replace(/£(\d+)\.(\d\d)/g, '$1 pounds $2').replace(/(\d+)p\b/g, '$1 pence')
    .replace(/\s+/g, ' ').trim();
}

export function mount(root, ...nodes) {
  root.replaceChildren(...nodes);
  pronounify(root);
  window.scrollTo(0, 0);
}

let toastTimer;
export function toast(msg) {
  document.querySelector('.toast')?.remove();
  const t = h('div', { class: 'toast', role: 'status' }, pr(msg));
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3500);
}

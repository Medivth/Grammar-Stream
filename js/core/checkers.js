// Answer checking for every question kind. Pure functions: (question, response) -> result.
// result: { correct, score (0..1), near (typo accepted), message, wrongPick }

import { parseNumber } from './fraction.js';

export function normalise(s) {
  return String(s ?? '')
    .normalize('NFKC')
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—−]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?,;:]+$/, '')
    .trim();
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function checkTyped(q, response) {
  const r = normalise(response);
  if (!r) return { correct: false, score: 0, message: 'No answer given.' };
  if (q.numeric) return checkNumeric(q, response);
  const answers = [q.answer, ...(q.accept || [])].map(normalise);
  if (answers.includes(r)) return { correct: true, score: 1 };
  // "the Nile" and "Nile" are both fine
  const noThe = (x) => x.replace(/^the /, '');
  if (!q.strict && answers.map(noThe).includes(noThe(r))) return { correct: true, score: 1 };
  if (!q.strict) {
    // one slip allowed in longer answers (names, terms) — never for spelling items
    const close = answers.find((a) => a.length >= 6 && levenshtein(a, r) === 1);
    if (close) return { correct: true, score: 1, near: true, message: `Nearly perfect spelling: it's “${q.answer}”.` };
  }
  return { correct: false, score: 0 };
}

function checkNumeric(q, response) {
  const parsed = parseNumber(response);
  if (!parsed) return { correct: false, score: 0, message: 'That doesn’t look like a number. Try digits, a decimal like 0.5 or a fraction like 3/4.' };
  const target = parseNumber(q.numeric.value).value;
  if (!parsed.value.eq(target)) return { correct: false, score: 0 };
  const form = q.numeric.form || 'any';
  if (form === 'simplest' && parsed.form === 'fraction' && !parsed.raw.isSimplest()) {
    return { correct: false, score: 0.5, message: 'Right value, but it can be simplified further.' };
  }
  if (form === 'simplest' && parsed.form === 'mixed' && !parsed.raw.isSimplest()) {
    return { correct: false, score: 0.5, message: 'Right value, but the fraction part can be simplified.' };
  }
  if (form === 'mixed' && parsed.form === 'fraction' && Math.abs(parsed.value.n) > parsed.value.d) {
    return { correct: false, score: 0.5, message: 'Right value. Now write it as a mixed number.' };
  }
  if (form === 'decimal' && parsed.form !== 'decimal' && parsed.form !== 'integer') {
    return { correct: false, score: 0.5, message: 'Right value. Write it as a decimal.' };
  }
  return { correct: true, score: 1 };
}

function checkChoice(q, response) {
  const opt = q.options[response];
  if (!opt) return { correct: false, score: 0 };
  if (q.weighted) {
    const best = Math.max(...q.options.map((o) => o.weight ?? 0));
    const score = (opt.weight ?? 0) / best;
    return { correct: score >= 0.999, score, message: opt.feedback, wrongPick: score < 1 ? response : null };
  }
  return { correct: !!opt.correct, score: opt.correct ? 1 : 0, message: opt.feedback, wrongPick: opt.correct ? null : response };
}

function checkOrder(q, response) {
  // response: array of indices into q.items in the order the child placed them
  if (!Array.isArray(response)) return { correct: false, score: 0 };
  const placed = response.map((i) => q.items[i]);
  const correctCount = placed.filter((t, i) => t === q.items[i]).length;
  const ok = correctCount === q.items.length;
  return { correct: ok, score: correctCount / q.items.length };
}

function checkMap(q, response) {
  if (q.mode === 'locate') {
    const ok = response === q.feature;
    return { correct: ok, score: ok ? 1 : 0, wrongPick: ok ? null : response };
  }
  return checkTyped(q, response);
}

function checkNumberLine(q, response) {
  const v = Number(response);
  const err = Math.abs(v - q.target);
  const ok = err <= q.tolerance;
  return { correct: ok, score: ok ? 1 : Math.max(0, 1 - err / ((q.max - q.min) / 2)) };
}

function checkCloze(q, response) {
  if (!Array.isArray(response)) response = [];
  const results = q.blanks.map((b, i) => checkTyped({ ...b, strict: b.strict ?? q.strict }, response[i]));
  const right = results.filter((r) => r.correct).length;
  return { correct: right === q.blanks.length, score: right / q.blanks.length, perBlank: results.map((r) => r.correct) };
}

/** Sentence-writing tasks: rule checks with a message for each failed rule. */
export function checkSentence(q, text) {
  const t = String(text ?? '').trim();
  const lower = t.toLowerCase();
  const failed = [];
  for (const c of q.checks) {
    let ok = true;
    switch (c.type) {
      case 'includesAny': ok = c.words.some((w) => wordIn(lower, w)); break;
      case 'includesAll': ok = c.words.every((w) => wordIn(lower, w)); break;
      case 'excludes': ok = !c.words.some((w) => wordIn(lower, w)); break;
      case 'regex': ok = new RegExp(c.pattern, c.flags ?? '').test(t); break;
      case 'notRegex': ok = !new RegExp(c.pattern, c.flags ?? '').test(t); break;
      case 'capital': ok = /^["'(“‘]?[A-Z]/.test(t); break;
      case 'endPunct': ok = /[.!?]["')”’]?$/.test(t); break;
      case 'minWords': ok = t.split(/\s+/).filter(Boolean).length >= c.n; break;
      case 'maxSentences': ok = (t.match(/[.!?](\s|$)/g) || []).length <= c.n; break;
      default: throw new Error('unknown check ' + c.type);
    }
    if (!ok) failed.push(c.msg || defaultMsg(c));
  }
  const score = 1 - failed.length / q.checks.length;
  return { correct: failed.length === 0, score, failed };
}

function wordIn(lower, w) {
  const esc = w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`).test(lower);
}

function defaultMsg(c) {
  switch (c.type) {
    case 'capital': return 'Start with a capital letter.';
    case 'endPunct': return 'End with a full stop, question mark or exclamation mark.';
    case 'minWords': return `Use at least ${c.n} words.`;
    case 'maxSentences': return c.n === 1 ? 'Make it one sentence.' : `Use no more than ${c.n} sentences.`;
    default: return 'Check the instructions again.';
  }
}

export function check(q, response) {
  switch (q.kind) {
    case 'typed': return checkTyped(q, response);
    case 'choice': return checkChoice(q, response);
    case 'order': return checkOrder(q, response);
    case 'map': return checkMap(q, response);
    case 'numberline': return checkNumberLine(q, response);
    case 'cloze': return checkCloze(q, response);
    case 'sentence': return checkSentence(q, response);
    default: throw new Error('unknown question kind ' + q.kind);
  }
}

/** Response that a checker accepts, used by tests to prove every question is answerable. */
export function correctResponse(q) {
  switch (q.kind) {
    case 'typed': return q.numeric ? q.numeric.value : q.answer;
    case 'choice': {
      if (q.weighted) {
        const best = Math.max(...q.options.map((o) => o.weight ?? 0));
        return q.options.findIndex((o) => o.weight === best);
      }
      return q.options.findIndex((o) => o.correct);
    }
    case 'order': return q.items.map((_, i) => i);
    case 'map': return q.mode === 'locate' ? q.feature : q.answer;
    case 'numberline': return q.target;
    case 'cloze': return q.blanks.map((b) => b.answer);
    case 'sentence': return q.model;
    default: throw new Error('unknown kind ' + q.kind);
  }
}

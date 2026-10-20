// Content database: topics and items from every deck, indexed for the scheduler.

export function buildDB(decks) {
  const db = { topics: {}, items: {}, topicOrder: {}, itemsByTopic: {}, sentences: [], sentenceById: {}, maps: {}, pieces: [], pieceById: {}, ladder: [], bookById: {}, rungs: [], timeline: null };
  for (const deck of decks) {
    const subject = deck.subject;
    db.topicOrder[subject] ||= [];
    for (const t of deck.topics || []) {
      const topic = { kind: 'facts', prereqs: [], ...t, subject, deck: deck.deck };
      db.topics[topic.id] = topic;
      db.topicOrder[subject].push(topic.id);
      db.itemsByTopic[topic.id] ||= [];
    }
    for (const it of deck.items || []) {
      const item = { ...it, subject };
      db.items[item.id] = item;
      (db.itemsByTopic[item.topic] ||= []).push(item.id);
    }
    for (const p of deck.pieces || []) { db.pieces.push(p); db.pieceById[p.id] = p; }
    for (const b of deck.ladder || []) { db.ladder.push(b); db.bookById[b.id] = b; }
    if (deck.rungs) db.rungs = deck.rungs;
    if (deck.timeline) db.timeline = deck.timeline;
    for (const s of deck.sentences || []) {
      db.sentences.push(s);
      db.sentenceById[s.id] = s;
    }
  }
  return db;
}

export async function loadContent(fetchJSON) {
  const index = await fetchJSON('content/index.json');
  const decks = await Promise.all(index.decks.map((p) => fetchJSON('content/' + p)));
  const db = buildDB(decks);
  for (const [id, path] of Object.entries(index.maps || {})) db.maps[id] = { path, data: null };
  return db;
}

const KINDS = ['fact', 'spell', 'mcq', 'weighted', 'order', 'mapfact', 'cloze', 'template', 'written'];

/** Structural validation. Returns a list of human-readable problems. */
export function validateDB(db, generators) {
  const errs = [];
  const seen = new Set();
  for (const t of Object.values(db.topics)) {
    if (!t.title) errs.push(`topic ${t.id}: missing title`);
    for (const p of t.prereqs) if (!db.topics[p]) errs.push(`topic ${t.id}: unknown prereq ${p}`);
    for (const l of t.links || []) if (l === t.subject || !db.topicOrder[l]) errs.push(`topic ${t.id}: bad link ${l}`);
    if (!t.id.startsWith(t.subject + '.')) errs.push(`topic ${t.id}: id must start with "${t.subject}."`);
    for (const d of t.diagnostic || []) if (db.items[d]?.topic !== t.id) errs.push(`topic ${t.id}: diagnostic ${d} is not an item of this topic`);
    if (!(db.itemsByTopic[t.id] || []).length) errs.push(`topic ${t.id}: has no items`);
  }
  // prerequisite cycles
  const state = {};
  const visit = (id, path) => {
    if (state[id] === 2) return;
    if (state[id] === 1) { errs.push(`prereq cycle: ${[...path, id].join(' -> ')}`); return; }
    state[id] = 1;
    for (const p of db.topics[id]?.prereqs || []) visit(p, [...path, id]);
    state[id] = 2;
  };
  Object.keys(db.topics).forEach((id) => visit(id, []));

  for (const it of Object.values(db.items)) {
    const where = `item ${it.id}`;
    if (seen.has(it.id)) errs.push(`${where}: duplicate id`);
    seen.add(it.id);
    if (!db.topics[it.topic]) errs.push(`${where}: unknown topic ${it.topic}`);
    for (const c of it.credits || []) if (!db.topics[c] || c === it.topic) errs.push(`${where}: bad credit ${c}`);
    if (!KINDS.includes(it.kind)) { errs.push(`${where}: unknown kind ${it.kind}`); continue; }
    switch (it.kind) {
      case 'written':
        if (!it.prompt || !it.model || !it.passage || !Array.isArray(it.hints) || it.hints.length < 2) errs.push(`${where}: written answer needs prompt, passage, hints and a model answer`);
        break;
      case 'fact':
      case 'mapfact':
        if (!it.answer) errs.push(`${where}: missing answer`);
        if (it.kind === 'fact' && !it.prompt) errs.push(`${where}: missing prompt`);
        if (it.kind === 'mapfact' && (!it.map || !it.feature)) errs.push(`${where}: missing map/feature`);
        for (const d of it.distractors || []) if (d.toLowerCase() === it.answer.toLowerCase()) errs.push(`${where}: distractor equals answer`);
        break;
      case 'spell':
        if (!it.word || !it.sentence?.includes('___')) errs.push(`${where}: spell needs word and a sentence with ___`);
        if (it.sentence?.toLowerCase().includes(it.word?.toLowerCase())) errs.push(`${where}: sentence gives the word away`);
        break;
      case 'mcq':
        if ((it.options || []).filter((o) => o.correct).length !== 1) errs.push(`${where}: mcq needs exactly one correct option`);
        break;
      case 'weighted':
        if (!(it.options || []).every((o) => typeof o.weight === 'number')) errs.push(`${where}: every weighted option needs a weight`);
        break;
      case 'order':
        if (!(it.items?.length >= 3)) errs.push(`${where}: order needs at least 3 items`);
        break;
      case 'cloze':
        if ((it.text.match(/___/g) || []).length !== it.blanks?.length) errs.push(`${where}: blanks do not match ___ count`);
        break;
      case 'template':
        if (!generators[it.gen]) errs.push(`${where}: unknown generator ${it.gen}`);
        if (!(it.levels?.length)) errs.push(`${where}: template needs levels`);
        break;
    }
    if (!['template', 'written'].includes(it.kind) && !it.explain) errs.push(`${where}: missing explain`);
  }
  for (const s of db.sentences) {
    if (!s.model || !s.checks?.length) errs.push(`sentence ${s.id}: needs model and checks`);
  }
  for (const p of db.pieces) {
    if (p.rubric?.length !== 4 || !p.rubric.every((r) => r.name && r.levels?.length === 3)) errs.push(`piece ${p.id}: rubric needs 4 lines of 3 levels`);
    if (!p.plan?.length || !p.criteria?.length || !p.task || !p.starter) errs.push(`piece ${p.id}: needs task, plan, criteria and starter`);
    for (const t of p.needsTopics || []) if (!db.topics[t]) errs.push(`piece ${p.id}: unknown topic ${t}`);
  }
  for (const b of db.ladder) if (!(b.rung >= 1 && b.rung <= 5) || !b.title || !b.author) errs.push(`book ${b.id}: needs rung 1-5, title, author`);
  if (db.ladder.length && db.rungs.length !== 5) errs.push('reading ladder needs 5 rung names');
  for (const e of db.timeline?.events || []) for (const i of e.items) if (!db.items[i]) errs.push(`timeline event ${e.label}: unknown item ${i}`);
  return errs;
}

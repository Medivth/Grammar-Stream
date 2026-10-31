// Book talk: questions to chat about with a grown-up while reading a book, so the child practises
// the talk a teacher looks for at greater depth (predicting, inferring, linking, explaining).
// Three a day from the book being read; a chat is logged when the grown-up says it happened.

export const TALK_KINDS = { predict: 'Predict', infer: 'Detective', link: 'Link', words: 'Words', think: 'Think' };

export const BOOK_TALK = [
  ['predict', 'What do you think will happen next? Which clue makes you think that?'],
  ['predict', 'How do you think the story will end? Why?'],
  ['predict', 'Look at the next chapter title or picture. What might happen in it?'],
  ['predict', 'If you could give one character a warning, what would you tell them, and why?'],
  ['infer', 'How is the main character feeling right now? How do you know?'],
  ['infer', 'Why do you think a character did what they did? Find a clue in the book.'],
  ['infer', 'Is there a character you don’t trust? What makes you think so?'],
  ['infer', 'What kind of person is the main character? Tell me something they did that shows it.'],
  ['infer', 'Has a character changed since the start of the book? How?'],
  ['link', 'Does this book remind you of another book or story you know? What is the same?'],
  ['link', 'Does anything in this book remind you of something that has happened to you?'],
  ['link', 'Is this a made-up story, or does it tell you true facts? How can you tell?'],
  ['link', 'Have you read about this kind of thing in a fact book or article? What did you learn there?'],
  ['words', 'Find a word the writer chose that you really like. Why is it a good word?'],
  ['words', 'Find a word you didn’t know. What do you think it means from the sentence around it?'],
  ['words', 'Find a sentence that makes a picture in your head. What do you see?'],
  ['words', 'Why did the writer use an exclamation mark (or a question) here?'],
  ['think', 'What has been the most exciting part so far? Why?'],
  ['think', 'If you were the main character, would you have done the same thing? Why?'],
  ['think', 'What would you ask the writer if you could meet them?'],
  ['think', 'Who would you give this book to, and why would they like it?'],
  ['think', 'Retell what has happened so far in five sentences.'],
  ['think', 'What is the problem in the story, and how might it be solved?'],
  ['think', 'Is there a lesson in this story? What is it?'],
].map(([kind, text], i) => ({ id: `talk.${i + 1}`, kind, text }));

/** Today's three questions: one to predict, one to infer, and one of the rest, turning over each day. */
export function talkForDay(day) {
  const of = (kinds) => BOOK_TALK.filter((q) => kinds.includes(q.kind));
  const pick = (list, k) => list[((day * 7 + k * 13) % list.length + list.length) % list.length];
  return [pick(of(['predict']), 0), pick(of(['infer']), 1), pick(of(['link', 'words', 'think']), 2)];
}

export function logTalk(state, today, questionId, book = null) {
  (state.talks ||= []).push({ day: today, q: questionId, title: book?.title ?? null });
}

export const talksThisWeek = (state, today) => (state.talks || []).filter((t) => t.day > today - 7).length;
export const talkedToday = (state, today) => new Set((state.talks || []).filter((t) => t.day === today).map((t) => t.q));

// Reading ladder for a strong Year 8 reader who loves Greek myth: Riordan and other myth
// retellings, modern classics, then the classics and the ancient texts themselves.
// (Books are suggestions to borrow or buy; no text is included.)

const B = (rung, title, author, year, note, extra = {}) => ({ id: `book.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, rung, title, author, year, note, ...extra });

const LADDER = [
  B(1, 'Percy Jackson and the Lightning Thief', 'Rick Riordan', 2005, 'Where it all began: the gods are real, and they live in America now.'),
  B(1, 'Percy Jackson and the Sea of Monsters', 'Rick Riordan', 2006, 'The Odyssey’s monsters, retold at speed: spot the Sirens and the Cyclops.'),
  B(1, 'The Lost Hero', 'Rick Riordan', 2010, 'Heroes of Olympus, book one: Greek and Roman gods collide.'),
  B(1, 'The Hidden Oracle', 'Rick Riordan', 2016, 'The Trials of Apollo, book one: the god of poetry, stuck as a teenager.'),
  B(1, 'Holes', 'Louis Sachar', 1998, 'A curse, a desert camp and a plot that clicks together perfectly.'),
  B(1, 'Wonder', 'R. J. Palacio', 2012, 'Told from several points of view: a lesson in narrative voice.'),
  B(2, 'Black Ships Before Troy', 'Rosemary Sutcliff', 1993, 'The Iliad retold in glorious prose: Hector, Achilles and the wooden horse.'),
  B(2, 'The Wanderings of Odysseus', 'Rosemary Sutcliff', 1995, 'The Odyssey retold: the Cyclops, Circe, the Sirens and the long road home.'),
  B(2, 'Northern Lights', 'Philip Pullman', 1995, 'Daemons, armoured bears and a girl who can read the truth.'),
  B(2, 'Skellig', 'David Almond', 1998, 'Something strange in the garage. Short, haunting and beautifully written.'),
  B(2, 'Wolf Brother', 'Michelle Paver', 2004, 'Six thousand years ago, a boy and a wolf cub against a demon bear.'),
  B(2, 'Goodnight Mister Tom', 'Michelle Magorian', 1981, 'An evacuee in the Second World War. Moving, and sometimes hard to read.'),
  B(3, 'The Hobbit', 'J. R. R. Tolkien', 1937, 'The original quest: riddles in the dark and a dragon on a hoard of gold.'),
  B(3, 'Mythos', 'Stephen Fry', 2017, 'The Greek myths from the beginning, told with wit. Some grown-up humour.'),
  B(3, 'A Wizard of Earthsea', 'Ursula K. Le Guin', 1968, 'A proud young wizard unleashes a shadow. Spare, wise and magical.'),
  B(3, 'Treasure Island', 'Robert Louis Stevenson', 1883, 'Pirates, a map and Long John Silver, one of fiction’s great villains.', { free: true }),
  B(3, 'The Hound of the Baskervilles', 'Arthur Conan Doyle', 1902, 'Holmes and Watson on the moor. She has read the first chapter in English.', { free: true }),
  B(3, 'Animal Farm', 'George Orwell', 1945, 'A fable about power. Short, sharp and unforgettable.'),
  B(4, 'Frankenstein', 'Mary Shelley', 1818, 'Written when she was a teenager. The creature is not the monster you expect.', { free: true }),
  B(4, 'Strange Case of Dr Jekyll and Mr Hyde', 'Robert Louis Stevenson', 1886, 'A short, gripping gothic mystery, and a GCSE favourite.', { free: true }),
  B(4, 'A Christmas Carol', 'Charles Dickens', 1843, 'Four ghosts in one night. The perfect first Dickens.', { free: true }),
  B(4, 'Pride and Prejudice', 'Jane Austen', 1813, 'The funniest classic: start with the first chapter, which she has already met.', { free: true }),
  B(4, 'Jane Eyre', 'Charlotte Brontë', 1847, 'An orphan who refuses to be crushed, and a secret in the attic.', { free: true }),
  B(4, 'The Book Thief', 'Markus Zusak', 2005, 'Nazi Germany, narrated by Death. Powerful; best read with someone to talk to.'),
  B(5, 'The Odyssey (translated by Emily Wilson)', 'Homer', 2017, 'The real thing, in a clear, fast modern verse translation.'),
  B(5, 'Oedipus the King', 'Sophocles', 'about 429 BC', 'The greatest Greek tragedy: a detective story where the detective is the culprit.', { free: true }),
  B(5, 'The King Must Die', 'Mary Renault', 1958, 'Theseus, the labyrinth and the bull-leapers of Crete, told as if it really happened.'),
  B(5, 'Medusa', 'Jessie Burton', 2021, 'The Gorgon tells her own story: a beautifully illustrated retelling for teenage readers.'),
  B(5, 'Percy Jackson’s Greek Gods', 'Rick Riordan', 2014, 'The Olympians’ own stories, told with Percy’s jokes: a great companion to her Greek.'),
  B(5, 'The Odyssey', 'Gillian Cross', 2012, 'A gripping retelling of the whole journey home, with striking illustrations by Neil Packer.'),
];

const RUNGS = ['Myths and adventures', 'Retellings and modern classics', 'Quests and detectives', 'Gothic and the classics', 'The ancient world and beyond'];

export default [{ subject: 'english', deck: 'y8-books', topics: [], items: [], ladder: LADDER, rungs: RUNGS }];

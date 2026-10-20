// Reading ladder for a confident Year 3 reader working at greater depth: from the top of the
// Year 2 ladder up to classics read together. Titles carried over from the Year 2 ladder keep
// their ids, so books already logged stay logged. (Suggestions to borrow or buy; no text included.)

const B = (rung, title, author, year, note, extra = {}) => ({ id: `book.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, rung, title, author, year, note, ...extra });

const LADDER = [
  B(1, 'The Twits', 'Roald Dahl', 1980, 'Disgusting and hilarious.'),
  B(1, 'The Iron Man', 'Ted Hughes', 1968, 'A giant metal man who saves the world.'),
  B(1, 'Kid Normal', 'Greg James and Chris Smith', 2017, 'A boy with no superpowers at superhero school.'),
  B(1, 'The Hundred-Mile-an-Hour Dog', 'Jeremy Strong', 1996, 'A very fast, very funny dog.'),
  B(1, 'Varjak Paw', 'S. F. Said', 2003, 'A cat learns a secret martial art to save his family.'),
  B(2, 'Charlie and the Chocolate Factory', 'Roald Dahl', 1964, 'A classic first longer novel.'),
  B(2, 'George’s Secret Key to the Universe', 'Lucy and Stephen Hawking', 2007, 'Space adventure with real science.'),
  B(2, 'The Lion Who Stole My Arm', 'Nicola Davies', 2013, 'A short, gripping adventure set in Mozambique.'),
  B(2, 'Fortunately, the Milk', 'Neil Gaiman', 2013, 'Dad’s trip to buy milk involves aliens, pirates and a time machine.'),
  B(2, 'Greek Myths for Young Children', 'Marcia Williams', 1991, 'Theseus, Icarus and friends as comic strips.'),
  B(3, 'The Wild Robot', 'Peter Brown', 2016, 'A robot washes up on a wild island and learns to survive.'),
  B(3, 'Danny the Champion of the World', 'Roald Dahl', 1975, 'A boy, his dad and a daring plan. Lots of cars and engines too!'),
  B(3, 'The Boy Who Grew Dragons', 'Andy Shepherd', 2018, 'A dragon fruit hatches a real, tiny dragon.'),
  B(3, 'The Last Firefox', 'Lee Newbery', 2022, 'A boy must protect a magical fox cub.'),
  B(3, 'The Story of Tutankhamun', 'Patricia Cleveland-Peck', 2021, 'History told as a story, for fans of Ancient Egypt.'),
  B(4, 'Just So Stories', 'Rudyard Kipling', 1902, 'He has met the Whale in Reading. Try “The Elephant’s Child” next.', { free: true }),
  B(4, 'The Jungle Book', 'Rudyard Kipling', 1894, 'Mowgli, the wolves, Baloo and Bagheera. Read it together at first.', { free: true }),
  B(4, 'Alice’s Adventures in Wonderland', 'Lewis Carroll', 1865, 'Strange, funny and full of word games.', { free: true }),
  B(4, 'Flat Stanley’s Worldwide Adventures: The Great Egyptian Grave Robbery', 'Jeff Brown', 2009, 'Flat Stanley visits the pyramids.'),
  B(4, 'Five Children and It', 'E. Nesbit', 1902, 'A grumpy Sand-fairy grants wishes that always go wrong.', { free: true }),
  B(5, 'The Wind in the Willows', 'Kenneth Grahame', 1908, 'Read aloud together: Toad loves fast motor cars!', { free: true }),
  B(5, 'The Lion, the Witch and the Wardrobe', 'C. S. Lewis', 1950, 'Read together: four evacuees find a magic land.'),
  B(5, 'Carrie’s War', 'Nina Bawden', 1973, 'Read together: evacuees in the Second World War.'),
  B(5, 'Black Beauty', 'Anna Sewell', 1877, 'A horse tells his own life story. Read together.', { free: true }),
  B(5, 'The Hobbit', 'J. R. R. Tolkien', 1937, 'Read aloud together: dragons, dwarves and a very brave hobbit.'),
];

const RUNGS = ['Confident chapter books', 'Longer stories', 'Big adventures', 'Classics to try', 'Read-together classics'];

export default [{ subject: 'reading', deck: 'y3-books', topics: [], items: [], ladder: LADDER, rungs: RUNGS }];

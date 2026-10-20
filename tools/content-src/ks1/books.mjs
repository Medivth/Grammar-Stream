// Reading ladder for a confident Year 2 reader: real books from first chapter books
// up to read-together classics. (Books are suggestions to borrow or buy; no text is included.)

const B = (rung, title, author, year, note, extra = {}) => ({ id: `book.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, rung, title, author, year, note, ...extra });

const LADDER = [
  B(1, 'Oi Frog!', 'Kes Gray', 2014, 'Rhyming silliness to read aloud.'),
  B(1, 'Fantastic Mr Fox', 'Roald Dahl', 1970, 'A short first chapter book.'),
  B(1, 'The Owl Who Was Afraid of the Dark', 'Jill Tomlinson', 1968, 'Gentle chapters about being brave.'),
  B(1, 'Flat Stanley', 'Jeff Brown', 1964, 'A boy squashed flat has adventures.'),
  B(1, 'The Tale of Peter Rabbit', 'Beatrix Potter', 1902, 'He has met this one in Reading!', { free: true }),
  B(2, 'The Hodgeheg', 'Dick King-Smith', 1987, 'A hedgehog with a plan.'),
  B(2, 'Mr Gum and the Biscuit Billionaire', 'Andy Stanton', 2007, 'Very funny, great vocabulary.'),
  B(2, 'The Iron Man', 'Ted Hughes', 1968, 'A giant metal man who saves the world.'),
  B(2, 'Claude in the City', 'Alex T. Smith', 2011, 'A dog in a beret has adventures.'),
  B(2, 'The Worst Witch', 'Jill Murphy', 1974, 'Mildred’s disastrous first year at witch school.'),
  B(3, 'The Twits', 'Roald Dahl', 1980, 'Disgusting and hilarious.'),
  B(3, 'Charlie and the Chocolate Factory', 'Roald Dahl', 1964, 'A classic first longer novel.'),
  B(3, 'The Enchanted Wood', 'Enid Blyton', 1939, 'The Faraway Tree’s magical lands.'),
  B(3, 'Dinosaur Cove: Attack of the Tyrannosaurus', 'Rex Stone', 2008, 'Dinosaur adventure for confident readers.'),
  B(3, 'Kid Normal', 'Greg James and Chris Smith', 2017, 'A boy with no superpowers at superhero school. Perfect for a superhero fan.'),
  B(4, 'The Hundred-Mile-an-Hour Dog', 'Jeremy Strong', 1996, 'A very fast, very funny dog.'),
  B(4, 'George’s Secret Key to the Universe', 'Lucy and Stephen Hawking', 2007, 'Space adventure with real science.'),
  B(4, 'The Velveteen Rabbit', 'Margery Williams', 1922, 'A classic about becoming “real”.', { free: true }),
  B(4, 'Just So Stories', 'Rudyard Kipling', 1902, 'Read together: “How the Elephant Got His Trunk”.', { free: true }),
  B(5, 'The Wind in the Willows', 'Kenneth Grahame', 1908, 'Read aloud together: Toad loves fast motor cars!', { free: true }),
  B(5, 'The Lion, the Witch and the Wardrobe', 'C. S. Lewis', 1950, 'Read together: four evacuees find a magic land.'),
  B(5, 'Carrie’s War', 'Nina Bawden', 1973, 'Read together: evacuees in the Second World War.'),
];

const RUNGS = ['First chapter books', 'Confident readers', 'Longer stories', 'Big reads', 'Read-together classics'];

export default [{ subject: 'reading', deck: 'books', topics: [], items: [], ladder: LADDER, rungs: RUNGS }];

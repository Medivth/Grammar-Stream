// The original (unaltered) texts in the library, converted from Standard Ebooks sources.
// Each recipe names the SE repository (pinned to the commit converted), which files or
// stories to take, and which whole chapters/stories are left out and why. Nothing inside a
// kept chapter is ever changed. Run: node tools/library/convert.mjs
//
// UK copyright: every author and translator below died before 1 January 1956, and every
// text was published before 1931 (US public domain). Dates are given beside each recipe.

const YOUNG = ['ks1', 'y3'];
const SE = 'Standard Ebooks (public domain)';
const potter = (file, extra) => ({
  repo: 'beatrix-potter_short-fiction', commit: '5feaeb53c922e2c0a41897f3cad6694d3eda690a',
  files: [file], author: 'Beatrix Potter', kind: 'original', courses: YOUNG, source: SE,
  sourceUrl: 'https://standardebooks.org/ebooks/beatrix-potter/short-fiction', ...extra,
});

// Beatrix Potter (1866–1943). Text only: her pictures are not included.
const POTTER_NOTE = 'Potter’s words in full; her pictures are not included, so a grown-up may like to show the illustrated book too.';

export const BOOKS = [
  potter('the-tale-of-peter-rabbit.xhtml', {
    id: 'potter-peter-rabbit', title: 'The Tale of Peter Rabbit', year: 1902, level: 'on-my-own',
    blurb: 'Peter squeezes under the gate into Mr. McGregor’s garden, though his mother told him not to. Can he get out again?', note: POTTER_NOTE,
  }),
  potter('the-tale-of-benjamin-bunny.xhtml', {
    id: 'potter-benjamin-bunny', title: 'The Tale of Benjamin Bunny', year: 1904, level: 'on-my-own',
    blurb: 'Peter’s cousin Benjamin takes him back into the garden to fetch his lost clothes, and they meet the cat.', note: POTTER_NOTE,
  }),
  potter('the-tale-of-squirrel-nutkin.xhtml', {
    id: 'potter-squirrel-nutkin', title: 'The Tale of Squirrel Nutkin', year: 1903, level: 'read-together',
    blurb: 'Cheeky Nutkin teases Old Brown the owl with riddles. Can you solve them before he does?', note: POTTER_NOTE,
  }),
  potter('the-tale-of-jemima-puddle-duck.xhtml', {
    id: 'potter-jemima-puddle-duck', title: 'The Tale of Jemima Puddle-Duck', year: 1908, level: 'on-my-own',
    blurb: 'Jemima wants to hatch her own eggs, and a very polite gentleman with sandy whiskers offers her a place to nest.', note: POTTER_NOTE,
  }),
  {
    ...potter(null, {}),
    files: ['the-tale-of-two-bad-mice.xhtml', 'the-tale-of-mrs-tiggy-winkle.xhtml', 'the-tale-of-mr-jeremy-fisher.xhtml', 'the-tale-of-tom-kitten.xhtml', 'the-tale-of-the-flopsy-bunnies.xhtml', 'the-tale-of-mrs-tittlemouse.xhtml', 'the-tale-of-johnny-town-mouse.xhtml'],
    id: 'potter-more-tales', title: 'More Tales from Beatrix Potter', year: 1904, level: 'on-my-own',
    blurb: 'Seven more little books: two naughty mice in a doll’s house, a hedgehog washerwoman, a frog who goes fishing, and more (1904–1918).',
    note: `Seven of Potter’s tales, each complete: The Tale of Two Bad Mice (1904), Mrs. Tiggy-Winkle (1905), Mr. Jeremy Fisher (1906), Tom Kitten (1907), The Flopsy Bunnies (1909), Mrs. Tittlemouse (1910) and Johnny Town-Mouse (1918). ${POTTER_NOTE}`,
  },
  // Rudyard Kipling (1865–1936).
  {
    repo: 'rudyard-kipling_just-so-stories', commit: 'c412fd7e9c4c604fb8360b9ec924ebd1cd10ee8a',
    id: 'kipling-just-so-stories', title: 'Just So Stories', author: 'Rudyard Kipling', year: 1902, kind: 'original', courses: YOUNG, level: 'read-together',
    blurb: 'How did the elephant get his trunk, and the camel his hump? Kipling’s funny, sing-song stories for his “Best Beloved”, best read aloud.',
    omit: [{ id: 'how-the-leopard-got-his-spots', title: 'How the Leopard Got His Spots', reason: 'it contains a racial slur and racial stereotyping' }],
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/rudyard-kipling/just-so-stories',
  },
  // Aesop, translated by V. S. Vernon Jones (Vernon Stanley Vernon-Jones, 1875–1955), 1912.
  {
    repo: 'aesop_fables_v-s-vernon-jones', commit: 'a755a47753e3aa6b97bff4378f60b2591356c6c9',
    id: 'aesop-fables', title: 'Aesop’s Fables', author: 'Aesop, translated by V. S. Vernon Jones', year: 1912, kind: 'original', courses: YOUNG, level: 'on-my-own',
    blurb: 'Short animal stories that each end with a lesson: the hare and the tortoise, the lion and the mouse, the boy who cried wolf, and more.',
    only: ['the-fox-and-the-grapes', 'the-goose-that-laid-the-golden-eggs', 'the-mice-in-council', 'the-fox-and-the-crow', 'the-lion-and-the-mouse', 'the-crow-and-the-pitcher', 'the-north-wind-and-the-sun', 'the-fox-and-the-stork', 'the-wolf-in-sheep-s-clothing', 'the-milkmaid-and-her-pail', 'the-bear-and-the-travellers', 'the-oak-and-the-reeds', 'the-shepherd-s-boy-and-the-wolf', 'the-fox-and-the-goat', 'the-farmer-and-his-sons', 'father-and-sons', 'the-dog-in-the-manger', 'the-boy-and-the-filberts', 'the-frogs-asking-for-a-king', 'the-dog-and-the-shadow', 'the-ox-and-the-frog', 'hercules-and-the-wagoner', 'the-hare-and-the-tortoise', 'the-two-pots', 'the-town-mouse-and-the-country-mouse', 'the-grasshopper-and-the-ants', 'the-wolf-and-the-crane'],
    onlyNote: 'A selection of 27 of the 284 fables in Vernon Jones’s translation, each complete.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/aesop/fables/v-s-vernon-jones',
  },
  // Oscar Wilde (1854–1900). In place of The Velveteen Rabbit (1922), which Standard Ebooks does not have.
  {
    repo: 'oscar-wilde_childrens-stories', commit: '782adad3c52d0a5dca0a0b229e668bfe6c3793b8',
    id: 'wilde-selfish-giant', title: 'The Selfish Giant and Other Tales', author: 'Oscar Wilde', year: 1888, kind: 'original', courses: YOUNG, level: 'read-together',
    blurb: 'A giant who shuts the children out of his garden, a rocket who thinks he is the most important firework in the world, and more fairy tales to share.',
    files: ['the-selfish-giant.xhtml', 'the-nightingale-and-the-rose.xhtml', 'the-devoted-friend.xhtml', 'the-remarkable-rocket.xhtml'],
    onlyNote: 'Four stories from Wilde’s The Happy Prince and Other Tales (1888), each complete. The Happy Prince itself is left out because one sentence uses an old stereotype of Jewish people and money; Wilde’s second book of tales, A House of Pomegranates, is left out as too dark and adult for this age.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/oscar-wilde/childrens-stories',
  },

  // --- Year 6 ----------------------------------------------------------------------------
  // Arthur Conan Doyle (1859–1930).
  {
    repo: 'arthur-conan-doyle_the-adventures-of-sherlock-holmes', commit: 'aa72aa10db4dc88e2f7773e601bb14674662fd06', label: 'Part',
    id: 'doyle-adventures-of-sherlock-holmes', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'Eight of the great detective’s cases, told by his friend Dr. Watson: a league of red-headed men, a goose with a jewel inside it, and a whistle in the night.',
    omit: [
      { id: 'a-case-of-identity', title: 'A Case of Identity', reason: 'a stepfather secretly courts his stepdaughter in disguise, which is unsettling for this age' },
      { id: 'the-five-orange-pips', title: 'The Five Orange Pips', reason: 'it turns on the Ku Klux Klan and a character’s hatred of Black voters' },
      { id: 'the-man-with-the-twisted-lip', title: 'The Man with the Twisted Lip', reason: 'it opens in an opium den and leans on a racial stereotype of its “Lascar” keeper' },
      { id: 'the-adventure-of-the-engineers-thumb', title: 'The Adventure of the Engineer’s Thumb', reason: 'its central injury is described in gory detail' },
    ],
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes',
  },
  // Lewis Carroll (1832–1898).
  {
    repo: 'lewis-carroll_alices-adventures-in-wonderland_john-tenniel', commit: '60e942b4f9dba672841470e9b6ec63956bfb8e7d',
    id: 'carroll-alice-in-wonderland', title: 'Alice’s Adventures in Wonderland', author: 'Lewis Carroll', year: 1865, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'Alice follows a White Rabbit down a rabbit-hole into a world of mad tea-parties, a grinning cat and a furious Queen.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/john-tenniel',
  },
  // Kenneth Grahame (1859–1932).
  {
    repo: 'kenneth-grahame_the-wind-in-the-willows', commit: 'd2ab18d63ae1a3bdb691f7fd942982c175c46c26',
    id: 'grahame-wind-in-the-willows', title: 'The Wind in the Willows', author: 'Kenneth Grahame', year: 1908, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'Mole, Ratty and Badger mess about on the river, and try to save the boastful, motor-car-mad Toad from himself.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/kenneth-grahame/the-wind-in-the-willows',
  },
  // Robert Louis Stevenson (1850–1894).
  {
    repo: 'robert-louis-stevenson_treasure-island', commit: '86380ddddb73e7b22a41405cf8b70e72bcaf2d30',
    id: 'stevenson-treasure-island', title: 'Treasure Island', author: 'Robert Louis Stevenson', year: 1883, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'Young Jim Hawkins finds a pirate’s map and sails for buried treasure, with the one-legged sea-cook Long John Silver aboard.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/robert-louis-stevenson/treasure-island',
  },
  // E. Nesbit (1858–1924).
  {
    repo: 'e-nesbit_the-railway-children', commit: '9e1cdbca6205bbbbb6dad66fc1a35ce27f795498',
    id: 'nesbit-railway-children', title: 'The Railway Children', author: 'E. Nesbit', year: 1906, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'When Father is taken away, Roberta, Peter and Phyllis move to a cottage by the railway, wave to the trains, and save one from disaster.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/e-nesbit/the-railway-children',
  },
  // Charles Dickens (1812–1870).
  {
    repo: 'charles-dickens_a-christmas-carol', commit: 'fbcca8acb37169bbb560b8796c1f05b0240f6792',
    id: 'dickens-christmas-carol', title: 'A Christmas Carol', author: 'Charles Dickens', year: 1843, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'On Christmas Eve the miser Ebenezer Scrooge is visited by his dead partner’s ghost, and by three spirits.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/charles-dickens/a-christmas-carol',
  },
  // Anna Sewell (1820–1878).
  {
    repo: 'anna-sewell_black-beauty', commit: 'f7941a0d25fc376985e595cdf58a5ecd95d82b4c',
    id: 'sewell-black-beauty', title: 'Black Beauty', author: 'Anna Sewell', year: 1877, kind: 'original', courses: ['y6'], level: 'on-my-own',
    blurb: 'A horse tells his own life story, from a happy country childhood to hard years pulling a London cab.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/anna-sewell/black-beauty',
  },

  // --- Year 8 ----------------------------------------------------------------------------
  {
    repo: 'arthur-conan-doyle_the-hound-of-the-baskervilles', commit: '0097160e42afc58fa86337b8496de440267cf831',
    id: 'doyle-hound-of-the-baskervilles', title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', year: 1902, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'A legend of a spectral hound, a death on Dartmoor, and Holmes and Watson’s most famous case.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/arthur-conan-doyle/the-hound-of-the-baskervilles',
  },
  // Thomas Bulfinch (1796–1867); Standard Ebooks follows the 1913 edition, whose few added notes are by an unnamed editor. In place of Kingsley's The Heroes / Hawthorne's Tanglewood Tales, which Standard Ebooks does not have.
  {
    repo: 'thomas-bulfinch_bulfinchs-mythology', commit: 'b36e7beba2b93c1f1dc5a32ee3ba6d2c5353bdfe', splitLevel: 3,
    id: 'bulfinch-age-of-fable', title: 'The Age of Fable: Stories of Gods and Heroes', author: 'Thomas Bulfinch', year: 1855, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'The Greek and Roman myths retold for readers of poetry: Prometheus, Proserpine, Theseus, the Golden Fleece, the fall of Troy and the wanderings of Ulysses and Aeneas (Bulfinch uses the Roman names).',
    files: Array.from({ length: 33 }, (_, i) => `chapter-1-${i + 1}.xhtml`).filter((f) => f !== 'chapter-1-15.xhtml'),
    onlyNote: 'Chapters I–XXXIII of The Age of Fable, the Greek and Roman myths (the later chapters on Egyptian, Eastern, Norse and Druid lore, and Bulfinch’s other books on King Arthur and Charlemagne, are not included). Chapter XV (Perseus and Medusa) is left out because Bulfinch adds a racist aside about Cassiopeia’s skin colour. The text follows the 1913 edition, which adds a few notes by a later editor (for example on Schliemann’s excavations at Troy).',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/thomas-bulfinch/bulfinchs-mythology',
  },
  // Homer, translated by William Cullen Bryant (1794–1878), blank verse 1871–72. Standard Ebooks has no prose Odyssey (Butler's is not there).
  {
    repo: 'homer_the-odyssey_william-cullen-bryant', commit: 'a68784a6aaf1e9e0267362baa6ffe54f2c1260de', label: '',
    id: 'homer-odyssey', title: 'The Odyssey', author: 'Homer, translated by William Cullen Bryant', year: 1871, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'Odysseus’s ten-year voyage home from Troy, past the Cyclops, Circe and the Sirens, while suitors crowd his palace. In flowing blank verse.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/homer/the-odyssey/william-cullen-bryant',
  },
  {
    repo: 'robert-louis-stevenson_the-strange-case-of-dr-jekyll-and-mr-hyde', commit: 'bb6ccb4d19e94d71588dbacbd3a48aa6cd1846ed',
    id: 'stevenson-jekyll-and-hyde', title: 'Strange Case of Dr. Jekyll and Mr. Hyde', author: 'Robert Louis Stevenson', year: 1886, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'The lawyer Utterson wants to know why his respectable friend Dr. Jekyll has left everything to the brutal Mr. Hyde.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/robert-louis-stevenson/the-strange-case-of-dr-jekyll-and-mr-hyde',
  },
  // Mary Shelley (1797–1851). Standard Ebooks gives the 1831 revised text.
  {
    repo: 'mary-shelley_frankenstein', commit: '3909a2b9d956377e797e235562cd237d3667fa9b', splitLevel: 2,
    id: 'shelley-frankenstein', title: 'Frankenstein; or, The Modern Prometheus', author: 'Mary Shelley', year: 1818, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'A young scientist gives life to a creature he has built, then abandons it. Told in letters from an Arctic expedition.',
    onlyNote: 'The 1831 revised text (first published 1818).',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/mary-shelley/frankenstein',
  },
  // Jane Austen (1775–1817).
  {
    repo: 'jane-austen_pride-and-prejudice', commit: 'ed94a32be3e875c0814568050c7544e03aad3ef5',
    id: 'austen-pride-and-prejudice', title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'Elizabeth Bennet and the proud Mr. Darcy get each other completely wrong.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice',
  },
  {
    repo: 'charles-dickens_a-tale-of-two-cities', commit: 'eb26cc8fb7d2769d7843f66b4bc7190fd1217604',
    id: 'dickens-tale-of-two-cities', title: 'A Tale of Two Cities', author: 'Charles Dickens', year: 1859, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'London and Paris before and during the French Revolution: a prisoner recalled to life, a family in danger, and a great sacrifice.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/charles-dickens/a-tale-of-two-cities',
  },
  // H. G. Wells (1866–1946).
  {
    repo: 'h-g-wells_the-war-of-the-worlds', commit: '7c2c332ce1ce8025d07ec982b02dad293dc63671',
    id: 'wells-war-of-the-worlds', title: 'The War of the Worlds', author: 'H. G. Wells', year: 1898, kind: 'original', courses: ['y8'], level: 'on-my-own',
    blurb: 'A cylinder lands on Horsell Common, and the Martians inside begin their conquest of Surrey and London.',
    source: SE, sourceUrl: 'https://standardebooks.org/ebooks/h-g-wells/the-war-of-the-worlds',
  },
];

/** Death years of each book's modern author or translator (UK copyright runs 70 years from the end of that year). */
export const DIED = {
  'potter-peter-rabbit': { 'Beatrix Potter': 1943 },
  'potter-benjamin-bunny': { 'Beatrix Potter': 1943 },
  'potter-squirrel-nutkin': { 'Beatrix Potter': 1943 },
  'potter-jemima-puddle-duck': { 'Beatrix Potter': 1943 },
  'potter-more-tales': { 'Beatrix Potter': 1943 },
  'kipling-just-so-stories': { 'Rudyard Kipling': 1936 },
  'aesop-fables': { 'V. S. Vernon Jones (translator)': 1955 },
  'wilde-selfish-giant': { 'Oscar Wilde': 1900 },
  'doyle-adventures-of-sherlock-holmes': { 'Arthur Conan Doyle': 1930 },
  'carroll-alice-in-wonderland': { 'Lewis Carroll': 1898 },
  'grahame-wind-in-the-willows': { 'Kenneth Grahame': 1932 },
  'stevenson-treasure-island': { 'Robert Louis Stevenson': 1894 },
  'nesbit-railway-children': { 'E. Nesbit': 1924 },
  'dickens-christmas-carol': { 'Charles Dickens': 1870 },
  'sewell-black-beauty': { 'Anna Sewell': 1878 },
  'doyle-hound-of-the-baskervilles': { 'Arthur Conan Doyle': 1930 },
  'bulfinch-age-of-fable': { 'Thomas Bulfinch': 1867 },
  'homer-odyssey': { 'William Cullen Bryant (translator)': 1878 },
  'stevenson-jekyll-and-hyde': { 'Robert Louis Stevenson': 1894 },
  'shelley-frankenstein': { 'Mary Shelley': 1851 },
  'austen-pride-and-prejudice': { 'Jane Austen': 1817 },
  'dickens-tale-of-two-cities': { 'Charles Dickens': 1870 },
  'wells-war-of-the-worlds': { 'H. G. Wells': 1946 },
};

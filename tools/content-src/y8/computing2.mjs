// Year 8 computing, part 2: deeper programming (functions, dictionaries, strings, grids,
// validation, files, randomness, bug hunting), algorithms (tracing, efficiency, stacks and
// queues), data (compression, encryption, databases), the internet and the web, AI, inside the
// CPU, operating systems, and the law; GCSE tasters (recursion, shortest paths, logic circuits,
// Huffman coding). Practice that never runs out comes from js/gen/y8computing2.js.
// Examples are themed on Greek myth with classical figures and original characters (Mira, Theo, Kit).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `computing.m.${id}`, topic: `computing.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `computing.m.${id}`, topic: `computing.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, labels, explain) => ({ id: `computing.m.${id}`, topic: `computing.${topic}`, kind: 'order', prompt, items, labels, explain });
const tmpl = (id, topic, gen, seed = [-1, 0, 1]) => ({ id: `computing.m.${id}`, topic: `computing.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed });
const written = (id, topic, prompt, hints, model, extra = {}) => ({ id: `computing.m.${id}`, topic: `computing.${topic}`, kind: 'written', prompt, hints, model, words: [40, 200], ...extra });
const C = { formats: ['choice'] };
const code = (...lines) => '```\n' + lines.join('\n') + '\n```';
const T = (id, title, kind, prereqs, intro, teach, talk, extra = {}) => ({ id: `computing.${id}`, title, kind, prereqs: prereqs.map((p) => `computing.${p}`), batch: 5, intro, teach, talk, ...extra });

const topics = [
  T('functions', 'Functions: parameters, return and scope', 'mixed', ['lists'], 'A function is a named, reusable block of code. You pass values in through parameters and get a result back with return. Variables made inside a function are local: they vanish when it ends, which stops one part of a program accidentally breaking another.', 'Explain the difference between a parameter and an argument.', 'Ask {him} which jobs in a game {she} would turn into functions.'),
  T('dicts', 'Dictionaries', 'mixed', ['lists'], 'A dictionary stores pairs: a key and its value, like a word and its meaning, or a god and their symbol. Instead of remembering a position, you look things up by name.', 'Explain when a dictionary is better than a list.', 'Ask {him} how {she} would store everyone’s phone numbers in Python.'),
  T('strings', 'Strings: methods, slicing and f-strings', 'mixed', ['lists'], 'Strings come with built-in methods: count, find, replace, split, join. Slicing picks out parts, and f-strings drop values neatly into text. Most real programs spend a lot of time handling text.', 'Explain what split() and join() do.', 'Ask {him} to reverse a word in Python in one line.'),
  T('grids', 'Nested loops and 2D lists', 'mixed', ['loops', 'lists'], 'A list of lists makes a grid: a game board, a seating plan, Daedalus’s labyrinth or the pixels of an image. A loop inside a loop visits every square, row by row.', 'Explain how grid[2][3] finds one square.', 'Draw a 3 × 3 noughts-and-crosses board as a Python list of lists together.'),
  T('robust', 'Validation and robust programs', 'mixed', ['debugging'], 'Users type the strangest things. Robust programs check input (validation), confirm it was entered correctly (verification), and are tested with normal, boundary and erroneous data so they never crash.', 'Explain the difference between validation and verification.', 'Ask {him} what checks a sign-up form should make.'),
  T('files', 'Files: saving and loading data', 'facts', ['strings'], 'Variables disappear when a program ends. To keep high scores or settings, programs write data to files and read it back next time. Opening a file the wrong way can wipe it, so the mode matters.', 'Explain the difference between opening a file with "w" and with "a".', 'Ask {him} which apps on {her} phone must save data to files.'),
  T('random', 'Random numbers and simulations', 'facts', ['loops'], 'Games, simulations and encryption all need randomness. Python’s random module can roll dice, shuffle cards or pick a hero, and a simulation can repeat an experiment thousands of times in a second.', 'Explain why computer “random” numbers are really pseudo-random.', 'Ask {him} how a simulation could estimate the chance of rolling a double six.'),
  T('bughunt', 'Bug hunting: harder debugging', 'mixed', ['debugging', 'functions'], 'Logic errors are the hardest bugs: the program runs, but the answer is wrong. Good debuggers compare what the program does with what it should do, then find the exact line where they part ways.', 'Explain what an off-by-one error is.', 'Show {him} a bug from your own work and ask how {she} would find it.'),
  T('algotrace', 'Tracing algorithms step by step', 'mixed', ['searching', 'sorting'], 'Knowing the name of an algorithm is not enough: you need to be able to follow it step by step, like a computer would. Trace tables and careful notes make it reliable.', 'Explain the steps of a binary search for one number.', 'Ask {him} to sort a shuffled hand of cards using insertion sort and narrate it.'),
  T('efficiency', 'Algorithm efficiency', 'mixed', ['algotrace'], 'Two algorithms can give the same answer but take wildly different times. Computer scientists count steps and describe how the work grows as the data grows, using Big-O notation: O(n), O(n²), O(log n).', 'Explain why an O(n²) algorithm gets slow on big lists.', 'Ask {him} how many handshakes there are if everyone in a class shakes hands once.'),
  T('structures', 'Stacks, queues and arrays', 'mixed', ['lists'], 'A stack is last in, first out, like a pile of plates. A queue is first in, first out, like the line at a ticket office. These simple structures power undo buttons, printers and even how a program calls functions.', 'Explain the difference between a stack and a queue, with an example of each.', 'Ask {him} whether the “back” button in a web browser is a stack or a queue.'),
  T('compression', 'Compression', 'mixed', ['media'], 'Compression makes files smaller so they download faster and take less space. Lossless compression gives back exactly the original; lossy compression throws away detail people will not notice.', 'Explain the difference between lossy and lossless compression.', 'Compare the file size of a photo and a screenshot on your phone together.'),
  T('encryption', 'Encryption: Vigenère and public keys', 'mixed', ['security'], 'The Caesar cipher has only 25 keys, so it is easy to crack. The Vigenère cipher uses a key word, so each letter is shifted by a different amount. Modern public-key encryption lets strangers send secrets without ever meeting to share a key.', 'Explain why the Vigenère cipher is harder to crack than the Caesar cipher.', 'Send each other a Vigenère message at dinner.'),
  T('internet', 'How the internet works', 'facts', ['networks'], 'When you visit a website, your device asks a DNS server for the site’s IP address, then sends a request in packets that hop between routers across the world. The answer comes back the same way, often in under a second.', 'Explain what happens, step by step, when you type a web address.', 'Ask {him} how a message gets from your house to a server in another country.'),
  T('web', 'The web: HTML and CSS', 'mixed', ['internet'], 'Every web page is made of HTML (the structure and content), CSS (the style) and often JavaScript (the behaviour). Reading markup is like reading the scaffolding behind the page.', 'Explain the jobs of HTML and CSS.', 'Open “view source” on a simple web page together and find the <h1>.'),
  T('databases', 'Databases in depth', 'mixed', ['lists'], 'Databases answer questions about huge amounts of data in moments. SQL can count, total, sort and search, and a primary key makes sure every record can be found exactly.', 'Explain what COUNT(*) and ORDER BY do.', 'Ask {him} what tables a school database would need.'),
  T('ai', 'Artificial intelligence and machine learning', 'facts', ['ethics'], 'Machine learning systems are not programmed with rules: they learn patterns from huge amounts of training data. That makes them powerful, and also means they can copy the mistakes and biases in the data.', 'Explain how bias can get into an AI system.', 'Ask {him} where {she} has met AI today, and whether it was always right.'),
  T('architecture', 'Inside the CPU', 'mixed', ['hardware'], 'Inside the CPU, a clock ticks billions of times a second, registers hold the values being worked on, and fast cache memory keeps useful data close. More cores let a CPU work on several things at once.', 'Explain three things that affect how fast a CPU is.', 'Look up the clock speed and number of cores of a device at home.'),
  T('os', 'Operating systems and utilities', 'facts', ['software'], 'The operating system is the manager: it shares out memory and processor time, talks to devices through drivers, keeps files organised and keeps users apart. Utilities are small programs that look after the computer.', 'Explain three jobs an operating system does.', 'Ask {him} which operating systems are on the devices in your home.'),
  T('law', 'Law, ethics and the environment in depth', 'facts', ['ethics', 'ai'], 'Technology changes lives, so laws and ethics matter: who may use your data, what counts as hacking, who owns a piece of music, and what happens to the millions of devices thrown away every year.', 'Explain one principle of the Data Protection Act.', 'Ask {him} what {she} would put in a law about AI.'),
  // GCSE tasters
  T('recursion', 'Recursion', 'mixed', ['functions'], 'A recursive function calls itself, each time on a smaller problem, until it reaches a base case it can answer directly. Like Russian dolls, or a hall of mirrors.', 'Explain why every recursive function needs a base case.', 'Ask {him} to explain recursion using a recursive explanation.', { tier: 'stretch' }),
  T('paths', 'Graphs and shortest paths', 'mixed', ['algotrace'], 'A graph is a set of places (nodes) joined by routes (edges), sometimes with distances. Breadth-first search finds the fewest steps through a labyrinth; Dijkstra’s algorithm finds the shortest weighted route, as a sat nav does.', 'Explain how breadth-first search finds the shortest route out of a maze.', 'Plan the quickest route between three places in town, as a graph.', { tier: 'stretch' }),
  T('circuits', 'Logic circuits and Boolean expressions', 'mixed', ['logic'], 'Logic gates combine into circuits, and circuits can be written as Boolean expressions like (A AND B) OR C. A truth table proves exactly what a circuit does for every possible input.', 'Explain how to build a truth table for a three-input expression.', 'Ask {him} to design a circuit for a door alarm.', { tier: 'stretch' }),
  T('huffman', 'Huffman coding', 'mixed', ['compression'], 'Huffman coding gives the most common characters the shortest codes, so text takes fewer bits. No code is the start of another, so a stream of bits can be read without gaps.', 'Explain why common letters get short Huffman codes.', 'Count the commonest letter in a page of a book together.', { tier: 'stretch' }),
];

const items = [
  // --- functions
  tmpl('fn.tmpl', 'functions', 'y8dFunctions'),
  mcq('fn.param', 'functions', `In this code, what is \`ships\`?\n${code('def launch(ships):', '    return ships * 2', '', 'print(launch(50))')}`, [['A parameter: the name for the value passed in', true], ['An argument: the actual value, 50, that is passed in', false, 'The argument is 50; ships is the parameter that receives it.'], ['A global variable that the whole program can use', false, 'It only exists inside the function.']], 'Parameters are the names in the def line; arguments are the values you pass when you call the function.'),
  mcq('fn.return', 'functions', 'What does return do?', [['Ends the function and sends a value back', true], ['Prints the value on the screen, then carries on', false, 'return does not print; the caller decides what to do with the value.'], ['Restarts the function from its first line', false, 'It ends the function.']], 'A function can calculate something and hand it back, so the result can be used in further calculations.'),
  mcq('fn.local', 'functions', 'Why are variables inside a function local?', [['So functions can’t accidentally change each other’s variables', true], ['To save electricity', false, 'It is about keeping parts of a program separate and safe.'], ['Because Python can only keep one variable of each name in memory', false, 'Python can store millions.']], 'Local variables keep functions self-contained, so each one can be written and tested on its own.'),
  fact('fn.keyword', 'functions', 'Which Python keyword starts the definition of a function?', 'def', ['func', 'function', 'define'], 'def is short for define: def name(parameters):', { accept: ['def'] }),
  mcq('fn.why', 'functions', 'Theo writes the same twelve lines to check an answer in five different places. What is the best improvement?', [['Put the twelve lines in a function and call it five times', true], ['Copy and paste them more carefully, checking each one', false, 'If there is a bug, he would have to fix it in five places.'], ['Delete four of the checks so the code is shorter', false, 'The checks are needed; they just should not be repeated.']], 'Functions avoid repetition: write once, fix once, reuse many times.'),
  fact('fn.builtin', 'functions', 'print(), len() and input() are functions that come with Python. What are they called?', 'built-in functions', ['user-defined functions', 'local functions', 'recursive functions'], 'Built-in functions are always available; user-defined ones are those you write with def.', C),
  written('fn.w', 'functions', 'Mira is writing a quiz game about Greek heroes. Explain two advantages of breaking her program into functions such as ask_question() and update_score().', ['Name at least two advantages (reuse, easier testing, easier to read, teamwork, fixing bugs in one place)', 'Link each advantage to her quiz game', 'Use the words parameter or return if you can'], 'Breaking the quiz into functions means code is written once and reused: ask_question() can be called for every question, with the question passed in as a parameter, instead of copying the same lines again and again. If there is a bug, she fixes it in one place. Functions also make the program easier to test and read: she can check that update_score() returns the right total on its own before joining everything together, and anyone reading the code can see the structure from the function names.'),

  // --- dictionaries
  tmpl('dc.tmpl', 'dicts', 'y8dDicts'),
  mcq('dc.best', 'dicts', 'Which job suits a dictionary best?', [['Looking up each god’s symbol by the god’s name', true], ['Storing the order in which heroes finished a race', false, 'Order matters there, so a list is better.'], ['Counting from 1 to 100', false, 'That is a job for a loop.']], 'Dictionaries are for looking things up by a key, like a real dictionary looks up words.'),
  fact('dc.key', 'dicts', 'In {"Zeus": "thunderbolt"}, what is "Zeus" called?', 'the key', ['the value', 'the index', 'the parameter'], 'Each pair is key: value. "thunderbolt" is the value.', { accept: ['key', 'a key'] }),
  mcq('dc.unique', 'dicts', 'A dictionary already has the key "Hera". What happens after power["Hera"] = 50?', [['Hera’s old value is replaced with 50', true], ['A second "Hera" key is added after the first', false, 'Keys are unique: there can only be one "Hera".'], ['An error happens', false, 'Assigning to an existing key just updates it.']], 'Keys in a dictionary are unique, so assigning to an existing key overwrites its value.'),
  mcq('dc.missing', 'dicts', `What happens when this runs?\n${code('symbols = {"Athena": "owl"}', 'print(symbols["Ares"])')}`, [['An error (KeyError), because "Ares" is not a key', true], ['It prints owl, the only value in the dictionary', false, 'Only Athena is in the dictionary.'], ['It prints None, because Ares has no value yet', false, 'Python raises a KeyError for a missing key.']], 'Check with "Ares" in symbols first, or use symbols.get("Ares").'),
  fact('dc.braces', 'dicts', 'Which brackets does Python use to create a dictionary?', 'curly brackets { }', ['square brackets [ ]', 'round brackets ( )', 'angle brackets < >'], 'Lists use [ ], tuples use ( ), dictionaries use { }.', C),

  // --- strings
  tmpl('st.tmpl', 'strings', 'y8dStrings'),
  mcq('st.immut', 'strings', `Why does this cause an error?\n${code('name = "Medusa"', 'name[0] = "J"')}`, [['Strings can’t be changed in place; make a new one instead', true], ['Medusa is a protected word that Python reserves', false, 'Python does not know about Gorgons!'], ['The index should be 1, because strings start at 1', false, 'Index 0 is the first letter; the problem is changing it.']], 'Strings are immutable. Make a new one instead: name = "J" + name[1:].'),
  mcq('st.cast', 'strings', `What does this print?\n${code('age = 13', 'print("Mira is " + str(age))')}`, [['Mira is 13', true], ['An error', false, 'str(age) turns 13 into the text "13", so + can join them.'], ['Mira is age', false, 'The variable is used, not its name.']], 'You cannot join a string and a number with +, so str() converts the number first.'),
  fact('st.len', 'strings', 'Which function gives the number of characters in a string?', 'len()', ['count()', 'size()', 'length()'], 'len("Hermes") is 6.', { accept: ['len'] }),
  mcq('st.split', 'strings', 'What does "Zeus,Hera,Ares".split(",") give?', [['["Zeus", "Hera", "Ares"]', true], ['["Zeus", ",", "Hera", ",", "Ares"]', false, 'split removes the commas: they are not kept as items.'], ['["Zeus,Hera,Ares"]', false, 'split cuts at every comma, so each name becomes its own item.']], 'split(",") breaks the string at each comma into a list: handy for reading CSV files.'),

  // --- grids
  tmpl('gr.tmpl', 'grids', 'y8dGrids'),
  mcq('gr.order', 'grids', 'In grid[r][c], what do r and c choose?', [['r chooses the row, then c the column', true], ['r chooses the column, then c the row', false, 'The first index picks a whole inner list: a row.'], ['They are added together to give one position', false, 'They are two separate indexes.']], 'grid[r] is one row (a list); grid[r][c] is one item in that row.'),
  mcq('gr.inner', 'grids', 'An outer loop runs 4 times and an inner loop runs 6 times for each. How many times does the code inside the inner loop run?', [['24', true], ['10', false, 'The inner loop runs completely for EVERY outer loop: 4 × 6.'], ['6', false, 'That is for one outer loop.']], 'Nested loops multiply: 4 × 6 = 24.'),
  mcq('gr.image', 'grids', 'Why is a 2D list a good way to store a black-and-white image?', [['Its rows and columns match the picture’s pixels', true], ['Images can only be stored as dictionaries', false, 'Grids map naturally onto rows and columns of pixels.'], ['It compresses the image so it takes up less space', false, 'Storing it in a grid does not throw away detail.']], 'Images are grids of pixels, so a list of lists fits them exactly.'),
  fact('gr.count', 'grids', 'How many items are in a grid with 8 rows of 8 squares, like a chessboard?', '64', ['16', '32', '88'], '8 × 8 = 64.'),

  // --- validation and robustness
  tmpl('rb.tmpl', 'robust', 'y8dValidate'),
  mcq('rb.valver', 'robust', 'What is the difference between validation and verification?', [['Validation checks data is sensible; verification checks it was entered correctly', true], ['They mean the same thing', false, 'Validation: is it reasonable? Verification: is it what was meant?'], ['Verification checks data is sensible; validation checks it was entered correctly', false, 'It is the other way round.']], 'A date of 31/02 fails validation. Typing your email twice to make sure it matches is verification.'),
  mcq('rb.checks', 'robust', 'Which validation check makes sure a field is not left empty?', [['A presence check', true], ['A range check', false, 'A range check tests the value is between two limits.'], ['A length check', false, 'A length check tests how many characters there are.']], 'Presence, range, length, type and format checks are the main kinds of validation.'),
  mcq('rb.format', 'robust', 'A postcode must look like letters, then digits, then a space, then a digit and two letters. Which check is this?', [['A format check', true], ['A presence check', false, 'That only checks something was entered.'], ['A range check', false, 'Postcodes are not numbers in a range.']], 'A format check compares input with a pattern.'),
  mcq('rb.valid', 'robust', 'A form refuses a birth year of 2079 but accepts 2011 when the user meant 2012. What does this show?', [['Validation can stop impossible data, but can’t prove it is true', true], ['Validation guarantees that all data entered is correct', false, 'A sensible but wrong year still passes.'], ['Validation slows programs down too much to use', false, 'Checks are tiny compared with the cost of bad data.']], 'Validation reduces errors; it cannot know what is true.'),
  mcq('rb.auth', 'robust', 'Asking for a password before letting someone see their account is an example of…', [['authentication', true], ['validation', false, 'Validation checks data is sensible.'], ['compression', false, 'Compression makes files smaller.']], 'Authentication checks who a user is, using passwords, codes or fingerprints.'),
  written('rb.w', 'robust', 'Evaluate this password policy for a school website: “Passwords must be 6 letters long. Users must change their password every week, and may write it on a sticky note.”', ['Judge each part of the policy, not just one', 'Explain why length and variety matter (brute-force and guessing attacks)', 'Explain the human problem with weekly changes and sticky notes', 'Suggest a better policy'], 'The policy is weak. Six letters is far too short: a computer can try every combination quickly in a brute-force attack, and letters only gives fewer possibilities than mixing letters, digits and symbols. Weekly changes sound secure but make people choose simple, predictable passwords, and allowing sticky notes means anyone walking past can read them. A better policy would require long passphrases (for example three random words and a number), no forced weekly changes, a lock-out after several wrong attempts, and two-factor authentication, while never writing the password down where others can see it.'),

  // --- files
  mcq('fl.why', 'files', 'Why do programs save data to files?', [['Variables are lost when a program ends; files keep the data', true], ['Files make programs run faster than variables do', false, 'Reading files is actually slower than using variables.'], ['Python cannot keep more than 100 values in variables', false, 'It can; they just do not last after the program closes.']], 'Saving to a file (or database) is how high scores, documents and settings survive.'),
  mcq('fl.w', 'files', 'Theo opens his high-score file with open("scores.txt", "w") and writes one new score. What happens to the old scores?', [['They are wiped: "w" mode creates a fresh, empty file', true], ['The new score is added to the end of the old ones', false, 'That is "a" (append) mode.'], ['Nothing is written, because the file already exists', false, 'The new score is written, but the old ones are gone.']], '"r" reads, "w" overwrites, "a" appends. Choosing the wrong mode is a classic bug.'),
  fact('fl.a', 'files', 'Which file mode adds new data to the END of an existing file?', 'a (append)', ['w (write)', 'r (read)', 'e (end)'], 'Append keeps what is there and adds to it.', C),
  mcq('fl.close', 'files', 'Why should a program close a file (or use with open(...) as f:)?', [['So the data is properly saved and the file is released', true], ['To delete the file once the program has finished', false, 'Closing does not delete anything.'], ['To compress the file so it takes less space', false, 'Closing is not compression.']], 'The with statement closes the file automatically, even if an error happens.'),
  mcq('fl.csv', 'files', 'A CSV file stores “Perseus,Medusa,3” on one line. What does CSV stand for?', [['Comma-separated values', true], ['Computer stored values', false, 'The C is for comma.'], ['Coded secret values', false, 'CSV files are plain text, not secret.']], 'Each line is a record and the commas separate the fields. Spreadsheets can open CSV files.'),
  mcq('fl.loop', 'files', `A file oracle.txt has 5 lines. What does this program print?\n${code('count = 0', 'with open("oracle.txt") as f:', '    for line in f:', '        count = count + 1', 'print(count)')}`, [['5', true], ['1', false, 'The loop runs once for each line.'], ['0', false, 'The file is opened for reading, so its lines are read.']], 'Looping over a file object gives one line at a time.'),

  // --- random
  mcq('rd.randint', 'random', 'Which values can random.randint(1, 6) give?', [['1, 2, 3, 4, 5 or 6', true], ['1, 2, 3, 4 or 5 only', false, 'randint includes BOTH ends, unlike range.'], ['0 to 6', false, 'It starts at 1 here.']], 'randint(a, b) includes a and b, which is why it is perfect for dice.'),
  mcq('rd.choice', 'random', 'What does random.choice(["Zeus", "Hera", "Ares"]) do?', [['Picks one of the three names at random', true], ['Picks all three, in a random order', false, 'It picks one.'], ['Always picks the first name in the list', false, 'That would not be random!']], 'random.choice picks one item from a list at random.'),
  mcq('rd.pseudo', 'random', 'Why are computer “random” numbers called pseudo-random?', [['They come from a formula, so the same seed repeats them', true], ['They are always slightly biased towards even numbers', false, 'They can be any value in the range.'], ['They are typed in by a person in advance', false, 'A formula produces them.']], 'A pseudo-random generator is deterministic but looks random. For encryption, computers mix in real-world noise as well.'),
  mcq('rd.sim', 'random', 'Kit simulates 10,000 dice rolls and counts the sixes. About how many should he expect?', [['About 1,667', true], ['Exactly 1,000', false, 'One in six of 10,000 is about 1,667.'], ['About 6,000', false, 'Each roll has only a 1 in 6 chance of a six.']], '10,000 ÷ 6 ≈ 1,667. The result will vary a little each run, and more rolls make it closer to the true probability.'),
  mcq('rd.import', 'random', 'What must a Python program do before using random.randint?', [['import random', true], ['install a dice', false, 'It is part of Python’s standard library: it comes with Python, but you import it first.'], ['define randint itself', false, 'The random module already provides it.']], 'Modules like random and math are libraries of ready-made functions; import makes them available.'),

  // --- bug hunting
  tmpl('bh.tmpl', 'bughunt', 'y8dBug'),
  mcq('bh.eq', 'bughunt', `What is wrong with this line?\n${code('if answer = "Athena":')}`, [['It uses = (assignment) instead of == (comparison)', true], ['The word Athena should not have quotation marks', false, 'Text values need quotes.'], ['if should be written in capitals, as IF', false, 'Python keywords are lower case.']], '= stores a value; == compares two values. Python gives a syntax error here.'),
  mcq('bh.infinite', 'bughunt', `Why does this loop never end?\n${code('n = 10', 'while n > 0:', '    print(n)')}`, [['n never changes, so n > 0 stays True for ever', true], ['print cannot be used inside a while loop at all', false, 'It can.'], ['10 is too big a starting value for a while loop', false, 'Any positive start would loop for ever.']], 'Add n = n - 1 inside the loop so the condition eventually becomes False.'),
  mcq('bh.index', 'bughunt', `What error does this give?\n${code('heroes = ["Jason", "Medea", "Orpheus"]', 'print(heroes[3])')}`, [['IndexError: the indexes only go 0, 1, 2', true], ['It prints Orpheus, the last hero in the list', false, 'Orpheus is heroes[2].'], ['SyntaxError: the square brackets are wrong', false, 'The syntax is fine; the problem appears when it runs.']], 'A list of 3 items has indexes 0 to 2. heroes[-1] or heroes[len(heroes) - 1] gives the last one.'),
  mcq('bh.indent', 'bughunt', `Mira wants to print “Done” once, after the loop. What is wrong?\n${code('for i in range(3):', '    print(i)', '    print("Done")')}`, [['print("Done") is indented, so it runs inside the loop', true], ['range(3) should be range(4) so the loop can finish', false, 'The range is fine.'], ['The second print needs to come before the loop', false, 'Before the loop it would print first; Mira wants it after.']], 'In Python, indentation decides what is inside a loop. Unindent the last line.'),
  mcq('bh.type', 'bughunt', `Why does this crash when Theo types 12?\n${code('age = input("Age? ")', 'print(age + 1)')}`, [['input() gives a string, which can’t have 1 added', true], ['12 is too big for the variable age to hold', false, 'Any number would crash it.'], ['print cannot show a number and text together', false, 'The problem is the data type.']], 'Use age = int(input("Age? ")) to turn the text into a number.'),
  mcq('bh.method', 'bughunt', 'A program gives the wrong total. Which is the most reliable way to find the bug?', [['Trace it with a small test case, checking each variable', true], ['Change lines one at a time at random until it works', false, 'That can create new bugs and teaches nothing.'], ['Delete the program and write it again more carefully', false, 'Usually the bug is one line; tracing finds it.']], 'Tracing (or adding temporary print statements) shows exactly where the program goes wrong.'),

  // --- tracing algorithms
  tmpl('at.tmpl', 'algotrace', 'y8dAlgoTrace'),
  mcq('at.sorted', 'algotrace', 'Why must the list be sorted before a binary search?', [['It assumes smaller items are all on one side of the middle', true], ['Unsorted lists are too long to split in half', false, 'Length is not the issue.'], ['Python cannot search lists that are not sorted', false, 'Linear search works on any list.']], 'If the list is not in order, the half that is thrown away might contain the target.'),
  mcq('at.insertion', 'algotrace', 'Which sort is often fastest when a list is ALMOST sorted already?', [['Insertion sort', true], ['Bubble sort with no early stop', false, 'Without stopping early it still does every pass.'], ['Random shuffling until sorted', false, 'That is famously awful (bogosort)!']], 'Insertion sort only moves items that are out of place, so a nearly sorted list needs very little work.'),
  mcq('at.merge', 'algotrace', 'Merge sort splits a list of 8 items in half again and again. How many items are in each piece at the bottom?', [['1', true], ['2', false, 'It keeps splitting until each piece has 1 item, which is already sorted.'], ['4', false, 'That is after only one split.']], 'Single items are sorted by definition; merge sort then merges them back in order: divide and conquer.'),
  order('at.binary', 'algotrace', 'Put the steps of a binary search in order.', ['find the middle item', 'compare it with the target', 'if it matches, stop', 'otherwise discard the half that cannot contain the target and repeat'], null, 'Middle, compare, stop if found, otherwise halve and repeat.'),

  // --- efficiency
  tmpl('ef.tmpl', 'efficiency', 'y8dEfficiency'),
  mcq('ef.bigo', 'efficiency', 'What does Big-O notation describe?', [['How an algorithm’s time grows as the input gets bigger', true], ['The exact number of seconds a program takes', false, 'It describes growth, not exact time on one computer.'], ['How much memory the program code itself takes up', false, 'It is about the algorithm’s work.']], 'O(n) grows in step with n; O(n²) grows with its square; O(log n) grows very slowly.'),
  mcq('ef.which', 'efficiency', 'Which grows SLOWEST as the list gets bigger?', [['O(log n): binary search', true], ['O(n): a simple linear search', false, 'Doubling the list doubles the work.'], ['O(n²): bubble sort', false, 'Doubling the list quadruples the work.']], 'Binary search on a million items needs about 20 checks; on two million, about 21.'),
  mcq('ef.handshake', 'efficiency', 'In a class of 30, everyone shakes hands with everyone else once. Why is this like an O(n²) algorithm?', [['Handshakes grow roughly with the square of the class size', true], ['It takes exactly 30 seconds, one for each person', false, 'Big-O is about growth, not seconds.'], ['Each person shakes hands with just one neighbour', false, 'Each shakes hands with everyone else.']], '30 people make 30 × 29 ÷ 2 = 435 handshakes; 60 people make 1,770, about four times as many.'),
  mcq('ef.tradeoff', 'efficiency', 'Sorting a list first makes searching it much faster. When is it NOT worth sorting?', [['When you only search the list once', true], ['When the list is used millions of times', false, 'Then sorting once pays off enormously.'], ['When the list contains numbers', false, 'Numbers sort perfectly well.']], 'Sorting costs time. If you search just once, a single linear search is quicker than sorting then binary searching.'),
  written('ef.w', 'efficiency', 'Explain why binary search is so much faster than linear search for large lists, and give one situation where linear search is the better choice.', ['Explain that binary search halves the list each time', 'Use numbers, for example a million items', 'Give a case for linear search (unsorted list, very small list, or one search only)'], 'Linear search may have to check every item, so a list of a million names could take a million comparisons. Binary search checks the middle item and throws away half of the list each time, so a million items need only about 20 checks, and doubling the list adds just one more. However, binary search only works on a sorted list. If the list is unsorted and you only need to search it once, or it is very small, linear search is better, because sorting it first would take longer than simply checking each item.'),

  // --- stacks and queues
  tmpl('sk.tmpl', 'structures', 'y8dStack'),
  fact('sk.lifo', 'structures', 'A stack is LIFO. What does LIFO stand for?', 'last in, first out', ['last in, final out', 'list in, file out', 'least important, first out'], 'Like a pile of plates: the last one added is the first one taken.', C),
  mcq('sk.undo', 'structures', 'The undo button in a drawing app removes your most recent change first. Which data structure does it use?', [['A stack', true], ['A queue', false, 'A queue would undo your FIRST change first.'], ['A dictionary', false, 'Order matters here; a stack keeps it.']], 'Each action is pushed onto a stack; undo pops the most recent.'),
  mcq('sk.printer', 'structures', 'A school printer prints documents in the order they were sent. Which structure is this?', [['A queue (first in, first out)', true], ['A stack (last in, first out)', false, 'A stack would print the newest document first.'], ['A 2D list (rows and columns)', false, 'A queue models waiting in line.']], 'Queues are fair: first come, first served.'),
  mcq('sk.array', 'structures', 'How is a traditional array different from a Python list?', [['An array has a fixed size and one data type', true], ['An array can only store text, not numbers', false, 'Arrays can store numbers too, just all of one type.'], ['An array can grow; a Python list cannot', false, 'It is the other way round: Python lists grow; traditional arrays have a fixed size.']], 'Python lists can grow and mix types; arrays in languages like C are fixed and uniform, which makes them very fast.'),
  fact('sk.push', 'structures', 'Adding an item to the top of a stack is called…', 'push', ['pop', 'peek', 'enqueue'], 'push adds to the top; pop removes from the top; peek looks without removing.', { accept: ['pushing', 'a push'] }),

  // --- compression
  tmpl('cm.tmpl', 'compression', 'y8dRLE'),
  mcq('cm.lossy', 'compression', 'Which is true of LOSSY compression?', [['It permanently removes data you are unlikely to notice', true], ['It gives back exactly the original file when opened', false, 'That is lossless compression.'], ['It only works on text documents, not pictures', false, 'It is used mostly for photos, music and video.']], 'JPEG photos and MP3 or AAC music use lossy compression.'),
  mcq('cm.text', 'compression', 'Why must a text document or a program be compressed LOSSLESSLY?', [['Losing one character could change the meaning or break it', true], ['Text files are too small to compress usefully', false, 'Text compresses very well.'], ['Lossy compression would make the text file bigger', false, 'Lossy compression is for images, sound and video.']], 'ZIP and PNG are lossless: every bit comes back.'),
  mcq('cm.rlebad', 'compression', 'Run-length encoding would make which of these BIGGER?', [['ABCDEFG', true], ['AAAAAAAA', false, 'That becomes 8A: much smaller.'], ['WWWWBBBB', false, 'That becomes 4W4B.']], 'With no repeated runs, ABCDEFG becomes 1A1B1C1D1E1F1G: twice as long.'),
  mcq('cm.why', 'compression', 'What is the main reason for compressing a video before uploading it?', [['A smaller file uploads faster and uses less data', true], ['It improves the picture quality and sharpness', false, 'Compression never improves quality.'], ['It adds subtitles and chapter markers', false, 'Compression has nothing to do with subtitles.']], 'Streaming services compress video so it plays smoothly over ordinary internet connections.'),
  fact('cm.lossless', 'compression', 'Which type of compression lets you recreate the original file exactly?', 'lossless', ['lossy', 'run-off', 'leaky'], 'Lossless: nothing is lost.'),

  // --- encryption
  tmpl('en.tmpl', 'encryption', 'y8dVigenere'),
  mcq('en.caesar', 'encryption', 'Why is the Caesar cipher easy to crack?', [['There are only 25 shifts to try', true], ['It turns every letter into a number', false, 'It shifts letters.'], ['It only works on words written in Latin', false, 'It works with any alphabet.']], 'Trying every key is called a brute-force attack.'),
  mcq('en.vig', 'encryption', 'Why is the Vigenère cipher harder to crack than the Caesar cipher?', [['The same letter is shifted by different amounts', true], ['It uses a longer alphabet with numbers in it', false, 'It uses the same 26 letters.'], ['It cannot be cracked at all, even by computers', false, 'Charles Babbage and Friedrich Kasiski worked out how to crack it in the 1800s.']], 'In a Caesar cipher, the most common letter (often E) stays the most common; Vigenère smears the pattern across the key.'),
  mcq('en.public', 'encryption', 'In public-key encryption, Kit publishes his public key. What can people do with it?', [['Encrypt messages that only Kit’s private key can decrypt', true], ['Decrypt all the messages that Kit receives', false, 'Only the private key decrypts them.'], ['Work out Kit’s private key from the public one', false, 'The private key stays secret.']], 'Anyone can lock the padlock; only Kit has the key to open it.'),
  fact('en.plain', 'encryption', 'The original, readable message before encryption is called the…', 'plaintext', ['ciphertext', 'keytext', 'hashtext'], 'Plaintext + key → ciphertext.', { accept: ['plain text', 'the plaintext'] }),
  mcq('en.https', 'encryption', 'What does the padlock and https:// in a browser tell you?', [['Data between you and the site is encrypted', true], ['The website is definitely safe and honest', false, 'A scam site can have HTTPS too: it only means the connection is encrypted.'], ['The website has been checked for viruses', false, 'HTTPS checks nothing about viruses; it only encrypts the connection.']], 'HTTPS stops people on the network reading your data, but you still need to check who you are talking to.'),
  written('en.w', 'encryption', 'Explain how public-key encryption solves the problem of sharing a secret key with someone you have never met.', ['Explain the problem: with one shared key, the key itself has to be sent safely', 'Explain public and private keys', 'Use an example, such as a padlock or buying something online'], 'With a symmetric cipher such as Vigenère, both people need the same key, but sending the key is risky: anyone who intercepts it can read every message. Public-key encryption uses a pair of keys. The public key can be shared with everyone and is used to encrypt, but only the matching private key, which never leaves its owner, can decrypt. It is like handing out open padlocks: anyone can lock a box, but only you can open it. When you buy something online, your browser uses the shop’s public key to agree a secret session key safely, so strangers can communicate securely.'),

  // --- the internet
  mcq('in.dns', 'internet', 'What does a DNS server do?', [['Turns a web address into an IP address', true], ['Stores every website in the world', false, 'Websites are stored on their own servers.'], ['Speeds up your Wi-Fi connection at home', false, 'DNS is about names and addresses.']], 'DNS is the internet’s phone book: names for people, numbers for computers.'),
  mcq('in.packet', 'internet', 'Why is data split into packets?', [['Each packet can take its own route and be resent if lost', true], ['Small packets are easier to encrypt than big files', false, 'It is about reliability and sharing the network.'], ['Only one computer can use the internet at once', false, 'Packets let millions share it.']], 'Each packet has the destination address and a sequence number so the message can be put back together.'),
  mcq('in.http', 'internet', 'What is HTTP?', [['The rules browsers and servers use to send web pages', true], ['A type of cable that connects you to a website', false, 'It is a set of rules, not hardware.'], ['A programming language for building web pages', false, 'HTML is the markup language; HTTP is the protocol.']], 'HyperText Transfer Protocol. HTTPS is the secure, encrypted version.'),
  mcq('in.ipmac', 'internet', 'What is the difference between an IP address and a MAC address?', [['An IP address can change; a MAC address is fixed in hardware', true], ['A MAC address can change; an IP address is fixed in hardware', false, 'It is the other way round.'], ['MAC addresses are only for Apple computers', false, 'Every network card has one.']], 'IP addresses route data across the internet; MAC addresses identify devices on the local network.'),
  mcq('in.router', 'internet', 'What does a router do?', [['Forwards packets between networks', true], ['Stores the web pages you have visited', false, 'Servers do that.'], ['Turns digital data into sound', false, 'That was what old modems did.']], 'Routers read each packet’s destination and send it on its next hop.'),
  fact('in.ipv4', 'internet', 'An IPv4 address is made of how many bits?', '32', ['8', '16', '128'], 'Written as four numbers from 0 to 255, like 192.168.1.10. IPv6 uses 128 bits because we ran out of IPv4 addresses.'),
  order('in.visit', 'internet', 'Put what happens when you visit a website in order.', ['you type the web address', 'DNS finds the IP address', 'your browser sends an HTTP request in packets', 'the server sends the page back', 'the browser displays the page'], null, 'Name → address → request → response → display.'),
  written('in.w', 'internet', 'Describe what happens, step by step, from typing www.example.org into a browser to seeing the page.', ['Mention DNS and IP addresses', 'Mention packets and routers', 'Mention the request (HTTP/HTTPS) and the response', 'Finish with the browser displaying the page'], 'First the browser asks a DNS server to translate www.example.org into the server’s IP address. It then sends an HTTP (or HTTPS, encrypted) request for the page. The request is split into packets, each labelled with the destination address, and routers pass them from network to network until they reach the server. The server sends the page back, also in packets, which may take different routes and are reassembled in order. Finally the browser reads the HTML, CSS and any JavaScript and draws the page on the screen.'),

  // --- the web
  tmpl('wb.tmpl', 'web', 'y8dHTML'),
  mcq('wb.jobs', 'web', 'Which language controls how a web page LOOKS: colours, fonts, layout?', [['CSS', true], ['HTML', false, 'HTML gives structure and content.'], ['HTTP', false, 'HTTP is how the page is delivered.']], 'HTML: what is on the page. CSS: how it looks. JavaScript: how it behaves.'),
  mcq('wb.alt', 'web', `Why does this image tag include alt text?\n${code('<img src="parthenon.jpg" alt="The Parthenon on the Acropolis">')}`, [['It is read by screen readers and shown if the image fails', true], ['It makes the image load faster on slow connections', false, 'alt is a text description.'], ['It is the caption printed under the image', false, 'src is the file; alt is the description.']], 'Alt text makes pages accessible to blind and partially sighted users.'),
  fact('wb.h1', 'web', 'Which HTML tag makes the main heading of a page?', '<h1>', ['<head>', '<p>', '<title>'], '<h1> to <h6> are headings, from biggest to smallest. <head> holds information about the page, not the heading.', C),
  mcq('wb.js', 'web', 'A button that shows a hidden answer when clicked is usually made with…', [['JavaScript', true], ['CSS only', false, 'CSS styles things; reacting to a click is behaviour: JavaScript.'], ['DNS', false, 'DNS finds IP addresses.']], 'JavaScript runs in the browser and makes pages interactive.'),

  // --- databases in depth
  tmpl('dbx.tmpl', 'databases', 'y8dSQL'),
  mcq('dbx.pk', 'databases', 'Why is “name” a poor choice of primary key for a table of students?', [['Two students might share a name, but keys must be unique', true], ['Names are too short to work as a primary key', false, 'The problem is that names can repeat.'], ['Names cannot be stored in a key field, only numbers', false, 'They can; they just are not unique.']], 'Schools use a student ID number as the primary key instead.'),
  mcq('dbx.count', 'databases', 'What does SELECT COUNT(*) FROM Heroes; return?', [['The number of records in the table', true], ['Every field of every record in the table', false, 'That is SELECT *.'], ['The largest value', false, 'That would be MAX.']], 'COUNT, SUM, MAX, MIN and AVG are aggregate functions: they summarise many rows into one answer.'),
  mcq('dbx.desc', 'databases', 'Which query lists heroes from strongest to weakest?', [['SELECT name FROM Heroes ORDER BY strength DESC;', true], ['SELECT name FROM Heroes ORDER BY strength ASC;', false, 'ASC is weakest first.'], ['SELECT name FROM Heroes WHERE strength;', false, 'WHERE filters rows; it does not sort.']], 'DESC = descending, biggest first.'),
  mcq('dbx.why', 'databases', 'Why do big organisations use databases rather than spreadsheets?', [['Many users can share huge amounts of data safely', true], ['Spreadsheets are too expensive for big organisations', false, 'Cost is not the main reason; scale and safe sharing are.'], ['Spreadsheets cannot store numbers with decimals', false, 'They can, but they struggle with millions of records and many users.']], 'Databases enforce data types, keys and permissions, and answer queries very fast.'),
  fact('dbx.like', 'databases', 'In SQL, which wildcard in LIKE means “any number of characters”?', '%', ['*', '#', '?'], "LIKE 'A%' matches anything starting with A.", C),
  written('dbx.w', 'databases', 'A museum keeps a database of Greek vases. Explain why each vase record needs a primary key, and suggest a good field to use.', ['Say what a primary key is (unique for every record)', 'Explain a problem without one (duplicates, finding or updating the wrong record)', 'Suggest a suitable field and say why other fields would not work'], 'A primary key is a field whose value is different for every record, so each vase can be identified exactly. Without one, two vases with the same description, painter or date would be impossible to tell apart, and updating or deleting “the red-figure amphora” might change the wrong record. A good primary key is a catalogue number such as VASE-0451, given to each vase when it arrives. Fields like painter or date are poor choices because many vases share them.'),

  // --- AI
  mcq('ai.ml', 'ai', 'How does a machine-learning system learn to recognise owls in photos?', [['It is trained on many labelled photos of owls', true], ['A programmer writes a rule for every possible owl', false, 'That is impossible; it learns from examples.'], ['It looks up the answer on the internet each time', false, 'It uses the patterns it learned in training.']], 'Machine learning finds patterns in training data rather than following hand-written rules.'),
  mcq('ai.bias', 'ai', 'A face-recognition system was trained mostly on photos of one group of people. What is the likely problem?', [['It will be less accurate for under-represented groups', true], ['It will work perfectly for everyone, as computers are fair', false, 'A system is only as good as its training data.'], ['It will only recognise faces it has seen before', false, 'It can recognise new faces, but less accurately for some groups.']], 'Biased training data leads to biased results, which can have serious real-world effects.'),
  mcq('ai.turing', 'ai', 'What is the Turing test?', [['Whether a machine’s conversation passes for a human’s', true], ['A test of how fast a computer can solve puzzles', false, 'It is about intelligent behaviour.'], ['An exam that Alan Turing set for his code-breakers', false, 'Alan Turing proposed it in 1950 as a thought experiment.']], 'Turing called it the “imitation game”.'),
  mcq('ai.gen', 'ai', 'A chatbot confidently gives a wrong date for the Battle of Marathon. What does this show?', [['AI can sound sure but be wrong, so check facts', true], ['Historians have recently changed the battle date', false, 'Marathon was in 490 BC; the chatbot was wrong.'], ['Chatbots are never useful for history homework', false, 'They can be very useful, but need checking.']], 'Generative AI predicts likely text; it does not always know what is true.'),
  fact('ai.data', 'ai', 'The examples a machine-learning system learns from are called its…', 'training data', ['source code', 'firewall', 'cache'], 'Good, varied, fairly collected training data is vital.', { accept: ['training set'] }),
  written('ai.w', 'ai', 'A company wants to use AI to sort job applications. Discuss how the system could become biased and what the company should do about it.', ['Explain that AI learns from past data', 'Give an example of how past decisions could be unfair', 'Suggest at least two ways to reduce the risk', 'Reach a judgement'], 'The AI would learn from the company’s past hiring decisions. If those decisions were unfair, for example if fewer women were hired for engineering jobs, the system would learn to rate similar applicants lower and repeat the unfairness at speed, while looking objective. To reduce the risk, the company should check its training data for imbalances, test the system’s results for different groups before using it, explain how decisions are made, and keep a human reviewing the final choices. AI can save time, but only if it is checked and used responsibly.'),

  // --- inside the CPU
  tmpl('ar.tmpl', 'architecture', 'y8dClock'),
  mcq('ar.cache', 'architecture', 'What is cache memory?', [['Small, very fast memory near the CPU for frequent data', true], ['Extra hard-disk space used when RAM is full', false, 'Cache is much faster and much smaller than storage.'], ['A copy of every file saved in the cloud', false, 'That is cloud storage, which is far slower.']], 'Fetching from cache is many times faster than fetching from RAM.'),
  mcq('ar.cores', 'architecture', 'A quad-core CPU has four cores. Why might a program NOT run four times faster than on one core?', [['Some tasks must happen in order and can’t be split', true], ['Each core only runs at a quarter of the speed', false, 'Each core runs at full speed.'], ['Four cores must share one clock tick between them', false, 'Each core runs at the clock speed.']], 'Software has to be written to use several cores, and some steps depend on earlier ones.'),
  mcq('ar.register', 'architecture', 'What is a register?', [['A tiny, very fast storage location in the CPU', true], ['A list of the programs that are installed', false, 'In a CPU it is a storage location.'], ['A type of hard drive built into the motherboard', false, 'Registers are inside the CPU itself.']], 'The program counter register, for example, holds the address of the next instruction.'),
  mcq('ar.vonneumann', 'architecture', 'In the von Neumann architecture, what is stored together in memory?', [['Both the program instructions and the data', true], ['Only the data, with programs in the CPU', false, 'The key idea is that programs are stored like data.'], ['Only the operating system and its files', false, 'Instructions and data share memory.']], 'The stored-program idea means a computer can run any program just by loading it into memory.'),
  mcq('ar.embedded', 'architecture', 'Which is an embedded system?', [['The computer that controls a washing machine', true], ['A laptop used for many different jobs', false, 'Laptops are general-purpose computers.'], ['A web browser running on a smartphone', false, 'That is software, not a system inside a device.']], 'Embedded systems do one dedicated job inside a bigger device: cars, microwaves, traffic lights.'),
  written('ar.w', 'architecture', 'Theo says: “A computer with twice as many cores will always run my game twice as fast.” Explain whether he is right.', ['Explain what a core is', 'Explain why some tasks cannot be shared between cores', 'Mention at least one other factor (clock speed, cache, the graphics card, RAM)', 'Reach a judgement'], 'Theo is not right. Each core can run instructions at the same time as the others, so more cores help when work can be split into independent parts. But many parts of a game depend on each other and must happen in order, and the game has to be written to use several cores at all, so the extra cores may sit idle. Speed also depends on clock speed, the size of the cache, the amount of RAM and, for games, especially the graphics card. Twice the cores may help, but it will rarely double the speed.'),

  // --- operating systems
  mcq('os.jobs', 'os', 'Which is NOT a job of the operating system?', [['Writing your history essay for you', true], ['Managing memory', false, 'The OS shares memory between programs.'], ['Controlling devices through drivers', false, 'That is an OS job.']], 'The OS manages memory, the processor, devices, files, users and security, and provides the user interface.'),
  mcq('os.multi', 'os', 'How can a single-core computer seem to run music, a browser and a game at the same time?', [['The OS switches between them very fast', true], ['Each program secretly gets its own hidden CPU', false, 'There is only one core.'], ['The programs take turns, each for an hour', false, 'Switching happens thousands of times a second.']], 'This is called multitasking, and scheduling the processor is a key OS job.'),
  mcq('os.driver', 'os', 'What does a device driver do?', [['Lets the OS communicate with a piece of hardware', true], ['Installs new hardware inside the computer case', false, 'It is software!'], ['Speeds up the internet by compressing data', false, 'It is about controlling hardware.']], 'Each printer, graphics card or controller needs a driver so the OS knows how to talk to it.'),
  mcq('os.defrag', 'os', 'Why should you not defragment a solid-state drive (SSD)?', [['It doesn’t speed an SSD up and adds wear', true], ['SSDs cannot store files in fragments at all', false, 'They store files very well.'], ['Defragmenting deletes the files stored on an SSD', false, 'It rearranges them; on an SSD there is no benefit.']], 'Defragmenting helps spinning hard disks, where scattered pieces of a file slow reading down.'),
  mcq('os.open', 'os', 'What is open-source software?', [['Software whose source code anyone can read and change', true], ['Software that stays open on screen in the background', false, 'It is about the source code.'], ['Software that has been tested to have no bugs', false, 'Open-source software has bugs like any other.']], 'Linux and Firefox are open source; Windows is proprietary (closed source).'),
  fact('os.backup', 'os', 'Which utility copies files to another place so they can be recovered if lost?', 'backup software', ['defragmenter', 'compressor', 'firewall'], 'A good habit is the 3-2-1 rule: three copies, on two kinds of storage, one kept somewhere else.', C),

  // --- law and environment
  mcq('lw.dpa', 'law', 'Under the Data Protection Act (UK GDPR), which is a principle organisations must follow?', [['Personal data must be kept no longer than necessary', true], ['Personal data may be sold to anyone', false, 'That would break the law.'], ['People have no right to see the data held about them', false, 'People have the right to access their data.']], 'Data must be used fairly and lawfully, for stated purposes, kept accurate and secure, and not kept longer than needed.'),
  mcq('lw.cma', 'law', 'Kit guesses his friend’s password and logs into her account “just to look”. Which law has he broken?', [['The Computer Misuse Act 1990', true], ['The Copyright, Designs and Patents Act', false, 'That is about copying creative work.'], ['No law, because he only looked', false, 'Unauthorised access is an offence even if nothing is changed.']], 'Unauthorised access is the first offence under the Computer Misuse Act; doing it to commit further crimes, or to damage data, are more serious offences.'),
  mcq('lw.copy', 'law', 'Mira uploads a whole film she did not make to her own website. Which law covers this?', [['The Copyright, Designs and Patents Act 1988', true], ['The Data Protection Act 2018 (UK GDPR)', false, 'That is about personal data.'], ['The Computer Misuse Act 1990', false, 'That is about hacking.']], 'Copyright protects films, music, books and software from being copied and shared without permission.'),
  mcq('lw.ewaste', 'law', 'Why is e-waste (old phones and laptops) an environmental problem?', [['Toxic materials and valuable metals are dumped, not recycled', true], ['Phones release harmful radio waves when thrown away', false, 'They contain metals, plastics and chemicals.'], ['E-waste is always recycled perfectly in the UK', false, 'Much of it is not.']], 'Recycling recovers metals like gold and copper and stops toxic chemicals leaking into soil and water.'),
  mcq('lw.datacentre', 'law', 'Why do data centres affect the environment?', [['They use huge amounts of electricity for power and cooling', true], ['They are all built underwater to keep them cool', false, 'Almost all are on land.'], ['They have no effect, as they run on solar power', false, 'Their electricity and water use is significant.']], 'Streaming, cloud storage and AI all run in data centres, so their energy use is growing fast.'),
  mcq('lw.divide', 'law', 'What is the digital divide?', [['The gap between people with and without good internet access', true], ['The split between people who use Apple and Android', false, 'It is a social idea.'], ['Dividing a file into packets to send online', false, 'That is packet switching.']], 'Cost, location, age and skills can all leave people behind as more services move online.'),

  // --- recursion (stretch)
  tmpl('rc.tmpl', 'recursion', 'y8dRecursion'),
  mcq('rc.base', 'recursion', 'What happens if a recursive function has no base case?', [['It calls itself until it runs out of memory', true], ['It returns 0 because nothing was calculated', false, 'Without a base case nothing stops the calls.'], ['It runs once and then stops by itself', false, 'It never stops calling itself.']], 'Python stops it with a RecursionError when the call stack gets too deep.'),
  mcq('rc.vs', 'recursion', 'Any recursive function could also be written with…', [['a loop (iteration)', true], ['only a dictionary', false, 'A loop can do the same job.'], ['nothing else', false, 'Recursion and iteration are interchangeable, though one is often clearer.']], 'Recursion is elegant for problems that contain smaller copies of themselves, like trees and mazes.'),
  fact('rc.def', 'recursion', 'A function that calls itself is called…', 'recursive', ['iterative', 'global', 'boolean'], 'Each call works on a smaller version of the problem.', { accept: ['recursion', 'a recursive function'] }),

  // --- shortest paths (stretch)
  tmpl('pt.tmpl', 'paths', 'y8dPaths'),
  mcq('pt.graph', 'paths', 'In a graph of islands and sea routes, what are the islands called?', [['Nodes (or vertices)', true], ['Edges (or arcs)', false, 'The routes are the edges.'], ['Weights (or costs)', false, 'Weights are the distances on the edges.']], 'Graphs model maps, networks, friendships and much more.'),
  mcq('pt.bfs', 'paths', 'Why does breadth-first search find the route with the fewest steps?', [['It checks all squares 1 step away, then 2, and so on', true], ['It always turns left at every junction it meets', false, 'That is a maze-walking trick, not BFS.'], ['It picks the direction closest to the exit', false, 'BFS is systematic.']], 'The first time BFS reaches the exit, no shorter route can exist.'),
  mcq('pt.satnav', 'paths', 'Which everyday technology uses shortest-path algorithms like Dijkstra’s?', [['Sat navs and map apps', true], ['Calculators', false, 'Calculators do arithmetic, not routes.'], ['Spell-checkers and grammar tools', false, 'They compare words, not routes.']], 'Internet routers use similar algorithms to choose paths for packets.'),

  // --- logic circuits (stretch)
  tmpl('lc.tmpl', 'circuits', 'y8dCircuit'),
  fact('lc.rows', 'circuits', 'How many rows does a truth table with 3 inputs need?', '8', ['3', '6', '9'], '2 × 2 × 2 = 2^{3} = 8 combinations.'),
  mcq('lc.half', 'circuits', 'A half adder adds two bits. Which gates give its sum and carry outputs?', [['Sum: XOR; carry: AND', true], ['Sum: AND; carry: OR', false, '1 + 1 gives sum 0, carry 1: that is XOR and AND.'], ['Sum: NOT; carry: NOT', false, 'NOT has only one input.']], '0+0 = 00, 0+1 = 01, 1+1 = 10: the sum bit is XOR and the carry bit is AND.'),
  mcq('lc.nand', 'circuits', 'Why are NAND gates special?', [['Any logic circuit can be built from NANDs alone', true], ['They are the only gate with no output', false, 'Every gate has an output.'], ['They only work in pairs, joined to an AND gate', false, 'They work alone, but combinations make every other gate.']], 'NAND (NOT AND) is “universal”, which is why chips can be built from huge numbers of one simple gate.'),

  // --- Huffman (stretch)
  tmpl('hf.tmpl', 'huffman', 'y8dHuffman'),
  mcq('hf.why', 'huffman', 'Why does Huffman coding give E a short code in English text?', [['E is the most common letter, so it saves the most bits', true], ['E is the first letter Huffman’s algorithm reads', false, 'Huffman’s algorithm works from how often each letter appears, not the order it reads them.'], ['E is a vowel, and vowels always get short codes', false, 'Frequency matters, not whether it is a vowel.']], 'Common symbols get short codes; rare symbols get long ones.'),
  mcq('hf.prefix', 'huffman', 'Why must no Huffman code be the start of another code?', [['So bits can be decoded without any separators', true], ['To make every code exactly the same length', false, 'Huffman codes have different lengths.'], ['So that the file becomes lossy and smaller', false, 'Huffman coding is lossless.']], 'If A were 1 and B 10, the bits 10 could mean B or “A then something”.'),
  fact('hf.type', 'huffman', 'Is Huffman coding lossy or lossless?', 'lossless', ['lossy', 'neither', 'both'], 'The original text comes back exactly.'),
];

// --- memory hooks and real-world examples ------------------------------------------------------
// Kept apart from the questions above so corrections to prompts and answers never collide with
// them. TOPIC_HOOKS adds `hook` to topics; MEMORY adds `hook` and/or `example` to items by id.
const TOPIC_HOOKS = {
  'computing.functions': '**Parameters in, return value out**; local variables stay inside the function.',
  'computing.dicts': '**Key → value**: look things up by name, not by position.',
  'computing.strings': '**Strings count from 0 too**, and a slice stops just before its end index.',
  'computing.grids': '**grid[row][column]**: pick the row first, then the column, both counted from 0.',
  'computing.robust': '**Validation: is it sensible? Verification: is it what you meant?**',
  'computing.files': '**r reads, w wipes and writes, a appends.**',
  'computing.random': '**randint includes both ends**; range stops before the end.',
  'computing.bughunt': '**Compare what it does with what it should do**, and find the line where they part ways.',
  'computing.algotrace': '**Be the computer**: one step at a time, writing every change down.',
  'computing.efficiency': '**O(log n) < O(n) < O(n²)**: how fast the work grows as the data grows.',
  'computing.structures': '**Stack = LIFO, like a pile of plates. Queue = FIFO, like a bus queue.**',
  'computing.compression': '**Lossy loses detail for good; lossless gives back every bit.**',
  'computing.encryption': '**The public key locks; only the private key unlocks.**',
  'computing.internet': '**Name → DNS → IP address → packets → routers → server**, and back again.',
  'computing.web': '**HTML is the skeleton, CSS the clothes, JavaScript the muscles.**',
  'computing.databases': '**WHERE filters, ORDER BY sorts, and COUNT, SUM, MAX, MIN and AVG summarise.**',
  'computing.ai': '**Machine learning learns from examples**, mistakes and biases included.',
  'computing.architecture': '**Clock speed, cores and cache**: the three Cs of CPU performance.',
  'computing.os': '**The OS is the manager**: memory, processor time, devices, files and users.',
  'computing.law': '**DPA: your data. CMA: no hacking. CDPA: no copying without permission.**',
  'computing.recursion': '“**To understand recursion, you must first understand recursion**”, and every recursive function needs a base case to stop.',
  'computing.paths': '**Breadth-first search spreads like ripples on a pond**: 1 step away, then 2, then 3.',
  'computing.circuits': '**n inputs → 2ⁿ rows** in the truth table: list every combination.',
  'computing.huffman': '**Common letters get short codes**, just as Morse code gives E a single dot.',
};

const MEMORY = {
  // generated practice
  'computing.m.fn.tmpl': { hook: '**def name(parameters):** then return the answer to whoever called it.', example: 'A currency converter in a travel app calls the same function with a different amount each time.' },
  'computing.m.dc.tmpl': { hook: '**A dictionary maps word → meaning; a Python dict maps key → value.**', example: 'Your phone’s contacts are a dictionary: look up a name (the key) to get the number (the value).' },
  'computing.m.st.tmpl': { hook: '**Slices [start:stop] stop before stop**, and [::-1] reverses a string.', example: 'Apps hide card numbers by slicing: only the last 4 digits are shown.' },
  'computing.m.gr.tmpl': { hook: '**grid[r][c]: row first, then column**, both counted from 0.', example: 'A cinema seating plan is a 2D list: the fourth seat in the front row is grid[0][3].' },
  'computing.m.rb.tmpl': { hook: '**Presence, range, length, type, format**: the five main validation checks.', example: 'A sign-up form that refuses an email address with no @ is doing a format check.' },
  'computing.m.bh.tmpl': { hook: '**Off-by-one?** Check the first and last values of every loop and range.', example: 'The fence-post error: a 10 m fence with a post every metre needs 11 posts, not 10.' },
  'computing.m.at.tmpl': { hook: '**Trace it like a computer**: one step at a time, writing down every comparison and swap.', example: 'Referees check a close finish by replaying it frame by frame: tracing does the same for an algorithm.' },
  'computing.m.ef.tmpl': { hook: '**Double the data: O(n) doubles the work, O(n²) quadruples it, O(log n) adds one step.**', example: 'Binary search could find one person in a sorted list of all 8 billion people on Earth in about 33 steps.' },
  'computing.m.sk.tmpl': { hook: '**Stack: push on top, pop off the top. Queue: join at the back, leave from the front.**', example: 'A browser’s back button uses a stack; a school printer’s list of jobs is a queue.' },
  'computing.m.cm.tmpl': { hook: '**RLE: count the run, then the value**: WWWWBB becomes 4W2B.', example: 'Simple pixel art with big blocks of one colour compresses well with RLE.' },
  'computing.m.en.tmpl': { hook: '**Each key letter is a Caesar shift** (A = 0, B = 1, C = 2 …), with the key repeated along the message.', example: 'In the American Civil War, one side used Vigenère ciphers, and the other side often cracked them.' },
  'computing.m.wb.tmpl': { hook: '**Most tags come in pairs**: <p> opens and </p> closes; the slash means “end”. A few, like <img>, stand alone.', example: 'Choose “view source” on any web page to see the HTML tags behind it.' },
  'computing.m.dbx.tmpl': { hook: '**COUNT counts rows, SUM adds, AVG averages, ORDER BY sorts.**', example: 'A music app’s “most played” list is a query sorted with ORDER BY plays DESC.' },
  'computing.m.ar.tmpl': { hook: '**1 GHz = 1 billion cycles every second.**', example: 'A 3 GHz processor ticks about 3 billion times in the second it takes you to say “one”.' },
  'computing.m.rc.tmpl': { hook: '**Base case + a smaller call**: factorial(n) = n × factorial(n − 1), stopping at 1.', example: 'Russian dolls: open each doll to find a smaller one, until the tiny solid doll, the base case.' },
  'computing.m.pt.tmpl': { hook: '**BFS: ripples on a pond. Dijkstra: always extend the shortest route found so far.**', example: 'Sat navs and delivery firms use shortest-path algorithms to plan their routes.' },
  'computing.m.lc.tmpl': { hook: '**Brackets first, then NOT, then AND, then OR**, and give each gate its own column in the truth table.', example: 'A seatbelt warning beeps when (the engine is on AND the seatbelt is NOT fastened).' },
  'computing.m.hf.tmpl': { hook: '**Huffman: join the two least common, again and again**, to build the tree.', example: 'ZIP files and JPEG images both use Huffman coding as one of their steps.' },

  // functions
  'computing.m.fn.param': { hook: '**Parameter = the name in the def line; argument = the value you pass in.**', example: 'A coffee machine’s size setting is like a parameter; pressing “large” passes the argument.' },
  'computing.m.fn.return': { hook: '**return = hand it back and leave**: the function ends there.', example: 'A price lookup returns a scanned item’s price to the till, which then adds it to your bill.' },
  'computing.m.fn.local': { hook: '**What happens in the function stays in the function.**', example: 'Like scrap paper used for one sum and then thrown away: the rest of the program never sees it.' },
  'computing.m.fn.keyword': { hook: '**def = define**: def name(parameters):' },
  'computing.m.fn.why': { hook: '**DRY: Don’t Repeat Yourself.**', example: 'A website’s menu is written once and reused on every page, so one fix updates them all.' },
  'computing.m.fn.builtin': { hook: '**Built-in = comes in the box**, like the apps already on a new phone.' },

  // dictionaries
  'computing.m.dc.best': { hook: '**Look it up by name → dictionary; keep things in order → list.**', example: 'Phone contacts: look up “Mum” to get her number, without needing to know where she is in the list.' },
  'computing.m.dc.key': { hook: '**Key: value**, like a locker number and what is inside it.', example: 'A café menu is a dictionary: each dish (the key) has a price (the value).' },
  'computing.m.dc.unique': { hook: '**Keys are unique**: assign to one again and the old value is overwritten.', example: 'Like a locker: put a new bag in locker 12 and the old contents have to come out.' },
  'computing.m.dc.missing': { hook: '**No such key → KeyError**: check with in, or use get().' },
  'computing.m.dc.braces': { hook: '**[ ] list, ( ) tuple, { } dictionary.**' },

  // strings
  'computing.m.st.immut': { hook: '**Strings are immutable**: you can’t change one letter, only build a new string.', example: 'Like a printed name badge: to fix a typo, you print a new badge.' },
  'computing.m.st.cast': { hook: '**str() turns a number into text** so that + can join them.', example: 'A game showing “Score: 120” joins text to a number converted with str().' },
  'computing.m.st.len': { hook: '**len = length**: it counts every character, spaces included.', example: 'Password rules like “at least 12 characters” are checked with len().' },
  'computing.m.st.split': { hook: '**split cuts a string into a list; join glues a list back into a string.**', example: 'Spreadsheets saved as CSV are read back by splitting each line at its commas.' },

  // grids
  'computing.m.gr.order': { hook: '**grid[r][c]: pick the row first, then the column**, like a theatre seat “row F, seat 7”.', example: 'Spreadsheet cells are found the same way, by a row and a column.' },
  'computing.m.gr.inner': { hook: '**Nested loops multiply**: 4 rows × 6 columns = 24 visits.', example: 'A day is nested loops too: 24 hours × 60 minutes = 1440 minutes.' },
  'computing.m.gr.image': { hook: '**An image is a grid of pixels**: rows and columns, a perfect fit for a 2D list.', example: 'A QR code is a grid of black and white squares: a 2D list of 1s and 0s.' },
  'computing.m.gr.count': { hook: '**Rows × columns = number of items.**', example: 'A noughts-and-crosses board is 3 × 3 = 9 squares.' },

  // validation and robust programs
  'computing.m.rb.valver': { hook: '**Validation: is it reasonable? Verification: is it what you meant?** Typing it twice is verification.', example: 'Typing a new password twice is verification; refusing one shorter than 8 characters is validation.' },
  'computing.m.rb.checks': { hook: '**Presence check: is anything there at all?**', example: 'Online forms mark required boxes with a star and won’t submit while they are empty.' },
  'computing.m.rb.format': { hook: '**Format check: does it fit the pattern?**', example: 'Postcodes like OX1 2JD and email addresses with an @ in them are checked for format.' },
  'computing.m.rb.valid': { hook: '**Validation catches the impossible, not the wrong-but-sensible.**', example: 'A form can reject a birthday of 31 February, but not a real date that you mistyped.' },
  'computing.m.rb.auth': { hook: '**Authentication = proving who you are.**', example: 'Unlocking a phone with your face or fingerprint is authentication.' },

  // files
  'computing.m.fl.why': { hook: '**Variables live in RAM and vanish; files live in storage and last.**', example: 'A game’s save file is how your progress survives switching the console off.' },
  'computing.m.fl.w': { hook: '**w = wipe, then write.**', example: 'It is like recording over an old video: the previous recording is gone for good.' },
  'computing.m.fl.a': { hook: '**a = add to the end**: append.', example: 'A diary app adding today’s entry after yesterday’s is appending.' },
  'computing.m.fl.close': { hook: '**with open(…) as f: closes the file for you**, even if something goes wrong.' },
  'computing.m.fl.csv': { hook: '**CSV = Comma-Separated Values**: one record per line, with commas between the fields.', example: 'Bank statements and sports results are often downloaded as CSV files for spreadsheets.' },
  'computing.m.fl.loop': { hook: '**for line in f** visits each line of the file once.' },

  // random numbers and simulations
  'computing.m.rd.randint': { hook: '**randint(a, b) includes both a and b**: perfect for dice.', example: 'A dice app can roll with random.randint(1, 6).' },
  'computing.m.rd.choice': { hook: '**choice picks one item; shuffle mixes them all.**', example: 'A music app’s random-song button is like choice; shuffle play is like shuffle.' },
  'computing.m.rd.pseudo': { hook: '**Pseudo-random = random-looking, but made by a formula.**', example: 'One internet security company films a wall of lava lamps to collect truly unpredictable data.' },
  'computing.m.rd.sim': { hook: '**Expected count = trials × probability**: 10 000 × 1/6 ≈ 1667.', example: 'Weather forecasters run many simulations of tomorrow and report the share that bring rain.' },
  'computing.m.rd.import': { hook: '**import random** first; then random.randint is ready to use.' },

  // bug hunting
  'computing.m.bh.eq': { hook: '**if needs ==**: one = stores, two == compares.' },
  'computing.m.bh.infinite': { hook: '**A loop that never ends? Nothing inside it changes the condition.**', example: 'A countdown that forgets to subtract 1 is stuck on 10 for ever.' },
  'computing.m.bh.index': { hook: '**Last index = len − 1**, or use −1 for the last item.' },
  'computing.m.bh.indent': { hook: '**Indentation decides what is inside the loop.**' },
  'computing.m.bh.type': { hook: '**input() gives text**: you can’t add 1 to text until int() turns it into a number.' },
  'computing.m.bh.method': { hook: '**Trace a small test case**, comparing each value with what you expect.', example: 'Mechanics test one part at a time to find a fault, rather than swapping parts at random.' },

  // tracing algorithms
  'computing.m.at.sorted': { hook: '**Binary search trusts the order**: with no order, there is no safe half to throw away.' },
  'computing.m.at.insertion': { hook: '**Nearly sorted? Insertion sort barely has to move anything.**', example: 'Adding one new name to an alphabetical register takes just one insertion.' },
  'computing.m.at.merge': { hook: '**Split down to single items, then merge**: one item on its own is already sorted.' },
  'computing.m.at.binary': { hook: '**Middle, compare, keep half, repeat.**', example: 'Guessing a number from 1 to 100 with “higher” or “lower” clues takes at most 7 guesses.' },

  // efficiency
  'computing.m.ef.bigo': { hook: '**Big-O = how the work grows**, not how many seconds it takes.', example: 'Washing up after a party is O(n): twice as many guests, twice as many plates.' },
  'computing.m.ef.which': { hook: '**log n grows slowest**: double the data and add just one step.' },
  'computing.m.ef.handshake': { hook: '**Everyone with everyone grows like n²**: double the class, about four times the handshakes.', example: 'A group chat where everyone replies to everyone gets busy fast, for the same reason.' },
  'computing.m.ef.tradeoff': { hook: '**Sort once, search many times.** Only searching once? Don’t bother sorting.', example: 'A library keeps its books in order because thousands of people search the shelves.' },

  // stacks, queues and arrays
  'computing.m.sk.lifo': { hook: '**LIFO = Last In, First Out**: the plate on top is the first one taken.', example: 'A tube of crisps: the last crisp in is the first one out.' },
  'computing.m.sk.undo': { hook: '**Undo = pop the stack**: the newest change comes off first.', example: 'Pressing Ctrl+Z in a word processor removes your most recent change first.' },
  'computing.m.sk.printer': { hook: '**Queue = FIFO: first come, first served.**', example: 'Calls to a helpline wait in a queue: “You are number 3 in the queue.”' },
  'computing.m.sk.array': { hook: '**An array has a fixed size and one type**, like an egg box with 12 egg-shaped spaces.', example: 'An egg box holds exactly 12 eggs and nothing else; a shopping bag, like a Python list, grows and holds anything.' },
  'computing.m.sk.push': { hook: '**Push on, pop off**, both at the top.' },

  // compression
  'computing.m.cm.lossy': { hook: '**Lossy loses it for good**: a smaller file, with some detail gone.', example: 'Music streaming apps use lossy compression so songs start playing quickly.' },
  'computing.m.cm.text': { hook: '**One lost letter can change everything**, so text and code need lossless compression.', example: 'Lose one digit from a bank account number and the money goes to the wrong place.' },
  'computing.m.cm.rlebad': { hook: '**RLE needs runs**: with no repeats, the file gets bigger.' },
  'computing.m.cm.why': { hook: '**Smaller file = faster upload and less data used.**', example: 'Video calls compress the picture all the time so they can run over ordinary home Wi-Fi.' },
  'computing.m.cm.lossless': { hook: '**Lossless: less size, no loss.**', example: 'PNG screenshots and ZIP folders are lossless: every pixel and character comes back.' },

  // encryption
  'computing.m.en.caesar': { hook: '**Only 25 keys**: a computer, or a patient person, can simply try them all.', example: 'A brute-force attack on a 4-digit PIN works the same way: try all 10 000 possibilities.' },
  'computing.m.en.vig': { hook: '**Vigenère = many Caesars**: each key letter sets its own shift.', example: 'It was nicknamed “le chiffre indéchiffrable”, the indecipherable cipher, for about 300 years.' },
  'computing.m.en.public': { hook: '**Public key = an open padlock anyone can snap shut; private key = the only key that opens it.**', example: 'Whenever you see the padlock on a shopping site, public-key encryption helped set up the connection.' },
  'computing.m.en.plain': { hook: '**Plaintext in, ciphertext out**: plain means readable.' },
  'computing.m.en.https': { hook: '**The padlock means private, not honest.**', example: 'Scam websites can show a padlock too: it proves the connection is encrypted, not that the shop is real.' },

  // how the internet works
  'computing.m.in.dns': { hook: '**DNS turns names into numbers**: a web address becomes an IP address.', example: 'When DNS fails, websites seem to vanish even though the internet connection is still working.' },
  'computing.m.in.packet': { hook: '**Packets are a jigsaw posted piece by piece**, numbered so it can be rebuilt.', example: 'A glitchy video call is often caused by packets arriving late, or not at all.' },
  'computing.m.in.http': { hook: '**HTTP = HyperText Transfer Protocol**: the rules for fetching web pages.' },
  'computing.m.in.ipmac': { hook: '**An IP address is like your postal address (it changes when you move); a MAC address is like your fingerprint.**' },
  'computing.m.in.router': { hook: '**A router is a postal sorting office** for packets.', example: 'A packet crossing the world may pass through 10 to 20 routers on the way.' },
  'computing.m.in.ipv4': { hook: '**IPv4 = 4 numbers × 8 bits = 32 bits.**', example: '32 bits allow about 4.3 billion addresses, fewer than the devices now online: hence IPv6.' },
  'computing.m.in.visit': { hook: '**Name, address, request, response, display.**' },

  // the web
  'computing.m.wb.jobs': { hook: '**HTML = skeleton, CSS = clothes, JavaScript = muscles.**', example: 'Dark mode on a website is often just a different set of CSS styles.' },
  'computing.m.wb.alt': { hook: '**alt text describes the image** for anyone who can’t see it.', example: 'Social media apps let you add alt text to photos so that everyone can follow your posts.' },
  'computing.m.wb.h1': { hook: '**h1 = heading number 1**, the biggest; the head section is hidden information about the page.' },
  'computing.m.wb.js': { hook: '**JavaScript = behaviour**: it reacts to clicks and typing.', example: 'A like button that changes the moment you tap it is run by JavaScript.' },

  // databases in depth
  'computing.m.dbx.pk': { hook: '**Primary key = unique**, so names are out and ID numbers are in.', example: 'A library card number is a primary key: it picks out exactly one member.' },
  'computing.m.dbx.count': { hook: '**COUNT counts rows**; SUM adds, MAX finds the biggest.', example: 'A shop asking “how many orders came in today?” runs a COUNT query.' },
  'computing.m.dbx.desc': { hook: '**DESC = descending = biggest first; ASC = ascending = smallest first.**', example: 'Sorting a shop by “price: high to low” is ORDER BY price DESC.' },
  'computing.m.dbx.why': { hook: '**Databases: many users, millions of records, all kept safe.**', example: 'Airlines use databases so that two people can never book the same seat at the same moment.' },
  'computing.m.dbx.like': { hook: '**% means any number of characters** in LIKE, so A% means “starts with A”.' },

  // artificial intelligence
  'computing.m.ai.ml': { hook: '**Machine learning = learning from examples**, not from hand-written rules.', example: 'Email spam filters learn from millions of messages that people have marked as spam.' },
  'computing.m.ai.bias': { hook: '**Biased data in, biased results out.**', example: 'Researchers have found some face-recognition systems were least accurate for darker-skinned women.' },
  'computing.m.ai.turing': { hook: '**The Turing test is the imitation game**: can a machine pass for a human in a chat?', example: 'CAPTCHA puzzles on websites are a reverse Turing test: you prove that you are human.' },
  'computing.m.ai.gen': { hook: '**AI predicts likely words, not true facts**: always check.', example: 'Lawyers have been caught quoting court cases that a chatbot simply made up.' },
  'computing.m.ai.data': { hook: '**Training data is the textbook the AI learns from.**' },

  // inside the CPU
  'computing.m.ar.cache': { hook: '**Cache = the snack drawer by your desk**: small, close and fast.' },
  'computing.m.ar.cores': { hook: '**Some jobs can’t be shared**: four cooks can’t boil one egg four times faster.', example: 'Exporting a video keeps every core busy; loading one web page uses only one or two.' },
  'computing.m.ar.register': { hook: '**Registers are the CPU’s own pockets**: tiny, but the fastest storage of all.' },
  'computing.m.ar.vonneumann': { hook: '**Stored program: instructions are just data in memory.**' },
  'computing.m.ar.embedded': { hook: '**Embedded = one job, built in.**', example: 'A smart thermostat, a car’s airbag controller and a washing machine all contain embedded systems.' },

  // operating systems and utilities
  'computing.m.os.jobs': { hook: '**The OS is the manager, not the worker**: it won’t write your essay.' },
  'computing.m.os.multi': { hook: '**Multitasking is super-fast juggling**: the CPU switches between tasks.', example: 'Music keeps playing while you browse because the OS switches the processor between them many times a second.' },
  'computing.m.os.driver': { hook: '**A driver is a translator** between the OS and one piece of hardware.', example: 'Plugging in a new printer or games controller often installs a driver first.' },
  'computing.m.os.defrag': { hook: '**Defragmenting helps spinning disks, not SSDs**: an SSD has no moving head to wait for.' },
  'computing.m.os.open': { hook: '**Open source = an open recipe**: anyone can read and change it.', example: 'Android is built on the open-source Linux kernel.' },
  'computing.m.os.backup': { hook: '**3-2-1: three copies, two kinds of storage, one kept somewhere else.**', example: 'A phone that backs up its photos to the cloud each night is keeping a copy somewhere else.' },

  // law, ethics and the environment
  'computing.m.lw.dpa': { hook: '**Keep only what you need, only for as long as you need it.**', example: 'A shop shouldn’t keep your card details for years after a single online order.' },
  'computing.m.lw.cma': { hook: '**Unauthorised access is a crime**, even “just to look”.', example: 'Guessing a teacher’s password to peek at test answers would break the Computer Misuse Act.' },
  'computing.m.lw.copy': { hook: '**CDPA 1988 = Copyright, Designs and Patents**: don’t copy and share other people’s work.', example: 'Video sites take down uploaded films and songs after copyright complaints.' },
  'computing.m.lw.ewaste': { hook: '**E-waste: poison inside, and treasure inside.**', example: 'The UK throws away more electronic waste per person than almost any other country.' },
  'computing.m.lw.datacentre': { hook: '“**The cloud is just someone else’s computer**”, and it needs power and cooling.', example: 'Some data centres are built in cold places such as Iceland and Scandinavia to save on cooling.' },
  'computing.m.lw.divide': { hook: '**The divide is the gap between online and offline.**', example: 'Older people without the internet can struggle as banks close branches and move services online.' },

  // recursion, shortest paths, logic circuits, Huffman (stretch)
  'computing.m.rc.base': { hook: '**No base case = no brakes.**', example: 'Two mirrors facing each other make an endless corridor of reflections: recursion with no base case.' },
  'computing.m.rc.vs': { hook: '**Recursion and loops are two roads to the same place.**' },
  'computing.m.rc.def': { hook: '**Recursive = it calls itself**, each time on a smaller problem.', example: 'Searching a folder that has folders inside folders is naturally done recursively.' },
  'computing.m.pt.graph': { hook: '**Nodes are the dots; edges are the lines between them.**', example: 'A social network is a graph: people are the nodes and friendships are the edges.' },
  'computing.m.pt.bfs': { hook: '**BFS = ripples spreading out**: everything 1 step away, then 2, then 3.', example: 'Social apps can find “friends of friends” with a breadth-first search.' },
  'computing.m.pt.satnav': { hook: '**Dijkstra: always extend the shortest route found so far.**', example: 'Delivery firms plan van routes with shortest-path algorithms to save time and fuel.' },
  'computing.m.lc.rows': { hook: '**Each extra input doubles the rows**: 2³ = 8 for three inputs.' },
  'computing.m.lc.half': { hook: '**Half adder: XOR gives the sum, AND gives the carry.**', example: 'Every sum your phone works out is built from chains of adders like this one.' },
  'computing.m.lc.nand': { hook: '**NAND = NOT AND, the universal gate**: you can build anything from it.', example: 'The flash memory in phones and USB sticks is called NAND flash because its memory cells are wired together in a pattern like a NAND gate.' },
  'computing.m.hf.why': { hook: '**Common = short**, like Morse code’s single dot for E.', example: 'Morse code used the same idea: E is one dot, while the rare Q is dash, dash, dot, dash.' },
  'computing.m.hf.prefix': { hook: '**No code is the start of another**: prefix-free, so no gaps are needed between codes.' },
  'computing.m.hf.type': { hook: '**Huffman coding is lossless**: every letter comes back.' },
};

for (const t of topics) if (TOPIC_HOOKS[t.id]) t.hook = TOPIC_HOOKS[t.id];
for (const id of Object.keys(TOPIC_HOOKS)) if (!topics.some((t) => t.id === id)) throw new Error(`memory hook for unknown topic ${id}`);
for (const it of items) if (MEMORY[it.id]) Object.assign(it, MEMORY[it.id]);
for (const id of Object.keys(MEMORY)) if (!items.some((it) => it.id === id)) throw new Error(`memory hook for unknown item ${id}`);

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// Graphs of nodes and edges (shortest paths) and logic-gate symbols cannot be drawn yet, so paths
// has none and circuits shows truth tables.
const MERGE = { kind: 'flow', steps: ['8 3 5 1 7 2 6 4', 'split: 8 3 5 1 | 7 2 6 4', 'split: 8 3 | 5 1 | 7 2 | 6 4', 'split into single items', 'merge: 3 8 | 1 5 | 2 7 | 4 6', 'merge: 1 3 5 8 | 2 4 6 7', 'merge: 1 2 3 4 5 6 7 8'], caption: 'Merge sort: split in half until every piece has one item, then merge pairs of sorted pieces.' };
const BSEARCH = { kind: 'flow', steps: ['Sorted list: 4 9 15 22 30 41 56', 'Check the middle, **22**. 41 is bigger, so drop 22 and everything left of it', 'Still in play: 30 41 56. Check the middle, **41**: found!'], caption: 'Binary search for 41. Each check throws away half of what is left, which only works because the list is sorted.' };
const TOPIC_VISUALS = {
  'computing.functions': { kind: 'flow', across: true, steps: ['argument: launch(50)', 'parameter: ships = 50', 'return ships * 2', 'result: 100'], caption: 'The argument is the value passed in; the parameter is the name it gets inside the function. ships is local: it vanishes when the function ends.' },
  'computing.dicts': { kind: 'table', head: ['key', 'value'], rows: [['"Zeus"', '"thunderbolt"'], ['"Athena"', '"owl"'], ['"Poseidon"', '"trident"']], tint: 'cols', caption: 'symbols["Athena"] looks up the key and gives "owl". Keys are unique: setting a key again replaces its value.' },
  'computing.strings': { kind: 'table', rows: [['index', '0', '1', '2', '3', '4', '5'], ['character', 'M', '**E**', '**D**', '**U**', 'S', 'A']], caption: 'name = "MEDUSA". The slice name[1:4] is "EDU": from index 1 up to, but not including, index 4.' },
  'computing.grids': { kind: 'table', head: ['', '0', '1', '2', '3'], rows: [['0', '1st', '2nd', '3rd', '4th'], ['1', '5th', '6th', '7th', '8th'], ['2', '9th', '10th', '11th', '**12th**']], caption: 'Rows r down the side, columns c along the top. A loop over c inside a loop over r visits the squares in this order, row by row. The last is grid[2][3]: row 2, column 3.' },
  'computing.algotrace': MERGE,
  'computing.efficiency': { kind: 'table', head: ['', '10 items', '1000 items', '10⁶ items'], rows: [['O(1)', '1', '1', '1'], ['O(log n)', '≈ 3', '≈ 10', '≈ 20'], ['O(n)', '10', '1000', '10⁶'], ['O(n²)', '100', '10⁶', '**10¹²**']], caption: 'Steps needed as the data grows. Binary search is O(log n); linear search is O(n); comparing every pair is O(n²).' },
  'computing.structures': [
    { kind: 'table', rows: [['top', '**edit 3** ← push and pop here'], ['', 'edit 2'], ['bottom', 'edit 1']], caption: 'A stack (last in, first out): undo pops edit 3, the most recent, first.' },
    { kind: 'table', rows: [['front →', 'Kit', 'Mira', 'Theo', '← back']], caption: 'A queue (first in, first out): join at the back, leave from the front. Kit arrived first, so Kit is served first.' },
  ],
  'computing.compression': { kind: 'table', head: ['data', 'run-length code'], rows: [['WWWWBBBW', '4W3B1W: 8 → 6 characters'], ['ABCDEFG', '1A1B1C1D1E1F1G: 7 → **14** characters']], caption: 'Run-length encoding shrinks long runs of the same value, but makes data with no runs bigger.' },
  'computing.encryption': { kind: 'table', rows: [['plain', 'A', 'T', 'H', 'E', 'N', 'A'], ['key', 'O', 'W', 'L', 'O', 'W', 'L'], ['shift', '14', '22', '11', '14', '22', '11'], ['cipher', '**O**', 'P', 'S', 'S', 'J', '**L**']], caption: 'Vigenère with the key word OWL: each letter is shifted by its key letter (A = 0). The two As become O and L, so letter counts give little away.' },
  'computing.internet': { kind: 'flow', steps: ['You type the web address', 'DNS finds the IP address', 'Your browser sends an HTTP request in packets', 'Routers forward the packets across networks', 'The server sends the page back', 'The browser displays the page'] },
  'computing.databases': [
    { kind: 'table', head: ['name', 'home', 'strength'], rows: [['Perseus', 'Argos', '78'], ['Theseus', 'Athens', '84'], ['Jason', 'Iolcus', '71'], ['Atalanta', 'Arcadia', '88']], caption: 'Table Heroes.' },
    { kind: 'table', head: ['name'], rows: [['Atalanta'], ['Theseus'], ['Perseus'], ['Jason']], caption: '`SELECT name FROM Heroes ORDER BY strength DESC;` gives the strongest first. `SELECT COUNT(*) FROM Heroes;` gives 4.' },
  ],
  'computing.architecture': { kind: 'table', head: ['part', 'job'], rows: [['control unit', 'directs the fetch–decode–execute cycle'], ['ALU', 'does arithmetic and logic'], ['registers', 'tiny, very fast stores for the values in use'], ['cache', 'fast memory for data used often'], ['clock', 'ticks to keep every step in time']], caption: 'Faster clock, more cache and more cores usually mean a faster CPU.' },
  'computing.recursion': { kind: 'flow', steps: ['factorial(4) = 4 × factorial(3)', 'factorial(3) = 3 × factorial(2)', 'factorial(2) = 2 × factorial(1)', 'factorial(1) = 1: the base case', 'Back up: 2 × 1 = 2, 3 × 2 = 6, 4 × 6 = 24'] },
  'computing.circuits': { kind: 'table', head: ['A', 'B', 'C', 'A AND B', '(A AND B) OR C'], rows: [['0', '0', '0', '0', '0'], ['0', '0', '1', '0', '1'], ['0', '1', '0', '0', '0'], ['0', '1', '1', '0', '1'], ['1', '0', '0', '0', '0'], ['1', '0', '1', '0', '1'], ['1', '1', '0', '1', '**1**'], ['1', '1', '1', '1', '1']], caption: '3 inputs give 2³ = 8 rows. Work out the brackets first, then the OR.' },
  'computing.huffman': { kind: 'table', head: ['letter', 'count', 'code'], rows: [['E', '8', '**0**'], ['A', '4', '**10**'], ['T', '2', '**110**'], ['Z', '1', '**111**']], caption: 'Build the tree by joining the two rarest each time: Z + T = 3, then + A = 7, then + E = 15. Left = 0, right = 1, so E, the commonest, gets the shortest code.' },
};
const ITEM_VISUALS = {
  'computing.m.at.merge': MERGE,
  'computing.m.at.binary': BSEARCH,
  'computing.m.at.sorted': BSEARCH,
  'computing.m.dc.unique': { kind: 'table', head: ['key', 'value before', 'value after'], rows: [['"Zeus"', '90', '90'], ['"Hera"', '80', '**50**']], caption: 'power["Hera"] = 50 replaces Hera’s old value. A key can only appear once.' },
  'computing.m.sk.undo': { kind: 'table', rows: [['top', '**edit 3** ← undo pops this first'], ['', 'edit 2'], ['bottom', 'edit 1']] },
  'computing.m.cm.rlebad': { kind: 'table', head: ['data', 'run-length code'], rows: [['WWWWBBBW', '4W3B1W (shorter)'], ['ABCDEFG', '1A1B1C1D1E1F1G (**twice as long**)']] },
  'computing.m.lc.half': { kind: 'table', head: ['A', 'B', 'sum (XOR)', 'carry (AND)'], rows: [['0', '0', '0', '0'], ['0', '1', '1', '0'], ['1', '0', '1', '0'], ['1', '1', '0', '**1**']], caption: '1 + 1 = 10 in binary: sum 0, carry 1.' },
  'computing.m.lc.rows': { kind: 'table', rows: [['inputs', '1', '2', '3', '4'], ['rows', '2', '4', '**8**', '16']], caption: 'Each extra input doubles the rows: 2ⁿ.' },
  'computing.m.in.visit': TOPIC_VISUALS['computing.internet'],
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'computing', deck: 'y8-more', topics, items }];

// Year 8 computing for a strong grammar-school student: KS3 computing at depth, with GCSE
// Computer Science tasters as the stretch tier. Programming is Python 3. Practice that never
// runs out comes from js/gen/y8computing.js (binary, hex, logic, searching, sorting, tracing code).
// Examples are themed on Greek myth with classical figures and original characters (Mira, Theo, Kit).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `computing.${id}`, topic: `computing.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({
  id: `computing.${id}`, topic: `computing.${topic}`, kind: 'mcq', prompt,
  options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra,
});
const order = (id, topic, prompt, items, labels, explain) => ({ id: `computing.${id}`, topic: `computing.${topic}`, kind: 'order', prompt, items, labels, explain });
const tmpl = (id, topic, gen, seed = [-1, 0, 1]) => ({ id: `computing.${id}`, topic: `computing.${topic}`, kind: 'template', gen, levels: [1, 2, 3], seed });
const C = { formats: ['choice'] };
const code = (...lines) => '```\n' + lines.join('\n') + '\n```';
const T = (id, title, kind, prereqs, intro, teach, talk, extra = {}) => ({ id: `computing.${id}`, title, kind, prereqs: prereqs.map((p) => `computing.${p}`), batch: 5, intro, teach, talk, ...extra });

const topics = [
  T('thinking', 'Computational thinking', 'facts', [], 'Before any code is written, a computer scientist thinks: break the problem down, ignore what doesn’t matter, spot patterns, and write precise steps. Daedalus didn’t build the labyrinth by guessing.', 'Explain decomposition and abstraction using planning a school trip as the example.', 'Ask {him} to “decompose” a family task (cooking dinner, packing for a holiday) into smaller steps.'),
  T('flowcharts', 'Flowcharts and pseudocode', 'facts', ['thinking'], 'Algorithms can be drawn as flowcharts or written in pseudocode: structured English that is easy to turn into any programming language. Every algorithm is built from sequence, selection and iteration.', 'Explain what each flowchart shape means.', 'Ask {him} to describe the algorithm {she} uses to get ready in the morning, including one decision.'),
  T('python', 'Python: variables, data types and operators', 'mixed', ['flowcharts'], 'A variable is a named box in memory. Python knows the difference between whole numbers (int), decimals (float), text (str) and True/False (bool), and the type changes what operators do: "3" + "4" is "34"!', 'Explain why input() needs int() around it before you can do maths with the answer.', 'Ask {him} what 17 // 5 and 17 % 5 give, and why both are useful.'),
  T('selection', 'Selection: if, elif and else', 'mixed', ['python'], 'Selection lets a program make decisions, like the Oracle answering differently depending on the question. Python checks conditions in order and runs the first one that is True.', 'Explain the difference between using elif and using several separate if statements.', 'Ask {him} to write (on paper) an if/elif/else that turns a test score into a grade.'),
  T('loops', 'Iteration: for and while loops', 'mixed', ['selection'], 'Loops repeat code. A for loop repeats a set number of times (count-controlled); a while loop repeats until a condition becomes False (condition-controlled). Forget to change the condition and it loops for ever, like Sisyphus and his boulder.', 'Explain when you would choose a while loop instead of a for loop.', 'Ask {him} what range(2, 10, 3) produces.'),
  T('lists', 'Lists, strings and functions', 'mixed', ['loops'], 'Lists store many values under one name, and strings are really sequences of characters. Both count positions from 0. Functions package up code so it can be reused, which is decomposition in action.', 'Explain the difference between a parameter and a return value.', 'Ask {him} what "ODYSSEY"[1:4] would give, and why.'),
  T('debugging', 'Errors, testing and debugging', 'facts', ['lists'], 'Every programmer makes errors. Syntax errors stop the code running at all; runtime errors crash it part-way; logic errors are the sneakiest: the program runs but gives the wrong answer. Good testing finds them.', 'Explain the difference between a syntax error and a logic error, with an example of each.', 'Ask {him} what “boundary” test data would be for a program that accepts ages 11 to 18.'),
  T('searching', 'Searching algorithms', 'mixed', ['loops'], 'Linear search checks every item in turn. Binary search keeps halving a SORTED list, so it can find one item among a million in about 20 checks. Choosing the right algorithm matters.', 'Explain why binary search only works on a sorted list.', 'Play “I’m thinking of a number from 1 to 100” and count how many guesses halving takes.'),
  T('sorting', 'Sorting algorithms', 'mixed', ['searching'], 'Bubble sort swaps neighbours until nothing moves; insertion sort builds a sorted section one item at a time; merge sort splits the list in half again and again, then merges the pieces: divide and conquer.', 'Explain how one pass of a bubble sort works.', 'Ask {him} to sort a hand of playing cards using insertion sort, then explain each step.'),
  T('binary', 'Binary and hexadecimal', 'mixed', ['thinking'], 'Inside a computer, everything is binary: billions of tiny switches that are on (1) or off (0). Hexadecimal is a shorthand programmers use, because one hex digit stands for exactly four bits.', 'Explain why programmers use hexadecimal instead of long binary numbers.', 'Ask {him} to count to 15 in binary on {her} fingers.'),
  T('binarymaths', 'Binary addition, overflow and shifts', 'mixed', ['binary'], 'Binary addition works like column addition, but 1 + 1 = 10. When an answer is too big for the bits available, an overflow error happens. Shifting the bits left or right multiplies or divides by 2.', 'Explain what causes an overflow error.', 'Ask {him} why shifting 00000101 two places left gives 20.'),
  T('media', 'Representing text, images and sound', 'mixed', ['binary'], 'Text, pictures and music all become binary. Characters use codes like ASCII and Unicode; images are grids of pixels; sound is sampled thousands of times a second. More bits mean better quality, and bigger files.', 'Explain how colour depth and resolution affect an image’s file size.', 'Look at the size of a photo on a phone together and work out why it is so big.'),
  T('logic', 'Boolean logic and logic gates', 'mixed', ['binary'], 'Every decision a computer makes comes down to logic gates: AND, OR, NOT and XOR, built from transistors. A truth table lists every possible input and the output it gives.', 'Explain the difference between OR and XOR with a real-life example.', 'Ask {him} to make up a rule for opening a door that needs an AND and a NOT.'),
  T('hardware', 'Hardware: the CPU, memory and storage', 'facts', ['binary'], 'The CPU is the brain: it fetches, decodes and executes billions of instructions a second. RAM holds what is running now and forgets it when the power goes; storage keeps files safe.', 'Explain the fetch–decode–execute cycle.', 'Ask {him} to find out how much RAM and storage the family computer or phone has.'),
  T('software', 'Software, operating systems and languages', 'facts', ['hardware'], 'Software tells the hardware what to do. The operating system manages everything; applications do jobs for us; translators turn the code we write into the machine code the CPU understands.', 'Explain the difference between a compiler and an interpreter.', 'Ask {him} to name three jobs the operating system does while {she} is using a laptop.'),
  T('networks', 'Networks and the internet', 'facts', ['hardware'], 'A network connects devices so they can share. The internet is a network of networks; the World Wide Web is just one service that runs on it. Data travels in small packets that can take different routes.', 'Explain the difference between the internet and the World Wide Web.', 'Ask {him} what happens, step by step, when {she} types a website address.'),
  T('security', 'Cybersecurity and staying safe', 'mixed', ['networks'], 'Criminals attack people as much as computers: phishing emails, guessed passwords and malware. Strong passwords, two-factor authentication, encryption and a healthy suspicion keep data safe.', 'Explain how to spot a phishing email.', 'Check together that {her} important accounts use strong, different passwords and two-factor authentication.'),
  T('history', 'The story of computing', 'facts', [], 'From an ancient Greek bronze gearbox that predicted eclipses, to Babbage, Lovelace and Turing, to the phone in your pocket: computing has a surprisingly long history.', 'Explain why Ada Lovelace is sometimes called the first computer programmer.', 'Look up a photo of the Antikythera mechanism together.'),
  T('ethics', 'Computing, ethics and the law', 'facts', ['security'], 'Computers raise big questions: who owns your data, is it fair when an algorithm decides, and what happens to old phones? UK law protects data, punishes hacking and covers copying.', 'Explain one way an AI system could be unfair, and how to make it fairer.', 'Discuss with {him}: should a computer ever decide who gets a job interview?'),
  // GCSE tasters
  T('trace', 'Trace tables', 'mixed', ['lists'], 'A trace table follows a program line by line, writing down every variable as it changes. It is how GCSE students (and professional programmers) find out exactly what code does.', 'Explain how to fill in a trace table for a loop.', 'Ask {him} to trace a Fibonacci loop on paper.', { tier: 'stretch' }),
  T('twos', 'Negative numbers in binary', 'mixed', ['binarymaths'], 'How can 0s and 1s show −5? In two’s complement, the leftmost bit is worth a negative amount (−128 in a byte). It makes subtraction just a kind of addition.', 'Explain how to turn −20 into 8-bit two’s complement.', 'Ask {him} what the smallest number in 8-bit two’s complement is.', { tier: 'stretch' }),
  T('sql', 'Databases and SQL', 'mixed', ['lists'], 'Databases store huge amounts of data in tables of records and fields. SQL is the language for asking questions of them: SELECT these fields FROM this table WHERE this is true.', 'Explain what a primary key is and why every table needs one.', 'Ask {him} to design a table of the Olympian gods: what fields would it need?', { tier: 'stretch' }),
  T('topologies', 'Network topologies and protocols', 'facts', ['networks'], 'Networks can be wired as a star, a mesh or a bus, each with strengths and weaknesses. Protocols are agreed rules, organised in layers, so devices from any maker can talk to each other.', 'Explain one advantage and one disadvantage of a star network.', 'Ask {him} to draw the home network: is it a star?', { tier: 'stretch' }),
];

const items = [
  // --- computational thinking
  fact('ct.decomp', 'thinking', 'Breaking a big problem into smaller, more manageable parts is called…', 'decomposition', ['abstraction', 'pattern recognition', 'iteration'], 'Decomposition: Daedalus planning the labyrinth as walls, corridors and traps, one part at a time.'),
  fact('ct.abstract', 'thinking', 'Removing unnecessary detail so you can focus on what matters is called…', 'abstraction', ['decomposition', 'compression', 'selection'], 'A London Underground map is a famous abstraction: it ignores real distances and shows only the stops and connections.'),
  fact('ct.pattern', 'thinking', 'Spotting things that problems have in common, so one solution can be reused, is called…', 'pattern recognition', ['abstraction', 'algorithmic thinking', 'decomposition'], 'Once you can sort one list, the same pattern sorts any list.', C),
  fact('ct.algorithm', 'thinking', 'What is an algorithm?', 'a precise sequence of steps to solve a problem', ['a computer program written in a language like Python', 'a type of computer', 'a mistake in a program'], 'An algorithm can be written in English, pseudocode or a flowchart. A program is an algorithm written in a programming language.', C),
  mcq('ct.map', 'thinking', 'Mira draws a map of Odysseus’s voyage showing only the islands and the order he visited them, not the real distances or coastlines. Which technique is she using?', [['Abstraction', true], ['Decomposition', false, 'Decomposition splits a problem into parts. Leaving out detail is abstraction.'], ['Iteration', false, 'Iteration means repeating.']], 'Leaving out details that don’t matter for the job is abstraction.'),
  mcq('ct.good', 'thinking', 'Which instruction is too vague to be part of an algorithm?', [['“Walk until you are near the temple.”', true], ['“Walk 200 steps north, then stop at the gate.”', false, 'This is precise: a number and a direction.'], ['“If the gate is locked, turn left.”', false, 'This is a precise decision.']], 'Algorithms must be unambiguous: “near” means different things to different people. A computer cannot guess.'),
  mcq('ct.decompose', 'thinking', 'Theo is writing a quiz game about the Greek gods. Which list is the best decomposition?', [['Store questions; ask one; check the answer; keep score; show the result', true], ['Write the whole game in one go, then test it at the end', false, 'That is the opposite of decomposition.'], ['Design the title screen; pick colours; choose fonts; add sound effects', false, 'That is only one small part, and not the most important.']], 'Each smaller part can be designed, written and tested on its own.'),
  order('ct.process', 'thinking', 'Put the stages of solving a problem with a computer in a sensible order.', ['understand the problem', 'decompose and design an algorithm', 'write the code', 'test and fix it'], null, 'Programmers who start typing before they understand the problem usually have to start again.'),

  // --- flowcharts and pseudocode
  fact('fc.diamond', 'flowcharts', 'In a flowchart, which shape shows a decision (a question with Yes/No answers)?', 'a diamond', ['a rectangle', 'an oval', 'a parallelogram'], 'Diamond = decision. It has one way in and two ways out.', C),
  fact('fc.para', 'flowcharts', 'In a flowchart, which shape is used for input and output (like “Ask for a name”)?', 'a parallelogram', ['a diamond', 'a rectangle', 'a circle'], 'Parallelogram = input or output.', C),
  fact('fc.rect', 'flowcharts', 'In a flowchart, which shape shows a process (like “add 1 to score”)?', 'a rectangle', ['a diamond', 'a parallelogram', 'an oval'], 'Rectangle = process.', C),
  fact('fc.oval', 'flowcharts', 'In a flowchart, which shape is used for Start and Stop?', 'an oval (rounded rectangle)', ['a diamond (rhombus)', 'a parallelogram', 'a rectangle with double sides'], 'The terminator shape marks where the algorithm begins and ends.', C),
  fact('fc.three', 'flowcharts', 'Every algorithm is built from three constructs: sequence, selection and…', 'iteration', ['decomposition', 'compilation', 'abstraction'], 'Sequence (one step after another), selection (decisions) and iteration (repetition).', { accept: ['repetition', 'loops'] }),
  fact('fc.pseudo', 'flowcharts', 'What is pseudocode?', 'structured English used to plan an algorithm', ['a program that compiles but has a hidden bug in it', 'a programming language designed for beginners', 'the low-level code that a compiler makes from Python'], 'Pseudocode lets you plan the logic without worrying about the exact rules of one language.', C),
  mcq('fc.loop', 'flowcharts', 'In a flowchart, an arrow goes from a decision back UP to an earlier box. What does this show?', [['Iteration: a loop', true], ['Selection with no loop', false, 'Going back to an earlier step makes the algorithm repeat.'], ['An error in the flowchart', false, 'It is a normal way to draw a loop.']], 'An arrow looping back means those steps repeat until the decision sends the flow onwards.'),
  mcq('fc.trace', 'flowcharts', `This pseudocode runs with heads = 9:\n${code('IF heads > 7 THEN', '    OUTPUT "Hydra!"', 'ELSE', '    OUTPUT "Just a snake"', 'ENDIF')}\nWhat is output?`, [['Hydra!', true], ['Just a snake', false, '9 > 7 is true, so the THEN part runs.'], ['Both lines', false, 'Only one branch of an IF runs.']], '9 is greater than 7, so the first branch runs.'),

  // --- Python basics
  tmpl('py.tmpl', 'python', 'y8cVars'),
  fact('py.str', 'python', 'In Python, what data type is "Athena"?', 'string', ['integer', 'float', 'Boolean'], 'Text in quotation marks is a string (str).', { accept: ['str'] }),
  fact('py.float', 'python', 'What data type is 3.14 in Python?', 'float', ['integer', 'string', 'Boolean'], 'A float is a number with a decimal point.', { accept: ['floating point', 'real'] }),
  fact('py.bool', 'python', 'A data type that can only be True or False is called…', 'Boolean', ['integer', 'string', 'float'], 'Named after George Boole, a 19th-century mathematician. In Python: bool.', { accept: ['bool'] }),
  mcq('py.input', 'python', `Kit runs this program and types 5:\n${code('n = input("How many heads? ")', 'print(n * 2)')}\nWhat is printed?`, [['55', true], ['10', false, 'input() always gives a string. "5" * 2 repeats it: 55.'], ['An error', false, 'Multiplying a string by a whole number is allowed: it repeats the string.']], 'input() always returns a string. To do maths, convert it: int(input(...)).'),
  mcq('py.equals', 'python', 'What is the difference between = and == in Python?', [['= stores a value in a variable; == compares two values', true], ['They are the same, but == is used inside if statements', false, 'x = 5 sets x; x == 5 asks “is x 5?”'], ['== stores a value in a variable; = compares two values', false, 'It is the other way round.']], 'One equals assigns; two equals compares and gives True or False.'),
  mcq('py.divide', 'python', 'In Python 3, what does 7 / 2 give?', [['3.5', true], ['3', false, '7 // 2 gives 3. A single / always gives a float.'], ['1', false, '7 % 2 gives the remainder, 1.']], '/ is true division, // is whole-number (floor) division, % is the remainder.'),
  mcq('py.name', 'python', 'Which is NOT a valid Python variable name?', [['2heroes', true], ['hero_2', false, 'Underscores and digits are fine, as long as the name doesn’t start with a digit.'], ['heroCount', false, 'This is valid.']], 'Variable names cannot start with a digit or contain spaces.'),
  fact('py.comment', 'python', 'In Python, which symbol starts a comment (a note the computer ignores)?', '#', ['//', '--', '%'], 'Comments explain code to humans: # this line works out the score.', C),
  mcq('py.cast', 'python', 'Which line correctly asks for a number and stores it as an integer?', [['age = int(input("Age? "))', true], ['age = input(int("Age? "))', false, 'int() must go around the input, converting the answer.'], ['age = int("Age? ")', false, 'This tries to convert the question text itself, which fails.']], 'input() gets text; int() converts that text to a whole number.'),

  // --- selection
  tmpl('sel.tmpl', 'selection', 'y8cSelection'),
  fact('sel.ne', 'selection', 'Which Python operator means “is not equal to”?', '!=', ['<>', '=!', '=/='], 'a != b is True when a and b are different.', C),
  mcq('sel.indent', 'selection', 'How does Python know which lines belong inside an if statement?', [['They are indented (usually 4 spaces)', true], ['They are inside curly brackets { }, as in JavaScript', false, 'Many languages use { }, but Python uses indentation.'], ['They end with a semicolon', false, 'Python does not need semicolons.']], 'Indentation is part of Python’s grammar: get it wrong and you get an error, or a logic error.'),
  mcq('sel.elif', 'selection', 'Why use elif instead of a second if?', [['elif is only checked if the earlier conditions were False', true], ['elif runs faster because it skips the condition check', false, 'The point is the logic: only one branch of an if/elif/else chain runs.'], ['There is no difference; elif is just shorter to type', false, 'Two separate ifs can BOTH run; an elif cannot run if the if before it did.']], 'In an if/elif/else chain, exactly one branch runs: the first whose condition is True.'),
  mcq('sel.and', 'selection', 'What is True and False?', [['False', true], ['True', false, 'and needs BOTH sides to be True.'], ['An error', false, 'and works on any two Booleans.']], 'and is True only if both are True; or is True if at least one is.'),
  mcq('sel.boundary', 'selection', `Ages 13 and over can enter the Hall of Heroes:\n${code('if age > 13:', '    print("Enter")')}\nA 13-year-old is refused. What should the condition be?`, [['age >= 13', true], ['age < 13', false, 'That would let in only those under 13.'], ['age == 13', false, 'That would refuse everyone over 13.']], 'This is a classic boundary error: > leaves out 13 itself, >= includes it.'),

  // --- loops
  tmpl('lp.tmpl', 'loops', 'y8cLoops'),
  fact('lp.range', 'loops', 'Which numbers does range(5) produce?', '0, 1, 2, 3, 4', ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4, 5', '5'], 'range(n) starts at 0 and stops BEFORE n, so it gives n values.', C),
  mcq('lp.kinds', 'loops', 'Which loop is condition-controlled?', [['while', true], ['for i in range(10)', false, 'A for loop over range repeats a fixed number of times: count-controlled.'], ['if', false, 'if is selection, not a loop.']], 'while keeps going as long as its condition is True.'),
  mcq('lp.infinite', 'loops', `What is wrong with this program?\n${code('lives = 3', 'while lives > 0:', '    print("Fight on!")')}`, [['lives never changes, so the loop never ends', true], ['The while line is missing a colon at the end', false, 'The colon is there.'], ['print cannot be used inside a while loop', false, 'print works fine in a loop; the problem is that lives never changes.']], 'An infinite loop. The loop body needs lives = lives - 1 (or another way to make the condition False).'),
  mcq('lp.choose', 'loops', 'Theo wants to keep asking for the password until it is right. Which loop fits best?', [['a while loop', true], ['a for loop with range(3)', false, 'That asks exactly 3 times, even if the password was right first time, or still wrong.'], ['no loop', false, 'He needs to repeat the question.']], 'When you don’t know in advance how many repeats you need, use a condition-controlled while loop.'),
  mcq('lp.break', 'loops', 'What does the keyword break do inside a loop?', [['Stops the loop immediately', true], ['Skips to the next item', false, 'That is continue.'], ['Crashes the program on purpose', false, 'break exits the loop neatly and carries on after it.']], 'break jumps straight out of the loop.'),

  // --- lists, strings, functions
  tmpl('ls.tmpl', 'lists', 'y8cLists'),
  mcq('ls.zero', 'lists', 'In the list muses = ["Clio", "Calliope", "Urania"], what is muses[0]?', [['"Clio"', true], ['"Calliope"', false, 'Python counts from 0, so index 1 is the second item.'], ['An error', false, 'Index 0 is the first item.']], 'Lists are zero-indexed: the first item is at index 0.'),
  mcq('ls.range', 'lists', 'muses = ["Clio", "Calliope", "Urania"]. What happens with print(muses[3])?', [['IndexError: there is no item at index 3', true], ['It prints "Urania", the last item in the list', false, 'Urania is at index 2. Three items have indexes 0, 1, 2.'], ['It prints None because index 3 is empty', false, 'Python raises an error.']], 'A list of 3 items has indexes 0 to 2. Asking for index 3 is a runtime error.'),
  fact('ls.append', 'lists', 'Which list method adds an item to the end of a list?', 'append', ['add', 'insert', 'push'], 'heroes.append("Atalanta") adds her to the end.', { accept: ['.append', 'append()', '.append()'] }),
  mcq('ls.param', 'lists', `In this function, what is power?\n${code('def charge(power):', '    return power * 2')}`, [['A parameter: the name for the value passed in', true], ['The return value: what the function sends back', false, 'The return value is power * 2.'], ['A global variable that every function can use', false, 'power only exists inside the function; it is not global.']], 'Parameters are the inputs a function expects. The value you pass in when calling it is the argument.'),
  mcq('ls.return', 'lists', 'What is the difference between return and print inside a function?', [['return sends a value back to the caller; print only displays it', true], ['They are the same, except that print adds a new line', false, 'A printed value cannot be stored or used again; a returned one can.'], ['return displays the value and then ends the whole program', false, 'return doesn’t show anything by itself.']], 'Use return when the result is needed by the rest of the program.'),
  mcq('ls.why', 'lists', 'Which is the best reason for writing functions?', [['Code can be reused and each part tested on its own', true], ['Programs with functions always run faster', false, 'Speed isn’t the main reason: organisation and reuse are.'], ['Python requires all code to be written inside a function', false, 'It doesn’t.']], 'Functions are decomposition in code: name a job once, use it many times.'),
  fact('ls.len', 'lists', 'What does len("MEDUSA") give?', '6', ['5', '7', '0'], 'len() counts the characters: M, E, D, U, S, A.'),

  // --- debugging and testing
  mcq('db.syntax', 'debugging', `What kind of error is this?\n${code('print("Hello, Olympus"')}`, [['A syntax error: the bracket is never closed', true], ['A logic error: the message is in the wrong place', false, 'The code can’t even run, so it is a syntax error.'], ['A runtime error: Python cannot print a comma', false, 'Python spots this before running anything.']], 'Syntax errors break the rules of the language: missing brackets, colons or quotes.'),
  mcq('db.logic', 'debugging', `This should find the average of two scores, but gives the wrong answer. What kind of error?\n${code('a = 8', 'b = 6', 'average = a + b / 2', 'print(average)')}`, [['A logic error: it should be (a + b) / 2', true], ['A syntax error: a line needs a semicolon', false, 'It runs without complaint, so it is not a syntax error.'], ['A runtime error: you cannot divide by 2 here', false, 'It doesn’t crash: it just prints 11.0 instead of 7.0.']], 'Division happens before addition, so it works out 8 + 3. Brackets fix it.'),
  mcq('db.runtime', 'debugging', `What kind of error happens here?\n${code('ships = 0', 'print(100 / ships)')}`, [['A runtime error: dividing by zero', true], ['A syntax error: print needs quotation marks', false, 'The code is written correctly; the problem only appears when it runs.'], ['No error: it prints infinity', false, 'Dividing by zero is impossible, so Python stops with ZeroDivisionError.']], 'Runtime errors happen while the program is running, often because of unexpected values.'),
  fact('db.boundary', 'debugging', 'A program accepts ages 11 to 18. Testing it with 11 and 18 is called using … test data.', 'boundary', ['normal', 'erroneous', 'random'], 'Boundary data sits on the edges of the valid range, where mistakes like > instead of >= hide.', { accept: ['extreme', 'boundary test'] }),
  fact('db.erroneous', 'debugging', 'Typing “banana” into a program that expects an age is … test data.', 'erroneous', ['boundary', 'normal', 'valid'], 'Erroneous (invalid) data should be rejected politely, not crash the program.', { accept: ['invalid'] }),
  mcq('db.dryrun', 'debugging', 'What is a “dry run”?', [['Working through code by hand, line by line', true], ['Running a program with no input data', false, 'It is done on paper, often with a trace table.'], ['Running a program once before it is finished', false, 'A dry run uses no computer at all: you trace the code by hand.']], 'Dry runs find logic errors that the computer can’t point out for you.'),
  mcq('db.hopper', 'debugging', 'Which story made “debugging” a famous word for fixing errors?', [['From a famous story of a moth stuck in an early computer', true], ['Early programmers were nicknamed “bugs” by engineers', false, 'Engineers already called faults “bugs”; a moth found in a computer in 1947 made the word famous.'], ['Errors look like tiny insects when printed out on paper', false, 'The word “bug” for a fault is older, but the moth story made it famous.']], 'Operators of the Harvard Mark II found a moth in it in 1947, and Grace Hopper loved telling the story. Engineers had called faults “bugs” before, but the logbook made it famous.'),

  // --- searching
  tmpl('se.tmpl', 'searching', 'y8cSearch'),
  mcq('se.sorted', 'searching', 'What does a binary search need before it can start?', [['The data must be sorted', true], ['The data must be in binary', false, '“Binary” refers to splitting in two, not to 0s and 1s.'], ['The data must be numbers', false, 'It works on sorted words too.']], 'Binary search compares with the middle and throws away half. That only makes sense if the list is in order.'),
  mcq('se.when', 'searching', 'When is a linear search a better choice than a binary search?', [['When the list is small or not sorted', true], ['When the list is huge and already sorted', false, 'That is exactly when binary search shines.'], ['Never', false, 'Linear search works on unsorted lists, and is simple for small ones.']], 'Sorting a list just to search it once can take longer than a linear search.'),
  fact('se.million', 'searching', 'About how many checks does a binary search need, at most, to find an item among a million sorted items?', '20', ['1000', '500000', '1000000'], '2^{20} is just over a million, and each check halves the list.', { accept: ['about 20', 'twenty'] }),
  mcq('se.linear', 'searching', 'In the WORST case, how many items does a linear search check in a list of n items?', [['n: every item', true], ['1: only the first item', false, 'That is the best case (found first time).'], ['n ÷ 2: half the items', false, 'That is roughly the average, not the worst.']], 'The worst case is when the item is last, or not there at all.'),

  // --- sorting
  tmpl('so.tmpl', 'sorting', 'y8cSort'),
  mcq('so.bubble', 'sorting', 'How does a bubble sort know the list is sorted?', [['A whole pass happens with no swaps', true], ['It counts the items', false, 'It needs to check the order, not the number of items.'], ['After exactly one pass through the whole list', false, 'One pass only guarantees the largest item is at the end.']], 'If no neighbours needed swapping, everything is in order.'),
  mcq('so.merge', 'sorting', 'Merge sort is an example of which strategy?', [['Divide and conquer', true], ['Brute force', false, 'Brute force tries every possibility.'], ['Trial and improvement', false, 'Merge sort is a precise algorithm.']], 'It splits the list into halves until each piece has one item, then merges the pieces in order.'),
  mcq('so.big', 'sorting', 'Which is usually fastest for sorting a very large list?', [['Merge sort', true], ['Bubble sort', false, 'Bubble sort is simple but very slow on large lists.'], ['Insertion sort', false, 'Insertion sort is good for small or nearly sorted lists, slow for huge ones.']], 'For a million items, bubble sort could need around half a trillion comparisons; merge sort needs about 20 million.'),
  mcq('so.insertion', 'sorting', 'Which everyday activity is most like an insertion sort?', [['Picking up cards one at a time and sliding each into place', true], ['Splitting a pile of cards in half again and again', false, 'That is more like merge sort.'], ['Swapping neighbouring books on a shelf until none are out of order', false, 'That is bubble sort.']], 'Insertion sort grows a sorted section one item at a time.'),

  // --- binary and hex
  tmpl('bn.tmpl', 'binary', 'y8cBinary'),
  tmpl('bn.tmpl2', 'binary', 'y8cHex'),
  mcq('bn.why', 'binary', 'Why do computers use binary?', [['Their transistors are switches: either on or off', true], ['Binary is easier for humans to read and check', false, 'Humans find binary hard. That’s why we use hex!'], ['It uses less electricity than storing denary digits', false, 'The reason is that switches have two states.']], 'Two states (on/off, 1/0) are easy to build reliably with billions of tiny switches.'),
  fact('bn.byte', 'binary', 'How many bits are in a byte?', '8', ['4', '10', '16'], 'A byte is 8 bits; half a byte (4 bits) is a nibble.'),
  fact('bn.nibble', 'binary', 'What is 4 bits called?', 'a nibble', ['a byte', 'a word', 'a kilobit'], 'A nibble is half a byte, and it matches exactly one hexadecimal digit.', { accept: ['nibble', 'nybble'] }),
  mcq('bn.hexwhy', 'binary', 'Why do programmers often use hexadecimal?', [['It is shorter than binary and converts to it easily', true], ['Computers store all their data in hexadecimal', false, 'Computers store binary. Hex is only for humans.'], ['Hex numbers take up less memory than binary ones', false, 'It makes no difference to memory.']], 'One hex digit is exactly 4 bits, so FF is far easier to read and type than 11111111.'),
  mcq('bn.colour', 'binary', 'On the web, the colour #FF0000 means full red, no green, no blue. What is FF in denary?', [['255', true], ['15', false, 'F is 15, but FF is 15 × 16 + 15.'], ['100', false, 'FF = 255, the biggest value one byte can hold.']], 'Each pair of hex digits is one byte: 0 to 255 for red, green and blue.'),

  // --- binary addition and shifts
  tmpl('bm.tmpl', 'binarymaths', 'y8cBinAdd'),
  tmpl('bm.tmpl2', 'binarymaths', 'y8cShift'),
  fact('bm.onePlusOne', 'binarymaths', 'In binary, what is 1 + 1?', '10', ['2', '11', '0'], '1 + 1 = 2, and 2 in binary is 10: write 0, carry 1.', C),
  fact('bm.three', 'binarymaths', 'In binary, what is 1 + 1 + 1?', '11', ['3', '10', '111'], '3 in binary is 11: write 1, carry 1.', C),
  mcq('bm.overflow', 'binarymaths', 'What is an overflow error?', [['A result too big to fit in the bits available', true], ['Too many programs are open at once for the RAM', false, 'That is about memory, not overflow.'], ['A number with more digits than the screen can show', false, 'Not this kind of overflow!']], 'With 8 bits, anything over 255 overflows: the extra carry is lost.'),
  mcq('bm.right', 'binarymaths', 'What does a right shift of 1 place do to a binary number?', [['Halves it (dropping any remainder)', true], ['Doubles it (adding a 0 on the right)', false, 'That is a left shift.'], ['Makes it negative (flipping the first bit)', false, 'Shifts move the bits; they don’t change the sign in simple binary.']], 'Each place to the right is worth half as much.'),

  // --- representing text, images and sound
  tmpl('md.tmpl', 'media', 'y8cAscii'),
  tmpl('md.tmpl2', 'media', 'y8cUnits'),
  tmpl('md.tmpl3', 'media', 'y8cFileSize'),
  mcq('md.unicode', 'media', 'Why was Unicode invented when ASCII already existed?', [['ASCII’s 128 characters were not enough for every language', true], ['ASCII was too slow for sending text over the internet', false, 'The problem was the number of characters.'], ['ASCII could not store capital letters or punctuation', false, 'It can: A is 65.']], 'Unicode can represent over a million characters, including α β γ and emoji.'),
  fact('md.pixel', 'media', 'The smallest single dot of colour in a digital image is called a…', 'pixel', ['bit', 'byte', 'sample'], 'Short for “picture element”.'),
  fact('md.depth', 'media', 'The number of bits used to store the colour of each pixel is called the…', 'colour depth', ['resolution', 'sample rate', 'bit rate'], 'More bits per pixel mean more possible colours: 24-bit colour gives over 16 million.', { accept: ['color depth', 'bit depth'] }),
  fact('md.resolution', 'media', 'The number of pixels in an image (for example 1920 × 1080) is its…', 'resolution', ['colour depth', 'file type', 'metadata'], 'Higher resolution means more detail and a bigger file.'),
  fact('md.sample', 'media', 'The number of times per second a sound is measured when it is recorded is the…', 'sample rate', ['bit depth', 'resolution', 'volume'], 'CD audio uses 44,100 samples per second.', { accept: ['sampling rate', 'sample frequency'] }),
  mcq('md.lossy', 'media', 'Which kind of compression permanently removes some data to make a file smaller?', [['Lossy compression', true], ['Lossless compression', false, 'Lossless can be undone exactly.'], ['Encryption', false, 'Encryption scrambles data; it doesn’t make it smaller.']], 'JPEG photos and MP3 music use lossy compression; the removed detail is hard for people to notice.'),
  mcq('md.lossless', 'media', 'Which file needs LOSSLESS compression?', [['A Python program', true], ['A holiday photo', false, 'Tiny changes to a photo are invisible, so lossy is fine.'], ['A song for a phone', false, 'MP3s use lossy compression happily.']], 'Losing even one character could break a program, so text and code must be compressed losslessly (like ZIP).'),
  mcq('md.rle', 'media', 'Run-length encoding stores AAAAABBB as 5A3B. What is the original of 3Z2E4U?', [['ZZZEEUUUU', true], ['ZEU', false, 'The numbers say how many of each letter.'], ['3Z2E4U', false, 'That is the compressed version.']], 'RLE replaces runs of the same value with a count and the value: a simple lossless method.'),
  mcq('md.meta', 'media', 'Data stored with a photo about the photo itself (date, camera, location) is called…', [['metadata', true], ['pixels', false, 'Pixels are the picture itself.'], ['a virus', false, 'Metadata is normal, though it can reveal where you were.']], 'Metadata is “data about data”. Location metadata on a photo can show where you live, so check it before sharing.'),

  // --- logic
  tmpl('lg.tmpl', 'logic', 'y8cLogic'),
  fact('lg.and', 'logic', 'Which logic gate gives 1 only when BOTH inputs are 1?', 'AND', ['OR', 'NOT', 'XOR'], 'AND: both must be true.'),
  fact('lg.or', 'logic', 'Which logic gate gives 1 when at least one input is 1?', 'OR', ['AND', 'NOT', 'XOR'], 'OR: either or both.'),
  fact('lg.not', 'logic', 'Which logic gate has one input and flips it?', 'NOT', ['AND', 'OR', 'XOR'], 'NOT 1 = 0 and NOT 0 = 1. It is also called an inverter.'),
  fact('lg.xor', 'logic', 'Which gate gives 1 when exactly one input is 1, but not both?', 'XOR', ['OR', 'AND', 'NOT'], 'XOR means “exclusive or”. Computers use XOR gates when adding binary numbers.', { accept: ['exclusive or'] }),
  mcq('lg.real', 'logic', 'A lamp in the temple can be switched on from the door OR the altar, but turns off if both switches are on. Which gate is this?', [['XOR', true], ['OR', false, 'OR would stay on when both are on.'], ['AND', false, 'AND would need both on.']], 'Exactly one switch on: that is XOR. Landing lights with a switch at each end of the stairs work this way.'),
  mcq('lg.table', 'logic', 'In a truth table for A AND B, how many rows give an output of 1?', [['1', true], ['2', false, 'Only A = 1, B = 1 gives 1.'], ['3', false, 'That would be OR.']], 'Of the four rows (00, 01, 10, 11), only 11 gives 1.'),
  mcq('lg.transistor', 'logic', 'What are logic gates built from inside a processor?', [['Transistors: tiny electronic switches', true], ['Tiny light bulbs that switch on and off', false, 'Early computers used valves; modern ones use transistors.'], ['Magnets that store a 1 or a 0', false, 'Transistors, billions of them.']], 'A modern processor contains billions of transistors, each only tens of nanometres across, about the size of a virus.'),

  // --- hardware
  fact('hw.cpu', 'hardware', 'Which part of a computer fetches, decodes and executes instructions?', 'the CPU', ['the hard drive', 'the RAM', 'the monitor'], 'The Central Processing Unit is the computer’s brain.', { accept: ['cpu', 'processor', 'central processing unit'] }),
  order('hw.cycle', 'hardware', 'Put the CPU’s cycle in order.', ['fetch', 'decode', 'execute'], null, 'Fetch the instruction from memory, decode what it means, execute it. Then repeat, billions of times a second.'),
  fact('hw.ram', 'hardware', 'Which memory holds the programs and data in use right now, but loses everything when the power goes off?', 'RAM', ['ROM', 'an SSD', 'a USB stick'], 'RAM is volatile: it forgets when switched off.', { accept: ['random access memory', 'main memory'] }),
  fact('hw.rom', 'hardware', 'Which memory keeps the start-up instructions even when the power is off, and normally cannot be changed?', 'ROM', ['RAM', 'cache', 'a register'], 'Read-Only Memory is non-volatile. It holds the instructions to boot the computer.', { accept: ['read only memory', 'read-only memory'] }),
  fact('hw.cache', 'hardware', 'A small amount of very fast memory inside or next to the CPU, holding instructions it uses often, is called…', 'cache', ['ROM', 'virtual memory', 'a hard disk'], 'Cache is much faster than RAM, but much smaller and more expensive.', { accept: ['cache memory'] }),
  fact('hw.ghz', 'hardware', 'Clock speed is measured in gigahertz. What does 3 GHz mean?', 'about 3 billion cycles per second', ['3 thousand cycles per second', '3 programs at once', '3 gigabytes of memory'], 'Giga means a billion. Each tick of the clock is a chance to carry out an instruction.', C),
  mcq('hw.cores', 'hardware', 'What is the main benefit of a quad-core processor?', [['It can process up to four tasks at once', true], ['It has four times as much storage space', false, 'Cores are about processing, not storage.'], ['It runs every program exactly four times faster', false, 'Only programs written to use several cores speed up, and never by exactly four times.']], 'Each core is like a separate processor, but software must be written to use them all.'),
  mcq('hw.ssd', 'hardware', 'Why do most laptops now use an SSD instead of a hard disk drive?', [['It has no moving parts, so it is faster and tougher', true], ['It holds more data for the same amount of money', false, 'Hard disks are usually cheaper per gigabyte.'], ['It never runs out of space, because it compresses files', false, 'SSDs fill up too.']], 'SSDs use flash memory; hard disks have spinning magnetic platters and a moving read/write head.'),
  mcq('hw.storage', 'hardware', 'Which type of storage uses spinning magnetic platters?', [['A hard disk drive (HDD)', true], ['A solid-state drive (SSD)', false, 'SSDs use flash memory with no moving parts.'], ['A Blu-ray disc', false, 'Blu-ray is optical: read with a laser.']], 'Magnetic (HDD), solid-state (SSD, USB sticks), optical (CD, DVD, Blu-ray).'),
  mcq('hw.embedded', 'hardware', 'A washing machine has a tiny computer that does just one job. This is called…', [['an embedded system', true], ['a supercomputer', false, 'Supercomputers are huge general-purpose machines.'], ['a server', false, 'A server provides services to other computers.']], 'Embedded systems are everywhere: cars, microwaves, traffic lights, fitness watches.'),
  mcq('hw.vonneumann', 'hardware', 'In the von Neumann architecture used by most computers, where are programs stored?', [['In the same memory as the data', true], ['Only inside the CPU’s registers', false, 'The CPU fetches them from memory.'], ['In a separate memory from the data', false, 'Some designs (Harvard architecture) do that; von Neumann’s idea was one shared memory.']], 'The stored-program idea means a computer can switch jobs just by loading a different program.'),

  // --- software
  fact('sw.os', 'software', 'Windows, macOS, Android and Linux are all examples of…', 'operating systems', ['applications', 'utility software', 'programming languages'], 'The operating system manages the hardware and runs all the other software.', { accept: ['operating system', 'os', 'oses'] }),
  mcq('sw.jobs', 'software', 'Which of these is a job of the operating system?', [['Managing memory and sharing the CPU', true], ['Writing and checking your essays', false, 'That is application software, like a word processor.'], ['Designing websites and editing photos', false, 'That is done with applications.']], 'OS jobs: memory management, multitasking, file management, the user interface, drivers for hardware, and security.'),
  fact('sw.utility', 'software', 'Antivirus, backup and disk defragmentation programs are examples of … software.', 'utility', ['application', 'operating system', 'open-source'], 'Utility software helps keep the computer running well.', { accept: ['utilities', 'system utility'] }),
  mcq('sw.high', 'software', 'What is a high-level language?', [['A language like Python that must be translated for the CPU', true], ['The machine code the CPU runs directly, with no translation', false, 'That is the lowest level.'], ['A language only for advanced programmers', false, 'High-level means far from the hardware, not difficult.']], 'High-level languages are easy for people; low-level languages (assembly, machine code) are close to the hardware.'),
  mcq('sw.compiler', 'software', 'What does a compiler do?', [['Translates the whole program before it runs', true], ['Translates and runs the program one line at a time', false, 'That is an interpreter.'], ['Checks the program for viruses before it runs', false, 'That is antivirus software.']], 'Compiled programs run fast and can be shared without the source code; interpreters are handy while developing.'),
  mcq('sw.interpreter', 'software', 'Python is usually run by an interpreter. What does that mean?', [['Each line is translated and run in turn', true], ['The whole program is translated before any of it runs', false, 'That is a compiler.'], ['It is translated into another human language', false, 'It is translated into instructions the CPU can carry out.']], 'That’s why a Python program can run its first part and then stop with a runtime error on a later line.'),
  mcq('sw.open', 'software', 'What is open-source software?', [['Software whose code anyone can read, change and share', true], ['Software that is checked to be free of bugs', false, 'Open source can still have bugs, but anyone can fix them.'], ['Software that can only be used online, in a browser', false, 'It is about the source code being open.']], 'Linux, Firefox and Python itself are open source. Proprietary software keeps its code secret.'),
  fact('sw.machine', 'software', 'The binary instructions a CPU can carry out directly are called…', 'machine code', ['pseudocode', 'HTML', 'source code'], 'Every program must end up as machine code before the CPU can run it.', { accept: ['machine language'] }),

  // --- networks
  mcq('nw.lan', 'networks', 'What is the difference between a LAN and a WAN?', [['A LAN covers a small area; a WAN covers a large one', true], ['A LAN is wireless; a WAN always uses fibre cables', false, 'Both can use cables or wireless. The difference is the area.'], ['A LAN is private; a WAN is open to anyone online', false, 'Local Area Network vs Wide Area Network.']], 'The internet is the biggest WAN of all.'),
  mcq('nw.web', 'networks', 'What is the difference between the internet and the World Wide Web?', [['The internet is the network; the web is pages you visit on it', true], ['They are two names for the same worldwide network', false, 'Email and online games use the internet but are not the web.'], ['The web is the cables; the internet is the websites', false, 'It is the other way round: the internet is the network, and the web runs on it.']], 'The web is one service that runs on the internet, like email or video calls.'),
  fact('nw.packet', 'networks', 'Data sent over the internet is split into small pieces called…', 'packets', ['bytes', 'pixels', 'frames'], 'Each packet has the destination address and a number, so it can be reassembled in order.', { accept: ['packet', 'data packets'] }),
  mcq('nw.route', 'networks', 'Why can packets from the same email take different routes across the internet?', [['Each takes the quickest route at that moment', true], ['Because the email is copied to several servers first', false, 'Copies are not the reason: each packet is routed separately (packet switching).'], ['To confuse hackers who might be watching one route', false, 'Packets take different routes to avoid busy or broken links.']], 'Packet switching makes the internet fast and reliable: if one route fails, packets go another way.'),
  fact('nw.dns', 'networks', 'Which system converts a web address like bbc.co.uk into an IP address?', 'DNS', ['HTTP', 'Wi-Fi', 'USB'], 'The Domain Name System is like the internet’s phone book.', { accept: ['domain name system', 'domain name server'] }),
  fact('nw.ip', 'networks', 'Every device on the internet has a number like 192.168.1.10 that identifies it. What is it called?', 'an IP address', ['a MAC address', 'a web address', 'a password'], 'Internet Protocol address. IPv4 addresses are four numbers from 0 to 255.', { accept: ['ip address', 'ip'] }),
  mcq('nw.router', 'networks', 'What does a router do?', [['Forwards packets between different networks', true], ['Stores copies of the websites you visit', false, 'Servers store websites.'], ['Makes the internet faster than your plan allows', false, 'A router forwards data; it can’t add bandwidth.']], 'A switch connects devices within one network; a router connects networks to each other.'),
  mcq('nw.https', 'networks', 'What does the S in HTTPS mean, and why does it matter?', [['Secure: the data sent is encrypted', true], ['Speedy: pages load faster over the connection', false, 'It means secure.'], ['Simple: an easier version of HTTP', false, 'It adds encryption, which is more complex, not simpler.']], 'With HTTPS, anyone intercepting the packets sees scrambled data, not your password.'),
  fact('nw.protocol', 'networks', 'An agreed set of rules for how data is sent between devices is called a…', 'protocol', ['program', 'router', 'firewall'], 'HTTP, HTTPS, TCP/IP and SMTP (email) are all protocols.'),
  fact('nw.bandwidth', 'networks', 'The amount of data that can be sent across a connection per second is called…', 'bandwidth', ['latency', 'resolution', 'packet size'], 'Measured in megabits per second (Mbps).'),

  // --- security
  tmpl('sc.tmpl', 'security', 'y8cCaesar'),
  fact('sc.phishing', 'security', 'An email pretending to be from your bank, asking you to “confirm your password”, is called…', 'phishing', ['hacking', 'spam filtering', 'encryption'], 'Phishing tricks people into giving away details. Real banks never ask for your password by email.'),
  mcq('sc.spot', 'security', 'Which is the strongest clue that an email is a phishing attempt?', [['It urges you to log in via a link, from an odd address', true], ['It arrives early in the morning while you are asleep', false, 'Timing tells you nothing.'], ['It has the company logo and a polite greeting', false, 'Logos are easy to copy. Look at the sender address and the link.']], 'Urgency, threats, odd addresses and links that go somewhere unexpected are classic signs.'),
  mcq('sc.password', 'security', 'Which is the strongest password?', [['Purple-Hydra-Sails-42!', true], ['Athena-Athena-Athena-Athena', false, 'Repeating one common word is easy to guess, however long it is.'], ['P@ssw0rd2024!', false, 'Swapping letters for symbols in “Password” is one of the first things crackers try.']], 'Long passwords made of random words, with symbols and numbers, are strong and memorable.'),
  mcq('sc.2fa', 'security', 'What is two-factor authentication?', [['Proving it’s you in two separate ways', true], ['Typing your password twice to make sure it is right', false, 'That is still just one factor.'], ['Having two passwords for two different accounts', false, 'Both are things you know: still one kind of factor.']], 'Even if a criminal steals your password, they still need your phone.'),
  fact('sc.ransomware', 'security', 'Malware that locks or encrypts your files and demands payment to unlock them is called…', 'ransomware', ['a worm', 'spyware', 'adware'], 'Backups are the best defence: you can restore your files without paying.'),
  mcq('sc.trojan', 'security', 'Why is a Trojan horse a good name for a type of malware?', [['It pretends to be useful but hides something harmful', true], ['It spreads by itself across networks like an army', false, 'That is a worm.'], ['It attacks computers by flooding them with traffic', false, 'That is a denial-of-service attack. The name comes from the wooden horse that hid soldiers at Troy.']], 'Just like the wooden horse, the user welcomes it in.'),
  mcq('sc.worm', 'security', 'What makes a worm different from a virus?', [['A worm spreads by itself; a virus needs a file opened', true], ['Worms are harmless; viruses always delete files', false, 'Worms can do serious damage and spread very fast.'], ['A virus spreads by itself; a worm needs a file opened', false, 'It is the other way round.']], 'Both are malware (malicious software).'),
  mcq('sc.encrypt', 'security', 'What is encryption?', [['Scrambling data so only the key holder can read it', true], ['Deleting data safely so nobody can recover it', false, 'Encryption keeps data, but makes it unreadable without the key.'], ['Making a hidden backup copy of the data', false, 'Backups copy data; encryption protects it.']], 'Julius Caesar used a simple shift cipher; modern encryption uses keys with hundreds of digits.'),
  mcq('sc.social', 'security', 'Someone phones Kit pretending to be from the school IT team and asks for a password “to fix the account”. This is…', [['social engineering', true], ['a firewall', false, 'A firewall blocks network traffic.'], ['a software update', false, 'It is a trick aimed at the person, not the computer.']], 'Social engineering attacks people rather than machines. IT staff never need your password.'),
  mcq('sc.firewall', 'security', 'What does a firewall do?', [['Blocks network traffic that isn’t allowed', true], ['Stops the computer from overheating under load', false, 'It is about network traffic.'], ['Removes viruses already on the computer', false, 'That is antivirus software.']], 'Think of it as the guard at the city gate.'),
  mcq('sc.footprint', 'security', 'Mira posts a photo outside her school, in uniform, with her full name. What is the main risk?', [['Strangers could work out where she is every day', true], ['The photo might be reused in a school newsletter', false, 'The worry is what it reveals.'], ['No risk, if her account is private', false, 'Followers can share or screenshot posts, and accounts can be hacked.']], 'Your digital footprint can last for ever. Think before sharing your location, school or routine.'),

  // --- history of computing
  mcq('hi.antikythera', 'history', 'What is the Antikythera mechanism?', [['An ancient Greek geared device for predicting eclipses', true], ['The first electronic computer, built in the 1940s', false, 'It is bronze gears, not electronics, but it was an analogue computer.'], ['A Roman water clock used to time speeches', false, 'It was found in a Greek shipwreck and is a calculating device.']], 'Found in a shipwreck off the Greek island of Antikythera in 1901, it is often called the oldest known analogue computer.'),
  fact('hi.babbage', 'history', 'Which Victorian mathematician designed the Analytical Engine, a mechanical general-purpose computer?', 'Charles Babbage', ['Alan Turing', 'Tim Berners-Lee', 'Isaac Newton'], 'It was never finished in his lifetime, but its design had memory and a processor, like a modern computer.', { accept: ['babbage'] }),
  fact('hi.lovelace', 'history', 'Who wrote notes in 1843 including an algorithm for the Analytical Engine, often called the first computer program?', 'Ada Lovelace', ['Grace Hopper', 'Florence Nightingale', 'Mary Anning'], 'She also saw that computers could one day work with music and pictures, not just numbers.', { accept: ['lovelace', 'ada'] }),
  fact('hi.turing', 'history', 'Which mathematician worked at Bletchley Park breaking German codes and is called a father of computer science?', 'Alan Turing', ['Charles Babbage', 'Tommy Flowers', 'Bill Gates'], 'He described the “Turing machine” in 1936 and the Turing test for artificial intelligence in 1950.', { accept: ['turing'] }),
  mcq('hi.colossus', 'history', 'Colossus (1944) is famous because it was…', [['an early electronic computer built to break codes', true], ['the first computer ever to connect to the internet', false, 'The internet did not exist until decades later; Colossus was a wartime code-breaker.'], ['a giant calculator used to design the Spitfire', false, 'It was a code-breaking computer at Bletchley Park, not a design tool.']], 'It was designed by the engineer Tommy Flowers and used about 2,400 valves in its Mark 2 version (the first had about 1,600).'),
  mcq('hi.transistor', 'history', 'Why was the invention of the transistor in 1947 so important?', [['It replaced big, hot valves, so computers could shrink', true], ['It let computers connect to the internet for the first time', false, 'The internet came decades later.'], ['It made computers mechanical, with moving gears', false, 'It made them smaller electronic machines.']], 'A modern phone chip has billions of transistors.'),
  fact('hi.web', 'history', 'Who invented the World Wide Web in 1989?', 'Tim Berners-Lee', ['Alan Turing', 'Steve Jobs', 'Ada Lovelace'], 'He was working at CERN in Switzerland, and the web was given to the world free.', { accept: ['berners-lee', 'tim berners lee', 'sir tim berners-lee'] }),
  order('hi.timeline', 'history', 'Put these in order, earliest first.', ['the Antikythera mechanism', 'Babbage’s Analytical Engine', 'Colossus at Bletchley Park', 'the World Wide Web'], ['over 2,000 years ago', '1830s', '1944', '1989'], 'Computing ideas are very old; electronic computers are less than 100 years old.'),

  // --- ethics and law
  fact('et.cma', 'ethics', 'Which UK law makes it illegal to hack into a computer without permission?', 'the Computer Misuse Act', ['the Data Protection Act', 'the Copyright Act', 'the Highway Code'], 'The Computer Misuse Act 1990 covers unauthorised access and spreading malware.', C),
  fact('et.dpa', 'ethics', 'Which UK law controls how organisations collect, store and use people’s personal data?', 'the Data Protection Act', ['the Computer Misuse Act', 'the Highway Code', 'the Copyright Act'], 'The Data Protection Act 2018 (with the UK GDPR): data must be kept safe, accurate and only used for its stated purpose.', C),
  mcq('et.copy', 'ethics', 'Theo downloads a film from an illegal site and shares it with friends. Which law does this break?', [['The Copyright, Designs and Patents Act', true], ['The Computer Misuse Act', false, 'He didn’t hack anything; he copied someone else’s work.'], ['No law, because the film was already online', false, 'Copyright law applies online too.']], 'Creators own the right to copy and share their work.'),
  mcq('et.bias', 'ethics', 'An AI that helps choose job applicants was trained mostly on data about past male employees. What is the risk?', [['It may unfairly favour men', true], ['None: computers are always fair', false, 'Computers learn patterns from data, including unfair ones.'], ['It will reject everyone who applies', false, 'It will work, but unfairly.']], 'AI is only as fair as the data it learns from. That’s why people must check its decisions.'),
  mcq('et.ewaste', 'ethics', 'What is the biggest environmental problem with throwing away old phones?', [['They contain toxic chemicals and metals worth recycling', true], ['They take up a lot of space in landfill sites', false, 'The real problem is toxic materials and wasted metals.'], ['There is no problem, because phones are mostly glass', false, 'E-waste is one of the fastest-growing kinds of rubbish.']], 'Recycling recovers gold, copper and rare metals, and keeps poisons out of landfill.'),
  mcq('et.divide', 'ethics', 'What is the “digital divide”?', [['The gap between people with and without good internet access', true], ['A kind of division used in binary arithmetic', false, 'It is a social issue.'], ['The split between Apple users and Android users', false, 'It means unequal access to technology.']], 'It affects school work, job applications and even seeing a doctor.'),
  mcq('et.deepfake', 'ethics', 'Why are “deepfake” videos a problem?', [['AI can show people doing things they never did', true], ['They are too large to download on most phones', false, 'The problem is trust, not file size.'], ['They are always obviously fake to anyone watching', false, 'Many are very convincing.']], 'Check the source before believing or sharing a shocking video.'),

  // --- trace tables (stretch)
  tmpl('tr.tmpl', 'trace', 'y8cTraceTable'),
  mcq('tr.what', 'trace', 'What is a trace table for?', [['Recording each variable’s value as a program runs', true], ['Drawing a flowchart of the program’s structure', false, 'Flowcharts show the design; trace tables follow it running.'], ['Storing the program’s results in a table', false, 'That is a database table.']], 'Trace tables are used in GCSE exams and to find logic errors.'),
  mcq('tr.row', 'trace', 'In a trace table for a loop, when do you add a new row?', [['Each time a variable’s value changes', true], ['Only at the very end, when the loop has finished', false, 'Then you would miss the steps in between.'], ['Only when something is printed to the screen', false, 'Track every change, not just output.']], 'Following every change is what makes a trace table reliable.'),

  // --- two's complement (stretch)
  tmpl('tw.tmpl', 'twos', 'y8cTwos'),
  mcq('tw.sign', 'twos', 'In sign and magnitude, the first bit shows the sign (1 = negative). What problem does this cause?', [['There are two zeros, and normal addition goes wrong', true], ['It cannot show positive numbers bigger than 1', false, 'A leading 0 means positive.'], ['It needs 16 bits to store any number at all', false, 'It can use any number of bits.']], 'Two’s complement fixes both problems, which is why computers use it.'),
  fact('tw.msb', 'twos', 'In 8-bit two’s complement, what is the leftmost bit worth?', '−128', ['128', '−1', '1'], 'Place values: −128, 64, 32, 16, 8, 4, 2, 1.', { accept: ['-128', 'minus 128', 'negative 128'] }),
  mcq('tw.flip', 'twos', 'One quick way to find −n in two’s complement is…', [['write n in binary, flip all the bits, then add 1', true], ['write n in binary, then put a 1 at the front of it', false, 'That is sign and magnitude.'], ['write n in binary backwards', false, 'Reversing bits changes the number completely.']], 'Example: 5 = 00000101 → 11111010 → 11111011 = −5.'),

  // --- databases and SQL (stretch)
  tmpl('sq.tmpl', 'sql', 'y8cSQL'),
  fact('sq.record', 'sql', 'In a database table, one row (all the data about one thing) is called a…', 'record', ['field', 'key', 'query'], 'Each record is one hero; each field is one piece of information, like strength.'),
  fact('sq.field', 'sql', 'In a database table, one column (like “name” or “home”) is called a…', 'field', ['record', 'file', 'row'], 'Fields have a data type, such as text or integer.'),
  mcq('sq.pk', 'sql', 'What is a primary key?', [['A field that is unique for every record', true], ['The password needed to open the database', false, 'It is a field, not a password.'], ['The first field in every table', false, 'It is a field that uniquely identifies records.']], 'Names aren’t safe as keys (two people can share a name), so tables often use an ID number.'),
  mcq('sq.select', 'sql', 'Which SQL query lists the names of heroes from Athens?', [['SELECT name FROM Heroes WHERE home = \'Athens\';', true], ['SELECT Heroes FROM name WHERE Athens;', false, 'SELECT the field FROM the table WHERE a condition.'], ['FIND name IN Heroes = Athens;', false, 'SQL uses SELECT … FROM … WHERE.']], 'SELECT fields FROM table WHERE condition;'),
  mcq('sq.star', 'sql', 'What does SELECT * mean?', [['Select every field', true], ['Select only starred records', false, '* is a wildcard meaning all fields.'], ['Multiply the fields', false, 'In SQL SELECT, * means all.']], 'SELECT * FROM Heroes; shows the whole table.'),

  // --- topologies and protocols (stretch)
  mcq('tp.star', 'topologies', 'In a star network, every device connects to a central switch. What is the main disadvantage?', [['If the central switch fails, the whole network goes down', true], ['If any one cable breaks, every device on it stops working', false, 'Only the device on that cable is affected.'], ['Data collisions are constant', false, 'Switches send data only to the right device, so collisions are rare.']], 'Advantage: one broken cable affects only one device, and it is easy to add devices.'),
  mcq('tp.mesh', 'topologies', 'Why is a mesh network very reliable?', [['Data can take another route around a broken link', true], ['It has only one cable, so less can go wrong', false, 'It has many connections.'], ['It uses the strongest and most expensive cables', false, 'Reliability comes from the many routes, not the cables.']], 'The internet itself is a giant partial mesh.'),
  mcq('tp.client', 'topologies', 'In a client–server network…', [['clients request services and servers provide them', true], ['every computer is equal and shares directly', false, 'That is peer-to-peer.'], ['the server asks each client for its files', false, 'It is the clients that ask; servers answer.']], 'Most websites, email and school networks are client–server.'),
  mcq('tp.mac', 'topologies', 'What is a MAC address?', [['A unique number in a device’s network hardware', true], ['An address given to a device by the router', false, 'That is an IP address, which the router hands out; a MAC address is built into the network hardware.'], ['A website address typed into the browser', false, 'Web addresses are URLs.']], 'IP addresses can change when you move network; the MAC address is built into the hardware (though many phones now show each Wi-Fi network a disguised “private” MAC address for privacy).'),
  order('tp.layers', 'topologies', 'Put the four layers of the TCP/IP model in order, from the top (nearest the user) down.', ['application', 'transport', 'internet', 'link'], null, 'Application (HTTP, email), transport (TCP: splits data into packets and checks they arrive), internet (IP: addressing and routing), link (the physical network: Wi-Fi, Ethernet).'),
  mcq('tp.layerwhy', 'topologies', 'Why are network protocols organised in layers?', [['Each layer does one job and can be changed alone', true], ['To make the internet slower but safer from hackers', false, 'Layers are about organisation, not speed.'], ['So each layer can use a different language', false, 'It is a design choice that makes networks easier to build.']], 'You can switch from Wi-Fi to cable (link layer) and websites (application layer) still work.'),
];

// --- memory hooks and real-world examples ------------------------------------------------------
// Kept apart from the questions above so corrections to prompts and answers never collide with
// them. TOPIC_HOOKS adds `hook` to topics; MEMORY adds `hook` and/or `example` to items by id.
const TOPIC_HOOKS = {
  'computing.thinking': 'Four pillars: **break it down, leave out what doesn’t matter, spot patterns, write precise steps**.',
  'computing.flowcharts': '**Oval = start or stop, rectangle = process, diamond = decision, parallelogram = input or output.**',
  'computing.python': '**int, float, str, bool**: whole numbers, decimals, text and True/False.',
  'computing.selection': '**if, elif, else**: Python takes the first path that is True and skips the rest.',
  'computing.loops': '**for = I know how many times; while = keep going until something changes.**',
  'computing.lists': '**A list starts counting at 0**: the first item is at index 0.',
  'computing.debugging': '**Syntax error = bad grammar; runtime error = a crash; logic error = the wrong answer.**',
  'computing.searching': '**Binary search: halve, halve, halve**, but only on a sorted list.',
  'computing.sorting': '**Bubble swaps neighbours, insertion slides each item into place, merge splits then merges.**',
  'computing.binary': '**Binary place values double**: 1, 2, 4, 8, 16, 32, 64, 128.',
  'computing.binarymaths': '**1 + 1 = 10 in binary**: write 0, carry 1. Shift left to double, shift right to halve.',
  'computing.media': '**More bits = better quality = bigger file.**',
  'computing.logic': '**AND: both. OR: either or both. NOT: flip it. XOR: one or the other, not both.**',
  'computing.hardware': '**Fetch, decode, execute**: the CPU’s heartbeat, billions of times a second.',
  'computing.software': '**A compiler translates the whole program first; an interpreter goes line by line.**',
  'computing.networks': '**The internet is the roads; the web is just one kind of traffic on them.**',
  'computing.security': '**Think before you click**: urgency, odd links and requests for passwords are red flags.',
  'computing.history': '**Antikythera, Babbage, Lovelace, Turing, Berners-Lee**: gears, engines, code, codebreaking, the web.',
  'computing.ethics': 'Three UK laws: **Data Protection** (your data), **Computer Misuse** (hacking), **Copyright** (copying).',
  'computing.trace': '**One column per variable, one new value each time it changes.**',
  'computing.twos': '**Flip the bits and add 1** to make a number negative in two’s complement.',
  'computing.sql': '**SELECT the fields, FROM the table, WHERE the condition is true.**',
  'computing.topologies': 'Star: one hub. Mesh: many routes. TCP/IP layers, top down: **All Teachers Inspire Learners** (Application, Transport, Internet, Link).',
};

const MEMORY = {
  // generated practice
  'computing.py.tmpl': { hook: '**= stores, == compares**; / gives a float, // drops the remainder, % gives the remainder.', example: '17 sweets shared between 5 friends: 17 // 5 = 3 each, and 17 % 5 = 2 left over.' },
  'computing.sel.tmpl': { hook: '**The first True branch wins**; elif and else are only reached if everything above was False.', example: 'A ticket machine: if age < 12, child price; elif age >= 65, senior price; else adult price.' },
  'computing.lp.tmpl': { hook: '**range(start, stop, step) stops before stop**: range(2, 10, 3) gives 2, 5, 8.', example: 'A microwave counting down 30 seconds is a count-controlled loop; a kettle heating until it boils is condition-controlled.' },
  'computing.ls.tmpl': { hook: '**A list starts counting at 0**, and a slice [1:4] stops just before index 4.', example: 'A playlist is a list: song 0 plays first, and the last song is at index len − 1.' },
  'computing.se.tmpl': { hook: '**Binary search: look in the middle, throw half away**, and repeat.', example: 'Finding a word in a paper dictionary: open it in the middle, decide which half, and keep halving.' },
  'computing.so.tmpl': { hook: '**Bubble sort: the biggest value bubbles to the end** on every pass.', example: 'Sorting playing cards one at a time into your hand is insertion sort; combining two sorted piles is a merge.' },
  'computing.bn.tmpl': { hook: '**Binary place values double**: 128, 64, 32, 16, 8, 4, 2, 1. Add up the columns with a 1.', example: 'Each colour channel of a phone photo uses 8 bits, so it has 256 levels, from 0 to 255.' },
  'computing.bn.tmpl2': { hook: '**One hex digit = 4 bits**: split the binary into nibbles; A = 10, B = 11 … F = 15.', example: 'Web colours are hex: #FF8800 is full red, about half green and no blue, which makes orange.' },
  'computing.bm.tmpl': { hook: '**0 + 1 = 1, 1 + 1 = 10, 1 + 1 + 1 = 11**: write the right digit, carry the left one.', example: 'An 8-bit counter at 255 that adds 1 overflows to 0, like a car’s mileometer rolling over to zeros.' },
  'computing.bm.tmpl2': { hook: '**Shift left = × 2 per place; shift right = ÷ 2 per place**, just as moving digits in denary is × or ÷ 10.', example: 'Shifting 00000101 (5) two places left gives 00010100 (20): four times as big.' },
  'computing.md.tmpl': { hook: '**A = 65, a = 97**: each lowercase letter is exactly 32 more than its capital.', example: 'Every text message is stored as character codes: Hi is 72 then 105.' },
  'computing.md.tmpl2': { hook: '**Bit, nibble (4 bits), byte (8 bits)**, then × 1000 each time: kilobyte, megabyte, gigabyte, terabyte.', example: 'A 64 GB phone holds 64 000 MB: room for about 16 000 photos of 4 MB each.' },
  'computing.md.tmpl3': { hook: '**Image = width × height × colour depth**; sound = sample rate × bit depth × seconds. Then ÷ 8 for bytes.', example: 'A 12-megapixel photo at 24 bits per pixel is 36 MB before compression, which is why phones save JPEGs.' },
  'computing.lg.tmpl': { hook: '**AND is like multiplying, OR is like adding (but never above 1)**: 1 AND 0 = 0, 1 OR 0 = 1.', example: 'A car alarm sounds if (a door opens OR a window breaks) AND the alarm is set.' },
  'computing.sc.tmpl': { hook: '**Shift each letter along the alphabet**; to decode, shift back. After Z, wrap round to A.', example: 'ROT13, a Caesar shift of 13, was once used online to hide puzzle answers: doing it twice gets the text back.' },
  'computing.tr.tmpl': { hook: '**One column per variable; write a new value every time it changes.**', example: 'Keeping score in a board game, writing each new total under the last, is a trace table in real life.' },
  'computing.tw.tmpl': { hook: '**The leftmost bit is worth −128**: 11111111 is −128 + 127 = −1.', example: 'Computers usually store negative whole numbers, like a freezer’s −18 °C setting, in two’s complement.' },
  'computing.sq.tmpl': { hook: '**SELECT fields FROM table WHERE condition**: what you want, where it lives, which rows.', example: 'An online shop’s price filter runs a query like SELECT name FROM Products WHERE price < 20.' },

  // computational thinking
  'computing.ct.decomp': { hook: '**De-compose = take apart**: split one big problem into smaller ones.', example: 'Planning a party: guests, food, music and games, each sorted out on its own.' },
  'computing.ct.abstract': { hook: '**Abstraction = leave out what doesn’t matter**, like a map that ignores every tree.', example: 'A football formation diagram shows only where the players stand, not their faces or the weather.' },
  'computing.ct.pattern': { hook: '**Seen it before?** Reuse the solution: that is pattern recognition.', example: 'Once you can follow a recipe for one cake, the same pattern works for muffins and brownies.' },
  'computing.ct.algorithm': { hook: '**An algorithm is a recipe**: precise steps, in order, that anyone could follow.', example: 'A recipe, a flat-pack furniture leaflet and a sat nav’s directions are all algorithms.' },
  'computing.ct.map': { hook: 'Abstraction **removes** detail; decomposition **divides** the problem.', example: 'A bus timetable leaves out the roads and traffic and keeps just the stops and the times.' },
  'computing.ct.good': { hook: '**Computers can’t guess**: every step needs exact numbers or conditions.', example: '“Bake until golden” works for a person; a smart oven needs “bake at 180 °C for 25 minutes”.' },
  'computing.ct.decompose': { hook: '**Small parts, each tested on its own**, then joined together.', example: 'Car factories build engines, seats and doors separately, then put them together.' },
  'computing.ct.process': { hook: '**Understand, design, code, test**: think before you type.', example: 'Builders don’t start laying bricks before the architect has drawn the plans.' },

  // flowcharts and pseudocode
  'computing.fc.diamond': { hook: '**Diamond = decision**: its corners point to the different ways out.', example: 'In a getting-ready flowchart, “Is it raining?” is a diamond: yes leads to the umbrella, no to the sunglasses.' },
  'computing.fc.para': { hook: '**Parallelogram = put in or print out**: the slanted box for input and output.', example: 'A cash machine asking for your PIN and then showing your balance: both are parallelograms.' },
  'computing.fc.rect': { hook: '**Rectangle = do something**: a process step.', example: '“Add 1 to score” in a game, or “add the eggs” in a recipe, is a process box.' },
  'computing.fc.oval': { hook: '**Oval = the ends**: every flowchart starts and stops in a rounded box.' },
  'computing.fc.three': { hook: '**Sequence, Selection, Iteration**: steps in order, decisions, repeats.', example: 'Brushing teeth: steps in order (sequence), if the tube is empty get more (selection), brush each tooth (iteration).' },
  'computing.fc.pseudo': { hook: '**Pseudo means pretend**: pseudocode is pretend code, plain English with structure.', example: '“IF the dough is sticky THEN add flour” is pseudocode for the kitchen.' },
  'computing.fc.loop': { hook: '**An arrow going back up = a loop.**', example: 'Shampoo bottles once said “lather, rinse, repeat”: a loop with no condition to stop it!' },
  'computing.fc.trace': { hook: '**Only one branch of an IF runs**: check the condition, then follow that branch alone.' },

  // Python basics
  'computing.py.str': { hook: '**Quotation marks mean string**: anything inside them is text, even digits.', example: 'Phone numbers are stored as strings: you never do maths with them, and the leading 0 must stay.' },
  'computing.py.float': { hook: '**Float: the decimal point floats**, so it holds numbers with a fractional part.', example: 'Prices like 2.99 and body temperatures like 36.6 are floats.' },
  'computing.py.bool': { hook: '**Boolean = two choices only**: True or False, named after George Boole.', example: 'A light switch, a dark-mode setting or a ticked checkbox is a Boolean.' },
  'computing.py.input': { hook: '**input() always gives a string**; wrap it in int() before doing maths.', example: 'A web form treats your age as text until the program converts it into a number.' },
  'computing.py.equals': { hook: '**One = sets it; two == checks it.**', example: 'Setting your alarm for 7:00 is =; the phone checking “is it 7:00 yet?” is ==.' },
  'computing.py.divide': { hook: '**/ gives a decimal, // gives whole parts, % gives the leftovers.**', example: '7 campers and 2 tents: 7 / 2 = 3.5, but 7 // 2 = 3 per tent with 7 % 2 = 1 camper left over.' },
  'computing.py.name': { hook: '**Names start with a letter or an underscore**, never a digit, and contain no spaces.' },
  'computing.py.comment': { hook: '**# starts a note for humans**; Python ignores the rest of the line.', example: 'Comments are like sticky notes in a recipe book: “use less salt next time”.' },
  'computing.py.cast': { hook: '**int(input()): convert the answer, not the question.**' },

  // selection
  'computing.sel.ne': { hook: '**!= means not equal**: the ! says “not”.', example: 'A login check: if the typed password != the saved password, refuse entry.' },
  'computing.sel.indent': { hook: '**Indentation is Python’s brackets**: indented lines belong to the line above that ends with a colon.', example: 'Like notes with sub-points: the indented lines belong to the heading above them.' },
  'computing.sel.elif': { hook: '**elif = else if**: only checked when everything above it was False.', example: 'A grade calculator: if score >= 70, A; elif score >= 60, B. A score of 75 gets only an A.' },
  'computing.sel.and': { hook: '**and needs both to be True**: True and False is False.', example: 'You can ride the rollercoaster only if you are tall enough AND have a ticket: one is not enough.' },
  'computing.sel.boundary': { hook: '**> leaves out the boundary; >= includes it.**', example: 'A film rated 12 needs age >= 12, so a 12-year-old gets in.' },

  // loops
  'computing.lp.range': { hook: '**range(n) starts at 0 and stops before n**: n numbers in total.', example: 'A list of 5 songs has positions 0 to 4: exactly range(5).' },
  'computing.lp.kinds': { hook: '**while = keep going while the condition is True**: condition-controlled.', example: 'A kettle keeps heating while the water is below boiling point.' },
  'computing.lp.infinite': { hook: '**Change the condition inside the loop**, or it runs for ever.', example: 'An app stuck on a spinning loading circle may be trapped in a loop that never ends.' },
  'computing.lp.choose': { hook: '**Don’t know how many repeats? Use while.**', example: 'A cash machine keeps asking for your PIN until it is right, or until it locks you out.' },
  'computing.lp.break': { hook: '**break is the emergency exit**: jump straight out of the loop.', example: 'A search can break out as soon as it finds the item, instead of checking the rest.' },

  // lists, strings and functions
  'computing.ls.zero': { hook: '**A list starts counting at 0**: muses[0] is the first item.', example: 'Like a UK lift: the ground floor is 0, so the first floor up is 1.' },
  'computing.ls.range': { hook: '**Last index = length − 1**: 3 items have indexes 0, 1 and 2.', example: 'A three-storey UK house has floors 0, 1 and 2: there is no floor 3.' },
  'computing.ls.append': { hook: '**append = add to the end**, like joining the back of a queue.', example: 'Adding a song to the end of a playlist is an append.' },
  'computing.ls.param': { hook: '**Parameter = the placeholder name; argument = the actual value passed in.**', example: 'An oven dial labelled “temperature” is a parameter; turning it to 180 passes the argument.' },
  'computing.ls.return': { hook: '**return hands the answer back; print only shows it.**', example: 'A calculator screen showing a result is print; storing it in memory for the next sum is return.' },
  'computing.ls.why': { hook: '**Write it once, use it many times.**', example: 'A share button that works the same way on every page of an app is one function, reused.' },
  'computing.ls.len': { hook: '**len counts every character**, including spaces.', example: 'Old-style text messages had a 160-character limit, checked by counting the length.' },

  // errors, testing and debugging
  'computing.db.syntax': { hook: '**Syntax = grammar**: break the language’s rules and nothing runs at all.', example: 'Like a sentence with a missing bracket or full stop: the reader can’t make sense of it.' },
  'computing.db.logic': { hook: '**Logic error: it runs, but the answer is wrong.** BIDMAS bites in code too.', example: 'A sat nav that sends you the long way round: no crash, just the wrong result.' },
  'computing.db.runtime': { hook: '**Runtime error = a crash while running**, such as dividing by zero.', example: 'An app that crashes when you open a photo it can’t read has hit a runtime error.' },
  'computing.db.boundary': { hook: '**Normal, boundary, erroneous**: test inside the range, on its edges, and outside it.', example: 'For a club for ages 11 to 18: test 14 (normal), 11 and 18 (boundary) and banana (erroneous).' },
  'computing.db.erroneous': { hook: '**Erroneous = full of error**: data that should be rejected, politely.', example: 'Typing letters into the card-number box on a shopping site should give a polite message, not a crash.' },
  'computing.db.dryrun': { hook: '**Dry run = no computer, just pencil and paper.**', example: 'A fire drill is a dry run: practising the steps without a real fire.' },
  'computing.db.hopper': { hook: '**Debugging = removing the bug**: a real moth, taped into a logbook in 1947.', example: 'The logbook page with the moth is kept at the Smithsonian’s history museum in Washington.' },

  // searching
  'computing.se.sorted': { hook: '**No order, no binary search**: halving only works when you know which half to keep.', example: 'You can halve your way through a dictionary because it is alphabetical; a shuffled pile of papers needs a linear search.' },
  'computing.se.when': { hook: '**Small or unsorted? Go linear.**', example: 'Looking for your keys in a small bag, you just check everything.' },
  'computing.se.million': { hook: '**2¹⁰ ≈ 1000, so 2²⁰ ≈ a million**: 20 halvings.', example: '“Guess my number” from 1 to a million takes at most 20 guesses if you always halve.' },
  'computing.se.linear': { hook: '**Worst case = check them all.**', example: 'Hunting for one picture in an unsorted photo album might mean turning every page.' },

  // sorting
  'computing.so.bubble': { hook: '**A whole pass with no swaps means it is sorted.**' },
  'computing.so.merge': { hook: '**Merge sort = divide and conquer**: split, split, split, then merge.', example: 'Two teachers each sort half the exam papers, then merge their piles: quicker than one sorting them all.' },
  'computing.so.big': { hook: '**Bubble sort crawls on big lists; merge sort scales.**', example: 'Online shops sorting millions of products by price rely on fast methods like merge sort.' },
  'computing.so.insertion': { hook: '**Insertion sort = sorting a hand of cards.**', example: 'Adding a new pupil to an alphabetical register: slide the name into the right place.' },

  // binary and hexadecimal
  'computing.bn.why': { hook: '**Two states: on/off, 1/0**. A transistor is just a tiny switch.', example: 'A light switch is the simplest bit: off is 0, on is 1.' },
  'computing.bn.byte': { hook: '**A byte bites 8 bits.**', example: 'One byte stores one letter of plain English text, so HELLO takes 5 bytes.' },
  'computing.bn.nibble': { hook: '**A nibble is a small bite**: half a byte, 4 bits, exactly one hex digit.' },
  'computing.bn.hexwhy': { hook: '**Hex is shorthand**: one hex digit stands for exactly 4 bits.', example: 'Network MAC addresses are written in hex: 12 hex digits instead of 48 binary digits.' },
  'computing.bn.colour': { hook: '**FF = 15 × 16 + 15 = 255**, the biggest value one byte can hold.', example: 'On any web page, #FFFFFF is white (every colour full on) and #000000 is black.' },

  // binary addition, overflow and shifts
  'computing.bm.onePlusOne': { hook: '**There is no digit 2 in binary**: 1 + 1 = 10, write 0, carry 1.', example: 'Like a mileometer: when a wheel passes its last digit it goes back to 0 and nudges the next wheel on.' },
  'computing.bm.three': { hook: '**1 + 1 + 1 = 11**: write 1, carry 1.' },
  'computing.bm.overflow': { hook: '**Too big for the bits = overflow**: 8 bits stop at 255.', example: 'The Year 2000 bug came from storing years with only two digits, so 2000 looked like 1900: not enough room.' },
  'computing.bm.right': { hook: '**Right shift halves, left shift doubles.**' },

  // representing text, images and sound
  'computing.md.unicode': { hook: '**ASCII: 128 characters. Unicode: room for over a million**, enough for every alphabet and emoji.', example: 'An emoji in a text is a Unicode character, so any phone knows which emoji it is, though each maker draws it a little differently.' },
  'computing.md.pixel': { hook: '**Pixel = picture element**: the tiny coloured squares that make up an image.', example: 'Zoom right in on a phone photo and you will see the separate coloured squares: pixels.' },
  'computing.md.depth': { hook: '**Colour depth of n bits → 2ⁿ colours**: 24 bits give over 16 million.', example: 'A GIF can hold at most 256 colours (8 bits), which is why GIF photos can look blotchy.' },
  'computing.md.resolution': { hook: '**Resolution = how many pixels**: width × height.', example: 'Full HD is 1920 × 1080, about 2 million pixels; 4K has four times as many.' },
  'computing.md.sample': { hook: '**Sample rate = snapshots per second** of the sound wave.', example: 'CD audio takes 44 100 samples a second, more than twice the highest pitch people can hear.' },
  'computing.md.lossy': { hook: '**Lossy loses it for good**: JPEG photos and MP3 music.', example: 'Messaging apps often shrink your photos with lossy compression, so your friend’s copy is lower quality.' },
  'computing.md.lossless': { hook: '**Lossless = nothing lost**: a ZIP file gives back every bit.', example: 'Sending homework as a ZIP file is safe: every character comes back exactly.' },
  'computing.md.rle': { hook: '**RLE = count, then value**: 5A means AAAAA.', example: 'Fax machines used run-length encoding, because a page is mostly long runs of white.' },
  'computing.md.meta': { hook: '**Meta means about**: metadata is data about the data.', example: 'A photo’s metadata can include the exact GPS location where it was taken.' },

  // Boolean logic
  'computing.lg.and': { hook: '**AND = both**, like needing a ticket AND a passport to board a plane.', example: 'A microwave only runs if the door is shut AND the start button is pressed.' },
  'computing.lg.or': { hook: '**OR = either, or both.**', example: 'A doorbell that rings when the front OR the back door button is pressed.' },
  'computing.lg.not': { hook: '**NOT flips it**: 1 becomes 0 and 0 becomes 1.', example: 'An automatic night light: light on = NOT daylight.' },
  'computing.lg.xor': { hook: '**XOR = exclusive or**: one or the other, but not both.', example: 'A meal deal of “chips or salad” means one, not both: that is XOR.' },
  'computing.lg.real': { hook: '**Two switches, one light = XOR**: flipping either switch changes the light.', example: 'Long corridors often have a light switch at each end, wired in exactly this way.' },
  'computing.lg.table': { hook: '**n inputs → 2ⁿ rows**; AND has just one 1, in the 1, 1 row.' },
  'computing.lg.transistor': { hook: '**Transistors are switches**, and each gate is built from a handful of them.', example: 'A modern phone chip packs over 10 billion transistors into something the size of a fingernail.' },

  // hardware
  'computing.hw.cpu': { hook: '**CPU = Central Processing Unit**: the brain that fetches, decodes and executes.', example: 'When a phone gets warm during a game, much of that heat comes from its busy processor.' },
  'computing.hw.cycle': { hook: '**Fetch, decode, execute**: get it, work out what it means, do it.', example: 'Like following a recipe: read the next step, work out what it means, then do it.' },
  'computing.hw.ram': { hook: '**RAM forgets**: it is volatile, like writing on a steamed-up mirror.', example: 'Unsaved homework vanishes in a power cut because it was only in RAM.' },
  'computing.hw.rom': { hook: '**ROM = Read-Only Memory**: it remembers the start-up steps even when the power is off.', example: 'When you switch on a laptop, the first instructions it runs come from ROM.' },
  'computing.hw.cache': { hook: '**Cache = the pencil case on your desk**: what you use most, close at hand.', example: 'Web browsers keep a cache too: pictures from sites you visit load faster the next time.' },
  'computing.hw.ghz': { hook: '**Giga = billion**: 3 GHz is 3 billion ticks a second.', example: 'A typical laptop processor runs at about 2 to 4 GHz.' },
  'computing.hw.cores': { hook: '**More cores = more cooks in the kitchen**, but only if the recipe can be shared out.', example: 'Video-editing apps keep every core busy; a simple calculator app uses just one.' },
  'computing.hw.ssd': { hook: '**SSD = solid-state drive**: no moving parts, so it is faster and tougher.', example: 'A laptop with an SSD is less likely to lose files if it is dropped than one with a spinning hard disk.' },
  'computing.hw.storage': { hook: '**Magnetic spins, solid-state is silent, optical uses a laser.**', example: 'A Blu-ray player reads discs with a laser, while your phone keeps everything in solid-state storage.' },
  'computing.hw.embedded': { hook: '**Embedded = built in to do one job.**', example: 'Traffic lights, smart doorbells and car engines all contain embedded systems.' },
  'computing.hw.vonneumann': { hook: '**Von Neumann: programs and data share one memory.**', example: 'That is why installing a new app can turn your phone into a game, a map or a torch.' },

  // software
  'computing.sw.os': { hook: '**The OS is the manager**: it runs the hardware and every other program.', example: 'Phones run Android or iOS; laptops often run Windows, macOS or Linux.' },
  'computing.sw.jobs': { hook: '**OS jobs: memory, multitasking, files, users, devices and security.**' },
  'computing.sw.utility': { hook: '**Utilities are the computer’s maintenance crew.**', example: 'An antivirus scan, or an automatic backup each night, is utility software at work.' },
  'computing.sw.high': { hook: '**High-level = close to human language; low-level = close to the hardware.**', example: 'Python reads almost like English: print(score) is far easier to read than machine code.' },
  'computing.sw.compiler': { hook: '**Compiler = translate the whole book first; interpreter = a live translator, sentence by sentence.**', example: 'Big games are usually compiled, so they run fast on your device.' },
  'computing.sw.interpreter': { hook: '**Interpreter = line by line**, so it stops at the first line with an error.', example: 'A live interpreter at a conference translates each sentence as it is spoken.' },
  'computing.sw.open': { hook: '**Open source = an open recipe**: anyone can read, change and share the code.', example: 'Thousands of volunteers around the world help improve open-source projects such as Linux and Firefox.' },
  'computing.sw.machine': { hook: '**Machine code = 1s and 0s**: the only language the CPU really speaks.' },

  // networks and the internet
  'computing.nw.lan': { hook: '**LAN = Local (one building); WAN = Wide (across a country or the world).**', example: 'Your home Wi-Fi is a LAN; the internet linking it to the rest of the world is a WAN.' },
  'computing.nw.web': { hook: '**The internet is the roads; the web is the shops along them.**', example: 'Email and online gaming use the internet without using the web.' },
  'computing.nw.packet': { hook: '**Packets are like numbered postcards**: each has an address and a number, so they can be put back in order.', example: 'A video call is chopped into hundreds of packets a second, and a few lost ones make the picture glitch.' },
  'computing.nw.route': { hook: '**Packet switching: each packet finds its own way**, like cars avoiding a traffic jam.', example: 'If a cable under the sea is cut, packets are simply rerouted another way.' },
  'computing.nw.dns': { hook: '**DNS = the internet’s phone book**: names go in, IP addresses come out.', example: 'Before loading a web page, your device looks up the site’s IP address with DNS.' },
  'computing.nw.ip': { hook: '**An IP address is a postal address** for a device on a network.', example: 'Home routers often give devices addresses beginning 192.168.' },
  'computing.nw.router': { hook: '**A router is a postal sorting office**: it sends each packet towards the right network.', example: 'The box your home Wi-Fi comes from is a router linking your LAN to the internet.' },
  'computing.nw.https': { hook: '**S = Secure**: the data is encrypted on its way, but check the web address too, because scam sites can use HTTPS.', example: 'Online banking and shopping use HTTPS, so card numbers are scrambled on the way.' },
  'computing.nw.protocol': { hook: '**Protocol = agreed rules**, like everyone driving on the left in the UK.', example: 'Wi-Fi, Bluetooth and email all follow protocols, so devices from different makers can talk.' },
  'computing.nw.bandwidth': { hook: '**Bandwidth = the width of the pipe**: wider pipe, more data each second.', example: 'Streaming a 4K film needs far more bandwidth than streaming music.' },

  // cybersecurity
  'computing.sc.phishing': { hook: '**Phishing = fishing for your details** with bait.', example: 'A text saying your parcel is held and you must pay £1.99 through a link is a common phishing trick.' },
  'computing.sc.spot': { hook: '**Urgent + a link + an odd address = red flag.** Check where a link really goes before clicking.', example: 'A message from your bank sent from a random free email address is a classic warning sign.' },
  'computing.sc.password': { hook: '**Three random words** make a password that is strong and easy to remember.', example: 'The UK’s National Cyber Security Centre recommends three random words, like PurpleHydraSails.' },
  'computing.sc.2fa': { hook: '**Something you know + something you have** (or something you are).', example: 'A code texted to your phone after you type your password is two-factor authentication.' },
  'computing.sc.ransomware': { hook: '**Ransomware holds your files to ransom**; backups set you free.', example: 'In 2017 the WannaCry ransomware hit NHS hospitals, and thousands of appointments were cancelled.' },
  'computing.sc.trojan': { hook: '“**Beware of Greeks bearing gifts**”: a Trojan hides harm inside something welcome.', example: 'A free game download that secretly installs spyware is a Trojan.' },
  'computing.sc.worm': { hook: '**A worm wriggles about by itself**; a virus needs someone to open its host file.', example: 'A worm can spread across a whole company network overnight without anyone clicking anything.' },
  'computing.sc.encrypt': { hook: '**Encryption = a locked box**: only the key holder can open it.', example: 'Many messaging apps use end-to-end encryption, so even the company running the app can’t read your chats.' },
  'computing.sc.social': { hook: '**Social engineering hacks the human**, not the computer.', example: 'A caller pretending to be from your bank and asking for a code is social engineering.' },
  'computing.sc.firewall': { hook: '**A firewall is the guard at the city gate**: it checks what comes in and goes out.', example: 'School networks use firewalls to block unsafe websites and attacks from outside.' },
  'computing.sc.footprint': { hook: '**Your digital footprint is a trail** that is very hard to wash away.', example: 'Employers and universities sometimes search applicants’ names online.' },

  // the story of computing
  'computing.hi.antikythera': { hook: '**Antikythera: ancient gears that predicted the sky**, the oldest known analogue computer.', example: 'Divers found it in a shipwreck in 1901; X-ray scans later revealed about 30 surviving gears.' },
  'computing.hi.babbage': { hook: '**Babbage designed the engine; Lovelace wrote its program.**', example: 'In 1991 London’s Science Museum built Babbage’s Difference Engine No. 2 from his plans, and it worked.' },
  'computing.hi.lovelace': { hook: '**Ada Lovelace, 1843: the first published algorithm** for a computing machine.', example: 'Ada Lovelace Day, each October, celebrates women in science, technology, engineering and maths.' },
  'computing.hi.turing': { hook: '**Turing: Bletchley Park, the Turing machine, the Turing test.**', example: 'Alan Turing’s portrait appears on the Bank of England £50 note.' },
  'computing.hi.colossus': { hook: '**Colossus was colossal**: a room-sized electronic codebreaker.', example: 'A working rebuild of Colossus can be seen at the National Museum of Computing at Bletchley Park.' },
  'computing.hi.transistor': { hook: '**The transistor replaced the valve**: smaller, cooler, cheaper and more reliable.', example: 'Pocket transistor radios of the 1950s were among the first gadgets the transistor made possible.' },
  'computing.hi.web': { hook: '**Tim Berners-Lee, CERN, 1989: the World Wide Web.**', example: 'The first website, made at CERN, can still be visited today.' },
  'computing.hi.timeline': { hook: '**Gears, then engines, then valves, then the web**: ancient Greece, the 1830s, 1944, 1989.' },

  // ethics and law
  'computing.et.cma': { hook: '**Computer Misuse Act 1990 = the hacking law.**', example: 'Logging into a friend’s account without permission, even as a joke, can break this law.' },
  'computing.et.dpa': { hook: '**Data Protection Act = your data, your rights**: kept safe, accurate and no longer than needed.', example: 'You can ask any organisation for a copy of the personal data it holds about you.' },
  'computing.et.copy': { hook: '**Copyright: the right to copy belongs to the creator.**', example: 'Using a song in your video without permission can get the video muted or taken down.' },
  'computing.et.bias': { hook: '**Biased data in, biased decisions out.**' },
  'computing.et.ewaste': { hook: '**Reduce, reuse, recycle**, old tech included.', example: 'A tonne of old phones holds far more gold than a tonne of gold ore, so recycling them really pays.' },
  'computing.et.divide': { hook: '**The digital divide is the gap between the connected and the unconnected.**', example: 'When schools closed in 2020, some pupils had no laptop or internet for online lessons.' },
  'computing.et.deepfake': { hook: '**Deepfake = deep learning + fake.**', example: 'Fraudsters have used AI-copied voices to pretend to be family members asking for money.' },

  // trace tables, two’s complement, SQL, topologies (stretch)
  'computing.tr.what': { hook: '**A trace table is an action replay** of every variable.' },
  'computing.tr.row': { hook: '**New value? New row.**' },
  'computing.tw.sign': { hook: '**Sign and magnitude has +0 and −0**: two zeros, one too many.' },
  'computing.tw.msb': { hook: '**The top bit is −128**; the other seven bits are positive as usual.' },
  'computing.tw.flip': { hook: '**Flip the bits, then add 1.**' },
  'computing.sq.record': { hook: '**Record = row = one thing; field = column = one detail about it.**', example: 'In a school register, each pupil is a record and date of birth is a field.' },
  'computing.sq.field': { hook: '**Field = column**, like a heading in a spreadsheet.' },
  'computing.sq.pk': { hook: '**Primary key = a unique ID**, like a passport number.', example: 'Your NHS number is a primary key: no two people share one.' },
  'computing.sq.select': { hook: '**SELECT what, FROM where, WHERE which.**' },
  'computing.sq.star': { hook: 'The star is a wildcard: **SELECT star means every field.**' },
  'computing.tp.star': { hook: '**Star = a hub in the middle**: if the centre fails, everything fails.', example: 'Most home networks are stars, with the router at the centre.' },
  'computing.tp.mesh': { hook: '**Mesh = many routes**: one link breaks, take another.', example: 'Mesh Wi-Fi uses several units around a house that pass data between each other.' },
  'computing.tp.client': { hook: '**The client asks; the server serves.**', example: 'Streaming a video: your phone is the client, and the company’s computers are the servers.' },
  'computing.tp.mac': { hook: '**MAC sticks to the machine; IP changes with the place.**', example: 'Your laptop gets a different IP address at school and at home, but its network card keeps the same MAC address.' },
  'computing.tp.layers': { hook: '**All Teachers Inspire Learners**: Application, Transport, Internet, Link.', example: 'Watching a video: the app asks (application), TCP splits it up (transport), IP routes it (internet), Wi-Fi carries it (link).' },
  'computing.tp.layerwhy': { hook: '**Layers are a team where each member has one job.**', example: 'Like posting a letter: you write it, the post office sorts it, the van carries it; none needs the others’ job.' },
};

for (const t of topics) if (TOPIC_HOOKS[t.id]) t.hook = TOPIC_HOOKS[t.id];
for (const id of Object.keys(TOPIC_HOOKS)) if (!topics.some((t) => t.id === id)) throw new Error(`memory hook for unknown topic ${id}`);
for (const it of items) if (MEMORY[it.id]) Object.assign(it, MEMORY[it.id]);
for (const id of Object.keys(MEMORY)) if (!items.some((it) => it.id === id)) throw new Error(`memory hook for unknown item ${id}`);

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
// Network shapes (star, mesh, bus) and logic-gate symbols cannot be drawn yet, so topologies has
// none and logic shows truth tables.
const M = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });
const BITS = [128, 64, 32, 16, 8, 4, 2, 1];
const TWOS = ['−128', 64, 32, 16, 8, 4, 2, 1];
const bits = (s) => s.split('');
const SHAPES = { kind: 'table', head: ['shape', 'used for'], rows: [['oval', 'Start and Stop'], ['parallelogram', 'input or output: Ask for a name'], ['rectangle', 'a process: add 1 to score'], ['diamond', 'a decision, with Yes and No exits']] };
const FDE = { kind: 'cycle', steps: ['Fetch the next instruction from RAM', 'Decode: work out what it means', 'Execute: carry it out'], centre: 'CPU' };
const HEROES = { kind: 'table', head: ['id', 'name', 'home', 'strength'], rows: [['1', 'Perseus', 'Argos', '78'], ['2', 'Theseus', 'Athens', '84'], ['3', 'Jason', 'Iolcus', '71'], ['4', 'Atalanta', 'Arcadia', '88']], caption: 'Table Heroes. Each row is a record; each column is a field. id is the primary key: unique for every record.' };
const TOPIC_VISUALS = {
  'computing.flowcharts': [SHAPES, { kind: 'flow', steps: ['Start', 'Input heads', 'Decision: is heads > 7?', 'Yes: output “Hydra!” / No: output “Just a snake”', 'Stop'], caption: 'Sequence, then selection: the decision diamond has two exits.' }],
  'computing.python': { kind: 'table', head: ['variable', 'value', 'type'], rows: [['name', '"Athena"', 'str'], ['heads', '9', 'int'], ['price', '3.14', 'float'], ['alive', 'True', 'bool']], caption: 'Each variable is a named box. The type matters: "3" + "4" gives "34", but 3 + 4 gives 7.' },
  'computing.selection': { kind: 'flow', steps: ['if heads > 7: True? print “Hydra!” and skip the rest', 'elif heads > 1: checked only if the if was False', 'else: runs only if everything above was False'], caption: 'Python checks the conditions in order and runs only the first one that is True.' },
  'computing.loops': { kind: 'cycle', steps: ['Check: is lives > 0?', 'True: run the loop body', 'Update: lives = lives − 1'], centre: 'False? Leave the loop', caption: 'A while loop. Leave out the update and the check never becomes False: an infinite loop.' },
  'computing.lists': { kind: 'table', head: ['index', 'item', 'from the end'], rows: [['0', '"Clio"', '−3'], ['1', '"Calliope"', '−2'], ['2', '"Urania"', '−1']], caption: 'muses = ["Clio", "Calliope", "Urania"]. Counting starts at 0, so muses[0] is "Clio" and muses[3] does not exist.' },
  'computing.searching': { kind: 'flow', steps: ['Sorted list: 4 9 15 22 30 41 56', 'Check the middle, **22**. 41 is bigger, so drop 22 and everything left of it', 'Left: 30 41 56. Check the middle, **41**: found!'], caption: 'Binary search for 41: found in 2 checks. A linear search, checking each item in turn, needs 6.' },
  'computing.sorting': { kind: 'table', rows: [['start', '5', '1', '4', '2', '8'], ['after pass 1', '1', '4', '2', '5', '**8**'], ['after pass 2', '1', '2', '4', '**5**', '**8**'], ['pass 3', '1', '2', '4', '5', '8']], caption: 'Bubble sort: compare neighbours and swap if they are in the wrong order. The biggest bubbles to the end each pass. Pass 3 makes no swaps, so it stops.' },
  'computing.binary': M({ type: 'pvgrid', cols: BITS, rows: [bits('00101101')] }, '00101101 = 32 + 8 + 4 + 1 = 45. Split it into two nibbles: 0010 = 2 and 1101 = 13 = D, so 45 is 2D in hex.'),
  'computing.binarymaths': [
    { kind: 'table', head: ['add', 'write', 'carry'], rows: [['0 + 0', '0', '0'], ['0 + 1', '1', '0'], ['1 + 1', '0', '**1**'], ['1 + 1 + 1', '1', '**1**']] },
    M({ type: 'pvgrid', cols: BITS, rows: [['', '', '', '', '1', '1', '', ''], bits('00100110'), bits('00010011'), bits('00111001')] }, 'Top row: the carries. 00100110 (38) + 00010011 (19) = 00111001 (57).'),
  ],
  'computing.media': M({ type: 'squares', cols: 7, rows: 6, cells: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'].flatMap((row, r) => [...row].flatMap((b, c) => (b === '1' ? [[r, c]] : []))) }, 'With 1 bit per pixel, each pixel is 1 (coloured) or 0 (blank): the top row is 0110110. 7 × 6 pixels × 1 bit = 42 bits.'),
  'computing.logic': [
    { kind: 'table', head: ['A', 'B', 'A AND B', 'A OR B', 'A XOR B'], rows: [['0', '0', '0', '0', '0'], ['0', '1', '0', '1', '1'], ['1', '0', '0', '1', '1'], ['1', '1', '**1**', '1', '**0**']], caption: 'AND needs both; OR needs at least one; XOR needs exactly one.' },
    { kind: 'table', head: ['A', 'NOT A'], rows: [['0', '1'], ['1', '0']], caption: 'NOT has one input and flips it.' },
  ],
  'computing.hardware': FDE,
  'computing.software': [
    { kind: 'flow', steps: ['You, the user', 'Applications: browser, games, Python', 'Operating system: memory, files, devices', 'Hardware: CPU, RAM, storage'], caption: 'Layers: each one uses the one below.' },
    { kind: 'flow', across: true, steps: ['Python code (high-level)', 'compiler or interpreter', 'machine code (binary)'], caption: 'A translator turns the code we write into machine code the CPU can run.' },
  ],
  'computing.networks': { kind: 'flow', steps: ['The email is split into numbered packets', 'Each packet carries the destination IP address', 'Routers send each packet on the best route now', 'Packets may arrive out of order', 'They are put back in order by number'] },
  'computing.history': { kind: 'timeline', from: 1820, to: 2000, events: [[1837, 'Babbage’s Analytical Engine'], [1843, 'Lovelace’s program'], [1936, 'Turing machine'], [1944, 'Colossus'], [1947, 'the transistor'], [1989, 'the World Wide Web']], caption: 'The Antikythera mechanism, a Greek geared calculator, is far older: over 2,000 years old.' },
  'computing.trace': { kind: 'table', head: ['step', 'i', 'total'], rows: [['total = 0', '', '0'], ['loop, i = 1', '1', '1'], ['loop, i = 2', '2', '3'], ['loop, i = 3', '3', '**6**']], caption: 'Tracing `total = 0` then `for i in range(1, 4): total = total + i`: one new row each time a value changes.' },
  'computing.twos': M({ type: 'pvgrid', cols: TWOS, rows: [bits('00010100'), bits('11101011'), bits('11101100')] }, '20 = 00010100. Flip every bit: 11101011. Add 1: 11101100 = −128 + 64 + 32 + 8 + 4 = −20.'),
  'computing.sql': HEROES,
};
const ITEM_VISUALS = {
  'computing.fc.diamond': SHAPES,
  'computing.fc.para': SHAPES,
  'computing.ls.range': { kind: 'table', head: ['index', 'item'], rows: [['0', '"Clio"'], ['1', '"Calliope"'], ['2', '"Urania"'], ['3', '**nothing there: IndexError**']] },
  'computing.so.merge': { kind: 'flow', steps: ['6 2 7 3', 'split: 6 2 | 7 3', 'split: 6 | 2 | 7 | 3', 'merge pairs: 2 6 | 3 7', 'merge: 2 3 6 7'], caption: 'Divide and conquer: split until each piece has one item, then merge the sorted pieces.' },
  'computing.bn.colour': M({ type: 'pvgrid', cols: [16, 1], rows: [['F', 'F']] }, 'F = 15, so FF = 15 × 16 + 15 = 255, the biggest number one byte can hold.'),
  'computing.bm.overflow': M({ type: 'pvgrid', cols: ['9th', ...BITS], rows: [['', ...bits('11001000')], ['', ...bits('01100100')], ['1', ...bits('00101100')]] }, '200 + 100 = 300 needs 9 bits. The 1 that spills into a 9th column is lost: overflow. The byte keeps 00101100 = 44.'),
  'computing.bm.right': M({ type: 'pvgrid', cols: BITS, rows: [['', '', '1', '0', '1', '1', '0', '0'], ['', '', '', '1', '0', '1', '1', '0']], shift: -1 }, 'Right shift by 1: every bit moves one place right, so 44 becomes 22 (halved).'),
  'computing.hw.cycle': FDE,
  'computing.tw.msb': M({ type: 'pvgrid', cols: TWOS, rows: [bits('10000000'), bits('01111111'), bits('11111111')] }, '10000000 = −128 (the smallest); 01111111 = 127 (the largest); 11111111 = −128 + 127 = −1.'),
  'computing.sq.select': { kind: 'table', head: ['name', 'home'], rows: [['Perseus', 'Argos'], ['**Theseus**', '**Athens**'], ['Jason', 'Iolcus'], ['Atalanta', 'Arcadia']], caption: '`SELECT name FROM Heroes WHERE home = \'Athens\';` keeps only the rows where home is Athens, and shows their name field: Theseus.' },
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'computing', deck: 'y8', topics, items }];

// Years 2/3 bonus module: Florence Nightingale (and Mary Seacole), front-loading the KS1
// "significant individuals" unit at greater depth, with some Year 3 stretch (sources, the
// rose diagram, then and now). The child can pick it any time from the front page; every topic
// carries bonus: 'nightingale'. It builds on the short core topic history.nurses (Lady with the
// Lamp, Crimean War, cleanliness, the British Hotel, the nursing school) without repeating it.
//
// Facts checked (and myths avoided):
// - Born 12 May 1820 in Florence, Italy, and named after the city (her sister Parthenope after
//   the old Greek name for Naples); a wealthy family (Lea Hurst, Derbyshire; Embley Park, Hampshire);
//   taught at home by her father; felt "called" at 16 (1837); visited Kaiserswerth in 1850 and
//   trained there for about three months in 1851; ran a small hospital for gentlewomen in Harley
//   Street, London, in 1853; rescued a little owl, Athena, in Athens (now in the Florence
//   Nightingale Museum).
// - Crimean War 1853-1856 (Russia against the Ottoman Empire, Britain, France). She left in
//   October 1854 with 38 nurses and reached the Barrack Hospital at Scutari (Selimiye Barracks,
//   today Uskudar in Istanbul, across the Bosphorus from Constantinople) on 4 November 1854.
//   Far more soldiers died of illness than of wounds. "The Lady with the Lamp" comes from a Times
//   report of her lonely night rounds and Longfellow's poem; the lamp was a folding Turkish lantern
//   (a fanoos) with a candle, NOT the teapot-shaped lamp of later pictures. She fell ill with
//   "Crimean fever" in 1855, recovered and stayed until 1856.
// - The Sanitary Commission arrived in March 1855 (drains flushed, ventilation, water); deaths fell
//   sharply afterwards. Her polar area ("rose") diagram (1858): two roses, April 1854-March 1855 and
//   April 1855-March 1856; 12 wedges, one per month; blue = preventable ("zymotic") diseases, red =
//   wounds, black = other causes; she did not invent this kind of chart but made it famous. First
//   woman elected to the Statistical Society of London, now the Royal Statistical Society (1858);
//   worked with William Farr.
// - British deaths in the war, the most quoted figures: 2,755 killed in action, 2,019 died of
//   wounds, 16,323 died of disease (21,097 in all), so about 3 in 4 died of illness. Other tallies
//   vary a little but all give 75-80% from disease: the pie below says "about".
// - Notes on Nursing (1859); Nightingale Training School for nurses, St Thomas' Hospital, opened
//   9 July 1860, paid for by the Nightingale Fund; first woman awarded the Order of Merit (1907,
//   aged 87); died 13 August 1910 aged 90; buried at East Wellow, Hampshire; on the Bank of England
//   £10 note 1975-1994; International Nurses Day on her birthday, 12 May. She did not invent nursing.
// - Mary Seacole: born Mary Grant in Kingston, Jamaica, in 1805; her mother a "doctress" using
//   herbal remedies; nursed cholera in Jamaica and Panama; turned down in London; paid her own way
//   with her partner Thomas Day; met Florence once at Scutari; built the British Hotel (scrap wood
//   and iron) at Spring Hill near Balaclava in 1855; tended soldiers on the battlefield ("Mother
//   Seacole"); Wonderful Adventures of Mrs Seacole in Many Lands (1857); died 14 May 1881 in London;
//   statue at St Thomas' Hospital (2016).
// - Germs: Florence long believed illness came from bad air ("miasma"); germ theory was proved in
//   the years after the war, and her fresh air and cleaning worked partly because they removed germs.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `history.fn.${id}`, topic: `history.fn-${topic}`, kind: 'fact', prompt, answer, distractors, explain, formats: ['choice'], ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `history.fn.${id}`, topic: `history.fn-${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `history.fn.${id}`, topic: `history.fn-${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
// true or false, always shown in that order
const tf = (id, topic, statement, isTrue, wrongFeedback, explain, extra = {}) => mcq(id, topic, `True or false? ${statement}`, [['True', isTrue, isTrue ? undefined : wrongFeedback], ['False', !isTrue, isTrue ? wrongFeedback : undefined]], explain, { keepOrder: true, ...extra });
// then or now: one fixed set of options, in the same order every time
const THEN = 'In Florence’s time', NOW = 'In hospitals today', BOTH = 'Both then and now';
const tn = (id, statement, answer, feedback, explain, extra = {}) => mcq(id, 'thennow', `Then, now or both? ${statement}`, [THEN, NOW, BOTH].map((o) => [o, o === answer, o === answer ? undefined : feedback]), explain, { keepOrder: true, ...extra });

const B = { bonus: 'nightingale' };
const topics = [
  { id: 'history.fn-life', title: 'Who was Florence Nightingale?', kind: 'facts', prereqs: [], batch: 7, ...B,
    intro: 'Florence Nightingale was born more than 200 years ago, into a rich family. Rich girls were not expected to have jobs, but Florence wanted to be a nurse. She would not give up, and in the end she changed hospitals for ever.',
    teach: 'Explain why Florence’s family did not want her to be a nurse, and what she did about it.',
    talk: 'Ask {him} what {she} would like to be when {she} grows up, and what {she} would do if someone said no.',
    hook: 'Florence was born in Florence: her parents named her after the Italian city.' },
  { id: 'history.fn-crimea', title: 'The Crimean War and the hospital at Scutari', kind: 'facts', prereqs: ['history.fn-life'], batch: 7, ...B,
    intro: 'In 1854 Britain was at war with Russia, far away in the Crimea, by the Black Sea. Many soldiers fell ill and were sent to a big army hospital at Scutari. It was dirty and crowded, so Florence took a team of nurses to help.',
    teach: 'Explain what was wrong with the hospital at Scutari, and three things Florence and her nurses did to make it better.',
    talk: 'When {she} washes {her} hands before tea, ask {him} why Florence Nightingale would approve.',
    hook: 'Say it: Scutari is SKOO-tuh-ree and the Crimea is cry-MEE-uh.' },
  { id: 'history.fn-seacole', title: 'Mary Seacole too', kind: 'facts', prereqs: ['history.fn-crimea'], batch: 7, ...B,
    intro: 'Mary Seacole was born in Jamaica in 1805. Her mother taught her to heal people with medicines made from plants. When the Crimean War began, Mary wanted to help the soldiers. She was not chosen to go, so she went anyway and paid for the journey herself!',
    teach: 'Explain one way Mary Seacole and Florence Nightingale were alike, and one way they were different.',
    talk: 'Find Jamaica, London and the Black Sea on a map or globe with {him}. How far did Mary travel?',
    hook: 'Mary from Jamaica, Florence from Florence: two brave women, one war.' },
  { id: 'history.fn-stories', title: 'Stories from the Crimean War', kind: 'reading', prereqs: ['history.fn-crimea', 'history.fn-seacole'], batch: 5, ...B,
    intro: 'Three short stories based on true events: young Florence, a soldier in the hospital at Scutari, and a cold soldier who visits Mary Seacole. Read each one carefully, then be a history detective: what do the clues tell you?',
    teach: 'Tell your grown-up which story you liked best, and one clue that showed how a person felt.',
    talk: 'Ask {him} why {she} thinks the soldiers loved Florence and Mary so much.' },
  { id: 'history.fn-numbers', title: 'Counting to save lives: Florence’s rose diagram', kind: 'facts', prereqs: ['history.fn-crimea'], batch: 7, ...B,
    intro: 'Florence loved numbers. She counted how many soldiers died, and what they died of. Then she turned her numbers into pictures, so that busy people could see the problem at a glance. Her most famous picture looks a little like a rose.',
    teach: 'Explain what the blue parts of Florence’s rose diagram showed, and why her picture helped persuade people to make hospitals cleaner.',
    talk: 'Keep a tally of the weather for a week together, then draw it as a bar chart. Ask {him} what the chart shows at a glance.',
    hook: 'Big blue wedges meant a big problem: illnesses that could have been stopped.' },
  { id: 'history.fn-later', title: 'After the war: a school for nurses', kind: 'facts', prereqs: ['history.fn-numbers'], batch: 7, ...B,
    intro: 'Florence came home from the war a hero, but she did not want parties. For the rest of her long life she worked to make hospitals safer and to turn nursing into a proper job, with training.',
    teach: 'Explain how Florence changed nursing after the war, and how we still remember her today.',
    talk: 'On 12 May (International Nurses Day), ask {him} to think of a nurse {she} could say thank you to.',
    hook: 'A book in 1859, a school in 1860: _Notes on Nursing_, then the Nightingale School.' },
  { id: 'history.fn-thennow', title: 'Then and now: hospitals and nursing', kind: 'facts', prereqs: ['history.fn-later', 'history.fn-seacole'], batch: 7, ...B,
    intro: 'Hospitals in Victorian times were very different from hospitals today. Some of the biggest changes began with Florence’s ideas about cleanliness and training. How do we know what her hospitals were like? From clues the past has left behind.',
    teach: 'Explain three ways hospitals today are different from Florence’s hospital, and one way they are the same.',
    talk: 'If {she} has visited a doctor or a hospital, ask {him} what was clean, what the nurses wore and what machines {she} saw.',
    hook: 'Then: lanterns, buckets and scrubbing brushes. Now: electric lights, machines and hand gel.' },
  { id: 'history.fn-stories-2', title: 'Stories: a clever picture and a museum visit', kind: 'reading', prereqs: ['history.fn-thennow', 'history.fn-stories'], batch: 5, ...B,
    intro: 'Two more stories: how Florence turned numbers into a picture that changed people’s minds, and a girl who visits the Florence Nightingale Museum with her grandma. Find the clues, then answer.',
    teach: 'Tell your grown-up how we know about Florence today: name two clues from the past.',
    talk: 'Ask {him} which object from Florence’s life {she} would most like to see in a museum, and why.' },
];

// ---------------------------------------------------------------- reading passages (original)
const STORY = 'A story written for this app, based on true events';
const P = (passage, passageSource = STORY) => ({ passage, passageSource });
const YOUNG = P(`The Girl Who Would Not Give Up

Florence Nightingale grew up in a big house with servants, horses and beautiful gardens. Her parents expected her to go to parties, marry a rich man and never have a job.

But Florence wanted something different. She liked visiting poor families in the village when they were ill, and she was good at caring for them. When she was in her twenties, she told her family that she wanted to be a nurse.

Her mother was horrified. Her sister cried. In those days hospitals were dirty places, and nurses had no proper training. It was not thought a suitable job for a lady.

Florence did not give up. Every morning she woke before dawn, while the house was still quiet, and read reports about hospitals by candlelight. She filled notebooks with facts and numbers.

Year after year, she kept asking. At last, when she was 30, she visited a hospital and nursing school at Kaiserswerth in Germany. The next year she went back to train there. Now Florence felt she was doing the work she was born to do.`);
const LAMP = P(`The Lamp in the Night

Private Tom Reed had never felt so ill. He lay on a thin mattress in the army hospital at Scutari, squashed between two other soldiers. The floor was filthy, and he could hear rats scurrying in the dark.

Then the nurses came.

They arrived with buckets, soap and scrubbing brushes. In charge was a slim, quiet lady in a plain black dress. She did not shout, but everyone did what she said. Her name was Miss Nightingale.

Soon the floor was scrubbed clean. Tom had a clean shirt for the first time in weeks. A nurse brought him warm soup and held the cup while he drank.

At night, when the doctors had gone to bed, a soft light moved slowly along the ward. It was Miss Nightingale, carrying a little Turkish lantern. She stopped at each bed. She tucked in a blanket here and spoke a kind word there.

When her shadow passed over him, Tom smiled. He wrote to his mother: “She makes us feel that somebody cares.”

Tom grew stronger every day. By the spring, he was well enough to go home.`);
const HOTEL = P(`Mother Seacole’s Hotel

Corporal Jack Lewis stamped his frozen feet. It was winter in the Crimea, and the army camp was cold and muddy.

“Come to Mother Seacole’s,” said his friend. “She’ll warm you up.”

On a little hill stood a building made of old planks and sheets of iron. A painted sign said British Hotel. Inside, it was warm and smelled of hot stew and fresh bread. Soldiers sat at the tables, laughing.

Behind the counter stood a smiling woman in a bright dress and bonnet. She had been born in Jamaica, and she had paid for her long journey to the Crimea herself.

“You look poorly, young man,” she said, and handed Jack a steaming drink made from herbs. “Drink that up.”

Later, Jack saw Mrs Seacole ride out towards the battlefield, her bags full of bandages, medicines and food. She did not seem afraid at all.

“Why does she do it?” Jack asked.

His friend smiled. “Because she cares about every one of us. That’s why we call her Mother.”`);
const ROSE = P(`The Picture That Changed Minds

Florence came home from the war in 1856, but she could not stop thinking about the soldiers who had died. Most of them had not been killed in battle. They had died of illnesses that spread in dirty, crowded hospitals.

Florence was sure that clean hospitals could save thousands of lives. But many important men would not listen.

So Florence did what she was best at. She collected numbers. Month by month, she counted how many soldiers had died, and why. She worked with a clever doctor called William Farr, who loved numbers as much as she did.

Then she had an idea. Long lists of numbers were dull, and busy people did not read them. What if she turned the numbers into a picture?

She drew a circle cut into twelve wedges, one for each month, like the petals of a flower. She coloured the deaths from illnesses that could have been prevented in blue. The blue wedges were huge. The red wedges, for deaths from wounds, were much smaller.

Anyone could see the problem at a glance. Her picture helped persuade the government to make army hospitals cleaner and healthier.`);
const MUSEUM = P(`Ellie’s Visit to the Museum

Ellie’s grandma had been a nurse for forty years, so for Ellie’s seventh birthday they went to the Florence Nightingale Museum in London.

The first thing Ellie saw was a lantern. It was not shiny like the lamp in her storybook. It was a plain folding Turkish lantern, and once a candle had glowed inside it.

“Florence carried a lantern like this round the wards at night,” said Grandma.

Next they saw a little owl in a glass case. “That’s Athena,” said Grandma. “Florence rescued her in Greece and carried her about in her pocket.”

Ellie giggled. Then she stopped beside some old letters with spidery handwriting. “Did Florence write these?”

“Yes. She wrote thousands of letters. That’s one way we know so much about her.”

On the way out, they walked through the hospital. Outside a ward, a nurse in a blue uniform was rubbing gel on his hands before he went to see a patient.

“Look, Grandma,” said Ellie. “He’s doing what Florence wanted. Keeping everything clean!”

Grandma smiled. “Lots of things have changed since Florence’s time,” she said, “but caring for people hasn’t.”`, 'A story written for this app');

const items = [
  // --- 1. Who was Florence Nightingale?
  fact('born-city', 'life', 'Florence Nightingale was named after the city where she was born. Which city?', 'Florence, in Italy', ['London, in England', 'Paris, in France', 'Athens, in Greece'], 'Her parents were travelling in Italy when she was born. Her big sister was born in Naples and was named Parthenope, an old Greek name for Naples!', { feedback: { 'London, in England': 'She grew up in England, but she was born in Italy.' } }),
  fact('born-year', 'life', 'In which year was Florence Nightingale born?', '1820', ['1066', '1920', '1666'], 'She was born on 12 May 1820, more than 200 years ago. Queen Victoria was still a baby then.', { hook: '12 May 1820. Her birthday, 12 May, is now International Nurses Day.' }),
  mcq('rich', 'life', 'What was Florence’s family like?', [['Rich, with two big country houses', true], ['Poor, living in one small room', false, 'Her family was rich. They had servants and two big houses.'], ['A family of nurses and doctors', false, 'Nobody in her family was a nurse, and they did not want her to be one!']], 'The Nightingales had a house called Lea Hurst in Derbyshire and another called Embley Park in Hampshire.'),
  mcq('lessons', 'life', 'Who taught Florence when she was a girl?', [['Her father, at home', true], ['Teachers at a big school', false, 'Rich girls then were usually taught at home, not at school.'], ['Nurses at a hospital', false, 'She did not work in hospitals until she was grown up.']], 'Her father taught her history, languages such as Latin and Greek, and maths. Florence loved maths and facts.', { example: 'Florence’s love of maths later helped her save lives. Numbers can be a superpower!' }),
  mcq('notjob', 'life', 'Why didn’t Florence’s family want her to be a nurse?', [['Nursing was not seen as a good job', true], ['They thought nurses got paid too much', false, 'Nurses were paid very little.'], ['There were no hospitals in Britain', false, 'There were hospitals, but they were often dirty and the nurses were not trained.']], 'In those days nurses had no proper training, and nursing was not thought respectable for a rich young lady. Her family expected her to marry instead.'),
  fact('called', 'life', 'How old was Florence when she first felt sure that she had important work to do in life?', '16', ['6', '60', '36'], 'At 16 she wrote that she felt God was calling her to do His work. Some years later she decided that her work was nursing.'),
  mcq('determined', 'life', 'Florence kept asking her family for years, until at last they let her train. What does this show about her?', [['She was determined', true], ['She was easily bored', false, 'Bored people give up! Florence kept on asking for years.'], ['She was very forgetful', false, 'She never forgot her dream of nursing.']], 'Determined means you keep going even when it is hard. That is a big part of why Florence is remembered.'),
  fact('kaiserswerth', 'life', 'Where did Florence go to train as a nurse, in 1851?', 'Kaiserswerth, in Germany', ['Edinburgh, in Scotland', 'Florence, in Italy', 'Cardiff, in Wales'], 'At Kaiserswerth (say KY-zers-vairt) a pastor and his wife ran a hospital and a school where women trained as nurses. Florence stayed for about three months.'),
  fact('harley', 'life', 'In 1853, before the war, Florence got her first big nursing job. What was it?', 'running a hospital in London', ['teaching at a school in Paris', 'driving a train in Wales', 'sailing a ship to India'], 'She ran a small hospital for sick ladies in Harley Street, London, and made it clean and well organised. People began to hear how good she was.'),
  mcq('owl', 'life', 'Florence had an unusual pet that she carried in her pocket. What was it?', [['A small owl called Athena', true], ['A hamster called Nibbles', false, 'Good guess, but it was a bird: a little owl.'], ['A white mouse called Snowy', false, 'It was a little owl that she rescued in Athens, in Greece.']], 'She rescued the baby owl in Athens and named it Athena. Athena is still kept (stuffed) at the Florence Nightingale Museum in London.'),
  fact('bird', 'life', 'A nightingale is also a small brown bird. What is it famous for?', 'singing at night', ['swimming underwater', 'building huge nests', 'running very fast'], 'Nightingales sing beautifully, often at night. Florence did some of her most famous work at night too.', { visual: { kind: 'sounds', words: ['n.igh.t', 'i.n', 'g.a_e.l'], caption: 'Night-in-gale: say her name in three beats.' } }),
  tf('tf-first', 'life', 'Florence Nightingale was the very first nurse.', false, 'People have cared for the sick for thousands of years. Florence made nursing a proper, trained job.', 'Nursing is very old. Florence did not invent it, but she showed how training, cleanliness and care could save many lives.'),
  order('life-order', 'life', 'Put Florence’s life in order, earliest first.', ['She is born in Italy', 'She trains in Germany', 'She goes to the war', 'She opens a nursing school'], 'Born in 1820, trained at Kaiserswerth in 1851, went to Scutari in 1854 and opened her nursing school in 1860.'),

  // --- 2. The Crimean War and Scutari
  fact('war', 'crimea', 'In the Crimean War, Britain, France and Turkey fought against which country?', 'Russia', ['Germany', 'Spain', 'America'], 'The war lasted from 1853 to 1856. Britain and France joined in 1854 to help Turkey, which was then called the Ottoman Empire.'),
  fact('where', 'crimea', 'The Crimea (say cry-MEE-uh) is a piece of land that sticks out into which sea?', 'the Black Sea', ['the Red Sea', 'the North Sea', 'the Dead Sea'], 'The Crimea is a peninsula: land with sea on almost every side. The Black Sea lies between Europe and Asia.'),
  fact('scutari', 'crimea', 'The army hospital at Scutari was across the water from which great city, today called Istanbul?', 'Constantinople', ['Jerusalem', 'St Petersburg', 'Alexandria'], 'Scutari is now called Üsküdar, part of Istanbul in Turkey. The hospital was hundreds of miles across the Black Sea from the fighting, so the soldiers came by ship.', { hook: 'Constantinople was the old name, Istanbul is the new one: the same city.' }),
  mcq('dirty', 'crimea', 'What was the hospital at Scutari like when Florence arrived?', [['Dirty, crowded and full of rats', true], ['Clean, quiet and full of doctors', false, 'Sadly not. It was dirty, and there were not enough doctors.'], ['Empty, with no soldiers in it', false, 'It was packed with soldiers who were ill or hurt.']], 'There were rats and fleas, broken drains, and not enough beds, blankets, soap or clean water.'),
  fact('nurses38', 'crimea', 'How many nurses did Florence take with her to Scutari?', '38', ['3', '380', '8'], 'She set out in October 1854 with a team of 38 nurses. Some were nuns, and some were nurses from hospitals.'),
  fact('arrive', 'crimea', 'In which month and year did Florence arrive at Scutari?', 'November 1854', ['November 1066', 'May 1820', 'July 1940'], 'She arrived on 4 November 1854, just as a terrible winter was beginning.', { feedback: { 'May 1820': 'That is when she was born!' } }),
  mcq('asked', 'crimea', 'Who asked Florence to lead the nurses going to the war?', [['A friend in the government', true], ['A general in the Russian army', false, 'Russia was on the other side in the war!'], ['A doctor from her nursing school', false, 'Her nursing school did not open until 1860, after the war.']], 'Sidney Herbert, who looked after the army’s money and supplies, asked her to go. He knew how good she was at running a hospital.'),
  mcq('news', 'crimea', 'How did people in Britain find out about the terrible army hospital?', [['From reports in a newspaper', true], ['From the television news', false, 'There was no television then: it was first shown in 1926.'], ['From messages on the internet', false, 'No internet then! News came in newspapers.']], 'Reporters for The Times newspaper wrote about how badly the sick and wounded soldiers were looked after. People at home were shocked.'),
  mcq('laundry', 'crimea', 'Florence set up a laundry to wash the soldiers’ sheets and shirts. Why did that help?', [['Clean sheets spread less illness', true], ['The soldiers enjoyed doing washing', false, 'The soldiers were too ill to work. Think about dirt and illness.'], ['It made the hospital much quieter', false, 'A laundry is noisy and steamy! Think about dirt and illness.']], 'Shirts and sheets had hardly been washed. Clean bedding and clothes helped to stop illness spreading.', { example: 'Hospitals today still wash sheets very hot, and change them for every new patient.' }),
  mcq('food', 'crimea', 'What else did Florence do to help the soldiers get better?', [['Gave them better food', true], ['Gave them all medals', false, 'Medals come from the army, not from nurses.'], ['Sent them into battle', false, 'Nurses help soldiers get better, not fight.']], 'She set up kitchens to cook healthy food for the sickest soldiers. Later a famous French chef, Alexis Soyer, came to help.'),
  mcq('loved', 'crimea', 'Why do you think the soldiers loved Florence’s night-time visits?', [['She showed them someone cared', true], ['She woke them up to play noisy games', false, 'The soldiers needed rest. Her visits were quiet and kind.'], ['She brought them their medals', false, 'Nurses do not give out medals. Think about how a kind visit feels.']], 'Many soldiers were far from home, ill and lonely. A kind word in the dark made them feel cared for. One soldier wrote that they kissed her shadow as it passed.'),
  fact('lamp', 'crimea', 'Pictures often show Florence holding a lamp like a little teapot. What did she really carry?', 'a Turkish lantern', ['a battery torch', 'a flaming torch on a stick', 'an electric lamp'], 'It was a folding lantern called a fanoos, with a candle inside. The Florence Nightingale Museum in London has one that is thought to have been carried by her.', { hook: 'A lantern from Turkey, because Scutari is in Turkey.', feedback: { 'a battery torch': 'Battery torches had not been invented!', 'a flaming torch on a stick': 'An open flame in a ward full of beds would be dangerous. Her lantern kept the candle safe inside.', 'an electric lamp': 'There was no electric light in 1854.' } }),
  tf('tf-illness', 'crimea', 'In the Crimean War, more British soldiers died of illness than of wounds from battle.', true, 'Sadly, illnesses such as cholera and typhus killed far more soldiers than wounds did.', 'Dirt, bad water and crowding spread illness. That is why cleaning up the hospitals mattered so much.'),
  mcq('ill', 'crimea', 'In 1855 Florence caught a fever and became very ill herself. What happened next?', [['She got better and kept working', true], ['She went home and gave up nursing', false, 'She did not give up! She stayed until the war was over.'], ['She stopped helping the soldiers', false, 'As soon as she was well enough, she went back to work.']], 'She got better and stayed until the summer of 1856, after the war had ended. Being ill did not stop her.'),

  // --- 3. Mary Seacole too
  fact('ms-born', 'seacole', 'Where was Mary Seacole born?', 'Jamaica', ['Scotland', 'Italy', 'Russia'], 'Mary was born in Kingston, Jamaica, an island in the Caribbean. Her father was a Scottish soldier and her mother was Jamaican.', { feedback: { Italy: 'That was Florence! Mary was born in Jamaica.', Scotland: 'Her father was Scottish, but Mary was born in Jamaica.' } }),
  fact('ms-older', 'seacole', 'Mary Seacole was born in 1805. Florence was born in 1820. Who was older?', 'Mary Seacole', ['Florence Nightingale', 'neither: the same age'], 'Mary was born 15 years before Florence. In the Crimea, Mary was about 50 years old.', { hook: '1805 comes before 1820, so Mary was born first.' }),
  mcq('ms-herbs', 'seacole', 'What did Mary’s mother teach her?', [['To heal with plant medicines', true], ['To sail a ship across the sea', false, 'Mary sailed a lot, but her mother taught her about medicines.'], ['To bake bread for the army', false, 'She did cook for soldiers later, but her mother taught her healing.']], 'Her mother was a “doctress”: a healer who used herbs and plants. She cared for sick soldiers and sailors in her boarding house.'),
  mcq('ms-cholera', 'seacole', 'Before the war, Mary nursed people in Jamaica and Panama who had a dangerous illness. Which one?', [['Cholera', true], ['Measles', false, 'It was cholera, an illness spread by dirty water.'], ['Mumps', false, 'It was cholera, an illness spread by dirty water.']], 'Cholera spreads through dirty water. Mary learned a lot by nursing people through it, and that helped her in the Crimea.'),
  mcq('ms-refused', 'seacole', 'Mary asked to join the nurses going to the war. What happened?', [['She was turned down', true], ['She was put in charge', false, 'Florence was in charge of the army nurses. Mary was not chosen.'], ['She was too busy to go', false, 'She wanted to go so much that she went anyway!']], 'She went to London to offer her help, but she was not chosen. Mary wondered whether it was because of the colour of her skin.'),
  mcq('ms-ownway', 'seacole', 'How did Mary get to the Crimea?', [['She paid for the trip herself', true], ['The army sent her there on a ship', false, 'The army did not send her. She paid her own way.'], ['She rode there on a camel', false, 'She sailed there, and paid for it herself.']], 'She travelled with a business partner, Thomas Day, and paid with her own money. That shows how much she wanted to help.'),
  fact('ms-balaclava', 'seacole', 'Mary built her British Hotel near which harbour town in the Crimea?', 'Balaclava', ['Scutari', 'Kingston', 'Florence'], 'Balaclava (say bal-uh-KLAH-vuh) was the British army’s harbour. Her hotel was a few miles away, close to the soldiers’ camp.', { feedback: { Scutari: 'Scutari was where Florence’s hospital was, far across the sea.' }, hook: 'A balaclava is also a woolly hat: people say it was named after the soldiers at Balaclava, who needed warm knitted hats in the freezing Crimean winter.' }),
  mcq('ms-hotel', 'seacole', 'What was the British Hotel?', [['A place for food, rest and care', true], ['A grand hotel for rich visitors', false, 'It was built from old wood and metal, for soldiers.'], ['A castle where the generals lived', false, 'It was a simple building where soldiers could eat and rest.']], 'Mary built it from old wood and sheets of iron. She sold food and drink, and gave soldiers medicine and comfort.'),
  mcq('ms-battle', 'seacole', 'How was Mary’s work different from Florence’s?', [['Mary went near the fighting', true], ['Mary only worked in England', false, 'Mary travelled all the way to the Crimea.'], ['Mary never helped any soldiers', false, 'She helped lots of soldiers, sometimes on the battlefield itself.']], 'Florence ran a big hospital at Scutari, far from the battles. Mary rode out to the battlefields with bandages, medicines and food.'),
  fact('ms-mother', 'seacole', 'What did the soldiers call Mary Seacole?', 'Mother Seacole', ['Lady Lantern', 'Captain Mary', 'Queen Mary'], 'She looked after the soldiers like a mother, with food, care and kindness.'),
  mcq('ms-met', 'seacole', 'Did Mary Seacole and Florence Nightingale ever meet?', [['Yes, once, at Scutari', true], ['No, never', false, 'They did meet: Mary stopped at Scutari on her way to the Crimea.'], ['Yes, they worked together every day', false, 'They met once, then worked in different places.']], 'On her way to the Crimea, Mary stayed a night at Scutari and spoke to Florence. After that they worked in different places.'),
  mcq('ms-book', 'seacole', 'How do we know so much about Mary Seacole’s life?', [['She wrote a book about it', true], ['She made a video diary', false, 'There were no video cameras then.'], ['She kept a website', false, 'There was no internet then!']], 'Her book, _Wonderful Adventures of Mrs Seacole in Many Lands_, came out in 1857. Soldiers’ letters tell us about her too.'),
  mcq('ms-alike', 'seacole', 'Which is true of BOTH Mary and Florence?', [['Both cared for ill soldiers', true], ['Both were born in Jamaica', false, 'Only Mary was. Florence was born in Italy.'], ['Both ran a hotel in the war', false, 'Only Mary ran a hotel. Florence ran a hospital.']], 'They were different in many ways, but both were brave, both were determined, and both cared for soldiers in the Crimean War.'),
  mcq('ms-statue', 'seacole', 'In 2016, how was Mary Seacole remembered in London?', [['A statue of her was put up', true], ['A palace was named after her', false, 'Not a palace: a statue.'], ['Her face went on the Moon', false, 'Not the Moon! A statue was put up in London.']], 'Her statue stands outside St Thomas’ Hospital, the same hospital where Florence opened her nursing school.'),

  // --- 4. Stories from the Crimean War (reading)
  mcq('st-young-1', 'stories', 'How did Florence’s mother feel when Florence said she wanted to be a nurse?', [['Horrified and upset', true], ['Proud and pleased', false, 'Look at the word “horrified”. She was not pleased at all.'], ['Bored and sleepy', false, 'She was very upset. Florence’s sister even cried.']], '“Her mother was horrified.” Horrified means very shocked and upset.', YOUNG),
  mcq('st-young-2', 'stories', 'Why did Florence’s family think nursing was not a suitable job?', [['Nurses had no proper training', true], ['Nurses were paid far too much', false, 'The story does not say that. Look at what it says about hospitals and nurses.'], ['Nurses had to fight in wars', false, 'Nurses care for people. Look at what the story says about training.']], '“In those days hospitals were dirty places, and nurses had no proper training.”', YOUNG),
  mcq('st-young-3', 'stories', 'Why did Florence read about hospitals before dawn?', [['It was quiet, so she could study', true], ['She was not allowed any lights', false, 'She read by candlelight, so she did have a light.'], ['Her teacher made her get up early', false, 'Nobody made her. She chose to.']], 'The house was still quiet. Getting up so early also shows how much she wanted to learn.', YOUNG),
  mcq('st-young-4', 'stories', 'How do you know Florence was determined?', [['She kept asking, year after year', true], ['She went to lots of parties', false, 'That is what her parents wanted. Florence wanted something different.'], ['She lived in a big house with servants', false, 'That tells us about her family, not about her character.']], '“Florence did not give up… Year after year, she kept asking.” That is what determined means.', YOUNG),
  mcq('st-young-5', 'stories', 'How did Florence feel when she trained at Kaiserswerth?', [['Happy and sure of her work', true], ['Homesick and wanting to leave', false, 'The story says she felt she was doing the work she was born to do.'], ['Bored and ready to give up', false, 'She had waited years for this! Look at the last sentence.']], '“Now Florence felt she was doing the work she was born to do.”', YOUNG),
  mcq('st-lamp-2', 'stories', 'Miss Nightingale “did not shout, but everyone did what she said.” What does this tell you about her?', [['People respected her', true], ['She had a sore throat', false, 'Nothing in the story says she was ill. Why would people listen to her?'], ['Nobody could hear her', false, 'They did hear her, because they did what she said.']], 'She was quiet but firm, and people trusted her to be in charge.', LAMP),
  mcq('st-lamp-3', 'stories', 'Which detail shows the nurses made the soldiers more comfortable?', [['“a clean shirt for the first time in weeks”', true], ['“he could hear rats scurrying in the dark”', false, 'That was before the nurses came. Look for something that got better.'], ['“the doctors had gone to bed”', false, 'That tells us when she visited, not what made Tom comfortable.']], 'Clean clothes, a scrubbed floor and warm soup all made Tom more comfortable.', LAMP),
  mcq('st-lamp-4', 'stories', 'Why do you think Tom smiled when her shadow passed over him?', [['He felt cared for and safe', true], ['Her shadow made him feel cold', false, 'A shadow can’t make you cold! Think about how her visit made him feel.'], ['He was dreaming about home', false, 'He was awake. Think about how her visit made him feel.']], 'He wrote: “She makes us feel that somebody cares.”', LAMP),
  mcq('st-lamp-5', 'stories', 'Why do you think the soldiers loved Miss Nightingale?', [['She was kind and helped them get well', true], ['She gave them all lots of presents', false, 'The story does not mention presents. Look at what she did for them.'], ['She let them stay up late every night', false, 'The soldiers needed rest to get better.']], 'She cleaned the ward, brought them food and clean clothes, and checked on them at night.', LAMP),
  order('st-lamp-6', 'stories', 'Put the story in order.', ['The nurses arrive with buckets', 'The floor is scrubbed clean', 'Miss Nightingale visits at night', 'Tom is well enough to go home'], 'The nurses came, cleaned the ward, cared for the soldiers day and night, and Tom got better.', LAMP),
  mcq('st-hotel-1', 'stories', 'What was the British Hotel built from?', [['Old planks and sheets of iron', true], ['Stone blocks and glass windows', false, 'Read the description again: planks and iron.'], ['Bricks and a thatched roof', false, 'Read the description again: planks and iron.']], '“a building made of old planks and sheets of iron”. Mary used whatever she could find.', HOTEL),
  mcq('st-hotel-2', 'stories', 'Which words best describe the inside of the hotel?', [['Warm and welcoming', true], ['Cold and gloomy', false, 'Outside was cold. Inside it was warm and smelled of hot stew.'], ['Noisy and frightening', false, 'The soldiers were laughing. It was a happy place.']], 'It was warm, it smelled of stew and bread, and soldiers sat laughing at the tables.', HOTEL),
  mcq('st-hotel-3', 'stories', 'How do you know Mary Seacole was brave?', [['She rode out towards the battlefield', true], ['She wore a bright dress and bonnet', false, 'That tells us what she looked like, not that she was brave.'], ['She cooked stew and baked fresh bread', false, 'That shows she was kind and a good cook. Look for something dangerous she did.']], 'Riding towards a battlefield is dangerous, and “she did not seem afraid at all.”', HOTEL),
  mcq('st-hotel-4', 'stories', 'Why do the soldiers call her Mother?', [['She cares for them like a mother', true], ['She is Jack’s real mother', false, 'Jack’s friend explains the name. Read the last line.'], ['She told them she was their mum', false, 'Read the last line: why do they call her Mother?']], '“Because she cares about every one of us.”', HOTEL),
  mcq('st-hotel-5', 'stories', 'How do you know Mary really wanted to help the soldiers?', [['She paid for her long journey herself', true], ['She lived in a muddy army camp', false, 'Her hotel was near the camp, but think about how she got to the Crimea.'], ['She had a sign painted on the hotel', false, 'A sign just tells people where to go. What did it cost her to get there?']], 'Nobody paid for her to go. She spent her own money to get to the soldiers.', HOTEL),

  // --- 5. Counting to save lives: the rose diagram
  fact('commission', 'numbers', 'In March 1855, the government sent experts to clean up the army hospitals. What were they called?', 'the Sanitary Commission', ['the Royal Air Force', 'the Lifeboat Crew', 'the Spanish Armada'], '“Sanitary” means to do with keeping clean and healthy. They flushed out the drains, let in fresh air and made the water supply clean.'),
  mcq('fell', 'numbers', 'What happened after the drains were mended and the water was made clean?', [['Far fewer soldiers died', true], ['Even more soldiers fell ill', false, 'The opposite! Clean water and drains stopped illness spreading.'], ['Nothing changed at all', false, 'A lot changed: far fewer soldiers died.']], 'Within a few months, far fewer soldiers were dying in the hospital at Scutari.'),
  mcq('learned', 'numbers', 'Nursing helped, but deaths at Scutari fell most after the drains and water were fixed. What did Florence learn?', [['Clean hospitals save lives', true], ['Nurses are not needed', false, 'Nurses were needed! But cleaning up the building mattered even more.'], ['Doctors should work at night', false, 'Think about what changed: the drains and the water.']], 'She spent the rest of her life making sure that hospitals, and homes, had fresh air, clean water and good drains.'),
  mcq('why-count', 'numbers', 'Why did Florence collect numbers about the soldiers?', [['To prove what made them ill', true], ['To win a prize for maths', false, 'She was good at maths, but she wanted to change things.'], ['To count the hospital beds for fun', false, 'She counted to find out what was killing the soldiers.']], 'Numbers are evidence. With them she could show the government what was really killing the soldiers, so that they would act.'),
  fact('statistics', 'numbers', 'Collecting and studying numbers to find out what is happening is called…', 'statistics', ['spelling', 'geography', 'gymnastics'], 'Florence was a brilliant statistician. She worked with a doctor who loved numbers too, William Farr.', { example: 'Hospitals today still count things, such as infections, to check that patients are safe.' }),
  fact('rose', 'numbers', 'Florence’s most famous diagram looks a bit like a flower. What is it often called?', 'a rose diagram', ['a daisy chart', 'a tulip tree', 'a sunflower map'], 'It is also called a polar area diagram. Each wedge, like a petal, stands for one month of the war.'),
  mcq('wedge', 'numbers', 'In the rose diagram, what does each wedge stand for?', [['One month', true], ['One soldier', false, 'There were far too many soldiers for that! Each wedge is a month.'], ['One hospital', false, 'Each wedge is one month. There are 12 in each rose.']], 'There are 12 wedges in each rose, one for each month of the year.'),
  mcq('bigger', 'numbers', 'In the rose diagram, what does a bigger wedge mean?', [['More soldiers died that month', true], ['That month was much longer', false, 'Every month gets the same angle. It is the size of the wedge that changes.'], ['The weather was sunnier then', false, 'The diagram is about deaths, not the weather.']], 'The bigger the wedge, the more deaths. You can spot the worst months straight away.'),
  mcq('blue', 'numbers', 'In the rose diagram, the blue wedges showed soldiers who died of what?', [['Illnesses that could be stopped', true], ['Wounds from fighting in battle', false, 'Wounds were shown in red, and the red wedges were much smaller.'], ['The cold in the winter months', false, 'The colours show what the soldiers died of. Blue was for illnesses.']], 'Blue was for illnesses that cleaner hospitals and camps could have prevented, red was for wounds, and black was for other causes. The blue was by far the biggest.'),
  mcq('picture', 'numbers', 'Why did Florence’s picture work better than a long list of numbers?', [['You can see the problem at a glance', true], ['Pictures are always more truthful', false, 'A picture is only as true as its numbers. Hers were carefully collected.'], ['Ministers were not allowed to read', false, 'They could read! But busy people understand a clear picture quickly.']], 'Busy people could see at once that most deaths came from illnesses that could be stopped. It helped persuade them to clean up army hospitals.'),
  tf('tf-chart', 'numbers', 'Florence invented the very first chart.', false, 'People drew charts before her. Florence used them brilliantly to change people’s minds.', 'Others had drawn charts like this before, but Florence made hers famous and used it to save lives.'),
  fact('rss', 'numbers', 'In 1858 Florence was the first woman chosen to join the Statistical Society (now the Royal Statistical Society). What do its members study?', 'numbers and data', ['stars and planets', 'birds and animals', 'rocks and fossils'], 'Statisticians collect and study numbers to find out what is really happening. Florence was one of the best of her time.', { hook: '1858: the year of her rose diagram, and the year she joined the Statistical Society.' }),
  mcq('pie', 'numbers', 'This pie chart shows how British soldiers died in the Crimean War. What killed most of them?', [['Illness', true], ['Fighting in battle', false, 'Look again: the illness slice is much bigger than the fighting slice.'], ['Bad weather', false, 'The chart shows illness and fighting. Illness is the biggest slice.']], 'About three out of every four soldiers who died were killed by illness, not by fighting. That is what Florence wanted everyone to see.'),

  // --- 6. After the war: a school for nurses
  mcq('home', 'later', 'When Florence came home from the war, what did she do?', [['Kept working to improve hospitals', true], ['Retired and never worked again', false, 'She worked for over 40 more years!'], ['Became the Queen of England', false, 'Queen Victoria was the queen! Florence did meet her, though.']], 'She came home quietly, using a false name to avoid the crowds. Then she got straight back to work.'),
  fact('fund', 'later', 'People in Britain gave money to thank Florence. What did she use it for?', 'a school to train nurses', ['a big house for herself', 'a fleet of new ships', 'a statue of herself'], 'The money, called the Nightingale Fund, paid for the Nightingale Training School for nurses.'),
  fact('thomas', 'later', 'Florence’s nursing school opened at which London hospital?', 'St Thomas’ Hospital', ['Great Ormond Street', 'the Tower of London', 'Buckingham Palace'], 'St Thomas’ is beside the River Thames, opposite the Houses of Parliament. Nurses are still trained in her name today, at King’s College London.'),
  fact('school-year', 'later', 'In which year did the Nightingale Training School for nurses open?', '1860', ['1066', '1960', '1820'], 'It opened on 9 July 1860. Its nurses went on to start nursing schools in other places, all over the world.', { feedback: { '1820': 'That was the year Florence was born.' } }),
  fact('notes', 'later', 'In 1859 Florence wrote a famous book about caring for the sick. What was it called?', 'Notes on Nursing', ['Nurses in Space', 'The Lamp Book', 'Hospital Jokes'], 'It was written for ordinary people caring for their families at home. It is about fresh air, light, warmth, clean water, good food and quiet.'),
  mcq('advice', 'later', 'Which piece of advice is in _Notes on Nursing_?', [['Open windows to let in fresh air', true], ['Keep the curtains shut all day', false, 'Florence thought light was good for sick people.'], ['Never wash a patient’s sheets', false, 'She thought cleanliness was vital!']], 'Florence believed that fresh air, light and cleanliness were vital for getting well.'),
  mcq('letters', 'later', 'Florence was often ill for the rest of her life. How did she keep working?', [['She wrote letters from her bed', true], ['She stopped working altogether', false, 'She never stopped! She worked from her bed.'], ['She sent her pet owl with messages', false, 'Athena was a pet, not a messenger!']], 'She wrote thousands of letters and reports to ministers, doctors and nurses, many of them from her bed. Lots of them still survive.'),
  fact('merit', 'later', 'In 1907 Florence became the first woman to be given a special honour by the King. What was it?', 'the Order of Merit', ['the Victoria Cross', 'a gold medal for running', 'the Crown Jewels'], 'King Edward VII gave her the Order of Merit, for great service to the country. She was 87.'),
  fact('died', 'later', 'Florence Nightingale died in 1910. How old was she?', '90', ['34', '60', '100'], 'She was born in 1820 and died on 13 August 1910, so she was 90. She is buried near her family’s home at East Wellow in Hampshire.', { hook: '1820 to 1910: count on 90 years.', feedback: { '34': 'She was 34 when she went to Scutari. She lived much longer.' } }),
  mcq('nurses-day', 'later', 'International Nurses Day is on 12 May every year. Why that date?', [['It is Florence’s birthday', true], ['It is the day the war ended', false, 'The war ended in March 1856. 12 May is a birthday!'], ['It is the first day of spring', false, 'Spring starts in March. 12 May is a birthday!']], 'Nurses all over the world remember her and celebrate their work on her birthday.'),
  mcq('banknote', 'later', 'How was Florence remembered on British money?', [['Her picture was on the £10 note', true], ['She designed the very first coins', false, 'Coins are much older than that: thousands of years old.'], ['Her lamp is on every penny', false, 'Not the penny: she was on the £10 note.']], 'From 1975 to 1994, the Bank of England £10 note showed Florence and a picture of her at Scutari.'),
  order('later-order', 'later', 'Put these in order, earliest first.', ['Notes on Nursing is published', 'Her nursing school opens', 'She gets the Order of Merit', 'Florence dies, aged 90'], 'The book in 1859, the school in 1860, the Order of Merit in 1907, and her death in 1910.'),

  // --- 7. Then and now
  tn('tn-candles', 'Wards are lit by candles and oil lamps at night.', THEN, 'There was no electric light in Florence’s hospital in the 1850s. Hospitals today have electric lights.', 'Florence did her night rounds by the light of a lantern. Today the lights come on at the flick of a switch.'),
  tn('tn-monitor', 'Machines beep to check a patient’s heartbeat.', NOW, 'Machines like this are modern. In Florence’s time nurses had to watch and listen.', 'Today machines called monitors check heartbeats and breathing all the time.'),
  tn('tn-clean', 'Nurses keep the wards clean and airy.', BOTH, 'Keeping wards clean was Florence’s big idea, and it still matters today.', 'Florence fought for clean, airy wards, and hospitals today still work hard to stay clean.'),
  tn('tn-antibiotics', 'Medicines called antibiotics kill harmful germs.', NOW, 'Antibiotics were discovered long after Florence’s time: penicillin in 1928.', 'The first antibiotic, penicillin, was discovered in 1928. In Florence’s time there were no medicines like this.'),
  tn('tn-men', 'Lots of trained nurses are men.', NOW, 'In Florence’s time trained nurses were almost all women. Today nurses can be men or women.', 'Florence’s school trained women. Today both men and women are nurses.'),
  tn('tn-carts', 'Sick soldiers are carried to hospital in carts pulled by horses.', THEN, 'That was then. Today ambulances have engines and flashing lights.', 'In the Crimea, soldiers were carried in carts, on stretchers or by ship. Today ambulances race to help.'),
  tn('tn-night', 'Nurses care for patients through the night.', BOTH, 'Nurses worked at night in Florence’s time, and they still do today.', 'Florence checked on her patients at night, and nurses still work night shifts today.'),
  mcq('germs', 'thennow', 'Florence thought illness spread through bad, smelly air. What do we know today?', [['Tiny germs spread many illnesses', true], ['Smells are the only cause of illness', false, 'Bad smells can be a sign of dirt, but germs are what spread many illnesses.'], ['Illness is caused by bad luck', false, 'Scientists have found the real causes, such as germs.']], 'Scientists proved that germs cause many illnesses in the years after the war. Florence’s fresh air and cleaning still helped, because they got rid of germs too!'),
  mcq('handgel', 'thennow', 'Why do nurses today clean their hands before and after seeing each patient?', [['To stop germs spreading', true], ['To keep their hands warm', false, 'It is about germs, not warmth.'], ['Because the gel smells nice', false, 'It is about stopping germs, not the smell.']], 'Germs travel on hands. Clean hands are one of the best ways to stop illness spreading in a hospital.', { example: 'You do the same when you wash your hands before eating and after using the toilet.' }),
  fact('nhs', 'thennow', 'In 1948 Britain started a health service that everyone could use without paying at the time. What is it called?', 'the NHS', ['the RNLI', 'the BBC', 'the RAF'], 'The National Health Service. Its nurses learn skills that go back to Florence’s training school.'),
  mcq('know', 'thennow', 'How do we know what Florence’s hospital was like?', [['From letters, reports and pictures', true], ['From her videos on the internet', false, 'There was no internet or video then!'], ['From people alive today who saw it', false, 'It was over 170 years ago. Nobody who saw it is still alive.']], 'Florence, the nurses and the soldiers wrote letters. There are newspaper reports, drawings and even some of the first ever photographs taken in a war.'),
  mcq('painting', 'thennow', 'A painting made years later shows Florence with a teapot-shaped lamp. Why should we be careful with it?', [['The artist may not have seen her', true], ['Paintings are always made up', false, 'Some paintings are very accurate. But check them against other sources.'], ['The colours have all faded', false, 'Faded or not, the question is whether the artist really saw her.']], 'Her real lamp was a Turkish lantern. Historians check pictures against other sources, such as letters and objects kept in museums.'),
  fact('museum', 'thennow', 'Which museum in London looks after a lantern Florence is thought to have used, and her owl Athena?', 'the Florence Nightingale Museum', ['the Science Museum', 'the Natural History Museum', 'London Zoo'], 'It is at St Thomas’ Hospital, where her nursing school opened. Objects like these are clues to the past.'),
  order('tn-order', 'thennow', 'Put these in order, earliest first.', ['Florence arrives at Scutari', 'Her nursing school opens', 'Penicillin is discovered', 'The NHS begins'], 'Scutari in 1854, the nursing school in 1860, penicillin in 1928 and the NHS in 1948.'),

  // --- 8. Stories: a clever picture and a museum visit (reading)
  mcq('st-rose-1', 'stories-2', 'Why did Florence turn her numbers into a picture?', [['Busy people did not read long lists', true], ['She wanted to win an art prize', false, 'The story does not mention prizes. Why weren’t people reading her numbers?'], ['She had forgotten how to write', false, 'She wrote thousands of letters! Look for what busy people did not do.']], '“Long lists of numbers were dull, and busy people did not read them.”', ROSE),
  mcq('st-rose-2', 'stories-2', 'The blue wedges were huge. What did that show?', [['Most deaths could have been prevented', true], ['Most soldiers died in battle', false, 'Battle wounds were the red wedges, and they were much smaller.'], ['Florence liked the colour blue', false, 'The colours stand for causes of death. Blue was for illnesses.']], 'Blue was for deaths from illnesses that could have been prevented, and the blue wedges were by far the biggest.', ROSE),
  mcq('st-rose-3', 'stories-2', 'How do you know Florence did not give up when important men would not listen?', [['She collected numbers to prove it', true], ['She went back to the war', false, 'She was at home in Britain. Look at what she did next.'], ['She stopped talking about hospitals', false, 'The opposite! Look at what she did next.']], '“So Florence did what she was best at. She collected numbers.”', ROSE),
  mcq('st-rose-4', 'stories-2', 'What does “at a glance” mean?', [['Straight away, with one quick look', true], ['After reading for a very long time', false, 'The point of her picture was that it was quick to understand.'], ['Only by using a magnifying glass', false, 'A glance is a quick look, with just your eyes.']], 'A glance is a quick look. Her picture was easy to understand straight away.', ROSE),
  mcq('st-rose-5', 'stories-2', 'What happened because of Florence’s picture?', [['Army hospitals were made cleaner', true], ['The war started all over again', false, 'The war was over. Read the last sentence.'], ['Everyone forgot about the soldiers', false, 'The opposite! Read the last sentence.']], '“Her picture helped persuade the government to make army hospitals cleaner and healthier.”', ROSE),
  mcq('st-museum-1', 'stories-2', 'How was the real lantern different from the lamp in Ellie’s storybook?', [['It was a plain folding lantern', true], ['It was made of shiny, solid gold', false, 'It was “not shiny”. Read that part again.'], ['It had an electric bulb', false, 'A candle had glowed inside it.']], 'The storybook lamp was shiny, but the real one was a plain folding Turkish lantern with a candle.', MUSEUM),
  mcq('st-museum-2', 'stories-2', 'According to Grandma, how do we know so much about Florence?', [['From her many letters', true], ['From her video diaries', false, 'There were no video cameras in Florence’s time.'], ['From Grandma’s nursing days', false, 'Grandma was born long after Florence died. Look at what she says about the letters.']], '“She wrote thousands of letters. That’s one way we know so much about her.”', MUSEUM),
  mcq('st-museum-3', 'stories-2', 'Why did Ellie say the nurse was “doing what Florence wanted”?', [['He was keeping things clean', true], ['He was carrying a lantern', false, 'He was rubbing gel on his hands. Why does that matter?'], ['He was wearing a black dress', false, 'He was wearing a blue uniform. Look at what he was doing.']], 'Cleaning his hands before seeing a patient stops germs spreading, just as Florence wanted hospitals to be clean.', MUSEUM),
  mcq('st-museum-4', 'stories-2', 'Grandma says that “caring for people hasn’t” changed. What do you think she means?', [['Nurses are still kind to patients', true], ['Hospitals still use candles today', false, 'They use electric lights now. What has stayed the same?'], ['Nurses still wear the same uniform', false, 'Uniforms have changed. What has stayed the same?']], 'Lots has changed, like lights, machines and medicines, but nurses still care for their patients, just as Florence did.', MUSEUM),
  mcq('st-museum-5', 'stories-2', 'Why do you think Ellie’s grandma wanted to visit this museum?', [['She had been a nurse herself', true], ['She wanted to buy a pet owl', false, 'Athena is in a glass case, not for sale! Look at the first sentence.'], ['She worked at the museum', false, 'Nothing says she worked there. Look at the first sentence.']], '“Ellie’s grandma had been a nurse for forty years”, so Florence’s story meant a lot to her.', MUSEUM),
];

// learn cards: a choice question's card states the question and its answer, then the explanation
// (without this the card would show only the explanation)
for (const it of items) {
  if (it.kind !== 'mcq' || it.passage) continue;
  it.learn = `${it.prompt} **${it.options.find((o) => o.correct).text}**\n\n${it.explain}`;
}

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const LIFE = { kind: 'timeline', from: 1800, to: 1930, set: 'britain', events: [[1820, 'Florence is born'], [1851, 'Trains as a nurse'], [1854, 'Goes to Scutari'], [1860, 'Opens her nursing school'], [1910, 'Florence dies']], caption: 'Florence Nightingale lived from 1820 to 1910, through all of Queen Victoria’s reign.' };
const LATER = { kind: 'timeline', from: 1850, to: 1930, set: 'britain', events: [[1858, 'Her rose diagram'], [1859, 'Notes on Nursing'], [1860, 'Nursing school opens'], [1907, 'Order of Merit'], [1910, 'Florence dies']] };
const COMPARE = { kind: 'table', head: ['', 'Florence Nightingale', 'Mary Seacole'], rows: [
  ['Born', '1820, in **Italy**', '1805, in **Jamaica**'],
  ['Got to the war', 'sent by the government', 'paid her **own way**'],
  ['Worked at', 'a big **hospital** at Scutari', 'her **British Hotel**, and battlefields'],
  ['Known as', 'the Lady with the Lamp', 'Mother Seacole'],
  ['Both', 'brave and determined', 'brave and determined'],
], tint: 'rows' };
const ROSE_KEY = { kind: 'table', head: ['In the rose diagram', 'What it shows'], rows: [
  ['each **wedge**', 'one month of the war'],
  ['a **bigger** wedge', 'more soldiers died'],
  ['**blue**', 'illnesses that could be prevented'],
  ['**red**', 'wounds from battle'],
  ['**black**', 'other causes'],
], caption: 'Florence’s rose diagram (1858) had two roses: the war’s first year, and the year after the hospitals were cleaned up. The second was much smaller.' };
const PIE = { kind: 'maths', diagram: { type: 'pie', title: 'How British soldiers died in the war', sectors: [{ label: 'illness', deg: 279 }, { label: 'fighting', deg: 81 }] }, caption: 'About 16,000 died of illness. About 5,000 were killed in battle or died of their wounds. So roughly 3 out of every 4 died of illness.' };
const THEN_NOW = { kind: 'table', head: ['', 'In Florence’s time', 'Today'], rows: [
  ['Light at night', 'candles and lanterns', 'electric lights'],
  ['Getting to hospital', 'carts, stretchers, ships', 'ambulances'],
  ['Fighting germs', 'scrubbing, fresh air', 'hand gel, **antibiotics**'],
  ['Checking patients', 'looking and listening', 'looking, listening, **machines**'],
  ['Trained nurses', 'almost all women', 'women **and men**'],
], tint: 'rows' };
const TOPIC_VISUALS = {
  'history.fn-life': LIFE,
  'history.fn-crimea': { kind: 'flow', steps: ['Soldiers fall ill in the Crimea', 'Ships take them to Scutari', 'The hospital is dirty and crowded', 'Florence and 38 nurses arrive', 'Scrubbing, laundry, food, care'], caption: 'Scutari, November 1854' },
  'history.fn-seacole': COMPARE,
  'history.fn-numbers': ROSE_KEY,
  'history.fn-later': LATER,
  'history.fn-thennow': THEN_NOW,
};
const ITEM_VISUALS = {
  'history.fn.life-order': LIFE,
  'history.fn.later-order': LATER,
  'history.fn.ms-alike': COMPARE,
  'history.fn.ms-battle': COMPARE,
  'history.fn.blue': ROSE_KEY,
  'history.fn.bigger': ROSE_KEY,
  'history.fn.pie': { ...PIE, question: true },
  'history.fn.tf-illness': PIE,
  'history.fn.laundry': { kind: 'flow', across: true, steps: ['dirty sheets', 'germs spread', 'more illness'], caption: 'Dirty sheets spread illness, so clean ones help stop it.' },
  'history.fn.learned': { kind: 'flow', steps: ['Drains flushed, water made clean', 'Fewer germs and less illness', 'Far fewer soldiers die'] },
  'history.fn.tn-order': { kind: 'timeline', from: 1840, to: 1960, set: 'britain', events: [[1854, 'Scutari'], [1860, 'Nursing school'], [1928, 'Penicillin'], [1948, 'The NHS']] },
  'history.fn.germs': THEN_NOW,
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
for (const [id, v] of Object.entries(ITEM_VISUALS)) { const it = items.find((x) => x.id === id); if (!it) throw new Error(`picture for unknown item ${id}`); it.visual = v; }

export default [{ subject: 'history', deck: 'bonus-nightingale', topics, items }];

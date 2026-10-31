// Registry of every question generator, keyed by the name content files use.
import { GENERATORS as MATHS } from './maths.js';
import { HISTORY_GENERATORS } from './history.js';
import { GEOGRAPHY_GENERATORS } from './geography.js';
import { SCIENCE_GENERATORS } from './science.js';
import { ENGLISH_GENERATORS } from './english.js';
import { SYNOPTIC_GENERATORS } from './synoptic.js';
import { MATHS2_GENERATORS } from './maths2.js';
import { MATHS3_GENERATORS } from './maths3.js';
import { SCIENCE2_GENERATORS } from './science2.js';
import { KS1_GENERATORS } from './ks1maths.js';
import { KS1_GENERATORS_2 } from './ks1maths2.js';
import { KS1_DEPTH_GENERATORS } from './ks1depth.js';
import { Y3_GENERATORS } from './y3maths.js';
import { Y8_MATHS_GENERATORS } from './y8maths.js';
import { Y8_MATHS2_GENERATORS } from './y8maths2.js';
import { Y8_SCIENCE_GENERATORS } from './y8science.js';
import { Y8_SCIENCE2_GENERATORS } from './y8science2.js';
import { Y8_COMPUTING_GENERATORS } from './y8computing.js';
import { Y8_COMPUTING2_GENERATORS } from './y8computing2.js';
import { Y8_GREEK_GENERATORS } from './y8greek.js';
import { Y8_GREEK2_GENERATORS } from './y8greek2.js';

export const GENERATORS = { ...MATHS, ...HISTORY_GENERATORS, ...GEOGRAPHY_GENERATORS, ...SCIENCE_GENERATORS, ...ENGLISH_GENERATORS, ...SYNOPTIC_GENERATORS, ...MATHS2_GENERATORS, ...MATHS3_GENERATORS, ...SCIENCE2_GENERATORS, ...KS1_GENERATORS, ...KS1_GENERATORS_2, ...KS1_DEPTH_GENERATORS, ...Y3_GENERATORS, ...Y8_MATHS_GENERATORS, ...Y8_MATHS2_GENERATORS, ...Y8_SCIENCE_GENERATORS, ...Y8_SCIENCE2_GENERATORS, ...Y8_COMPUTING_GENERATORS, ...Y8_COMPUTING2_GENERATORS, ...Y8_GREEK_GENERATORS, ...Y8_GREEK2_GENERATORS };

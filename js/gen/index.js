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
import { Y3_GENERATORS } from './y3maths.js';

export const GENERATORS = { ...MATHS, ...HISTORY_GENERATORS, ...GEOGRAPHY_GENERATORS, ...SCIENCE_GENERATORS, ...ENGLISH_GENERATORS, ...SYNOPTIC_GENERATORS, ...MATHS2_GENERATORS, ...MATHS3_GENERATORS, ...SCIENCE2_GENERATORS, ...KS1_GENERATORS, ...KS1_GENERATORS_2, ...Y3_GENERATORS };

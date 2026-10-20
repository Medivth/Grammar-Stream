// Registry of every question generator, keyed by the name content files use.
import { GENERATORS as MATHS } from './maths.js';
import { HISTORY_GENERATORS } from './history.js';
import { GEOGRAPHY_GENERATORS } from './geography.js';
import { SCIENCE_GENERATORS } from './science.js';

export const GENERATORS = { ...MATHS, ...HISTORY_GENERATORS, ...GEOGRAPHY_GENERATORS, ...SCIENCE_GENERATORS };

// Registry of every question generator, keyed by the name content files use.
import { GENERATORS as MATHS } from './maths.js';
import { HISTORY_GENERATORS } from './history.js';

export const GENERATORS = { ...MATHS, ...HISTORY_GENERATORS };

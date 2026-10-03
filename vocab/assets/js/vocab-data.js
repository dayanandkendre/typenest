import { BEGINNER } from './vocab-data-beginner.js';
import { INTERMEDIATE } from './vocab-data-intermediate.js';
import { ADVANCED } from './vocab-data-advanced.js';

// Level ids: Beginner 1-20, Intermediate 21-40, Advanced 41-60
export const SECTION_STARTS = [1, 21, 41];
const tag = (arr, start) => arr.map(l => ({ ...l, no: l.id - start + 1 }));

export const LEVELS = [...tag(BEGINNER, 1), ...tag(INTERMEDIATE, 21), ...tag(ADVANCED, 41)];
export default LEVELS;

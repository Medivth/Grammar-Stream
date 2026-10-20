// Courses and their subjects. The app runs one course at a time (the current child's);
// SUBJECTS, SUBJECT_BY_ID and PLACEMENT_ORDER are filled in place by setCourse(), so modules
// that imported them see the active course. Subject order is the rotation order for new learning.

export const COURSES = {
  y6: {
    id: 'y6', title: 'Year 6 to grammar school', short: 'Year 6 → 7',
    index: 'content/index.json',
    subjects: [
      { id: 'english', name: 'English', region: 'Library Cliffs', colour: '#d63d74', retention: 0.9 },
      { id: 'maths', name: 'Maths', region: 'Number Peaks', colour: '#2f74e8', retention: 0.85 },
      { id: 'history', name: 'History', region: 'Timeline River', colour: '#d97a12', retention: 0.9 },
      { id: 'geography', name: 'Geography', region: 'Explorer Coast', colour: '#0f9a6e', retention: 0.9 },
      { id: 'science', name: 'Science', region: 'Lab Lagoon', colour: '#9a48d6', retention: 0.9 },
      { id: 'latin', name: 'Latin', region: 'Forum Isle', colour: '#a16207', retention: 0.9 },
    ],
    placement: ['maths', 'english', 'geography', 'history', 'science'],
    placementCap: 24,
    minutes: 25,
    sprint: 'y6', sprintSeconds: 90,
    paper: 'ks2',
    tools: ['paper', 'typing', 'speed'],
    writing: true,
    readAloud: false,
    starter: ['none', 'yuzu', 'flower', 'bow', 'glasses', 'scarf', 'bird'],
  },
  ks1: {
    id: 'ks1', title: 'Year 2 greater depth', short: 'Year 2+',
    index: 'content/index-ks1.json',
    subjects: [
      { id: 'maths', name: 'Maths', region: 'Speedway Peaks', colour: '#2f74e8', retention: 0.85 },
      { id: 'reading', name: 'Reading', region: 'Story Galaxy', colour: '#d63d74', retention: 0.9 },
      { id: 'spelling', name: 'Spelling', region: 'Hero Academy', colour: '#0f9a6e', retention: 0.9 },
      { id: 'science', name: 'Science', region: 'Planet Lab', colour: '#9a48d6', retention: 0.9 },
      { id: 'history', name: 'History', region: 'Castle Command', colour: '#d97a12', retention: 0.9 },
    ],
    placement: ['maths', 'reading', 'spelling'],
    placementCap: 14,
    minutes: 12,
    sprint: 'ks1', sprintSeconds: 60,
    paper: 'ks1',
    tools: ['paper'],
    writing: false,
    readAloud: true,
    young: true, sprintUp: 12, next: 'y3',
    starter: ['none', 'racehelmet', 'cape', 'mask', 'glasses', 'yuzu', 'bird'],
  },
  // Year 3 includes all of Year 2 (same subjects and item ids), so moving up keeps every card.
  // Year 2's stretch topics are core here (they carry coreIn: ['y3']); Year 4 tasters are the stretch.
  y3: {
    id: 'y3', title: 'Year 3 greater depth', short: 'Year 3+',
    index: 'content/index-y3.json',
    subjects: [
      { id: 'maths', name: 'Maths', region: 'Speedway Peaks', colour: '#2f74e8', retention: 0.85 },
      { id: 'reading', name: 'Reading', region: 'Story Galaxy', colour: '#d63d74', retention: 0.9 },
      { id: 'spelling', name: 'Spelling', region: 'Hero Academy', colour: '#0f9a6e', retention: 0.9 },
      { id: 'science', name: 'Science', region: 'Planet Lab', colour: '#9a48d6', retention: 0.9 },
      { id: 'history', name: 'History', region: 'Castle Command', colour: '#d97a12', retention: 0.9 },
    ],
    placement: ['maths', 'reading', 'spelling'],
    placementCap: 16,
    minutes: 15,
    sprint: 'y3', sprintSeconds: 60,
    paper: 'y3',
    tools: ['paper', 'typing'],
    writing: false,
    readAloud: true,
    young: true, sprintUp: 14, prev: 'ks1',
    starter: ['none', 'racehelmet', 'cape', 'mask', 'glasses', 'yuzu', 'bird'],
  },
  // Year 8 at a selective school, aiming above the top fifth: KS3 at depth with GCSE tasters,
  // Ancient Greek towards GCSE, and Greek myth as the theme (original characters, not Riordan's).
  y8: {
    id: 'y8', title: 'Year 8 grammar stretch', short: 'Year 8+',
    index: 'content/index-y8.json',
    subjects: [
      { id: 'english', name: 'English', region: 'Library of the Muses', colour: '#d63d74', retention: 0.9 },
      { id: 'maths', name: 'Maths', region: 'Pythagoras Peaks', colour: '#2f74e8', retention: 0.85 },
      { id: 'science', name: 'Science', region: 'Forge of Hephaestus', colour: '#9a48d6', retention: 0.9 },
      { id: 'history', name: 'History', region: 'Hall of Clio', colour: '#d97a12', retention: 0.9 },
      { id: 'geography', name: 'Geography', region: 'Atlas Range', colour: '#0f9a6e', retention: 0.9 },
      { id: 'computing', name: 'Computing', region: 'Daedalus Workshop', colour: '#0e7490', retention: 0.9 },
      { id: 'greek', name: 'Ancient Greek', region: 'Oracle of Delphi', colour: '#a16207', retention: 0.9 },
    ],
    placement: ['maths', 'english', 'science', 'history', 'geography', 'computing'],
    placementCap: 24,
    minutes: 30,
    sprint: 'y8', sprintSeconds: 90,
    paper: null,
    tools: ['typing', 'speed'],
    writing: true,
    readAloud: false,
    starter: ['none', 'glasses', 'scarf', 'bird', 'yuzu', 'flower', 'bow'],
  },
};

export const SUBJECTS = [];
export const SUBJECT_BY_ID = {};
export const PLACEMENT_ORDER = [];
export const COURSE = {};

export function setCourse(id) {
  const c = COURSES[id] || COURSES.y6;
  SUBJECTS.splice(0, SUBJECTS.length, ...c.subjects);
  for (const k of Object.keys(SUBJECT_BY_ID)) delete SUBJECT_BY_ID[k];
  for (const s of c.subjects) SUBJECT_BY_ID[s.id] = s;
  PLACEMENT_ORDER.splice(0, PLACEMENT_ORDER.length, ...c.placement);
  for (const k of Object.keys(COURSE)) delete COURSE[k];
  Object.assign(COURSE, c);
  return c;
}

setCourse('y6');

export const subjectOf = (id) => id.split('.')[0];

/** Stretch (beyond the course) in the active course: a topic can be stretch in one course and core in a later one. */
export const isStretch = (t) => t?.tier === 'stretch' && !(t.coreIn || []).includes(COURSE.id);

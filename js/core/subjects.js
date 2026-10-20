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
    starter: ['none', 'racehelmet', 'cape', 'mask', 'glasses', 'yuzu', 'bird'],
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

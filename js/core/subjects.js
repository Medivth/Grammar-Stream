// The five subjects. Order is the default rotation order for new learning.

export const SUBJECTS = [
  { id: 'english', name: 'English', region: 'Library Cliffs', colour: '#d63d74', retention: 0.9 },
  { id: 'maths', name: 'Maths', region: 'Number Peaks', colour: '#2f74e8', retention: 0.85 },
  { id: 'history', name: 'History', region: 'Timeline River', colour: '#d97a12', retention: 0.9 },
  { id: 'geography', name: 'Geography', region: 'Explorer Coast', colour: '#0f9a6e', retention: 0.9 },
  { id: 'science', name: 'Science', region: 'Lab Lagoon', colour: '#9a48d6', retention: 0.9 },
];

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

export const subjectOf = (id) => id.split('.')[0];

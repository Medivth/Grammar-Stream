// The five subjects. Order is the default rotation order for new learning.

export const SUBJECTS = [
  { id: 'english', name: 'English', region: 'Library Cliffs', colour: '#c0587e', retention: 0.9 },
  { id: 'maths', name: 'Maths', region: 'Number Peaks', colour: '#3f7dd1', retention: 0.85 },
  { id: 'history', name: 'History', region: 'Timeline River', colour: '#b9772f', retention: 0.9 },
  { id: 'geography', name: 'Geography', region: 'Explorer Coast', colour: '#2f9a6b', retention: 0.9 },
  { id: 'science', name: 'Science', region: 'Lab Lagoon', colour: '#7b5cc4', retention: 0.9 },
];

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

export const subjectOf = (id) => id.split('.')[0];

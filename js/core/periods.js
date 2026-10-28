// Shared period bands for timelines, so every history topic places itself on the same picture.
// [start, end, label]; negative years are BC. Dates are the conventional ones used in schools.
export const PERIODS = {
  britain: [
    [-12000, -2500, 'Stone Age'],
    [-2500, -800, 'Bronze Age'],
    [-800, 43, 'Iron Age'],
    [43, 410, 'Roman Britain'],
    [410, 1066, 'Anglo-Saxons and Vikings'],
    [1066, 1485, 'Middle Ages'],
    [1485, 1603, 'Tudors'],
    [1603, 1714, 'Stuarts'],
    [1714, 1837, 'Georgians'],
    [1837, 1901, 'Victorians'],
    [1901, 2030, 'Modern times'],
  ],
  // the ancient civilisations side by side would overlap, so this set runs one after another
  greece: [
    [-3000, -1100, 'Bronze Age Greece'],
    [-1100, -800, 'Dark Age'],
    [-800, -480, 'Archaic Greece'],
    [-480, -323, 'Classical Greece'],
    [-323, -146, 'Hellenistic Greece'],
    [-146, 330, 'Roman Greece'],
  ],
  twentieth: [
    [1901, 1914, 'Edwardian'],
    [1914, 1918, 'First World War'],
    [1918, 1939, 'Between the wars'],
    [1939, 1945, 'Second World War'],
    [1945, 1991, 'Cold War'],
    [1991, 2030, 'Today'],
  ],
};

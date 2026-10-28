// Small path helpers for labelled diagrams. Import from here (not from diagrams.mjs, which loads
// the diagram files itself, so importing it from one of them would never finish).
export const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
export const rect = (x, y, w, h, r = 0) => r
  ? `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`
  : `M${x},${y}H${x + w}V${y + h}H${x}Z`;
export const many = (...ds) => ds.join('');

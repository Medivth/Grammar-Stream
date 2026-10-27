// Corrections to Natural Earth river lines on the UK map. Natural Earth stops several rivers
// where they widen into an estuary, which made the Severn (the UK's longest river, 354 km)
// look shorter than the Thames (346 km). Each extension is a list of [lon, lat] waypoints,
// joined on to the nearest point of the existing line.

export const RIVER_EXTENSIONS = {
  // Gloucester, Newnham, Sharpness, the Severn bridges, out to the line from Lavernock Point to Sand Point
  'river-severn': [[-2.32, 51.84], [-2.448, 51.803], [-2.478, 51.721], [-2.57, 51.65], [-2.64, 51.61], [-2.72, 51.55], [-2.85, 51.5], [-3.07, 51.4]],
  // Dartford, Gravesend, the estuary to Southend (the Yantlet line)
  'river-thames': [[0.23, 51.47], [0.37, 51.45], [0.5, 51.48], [0.7, 51.5]],
  // Perth, through the Firth of Tay past Dundee to Buddon Ness
  'river-tay': [[-3.3, 56.36], [-3.1, 56.42], [-2.97, 56.45], [-2.8, 56.46]],
};

/** Join each extension to its river line, projected with the map's own projection. */
export function extendRivers(riverLines, project) {
  for (const r of riverLines) {
    const ext = RIVER_EXTENSIONS[r.id];
    if (!ext) continue;
    const pts = ext.map((p) => project(p));
    const verts = [...r.d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);
    const join = verts.reduce((best, v) => (Math.hypot(v[0] - pts[0][0], v[1] - pts[0][1]) < Math.hypot(best[0] - pts[0][0], best[1] - pts[0][1]) ? v : best));
    r.d += `M${join.join(',')}` + pts.map(([x, y]) => `L${+x.toFixed(1)},${+y.toFixed(1)}`).join('');
  }
  return riverLines;
}

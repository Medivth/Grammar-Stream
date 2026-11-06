// Card art: small original emblems drawn as SVG strings (cheap, so an album of hundreds of
// cards stays light). Each emblem uses three tones that the card frame sets: currentColor for
// the main shape, .a (var(--em2)) for the highlight and .d (var(--em3)) for details, so the
// same drawing reads as a bold trading card, an ink specimen or a black-figure pot.

// laurel leaves along two arcs (used by the laurel emblem)
const laurelLeaves = (() => {
  let out = '';
  for (let i = 0; i < 6; i++) {
    const deg = 115 + i * 25; // up the left side, bottom to top
    for (const d of [deg, 180 - deg]) {
      const r = (d * Math.PI) / 180, x = (32 + 23 * Math.cos(r)).toFixed(1), y = (31 + 23 * Math.sin(r)).toFixed(1);
      out += `<ellipse${i % 2 ? ' class="a"' : ''} cx="${x}" cy="${y}" rx="4.2" ry="8.5" transform="rotate(${d} ${x} ${y})"/>`;
    }
  }
  return out + '<path class="d" d="M26 56c3-3 9-3 12 0l-6 5z"/>';
})();

export const EMBLEMS = {
  racecar: '<path d="M54 24h7v10h-4z"/><path d="M3 43v-8l9-3 7-8h17l6 6h12l7 4v9z"/><path class="a" d="M22 27h12l4 4H18z"/><circle class="d" cx="17" cy="44" r="7.5"/><circle class="d" cx="47" cy="44" r="7.5"/><circle class="a" cx="17" cy="44" r="3"/><circle class="a" cx="47" cy="44" r="3"/>',
  flag: '<path class="d" d="M10 6h4v54h-4z"/><path d="M14 9h42v28H14z"/><path class="a" d="M14 9h10.5v7H14zM35 9h10.5v7H35zM24.5 16H35v7H24.5zM45.5 16H56v7H45.5zM14 23h10.5v7H14zM35 23h10.5v7H35zM24.5 30H35v7H24.5zM45.5 30H56v7H45.5z"/>',
  rocket: '<path class="a" d="M25 44h14l-3 9-4 9-4-9z"/><path class="d" d="M21 30l-9 13 10-2zM43 30l9 13-10-2z"/><path d="M32 3c11 8 15 21 12 41H20C17 24 21 11 32 3z"/><circle class="a" cx="32" cy="22" r="5.5"/><circle class="d" cx="32" cy="22" r="2.5"/>',
  pie: '<circle cx="32" cy="32" r="27"/><path class="a" d="M32 32V5a27 27 0 0 1 23.4 40.5z"/><path class="d" d="M32 32l23.4 13.5A27 27 0 0 1 32 59z"/>',
  stopwatch: '<rect class="d" x="27" y="3" width="10" height="7" rx="2"/><path class="d" d="M47 12l5 5-3 3-5-5z"/><circle cx="32" cy="36" r="23"/><circle class="a" cx="32" cy="36" r="17"/><path class="d" d="M30.5 22h3v15h-3zM31 35l9-6 2 3-9 6z"/>',
  scales: '<path class="d" d="M30 9h4v45h-4z"/><path d="M18 54h28v6H18zM8 15h48v4H8z"/><circle class="d" cx="32" cy="9" r="4"/><path class="a" d="M3 36l9-17 9 17a9 4.5 0 0 1-18 0zM43 36l9-17 9 17a9 4.5 0 0 1-18 0z"/>',
  shapes: '<path d="M18 5l15 26H3z"/><circle class="a" cx="47" cy="18" r="13"/><rect class="d" x="18" y="36" width="25" height="23" rx="2"/>',
  compass: '<circle cx="32" cy="32" r="28"/><circle class="a" cx="32" cy="32" r="22"/><path class="d" d="M32 8l6 24-6 24-6-24z"/><path d="M26 32l6-24 6 24z"/><circle class="a" cx="32" cy="32" r="3"/>',
  puzzle: '<path d="M8 18h12a6 6 0 1 1 12 0h12v12a6 6 0 1 1 0 12v12H32a6 6 0 1 0-12 0H8V42a6 6 0 1 0 0-12z"/><path class="a" d="M44 30a6 6 0 1 1 0 12v12h12V30z"/>',
  magnifier: '<path class="d" d="M37 33l22 21-5 5-21-22z"/><circle cx="26" cy="26" r="19"/><circle class="a" cx="26" cy="26" r="12.5"/><path class="d" d="M19 21a8 8 0 0 1 8-6v3a5 5 0 0 0-5 4z"/>',
  star: '<path d="M32 3l8.5 18.5 20 2.2-15 13.6 4.2 19.8L32 47 14.3 57.1l4.2-19.8-15-13.6 20-2.2z"/><path class="a" d="M32 16l4.6 10 10.9 1.2-8.1 7.4 2.3 10.7L32 39.8l-9.7 5.5 2.3-10.7-8.1-7.4 10.9-1.2z"/>',
  book: '<path d="M5 11c10-3 19-2 27 4 8-6 17-7 27-4v42c-10-3-19-2-27 4-8-6-17-7-27-4z"/><path class="a" d="M9 15c8-2 15-1 21 3v33c-6-4-13-5-21-3zM55 15c-8-2-15-1-21 3v33c6-4 13-5 21-3z"/><path class="d" d="M13 24h12v2H13zM13 30h12v2H13zM39 24h12v2H39zM39 30h12v2H39z"/>',
  crown: '<path d="M5 20l13 12 14-21 14 21 13-12-4 33H9z"/><path class="a" d="M9 45h46v8H9z"/><circle class="a" cx="32" cy="10" r="4.5"/><circle class="a" cx="5" cy="19" r="4"/><circle class="a" cx="59" cy="19" r="4"/><circle class="d" cx="32" cy="49" r="2.5"/>',
  globe: '<circle cx="32" cy="32" r="28"/><path class="a" d="M17 13c7 2 11 6 9 11s-9 4-11 10 5 11 2 15c-3 2-9-4-11-11 0-10 4-20 11-25zM41 8c7 2 15 11 17 19-4 0-9-4-13-2s-2 9-7 11-9-2-9-9 7-7 9-11-2-6 3-8zM36 46c5-1 10 0 12 3-3 4-8 7-14 8 0-4 0-9 2-11z"/>',
  shield: '<path d="M32 3l25 8v19c0 17-10 27-25 33C17 57 7 47 7 30V11z"/><path class="a" d="M32 11l17 5v14c0 12-7 19-17 24z"/><path class="d" d="M32 21l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7-5.5-4.5 7-.5z"/>',
  lightning: '<path d="M39 2 11 37h17l-6 25 31-37H35z"/><path class="a" d="M35 11 20 32h11l-3 15 15-19H31z"/>',
  quill: '<path class="d" d="M9 53l7-5 3 3-6 6-5 5z"/><path d="M56 3C35 7 20 24 14 47l4 3C27 31 39 18 56 3z"/><path class="a" d="M56 3C45 17 35 30 18 50l-3-2C22 28 36 12 56 3z"/>',
  dino: '<path d="M49 6c5 0 9 4 7 8l-6 1c-2 7-2 15 0 23 2 10-4 17-13 17h-2v6h-6v-6h-9v6h-6v-7C8 51 4 45 1 38c6 4 13 4 17-2 6-8 16-10 24-6 2-8 2-15 2-18 0-3 2-6 5-6z"/><path class="a" d="M22 31l3-5 3 4 3-5 3 4 3-4 2 5c-6-2-12-2-17 1z"/><circle class="d" cx="50" cy="10" r="1.8"/>',
  fossil: '<circle cx="32" cy="32" r="27"/><path class="a" d="M32 9a23 23 0 1 1-23 23h6a17 17 0 1 0 17-17 11 11 0 1 1-11 11h5a6 6 0 1 0 6-6z"/><circle class="d" cx="32" cy="32" r="2.5"/>',
  planet: '<circle class="d" cx="10" cy="12" r="2"/><circle class="d" cx="54" cy="52" r="2"/><circle class="d" cx="52" cy="10" r="1.5"/><circle cx="32" cy="32" r="18"/><path class="a" d="M18 26c-9 3-15 7-14 11s9 4 21 1 24-9 31-13 6-8 1-9c-3-1-7 0-11 1 2 1 4 2 5 3-5 3-12 6-22 9-9 2-14 3-16 2 1-1 3-3 6-4z"/>',
  paw: '<ellipse cx="32" cy="43" rx="15" ry="13"/><ellipse cx="13" cy="28" rx="6.5" ry="8.5"/><ellipse cx="24.5" cy="15" rx="6.5" ry="8.5"/><ellipse cx="39.5" cy="15" rx="6.5" ry="8.5"/><ellipse cx="51" cy="28" rx="6.5" ry="8.5"/><ellipse class="a" cx="32" cy="45" rx="8" ry="6"/>',
  leaf: '<path d="M7 57C7 24 24 7 59 5c0 33-17 52-52 52z"/><path class="a" d="M7 57C20 41 32 28 51 13l2 2C35 30 23 43 10 59z"/><path class="a" d="M24 38l-9-5 1-2 10 5zM34 28l-5-10 2-1 5 10z"/>',
  magnet: '<path d="M9 5h15v27a8 8 0 0 0 16 0V5h15v27a23 23 0 0 1-46 0z"/><path class="a" d="M9 5h15v11H9zM40 5h15v11H40z"/>',
  bulb: '<path class="d" d="M22 48h20v5H22zM24 55h16l-3 6H27z"/><path d="M32 3a21 21 0 0 1 12 38v6H20v-6A21 21 0 0 1 32 3z"/><path class="a" d="M28 41l-3-15 7 5 7-5-3 15h-2.5l2-9-3.5 2.5-3.5-2.5 2 9z"/><path class="a" d="M22 14a13 13 0 0 1 8-5v3a10 10 0 0 0-6 4z"/>',
  castle: '<path class="d" d="M31 3h2.5v18H31z"/><path class="a" d="M33.5 3l9 4-9 4z"/><path d="M3 60V22h9v6h6v-6h9v6h10v-6h9v6h6v-6h9v38H39V46a7 7 0 0 0-14 0v14z"/><path class="a" d="M10 34h6v8h-6zM48 34h6v8h-6z"/>',
  pyramid: '<circle class="a" cx="52" cy="12" r="6"/><path d="M32 8 62 58H2z"/><path class="a" d="M32 8l30 50H40z"/><path class="d" d="M0 58h64v4H0z"/>',
  column: '<path d="M6 4h52v7H6zM11 11h42v5H11zM13 50h38v5H13zM7 55h50v6H7z"/><path class="a" d="M15 16h7v34h-7zM28.5 16h7v34h-7zM42 16h7v34h-7z"/>',
  helmet: '<path class="a" d="M9 18C13 2 51 2 55 18c-6-6-14-8-23-8S15 12 9 18z"/><path d="M13 60V32c0-13 8-21 19-21s19 8 19 21v28H40V42h-5v18h-6V42h-5v18z"/><path class="d" d="M20 30h9v4h-9zM35 30h9v4h-9z"/>',
  longship: '<path class="d" d="M30.5 6h3v34h-3z"/><path class="a" d="M13 10h38l-4 24H17z"/><path class="d" d="M13 18h38v3H13zM13 26h36v3H13z"/><path d="M2 40h60c-4 11-13 17-30 17S6 51 2 40z"/><path d="M58 41c4-4 5-10 2-14 4 0 6 4 5 8z"/><circle class="a" cx="14" cy="47" r="3"/><circle class="a" cx="25" cy="48" r="3"/><circle class="a" cx="36" cy="48" r="3"/><circle class="a" cx="47" cy="47" r="3"/>',
  lamp: '<path class="a" d="M51 24c-4-4-2-11 2-15 4 4 6 11 2 15z"/><path d="M5 40c10-9 34-11 46-5l7-6c1 9-3 14-9 16-13 6-31 6-44-5z"/><path class="d" d="M20 47h18l3 6H17z"/><path class="d" d="M3 38c-2-6 2-10 6-8l-2 3c-2-1-3 1-2 3z"/>',
  scroll: '<path d="M11 9h39a6.5 6.5 0 0 1 0 13h-4v27a6.5 6.5 0 0 1-6.5 6.5H14a6.5 6.5 0 0 1 0-13h4V15.5A6.5 6.5 0 0 0 11 9z"/><path class="a" d="M24 23h16v3H24zM24 31h16v3H24zM24 39h11v3H24z"/>',
  mask: '<path d="M9 9h46v19c0 17-10 29-23 29S9 45 9 28z"/><path class="d" d="M17 24c3-4 9-4 12 0-3 3-9 3-12 0zM35 24c3-4 9-4 12 0-3 3-9 3-12 0zM21 38c7 7 15 7 22 0-7 3-15 3-22 0z"/><circle class="a" cx="18" cy="33" r="3"/><circle class="a" cx="46" cy="33" r="3"/>',
  lyre: '<path d="M11 5c9 0 9 13 7 25-2 10 2 20 14 20s16-10 14-20c-2-12-2-25 7-25-4 6-2 16 0 26 2 15-6 27-21 27S9 46 11 31c2-10 4-20 0-26z"/><path class="a" d="M13 17h38v5H13z"/><path class="d" d="M25.5 22H27v28h-1.5zM31.2 22h1.6v29h-1.6zM37 22h1.5v28H37z"/>',
  code: '<rect x="3" y="8" width="58" height="46" rx="6"/><path class="d" d="M3 14a6 6 0 0 1 6-6h46a6 6 0 0 1 6 6v3H3z"/><path class="a" d="M14 25l9 8-9 8-3-3 6-5-6-5zM27 39h15v4H27z"/>',
  hourglass: '<path class="d" d="M11 3h42v7H11zM11 54h42v7H11z"/><path d="M15 10h34c0 13-11 17-11 22s11 9 11 22H15c0-13 11-17 11-22S15 23 15 10z"/><path class="a" d="M21 16h22c-2 6-11 9-11 14 0-5-9-8-11-14zM19 52c2-8 13-10 13-16 0 6 11 8 13 16z"/>',
  volcano: '<path class="a" d="M25 21c-5-6 0-13 6-16 2 4 6 4 9 0 5 5 2 11-3 16z"/><path d="M1 60l21-36h20l21 36z"/><path class="a" d="M22 24h20l-4 9-4-3-4 7-4-6-4 5z"/>',
  cell: '<ellipse cx="32" cy="32" rx="29" ry="23"/><circle class="a" cx="27" cy="30" r="10"/><circle class="d" cx="25" cy="28" r="3.5"/><ellipse class="d" cx="47" cy="41" rx="6" ry="3.5"/><ellipse class="d" cx="45" cy="21" rx="4.5" ry="2.8"/><circle class="a" cx="14" cy="42" r="2"/>',
  flask: '<path d="M23 3h18v5h-2v14l18 30a6.5 6.5 0 0 1-5.6 10H12.6A6.5 6.5 0 0 1 7 52l18-30V8h-2z"/><path class="a" d="M16 39h32l7 13a3.5 3.5 0 0 1-3 5H12a3.5 3.5 0 0 1-3-5z"/><circle class="d" cx="27" cy="48" r="3"/><circle class="d" cx="38" cy="44" r="2"/><circle class="d" cx="34" cy="31" r="1.6"/>',
  atom: '<g fill="none" stroke="currentColor" stroke-width="4.5"><ellipse cx="32" cy="32" rx="29" ry="10.5"/><ellipse cx="32" cy="32" rx="29" ry="10.5" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="29" ry="10.5" transform="rotate(-60 32 32)"/></g><circle class="a" cx="32" cy="32" r="7"/><circle class="d" cx="58" cy="28" r="3"/>',
  laurel: laurelLeaves,
  amphora: '<path class="d" d="M23 14c-9 0-11 9-6 13l2-2c-2-3-1-8 4-8zM41 14c9 0 11 9 6 13l-2-2c2-3 1-8-4-8z"/><path d="M23 3h18v5h-3v5c8 2 13 10 13 20 0 12-8 20-12 24v4H25v-4c-4-4-12-12-12-24 0-10 5-18 13-20V8h-3z"/><path class="a" d="M14 29h36v7H14z"/>',
  owl: '<path d="M11 9l9 6c8-4 16-4 24 0l9-6v30c0 14-10 22-21 22S11 53 11 39z"/><circle class="a" cx="23.5" cy="28" r="7.5"/><circle class="a" cx="40.5" cy="28" r="7.5"/><circle class="d" cx="23.5" cy="28" r="3.2"/><circle class="d" cx="40.5" cy="28" r="3.2"/><path class="a" d="M29 37h6l-3 6z"/><path class="d" d="M22 48l3-2 3 2 3-2 3 2 3-2 3 2v2H22z"/>',
  chart: '<path class="d" d="M5 5h4v50h51v4H5z"/><rect x="15" y="35" width="10" height="20"/><rect class="a" x="29" y="21" width="10" height="34"/><rect x="43" y="10" width="10" height="45"/>',
  dna: '<g fill="none" stroke-width="5" stroke-linecap="round"><path class="ds" d="M24 13h16M21 22h22M24 42h16M21 51h22"/><path stroke="currentColor" d="M20 3c0 15 24 14 24 29S20 47 20 61"/><path class="as" d="M44 3c0 15-24 14-24 29s24 14 24 29"/></g>',
  chip: '<path class="d" d="M20 3h4v11h-4zM30 3h4v11h-4zM40 3h4v11h-4zM20 50h4v11h-4zM30 50h4v11h-4zM40 50h4v11h-4zM3 20h11v4H3zM3 30h11v4H3zM3 40h11v4H3zM50 20h11v4H50zM50 30h11v4H50zM50 40h11v4H50z"/><rect x="13" y="13" width="38" height="38" rx="5"/><rect class="a" x="22" y="22" width="20" height="20" rx="2.5"/>',
  lock: '<path class="d" d="M17 29v-9a15 15 0 0 1 30 0v9h-7v-9a8 8 0 0 0-16 0v9z"/><rect x="9" y="28" width="46" height="33" rx="6"/><circle class="a" cx="32" cy="42" r="5.5"/><path class="a" d="M29.5 44h5v9h-5z"/>',
};

/** An emblem as an SVG string (decorative: the card's text says what it is). */
export function emblemSVG(id, cls = 'gc-em') {
  return `<svg class="${cls}" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" focusable="false">${EMBLEMS[id] || EMBLEMS.star}</svg>`;
}

/** A stable pick from a set's emblems, so cards in one set vary a little. */
export function emblemFor(topicId, emblems) {
  const list = emblems?.length ? emblems : ['star'];
  let h = 0;
  for (const ch of topicId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return list[h % list.length];
}

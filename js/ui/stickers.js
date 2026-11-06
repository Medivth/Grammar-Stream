// Stickers a grown-up can send with a note: small flat drawings on a 64×64 canvas, each with a
// white die-cut edge (a dilated copy of the shape) so they read as stickers on light and dark cards.

const star5 = (cx, cy, r, k = 0.48) => 'M' + Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * k : r;
  return `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
}).join(' L') + 'Z';
const face = (cx, cy, s = 1, ink = '#5b3a12') => `<circle cx="${cx - 5 * s}" cy="${cy}" r="${1.9 * s}" fill="${ink}"/><circle cx="${cx + 5 * s}" cy="${cy}" r="${1.9 * s}" fill="${ink}"/><path d="M${cx - 4.5 * s} ${cy + 4 * s} q${4.5 * s} ${4 * s} ${9 * s} 0" fill="none" stroke="${ink}" stroke-width="${1.8 * s}" stroke-linecap="round"/>`;
const leaf = (x, y, a, fill) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="2.8" fill="${fill}" transform="rotate(${a} ${x} ${y})"/>`;

const ART = {
  star: {
    label: 'Gold star',
    draw: () => `<path d="${star5(32, 34, 27)}" fill="#ffc93c" stroke="#f29e0c" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${star5(32, 34, 17)}" fill="#ffe07a"/>${face(32, 35, 1)}<circle cx="22" cy="38" r="2.6" fill="#ff8a8a" opacity=".6"/><circle cx="42" cy="38" r="2.6" fill="#ff8a8a" opacity=".6"/>`,
  },
  trophy: {
    label: 'Well done trophy',
    draw: () => `<path d="M17 12 h-7 q0 14 12 16 M47 12 h7 q0 14 -12 16" fill="none" stroke="#e6a400" stroke-width="4" stroke-linecap="round"/>
      <path d="M17 8 H47 V20 Q47 36 32 38 Q17 36 17 20Z" fill="#ffc93c"/><path d="M23 12 V22 Q24 30 30 32" fill="none" stroke="#fff3c0" stroke-width="3" stroke-linecap="round"/>
      <rect x="28" y="38" width="8" height="7" fill="#e6a400"/><rect x="21" y="44" width="22" height="6" rx="2" fill="#a25b17"/>
      <path d="M4 50 H60 L56 56 L60 62 H4 L8 56Z" fill="#e5373f"/><text x="32" y="59.5" text-anchor="middle" font-size="7.2" font-weight="800" fill="#fff" font-family="Outfit, system-ui, sans-serif" letter-spacing=".3">WELL DONE</text>
      <path d="${star5(32, 20, 6)}" fill="#fff8d8"/>`,
  },
  heart: {
    label: 'Heart',
    draw: () => `<path d="M32 56 C10 42 4 30 8 20 C12 9 26 8 32 19 C38 8 52 9 56 20 C60 30 54 42 32 56Z" fill="#f2557a" stroke="#d63461" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M15 22 q2 -6 9 -6" fill="none" stroke="#ffd0dc" stroke-width="3.5" stroke-linecap="round"/>${face(32, 31, 1, '#7a1530')}`,
  },
  rocket: {
    label: 'Rocket',
    draw: () => `<path d="M26 46 Q32 64 38 46Z" fill="#ff8a3d"/><path d="M28 46 Q32 57 36 46Z" fill="#ffd166"/>
      <path d="M22 34 L12 46 L22 44Z M42 34 L52 46 L42 44Z" fill="#e5373f"/>
      <path d="M32 4 C44 14 44 32 41 46 H23 C20 32 20 14 32 4Z" fill="#f4f6fb" stroke="#c8cde0" stroke-width="2"/>
      <path d="M32 4 C37 8 40 13 41.5 18 H22.5 C24 13 27 8 32 4Z" fill="#e5373f"/>
      <circle cx="32" cy="28" r="6.5" fill="#3d8be0" stroke="#5b6b8c" stroke-width="2.2"/><circle cx="30" cy="26" r="2" fill="#bfe0ff"/>
      <rect x="29" y="40" width="6" height="6" rx="1" fill="#e5373f"/>`,
  },
  laurel: {
    label: 'Laurel wreath',
    draw: () => {
      let leaves = '';
      for (let i = 0; i < 7; i++) {
        const a = Math.PI * (0.62 + i * 0.13), x = 32 + Math.cos(a) * 21, y = 30 + Math.sin(a) * 21;
        const deg = (a * 180) / Math.PI + 90;
        leaves += leaf(x.toFixed(1), y.toFixed(1), (deg - 35).toFixed(0), i % 2 ? '#3f9a4a' : '#57b65f') + leaf((64 - x).toFixed(1), y.toFixed(1), (180 - deg + 35).toFixed(0), i % 2 ? '#3f9a4a' : '#57b65f');
      }
      return `<path d="M20 50 Q8 34 16 14 M44 50 Q56 34 48 14" fill="none" stroke="#2f7a3a" stroke-width="2.4" stroke-linecap="round"/>${leaves}
        <path d="M24 50 L32 46 L40 50 L38 60 L32 56 L26 60Z" fill="#e5373f"/>
        <circle cx="32" cy="30" r="11" fill="#ffc93c" stroke="#e6a400" stroke-width="2"/><path d="${star5(32, 30.5, 7)}" fill="#fff3c0"/>`;
    },
  },
  owl: {
    label: 'Wise owl',
    draw: () => `<path d="M14 18 L18 6 L25 13 M50 18 L46 6 L39 13" fill="#8a5a35" stroke="#8a5a35" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="32" cy="35" rx="20" ry="24" fill="#a8743f"/><ellipse cx="32" cy="42" rx="12" ry="14" fill="#f3dcb2"/>
      <path d="M25 38 q2 3 4 0 M35 38 q2 3 4 0 M25 45 q2 3 4 0 M35 45 q2 3 4 0 M30 51 q2 3 4 0" fill="none" stroke="#c89a5f" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="23" cy="24" r="8.5" fill="#fff"/><circle cx="41" cy="24" r="8.5" fill="#fff"/>
      <circle cx="24" cy="25" r="4.5" fill="#2b2a33"/><circle cx="40" cy="25" r="4.5" fill="#2b2a33"/><circle cx="25.5" cy="23.5" r="1.4" fill="#fff"/><circle cx="41.5" cy="23.5" r="1.4" fill="#fff"/>
      <path d="M29 31 L35 31 L32 36Z" fill="#ff9f1c"/><path d="M12 36 Q8 46 16 54 M52 36 Q56 46 48 54" fill="none" stroke="#8a5a35" stroke-width="4" stroke-linecap="round"/>
      <path d="M24 58 v3 M28 58 v3 M36 58 v3 M40 58 v3" stroke="#ff9f1c" stroke-width="2.4" stroke-linecap="round"/>`,
  },
  rainbow: {
    label: 'Rainbow',
    draw: () => ['#e5373f', '#ff8a3d', '#ffc93c', '#4caf50', '#3d8be0', '#7a5cd6'].map((c, i) => `<path d="M${6 + i * 3.6} 44 A${26 - i * 3.6} ${26 - i * 3.6} 0 0 1 ${58 - i * 3.6} 44" fill="none" stroke="${c}" stroke-width="3.8"/>`).join('')
      + '<g fill="#fff" stroke="#d6dcea" stroke-width="1.5"><path d="M2 50 a6 6 0 0 1 6 -8 a7 7 0 0 1 13 1 a5 5 0 0 1 1 9 H6 a4 4 0 0 1 -4 -2Z"/><path d="M42 50 a6 6 0 0 1 6 -8 a7 7 0 0 1 13 1 a5 5 0 0 1 1 9 H46 a4 4 0 0 1 -4 -2Z"/></g>',
  },
  sun: {
    label: 'Sunshine',
    draw: () => Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; const p = (r, d = 0) => `${(32 + Math.cos(a + d) * r).toFixed(1)} ${(32 + Math.sin(a + d) * r).toFixed(1)}`; return `<path d="M${p(19, -0.2)} L${p(29)} L${p(19, 0.2)}Z" fill="${i % 2 ? '#ffb020' : '#ff8a3d'}"/>`; }).join('')
      + `<circle cx="32" cy="32" r="17" fill="#ffd23c" stroke="#f2a20c" stroke-width="2"/>${face(32, 31, 1.15)}<circle cx="22" cy="36" r="2.8" fill="#ff8a8a" opacity=".55"/><circle cx="42" cy="36" r="2.8" fill="#ff8a8a" opacity=".55"/>`,
  },
};

export const STICKERS = Object.keys(ART);
export const stickerLabel = (id) => ART[id]?.label || '';

/** A sticker as SVG markup (empty for an unknown id). */
export function stickerSVG(id, { title } = {}) {
  const a = ART[id];
  if (!a) return '';
  const label = (title || a.label).replace(/"/g, '&quot;');
  return `<svg viewBox="-4 -4 72 72" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="stk-edge" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feDropShadow in="w" dx="0" dy="1.2" stdDeviation="1" flood-color="#000" flood-opacity=".22" result="ws"/><feMerge><feMergeNode in="ws"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#stk-edge)">${a.draw()}</g></svg>`;
}

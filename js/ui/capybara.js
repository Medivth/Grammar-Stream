// The capybara companion, drawn as SVG. Never decays, never dies; just changes mood.

export const FURS = {
  caramel: { body: '#b47b4b', dark: '#8f5d35', light: '#d1a173' },
  chestnut: { body: '#8c5a37', dark: '#6b4227', light: '#b07f58' },
  sandy: { body: '#c9a26d', dark: '#a27e4d', light: '#e0c393' },
  cocoa: { body: '#6f4b34', dark: '#523624', light: '#957058' },
};

export const ACCESSORIES = {
  none: 'Nothing',
  yuzu: 'Yuzu fruit',
  flower: 'Flower',
  bow: 'Bow',
  glasses: 'Glasses',
  scarf: 'Scarf',
  bird: 'Bird friend',
  // earned through milestones (see js/core/progress.js)
  sunglasses: 'Sunglasses',
  headphones: 'Headphones',
  beanie: 'Beanie',
  explorer: 'Explorer hat',
  goggles: 'Lab goggles',
  backpack: 'Backpack',
  gradcap: 'Graduation cap',
  crown: 'Crown',
};

function accessory(kind, f) {
  switch (kind) {
    case 'yuzu':
      return `<g><circle cx="66" cy="34" r="13" fill="#f2a533"/><circle cx="62" cy="30" r="3" fill="#f8c66a" opacity=".8"/><path d="M66 21 q6 -8 13 -4 q-6 6 -13 4z" fill="#5c9a3c"/></g>`;
    case 'flower':
      return `<g transform="translate(84 44)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="5" ry="8" transform="rotate(${a}) translate(0 -7)" fill="#f48fb1"/>`).join('')}<circle r="4.5" fill="#ffd54f"/></g>`;
    case 'bow':
      return `<g transform="translate(84 46)"><path d="M0 0 L-12 -8 L-12 8 Z M0 0 L12 -8 L12 8 Z" fill="#e5737f"/><circle r="4" fill="#c94f5c"/></g>`;
    case 'glasses':
      return `<g fill="none" stroke="#2b2a33" stroke-width="2.4"><circle cx="50" cy="76" r="9"/><circle cx="76" cy="76" r="9"/><path d="M59 76 h8 M41 74 l-8 -3"/></g>`;
    case 'scarf':
      return `<g><path d="M90 58 q18 30 8 66 l14 2 q12 -38 -8 -72z" fill="#4d8fd6"/><path d="M100 112 l-6 30 l11 2 l5 -30z" fill="#3a74b5"/><path d="M98 66 q10 24 4 52" stroke="#fff" stroke-width="2" stroke-dasharray="4 6" opacity=".6" fill="none"/></g>`;
    case 'bird':
      return `<g transform="translate(64 32)"><ellipse rx="11" ry="9" fill="#6bb7d6"/><circle cx="7" cy="-5" r="6" fill="#6bb7d6"/><circle cx="9" cy="-6" r="1.4" fill="#222"/><path d="M13 -5 l5 1 l-5 2z" fill="#f2a533"/><path d="M-10 0 l-8 -4 l2 7z" fill="#4f98b8"/></g>`;
    case 'sunglasses':
      return `<g><rect x="38" y="68" width="24" height="15" rx="6" fill="#1c1a33"/><rect x="65" y="68" width="24" height="15" rx="6" fill="#1c1a33"/><path d="M62 74 h3" stroke="#1c1a33" stroke-width="3"/><path d="M42 72 l6 0" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M69 72 l6 0" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;
    case 'goggles':
      return `<g><path d="M26 60 Q64 52 102 60" stroke="#3b3a4a" stroke-width="4" fill="none"/><circle cx="48" cy="60" r="11" fill="#bfe6ff" stroke="#3b3a4a" stroke-width="3"/><circle cx="80" cy="60" r="11" fill="#bfe6ff" stroke="#3b3a4a" stroke-width="3"/><path d="M43 56 l5 -2" stroke="#fff" stroke-width="2"/><path d="M75 56 l5 -2" stroke="#fff" stroke-width="2"/></g>`;
    case 'headphones':
      return `<g><path d="M28 80 Q30 30 64 30 Q98 30 100 80" stroke="#2b2a3a" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="20" y="68" width="14" height="24" rx="6" fill="#5143d9"/><rect x="94" y="68" width="14" height="24" rx="6" fill="#5143d9"/></g>`;
    case 'beanie':
      return `<g><path d="M30 60 Q32 22 64 22 Q96 22 98 60 Z" fill="#d63d74"/><rect x="27" y="54" width="74" height="12" rx="6" fill="#a8235a"/><circle cx="64" cy="20" r="8" fill="#fff"/></g>`;
    case 'explorer':
      return `<g><ellipse cx="64" cy="52" rx="48" ry="9" fill="#b98f52"/><path d="M38 52 Q40 26 64 26 Q88 26 90 52 Z" fill="#d6b06e"/><rect x="39" y="44" width="50" height="6" fill="#6e4f25"/></g>`;
    case 'gradcap':
      return `<g><path d="M44 40 L44 54 Q64 62 84 54 L84 40 Z" fill="#2b2a3a"/><path d="M64 22 L106 37 L64 52 L22 37 Z" fill="#1c1a33"/><path d="M64 37 L100 41 L100 60" stroke="#ffd166" stroke-width="3" fill="none"/><circle cx="100" cy="62" r="3.5" fill="#ffd166"/></g>`;
    case 'crown':
      return `<g><path d="M40 50 L46 24 L58 38 L64 18 L70 38 L82 24 L88 50 Z" fill="#ffd166" stroke="#d9a21b" stroke-width="2" stroke-linejoin="round"/><rect x="40" y="48" width="48" height="8" rx="3" fill="#e0b037"/><circle cx="64" cy="32" r="3" fill="#d63d74"/><circle cx="50" cy="38" r="2.2" fill="#2f74e8"/><circle cx="78" cy="38" r="2.2" fill="#2f74e8"/></g>`;
    case 'backpack':
      return `<g><rect x="126" y="56" width="42" height="48" rx="12" fill="#2f74e8"/><rect x="134" y="80" width="26" height="16" rx="5" fill="#1f5cc4"/><path d="M128 66 Q118 80 120 100" stroke="#1f5cc4" stroke-width="5" fill="none"/></g>`;
    default:
      return '';
  }
}

function eyes(mood) {
  if (mood === 'happy') return `<path d="M45 76 q5 -6 10 0 M71 76 q5 -6 10 0" stroke="#2b2a33" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (mood === 'thinking') return `<circle cx="51" cy="73" r="3.6" fill="#2b2a33"/><circle cx="77" cy="73" r="3.6" fill="#2b2a33"/><circle cx="52" cy="72" r="1.1" fill="#fff"/><circle cx="78" cy="72" r="1.1" fill="#fff"/>`;
  if (mood === 'oops') return `<circle cx="50" cy="76" r="3.6" fill="#2b2a33"/><circle cx="76" cy="76" r="3.6" fill="#2b2a33"/><path d="M96 58 q4 8 0 12 q-4 -4 0 -12z" fill="#7cc0ea"/>`;
  return `<circle cx="50" cy="76" r="3.8" fill="#2b2a33"/><circle cx="76" cy="76" r="3.8" fill="#2b2a33"/><circle cx="51" cy="75" r="1.2" fill="#fff"/><circle cx="77" cy="75" r="1.2" fill="#fff"/>`;
}

/** Returns an SVG string. */
export function capybaraSVG({ fur = 'caramel', accessory: acc = 'none', mood = 'neutral', title = 'Capybara' } = {}) {
  const f = FURS[fur] || FURS.caramel;
  const FRONT = ['scarf', 'backpack'], FACE = ['glasses', 'sunglasses', 'goggles'];
  const front = FRONT.includes(acc) ? accessory(acc, f) : '';
  const face = FACE.includes(acc) ? accessory(acc, f) : '';
  const top = !FRONT.includes(acc) && !FACE.includes(acc) ? accessory(acc, f) : '';
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="108" cy="150" rx="78" ry="7" fill="#000" opacity=".08"/>
  <rect x="62" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <rect x="146" y="122" width="16" height="26" rx="7" fill="${f.dark}"/>
  <ellipse cx="118" cy="102" rx="72" ry="42" fill="${f.body}"/>
  <rect x="80" y="126" width="16" height="22" rx="7" fill="${f.body}"/>
  <rect x="164" y="122" width="15" height="24" rx="7" fill="${f.body}"/>
  <path d="M150 74 q22 6 30 26" stroke="${f.dark}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
  ${front}
  <ellipse cx="46" cy="52" rx="8" ry="7" fill="${f.dark}"/>
  <ellipse cx="82" cy="52" rx="8" ry="7" fill="${f.dark}"/>
  <rect x="24" y="50" width="80" height="70" rx="32" fill="${f.body}"/>
  <rect x="22" y="80" width="66" height="40" rx="20" fill="${f.light}"/>
  <ellipse cx="36" cy="92" rx="3.4" ry="2.4" fill="#3b2a20"/>
  <ellipse cx="50" cy="92" rx="3.4" ry="2.4" fill="#3b2a20"/>
  <path d="M38 104 q6 5 12 0" stroke="#3b2a20" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="68" cy="96" r="6" fill="#f2a0a0" opacity=".35"/>
  ${eyes(mood)}
  ${face}
  ${top}
</svg>`;
}

export function capybaraEl(opts, className = 'capy') {
  const wrap = document.createElement('div');
  wrap.className = className;
  wrap.innerHTML = capybaraSVG(opts);
  return wrap;
}

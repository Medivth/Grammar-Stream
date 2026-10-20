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
  const front = acc === 'scarf' ? accessory('scarf', f) : '';
  const top = acc !== 'scarf' && acc !== 'glasses' ? accessory(acc, f) : '';
  const face = acc === 'glasses' ? accessory('glasses', f) : '';
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

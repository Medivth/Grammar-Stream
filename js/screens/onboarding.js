// First run: a grown-up sets up, then she creates her capybara.

import { h, mount, toast } from '../ui/dom.js';
import { capybaraSVG, FURS, ACCESSORIES } from '../ui/capybara.js';
import { requestPersistence } from '../platform/storage.js';
import { STARTER_ACCESSORIES } from '../core/progress.js';

export function welcomeScreen(app) {
  const name = h('input', { type: 'text', id: 'ob-name', autocomplete: 'off', placeholder: 'First name' });
  const bed = h('input', { type: 'time', id: 'ob-bed', value: '20:30' });
  const mins = h('select', { id: 'ob-mins' }, [15, 20, 25, 30, 40].map((m) => h('option', { value: m, selected: m === 25 }, `${m} minutes`)));
  const pin = h('input', { type: 'password', id: 'ob-pin', inputmode: 'numeric', maxlength: 4, placeholder: '4 digits' });
  const pin2 = h('input', { type: 'password', id: 'ob-pin2', inputmode: 'numeric', maxlength: 4, placeholder: 'Same again' });
  mount(app.root, h('div', { class: 'narrow stack' },
    h('h1', {}, 'Welcome to Grammar Stream'),
    h('div', { class: 'card stack' },
      h('p', {}, 'This part is for a grown-up. It takes a minute.'),
      h('p', { class: 'muted' }, 'Everything stays on this device. Nothing is sent anywhere, there are no accounts, adverts or tracking.'),
      h('div', { class: 'field' }, h('label', { for: 'ob-name' }, 'Your child’s first name'), name),
      h('div', { class: 'grid two' },
        h('div', { class: 'field' }, h('label', { for: 'ob-bed' }, 'Bedtime'), bed, h('p', { class: 'muted small' }, 'The app rests in the hour before bed.')),
        h('div', { class: 'field' }, h('label', { for: 'ob-mins' }, 'Daily session'), mins)),
      h('div', { class: 'grid two' },
        h('div', { class: 'field' }, h('label', { for: 'ob-pin' }, 'Grown-ups’ PIN'), pin),
        h('div', { class: 'field' }, h('label', { for: 'ob-pin2' }, 'Confirm PIN'), pin2)),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        if (!name.value.trim()) return toast('Please enter a first name.');
        if (!/^\d{4}$/.test(pin.value)) return toast('The PIN must be 4 digits.');
        if (pin.value !== pin2.value) return toast('The two PINs don’t match.');
        app.state.profile = { childName: name.value.trim(), parentPin: pin.value, companion: { name: '', fur: 'caramel', accessory: 'yuzu' } };
        app.state.settings.bedtime = bed.value || '20:30';
        app.state.settings.sessionMinutes = +mins.value;
        app.save();
        requestPersistence();
        app.go('#/companion');
      } }, 'Next: hand over to her'))));
  name.focus();
}

export function companionScreen(app) {
  const c = { fur: 'caramel', accessory: 'yuzu', name: '', ...(app.state.profile?.companion || {}) };
  const preview = h('div', { class: 'capy', style: { maxWidth: '260px', margin: '0 auto' } });
  const draw = () => { preview.innerHTML = capybaraSVG({ ...c, mood: 'happy', title: c.name || 'Your capybara' }); };
  const furRow = h('div', { class: 'capy-pick', role: 'group', 'aria-label': 'Fur colour' });
  const accRow = h('div', { class: 'capy-pick', role: 'group', 'aria-label': 'Accessory' });
  const drawPickers = () => {
    furRow.replaceChildren(...Object.entries(FURS).map(([k, f]) => h('button', { type: 'button', 'aria-pressed': String(c.fur === k), 'aria-label': k, onclick: () => { c.fur = k; draw(); drawPickers(); } }, h('span', { class: 'swatch', style: { background: f.body } }))));
    accRow.replaceChildren(...Object.entries(ACCESSORIES).filter(([k]) => STARTER_ACCESSORIES.includes(k)).map(([k, label]) => h('button', { type: 'button', 'aria-pressed': String(c.accessory === k), onclick: () => { c.accessory = k; draw(); drawPickers(); } }, label)));
  };
  const name = h('input', { type: 'text', id: 'capy-name', placeholder: 'Give your capybara a name', maxlength: 20, value: c.name, oninput: () => { c.name = name.value; draw(); } });
  draw();
  drawPickers();
  mount(app.root, h('div', { class: 'narrow stack' },
    h('h1', { class: 'center' }, `Hi ${app.state.profile?.childName || ''}! Meet your capybara`),
    h('p', { class: 'center muted' }, 'Your capybara will learn alongside you. Sometimes you’ll teach it, and sometimes it will get things wrong for you to fix. You’ll unlock more outfits as you hit milestones.'),
    h('div', { class: 'card stack' }, preview,
      h('div', { class: 'field' }, h('label', {}, 'Fur'), furRow),
      h('div', { class: 'field' }, h('label', {}, 'Something special'), accRow),
      h('div', { class: 'field' }, h('label', { for: 'capy-name' }, 'Name'), name),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        if (!c.name.trim()) return toast('Your capybara needs a name!');
        app.state.profile.companion = { name: c.name.trim(), fur: c.fur, accessory: c.accessory };
        app.save();
        app.go('#/home');
      } }, 'Let’s go!'))));
}

export function displayScreen(app) {
  const st = app.state.settings;
  const opt = (key, val, label) => h('button', { type: 'button', class: 'btn-ghost', 'aria-pressed': String(st[key] === val), style: st[key] === val ? { borderColor: 'var(--accent)' } : {}, onclick: () => { st[key] = val; app.save(); app.applySettings(); displayScreen(app); } }, label);
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, '←'), h('h1', {}, 'How it looks')),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card stack' }, h('h3', {}, 'Letters'),
        h('div', { class: 'row' }, opt('font', 'default', 'Hyperlegible'), h('button', { type: 'button', class: 'btn-ghost', style: { fontFamily: 'OpenDyslexic', ...(st.font === 'dyslexic' ? { borderColor: 'var(--accent)' } : {}) }, 'aria-pressed': String(st.font === 'dyslexic'), onclick: () => { st.font = 'dyslexic'; app.save(); app.applySettings(); displayScreen(app); } }, 'OpenDyslexic'), opt('font', 'system', 'Plain'))),
      h('div', { class: 'card stack' }, h('h3', {}, 'Size'),
        h('div', { class: 'row' }, opt('textScale', 0.9, 'Small'), opt('textScale', 1, 'Medium'), opt('textScale', 1.15, 'Large'), opt('textScale', 1.3, 'Huge'))),
      h('div', { class: 'card stack' }, h('h3', {}, 'Colours'),
        h('div', { class: 'row' }, opt('theme', undefined, 'Match device'), opt('theme', 'light', 'Light'), opt('theme', 'dark', 'Dark'))),
      h('div', { class: 'card stack' }, h('h3', {}, 'Movement'),
        h('div', { class: 'row' }, opt('reduceMotion', false, 'Gentle animations'), opt('reduceMotion', true, 'No animations')))));
}

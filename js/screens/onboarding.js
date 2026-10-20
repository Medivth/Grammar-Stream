// First run: a grown-up sets up, then the child creates their companion (a capybara or a lion). Also: who's learning?

import { h, mount, toast } from '../ui/dom.js';
import { capybaraSVG, FURS, LION_FURS, ACCESSORIES, SPECIES, speciesOf, companionNoun } from '../ui/capybara.js';
import { requestPersistence } from '../platform/storage.js';
import { COURSES } from '../core/subjects.js';
import { setPronoun } from '../core/pronoun.js';
import { starterAccessories } from '../core/progress.js';

export function welcomeScreen(app) {
  const adding = app.profiles().length > 0 && !app.state.profile;
  const knownPin = app.state.pendingPin;
  const name = h('input', { type: 'text', id: 'ob-name', autocomplete: 'off', placeholder: 'First name' });
  const course = h('select', { id: 'ob-course' }, Object.values(COURSES).map((c) => h('option', { value: c.id, selected: c.id === 'y6' && !adding }, c.title)));
  if (adding) course.value = 'ks1';
  const pron = h('select', { id: 'ob-pron' }, [['she', 'she / her'], ['he', 'he / him'], ['they', 'they / them']].map(([v, t]) => h('option', { value: v }, t)));
  const bed = h('input', { type: 'time', id: 'ob-bed', value: '20:30' });
  const mins = h('select', { id: 'ob-mins' }, [8, 10, 12, 15, 20, 25, 30, 40].map((m) => h('option', { value: m }, `${m} minutes`)));
  const syncMins = () => { mins.value = String(COURSES[course.value].minutes); bed.value = COURSES[course.value].young ? '19:00' : '20:30'; };
  course.onchange = syncMins;
  syncMins();
  const pin = h('input', { type: 'password', id: 'ob-pin', inputmode: 'numeric', maxlength: 4, placeholder: '4 digits' });
  const pin2 = h('input', { type: 'password', id: 'ob-pin2', inputmode: 'numeric', maxlength: 4, placeholder: 'Same again' });
  const cancel = adding ? h('button', { class: 'btn-ghost', onclick: async () => { await app.useProfile(app.profiles()[0].id); app.go('#/home'); } }, 'Cancel') : null;
  mount(app.root, h('div', { class: 'narrow stack' },
    h('h1', {}, adding ? 'Add another child' : 'Welcome to Grammar Stream'),
    h('div', { class: 'card stack' },
      h('p', {}, 'This part is for a grown-up. It takes a minute.'),
      h('p', { class: 'muted' }, 'Everything stays on this device. Nothing is sent anywhere, there are no accounts, adverts or tracking.'),
      h('div', { class: 'grid two' },
        h('div', { class: 'field' }, h('label', { for: 'ob-name' }, 'Child’s first name'), name),
        h('div', { class: 'field' }, h('label', { for: 'ob-pron' }, 'Refer to them as'), pron)),
      h('div', { class: 'field' }, h('label', { for: 'ob-course' }, 'Course'), course,
        h('p', { class: 'muted small' }, 'Year 6 to grammar school: ages 10–11. Year 2 greater depth: ages 6–7, with everything read aloud and shorter sessions.')),
      h('div', { class: 'grid two' },
        h('div', { class: 'field' }, h('label', { for: 'ob-bed' }, 'Bedtime'), bed, h('p', { class: 'muted small' }, 'The app rests in the hour before bed.')),
        h('div', { class: 'field' }, h('label', { for: 'ob-mins' }, 'Daily session'), mins)),
      knownPin ? h('p', { class: 'muted small' }, 'The grown-ups’ PIN is the same one you already use.') : h('div', { class: 'grid two' },
        h('div', { class: 'field' }, h('label', { for: 'ob-pin' }, 'Grown-ups’ PIN'), pin),
        h('div', { class: 'field' }, h('label', { for: 'ob-pin2' }, 'Confirm PIN'), pin2)),
      h('div', { class: 'row' }, cancel, h('button', { class: 'btn-primary btn-big', onclick: async () => {
        if (!name.value.trim()) return toast('Please enter a first name.');
        if (!knownPin && !/^\d{4}$/.test(pin.value)) return toast('The PIN must be 4 digits.');
        if (!knownPin && pin.value !== pin2.value) return toast('The two PINs don’t match.');
        app.state.profile = { childName: name.value.trim(), pronoun: pron.value, parentPin: knownPin || pin.value, companion: { name: '', fur: 'caramel', accessory: COURSES[course.value].young ? 'racehelmet' : 'yuzu' } };
        delete app.state.pendingPin;
        app.state.settings.bedtime = bed.value || '20:30';
        app.state.settings.sessionMinutes = +mins.value;
        if (COURSES[course.value].young) app.state.settings.textScale = 1.15;
        setPronoun(pron.value);
        await app.useCourse(course.value);
        app.applySettings();
        app.save();
        requestPersistence();
        app.go('#/companion');
      } }, 'Next: meet your companion')))));
  name.focus();
}

/** More than one child on this device: tap your companion to start. */
export function whoScreen(app) {
  const list = app.profiles();
  mount(app.root, h('div', { class: 'narrow stack center' },
    h('h1', {}, 'Who’s learning?'),
    h('div', { class: 'who-grid' }, list.map((p) => {
      let comp = null;
      try { comp = JSON.parse(localStorage.getItem(p.id === 'main' ? 'grammar-stream.save' : `grammar-stream.save.${p.id}`) || 'null')?.data?.profile?.companion; } catch { /* unreadable */ }
      const card = h('button', { class: 'who-card card', type: 'button', onclick: async () => { await app.useProfile(p.id); app.go('#/home'); } });
      card.innerHTML = capybaraSVG({ ...(comp || {}), species: speciesOf(comp, COURSES[p.course]?.young), mood: 'happy', title: comp?.name || 'Companion' });
      card.append(h('strong', {}, p.name || 'Me'), h('span', { class: 'muted small' }, COURSES[p.course]?.short || ''));
      return card;
    })),
    h('p', { class: 'muted small' }, 'Grown-ups can add or remove a child in the Grown-ups area.')));
}

export function companionScreen(app) {
  const young = !!COURSES[app.state.course]?.young;
  const c = { fur: 'caramel', accessory: young ? 'racehelmet' : 'yuzu', name: '', ...(app.state.profile?.companion || {}) };
  c.species = speciesOf(c, young);
  const noun = () => companionNoun(c.species);
  const preview = h('div', { class: 'capy', style: { maxWidth: '260px', margin: '0 auto' } });
  const title = h('h1', { class: 'center' });
  const draw = () => { preview.innerHTML = capybaraSVG({ ...c, mood: 'happy', title: c.name || `Your ${noun()}` }); title.textContent = `Hi ${app.state.profile?.childName || ''}! Meet your ${noun()}`; name.placeholder = `Give your ${noun()} a name`; };
  const kindRow = h('div', { class: 'capy-pick', role: 'group', 'aria-label': 'Animal' });
  const furRow = h('div', { class: 'capy-pick', role: 'group', 'aria-label': 'Fur colour' });
  const accRow = h('div', { class: 'capy-pick', role: 'group', 'aria-label': 'Accessory' });
  const drawPickers = () => {
    kindRow.replaceChildren(...Object.entries(SPECIES).map(([k, label]) => h('button', { type: 'button', 'aria-pressed': String(c.species === k), onclick: () => { c.species = k; draw(); drawPickers(); } }, label)));
    const furs = c.species === 'lion' ? LION_FURS : FURS;
    furRow.replaceChildren(...Object.entries(furs).map(([k, f]) => h('button', { type: 'button', 'aria-pressed': String(c.fur === k), 'aria-label': k, onclick: () => { c.fur = k; draw(); drawPickers(); } }, h('span', { class: 'swatch', style: { background: f.mane ? `linear-gradient(135deg, ${f.mane} 50%, ${f.body} 50%)` : f.body } }))));
    accRow.replaceChildren(...Object.entries(ACCESSORIES).filter(([k]) => starterAccessories().includes(k)).map(([k, label]) => h('button', { type: 'button', 'aria-pressed': String(c.accessory === k), onclick: () => { c.accessory = k; delete c.wear; draw(); drawPickers(); } }, label)));
  };
  const name = h('input', { type: 'text', id: 'capy-name', maxlength: 20, value: c.name, oninput: () => { c.name = name.value; draw(); } });
  const heroIn = h('input', { type: 'text', id: 'hero-name', placeholder: 'e.g. Captain Thunder', maxlength: 24, value: app.state.profile?.hero || '' });
  draw();
  drawPickers();
  mount(app.root, h('div', { class: 'narrow stack' },
    title,
    h('p', { class: 'center muted' }, 'Your companion will learn alongside you. Sometimes you’ll teach it, and sometimes it will get things wrong for you to fix. You’ll unlock more outfits as you hit milestones.'),
    young ? h('div', { class: 'card stack' }, h('div', { class: 'field' }, h('label', { for: 'hero-name' }, 'And your superhero name? (it will appear in your maths adventures)'), heroIn)) : null,
    h('div', { class: 'card stack' }, preview,
      h('div', { class: 'field' }, h('label', {}, 'Animal'), kindRow),
      h('div', { class: 'field' }, h('label', {}, 'Fur'), furRow),
      h('div', { class: 'field' }, h('label', {}, 'Something special'), accRow),
      h('div', { class: 'field' }, h('label', { for: 'capy-name' }, 'Name'), name),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        if (!c.name.trim()) return toast(`Your ${noun()} needs a name!`);
        app.state.profile.companion = { ...(app.state.profile.companion || {}), name: c.name.trim(), species: c.species, fur: c.fur, accessory: c.accessory, ...(c.wear ? { wear: c.wear } : {}) };
        if (heroIn.value.trim()) app.state.profile.hero = heroIn.value.trim();
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

(function () {
'use strict';
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} };

let lang = (() => {
  const h = location.hash.slice(1);
  if (h === 'zh' || h === 'en') return h;
  try { return localStorage.getItem('tripfix-lang') === 'en' ? 'en' : 'zh'; } catch (e) { return 'zh'; }
})();
const L = (a, b) => a && typeof a === 'object' ? a[lang] : (lang === 'en' ? b : a);

const PATH = {
  opera: 'M5 4h14v7a7 7 0 0 1-14 0z M9.2 9h.01 M14.8 9h.01 M9 13.2c1.6 1.5 4.4 1.5 6 0',
  dinner: 'M7 3v18 M4.5 3v5a2.5 2.5 0 0 0 5 0V3 M17.5 21V3c-2.2 1.6-3 4.8-3 8.5h3',
  walk: 'M3 17.5h18 M7 17.5a5 5 0 0 1 10 0 M12 8.2v2.3 M6.4 10.9l1.6 1.6 M17.6 10.9L16 12.5 M6 21h12',
  money: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M14.6 8.6A2.4 2.4 0 0 0 10.3 10v6.2 M8.6 12.6h4.6 M8.6 16.2h6.8',
  train: 'M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z M5 10h14 M8.6 13.6h.01 M15.4 13.6h.01 M8 17l-2 4 M16 17l2 4',
  msg: 'M4 5h16v11H9.5L5 20v-4H4z',
  rain: 'M7 15a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.6 9 3.5 3.5 0 1 1 17 16H7z M9 19l-1 2 M13 19l-1 2 M17 19l-1 2',
  wind: 'M3 8h11a3 3 0 1 0-3-3 M3 12h15a3 3 0 1 1-3 3 M3 16h7',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5',
  boat: 'M3 14h18l-2.5 5h-13z M12 3v11 M12 4l6 7h-6',
  cup: 'M4 9h12v4a6 6 0 0 1-12 0z M16 10h1.5a2.5 2.5 0 0 1 0 5H16 M8 3v3 M12 3v3',
  church: 'M12 2v5 M10 4h4 M5 21V12l7-5 7 5v9z M10 21v-5h4v5',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4z M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  bag: 'M5 8h14l-1 13H6z M9 8V6a3 3 0 0 1 6 0v2',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  lock: 'M6 11h12v10H6z M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
  unlock: 'M6 11h12v10H6z M8.5 11V7.5a3.5 3.5 0 0 1 6.8-1.2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20.5c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5',
  undo: 'M9 14L4 9l5-5 M4 9h10.5a5.5 5.5 0 0 1 0 11H12',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  drag: 'M8 9l4-4 4 4 M8 15l4 4 4-4',
  alert: 'M12 3l10 18H2z M12 10v4 M12 17.5h.01',
  ticket: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z M14 7v10',
  chat: 'M12 3a9 9 0 0 1 7.8 13.5L21 21l-4.6-1.2A9 9 0 1 1 12 3z',
  pencil: 'M4 20h4L19 9l-4-4L4 16z M14 6l4 4',
  trash: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6',
  plus: 'M12 5v14 M5 12h14',
  x: 'M6 6l12 12 M18 6L6 18'
};
const icon = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${PATH[n] || PATH.pin}"/></svg>`;
const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const toMin = v => { const [h, m] = String(v || '').split(':').map(Number); return isNaN(h) || isNaN(m) ? NaN : h * 60 + m; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const PALETTE = ['#9a1f6c', '#1f7a4c', '#e0782a', '#2b44a6', '#1d8d93', '#7a4fb3', '#b0852a', '#c2414b'];
const ICONS = ['pin', 'opera', 'dinner', 'walk', 'book', 'boat', 'cup', 'church', 'camera', 'bag'];
const MAX_ACTS = 8, THINK = 1800;

/* every trip is an editable copy; events stay as functions */
const strip = sc => {
  const {events, ...rest} = sc;
  const t = JSON.parse(JSON.stringify(rest));
  t.events = events || null;
  t.acts.forEach((a, i) => { a.color = a.color || PALETTE[i % PALETTE.length]; });
  return t;
};
const TRIPS = Object.fromEntries(SCENARIOS.map(sc => [sc.id, strip(sc)]));

const sessions = new Map(), savedPrefs = new Map();
for (const record of TripLibrary.entries()) {
  const t = record.trip;
  if (!(Object.hasOwn(TRIPS, t.id) && t.id !== 'blank') && !/^trip-[\w-]+$/.test(t.id)) continue;
  const original = TRIPS[t.id];
  TRIPS[t.id] = strip({...t, events: record.originalEvents ? original?.events : null});
  savedPrefs.set(t.id, record.prefs || {});
}
let creating = null, previousTrip = null, feedTimer = null;
const routeName = trip => `${L(trip.from)} → ${L(trip.to)}`;
function persist() {
  if (!SC || SC.id === 'blank' || creating) return;
  savedPrefs.set(SC.id, {order: S.order.slice(), mem: {...S.mem}, locks: {...S.locks}, guess:S.guess, manualOrder:S.manualOrder?.slice()});
  if (!TripLibrary.save(SC, S)) say(L('浏览器未能保存行程', 'Browser storage is unavailable'));
}
let SC, S;
const act = id => SC.acts.find(a => a.id === id);
const col = id => id === 'money' ? '#2a2d33' : (act(id) ? act(id).color : '#999');
const name = id => id === 'money' ? L('少花钱', 'Spend less') : esc(L(act(id).name));
const mem = k => SC.memory.find(m => m.id === k);
const shown = () => S.pending || S.confirmed;
const state = () => S.res ? S.res.st : Planner.state(S.trip, 0);
const clashIds = () => S.res && !S.res.ok ? S.res.clash : [];
const arrival = () => SC.legs[0].arr + SC.lead;

function genericEvents(t) {
  const leg = t.legs[0], dep = leg.dep + 90, arr = leg.arr + 90;
  return [{
    at: Math.max(t.view[0], leg.dep - 30), icon: 'train',
    title: {zh: '列车取消', en: 'Train cancelled'}, service: fmt(leg.dep),
    detail: {zh: '下一班 ' + fmt(dep) + '，' + fmt(arr) + ' 到' + t.to.zh,
      en: 'Next train ' + fmt(dep) + ', arriving in ' + t.to.en + ' at ' + fmt(arr)},
    patch: st => {
      st.broken = st.legs[0];
      st.legs = [
        {...leg, id:'next', dep, arr, cost:0, name:{zh:'下一班 ' + fmt(dep), en:'Next train ' + fmt(dep)}},
        {...leg, id:'fast', dep:leg.dep+15, arr:leg.arr+20, cost:20,
          name:{zh:'快车 ' + fmt(leg.dep+15), en:'Express ' + fmt(leg.dep+15)}}
      ];
    }
  }];
}

function start(id, restart = false) {
  dismissCue();
  clearTimeout(feedTimer);
  if (S) S.waiting = false;
  clearTimeout(thinkTimer);
  SC = TRIPS[id];
  S = sessions.get(id);
  if (!S) {
    const mo = mem('order');
    S = {id, think: false, mem: Object.fromEntries(SC.memory.map(m => [m.id, true])), guess: !!mo,
      order: mo ? mo.order.slice() : SC.acts.map(a => a.id).concat('money'), locks: {}, hist: []};
    const prior = savedPrefs.get(id);
    if (prior && Array.isArray(prior.order)) Object.assign(S, {order: prior.order.slice(), locks: {...prior.locks}, mem: {...S.mem,...prior.mem}, guess: !!prior.guess, manualOrder:prior.manualOrder?.slice()});
    sessions.set(id, S);
    syncOrder(); resetDemo();
  } else if (restart) resetDemo();
  if (creating) return;
  ['bars', 'mems', 'rt'].forEach(k => { $(k).replaceChildren(); });
  if (S.think) thinkNow(); else render();
}
function syncOrder() {
  const ids = SC.acts.map(a => a.id);
  S.order = S.order.filter(id => id === 'money' || ids.includes(id));
  for (const id of ids) if (!S.order.includes(id)) { const m = S.order.indexOf('money'); S.order.splice(m < 0 ? S.order.length : m, 0, id); }
  for (const k of Object.keys(S.locks)) if (!S.order.includes(k)) delete S.locks[k];
}
function resetDemo() {
  dismissCue();
  S.step = 0; S.resultShown = false;
  clearTimeout(thinkTimer);
  S.events = SC.events || genericEvents(SC);
  S.trip = Object.assign({}, SC, {events: S.events});
  S.n = 0; S.confirmed = Planner.original(S.trip);
  clearTimeout(feedTimer); S.waiting = false;
  $('go').classList.remove('done');
  S.excluded = {}; S.applied = [];
  S.pending = null; S.res = null; S.think = false;
  compute();
}
function prefs() {
  const cap = mem('cap'), f = mem('flex'), flex = {};
  if (f && !S.mem.flex) flex[f.flexOf] = false;
  return {order: S.order, locks: S.locks, cap: cap && S.mem.cap ? cap.cap : 0, flex, excluded: S.excluded, ref: S.confirmed, now: S.n ? S.events[S.n - 1].at : 0};
}
function compute() {
  if (!S.n) { S.res = null; S.pending = null; return; }
  S.res = Planner.solve(S.trip, S.n, prefs());
  S.pending = S.res.ok && !Planner.same(S.res.plan, S.confirmed) ? S.res.plan : null;
}

/* ---------- top: the live itinerary ---------- */
function routeItems(el) {
  const plan = shown(), ref = S.pending ? S.confirmed : null, st = state();
  const [v0, v1] = SC.view, frac = m => (m - v0) / (v1 - v0), X = m => (frac(m) * 100).toFixed(3) + '%';
  const span = (a, b) => `--l:${X(a)};--w:calc(${X(b)} - ${X(a)})`;
  const items = [{k: 'base', cls: 'base'}];
  if (st.broken) items.push({k: 'brk', cls: 'seg broken', style: span(st.broken.dep, st.broken.arr)});
  items.push({k: 'leg', cls: 'seg leg', style: span(plan.leg.dep, plan.leg.arr)});
  const stops = [
    {k: 't0', t: plan.leg.dep, travel: true, ic: 'train', nm: esc(L(plan.leg.a))},
    {k: 't1', t: plan.leg.arr, travel: true, nm: esc(L(plan.leg.b))}
  ];
  for (const a of SC.acts) {
    const p = plan.at[a.id], o = a.plan, c = a.color;
    if (!p) continue;
    const changing = ref && ref.at[a.id] && !Planner.same({leg: plan.leg, at: {[a.id]: p}}, {leg: plan.leg, at: {[a.id]: ref.at[a.id]}});
    items.push({k: 'b-' + a.id, id: a.id, cls: 'seg g' + (changing ? ' next' : ''), style: p.drop ? `--l:${X(o.s)};--w:0%;--c:${c};opacity:0` : `${span(p.s, p.e)};--c:${c}`});
    stops.push({k: a.id, id: a.id, t: p.drop ? o.s : p.s, old: !p.drop && p.s !== o.s ? o.s : null, ic: a.icon, nm: esc(L(a.name)), place: esc(L(a.place || {zh: '', en: ''})), drop: p.drop, c, hit: changing});
  }
  const home = SC.home.t + (st.dayEnd - SC.dayEnd);
  stops.push({k: 'home', t: home, travel: true, ic: 'train', nm: L('回程', 'Home'), end: true});
  stops.sort((a, b) => a.t - b.t);
  const w = el.clientWidth || 1000, last = [-1e9, -1e9];
  stops.forEach(s => { s.px = frac(s.t) * w; s.row = 0; });
  const acts = stops.filter(s => !s.travel);
  for (const s of acts) { s.row = s.px - last[0] >= 165 ? 0 : (s.px - last[1] >= 165 ? 1 : 0); last[s.row] = s.px; }
  const hit = (a, aw, b, bw) => a - 10 < b + bw && b - 10 < a + aw;
  for (const s of stops.filter(x => x.travel)) {
    s.notime = acts.some(o => Math.abs(o.px - s.px) < 62);
    const free = r => !acts.some(o => o.row === r && hit(s.px - (s.end ? 90 : 0), 100, o.px, 165));
    if (free(0)) s.row = 0; else if (free(1)) s.row = 1; else s.noname = true;
  }
  for (const s of stops) {
    const c = s.travel ? 'var(--travel)' : s.c;
    items.push({k: 'p-' + s.k, id: s.id, cls: 'pin' + (s.drop ? ' drop' : '') + (s.hit ? ' hit' : ''), style: `--l:${X(s.t)};--c:${c}`});
    items.push({k: 'l-' + s.k, id: s.id, cls: 'lab' + (s.travel ? ' travel' : '') + (s.drop ? ' drop' : '') + (s.end ? ' end' : '') + (s.notime ? ' notime' : '') + (s.noname ? ' noname' : ''),
      style: `--l:${X(s.t)};--c:${c};--row:${s.row}`,
      html: `<time>${fmt(s.t)}${s.old != null ? `<s>${fmt(s.old)}</s>` : ''}</time><span class="nm">${s.ic ? icon(s.ic) : ''}<b>${s.nm}</b>${s.place ? `<small>${s.place}</small>` : ''}</span>`});
  }
  if (S.n) items.push({k: 'now', cls: 'now', style: `--l:${X(S.events[S.n - 1].at)}`});
  return items;
}
function patchRoute() {
  const el = $('rt'), old = new Map([...el.children].map(n => [n.dataset.k, n]));
  for (const it of routeItems(el)) {
    let n = old.get(it.k);
    if (!n) { n = document.createElement(it.k === 'base' ? 'i' : 'div'); n.dataset.k = it.k; el.appendChild(n); }
    old.delete(it.k);
    n.className = it.cls; n.style.cssText = it.style || '';
    if (it.id) n.dataset.id = it.id;
    if (it.html !== undefined && n._h !== it.html) { n.innerHTML = it.html; n._h = it.html; }
  }
  old.forEach(n => n.remove());
}
function renderCountdown() {
  const seconds = S.secondsLeft;
  $('demo-clock').textContent = L(`${seconds}s后更新状态`, `Status updates in ${seconds}s`);
}
function renderTop() {
  $('kick').textContent = L(SC.date);
  $('route-label').textContent = routeName(SC);
  $('trips').title = L('选择行程','Choose a trip');
  $('edit-trip').innerHTML = icon('pencil');
  $('edit-trip').setAttribute('aria-label', L('编辑行程信息', 'Edit trip details'));
  const ev = $('ev'), message = $('event-message');
  ev.hidden = !S.waiting && !S.n;
  $('demo-clock').hidden = !S.waiting;
  message.hidden = S.waiting;
  if (S.waiting) renderCountdown();
  ev.className = 'ev hit g';
  let html = '';
  if (S.n) {
    const e = S.events[S.n - 1];
    html = icon(e.icon) + '<strong>' + esc(L(e.title)) + '</strong>' +
      (e.service ? '<span>' + esc(e.service) + '</span>' : '') +
      '<small>' + esc(L(e.detail)) + '</small>';
  }
  if (message._html !== html) {message.innerHTML = html; message._html = html;}
  patchRoute();
}

/* ---------- step 1: priority bars ---------- */
const barColors = {
  '#9a1f6c': '#a0006e', '#1f7a4c': '#00843d', '#e0782a': '#ee7c0e',
  '#2b44a6': '#0019a8', '#1d8d93': '#00a0a6', '#2a2d33': '#1c1c1c'
};
function makeBar(id) {
  const li = document.createElement('li');
  li.dataset.k = id; li.dataset.id = id; li.tabIndex = 0;
  li.innerHTML = `<span class="track"><span class="body"></span></span><span class="why"></span><button class="lock" type="button"></button>`;
  return li;
}
function updateBar(li, id) {
  const plan = shown(), status = Planner.status(S.trip, plan, id);
  li.className = 'bar' + (status === 'dropped' ? ' drop' : '') + (S.locks[id] ? ' locked' : '') + (clashIds().includes(id) ? ' clash' : '');
  const color = col(id);
  li.style.setProperty('--c', barColors[color] || color);
  const label = id === 'money' ? L('少花钱','Spend less') + ' · £' + plan.cost : name(id);
  const body = '<span class="ico">' + icon(id === 'money' ? 'money' : act(id).icon) + '</span><b>' + label + '</b>';
  const b = li.querySelector('.body');
  if (b._h !== body) {b.innerHTML = body; b._h = body;}
  const p = plan.at[id];
  let detail = '';
  if (p?.drop) detail = L('取消此项','Skipped');
  else if (p && (status === 'moved' || status === 'short')) detail = fmt(p.s) + (p.note ? ' ' + L(p.note) : '–' + fmt(p.e));
  const why = li.querySelector('.why'); why.textContent = detail; why.title = detail;
  const lock = li.querySelector('.lock');
  lock.dataset.lock = id; lock.setAttribute('aria-pressed', !!S.locks[id]);
  lock.setAttribute('aria-label', S.locks[id] ? L('解锁', 'Unlock') : L('锁定', 'Lock'));
  lock.innerHTML = icon(S.locks[id] ? 'lock' : 'unlock');
  li.setAttribute('aria-label', `${id === 'money' ? L('少花钱', 'Spend less') : L(act(id).name)} ${detail}`);
  li.setAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown Enter Delete');
}
let dropRects = null;
function settleBar(node, from) {
  if (reduce) return;
  const rect = node.getBoundingClientRect(), dx = from.left - rect.left, dy = from.top - rect.top;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !from.tilt) return;
  const origin = from.origin || 'center';
  node.animate([
    {transform: `translate(${dx}px,${dy}px) rotate(${from.tilt || 0}deg)`, transformOrigin: origin},
    {transform: 'none', transformOrigin: origin}
  ], {duration: 560, easing: 'cubic-bezier(.34,1.45,.55,1)'});
}
function patchBars() {
  const empty = !SC.acts.length;
  $('stackwrap').hidden = empty; $('empty').hidden = !empty;
  if (empty) {
    $('empty').innerHTML = `<span class="e-ic">${icon('pin')}</span><b>${L('还没有安排', 'Nothing planned yet')}</b><button class="add g" type="button" data-add>${icon('plus')}${L('添加第一个', 'Add the first one')}</button>`;
    $('bars').innerHTML = ''; $('guess').innerHTML = '';
    return;
  }
  const box = $('bars'), old = new Map([...box.querySelectorAll('.bar')].map(n => [n.dataset.k, n]));
  const first = dropRects || new Map([...old].map(([k, n]) => [k, n.getBoundingClientRect()]));
  dropRects = null;
  S.order.forEach(id => { let n = old.get(id); if (!n) n = makeBar(id); old.delete(id); updateBar(n, id); box.appendChild(n); });
  old.forEach(n => n.remove());

  $('guess').innerHTML = S.guess ? `<button type="button" class="g" id="use">${L('采用排序', 'Use order')}</button>` : '';
  if ($('use')) $('use').onclick = () => change(() => { S.guess = false; });
  if (reduce) return;
  box.querySelectorAll('.bar').forEach(n => {
    const f = first.get(n.dataset.k); if (!f) { n.animate([{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.34,1.45,.55,1)'}); return; }
    settleBar(n, f);
  });
}
function dnd(box, onDrop, onTrash, onClick) {
  let d = null;
  const trash = $('trash');
  box.addEventListener('pointerdown', e => {
    const it = e.target.closest('.bar');
    if (d || !it || e.button !== 0 || e.target.closest('button')) return;
    d = {it, id: it.dataset.k, x0: e.clientX, y0: e.clientY, pid: e.pointerId, on: false, lx: e.clientX, vx: 0, before: undefined, trash: false};
    try { it.setPointerCapture(e.pointerId); } catch (err) {}
  });
  box.addEventListener('pointermove', e => {
    if (!d || e.pointerId !== d.pid) return;
    if (!d.on) { if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 5) return; begin(e); }
    move(e);
  });
  box.addEventListener('pointerup', e => { if (d && e.pointerId === d.pid) end(true); });
  box.addEventListener('pointercancel', () => { if (d) end(false); });
  document.addEventListener('keydown', e => { if (d && e.key === 'Escape') end(false); });
  function begin(e) {
    d.on = true;
    const r = d.it.getBoundingClientRect();
    d.dx = d.x0 - r.left; d.dy = d.y0 - r.top;
    d.ly = d.y0; d.vy = 0;
    const top = box.getBoundingClientRect().top;
    d.rows = [...box.querySelectorAll('.bar')].map(node => {
      const rect = node.getBoundingClientRect();
      return {node, top: rect.top - top, height: rect.height};
    });
    d.source = d.rows.findIndex(row => row.node === d.it);
    d.others = d.rows.filter(row => row.node !== d.it);
    d.space = r.height + parseFloat(getComputedStyle(box).rowGap);
    const g = d.it.cloneNode(true);
    g.classList.add('fb-ghost'); g.classList.remove('hl', 'nudge');
    g.setAttribute('aria-hidden', 'true'); g.inert = true;
    g.style.width = r.width + 'px'; g.style.height = r.height + 'px';
    g.style.gridTemplateColumns = getComputedStyle(d.it).gridTemplateColumns;
    g.querySelector('.body').style.width = getComputedStyle(d.it.querySelector('.body')).width;
    g.style.transformOrigin = `${d.dx}px ${d.dy}px`;
    document.body.appendChild(g); d.g = g;
    d.marker = document.createElement('li'); d.marker.className = 'fb-marker'; d.marker.setAttribute('aria-hidden', 'true');
    box.appendChild(d.marker);
    d.it.classList.add('fb-src'); document.body.classList.add('dragging');
    trash.className = 'trash show';
    trash.innerHTML = icon('trash') + L('删除', 'Delete');
    buzz(8);
  }
  function move(e) {
    d.vx = d.vx * .65 + (e.clientX - d.lx) * .35;
    d.vy = d.vy * .65 + (e.clientY - d.ly) * .35;
    d.lx = e.clientX; d.ly = e.clientY;
    d.tilt = reduce ? 0 : Math.max(-6, Math.min(6, -2.5 + d.vx * .7 + d.vy * .35));
    d.g.style.transform = `translate(${e.clientX - d.dx}px,${e.clientY - d.dy}px) rotate(${d.tilt}deg)`;
    const tr = trash.getBoundingClientRect();
    const over = e.clientX >= tr.left && e.clientX <= tr.right && e.clientY >= tr.top && e.clientY <= tr.bottom;
    if (over !== d.trash) { d.trash = over; trash.classList.toggle('over', over); d.g.classList.toggle('doomed', over); if (over) buzz(10); }
    d.marker.hidden = over;
    if (over) return;
    const center = e.clientY - d.dy + d.rows[d.source].height / 2 - box.getBoundingClientRect().top;
    const next = d.others.findIndex(row => center < row.top + row.height / 2);
    const target = next < 0 ? d.others.length : next;
    if (target === d.target) return;
    d.target = target; d.before = d.others[target]?.node.dataset.k || null;
    d.rows.forEach(({node}, i) => {
      const shift = i > d.source && i <= target ? -d.space : i >= target && i < d.source ? d.space : 0;
      node.style.setProperty('--slide', shift + 'px');
    });
    const slot = target <= d.source ? d.rows[target].top : d.rows[target].top + d.rows[target].height - d.rows[d.source].height;
    d.marker.style.top = Math.max(0, slot) + 'px';
    buzz(4);
  }
  function end(ok) {
    const x = d; d = null;
    if (!x.on) { if (ok) onClick(x.id); return; }
    const reorder = ok && !x.trash && x.target !== x.source && x.target !== undefined;
    const from = {left: x.lx - x.dx, top: x.ly - x.dy - (reduce ? 0 : 10),
      tilt: x.tilt, origin: x.g.style.transformOrigin};
    if (reorder) {
      dropRects = new Map(x.rows.map(({node}) => [node.dataset.k, node.getBoundingClientRect()]));
      dropRects.set(x.id, from);
    }
    x.g.remove(); x.marker.remove();
    for (const {node} of x.rows) node.style.removeProperty('--slide');
    x.it.classList.remove('fb-src'); document.body.classList.remove('dragging');
    trash.className = 'trash';
    if (!reorder && (!ok || !x.trash)) settleBar(x.it, from);
    if (!ok) return;
    if (x.trash) { onTrash(x.id); buzz([16, 30, 16]); return; }
    if (reorder) { onDrop(x.id, x.before); buzz(14); }
  }
}

/* ---------- step 2: what the simulated LLM understood ---------- */
function renderThink() {
  const items = [];
  const top = S.order.find(id => id !== 'money') && S.order[0];
  if (top) items.push({cls: 'rk', id: top, ic: 'drag', text: (top === 'money' ? L('最先考虑省钱', 'Prioritise saving money') : L(`最想保住：${name(top)}`, `Protect first: ${name(top)}`))});
  for (const id of S.order) if (S.locks[id]) items.push({cls: 'lk', id, ic: 'lock', text: (id === 'money' ? L('锁定：不额外花钱', 'Locked: no extra cost') : L(`必须完整保留：${name(id)}`, `Keep in full: ${name(id)}`))});
  const cap = mem('cap'), limit = cap && S.mem.cap ? cap.cap : 0;
  if (SC.acts.length) items.push({cls:'rk', ic:'money', text: limit ? L(`改签最多补 £${limit}`, `Up to £${limit} extra to rebook`) : L('只选无需补款的方案', 'No extra cost')});
  if (!items.length) items.push({cls: 'rk', ic: 'spark', text: L('添加安排后可设置优先级', 'Add an activity to set a priority')});
  const html = items.map(r => `<li class="req ${r.cls}"${r.id ? ` data-id="${r.id}"` : ''}><span class="src${r.cls === 'ev' || r.cls === 'lk' ? ' g' : ''}">${icon(r.ic)}</span>${r.id ? `<span class="dot" style="--c:${col(r.id)}"></span>` : ''}<span>${r.text}</span></li>`).join('');
  if ($('reqs')._h !== html) { $('reqs').innerHTML = html; $('reqs')._h = html; }
}
function renderMem() {
  const box = $('mems');
  if (!SC.memory.length) {
    box.innerHTML = '<p class="no-memory"></p>';
    box.firstChild.textContent = L('这趟行程还没有已保存的偏好。', 'No saved preferences for this trip yet.');
    return;
  }
  if (box.dataset.keys !== SC.memory.map(m => m.id).join() || !box.querySelector('[data-m]')) {
    box.dataset.keys = SC.memory.map(m => m.id).join();
    box.innerHTML = SC.memory.map(m => `<button class="mem" type="button" data-m="${m.id}"><span class="mi">${icon(m.kind === 'guess' ? 'spark' : 'person')}</span><b><span></span><span class="used"></span></b><small></small><span class="tog"><i></i></span></button>`).join('');
  }
  const plan = shown();
  for (const m of SC.memory) {
    const el = box.querySelector(`[data-m="${m.id}"]`), on = S.mem[m.id];
    let used = [];
    if (m.id === 'order' && S.guess && on) used = S.order.slice(0, 2);
    if (m.id === 'cap' && plan.cost > 0) used = ['money'];
    if (m.id === 'flex' && on && act(m.flexOf)) { const p = plan.at[m.flexOf]; if (p && !p.drop && p.s !== act(m.flexOf).plan.s) used = [m.flexOf]; }
    el.classList.toggle('off', !on); el.classList.toggle('inuse', on && used.length > 0);
    el.setAttribute('aria-pressed', on);
    el.querySelector('b span').textContent = L(m.text);
    el.querySelector('small').textContent = L(m.src);
    el.querySelector('.used').textContent = L('本次采用', 'Applied');
  }
}

/* ---------- step 3: new tickets and actions ---------- */
function actions(before,after) {
  return Planner.actions(S.trip,before,after,L);
}
function actionChoice(plan,key) {
  return key === 'transport' ? plan.leg.id : Planner.optionKey(plan.at[key]);
}
function canWithdraw(entry) {
  if (!entry.action.rev) return false;
  const now = S.n ? S.events[S.n-1].at : 0;
  const start = entry.key === 'transport' ? entry.after.leg.dep : (entry.after.at[entry.key].s ?? entry.before.at[entry.key].s);
  return start > now;
}
function renderBook() {
  const proposed = S.pending ? actions(S.confirmed,S.pending) : [];
  const rows = [];
  function row(a, stage, reversible) {
    const text = esc(a.text);
  const buttonText = stage === 'pending' ? L('撤回建议','Withdraw suggestion') : L('撤回已确认改动','Undo confirmed change');
    const control = reversible
      ? '<button type="button" class="rv" data-stage="'+stage+'" data-action="'+esc(a.key)+'" aria-label="'+buttonText+' · '+text+'">'+icon('undo')+buttonText+'</button>'
      : '<span class="rv">'+(stage === 'pending' ? L('确认后不可撤回','Final once confirmed') : L('已执行','Completed'))+'</span>';
    return '<li class="act '+(reversible?'rev':'irr')+'"><span class="ai">'+icon(a.icon)+'</span><span class="tx">'+text+'</span><span class="cost">'+(a.cost?'£'+a.cost:'')+'</span>'+control+'</li>';
  }
  if (S.step === 2 || S.step === 3) rows.push('<li class="empty">'+(S.step === 2 ? L('等待确定优先级','Waiting for your priorities') : L('等待核对偏好','Waiting for your preference review'))+'</li>');
  else if (S.think) rows.push('<li class="empty">'+L('等待新方案','Waiting for a proposal')+'</li>');
  else if (S.res?.ok === false) rows.push('<li class="empty">'+(clashIds().length ? L('锁定的安排无法同时满足','Locked plans conflict') : L('当前条件下没有其他方案','No other option fits the current limits'))+'</li>');
  for (const a of proposed) rows.push(row(a,'pending',a.rev));
  for (const entry of S.applied) {
    const a = actions(entry.before,entry.after).find(item => item.key === entry.key);
    if (a) rows.push(row(a,'confirmed',canWithdraw(entry)));
  }
  if (!rows.length) rows.push('<li class="empty">'+icon('check')+L('暂无变更','No changes')+'</li>');
  if (!S.think && S.res?.ok === false && Object.keys(S.excluded).length) rows.push('<li><button type="button" class="recover" data-restore-options>'+L('重新考虑已撤回的选项','Reconsider withdrawn options')+'</button></li>');
  const html=rows.join('');
  if ($('acts')._h !== html) {$('acts').innerHTML=html; $('acts')._h=html;}
  $('total').innerHTML='<small>'+L('额外花费','Extra cost')+'</small>£'+shown().cost;
  const irr=proposed.filter(a => !a.rev).length;
  $('go').disabled=S.think || !S.pending;
  $('go').innerHTML=icon('check')+(irr ? L('同意 '+irr+' 项并确认','Approve '+irr+' & confirm') : L('确认','Confirm'));
}

/* ---------- guidance across the three steps ---------- */
let thinkTimer = null;
let cueTimer, pulseTimer, cueStep = 0;
const panels = {2:'f1', 3:'f2', 4:'f3'};
function cueText(step) {
  if (step === 2) return SC.acts.length
    ? L('哪项安排最重要？把它拖到最上面。','Which activity matters most? Drag it to the top.')
    : L('核对当前优先级，然后继续。','Review your priorities, then continue.');
  if (step === 3) return L('请核对系统采用的偏好，关掉不适用的。','Review the preferences and turn off any that no longer apply.');
  if (S.res?.ok === false) return L('这些条件无法同时满足，请调整锁定项或偏好。','These constraints conflict. Review your locks or preferences.');
  if (!S.pending) return L('现有安排可以保留，请核对行程。','Your plans can stay as they are. Review the itinerary.');
  return L('请核对改动和费用，再决定是否确认。','Review the changes and cost before confirming.');
}
function positionCue() {
  if (!cueStep) return;
  const tip = $('step-tip'), rect = $(panels[cueStep]).getBoundingClientRect();
  tip.style.left = Math.max(12, Math.min(rect.left + 12, innerWidth - tip.offsetWidth - 12)) + 'px';
  const above = rect.top - tip.offsetHeight - 8;
  tip.style.top = Math.max(8, Math.min(above >= 8 ? above : rect.top + 48, innerHeight - tip.offsetHeight - 8)) + 'px';
}
function dismissCue() {
  clearTimeout(cueTimer); clearTimeout(pulseTimer);
  if (cueStep) $(panels[cueStep]).classList.remove('step-cue');
  $('step-tip').hidden = true; cueStep = 0;
}
function showCue(step) {
  dismissCue();
  cueStep = step;
  const panel = $(panels[step]), tip = $('step-tip');
  if (matchMedia('(max-width:760px)').matches) {
    panel.querySelector('header').scrollIntoView({block:'center',behavior:reduce ? 'instant' : 'smooth'});
  }
  tip.textContent = cueText(step);
  tip.hidden = false;
  positionCue();
  panel.classList.add('step-cue');
  pulseTimer = setTimeout(() => panel.classList.remove('step-cue'), 2700);
  cueTimer = setTimeout(dismissCue, 4500);
}
function guide() {
  $('a12').classList.toggle('run', S.step === 2 || S.step === 3);
  $('a23').classList.toggle('run', S.step === 3 || S.think);
  $('thinking').hidden = !S.think;
  $('f2').setAttribute('aria-busy', String(S.think));
  $('thinking-label').textContent = S.think ? L('正在思考…', 'Thinking…') : '';
  $('think-progress').setAttribute('aria-label', L('正在调整行程', 'Replanning the trip'));
  $('rank-done').textContent = L('排序完成', 'Finish ranking');
  $('rank-done').hidden = S.step !== 2;
  $('guess').hidden = S.step === 2;
  $('review-done').textContent = L('查看调整方案', 'See proposed changes');
  $('review-foot').hidden = S.step !== 3;
  if (cueStep) {$('step-tip').textContent = cueText(cueStep); positionCue();}
}
function thinkNow() {
  clearTimeout(thinkTimer);
  S.res = null; S.pending = null; S.think = S.n > 0 && S.step === 4;
  render();
  if (!S.think) return;
  const session = S;
  thinkTimer = setTimeout(() => {
    if (S !== session || !S.think) return;
    compute();
    S.think = false;
    render();
    if (!S.resultShown) {S.resultShown = true; showCue(4);}
    if (clashIds().length) buzz([20, 40, 20]);
  }, THINK);
}

/* ---------- shell ---------- */
function renderText() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  document.title = `TripFix · ${routeName(SC)}`;
  $('lang').textContent = lang === 'en' ? '中文' : 'English';
  renderTripPicker();
  $('restore-money').hidden = S.order.includes('money') || !SC.acts.length;
  $('restore-money').textContent = L('＋ 少花钱', '+ Spend less');
  const running = S.waiting || S.n > 0;
  $('replay').className = running ? 'replay' : 'replay start-demo g';
  $('replay').innerHTML = running ? icon('undo') + L('重新演示','Replay') : L('开始演示','Start demo');
  $('h-rank').textContent = L('优先级', 'Priority');
  $('ax-hi').textContent = L('高', 'Hi');
  $('ax-lo').textContent = L('低', 'Lo');
  $('ax-name').textContent = L('优先级', 'PRIORITY');
  $('add').innerHTML = icon('plus') + L('添加', 'Add');
  $('add').disabled = SC.acts.length >= MAX_ACTS;
  $('add').title = SC.acts.length >= MAX_ACTS ? L(`最多 ${MAX_ACTS} 个安排`, `Up to ${MAX_ACTS} items`) : '';
  const lastEdit = S.hist[S.hist.length - 1];
  $('edit-undo').disabled = !lastEdit;
  $('edit-undo').innerHTML = icon('undo') + (lastEdit?.deleted ? L('撤销删除', 'Undo delete') : L('撤销', 'Undo'));
  $('h-think').textContent = L('行程偏好', 'Trip preferences');
  $('h-req').textContent = L('本次偏好', 'Current preferences');
  $('h-mem').textContent = L('历史偏好', 'Past preferences');
  $('h-book').textContent = L('待确认', 'Pending actions');
  $('st1').innerHTML = S.guess && S.mem.order ? icon('spark') + L('参考过往排序', 'From past trips') : icon('person') + L('本次排序', 'Current order');
}
function beginDemo() {
  resetDemo();
  S.waiting = true;
  const session = S;
  S.secondsLeft = 3;
  const deadline = performance.now() + S.secondsLeft * 1000;
  render();
  function tick() {
    if (S !== session || !S.waiting) return;
    const remaining = deadline - performance.now();
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      if (seconds !== S.secondsLeft) {S.secondsLeft = seconds; renderCountdown();}
      feedTimer = setTimeout(tick, Math.max(1, remaining - (seconds - 1) * 1000));
      return;
    }
    S.waiting = false; S.n = 1; S.step = 2;
    render();
    showCue(2);
  }
  tick();
}
function render() {
  renderText();
  renderTop(); patchBars(); renderThink(); renderMem(); renderBook(); guide();
}
function say(t) { $('say').textContent = ''; setTimeout(() => { $('say').textContent = t; }, 30); }

function change(fn, deleted = false, editingBudget = false) {
  const previous = {kind: 'pref', deleted, json: JSON.stringify({order: S.order, locks: S.locks, guess: S.guess, mem: S.mem, manualOrder: S.manualOrder || null})};
  if (editingBudget) previous.memory = JSON.stringify(SC.memory);
  S.hist.push(previous);
  fn(); persist(); thinkNow();
}
/* itinerary edits: snapshot, edit, restart the demo from the new plan */
function tripSnap() {
  const {events, ...rest} = SC;
  return {kind: 'trip', json: JSON.stringify(rest), events,
    prefs: JSON.stringify({order: S.order, locks: S.locks, mem: S.mem, guess: S.guess, manualOrder: S.manualOrder}),
    demo: {n: S.n, step: S.step, resultShown: S.resultShown, confirmed: S.confirmed, applied: S.applied.slice(), excluded: structuredClone(S.excluded)}};
}
function restoreTrip(s) {
  for (const k of Object.keys(SC)) delete SC[k];
  Object.assign(SC, JSON.parse(s.json), {events: s.events});
  Object.assign(S, JSON.parse(s.prefs));
  syncOrder(); resetDemo(); Object.assign(S, s.demo); thinkNow();
}
function editTrip(fn, msg, deleted = false) {
  const snap = tripSnap();
  snap.deleted = deleted;
  S.hist.push(snap);
  fn(); syncOrder(); resetDemo(); persist(); render();
  if (msg) say(msg);
}
function undoLast() {
  const h = S.hist.pop(); if (!h) return;
  if (h.kind === 'trip') restoreTrip(h);
  else {
    if (h.memory) SC.memory = JSON.parse(h.memory);
    Object.assign(S, JSON.parse(h.json)); thinkNow();
  }
  persist();
}
function deleteAct(id) {
  if (id === 'money') {
    if (!S.order.includes(id)) return;
    change(() => {
      S.order = S.order.filter(item => item !== id);
      delete S.locks[id];
      S.guess = false;
    }, true);
    $('edit-undo').focus({preventScroll: true});
    return;
  }
  const nm = L(act(id).name);
  editTrip(() => { SC.acts = SC.acts.filter(a => a.id !== id); }, L(`已删除「${nm}」`, `Deleted ${nm}`), true);
}

function applyProposal() {
  const before=S.confirmed, after=S.pending;
  for (const action of actions(before,after)) {
    S.applied=S.applied.filter(entry => entry.key !== action.key);
    S.applied.push({key:action.key, action, before, after});
  }
  S.confirmed=after; S.pending=null;
}
function confirm() {
  if (S.think || !S.pending) return;
  dismissCue(); applyProposal(); compute(); render(); buzz(20);
}
function withdraw(key,stage) {
  let plan;
  if (stage === 'pending') {
    if (!S.pending || !actions(S.confirmed,S.pending).some(a=>a.key===key && a.rev)) return;
    plan=S.pending;
  } else {
    const entry=S.applied.find(item=>item.key===key);
    if (!entry || !canWithdraw(entry)) return;
    plan=entry.after;
    const restored={...S.confirmed,at:{...S.confirmed.at}};
    if (key==='transport') restored.leg=entry.before.leg;
    else restored.at[key]=entry.before.at[key];
    restored.cost=restored.leg.cost + Object.values(restored.at).reduce((sum,a)=>sum+(a.cost||0),0);
    S.confirmed=restored;
    S.applied=S.applied.filter(item=>item!==entry);
  }
  const choice=actionChoice(plan,key);
  S.excluded[key]=[...new Set([...(S.excluded[key]||[]),choice])];
  thinkNow();
}

/* ---------- the item card: add / edit / delete ---------- */
let D = null;
function seg(box, opts, val, key) {
  box.innerHTML = opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === val}">${t}</button>`).join('');
  box.onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; D[key] = b.dataset.v; seg(box, opts, D[key], key); validate(); };
}
function modeOf(a) {
  if (a.mode) return a.mode;
  if (a.flex) return a.flex.min < a.flex.dur ? 'short' : 'move';
  return 'fixed';
}
function openAct(id) {
  if (id === 'money') {
    $('money-name').textContent = L('少花钱', 'Spend less');
    $('money-budget-label').textContent = L('改签最多补多少（£）', 'Maximum extra rebooking cost (£)');
    $('money-budget').value = S.mem.cap ? mem('cap')?.cap ?? 0 : 0;
    $('money-save').textContent = L('保存', 'Save');
    $('money-close').innerHTML = icon('x');
    $('money-close').setAttribute('aria-label', L('关闭', 'Close'));
    $('money-delete').innerHTML = icon('trash') + L('删除', 'Delete');
    $('money-dialog').showModal();
    $('money-budget').focus(); $('money-budget').select();
    return;
  }
  const a = id ? act(id) : null;
  if (!a && SC.acts.length >= MAX_ACTS) return;
  let s, e;
  if (a) { s = a.plan.s; e = a.plan.e; }
  else {
    const ends = SC.acts.map(x => x.plan.e + SC.gap);
    s = Math.ceil(Math.max(arrival(), ...ends) / 15) * 15; e = Math.min(s + 60, SC.dayEnd);
  }
  D = {id, icon: a ? a.icon : 'pin', flex: a ? modeOf(a) : 'move', kind: a ? a.kind : 'free', s0: s, e0: e, flex0: a ? modeOf(a) : null,
    color: a ? a.color : freeColor()};
  $('d-h').textContent = a ? L('编辑安排', 'Edit item') : L('添加安排', 'Add an item');
  $('d-sn').innerHTML = icon(a ? 'pencil' : 'plus');
  $('d-sn').style.setProperty('--c', D.color);
  $('l-name').textContent = L('名称', 'Name');
  $('l-place').textContent = L('地点（可选）', 'Place (optional)');
  $('l-s').textContent = L('开始', 'Start');
  $('l-e').textContent = L('结束', 'End');
  $('l-flex').textContent = L('出意外时', 'If something goes wrong');
  $('l-kind').textContent = L('类型', 'Type');
  $('l-icon').textContent = L('图标', 'Icon');
  $('d-name').value = a ? L(a.name) : '';
  $('d-place').value = a && a.place ? L(a.place) : '';
  $('d-s').value = fmt(s); $('d-e').value = fmt(e);
  seg($('d-flex'), [['fixed', L('时间不能动', 'Fixed time')], ['move', L('可以挪', 'Can move')], ['short', L('可挪可缩短', 'Move or shorten')]], D.flex, 'flex');
  seg($('d-kind'), [['free', L('不用票', 'Free')], ['ticket', L('有票', 'Ticketed')], ['social', L('约了人', 'With someone')]], D.kind, 'kind');
  $('d-icon').innerHTML = ICONS.map(n => `<button type="button" data-i="${n}" aria-pressed="${n === D.icon}" aria-label="${n}">${icon(n)}</button>`).join('');
  $('d-icon').style.setProperty('--c', D.color);
  $('d-del').hidden = !a;
  $('d-del').innerHTML = icon('trash') + L('删除', 'Delete');
  $('d-save').innerHTML = icon('check') + (a ? L('保存', 'Save') : L('添加', 'Add'));
  $('d-x').innerHTML = icon('x'); $('d-x').setAttribute('aria-label', L('关闭', 'Close'));
  validate();
  $('dlg').showModal();
  setTimeout(() => $('d-name').focus(), 30);
}
function freeColor() {
  const used = new Set(SC.acts.map(a => a.color));
  return PALETTE.find(c => !used.has(c)) || PALETTE[SC.acts.length % PALETTE.length];
}
function validate() {
  const nm = $('d-name').value.trim(), s = toMin($('d-s').value), e = toMin($('d-e').value);
  let w = '';
  if (!nm) w = L('起个名字', 'Give it a name');
  else if (isNaN(s) || isNaN(e)) w = L('填好开始和结束时间', 'Set the start and end');
  else if (e - s < 15) w = L('结束要比开始晚至少 15 分钟', 'End at least 15 min after start');
  else if (s < arrival()) w = L(`到达后才能开始：${fmt(arrival())} 之后`, `Starts after you arrive: ${fmt(arrival())}`);
  else if (e > SC.dayEnd) w = L(`要在 ${fmt(SC.dayEnd)} 前结束，才赶得上回程`, `Must end by ${fmt(SC.dayEnd)} to catch the return`);
  else {
    const hit = SC.acts.find(x => x.id !== D.id && s < x.plan.e + SC.gap && x.plan.s < e + SC.gap);
    if (hit) w = L(`和「${L(hit.name)}」（${fmt(hit.plan.s)}–${fmt(hit.plan.e)}）时间挨得太近`, `Too close to ${L(hit.name)} (${fmt(hit.plan.s)}–${fmt(hit.plan.e)})`);
  }
  $('d-warn').textContent = w;
  $('d-save').disabled = !!w;
  $('d-icon').querySelectorAll('[data-i]').forEach(b => b.setAttribute('aria-pressed', b.dataset.i === D.icon));
  return !w;
}
function saveAct() {
  if (!validate()) return;
  const nm = $('d-name').value.trim(), pl = $('d-place').value.trim(), s = toMin($('d-s').value), e = toMin($('d-e').value);
  const build = a => {
    const dur = e - s;
    a.plan = {s, e}; a.mode = D.flex; delete a.opts; delete a.flex;
    if (D.flex === 'fixed') a.opts = [{s,e}];
    else a.flex = {from: Math.max(arrival(), s - 120), to: Math.min(SC.dayEnd, e + 120), dur, min: D.flex === 'short' ? Math.max(15, Math.round(dur / 10) * 5) : dur};
  };
  const id = D.id;
  editTrip(() => {
    let a = id ? act(id) : null;
    if (!a) { a = {id: 'u' + Date.now().toString(36), color: D.color}; SC.acts.push(a); }
    if (!a.name || L(a.name) !== nm) a.name = {zh: nm, en: nm};
    if (!a.place || L(a.place) !== pl) a.place = {zh: pl, en: pl};
    a.icon = D.icon; a.kind = D.kind;
    if (a.kind === 'social' && !a.who) a.who = L('对方', 'them');
    if (!id || s !== D.s0 || e !== D.e0 || D.flex !== D.flex0) build(a);
    SC.view = [Math.min(SC.view[0], s - 30), Math.max(SC.view[1], e + 30)];
  }, id ? L(`已更新「${nm}」`, `Updated ${nm}`) : L(`已添加「${nm}」`, `Added ${nm}`));
  $('dlg').close();
}

/* ---------- trip details card ---------- */
function openTrip() {
  const leg = SC.legs[0];
  $('t-h').textContent = creating ? L('新建行程', 'New trip') : L('行程信息', 'Trip details');
  $('l-budget').textContent = L('改签补款上限（£）', 'Extra rebooking budget (£)');
  $('t-budget').value = mem('cap')?.cap ?? '';
  $('t-budget').placeholder = L('留空则只选免费方案', 'Blank for no extra cost');
  $('t-from').placeholder = L('出发城市', 'Departure city');
  $('t-to').placeholder = L('目的城市', 'Destination city');
  $('l-from').textContent = L('出发地', 'From');
  $('l-to').textContent = L('目的地', 'To');
  $('l-date').textContent = L('日期', 'Date');
  $('l-dep').textContent = L('去程出发', 'Depart');
  $('l-arr').textContent = L('到达', 'Arrive');
  $('l-ret').textContent = L('回程出发', 'Return');
  $('t-from').value = L(SC.from); $('t-to').value = L(SC.to); $('t-date').value = L(SC.date);
  $('t-dep').value = fmt(leg.dep); $('t-arr').value = fmt(leg.arr); $('t-ret').value = fmt(SC.home.t);
  $('t-x').innerHTML = icon('x');
  $('t-x').setAttribute('aria-label', L('关闭', 'Close'));
  $('t-clear').innerHTML = icon('trash') + L('清空所有安排', 'Clear all items');
  $('t-clear').hidden = !SC.acts.length;
  $('t-save').innerHTML = icon('check') + L('保存', 'Save');
  vTrip(); $('tdlg').showModal();
}
function vTrip() {
  const dep = toMin($('t-dep').value), arr = toMin($('t-arr').value), ret = toMin($('t-ret').value);
  let w = '';
  if (!$('t-from').value.trim() || !$('t-to').value.trim()) w = L('填写出发地和目的地', 'Enter the origin and destination');
  else if (!$('t-budget').validity.valid) w = L('预算需为 0–10000 之间的金额', 'Enter a budget from 0 to 10000');
  else if ([dep, arr, ret].some(isNaN)) w = L('填好三个时间', 'Fill in all three times');
  else if (arr - dep < 10) w = L('到达要晚于出发', 'Arrival must be after departure');
  else if (ret - arr < 90) w = L('回程至少要在到达 1.5 小时后', 'Return at least 1.5 h after arrival');
  const out = !w ? SC.acts.filter(a => a.plan.s < arr + SC.lead || a.plan.e > ret - 20) : [];
  $('t-warn').textContent = w || (out.length ? L(`有 ${out.length} 个安排超出时间范围`, `${out.length} item(s) outside the trip window`) : '');
  $('t-warn').classList.toggle('soft', !w && !!out.length);
  $('t-save').disabled = !!w;
  return !w;
}
function writeBudget(value, enable = false) {
  const old = mem('cap');
  if (value === '') {
    SC.memory = SC.memory.filter(m => m.id !== 'cap'); delete S.mem.cap; return;
  }
  const cap = Number(value);
  if (!old || old.cap !== cap) {
    const note = {id:'cap', kind:'said', cap, text:{zh:`改签时，你最多愿意多付 £${cap}`, en:`You’ll pay up to £${cap} extra to rebook`}, src:{zh:'你在这趟行程中设定的预算',en:'Budget you set for this trip'}};
    if (old) Object.assign(old,note); else SC.memory.push(note);
    S.mem.cap = true;
  } else if (enable) S.mem.cap = true;
}
function saveTrip() {
  if (!vTrip()) return;
  const v = id => $(id).value.trim(), dep = toMin(v('t-dep')), arr = toMin(v('t-arr')), ret = toMin(v('t-ret'));
  const fresh = !!creating;
  if (fresh) creating = null;
  editTrip(() => {
    writeBudget(v('t-budget'));
    const two = (o, val) => (o && L(o) === val) ? o : {zh: val, en: val};
    const fromChanged = L(SC.from) !== v('t-from'), toChanged = L(SC.to) !== v('t-to');
    SC.from = two(SC.from, v('t-from')); SC.to = two(SC.to, v('t-to')); SC.date = two(SC.date, v('t-date'));
    if (fresh) SC.title = {zh: SC.from.zh + ' → ' + SC.to.zh, en: SC.from.en + ' → ' + SC.to.en};
    const leg = SC.legs[0];
    if (leg.dep !== dep || leg.arr !== arr || fromChanged || toChanged || SC.home.t !== ret) {
      SC.legs = [Object.assign({}, leg, {dep, arr, a: fromChanged ? SC.from : leg.a, b: toChanged ? SC.to : leg.b, name: {zh: `去程 ${fmt(dep)}`, en: `Outbound ${fmt(dep)}`}})];
      SC.home = {t: ret}; SC.dayEnd = ret - 20; SC.events = null;
      SC.view = [Math.min(dep, ...SC.acts.map(a => a.plan.s)) - 30, Math.max(ret, ...SC.acts.map(a => a.plan.e)) + 25];
    }
  }, L('已更新行程信息', 'Trip details updated'));
  if (fresh) {S.hist.length = 0; render();}
  $('tdlg').close();
}

/* ---------- wiring ---------- */
function renderTripPicker() {
  const menu = $('trip-menu');
  const groups = [
    [L('过往行程', 'Past trips'), SCENARIOS.filter(t => !t.blank).map(t => TRIPS[t.id])],
    [L('已保存的行程', 'Saved trips'), Object.values(TRIPS).filter(t => t.id.startsWith('trip-') && t.id !== creating)]
  ];
  const options = groups.map(([label,trips]) => {
    const items = trips.map(t => {
      const current = t.id === SC.id;
      const detail = L(t.date) || fmt(t.legs[0].dep);
      return `<button type="button" data-trip="${esc(t.id)}" aria-current="${current}"><span><b>${esc(routeName(t))}</b><small>${esc(detail)}</small></span>${current ? icon('check') : ''}</button>`;
    }).join('');
    return items ? `<section><h2>${label}</h2>${items}</section>` : '';
  }).join('') + `<button class="create-route" type="button" data-trip="new">${icon('plus')}${L('新建行程','New trip')}</button>`;
  if (menu._options !== options) {menu.innerHTML = options; menu._options = options;}
}
function showTripMenu(open, focusTrigger = false) {
  $('trip-menu').hidden = !open;
  $('trips').setAttribute('aria-expanded', String(open));
  if (open) ($('trip-menu').querySelector('[aria-current="true"]') || $('trip-menu').querySelector('button')).focus();
  else if (focusTrigger) $('trips').focus();
}
$('trips').onclick = () => showTripMenu($('trip-menu').hidden);
$('trip-menu').onclick = e => {
  const item = e.target.closest('[data-trip]'); if (!item) return;
  const id = item.dataset.trip;
  showTripMenu(false, true);
  if (id !== 'new') {discardDraft(); start(id,true); return;}
  previousTrip=S.id;
  creating='trip-'+(globalThis.crypto?.randomUUID?.() || Date.now().toString(36));
  TRIPS[creating]=strip({...TRIPS.blank,id:creating});
  start(creating); openTrip();
};
$('route-picker').addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('trip-menu').hidden) {e.preventDefault(); showTripMenu(false, true); return;}
  if (!['ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
  e.preventDefault();
  if ($('trip-menu').hidden) {showTripMenu(true); return;}
  const items = [...$('trip-menu').querySelectorAll('button')], i = items.indexOf(document.activeElement);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length-1 : (i + (e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
  items[next].focus();
});
document.addEventListener('pointerdown', e => {
  if (!$('trip-menu').hidden && !$('route-picker').contains(e.target)) showTripMenu(false);
});
$('route-picker').addEventListener('focusout', e => {
  if (!$('trip-menu').hidden && e.relatedTarget && !$('route-picker').contains(e.relatedTarget)) showTripMenu(false);
});
function discardDraft() {
  if (!creating) return;
  sessions.delete(creating); delete TRIPS[creating]; creating = null;
}
$('tdlg').addEventListener('close',()=>{
  if (!creating) return;
  discardDraft();
  start(previousTrip || 'london');
});
$('replay').onclick = () => {
  if (S.waiting || S.n > 0) {
    resetDemo();
    render();
    return;
  }
  beginDemo();
};
$('rank-done').onclick = () => {
  if (S.step !== 2) return;
  S.step = 3; render(); showCue(3);
};
$('review-done').onclick = () => {
  if (S.step !== 3) return;
  dismissCue(); S.step = 4; thinkNow();
};
addEventListener('scroll', positionCue, {capture:true, passive:true});
addEventListener('resize', positionCue);
$('lang').onclick = () => { location.hash = lang === 'en' ? 'zh' : 'en'; };
addEventListener('hashchange', () => {
  const h = location.hash.slice(1); if (h !== 'zh' && h !== 'en') return;
  lang = h; try { localStorage.setItem('tripfix-lang', lang); } catch (e) {}
  $('mems').innerHTML = ''; $('rt').innerHTML = ''; render();
});
$('go').onclick = confirm;
$('acts').onclick = e => {
  if (e.target.closest('[data-restore-options]')) {S.excluded={}; thinkNow(); return;}
  const button=e.target.closest('[data-action]');
  if (button) withdraw(button.dataset.action,button.dataset.stage);
};
$('add').onclick = () => openAct(null);
$('empty').addEventListener('click', e => { if (e.target.closest('[data-add]')) openAct(null); });
$('edit-trip').onclick = openTrip;
$('restore-money').onclick = () => {
  if (!S.order.includes('money')) change(() => S.order.push('money'));
  openAct('money');
};
$('money-form').onsubmit = e => {
  e.preventDefault();
  const field = $('money-budget');
  if (!field.reportValidity()) return;
  $('money-dialog').close();
  change(() => writeBudget(field.value, true), false, true);
};
$('bars').addEventListener('click', e => {
  const b = e.target.closest('[data-lock]'); if (!b) return;
  const id = b.dataset.lock;
  change(() => { S.locks[id] = !S.locks[id]; });
  buzz(10);
  const n = document.querySelector(`[data-lock="${id}"]`); if (n) n.focus();
});
$('bars').addEventListener('keydown', e => {
  const bar = e.target.closest('.bar'); if (!bar || e.target.closest('button')) return;
  const id = bar.dataset.k;
  if (e.key === 'Enter') { e.preventDefault(); openAct(id); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteAct(id); return; }
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  e.preventDefault();
  const i = S.order.indexOf(id), j = i + (e.key === 'ArrowUp' ? -1 : 1);
  if (j < 0 || j >= S.order.length) return;
  change(() => { const o = S.order.slice(); o.splice(i, 1); o.splice(j, 0, id); S.order = o; S.guess = false; if (mem('order')) S.mem.order=false; });
  const n = document.querySelector(`.bar[data-k="${id}"]`); if (n) n.focus();
});
dnd($('bars'), (id, before) => change(() => {
  const o = S.order.filter(x => x !== id), i = before ? o.indexOf(before) : -1;
  if (i < 0) o.push(id); else o.splice(i, 0, id);
  S.order = o; S.guess = false; if (mem('order')) S.mem.order=false;
}), deleteAct, openAct);
$('mems').addEventListener('click', e => {
  const c = e.target.closest('[data-m]'); if (!c) return;
  const k = c.dataset.m;
  change(() => {
    S.mem[k] = !S.mem[k];
    const mo = mem('order');
    if (k === 'order' && mo) {
      const money = S.order.includes('money');
      if (S.mem.order) { S.manualOrder = S.order.slice(); S.order = mo.order.slice(); S.guess = true; }
      else { S.order = (S.manualOrder || (S.guess ? mo.plain : S.order)).slice(); S.guess = false; }
      if (!money) S.order = S.order.filter(id => id !== 'money');
      syncOrder();
    }
  });
  buzz(10);
});
$('d-icon').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { D.icon = b.dataset.i; validate(); } });
['d-name', 'd-place', 'd-s', 'd-e'].forEach(id => $(id).addEventListener('input', validate));
['t-from','t-to','t-budget','t-dep','t-arr','t-ret'].forEach(id => $(id).addEventListener('input', vTrip));
$('dform').addEventListener('submit', e => { e.preventDefault(); saveAct(); });
$('tform').addEventListener('submit', e => { e.preventDefault(); saveTrip(); });
$('d-x').onclick = () => $('dlg').close();
$('t-x').onclick = () => $('tdlg').close();
$('d-del').onclick = () => { const id = D.id; $('dlg').close(); if (id) deleteAct(id); };
$('t-clear').onclick = () => { $('tdlg').close(); editTrip(() => { SC.acts = []; }, L('已清空所有安排', 'All items cleared'), true); };
$('money-close').onclick = () => $('money-dialog').close();
$('money-delete').onclick = () => { $('money-dialog').close(); deleteAct('money'); };
['dlg', 'tdlg', 'money-dialog'].forEach(id => $(id).addEventListener('click', e => { if (e.target === $(id)) $(id).close(); }));
$('edit-undo').onclick = undoLast;
document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]')) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undoLast(); }
});
['mouseover', 'mouseout', 'focusin', 'focusout'].forEach(t => document.addEventListener(t, e => {
  const src = e.target.closest && e.target.closest('[data-id]'); if (!src) return;
  const on = t === 'mouseover' || t === 'focusin';
  document.querySelectorAll(`[data-id="${src.dataset.id}"]`).forEach(n => n.classList.toggle('hl', on));
}));
addEventListener('resize', () => { if (S) {patchRoute();} });

const q = new URLSearchParams(location.search);
const requested = q.get('trip');
start(requested && requested !== 'blank' && Object.hasOwn(TRIPS, requested) ? requested : SCENARIOS.find(t => !t.blank).id);
})();

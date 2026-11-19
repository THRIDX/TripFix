(function (root) {
'use strict';
const P = root.Planner = {};
const EPS = 1e-9;
const clone = o => JSON.parse(JSON.stringify(o));

P.original = sc => ({
  leg: clone(sc.legs[0]), cost: 0,
  at: Object.fromEntries(sc.acts.map(a => [a.id, {id: a.id, s: a.plan.s, e: a.plan.e, cost: 0}]))
});

P.state = (sc, n) => {
  const st = {legs: clone(sc.legs), act: {}, ids: sc.acts.map(a => a.id), broken: null,
    lead: sc.lead, gap: sc.gap, dayEnd: sc.dayEnd};
  for (const a of sc.acts) st.act[a.id] = clone(a);
  for (let i = 0; i < n; i++) sc.events[i].patch(st);
  return st;
};

function places(a, ready, dayEnd, flexOn, fixed) {
  if (fixed) return [fixed];
  const out = [{id: a.id, drop: true, cost: 0}];
  const add = (s, e, adjusted = false, cost, note) => { if (s >= ready && e <= dayEnd) out.push({id: a.id, s, e, adjusted, cost: cost || 0, note}); };
  for (const o of a.opts || []) add(o.s, o.e, o.adjusted === true || (o.keep != null && o.keep < 1), o.cost, o.note);
  if (a.flex) {
    const f = a.flex;
    if (flexOn) {
      for (let s = f.from; s + f.min <= f.to; s += 15) {
        if (s + f.dur <= f.to) add(s, s + f.dur);
        if (f.min < f.dur) add(s, s + f.min, true, 0, {zh: '缩短', en: 'shortened'});
      }
    } else if (a.plan.s >= f.from && a.plan.e <= f.to) add(a.plan.s, a.plan.e);
  }
  return out.filter(p => !a.excluded?.includes(P.optionKey(p)));
}

P.optionKey = option => option.drop ? 'skip' : String(option.s) + '/' + String(option.e);
function preference(plan, id) {
  if (id === 'money') return -plan.cost;
  const slot = plan.at[id];
  return slot.drop ? 0 : slot.adjusted ? 1 : 2;
}
P.locked = (plan, id) => id === 'money' ? plan.cost === 0 : !plan.at[id].drop && !plan.at[id].adjusted;
P.same = (a, b) => !!a && !!b && a.leg.id === b.leg.id && Object.keys(a.at).every(id => {
  const x = a.at[id], y = b.at[id];
  return !!x.drop === !!y.drop && (x.drop || (x.s === y.s && x.e === y.e));
});
P.status = (sc, plan, id) => {
  if (id === 'money') return plan.cost ? 'spent' : 'kept';
  const p = plan.at[id], o = sc.acts.find(a => a.id === id).plan;
  if (p.drop) return 'dropped';
  if (p.adjusted) return 'short';
  return p.s !== o.s ? 'moved' : 'kept';
};

function changes(plan, ref) {
  if (!ref) return 0;
  let n = plan.leg.id === ref.leg.id ? 0 : 1;
  for (const id in plan.at) {
    const a = plan.at[id], b = ref.at[id];
    if (!!a.drop !== !!b.drop) n += 1;
    else if (!a.drop) n += (a.s !== b.s ? 1 : 0) + Math.abs(a.s - b.s) / 10000;
  }
  return n;
}

// Keep one best partial schedule for each set of activities, finish time and cost.
// All schedules in that state have exactly the same remaining choices.
function solveLargerTrip(st, acts, legs, prefs, now, fixed) {
  const order = prefs.order, ref = prefs.ref;
  const locks = order.filter(id => prefs.locks[id]);
  const drop = Object.fromEntries(acts.map(a => [a.id, {id:a.id, drop:true, cost:0}]));
  const frozen = acts.map(a => fixed(a.id));
  const byLeg = legs.filter(leg => leg.cost <= prefs.cap || ref?.leg.id === leg.id).map(leg => ({
    leg, choices: acts.map((a,i) => places(a, Math.max(leg.arr + st.lead,now), st.dayEnd, prefs.flex[a.id] !== false, frozen[i]).filter(p => !p.drop))
  }));
  function best(ordering, required) {
    const requiredMask = acts.reduce((m,a,i) => frozen[i] || a.excluded?.includes('skip') || required.includes(a.id) ? m | (1 << i) : m,0);
    function better(a,b) {
      if (!b) return true;
      for (const id of ordering) {
        const d = preference(a,id) - preference(b,id);
        if (Math.abs(d) > EPS) return d > 0;
      }
      return a.change < b.change || (a.change === b.change && a.cost < b.cost);
    }
    let winner;
    for (const {leg,choices} of byLeg) {
      const limit = prefs.cap + (leg.id === ref?.leg.id ? ref.leg.cost : 0);
      if (required.includes('money') && leg.cost) continue;
      const states = Array.from({length:1 << acts.length}, () => new Map());
      const start = {leg, at:drop, cost:leg.cost, end:-Infinity};
      start.change = changes(start,ref);
      states[0].set('start',start);
      for (let mask=0; mask<states.length; mask++) {
        for (const p of states[mask].values()) {
          if ((mask & requiredMask) === requiredMask && better(p,winner)) winner=p;
          for (let i=0; i<acts.length; i++) {
            if (mask & (1 << i)) continue;
            const id=acts[i].id, next=states[mask | (1 << i)];
            for (const slot of choices[i]) {
              const cost=p.cost + slot.cost;
              if (slot.s < p.end + st.gap || cost > limit || (cost && required.includes('money'))) continue;
              if (required.includes(id) && slot.adjusted) continue;
              const candidate={leg,at:{...p.at,[id]:slot},cost,end:slot.e};
              candidate.change=changes(candidate,ref);
              const key=slot.e+'|'+cost;
              if (better(candidate,next.get(key))) next.set(key,candidate);
            }
          }
        }
      }
    }
    return winner;
  }
  const plan=best(order,locks);
  if (!plan) {
    for (const id of locks) if (!best(order,[id])) return {st,ok:false,clash:[id]};
    for (let i=0;i<locks.length;i++) for (let j=i+1;j<locks.length;j++) {
      const pair=[locks[i],locks[j]];
      if (!best(order,pair)) return {st,ok:false,clash:pair};
    }
    return {st,ok:false,clash:locks};
  }
  return {st,ok:true,plan};
}

P.solve = (sc, n, prefs) => {
  const st = P.state(sc,n), ref = prefs.ref, now = prefs.now || 0;
  const acts = st.ids.map(id => st.act[id]);
  for (const a of acts) a.excluded = prefs.excluded?.[a.id] || [];
  const lost = !!(ref && st.broken && st.broken.id === ref.leg.id);
  const eligible = ref && ref.leg.dep <= now && !lost ? [ref.leg] : st.legs;
  const legs = eligible.filter(l => !prefs.excluded?.transport?.includes(l.id));
  const fixed = id => ref && !lost && !ref.at[id].drop && ref.at[id].s <= now ? ref.at[id] : null;
  return solveLargerTrip(st,acts,legs,prefs,now,fixed);
};

P.actions = (sc, cur, next, L) => {
  const list = [], name = id => L(sc.acts.find(a => a.id === id).name);
  const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  if (next.leg.id !== cur.leg.id) list.push({key:'transport', icon: 'train', text: L(next.leg.name), cost: next.leg.cost, rev: next.leg.cost === 0});
  for (const a of sc.acts) {
    const x = cur.at[a.id], y = next.at[a.id];
    if (!!x.drop === !!y.drop && (y.drop || (x.s === y.s && x.e === y.e))) continue;
    const when = y.drop ? '' : fmt(y.s);
    if (a.kind === 'social') list.push({key:a.id, icon: 'msg', text: y.drop ? L({zh: `告诉 ${a.who}：今天见不了`, en: `Tell ${a.who}: can’t meet today`}) : L({zh: `问 ${a.who}：改到 ${when}`, en: `Ask ${a.who}: move to ${when}`}), cost: 0, rev: false});
    else if (a.kind === 'ticket') list.push(y.drop ? {key:a.id, icon: a.icon, text: L({zh: `转售「${name(a.id)}」票`, en: `Resell the ${name(a.id)} ticket`}), cost: 0, rev: false}
      : {key:a.id, icon: a.icon, text: `${name(a.id)} → ${when}${y.note ? ' · ' + L(y.note) : ''}`, cost: y.cost, rev: !y.cost});
    else list.push({key:a.id, icon: a.icon, text: y.drop ? L({zh: `不去${name(a.id)}`, en: `Skip ${name(a.id)}`}) : `${name(a.id)} → ${when}${y.note ? ' · ' + L(y.note) : ''}`, cost: 0, rev: true});
  }
  return list;
};
})(typeof window !== 'undefined' ? window : globalThis);

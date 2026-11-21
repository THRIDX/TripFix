(function () {
'use strict';
const hm = (h, m) => h * 60 + m;

window.SCENARIOS = [
{
  id: 'london',
  tab: 'London',
  title: 'A day in London',
  from: 'Birmingham', to: 'London',
  date: 'Sat 10 Oct',
  view: [hm(11, 0), hm(21, 20)],
  lead: 20, gap: 10, dayEnd: hm(20, 40),
  home: {t: hm(21, 3), name: '21:03 home from Euston'},
  legs: [{id: 'av1150', dep: hm(11, 50), arr: hm(13, 12), cost: 0,
    name: 'Avanti 11:50 New St → Euston',
    a: 'New St', b: 'Euston'}],
  acts: [
    {id: 'opera', icon: 'opera', kind: 'ticket', name: 'Opera', place: 'Royal Opera House',
      plan: {s: hm(14, 30), e: hm(16, 45)},
      opts: [{s: hm(14, 30), e: hm(16, 45)},
        {s: hm(15, 45), e: hm(16, 45), adjusted: true, note: 'in at interval'},
        {s: hm(18, 0), e: hm(20, 15), cost: 12, note: 'evening show'}]},
    {id: 'dinner', icon: 'dinner', kind: 'social', who: 'Lina', name: 'Dinner with Lina', place: 'Covent Garden',
      plan: {s: hm(17, 0), e: hm(18, 0)},
      flex: {from: hm(16, 30), to: hm(19, 20), dur: 60, min: 25}},
    {id: 'walk', icon: 'walk', kind: 'free', name: 'Sunset walk', place: 'Waterloo Bridge',
      plan: {s: hm(18, 10), e: hm(18, 40)},
      opts: [{s: hm(18, 10), e: hm(18, 40), tag: 'sunset'},
        {s: hm(20, 15), e: hm(20, 35), adjusted: true, note: 'after dark'}]}
  ],
  memory: [
    {id: 'order', kind: 'guess', text: 'You may prefer sunset to a show', src: 'Inferred from your Porto trip in September',
      order: ['walk', 'dinner', 'opera', 'money'], plain: ['opera', 'dinner', 'walk', 'money']},
    {id: 'cap', kind: 'said', text: 'You’ll pay up to £20 extra to rebook', src: 'Budget you set on 2 October', cap: 20},
    {id: 'flex', kind: 'said', text: 'Dinner with Lina can move', src: 'Your dinner note from 8 October', flexOf: 'dinner'}
  ],
  events: [
    {at: hm(11, 5), icon: 'train', title: 'Train cancelled', service: 'Avanti 11:50',
      detail: 'Next one 13:30, Euston 14:52',
      patch: st => {
        st.broken = st.legs[0];
        st.legs = [
          {id: 'av1330', dep: hm(13, 30), arr: hm(14, 52), cost: 0, name: 'Avanti 13:30 New St → Euston', a: 'New St', b: 'Euston'},
          {id: 'ch1215', dep: hm(12, 15), arr: hm(14, 2), cost: 18, name: 'Chiltern 12:15 Moor St → Marylebone', a: 'Moor St', b: 'Marylebone'}];
      }}
  ]
},
{
  id: 'oxford',
  tab: 'Oxford',
  title: 'A day in Oxford',
  from: 'Birmingham', to: 'Oxford',
  date: 'Sat 16 May',
  view: [hm(9, 0), hm(20, 10)],
  lead: 15, gap: 10, dayEnd: hm(19, 35),
  home: {t: hm(19, 52), name: '19:52 home from Oxford'},
  legs: [{id: 'xc0933', dep: hm(9, 33), arr: hm(10, 43), cost: 0,
    name: 'CrossCountry 09:33 New St → Oxford',
    a: 'New St', b: 'Oxford'}],
  acts: [
    {id: 'tour', icon: 'book', kind: 'ticket', name: 'Bodleian tour', place: 'Bodleian Library',
      plan: {s: hm(11, 30), e: hm(12, 30)},
      opts: [{s: hm(11, 30), e: hm(12, 30)},
        {s: hm(15, 30), e: hm(16, 30), cost: 5, note: '15:30 tour'}]},
    {id: 'punt', icon: 'boat', kind: 'free', name: 'Punting', place: 'Magdalen Bridge',
      plan: {s: hm(14, 0), e: hm(15, 0)}, flex: {from: hm(12, 0), to: hm(17, 30), dur: 60, min: 30}},
    {id: 'tea', icon: 'cup', kind: 'social', who: 'Sam', name: 'Tea with Sam', place: 'Covered Market',
      plan: {s: hm(16, 0), e: hm(17, 0)}, flex: {from: hm(15, 30), to: hm(17, 50), dur: 60, min: 30}},
    {id: 'song', icon: 'church', kind: 'free', name: 'Evensong', place: 'Christ Church',
      plan: {s: hm(18, 0), e: hm(18, 45)}, opts: [{s: hm(18, 0), e: hm(18, 45)}]}
  ],
  memory: [
    {id: 'order', kind: 'guess', text: 'You may prefer seeing friends to sightseeing', src: 'Inferred from your Edinburgh trip in March',
      order: ['tea', 'song', 'tour', 'punt', 'money'], plain: ['tour', 'punt', 'tea', 'song', 'money']},
    {id: 'cap', kind: 'said', text: 'You’ll pay up to £20 extra to rebook', src: 'Budget you set on 1 May', cap: 20},
    {id: 'flex', kind: 'said', text: 'Tea with Sam can move', src: 'Your tea note from 12 May', flexOf: 'tea'}
  ],
  events: [
    {at: hm(9, 10), icon: 'train', title: 'Train cancelled', service: 'CrossCountry 09:33',
      detail: 'Next train 10:48, arriving in Oxford at 11:58',
      patch: st => {
        st.broken = st.legs[0];
        st.legs = [
          {id: 'xc1048', dep: hm(10, 48), arr: hm(11, 58), cost: 0, name: 'CrossCountry 10:48 New St → Oxford', a: 'New St', b: 'Oxford'},
          {id: 'ch0952', dep: hm(9, 52), arr: hm(11, 7), cost: 16, name: 'Chiltern 09:52 Moor St → Oxford', a: 'Moor St', b: 'Oxford'}];
      }}
  ]
},
{
  id: 'blank', blank: true,
  tab: '+ New trip',
  title: 'My day trip',
  from: '', to: '',
  date: '',
  view: [hm(9, 0), hm(21, 30)],
  lead: 20, gap: 10, dayEnd: hm(20, 40),
  home: {t: hm(21, 0)},
  legs: [{id: 'out', dep: hm(9, 30), arr: hm(10, 52), cost: 0, name: 'Outbound 09:30',
    a: '', b: ''}],
  acts: [],
  memory: [],
  events: null
}
];
})();

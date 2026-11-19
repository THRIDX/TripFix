(function () {
'use strict';
const hm = (h, m) => h * 60 + m;

window.SCENARIOS = [
{
  id: 'london',
  tab: {zh: '伦敦', en: 'London'},
  title: {zh: '伦敦一日行', en: 'A day in London'},
  from: {zh: '伯明翰', en: 'Birmingham'}, to: {zh: '伦敦', en: 'London'},
  date: {zh: '10 月 10 日 · 周六', en: 'Sat 10 Oct'},
  view: [hm(11, 0), hm(21, 20)],
  lead: 20, gap: 10, dayEnd: hm(20, 40),
  home: {t: hm(21, 3), name: {zh: '21:03 尤斯顿回程', en: '21:03 home from Euston'}},
  legs: [{id: 'av1150', dep: hm(11, 50), arr: hm(13, 12), cost: 0,
    name: {zh: 'Avanti 11:50 新街 → 尤斯顿', en: 'Avanti 11:50 New St → Euston'},
    a: {zh: '新街', en: 'New St'}, b: {zh: '尤斯顿', en: 'Euston'}}],
  acts: [
    {id: 'opera', icon: 'opera', kind: 'ticket', name: {zh: '歌剧', en: 'Opera'}, place: {zh: '皇家歌剧院', en: 'Royal Opera House'},
      plan: {s: hm(14, 30), e: hm(16, 45)},
      opts: [{s: hm(14, 30), e: hm(16, 45)},
        {s: hm(15, 45), e: hm(16, 45), adjusted: true, note: {zh: '中场入场', en: 'in at interval'}},
        {s: hm(18, 0), e: hm(20, 15), cost: 12, note: {zh: '换晚场', en: 'evening show'}}]},
    {id: 'dinner', icon: 'dinner', kind: 'social', who: 'Lina', name: {zh: '和 Lina 晚饭', en: 'Dinner with Lina'}, place: {zh: '考文特花园', en: 'Covent Garden'},
      plan: {s: hm(17, 0), e: hm(18, 0)},
      flex: {from: hm(16, 30), to: hm(19, 20), dur: 60, min: 25}},
    {id: 'walk', icon: 'walk', kind: 'free', name: {zh: '河边日落', en: 'Sunset walk'}, place: {zh: '滑铁卢桥', en: 'Waterloo Bridge'},
      plan: {s: hm(18, 10), e: hm(18, 40)},
      opts: [{s: hm(18, 10), e: hm(18, 40), tag: 'sunset'},
        {s: hm(20, 15), e: hm(20, 35), adjusted: true, note: {zh: '天黑后', en: 'after dark'}}]}
  ],
  memory: [
    {id: 'order', kind: 'guess', text: {zh: '行程冲突时，你可能更想看日落', en: 'You may prefer sunset to a show'}, src: {zh: 'TripFix 的推测 · 9 月的波尔图行程', en: 'Inferred from your Porto trip in September'},
      order: ['walk', 'dinner', 'opera', 'money'], plain: ['opera', 'dinner', 'walk', 'money']},
    {id: 'cap', kind: 'said', text: {zh: '改签时，你最多愿意多付 £20', en: 'You’ll pay up to £20 extra to rebook'}, src: {zh: '你在 10 月 2 日设定的预算', en: 'Budget you set on 2 October'}, cap: 20},
    {id: 'flex', kind: 'said', text: {zh: '你和 Lina 的晚饭可以改时间', en: 'Dinner with Lina can move'}, src: {zh: '你在 10 月 8 日为这顿晚饭留下的备注', en: 'Your dinner note from 8 October'}, flexOf: 'dinner'}
  ],
  events: [
    {at: hm(11, 5), icon: 'train', title: {zh: '列车取消', en: 'Train cancelled'}, service: 'Avanti 11:50',
      detail: {zh: '下一班 13:30，14:52 到尤斯顿', en: 'Next one 13:30, Euston 14:52'},
      patch: st => {
        st.broken = st.legs[0];
        st.legs = [
          {id: 'av1330', dep: hm(13, 30), arr: hm(14, 52), cost: 0, name: {zh: 'Avanti 13:30 新街 → 尤斯顿', en: 'Avanti 13:30 New St → Euston'}, a: {zh: '新街', en: 'New St'}, b: {zh: '尤斯顿', en: 'Euston'}},
          {id: 'ch1215', dep: hm(12, 15), arr: hm(14, 2), cost: 18, name: {zh: 'Chiltern 12:15 摩尔街 → 马里波恩', en: 'Chiltern 12:15 Moor St → Marylebone'}, a: {zh: '摩尔街', en: 'Moor St'}, b: {zh: '马里波恩', en: 'Marylebone'}}];
      }}
  ]
},
{
  id: 'oxford',
  tab: {zh: '牛津', en: 'Oxford'},
  title: {zh: '牛津一日行', en: 'A day in Oxford'},
  from: {zh: '伯明翰', en: 'Birmingham'}, to: {zh: '牛津', en: 'Oxford'},
  date: {zh: '5 月 16 日 · 周六', en: 'Sat 16 May'},
  view: [hm(9, 0), hm(20, 10)],
  lead: 15, gap: 10, dayEnd: hm(19, 35),
  home: {t: hm(19, 52), name: {zh: '19:52 牛津回程', en: '19:52 home from Oxford'}},
  legs: [{id: 'xc0933', dep: hm(9, 33), arr: hm(10, 43), cost: 0,
    name: {zh: 'CrossCountry 09:33 新街 → 牛津', en: 'CrossCountry 09:33 New St → Oxford'},
    a: {zh: '新街', en: 'New St'}, b: {zh: '牛津', en: 'Oxford'}}],
  acts: [
    {id: 'tour', icon: 'book', kind: 'ticket', name: {zh: '博德利导览', en: 'Bodleian tour'}, place: {zh: '博德利图书馆', en: 'Bodleian Library'},
      plan: {s: hm(11, 30), e: hm(12, 30)},
      opts: [{s: hm(11, 30), e: hm(12, 30)},
        {s: hm(15, 30), e: hm(16, 30), cost: 5, note: {zh: '改 15:30 场', en: '15:30 tour'}}]},
    {id: 'punt', icon: 'boat', kind: 'free', name: {zh: '撑篙', en: 'Punting'}, place: {zh: '莫德林桥', en: 'Magdalen Bridge'},
      plan: {s: hm(14, 0), e: hm(15, 0)}, flex: {from: hm(12, 0), to: hm(17, 30), dur: 60, min: 30}},
    {id: 'tea', icon: 'cup', kind: 'social', who: 'Sam', name: {zh: '和 Sam 下午茶', en: 'Tea with Sam'}, place: {zh: '室内市场', en: 'Covered Market'},
      plan: {s: hm(16, 0), e: hm(17, 0)}, flex: {from: hm(15, 30), to: hm(17, 50), dur: 60, min: 30}},
    {id: 'song', icon: 'church', kind: 'free', name: {zh: '晚祷', en: 'Evensong'}, place: {zh: '基督教会学院', en: 'Christ Church'},
      plan: {s: hm(18, 0), e: hm(18, 45)}, opts: [{s: hm(18, 0), e: hm(18, 45)}]}
  ],
  memory: [
    {id: 'order', kind: 'guess', text: {zh: '行程冲突时，你可能更想先见朋友', en: 'You may prefer seeing friends to sightseeing'}, src: {zh: 'TripFix 的推测 · 3 月的爱丁堡行程', en: 'Inferred from your Edinburgh trip in March'},
      order: ['tea', 'song', 'tour', 'punt', 'money'], plain: ['tour', 'punt', 'tea', 'song', 'money']},
    {id: 'cap', kind: 'said', text: {zh: '改签时，你最多愿意多付 £20', en: 'You’ll pay up to £20 extra to rebook'}, src: {zh: '你在 5 月 1 日设定的预算', en: 'Budget you set on 1 May'}, cap: 20},
    {id: 'flex', kind: 'said', text: {zh: '你和 Sam 的下午茶可以改时间', en: 'Tea with Sam can move'}, src: {zh: '你在 5 月 12 日为下午茶留下的备注', en: 'Your tea note from 12 May'}, flexOf: 'tea'}
  ],
  events: [
    {at: hm(9, 10), icon: 'train', title: {zh: '列车取消', en: 'Train cancelled'}, service: 'CrossCountry 09:33',
      detail: {zh: '下一班 10:48，11:58 到牛津', en: 'Next train 10:48, arriving in Oxford at 11:58'},
      patch: st => {
        st.broken = st.legs[0];
        st.legs = [
          {id: 'xc1048', dep: hm(10, 48), arr: hm(11, 58), cost: 0, name: {zh: 'CrossCountry 10:48 新街 → 牛津', en: 'CrossCountry 10:48 New St → Oxford'}, a: {zh: '新街', en: 'New St'}, b: {zh: '牛津', en: 'Oxford'}},
          {id: 'ch0952', dep: hm(9, 52), arr: hm(11, 7), cost: 16, name: {zh: 'Chiltern 09:52 摩尔街 → 牛津', en: 'Chiltern 09:52 Moor St → Oxford'}, a: {zh: '摩尔街', en: 'Moor St'}, b: {zh: '牛津', en: 'Oxford'}}];
      }}
  ]
},
{
  id: 'blank', blank: true,
  tab: {zh: '+ 新行程', en: '+ New trip'},
  title: {zh: '我的一日行', en: 'My day trip'},
  from: {zh: '', en: ''}, to: {zh: '', en: ''},
  date: {zh: '', en: ''},
  view: [hm(9, 0), hm(21, 30)],
  lead: 20, gap: 10, dayEnd: hm(20, 40),
  home: {t: hm(21, 0)},
  legs: [{id: 'out', dep: hm(9, 30), arr: hm(10, 52), cost: 0, name: {zh: '去程 09:30', en: 'Outbound 09:30'},
    a: {zh: '', en: ''}, b: {zh: '', en: ''}}],
  acts: [],
  memory: [],
  events: null
}
];
})();

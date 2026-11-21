'use strict';

const TripLibrary = (() => {
  const prefix = 'tripfix.v6.saved.';
  function readSavedText(key, value) {
    if (key === 'who' && value === '\u5bf9\u65b9') return 'them';
    if (value && typeof value.en === 'string' && typeof value.zh === 'string') return value.en;
    return value;
  }
  function entries() {
    const saved = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;
        try {
          const record = JSON.parse(localStorage.getItem(key), readSavedText);
          if (record?.trip?.id === key.slice(prefix.length) && Array.isArray(record.trip.acts) && record.trip.legs?.length) saved.push(record);
        } catch {}
      }
    } catch {}
    return saved;
  }
  function save(trip, s) {
    const {events, ...data} = trip;
    const record = {trip: data, originalEvents: !!events, prefs: {order: s.order, locks: s.locks, mem: s.mem, guess: s.guess, manualOrder: s.manualOrder}};
    try {localStorage.setItem(prefix + trip.id, JSON.stringify(record)); return true;} catch {return false;}
  }
  return {entries, save};
})();

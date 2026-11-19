'use strict';

const TripLibrary = (() => {
  const prefix = 'tripfix.v6.saved.';
  function entries() {
    const saved = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;
        try {
          const record = JSON.parse(localStorage.getItem(key));
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

/* Shared data layer for the customer app (index.html) and the partner app (partner/). Needs data.js first. */

// ponytail: localStorage is the "database", so the two apps only see each other inside one browser.
// Swap db.get/db.set for Supabase/Firebase calls when the backend account exists; callers don't change.
const db = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('jp_' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('jp_' + k, JSON.stringify(v)); return true; } catch { return false; } },
};

// Areas the business serves. One city to start with; edit this list for yours.
const AREAS = ['Sector 50, Gurugram', 'Sector 56, Gurugram', 'Sector 45, Gurugram', 'South City 1, Gurugram', 'DLF Phase 3, Gurugram', 'MG Road, Gurugram', 'Sector 29, Gurugram', 'Sohna Road, Gurugram', 'Golf Course Road, Gurugram', 'Sector 14, Gurugram', 'Palam Vihar, Gurugram', 'Sector 82, Gurugram'];
const ORDER_FLOW = ['placed', 'accepted', 'ready', 'picked', 'delivered'];
const RIDER_FEE = 30;       // paid to the rider per delivery
const SLOW_SECONDS = 120;   // after this long without a response, warn everyone

function seedData() {
  if (db.get('shops', null)) return;
  // Demo shops have no phone number on purpose, so "Call" never dials a stranger.
  const shops = [
    { id: 's1', name: 'Sharma Kirana Store', owner: 'Mahesh Sharma', phone: '', address: 'Shop 14, Main Market, Sector 50, Gurugram', areas: AREAS.slice(0, 4), open: true, approved: true },
    { id: 's2', name: 'Gupta General Store', owner: 'Anil Gupta', phone: '', address: 'Shop 3, Galleria Lane, DLF Phase 3, Gurugram', areas: AREAS.slice(4, 7), open: true, approved: true },
    { id: 's3', name: 'Fresh Basket Mart', owner: 'Sunita Yadav', phone: '', address: 'Shop 21, Vatika Market, Sohna Road, Gurugram', areas: AREAS.slice(7, 10), open: true, approved: true },
  ];
  const inv = {};
  shops.forEach((s, i) => {
    inv[s.id] = {};
    PRODUCTS.forEach((p, j) => {
      if ((j + i) % 7 === 6) return; // every shop is missing a few items, like a real one
      inv[s.id][p.id] = { price: p.price, qty: 6 + (j * 7 + i * 3) % 20, on: true };
    });
  });
  db.set('shops', shops);
  db.set('inv', inv);
  db.set('riders', []);
}

// ponytail: first open shop that lists the area. With a backend, pick by distance from the customer's map pin.
function shopForArea(area) {
  const mine = db.get('shops', []).filter(s => s.approved && s.areas.includes(area));
  return mine.find(s => s.open) || mine[0] || null;
}
function updateOrder(id, fn) {
  const orders = db.get('orders', []);
  const o = orders.find(x => x.id === id);
  if (!o) return null;
  fn(o);
  db.set('orders', orders);
  return o;
}
function setStatus(id, status, extra) {
  return updateOrder(id, o => { o.status = status; (o.hist ||= {})[status] = Date.now(); Object.assign(o, extra || {}); });
}
function changeStock(shopId, items, sign) {
  const inv = db.get('inv', {});
  items.forEach(x => { const row = inv[shopId]?.[x.id]; if (row) row.qty = Math.max(0, row.qty + sign * x.q); });
  db.set('inv', inv);
}

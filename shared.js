/* Shared data layer for the customer app (index.html) and the partner app (partner/). Needs data.js first. */

// ponytail: localStorage is the "database", so the two apps only see each other inside one browser.
// Swap db.get/db.set for Supabase/Firebase calls when the backend account exists; callers don't change.
const db = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('jp_' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('jp_' + k, JSON.stringify(v)); return true; } catch { return false; } },
};

// Areas the business serves: Ramnagar (Uttarakhand) and the Jim Corbett belt around it. Edit this list as you grow.
const AREAS = ['Kosi Road, Ramnagar', 'Ranikhet Road, Ramnagar', 'Lakhanpur, Ramnagar', 'Bhawaniganj, Ramnagar', 'Dhikuli, Ramnagar', 'Garjia, Ramnagar', 'Amdanda, Ramnagar', 'Peerumadara, Ramnagar', 'Chilkiya, Ramnagar', 'Himmatpur, Ramnagar', 'Dhela, Ramnagar', 'Chhoi, Ramnagar'];
const SEED = 'ramnagar-1'; // bump this when AREAS or the demo shops change, so old demo data is replaced
const ORDER_FLOW = ['placed', 'accepted', 'ready', 'picked', 'delivered'];
const RIDER_FEE = 30;       // paid to the rider per delivery
const SLOW_SECONDS = 120;   // after this long without a response, warn everyone

function seedData() {
  if (db.get('shops', null) && db.get('seed', '') === SEED) return;
  ['orders', 'partner', 'loc', 'riders', 'requests', 'ticks', 'seen', 'stockcheck', 'cart'].forEach(k => localStorage.removeItem('jp_' + k)); // demo data for the old area list
  db.set('seed', SEED);
  // Demo shops have no phone number on purpose, so "Call" never dials a stranger.
  const shops = [
    { id: 's1', name: 'Sharma Kirana Store', owner: 'Mahesh Sharma', phone: '', address: 'Shop 14, Kosi Road, near Bus Stand, Ramnagar, Nainital, Uttarakhand', areas: AREAS.slice(0, 4), open: true, approved: true },
    { id: 's2', name: 'Corbett General Store', owner: 'Anil Rawat', phone: '', address: 'Shop 3, Main Road, Dhikuli, Ramnagar, Nainital, Uttarakhand', areas: AREAS.slice(4, 7), open: true, approved: true },
    { id: 's3', name: 'Fresh Basket Mart', owner: 'Sunita Bisht', phone: '', address: 'Shop 21, Kashipur Road, Peerumadara, Ramnagar, Nainital, Uttarakhand', areas: AREAS.slice(7, 10), open: true, approved: true },
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

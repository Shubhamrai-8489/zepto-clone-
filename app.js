/* Jhatpat storefront — vanilla JS, hash router, state in localStorage. Data lives in data.js. */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rs = n => '₹' + n;

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('jp_' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('jp_' + k, JSON.stringify(v)); } catch { /* private mode: state stays in memory */ } },
};
const state = {
  cart: store.get('cart', {}),
  user: store.get('user', null),
  loc: store.get('loc', null),
  orders: store.get('orders', []),
  coupon: store.get('coupon', null),
  pay: 'upi',
};
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
const MAX_QTY = 9, FREE_DELIVERY = 199, DELIVERY_FEE = 25, HANDLING = 4;
const COUPON = { code: 'JHATPAT50', off: 50, min: 299 };
const TRACK_SECONDS = 60; // demo: a whole delivery plays out in one minute
const STAGES = ['Order placed', 'Packing your items', 'On the way', 'Delivered'];
const PLACES = ['Sector 50, Gurugram', 'Indiranagar, Bengaluru', 'Andheri West, Mumbai', 'Koregaon Park, Pune', 'Salt Lake, Kolkata', 'Gomti Nagar, Lucknow', 'Banjara Hills, Hyderabad', 'Anna Nagar, Chennai', 'Vaishali Nagar, Jaipur', 'Satellite, Ahmedabad', 'Civil Lines, Prayagraj', 'Hazratganj, Lucknow'];
const HINTS = ['milk', 'bread', 'maggi', 'chips', 'tomato', 'chocolate', 'atta', 'cold drink'];

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cart: '<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.2-6 8-6s6.800 2 8 6"/>',
  pin: '<path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.500"/><rect x="13" y="4" width="7" height="7" rx="1.500"/><rect x="4" y="13" width="7" height="7" rx="1.500"/><rect x="13" y="13" width="7" height="7" rx="1.500"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
};
const icon = n => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

/* ---------- Cart maths ---------- */
function bill() {
  const items = Object.entries(state.cart).map(([id, q]) => ({ p: byId[id], q })).filter(x => x.p);
  const sub = items.reduce((s, x) => s + x.p.price * x.q, 0);
  const mrp = items.reduce((s, x) => s + x.p.mrp * x.q, 0);
  const count = items.reduce((s, x) => s + x.q, 0);
  const delivery = !sub || sub >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  const handling = sub ? HANDLING : 0;
  const disc = state.coupon && sub >= COUPON.min ? COUPON.off : 0;
  return { items, sub, mrp, count, delivery, handling, disc, total: sub + delivery + handling - disc, saved: mrp - sub + disc };
}
function setQty(id, q) {
  if (q > MAX_QTY) return toast(`You can add up to ${MAX_QTY} of one item`);
  if (q <= 0) delete state.cart[id]; else state.cart[id] = q;
  store.set('cart', state.cart);
  syncCart();
}

/* ---------- Small templates ---------- */
const offPct = p => Math.round((1 - p.price / p.mrp) * 100);
function ctl(p) {
  const q = state.cart[p.id] || 0;
  return q
    ? `<div class="step"><button data-act="dec" data-id="${p.id}" aria-label="Remove one ${esc(p.name)}">−</button><span>${q}</span><button data-act="inc" data-id="${p.id}" aria-label="Add one more ${esc(p.name)}">+</button></div>`
    : `<button class="add" data-act="inc" data-id="${p.id}" aria-label="Add ${esc(p.name)} to cart">Add</button>`;
}
function card(p) {
  return `<article class="card">
    <a class="card-img" href="#/p/${p.id}" tabindex="-1" aria-hidden="true"><img loading="lazy" src="${p.img}" alt="">${p.mrp > p.price ? `<span class="off">${offPct(p)}% off</span>` : ''}</a>
    <div class="card-body">
      <span class="eta">${BRAND.eta} min</span>
      <a class="card-name" href="#/p/${p.id}">${esc(p.name)}</a>
      <span class="unit">${esc(p.unit)}</span>
      <div class="card-foot">
        <div class="price"><b>${rs(p.price)}</b>${p.mrp > p.price ? `<s>${rs(p.mrp)}</s>` : ''}</div>
        <div data-ctl="${p.id}">${ctl(p)}</div>
      </div>
    </div>
  </article>`;
}
const grid = (list, cls = '') => `<div class="grid ${cls}">${list.map(card).join('')}</div>`;
const billRows = b => `
  <div class="row"><span>Item total</span><span>${b.mrp > b.sub ? `<s class="sub">${rs(b.mrp)}</s> ` : ''}${rs(b.sub)}</span></div>
  <div class="row"><span>Delivery fee</span>${b.delivery ? `<span>${rs(b.delivery)}</span>` : '<span class="free">Free</span>'}</div>
  <div class="row"><span>Handling fee</span><span>${rs(b.handling)}</span></div>
  ${b.disc ? `<div class="row"><span>Coupon ${COUPON.code}</span><span class="free">−${rs(b.disc)}</span></div>` : ''}
  <div class="row total"><span>To pay</span><span>${rs(b.total)}</span></div>`;
const lineItem = (p, q, editable) => `<div class="line">
    <img src="${p.img}" alt="">
    <div><b>${esc(p.name)}</b><small>${esc(p.unit)}${editable ? '' : ` × ${q}`}</small></div>
    <div class="line-end">${editable ? `<div data-ctl="${p.id}">${ctl(p)}</div>` : ''}<strong>${rs(p.price * q)}</strong></div>
  </div>`;
const emptyState = (title, text, action) => `<div class="empty"><h2>${title}</h2><p>${text}</p>${action}</div>`;

/* ---------- Shell ---------- */
function renderShell() {
  $('#header').innerHTML = `
    <div class="wrap head">
      <a class="logo" href="#/" aria-label="${BRAND.name} home">${BRAND.name.slice(0, -3)}<i>${BRAND.name.slice(-3)}</i></a>
      <button class="loc" data-act="location" aria-label="Change delivery location"></button>
      <div class="search" role="search">
        <form data-form="search">
          ${icon('search')}
          <input id="q" type="search" autocomplete="off" enterkeyhint="search" aria-label="Search products">
          <button type="button" class="clear" data-act="clear-search" aria-label="Clear search" hidden>×</button>
        </form>
        <div class="sugg" id="sugg" hidden></div>
      </div>
      <div class="acts">
        <button class="hbtn" data-act="account" id="acct"></button>
        <button class="hbtn cart" data-act="cart" id="hcart"></button>
      </div>
    </div>
    <nav class="tabs wrap" aria-label="Categories">
      <a href="#/" data-tab="all">All</a>${CATS.map(c => `<a href="#/c/${c.id}" data-tab="${c.id}">${c.name}</a>`).join('')}
    </nav>`;
  $('#bottomnav').innerHTML = [['#/', 'home', 'Home'], ['#/categories', 'grid', 'Categories'], ['#/orders', 'bag', 'Orders'], ['#/account', 'user', 'Account']]
    .map(([h, i, l]) => `<a href="${h}" data-nav="${h}">${icon(i)}${l}</a>`).join('');
  $('#footer').innerHTML = `<div class="wrap foot">
      <div><h3>${BRAND.name}</h3><p>Groceries and daily needs at your door in about ${BRAND.eta} minutes. This is a demo store: nothing is charged and nothing ships.</p></div>
      <div><h3>Shop by category</h3><div class="foot-links">${CATS.map(c => `<a href="#/c/${c.id}">${c.name}</a>`).join('')}<button data-act="help">Help</button></div>
      <p style="margin-top:12px">Product photos: Open Food Facts contributors (CC BY-SA) and TheMealDB.</p></div>
    </div>`;
  syncHeader();
  let i = 0;
  const q = $('#q');
  const rotate = () => { q.placeholder = `Search "${HINTS[i++ % HINTS.length]}"`; };
  rotate(); setInterval(rotate, 2600);
}
function syncHeader() {
  $('.loc').innerHTML = `<b>Delivery in ${BRAND.eta} minutes</b><span>${icon('pin')}<em>${esc(state.loc || 'Select your location')}</em>${icon('down')}</span>`;
  $('#acct').innerHTML = `${icon('user')}<span class="lbl">${state.user ? 'Account' : 'Log in'}</span>`;
  $('#acct').setAttribute('aria-label', state.user ? 'Account' : 'Log in');
}
function syncCart() {
  const b = bill();
  document.querySelectorAll('[data-ctl]').forEach(el => { el.innerHTML = ctl(byId[el.dataset.ctl]); });
  $('#hcart').innerHTML = b.count ? `${icon('cart')}<span><small>${b.count} item${b.count > 1 ? 's' : ''}</small><b>${rs(b.sub)}</b></span>` : `${icon('cart')}<b>My cart</b>`;
  $('#cartbar').innerHTML = b.count ? `<button data-act="cart"><span>${b.count} item${b.count > 1 ? 's' : ''}<small>${rs(b.sub)}${b.saved > 0 ? ` · you save ${rs(b.saved)}` : ''}</small></span><span>View cart ›</span></button>` : '';
  document.body.classList.toggle('has-cart', b.count > 0);
  if ($('.drawer')) openCart();
  if (page === 'checkout') route();
}

/* ---------- Pages ---------- */
const pages = {
  home() {
    const pick = id => byId[id]?.img;
    return `<div class="wrap">
      <section class="hero">
        <div class="hero-copy">
          <h1>Groceries in <span>${BRAND.eta} minutes</span>, not an hour.</h1>
          <p>Fresh vegetables, milk, snacks and everything for the kitchen, from a store near you.</p>
          <a class="btn haldi" href="#/c/${CATS[0].id}">Start shopping</a>
        </div>
        <div class="hero-pics" aria-hidden="true">${HERO.map(id => `<img src="${pick(id)}" alt="">`).join('')}</div>
      </section>
      <div class="offers">${OFFERS.map(o => `<a class="offer" href="${o.href}"><div><h3>${o.title}</h3><p>${o.text}</p><u>${o.cta}</u></div><img src="${pick(o.img)}" alt=""></a>`).join('')}</div>
      <section class="sec"><div class="sec-head"><h2>Shop by category</h2></div>${tiles()}</section>
      ${CATS.map(c => `<section class="sec"><div class="sec-head"><h2>${c.name}</h2><a href="#/c/${c.id}" aria-label="See all ${c.name}">See all</a></div>
        <div class="rail">${PRODUCTS.filter(p => p.cat === c.id).slice(0, 10).map(card).join('')}</div></section>`).join('')}
    </div>`;
  },
  categories() {
    return `<div class="wrap"><h1 class="page-title">All categories</h1><div class="sec">${tiles()}</div></div>`;
  },
  c(catId, subId) {
    const c = catById[catId];
    if (!c) return pages.notFound();
    const sub = c.subs.find(s => s.id === subId);
    let list = PRODUCTS.filter(p => p.cat === c.id && (!sub || p.sub === sub.id));
    const sort = sessionSort;
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'off') list = [...list].sort((a, b) => offPct(b) - offPct(a));
    const subImg = s => PRODUCTS.find(p => p.cat === c.id && p.sub === s.id)?.img || c.img;
    document.title = `${c.name} — ${BRAND.name}`;
    return `<div class="wrap">
      <p class="crumbs"><a href="#/">Home</a> › ${sub ? `<a href="#/c/${c.id}">${c.name}</a> › ${sub.name}` : c.name}</p>
      <div class="cat">
        <nav class="cat-rail" aria-label="${c.name} sections">
          <a href="#/c/${c.id}" class="${sub ? '' : 'on'}"><img src="${c.img}" alt="">All</a>
          ${c.subs.map(s => `<a href="#/c/${c.id}/${s.id}" class="${sub?.id === s.id ? 'on' : ''}"><img src="${subImg(s)}" alt="">${s.name}</a>`).join('')}
        </nav>
        <div class="cat-main">
          <div class="cat-bar"><h1>${sub ? sub.name : c.name} <span class="sub">(${list.length})</span></h1>
            <label>Sort <select data-change="sort">${[['rel', 'Relevance'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['off', 'Biggest discount']].map(([v, l]) => `<option value="${v}" ${sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          </div>
          ${list.length ? grid(list) : emptyState('Nothing here yet', 'This section is being stocked.', `<a class="btn" href="#/c/${c.id}">See all ${c.name}</a>`)}
        </div>
      </div>
    </div>`;
  },
  p(id) {
    const p = byId[id];
    if (!p) return pages.notFound();
    const c = catById[p.cat];
    const similar = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => (b.sub === p.sub) - (a.sub === p.sub)).slice(0, 10);
    document.title = `${p.name} — ${BRAND.name}`;
    return `<div class="wrap">
      <p class="crumbs"><a href="#/">Home</a> › <a href="#/c/${c.id}">${c.name}</a> › ${esc(p.name)}</p>
      <div class="pdp">
        <div class="pdp-img"><img src="${p.img}" alt="${esc(p.name)}"></div>
        <div class="pdp-info">
          <span class="rating">★ ${p.rating} (${p.reviews})</span>
          <h1>${esc(p.name)}</h1>
          <p class="sub">${esc(p.brand)} · ${esc(p.unit)}</p>
          <div class="pdp-price"><b>${rs(p.price)}</b>${p.mrp > p.price ? `<s>MRP ${rs(p.mrp)}</s><em>${rs(p.mrp - p.price)} off</em>` : ''}</div>
          <p class="sub">Inclusive of all taxes</p>
          <div class="pdp-cta" data-ctl="${p.id}">${ctl(p)}</div>
          <div class="perks"><div>Delivery in ${BRAND.eta} min<small>From a store near you</small></div><div>Free delivery<small>On orders above ${rs(FREE_DELIVERY)}</small></div></div>
          <h2>Product details</h2>
          <table class="facts">
            <tr><th>Brand</th><td>${esc(p.brand)}</td></tr>
            <tr><th>Net quantity</th><td>${esc(p.unit)}</td></tr>
            <tr><th>Category</th><td><a class="link" href="#/c/${c.id}/${p.sub}">${c.subs.find(s => s.id === p.sub)?.name || c.name}</a></td></tr>
            <tr><th>About</th><td>${esc(p.about)}</td></tr>
          </table>
        </div>
      </div>
      <section class="sec"><div class="sec-head"><h2>More in ${c.name}</h2><a href="#/c/${c.id}">See all</a></div><div class="rail">${similar.map(card).join('')}</div></section>
    </div>`;
  },
  search(_, __, params) {
    const q = (params.get('q') || '').trim();
    const list = find(q);
    document.title = `Search — ${BRAND.name}`;
    const chips = `<div class="chips">${HINTS.map(h => `<a class="chip" href="#/search?q=${encodeURIComponent(h)}">${h}</a>`).join('')}</div>`;
    if (!q) return `<div class="wrap">${emptyState('Search the store', 'Try one of these.', chips)}</div>`;
    return `<div class="wrap"><h1 class="page-title">${list.length ? `Showing ${list.length} result${list.length > 1 ? 's' : ''} for “${esc(q)}”` : `No results for “${esc(q)}”`}</h1>
      ${list.length ? `<div class="sec">${grid(list)}</div>` : emptyState('', 'Check the spelling, or try a broader word.', chips)}</div>`;
  },
  checkout() {
    const b = bill();
    if (!b.count) return `<div class="wrap">${emptyState('Your cart is empty', 'Add a few items to check out.', '<a class="btn" href="#/">Browse the store</a>')}</div>`;
    if (!state.user || !state.loc) return `<div class="wrap">${emptyState('One more step', 'Log in and set a delivery location to check out.', '<button class="btn" data-act="proceed">Continue</button>')}</div>`;
    document.title = `Checkout — ${BRAND.name}`;
    const pay = [['upi', 'UPI', 'Any UPI app'], ['card', 'Credit or debit card', 'Visa, Mastercard, RuPay'], ['cod', 'Cash on delivery', 'Pay the rider in cash or UPI']];
    return `<div class="wrap"><h1 class="page-title">Checkout</h1>
      <div class="two">
        <div>
          <div class="panel"><h2>Deliver to</h2><div class="row"><span>${icon('pin')} ${esc(state.loc)}</span><button class="link" data-act="location">Change</button></div><p class="sub">Arrives in about ${BRAND.eta} minutes · +91 ${esc(state.user.phone)}</p></div>
          <div class="panel"><h2>Pay with</h2>${pay.map(([v, l, s]) => `<label class="opt"><input type="radio" name="pay" value="${v}" data-change="pay" ${state.pay === v ? 'checked' : ''}><span>${l}<small>${s}</small></span></label>`).join('')}
            <p class="note" style="margin-top:12px">Demo store: no money is charged.</p></div>
          <div class="panel"><h2>Your items (${b.count})</h2>${b.items.map(x => lineItem(x.p, x.q, true)).join('')}</div>
        </div>
        <div class="panel"><h2>Bill details</h2>${billRows(b)}<button class="btn block" style="margin-top:14px" data-act="place">Place order · ${rs(b.total)}</button></div>
      </div></div>`;
  },
  order(id) {
    const o = state.orders.find(x => x.id === id);
    if (!o) return pages.notFound();
    document.title = `Order ${o.id} — ${BRAND.name}`;
    return `<div class="wrap">
      <div class="track-top"><h1 id="t-title"></h1><p id="t-sub"></p>
        <div class="map"><svg viewBox="0 0 600 220" role="img" aria-label="Map of the delivery route">
          <rect width="600" height="220" fill="#DDE4F5"/>
          <g stroke="#fff" stroke-width="16" fill="none"><path d="M0 60h600M0 160h600M120 0v220M330 0v220M500 0v220"/></g>
          <g fill="#C9D3EE"><rect x="145" y="80" width="160" height="60" rx="8"/><rect x="355" y="80" width="120" height="60" rx="8"/><rect x="20" y="80" width="75" height="60" rx="8"/><rect x="525" y="80" width="60" height="60" rx="8"/></g>
          <path id="t-path" d="M60 160H330V60H540" fill="none" stroke="#1E3FE6" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round"/>
          <g transform="translate(60 160)"><circle r="13" fill="#15171C"/><text y="5" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">S</text></g>
          <g transform="translate(540 60)"><circle r="13" fill="#0B7F46"/><path d="M-6 1 0-5l6 6v6h-12z" fill="#fff"/></g>
          <g class="rider" id="t-rider"><circle r="12" fill="#FFC83A" stroke="#15171C" stroke-width="2.500"/><circle r="3.500" fill="#15171C"/></g>
        </svg></div>
      </div>
      <div class="two">
        <div>
          <div class="panel"><h2>Order status</h2><ol class="steps" id="t-steps"></ol></div>
          <div class="panel"><div class="rider-card"><div class="avatar">${o.rider[0]}</div><div><b>${o.rider}</b><p class="sub">Your delivery partner</p></div><button class="btn ghost sm" data-act="call">Call</button></div>
            <div class="row" style="margin-top:10px"><span class="sub">Need help with this order?</span><button class="link" data-act="help">Get help</button></div></div>
        </div>
        <div class="panel"><h2>Order ${o.id}</h2><p class="sub">${new Date(o.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · ${esc(o.loc)}</p>
          ${o.items.map(x => byId[x.id] ? lineItem(byId[x.id], x.q, false) : '').join('')}
          <div class="row total"><span>Paid by ${{ upi: 'UPI', card: 'card', cod: 'cash on delivery' }[o.pay]}</span><span>${rs(o.total)}</span></div>
          <button class="btn ghost block" style="margin-top:12px" data-act="reorder" data-id="${o.id}">Order again</button>
        </div>
      </div></div>`;
  },
  orders() {
    document.title = `Orders — ${BRAND.name}`;
    if (!state.orders.length) return `<div class="wrap">${emptyState('No orders yet', 'Your orders will show up here once you place one.', '<a class="btn" href="#/">Start shopping</a>')}</div>`;
    return `<div class="wrap"><h1 class="page-title">Your orders</h1><div class="sec">${state.orders.map(o => {
      const done = stageOf(o) === 3;
      return `<div class="panel order-card"><div><span class="badge ${done ? 'done' : ''}">${STAGES[stageOf(o)]}</span><h2 style="margin:6px 0 2px">Order ${o.id}</h2>
        <p class="sub">${o.items.reduce((s, x) => s + x.q, 0)} items · ${rs(o.total)} · ${new Date(o.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
        <div style="display:flex;gap:8px"><a class="btn ghost sm" href="#/order/${o.id}">${done ? 'View' : 'Track'}</a><button class="btn sm" data-act="reorder" data-id="${o.id}">Order again</button></div></div>`;
    }).join('')}</div></div>`;
  },
  account() {
    document.title = `Account — ${BRAND.name}`;
    if (!state.user) return `<div class="wrap">${emptyState('Log in to your account', 'Track orders and check out faster.', '<button class="btn" data-act="login">Log in or sign up</button>')}</div>`;
    return `<div class="wrap"><h1 class="page-title">Account</h1><p class="sub">+91 ${esc(state.user.phone)}</p>
      <div class="panel menu" style="margin-top:12px">
        <a href="#/orders"><span>Your orders</span><span>›</span></a>
        <button data-act="location"><span>Delivery location<br><small class="sub" style="font-weight:400">${esc(state.loc || 'Not set')}</small></span><span>›</span></button>
        <button data-act="help"><span>Help</span><span>›</span></button>
        <button data-act="logout"><span style="color:var(--red)">Log out</span></button>
      </div></div>`;
  },
  notFound() {
    return `<div class="wrap">${emptyState('We couldn’t find that page', 'It may have moved.', '<a class="btn" href="#/">Go to home</a>')}</div>`;
  },
};
const tiles = () => `<div class="tiles">${CATS.map(c => `<a class="tile" href="#/c/${c.id}"><div><img loading="lazy" src="${c.img}" alt=""></div>${c.name}</a>`).join('')}</div>`;

function find(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return PRODUCTS.filter(p => {
    const hay = `${p.name} ${p.brand} ${catById[p.cat].name} ${p.sub} ${p.tags || ''}`.toLowerCase();
    return words.every(w => hay.includes(w));
  });
}

/* ---------- Router ---------- */
let page = 'home', sessionSort = 'rel', ticker = null;
function route() {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
  page = seg[0] || 'home';
  clearInterval(ticker);
  document.title = `${BRAND.name} — groceries in ${BRAND.eta} minutes`;
  const fn = Object.hasOwn(pages, page) ? pages[page] : pages.notFound;
  $('#app').innerHTML = fn(seg[1], seg[2], new URLSearchParams(qs || ''));
  document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === (page === 'c' ? seg[1] : page === 'home' ? 'all' : '')));
  const nav = page === 'home' ? '#/' : ['categories', 'c'].includes(page) ? '#/categories' : ['orders', 'order'].includes(page) ? '#/orders' : page === 'account' ? '#/account' : '';
  document.querySelectorAll('#bottomnav a').forEach(a => a.classList.toggle('on', a.dataset.nav === nav));
  $('.tabs a.on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  if (page !== 'search') { $('#q').value = ''; $('.clear').hidden = true; }
  if (page === 'order') { const o = state.orders.find(x => x.id === seg[1]); if (o) { tick(o); ticker = setInterval(() => tick(o), 1000); } }
}
function navigate(hash) { if (location.hash === hash) route(); else location.hash = hash; }

/* ---------- Order tracking ---------- */
const progress = o => Math.min(1, (Date.now() - o.at) / 1000 / TRACK_SECONDS);
const stageOf = o => { const t = progress(o); return t >= 1 ? 3 : t >= 0.35 ? 2 : t >= 0.12 ? 1 : 0; };
function tick(o) {
  const t = progress(o), s = stageOf(o), left = Math.max(1, Math.ceil(BRAND.eta * (1 - t)));
  if (!$('#t-title')) return clearInterval(ticker);
  $('#t-title').textContent = s === 3 ? 'Your order has arrived' : `Arriving in ${left} min`;
  $('#t-sub').textContent = s === 3 ? 'Thanks for ordering. Enjoy!' : `${STAGES[s]} · demo tracking runs faster than real time`;
  $('#t-steps').innerHTML = STAGES.map((n, i) => `<li class="${i < s || s === 3 ? 'done' : i === s ? 'now' : ''}">${n}</li>`).join('');
  const path = $('#t-path'), ride = Math.max(0, (t - 0.35) / 0.65);
  const pt = path.getPointAtLength(path.getTotalLength() * ride);
  $('#t-rider').setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  if (s === 3) clearInterval(ticker);
}

/* ---------- Overlay ---------- */
let lastFocus = null, afterAuth = null;
function openOverlay(html, side) {
  const o = $('#overlay');
  if (o.hidden) lastFocus = document.activeElement;
  o.className = side ? 'side' : '';
  o.innerHTML = html;
  o.hidden = false;
  document.body.classList.add('locked');
  (o.querySelector('[autofocus]') || o.querySelector('.x'))?.focus();
}
function closeOverlay() {
  const o = $('#overlay');
  if (o.hidden) return;
  o.hidden = true; o.innerHTML = '';
  document.body.classList.remove('locked');
  lastFocus?.focus?.();
}
const mHead = t => `<div class="m-head"><h2>${t}</h2><button class="x" data-act="close" aria-label="Close">×</button></div>`;

function openCart() {
  const b = bill();
  const keep = $('.d-body')?.scrollTop || 0;
  const body = b.count ? `
      ${b.saved > 0 ? `<p class="save">You’re saving ${rs(b.saved)} on this order</p>` : ''}
      <div class="panel"><p class="sub" style="margin-bottom:4px">Delivery in ${BRAND.eta} minutes · ${b.count} item${b.count > 1 ? 's' : ''}</p>${b.items.map(x => lineItem(x.p, x.q, true)).join('')}</div>
      ${b.delivery ? `<p class="note" style="margin-top:12px">Add ${rs(FREE_DELIVERY - b.sub)} more for free delivery.</p>` : ''}
      <div class="panel" style="margin-top:12px"><h2>Coupon</h2>
        ${state.coupon ? `<div class="row"><span class="ok" style="margin:0">${COUPON.code} applied</span><button class="link" data-act="uncoupon">Remove</button></div>${b.disc ? '' : `<p class="err">Add ${rs(COUPON.min - b.sub)} more to use this code.</p>`}`
      : `<form class="coupon" data-form="coupon"><input class="field" name="code" placeholder="Coupon code" aria-label="Coupon code" autocapitalize="characters"><button class="btn ghost">Apply</button></form><p class="sub" id="c-msg" style="margin-top:6px">Try ${COUPON.code} on orders above ${rs(COUPON.min)}.</p>`}
      </div>
      <div class="panel"><h2>Bill details</h2>${billRows(b)}</div>`
    : emptyState('Your cart is empty', 'Add items from the store and they’ll show up here.', '<button class="btn" data-act="close">Browse the store</button>');
  openOverlay(`<aside class="drawer" role="dialog" aria-modal="true" aria-label="Cart">${mHead('My cart')}<div class="d-body">${body}</div>
    ${b.count ? `<div class="d-foot"><button class="btn block" data-act="proceed"><span>${rs(b.total)}<small style="display:block;font-weight:500;opacity:.9">Total</small></span><span>${state.user ? 'Proceed to pay' : 'Log in to continue'} ›</span></button></div>` : ''}</aside>`, true);
  $('.d-body').scrollTop = keep;
}
function openLocation(then) {
  afterAuth = then || null;
  openOverlay(`<div class="modal" role="dialog" aria-modal="true" aria-label="Delivery location">${mHead('Where should we deliver?')}
    <button class="btn ghost block" data-act="detect">${icon('pin')} Use my current location</button>
    <input class="field" id="place-q" placeholder="Search area, street or city" aria-label="Search area" style="margin-top:12px" autofocus>
    <ul class="places" id="places"></ul></div>`);
  renderPlaces('');
}
function renderPlaces(q) {
  const t = q.trim().toLowerCase();
  const hits = PLACES.filter(p => p.toLowerCase().includes(t));
  const custom = t.length >= 4 && !hits.some(p => p.toLowerCase() === t) ? [q.trim()] : [];
  $('#places').innerHTML = [...hits, ...custom].map(p => `<li><button data-act="place-pick" data-v="${esc(p)}">${icon('pin')}<span>${hits.includes(p) ? esc(p) : `Deliver to “${esc(p)}”`}</span></button></li>`).join('')
    || '<li class="sub" style="padding:12px 6px">Type at least 4 letters to use your own area.</li>';
}
function setLoc(v) {
  state.loc = v; store.set('loc', v);
  syncHeader(); toast(`Delivering to ${v}`);
  const next = afterAuth; afterAuth = null;
  closeOverlay();
  if (next) next(); else if (page === 'checkout' || page === 'account') route();
}
function openLogin(then) {
  afterAuth = then || null;
  openOverlay(`<div class="modal" role="dialog" aria-modal="true" aria-label="Log in">${mHead('Log in or sign up')}
    <p>Enter your mobile number. We’ll text you a code.</p>
    <form data-form="phone"><div class="phone"><span>+91</span><input class="field" name="phone" inputmode="numeric" autocomplete="tel-national" maxlength="10" placeholder="10-digit mobile number" aria-label="Mobile number" data-input="phone" autofocus></div>
    <button class="btn block" disabled>Continue</button></form></div>`);
}
function openOtp(phone) {
  openOverlay(`<div class="modal" role="dialog" aria-modal="true" aria-label="Enter code">${mHead('Enter the code')}
    <p>Sent to +91 ${esc(phone)}. <button class="link" data-act="login">Change number</button></p>
    <form data-form="otp" data-phone="${esc(phone)}"><input class="field otp" name="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="4" placeholder="••••" aria-label="4-digit code" data-input="otp" autofocus>
    <p class="note">Demo: no text is sent. Enter any 4 digits.</p>
    <button class="btn block" disabled>Verify and continue</button></form>
    <p style="margin-top:12px"><button class="link" data-act="resend">Resend code</button></p></div>`);
}
function openHelp() {
  const faqs = [
    ['How fast is delivery?', `Most orders arrive in about ${BRAND.eta} minutes. The time on your tracking screen is the one to go by.`],
    ['Is there a delivery fee?', `Delivery is free on orders above ${rs(FREE_DELIVERY)}. Below that it’s ${rs(DELIVERY_FEE)}. A ${rs(HANDLING)} handling fee applies to every order.`],
    ['Why can’t I add more than 9 of an item?', `Each item is limited to ${MAX_QTY} per order so stock lasts for everyone nearby.`],
    ['Can I change my address after ordering?', 'Not after the order is packed. Change it in the cart or at checkout before you place the order.'],
    ['Is this a real store?', 'No. This is a demo: nothing is charged, no text messages are sent and nothing ships.'],
  ];
  openOverlay(`<div class="modal" role="dialog" aria-modal="true" aria-label="Help">${mHead('Help')}${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`);
}
function proceed() {
  if (!bill().count) return;
  if (!state.loc) return openLocation(proceed);
  if (!state.user) return openLogin(proceed);
  closeOverlay();
  navigate('#/checkout');
}
function placeOrder() {
  const b = bill();
  if (!b.count) return;
  const riders = ['Ravi Kumar', 'Imran Sheikh', 'Suresh Yadav', 'Deepak Singh'];
  const o = { id: 'JP' + String(Date.now()).slice(-6), at: Date.now(), items: b.items.map(x => ({ id: x.p.id, q: x.q })), total: b.total, pay: state.pay, loc: state.loc, rider: riders[Date.now() % riders.length] };
  state.orders.unshift(o); store.set('orders', state.orders);
  state.cart = {}; store.set('cart', {});
  state.coupon = null; store.set('coupon', null);
  page = 'order'; // so syncCart doesn't re-render checkout
  syncCart();
  navigate('#/order/' + o.id);
  toast('Order placed');
}

/* ---------- Toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- Search suggestions ---------- */
function suggest(q) {
  const box = $('#sugg'), list = find(q).slice(0, 6);
  $('.clear').hidden = !q;
  if (!q.trim()) { box.hidden = true; return; }
  const mark = name => { const i = name.toLowerCase().indexOf(q.trim().toLowerCase()); return i < 0 ? esc(name) : `${esc(name.slice(0, i))}<b>${esc(name.slice(i, i + q.trim().length))}</b>${esc(name.slice(i + q.trim().length))}`; };
  box.innerHTML = list.map(p => `<a href="#/p/${p.id}"><img src="${p.img}" alt=""><span>${mark(p.name)}<small>${esc(p.unit)} · ${rs(p.price)}</small></span></a>`).join('')
    + `<a class="all" href="#/search?q=${encodeURIComponent(q.trim())}">${list.length ? `See all results for “${esc(q.trim())}”` : `No matches. Search for “${esc(q.trim())}” anyway`}</a>`;
  box.hidden = false;
}

/* ---------- Events ---------- */
const actions = {
  inc: el => setQty(el.dataset.id, (state.cart[el.dataset.id] || 0) + 1),
  dec: el => setQty(el.dataset.id, (state.cart[el.dataset.id] || 0) - 1),
  cart: () => openCart(),
  close: () => closeOverlay(),
  location: () => openLocation(),
  login: () => openLogin(afterAuth),
  account: () => (state.user ? navigate('#/account') : openLogin()),
  help: () => openHelp(),
  proceed: () => proceed(),
  place: () => placeOrder(),
  call: () => toast('Calls are switched off in this demo'),
  resend: () => toast('Code sent again'),
  logout: () => { state.user = null; store.set('user', null); syncHeader(); route(); toast('Logged out'); },
  uncoupon: () => { state.coupon = null; store.set('coupon', null); syncCart(); },
  'clear-search': () => { const q = $('#q'); q.value = ''; suggest(''); q.focus(); },
  'place-pick': el => setLoc(el.dataset.v),
  detect: () => {
    if (!navigator.geolocation) return toast('Location isn’t available here. Pick an area from the list.');
    toast('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      p => setLoc(`Current location (${p.coords.latitude.toFixed(3)}, ${p.coords.longitude.toFixed(3)})`),
      () => toast('Couldn’t get your location. Pick an area from the list.'),
      { timeout: 8000 });
  },
  reorder: el => {
    const o = state.orders.find(x => x.id === el.dataset.id);
    o.items.forEach(x => { if (byId[x.id]) state.cart[x.id] = Math.min(MAX_QTY, (state.cart[x.id] || 0) + x.q); });
    store.set('cart', state.cart); syncCart(); openCart();
  },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el) { e.preventDefault(); actions[el.dataset.act]?.(el); return; }
  if (e.target.id === 'overlay') closeOverlay();
  if (!e.target.closest('.search')) $('#sugg').hidden = true;
  if (e.target.closest('#sugg a')) { $('#sugg').hidden = true; $('#q').blur(); }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#overlay').hidden) closeOverlay(); else $('#sugg').hidden = true;
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'q') suggest(t.value);
  if (t.id === 'place-q') renderPlaces(t.value);
  if (t.dataset.input) {
    t.value = t.value.replace(/\D/g, '');
    t.form.querySelector('.btn').disabled = t.value.length !== (t.dataset.input === 'phone' ? 10 : 4);
  }
});
document.addEventListener('focusin', e => { if (e.target.id === 'q' && e.target.value) suggest(e.target.value); });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.change === 'sort') { sessionSort = t.value; route(); }
  if (t.dataset.change === 'pay') state.pay = t.value;
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, kind = f.dataset.form;
  if (kind === 'search') { const q = $('#q').value.trim(); $('#sugg').hidden = true; $('#q').blur(); navigate('#/search?q=' + encodeURIComponent(q)); }
  if (kind === 'phone') { if (/^[6-9]\d{9}$/.test(f.phone.value)) openOtp(f.phone.value); else toast('Enter a valid 10-digit mobile number'); }
  if (kind === 'otp') {
    state.user = { phone: f.dataset.phone }; store.set('user', state.user);
    syncHeader(); toast('You’re logged in');
    const next = afterAuth; afterAuth = null;
    closeOverlay();
    if (next) next(); else route();
  }
  if (kind === 'coupon') {
    const code = f.code.value.trim().toUpperCase(), msg = $('#c-msg');
    if (code !== COUPON.code) { msg.className = 'err'; msg.textContent = code ? 'That code isn’t valid. Check it and try again.' : 'Enter a coupon code.'; return; }
    state.coupon = code; store.set('coupon', code); syncCart();
  }
});
window.addEventListener('hashchange', () => { closeOverlay(); route(); window.scrollTo(0, 0); $('#app').focus({ preventScroll: true }); });

renderShell();
const measure = () => document.documentElement.style.setProperty('--head-h', $('#header').offsetHeight + 'px');
measure(); addEventListener('resize', measure);
route();
syncCart();

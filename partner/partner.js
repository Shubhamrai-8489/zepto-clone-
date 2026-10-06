/* Jhatpat Partner — one app for shop owners and delivery riders. Data comes from ../shared.js. */
seedData();
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rs = n => '₹' + n;
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const LOW_STOCK = 3;

/* ---------- Language: Hindi first, English on a tap ---------- */
let lang = db.get('plang', 'hi');
const T = {
  app: ['Jhatpat पार्टनर', 'Jhatpat Partner'],
  loginTitle: ['अपना मोबाइल नंबर डालिए', 'Enter your mobile number'],
  loginSub: ['दुकानदार और डिलीवरी राइडर, दोनों यहीं से लॉगिन करते हैं।', 'Shop owners and delivery riders both log in here.'],
  phonePh: ['10 अंकों का मोबाइल नंबर', '10-digit mobile number'],
  next: ['आगे बढ़ें', 'Continue'],
  otpTitle: ['कोड डालिए', 'Enter the code'],
  otpSub: ['+91 {p} पर भेजा गया।', 'Sent to +91 {p}.'],
  otpDemo: ['डेमो: कोई SMS नहीं जाता। कोई भी 4 अंक डालिए।', 'Demo: no text is sent. Enter any 4 digits.'],
  verify: ['जाँचें और आगे बढ़ें', 'Verify and continue'],
  changeNo: ['नंबर बदलें', 'Change number'],
  roleTitle: ['आप क्या काम करते हैं?', 'What do you do?'],
  roleShop: ['मैं दुकानदार हूँ', 'I run a shop'],
  roleShopSub: ['अपना सामान, दाम और स्टॉक बताइए; ऑर्डर लीजिए', 'List your items, prices and stock; take orders'],
  roleRider: ['मैं डिलीवरी राइडर हूँ', 'I deliver orders'],
  roleRiderSub: ['दुकान से सामान उठाइए और ग्राहक तक पहुँचाइए', 'Pick up from shops and deliver to customers'],
  demoShops: ['डेमो दुकान से आज़माइए', 'Try with a demo shop'],
  shopFormTitle: ['अपनी दुकान जोड़िए', 'Add your shop'],
  shopName: ['दुकान का नाम', 'Shop name'],
  ownerName: ['आपका नाम', 'Your name'],
  shopAddr: ['दुकान का पूरा पता', 'Full shop address'],
  areasQ: ['आप किन इलाकों में सामान भेजेंगे?', 'Which areas will you deliver to?'],
  fssai: ['FSSAI नंबर (अगर है)', 'FSSAI number (if you have one)'],
  submitReview: ['जाँच के लिए भेजें', 'Send for review'],
  errFill: ['सभी ज़रूरी जानकारी भरिए।', 'Fill in all the required details.'],
  errArea: ['कम से कम एक इलाका चुनिए।', 'Choose at least one area.'],
  riderFormTitle: ['राइडर के रूप में जुड़िए', 'Join as a rider'],
  vehicle: ['आपकी गाड़ी', 'Your vehicle'],
  bike: ['बाइक', 'Bike'], scooter: ['स्कूटर', 'Scooter'], cycle: ['साइकिल', 'Bicycle'], ev: ['इलेक्ट्रिक स्कूटर', 'Electric scooter'],
  pendingTitle: ['आपकी जानकारी की जाँच हो रही है', 'We’re reviewing your details'],
  pendingShop: ['मंज़ूरी मिलते ही आप सामान जोड़ सकेंगे और ऑर्डर ले सकेंगे। इसमें आमतौर पर एक दिन लगता है।', 'Once approved you can add items and take orders. This usually takes a day.'],
  pendingRider: ['मंज़ूरी मिलते ही आपको डिलीवरी मिलने लगेंगी। इसमें आमतौर पर एक दिन लगता है।', 'Once approved you’ll start getting deliveries. This usually takes a day.'],
  demoApprove: ['डेमो: अभी मंज़ूर करें', 'Demo: approve now'],
  logout: ['लॉग आउट', 'Log out'],
  tabOrders: ['ऑर्डर', 'Orders'], tabStock: ['मेरा स्टॉक', 'My stock'], tabAdd: ['सामान जोड़ें', 'Add items'], tabAccount: ['खाता', 'Account'], tabEarn: ['कमाई', 'Earnings'],
  newOrders: ['नए ऑर्डर', 'New orders'], packing: ['पैक करना है', 'To pack'], waitRider: ['राइडर का इंतज़ार', 'Waiting for rider'], onWay: ['रास्ते में', 'Out for delivery'], doneToday: ['आज पूरे हुए', 'Done today'],
  noOrders: ['अभी कोई ऑर्डर नहीं है', 'No orders right now'],
  noOrdersSub: ['नया ऑर्डर आते ही यहाँ दिखेगा और आवाज़ आएगी।', 'New orders show up here with a sound.'],
  keepOpen: ['नए ऑर्डर की आवाज़ सुनने के लिए यह ऐप खुला रखिए।', 'Keep this app open to hear new orders.'],
  items: ['{n} सामान', '{n} items'],
  accept: ['ऑर्डर लें', 'Accept'], reject: ['मना करें', 'Reject'],
  cod: ['कैश ऑन डिलीवरी', 'Cash on delivery'], paid: ['ऑनलाइन भुगतान हो चुका', 'Paid online'],
  tickAll: ['हर सामान रखते जाइए और टिक करते जाइए।', 'Tick each item as you pack it.'],
  markReady: ['सब पैक हो गया', 'All packed, ready'],
  tickFirst: ['पहले सारे सामान टिक कीजिए', 'Tick every item first'],
  riderIs: ['राइडर: {n}', 'Rider: {n}'],
  noRider: ['अभी किसी राइडर ने नहीं लिया', 'No rider has taken this yet'],
  noRiderSlow: ['{m} मिनट से कोई राइडर नहीं मिला। सपोर्ट को बताइए।', 'No rider for {m} min. Tell support.'],
  slowShop: ['{m} मिनट से इंतज़ार कर रहा है', 'Waiting for {m} min'],
  rejectTitle: ['ऑर्डर क्यों नहीं ले सकते?', 'Why can’t you take this order?'],
  r1: ['सामान खत्म हो गया', 'Items are out of stock'], r2: ['दुकान बंद हो रही है', 'The shop is closing'], r3: ['अभी बहुत ज़्यादा ऑर्डर हैं', 'Too many orders right now'],
  rejectNote: ['ग्राहक को बता दिया जाएगा और स्टॉक वापस जुड़ जाएगा।', 'The customer is told and the stock goes back.'],
  rejectDo: ['ऑर्डर मना करें', 'Reject order'],
  cancel: ['रहने दें', 'Cancel'],
  delivered: ['पहुँच गया', 'Delivered'], rejected: ['मना किया', 'Rejected'],
  stockCheck: ['आज का स्टॉक एक बार देख लीजिए', 'Check today’s stock once'],
  stockCheckSub: ['जो सामान दुकान में बिक गया, उसकी गिनती यहाँ ठीक कर दीजिए। गलत स्टॉक से ऑर्डर रद्द होते हैं।', 'Fix the counts for anything sold over the counter. Wrong stock leads to cancelled orders.'],
  stockOk: ['स्टॉक सही है', 'Stock is correct'],
  searchMine: ['अपने सामान में खोजिए', 'Search your items'],
  all: ['सभी', 'All'], low: ['कम बचा', 'Running low'], off: ['बंद', 'Switched off'],
  left: ['{n} बचे', '{n} left'], soldOut: ['खत्म', 'Sold out'],
  edit: ['दाम बदलें', 'Edit price'],
  selling: ['बिक्री चालू', 'Selling'],
  emptyStock: ['अभी आपकी दुकान में कोई सामान नहीं है', 'Your shop has no items yet'],
  emptyStockSub: ['“सामान जोड़ें” से सूची में से चुनिए।', 'Pick from the list under “Add items”.'],
  nothingFound: ['कुछ नहीं मिला', 'Nothing found'],
  searchAll: ['सामान का नाम खोजिए', 'Search for an item'],
  added: ['जुड़ा हुआ', 'Added'], add: ['जोड़ें', 'Add'],
  notInList: ['सामान सूची में नहीं है?', 'Item not in the list?'],
  requestNew: ['नया सामान जोड़ने की माँग भेजें', 'Request a new item'],
  myRequests: ['आपकी माँगें', 'Your requests'], reqPending: ['जाँच बाकी', 'In review'],
  price: ['आपका दाम (₹)', 'Your price (₹)'], qty: ['कितने हैं (गिनती)', 'How many in stock'],
  mrp: ['MRP {m}', 'MRP {m}'],
  save: ['सेव करें', 'Save'], remove: ['दुकान से हटाएँ', 'Remove from my shop'],
  errPrice: ['सही दाम डालिए।', 'Enter a valid price.'],
  errMrp: ['दाम MRP {m} से ज़्यादा नहीं हो सकता।', 'The price can’t be above the MRP of {m}.'],
  errQty: ['गिनती 0 से 999 के बीच डालिए।', 'Enter a count between 0 and 999.'],
  warnLow: ['{p} का दाम MRP {m} के आधे से भी कम है। सही है तो दोबारा “सेव करें” दबाइए।', '{p} is less than half the MRP of {m}. If that’s right, tap Save again.'],
  saved: ['सेव हो गया', 'Saved'], removed: ['हटा दिया', 'Removed'],
  reqTitle: ['नया सामान', 'New item'],
  reqName: ['सामान का नाम', 'Item name'], reqBrand: ['ब्रांड', 'Brand'], reqUnit: ['वज़न या नाप (जैसे 500 g)', 'Weight or size (e.g. 500 g)'], reqMrp: ['MRP (₹)', 'MRP (₹)'],
  reqPhoto: ['सामान की फोटो', 'Photo of the item'],
  reqPhotoHint: ['रोशनी में, सादी जगह पर, पूरा पैकेट दिखे। फोटो अपने आप छोटी और चौकोर हो जाएगी।', 'In good light, on a plain surface, whole pack visible. The photo is resized and squared for you.'],
  reqSend: ['माँग भेजें', 'Send request'],
  reqSent: ['माँग भेज दी। मंज़ूरी के बाद यह सूची में आएगा।', 'Request sent. It joins the list once approved.'],
  errPhoto: ['फोटो नहीं खुल पाई। दूसरी फोटो लीजिए।', 'Couldn’t read that photo. Try another.'],
  errSpace: ['फोन में जगह कम है, सेव नहीं हो पाया।', 'Not enough space on this phone to save.'],
  shopOpen: ['दुकान खुली है', 'Shop is open'], shopClosed: ['दुकान बंद है', 'Shop is closed'],
  shopOpenSub: ['बंद करने पर ग्राहक ऑर्डर नहीं कर पाएँगे।', 'When closed, customers can’t order.'],
  delivering: ['इन इलाकों में डिलीवरी', 'Delivering to'],
  language: ['भाषा', 'Language'],
  resetDemo: ['डेमो डेटा मिटाएँ', 'Reset demo data'],
  resetSub: ['दुकानें, स्टॉक, ऑर्डर और लॉगिन, सब मिट जाएगा। ग्राहक ऐप का कार्ट भी।', 'Shops, stock, orders and logins are all erased, including the customer app’s cart.'],
  resetDo: ['हाँ, सब मिटाएँ', 'Yes, erase everything'],
  online: ['आप ऑनलाइन हैं', 'You’re online'], offline: ['आप ऑफ़लाइन हैं', 'You’re offline'],
  onlineSub: ['ऑफ़लाइन होने पर नए ऑर्डर नहीं दिखेंगे।', 'When offline you won’t see new orders.'],
  goOnline: ['डिलीवरी लेने के लिए ऑनलाइन हो जाइए।', 'Go online to get deliveries.'],
  available: ['उठाने के लिए ऑर्डर', 'Orders to pick up'],
  noAvail: ['अभी कोई ऑर्डर नहीं है', 'No orders right now'],
  noAvailSub: ['जैसे ही कोई दुकान ऑर्डर लेगी, यहाँ दिखेगा।', 'Orders appear here as soon as a shop accepts one.'],
  earn: ['कमाई {a}', 'You earn {a}'],
  take: ['यह डिलीवरी लें', 'Take this delivery'],
  taken: ['यह ऑर्डर किसी और राइडर ने ले लिया।', 'Another rider just took this order.'],
  stPacking: ['दुकान पैक कर रही है', 'Shop is packing'], stReady: ['सामान तैयार है', 'Ready to pick up'],
  step1: ['दुकान से सामान उठाइए', 'Pick up from the shop'], step2: ['ग्राहक को दीजिए', 'Deliver to the customer'],
  maps: ['रास्ता देखें', 'Open in Maps'], call: ['कॉल करें', 'Call'],
  noPhone: ['डेमो दुकान का फ़ोन नंबर नहीं है।', 'Demo shops have no phone number.'],
  tally: ['लिस्ट से मिलाकर गिन लीजिए।', 'Check each item against the list.'],
  pickedUp: ['सामान उठा लिया', 'I’ve picked it up'],
  waitShop: ['दुकान अभी पैक कर रही है', 'The shop is still packing'],
  collect: ['ग्राहक से कैश लेना है', 'Collect cash from the customer'],
  noCollect: ['भुगतान हो चुका है। पैसे नहीं लेने हैं।', 'Already paid. Don’t collect any money.'],
  codeAsk: ['ग्राहक से 4 अंकों का कोड पूछिए', 'Ask the customer for the 4-digit code'],
  codeHint: ['सामान हाथ में देने के बाद ही कोड माँगिए।', 'Ask for it only after handing over the order.'],
  finish: ['डिलीवरी पूरी', 'Complete delivery'],
  errCode: ['कोड गलत है। ग्राहक से दोबारा पूछिए।', 'Wrong code. Ask the customer again.'],
  doneToast: ['डिलीवरी पूरी हुई। शाबाश!', 'Delivery complete. Well done!'],
  todayDel: ['आज की डिलीवरी', 'Deliveries today'], todayEarn: ['आज की कमाई', 'Earned today'],
  cashHand: ['आपके पास जमा कैश', 'Cash you’re holding'],
  cashHandSub: ['यह पैसा दिन के आखिर में जमा करना है।', 'Deposit this at the end of the day.'],
  noDel: ['आज अभी कोई डिलीवरी नहीं हुई', 'No deliveries yet today'],
  newAlert: ['नया ऑर्डर आया है!', 'New order!'],
  from: ['कहाँ से', 'From'], to: ['कहाँ तक', 'To'],
  landmark: ['पहचान: {l}', 'Landmark: {l}'],
  now: ['अभी', 'just now'], minAgo: ['{m} मिनट पहले', '{m} min ago'],
};
const t = (k, v = {}) => (T[k] ? T[k][lang === 'hi' ? 0 : 1] : k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? '');
const ago = ts => { const m = Math.floor((Date.now() - ts) / 60000); return m < 1 ? t('now') : t('minAgo', { m }); };
const mins = ts => Math.floor((Date.now() - ts) / 60000);
const isToday = ts => new Date(ts).toDateString() === new Date().toDateString();

/* ---------- Who is using the app ---------- */
const me = () => db.get('partner', null);
const myShop = () => db.get('shops', []).find(s => s.id === me()?.shopId);
const myRider = () => db.get('riders', []).find(r => r.id === me()?.riderId);
const orders = () => db.get('orders', []);
const view = { tab: 'orders', auth: { step: 'phone', phone: '' }, q: '', filter: 'all', cat: 'all', photo: '' };
const saveList = (key, id, fn) => { const list = db.get(key, []); const row = list.find(x => x.id === id); if (row) fn(row); db.set(key, list); };

/* ---------- Shell ---------- */
function shell(title, sub, tabs) {
  $('#top').innerHTML = `<div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div><button class="lang" data-act="lang" aria-label="${lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}">${lang === 'hi' ? 'English' : 'हिंदी'}</button>`;
  document.body.classList.toggle('bare', !tabs);
  $('#bottomnav').innerHTML = (tabs || []).map(([id, label, n]) => `<button data-act="tab" data-tab="${id}" class="${view.tab === id ? 'on' : ''}" ${view.tab === id ? 'aria-current="page"' : ''}>${n ? `<span class="dot">${n}</span>` : ''}<span aria-hidden="true">${TAB_ICON[id]}</span>${label}</button>`).join('');
}
const TAB_ICON = { orders: '🧾', stock: '📦', add: '➕', account: '👤', earn: '💰' };
const empty = (title, text, extra = '') => `<div class="empty"><h2>${title}</h2><p>${text}</p>${extra}</div>`;
const itemRows = o => o.items.map(x => { const p = byId[x.id]; return p ? `<div class="it plain"><img src="../${p.img}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.unit)}</small></div><span class="q">× ${x.q}</span></div>` : ''; }).join('');
const checkRows = (o, who) => { const done = db.get('ticks', {})[who + o.id] || []; return o.items.map(x => { const p = byId[x.id]; return p ? `<label class="it"><input type="checkbox" data-tick="${who}${o.id}" value="${x.id}" ${done.includes(x.id) ? 'checked' : ''}><img src="../${p.img}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.unit)}</small></div><span class="q">× ${x.q}</span></label>` : ''; }).join(''); };
const allTicked = (o, who) => { const done = db.get('ticks', {})[who + o.id] || []; return o.items.every(x => done.includes(x.id)); };
const count = o => o.items.reduce((n, x) => n + x.q, 0);
const payPill = o => `<span class="pill ${o.pay === 'cod' ? 'amber' : 'green'}">${o.pay === 'cod' ? `${t('cod')} ${rs(o.total)}` : t('paid')}</span>`;
const fullAddr = o => [o.addr?.house, o.addr?.street, o.loc].filter(Boolean).join(', ');
const mapsUrl = a => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(a);

function render() {
  document.documentElement.lang = lang;
  const p = me();
  if (!p) return renderAuth();
  const who = p.role === 'shop' ? myShop() : myRider();
  if (!who) { db.set('partner', null); return renderAuth(); }
  if (!who.approved) return renderPending(p.role);
  (p.role === 'shop' ? renderShop : renderRider)(who);
}

/* ---------- Login and sign-up ---------- */
function renderAuth() {
  const a = view.auth;
  shell(t('app'), '', null);
  const screens = {
    phone: () => `<h2 class="lead">${t('loginTitle')}</h2><p class="hint">${t('loginSub')}</p>
      <form class="stack" data-form="phone" style="margin-top:16px"><div class="phone"><span>+91</span><input class="field" name="phone" inputmode="numeric" autocomplete="tel-national" maxlength="10" placeholder="${t('phonePh')}" aria-label="${t('phonePh')}" data-digits="10" autofocus></div>
      <button class="btn big block" disabled>${t('next')}</button></form>`,
    otp: () => `<h2 class="lead">${t('otpTitle')}</h2><p class="hint">${t('otpSub', { p: esc(a.phone) })} <button class="link" data-act="auth" data-step="phone">${t('changeNo')}</button></p>
      <form class="stack" data-form="otp" style="margin-top:16px"><input class="field otp" name="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="4" placeholder="••••" aria-label="${t('otpTitle')}" data-digits="4" autofocus>
      <p class="note">${t('otpDemo')}</p><button class="btn big block" disabled>${t('verify')}</button></form>`,
    role: () => `<h2 class="lead">${t('roleTitle')}</h2><div class="stack" style="margin-top:14px">
      <button class="role" data-act="auth" data-step="shopform"><span class="emoji" aria-hidden="true">🏪</span><span><b>${t('roleShop')}</b><small>${t('roleShopSub')}</small></span></button>
      <button class="role" data-act="auth" data-step="riderform"><span class="emoji" aria-hidden="true">🛵</span><span><b>${t('roleRider')}</b><small>${t('roleRiderSub')}</small></span></button></div>
      <h2 class="sec-t">${t('demoShops')}</h2><div class="stack">${db.get('shops', []).filter(s => s.approved).map(s => `<button class="role" data-act="demo-shop" data-id="${s.id}"><span><b style="font-size:16px">${esc(s.name)}</b><small>${esc(s.areas.join(' · '))}</small></span></button>`).join('')}</div>`,
    shopform: () => `<h2 class="lead">${t('shopFormTitle')}</h2>
      <form class="stack" data-form="shop" style="margin-top:12px">
        <label><span>${t('shopName')}</span><input class="field" name="name" maxlength="60" required autofocus></label>
        <label><span>${t('ownerName')}</span><input class="field" name="owner" maxlength="60" required autocomplete="name"></label>
        <label><span>${t('shopAddr')}</span><input class="field" name="address" maxlength="140" required autocomplete="street-address"></label>
        <fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:14px;margin-bottom:6px">${t('areasQ')}</legend><div class="chipwrap">${AREAS.map(x => `<label class="chk"><input type="checkbox" name="areas" value="${esc(x)}">${esc(x.split(',')[0])}</label>`).join('')}</div></fieldset>
        <label><span>${t('fssai')}</span><input class="field" name="fssai" inputmode="numeric" maxlength="14"></label>
        <p class="err" id="f-err" hidden></p><button class="btn big block">${t('submitReview')}</button>
        <button type="button" class="link" data-act="auth" data-step="role">${t('cancel')}</button></form>`,
    riderform: () => `<h2 class="lead">${t('riderFormTitle')}</h2>
      <form class="stack" data-form="rider" style="margin-top:12px">
        <label><span>${t('ownerName')}</span><input class="field" name="name" maxlength="60" required autocomplete="name" autofocus></label>
        <fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:14px;margin-bottom:6px">${t('vehicle')}</legend><div class="chipwrap">${['bike', 'scooter', 'ev', 'cycle'].map((v, i) => `<label class="chk"><input type="radio" name="vehicle" value="${v}" ${i ? '' : 'checked'}>${t(v)}</label>`).join('')}</div></fieldset>
        <p class="err" id="f-err" hidden></p><button class="btn big block">${t('submitReview')}</button>
        <button type="button" class="link" data-act="auth" data-step="role">${t('cancel')}</button></form>`,
  };
  $('#app').innerHTML = screens[a.step]();
  $('#app [autofocus]')?.focus();
}
function renderPending(role) {
  shell(t('app'), '', null);
  $('#app').innerHTML = empty(t('pendingTitle'), t(role === 'shop' ? 'pendingShop' : 'pendingRider'),
    `<div class="stack"><button class="btn" data-act="demo-approve">${t('demoApprove')}</button><button class="link" data-act="logout">${t('logout')}</button></div>`);
}
function afterOtp() {
  const phone = view.auth.phone;
  const s = db.get('shops', []).find(x => x.phone === phone), r = db.get('riders', []).find(x => x.phone === phone);
  if (s) db.set('partner', { phone, role: 'shop', shopId: s.id });
  else if (r) db.set('partner', { phone, role: 'rider', riderId: r.id });
  else view.auth.step = 'role';
  view.tab = 'orders';
  render();
}

/* ---------- Shop ---------- */
function renderShop(s) {
  const mine = orders().filter(o => o.shopId === s.id);
  const fresh = mine.filter(o => o.status === 'placed');
  shell(s.name, s.open ? t('shopOpen') : t('shopClosed'), [['orders', t('tabOrders'), fresh.length], ['stock', t('tabStock')], ['add', t('tabAdd')], ['account', t('tabAccount')]]);
  $('#app').innerHTML = { orders: shopOrders, stock: shopStock, add: shopAdd, account: shopAccount }[view.tab](s, mine);
  if (view.tab === 'stock' || view.tab === 'add') drawList(s);
}
function shopOrders(s, mine) {
  const by = st => mine.filter(o => o.status === st);
  const done = mine.filter(o => ['delivered', 'rejected'].includes(o.status) && isToday(o.at));
  const riderLine = o => o.riderName ? `<p class="o-meta">${t('riderIs', { n: esc(o.riderName) })}</p>`
    : `<p class="warnline">${mins(o.hist?.[o.status] || o.at) >= SLOW_SECONDS / 60 ? t('noRiderSlow', { m: mins(o.hist?.[o.status] || o.at) }) : t('noRider')}</p>`;
  const head = o => `<div class="o-head"><b>#${o.id}</b>${payPill(o)}</div><p class="o-meta">${t('items', { n: count(o) })} · ${rs(o.total)} · ${ago(o.at)}</p>`;
  const sections = [
    [t('newOrders'), by('placed'), o => `<div class="panel new">${head(o)}${mins(o.at) >= SLOW_SECONDS / 60 ? `<p class="warnline">${t('slowShop', { m: mins(o.at) })}</p>` : ''}${itemRows(o)}
      <div class="btns"><button class="btn red" data-act="reject" data-id="${o.id}">${t('reject')}</button><button class="btn green" data-act="accept" data-id="${o.id}">${t('accept')}</button></div></div>`],
    [t('packing'), by('accepted'), o => `<div class="panel">${head(o)}<p class="hint">${t('tickAll')}</p>${checkRows(o, 's')}${riderLine(o)}
      <div class="btns one"><button class="btn green big" data-act="ready" data-id="${o.id}" ${allTicked(o, 's') ? '' : 'disabled'}>${allTicked(o, 's') ? t('markReady') : t('tickFirst')}</button></div></div>`],
    [t('waitRider'), by('ready'), o => `<div class="panel">${head(o)}${riderLine(o)}</div>`],
    [t('onWay'), by('picked'), o => `<div class="panel">${head(o)}${riderLine(o)}</div>`],
    [t('doneToday'), done, o => `<div class="panel"><div class="o-head"><b>#${o.id}</b><span class="pill ${o.status === 'delivered' ? 'green' : 'red'}">${t(o.status)}</span></div><p class="o-meta" style="margin-bottom:0">${t('items', { n: count(o) })} · ${rs(o.total)}</p></div>`],
  ].filter(x => x[1].length);
  if (!sections.length) return empty(t('noOrders'), t('noOrdersSub')) + `<p class="keep">${t('keepOpen')}</p>`;
  return sections.map(([title, list, card]) => `<h2 class="sec-t">${title}<span class="count">${list.length}</span></h2><div class="stack">${list.map(card).join('')}</div>`).join('') + `<p class="keep">${t('keepOpen')}</p>`;
}
function shopStock(s) {
  const today = new Date().toDateString(), checked = db.get('stockcheck', {})[s.id] === today;
  return `${checked ? '' : `<div class="panel warn" style="margin-bottom:12px"><b>${t('stockCheck')}</b><p class="hint" style="margin:4px 0 10px">${t('stockCheckSub')}</p><button class="btn sm" data-act="stock-ok">${t('stockOk')}</button></div>`}
    <input class="field" id="q" type="search" placeholder="${t('searchMine')}" aria-label="${t('searchMine')}" value="${esc(view.q)}">
    <div class="chips">${[['all', 'all'], ['low', 'low'], ['off', 'off']].map(([f, k]) => `<button class="chip ${view.filter === f ? 'on' : ''}" data-act="filter" data-f="${f}">${t(k)}</button>`).join('')}</div>
    <div class="panel" id="list"></div>`;
}
function shopAdd() {
  const reqs = db.get('requests', []).filter(r => r.shopId === me().shopId);
  return `<input class="field" id="q" type="search" placeholder="${t('searchAll')}" aria-label="${t('searchAll')}" value="${esc(view.q)}">
    <div class="chips"><button class="chip ${view.cat === 'all' ? 'on' : ''}" data-act="cat" data-c="all">${t('all')}</button>${CATS.map(c => `<button class="chip ${view.cat === c.id ? 'on' : ''}" data-act="cat" data-c="${c.id}">${esc(c.name)}</button>`).join('')}</div>
    <div class="panel" id="list"></div>
    <div class="panel" style="margin-top:12px"><b>${t('notInList')}</b><div class="btns one"><button class="btn ghost" data-act="request">${t('requestNew')}</button></div>
      ${reqs.length ? `<h2 class="sec-t">${t('myRequests')}</h2>${reqs.map(r => `<div class="srow"><img src="${r.photo}" alt=""><div><b>${esc(r.name)}</b><small>${esc(r.brand)} · ${esc(r.unit)} · MRP ${rs(r.mrp)}</small></div><span class="pill amber">${t('reqPending')}</span></div>`).join('')}` : ''}</div>`;
}
// The list under the search box, redrawn on every keystroke without touching the input.
function drawList(s) {
  const inv = db.get('inv', {})[s.id] || {}, q = view.q.trim().toLowerCase();
  const hit = p => !q || `${p.name} ${p.brand} ${p.tags || ''}`.toLowerCase().includes(q);
  let html;
  if (view.tab === 'stock') {
    const list = PRODUCTS.filter(p => inv[p.id] && hit(p) && (view.filter === 'all' || (view.filter === 'low' ? inv[p.id].on && inv[p.id].qty <= LOW_STOCK : !inv[p.id].on)));
    html = list.map(p => { const r = inv[p.id]; return `<div class="srow ${r.on ? '' : 'off'}"><img src="../${p.img}" alt="">
      <div class="s-info"><b>${esc(p.name)}</b><small>${esc(p.unit)} · ${rs(r.price)} <s>${p.mrp > r.price ? rs(p.mrp) : ''}</s></small>
        <small class="${r.qty <= LOW_STOCK ? 'low' : ''}">${r.qty ? t('left', { n: r.qty }) : t('soldOut')}</small><button class="edit" data-act="item" data-id="${p.id}">${t('edit')}</button></div>
      <div class="s-ctl"><button class="switch" role="switch" aria-checked="${r.on}" aria-label="${t('selling')}: ${esc(p.name)}" data-act="toggle" data-id="${p.id}"></button>
        <div class="step"><button data-act="qty" data-d="-1" data-id="${p.id}" aria-label="−1 ${esc(p.name)}">−</button><span>${r.qty}</span><button data-act="qty" data-d="1" data-id="${p.id}" aria-label="+1 ${esc(p.name)}">+</button></div></div></div>`; }).join('')
      || (Object.keys(inv).length ? empty(t('nothingFound'), '') : empty(t('emptyStock'), t('emptyStockSub')));
  } else {
    const list = PRODUCTS.filter(p => hit(p) && (view.cat === 'all' || p.cat === view.cat));
    html = list.map(p => `<div class="srow"><img src="../${p.img}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.unit)} · ${t('mrp', { m: rs(p.mrp) })}</small></div>
      ${inv[p.id] ? `<span class="pill green">${t('added')}</span>` : `<button class="btn sm" data-act="item" data-id="${p.id}">${t('add')}</button>`}</div>`).join('') || empty(t('nothingFound'), t('notInList'));
  }
  $('#list').innerHTML = html;
}
function shopAccount(s) {
  return `<div class="panel"><div class="toggle-row"><div><b>${s.open ? t('shopOpen') : t('shopClosed')}</b><small>${t('shopOpenSub')}</small></div><button class="switch" role="switch" aria-checked="${s.open}" aria-label="${t('shopOpen')}" data-act="open"></button></div></div>
    <div class="panel"><b>${esc(s.name)}</b><p class="hint">${esc(s.owner)}${s.phone ? ` · +91 ${esc(s.phone)}` : ''}</p><p class="hint">${esc(s.address)}</p>
      <h2 class="sec-t">${t('delivering')}</h2><div class="chipwrap">${s.areas.map(a => `<span class="pill">${esc(a)}</span>`).join('')}</div></div>
    ${commonAccount()}`;
}
const commonAccount = () => `<div class="panel menu"><button data-act="lang"><span>${t('language')}</span><span>${lang === 'hi' ? 'हिंदी' : 'English'} ›</span></button>
    <button data-act="reset"><span>${t('resetDemo')}</span><span>›</span></button>
    <button data-act="logout"><span style="color:var(--red)">${t('logout')}</span></button></div>`;

function itemSheet(id) {
  const p = byId[id], row = (db.get('inv', {})[me().shopId] || {})[id];
  sheet(`<div class="srow" style="margin-bottom:8px"><img src="../${p.img}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.unit)} · ${t('mrp', { m: rs(p.mrp) })}</small></div></div>
    <form class="stack" data-form="item" data-id="${id}">
      <label><span>${t('price')}</span><input class="field" name="price" inputmode="numeric" maxlength="5" value="${row ? row.price : p.price}" data-digits autofocus></label>
      <label><span>${t('qty')}</span><input class="field" name="qty" inputmode="numeric" maxlength="3" value="${row ? row.qty : ''}" data-digits></label>
      <p class="err" id="i-err" hidden></p>
      <button class="btn big block">${t('save')}</button>
      ${row ? `<button type="button" class="btn red block" data-act="remove" data-id="${id}">${t('remove')}</button>` : ''}
    </form>`, p.name);
}
function requestSheet() {
  view.photo = '';
  sheet(`<form class="stack" data-form="request">
      <label><span>${t('reqName')}</span><input class="field" name="name" maxlength="80" required autofocus></label>
      <label><span>${t('reqBrand')}</span><input class="field" name="brand" maxlength="40" required></label>
      <label><span>${t('reqUnit')}</span><input class="field" name="unit" maxlength="20" required></label>
      <label><span>${t('reqMrp')}</span><input class="field" name="mrp" inputmode="numeric" maxlength="5" data-digits required></label>
      <label><span>${t('reqPhoto')}</span><input type="file" name="photo" accept="image/*" capture="environment" id="photo-in"></label>
      <p class="hint">${t('reqPhotoHint')}</p><img class="photo" id="photo-prev" alt="" hidden>
      <p class="err" id="i-err" hidden></p><button class="btn big block">${t('reqSend')}</button></form>`, t('reqTitle'));
}
// Shrink and square the photo on the phone, so a 5 MB camera shot becomes a ~30 KB upload.
function readPhoto(file) {
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    const side = Math.min(img.width, img.height), c = document.createElement('canvas');
    c.width = c.height = 400;
    c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 400, 400);
    view.photo = c.toDataURL('image/jpeg', 0.8);
    URL.revokeObjectURL(url);
    const prev = $('#photo-prev'); if (prev) { prev.src = view.photo; prev.hidden = false; }
  };
  img.onerror = () => { URL.revokeObjectURL(url); view.photo = ''; fail('i-err', t('errPhoto')); };
  img.src = url;
}

/* ---------- Rider ---------- */
const LIVE = ['accepted', 'ready', 'picked'];
// ponytail: riders see every shop's orders. With a backend, show only shops within a few km of the rider.
const openJobs = () => orders().filter(o => !o.riderId && ['accepted', 'ready'].includes(o.status));
function renderRider(r) {
  const job = orders().find(o => o.riderId === r.id && LIVE.includes(o.status));
  const jobs = r.online && !job ? openJobs() : [];
  shell(r.name, r.online ? t('online') : t('offline'), [['orders', t('tabOrders'), jobs.length], ['earn', t('tabEarn')], ['account', t('tabAccount')]]);
  $('#app').innerHTML = { orders: () => (job ? riderJob(job) : riderJobs(r, jobs)), earn: () => riderEarn(r), account: () => riderAccount(r) }[view.tab]();
}
const onlineRow = r => `<div class="panel"><div class="toggle-row"><div><b>${r.online ? t('online') : t('offline')}</b><small>${t('onlineSub')}</small></div><button class="switch" role="switch" aria-checked="${!!r.online}" aria-label="${t('online')}" data-act="online"></button></div></div>`;
function riderJobs(r, jobs) {
  if (!r.online) return onlineRow(r) + empty(t('offline'), t('goOnline'));
  return onlineRow(r) + (jobs.length ? `<h2 class="sec-t">${t('available')}<span class="count">${jobs.length}</span></h2><div class="stack">${jobs.map(o => `<div class="panel new">
      <div class="o-head"><b>${t('earn', { a: rs(o.fee || RIDER_FEE) })}</b><span class="pill ${o.status === 'ready' ? 'green' : 'amber'}">${t(o.status === 'ready' ? 'stReady' : 'stPacking')}</span></div>
      <div class="dest"><small class="hint">${t('from')}</small><b>${esc(o.shopName)}</b><span class="hint">${esc(o.shopAddress)}</span></div>
      <div class="dest"><small class="hint">${t('to')}</small><b>${esc(o.loc)}</b><span class="hint">${t('items', { n: count(o) })} · ${o.pay === 'cod' ? `${t('cod')} ${rs(o.total)}` : t('paid')}</span></div>
      <div class="btns one"><button class="btn green big" data-act="take" data-id="${o.id}">${t('take')}</button></div></div>`).join('')}</div>`
    : empty(t('noAvail'), t('noAvailSub'))) + `<p class="keep">${t('keepOpen')}</p>`;
}
function riderJob(o) {
  const callBtn = (phone) => phone ? `<a class="btn ghost" href="tel:+91${esc(phone)}">${t('call')}</a>` : `<button class="btn ghost" data-act="no-phone">${t('call')}</button>`;
  if (o.status !== 'picked') {
    const ready = o.status === 'ready', ok = ready && allTicked(o, 'r');
    return `<div class="panel"><div class="o-head"><b><span class="stepno">1</span> ${t('step1')}</b><span class="pill ${ready ? 'green' : 'amber'}">${t(ready ? 'stReady' : 'stPacking')}</span></div>
      <div class="dest"><b>${esc(o.shopName)}</b><span class="hint">${esc(o.shopAddress)}</span></div>
      <div class="btns"><a class="btn" target="_blank" rel="noopener" href="${mapsUrl(o.shopAddress)}">${t('maps')}</a>${callBtn(o.shopPhone)}</div></div>
      <div class="panel"><div class="o-head"><b>#${o.id}</b><span class="hint">${t('items', { n: count(o) })}</span></div><p class="hint">${t('tally')}</p>${checkRows(o, 'r')}
      <div class="btns one"><button class="btn green big" data-act="picked" data-id="${o.id}" ${ok ? '' : 'disabled'}>${ready ? (ok ? t('pickedUp') : t('tickFirst')) : t('waitShop')}</button></div></div>`;
  }
  return `<div class="panel"><div class="o-head"><b><span class="stepno">2</span> ${t('step2')}</b><span class="hint">#${o.id}</span></div>
      <div class="dest"><b>${esc([o.addr?.house, o.addr?.street].filter(Boolean).join(', '))}</b><span class="hint">${esc(o.loc)}</span>${o.addr?.landmark ? `<span class="hint" style="display:block">${t('landmark', { l: esc(o.addr.landmark) })}</span>` : ''}</div>
      <div class="btns"><a class="btn" target="_blank" rel="noopener" href="${mapsUrl(fullAddr(o))}">${t('maps')}</a>${callBtn(o.phone)}</div>
      ${o.pay === 'cod' ? `<div class="cash">${t('collect')}<strong>${rs(o.total)}</strong></div>` : `<div class="cash paid">${t('noCollect')}</div>`}</div>
    <div class="panel"><form class="stack" data-form="code" data-id="${o.id}"><label><span>${t('codeAsk')}</span><input class="field otp" name="code" inputmode="numeric" maxlength="4" placeholder="••••" data-digits="4" autocomplete="off"></label>
      <p class="hint">${t('codeHint')}</p><p class="err" id="c-err" hidden></p><button class="btn green big block" disabled>${t('finish')}</button></form></div>
    <div class="panel"><p class="hint">${t('items', { n: count(o) })}</p>${itemRows(o)}</div>`;
}
function riderEarn(r) {
  const done = orders().filter(o => o.riderId === r.id && o.status === 'delivered' && isToday(o.hist?.delivered || o.at));
  const cash = done.filter(o => o.pay === 'cod').reduce((n, o) => n + o.total, 0);
  return `<div class="stat"><div><strong>${done.length}</strong><span>${t('todayDel')}</span></div><div><strong>${rs(done.reduce((n, o) => n + (o.fee || RIDER_FEE), 0))}</strong><span>${t('todayEarn')}</span></div></div>
    <div class="cash" style="text-align:left">${t('cashHand')}<strong>${rs(cash)}</strong><span style="font-weight:400">${t('cashHandSub')}</span></div>
    ${done.length ? `<div class="panel" style="margin-top:12px">${done.map(o => `<div class="row"><span>#${o.id} · ${esc(o.loc.split(',')[0])}</span><span>${o.pay === 'cod' ? `${t('cod')} ${rs(o.total)} · ` : ''}+${rs(o.fee || RIDER_FEE)}</span></div>`).join('')}</div>` : empty(t('noDel'), '')}`;
}
const riderAccount = r => `${onlineRow(r)}<div class="panel"><b>${esc(r.name)}</b><p class="hint">+91 ${esc(r.phone)} · ${t(r.vehicle)}</p></div>${commonAccount()}`;

/* ---------- Sheet, toast, alerts ---------- */
function sheet(html, title = '') {
  $('#overlay').innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="m-head"><h2>${esc(title)}</h2><button class="x" data-act="close" aria-label="Close">×</button></div>${html}</div>`;
  $('#overlay').hidden = false;
  document.body.classList.add('locked');
  ($('#overlay [autofocus]') || $('#overlay .x')).focus();
}
function closeSheet() { $('#overlay').hidden = true; $('#overlay').innerHTML = ''; document.body.classList.remove('locked'); }
let toastT;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }
function fail(id, msg) { const el = $('#' + id); if (el) { el.textContent = msg; el.hidden = false; } }
function beep() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)(), g = a.createGain();
    g.connect(a.destination); g.gain.value = 0.25;
    [0, 0.25].forEach(at => { const o = a.createOscillator(); o.frequency.value = 880; o.connect(g); o.start(a.currentTime + at); o.stop(a.currentTime + at + 0.18); });
  } catch { /* no audio on this device */ }
  navigator.vibrate?.([200, 100, 200]);
}
// Ring once for each order this partner hasn't seen yet.
function checkNew() {
  const p = me(); if (!p) return;
  const r = p.role === 'rider' ? myRider() : null;
  const ids = p.role === 'shop' ? orders().filter(o => o.shopId === p.shopId && o.status === 'placed').map(o => o.id)
    : r?.online && r.approved && !orders().some(o => o.riderId === r.id && LIVE.includes(o.status)) ? openJobs().map(o => o.id) : [];
  const seen = db.get('seen', []), fresh = ids.filter(id => !seen.includes(id));
  if (!fresh.length) return;
  db.set('seen', [...seen, ...fresh].slice(-200));
  beep(); toast(t('newAlert'));
}
const busy = () => !$('#overlay').hidden || document.activeElement?.matches('input, textarea, select');
const refresh = () => { checkNew(); if (!busy()) render(); };

/* ---------- Actions ---------- */
const actions = {
  lang: () => { lang = lang === 'hi' ? 'en' : 'hi'; db.set('plang', lang); render(); },
  tab: el => { view.tab = el.dataset.tab; view.q = ''; render(); scrollTo(0, 0); },
  auth: el => { view.auth.step = el.dataset.step; render(); },
  close: closeSheet,
  logout: () => { db.set('partner', null); view.auth = { step: 'phone', phone: '' }; view.tab = 'orders'; closeSheet(); render(); },
  'demo-shop': el => { db.set('partner', { phone: view.auth.phone, role: 'shop', shopId: el.dataset.id }); view.tab = 'orders'; render(); },
  'demo-approve': () => { const p = me(); saveList(p.role === 'shop' ? 'shops' : 'riders', p.shopId || p.riderId, x => { x.approved = true; }); view.tab = p.role === 'shop' ? 'add' : 'orders'; render(); },
  // shop
  accept: el => { setStatus(el.dataset.id, 'accepted'); render(); },
  reject: el => sheet(`<form class="stack" data-form="reject" data-id="${el.dataset.id}">${['r1', 'r2', 'r3'].map((k, i) => `<label class="opt"><input type="radio" name="reason" value="${k}" ${i ? '' : 'checked'}><span>${t(k)}</span></label>`).join('')}
      <p class="hint">${t('rejectNote')}</p><button class="btn red big block">${t('rejectDo')}</button><button type="button" class="link" data-act="close">${t('cancel')}</button></form>`, t('rejectTitle')),
  ready: el => { setStatus(el.dataset.id, 'ready'); render(); },
  'stock-ok': () => { const c = db.get('stockcheck', {}); c[me().shopId] = new Date().toDateString(); db.set('stockcheck', c); render(); },
  filter: el => { view.filter = el.dataset.f; render(); },
  cat: el => { view.cat = el.dataset.c; render(); },
  item: el => itemSheet(el.dataset.id),
  request: requestSheet,
  toggle: el => editInv(el.dataset.id, r => { r.on = !r.on; }),
  qty: el => editInv(el.dataset.id, r => { r.qty = Math.max(0, Math.min(999, r.qty + +el.dataset.d)); }),
  remove: el => { const inv = db.get('inv', {}); delete inv[me().shopId][el.dataset.id]; db.set('inv', inv); closeSheet(); toast(t('removed')); render(); },
  open: () => { saveList('shops', me().shopId, s => { s.open = !s.open; }); render(); },
  reset: () => sheet(`<p>${t('resetSub')}</p><div class="btns"><button class="btn ghost" data-act="close">${t('cancel')}</button><button class="btn red" data-act="reset-do">${t('resetDo')}</button></div>`, t('resetDemo')),
  'reset-do': () => { Object.keys(localStorage).filter(k => k.startsWith('jp_') && k !== 'jp_plang').forEach(k => localStorage.removeItem(k)); location.reload(); },
  // rider
  online: () => { saveList('riders', me().riderId, r => { r.online = !r.online; }); render(); },
  take: el => {
    const r = myRider(); let won = false;
    updateOrder(el.dataset.id, o => { if (o.riderId || !['accepted', 'ready'].includes(o.status)) return; Object.assign(o, { riderId: r.id, riderName: r.name, riderPhone: r.phone }); won = true; });
    if (!won) toast(t('taken'));
    render(); scrollTo(0, 0);
  },
  picked: el => { setStatus(el.dataset.id, 'picked'); render(); scrollTo(0, 0); },
  'no-phone': () => toast(t('noPhone')),
};
function editInv(id, fn) {
  const inv = db.get('inv', {}), row = inv[me().shopId]?.[id];
  if (!row) return;
  fn(row); db.set('inv', inv); drawList(myShop());
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el) { e.preventDefault(); actions[el.dataset.act]?.(el); return; }
  if (e.target.id === 'overlay') closeSheet();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'q') { view.q = el.value; drawList(myShop()); }
  if ('digits' in el.dataset) {
    el.value = el.value.replace(/\D/g, '');
    if (el.dataset.digits) el.form.querySelector('button:not([type=button])').disabled = el.value.length !== +el.dataset.digits;
  }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.tick) {
    const ticks = db.get('ticks', {}), key = el.dataset.tick;
    ticks[key] = [...el.closest('.panel').querySelectorAll(`[data-tick="${key}"]:checked`)].map(x => x.value);
    db.set('ticks', ticks); render();
  }
  if (el.id === 'photo-in' && el.files[0]) readPhoto(el.files[0]);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, kind = f.dataset.form, val = n => f.elements[n].value.trim();
  if (kind === 'phone') { if (!/^[6-9]\d{9}$/.test(val('phone'))) return toast(t('phonePh')); view.auth = { step: 'otp', phone: val('phone') }; render(); }
  if (kind === 'otp') afterOtp();
  if (kind === 'shop') {
    const areas = [...f.querySelectorAll('[name=areas]:checked')].map(x => x.value);
    if (!val('name') || !val('owner') || val('address').length < 8) return fail('f-err', t('errFill'));
    if (!areas.length) return fail('f-err', t('errArea'));
    const id = 's' + Date.now();
    db.set('shops', [...db.get('shops', []), { id, name: val('name'), owner: val('owner'), phone: view.auth.phone, address: val('address'), areas, fssai: val('fssai'), open: true, approved: false }]);
    const inv = db.get('inv', {}); inv[id] = {}; db.set('inv', inv);
    db.set('partner', { phone: view.auth.phone, role: 'shop', shopId: id }); render();
  }
  if (kind === 'rider') {
    if (!val('name')) return fail('f-err', t('errFill'));
    const id = 'r' + Date.now();
    db.set('riders', [...db.get('riders', []), { id, name: val('name'), phone: view.auth.phone, vehicle: f.elements.vehicle.value, online: true, approved: false }]);
    db.set('partner', { phone: view.auth.phone, role: 'rider', riderId: id }); render();
  }
  if (kind === 'reject') {
    const o = setStatus(f.dataset.id, 'rejected', { reason: T[f.elements.reason.value][1] });
    if (o) changeStock(o.shopId, o.items, 1);
    closeSheet(); render();
  }
  if (kind === 'item') {
    const p = byId[f.dataset.id], price = +val('price'), qty = val('qty') === '' ? NaN : +val('qty');
    if (!Number.isInteger(price) || price <= 0) return fail('i-err', t('errPrice'));
    if (price > p.mrp) return fail('i-err', t('errMrp', { m: rs(p.mrp) }));
    if (!Number.isInteger(qty) || qty < 0 || qty > 999) return fail('i-err', t('errQty'));
    if (price < p.mrp / 2 && f.dataset.sure !== String(price)) { f.dataset.sure = price; return fail('i-err', t('warnLow', { p: rs(price), m: rs(p.mrp) })); }
    const inv = db.get('inv', {}), sid = me().shopId;
    (inv[sid] ||= {})[p.id] = { price, qty, on: inv[sid][p.id]?.on ?? true };
    db.set('inv', inv); closeSheet(); toast(t('saved')); render();
  }
  if (kind === 'request') {
    const mrp = +val('mrp');
    if (!val('name') || !val('brand') || !val('unit') || !(mrp > 0) || !view.photo) return fail('i-err', t('errFill'));
    const ok = db.set('requests', [...db.get('requests', []), { id: 'q' + Date.now(), shopId: me().shopId, name: val('name'), brand: val('brand'), unit: val('unit'), mrp, photo: view.photo, status: 'pending' }]);
    if (!ok) return fail('i-err', t('errSpace'));
    closeSheet(); toast(t('reqSent')); render();
  }
  if (kind === 'code') {
    const o = orders().find(x => x.id === f.dataset.id);
    if (!o || val('code') !== o.code) { f.elements.code.value = ''; f.querySelector('button').disabled = true; return fail('c-err', t('errCode')); }
    setStatus(o.id, 'delivered'); document.activeElement?.blur(); toast(t('doneToast')); render(); scrollTo(0, 0);
  }
});
window.addEventListener('storage', refresh);
setInterval(refresh, 3000); // also keeps "x min ago" and the slow-order warnings current
db.set('seen', [...new Set([...db.get('seen', []), ...orders().map(o => o.id)])].slice(-200)); // don't ring for old orders on open
render();

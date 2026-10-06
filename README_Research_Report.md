# Blinkit & Zepto — UI Research (5 Oct 2026)
Ek gig-partner onboarding app ke in-app help-video project ke liye reference research.

## Is folder me kya hai
- `01_Rider_Onboarding/` — rider (delivery partner) app ki onboarding research
- `02_Customer_UI/Blinkit_PlayStore`, `Zepto_PlayStore` — customer app ke Play Store screenshots (7-7)
- `02_Customer_UI/Blinkit_Web`, `Zepto_Web` — blinkit.com / zepto.com ke live screens (home, category, search, product, login)

## Research ki limit (pehle padho)
- Customer UI website (desktop) aur Play Store ke marketing screenshots se dekha hai. Mobile app ke andar login karke nahi dekha.
- Checkout, payment aur live order tracking live nahi dekhe — unki jaankari sirf Play Store screenshots se hai.
- Blinkit ka cart panel is network pe "Oops! something went wrong" de raha tha, to cart ka UI nahi mila.
- Rider onboarding YouTube walkthrough ke low-res preview frames se dekha tha; fee amounts approx hain.

---

# PART 1 — Customer side UI

## Ek nazar me
| | Blinkit | Zepto |
|---|---|---|
| Brand rang | Peela + hara, safed background | Purple + gulabi (pink) CTA, safed background |
| Tagline | "India's last minute app" | "Everything delivered in minutes" |
| Sabse upar | "Delivery in 8 minutes" + address | "Delivery in minutes" + Select Location |
| Search placeholder | Badalta rehta hai: "rice", "chips", "curd" | Badalta rehta hai: "kurkure", "apple juice" |
| Top tabs | Nahi | All, Cafe, Home, Toys, Fresh, Electronics, Mobiles, Beauty, Fashion, Pharmacy |
| Home ka pehla block | Bada banner + 4 chhote offer cards | 2 banner: "₹0 Fees / Everyday low prices" + offer |
| Categories | 20 tiles, 10 ki 2 line | 20 tiles, 10 ki 2 line ("Shop by Category") |
| Home pe products | Nahi (sirf categories) | Haan — "Laundry Care", "Rice" jaisi rails, har ek pe "See All" |
| Product card | Photo → "8 MINS" → naam → weight → daam + ADD | Photo pe ADD → hara daam pill + kata hua MRP → naam → weight |
| ADD button | Hara outline; dabane pe hara "− 1 +" | Gulabi outline, photo ke kone pe |
| Variants | "2 options" ADD ke neeche, ya weight dropdown | Alag card |
| Cart button | Hara, "1 item ₹31" turant dikhta hai | Icon + "Cart" |
| Login | Chhota popup: sirf +91 number + Continue | Bada popup: illustration + number + app download badges |
| Loading | Grey skeleton boxes | Halke purple skeleton boxes |

## Blinkit — screen by screen
1. **Home** — logo, "Delivery in 8 minutes" + address, search, Login, hara cart. Neeche ek bada banner ("Stock up on daily essentials" + Shop Now), 4 rangeen offer cards (printout, pharmacy, pet care, baby care), phir 20 category tiles.
2. **Category (Milk)** — baayein taraf sub-category ki patli list (photo + naam, chuni hui pe hari line), daayein 6-column product grid. Har card pe "8 MINS" ka chhota tag.
3. **Add to cart** — ADD dabate hi button hara "− 1 +" ban jaata hai aur upar cart button "1 item ₹31" dikhata hai. Koi popup nahi, page nahi badalta.
4. **Search** — likhte hi upar 5 suggestions (photo ke saath, match wala hissa bold), neeche "Showing results for…" grid. Kuch cards pe "Ad" aur "42% OFF" ka neela tag.
5. **Login** — "India's last minute app · Log in or Sign up", ek hi field (+91), Continue tab tak grey jab tak number poora na ho.
6. **Play Store se** — payment: UPI, card, COD, net banking, pay later, wallet. Tracking: map + "Your order has arrived!" + "Chat with us" / "Get a callback".

## Zepto — screen by screen
1. **Home** — logo, "Delivery in minutes" + Select Location, search, Login, Cart. 10 top tabs. Do banner, phir "Shop by Category" (20 tiles, naye pe "NEW" tag), phir product rails.
2. **Category (Fruits & Vegetables)** — breadcrumb, baayein sub-category list (chuni hui purple), upar 3 banner, neeche 6-column grid.
3. **Product card** — daam hare pill me sabse pehle, uske saath kata hua MRP. ADD photo ke upar.
4. **Search** — "Showing results for 'milk'", 6-column grid.
5. **Product page** — baayein photo gallery (thumbnails + badi photo) aur poori chaudai ka gulabi "Add to Cart". Daayein: brand, naam, rating (4.8 · 18.7k), hara daam, MRP, "₹132 OFF", do badge ("No return or replacement", "Fast Delivery"), phir Highlights table.
6. **Login** — baayein illustration + "Everything Delivered in minutes", daayein number field + Continue + app download badges.
7. **Play Store se** — "₹0 Fees": handling, delivery, rain & surge sab ₹0. Super Mall, Zepto Café. Tracking: map + "Arriving in 6 mins" + rider ka naam + call button.

## Dono me common patterns
- **Time ka vaada sabse upar** — delivery time logo ke theek baad, address ke saath.
- **Login baad me** — bina login ke browse aur add-to-cart ho jaata hai; number sirf checkout/login pe.
- **Login = sirf mobile number** — na email, na password, na naam.
- **Ek tap me add** — ADD button card pe hi; quantity wahin badalti hai.
- **Search hint badalta hai** — user ko idea deta hai kya dhoondhe.
- **Skeleton loading** — khaali screen ki jagah dabbe dikhte hain.
- **Discount hamesha kata hua MRP ke saath.**
- **Help order ke saath** — tracking screen pe hi chat/call.

## Users ki shikayatein (Play Store reviews)
- Blinkit: order ke baad delivery time 10 min se 30+ min ho gaya; kharab product pe return nahi; chat/call support nahi mila, sirf email.
- Zepto: "max daily limit exceeded" se item cart se hat gaye; live support nahi; discount dikha par bill me nahi laga.

## Apne onboarding app ke liye kaam ki baatein
1. **Kam se kam maango, baad me maango** — dono apps pehle value dikhate hain, phir number maangte hain. Apne app ka first page bhi pehle kamai aur time ka vaada dikhaye, phir number maange.
2. **Ek screen, ek kaam** — login pe sirf number. KYC ko bhi Aadhaar / PAN / Face / Bank me todo; help videos bhi isi hisaab se alag rakho.
3. **Turant feedback** — ADD dabate hi button badal jaata hai. Onboarding me har step ke baad "DONE" tag aur agla step khulna yahi kaam karta hai.
4. **Time ka vaada dikhao** — "8 minutes" jaisa. Har step pe aur help video me batao kitna time lagega.
5. **Demo 2 (form ke upar video) ke liye:** dono apps me upar ka header chhota aur chipka hua (sticky) rehta hai. Video bhi aisi hi patli sticky patti me rakho, form uske neeche scroll ho.
6. **Help har jagah ek hi jagah pe** — Blinkit rider app me floating call button, Zepto me top-right "Help".

---

## Mobile design (phone-size web, 5 Oct)
Screens `02_Customer_UI/Mobile_Web/` me hain. Yeh phone-size mobile website hai, app nahi. Zepto ka home aur search is network pe capture nahi hua.

| | Blinkit (mobile web) | Zepto (mobile web) |
|---|---|---|
| Kholte hi | Aadhi screen ka peela popup: "Get the blinkit app for Better Experience" + "Download the app now", neeche chhota "Continue on web" | Koi popup nahi, seedha content |
| Upar ki patti | Hari "Get The App · Use App" patti, uske neeche "Delivery in 8 minutes" + address | "Delivery in minutes" + Select Location, search icon |
| Home | "Grocery & Kitchen", "Snacks & Drinks" jaise sections, har ek me 4-column category tiles | (capture nahi hua) |
| Category | Baayein patli icon list, daayein 2-column product grid | Wahi layout: baayein icon list, upar banner, 2-column grid |
| Product card | Photo → "8 MINS" → naam → weight → daam + hara ADD | Photo pe gulabi ADD → hara daam pill + kata MRP → naam → weight |
| Search | Poori chaudai ka search bar, 5 suggestions, phir 2-column results | (capture nahi hua) |
| Product page | (nahi dekha) | Poori chaudai ki photo, rating, naam, hara daam, MRP + "₹132 OFF", 2 badge, aur neeche chipka hua gulabi "Add to Cart" |

**Mobile ke patterns:**
- Desktop ka 6-column grid mobile pe 2-column ho jaata hai; baayein wali category list patli icon-patti ban jaati hai.
- Main button (Add to Cart) screen ke neeche chipka rehta hai, angoothe ki pahunch me.
- Blinkit web user ko app ki taraf dhakelta hai (bada popup + upar patti); Zepto nahi.
- Header 2 line ka aur patla: delivery time + location.

**Apne app ke liye:** form-ke-upar-video wale layout me video upar sticky rakho aur main button ("Continue" / "Verify") neeche chipka hua — beech ka hissa form ke liye scroll ho. Yahi layout dono apps mobile pe use karte hain.

---

# PART 2 — Rider (delivery partner) onboarding

## Blinkit rider (~25 screens, 2 apps)
Pehle "Blinkit Onboarding" app, payment ke baad "Blinkit Delivery" app download + dobara login.

| # | Screen | UI |
|---|---|---|
| 1 | Permissions | Location, phir notification |
| 2 | Language | 7 bhashayein, 2-column grid, apni script me |
| 3 | Mobile | Illustration, +91, hara Continue |
| 4 | OTP | 6 boxes, WhatsApp updates checkbox pehle se ticked |
| 5 | Vehicle | Motorcycle / Bicycle / Electric scooter cards |
| 6 | City | Search + list |
| 7 | Work hours | Full time vs Part time, earning range ke saath |
| 8 | Store | Help video banner, "Recommended" tag, distance, joining bonus |
| 9 | Aadhaar intro | Video "How to Verify Aadhaar Card?", "5 min vs 1–2 din", Skip link |
| 10 | Aadhaar verify | Number → OTP → success popup |
| 11 | PAN | Number, naam, DOB, gender, father's name + photo |
| 12 | Bank | "Payout will be credited in this account", instant verify |
| 13 | Selfie | 3 sahi/galat photo pairs, phir camera |
| 14 | Payment | Benefit carousel, "POPULAR" full amount ya "₹49 now" instalment |
| 15 | Fee breakup | Pay now ₹49, Week 1–4, total ~₹449 |
| 16 | Success | Full green screen |
| 17 | App handoff | Doosra app download + dobara login |
| 18 | T&C | Checkbox + Accept |
| 19 | Dual SIM | Doosre SIM ka number |
| 20 | Checklist | "You are almost done" timeline, Pending/Completed |
| 21 | Profile | Vehicle no., nominee, emergency no. |
| 22 | Training | Videos + quiz |
| 23 | Wait | "3–6 hours to complete verification" |
| 24 | Store visit | Manager verification, "Scan Assets" QR |
| 25 | Done | "Get started" |

## Zepto rider (~18 screens, 1 app)
| # | Screen | UI |
|---|---|---|
| 1 | Become a Rider | 5 benefits, "Aadhaar & PAN ready rakho", purple button |
| 2 | Permissions | Ek screen pe list + reason |
| 3 | Language | 6 rows, script ka bada akshar |
| 4–5 | Mobile + OTP | |
| 6 | Onboarding hub | "Complete your onboarding in 10 min", timer, testimonials, locked steps |
| 7 | Vehicle | Bike / E-bike / "I don't have a vehicle" |
| 8 | Delivery mode | Bottom sheet |
| 9 | City | Auto-detect + Change City |
| 10 | Store | Distance, joining bonus chip, onboarding fee |
| 11 | Documents | PENDING list: Selfie, Aadhaar, PAN, DL |
| 12 | Selfie | Illustration + button |
| 13 | Aadhaar | Number → OTP, ya photo upload |
| 14 | PAN | Sirf number + Verify |
| 15 | Driving licence | Capture / Upload |
| 16 | Documents done | COMPLETED list |
| 17 | Onboarding kit | Instalment vs Pay Now |
| 18 | Training gate | "Start Training" |
| 19 | Home | Shift "Book Now", incentive progress |

## Rider onboarding ke patterns
- Zepto ka hub screen: 3 steps, "10 min" ka vaada, locked steps, testimonials ek jagah.
- Blinkit ka Aadhaar pitch: "5 min vs 1–2 din" dikha ke wajah batata hai, skip bhi deta hai.
- Selfie ke sahi/galat photo examples text se behtar.
- Fee: chhota "abhi" amount, full pe discount, fee se pehle benefits.
- Store card pe joining bonus.
- Help har screen pe.
- Friction: Blinkit me 2 apps + 2 baar login, PAN pe 5 fields; Zepto PAN pe sirf number.

## Pain points (guides + reviews)
- Blurry / glare wali document photo se auto-rejection.
- Naam mismatch (Aadhaar vs PAN vs bank).
- Reject hone ke baad joining fee refund na milna.
- Fee ka amount har jagah alag.
- Zepto: app me slot khaali dikhe par store pe "vacancy nahi".

---

## Sources
- https://play.google.com/store/apps/details?id=com.grofers.customerapp
- https://play.google.com/store/apps/details?id=com.zeptoconsumerapp
- https://blinkit.com/ · https://www.zepto.com/
- https://play.google.com/store/apps/details?id=app.blinkit.onboarding
- https://play.google.com/store/apps/details?id=com.zepto.rider
- https://www.youtube.com/watch?v=b6d66HucGOE (Blinkit rider walkthrough)
- https://www.youtube.com/watch?v=WnSpdNWC84w (Zepto rider walkthrough)
- https://www.registrationwala.com/knowledge-base/post/learning/how-to-become-blinkit-delivery-partner
- https://alphareach.tech/blog/blinkit-delivery-job-2026/
- https://alphareach.tech/blog/zepto-joining-fees-2026/
- https://deliveriesorgin.wordpress.com/zepto/

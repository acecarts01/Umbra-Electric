# Umbra Electric — keyword map

Tracks implementation status against `docs/keyword-cluster-map.md` (258 keywords / 15 clusters). Never
publish this file or the cluster map — `docs/` only, never `public/` or the deploy output.

Last updated: 2026-08-10

---

## Page-by-page assignment

| URL | Primary keyword | Supporting keywords | Cluster | Intent | Status |
|---|---|---|---|---|---|
| `/` | electric dirt bikes | premium electric dirt bike, e-bikes, Seattle-based | 1 + 14 | Info + Trans | ✅ Implemented |
| `/shop/` | electric dirt bikes (catalog-wide) | shop by brand, 128 curated models | 1 | Transactional | ✅ Implemented |
| `/shop/adult-electric-dirt-bikes/` | electric dirt bike for adults | adult electric dirt bike, premium electric dirt bike, electric motocross bike, electric trail bike | 1 + 2 | Info + Trans | ✅ Implemented (seoIntro) |
| `/shop/kids-electric-dirt-bikes/` | kids electric dirt bike | electric dirt bike for kids, youth electric dirt bike, small electric dirt bike for kids, electric pit bike kids | 3 | Trans + Info | ✅ Implemented |
| `/shop/electric-mountain-bikes/` | electric mountain bike | eMTB, full suspension electric mountain bike, premium electric mountain bike | 4 | Info + Trans | ✅ Implemented |
| `/shop/electric-commuter-bikes/` | electric commuter bike | electric city bike, electric bike for commuting, lightweight electric commuter bike | 5 | Trans + Info | ✅ Implemented |
| `/shop/electric-road-gravel-bikes/` | electric road bike / electric gravel bike | e-road bike, e-gravel bike, electric gravel bike adventure | 6 | Trans + Info | ✅ Implemented |
| `/shop/electric-fat-tire-bikes/` | electric fat tire bike | fat tire electric bike, fat tire e-bike, electric fat tire bike off-road | 7 | Trans + Info | ✅ Implemented |
| `/shop/kids-electric-bikes/` | kids e-bike | youth electric bike, electric bike for children, safe electric bike for kids | 8 | Transactional | ✅ Implemented |
| `/shop/folding-electric-bikes/` | folding electric bike | folding e-bike, compact electric bike, portable electric bike | 9 | Trans + Info | ✅ Implemented |
| `/shop/brand/[brand]/` (36 pages) | `[Brand] electric bikes & dirt bikes` | brand + category name, from Cluster 10's brand terms (Sur-Ron electric bike, KTM electric dirt bike, etc.) | 10 | Commercial | ✅ Implemented via template |
| `/product/[slug]/` (128 pages) | `[Product Name]` | category cluster (1–9) inherited via accurate categoryName in meta description + brand name | 1–9 + 10 | Transactional | ✅ Implemented via template (meta-description bug fixed — was mislabeling every product "electric dirt bike" regardless of category) |
| `/compare/` | electric dirt bike comparison | electric bike brand comparison | 10 | Commercial Investigation | ✅ Implemented |
| `/premium/` | premium electric dirt bike | premium electric bike brands, high performance electric dirt bike | 1 + 10 | Trans + Commercial | ✅ Implemented |
| `/financing/` | electric dirt bike financing | finance electric bike, electric bike payment plan, pay monthly electric bike | 11 | Transactional | ✅ Implemented |
| `/finance-calculator/` | electric bike payment plan | finance electric bike | 11 | Transactional | ✅ Implemented |
| `/shipping/` | electric bike shipping USA | electric dirt bike delivery, electric bike worldwide shipping | 12 | Informational | ✅ Implemented |
| `/faq/` | (mixed — AEO Q&A format) | how much does an electric dirt bike cost, electric bike ship to Europe, are electric dirt bikes legal | 11 + 12 + 13 | Informational | ✅ Implemented (12 Q&As) |
| `/about/` | Seattle-based electric bike retailer | founding story, milestones, product range | 14 | Navigational | ✅ Implemented (pre-existing, title tightened) |
| `/contact/` | contact + location | Seattle, WA HQ | 14 | Navigational | ✅ Implemented (pre-existing) |
| `/reviews/` | — (trust signal page, not keyword-targeted) | — | — | — | N/A by design |

---

## Published blog posts (18)

Cluster 13 (how-to/educational) and Cluster 15 (long-tail) targeted first per usage rules.

| Slug | Primary keyword target | Cluster |
|---|---|---|
| `are-electric-dirt-bikes-street-legal` | are electric dirt bikes legal | 13 |
| `electric-bike-classes-explained` | electric bike classes (supporting: C5/C13 buyer's guide) | 13 |
| `electric-dirt-bikes-for-kids-guide` | electric dirt bike for kids buyer's guide | 3 + 13 |
| `electric-vs-gas-dirt-bikes-cost` | electric dirt bike vs gas dirt bike | 13 + 10 |
| `how-to-choose-premium-emtb` | electric mountain bike buying guide | 13 + 4 |
| `sur-ron-vs-talaria-2026` | Sur-Ron vs Talaria | 10 |
| `essential-gear-for-electric-dirt-bike-riding` | electric dirt bike for beginners (gear angle) | 15 |
| `electric-dirt-bike-maintenance-checklist` | electric dirt bike maintenance | 13 |
| `electric-dirt-bike-battery-care-guide` | electric dirt bike battery range / how long does the battery last | 13 |
| `how-much-does-it-cost-to-charge-an-ebike` | how to charge an electric dirt bike | 13 |
| `how-to-finance-a-premium-electric-dirt-bike` | electric dirt bike financing | 11 |
| `how-to-transport-an-electric-dirt-bike` | electric dirt bike ownership (transport, supporting) | 15 |
| `cold-weather-riding-tips-electric-bikes` | electric bike cold weather riding (supporting) | 15 |
| `choosing-the-right-size-electric-mountain-bike` | electric mountain bike sizing (supporting) | 4 |
| `fat-tire-vs-standard-ebike` | fat tire electric bike vs standard (supporting) | 7 |
| `folding-ebike-buyers-guide` | folding electric bike buyer's guide | 9 |
| `e-bike-vs-electric-dirt-bike-difference` | eMTB vs electric dirt bike | 13 |
| `throttle-emotos-vs-pedal-assist-emtbs` | electric dirt bike vs eMTB riding style (supporting) | 10 + 4 |

All 18 posts are interlinked: the "Keep reading" chain connects every post in a loop, and every category
page now links to its 2 most relevant posts (see `relatedPosts` in `src/data/categories.json`).

---

## Unused clusters (next content, priority order)

High-value, high-search-intent terms not yet targeted by a dedicated page. Recommended as future blog posts
(Cluster 13/15 compound fastest per usage rules) or product-page copy additions.

1. **electric dirt bike top speed / how fast do electric dirt bikes go** (C13 #18-19) — evergreen spec-explainer, easy to rank, links to every dirt bike product page.
2. **electric dirt bike motor types** (C13 #8) — technical authority piece, reinforces topical depth for Cluster 1/2.
3. **electric dirt bike watt hours explained** (C13 #9) — pairs naturally with the existing battery-care post.
4. **how to ride an electric dirt bike** (C13 #12) — true beginner funnel content, pairs with essential-gear post.
5. **electric dirt bike noise level** (C13 #13) — differentiator content (quiet vs gas), strong for AI-citation ("why electric").
6. **electric dirt bike weight** (C13 #20) — spec-comparison content, good internal-link bait from product pages.
7. **best electric dirt bike for heavy riders / electric dirt bike for tall riders** (C15 #1-2) — underserved long-tail, low competition.
8. **fastest electric dirt bike / longest range electric dirt bike / most powerful electric dirt bike / quietest electric dirt bike** (C15 #4-7) — "best of" roundup content pulling from the existing catalog, no new facts needed.
9. **electric dirt bike for farm use / electric dirt bike for hunting / electric dirt bike for trail access** (C15 #8-10) — niche use-case content, near-zero competition.
10. **electric bike for seniors / electric mountain bike for heavy riders / electric commuter bike for tall riders** (C15 #16-18) — fit/accessibility angle, currently uncovered.
11. **Stark vs KTM electric** (C10 #3) — comparison piece, mirrors the existing Sur-Ron vs Talaria post structure.
12. **electric dirt bike range comparison / power comparison / charging time** (C10 #13-15) — spec-comparison hub page, could pull structured data from `products.json`.
13. Klarna / pay-monthly / buy-now-pay-later phrasing (C11 #5-7, #13-14) — only add if the actual financing provider supports these terms; do not imply a specific provider (Klarna) unless it is genuinely integrated.
14. Ship to UK / Australia / customs & import (C12 #11-13) — only add once shipping policy explicitly confirms these lanes; currently the site only commits to US/Europe/Worldwide in general terms.

## Excluded (never target)

| Keyword(s) | Why |
|---|---|
| Cake Kalk, Cake electric moto, Cake Off-Road, Cake vs Sur-Ron, Cake Kalk review | Cake is not a brand Umbra Electric carries. Targeting these would draw search traffic for a product we cannot sell — wrong intent, high bounce risk. |
| Alta Motors electric | Alta Motors ceased operations; brand not carried. Same reasoning as above. |
| Talaria Sting review, Stark Varg review, KTM Freeride E-XC review, Sur-Ron Light Bee review | We carry these models but have not published dedicated single-model review content — do not title a page "review" without genuine independent review content; existing comparison posts (Sur-Ron vs Talaria) cover this more honestly. |
| electric cargo bike USA | Not a category Umbra Electric carries (no cargo bikes in the catalog). |
| electric bike for disabled riders | Do not target without a genuinely adapted/accessible product line — claiming relevance here without real accessibility features would be misleading. |

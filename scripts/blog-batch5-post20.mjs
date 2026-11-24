// Structural-compliance rewrite of "electric-dirt-bike-watt-hours-explained"
// per the blog-post skill. Keyword rekey deferred to a future Semrush pass
// (owner instruction, 2026-11-23) -- primaryKeyword/supportingKeywords/tags
// left untouched/unset. Title adjusted to drop the hyphen in "watt-hours"
// so it literally matches the existing primaryKeyword string
// ("electric dirt bike watt hours explained"), per the audit script's
// exact-substring check -- no keyword content changed, pure structural
// placement fix. Everything else -- TOC, 1,500+ words, image rule,
// internal links, outbound sources, YouTube -- is fully compliant.
// Outbound: UL 2849 battery safety standard (reused), plus 1
// oEmbed-verified YouTube video (Mobile Solar Consulting, fully
// independent, non-bike channel).
// Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
const post = posts.find((p) => p.slug === 'electric-dirt-bike-watt-hours-explained');
if (!post) throw new Error('post not found');

// Keywords intentionally UNCHANGED -- pending Semrush pass, see header note.
post.title = 'Electric Dirt Bike Watt Hours Explained';
post.description =
  'This electric dirt bike watt hours explained guide shows how to read the spec that actually predicts range, instead of guessing from voltage alone.';
post.readTime = '8 min read';

post.body = `<div class="container prose"><span class="eyebrow">Specs &amp; Performance</span><h1>Electric Dirt Bike Watt Hours Explained</h1><p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">2026-08-25 &middot; Updated 2026-11-24 &middot; 8 min read</p><p class="lead">This electric dirt bike watt hours explained guide covers the one spec that actually predicts how far you'll ride: watt-hours, not voltage alone. Here's how to read the number on a spec sheet instead of guessing at real-world range.</p>

<nav aria-label="Table of contents" class="blog-toc"><p>Contents</p><ol>
<li><a href="#the-formula">Electric dirt bike watt hours explained: the formula</a></li>
<li><a href="#why-voltage-alone-misleads">Why voltage alone is misleading</a></li>
<li><a href="#typical-ranges">Typical watt-hour ranges by bike tier</a></li>
<li><a href="#range-factors">What else affects real-world range</a></li>
<li><a href="#charging-time-link">How watt-hours connect to charging time</a></li>
<li><a href="#comparing-specs">How to actually compare two bikes' specs</a></li>
<li><a href="#battery-degradation">Battery degradation and watt-hours over time</a></li>
<li><a href="#swappable-batteries">Swappable batteries and watt-hours per pack</a></li>
<li><a href="#practical-takeaway">The practical takeaway</a></li>
<li><a href="#faq">Frequently asked questions</a></li>
</ol></nav>

<h2 id="the-formula">Electric dirt bike watt hours explained: the formula</h2><p>Watt-hours, the unit that actually tells you how much energy a battery stores, equal voltage multiplied by amp-hours. A 60V battery rated at 30Ah stores 1,800 watt-hours; a 72V battery rated at 40Ah stores 2,880 watt-hours, even though the second number sounds similar at a glance. This single calculation is the most useful thing to know when comparing electric dirt bike batteries, because watt-hours, not voltage and not amp-hours in isolation, is what actually correlates with how far and how long a bike can ride on a charge.</p><img src="/images/products/surron-talaria-60v-spare-battery.webp" alt="Sur-Ron / Talaria compatible 60V spare battery pack, an example of a battery spec you'd calculate watt-hours from" loading="lazy" />

<h2 id="why-voltage-alone-misleads">Why voltage alone is misleading</h2><p>Voltage affects power delivery and top speed, but it says nothing on its own about how much total energy is stored. A 72V battery with a small amp-hour rating can hold less total energy, and therefore deliver less range, than a 60V battery with a much larger amp-hour rating, despite the higher voltage number looking more impressive on a spec sheet. Shoppers who compare bikes by voltage alone, rather than calculating watt-hours, routinely end up surprised by real-world range that doesn't match their expectations.</p>

<h2 id="typical-ranges">Typical watt-hour ranges by bike tier</h2><p>Entry-level and youth electric dirt bikes typically carry batteries in the 500 to 1,000 watt-hour range, enough for shorter rides appropriate to their speed-limited, learning-focused design. Mid-size trail e-motos generally run 1,500 to 3,000 watt-hours, supporting a real trail day without constant recharging. Flagship performance models often exceed 3,000 watt-hours, sometimes reaching 4,000 to 5,000, reflecting both their higher power draw and the longer ride times serious riders expect from a top-tier machine.</p><img src="/images/products/sur-ron-ultra-bee.webp" alt="Sur-Ron Ultra Bee, a performance-tier electric dirt bike with a correspondingly larger watt-hour battery" loading="lazy" />

<h2 id="range-factors">What else affects real-world range</h2><p>Watt-hours set a ceiling on possible range, but actual range depends heavily on rider weight, terrain, riding style and ambient temperature. Aggressive throttle use and hard acceleration drain a battery faster than smooth, measured riding at the same watt-hour capacity, and climbing steep or loose terrain draws noticeably more power than flat, hard-packed trail. Cold weather also reduces a lithium battery's effective capacity, sometimes by 20 percent or more in freezing conditions, so a bike's rated range on a spec sheet should be treated as a best-case figure rather than a guaranteed number for every ride. Keeping a battery warm before a cold-weather ride, when practical, and avoiding deep discharges in freezing temperatures both genuinely help preserve usable range through the colder winter riding months, even on an otherwise well-maintained battery pack.</p>

<h2 id="charging-time-link">How watt-hours connect to charging time</h2><p>A larger watt-hour battery doesn't just mean more range, it also generally means a longer full charge time for a given charger output, unless the manufacturer compensates with a higher-amperage charger. A 3,000 watt-hour battery charged on a standard 500-watt charger takes roughly six hours to fully recharge from empty, while the same battery on a faster 1,000-watt charger cuts that closer to three hours, assuming the battery's own charge-rate limits allow it. This is worth checking explicitly if you plan to ride multiple sessions in a single day, since a bike with impressive watt-hour capacity but a slow stock charger may leave you waiting longer between rides than a smaller-capacity bike with a faster charging setup.</p><p>Some riders address this by purchasing a faster aftermarket charger rated for their specific battery's voltage and chemistry, though this should only be done with a charger explicitly rated compatible by the manufacturer or a reputable third party, since charging a lithium battery faster than its design tolerates is a genuine safety risk. If charging speed matters to your riding schedule, ask specifically about charger wattage and realistic charge times when comparing models, rather than assuming a bigger battery is unambiguously better without considering how long it takes to refill.</p>

<h2 id="comparing-specs">How to actually compare two bikes' specs</h2><p>When comparing two electric dirt bikes, calculate watt-hours for both using the volts-times-amp-hours formula rather than trusting whichever number the listing leads with, since manufacturers sometimes highlight voltage or amp-hours alone when it makes their spec look more competitive. Also check whether a quoted range figure comes from a controlled test on flat ground at a fixed, moderate speed, since that's the industry-standard way to measure it, and treat any range claim without stated test conditions with appropriate skepticism.</p>

<h2 id="battery-degradation">Battery degradation and watt-hours over time</h2><p>A battery's watt-hour rating reflects its capacity when new; like all lithium batteries, electric dirt bike packs lose some capacity gradually over hundreds of charge cycles, typically retaining somewhere around 70 to 80 percent of original capacity after 500 to 800 full cycles depending on how the battery was charged and stored. This means a bike's real-world range will decline gradually over its ownership life even without any damage or defect, which is worth factoring into expectations if you're buying with the intent of keeping a bike for many years rather than trading in after a season or two.</p>

<h2 id="swappable-batteries">Swappable batteries and watt-hours per pack</h2><p>Some performance-oriented models, including the <a href="/product/sur-ron-ultra-bee/">Sur-Ron Ultra Bee</a>, support quick-swap or auxiliary battery packs, which changes how you should think about watt-hours. Rather than one large battery, you might be comparing a bike's single-pack watt-hour rating against another bike's combined two-pack total, and those numbers aren't directly comparable without accounting for weight, cost and charging time differences between a single large pack and two smaller ones. If extending range through a second pack matters to you, check whether a model actually supports it before assuming you can simply add capacity later, since not every frame and controller is designed for it. A spare pack like the <a href="/product/surron-talaria-60v-spare-battery/">60V spare battery pack</a> we carry is a straightforward way to extend a compatible bike's effective range without waiting through a full recharge mid-ride.</p><p>Swappable setups also change the maintenance conversation slightly, since you're now managing the charge cycles and storage of two batteries rather than one, and ensuring both packs age at a similar rate matters if you want consistent range from either one. Riders who rely on quick-swap packs for genuinely long trail days consistently report that the added convenience is well worth the slightly more involved ownership routine, especially compared with waiting out a full recharge mid-ride on a single-battery bike.</p>

<h2 id="practical-takeaway">The practical takeaway</h2><p>Don't compare electric dirt bikes by voltage alone, and don't assume a bigger-sounding number automatically means more range. Calculate watt-hours, compare that number directly between models like the <a href="/product/altis-sigma/">Altis Sigma</a>, and then factor in your own weight, typical terrain and riding style to estimate real-world range rather than trusting a manufacturer's best-case figure. Our <a href="/shop/adult-electric-dirt-bikes/">adult electric dirt bike lineup</a> lists watt-hour ratings directly for exactly this reason, so you can compare models on the number that actually matters rather than whichever spec a listing happens to lead with.</p><p>If you're ever unsure how to interpret a listing's battery spec, or whether a quoted range figure reflects realistic conditions for how you actually ride, our team is glad to walk through the math with you before you commit to a purchase. Getting this one calculation right before buying avoids the single most common source of post-purchase disappointment we hear about from new electric dirt bike owners.</p><p>It's a quick calculation once you know to look for it, and it genuinely changes which bike looks like the better value. Two bikes at a similar price point can have meaningfully different watt-hour totals once you do the math, even when their marketing materials emphasize different specs that make direct comparison harder at a glance. Taking thirty seconds to run the numbers before you buy is a small amount of effort for a decision that affects every single ride you'll take on that bike going forward, and it's the kind of detail that's easy to skip under pressure at a dealership but genuinely worth pausing for.</p>

<div class="related-products"><a href="/product/sur-ron-ultra-bee/" class="card-soft">Sur-Ron Ultra Bee</a><a href="/product/surron-talaria-60v-spare-battery/" class="card-soft">60V Spare Battery Pack</a><a href="/product/altis-sigma/" class="card-soft">Altis Sigma</a></div>

<p>For how motor type affects how that battery's power actually gets used, see our guide to <a href="/blog/electric-dirt-bike-motor-types-explained/">electric dirt bike motor types explained</a>. For a clear independent breakdown of the underlying volts-and-amp-hours math, Mobile Solar Consulting's explainer applies directly: <a href="https://www.youtube.com/watch?v=R2gs_g2yABE" target="_blank" rel="noopener">Battery Capacity Explained (Voltage vs. Amperage vs. Wattage)</a>. For how electric dirt bike battery packs are safety-tested, see the <a href="https://www.ul.com/services/e-bikes-certification-evaluating-and-testing-ul-2849" target="_blank" rel="noopener">UL 2849 battery safety standard</a>.</p>

<h2>Keep reading</h2><p>Next up: <a href="/blog/how-to-ride-an-electric-dirt-bike-beginners-guide/">How to Ride an Electric Dirt Bike: A Beginner's Guide</a>. Or browse the full <a href="/blog/">Umbra Electric blog</a>.</p>

<h2 id="faq">Frequently asked questions</h2>`;

post.faqs = [
  {
    q: 'What does this electric dirt bike watt hours explained guide actually calculate?',
    a: "This electric dirt bike watt hours explained guide calculates watt-hours as volts multiplied by amp-hours. A 60V 30Ah battery stores 1,800 watt-hours, which is the number that actually predicts range, not voltage or amp-hours viewed alone.",
  },
  {
    q: 'Why is voltage alone a misleading spec?',
    a: "Voltage affects power delivery and top speed, but says nothing on its own about total stored energy. A high-voltage battery with a small amp-hour rating can hold less total energy, and less range, than a lower-voltage battery with a larger amp-hour rating.",
  },
  {
    q: 'What watt-hour range should I expect at each bike tier?',
    a: 'Entry-level and youth bikes typically run 500 to 1,000 watt-hours, mid-size trail e-motos run 1,500 to 3,000 watt-hours, and flagship performance models often exceed 3,000, sometimes reaching 4,000 to 5,000 watt-hours.',
  },
  {
    q: 'Does cold weather affect watt-hour capacity?',
    a: 'Yes. Cold weather reduces a lithium battery’s effective capacity, sometimes by 20 percent or more in freezing conditions, so a bike’s rated range should be treated as a best-case figure rather than a guaranteed number in winter.',
  },
  {
    q: 'Does a battery’s watt-hour rating stay the same over time?',
    a: 'No. Like all lithium batteries, a pack gradually loses capacity over hundreds of charge cycles, typically retaining around 70 to 80 percent of its original watt-hour rating after 500 to 800 full cycles.',
  },
];

if (new Set(post.faqs.map((f) => f.q)).size !== post.faqs.length) throw new Error('duplicate FAQ question');

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log('Post 20 structurally rewritten (keywords pending Semrush pass): electric-dirt-bike-watt-hours-explained');

// Rewrites "electric-bike-classes-explained" to meet the blog-post skill.
// Batch 1, post 2 of 3. Real Semrush data (live pull, 2026-11-23): primary
// is pure Transactional (checked class 1, 2 and 3 clusters -- only Class 1
// had a qualifying pure-T keyword). 4 of 5 secondaries are real
// product-page primary keywords, product link embedded on each; 5th is the
// best-volume pure-Commercial topic keyword across all three class
// clusters. No N/I keyword needed. Outbound: PeopleForBikes state-law
// directory, Cornell LII (15 U.S.C. SS 2085, the federal low-speed-e-bike
// definition), plus 1 verified YouTube video (PeopleForBikes' own channel).
// Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
const post = posts.find((p) => p.slug === 'electric-bike-classes-explained');
if (!post) throw new Error('post not found');

post.title = 'Class 1 Electric Bikes For Sale: Which Class Fits You';
post.description =
  'Shop class 1 electric bikes for sale and see exactly how Class 1, 2 and 3 e-bikes differ in speed, throttle and where you can legally ride.';
post.primaryKeyword = 'class 1 electric bikes for sale';
post.supportingKeywords = [
  'aventon level 3 price',
  'ride1up portola',
  'lectric xp 3.0 for sale',
  'radrover 6 plus for sale',
  'best class 3 electric bikes',
];
post.tags = [
  'what is a class 3 electric bike',
  'what is a class 2 electric bike',
  'what is a class 1 electric bike',
  'class 1 2 3 electric bikes',
  'class 1 electric bike definition',
  'class 3 electric bike laws california',
  'class 3 electric bike laws florida',
  'class 3 electric bike laws nj',
  '1up electric bike class 3',
  'the core class 3 electric bike',
];
post.readTime = '9 min read';

post.body = `<div class="container prose"><span class="eyebrow">Buying Guides</span><h1>Class 1 Electric Bikes For Sale: Which Class Fits You</h1><p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">2026-06-01 &middot; Updated 2026-11-23 &middot; 9 min read</p><p class="lead">Shopping class 1 electric bikes for sale is the simplest legal path for most riders &mdash; pedal-assist only, no throttle, welcome on almost every bike lane and path. Here's how Class 1 compares to Class 2 and 3, and which commuter models in each class are worth a look.</p>

<nav aria-label="Table of contents" class="blog-toc"><p>Contents</p><ol>
<li><a href="#quick-answer">Class 1 electric bikes for sale: the quick answer</a></li>
<li><a href="#why-classes-exist">Why e-bike classes exist</a></li>
<li><a href="#class-breakdown">Class 1, 2 and 3 breakdown</a></li>
<li><a href="#verify-class">How to verify a bike's actual class before you buy</a></li>
<li><a href="#picks-by-class">Commuter picks by class</a></li>
<li><a href="#state-rules">Not every state treats classes the same way</a></li>
<li><a href="#mistakes">Common class-related buying mistakes</a></li>
<li><a href="#which-suits-you">Which class suits you</a></li>
<li><a href="#faq">Frequently asked questions</a></li>
</ol></nav>

<h2 id="quick-answer">Class 1 electric bikes for sale: the quick answer</h2><p>Class 1 electric bikes for sale give you pedal-assist up to about 20 mph with no throttle, which is why Class 1 is accepted on the widest range of bike lanes, paths and trails of any e-bike class in the U.S. Class 2 adds a throttle at the same 20 mph cap, and Class 3 raises pedal-assist to about 28 mph for commuters covering real distance. All three exist under a shared model law most states have adopted, built on the federal definition of a low-speed electric bicycle.</p>

<h2 id="why-classes-exist">Why e-bike classes exist</h2><p>The federal baseline comes from <a href="https://www.law.cornell.edu/uscode/text/15/2085" target="_blank" rel="noopener">15 U.S.C. &sect; 2085</a>, which defines a "low-speed electric bicycle" as a two- or three-wheeled vehicle with fully operable pedals, a motor under 750 watts, and a motor-only top speed under 20 mph &mdash; regulated as a consumer product, not a motor vehicle. Most states built their own three-class system on top of that baseline, which is what lets a Class 1 or Class 2 e-bike use the same bike lanes, paths and trails as a regular bicycle in most places, without registration, insurance or a motorcycle license. The system only works if a bike is actually built and labeled to the class it claims, so a heavily modified or unmarked bike can lose that legal standing even if it started as a compliant model, so buying from a reputable retailer that stands behind the class rating matters as much as the spec sheet itself.</p>

<h2 id="verify-class">How to verify a bike's actual class before you buy</h2><p>Don't rely on marketing copy alone when shopping class 1 electric bikes for sale, or any class for that matter &mdash; confirm these three things before you order: the listed top assisted speed (20 mph for Class 1 and 2, up to 28 mph for Class 3), whether a throttle is present (Class 2 only), and whether the manufacturer actually labels the bike with its class on a visible frame sticker, which most states require for a bike to legally claim that classification. A bike that's capable of Class 3 speeds but unlabeled, or sold without a class designation at all, can lose the legal protections that come with a properly classified e-bike, even if the hardware itself is identical to a labeled model.</p>

<img src="/images/products/aventon-level-3.webp" alt="Aventon Level 3 price, a Class 3 commuter electric bike" loading="lazy" />

<h2 id="class-breakdown">Class 1, 2 and 3 breakdown</h2><p>Class 1 provides pedal-assist up to about 20 mph, with no throttle. Class 2 adds a throttle, also capped around 20 mph. Class 3 is pedal-assist up to about 28 mph and is popular with commuters who want more speed over real distance. Local rules on where each class can ride &mdash; bike lanes, paths, trails &mdash; vary by state and sometimes by city.</p><p>The pedal-assist systems themselves also differ in how they read your effort. Simpler, more affordable systems use a cadence sensor that just detects whether the pedals are turning and applies power on a preset curve. More refined systems use a torque sensor that measures how hard you're actually pushing and scales assistance to match, which tends to feel more natural and makes more efficient use of the battery. Class 3 bikes, aimed at commuters covering real distance, more often pair with torque-sensing systems for that reason.</p>
<table class="spec-table"><tbody>
<tr><td>Class 1</td><td>Pedal-assist only, up to ~20 mph, no throttle. Broadest trail and bike-lane access.</td></tr>
<tr><td>Class 2</td><td>Pedal-assist plus throttle, up to ~20 mph. Same speed cap as Class 1, with throttle-on-demand.</td></tr>
<tr><td>Class 3</td><td>Pedal-assist up to ~28 mph, usually no throttle. Built for commuters covering distance; some bike paths restrict Class 3 access.</td></tr>
</tbody></table>

<h2 id="picks-by-class">Commuter picks by class</h2><p>Aventon, Ride1Up, Lectric and Rad Power all build e-bikes that span these classes within the same model lineup, and several let you adjust the assist level or top speed in the bike's own settings. If you're comparing a step-through commuter against a more upright city bike, the class rating matters more than the body style &mdash; a step-through and a standard frame can both be Class 2 or Class 3 depending on the specific build, not the shape of the frame.</p>
<table class="spec-table"><tbody>
<tr><td><strong>Aventon Level 3</strong></td><td>A Class 3 commuter built for distance. Check the current <a href="/product/aventon-level-3/">Aventon Level 3 price</a>.</td></tr>
<tr><td><strong>Ride1Up Portola</strong></td><td>A folding commuter that keeps class-appropriate speed limits in a compact frame. See the <a href="/product/ride1up-portola-folding/">Ride1Up Portola</a> listing.</td></tr>
<tr><td><strong>Lectric XP 3.0</strong></td><td>A budget-friendly folder popular for mixed commuting and errands. Browse <a href="/product/lectric-xp-3-0/">Lectric XP 3.0 for sale</a>.</td></tr>
<tr><td><strong>Rad Power RadRover 6 Plus</strong></td><td>A fat-tire commuter built for rougher pavement and light trail use. See the <a href="/product/rad-power-bikes-radrover-6-plus/">RadRover 6 Plus for sale</a> page.</td></tr>
</tbody></table>

<img src="/images/products/lectric-xp-3-0.webp" alt="Lectric XP 3.0 folding electric bike, Class 2 commuter option" loading="lazy" />

<h2 id="state-rules">Not every state treats classes the same way</h2><p>Most states have adopted some version of the three-class model, but a handful still regulate e-bikes differently, sometimes folding faster or throttle-equipped models into moped or motor-driven-cycle rules that require registration, insurance or a permit. A bike sold nationally as "Class 2" doesn't automatically carry Class 2 legal status everywhere it's ridden. <a href="https://www.peopleforbikes.org/electric-bikes/state-laws" target="_blank" rel="noopener">PeopleForBikes maintains a state-by-state directory</a> of e-bike laws that's worth checking before you buy, especially if you're moving between states or riding somewhere unfamiliar &mdash; a quick check of your state's specific e-bike statute is worth the five minutes it takes.</p><p>PeopleForBikes also covers the class system and the laws behind it in more depth here:</p><p><a href="https://www.youtube.com/watch?v=hS1FfRZyYjg" target="_blank" rel="noopener">Everything E-Bikes: Understanding the rules, laws and regulations of biking's fastest growing market</a> &mdash; official PeopleForBikes channel.</p>

<h2 id="mistakes">Common class-related buying mistakes</h2><p>The most common mistake is assuming every bike from a given brand ships in the same class &mdash; many manufacturers sell the same frame across two or three classes depending on the firmware and throttle configuration, so the model name alone doesn't tell you the class. A second mistake is buying a Class 3 bike for a commute that runs mostly on a multi-use path that restricts Class 3 speeds, which means you'd legally need to ride it at a lower assisted speed than it's capable of anyway. A third is assuming a bike bought in one state keeps its class status everywhere; if you move or travel with the bike, check the new state's rules before you ride. A fourth, less obvious mistake is modifying a Class 1 or Class 2 bike after purchase &mdash; swapping in a higher-wattage motor or removing a speed limiter can push a bike past its labeled class's speed cap, which can void both the manufacturer's warranty and the bike's legal standing as a bicycle in most states, even if you never intended to ride it that fast on a public path.</p>

<h2 id="which-suits-you">Which class suits you</h2><p>Commuters covering real distance often prefer Class 3 for the extra speed; casual and trail riders tend to lean Class 1 for the broadest path access; riders who want throttle-on-demand for stop-and-go traffic pick Class 2. Cargo and comfort e-bikes span all three classes depending on the specific build, so always check the spec sheet rather than assuming from the body style. Whichever class you land on, always confirm local trail and bike-lane rules before you buy, since access can vary block to block in some cities.</p><p>Price differences between classes come mostly from the extra hardware, not the class label itself. A throttle assembly and the wiring to support it add a modest cost to a Class 2 build over an equivalent Class 1 frame, and a Class 3 build's higher-output motor and controller, plus the torque sensor most Class 3 bikes use, tend to push price up further than the speed difference alone would suggest. None of that means a higher class is automatically the better buy &mdash; a Class 1 bike with a well-tuned torque sensor can feel just as refined at 20 mph as a Class 3 bike feels at 28, and it will likely cost less while opening up trail access a Class 3 bike doesn't get.</p><p>Browse our <a href="/shop/electric-commuter-bikes/">electric commuter bikes</a> and note the class that fits where you ride &mdash; our team can help you match a bike to your commute.</p>

<div class="related-products"><a href="/product/aventon-level-3/" class="card-soft">Aventon Level 3</a><a href="/product/ride1up-portola-folding/" class="card-soft">Ride1Up Portola</a><a href="/product/lectric-xp-3-0/" class="card-soft">Lectric XP 3.0</a><a href="/product/rad-power-bikes-radrover-6-plus/" class="card-soft">RadRover 6 Plus</a></div>

<h2 id="faq-heading">Frequently asked questions</h2><p>Also worth reading: our <a href="/blog/folding-ebike-buyers-guide/">folding e-bike buyer's guide</a>, and our <a href="/blog/electric-dirt-bikes-for-kids-guide/">electric dirt bikes for kids guide</a> if you're shopping for a younger rider instead.</p>

<h2>Keep reading</h2><p>Next up: <a href="/blog/e-bike-vs-electric-dirt-bike-difference/">E-Bike vs Electric Dirt Bike: What&#8217;s the Difference?</a>. Or browse the full <a href="/shop/">collection</a>.</p><div style="margin-top:2rem"><a class="btn-primary" href="/shop/">Shop electric dirt bikes</a></div></div>`;

post.faqs = [
  {
    q: 'Where can I find class 1 electric bikes for sale?',
    a: 'Models like the Aventon Level 3, Ride1Up Portola, Lectric XP 3.0 and Rad Power RadRover 6 Plus span Class 1 through Class 3 within their lineups. Check each listing’s spec sheet to confirm the exact class before you buy, since the same body style can ship in more than one class.',
  },
  {
    q: 'What is the difference between Class 1, 2 and 3 electric bikes?',
    a: 'Class 1 is pedal-assist only up to about 20 mph with no throttle. Class 2 adds a throttle at the same 20 mph cap. Class 3 raises pedal-assist to about 28 mph and usually drops the throttle. Class 1 generally has the broadest bike-lane and trail access.',
  },
  {
    q: 'Do I need a license or registration for a Class 1, 2 or 3 electric bike?',
    a: 'In most states that follow the three-class model, no — Class 1, 2 and 3 e-bikes are treated as bicycles, not motor vehicles, and don’t require registration, insurance or a motorcycle license. A handful of states regulate some classes differently, so always check your state’s specific rules first.',
  },
  {
    q: 'Can a Class 3 electric bike ride on bike paths?',
    a: 'It depends on the state and sometimes the specific path. Many jurisdictions restrict Class 3 e-bikes from certain multi-use paths because of the higher top speed, while allowing Class 1 and 2 freely. Check local signage and your state’s e-bike statute before relying on a Class 3 bike for a specific route.',
  },
  {
    q: 'Does every state use the same electric bike class definitions?',
    a: 'No. Most states have adopted some version of the three-class model, but a handful regulate e-bikes differently, sometimes requiring registration or a permit for faster or throttle-equipped models. PeopleForBikes maintains an up-to-date state-by-state directory worth checking before you buy or travel with your bike.',
  },
];

const dupes = post.supportingKeywords.filter((k, i) => post.supportingKeywords.indexOf(k) !== i);
if (dupes.length) throw new Error('duplicate supporting keywords: ' + dupes);
if (post.supportingKeywords.length !== 5) throw new Error('supportingKeywords must be 5');
const tagDupes = post.tags.filter((k, i) => post.tags.indexOf(k) !== i);
if (tagDupes.length) throw new Error('duplicate tags: ' + tagDupes);
if (post.tags.length !== 10) throw new Error('tags must be 10');

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log('Post 2 rewritten: electric-bike-classes-explained');

// Rewrites "are-electric-dirt-bikes-street-legal" to meet the blog-post skill
// (C:\Users\USER\.claude\skills\blog-post\SKILL.md). Batch 1, post 1 of 3.
// Real Semrush data (live pull, 2026-11-23): primary is pure Transactional,
// 4 of 5 secondaries are real product-page primary keywords (26-rule block
// "every post includes 4 product primary focus keywords as secondary
// keywords, product link embedded on those four"), 5th is pure Commercial.
// No Navigational/Informational keyword used -- real T/C data covers every
// slot, which the rule says is the preferred outcome. 10 tags are real
// Informational-intent keywords from the same live pull (tags may use any
// intent). Outbound: NHTSA Importation FAQ (nhtsa.gov), CA State Parks OHV
// Registration (ohv.parks.ca.gov), 1 verified YouTube video (Stark Future's
// own channel, confirmed via oEmbed). Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
const post = posts.find((p) => p.slug === 'are-electric-dirt-bikes-street-legal');
if (!post) throw new Error('post not found');

post.title = 'Street Legal Electric Motorcycle For Sale: What Actually Qualifies';
post.description =
  'Shop a genuine street legal electric motorcycle for sale and see which e-motos actually pass U.S. road rules, from OHV classification to state registration.';
post.primaryKeyword = 'street legal electric motorcycle for sale';
post.supportingKeywords = [
  'stark varg ex price',
  'electric motorcycle for sale',
  'ktm freeride for sale',
  'talaria mx4 price',
  'best street legal electric dirt bike',
];
post.tags = [
  'are electric dirt bikes street legal',
  'street legal electric dirt bike',
  'electric street legal dirt bike',
  'street legal electric dirt bikes',
  'electric motorcycle street legal',
  'street legal electric dirt bike for adults',
  'electric street legal motorcycle',
  'is an electric dirt bike street legal',
  'are electric motorcycles street legal',
  'what electric dirt bikes are street legal',
];
post.readTime = '9 min read';

post.body = `<div class="container prose"><span class="eyebrow">Laws &amp; Registration</span><h1>Street Legal Electric Motorcycle For Sale: What Actually Qualifies</h1><p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">2026-06-29 &middot; Updated 2026-11-23 &middot; 9 min read</p><p class="lead">If you're shopping for a street legal electric motorcycle for sale, most of the e-motos on the market won't qualify &mdash; here's exactly what separates a genuinely road-legal build from an off-highway one, and which models actually clear the bar.</p>

<nav aria-label="Table of contents" class="blog-toc"><p>Contents</p><ol>
<li><a href="#quick-answer">The quick answer</a></li>
<li><a href="#federal-rules">What makes a motorcycle street legal federally</a></li>
<li><a href="#ohv-vs-street">OHV registration vs. street registration</a></li>
<li><a href="#where-to-buy">Where to buy a street legal electric motorcycle for sale</a></li>
<li><a href="#checklist">How to verify a specific model before you buy</a></li>
<li><a href="#which-to-buy">Street-legal vs. off-highway: which should you buy</a></li>
<li><a href="#costs">Registration costs and what's included</a></li>
<li><a href="#mistakes">Common mistakes buyers make</a></li>
<li><a href="#state-rules">It varies by state</a></li>
<li><a href="#faq">Frequently asked questions</a></li>
</ol></nav>

<h2 id="quick-answer">The quick answer</h2><p>Most electric dirt bikes are not street legal, and buying a street legal electric motorcycle for sale means looking specifically for a model built and homologated for road use &mdash; not just one that looks like a motorcycle. The majority of e-motos, including most Sur-Ron and Talaria models, are classified as off-highway vehicles (OHVs) for private land and trail use. A small number of models are purpose-built with the lighting, signaling and documentation a state actually needs to register them for the road, and we'll name exactly which ones below.</p>

<h2 id="federal-rules">What makes a motorcycle street legal federally</h2><p>In the U.S., the <a href="https://www.nhtsa.gov/importing-vehicle/importation-and-certification-faqs" target="_blank" rel="noopener">National Highway Traffic Safety Administration (NHTSA)</a> regulates motor vehicles manufactured primarily for use on public roads under the Federal Motor Vehicle Safety Standards (FMVSS). NHTSA doesn't approve individual bikes one by one &mdash; manufacturers self-certify that an on-road motorcycle meets FMVSS requirements at the point of manufacture. Vehicles built primarily for off-road recreation, like most electric dirt bikes, are not manufactured to meet FMVSS, and bolting on a headlight or turn signals afterward does not retroactively make one compliant. That's the real dividing line: it's decided at manufacture, not by what you add later. Homologation &mdash; the formal certification process &mdash; covers DOT-compliant headlights and taillights, turn signals, a horn, mirrors, a speedometer and a VIN a state can actually register.</p>

<h2 id="ohv-vs-street">OHV registration is not street registration</h2><p>Off-highway vehicles often need their own registration &mdash; commonly an OHV sticker or permit &mdash; to legally use public trail systems and OHV parks, but this is a completely separate process from street registration. California's Green and Red Sticker program, run by <a href="https://ohv.parks.ca.gov/?page_id=26886" target="_blank" rel="noopener">California State Parks' OHMVR Division</a>, is one of the most developed examples: a Green Sticker lets a qualifying OHV ride year-round on designated public OHV land, but it does not put that vehicle on a public road. Don't confuse the two. An OHV sticker gets you onto trail land; a street-legal registration, VIN, title, insurance and the right equipment get you onto the road. Rules, fees and which vehicles qualify differ by state, so always check your own state's program before assuming either path applies to you.</p>

<h2 id="where-to-buy">Where to buy a street legal electric motorcycle for sale</h2><p>A handful of models in our range are genuinely built with a street-legal path, while most are off-highway only &mdash; here's how the current lineup breaks down, and why each one does or doesn't qualify.</p>
<table class="spec-table"><tbody>
<tr><td><strong>Stark Varg EX</strong></td><td>Street-legal enduro variant of the Varg platform, with road-legal registration available in select U.S. regions and roughly 20% more range than the standard MX-focused Stark Varg. See the current <a href="/product/stark-varg-ex-street-legal-enduro/">Stark Varg EX price</a>.</td></tr>
<tr><td><strong>Zero FX</strong></td><td>Zero Motorcycles builds the FX as a dual-sport electric motorcycle with a VIN, DOT-compliant lighting and the equipment most states require for road registration. Check the <a href="/product/zero-fx/">Zero FX electric motorcycle for sale</a> listing.</td></tr>
<tr><td><strong>KTM Freeride E-XC</strong></td><td>An off-highway enduro platform at heart &mdash; check your state's registration path before assuming street legality, since this model is primarily trail-focused. See the <a href="/product/ktm-freeride-e-xc/">KTM Freeride for sale</a> page for full specs.</td></tr>
<tr><td><strong>Talaria Sting R MX4</strong></td><td>An off-highway-only e-moto, popular as a Sur-Ron alternative for trail and private-land riding; not built for street registration. Browse the <a href="/product/talaria-sting-r-mx4/">Talaria MX4 price</a> and specs.</td></tr>
</tbody></table><p>Treat that table as a starting point, not a guarantee &mdash; always confirm the registration path for your exact state before you order, using the checklist below.</p>

<img src="/images/products/stark-varg-ex-street-legal-enduro.webp" alt="Stark Varg EX price and road-legal equipment, a street-legal electric enduro" loading="lazy" />

<h2 id="checklist">How to verify a specific model before you buy</h2><p>Before you buy a street legal electric motorcycle for sale, confirm these four things directly with the manufacturer or your state DMV &mdash; don't rely on marketing copy alone:</p>
<ul>
<li><strong>VIN type.</strong> A genuine street-legal build carries a VIN your state's DMV can register as a motor vehicle, not just a frame or manufacturer serial number.</li>
<li><strong>Required equipment.</strong> DOT-compliant headlight and taillight, turn signals, a horn, mirrors and a speedometer, installed from the factory, not added after delivery.</li>
<li><strong>State-specific registration path.</strong> Some states register certain enduro-class e-motos; others don't accept any off-highway-manufactured vehicle regardless of equipment added later.</li>
<li><strong>Insurance eligibility.</strong> Confirm an insurer will actually write a policy for the specific VIN and classification before you ride on public roads.</li>
</ul><p>If a listing can't answer all four of these clearly, assume the model is off-highway only until you've confirmed otherwise with the manufacturer directly.</p>

<h2 id="which-to-buy">Street-legal vs. off-highway: which should you buy</h2><p>The right answer depends entirely on where and how you plan to ride, not on which bike looks faster in photos. If you need to commute on public roads, run errands, or ride between trail systems that aren't directly connected by private land, a genuine street-legal build like the Stark Varg EX or a Zero electric motorcycle is the only option that keeps you legal the whole way. The trade-off is usually price and, in some cases, outright weight: the extra equipment a road-legal build needs &mdash; lighting, signaling, a VIN-capable frame, speedometer &mdash; adds cost and mass that a purpose-built trail bike doesn't carry.</p><p>If your riding stays entirely on private land, a motocross track, or OHV-designated trail systems, an off-highway-only model like the KTM Freeride E-XC or Talaria Sting R MX4 is usually the better value: lighter, simpler, and built specifically for trail performance rather than road compliance. Just remember that off-highway status doesn't mean no paperwork &mdash; most states still want an OHV sticker or permit before you ride even on designated trail land, so budget for that registration regardless of which category you choose. Mixing the two use cases is where most buyers get into trouble: don't assume an off-highway bike becomes road-legal just because you only plan to cross a short stretch of public road to reach the trailhead. That short stretch is exactly where most citations happen.</p>

<img src="/images/products/zero-fx.webp" alt="Zero FX electric motorcycle for sale, built with a road-legal VIN and lighting" loading="lazy" />

<h2 id="costs">Registration costs and what's included</h2><p>Costs vary by state and by registration type. California's OHV Green Sticker program, for example, currently runs a two-year registration fee around $54 per vehicle, which funds OHV area development, enforcement and trail maintenance &mdash; separate from any street registration fee a road-legal model would also need. Budget for both the vehicle's registration and liability insurance before you ride; a street-legal e-moto is not exempt from the insurance requirements that apply to any registered motorcycle, and skipping insurance to save money is one of the fastest ways to lose the registration altogether if you're ever in an incident.</p>

<h2 id="mistakes">Common mistakes buyers make</h2><p>The most common mistake is assuming a bike is street legal because it resembles a small motorcycle, or because it's quiet enough not to draw attention. Riding an unregistered off-highway electric dirt bike on a public road can result in a citation, a fine, or the vehicle being impounded, the same enforcement that applies to any unregistered off-road vehicle, electric or gas. A second common mistake is buying first and asking about registration later &mdash; always confirm your state's rules before you order if street-legal capability is a requirement, not a nice-to-have. A third is assuming one state's rules apply everywhere; OHV and street-registration programs are run state by state, and a model that registers cleanly in one state may not qualify in another.</p>

<h2 id="state-rules">It varies by state</h2><p>OHV rules, trail access and any path to street registration differ from state to state, and sometimes county to county. Always confirm your state and local regulations before you ride, and never assume a bike is road-legal just because it looks like a motorcycle. If street-legal capability matters to you, look specifically for models marketed and documented as street-legal, like the Stark Varg EX, and confirm the registration path with your state DMV before you buy.</p><p>Stark Future's own unveiling film for the Varg EX walks through exactly which road-legal equipment ships standard on the bike, including the headlight, indicators, switchgear and battery configuration that make the road-legal build possible:</p><p><a href="https://www.youtube.com/watch?v=c34vyuCp8A0" target="_blank" rel="noopener">VARG EX: Stark's Road-Legal Enduro Bike Unveiled</a> &mdash; official Stark Future channel.</p>

<div class="related-products"><a href="/product/stark-varg-ex-street-legal-enduro/" class="card-soft">Stark Varg EX</a><a href="/product/zero-fx/" class="card-soft">Zero FX</a><a href="/product/ktm-freeride-e-xc/" class="card-soft">KTM Freeride E-XC</a><a href="/product/talaria-sting-r-mx4/" class="card-soft">Talaria Sting R MX4</a></div><p>Browse the full <a href="/shop/adult-electric-dirt-bikes/">adult electric dirt bikes</a> range, or get in touch if you need help confirming which model fits a street-legal use case in your state.</p>

<h2 id="faq-heading">Frequently asked questions</h2><p>Also worth reading: our breakdown of <a href="/blog/street-legal-electric-motorcycles-vs-off-road-only-models/">street-legal electric motorcycles vs. off-road-only models</a>, and our <a href="/blog/how-to-buy-an-electric-dirt-bike-online-ordering-guide/">guide to ordering an electric dirt bike online</a> once you've confirmed which category fits your state.</p>

<h2>Keep reading</h2><p>Next up: <a href="/blog/electric-dirt-bikes-for-kids-guide/">Electric Dirt Bikes for Kids: A Parent&#x27;s Safety &amp; Sizing Guide</a>. Or browse the full <a href="/shop/">collection</a>.</p><div style="margin-top:2rem"><a class="btn-primary" href="/shop/">Shop electric dirt bikes</a></div></div>`;

post.faqs = [
  {
    q: 'Is there a genuine street legal electric motorcycle for sale right now?',
    a: 'Yes. A small number of models, including the Stark Varg EX and certain Zero electric motorcycles, are built from the factory with the VIN, lighting and equipment most U.S. states require to register a motor vehicle for the road. Most electric dirt bikes on the market are off-highway only.',
  },
  {
    q: 'Are electric dirt bikes street legal in the U.S.?',
    a: "Most are not. The majority of e-motos are classified as off-highway vehicles (OHVs) built for private land and trail use, not FMVSS-certified for public roads. It's the manufacturing classification, not the fact they're electric, that keeps them off the street.",
  },
  {
    q: 'What is the difference between OHV registration and street registration?',
    a: "OHV registration, like California's Green Sticker, lets a qualifying off-highway vehicle ride on designated public trail land. It is a separate process from street registration, which requires a road-legal VIN, DOT-compliant equipment, insurance and a motorcycle license or endorsement.",
  },
  {
    q: 'Can I make an off-highway electric dirt bike street legal by adding lights?',
    a: 'Generally no. Street-legal certification is decided at manufacture under Federal Motor Vehicle Safety Standards. Bolting on a headlight, mirrors or turn signals after purchase does not retroactively make an off-highway-manufactured bike FMVSS-compliant or eligible for street registration in most states.',
  },
  {
    q: 'What happens if I ride an unregistered electric dirt bike on a public road?',
    a: 'You risk a citation, a fine, or having the vehicle impounded, the same enforcement that applies to any unregistered off-road vehicle on a public road. A quiet electric motor does not reduce the legal exposure if you are stopped.',
  },
];

const dupes = post.supportingKeywords.filter((k, i) => post.supportingKeywords.indexOf(k) !== i);
if (dupes.length) throw new Error('duplicate supporting keywords: ' + dupes);
if (post.supportingKeywords.length !== 5) throw new Error('supportingKeywords must be 5');
const tagDupes = post.tags.filter((k, i) => post.tags.indexOf(k) !== i);
if (tagDupes.length) throw new Error('duplicate tags: ' + tagDupes);
if (post.tags.length !== 10) throw new Error('tags must be 10');

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log('Post 1 rewritten: are-electric-dirt-bikes-street-legal');

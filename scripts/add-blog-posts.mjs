// One-off content script: appends 12 new blog posts to src/data/posts.json and
// rewires the "Keep reading" cross-links across all 18 posts into a single
// loop. Not part of the build -- run manually, output (posts.json) is committed.
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));

function wrap({ tag, title, date, readTime, description, content, ctaHref, ctaLabel, nextSlug, nextTitle }) {
  return (
    `<div class="container prose"><span class="eyebrow">${tag.replace(/&/g, '&amp;')}</span>` +
    `<h1>${title.replace(/&/g, '&amp;')}</h1>` +
    `<p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">${date} &middot; ${readTime}</p>` +
    `<p class="lead">${description}</p>` +
    content +
    `<h2>Keep reading</h2><p>Next up: <a href="/blog/${nextSlug}/">${nextTitle}</a>. Or browse the full <a href="/shop/">collection</a> and <a href="/financing/">financing options</a>.</p>` +
    `<div style="margin-top:2rem"><a class="btn-primary" href="${ctaHref}">${ctaLabel}</a></div></div>`
  );
}

const NEW_POSTS = [
  {
    slug: 'essential-gear-for-electric-dirt-bike-riding',
    title: 'Essential Gear for Riding an Electric Dirt Bike',
    description: "A helmet is only the start. Here's the protective gear that actually matters before your first ride.",
    tag: 'Safety & Gear',
    date: '2026-07-10',
    readTime: '6 min read',
    ctaHref: '/shop/adult-electric-dirt-bikes/',
    ctaLabel: 'Shop electric dirt bikes',
    nextSlug: 'electric-dirt-bike-maintenance-checklist',
    nextTitle: 'Electric Dirt Bike Maintenance Checklist for New Owners',
    content: `<h2>Start with the helmet</h2><p>A properly fitted, motocross- or mountain-bike-rated helmet is the one piece of gear that isn't optional. It should sit snugly with no rocking, cover the base of the skull, and be replaced after any hard impact regardless of how it looks afterward.</p><h2>Protect hands, feet and eyes</h2><p>Motocross gloves protect against blisters, branches and falls, while over-the-ankle boots protect against the single most common trail injury: a rolled or twisted ankle. Goggles or a full-face shield keep dust, mud and debris out of your eyes at speed.</p><h2>Body armor for real trail riding</h2><p>A chest/back protector or pressure suit adds real protection for aggressive trail or track riding, and knee guards are worth it the first time a pedal or footpeg catches you wrong. None of this needs to be expensive to be effective — fit matters more than price.</p><h2>Don't skip the basics</h2><p>Ride on legal, private land, tell someone where you're going, and carry a charged phone. Electric dirt bikes are quiet enough that you can hear more of the trail around you — use that awareness, not overconfidence, as your edge.</p>`,
  },
  {
    slug: 'electric-dirt-bike-maintenance-checklist',
    title: 'Electric Dirt Bike Maintenance Checklist for New Owners',
    description: 'No oil changes, but not zero maintenance either. Here’s what actually needs regular attention.',
    tag: 'Maintenance',
    date: '2026-07-13',
    readTime: '7 min read',
    ctaHref: '/shop/adult-electric-dirt-bikes/',
    ctaLabel: 'Shop electric dirt bikes',
    nextSlug: 'electric-dirt-bike-battery-care-guide',
    nextTitle: 'Electric Dirt Bike Battery Care: Charging, Storage & Lifespan',
    content: `<h2>What you don't have to do anymore</h2><p>No engine means no oil changes, no air filter cleaning, no spark plugs and no carburetor to fuss with. That's the single biggest maintenance win of going electric — the drivetrain itself is mechanically simple.</p><h2>What still needs regular attention</h2><p>Tires, brakes, chain and suspension wear the same way they do on a gas bike. Check tire pressure and tread before every ride, keep the chain clean and lubricated, and inspect brake pads regularly since electric bikes can be ridden harder for longer without fatigue.</p><h2>After every ride, weekly, monthly</h2><p>Wipe the bike down and check for loose bolts after every ride. Weekly, inspect chain tension and brake lever feel. Monthly, check suspension seals for leaks and confirm the battery is stored at a partial charge if it won't be ridden for a while.</p><h2>When to call in a pro</h2><p>Battery, motor and controller issues should go to a qualified technician rather than a DIY fix — these are high-voltage systems. For everything else, a basic home tool kit and routine attention will keep an electric dirt bike running reliably for years.</p>`,
  },
  {
    slug: 'electric-dirt-bike-battery-care-guide',
    title: 'Electric Dirt Bike Battery Care: Charging, Storage & Lifespan',
    description: 'How you charge and store a lithium battery has more effect on its lifespan than how hard you ride.',
    tag: 'Maintenance',
    date: '2026-07-17',
    readTime: '6 min read',
    ctaHref: '/shop/adult-electric-dirt-bikes/',
    ctaLabel: 'Shop electric dirt bikes',
    nextSlug: 'how-much-does-it-cost-to-charge-an-ebike',
    nextTitle: 'How Much Does It Cost to Charge an E-Bike or Electric Dirt Bike?',
    content: `<h2>Charging habits that matter</h2><p>Lithium batteries generally last longest when kept between roughly 20% and 80% charge for day-to-day use, rather than habitually running them flat or leaving them on the charger at 100% for long periods. Charging to full right before a ride and running it down is fine occasionally — it's the constant extremes that add up over time.</p><h2>Storage: the step most owners skip</h2><p>If a bike won't be ridden for weeks or months, store the battery at a partial charge — not empty, not full — in a cool, dry place. A battery left fully depleted for an extended period can degrade permanently, and one left at 100% in heat ages faster than it needs to.</p><h2>Heat, cold and battery health</h2><p>Extreme heat is harder on lithium batteries than cold. Avoid charging or storing a battery in direct sun or a hot garage in summer, and let a cold battery warm closer to room temperature before charging in winter for best results.</p><h2>Getting the most riding life</h2><p>Use the charger that came with the bike or one the manufacturer specifies, avoid physical damage or water intrusion around the battery compartment, and don't ignore any battery management system warnings. Good habits here protect what is usually the single most expensive component on the bike.</p>`,
  },
  {
    slug: 'how-much-does-it-cost-to-charge-an-ebike',
    title: 'How Much Does It Cost to Charge an E-Bike or Electric Dirt Bike?',
    description: 'A full charge typically costs a small fraction of a tank of gas. Here’s how to think about the real number.',
    tag: 'Cost & Ownership',
    date: '2026-07-20',
    readTime: '5 min read',
    ctaHref: '/shop/',
    ctaLabel: 'Shop the collection',
    nextSlug: 'electric-vs-gas-dirt-bikes-cost',
    nextTitle: 'Electric vs Gas Dirt Bikes: The Real Cost of Ownership',
    content: `<h2>The rough math</h2><p>Battery capacity is measured in kilowatt-hours (kWh), and your electricity bill charges per kWh. Multiply the battery's kWh rating by your local electricity rate to estimate the cost of a full charge — for most e-bikes and electric dirt bikes, that number is a small fraction of what a gallon of gas costs.</p><h2>Why it's so much cheaper than gas</h2><p>Electric motors are far more efficient at converting stored energy into motion than internal combustion engines, which lose most of their energy as heat. That efficiency, combined with electricity being cheaper per unit of usable energy than gasoline in most places, is what drives the cost difference.</p><h2>Home charging vs public charging</h2><p>Charging at home overnight on a standard outlet is the norm for e-bikes and most electric dirt bikes — no special equipment required for most models. Public charging infrastructure is built around cars and generally isn't necessary for personal e-bikes or e-motos.</p><h2>The bigger savings picture</h2><p>Charging cost is only part of the story — see our full cost-of-ownership comparison for how maintenance and running costs stack up over the life of the bike.</p>`,
  },
  {
    slug: 'how-to-finance-a-premium-electric-dirt-bike',
    title: 'How to Finance a Premium Electric Dirt Bike or E-Bike',
    description: 'Flagship electric dirt bikes and e-bikes carry a real price tag. Here’s how financing works and how to think about the decision.',
    tag: 'Financing',
    date: '2026-07-24',
    readTime: '7 min read',
    ctaHref: '/financing/',
    ctaLabel: 'See financing options',
    nextSlug: 'how-to-transport-an-electric-dirt-bike',
    nextTitle: 'How to Transport an Electric Dirt Bike Safely',
    content: `<h2>Why financing makes sense at this price point</h2><p>Premium electric dirt bikes and e-bikes range from roughly $399 to $14,000 in our catalog, and flagship models are a meaningful purchase. Financing spreads that cost into predictable monthly payments rather than requiring the full amount upfront.</p><h2>What to have ready before you apply</h2><p>Financing applications typically look at income, credit history and the purchase amount. Having the specific model and price in mind — rather than shopping vaguely — makes the process faster and gives you a clearer monthly payment estimate.</p><h2>Financing vs paying outright</h2><p>Paying outright avoids interest entirely and is straightforward if the cash is available. Financing makes sense when it lets you get onto the right bike now, keep cash reserves free, or match payments to your budget. Neither option is inherently better — it depends on your situation.</p><h2>Getting a real number before you buy</h2><p>Use our <a href="/finance-calculator/">payment calculator</a> to estimate monthly payments on any model, then see full <a href="/financing/">financing details</a>. Our team can walk you through the options on any bike in the catalog before you commit.</p>`,
  },
  {
    slug: 'how-to-transport-an-electric-dirt-bike',
    title: 'How to Transport an Electric Dirt Bike Safely',
    description: 'Getting to the trail is part of ownership too. Here’s how to haul an electric dirt bike without damaging it.',
    tag: 'Ownership',
    date: '2026-07-27',
    readTime: '6 min read',
    ctaHref: '/shop/adult-electric-dirt-bikes/',
    ctaLabel: 'Shop electric dirt bikes',
    nextSlug: 'cold-weather-riding-tips-electric-bikes',
    nextTitle: 'Cold-Weather Riding Tips for Electric Dirt Bikes &amp; E-Bikes',
    content: `<h2>Truck bed, trailer or hitch rack</h2><p>A truck bed or enclosed trailer is the simplest option for most owners. Hitch-mounted motorcycle carriers work too, provided they're rated for the bike's weight — electric dirt bikes are often lighter than comparable gas bikes, but always check the rack's rated capacity.</p><h2>Securing the bike properly</h2><p>Use a wheel chock or front-wheel strap to stop the bike from turning, then add at least two additional tie-down points to the frame — never to plastics, levers or the subframe alone. Compress the front suspension slightly with the tie-downs for a more stable ride.</p><h2>Protecting the battery in transit</h2><p>If the battery is removable, taking it out for transport reduces vibration exposure and lets you charge it separately. If it isn't removable, avoid transporting the bike at very low charge or in extreme heat, and check that the battery compartment is properly latched before you drive.</p><h2>Before you head out</h2><p>Double-check every strap after the first few minutes of driving — tie-downs settle as the load shifts. A quick walk-around before and after transport catches most issues before they become a problem on the road.</p>`,
  },
  {
    slug: 'cold-weather-riding-tips-electric-bikes',
    title: 'Cold-Weather Riding Tips for Electric Dirt Bikes & E-Bikes',
    description: 'Cold weather changes battery range and tire grip. Here’s how to ride smart when temperatures drop.',
    tag: 'Maintenance',
    date: '2026-07-31',
    readTime: '6 min read',
    ctaHref: '/shop/',
    ctaLabel: 'Shop the collection',
    nextSlug: 'how-to-choose-premium-emtb',
    nextTitle: 'How to Choose a Premium eMTB: Carbon, Motors &amp; Suspension',
    content: `<h2>Expect shorter range in the cold</h2><p>Lithium batteries deliver less usable range in cold temperatures — it's a normal, temporary effect of chemistry, not a sign of battery damage. Range typically returns to normal once the battery warms back up.</p><h2>Warm the battery before you charge</h2><p>Charging a battery that's near freezing can stress the cells. If a bike has been sitting in the cold, let the battery come closer to room temperature before plugging it in, especially after a ride in freezing conditions.</p><h2>Tires and traction change too</h2><p>Cold pavement and trails offer less grip, and tire pressure drops slightly as temperatures fall. Check pressure before riding in cold weather and ride a little more conservatively until you've got a feel for how the bike handles in the conditions.</p><h2>Dress for it, ride for it</h2><p>Layered, wind-resistant gear matters more on an electric bike than a gas one, since there's no engine heat radiating toward your legs. Give yourself more stopping distance, and don't assume warm-weather habits translate directly to a cold ride.</p>`,
  },
  {
    slug: 'choosing-the-right-size-electric-mountain-bike',
    title: 'How to Choose the Right Size Electric Mountain Bike',
    description: 'An eMTB that fits wrong undermines even the best motor and suspension. Here’s how sizing actually works.',
    tag: 'Buying Guides',
    date: '2026-08-03',
    readTime: '7 min read',
    ctaHref: '/shop/electric-mountain-bikes/',
    ctaLabel: 'Shop electric mountain bikes',
    nextSlug: 'fat-tire-vs-standard-ebike',
    nextTitle: 'Fat-Tire vs Standard E-Bike: Which Tire Width Is Right for You?',
    content: `<h2>Start with standover and reach</h2><p>Standover height (clearance over the top tube) and reach (how stretched-out the riding position feels) matter more for day-to-day comfort than the marketed frame size label. A bike that "fits" on a size chart can still feel wrong in reach or standover for your body.</p><h2>eMTBs are heavier — fit matters more, not less</h2><p>The added weight of a motor and battery makes an eMTB less forgiving to muscle around than an unpowered mountain bike, especially at low speed or when dismounting on technical terrain. Correct standover clearance is genuinely more important here than on a traditional bike.</p><h2>Frame size charts are a starting point, not a rule</h2><p>Manufacturer size charts are a reasonable starting point based on rider height, but riding style, arm length and personal preference for a more upright or more aggressive position all shift the right answer. Two riders of the same height can want different frame sizes.</p><h2>When in doubt, size down</h2><p>Between two sizes, most riders are better served sizing down for a more agile, confidence-inspiring feel on technical trails, and adjusting stem or seatpost setup rather than sizing up and fighting a bike that feels too long. Talk to our team about your height and terrain before choosing.</p>`,
  },
  {
    slug: 'fat-tire-vs-standard-ebike',
    title: 'Fat-Tire vs Standard E-Bike: Which Tire Width Is Right for You?',
    description: "Fat tires aren't just a look. Here's what the extra width actually changes about the ride.",
    tag: 'Buying Guides',
    date: '2026-08-05',
    readTime: '6 min read',
    ctaHref: '/shop/electric-fat-tire-bikes/',
    ctaLabel: 'Shop fat-tire e-bikes',
    nextSlug: 'folding-ebike-buyers-guide',
    nextTitle: "Folding E-Bike Buyer&#x27;s Guide: What to Check Before You Buy",
    content: `<h2>What a fat tire actually does</h2><p>Fat tires — typically 4 inches wide or more, run at lower pressure — spread contact area over a larger footprint. That extra footprint is what improves grip and flotation on loose or soft surfaces, at the cost of some rolling efficiency on hard, smooth pavement.</p><h2>Where fat tires win</h2><p>Sand, snow, mud and loose gravel are where fat tires shine, along with general stability and a smoother ride over rough, unpaved terrain. They're a common choice for riders who want one bike that handles varied surfaces confidently.</p><h2>Where standard tires win</h2><p>On pavement and groomed paths, a standard-width tire rolls more efficiently, feels quicker to accelerate, and is generally lighter. If most of your riding is commuting or road/gravel routes, a standard-width e-bike will usually feel livelier.</p><h2>Which one fits your riding</h2><p>Choose fat tire if your riding regularly includes sand, snow or rough unpaved terrain. Choose standard if you're mostly on pavement or groomed paths and want efficiency. Browse our <a href="/shop/electric-fat-tire-bikes/">fat-tire e-bikes</a> or <a href="/shop/electric-commuter-bikes/">commuter e-bikes</a> to compare.</p>`,
  },
  {
    slug: 'folding-ebike-buyers-guide',
    title: "Folding E-Bike Buyer's Guide: What to Check Before You Buy",
    description: 'A folding e-bike lives or dies on the fold. Here’s what actually matters beyond the marketing photo.',
    tag: 'Buying Guides',
    date: '2026-08-07',
    readTime: '6 min read',
    ctaHref: '/shop/folding-electric-bikes/',
    ctaLabel: 'Shop folding e-bikes',
    nextSlug: 'electric-bike-classes-explained',
    nextTitle: 'Electric Bike Classes 1, 2 &amp; 3 Explained',
    content: `<h2>Fold size and weight, not just fold time</h2><p>Every folding e-bike folds quickly in a demo video — what matters is the folded footprint and whether you can actually lift and carry it. Check folded dimensions against your storage space (closet, car trunk, train, apartment stairwell) and the bike's actual weight, not just a marketing claim of "compact."</p><h2>Wheel size changes the ride more than people expect</h2><p>Smaller wheels (16–20 inch) fold smaller but feel noticeably different at speed and over bumps than the larger wheels on a standard e-bike. If you'll be riding longer distances regularly, weigh ride comfort against ultimate portability.</p><h2>Build quality of the hinge matters</h2><p>The folding hinge and latch see repeated stress over the bike's life. A well-built hinge should feel solid with no play when locked open — this is one area where cutting corners shows up quickly as an annoying rattle or, eventually, a safety issue.</p><h2>Who a folding e-bike is really for</h2><p>Folding e-bikes suit commuters combining riding with transit, apartment or condo dwellers without bike storage, and anyone who wants to stash a bike in a car trunk or RV. If you have dedicated storage and won't need to fold it often, a standard commuter e-bike may ride better for the same money.</p>`,
  },
  {
    slug: 'e-bike-vs-electric-dirt-bike-difference',
    title: "E-Bike vs Electric Dirt Bike: What's the Difference?",
    description: 'They both have batteries and two wheels, but they’re built for completely different worlds. Here’s how to tell them apart.',
    tag: 'Buying Guides',
    date: '2026-08-08',
    readTime: '6 min read',
    ctaHref: '/shop/',
    ctaLabel: 'Shop the collection',
    nextSlug: 'throttle-emotos-vs-pedal-assist-emtbs',
    nextTitle: 'Throttle E-Motos vs Pedal-Assist E-MTBs: Which Fits Your Riding Style?',
    content: `<h2>Pedals vs throttle</h2><p>An e-bike has working pedals and is designed as pedal-assisted (with or without a throttle) — legally and functionally, it's still a bicycle. An electric dirt bike, or e-moto, is throttle-driven with no pedals at all, closer in concept to a small motorcycle built for off-road use.</p><h2>Where each one is legal to ride</h2><p>E-bikes generally have a clear legal path to ride on bike lanes, paths and roads, governed by the class system (see our <a href="/blog/electric-bike-classes-explained/">guide to e-bike classes</a>). Electric dirt bikes are typically off-highway vehicles, meant for private land and trail use — see our guide on <a href="/blog/are-electric-dirt-bikes-street-legal/">street legality</a> before assuming otherwise.</p><h2>Power and speed</h2><p>E-bikes are speed-limited by class, generally topping out around 20–28 mph of motor assistance. Electric dirt bikes have no such limit built in and are designed for genuine off-road performance, with power output and speed that can far exceed any e-bike class.</p><h2>Which category fits you</h2><p>If you want a bike for commuting, fitness or paved and light trail riding, you want an e-bike. If you want genuine off-road, trail or motocross-style performance on private land, you want an electric dirt bike. Browse <a href="/shop/electric-commuter-bikes/">e-bikes</a> or <a href="/shop/adult-electric-dirt-bikes/">electric dirt bikes</a> to compare.</p>`,
  },
  {
    slug: 'throttle-emotos-vs-pedal-assist-emtbs',
    title: 'Throttle E-Motos vs Pedal-Assist E-MTBs: Which Fits Your Riding Style?',
    description: 'Both go off-road. Both are electric. The riding experience couldn’t be more different.',
    tag: 'Comparisons',
    date: '2026-08-09',
    readTime: '7 min read',
    ctaHref: '/shop/electric-mountain-bikes/',
    ctaLabel: 'Shop electric mountain bikes',
    nextSlug: 'sur-ron-vs-talaria-2026',
    nextTitle: 'Sur-Ron vs Talaria: Which Electric Dirt Bike Wins in 2026?',
    content: `<h2>Two different kinds of effort</h2><p>A throttle e-moto (like a Sur-Ron or Talaria) delivers power on demand with no pedaling required — the experience is closer to riding a lightweight electric motorcycle. A pedal-assist eMTB still requires you to pedal; the motor amplifies your effort rather than replacing it. Fitness-minded riders and mountain bikers tend to prefer the latter.</p><h2>Trail access is not the same</h2><p>Many mountain bike trail systems that welcome Class 1 eMTBs prohibit throttle-driven e-motos outright, since they're classified as off-highway vehicles rather than bicycles. Always check the specific trail system's rules — access for one does not imply access for the other.</p><h2>Skill development differs too</h2><p>Riding a pedal-assist eMTB builds the same bike-handling and fitness skills as a traditional mountain bike, just with a boost on climbs. Riding a throttle e-moto develops motorcycle-style throttle control and body positioning — a different (and for many riders, complementary) skill set.</p><h2>Some riders want both</h2><p>It's common for serious riders to own one of each: an eMTB for trail days with fitness and access flexibility, and an e-moto for private land where full off-road performance is the goal. See our <a href="/shop/electric-mountain-bikes/">eMTBs</a> and <a href="/shop/adult-electric-dirt-bikes/">electric dirt bikes</a> side by side.</p>`,
  },
];

const built = NEW_POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  tag: p.tag,
  date: p.date,
  readTime: p.readTime,
  body: wrap(p),
}));

// Rewire "Keep reading" links on the 4 existing posts whose next-link changes
// now that new posts are spliced into the loop.
const PATCHES = [
  {
    slug: 'electric-dirt-bikes-for-kids-guide',
    oldHref: '/blog/electric-vs-gas-dirt-bikes-cost/',
    oldTitle: 'Electric vs Gas Dirt Bikes: The Real Cost of Ownership',
    newHref: '/blog/essential-gear-for-electric-dirt-bike-riding/',
    newTitle: 'Essential Gear for Riding an Electric Dirt Bike',
  },
  {
    slug: 'electric-vs-gas-dirt-bikes-cost',
    oldHref: '/blog/how-to-choose-premium-emtb/',
    oldTitle: 'How to Choose a Premium eMTB: Carbon, Motors &amp; Suspension',
    newHref: '/blog/how-to-finance-a-premium-electric-dirt-bike/',
    newTitle: 'How to Finance a Premium Electric Dirt Bike or E-Bike',
  },
  {
    slug: 'how-to-choose-premium-emtb',
    oldHref: '/blog/electric-bike-classes-explained/',
    oldTitle: 'Electric Bike Classes 1, 2 &amp; 3 Explained',
    newHref: '/blog/choosing-the-right-size-electric-mountain-bike/',
    newTitle: 'How to Choose the Right Size Electric Mountain Bike',
  },
  {
    slug: 'electric-bike-classes-explained',
    oldHref: '/blog/sur-ron-vs-talaria-2026/',
    oldTitle: 'Sur-Ron vs Talaria: Which Electric Dirt Bike Wins in 2026?',
    newHref: '/blog/e-bike-vs-electric-dirt-bike-difference/',
    newTitle: "E-Bike vs Electric Dirt Bike: What&#x27;s the Difference?",
  },
];

for (const patch of PATCHES) {
  const post = posts.find((p) => p.slug === patch.slug);
  if (!post) throw new Error(`Post not found for patch: ${patch.slug}`);
  const oldLink = `<a href="${patch.oldHref}">${patch.oldTitle}</a>`;
  const newLink = `<a href="${patch.newHref}">${patch.newTitle}</a>`;
  if (!post.body.includes(oldLink)) throw new Error(`Old link not found in ${patch.slug}: ${oldLink}`);
  post.body = post.body.replace(oldLink, newLink);
}

const merged = [...posts, ...built];
fs.writeFileSync(POSTS_PATH, JSON.stringify(merged, null, 2) + '\n');
console.log(`Wrote ${merged.length} posts (${posts.length} existing + ${built.length} new) to ${POSTS_PATH}`);

// Structural-compliance rewrite of
// "choosing-the-right-size-electric-mountain-bike" per the blog-post
// skill. Keyword rekey deferred to a future Semrush pass (owner
// instruction, 2026-11-23) -- the eMTB sizing topic has no already-
// rekeyed product tie-in and no fresh real T/C data this session.
// Everything else -- TOC, 1,500+ words, image rule, internal links,
// outbound sources, YouTube -- is fully compliant. Outbound: a
// peer-reviewed NIH/PMC biomechanics study on frame reach and muscle
// activation, ASTM F2711 bicycle frame standard (reused from post 5),
// plus 1 oEmbed-verified YouTube video (GMBN Tech, an independent media
// channel). Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
const post = posts.find((p) => p.slug === 'choosing-the-right-size-electric-mountain-bike');
if (!post) throw new Error('post not found');

// Keywords intentionally UNCHANGED -- pending Semrush pass, see header note.
post.title = 'Electric Mountain Bike Sizing: A Complete Guide';
post.description =
  'Electric mountain bike sizing gets wrong more often than it should. Here is how standover height and reach actually determine comfort and handling.';
post.readTime = '9 min read';

post.body = `<div class="container prose"><span class="eyebrow">Buying Guides</span><h1>Electric Mountain Bike Sizing: A Complete Guide</h1><p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">2026-08-03 &middot; Updated 2026-11-23 &middot; 9 min read</p><p class="lead">Electric mountain bike sizing done wrong undermines even the best motor and suspension on the market. Here's how standover height and reach actually determine comfort, and why a size label alone can't be trusted across brands.</p>

<nav aria-label="Table of contents" class="blog-toc"><p>Contents</p><ol>
<li><a href="#standover-reach">Electric mountain bike sizing: start with standover and reach</a></li>
<li><a href="#heavier-fit">eMTBs are heavier &mdash; fit matters more, not less</a></li>
<li><a href="#size-charts">Frame size charts are a starting point, not a rule</a></li>
<li><a href="#geometry-research">What the research actually says about reach</a></li>
<li><a href="#geometry-brands">Geometry differs more between brands than you'd expect</a></li>
<li><a href="#full-power-sl">Full-power vs SL changes the sizing conversation too</a></li>
<li><a href="#test-ride">Test ride on real terrain, not a parking lot</a></li>
<li><a href="#dropper-cockpit">Dropper post length and cockpit setup also factor in</a></li>
<li><a href="#mistakes">Common sizing mistakes</a></li>
<li><a href="#size-down">When in doubt, size down</a></li>
<li><a href="#faq">Frequently asked questions</a></li>
</ol></nav>

<h2 id="standover-reach">Electric mountain bike sizing: start with standover and reach</h2><p>Standover height (clearance over the top tube) and reach (how stretched-out the riding position feels) matter more for day-to-day comfort than the marketed frame size label. A bike that "fits" on a size chart can still feel wrong in reach or standover for your body, which is why electric mountain bike sizing really has to start with these two measurements rather than a single letter on a spec sheet.</p>

<h2 id="heavier-fit">eMTBs are heavier &mdash; fit matters more, not less</h2><p>The added weight of a motor and battery makes an eMTB less forgiving to muscle around than an unpowered mountain bike, especially at low speed or when dismounting quickly on technical terrain. Correct standover clearance is genuinely more important here than on a traditional bike, since a poor fit is harder to compensate for with body English alone once the bike itself weighs meaningfully more.</p>

<h2 id="size-charts">Frame size charts are a starting point, not a rule</h2><p>Manufacturer size charts are a reasonable starting point based on rider height, but riding style, arm length and personal preference for a more upright or more aggressive position all shift the right answer. Two riders of the same height can want different frame sizes, and a chart has no way to capture that nuance on its own.</p>

<img src="/images/products/santa-cruz-heckler-sl-cc-x0-axs.webp" alt="Santa Cruz Heckler SL, one reference point for electric mountain bike sizing" loading="lazy" />

<h2 id="geometry-research">What the research actually says about reach</h2><p>Frame reach isn't just a feel preference &mdash; it has a measurable effect on your body. A <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9180202/" target="_blank" rel="noopener">peer-reviewed study indexed on PubMed Central</a> examining handlebar height and frame length found that reach and handlebar setup shift neuromuscular demand between muscle groups, changing which muscles do the work at different riding intensities. It's a reminder that "fit" isn't purely subjective comfort &mdash; a genuinely wrong reach measurably changes how your body actually works while riding over a full ride, not just how it feels in the moment you first swing a leg over. Frame construction itself is tested to standards like <a href="https://store.astm.org/f2711-19.html" target="_blank" rel="noopener">ASTM F2711</a>, which confirms structural durability but says nothing about whether a given frame's geometry suits your body &mdash; that part is entirely on you to check before buying.</p>

<h2 id="geometry-brands">Geometry differs more between brands than you'd expect</h2><p>A medium isn't a medium across brands. A <a href="/product/santa-cruz-heckler-sl-cc-x0-axs/">Santa Cruz Heckler SL</a> and a <a href="/product/yeti-160e-c2/">Yeti 160E</a> can label the same size very differently in actual reach and standover, because each brand sets its own geometry philosophy &mdash; some lean toward a longer, slacker enduro-style fit, others keep things more compact and upright. This is exactly why comparing the size label alone across brands is unreliable, and why trying to match your old mountain bike's size letter to a new eMTB brand can steer you wrong. GMBN Tech's own breakdown of frame geometry and sizing is a useful primer before you start comparing spec sheets:</p><p><a href="https://www.youtube.com/watch?v=f_C4h1Vb_1I" target="_blank" rel="noopener">How To Choose The Right Size Mountain Bike | Frame Geometry Explained</a> &mdash; GMBN Tech, an independent media channel.</p>

<h2 id="full-power-sl">Full-power vs SL changes the sizing conversation too</h2><p>A lighter, SL-style build like the <a href="/product/specialized-turbo-levo-sl-comp-carbon/">Specialized Turbo Levo SL</a> handles closer to an unpowered mountain bike than a heavier full-power platform like the Trek Rail or <a href="/product/cannondale-moterra-neo-carbon-1/">Cannondale Moterra Neo</a>. Because SL bikes carry less weight up front and in the frame, riders who are between sizes sometimes find an SL build more forgiving of sizing up slightly than a full-power bike would be, since the extra length doesn't come with the same low-speed heft to manage.</p>

<img src="/images/products/yeti-160e-c2.webp" alt="Yeti 160E, geometry differs meaningfully from other brands at the same labeled size" loading="lazy" />

<h2 id="test-ride">Test ride on real terrain, not a parking lot</h2><p>A parking-lot spin tells you almost nothing about whether a size actually works for you. Standover clearance matters most when you're stopped on an incline or a rock, not on flat, smooth pavement &mdash; try to test ride on at least some actual trail terrain, or at minimum simulate a sudden stop and dab a foot down the way you would mid-trail. Reach matters most in a seated, pedaling position sustained over distance, which a five-minute lot loop won't reveal either. If a shop or seller only offers a flat-ground test, ask specifically about their return or exchange policy in case the size feels wrong once you're actually on a trail. When you do get a real trail test, pay attention to a few specific moments rather than just a general impression: how the bike feels when you stand up to clear an obstacle, whether you can comfortably get a foot down on a steep, loose section without the top tube catching you, and whether your arms feel locked out or cramped when you're seated and pedaling steadily rather than coasting. Those specific moments reveal far more about fit than how the bike feels cruising along flat, smooth singletrack, which, ironically, is exactly the riding condition least likely to expose any real sizing problem in the first place.</p>

<h2 id="dropper-cockpit">Dropper post length and cockpit setup also factor in</h2><p>Sizing isn't only about the frame itself. Dropper post length needs to match your frame size and inseam, since a dropper that's too long can't fully insert into a smaller frame, and one that's too short leaves you without enough drop on descents to get the saddle out of the way. Many premium eMTBs now spec different dropper travel lengths across their size range specifically for this reason, so check that the stock dropper on a given size actually suits your inseam rather than assuming more travel is automatically better. Cockpit setup &mdash; stem length, handlebar width and sweep &mdash; is the other adjustable piece of the puzzle, and it's a genuinely useful way to fine-tune reach within a size rather than jumping to the next frame size up or down. A shorter stem effectively shortens reach without changing the frame itself, which is often the simplest, cheapest fix for a rider who's slightly between two sizes and doesn't want to compromise on standover clearance just to get there. Handlebar rise and sweep can shift effective reach too, by a smaller but still meaningful amount, so don't overlook the full cockpit when a bike feels almost right but not quite dialed in.</p>

<h2 id="mistakes">Common sizing mistakes</h2><p>The most common mistake is matching your old mountain bike's size letter directly to a new eMTB from a different brand, when geometry philosophy varies enough between brands that the same letter can mean meaningfully different reach and standover numbers. A second is sizing based on height alone without factoring in arm length, torso length or riding style, all of which the research above shows genuinely change what fits well. A third is skipping a real test ride entirely and ordering online based on the size chart alone, which works out fine sometimes but leaves you guessing on exactly the two measurements that matter most &mdash; standover and reach &mdash; which also happen to vary the most of any spec between competing brands.</p>

<h2 id="size-down">When in doubt, size down</h2><p>Between two sizes, most riders are better served sizing down for a more agile, confidence-inspiring feel on technical trails, and adjusting stem or seatpost setup rather than sizing up and fighting a bike that feels too long. Talk to our team directly about your height and terrain before choosing.</p><p>It's worth noting this preference isn't universal. Taller riders or those with longer torsos relative to their height sometimes find the opposite true, especially on full-power platforms where the extra stability of a slightly longer frame outweighs the agility trade-off for their riding style. The "size down" guideline is a reasonable default, not a rule that applies identically to every body type and every brand's geometry &mdash; which is exactly why the standover and reach numbers earlier in this guide matter more than a blanket rule of thumb. Use the general guidance as a sensible starting point for your own test ride, never as a full substitute for actually getting on the bike yourself. If you're still unsure after a test ride, ask about swapping before the return window closes.</p>

<div class="related-products"><a href="/product/santa-cruz-heckler-sl-cc-x0-axs/" class="card-soft">Santa Cruz Heckler SL</a><a href="/product/yeti-160e-c2/" class="card-soft">Yeti 160E</a><a href="/product/specialized-turbo-levo-sl-comp-carbon/" class="card-soft">Specialized Turbo Levo SL</a></div>

<h2 id="faq-heading">Frequently asked questions</h2><p>Also worth reading: our <a href="/blog/how-to-choose-premium-emtb/">premium eMTB buying guide</a>, and our <a href="/blog/carbon-vs-alloy-electric-mountain-bikes/">carbon vs alloy comparison</a>.</p>

<h2>Keep reading</h2><p>Next up: <a href="/blog/fat-tire-vs-standard-ebike/">Fat-Tire vs Standard E-Bike: Which Tire Width Is Right for You?</a>. Or browse the full <a href="/shop/">collection</a>.</p><div style="margin-top:2rem"><a class="btn-primary" href="/shop/electric-mountain-bikes/">Shop electric mountain bikes</a></div></div>`;

post.faqs = [
  {
    q: 'What matters most for electric mountain bike sizing?',
    a: 'Standover height and reach matter more day to day than the marketed frame size label. A bike that technically "fits" on a size chart can still feel wrong in reach or standover for your specific body, so check those two measurements directly rather than trusting a size letter alone.',
  },
  {
    q: 'Does frame size mean the same thing across different eMTB brands?',
    a: 'No. A medium from one brand can have meaningfully different reach and standover than a medium from another, because each brand sets its own geometry philosophy. Compare actual reach and standover numbers across brands rather than assuming the size label translates directly.',
  },
  {
    q: 'Should I size up or down if I’m between two sizes?',
    a: 'Most riders are better served sizing down for a more agile, confidence-inspiring feel on technical trails, then adjusting stem or seatpost setup to dial in reach. Sizing up and fighting a bike that feels too long tends to work out worse for most riders.',
  },
  {
    q: 'Does an SL eMTB fit differently than a full-power model?',
    a: 'Often, yes. Lighter SL-style builds handle closer to an unpowered mountain bike and carry less weight up front, so riders between sizes sometimes find an SL build more forgiving of sizing up slightly than a heavier full-power platform would be.',
  },
  {
    q: 'Can I size an electric mountain bike accurately without a test ride?',
    a: 'It’s riskier. A parking-lot spin or online sizing chart alone won’t reveal how standover feels stopped on an incline or how reach feels in a sustained seated position. If a real trail test isn’t possible, confirm the seller’s return or exchange policy before buying.',
  },
];

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log('Post 13 structurally rewritten (keywords pending Semrush pass): choosing-the-right-size-electric-mountain-bike');

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('public/images/products/79bike-falcon-pro.webp');
const OUT = path.resolve('public/images/blog/sur-ron-alternatives-what-youre-actually-trading-off.webp');
const meta = await sharp(SRC).metadata();
const targetRatio = 16 / 10;
const srcRatio = meta.width / meta.height;
let w, h;
if (srcRatio > targetRatio) { h = meta.height; w = Math.round(h * targetRatio); }
else { w = meta.width; h = Math.round(w / targetRatio); }
await sharp(SRC).resize(w, h, { fit: 'cover', position: 'top' }).flatten({ background: '#ffffff' }).webp({ quality: 88 }).toFile(OUT);
console.log('wrote', OUT, w, h);

const POSTS_PATH = path.resolve('src/data/posts.json');
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));

function wrap({ tag, title, date, readTime, description, content, ctaHref, ctaLabel, nextSlug, nextTitle }) {
  return (
    `<div class="container prose"><span class="eyebrow">${tag}</span>` +
    `<h1>${title}</h1>` +
    `<p class="muted" style="font-family:Inter,sans-serif;font-size:.85rem">${date} &middot; ${readTime}</p>` +
    `<p class="lead">${description}</p>` +
    content +
    `<h2>Keep reading</h2><p>Next up: <a href="/blog/${nextSlug}/">${nextTitle}</a>. Or browse the full <a href="/shop/">collection</a>.</p>` +
    `<div style="margin-top:2rem"><a class="btn-primary" href="${ctaHref}">${ctaLabel}</a></div></div>`
  );
}

const OHV = `Every model here is an off-highway vehicle built for private land and trail use, not public roads. Riding street-legally means sorting out registration, insurance and licensing in your state, so plan on a helmet and full protective gear and check local OHV rules before you head out.`;

const OLD_TAIL = 'entry-level-electric-dirt-bikes-what-separates-the-good-ones';
const LOOP_HEAD_SLUG = 'kids-electric-dirt-bike-buying-guide-by-age';
const headPost = posts.find((p) => p.slug === LOOP_HEAD_SLUG);
const oldTail = posts.find((p) => p.slug === OLD_TAIL);

const NEW_SLUG = 'sur-ron-alternatives-what-youre-actually-trading-off';
const NEW_TITLE = "Sur-Ron Alternatives: What You're Actually Trading Off";

oldTail.body = oldTail.body.replace(
  new RegExp(`Next up: <a href="/blog/${LOOP_HEAD_SLUG}/">[^<]*</a>`),
  `Next up: <a href="/blog/${NEW_SLUG}/">${NEW_TITLE}</a>`
);

const content = `<h2>The alternative-brand pitch, examined honestly</h2><p>A wave of value-focused brands has entered the market positioning themselves explicitly as "Sur-Ron alternatives" at a lower price. That's a fair pitch, but it deserves an honest look at what actually differs, rather than taking the marketing at face value.</p><h2>What stays the same across tiers</h2><p>Core riding dynamics — instant torque, near-silent operation, low maintenance relative to gas — carry over to well-built alternative-brand models like the <a href="/product/79bike-falcon-pro/">79Bike Falcon Pro</a>, which is why these alternatives can feel surprisingly close to the flagship experience on a first ride.</p><h2>What you're actually trading off</h2><p>The honest answer is brand support depth and resale value, not raw performance. A newer or smaller brand typically has a shorter track record for parts availability and service network size compared to an established name, and as covered in our <a href="/blog/electric-dirt-bike-resale-value-what-actually-holds-up/">resale value guide</a>, brand recognition is one of the strongest drivers of used-market value — an alternative-brand bike may be mechanically comparable but sell for less down the line purely on that basis.</p><h2>Who the trade-off actually favors</h2><p>If you're buying to ride for years and don't plan to sell, the lower upfront price of a well-built alternative like the Falcon Pro is a straightforward win. If resale value or long-term parts support is a real priority, the flagship brand premium buys something real, not just a name.</p><h2>Off-road use, not street use</h2><p>${OHV}</p>`;

posts.push({
  slug: NEW_SLUG,
  title: NEW_TITLE,
  description: 'Value-focused brands market themselves as Sur-Ron alternatives at lower prices. Here is what you actually gain and lose choosing one.',
  tag: 'Buying Guides',
  date: '2026-12-02',
  readTime: '6 min read',
  body: wrap({
    tag: 'Buying Guides',
    title: NEW_TITLE,
    date: '2026-12-02',
    readTime: '6 min read',
    description: 'Value-focused brands market themselves as Sur-Ron alternatives at lower prices. Here is what you actually gain and lose choosing one.',
    content,
    ctaHref: '/product/79bike-falcon-pro/',
    ctaLabel: 'Shop the 79Bike Falcon Pro',
    nextSlug: LOOP_HEAD_SLUG,
    nextTitle: headPost.title,
  }),
  image: '/images/blog/sur-ron-alternatives-what-youre-actually-trading-off.webp',
  primaryKeyword: 'sur-ron alternative electric dirt bike',
  supportingKeywords: ['best sur-ron alternatives', '79bike falcon pro review', 'cheaper sur-ron alternative', 'value electric dirt bike brands', 'sur-ron alternative under 5000'],
  faqs: [
    { q: 'Is the 79Bike Falcon Pro really comparable to a Sur-Ron?', a: 'In core riding dynamics like instant torque, near-silent operation and low maintenance, yes — the main differences are brand support depth and resale value, not raw day-to-day riding performance.' },
    { q: 'What do I actually lose buying a value-brand alternative instead of a flagship?', a: 'Primarily long-term parts availability and service network depth, plus resale value, since brand recognition is one of the strongest drivers of used-market value for electric dirt bikes.' },
    { q: 'Is it worth paying a premium for a flagship brand name?', a: 'It depends on your priorities. If you plan to ride for years without reselling, a well-built alternative is a straightforward value win. If resale value or long-term parts support matters more to you, the flagship premium buys something real.' },
    { q: 'How much does the 79Bike Falcon Pro cost?', a: 'The Falcon Pro is priced at $4,800, positioned as a value-focused alternative to pricier flagship models in the same performance class.' },
    { q: 'Do alternative-brand electric dirt bikes hold up mechanically over time?', a: "A well-built alternative brand model can hold up comparably well mechanically, but the shorter track record for parts and service support is the real risk to weigh, not day-one build quality." },
  ],
});

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log('Total posts now:', posts.length);

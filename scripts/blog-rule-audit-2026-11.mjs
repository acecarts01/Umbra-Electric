// Local structural audit of every blog post against the blog-post skill
// (C:\Users\USER\.claude\skills\blog-post\SKILL.md). Checks everything
// verifiable from the repo alone -- word count, TOC, keyword field shape,
// internal/outbound link counts, image alt, FAQ, H1 count, tag field
// existence, site-wide keyword/tag uniqueness. Does NOT verify: live link
// health, YouTube oEmbed, Semrush volume/KD/intent for any keyword slot, or
// competitor research -- those need a live pass and are reported separately.
// Not part of the build, run manually: node scripts/blog-rule-audit-2026-11.mjs
import fs from 'fs';
import path from 'path';

const posts = JSON.parse(fs.readFileSync(path.resolve('src/data/posts.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.resolve('src/data/products.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.resolve('src/data/categories.json'), 'utf8'));

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&middot;/g, '.').replace(/&mdash;/g, '-').replace(/&#8217;|&#x27;/g, "'")
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

// Build site-wide keyword/tag registry to check cross-page duplication.
const allProductKeywords = new Set();
for (const p of products) {
  allProductKeywords.add(p.primaryKeyword.toLowerCase());
  for (const k of p.supportingKeywords || []) allProductKeywords.add(k.toLowerCase());
}
const allCategoryKeywords = new Set();
for (const c of categories) {
  if (c.primaryKeyword) allCategoryKeywords.add(c.primaryKeyword.toLowerCase());
  for (const k of c.supportingKeywords || []) allCategoryKeywords.add(k.toLowerCase());
}
const postPrimaryKeywords = new Map(); // keyword -> [slugs]
for (const post of posts) {
  const k = (post.primaryKeyword || '').toLowerCase();
  if (!k) continue;
  if (!postPrimaryKeywords.has(k)) postPrimaryKeywords.set(k, []);
  postPrimaryKeywords.get(k).push(post.slug);
}

const results = [];
const siteDomainPattern = /umbraelectric|localhost/i;

for (const post of posts) {
  const issues = [];
  const body = post.body || '';
  const text = stripHtml(body);
  const words = wordCount(text);

  // Rule 1: table of contents
  const hasToc = /<nav[^>]*aria-label=["']table of contents["']/i.test(body) || /class=["'][^"']*toc[^"']*["']/i.test(body);
  if (!hasToc) issues.push('no-toc');

  // Rule 2: length >= 1500
  if (words < 1500) issues.push(`word-count-${words}`);

  // H1 count
  const h1Matches = body.match(/<h1[\s>]/gi) || [];
  if (h1Matches.length !== 1) issues.push(`h1-count-${h1Matches.length}`);

  // Keywords present
  if (!post.primaryKeyword) issues.push('no-primary-keyword');
  const supporting = post.supportingKeywords || [];
  if (supporting.length !== 5) issues.push(`supporting-count-${supporting.length}`);

  // Tags field (10-tag rule) -- structural existence check only
  if (!Array.isArray(post.tags)) {
    issues.push('no-tags-field');
  } else if (post.tags.length !== 10) {
    issues.push(`tags-count-${post.tags.length}`);
  }

  // Focus keyword placement (case-insensitive substring)
  const pk = (post.primaryKeyword || '').toLowerCase();
  if (pk) {
    if (!post.title.toLowerCase().includes(pk)) issues.push('keyword-not-in-title');
    if (!(post.description || '').toLowerCase().includes(pk)) issues.push('keyword-not-in-meta-description');
    const first100 = text.toLowerCase().split(/\s+/).slice(0, 100).join(' ');
    if (!first100.includes(pk)) issues.push('keyword-not-in-first-100-words');
    const h2h3Text = (body.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi) || []).join(' ').toLowerCase();
    if (!stripHtml(h2h3Text).includes(pk)) issues.push('keyword-not-in-any-h2-h3');
  }

  // Internal links -- the dedicated "Related products" block is the discovery
  // block (rule 6 bullet 3), not part of the "2 to 4 contextual product links"
  // count (rule 6 bullet 1), so it's excluded here to avoid double-counting
  // the same products linked once in prose and again as cards.
  const bodyForLinkCount = body.replace(/<div class=["']related-products["']>[\s\S]*?<\/div>/gi, '');
  const productLinks = (bodyForLinkCount.match(/href=["']\/product\/[^"']+["']/gi) || []).length;
  const categoryLinks = (body.match(/href=["']\/shop\/[^"']+["']/gi) || []).length;
  const blogLinks = (body.match(/href=["']\/blog\/[^"']+["']/gi) || []).length;
  if (categoryLinks < 1) issues.push('no-category-link');
  if (productLinks < 2 || productLinks > 4) issues.push(`product-links-${productLinks}`);
  if (blogLinks < 1) issues.push('no-related-post-link');
  const hasRelatedBlock = /related[\s-]?products?/i.test(body);
  if (!hasRelatedBlock) issues.push('no-related-products-block');

  // Outbound links
  const allHrefs = [...body.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const outbound = allHrefs.filter((h) => /^https?:\/\//i.test(h) && !siteDomainPattern.test(h));
  const youtube = outbound.filter((h) => /youtube\.com|youtu\.be/i.test(h));
  if (outbound.length < 2 || outbound.length > 4) issues.push(`outbound-links-${outbound.length}`);
  if (youtube.length < 1) issues.push('no-youtube-link');

  // Hero image alt -- template now uses post.primaryKeyword when set, so this
  // only flags posts still missing a primaryKeyword (hero would fall back to title).
  if (!pk) issues.push('hero-alt-no-primary-keyword-to-use');

  // Image rule: 2-4 total images (hero + inline), inline alt carries a
  // secondary keyword or a natural description (never identical on every image),
  // every non-hero image lazy-loaded, descriptive file names.
  const inlineImgs = [...body.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);
  const totalImages = 1 + inlineImgs.length; // +1 for the hero, always present via post.image
  if (totalImages < 2 || totalImages > 4) issues.push(`image-count-${totalImages}`);
  const altTexts = new Set();
  let anyAltIssue = false;
  for (const tag of inlineImgs) {
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : '';
    if (!alt) anyAltIssue = true;
    if (!/loading=["']lazy["']/i.test(tag)) anyAltIssue = true;
    altTexts.add(alt.toLowerCase());
  }
  if (anyAltIssue) issues.push('inline-image-missing-alt-or-lazy');
  if (inlineImgs.length > 1 && altTexts.size !== inlineImgs.length) issues.push('inline-images-share-identical-alt');

  // FAQ
  const faqs = post.faqs || [];
  if (faqs.length < 4 || faqs.length > 6) issues.push(`faq-count-${faqs.length}`);
  const faqText = stripHtml(faqs.map((f) => `${f.q} ${f.a}`).join(' ')).toLowerCase();
  if (pk && !faqText.includes(pk)) issues.push('keyword-not-in-faq');

  // Cross-site keyword cannibalisation check (primary vs product/category keywords)
  if (pk && (allProductKeywords.has(pk) || allCategoryKeywords.has(pk))) {
    issues.push('primary-keyword-collides-with-product-or-category');
  }
  const dupPostUsers = postPrimaryKeywords.get(pk) || [];
  if (dupPostUsers.length > 1) issues.push(`primary-keyword-shared-with-${dupPostUsers.filter((s) => s !== post.slug).join(',')}`);

  results.push({ slug: post.slug, words, issues });
}

// Aggregate
const issueCounts = {};
for (const r of results) {
  for (const issue of r.issues) {
    const key = issue.replace(/-\d+$/, '').replace(/^(word-count|supporting-count|tags-count|product-links|outbound-links|faq-count|h1-count|primary-keyword-shared-with).*/, '$1');
    issueCounts[key] = (issueCounts[key] || 0) + 1;
  }
}

const passing = results.filter((r) => r.issues.length === 0);
console.log(`\n=== Blog Rule Local Audit — ${posts.length} posts ===\n`);
console.log(`Fully passing (no locally-detectable issues): ${passing.length}/${posts.length}\n`);
console.log('Issue frequency (posts affected):');
for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count.toString().padStart(3)}  ${issue}`);
}

const outPath = path.resolve('docs/blog-rule-local-audit-2026-11.md');
let md = `# Blog rule local structural audit — 2026-11-23\n\n`;
md += `Local (repo-only) audit of all ${posts.length} blog posts against the \`blog-post\` skill. Checks ` +
      `everything verifiable from \`src/data/posts.json\` and the blog page template alone. Does **not** ` +
      `verify live link health, YouTube oEmbed status, or Semrush volume/KD/intent for any keyword -- those ` +
      `need a live pass and are listed separately below.\n\n`;
md += `**${passing.length}/${posts.length} posts have zero locally-detectable issues.**\n\n`;
md += `## Issue frequency\n\n`;
for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
  md += `- **${count}** posts: \`${issue}\`\n`;
}
md += `\n## Per-post detail\n\n`;
for (const r of results) {
  if (r.issues.length === 0) continue;
  md += `### ${r.slug} (${r.words} words)\n\n`;
  for (const issue of r.issues) md += `- ${issue}\n`;
  md += `\n`;
}
md += `\n## Not locally verifiable (needs a live pass per post)\n\n`;
md += `- Outbound link health (every URL opened and confirmed to load and say what the post claims)\n`;
md += `- YouTube video verification via oEmbed (title/channel match, public, not a competitor's own store)\n`;
md += `- Real Semrush volume/KD/intent for every keyword slot (primary, 5 secondary, 1 nav, 1 info, 10 tags) -- ` +
      `posts.json stores only the keyword strings, not their intent/volume/KD, so purity and KD-range ` +
      `compliance cannot be checked from the repo alone\n`;
md += `- Competitor top-3 research and information-gain comparison per post\n`;
md += `- Keyword density percentages (would need a proper tokenizer pass; word-count and placement checks above ` +
      `are a proxy, not the real density calculation)\n`;
fs.writeFileSync(outPath, md);
console.log(`\nFull report written to ${path.relative(process.cwd(), outPath)}`);

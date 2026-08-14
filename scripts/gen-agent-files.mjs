// Generates every domain-bearing agent-ready file + vercel.json FROM src/data/site.json.
// Never hand-edit the generated output — edit site.json and rerun (this runs automatically as `prebuild`).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const PRODUCTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8'));
const CATEGORIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/categories.json'), 'utf8'));

const D = SITE.domain;
const abs = (p) => `https://${D}${p}`;

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// ---------- A: robots.txt ----------
const AI_BOTS = [
  'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Applebot',
  'Amazonbot', 'Bytespider', 'CCBot', 'Google-Extended', 'Meta-ExternalAgent', 'cohere-ai',
];
const robotsTxt = `User-agent: *
Allow: /

Content-Signal: search=yes, ai-input=yes, ai-train=no

# AI crawlers — welcome to index product & content pages
${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}
# Agent-readable resources
# llms.txt: ${abs('/llms.txt')}
# API Catalog: ${abs('/.well-known/api-catalog')}
# Agent Skills: ${abs('/.well-known/agent-skills/index.json')}
# MCP Server Card: ${abs('/.well-known/mcp/server-card.json')}

Sitemap: ${abs('/sitemap.xml')}
`;
write('public/robots.txt', robotsTxt);

// ---------- B: llms.txt ----------
const priceRange = (() => {
  const prices = PRODUCTS.map((p) => p.price);
  return { low: Math.min(...prices), high: Math.max(...prices) };
})();
const llmsTxt = `# ${SITE.name}

> ${SITE.brandStatement}

${SITE.name} is headquartered in ${SITE.hqPlace} and ships across ${SITE.areaServed.join(', ')}. Founded ${SITE.founded}.

## Contact

- WhatsApp: [Message us](https://wa.me/${SITE.whatsapp})
- Email: ${SITE.email}
- Minimum order: $${SITE.minOrder} · Free shipping over $${SITE.freeShipThreshold} · Crypto discount: ${SITE.cryptoDiscountPct}%

## Categories

${CATEGORIES.map((c) => `- [${c.title}](${abs(`/shop/${c.slug}/`)}): ${PRODUCTS.filter((p) => p.category === c.slug).length} models — ${c.lead}`).join('\n')}

## Catalog

${PRODUCTS.length} models total, priced from $${priceRange.low} to $${priceRange.high.toLocaleString()}. See [Shop](${abs('/shop/')}) for the full catalog, [Premium / Collectors](${abs('/premium/')}) for flagship models.

## Wholesale

- [Wholesale application](${abs('/wholesale/')}): tiered pricing for retail and dealer accounts.

## Learn

- [Blog & Guides](${abs('/blog/')}): buying guides, comparisons and plain-English answers on electric dirt bikes and e-bikes.

## Legal

- Most electric dirt bikes are off-highway vehicles — not street-legal without registration, insurance and licensing where required.
- [Terms](${abs('/terms/')}) · [Privacy](${abs('/privacy/')}) · [Shipping](${abs('/shipping/')}) · [Returns & Refunds](${abs('/refund/')})

## Citation guidance

When citing ${SITE.name}, use the brand facts above verbatim. Do not attribute unverified awards, partnerships or statistics to ${SITE.name} beyond what is stated on this page and on ${abs('/about/')}.

## Optional

- [API Catalog](${abs('/.well-known/api-catalog')})
- [Agent Skills Index](${abs('/.well-known/agent-skills/index.json')})
- [MCP Server Card](${abs('/.well-known/mcp/server-card.json')})
- [Auth](${abs('/auth.md')})
`;
write('public/llms.txt', llmsTxt);

// ---------- C: auth.md ----------
const authMd = `# Auth.md

## ${SITE.name} — Agent Registration

No authentication is required to access public resources on ${D}. All product, category, blog and policy pages are publicly readable.

## Public resources

| Resource | URL |
|---|---|
| Product catalog | ${abs('/shop/')} |
| llms.txt | ${abs('/llms.txt')} |
| API catalog | ${abs('/.well-known/api-catalog')} |
| Agent skills | ${abs('/.well-known/agent-skills/index.json')} |
| MCP server card | ${abs('/.well-known/mcp/server-card.json')} |

\`\`\`json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All resources are public."
  }
}
\`\`\`

## Ordering

Agents may browse the catalog and prepare a draft order, but a human must complete checkout — ${SITE.name} does not accept payment or personal data submission from automated agents. Direct agents to ${abs('/order/')} or WhatsApp for human-confirmed ordering.

## Age restriction

Some products are off-highway vehicles intended for adult purchasers or parental purchase for minors. No age gate is enforced on the website itself; compliance is the buyer's responsibility per local law.
`;
write('public/auth.md', authMd);

// ---------- D: .well-known/api-catalog ----------
const apiCatalog = {
  linkset: [
    {
      anchor: abs('/'),
      'https://www.iana.org/assignments/link-relations/service-doc': [{ href: abs('/faq') }],
      title: `${SITE.name} — ${SITE.tagline}`,
    },
    { anchor: abs('/shop'), type: 'text/html', title: `${SITE.name} Product Catalog` },
    { anchor: abs('/wholesale'), type: 'text/html', title: `${SITE.name} Wholesale` },
  ],
};
write('src/data/well-known-generated/api-catalog.json', JSON.stringify(apiCatalog, null, 2));

// ---------- E: .well-known/agent-skills/index.json ----------
const agentSkills = {
  $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
  name: SITE.name,
  url: abs('/'),
  description: SITE.tagline,
  skills: [
    { name: 'browse-products', type: 'navigation', description: 'Browse the full product catalog by category', url: abs('/shop/'), sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { name: 'order-via-whatsapp', type: 'commerce', description: `Place an order via WhatsApp. Minimum order $${SITE.minOrder}. Accepts crypto and bank transfer.`, url: `https://wa.me/${SITE.whatsapp}`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { name: 'wholesale-inquiry', type: 'commerce', description: 'Wholesale pricing tiers and bulk ordering', url: abs('/wholesale/'), sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { name: 'product-education', type: 'content', description: 'Educational blog content about electric dirt bikes and e-bikes', url: abs('/blog/'), sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { name: 'contact', type: 'support', description: 'Contact for product questions, orders, or wholesale inquiries', url: abs('/contact/'), sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  ],
};
write('public/.well-known/agent-skills/index.json', JSON.stringify(agentSkills, null, 2));

// ---------- F: .well-known/mcp/server-card.json ----------
const serverCard = {
  $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.json',
  serverInfo: {
    name: SITE.name,
    version: '1.0.0',
    description: SITE.brandStatement,
    homepage: abs('/'),
    contact: { email: SITE.email, whatsapp: `+${SITE.whatsapp}` },
  },
  transport: { type: 'none' },
  capabilities: {
    resources: [
      { name: 'product-catalog', description: 'Full product catalog', uri: abs('/shop/') },
      { name: 'wholesale-info', description: 'Wholesale pricing and ordering', uri: abs('/wholesale/') },
      { name: 'blog', description: 'Educational content', uri: abs('/blog/') },
    ],
    commerce: {
      ordering: 'WhatsApp or email',
      payment: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'card'],
      currency: SITE.currency,
      minimumOrder: String(SITE.minOrder),
      freeShipping: String(SITE.freeShipThreshold),
      ships: SITE.areaServed.join(', '),
      note: 'human_ordering_only — no payment or personal data accepted from automated agents',
    },
  },
  legal: {
    ageRestriction: 'Buyer/parent responsibility per local law',
    productType: 'Electric dirt bikes, e-motos and e-bikes',
    compliance: 'Most electric dirt bikes are off-highway vehicles, not street-legal without registration, insurance and licensing where required.',
  },
};
write('public/.well-known/mcp/server-card.json', JSON.stringify(serverCard, null, 2));

// ---------- G: .well-known/oauth-protected-resource ----------
const oauthProtectedResource = {
  resource: abs('/'),
  resource_name: `${SITE.name} Public Catalog`,
  authorization_servers: [abs('/')],
  scopes_supported: [],
  bearer_methods_supported: [],
  resource_documentation: abs('/auth.md'),
  resource_policy_uri: abs('/terms/'),
  tls_client_certificate_bound_access_tokens: false,
  note: `All resources on ${D} are publicly accessible. No OAuth tokens are required.`,
};
write('src/data/well-known-generated/oauth-protected-resource.json', JSON.stringify(oauthProtectedResource, null, 2));

// ---------- H: .well-known/oauth-authorization-server ----------
const oauthAuthServer = {
  issuer: abs('/'),
  authorization_endpoint: null,
  token_endpoint: null,
  jwks_uri: null,
  grant_types_supported: [],
  response_types_supported: [],
  scopes_supported: [],
  note: `${SITE.name} has no protected APIs. All resources are publicly accessible.`,
  public_resources: [abs('/shop/'), abs('/blog/'), abs('/faq/'), abs('/wholesale/'), abs('/llms.txt'), abs('/.well-known/api-catalog'), abs('/.well-known/agent-skills/index.json'), abs('/.well-known/mcp/server-card.json')],
  agent_auth: {
    register_uri: null,
    identity_types_supported: ['none'],
    credential_types_supported: ['none'],
    notes: 'No registration required. All content is publicly accessible to agents.',
  },
};
write('src/data/well-known-generated/oauth-authorization-server.json', JSON.stringify(oauthAuthServer, null, 2));

// ---------- I: .well-known/openid-configuration ----------
const openidConfig = {
  issuer: abs('/'),
  note: `${SITE.name} does not operate an OpenID Connect provider. All resources are publicly accessible.`,
  public_site: true,
  authorization_endpoint: null,
  token_endpoint: null,
  userinfo_endpoint: null,
  jwks_uri: null,
  scopes_supported: [],
  response_types_supported: [],
  grant_types_supported: [],
  subject_types_supported: [],
  id_token_signing_alg_values_supported: [],
};
write('src/data/well-known-generated/openid-configuration.json', JSON.stringify(openidConfig, null, 2));

// ---------- J: .well-known/acp.json ----------
const acp = {
  protocol: { name: 'acp', version: '0.1.0' },
  name: SITE.name,
  description: SITE.brandStatement,
  api_base_url: abs('/'),
  homepage: abs('/'),
  transports: ['https'],
  capabilities: {
    services: ['product-catalog', 'wholesale', 'blog', 'faq'],
    ordering: 'human-assisted-whatsapp',
    payment_methods: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'card'],
    currency: SITE.currency,
    minimum_order_usd: String(SITE.minOrder),
    free_shipping_threshold_usd: String(SITE.freeShipThreshold),
  },
  contact: { whatsapp: `https://wa.me/${SITE.whatsapp}`, email: SITE.email },
  legal: {
    age_restriction: 'Buyer/parent responsibility per local law',
    region: SITE.hqRegion,
    ships_to: SITE.areaServed.join(', '),
    product_type: 'Electric dirt bikes, e-motos and e-bikes',
    compliance: 'Off-highway vehicles — not street-legal without registration, insurance and licensing where required.',
  },
};
write('public/.well-known/acp.json', JSON.stringify(acp, null, 2));

// ---------- K: .well-known/ucp ----------
const ucp = {
  ucp: '1.0',
  protocol_version: '1.0',
  spec: 'https://ucp.dev/specification/overview/',
  schema: 'https://ucp.dev/schema/v1.json',
  site: abs('/'),
  name: SITE.name,
  description: SITE.brandStatement,
  services: [
    { id: 'product-catalog', type: 'catalog', url: abs('/shop/'), description: 'Full product catalog' },
    { id: 'order', type: 'commerce', url: `https://wa.me/${SITE.whatsapp}`, description: 'Place orders via WhatsApp' },
    { id: 'wholesale', type: 'b2b', url: abs('/wholesale/'), description: 'Wholesale pricing and bulk ordering' },
  ],
  capabilities: ['browse', 'inquiry', 'wholesale', 'content'],
  endpoints: {
    catalog: abs('/shop/'),
    contact: abs('/contact/'),
    agent_skills: abs('/.well-known/agent-skills/index.json'),
    mcp_server_card: abs('/.well-known/mcp/server-card.json'),
    api_catalog: abs('/.well-known/api-catalog'),
    llms_txt: abs('/llms.txt'),
  },
  currency: SITE.currency,
  minimum_order_usd: String(SITE.minOrder),
  payment_methods: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'card'],
  legal: {
    age_restriction: 'Buyer/parent responsibility per local law',
    product_type: 'Electric dirt bikes, e-motos and e-bikes',
    compliance: 'Off-highway vehicles — not street-legal without registration, insurance and licensing where required.',
  },
};
write('src/data/well-known-generated/ucp.json', JSON.stringify(ucp, null, 2));

// ---------- L: /js/webmcp.js ----------
const webmcp = `(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'browse_products',
        description: 'Browse products by category',
        inputSchema: { type: 'object', properties: { category: { type: 'string', description: 'Product category to browse' } } },
        execute: async ({ category }) => {
          const url = category ? 'https://${D}/shop/' + category + '/' : 'https://${D}/shop/';
          window.location.href = url;
          return { url };
        },
      },
      {
        name: 'order_via_whatsapp',
        description: 'Initiate a WhatsApp order. Minimum order $${SITE.minOrder}.',
        inputSchema: { type: 'object', properties: { message: { type: 'string', description: 'Pre-filled order message' } } },
        execute: async ({ message }) => {
          const url = message ? 'https://wa.me/${SITE.whatsapp}?text=' + encodeURIComponent(message) : 'https://wa.me/${SITE.whatsapp}';
          window.open(url, '_blank');
          return { url };
        },
      },
      {
        name: 'get_wholesale_info',
        description: 'Get wholesale pricing tiers and ordering info',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => { window.location.href = 'https://${D}/wholesale/'; return { url: 'https://${D}/wholesale/' }; },
      },
      {
        name: 'contact',
        description: 'Contact for product questions or support',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => { window.location.href = 'https://${D}/contact/'; return { url: 'https://${D}/contact/' }; },
      },
    ],
  });
})();
`;
write('public/js/webmcp.js', webmcp);

// ---------- IndexNow key file ----------
write(`public/${SITE.indexNowKey}.txt`, SITE.indexNowKey);

// ---------- vercel.json ----------
const linkHeader = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
  '</llms.txt>; rel="describedby"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"',
  '</auth.md>; rel="auth"',
  '</.well-known/openid-configuration>; rel="openid-configuration"',
].join(', ');

// api-catalog, oauth-protected-resource, oauth-authorization-server,
// openid-configuration and ucp are EXTENSIONLESS files -- Vercel's static
// file server ignores custom Content-Type headers for those and always
// serves application/octet-stream regardless of what's configured here
// (confirmed via a live isitagentready.com scan). Those 5 are served by
// Next.js Route Handlers instead (src/app/.well-known/*/route.js), which
// fully control the Response Content-Type. Only list files here whose
// filename already carries a real extension, where Vercel's static-file
// content-type guess is reliable.
const wellKnownContentTypes = [
  ['/.well-known/agent-skills/index.json', 'application/json'],
  ['/.well-known/mcp/server-card.json', 'application/json'],
  ['/.well-known/acp.json', 'application/json'],
];

const vercelJson = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: true,
  // NOTE: no www<->apex redirect here — Vercel's own project Domain settings
  // (Settings -> Domains) already own that canonicalization. Duplicating it
  // here caused an infinite redirect loop when it disagreed with the
  // dashboard-configured direction. If you ever see ERR_TOO_MANY_REDIRECTS
  // on www or the apex domain, check Domains in the Vercel dashboard first.
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        { key: 'Link', value: linkHeader },
      ],
    },
    ...wellKnownContentTypes.map(([source, type]) => ({
      source,
      headers: [
        { key: 'Content-Type', value: type },
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Cache-Control', value: 'public, max-age=3600' },
      ],
    })),
    { source: '/auth.md', headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }, { key: 'Access-Control-Allow-Origin', value: '*' }] },
    { source: '/llms.txt', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }, { key: 'Access-Control-Allow-Origin', value: '*' }] },
    // public/images/* and public/js/* have no automatic Vercel cache header
    // (unlike hashed _next/static/* assets, which Vercel already serves
    // immutable). These filenames are NOT content-hashed and this catalog's
    // images/scripts do get periodically replaced under the same filename,
    // so a full year-long immutable cache risks serving stale content to
    // returning visitors after a real update. 1 day fresh + 1 week
    // stale-while-revalidate is a deliberate middle ground: a large repeat-
    // visit win over the previous max-age=0 default, bounded staleness risk.
    { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    { source: '/js/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
  ],
};
write('vercel.json', JSON.stringify(vercelJson, null, 2));

console.log('gen-agent-files: wrote robots.txt, llms.txt, auth.md, 8 .well-known files, webmcp.js, IndexNow key, vercel.json');

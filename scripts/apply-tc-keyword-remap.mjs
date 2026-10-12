// Applies the approved T/C keyword remap (real Semrush data, New Semrush
// Keywords/*.csv) to the 21 flagship product slugs covered by the new
// export. Replaces primaryKeyword + supportingKeywords only -- nothing
// else on these products changes. Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

const REMAP = {
  'stark-varg-standard': {
    primaryKeyword: 'stark varg ebike',
    supportingKeywords: ['stark varg top speed', 'stark varg price', 'stark e bike', 'stark varg for sale', 'stark varg price usd', 'used stark varg'],
  },
  'stark-varg-ex-street-legal-enduro': {
    primaryKeyword: 'stark varg ex price',
    supportingKeywords: ['2025 stark varg ex for sale', '2025 stark varg ex price', 'buy stark varg ex', 'stark varg ex for sale', 'stark varg ex review'],
  },
  'sur-ron-light-bee-x': {
    primaryKeyword: 'surron price',
    supportingKeywords: ['surron e bicycle', 'sur ron bicycle', 'surron for sale', 'surron light bee s', 'sur ron electric bicycle'],
  },
  'sur-ron-storm-bee': {
    primaryKeyword: 'surron storm bee price',
    supportingKeywords: ['surron storm bee for sale', 'sur-ron storm bee review', 'buy sur-ron storm bee', 'sur-ron storm bee specs'],
  },
  'talaria-komodo-new-2026': {
    primaryKeyword: 'talaria komodo price',
    supportingKeywords: ['komodo talaria', 'talaria komodo for sale', 'komodo electric bike', 'new talaria', 'komodo ebike'],
  },
  'talaria-sting-r-mx4': {
    primaryKeyword: 'talaria mx4',
    supportingKeywords: ['talaria sting r mx4', 'talaria sting mx4', 'mx4 talaria', 'surron vs talaria', 'talaria mx4 sting r'],
  },
  'ktm-freeride-e-xc': {
    primaryKeyword: 'ktm electric dirt bike',
    supportingKeywords: ['ktm freeride', 'ktm e bike', 'ktm electric dirt bike for sale', 'ktm freeride e xc for sale', 'ktm freeride e xc price'],
  },
  'zero-fx': {
    primaryKeyword: 'electric motorcycle for sale',
    supportingKeywords: ['zero fx price', 'electric motorcycles for sale', 'zero motorcycles for sale', 'street legal electric dirt bike', 'electric dirt bike motorcycles'],
  },
  'zero-xb-2026': {
    primaryKeyword: 'zero motorcycles for sale',
    supportingKeywords: ['zero motorcycle for sale', 'zero motorcycles price', 'zero fx for sale', 'zero xe price', 'used zero motorcycle for sale'],
  },
  'zero-xe-2026': {
    primaryKeyword: 'zero electric bike',
    supportingKeywords: ['zero motorcycles for sale', 'zero motorcycles price', 'zero xe price', 'zero fx price', 'zero xb price'],
  },
  'santa-cruz-heckler-carbon-cc-x0-axs': {
    primaryKeyword: 'santa cruz heckler',
    supportingKeywords: ['heckler santa cruz', 'santa cruz bicycles heckler', 'santa cruz heckler e bike', 'santa cruz heckler ebike', 'santa cruz heckler for sale'],
  },
  'santa-cruz-heckler-sl-c-gx-axs': {
    primaryKeyword: 'santa cruz heckler sl 90',
    supportingKeywords: ['santa cruz heckler sl for sale', 'santa cruz heckler sl review', 'heckler e mtb', 'santa cruz heckler sl c gx axs price', 'buy santa cruz heckler sl c'],
  },
  'santa-cruz-heckler-sl-cc-x0-axs': {
    primaryKeyword: 'santa cruz heckler sl c stout',
    supportingKeywords: ['santa cruz heckler sl cc x0 axs price', 'buy santa cruz heckler sl cc', 'santa cruz heckler sl cc review', 'santa cruz heckler sl cc for sale', 'santa cruz heckler cc carbon'],
  },
  'specialized-turbo-levo-sl-expert-carbon': {
    primaryKeyword: 'specialized turbo levo',
    supportingKeywords: ['turbo levo emtb', 'specialized electric mountain bike', 'specialized turbo levo for sale', 'specialized turbo levo price', 'levo electric bike'],
  },
  'specialized-turbo-levo-sl-comp-carbon': {
    primaryKeyword: 'levo turbo',
    supportingKeywords: ['specialized turbo levo bike', 'specialized turbo levo 3', 'turbo levo gen 3', 'e bike turbo levo', 'specialized turbo levo comp carbon price'],
  },
  'trek-rail-7': {
    primaryKeyword: 'trek rail',
    supportingKeywords: ['trek rail ebike', 'trek rail 7 gen 2', 'trek rail e mountain bike', 'trek rail e bike', 'rail 7'],
  },
  'trek-rail-9-8-xt': {
    primaryKeyword: 'trek rail 9.8',
    supportingKeywords: ['trek rail 9.7 gen 4', 'trek rail+', 'trek rail emtb', 'trek rail 9.8 xt price', 'buy trek rail 9.8'],
  },
  'trek-rail-9-9-xtr': {
    primaryKeyword: 'trek rail 9.9',
    supportingKeywords: ['trek rail 9.9 xtr price', 'buy trek rail 9.9 xtr', 'trek rail 9.9 for sale', 'trek rail xtr review', 'trek rail 9.9 xtr for sale'],
  },
  'yeti-160e-c3': {
    primaryKeyword: 'yeti 160e',
    supportingKeywords: ['yeti 160', 'yeti 160e for sale', 'yeti 160e review', 'yeti 160e c3', 'yeti 160e 2025'],
  },
  'yeti-160e-c2': {
    primaryKeyword: 'yeti 160e sale',
    supportingKeywords: ['yeti bikes 160e', '2023 yeti 160e', 'yeti 160e 2023', 'yeti 160e c2 price', 'buy yeti 160e c2'],
  },
  'yeti-160e-t2': {
    primaryKeyword: 'e bike yeti 160e',
    supportingKeywords: ['yeti 160e frame only', 'yeti 160e t2 price', 'buy yeti 160e t2', 'yeti 160e t2 review', 'yeti 160e t2 for sale'],
  },
};

let applied = 0, missing = [];
for (const [slug, data] of Object.entries(REMAP)) {
  const p = products.find((x) => x.slug === slug);
  if (!p) { missing.push(slug); continue; }
  p.primaryKeyword = data.primaryKeyword;
  p.supportingKeywords = data.supportingKeywords;
  applied++;
}

if (missing.length) {
  console.log('MISSING SLUGS (not found in products.json):', missing.join(', '));
}

// sitewide duplicate-primary check after remap
const primaries = products.map((p) => p.primaryKeyword.toLowerCase());
const dupes = primaries.filter((p, i) => primaries.indexOf(p) !== i);
if (dupes.length) console.log('WARNING duplicate primaryKeyword values:', [...new Set(dupes)]);

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
console.log(`Applied remap to ${applied}/${Object.keys(REMAP).length} products.`);

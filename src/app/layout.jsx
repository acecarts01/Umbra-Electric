import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Announce from '@/components/Announce';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ScrollReveal from '@/components/ScrollReveal';
import JsonLd from '@/components/JsonLd';
import { SITE, PRODUCTS, REVIEW_STATS, absUrl, PHONE_PLACEHOLDER } from '@/config/site';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

const DEFAULT_DESCRIPTION =
  'Premium electric dirt bikes, e-motos & e-bikes for adults and kids. Curated flagship brands, financing and worldwide shipping from Umbra Electric.';

export const metadata = {
  metadataBase: new URL(absUrl('/')),
  title: { default: `${SITE.name} — Premium Electric Dirt Bikes & E-Bikes`, template: `%s — ${SITE.name}` },
  description: DEFAULT_DESCRIPTION,
  verification: { google: SITE.gscCode, other: { 'msvalidate.01': SITE.bingCode } },
  other: { 'IndexNow-key': SITE.indexNowKey, 'geo.region': `${SITE.hqCountry}-${SITE.hqRegion}`, 'geo.placename': SITE.hqCity },
  icons: { icon: '/images/favicon.svg', apple: '/images/logo.webp' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    images: [{ url: absUrl('/images/og-default.webp'), width: 1200, height: 630, alt: `${SITE.name} — Premium Electric Dirt Bikes & E-Bikes` }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absUrl('/images/og-default.webp')],
  },
};

export default function RootLayout({ children }) {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': ['Store', 'Organization'],
    name: SITE.name,
    url: absUrl('/'),
    logo: absUrl('/images/logo.webp'),
    image: absUrl('/images/og-default.webp'),
    description: SITE.brandStatement,
    foundingDate: SITE.founded,
    foundingLocation: { '@type': 'Place', name: SITE.hqPlace },
    address: { '@type': 'PostalAddress', addressLocality: SITE.hqCity, addressRegion: SITE.hqRegion, addressCountry: SITE.hqCountry },
    areaServed: SITE.areaServed,
    numberOfItems: PRODUCTS.length,
    knowsAbout: [
      'electric dirt bikes', 'e-motos', 'electric mountain bikes', 'electric commuter bikes', 'electric fat tire bikes',
      'folding electric bikes', 'kids electric dirt bikes', 'electric road and gravel bikes', 'Sur-Ron', 'Talaria', 'Stark Varg',
    ],
    priceRange: `$${Math.min(...PRODUCTS.map((p) => p.price))}–$${Math.max(...PRODUCTS.map((p) => p.price)).toLocaleString()}`,
    makesOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: SITE.currency,
      lowPrice: Math.min(...PRODUCTS.map((p) => p.price)),
      highPrice: Math.max(...PRODUCTS.map((p) => p.price)),
      offerCount: PRODUCTS.length,
      availability: 'https://schema.org/InStock',
    },
    brand: { '@type': 'Brand', name: SITE.name },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: REVIEW_STATS.average, reviewCount: REVIEW_STATS.count, bestRating: 5, worstRating: 1 },
    sameAs: [absUrl('/'), SITE.instagram, SITE.facebook, `https://wa.me/${SITE.whatsapp}`],
    contactPoint: {
      '@type': 'ContactPoint',
      // SITE.phone is still a placeholder (no real landline yet) -- the
      // WhatsApp number is the one real, confirmed-working contact number,
      // and it's a genuine E.164 phone number in its own right, so it's
      // what's published here until a separate real phone is supplied.
      telephone: SITE.phone !== PHONE_PLACEHOLDER ? SITE.phone : `+${SITE.whatsapp}`,
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <JsonLd data={orgLd} />
        <Announce />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <ScrollReveal />
        <Analytics />
        <Script id="tawk-to" strategy="lazyOnload">
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/6a798349224bc71d4a539c3c/1jvlahm4k';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();`}
        </Script>
        <script src="/js/webmcp.js" defer />
      </body>
    </html>
  );
}

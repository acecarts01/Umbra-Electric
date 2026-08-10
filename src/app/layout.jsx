import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Announce from '@/components/Announce';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import JsonLd from '@/components/JsonLd';
import { SITE, REVIEW_STATS, absUrl } from '@/config/site';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  metadataBase: new URL(absUrl('/')),
  title: { default: `${SITE.name} — Premium Electric Dirt Bikes & E-Bikes`, template: `%s — ${SITE.name}` },
  description:
    'Premium electric dirt bikes, e-motos & e-bikes for adults and kids. Curated flagship brands, financing and worldwide shipping from Umbra Electric.',
  verification: { google: SITE.gscCode, other: { 'msvalidate.01': SITE.bingCode } },
  other: { 'IndexNow-key': SITE.indexNowKey, 'geo.region': `${SITE.hqCountry}-${SITE.hqRegion}`, 'geo.placename': SITE.hqCity },
  icons: { icon: '/images/favicon.svg', apple: '/images/logo.webp' },
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
    numberOfItems: 128,
    knowsAbout: ['electric dirt bikes', 'e-motos', 'electric mountain bikes', 'electric bikes', 'premium electric dirt bikes', 'Sur-Ron', 'Talaria', 'Stark Varg'],
    priceRange: '$399–$14,000',
    makesOffer: { '@type': 'AggregateOffer', priceCurrency: SITE.currency, lowPrice: 399, highPrice: 14000, offerCount: 128, availability: 'https://schema.org/InStock' },
    brand: { '@type': 'Brand', name: SITE.name },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: REVIEW_STATS.average, reviewCount: REVIEW_STATS.count, bestRating: 5, worstRating: 1 },
    sameAs: [absUrl('/'), SITE.instagram, SITE.facebook],
    contactPoint: { '@type': 'ContactPoint', telephone: SITE.phone, contactType: 'customer service', availableLanguage: 'English' },
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
        <ScrollReveal />
        <Script id="tawk-to" strategy="afterInteractive">
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

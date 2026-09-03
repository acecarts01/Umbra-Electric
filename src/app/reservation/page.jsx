import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import ReservationCalculator from '@/components/ReservationCalculator';
import { SITE, absUrl } from '@/config/site';

const PRIMARY_KEYWORD = 'electric dirt bike reservation';
const SUPPORTING_KEYWORDS = [
  'reserve an electric dirt bike',
  'electric bike holding deposit',
  '20% deposit electric bike',
  'BTC USDT discount ebike',
  'hold a bike before shipping',
];

const FAQS = [
  {
    q: 'How does the electric bike reservation system work?',
    a: `You pay a ${SITE.reservationDepositPct}% holding deposit on any model in our catalog to reserve it. Our team then confirms exact configuration, stock and shipping by email before anything else is charged, and you pay the remaining balance before your order ships.`,
  },
  {
    q: `What is the ${SITE.reservationDepositPct}% holding deposit?`,
    a: `The holding deposit is ${SITE.reservationDepositPct}% of the bike's price, paid upfront to reserve that specific model instead of paying the full price in one payment. It secures your order while stock, configuration and shipping are confirmed.`,
  },
  {
    q: 'Do I get a discount for paying the balance in BTC or USDT?',
    a: `Yes — paying with BTC or USDT gets you Umbra Electric's standard ${SITE.cryptoDiscountPct}% crypto discount, applied to the total order price before the ${SITE.reservationDepositPct}% deposit is calculated. Use the reservation calculator above to see the exact numbers for your bike.`,
  },
  {
    q: 'When is the remaining balance due?',
    a: 'The remaining balance is due before your order ships. Our team confirms exact timing by email once stock, configuration and shipping details are finalized after your deposit.',
  },
  {
    q: 'Can I reserve any bike in the Umbra Electric catalog?',
    a: 'Yes — the reservation system applies across our full catalog of adult and kids electric dirt bikes, electric mountain bikes, commuter, fat-tire, folding and road/gravel e-bikes. Start your reservation through our email order form or WhatsApp.',
  },
];

export const metadata = {
  title: 'Reserve an Electric Dirt Bike or E-Bike',
  description:
    "Reserve your electric dirt bike or e-bike with a 20% holding deposit and pay the rest before shipping — or save 10% paying with BTC/USDT.",
  alternates: { canonical: absUrl('/reservation/') },
};

export default function ReservationPage() {
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Electric Bike Reservation',
    serviceType: 'Bike reservation deposit',
    provider: { '@type': 'Organization', name: SITE.name, url: absUrl('/') },
    areaServed: SITE.areaServed,
    description: metadata.description,
    url: absUrl('/reservation/'),
    keywords: [PRIMARY_KEYWORD, ...SUPPORTING_KEYWORDS].join(', '),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reservations', href: '/reservation/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Reservations</span>
          <h1>Reserve an Electric Dirt Bike or E-Bike</h1>
          <p className="lead">
            Reserve any model in our catalog with a {SITE.reservationDepositPct}% holding deposit and pay the remaining balance before it
            ships — or save {SITE.cryptoDiscountPct}% on the whole order paying with BTC or USDT.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>How an electric dirt bike reservation works</h2>
          <p>
            Reserving a bike is a simple four-step process. First, pick the model you want from our{' '}
            <a href="/shop/">full collection</a>. Second, pay a {SITE.reservationDepositPct}% holding deposit to reserve that specific
            bike instead of paying the full price upfront. Third, our team confirms exact configuration, current stock and shipping by
            email before anything else is charged. Fourth, you pay the remaining balance before your order ships.
          </p>
          <p>
            This is a genuinely useful option for flagship machines where you want to lock in a specific model — a{' '}
            <a href="/shop/adult-electric-dirt-bikes/">flagship electric dirt bike</a> or a premium{' '}
            <a href="/shop/electric-mountain-bikes/">electric mountain bike</a> — without paying the full amount in one transaction, and
            it works the same way across every category we carry.
          </p>

          <h2>The {SITE.reservationDepositPct}% holding deposit, explained</h2>
          <p>
            The holding deposit is calculated as {SITE.reservationDepositPct}% of the bike's total price. Paying it reserves that exact
            model for you while our team confirms availability and configuration — it isn't a separate fee on top of the bike's price,
            it's the first {SITE.reservationDepositPct}% of what you already owe. The remaining balance (the other {100 - SITE.reservationDepositPct}%)
            is due before shipping, once everything is confirmed.
          </p>

          <h2>Save {SITE.cryptoDiscountPct}% paying with BTC or USDT</h2>
          <p>
            Paying your order in BTC or USDT brings Umbra Electric's standard {SITE.cryptoDiscountPct}% crypto discount to the entire
            order — not just the deposit. The discount is applied to the bike's total price first, and the{' '}
            {SITE.reservationDepositPct}% holding deposit is then calculated on that discounted total, so the saving carries through both
            the deposit and the remaining balance. Use the calculator below to see the exact numbers for your bike.
          </p>

          <h2>Estimate your reservation</h2>
          <p>
            Enter a bike's price to see exactly what a {SITE.reservationDepositPct}% holding deposit and the {SITE.cryptoDiscountPct}%
            crypto discount work out to before you order.
          </p>
          <ReservationCalculator />

          <h2 style={{ marginTop: '2.4rem' }}>Ready to reserve your bike?</h2>
          <p>
            Reservations are confirmed through our email order form, our primary and recommended ordering channel — WhatsApp is
            available as a secondary option if you'd rather chat first. Our team confirms exact pricing, stock and reservation terms
            before any deposit is charged.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a className="btn-primary" href="/order/">
              Start a reservation
            </a>{' '}
            <a className="btn-secondary" href="/shop/">
              Browse the collection
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose" style={{ maxWidth: 820 }}>
          <h2>Reservation FAQs</h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>
    </>
  );
}

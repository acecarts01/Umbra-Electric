import Breadcrumbs from '@/components/Breadcrumbs';
import ReviewCard from '@/components/ReviewCard';
import JsonLd from '@/components/JsonLd';
import { SITE, REVIEWS, REVIEW_STATS, absUrl } from '@/config/site';

export const metadata = {
  title: 'Customer Reviews',
  description: `${REVIEW_STATS.count} verified customer reviews of ${SITE.name} — ${REVIEW_STATS.average} out of 5 stars average.`,
  alternates: { canonical: absUrl('/reviews/') },
};

export default function ReviewsPage() {
  const reviewsLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: absUrl('/'),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: REVIEW_STATS.average,
      reviewCount: REVIEW_STATS.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: REVIEWS.map((r) => ({
      '@type': 'Review',
      name: r.title,
      reviewBody: r.text,
      datePublished: r.date,
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    })),
  };

  return (
    <>
      <JsonLd data={reviewsLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Reviews</span>
          <h1>Customer Reviews</h1>
          <div className="review-summary">
            <span className="avg">{REVIEW_STATS.average}</span>
            <span className="stars-lg">★★★★★</span>
            <span className="muted">
              based on {REVIEW_STATS.count} verified customer reviews
            </span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="review-grid">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

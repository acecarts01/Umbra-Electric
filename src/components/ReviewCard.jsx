export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </div>
      <h3>{review.title}</h3>
      <p className="review-text">{review.text}</p>
      <div className="review-meta">
        <span className="review-name">{review.name}</span> — {review.state} · <time dateTime={review.date}>{review.dateDisplay}</time>
      </div>
    </article>
  );
}

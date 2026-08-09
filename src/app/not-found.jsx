export default function NotFound() {
  return (
    <section className="thankyou-section">
      <div className="container thankyou-container">
        <div className="thankyou-icon" aria-hidden="true">⚡</div>
        <h1>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on the trail.</p>
        <div className="thankyou-actions">
          <a className="btn-primary" href="/">Go home</a>
          <a className="btn-secondary" href="/shop/">Shop bikes</a>
        </div>
      </div>
    </section>
  );
}

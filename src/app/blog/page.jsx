import Breadcrumbs from '@/components/Breadcrumbs';
import SmartImage from '@/components/SmartImage';
import { SITE, POSTS, absUrl } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Blog & Guides',
  description: `Buying guides, comparisons and plain-English answers on electric dirt bikes, e-motos and e-bikes from ${SITE.name}.`,
  alternates: { canonical: absUrl('/blog/') },
};

export default function BlogIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Guides</span>
          <h1>Electric Dirt Bike Blog &amp; Guides</h1>
          <p className="lead">Buying guides, comparisons and plain-English answers on electric dirt bikes, e-motos and e-bikes.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {POSTS.map((post) => (
              <article className="bcard" key={post.slug}>
                <a href={`/blog/${post.slug}/`}>
                  <div className="ph">
                    {post.image ? (
                      <SmartImage src={post.image} alt={post.title} fill fit="cover" sizes="(max-width:760px) 100vw, 33vw" />
                    ) : (
                      post.title
                    )}
                  </div>
                </a>
                <div className="b">
                  <span className="tag">{post.tag}</span>
                  <h3>
                    <a href={`/blog/${post.slug}/`}>{post.title}</a>
                  </h3>
                  <p className="muted" style={{ fontSize: '.9rem' }}>
                    {post.description}
                  </p>
                  <div className="meta">
                    {post.date} · {post.readTime}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

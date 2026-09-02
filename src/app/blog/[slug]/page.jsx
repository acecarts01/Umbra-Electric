import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import FaqAccordion from '@/components/FaqAccordion';
import { SITE, POSTS, getPost, absUrl } from '@/config/site';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absUrl(`/blog/${post.slug}/`) },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: absUrl(`/blog/${post.slug}/`),
      images: [absUrl(post.image || '/images/og-default.webp')],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const keywords = post.primaryKeyword ? [post.primaryKeyword, ...(post.supportingKeywords || [])] : null;

  const postLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absUrl('/images/logo.webp') } },
    mainEntityOfPage: absUrl(`/blog/${post.slug}/`),
    about: { '@type': 'Thing', name: post.tag },
    ...(keywords ? { keywords: keywords.join(', ') } : {}),
    ...(post.image ? { image: absUrl(post.image) } : {}),
  };

  const faqLd =
    post.faqs && post.faqs.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }
      : null;

  return (
    <>
      <JsonLd data={postLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: post.title, href: `/blog/${post.slug}/` }]} />
      {post.image && (
        <div className="container">
          <div className="blog-hero-img">
            <SmartImage src={post.image} alt={post.title} fill fit="cover" priority sizes="(max-width:760px) 100vw, 900px" />
          </div>
        </div>
      )}
      <section className="section">
        <article dangerouslySetInnerHTML={{ __html: post.body }} />
        {post.faqs && post.faqs.length > 0 && (
          <div className="container prose" style={{ maxWidth: 820, marginTop: '1rem' }}>
            <h2>Frequently asked questions</h2>
            <FaqAccordion faqs={post.faqs} />
          </div>
        )}
      </section>
    </>
  );
}

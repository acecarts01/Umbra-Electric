import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
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
    ...(post.image ? { image: absUrl(post.image) } : {}),
  };

  return (
    <>
      <JsonLd data={postLd} />
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
      </section>
    </>
  );
}

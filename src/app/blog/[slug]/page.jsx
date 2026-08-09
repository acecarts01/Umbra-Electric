import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
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
    openGraph: { type: 'article', title: post.title, description: post.description, url: absUrl(`/blog/${post.slug}/`) },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absUrl('/blog/') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absUrl(`/blog/${post.slug}/`) },
    ],
  };
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
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <JsonLd data={postLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: post.title }]} />
      <section className="section">
        <article dangerouslySetInnerHTML={{ __html: post.body }} />
      </section>
    </>
  );
}

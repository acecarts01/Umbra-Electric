import JsonLd from './JsonLd';
import { absUrl } from '@/config/site';

export default function Breadcrumbs({ items }) {
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absUrl(item.href),
    })),
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <div className="crumb container">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && ' › '}
            {i < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          </span>
        ))}
      </div>
    </>
  );
}

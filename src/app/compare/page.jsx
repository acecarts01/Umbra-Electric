import Breadcrumbs from '@/components/Breadcrumbs';
import CompareTool from '@/components/CompareTool';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Comparison Tool',
  description: 'Compare electric dirt bikes and e-bikes side by side. Put up to three models head to head by brand, category, price and specs.',
  alternates: { canonical: absUrl('/compare/') },
};

export default function ComparePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Compare', href: '/compare/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Tools</span>
          <h1>Electric Dirt Bike Comparison Tool</h1>
          <p className="lead">
            Put up to three electric dirt bikes or e-bikes side by side to compare brand, category, price and specs before you buy.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CompareTool />
        </div>
      </section>
    </>
  );
}

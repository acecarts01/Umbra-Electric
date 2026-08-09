import Breadcrumbs from '@/components/Breadcrumbs';
import CompareTool from '@/components/CompareTool';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Compare Models',
  description: 'Put up to three electric dirt bikes or e-bikes side by side to compare brand, category and price.',
  alternates: { canonical: absUrl('/compare/') },
};

export default function ComparePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Compare' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Tools</span>
          <h1>Compare Models</h1>
          <p className="lead">Put up to three bikes side by side to compare brand, category and price.</p>
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

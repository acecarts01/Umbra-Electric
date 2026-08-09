'use client';
import { useState } from 'react';
import SmartImage from './SmartImage';
import { PRODUCTS, fmtPrice } from '@/config/site';

const sortedProducts = [...PRODUCTS].sort((a, b) => a.name.localeCompare(b.name));

export default function CompareTool() {
  const [sel, setSel] = useState(['', '', '']);
  const chosen = sel.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(Boolean);

  return (
    <div>
      <div className="form-row three">
        {[0, 1, 2].map((i) => (
          <div className="form-group" key={i}>
            <label htmlFor={`cmp${i}`}>Bike {i + 1}</label>
            <select
              id={`cmp${i}`}
              value={sel[i]}
              onChange={(e) => setSel((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
            >
              <option value="">Select...</option>
              {sortedProducts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {fmtPrice(p.price)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="tablewrap">
        {chosen.length === 0 ? (
          <p className="muted">Select bikes above to compare.</p>
        ) : (
          <table className="cmp-table">
            <thead>
              <tr>
                <th></th>
                {chosen.map((p) => (
                  <th key={p.slug}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Image</td>
                {chosen.map((p) => (
                  <td key={p.slug}>
                    <div style={{ width: 120, height: 120, position: 'relative', background: '#f6f4ef', borderRadius: 8 }}>
                      <SmartImage src={p.images[0]} alt={p.name} fill sizes="120px" />
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Brand</td>
                {chosen.map((p) => (
                  <td key={p.slug}>{p.brand}</td>
                ))}
              </tr>
              <tr>
                <td>Price</td>
                {chosen.map((p) => (
                  <td key={p.slug}>{fmtPrice(p.price)}</td>
                ))}
              </tr>
              <tr>
                <td>Overview</td>
                {chosen.map((p) => (
                  <td key={p.slug}>{p.description}</td>
                ))}
              </tr>
              <tr>
                <td></td>
                {chosen.map((p) => (
                  <td key={p.slug}>
                    <a className="btn-primary" href={`/product/${p.slug}/`}>
                      View
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

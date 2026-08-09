export default function Breadcrumbs({ items }) {
  return (
    <div className="crumb container">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && ' › '}
          {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

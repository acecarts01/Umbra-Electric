import Image from 'next/image';

export default function SmartImage({ src, alt, fill, width, height, priority, sizes, className, style, fit = 'contain' }) {
  const path = src.startsWith('/') ? src : `/images/products/${src}`;
  if (fill) {
    return (
      <Image
        src={path}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 600px) 50vw, 300px'}
        className={className}
        style={{ objectFit: fit, ...style }}
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={path}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={className}
      style={style}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  );
}

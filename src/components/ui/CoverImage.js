import Image from 'next/image';

/** Responsive image that fills a ratio box (Bootstrap `ratio`). */
export default function CoverImage({ src, alt = '', ratio = '4x3', className = '', rounded = true, sizes = '(max-width: 768px) 100vw, 33vw', priority = false }) {
  return (
    <div className={`ratio ratio-${ratio} overflow-hidden ${rounded ? 'rounded-4' : ''} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
    </div>
  );
}

import { Link } from 'wouter';
import type { Product } from '../../../../shared/nevenshop-types';
import { useLanguage } from '../../hooks/useTranslations';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { currentLang } = useLanguage();
  const price = product.meta?._regular_price || product.meta?._price || '';
  const thumb = (typeof product.thumbnail === 'string' && product.thumbnail)
    ? product.thumbnail
    : (typeof product.images?.[0] === 'string' ? product.images[0] : '') || '/manus-storage/woocommerce-placeholder_d83d7d50.png';

  return (
    <Link
      to={`/${currentLang}/products/${product.slug}`}
      style={{
        display: 'block',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textDecoration: 'none',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--color-awb-2)' }}>
        <img
          src={thumb}
          alt={product.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="product-card-body" style={{ padding: 20 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-awb-7)',
            margin: '0 0 8px',
            lineHeight: 1.4,
          }}
        >
          {product.title}
        </h3>
        {price && (
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-awb-4)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            ${price}
          </span>
        )}
      </div>
    </Link>
  );
}

import { useParams } from 'wouter';
import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { useProduct } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';

export default function NvProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const { currentLang } = useLanguage();
  const { t } = useTranslations();
  const { data: product, isLoading, error } = useProduct(slug);

  if (isLoading) return (
    <div className="container-site" style={{ padding: '80px 30px' }}>
      <p>{t('Loading...')}</p>
    </div>
  );

  if (error || !product) return (
    <div className="container-site" style={{ padding: '80px 30px' }}>
      <p>{t('Product not found.')}</p>
    </div>
  );

  return (
    <>
      {product.content_blocks?.length > 0 && (
        <ContentBlockRenderer blocks={product.content_blocks} />
      )}
    </>
  );
}

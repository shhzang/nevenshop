import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { useProductList } from '../hooks/useProductData';
import ProductGrid from '../components/product/ProductGrid';
import NvBreadcrumbs from '../components/ui/NvBreadcrumbs';

export default function NvProductsPage() {
  const { currentLang } = useLanguage();
  const { t } = useTranslations();
  const { data: products, isLoading } = useProductList();

  return (
    <>
      <div style={{ background: 'var(--color-awb-2)', padding: '60px 0 40px' }}>
        <div className="container-site">
          <NvBreadcrumbs items={[
            { label: t('Home'), path: '/' },
            { label: t('Products') },
          ]} />
          <h1 style={{ margin: 0 }}>{t('All Products')}</h1>
        </div>
      </div>
      <section style={{ padding: '60px 0' }}>
        <div className="container-site">
          {isLoading ? (
            <p>{t('Loading products...')}</p>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>
    </>
  );
}

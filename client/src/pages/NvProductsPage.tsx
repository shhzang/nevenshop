import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { useProductList } from '../hooks/useProductData';
import ProductGrid from '../components/product/ProductGrid';
import NvBreadcrumbs from '../components/ui/NvBreadcrumbs';
import ContactBar from '../components/ContactBar';
import SocialShareBar from '../components/SocialShareBar';

export default function NvProductsPage() {
  const { currentLang } = useLanguage();
  const { t } = useTranslations();
  const { data: products, isLoading } = useProductList();

  return (
    <>
      <div style={{ background: 'var(--color-awb-2)', padding: 'var(--section-padding) 0 calc(var(--section-padding) * 0.6)' }}>
        <div className="container-site">
          <NvBreadcrumbs items={[
            { label: t('Home'), path: '/' },
            { label: t('Products') },
          ]} />
          <h1 style={{ margin: 0 }}>{t('All Products')}</h1>
        </div>
      </div>
      <section style={{ padding: 'var(--section-padding) 0' }}>
        <div className="container-site">
          {isLoading ? (
            <p>{t('Loading products...')}</p>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>
      {/* Contact and Social Share Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Interested in Our Products?</h3>
              <ContactBar variant="block" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Share Our Collection</h3>
              <SocialShareBar variant="block" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

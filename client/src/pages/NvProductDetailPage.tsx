import { useParams } from 'wouter';
import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { useProduct } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';
import ContactBar from '../components/ContactBar';
import SocialShareBar from '../components/SocialShareBar';

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
      {/* Contact and Social Share Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Questions About This Product?</h3>
              <ContactBar variant="block" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Share This Product</h3>
              <SocialShareBar variant="block" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

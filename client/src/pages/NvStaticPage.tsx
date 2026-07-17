import { useParams } from 'wouter';
import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { usePage } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';
import NvBreadcrumbs from '../components/ui/NvBreadcrumbs';
import ContactBar from '../components/ContactBar';
import SocialShareBar from '../components/SocialShareBar';

export default function NvStaticPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const { currentLang } = useLanguage();
  const { t } = useTranslations();
  const { data: page, isLoading } = usePage(slug);

  if (isLoading) return (
    <div className="container-site" style={{ padding: '80px 30px' }}>
      <p>{t('Loading...')}</p>
    </div>
  );

  if (!page) return (
    <div className="container-site" style={{ padding: '80px 30px' }}>
      <p>{t('Page not found.')}</p>
    </div>
  );

  return (
    <>
      <div style={{ background: 'var(--color-awb-2)', padding: 'var(--section-padding) 0 calc(var(--section-padding) * 0.6)' }}>
        <div className="container-site">
          <NvBreadcrumbs items={[
            { label: t('Home'), path: '/' },
            { label: page.title },
          ]} />
          <h1 style={{ margin: 0 }}>{page.title}</h1>
        </div>
      </div>
      <section style={{ padding: 'var(--section-padding) 0' }}>
        <div className="container-site">
          {page.content_blocks?.length > 0 ? (
            <ContentBlockRenderer blocks={page.content_blocks} lang={currentLang} />
          ) : page.raw_content ? (
            <div dangerouslySetInnerHTML={{ __html: page.raw_content }} />
          ) : (
            <p>{t('No content available.')}</p>
          )}
        </div>
      </section>
      {/* Contact and Social Share Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Need More Information?</h3>
              <ContactBar variant="block" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Share This Page</h3>
              <SocialShareBar variant="block" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

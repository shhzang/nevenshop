import { useParams } from 'wouter';
import { useLanguage, useTranslations } from '../hooks/useTranslations';
import { usePage } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';
import NvBreadcrumbs from '../components/ui/NvBreadcrumbs';

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
      <div style={{ background: 'var(--color-awb-2)', padding: '60px 0 40px' }}>
        <div className="container-site">
          <NvBreadcrumbs items={[
            { label: t('Home'), path: '/' },
            { label: page.title },
          ]} />
          <h1 style={{ margin: 0 }}>{page.title}</h1>
        </div>
      </div>
      <section style={{ padding: '60px 0' }}>
        <div className="container-site">
          {page.content_blocks?.length > 0 ? (
            <ContentBlockRenderer blocks={page.content_blocks} />
          ) : page.raw_content ? (
            <div dangerouslySetInnerHTML={{ __html: page.raw_content }} />
          ) : (
            <p>{t('No content available.')}</p>
          )}
        </div>
      </section>
    </>
  );
}

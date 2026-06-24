import { useLanguage } from '../hooks/useTranslations';
import { usePage } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';

export default function NvHomePage() {
  const { currentLang } = useLanguage();
  const { data: homePage, isLoading } = usePage('home');

  return (
    <>
      {isLoading ? (
        <div className="container-site" style={{ padding: '80px 30px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : homePage?.content_blocks?.length ? (
        <ContentBlockRenderer blocks={homePage.content_blocks} />
      ) : null}
    </>
  );
}

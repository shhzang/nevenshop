import { useLanguage } from '../hooks/useTranslations';
import { usePage } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';

export default function NvHomePage() {
  const { currentLang } = useLanguage();
  const { data: homePage, isLoading } = usePage('home');

  return (
    <>
      {/* SEO H1 Title - Hidden but accessible */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Premium NEVEN Disposable Vapes - High Quality Vaping Products
      </h1>
      {isLoading ? (
        <div className="container-site" style={{ padding: '80px 30px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : homePage?.content_blocks?.length ? (
        <ContentBlockRenderer blocks={homePage.content_blocks} lang={currentLang} />
      ) : null}
    </>
  );
}

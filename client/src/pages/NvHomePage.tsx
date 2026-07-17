import { useLanguage } from '../hooks/useTranslations';
import { usePage } from '../hooks/useProductData';
import ContentBlockRenderer from '../components/page/ContentBlockRenderer';
import ContactBar from '../components/ContactBar';
import SocialShareBar from '../components/SocialShareBar';

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
        <>
          <ContentBlockRenderer blocks={homePage.content_blocks} lang={currentLang} />
          {/* Contact and Social Share Section */}
          <div className="bg-gray-50 py-12 px-4">
            <div className="container-site max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                  <ContactBar variant="block" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Share with Friends</h3>
                  <SocialShareBar variant="block" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

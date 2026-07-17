import { useLanguage } from '@/hooks/useTranslations';
import { trpc } from '@/lib/trpc';

interface BlogArticle {
  id: number;
  slug: string;
  date: string;
  featured_image?: string;
  translations: {
    [key: string]: {
      title: string;
      excerpt: string;
      content: string;
    };
  };
}

export default function NvBlogPage() {
  const { currentLang } = useLanguage();
  const { data: blogs = [], isLoading: loading } = trpc.blog.list.useQuery();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading blog articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLang === 'en' && 'Blog'}
            {currentLang === 'de' && 'Blog'}
            {currentLang === 'ar' && 'المدونة'}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentLang === 'en' &&
              'Discover insights, tips, and industry updates about vaping and NEVEN products.'}
            {currentLang === 'de' &&
              'Entdecken Sie Einblicke, Tipps und Branchenupdates über Dampfen und NEVEN-Produkte.'}
            {currentLang === 'ar' &&
              'اكتشف الرؤى والنصائح وتحديثات الصناعة حول التدخين الإلكتروني ومنتجات NEVEN.'}
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {currentLang === 'en' && 'No blog articles available yet.'}
              {currentLang === 'de' && 'Noch keine Blog-Artikel verfügbar.'}
              {currentLang === 'ar' && 'لا توجد مقالات مدونة متاحة حتى الآن.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(blogs as BlogArticle[]).map((blog) => {
              const translation = blog.translations[currentLang] || blog.translations['en'];
              const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <article
                  key={blog.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Featured Image */}
                    {blog.featured_image && (
                      <div className="md:col-span-1">
                        <img
                          src={blog.featured_image}
                          alt={translation.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className={blog.featured_image ? 'md:col-span-2' : 'md:col-span-3'}>
                      <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900">{translation.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{translation.excerpt}</p>

                      {/* Full Content */}
                      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                        {translation.content.split('\n\n').map((paragraph: string, idx: number) => (
                          <p key={idx} className="mb-3 text-sm leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

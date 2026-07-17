import { useLanguage } from '@/hooks/useTranslations';
import BlogCard from '@/components/BlogCard';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(blogs as BlogArticle[]).map((blog) => {
              const translation = blog.translations[currentLang] || blog.translations['en'];
              return (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={translation.title}
                  excerpt={translation.excerpt}
                  date={blog.date}
                  featured_image={blog.featured_image}
                  slug={blog.slug}
                  onReadMore={(slug) => {
                    // Navigate to blog detail page
                    window.location.href = `/${currentLang}/blog/${slug}`;
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

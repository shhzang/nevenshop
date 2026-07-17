import { useLanguage } from '@/hooks/useTranslations';
import BlogCard from './BlogCard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
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

export default function BlogSection() {
  const { currentLang } = useLanguage();
  const { data: blogs = [], isLoading: loading } = trpc.blog.list.useQuery();

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading blog articles...</div>
        </div>
      </section>
    );
  }

  // Get the first 3 blog articles
  const featuredBlogs = (blogs as BlogArticle[]).slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {currentLang === 'en' && 'Latest Blog Articles'}
            {currentLang === 'de' && 'Neueste Blog-Artikel'}
            {currentLang === 'ar' && 'أحدث مقالات المدونة'}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {currentLang === 'en' &&
              'Stay informed with our latest insights on vaping, product innovations, and industry trends.'}
            {currentLang === 'de' &&
              'Bleiben Sie informiert mit unseren neuesten Erkenntnissen über Dampfen, Produktinnovationen und Branchentrends.'}
            {currentLang === 'ar' &&
              'ابق على اطلاع مع أحدث رؤيتنا حول التدخين الإلكتروني والابتكارات والاتجاهات الصناعية.'}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredBlogs.map((blog) => {
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

        {/* View All Button */}
        <div className="text-center">
          <Link to={`/${currentLang}/blog`}>
            <Button size="lg" variant="default">
              {currentLang === 'en' && 'View All Articles'}
              {currentLang === 'de' && 'Alle Artikel anzeigen'}
              {currentLang === 'ar' && 'عرض جميع المقالات'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

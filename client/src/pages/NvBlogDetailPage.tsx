import { useRoute, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

export default function NvBlogDetailPage() {
  const [, params] = useRoute('/:lang/blog/:slug');
  const [, navigate] = useLocation();
  const { currentLang } = useLanguage();

  const slug = params?.slug;
  const { data: blogs = [], isLoading: loading } = trpc.blog.list.useQuery();

  const blog = (blogs as BlogArticle[]).find((b) => b.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {currentLang === 'en' && 'Article not found'}
            {currentLang === 'de' && 'Artikel nicht gefunden'}
            {currentLang === 'ar' && 'لم يتم العثور على المقالة'}
          </h1>
          <Button onClick={() => navigate(`/${currentLang}/blog`)}>
            {currentLang === 'en' && 'Back to Blog'}
            {currentLang === 'de' && 'Zurück zum Blog'}
            {currentLang === 'ar' && 'العودة إلى المدونة'}
          </Button>
        </div>
      </div>
    );
  }

  const translation = blog.translations[currentLang] || blog.translations['en'];
  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/${currentLang}/blog`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentLang === 'en' && 'Back to Blog'}
          {currentLang === 'de' && 'Zurück zum Blog'}
          {currentLang === 'ar' && 'العودة إلى المدونة'}
        </Button>
      </div>

      {/* Featured Image */}
      {blog.featured_image && (
        <div className="w-full h-96 overflow-hidden bg-gray-200">
          <img
            src={blog.featured_image}
            alt={translation.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{translation.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <time dateTime={blog.date}>{formattedDate}</time>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">{translation.excerpt}</p>
        </header>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          {translation.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-6 text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex gap-4">
            <Button onClick={() => navigate(`/${currentLang}/blog`)}>
              {currentLang === 'en' && 'Read More Articles'}
              {currentLang === 'de' && 'Weitere Artikel lesen'}
              {currentLang === 'ar' && 'اقرأ المزيد من المقالات'}
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              {currentLang === 'en' && 'Go Back'}
              {currentLang === 'de' && 'Zurück'}
              {currentLang === 'ar' && 'العودة'}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

import { useLanguage } from '@/hooks/useTranslations';
import { trpc } from '@/lib/trpc';
import { getBlogCategory, getBlogCategoryLabel, type BlogCategory } from '@/lib/blog-category';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';

interface BlogArticle {
  id: number;
  slug: string;
  date: string;
  featured_image?: string;
  seo?: {
    [key: string]: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  translations: {
    [key: string]: {
      title: string;
      excerpt: string;
      content: string;
    };
  };
}

const categoryOrder: BlogCategory[] = ['compliance', 'recycling', 'safety', 'travel', 'product', 'guidance'];
const articlesPerPage = 18;

const libraryCopy = {
  en: {
    eyebrow: 'Adult information library',
    all: 'All articles',
    results: 'articles',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    updated: 'Topics are organized for adult readers. Check local rules and original official guidance before acting.',
  },
  de: {
    eyebrow: 'Informationsbibliothek für Erwachsene',
    all: 'Alle Artikel',
    results: 'Artikel',
    previous: 'Zurück',
    next: 'Weiter',
    page: 'Seite',
    updated: 'Die Themen sind für erwachsene Leser geordnet. Prüfen Sie vor Maßnahmen lokale Regeln und die ursprünglichen offiziellen Hinweise.',
  },
  ar: {
    eyebrow: 'مكتبة معلومات للبالغين',
    all: 'كل المقالات',
    results: 'مقالات',
    previous: 'السابق',
    next: 'التالي',
    page: 'الصفحة',
    updated: 'الموضوعات منظمة للقراء البالغين. راجع القواعد المحلية والإرشادات الرسمية الأصلية قبل اتخاذ أي إجراء.',
  },
};

export default function NvBlogPage() {
  const { currentLang } = useLanguage();
  const { data: blogs = [], isLoading: loading } = trpc.blog.list.useQuery();
  const [activeCategory, setActiveCategory] = useState<'all' | BlogCategory>('all');
  const [page, setPage] = useState(1);
  const copy = libraryCopy[currentLang as keyof typeof libraryCopy] ?? libraryCopy.en;
  const articles = blogs as BlogArticle[];

  const availableCategories = useMemo(
    () => categoryOrder.filter((category) => articles.some((article) => getBlogCategory(article.slug) === category)),
    [articles]
  );
  const filteredArticles = useMemo(
    () => activeCategory === 'all'
      ? articles
      : articles.filter((article) => getBlogCategory(article.slug) === activeCategory),
    [activeCategory, articles]
  );
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const safePage = Math.min(page, totalPages);
  const pageArticles = useMemo(
    () => filteredArticles.slice((safePage - 1) * articlesPerPage, safePage * articlesPerPage),
    [filteredArticles, safePage]
  );

  // Update meta tags for Blog listing page
  useEffect(() => {
    const seoTitles = {
      en: 'Adult Vape Safety, Compliance & Recycling Guides | NEVEN',
      de: 'Leitfäden zu Sicherheit, Compliance und Recycling | NEVEN',
      ar: 'أدلة السلامة والامتثال وإعادة التدوير للبالغين | NEVEN',
    };

    const seoDescriptions = {
      en: 'Read adult-focused NEVEN guides on device storage, battery safety, recycling, travel preparation and responsible retail compliance.',
      de: 'Lesen Sie erwachsenenorientierte NEVEN-Leitfäden zu Aufbewahrung, Batteriesicherheit, Recycling, Reisevorbereitung und verantwortungsvoller Compliance.',
      ar: 'اقرأ أدلة NEVEN الموجهة للبالغين حول التخزين وسلامة البطارية وإعادة التدوير والاستعداد للسفر والامتثال المسؤول في البيع بالتجزئة.',
    };

    const seoKeywords = {
      en: 'adult vape safety, vape battery storage, e-cigarette recycling, vape travel rules, adult retail compliance',
      de: 'E-Zigarette Sicherheit für Erwachsene, Akku Aufbewahrung, E-Zigarette Recycling, Reisen mit Vape, Händler Compliance',
      ar: 'سلامة السجائر الإلكترونية للبالغين، تخزين بطارية الفيب، إعادة تدوير السجائر الإلكترونية، السفر مع الفيب، امتثال البيع للبالغين',
    };

    document.title = seoTitles[currentLang as keyof typeof seoTitles] || seoTitles.en;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      seoDescriptions[currentLang as keyof typeof seoDescriptions] || seoDescriptions.en
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      seoKeywords[currentLang as keyof typeof seoKeywords] || seoKeywords.en
    );

    let script = document.querySelector('script[type="application/ld+json"][data-type="blog-listing"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-type', 'blog-listing');
      document.head.appendChild(script);
    }

    const blogListingSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Blog',
      description:
        seoDescriptions[currentLang as keyof typeof seoDescriptions] || seoDescriptions.en,
      url: `https://neven.bar/${currentLang}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'NEVEN',
        logo: {
          '@type': 'ImageObject',
          url: 'https://neven.bar/logo.png',
        },
      },
    };

    script.textContent = JSON.stringify(blogListingSchema);
  }, [currentLang]);

  const selectCategory = (category: 'all' | BlogCategory) => {
    setActiveCategory(category);
    setPage(1);
  };

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
    <div className="min-h-screen bg-gray-50" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{copy.eyebrow}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold mb-4">
            {currentLang === 'en' && 'Blog'}
            {currentLang === 'de' && 'Blog'}
            {currentLang === 'ar' && 'المدونة'}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentLang === 'en' &&
              'Discover insights, safety guidance, recycling information and responsible adult retail updates.'}
            {currentLang === 'de' &&
              'Entdecken Sie Einblicke, Sicherheitsinformationen, Recyclinghinweise und verantwortungsvolle Updates für den Erwachsenenhandel.'}
            {currentLang === 'ar' &&
              'اكتشف الرؤى وإرشادات السلامة ومعلومات إعادة التدوير وتحديثات البيع المسؤول للبالغين.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="Blog topics">
            <button
              type="button"
              aria-pressed={activeCategory === 'all'}
              onClick={() => selectCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === 'all' ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-900'}`}
            >
              {copy.all}
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => selectCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-900'}`}
              >
                {getBlogCategoryLabel(category, currentLang)}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone-600">{filteredArticles.length} {copy.results}. {copy.updated}</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {currentLang === 'en' && 'No blog articles available yet.'}
              {currentLang === 'de' && 'Noch keine Blog-Artikel verfügbar.'}
              {currentLang === 'ar' && 'لا توجد مقالات مدونة متاحة حتى الآن.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {pageArticles.map((blog) => {
                const translation = blog.translations[currentLang] || blog.translations.en;
                const formattedDate = new Date(blog.date).toLocaleDateString(
                  currentLang === 'de' ? 'de-DE' : currentLang === 'ar' ? 'ar' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );

                return (
                  <article
                    key={blog.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="flex h-full flex-col p-5">
                      {blog.featured_image && (
                        <Link href={`/${currentLang}/blog/${blog.slug}`} className="block overflow-hidden rounded-lg">
                          <img
                            src={blog.featured_image}
                            alt={translation.title}
                            className="h-48 w-full object-cover transition duration-300 hover:scale-[1.02]"
                          />
                        </Link>
                      )}

                      <div className="flex flex-1 flex-col pt-5">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>{formattedDate}</span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                            {getBlogCategoryLabel(getBlogCategory(blog.slug), currentLang)}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">
                          <Link href={`/${currentLang}/blog/${blog.slug}`} className="hover:underline">
                            {translation.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-5 line-clamp-3">{translation.excerpt}</p>
                        <Link href={`/${currentLang}/blog/${blog.slug}`} className="mt-auto inline-flex w-fit font-semibold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900">
                          {currentLang === 'ar' ? 'اقرأ المقال' : currentLang === 'de' ? 'Artikel lesen' : 'Read article'}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Blog pagination">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copy.previous}
                </button>
                <p className="text-sm text-stone-600">{copy.page} {safePage} / {totalPages}</p>
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copy.next}
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { Link, useParams } from "wouter";
import { useEffect, useMemo } from "react";
import { useLanguage } from "@/hooks/useTranslations";
import { trpc } from "@/lib/trpc";

interface BlogArticle {
  id: number;
  slug: string;
  date: string;
  featured_image?: string;
  seo?: Record<string, { title: string; description: string; keywords: string }>;
  translations: Record<string, { title: string; excerpt: string; content: string }>;
}

const copy = {
  en: { blog: "Blog", back: "All articles", related: "Continue reading", notFound: "This article is not available." },
  de: { blog: "Blog", back: "Alle Artikel", related: "Weiterlesen", notFound: "Dieser Artikel ist nicht verfügbar." },
  ar: { blog: "المدونة", back: "كل المقالات", related: "تابع القراءة", notFound: "هذه المقالة غير متاحة." },
};

export default function NvBlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { currentLang } = useLanguage();
  const { data: article, isLoading } = trpc.blog.getBySlug.useQuery({ slug });
  const { data: allArticles = [] } = trpc.blog.list.useQuery();
  const text = copy[currentLang as keyof typeof copy] ?? copy.en;
  const activeArticle = article as BlogArticle | undefined;
  const translation = activeArticle?.translations[currentLang] ?? activeArticle?.translations.en;
  const seo = activeArticle?.seo?.[currentLang] ?? activeArticle?.seo?.en;
  const related = useMemo(
    () => (allArticles as BlogArticle[]).filter((item) => item.slug !== slug).slice(0, 3),
    [allArticles, slug]
  );

  useEffect(() => {
    if (!activeArticle || !translation) return;
    document.title = seo?.title ?? translation.title;
    const updateMeta = (selector: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        if (selector.includes("description")) meta.name = "description";
        if (selector.includes("keywords")) meta.name = "keywords";
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    updateMeta('meta[name="description"]', seo?.description ?? translation.excerpt);
    updateMeta('meta[name="keywords"]', seo?.keywords ?? "");
  }, [activeArticle, seo, translation]);

  if (isLoading) {
    return <div className="min-h-screen bg-stone-50 px-4 py-24 text-center text-stone-600">Loading article…</div>;
  }

  if (!activeArticle || !translation) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-24 text-center">
        <p className="text-stone-700">{text.notFound}</p>
        <Link href={`/${currentLang}/blog`} className="mt-5 inline-block font-semibold text-stone-900 underline underline-offset-4">
          {text.back}
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(
    currentLang === "de" ? "de-DE" : currentLang === "ar" ? "ar" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  ).format(new Date(activeArticle.date));
  const paragraphs = translation.content.split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-20" dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <article className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-stone-500">
          <Link href={`/${currentLang}/blog`} className="transition-colors hover:text-stone-900">
            {text.blog}
          </Link>
          <span className="px-2">/</span>
          <span aria-current="page">{translation.title}</span>
        </nav>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{formattedDate}</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">{translation.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">{translation.excerpt}</p>

        {activeArticle.featured_image && (
          <img
            src={activeArticle.featured_image}
            alt={translation.title}
            className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover shadow-sm"
          />
        )}

        <div className="prose prose-stone mt-10 max-w-none prose-headings:font-semibold prose-p:text-[1.06rem] prose-p:leading-8">
          {paragraphs.map((paragraph, index) => {
            const looksLikeHeading = paragraph.length < 70 && !/[.!؟。]$/.test(paragraph);
            return looksLikeHeading ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>;
          })}
        </div>

        <div className="mt-12 border-t border-stone-200 pt-7">
          <Link href={`/${currentLang}/blog`} className="font-semibold text-stone-900 underline decoration-stone-400 underline-offset-4 transition-colors hover:decoration-stone-900">
            ← {text.back}
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8" aria-labelledby="related-articles-heading">
          <h2 id="related-articles-heading" className="text-2xl font-semibold text-stone-900">{text.related}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => {
              const itemTranslation = item.translations[currentLang] ?? item.translations.en;
              return (
                <Link key={item.id} href={`/${currentLang}/blog/${item.slug}`} className="group rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{new Date(item.date).getFullYear()}</p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-stone-900 group-hover:underline">{itemTranslation.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{itemTranslation.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

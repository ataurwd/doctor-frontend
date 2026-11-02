import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import PostCard from '@/components/PostCard';
import EducationTabs from '@/components/EducationTabs';
import FallbackNotice from '@/components/FallbackNotice';
import { fetchApi } from '@/lib/api';
import { t, tr, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.education_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.education_description'),
  };
}

export default async function EducationIndexPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  const q = String(sp?.q || '').trim();
  const categorySlug = String(sp?.category || '').trim();
  const page = String(sp?.page || '1');

  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (categorySlug) query.set('category', categorySlug);
  if (page !== '1') query.set('page', page);

  const res = await fetchApi(`/posts?${query.toString()}`);
  const posts = res?.posts || [];
  const categories = res?.categories || [];
  const activeCategory = res?.activeCategory || null;

  const showFallback = posts.some((p) => usesFallback(p, ['title', 'excerpt'], locale));

  const buildFilterUrl = (catSlug) => {
    const p = new URLSearchParams();
    if (catSlug) p.set('category', catSlug);
    if (q) p.set('q', q);
    const qs = p.toString();
    return qs ? `/${locale}/patient-education?${qs}` : `/${locale}/patient-education`;
  };

  return (
    <div className="container-site pt-12 md:pt-18 pb-16">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{t(locale, 'education.heading')}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft leading-relaxed">{t(locale, 'education.intro')}</p>

      <EducationTabs locale={locale} activeTab="articles" />

      <form
        method="GET"
        action={`/${locale}/patient-education`}
        role="search"
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="q" className="sr-only">
          {t(locale, 'education.search_label')}
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          className="field sm:flex-1"
          placeholder={t(locale, 'education.search_placeholder')}
          maxLength={100}
        />
        {activeCategory && <input type="hidden" name="category" value={activeCategory.slug} />}
        <button type="submit" className="btn btn-primary shrink-0">
          <SiteIcon name="search" /> {t(locale, 'buttons.search')}
        </button>
      </form>

      <div className="mt-8" aria-label={t(locale, 'education.categories')}>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={buildFilterUrl('')}
              className={`pill no-underline active:scale-[0.98] transition-all ${!activeCategory ? '!bg-teal !text-white !border-teal shadow-xs' : ''}`}
              aria-current={!activeCategory ? 'true' : undefined}
            >
              {t(locale, 'education.all_categories')}
            </Link>
          </li>
          {categories.map((cat) => {
            const active = activeCategory?.slug === cat.slug;
            return (
              <li key={cat._id}>
                <Link
                  href={buildFilterUrl(cat.slug)}
                  className={`pill no-underline active:scale-[0.98] transition-all ${active ? '!bg-teal !text-white !border-teal shadow-xs' : ''}`}
                  aria-current={active ? 'true' : undefined}
                >
                  {tr(cat, 'name', locale)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {q !== '' && (
        <p className="mt-8 text-lg font-semibold">
          {t(locale, 'education.results_for', { q })}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="card mt-8">{t(locale, 'education.none')}</p>
      ) : (
        <>
          <div className="mt-6">
            <FallbackNotice show={showFallback} />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} locale={locale} headingTag="h2" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


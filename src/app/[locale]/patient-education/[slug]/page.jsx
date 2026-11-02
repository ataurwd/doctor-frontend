import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteIcon from '@/components/SiteIcon';
import PrintButton from '@/components/PrintButton';
import FallbackNotice from '@/components/FallbackNotice';
import { fetchApi, getBootstrapData, renderMarkdown } from '@/lib/api';
import { t, tr, formatDate, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const res = await fetchApi(`/posts/${slug}`);
  if (!res?.post) return {};
  return {
    title: `${tr(res.post, 'title', locale)} | ${t(locale, 'meta.suffix')}`,
    description: String(tr(res.post, 'excerpt', locale) || '').slice(0, 160),
  };
}

export default async function EducationShowPage({ params }) {
  const { locale, slug } = await params;
  const [res, bootstrap] = await Promise.all([
    fetchApi(`/posts/${slug}`),
    getBootstrapData(),
  ]);
  if (!res?.post) notFound();

  const { post, related = [] } = res;
  const doctor = bootstrap?.doctor || null;

  const title = tr(post, 'title', locale);
  const bodyMarkdown = tr(post, 'body', locale);
  const bodyHtml = renderMarkdown(bodyMarkdown);
  const showFallback = usesFallback(post, ['title', 'body'], locale);

  const medicalWebPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: title,
    description: tr(post, 'excerpt', locale),
    datePublished: post.published_at,
    dateModified: post.updatedAt || post.published_at,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageJsonLd) }}
      />

      <div className="container-site grid gap-12 pt-10 md:pt-16 pb-16 lg:grid-cols-[2fr_1fr]">
        <article>
          <nav className="no-print text-sm font-semibold text-teal" aria-label="Breadcrumb">
            <Link
              href={`/${locale}/patient-education`}
              className="inline-flex min-h-10 items-center hover:text-teal-deep"
            >
              &larr; {t(locale, 'nav.education')}
            </Link>
            {post.category && (
              <>
                <span aria-hidden="true" className="mx-2 text-line">/</span>
                <Link
                  href={`/${locale}/patient-education?category=${post.category.slug}`}
                  className="inline-flex min-h-10 items-center hover:text-teal-deep"
                >
                  {tr(post.category, 'name', locale)}
                </Link>
              </>
            )}
          </nav>

          <p className="print-only text-sm">
            {tr(doctor, 'name', locale)} · {tr(doctor, 'specialty_line', locale)}
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] leading-[1.08]">{title}</h1>
          <p className="mt-3 text-sm text-ink-soft">
            <time dateTime={post.published_at}>
              {t(locale, 'education.published', {
                date: formatDate(post.published_at, locale),
              })}
            </time>
          </p>

          <div className="no-print mt-6 flex flex-wrap gap-2.5">
            <PrintButton label={t(locale, 'buttons.print')} />
            {(post.handouts || []).map((handout) =>
              handout.file_path ? (
                <a
                  key={handout._id}
                  href={handout.file_path}
                  className="btn btn-primary"
                  download
                >
                  <SiteIcon name="download" /> {t(locale, 'buttons.download_handout')}
                </a>
              ) : null
            )}
          </div>

          <div className="mt-6">
            <FallbackNotice show={showFallback} />
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt=""
              width={1200}
              height={675}
              className="mt-6 aspect-video w-full rounded-[24px] border border-line object-cover shadow-xs"
              fetchPriority="high"
              decoding="async"
            />
          )}

          <div
            className="prose-site mt-8 text-base sm:text-lg leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>

        <aside className="no-print space-y-6 lg:sticky lg:top-24 self-start">
          {related.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">{t(locale, 'education.related')}</h2>
              <ul className="mt-4 space-y-1">
                {related.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/${locale}/patient-education/${item.slug}`}
                      className="flex min-h-11 items-center rounded-full px-4 py-2 text-sm sm:text-base text-ink no-underline transition-all hover:bg-paper-alt active:scale-[0.98]"
                    >
                      {tr(item, 'title', locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <p className="font-semibold text-lg text-ink">{t(locale, 'specialities.book_text')}</p>
            <Link href={`/${locale}/appointment`} className="btn btn-accent mt-5 w-full">
              {t(locale, 'buttons.request_appointment')}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}


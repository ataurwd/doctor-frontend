import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import BookingBand from '@/components/BookingBand';
import FallbackNotice from '@/components/FallbackNotice';
import { getBootstrapData } from '@/lib/api';
import { t, tr, digits, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.services_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.services_description'),
  };
}

export default async function ServicesIndexPage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const items = data?.specialServices || [];
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  const showFallback = items.some((item) => usesFallback(item, ['title', 'summary'], locale));

  return (
    <>
      <div className="container-site pt-12 md:pt-18 pb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">
          {t(locale, 'services.heading')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft leading-relaxed">{t(locale, 'services.intro')}</p>
        <div className="mt-4">
          <FallbackNotice show={showFallback} />
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <li key={item._id}>
              <article className="card flex h-full flex-col hover:-translate-y-1">
                <p className="font-display text-4xl font-semibold text-accent leading-none" aria-hidden="true">
                  {digits(String(idx + 1).padStart(2, '0'), locale)}
                </p>
                <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-[-0.02em]">
                  <Link
                    href={`/${locale}/services/${item.slug}`}
                    prefetch={true}
                    className="inline-flex min-h-11 items-center text-ink no-underline hover:text-teal"
                  >
                    {tr(item, 'title', locale)}
                  </Link>
                </h2>
                <p className="mt-3 text-base sm:text-lg text-ink-soft leading-relaxed">{tr(item, 'summary', locale)}</p>
                <Link
                  href={`/${locale}/services/${item.slug}`}
                  prefetch={true}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-semibold text-teal hover:text-teal-deep active:scale-[0.98] transition-transform"
                >
                  {t(locale, 'buttons.learn_more')}
                  <span className="sr-only">: {tr(item, 'title', locale)}</span>{' '}
                  <SiteIcon name="arrow" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <BookingBand locale={locale} chambers={chambers} settings={settings} />
    </>
  );
}


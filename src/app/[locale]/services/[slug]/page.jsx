import { notFound } from 'next/navigation';
import DetailPage from '@/components/DetailPage';
import { fetchApi, getBootstrapData } from '@/lib/api';
import { t, tr, trList, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const res = await fetchApi(`/services/${slug}`);
  if (!res?.item) return {};
  return {
    title: `${tr(res.item, 'title', locale)} | ${t(locale, 'meta.suffix')}`,
    description: String(tr(res.item, 'summary', locale) || '').slice(0, 160),
  };
}

export default async function ServiceShowPage({ params }) {
  const { locale, slug } = await params;
  const [res, bootstrap] = await Promise.all([
    fetchApi(`/services/${slug}`),
    getBootstrapData(),
  ]);
  if (!res?.item) notFound();

  const { item, others } = res;
  const chambers = bootstrap?.chambers || [];
  const settings = bootstrap?.settings || {};

  const sections = [
    [t(locale, 'specialities.what_it_is'), tr(item, 'what_it_is', locale)],
    [t(locale, 'services.who_needs_it'), trList(item, 'who_needs_it', locale)],
    [t(locale, 'services.what_to_expect'), tr(item, 'what_to_expect', locale)],
    [t(locale, 'services.benefits'), tr(item, 'benefits', locale)],
    [t(locale, 'specialities.how_helps'), tr(item, 'how_dr_sajib_helps', locale)],
  ];

  const customWhen = tr(item, 'when_to_see', locale);
  const whenHeading = customWhen
    ? t(locale, 'specialities.when_to_see')
    : t(locale, 'services.when_to_see');
  const whenText = customWhen || t(locale, 'services.when_default');

  const showFallback = usesFallback(
    item,
    ['title', 'what_it_is', 'who_needs_it', 'what_to_expect', 'benefits'],
    locale
  );

  return (
    <DetailPage
      locale={locale}
      item={item}
      sections={sections}
      whenHeading={whenHeading}
      whenText={whenText}
      others={others}
      othersHeading={t(locale, 'services.others')}
      othersBasePath={`/${locale}/services`}
      indexPath={`/${locale}/services`}
      indexLabel={t(locale, 'nav.services')}
      chambers={chambers}
      settings={settings}
      showFallback={showFallback}
    />
  );
}


import { notFound } from 'next/navigation';
import DetailPage from '@/components/DetailPage';
import { fetchApi, getBootstrapData } from '@/lib/api';
import { t, tr, trList, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const res = await fetchApi(`/specialities/${slug}`);
  if (!res?.item) return {};
  return {
    title: `${tr(res.item, 'title', locale)} | ${t(locale, 'meta.suffix')}`,
    description: String(tr(res.item, 'summary', locale) || '').slice(0, 160),
  };
}

export default async function SpecialityShowPage({ params }) {
  const { locale, slug } = await params;
  const [res, bootstrap] = await Promise.all([
    fetchApi(`/specialities/${slug}`),
    getBootstrapData(),
  ]);
  if (!res?.item) notFound();

  const { item, others } = res;
  const chambers = bootstrap?.chambers || [];
  const settings = bootstrap?.settings || {};

  const sections = [
    [t(locale, 'specialities.what_it_is'), tr(item, 'what_it_is', locale)],
    [t(locale, 'specialities.common_symptoms'), trList(item, 'common_symptoms', locale)],
    [t(locale, 'specialities.how_helps'), tr(item, 'how_dr_sajib_helps', locale)],
  ];

  const showFallback = usesFallback(
    item,
    ['title', 'what_it_is', 'common_symptoms', 'how_dr_sajib_helps', 'when_to_see'],
    locale
  );

  return (
    <DetailPage
      locale={locale}
      item={item}
      sections={sections}
      whenHeading={t(locale, 'specialities.when_to_see')}
      whenText={tr(item, 'when_to_see', locale)}
      others={others}
      othersHeading={t(locale, 'specialities.others')}
      othersBasePath={`/${locale}/specialities`}
      indexPath={`/${locale}/specialities`}
      indexLabel={t(locale, 'nav.specialities')}
      chambers={chambers}
      settings={settings}
      showFallback={showFallback}
    />
  );
}


import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import ChamberCard from '@/components/ChamberCard';
import { getBootstrapData } from '@/lib/api';
import { buildPhysicianSchema } from '@/lib/schemaOrg';
import { t, settingLocalized } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.chambers_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.chambers_description'),
  };
}

export default async function ChambersPage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const doctor = data?.doctor || null;
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  const physicianJsonLd = buildPhysicianSchema(doctor, chambers, settings, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />

      <div className="container-site pt-12 md:pt-18 pb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{t(locale, 'chambers.heading')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft leading-relaxed">{t(locale, 'chambers.intro')}</p>

        <p
          className="notice-box mt-8 flex gap-3 text-base sm:text-lg font-semibold shadow-2xs"
          role="note"
          data-confirm-note
        >
          <SiteIcon name="alert" className="mt-1 size-6 shrink-0 text-accent-deep" />
          {settingLocalized(settings, 'hours_banner_text', locale)}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {chambers.length > 0 ? (
            chambers.map((chamber) => (
              <ChamberCard
                key={chamber._id}
                chamber={chamber}
                locale={locale}
                settings={settings}
                headingTag="h2"
                showEmail
              />
            ))
          ) : (
            <p>{t(locale, 'chambers.none')}</p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/appointment`} className="btn btn-accent">
            {t(locale, 'buttons.request_appointment')}
          </Link>
        </div>
      </div>
    </>
  );
}


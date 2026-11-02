import SiteIcon from '@/components/SiteIcon';
import DoctorPhoto from '@/components/DoctorPhoto';
import BookingBand from '@/components/BookingBand';
import FallbackNotice from '@/components/FallbackNotice';
import { getBootstrapData } from '@/lib/api';
import { t, tr, usesFallback } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const name = tr(data?.doctor, 'name', locale) || t(locale, 'site_name');
  return {
    title: `${t(locale, 'meta.about_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.about_description', { name }),
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const doctor = data?.doctor || null;
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  const name = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const paragraphs = String(tr(doctor, 'bio', locale) || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const facebookUrl = settings.facebook_url || doctor?.facebook_url;

  return (
    <>
      <div className="container-site grid gap-12 pt-12 md:grid-cols-[1fr_1.8fr] md:pt-18 pb-12">
        <div>
          <DoctorPhoto
            doctor={doctor}
            locale={locale}
            eager
            className="aspect-[4/5] w-full max-w-sm rounded-[24px] border border-line shadow-[0_8px_30px_rgba(27,46,42,0.06)]"
          />
          {settings.doctor_photo_credit && doctor?.photo_path && (
            <p className="mt-2.5 text-xs sm:text-sm text-ink-soft">{settings.doctor_photo_credit}</p>
          )}
        </div>
        <div>
          <p className="eyebrow">{t(locale, 'about.heading')}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{name}</h1>
          <p className="mt-3 text-xl font-medium text-teal">
            {tr(doctor, 'specialty_line', locale)}
          </p>

          <div className="mt-6">
            <FallbackNotice show={usesFallback(doctor, ['bio'], locale)} />
            <div className="prose-site text-base sm:text-lg leading-relaxed space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="card">
              <dt className="eyebrow">{t(locale, 'about.qualifications')}</dt>
              <dd className="mt-2 text-base sm:text-lg font-semibold text-ink">{tr(doctor, 'credentials', locale)}</dd>
            </div>
            <div className="card">
              <dt className="eyebrow">{t(locale, 'about.works_at')}</dt>
              <dd className="mt-2 text-base sm:text-lg font-semibold text-ink">{tr(doctor, 'title_line', locale)}</dd>
            </div>
          </dl>

          {facebookUrl && (
            <div className="mt-8 card flex flex-wrap items-center justify-between gap-4">
              <p className="text-base text-ink">{t(locale, 'about.facebook_text')}</p>
              <a
                href={facebookUrl}
                className="btn btn-secondary"
                rel="noopener noreferrer"
                target="_blank"
              >
                <SiteIcon name="facebook" /> {t(locale, 'about.facebook')}
              </a>
            </div>
          )}
        </div>
      </div>

      <BookingBand locale={locale} chambers={chambers} settings={settings} />
    </>
  );
}


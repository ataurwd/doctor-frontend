import ChamberCard from '@/components/ChamberCard';
import AppointmentForm from './AppointmentForm';
import { getBootstrapData } from '@/lib/api';
import { t, settingLocalized } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.appointment_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.appointment_description'),
  };
}

export default async function AppointmentPage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  return (
    <div className="container-site grid gap-12 pt-12 md:pt-18 pb-16 lg:grid-cols-[3fr_2fr]">
      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{t(locale, 'appointment.heading')}</h1>
        <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">{t(locale, 'appointment.intro')}</p>
        <p className="mt-3 font-semibold text-accent-deep">{t(locale, 'appointment.not_confirmed')}</p>

        <AppointmentForm locale={locale} chambers={chambers} />
      </div>

      <aside className="space-y-6">
        <p className="notice-box text-base sm:text-lg font-semibold shadow-2xs">
          {settingLocalized(settings, 'hours_banner_text', locale)}
        </p>
        {chambers.map((chamber) => (
          <ChamberCard
            key={chamber._id}
            chamber={chamber}
            locale={locale}
            settings={settings}
            headingTag="h2"
          />
        ))}
      </aside>
    </div>
  );
}


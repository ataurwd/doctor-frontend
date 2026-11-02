import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import { t } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.thanks_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.thanks_description'),
    robots: { index: false },
  };
}

export default async function AppointmentThanksPage({ params }) {
  const { locale } = await params;

  return (
    <div className="container-site pt-12 md:pt-20">
      <div className="card mx-auto max-w-2xl text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-teal text-white">
          <SiteIcon name="check" className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl">{t(locale, 'appointment.thanks_heading')}</h1>
        <p className="mt-4 text-xl" data-thanks-text>
          {t(locale, 'appointment.thanks_text')}
        </p>
        <p className="mt-4 text-ink-soft">{t(locale, 'appointment.thanks_urgent')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}/chambers`} className="btn btn-outline">
            {t(locale, 'buttons.see_hours')}
          </Link>
          <Link href={`/${locale}`} className="btn btn-primary">
            {t(locale, 'buttons.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}


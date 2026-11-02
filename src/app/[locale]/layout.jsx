import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import { getBootstrapData } from '@/lib/api';
import { t } from '@/i18n/translations';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') {
    notFound();
  }

  const data = await getBootstrapData();
  const doctor = data?.doctor || null;
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  return (
    <div lang={locale} className="min-h-screen pb-24 md:pb-0 flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3"
      >
        {t(locale, 'skip_to_content')}
      </a>

      <Suspense fallback={null}>
        <Header locale={locale} doctor={doctor} />
      </Suspense>

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer locale={locale} doctor={doctor} chambers={chambers} settings={settings} />
      <MobileBar locale={locale} settings={settings} />
    </div>
  );
}


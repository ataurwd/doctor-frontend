import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import EducationTabs from '@/components/EducationTabs';
import { fetchApi } from '@/lib/api';
import { t, tr } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.downloads_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.downloads_description'),
  };
}

export default async function DownloadsPage({ params }) {
  const { locale } = await params;
  const handouts = (await fetchApi('/handouts')) || [];

  return (
    <div className="container-site pt-12 md:pt-18 pb-16">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{t(locale, 'education.heading')}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft leading-relaxed">
        {t(locale, 'education.downloads_intro')}
      </p>

      <EducationTabs locale={locale} activeTab="downloads" />

      {handouts.length === 0 ? (
        <p className="card mt-10">{t(locale, 'education.downloads_none')}</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {handouts.map((handout) => (
            <li key={handout._id} className="card flex h-full flex-col hover:-translate-y-1">
              <p className="eyebrow">{t(locale, 'education.handout')}</p>
              <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-[-0.02em]">{tr(handout, 'title', locale)}</h2>
              {handout.post && (
                <p className="mt-2 text-base text-ink-soft">
                  <Link href={`/${locale}/patient-education/${handout.post.slug}`} className="text-teal hover:text-teal-deep">
                    {t(locale, 'education.from_article', {
                      title: tr(handout.post, 'title', locale),
                    })}
                  </Link>
                </p>
              )}
              <div className="mt-auto pt-6">
                {handout.file_path ? (
                  <a href={handout.file_path} className="btn btn-primary" download>
                    <SiteIcon name="download" /> {t(locale, 'buttons.download')}
                  </a>
                ) : handout.post ? (
                  <Link
                    href={`/${locale}/patient-education/${handout.post.slug}`}
                    className="btn btn-secondary"
                  >
                    <SiteIcon name="print" /> {t(locale, 'buttons.read_more')}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


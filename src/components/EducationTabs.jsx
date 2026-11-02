import Link from 'next/link';
import { t } from '@/i18n/translations';

export default function EducationTabs({ locale = 'en', activeTab = 'articles' }) {
  const tabs = [
    { key: 'articles', href: `/${locale}/patient-education`, label: t(locale, 'education.articles_tab') },
    { key: 'downloads', href: `/${locale}/downloads`, label: t(locale, 'education.downloads') },
  ];

  return (
    <nav className="no-print mt-8 inline-flex rounded-full border border-line bg-white/80 p-1.5 shadow-2xs" aria-label={t(locale, 'nav.education')}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`flex min-h-10 items-center rounded-full px-5 text-sm sm:text-base font-semibold no-underline transition-all duration-150 active:scale-[0.98] ${
              active
                ? 'bg-teal text-white shadow-xs'
                : 'text-ink-soft hover:bg-paper-alt hover:text-ink'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}


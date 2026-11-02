'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import SiteIcon from './SiteIcon';
import { LogoMark } from './Logo';
import { t, tr } from '@/i18n/translations';

export default function Header({ locale = 'en', doctor }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${locale}`;
  const searchParams = useSearchParams();
  const isBn = locale === 'bn';

  const doctorName = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const specialtyLine = tr(doctor, 'specialty_line', locale);

  const switchUrl = (targetLocale) => {
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'bn') {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }
    const base = segments.join('/') || `/${targetLocale}`;
    const qs = searchParams?.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const menu = [
    { href: `/${locale}`, label: t(locale, 'nav.home'), match: (p) => p === `/${locale}` },
    {
      href: `/${locale}/about`,
      label: t(locale, 'nav.about'),
      match: (p) => p.startsWith(`/${locale}/about`),
    },
    {
      href: `/${locale}/specialities`,
      label: t(locale, 'nav.specialities'),
      match: (p) => p.startsWith(`/${locale}/specialities`),
    },
    {
      href: `/${locale}/services`,
      label: t(locale, 'nav.services'),
      match: (p) => p.startsWith(`/${locale}/services`),
    },
    {
      href: `/${locale}/chambers`,
      label: t(locale, 'nav.chambers'),
      match: (p) => p.startsWith(`/${locale}/chambers`),
    },
    {
      href: `/${locale}/patient-education`,
      label: t(locale, 'nav.education'),
      match: (p) =>
        p.startsWith(`/${locale}/patient-education`) || p.startsWith(`/${locale}/downloads`),
    },
    {
      href: `/${locale}/contact`,
      label: t(locale, 'nav.contact'),
      match: (p) => p.startsWith(`/${locale}/contact`),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md transition-all">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline shrink-0 active:scale-[0.98] transition-transform">
          <LogoMark className="size-11" theme="light" />
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
              {doctorName}
            </span>
            <span className="hidden text-xs font-medium text-ink-soft sm:block">
              {specialtyLine}
            </span>
          </div>
        </Link>

        {/* Desktop unified nav menu */}
        <nav className="hidden lg:flex items-center rounded-full border border-line/70 bg-white/70 p-1 shadow-2xs backdrop-blur-xs shrink-0" aria-label={t(locale, 'nav.main')}>
          <ul className="flex items-center gap-1 xl:gap-1.5 whitespace-nowrap">
            {menu.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`flex h-9 items-center rounded-full px-3 xl:px-4 text-xs xl:text-sm font-semibold whitespace-nowrap no-underline transition-all duration-150 active:scale-[0.98] ${
                      active
                        ? 'bg-teal text-white shadow-xs'
                        : 'text-ink-soft hover:bg-paper-alt hover:text-ink'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            className="flex items-center rounded-full border border-line/80 bg-white/90 p-0.5 text-xs font-bold shadow-2xs"
            role="group"
            aria-label={t(locale, 'nav.language')}
          >
            {isBn ? (
              <>
                <Link
                  href={switchUrl('en')}
                  hrefLang="en"
                  lang="en"
                  prefetch={true}
                  className="flex h-8 items-center justify-center rounded-full px-2.5 font-semibold text-ink-soft no-underline transition-colors hover:text-teal active:scale-[0.98]"
                  data-lang-switch="en"
                >
                  EN
                </Link>
                <span
                  className="flex h-8 items-center justify-center rounded-full bg-teal px-3 font-semibold text-white shadow-xs"
                  aria-current="true"
                  lang="bn"
                >
                  বাংলা
                </span>
              </>
            ) : (
              <>
                <span
                  className="flex h-8 items-center justify-center rounded-full bg-teal px-3 font-semibold text-white shadow-xs"
                  aria-current="true"
                >
                  EN
                </span>
                <Link
                  href={switchUrl('bn')}
                  hrefLang="bn"
                  lang="bn"
                  prefetch={true}
                  className="flex h-8 items-center justify-center rounded-full px-2.5 font-semibold text-ink-soft no-underline transition-colors hover:text-teal active:scale-[0.98]"
                  data-lang-switch="bn"
                >
                  বাংলা
                </Link>
              </>
            )}
          </div>

          <Link
            href={`/${locale}/appointment`}
            className="btn btn-accent hidden sm:inline-flex text-xs xl:text-sm h-10 px-4.5"
          >
            {t(locale, 'nav.request_appointment')}
          </Link>

          <button
            type="button"
            className="btn-icon-circular size-10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">
              {open ? t(locale, 'nav.close_menu') : t(locale, 'nav.open_menu')}
            </span>
            {!open ? <SiteIcon name="menu" className="size-5" /> : <SiteIcon name="close" className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-line/80 bg-paper/95 backdrop-blur-md lg:hidden"
          aria-label={t(locale, 'nav.main')}
        >
          <ul className="container-site flex flex-col py-4 space-y-1.5">
            {menu.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center rounded-2xl px-5 text-base font-semibold no-underline transition-colors ${
                      active ? 'bg-teal text-white shadow-xs' : 'text-ink hover:bg-paper-alt'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-3">
              <Link
                href={`/${locale}/appointment`}
                onClick={() => setOpen(false)}
                className="btn btn-accent w-full"
              >
                {t(locale, 'nav.request_appointment')}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}


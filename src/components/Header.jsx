'use client';

import { useState, useEffect } from 'react';
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

  // Prevent background scrolling when off-canvas is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close off-canvas on route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close off-canvas on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <Link href={`/${locale}`} prefetch={true} className="flex items-center gap-3 no-underline shrink-0 active:scale-[0.98] transition-transform">
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
                    prefetch={true}
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
            prefetch={true}
            className="btn btn-accent hidden sm:inline-flex text-xs xl:text-sm h-10 px-4.5"
          >
            {t(locale, 'nav.request_appointment')}
          </Link>

          <button
            type="button"
            className="btn-icon-circular size-10 lg:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-offcanvas-menu"
          >
            <span className="sr-only">
              {open ? t(locale, 'nav.close_menu') : t(locale, 'nav.open_menu')}
            </span>
            <SiteIcon name="menu" className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Off-Canvas Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Off-Canvas Drawer (Slide-Over from Right) */}
      <aside
        id="mobile-offcanvas-menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[84vw] max-w-[340px] bg-paper border-l border-line/80 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, 'nav.main')}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-3.5 bg-white/70">
          <Link
            href={`/${locale}`}
            prefetch={true}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 no-underline"
          >
            <LogoMark className="size-9" theme="light" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold leading-tight text-ink">
                {doctorName}
              </span>
              <span className="text-[10px] font-medium text-ink-soft line-clamp-1">
                {specialtyLine}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-8.5 items-center justify-center rounded-full bg-paper-alt text-ink-soft hover:bg-white hover:text-ink border border-line/70 transition-colors cursor-pointer"
            aria-label={t(locale, 'nav.close_menu')}
          >
            <SiteIcon name="close" className="size-4" />
          </button>
        </div>

        {/* Drawer Language Switcher Bar */}
        <div className="px-4 pt-3 pb-2 border-b border-line/50 bg-paper-alt/30">
          <div className="flex items-center justify-between rounded-xl bg-white/90 p-1 border border-line/70 text-xs">
            <span className="text-[11px] font-semibold text-ink-soft px-2">
              {isBn ? 'ভাষা নির্বাচন' : 'Language'}
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={switchUrl('en')}
                prefetch={true}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  !isBn ? 'bg-teal text-white shadow-2xs' : 'text-ink-soft hover:text-ink'
                }`}
              >
                EN
              </Link>
              <Link
                href={switchUrl('bn')}
                prefetch={true}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  isBn ? 'bg-teal text-white shadow-2xs' : 'text-ink-soft hover:text-ink'
                }`}
              >
                বাংলা
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Scrollable Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
          {menu.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold no-underline transition-all ${
                  active
                    ? 'bg-teal text-white shadow-xs'
                    : 'text-ink hover:bg-white hover:text-teal'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {active ? (
                  <span className="size-1.5 rounded-full bg-white" />
                ) : (
                  <SiteIcon name="arrow" className="size-3.5 opacity-40 text-ink-soft" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Bottom Actions: Appointment CTA & Chamber Helpline */}
        <div className="border-t border-line/70 bg-white/80 p-3.5 space-y-2">
          <Link
            href={`/${locale}/appointment`}
            prefetch={true}
            onClick={() => setOpen(false)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-accent-deep text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#8f4518] active:scale-[0.98] transition-all no-underline"
          >
            <SiteIcon name="calendar" className="size-4" />
            <span>{t(locale, 'nav.request_appointment')}</span>
          </Link>

          <a
            href="tel:01711647877"
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-line/80 bg-paper-alt/70 text-ink hover:bg-white text-xs font-bold transition-all no-underline"
          >
            <SiteIcon name="phone" className="size-3.5 text-teal" />
            <span>{isBn ? 'সিরিয়াল হটলাইন: ' : 'Serial Hotline: '}<span className="font-mono text-teal">01711-647877</span></span>
          </a>
        </div>
      </aside>
    </header>
  );
}


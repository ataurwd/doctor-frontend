import Link from 'next/link';
import SiteIcon from './SiteIcon';
import { LogoMark } from './Logo';
import { t, tr, digits, telHref, settingLocalized } from '@/i18n/translations';

export default function Footer({ locale = 'en', doctor, chambers = [], settings = {} }) {
  const doctorName = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const facebookUrl = settings.facebook_url || doctor?.facebook_url;
  const year = digits(new Date().getFullYear(), locale);
  const isBn = locale === 'bn';

  const quickLinks = [
    { href: `/${locale}`, label: t(locale, 'nav.home') },
    { href: `/${locale}/about`, label: t(locale, 'nav.about') },
    { href: `/${locale}/specialities`, label: t(locale, 'nav.specialities') },
    { href: `/${locale}/services`, label: t(locale, 'nav.services') },
    { href: `/${locale}/chambers`, label: t(locale, 'nav.chambers') },
    { href: `/${locale}/patient-education`, label: t(locale, 'nav.education') },
    { href: `/${locale}/contact`, label: t(locale, 'nav.contact') },
  ];

  return (
    <footer className="mt-20 border-t border-teal-900/30 bg-[#0c2420] text-white">
      {/* Main Footer Content */}
      <div className="container-site py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Column 1: Doctor Identity & CTA (span 4) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoMark className="size-8" theme="dark" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90">
                {isBn ? 'রিউমাটোলজি বিশেষজ্ঞ' : 'Rheumatology Specialist'}
              </span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
              {doctorName}
            </h3>

            {doctor && (
              <div className="mt-2.5 space-y-1">
                <p className="text-sm font-medium text-white/85 leading-relaxed">
                  {tr(doctor, 'specialty_line', locale)}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {tr(doctor, 'title_line', locale)}
                </p>
              </div>
            )}

            {/* Quick CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/appointment`}
                prefetch={true}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-deep hover:shadow active:scale-[0.98]"
              >
                <SiteIcon name="calendar" className="size-3.5" />
                <span>{t(locale, 'buttons.request_appointment')}</span>
              </Link>

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/85 no-underline transition-all hover:bg-white/15 hover:text-white active:scale-[0.98]"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Facebook Profile"
                >
                  <SiteIcon name="facebook" className="size-3.5" />
                  <span>{t(locale, 'footer.follow')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (span 2) */}
          <div className="lg:col-span-3 lg:pl-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white/90">
              {t(locale, 'footer.quick_links')}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
                  >
                    <span className="text-emerald-400/60 text-xs">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Chambers & Practice Info (span 5) */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                {t(locale, 'footer.chambers')}
              </p>
              <Link
                href={`/${locale}/chambers`}
                prefetch={true}
                className="text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
              >
                {t(locale, 'buttons.see_hours')} →
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {chambers.map((chamber) => {
                const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
                return (
                  <div
                    key={chamber._id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <p className="font-semibold text-white text-sm leading-snug">
                      {tr(chamber, 'name', locale)}
                    </p>
                    <p className="mt-1.5 text-xs text-white/65 leading-relaxed line-clamp-2">
                      {tr(chamber, 'address', locale)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {phones.map((phone) => (
                        <a
                          key={phone}
                          href={telHref(phone)}
                          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/90 no-underline transition-all hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:text-white"
                        >
                          <SiteIcon name="phone" className="size-3 text-emerald-400" />
                          <span>{digits(phone, locale)}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Hours Confirmation Notice */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/70">
              <SiteIcon name="clock" className="size-3.5 shrink-0 text-emerald-400/80" />
              <p className="leading-relaxed">
                {settingLocalized(
                  settings,
                  'hours_banner_text',
                  locale,
                  t(locale, 'footer.confirm_note')
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Disclaimer & Copyright */}
      <div className="border-t border-white/[0.08] bg-[#091b18]">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed">
            {settingLocalized(settings, 'site_disclaimer', locale)}
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-4 text-white/50">
            <span>
              &copy; {year} {doctorName}. {t(locale, 'footer.rights')}
            </span>
            <span className="text-white/20">|</span>
            <Link
              href="/admin"
              className="text-white/40 transition-colors hover:text-white/70"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

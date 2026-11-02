import Link from 'next/link';
import SiteIcon from './SiteIcon';
import FallbackNotice from './FallbackNotice';
import { t, tr, digits, telHref, whatsappHref, settingLocalized } from '@/i18n/translations';

export default function DetailPage({
  locale = 'en',
  item,
  sections = [],
  whenHeading,
  whenText,
  others = [],
  othersHeading,
  othersBasePath,
  indexPath,
  indexLabel,
  chambers = [],
  settings = {},
  showFallback = false,
}) {
  const waUrl = whatsappHref(settings);
  const urgentNote = tr(item, 'urgent_note', locale);

  return (
    <div className="container-site pt-10 md:pt-16 pb-16">
      <nav className="no-print text-sm font-semibold text-teal" aria-label="Breadcrumb">
        <Link href={indexPath} className="inline-flex min-h-10 items-center gap-2 hover:text-teal-deep">
          &larr; {indexLabel}
        </Link>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <article>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] leading-[1.08]">
            {tr(item, 'title', locale)}
          </h1>
          <div className="mt-4">
            <FallbackNotice show={showFallback} />
          </div>

          {sections.map(([heading, content], idx) => {
            if (!content || (Array.isArray(content) && content.length === 0)) return null;
            return (
              <section key={idx} className="mt-10">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em]">{heading}</h2>
                {Array.isArray(content) ? (
                  <ul className="mt-4 space-y-3">
                    {content.map((line, i) => (
                      <li key={i} className="flex gap-3 text-base sm:text-lg">
                        <SiteIcon name="check" className="mt-1 size-5 shrink-0 text-teal" />{' '}
                        <span className="text-ink">{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed whitespace-pre-line">
                    {content}
                  </p>
                )}
              </section>
            );
          })}

          <section className="notice-box mt-10 shadow-2xs" aria-labelledby="when-heading" data-when-box>
            <h2 id="when-heading" className="text-2xl font-semibold tracking-[-0.02em]">
              {whenHeading}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-ink leading-relaxed">{whenText}</p>
          </section>

          {urgentNote && (
            <section
              className="mt-8 rounded-[20px] border-2 border-[#a12a1f] bg-white p-6 sm:p-8 shadow-2xs"
              aria-labelledby="urgent-heading"
              role="note"
            >
              <h2 id="urgent-heading" className="flex items-center gap-2 text-xl font-semibold text-[#a12a1f]">
                <SiteIcon name="alert" className="size-6" /> {t(locale, 'specialities.urgent')}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-ink leading-relaxed">{urgentNote}</p>
            </section>
          )}

          <section className="no-print card mt-10" aria-labelledby="book-heading">
            <h2 id="book-heading" className="text-2xl font-semibold tracking-[-0.02em]">
              {t(locale, 'specialities.book_heading')}
            </h2>
            <p className="mt-2 text-base sm:text-lg text-ink-soft">{t(locale, 'specialities.book_text')}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chambers.map((chamber) => {
                if (!chamber.phone_primary) return null;
                const shortName = tr(chamber, 'name', locale).split(',')[0];
                return (
                  <a
                    key={chamber._id}
                    href={telHref(chamber.phone_primary)}
                    className="btn btn-primary"
                  >
                    <SiteIcon name="phone" /> {shortName}:{' '}
                    {digits(chamber.phone_primary, locale)}
                  </a>
                );
              })}
              <Link href={`/${locale}/appointment`} className="btn btn-accent">
                {t(locale, 'buttons.request_appointment')}
              </Link>
              {waUrl && (
                <a
                  href={waUrl}
                  className="btn btn-whatsapp"
                  rel="noopener noreferrer"
                  target="_blank"
                  data-whatsapp
                >
                  <SiteIcon name="whatsapp" /> {t(locale, 'buttons.whatsapp')}
                </a>
              )}
            </div>
          </section>

          <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft leading-relaxed" data-page-disclaimer>
            {settingLocalized(settings, 'page_disclaimer', locale)}
          </p>
        </article>

        <aside className="no-print" aria-labelledby="others-heading">
          <div className="card lg:sticky lg:top-36">
            <h2 id="others-heading" className="text-xl font-semibold tracking-[-0.02em]">
              {othersHeading}
            </h2>
            <ul className="mt-4 space-y-1">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`${othersBasePath}/${other.slug}`}
                    className="flex min-h-11 items-center rounded-full px-4 py-2 text-sm sm:text-base font-medium text-ink no-underline transition-all hover:bg-paper-alt active:scale-[0.98]"
                  >
                    {tr(other, 'title', locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}


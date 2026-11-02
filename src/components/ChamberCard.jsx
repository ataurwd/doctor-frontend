import SiteIcon from './SiteIcon';
import { t, tr, digits, telHref, whatsappHref } from '@/i18n/translations';

export default function ChamberCard({
  chamber,
  locale = 'en',
  settings = {},
  headingTag = 'h3',
  showEmail = false,
}) {
  const Heading = headingTag;
  const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
  const waUrl = whatsappHref(settings);
  const websiteUrl = chamber.website
    ? chamber.website.startsWith('http')
      ? chamber.website
      : `https://${chamber.website}`
    : null;

  return (
    <article className="card group flex h-full flex-col justify-between hover:-translate-y-1.5 transition-all duration-300">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
            <SiteIcon name="map" className="size-3 text-teal" />
            {chamber.phone_secondary ? 'Hospital & Diagnostic' : 'Specialist Chamber'}
          </span>
        </div>

        <Heading className="text-2xl font-bold tracking-tight text-ink group-hover:text-teal transition-colors">
          {tr(chamber, 'name', locale)}
        </Heading>

        <p className="mt-3 text-sm sm:text-base text-ink-soft leading-relaxed flex items-start gap-2.5">
          <SiteIcon name="map" className="mt-1 size-4 shrink-0 text-accent" />
          <span>{tr(chamber, 'address', locale)}</span>
        </p>

        {tr(chamber, 'hours_text', locale) && (
          <div className="mt-5 rounded-2xl border border-line/70 bg-paper-alt/70 p-4 flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-teal shadow-2xs">
              <SiteIcon name="clock" className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">{t(locale, 'chambers.hours')}</p>
              <p className="mt-0.5 text-sm sm:text-base font-bold text-ink">{tr(chamber, 'hours_text', locale)}</p>
            </div>
          </div>
        )}

        {chamber.email && showEmail && (
          <p className="mt-3 text-sm text-ink-soft flex items-center gap-2">
            <SiteIcon name="mail" className="size-4 text-accent" />
            <a href={`mailto:${chamber.email}`} className="text-teal hover:underline font-medium">
              {chamber.email}
            </a>
          </p>
        )}

        {tr(chamber, 'hours_note', locale) && (
          <p className="mt-3 flex gap-2 rounded-xl bg-accent/5 border border-accent/15 p-3 text-xs sm:text-sm text-accent-deep font-medium">
            <SiteIcon name="info" className="mt-0.5 size-4 shrink-0 text-accent-deep" />{' '}
            {tr(chamber, 'hours_note', locale)}
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-line/60 pt-5 flex flex-wrap items-center gap-2.5">
        {phones.map((phone) => (
          <a key={phone} href={telHref(phone)} className="btn btn-primary text-xs sm:text-sm min-h-10 px-4">
            <SiteIcon name="phone" className="size-3.5" />{' '}
            {digits(phone, locale)}
          </a>
        ))}

        {waUrl && (
          <a
            href={waUrl}
            className="btn btn-whatsapp text-xs sm:text-sm min-h-10 px-3.5"
            rel="noopener noreferrer"
            target="_blank"
            data-whatsapp
          >
            <SiteIcon name="whatsapp" className="size-3.5" /> WhatsApp
          </a>
        )}

        {chamber.map_url && (
          <a
            href={chamber.map_url}
            className="btn btn-secondary text-xs sm:text-sm min-h-10 px-3.5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiteIcon name="map" className="size-3.5" /> {t(locale, 'buttons.map')}
          </a>
        )}

        {websiteUrl && showEmail && (
          <a
            href={websiteUrl}
            className="btn btn-secondary text-xs sm:text-sm min-h-10 px-3.5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiteIcon name="globe" className="size-3.5" /> {t(locale, 'buttons.website')}
          </a>
        )}
      </div>
    </article>
  );
}


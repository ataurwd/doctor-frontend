import SiteIcon from './SiteIcon';
import { t, tr, digits, telHref, settingLocalized } from '@/i18n/translations';

export default function Footer({ locale = 'en', doctor, chambers = [], settings = {} }) {
  const doctorName = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const facebookUrl = settings.facebook_url || doctor?.facebook_url;
  const year = digits(new Date().getFullYear(), locale);

  return (
    <footer className="mt-16 bg-teal-deep text-white">
      <div className="container-site grid gap-12 py-16 sm:py-20 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">{doctorName}</p>
          {doctor && (
            <>
              <p className="mt-3 text-base text-white/85 leading-relaxed">{tr(doctor, 'specialty_line', locale)}</p>
              <p className="mt-1 text-sm text-white/70 leading-relaxed">{tr(doctor, 'title_line', locale)}</p>
            </>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white no-underline transition-all hover:bg-white/20 active:scale-[0.98]"
              rel="noopener noreferrer"
              target="_blank"
            >
              <SiteIcon name="facebook" /> {t(locale, 'footer.follow')}
            </a>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="font-display text-xl font-semibold tracking-[-0.02em] text-white">
            {t(locale, 'footer.chambers')}
          </p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {chambers.map((chamber) => {
              const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
              return (
                <li key={chamber._id} className="rounded-[18px] border border-white/10 bg-white/5 p-5">
                  <p className="font-semibold text-white text-lg">{tr(chamber, 'name', locale)}</p>
                  <p className="mt-1 text-sm text-white/75 leading-relaxed">{tr(chamber, 'address', locale)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={telHref(phone)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-xs font-semibold text-white no-underline transition-all hover:bg-white/20 active:scale-[0.98]"
                      >
                        <SiteIcon name="phone" className="size-3.5" /> {digits(phone, locale)}
                      </a>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 leading-relaxed">
            {settingLocalized(
              settings,
              'hours_banner_text',
              locale,
              t(locale, 'footer.confirm_note')
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-6 text-xs sm:text-sm text-white/70 leading-relaxed">
          <p>{settingLocalized(settings, 'site_disclaimer', locale)}</p>
          <p className="mt-2">
            &copy; {year} {doctorName}. {t(locale, 'footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}


import Link from 'next/link';
import SiteIcon from './SiteIcon';
import { t, tr, digits, telHref, whatsappHref } from '@/i18n/translations';

export default function BookingBand({ locale = 'en', chambers = [], settings = {}, heading, text }) {
  const waUrl = whatsappHref(settings);

  return (
    <section className="no-print container-site my-16 md:my-24" aria-labelledby="booking-heading">
      <div className="card-spotlight">
        {/* Subtle atmospheric ambient glows using brand accent & teal */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t(locale, 'home.booking_eyebrow') || (locale === 'bn' ? 'অ্যাপয়েন্টমেন্ট ও যোগাযোগ' : 'Fast & Direct Booking')}
          </p>
          <h2 id="booking-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {heading || t(locale, 'home.booking_heading')}
          </h2>
          <p className="mt-3.5 max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed">
            {text || t(locale, 'home.booking_text')}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {chambers.map((chamber) => {
              const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
              return (
                <div
                  key={chamber._id}
                  className="rounded-[20px] border border-white/15 bg-white/10 p-6 backdrop-blur-xs transition-colors hover:bg-white/15"
                >
                  <p className="text-xl font-semibold text-white">{tr(chamber, 'name', locale)}</p>
                  {tr(chamber, 'hours_text', locale) && (
                    <p className="mt-1 text-base text-white/85">{tr(chamber, 'hours_text', locale)}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {phones.map((phone) => (
                      <a key={phone} href={telHref(phone)} className="btn btn-light">
                        <SiteIcon name="phone" /> {digits(phone, locale)}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
                <SiteIcon name="whatsapp" /> {t(locale, 'buttons.whatsapp_long')}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


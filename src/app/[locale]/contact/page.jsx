import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import FallbackNotice from '@/components/FallbackNotice';
import ContactForm from './ContactForm';
import { getBootstrapData } from '@/lib/api';
import {
  t,
  tr,
  digits,
  telHref,
  whatsappHref,
  usesFallback,
  settingLocalized,
} from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.contact_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.contact_description'),
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};
  const faqs = data?.faqs || [];
  const doctor = data?.doctor || null;

  const waUrl = whatsappHref(settings);
  const facebookUrl = settings.facebook_url || doctor?.facebook_url;
  const faqFallback = faqs.some((f) => usesFallback(f, ['question', 'answer'], locale));

  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: tr(faq, 'question', locale),
            acceptedAnswer: {
              '@type': 'Answer',
              text: tr(faq, 'answer', locale),
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="container-site grid gap-12 pt-12 md:pt-18 pb-12 lg:grid-cols-[3fr_2fr]">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">{t(locale, 'contact.heading')}</h1>
          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">{t(locale, 'contact.intro')}</p>

          <ContactForm locale={locale} />
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">{t(locale, 'contact.chambers')}</h2>
            <ul className="mt-6 space-y-5">
              {chambers.map((chamber) => {
                const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
                return (
                  <li key={chamber._id} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                    <Link href={`/${locale}/chambers`} className="text-lg font-semibold text-ink hover:text-teal">
                      {tr(chamber, 'name', locale)}
                    </Link>
                    <p className="mt-1 text-sm text-ink-soft">{tr(chamber, 'hours_text', locale)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phones.map((phone) => (
                        <a key={phone} href={telHref(phone)} className="btn btn-primary">
                          <SiteIcon name="phone" /> {digits(phone, locale)}
                        </a>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {(waUrl || facebookUrl) && (
            <div className="card flex flex-wrap gap-3">
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
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  className="btn btn-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SiteIcon name="facebook" /> {t(locale, 'contact.facebook')}
                </a>
              )}
            </div>
          )}

          <p className="notice-box text-base sm:text-lg font-semibold shadow-2xs">
            {settingLocalized(settings, 'hours_banner_text', locale)}
          </p>
        </aside>
      </div>

      {faqs.length > 0 && (
        <section className="container-site section-rhythm pt-0" aria-labelledby="faq-heading" data-faqs>
          <p className="eyebrow">{t(locale, 'contact.faq_eyebrow') || 'FAQ'}</p>
          <h2 id="faq-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] leading-[1.05]">
            {t(locale, 'contact.faq_heading')}
          </h2>
          <div className="mt-4">
            <FallbackNotice show={faqFallback} />
          </div>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq._id} className="card group p-0 sm:p-0 transition-all duration-200">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold sm:px-8">
                  <span className="text-ink">{tr(faq, 'question', locale)}</span>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-alt text-xl font-bold text-accent-deep transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-line/60 px-6 py-5 text-base sm:text-lg text-ink-soft sm:px-8 leading-relaxed whitespace-pre-line">
                  {tr(faq, 'answer', locale)}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}


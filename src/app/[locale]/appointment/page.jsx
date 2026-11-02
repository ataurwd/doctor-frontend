import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import AppointmentForm from './AppointmentForm';
import { getBootstrapData } from '@/lib/api';
import { t, tr, digits, telHref, settingLocalized } from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `${t(locale, 'meta.appointment_title')} | ${t(locale, 'meta.suffix')}`,
    description: t(locale, 'meta.appointment_description'),
  };
}

export default async function AppointmentPage({ params }) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  const data = await getBootstrapData();
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};

  return (
    <div>
      {/* 1. TOP HEADER HERO BANNER */}
      <section className="border-b border-line/60 bg-paper-alt/30 py-10 sm:py-14">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-teal">
            <span className="flex size-6 items-center justify-center rounded-full bg-teal text-white shadow-2xs">
              <SiteIcon name="calendar" className="size-3.5" />
            </span>
            <span>
              {isBn
                ? 'ডা: মো: কামরুল হাসান সজীব • বাত-ব্যথা বিশেষজ্ঞ'
                : 'Dr. Md. Kamrul Hasan Sajib • Rheumatology Care'}
            </span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            {t(locale, 'appointment.heading')}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-ink-soft leading-relaxed">
            {t(locale, 'appointment.intro')}
          </p>

          {/* Reassurance trust badges */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 border border-line/70 shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {isBn ? 'চেম্বার থেকে দ্রুত কল' : 'Fast Callback'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 border border-line/70 shadow-2xs">
              <span className="size-1.5 rounded-full bg-teal" />
              {isBn ? 'সরাসরি সিরিয়াল নিশ্চিতকরণ' : 'Direct Serial Confirmation'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 border border-line/70 shadow-2xs">
              <span className="size-1.5 rounded-full bg-accent" />
              {isBn ? 'ঢাকা ও কুমিল্লা চেম্বার' : 'Dhaka & Cumilla Chambers'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN BOOKING INTERFACE */}
      <div className="container-site py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: The Appointment Form (span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <AppointmentForm locale={locale} chambers={chambers} />
        </div>

        {/* Right Column: Direct Call Lines & Chamber Details (span 5) */}
        <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Card 1: Fast Direct Phone Serial Calling */}
          <div className="rounded-3xl border border-line/80 bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-line/60">
              <span className="flex size-8 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <SiteIcon name="phone" className="size-4" />
              </span>
              <div>
                <h3 className="font-bold text-ink text-base">
                  {isBn ? 'সরাসরি ফোনে সিরিয়াল নিন' : 'Call Directly for Serial'}
                </h3>
                <p className="text-xs text-ink-soft">
                  {isBn ? 'তাত্ক্ষণিক সিরিয়ালের জন্য সরাসরি চেম্বারে ফোন করুন' : 'Call chamber numbers for instant slot confirmation'}
                </p>
              </div>
            </div>

            {/* List of Chambers */}
            <div className="space-y-4">
              {chambers.map((chamber) => {
                const phones = [chamber.phone_primary, chamber.phone_secondary].filter(Boolean);
                return (
                  <div
                    key={chamber._id}
                    className="rounded-2xl border border-line/70 bg-paper-alt/40 p-4 space-y-2.5"
                  >
                    <p className="font-bold text-ink text-sm sm:text-base leading-snug">
                      {tr(chamber, 'name', locale)}
                    </p>

                    <p className="text-xs text-ink-soft flex items-start gap-1.5 leading-relaxed">
                      <SiteIcon name="map" className="size-3.5 shrink-0 text-accent mt-0.5" />
                      <span>{tr(chamber, 'address', locale)}</span>
                    </p>

                    {tr(chamber, 'hours_text', locale) && (
                      <p className="text-xs text-teal font-semibold flex items-center gap-1.5">
                        <SiteIcon name="clock" className="size-3.5 shrink-0" />
                        <span>{tr(chamber, 'hours_text', locale)}</span>
                      </p>
                    )}

                    {/* Direct Call Buttons */}
                    <div className="pt-1 flex flex-wrap gap-2">
                      {phones.map((phone) => (
                        <a
                          key={phone}
                          href={telHref(phone)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-teal-deep transition-all active:scale-[0.98]"
                        >
                          <SiteIcon name="phone" className="size-3" />
                          <span>{digits(phone, locale)}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Hours Confirmation Notice */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2">
              <SiteIcon name="info" className="size-4 shrink-0 text-amber-700 mt-0.5" />
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

          {/* Card 2: How It Works / 3 Easy Steps */}
          <div className="rounded-3xl border border-line/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider text-ink-soft">
              {isBn ? 'অ্যাপয়েন্টমেন্ট কীভাবে সম্পন্ন হবে?' : 'How Appointment Works'}
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal text-white font-bold text-[11px]">
                  ১
                </span>
                <div>
                  <p className="font-bold text-ink">
                    {isBn ? 'অনুরোধ ফর্ম জমা দিন' : 'Submit the Request Form'}
                  </p>
                  <p className="text-ink-soft mt-0.5">
                    {isBn ? 'আপনার নাম ও সঠিক মোবাইল নম্বর প্রদান করুন।' : 'Fill in your name and contact phone number.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal text-white font-bold text-[11px]">
                  ২
                </span>
                <div>
                  <p className="font-bold text-ink">
                    {isBn ? 'চেম্বার থেকে ফিরতি কল' : 'Chamber Callback'}
                  </p>
                  <p className="text-ink-soft mt-0.5">
                    {isBn ? 'সহকারী ফোন করে আপনার সুবিধাজনক সময় ও সিরিয়াল নম্বর জানিয়ে দেবেন।' : 'Staff calls you to confirm preferred time and serial slot.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal text-white font-bold text-[11px]">
                  ৩
                </span>
                <div>
                  <p className="font-bold text-ink">
                    {isBn ? 'চেম্বারে পরামর্শ গ্রহণ' : 'Visit the Chamber'}
                  </p>
                  <p className="text-ink-soft mt-0.5">
                    {isBn ? 'নির্দিষ্ট দিনে চেম্বারে উপস্থিত হয়ে চিকিৎসকের পরামর্শ নিন।' : 'Meet the doctor at your confirmed time slot.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import DoctorPhoto from '@/components/DoctorPhoto';
import ChamberCard from '@/components/ChamberCard';
import PostCard from '@/components/PostCard';
import BookingBand from '@/components/BookingBand';
import FallbackNotice from '@/components/FallbackNotice';
import { getBootstrapData } from '@/lib/api';
import { buildPhysicianSchema } from '@/lib/schemaOrg';
import {
  t,
  tr,
  trList,
  digits,
  telHref,
  usesFallback,
  settingLocalized,
  DICTIONARY,
} from '@/i18n/translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const name = tr(data?.doctor, 'name', locale) || t(locale, 'site_name');
  return {
    title: t(locale, 'meta.home_title', { name }),
    description: t(locale, 'meta.home_description'),
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const data = await getBootstrapData();
  const doctor = data?.doctor || null;
  const chambers = data?.chambers || [];
  const settings = data?.settings || {};
  const latestPosts = data?.latestPosts || [];
  const specialities = data?.specialities || [];
  const specialServices = data?.specialServices || [];

  const name = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const otherLocale = locale === 'bn' ? 'en' : 'bn';
  const otherName = doctor?.name?.[otherLocale];
  const callNumber = settings.call_number || '01711-647877';
  const isBn = locale === 'bn';

  // Selected clinical cards matching the 4 key service programs
  const raSpec = specialities.find(
    (s) => s.slug === 'rheumatoid-arthritis' || s.title?.en?.includes('Rheumatoid')
  );
  const spaSpec = specialities.find(
    (s) => s.slug === 'spondyloarthritis' || s.title?.en?.includes('Spondyloarthritis')
  );
  const sleSpec = specialities.find(
    (s) => s.slug === 'lupus-sle' || s.title?.en?.includes('Lupus')
  );
  const pocusSrv = specialServices.find(
    (s) => s.slug === 'pocus-musculoskeletal-ultrasound' || s.title?.en?.includes('Ultrasound')
  );

  const raItems = trList(raSpec, 'common_symptoms', locale);
  const spaItems = trList(spaSpec, 'common_symptoms', locale);
  const sleItems = trList(sleSpec, 'common_symptoms', locale);
  const pocusItems = trList(pocusSrv, 'who_needs_it', locale);

  const serviceCards = [
    {
      num: '01',
      badge: isBn ? 'আর্থ্রাইটিস ও অস্থিসন্ধি' : 'Arthritis Care',
      title: tr(raSpec, 'title', locale) || (isBn ? 'রিউমাটয়েড আর্থ্রাইটিস (RA)' : 'Rheumatoid Arthritis (RA)'),
      items: raItems.length > 0
        ? raItems.slice(0, 4)
        : (isBn
            ? [
                'হাত, কব্জি ও পায়ের জয়েন্টে তীব্র ব্যথা ও ফোলাভাব',
                'সকালে ঘুম থেকে ওঠার পর ৩০ মিনিটের বেশি সময় জয়েন্ট শক্ত হয়ে থাকা',
                'ক্লান্তি, মৃদু জ্বর বা ওজন হ্রাস',
                'সকালে হাতের মুঠ শক্ত করা বা হাঁটার ক্ষেত্রে অসুবিধা',
              ]
            : [
                'Painful, swollen joints, especially fingers, wrists and feet',
                'Morning stiffness lasting more than 30 minutes',
                'Fatigue, low-grade fever or weight loss',
                'Difficulty making a fist, opening jars or walking first thing in the morning',
              ]),
      href: `/${locale}/specialities/${raSpec?.slug || 'rheumatoid-arthritis'}`,
      type: 'speciality',
    },
    {
      num: '02',
      badge: isBn ? 'মেরুদণ্ড ও বাত রোগ' : 'Spine & Spondylo',
      title:
        tr(spaSpec, 'title', locale) ||
        (isBn
          ? 'স্পন্ডিলাইটিস ও স্পন্ডিলোআর্থ্রাইটিস (অ্যাংকাইলোজিং ও সোরিয়াটিক)'
          : 'Spondyloarthritis (Ankylosing Spondylitis and Psoriatic Arthritis)'),
      items: spaItems.length > 0
        ? spaItems.slice(0, 4)
        : (isBn
            ? [
                '৪৫ বছর বয়সের আগে শুরু হওয়া কোমর ব্যথা যা বিশ্রামে বাড়ে এবং সচল থাকলে কমে',
                'রাতের বেলা কোমর ব্যথা এবং সকালে মেরুদণ্ডের তীব্র আড়ষ্টতা',
                'গোড়ালিতে ব্যথা বা আঙুল ফুলে সসেজের মতো মোটা হওয়া',
                'ত্বকে সোরিয়াসিসের ফুসকুড়ি বা নখে গর্তের সাথে জয়েন্টে ব্যথা',
              ]
            : [
                'Back pain that starts before age 45, worsens with rest and improves with activity',
                'Night-time back pain and morning stiffness',
                'Heel pain, swollen fingers or toes ("sausage digits")',
                'Skin psoriasis or nail pitting with joint pain',
              ]),
      href: `/${locale}/specialities/${spaSpec?.slug || 'spondyloarthritis'}`,
      type: 'speciality',
    },
    {
      num: '03',
      badge: isBn ? 'অটোইমিউন রোগ' : 'Autoimmune Health',
      title:
        tr(sleSpec, 'title', locale) ||
        (isBn
          ? 'সিস্টেমিক লুপাস ইরিথেমাটোসাস (লুপাস / SLE)'
          : 'Systemic Lupus Erythematosus (SLE)'),
      items: sleItems.length > 0
        ? sleItems.slice(0, 4)
        : (isBn
            ? [
                'গালে ও নাকের ওপর প্রজাপতির মতো লালচে র‍্যাশ (বাটারফ্লাই র‍্যাশ)',
                'জয়েন্টে ব্যথা ও ফোলাভাব',
                'মুখে বারবার ঘা এবং অস্বাভাবিক চুল পড়া',
                'অকারণ দীর্ঘস্থায়ী জ্বর ও অতিরিক্ত ক্লান্তি',
              ]
            : [
                'Facial rash across the cheeks and nose, often worse in sunlight',
                'Joint pain and swelling',
                'Mouth ulcers and hair loss',
                'Unexplained fever and fatigue',
              ]),
      href: `/${locale}/specialities/${sleSpec?.slug || 'lupus-sle'}`,
      type: 'speciality',
    },
    {
      num: '04',
      badge: isBn ? 'বিশেষ চেম্বার পরীক্ষা' : 'In-Clinic Diagnostics',
      title:
        tr(pocusSrv, 'title', locale) ||
        (isBn
          ? 'পয়েন্ট-অফ-কেয়ার মাসকুলোস্কেলেটাল আল্ট্রাসাউন্ড (POCUS)'
          : 'Point-of-Care Musculoskeletal Ultrasound (POCUS)'),
      items: pocusItems.length > 0
        ? pocusItems.slice(0, 4)
        : (isBn
            ? [
                'যাঁদের জয়েন্টে ব্যথা আছে কিন্তু প্রদাহ স্পষ্ট নয়',
                'প্রাথমিক পর্যায়ের রিউমাটয়েড বা সোরিয়াটিক আর্থ্রাইটিসের সন্দেহ থাকলে',
                'গেঁটেবাত বা ক্রিস্টাল জমার সঠিক অবস্থান জানতে',
                'টেন্ডন ও কাঁধের ব্যথার সুনির্দিষ্ট কারণ নির্ণয়ে',
              ]
            : [
                'People with joint pain where it is unclear whether inflammation is present',
                'Suspected early rheumatoid arthritis or psoriatic arthritis',
                'Gout and other crystal diseases',
                'Tendon and shoulder problems',
              ]),
      href: `/${locale}/services/${pocusSrv?.slug || 'pocus-musculoskeletal-ultrasound'}`,
      type: 'service',
    },
  ];

  const clinicalHighlights = [
    ...specialities.slice(0, 2).map((s) => tr(s, 'title', locale)),
    ...specialServices.slice(0, 1).map((s) => tr(s, 'title', locale)),
  ];

  const whyCards = DICTIONARY[locale === 'bn' ? 'bn' : 'en'].why;
  const bioFirstParagraph = String(tr(doctor, 'bio', locale) || '').split('\n')[0];

  const physicianJsonLd = buildPhysicianSchema(doctor, chambers, settings, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />

      {/* Hero */}
      <section className="container-site grid items-center gap-12 pt-12 pb-16 md:grid-cols-[1.25fr_1fr] md:pt-16 md:pb-24">
        <div>
          {/* Status live badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-teal/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-teal shadow-2xs backdrop-blur-xs mb-4">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-[#22c55e]"></span>
            </span>
            <span>{t(locale, 'home.eyebrow')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.04em] text-ink leading-[1.06]">
            {isBn ? (
              name.includes('কামরুল হাসান সজীব') ? (
                <>
                  <span className="block">ডা: মো: কামরুল</span>
                  <span className="block">হাসান সজীব</span>
                </>
              ) : (
                name
              )
            ) : name.includes('Kamrul Hasan Sajib') ? (
              <>
                <span className="block">Dr. Md. Kamrul</span>
                <span className="block">Hasan Sajib</span>
              </>
            ) : (
              name
            )}
          </h1>
          {otherName && otherName !== name && (
            <p className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink-soft/90 font-bangla" lang={otherLocale}>
              {otherName}
            </p>
          )}

          <p className="mt-4 text-xl sm:text-2xl font-bold text-teal">
            {tr(doctor, 'specialty_line', locale)}
          </p>
          <p className="mt-3.5 max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed">
            {t(locale, 'home.mission')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {callNumber && (
              <a href={telHref(callNumber)} className="btn btn-primary">
                <SiteIcon name="phone" /> {t(locale, 'buttons.call_to_book')}
              </a>
            )}
            <Link href={`/${locale}/chambers`} prefetch={true} className="btn btn-secondary">
              <SiteIcon name="clock" /> {t(locale, 'buttons.see_hours')}
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line/80 pt-6">
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-teal">
                {doctor?.years_experience ? `${digits(doctor.years_experience, locale)}+` : '12+'}
              </p>
              <p className="text-xs sm:text-sm font-medium text-ink-soft mt-0.5">
                {locale === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Clinical Exp.'}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-accent-deep">
                {digits('2', locale)}
              </p>
              <p className="text-xs sm:text-sm font-medium text-ink-soft mt-0.5">
                {locale === 'bn' ? 'চেম্বার (ঢাকা ও কুমিল্লা)' : 'Chambers in BD'}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-teal">
                100%
              </p>
              <p className="text-xs sm:text-sm font-medium text-ink-soft mt-0.5">
                {locale === 'bn' ? 'রোগী-কেন্দ্রিক সেবা' : 'Patient-Centered'}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm md:max-w-none">
          <DoctorPhoto
            doctor={doctor}
            locale={locale}
            eager
            className="aspect-[4/5] w-full"
          />
        </div>
      </section>

      {/* Credential badges */}
      <section
        className="border-y border-line/80 bg-white/70 backdrop-blur-xs"
        aria-label={t(locale, 'home.credentials_label')}
      >
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            {t(locale, 'home.credentials_label')}:
          </span>
          <ul className="flex flex-wrap gap-2.5">
            {['md', 'ecrd', 'facr', 'bcs'].map((badge) => (
              <li key={badge} className="pill">
                <span className="size-1.5 rounded-full bg-teal mr-2" />
                {t(locale, `badges.${badge}`)}
              </li>
            ))}
            {doctor?.years_experience && (
              <li className="pill">
                <span className="size-1.5 rounded-full bg-accent mr-2" />
                {t(locale, 'badges.years', { years: digits(doctor.years_experience, locale) })}
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="container-site section-rhythm" aria-labelledby="services-heading">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">{t(locale, 'home.services_eyebrow')}</p>
          <h2 id="services-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-ink leading-[1.08]">
            {t(locale, 'home.services_heading')}
          </h2>
          <p className="mt-3.5 max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed">
            {isBn
              ? 'বাতের প্রাথমিক লক্ষণ শনাক্তকরণ থেকে শুরু করে আধুনিক বায়োলজিক থেরাপি এবং চেম্বার আল্ট্রাসাউন্ড প্রক্রিয়া।'
              : 'From early diagnosis to advanced targeted biologic therapy and in-clinic ultrasound diagnostics.'}
          </p>
        </div>

        {/* Services 2-Column Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 items-stretch max-w-6xl mx-auto">
          {serviceCards.map((card) => (
            <article
              key={card.num}
              className="group relative flex flex-col justify-between rounded-3xl sm:rounded-[32px] border border-line/80 bg-white/95 p-7 sm:p-9 lg:p-10 shadow-[0_6px_25px_rgba(27,46,42,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/30 hover:bg-white hover:shadow-[0_20px_45px_-12px_rgba(27,46,42,0.12)]"
            >
              {/* Subtle top glowing accent on hover */}
              <div className="absolute inset-x-10 top-0 h-[3px] rounded-t-full bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div>
                {/* Header: Number Badge, Category pill, and Top-Right Arrow Link */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-paper-alt border border-line/70 font-display text-sm font-extrabold text-ink-soft/90 group-hover:border-teal/30 group-hover:text-teal group-hover:bg-teal/5 transition-colors">
                      {digits(card.num, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-alt/80 border border-line/60 px-3 py-1 text-xs font-bold text-accent-deep">
                      <span className="size-1.5 rounded-full bg-accent" />
                      {card.badge}
                    </span>
                  </div>

                  <Link
                    href={card.href}
                    prefetch={true}
                    aria-label={card.title}
                    className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-paper-alt/80 border border-line/60 text-ink-soft transition-all duration-300 group-hover:bg-teal group-hover:text-white group-hover:border-teal group-hover:scale-105 shadow-2xs"
                  >
                    <SiteIcon name="arrow-up-right" className="size-4" />
                  </Link>
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-teal leading-snug">
                  <Link href={card.href} prefetch={true} className="no-underline hover:no-underline focus:outline-none">
                    {card.title}
                  </Link>
                </h3>

                {/* Checklist (Key symptoms / clinical indicators) */}
                <ul className="mt-6 space-y-3 sm:space-y-3.5 border-t border-line/60 pt-5">
                  {card.items.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-[15px] text-ink-soft/95 leading-relaxed">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal mt-0.5 group-hover:bg-teal group-hover:text-white transition-colors duration-200">
                        <SiteIcon name="check" className="size-3 stroke-[2.5]" />
                      </span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action / CTA Bar */}
              <div className="mt-8 border-t border-line/60 pt-5 flex items-center justify-between">
                <Link
                  href={card.href}
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-teal transition-all group-hover:text-teal-deep group-hover:gap-2.5"
                >
                  <span>{isBn ? 'বিস্তারিত দেখুন' : 'Learn more'}</span>
                  <SiteIcon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <span className="text-xs font-semibold text-ink-soft/70">
                  {card.type === 'service'
                    ? (isBn ? 'চেম্বার পরীক্ষা' : 'In-Clinic Service')
                    : (isBn ? 'স্পেশালিটি কেয়ার' : 'Speciality Care')}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Directory Explorer Footer Band */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-line/75 bg-gradient-to-r from-white via-paper-alt/60 to-white p-6 sm:p-7 shadow-2xs max-w-6xl mx-auto">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal shadow-2xs">
              <SiteIcon name="info" className="size-5" />
            </div>
            <div>
              <p className="text-base font-bold text-ink">
                {isBn
                  ? 'আপনার নির্দিষ্ট কোনো রোগের চিকিৎসা প্রয়োজন?'
                  : 'Looking for guidance on a specific condition?'}
              </p>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                {isBn
                  ? 'আমাদের ১০টি বিশেষায়িত চিকিৎসাক্ষেত্র ও ৫টি বিশেষ চেম্বার পরীক্ষা দেখুন।'
                  : 'Browse our full directory of 10 clinical specialities and 5 in-clinic diagnostic procedures.'}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 w-full sm:w-auto justify-center">
            <Link href={`/${locale}/specialities`} className="btn btn-secondary text-xs sm:text-sm py-2.5 px-4.5">
              {isBn ? 'সকল স্পেশালিটি (১০)' : 'All Specialities (10)'}
            </Link>
            <Link href={`/${locale}/services`} className="btn btn-primary text-xs sm:text-sm py-2.5 px-4.5">
              {isBn ? 'সকল সেবা (৫)' : 'All Procedures (5)'}
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-paper-alt/80 border-y border-line/60 section-rhythm" aria-labelledby="why-heading">
        <div className="container-site">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">{t(locale, 'home.why_eyebrow')}</p>
            <h2 id="why-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-ink leading-[1.08]">
              {t(locale, 'home.why_heading')}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {whyCards.map((why, i) => (
              <div key={why.title} className="card group hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent-deep mb-5">
                  <span className="font-display text-lg font-extrabold">{digits(String(i + 1).padStart(2, '0'), locale)}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-ink">{why.title}</h3>
                <p className="mt-3 text-base text-ink-soft leading-relaxed">{why.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section
        className="container-site section-rhythm grid items-center gap-12 md:grid-cols-[1fr_1.3fr]"
        aria-labelledby="about-heading"
      >
        {doctor?.photo_path ? (
          <DoctorPhoto
            doctor={doctor}
            locale={locale}
            width={440}
            height={440}
            className="mx-auto aspect-[4/5] w-full max-w-md"
          />
        ) : (
          <div className="relative overflow-hidden rounded-[32px] border border-line/80 bg-gradient-to-br from-white via-paper-alt/70 to-teal/10 p-8 shadow-[0_12px_36px_rgba(27,46,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-teal text-white shadow-xs">
                <SiteIcon name="check" className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-deep">Clinical Excellence</p>
                <p className="text-sm font-bold text-ink">Dhaka Medical College Hospital</p>
              </div>
            </div>

            <blockquote className="mt-6 border-l-4 border-teal pl-4 italic text-base sm:text-lg text-ink font-medium leading-relaxed">
              {locale === 'bn'
                ? '“সঠিক সময়ে রোগ নির্ণয় ও প্রমাণভিত্তিক আধুনিক চিকিৎসা আপনার জয়েন্টের কার্যক্ষমতা রক্ষা করতে পারে।”'
                : '“Timely diagnosis and modern evidence-based care can preserve joint function and improve quality of life.”'}
            </blockquote>

            <div className="mt-8 space-y-3 border-t border-line/70 pt-6">
              {clinicalHighlights.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <SiteIcon name="check" className="size-3" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="eyebrow">{t(locale, 'home.about_eyebrow')}</p>
          <h2 id="about-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-ink leading-[1.08]">
            {name}
          </h2>
          <div className="mt-4">
            <FallbackNotice show={usesFallback(doctor, ['bio'], locale)} />
          </div>
          <p className="mt-5 text-base sm:text-lg text-ink-soft leading-relaxed">{bioFirstParagraph}</p>
          
          <div className="mt-6 rounded-2xl border border-line/70 bg-white/70 p-4.5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-accent-deep">Credentials & Qualifications</p>
            <p className="mt-1 text-base font-semibold text-ink">{tr(doctor, 'credentials', locale)}</p>
          </div>

          <Link
            href={`/${locale}/about`}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-6 text-base font-bold text-teal transition-all hover:bg-teal hover:text-white active:scale-[0.98]"
          >
            {t(locale, 'home.meet')} <SiteIcon name="arrow" className="size-4" />
          </Link>
        </div>
      </section>

      {/* Chambers */}
      <section className="container-site section-rhythm" aria-labelledby="chambers-heading">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow">{t(locale, 'home.chambers_eyebrow')}</p>
          <h2 id="chambers-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-ink leading-[1.08]">
            {t(locale, 'home.chambers_heading')}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {chambers.length > 0 ? (
            chambers.map((chamber) => (
              <ChamberCard
                key={chamber._id}
                chamber={chamber}
                locale={locale}
                settings={settings}
              />
            ))
          ) : (
            <p>{t(locale, 'chambers.none')}</p>
          )}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <SiteIcon name="info" className="size-4 shrink-0 text-accent-deep" />{' '}
          {settingLocalized(settings, 'hours_banner_text', locale)}
        </p>
      </section>

      {/* Latest articles */}
      {latestPosts.length > 0 && (
        <section className="container-site section-rhythm" aria-labelledby="articles-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow">{t(locale, 'home.articles_eyebrow')}</p>
              <h2 id="articles-heading" className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-ink leading-[1.08]">
                {t(locale, 'home.articles_heading')}
              </h2>
            </div>
            <Link
              href={`/${locale}/patient-education`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-bold text-teal transition-all hover:bg-paper-alt hover:text-teal-deep active:scale-[0.98]"
            >
              {t(locale, 'buttons.all_articles')} <SiteIcon name="arrow" className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <BookingBand locale={locale} chambers={chambers} settings={settings} />
    </>
  );
}


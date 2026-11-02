import SiteIcon from './SiteIcon';
import { t, tr } from '@/i18n/translations';

export default function DoctorPhoto({
  doctor,
  locale = 'en',
  eager = false,
  className = '',
  width = 480,
  height = 600,
}) {
  if (doctor?.photo_path) {
    return (
      <img
        src={doctor.photo_path}
        alt={t(locale, 'home.photo_alt', { name: tr(doctor, 'name', locale) })}
        width={width}
        height={height}
        fetchPriority={eager ? 'high' : undefined}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        className={`${className} object-cover`}
      />
    );
  }

  const doctorName = tr(doctor, 'name', locale) || t(locale, 'site_name');
  const specialty = tr(doctor, 'specialty_line', locale) || 'Rheumatologist';
  const credentials = tr(doctor, 'credentials', locale) || 'MBBS, BCS (Health), MD (Rheumatology)';

  return (
    <div
      className={`${className} relative flex flex-col justify-between overflow-hidden rounded-[28px] sm:rounded-[32px] border border-line/80 bg-gradient-to-br from-white via-paper-alt/70 to-teal/10 p-6 sm:p-8 shadow-[0_12px_36px_rgba(27,46,42,0.06)]`}
      role="img"
      aria-label={t(locale, 'home.photo_alt', { name: doctorName })}
    >
      {/* Decorative ambient backdrop */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-teal/10 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-accent/15 blur-2xl" aria-hidden="true" />

      {/* Floating Top Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-white/90 px-3 py-1 text-xs font-bold text-teal shadow-2xs backdrop-blur-xs">
          <span className="size-2 rounded-full bg-[#22c55e]" />
          Verified Specialist
        </span>
        <span className="text-xs font-semibold text-ink-soft">
          BMDC Reg.
        </span>
      </div>

      {/* Center Medical Emblem */}
      <div className="relative z-10 my-6 flex flex-col items-center text-center">
        <div className="relative flex size-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal to-teal-deep text-white shadow-lg sm:size-32">
          <SiteIcon name="user" className="size-16 text-white/90" />
          <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-sm">
            <SiteIcon name="check" className="size-4" />
          </div>
        </div>

        <p className="mt-4 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {doctorName}
        </p>
        <p className="mt-1 text-sm font-semibold text-teal">
          {specialty}
        </p>
        <p className="mt-2 text-xs font-medium text-ink-soft max-w-[260px]">
          {credentials}
        </p>
      </div>

      {/* Floating Bottom Status Box */}
      <div className="relative z-10 rounded-2xl border border-line/70 bg-white/90 p-3.5 shadow-2xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <SiteIcon name="map" className="size-4" />
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-ink">Dhaka & Cumilla</p>
            <p className="text-ink-soft">JBFH Dhanmondi & Ibn Sina</p>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import { t, tr, digits } from '@/i18n/translations';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AppointmentForm({ locale = 'en', chambers = [] }) {
  const isBn = locale === 'bn';

  const [form, setForm] = useState({
    website: '',
    name: '',
    phone: '',
    chamber_id: '',
    preferred_day: '',
    reason: '',
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify({ ...form, locale }),
      });

      const data = await res.json();

      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setGeneralError(data.error || (isBn ? 'অনুরোধ পাঠানো সম্ভব হয়নি। অনুগ্রহ করে চেম্বারে সরাসরি ফোন করুন।' : 'Could not submit request. Please call chamber directly.'));
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setGeneralError(isBn ? 'নেটওয়ার্ক সংযোগ সমস্যা। অনুগ্রহ করে চেম্বারে সরাসরি ফোন করুন।' : 'Network error. Please call the chamber directly.');
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submitted) {
    const selectedChamber = chambers.find((c) => c._id === form.chamber_id);
    const chamberName = selectedChamber ? tr(selectedChamber, 'name', locale) : (isBn ? 'যেকোনো চেম্বার' : 'Any chamber');

    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-lg text-center space-y-6 animate-fade-in">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
          <SiteIcon name="check" className="size-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 text-emerald-800 px-3 py-1 text-xs font-bold">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {isBn ? 'অনুরোধ সফলভাবে গ্রহণ করা হয়েছে' : 'Request Received Successfully'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            {t(locale, 'appointment.thanks_heading')}
          </h2>
          <p className="max-w-md mx-auto text-sm sm:text-base text-ink-soft leading-relaxed">
            {t(locale, 'appointment.thanks_text')}
          </p>
        </div>

        {/* Recap Box */}
        <div className="max-w-md mx-auto rounded-2xl border border-line/80 bg-paper-alt/40 p-5 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between pb-2 border-b border-line/60">
            <span className="text-ink-soft">{isBn ? 'রোগীর নাম:' : 'Patient Name:'}</span>
            <span className="font-bold text-ink">{form.name}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-line/60">
            <span className="text-ink-soft">{isBn ? 'মোবাইল নম্বর:' : 'Phone Number:'}</span>
            <span className="font-bold font-mono text-teal">{digits(form.phone, locale)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-line/60">
            <span className="text-ink-soft">{isBn ? 'চেম্বার:' : 'Chamber:'}</span>
            <span className="font-bold text-ink">{chamberName}</span>
          </div>
          {form.preferred_day && (
            <div className="flex justify-between">
              <span className="text-ink-soft">{isBn ? 'পছন্দের দিন:' : 'Preferred Day:'}</span>
              <span className="font-bold text-ink capitalize">{t(locale, `days.${form.preferred_day}`)}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5 max-w-md mx-auto text-left">
          <SiteIcon name="info" className="size-4 shrink-0 text-amber-700 mt-0.5" />
          <p className="leading-relaxed">
            {t(locale, 'appointment.thanks_urgent')}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="btn btn-secondary px-6 py-2.5 text-xs sm:text-sm font-bold"
          >
            {isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({
                website: '',
                name: '',
                phone: '',
                chamber_id: '',
                preferred_day: '',
                reason: '',
                consent: false,
              });
            }}
            className="btn btn-accent px-6 py-2.5 text-xs sm:text-sm font-bold"
          >
            {isBn ? 'নতুন অনুরোধ পাঠান' : 'Submit Another Request'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-6"
      noValidate
    >
      {/* Form Card Header / Notice */}
      <div className="rounded-2xl border border-teal/15 bg-teal/5 p-4 flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-teal text-white shadow-2xs mt-0.5">
          <SiteIcon name="calendar" className="size-4" />
        </span>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-bold text-teal">
            {t(locale, 'appointment.not_confirmed')}
          </p>
          <p className="text-ink-soft text-xs mt-0.5">
            {isBn
              ? 'নিচের তথ্যগুলো জমা দিলে চেম্বার সহকারী ফোন করে আপনার সিরিয়াল ও সম্ভাব্য সময় নিশ্চিত করবেন।'
              : 'Our assistant will call you to assign your serial number and schedule your exact time slot.'}
          </p>
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      {generalError && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-xs sm:text-sm font-bold text-red-700 flex items-center gap-2">
          <SiteIcon name="alert" className="size-5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* 1. Patient Name */}
      <div>
        <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-ink mb-1.5">
          {t(locale, 'appointment.name')} <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs ${
            errors.name ? 'border-red-400 bg-red-50/20' : 'border-line/80'
          }`}
          placeholder={isBn ? 'যেমন: মোহাম্মদ রহিম' : 'e.g. John Doe'}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          maxLength={120}
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span>&bull;</span> {errors.name}
          </p>
        )}
      </div>

      {/* 2. Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-ink mb-1.5">
          {t(locale, 'appointment.phone')} <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <SiteIcon
            name="phone"
            className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink-soft/50"
          />
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className={`w-full rounded-2xl border bg-white pl-11 pr-4 py-3 text-sm font-medium text-ink placeholder:text-ink-soft/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs ${
              errors.phone ? 'border-red-400 bg-red-50/20' : 'border-line/80'
            }`}
            placeholder="01711-123456"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            maxLength={30}
            autoComplete="tel"
          />
        </div>
        <p className="mt-1.5 text-[11px] sm:text-xs text-ink-soft">
          {t(locale, 'appointment.phone_help')}
        </p>
        {errors.phone && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span>&bull;</span> {errors.phone}
          </p>
        )}
      </div>

      {/* 3. Chamber & Preferred Day (2-Column Grid) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="chamber_id" className="block text-xs sm:text-sm font-bold text-ink mb-1.5">
            {t(locale, 'appointment.chamber')}
          </label>
          <select
            id="chamber_id"
            name="chamber_id"
            className="w-full rounded-2xl border border-line/80 bg-white px-4 py-3 text-xs sm:text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs cursor-pointer"
            value={form.chamber_id}
            onChange={(e) => setForm({ ...form, chamber_id: e.target.value })}
          >
            <option value="">{t(locale, 'appointment.chamber_any')}</option>
            {chambers.map((chamber) => (
              <option key={chamber._id} value={chamber._id}>
                {tr(chamber, 'name', locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferred_day" className="block text-xs sm:text-sm font-bold text-ink mb-1.5">
            {t(locale, 'appointment.day')}
          </label>
          <select
            id="preferred_day"
            name="preferred_day"
            className="w-full rounded-2xl border border-line/80 bg-white px-4 py-3 text-xs sm:text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs cursor-pointer"
            value={form.preferred_day}
            onChange={(e) => setForm({ ...form, preferred_day: e.target.value })}
          >
            <option value="">{t(locale, 'appointment.day_any')}</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {t(locale, `days.${day}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Reason for Visit */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="reason" className="block text-xs sm:text-sm font-bold text-ink">
            {t(locale, 'appointment.reason')}
          </label>
          <span className="text-[11px] font-mono text-ink-soft">
            {digits(form.reason.length, locale)}/200
          </span>
        </div>

        <textarea
          id="reason"
          name="reason"
          rows={3}
          maxLength={200}
          className="w-full rounded-2xl border border-line/80 bg-white p-4 text-xs sm:text-sm text-ink placeholder:text-ink-soft/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs leading-relaxed"
          placeholder={
            isBn
              ? 'যেমন: হাঁটুতে তীব্র ব্যথা, জয়েন্ট ফোলা বা ফলো-আপ ভিজিট...'
              : 'e.g. Chronic knee pain, joint swelling, or follow-up consultation...'
          }
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <div className="mt-2 flex items-start gap-2 text-[11px] text-accent-deep bg-amber-50/70 border border-amber-200/60 rounded-xl px-3 py-2">
          <SiteIcon name="alert" className="size-3.5 shrink-0 mt-0.5" />
          <span>{t(locale, 'appointment.reason_warning')}</span>
        </div>
      </div>

      {/* 5. Consent Checkbox Card */}
      <div className="rounded-2xl border border-line/80 bg-paper-alt/40 p-4 transition-colors hover:border-teal/30">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-0.5 size-5 shrink-0 rounded-md accent-teal cursor-pointer"
            required
          />
          <span className="text-xs sm:text-sm text-ink leading-relaxed">
            {t(locale, 'appointment.consent')} <span className="text-accent">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-xs font-semibold text-red-600">
            &bull; {errors.consent}
          </p>
        )}
      </div>

      {/* 6. Submit Button & Privacy Assurance */}
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-accent w-full py-4 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{isBn ? 'অনুরোধ পাঠানো হচ্ছে...' : 'Submitting Request...'}</span>
            </>
          ) : (
            <>
              <SiteIcon name="calendar" className="size-4" />
              <span>{t(locale, 'buttons.submit_request')}</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] sm:text-xs text-ink-soft flex items-center justify-center gap-1.5 leading-relaxed">
          <SiteIcon name="shield" className="size-3 text-teal shrink-0" />
          <span>{t(locale, 'appointment.privacy')}</span>
        </p>
      </div>
    </form>
  );
}

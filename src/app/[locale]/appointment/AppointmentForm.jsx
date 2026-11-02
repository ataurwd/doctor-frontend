'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteIcon from '@/components/SiteIcon';
import { t, tr } from '@/i18n/translations';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AppointmentForm({ locale = 'en', chambers = [] }) {
  const router = useRouter();
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
        setGeneralError(data.error || 'Could not submit request. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(`/${locale}/appointment/thank-you`);
    } catch (err) {
      setGeneralError('Network error. Please call the chamber directly.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-6" noValidate>
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
        <p className="rounded-xl border-2 border-[#a12a1f] bg-white p-4 font-semibold text-[#a12a1f]">
          {generalError}
        </p>
      )}

      <div>
        <label htmlFor="name" className="field-label">
          {t(locale, 'appointment.name')} <span className="text-accent-deep">*</span>
          <span className="sr-only">({t(locale, 'appointment.required')})</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          maxLength={120}
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="field-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="field-label">
          {t(locale, 'appointment.phone')} <span className="text-accent-deep">*</span>
          <span className="sr-only">({t(locale, 'appointment.required')})</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          className="field"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          maxLength={30}
          autoComplete="tel"
          aria-describedby={errors.phone ? 'phone-help phone-error' : 'phone-help'}
          aria-invalid={errors.phone ? 'true' : undefined}
        />
        <p id="phone-help" className="mt-2 text-base text-ink-soft">
          {t(locale, 'appointment.phone_help')}
        </p>
        {errors.phone && (
          <p id="phone-error" className="field-error">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="chamber_id" className="field-label">
            {t(locale, 'appointment.chamber')}
          </label>
          <select
            id="chamber_id"
            name="chamber_id"
            className="field"
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
          {errors.chamber_id && <p className="field-error">{errors.chamber_id}</p>}
        </div>

        <div>
          <label htmlFor="preferred_day" className="field-label">
            {t(locale, 'appointment.day')}
          </label>
          <select
            id="preferred_day"
            name="preferred_day"
            className="field"
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
          {errors.preferred_day && <p className="field-error">{errors.preferred_day}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="field-label">
          {t(locale, 'appointment.reason')}
        </label>
        <p
          id="reason-warning"
          className="mb-2 flex gap-2 rounded-xl bg-paper-alt p-3 text-base font-semibold text-accent-deep"
          data-reason-warning
        >
          <SiteIcon name="alert" className="mt-0.5 size-5 shrink-0" />{' '}
          {t(locale, 'appointment.reason_warning')}
        </p>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          maxLength={200}
          className="field"
          aria-describedby="reason-warning reason-help"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <p id="reason-help" className="mt-2 flex justify-between gap-4 text-base text-ink-soft">
          <span>{t(locale, 'appointment.reason_help')}</span>
          <span aria-hidden="true">{form.reason.length}/200</span>
        </p>
        {errors.reason && <p className="field-error">{errors.reason}</p>}
      </div>

      <div>
        <label className="flex min-h-12 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 size-6 shrink-0 accent-teal"
            required
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            {t(locale, 'appointment.consent')} <span className="text-accent-deep">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="field-error">
            {errors.consent}
          </p>
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn btn-accent w-full sm:w-auto">
        {t(locale, 'buttons.submit_request')}
      </button>

      <p className="text-base text-ink-soft">{t(locale, 'appointment.privacy')}</p>
    </form>
  );
}


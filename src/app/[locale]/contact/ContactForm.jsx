'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteIcon from '@/components/SiteIcon';
import { t } from '@/i18n/translations';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactForm({ locale = 'en' }) {
  const router = useRouter();
  const [form, setForm] = useState({
    website: '',
    name: '',
    phone: '',
    email: '',
    message: '',
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
      const res = await fetch(`${API_BASE}/contact`, {
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
        setGeneralError(data.error || 'Could not send message. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(`/${locale}/contact/thank-you`);
    } catch (err) {
      setGeneralError('Network error. Please call the chamber directly.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-6" noValidate>
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
          {t(locale, 'contact.name')} <span className="text-accent-deep">*</span>
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
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            {t(locale, 'contact.phone')} <span className="text-accent-deep">*</span>
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
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            {t(locale, 'contact.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={190}
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : undefined}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          {t(locale, 'contact.message')} <span className="text-accent-deep">*</span>
        </label>
        <p
          id="message-warning"
          className="mb-2 flex gap-2 rounded-xl bg-paper-alt p-3 text-base font-semibold text-accent-deep"
        >
          <SiteIcon name="alert" className="mt-0.5 size-5 shrink-0" />{' '}
          {t(locale, 'contact.message_warning')}
        </p>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={1000}
          className="field"
          required
          aria-describedby="message-warning"
          aria-invalid={errors.message ? 'true' : undefined}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn btn-accent w-full sm:w-auto">
        {t(locale, 'buttons.send')}
      </button>

      <p className="text-base text-ink-soft">{t(locale, 'appointment.privacy')}</p>
    </form>
  );
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import SiteIcon from '@/components/SiteIcon';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminSettingsPage() {
  const { fetchWithAuth, showToast } = useAdminAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data || {});
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleBilingualChange = (fieldKey, val) => {
    setSettings((prev) => {
      const current = prev[fieldKey] || { en: '', bn: '' };
      return {
        ...prev,
        [fieldKey]: {
          ...current,
          [activeLang]: val,
        },
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      showToast('Site settings updated successfully!');
      loadSettings();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="size-6 animate-spin rounded-full border-2 border-teal border-t-transparent inline-block" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
          Site Configuration & Settings
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft">
          Configure emergency phone lines, social profiles, chamber alerts, and legal disclaimers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Direct Contact Numbers & Socials */}
        <div className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="font-bold text-ink text-base pb-3 border-b border-line/60 flex items-center gap-2">
            <SiteIcon name="phone" className="size-4 text-teal" />
            <span>Direct Helplines & Social Channels</span>
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Primary Call Helpline
              </label>
              <input
                type="text"
                value={settings.call_number || ''}
                onChange={(e) => handleChange('call_number', e.target.value)}
                placeholder="01711-647877"
                className="w-full rounded-xl border border-line/80 bg-white px-3.5 py-2.5 text-sm font-mono text-ink focus:border-teal focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-ink-soft">
                Shown on the mobile sticky bar and call-to-book buttons.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                WhatsApp Booking Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="01711647877"
                className="w-full rounded-xl border border-line/80 bg-white px-3.5 py-2.5 text-sm font-mono text-ink focus:border-teal focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-ink-soft">
                Without symbols or spaces (e.g. 01711647877).
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1.5">
                Official Facebook Page / Profile URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full rounded-xl border border-line/80 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-teal focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bilingual Global Notices */}
        <div className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line/60">
            <h3 className="font-bold text-ink text-base flex items-center gap-2">
              <SiteIcon name="alert" className="size-4 text-accent" />
              <span>Global Notice Banners & Disclaimers</span>
            </h3>

            {/* Language Switcher */}
            <div className="flex rounded-xl bg-paper-alt p-1 border border-line shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-teal text-white shadow-2xs'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-bangla ${
                  activeLang === 'bn'
                    ? 'bg-teal text-white shadow-2xs'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Visiting Hours Alert Banner ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={settings.hours_banner_text?.[activeLang] || ''}
                onChange={(e) => handleBilingualChange('hours_banner_text', e.target.value)}
                placeholder={
                  activeLang === 'en'
                    ? 'Hours can change. Please call to confirm before you visit.'
                    : 'আসার আগে চেম্বারে ফোন করে নিশ্চিত হয়ে নিন।'
                }
                className={`w-full rounded-xl border border-line/80 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-teal focus:outline-none ${
                  activeLang === 'bn' ? 'font-bangla text-base' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Public Site Educational Disclaimer ({activeLang.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={settings.site_disclaimer?.[activeLang] || ''}
                onChange={(e) => handleBilingualChange('site_disclaimer', e.target.value)}
                placeholder="The information on this website is for general patient education only..."
                className={`w-full rounded-xl border border-line/80 bg-white p-3.5 text-sm text-ink focus:border-teal focus:outline-none ${
                  activeLang === 'bn' ? 'font-bangla text-base' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal px-8 py-3 text-sm font-bold text-white hover:bg-teal-deep transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving && (
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

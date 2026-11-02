'use client';

import { useState } from 'react';
import SiteIcon from '@/components/SiteIcon';

export default function ResourceModal({
  schema,
  item,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [formData, setFormData] = useState(() => {
    const initial = { ...item };
    // Ensure bilingual object structures exist
    (schema.bilingual || []).forEach((b) => {
      if (!initial[b.key] || typeof initial[b.key] !== 'object') {
        initial[b.key] = { en: '', bn: '' };
      }
    });
    return initial;
  });

  const [activeLang, setActiveLang] = useState('en');

  const handleBilingualChange = (fieldKey, value, isList = false) => {
    setFormData((prev) => {
      const currentObj = prev[fieldKey] || { en: '', bn: '' };
      const parsedValue = isList
        ? value.split('\n').filter((l) => l.trim() !== '')
        : value;

      return {
        ...prev,
        [fieldKey]: {
          ...currentObj,
          [activeLang]: parsedValue,
        },
      };
    });
  };

  const handleFieldChange = (fieldKey, value, type) => {
    let parsed = value;
    if (type === 'checkbox') parsed = Boolean(value);
    if (type === 'number') parsed = value === '' ? '' : Number(value);

    setFormData((prev) => ({
      ...prev,
      [fieldKey]: parsed,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEdit = Boolean(item?._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-white border border-line shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-alt/40">
          <div>
            <h3 className="font-bold text-ink text-lg">
              {isEdit ? `Edit ${schema.label}` : `Add New ${schema.label}`}
            </h3>
            <p className="text-xs text-ink-soft">{schema.description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl border border-line bg-white text-ink-soft hover:bg-paper-alt cursor-pointer"
          >
            <SiteIcon name="close" className="size-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Language Switcher for Bilingual Fields */}
          {schema.bilingual && schema.bilingual.length > 0 && (
            <div className="rounded-2xl border border-line/80 bg-paper-alt/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Bilingual Content Entry
                </span>
                <div className="flex rounded-xl bg-white p-1 border border-line shadow-2xs">
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

              <div className="space-y-4">
                {schema.bilingual.map((field) => {
                  const currentVal = formData[field.key]?.[activeLang];
                  const displayVal = field.isList
                    ? Array.isArray(currentVal)
                      ? currentVal.join('\n')
                      : ''
                    : currentVal || '';

                  return (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-ink mb-1.5 flex items-center justify-between">
                        <span>{field.label} ({activeLang.toUpperCase()})</span>
                        {field.isList && (
                          <span className="text-[10px] text-ink-soft font-normal">One item per line</span>
                        )}
                      </label>

                      {field.multiline || field.isList ? (
                        <textarea
                          rows={field.rows || 3}
                          value={displayVal}
                          onChange={(e) =>
                            handleBilingualChange(field.key, e.target.value, field.isList)
                          }
                          className={`w-full rounded-xl border border-line/80 bg-white p-3 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all ${
                            activeLang === 'bn' ? 'font-bangla text-base' : ''
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()} in ${
                            activeLang === 'en' ? 'English' : 'বাংলা'
                          }...`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={displayVal}
                          onChange={(e) =>
                            handleBilingualChange(field.key, e.target.value, false)
                          }
                          className={`w-full rounded-xl border border-line/80 bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all ${
                            activeLang === 'bn' ? 'font-bangla text-base' : ''
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()} in ${
                            activeLang === 'en' ? 'English' : 'বাংলা'
                          }...`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standard Fields */}
          {schema.fields && schema.fields.length > 0 && (
            <div className="space-y-4 pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                Settings & Metadata
              </span>

              <div className="grid gap-4 sm:grid-cols-2">
                {schema.fields.map((field) => {
                  const val = formData[field.key] ?? '';

                  if (field.type === 'checkbox') {
                    return (
                      <div
                        key={field.key}
                        className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border border-line bg-paper-alt/30"
                      >
                        <input
                          type="checkbox"
                          id={field.key}
                          checked={Boolean(formData[field.key])}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.checked, 'checkbox')
                          }
                          className="size-4 rounded accent-teal"
                        />
                        <label htmlFor={field.key} className="text-xs font-bold text-ink cursor-pointer">
                          {field.label}
                        </label>
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.key} className="sm:col-span-2">
                        <label className="block text-xs font-bold text-ink mb-1.5">
                          {field.label}
                        </label>
                        <textarea
                          rows={3}
                          value={val}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value, 'textarea')
                          }
                          className="w-full rounded-xl border border-line/80 bg-white p-3 text-sm text-ink focus:border-teal focus:outline-none"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-ink mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        value={val}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value, field.type)
                        }
                        className="w-full rounded-xl border border-line/80 bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink-soft hover:bg-paper-alt transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-teal px-6 py-2.5 text-xs font-bold text-white hover:bg-teal-deep transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving && <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              <span>{isEdit ? 'Save Changes' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SiteIcon from '@/components/SiteIcon';
import ResourceModal from './ResourceModal';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function ResourceList({
  schema,
  customRender = null,
  headerAction = null,
}) {
  const { fetchWithAuth, showToast, refreshStats } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithAuth(schema.endpoint);
      if (!res.ok) throw new Error(`Failed to load ${schema.label}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error loading records');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, schema]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      const isEdit = Boolean(formData._id);
      const url = isEdit ? `${schema.endpoint}/${formData._id}` : schema.endpoint;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save record');
      }

      showToast(`${schema.label} saved successfully!`);
      setEditingItem(null);
      await loadItems();
      refreshStats();
    } catch (err) {
      alert(`Error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, title = 'record') => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetchWithAuth(`${schema.endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      showToast('Record deleted successfully');
      await loadItems();
      refreshStats();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();

    return items.filter((item) => {
      const enTitle = item.title?.en || item.name?.en || item.question?.en || '';
      const bnTitle = item.title?.bn || item.name?.bn || item.question?.bn || '';
      const slug = item.slug || item.category_slug || '';
      return (
        enTitle.toLowerCase().includes(q) ||
        bnTitle.toLowerCase().includes(q) ||
        slug.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            {schema.label}
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">{schema.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {headerAction}
          <button
            type="button"
            onClick={() => setEditingItem({})}
            className="rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-deep transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <SiteIcon name="check" className="size-3.5" />
            <span>Add New {schema.label}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SiteIcon
          name="search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft/60"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${schema.label.toLowerCase()}...`}
          className="w-full rounded-2xl border border-line/80 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-soft hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadItems}
            className="underline hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Custom renderer or standard cards list */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-line bg-white/70 animate-pulse p-5 space-y-3"
            >
              <div className="h-5 w-2/3 bg-line/60 rounded-md" />
              <div className="h-4 w-1/2 bg-line/40 rounded-md" />
              <div className="h-8 w-full bg-line/30 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : customRender ? (
        customRender({
          items: filteredItems,
          allItems: items,
          onEdit: setEditingItem,
          onDelete: handleDelete,
          refresh: loadItems,
        })
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-paper-alt/40 p-12 text-center space-y-3">
          <p className="font-bold text-ink text-base">No {schema.label.toLowerCase()} found</p>
          <p className="text-xs text-ink-soft max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search term or click clear.'
              : `Click "Add New ${schema.label}" above to create your first entry.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => {
            const enTitle = item.title?.en || item.name?.en || item.question?.en || 'Untitled';
            const bnTitle = item.title?.bn || item.name?.bn || item.question?.bn || '';
            const summary = item.summary?.en || item.address?.en || item.excerpt?.en || item.answer?.en || '';

            return (
              <div
                key={item._id || idx}
                className="group relative rounded-2xl border border-line/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-teal/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-ink-soft/70 bg-paper-alt px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    {item.is_published !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.is_published
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 font-bold text-ink text-base line-clamp-2 group-hover:text-teal transition-colors">
                    {enTitle}
                  </h3>
                  {bnTitle && (
                    <p className="mt-0.5 text-xs text-ink-soft font-bangla line-clamp-1">
                      {bnTitle}
                    </p>
                  )}

                  {item.slug && (
                    <p className="mt-1 text-[11px] font-mono text-teal/80 line-clamp-1">
                      /{item.slug}
                    </p>
                  )}

                  {summary && (
                    <p className="mt-2.5 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="rounded-lg bg-paper-alt px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
                  >
                    Edit (EN / বাংলা)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, enTitle)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {editingItem && (
        <ResourceModal
          schema={schema}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

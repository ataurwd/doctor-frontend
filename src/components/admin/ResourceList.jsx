'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SiteIcon from '@/components/SiteIcon';
import ResourceModal from './ResourceModal';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function ResourceList({
  schema,
  customRender = null,
  headerAction = null,
  defaultView = 'table', // 'table' | 'grid'
}) {
  const { fetchWithAuth, showToast, refreshStats } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(defaultView);
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

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle (Cards vs Table) */}
          <div className="flex items-center gap-1 rounded-xl bg-paper-alt p-1 border border-line shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-teal text-white shadow-2xs'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <SiteIcon name="menu" className="size-3" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-teal text-white shadow-2xs'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <SiteIcon name="spark" className="size-3" />
              <span>Cards</span>
            </button>
          </div>

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

      {/* Search Input & Item Counter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <SiteIcon
            name="search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft/60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${schema.label.toLowerCase()} by English / বাংলা title or slug...`}
            className="w-full rounded-2xl border border-line/80 bg-white pl-10 pr-12 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs"
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
        <span className="text-xs font-bold text-ink-soft bg-paper-alt px-3 py-2 rounded-xl border border-line whitespace-nowrap">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </span>
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

      {/* Custom renderer or standard cards/table list */}
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
          viewMode,
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
      ) : viewMode === 'table' ? (
        /* ================= EXECUTIVE DATA TABLE ================= */
        <div className="rounded-3xl border border-line/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead>
                <tr className="border-b border-line/60 bg-paper-alt/40 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  <th className="py-3.5 px-5 w-12 text-center">#</th>
                  <th className="py-3.5 px-5 min-w-[260px]">English + বাংলা Title</th>
                  <th className="py-3.5 px-5 min-w-[180px]">Route / Slug</th>
                  <th className="py-3.5 px-5 w-28">Status</th>
                  <th className="py-3.5 px-5 min-w-[240px]">Admin Note / Review</th>
                  <th className="py-3.5 px-6 text-right min-w-[140px] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredItems.map((item, idx) => {
                  const enTitle = item.title?.en || item.name?.en || item.question?.en || 'Untitled';
                  const bnTitle = item.title?.bn || item.name?.bn || item.question?.bn || '';
                  const slug = item.slug || item.category_slug || '';
                  const reviewNote = item.review_note || item.verify_note || '';

                  return (
                    <tr key={item._id || idx} className="hover:bg-paper-alt/25 transition-colors group">
                      <td className="py-4 px-5 text-center font-mono text-[11px] text-ink-soft/70">
                        {idx + 1}
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-bold text-ink text-sm leading-snug group-hover:text-teal transition-colors">
                          {enTitle}
                        </p>
                        {bnTitle ? (
                          <p className="text-xs text-ink-soft font-bangla mt-0.5 line-clamp-1">
                            {bnTitle}
                          </p>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium mt-0.5 inline-block">
                            Bangla translation needed
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        {slug ? (
                          <span className="font-mono text-xs text-teal bg-paper-alt px-2.5 py-1 rounded-lg inline-block border border-line/60">
                            /{slug}
                          </span>
                        ) : (
                          <span className="text-ink-soft/50 text-xs">-</span>
                        )}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.is_published !== false && item.is_active !== false
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.is_published !== false && item.is_active !== false ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {reviewNote ? (
                          <div
                            className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/70 rounded-xl px-2.5 py-1.5 max-w-xs truncate"
                            title={reviewNote}
                          >
                            <span className="font-semibold text-amber-700">Note: </span>
                            {reviewNote}
                          </div>
                        ) : (
                          <span className="text-xs text-ink-soft/40 italic">No notes</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="rounded-lg bg-paper-alt hover:bg-teal hover:text-white px-3 py-1.5 text-xs font-bold text-teal transition-all cursor-pointer shadow-2xs border border-line/60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, enTitle)}
                            className="rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 px-2 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= CARDS GRID ================= */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => {
            const enTitle = item.title?.en || item.name?.en || item.question?.en || 'Untitled';
            const bnTitle = item.title?.bn || item.name?.bn || item.question?.bn || '';
            const summary = item.summary?.en || item.address?.en || item.excerpt?.en || item.answer?.en || '';
            const reviewNote = item.review_note || item.verify_note || '';

            return (
              <div
                key={item._id || idx}
                className="group relative rounded-3xl border border-line/80 bg-white p-6 shadow-2xs hover:shadow-md hover:border-teal/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-line/50">
                    <span className="font-mono text-[10px] font-bold text-ink-soft/70 bg-paper-alt px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.is_published !== false && item.is_active !== false
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.is_published !== false && item.is_active !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-ink text-base line-clamp-2 group-hover:text-teal transition-colors">
                    {enTitle}
                  </h3>
                  {bnTitle ? (
                    <p className="mt-1 text-xs text-ink-soft font-bangla line-clamp-1">
                      {bnTitle}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium inline-block">
                      Bangla translation needed
                    </p>
                  )}

                  {item.slug && (
                    <p className="mt-2 text-[11px] font-mono text-teal bg-paper-alt px-2 py-0.5 rounded-md inline-block">
                      /{item.slug}
                    </p>
                  )}

                  {summary && (
                    <p className="mt-3 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  )}

                  {reviewNote && (
                    <div className="mt-3 rounded-xl bg-amber-50/80 border border-amber-200/70 p-2.5 text-[11px] text-amber-900 line-clamp-2">
                      <span className="font-semibold text-amber-700">Note: </span>
                      {reviewNote}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="rounded-lg bg-paper-alt px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer border border-line/60"
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

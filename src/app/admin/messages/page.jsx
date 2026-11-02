'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SiteIcon from '@/components/SiteIcon';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminMessagesPage() {
  const { fetchWithAuth, showToast, refreshStats } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/contact-messages');
      if (!res.ok) throw new Error('Failed to load contact messages');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const toggleRead = async (id, currentRead) => {
    try {
      const res = await fetchWithAuth(`/contact-messages/${id}/read`, {
        method: 'PUT',
        body: JSON.stringify({ is_read: !currentRead }),
      });
      if (res.ok) {
        showToast(currentRead ? 'Marked as unread' : 'Marked as read');
        loadMessages();
        refreshStats();
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    try {
      const res = await fetchWithAuth(`/contact-messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Message deleted');
        loadMessages();
        refreshStats();
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !item.is_read) ||
        (statusFilter === 'read' && item.is_read);

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.message?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Contact Messages
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            Inquiries and questions submitted via the public contact form.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-paper-alt/80 p-1 border border-line shadow-2xs">
          {['all', 'unread', 'read'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink hover:bg-white/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <SiteIcon
          name="search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft/60"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender name, email, phone, or text..."
          className="w-full rounded-2xl border border-line/80 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs"
        />
      </div>

      {/* Messages List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center">
            <span className="size-6 animate-spin rounded-full border-2 border-teal border-t-transparent inline-block" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-line/80 bg-white p-12 text-center text-xs text-ink-soft">
            No contact messages found.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-2xs ${
                item.is_read
                  ? 'bg-white/80 border-line/70'
                  : 'bg-white border-teal/40 shadow-sm ring-1 ring-teal/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-line/50">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`size-2.5 rounded-full ${
                      item.is_read ? 'bg-line' : 'bg-accent animate-pulse'
                    }`}
                  />
                  <h3 className="font-bold text-ink text-base">{item.name}</h3>
                  <span className="text-xs text-ink-soft">&bull;</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-xs font-mono text-teal hover:underline"
                  >
                    {item.email}
                  </a>
                  {item.phone && (
                    <>
                      <span className="text-xs text-ink-soft">&bull;</span>
                      <a
                        href={`tel:${item.phone}`}
                        className="text-xs font-mono text-ink-soft hover:text-ink"
                      >
                        {item.phone}
                      </a>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-soft">
                  <span className="font-mono text-[11px]">
                    {new Date(item.created_at || Date.now()).toLocaleString('en-GB')}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRead(item._id, item.is_read)}
                    className="rounded-lg bg-paper-alt px-2.5 py-1 text-[11px] font-bold text-ink hover:bg-line transition-all cursor-pointer"
                  >
                    {item.is_read ? 'Mark Unread' : 'Mark as Read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, item.name)}
                    className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap bg-paper-alt/30 rounded-xl p-4 border border-line/40">
                {item.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


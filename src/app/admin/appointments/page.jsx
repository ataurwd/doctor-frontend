'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SiteIcon from '@/components/SiteIcon';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminAppointmentsPage() {
  const { fetchWithAuth, showToast, refreshStats } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/appointments');
      if (!res.ok) throw new Error('Failed to load appointments');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetchWithAuth(`/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status updated to ${newStatus}`);
        loadAppointments();
        refreshStats();
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete request from "${name}"?`)) return;
    try {
      const res = await fetchWithAuth(`/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Request deleted');
        loadAppointments();
        refreshStats();
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.patient_name?.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.reason?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Appointment Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            Direct patient serial requests submitted via website forms.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-paper-alt/80 p-1 border border-line shadow-2xs">
          {['all', 'new', 'called', 'archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
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
          placeholder="Search by patient name, phone, or reason..."
          className="w-full rounded-2xl border border-line/80 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all shadow-2xs"
        />
      </div>

      {/* Table view */}
      <div className="rounded-3xl border border-line/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <span className="size-6 animate-spin rounded-full border-2 border-teal border-t-transparent inline-block" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-ink-soft">
            No appointment inquiries matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line/60 bg-paper-alt/40 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Patient Name</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5">Chamber</th>
                  <th className="py-3.5 px-5">Preferred Day</th>
                  <th className="py-3.5 px-5">Reason</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-paper-alt/30 transition-colors">
                    <td className="py-4 px-5 text-ink-soft font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-5 font-bold text-ink whitespace-nowrap">
                      {item.patient_name}
                    </td>
                    <td className="py-4 px-5 font-mono font-medium whitespace-nowrap">
                      <a href={`tel:${item.phone}`} className="text-teal hover:underline font-bold">
                        {item.phone}
                      </a>
                    </td>
                    <td className="py-4 px-5 text-ink font-medium">
                      {item.chamber_name || 'Any chamber'}
                    </td>
                    <td className="py-4 px-5 text-ink-soft capitalize">
                      {item.preferred_day || 'Any day'}
                    </td>
                    <td className="py-4 px-5 text-ink-soft max-w-xs truncate">
                      {item.reason || '-'}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                          item.status === 'new'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.status === 'called'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-paper-alt text-ink-soft border border-line'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(item._id, 'called')}
                            className="rounded-lg bg-teal px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs"
                          >
                            Mark Called
                          </button>
                        )}
                        {item.status === 'called' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(item._id, 'archived')}
                            className="rounded-lg bg-paper-alt px-2.5 py-1 text-[11px] font-bold text-ink hover:bg-line transition-all cursor-pointer"
                          >
                            Archive
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.patient_name)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

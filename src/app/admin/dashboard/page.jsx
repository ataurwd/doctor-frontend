'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { stats, fetchWithAuth, showToast, refreshStats } = useAdminAuth();
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/appointments');
      if (res.ok) {
        const data = await res.json();
        setRecentAppointments(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadRecent();
    refreshStats();
  }, [loadRecent, refreshStats]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetchWithAuth(`/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status updated to ${newStatus}`);
        loadRecent();
        refreshStats();
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const statCards = [
    {
      title: 'New Requests',
      value: stats?.newAppointments ?? 0,
      sub: `${stats?.totalAppointments ?? stats?.appointments ?? 0} total requests`,
      icon: 'calendar',
      route: '/admin/appointments',
      color: 'teal',
    },
    {
      title: 'Messages',
      value: stats?.unreadMessages ?? 0,
      sub: `${stats?.totalMessages ?? stats?.messages ?? 0} total messages`,
      icon: 'mail',
      route: '/admin/messages',
      color: 'accent',
    },
    {
      title: 'Active Chambers',
      value: stats?.activeChambers ?? stats?.chambers ?? 2,
      sub: 'Dhaka & Cumilla locations',
      icon: 'map',
      route: '/admin/chambers',
      color: 'teal',
    },
    {
      title: 'Specialities',
      value: stats?.specialities ?? 10,
      sub: `${stats?.specialServices ?? 5} in-clinic procedures`,
      icon: 'spark',
      route: '/admin/specialities',
      color: 'teal',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Metrics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.route}
            className="group rounded-3xl border border-line/80 bg-white p-6 shadow-2xs hover:shadow-md hover:border-teal/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                {card.title}
              </span>
              <span className="flex size-9 items-center justify-center rounded-2xl bg-paper-alt text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                <SiteIcon name={card.icon} className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-4xl font-black text-ink tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-ink-soft font-medium">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries Card */}
      <div className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-line/60">
          <div>
            <h3 className="font-black text-ink text-lg tracking-tight">
              Recent Appointment Inquiries
            </h3>
            <p className="text-xs text-ink-soft mt-0.5">
              Latest requests submitted via website booking forms.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-bold text-teal hover:text-teal-deep hover:underline"
          >
            View All Requests &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <span className="size-6 animate-spin rounded-full border-2 border-teal border-t-transparent inline-block" />
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-12 text-center text-xs text-ink-soft">
            No appointment inquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line/60 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Preferred Day</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {recentAppointments.map((item) => (
                  <tr key={item._id} className="hover:bg-paper-alt/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink">{item.patient_name}</td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      <a href={`tel:${item.phone}`} className="text-teal hover:underline">
                        {item.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft capitalize">
                      {item.preferred_day || 'Any day'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                          item.status === 'new'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.status === 'called'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-paper-alt text-ink-soft'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'new' ? (
                        <button
                          type="button"
                          onClick={() => updateStatus(item._id, 'called')}
                          className="rounded-lg bg-teal px-3 py-1 text-[11px] font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs"
                        >
                          Mark Called
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold">✓ Contacted</span>
                      )}
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


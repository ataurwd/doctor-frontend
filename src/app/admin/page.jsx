'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const RESOURCE_SCHEMAS = {
  doctors: {
    label: 'Doctor Profile',
    bilingual: [
      { key: 'name', label: 'Doctor Name' },
      { key: 'specialty_line', label: 'Specialty Line' },
      { key: 'title_line', label: 'Workplace / Title Line' },
      { key: 'credentials', label: 'Credentials' },
      { key: 'bio', label: 'Biography', multiline: true, rows: 6 },
    ],
    fields: [
      { key: 'years_experience', label: 'Years of Experience (leave empty until confirmed)', type: 'number' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
  chambers: {
    label: 'Chambers',
    bilingual: [
      { key: 'name', label: 'Chamber Name' },
      { key: 'address', label: 'Address', multiline: true, rows: 2 },
      { key: 'hours_text', label: 'Visiting Hours' },
      { key: 'hours_note', label: 'Hours Note (Optional)' },
    ],
    fields: [
      { key: 'phone_primary', label: 'Primary Phone', type: 'text' },
      { key: 'phone_secondary', label: 'Secondary Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'map_url', label: 'Google Maps URL', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active (Visible on public site)', type: 'checkbox' },
      { key: 'verify_note', label: 'Internal Verify Note (Admin only)', type: 'textarea' },
    ],
  },
  specialities: {
    label: 'Specialities',
    bilingual: [
      { key: 'title', label: 'Title' },
      { key: 'summary', label: 'Summary (shown on cards)', multiline: true, rows: 3 },
      { key: 'what_it_is', label: 'What it is', multiline: true, rows: 4 },
      { key: 'common_symptoms', label: 'Common Symptoms (one per line)', isList: true, rows: 5 },
      { key: 'how_dr_sajib_helps', label: 'How Dr. Sajib helps', multiline: true, rows: 4 },
      { key: 'when_to_see', label: 'When to see a rheumatologist', multiline: true, rows: 3 },
      { key: 'urgent_note', label: 'Urgent Signs Note (Optional)', multiline: true, rows: 3 },
    ],
    fields: [
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
  'special-services': {
    label: 'Special Services',
    bilingual: [
      { key: 'title', label: 'Title' },
      { key: 'summary', label: 'Summary (shown on cards)', multiline: true, rows: 3 },
      { key: 'what_it_is', label: 'What it is', multiline: true, rows: 4 },
      { key: 'who_needs_it', label: 'Who needs it (one per line)', isList: true, rows: 5 },
      { key: 'what_to_expect', label: 'What to expect', multiline: true, rows: 4 },
      { key: 'benefits', label: 'Benefits', multiline: true, rows: 3 },
      { key: 'when_to_see', label: 'When to see / Is this right for me? (Optional)', multiline: true, rows: 3 },
    ],
    fields: [
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
  posts: {
    label: 'Patient Education Articles',
    bilingual: [
      { key: 'title', label: 'Article Title' },
      { key: 'excerpt', label: 'Short Excerpt', multiline: true, rows: 3 },
      { key: 'body', label: 'Article Body (Markdown)', multiline: true, rows: 10 },
    ],
    fields: [
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'category_slug', label: 'Category Slug (e.g. gout-and-diet, arthritis-care)', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
  categories: {
    label: 'Topics / Categories',
    bilingual: [{ key: 'name', label: 'Category Name' }],
    fields: [{ key: 'slug', label: 'URL Slug', type: 'text' }],
  },
  handouts: {
    label: 'Printable Handouts',
    bilingual: [{ key: 'title', label: 'Handout Title' }],
    fields: [
      { key: 'post_slug', label: 'Linked Article Slug', type: 'text' },
      { key: 'file_path', label: 'PDF Path (e.g. /handouts/gout-and-diet.pdf)', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
    ],
  },
  faqs: {
    label: 'FAQs (Contact Page)',
    bilingual: [
      { key: 'question', label: 'Question' },
      { key: 'answer', label: 'Answer', multiline: true, rows: 4 },
    ],
    fields: [
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
};

export default function AdminPanelPage() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@example.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [settingsForm, setSettingsForm] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const res = await fetch(`${API_BASE}/admin${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
          'x-requested-with': 'XMLHttpRequest',
          ...(options.headers || {}),
        },
      });
      if (res.status === 401) {
        localStorage.removeItem('dr_sajib_admin_token');
        setToken('');
        setUser(null);
        throw new Error('Unauthorized');
      }
      return res.json();
    },
    [token]
  );

  useEffect(() => {
    const saved = localStorage.getItem('dr_sajib_admin_token');
    if (saved) {
      setToken(saved);
    }
  }, []);

  const loadSectionData = useCallback(async () => {
    if (!token) return;
    try {
      const meRes = await authFetch('/me');
      if (meRes?.user) setUser(meRes.user);

      if (activeSection === 'dashboard') {
        const s = await authFetch('/stats');
        setStats(s);
      } else if (activeSection === 'settings') {
        const s = await authFetch('/settings');
        setSettingsForm(s || {});
      } else {
        const list = await authFetch(`/${activeSection}`);
        setItems(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, activeSection, authFetch]);

  useEffect(() => {
    loadSectionData();
    setEditingItem(null);
  }, [loadSectionData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        return;
      }
      localStorage.setItem('dr_sajib_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setLoginError('Cannot connect to backend server on port 5000.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dr_sajib_admin_token');
    setToken('');
    setUser(null);
  };

  const handleMarkAsCalled = async (id) => {
    await authFetch(`/appointment-requests/${id}/mark-called`, { method: 'PATCH' });
    showToast('Marked as called');
    loadSectionData();
  };

  const handleUpdateAppointment = async (id, status, staff_note) => {
    await authFetch(`/appointment-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, staff_note }),
    });
    showToast('Appointment updated');
    setEditingItem(null);
    loadSectionData();
  };

  const handleToggleMessageRead = async (id) => {
    await authFetch(`/contact-messages/${id}/toggle-read`, { method: 'PATCH' });
    loadSectionData();
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await authFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsForm),
    });
    showToast('Settings saved successfully!');
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const isNew = !editingItem._id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `/${activeSection}` : `/${activeSection}/${editingItem._id}`;

    await authFetch(url, {
      method,
      body: JSON.stringify(editingItem),
    });
    showToast('Saved successfully!');
    setEditingItem(null);
    loadSectionData();
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    await authFetch(`/${activeSection}/${id}`, { method: 'DELETE' });
    showToast('Deleted');
    loadSectionData();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-2 text-3xl">Dr. Sajib Website</h1>
          <p className="mt-2 text-base text-ink-soft">
            Sign in to manage chambers, specialities, articles, appointments, and settings.
          </p>

          {loginError && (
            <p className="mt-4 rounded-xl border-2 border-[#a12a1f] bg-white p-3 text-base font-semibold text-[#a12a1f]">
              {loginError}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="field-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="field"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign in to Admin
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-center">
            <Link href="/en" className="font-semibold">
              &larr; Back to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const schema = RESOURCE_SCHEMAS[activeSection];

  return (
    <div className="min-h-screen bg-paper flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-teal-deep text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-white">Dr. Sajib Admin</p>
            <p className="text-sm text-white/75">
              {user?.email} ({user?.role})
            </p>
          </div>
          <Link
            href="/en"
            className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white no-underline hover:bg-white/25"
          >
            View Site &rarr;
          </Link>
        </div>

        <nav className="mt-8 space-y-6 flex-1">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
              Overview & Inbox
            </p>
            <ul className="space-y-1">
              {[
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'appointment-requests', label: 'Appointment Requests' },
                { key: 'contact-messages', label: 'Contact Messages' },
              ].map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                      activeSection === item.key
                        ? 'bg-white text-teal-deep font-semibold'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
              Content (EN + বাংলা)
            </p>
            <ul className="space-y-1">
              {Object.entries(RESOURCE_SCHEMAS).map(([key, cfg]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                      activeSection === key
                        ? 'bg-white text-teal-deep font-semibold'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {cfg.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {user?.role === 'admin' && (
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
                Administration
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection('settings')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                      activeSection === 'settings'
                        ? 'bg-white text-teal-deep font-semibold'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-xl border border-white/30 px-4 py-2.5 text-base font-semibold text-white hover:bg-white/10 cursor-pointer"
        >
          Sign out
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {toast && (
          <div className="fixed right-6 top-6 z-50 rounded-xl bg-teal px-5 py-3 font-semibold text-white shadow-lg">
            {toast}
          </div>
        )}

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && stats && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl">Admin Dashboard</h1>
              <span className="pill">{stats.dbMode}</span>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card">
                <p className="eyebrow">Inbox</p>
                <p className="mt-2 font-display text-4xl font-semibold text-teal">
                  {stats.newAppointments}
                </p>
                <p className="mt-1 text-base text-ink-soft">
                  New appointment requests ({stats.totalAppointments} total)
                </p>
              </div>

              <div className="card">
                <p className="eyebrow">Messages</p>
                <p className="mt-2 font-display text-4xl font-semibold text-teal">
                  {stats.unreadMessages}
                </p>
                <p className="mt-1 text-base text-ink-soft">
                  Unread contact messages ({stats.totalMessages} total)
                </p>
              </div>

              <div className="card">
                <p className="eyebrow">Chambers</p>
                <p className="mt-2 font-display text-4xl font-semibold text-teal">
                  {stats.activeChambers}
                </p>
                <p className="mt-1 text-base text-ink-soft">
                  Active chambers ({stats.totalChambers} total)
                </p>
              </div>

              <div className="card">
                <p className="eyebrow">Doctor Review</p>
                <p className="mt-2 font-display text-4xl font-semibold text-accent-deep">
                  {stats.reviewPendingCount}
                </p>
                <p className="mt-1 text-base text-ink-soft">
                  Draft items flagged for Dr. Sajib&apos;s approval
                </p>
              </div>
            </div>

            <div className="card mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Recent Appointment Requests</h2>
                <button
                  type="button"
                  onClick={() => setActiveSection('appointment-requests')}
                  className="btn btn-outline"
                >
                  View all
                </button>
              </div>

              {stats.recentAppointments?.length === 0 ? (
                <p className="mt-4 text-ink-soft">No appointment requests yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-line text-base text-ink-soft">
                        <th className="py-3 pr-4">Name</th>
                        <th className="py-3 pr-4">Phone</th>
                        <th className="py-3 pr-4">Day</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.recentAppointments || []).map((req) => (
                        <tr key={req._id} className="border-b border-line/60">
                          <td className="py-3 pr-4 font-semibold">{req.name}</td>
                          <td className="py-3 pr-4">{req.phone}</td>
                          <td className="py-3 pr-4 capitalize">{req.preferred_day || 'Any'}</td>
                          <td className="py-3 pr-4">
                            <span className="pill capitalize">{req.status}</span>
                          </td>
                          <td className="py-3">
                            {req.status === 'new' && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsCalled(req._id)}
                                className="btn btn-primary px-4 py-2 text-sm"
                              >
                                Mark as called
                              </button>
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
        )}

        {/* APPOINTMENT REQUESTS */}
        {activeSection === 'appointment-requests' && (
          <div>
            <h1 className="text-3xl sm:text-4xl">Appointment Requests</h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {['all', 'new', 'called', 'booked', 'closed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`pill cursor-pointer capitalize ${
                    statusFilter === st ? '!bg-teal !text-white' : ''
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {editingItem && (
              <div className="card mt-6">
                <h2 className="text-2xl">Edit Request: {editingItem.name}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Status</label>
                    <select
                      className="field"
                      value={editingItem.status}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, status: e.target.value })
                      }
                    >
                      {['new', 'called', 'booked', 'closed'].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Staff Note</label>
                    <input
                      type="text"
                      className="field"
                      value={editingItem.staff_note || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, staff_note: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateAppointment(
                        editingItem._id,
                        editingItem.status,
                        editingItem.staff_note
                      )
                    }
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="card mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-base text-ink-soft">
                    <th className="py-3 pr-4">Actions</th>
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4 hidden md:table-cell">Preferred Day</th>
                    <th className="py-3 pr-4 hidden md:table-cell">Reason</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter((i) => statusFilter === 'all' || i.status === statusFilter)
                    .map((req) => (
                      <tr key={req._id} className="border-b border-line/60">
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            {req.status === 'new' && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsCalled(req._id)}
                                className="btn btn-primary px-3 py-1.5 text-sm"
                              >
                                Mark as called
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setEditingItem(req)}
                              className="btn btn-outline px-3 py-1.5 text-sm"
                            >
                              Open
                            </button>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-semibold">{req.name}</td>
                        <td className="py-3 pr-4">
                          <a href={`tel:+88${req.phone}`}>{req.phone}</a>
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell capitalize">
                          {req.preferred_day || 'Any'}
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell">{req.reason || '-'}</td>
                        <td className="py-3 pr-4">
                          <span className="pill capitalize">{req.status}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACT MESSAGES */}
        {activeSection === 'contact-messages' && (
          <div>
            <h1 className="text-3xl sm:text-4xl">Contact Messages</h1>
            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <p className="card">No contact messages yet.</p>
              ) : (
                items.map((msg) => (
                  <div key={msg._id} className="card">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl">
                          {msg.name} · <a href={`tel:+88${msg.phone}`}>{msg.phone}</a>
                        </h2>
                        {msg.email && <p className="text-base text-ink-soft">{msg.email}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleMessageRead(msg._id)}
                          className={`btn ${msg.is_read ? 'btn-outline' : 'btn-primary'}`}
                        >
                          {msg.is_read ? 'Read (Mark Unread)' : 'Mark as Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(msg._id)}
                          className="btn btn-outline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 rounded-xl bg-paper-alt p-4">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeSection === 'settings' && (
          <div>
            <h1 className="text-3xl sm:text-4xl">Site Settings</h1>
            <form onSubmit={handleSaveSettings} className="card mt-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="field-label">
                    General Call Number (Hero & Mobile Bar)
                  </label>
                  <input
                    type="text"
                    className="field"
                    value={settingsForm.call_number || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, call_number: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">
                    WhatsApp Number (Empty hides all WhatsApp buttons)
                  </label>
                  <input
                    type="text"
                    className="field"
                    placeholder="e.g. 01711647877"
                    value={settingsForm.whatsapp_number || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Default WhatsApp Message</label>
                  <input
                    type="text"
                    className="field"
                    value={settingsForm.whatsapp_message || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsapp_message: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Notification Email (public_email)</label>
                  <input
                    type="email"
                    className="field"
                    value={settingsForm.public_email || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, public_email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Facebook URL</label>
                  <input
                    type="text"
                    className="field"
                    value={settingsForm.facebook_url || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, facebook_url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Doctor Photo Credit</label>
                  <input
                    type="text"
                    className="field"
                    value={settingsForm.doctor_photo_credit || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        doctor_photo_credit: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 border-t border-line pt-6">
                <div>
                  <label className="field-label">Hours Banner Text (English)</label>
                  <textarea
                    rows={2}
                    className="field"
                    value={settingsForm.hours_banner_text_en || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        hours_banner_text_en: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Hours Banner Text (বাংলা)</label>
                  <textarea
                    rows={2}
                    className="field"
                    value={settingsForm.hours_banner_text_bn || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        hours_banner_text_bn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="field-label">Site Disclaimer (English)</label>
                  <textarea
                    rows={3}
                    className="field"
                    value={settingsForm.site_disclaimer_en || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        site_disclaimer_en: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Site Disclaimer (বাংলা)</label>
                  <textarea
                    rows={3}
                    className="field"
                    value={settingsForm.site_disclaimer_bn || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        site_disclaimer_bn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="field-label">Page Disclaimer (English)</label>
                  <textarea
                    rows={3}
                    className="field"
                    value={settingsForm.page_disclaimer_en || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        page_disclaimer_en: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Page Disclaimer (বাংলা)</label>
                  <textarea
                    rows={3}
                    className="field"
                    value={settingsForm.page_disclaimer_bn || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        page_disclaimer_bn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* BILINGUAL CONTENT RESOURCES */}
        {schema && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl">{schema.label}</h1>
              {!editingItem && activeSection !== 'doctors' && (
                <button
                  type="button"
                  onClick={() =>
                    setEditingItem({ is_published: true, is_active: true, sort_order: items.length + 1 })
                  }
                  className="btn btn-primary"
                >
                  + Add New
                </button>
              )}
            </div>

            {editingItem ? (
              <form onSubmit={handleSaveResource} className="card mt-6 space-y-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <h2 className="text-2xl">
                    {editingItem._id ? 'Edit Item' : 'Create New Item'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>

                {/* Side by side English and Bangla fields */}
                {schema.bilingual.map((bf) => {
                  const valObj = editingItem[bf.key] || { en: bf.isList ? [] : '', bn: bf.isList ? [] : '' };
                  const enText = bf.isList
                    ? (valObj.en || []).join('\n')
                    : valObj.en || '';
                  const bnText = bf.isList
                    ? (valObj.bn || []).join('\n')
                    : valObj.bn || '';

                  const updateLang = (lang, rawVal) => {
                    const parsed = bf.isList
                      ? rawVal.split('\n').map((s) => s.trim()).filter(Boolean)
                      : rawVal;
                    setEditingItem({
                      ...editingItem,
                      [bf.key]: {
                        ...valObj,
                        [lang]: parsed,
                      },
                    });
                  };

                  return (
                    <div key={bf.key} className="grid gap-6 md:grid-cols-2 border-b border-line/60 pb-6">
                      <div>
                        <label className="field-label">{bf.label} (English)</label>
                        {bf.multiline || bf.isList ? (
                          <textarea
                            rows={bf.rows || 4}
                            className="field"
                            value={enText}
                            onChange={(e) => updateLang('en', e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="field"
                            value={enText}
                            onChange={(e) => updateLang('en', e.target.value)}
                          />
                        )}
                      </div>
                      <div>
                        <label className="field-label">{bf.label} (বাংলা)</label>
                        {bf.multiline || bf.isList ? (
                          <textarea
                            rows={bf.rows || 4}
                            className="field"
                            lang="bn"
                            value={bnText}
                            onChange={(e) => updateLang('bn', e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="field"
                            lang="bn"
                            value={bnText}
                            onChange={(e) => updateLang('bn', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Non-translatable fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {schema.fields.map((f) => {
                    if (f.type === 'checkbox') {
                      return (
                        <div key={f.key} className="flex items-center gap-3 pt-4">
                          <input
                            type="checkbox"
                            id={f.key}
                            className="size-6 accent-teal"
                            checked={Boolean(editingItem[f.key])}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, [f.key]: e.target.checked })
                            }
                          />
                          <label htmlFor={f.key} className="font-semibold">
                            {f.label}
                          </label>
                        </div>
                      );
                    }
                    if (f.type === 'textarea') {
                      return (
                        <div key={f.key} className="sm:col-span-2">
                          <label className="field-label">{f.label}</label>
                          <textarea
                            rows={2}
                            className="field bg-paper-alt/50"
                            value={editingItem[f.key] || ''}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, [f.key]: e.target.value })
                            }
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={f.key}>
                        <label className="field-label">{f.label}</label>
                        <input
                          type={f.type}
                          className="field"
                          value={editingItem[f.key] ?? ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              [f.key]:
                                f.type === 'number'
                                  ? e.target.value === ''
                                    ? null
                                    : Number(e.target.value)
                                  : e.target.value,
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => {
                  const titleObj = item.title || item.name || item.question || {};
                  const enTitle = titleObj.en || item.slug || item._id;
                  const bnTitle = titleObj.bn || '';
                  const note = item.review_note || item.verify_note;

                  return (
                    <div
                      key={item._id}
                      className="card flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="max-w-2xl">
                        <h2 className="text-xl font-semibold">{enTitle}</h2>
                        {bnTitle && (
                          <p className="text-ink-soft" lang="bn">
                            {bnTitle}
                          </p>
                        )}
                        {note && (
                          <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-paper-alt px-3 py-1 text-sm font-medium text-accent-deep">
                            <SiteIcon name="alert" className="size-4 shrink-0" /> {note}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {item.is_active === false && (
                          <span className="pill !bg-paper-alt">Hidden (Inactive)</span>
                        )}
                        {item.is_published === false && (
                          <span className="pill !bg-paper-alt">Draft</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="btn btn-primary"
                        >
                          Edit (EN / বাংলা)
                        </button>
                        {activeSection !== 'doctors' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(item._id)}
                            className="btn btn-outline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


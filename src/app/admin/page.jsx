'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const RESOURCE_SCHEMAS = {
  doctors: {
    label: 'Doctor Profile',
    icon: 'user',
    description: 'Edit Dr. Sajib’s credentials, biography, and professional details.',
    bilingual: [
      { key: 'name', label: 'Doctor Name' },
      { key: 'specialty_line', label: 'Specialty Line' },
      { key: 'title_line', label: 'Workplace / Title Line' },
      { key: 'credentials', label: 'Credentials' },
      { key: 'bio', label: 'Biography', multiline: true, rows: 6 },
    ],
    fields: [
      { key: 'years_experience', label: 'Years of Experience', type: 'number' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
      { key: 'review_note', label: 'Internal Review Note (Admin only)', type: 'textarea' },
    ],
  },
  chambers: {
    label: 'Chambers',
    icon: 'map',
    description: 'Manage clinical locations, visiting hours, and contact numbers.',
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
    icon: 'joint',
    description: 'Manage clinical specialities (Rheumatoid Arthritis, Lupus, Gout, etc.).',
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
    icon: 'spark',
    description: 'In-clinic diagnostic procedures (POCUS Ultrasound, Biopsy, Injections).',
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
    label: 'Patient Education',
    icon: 'info',
    description: 'Articles and health guides for patients and families.',
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
    icon: 'menu',
    description: 'Classification tags for patient education articles.',
    bilingual: [{ key: 'name', label: 'Category Name' }],
    fields: [{ key: 'slug', label: 'URL Slug', type: 'text' }],
  },
  handouts: {
    label: 'Printable Handouts',
    icon: 'download',
    description: 'Downloadable PDF patient guides and chamber resources.',
    bilingual: [{ key: 'title', label: 'Handout Title' }],
    fields: [
      { key: 'post_slug', label: 'Linked Article Slug', type: 'text' },
      { key: 'file_path', label: 'PDF Path (e.g. /handouts/gout-and-diet.pdf)', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
    ],
  },
  faqs: {
    label: 'FAQs',
    icon: 'alert',
    description: 'Frequently asked questions displayed on the contact page.',
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

const VALID_SECTIONS = [
  'dashboard',
  'appointment-requests',
  'contact-messages',
  ...Object.keys(RESOURCE_SCHEMAS),
  'settings',
];

export default function AdminPanelPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@example.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [editingItem, setEditingItem] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfPreviewTitle, setPdfPreviewTitle] = useState('');
  const [settingsForm, setSettingsForm] = useState({});
  const [toast, setToast] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // 1. Initial Load: Mounted, Token from localStorage and Section from URL
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dr_sajib_admin_token');
    if (saved) {
      setToken(saved);
    } else {
      setLoading(false);
    }

    const syncSectionFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') || window.location.hash.replace('#', '');
        if (tabParam && VALID_SECTIONS.includes(tabParam)) {
          setActiveSection(tabParam);
        }
      }
    };

    syncSectionFromUrl();
    window.addEventListener('popstate', syncSectionFromUrl);
    return () => window.removeEventListener('popstate', syncSectionFromUrl);
  }, []);

  // 2. Change section & persist in URL
  const handleSelectSection = (key) => {
    setActiveSection(key);
    setEditingItem(null);
    setSearchQuery('');
    setMobileMenuOpen(false);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', key);
      window.history.pushState({}, '', url.toString());
    }
  };

  // 3. Authenticated API Fetch
  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      if (!token) throw new Error('No token');
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

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('dr_sajib_admin_token');
        setToken('');
        setUser(null);
        throw new Error('Session expired or unauthorized');
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      return res.json();
    },
    [token]
  );

  const adminCache = useRef(new Map());

  // 4. Load Data whenever activeSection or token changes (Optimized with SWR and Parallel Fetching)
  const loadSectionData = useCallback(
    async (bypassCache = false) => {
      if (!token) return;

      // SWR Pattern: If data is already in client memory, show it instantly (0ms latency!)
      if (!bypassCache && adminCache.current.has(activeSection)) {
        const cached = adminCache.current.get(activeSection);
        if (activeSection === 'dashboard') setStats(cached);
        else if (activeSection === 'settings') setSettingsForm(cached);
        else setItems(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }

      setLoadError('');

      try {
        // Parallelize /me with section fetch to eliminate waterfall delay
        const mePromise = !user ? authFetch('/me').catch(() => null) : Promise.resolve(null);
        const sectionPromise =
          activeSection === 'dashboard'
            ? authFetch('/stats')
            : activeSection === 'settings'
            ? authFetch('/settings')
            : authFetch(`/${activeSection}`);

        const [meRes, resData] = await Promise.all([mePromise, sectionPromise]);

        if (meRes?.user) setUser(meRes.user);

        if (activeSection === 'dashboard') {
          const s = resData || {};
          setStats(s);
          adminCache.current.set('dashboard', s);
        } else if (activeSection === 'settings') {
          const s = resData || {};
          setSettingsForm(s);
          adminCache.current.set('settings', s);
        } else {
          const list = Array.isArray(resData) ? resData : [];
          setItems(list);
          adminCache.current.set(activeSection, list);
        }
      } catch (err) {
        console.error('[Admin Data Load Error]:', err);
        // Only show error banner if we don't already have cached data displayed
        if (!adminCache.current.has(activeSection)) {
          setLoadError(err.message || 'Failed to load section data from server.');
        }
      } finally {
        setLoading(false);
      }
    },
    [token, activeSection, user, authFetch]
  );

  useEffect(() => {
    loadSectionData();
    setEditingItem(null);
  }, [loadSectionData]);

  // 5. Auth Actions
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

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
        setLoginError(data.error || 'Invalid credentials.');
        setLoginSubmitting(false);
        return;
      }

      localStorage.setItem('dr_sajib_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast('Welcome back, ' + (data.user?.name || 'Admin'));
    } catch (err) {
      setLoginError('Cannot connect to backend server. Please verify your connection.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dr_sajib_admin_token');
    setToken('');
    setUser(null);
    setStats(null);
    setItems([]);
  };

  // 6. Section Specific Handlers
  const handleMarkAsCalled = async (id) => {
    try {
      await authFetch(`/appointment-requests/${id}/mark-called`, { method: 'PATCH' });
      showToast('Marked as called!');
      loadSectionData(true);
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  };

  const handleUpdateAppointment = async (id, status, staff_note) => {
    try {
      await authFetch(`/appointment-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, staff_note }),
      });
      showToast('Appointment updated successfully!');
      setEditingItem(null);
      loadSectionData(true);
    } catch (e) {
      showToast('Error updating: ' + e.message);
    }
  };

  const handleToggleMessageRead = async (id) => {
    try {
      await authFetch(`/contact-messages/${id}/toggle-read`, { method: 'PATCH' });
      loadSectionData(true);
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm),
      });
      showToast('Settings saved successfully!');
      loadSectionData(true);
    } catch (e) {
      showToast('Failed to save settings: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    const isNew = !editingItem._id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `/${activeSection}` : `/${activeSection}/${editingItem._id}`;

    try {
      await authFetch(url, {
        method,
        body: JSON.stringify(editingItem),
      });
      showToast(isNew ? 'Created successfully!' : 'Saved successfully!');
      setEditingItem(null);
      loadSectionData(true);
    } catch (e) {
      showToast('Save failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await authFetch(`/${activeSection}/${id}`, { method: 'DELETE' });
      showToast('Item deleted.');
      loadSectionData(true);
    } catch (e) {
      showToast('Delete failed: ' + e.message);
    }
  };

  // 7. Filtered items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const enTitle = (item.title?.en || item.name?.en || item.question?.en || item.slug || '').toLowerCase();
      const bnTitle = (item.title?.bn || item.name?.bn || item.question?.bn || '').toLowerCase();
      const phone = (item.phone || item.phone_primary || '').toLowerCase();
      return enTitle.includes(q) || bnTitle.includes(q) || phone.includes(q);
    });
  }, [items, searchQuery]);

  // MOUNTED GUARD (Prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-ink-soft">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#133430] via-[#1b2e2a] to-[#0f2421] flex items-center justify-center p-4 font-sans text-ink">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal text-white shadow-md">
              <SiteIcon name="shield" className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-deep">Management Portal</p>
              <h1 className="text-2xl font-black text-ink">Dr. Sajib Admin</h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-ink-soft leading-relaxed">
            Secure administrative control for clinical schedules, specialities, patient appointments, and multilingual content.
          </p>

          {loginError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 flex items-start gap-2.5">
              <SiteIcon name="alert" className="size-5 shrink-0 mt-0.5 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="mt-2 w-full rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-md hover:bg-teal-deep transition-all duration-200 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
            >
              {loginSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-paper-alt/80 border border-line/70 p-3 text-xs text-ink-soft">
              <div>
                <span className="font-bold text-ink">Demo:</span> admin@example.com
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@example.com');
                  setLoginPassword('UjmeMkFNsQ3Rk2f4rV6Q');
                }}
                className="rounded-lg bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-line/60 pt-5 text-center">
            <Link href="/en" className="text-xs font-bold text-teal hover:text-teal-deep inline-flex items-center gap-1.5">
              <span>&larr; Return to public website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSchema = RESOURCE_SCHEMAS[activeSection];

  return (
    <div className="min-h-screen bg-[#faf8f4] flex flex-col lg:flex-row font-sans text-ink antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl bg-teal px-5 py-3.5 text-sm font-bold text-white shadow-xl animate-fade-in flex items-center gap-2.5">
          <SiteIcon name="check" className="size-4 text-accent" />
          <span>{toast}</span>
        </div>
      )}

      {/* PDF Document Preview Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl rounded-3xl bg-white border border-line shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-alt/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xs shadow-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-ink truncate">
                    {pdfPreviewTitle || 'Printable Patient Guide / Handout'}
                  </h3>
                  <p className="text-xs font-mono text-ink-soft truncate">{pdfPreviewUrl}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pdfPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Open in new browser window to print"
                >
                  <SiteIcon name="arrow-up-right" className="size-3.5" />
                  <span>Open & Print</span>
                </a>

                <a
                  href={pdfPreviewUrl}
                  download
                  className="rounded-xl bg-teal px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-deep transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <SiteIcon name="download" className="size-3.5" />
                  <span>Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setPdfPreviewUrl(null);
                    setPdfPreviewTitle('');
                  }}
                  className="flex size-8 items-center justify-center rounded-xl border border-line bg-white text-ink-soft hover:bg-paper-alt cursor-pointer ml-1"
                >
                  <SiteIcon name="close" className="size-4" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe viewer */}
            <div className="flex-1 p-3 bg-paper-alt/20 min-h-[520px]">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full min-h-[550px] rounded-2xl border border-line/80 bg-white shadow-inner"
                title="PDF Document"
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between bg-teal-deep text-white px-5 py-4 border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white">
            <SiteIcon name="shield" className="size-5" />
          </div>
          <div>
            <p className="font-extrabold text-sm leading-tight text-white">Dr. Sajib Admin</p>
            <p className="text-[11px] text-white/70">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/en" className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white">
            View Site &rarr;
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white"
          >
            <SiteIcon name={mobileMenuOpen ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`w-full lg:w-72 bg-gradient-to-b from-[#133430] to-[#0d2522] text-white p-5 lg:p-6 flex flex-col shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ${
          mobileMenuOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        {/* Top Header Card */}
        <div className="hidden lg:flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/15 text-accent shadow-2xs">
              <SiteIcon name="shield" className="size-5" />
            </div>
            <div>
              <p className="font-extrabold text-base tracking-tight text-white">Dr. Sajib Admin</p>
              <p className="text-xs text-white/60 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/en"
            className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-bold text-white/90 hover:bg-white/20 transition-colors"
            title="Open Public Website"
          >
            Site &rarr;
          </Link>
        </div>

        {/* Navigation Categories */}
        <nav className="mt-6 space-y-6 flex-1">
          {/* Section 1: Overview */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/50 mb-2 px-3">
              Overview & Inbox
            </p>
            <ul className="space-y-1">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: 'activity' },
                { key: 'appointment-requests', label: 'Appointment Requests', icon: 'calendar', badge: stats?.newAppointments },
                { key: 'contact-messages', label: 'Contact Messages', icon: 'mail', badge: stats?.unreadMessages },
              ].map((item) => {
                const active = activeSection === item.key;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => handleSelectSection(item.key)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-white text-teal-deep shadow-md font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SiteIcon name={item.icon} className={`size-4.5 ${active ? 'text-teal' : 'text-white/60'}`} />
                        <span>{item.label}</span>
                      </div>
                      {Boolean(item.badge) && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${active ? 'bg-accent text-white' : 'bg-accent/80 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section 2: Clinical Content */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/50 mb-2 px-3 flex items-center justify-between">
              <span>Clinical Content</span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded text-white/90 font-bangla font-bold" lang="bn">বাংলা + EN</span>
            </p>
            <ul className="space-y-1">
              {Object.entries(RESOURCE_SCHEMAS).map(([key, cfg]) => {
                const active = activeSection === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handleSelectSection(key)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-white text-teal-deep shadow-md font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SiteIcon name={cfg.icon} className={`size-4.5 ${active ? 'text-teal' : 'text-white/60'}`} />
                        <span>{cfg.label}</span>
                      </div>
                      {key === 'specialities' && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">10</span>
                      )}
                      {key === 'special-services' && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">5</span>
                      )}
                      {key === 'chambers' && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">3</span>
                      )}
                      {key === 'posts' && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">3</span>
                      )}
                      {key === 'faqs' && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">4</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section 3: System Settings */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/50 mb-2 px-3">
              Configuration
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelectSection('settings')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'settings'
                      ? 'bg-white text-teal-deep shadow-md font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <SiteIcon name="globe" className={`size-4.5 ${activeSection === 'settings' ? 'text-teal' : 'text-white/60'}`} />
                  <span>Site Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <SiteIcon name="close" className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-line/70 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <p className="text-xs font-bold text-ink-soft/70 uppercase tracking-wider">
              Management &gt; <span className="text-teal font-extrabold capitalize">{activeSection.replace('-', ' ')}</span>
            </p>
            <h2 className="text-xl font-black text-ink mt-0.5">
              {currentSchema?.label || (activeSection === 'dashboard' ? 'Overview Dashboard' : activeSection === 'settings' ? 'Global Settings' : activeSection.replace('-', ' '))}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MongoDB Atlas Connected</span>
            </span>

            <button
              type="button"
              onClick={() => loadSectionData(true)}
              title="Refresh Data"
              className="flex size-9 items-center justify-center rounded-xl border border-line bg-white text-ink-soft hover:text-teal hover:border-teal transition-all cursor-pointer shadow-2xs"
            >
              <SiteIcon name="spark" className={`size-4 ${loading ? 'animate-spin text-teal' : ''}`} />
            </button>

            <Link
              href="/en"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-paper-alt px-3.5 py-2 text-xs font-bold text-ink hover:bg-teal hover:text-white transition-all shadow-2xs"
            >
              <span>View Live Site</span>
              <SiteIcon name="arrow-up-right" className="size-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 w-full">
          {/* Error Banner with Retry */}
          {loadError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SiteIcon name="alert" className="size-5 text-red-600 shrink-0" />
                <span>{loadError}</span>
              </div>
              <button
                type="button"
                onClick={loadSectionData}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* SKELETON LOADING STATE */}
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 w-64 bg-line/60 rounded-xl" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-32 rounded-3xl bg-white border border-line/70 p-6 flex flex-col justify-between">
                    <div className="h-4 w-20 bg-line/60 rounded" />
                    <div className="h-8 w-16 bg-line/70 rounded" />
                    <div className="h-3 w-32 bg-line/50 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-96 rounded-3xl bg-white border border-line/70 p-6" />
            </div>
          ) : (
            <>
              {/* SECTION 1: DASHBOARD */}
              {activeSection === 'dashboard' && (
                <div className="space-y-8">
                  {/* KPI Stat Cards */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group rounded-3xl border border-line/80 bg-white p-6 shadow-[0_4px_20px_rgba(27,46,42,0.03)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/75">New Requests</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
                          <SiteIcon name="calendar" className="size-4.5" />
                        </div>
                      </div>
                      <p className="mt-3 text-4xl font-black text-teal">
                        {stats?.newAppointments ?? 0}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Pending appointment inquiries ({stats?.totalAppointments ?? 0} total)
                      </p>
                    </div>

                    <div className="group rounded-3xl border border-line/80 bg-white p-6 shadow-[0_4px_20px_rgba(27,46,42,0.03)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/75">Messages</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent-deep">
                          <SiteIcon name="mail" className="size-4.5" />
                        </div>
                      </div>
                      <p className="mt-3 text-4xl font-black text-accent-deep">
                        {stats?.unreadMessages ?? 0}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Unread contact messages ({stats?.totalMessages ?? 0} total)
                      </p>
                    </div>

                    <div className="group rounded-3xl border border-line/80 bg-white p-6 shadow-[0_4px_20px_rgba(27,46,42,0.03)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/75">Active Chambers</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <SiteIcon name="map" className="size-4.5" />
                        </div>
                      </div>
                      <p className="mt-3 text-4xl font-black text-emerald-700">
                        {stats?.activeChambers ?? 2}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Dhaka & Cumilla locations ({stats?.totalChambers ?? 2} listed)
                      </p>
                    </div>

                    <div className="group rounded-3xl border border-line/80 bg-white p-6 shadow-[0_4px_20px_rgba(27,46,42,0.03)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/75">Specialities</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                          <SiteIcon name="joint" className="size-4.5" />
                        </div>
                      </div>
                      <p className="mt-3 text-4xl font-black text-sky-800">
                        10
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Clinical fields + 5 in-clinic procedures
                      </p>
                    </div>
                  </div>

                  {/* Recent Appointments Table */}
                  <div className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(27,46,42,0.03)]">
                    <div className="flex items-center justify-between pb-5 border-b border-line/60">
                      <div>
                        <h3 className="text-xl font-bold text-ink">Recent Appointment Inquiries</h3>
                        <p className="text-xs text-ink-soft mt-0.5">Latest requests submitted via website booking forms.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectSection('appointment-requests')}
                        className="rounded-xl border border-line bg-paper-alt px-3.5 py-2 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
                      >
                        View All Requests &rarr;
                      </button>
                    </div>

                    {!stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-paper-alt mx-auto text-ink-soft">
                          <SiteIcon name="calendar" className="size-6" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-ink">No appointment requests yet.</p>
                        <p className="text-xs text-ink-soft mt-1">New requests submitted from the public site will appear here.</p>
                      </div>
                    ) : (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line text-xs font-bold uppercase tracking-wider text-ink-soft/70">
                              <th className="py-3.5 pr-4">Patient Name</th>
                              <th className="py-3.5 pr-4">Phone Number</th>
                              <th className="py-3.5 pr-4">Preferred Day</th>
                              <th className="py-3.5 pr-4">Status</th>
                              <th className="py-3.5 text-right">Quick Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line/50">
                            {stats.recentAppointments.map((req) => (
                              <tr key={req._id} className="hover:bg-paper-alt/40 transition-colors">
                                <td className="py-3.5 pr-4 font-bold text-ink">{req.name}</td>
                                <td className="py-3.5 pr-4 font-mono font-medium text-ink-soft">
                                  <a href={`tel:${req.phone}`} className="hover:text-teal hover:underline">{req.phone}</a>
                                </td>
                                <td className="py-3.5 pr-4 capitalize text-ink-soft">{req.preferred_day || 'Any day'}</td>
                                <td className="py-3.5 pr-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                    req.status === 'new'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : req.status === 'called'
                                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                  }`}>
                                    {req.status}
                                  </span>
                                </td>
                                <td className="py-3.5 text-right">
                                  {req.status === 'new' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkAsCalled(req._id)}
                                      className="rounded-xl bg-teal px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs"
                                    >
                                      Mark Called
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSelectSection('appointment-requests')}
                                      className="text-xs font-bold text-teal hover:underline"
                                    >
                                      Manage
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

              {/* SECTION 2: APPOINTMENT REQUESTS FULL VIEW */}
              {activeSection === 'appointment-requests' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-ink">Appointment Requests</h2>
                      <p className="text-xs text-ink-soft mt-1">Review, follow up, and update patient appointment records.</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                      {['all', 'new', 'called', 'booked', 'closed'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                            statusFilter === st
                              ? 'bg-teal text-white shadow-xs'
                              : 'bg-white border border-line text-ink-soft hover:bg-paper-alt'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Edit Appointment Drawer / Card */}
                  {editingItem && (
                    <div className="rounded-3xl border border-teal/30 bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between pb-4 border-b border-line">
                        <h3 className="text-lg font-bold text-ink">Update Request: {editingItem.name}</h3>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="text-xs font-bold text-ink-soft hover:text-ink cursor-pointer"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                            Booking Status
                          </label>
                          <select
                            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
                            value={editingItem.status}
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                          >
                            <option value="new">New</option>
                            <option value="called">Called / Followed up</option>
                            <option value="booked">Booked (Confirmed serial)</option>
                            <option value="closed">Closed / Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                            Staff Internal Notes
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink"
                            value={editingItem.staff_note || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, staff_note: e.target.value })}
                            placeholder="e.g. Serial #12 given for Saturday 6pm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateAppointment(editingItem._id, editingItem.status, editingItem.staff_note)}
                          className="rounded-xl bg-teal px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-deep transition-all cursor-pointer"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-ink-soft hover:bg-paper-alt cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Appointments Table */}
                  <div className="rounded-3xl border border-line/80 bg-white p-6 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-line text-xs font-bold uppercase tracking-wider text-ink-soft/70">
                          <th className="py-3.5 pr-4">Patient Name</th>
                          <th className="py-3.5 pr-4">Phone</th>
                          <th className="py-3.5 pr-4">Preferred Day</th>
                          <th className="py-3.5 pr-4">Status</th>
                          <th className="py-3.5 pr-4">Staff Note</th>
                          <th className="py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/50">
                        {items
                          .filter((i) => statusFilter === 'all' || i.status === statusFilter)
                          .map((req) => (
                            <tr key={req._id} className="hover:bg-paper-alt/30 transition-colors">
                              <td className="py-3.5 pr-4 font-bold text-ink">{req.name}</td>
                              <td className="py-3.5 pr-4 font-mono font-medium text-ink-soft">
                                <a href={`tel:${req.phone}`} className="hover:text-teal hover:underline">{req.phone}</a>
                              </td>
                              <td className="py-3.5 pr-4 capitalize text-ink-soft">{req.preferred_day || 'Any day'}</td>
                              <td className="py-3.5 pr-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                  req.status === 'new'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : req.status === 'called'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="py-3.5 pr-4 text-xs text-ink-soft max-w-xs truncate">
                                {req.staff_note || '—'}
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => setEditingItem(req)}
                                  className="rounded-xl border border-line bg-paper-alt px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
                                >
                                  Edit Note
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {items.filter((i) => statusFilter === 'all' || i.status === statusFilter).length === 0 && (
                      <p className="py-12 text-center text-sm font-semibold text-ink-soft">
                        No appointments found matching filter &quot;{statusFilter}&quot;.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 3: CONTACT MESSAGES */}
              {activeSection === 'contact-messages' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-ink">Contact Messages</h2>
                    <p className="text-xs text-ink-soft mt-1">General inquiries received through the contact page form.</p>
                  </div>

                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <div className="rounded-3xl border border-line/80 bg-white p-12 text-center text-ink-soft">
                        <SiteIcon name="mail" className="size-8 mx-auto text-ink-soft/40 mb-3" />
                        <p className="font-semibold text-ink">No contact messages yet.</p>
                      </div>
                    ) : (
                      items.map((msg) => (
                        <div
                          key={msg._id}
                          className={`rounded-3xl border p-6 transition-all ${
                            msg.is_read
                              ? 'border-line/70 bg-white/70'
                              : 'border-accent/30 bg-white shadow-sm'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line/50">
                            <div>
                              <p className="font-bold text-ink text-base">{msg.name}</p>
                              <p className="text-xs text-ink-soft">
                                <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email || 'No email provided'}</a> • <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!msg.is_read && (
                                <span className="rounded-full bg-accent/15 text-accent-deep border border-accent/20 px-2.5 py-0.5 text-xs font-extrabold">
                                  Unread
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleMessageRead(msg._id)}
                                className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-paper-alt cursor-pointer"
                              >
                                {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 4: SITE SETTINGS */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-ink">Global Site Settings</h2>
                    <p className="text-xs text-ink-soft mt-1">Configure emergency phone numbers, notice banners, and disclaimers.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                          Direct Call Number (e.g. 01711-647877)
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink"
                          value={settingsForm.call_number || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, call_number: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink"
                          value={settingsForm.whatsapp_number || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 border-t border-line/60 pt-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                          Hours Banner Notice (English)
                        </label>
                        <textarea
                          rows={2}
                          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink"
                          value={settingsForm.hours_banner_text_en || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hours_banner_text_en: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                          চেম্বার বিজ্ঞপ্তি (বাংলা - Li Ador Bangla)
                        </label>
                        <textarea
                          rows={2}
                          lang="bn"
                          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink font-bangla"
                          value={settingsForm.hours_banner_text_bn || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hours_banner_text_bn: e.target.value })}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-teal px-6 py-3.5 text-sm font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-md inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Saving Settings...</span>
                        </>
                      ) : (
                        <span>Save Settings</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* SECTION 5: CONTENT SCHEMA RESOURCES (DOCTORS, CHAMBERS, SPECIALITIES, ETC.) */}
              {currentSchema && (
                <div className="space-y-6">
                  {/* Top Bar with Search & Add Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-ink">{currentSchema.label}</h2>
                      <p className="text-xs text-ink-soft mt-1">{currentSchema.description}</p>
                    </div>

                    {!editingItem && activeSection !== 'doctors' && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            is_published: true,
                            is_active: true,
                            sort_order: items.length + 1,
                          })
                        }
                        className="rounded-xl bg-teal px-5 py-3 text-xs font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                      >
                        <SiteIcon name="check" className="size-4" />
                        <span>Add New {currentSchema.label}</span>
                      </button>
                    )}
                  </div>

                  {/* EDIT OR CREATE FORM */}
                  {editingItem ? (
                    <form onSubmit={handleSaveResource} className="rounded-3xl border border-teal/20 bg-white p-6 sm:p-9 shadow-lg space-y-7 animate-fade-in">
                      <div className="flex items-center justify-between pb-5 border-b border-line">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-accent-deep">
                            {editingItem._id ? 'Editing Existing Record' : 'Create New Record'}
                          </p>
                          <h3 className="text-xl font-bold text-ink mt-0.5">
                            {editingItem.title?.en || editingItem.name?.en || editingItem.question?.en || 'New Item'}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="rounded-xl border border-line px-4 py-2 text-xs font-bold text-ink-soft hover:bg-paper-alt cursor-pointer"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      {/* Bilingual Fields (English left, Bengali right) */}
                      <div className="space-y-6">
                        {currentSchema.bilingual.map((bf) => {
                          const valObj = editingItem[bf.key] || { en: bf.isList ? [] : '', bn: bf.isList ? [] : '' };
                          const enText = bf.isList ? (valObj.en || []).join('\n') : valObj.en || '';
                          const bnText = bf.isList ? (valObj.bn || []).join('\n') : valObj.bn || '';

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
                            <div key={bf.key} className="grid gap-5 md:grid-cols-2 pb-6 border-b border-line/50">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5 flex items-center justify-between">
                                  <span>{bf.label} (English)</span>
                                  <span className="text-[10px] bg-paper-alt px-2 py-0.5 rounded text-ink-soft font-mono">EN</span>
                                </label>
                                {bf.multiline || bf.isList ? (
                                  <textarea
                                    rows={bf.rows || 4}
                                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                                    value={enText}
                                    onChange={(e) => updateLang('en', e.target.value)}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                                    value={enText}
                                    onChange={(e) => updateLang('en', e.target.value)}
                                  />
                                )}
                              </div>

                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5 flex items-center justify-between">
                                  <span lang="bn">{bf.label} (বাংলা)</span>
                                  <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded font-bold font-mono">BN</span>
                                </label>
                                {bf.multiline || bf.isList ? (
                                  <textarea
                                    rows={bf.rows || 4}
                                    lang="bn"
                                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink font-bangla focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                                    value={bnText}
                                    onChange={(e) => updateLang('bn', e.target.value)}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    lang="bn"
                                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink font-bangla focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                                    value={bnText}
                                    onChange={(e) => updateLang('bn', e.target.value)}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Common Non-Bilingual Fields */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        {currentSchema.fields.map((f) => {
                          if (f.type === 'checkbox') {
                            return (
                              <div key={f.key} className="flex items-center gap-3 pt-3">
                                <input
                                  type="checkbox"
                                  id={f.key}
                                  className="size-5 accent-teal rounded cursor-pointer"
                                  checked={Boolean(editingItem[f.key])}
                                  onChange={(e) => setEditingItem({ ...editingItem, [f.key]: e.target.checked })}
                                />
                                <label htmlFor={f.key} className="text-sm font-bold text-ink cursor-pointer">
                                  {f.label}
                                </label>
                              </div>
                            );
                          }

                          if (f.type === 'textarea') {
                            return (
                              <div key={f.key} className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                                  {f.label}
                                </label>
                                <textarea
                                  rows={2}
                                  className="w-full rounded-xl border border-line bg-paper-alt/40 px-4 py-2.5 text-sm text-ink"
                                  value={editingItem[f.key] || ''}
                                  onChange={(e) => setEditingItem({ ...editingItem, [f.key]: e.target.value })}
                                />
                              </div>
                            );
                          }

                          return (
                            <div key={f.key}>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                                {f.label}
                              </label>
                              <input
                                type={f.type}
                                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink"
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
                              {f.key === 'file_path' && editingItem.file_path && (
                                <div className="mt-2 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPdfPreviewUrl(editingItem.file_path);
                                      setPdfPreviewTitle(editingItem.title?.en || 'Handout PDF');
                                    }}
                                    className="rounded-lg bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <SiteIcon name="search" className="size-3" />
                                    <span>Test & Preview Current PDF</span>
                                  </button>
                                  <a
                                    href={editingItem.file_path}
                                    download
                                    className="rounded-lg bg-paper-alt px-2.5 py-1 text-xs font-bold text-ink hover:bg-teal hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <SiteIcon name="download" className="size-3" />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-line">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="rounded-xl bg-teal px-6 py-3.5 text-sm font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-md inline-flex items-center gap-2 disabled:opacity-70"
                        >
                          {isSaving ? (
                            <>
                              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Saving Record...</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="rounded-xl border border-line px-5 py-3.5 text-sm font-semibold text-ink-soft hover:bg-paper-alt cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* LIST ITEMS VIEW (Cards & Data Table) */
                    <div className="space-y-6">
                      {/* Search Bar + View Mode Toggle + Counter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${currentSchema.label.toLowerCase()}...`}
                            className="w-full rounded-2xl border border-line bg-white pl-11 pr-4 py-2.5 text-sm text-ink shadow-2xs focus:border-teal outline-none transition-all"
                          />
                          <div className="absolute left-4 top-3 text-ink-soft/60">
                            <SiteIcon name="search" className="size-4" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          <span className="text-xs font-semibold text-ink-soft">
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                          </span>

                          {/* Toggle: Cards vs Table */}
                          <div className="flex items-center rounded-2xl border border-line bg-white p-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setViewMode('grid')}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'grid'
                                  ? 'bg-teal text-white shadow-xs'
                                  : 'text-ink-soft hover:bg-paper-alt hover:text-ink'
                              }`}
                              title="Grid Cards View"
                            >
                              <SiteIcon name="spark" className="size-3.5" />
                              <span>Cards</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewMode('table')}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'table'
                                  ? 'bg-teal text-white shadow-xs'
                                  : 'text-ink-soft hover:bg-paper-alt hover:text-ink'
                              }`}
                              title="Data Table View"
                            >
                              <SiteIcon name="menu" className="size-3.5" />
                              <span>Table</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Empty State */}
                      {filteredItems.length === 0 ? (
                        <div className="rounded-3xl border border-line/80 bg-white p-12 text-center text-ink-soft">
                          <div className="flex size-12 items-center justify-center rounded-2xl bg-paper-alt mx-auto text-ink-soft/50 mb-3">
                            <SiteIcon name="search" className="size-6" />
                          </div>
                          <p className="font-bold text-ink text-base">No items found.</p>
                          <p className="text-xs text-ink-soft mt-1">Try adjusting your search query or add a new record.</p>
                        </div>
                      ) : viewMode === 'grid' ? (
                        /* VIEW 1: RESPONSIVE GRID CARDS */
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                          {filteredItems.map((item, idx) => {
                            const titleObj = item.title || item.name || item.question || {};
                            const enTitle = titleObj.en || item.slug || item._id;
                            const bnTitle = titleObj.bn || '';
                            const note = item.review_note || item.verify_note;
                            const publicUrl =
                              activeSection === 'specialities'
                                ? `/en/specialities/${item.slug}`
                                : activeSection === 'special-services'
                                ? `/en/services/${item.slug}`
                                : activeSection === 'posts'
                                ? `/en/patient-education/${item.slug}`
                                : activeSection === 'chambers'
                                ? `/en/chambers`
                                : activeSection === 'faqs'
                                ? `/en/contact`
                                : null;

                            return (
                              <div
                                key={item._id}
                                className="group rounded-3xl border border-line/80 bg-white p-6 shadow-[0_2px_16px_rgba(27,46,42,0.03)] hover:shadow-lg hover:border-teal/30 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  {/* Card Header: Icon + Badges */}
                                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-line/50">
                                    <div className="flex items-center gap-2">
                                      <div className="flex size-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
                                        <SiteIcon name={currentSchema.icon} className="size-4.5" />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-ink-soft/70">
                                        #{item.sort_order ?? idx + 1}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      {item.is_active === false && (
                                        <span className="rounded-full bg-paper-alt px-2.5 py-0.5 text-[10px] font-bold text-ink-soft">
                                          Hidden
                                        </span>
                                      )}
                                      {item.is_published === false ? (
                                        <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
                                          Draft
                                        </span>
                                      ) : (
                                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                                          Published
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Titles */}
                                  <div className="mt-4">
                                    <h3 className="text-lg font-black text-ink group-hover:text-teal transition-colors leading-tight">
                                      {enTitle}
                                    </h3>
                                    {bnTitle && (
                                      <p className="text-base font-semibold text-teal font-bangla mt-1" lang="bn">
                                        {bnTitle}
                                      </p>
                                    )}
                                  </div>

                                  {/* Slug Badge */}
                                  {item.slug && (
                                    <div className="mt-3">
                                      <span className="inline-block font-mono text-xs font-medium text-teal bg-paper-alt px-2.5 py-1 rounded-lg">
                                        /{item.slug}
                                      </span>
                                    </div>
                                  )}

                                  {/* Chamber specific details */}
                                  {item.phone_primary && (
                                    <p className="mt-3 text-xs text-ink font-mono font-bold flex items-center gap-1.5">
                                      <SiteIcon name="phone" className="size-3.5 text-teal" />
                                      <span>{item.phone_primary}</span>
                                    </p>
                                  )}
                                  {item.hours_text?.en && (
                                    <p className="mt-1 text-xs text-ink-soft line-clamp-1">
                                      🕒 {item.hours_text.en}
                                    </p>
                                  )}

                                  {/* Summary Snippet */}
                                  {item.summary?.en && (
                                    <p className="mt-3 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                                      {item.summary.en}
                                    </p>
                                  )}

                                  {/* Handout PDF Document Box with Preview, Download & Print */}
                                  {item.file_path && (
                                    <div className="mt-4 rounded-2xl border border-red-200/90 bg-red-50/60 p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xs shadow-xs">
                                          PDF
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-ink truncate font-mono">
                                            {item.file_path.split('/').pop()}
                                          </p>
                                          <p className="text-[11px] text-ink-soft truncate font-mono">{item.file_path}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPdfPreviewUrl(item.file_path);
                                            setPdfPreviewTitle(enTitle);
                                          }}
                                          className="rounded-xl bg-white border border-line px-2.5 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer shadow-2xs"
                                          title="Preview PDF Viewer"
                                        >
                                          Preview
                                        </button>

                                        <a
                                          href={item.file_path}
                                          download
                                          className="rounded-xl bg-white border border-line p-1.5 text-ink-soft hover:text-teal hover:border-teal transition-all shadow-2xs cursor-pointer"
                                          title="Download PDF File"
                                        >
                                          <SiteIcon name="download" className="size-3.5" />
                                        </a>

                                        <a
                                          href={item.file_path}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="rounded-xl bg-white border border-line p-1.5 text-ink-soft hover:text-teal hover:border-teal transition-all shadow-2xs cursor-pointer"
                                          title="Open in Tab to Print"
                                        >
                                          <SiteIcon name="arrow-up-right" className="size-3.5" />
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                  {/* Linked Article Slug for Handouts */}
                                  {item.post_slug && (
                                    <div className="mt-3 text-xs text-ink-soft flex items-center gap-1.5">
                                      <span className="font-semibold text-ink">Linked Article:</span>
                                      <Link
                                        href={`/en/patient-education/${item.post_slug}`}
                                        target="_blank"
                                        className="font-mono text-teal font-semibold hover:underline inline-flex items-center gap-1"
                                      >
                                        <span>/{item.post_slug}</span>
                                        <SiteIcon name="arrow-up-right" className="size-3" />
                                      </Link>
                                    </div>
                                  )}

                                  {/* Internal Review Note */}
                                  {note && (
                                    <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs font-semibold text-amber-800 flex items-start gap-2">
                                      <SiteIcon name="alert" className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                                      <span className="line-clamp-2">{note}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Card Footer: Actions */}
                                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingItem(item)}
                                      className="rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                                    >
                                      <span>Edit (EN / বাংলা)</span>
                                    </button>

                                    {publicUrl && (
                                      <Link
                                        href={publicUrl}
                                        target="_blank"
                                        className="rounded-xl border border-line bg-paper-alt/60 p-2 text-ink-soft hover:text-teal hover:border-teal transition-all cursor-pointer"
                                        title="View Public Page"
                                      >
                                        <SiteIcon name="arrow-up-right" className="size-3.5" />
                                      </Link>
                                    )}
                                  </div>

                                  {activeSection !== 'doctors' && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteResource(item._id)}
                                      className="rounded-xl p-2 text-ink-soft/70 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                      title="Delete Record"
                                    >
                                      <SiteIcon name="close" className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* VIEW 2: DATA TABLE */
                        <div className="rounded-3xl border border-line/80 bg-white overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                              <thead>
                                <tr className="border-b border-line bg-paper-alt/50 text-xs font-bold uppercase tracking-wider text-ink-soft/75">
                                  <th className="py-4 px-6 w-16">#</th>
                                  <th className="py-4 px-6">Title (English + বাংলা)</th>
                                  <th className="py-4 px-6">Route / Slug</th>
                                  <th className="py-4 px-6">Status</th>
                                  <th className="py-4 px-6">Admin Note</th>
                                  <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-line/50">
                                {filteredItems.map((item, idx) => {
                                  const titleObj = item.title || item.name || item.question || {};
                                  const enTitle = titleObj.en || item.slug || item._id;
                                  const bnTitle = titleObj.bn || '';
                                  const note = item.review_note || item.verify_note;
                                  const publicUrl =
                                    activeSection === 'specialities'
                                      ? `/en/specialities/${item.slug}`
                                      : activeSection === 'special-services'
                                      ? `/en/services/${item.slug}`
                                      : activeSection === 'posts'
                                      ? `/en/patient-education/${item.slug}`
                                      : activeSection === 'chambers'
                                      ? `/en/chambers`
                                      : activeSection === 'faqs'
                                      ? `/en/contact`
                                      : null;

                                  return (
                                    <tr key={item._id} className="hover:bg-paper-alt/30 transition-colors">
                                      <td className="py-4 px-6 font-mono font-bold text-ink-soft/70">
                                        #{item.sort_order ?? idx + 1}
                                      </td>
                                      <td className="py-4 px-6">
                                        <p className="font-bold text-ink text-base">{enTitle}</p>
                                        {bnTitle && (
                                          <p className="text-sm font-semibold text-teal font-bangla mt-0.5" lang="bn">
                                            {bnTitle}
                                          </p>
                                        )}
                                      </td>
                                      <td className="py-4 px-6">
                                        {item.file_path ? (
                                          <div className="flex flex-col gap-1">
                                            <span className="font-mono text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1.5 w-fit">
                                              <span className="font-black text-[9px] bg-red-600 text-white px-1 py-0.5 rounded">PDF</span>
                                              <span>{item.file_path.split('/').pop()}</span>
                                            </span>
                                            {item.post_slug && (
                                              <span className="text-[11px] text-ink-soft">
                                                Linked: /{item.post_slug}
                                              </span>
                                            )}
                                          </div>
                                        ) : item.slug ? (
                                          <span className="font-mono text-xs text-teal bg-paper-alt px-2.5 py-1 rounded-lg">
                                            /{item.slug}
                                          </span>
                                        ) : (
                                          <span className="text-xs text-ink-soft">—</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6">
                                        {item.is_published === false ? (
                                          <span className="inline-flex rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 text-xs font-bold">
                                            Draft
                                          </span>
                                        ) : (
                                          <span className="inline-flex rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-xs font-bold">
                                            Published
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-xs text-ink-soft max-w-xs">
                                        {note ? (
                                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                            <SiteIcon name="alert" className="size-3 shrink-0 text-amber-600" />
                                            <span className="truncate">{note}</span>
                                          </span>
                                        ) : (
                                          '—'
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-right">
                                        <div className="inline-flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => setEditingItem(item)}
                                            className="rounded-xl bg-teal px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs"
                                          >
                                            Edit
                                          </button>
                                          {item.file_path && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setPdfPreviewUrl(item.file_path);
                                                  setPdfPreviewTitle(enTitle);
                                                }}
                                                className="rounded-xl border border-line p-1.5 text-teal hover:bg-teal hover:text-white transition-all cursor-pointer shadow-2xs"
                                                title="Preview PDF Document"
                                              >
                                                <SiteIcon name="search" className="size-3.5" />
                                              </button>
                                              <a
                                                href={item.file_path}
                                                download
                                                className="rounded-xl border border-line p-1.5 text-ink-soft hover:text-teal hover:border-teal transition-all shadow-2xs cursor-pointer"
                                                title="Download PDF File"
                                              >
                                                <SiteIcon name="download" className="size-3.5" />
                                              </a>
                                            </>
                                          )}
                                          {publicUrl && (
                                            <Link
                                              href={publicUrl}
                                              target="_blank"
                                              className="rounded-xl border border-line p-1.5 text-ink-soft hover:text-teal transition-all cursor-pointer"
                                              title="View Public Page"
                                            >
                                              <SiteIcon name="arrow-up-right" className="size-3.5" />
                                            </Link>
                                          )}
                                          {activeSection !== 'doctors' && (
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteResource(item._id)}
                                              className="rounded-xl border border-line px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                                            >
                                              Delete
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

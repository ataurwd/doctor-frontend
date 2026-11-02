'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoMark } from '@/components/Logo';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#133430] via-[#1b2e2a] to-[#0f2421] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <LogoMark className="size-12" theme="light" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-deep">Management Portal</p>
            <h1 className="text-2xl font-black text-ink">Dr. Sajib Admin</h1>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-ink-soft leading-relaxed">
          Sign in to manage appointments, contact messages, chambers, patient education, and clinical content.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-start gap-2.5">
            <span className="size-1.5 rounded-full bg-red-600 mt-1 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password"
              className="w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-md hover:bg-teal-deep transition-all duration-200 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-paper-alt/80 border border-line/70 p-3 text-xs text-ink-soft">
          <p className="font-bold text-ink">Testing Credentials:</p>
          <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
            <span>admin@example.com</span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('admin123456');
              }}
              className="rounded-lg bg-teal/10 px-2 py-0.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
            >
              Fill Demo Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


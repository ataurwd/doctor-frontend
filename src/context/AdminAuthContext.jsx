'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  const fetchWithAuth = useCallback(
    async (endpoint, options = {}) => {
      const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const adminPath = clean.startsWith('/admin') ? clean : `/admin${clean}`;
      const url = `${API_BASE}${adminPath}`;
      const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('dr_sajib_admin_token') : '');

      const headers = {
        'Content-Type': 'application/json',
        'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(options.headers || {}),
      };

      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dr_sajib_admin_token');
        }
        setToken('');
        setUser(null);
        router.push('/admin/login');
        throw new Error('Session expired. Please log in again.');
      }
      return res;
    },
    [token, router]
  );

  const refreshStats = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // stats fallback
    }
  }, [fetchWithAuth]);

  // Check stored token and verify with /admin/me on mount
  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem('dr_sajib_admin_token');

    if (!savedToken) {
      setLoading(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      return;
    }

    setToken(savedToken);

    // Verify session
    fetch(`${API_BASE}/admin/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
        'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then((userData) => {
        setUser(userData.user || userData);
        setLoading(false);
        // Also fetch initial stats for sidebar badges
        fetch(`${API_BASE}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
          },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((st) => st && setStats(st))
          .catch(() => {});
      })
      .catch(() => {
        localStorage.removeItem('dr_sajib_admin_token');
        setToken('');
        setUser(null);
        setLoading(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      });
  }, [pathname, router]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-client': process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || data.message || 'Login failed' };
      }

      localStorage.setItem('dr_sajib_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast('Logged in successfully');
      router.push('/admin/dashboard');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('dr_sajib_admin_token');
    setToken('');
    setUser(null);
    setStats(null);
    showToast('Logged out');
    router.push('/admin/login');
  };

  const value = {
    mounted,
    token,
    user,
    loading,
    stats,
    toast,
    showToast,
    login,
    logout,
    fetchWithAuth,
    refreshStats,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}


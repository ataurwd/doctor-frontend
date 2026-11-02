import { cache } from 'react';
import fallbackData from '../data/fallbackData.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_SECRET = process.env.API_SECRET_KEY || 'sajib-api-shield-9f4a8b1c7e2d6305a4f78e1b52a1c0de';
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026';

// In-memory response cache with 60s TTL for blazing fast language switching and zero-latency navigations
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function getFallbackForEndpoint(endpoint) {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (clean === '/bootstrap') {
    return fallbackData;
  }
  if (clean === '/specialities') {
    return fallbackData.specialities || [];
  }
  if (clean.startsWith('/specialities/')) {
    const slug = clean.replace('/specialities/', '');
    const item = (fallbackData.specialities || []).find((s) => s.slug === slug);
    const others = (fallbackData.specialities || [])
      .filter((s) => s.slug !== slug)
      .slice(0, 3)
      .map((s) => ({ slug: s.slug, title: s.title, summary: s.summary }));
    return item ? { item, others } : null;
  }
  if (clean === '/services') {
    return fallbackData.specialServices || [];
  }
  if (clean.startsWith('/services/')) {
    const slug = clean.replace('/services/', '');
    const item = (fallbackData.specialServices || []).find((s) => s.slug === slug);
    const others = (fallbackData.specialServices || [])
      .filter((s) => s.slug !== slug)
      .slice(0, 3)
      .map((s) => ({ slug: s.slug, title: s.title, summary: s.summary }));
    return item ? { item, others } : null;
  }
  if (clean === '/chambers') {
    return fallbackData.chambers || [];
  }
  if (clean === '/patient-education') {
    return {
      posts: fallbackData.allPosts || fallbackData.latestPosts || [],
      categories: fallbackData.categories || [],
      handouts: [],
    };
  }
  if (clean.startsWith('/patient-education/')) {
    const slug = clean.replace('/patient-education/', '');
    const posts = fallbackData.allPosts || fallbackData.latestPosts || [];
    const item = posts.find((p) => p.slug === slug);
    const related = posts.filter((p) => p.slug !== slug).slice(0, 2);
    return item ? { item, related, categories: fallbackData.categories || [] } : null;
  }
  return null;
}

export async function fetchApi(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isGet = !options.method || options.method.toUpperCase() === 'GET';

  // Check in-memory cache for GET requests to achieve sub-millisecond response times
  if (isGet) {
    const cached = memoryCache.get(cleanEndpoint);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const url = `${API_BASE}${cleanEndpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
      ...options,
      headers: {
        'x-api-secret': API_SECRET,
        'x-app-client': CLIENT_TOKEN,
        'x-requested-with': 'XMLHttpRequest',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (isGet && data) {
        memoryCache.set(cleanEndpoint, { data, timestamp: Date.now() });
      }
      return data;
    }

    if (res.status === 404) {
      return getFallbackForEndpoint(cleanEndpoint);
    }
  } catch (err) {
    // If backend is unreachable (e.g. during Vercel SSR before backend deployment)
    // graceful fallback prevents 500 server crash and serves complete static medical data
    console.warn(`[API Info] Live API unreachable on ${cleanEndpoint} (${err.message}). Using local embedded store.`);
    return getFallbackForEndpoint(cleanEndpoint);
  }

  return getFallbackForEndpoint(cleanEndpoint);
}

export const getBootstrapData = cache(async () => {
  try {
    const data = await fetchApi('/bootstrap');
    if (data && data.doctor) return data;
  } catch (e) {
    console.warn('[API Warning] getBootstrapData fallback triggered:', e.message);
  }
  return fallbackData;
});

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return out;
}

export function renderMarkdown(md = '') {
  if (!md) return '';
  const blocks = String(md).trim().split(/\n\s*\n/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed === '---') {
      html.push('<hr />');
      continue;
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    const lines = trimmed.split('\n').map((l) => l.trim());
    if (lines.every((l) => l.startsWith('- '))) {
      const items = lines.map((l) => `<li>${formatInline(l.slice(2))}</li>`).join('');
      html.push(`<ul>${items}</ul>`);
      continue;
    }

    html.push(`<p>${formatInline(lines.join(' '))}</p>`);
  }

  return html.join('\n');
}


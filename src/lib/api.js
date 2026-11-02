const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_SECRET = process.env.API_SECRET_KEY || 'sajib-api-shield-9f4a8b1c7e2d6305a4f78e1b52a1c0de';
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_APP_CLIENT_TOKEN || 'sajib-client-handshake-2026';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      'x-api-secret': API_SECRET,
      'x-app-client': CLIENT_TOKEN,
      'x-requested-with': 'XMLHttpRequest',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API error ${res.status} on ${endpoint}`);
  }
  return res.json();
}

export async function getBootstrapData() {
  return fetchApi('/bootstrap');
}

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


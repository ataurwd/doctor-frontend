'use client';

import Link from 'next/link';
import SiteIcon from '@/components/SiteIcon';
import { LogoMark } from '@/components/Logo';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminHeader({ title = 'Dashboard', mobileOpen, setMobileOpen }) {
  const { user } = useAdminAuth();

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between bg-teal-deep text-white px-5 py-4 border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-9" theme="dark" />
          <div>
            <p className="font-extrabold text-sm leading-tight text-white">Dr. Sajib Admin</p>
            <p className="text-[11px] text-white/70 truncate max-w-[140px]">{user?.email || 'admin'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/en" className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white" target="_blank">
            Site &rarr;
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white"
          >
            <SiteIcon name={mobileOpen ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>

      {/* DESKTOP TOP BAR */}
      <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-line/60 bg-white/60 backdrop-blur-md">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft/70">
            MANAGEMENT &gt; <span className="text-teal">{title}</span>
          </p>
          <h1 className="text-xl font-black text-ink tracking-tight mt-0.5">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            MongoDB Atlas Connected
          </span>
          <Link
            href="/en"
            target="_blank"
            className="rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-paper-alt hover:text-teal transition-all shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>View Live Site</span>
            <SiteIcon name="arrow" className="size-3" />
          </Link>
        </div>
      </header>
    </>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteIcon from '@/components/SiteIcon';
import { LogoMark } from '@/components/Logo';
import { ADMIN_NAV_GROUPS } from './adminSchemas';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminSidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const pathname = usePathname();
  const { user, stats, logout } = useAdminAuth();

  return (
    <aside
      className={`w-full lg:w-72 bg-gradient-to-b from-[#133430] to-[#0d2522] text-white p-5 lg:p-6 flex flex-col shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ${
        mobileOpen ? 'block' : 'hidden lg:flex'
      }`}
    >
      {/* Top Header Card */}
      <div className="hidden lg:flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" theme="dark" />
          <div>
            <p className="font-extrabold text-base tracking-tight text-white">Dr. Sajib Admin</p>
            <p className="text-xs text-white/60 truncate max-w-[140px]">{user?.email || 'admin'}</p>
          </div>
        </div>
        <Link
          href="/en"
          className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-bold text-white/90 hover:bg-white/20 transition-colors"
          target="_blank"
        >
          Site &rarr;
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="mt-6 flex-1 space-y-6">
        {ADMIN_NAV_GROUPS.map((grp) => (
          <div key={grp.group}>
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-white/45 mb-2">
              {grp.group}
            </p>
            <div className="space-y-1">
              {grp.items.map((item) => {
                const isActive = pathname === item.route;
                const badgeCount = item.badgeKey && stats ? stats[item.badgeKey] : null;

                return (
                  <Link
                    key={item.id}
                    href={item.route}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SiteIcon
                        name={item.icon}
                        className={`size-4 ${isActive ? 'text-teal' : 'text-white/60'}`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {badgeCount !== null && badgeCount !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                          isActive
                            ? 'bg-accent text-white'
                            : 'bg-white/15 text-white/90'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer User & Logout */}
      <div className="pt-6 border-t border-white/10 mt-6">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 px-3 py-2.5 text-xs font-bold text-white/80 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SiteIcon name="close" className="size-4" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-white/40">Exit</span>
        </button>
      </div>
    </aside>
  );
}

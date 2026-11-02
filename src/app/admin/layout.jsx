'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

function AdminShell({ children }) {
  const pathname = usePathname();
  const { toast, loading } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login route, render full screen without sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink">
        {toast && (
          <div className="fixed right-6 top-6 z-50 rounded-2xl bg-teal px-5 py-3 text-xs font-bold text-white shadow-xl animate-fade-in">
            {toast}
          </div>
        )}
        {children}
      </div>
    );
  }

  // Derive title from pathname
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const currentSegment = segments[0] || 'dashboard';
  const titleMap = {
    dashboard: 'Overview Dashboard',
    appointments: 'Appointment Requests',
    messages: 'Contact Messages',
    doctors: 'Doctor Profile',
    chambers: 'Chambers',
    specialities: 'Specialities',
    services: 'Special Services',
    education: 'Patient Education Articles',
    categories: 'Topics / Categories',
    handouts: 'Printable Handouts',
    faqs: 'FAQs (Contact Page)',
    settings: 'Site Settings',
  };
  const title = titleMap[currentSegment] || 'Admin Management';

  return (
    <div className="min-h-screen bg-[#fcfbfa] flex flex-col lg:flex-row font-sans text-ink">
      {/* Toast popup */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl bg-teal px-5 py-3 text-xs font-bold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-300 animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={title}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-5 sm:p-8 lg:p-10 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}

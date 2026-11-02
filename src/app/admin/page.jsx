'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

function AdminRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      const tab = searchParams.get('tab');
      const tabRouteMap = {
        'dashboard': '/admin/dashboard',
        'appointment-requests': '/admin/appointments',
        'appointments': '/admin/appointments',
        'contact-messages': '/admin/messages',
        'messages': '/admin/messages',
        'doctors': '/admin/doctors',
        'chambers': '/admin/chambers',
        'specialities': '/admin/specialities',
        'special-services': '/admin/services',
        'services': '/admin/services',
        'posts': '/admin/education',
        'education': '/admin/education',
        'categories': '/admin/categories',
        'handouts': '/admin/handouts',
        'faqs': '/admin/faqs',
        'settings': '/admin/settings',
      };

      const target = (tab && tabRouteMap[tab]) || '/admin/dashboard';
      router.replace(target);
    }
  }, [token, loading, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="size-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AdminIndexPage() {
  return (
    <Suspense fallback={null}>
      <AdminRedirect />
    </Suspense>
  );
}

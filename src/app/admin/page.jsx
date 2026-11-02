'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminIndexPage() {
  const router = useRouter();
  const { token, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [token, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="size-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

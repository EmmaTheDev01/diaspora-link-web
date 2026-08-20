'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, activeRole } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    const currentRole = user.role || activeRole || 'buyer';

    switch (currentRole) {
      case 'admin':
        router.push('/admin');
        break;
      case 'vendor_rwanda':
        router.push('/vendor-rwanda');
        break;
      case 'vendor_canada':
        router.push('/vendor-canada');
        break;
      case 'logistics_courier':
        router.push('/logistics');
        break;
      default:
        router.push('/buyer');
        break;
    }
  }, [user, activeRole, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-black font-retro-heading">Redirecting To Your Dashboard...</h2>
        <p className="text-xs text-gray-500 font-mono">Recognising user role `{user?.role || activeRole || 'buyer'}`</p>
      </div>
    </div>
  );
}

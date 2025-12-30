'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 관리자 루트 페이지
 * /admin으로 접속 시 대시보드로 자동 리다이렉트
 */
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ADMIN_ROUTES.DASHBOARD);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p>관리자 페이지로 이동 중...</p>
      </div>
    </div>
  );
}

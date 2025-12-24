'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/admin/auth/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 관리자 로그인 페이지
 * Presentation Layer - Page
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push(ADMIN_ROUTES.DASHBOARD);
    }
  }, [user, loading, router]);

  // 로딩 중이거나 이미 로그인된 경우 빈 화면
  if (loading || user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-black to-black" />

      {/* 로그인 폼 */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}

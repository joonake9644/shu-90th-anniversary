'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 인증 보호 훅
 * Application Layer - 페이지 접근 권한 체크
 */
export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!loading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}

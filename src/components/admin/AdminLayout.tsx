'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 관리자 페이지 공통 레이아웃
 * 인증 체크 및 로딩 처리를 한 곳에서 관리
 */
export function AdminLayoutWrapper({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  // 로그인하지 않은 경우 (리다이렉션 진행 중)
  if (!user) {
    return null;
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}

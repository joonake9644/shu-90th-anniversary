'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 미디어 라이브러리 페이지
 */
export default function MediaLibraryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  // 로딩 중이거나 로그인하지 않은 경우
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={ADMIN_ROUTES.DASHBOARD} className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-amber-500">미디어 라이브러리</h1>
              <p className="text-sm text-gray-400 mt-1">
                이미지, 비디오 등 미디어 파일을 관리합니다
              </p>
            </Link>
            <Link
              href={ADMIN_ROUTES.DASHBOARD}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              대시보드로
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">미디어 파일</h2>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors">
              파일 업로드
            </button>
          </div>

          {/* 미디어 그리드 (임시) */}
          <div className="text-gray-400 text-center py-12">
            <p>미디어 라이브러리 기능이 곧 추가됩니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

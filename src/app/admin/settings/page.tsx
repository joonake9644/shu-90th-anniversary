'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 설정 페이지
 */
export default function SettingsPage() {
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
              <h1 className="text-2xl font-bold text-amber-500">설정</h1>
              <p className="text-sm text-gray-400 mt-1">
                시스템 설정을 관리합니다
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
        <div className="space-y-6">
          {/* 사이트 정보 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">사이트 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  사이트 제목
                </label>
                <input
                  type="text"
                  defaultValue="삼육보건대학교 90주년 기념"
                  className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  사이트 설명
                </label>
                <textarea
                  defaultValue="삼육보건대학교 90주년 기념 홈페이지"
                  className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 관리자 정보 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">관리자 정보</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                이메일: <span className="text-white">{user.email}</span>
              </p>
              <p className="text-gray-400">
                역할: <span className="text-white">{user.role}</span>
              </p>
            </div>
          </div>

          {/* 임시 안내 */}
          <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-6">
            <p className="text-amber-500">
              추가 설정 기능이 곧 업데이트됩니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

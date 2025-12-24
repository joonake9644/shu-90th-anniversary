'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';

/**
 * 관리자 대시보드 페이지
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(ADMIN_ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">
                SHU 90주년 관리자
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                삼육보건대학교 90주년 기념 홈페이지 관리 시스템
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">로그인 계정</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 컨텐츠 관리 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-500 mb-4">
              컨텐츠 관리
            </h2>
            <div className="space-y-3">
              <Link
                href={ADMIN_ROUTES.NEWS_LIST}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                뉴스 관리
              </Link>
              <Link
                href={ADMIN_ROUTES.EVENTS_LIST}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                이벤트 관리
              </Link>
              <Link
                href={ADMIN_ROUTES.GUESTBOOK}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                방명록 관리
              </Link>
              <Link
                href="/admin/content/stories"
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                사연 관리
              </Link>
              <Link
                href="/admin/content/subscribers"
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                뉴스레터 구독자
              </Link>
              <Link
                href={ADMIN_ROUTES.TIMELINE}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                타임라인 관리
              </Link>
            </div>
          </div>

          {/* 미디어 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-500 mb-4">
              미디어
            </h2>
            <div className="space-y-3">
              <Link
                href={ADMIN_ROUTES.MEDIA}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                미디어 라이브러리
              </Link>
            </div>
          </div>

          {/* 설정 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-500 mb-4">
              시스템
            </h2>
            <div className="space-y-3">
              <Link
                href={ADMIN_ROUTES.SETTINGS}
                className="block px-4 py-3 bg-black hover:bg-gray-800 border border-white/20 rounded-lg transition-colors"
              >
                설정
              </Link>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 bg-amber-500/10 border border-amber-500/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-amber-500 mb-2">
            환영합니다!
          </h3>
          <p className="text-gray-300">
            SHU 90주년 기념 홈페이지 관리 시스템에 로그인하셨습니다.
            <br />
            위 메뉴를 통해 컨텐츠를 관리하실 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}

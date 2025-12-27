'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllPeriods,
  deletePeriod,
  updatePeriod,
  type Period,
} from '@/lib/firestore/admin/periods';
import { getHighlightsByPeriod } from '@/lib/firestore/admin/highlights';

export default function PeriodsManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [periods, setPeriods] = useState<Period[]>([]);
  const [highlightCounts, setHighlightCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadPeriods();
    }
  }, [user]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await getAllPeriods();
      setPeriods(data);

      // 각 Period의 Highlights 개수 조회
      const counts: Record<string, number> = {};
      await Promise.all(
        data.map(async (period) => {
          const highlights = await getHighlightsByPeriod(period.id);
          counts[period.id] = highlights.length;
        })
      );
      setHighlightCounts(counts);
    } catch (error) {
      console.error('Error loading periods:', error);
      setMessage({ type: 'error', text: 'Period 목록을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (periodId: string, currentEnabled: boolean) => {
    try {
      await updatePeriod(periodId, { enabled: !currentEnabled });
      setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
      loadPeriods();
    } catch (error) {
      console.error('Error toggling enabled:', error);
      setMessage({ type: 'error', text: '상태 변경에 실패했습니다.' });
    }
  };

  const handleDelete = async (periodId: string, title: string) => {
    if (!confirm(`"${title}" Period를 삭제하시겠습니까?\n연결된 모든 Highlights도 삭제됩니다.`)) {
      return;
    }

    try {
      await deletePeriod(periodId);
      setMessage({ type: 'success', text: 'Period가 삭제되었습니다.' });
      loadPeriods();
    } catch (error) {
      console.error('Error deleting period:', error);
      setMessage({ type: 'error', text: 'Period 삭제에 실패했습니다.' });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">Period 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                6개 시대 섹션과 Highlights를 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/content/periods/new"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
              >
                + 새 Period 추가
              </Link>
              <Link
                href={ADMIN_ROUTES.DASHBOARD}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                대시보드로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : periods.length === 0 ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">Period가 없습니다.</p>
            <Link
              href="/admin/content/periods/new"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              첫 Period 추가하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {periods.map((period) => (
              <div
                key={period.id}
                className="bg-gray-900 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        #{period.order}
                      </span>
                      <h3 className="text-xl font-bold text-white">{period.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${period.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {period.enabled ? '활성화' : '비활성화'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{period.rangeLabel}</p>
                    <p className="text-gray-300 text-sm whitespace-pre-line mb-4">
                      {period.subtitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        Highlights: <span className="text-white font-bold">{highlightCounts[period.id] || 0}</span>개
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">
                        기간: {period.yearStart} - {period.yearEnd}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/content/periods/${period.id}/highlights`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Highlights 관리
                    </Link>
                    <Link
                      href={`/admin/content/periods/${period.id}/edit`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleToggleEnabled(period.id, period.enabled)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {period.enabled ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(period.id, period.title)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-900 border border-white/10 rounded-lg">
          <h3 className="text-sm font-bold text-white mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Period는 order 순으로 정렬되어 표시됩니다 (1-6)</li>
            <li>• "Highlights 관리" 버튼을 클릭하면 해당 Period의 Highlights를 관리할 수 있습니다</li>
            <li>• 비활성화된 Period는 메인 페이지에 표시되지 않습니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllActs,
  updateAct,
  type HistoryStoryAct,
} from '@/lib/firestore/admin/historyStory';

export default function HistoryStoryManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [acts, setActs] = useState<HistoryStoryAct[]>([]);
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
      loadActs();
    }
  }, [user]);

  const loadActs = async () => {
    try {
      setLoading(true);
      const data = await getAllActs();
      setActs(data);
    } catch (error) {
      console.error('Error loading acts:', error);
      setMessage({ type: 'error', text: 'Act 목록을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (actId: string, currentEnabled: boolean) => {
    try {
      const act = acts.find((a) => a.id === actId);
      if (!act) return;

      await updateAct(actId, { ...act, enabled: !currentEnabled });
      setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
      loadActs();
    } catch (error) {
      console.error('Error toggling enabled:', error);
      setMessage({ type: 'error', text: '상태 변경에 실패했습니다.' });
    }
  };

  const getActTitle = (act: HistoryStoryAct): string => {
    if (act.actType === 'prologue') return 'Prologue - 시작';
    if (act.actType === 'epilogue') return 'Epilogue - 약속';
    return act.actTitleKr || act.actTitleEn || `Act ${act.order}`;
  };

  const getActDescription = (act: HistoryStoryAct): string => {
    if (act.actType === 'prologue') {
      return `${act.prologueYear || ''} - ${act.prologueYearSubtitle || ''}`;
    }
    if (act.actType === 'epilogue') {
      return act.epilogueTitleKr || '';
    }
    return act.actDescription?.split('\n')[0] || '';
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
              <h1 className="text-2xl font-bold text-amber-500">HistoryStory 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                5개 Act (Prologue, Act 1-3, Epilogue)를 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
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
        ) : acts.length === 0 ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">Act가 없습니다.</p>
            <p className="text-sm text-gray-500">
              마이그레이션 스크립트를 실행하여 초기 데이터를 생성하세요.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {acts.map((act) => (
              <div
                key={act.id}
                className="bg-gray-900 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        #{act.order}
                      </span>
                      <h3 className="text-xl font-bold text-white">{getActTitle(act)}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${act.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {act.enabled ? '활성화' : '비활성화'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider">
                      {act.actType}
                    </p>
                    <p className="text-gray-300 text-sm whitespace-pre-line mb-4">
                      {getActDescription(act)}
                    </p>
                    {act.actTitleEn && (
                      <p className="text-gray-500 text-xs">
                        {act.actTitleEn}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/content/history-story/${act.id}/edit`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleToggleEnabled(act.id, act.enabled ?? true)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {act.enabled ? '비활성화' : '활성화'}
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
            <li>• Act는 order 순으로 정렬되어 표시됩니다 (0-4)</li>
            <li>• 각 Act는 고유한 필드 구조를 가지고 있습니다</li>
            <li>• 비활성화된 Act는 메인 페이지에 표시되지 않습니다</li>
            <li>• Prologue: 내러티브, 1936 텍스트</li>
            <li>• Act 1-3: 이미지, 타이틀, 본문, 하이라이트</li>
            <li>• Epilogue: 타이틀, 본문, 버튼</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

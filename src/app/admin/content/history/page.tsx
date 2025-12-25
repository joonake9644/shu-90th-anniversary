'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllHistoryChapters,
  deleteHistoryChapter,
  migrateInitialData,
  type HistoryChapterFirestore,
} from '@/lib/firestore/admin/history';
import { historyChapters } from '@/data/historyChapters';

/**
 * 히스토리 챕터 관리 페이지
 */
export default function HistoryManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [chapters, setChapters] = useState<HistoryChapterFirestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // 챕터 목록 불러오기
  useEffect(() => {
    if (user) {
      loadChapters();
    }
  }, [user]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const data = await getAllHistoryChapters();
      setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
      alert('챕터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 마이그레이션
  const handleMigrate = async () => {
    if (!confirm('하드코딩된 데이터를 Firestore에 마이그레이션하시겠습니까?')) {
      return;
    }

    try {
      setIsMigrating(true);
      await migrateInitialData(historyChapters);
      alert('마이그레이션이 완료되었습니다!');
      await loadChapters();
    } catch (error) {
      console.error('Error migrating data:', error);
      alert('마이그레이션에 실패했습니다.');
    } finally {
      setIsMigrating(false);
    }
  };

  // 챕터 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 챕터를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteHistoryChapter(id);
      alert('삭제되었습니다.');
      await loadChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 체크박스 토글
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.length === chapters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(chapters.map((c) => c.id!));
    }
  };

  // 로딩 중이거나 로그인하지 않은 경우
  if (authLoading || !user) {
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
            <div>
              <h1 className="text-2xl font-bold text-amber-500">별빛 아카이브 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                /history 페이지의 역사 챕터를 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                {isMigrating ? '마이그레이션 중...' : '초기 데이터 가져오기'}
              </button>
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

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">챕터 목록 ({chapters.length}개)</h2>
              {selectedIds.length > 0 && (
                <span className="text-sm text-amber-400">{selectedIds.length}개 선택됨</span>
              )}
            </div>
            <Link
              href="/admin/content/history/new"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              + 새 챕터 추가
            </Link>
          </div>

          {loading ? (
            <div className="text-gray-400 text-center py-12">
              <p>로딩 중...</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-gray-400 text-center py-12 space-y-4">
              <p>등록된 챕터가 없습니다.</p>
              <button
                onClick={handleMigrate}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                초기 데이터 가져오기
              </button>
            </div>
          ) : (
            <>
              {/* 전체 선택 */}
              <div className="mb-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedIds.length === chapters.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
                <span className="text-gray-400">전체 선택</span>
              </div>

              {/* 챕터 목록 */}
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-gray-800 border border-white/10 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* 체크박스 */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(chapter.id!)}
                        onChange={() => toggleSelection(chapter.id!)}
                        className="mt-1 w-4 h-4"
                      />

                      {/* 이미지 */}
                      <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={chapter.imageUrl}
                          alt={chapter.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* 정보 */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
                                Chapter {chapter.chapter}
                              </span>
                              <span className="text-gray-400 text-sm">{chapter.period}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{chapter.title}</h3>
                            <p className="text-sm text-gray-400 italic">{chapter.subtitle}</p>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/content/history/${chapter.id}/edit`}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                            >
                              수정
                            </Link>
                            <button
                              onClick={() => handleDelete(chapter.id!)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                          {chapter.story}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>하이라이트: {chapter.highlights.length}개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

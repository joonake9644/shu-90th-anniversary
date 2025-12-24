'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllEvents,
  deleteEvent,
  deleteMultipleEvents,
} from '@/lib/firestore/admin/events';
import type { Event } from '@/types/firestore';

/**
 * 이벤트 관리 페이지
 */
export default function EventsManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // 이벤트 데이터 로드
  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('이벤트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === events.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(events.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteEvent(id);
      await loadEvents();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteMultipleEvents(selectedIds);
      await loadEvents();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete events:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      ceremony: '기념식',
      exhibition: '전시회',
      conference: '학술대회',
      other: '기타',
    };
    return labels[category] || category;
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
            <Link
              href={ADMIN_ROUTES.DASHBOARD}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">이벤트 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                이벤트 콘텐츠를 관리합니다
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
            <div>
              <h2 className="text-xl font-bold text-white">
                이벤트 목록 ({events.length}개)
              </h2>
              {selectedIds.length > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  {selectedIds.length}개 선택됨
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadEvents}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                새로고침
              </button>
              <Link
                href={ADMIN_ROUTES.EVENTS_NEW}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
              >
                새 이벤트 작성
              </Link>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  선택 삭제
                </button>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 로딩 */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">로딩 중...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">이벤트가 없습니다.</p>
              <Link
                href={ADMIN_ROUTES.EVENTS_NEW}
                className="inline-block mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
              >
                첫 이벤트 작성하기
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === events.length &&
                          events.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      제목
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      카테고리
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      장소
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      일시
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {item.location}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={ADMIN_ROUTES.EVENTS_EDIT(item.id)}
                            className="text-amber-400 hover:text-amber-300 text-sm"
                          >
                            수정
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

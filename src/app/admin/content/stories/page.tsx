'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllStories,
  deleteStory,
  deleteMultipleStories,
  toggleStoryApproval,
} from '@/lib/firestore/admin/story';
import type { StorySubmission } from '@/types/firestore';

export default function StoriesManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stories, setStories] = useState<StorySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StorySubmission | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadStories();
    }
  }, [user]);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to load stories:', err);
      setError('사연을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === stories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stories.map((s) => s.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteStory(id);
      await loadStories();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete story:', err);
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
      await deleteMultipleStories(selectedIds);
      await loadStories();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete stories:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStoryApproval(id, !currentStatus);
      await loadStories();
    } catch (err) {
      console.error('Failed to toggle approval:', err);
      alert('승인 상태 변경에 실패했습니다.');
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '-';
    const date = typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp
      ? (timestamp as { toDate: () => Date }).toDate()
      : new Date(timestamp as string | number | Date);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  const approvedCount = stories.filter((s) => s.isApproved).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={ADMIN_ROUTES.DASHBOARD}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">사연 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                받은 사연을 관리합니다
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                사연 목록 ({stories.length}개)
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                승인: {approvedCount}개 | 미승인: {stories.length - approvedCount}개
                {selectedIds.length > 0 && ` | ${selectedIds.length}개 선택됨`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadStories}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                새로고침
              </button>
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

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <p className="text-gray-400">사연을 불러오는 중...</p>
              </div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">받은 사연이 없습니다.</p>
              <p className="text-sm text-gray-500 mb-6">
                Setup 페이지에서 더미 데이터를 생성하거나,<br />
                메인 홈페이지에서 사연을 제출해보세요.
              </p>
              <Link
                href="/admin/content/setup"
                className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
              >
                Setup 페이지로 이동
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
                          selectedIds.length === stories.length &&
                          stories.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작성자
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      제목
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      승인
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작성일
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr
                      key={story.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(story.id)}
                          onChange={() => handleSelectOne(story.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white">{story.name}</p>
                          {story.graduationYear && (
                            <p className="text-xs text-gray-500">
                              {story.graduationYear}년 졸업
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedStory(story)}
                          className="text-left hover:text-amber-500"
                        >
                          <p className="text-white font-medium line-clamp-1">
                            {story.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {story.content}
                          </p>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            handleToggleApproval(story.id, story.isApproved)
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            story.isApproved
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {story.isApproved ? '승인됨' : '미승인'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(story.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 상세보기 모달 */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedStory.title}
            </h2>
            <div className="text-sm text-gray-400 mb-6">
              <p>작성자: {selectedStory.name}</p>
              {selectedStory.email && <p>이메일: {selectedStory.email}</p>}
              {selectedStory.graduationYear && (
                <p>졸업연도: {selectedStory.graduationYear}년</p>
              )}
              <p>작성일: {formatDate(selectedStory.createdAt)}</p>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedStory.content}
            </div>
            <button
              onClick={() => setSelectedStory(null)}
              className="mt-6 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

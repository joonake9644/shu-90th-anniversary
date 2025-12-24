'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllGuestbookEntries,
  deleteGuestbookEntry,
  deleteMultipleGuestbookEntries,
  updateGuestbookApproval,
} from '@/lib/firestore/admin/guestbook';
import type { GuestbookEntry } from '@/types/firestore';

/**
 * 방명록 관리 페이지
 */
export default function GuestbookManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // 방명록 데이터 로드
  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllGuestbookEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load guestbook entries:', err);
      setError('방명록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === entries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(entries.map((entry) => entry.id));
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
      await deleteGuestbookEntry(id);
      await loadEntries();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete entry:', err);
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
      await deleteMultipleGuestbookEntries(selectedIds);
      await loadEntries();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete entries:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await updateGuestbookApproval(id, !currentStatus);
      await loadEntries();
    } catch (err) {
      console.error('Failed to update approval:', err);
      alert('승인 상태 변경에 실패했습니다.');
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
              <h1 className="text-2xl font-bold text-amber-500">방명록 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                방명록 메시지를 관리합니다
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
                방명록 목록 ({entries.length}개)
              </h2>
              {selectedIds.length > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  {selectedIds.length}개 선택됨
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadEntries}
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
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">방명록이 없습니다.</p>
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
                          selectedIds.length === entries.length &&
                          entries.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작성자
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      졸업연도
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      메시지
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      좋아요
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
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(entry.id)}
                          onChange={() => handleSelectOne(entry.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white">
                            {entry.isAnonymous ? '익명' : entry.name}
                          </p>
                          {entry.major && (
                            <p className="text-xs text-gray-500">
                              {entry.major}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {entry.graduationYear}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-300 line-clamp-2 max-w-md">
                          {entry.message}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {entry.likes}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            handleToggleApproval(entry.id, entry.approved)
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            entry.approved
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {entry.approved ? '승인됨' : '미승인'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(entry.id)}
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
    </div>
  );
}

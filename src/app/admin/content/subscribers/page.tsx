'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllSubscribers,
  deleteSubscriber,
  deleteMultipleSubscribers,
  toggleSubscriberStatus,
} from '@/lib/firestore/admin/newsletter';
import type { NewsletterSubscriber } from '@/types/firestore';

/**
 * 뉴스레터 구독자 관리 페이지
 */
export default function SubscribersManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadSubscribers();
    }
  }, [user]);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error('Failed to load subscribers:', err);
      setError('구독자를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === subscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscribers.map((sub) => sub.id));
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
      await deleteSubscriber(id);
      await loadSubscribers();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
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
      await deleteMultipleSubscribers(selectedIds);
      await loadSubscribers();
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to delete subscribers:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleSubscriberStatus(id, !currentStatus);
      await loadSubscribers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('상태 변경에 실패했습니다.');
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

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={ADMIN_ROUTES.DASHBOARD}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">뉴스레터 구독자</h1>
              <p className="text-sm text-gray-400 mt-1">
                뉴스레터 구독자를 관리합니다
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
                구독자 목록 ({subscribers.length}명)
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                활성: {activeCount}명 | 비활성: {subscribers.length - activeCount}명
                {selectedIds.length > 0 && ` | ${selectedIds.length}개 선택됨`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadSubscribers}
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
              <p className="text-gray-400">로딩 중...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">구독자가 없습니다.</p>
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
                          selectedIds.length === subscribers.length &&
                          subscribers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      이메일
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      상태
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      구독일
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(subscriber.id)}
                          onChange={() => handleSelectOne(subscriber.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4 text-white">{subscriber.email}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            handleToggleStatus(subscriber.id, subscriber.isActive)
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            subscriber.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {subscriber.isActive ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(subscriber.id)}
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

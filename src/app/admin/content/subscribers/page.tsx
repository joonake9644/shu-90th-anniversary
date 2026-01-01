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
import { Download, Copy, Mail, Filter } from 'lucide-react';

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
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  // 필터링된 구독자 목록
  const filteredSubscribers = subscribers.filter((sub) => {
    if (filterStatus === 'active') return sub.isActive;
    if (filterStatus === 'inactive') return !sub.isActive;
    return true;
  });

  // CSV 다운로드 함수
  const downloadCSV = (subscribersToExport: NewsletterSubscriber[]) => {
    if (subscribersToExport.length === 0) {
      alert('내보낼 구독자가 없습니다.');
      return;
    }

    // CSV 헤더
    const headers = ['이메일', '상태', '구독일'];

    // CSV 데이터
    const rows = subscribersToExport.map((sub) => [
      sub.email,
      sub.isActive ? '활성' : '비활성',
      formatDate(sub.subscribedAt),
    ]);

    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // BOM 추가 (Excel에서 한글 깨짐 방지)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 다운로드
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`${subscribersToExport.length}명의 구독자 정보를 CSV로 다운로드했습니다.`);
    setShowExportMenu(false);
  };

  // 전체 다운로드
  const handleDownloadAll = () => {
    downloadCSV(filteredSubscribers);
  };

  // 선택 다운로드
  const handleDownloadSelected = () => {
    const selected = subscribers.filter((sub) => selectedIds.includes(sub.id));
    downloadCSV(selected);
  };

  // 활성 구독자만 다운로드
  const handleDownloadActive = () => {
    const active = subscribers.filter((sub) => sub.isActive);
    downloadCSV(active);
  };

  // 클립보드 복사 함수
  const copyToClipboard = (subscribersToExport: NewsletterSubscriber[]) => {
    if (subscribersToExport.length === 0) {
      alert('복사할 구독자가 없습니다.');
      return;
    }

    const emails = subscribersToExport.map((sub) => sub.email).join(', ');
    navigator.clipboard.writeText(emails).then(
      () => {
        alert(`${subscribersToExport.length}개의 이메일 주소를 클립보드에 복사했습니다.`);
        setShowExportMenu(false);
      },
      (err) => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 복사에 실패했습니다.');
      }
    );
  };

  // 이메일 클라이언트 열기
  const openEmailClient = (subscribersToExport: NewsletterSubscriber[]) => {
    if (subscribersToExport.length === 0) {
      alert('이메일을 보낼 구독자가 없습니다.');
      return;
    }

    const emails = subscribersToExport.map((sub) => sub.email).join(',');

    // BCC 최대 길이 체크 (대부분의 이메일 클라이언트는 2000자 제한)
    if (emails.length > 2000) {
      if (!confirm('이메일 주소가 너무 많아 일부 이메일 클라이언트에서 문제가 발생할 수 있습니다. 계속하시겠습니까?')) {
        return;
      }
    }

    window.location.href = `mailto:?bcc=${encodeURIComponent(emails)}`;
    setShowExportMenu(false);
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
          {/* 상단: 통계 및 버튼 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                구독자 목록 ({filteredSubscribers.length}명)
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

          {/* 필터 및 내보내기 */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            {/* 필터 */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">필터:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  활성
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === 'inactive'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  비활성
                </button>
              </div>
            </div>

            {/* 내보내기 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                내보내기
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-10">
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-3 py-2">CSV 다운로드</p>
                    <button
                      onClick={handleDownloadAll}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"
                    >
                      <Download size={14} />
                      전체 구독자 ({filteredSubscribers.length}명)
                    </button>
                    <button
                      onClick={handleDownloadActive}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"
                    >
                      <Download size={14} />
                      활성 구독자만 ({activeCount}명)
                    </button>
                    {selectedIds.length > 0 && (
                      <button
                        onClick={handleDownloadSelected}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm text-amber-400"
                      >
                        <Download size={14} />
                        선택한 구독자 ({selectedIds.length}명)
                      </button>
                    )}

                    <div className="border-t border-white/10 my-2" />

                    <p className="text-xs text-gray-400 px-3 py-2">클립보드</p>
                    <button
                      onClick={() => copyToClipboard(filteredSubscribers)}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"
                    >
                      <Copy size={14} />
                      이메일 주소 복사 ({filteredSubscribers.length}개)
                    </button>
                    {selectedIds.length > 0 && (
                      <button
                        onClick={() =>
                          copyToClipboard(
                            subscribers.filter((sub) => selectedIds.includes(sub.id))
                          )
                        }
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm text-amber-400"
                      >
                        <Copy size={14} />
                        선택한 이메일 복사 ({selectedIds.length}개)
                      </button>
                    )}

                    <div className="border-t border-white/10 my-2" />

                    <p className="text-xs text-gray-400 px-3 py-2">이메일 발송</p>
                    <button
                      onClick={() => openEmailClient(filteredSubscribers)}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"
                    >
                      <Mail size={14} />
                      이메일 클라이언트 열기
                    </button>
                  </div>
                </div>
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
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {filterStatus === 'all'
                  ? '구독자가 없습니다.'
                  : `${filterStatus === 'active' ? '활성' : '비활성'} 구독자가 없습니다.`}
              </p>
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
                          selectedIds.length === filteredSubscribers.length &&
                          filteredSubscribers.length > 0
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
                  {filteredSubscribers.map((subscriber) => (
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

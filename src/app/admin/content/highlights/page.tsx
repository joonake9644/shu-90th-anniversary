'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  type Highlight,
} from '@/lib/firestore/admin/highlights';
import { getAllPeriods, type Period } from '@/lib/firestore/admin/periods';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function HighlightsManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [periods, setPeriods] = useState<Period[]>([]);
  const [highlights, setHighlights] = useState<(Highlight & { periodId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'> & { periodId: string }>({
    periodId: '',
    order: 1,
    title: '',
    year: '',
    thumb: '',
    description: '',
    enabled: true,
  });
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
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [periodsData, highlightsData] = await Promise.all([
        getAllPeriods(),
        getAllHighlights(),
      ]);
      setPeriods(periodsData);
      setHighlights(highlightsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: '데이터를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.periodId) {
      setMessage({ type: 'error', text: 'Period를 선택해주세요.' });
      return;
    }

    try {
      const highlightId = editingId || `h${Date.now()}`;
      const { periodId, ...highlightData } = formData;

      if (editingId && editingPeriodId) {
        await updateHighlight(editingPeriodId, highlightId, highlightData);
        setMessage({ type: 'success', text: 'Highlight가 수정되었습니다.' });
      } else {
        await createHighlight(periodId, highlightId, highlightData);
        setMessage({ type: 'success', text: 'Highlight가 추가되었습니다.' });
      }

      setShowForm(false);
      setEditingId(null);
      setEditingPeriodId(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving highlight:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    }
  };

  const handleEdit = (highlight: Highlight & { periodId: string }) => {
    setEditingId(highlight.id);
    setEditingPeriodId(highlight.periodId);
    setFormData({
      periodId: highlight.periodId,
      order: highlight.order,
      title: highlight.title,
      year: highlight.year,
      thumb: highlight.thumb,
      description: highlight.description,
      enabled: highlight.enabled,
    });
    setShowForm(true);
  };

  const handleDelete = async (periodId: string, highlightId: string, title: string) => {
    if (!confirm(`"${title}" Highlight를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteHighlight(periodId, highlightId);
      setMessage({ type: 'success', text: 'Highlight가 삭제되었습니다.' });
      loadData();
    } catch (error) {
      console.error('Error deleting highlight:', error);
      setMessage({ type: 'error', text: 'Highlight 삭제에 실패했습니다.' });
    }
  };

  const handleToggleEnabled = async (highlight: Highlight & { periodId: string }) => {
    try {
      await updateHighlight(highlight.periodId, highlight.id, { enabled: !highlight.enabled });
      setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
      loadData();
    } catch (error) {
      console.error('Error toggling enabled:', error);
      setMessage({ type: 'error', text: '상태 변경에 실패했습니다.' });
    }
  };

  const resetForm = () => {
    setFormData({
      periodId: periods.length > 0 ? periods[0].id : '',
      order: (highlights?.length || 0) + 1,
      title: '',
      year: '',
      thumb: '',
      description: '',
      enabled: true,
    });
  };

  const getPeriodTitle = (periodId: string) => {
    const period = periods.find(p => p.id === periodId);
    return period?.title || periodId;
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
              <h1 className="text-2xl font-bold text-amber-500">명장면 90 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                모든 Period의 Highlights를 통합 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <button
                  onClick={() => {
                    if (periods.length === 0) {
                      setMessage({ type: 'error', text: 'Period 데이터를 먼저 생성해주세요. Setup 페이지를 이용하세요.' });
                      return;
                    }
                    resetForm();
                    setEditingId(null);
                    setEditingPeriodId(null);
                    setShowForm(true);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500"
                >
                  {loading ? '로딩 중...' : '+ 새 Highlight 추가'}
                </button>
              )}
              <Link
                href="/admin/dashboard"
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

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-900 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Highlight 수정' : '새 Highlight 추가'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Period 선택
                </label>
                <select
                  value={formData.periodId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, periodId: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={!!editingId}
                >
                  <option value="">Period를 선택하세요</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">순서</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">연도</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="1936"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="경성요양병원 부속 간호원 양성소 설립"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">설명 (줄바꿈 가능)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                  placeholder="진리, 사랑, 봉사의 이념으로 첫 발을 내딛다."
                  required
                />
              </div>

              <ImageUpload
                value={formData.thumb}
                onChange={(url) => setFormData((prev) => ({ ...prev, thumb: url }))}
                label="썸네일 이미지"
                path="highlights"
                required
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="w-5 h-5 bg-gray-800 border-white/10 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-gray-300">활성화</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
                >
                  {editingId ? '수정하기' : '추가하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setEditingPeriodId(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              <p className="text-gray-400">데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : periods.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-12 text-center">
            <p className="text-red-400 mb-4">⚠️ Period 데이터가 없습니다.</p>
            <p className="text-gray-400 mb-6">Highlight를 추가하려면 먼저 Period를 생성해야 합니다.</p>
            <Link
              href="/admin/content/setup"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              Setup 페이지에서 Period 생성하기
            </Link>
          </div>
        ) : highlights.length === 0 ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">Highlight가 없습니다.</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              첫 Highlight 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((highlight) => (
              <div
                key={`${highlight.periodId}-${highlight.id}`}
                className="bg-gray-900 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex gap-4 mb-4">
                  <img
                    src={highlight.thumb}
                    alt={highlight.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">#{highlight.order}</span>
                      <span className="text-xs text-amber-500 font-bold">{highlight.year}</span>
                      <span
                        className={`ml-auto px-2 py-1 text-xs rounded ${highlight.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {highlight.enabled ? '활성' : '비활성'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{highlight.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{highlight.description}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 mb-3">
                  <p className="text-xs text-gray-500">
                    Period: <span className="text-amber-500">{getPeriodTitle(highlight.periodId)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(highlight)}
                    className="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleToggleEnabled(highlight)}
                    className="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                  >
                    {highlight.enabled ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => handleDelete(highlight.periodId, highlight.id, highlight.title)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

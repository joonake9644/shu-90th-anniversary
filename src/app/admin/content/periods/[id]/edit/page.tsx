'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getPeriod,
  updatePeriod,
  type Period,
} from '@/lib/firestore/admin/periods';

export default function EditPeriodPage() {
  const router = useRouter();
  const params = useParams();
  const periodId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<Omit<Period, 'id' | 'createdAt' | 'updatedAt'>>({
    order: 1,
    rangeLabel: '',
    yearStart: 1936,
    yearEnd: 1946,
    title: '',
    subtitle: '',
    heroMedia: '',
    enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      loadPeriod();
    }
  }, [user, periodId]);

  const loadPeriod = async () => {
    try {
      setLoading(true);
      const data = await getPeriod(periodId);
      if (data) {
        setFormData({
          order: data.order,
          rangeLabel: data.rangeLabel,
          yearStart: data.yearStart,
          yearEnd: data.yearEnd,
          title: data.title,
          subtitle: data.subtitle,
          heroMedia: data.heroMedia,
          enabled: data.enabled,
        });
      } else {
        setMessage({ type: 'error', text: 'Period를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('Error loading period:', error);
      setMessage({ type: 'error', text: 'Period를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage(null);

      await updatePeriod(periodId, formData);

      setMessage({ type: 'success', text: '저장되었습니다!' });
      setTimeout(() => {
        router.push('/admin/content/periods');
      }, 1000);
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
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
              <h1 className="text-2xl font-bold text-amber-500">Period 수정</h1>
              <p className="text-sm text-gray-400 mt-1">Period 정보를 수정합니다</p>
            </div>
            <Link
              href="/admin/content/periods"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">기본 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      순서 (1-6)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      기간 라벨
                    </label>
                    <input
                      type="text"
                      value={formData.rangeLabel}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, rangeLabel: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="1936 ~ 1946"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      시작 연도
                    </label>
                    <input
                      type="number"
                      value={formData.yearStart}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, yearStart: parseInt(e.target.value) }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      종료 연도
                    </label>
                    <input
                      type="number"
                      value={formData.yearEnd}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, yearEnd: parseInt(e.target.value) }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 타이틀 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">타이틀</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      메인 타이틀
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Beginning 태동기"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      부제목 (줄바꿈 가능)
                    </label>
                    <textarea
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={3}
                      placeholder="민족의 건강과 교육을 위한 첫 걸음&#10;First Step for Nation's Health"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 이미지 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">히어로 이미지</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroMedia}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, heroMedia: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                  {formData.heroMedia && (
                    <div className="mt-4">
                      <img
                        src={formData.heroMedia}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 활성화 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">활성화 설정</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
                    }
                    className="w-5 h-5 bg-gray-800 border-white/10 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-300">메인 페이지에 표시</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-bold rounded-lg transition-colors"
                >
                  {saving ? '저장 중...' : '저장하기'}
                </button>
                <Link
                  href="/admin/content/periods"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors text-center"
                >
                  취소
                </Link>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

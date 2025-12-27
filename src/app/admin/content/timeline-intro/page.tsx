'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getTimelineIntroContent,
  updateTimelineIntroContent,
  type TimelineIntroContent,
} from '@/lib/firestore/admin/timelineIntro';

export default function TimelineIntroManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<Omit<TimelineIntroContent, 'id' | 'createdAt' | 'updatedAt'>>({
    year1936Text: '',
    quoteEnglish: '',
    quoteKorean: '',
    attribution: '',
    titleLeft: '',
    titleRight: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadContent();
    }
  }, [user]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getTimelineIntroContent();
      if (data) {
        setFormData({
          year1936Text: data.year1936Text,
          quoteEnglish: data.quoteEnglish,
          quoteKorean: data.quoteKorean,
          attribution: data.attribution,
          titleLeft: data.titleLeft,
          titleRight: data.titleRight,
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setMessage({ type: 'error', text: '콘텐츠를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage(null);

      await updateTimelineIntroContent(formData);

      setMessage({ type: 'success', text: '저장되었습니다!' });
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">로딩 중...</div></div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">TimelineIntro 관리</h1>
              <p className="text-sm text-gray-400 mt-1">타임라인 인트로 섹션의 콘텐츠를 관리합니다</p>
            </div>
            <Link href={ADMIN_ROUTES.DASHBOARD} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              대시보드로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* 1936 텍스트 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">1936 텍스트</h2>
                <input
                  type="text"
                  value={formData.year1936Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, year1936Text: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="1936"
                />
              </div>

              {/* Dr. Rue 명언 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Dr. Rue 명언</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">영문 명언</label>
                    <textarea
                      value={formData.quoteEnglish}
                      onChange={(e) => setFormData(prev => ({ ...prev, quoteEnglish: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={4}
                      placeholder="I never treated anyone with neglect.&#10;Whether treating Dr. Syngman Rhee or a country woman,&#10;I always gave my utmost effort."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">한글 명언</label>
                    <textarea
                      value={formData.quoteKorean}
                      onChange={(e) => setFormData(prev => ({ ...prev, quoteKorean: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={4}
                      placeholder="나는 어느 누구도 소홀히 치료하지 않았습니다.&#10;이승만 박사를 치료할 때나 시골의 아낙네를 치료할 때나&#10;똑같이 나의 최선의 노력을 바쳤습니다."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Attribution</label>
                    <input
                      type="text"
                      value={formData.attribution}
                      onChange={(e) => setFormData(prev => ({ ...prev, attribution: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="George Henry Rue. M.D (고 류제한 박사 1899-1993)"
                    />
                  </div>
                </div>
              </div>

              {/* 타이틀 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">타이틀</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">왼쪽</label>
                    <input
                      type="text"
                      value={formData.titleLeft}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleLeft: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="History"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">오른쪽</label>
                    <input
                      type="text"
                      value={formData.titleRight}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleRight: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="90 Years"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-bold rounded-lg transition-colors"
                >
                  {saving ? '저장 중...' : '저장하기'}
                </button>
                <Link href="/" target="_blank" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center">
                  미리보기
                </Link>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

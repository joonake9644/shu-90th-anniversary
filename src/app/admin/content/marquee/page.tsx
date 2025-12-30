'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllMarqueeTexts,
  updateMarqueeText,
  type MarqueeText,
} from '@/lib/firestore/admin/marquee';

/**
 * Marquee 텍스트 관리 페이지
 */
export default function MarqueeManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [marquees, setMarquees] = useState<MarqueeText[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 로그인 확인
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // Marquee 텍스트 로드
  useEffect(() => {
    if (user) {
      loadMarquees();
    }
  }, [user]);

  const loadMarquees = async () => {
    try {
      setLoading(true);
      const data = await getAllMarqueeTexts();
      setMarquees(data);

      // 데이터 없을 때 안내
      if (data.length === 0) {
        setMessage({ type: 'error', text: 'Marquee 데이터가 없습니다. Setup 페이지에서 초기 데이터를 생성해주세요.' });
      }
    } catch (error) {
      console.error('Error loading marquees:', error);
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

      // 각 Marquee 저장
      for (const marquee of marquees) {
        const { id, ...data } = marquee;
        await updateMarqueeText(id, data);
      }

      setMessage({ type: 'success', text: '저장되었습니다! 메인 페이지에서 변경사항을 확인하세요.' });
    } catch (error) {
      console.error('Error saving marquees:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleMarqueeChange = (id: string, field: keyof MarqueeText, value: any) => {
    setMarquees(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // 로딩 중
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
              <h1 className="text-2xl font-bold text-amber-500">Marquee 텍스트 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                메인 페이지의 움직이는 텍스트를 관리합니다
              </p>
            </div>
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
        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* 메시지 */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {marquees.map((marquee, index) => (
                <div key={marquee.id} className="bg-gray-900 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Marquee {index + 1} {index === 0 ? '(HistoryStory 이후)' : '(Period 이후)'}
                    </h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marquee.enabled}
                        onChange={(e) => handleMarqueeChange(marquee.id, 'enabled', e.target.checked)}
                        className="w-4 h-4 rounded bg-gray-800 border-white/10 text-amber-500 focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-300">활성화</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 텍스트 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        텍스트 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={marquee.text}
                        onChange={(e) => handleMarqueeChange(marquee.id, 'text', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="History of 90 Years"
                        required
                      />
                    </div>

                    {/* 방향 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        방향
                      </label>
                      <select
                        value={marquee.direction}
                        onChange={(e) => handleMarqueeChange(marquee.id, 'direction', e.target.value as 'left' | 'right')}
                        className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="left">왼쪽으로 (←)</option>
                        <option value="right">오른쪽으로 (→)</option>
                      </select>
                    </div>

                    {/* 속도 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        속도: {marquee.speed}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={marquee.speed}
                        onChange={(e) => handleMarqueeChange(marquee.id, 'speed', Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>느림 (1)</span>
                        <span>빠름 (20)</span>
                      </div>
                    </div>

                    {/* 순서 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        표시 순서
                      </label>
                      <input
                        type="number"
                        value={marquee.position}
                        onChange={(e) => handleMarqueeChange(marquee.id, 'position', Number(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* 미리보기 */}
                  <div className="mt-6 p-4 bg-black rounded-lg border border-white/10">
                    <p className="text-xs text-gray-500 mb-2">미리보기:</p>
                    <div className="overflow-hidden">
                      <div className={`text-4xl font-black uppercase text-white whitespace-nowrap ${
                        marquee.direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
                      }`}>
                        {marquee.text}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 저장 버튼 */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-bold rounded-lg transition-colors"
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
              <Link
                href="/"
                target="_blank"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center"
              >
                미리보기
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getHeroContent,
  updateHeroContent,
  type HomepageHero,
} from '@/lib/firestore/admin/hero';

/**
 * HeroSection 콘텐츠 관리 페이지
 */
export default function HeroManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 폼 상태
  const [formData, setFormData] = useState<Omit<HomepageHero, 'id' | 'createdAt' | 'updatedAt'>>({
    backgroundImage: '',
    badgeText: '',
    mainNumber: '',
    mainSubtitle1: '',
    mainSubtitle2: '',
    universityName: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 로그인 확인
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  // Hero 콘텐츠 로드
  useEffect(() => {
    if (user) {
      loadHeroContent();
    }
  }, [user]);

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      const data = await getHeroContent();

      // data가 null이어도 로딩 완료 (Setup 페이지에서 생성 필요)
      if (data) {
        setFormData({
          backgroundImage: data.backgroundImage,
          badgeText: data.badgeText,
          mainNumber: data.mainNumber,
          mainSubtitle1: data.mainSubtitle1,
          mainSubtitle2: data.mainSubtitle2,
          universityName: data.universityName,
          description: data.description,
        });
      } else {
        setMessage({ type: 'error', text: 'Hero 데이터가 없습니다. Setup 페이지에서 초기 데이터를 생성해주세요.' });
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
      setMessage({ type: 'error', text: '콘텐츠를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.backgroundImage || !formData.badgeText || !formData.mainNumber) {
      setMessage({ type: 'error', text: '필수 항목을 모두 입력해주세요.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await updateHeroContent(formData);

      setMessage({ type: 'success', text: '저장되었습니다! 메인 페이지에서 변경사항을 확인하세요.' });
    } catch (error) {
      console.error('Error saving hero content:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <h1 className="text-2xl font-bold text-amber-500">HeroSection 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                메인 페이지 히어로 섹션의 콘텐츠를 관리합니다
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 왼쪽: 폼 */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-6">콘텐츠 편집</h2>

                  {/* 메시지 */}
                  {message && (
                    <div className={`mb-4 p-4 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {/* 배경 이미지 URL */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      배경 이미지 URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.backgroundImage}
                      onChange={(e) => handleChange('backgroundImage', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  {/* 뱃지 텍스트 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      뱃지 텍스트 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => handleChange('badgeText', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="THE 90TH ANNIVERSARY"
                      required
                    />
                  </div>

                  {/* 메인 숫자 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      메인 숫자 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mainNumber}
                      onChange={(e) => handleChange('mainNumber', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="90"
                      required
                    />
                  </div>

                  {/* 메인 서브타이틀 1 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      메인 서브타이틀 1
                    </label>
                    <input
                      type="text"
                      value={formData.mainSubtitle1}
                      onChange={(e) => handleChange('mainSubtitle1', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="YEARS"
                    />
                  </div>

                  {/* 메인 서브타이틀 2 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      메인 서브타이틀 2
                    </label>
                    <input
                      type="text"
                      value={formData.mainSubtitle2}
                      onChange={(e) => handleChange('mainSubtitle2', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Of History"
                    />
                  </div>

                  {/* 학교 이름 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      학교 이름
                    </label>
                    <input
                      type="text"
                      value={formData.universityName}
                      onChange={(e) => handleChange('universityName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Sahmyook Health University"
                    />
                  </div>

                  {/* 설명 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={3}
                      placeholder="삼육보건대학교 90주년,&#10;진심의 교육으로 세상을 치유해온 시간"
                    />
                  </div>

                  {/* 저장 버튼 */}
                  <div className="flex gap-3">
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
                </div>
              </div>

              {/* 오른쪽: 미리보기 */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-6">미리보기</h2>

                  {/* 배경 이미지 미리보기 */}
                  {formData.backgroundImage && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-2">배경 이미지</p>
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={formData.backgroundImage}
                          alt="Background Preview"
                          fill
                          className="object-cover grayscale opacity-60"
                        />
                      </div>
                    </div>
                  )}

                  {/* 텍스트 미리보기 */}
                  <div className="bg-black rounded-lg p-8 text-center">
                    {/* 뱃지 */}
                    {formData.badgeText && (
                      <div className="mb-6">
                        <span className="inline-block py-2 px-6 border border-white/30 rounded-full text-xs tracking-[0.3em]">
                          {formData.badgeText}
                        </span>
                      </div>
                    )}

                    {/* 메인 타이틀 */}
                    <div className="mb-4">
                      {formData.mainNumber && (
                        <span className="text-6xl font-bold tracking-tighter">
                          {formData.mainNumber}
                        </span>
                      )}
                      {formData.mainSubtitle1 && (
                        <span className="text-6xl font-bold tracking-tighter ml-2 italic font-light">
                          {formData.mainSubtitle1}
                        </span>
                      )}
                    </div>

                    {/* 서브타이틀 2 */}
                    {formData.mainSubtitle2 && (
                      <h2 className="text-2xl font-light tracking-widest uppercase mb-4 text-gray-300">
                        {formData.mainSubtitle2}
                      </h2>
                    )}

                    {/* 학교 이름 */}
                    {formData.universityName && (
                      <div className="text-sm font-medium tracking-[0.3em] uppercase mb-6 text-white/80">
                        {formData.universityName}
                      </div>
                    )}

                    {/* 설명 */}
                    {formData.description && (
                      <p className="text-sm text-gray-400 font-light leading-relaxed whitespace-pre-line">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

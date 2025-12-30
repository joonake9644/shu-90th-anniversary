'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getFooterContent,
  updateFooterContent,
  type HomepageFooter,
  type QuickLink,
} from '@/lib/firestore/admin/footer';

/**
 * Footer 콘텐츠 관리 페이지
 */
export default function FooterManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 폼 상태
  const [formData, setFormData] = useState<Omit<HomepageFooter, 'id' | 'createdAt' | 'updatedAt'>>({
    brandName: '',
    slogan: '',
    description: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
    },
    quickLinks: [
      { label: '', href: '' },
      { label: '', href: '' },
      { label: '', href: '' },
      { label: '', href: '' },
    ],
    contact: {
      address: '',
      phone: '',
      email: '',
    },
    copyrightText: '',
    privacyPolicyUrl: '',
    termsOfServiceUrl: '',
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

  // Footer 콘텐츠 로드
  useEffect(() => {
    if (user) {
      loadFooterContent();
    }
  }, [user]);

  const loadFooterContent = async () => {
    try {
      setLoading(true);
      const data = await getFooterContent();

      // data가 null이어도 로딩 완료
      if (data) {
        setFormData({
          brandName: data.brandName,
          slogan: data.slogan,
          description: data.description,
          socialLinks: data.socialLinks,
          quickLinks: data.quickLinks,
          contact: data.contact,
          copyrightText: data.copyrightText,
          privacyPolicyUrl: data.privacyPolicyUrl,
          termsOfServiceUrl: data.termsOfServiceUrl,
        });
      } else {
        setMessage({ type: 'error', text: 'Footer 데이터가 없습니다. Setup 페이지에서 초기 데이터를 생성해주세요.' });
      }
    } catch (error) {
      console.error('Error loading footer content:', error);
      setMessage({ type: 'error', text: '콘텐츠를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.brandName || !formData.slogan) {
      setMessage({ type: 'error', text: '필수 항목을 모두 입력해주세요.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await updateFooterContent(formData);

      setMessage({ type: 'success', text: '저장되었습니다! 메인 페이지 Footer에서 변경사항을 확인하세요.' });
    } catch (error) {
      console.error('Error saving footer content:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const newQuickLinks = [...formData.quickLinks];
    newQuickLinks[index] = { ...newQuickLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, quickLinks: newQuickLinks }));
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
              <h1 className="text-2xl font-bold text-amber-500">Footer 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                메인 페이지 Footer의 콘텐츠를 관리합니다
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
              {/* 브랜드 섹션 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">브랜드 정보</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      브랜드명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="SHU 90th"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      슬로건 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slogan}
                      onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Truth · Love · Service"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={3}
                      placeholder="Celebrating 90 years of excellence..."
                    />
                  </div>
                </div>
              </div>

              {/* 소셜 미디어 섹션 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">소셜 미디어</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Youtube URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://www.youtube.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* 빠른 링크 섹션 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">빠른 링크 (Quick Links)</h2>

                <div className="space-y-4">
                  {formData.quickLinks.map((link, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          링크 {index + 1} - 텍스트
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleQuickLinkChange(index, 'label', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder={`링크 ${index + 1} 텍스트`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          링크 {index + 1} - URL
                        </label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => handleQuickLinkChange(index, 'href', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="#"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 연락처 섹션 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">연락처</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      주소
                    </label>
                    <textarea
                      value={formData.contact.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, address: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={2}
                      placeholder="82 Mangu-ro, Dongdaemun-gu,&#10;Seoul, Republic of Korea"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      value={formData.contact.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="+82-2212-0082"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="admin@shu.ac.kr"
                    />
                  </div>
                </div>
              </div>

              {/* 법률 섹션 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">법률 & 저작권</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      저작권 텍스트
                    </label>
                    <input
                      type="text"
                      value={formData.copyrightText}
                      onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Sahmyook Health University. All rights reserved."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Privacy Policy URL
                    </label>
                    <input
                      type="text"
                      value={formData.privacyPolicyUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="#"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Terms of Service URL
                    </label>
                    <input
                      type="text"
                      value={formData.termsOfServiceUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="#"
                    />
                  </div>
                </div>
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
          </form>
        )}
      </main>
    </div>
  );
}

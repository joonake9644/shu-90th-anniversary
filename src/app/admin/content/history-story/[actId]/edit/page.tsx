'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getActById,
  updateAct,
  type HistoryStoryAct,
  type ActType,
} from '@/lib/firestore/admin/historyStory';

export default function EditActPage() {
  const router = useRouter();
  const params = useParams();
  const actId = params.actId as string;
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<Partial<HistoryStoryAct>>({
    actType: 'prologue',
    order: 0,
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
      loadAct();
    }
  }, [user, actId]);

  const loadAct = async () => {
    try {
      setLoading(true);
      const data = await getActById(actId);
      if (data) {
        setFormData(data);
      } else {
        setMessage({ type: 'error', text: 'Act를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('Error loading act:', error);
      setMessage({ type: 'error', text: 'Act를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage(null);

      const { id, createdAt, updatedAt, ...dataToSave } = formData as HistoryStoryAct;
      await updateAct(actId, dataToSave);

      setMessage({ type: 'success', text: '저장되었습니다!' });
      setTimeout(() => {
        router.push('/admin/content/history-story');
      }, 1000);
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getActTitle = (): string => {
    if (formData.actType === 'prologue') return 'Prologue - 시작';
    if (formData.actType === 'epilogue') return 'Epilogue - 약속';
    if (formData.actType === 'act1') return 'Act 1 - 고난';
    if (formData.actType === 'act2') return 'Act 2 - 진리의 숲';
    if (formData.actType === 'act3') return 'Act 3 - 사랑의 빛';
    return 'Act';
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
              <h1 className="text-2xl font-bold text-amber-500">{getActTitle()} 수정</h1>
              <p className="text-sm text-gray-400 mt-1">
                Act 콘텐츠를 수정합니다 ({formData.actType})
              </p>
            </div>
            <Link
              href="/admin/content/history-story"
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
              {/* === PROLOGUE 필드 === */}
              {formData.actType === 'prologue' && (
                <>
                  <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Prologue 내러티브</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          내러티브 1 (어둠)
                        </label>
                        <input
                          type="text"
                          value={formData.prologueNarrative1 || ''}
                          onChange={(e) => updateField('prologueNarrative1', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="In the deepest darkness..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          내러티브 2 (희망)
                        </label>
                        <input
                          type="text"
                          value={formData.prologueNarrative2 || ''}
                          onChange={(e) => updateField('prologueNarrative2', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="A light awakens"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-6">1936 텍스트</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          연도
                        </label>
                        <input
                          type="text"
                          value={formData.prologueYear || ''}
                          onChange={(e) => updateField('prologueYear', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="1936"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          부제목
                        </label>
                        <input
                          type="text"
                          value={formData.prologueYearSubtitle || ''}
                          onChange={(e) => updateField('prologueYearSubtitle', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="The Spark of Compassion"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* === ACT 1-3 공통 필드 === */}
              {['act1', 'act2', 'act3'].includes(formData.actType || '') && (
                <>
                  {/* 이미지 (Act 1만) */}
                  {formData.actType === 'act1' && (
                    <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-6">이미지</h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          이미지 URL
                        </label>
                        <input
                          type="url"
                          value={formData.actImageUrl || ''}
                          onChange={(e) => updateField('actImageUrl', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                        {formData.actImageUrl && (
                          <div className="mt-4">
                            <img
                              src={formData.actImageUrl}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg grayscale"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 타이틀 */}
                  <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-6">타이틀</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          영문 타이틀
                        </label>
                        <input
                          type="text"
                          value={formData.actTitleEn || ''}
                          onChange={(e) => updateField('actTitleEn', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="ACT 1: HARDSHIP"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          한글 타이틀 (줄바꿈 가능)
                        </label>
                        <textarea
                          value={formData.actTitleKr || ''}
                          onChange={(e) => updateField('actTitleKr', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          rows={2}
                          placeholder="고난, 그 깊은 뿌리"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 본문 (Act 1만) */}
                  {formData.actType === 'act1' && (
                    <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-6">본문</h2>
                      <textarea
                        value={formData.actDescription || ''}
                        onChange={(e) => updateField('actDescription', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        rows={4}
                        placeholder="전쟁과 폐허 속에서도..."
                      />
                    </div>
                  )}

                  {formData.actType === 'act2' && (
                    <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-6">본문 및 설정</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            본문 (줄바꿈 가능)
                          </label>
                          <textarea
                            value={formData.actDescription || ''}
                            onChange={(e) => updateField('actDescription', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                            rows={3}
                            placeholder="한 그루의 나무가 숲이 되기까지..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            배경색 (Hex)
                          </label>
                          <input
                            type="text"
                            value={formData.act2BackgroundColor || ''}
                            onChange={(e) => updateField('act2BackgroundColor', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="#1a1815"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Act 1 전용 필드 */}
                  {formData.actType === 'act1' && (
                    <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Act 1 전용 설정</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            기간 라벨
                          </label>
                          <input
                            type="text"
                            value={formData.act1PeriodLabel || ''}
                            onChange={(e) => updateField('act1PeriodLabel', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="1936 - 1953 · The Era of Endurance"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            배경 텍스트 (장식용)
                          </label>
                          <input
                            type="text"
                            value={formData.act1BackgroundText || ''}
                            onChange={(e) => updateField('act1BackgroundText', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="ROOTS"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Act 3 전용 필드 */}
                  {formData.actType === 'act3' && (
                    <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Act 3 전용 설정</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            뱃지 텍스트
                          </label>
                          <input
                            type="text"
                            value={formData.act3BadgeText || ''}
                            onChange={(e) => updateField('act3BadgeText', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Global Impact"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            맵 라벨
                          </label>
                          <input
                            type="text"
                            value={formData.act3MapLabel || ''}
                            onChange={(e) => updateField('act3MapLabel', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Connecting The World"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === EPILOGUE 필드 === */}
              {formData.actType === 'epilogue' && (
                <>
                  <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Epilogue 콘텐츠</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          영문 부제목
                        </label>
                        <input
                          type="text"
                          value={formData.epilogueSubtitleEn || ''}
                          onChange={(e) => updateField('epilogueSubtitleEn', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Our Promise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          한글 타이틀
                        </label>
                        <input
                          type="text"
                          value={formData.epilogueTitleKr || ''}
                          onChange={(e) => updateField('epilogueTitleKr', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="100년을 향한 약속"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          본문 (줄바꿈 가능)
                        </label>
                        <textarea
                          value={formData.epilogueDescription || ''}
                          onChange={(e) => updateField('epilogueDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          rows={4}
                          placeholder="지난 90년의 역사가 그러했듯..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          버튼 텍스트
                        </label>
                        <input
                          type="text"
                          value={formData.epilogueButtonText || ''}
                          onChange={(e) => updateField('epilogueButtonText', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Join the Journey"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* === 활성화 설정 (공통) === */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">활성화 설정</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled ?? true}
                    onChange={(e) => updateField('enabled', e.target.checked)}
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
                  href="/admin/content/history-story"
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getVideoById,
  updateVideo,
  type Video,
} from '@/lib/firestore/admin/videos';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<Omit<Video, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    year: '',
    duration: '',
    thumbnail: '',
    videoUrl: '',
    category: '',
    period: '1936-1946',
    order: 1,
    featured: false,
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
    if (user && videoId !== 'new') {
      loadVideo();
    } else if (videoId === 'new') {
      setLoading(false);
    }
  }, [user, videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const data = await getVideoById(videoId);
      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          year: data.year,
          duration: data.duration,
          thumbnail: data.thumbnail,
          videoUrl: data.videoUrl,
          category: data.category,
          period: data.period,
          order: data.order,
          featured: data.featured,
          enabled: data.enabled,
        });
      } else {
        setMessage({ type: 'error', text: '비디오를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setMessage({ type: 'error', text: '비디오를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage(null);

      await updateVideo(videoId === 'new' ? `v${Date.now()}` : videoId, formData);

      setMessage({ type: 'success', text: '저장되었습니다!' });
      setTimeout(() => {
        router.push('/admin/content/videos');
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
              <h1 className="text-2xl font-bold text-amber-500">
                {videoId === 'new' ? '새 비디오 추가' : '비디오 수정'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">비디오 정보를 입력하세요</p>
            </div>
            <Link
              href="/admin/content/videos"
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      제목 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="개교 기념식 - 1936년의 감동"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={3}
                      placeholder="삼육보건대학교의 첫 걸음을 되돌아봅니다."
                    />
                  </div>
                </div>
              </div>

              {/* 영상 정보 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">영상 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      연도 *
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, year: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="1936"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      재생시간 *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, duration: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="5:32"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      카테고리 *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="기념식"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      기간 *
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, period: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="1936-1946">1936~1946</option>
                      <option value="1947-1956">1947~1956</option>
                      <option value="1957-1996">1957~1996</option>
                      <option value="1997-2016">1997~2016</option>
                      <option value="2017-2024">2017~2024</option>
                      <option value="2025-Beyond">2025~Beyond</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 미디어 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">미디어</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      썸네일 이미지 URL *
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    {formData.thumbnail && (
                      <div className="mt-4">
                        <img
                          src={formData.thumbnail}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      비디오 URL * (YouTube 또는 비디오 파일)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 설정 */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">설정</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      정렬 순서
                    </label>
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                      }
                      className="w-5 h-5 bg-gray-800 border-white/10 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-gray-300">추천 비디오로 설정</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                      className="w-5 h-5 bg-gray-800 border-white/10 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-gray-300">사용자 페이지에 표시</span>
                  </label>
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
                <Link
                  href="/admin/content/videos"
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getAllVideos,
  deleteVideo,
  updateVideo,
  type Video,
} from '@/lib/firestore/admin/videos';

export default function VideosManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
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
      loadVideos();
    }
  }, [user]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await getAllVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
      setMessage({ type: 'error', text: '비디오 목록을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (videoId: string, currentEnabled: boolean) => {
    try {
      const video = videos.find((v) => v.id === videoId);
      if (!video) return;

      await updateVideo(videoId, { ...video, enabled: !currentEnabled });
      setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
      loadVideos();
    } catch (error) {
      console.error('Error toggling enabled:', error);
      setMessage({ type: 'error', text: '상태 변경에 실패했습니다.' });
    }
  };

  const handleToggleFeatured = async (videoId: string, currentFeatured: boolean) => {
    try {
      const video = videos.find((v) => v.id === videoId);
      if (!video) return;

      await updateVideo(videoId, { ...video, featured: !currentFeatured });
      setMessage({ type: 'success', text: '추천 상태가 변경되었습니다.' });
      loadVideos();
    } catch (error) {
      console.error('Error toggling featured:', error);
      setMessage({ type: 'error', text: '추천 상태 변경에 실패했습니다.' });
    }
  };

  const handleDelete = async (videoId: string, title: string) => {
    if (!confirm(`"${title}" 비디오를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteVideo(videoId);
      setMessage({ type: 'success', text: '비디오가 삭제되었습니다.' });
      loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      setMessage({ type: 'error', text: '비디오 삭제에 실패했습니다.' });
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
              <h1 className="text-2xl font-bold text-amber-500">비디오 히스토리 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                90년 역사를 담은 영상 아카이브를 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/content/videos/new"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
              >
                + 새 비디오 추가
              </Link>
              <Link
                href={ADMIN_ROUTES.DASHBOARD}
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

        {loading ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-gray-900 border border-white/10 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">비디오가 없습니다.</p>
            <Link
              href="/admin/content/videos/new"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              첫 비디오 추가하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-900 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <div className="relative w-48 h-28 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">#{video.order}</span>
                      <h3 className="text-xl font-bold text-white">{video.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${video.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {video.enabled ? '활성화' : '비활성화'}
                      </span>
                      {video.featured && (
                        <span className="px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-400">
                          추천
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        연도: <span className="text-white font-bold">{video.year}</span>
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">
                        카테고리: <span className="text-white">{video.category}</span>
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">
                        기간: <span className="text-white">{video.period}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/content/videos/${video.id}/edit`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(video.id, video.featured)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {video.featured ? '추천 해제' : '추천 설정'}
                    </button>
                    <button
                      onClick={() => handleToggleEnabled(video.id, video.enabled)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {video.enabled ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleDelete(video.id, video.title)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-900 border border-white/10 rounded-lg">
          <h3 className="text-sm font-bold text-white mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• 비디오는 order 순으로 정렬되어 표시됩니다</li>
            <li>• 추천 비디오는 메인 페이지 상단에 표시됩니다</li>
            <li>• 비활성화된 비디오는 사용자 페이지에 표시되지 않습니다</li>
            <li>• YouTube URL 또는 비디오 파일 URL을 사용할 수 있습니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

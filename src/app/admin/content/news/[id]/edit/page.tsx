'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import { getNewsById, updateNews } from '@/lib/firestore/admin/news';

/**
 * 뉴스 수정 페이지
 */
export default function NewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnail: '',
    author: '',
    category: 'general' as 'anniversary' | 'achievement' | 'event' | 'general',
    publishedAt: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 뉴스 데이터 로드
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const news = await getNewsById(newsId);

        if (!news) {
          setError('뉴스를 찾을 수 없습니다.');
          return;
        }

        const publishedDate = typeof news.publishedAt === 'object' && news.publishedAt !== null && 'toDate' in news.publishedAt
          ? news.publishedAt.toDate()
          : new Date(news.publishedAt as string | number);

        setFormData({
          title: news.title,
          summary: news.summary,
          content: news.content,
          thumbnail: news.thumbnail || '',
          author: news.author,
          category: news.category,
          publishedAt: publishedDate.toISOString().split('T')[0],
        });
      } catch (err) {
        console.error('Failed to load news:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [newsId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!formData.summary.trim()) {
      setError('요약을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (!formData.author.trim()) {
      setError('작성자를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateNews(newsId, {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        thumbnail: formData.thumbnail,
        author: formData.author,
        category: formData.category,
        publishedAt: new Date(formData.publishedAt),
      });

      alert('뉴스가 수정되었습니다.');
      router.push(ADMIN_ROUTES.NEWS_LIST);
    } catch (err) {
      console.error('Failed to update news:', err);
      setError('뉴스 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href={ADMIN_ROUTES.NEWS_LIST}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors inline-block"
          >
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={ADMIN_ROUTES.NEWS_LIST}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">뉴스 수정</h1>
              <p className="text-sm text-gray-400 mt-1">
                뉴스를 수정합니다
              </p>
            </Link>
            <Link
              href={ADMIN_ROUTES.NEWS_LIST}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="뉴스 제목을 입력하세요"
            />
          </div>

          {/* 요약 */}
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              요약 *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="뉴스 요약을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="뉴스 내용을 입력하세요"
            />
          </div>

          {/* 썸네일 URL */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              썸네일 URL (선택)
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 작성자 */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              작성자 *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="작성자 이름"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              카테고리 *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="general">일반</option>
              <option value="anniversary">90주년</option>
              <option value="achievement">성과</option>
              <option value="event">이벤트</option>
            </select>
          </div>

          {/* 발행일 */}
          <div>
            <label
              htmlFor="publishedAt"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              발행일 *
            </label>
            <input
              type="date"
              id="publishedAt"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '수정 중...' : '뉴스 수정'}
            </button>
            <Link
              href={ADMIN_ROUTES.NEWS_LIST}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import { createNews } from '@/lib/firestore/admin/news';
import { ImageUpload } from '@/components/admin/ImageUpload';

/**
 * 뉴스 작성 페이지
 */
export default function NewsCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnail: '',
    author: '',
    category: 'general' as 'anniversary' | 'achievement' | 'event' | 'general',
    publishedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setLoading(true);
    setError(null);

    try {
      await createNews({
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        thumbnail: formData.thumbnail,
        author: formData.author,
        category: formData.category,
        publishedAt: new Date(formData.publishedAt),
      });

      alert('뉴스가 작성되었습니다.');
      router.push(ADMIN_ROUTES.NEWS_LIST);
    } catch (err) {
      console.error('Failed to create news:', err);
      setError('뉴스 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-amber-500">새 뉴스 작성</h1>
              <p className="text-sm text-gray-400 mt-1">
                새로운 뉴스를 작성합니다
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

          {/* 썸네일 이미지 */}
          <ImageUpload
            value={formData.thumbnail}
            onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
            label="썸네일 이미지"
            path="news"
          />

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
              disabled={loading}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '작성 중...' : '뉴스 작성'}
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

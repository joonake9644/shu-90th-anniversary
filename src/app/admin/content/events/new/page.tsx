'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import { createEvent } from '@/lib/firestore/admin/events';
import { ImageUpload } from '@/components/admin/ImageUpload';

/**
 * 이벤트 작성 페이지
 */
export default function EventCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    image: '',
    registrationLink: '',
    category: 'other' as 'ceremony' | 'exhibition' | 'conference' | 'other',
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
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
    if (!formData.description.trim()) {
      setError('설명을 입력해주세요.');
      return;
    }
    if (!formData.location.trim()) {
      setError('장소를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        image: formData.image,
        registrationLink: formData.registrationLink,
        category: formData.category,
        date: new Date(formData.date),
      });

      alert('이벤트가 작성되었습니다.');
      router.push(ADMIN_ROUTES.EVENTS_LIST);
    } catch (err) {
      console.error('Failed to create event:', err);
      setError('이벤트 작성에 실패했습니다.');
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
              href={ADMIN_ROUTES.EVENTS_LIST}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">새 이벤트 작성</h1>
              <p className="text-sm text-gray-400 mt-1">
                새로운 이벤트를 작성합니다
              </p>
            </Link>
            <Link
              href={ADMIN_ROUTES.EVENTS_LIST}
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
              placeholder="이벤트 제목을 입력하세요"
            />
          </div>

          {/* 설명 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              설명 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="이벤트 설명을 입력하세요"
            />
          </div>

          {/* 장소 */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              장소 *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="이벤트 장소를 입력하세요"
            />
          </div>

          {/* 일시 */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              일시 *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
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
              <option value="other">기타</option>
              <option value="ceremony">기념식</option>
              <option value="exhibition">전시회</option>
              <option value="conference">학술대회</option>
            </select>
          </div>

          {/* 이미지 업로드 */}
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
            label="이벤트 이미지"
            path="events"
          />

          {/* 등록 링크 */}
          <div>
            <label
              htmlFor="registrationLink"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              참가 신청 링크 (선택)
            </label>
            <input
              type="url"
              id="registrationLink"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="https://example.com/register"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '작성 중...' : '이벤트 작성'}
            </button>
            <Link
              href={ADMIN_ROUTES.EVENTS_LIST}
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

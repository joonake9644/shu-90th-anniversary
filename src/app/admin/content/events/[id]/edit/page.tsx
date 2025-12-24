'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import { getEventById, updateEvent } from '@/lib/firestore/admin/events';

/**
 * 이벤트 수정 페이지
 */
export default function EventEditPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    image: '',
    registrationLink: '',
    category: 'other' as 'ceremony' | 'exhibition' | 'conference' | 'other',
    date: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이벤트 데이터 로드
  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const event = await getEventById(eventId);

      if (!event) {
        setError('이벤트를 찾을 수 없습니다.');
        return;
      }

      const eventDate = event.date.toDate
        ? event.date.toDate()
        : new Date(event.date);

      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        image: event.image || '',
        registrationLink: event.registrationLink || '',
        category: event.category,
        date: eventDate.toISOString().slice(0, 16),
      });
    } catch (err) {
      console.error('Failed to load event:', err);
      setError('이벤트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    setError(null);

    try {
      await updateEvent(eventId, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        image: formData.image,
        registrationLink: formData.registrationLink,
        category: formData.category,
        date: new Date(formData.date),
      });

      alert('이벤트가 수정되었습니다.');
      router.push(ADMIN_ROUTES.EVENTS_LIST);
    } catch (err) {
      console.error('Failed to update event:', err);
      setError('이벤트 수정에 실패했습니다.');
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
            href={ADMIN_ROUTES.EVENTS_LIST}
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
              href={ADMIN_ROUTES.EVENTS_LIST}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold text-amber-500">이벤트 수정</h1>
              <p className="text-sm text-gray-400 mt-1">
                이벤트를 수정합니다
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

          {/* 이미지 URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              이미지 URL (선택)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

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
              disabled={submitting}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '수정 중...' : '이벤트 수정'}
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

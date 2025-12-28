'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHistoryChapter, updateHistoryChapter } from '@/lib/firestore/admin/history';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function EditHistoryChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    chapter: 1,
    title: '',
    period: '',
    subtitle: '',
    story: '',
    imageUrl: '',
    highlights: [{ year: '', title: '', description: '' }],
  });

  useEffect(() => {
    loadChapter();
  }, [params.id]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      const chapter = await getHistoryChapter(params.id);
      if (chapter) {
        setFormData({
          chapter: chapter.chapter,
          title: chapter.title,
          period: chapter.period,
          subtitle: chapter.subtitle,
          story: chapter.story,
          imageUrl: chapter.imageUrl,
          highlights: chapter.highlights,
        });
      } else {
        alert('챕터를 찾을 수 없습니다.');
        router.push('/admin/content/history');
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      alert('챕터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.period || !formData.story || !formData.imageUrl) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      await updateHistoryChapter(params.id, formData);
      alert('챕터가 수정되었습니다!');
      router.push('/admin/content/history');
    } catch (error) {
      console.error('Error updating chapter:', error);
      alert('챕터 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { year: '', title: '', description: '' }],
    });
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setFormData({ ...formData, highlights: newHighlights });
  };

  if (loading) {
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
            <h1 className="text-2xl font-bold text-amber-500">챕터 수정</h1>
            <Link
              href="/admin/content/history"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">챕터 번호 *</label>
              <input
                type="number"
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">기간 *</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">부제목</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">스토리 *</label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white min-h-[200px]"
                required
              />
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="챕터 이미지"
              path="history"
              required
            />
          </div>

          {/* 하이라이트 */}
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">하이라이트</h3>
              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black text-sm rounded transition-colors"
              >
                + 추가
              </button>
            </div>

            <div className="space-y-4">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="bg-gray-800 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">하이라이트 #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={highlight.year}
                      onChange={(e) => updateHighlight(index, 'year', e.target.value)}
                      placeholder="연도"
                      className="w-full px-3 py-2 bg-gray-700 border border-white/10 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      value={highlight.title}
                      onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                      placeholder="제목"
                      className="w-full px-3 py-2 bg-gray-700 border border-white/10 rounded text-white text-sm"
                    />
                    <textarea
                      value={highlight.description}
                      onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                      placeholder="설명"
                      className="w-full px-3 py-2 bg-gray-700 border border-white/10 rounded text-white text-sm min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-bold rounded-lg transition-colors"
            >
              {saving ? '저장 중...' : '수정 완료'}
            </button>
            <Link
              href="/admin/content/history"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

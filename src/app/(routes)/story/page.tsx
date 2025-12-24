'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { submitStory } from '@/lib/firestore/story';

export default function StoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    graduationYear: '',
    title: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage(null);

    const result = await submitStory({
      name: formData.name,
      email: formData.email,
      graduationYear: formData.graduationYear
        ? parseInt(formData.graduationYear)
        : undefined,
      title: formData.title,
      content: formData.content,
    });

    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        graduationYear: '',
        title: '',
        content: '',
      });
    }

    setIsSubmitting(false);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <SubPageLayout
      title="사연 보내기"
      subtitle="삼육보건대학교의 90년, 당신의 이야기로 채워주세요. Share your story with us."
    >
      <section className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 안내 메시지 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              여러분의 소중한 이야기를 들려주세요
            </h2>
            <p className="text-gray-400 leading-relaxed">
              삼육보건대학교와 함께한 추억, 감동, 성장의 순간들을 공유해주세요.
              <br />
              여러분의 이야기는 우리 모두의 소중한 역사가 됩니다.
            </p>
          </div>

          {/* 폼 */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            {/* 메시지 */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* 이름 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                이름 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50"
                placeholder="홍길동"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                이메일 (선택)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50"
                placeholder="example@email.com"
              />
            </div>

            {/* 졸업연도 */}
            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                졸업연도 (선택)
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50"
                placeholder="2024"
                min="1935"
                max="2030"
              />
            </div>

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
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50"
                placeholder="사연 제목을 입력하세요"
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
                disabled={isSubmitting}
                rows={10}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white rounded-lg focus:border-amber-500 focus:outline-none disabled:opacity-50 resize-none"
                placeholder="여러분의 소중한 이야기를 들려주세요..."
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '전송 중...' : '사연 보내기'}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Closing Message */}
      <section className="text-center py-20 border-t border-white/10 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-6 tracking-tight">
            함께 만들어가는 90년의 이야기
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            여러분의 목소리가 역사가 됩니다.
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}

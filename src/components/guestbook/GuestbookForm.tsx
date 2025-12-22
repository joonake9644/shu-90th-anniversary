'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GuestbookFormData } from '@/types/firestore';
import { addGuestbookEntry } from '@/lib/firestore/guestbook';
import { Send } from 'lucide-react';

interface GuestbookFormProps {
  onSubmitSuccess: () => void;
}

export function GuestbookForm({ onSubmitSuccess }: GuestbookFormProps) {
  const [formData, setFormData] = useState<GuestbookFormData>({
    name: '',
    graduationYear: new Date().getFullYear(),
    major: '',
    message: '',
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addGuestbookEntry(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: '',
          graduationYear: new Date().getFullYear(),
          major: '',
          message: '',
          isAnonymous: false,
        });
        onSubmitSuccess();
      }, 2000);
    } catch (error) {
      console.error('방명록 작성 중 오류:', error);
      alert('방명록 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;
  const maxLength = 500;

  return (
    <div className="bg-white/5 border border-white/10 p-8 hover:border-white/20 transition-all duration-500">
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
        방명록 작성
      </h2>
      <p className="text-sm text-gray-500 mb-8 font-light tracking-wide">
        모교에 전하는 메시지
      </p>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 border border-amber-500/50 bg-amber-500/10 text-white text-center font-light tracking-wide"
          >
            ✓ 방명록이 성공적으로 등록되었습니다
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-light text-gray-400 mb-3 tracking-wide">
            이름 <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={formData.isAnonymous}
            className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:border-amber-500/50 focus:outline-none disabled:opacity-50 font-light transition-all"
            placeholder="홍길동"
          />
          <label className="flex items-center mt-3 text-sm text-gray-500 font-light cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isAnonymous: e.target.checked,
                })
              }
              className="mr-2 accent-amber-500"
            />
            <span className="group-hover:text-gray-400 transition-colors">
              익명으로 작성
            </span>
          </label>
        </div>

        {/* Graduation Year & Major */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-400 mb-3 tracking-wide">
              졸업 연도 <span className="text-amber-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1936"
              max={new Date().getFullYear() + 10}
              value={formData.graduationYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  graduationYear: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:border-amber-500/50 focus:outline-none font-light transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-400 mb-3 tracking-wide">
              전공 (선택)
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  major: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:border-amber-500/50 focus:outline-none font-light transition-all"
              placeholder="간호학과"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-light text-gray-400 mb-3 tracking-wide">
            메시지 <span className="text-amber-500">*</span>
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
            maxLength={maxLength}
            rows={6}
            className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:border-amber-500/50 focus:outline-none resize-none font-light leading-relaxed transition-all"
            placeholder="모교에 전하고 싶은 메시지를 남겨주세요..."
          />
          <div
            className={`text-sm text-right mt-2 font-light tracking-wide transition-colors ${
              messageLength > maxLength - 50
                ? 'text-amber-500'
                : 'text-gray-600'
            }`}
          >
            {messageLength} / {maxLength}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="w-full py-4 bg-white text-black hover:bg-amber-500 hover:text-black disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed font-light tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: isSubmitting || showSuccess ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || showSuccess ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            '등록 중...'
          ) : (
            <>
              방명록 등록하기
              <Send size={16} />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

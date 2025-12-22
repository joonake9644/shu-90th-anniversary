'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GuestbookEntry } from '@/types/firestore';
import { likeGuestbookEntry } from '@/lib/firestore/guestbook';
import { useLikeRecord } from '@/hooks/useLocalStorage';

interface GuestbookCardProps {
  entry: GuestbookEntry;
  index?: number;
}

export function GuestbookCard({ entry, index = 0 }: GuestbookCardProps) {
  const [likes, setLikes] = useState(entry.likes);
  const { hasLikedGuestbook, toggleGuestbookLike } = useLikeRecord();
  const [isLiking, setIsLiking] = useState(false);

  const hasLiked = hasLikedGuestbook(entry.id);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (!hasLiked) {
        await likeGuestbookEntry(entry.id);
        setLikes((prev) => prev + 1);
      }
      toggleGuestbookLike(entry.id);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const displayName = entry.isAnonymous ? '익명' : entry.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-white/5 border border-white/10 p-8 hover:border-white/20 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white tracking-tight mb-1">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500 font-light tracking-wide">
            {entry.graduationYear}년 졸업
            {entry.major && (
              <>
                <span className="mx-2 text-white/20">·</span>
                {entry.major}
              </>
            )}
          </p>
        </div>

        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            hasLiked
              ? 'bg-amber-500/20 text-amber-500'
              : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={16}
            className={`transition-all ${hasLiked ? 'fill-current' : ''}`}
          />
          <span className="text-sm font-medium">{likes}</span>
        </motion.button>
      </div>

      {/* Message */}
      <p className="text-gray-300 whitespace-pre-wrap font-light leading-relaxed mb-6">
        {entry.message}
      </p>

      {/* Date */}
      <div className="text-xs text-gray-600 tracking-wider font-light">
        {entry.createdAt.toDate().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.05), transparent 70%)',
        }}
      />
    </motion.div>
  );
}

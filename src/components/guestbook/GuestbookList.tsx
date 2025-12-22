'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GuestbookCard } from './GuestbookCard';
import type { GuestbookEntry } from '@/types/firestore';
import { getGuestbookEntries, getGraduationYears } from '@/lib/firestore/guestbook';

interface GuestbookListProps {
  refreshTrigger: number;
}

export function GuestbookList({ refreshTrigger }: GuestbookListProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGuestbookEntries(sortBy, yearFilter, 50);
      setEntries(data);
    } catch (error) {
      console.error('방명록 로드 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, yearFilter]);

  const loadYears = useCallback(async () => {
    try {
      const years = await getGraduationYears();
      setAvailableYears(years);
    } catch (error) {
      console.error('졸업 연도 로드 중 오류:', error);
    }
  }, []);

  useEffect(() => {
    loadEntries();
    loadYears();
  }, [loadEntries, loadYears, refreshTrigger]);

  return (
    <div>
      {/* 필터 및 정렬 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-2">
          <FilterButton
            active={sortBy === 'latest'}
            onClick={() => setSortBy('latest')}
            label="최신순"
          />
          <FilterButton
            active={sortBy === 'likes'}
            onClick={() => setSortBy('likes')}
            label="좋아요순"
          />
        </div>

        <select
          value={yearFilter || ''}
          onChange={(e) =>
            setYearFilter(
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          className="px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none font-light tracking-wide transition-all"
        >
          <option value="" className="bg-black">
            전체 연도
          </option>
          {availableYears.map((year) => (
            <option key={year} value={year} className="bg-black">
              {year}년 졸업
            </option>
          ))}
        </select>
      </div>

      {/* 방명록 목록 */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="text-gray-400 mt-4 font-light">방명록을 불러오는 중...</p>
        </div>
      ) : entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 text-lg font-light">
            아직 등록된 방명록이 없습니다.
          </p>
          <p className="text-gray-500 mt-2 font-light">
            첫 번째 방명록을 남겨보세요!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {entries.map((entry, index) => (
            <GuestbookCard key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      )}

      {/* 총 개수 표시 */}
      {!loading && entries.length > 0 && (
        <div className="text-center mt-8 text-gray-500 text-sm font-light tracking-wider">
          총 {entries.length}개의 메시지
        </div>
      )}
    </div>
  );
}

// Filter Button Component
function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        px-5 py-2 text-sm font-light tracking-wide transition-all duration-300
        ${
          active
            ? 'bg-white text-black'
            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}

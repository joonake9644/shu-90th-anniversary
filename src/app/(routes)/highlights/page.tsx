'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { timelineData, Highlight } from '@/data/timelineData';
import Image from 'next/image';

// 모든 하이라이트를 Period 정보와 함께 추출
interface HighlightWithPeriod extends Highlight {
  periodTitle: string;
  periodRange: string;
  periodId: string;
}

export default function HighlightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  // 모든 하이라이트를 추출하고 Period 정보 추가
  const allHighlights: HighlightWithPeriod[] = useMemo(() => {
    return timelineData.flatMap((period) =>
      period.highlights.map((highlight) => ({
        ...highlight,
        periodTitle: period.title,
        periodRange: period.rangeLabel,
        periodId: period.id,
      }))
    );
  }, []);

  // 필터링된 하이라이트
  const filteredHighlights = useMemo(() => {
    if (selectedPeriod === 'all') return allHighlights;
    return allHighlights.filter((h) => h.periodId === selectedPeriod);
  }, [selectedPeriod, allHighlights]);

  return (
    <SubPageLayout
      title="명장면 90"
      subtitle="90년 역사 속 가장 빛나는 순간들을 되돌아봅니다. The most brilliant moments in our 90-year history."
    >
      {/* Filter Buttons */}
      <section className="mb-16">
        <div className="flex flex-wrap gap-3">
          <FilterButton
            active={selectedPeriod === 'all'}
            onClick={() => setSelectedPeriod('all')}
            label="전체"
          />
          {timelineData.map((period) => (
            <FilterButton
              key={period.id}
              active={selectedPeriod === period.id}
              onClick={() => setSelectedPeriod(period.id)}
              label={period.rangeLabel}
            />
          ))}
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="mb-20">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHighlights.map((highlight, index) => (
              <HighlightCard key={highlight.id} highlight={highlight} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredHighlights.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">선택한 연대에 하이라이트가 없습니다.</p>
          </motion.div>
        )}
      </section>

      {/* Statistics */}
      <section className="py-20 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number="90" label="Years of History" />
          <StatCard number={allHighlights.length.toString()} label="Key Moments" />
          <StatCard number="6" label="Eras" />
          <StatCard number="∞" label="Future Visions" />
        </div>
      </section>

      {/* Closing Quote */}
      <section className="text-center py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-4 tracking-tight">
            &ldquo;진리로 밝히고, 사랑으로 채우며,<br />봉사로 완성하다&rdquo;
          </p>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Truth · Love · Service
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
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
        px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
        ${
          active
            ? 'bg-white text-black'
            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}

// Highlight Card Component
function HighlightCard({
  highlight,
  index,
}: {
  highlight: HighlightWithPeriod;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-black">
        <Image
          src={highlight.thumb}
          alt={highlight.title}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
          }`}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Year Badge */}
        <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
          <span className="text-black font-bold text-sm">{highlight.year}</span>
        </div>

        {/* Period Label */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white/80 text-xs font-medium tracking-wider">
            {highlight.periodRange}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-snug">
          {highlight.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
          {highlight.description}
        </p>

        {/* Era Tag */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-amber-500/80 font-medium tracking-wider uppercase">
            {highlight.periodTitle}
          </span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.1), transparent 70%)',
        }}
      />
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div className="text-5xl md:text-6xl font-bold text-amber-500 mb-2 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

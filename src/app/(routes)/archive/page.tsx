'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { timelineData } from '@/data/timelineData';
import Image from 'next/image';
import { X, ZoomIn, Download } from 'lucide-react';

interface ArchiveImage {
  id: string;
  url: string;
  title: string;
  year: string;
  period: string;
  periodRange: string;
  description: string;
}

export default function ArchivePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<ArchiveImage | null>(null);

  // Extract all images from timeline data
  const allImages: ArchiveImage[] = useMemo(() => {
    const images: ArchiveImage[] = [];

    timelineData.forEach((period) => {
      // Add hero image
      images.push({
        id: `${period.id}-hero`,
        url: period.heroMedia,
        title: `${period.title} 시대`,
        year: period.yearStart.toString(),
        period: period.title,
        periodRange: period.rangeLabel,
        description: period.subtitle,
      });

      // Add highlight images
      period.highlights.forEach((highlight) => {
        images.push({
          id: highlight.id,
          url: highlight.thumb,
          title: highlight.title,
          year: highlight.year,
          period: period.title,
          periodRange: period.rangeLabel,
          description: highlight.description,
        });
      });
    });

    return images;
  }, []);

  // Filter images by period
  const filteredImages = useMemo(() => {
    if (selectedPeriod === 'all') return allImages;
    const period = timelineData.find((p) => p.id === selectedPeriod);
    if (!period) return allImages;
    return allImages.filter((img) => img.periodRange === period.rangeLabel);
  }, [selectedPeriod, allImages]);

  return (
    <SubPageLayout
      title="역사 갤러리"
      subtitle="90년의 시간을 담은 소중한 기록들. A precious collection of our 90-year journey."
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

      {/* Image Grid */}
      <section className="mb-20">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => setLightboxImage(image)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">선택한 연대에 이미지가 없습니다.</p>
          </motion.div>
        )}
      </section>

      {/* Statistics */}
      <section className="py-16 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number={allImages.length.toString()} label="Total Images" />
          <StatCard number="6" label="Eras" />
          <StatCard number="90" label="Years" />
          <StatCard number="∞" label="Memories" />
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* Closing Message */}
      <section className="text-center py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-6 tracking-tight">
            시간을 초월한 순간들
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            각각의 사진은 우리 학교의 역사를 증명하는 소중한 기록입니다.
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

// Image Card Component
function ImageCard({
  image,
  index,
  onClick,
}: {
  image: ArchiveImage;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative aspect-[3/4] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <Image
        src={image.url}
        alt={image.title}
        fill
        className={`object-cover transition-all duration-700 ${
          isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
        }`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Year Badge */}
          <div className="inline-block bg-amber-500/90 px-3 py-1 rounded-full mb-2">
            <span className="text-black font-bold text-xs">{image.year}</span>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {image.title}
          </h3>

          {/* Period */}
          <p className="text-gray-400 text-xs">{image.periodRange}</p>
        </div>

        {/* Zoom Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-4 right-4"
        >
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <ZoomIn size={16} className="text-white" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Lightbox Component
function Lightbox({
  image,
  onClose,
}: {
  image: ArchiveImage | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClose}
          className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
        >
          <X size={24} className="text-white" />
        </motion.button>

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] mb-6">
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Info */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block bg-amber-500/90 px-4 py-1.5 rounded-full mb-3">
                  <span className="text-black font-bold text-sm">{image.year}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {image.title}
                </h2>
                <p className="text-gray-400 text-sm">{image.periodRange} · {image.period}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">{image.description}</p>

            {/* Download Button */}
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              <span className="text-sm">원본 보기</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

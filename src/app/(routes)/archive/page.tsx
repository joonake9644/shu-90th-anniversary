'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { getPublicPeriodsWithHighlights, type PeriodWithHighlights } from '@/lib/firestore/public/periods';
import Image from 'next/image';
import { X, ZoomIn, Download, Sparkles } from 'lucide-react';

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
  const [periodsData, setPeriodsData] = useState<PeriodWithHighlights[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch periods and highlights from Firestore
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getPublicPeriodsWithHighlights();
      if (data) {
        setPeriodsData(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Extract all images from periods data
  const allImages: ArchiveImage[] = useMemo(() => {
    const images: ArchiveImage[] = [];

    periodsData.forEach((period) => {
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
  }, [periodsData]);

  // Filter images by period
  const filteredImages = useMemo(() => {
    if (selectedPeriod === 'all') return allImages;
    const period = periodsData.find((p) => p.id === selectedPeriod);
    if (!period) return allImages;
    return allImages.filter((img) => img.periodRange === period.rangeLabel);
  }, [selectedPeriod, allImages, periodsData]);

  return (
    <SubPageLayout
      title="별빛 아카이브"
      subtitle="90년의 빛나는 순간들을 간직한 시간의 보물상자. Timeless treasures of our luminous 90-year journey."
    >
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Filter Buttons */}
      <section className="mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <FilterButton
            active={selectedPeriod === 'all'}
            onClick={() => setSelectedPeriod('all')}
            label="전체 시대"
            icon={<Sparkles size={14} />}
          />
          {periodsData.map((period, index) => (
            <FilterButton
              key={period.id}
              active={selectedPeriod === period.id}
              onClick={() => setSelectedPeriod(period.id)}
              label={period.rangeLabel}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </section>

      {/* Bento Grid Layout */}
      <section className="mb-32 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingState key="loading" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    onClick={() => setLightboxImage(image)}
                    // Create varied sizes for Bento grid
                    className={getBentoSize(index)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="inline-block p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-gray-400 text-lg mb-2">선택한 시대의 기록을 준비 중입니다</p>
              <p className="text-gray-600 text-sm">곧 만나보실 수 있습니다</p>
            </div>
          </motion.div>
        )}
      </section>

      {/* Enhanced Statistics */}
      <section className="py-20 border-y border-white/10 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-purple-500/5 blur-3xl" />

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-12">
          <EnhancedStatCard number={allImages.length} label="귀중한 순간들" suffix="+" />
          <EnhancedStatCard number={periodsData.length} label="시대의 흐름" suffix="개" />
          <EnhancedStatCard number={90} label="빛나는 여정" suffix="년" />
          <EnhancedStatCard number="∞" label="영원한 기억" suffix="" />
        </div>
      </section>

      {/* Advanced Lightbox */}
      <AdvancedLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* Poetic Closing */}
      <section className="text-center py-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl" />

          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block"
          >
            <h3 className="text-4xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white mb-8 tracking-tight">
              별빛처럼 빛나는 추억
            </h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            시간은 흘러도 이 순간들은 영원히 빛납니다.
            <br />
            90년의 여정, 수많은 이야기가 별빛이 되어 우리를 비춥니다.
          </motion.p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}

// Helper function for Bento grid sizing
function getBentoSize(index: number): string {
  const patterns = [
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
  ];
  return patterns[index % patterns.length];
}

// Floating Particles Component
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

// Enhanced Filter Button
function FilterButton({
  active,
  onClick,
  label,
  icon,
  delay = 0,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-500
        backdrop-blur-md overflow-hidden group
        ${
          active
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30'
            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
        }
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer Effect */}
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      <span className="relative flex items-center gap-2">
        {icon}
        {label}
      </span>
    </motion.button>
  );
}

// Enhanced Image Card with 3D Parallax
function ImageCard({
  image,
  index,
  onClick,
  className = '',
}: {
  image: ArchiveImage;
  index: number;
  onClick: () => void;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        group relative bg-white/5 rounded-2xl overflow-hidden
        border border-white/10 hover:border-amber-500/50
        transition-all duration-700 cursor-pointer
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className={`
            object-cover transition-all duration-1000
            ${isHovered ? 'scale-110 grayscale-0 brightness-110' : 'scale-100 grayscale brightness-75'}
          `}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Year Badge with Shine */}
          <motion.div
            className="relative inline-block mb-3 overflow-hidden"
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative text-black font-bold text-xs tracking-wider">
                {image.year}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-white font-bold text-base md:text-lg line-clamp-2 mb-2 leading-tight"
            animate={{
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {image.title}
          </motion.h3>

          {/* Period */}
          <motion.p
            className="text-amber-200/60 text-xs font-medium tracking-wide"
            animate={{
              opacity: isHovered ? 1 : 0.6,
            }}
          >
            {image.periodRange}
          </motion.p>
        </motion.div>

        {/* Zoom Icon with Magnetic Effect */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 0 : -180,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-full border border-white/20 shadow-xl">
            <ZoomIn size={18} className="text-white" />
          </div>
        </motion.div>

        {/* Sparkle Effect */}
        {isHovered && (
          <motion.div
            className="absolute top-8 left-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Sparkles size={16} className="text-amber-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Advanced Lightbox
function AdvancedLightbox({
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
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 blur-3xl" />

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={onClose}
          className="absolute top-8 right-8 z-10 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all backdrop-blur-md border border-white/20 group"
        >
          <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>

        {/* Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-6xl w-full relative"
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] mb-8 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-contain"
              priority
            />

            {/* Image Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-500/5" />

            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                <div className="flex-1">
                  {/* Year Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 rounded-full mb-4 shadow-lg shadow-amber-500/30"
                  >
                    <span className="text-black font-bold text-sm tracking-wider">
                      {image.year}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    {image.title}
                  </h2>

                  {/* Period Info */}
                  <div className="flex items-center gap-3 text-sm text-amber-200/70">
                    <span>{image.periodRange}</span>
                    <span className="text-white/30">•</span>
                    <span>{image.period}</span>
                  </div>
                </div>

                {/* Download Button */}
                <motion.a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/20 group"
                >
                  <Download size={18} className="group-hover:animate-bounce" />
                  <span className="font-medium">원본 다운로드</span>
                </motion.a>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed">
                {image.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Enhanced Stat Card
function EnhancedStatCard({
  number,
  label,
  suffix,
}: {
  number: number | string;
  label: string;
  suffix: string;
}) {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (typeof number === 'number') {
      let current = 0;
      const increment = number / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          setDisplayNumber(number);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center group relative"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="relative text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {typeof number === 'number' ? displayNumber : number}
        <span className="text-4xl md:text-5xl">{suffix}</span>
      </motion.div>

      <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-light">
        {label}
      </div>
    </motion.div>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
        />
      ))}
    </div>
  );
}

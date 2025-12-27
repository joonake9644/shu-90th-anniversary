'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { Play, Clock, Calendar } from 'lucide-react';
import { getPublicVideos } from '@/lib/firestore/public/videos';
import type { Video } from '@/lib/firestore/admin/videos';

// Fallback 비디오 데이터 (Firestore 오류 시 사용)
const fallbackVideosData: Video[] = [
  {
    id: 'v1',
    title: '개교 기념식 - 1936년의 감동',
    description: '삼육보건대학교의 첫 걸음을 되돌아봅니다.',
    year: '1936',
    duration: '5:32',
    thumbnail: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    category: '기념식',
    period: '1936-1946',
    order: 1,
    featured: true,
    enabled: true,
  },
  {
    id: 'v2',
    title: '전란 속의 교육 - 6.25 전쟁 시기',
    description: '어려운 상황에서도 멈추지 않은 교육의 열정',
    year: '1951',
    duration: '8:15',
    thumbnail: 'https://images.unsplash.com/photo-1533481498108-4b77f433501a?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    category: '역사',
    period: '1947-1956',
    order: 2,
    featured: false,
    enabled: true,
  },
  {
    id: 'v3',
    title: '캠퍼스 확장 공사 - 1974',
    description: '성장하는 대학, 늘어나는 학생들을 위한 최신 시설',
    year: '1974',
    duration: '6:45',
    thumbnail: 'https://images.unsplash.com/photo-1676555263970-63e72d69642a?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    category: '캠퍼스',
    period: '1957-1996',
    order: 3,
    featured: false,
    enabled: true,
  },
  {
    id: 'v4',
    title: '88올림픽과 함께한 우리 대학',
    description: '글로벌 비전을 향한 첫 발걸음',
    year: '1988',
    duration: '12:30',
    thumbnail: 'https://images.unsplash.com/photo-1758432274762-71b4c4572728?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    category: '행사',
    period: '1957-1996',
    order: 4,
    featured: false,
    enabled: true,
  },
  {
    id: 'v5',
    title: 'WCC 선정 기념 다큐멘터리',
    description: '세계가 인정한 직업 교육의 산실',
    year: '2013',
    duration: '15:00',
    thumbnail: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    category: '기념식',
    period: '1997-2016',
    order: 5,
    featured: false,
    enabled: true,
  },
  {
    id: 'v6',
    title: 'AI 융합 교육 플랫폼 오픈',
    description: '미래 교육을 선도하는 디지털 혁신',
    year: '2023',
    duration: '7:20',
    thumbnail: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    category: '기술',
    period: '2017-2024',
    order: 6,
    featured: false,
    enabled: true,
  },
  {
    id: 'v7',
    title: '90주년 기념 메시지',
    description: '총장님의 90주년 기념사',
    year: '2026',
    duration: '4:50',
    thumbnail: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    category: '기념식',
    period: '2025-Beyond',
    order: 7,
    featured: false,
    enabled: true,
  },
  {
    id: 'v8',
    title: '동문 인터뷰 시리즈 - 1기',
    description: '선배들이 들려주는 90년의 이야기',
    year: '2026',
    duration: '18:45',
    thumbnail: 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=example8',
    category: '인터뷰',
    period: '2025-Beyond',
    order: 8,
    featured: false,
    enabled: true,
  },
];

const periods = [
  { id: 'all', label: '전체' },
  { id: '1936-1946', label: '1936~1946' },
  { id: '1947-1956', label: '1947~1956' },
  { id: '1957-1996', label: '1957~1996' },
  { id: '1997-2016', label: '1997~2016' },
  { id: '2017-2024', label: '2017~2024' },
  { id: '2025-Beyond', label: '2025~Beyond' },
];

export default function VideoHistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videosData, setVideosData] = useState<Video[]>(fallbackVideosData);
  const [loading, setLoading] = useState(true);

  // Load videos from Firestore
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getPublicVideos();
        if (data && data.length > 0) {
          setVideosData(data);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Filter videos by period
  const filteredVideos = useMemo(() => {
    if (selectedPeriod === 'all') return videosData;
    return videosData.filter((video) => video.period === selectedPeriod);
  }, [selectedPeriod, videosData]);

  return (
    <SubPageLayout
      title="영상으로 보는 90년"
      subtitle="90년의 역사를 생생하게 담은 영상 아카이브. Experience our 90-year journey through moving images."
    >
      {/* Filter Buttons */}
      <section className="mb-16">
        <div className="flex flex-wrap gap-3">
          {periods.map((period) => (
            <FilterButton
              key={period.id}
              active={selectedPeriod === period.id}
              onClick={() => setSelectedPeriod(period.id)}
              label={period.label}
            />
          ))}
        </div>
      </section>

      {/* Featured Video */}
      {filteredVideos.length > 0 && (
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
            onClick={() => setSelectedVideo(filteredVideos[0])}
          >
            {/* Thumbnail */}
            <div
              className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: `url(${filteredVideos[0].thumbnail})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-amber-500/90 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <Play size={32} className="text-black ml-1" fill="black" />
              </motion.div>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-block bg-amber-500/90 px-3 py-1 rounded-full mb-3">
                <span className="text-black font-bold text-sm">{filteredVideos[0].year}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {filteredVideos[0].title}
              </h2>
              <p className="text-gray-300 mb-4">{filteredVideos[0].description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {filteredVideos[0].duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {filteredVideos[0].year}
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Video Grid */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-8">영상 아카이브</h2>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">선택한 연대에 영상이 없습니다.</p>
          </motion.div>
        )}
      </section>

      {/* Statistics */}
      <section className="py-16 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number={videosData.length.toString()} label="Total Videos" />
          <StatCard number="90" label="Years" />
          <StatCard number="6" label="Eras" />
          <StatCard number="∞" label="Stories" />
        </div>
      </section>

      {/* Video Player Modal */}
      <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      {/* Closing Message */}
      <section className="text-center py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-6 tracking-tight">
            움직이는 역사, 살아있는 기억
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            영상은 시간을 담아내고, 우리는 그 시간을 통해 과거와 만납니다.
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

// Video Card Component
function VideoCard({
  video,
  index,
  onClick,
}: {
  video: Video;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
          }`}
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
          {video.duration}
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-amber-500/90 rounded-full flex items-center justify-center">
            <Play size={20} className="text-black ml-1" fill="black" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="inline-block bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-medium mb-2">
          {video.category}
        </div>
        <h3 className="text-white font-semibold text-base line-clamp-2 mb-2 leading-snug">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{video.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{video.year}</span>
          <span>•</span>
          <span>{video.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Video Player Modal
function VideoPlayerModal({
  video,
  onClose,
}: {
  video: Video | null;
  onClose: () => void;
}) {
  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full"
        >
          {/* Video Placeholder */}
          <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center border border-white/10">
            <div className="text-center">
              <Play size={64} className="text-white/50 mx-auto mb-4" />
              <p className="text-white/70">Video Player</p>
              <p className="text-white/50 text-sm mt-2">실제로는 YouTube 또는 비디오 플레이어가 표시됩니다</p>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block bg-amber-500/90 px-4 py-1.5 rounded-full mb-3">
                  <span className="text-black font-bold text-sm">{video.year}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {video.title}
                </h2>
                <p className="text-gray-400 text-sm flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {video.duration}
                  </span>
                  <span>•</span>
                  <span>{video.category}</span>
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">{video.description}</p>
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

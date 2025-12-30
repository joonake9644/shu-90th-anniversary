'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { historyChapters as fallbackChapters } from '@/data/historyChapters';
import { getPublicHistoryChapters } from '@/lib/firestore/public/history';
import { Footer } from '@/components/layout/Footer';
import type { HistoryChapter } from '@/data/historyChapters';

/**
 * 별빛 아카이브 - Starlight Archive (고도화 버전)
 * 감성을 극대화한 인터랙티브 역사 여정
 */
export default function HistoryPage() {
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [isExploring, setIsExploring] = useState(false);
    const [chapters, setChapters] = useState<HistoryChapter[]>(fallbackChapters);
    const [loading, setLoading] = useState(true);

    // Firestore에서 챕터 데이터 로드
    useEffect(() => {
        const loadChapters = async () => {
            try {
                const data = await getPublicHistoryChapters();
                if (data.length > 0) {
                    setChapters(data);
                }
            } catch (error) {
                console.error('Error loading chapters from Firestore:', error);
                // 에러 발생 시 fallback 데이터 사용
            } finally {
                setLoading(false);
            }
        };

        loadChapters();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">로딩 중...</div>
            </div>
        );
    }

    return (
        <main className="bg-black min-h-screen text-white overflow-x-hidden">
            {/* Hero - 우주에서 바라본 지구 (고도화) */}
            <HeroSection onExplore={() => setIsExploring(true)} />

            {/* 별자리 타임라인 */}
            {isExploring && (
                <ConstellationTimeline
                    chapters={chapters}
                    onSelectChapter={setSelectedChapter}
                />
            )}

            {/* 선택된 챕터 상세 뷰 */}
            <AnimatePresence>
                {selectedChapter !== null && (
                    <ChapterViewer
                        chapter={chapters[selectedChapter - 1]}
                        onClose={() => setSelectedChapter(null)}
                    />
                )}
            </AnimatePresence>

            {/* 챕터 스토리들 (고도화) */}
            {isExploring && (
                <div className="relative">
                    {chapters.map((chapter, index) => (
                        <ChapterSection
                            key={chapter.chapter}
                            chapter={chapter}
                            index={index}
                            onClick={() => setSelectedChapter(chapter.chapter)}
                        />
                    ))}
                </div>
            )}

            {/* 에필로그 */}
            {isExploring && <EpilogueSection />}

            <Footer />
        </main>
    );
}

/**
 * Hero Section - 에필로그 스타일 심플한 별빛
 */
function HeroSection({ onExplore }: { onExplore: () => void }) {
    // 심플한 별빛 (에필로그 스타일)
    const [simpleStars] = useState(() =>
        [...Array(30)].map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1 + 1,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 5
        }))
    );

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Space Background with gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
                {/* 시네마틱 빛 광선 */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,197,253,0.05),transparent_70%)]" />
            </div>

            {/* 심플한 별빛 (에필로그 스타일) - z-index: 1 */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {simpleStars.map((star, i) => (
                    <motion.div
                        key={`simple-star-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            y: [0, -40, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Earth Glow */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Content - z-index: 5 */}
            <div className="relative z-[5] text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 0.3 }}
                >
                    <p className="text-blue-200/70 font-light text-lg md:text-xl mb-8 tracking-wide">
                        "우주에서 바라본 작은 별 하나..."
                    </p>
                </motion.div>

                {/* 고급스러운 "별빛 아카이브" 타이틀 */}
                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.8, delay: 0.6 }}
                >
                    <span className="block mb-4 relative">
                        <span
                            className="relative inline-block"
                            style={{
                                background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #e0e0e0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(255, 220, 100, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                                textShadow: '0 0 40px rgba(255, 220, 100, 0.4), 0 0 80px rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            별빛
                        </span>
                    </span>
                    <span className="block relative">
                        <span
                            className="relative inline-block"
                            style={{
                                background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #fbbf24 60%, #f59e0b 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
                                textShadow: '0 0 60px rgba(251, 191, 36, 0.8), 0 0 120px rgba(251, 191, 36, 0.4)'
                            }}
                        >
                            아카이브
                        </span>
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1 }}
                    className="mb-16"
                >
                    <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed font-light">
                        1936년부터 2026년까지
                    </p>
                    <p className="text-lg md:text-xl text-blue-300/90 italic font-light">
                        90년간 빛나온 별들의 기록
                    </p>
                </motion.div>

                {/* 클래스모피즘 버튼 */}
                <motion.button
                    onClick={onExplore}
                    className="group relative px-14 py-6 overflow-hidden rounded-full"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1.3 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: '0 12px 48px 0 rgba(59, 130, 246, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-amber-500/20"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            backgroundSize: '200% 200%',
                        }}
                    />
                    <span className="relative z-10 text-white font-medium tracking-widest text-sm flex items-center gap-3">
                        별자리 탐험하기
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </motion.button>
            </div>


            {/* Ambient Light Effects - z-index: 1 */}
            <div className="absolute inset-0 z-[1]">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
                {/* 추가 시네마틱 효과 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }} />
            </div>
        </section>
    );
}


/**
 * 별자리 타임라인 - 인터랙티브 네비게이션
 */
function ConstellationTimeline({ chapters, onSelectChapter }: {
    chapters: HistoryChapter[];
    onSelectChapter: (chapter: number) => void;
}) {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="text-white">별자리를 </span>
                        <span
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #fbbf24 50%, #60a5fa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            따라서
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg font-light">
                        각 별을 클릭하여 그 시대의 이야기를 들어보세요
                    </p>
                </motion.div>

                {/* Constellation Map */}
                <div className="relative h-[600px] max-w-4xl mx-auto">
                    <svg className="absolute inset-0 w-full h-full">
                        {/* Constellation Lines */}
                        {chapters.map((_, index) => {
                            if (index === chapters.length - 1) return null;
                            const positions = getStarPositions(chapters.length);
                            const current = positions[index];
                            const next = positions[index + 1];
                            return (
                                <motion.line
                                    key={index}
                                    x1={`${current.x}%`}
                                    y1={`${current.y}%`}
                                    x2={`${next.x}%`}
                                    y2={`${next.y}%`}
                                    stroke="url(#line-gradient)"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                                />
                            );
                        })}
                        <defs>
                            <linearGradient id="line-gradient">
                                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Stars (Chapters) */}
                    {chapters.map((chapter, index) => {
                        const positions = getStarPositions(chapters.length);
                        const pos = positions[index];
                        return (
                            <StarPoint
                                key={chapter.chapter}
                                chapter={chapter}
                                position={pos}
                                index={index}
                                onClick={() => onSelectChapter(chapter.chapter)}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/**
 * 별 포인트 - 각 챕터를 나타내는 인터랙티브 별
 */
function StarPoint({ chapter, position, index, onClick }: {
    chapter: HistoryChapter;
    position: { x: number; y: number };
    index: number;
    onClick: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="absolute group cursor-pointer"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 200 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Star Glow */}
            <motion.div
                className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                animate={{
                    scale: isHovered ? 1.8 : 1,
                    opacity: isHovered ? 0.8 : 0.4
                }}
                transition={{ duration: 0.4 }}
            >
                <div className="w-full h-full bg-gradient-radial from-amber-400/50 via-amber-400/20 to-transparent rounded-full blur-2xl" />
            </motion.div>

            {/* Star */}
            <motion.div
                className="relative w-10 h-10"
                animate={{
                    scale: isHovered ? 1.4 : 1,
                    rotate: isHovered ? 180 : 0
                }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" fill="currentColor">
                    <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
                </svg>
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    >
                        <div
                            className="px-5 py-3 rounded-xl shadow-2xl"
                            style={{
                                background: 'rgba(0, 0, 0, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                boxShadow: '0 8px 32px 0 rgba(251, 191, 36, 0.2)',
                            }}
                        >
                            <p className="text-amber-400 text-sm font-mono mb-1 font-medium">
                                {chapter.period}
                            </p>
                            <p className="text-white font-semibold text-base">
                                {chapter.title}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/**
 * 별 위치 계산 - 자연스러운 별자리 형태로 배치
 */
function getStarPositions(count: number) {
    return Array.from({ length: count }, (_, i) => {
        const progress = i / (count - 1);
        const x = 15 + progress * 70;
        const y = 30 + Math.sin(progress * Math.PI) * 40;
        return { x, y };
    });
}

/**
 * 챕터 뷰어 - 풀스크린 모달
 */
function ChapterViewer({ chapter, onClose }: {
    chapter: HistoryChapter;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12">
                    {/* Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-50" />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-amber-400 text-sm tracking-[0.3em] mb-4 font-light">
                            CHAPTER {chapter.chapter}
                        </p>
                        <p className="text-4xl font-mono text-white/40 mb-4 font-light">
                            {chapter.period}
                        </p>
                        <h2 className="text-5xl font-bold text-white mb-6">
                            {chapter.title}
                        </h2>
                        <p className="text-2xl text-amber-400/80 italic mb-8 font-light">
                            {chapter.subtitle}
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-12 font-light">
                            {chapter.story}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-6">
                            {chapter.highlights.map((highlight, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-l-2 border-amber-500/30 pl-6 hover:border-amber-500/60 transition-colors"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-amber-400 font-bold">
                                            {highlight.year}
                                        </span>
                                        <h3 className="text-white font-semibold">
                                            {highlight.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-sm font-light">
                                        {highlight.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Close Button - 클래스모피즘 */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    }}
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    );
}

/**
 * 챕터 섹션 - 스크롤 기반 스토리 (흑백→컬러 효과)
 */
function ChapterSection({ chapter, index, onClick }: {
    chapter: HistoryChapter;
    index: number;
    onClick: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity }}
            className="relative min-h-screen py-32 px-6 flex items-center"
            onClick={onClick}
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center cursor-pointer group">
                {/* Text */}
                <motion.div
                    style={{ y }}
                    className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}
                >
                    <p className="text-amber-400/60 text-sm tracking-[0.3em] mb-4 font-light">
                        CHAPTER {chapter.chapter}
                    </p>
                    <p className="text-3xl font-mono text-white/40 mb-4 font-light">
                        {chapter.period}
                    </p>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 group-hover:text-amber-400 transition-colors duration-500">
                        {chapter.title}
                    </h2>
                    <p className="text-xl text-gray-400 italic mb-8 font-light">
                        {chapter.subtitle}
                    </p>
                    <div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 group-hover:scale-105"
                        style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                        }}
                    >
                        <span className="text-amber-400 font-light">자세히 보기</span>
                        <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </motion.div>

                {/* Image - 흑백에서 컬러로 */}
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
                    className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}
                >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group/img">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            className="object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover/img:from-black/40 transition-all duration-700" />

                        {/* 호버 시 글로우 효과 */}
                        <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-amber-500/20 via-transparent to-blue-500/20" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

/**
 * 에필로그 - 미래를 향한 메시지
 */
function EpilogueSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/20 to-black" />

            {/* Floating Stars */}
            {[...Array(80)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        y: [0, -40, 0],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut"
                    }}
                />
            ))}

            <div className="relative z-10 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                >
                    <p className="text-blue-300/70 italic text-xl mb-8 font-light">
                        "그리고 이야기는 계속됩니다..."
                    </p>
                    <h2 className="text-6xl md:text-8xl font-bold mb-12">
                        <span className="block text-white mb-4">미래의</span>
                        <span
                            className="block"
                            style={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #fbbf24 50%, #60a5fa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            별빛으로
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-16 font-light">
                        지난 90년의 빛이 모여 만든 별자리는
                        <br />
                        앞으로 100년, 그 이상의 미래를 밝힐 것입니다.
                        <br />
                        <span className="text-amber-400/80 italic">
                            우리 모두가 그 별빛의 일부입니다.
                        </span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

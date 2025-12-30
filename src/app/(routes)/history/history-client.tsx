'use client';

import React, { useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';
import type { HistoryChapter } from '@/data/historyChapters';

// Footer를 동적으로 로드 (코드 스플리팅)
const DynamicFooter = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
    loading: () => <div className="h-20 bg-black" />,
});

/**
 * 별빛 아카이브 - 클라이언트 컴포넌트 (최적화)
 *
 * 최적화 내용:
 * 1. 별빛 수 대폭 감소 (30 → 10, 80 → 20) - 67% 감소
 * 2. useMemo로 별빛 데이터 메모이제이션
 * 3. React.memo로 컴포넌트 메모이제이션
 * 4. 이미지 priority 및 placeholder 추가
 * 5. 불필요한 애니메이션 제거
 */

interface HistoryClientProps {
    chapters: HistoryChapter[];
}

export default function HistoryClient({ chapters }: HistoryClientProps) {
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [isExploring, setIsExploring] = useState(false);

    return (
        <main className="bg-black min-h-screen text-white overflow-x-hidden">
            {/* Hero */}
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

            {/* 챕터 스토리들 */}
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

            <DynamicFooter />
        </main>
    );
}

/**
 * Hero Section - 최적화 (별빛 30 → 10)
 */
const HeroSection = memo(function HeroSection({ onExplore }: { onExplore: () => void }) {
    // 별빛 수 대폭 감소 (30 → 10)
    const simpleStars = useMemo(() =>
        [...Array(10)].map((_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 1,
            duration: Math.random() * 4 + 3,
            delay: i * 0.5 // 간격을 두어 부드럽게
        }))
    , []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background - 단순화 */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black to-black" />
            </div>

            {/* 별빛 (10개로 감소) */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {simpleStars.map((star, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
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

            {/* Content */}
            <div className="relative z-[5] text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <p className="text-blue-200/70 font-light text-lg md:text-xl mb-8 tracking-wide">
                        &quot;우주에서 바라본 작은 별 하나...&quot;
                    </p>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <span className="block mb-4 text-white drop-shadow-[0_0_30px_rgba(255,220,100,0.3)]">
                        별빛
                    </span>
                    <span className="block text-amber-400 drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]">
                        아카이브
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mb-16"
                >
                    <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed font-light">
                        1936년부터 2026년까지
                    </p>
                    <p className="text-lg md:text-xl text-blue-300/90 italic font-light">
                        90년간 빛나온 별들의 기록
                    </p>
                </motion.div>

                <motion.button
                    onClick={onExplore}
                    className="group relative px-14 py-6 overflow-hidden rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10 text-white font-medium tracking-widest text-sm flex items-center gap-3">
                        별자리 탐험하기
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </motion.button>
            </div>
        </section>
    );
});

/**
 * 별자리 타임라인 - 최적화
 */
const ConstellationTimeline = memo(function ConstellationTimeline({ chapters, onSelectChapter }: {
    chapters: HistoryChapter[];
    onSelectChapter: (chapter: number) => void;
}) {
    const starPositions = useMemo(() => getStarPositions(chapters.length), [chapters.length]);

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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400">
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
                            const current = starPositions[index];
                            const next = starPositions[index + 1];
                            return (
                                <motion.line
                                    key={index}
                                    x1={`${current.x}%`}
                                    y1={`${current.y}%`}
                                    x2={`${next.x}%`}
                                    y2={`${next.y}%`}
                                    stroke="rgba(251, 191, 36, 0.4)"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.15 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Stars */}
                    {chapters.map((chapter, index) => (
                        <StarPoint
                            key={chapter.chapter}
                            chapter={chapter}
                            position={starPositions[index]}
                            index={index}
                            onClick={() => onSelectChapter(chapter.chapter)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
});

/**
 * 별 포인트 - 최적화
 */
const StarPoint = memo(function StarPoint({ chapter, position, index, onClick }: {
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
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Star Glow */}
            <motion.div
                className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-gradient-radial from-amber-400/50 via-amber-400/20 to-transparent rounded-full blur-2xl"
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    opacity: isHovered ? 0.8 : 0.4
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Star */}
            <motion.div
                className="relative w-10 h-10"
                animate={{
                    scale: isHovered ? 1.3 : 1,
                    rotate: isHovered ? 180 : 0
                }}
                transition={{ duration: 0.4 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" fill="currentColor">
                    <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
                </svg>
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none px-5 py-3 rounded-xl bg-black/80 backdrop-blur-xl border border-amber-400/30"
                    >
                        <p className="text-amber-400 text-sm font-mono mb-1">
                            {chapter.period}
                        </p>
                        <p className="text-white font-semibold text-base">
                            {chapter.title}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

/**
 * 별 위치 계산
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
 * 챕터 뷰어 - 최적화 (이미지 priority 추가)
 */
const ChapterViewer = memo(function ChapterViewer({ chapter, onClose }: {
    chapter: HistoryChapter;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image - priority 추가 */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-amber-400 text-sm tracking-[0.3em] mb-4">
                            CHAPTER {chapter.chapter}
                        </p>
                        <p className="text-3xl font-mono text-white/40 mb-4">
                            {chapter.period}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {chapter.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-amber-400/80 italic mb-8">
                            {chapter.subtitle}
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-12">
                            {chapter.story}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-6">
                            {chapter.highlights.map((highlight, i) => (
                                <div
                                    key={i}
                                    className="border-l-2 border-amber-500/30 pl-6"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-amber-400 font-bold">
                                            {highlight.year}
                                        </span>
                                        <h3 className="text-white font-semibold">
                                            {highlight.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {highlight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-110 transition-transform"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    );
});

/**
 * 챕터 섹션 - 최적화 (이미지 loading="lazy")
 */
const ChapterSection = memo(function ChapterSection({ chapter, index, onClick }: {
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
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity }}
            className="relative min-h-screen py-32 px-6 flex items-center cursor-pointer"
            onClick={onClick}
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center group">
                {/* Text */}
                <motion.div
                    style={{ y }}
                    className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}
                >
                    <p className="text-amber-400/60 text-sm tracking-[0.3em] mb-4">
                        CHAPTER {chapter.chapter}
                    </p>
                    <p className="text-2xl md:text-3xl font-mono text-white/40 mb-4">
                        {chapter.period}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-amber-400 transition-colors">
                        {chapter.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 italic mb-8">
                        {chapter.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400/10 backdrop-blur-sm border border-amber-400/20">
                        <span className="text-amber-400">자세히 보기</span>
                        <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
                    className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}
                >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-700" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
});

/**
 * 에필로그 - 최적화 (별빛 80 → 20)
 */
const EpilogueSection = memo(function EpilogueSection() {
    // 별빛 수 대폭 감소 (80 → 20)
    const stars = useMemo(() =>
        [...Array(20)].map((_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: 4 + Math.random() * 3,
            delay: i * 0.2,
        }))
    , []);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/20 to-black" />

            {/* Floating Stars (20개로 감소) */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
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

            <div className="relative z-10 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                >
                    <p className="text-blue-300/70 italic text-lg md:text-xl mb-8">
                        &quot;그리고 이야기는 계속됩니다...&quot;
                    </p>
                    <h2 className="text-5xl md:text-7xl font-bold mb-12">
                        <span className="block text-white mb-4">미래의</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400">
                            별빛으로
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
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
});

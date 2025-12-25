'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { historyChapters } from '@/data/historyChapters';
import { Footer } from '@/components/layout/Footer';

/**
 * 별빛 아카이브 - Starlight Archive
 * 별자리처럼 연결된 90년의 이야기를 인터랙티브하게 탐험
 */
export default function HistoryPage() {
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [isExploring, setIsExploring] = useState(false);

    return (
        <main className="bg-black min-h-screen text-white overflow-x-hidden">
            {/* Hero - 우주에서 바라본 지구 */}
            <HeroSection onExplore={() => setIsExploring(true)} />

            {/* 별자리 타임라인 */}
            {isExploring && (
                <ConstellationTimeline
                    chapters={historyChapters}
                    onSelectChapter={setSelectedChapter}
                />
            )}

            {/* 선택된 챕터 상세 뷰 */}
            <AnimatePresence>
                {selectedChapter !== null && (
                    <ChapterViewer
                        chapter={historyChapters[selectedChapter - 1]}
                        onClose={() => setSelectedChapter(null)}
                    />
                )}
            </AnimatePresence>

            {/* 챕터 스토리들 */}
            {isExploring && (
                <div className="relative">
                    {historyChapters.map((chapter, index) => (
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
 * Hero Section - 우주에서 바라본 듯한 시작
 */
function HeroSection({ onExplore }: { onExplore: () => void }) {
    const [stars] = useState(() =>
        [...Array(200)].map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            duration: Math.random() * 3 + 2
        }))
    );

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Space Background */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-black to-black" />

            {/* Stars */}
            <div className="absolute inset-0">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Earth Glow */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                >
                    <p className="text-blue-200/60 font-serif italic text-lg md:text-xl mb-8 tracking-wide">
                        "우주에서 바라본 작은 별 하나..."
                    </p>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                >
                    <span className="block text-white font-serif mb-4">
                        별빛
                    </span>
                    <span className="block bg-gradient-to-r from-blue-200 via-amber-300 to-blue-200 bg-clip-text text-transparent font-serif">
                        아카이브
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="mb-16"
                >
                    <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
                        1936년부터 2026년까지
                    </p>
                    <p className="text-lg md:text-xl text-blue-300/80 italic">
                        90년간 빛나온 별들의 기록
                    </p>
                </motion.div>

                <motion.button
                    onClick={onExplore}
                    className="group relative px-12 py-5 bg-gradient-to-r from-blue-500/20 to-amber-500/20 border border-white/20 rounded-full backdrop-blur-sm overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10 text-white font-light tracking-widest text-sm">
                        별자리 탐험하기
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-amber-500/40"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>
            </div>
        </section>
    );
}

/**
 * 별자리 타임라인 - 인터랙티브 네비게이션
 */
function ConstellationTimeline({ chapters, onSelectChapter }: {
    chapters: typeof historyChapters;
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
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
                        <span className="text-white">별자리를 </span>
                        <span className="bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent">
                            따라서
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg">
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
                                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                />
                            );
                        })}
                        <defs>
                            <linearGradient id="line-gradient">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="50%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#60a5fa" />
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
    chapter: typeof historyChapters[0];
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
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Star Glow */}
            <motion.div
                className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    opacity: isHovered ? 0.6 : 0.3
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-full h-full bg-gradient-radial from-amber-400/40 to-transparent rounded-full blur-xl" />
            </motion.div>

            {/* Star */}
            <motion.div
                className="relative w-8 h-8"
                animate={{
                    scale: isHovered ? 1.3 : 1,
                    rotate: isHovered ? 180 : 0
                }}
                transition={{ duration: 0.6 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400" fill="currentColor">
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
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 rounded-lg px-4 py-3 shadow-xl">
                            <p className="text-amber-400 text-sm font-mono mb-1">
                                {chapter.period}
                            </p>
                            <p className="text-white font-semibold">
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
    // 곡선 형태로 별들을 배치
    return Array.from({ length: count }, (_, i) => {
        const progress = i / (count - 1);
        const x = 15 + progress * 70; // 15% ~ 85%
        const y = 30 + Math.sin(progress * Math.PI) * 40; // 곡선
        return { x, y };
    });
}

/**
 * 챕터 뷰어 - 풀스크린 모달
 */
function ChapterViewer({ chapter, onClose }: {
    chapter: typeof historyChapters[0];
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12">
                    {/* Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-amber-400 text-sm tracking-[0.3em] mb-4">
                            CHAPTER {chapter.chapter}
                        </p>
                        <p className="text-4xl font-mono text-white/40 mb-4">
                            {chapter.period}
                        </p>
                        <h2 className="text-5xl font-bold text-white mb-6 font-serif">
                            {chapter.title}
                        </h2>
                        <p className="text-2xl text-amber-400/80 italic mb-8">
                            {chapter.subtitle}
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-12">
                            {chapter.story}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-6">
                            {chapter.highlights.map((highlight, i) => (
                                <div key={i} className="border-l-2 border-amber-500/30 pl-6">
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
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
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
 * 챕터 섹션 - 스크롤 기반 스토리
 */
function ChapterSection({ chapter, index, onClick }: {
    chapter: typeof historyChapters[0];
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
                    <p className="text-amber-400/60 text-sm tracking-[0.3em] mb-4">
                        CHAPTER {chapter.chapter}
                    </p>
                    <p className="text-3xl font-mono text-white/40 mb-4">
                        {chapter.period}
                    </p>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif group-hover:text-amber-400 transition-colors duration-300">
                        {chapter.title}
                    </h2>
                    <p className="text-xl text-gray-400 italic mb-8">
                        {chapter.subtitle}
                    </p>
                    <button className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>자세히 보기</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>

                {/* Image */}
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
                    className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}
                >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <Image
                            src={chapter.imageUrl}
                            alt={chapter.title}
                            fill
                            className="object-cover grayscale-[0.3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />

            {/* Floating Stars */}
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
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
                    <p className="text-blue-300/60 font-serif italic text-xl mb-8">
                        "그리고 이야기는 계속됩니다..."
                    </p>
                    <h2 className="text-6xl md:text-8xl font-bold mb-12 font-serif">
                        <span className="block text-white mb-4">미래의</span>
                        <span className="block bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent">
                            별빛으로
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-16">
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

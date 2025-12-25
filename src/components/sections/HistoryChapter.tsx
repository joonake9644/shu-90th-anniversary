'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface HistoryChapterProps {
    chapter: number;
    title: string;
    period: string;
    subtitle: string;
    story: string;
    imageUrl: string;
    highlights: Array<{
        year: string;
        title: string;
        description: string;
    }>;
    reverse?: boolean;
}

/**
 * 감동적인 역사 챕터 섹션
 * 서브 페이지 /history 전용
 */
export function HistoryChapter({
    chapter,
    title,
    period,
    subtitle,
    story,
    imageUrl,
    highlights,
    reverse = false
}: HistoryChapterProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.section
            ref={containerRef}
            style={{ opacity }}
            className="relative min-h-screen py-20 md:py-32 overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className={reverse ? 'lg:order-2' : ''}
                    >
                        {/* Chapter Number */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                        >
                            <span className="text-amber-500/60 text-sm tracking-[0.3em] font-light">
                                CHAPTER {chapter}
                            </span>
                            <div className="h-px w-20 bg-amber-500/30 mt-2" />
                        </motion.div>

                        {/* Period */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mb-4"
                        >
                            <span className="text-3xl md:text-4xl font-bold text-white/40 font-mono">
                                {period}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            <span className="text-white font-serif">{title}</span>
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="text-xl md:text-2xl text-amber-400/80 mb-8 font-light italic"
                        >
                            {subtitle}
                        </motion.p>

                        {/* Story */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mb-12"
                        >
                            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                {story}
                            </p>
                        </motion.div>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="space-y-6"
                        >
                            {highlights.map((highlight, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="border-l-2 border-amber-500/30 pl-6 py-2"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-amber-500 font-bold text-lg">
                                            {highlight.year}
                                        </span>
                                        <h3 className="text-white font-semibold">
                                            {highlight.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {highlight.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className={`relative ${reverse ? 'lg:order-1' : ''}`}
                    >
                        <motion.div
                            style={{ y: imageY }}
                            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Image */}
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover grayscale-[0.3] contrast-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent mix-blend-overlay" />

                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                            <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />
                        </motion.div>

                        {/* Decorative Elements */}
                        <div className="absolute -z-10 top-8 -right-8 w-full h-full border border-amber-500/20 rounded-2xl" />
                        <div className="absolute -z-20 -bottom-8 -left-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>

            {/* Decorative Line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        </motion.section>
    );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { getPublicHistoryStoryActs } from '@/lib/firestore/public/historyStory';
import type { HistoryStoryAct } from '@/lib/firestore/admin/historyStory';

// Fallback 데이터 (Firestore 오류 시 사용)
const fallbackActs: HistoryStoryAct[] = [
    {
        id: 'prologue',
        actType: 'prologue',
        order: 0,
        prologueNarrative1: 'In the deepest darkness...',
        prologueNarrative2: 'A light awakens',
        prologueYear: '1936',
        prologueYearSubtitle: 'The Spark of Compassion',
        enabled: true,
    },
    {
        id: 'act1',
        actType: 'act1',
        order: 1,
        actImageUrl: 'https://images.unsplash.com/photo-1516570161687-0b1a7742d87a?q=80&w=1200&auto=format&fit=crop',
        actTitleEn: 'ACT 1: HARDSHIP',
        actTitleKr: '고난, 그 깊은 뿌리',
        actDescription: '전쟁과 폐허 속에서도 꺼지지 않았던 등불.\n류제한 박사의 천막 병원은 절망을 희망으로 바꾸는\n거룩한 성소였습니다.',
        act1PeriodLabel: '1936 - 1953 · The Era of Endurance',
        act1BackgroundText: 'ROOTS',
        enabled: true,
    },
    {
        id: 'act2',
        actType: 'act2',
        order: 2,
        actTitleEn: 'ACT 2: FOREST OF TRUTH',
        actTitleKr: '진리의 숲을 이루다',
        actDescription: '한 그루의 나무가 숲이 되기까지,\n우리는 멈추지 않고 자라났습니다.',
        act2YearLabels: ['Year 1960', 'Year 1970', 'Year 1980', 'Year 1990'],
        act2BackgroundColor: '#1a1815',
        enabled: true,
    },
    {
        id: 'act3',
        actType: 'act3',
        order: 3,
        actTitleEn: 'ACT 3: PRISM OF LOVE',
        actTitleKr: '세상으로 번지는\n사랑의 빛',
        act3BadgeText: 'Global Impact',
        act3MapLabel: 'Connecting The World',
        enabled: true,
    },
    {
        id: 'epilogue',
        actType: 'epilogue',
        order: 4,
        epilogueSubtitleEn: 'Our Promise',
        epilogueTitleKr: '100년을 향한 약속',
        epilogueDescription: '지난 90년의 역사가 그러했듯,\n앞으로의 100년도 변함없는 사랑으로\n세상을 비추겠습니다.',
        epilogueButtonText: 'Join the Journey',
        enabled: true,
    },
];

export default function HistoryStory() {
    const [acts, setActs] = useState<HistoryStoryAct[]>(fallbackActs);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActs = async () => {
            try {
                const data = await getPublicHistoryStoryActs();
                if (data && data.length > 0) {
                    setActs(data);
                }
            } catch (error) {
                console.error('Error loading history story acts:', error);
                // Fallback 사용
            } finally {
                setLoading(false);
            }
        };

        loadActs();
    }, []);

    // Acts를 타입별로 찾기 (Helper 함수)
    const getAct = (actType: string): HistoryStoryAct | undefined => {
        return acts.find(act => act.actType === actType);
    };

    const prologue = getAct('prologue');
    const act1 = getAct('act1');
    const act2 = getAct('act2');
    const act3 = getAct('act3');
    const epilogue = getAct('epilogue');
    const containerRef = useRef<HTMLDivElement>(null);

    // Overall scroll progress for the story container
    // Optimization: Start slightly earlier and end slightly earlier to ensure full visibility
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --- STAGE 1: FAST ENTRY (0% - 20%) ---
    // "90 Year History First Sentence" -> Spark Appearance
    // Narrative 1: "Darkness" - Rapid appearance at the very start
    const text1Opacity = useTransform(scrollYProgress, [0.02, 0.05, 0.08, 0.10], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0.02, 0.10], ["20px", "-10px"]);

    // Spark: Appears in the 10-20% range (Fast)
    const sparkScale = useTransform(scrollYProgress, [0.10, 0.15, 0.20], [0.5, 1, 30]);
    const sparkOpacity = useTransform(scrollYProgress, [0.10, 0.15, 0.20], [0, 1, 0]);
    const sparkGlow = useTransform(scrollYProgress, [0.10, 0.20], ["0px", "40px"]);

    // --- STAGE 2: SLOW APPRECIATION (20% - 100%) ---
    // Spark -> "In Memory" -> History Years -> Acts

    // Narrative 2: "Hope" - Bridge to 1936
    const text2Opacity = useTransform(scrollYProgress, [0.15, 0.18, 0.22, 0.25], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.15, 0.25], ["20px", "-10px"]);

    // Main Title: 1936 - The Anchor
    const text1936Scale = useTransform(scrollYProgress, [0.20, 0.30], [0.8, 1.2]);
    const text1936Opacity = useTransform(scrollYProgress, [0.20, 0.25, 0.30, 0.35], [0, 1, 1, 0]);

    // Prologue Fade Out
    const prologueOpacity = useTransform(scrollYProgress, [0, 0.30, 0.35], [1, 1, 0]);

    // ACT 1: HARDSHIP (35% - 50%)
    const act1Opacity = useTransform(scrollYProgress, [0.35, 0.40, 0.48, 0.50], [0, 1, 1, 0]);
    const act1X = useTransform(scrollYProgress, [0.35, 0.50], ["5%", "-5%"]);

    // ACT 2: FOREST OF TRUTH (50% - 70%)
    const act2Opacity = useTransform(scrollYProgress, [0.50, 0.55, 0.65, 0.70], [0, 1, 1, 0]);
    const treePathLength = useTransform(scrollYProgress, [0.52, 0.68], [0, 1]);

    // ACT 3: PRISM OF LOVE (70% - 85%)
    const act3Opacity = useTransform(scrollYProgress, [0.70, 0.75, 0.82, 0.85], [0, 1, 1, 0]);
    const prismRotate = useTransform(scrollYProgress, [0.70, 0.85], [0, 180]);
    const prismScale = useTransform(scrollYProgress, [0.70, 0.80], [0.5, 1.2]);

    // EPILOGUE: PROMISE (85% - 100%)
    const epilogueOpacity = useTransform(scrollYProgress, [0.85, 0.90], [0, 1]);
    const circleScale = useTransform(scrollYProgress, [0.88, 1], [0.1, 4]);
    const starOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

    // State for random values to avoid hydration mismatch
    const [worldPoints, setWorldPoints] = React.useState<{ top: string, left: string, delay: number }[]>([]);
    const [stars, setStars] = React.useState<{ top: string, left: string, delay: number, duration: number }[]>([]);

    React.useEffect(() => {
        // Generate world points on client side
        setWorldPoints([...Array(8)].map((_, i) => ({
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            delay: i * 0.5
        })));

        // Generate stars on client side
        setStars([...Array(50)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 2 // Varible duration 2-4s
        })));
    }, []);

    return (
        <div ref={containerRef} className="relative bg-black text-white w-full h-[350vh]">
            {/* --- STICKY CANVAS --- */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

                {/* PROLOGUE LAYER */}
                <motion.div style={{ opacity: prologueOpacity }} className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black">

                    {/* Narrative 1: Darkness */}
                    <motion.div
                        style={{ opacity: text1Opacity, y: text1Y }}
                        className="absolute top-[40%] text-center z-10"
                    >
                        <p className="text-white/40 font-serif italic text-lg tracking-widest">
                            {prologue?.prologueNarrative1 || 'In the deepest darkness...'}
                        </p>
                    </motion.div>

                    {/* Narrative 2: Awakening */}
                    <motion.div
                        style={{ opacity: text2Opacity, y: text2Y }}
                        className="absolute top-[40%] text-center z-10"
                    >
                        <p className="text-amber-100/60 font-serif italic text-lg tracking-widest">
                            {prologue?.prologueNarrative2 || 'A light awakens'}
                        </p>
                    </motion.div>

                    {/* The Spark */}
                    <motion.div
                        style={{
                            scale: sparkScale,
                            opacity: sparkOpacity,
                            boxShadow: useTransform(sparkGlow, (v: string) => `0 0 ${v} 4px rgba(251,191,36,0.6)`)
                        }}
                        className="w-1 h-1 md:w-2 md:h-2 bg-amber-100 rounded-full z-20"
                    />

                    {/* The Title: 1936 */}
                    <motion.h1
                        style={{ scale: text1936Scale, opacity: text1936Opacity }}
                        className="absolute text-8xl md:text-[12rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-white to-amber-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] z-30"
                    >
                        {prologue?.prologueYear || '1936'}
                    </motion.h1>
                    <motion.p
                        style={{ opacity: text1936Opacity }}
                        className="absolute top-[65%] text-amber-100/60 font-serif tracking-widest uppercase text-sm"
                    >
                        {prologue?.prologueYearSubtitle || 'The Spark of Compassion'}
                    </motion.p>
                </motion.div>

                {/* ACT 1: HARDSHIP (The Roots) */}
                <motion.div style={{ opacity: act1Opacity }} className="absolute inset-0 z-40 bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {/* Background Grain/Noise Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                    <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-8">
                        {/* Content Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <motion.div style={{ x: act1X }} className="relative">
                                <div className="relative aspect-[4/5] bg-gray-800 overflow-hidden grayscale contrast-125 rounded-sm border border-white/10 shadow-2xl">
                                    <Image
                                        src={act1?.actImageUrl || 'https://images.unsplash.com/photo-1516570161687-0b1a7742d87a?q=80&w=1200&auto=format&fit=crop'}
                                        alt="Hardship"
                                        fill
                                        className="object-cover opacity-60"
                                    />
                                    {/* Gold Glow on Subject (Simulated) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] mix-blend-color-dodge"></div>
                                </div>
                                <div className="absolute -bottom-8 -right-8 text-9xl font-bold text-white/5 z-0 select-none">
                                    {act1?.act1BackgroundText || 'ROOTS'}
                                </div>
                            </motion.div>

                            <div className="z-10 space-y-6 text-left">
                                <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight whitespace-pre-line">
                                    {act1?.actTitleKr || '고난, 그 깊은 뿌리'}
                                </h2>
                                <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light whitespace-pre-line">
                                    {act1?.actDescription || '전쟁과 폐허 속에서도 꺼지지 않았던 등불.\n류제한 박사의 천막 병원은 절망을 희망으로 바꾸는\n거룩한 성소였습니다.'}
                                </p>
                                <div className="w-12 h-[1px] bg-amber-500/50 my-8"></div>
                                <p className="text-sm text-white/40 font-mono uppercase tracking-widest">
                                    {act1?.act1PeriodLabel || '1936 - 1953 · The Era of Endurance'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ACT 2: FOREST OF TRUTH (Growth) */}
                <motion.div
                    style={{
                        opacity: act2Opacity,
                        backgroundColor: act2?.act2BackgroundColor || '#1a1815'
                    }}
                    className="absolute inset-0 z-30 flex items-center justify-center">

                    {/* SVG Growth Animation */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
                        <motion.path
                            d="M 200,1000 Q 400,500 200,0"
                            fill="none"
                            stroke="#d4cbb8"
                            strokeWidth="2"
                            style={{ pathLength: treePathLength }}
                        />
                        <motion.path
                            d="M 600,1000 Q 500,500 600,0"
                            fill="none"
                            stroke="#d4cbb8"
                            strokeWidth="1"
                            style={{ pathLength: treePathLength }}
                        />
                        <motion.path
                            d="M 1000,1000 Q 1200,600 1000,0"
                            fill="none"
                            stroke="#d4cbb8"
                            strokeWidth="3"
                            style={{ pathLength: treePathLength }}
                        />
                    </svg>

                    <div className="relative z-10 text-center max-w-4xl px-6">
                        <h2 className="text-5xl md:text-7xl font-bold text-[#d4cbb8] mb-8 font-serif whitespace-pre-line">
                            {act2?.actTitleKr || '진리의 숲을 이루다'}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 opacity-80">
                            {(act2?.act2YearLabels || ['Year 1960', 'Year 1970', 'Year 1980', 'Year 1990']).map((yearLabel, i) => (
                                <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center group hover:bg-white/10 transition-colors">
                                    <span className="text-2xl font-light text-white/30 group-hover:text-white/80 transition-colors">{yearLabel}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xl md:text-2xl text-[#d4cbb8]/70 mt-12 font-light font-serif whitespace-pre-line">
                            {act2?.actDescription || '한 그루의 나무가 숲이 되기까지,\n우리는 멈추지 않고 자라났습니다.'}
                        </p>
                    </div>
                </motion.div>

                {/* ACT 3: PRISM OF LOVE (Expansion) */}
                <motion.div style={{ opacity: act3Opacity }} className="absolute inset-0 z-20 bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center overflow-hidden">
                    {/* Prism Effect */}
                    <motion.div
                        style={{ rotate: prismRotate, scale: prismScale }}
                        className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 blur-[60px] animate-pulse"
                    />

                    <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
                        <div className="mb-12">
                            <span className="inline-block py-1 px-3 rounded-full border border-blue-400/30 text-blue-300 text-xs tracking-widest uppercase bg-blue-500/10 backdrop-blur-md">
                                {act3?.act3BadgeText || 'Global Impact'}
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white text-center leading-tight mb-8 whitespace-pre-line">
                            {act3?.actTitleKr || '세상으로 번지는\n사랑의 빛'}
                        </h2>

                        {/* Simulated World Map Points */}
                        <div className="w-full h-64 md:h-96 relative border-t border-b border-white/10 mt-8 flex items-center justify-center">
                            <p className="text-white/20 text-lg tracking-[1em] uppercase">{act3?.act3MapLabel || 'Connecting The World'}</p>

                            {/* Random light points */}
                            {worldPoints.map((point, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-blue-400 rounded-full blur-[1px] shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                                    transition={{ duration: 3, delay: point.delay, repeat: Infinity }}
                                    style={{
                                        top: point.top,
                                        left: point.left
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* EPILOGUE: PROMISE (Future) */}
                <motion.div style={{ opacity: epilogueOpacity }} className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center overflow-hidden">
                    {/* Starfield */}
                    <div className="absolute inset-0">
                        {stars.map((star, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    opacity: starOpacity,
                                    top: star.top,
                                    left: star.left
                                }}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} // Simplified animation for cleaner loop
                                transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
                            />
                        ))}
                    </div>

                    {/* The Circle Door */}
                    <motion.div
                        style={{ scale: circleScale }}
                        className="absolute w-[30vh] h-[30vh] rounded-full border-[1px] border-white/80 shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                    />

                    <div className="relative z-20 text-center">
                        <h3 className="text-2xl md:text-3xl text-white/60 font-light mb-4 tracking-widest uppercase">
                            {epilogue?.epilogueSubtitleEn || 'Our Promise'}
                        </h3>
                        <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter">
                            {epilogue?.epilogueTitleKr || '100년을 향한 약속'}
                        </h1>
                        <p className="text-lg text-white/80 max-w-lg mx-auto leading-relaxed whitespace-pre-line">
                            {epilogue?.epilogueDescription || '지난 90년의 역사가 그러했듯,\n앞으로의 100년도 변함없는 사랑으로\n세상을 비추겠습니다.'}
                        </p>
                        <button className="mt-12 px-8 py-4 bg-white text-black text-sm font-bold tracking-widest hover:bg-white/90 transition-colors uppercase">
                            {epilogue?.epilogueButtonText || 'Join the Journey'}
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

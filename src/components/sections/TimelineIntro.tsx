'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from 'next/image';
import { getPublicTimelineIntroContent } from '@/lib/firestore/public/timelineIntro';
import type { TimelineIntroContent } from '@/lib/firestore/admin/timelineIntro';

// Fallback 데이터
const fallbackContent: TimelineIntroContent = {
  id: 'main',
  year1936Text: '1936',
  quoteEnglish: 'I never treated anyone with neglect.\nWhether treating Dr. Syngman Rhee or a country woman,\nI always gave my utmost effort.',
  quoteKorean: '나는 어느 누구도 소홀히 치료하지 않았습니다.\n이승만 박사를 치료할 때나 시골의 아낙네를 치료할 때나\n똑같이 나의 최선의 노력을 바쳤습니다.',
  attribution: 'George Henry Rue. M.D (고 류제한 박사 1899-1993)',
  titleLeft: 'History',
  titleRight: '90 Years'
};

export function TimelineIntro() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<TimelineIntroContent>(fallbackContent);

    // Firestore에서 콘텐츠 로드
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getPublicTimelineIntroContent();
                if (data) {
                    setContent(data);
                }
            } catch (error) {
                console.error('Error loading timeline intro:', error);
            }
        };
        loadContent();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef, // Fixed: use target for window scroll tracking
        offset: ["start start", "end end"]
    });

    // 1. The Central Line (Draws downwards to a specific point)
    // Stops at 75% of screen height to leave room for the quote at 80%
    const lineHeight = useTransform(scrollYProgress, [0.05, 0.25], ["0%", "75%"]);
    const lineOpacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]);

    // 2.5 Dr. Rue Quote (Appears directly below the line's end point)
    // Line ends at 75%, Quote starts appearing at 80%
    // EXTENDED VISIBILITY: Quote stays visible longer (until 0.8) to overlap with the new beam
    const quoteOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.65, 0.8], [0, 1, 1, 0]);
    const quoteBlur = useTransform(scrollYProgress, [0.28, 0.38, 0.65, 0.8], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]);
    const quoteScale = useTransform(scrollYProgress, [0.28, 0.8], [0.95, 1.1]);

    // Particle/Star Dust Effect - Synchronized with quote area
    const particleOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.65, 0.8], [0, 0.6, 0.6, 0]);

    // 2.7 Transition to 1936 (New Line + Text) - "The Spark of History"
    // TIMING ADJUSTED: Starts at 0.65 (OVERLAPPING with Quote)
    // This creates the effect that the line is emerging AS the quote fades
    const line2Height = useTransform(scrollYProgress, [0.65, 0.8], ["0%", "50%"]); // Beam drops from top
    const line2Width = useTransform(scrollYProgress, [0.65, 0.8], ["0px", "6px"]); // Starts invisible, becomes thick beam
    const line2Opacity = useTransform(scrollYProgress, [0.65, 0.7, 0.85], [0, 1, 0]); // Fades in quickly

    const text1936Opacity = useTransform(scrollYProgress, [0.78, 0.82, 0.9], [0, 1, 0]);
    const text1936Scale = useTransform(scrollYProgress, [0.78, 0.85, 0.95], [0.5, 2.0, 4.0]); // Aggressive zoom
    const text1936Blur = useTransform(scrollYProgress, [0.78, 0.82, 0.95], ["blur(10px)", "blur(0px)", "blur(20px)"]);

    // 3. Text Expansion (Splits outward) - Starts after quote fades
    const textGap = useTransform(scrollYProgress, [0.75, 0.9], ["0px", "20px"]);
    const textOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
    const textBlur = useTransform(scrollYProgress, [0.75, 0.9], ["blur(10px)", "blur(0px)"]);

    // 4. Image Bloom Effect
    const imgScale = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
    const imgOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 0.9]);

    // Define 6 distinct paths for the 6 eras

    // Era 1: Beginning (Top Left)
    const img1X = useTransform(scrollYProgress, [0.85, 1.1], [0, -320]);
    const img1Y = useTransform(scrollYProgress, [0.85, 1.1], [0, -250]);
    const img1Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, -15]);

    // Era 2: Reconstruction (Top Right)
    const img2X = useTransform(scrollYProgress, [0.85, 1.1], [0, 320]);
    const img2Y = useTransform(scrollYProgress, [0.85, 1.1], [0, -250]);
    const img2Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, 15]);

    // Era 3: Growth (Mid Left)
    const img3X = useTransform(scrollYProgress, [0.85, 1.1], [0, -420]);
    const img3Y = useTransform(scrollYProgress, [0.85, 1.1], [0, 0]);
    const img3Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, -8]);

    // Era 4: Take-off (Mid Right)
    const img4X = useTransform(scrollYProgress, [0.85, 1.1], [0, 420]);
    const img4Y = useTransform(scrollYProgress, [0.85, 1.1], [0, 0]);
    const img4Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, 8]);

    // Era 5: Innovation (Bottom Left)
    const img5X = useTransform(scrollYProgress, [0.85, 1.1], [0, -280]);
    const img5Y = useTransform(scrollYProgress, [0.85, 1.1], [0, 250]);
    const img5Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, -20]);

    // Era 6: Future Vision (Bottom Right)
    const img6X = useTransform(scrollYProgress, [0.85, 1.1], [0, 280]);
    const img6Y = useTransform(scrollYProgress, [0.85, 1.1], [0, 250]);
    const img6Rotate = useTransform(scrollYProgress, [0.85, 1.1], [0, 20]);

    // 5. Special Effect: "The Ignition" 
    const sparkY = useTransform(scrollYProgress, [0, 0.05], ["-20vh", "0vh"]);
    const sparkOpacity = useTransform(scrollYProgress, [0, 0.04, 0.05], [0, 1, 0]);

    // Glow that persists briefly
    const centerGlowOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-black text-white overflow-hidden">

            <div className="sticky top-0 h-screen flex flex-col items-center justify-center">

                {/* Special Effect: Spark (Ripple removed) */}
                <motion.div
                    style={{ y: sparkY, opacity: sparkOpacity }}
                    className="absolute z-50 w-2 h-16 bg-gradient-to-b from-transparent via-white to-white rounded-full blur-[2px] shadow-[0_0_20px_white]"
                />

                {/* Ripple removed */}

                <motion.div
                    style={{ opacity: centerGlowOpacity }}
                    className="absolute z-30 w-64 h-64 bg-white/10 rounded-full blur-[60px]"
                />

                {/* Central Glowing Line (No Tip Sparkle) */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-white/5 overflow-visible z-20 flex flex-col items-center">
                    <motion.div
                        style={{ height: lineHeight, opacity: lineOpacity }}
                        className="w-full bg-gradient-to-b from-transparent via-white to-white shadow-[0_0_15px_rgba(255,255,255,0.8)] relative"
                    />
                </div>

                {/* Floating Particles (Dust/Memory Effect) - Ambient */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            style={{
                                opacity: particleOpacity,
                                top: `${75 + (i * 2)}%`,
                                left: `${25 + (i * 5)}%`
                            }}
                            animate={{
                                y: [0, -30, 0],
                                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                                scale: [0.5, 1.2, 0.5],
                                opacity: [0.3, 0.7, 0.3]
                            }}
                            transition={{
                                duration: 4 + (i % 3),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3
                            }}
                            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"
                        />
                    ))}
                </div>

                {/* 1936 Transition Line & Text (The "Connective Tissue" to History) */}
                <div className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none z-30">
                    {/* The Line - Drops from Top to Center */}
                    <motion.div
                        style={{ height: line2Height, width: line2Width, opacity: line2Opacity }}
                        className="bg-gradient-to-b from-transparent via-white to-white shadow-[0_0_30px_rgba(255,255,255,0.8)] rounded-full box-border border-x border-white/50"
                    />

                    {/* The Text "1936" - Appears at the end of the line (Center) */}
                    <motion.div
                        style={{ opacity: text1936Opacity, scale: text1936Scale, filter: text1936Blur }}
                        className="absolute top-[50%] -translate-y-1/2 text-7xl md:text-9xl font-bold tracking-[0.1em] text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)] mix-blend-screen"
                    >
                        {content.year1936Text}
                    </motion.div>
                </div>

                {/* Dr. Rue Quote (Appears mysteriously from memory) */}
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
          .font-pinyon { font-family: 'Pinyon Script', cursive; }
        `}</style>
                <motion.div
                    style={{ opacity: quoteOpacity, filter: quoteBlur, scale: quoteScale }}
                    className="absolute top-[80%] z-40 max-w-5xl text-center px-6 pointer-events-none mix-blend-screen -translate-x-1/2 left-1/2 w-full"
                >
                    {/* English Quote - Cursive Style */}
                    <h4 className="text-3xl md:text-5xl font-pinyon text-white/95 mb-10 leading-relaxed drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                        &quot;{content.quoteEnglish.split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < arr.length - 1 && <br className="hidden md:block" />}
                            </React.Fragment>
                        ))}&quot;
                    </h4>

                    {/* Korean Translation */}
                    <p className="text-xl md:text-2xl font-light text-white/90 mb-8 font-serif leading-relaxed drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                        &quot;{content.quoteKorean.split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < arr.length - 1 && <br className="hidden md:block" />}
                            </React.Fragment>
                        ))}&quot;
                    </p>

                    {/* Attribution */}
                    <p className="text-sm md:text-base text-white/70 uppercase tracking-[0.2em] border-t border-white/40 inline-block pt-4 mt-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        {content.attribution}
                    </p>
                </motion.div>

                {/* Expanding Era Title */}
                <motion.div
                    style={{ gap: textGap, opacity: textOpacity, filter: textBlur }}
                    className="relative z-20 flex flex-col md:flex-row items-center justify-center text-center mix-blend-difference"
                >
                    <h3 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white">
                        {content.titleLeft}
                    </h3>
                    <span className="hidden md:block w-2 h-2 rounded-full bg-white/50 mx-4" />
                    <h3 className="text-3xl md:text-5xl font-bold tracking-widest text-white">
                        {content.titleRight}
                    </h3>
                </motion.div>

                {/* Floating Historical Images (Bloom Effect - 6 Eras) */}
                <div className="absolute w-full h-full pointer-events-none flex items-center justify-center z-10">

                    {/* 1. Beginning (태동기) */}
                    <motion.div
                        style={{ x: img1X, y: img1Y, rotate: img1Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-40 h-56 md:w-56 md:h-72 bg-gray-800 border border-white/10 rounded-sm overflow-hidden mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zcGl0YWwlMjAxOTMwc3xlbnwxfHx8fDE3NjU5NjM2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="태동기"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-xs text-white/50 font-light tracking-widest uppercase mb-0.5">Beginning</span>
                                <h4 className="text-sm md:text-lg font-bold text-white tracking-wider">태동기</h4>
                                <span className="block text-[10px] text-white/70 font-mono mt-1">1936-1946</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Reconstruction (정착·재건기) */}
                    <motion.div
                        style={{ x: img2X, y: img2Y, rotate: img2Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-40 h-56 md:w-56 md:h-72 bg-gray-800 border border-white/10 rounded-sm overflow-hidden mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1717995045633-2579ba884150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBtZWRpY2FsJTIwc2Nob29sJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1OTYzNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="정착·재건기"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-xs text-white/50 font-light tracking-widest uppercase mb-0.5">Reconstruction</span>
                                <h4 className="text-sm md:text-lg font-bold text-white tracking-wider">정착·재건기</h4>
                                <span className="block text-[10px] text-white/70 font-mono mt-1">1947-1956</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Growth (성장기) */}
                    <motion.div
                        style={{ x: img3X, y: img3Y, rotate: img3Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-44 h-60 md:w-64 md:h-80 bg-gray-800 border border-white/10 rounded-sm overflow-hidden z-10 mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1589982334488-2ce2b65244ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdW5pdmVyc2l0eSUyMGNhbXB1c3xlbnwxfHx8fDE3NjU5NjM2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="성장기"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-xs text-white/50 font-light tracking-widest uppercase mb-0.5">Growth</span>
                                <h4 className="text-sm md:text-lg font-bold text-white tracking-wider">성장기</h4>
                                <span className="block text-[10px] text-white/70 font-mono mt-1">1957-1996</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Take-off (도약기) */}
                    <motion.div
                        style={{ x: img4X, y: img4Y, rotate: img4Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-44 h-60 md:w-64 md:h-80 bg-gray-800 border border-white/10 rounded-sm overflow-hidden z-10 mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1679653226697-2b0fbf7c17f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="도약기"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-xs text-white/50 font-light tracking-widest uppercase mb-0.5">Take-off</span>
                                <h4 className="text-sm md:text-lg font-bold text-white tracking-wider">도약기</h4>
                                <span className="block text-[10px] text-white/70 font-mono mt-1">1997-2016</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. Innovation (혁신·융합기) */}
                    <motion.div
                        style={{ x: img5X, y: img5Y, rotate: img5Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-40 h-56 md:w-56 md:h-72 bg-gray-800 border border-white/10 rounded-sm overflow-hidden mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1695048441421-369a04a8df27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaGVhbHRoY2FyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="혁신·융합기"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-xs text-white/50 font-light tracking-widest uppercase mb-0.5">Innovation</span>
                                <h4 className="text-sm md:text-lg font-bold text-white tracking-wider">혁신·융합기</h4>
                                <span className="block text-[10px] text-white/70 font-mono mt-1">2017-2024</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 6. Future (미래비전) */}
                    <motion.div
                        style={{ x: img6X, y: img6Y, rotate: img6Rotate, scale: imgScale, opacity: imgOpacity }}
                        className="absolute flex flex-col items-center"
                    >
                        <div className="w-40 h-56 md:w-56 md:h-72 bg-gray-800 border border-white/10 rounded-sm overflow-hidden mb-2 relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1612886649688-ef2912f17921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbWVkaWNhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="미래비전"
                                fill
                                className="object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="block text-[10px] md:text-xs text-white/50 font-light tracking-wide uppercase mb-0.5">Future Vision</span>
                                <h4 className="text-xs md:text-lg font-bold text-white tracking-wide">미래비전</h4>
                                <span className="block text-[9px] md:text-[10px] text-white/70 font-mono mt-0.5">2025-2036</span>
                            </div>
                        </div>
                    </motion.div>

                </div>

                <motion.p
                    style={{ opacity: textOpacity }}
                    className="absolute bottom-12 text-xs md:text-sm text-gray-500 tracking-[0.5em] uppercase text-center"
                >
                    Scroll to explore 90 years
                </motion.p>

            </div>
        </div>
    );
}

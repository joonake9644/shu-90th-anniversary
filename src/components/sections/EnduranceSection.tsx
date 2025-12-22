'use client';

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from 'next/image';

export function EnduranceSection() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center bg-black text-white overflow-hidden"
        >
            {/* Background Image - Left Side */}
            <motion.div
                style={{ scale: imageScale }}
                className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200"
                        alt="Historical Building"
                        fill
                        className="object-cover grayscale opacity-40"
                    />
                    <div className="absolute top-8 left-8">
                        <span className="text-xs tracking-[0.2em] text-white/60 uppercase">Hardship</span>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
            </motion.div>

            {/* Content - Right Side */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="ml-auto max-w-2xl">
                    <motion.div
                        style={{ y: textY, opacity: textOpacity }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            <span className="text-orange-400">고난</span>, 그 깊은 뿌리
                        </h2>

                        <div className="space-y-4 text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                            <p>전쟁과 폐허 속에서도 꺾지지 않았던 등불,</p>
                            <p>뮤제와 박사의 전인 병원은 절망을 희망으로 바꾸는</p>
                            <p>기적의 씨앗이었습니다.</p>
                        </div>

                        <div className="text-sm tracking-[0.2em] text-white/50 uppercase">
                            1936 ~ 1953 - THE ERA OF ENDURANCE
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Page Navigation Dots - Right Side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === 0 ? 'bg-orange-400 h-3' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

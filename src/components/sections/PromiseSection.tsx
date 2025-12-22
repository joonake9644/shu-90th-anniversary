'use client';

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

export function PromiseSection() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const circleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden"
        >
            {/* Large Circle Background */}
            <motion.div
                style={{ scale: circleScale }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="relative w-[90vmin] h-[90vmin]">
                    {/* Outer Glow Ring */}
                    <div className="absolute inset-0 rounded-full border border-white/20 blur-sm" />

                    {/* Main Ring */}
                    <div className="absolute inset-0 rounded-full border border-white/30" />

                    {/* Inner Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/5 via-transparent to-transparent" />

                    {/* Subtle Particles */}
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/20 rounded-full"
                                style={{
                                    left: `${50 + 45 * Math.cos((i / 20) * 2 * Math.PI)}%`,
                                    top: `${50 + 45 * Math.sin((i / 20) * 2 * Math.PI)}%`,
                                }}
                                animate={{
                                    opacity: [0.2, 0.6, 0.2],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    style={{ opacity: contentOpacity }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">
                            OUR PROMISE
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold mb-12 leading-tight"
                    >
                        100년을 향한 약속
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12"
                    >
                        지난 90년의 역사가 그러했듯,<br />
                        앞으로의 100년도 변함없는 사랑으로<br />
                        세상을 비추겠습니다.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <button className="px-12 py-4 bg-white text-black font-semibold tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors duration-300">
                            JOIN THE JOURNEY
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Page Navigation Dots - Right Side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === 3 ? 'bg-white h-3' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

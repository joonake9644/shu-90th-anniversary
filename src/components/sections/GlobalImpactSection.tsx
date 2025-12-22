'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

export function GlobalImpactSection() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    // Pre-calculate connection points data using useState
    const [connectionPoints] = useState(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            duration: 2 + Math.random() * 2,
            delay: i * 0.3,
        }))
    );

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, #000000 0%, #0a1929 50%, #000000 100%)'
            }}
        >
            {/* Animated Connection Points */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Connection Lines and Dots */}
                {connectionPoints.map((point) => (
                    <motion.div
                        key={point.id}
                        className="absolute w-2 h-2 rounded-full bg-blue-400/60"
                        style={{
                            left: point.left,
                            top: point.top,
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: point.duration,
                            repeat: Infinity,
                            delay: point.delay,
                        }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-blue-400/40 blur-md scale-150" />
                    </motion.div>
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <motion.line
                        x1="30%" y1="30%" x2="70%" y2="50%"
                        stroke="url(#gradient1)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.line
                        x1="50%" y1="40%" x2="80%" y2="60%"
                        stroke="url(#gradient1)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
                <motion.div
                    style={{ y: titleY, opacity: titleOpacity }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <div className="inline-block px-6 py-2 border border-blue-400/30 rounded-full text-xs tracking-[0.3em] text-blue-300/80 uppercase mb-8">
                            GLOBAL IMPACT
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-12 leading-tight">
                        세상으로 번지는<br />
                        사랑의 빛
                    </h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        viewport={{ once: true }}
                        className="text-sm md:text-base tracking-[0.4em] text-blue-200/60 uppercase"
                    >
                        CONNECTING THE WORLD
                    </motion.div>
                </motion.div>
            </div>

            {/* Page Navigation Dots - Right Side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === 2 ? 'bg-blue-400 h-3' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

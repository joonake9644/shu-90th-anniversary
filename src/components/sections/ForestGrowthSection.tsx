'use client';

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

const decades = [
    { year: "1960", label: "Year 1960" },
    { year: "1970", label: "Year 1970" },
    { year: "1980", label: "Year 1980" },
    { year: "1990", label: "Year 1990" }
];

export function ForestGrowthSection() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden py-20"
        >
            {/* Decorative Lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute left-0 top-1/4 w-1/3 h-1/2 opacity-10" viewBox="0 0 400 400">
                    <path d="M 0 200 Q 200 0 400 200" stroke="white" strokeWidth="1" fill="none" />
                </svg>
                <svg className="absolute right-0 top-1/3 w-1/3 h-1/2 opacity-10" viewBox="0 0 400 400">
                    <path d="M 0 200 Q 200 400 400 200" stroke="white" strokeWidth="1" fill="none" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    style={{ y: titleY, opacity: titleOpacity }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold mb-16 leading-tight">
                        진리의 숲을 이루다
                    </h2>

                    {/* Decade Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
                        {decades.map((decade, idx) => (
                            <motion.div
                                key={decade.year}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="relative aspect-[3/4] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl md:text-4xl font-light text-white/40 group-hover:text-white/70 transition-colors">
                                            {decade.label}
                                        </span>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                            한 그루의 나무가 숲이 되기까지,<br />
                            우리는 멈추지 않고 자라났습니다.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Page Navigation Dots - Right Side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === 1 ? 'bg-orange-400 h-3' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

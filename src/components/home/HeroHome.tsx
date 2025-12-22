'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function HeroHome() {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };

    // Pre-calculate particle data using useState to avoid purity issues
    const [particles] = useState(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            targetY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }))
    );

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        initial={{
                            x: particle.x,
                            y: particle.y,
                        }}
                        animate={{
                            y: [null, particle.targetY],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4">
                        90
                        <span className="text-blue-400">YEARS</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-300 mb-2">
                        삼육보건대학교
                    </p>
                    <p className="text-xl md:text-2xl text-blue-400 mb-12">
                        1936 - 2026
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mb-8"
                >
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        90년의 빛나는 여정을 함께 걸으며
                        <br />
                        100년을 향한 새로운 미래를 그립니다
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/history"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                        >
                            역사 타임라인 보기
                        </Link>
                        <Link
                            href="/guestbook"
                            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-all transform hover:scale-105"
                        >
                            방명록 남기기
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <button
                        onClick={scrollToContent}
                        className="text-white hover:text-blue-400 transition-colors"
                        aria-label="Scroll down"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ChevronDown size={32} />
                        </motion.div>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const timelinePeriods = [
    {
        year: '1936',
        title: '태동기',
        subtitle: 'Beginning',
        description: '조선삼육학교 설립, 새로운 시작',
    },
    {
        year: '1947',
        title: '정착·재건기',
        subtitle: 'Reconstruction',
        description: '전쟁의 아픔 속에서 재건',
    },
    {
        year: '1957',
        title: '성장기',
        subtitle: 'Growth',
        description: '전문 교육기관으로 성장',
    },
    {
        year: '1997',
        title: '도약기',
        subtitle: 'Take-off',
        description: '명실상부한 보건 명문',
    },
    {
        year: '2017',
        title: '혁신·융합기',
        subtitle: 'Innovation',
        description: '미래를 향한 혁신',
    },
    {
        year: '2025',
        title: '미래 비전',
        subtitle: 'Future Vision',
        description: '100주년을 향한 비전',
    },
];

export function TimelinePreview() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        90년의 여정
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        6개의 시대로 나누어진 삼육보건대학교의 역사
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {timelinePeriods.map((period, index) => (
                        <motion.div
                            key={period.year}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-white/20 transition-all group"
                        >
                            <div className="inline-block px-4 py-2 rounded-lg bg-white/10 text-white font-bold mb-4 group-hover:bg-white/20 transition-all">
                                {period.year}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {period.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-3">
                                {period.subtitle}
                            </p>
                            <p className="text-gray-500">{period.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        href="/history"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                    >
                        전체 타임라인 보기
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

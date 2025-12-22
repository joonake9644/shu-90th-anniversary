'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Clock,
    Award,
    Video,
    BarChart3,
    Archive,
    Calendar,
    Newspaper,
    BookOpen,
} from 'lucide-react';

const sections = [
    {
        title: '역사 타임라인',
        description: '1936년부터 현재까지 90년의 빛나는 여정',
        icon: Clock,
        href: '/history',
    },
    {
        title: '주요 업적',
        description: '삼육보건대학교의 자랑스러운 성과들',
        icon: Award,
        href: '/highlights',
    },
    {
        title: '영상으로 보는 역사',
        description: '생생한 영상으로 만나는 90년의 이야기',
        icon: Video,
        href: '/video-history',
    },
    {
        title: '통계 데이터',
        description: '숫자로 보는 삼육보건대학교의 성장',
        icon: BarChart3,
        href: '/statistics',
    },
    {
        title: '역사 아카이브',
        description: '소중한 추억이 담긴 사진 갤러리',
        icon: Archive,
        href: '/archive',
    },
    {
        title: '기념 행사',
        description: '90주년 기념 행사 및 이벤트 정보',
        icon: Calendar,
        href: '/events',
    },
    {
        title: '뉴스 & 소식',
        description: '최신 소식과 업데이트',
        icon: Newspaper,
        href: '/news',
    },
    {
        title: '방명록',
        description: '모교에 대한 여러분의 소중한 메시지',
        icon: BookOpen,
        href: '/guestbook',
    },
];

export function FeaturedSections() {
    return (
        <section className="py-20 px-4 bg-black">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        90년의 이야기를 탐험하세요
                    </h2>
                    <p className="text-xl text-gray-400">
                        다양한 방법으로 삼육보건대학교의 역사를 경험하세요
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={section.href}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={section.href}
                                    className="block h-full group"
                                >
                                    <div className="h-full bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-white/20 transition-all hover:transform hover:scale-[1.02]">
                                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                                            <Icon className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {section.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {section.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

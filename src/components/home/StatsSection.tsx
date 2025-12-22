'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Award } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '50,000+',
        label: '동문',
        description: '전 세계에서 활약하는 동문',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: GraduationCap,
        value: '5,000+',
        label: '재학생',
        description: '미래의 보건 전문가',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Building2,
        value: '20+',
        label: '학과',
        description: '다양한 보건 전문 분야',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Award,
        value: '90',
        label: '주년',
        description: '자랑스러운 전통과 역사',
        color: 'from-orange-500 to-red-500',
    },
];

export function StatsSection() {
    return (
        <section className="py-20 px-4 bg-black">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        숫자로 보는 삼육보건대학교
                    </h2>
                    <p className="text-xl text-gray-400">
                        90년간 쌓아온 자랑스러운 성과
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div
                                    className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                                >
                                    <Icon className="text-white" size={36} />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xl font-semibold text-gray-300 mb-2">
                                    {stat.label}
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {stat.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

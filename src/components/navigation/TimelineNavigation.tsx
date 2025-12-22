'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEra {
    id: string;
    label?: string;
    korean?: string;
    period: string;
}

const eras: TimelineEra[] = [
    { id: 'era1', label: 'Beginning', korean: '태동기', period: '1936 ~ 1946' },
    { id: 'era2', period: '1947 ~ 1956' },
    { id: 'era3', period: '1957 ~ 1996' },
    { id: 'era4', period: '1997 ~ 2016' },
    { id: 'era5', period: '2017 ~ 2024' },
    { id: 'era6', period: '2025 ~ 2036' },
];

interface TimelineNavigationProps {
    activeEra?: number;
}

export function TimelineNavigation({ activeEra = 0 }: TimelineNavigationProps) {
    return (
        <motion.div
            className="sticky bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-md"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
        >
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
                    {eras.map((era, index) => {
                        const isActive = index === activeEra;

                        return (
                            <div
                                key={era.id}
                                className={`
                                    border-r border-white/10 last:border-r-0 px-4 py-6
                                    transition-all cursor-pointer group
                                    ${isActive ? 'bg-white/5' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}
                                `}
                            >
                                {era.label ? (
                                    <>
                                        <div className={`text-xs md:text-sm font-semibold mb-1 ${
                                            isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                                        }`}>
                                            {era.label} {era.korean && (
                                                <span className={isActive ? 'text-white/80' : 'text-white/40'}>
                                                    {era.korean}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-[10px] md:text-xs ${
                                            isActive ? 'text-white/60' : 'text-white/40'
                                        }`}>
                                            {era.period}
                                        </div>
                                    </>
                                ) : (
                                    <div className={`text-xs md:text-sm font-medium ${
                                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                                    }`}>
                                        {era.period}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

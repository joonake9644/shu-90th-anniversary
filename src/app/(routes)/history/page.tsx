'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { TimelineIntro } from '@/components/sections/TimelineIntro';
import HistoryStory from '@/components/sections/HistoryStory';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { HistoryChapter } from '@/components/sections/HistoryChapter';
import { PeriodSection } from '@/components/sections/PeriodSection';
import { timelineData } from '@/data/timelineData';
import { historyChapters } from '@/data/historyChapters';
import { TimelineProgressBar } from '@/components/layout/TimelineProgressBar';
import { Footer } from '@/components/layout/Footer';

export default function HistoryPage() {
    const [activePeriod, setActivePeriod] = useState<string | null>(null);

    const handleInView = (id: string) => {
        setActivePeriod(id);
    };

    const handlePeriodSelect = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="bg-black min-h-screen text-white pb-20">
            {/* Added pb-20 for bottom bar space */}

            {/* Hero Section - The starting point */}
            <HeroSection />

            {/* Introduction to the Timeline */}
            <TimelineIntro />

            {/* The Scrollytelling Story (High-level narrative) */}
            <HistoryStory />

            {/* Divider */}
            <MarqueeSection text="90년, 사랑과 봉사의 여정" />

            {/* 감동적인 역사 챕터들 */}
            <div className="relative">
                {historyChapters.map((chapter, index) => (
                    <HistoryChapter
                        key={chapter.chapter}
                        {...chapter}
                        reverse={index % 2 === 1}
                    />
                ))}
            </div>

            {/* Divider */}
            <MarqueeSection text="History of 90 Years" />

            {/* Detailed Period Sections */}
            <div className="relative z-10">
                {timelineData.map((period) => (
                    <PeriodSection
                        key={period.id}
                        period={period}
                        onInView={handleInView}
                    />
                ))}
            </div>

            {/* Footer Divider */}
            <MarqueeSection text="Toward 100 Years" direction="right" />

            <Footer />

            <TimelineProgressBar
                periods={timelineData}
                activePeriodId={activePeriod}
                onPeriodSelect={handlePeriodSelect}
            />
        </main>
    );
}

/*
 * ==================================================================================
 * ⚠️ 경고: 이 파일의 구조를 절대 임의로 변경하지 마세요!
 * ==================================================================================
 *
 * 이 파일은 원본 Figma 디자인을 기반으로 한 메인 페이지의 핵심 구조입니다.
 *
 * 🚫 금지 사항:
 * - 컴포넌트의 순서 변경
 * - 컴포넌트 제거 또는 대체
 * - HistoryStory를 별도의 섹션으로 분리
 * - PeriodSection들을 다른 컴포넌트로 교체
 * - 전체 구조를 임의로 재구성
 *
 * ✅ 허용 사항:
 * - 개별 컴포넌트 내부의 스타일 수정
 * - props 추가 및 전달
 * - 애니메이션 파라미터 조정
 *
 * 📋 원본 구조 (반드시 유지):
 * 1. HeroSection - 90 YEARS OF HISTORY
 * 2. TimelineIntro - 1936 강조
 * 3. HistoryStory - 90년 스토리텔링 (4개 Act 통합)
 * 4. MarqueeSection - TRUTH · LOVE · SERVICE
 * 5. PeriodSection × 6 - 6개 시대 섹션
 * 6. Footer
 * 7. TimelineProgressBar (sticky)
 *
 * 변경이 필요한 경우 반드시 사용자에게 확인 후 진행하세요.
 * 원본 참조: 90_year_figma/src/components/pages/HomePage.tsx
 *
 * 자세한 내용은 프로젝트 루트의 RULES.md 파일을 참조하세요.
 * ==================================================================================
 */

'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { TimelineIntro } from '@/components/sections/TimelineIntro';
import HistoryStory from '@/components/sections/HistoryStory';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { PeriodSection } from '@/components/sections/PeriodSection';
import { timelineData } from '@/data/timelineData';
import { TimelineProgressBar } from '@/components/layout/TimelineProgressBar';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
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

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
 * - PeriodSection들을 다른 컴포넌트로 교체
 * - 전체 구조를 임의로 재구성
 *
 * ✅ 허용 사항:
 * - 개별 컴포넌트 내부의 스타일 수정
 * - props 추가 및 전달
 * - 애니메이션 파라미터 조정
 *
 * 📋 원본 구조 (반드시 유지):
 * 1. HeroSection - 90년 스토리텔링 (1936 스파크, Act 1-3, Epilogue 통합)
 * 2. TimelineIntro - 1936 강조
 * 3. MarqueeSection - TRUTH · LOVE · SERVICE
 * 4. PeriodSection × 6 - 6개 시대 섹션
 * 5. Footer
 * 6. TimelineNavigation (sticky)
 *
 * 변경이 필요한 경우 반드시 사용자에게 확인 후 진행하세요.
 * 원본 참조: 90_year_figma/src/components/pages/HomePage.tsx
 *
 * 자세한 내용은 프로젝트 루트의 RULES.md 파일을 참조하세요.
 * ==================================================================================
 */

'use client';

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { TimelineIntro } from '@/components/sections/TimelineIntro';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { PeriodSection } from '@/components/sections/PeriodSection';
import { Footer } from '@/components/layout/Footer';
import { TimelineNavigation } from '@/components/navigation/TimelineNavigation';
import { timelineData } from '@/data/timelineData';

export default function Home() {
    const [activePeriod, setActivePeriod] = React.useState<string | null>(null);

    const handleInView = (id: string) => {
        setActivePeriod(id);
    };

    return (
        <main className="bg-black min-h-screen text-white overflow-x-hidden">
            {/* 1. Hero Section - 90년 스토리텔링 (1936 스파크, Act 1-3, Epilogue 통합) */}
            <HeroSection />

            {/* 2. Timeline Intro - 1936 강조 및 역사 전개 */}
            <TimelineIntro />

            {/* 3. Moving Text Divider */}
            <MarqueeSection
                text="TRUTH · LOVE · SERVICE · 90TH ANNIVERSARY · "
                direction="left"
                speed={1.2}
            />

            {/* 5. Timeline Sections - 6개 시대 */}
            <div className="relative">
                {timelineData.map((period, index) => (
                    <React.Fragment key={period.id}>
                        <PeriodSection
                            period={period}
                            onInView={handleInView}
                        />
                        {/* Add Marquee between sections occasionally */}
                        {index === 1 && (
                            <MarqueeSection
                                text="GLOBAL SHU · HEALTH EXPERTS · "
                                direction="right"
                                speed={2.5}
                            />
                        )}
                        {index === 3 && (
                            <MarqueeSection
                                text="VISION 2030 · INNOVATION · "
                                direction="left"
                                speed={2}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* 6. Footer */}
            <Footer />

            {/* Sticky Timeline Navigation */}
            <TimelineNavigation activeEra={activePeriod ? timelineData.findIndex(p => p.id === activePeriod) : 0} />
        </main>
    );
}

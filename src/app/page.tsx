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
 * - ⚠️ HeroSection.tsx 파일의 디자인 레이아웃을 사용자 허락 없이 절대 변경 금지
 * - ⚠️ HeroSection.tsx의 "90 YEARS OF HISTORY" 디자인을 임의로 수정 금지
 *
 * ✅ 허용 사항:
 * - 개별 컴포넌트 내부의 스타일 수정 (사용자 승인 후)
 * - props 추가 및 전달
 * - 애니메이션 파라미터 조정 (사용자 승인 후)
 *
 * 📋 원본 구조 (반드시 유지):
 * 1. HeroSection - 90 YEARS OF HISTORY (절대 변경 금지!)
 * 2. TimelineIntro - 1936 강조
 * 3. HistoryStory - 90년 스토리텔링 (4개 Act 통합)
 * 4. MarqueeSection - TRUTH · LOVE · SERVICE
 * 5. PeriodSection × 6 - 6개 시대 섹션
 * 6. Footer
 * 7. TimelineProgressBar (sticky)
 *
 * ⚠️ 변경이 필요한 경우 반드시 사용자에게 확인 후 진행하세요.
 * 원본 참조: 90_year_figma/src/components/pages/HomePage.tsx
 *
 * 자세한 내용은 프로젝트 루트의 RULES.md 파일을 참조하세요.
 * ==================================================================================
 */

'use client';

import React, { useState, useEffect, lazy, Suspense, memo } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { TimelineIntro } from '@/components/sections/TimelineIntro';
import { TimelineProgressBar } from '@/components/layout/TimelineProgressBar';
import { Footer } from '@/components/layout/Footer';

// 성능 최적화: 초기 로딩에 필요하지 않은 컴포넌트들을 Lazy Loading
const HistoryStory = lazy(() => import('@/components/sections/HistoryStory'));
const MarqueeSection = lazy(() => import('@/components/sections/MarqueeSection'));
const PeriodSection = lazy(() => import('@/components/sections/PeriodSection'));
import { getPublicMarqueeTexts } from '@/lib/firestore/public/marquee';
import type { MarqueeText } from '@/lib/firestore/admin/marquee';
import { getPublicPeriodsWithHighlights } from '@/lib/firestore/public/periods';
import type { PeriodWithHighlights } from '@/lib/firestore/public/periods';
import { timelineData } from '@/data/timelineData';

// Fallback Marquee 데이터
const fallbackMarquees: MarqueeText[] = [
  {
    id: 'marquee1',
    position: 1,
    text: 'History of 90 Years',
    direction: 'left',
    speed: 5,
    enabled: true
  },
  {
    id: 'marquee2',
    position: 2,
    text: 'Toward 100 Years',
    direction: 'right',
    speed: 5,
    enabled: true
  }
];

// Fallback Period 데이터 (Firestore 로드 실패 시 사용)
const fallbackPeriods: PeriodWithHighlights[] = timelineData as PeriodWithHighlights[];

export default function Home() {
    const [activePeriod, setActivePeriod] = useState<string | null>(null);
    // fallback 데이터로 즉시 렌더링 - 로딩 상태 제거
    const [marquees, setMarquees] = useState<MarqueeText[]>(fallbackMarquees);
    const [periods, setPeriods] = useState<PeriodWithHighlights[]>(fallbackPeriods);

    // Marquee & Period 데이터 병렬 로드 (Promise.all)
    useEffect(() => {
        const loadData = async () => {
            try {
                // 병렬로 데이터 로드하여 성능 향상
                const [marqueeData, periodData] = await Promise.all([
                    getPublicMarqueeTexts(),
                    getPublicPeriodsWithHighlights()
                ]);

                // Marquee 데이터 업데이트
                if (marqueeData.length > 0) {
                    setMarquees(marqueeData);
                }

                // Period 데이터 업데이트
                if (periodData && periodData.length > 0) {
                    setPeriods(periodData);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                // Fallback 데이터 계속 사용
            }
        };

        loadData();
    }, []);

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
            <Suspense fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-amber-500 text-xl">90년의 이야기를 불러오는 중...</div>
                </div>
            }>
                <HistoryStory />
            </Suspense>

            {/* Divider - Marquee 1 */}
            <Suspense fallback={<div className="h-20 bg-black" />}>
                {marquees[0] && marquees[0].enabled && (
                    <MarqueeSection
                        text={marquees[0].text}
                        direction={marquees[0].direction}
                        speed={marquees[0].speed}
                    />
                )}
            </Suspense>

            {/* Detailed Period Sections */}
            <div className="relative z-10">
                <Suspense fallback={
                    <div className="min-h-screen bg-black flex items-center justify-center">
                        <div className="text-amber-500/50 text-lg">시대별 역사를 불러오는 중...</div>
                    </div>
                }>
                    {periods.map((period) => (
                        <PeriodSection
                            key={period.id}
                            period={period}
                            onInView={handleInView}
                        />
                    ))}
                </Suspense>
            </div>

            {/* Footer Divider - Marquee 2 */}
            <Suspense fallback={<div className="h-20 bg-black" />}>
                {marquees[1] && marquees[1].enabled && (
                    <MarqueeSection
                        text={marquees[1].text}
                        direction={marquees[1].direction}
                        speed={marquees[1].speed}
                    />
                )}
            </Suspense>

            <Footer />

            <TimelineProgressBar
                periods={periods}
                activePeriodId={activePeriod}
                onPeriodSelect={handlePeriodSelect}
            />
        </main>
    );
}

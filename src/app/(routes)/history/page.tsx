import React from 'react';
import { getPublicHistoryChapters } from '@/lib/firestore/public/history';
import { historyChapters as fallbackChapters } from '@/data/historyChapters';
import HistoryClient from './history-client';

/**
 * 별빛 아카이브 - 서버 컴포넌트 (최적화)
 *
 * 최적화 내용:
 * 1. 서버 컴포넌트로 변환 (데이터 사전 로드)
 * 2. 로딩 상태 제거 (서버에서 처리)
 * 3. 클라이언트 컴포넌트와 분리
 */
export default async function HistoryPage() {
    // 서버에서 데이터 로드 (로딩 시간 제거)
    let chapters = fallbackChapters;

    try {
        const data = await getPublicHistoryChapters();
        if (data.length > 0) {
            chapters = data;
        }
    } catch (error) {
        console.error('Error loading chapters:', error);
        // fallback 데이터 사용
    }

    // 클라이언트 컴포넌트에 데이터 전달
    return <HistoryClient chapters={chapters} />;
}

// 페이지 메타데이터
export const metadata = {
    title: '별빛 아카이브 | 삼육보건대학교 90주년',
    description: '1936년부터 2026년까지, 90년간 빛나온 별들의 기록',
};

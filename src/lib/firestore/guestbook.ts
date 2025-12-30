/**
 * Firestore 방명록 관련 함수
 */

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    where,
    limit,
    Timestamp,
    updateDoc,
    doc,
    increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
    GuestbookEntry,
    GuestbookFormData,
} from '@/types/firestore';

const COLLECTION_NAME = 'guestbook';

/**
 * 방명록 항목 추가
 */
export async function addGuestbookEntry(
    data: GuestbookFormData
): Promise<string> {
    const entry = {
        name: data.name,
        graduationYear: data.graduationYear,
        major: data.major || '',
        message: data.message,
        isAnonymous: data.isAnonymous,
        likes: 0,
        approved: true, // 자동 승인 (추후 관리자 승인 기능 추가 가능)
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), entry);
    return docRef.id;
}

/**
 * 방명록 목록 조회
 */
export async function getGuestbookEntries(
    sortBy: 'latest' | 'likes' = 'latest',
    yearFilter?: number,
    limitCount: number = 20
): Promise<GuestbookEntry[]> {
    let q;

    // 졸업 연도 필터가 있는 경우
    if (yearFilter) {
        q = query(
            collection(db, COLLECTION_NAME),
            where('graduationYear', '==', yearFilter),
            orderBy(sortBy === 'latest' ? 'createdAt' : 'likes', 'desc'),
            limit(limitCount)
        );
    } else {
        // 필터가 없는 경우 - 인덱스 불필요
        q = query(
            collection(db, COLLECTION_NAME),
            orderBy(sortBy === 'latest' ? 'createdAt' : 'likes', 'desc'),
            limit(limitCount)
        );
    }

    const snapshot = await getDocs(q);

    // approved=true인 항목만 클라이언트 측에서 필터링
    const entries = snapshot.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as GuestbookEntry[];

    return entries.filter((entry) => entry.approved !== false);
}

/**
 * 방명록 항목 좋아요 추가
 */
export async function likeGuestbookEntry(entryId: string): Promise<void> {
    const entryRef = doc(db, COLLECTION_NAME, entryId);
    await updateDoc(entryRef, {
        likes: increment(1),
    });
}

// 졸업 연도 캐시 (5분 유효)
let graduationYearsCache: { years: number[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

/**
 * 졸업 연도 목록 가져오기 (필터용)
 * 최적화: 캐싱 및 제한된 쿼리 사용
 */
export async function getGraduationYears(): Promise<number[]> {
    // 캐시 확인
    if (graduationYearsCache && Date.now() - graduationYearsCache.timestamp < CACHE_DURATION) {
        return graduationYearsCache.years;
    }

    // 최근 1000개 항목만 조회 (전체 스캔 방지)
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(1000)
    );
    const snapshot = await getDocs(q);
    const years = new Set<number>();

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.graduationYear) {
            years.add(data.graduationYear);
        }
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a);

    // 캐시 업데이트
    graduationYearsCache = {
        years: sortedYears,
        timestamp: Date.now(),
    };

    return sortedYears;
}

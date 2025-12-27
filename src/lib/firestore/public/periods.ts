/**
 * Period & Highlight CMS - Public Query Functions
 *
 * 공개 사용자용 Period 및 Highlight 콘텐츠 조회 함수
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Period } from '../admin/periods';
import type { Highlight } from '../admin/highlights';

const PERIODS_COLLECTION = 'homepage_periods';
const HIGHLIGHTS_SUBCOLLECTION = 'highlights';

export interface PeriodWithHighlights extends Period {
  highlights: Highlight[];
}

/**
 * 모든 Period와 각각의 Highlights 조회 (공개용)
 *
 * enabled=true인 Period만 조회하고, 각 Period의 enabled=true인 Highlights도 포함
 * 오류 발생 시 null 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicPeriodsWithHighlights(): Promise<
  PeriodWithHighlights[] | null
> {
  try {
    // 1. 활성화된 Period 조회
    const periodsRef = collection(db, PERIODS_COLLECTION);
    const periodsQuery = query(
      periodsRef,
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );
    const periodsSnapshot = await getDocs(periodsQuery);

    // 2. 각 Period의 Highlights 조회
    const periodsWithHighlights = await Promise.all(
      periodsSnapshot.docs.map(async (periodDoc) => {
        const periodData = { id: periodDoc.id, ...periodDoc.data() } as Period;

        // Highlights Subcollection 조회
        const highlightsRef = collection(
          db,
          PERIODS_COLLECTION,
          periodDoc.id,
          HIGHLIGHTS_SUBCOLLECTION
        );
        const highlightsQuery = query(
          highlightsRef,
          where('enabled', '==', true),
          orderBy('order', 'asc')
        );
        const highlightsSnapshot = await getDocs(highlightsQuery);

        const highlights = highlightsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Highlight
        );

        return {
          ...periodData,
          highlights,
        };
      })
    );

    return periodsWithHighlights;
  } catch (error) {
    console.error('Error getting public periods with highlights:', error);
    // 오류 발생 시 null 반환 (Fallback 사용)
    return null;
  }
}

/**
 * 특정 Period와 Highlights 조회 (공개용)
 */
export async function getPublicPeriod(
  periodId: string
): Promise<PeriodWithHighlights | null> {
  try {
    const docRef = doc(db, PERIODS_COLLECTION, periodId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const periodData = { id: docSnap.id, ...docSnap.data() } as Period;

    // Highlights 조회
    const highlightsRef = collection(
      db,
      PERIODS_COLLECTION,
      periodId,
      HIGHLIGHTS_SUBCOLLECTION
    );
    const highlightsQuery = query(
      highlightsRef,
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );
    const highlightsSnapshot = await getDocs(highlightsQuery);

    const highlights = highlightsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Highlight
    );

    return {
      ...periodData,
      highlights,
    };
  } catch (error) {
    console.error('Error getting public period:', error);
    return null;
  }
}

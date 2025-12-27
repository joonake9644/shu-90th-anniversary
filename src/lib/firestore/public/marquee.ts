/**
 * Marquee CMS - Public Query Functions
 *
 * 공개 사용자용 Marquee 콘텐츠 조회 함수
 */

import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MarqueeText } from '../admin/marquee';

const COLLECTION_NAME = 'homepage_marquee';

/**
 * 활성화된 Marquee 텍스트 조회 (공개용)
 *
 * 오류 발생 시 빈 배열 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicMarqueeTexts(): Promise<MarqueeText[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true),
      orderBy('position', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MarqueeText[];
  } catch (error) {
    console.error('Error getting public marquee texts:', error);
    // 오류 발생 시 빈 배열 반환 (Fallback 사용)
    return [];
  }
}

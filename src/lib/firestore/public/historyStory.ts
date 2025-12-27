/**
 * HistoryStory CMS - Public Query Functions
 *
 * 공개 사용자용 HistoryStory 콘텐츠 조회 함수
 */

import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HistoryStoryAct } from '../admin/historyStory';

const COLLECTION_NAME = 'homepage_history_story';

/**
 * 활성화된 모든 Act 조회 (공개용)
 *
 * 오류 발생 시 빈 배열 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicHistoryStoryActs(): Promise<HistoryStoryAct[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const acts: HistoryStoryAct[] = [];
    querySnapshot.forEach((doc) => {
      acts.push({ id: doc.id, ...doc.data() } as HistoryStoryAct);
    });

    return acts;
  } catch (error) {
    console.error('Error getting public history story acts:', error);
    // 오류 발생 시 빈 배열 반환 (Fallback 사용)
    return [];
  }
}

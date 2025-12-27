/**
 * TimelineIntro CMS - Public Query Functions
 *
 * 공개 사용자용 TimelineIntro 콘텐츠 조회 함수
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TimelineIntroContent } from '../admin/timelineIntro';

const COLLECTION_NAME = 'homepage_timeline_intro';
const DOC_ID = 'main';

/**
 * TimelineIntro 콘텐츠 조회 (공개용)
 *
 * 오류 발생 시 null 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicTimelineIntroContent(): Promise<TimelineIntroContent | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TimelineIntroContent;
    }

    return null;
  } catch (error) {
    console.error('Error getting public timeline intro content:', error);
    // 오류 발생 시 null 반환 (Fallback 사용)
    return null;
  }
}

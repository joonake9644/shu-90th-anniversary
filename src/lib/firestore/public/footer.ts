/**
 * Footer CMS - Public Query Functions
 *
 * 공개 사용자용 Footer 콘텐츠 조회 함수
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HomepageFooter } from '../admin/footer';

const COLLECTION_NAME = 'homepage_footer';
const FOOTER_DOC_ID = 'main';

/**
 * Footer 콘텐츠 조회 (공개용)
 *
 * 오류 발생 시 null 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicFooterContent(): Promise<HomepageFooter | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, FOOTER_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HomepageFooter;
    }

    return null;
  } catch (error) {
    console.error('Error getting public footer content:', error);
    // 오류 발생 시 null 반환 (Fallback 사용)
    return null;
  }
}

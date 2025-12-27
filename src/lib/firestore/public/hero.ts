/**
 * HeroSection CMS - Public Query Functions
 *
 * 공개 사용자용 HeroSection 콘텐츠 조회 함수
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HomepageHero } from '../admin/hero';

const COLLECTION_NAME = 'homepage_hero';
const HERO_DOC_ID = 'main';

/**
 * HeroSection 콘텐츠 조회 (공개용)
 *
 * 오류 발생 시 null 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicHeroContent(): Promise<HomepageHero | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, HERO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HomepageHero;
    }

    return null;
  } catch (error) {
    console.error('Error getting public hero content:', error);
    // 오류 발생 시 null 반환 (Fallback 사용)
    return null;
  }
}

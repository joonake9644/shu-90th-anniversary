/**
 * HeroSection CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 HeroSection 콘텐츠 관리 함수
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_hero';
const HERO_DOC_ID = 'main'; // Singleton document

export interface HomepageHero {
  id: string;

  // 배경 이미지
  backgroundImage: string;

  // 뱃지
  badgeText: string; // "THE 90TH ANNIVERSARY"

  // 메인 타이틀
  mainNumber: string; // "90"
  mainSubtitle1: string; // "YEARS"
  mainSubtitle2: string; // "Of History"

  // 학교 정보
  universityName: string; // "Sahmyook Health University"

  // 설명
  description: string; // "삼육보건대학교 90주년,\n진심의 교육으로 세상을 치유해온 시간"

  // 메타데이터
  updatedAt?: any;
  createdAt?: any;
}

/**
 * HeroSection 콘텐츠 조회
 */
export async function getHeroContent(): Promise<HomepageHero | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, HERO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HomepageHero;
    }

    return null;
  } catch (error) {
    console.error('Error getting hero content:', error);
    throw error;
  }
}

/**
 * HeroSection 콘텐츠 업데이트 (생성 또는 수정)
 */
export async function updateHeroContent(
  data: Omit<HomepageHero, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, HERO_DOC_ID);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    };

    await setDoc(docRef, payload, { merge: true });

    console.log('Hero content updated successfully');
    return HERO_DOC_ID;
  } catch (error) {
    console.error('Error updating hero content:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 데이터를 Firestore로 이전
 */
export async function migrateHeroData(): Promise<void> {
  const initialData: Omit<HomepageHero, 'id' | 'createdAt' | 'updatedAt'> = {
    backgroundImage: 'https://images.unsplash.com/photo-1730307403182-46906ab72173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaGlzdG9yeSUyMG9sZCUyMGJ1aWxkaW5nJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badgeText: 'THE 90TH ANNIVERSARY',
    mainNumber: '90',
    mainSubtitle1: 'YEARS',
    mainSubtitle2: 'Of History',
    universityName: 'Sahmyook Health University',
    description: '삼육보건대학교 90주년,\n진심의 교육으로 세상을 치유해온 시간'
  };

  try {
    await updateHeroContent(initialData);
    console.log('✅ Hero data migration completed');
  } catch (error) {
    console.error('❌ Hero data migration failed:', error);
    throw error;
  }
}

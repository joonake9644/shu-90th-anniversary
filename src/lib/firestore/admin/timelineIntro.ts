/**
 * TimelineIntro CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 TimelineIntro 콘텐츠 관리 함수
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_timeline_intro';
const DOC_ID = 'main'; // Singleton document

export interface TimelineIntroContent {
  id: string;

  // 1936 텍스트
  year1936Text: string; // "1936"

  // Dr. Rue 명언 (영문)
  quoteEnglish: string; // 3줄 텍스트 (\n으로 구분)

  // Dr. Rue 명언 (한글)
  quoteKorean: string; // 3줄 텍스트 (\n으로 구분)

  // Attribution
  attribution: string; // "George Henry Rue. M.D (고 류제한 박사 1899-1993)"

  // 타이틀
  titleLeft: string; // "History"
  titleRight: string; // "90 Years"

  // 메타데이터
  updatedAt?: any;
  createdAt?: any;
}

/**
 * TimelineIntro 콘텐츠 조회
 */
export async function getTimelineIntroContent(): Promise<TimelineIntroContent | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TimelineIntroContent;
    }

    return null;
  } catch (error) {
    console.error('Error getting timeline intro content:', error);
    throw error;
  }
}

/**
 * TimelineIntro 콘텐츠 업데이트 (생성 또는 수정)
 */
export async function updateTimelineIntroContent(
  data: Omit<TimelineIntroContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    };

    await setDoc(docRef, payload, { merge: true });

    console.log('Timeline intro content updated successfully');
    return DOC_ID;
  } catch (error) {
    console.error('Error updating timeline intro content:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 데이터를 Firestore로 이전
 */
export async function migrateTimelineIntroData(): Promise<void> {
  const initialData: Omit<TimelineIntroContent, 'id' | 'createdAt' | 'updatedAt'> = {
    year1936Text: '1936',
    quoteEnglish: 'I never treated anyone with neglect.\nWhether treating Dr. Syngman Rhee or a country woman,\nI always gave my utmost effort.',
    quoteKorean: '나는 어느 누구도 소홀히 치료하지 않았습니다.\n이승만 박사를 치료할 때나 시골의 아낙네를 치료할 때나\n똑같이 나의 최선의 노력을 바쳤습니다.',
    attribution: 'George Henry Rue. M.D (고 류제한 박사 1899-1993)',
    titleLeft: 'History',
    titleRight: '90 Years'
  };

  try {
    await updateTimelineIntroContent(initialData);
    console.log('✅ Timeline intro data migration completed');
  } catch (error) {
    console.error('❌ Timeline intro data migration failed:', error);
    throw error;
  }
}

/**
 * Marquee CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 Marquee 콘텐츠 관리 함수
 */

import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_marquee';

export interface MarqueeText {
  id: string;
  position: number; // 1 또는 2
  text: string; // "History of 90 Years"
  direction: 'left' | 'right';
  speed: number; // 기본 5
  enabled: boolean; // 활성화 여부
  updatedAt?: any;
  createdAt?: any;
}

/**
 * 모든 Marquee 텍스트 조회 (순서대로)
 */
export async function getAllMarqueeTexts(): Promise<MarqueeText[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('position', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MarqueeText[];
  } catch (error) {
    console.error('Error getting marquee texts:', error);
    throw error;
  }
}

/**
 * 특정 Marquee 텍스트 조회
 */
export async function getMarqueeText(id: string): Promise<MarqueeText | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MarqueeText;
    }

    return null;
  } catch (error) {
    console.error('Error getting marquee text:', error);
    throw error;
  }
}

/**
 * Marquee 텍스트 업데이트 (생성 또는 수정)
 */
export async function updateMarqueeText(
  id: string,
  data: Omit<MarqueeText, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    };

    await setDoc(docRef, payload, { merge: true });

    console.log('Marquee text updated successfully');
    return id;
  } catch (error) {
    console.error('Error updating marquee text:', error);
    throw error;
  }
}

/**
 * Marquee 텍스트 삭제
 */
export async function deleteMarqueeText(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('Marquee text deleted successfully');
  } catch (error) {
    console.error('Error deleting marquee text:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 데이터를 Firestore로 이전
 */
export async function migrateMarqueeData(): Promise<void> {
  const marqueeTexts: Array<Omit<MarqueeText, 'createdAt' | 'updatedAt'>> = [
    {
      id: 'marquee1',
      position: 1,
      text: 'History of 90 Years',
      direction: 'left',
      speed: 5,
      enabled: true
    },
    {
      id: 'marquee2',
      position: 2,
      text: 'Toward 100 Years',
      direction: 'right',
      speed: 5,
      enabled: true
    }
  ];

  try {
    for (const marquee of marqueeTexts) {
      const { id, ...data } = marquee;
      await updateMarqueeText(id, data);
    }

    console.log('✅ Marquee data migration completed');
  } catch (error) {
    console.error('❌ Marquee data migration failed:', error);
    throw error;
  }
}

/**
 * Period CMS - Admin CRUD Functions
 *
 * 관리자용 Period 관리 함수
 * Subcollection: highlights는 별도 파일에서 관리
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_periods';

export interface Period {
  id: string;
  order: number; // 정렬 순서 (1-6)
  rangeLabel: string; // "1936 ~ 1946"
  yearStart: number;
  yearEnd: number;
  title: string; // "Beginning 태동기"
  subtitle: string; // 줄바꿈 가능
  heroMedia: string; // 이미지 URL
  enabled: boolean; // 활성화 여부
  createdAt?: any;
  updatedAt?: any;
}

/**
 * 모든 Period 조회 (order 순으로 정렬)
 */
export async function getAllPeriods(): Promise<Period[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Period[];
}

/**
 * 특정 Period 조회
 */
export async function getPeriod(periodId: string): Promise<Period | null> {
  const docRef = doc(db, COLLECTION_NAME, periodId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Period;
  }

  return null;
}

/**
 * Period 생성 (새 문서)
 */
export async function createPeriod(
  periodId: string,
  data: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(db, COLLECTION_NAME, periodId);

  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload);
  return periodId;
}

/**
 * Period 업데이트
 */
export async function updatePeriod(
  periodId: string,
  data: Partial<Omit<Period, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, periodId);

  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
}

/**
 * Period 삭제
 */
export async function deletePeriod(periodId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, periodId);
  await deleteDoc(docRef);
}

/**
 * Period 순서 변경 (여러 Period의 order 필드 일괄 업데이트)
 */
export async function updatePeriodOrders(
  updates: { periodId: string; order: number }[]
): Promise<void> {
  const promises = updates.map(({ periodId, order }) =>
    updateDoc(doc(db, COLLECTION_NAME, periodId), {
      order,
      updatedAt: serverTimestamp(),
    })
  );

  await Promise.all(promises);
}

/**
 * Highlight CMS - Admin CRUD Functions
 *
 * Period의 Subcollection으로 관리되는 Highlight CRUD 함수
 * Path: homepage_periods/{periodId}/highlights/{highlightId}
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

const PERIODS_COLLECTION = 'homepage_periods';
const HIGHLIGHTS_SUBCOLLECTION = 'highlights';

export interface Highlight {
  id: string;
  order: number; // 정렬 순서
  title: string; // "경성요양병원 부속 간호원 양성소 설립"
  year: string; // "1936"
  thumb: string; // 썸네일 이미지 URL
  description: string; // 줄바꿈 가능
  enabled: boolean; // 활성화 여부
  createdAt?: any;
  updatedAt?: any;
}

/**
 * 모든 Period의 모든 Highlight 조회 (통합 관리용)
 * 성능 최적화: 병렬 처리로 로딩 속도 향상
 */
export async function getAllHighlights(): Promise<(Highlight & { periodId: string })[]> {
  const periodsRef = collection(db, PERIODS_COLLECTION);
  const periodsSnapshot = await getDocs(periodsRef);

  // 모든 Period의 Highlights를 병렬로 가져오기
  const highlightPromises = periodsSnapshot.docs.map(async (periodDoc) => {
    const highlightsRef = collection(
      db,
      PERIODS_COLLECTION,
      periodDoc.id,
      HIGHLIGHTS_SUBCOLLECTION
    );
    const q = query(highlightsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      periodId: periodDoc.id,
      ...doc.data(),
    })) as (Highlight & { periodId: string })[];
  });

  // 모든 Promise가 완료될 때까지 대기 (병렬 실행)
  const highlightArrays = await Promise.all(highlightPromises);

  // 2차원 배열을 1차원 배열로 평탄화
  const allHighlights = highlightArrays.flat();

  return allHighlights;
}

/**
 * 특정 Period의 모든 Highlight 조회 (order 순으로 정렬)
 */
export async function getHighlightsByPeriod(periodId: string): Promise<Highlight[]> {
  const highlightsRef = collection(
    db,
    PERIODS_COLLECTION,
    periodId,
    HIGHLIGHTS_SUBCOLLECTION
  );
  const q = query(highlightsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Highlight[];
}

/**
 * 특정 Highlight 조회
 */
export async function getHighlight(
  periodId: string,
  highlightId: string
): Promise<Highlight | null> {
  const docRef = doc(
    db,
    PERIODS_COLLECTION,
    periodId,
    HIGHLIGHTS_SUBCOLLECTION,
    highlightId
  );
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Highlight;
  }

  return null;
}

/**
 * Highlight 생성
 */
export async function createHighlight(
  periodId: string,
  highlightId: string,
  data: Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(
    db,
    PERIODS_COLLECTION,
    periodId,
    HIGHLIGHTS_SUBCOLLECTION,
    highlightId
  );

  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload);
  return highlightId;
}

/**
 * Highlight 업데이트
 */
export async function updateHighlight(
  periodId: string,
  highlightId: string,
  data: Partial<Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(
    db,
    PERIODS_COLLECTION,
    periodId,
    HIGHLIGHTS_SUBCOLLECTION,
    highlightId
  );

  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
}

/**
 * Highlight 삭제
 */
export async function deleteHighlight(
  periodId: string,
  highlightId: string
): Promise<void> {
  const docRef = doc(
    db,
    PERIODS_COLLECTION,
    periodId,
    HIGHLIGHTS_SUBCOLLECTION,
    highlightId
  );
  await deleteDoc(docRef);
}

/**
 * Highlight 순서 변경 (여러 Highlight의 order 필드 일괄 업데이트)
 */
export async function updateHighlightOrders(
  periodId: string,
  updates: { highlightId: string; order: number }[]
): Promise<void> {
  const promises = updates.map(({ highlightId, order }) =>
    updateDoc(
      doc(db, PERIODS_COLLECTION, periodId, HIGHLIGHTS_SUBCOLLECTION, highlightId),
      {
        order,
        updatedAt: serverTimestamp(),
      }
    )
  );

  await Promise.all(promises);
}

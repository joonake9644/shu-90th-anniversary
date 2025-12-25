/**
 * 관리자용 히스토리 Firestore 함수
 */

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HistoryChapter } from '@/data/historyChapters';

const COLLECTION_NAME = 'history_chapters';

export interface HistoryChapterFirestore extends Omit<HistoryChapter, 'chapter'> {
  id?: string;
  chapter: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * 모든 히스토리 챕터 조회 (정렬된 순서)
 */
export async function getAllHistoryChapters(): Promise<HistoryChapterFirestore[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('chapter', 'asc')
  );

  const snapshot = await getDocs(q);

  const chapters = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as HistoryChapterFirestore[];

  return chapters;
}

/**
 * 특정 히스토리 챕터 조회
 */
export async function getHistoryChapter(id: string): Promise<HistoryChapterFirestore | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as HistoryChapterFirestore;
}

/**
 * 새 히스토리 챕터 생성
 */
export async function createHistoryChapter(
  chapter: Omit<HistoryChapterFirestore, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...chapter,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

/**
 * 히스토리 챕터 업데이트
 */
export async function updateHistoryChapter(
  id: string,
  chapter: Partial<Omit<HistoryChapterFirestore, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...chapter,
    updatedAt: Timestamp.now(),
  });
}

/**
 * 히스토리 챕터 삭제
 */
export async function deleteHistoryChapter(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * 여러 히스토리 챕터 삭제
 */
export async function deleteMultipleHistoryChapters(ids: string[]): Promise<void> {
  const deletePromises = ids.map((id) => deleteHistoryChapter(id));
  await Promise.all(deletePromises);
}

/**
 * 초기 데이터 마이그레이션 (하드코딩된 데이터를 Firestore에 저장)
 */
export async function migrateInitialData(chapters: HistoryChapter[]): Promise<void> {
  const now = Timestamp.now();

  const promises = chapters.map(async (chapter) => {
    // chapter 번호를 문서 ID로 사용하여 중복 방지
    const docRef = doc(db, COLLECTION_NAME, `chapter-${chapter.chapter}`);
    await setDoc(docRef, {
      ...chapter,
      createdAt: now,
      updatedAt: now,
    });
  });

  await Promise.all(promises);
}

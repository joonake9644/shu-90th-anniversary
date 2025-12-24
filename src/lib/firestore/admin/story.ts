/**
 * 관리자용 사연 Firestore 함수
 */

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { StorySubmission } from '@/types/firestore';

const COLLECTION_NAME = 'story_submissions';

/**
 * 모든 사연 조회
 */
export async function getAllStories(): Promise<StorySubmission[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const stories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as StorySubmission[];

  return stories;
}

/**
 * 사연 삭제
 */
export async function deleteStory(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * 여러 사연 삭제
 */
export async function deleteMultipleStories(ids: string[]): Promise<void> {
  const deletePromises = ids.map((id) => deleteStory(id));
  await Promise.all(deletePromises);
}

/**
 * 사연 승인/미승인 토글
 */
export async function toggleStoryApproval(
  id: string,
  isApproved: boolean
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    isApproved,
  });
}

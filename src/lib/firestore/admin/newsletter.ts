/**
 * 관리자용 뉴스레터 구독자 Firestore 함수
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
import type { NewsletterSubscriber } from '@/types/firestore';

const COLLECTION_NAME = 'newsletter_subscribers';

/**
 * 모든 구독자 조회
 */
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('subscribedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const subscribers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsletterSubscriber[];

  return subscribers;
}

/**
 * 구독자 삭제
 */
export async function deleteSubscriber(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * 여러 구독자 삭제
 */
export async function deleteMultipleSubscribers(ids: string[]): Promise<void> {
  const deletePromises = ids.map((id) => deleteSubscriber(id));
  await Promise.all(deletePromises);
}

/**
 * 구독자 활성화/비활성화
 */
export async function toggleSubscriberStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    isActive,
  });
}

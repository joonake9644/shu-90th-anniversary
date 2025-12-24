/**
 * 관리자용 방명록 Firestore 함수
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
import type { GuestbookEntry } from '@/types/firestore';

const COLLECTION_NAME = 'guestbook';

/**
 * 모든 방명록 항목 조회 (관리자용 - approved 상관없이)
 */
export async function getAllGuestbookEntries(): Promise<GuestbookEntry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const entries = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GuestbookEntry[];

  return entries;
}

/**
 * 방명록 항목 삭제
 */
export async function deleteGuestbookEntry(entryId: string): Promise<void> {
  const entryRef = doc(db, COLLECTION_NAME, entryId);
  await deleteDoc(entryRef);
}

/**
 * 방명록 항목 승인 상태 변경
 */
export async function updateGuestbookApproval(
  entryId: string,
  approved: boolean
): Promise<void> {
  const entryRef = doc(db, COLLECTION_NAME, entryId);
  await updateDoc(entryRef, {
    approved,
    updatedAt: new Date(),
  });
}

/**
 * 여러 방명록 항목 삭제
 */
export async function deleteMultipleGuestbookEntries(
  entryIds: string[]
): Promise<void> {
  const deletePromises = entryIds.map((id) => deleteGuestbookEntry(id));
  await Promise.all(deletePromises);
}

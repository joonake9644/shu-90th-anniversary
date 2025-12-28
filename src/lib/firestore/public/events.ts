/**
 * 공개용 이벤트 Firestore 함수
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/types/firestore';

const COLLECTION_NAME = 'events';

/**
 * 공개된 이벤트 목록 조회 (날짜순)
 */
export async function getPublicEvents(limitCount: number = 50): Promise<Event[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];

    return events;
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
}

/**
 * 다가오는 이벤트 조회 (현재 날짜 이후)
 */
export async function getUpcomingEvents(limitCount: number = 20): Promise<Event[]> {
  try {
    const now = Timestamp.now();

    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];

    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

/**
 * 카테고리별 이벤트 조회
 */
export async function getEventsByCategory(
  category: 'ceremony' | 'exhibition' | 'conference' | 'other',
  limitCount: number = 20
): Promise<Event[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];

    return events;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }
}

/**
 * 이벤트 단건 조회 (공개용)
 */
export async function getPublicEventById(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Event;
  } catch (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }
}

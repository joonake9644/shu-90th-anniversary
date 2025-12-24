/**
 * 관리자용 이벤트 Firestore 함수
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/types/firestore';

const COLLECTION_NAME = 'events';

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  registrationLink?: string;
  category: 'ceremony' | 'exhibition' | 'conference' | 'other';
}

/**
 * 모든 이벤트 조회
 */
export async function getAllEvents(): Promise<Event[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));

  const snapshot = await getDocs(q);

  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];

  return events;
}

/**
 * 이벤트 단건 조회
 */
export async function getEventById(id: string): Promise<Event | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Event;
}

/**
 * 이벤트 생성
 */
export async function createEvent(data: EventFormData): Promise<string> {
  const eventData = {
    title: data.title,
    description: data.description,
    date: Timestamp.fromDate(data.date),
    location: data.location,
    image: data.image || '',
    registrationLink: data.registrationLink || '',
    category: data.category,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), eventData);
  return docRef.id;
}

/**
 * 이벤트 수정
 */
export async function updateEvent(
  id: string,
  data: Partial<EventFormData>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);

  const updateData: Record<string, unknown> = {};

  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (data.date) updateData.date = Timestamp.fromDate(data.date);
  if (data.location) updateData.location = data.location;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.registrationLink !== undefined)
    updateData.registrationLink = data.registrationLink;
  if (data.category) updateData.category = data.category;

  await updateDoc(docRef, updateData);
}

/**
 * 이벤트 삭제
 */
export async function deleteEvent(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * 여러 이벤트 삭제
 */
export async function deleteMultipleEvents(ids: string[]): Promise<void> {
  const deletePromises = ids.map((id) => deleteEvent(id));
  await Promise.all(deletePromises);
}

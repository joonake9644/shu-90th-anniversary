/**
 * 관리자용 뉴스 Firestore 함수
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
import type { NewsArticle } from '@/types/firestore';

const COLLECTION_NAME = 'news';

export interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  thumbnail?: string;
  author: string;
  category: 'anniversary' | 'achievement' | 'event' | 'general';
  publishedAt: Date;
}

/**
 * 모든 뉴스 조회
 */
export async function getAllNews(): Promise<NewsArticle[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('publishedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const news = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsArticle[];

  return news;
}

/**
 * 뉴스 단건 조회
 */
export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as NewsArticle;
}

/**
 * 뉴스 생성
 */
export async function createNews(data: NewsFormData): Promise<string> {
  const newsData = {
    title: data.title,
    summary: data.summary,
    content: data.content,
    thumbnail: data.thumbnail || '',
    author: data.author,
    category: data.category,
    publishedAt: Timestamp.fromDate(data.publishedAt),
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newsData);
  return docRef.id;
}

/**
 * 뉴스 수정
 */
export async function updateNews(
  id: string,
  data: Partial<NewsFormData>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);

  const updateData: any = {};

  if (data.title) updateData.title = data.title;
  if (data.summary) updateData.summary = data.summary;
  if (data.content) updateData.content = data.content;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.author) updateData.author = data.author;
  if (data.category) updateData.category = data.category;
  if (data.publishedAt) {
    updateData.publishedAt = Timestamp.fromDate(data.publishedAt);
  }

  await updateDoc(docRef, updateData);
}

/**
 * 뉴스 삭제
 */
export async function deleteNews(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * 여러 뉴스 삭제
 */
export async function deleteMultipleNews(ids: string[]): Promise<void> {
  const deletePromises = ids.map((id) => deleteNews(id));
  await Promise.all(deletePromises);
}

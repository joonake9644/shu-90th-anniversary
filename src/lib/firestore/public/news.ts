/**
 * 공개용 뉴스 Firestore 함수
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsArticle } from '@/types/firestore';

const COLLECTION_NAME = 'news';

/**
 * 공개된 뉴스 목록 조회 (최신순)
 */
export async function getPublicNews(limitCount: number = 50): Promise<NewsArticle[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];

    return news;
  } catch (error) {
    console.error('Error fetching public news:', error);
    return [];
  }
}

/**
 * 카테고리별 뉴스 조회
 */
export async function getNewsByCategory(
  category: 'anniversary' | 'achievement' | 'event' | 'general',
  limitCount: number = 20
): Promise<NewsArticle[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];

    return news;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
}

/**
 * 뉴스 단건 조회 (공개용)
 */
export async function getPublicNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as NewsArticle;
  } catch (error) {
    console.error('Error fetching news by id:', error);
    return null;
  }
}

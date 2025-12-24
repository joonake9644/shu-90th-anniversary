import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { INewsRepository } from '@/domain/interfaces/news.repository';
import {
  NewsArticle,
  CreateNewsData,
  UpdateNewsData,
  NewsCategory,
} from '@/domain/entities/news.entity';

/**
 * Firestore 뉴스 Repository 구현
 * Infrastructure Layer - Firestore 연동
 */
export class FirestoreNewsRepository implements INewsRepository {
  private readonly collectionName = 'news';

  /**
   * 모든 뉴스 조회 (최신순)
   */
  async findAll(): Promise<NewsArticle[]> {
    const q = query(
      collection(db, this.collectionName),
      orderBy('publishedAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];
  }

  /**
   * ID로 뉴스 조회
   */
  async findById(id: string): Promise<NewsArticle | null> {
    const docRef = doc(db, this.collectionName, id);
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
   * 카테고리별 뉴스 조회
   */
  async findByCategory(category: NewsCategory): Promise<NewsArticle[]> {
    const q = query(
      collection(db, this.collectionName),
      where('category', '==', category),
      orderBy('publishedAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];
  }

  /**
   * 뉴스 생성
   */
  async create(data: CreateNewsData): Promise<string> {
    const now = Timestamp.now();

    const newsData = {
      ...data,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, this.collectionName), newsData);
    return docRef.id;
  }

  /**
   * 뉴스 수정
   */
  async update(id: string, data: UpdateNewsData): Promise<void> {
    const docRef = doc(db, this.collectionName, id);

    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  }

  /**
   * 뉴스 삭제
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

// 싱글톤 인스턴스 export
export const newsRepository = new FirestoreNewsRepository();

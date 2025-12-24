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
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { IEventRepository } from '@/domain/interfaces/event.repository';
import {
  Event,
  CreateEventData,
  UpdateEventData,
  EventCategory,
} from '@/domain/entities/event.entity';

/**
 * Firestore 이벤트 Repository 구현
 * Infrastructure Layer - Firestore 연동
 */
export class FirestoreEventRepository implements IEventRepository {
  private readonly collectionName = 'events';

  /**
   * 모든 이벤트 조회 (날짜순)
   */
  async findAll(): Promise<Event[]> {
    const q = query(
      collection(db, this.collectionName),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  }

  /**
   * ID로 이벤트 조회
   */
  async findById(id: string): Promise<Event | null> {
    const docRef = doc(db, this.collectionName, id);
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
   * 카테고리별 이벤트 조회
   */
  async findByCategory(category: EventCategory): Promise<Event[]> {
    const q = query(
      collection(db, this.collectionName),
      where('category', '==', category),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  }

  /**
   * Featured 이벤트 조회
   */
  async findFeatured(): Promise<Event | null> {
    const q = query(
      collection(db, this.collectionName),
      where('isFeatured', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Event;
  }

  /**
   * 이벤트 생성
   */
  async create(data: CreateEventData): Promise<string> {
    const now = Timestamp.now();

    const eventData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, this.collectionName), eventData);
    return docRef.id;
  }

  /**
   * 이벤트 수정
   */
  async update(id: string, data: UpdateEventData): Promise<void> {
    const docRef = doc(db, this.collectionName, id);

    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  }

  /**
   * 이벤트 삭제
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

// 싱글톤 인스턴스 export
export const eventRepository = new FirestoreEventRepository();

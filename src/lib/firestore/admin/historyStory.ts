/**
 * HistoryStory CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 HistoryStory 콘텐츠 관리 함수
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'homepage_history_story';

export type ActType = 'prologue' | 'act1' | 'act2' | 'act3' | 'epilogue';

export interface HistoryStoryAct {
  id: string;
  actType: ActType;
  order: number; // 0-4 (정렬 순서)

  // === Prologue 전용 필드 ===
  prologueNarrative1?: string; // "In the deepest darkness..."
  prologueNarrative2?: string; // "A light awakens"
  prologueYear?: string; // "1936"
  prologueYearSubtitle?: string; // "The Spark of Compassion"

  // === Act 1-3 공통 필드 ===
  actImageUrl?: string; // 이미지 URL
  actTitleEn?: string; // "ACT 1: HARDSHIP"
  actTitleKr?: string; // "고난, 그 깊은 뿌리"
  actDescription?: string; // 본문 텍스트

  // === Act 1 전용 필드 ===
  act1PeriodLabel?: string; // "1936 - 1953 · The Era of Endurance"
  act1BackgroundText?: string; // "ROOTS" (장식용)

  // === Act 2 전용 필드 ===
  act2YearLabels?: string[]; // ["Year 1960", "Year 1970", "Year 1980", "Year 1990"]
  act2BackgroundColor?: string; // "#1a1815"

  // === Act 3 전용 필드 ===
  act3BadgeText?: string; // "Global Impact"
  act3MapLabel?: string; // "Connecting The World"

  // === Epilogue 전용 필드 ===
  epilogueSubtitleEn?: string; // "Our Promise"
  epilogueTitleKr?: string; // "100년을 향한 약속"
  epilogueDescription?: string; // 본문
  epilogueButtonText?: string; // "Join the Journey"

  // 메타데이터
  enabled?: boolean; // 활성화 여부
  updatedAt?: any;
  createdAt?: any;
}

/**
 * 모든 Act 조회 (순서대로 정렬)
 */
export async function getAllActs(): Promise<HistoryStoryAct[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    const acts: HistoryStoryAct[] = [];
    querySnapshot.forEach((doc) => {
      acts.push({ id: doc.id, ...doc.data() } as HistoryStoryAct);
    });

    return acts;
  } catch (error) {
    console.error('Error getting all acts:', error);
    throw error;
  }
}

/**
 * 특정 Act 조회
 */
export async function getActById(actId: string): Promise<HistoryStoryAct | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, actId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HistoryStoryAct;
    }

    return null;
  } catch (error) {
    console.error('Error getting act by id:', error);
    throw error;
  }
}

/**
 * Act 생성 또는 업데이트
 */
export async function updateAct(
  actId: string,
  data: Omit<HistoryStoryAct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, actId);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    };

    await setDoc(docRef, payload, { merge: true });

    console.log(`Act ${actId} updated successfully`);
    return actId;
  } catch (error) {
    console.error('Error updating act:', error);
    throw error;
  }
}

/**
 * Act 삭제
 */
export async function deleteAct(actId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, actId);
    await deleteDoc(docRef);
    console.log(`Act ${actId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting act:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 HistoryStory 데이터를 Firestore로 이전
 */
export async function migrateHistoryStoryData(): Promise<void> {
  const acts: Omit<HistoryStoryAct, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Prologue
    {
      actType: 'prologue',
      order: 0,
      prologueNarrative1: 'In the deepest darkness...',
      prologueNarrative2: 'A light awakens',
      prologueYear: '1936',
      prologueYearSubtitle: 'The Spark of Compassion',
      enabled: true
    },

    // Act 1: HARDSHIP
    {
      actType: 'act1',
      order: 1,
      actImageUrl: 'https://images.unsplash.com/photo-1516570161687-0b1a7742d87a?q=80&w=1200&auto=format&fit=crop',
      actTitleEn: 'ACT 1: HARDSHIP',
      actTitleKr: '고난, 그 깊은 뿌리',
      actDescription: '전쟁과 폐허 속에서도 꺼지지 않았던 등불.\n류제한 박사의 천막 병원은 절망을 희망으로 바꾸는\n거룩한 성소였습니다.',
      act1PeriodLabel: '1936 - 1953 · The Era of Endurance',
      act1BackgroundText: 'ROOTS',
      enabled: true
    },

    // Act 2: FOREST OF TRUTH
    {
      actType: 'act2',
      order: 2,
      actTitleEn: 'ACT 2: FOREST OF TRUTH',
      actTitleKr: '진리의 숲을 이루다',
      actDescription: '한 그루의 나무가 숲이 되기까지,\n우리는 멈추지 않고 자라났습니다.',
      act2YearLabels: ['Year 1960', 'Year 1970', 'Year 1980', 'Year 1990'],
      act2BackgroundColor: '#1a1815',
      enabled: true
    },

    // Act 3: PRISM OF LOVE
    {
      actType: 'act3',
      order: 3,
      actTitleEn: 'ACT 3: PRISM OF LOVE',
      actTitleKr: '세상으로 번지는\n사랑의 빛',
      act3BadgeText: 'Global Impact',
      act3MapLabel: 'Connecting The World',
      enabled: true
    },

    // Epilogue: PROMISE
    {
      actType: 'epilogue',
      order: 4,
      epilogueSubtitleEn: 'Our Promise',
      epilogueTitleKr: '100년을 향한 약속',
      epilogueDescription: '지난 90년의 역사가 그러했듯,\n앞으로의 100년도 변함없는 사랑으로\n세상을 비추겠습니다.',
      epilogueButtonText: 'Join the Journey',
      enabled: true
    }
  ];

  try {
    const actIds = ['prologue', 'act1', 'act2', 'act3', 'epilogue'];

    for (let i = 0; i < acts.length; i++) {
      await updateAct(actIds[i], acts[i]);
    }

    console.log('✅ HistoryStory data migration completed');
  } catch (error) {
    console.error('❌ HistoryStory data migration failed:', error);
    throw error;
  }
}

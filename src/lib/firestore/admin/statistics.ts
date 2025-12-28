/**
 * 관리자용 통계 Firestore 함수
 */

import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DOCUMENT_ID = 'main';
const COLLECTION_NAME = 'statistics_data';

export interface StatItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
  order: number;
  enabled: boolean;
}

export interface TimelineMilestone {
  year: number;
  students: number;
  label: string;
}

export interface DetailStat {
  id: string;
  number: number;
  suffix: string;
  label: string;
  items: string[];
}

export interface ResearchData {
  papers: number;
  projects: number;
  investment: number;
}

export interface StatisticsData {
  stats: StatItem[];
  milestones: TimelineMilestone[];
  detailStats: DetailStat[];
  research: ResearchData;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * 통계 데이터 조회
 */
export async function getStatisticsData(): Promise<StatisticsData | null> {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as StatisticsData;
}

/**
 * 통계 데이터 업데이트
 */
export async function updateStatisticsData(
  data: Omit<StatisticsData, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  const existing = await getDoc(docRef);

  if (existing.exists()) {
    await setDoc(docRef, {
      ...data,
      createdAt: existing.data().createdAt,
      updatedAt: Timestamp.now(),
    });
  } else {
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

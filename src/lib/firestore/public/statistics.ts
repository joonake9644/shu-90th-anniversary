/**
 * 공개용 통계 Firestore 함수
 */

import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { StatisticsData } from '@/lib/firestore/admin/statistics';

const DOCUMENT_ID = 'main';
const COLLECTION_NAME = 'statistics_data';

/**
 * 공개용 통계 데이터 조회 (활성화된 항목만)
 */
export async function getPublicStatisticsData(): Promise<StatisticsData | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as StatisticsData;

    // 활성화된 stats만 필터링
    const filteredData: StatisticsData = {
      ...data,
      stats: data.stats.filter(stat => stat.enabled !== false),
    };

    return filteredData;
  } catch (error) {
    console.error('Error loading public statistics:', error);
    return null;
  }
}

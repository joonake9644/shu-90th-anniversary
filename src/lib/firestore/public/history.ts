/**
 * 공개용 히스토리 Firestore 함수
 */

import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HistoryChapter } from '@/data/historyChapters';

const COLLECTION_NAME = 'history_chapters';

/**
 * 모든 히스토리 챕터 조회 (공개용)
 */
export async function getPublicHistoryChapters(): Promise<HistoryChapter[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('chapter', 'asc')
  );

  const snapshot = await getDocs(q);

  const chapters = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      chapter: data.chapter,
      title: data.title,
      period: data.period,
      subtitle: data.subtitle,
      story: data.story,
      imageUrl: data.imageUrl,
      highlights: data.highlights,
    } as HistoryChapter;
  });

  return chapters;
}

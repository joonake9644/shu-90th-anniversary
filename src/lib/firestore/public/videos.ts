/**
 * Video History CMS - Public Query Functions
 *
 * 공개 사용자용 비디오 히스토리 콘텐츠 조회 함수
 */

import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video } from '../admin/videos';

const COLLECTION_NAME = 'videos';

/**
 * 활성화된 모든 비디오 조회 (공개용)
 *
 * 오류 발생 시 빈 배열 반환 (Fallback 데이터 사용 권장)
 */
export async function getPublicVideos(): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error getting public videos:', error);
    // 오류 발생 시 빈 배열 반환 (Fallback 사용)
    return [];
  }
}

/**
 * Period별 활성화된 비디오 조회 (공개용)
 */
export async function getPublicVideosByPeriod(period: string): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true),
      where('period', '==', period),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error getting public videos by period:', error);
    return [];
  }
}

/**
 * 추천 비디오 조회 (공개용)
 */
export async function getPublicFeaturedVideos(): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true),
      where('featured', '==', true),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error getting public featured videos:', error);
    return [];
  }
}

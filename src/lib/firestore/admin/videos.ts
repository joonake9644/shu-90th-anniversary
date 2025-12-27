/**
 * Video History CMS - Firestore Admin CRUD Functions
 *
 * 관리자 전용 비디오 히스토리 콘텐츠 관리 함수
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
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'videos';

export interface Video {
  id: string;
  title: string;
  description: string;
  year: string;
  duration: string;
  thumbnail: string;
  videoUrl: string; // YouTube URL or video file URL
  category: string;
  period: string; // '1936-1946', '1947-1956', etc.
  order: number; // 정렬 순서
  featured: boolean; // 추천 비디오 여부
  enabled: boolean; // 활성화 여부
  createdAt?: any;
  updatedAt?: any;
}

/**
 * 모든 비디오 조회 (순서대로 정렬)
 */
export async function getAllVideos(): Promise<Video[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error getting all videos:', error);
    throw error;
  }
}

/**
 * 특정 비디오 조회
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, videoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Video;
    }

    return null;
  } catch (error) {
    console.error('Error getting video by id:', error);
    throw error;
  }
}

/**
 * Period별 비디오 조회
 */
export async function getVideosByPeriod(period: string): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
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
    console.error('Error getting videos by period:', error);
    throw error;
  }
}

/**
 * 비디오 생성 또는 업데이트
 */
export async function updateVideo(
  videoId: string,
  data: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = doc(db, COLLECTION_NAME, videoId);

    // 기존 문서 확인
    const existing = await getDoc(docRef);

    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    await setDoc(docRef, payload, { merge: true });

    console.log(`Video ${videoId} updated successfully`);
    return videoId;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
}

/**
 * 비디오 삭제
 */
export async function deleteVideo(videoId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, videoId);
    await deleteDoc(docRef);
    console.log(`Video ${videoId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

/**
 * 초기 데이터 마이그레이션
 * 하드코딩된 비디오 데이터를 Firestore로 이전
 */
export async function migrateVideosData(): Promise<void> {
  const videos: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: '개교 기념식 - 1936년의 감동',
      description: '삼육보건대학교의 첫 걸음을 되돌아봅니다.',
      year: '1936',
      duration: '5:32',
      thumbnail: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      category: '기념식',
      period: '1936-1946',
      order: 1,
      featured: true,
      enabled: true,
    },
    {
      title: '전란 속의 교육 - 6.25 전쟁 시기',
      description: '어려운 상황에서도 멈추지 않은 교육의 열정',
      year: '1951',
      duration: '8:15',
      thumbnail: 'https://images.unsplash.com/photo-1533481498108-4b77f433501a?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      category: '역사',
      period: '1947-1956',
      order: 2,
      featured: false,
      enabled: true,
    },
    {
      title: '캠퍼스 확장 공사 - 1974',
      description: '성장하는 대학, 늘어나는 학생들을 위한 최신 시설',
      year: '1974',
      duration: '6:45',
      thumbnail: 'https://images.unsplash.com/photo-1676555263970-63e72d69642a?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      category: '캠퍼스',
      period: '1957-1996',
      order: 3,
      featured: false,
      enabled: true,
    },
    {
      title: '88올림픽과 함께한 우리 대학',
      description: '글로벌 비전을 향한 첫 발걸음',
      year: '1988',
      duration: '12:30',
      thumbnail: 'https://images.unsplash.com/photo-1758432274762-71b4c4572728?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example4',
      category: '행사',
      period: '1957-1996',
      order: 4,
      featured: false,
      enabled: true,
    },
    {
      title: 'WCC 선정 기념 다큐멘터리',
      description: '세계가 인정한 직업 교육의 산실',
      year: '2013',
      duration: '15:00',
      thumbnail: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example5',
      category: '기념식',
      period: '1997-2016',
      order: 5,
      featured: false,
      enabled: true,
    },
    {
      title: 'AI 융합 교육 플랫폼 오픈',
      description: '미래 교육을 선도하는 디지털 혁신',
      year: '2023',
      duration: '7:20',
      thumbnail: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example6',
      category: '기술',
      period: '2017-2024',
      order: 6,
      featured: false,
      enabled: true,
    },
    {
      title: '90주년 기념 메시지',
      description: '총장님의 90주년 기념사',
      year: '2026',
      duration: '4:50',
      thumbnail: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example7',
      category: '기념식',
      period: '2025-Beyond',
      order: 7,
      featured: false,
      enabled: true,
    },
    {
      title: '동문 인터뷰 시리즈 - 1기',
      description: '선배들이 들려주는 90년의 이야기',
      year: '2026',
      duration: '18:45',
      thumbnail: 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=example8',
      category: '인터뷰',
      period: '2025-Beyond',
      order: 8,
      featured: false,
      enabled: true,
    },
  ];

  try {
    for (let i = 0; i < videos.length; i++) {
      const videoId = `v${i + 1}`;
      await updateVideo(videoId, videos[i]);
    }

    console.log('✅ Videos data migration completed');
  } catch (error) {
    console.error('❌ Videos data migration failed:', error);
    throw error;
  }
}

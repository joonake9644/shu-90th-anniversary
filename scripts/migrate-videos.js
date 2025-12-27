/**
 * Video History 초기 데이터 마이그레이션 스크립트
 *
 * 하드코딩된 비디오 데이터를 Firestore로 이전합니다.
 *
 * 실행 방법:
 * node scripts/migrate-videos.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const COLLECTION_NAME = 'videos';

// 마이그레이션할 데이터
const videosData = [
  {
    id: 'v1',
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
    id: 'v2',
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
    id: 'v3',
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
    id: 'v4',
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
    id: 'v5',
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
    id: 'v6',
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
    id: 'v7',
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
    id: 'v8',
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

async function migrateVideosData() {
  try {
    console.log('🚀 Video History 데이터 마이그레이션 시작...\n');

    // 각 비디오를 Firestore에 저장
    for (const videoData of videosData) {
      const { id, ...data } = videoData;

      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection(COLLECTION_NAME).doc(id).set(docData);

      console.log(`✅ ${id} 저장 완료 - ${data.title}`);
    }

    console.log('\n✅ Video History 데이터 마이그레이션 완료!');
    console.log(`\n📍 총 ${videosData.length}개 비디오 저장됨`);
    console.log('📍 Firestore Collection:', COLLECTION_NAME);
    console.log('\n저장된 비디오 ID:');
    videosData.forEach((video) => {
      console.log(`  - ${video.id} (${video.year} / ${video.category})`);
    });

    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('2. /admin/content/videos 페이지에서 목록 확인');
    console.log('3. 각 비디오 편집 페이지에서 수정 테스트');
    console.log('4. /video-history 페이지 확인');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateVideosData();

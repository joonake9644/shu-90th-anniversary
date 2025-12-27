/**
 * HistoryStory 초기 데이터 마이그레이션 스크립트
 *
 * 하드코딩된 HistoryStory 콘텐츠를 Firestore로 이전합니다.
 *
 * 실행 방법:
 * node scripts/migrate-history-story.js
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

const COLLECTION_NAME = 'homepage_history_story';

// 마이그레이션할 데이터
const actsData = [
  // Prologue
  {
    id: 'prologue',
    actType: 'prologue',
    order: 0,
    prologueNarrative1: 'In the deepest darkness...',
    prologueNarrative2: 'A light awakens',
    prologueYear: '1936',
    prologueYearSubtitle: 'The Spark of Compassion',
    enabled: true,
  },

  // Act 1: HARDSHIP
  {
    id: 'act1',
    actType: 'act1',
    order: 1,
    actImageUrl:
      'https://images.unsplash.com/photo-1516570161687-0b1a7742d87a?q=80&w=1200&auto=format&fit=crop',
    actTitleEn: 'ACT 1: HARDSHIP',
    actTitleKr: '고난, 그 깊은 뿌리',
    actDescription:
      '전쟁과 폐허 속에서도 꺼지지 않았던 등불.\n류제한 박사의 천막 병원은 절망을 희망으로 바꾸는\n거룩한 성소였습니다.',
    act1PeriodLabel: '1936 - 1953 · The Era of Endurance',
    act1BackgroundText: 'ROOTS',
    enabled: true,
  },

  // Act 2: FOREST OF TRUTH
  {
    id: 'act2',
    actType: 'act2',
    order: 2,
    actTitleEn: 'ACT 2: FOREST OF TRUTH',
    actTitleKr: '진리의 숲을 이루다',
    actDescription: '한 그루의 나무가 숲이 되기까지,\n우리는 멈추지 않고 자라났습니다.',
    act2YearLabels: ['Year 1960', 'Year 1970', 'Year 1980', 'Year 1990'],
    act2BackgroundColor: '#1a1815',
    enabled: true,
  },

  // Act 3: PRISM OF LOVE
  {
    id: 'act3',
    actType: 'act3',
    order: 3,
    actTitleEn: 'ACT 3: PRISM OF LOVE',
    actTitleKr: '세상으로 번지는\n사랑의 빛',
    act3BadgeText: 'Global Impact',
    act3MapLabel: 'Connecting The World',
    enabled: true,
  },

  // Epilogue: PROMISE
  {
    id: 'epilogue',
    actType: 'epilogue',
    order: 4,
    epilogueSubtitleEn: 'Our Promise',
    epilogueTitleKr: '100년을 향한 약속',
    epilogueDescription:
      '지난 90년의 역사가 그러했듯,\n앞으로의 100년도 변함없는 사랑으로\n세상을 비추겠습니다.',
    epilogueButtonText: 'Join the Journey',
    enabled: true,
  },
];

async function migrateHistoryStoryData() {
  try {
    console.log('🚀 HistoryStory 데이터 마이그레이션 시작...\n');

    // 각 Act를 Firestore에 저장
    for (const actData of actsData) {
      const { id, ...data } = actData;

      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection(COLLECTION_NAME).doc(id).set(docData);

      console.log(`✅ ${id} 저장 완료`);
    }

    console.log('\n✅ HistoryStory 데이터 마이그레이션 완료!');
    console.log(`\n📍 총 ${actsData.length}개 Act 저장됨`);
    console.log('📍 Firestore Collection:', COLLECTION_NAME);
    console.log('\n저장된 Act ID:');
    actsData.forEach((act) => {
      console.log(`  - ${act.id} (${act.actType})`);
    });

    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('2. /admin/content/history-story 페이지에서 목록 확인');
    console.log('3. 각 Act 편집 페이지에서 수정 테스트');
    console.log('4. 메인 페이지(/)의 HistoryStory 섹션 확인');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateHistoryStoryData();

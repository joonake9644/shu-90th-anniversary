/**
 * Marquee 초기 데이터 마이그레이션 스크립트
 *
 * 하드코딩된 Marquee 콘텐츠를 Firestore로 이전합니다.
 *
 * 실행 방법:
 * node scripts/migrate-marquee.js
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

const COLLECTION_NAME = 'homepage_marquee';

// 마이그레이션할 데이터
const marqueeTexts = [
  {
    id: 'marquee1',
    position: 1,
    text: 'History of 90 Years',
    direction: 'left',
    speed: 5,
    enabled: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'marquee2',
    position: 2,
    text: 'Toward 100 Years',
    direction: 'right',
    speed: 5,
    enabled: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function migrateMarqueeData() {
  try {
    console.log('🚀 Marquee 데이터 마이그레이션 시작...\n');

    // Firestore에 데이터 저장
    for (const marquee of marqueeTexts) {
      await db.collection(COLLECTION_NAME).doc(marquee.id).set(marquee);
      console.log(`✅ ${marquee.id} 저장 완료`);
    }

    console.log('\n✅ Marquee 데이터 마이그레이션 완료!');
    console.log('\n저장된 데이터:');
    marqueeTexts.forEach(m => {
      console.log(`- ${m.text} (${m.direction}, 속도: ${m.speed})`);
    });
    console.log('\n📍 Firestore 경로:', COLLECTION_NAME);
    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('2. /admin/content/marquee 페이지에서 편집 테스트');
    console.log('3. 메인 페이지(/)에서 변경사항 확인');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateMarqueeData();

/**
 * HeroSection 초기 데이터 마이그레이션 스크립트
 *
 * 하드코딩된 HeroSection 콘텐츠를 Firestore로 이전합니다.
 *
 * 실행 방법:
 * node scripts/migrate-hero.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const COLLECTION_NAME = 'homepage_hero';
const DOC_ID = 'main';

// 마이그레이션할 데이터
const heroData = {
  backgroundImage:
    'https://images.unsplash.com/photo-1730307403182-46906ab72173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaGlzdG9yeSUyMG9sZCUyMGJ1aWxkaW5nJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  badgeText: 'THE 90TH ANNIVERSARY',
  mainNumber: '90',
  mainSubtitle1: 'YEARS',
  mainSubtitle2: 'Of History',
  universityName: 'Sahmyook Health University',
  description: '삼육보건대학교 90주년,\n진심의 교육으로 세상을 치유해온 시간',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function migrateHeroData() {
  try {
    console.log('🚀 HeroSection 데이터 마이그레이션 시작...\n');

    // Firestore에 데이터 저장
    await db.collection(COLLECTION_NAME).doc(DOC_ID).set(heroData);

    console.log('✅ HeroSection 데이터 마이그레이션 완료!');
    console.log('\n저장된 데이터:');
    console.log(JSON.stringify(heroData, null, 2));
    console.log('\n📍 Firestore 경로:', `${COLLECTION_NAME}/${DOC_ID}`);
    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('2. /admin/content/hero 페이지에서 편집 테스트');
    console.log('3. 메인 페이지(/)에서 변경사항 확인');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateHeroData();

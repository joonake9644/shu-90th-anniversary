/**
 * Footer 초기 데이터 마이그레이션 스크립트
 *
 * 하드코딩된 Footer 콘텐츠를 Firestore로 이전합니다.
 *
 * 실행 방법:
 * node scripts/migrate-footer.js
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

const COLLECTION_NAME = 'homepage_footer';
const DOC_ID = 'main';

// 마이그레이션할 데이터
const footerData = {
  brandName: 'SHU 90th',
  slogan: 'Truth · Love · Service',
  description: 'Celebrating 90 years of excellence in health education.\nPreparing for the next century of innovation and service.',
  socialLinks: {
    instagram: 'https://www.instagram.com/shu_university/',
    facebook: 'https://www.facebook.com/sahmyookhealth',
    youtube: 'https://www.youtube.com/@SHU_Official'
  },
  quickLinks: [
    { label: 'History 1936-2026', href: '#' },
    { label: 'Vision 2030', href: '#' },
    { label: 'Campus Map', href: '#' },
    { label: 'Anniversary Events', href: '#' }
  ],
  contact: {
    address: '82 Mangu-ro, Dongdaemun-gu,\nSeoul, Republic of Korea',
    phone: '+82-2212-0082',
    email: 'admin@shu.ac.kr'
  },
  copyrightText: 'Sahmyook Health University. All rights reserved.',
  privacyPolicyUrl: '#',
  termsOfServiceUrl: '#',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function migrateFooterData() {
  try {
    console.log('🚀 Footer 데이터 마이그레이션 시작...\n');

    // Firestore에 데이터 저장
    await db.collection(COLLECTION_NAME).doc(DOC_ID).set(footerData);

    console.log('✅ Footer 데이터 마이그레이션 완료!');
    console.log('\n저장된 데이터:');
    console.log(JSON.stringify(footerData, null, 2));
    console.log('\n📍 Firestore 경로:', `${COLLECTION_NAME}/${DOC_ID}`);
    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('2. /admin/content/footer 페이지에서 편집 테스트');
    console.log('3. 메인 페이지(/) Footer에서 변경사항 확인');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
migrateFooterData();

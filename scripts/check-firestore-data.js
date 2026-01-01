/**
 * Firestore 데이터 현황 확인 스크립트
 * 실행: node scripts/check-firestore-data.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkCollection(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    console.log(`\n📂 ${collectionName}: ${snapshot.size}개 문서`);

    if (snapshot.size > 0) {
      snapshot.docs.forEach((doc, index) => {
        if (index < 3) { // 처음 3개만 표시
          console.log(`   - ${doc.id}: ${JSON.stringify(doc.data()).substring(0, 100)}...`);
        }
      });
      if (snapshot.size > 3) {
        console.log(`   ... 외 ${snapshot.size - 3}개 더`);
      }
    } else {
      console.log(`   ⚠️  비어있음`);
    }
  } catch (error) {
    console.log(`   ❌ 에러: ${error.message}`);
  }
}

async function checkAllData() {
  console.log('🔍 Firestore 데이터 현황 확인\n');
  console.log('='.repeat(60));

  const collections = [
    'homepage_hero',
    'homepage_footer',
    'homepage_marquee',
    'homepage_timeline_intro',
    'homepage_periods',
    'homepage_history_story',
    'news',
    'events',
    'videos',
    'guestbook',
    'story_submissions',
    'statistics_data',
    'history_chapters',
    'newsletter_subscribers'
  ];

  for (const collectionName of collections) {
    await checkCollection(collectionName);
  }

  // Subcollection 확인 (Periods/Highlights)
  console.log('\n📂 homepage_periods/highlights (Subcollection):');
  const periodsSnapshot = await db.collection('homepage_periods').get();
  let totalHighlights = 0;

  for (const periodDoc of periodsSnapshot.docs) {
    const highlightsSnapshot = await periodDoc.ref.collection('highlights').get();
    if (highlightsSnapshot.size > 0) {
      console.log(`   - ${periodDoc.id}: ${highlightsSnapshot.size}개 highlights`);
      totalHighlights += highlightsSnapshot.size;
    }
  }
  console.log(`   총 ${totalHighlights}개 highlights`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ 확인 완료');

  process.exit(0);
}

checkAllData();

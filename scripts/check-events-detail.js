/**
 * Events 컬렉션 상세 확인 스크립트
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function checkEventsDetail() {
  const snapshot = await db.collection('events').get();
  console.log('='.repeat(60));
  console.log('📂 events 컬렉션 상세 확인');
  console.log('='.repeat(60));
  console.log('총 문서 개수:', snapshot.size);
  console.log('');

  if (snapshot.size === 0) {
    console.log('⚠️  events 컬렉션이 비어있습니다!');
    console.log('   마이그레이션이 필요합니다.');
  } else {
    console.log('문서 목록:');
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ID: ${doc.id}`);
      console.log(`   제목: ${data.title || '제목 없음'}`);
      console.log(`   카테고리: ${data.category || '카테고리 없음'}`);
      console.log(`   장소: ${data.location || '장소 없음'}`);
      console.log(`   날짜: ${data.date ? new Date(data.date._seconds * 1000).toLocaleDateString('ko-KR') : '날짜 없음'}`);
      console.log('');
    });
  }

  console.log('='.repeat(60));
  process.exit(0);
}

checkEventsDetail().catch(err => {
  console.error('❌ 에러:', err);
  process.exit(1);
});

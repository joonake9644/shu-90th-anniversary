const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const data = {
  year1936Text: '1936',
  quoteEnglish: 'I never treated anyone with neglect.\nWhether treating Dr. Syngman Rhee or a country woman,\nI always gave my utmost effort.',
  quoteKorean: '나는 어느 누구도 소홀히 치료하지 않았습니다.\n이승만 박사를 치료할 때나 시골의 아낙네를 치료할 때나\n똑같이 나의 최선의 노력을 바쳤습니다.',
  attribution: 'George Henry Rue. M.D (고 류제한 박사 1899-1993)',
  titleLeft: 'History',
  titleRight: '90 Years',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function migrate() {
  try {
    console.log('🚀 TimelineIntro 데이터 마이그레이션 시작...\n');
    await db.collection('homepage_timeline_intro').doc('main').set(data);
    console.log('✅ TimelineIntro 데이터 마이그레이션 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();

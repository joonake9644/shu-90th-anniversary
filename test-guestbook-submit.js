/**
 * 방명록 작성 시뮬레이션 테스트
 * 실행: node test-guestbook-submit.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAFL2UzS-p_NAt3iGpI2V__S8g-B_72kZs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shu-90th-anniversary.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shu-90th-anniversary",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shu-90th-anniversary.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "875713156990",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:875713156990:web:b8ad8badb7e2dbebedc52f"
};

console.log('🔧 Firebase 설정:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testGuestbookSubmit() {
  console.log('\n📝 방명록 작성 시뮬레이션 테스트\n');

  try {
    // "홍길동" 방명록 작성 시뮬레이션
    const formData = {
      name: '홍길동',
      graduationYear: 2024,
      major: '컴퓨터공학과',
      message: '테스트 메시지입니다. 이것은 홍길동이 작성한 방명록입니다.',
      isAnonymous: false,
    };

    console.log('📤 방명록 데이터 작성 중...');
    console.log('   폼 데이터:', formData);

    // addGuestbookEntry 함수와 동일한 로직
    const entry = {
      name: formData.name,
      graduationYear: formData.graduationYear,
      major: formData.major || '',
      message: formData.message,
      isAnonymous: formData.isAnonymous,
      likes: 0,
      approved: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('\n📦 Firestore에 저장할 데이터:', entry);
    console.log('\n⏳ Firestore에 저장 중...');

    const docRef = await addDoc(collection(db, 'guestbook'), entry);

    console.log('\n✅ 방명록 작성 성공!');
    console.log('   문서 ID:', docRef.id);
    console.log('   컬렉션: guestbook');

    console.log('\n🌐 Firebase Console에서 확인:');
    console.log(`  https://console.firebase.google.com/project/shu-90th-anniversary/firestore/data/guestbook/${docRef.id}`);

    return true;
  } catch (error) {
    console.error('\n❌ 방명록 작성 실패:', error);
    console.error('에러 상세:');
    console.error('  - 메시지:', error.message);
    console.error('  - 코드:', error.code);
    console.error('  - 전체:', error);

    if (error.code === 'permission-denied') {
      console.log('\n⚠️  권한 오류 발생!');
      console.log('   Firestore 보안 규칙을 확인하세요.');
      console.log('   firebase deploy --only firestore 명령으로 규칙을 배포했는지 확인하세요.');
    }

    return false;
  }
}

testGuestbookSubmit().then((success) => {
  console.log('\n' + '='.repeat(80));
  if (success) {
    console.log('✅ 테스트 성공: 방명록이 정상적으로 저장되었습니다.');
    console.log('   이제 check-guestbook.js를 실행하여 데이터를 확인하세요.');
  } else {
    console.log('❌ 테스트 실패: 방명록 저장 중 오류가 발생했습니다.');
  }
  console.log('='.repeat(80));
  process.exit(success ? 0 : 1);
});

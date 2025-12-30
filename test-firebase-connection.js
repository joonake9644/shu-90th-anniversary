/**
 * Firebase 연결 및 데이터 저장 테스트
 * Node.js로 실행: node test-firebase-connection.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, Timestamp } = require('firebase/firestore');

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

async function testGuestbook() {
  console.log('\n📝 방명록 테스트 시작...');

  try {
    // 테스트 데이터 추가
    const testEntry = {
      name: '테스트 사용자',
      graduationYear: 2024,
      major: '테스트학과',
      message: 'Firebase 연결 테스트 메시지입니다.',
      isAnonymous: false,
      likes: 0,
      approved: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('📤 방명록 데이터 추가 중...');
    const docRef = await addDoc(collection(db, 'guestbook'), testEntry);
    console.log('✅ 방명록 추가 성공! 문서 ID:', docRef.id);

    // 데이터 조회
    console.log('📥 방명록 데이터 조회 중...');
    const querySnapshot = await getDocs(collection(db, 'guestbook'));
    console.log(`✅ 총 ${querySnapshot.size}개의 방명록 발견`);

    return true;
  } catch (error) {
    console.error('❌ 방명록 테스트 실패:', error.message);
    console.error('에러 코드:', error.code);
    return false;
  }
}

async function testStory() {
  console.log('\n📖 사연 보내기 테스트 시작...');

  try {
    // 테스트 데이터 추가
    const testStory = {
      name: '테스트 작성자',
      email: 'test@example.com',
      graduationYear: 2020,
      title: 'Firebase 연결 테스트',
      content: '이것은 Firebase 연결을 테스트하기 위한 사연입니다.',
      isApproved: false,
      createdAt: Timestamp.now(),
    };

    console.log('📤 사연 데이터 추가 중...');
    const docRef = await addDoc(collection(db, 'story_submissions'), testStory);
    console.log('✅ 사연 추가 성공! 문서 ID:', docRef.id);

    // 데이터 조회 (관리자만 볼 수 있으므로 에러 발생 가능)
    console.log('📥 사연 데이터 조회 중...');
    try {
      const querySnapshot = await getDocs(collection(db, 'story_submissions'));
      console.log(`✅ 총 ${querySnapshot.size}개의 사연 발견`);
    } catch (readError) {
      console.log('ℹ️  사연 조회 제한 (보안 규칙: 승인된 사연만 읽기 가능)');
    }

    return true;
  } catch (error) {
    console.error('❌ 사연 테스트 실패:', error.message);
    console.error('에러 코드:', error.code);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Firebase 연결 테스트 시작\n');
  console.log('=' .repeat(50));

  const guestbookResult = await testGuestbook();
  const storyResult = await testStory();

  console.log('\n' + '='.repeat(50));
  console.log('📊 테스트 결과:');
  console.log(`  방명록: ${guestbookResult ? '✅ 성공' : '❌ 실패'}`);
  console.log(`  사연 보내기: ${storyResult ? '✅ 성공' : '❌ 실패'}`);
  console.log('=' .repeat(50));

  console.log('\n🌐 Firebase Console에서 확인:');
  console.log('  https://console.firebase.google.com/project/shu-90th-anniversary/firestore');

  process.exit(guestbookResult && storyResult ? 0 : 1);
}

runTests();

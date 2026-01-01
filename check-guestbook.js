/**
 * 방명록 데이터 확인 스크립트
 * 실행: node check-guestbook.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

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

async function checkGuestbook() {
  console.log('\n📝 방명록 데이터 확인 중...\n');

  try {
    // 모든 방명록 데이터 조회
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    console.log(`✅ 총 ${querySnapshot.size}개의 방명록 항목 발견\n`);
    console.log('='.repeat(80));

    if (querySnapshot.size === 0) {
      console.log('⚠️  방명록 컬렉션이 비어있습니다.');
      console.log('   메인 홈페이지에서 방명록 작성이 제대로 저장되지 않았을 수 있습니다.\n');
      return;
    }

    // 각 항목 출력
    let index = 1;
    let foundHongGilDong = false;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n[${index}] 문서 ID: ${doc.id}`);
      console.log(`   이름: ${data.name || '(없음)'}`);
      console.log(`   졸업연도: ${data.graduationYear || '(없음)'}`);
      console.log(`   전공: ${data.major || '(없음)'}`);
      console.log(`   메시지: ${data.message?.substring(0, 50) || '(없음)'}${data.message?.length > 50 ? '...' : ''}`);
      console.log(`   익명 여부: ${data.isAnonymous ? '익명' : '실명'}`);
      console.log(`   좋아요: ${data.likes || 0}`);
      console.log(`   승인 상태: ${data.approved !== false ? '승인됨' : '대기중'}`);

      if (data.createdAt) {
        const date = data.createdAt.toDate();
        console.log(`   작성일: ${date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`);
      }

      console.log('-'.repeat(80));

      if (data.name === '홍길동') {
        foundHongGilDong = true;
      }

      index++;
    });

    console.log('\n');
    if (foundHongGilDong) {
      console.log('✅ "홍길동" 이름의 방명록이 발견되었습니다.');
    } else {
      console.log('❌ "홍길동" 이름의 방명록이 발견되지 않았습니다.');
      console.log('   최근에 작성한 방명록이 저장되지 않았을 수 있습니다.');
    }

    console.log('\n🌐 Firebase Console에서 확인:');
    console.log('  https://console.firebase.google.com/project/shu-90th-anniversary/firestore/data/guestbook\n');

  } catch (error) {
    console.error('❌ 방명록 조회 실패:', error.message);
    console.error('에러 코드:', error.code);
    if (error.code === 'permission-denied') {
      console.log('\n⚠️  권한 오류: Firestore 보안 규칙을 확인해주세요.');
    }
  }
}

checkGuestbook().then(() => process.exit(0));

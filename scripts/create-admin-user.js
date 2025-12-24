/**
 * Firebase Admin SDK를 사용한 관리자 계정 생성 스크립트
 *
 * 사용법:
 * 1. Firebase Console에서 Service Account 키 다운로드
 * 2. FIREBASE_SERVICE_ACCOUNT 환경변수 설정
 * 3. node scripts/create-admin-user.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  try {
    // Service Account 키 확인
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountPath) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.');
      console.log('\n해결 방법:');
      console.log('1. Firebase Console > Project Settings > Service Accounts');
      console.log('2. "Generate new private key" 클릭하여 JSON 파일 다운로드');
      console.log('3. 환경변수 설정: set FIREBASE_SERVICE_ACCOUNT=경로\\serviceAccountKey.json');
      process.exit(1);
    }

    // Firebase Admin 초기화
    const path = require('path');
    const resolvedPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(process.cwd(), serviceAccountPath);
    const serviceAccount = require(resolvedPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin SDK 초기화 완료\n');

    // 사용자 정보 입력
    const email = await question('관리자 이메일: ');
    const password = await question('비밀번호 (최소 6자): ');
    const displayName = await question('표시 이름 (선택, Enter로 건너뛰기): ');

    // 사용자 생성
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName || undefined,
      emailVerified: true,
    });

    console.log('\n✅ 관리자 계정 생성 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('사용자 UID:', userRecord.uid);
    console.log('이메일:', userRecord.email);
    console.log('표시 이름:', userRecord.displayName || '(없음)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n로그인 테스트:');
    console.log('https://shu-90th-anniversary.vercel.app/admin/login');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);

    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 해당 이메일은 이미 존재합니다.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 유효하지 않은 이메일 형식입니다.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n💡 비밀번호가 너무 약합니다. 최소 6자 이상 입력하세요.');
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdminUser();

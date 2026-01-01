/**
 * 🔍 Firebase 연결 진단 스크립트
 *
 * 목적: 로컬과 프로덕션 환경의 Firebase 연결 상태를 철저히 검증
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

console.log('='.repeat(70));
console.log('🔍 Firebase 연결 진단 시작');
console.log('='.repeat(70));
console.log('');

// 환경 변수 확인
console.log('📋 1단계: 환경 변수 검증');
console.log('-'.repeat(70));

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// .env.local 파일 읽기
const envPath = path.join(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });
  console.log('✅ .env.local 파일 발견');
} else {
  console.log('❌ .env.local 파일이 없습니다!');
  process.exit(1);
}

console.log('');
console.log('환경 변수 값:');
requiredEnvVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    // API Key와 App ID는 일부만 표시
    if (varName.includes('API_KEY') || varName.includes('APP_ID')) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`  ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`  ❌ ${varName}: MISSING!`);
  }
});

console.log('');
console.log('📋 2단계: Admin SDK 초기화 검증');
console.log('-'.repeat(70));

// Service Account Key 확인
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.log('❌ serviceAccountKey.json 파일이 없습니다!');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
console.log(`✅ Service Account 로드 완료`);
console.log(`   Project ID: ${serviceAccount.project_id}`);
console.log(`   Client Email: ${serviceAccount.client_email}`);

// Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Admin SDK 초기화 완료');
}

const db = admin.firestore();
const storage = admin.storage();

console.log('');
console.log('📋 3단계: 프로젝트 ID 일치 검증');
console.log('-'.repeat(70));

const clientProjectId = envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
const adminProjectId = serviceAccount.project_id;

if (clientProjectId === adminProjectId) {
  console.log(`✅ 프로젝트 ID 일치: ${clientProjectId}`);
} else {
  console.log(`❌ 프로젝트 ID 불일치!`);
  console.log(`   클라이언트: ${clientProjectId}`);
  console.log(`   Admin SDK: ${adminProjectId}`);
  console.log('');
  console.log('⚠️ 이것이 로컬과 프로덕션이 다른 Firebase를 사용하는 원인일 수 있습니다!');
  process.exit(1);
}

console.log('');
console.log('📋 4단계: Firestore 연결 테스트');
console.log('-'.repeat(70));

async function testFirestore() {
  try {
    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.limit(1).get();

    console.log(`✅ Firestore 연결 성공`);
    console.log(`   컬렉션: events`);
    console.log(`   문서 개수: ${snapshot.size}`);

    if (snapshot.size > 0) {
      const firstDoc = snapshot.docs[0];
      console.log(`   첫 번째 문서 ID: ${firstDoc.id}`);
      console.log(`   첫 번째 문서 제목: ${firstDoc.data().title || 'N/A'}`);
    }
  } catch (error) {
    console.log(`❌ Firestore 연결 실패`);
    console.log(`   에러: ${error.message}`);
  }
}

console.log('');
console.log('📋 5단계: Storage Bucket 검증');
console.log('-'.repeat(70));

const clientStorageBucket = envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'];
const adminStorageBucket = `${adminProjectId}.appspot.com`;

console.log(`클라이언트 Storage Bucket: ${clientStorageBucket}`);
console.log(`Admin SDK 기본 Bucket: ${adminStorageBucket}`);

if (clientStorageBucket.includes(adminProjectId)) {
  console.log(`✅ Storage Bucket이 프로젝트 ID를 포함함`);
} else {
  console.log(`⚠️ Storage Bucket이 프로젝트 ID를 포함하지 않음`);
  console.log(`   이것은 정상일 수 있으나, 확인이 필요합니다.`);
}

console.log('');
console.log('📋 6단계: 잠재적 실패 지점 (Silent Failures) 분석');
console.log('-'.repeat(70));

console.log(`
🔍 확인해야 할 잠재적 실패 지점:

1. ❌ 환경 변수 미주입
   - Vercel에서 환경 변수가 설정되어 있어도, 배포 시점에 주입되지 않았을 수 있음
   - 해결: Vercel Dashboard > Settings > Environment Variables 재확인
   - 해결: vercel env pull 명령어로 로컬에 동기화

2. ❌ 빌드 캐시 문제
   - Next.js가 이전 빌드의 환경 변수를 캐시했을 수 있음
   - 해결: .next 폴더 삭제 후 재빌드
   - 해결: Vercel에서 "Redeploy" 시 "Clear Build Cache" 체크

3. ❌ 클라이언트 사이드 환경 변수 누락
   - process.env가 브라우저에서 undefined일 수 있음
   - 해결: NEXT_PUBLIC_ 접두사 확인
   - 해결: 브라우저 콘솔에서 확인 필요

4. ❌ 보안 규칙 차단
   - Firestore/Storage 규칙이 읽기/쓰기를 차단 중
   - 해결: Firebase Console > Firestore/Storage > Rules 확인

5. ❌ 비동기 처리 누락
   - await 없이 호출하여 Promise가 resolve되지 않음
   - 해결: 모든 Firestore/Storage 호출에 await 확인

6. ❌ Silent Try-Catch
   - 에러를 로그 없이 삼킴
   - 해결: 모든 catch 블록에 console.error 추가
`);

console.log('');
console.log('📋 7단계: 실행 결과');
console.log('-'.repeat(70));

testFirestore().then(() => {
  console.log('');
  console.log('='.repeat(70));
  console.log('✅ 진단 완료');
  console.log('='.repeat(70));
  console.log('');
  console.log('다음 단계:');
  console.log('1. 로컬 개발 서버를 실행하세요: npm run dev');
  console.log('2. 브라우저에서 http://localhost:3000/firebase-diagnostic.html 접속');
  console.log('3. 모든 테스트 버튼을 클릭하여 실제 브라우저 환경을 검증');
  console.log('4. 브라우저 콘솔과 Network 탭을 확인');
  console.log('');
  console.log('실서버 검증:');
  console.log('1. https://shu-90th-anniversary.vercel.app/firebase-diagnostic.html 접속');
  console.log('2. 동일한 테스트를 실행');
  console.log('3. 로컬과 실서버의 결과를 비교');
  console.log('');
  process.exit(0);
}).catch(err => {
  console.error('❌ 진단 중 에러 발생:', err);
  process.exit(1);
});

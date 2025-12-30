/**
 * Firebase Storage 파일 목록 확인 스크립트
 *
 * 사용법: node check-storage.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin 초기화
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'shu-90th-anniversary.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function listAllFiles() {
  try {
    console.log('🔍 Firebase Storage 파일 목록 확인 중...\n');

    const [files] = await bucket.getFiles();

    if (files.length === 0) {
      console.log('⚠️  Storage에 파일이 없습니다.\n');
      return;
    }

    console.log(`📦 총 ${files.length}개의 파일이 있습니다.\n`);

    // 폴더별로 그룹화
    const filesByFolder = {};

    files.forEach(file => {
      const filePath = file.name;
      const folder = filePath.split('/')[0];

      if (!filesByFolder[folder]) {
        filesByFolder[folder] = [];
      }

      filesByFolder[folder].push({
        name: filePath,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        updated: file.metadata.updated
      });
    });

    // 폴더별 출력
    for (const [folder, fileList] of Object.entries(filesByFolder)) {
      console.log(`\n📁 ${folder}/ (${fileList.length}개 파일)`);
      console.log('─'.repeat(80));

      fileList.forEach(file => {
        const sizeInKB = (parseInt(file.size) / 1024).toFixed(2);
        console.log(`  📄 ${file.name}`);
        console.log(`     크기: ${sizeInKB} KB | 타입: ${file.contentType}`);
        console.log(`     수정: ${new Date(file.updated).toLocaleString('ko-KR')}`);
      });
    }

    console.log('\n✅ 파일 목록 확인 완료!\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);

    if (error.code === 'ENOENT') {
      console.log('\n⚠️  serviceAccountKey.json 파일이 없습니다.');
      console.log('Firebase Console에서 서비스 계정 키를 다운로드하세요:');
      console.log('https://console.firebase.google.com/project/shu-90th-anniversary/settings/serviceaccounts/adminsdk\n');
    }
  }
}

listAllFiles();

/**
 * 모든 Unsplash 이미지를 Firebase Storage로 마이그레이션
 *
 * 실행: node scripts/migrate-images-to-storage.js
 */

const admin = require('firebase-admin');
const https = require('https');
const { URL } = require('url');
const serviceAccount = require('../serviceAccountKey.json');

// Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'shu-90th-anniversary.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// 이미지 다운로드 함수
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// 이미지를 Storage에 업로드하고 URL 반환
async function migrateImageToStorage(imageUrl, folder, filename) {
  try {
    console.log(`  📥 다운로드: ${imageUrl.substring(0, 80)}...`);

    // 이미지 다운로드
    const imageBuffer = await downloadImage(imageUrl);

    // Storage에 업로드
    const filePath = `${folder}/${filename}`;
    const file = bucket.file(filePath);

    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          originalUrl: imageUrl
        }
      }
    });

    // Public URL 생성
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    console.log(`  ✅ 업로드 완료: ${publicUrl}`);
    return publicUrl;

  } catch (error) {
    console.error(`  ❌ 실패: ${error.message}`);
    return imageUrl; // 실패 시 원본 URL 유지
  }
}

// 컬렉션별 이미지 마이그레이션
async function migrateCollection(collectionName, imageFields) {
  console.log(`\n📂 ${collectionName} 컬렉션 처리 중...`);

  const snapshot = await db.collection(collectionName).get();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = {};
    let hasUpdates = false;

    for (const field of imageFields) {
      const imageUrl = data[field];

      if (imageUrl && imageUrl.includes('unsplash.com')) {
        // Unsplash URL에서 이미지 ID 추출
        const urlObj = new URL(imageUrl);
        const imageId = urlObj.pathname.split('/').pop();
        const filename = `${imageId}.jpg`;

        // Storage에 업로드
        const newUrl = await migrateImageToStorage(
          imageUrl,
          collectionName,
          filename
        );

        if (newUrl !== imageUrl) {
          updates[field] = newUrl;
          hasUpdates = true;
        }
      }
    }

    if (hasUpdates) {
      await doc.ref.update(updates);
      count++;
      console.log(`  ✓ 문서 업데이트: ${doc.id}`);
    }
  }

  console.log(`✅ ${collectionName} 완료: ${count}개 문서 업데이트`);
  return count;
}

// Subcollection 처리 (Periods/Highlights)
async function migratePeriodHighlights() {
  console.log(`\n📂 homepage_periods/highlights 처리 중...`);

  const periodsSnapshot = await db.collection('homepage_periods').get();
  let count = 0;

  for (const periodDoc of periodsSnapshot.docs) {
    const periodData = periodDoc.data();

    // Period의 heroMedia 처리
    if (periodData.heroMedia && periodData.heroMedia.includes('unsplash.com')) {
      const urlObj = new URL(periodData.heroMedia);
      const imageId = urlObj.pathname.split('/').pop();
      const filename = `period-${periodDoc.id}-${imageId}.jpg`;

      const newUrl = await migrateImageToStorage(
        periodData.heroMedia,
        'periods',
        filename
      );

      if (newUrl !== periodData.heroMedia) {
        await periodDoc.ref.update({ heroMedia: newUrl });
        console.log(`  ✓ Period 업데이트: ${periodDoc.id}`);
        count++;
      }
    }

    // Highlights 처리
    const highlightsSnapshot = await periodDoc.ref.collection('highlights').get();

    for (const highlightDoc of highlightsSnapshot.docs) {
      const highlightData = highlightDoc.data();

      if (highlightData.thumb && highlightData.thumb.includes('unsplash.com')) {
        const urlObj = new URL(highlightData.thumb);
        const imageId = urlObj.pathname.split('/').pop();
        const filename = `highlight-${highlightDoc.id}-${imageId}.jpg`;

        const newUrl = await migrateImageToStorage(
          highlightData.thumb,
          'highlights',
          filename
        );

        if (newUrl !== highlightData.thumb) {
          await highlightDoc.ref.update({ thumb: newUrl });
          console.log(`  ✓ Highlight 업데이트: ${highlightDoc.id}`);
          count++;
        }
      }
    }
  }

  console.log(`✅ Periods/Highlights 완료: ${count}개 문서 업데이트`);
  return count;
}

// 메인 함수
async function migrateAllImages() {
  console.log('🚀 이미지 마이그레이션 시작...\n');
  console.log('=' .repeat(60));

  let totalUpdates = 0;

  try {
    // 1. Hero
    totalUpdates += await migrateCollection('homepage_hero', ['backgroundImage']);

    // 2. News
    totalUpdates += await migrateCollection('news', ['thumbnail']);

    // 3. Events
    totalUpdates += await migrateCollection('events', ['image']);

    // 4. Videos
    totalUpdates += await migrateCollection('videos', ['thumbnail']);

    // 5. Periods & Highlights
    totalUpdates += await migratePeriodHighlights();

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 마이그레이션 완료!`);
    console.log(`   총 ${totalUpdates}개 이미지 업데이트됨`);
    console.log('=' .repeat(60));

    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 Storage 확인');
    console.log('   https://console.firebase.google.com/project/shu-90th-anniversary/storage');
    console.log('2. 메인 홈페이지에서 이미지 확인');
    console.log('   http://localhost:3001/');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }

  process.exit(0);
}

// 실행
migrateAllImages();

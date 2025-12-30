/**
 * 관리자 페이지 서브페이지 콘텐츠 연동 테스트
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAFL2UzS-p_NAt3iGpI2V__S8g-B_72kZs",
  authDomain: "shu-90th-anniversary.firebaseapp.com",
  projectId: "shu-90th-anniversary",
  storageBucket: "shu-90th-anniversary.firebasestorage.app",
  messagingSenderId: "875713156990",
  appId: "1:875713156990:web:b8ad8badb7e2dbebedc52f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let testResults = [];

async function testCollection(name, collectionName, testDoc, useSetDoc = false) {
  console.log(`\n📋 ${name} 테스트 시작...`);

  try {
    // 1. 생성 테스트
    console.log('  ✍️  데이터 생성 중...');
    let docId;
    if (useSetDoc) {
      docId = 'test-doc';
      await setDoc(doc(db, collectionName, docId), testDoc);
    } else {
      const docRef = await addDoc(collection(db, collectionName), testDoc);
      docId = docRef.id;
    }
    console.log(`  ✅ 생성 성공 (ID: ${docId})`);

    // 2. 읽기 테스트
    console.log('  📖 데이터 읽기 중...');
    const querySnapshot = await getDocs(collection(db, collectionName));
    console.log(`  ✅ 읽기 성공 (총 ${querySnapshot.size}개)`);

    // 3. 수정 테스트
    console.log('  ✏️  데이터 수정 중...');
    await updateDoc(doc(db, collectionName, docId), {
      updatedAt: Timestamp.now(),
      testField: 'updated'
    });
    console.log('  ✅ 수정 성공');

    // 4. 삭제 테스트
    console.log('  🗑️  데이터 삭제 중...');
    await deleteDoc(doc(db, collectionName, docId));
    console.log('  ✅ 삭제 성공');

    testResults.push({ name, status: '✅ 성공' });
    return true;
  } catch (error) {
    console.error(`  ❌ ${name} 테스트 실패:`, error.message);
    console.error('  에러 코드:', error.code);
    testResults.push({ name, status: `❌ 실패 (${error.code})` });
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 관리자 페이지 서브페이지 콘텐츠 연동 테스트\n');
  console.log('='.repeat(60));

  // 1. Hero Section
  await testCollection(
    'Hero Section',
    'homepage_hero',
    {
      backgroundImage: 'https://example.com/test.jpg',
      badgeText: 'TEST',
      mainNumber: '90',
      mainSubtitle1: 'YEARS',
      mainSubtitle2: 'Test',
      universityName: 'Test University',
      description: 'Test description',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    true
  );

  // 2. Footer
  await testCollection(
    'Footer',
    'homepage_footer',
    {
      brandName: 'Test Brand',
      slogan: 'Test Slogan',
      description: 'Test description',
      socialLinks: { instagram: '', facebook: '', youtube: '' },
      quickLinks: [],
      contact: { address: '', phone: '', email: '' },
      copyrightText: 'Test Copyright',
      privacyPolicyUrl: '#',
      termsOfServiceUrl: '#',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    true
  );

  // 3. Marquee
  await testCollection(
    'Marquee',
    'homepage_marquee',
    {
      position: 1,
      text: 'Test Marquee',
      direction: 'left',
      speed: 5,
      enabled: true
    }
  );

  // 4. Timeline Intro
  await testCollection(
    'Timeline Intro',
    'homepage_timeline_intro',
    {
      year1936Text: '1936',
      quoteEnglish: 'Test quote',
      quoteKorean: '테스트 인용구',
      attribution: 'Test Author',
      titleLeft: 'Test',
      titleRight: 'Title',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    true
  );

  // 5. Periods
  await testCollection(
    '6단계 역사 (Periods)',
    'homepage_periods',
    {
      order: 99,
      rangeLabel: '2020 ~ 2024',
      yearStart: 2020,
      yearEnd: 2024,
      title: 'Test Period',
      subtitle: 'Test subtitle',
      heroMedia: 'https://example.com/test.jpg',
      enabled: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  );

  // 6. Videos
  await testCollection(
    '영상으로 보는 90 (Videos)',
    'videos',
    {
      title: 'Test Video',
      description: 'Test description',
      year: '2024',
      duration: '5:00',
      thumbnail: 'https://example.com/test.jpg',
      videoUrl: 'https://youtube.com/test',
      category: '테스트',
      period: '2020-2024',
      order: 99,
      featured: false,
      enabled: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  );

  // 7. Statistics
  await testCollection(
    '숫자로 보는 90 (Statistics)',
    'statistics_data',
    {
      stats: [{ id: 'test', number: 90, suffix: '년', label: 'Test', description: 'Test', order: 1, enabled: true }],
      milestones: [],
      detailStats: [],
      research: { papers: 0, projects: 0, investment: 0 },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    true
  );

  // 8. History Chapters
  await testCollection(
    '역사 갤러리 (History Chapters)',
    'history_chapters',
    {
      chapter: 99,
      title: 'Test Chapter',
      periodLabel: '2020-2024',
      description: 'Test description',
      images: [],
      videoUrl: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  );

  // 9. 뉴스
  await testCollection(
    '뉴스',
    'news',
    {
      title: 'Test News',
      summary: 'Test summary',
      content: 'Test content',
      thumbnail: 'https://example.com/test.jpg',
      author: 'Test Author',
      category: 'test',
      publishedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    }
  );

  // 10. 이벤트
  await testCollection(
    '이벤트',
    'events',
    {
      title: 'Test Event',
      description: 'Test description',
      date: Timestamp.now(),
      location: 'Test Location',
      image: 'https://example.com/test.jpg',
      registrationLink: '',
      category: 'test',
      createdAt: Timestamp.now()
    }
  );

  console.log('\n' + '='.repeat(60));
  console.log('📊 테스트 결과 요약:\n');

  testResults.forEach(({ name, status }) => {
    console.log(`  ${status.padEnd(15)} ${name}`);
  });

  const successCount = testResults.filter(r => r.status.startsWith('✅')).length;
  const totalCount = testResults.length;

  console.log('\n' + '='.repeat(60));
  console.log(`✨ 완료: ${successCount}/${totalCount} 성공`);

  if (successCount === totalCount) {
    console.log('🎉 모든 관리자 페이지 콘텐츠 연동이 정상 작동합니다!');
  } else {
    console.log('⚠️  일부 테스트가 실패했습니다. 위 결과를 확인하세요.');
  }

  console.log('\n🌐 Firebase Console:');
  console.log('  https://console.firebase.google.com/project/shu-90th-anniversary/firestore');

  process.exit(successCount === totalCount ? 0 : 1);
}

runAllTests();

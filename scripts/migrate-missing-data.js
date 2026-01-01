/**
 * 누락된 데이터 마이그레이션 (Statistics & History Chapters)
 * 실행: node scripts/migrate-missing-data.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateStatistics() {
  console.log('\n📊 Statistics 데이터 마이그레이션...');

  const statisticsData = {
    stats: [
      {
        id: 'years',
        number: 90,
        suffix: '년',
        label: 'Years of Excellence',
        description: '1936년부터 현재까지',
        order: 1,
        enabled: true
      },
      {
        id: 'alumni',
        number: 50000,
        suffix: '+',
        label: 'Proud Alumni',
        description: '전 세계로 뻗어나간 동문',
        order: 2,
        enabled: true
      },
      {
        id: 'partners',
        number: 120,
        suffix: '+',
        label: 'Global Partners',
        description: '협력 대학 및 기관',
        order: 3,
        enabled: true
      },
      {
        id: 'services',
        number: 1500,
        suffix: '+',
        label: 'Community Services',
        description: '지역사회 의료 봉사',
        order: 4,
        enabled: true
      }
    ],
    milestones: [
      { year: 1936, students: 30, label: '개교' },
      { year: 1948, students: 100, label: '전문학교 승격' },
      { year: 1979, students: 500, label: '전문대학 승격' },
      { year: 1998, students: 1200, label: '종합 보건대학' },
      { year: 2013, students: 3000, label: 'WCC 선정' },
      { year: 2026, students: 4500, label: '90주년' }
    ],
    detailStats: [
      {
        id: 'departments',
        number: 15,
        suffix: '개',
        label: '학과 및 전공',
        items: ['간호학과', '치위생과', '물리치료과', '방사선과', '임상병리과', '...외 10개']
      },
      {
        id: 'employment',
        number: 95,
        suffix: '%',
        label: '취업률',
        items: ['전문대학 최상위권', '보건 계열 1위', '산학협력 우수']
      },
      {
        id: 'countries',
        number: 20,
        suffix: '개국',
        label: '해외 교류국',
        items: ['미국', '일본', '중국', '필리핀', '태국', '...외 15개국']
      },
      {
        id: 'scholarship',
        number: 30,
        suffix: '억원',
        label: '연간 장학금',
        items: ['성적 우수 장학금', '생활비 지원', '해외 연수 지원']
      },
      {
        id: 'dormitory',
        number: 500,
        suffix: '석',
        label: '기숙사 수용 인원',
        items: ['최신 시설', '쾌적한 환경', '24시간 관리']
      },
      {
        id: 'partnerships',
        number: 100,
        suffix: '개',
        label: '산학협력 기업',
        items: ['대형 병원', '의료 기관', '연구소', '기업체']
      }
    ],
    research: {
      papers: 200,
      projects: 50,
      investment: 10
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('statistics_data').doc('main').set(statisticsData);
  console.log('✅ Statistics 데이터 저장 완료');
}

async function migrateHistoryChapters() {
  console.log('\n📚 History Chapters 데이터 마이그레이션...');

  const historyChapters = [
    {
      id: 'chapter-1',
      order: 1,
      year: '1936',
      title: '별빛의 시작',
      subtitle: 'The First Star',
      description: '1936년, 경성요양병원 부속 간호원 양성소로 시작된 우리의 여정. 어둠 속에서도 빛나는 첫 번째 별.',
      backgroundImage: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=1920',
      heroQuote: '진리, 사랑, 봉사의 씨앗이 뿌려지다',
      content: '1936년, 일제강점기의 어두운 시대. 하지만 희망의 불씨는 꺼지지 않았습니다. 경성요양병원 부속 간호원 양성소가 설립되며, 진리와 사랑, 봉사의 정신이 이 땅에 뿌려졌습니다.',
      enabled: true
    },
    {
      id: 'chapter-2',
      order: 2,
      year: '1948',
      title: '전란 속의 빛',
      subtitle: 'Light Through Darkness',
      description: '전쟁의 포화 속에서도 꺼지지 않은 교육의 불씨. 우리는 계속 전진했습니다.',
      backgroundImage: 'https://images.unsplash.com/photo-1717995045633-2579ba884150?w=1920',
      heroQuote: '시련 속에서 더욱 강해지다',
      content: '6.25 전쟁의 혼란 속에서도 우리의 교육은 멈추지 않았습니다. 서울위생병원 간호고등기술학교로 승격하며, 더욱 체계적인 전문 교육의 기틀을 마련했습니다.',
      enabled: true
    },
    {
      id: 'chapter-3',
      order: 3,
      year: '1974',
      title: '성장의 별자리',
      subtitle: 'Constellation of Growth',
      description: '캠퍼스가 확장되고, 학생들의 꿈이 더 넓어지던 시기. 별들이 모여 별자리를 이루다.',
      backgroundImage: 'https://images.unsplash.com/photo-1589982334488-2ce2b65244ed?w=1920',
      heroQuote: '전문 대학으로의 도약',
      content: '1974년, 새로운 학관이 건축되고 캠퍼스가 확장되었습니다. 늘어나는 학생들과 함께 우리의 꿈도 더욱 커져갔습니다. 전문대학으로서의 기틀을 완벽하게 갖추었습니다.',
      enabled: true
    },
    {
      id: 'chapter-4',
      order: 4,
      year: '2013',
      title: '세계로 빛나는 별',
      subtitle: 'A Star on the World Stage',
      description: 'WCC 선정. 우리의 별빛이 세계로 뻗어나가다.',
      backgroundImage: 'https://images.unsplash.com/photo-1758432274762-71b4c4572728?w=1920',
      heroQuote: '세계가 인정한 우수성',
      content: '2013년, 세계적 수준의 전문대학(WCC)으로 선정되었습니다. 대한민국을 넘어 세계가 인정하는 보건의료 교육기관으로 우뚝 섰습니다.',
      enabled: true
    },
    {
      id: 'chapter-5',
      order: 5,
      year: '2023',
      title: '미래를 비추는 별',
      subtitle: 'Illuminating the Future',
      description: 'AI와 헬스케어의 융합. 미래 의료를 선도하는 빛.',
      backgroundImage: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=1920',
      heroQuote: '4차 산업혁명을 선도하다',
      content: 'AI 융합 교육 플랫폼을 구축하며 미래 의료 교육을 선도합니다. 인공지능과 헬스케어의 융합으로 새로운 시대를 열어가고 있습니다.',
      enabled: true
    },
    {
      id: 'chapter-6',
      order: 6,
      year: '2026',
      title: '영원한 별빛',
      subtitle: 'Eternal Starlight',
      description: '90년의 빛, 그리고 100주년을 향한 새로운 여정. 우리의 별빛은 영원히 빛날 것입니다.',
      backgroundImage: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=1920',
      heroQuote: '100주년을 향한 새로운 시작',
      content: '개교 90주년을 맞이하며, 우리는 100주년을 향한 새로운 비전을 선포합니다. 90년간 축적된 경험과 전통을 바탕으로, 더욱 찬란한 미래를 향해 나아갑니다.',
      enabled: true
    }
  ];

  for (const chapter of historyChapters) {
    await db.collection('history_chapters').doc(chapter.id).set({
      ...chapter,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  ✓ ${chapter.id} 저장 완료`);
  }

  console.log(`✅ History Chapters 데이터 저장 완료 (${historyChapters.length}개)`);
}

async function main() {
  console.log('🚀 누락된 데이터 마이그레이션 시작\n');
  console.log('='.repeat(60));

  try {
    await migrateStatistics();
    await migrateHistoryChapters();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 마이그레이션 완료!');
    console.log('\n다음 단계:');
    console.log('1. Firebase Console에서 데이터 확인');
    console.log('   https://console.firebase.google.com/project/shu-90th-anniversary/firestore');
    console.log('2. 메인 홈페이지에서 통계 및 역사 확인');
    console.log('   http://localhost:3001/');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();

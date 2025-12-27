const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// timelineData from src/data/timelineData.ts
const timelineData = [
  {
    id: 'period-1',
    order: 1,
    rangeLabel: '1936 ~ 1946',
    yearStart: 1936,
    yearEnd: 1946,
    title: 'Beginning 태동기',
    subtitle: '민족의 건강과 교육을 위한 첫 걸음\nFirst Step for Nation\'s Health',
    heroMedia: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG9zcGl0YWwlMjAxOTMwc3xlbnwxfHx8fDE3NjU5NjM2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h1',
        order: 1,
        title: '경성요양병원 부속 간호원 양성소 설립',
        year: '1936',
        thumb: 'https://images.unsplash.com/photo-1726313475738-5c8428158210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwa29yZWFuJTIwc3R1ZGVudHMlMjAxOTUwc3xlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '진리, 사랑, 봉사의 이념으로 첫 발을 내딛다.\nFounded with Truth, Love, and Service.',
        enabled: true,
      },
      {
        id: 'h2',
        order: 2,
        title: '제1회 졸업식 거행',
        year: '1940',
        thumb: 'https://images.unsplash.com/photo-1730307403182-46906ab72173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaGlzdG9yeSUyMG9sZCUyMGJ1aWxkaW5nJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '전쟁의 아픔 속에서도 배출된 첫 번째 나이팅게일들.\nFirst graduates amidst wartime hardships.',
        enabled: true,
      },
    ],
  },
  {
    id: 'period-2',
    order: 2,
    rangeLabel: '1947 ~ 1956',
    yearStart: 1947,
    yearEnd: 1956,
    title: 'Reconstruction 정착·재건기',
    subtitle: '시련을 딛고 다시 일어서다\nRising Again from Hardship',
    heroMedia: 'https://images.unsplash.com/photo-1717995045633-2579ba884150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBtZWRpY2FsJTIwc2Nob29sJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1OTYzNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h2_1',
        order: 1,
        title: '서울위생병원 간호고등기술학교 승격',
        year: '1948',
        thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbnVyc2V8ZW58MXx8fHwxNzY1ODkwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '전문 교육 기관으로서의 체계 확립.\nEstablishing a specialized education system.',
        enabled: true,
      },
      {
        id: 'h2_2',
        order: 2,
        title: '전란 속의 교육 지속',
        year: '1951',
        thumb: 'https://images.unsplash.com/photo-1533481498108-4b77f433501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBrb3JlYSUyMHdhciUyMHJ1aW5zfGVufDF8fHx8MTc2NTg5MDc4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '임시 교사에서도 멈추지 않은 학구열.\nUnceasing passion for learning even in temporary shelters.',
        enabled: true,
      },
    ],
  },
  {
    id: 'period-3',
    order: 3,
    rangeLabel: '1957 ~ 1996',
    yearStart: 1957,
    yearEnd: 1996,
    title: 'Growth 성장기',
    subtitle: '전문 대학으로서의 기틀 마련\nFoundation as a College',
    heroMedia: 'https://images.unsplash.com/photo-1589982334488-2ce2b65244ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdW5pdmVyc2l0eSUyMGNhbXB1c3xlbnwxfHx8fDE3NjU5NjM2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h3_1',
        order: 1,
        title: '학관 건축 및 캠퍼스 확장',
        year: '1974',
        thumb: 'https://images.unsplash.com/photo-1676555263970-63e72d69642a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBoaXN0b3J5JTIwMTk3MHMlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDF8fHx8MTc2NTg5MDY4NHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '늘어나는 학생들을 위한 최신식 교육 시설 완공.\nCompletion of modern facilities for growing students.',
        enabled: true,
      },
      {
        id: 'h3_2',
        order: 2,
        title: '삼육간호전문대학 승격',
        year: '1979',
        thumb: 'https://images.unsplash.com/photo-1689459448455-928ff1f65621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGlicmFyeSUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc2NTc4OTEyMXww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '고등 교육 기관으로서의 위상을 정립하다.\nElevating status to a higher education institution.',
        enabled: true,
      },
      {
        id: 'h3_3',
        order: 3,
        title: '지역 사회 의료 봉사 활동',
        year: '1982',
        thumb: 'https://images.unsplash.com/photo-1538333244582-5edcaa3bf37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc2Nob29sJTIwc3R1ZGVudHMlMjAxOTgwcyUyMHJldHJvfGVufDF8fHx8MTc2NTg5MDY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '배움을 실천으로, 사랑을 봉사로 전하다.\nPracticing learning through service.',
        enabled: true,
      },
      {
        id: 'h3_4',
        order: 4,
        title: '글로벌 비전 선포식',
        year: '1988',
        thumb: 'https://images.unsplash.com/photo-1758432274762-71b4c4572728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3BvcnRzJTIwZGF5JTIwdmludGFnZXxlbnwxfHx8fDE3NjU4OTA3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '올림픽과 함께 세계로 뻗어가는 대학의 꿈.\nDreaming of going global with the Olympics.',
        enabled: true,
      },
    ],
  },
  {
    id: 'period-4',
    order: 4,
    rangeLabel: '1997 ~ 2016',
    yearStart: 1997,
    yearEnd: 2016,
    title: 'Take-off 도약기',
    subtitle: '글로벌 보건 의료 인재 양성\nCultivating Global Health Talents',
    heroMedia: 'https://images.unsplash.com/photo-1679653226697-2b0fbf7c17f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h4_1',
        order: 1,
        title: '삼육보건대학 교명 변경',
        year: '1998',
        thumb: 'https://images.unsplash.com/photo-1763615834709-cd4b196980db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjYW1wdXMlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '종합적인 보건 의료 전문 대학으로의 확장.\nExpansion into a comprehensive health college.',
        enabled: true,
      },
      {
        id: 'h4_2',
        order: 2,
        title: '첨단 실습실 구축',
        year: '2002',
        thumb: 'https://images.unsplash.com/photo-1583736902682-f00149bbf526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzaW5nJTIwc3R1ZGVudHMlMjB2aW50YWdlJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NTg5MDcxMnww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '현장과 동일한 환경에서의 실무 교육 강화.\nReinforcing practical training in realistic environments.',
        enabled: true,
      },
      {
        id: 'h4_3',
        order: 3,
        title: '해외 자매결연 대학 확대',
        year: '2005',
        thumb: 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjB2b2x1bnRlZXIlMjBzZXJ2aWNlJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzY1ODkwNzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '전 세계 20개국 유수 대학들과의 학술 교류 시작.\nAcademic exchanges with universities in 20 countries.',
        enabled: true,
      },
      {
        id: 'h4_4',
        order: 4,
        title: '산학협력 중심대학 선정',
        year: '2008',
        thumb: 'https://images.unsplash.com/photo-1691831655839-a99fd8353dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmclMjBvbGQlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzY1ODkwNzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '기업이 원하는 인재, 기업과 함께 성장하는 대학.\nGrowing with industries, nurturing desired talents.',
        enabled: true,
      },
      {
        id: 'h4_5',
        order: 5,
        title: 'WCC 세계적 수준의 전문대학 선정',
        year: '2013',
        thumb: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRpbWUlMjBwYXNzaW5nJTIwYmx1cnxlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '국내를 넘어 세계가 인정하는 직업 교육의 산실.\nWorld Class College recognized globally.',
        enabled: true,
      },
    ],
  },
  {
    id: 'period-5',
    order: 5,
    rangeLabel: '2017 ~ 2024',
    yearStart: 2017,
    yearEnd: 2024,
    title: 'Innovation 혁신·융합기',
    subtitle: '디지털 대전환과 교육 혁신\nDigital Transformation & Educational Innovation',
    heroMedia: 'https://images.unsplash.com/photo-1695048441421-369a04a8df27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaGVhbHRoY2FyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h5_1',
        order: 1,
        title: '혁신지원사업 최우수 대학',
        year: '2019',
        thumb: 'https://images.unsplash.com/photo-1759092912891-9f52486bb059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwbGFib3JhdG9yeSUyMHN0dWRlbnRzfGVufDF8fHx8MTc2NTg5MDcyMHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '끊임없는 혁신으로 교육의 질을 높이다.\nEnhancing education quality through continuous innovation.',
        enabled: true,
      },
      {
        id: 'h5_2',
        order: 2,
        title: 'AI 융합 교육 플랫폼 오픈',
        year: '2023',
        thumb: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmUlMjB0ZWNobm9sb2d5JTIwdW5pdmVyc2l0eSUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjU4OTA3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '미래 사회를 선도할 디지털 인재 양성의 요람.\nCradle for digital talents leading the future society.',
        enabled: true,
      },
      {
        id: 'h5_3',
        order: 3,
        title: '그린 캠퍼스 조성 완료',
        year: '2024',
        thumb: 'https://images.unsplash.com/photo-1758413352279-1030ffba2ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBjYW1wdXMlMjBnYXJkZW4lMjB1bml2ZXJzaXR5fGVufDF8fHx8MTc2NTg5MDc0NHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '자연과 사람이 공존하는 아름다운 배움의 터전.\nBeautiful campus where nature and people coexist.',
        enabled: true,
      },
    ],
  },
  {
    id: 'period-6',
    order: 6,
    rangeLabel: '2025 ~ Beyond',
    yearStart: 2025,
    yearEnd: 2036,
    title: 'Future Vision 미래비전',
    subtitle: '세상에서 가장 입학하고 싶은 대학\nThe Most Desirable University',
    heroMedia: 'https://images.unsplash.com/photo-1612886649688-ef2912f17921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbWVkaWNhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY1OTYzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    enabled: true,
    highlights: [
      {
        id: 'h6_1',
        order: 1,
        title: '개교 90주년 기념식',
        year: '2026',
        thumb: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjB1bml2ZXJzaXR5JTIwaGFwcHklMjBzdHVkZW50c3xlbnwxfHx8fDE3NjU4OTA3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '100년을 향한 새로운 도약, 영광의 순간.\nNew leap towards 100 years, moment of glory.',
        enabled: true,
      },
      {
        id: 'h6_2',
        order: 2,
        title: 'Vision 2030 선포',
        year: '2030',
        thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmUlMjBnbG9iYWwlMjBjb25uZWN0aW9ufGVufDF8fHx8MTc2NTg5MDgwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: '건강한 인류를 위한 글로벌 리더십 확보.\nSecuring global leadership for healthy humanity.',
        enabled: true,
      },
    ],
  },
];

async function migrate() {
  try {
    console.log('🚀 Period & Highlight 데이터 마이그레이션 시작...\n');

    for (const period of timelineData) {
      // 1. Period 문서 저장
      const { highlights, ...periodData } = period;
      const periodRef = db.collection('homepage_periods').doc(period.id);

      await periodRef.set({
        ...periodData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Period 저장 완료: ${period.title} (${period.id})`);

      // 2. Highlights Subcollection 저장
      for (const highlight of highlights) {
        const highlightRef = periodRef.collection('highlights').doc(highlight.id);

        await highlightRef.set({
          ...highlight,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log(`   └─ Highlights ${highlights.length}개 저장 완료\n`);
    }

    console.log('🎉 Period & Highlight 데이터 마이그레이션 완료!');
    console.log(`   • 총 Period: ${timelineData.length}개`);
    console.log(`   • 총 Highlights: ${timelineData.reduce((sum, p) => sum + p.highlights.length, 0)}개`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();

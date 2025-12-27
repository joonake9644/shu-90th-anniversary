/**
 * 이벤트 더미 데이터 마이그레이션 스크립트
 */

const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin 초기화
const serviceAccount = require(path.join(process.cwd(), 'serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 더미 이벤트 데이터
const eventsData = [
  {
    title: '개교 90주년 기념 축제',
    description: `삼육보건대학교 개교 90주년을 기념하는 대규모 축제가 열립니다.

주요 프로그램:
• 90년 역사 전시회
• 동문 초청 강연
• 학과별 체험 부스
• K-POP 콘서트
• 불꽃놀이

전 국민 누구나 참여 가능하며, 사전 등록자에게는 기념품을 증정합니다.`,
    date: new Date('2026-05-20'),
    location: '삼육보건대학교 교정 전역',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    registrationLink: 'https://shu.ac.kr/event/90th-festival',
    category: 'ceremony',
  },
  {
    title: '2025 헬스케어 혁신 컨퍼런스',
    description: `AI, 빅데이터, IoT 등 첨단 기술과 헬스케어의 융합을 주제로 한 국제 컨퍼런스가 개최됩니다.

연사:
• 서울대학교 의과대학 김OO 교수
• 구글 헬스 아시아 책임자
• 삼성의료원 스마트병원센터장

참가비: 무료 (사전등록 필수)
대상: 보건의료 종사자, 대학생, 일반인`,
    date: new Date('2025-11-15'),
    location: '삼육보건대학교 국제회의실',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    registrationLink: 'https://shu.ac.kr/event/healthcare-conference-2025',
    category: 'conference',
  },
  {
    title: '간호·보건 직업 박람회 2025',
    description: `간호사, 물리치료사, 치위생사 등 보건의료 직종에 관심 있는 고등학생과 일반인을 위한 진로 박람회입니다.

체험 프로그램:
• 간호사 체험 (심폐소생술, 주사실습)
• 물리치료사 체험
• 치위생사 체험
• 보건의료 직업 상담
• 입학 설명회

입장료: 무료`,
    date: new Date('2025-10-10'),
    location: '삼육보건대학교 체육관',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
    registrationLink: 'https://shu.ac.kr/event/career-fair-2025',
    category: 'exhibition',
  },
  {
    title: '2025 입시설명회',
    description: `2026학년도 신입생 모집을 위한 입시설명회가 열립니다.

안내사항:
• 2026학년도 전형 안내
• 학과별 교육과정 소개
• 취업 및 진로 안내
• 장학금 제도 안내
• 캠퍼스 투어
• 1:1 입학 상담

참가 신청자에게 입학 원서 수수료 면제 혜택을 드립니다.`,
    date: new Date('2025-09-05'),
    location: '삼육보건대학교 대강당',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    registrationLink: 'https://shu.ac.kr/admission/info-session',
    category: 'other',
  },
  {
    title: '제48회 졸업식',
    description: `2024학년도 졸업생 여러분의 새로운 시작을 축하합니다.

일정:
• 14:00 입장
• 14:30 식전 공연
• 15:00 졸업식
• 16:00 학과별 졸업 기념촬영

졸업생 가족 및 지인 모두 참석 가능합니다.`,
    date: new Date('2025-02-14'),
    location: '삼육보건대학교 대강당',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    registrationLink: '',
    category: 'ceremony',
  },
  {
    title: '동문의 밤 2024',
    description: `역대 졸업생 여러분을 초대합니다!

프로그램:
• 총장 인사말
• 동문회장 축사
• 모교 발전상 소개
• 우수 동문 시상
• 만찬 및 네트워킹
• 레크리에이션

참가비: 50,000원 (1인)
신청 마감: 2024년 11월 25일`,
    date: new Date('2024-12-01'),
    location: '서울 그랜드힐튼 호텔',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    registrationLink: 'https://shu.ac.kr/alumni/night-2024',
    category: 'other',
  },
];

// 이벤트 데이터 마이그레이션
async function migrateEvents() {
  console.log('🚀 이벤트 더미 데이터 마이그레이션 시작...\n');

  try {
    const eventsCollection = db.collection('events');

    for (const event of eventsData) {
      const eventDoc = {
        ...event,
        date: admin.firestore.Timestamp.fromDate(event.date),
        createdAt: admin.firestore.Timestamp.now(),
      };

      await eventsCollection.add(eventDoc);
      console.log(`✅ 이벤트 저장 완료: ${event.title}`);
    }

    console.log(`\n🎉 이벤트 더미 데이터 마이그레이션 완료!`);
    console.log(`   • 총 이벤트: ${eventsData.length}개\n`);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }
}

// 실행
migrateEvents()
  .then(() => {
    console.log('✅ 마이그레이션 성공');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  });

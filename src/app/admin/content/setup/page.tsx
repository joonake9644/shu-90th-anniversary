'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { historyChapters } from '@/data/historyChapters';
import { migrateInitialData } from '@/lib/firestore/admin/history';
import { migrateImageToStorage } from '@/lib/utils/migrateImages';

/**
 * 초기 데이터 설정 페이지
 * CMS 관리자 페이지에 더미 데이터를 한 번에 로드
 */
export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const setupAllData = async () => {
    setLoading(true);
    setLogs([]);
    addLog('🚀 초기 데이터 설정 시작...');

    try {
      // 1. Hero 데이터
      addLog('Hero 데이터 생성 중...');
      addLog('  🔄 Unsplash 이미지를 Storage로 마이그레이션 중...');

      // Unsplash 이미지를 Firebase Storage에 저장
      const heroImageUrl = await migrateImageToStorage(
        'https://images.unsplash.com/photo-1730307403182-46906ab72173?w=1920',
        'hero',
        'background.jpg'
      );
      addLog(`  ✅ 이미지 저장 완료: ${heroImageUrl}`);

      await setDoc(doc(db, 'homepage_hero', 'main'), {
        backgroundImage: heroImageUrl, // Storage URL 사용
        badgeText: 'THE 90TH ANNIVERSARY',
        mainNumber: '90',
        mainSubtitle1: 'YEARS',
        mainSubtitle2: 'Of History',
        universityName: 'Sahmyook Health University',
        description: '삼육보건대학교 90주년,\n진심의 교육으로 세상을 치유해온 시간',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      addLog('✅ Hero 데이터 완료');

      // 2. Footer 데이터
      addLog('Footer 데이터 생성 중...');
      await setDoc(doc(db, 'homepage_footer', 'main'), {
        brandName: 'SHU 90th',
        slogan: 'Truth · Love · Service',
        description: 'Celebrating 90 years of excellence in health education.\nPreparing for the next century of innovation and service.',
        socialLinks: {
          instagram: 'https://www.instagram.com/shu_university/',
          facebook: 'https://www.facebook.com/sahmyookhealth',
          youtube: 'https://www.youtube.com/@SHU_Official'
        },
        quickLinks: [
          { label: 'History 1936-2026', href: '#' },
          { label: 'Vision 2030', href: '#' },
          { label: 'Campus Map', href: '#' },
          { label: 'Anniversary Events', href: '#' }
        ],
        contact: {
          address: '82 Mangu-ro, Dongdaemun-gu,\nSeoul, Republic of Korea',
          phone: '+82-2212-0082',
          email: 'admin@shu.ac.kr'
        },
        copyrightText: 'Sahmyook Health University. All rights reserved.',
        privacyPolicyUrl: '#',
        termsOfServiceUrl: '#',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      addLog('✅ Footer 데이터 완료');

      // 3. Marquee 데이터
      addLog('Marquee 데이터 생성 중...');
      await setDoc(doc(db, 'homepage_marquee', 'marquee1'), {
        position: 1,
        text: 'History of 90 Years',
        direction: 'left',
        speed: 5,
        enabled: true
      });
      await setDoc(doc(db, 'homepage_marquee', 'marquee2'), {
        position: 2,
        text: 'Toward 100 Years',
        direction: 'right',
        speed: 5,
        enabled: true
      });
      addLog('✅ Marquee 데이터 완료');

      // 4. TimelineIntro 데이터
      addLog('TimelineIntro 데이터 생성 중...');
      await setDoc(doc(db, 'homepage_timeline_intro', 'main'), {
        quoteEn: 'Education is the most powerful weapon which you can use to change the world.',
        quoteKo: '교육은 세상을 변화시킬 수 있는 가장 강력한 무기이다.',
        attribution: 'Dr. Howard B. Rue',
        year1936Text: '1936',
        titleText: '진리, 사랑, 봉사의 시작',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      addLog('✅ TimelineIntro 데이터 완료');

      // 5. 뉴스 데이터
      addLog('뉴스 데이터 생성 중...');
      const newsData = [
        {
          title: '삼육보건대학교 개교 90주년 기념식 성황리 개최',
          summary: '1936년 경성요양병원 부속 간호원 양성소로 시작한 우리 대학이 90주년을 맞아 뜻깊은 기념식을 가졌습니다.',
          content: '삼육보건대학교(총장 김철영)는 2026년 5월 15일 교내 대강당에서 개교 90주년 기념식을 성대하게 개최했다. 김철영 총장은 "90년이라는 긴 세월 동안 진리, 사랑, 봉사의 정신으로 대한민국 보건의료 인재를 양성해 온 우리 대학의 역사를 되돌아보며, 앞으로 100주년을 향한 새로운 도약을 준비하겠다"고 밝혔다.',
          thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
          author: '홍보팀',
          category: 'anniversary',
          publishedAt: Timestamp.fromDate(new Date('2026-05-15')),
          createdAt: Timestamp.now(),
        },
        {
          title: '간호학과, 2025년 간호사 국가고시 합격률 100% 달성',
          summary: '우리 대학 간호학과가 2025년 간호사 국가고시에서 전원 합격하는 쾌거를 이뤘습니다.',
          content: '삼육보건대학교 간호학과가 2025년 제62회 간호사 국가고시에서 응시자 전원이 합격하는 우수한 성적을 거두었다. 이번 국가고시에는 간호학과 졸업예정자 120명 전원이 응시했으며, 100% 합격률을 달성했다.',
          thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
          author: '간호학과',
          category: 'achievement',
          publishedAt: Timestamp.fromDate(new Date('2025-03-20')),
          createdAt: Timestamp.now(),
        },
        {
          title: '2025학년도 입학식 개최...신입생 800명 입학',
          summary: '2025학년도 신입생 800명이 삼육보건대학교의 새로운 가족이 되었습니다.',
          content: '삼육보건대학교는 3월 2일 교내 대강당에서 2025학년도 입학식을 개최했다. 이날 입학식에는 신입생 800명과 학부모, 교직원 등 약 2,000명이 참석했다.',
          thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          author: '학생처',
          category: 'event',
          publishedAt: Timestamp.fromDate(new Date('2025-03-02')),
          createdAt: Timestamp.now(),
        }
      ];

      for (const news of newsData) {
        await addDoc(collection(db, 'news'), news);
      }
      addLog('✅ 뉴스 데이터 완료 (3개)');

      // 6. 이벤트 데이터
      addLog('이벤트 데이터 생성 중...');
      const eventsData = [
        {
          title: '개교 90주년 기념 축제',
          description: '삼육보건대학교 개교 90주년을 기념하는 대규모 축제가 열립니다. K-POP 콘서트, 불꽃놀이 등 다양한 프로그램이 준비되어 있습니다.',
          date: Timestamp.fromDate(new Date('2026-05-20')),
          location: '삼육보건대학교 교정 전역',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          registrationLink: '',
          category: 'ceremony',
          createdAt: Timestamp.now(),
        },
        {
          title: '2025 헬스케어 혁신 컨퍼런스',
          description: 'AI, 빅데이터, IoT 등 첨단 기술과 헬스케어의 융합을 주제로 한 국제 컨퍼런스가 개최됩니다.',
          date: Timestamp.fromDate(new Date('2025-11-15')),
          location: '삼육보건대학교 국제회의실',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          registrationLink: '',
          category: 'conference',
          createdAt: Timestamp.now(),
        },
        {
          title: '2025 입시설명회',
          description: '2026학년도 신입생 모집을 위한 입시설명회가 열립니다. 학과별 교육과정 소개, 장학금 안내 등이 진행됩니다.',
          date: Timestamp.fromDate(new Date('2025-09-05')),
          location: '삼육보건대학교 대강당',
          image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
          registrationLink: '',
          category: 'other',
          createdAt: Timestamp.now(),
        }
      ];

      for (const event of eventsData) {
        await addDoc(collection(db, 'events'), event);
      }
      addLog('✅ 이벤트 데이터 완료 (3개)');

      // 7. Periods 데이터 (6단계 역사 + Highlights)
      addLog('Periods & Highlights 데이터 생성 중...');
      const periodsData = [
        {
          id: 'period-1',
          order: 1,
          rangeLabel: '1936 ~ 1946',
          yearStart: 1936,
          yearEnd: 1946,
          title: 'Beginning 태동기',
          subtitle: '민족의 건강과 교육을 위한 첫 걸음\nFirst Step for Nation\'s Health',
          heroMedia: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=1920',
          enabled: true,
          highlights: [
            {
              title: '경성요양병원 부속 간호원 양성소 설립',
              year: '1936',
              thumb: 'https://images.unsplash.com/photo-1726313475738-5c8428158210?w=800',
              description: '진리, 사랑, 봉사의 이념으로 첫 발을 내딛다.',
              order: 1,
              enabled: true
            },
            {
              title: '제1회 졸업식 거행',
              year: '1940',
              thumb: 'https://images.unsplash.com/photo-1730307403182-46906ab72173?w=800',
              description: '전쟁의 아픔 속에서도 배출된 첫 번째 나이팅게일들.',
              order: 2,
              enabled: true
            }
          ]
        },
        {
          id: 'period-2',
          order: 2,
          rangeLabel: '1947 ~ 1956',
          yearStart: 1947,
          yearEnd: 1956,
          title: 'Reconstruction 정착·재건기',
          subtitle: '시련을 딛고 다시 일어서다\nRising Again from Hardship',
          heroMedia: 'https://images.unsplash.com/photo-1717995045633-2579ba884150?w=1920',
          enabled: true,
          highlights: [
            {
              title: '서울위생병원 간호고등기술학교 승격',
              year: '1948',
              thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
              description: '전문 교육 기관으로서의 체계 확립.',
              order: 1,
              enabled: true
            }
          ]
        },
        {
          id: 'period-3',
          order: 3,
          rangeLabel: '1957 ~ 1996',
          yearStart: 1957,
          yearEnd: 1996,
          title: 'Growth 성장기',
          subtitle: '전문 대학으로서의 기틀 마련\nFoundation as a College',
          heroMedia: 'https://images.unsplash.com/photo-1589982334488-2ce2b65244ed?w=1920',
          enabled: true,
          highlights: [
            {
              title: '학관 건축 및 캠퍼스 확장',
              year: '1974',
              thumb: 'https://images.unsplash.com/photo-1676555263970-63e72d69642a?w=800',
              description: '늘어나는 학생들을 위한 최신식 교육 시설 완공.',
              order: 1,
              enabled: true
            }
          ]
        },
        {
          id: 'period-4',
          order: 4,
          rangeLabel: '1997 ~ 2016',
          yearStart: 1997,
          yearEnd: 2016,
          title: 'Leap 도약기',
          subtitle: '세계적 수준의 전문대학으로\nBecoming World-Class',
          heroMedia: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=1920',
          enabled: true,
          highlights: [
            {
              title: 'WCC(World Class College) 선정',
              year: '2013',
              thumb: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?w=800',
              description: '세계적 수준의 전문대학으로 선정, 글로벌 경쟁력 인정.',
              order: 1,
              enabled: true
            }
          ]
        },
        {
          id: 'period-5',
          order: 5,
          rangeLabel: '2017 ~ 2024',
          yearStart: 2017,
          yearEnd: 2024,
          title: 'Innovation 혁신기',
          subtitle: '4차 산업혁명 시대를 선도하다\nLeading the 4th Industrial Revolution',
          heroMedia: 'https://images.unsplash.com/photo-1758432274762-71b4c4572728?w=1920',
          enabled: true,
          highlights: [
            {
              title: 'AI 융합 교육 플랫폼 구축',
              year: '2023',
              thumb: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=800',
              description: '인공지능과 헬스케어의 융합, 미래 교육 플랫폼 완성.',
              order: 1,
              enabled: true
            }
          ]
        },
        {
          id: 'period-6',
          order: 6,
          rangeLabel: '2025 ~ Beyond',
          yearStart: 2025,
          yearEnd: 2100,
          title: 'Future 미래기',
          subtitle: '100주년을 향한 새로운 시작\nToward the Centennial',
          heroMedia: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=1920',
          enabled: true,
          highlights: [
            {
              title: '개교 90주년 기념',
              year: '2026',
              thumb: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
              description: '90년의 역사를 축하하고, 100주년을 향한 새로운 비전 선포.',
              order: 1,
              enabled: true
            }
          ]
        }
      ];

      for (const period of periodsData) {
        const periodRef = doc(db, 'homepage_periods', period.id);
        const { highlights, ...periodData } = period;

        await setDoc(periodRef, {
          ...periodData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        addLog(`  ✓ Period "${period.title}" 생성 완료`);

        // Highlights subcollection 생성
        for (const highlight of highlights) {
          await addDoc(collection(periodRef, 'highlights'), {
            ...highlight,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }
        addLog(`  ✓ Highlights ${highlights.length}개 추가 완료`);
      }
      addLog('✅ Periods 데이터 완료 (6개 Period + Highlights)');

      // 8. Videos 데이터
      addLog('Videos 데이터 생성 중...');
      const videosData = [
        {
          title: '개교 기념식 - 1936년의 감동',
          description: '1936년 경성요양병원 부속 간호원 양성소 설립 당시의 역사적 순간을 재현한 다큐멘터리',
          year: '1936',
          duration: '5:32',
          thumbnail: 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=example1',
          category: '기념식',
          period: '1936-1946',
          order: 1,
          featured: true,
          enabled: true,
        },
        {
          title: 'WCC 선정 기념 다큐멘터리',
          description: '2013년 세계적 수준의 전문대학(WCC) 선정을 기념하는 특별 다큐멘터리',
          year: '2013',
          duration: '15:00',
          thumbnail: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=example2',
          category: '기념식',
          period: '1997-2016',
          order: 2,
          featured: false,
          enabled: true,
        },
        {
          title: '90주년 기념 메시지',
          description: '개교 90주년을 맞아 총장, 교직원, 동문들이 전하는 축하 메시지',
          year: '2026',
          duration: '4:50',
          thumbnail: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=800',
          videoUrl: 'https://www.youtube.com/watch?v=example3',
          category: '기념식',
          period: '2025-Beyond',
          order: 3,
          featured: true,
          enabled: true,
        }
      ];

      for (const video of videosData) {
        await addDoc(collection(db, 'videos'), video);
      }
      addLog('✅ Videos 데이터 완료 (3개)');

      // 9. History Chapters 데이터
      addLog('History Chapters 데이터 생성 중...');
      await migrateInitialData(historyChapters);
      addLog('✅ History Chapters 데이터 완료 (6개 챕터)');

      // 10. 사연(Stories) 데이터
      addLog('사연 데이터 생성 중...');
      const storiesData = [
        {
          name: '김영희',
          email: 'younghee@example.com',
          graduationYear: 1985,
          title: '평생 잊지 못할 첫 임상실습',
          content: '1985년 간호학과 2학년 때, 처음으로 실제 환자를 돌보며 느꼈던 떨림과 감동을 아직도 잊을 수 없습니다. 선생님들의 따뜻한 지도와 격려 덕분에 지금까지 30년 넘게 간호사로 일할 수 있었습니다.',
          isApproved: true,
          createdAt: Timestamp.now(),
        },
        {
          name: '이철수',
          email: 'chulsoo@example.com',
          graduationYear: 1998,
          title: '삼육보건대가 내 인생을 바꿨습니다',
          content: '물리치료과를 졸업하고 현재 재활병원 과장으로 일하고 있습니다. 학창시절 배운 전문지식과 봉사정신이 제 인생의 밑거름이 되었습니다. 후배들에게도 꼭 추천하고 싶은 학교입니다.',
          isApproved: true,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
        },
        {
          name: '박민수',
          email: 'minsu@example.com',
          graduationYear: 2010,
          title: '90주년 축하합니다!',
          content: '치위생과 졸업생입니다. 10년이 지난 지금도 학교에서 배운 것들이 큰 도움이 되고 있습니다. 90주년 진심으로 축하드리며, 100주년까지 건강하게 발전하시길 기원합니다!',
          isApproved: true,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 172800000)),
        },
        {
          name: '최은정',
          email: 'eunjung@example.com',
          graduationYear: 2015,
          title: '감사합니다, 우리 학교',
          content: '방사선과 졸업 후 대학병원에서 근무하고 있습니다. 재학 중 받았던 장학금과 교수님들의 진심 어린 가르침에 감사드립니다. 언제나 모교를 자랑스럽게 생각합니다.',
          isApproved: false,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 259200000)),
        },
        {
          name: '정민호',
          email: 'minho@example.com',
          graduationYear: 2020,
          title: '코로나 시대, 학교의 지원에 감사',
          content: '코로나19로 어려웠던 시기에도 온라인 수업을 적극 지원해주시고, 학생들을 배려해주신 학교에 감사드립니다. 졸업 후에도 모교가 자랑스럽습니다.',
          isApproved: true,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 345600000)),
        }
      ];

      for (const story of storiesData) {
        await addDoc(collection(db, 'story_submissions'), story);
      }
      addLog('✅ 사연 데이터 완료 (5개)');

      // 11. Statistics 데이터
      addLog('Statistics 데이터 생성 중...');
      await setDoc(doc(db, 'statistics_data', 'main'), {
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      addLog('✅ Statistics 데이터 완료');

      addLog('🎉 모든 초기 데이터 설정 완료!');
      addLog('✨ 이제 각 관리자 페이지에서 데이터를 확인하고 수정할 수 있습니다.');

    } catch (error) {
      console.error('Error:', error);
      addLog('❌ 오류 발생: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">🚀 초기 데이터 설정</h1>
        <p className="text-gray-400 mb-8">
          CMS 관리자 페이지에 더미 데이터를 한 번에 로드합니다.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-6">
          <h2 className="text-amber-500 font-bold mb-2">⚠️ 주의사항</h2>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• 이 작업은 Firestore에 초기 데이터를 생성합니다</li>
            <li>• 기존 데이터가 있으면 덮어쓰거나 중복될 수 있습니다</li>
            <li>• 처음 설정할 때만 사용하세요</li>
          </ul>
        </div>

        <button
          onClick={setupAllData}
          disabled={loading}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed mb-6"
        >
          {loading ? '데이터 생성 중...' : '🎯 초기 데이터 생성하기'}
        </button>

        {/* 로그 영역 */}
        <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">📋 작업 로그</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">아직 작업이 시작되지 않았습니다.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 생성될 데이터 목록 */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">📦 생성될 데이터</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Hero Section</div>
              <div className="text-gray-400 text-sm">배경 이미지, 타이틀</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Footer</div>
              <div className="text-gray-400 text-sm">푸터 정보, 링크</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Marquee</div>
              <div className="text-gray-400 text-sm">움직이는 텍스트 2개</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Timeline Intro</div>
              <div className="text-gray-400 text-sm">1936 인트로 텍스트</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">뉴스</div>
              <div className="text-gray-400 text-sm">더미 뉴스 3개</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">이벤트</div>
              <div className="text-gray-400 text-sm">더미 이벤트 3개</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Periods</div>
              <div className="text-gray-400 text-sm">6개 Period + Highlights</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Videos</div>
              <div className="text-gray-400 text-sm">더미 동영상 3개</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">History Chapters</div>
              <div className="text-gray-400 text-sm">별빛 아카이브 6챕터</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">사연</div>
              <div className="text-gray-400 text-sm">더미 사연 5개</div>
            </div>
            <div className="bg-black/30 rounded p-3">
              <div className="text-amber-500 font-bold mb-1">Statistics</div>
              <div className="text-gray-400 text-sm">통계 데이터</div>
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-blue-400 font-bold mb-2">✅ 데이터 생성 후 확인할 곳</h3>
          <div className="text-gray-300 space-y-2 text-sm">
            <div>• <a href="/admin/content/hero" className="text-blue-400 hover:underline">/admin/content/hero</a> - Hero 섹션 편집</div>
            <div>• <a href="/admin/content/footer" className="text-blue-400 hover:underline">/admin/content/footer</a> - Footer 편집</div>
            <div>• <a href="/admin/content/marquee" className="text-blue-400 hover:underline">/admin/content/marquee</a> - Marquee 편집</div>
            <div>• <a href="/admin/content/timeline-intro" className="text-blue-400 hover:underline">/admin/content/timeline-intro</a> - Timeline Intro 편집</div>
            <div>• <a href="/admin/content/news" className="text-blue-400 hover:underline">/admin/content/news</a> - 뉴스 관리</div>
            <div>• <a href="/admin/content/events" className="text-blue-400 hover:underline">/admin/content/events</a> - 이벤트 관리</div>
            <div>• <a href="/admin/content/periods" className="text-blue-400 hover:underline">/admin/content/periods</a> - 6단계 역사 관리</div>
            <div>• <a href="/admin/content/videos" className="text-blue-400 hover:underline">/admin/content/videos</a> - 동영상 관리</div>
            <div>• <a href="/admin/content/history" className="text-blue-400 hover:underline">/admin/content/history</a> - History Chapters 관리</div>
            <div>• <a href="/admin/content/statistics" className="text-blue-400 hover:underline">/admin/content/statistics</a> - 통계 관리</div>
            <div>• <a href="/admin/content/stories" className="text-blue-400 hover:underline">/admin/content/stories</a> - 사연 관리</div>
            <div>• <a href="/" className="text-blue-400 hover:underline">메인 홈페이지</a> - 변경사항 확인</div>
          </div>
        </div>
      </div>
    </div>
  );
}

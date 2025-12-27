# PRD: 삼육보건대학교 개교 90주년 기념 홈페이지

**문서 버전**: 1.4
**작성일**: 2025-12-19
**최종 수정일**: 2025-12-26 (Period & Highlights CMS 완료)
**프로젝트명**: SHU 90th Anniversary Website
**대상**: 개발팀, 디자인팀, 프로젝트 관리자, 경영진

## 📝 변경 이력

### v1.4 (2025-12-26 - 최신) ⭐
- ✅ **Period & Highlights CMS 완료** - 가장 복잡한 모듈 개발 완료!
- 📊 **완료된 모듈**: HeroSection, Footer, Marquee, TimelineIntro, Period & Highlights CMS
- 🔜 **남은 모듈**: HistoryStory CMS (1개만!)
- 📈 **진행률**: 83% 완료 (111개 필드 관리 가능)
- 🎯 **Subcollection 구조**: 6개 Period + 18개 Highlights
- 🚀 **메인 페이지 연동**: Period 데이터 Firestore 로드 완료

### v1.3 (2025-12-26)
- ✅ **CMS 개발 현황 업데이트** - 4/6 모듈 완료 상태 반영
- 📊 **완료된 모듈**: HeroSection, Footer, Marquee, TimelineIntro CMS
- 🔜 **대기 모듈**: Period & Highlights, HistoryStory CMS
- 📈 **진행률**: 67% 완료 (39개 필드 관리 가능)

### v1.2 (2025-12-26)
- ✅ **CMS 시스템 요구사항 추가** - 메인 홈페이지 전체 콘텐츠 관리 시스템
- 📋 **Phase 2.4: 통합 CMS 관리 시스템** - 새로운 Phase 추가

### v1.1 (2025-12-20)
- ⏸️ **2.1.2 추억 공유 게시판** - 개발 보류, 추후 개발 예정
- ⏸️ **2.1.3 동기생 찾기 기능** - 개발 보류, 추후 개발 예정

### v1.0 (2025-12-19)
- 초기 문서 작성

---

## 📋 Executive Summary

### 프로젝트 비전

삼육보건대학교의 90년 역사를 감동적으로 재현하여, 동문과 재학생, 예비 신입생 모두가 대학의 유산과 미래 비전에 공감하고 자긍심을 느낄 수 있는 디지털 경험을 제공합니다.

### 핵심 목표

1. **감성적 연결**: 동문들이 옛 추억을 회상하며 모교에 대한 애착과 감사함을 느끼도록 유도
2. **역사적 기록**: 1936년부터 현재까지의 90년 역사를 체계적이고 감동적으로 아카이빙
3. **미래 비전 제시**: 100주년을 향한 비전과 혁신적인 방향성 공유
4. **커뮤니티 강화**: 동문, 재학생, 교직원 간의 유대감 형성 및 상호작용 촉진

### 타겟 사용자

#### 1차 타겟: 동문 (Alumni)
- **연령대**: 20대~80대
- **니즈**:
  - 옛 추억 회상
  - 동기생 및 선후배와의 재연결
  - 모교 발전 현황 확인
  - 기부 및 참여 기회 탐색
- **Pain Points**:
  - 모교와의 연결 고리 약화
  - 추억을 공유할 수 있는 플랫폼 부재
  - 현재 대학 소식에 대한 정보 부족

#### 2차 타겟: 재학생 (Current Students)
- **연령대**: 18~25세
- **니즈**:
  - 대학의 역사와 전통 이해
  - 자긍심 고취
  - 미래 비전에 대한 공감
- **Pain Points**:
  - 대학 역사에 대한 낮은 인지도
  - 전통과 현대의 연결 부족

#### 3차 타겟: 예비 신입생 및 학부모
- **연령대**: 17~19세 (학생), 40~60대 (학부모)
- **니즈**:
  - 대학의 신뢰성 및 역사적 권위 확인
  - 교육 철학 및 비전 이해
  - 졸업 후 진로 및 성과 파악
- **Pain Points**:
  - 대학 선택 시 정보 부족
  - 대학의 차별성 확인 필요

#### 4차 타겟: 교직원
- **연령대**: 30~70대
- **니즈**:
  - 소속감 및 자긍심 고취
  - 대학 역사 교육 자료 활용
  - 행사 및 이벤트 정보 확인

### 핵심 가치 제안 (Value Proposition)

> "90년의 감동적인 여정을 함께 걸으며, 100년을 향한 희망을 그립니다"

- **차별점**: 단순 정보 나열이 아닌 **감성적 스토리텔링**을 통한 몰입형 경험
- **기술적 혁신**: 최첨단 웹 애니메이션과 인터랙티브 요소로 역사를 생동감 있게 전달
- **커뮤니티**: 동문들이 직접 참여하고 추억을 공유할 수 있는 양방향 소통 플랫폼

---

## ✅ Phase 1: 현재 구현된 기능 (Completed)

### 1.1 메인 히스토리 타임라인 페이지 (`/history`)

**설명**: 90년 역사를 6개 시대로 나누어 스크롤 기반 인터랙티브 스토리텔링으로 표현

**주요 기능**:
- 풀스크린 히어로 섹션 (HeroSection)
  - 패럴랙스 배경 이미지
  - 대형 타이포그래피: "90 YEARS OF HISTORY"
  - 스크롤 인디케이터 애니메이션
- 타임라인 인트로 (TimelineIntro)
  - 중앙 글로우 라인 애니메이션
  - Dr. Rue 명언 표시
  - 6개 시대 카드 블룸 아웃 효과
  - 플로팅 파티클 효과 (먼지/별)
- 히스토리 스토리 (HistoryStory)
  - 350vh 스크롤 기반 내러티브
  - 4막 구성: Hardship, Forest of Truth, Prism of Love, Promise
  - 동적 파티클 생성
- 시대별 섹션 (PeriodSection × 6)
  - 각 시대별 히어로 이미지
  - 주요 업적 하이라이트 카드
  - 호버 인터랙션 (줌, 그레이스케일 해제)
  - 스크롤 기반 패럴랙스

**기술 스택**:
- Framer Motion 11.18.2 (useScroll, useTransform)
- Next.js 15.5.9 App Router
- TypeScript 5 (strict mode)

### 1.2 헤더/푸터/네비게이션 시스템

**GlobalHeader** (`src/components/layout/Header.tsx`):
- 고정 상단 네비게이션
- 로고: "SHU 90th"
- 언어 선택기 (KR)
- 검색 버튼
- 메뉴 토글 버튼
- mix-blend-difference로 배경 대비 유지

**MenuOverlay** (`src/components/layout/MenuOverlay.tsx`):
- 풀스크린 오버레이 메뉴
- 7개 주요 섹션 링크 (영문/한글)
- CTA 섹션: "참여하기", "발전기금 후원"

**Footer** (`src/components/layout/Footer.tsx`):
- 브랜드 정보
- 소셜 미디어 링크 (Instagram, Facebook, YouTube)
- 퀵 링크
- 연락처 정보

**TimelineProgressBar** (`src/components/layout/TimelineProgressBar.tsx`):
- 하단 고정 프로그레스 바
- 6개 시대 인디케이터
- 현재 스크롤 위치 표시
- 클릭 시 해당 시대로 이동

### 1.3 서브 페이지 라우트 (7개)

| 라우트 | 설명 | 상태 |
|--------|------|------|
| `/` | 홈페이지 | 기본 템플릿 |
| `/history` | 메인 타임라인 | **완료** |
| `/highlights` | 주요 업적 쇼케이스 | 라우트 생성됨 |
| `/video-history` | 비디오 기반 역사 | 라우트 생성됨 |
| `/statistics` | 통계 데이터 | 라우트 생성됨 |
| `/archive` | 역사적 갤러리 | 라우트 생성됨 |
| `/events` | 기념 행사 | 라우트 생성됨 |
| `/news` | 뉴스 및 업데이트 | 라우트 생성됨 |

### 1.4 반응형 디자인

- **모바일 퍼스트 접근**
- Tailwind CSS 브레이크포인트 활용 (md:, lg:, xl:)
- 터치 제스처 지원
- 모바일 메뉴 최적화

### 1.5 타임라인 데이터 구조

**파일**: `src/data/timelineData.ts`

```typescript
interface Highlight {
  id: string
  title: string
  year: number
  thumbnail: string
  description: string
}

interface Period {
  id: string
  startYear: number
  endYear: number
  title: string
  subtitle: string
  heroMedia: string
  highlights: Highlight[]
}
```

**6개 시대**:
1. **태동기 (Beginning)**: 1936-1946 (2 highlights)
2. **정착·재건기 (Reconstruction)**: 1947-1956 (2 highlights)
3. **성장기 (Growth)**: 1957-1996 (4 highlights)
4. **도약기 (Take-off)**: 1997-2016 (5 highlights)
5. **혁신·융합기 (Innovation)**: 2017-2024 (3 highlights)
6. **미래비전 (Future Vision)**: 2025-2036 (2 highlights)

총 18개 하이라이트, 이중 언어 (한글/영문)

---

## 🚀 Phase 2: 신규 기능 요구사항 (MVP)

### 2.1 동문 인터랙션 기능

#### 2.1.1 디지털 방명록 시스템

**목적**: 동문들이 모교에 대한 메시지를 남기고 다른 동문들의 메시지를 읽을 수 있는 공간

**주요 기능**:
- **방명록 작성**:
  - 이름 (필수)
  - 졸업 연도 (필수)
  - 전공 (선택)
  - 메시지 (최대 500자)
  - 익명 작성 옵션
- **방명록 조회**:
  - 최신순/좋아요순 정렬
  - 졸업 연도별 필터링
  - 전공별 필터링
  - 페이지네이션 (20개/페이지) 또는 무한 스크롤
- **좋아요 기능**:
  - 비로그인 상태에서도 가능 (로컬 스토리지 활용)
  - 좋아요 카운트 표시
- **관리자 승인 시스템** (Optional):
  - 욕설/부적절한 내용 필터링
  - 승인 대기 상태 표시

**UI/UX**:
- 카드 기반 레이아웃
- 작성 시 실시간 글자 수 카운터
- 제출 후 감사 메시지 애니메이션
- 반응형 폼 디자인

**Success Metrics**:
- 방명록 작성 수: 목표 500+ (3개월 내)
- 평균 메시지 길이: 150자 이상
- 좋아요 참여율: 30%

#### 2.1.2 추억 공유 게시판 ⏸️ **[개발 보류 - 추후 개발 예정]**

**목적**: 동문들이 학창 시절 사진과 에피소드를 공유하며 추억을 나누는 커뮤니티

**주요 기능**:
- **게시물 작성**:
  - 제목 (필수, 최대 100자)
  - 본문 (필수, 최대 2000자)
  - 이미지 업로드 (최대 5장, 각 5MB 이하)
  - 연도 태그 (추억의 연도)
  - 해시태그 (최대 5개)
- **게시물 조회**:
  - 그리드 레이아웃 (썸네일 + 제목)
  - 연도별/태그별 필터링
  - 검색 기능 (제목, 본문, 태그)
  - 인기순/최신순 정렬
- **댓글 및 좋아요**:
  - 게시물별 댓글 (최대 500자)
  - 좋아요 기능
  - 댓글 알림 (Optional)
- **소셜 공유**:
  - 페이스북, 인스타그램, 카카오톡 공유 버튼
  - 링크 복사 기능

**UI/UX**:
- Pinterest 스타일 그리드 레이아웃
- 이미지 업로드 시 드래그 앤 드롭
- 게시물 상세 모달 또는 별도 페이지
- 이미지 Lightbox 뷰어

**Success Metrics**:
- 게시물 작성 수: 목표 200+ (3개월 내)
- 평균 이미지 첨부율: 70%
- 댓글 참여율: 40%
- 소셜 공유 횟수: 100+

#### 2.1.3 동기생 찾기 기능 ⏸️ **[개발 보류 - 추후 개발 예정]**

**목적**: 졸업 연도와 전공을 기반으로 동기생을 찾고 연결할 수 있도록 지원

**주요 기능**:
- **검색 필터**:
  - 졸업 연도 선택
  - 전공 선택
  - 이름 검색 (부분 일치)
- **결과 표시**:
  - 프로필 카드 (이름, 전공, 졸업 연도)
  - 공개 동의한 동문만 표시
  - 연락처 정보 (이메일, 전화번호) - 본인이 공개한 경우
- **개인정보 보호**:
  - 프로필 공개/비공개 설정
  - 연락처 공개/비공개 설정
  - 차단 기능

**UI/UX**:
- 간단한 검색 폼
- 결과를 카드 레이아웃으로 표시
- 프로필 클릭 시 상세 정보 모달

**Success Metrics**:
- 검색 사용 횟수: 목표 1000+ (3개월 내)
- 프로필 등록률: 10% (전체 동문 중)

### 2.2 멀티미디어 갤러리 확장

#### 2.2.1 연대별 사진 아카이브

**목적**: 대학의 역사적 순간을 사진으로 보관하고 쉽게 탐색할 수 있도록 구성

**주요 기능**:
- **사진 아카이브**:
  - 연대별 분류 (1930s, 1940s, ..., 2020s)
  - 카테고리별 분류 (졸업식, 행사, 캠퍼스, 교수진, 학생 활동)
  - 고해상도 이미지 (최소 1920px 폭)
  - 이미지 메타데이터 (촬영 연도, 장소, 설명)
- **탐색 및 필터링**:
  - 타임라인 슬라이더로 연대 선택
  - 다중 필터 적용 (연대 + 카테고리)
  - 키워드 검색
- **인터랙티브 기능**:
  - Lightbox 뷰어 (확대, 좌우 이동)
  - 이미지 다운로드 버튼
  - 소셜 공유 버튼
  - 이미지별 좋아요 및 댓글

**UI/UX**:
- 그리드 레이아웃 (반응형: 1/2/3/4열)
- 이미지 호버 시 메타데이터 표시
- Lazy loading으로 성능 최적화
- 전체 화면 갤러리 모드

**Success Metrics**:
- 아카이브 이미지 수: 목표 500+ 장
- 평균 세션당 이미지 조회 수: 20장
- 다운로드 횟수: 200+

#### 2.2.2 비디오 히스토리 라이브러리

**목적**: 대학 홍보 영상, 행사 영상, 동문 인터뷰 등을 체계적으로 보관

**주요 기능**:
- **비디오 라이브러리**:
  - 연도별/카테고리별 분류
  - 썸네일 + 제목 + 재생 시간
  - 고화질 스트리밍 (720p, 1080p)
  - 자막 지원 (Optional)
- **비디오 플레이어**:
  - 커스텀 플레이어 (play, pause, 볼륨, 전체 화면)
  - 재생 목록 기능
  - 공유 버튼
- **추천 알고리즘**:
  - 관련 비디오 추천
  - 인기 비디오 섹션

**UI/UX**:
- YouTube 스타일 레이아웃
- 비디오 카드 호버 시 자동 미리보기 (Optional)
- 플레이어 페이지 또는 모달

**Success Metrics**:
- 비디오 수: 목표 30+
- 평균 재생 완료율: 60%
- 총 재생 시간: 1000+ 시간 (3개월 내)

#### 2.2.3 360도 캠퍼스 가상 투어 (Optional)

**목적**: 방문하지 못하는 예비 신입생과 해외 동문을 위한 가상 캠퍼스 투어

**주요 기능**:
- 360도 파노라마 이미지 또는 비디오
- 주요 건물/장소 마커 및 정보 팝업
- 내비게이션 지도
- VR 헤드셋 지원 (Optional)

**기술 스택**:
- Three.js 또는 Pannellum (360도 뷰어)
- WebGL 기반 렌더링

**Success Metrics**:
- 투어 완료율: 50%
- 평균 투어 시간: 5분

### 2.3 감성 효과 강화

#### 2.3.1 배경 음악 플레이어

**목적**: 감성적 분위기를 조성하고 사용자 몰입도 증대

**주요 기능**:
- **음악 선택**:
  - 학교 찬가 (공식 교가)
  - 앰비언트 음악 (감성적 배경음)
  - 사용자 ON/OFF 제어
- **플레이어 UI**:
  - 하단 고정 미니 플레이어
  - Play/Pause, 볼륨 조절
  - 트랙 정보 표시
- **자동 재생 정책**:
  - 페이지 진입 시 자동 재생 OFF (브라우저 정책 준수)
  - 사용자 클릭 후 재생 시작

**기술 스택**:
- HTML5 Audio API
- Howler.js (Optional, 크로스 브라우저 호환성)

**Success Metrics**:
- 음악 재생 활성화율: 30%
- 평균 재생 시간: 3분

---

### 2.4 통합 CMS 관리 시스템 ⭐ **[신규 추가 - 최우선 순위]**

**목적**: 메인 홈페이지의 모든 콘텐츠(이미지, 동영상, 텍스트)를 관리자 페이지에서 CRUD 가능하도록 Firestore 기반 CMS 구축

#### 2.4.1 CMS 관리 범위

**관리 대상**: 메인 페이지(`src/app/page.tsx`)의 모든 하드코딩된 콘텐츠

| 섹션 | 관리 대상 콘텐츠 | 관리 항목 수 | 상태 |
|------|------------------|--------------|------|
| **HeroSection** | 배경 이미지, 뱃지 텍스트, 타이틀, 부제목 | 7개 필드 | ✅ 완료 |
| **TimelineIntro** | Dr. Rue 명언 (영문/한글), Attribution, 1936 텍스트, Title | 6개 필드 | ✅ 완료 |
| **HistoryStory** | 5개 Act (Prologue, Act 1-3, Epilogue) | 5개 문서 × 다수 필드 | 🔜 대기 |
| **MarqueeSection** | 움직이는 텍스트 × 2 (방향, 속도, 활성화) | 2개 문서 × 5개 필드 | ✅ 완료 |
| **PeriodSection × 6** | 6개 Period + 총 18개 Highlights (Subcollection) | 72개 필드 | ✅ 완료 ⭐ |
| **Footer** | 브랜드명, 슬로건, 소셜 링크, Quick Links, Contact, Legal | 16개 필드 | ✅ 완료 |

**총 관리 항목**: 50+ 개별 콘텐츠 요소
**현재 완료**: 111개 필드 (Hero 7 + TimelineIntro 6 + Marquee 10 + Footer 16 + Period & Highlights 72)
**개발 대기**: HistoryStory (예상 추가 항목 30+개)

#### 2.4.2 Firestore Collections 구조

```typescript
homepage_hero                  // Singleton: HeroSection 콘텐츠
homepage_timeline_intro        // Singleton: TimelineIntro 콘텐츠
homepage_history_story         // 5개 문서: Prologue + 3 Acts + Epilogue
homepage_marquee               // 2개 문서: 움직이는 텍스트
homepage_periods               // 6개 문서: Period 데이터
  └─ highlights                // Subcollection: Period별 Highlights
homepage_footer                // Singleton: Footer 콘텐츠
```

#### 2.4.3 관리자 페이지 기능

**경로 구조**:
```
/admin/content/
  ├─ hero/              # HeroSection 관리
  ├─ timeline-intro/    # TimelineIntro 관리
  ├─ history-story/     # HistoryStory 관리
  ├─ marquee/           # Marquee 관리
  ├─ periods/           # Period 관리
  ├─ footer/            # Footer 관리
  └─ history/           # ✅ 별빛 아카이브 (완료)
```

**주요 기능**:
- **CRUD 완전 지원**:
  - Create: 새 콘텐츠 추가
  - Read: 목록 조회 및 상세 보기
  - Update: 기존 콘텐츠 수정
  - Delete: 콘텐츠 삭제

- **이미지 관리**:
  - 드래그 앤 드롭 업로드
  - Firebase Storage 연동
  - 썸네일 미리보기
  - 이미지 URL 관리

- **텍스트 편집**:
  - 리치 텍스트 에디터 (선택)
  - 멀티라인 텍스트 지원
  - 실시간 글자 수 카운터

- **순서 관리**:
  - Period/Highlight 순서 변경 (드래그 앤 드롭)
  - Order 필드 자동 관리

- **활성화 제어**:
  - 콘텐츠 활성화/비활성화 토글
  - 임시 저장 기능

#### 2.4.4 메인 페이지 연동

**Firestore 실시간 연동**:
- 모든 섹션 컴포넌트에서 Firestore 데이터 로드
- Fallback 데이터 제공 (Firestore 오류 시)
- 로딩 상태 UI 표시
- 캐싱 및 성능 최적화

**예시 (HeroSection)**:
```typescript
'use client';
import { useEffect, useState } from 'react';
import { getPublicHeroContent } from '@/lib/firestore/public/hero';

export function HeroSection() {
  const [hero, setHero] = useState(fallbackHero);

  useEffect(() => {
    const loadHero = async () => {
      const data = await getPublicHeroContent();
      if (data) setHero(data);
    };
    loadHero();
  }, []);

  return <section style={{ backgroundImage: `url(${hero.backgroundImage})` }}>
    <h1>{hero.mainTitle} {hero.mainSubtitle}</h1>
  </section>;
}
```

#### 2.4.5 초기 데이터 마이그레이션

**목적**: 기존 하드코딩된 데이터를 Firestore로 자동 이전

**마이그레이션 스크립트**:
```bash
npm run migrate:all          # 전체 데이터 마이그레이션
npm run migrate:hero         # HeroSection만
npm run migrate:periods      # Periods만
npm run migrate:footer       # Footer만
```

**마이그레이션 단계**:
1. 하드코딩된 데이터 추출
2. Firestore Collection 생성
3. 데이터 변환 및 업로드
4. 검증 및 확인

#### 2.4.6 Security & 권한 관리

**Firebase Security Rules**:
- 읽기: 모든 사용자 허용
- 쓰기: 관리자 전용 (`admin == true` 토큰)

**관리자 인증**:
- Firebase Custom Claims 활용
- 관리자 페이지 접근 제어
- 로그인 필수

#### 2.4.7 Success Metrics

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| CMS 관리 콘텐츠 비율 | 100% (모든 하드코딩 제거) | 코드 검사 |
| 관리자 페이지 사용률 | 주 1회 이상 | Google Analytics |
| 콘텐츠 수정 시간 | < 5분 (평균) | 사용자 피드백 |
| Firestore 쿼리 성능 | < 500ms | Performance Monitoring |
| 오류 발생률 | < 1% | Error Tracking |

#### 2.4.8 개발 우선순위

| 순위 | CMS 모듈 | 예상 기간 | 중요도 | 상태 |
|------|---------|-----------|--------|------|
| **1** | HeroSection CMS | 2일 | ⭐⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **2** | Period & Highlights CMS | 3일 | ⭐⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) ⭐ |
| **3** | Footer CMS | 1일 | ⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **4** | Marquee CMS | 1일 | ⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **5** | TimelineIntro CMS | 2일 | ⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **6** | HistoryStory CMS | 3일 | ⭐⭐⭐⭐ | 🔜 대기 (마지막 모듈!) |

**총 예상 기간**: 12일 (약 2주)
**완료**: 5/6 모듈 (83%) ⭐
**남은 기간**: 3일 (HistoryStory CMS만 남음!)

#### 2.4.9 기술 스택

**Frontend**:
- React 19.2.3 (Client Components)
- Next.js 15.5.9 (App Router)
- Framer Motion 11.18.2 (애니메이션 유지)

**Backend**:
- Firebase Firestore 12.7.0 (NoSQL 데이터베이스)
- Firebase Storage 12.7.0 (이미지 저장)
- Firebase Auth 12.7.0 (관리자 인증)

**추가 라이브러리**:
- `react-dropzone`: 이미지 드래그 앤 드롭
- `isomorphic-dompurify`: XSS 방지

#### 2.4.10 참고 문서

- **상세 개발 계획**: `docs/CMS_Development_Plan.md`
- **기술 사양**: `docs/TRD_SHU_90th_Anniversary.md` (업데이트 예정)
- **개발 규칙**: `RULES.md` (CMS 섹션 추가됨)

---

### 2.5 감성 효과 강화 (계속)

#### 2.3.1 배경 음악 플레이어

**목적**: 감성적 분위기를 조성하고 사용자 몰입도 증대

**주요 기능**:
- **음악 선택**:
  - 학교 찬가 (공식 교가)
  - 앰비언트 음악 (감성적 배경음)
  - 사용자 ON/OFF 제어
- **플레이어 UI**:
  - 하단 고정 미니 플레이어
  - Play/Pause, 볼륨 조절
  - 트랙 정보 표시
- **자동 재생 정책**:
  - 페이지 진입 시 자동 재생 OFF (브라우저 정책 준수)
  - 사용자 클릭 후 재생 시작

**기술 스택**:
- HTML5 Audio API
- Howler.js (Optional, 크로스 브라우저 호환성)

**Success Metrics**:
- 음악 재생 활성화율: 30%
- 평균 재생 시간: 3분

#### 2.3.2 페이지 전환 사운드 효과

**목적**: 인터랙션에 피드백을 제공하여 사용자 경험 향상

**주요 기능**:
- 버튼 클릭 시 서틀한 클릭 사운드
- 페이지 전환 시 우쉬(woosh) 사운드
- 스크롤 마일스톤 도달 시 치임(chime) 사운드
- 볼륨 조절 및 음소거 옵션

**사운드 디자인**:
- 서브틀하고 우아한 사운드 (과하지 않게)
- 짧은 지속 시간 (0.1~0.5초)
- 고품질 오디오 파일 (WAV 또는 MP3)

**Success Metrics**:
- 사운드 활성화율: 20%
- 사용자 피드백: 긍정적 (설문조사)

#### 2.3.3 추가 파티클 효과

**목적**: 시각적 깊이감과 감성적 분위기 조성

**주요 기능**:
- **별 파티클**:
  - 히어로 섹션 배경에 별빛 반짝임
  - 랜덤 위치 및 깜빡임 애니메이션
- **빛 파티클**:
  - 스크롤 시 떠다니는 빛 입자
  - 마우스 커서 추종 효과 (Optional)
- **먼지 파티클**:
  - 히스토리 섹션에 떠다니는 먼지 효과
  - 시간의 흐름과 향수 표현

**기술 스택**:
- Framer Motion
- Canvas API (고성능 파티클)
- requestAnimationFrame

**Success Metrics**:
- 성능 영향: FPS 50+ 유지
- 사용자 피드백: 시각적 매력도 4.5/5

#### 2.3.4 감성적 컬러 그라데이션 애니메이션

**목적**: 시대별 감정을 컬러로 표현하여 감성 전달

**주요 기능**:
- 시대별 테마 컬러 그라데이션
  - 태동기: Sepia/Warm tones
  - 재건기: Gray/Cool tones
  - 성장기: Green/Growth tones
  - 도약기: Blue/Ambitious tones
  - 혁신기: Purple/Innovative tones
  - 미래: Gold/Hopeful tones
- 스크롤에 따라 부드러운 컬러 전환
- CSS Custom Properties로 동적 테마 적용

**Success Metrics**:
- 사용자 피드백: 감성 전달도 4.5/5

#### 2.3.5 마이크로 인터랙션

**목적**: 세부적인 인터랙션 피드백으로 사용자 경험 향상

**주요 기능**:
- 버튼 호버 시 스케일 업 + 그림자 증가
- 카드 호버 시 lift-up 애니메이션
- 입력 필드 포커스 시 보더 글로우
- 체크박스/라디오 버튼 체크 시 체크마크 애니메이션
- 로딩 스피너 애니메이션

**기술 스택**:
- Framer Motion
- Tailwind CSS transitions

**Success Metrics**:
- 사용자 피드백: UX 만족도 4.5/5

---

## 👥 User Stories

### 동문 페르소나: 김영희 (50대, 1992년 졸업)

**배경**: 간호학과 출신, 현재 서울의 한 병원에서 수간호사로 근무. 대학 시절 추억이 많고 동기생들과 가끔 연락하며 지낸다.

**User Stories**:
1. **AS A** 동문, **I WANT TO** 학창 시절 사진을 보며 추억을 회상하고 싶다, **SO THAT** 그 시절의 감정을 다시 느낄 수 있다.
2. **AS A** 동문, **I WANT TO** 방명록에 모교에 대한 감사 메시지를 남기고 싶다, **SO THAT** 나의 마음을 표현하고 다른 동문들과 공유할 수 있다.
3. **AS A** 동문, **I WANT TO** 같은 해 졸업한 동기생들을 찾고 싶다, **SO THAT** 다시 연락하고 추억을 나눌 수 있다.
4. **AS A** 동문, **I WANT TO** 대학의 현재 모습과 발전상을 확인하고 싶다, **SO THAT** 모교에 대한 자긍심을 느끼고 기부 등을 고려할 수 있다.

### 재학생 페르소나: 박준서 (21세, 물리치료학과 2학년)

**배경**: 서울 출신, 대학 입학 2년차. 전공에 만족하지만 대학 역사에 대해서는 잘 모른다.

**User Stories**:
1. **AS A** 재학생, **I WANT TO** 우리 대학의 역사와 전통을 쉽게 이해하고 싶다, **SO THAT** 대학에 대한 자긍심을 느끼고 친구들에게 자랑할 수 있다.
2. **AS A** 재학생, **I WANT TO** 90주년 기념 이벤트에 참여하고 싶다, **SO THAT** 특별한 경험을 하고 추억을 만들 수 있다.
3. **AS A** 재학생, **I WANT TO** 선배들의 이야기를 듣고 싶다, **SO THAT** 진로에 대한 영감을 얻을 수 있다.

### 예비 신입생 페르소나: 이서연 (18세, 고3 수험생)

**배경**: 보건 계열 진학 희망. 여러 대학을 비교 중.

**User Stories**:
1. **AS AN** 예비 신입생, **I WANT TO** 대학의 역사와 권위를 확인하고 싶다, **SO THAT** 신뢰할 수 있는 대학인지 판단할 수 있다.
2. **AS AN** 예비 신입생, **I WANT TO** 졸업생들의 진로와 성과를 보고 싶다, **SO THAT** 졸업 후 나의 미래를 상상할 수 있다.
3. **AS AN** 예비 신입생, **I WANT TO** 캠퍼스를 가상으로 둘러보고 싶다, **SO THAT** 방문 전에 분위기를 파악할 수 있다.

---

## 📊 Success Metrics (KPIs)

### 1. 사용자 참여도 (Engagement)

| 지표 | 목표 (3개월) | 측정 방법 |
|------|--------------|----------|
| 평균 페이지 체류 시간 | 5분 이상 | Google Analytics |
| 평균 스크롤 깊이 | 70% 이상 | Google Analytics |
| 재방문율 | 30% | Google Analytics |
| 방명록 작성 수 | 500+ | Firestore 쿼리 |
| 추억 공유 게시물 수 | 200+ | Firestore 쿼리 |
| 댓글 수 | 500+ | Firestore 쿼리 |
| 좋아요 총 횟수 | 2000+ | Firestore 쿼리 |

### 2. 기술적 성능 (Performance)

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| Largest Contentful Paint (LCP) | < 2.5초 | Lighthouse, Web Vitals |
| First Input Delay (FID) | < 100ms | Lighthouse, Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse, Web Vitals |
| Time to Interactive (TTI) | < 3.5초 | Lighthouse |
| Lighthouse Performance Score | 90+ | Lighthouse |

### 3. 콘텐츠 참여도 (Content Engagement)

| 지표 | 목표 (3개월) | 측정 방법 |
|------|--------------|----------|
| 비디오 재생 수 | 5000+ | Custom Analytics |
| 비디오 평균 재생 완료율 | 60% | Custom Analytics |
| 이미지 다운로드 수 | 200+ | Custom Analytics |
| 소셜 공유 횟수 | 100+ | Custom Analytics |

### 4. 기기 및 브라우저 (Device & Browser)

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 모바일 트래픽 비율 | 60% | Google Analytics |
| 데스크톱 트래픽 비율 | 40% | Google Analytics |
| 주요 브라우저 호환성 | Chrome, Safari, Edge 100% | Manual Testing |

### 5. 사용자 만족도 (User Satisfaction)

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| Net Promoter Score (NPS) | 50+ | 설문조사 |
| 감성 전달도 | 4.5/5 | 설문조사 |
| 사용 편의성 | 4.5/5 | 설문조사 |
| 시각적 매력도 | 4.5/5 | 설문조사 |

---

## 🚫 Out of Scope (향후 개발)

다음 기능들은 Phase 2 MVP에서는 제외되며, 향후 개발 시 고려될 수 있습니다:

1. **실시간 채팅 시스템**
   - 동문 간 실시간 메신저
   - 이유: 개발 복잡도 높음, 모니터링 리소스 필요

2. **동문 회비 결제 시스템**
   - 온라인 기부 및 회비 납부
   - 이유: PG사 연동, 법적 검토 필요

3. **CRM 통합**
   - 동문 데이터베이스와의 통합
   - 이유: 레거시 시스템 연동 복잡

4. **모바일 앱 개발**
   - 네이티브 iOS/Android 앱
   - 이유: PWA로 충분, 개발 비용 고려

5. **AI 기반 추천 시스템**
   - 개인화된 콘텐츠 추천
   - 이유: 데이터 축적 필요, ML 인프라 구축 필요

6. **라이브 스트리밍**
   - 90주년 기념식 라이브 방송
   - 이유: 인프라 비용, 기술적 복잡도

7. **게임/퀴즈**
   - 역사 퀴즈, 미니 게임
   - 이유: 개발 우선순위 낮음

---

## 📅 프로젝트 타임라인 (예상)

| Phase | 작업 | 예상 기간 | 상태 |
|-------|------|-----------|------|
| **Phase 0** | PRD/TRD 작성 및 승인 | 1주 | ✅ 완료 |
| **Phase 1** | 메인 페이지 및 기본 구조 | - | ✅ 완료 |
| **Phase 2.1** | 동문 인터랙션 개발 | 4주 | ⏸️ 부분 보류 |
| **Phase 2.2** | 멀티미디어 갤러리 개발 | 3주 | 🔜 예정 |
| **Phase 2.3** | 감성 효과 강화 | 2주 | 🔜 예정 |
| **Phase 2.4** | **통합 CMS 시스템 구축** ⭐ | **2주** | **🚀 최우선** |
| **Phase 3** | QA 및 버그 수정 | 2주 | 🔜 예정 |
| **Phase 4** | 배포 및 런칭 | 1주 | 🔜 예정 |
| **Total** | | **15주** | |

### Phase 2.4 상세 일정 (CMS 개발)

| Week | Task | Deliverable | 상태 |
|------|------|-------------|------|
| **Week 1** | HeroSection, Footer, Marquee, TimelineIntro, Period & Highlights CMS | 5개 모듈 완성 | ✅ 완료 (2025-12-26) ⭐ |
| **Week 2** | HistoryStory CMS + 통합 테스트 | 1개 모듈 완성 + 테스트 | 🔜 진행 예정 |

**현재 진행 상황 (2025-12-26 최종)**:
- ✅ Week 1 완료: HeroSection, Footer, Marquee, TimelineIntro, Period & Highlights (5/6 모듈, 83%)
- 🔜 Week 2 남은 작업: HistoryStory (1/6 모듈, 17%)

### 우선순위 조정

**최우선 개발**: Phase 2.4 (통합 CMS 시스템)
- 이유: 메인 페이지 콘텐츠 관리 필수 기능
- 의존성: 모든 콘텐츠 업데이트의 기반
- 사용자 영향: 관리자의 일상 업무 효율화

---

## 🎨 디자인 철학

### 핵심 무드

> "어둡고 영화 같은 (cinematic), 향수를 불러일으키는 (nostalgic), 경외감을 주는 (reverential)"

### 컬러 시스템

**Primary Colors**:
- Black: `#0a0a0a` (배경)
- White: `#ffffff` (텍스트)

**Secondary Colors** (시대별 테마):
- Amber/Gold: `#f59e0b`, `#fef3c7` (감성적 강조, 따뜻함)
- Blue: `#3b82f6`, `#60a5fa` (미래, 혁신)
- Gray Scale: `#171717`, `#525252`, `#a3a3a3`, `#ededed` (중립, 우아함)

**Opacity & Blend Modes**:
- 투명도: `/10`, `/20`, `/40`, `/70` 광범위 활용
- Blend Modes: `mix-blend-overlay`, `mix-blend-difference`, `mix-blend-screen`

### 타이포그래피

**Font Family**:
- **Geist Sans**: 주요 텍스트, 헤더
- **Geist Mono**: 숫자, 날짜, 코드

**Font Sizes**:
- Hero: `text-8xl` ~ `text-9xl` (96px ~ 128px)
- Heading 1: `text-6xl` (60px)
- Heading 2: `text-4xl` (36px)
- Heading 3: `text-2xl` (24px)
- Body: `text-base` (16px)
- Caption: `text-sm` (14px)

**Font Weights**:
- Bold: `font-bold` (700) - 헤더, 강조
- Normal: `font-normal` (400) - 본문
- Light: `font-light` (300) - 부제목, 캡션

**Letter Spacing**:
- Tight: `tracking-tighter` - 큰 헤더
- Wide: `tracking-widest` - 소제목, 강조

### 애니메이션 원칙

1. **Scroll-Driven**: 모든 주요 애니메이션은 스크롤 진행도와 동기화
2. **Parallax**: 깊이감을 위한 다층 패럴랙스 효과
3. **Easing**: 부드러운 ease-out, spring 이징 사용
4. **Performance**: 60fps 유지를 위해 transform과 opacity만 애니메이션
5. **Purposeful**: 모든 애니메이션은 스토리텔링과 감정 전달 목적 보유

### 레이아웃

**Grid System**:
- 12열 그리드 (Tailwind CSS 기본)
- Gutters: 16px (모바일), 24px (태블릿), 32px (데스크톱)

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px ~ 1024px
- Desktop: > 1024px

**Spacing Scale** (Tailwind 기본):
- `space-2` (8px), `space-4` (16px), `space-8` (32px), `space-16` (64px), `space-32` (128px)

---

## 🔒 개인정보 보호 및 보안

### 데이터 수집

**수집 항목**:
- 필수: 이름, 졸업 연도 (방명록/게시판)
- 선택: 전공, 이메일, 전화번호 (동기생 찾기)

**동의 절차**:
- 개인정보 수집 및 이용 동의서 표시
- 체크박스로 명시적 동의 획득
- 개인정보 처리방침 링크 제공

### 보안 조치

1. **Firebase Security Rules**: Firestore 및 Storage에 엄격한 규칙 적용
2. **Input Sanitization**: XSS 공격 방지를 위한 입력 검증
3. **Image Validation**: 업로드 파일 타입 및 크기 검증
4. **Rate Limiting**: 스팸 방지를 위한 요청 제한
5. **HTTPS**: 모든 통신 암호화

### 개인정보 보호

- **익명 작성 옵션**: 방명록 및 게시판에서 익명 가능
- **프로필 공개 설정**: 동기생 찾기에서 선택적 공개
- **데이터 삭제 요청**: 사용자 데이터 삭제 요청 지원

---

## 🌐 접근성 (Accessibility)

### WCAG 2.1 AA 준수

1. **Keyboard Navigation**: 모든 인터랙티브 요소 키보드 접근 가능
2. **Screen Reader**: ARIA labels 및 semantic HTML 사용
3. **Color Contrast**: 최소 4.5:1 대비율 유지
4. **Focus Indicators**: 포커스 상태 명확히 표시
5. **Alt Texts**: 모든 이미지에 대체 텍스트 제공
6. **Form Labels**: 모든 입력 필드에 레이블 제공

### 반응형 디자인

- **Mobile First**: 모바일 우선 설계
- **Touch Targets**: 최소 44x44px 터치 영역
- **Flexible Layouts**: 다양한 화면 크기 지원

---

## 📝 콘텐츠 전략

### 콘텐츠 톤 앤 매너 (Tone & Manner)

- **감성적 (Emotional)**: 추억과 감동을 전달하는 스토리텔링
- **존중하는 (Respectful)**: 역사와 전통에 대한 경외감 표현
- **희망적 (Hopeful)**: 미래에 대한 긍정적 비전 제시
- **포용적 (Inclusive)**: 모든 동문과 구성원을 환영하는 태도

### 콘텐츠 타입

1. **역사적 사실**: 정확하고 검증된 정보
2. **개인 스토리**: 동문들의 에피소드와 추억
3. **비주얼 콘텐츠**: 사진, 비디오로 생동감 전달
4. **인터랙티브**: 사용자 참여 유도

### 다국어 지원

- **현재**: 한글/영문 이중 언어
- **향후**: 중국어, 일본어 등 확장 고려

---

## 🎯 마케팅 및 프로모션

### 런칭 전략

1. **티저 캠페인**: SNS를 통한 사전 홍보 (2주 전)
2. **언론 보도자료**: 주요 교육 매체에 배포
3. **이메일 마케팅**: 동문 데이터베이스 활용
4. **소셜 미디어**: Facebook, Instagram, YouTube 채널 활용
5. **캠퍼스 이벤트**: 오프라인 행사와 연계

### 지속적 운영

- **주간 콘텐츠 업데이트**: 새로운 사진, 비디오 추가
- **동문 스토리 시리즈**: 매월 주요 동문 인터뷰
- **이벤트 연계**: 졸업식, 입학식 등 행사와 연동
- **SNS 크로스 포스팅**: 주요 콘텐츠 소셜 미디어 공유

---

## 💡 핵심 성공 요인 (Critical Success Factors)

1. **감성적 스토리텔링**: 단순 정보 전달이 아닌 감동을 주는 경험
2. **기술적 완성도**: 부드러운 애니메이션과 빠른 성능
3. **사용자 참여**: 동문들의 적극적인 콘텐츠 생성 유도
4. **지속적 운영**: 런칭 후에도 꾸준한 콘텐츠 업데이트
5. **커뮤니티 형성**: 동문 간 유대감 강화 및 네트워크 구축

---

## 📞 문의 및 피드백

**프로젝트 관리자**: [이름]
**이메일**: [이메일]
**슬랙 채널**: #shu-90th-anniversary
**Jira 프로젝트**: SHU90

---

**문서 끝**

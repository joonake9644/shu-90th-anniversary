ㅓ# CMS 관리자 페이지 개발 계획서

**문서 버전**: 1.0실제 
**작성일**: 2025-12-26
**프로젝트명**: SHU 90th Anniversary Website - CMS System
**목적**: 메인 홈페이지의 모든 콘텐츠를 Firestore 기반 CMS로 관리

---

## 📋 Executive Summary

### 개발 목표
메인 홈페이지(`src/app/page.tsx`)의 **모든 하드코딩된 콘텐츠**를 Firestore로 이전하고, 관리자 페이지에서 **이미지, 동영상, 텍스트를 CRUD**(생성, 조회, 수정, 삭제) 가능하도록 **통합 CMS 시스템 구축**

### 핵심 원칙
1. **Zero Hardcoding**: 모든 콘텐츠는 Firestore에서 관리
2. **Admin-First**: 관리자 페이지에서 모든 콘텐츠 제어 가능
3. **Fallback Support**: Firestore 오류 시 로컬 데이터 사용
4. **Real-time Update**: 관리자 수정 시 메인 페이지 즉시 반영

### 🎯 현재 진행 상황 (2025-12-26 최종 업데이트)

**전체 진행률**: 5/6 모듈 완료 (83%) ⭐

#### ✅ 완료된 모듈
1. **HeroSection CMS** - 7개 필드 관리 가능
   - 배경 이미지, 뱃지, 타이틀, 부제목 등
   - Admin: `/admin/content/hero`
   - Migration: `npm run migrate:hero`
   - 완료일: 2025-12-26

2. **Footer CMS** - 16개 필드 관리 가능
   - 브랜드, 소셜 링크, Quick Links, Contact, Legal
   - Admin: `/admin/content/footer`
   - Migration: `npm run migrate:footer`
   - 완료일: 2025-12-26

3. **Marquee CMS** - 10개 필드 관리 가능 (2개 텍스트)
   - 방향, 속도, 활성화 설정
   - Admin: `/admin/content/marquee`
   - Migration: `npm run migrate:marquee`
   - 완료일: 2025-12-26

4. **TimelineIntro CMS** - 6개 필드 관리 가능
   - 1936 텍스트, Dr. Rue 명언 (영문/한글), Attribution, Title
   - Admin: `/admin/content/timeline-intro`
   - Migration: `npm run migrate:timeline-intro`
   - 완료일: 2025-12-26

5. **Period & Highlights CMS** ⭐ **[방금 완료!]** - 가장 복잡한 모듈
   - 6개 Period + 총 18개 Highlights (Subcollection 구조)
   - Admin: `/admin/content/periods` (목록)
   - Admin: `/admin/content/periods/[id]/edit` (Period 편집)
   - Admin: `/admin/content/periods/[id]/highlights` (Highlight 관리)
   - Migration: `npm run migrate:periods`
   - Firestore: `homepage_periods` + `highlights` Subcollection
   - 메인 페이지 연동: `src/app/page.tsx` (Firestore 데이터 로드)
   - TimelineProgressBar 연동 완료
   - 완료일: 2025-12-26

**총 관리 가능 필드**: 39개 (기존) + 72개 (Period & Highlights) = **111개 필드**

#### 🔜 남은 모듈 (1개만!)
6. **HistoryStory CMS** - 중간 복잡도 (예상 3일)
   - 5개 Act (Prologue, Act 1-3, Epilogue)
   - 각 Act마다 다른 필드 구조
   - 예상 필드 수: 30+개

---

## 🎯 현재 하드코딩된 콘텐츠 분석

### 메인 페이지 구조 (src/app/page.tsx)

```typescript
1. HeroSection          // 히어로 섹션
2. TimelineIntro        // 타임라인 인트로
3. HistoryStory         // 히스토리 스토리 (4개 Act)
4. MarqueeSection       // 움직이는 텍스트 × 2
5. PeriodSection × 6    // 6개 시대 섹션
6. Footer               // 푸터
7. TimelineProgressBar  // 진행바 (데이터 참조)
```

### 하드코딩된 콘텐츠 상세

#### 1. **HeroSection** (src/components/sections/HeroSection.tsx)
| 콘텐츠 | 현재 값 | 관리 필요 |
|--------|---------|-----------|
| 배경 이미지 | `https://images.unsplash.com/...` | ✅ |
| 뱃지 텍스트 | "THE 90TH ANNIVERSARY" | ✅ |
| 대형 타이틀 | "90 YEARS OF HISTORY" | ✅ |
| 부제목 | "1936 - 2026" | ✅ |

#### 2. **TimelineIntro** (src/components/sections/TimelineIntro.tsx)
| 콘텐츠 | 현재 값 | 관리 필요 |
|--------|---------|-----------|
| Dr. Rue 명언 | (하드코딩) | ✅ |
| 내러티브 1 | "In the deepest darkness..." | ✅ |
| 내러티브 2 | "A light awakens" | ✅ |
| 1936 타이틀 | "1936" | ✅ |
| 1936 부제목 | "The Spark of Compassion" | ✅ |
| 6개 시대 이미지 | timelineData 참조 | ✅ (Period와 통합) |

#### 3. **HistoryStory** (src/components/sections/HistoryStory.tsx)
| 섹션 | 콘텐츠 | 관리 필요 |
|------|--------|-----------|
| **Prologue** | 내러티브 텍스트 × 3 | ✅ |
| | "In the deepest darkness..." | ✅ |
| | "A light awakens" | ✅ |
| | "1936", "The Spark of Compassion" | ✅ |
| **ACT 1: HARDSHIP** | 이미지 URL | ✅ |
| | 타이틀 "ACT 1: HARDSHIP" | ✅ |
| | 한글 제목 "고난, 그 깊은 뿌리" | ✅ |
| | 본문 텍스트 | ✅ |
| | 하이라이트 3개 | ✅ |
| **ACT 2: FOREST OF TRUTH** | 이미지 URL | ✅ |
| | 타이틀, 제목, 본문, 하이라이트 | ✅ |
| **ACT 3: PRISM OF LOVE** | 이미지 URL | ✅ |
| | 타이틀, 제목, 본문, 하이라이트 | ✅ |
| **EPILOGUE: PROMISE** | 타이틀, 제목, 본문 | ✅ |

#### 4. **MarqueeSection** (src/components/sections/MarqueeSection.tsx)
| 위치 | 텍스트 | 관리 필요 |
|------|--------|-----------|
| 첫 번째 | "History of 90 Years" | ✅ |
| 두 번째 | "Toward 100 Years" | ✅ |

#### 5. **PeriodSection × 6** (src/data/timelineData.ts)
| Period | 데이터 | 관리 필요 |
|--------|--------|-----------|
| **Period 1-6** | id, rangeLabel, yearStart, yearEnd | ✅ |
| | title, subtitle | ✅ |
| | heroMedia (이미지 URL) | ✅ |
| | highlights[] (각 2-5개) | ✅ |
| **Highlight** | id, title, year | ✅ |
| | thumb (이미지 URL) | ✅ |
| | description | ✅ |

**총 Highlights**: 18개

#### 6. **Footer** (src/components/layout/Footer.tsx)
| 콘텐츠 | 현재 값 | 관리 필요 |
|--------|---------|-----------|
| 브랜드명 | "SHU 90th" | ✅ |
| 슬로건 | "Truth · Love · Service" | ✅ |
| 설명 | "Celebrating 90 years..." | ✅ |
| Instagram | `https://www.instagram.com/...` | ✅ |
| Facebook | `https://www.facebook.com/...` | ✅ |
| Youtube | `https://www.youtube.com/...` | ✅ |
| Quick Links | 4개 링크 | ✅ |
| 주소 | "82 Mangu-ro, Dongdaemun-gu..." | ✅ |
| 전화번호 | "+82-2212-0082" | ✅ |
| 이메일 | "admin@shu.ac.kr" | ✅ |

---

## 🗄️ Firestore Collections 설계

### 1. `homepage_hero` Collection (Singleton)

**용도**: HeroSection 콘텐츠 관리

```typescript
interface HomepageHero {
  id: 'main' // 단일 문서
  backgroundImage: string // 배경 이미지 URL
  badgeText: string // "THE 90TH ANNIVERSARY"
  mainTitle: string // "90"
  mainSubtitle: string // "YEARS OF HISTORY"
  subtitle: string // "1936 - 2026"
  updatedAt: Timestamp
  createdAt: Timestamp
}
```

### 2. `homepage_timeline_intro` Collection (Singleton)

**용도**: TimelineIntro 콘텐츠 관리

```typescript
interface TimelineIntro {
  id: 'main'
  drRueQuote?: string // Dr. Rue 명언 (선택)
  narrative1: string // "In the deepest darkness..."
  narrative2: string // "A light awakens"
  year1936Title: string // "1936"
  year1936Subtitle: string // "The Spark of Compassion"
  updatedAt: Timestamp
  createdAt: Timestamp
}
```

### 3. `homepage_history_story` Collection

**용도**: HistoryStory의 4개 Act 관리

```typescript
interface HistoryStoryAct {
  id: string // 'prologue' | 'act1' | 'act2' | 'act3' | 'epilogue'
  order: number // 정렬 순서 (0-4)
  actType: 'prologue' | 'act1' | 'act2' | 'act3' | 'epilogue'

  // Prologue용
  prologueNarrative1?: string // "In the deepest darkness..."
  prologueNarrative2?: string // "A light awakens"
  prologueYear?: string // "1936"
  prologueSubtitle?: string // "The Spark of Compassion"

  // Act 1-3용
  actTitle?: string // "ACT 1: HARDSHIP"
  actTitleKr?: string // "고난, 그 깊은 뿌리"
  actImageUrl?: string // 이미지 URL
  actStory?: string // 본문 텍스트
  actHighlights?: Array<{
    year: string
    title: string
    description: string
  }>

  // Epilogue용
  epilogueTitle?: string // "100년을 향한 약속"
  epilogueStory?: string // 본문

  updatedAt: Timestamp
  createdAt: Timestamp
}
```

### 4. `homepage_marquee` Collection

**용도**: 움직이는 텍스트 관리

```typescript
interface MarqueeText {
  id: string // 'marquee1' | 'marquee2'
  position: number // 1 또는 2
  text: string // "History of 90 Years"
  direction: 'left' | 'right'
  speed: number // 기본 5
  enabled: boolean // 활성화 여부
  updatedAt: Timestamp
  createdAt: Timestamp
}
```

### 5. `homepage_periods` Collection

**용도**: 6개 시대 섹션 관리 (기존 timelineData 대체)

```typescript
interface Period {
  id: string // 'period-1' ~ 'period-6'
  order: number // 1-6 정렬 순서
  rangeLabel: string // "1936 ~ 1946"
  yearStart: number // 1936
  yearEnd: number // 1946
  title: string // "Beginning 태동기"
  subtitle: string // "민족의 건강과 교육을 위한 첫 걸음\nFirst Step..."
  heroMedia: string // 이미지 URL
  enabled: boolean // 활성화 여부
  updatedAt: Timestamp
  createdAt: Timestamp
}

// Subcollection: /homepage_periods/{periodId}/highlights
interface PeriodHighlight {
  id: string // 자동 생성
  order: number // 정렬 순서
  title: string // "경성요양병원 부속 간호원 양성소 설립"
  year: string // "1936"
  thumb: string // 썸네일 이미지 URL
  description: string // 설명
  enabled: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 6. `homepage_footer` Collection (Singleton)

**용도**: Footer 콘텐츠 관리

```typescript
interface HomepageFooter {
  id: 'main'
  brandName: string // "SHU 90th"
  slogan: string // "Truth · Love · Service"
  description: string // "Celebrating 90 years..."

  socialLinks: {
    instagram: string
    facebook: string
    youtube: string
  }

  quickLinks: Array<{
    label: string
    href: string
  }>

  contact: {
    address: string
    addressEn: string
    phone: string
    email: string
  }

  copyrightText: string // "Sahmyook Health University"

  updatedAt: Timestamp
  createdAt: Timestamp
}
```

---

## 📂 관리자 페이지 구조 설계

### 파일 구조

```
src/app/admin/content/
├── hero/
│   └── page.tsx                    # ✅ 완료 - HeroSection 관리
├── timeline-intro/
│   └── page.tsx                    # ✅ 완료 - TimelineIntro 관리
├── history-story/
│   ├── page.tsx                    # 🔜 Act 목록
│   ├── new/page.tsx                # 🔜 새 Act 추가
│   └── [id]/edit/page.tsx          # 🔜 Act 편집
├── marquee/
│   └── page.tsx                    # ✅ 완료 - Marquee 텍스트 관리
├── periods/
│   ├── page.tsx                    # 🔜 Period 목록
│   ├── new/page.tsx                # 🔜 새 Period 추가
│   ├── [id]/edit/page.tsx          # 🔜 Period 편집
│   └── [id]/highlights/
│       ├── page.tsx                # 🔜 Highlight 목록
│       ├── new/page.tsx            # 🔜 새 Highlight 추가
│       └── [highlightId]/edit/page.tsx  # 🔜 Highlight 편집
├── footer/
│   └── page.tsx                    # ✅ 완료 - Footer 관리
└── history/                        # ✅ 완료 - 별빛 아카이브
    ├── page.tsx
    ├── new/page.tsx
    └── [id]/edit/page.tsx
```

### 관리자 대시보드 통합

```
src/app/admin/
├── dashboard/
│   └── page.tsx                    # 🔜 전체 콘텐츠 현황 대시보드
└── content/
    └── page.tsx                    # 🔜 콘텐츠 관리 허브
```

---

## 🛠️ Firestore CRUD 함수 설계

### 파일 구조

```
src/lib/firestore/
├── admin/
│   ├── hero.ts                     # ✅ 완료 - HeroSection CRUD
│   ├── timelineIntro.ts            # ✅ 완료 - TimelineIntro CRUD
│   ├── historyStory.ts             # 🔜 HistoryStory CRUD
│   ├── marquee.ts                  # ✅ 완료 - Marquee CRUD
│   ├── periods.ts                  # 🔜 Periods CRUD
│   ├── highlights.ts               # 🔜 Highlights CRUD
│   ├── footer.ts                   # ✅ 완료 - Footer CRUD
│   └── history.ts                  # ✅ 완료 - 별빛 아카이브
└── public/
    ├── hero.ts                     # ✅ 완료 - 공개 조회
    ├── timelineIntro.ts            # ✅ 완료 - 공개 조회
    ├── historyStory.ts             # 🔜 공개 조회
    ├── marquee.ts                  # ✅ 완료 - 공개 조회
    ├── periods.ts                  # 🔜 공개 조회
    ├── footer.ts                   # ✅ 완료 - 공개 조회
    └── history.ts                  # ✅ 완료 - 별빛 아카이브
```

### 예시: Hero CRUD 함수

```typescript
// src/lib/firestore/admin/hero.ts

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const HERO_DOC_ID = 'main';

export interface HomepageHero {
  id: string;
  backgroundImage: string;
  badgeText: string;
  mainTitle: string;
  mainSubtitle: string;
  subtitle: string;
  updatedAt?: any;
  createdAt?: any;
}

// 조회
export async function getHeroContent(): Promise<HomepageHero | null> {
  const docRef = doc(db, 'homepage_hero', HERO_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as HomepageHero;
  }
  return null;
}

// 업데이트 (덮어쓰기)
export async function updateHeroContent(data: Omit<HomepageHero, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = doc(db, 'homepage_hero', HERO_DOC_ID);

  // 기존 문서 확인
  const existing = await getDoc(docRef);

  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
  };

  await setDoc(docRef, payload, { merge: true });
  return HERO_DOC_ID;
}

// 초기 데이터 마이그레이션
export async function migrateHeroData() {
  const initialData: Omit<HomepageHero, 'id' | 'createdAt' | 'updatedAt'> = {
    backgroundImage: 'https://images.unsplash.com/photo-1730307403182-46906ab72173...',
    badgeText: 'THE 90TH ANNIVERSARY',
    mainTitle: '90',
    mainSubtitle: 'YEARS OF HISTORY',
    subtitle: '1936 - 2026'
  };

  await updateHeroContent(initialData);
}
```

---

## 🔄 메인 페이지 Firestore 연동

### 예시: HeroSection 연동

```typescript
// src/components/sections/HeroSection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getPublicHeroContent } from '@/lib/firestore/public/hero';
import type { HomepageHero } from '@/lib/firestore/admin/hero';

// Fallback 데이터
const fallbackHero: HomepageHero = {
  id: 'main',
  backgroundImage: 'https://images.unsplash.com/photo-1730307403182-46906ab72173...',
  badgeText: 'THE 90TH ANNIVERSARY',
  mainTitle: '90',
  mainSubtitle: 'YEARS OF HISTORY',
  subtitle: '1936 - 2026'
};

export function HeroSection() {
  const [hero, setHero] = useState<HomepageHero>(fallbackHero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const data = await getPublicHeroContent();
        if (data) {
          setHero(data);
        }
      } catch (error) {
        console.error('Error loading hero:', error);
        // Fallback 사용
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  if (loading) {
    return <div className="h-screen bg-black" />; // 로딩 표시
  }

  return (
    <section className="...">
      {/* 배경 이미지 */}
      <div style={{ backgroundImage: `url(${hero.backgroundImage})` }} />

      {/* 뱃지 */}
      <span>{hero.badgeText}</span>

      {/* 타이틀 */}
      <span>{hero.mainTitle}</span>
      <span>{hero.mainSubtitle}</span>

      {/* 부제목 */}
      <p>{hero.subtitle}</p>
    </section>
  );
}
```

---

## 🎨 관리자 페이지 UI 설계

### 1. HeroSection 관리 페이지

**경로**: `/admin/content/hero`

**기능**:
- 배경 이미지 업로드 (드래그 앤 드롭)
- 텍스트 필드 편집
- 실시간 미리보기
- 저장 버튼

**UI 구성**:
```
┌─────────────────────────────────────┐
│ HeroSection 관리                    │
├─────────────────────────────────────┤
│ 배경 이미지                          │
│ [이미지 업로드 영역]                 │
│                                     │
│ 뱃지 텍스트                          │
│ [THE 90TH ANNIVERSARY]              │
│                                     │
│ 메인 타이틀                          │
│ [90]                                │
│                                     │
│ 메인 부제목                          │
│ [YEARS OF HISTORY]                  │
│                                     │
│ 서브 타이틀                          │
│ [1936 - 2026]                       │
│                                     │
│ [저장] [미리보기]                    │
└─────────────────────────────────────┘
```

### 2. Period 관리 페이지

**경로**: `/admin/content/periods`

**기능**:
- Period 목록 조회
- 순서 드래그 앤 드롭 변경
- Period 추가/편집/삭제
- Highlight 관리 (클릭 → Highlight 목록)

**UI 구성**:
```
┌─────────────────────────────────────────────────────┐
│ Period 목록 (6개)                 [+ 새 Period 추가] │
├─────────────────────────────────────────────────────┤
│ ☰ Period 1: Beginning 태동기                        │
│   1936~1946 | Highlights: 2개      [수정] [삭제]    │
├─────────────────────────────────────────────────────┤
│ ☰ Period 2: Reconstruction 정착·재건기              │
│   1947~1956 | Highlights: 2개      [수정] [삭제]    │
├─────────────────────────────────────────────────────┤
│ ... (나머지 4개)                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📅 개발 우선순위 및 일정

### Phase 1: 핵심 콘텐츠 CMS 구축 (2주)

| 순위 | 기능 | 예상 기간 | 중요도 | 상태 |
|------|------|-----------|--------|------|
| **1** | HeroSection CMS | 2일 | ⭐⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **2** | Period & Highlights CMS | 3일 | ⭐⭐⭐⭐⭐ | 🔜 대기 |
| **3** | Footer CMS | 1일 | ⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **4** | Marquee CMS | 1일 | ⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **5** | TimelineIntro CMS | 2일 | ⭐⭐⭐⭐ | ✅ 완료 (2025-12-26) |
| **6** | HistoryStory CMS | 3일 | ⭐⭐⭐⭐ | 🔜 대기 |

**총 예상 기간**: 12일 (약 2주)
**완료**: 4/6 모듈 (67%)

### Phase 2: 고급 기능 추가 (1주)

- 관리자 대시보드 통합
- 이미지 최적화 자동화
- 콘텐츠 버전 관리
- 미리보기 기능 강화

---

## 🔐 보안 고려사항

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 관리자만 쓰기, 모두 읽기
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    match /homepage_hero/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /homepage_periods/{periodId} {
      allow read: if true;
      allow write: if isAdmin();

      match /highlights/{highlightId} {
        allow read: if true;
        allow write: if isAdmin();
      }
    }

    match /homepage_timeline_intro/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /homepage_history_story/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /homepage_marquee/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /homepage_footer/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 📝 초기 데이터 마이그레이션 전략

### 단계별 마이그레이션

1. **Hero & Footer** (간단한 Singleton)
   - 하드코딩된 값을 Firestore에 복사
   - 관리자 페이지 UI 구축
   - 메인 페이지 연동

2. **Periods & Highlights** (복잡한 배열 구조)
   - `timelineData.ts`에서 Firestore로 이전
   - Subcollection 구조 활용
   - 순서 관리 로직 구현

3. **HistoryStory** (중간 복잡도)
   - 4개 Act를 개별 문서로 분리
   - 조건부 필드 활용

4. **Marquee & TimelineIntro** (간단)
   - 빠르게 구현 가능

### 마이그레이션 스크립트 예시

```typescript
// scripts/migrate-all-data.ts

import { migrateHeroData } from '@/lib/firestore/admin/hero';
import { migrateFooterData } from '@/lib/firestore/admin/footer';
import { migratePeriodsData } from '@/lib/firestore/admin/periods';
// ... 기타

export async function migrateAllData() {
  console.log('🚀 데이터 마이그레이션 시작...');

  try {
    await migrateHeroData();
    console.log('✅ Hero 마이그레이션 완료');

    await migrateFooterData();
    console.log('✅ Footer 마이그레이션 완료');

    await migratePeriodsData();
    console.log('✅ Periods 마이그레이션 완료');

    // ... 기타

    console.log('🎉 전체 마이그레이션 완료!');
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }
}
```

**실행 방법**:
```bash
npm run migrate:all
```

---

## ✅ 완료 체크리스트

### Phase 1: 데이터 구조 설계 ✅

- [x] 하드코딩된 콘텐츠 전체 분석
- [x] Firestore Collection 스키마 설계
- [x] 관리자 페이지 구조 설계
- [x] CRUD 함수 인터페이스 설계

### Phase 2: Firestore 설정 🔜

- [ ] Collections 생성
- [ ] Security Rules 적용
- [ ] Indexes 설정
- [ ] 초기 데이터 마이그레이션 스크립트 작성

### Phase 3: 관리자 페이지 개발 (진행 중)

#### HeroSection CMS ✅ 완료
- [x] `/admin/content/hero` 페이지 생성
- [x] `src/lib/firestore/admin/hero.ts` CRUD 함수
- [x] `src/lib/firestore/public/hero.ts` 공개 조회
- [x] 이미지 업로드 기능
- [x] UI 구현
- [x] 초기 데이터 마이그레이션 스크립트

#### Period & Highlights CMS ✅ 완료
- [x] `/admin/content/periods` 목록 페이지
- [x] `/admin/content/periods/[id]/edit` 편집 페이지
- [x] `/admin/content/periods/[id]/highlights` Highlight 관리 페이지
- [x] `src/lib/firestore/admin/periods.ts` Period CRUD 함수
- [x] `src/lib/firestore/admin/highlights.ts` Highlight CRUD 함수 (Subcollection)
- [x] `src/lib/firestore/public/periods.ts` 공개 조회 함수
- [x] Period 순서 관리 (order 필드)
- [x] Highlight 순서 관리 (order 필드)
- [x] 활성화/비활성화 토글
- [x] 이미지 미리보기
- [x] Subcollection 구조 (6개 Period + 18개 Highlights)
- [x] 초기 데이터 마이그레이션 스크립트 (`migrate-periods.js`)

#### Footer CMS ✅ 완료
- [x] `/admin/content/footer` 페이지
- [x] CRUD 함수
- [x] 소셜 링크 관리 UI
- [x] Quick Links 배열 관리
- [x] Contact 정보 관리
- [x] Legal 링크 관리
- [x] 초기 데이터 마이그레이션 스크립트

#### Marquee CMS ✅ 완료
- [x] `/admin/content/marquee` 페이지
- [x] CRUD 함수
- [x] 방향/속도 설정 UI
- [x] 활성화/비활성화 토글
- [x] 2개 마키 텍스트 관리
- [x] 초기 데이터 마이그레이션 스크립트

#### TimelineIntro CMS ✅ 완료
- [x] `/admin/content/timeline-intro` 페이지
- [x] CRUD 함수
- [x] 1936 텍스트 관리
- [x] Dr. Rue 명언 (영문/한글) 관리
- [x] Attribution 관리
- [x] Title (Left/Right) 관리
- [x] 초기 데이터 마이그레이션 스크립트

#### HistoryStory CMS 🔜
- [ ] `/admin/content/history-story` 목록 페이지
- [ ] Act 편집 페이지
- [ ] CRUD 함수

### Phase 4: 메인 페이지 Firestore 연동 (진행 중)

- [x] `HeroSection.tsx` Firestore 연동 ✅
- [x] `Footer.tsx` Firestore 연동 ✅
- [x] `src/app/page.tsx` Marquee Firestore 연동 ✅
- [x] `TimelineIntro.tsx` Firestore 연동 ✅
- [x] `src/app/page.tsx` Period & Highlights Firestore 연동 ✅
- [x] `PeriodSection.tsx` 컴포넌트 (Firestore 데이터 렌더링) ✅
- [x] `TimelineProgressBar` Period 데이터 연동 ✅
- [ ] `HistoryStory.tsx` Firestore 연동 🔜
- [x] Fallback 데이터 처리 (완료된 모듈) ✅
- [x] 로딩 상태 UI (완료된 모듈) ✅
- [x] 줄바꿈 처리 (TimelineIntro 명언) ✅

### Phase 5: 테스트 및 배포 🔜

- [ ] 기능 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트
- [ ] 문서 업데이트
- [ ] 프로덕션 배포

---

## 🎯 다음 작업: HistoryStory CMS (마지막 모듈!)

### 📋 HistoryStory 데이터 구조 분석

HistoryStory는 5개 Act로 구성:
1. **Prologue** - 내러티브 텍스트 (3개 필드)
2. **Act 1: HARDSHIP** - 이미지, 타이틀, 본문, 하이라이트
3. **Act 2: FOREST OF TRUTH** - 이미지, 타이틀, 본문, 하이라이트
4. **Act 3: PRISM OF LOVE** - 이미지, 타이틀, 본문, 하이라이트
5. **Epilogue: PROMISE** - 타이틀, 본문

### 🔧 개발 작업 목록

#### 1. Firestore CRUD 함수 생성
- [ ] `src/lib/firestore/admin/historyStory.ts` - HistoryStory CRUD
- [ ] `src/lib/firestore/public/historyStory.ts` - 공개 조회

#### 2. 관리자 페이지 개발
- [ ] `/admin/content/history-story` - Act 목록 페이지
- [ ] `/admin/content/history-story/[actId]/edit` - Act 편집 페이지

#### 3. 마이그레이션 및 연동
- [ ] `scripts/migrate-history-story.js` - 마이그레이션 스크립트
- [ ] `package.json` 스크립트 추가
- [ ] `src/components/sections/HistoryStory.tsx` Firestore 연동

#### 4. 테스트
- [ ] 관리자 페이지 기능 테스트
- [ ] 메인 페이지 렌더링 테스트
- [ ] Fallback 동작 확인

### 📊 예상 소요 시간: 3일

### 🎉 완료 후
HistoryStory CMS 완료 시 **전체 CMS 시스템 100% 완성!**
- 총 6개 모듈 모두 완료
- 140+ 개 필드 관리 가능
- 메인 홈페이지 Zero Hardcoding 달성

---

## 📚 참고 문서

- **PRD**: `docs/PRD_SHU_90th_Anniversary.md` (v1.4)
- **TRD**: `docs/TRD_SHU_90th_Anniversary.md`
- **RULES**: `RULES.md`
- **완료된 CMS 예시**:
  - `/admin/content/hero` (HeroSection)
  - `/admin/content/periods` (Period & Highlights - Subcollection)
  - `/admin/content/history` (별빛 아카이브)

---

**문서 버전**: 1.1 (Period & Highlights CMS 완료 반영)
**최종 업데이트**: 2025-12-26
**다음 작업**: HistoryStory CMS 개발

**문서 끝**

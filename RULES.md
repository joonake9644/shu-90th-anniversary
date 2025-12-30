# 프로젝트 개발 규칙

## ⚠️ 중요: 메인 페이지 보호 규칙

### 절대 금지 사항

**`src/app/page.tsx` 파일의 전체 구조를 임의로 변경하거나 교체하는 것은 절대 금지됩니다.**

**`src/components/sections/HeroSection.tsx` 파일의 디자인 레이아웃을 사용자 허락 없이 절대 변경 금지합니다.**

이 파일들은 원본 Figma 디자인을 기반으로 한 핵심 페이지 구조이며, 다음과 같은 정확한 순서와 구성으로 되어 있습니다:

### 원본 페이지 구조 (변경 금지)

```typescript
1. HeroSection - 90 YEARS OF HISTORY 히어로 섹션
2. TimelineIntro - 1936 강조 및 역사 전개
3. HistoryStory - 90년 역사 스토리텔링 (4개 Act 통합)
   - PROLOGUE: 불씨 → 1936
   - ACT 1: HARDSHIP (고난, 그 깊은 뿌리)
   - ACT 2: FOREST OF TRUTH (진리의 숲을 이루다)
   - ACT 3: PRISM OF LOVE (세상으로 번지는 사랑의 빛)
   - EPILOGUE: PROMISE (100년을 향한 약속)
4. MarqueeSection - TRUTH · LOVE · SERVICE 움직이는 텍스트
5. PeriodSection × 6 - 태동기부터 6개 시대 섹션
   - 1936~1946: Beginning 태동기
   - 1947~1956: 재건기
   - 1957~1996: 성장기
   - 1997~2016: 도약기
   - 2017~2024: 혁신기
   - 2025~2036: 미래
6. Footer - 푸터
7. TimelineNavigation - Sticky 타임라인 네비게이션
```

### 허용되는 수정

✅ **개별 컴포넌트 내부 수정**
- 각 섹션 컴포넌트의 스타일링 조정
- 애니메이션 파라미터 수정
- 텍스트 내용 변경
- 이미지 교체

✅ **새로운 기능 추가**
- 기존 구조를 유지하면서 새로운 props 추가
- 인터랙션 개선
- 성능 최적화

### 금지되는 수정

❌ **절대 금지**
- `src/app/page.tsx`의 컴포넌트 순서 변경
- 컴포넌트 제거 또는 대체
- 새로운 섹션을 임의로 추가하여 구조 변경
- HistoryStory를 별도의 4개 섹션으로 분리
- PeriodSection들을 다른 컴포넌트로 대체
- **`HeroSection.tsx`의 디자인 레이아웃, 구조, 스타일을 사용자 허락 없이 변경**
- **`HeroSection.tsx`의 내용을 다른 컴포넌트 내용으로 교체**
- **`HeroSection.tsx`의 "90 YEARS OF HISTORY" 디자인을 임의로 수정**

### 변경이 필요한 경우

1. **반드시 사용자에게 확인 요청**
   - 어떤 섹션을 왜 변경해야 하는지 설명
   - 변경의 영향 범위 명시
   - 사용자의 명시적 승인 후 진행

2. **변경 전 백업**
   - 현재 구조를 별도 파일로 백업
   - Git commit 생성

3. **원본 참조 유지**
   - `90_year_figma` 폴더의 원본 구조를 항상 참조
   - 원본과의 일관성 유지

## 원본 참조 경로

원본 Figma 기반 구조: `90_year_figma/src/components/pages/HomePage.tsx`

이 파일을 참조하여 항상 원본 구조를 확인하고 유지해야 합니다.

## 위반 시 조치

이 규칙을 위반하여 메인 페이지 구조를 임의로 변경한 경우:
1. 즉시 원본 구조로 복원
2. Git에서 이전 commit으로 revert
3. `90_year_figma` 폴더의 원본 파일을 다시 참조하여 복원

---

## 🗄️ CMS 콘텐츠 관리 규칙

### 콘텐츠 관리 원칙

**모든 하드코딩된 콘텐츠는 Firestore CMS로 관리됩니다.**

메인 페이지의 **구조(Structure)**는 변경 금지이지만, **콘텐츠(Content)**는 CMS에서 관리합니다.

### CMS로 관리되는 콘텐츠

#### 1. HeroSection ✅ **[CMS 완료 - 2025-12-26]**
- ✅ CMS 관리: 배경 이미지, 뱃지 텍스트, 타이틀, 부제목 (7개 필드)
- ✅ 관리자 페이지: `/admin/content/hero`
- ✅ Firestore 연동 완료
- ❌ 구조 변경 금지: 레이아웃, 애니메이션, 스타일

#### 2. TimelineIntro ✅ **[CMS 완료 - 2025-12-26]**
- ✅ CMS 관리: Dr. Rue 명언 (영문/한글), Attribution, 1936 텍스트, Title (6개 필드)
- ✅ 관리자 페이지: `/admin/content/timeline-intro`
- ✅ Firestore 연동 완료
- ❌ 구조 변경 금지: 애니메이션 시퀀스, 시각 효과

#### 3. HistoryStory 🔜 **[CMS 개발 대기]**
- ✅ CMS 관리: Act별 이미지, 타이틀, 본문, 하이라이트
- 🔜 관리자 페이지: `/admin/content/history-story` (개발 예정)
- ❌ 구조 변경 금지: 4개 Act 구조, 스크롤 애니메이션

#### 4. MarqueeSection ✅ **[CMS 완료 - 2025-12-26]**
- ✅ CMS 관리: 움직이는 텍스트 × 2, 방향, 속도, 활성화 (10개 필드)
- ✅ 관리자 페이지: `/admin/content/marquee`
- ✅ Firestore 연동 완료
- ❌ 구조 변경 금지: 마키 애니메이션 로직

#### 5. PeriodSection × 6 ✅ **[CMS 완료 - 2025-12-26]**
- ✅ CMS 관리: 6개 Period + 18개 Highlights (Subcollection)
- ✅ 관리자 페이지: `/admin/content/periods`
- ✅ Period 편집: `/admin/content/periods/[id]/edit`
- ✅ Highlight 관리: `/admin/content/periods/[id]/highlights`
- ✅ Firestore 연동 완료 (`src/app/page.tsx`)
- ❌ 구조 변경 금지: 6개 섹션 구조, 레이아웃

#### 6. Footer ✅ **[CMS 완료 - 2025-12-26]**
- ✅ CMS 관리: 브랜드명, 슬로건, 소셜 링크, Quick Links, Contact, Legal (16개 필드)
- ✅ 관리자 페이지: `/admin/content/footer`
- ✅ Firestore 연동 완료
- ❌ 구조 변경 금지: Footer 레이아웃

### 📊 CMS 개발 현황 (2025-12-26 최종)

**완료**: 5/6 모듈 (83%) ⭐
- ✅ HeroSection CMS
- ✅ Footer CMS
- ✅ Marquee CMS
- ✅ TimelineIntro CMS
- ✅ Period & Highlights CMS (Subcollection 구조)

**대기**: 1/6 모듈 (17%)
- 🔜 HistoryStory CMS

**총 관리 가능 필드**: 111개

### Firestore Collections

메인 페이지 콘텐츠는 다음 Collections에서 관리됩니다:

```
homepage_hero               // HeroSection 콘텐츠
homepage_timeline_intro     // TimelineIntro 콘텐츠
homepage_history_story      // HistoryStory Acts (5개 문서)
homepage_marquee            // Marquee 텍스트 (2개)
homepage_periods            // Period 데이터 (6개)
  └─ highlights             // Subcollection (각 Period별)
homepage_footer             // Footer 콘텐츠
```

### 관리자 페이지 경로

콘텐츠 관리는 다음 관리자 페이지에서 수행합니다:

```
/admin/content/hero              # ✅ HeroSection 관리 (완료)
/admin/content/timeline-intro    # ✅ TimelineIntro 관리 (완료)
/admin/content/history-story     # 🔜 HistoryStory 관리 (개발 예정)
/admin/content/marquee           # ✅ Marquee 관리 (완료)
/admin/content/periods           # 🔜 Period 관리 (개발 예정)
/admin/content/footer            # ✅ Footer 관리 (완료)
/admin/content/history           # ✅ 별빛 아카이브 관리 (완료)
```

**완료된 관리자 페이지**: 8개
- hero, timeline-intro, marquee, footer, history
- periods (목록), periods/[id]/edit (편집), periods/[id]/highlights (Highlight 관리)

**개발 대기 중**: 1개 (history-story)

### CMS 개발 규칙

#### ✅ 허용되는 작업

1. **관리자 페이지 개발**
   - CRUD 기능 구현
   - 이미지 업로드 기능
   - 텍스트 편집 기능
   - 순서 변경 기능

2. **Firestore 연동**
   - Collection 생성
   - CRUD 함수 작성
   - Security Rules 설정
   - 초기 데이터 마이그레이션

3. **메인 페이지 데이터 연동**
   - Firestore에서 데이터 로드
   - Fallback 데이터 제공
   - 로딩 상태 처리

#### ❌ 금지되는 작업

1. **구조 변경**
   - 컴포넌트 순서 변경
   - 레이아웃 수정
   - 애니메이션 로직 변경 (콘텐츠 변경은 OK)

2. **하드코딩 유지**
   - 새로운 콘텐츠를 하드코딩으로 추가
   - CMS를 우회하여 직접 수정

### Fallback 전략

모든 CMS 콘텐츠는 **Fallback 데이터**를 제공해야 합니다:

```typescript
// 예시: HeroSection
const fallbackHero = {
  backgroundImage: '...',
  badgeText: 'THE 90TH ANNIVERSARY',
  mainTitle: '90',
  mainSubtitle: 'YEARS OF HISTORY',
  subtitle: '1936 - 2026'
};

// Firestore 오류 시 Fallback 사용
const data = await getHeroContent() || fallbackHero;
```

### 초기 데이터 마이그레이션

하드코딩된 데이터를 Firestore로 이전하는 마이그레이션 스크립트를 제공합니다:

```bash
# ✅ 완료된 마이그레이션 스크립트
npm run migrate:hero              # ✅ HeroSection 마이그레이션 (완료)
npm run migrate:footer            # ✅ Footer 마이그레이션 (완료)
npm run migrate:marquee           # ✅ Marquee 마이그레이션 (완료)
npm run migrate:timeline-intro    # ✅ TimelineIntro 마이그레이션 (완료)

# ✅ 완료된 마이그레이션 스크립트 (추가)
npm run migrate:periods           # ✅ Periods & Highlights 마이그레이션 (완료)

# 🔜 개발 예정 마이그레이션 스크립트
npm run migrate:history-story     # 🔜 HistoryStory 마이그레이션 (개발 예정)

# 통합 마이그레이션 (완료된 것만 실행)
npm run migrate:all               # 현재: hero + footer + marquee + timeline-intro + periods
```

**주의**: `migrate:all`은 현재 완료된 5개 모듈을 마이그레이션합니다. HistoryStory는 CMS 개발 후 추가됩니다.

### 참고 문서

- **CMS 개발 계획**: `docs/CMS_Development_Plan.md`
- **PRD**: `docs/PRD_SHU_90th_Anniversary.md`
- **TRD**: `docs/TRD_SHU_90th_Anniversary.md`

---

**이 규칙은 프로젝트의 일관성과 원본 디자인 의도를 보호하기 위한 필수 규칙입니다.**


---

## 📋 개발 히스토리 작성 규칙

### 필수 사항

**모든 작업 완료 시마다 `docs/DEVELOPMENT-HISTORY.md` 파일을 업데이트해야 합니다.**

### 작성 형식

```markdown
## YYYY-MM-DD

### HH:MM - 작업 제목

**변경 내용:**
- 구체적인 변경 사항 나열

**목적:**
- 왜 이 작업을 했는지

**결과:**
- 어떤 효과가 있었는지

**커밋:** {커밋 해시}
```

### 작성 규칙

1. **최신 항목이 상단에 위치**
   - 새로운 작업은 파일 맨 위에 추가

2. **일자별 섹션 구분**
   - `## YYYY-MM-DD` 형식으로 날짜 구분

3. **시간별 작업 구분**
   - `### HH:MM - 작업 제목` 형식으로 시간 표시

4. **상세한 내용 기록**
   - 변경 내용: 무엇을 바꿨는지
   - 목적: 왜 바꿨는지
   - 결과: 어떤 효과가 있었는지
   - 커밋: Git 커밋 해시

5. **누적 방식**
   - 기존 내용 삭제 금지
   - 항상 추가만 함

### 작성 시점

- ✅ Git 커밋 & 푸시 완료 직후
- ✅ 중요한 작업 완료 시
- ✅ 사용자에게 작업 보고 시

### 작성 금지 사항

- ❌ 기존 히스토리 수정/삭제
- ❌ 날짜 순서 변경
- ❌ 불완전한 정보 기록

### 목적

- 전체적인 개발 진행 상황 추적
- 맥락 유지 및 이해
- 향후 참고 자료
- 문제 발생 시 이력 추적

---

**이 규칙은 프로젝트의 개발 이력을 체계적으로 관리하기 위한 필수 규칙입니다.**

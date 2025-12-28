# 관리자 페이지 콘텐츠 구조 규칙

> **중요**: 이 문서는 관리자 대시보드의 필수 구조를 정의합니다. 개발 시 반드시 준수해야 합니다.

## 📋 대시보드 섹션 구조

관리자 대시보드(`/admin/dashboard`)는 다음 섹션들로 구성되어야 합니다:

### 1. 콘텐츠 관리
일반적인 게시물/정보 관리

- 뉴스 관리 (`/admin/content/news`)
- 이벤트 관리 (`/admin/content/events`)
- 방명록 관리 (`/admin/content/guestbook`)
- 사연 관리 (`/admin/content/stories`)
- 뉴스레터 구독자 (`/admin/content/subscribers`)
- 타임라인 관리 (`/admin/content/timeline`)

### 2. **서브페이지 콘텐츠** ⭐ **필수**
**프론트엔드 서브 메뉴와 1:1 대응되는 독립 관리 페이지**

#### ✅ 반드시 포함되어야 할 항목:

1. **명장면 90** (`/admin/content/highlights`)
   - 이미지 업로드, 설명 텍스트, 연도 태그 입력
   - ImageUpload 컴포넌트 필수
   - DB: Period별 highlights subcollection

2. **영상으로 보는 90** (`/admin/content/videos`)
   - 유튜브 링크/비디오 파일, 썸네일, 제목, 설명
   - ImageUpload 컴포넌트 필수
   - DB: `homepage_videos` collection

3. **숫자로 보는 90** (`/admin/content/statistics`)
   - 숫자(Count), 라벨(설명), 아이콘 선택
   - DB: `homepage_statistics` document

4. **역사 갤러리** (`/admin/content/history`)
   - 다중 이미지 업로드, 갤러리 카테고리/시대 분류, 설명
   - ImageUpload 컴포넌트 필수
   - DB: `homepage_history` collection

#### 🚨 주의사항:
- **"서브페이지 콘텐츠" 섹션은 대시보드에서 독립된 그룹으로 표시**
- **19.png 캡처 이미지 참조**: 주황색 테두리로 강조 표시
- Period 관리 내부에 숨겨두지 말 것
- 각 항목은 독립적으로 접근 가능해야 함

### 3. 미디어
- 미디어 라이브러리 (`/admin/media`)

### 4. 홈페이지 CMS
메인 페이지 구성 요소 관리

- Hero 섹션 (`/admin/content/hero`)
- Timeline Intro (`/admin/content/timeline-intro`)
- Marquee (`/admin/content/marquee`)
- 6단계 역사 (`/admin/content/periods`)
- Footer (`/admin/content/footer`)

### 5. 시스템
- 초기 데이터 설정 (`/admin/content/setup`)
- 설정 (`/admin/settings`)

## 🔧 ImageUpload 컴포넌트 사용

모든 이미지 업로드는 `@/components/admin/ImageUpload` 컴포넌트를 사용해야 합니다.

### 기본 사용법:

\`\`\`tsx
import { ImageUpload } from '@/components/admin/ImageUpload';

<ImageUpload
  value={formData.thumb}
  onChange={(url) => setFormData((prev) => ({ ...prev, thumb: url }))}
  label="썸네일 이미지"
  path="highlights"  // Firebase Storage 경로
  required
/>
\`\`\`

### 기능:
- ✅ 드래그 앤 드롭
- ✅ 파일 선택 클릭
- ✅ Firebase Storage 자동 업로드
- ✅ 업로드 진행률 표시
- ✅ 이미지 미리보기
- ✅ URL 직접 입력 옵션

## 📁 Firestore 데이터 구조

### Highlights (명장면 90)
```
homepage_periods/{periodId}/highlights/{highlightId}
{
  order: number,
  title: string,
  year: string,
  thumb: string,
  description: string,
  enabled: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Videos (영상으로 보는 90)
```
homepage_videos/{videoId}
{
  title: string,
  description: string,
  videoUrl: string,
  thumbnail: string,
  duration: string,
  enabled: boolean,
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Statistics (숫자로 보는 90)
```
homepage_content/statistics
{
  stats: [
    { number: string, label: string, icon?: string }
  ],
  milestones: [...],
  detailStats: [...]
}
```

### History (역사 갤러리)
```
homepage_history/{historyId}
{
  title: string,
  year: number,
  category: string,
  content: string,
  mainImage: string,
  enabled: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## ✅ 체크리스트

새로운 서브페이지 콘텐츠 추가 시:

- [ ] `/admin/content/{name}/page.tsx` 생성
- [ ] Firestore CRUD 함수 생성 (`/lib/firestore/admin/{name}.ts`)
- [ ] ImageUpload 컴포넌트 통합 (이미지 필요 시)
- [ ] 대시보드에 "서브페이지 콘텐츠" 섹션에 링크 추가
- [ ] 라우트 상수 추가 (`/lib/constants/routes.ts`)
- [ ] 테스트 (로그인 → 목록 → 추가 → 수정 → 삭제)

## 🔍 검증

개발 완료 후 반드시 확인:

1. **대시보드 확인**
   - "서브페이지 콘텐츠" 섹션이 있는가?
   - 4개 항목(명장면, 영상, 숫자, 역사)이 모두 있는가?

2. **각 페이지 확인**
   - 목록 조회 정상 작동
   - 추가/수정 폼에 ImageUpload 있는가?
   - 삭제 기능 작동

3. **이미지 업로드 확인**
   - 드래그 앤 드롭 작동
   - 파일 선택 작동
   - Firebase Storage 업로드 성공
   - 미리보기 표시

## 📝 참고 파일

- **대시보드**: `src/app/admin/dashboard/page.tsx`
- **명장면 90 예시**: `src/app/admin/content/highlights/page.tsx`
- **ImageUpload 컴포넌트**: `src/components/admin/ImageUpload.tsx`
- **캡처 이미지**: `19.png` (요구사항 참조용)

---

**마지막 업데이트**: 2025-12-28
**작성자**: Claude
**버전**: 1.0.0

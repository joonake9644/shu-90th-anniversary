# CMS 이미지 관리 표준 규칙

> **작성일:** 2025-12-30
> **목적:** CMS 전체 페이지의 이미지 관리 방식 통일 및 중복 코드 방지

---

## 🎯 핵심 원칙

### ✅ **모든 CMS 페이지는 ImageUpload 컴포넌트를 사용해야 함**

**이유:**
1. 일관된 사용자 경험
2. 자동 Firebase Storage 업로드
3. 드래그 앤 드롭 지원
4. 실시간 미리보기
5. 진행률 표시
6. URL 직접 입력 옵션

---

## 📁 데이터 흐름 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                CMS 이미지 업로드 플로우                        │
└─────────────────────────────────────────────────────────────┘

1. 관리자가 이미지 드래그 앤 드롭 (또는 클릭)
   ↓
2. ImageUpload 컴포넌트가 자동으로 Firebase Storage에 업로드
   경로: /{path}/{timestamp}_{filename}
   예: /hero/1735545600000_background.jpg
   ↓
3. 업로드 완료 후 Download URL 생성
   ↓
4. onChange 콜백으로 URL이 formData에 자동 저장
   ↓
5. "저장하기" 버튼 클릭
   ↓
6. Firestore에 URL 저장 (실제 이미지는 Storage에 있음)


┌─────────────────────────────────────────────────────────────┐
│                  데이터 저장 구조                              │
└─────────────────────────────────────────────────────────────┘

Firestore (데이터베이스):
  ├── homepage_hero          # Hero Section 콘텐츠
  │   └── backgroundImage: "https://storage.../hero/123.jpg"
  ├── homepage_periods       # 연대별 정보
  │   └── [periodId]
  │       └── highlights     # 서브컬렉션
  │           └── thumb: "https://storage.../highlights/456.jpg"
  ├── homepage_news          # 뉴스
  │   └── thumbnail: "https://storage.../news/789.jpg"
  └── homepage_events        # 이벤트
      └── image: "https://storage.../events/012.jpg"

Firebase Storage:
  ├── hero/              # Hero Section 배경 이미지
  ├── highlights/        # 명장면 90 썸네일
  ├── news/             # 뉴스 썸네일
  ├── events/           # 이벤트 이미지
  ├── videos/           # 동영상 파일
  ├── history/          # 역사 이미지
  └── uploads/          # 기타 업로드
```

---

## 🔧 ImageUpload 컴포넌트 사용법

### **표준 사용 패턴:**

```typescript
import { ImageUpload } from '@/components/admin/ImageUpload';

// 컴포넌트 내부
const [formData, setFormData] = useState({
  imageUrl: '', // 이미지 URL 필드
  // ... 기타 필드
});

// JSX
<ImageUpload
  value={formData.imageUrl}
  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
  label="이미지 레이블"
  path="folder-name"  // Storage 폴더명
  required={true}     // 필수 여부 (선택)
/>
```

### **Storage 경로 규칙:**

| CMS 페이지 | path 파라미터 | Storage 경로 |
|-----------|--------------|-------------|
| Hero Section | `"hero"` | `/hero/` |
| 명장면 90 (Highlights) | `"highlights"` | `/highlights/` |
| 뉴스 | `"news"` | `/news/` |
| 이벤트 | `"events"` | `/events/` |
| 역사 | `"history"` | `/history/` |
| 동영상 | `"videos"` | `/videos/` |
| 기타 | `"uploads"` | `/uploads/` |

---

## 📝 CMS 페이지별 구현 상태

### ✅ **올바르게 구현된 페이지:**

| 페이지 | 파일 경로 | ImageUpload 사용 | 확인일 |
|-------|----------|----------------|--------|
| 뉴스 작성 | `/admin/content/news/new/page.tsx` | ✅ (라인 179) | 2025-12-30 |
| 이벤트 작성 | `/admin/content/events/new/page.tsx` | ✅ (라인 8) | 2025-12-30 |
| 명장면 90 | `/admin/content/periods/[id]/highlights/page.tsx` | ✅ (라인 255-261) | 2025-12-30 |

### ❌ **수정 필요한 페이지:**

| 페이지 | 파일 경로 | 현재 방식 | 수정 예정 |
|-------|----------|---------|----------|
| Hero Section | `/admin/content/hero/page.tsx` | ❌ URL 직접 입력 (라인 167-174) | ✅ ImageUpload로 변경 |

---

## ⚠️ 절대 하지 말아야 할 것

### ❌ **잘못된 패턴:**

```typescript
// ❌ 잘못된 방법: URL 직접 입력만 지원
<input
  type="url"
  value={formData.backgroundImage}
  onChange={(e) => handleChange('backgroundImage', e.target.value)}
  placeholder="https://..."
/>
```

### ✅ **올바른 패턴:**

```typescript
// ✅ 올바른 방법: ImageUpload 컴포넌트 사용
<ImageUpload
  value={formData.backgroundImage}
  onChange={(url) => handleChange('backgroundImage', url)}
  label="배경 이미지"
  path="hero"
  required
/>
```

---

## 🎨 ImageUpload 컴포넌트 기능

### **자동 제공 기능:**
1. ✅ 드래그 앤 드롭 업로드
2. ✅ 클릭하여 파일 선택
3. ✅ Firebase Storage 자동 업로드
4. ✅ 업로드 진행률 표시
5. ✅ 이미지 미리보기
6. ✅ 이미지 변경 버튼
7. ✅ 이미지 제거 버튼
8. ✅ URL 직접 입력 옵션 (외부 CDN 등)
9. ✅ 파일 유효성 검사 (10MB 제한)
10. ✅ 에러 메시지 표시

### **사용자 경험:**
- 파일 크기: 최대 10MB
- 지원 포맷: PNG, JPG, GIF, WebP
- 업로드 속도: 진행률 실시간 표시
- 미리보기: 즉시 확인 가능

---

## 🚫 중복 코드 방지 규칙

### **1. 이미지 업로드 로직을 직접 구현하지 말 것**
- ImageUpload 컴포넌트가 이미 모든 기능을 제공
- Storage 업로드, 진행률, 에러 처리 등 모두 포함

### **2. URL 입력만 제공하지 말 것**
- ImageUpload는 URL 직접 입력도 지원 (하단 옵션)
- 드래그 앤 드롭과 URL 입력을 **모두** 제공

### **3. 미디어 라이브러리를 별도로 만들지 말 것**
- `/admin/media` 페이지가 이미 존재
- 중앙 집중식 미디어 관리

---

## 📊 성능 최적화

### **이미지 최적화 권장사항:**
1. 업로드 전 이미지 압축 (TinyPNG 등)
2. WebP 포맷 사용 권장
3. 배경 이미지: 최대 2000px 너비
4. 썸네일: 최대 800px 너비

### **Storage 용량 관리:**
- 사용하지 않는 이미지는 `/admin/media`에서 삭제
- 정기적인 Storage 정리 권장

---

## 📅 변경 이력

| 날짜 | 변경 내용 | 작업자 |
|------|----------|--------|
| 2025-12-30 | CMS 이미지 관리 표준 규칙 작성 | Claude |
| 2025-12-30 | Hero 페이지 ImageUpload 적용 예정 | Claude |

---

## 🔗 관련 파일

- **ImageUpload 컴포넌트**: `/src/components/admin/ImageUpload.tsx`
- **Firebase 설정**: `/src/lib/firebase.ts`
- **미디어 라이브러리**: `/src/app/admin/media/page.tsx`

---

## 💡 참고사항

이 문서는 CMS 개발 시 **필수 준수 사항**입니다.
새로운 CMS 페이지 추가 시 반드시 이 규칙을 따라야 합니다.

**중요:** Hero 페이지 수정 작업은 이 문서 작성 직후 진행됩니다.

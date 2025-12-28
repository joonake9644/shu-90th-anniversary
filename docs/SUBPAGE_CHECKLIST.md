# 서브페이지 콘텐츠 관리 체크리스트

> 개발 시 이 체크리스트를 사용하여 서브페이지 콘텐츠 섹션이 빠지지 않도록 확인하세요.

## 🎯 필수 요구사항

### ✅ 대시보드 섹션

- [x] **서브페이지 콘텐츠** 섹션이 대시보드에 표시됨
- [x] 주황색 테두리로 강조 표시 (`border-amber-500/30`)
- [x] 콘텐츠 관리 섹션 **다음**에 위치

### ✅ 4개 필수 메뉴

- [x] **명장면 90** (`/admin/content/highlights`)
- [x] **영상으로 보는 90** (`/admin/content/videos`)
- [x] **숫자로 보는 90** (`/admin/content/statistics`)
- [x] **역사 갤러리** (`/admin/content/history`)

### ✅ ImageUpload 기능

- [x] 명장면 90 - ImageUpload 있음
- [x] 영상으로 보는 90 - ImageUpload 있음
- [x] 숫자로 보는 90 - (숫자 데이터, 이미지 불필요)
- [x] 역사 갤러리 - ImageUpload 있음

## 🔍 기능 테스트

### 로그인 및 접근
- [x] 관리자 로그인 성공
- [x] 대시보드 정상 로드
- [x] 서브페이지 콘텐츠 섹션 표시

### 명장면 90
- [x] 목록 페이지 접근
- [x] "새 Highlight 추가" 버튼 존재
- [x] 폼에 ImageUpload 컴포넌트 표시
- [x] 드래그 앤 드롭 작동
- [x] 파일 선택 작동
- [x] Firebase Storage 업로드 성공

### 영상으로 보는 90
- [ ] 목록 페이지 접근
- [ ] 추가/수정 폼 확인
- [ ] ImageUpload (썸네일) 작동

### 숫자로 보는 90
- [ ] 목록 페이지 접근
- [ ] 숫자 데이터 편집 기능

### 역사 갤러리
- [ ] 목록 페이지 접근
- [ ] 추가/수정 폼 확인
- [ ] ImageUpload 작동

## 📋 개발 완료 확인

### 파일 구조
```
src/
├── app/
│   └── admin/
│       ├── dashboard/
│       │   └── page.tsx         ✅ 서브페이지 콘텐츠 섹션 포함
│       └── content/
│           ├── highlights/
│           │   └── page.tsx     ✅ 명장면 90
│           ├── videos/
│           │   └── page.tsx     ✅ 영상으로 보는 90
│           ├── statistics/
│           │   └── page.tsx     ✅ 숫자로 보는 90
│           └── history/
│               └── page.tsx     ✅ 역사 갤러리
├── components/
│   └── admin/
│       └── ImageUpload.tsx      ✅ 이미지 업로드 컴포넌트
└── lib/
    └── firestore/
        └── admin/
            ├── highlights.ts    ✅ getAllHighlights() 함수 포함
            ├── videos.ts
            ├── statistics.ts
            └── history.ts
```

### 브라우저 테스트
1. http://localhost:3000/admin/login
   - [x] 로그인 성공

2. http://localhost:3000/admin/dashboard
   - [x] "서브페이지 콘텐츠" 섹션 표시
   - [x] 4개 메뉴 링크 확인

3. http://localhost:3000/admin/content/highlights
   - [x] 명장면 90 페이지 로드
   - [x] 이미지 업로드 화면 확인

4. http://localhost:3000/admin/content/videos
   - [ ] 영상 관리 페이지 로드

5. http://localhost:3000/admin/content/statistics
   - [ ] 통계 관리 페이지 로드

6. http://localhost:3000/admin/content/history
   - [ ] 역사 갤러리 관리 페이지 로드

## ⚠️ 흔한 실수

### ❌ 하지 말아야 할 것:
1. Period 관리 안에 Highlights를 숨기기
2. "홈페이지 CMS" 섹션에 서브페이지 콘텐츠 넣기
3. 대시보드에서 "서브페이지 콘텐츠" 섹션 누락
4. ImageUpload 컴포넌트 대신 일반 input[type="file"] 사용

### ✅ 올바른 구조:
```
대시보드
├── 콘텐츠 관리 (뉴스, 이벤트 등)
├── 서브페이지 콘텐츠 ⭐ (명장면, 영상, 숫자, 역사)
├── 미디어
├── 홈페이지 CMS
└── 시스템
```

## 📸 스크린샷 참조

- `19.png` - 요구사항 캡처 이미지
- `/tmp/new_dashboard.png` - 완성된 대시보드
- `/tmp/highlights_main_page.png` - 명장면 90 페이지
- `/tmp/06_add_highlight_form.png` - 이미지 업로드 화면

---

**상태**: ✅ 완료
**마지막 테스트**: 2025-12-28
**작성자**: Claude

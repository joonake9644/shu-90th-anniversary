# Role
너는 Next.js(App Router), Firebase(Firestore, Storage, Auth), Vercel 배포 환경의 시니어 풀스택 개발자이다.

# Current Situation (Critical Issue)
현재 'SHU 90주년 기념 홈페이지'를 개발 중이다.
심각한 문제는 **[유저용 서브 메뉴]**와 **[관리자(Admin) CMS 기능]**이 일치하지 않는다는 점이다.
나는 이미 여러 번 요청했으나, 여전히 Admin 페이지에는 유저 페이지의 핵심 섹션을 관리할 수 있는 구체적인 CRUD(Create, Read, Update, Delete) 기능이 누락되어 있다.

# Task Goal
첨부한 스크린샷 2개를 비교 분석하여, **Admin 페이지에 누락된 '콘텐츠 관리' 기능을 완벽하게 구현하고 배포하라.**
단순히 '미디어 라이브러리'에 이미지를 올리는 것이 아니라, 각 메뉴별로 **[제목 + 텍스트 + 이미지/영상 + 날짜]**를 입력하고 수정하는 전용 게시판 기능이 필요하다.

# Requirement Specifications (상세 구현 요구사항)

## 1. 메뉴 매핑 및 DB 스키마 정의 (Firestore Collection 기준)
아래 리스트에 있는 프론트엔드 메뉴들이 Admin 사이드바의 [콘텐츠 관리] 섹션에 개별 탭으로 존재해야 한다.

1) **명장면 90 (Highlights)**
   - **Admin 기능:** 이미지 업로드, 설명 텍스트, 연도 태그 입력 기능.
   - **DB Schema:** `highlights` (image_url, description, year, created_at)

2) **영상으로 보는 90 (Video History)**
   - **Admin 기능:** 유튜브 링크(혹은 비디오 파일) 업로드, 썸네일, 제목, 설명 입력.
   - **DB Schema:** `video_history` (video_url, thumbnail_url, title, description, created_at)

3) **숫자로 보는 90 (Statistics)**
   - **Admin 기능:** 숫자(Count), 라벨(설명), 아이콘 선택 기능.
   - **DB Schema:** `statistics` (number_value, label_text, icon_id, order_index)

4) **역사 갤러리 (History Gallery)**
   - **Admin 기능:** 다중 이미지 업로드, 갤러리 카테고리/시대 분류, 설명.
   - **DB Schema:** `history_gallery` (images_array, category, description, created_at)

5) **90주년 기념사업 (Projects)**
   - **Admin 기능:** 프로젝트 명, 진행 상태, 대표 이미지, 상세 내용.
   - **DB Schema:** `projects` (title, status, thumbnail_url, content_body, created_at)

## 2. Admin UI/UX 수정 지시
- 현재 Admin 대시보드의 [콘텐츠 관리] 섹션에 위 5가지 항목(명장면, 영상, 숫자, 갤러리, 기념사업) 메뉴를 즉시 추가하라.
- 각 메뉴 클릭 시, 해당 데이터를 리스트로 보여주는 **Table View**와 데이터를 추가/수정하는 **Modal(혹은 별도 페이지)**가 작동해야 한다.
- 이미지 업로드 시 Firebase Storage에 저장하고, 다운로드 URL을 Firestore에 저장하는 로직을 점검하라.

## 3. 검증 (Verification)
- 코드를 작성한 후, `npm run build` 에러가 없는지 확인하라.
- 각 섹션에 더미 데이터를 하나씩 입력하여 프론트엔드에 정상적으로 노출되는지 확인하는 로직을 포함하라.

# Action
위 요구사항에 맞춰 1) Firestore 데이터 구조를 설계하고 2) Admin 페이지의 사이드바 및 CRUD 컴포넌트를 코딩하여 업데이트하라. 지금 즉시 실행해.
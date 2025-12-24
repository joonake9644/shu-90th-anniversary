# Firebase Firestore Rules & Indexes 배포 가이드

## 🚀 배포 단계

### Step 1: Firebase 로그인

터미널(PowerShell 또는 CMD)을 열고 프로젝트 폴더로 이동:

```bash
cd "C:\Users\user\Downloads\100주년 기념 홈페이지 제작89"
```

Firebase 로그인:

```bash
firebase login
```

- 브라우저가 자동으로 열립니다
- Google 계정으로 로그인 (Firebase 프로젝트가 있는 계정)
- 권한 승인 후 터미널로 돌아오면 성공

---

### Step 2: Firebase 프로젝트 초기화 및 선택

현재 프로젝트가 이미 설정되어 있는지 확인:

```bash
firebase projects:list
```

프로젝트 선택:

```bash
firebase use shu-90th-anniversary
```

---

### Step 3: Firestore Rules 및 Indexes 배포

**Option A: Rules와 Indexes 모두 배포 (권장)**

```bash
firebase deploy --only firestore
```

**Option B: Rules만 배포**

```bash
firebase deploy --only firestore:rules
```

**Option C: Indexes만 배포**

```bash
firebase deploy --only firestore:indexes
```

---

### Step 4: 배포 확인

배포가 완료되면 다음과 같은 메시지가 표시됩니다:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/shu-90th-anniversary/overview
```

Firebase Console에서 확인:

1. https://console.firebase.google.com/project/shu-90th-anniversary/firestore
2. **Rules** 탭에서 배포된 규칙 확인
3. **Indexes** 탭에서 인덱스 상태 확인

---

### Step 5: 실제 데이터 테스트

#### 5.1 방명록 작성 테스트

1. 브라우저에서 접속: https://shu-90th-anniversary.vercel.app/guestbook
2. 방명록 작성 폼에 데이터 입력:
   - 이름: `홍길동`
   - 졸업 연도: `2020`
   - 전공: `간호학과`
   - 메시지: `90주년 축하합니다!`
3. **작성하기** 버튼 클릭
4. 성공 메시지 확인: "방명록이 성공적으로 등록되었습니다"

#### 5.2 방명록 조회 테스트

1. 페이지를 새로고침 (F5)
2. 방금 작성한 방명록이 목록에 표시되는지 확인
3. **최신순** / **인기순** 정렬 버튼 테스트
4. 졸업 연도 필터 테스트

#### 5.3 좋아요 기능 테스트

1. 방명록 카드의 하트(♥) 아이콘 클릭
2. 좋아요 숫자가 증가하는지 확인
3. 페이지 새로고침 후에도 좋아요가 유지되는지 확인
4. 같은 항목에 다시 좋아요 클릭 시 중복 방지 메시지 확인

#### 5.4 Firebase Console에서 데이터 확인

1. https://console.firebase.google.com/project/shu-90th-anniversary/firestore/data
2. **guestbook** 컬렉션 클릭
3. 저장된 문서 데이터 확인:
   ```json
   {
     "name": "홍길동",
     "graduationYear": 2020,
     "major": "간호학과",
     "message": "90주년 축하합니다!",
     "isAnonymous": false,
     "likes": 0,
     "approved": true,
     "createdAt": "Timestamp...",
     "updatedAt": "Timestamp..."
   }
   ```

---

## 🔧 문제 해결

### 문제 1: "Permission denied" 에러

**원인:** Firebase 프로젝트에 대한 권한이 없음

**해결:**
1. Firebase Console에서 프로젝트 설정 확인
2. IAM 및 관리자 > IAM에서 사용자 권한 확인
3. "Firebase Admin" 또는 "Editor" 역할 필요

### 문제 2: "Index required" 에러

**원인:** 복합 쿼리를 위한 인덱스가 없음

**해결:**
```bash
firebase deploy --only firestore:indexes
```

또는 Firebase Console에서 자동 생성되는 링크 클릭

### 문제 3: 방명록 작성 시 "Permission denied" 에러

**원인:** Security Rules가 배포되지 않았거나 잘못 설정됨

**해결:**
```bash
firebase deploy --only firestore:rules
```

브라우저 개발자 도구(F12) > Console에서 정확한 에러 메시지 확인

### 문제 4: 데이터가 표시되지 않음

**원인:**
- Firestore에 데이터가 없음
- Security Rules가 읽기를 차단함
- 네트워크 오류

**해결:**
1. Firebase Console에서 데이터 존재 여부 확인
2. Rules 탭에서 읽기 권한 확인
3. 브라우저 개발자 도구 > Network 탭에서 요청 확인

---

## 📊 배포 후 체크리스트

- [ ] Firebase 로그인 성공
- [ ] 프로젝트 선택 성공 (shu-90th-anniversary)
- [ ] Firestore Rules 배포 완료
- [ ] Firestore Indexes 배포 완료
- [ ] 방명록 작성 테스트 성공
- [ ] 방명록 조회 테스트 성공
- [ ] 좋아요 기능 테스트 성공
- [ ] Firebase Console에서 데이터 확인 완료

---

## 🎯 다음 단계

배포가 성공적으로 완료되면:

1. **실제 콘텐츠 추가**
   - 실제 역사 사진 및 데이터 업로드
   - Firebase Storage에 이미지 저장

2. **감성 효과 추가**
   - 배경 음악 플레이어
   - 사운드 효과
   - 파티클 효과

3. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - Lighthouse 점수 개선

4. **관리자 기능 추가** (선택)
   - 방명록 승인/거부 시스템
   - 통계 대시보드
   - 콘텐츠 관리 시스템

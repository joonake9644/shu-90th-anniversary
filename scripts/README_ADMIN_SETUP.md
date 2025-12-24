# Firebase 관리자 계정 생성 가이드

## ⚠️ 사전 준비 (반드시 필요)

### 1. Firebase Console에서 Email/Password 활성화

**이 단계는 반드시 Firebase Console에서 수동으로 해야 합니다 (CLI 불가)**

1. Firebase Console 접속:
   ```
   https://console.firebase.google.com/project/shu-90th-anniversary/authentication/providers
   ```

2. "Email/Password" 클릭

3. "Enable" 토글을 ON으로 변경

4. "Save" 버튼 클릭

---

## 🔧 Service Account 키 다운로드

1. Firebase Console 접속:
   ```
   https://console.firebase.google.com/project/shu-90th-anniversary/settings/serviceaccounts/adminsdk
   ```

2. "Generate new private key" 버튼 클릭

3. 다운로드된 JSON 파일을 프로젝트 루트에 저장
   - 파일명 예: `serviceAccountKey.json`
   - ⚠️ 절대 Git에 커밋하지 마세요!

---

## 📝 관리자 계정 생성 실행

### Windows (CMD)
```cmd
# 1. 환경변수 설정
set FIREBASE_SERVICE_ACCOUNT=serviceAccountKey.json

# 2. 스크립트 실행
node scripts/create-admin-user.js
```

### Windows (PowerShell)
```powershell
# 1. 환경변수 설정
$env:FIREBASE_SERVICE_ACCOUNT="serviceAccountKey.json"

# 2. 스크립트 실행
node scripts/create-admin-user.js
```

### macOS/Linux
```bash
# 1. 환경변수 설정
export FIREBASE_SERVICE_ACCOUNT=serviceAccountKey.json

# 2. 스크립트 실행
node scripts/create-admin-user.js
```

---

## 💬 실행 예시

```
✅ Firebase Admin SDK 초기화 완료

관리자 이메일: admin@shu.ac.kr
비밀번호 (최소 6자): ********
표시 이름 (선택, Enter로 건너뛰기): 관리자

✅ 관리자 계정 생성 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자 UID: AbCdEfGhIjKlMnOpQrSt
이메일: admin@shu.ac.kr
표시 이름: 관리자
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

로그인 테스트:
https://shu-90th-anniversary.vercel.app/admin/login
```

---

## 🧪 로그인 테스트

1. 관리자 페이지 접속:
   ```
   https://shu-90th-anniversary.vercel.app/admin/login
   ```

2. 생성한 이메일/비밀번호로 로그인

3. 성공 시 대시보드로 이동:
   ```
   https://shu-90th-anniversary.vercel.app/admin/dashboard
   ```

---

## ❗ 주의사항

1. **serviceAccountKey.json 보안**
   - 절대 Git에 커밋하지 마세요
   - .gitignore에 이미 추가되어 있음
   - 다른 사람과 공유하지 마세요

2. **Email/Password 활성화 필수**
   - CLI로는 불가능, Console에서 반드시 수동으로 활성화

3. **비밀번호 강도**
   - 최소 6자 이상
   - 안전한 비밀번호 사용 권장

---

## 🔄 대안: Firebase Console에서 직접 생성

스크립트가 복잡하다면 Firebase Console에서 직접 생성:

1. https://console.firebase.google.com/project/shu-90th-anniversary/authentication/users

2. "Add user" 버튼 클릭

3. 이메일/비밀번호 입력

4. 완료!

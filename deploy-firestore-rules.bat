@echo off
echo ========================================
echo Firebase Firestore Rules 배포 스크립트
echo ========================================
echo.

echo [1/3] Firebase 로그인...
call firebase login

echo.
echo [2/3] Firebase 프로젝트 선택...
call firebase use shu-90th-anniversary

echo.
echo [3/3] Firestore Rules 배포...
call firebase deploy --only firestore:rules

echo.
echo ========================================
echo 배포 완료!
echo ========================================
pause

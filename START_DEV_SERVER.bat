@echo off
echo ========================================
echo 개발 서버 시작 스크립트
echo ========================================
echo.

echo [1/3] Obsidian이 포트 3000을 사용 중인지 확인...
netstat -ano | findstr ":3000" | findstr "LISTENING"
echo.

echo [2/3] 개발 서버를 시작합니다...
echo 만약 포트 충돌이 발생하면 Ctrl+C로 중단하고 Obsidian을 종료하세요.
echo.

echo [3/3] npm run dev 실행 중...
npm run dev

pause

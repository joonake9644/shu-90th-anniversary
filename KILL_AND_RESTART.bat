@echo off
chcp 65001 > nul
echo ========================================
echo 개발 서버 완전 재시작 스크립트
echo ========================================
echo.

echo [1/4] 모든 Node.js 프로세스 종료 중...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js 프로세스 종료 완료
) else (
    echo ℹ 실행 중인 Node.js 프로세스가 없습니다
)
echo.

echo [2/4] 포트 사용 확인...
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ⚠ 포트 3000이 여전히 사용 중입니다
) else (
    echo ✓ 포트 3000 사용 가능
)
echo.

echo [3/4] 3초 대기...
timeout /t 3 /nobreak > nul
echo.

echo [4/4] 개발 서버 시작...
echo ========================================
echo.
npm run dev

pause

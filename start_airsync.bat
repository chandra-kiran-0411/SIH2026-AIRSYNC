@echo off
title AirSync - Delhi NCR Air Intelligence Platform
echo ==========================================================
echo       AirSync - Smart India Hackathon 2026
echo ==========================================================
echo Starting AirSync Local Server...
echo.

cd /d "%~dp0"

:: Open browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the Next.js production server
call npm.cmd start

pause
